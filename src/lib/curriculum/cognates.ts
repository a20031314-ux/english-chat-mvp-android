/**
 * 닮은 말(languagePairs.ts ②, 2026-11-08): 학습 언어 낱말 → 모국어의 닮은 낱말(뜻도 같음) · 뜻이 다른 닮은 말.
 * 데이터 `pairs/cognates.json` = scripts/cognates.py(사전 예문의 영어 번역으로 뜻 대조 · 뜻이 다른 것은 Claude가 고른 목록을 예문으로 확인).
 * 범위: es·fr·it·pt·id ↔ en(과 그 사이), ja ↔ zh(같은 한자 낱말). 쓰는 곳(다음): 닮은 말은 빨리 확인만, 뜻이 다른 닮은 말은 따로 문제.
 */
export type CognateBook = Record<string, Record<string, Record<string, string>>> & { f?: Record<string, Record<string, string>> };
type Book = CognateBook;

/** 순수: 책에서 닮은 말(뜻 같음). */
export const cognateIn = (book: Book | null, l2: string, word: string, l1: string): string | null => book?.[l2]?.[word]?.[l1] ?? null;
/** 순수: 책에서 뜻이 다른 닮은 말. */
export const falseFriendIn = (book: Book | null, l2: string, word: string, l1: string): string | null => book?.f?.[`${l2}>${l1}`]?.[word] ?? null;

let cached: Promise<Book | null> | null = null;
// JSON 모양 그대로 받으면 타입이 너무 커서 unknown으로 받는다.
const load = () => (cached ??= import("./pairs/cognates.json").then((mod) => (mod as { default: unknown }).default as Book).catch(() => null));

/** 학습 언어(l2) 낱말의 모국어(l1) 닮은 말 — 뜻이 같은 것만. 없으면 null. */
export async function cognateOf(l2: string, word: string, l1: string): Promise<string | null> {
  return cognateIn(await load(), l2, word, l1);
}

/** 학습 언어(l2) 낱말이 모국어(l1, 지금은 영어만)의 닮은 말과 뜻이 다르면 그 닮은 말. */
export async function falseFriendOf(l2: string, word: string, l1: string): Promise<string | null> {
  return falseFriendIn(await load(), l2, word, l1);
}
