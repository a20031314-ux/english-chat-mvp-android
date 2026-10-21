import { casualToElder, findIrregularSlips } from "./koreanSlips.ts";

/**
 * 고친 문장을 고가 모델(확인 모델, llm.ts "chatVerify")에게 한 번 더 보일 만큼 위험한가 — 규칙만, 모델 호출 없음.
 *
 * 가상 사용자 점검(2026-10-21, `hub/drafts/sim-judge-enko-2026-10-21.md`)에서 싼 모델이 틀린 곳:
 * 많이 틀린 긴 문장(한국어 큰 문제 19/100), 윗사람께 쓰는 말, 영어가 아닌 학습 언어의 긴 줄.
 * 실수 하나짜리 짧은 줄은 거의 맞았다(영어 100%) — 그건 확인하지 않는다.
 * 앱(열 때 확인할지)과 서버(확인 요청을 받았을 때 정말 할지)가 같은 함수를 쓴다.
 */

export type CorrectionRisk = { risky: boolean; reasons: string[] };

const SPACELESS = new Set(["ja", "zh", "th"]);

function bare(text: string): string {
  return text.normalize("NFC").toLowerCase().replace(/[\p{P}\p{S}]/gu, " ").replace(/\s+/g, " ").trim();
}

/** 원문 중 고친 문장에 그대로 남은 몫(0~1). 띄어쓰기 없는 언어는 두 글자씩. */
export function keptShare(original: string, corrected: string, target: string): number {
  const a = bare(original);
  const b = bare(corrected);
  if (!a) return 1;
  if (SPACELESS.has(target)) {
    const grams = (t: string) => {
      const s = t.replace(/\s/g, "");
      const out: string[] = [];
      for (let i = 0; i < s.length - 1; i += 1) out.push(s.slice(i, i + 2));
      return out;
    };
    const from = grams(a);
    if (!from.length) return 1;
    const pool = new Set(grams(b));
    return from.filter((g) => pool.has(g)).length / from.length;
  }
  const from = a.split(" ");
  const pool = new Set(b.split(" "));
  return from.filter((w) => pool.has(w)).length / from.length;
}

export function correctionRisk(input: {
  original: string;
  corrected: string;
  target: string;
  explanation?: string;
}): CorrectionRisk {
  const original = input.original.trim();
  const corrected = input.corrected.trim();
  if (!original || !corrected || bare(original) === bare(corrected)) return { risky: false, reasons: [] };

  const reasons: string[] = [];
  const kept = keptShare(original, corrected, input.target);
  const long = [...original].length >= (SPACELESS.has(input.target) ? 18 : 40);
  // 바뀐 낱말 수(띄어 쓰는 언어만): 긴 줄에서 셋 이상 바뀌면 시제·호응이 얽힌 고침이 많았다.
  const pool = new Set(bare(corrected).split(" "));
  const changedWords = SPACELESS.has(input.target)
    ? 0
    : bare(original).split(" ").filter((w) => w && !pool.has(w)).length;
  const heavy = kept < 0.6 || changedWords >= 3;

  if (input.target === "ko") {
    if (casualToElder(original)) reasons.push("elder");
    if (findIrregularSlips(corrected).length) reasons.push("irregular_left");
  }
  if (heavy && long) reasons.push("heavy_long");
  else if (input.target !== "en" && (heavy || long)) reasons.push(heavy ? "heavy" : "long");
  if (input.explanation !== undefined && !input.explanation.trim()) reasons.push("no_explanation");

  return { risky: reasons.length > 0, reasons };
}
