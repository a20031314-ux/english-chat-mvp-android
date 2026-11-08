/**
 * 낱말 성질(2026-11-08 사용자 "언어별로 변형 가능한 요소·중요한 요소가 다 다르잖아" → "사전은 언어별 특성이 반영돼 있어?" → "여기서 만들 수 있어?" → "진행해줘").
 * 사전(빈도 목록·예문·뜻)은 모든 언어에 같은 칸만 있어서, 언어마다 문법에 쓰이는 낱말 성질을 따로 둔다 — `word-traits/<언어>.json`, 낱말 사전형 → 성질.
 * 공개 사전 패키지로 뽑고 남는 칸은 Claude가 채움(원어민 확인 전). 출처·라이선스는 `public/credits/word-traits.txt`.
 * 쓰는 곳(다음): 맞나 틀리나 규칙 칸(관사 성·일치·상·양사·활용, hub/drafts/judge-slots-2026-11-08.md), 사전 낱말 화면.
 */

export type WordTraits = {
  /** 명사 성: m 남성 · f 여성 · n 중성 · mf 둘 다(뜻·지역에 따라) · pl 복수로만 씀(ru 복수 명사 등). */
  g?: "m" | "f" | "n" | "mf" | "pl";
  /** 동사 상(ru): i 불완료 · p 완료 · b 둘 다. */
  a?: "i" | "p" | "b";
  /** 상 짝(ru, 있으면): 다른 상의 낱말. */
  ap?: string;
  /** 양사(zh·th·vi): 그 명사를 셀 때 쓰는 말, 흔한 것부터. */
  cl?: string[];
  /** 동사 종류(ja): 5 오단 · 1 일단 · k 来る · s する. */
  vt?: "5" | "1" | "k" | "s";
  /** 형용사 종류(ja): i い형용사 · na な형용사. */
  jt?: "i" | "na";
  /** 불규칙 활용(ko): ㅂ·ㄷ·르·ㅅ·ㅎ·러·우·여(하다). 규칙이면 없음(소리가 같은 다른 낱말 — 묻다 "땅에" — 은 흔한 뜻으로: 묻다 ㄷ). */
  ir?: string;
  /** 높임·겸양 짝(ko·ja): 존경 · 겸양. */
  hon?: { up?: string; down?: string };
  /** 불규칙 꼴(en 동사: past·pp, 명사 pl): 규칙 꼴이면 없음. */
  f?: { past?: string; pp?: string; pl?: string };
  /** 셀 수 있음(en 명사): c 셀 수 있음 · u 셀 수 없음 · b 둘 다. */
  cnt?: "c" | "u" | "b";
  /** 불규칙 복수(ar 등). */
  pl?: string;
  /** 로마자 읽기(th·hi·ar). */
  rom?: string;
};
export type TraitBook = Record<string, WordTraits>;

// JSON 모양 그대로 받으면 타입이 너무 커서 unknown으로 받고 TraitBook으로 본다.
const BOOKS: Record<string, () => Promise<{ default: unknown }>> = {
  ar: () => import("./word-traits/ar.json"),
  en: () => import("./word-traits/en.json"),
  es: () => import("./word-traits/es.json"),
  fr: () => import("./word-traits/fr.json"),
  hi: () => import("./word-traits/hi.json"),
  it: () => import("./word-traits/it.json"),
  ja: () => import("./word-traits/ja.json"),
  ko: () => import("./word-traits/ko.json"),
  pt: () => import("./word-traits/pt.json"),
  ru: () => import("./word-traits/ru.json"),
  zh: () => import("./word-traits/zh.json"),
};

const cache = new Map<string, Promise<TraitBook | null>>();

/** 그 언어의 낱말 성질(없는 언어는 null). */
export function loadWordTraits(language: string): Promise<TraitBook | null> {
  const have = cache.get(language);
  if (have) return have;
  const made = BOOKS[language]?.().then((mod) => mod.default as TraitBook).catch(() => null) ?? Promise.resolve(null);
  cache.set(language, made);
  return made;
}

export const TRAIT_LANGUAGES = Object.keys(BOOKS);
