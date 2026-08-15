import { spokenFormForTts } from "@/lib/speech";
import { apiUrl } from "@/lib/apiBase";

const PCM_RATE = 24_000;
const MAX_CACHE = 64;
const GET_QUERY_LIMIT = 1800;
const PREFETCH_CONCURRENCY = 2;

type StreamState = {
  chunks: Uint8Array[];
  done: boolean;
  error: Error | null;
  listeners: Set<() => void>;
};

const completeCache = new Map<string, Uint8Array>();
const inflight = new Map<string, StreamState>();
const activeSources = new Set<AudioBufferSourceNode>();
const prefetchQueue: Array<{ key: string; spoken: string; lang: string }> = [];

let audioCtx: AudioContext | null = null;
let playGen = 0;
let unlocked = false;
let activePrefetch = 0;

function cacheKey(lang: string, spoken: string): string {
  return `${lang}:${spoken}`;
}

function notify(state: StreamState) {
  for (const listener of state.listeners) listener();
}

function remember(key: string, pcm: Uint8Array) {
  if (completeCache.has(key)) completeCache.delete(key);
  completeCache.set(key, pcm);
  while (completeCache.size > MAX_CACHE) {
    const oldest = completeCache.keys().next().value;
    if (oldest == null) break;
    completeCache.delete(oldest);
  }
}

function concatAll(chunks: readonly Uint8Array[]): Uint8Array {
  const total = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out;
}

function concatBytes(a: Uint8Array, b: Uint8Array): Uint8Array {
  if (a.byteLength === 0) return b;
  if (b.byteLength === 0) return a;
  const out = new Uint8Array(a.byteLength + b.byteLength);
  out.set(a, 0);
  out.set(b, a.byteLength);
  return out;
}

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

async function unlockAudio() {
  if (typeof window === "undefined") return;
  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    await ctx.resume();
  }
  if (unlocked) return;
  const buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start(0);
  unlocked = true;
}

function stopSources() {
  for (const source of activeSources) {
    try {
      source.stop();
    } catch {
      // already stopped
    }
  }
  activeSources.clear();
}

export function stopTts() {
  playGen += 1;
  stopSources();
}

function pcmToBuffer(ctx: AudioContext, pcm: Uint8Array): AudioBuffer | null {
  const even = pcm.byteLength & ~1;
  if (even < 2) return null;
  const samples = even / 2;
  const view = new DataView(pcm.buffer, pcm.byteOffset, even);
  const buffer = ctx.createBuffer(1, samples, PCM_RATE);
  const channel = buffer.getChannelData(0);
  for (let i = 0; i < samples; i++) {
    channel[i] = view.getInt16(i * 2, true) / 32768;
  }
  return buffer;
}

function schedulePcm(
  ctx: AudioContext,
  pcm: Uint8Array,
  nextStart: number,
): { nextStart: number; source: AudioBufferSourceNode | null } {
  const buffer = pcmToBuffer(ctx, pcm);
  if (!buffer) return { nextStart, source: null };
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  const startAt = Math.max(nextStart, ctx.currentTime);
  source.start(startAt);
  activeSources.add(source);
  source.onended = () => {
    activeSources.delete(source);
  };
  return { nextStart: startAt + buffer.duration, source };
}

function ttsUrl(spoken: string, lang: string): { url: string; init: RequestInit } {
  const params = new URLSearchParams({ text: spoken, lang });
  const query = params.toString();
  if (query.length < GET_QUERY_LIMIT) {
    return { url: apiUrl(`/api/tts?${query}`), init: { method: "GET" } };
  }
  return {
    url: apiUrl("/api/tts"),
    init: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: spoken, lang }),
    },
  };
}

function whenStreamSettles(state: StreamState): Promise<void> {
  if (state.done) {
    return state.error ? Promise.reject(state.error) : Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const listener = () => {
      if (!state.done) return;
      state.listeners.delete(listener);
      if (state.error) reject(state.error);
      else resolve();
    };
    state.listeners.add(listener);
  });
}

function pumpPrefetch() {
  while (activePrefetch < PREFETCH_CONCURRENCY && prefetchQueue.length > 0) {
    const job = prefetchQueue.shift();
    if (!job) break;
    if (completeCache.has(job.key) || inflight.has(job.key)) continue;
    activePrefetch += 1;
    const state = ensureStream(job.key, job.spoken, job.lang);
    void whenStreamSettles(state)
      .catch(() => undefined)
      .finally(() => {
        activePrefetch -= 1;
        pumpPrefetch();
      });
  }
}

function startNow(key: string, spoken: string, lang: string): StreamState {
  const index = prefetchQueue.findIndex((job) => job.key === key);
  if (index >= 0) prefetchQueue.splice(index, 1);
  return ensureStream(key, spoken, lang);
}

function ensureStream(key: string, spoken: string, lang: string): StreamState {
  const cached = completeCache.get(key);
  if (cached) {
    return {
      chunks: [cached],
      done: true,
      error: null,
      listeners: new Set(),
    };
  }
  const existing = inflight.get(key);
  if (existing) return existing;

  const state: StreamState = {
    chunks: [],
    done: false,
    error: null,
    listeners: new Set(),
  };
  inflight.set(key, state);

  void (async () => {
    try {
      const { url, init } = ttsUrl(spoken, lang);
      const res = await fetch(url, init);
      if (!res.ok) {
        throw new Error(`cloud TTS ${res.status}`);
      }
      if (!res.body) {
        const bytes = new Uint8Array(await res.arrayBuffer());
        state.chunks.push(bytes);
        remember(key, bytes);
        state.done = true;
        notify(state);
        return;
      }
      const reader = res.body.getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value && value.byteLength > 0) {
          state.chunks.push(value);
          notify(state);
        }
      }
      remember(key, concatAll(state.chunks));
      state.done = true;
      notify(state);
    } catch (error) {
      state.error =
        error instanceof Error ? error : new Error("TTS stream failed");
      state.done = true;
      notify(state);
    } finally {
      inflight.delete(key);
    }
  })();

  return state;
}

function waitForChunk(state: StreamState, index: number): Promise<void> {
  if (state.done || state.chunks.length > index) return Promise.resolve();
  return new Promise((resolve) => {
    const listener = () => {
      if (state.done || state.chunks.length > index) {
        state.listeners.delete(listener);
        resolve();
      }
    };
    state.listeners.add(listener);
  });
}

async function playPcmStream(state: StreamState, gen: number): Promise<void> {
  const ctx = getAudioContext();
  await ctx.resume();
  let chunkIndex = 0;
  let leftover = new Uint8Array(0);
  let nextStart = ctx.currentTime;
  let lastSource: AudioBufferSourceNode | null = null;

  while (gen === playGen) {
    while (chunkIndex < state.chunks.length) {
      const chunk = state.chunks[chunkIndex];
      chunkIndex += 1;
      const merged = concatBytes(leftover, chunk);
      const even = merged.byteLength & ~1;
      leftover =
        even < merged.byteLength ? merged.subarray(even) : new Uint8Array(0);
      if (even < 2) continue;
      const scheduled = schedulePcm(ctx, merged.subarray(0, even), nextStart);
      nextStart = scheduled.nextStart;
      if (scheduled.source) lastSource = scheduled.source;
    }
    if (state.error) throw state.error;
    if (state.done) break;
    await waitForChunk(state, chunkIndex);
  }

  if (gen !== playGen || !lastSource) return;

  await new Promise<void>((resolve) => {
    const finish = () => {
      if (gen !== playGen || getAudioContext().currentTime >= nextStart - 0.01) {
        resolve();
        return;
      }
      window.setTimeout(finish, 40);
    };
    lastSource.addEventListener("ended", () => resolve(), { once: true });
    finish();
  });
}

export function prefetchTts(text: string, lang: string) {
  const spoken = spokenFormForTts(text, lang);
  if (!spoken) return;
  const key = cacheKey(lang, spoken);
  if (completeCache.has(key) || inflight.has(key)) return;
  const queued = prefetchQueue.findIndex((job) => job.key === key);
  if (queued >= 0) prefetchQueue.splice(queued, 1);
  prefetchQueue.unshift({ key, spoken, lang });
  pumpPrefetch();
}

export async function playTts(text: string, lang: string): Promise<void> {
  const spoken = spokenFormForTts(text, lang);
  if (!spoken) return;
  stopTts();
  const gen = playGen;
  await unlockAudio();
  if (gen !== playGen) return;
  const key = cacheKey(lang, spoken);
  const state = startNow(key, spoken, lang);
  await playPcmStream(state, gen);
}
