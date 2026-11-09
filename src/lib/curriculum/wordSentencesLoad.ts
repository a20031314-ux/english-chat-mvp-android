/**
 * 사전 예문(낱말마다 고정 예문 두 개, `word-sentences/<언어>.json` — Tatoeba·사전·직접 쓴 것, 출처는 `public/credits/example-sentences.txt`).
 * 앱(📕 사전·어휘 퀴즈 재료)과 서버(낱말 카드 묶음에 붙여 보냄·문제은행이 예문 있는 낱말은 키우지 않음)가 같이 쓴다.
 * 2026-11-06 사용자 "퀴즈 알고리즘부터 — 예문 없는 단어는 퀴즈 풀 때마다 예문 생성 → 사전에 추가".
 */

export type DictSentence = { text?: string; en?: string; ko?: string; blank?: string; src?: string };
export type SentenceBook = Record<string, DictSentence[]>;
/** 퀴즈에 쓸 수 있는 사전 예문 한 줄(빈칸 조각이 문장에 그대로 든 것). */
export type DictLine = { text: string; piece: string; en: string; ko: string };

const SENTENCES: Record<string, () => Promise<{ default: SentenceBook }>> = {
  ar: () => import("./word-sentences/ar.json"),
  en: () => import("./word-sentences/en.json"),
  es: () => import("./word-sentences/es.json"),
  fr: () => import("./word-sentences/fr.json"),
  hi: () => import("./word-sentences/hi.json"),
  id: () => import("./word-sentences/id.json"),
  it: () => import("./word-sentences/it.json"),
  ja: () => import("./word-sentences/ja.json"),
  ko: () => import("./word-sentences/ko.json"),
  pt: () => import("./word-sentences/pt.json"),
  ru: () => import("./word-sentences/ru.json"),
  th: () => import("./word-sentences/th.json"),
  vi: () => import("./word-sentences/vi.json"),
  zh: () => import("./word-sentences/zh.json"),
};

const cache = new Map<string, Promise<SentenceBook | null>>();
/** 그 언어의 사전 예문 전체(없거나 못 읽으면 null). 한 번 읽으면 기억. */
export function loadWordSentences(language: string): Promise<SentenceBook | null> {
  const have = cache.get(language);
  if (have) return have;
  const made = (SENTENCES[language]?.().then((mod) => mod.default).catch(() => null) ?? Promise.resolve(null)) as Promise<SentenceBook | null>;
  cache.set(language, made);
  return made;
}

/** 낱말 하나의 사전 예문 중 퀴즈에 쓸 수 있는 것(빈칸 조각이 문장에 그대로 든 것), 셋까지. */
export function dictLinesOf(book: SentenceBook | null, word: string): DictLine[] {
  const out: DictLine[] = [];
  for (const one of book?.[`w|${word}`] ?? []) {
    const text = one.text?.trim();
    const piece = (one.blank ?? word).trim();
    if (!text || !piece || !text.includes(piece)) continue;
    out.push({ text, piece, en: one.en?.trim() ?? "", ko: one.ko?.trim() ?? "" });
    if (out.length >= 3) break;
  }
  return out;
}
