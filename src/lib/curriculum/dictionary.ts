/**
 * 단어 사전 검색(2026-11-04). 빈도 목록을 단어·읽기·뜻으로 찾는다.
 * 조합 부호(\p{M})는 떼지 않는다 — 태국어 성조·힌디어 모음 기호가 다른 말이 되면 안 된다.
 */

export type DictEntry = {
  word: string;
  pos: string;
  reading?: string;
  stage: number;
  /** 짧은 뜻. 있는 언어·있는 낱말만. */
  gloss?: string;
  line?: string;
  lineKo?: string;
  lineEn?: string;
};

const fold = (text: string) => text.normalize("NFC").toLocaleLowerCase();

/** 앞부분이 맞는 것을 먼저, 빈도 순은 들어온 순 그대로. 빈 검색은 빈 목록. */
export function searchDictionary(entries: readonly DictEntry[], query: string, limit = 40): DictEntry[] {
  const q = fold(query.trim());
  if (!q) return [];
  const prefix: DictEntry[] = [];
  const rest: DictEntry[] = [];
  for (const entry of entries) {
    const fields = [entry.word, entry.reading, entry.gloss].filter((one): one is string => Boolean(one)).map(fold);
    if (fields.some((one) => one.startsWith(q))) prefix.push(entry);
    else if (fields.some((one) => one.includes(q))) rest.push(entry);
    if (prefix.length >= limit) break;
  }
  return [...prefix, ...rest].slice(0, limit);
}
