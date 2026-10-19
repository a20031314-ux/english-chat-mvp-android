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
const prefetchQueue: Array<{ key: string; spoken: string; lang: string; voice?: string }> = [];

let audioCtx: AudioContext | null = null;
let playGen = 0;
let unlocked = false;
let activePrefetch = 0;

function cacheKey(lang: string, spoken: string, voice?: string): string {
  return voice ? `${lang}:${voice}:${spoken}` : `${lang}:${spoken}`;
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

/**
 * TS 5.7+ types Uint8Array as Uint8Array<ArrayBuffer> by default, while
 * subarray() is Uint8Array<ArrayBufferLike>. Copy into a real ArrayBuffer
 * so leftover stays assignable without changing PCM bytes.
 */
function remainderBytes(bytes: Uint8Array, start: number): Uint8Array<ArrayBuffer> {
  if (start >= bytes.byteLength) return new Uint8Array(0);
  const rest = new Uint8Array(bytes.byteLength - start);
  rest.set(bytes.subarray(start));
  return rest;
}

function getAudioContext(): AudioContext {
  // iOS: 통화에서 마이크가 열렸다 닫히면 오디오 세션이 바뀌면서 이 컨텍스트가 "interrupted"(또는 closed)로
  // 남는다. 그 위에서 resume()은 방해가 끝날 때까지 돌아오지 않아 튜터 목소리가 가끔 안 들렸다
  // (TestFlight 2.69, 2026-10-20). 그런 컨텍스트는 버리고 새로 만든다.
  const state = audioCtx?.state as string | undefined;
  if (audioCtx && (state === "closed" || state === "interrupted")) {
    stopSources();
    void audioCtx.close().catch(() => undefined);
    audioCtx = null;
    unlocked = false;
  }
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

/** 진단용: 튜터 목소리를 내는 오디오 컨텍스트 상태. */
export function ttsContextState(): string {
  return (audioCtx?.state as string | undefined) ?? "none";
}

/** resume()이 끝나지 않는 경우(iOS 방해 상태)에도 재생을 붙잡아 두지 않는다. */
function resumeBriefly(ctx: AudioContext): Promise<void> {
  return Promise.race([
    ctx.resume().catch(() => undefined),
    new Promise<void>((resolve) => window.setTimeout(resolve, 600)),
  ]);
}

async function unlockAudio() {
  if (typeof window === "undefined") return;
  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    await resumeBriefly(ctx);
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

/**
 * `voice` is a roleplay scene's own voice. Left out, the server speaks in the
 * call's voice for the language, which is what everything else wants.
 */
function ttsUrl(
  spoken: string,
  lang: string,
  voice?: string,
): { url: string; init: RequestInit } {
  const params = new URLSearchParams({ text: spoken, lang, ...(voice ? { voice } : {}) });
  const query = params.toString();
  if (query.length < GET_QUERY_LIMIT) {
    return { url: apiUrl(`/api/tts?${query}`), init: { method: "GET" } };
  }
  return {
    url: apiUrl("/api/tts"),
    init: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: spoken, lang, ...(voice ? { voice } : {}) }),
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
    const state = ensureStream(job.key, job.spoken, job.lang, job.voice);
    void whenStreamSettles(state)
      .catch(() => undefined)
      .finally(() => {
        activePrefetch -= 1;
        pumpPrefetch();
      });
  }
}

function startNow(key: string, spoken: string, lang: string, voice?: string): StreamState {
  const index = prefetchQueue.findIndex((job) => job.key === key);
  if (index >= 0) prefetchQueue.splice(index, 1);
  return ensureStream(key, spoken, lang, voice);
}

function ensureStream(
  key: string,
  spoken: string,
  lang: string,
  voice?: string,
): StreamState {
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
      const { url, init } = ttsUrl(spoken, lang, voice);
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

async function playPcmStream(
  state: StreamState,
  gen: number,
  onStart?: () => void,
): Promise<void> {
  const ctx = getAudioContext();
  await resumeBriefly(ctx);
  let chunkIndex = 0;
  let leftover: Uint8Array<ArrayBuffer> = new Uint8Array(0);
  let nextStart = ctx.currentTime;
  let lastSource: AudioBufferSourceNode | null = null;

  while (gen === playGen) {
    while (chunkIndex < state.chunks.length) {
      const chunk = state.chunks[chunkIndex];
      chunkIndex += 1;
      const merged = concatBytes(leftover, chunk);
      const even = merged.byteLength & ~1;
      leftover = remainderBytes(merged, even);
      if (even < 2) continue;
      const scheduled = schedulePcm(ctx, merged.subarray(0, even), nextStart);
      nextStart = scheduled.nextStart;
      if (scheduled.source) {
        // The first sound is out. Said once, because a caller waiting to hear
        // whether anything is coming only needs telling the once.
        if (!lastSource) onStart?.();
        lastSource = scheduled.source;
      }
    }
    if (state.error) throw state.error;
    if (state.done) break;
    await waitForChunk(state, chunkIndex);
  }

  if (gen !== playGen || !lastSource) return;

  await new Promise<void>((resolve) => {
    // 이 줄을 시작한 컨텍스트로 잰다. getAudioContext()는 방해 상태면 새 컨텍스트(시간 0)를 돌려줘
    // 줄이 끝난 줄 모르고 기다리게 된다. 컨텍스트가 1.5초 넘게 멈춰 있으면 이 줄은 포기한다.
    let stuckSince = 0;
    const finish = () => {
      if (gen !== playGen || ctx.currentTime >= nextStart - 0.01) {
        resolve();
        return;
      }
      if (ctx.state !== "running") {
        stuckSince ||= Date.now();
        if (Date.now() - stuckSince > 1500) {
          resolve();
          return;
        }
      } else stuckSince = 0;
      window.setTimeout(finish, 40);
    };
    lastSource.addEventListener("ended", () => resolve(), { once: true });
    finish();
  });
}

/**
 * Fetch a line before anybody asks to hear it.
 *
 * `voice` is a roleplay scene's own voice, and leaving it out is not a detail:
 * the cache is keyed by it and so is the URL, so a line warmed without one is
 * stored under a key `playTts` will not look at and fetched in the wrong voice
 * besides — a request paid for twice and used once. It went in late, which is
 * why the whole queue carried a voice before this did.
 */
export function prefetchTts(text: string, lang: string, voice?: string) {
  const spoken = spokenFormForTts(text, lang);
  if (!spoken) return;
  const key = cacheKey(lang, spoken, voice);
  if (completeCache.has(key) || inflight.has(key)) return;
  const queued = prefetchQueue.findIndex((job) => job.key === key);
  if (queued >= 0) prefetchQueue.splice(queued, 1);
  prefetchQueue.unshift({ key, spoken, lang, voice });
  pumpPrefetch();
}

/**
 * Say it, and say when it started saying it.
 *
 * `onStart` fires as the first sound is scheduled, which is the difference
 * between a line that is slow and a line that is never coming. Speech is
 * fetched from a server that is usually quick and is sometimes not: measured
 * against the deployed one, the same request took under a second four times and
 * then nineteen, nine, and longer than five minutes. The caller had one timer
 * covering the fetch and the playing together, so it could only wait long
 * enough for the slowest line it ever meant to play — half a minute of a
 * conversation sitting still, which reads as broken rather than as slow.
 */
export async function playTts(
  text: string,
  lang: string,
  voice?: string,
  onStart?: () => void,
): Promise<void> {
  const spoken = spokenFormForTts(text, lang);
  if (!spoken) return;
  stopTts();
  const gen = playGen;
  await unlockAudio();
  if (gen !== playGen) return;
  const key = cacheKey(lang, spoken, voice);
  const state = startNow(key, spoken, lang, voice);
  await playPcmStream(state, gen, onStart);
}
