/**
 * 빈도 단어 묶음(2026-10-29 사용자 "언어별 단어 묶음을 정해 두고 계속 학습하면 다 습득 가능하게" → "3개 언어부터",
 * 설계 hub/drafts/vocab-bank-2026-10-29.md). 지속 학습의 어휘 분모 — My 뼈대(대본)와 따로 센다.
 *
 * 목록: 많이 쓰는 순서 3,000개(일상 대화 낱말 약 95%), 언어마다 `vocab/<언어>.ts`(scripts/vocab-bank/build.py → 검토 → 고정).
 *   en·es = FrequencyWords(OpenSubtitles 2018 자막 빈도, 목록 CC BY-SA 4.0), ja = wordfreq(데이터 CC BY-SA 4.0) — 사전형으로 묶고 이름·잡음을 뺌.
 * 열쇠 w|낱말. 낱말 카드(예문·뜻)는 서버가 50개 묶음마다 한 번 만들어 모두가 같이 씀(/api/curriculum/words).
 * 이미 앎·확인 중은 다른 열쇠와 같은 규칙(curriculum/known.ts — 다른 날 세 번 맞힘). 순수 + 목록 불러오기.
 */
export type BankWord = { w: string; pos: string; reading?: string; topic?: string; /** 단계(1~5, 6 = 확장) — wordStage가 붙임, 찾아서 더한 낱말은 서버가 판정. */ stage?: number };

/** 낱말 나누기(2026-10-29 사용자 "세 기준 다 채택하고 사용자가 품사 위주, 품사 안에선 명사 위주 이렇게 정하도록"). */
// "band"(500개씩 많이 쓰는 순)는 2026-10-31에 "stage"(단계)로 바꿈 — 옛 설정의 band는 전체로 읽는다.
export type VocabBy = "all" | "stage" | "pos" | "topic";
export type VocabPick = { by: VocabBy; value: string };
export const BAND_SIZE = 500;
export const POS_GROUPS = ["noun", "verb", "adj", "adv", "function"] as const;
export const TOPICS = ["people", "food", "home", "work", "health", "travel", "shopping", "time", "feelings", "actions", "describing", "nature", "society", "function"] as const;

/** 품사 묶음: 명사·동사·형용사·부사, 나머지(대명사·관사·전치사·접속사·수·감탄사)는 기능어. */
export function posGroup(pos: string): (typeof POS_GROUPS)[number] {
  return pos === "noun" || pos === "verb" || pos === "adj" || pos === "adv" ? pos : "function";
}

/**
 * 퀴즈 보기를 맞출 품사(사용자 2026-10-30 "선지가 다수일 시 다 같은 품사로"): 명사·동사·형용사·부사는 그대로,
 * 기능어는 한 묶음(posGroup "function")으로 뭉치지 않고 목록의 품사 그대로(대명사·전치사·관사·접속사·감탄사·수사) — "I / on / he"가 안 나오게.
 */
export function quizPos(pos: string): string {
  const group = posGroup(pos);
  return group === "function" ? pos || "other" : group;
}

/** 그 낱말(목록 순위 index)이 고른 칸에 드는지. 단계 칸은 그 단계 낱말만(wordStage가 붙인 stage). */
export function inPick(word: BankWord, index: number, pick: VocabPick | null | undefined): boolean {
  if (!pick || pick.by === "all" || !pick.value) return true;
  if (pick.by === "stage") return String(word.stage ?? 6) === pick.value;
  if (pick.by === "pos") return posGroup(word.pos) === pick.value;
  return (word.topic ?? "") === pick.value;
}

/** 그 기준의 칸들(목록에 있는 것만, 정해진 순서). 단계는 1~upTo(내 단계까지). */
export function groupsOf(list: readonly BankWord[], by: Exclude<VocabBy, "all">, upTo = 5): string[] {
  if (by === "stage") {
    const have = new Set(list.map((word) => word.stage ?? 6));
    return [1, 2, 3, 4, 5].filter((n) => n <= upTo && have.has(n)).map(String);
  }
  const have = new Set(list.map((word) => (by === "pos" ? posGroup(word.pos) : (word.topic ?? ""))).filter(Boolean));
  const order: readonly string[] = by === "pos" ? POS_GROUPS : TOPICS;
  return order.filter((id) => have.has(id));
}

/**
 * 단계마다 필수 낱말 범위(누적, 사전형 — 2026-10-31 사용자 "실력 기준으로 이 정도 단어가 필수라는 범위를 정해 놓고 층위",
 * 설계 hub/drafts/vocab-levels-2026-10-31.md): 순위가 이 칸들 중 어디에 드는지가 그 낱말의 단계. 마지막 칸 뒤는 확장(6).
 * 근거: 구어 95%·98% 덮는 몫(Nation 2006), CEFR 어휘 크기(Milton & Alexiou 2009), HSK 2025·JLPT 어림·국립국어원 학습용 어휘.
 */
export const STAGE_CUTS: Record<string, readonly number[]> = {
  default: [700, 1500, 2500, 3500, 5000],
  ja: [800, 1500, 2500, 3750, 6000],
  zh: [500, 1000, 2000, 3600, 5400],
  ko: [500, 1000, 2000, 3100, 6000],
};
export const EXTENDED_STAGE = 6;

export function stageCuts(language: string): readonly number[] {
  return STAGE_CUTS[language] ?? STAGE_CUTS.default!;
}

/** 순위(0부터) → 단계 1~5, 넘으면 6(확장). */
export function stageOfRank(language: string, index: number): number {
  const cuts = stageCuts(language);
  const at = cuts.findIndex((cut) => index < cut);
  return at < 0 ? EXTENDED_STAGE : at + 1;
}

/**
 * 낱말의 단계: 순위 칸, 단 앱이 그 단계에서 가르치는 낱말(대본 줄에 나옴)은 그 단계 이하로 당긴다(appStage — 부르는 쪽이 준 표).
 * 찾아서 더한 낱말(stage가 이미 있음)은 그대로.
 */
export function wordStage(language: string, word: BankWord, index: number, appStage?: ReadonlyMap<string, number>): number {
  if (word.stage) return word.stage;
  const byRank = stageOfRank(language, index);
  const taught = appStage?.get(word.w.toLocaleLowerCase());
  return taught ? Math.min(byRank, taught) : byRank;
}

type Rows = readonly (readonly string[])[];
/** 언어마다 목록 파일(처음 한 번 불러옴 — 앱 묶음을 언어마다 나눔). 목록 만들기: scripts/vocab-bank/(build·emit). 2026-10-31부터 14개 언어로 늘리는 중. */
const LOADERS: Record<string, () => Promise<{ WORDS: Rows }>> = {
  en: () => import("./vocab/en.ts"),
  es: () => import("./vocab/es.ts"),
  ja: () => import("./vocab/ja.ts"),
  it: () => import("./vocab/it.ts"),
  fr: () => import("./vocab/fr.ts"),
  id: () => import("./vocab/id.ts"),
  ko: () => import("./vocab/ko.ts"),
  pt: () => import("./vocab/pt.ts"),
  vi: () => import("./vocab/vi.ts"),
  ar: () => import("./vocab/ar.ts"),
  hi: () => import("./vocab/hi.ts"),
  ru: () => import("./vocab/ru.ts"),
  th: () => import("./vocab/th.ts"),
  // ADD-LOADERS
};
export const BANK_LANGS: readonly string[] = Object.keys(LOADERS);
export const BANK_CHUNK = 50;
/** 출처 표시(CC BY-SA 4.0). */
export const BANK_SOURCES: Record<string, string> = {
  en: "FrequencyWords (Hermit Dave, OpenSubtitles 2018), CC BY-SA 4.0",
  es: "FrequencyWords (Hermit Dave, OpenSubtitles 2018), CC BY-SA 4.0",
  ja: "wordfreq (Robyn Speer; SUBTLEX, OpenSubtitles, Wikipedia 등), CC BY-SA 4.0",
  hi: "wordfreq (Robyn Speer), CC BY-SA 4.0",
};
/** 그 밖의 언어는 FrequencyWords(OpenSubtitles 2018). */
export function bankSource(language: string): string {
  return BANK_SOURCES[language] ?? "FrequencyWords (Hermit Dave, OpenSubtitles 2018), CC BY-SA 4.0";
}

export function hasBank(language: string): boolean {
  return BANK_LANGS.includes(language);
}

export const wordKey = (word: string) => `w|${word}`;

const loaded = new Map<string, readonly BankWord[]>();
/** 읽기 칸이 있는 언어(일본어 가나·중국어 병음). */
const READING = new Set(["ja", "zh"]);

function fromRows(rows: Rows, language: string): BankWord[] {
  return rows.map((row) =>
    READING.has(language)
      ? { w: row[0]!, reading: row[1], pos: row[2] ?? "", ...(row[3] ? { topic: row[3] } : {}) }
      : { w: row[0]!, pos: row[1] ?? "", ...(row[2] ? { topic: row[2] } : {}) },
  );
}

/** 그 언어의 목록(처음 한 번 불러옴). 없는 언어는 []. */
export async function loadBank(language: string): Promise<readonly BankWord[]> {
  const load = LOADERS[language];
  if (!load) return [];
  const have = loaded.get(language);
  if (have) return have;
  const list = fromRows((await load()).WORDS, language);
  loaded.set(language, list);
  return list;
}

/** 이미 불러온 목록(없으면 null) — 화면이 그리는 동안 기다리지 않게. */
export function peekBank(language: string): readonly BankWord[] | null {
  return loaded.get(language) ?? null;
}
