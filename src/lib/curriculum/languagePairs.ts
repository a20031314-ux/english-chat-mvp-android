/**
 * 언어 조합별 학습 체감(2026-11-08 사용자 "언어조합별로 학습체감(스페인어권 사람이 일본어를 공부할 때)도 고려 가능할까" → "만들어줘").
 * ① 언어 특징표: 14개 언어마다 문법 특징이 있는지(있음 · 약함 · 없음)와 어순·글자. 두 언어를 견줘
 *    학습 언어의 문법 칸(사다리 `grammarList`)마다 비중을 정한다 — 모국어에 없는 개념이면 무겁게, 같으면 가볍게.
 * 순수 모듈. 182개 조합을 손으로 쓰지 않고 특징표 하나에서 나온다(Claude 작성, 원어민·언어학자 확인 전).
 * 쓰는 곳(다음): 퀴즈에 낼 문법 칸 고르기·맞나 틀리나 칸 비중·문법 카드의 모국어 비교 한 줄.
 * ② 닮은 말은 `pairs/cognates.json`(scripts/cognates.py).
 */

export type Feature =
  | "article" | "gender" | "case" | "particle" | "classifier" | "honorific" | "verbPerson"
  | "tense" | "aspect" | "subjunctive" | "copula" | "clitic" | "reflexive" | "auxChoice" | "affix";
/** 2 있음 · 1 약함(있지만 단순하거나 일부) · 0 없음. */
type Level = 0 | 1 | 2;
type Profile = { script: "latin" | "cyrillic" | "arabic" | "devanagari" | "thai" | "hangul" | "kana" | "hanzi"; order: "SVO" | "SOV" | "VSO"; has: Record<Feature, Level> };

const F = (has: Partial<Record<Feature, Level>>): Record<Feature, Level> => ({
  article: 0, gender: 0, case: 0, particle: 0, classifier: 0, honorific: 0, verbPerson: 0, tense: 0, aspect: 0,
  subjunctive: 0, copula: 0, clitic: 0, reflexive: 0, auxChoice: 0, affix: 0, ...has,
});

export const PROFILES: Record<string, Profile> = {
  en: { script: "latin", order: "SVO", has: F({ article: 2, verbPerson: 1, tense: 2, aspect: 2, subjunctive: 1, copula: 2, reflexive: 1 }) },
  es: { script: "latin", order: "SVO", has: F({ article: 2, gender: 2, honorific: 1, verbPerson: 2, tense: 2, aspect: 2, subjunctive: 2, copula: 2, clitic: 2, reflexive: 2 }) },
  fr: { script: "latin", order: "SVO", has: F({ article: 2, gender: 2, honorific: 1, verbPerson: 2, tense: 2, aspect: 2, subjunctive: 2, copula: 2, clitic: 2, reflexive: 2, auxChoice: 2 }) },
  it: { script: "latin", order: "SVO", has: F({ article: 2, gender: 2, honorific: 1, verbPerson: 2, tense: 2, aspect: 2, subjunctive: 2, copula: 2, clitic: 2, reflexive: 2, auxChoice: 2 }) },
  pt: { script: "latin", order: "SVO", has: F({ article: 2, gender: 2, honorific: 1, verbPerson: 2, tense: 2, aspect: 2, subjunctive: 2, copula: 2, clitic: 2, reflexive: 2 }) },
  ru: { script: "cyrillic", order: "SVO", has: F({ gender: 2, case: 2, honorific: 1, verbPerson: 2, tense: 2, aspect: 2, subjunctive: 1, reflexive: 2, affix: 1 }) },
  ar: { script: "arabic", order: "VSO", has: F({ article: 2, gender: 2, case: 1, verbPerson: 2, tense: 2, aspect: 2, subjunctive: 2, clitic: 2, affix: 2 }) },
  hi: { script: "devanagari", order: "SOV", has: F({ gender: 2, case: 2, particle: 2, honorific: 2, verbPerson: 2, tense: 2, aspect: 2, subjunctive: 2, copula: 2 }) },
  ja: { script: "kana", order: "SOV", has: F({ particle: 2, classifier: 2, honorific: 2, tense: 2, aspect: 2, copula: 2 }) },
  ko: { script: "hangul", order: "SOV", has: F({ particle: 2, classifier: 2, honorific: 2, tense: 2, aspect: 2, copula: 2 }) },
  zh: { script: "hanzi", order: "SVO", has: F({ classifier: 2, honorific: 1, aspect: 2, copula: 1 }) },
  th: { script: "thai", order: "SVO", has: F({ classifier: 2, honorific: 2, aspect: 1, copula: 1 }) },
  vi: { script: "latin", order: "SVO", has: F({ classifier: 2, honorific: 2, aspect: 1, copula: 1 }) },
  id: { script: "latin", order: "SVO", has: F({ classifier: 1, honorific: 1, aspect: 1, copula: 1, affix: 2 }) },
};

/**
 * 학습 언어 문법 칸(사다리 순서 번호 — `grammarList` 차례) → 그 칸이 다루는 특징. 칸 이름으로 짐작하지 않고 언어마다 손으로 붙임(Claude, 2026-11-08).
 * 줄임: ar 관사 · g 성 · c 격 · p 조사·후치사 · cl 양사 · h 높임 · vp 인칭 활용 · t 시제 · a 상 · s 접속법 · co 계사 · cli 대명사 붙음 · r 재귀 · ax 조동사 고르기 · af 접사 · o 어순.
 * 사다리 칸이 바뀌면(번호가 밀리면) 여기도 본다 — 테스트가 칸 수를 확인.
 */
const SLOT_TAGS: Record<string, { size: number; tags: Record<number, string> }> = {
  ko: { size: 40, tags: { 0: "co", 1: "co p", 2: "p", 3: "t", 4: "p", 8: "t", 9: "t", 15: "p", 23: "h", 24: "h" } },
  ja: { size: 40, tags: { 0: "co p", 2: "h", 3: "p", 5: "p", 6: "p", 8: "t", 10: "a", 14: "a", 16: "h", 24: "h", 25: "h", 26: "h" } },
  zh: { size: 35, tags: { 0: "co", 4: "cl", 6: "co", 7: "a", 9: "o", 10: "o", 14: "a", 18: "a", 20: "o" } },
  th: { size: 40, tags: { 0: "co", 2: "h", 5: "o", 8: "a", 9: "t", 10: "a", 14: "a", 32: "h" } },
  vi: { size: 36, tags: { 0: "co", 1: "h", 5: "cl", 8: "t a", 9: "t", 10: "a", 14: "a", 22: "a", 28: "o" } },
  id: { size: 36, tags: { 0: "co", 1: "h", 2: "o", 8: "t a", 9: "af", 10: "af", 15: "a", 16: "af", 17: "af", 19: "af", 23: "af", 24: "af", 30: "co", 33: "af" } },
  hi: { size: 36, tags: { 0: "co vp", 2: "g", 4: "c p", 7: "h", 8: "g vp a", 9: "a g", 10: "t g vp", 11: "t g", 12: "c p", 13: "c p", 15: "c t", 18: "a g", 23: "s", 29: "h" } },
  ar: { size: 37, tags: { 0: "co", 1: "g", 2: "g", 3: "cli", 5: "g", 8: "t vp", 9: "vp af", 10: "t", 11: "t", 14: "c ar", 16: "a", 18: "g", 19: "s", 23: "af" } },
  ru: { size: 37, tags: { 0: "co", 3: "g", 4: "vp", 7: "t g", 8: "t a", 11: "c", 12: "c", 15: "a", 16: "c", 17: "s", 18: "g c", 19: "af", 22: "r", 23: "af", 24: "af", 33: "c" } },
  es: { size: 37, tags: { 0: "co", 1: "r", 2: "vp", 4: "ar g", 5: "co", 8: "t", 9: "t", 10: "t", 12: "vp", 15: "cli", 16: "a t", 17: "a", 18: "r", 19: "s", 22: "cli", 23: "s", 24: "s", 25: "s", 27: "s", 28: "r", 30: "s", 33: "s", 34: "h" } },
  fr: { size: 37, tags: { 0: "co r", 2: "ar g", 4: "vp", 8: "t ax", 9: "t ax", 10: "t", 12: "r", 13: "cli", 16: "a t", 17: "cli", 19: "t", 23: "s", 24: "s", 25: "s", 26: "t", 28: "cli", 31: "s", 33: "s", 35: "t" } },
  it: { size: 38, tags: { 0: "co vp", 1: "r", 2: "ar g", 3: "vp", 8: "t ax", 9: "t ax", 10: "r", 12: "a", 15: "ar", 16: "a", 17: "a t", 18: "t", 19: "cli", 20: "cli", 22: "s", 24: "s", 25: "s", 28: "s", 29: "r", 32: "s", 33: "cli" } },
  pt: { size: 36, tags: { 0: "co", 1: "co", 2: "ar g", 3: "vp", 6: "vp", 8: "t", 9: "t", 10: "t", 11: "a", 15: "a", 16: "a t", 17: "s", 19: "cli", 20: "vp", 22: "s", 23: "s", 24: "s", 25: "vp", 28: "r", 30: "s", 34: "h" } },
  en: { size: 40, tags: { 0: "co vp", 1: "vp t", 2: "ar", 7: "t", 8: "a", 9: "t", 15: "a", 16: "a", 26: "s", 27: "s", 28: "t", 30: "s" } },
};
const SHORT: Record<string, Feature | "order"> = { ar: "article", g: "gender", c: "case", p: "particle", cl: "classifier", h: "honorific", vp: "verbPerson", t: "tense", a: "aspect", s: "subjunctive", co: "copula", cli: "clitic", r: "reflexive", ax: "auxChoice", af: "affix", o: "order" };

/** 사다리 순서 번호(`grammarList` 차례, 0부터) → 특징·어순 칸인가. */
export function slotTags(language: string, index: number): { features: Feature[]; order: boolean } {
  const codes = (SLOT_TAGS[language]?.tags[index] ?? "").split(" ").filter(Boolean).map((code) => SHORT[code]).filter(Boolean);
  return { features: codes.filter((code): code is Feature => code !== "order"), order: codes.includes("order") };
}
export const slotTagSize = (language: string) => SLOT_TAGS[language]?.size ?? 0;

/** 그 특징이 모국어(l1)에서 학습 언어(l2)로 갈 때: new 처음 보는 개념 · weaker 모국어엔 약하게만 · same 비슷하게 있음. */
export type Transfer = "new" | "weaker" | "same";
export function transferOf(l1: string, l2: string, feature: Feature): Transfer | null {
  const a = PROFILES[l1]?.has[feature];
  const b = PROFILES[l2]?.has[feature];
  if (a === undefined || b === undefined || b === 0) return null;
  if (a === 0) return "new";
  if (a < b) return "weaker";
  return "same";
}

const WEIGHT: Record<Transfer, number> = { new: 1.5, weaker: 1.25, same: 0.8 };
/** 어순이 다르면 어순 칸에 이만큼. */
const ORDER_WEIGHT = 1.3;

/**
 * 학습 언어 문법 칸 하나(사다리 순서 번호)의 비중(1 = 보통): 그 칸 특징마다 가장 무거운 것. 같은 언어·모르는 언어·특징 없는 칸이면 1.
 * 예: es → ja 조사 칸 1.5(스페인어엔 조사가 없음), ko → ja 조사 칸 0.8, ja → en 관사 칸 1.5.
 */
export function slotWeight(l1: string, l2: string, index: number): number {
  if (!l1 || l1 === l2 || !PROFILES[l1] || !PROFILES[l2]) return 1;
  const { features, order } = slotTags(l2, index);
  const weights = features.map((feature) => transferOf(l1, l2, feature)).filter((one): one is Transfer => one !== null).map((one) => WEIGHT[one]);
  if (order && PROFILES[l1]!.order !== PROFILES[l2]!.order) weights.push(ORDER_WEIGHT);
  return weights.length ? Math.max(...weights) : 1;
}

/** 조합 한눈에: 학습 언어에 있고 모국어엔 없는 특징 · 약한 특징 · 같은 글자인가 · 같은 어순인가. */
export function pairSummary(l1: string, l2: string): { fresh: Feature[]; weaker: Feature[]; sameScript: boolean; sameOrder: boolean } | null {
  const a = PROFILES[l1];
  const b = PROFILES[l2];
  if (!a || !b) return null;
  const features = Object.keys(b.has) as Feature[];
  return {
    fresh: features.filter((feature) => transferOf(l1, l2, feature) === "new"),
    weaker: features.filter((feature) => transferOf(l1, l2, feature) === "weaker"),
    sameScript: a.script === b.script || (a.script === "hanzi" && b.script === "kana"),
    sameOrder: a.order === b.order,
  };
}
