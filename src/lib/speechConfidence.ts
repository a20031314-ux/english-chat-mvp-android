/**
 * 받아쓴 한 마디가 "확실하지 않음"인가 (2026-10-22, 사용자 요청: 따로 알림 말고 말풍선에 "?"만).
 *
 * 받아쓰기 모델은 낱말(토큰)마다 확률을 준다. 두 가지를 본다:
 * - mean: 전체 확률의 기하평균(learnerMetrics `confidenceFromLogprobs`와 같은 값)
 * - min: 가장 자신 없던 낱말 하나 — 한 낱말만 뭉개진 줄(앞부분이 엉뚱한 줄)을 잡는다
 * 기준값은 실제 학습자 녹음(speechocean762, 발음 점수별 150문장)으로 맞췄다 — `hub/drafts/speech-models-2026-10-21.md` "확실하지 않음".
 * 서버(`/api/roleplay/listen`)가 판단해 `unsure`로 보내고, 앱은 그 줄 말풍선 끝에 "?"를 붙인다.
 */

export type SpeechConfidence = { mean: number | null; min: number | null };

/**
 * 확신도 기준. 모델마다 확률의 크기가 달라 따로 둔다(목록에 없으면 default).
 * 맞춘 값(150문장, 2026-10-22): 낱말 25% 이상 틀린 줄 중 잡는 비율 / 완전히 맞은 줄에 잘못 붙는 비율 —
 * mini 0.86 → 50% / 3%, gpt-transcribe 0.90 → 58% / 1%, Scribe v2 0.92 → 67% / 1%.
 * 가장 낮은 낱말(min)은 이 자료에서 거의 도움이 안 돼 0(끔). 모델이 대체로 자신만만해서 평균이 거의 전부.
 */
export const UNSURE_RULES: Record<string, { mean: number; min: number }> = {
  "gpt-4o-mini-transcribe": { mean: 0.86, min: 0 },
  "gpt-transcribe": { mean: 0.9, min: 0 },
  scribe_v2: { mean: 0.92, min: 0 },
  default: { mean: 0.86, min: 0 },
};

export function isUnsure(confidence: SpeechConfidence, model = "default"): boolean {
  const rule = UNSURE_RULES[model] ?? UNSURE_RULES.default;
  if (confidence.mean === null && confidence.min === null) return false;
  return (confidence.mean !== null && confidence.mean < rule.mean) || (confidence.min !== null && confidence.min < rule.min);
}

/** OpenAI logprobs 배열 → 기하평균·최솟값(0~1). 없으면 둘 다 null. */
export function confidenceOfLogprobs(logprobs: unknown): SpeechConfidence {
  if (!Array.isArray(logprobs)) return { mean: null, min: null };
  const values = logprobs
    .map((entry) => (entry && typeof entry === "object" ? (entry as { logprob?: unknown }).logprob : null))
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  if (values.length === 0) return { mean: null, min: null };
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const round = (value: number) => Math.round(value * 1000) / 1000;
  return { mean: round(Math.exp(mean)), min: round(Math.exp(Math.min(...values))) };
}

/** 낱말 확신도 목록(0~1) → 평균·최솟값. */
export function confidenceOfWords(values: (number | null)[]): SpeechConfidence {
  const known = values.filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  if (known.length === 0) return { mean: null, min: null };
  const logMean = known.reduce((sum, value) => sum + Math.log(Math.max(value, 1e-6)), 0) / known.length;
  const round = (value: number) => Math.round(value * 1000) / 1000;
  return { mean: round(Math.exp(logMean)), min: round(Math.min(...known)) };
}
