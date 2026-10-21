import { segmentWords } from "../wordSegments.ts";

/**
 * 같은 소리를 두 받아쓰기가 얼마나 같게 들었나 — 방 내 줄 교정의 "믿을 만한 받아쓰기" 판정(2026-10-22, 사용자 결정 (나)).
 *
 * 교정은 학습자가 실제로 한 말에만 걸어야 한다. 잘못 들은 낱말을 학습자 실수로 고치면 안 되니,
 * 두 모델이 같게 들은 줄만 고친다:
 * - match: 낱말이 모두 같다(문장부호·대소문자는 무시) → 교정.
 * - structure: 낱말 수·순서가 거의 같고 다른 낱말이 적다 → 교정하되, 다르게 들은 낱말(disputed)은 고치지 않는다.
 * - differ: 구조가 다르다 → 교정하지 않는다("?"만).
 * 낱말 자르기는 wordSegments(일본어·중국어·타이 문자도 낱말로). 모델 호출 없음, 서버·테스트가 같이 쓴다.
 */

export type Agreement = { kind: "match" | "structure" | "differ"; disputed: string[] };

/** 다른 낱말이 이 몫을 넘으면 구조가 다르다고 본다. */
export const MAX_DIFFERENT_SHARE = 0.2;

/** 비교용 낱말: 소문자·NFC, 문장부호·기호를 뺀다(모음 부호 \p{M}는 남긴다 — 타이·힌디). */
export function comparableWords(text: string, language?: string): string[] {
  return segmentWords(text.normalize("NFC").toLowerCase().replace(/[’]/g, "'"), language)
    .map((word) => word.replace(/[^\p{L}\p{M}\p{N}']/gu, "").replace(/^'+|'+$/g, ""))
    .filter(Boolean);
}

/** 가장 긴 공통 낱말 순서 — a에서 그 순서에 든 자리(true)를 돌려준다. */
function keptInA(a: string[], b: string[]): boolean[] {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const table: number[][] = Array.from({ length: rows }, () => new Array<number>(cols).fill(0));
  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) {
      table[i][j] = a[i] === b[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }
  const kept = new Array<boolean>(a.length).fill(false);
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      kept[i] = true;
      i += 1;
      j += 1;
    } else if (table[i + 1][j] >= table[i][j + 1]) {
      i += 1;
    } else {
      j += 1;
    }
  }
  return kept;
}

/**
 * first(화면에 뜬 받아쓰기)와 second(두 번째 의견)를 견준다. disputed는 first 쪽 낱말(비교용 모양).
 */
export function compareTranscripts(first: string, second: string, language?: string): Agreement {
  const a = comparableWords(first, language);
  const b = comparableWords(second, language);
  if (a.length === 0 || b.length === 0) return { kind: "differ", disputed: [] };
  if (a.length === b.length && a.every((word, index) => word === b[index])) return { kind: "match", disputed: [] };
  const longest = Math.max(a.length, b.length);
  const kept = keptInA(a, b);
  const same = kept.filter(Boolean).length;
  const allowed = Math.max(1, Math.floor(longest * MAX_DIFFERENT_SHARE));
  // 짧은 줄(낱말 셋 이하)은 하나만 달라도 뜻이 흔들리니 구조 일치로 보지 않는다.
  if (longest <= 3 || longest - same > allowed || Math.abs(a.length - b.length) > allowed) {
    return { kind: "differ", disputed: [] };
  }
  return { kind: "structure", disputed: [...new Set(a.filter((_, index) => !kept[index]))] };
}

/** 고친 문장이 다르게 들은 낱말을 건드렸나(그 낱말이 고친 문장에 더는 없음). 건드렸으면 그 교정은 버린다. */
export function touchesDisputed(corrected: string, disputed: readonly string[], language?: string): boolean {
  if (disputed.length === 0) return false;
  const words = new Set(comparableWords(corrected, language));
  return disputed.some((word) => !words.has(word));
}
