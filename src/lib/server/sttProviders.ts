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

function assemblyKey(): string {
  return (process.env.ASSEMBLYAI_API_KEY ?? "").trim().replace(/^Bearer\s+/i, "");
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

/**
 * Scribe가 바쁠 때(2026-10-27 운영: 429 system_busy가 몇 분씩, 한 번에 약 4초 걸려 거절) 1분 동안 묻지 않고 바로 OpenAI로 —
 * 실패할 때마다 한 마디가 4초씩 늦어지지 않게. 서버 인스턴스마다 따로 센다.
 */
let scribeRestUntil = 0;
const SCRIBE_REST_MS = 60_000;
export function scribeResting(now = Date.now()): boolean {
  return now < scribeRestUntil;
}
function noteScribeFailure(status: number, now = Date.now()) {
  if (status === 429 || status >= 500) scribeRestUntil = now + SCRIBE_REST_MS;
}

async function scribe(bytes: Buffer, mimeType: string, filename: string, languages: string[]): Promise<SttResult> {
  if (scribeResting()) throw new SttHttpError(429, "scribe resting after a recent 429/5xx");
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
    headers: { "xi-api-key": (process.env.ELEVENLABS_API_KEY ?? "").trim() },
    body: form,
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) {
    noteScribeFailure(response.status);
    throw new SttHttpError(response.status, `scribe ${response.status} ${(await response.text()).slice(0, 200)}`);
  }
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
    headers: { Authorization: assemblyKey(), "X-AAI-Model": "universal-3-5-pro" },
    body: form,
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 200);
    // 키 문제인지 Sync만의 문제인지 가르려고, 키가 거절되면 일반 API에 같은 키로 한 번 물어 본다(점검 오류 글에만 쓰임).
    let probe = "";
    if (response.status === 401 || response.status === 403 || response.status === 404) {
      const check = await fetch("https://api.assemblyai.com/v2/transcript?limit=1", { headers: { Authorization: assemblyKey() } }).catch(() => null);
      probe = ` · v2 ${check?.status ?? "?"} · key ${assemblyKey().length}자`;
    }
    throw new SttHttpError(response.status, `assemblyai ${response.status} ${detail}${probe}`);
  }
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

/** 영상 한 조각(약 75초)의 낱말·띄어쓰기 순서 그대로 — 글을 다시 이을 때 띄어쓰기 없는 언어(ja·zh·th)를 지키려고. */
export type ScribeToken = { text: string; start: number; end: number; kind: "word" | "spacing"; confidence: number | null };

/**
 * 영상 받아쓰기(2026-10-27, whisper-1 2027-02-26 종료의 대체): Scribe v2 일괄, 낱말 시간 포함.
 * 한 마디용 `scribe`와 같은 주소지만 조각이 길어 기다림을 늘리고, 띄어쓰기 토큰도 남긴다. 배경 소리 표시는 끈다.
 */
export async function scribeTimed(input: { bytes: Buffer; mimeType: string; filename: string; language?: string }): Promise<{ tokens: ScribeToken[]; text: string; language: string | null }> {
  if (scribeResting()) throw new SttHttpError(429, "scribe resting after a recent 429/5xx");
  const form = new FormData();
  form.set("model_id", "scribe_v2");
  form.set("file", new Blob([new Uint8Array(input.bytes)], { type: input.mimeType }), input.filename);
  if (input.language && input.language.length === 2) form.set("language_code", input.language);
  form.set("timestamps_granularity", "word");
  form.set("tag_audio_events", "false");
  const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
    method: "POST",
    headers: { "xi-api-key": (process.env.ELEVENLABS_API_KEY ?? "").trim() },
    body: form,
    signal: AbortSignal.timeout(90_000),
  });
  if (!response.ok) {
    noteScribeFailure(response.status);
    throw new SttHttpError(response.status, `scribe ${response.status} ${(await response.text()).slice(0, 200)}`);
  }
  const body = (await response.json()) as {
    text?: string;
    language_code?: string;
    words?: { text?: string; start?: number; end?: number; type?: string; logprob?: number }[];
  };
  const tokens: ScribeToken[] = (body.words ?? [])
    .filter((w) => w.type === "word" || w.type === "spacing")
    .map((w) => ({
      text: w.text ?? "",
      start: w.start ?? 0,
      end: w.end ?? 0,
      kind: w.type === "word" ? ("word" as const) : ("spacing" as const),
      confidence: typeof w.logprob === "number" ? Math.exp(w.logprob) : null,
    }));
  return { tokens, text: (body.text ?? "").trim(), language: body.language_code ?? null };
}

/**
 * 낱말 토큰 → 자막 줄. 문장 끝 부호(. ? ! 。 ？ ！ … ؟ ।)나 0.8초 넘는 쉼에서 끊고, 한 줄이 12초를 넘으면 그 앞 낱말에서 끊는다.
 * 순수 함수(테스트용).
 */
export function tokensToLines(tokens: ScribeToken[], offset = 0): { text: string; start: number; end: number; words: { word: string; start: number; end: number }[]; confidence: number | null }[] {
  const lines: { text: string; start: number; end: number; words: { word: string; start: number; end: number }[]; confidence: number | null }[] = [];
  let parts: ScribeToken[] = [];
  const flush = () => {
    const words = parts.filter((t) => t.kind === "word" && t.text.trim());
    if (words.length) {
      const text = parts.map((t) => t.text).join("").replace(/\s+/g, " ").trim();
      const sure = words.map((w) => w.confidence).filter((c): c is number => c !== null);
      lines.push({
        text,
        start: words[0].start + offset,
        end: words[words.length - 1].end + offset,
        words: words.map((w) => ({ word: w.text, start: w.start + offset, end: w.end + offset })),
        confidence: sure.length ? sure.reduce((a, b) => a + b, 0) / sure.length : null,
      });
    }
    parts = [];
  };
  let lastWordEnd: number | null = null;
  for (const token of tokens) {
    if (token.kind === "word") {
      const firstStart = parts.find((t) => t.kind === "word")?.start;
      if (lastWordEnd !== null && token.start - lastWordEnd > 0.8) flush();
      else if (firstStart !== undefined && token.end - firstStart > 12) flush();
      parts.push(token);
      lastWordEnd = token.end;
      if (/[.?!。？！…؟।]["'”’」』)]*$/.test(token.text.trim())) flush();
    } else if (parts.length) {
      parts.push(token);
    }
  }
  flush();
  return lines;
}

