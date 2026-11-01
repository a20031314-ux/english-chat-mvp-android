/**
 * Mistral Voxtral 읽어 주기 — 튜터 목소리의 기본 엔진(2026-11-02, 사용자 "인니어, 태국어 빼고 다 바꾸고").
 *
 * 왜: 통화 원가의 대부분이 목소리. Voxtral은 100만 글자 $13 — 말한 1분에 영어 약 $0.013(지금 Realtime 약 $0.026의 절반),
 * 한·중·일은 글자가 적어 약 $0.004~0.006. 미리 만든 목소리 대신 튜터의 지금 목소리를 흉내 낸다(`ref_audio`,
 * 참고 소리는 voiceRefs.generated.ts — scripts/voice-refs.mjs) — 언어마다 여자·남자가 다 있고, 앱에 녹음된 줄과 같은 사람처럼.
 * 키는 Vercel `MISTRAL_API_KEY`, 끄기는 `VOXTRAL_TTS=off`(그러면 예전 Realtime). 실패하면 /api/tts가 예전 엔진으로.
 */
import { VOICE_REFS } from "./voiceRefs.generated.ts";
import { speaksWithVoxtral } from "./voxtralLanguages.ts";
import { TimeStretch } from "./timeStretch.ts";

/**
 * 말 빠르기(1 = 그대로, 0.9 = 10% 느리게 — 높이는 그대로, timeStretch.ts). 사용자 2026-11-02 "voxtral 발음이 좀 빠른데 살짝 느리게".
 * Vercel `VOXTRAL_TTS_SPEED`로 바꿈(0.7~1.2).
 */
export const VOXTRAL_DEFAULT_SPEED = 0.9;
export function voxtralSpeed(override?: string): number {
  const raw = Number(override || process.env.VOXTRAL_TTS_SPEED);
  return Number.isFinite(raw) && raw >= 0.7 && raw <= 1.2 ? raw : VOXTRAL_DEFAULT_SPEED;
}

const BASE = "https://api.mistral.ai/v1/audio";
export const VOXTRAL_TTS_MODEL = process.env.MISTRAL_TTS_MODEL?.trim() || "voxtral-mini-tts-3-0";

function key(): string {
  // 붙여 넣을 때 딸려 온 따옴표·"Bearer "는 뗀다.
  return (process.env.MISTRAL_API_KEY ?? "").trim().replace(/^["']|["']$/g, "").replace(/^Bearer\s+/i, "").trim();
}

export function voxtralConfigured(): boolean {
  return Boolean(key());
}

/** OpenAI 목소리 이름 → 여자·남자(운영 샘플 높이로 확인, chatPartner.ts 주석). 장면 목소리가 튜터 표에 없을 때 같은 성별 튜터로. */
const VOICE_GENDER: Record<string, "f" | "m"> = {
  alloy: "f", coral: "f", nova: "f", sage: "f", shimmer: "f", marin: "f",
  ash: "m", ballad: "m", echo: "m", fable: "m", onyx: "m", verse: "m", cedar: "m",
};

/**
 * 이 언어·목소리를 Voxtral로 읽을 참고 소리(base64 mp3). 없으면 null → 예전 엔진.
 * 튜터 표의 목소리면 그 성별, 다른 장면 목소리(예전 앱의 es verse 등)도 이름의 성별로 — 그 언어 튜터 목소리를 흉내.
 */
export function voxtralReference(language: string, voice: string): string | null {
  if (!speaksWithVoxtral(language)) return null;
  // 언어별로 예전 목소리로 되돌리기: Vercel `VOXTRAL_TTS_OFF=ko,ja`(사용자 2026-11-02 "한국어가 영어를 번역한 말투").
  const off = (process.env.VOXTRAL_TTS_OFF ?? "").split(",").map((code) => code.trim().toLowerCase());
  if (off.includes(language)) return null;
  const gender = VOICE_GENDER[voice];
  if (!gender) return null;
  return VOICE_REFS[`${language}-${gender}`] ?? null;
}

/** 기본으로 Voxtral을 쓰나(키가 있고 `VOXTRAL_TTS=off`가 아니면). */
export function voxtralEnabled(): boolean {
  return voxtralConfigured() && process.env.VOXTRAL_TTS?.trim().toLowerCase() !== "off";
}

/** 미리 정해 둔 목소리 목록(slug·id·언어 등 Mistral이 주는 그대로). */
export async function voxtralVoices(offset = 0): Promise<unknown> {
  const response = await fetch(`${BASE}/voices?limit=100&offset=${offset}`, { headers: { Authorization: `Bearer ${key()}` } });
  const body = await response.json().catch(() => null);
  return { status: response.status, body };
}

function speechBody(input: { text: string; voice?: string; refAudio?: string; model?: string }, format: string, stream: boolean) {
  return JSON.stringify({
    model: input.model || VOXTRAL_TTS_MODEL,
    input: input.text,
    ...(input.refAudio ? { ref_audio: input.refAudio } : { voice_id: input.voice }),
    response_format: format,
    ...(stream ? { stream: true } : {}),
  });
}

/** float32 LE → s16le. 남은 바이트(4의 배수가 아닌 끝)는 다음 조각과 이어 붙이도록 돌려준다. */
export function float32ToPcm16(bytes: Uint8Array): { pcm: Uint8Array; rest: Uint8Array } {
  const whole = bytes.byteLength - (bytes.byteLength % 4);
  const view = new DataView(bytes.buffer, bytes.byteOffset, whole);
  const pcm = new Uint8Array(whole / 2);
  const out = new DataView(pcm.buffer);
  for (let i = 0, o = 0; i < whole; i += 4, o += 2) {
    const sample = Math.max(-1, Math.min(1, view.getFloat32(i, true)));
    out.setInt16(o, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
  }
  return { pcm, rest: bytes.slice(whole) };
}

/**
 * SSE(`speech.audio.delta` → audio_data base64 float32 24kHz) 를 s16le 24kHz 조각으로.
 * 줄 묶음이 조각 경계에서 끊겨도 이어 붙여 읽는다.
 */
export function sseAudioDecoder(): { push(text: string): Uint8Array[]; done: () => boolean } {
  let buffer = "";
  let rest: Uint8Array = new Uint8Array(0);
  let finished = false;
  return {
    push(text: string) {
      buffer += text;
      const out: Uint8Array[] = [];
      let cut: number;
      while ((cut = buffer.indexOf("\n\n")) >= 0) {
        const block = buffer.slice(0, cut);
        buffer = buffer.slice(cut + 2);
        const data = block.split("\n").filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trim()).join("");
        if (!data) continue;
        let event: { type?: string; audio_data?: unknown };
        try {
          event = JSON.parse(data);
        } catch {
          continue;
        }
        if (event.type === "speech.audio.done") finished = true;
        if (typeof event.audio_data !== "string") continue;
        const raw = Buffer.from(event.audio_data, "base64");
        const joined = new Uint8Array(rest.byteLength + raw.byteLength);
        joined.set(rest);
        joined.set(raw, rest.byteLength);
        const converted = float32ToPcm16(joined);
        rest = converted.rest;
        if (converted.pcm.byteLength) out.push(converted.pcm);
      }
      return out;
    },
    done: () => finished,
  };
}

/**
 * 흘려 받는 소리(s16le 24kHz) — 첫 소리가 올 때까지 기다렸다가 돌려준다. 그 전에 실패하면 throw(부른 쪽이 예전 엔진으로).
 */
export async function voxtralStream(input: { text: string; refAudio?: string; voice?: string; speed?: number }): Promise<ReadableStream<Uint8Array>> {
  const stretch = new TimeStretch(input.speed ?? voxtralSpeed());
  const response = await fetch(`${BASE}/speech`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key()}`, "Content-Type": "application/json", Accept: "text/event-stream" },
    body: speechBody(input, "pcm", true),
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok || !response.body) throw new Error(`voxtral ${response.status}: ${(await response.text().catch(() => "")).slice(0, 200)}`);
  const reader = response.body.getReader();
  const text = new TextDecoder();
  const decoder = sseAudioDecoder();
  // 첫 소리 조각까지 읽어 둔다.
  const first: Uint8Array[] = [];
  let sawAudio = false;
  while (!first.length) {
    const next = await reader.read();
    if (next.done) {
      if (!sawAudio) throw new Error("voxtral: no audio");
      first.push(stretch.flush());
      break;
    }
    for (const chunk of decoder.push(text.decode(next.value, { stream: true }))) {
      sawAudio = true;
      const out = stretch.push(chunk);
      if (out.byteLength) first.push(out);
    }
  }
  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of first) controller.enqueue(chunk);
    },
    async pull(controller) {
      for (;;) {
        const next = await reader.read().catch(() => ({ done: true as const, value: undefined }));
        if (next.done) {
          const rest = stretch.flush();
          if (rest.byteLength) controller.enqueue(rest);
          controller.close();
          return;
        }
        let sent = false;
        for (const chunk of decoder.push(text.decode(next.value, { stream: true }))) {
          const out = stretch.push(chunk);
          if (out.byteLength) {
            controller.enqueue(out);
            sent = true;
          }
        }
        if (sent) return;
      }
    },
    cancel() {
      void reader.cancel();
    },
  });
}

/** 점검: 흘려 받기(stream) 답의 앞부분을 글 그대로 — 사건 이름·자료 모양을 보려고. */
export async function voxtralRawStream(input: { text: string; voice?: string; refAudio?: string; format?: string }): Promise<{ status: number; contentType: string | null; head: string; bytes: number; firstMs: number; ms: number }> {
  const started = Date.now();
  const response = await fetch(`${BASE}/speech`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key()}`, "Content-Type": "application/json", Accept: "text/event-stream" },
    body: speechBody(input, input.format || "pcm", true),
  });
  let head = "";
  let bytes = 0;
  let firstMs = 0;
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  while (reader) {
    const next = await reader.read();
    if (next.done) break;
    if (!firstMs) firstMs = Date.now() - started;
    bytes += next.value.byteLength;
    if (head.length < 3000) head += decoder.decode(next.value, { stream: true });
  }
  return { status: response.status, contentType: response.headers.get("content-type"), head: head.slice(0, 3000), bytes, firstMs, ms: Date.now() - started };
}

/** 글을 읽은 소리(wav). 실패하면 status와 Mistral의 답을 그대로. `refAudio`(mp3·wav base64)면 그 목소리를 흉내 냄(저장 안 함). */
export async function voxtralSpeech(input: { text: string; voice: string; model?: string; refAudio?: string }): Promise<{ ok: true; wav: Buffer; ms: number } | { ok: false; status: number; error: unknown }> {
  const started = Date.now();
  const response = await fetch(`${BASE}/speech`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key()}`, "Content-Type": "application/json" },
    body: speechBody(input, "wav", false),
  });
  const body = (await response.json().catch(() => null)) as { audio_data?: unknown } | null;
  if (!response.ok || !body || typeof body.audio_data !== "string") return { ok: false, status: response.status, error: body };
  return { ok: true, wav: Buffer.from(body.audio_data, "base64"), ms: Date.now() - started };
}
