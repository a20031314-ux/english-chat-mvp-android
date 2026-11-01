/**
 * Mistral Voxtral 읽어 주기 — 점검 사용자만 써 보는 목소리 후보(2026-11-01 사용자 "통화 가격을 낮출 방법" → 목소리 원가가 통화의 약 80%).
 * 공개 가격 100만 글자 $13(지금 목소리 gpt-realtime-2.1-mini의 약 1/10 어림). 품질·언어(id·th 미확인)는 샘플로 듣고 정한다.
 * 실제 사용자는 쓰지 않는다 — /api/tts가 점검 머리글(x-tts-engine: voxtral)일 때만 부른다. 키는 Vercel `MISTRAL_API_KEY`.
 */
const BASE = "https://api.mistral.ai/v1/audio";
export const VOXTRAL_TTS_MODEL = process.env.MISTRAL_TTS_MODEL?.trim() || "voxtral-mini-tts-3-0";

function key(): string {
  // 붙여 넣을 때 딸려 온 따옴표·"Bearer "는 뗀다.
  return (process.env.MISTRAL_API_KEY ?? "").trim().replace(/^["']|["']$/g, "").replace(/^Bearer\s+/i, "").trim();
}

export function voxtralConfigured(): boolean {
  return Boolean(key());
}

/** 미리 정해 둔 목소리 목록(slug·id·언어 등 Mistral이 주는 그대로). */
export async function voxtralVoices(offset = 0): Promise<unknown> {
  const response = await fetch(`${BASE}/voices?limit=100&offset=${offset}`, { headers: { Authorization: `Bearer ${key()}` } });
  const body = await response.json().catch(() => null);
  return { status: response.status, body };
}

/** 글을 읽은 소리(wav). 실패하면 status와 Mistral의 답을 그대로. */
export async function voxtralSpeech(input: { text: string; voice: string; model?: string }): Promise<{ ok: true; wav: Buffer; ms: number } | { ok: false; status: number; error: unknown }> {
  const started = Date.now();
  const response = await fetch(`${BASE}/speech`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key()}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: input.model || VOXTRAL_TTS_MODEL, input: input.text, voice_id: input.voice, response_format: "wav" }),
  });
  const body = (await response.json().catch(() => null)) as { audio_data?: unknown } | null;
  if (!response.ok || !body || typeof body.audio_data !== "string") return { ok: false, status: response.status, error: body };
  return { ok: true, wav: Buffer.from(body.audio_data, "base64"), ms: Date.now() - started };
}
