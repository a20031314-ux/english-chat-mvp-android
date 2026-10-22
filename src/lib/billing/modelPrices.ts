/**
 * 모델별 단가 — 비용 계산이 읽는 한 장(2026-10-22). 어느 기능이 어느 모델을 쓰는지는 `lib/aiDefaults.ts`,
 * 기능 한 번에 몇 토큰·몇 초인지는 `opCost.ts`. 셋을 곱한 것이 `hub/costs.md`(main push마다 CI가 다시 계산).
 *
 * 새 모델을 기본값으로 쓰면 여기에 단가가 있어야 한다 — 없으면 `opCost.test.ts`가 실패한다(CI `cost`).
 * 순수 파일(앱 화면 쪽 `cost.ts`도 읽음).
 */

/** 100만 토큰당 달러(입력/출력). */
export const TEXT_USD_PER_MTOK: Record<string, { input: number; output: number; source: string }> = {
  "gpt-4o-mini": { input: 0.15, output: 0.6, source: "OpenAI pricing (cost.ts PRICE_SOURCE)" },
  "gpt-4.1-mini": { input: 0.4, output: 1.6, source: "OpenAI pricing" },
  "gpt-4.1": { input: 2, output: 8, source: "OpenAI pricing" },
  "gpt-5-mini": { input: 0.25, output: 2, source: "OpenAI pricing" },
  "gpt-6-luna": { input: 0.1, output: 0.5, source: "hub/MODELS.md 2026-10-21 조사" },
  "claude-haiku-5-5": { input: 0.1, output: 0.5, source: "platform.claude.com pricing 2026-10-22 (10만 토큰 이하 프롬프트)" },
  "claude-sonnet-5-5": { input: 2, output: 10, source: "platform.claude.com pricing 2026-10-22" },
  "claude-opus-5-5": { input: 4, output: 20, source: "platform.claude.com pricing 2026-10-22" },
};

/** 받아쓰기 분당 달러. */
export const STT_USD_PER_MINUTE: Record<string, { usd: number; source: string }> = {
  "gpt-4o-mini-transcribe": { usd: 0.003, source: "OpenAI pricing" },
  "gpt-4o-transcribe": { usd: 0.006, source: "OpenAI pricing" },
  "gpt-transcribe": { usd: 0.0045, source: "hub/drafts/speech-models-2026-10-21.md" },
  "gpt-live-transcribe": { usd: 0.017, source: "hub/MODELS.md" },
  "whisper-1": { usd: 0.006, source: "OpenAI pricing" },
  scribe_v2: { usd: 0.0036, source: "hub/drafts/speech-models-2026-10-21.md (한 줄 6초 약 0.5원)" },
  "assemblyai-sync": { usd: 0.0036, source: "hub/drafts/speech-models-2026-10-21.md" },
};

/** 목소리 분당 달러(말한 소리 1분). */
export const TTS_USD_PER_MINUTE_BY_MODEL: Record<string, { usd: number; source: string }> = {
  "gpt-4o-mini-tts": { usd: 0.015, source: "OpenAI pricing — cost.ts에서 가장 약한 숫자" },
  // Realtime 오디오 출력 초당 약 20토큰 × $20/1M + 글 토큰 — 6초 약 3.7원(hub/drafts/speech-models-2026-10-21.md).
  "gpt-realtime-2.1-mini": { usd: 0.0264, source: "hub/drafts/speech-models-2026-10-21.md 어림" },
};

// fallback: 앱 화면 쪽(`cost.ts` → billingService)에서 단가가 빠졌다고 앱이 멈추지 않게. 빠진 단가는 테스트(CI)가 잡는다.
export function textPrice(model: string, fallback?: { input: number; output: number }): { input: number; output: number } {
  const price = TEXT_USD_PER_MTOK[model] ?? fallback;
  if (!price) throw new Error(`글 모델 단가 없음: ${model} — src/lib/billing/modelPrices.ts에 더하세요`);
  return price;
}

export function sttPerMinute(model: string, fallback?: number): number {
  const price = STT_USD_PER_MINUTE[model]?.usd ?? fallback;
  if (price === undefined) throw new Error(`받아쓰기 단가 없음: ${model} — src/lib/billing/modelPrices.ts에 더하세요`);
  return price;
}

export function ttsPerMinute(model: string, fallback?: number): number {
  const price = TTS_USD_PER_MINUTE_BY_MODEL[model]?.usd ?? fallback;
  if (price === undefined) throw new Error(`목소리 단가 없음: ${model} — src/lib/billing/modelPrices.ts에 더하세요`);
  return price;
}
