/**
 * 빈도 단어 묶음(2026-10-29 사용자 "언어별 단어 묶음을 정해 두고 계속 학습하면 다 습득 가능하게" → "3개 언어부터",
 * 설계 hub/drafts/vocab-bank-2026-10-29.md). 지속 학습의 어휘 분모 — My 뼈대(대본)와 따로 센다.
 *
 * 목록: 많이 쓰는 순서 3,000개(일상 대화 낱말 약 95%), 언어마다 `vocab/<언어>.ts`(scripts/vocab-bank/build.py → 검토 → 고정).
 *   en·es = FrequencyWords(OpenSubtitles 2018 자막 빈도, 목록 CC BY-SA 4.0), ja = wordfreq(데이터 CC BY-SA 4.0) — 사전형으로 묶고 이름·잡음을 뺌.
 * 열쇠 w|낱말. 낱말 카드(예문·뜻)는 서버가 50개 묶음마다 한 번 만들어 모두가 같이 씀(/api/curriculum/words).
 * 이미 앎·확인 중은 다른 열쇠와 같은 규칙(curriculum/known.ts — 다른 날 세 번 맞힘). 순수 + 목록 불러오기.
 */
export type BankWord = { w: string; pos: string; reading?: string; topic?: string };

/** 낱말 나누기(2026-10-29 사용자 "세 기준 다 채택하고 사용자가 품사 위주, 품사 안에선 명사 위주 이렇게 정하도록"). */
export type VocabBy = "all" | "band" | "pos" | "topic";
export type VocabPick = { by: VocabBy; value: string };
export const BAND_SIZE = 500;
export const POS_GROUPS = ["noun", "verb", "adj", "adv", "function"] as const;
export const TOPICS = ["people", "food", "home", "work", "health", "travel", "shopping", "time", "feelings", "actions", "describing", "nature", "society", "function"] as const;

/** 품사 묶음: 명사·동사·형용사·부사, 나머지(대명사·관사·전치사·접속사·수·감탄사)는 기능어. */
export function posGroup(pos: string): (typeof POS_GROUPS)[number] {
  return pos === "noun" || pos === "verb" || pos === "adj" || pos === "adv" ? pos : "function";
}

/** 그 낱말(목록 순위 index)이 고른 칸에 드는지. */
export function inPick(word: BankWord, index: number, pick: VocabPick | null | undefined): boolean {
  if (!pick || pick.by === "all") return true;
  if (pick.by === "band") return String(Math.floor(index / BAND_SIZE)) === pick.value;
  if (pick.by === "pos") return posGroup(word.pos) === pick.value;
  return (word.topic ?? "") === pick.value;
}

/** 그 기준의 칸들(목록에 있는 것만, 정해진 순서). */
export function groupsOf(list: readonly BankWord[], by: Exclude<VocabBy, "all">): string[] {
  if (by === "band") return Array.from({ length: Math.ceil(list.length / BAND_SIZE) }, (_, i) => String(i));
  const have = new Set(list.map((word) => (by === "pos" ? posGroup(word.pos) : (word.topic ?? ""))).filter(Boolean));
  const order: readonly string[] = by === "pos" ? POS_GROUPS : TOPICS;
  return order.filter((id) => have.has(id));
}

export const BANK_LANGS = ["en", "es", "ja"] as const;
export const BANK_CHUNK = 50;
/** 출처 표시(CC BY-SA 4.0). */
export const BANK_SOURCES: Record<string, string> = {
  en: "FrequencyWords (Hermit Dave, OpenSubtitles 2018), CC BY-SA 4.0",
  es: "FrequencyWords (Hermit Dave, OpenSubtitles 2018), CC BY-SA 4.0",
  ja: "wordfreq (Robyn Speer; SUBTLEX, OpenSubtitles, Wikipedia 등), CC BY-SA 4.0",
};

export function hasBank(language: string): boolean {
  return (BANK_LANGS as readonly string[]).includes(language);
}

export const wordKey = (word: string) => `w|${word}`;

const loaded = new Map<string, readonly BankWord[]>();

function fromRows(rows: readonly (readonly string[])[], language: string): BankWord[] {
  return rows.map((row) =>
    language === "ja"
      ? { w: row[0]!, reading: row[1], pos: row[2] ?? "", ...(row[3] ? { topic: row[3] } : {}) }
      : { w: row[0]!, pos: row[1] ?? "", ...(row[2] ? { topic: row[2] } : {}) },
  );
}

/** 그 언어의 목록(처음 한 번 불러옴). 없는 언어는 []. */
export async function loadBank(language: string): Promise<readonly BankWord[]> {
  if (!hasBank(language)) return [];
  const have = loaded.get(language);
  if (have) return have;
  const rows =
    language === "en" ? (await import("./vocab/en.ts")).WORDS : language === "es" ? (await import("./vocab/es.ts")).WORDS : (await import("./vocab/ja.ts")).WORDS;
  const list = fromRows(rows, language);
  loaded.set(language, list);
  return list;
}

/** 이미 불러온 목록(없으면 null) — 화면이 그리는 동안 기다리지 않게. */
export function peekBank(language: string): readonly BankWord[] | null {
  return loaded.get(language) ?? null;
}
