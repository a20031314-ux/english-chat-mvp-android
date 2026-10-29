/**
 * 뼈대 밖에서 막힌 것(2026-10-29 사용자 "뼈대 외의 단어·문법·구문은 사용자가 뭘 모르는지 파악하고 학습하게" → "시작해줘").
 *
 * 신호(2026-10-29 "진행해줘"로 넷 — 흩어진 신호 연결):
 *  - 튜터가 고친 줄(노트 카드, 이미 계정에 저장됨): 고친 줄에 새로 들어간 말(낱말 차이) = 몰랐던 말.
 *  - "표현 보기"(채팅에서 편한 말로 쓰고 연 표현 카드): 그 표현 = 말하고 싶었는데 몰랐던 말. 내가 쓴 줄은 이 폰에만(학습자 문장은 서버에 안 둠).
 *  - 낱말을 눌러 뜻을 봄(채팅·영상 자막·문장분석 어디서나, VocabPreviewProvider): 그 낱말 — 문장은 예문(없으면 그 줄), 이 폰에만.
 *  - 통화 돌아보기에서 고친 문장을 펼침(RoleplayReview): 고친 줄에 새로 들어간 말, 이 폰에만.
 * 그 말이 뼈대 표현(e|)이면 그 열쇠로, 아니면 u|말 — 지속 학습(계속 공부·오늘 할 것 채우기)이 퀴즈로 던지고,
 * 다른 날 세 번 맞히면 이미 앎(curriculum/known.ts). 숙지·그래프(뼈대 진척)에는 넣지 않는다(PRODUCT 핵심 가치 9).
 * 순수 + 이 폰 저장(localStorage) 둘.
 */
import { isCurriculumKey } from "./dailyPlan.ts";
import type { QuizCard, QuizSource } from "./quiz.ts";
import { isSpaceless, segmentWords } from "../wordSegments.ts";

export type GapItem = {
  key: string;
  /** 학습 언어 — 몰랐던 말. */
  text: string;
  /** 문제 재료: 그 말이 든 문장(고친 줄 또는 표현 카드 예문). */
  sample: string;
  /** 문장의 뜻(앱 언어) — 내가 편한 말로 쓴 줄(이 폰에만). 없으면 말하기 문제 대신 고르기·맞추기. */
  meaning?: string;
  from: "fix" | "howToSay" | "lookup";
  at: number;
  /** 고친 줄이면 틀린 줄 고르기 문제용. */
  card?: QuizCard;
};

export const GAP_MAX = 120;
const LOCAL_KEY = "gaps.v1";

const clean = (text: string) => text.replace(/\s+/g, " ").trim();

/** u|열쇠: 소문자·앞뒤 부호 뺌, 80자까지. 뼈대 표현이면 e|. */
export function gapKey(language: string, text: string): string | null {
  const bare = clean(text)
    .toLocaleLowerCase()
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
  if (!bare || bare.length > 60) return null;
  if (isCurriculumKey(language, `e|${bare}`)) return `e|${bare}`;
  return `u|${bare}`;
}

/** 고친 줄에 새로 들어간 말: 낱말(띄어쓰기 없는 말은 잘라서) 차이에서 가장 긴 연속 덩어리, 네 낱말까지. */
export function addedPiece(language: string, wrong: string, right: string): string | null {
  const a = segmentWords(wrong, language).map((w) => w.toLocaleLowerCase());
  const bWords = segmentWords(right, language);
  const b = bWords.map((w) => w.toLocaleLowerCase());
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i -= 1) for (let j = b.length - 1; j >= 0; j -= 1) dp[i]![j] = a[i] === b[j] ? dp[i + 1]![j + 1]! + 1 : Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!);
  const kept = new Array<boolean>(b.length).fill(false);
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      kept[j] = true;
      i += 1;
      j += 1;
    } else if (dp[i + 1]![j]! >= dp[i]![j + 1]!) i += 1;
    else j += 1;
  }
  let best: string[] = [];
  let run: string[] = [];
  bWords.forEach((word, index) => {
    if (!kept[index] && /[\p{L}\p{N}]/u.test(word)) run.push(word);
    else {
      if (run.length > best.length) best = run;
      run = [];
    }
  });
  if (run.length > best.length) best = run;
  if (!best.length || best.length > 4) return null;
  return best.join(isSpaceless(right) ? "" : " ");
}

/** 노트 카드(튜터가 고친 줄, 실수만) → 막힌 것. 같은 열쇠는 최근 것 하나. */
export function gapsFromCards(
  language: string,
  cards: readonly { wrong: string; right: string; note: string; at: number; kind?: string }[],
): GapItem[] {
  const out = new Map<string, GapItem>();
  for (const card of [...cards].sort((x, y) => y.at - x.at)) {
    if ((card.kind ?? "mistake") !== "mistake") continue;
    const piece = addedPiece(language, card.wrong, card.right);
    if (!piece || !card.right.includes(piece)) continue;
    const key = gapKey(language, piece);
    if (!key || out.has(key)) continue;
    out.set(key, { key, text: piece, sample: card.right, from: "fix", at: card.at, card: { wrong: card.wrong, right: card.right, note: card.note } });
  }
  return [...out.values()];
}

/** 퀴즈 재료(curriculum/quiz.ts registerQuizSources로 넘김). 문장에 그 말이 그대로 있어야 빈칸이 된다. */
export function gapSources(gap: GapItem): QuizSource[] {
  if (!gap.sample.includes(gap.text)) return [];
  return [{ text: gap.sample, gloss: { en: gap.meaning ?? "", raw: gap.meaning }, from: gap.key, stage: 0, piece: gap.text, who: gap.meaning ? "me" : "them" }];
}

/** 이 폰에 남긴 "표현 보기" 막힌 것(학습 언어마다). */
export function readLocalGaps(language: string): GapItem[] {
  try {
    const raw = JSON.parse(localStorage.getItem(`${LOCAL_KEY}.${language}`) ?? "[]") as GapItem[];
    return Array.isArray(raw) ? raw.filter((gap) => gap && typeof gap.key === "string" && typeof gap.sample === "string") : [];
  } catch {
    return [];
  }
}

/** 표현 카드를 열었을 때: 표현·예문(학습 언어)과 내가 쓴 줄(뜻, 이 폰에만). */
export function rememberHowToSay(language: string, input: { expression: string; example?: string; mine: string; at?: number }): void {
  const key = gapKey(language, input.expression);
  if (!key) return;
  const expression = clean(input.expression);
  const example = clean(input.example ?? "");
  const sample = example && example.includes(expression) ? example : expression;
  saveLocal(language, { key, text: expression, sample, meaning: clean(input.mine).slice(0, 200), from: "howToSay", at: input.at ?? Date.now() });
}

/** 두 곳을 합쳐 최근 것부터(같은 열쇠는 하나). */
export function mergeGaps(...lists: readonly (readonly GapItem[])[]): GapItem[] {
  const out = new Map<string, GapItem>();
  for (const gap of lists.flat().sort((a, b) => b.at - a.at)) if (!out.has(gap.key)) out.set(gap.key, gap);
  return [...out.values()].slice(0, GAP_MAX);
}

function saveLocal(language: string, gap: GapItem): void {
  try {
    const list = readLocalGaps(language).filter((one) => one.key !== gap.key);
    localStorage.setItem(`${LOCAL_KEY}.${language}`, JSON.stringify([gap, ...list].slice(0, GAP_MAX)));
  } catch {
    // 남기지 못하면 이번엔 건너뜀.
  }
}

/** 낱말을 눌러 뜻을 봤을 때: 그 낱말을 막힌 것으로(문장은 예문 → 그 낱말이 든 줄, 없으면 남기지 않음 — 퀴즈 재료가 없어서). */
export function rememberLookup(language: string, input: { word: string; example?: string; context?: string; at?: number }): void {
  const word = clean(input.word);
  const key = gapKey(language, word);
  if (!key) return;
  const has = (line: string) => line.toLocaleLowerCase().includes(word.toLocaleLowerCase());
  const sample = [clean(input.example ?? ""), clean(input.context ?? "")].find((line) => line && line !== word && has(line) && line.length <= 200);
  if (!sample) return;
  // 문장 속 그 낱말의 실제 모양(대소문자)으로 — 빈칸 문제가 그 글자를 찾는다.
  const at = sample.toLocaleLowerCase().indexOf(word.toLocaleLowerCase());
  saveLocal(language, { key, text: sample.slice(at, at + word.length), sample, from: "lookup", at: input.at ?? Date.now() });
}

/** 고친 줄을 펼쳐 봤을 때(통화 돌아보기 등): 노트 카드와 같은 셈으로, 이 폰에만. */
export function rememberFix(language: string, input: { wrong: string; right: string; note?: string; at?: number }): void {
  const [gap] = gapsFromCards(language, [{ wrong: input.wrong, right: input.right, note: input.note ?? "", at: input.at ?? Date.now() }]);
  if (gap) saveLocal(language, gap);
}
