/**
 * OpenAI 밖 받아쓰기(2026-10-21, `hub/drafts/speech-models-2026-10-21.md`): ElevenLabs Scribe v2, AssemblyAI Sync(Universal-3.5 Pro).
 * 둘 다 한 번 보내면 바로 답이 오는 주소 — 짧은 한 마디(통화 학습·Room 자막)에 쓴다. 키는 서버에만(Vercel).
 * 답은 같은 모양: 글·낱말(시간·확신도)·알아들은 언어·전체 확신도.
 */

export type SttWordOut = { text: string; start: number; end: number; confidence: number | null };
export type SttResult = { text: string; words: SttWordOut[]; languages: string[]; confidence: number | null; provider: string };

export const EXTERNAL_STT_MODELS = ["scribe_v2", "assemblyai-sync"] as const;
export type ExternalSttModel = (typeof EXTERNAL_STT_MODELS)[number];

export function isExternalStt(model: string): model is ExternalSttModel {
  return (EXTERNAL_STT_MODELS as readonly string[]).includes(model);
}

export function externalSttReady(model: ExternalSttModel): boolean {
  return Boolean(model === "scribe_v2" ? process.env.ELEVENLABS_API_KEY : process.env.ASSEMBLYAI_API_KEY);
}

const mean = (values: number[]) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : null);

class SttHttpError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function scribe(bytes: Buffer, mimeType: string, filename: string, languages: string[]): Promise<SttResult> {
  const form = new FormData();
  form.set("model_id", "scribe_v2");
  form.set("file", new Blob([new Uint8Array(bytes)], { type: mimeType }), filename);
  // 언어가 하나면 알려 주고, 둘(Room)이면 맡긴다 — 말한 언어를 스스로 고른다.
  if (languages.length === 1) form.set("language_code", languages[0]);
  form.set("timestamps_granularity", "word");
  form.set("tag_audio_events", "false");
  // 말 그대로(채움말·되풀이 포함). 학습자가 한 말을 고치지 않는 것이 이 앱의 핵심.
  form.set("no_verbatim", "false");
  const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
    method: "POST",
    headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY ?? "" },
    body: form,
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new SttHttpError(response.status, `scribe ${response.status} ${(await response.text()).slice(0, 200)}`);
  const body = (await response.json()) as {
    text?: string;
    language_code?: string;
    words?: { text?: string; start?: number; end?: number; type?: string; logprob?: number }[];
  };
  const words = (body.words ?? [])
    .filter((w) => w.type === "word")
    .map((w) => ({
      text: w.text ?? "",
      start: w.start ?? 0,
      end: w.end ?? 0,
      confidence: typeof w.logprob === "number" ? Math.exp(w.logprob) : null,
    }));
  return {
    provider: "elevenlabs",
    text: (body.text ?? "").trim(),
    words,
    languages: body.language_code ? [body.language_code] : [],
    confidence: mean(words.map((w) => w.confidence).filter((c): c is number => c !== null)),
  };
}

async function assembly(bytes: Buffer, mimeType: string, filename: string, languages: string[], context: string): Promise<SttResult> {
  const form = new FormData();
  form.set("audio", new Blob([new Uint8Array(bytes)], { type: mimeType }), filename);
  form.set(
    "config",
    new Blob(
      [
        JSON.stringify({
          ...(languages.length ? { language_codes: languages } : {}),
          timestamps: true,
          ...(context ? { conversation_context: [context] } : {}),
        }),
      ],
      { type: "application/json" },
    ),
  );
  const response = await fetch("https://sync.assemblyai.com/v1/transcribe", {
    method: "POST",
    headers: { Authorization: process.env.ASSEMBLYAI_API_KEY ?? "", "X-AAI-Model": "universal-3-5-pro" },
    body: form,
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new SttHttpError(response.status, `assemblyai ${response.status} ${(await response.text()).slice(0, 200)}`);
  const body = (await response.json()) as {
    text?: string;
    confidence?: number;
    language_code?: string;
    words?: { text?: string; start?: number; end?: number; confidence?: number }[];
  };
  return {
    provider: "assemblyai",
    text: (body.text ?? "").trim(),
    words: (body.words ?? []).map((w) => ({
      text: w.text ?? "",
      start: (w.start ?? 0) / 1000,
      end: (w.end ?? 0) / 1000,
      confidence: typeof w.confidence === "number" ? w.confidence : null,
    })),
    languages: body.language_code ? [body.language_code] : languages,
    confidence: typeof body.confidence === "number" ? body.confidence : null,
  };
}

export async function transcribeExternal(
  model: ExternalSttModel,
  input: { bytes: Buffer; mimeType: string; filename: string; languages: string[]; context?: string },
): Promise<SttResult> {
  return model === "scribe_v2"
    ? scribe(input.bytes, input.mimeType, input.filename, input.languages)
    : assembly(input.bytes, input.mimeType, input.filename, input.languages, input.context ?? "");
}
