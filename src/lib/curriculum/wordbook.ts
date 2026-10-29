/**
 * 지속 학습의 단어장(2026-10-29 사용자 "문법·표현·발음 데이터는 단계 학습 쪽에 통합하고 어휘는 예전의 단어장 개념으로 채우도록" → 배운 낱말 목록).
 * 퀴즈·시험·대화에서 만난 낱말 열쇠(known.ts — e|짧은 표현·u|대화·찾아본 낱말·w|빈도 단어, 낱말 갈래만)와 사용자가 저장한 단어(lib/vocabulary.ts, 그 학습 언어)를
 * 한 목록으로: 이미 앎 / 배우는 중 / 저장만. 최근 것 먼저. 분모(3,000)는 두지 않는다. 순수.
 */
import { knownState, type KnownMap } from "./known.ts";
import { keyPart } from "./nextStudy.ts";

export type WordbookRow = { word: string; state: "known" | "learning" | "saved"; gloss: string; at: number };

export function wordbook(
  language: string,
  known: KnownMap,
  saved: readonly { word: string; gloss: string; languageCode: string; createdAt: number }[],
  glossOf: (word: string) => string = () => "",
): WordbookRow[] {
  const rows = new Map<string, WordbookRow>();
  const norm = (word: string) => word.trim().toLowerCase();
  for (const [key, entry] of Object.entries(known)) {
    if (key.length < 3 || keyPart(language, key) !== "vocab") continue;
    const word = key.slice(2).trim();
    if (!word) continue;
    const state = knownState(known, key) === "known" ? "known" : "learning";
    const before = rows.get(norm(word));
    if (before && (before.state === "known" || state === "learning")) continue;
    rows.set(norm(word), { word, state, gloss: glossOf(word), at: entry.at });
  }
  for (const entry of saved) {
    if (entry.languageCode !== language || !entry.word.trim()) continue;
    const before = rows.get(norm(entry.word));
    if (before) {
      if (!before.gloss && entry.gloss) before.gloss = entry.gloss;
      continue;
    }
    rows.set(norm(entry.word), { word: entry.word.trim(), state: "saved", gloss: entry.gloss, at: entry.createdAt });
  }
  return [...rows.values()].sort((a, b) => b.at - a.at);
}
