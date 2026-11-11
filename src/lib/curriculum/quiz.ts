/**
 * 약한 곳 퀴즈(2026-10-28 사용자 "어려워하거나 틀린 부분을 퀴즈로" → "퀴즈부터 만들어줘", `hub/work/drafts/today-weak-practice-2026-10-28.md`).
 *
 * 다시 볼 열쇠 하나(e|표현 · f|문장구조 · g|단계:문법)와, 있으면 튜터가 고친 내 줄(노트 카드)로 짧은 문제 셋을 기기에서 만든다 — 모델을 부르지 않는다.
 * 재료는 이미 앱에 든 것뿐: 문장구조 예문, 대본 내 줄(문장구조 태그·핵심 표현·문법 태그), 고친 줄.
 *
 * 문제 종류:
 * - fix    내가 틀린 줄에서 틀린 낱말 누르기(고친 줄과 낱말 차이). 차이가 빠진 말뿐이면 두 문장 중 맞는 것 고르기.
 * - choose 문장에서 그 표현·문장구조 조각을 비우고 셋 중 고르기(오답 = 같은 갈래 다른 열쇠의 조각, 그 문장에 없는 것).
 * - order  낱말 조각을 섞어 순서 맞추기(띄어쓰기 없는 언어는 wordSegments로 자름).
 * - say    뜻만 보고 말하기(🎤, 대본과 같은 판정) — 늘 마지막.
 * 맞음 = 셋 중 둘 이상. 순수 모듈: 화면(TodayPlan QuizPlayer)과 테스트가 같이 쓴다.
 */
import { wordNearMisses } from "./wordDecoys.ts";
import { DECOYS } from "./frames/decoys/index.ts";
import { PLAIN_DECOYS } from "./frames/decoys/plain/index.ts";
import { EXPR_DECOYS } from "./expressions/decoys/index.ts";
import { EXTRA_EXAMPLES, SHARED_EXAMPLES_OFF } from "./examples/index.ts";
import { plainPinyin, readingOf, tonedPinyinMatch } from "./readings/index.ts";
import { grownDecoys, grownItems } from "./qbank.ts";
import { allFramesFor } from "./frames.ts";
import { allScriptsFor, type ScriptGloss } from "./stageScripts.ts";
import { segmentWords, isSpaceless } from "../wordSegments.ts";
import { hasLatin, romajiToHiragana, sameKana } from "../romaji.ts";

/** who: 상대 줄("them")은 고르기·맞추기에만, 말하기는 내 줄·예문만. */
/** 단어·표현 카드 한 장(낱말 · 앱 언어 뜻) — 문제는 이 중 한 칸을 가린다(cardQuiz). */
export type QuizCardFace = { word: string; meaning: string };

export type QuizSource = {
  text: string;
  gloss: ScriptGloss;
  from: string;
  stage: number;
  piece?: string;
  who?: "me" | "them";
  /** 빈도 단어: 그 낱말의 뜻(앱 언어). */
  wordGloss?: string;
  /** 빈도 단어: 품사 묶음(noun·verb·adj·adv·function) — 보기를 같은 품사로만(2026-10-30). */
  pos?: string;
  /** 빈도 단어: 주제(목록의 topic) — 보기를 같은 주제에서 먼저(2026-11-01). */
  topic?: string;
  /** piece가 이 문장구조의 고정 부분(문법 칸 g|·문장구조 f| 재료) — 틀린 곳 고치기의 오답을 고른다. */
  frame?: string;
  /** 낱말(w|) 문제은행 예문: 이 문장 빈칸에 안 맞는 같은 낱말의 다른 꼴(qbankRules BankItem.w) — 고르기 오답으로 맨 먼저(2026-11-02). */
  wrong?: string[];
  /** 학습자 자신의 줄(튜터가 고친 줄·통화에서 한 말) — 서버 공유 저장에 넣지 않는다(학습자 문장 저장 안 함, 2026-11-03 변경 감시). */
  own?: boolean;
};

/** 튜터가 고친 내 줄(노트 카드에서 — 폰의 오늘 목록에만 들고 다닌다). */
export type QuizCard = { wrong: string; right: string; note?: string };

export type QuizQuestion =
  | { kind: "fix"; wrong: string; right: string; note?: string; words: string[]; bad: number[]; options?: string[]; answer?: number }
  | { kind: "choose"; text: string; before: string; after: string; options: string[]; answer: number; gloss: ScriptGloss; from: string; mine?: boolean; /** 넣어 둔 표현·문법 문제. 뜻을 먼저 보여주고, 보기 재채점 없이 이 정답만 맞다. 틀리면 why. */ prepared?: { why: string } }
  | { kind: "order"; text: string; words: string[]; tiles: number[]; spaced: boolean; gloss: ScriptGloss; from: string }
  | { kind: "say"; text: string; gloss: ScriptGloss; from: string; mark?: string }
  /** 대화 응답(정기 시험, curriculum/exam.ts): 상대 줄을 듣고 알맞은 내 대답 고르기 — 상대 줄 글은 답한 뒤에. */
  | { kind: "reply"; them: string; themGloss: ScriptGloss; text: string; options: string[]; answer: number; gloss: ScriptGloss; from: string }
  /** 빈칸 쓰기(2026-10-30 사용자 "빈칸에 들어갈 단어를 타이핑하는 단순 문제를 대거"): 뜻과 빈칸 문장을 보고 비운 말을 직접 친다 — 보기 없음. */
  | { kind: "type"; text: string; before: string; after: string; answer: string; gloss: ScriptGloss; from: string; /** 그 자리의 헷갈리는 오답 — 한 글자 차이여도 이 꼴은 오타로 봐주지 않는다. */ near?: string[]; /** 카드 모양(개편, cardQuiz) — 뜻·예문 뜻은 보이고 낱말 칸과 예문 빈칸만 가림. 답은 예문 속 꼴, 사전형(word)도 맞음. */ card?: QuizCardFace; /** 뜻 줄을 답하기 전에도(문법 사다리 2칸 — 뜻 없이는 답이 여럿). */ glossFirst?: true; /** 문장 만들기(사다리 4칸): 뜻만 보고 문장 전체 쓰기 — 빈칸 줄 없음, 서버가 같은 뜻의 맞는 문장인지 봄. */ whole?: true; /** 쓰기 도움(게이지): 없으면 첫 글자, "len" 첫 글자 + 글자 수, "none" 없음. */ cue?: "len" | "none" }
  /**
   * 틀린 곳 찾아 고치기(2026-10-30 사용자 "문장 내에서 틀린 부분을 맞추고 수정하는 식"): 문장의 낱말을 눌러 틀린 곳을 찾고 바른 꼴을 직접 친다.
   * bad가 비면 틀린 곳 없는 문장("틀린 곳 없음"이 답, 찍어 맞히기 막기). want = 틀린 낱말 자리에 들어갈 바른 말. mine = 튜터가 고친 내 줄.
   */
  | { kind: "spot"; text: string; right: string; words: string[]; bad: number[]; want: string; gloss?: ScriptGloss; note?: string; from: string; near?: string[]; mine?: boolean; /** 앞 문맥 한 줄(누를 수 없음, 틀린 곳 데이터 shape "l"). */ lead?: string; /** 늘 틀린 곳이 있음(틀린 곳 데이터) — "틀린 곳 없음" 버튼 없음. */ hasError?: true; /** 선지(게이지 아래쪽): 이 칸만 칸 색 밑줄로, 이 칸만 누를 수 있음. */ picks?: number[] }
  /**
   * 복합 빈칸(2026-11-01 사용자 "복합퀴즈 — 한 문제에 학습 소재가 여러 개"): 한 문장에 이미 맞힌 소재 둘·셋을 동시에 비운다.
   * chunks = 빈칸 사이 글(빈칸 수 + 1개), blanks = 빈칸마다 열쇠·답·헷갈리는 오답. 결과는 빈칸마다 그 열쇠에(curriculum/multiQuiz.ts).
   */
  | { kind: "multi"; text: string; chunks: string[]; blanks: { key: string; answer: string; near?: string[]; /** 칠 수 없는 조각(한자가 든 일본어·중국어)은 고르기. */ options?: string[] }[]; gloss: ScriptGloss; from: string }
  /**
   * 대화 조각 빈칸(2026-11-01 사용자 "예문을 통화·채팅 문장으로 — 문맥은 대화를 떼 와서", curriculum/talkQuiz.ts): 이 폰의 AI 채팅·통화 기록에서
   * 앞 두세 줄과 함께, 마지막 줄(at)의 소재 자리를 비운다. mine = 내가 고침받은 줄의 고친 꼴. options = 칠 수 없는 조각(한자)은 고르기.
   */
  | { kind: "talk"; text: string; lines: { who: "me" | "them"; text: string; gloss?: string }[]; at: number; before: string; after: string; answer: string; near?: string[]; options?: string[]; mine?: boolean; from: string }
  /** 복합 틀린 곳(같은 날): 한 문장에 확실히 틀린 꼴이 둘·셋 — 모두 찾아 고친다. errors마다 그 열쇠·낱말 자리·바른 말. */
  | { kind: "spots"; text: string; right: string; words: string[]; errors: { key: string; bad: number[]; want: string; near: string[] }[]; gloss: ScriptGloss; from: string; /** 문단(story-errors P1~P4): 선지 칸 · 틀린 곳 수를 안 보임(P4·게이지 위쪽). */ picks?: number[]; hideCount?: true }
  /** 뜻 고르기: 문장을 보고 뜻(앱 언어) 고르기(보기 = 다른 줄의 뜻). */
  /** 낱말 스스로 체크(그럴듯한 보기가 셋 안 모일 때): 밑줄 낱말 → [알아요 | 모르겠어요] → 뜻 → [맞았어요 | 틀렸어요]. */
  | { kind: "know"; text: string; mark: string; gloss: ScriptGloss; from: string; card: QuizCardFace }
  | { kind: "meaning"; text: string; options: ScriptGloss[]; answer: number; gloss: ScriptGloss; from: string; /** 단어 퀴즈: 문장 안 밑줄 낱말 — 보기는 그 낱말의 뜻. */ mark?: string; /** 카드 모양(개편, cardQuiz) — 낱말·예문은 보이고 뜻 칸만 가림. */ card?: QuizCardFace };

/**
 * 학습 조합(2026-10-29 사용자 "방식에 이름을 붙이기보다 나눠서 고르거나 학습 조합을 짜 주는 식"):
 * auto = 앱이 돌림(풀 때마다 다른 모양) · speak = 말하기 위주 · read = 읽고 고르기 위주.
 * 듣기 위주(듣고 고르기)는 뺌(2026-10-30 사용자 "발음, 듣기 문제는 그냥 삭제" — 보기가 뜻부터 달라 듣지 않아도 풀렸음).
 */
export type QuizMix = "auto" | "speak" | "read";

export type Quiz = { key: string; questions: QuizQuestion[] };
export type SpotQuestion = Extract<QuizQuestion, { kind: "spot" }>;
export const QUIZ_SIZE = 3;

/** 셋 중 둘 이상 맞으면 맞음(둘뿐이면 둘 다). */
export function quizPassed(correct: number, total: number): boolean {
  return total > 0 && correct >= Math.min(total, 2);
}

export function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** 같은 열쇠·같은 날이면 같은 문제(다시 열어도 바뀌지 않게). */
export function rng(seed: string): () => number {
  let a = hash(seed) || 1;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffled<T>(list: readonly T[], random: () => number): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/** 문장 안에서 표현을 대소문자 구별 없이 찾아, 문장에 적힌 그대로의 조각을 돌려준다. */
export function pieceOf(text: string, expression: string): string | null {
  if (!expression) return null;
  const lowerText = text.toLocaleLowerCase();
  const lowerExpr = expression.toLocaleLowerCase();
  if (lowerText.length !== text.length) return text.includes(expression) && standsAlone(text, text.indexOf(expression), expression) ? expression : null;
  // 낱말 속은 아님(2026-11-01 퀴즈 예문 작업에서 찾음: ar يلا ⊂ قليلا, hi हाँ ⊂ यहाँ, es "a ver" ⊂ "gustaría ver", th ใช่ ⊂ ไม่ใช่).
  for (let at = lowerText.indexOf(lowerExpr); at >= 0; at = lowerText.indexOf(lowerExpr, at + 1)) {
    if (standsAlone(text, at, expression)) return text.slice(at, at + expression.length);
  }
  return null;
}

const LETTER = /[\p{L}\p{M}\p{Nd}]/u;
const THAI = /\p{Script=Thai}/u;
/** text[at..]의 조각이 따로 선 낱말(들)인가: 띄어 쓰는 말은 앞뒤가 글자가 아님, 태국어는 낱말 자르기 경계, 한자·가나는 그대로(한 글자 낱말이 흔함). */
function standsAlone(text: string, at: number, piece: string): boolean {
  if (at < 0) return false;
  const end = at + piece.length;
  if (THAI.test(piece)) {
    const words = segmentWords(text, "th");
    let from = 0;
    const edges = new Set<number>([0]);
    for (const word of words) {
      const i = text.indexOf(word, from);
      if (i < 0) continue;
      edges.add(i);
      edges.add(i + word.length);
      from = i + word.length;
    }
    return edges.has(at) && edges.has(end);
  }
  if (/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(piece)) return true;
  const before = at > 0 ? text[at - 1]! : "";
  const after = text[end] ?? "";
  const startOk = !before || !LETTER.test(before) || !LETTER.test(piece[0]!);
  const endOk = !after || !LETTER.test(after) || !LETTER.test(piece[piece.length - 1]!);
  return startOk && endOk;
}

function frameOf(language: string, id: string) {
  return allFramesFor(language).find((frame) => frame.id === id) ?? null;
}

/**
 * 뼈대 밖에서 막힌 것(u|, curriculum/gaps.ts)의 재료 — 화면이 이 폰·노트 카드에서 모아 넘긴다(대본에 없어서).
 * 고르기 오답은 다른 막힌 것의 말 + 가까운 뼈대 표현.
 */
const GAP_SOURCES = new Map<string, Map<string, QuizSource[]>>();

export function registerQuizSources(language: string, entries: readonly { key: string; sources: QuizSource[] }[]): void {
  const map = GAP_SOURCES.get(language) ?? new Map<string, QuizSource[]>();
  for (const entry of entries) if ((entry.key.startsWith("u|") || entry.key.startsWith("w|")) && entry.sources.length) map.set(entry.key, entry.sources);
  GAP_SOURCES.set(language, map);
  // 표현 카드(server/expressionCards.ts, 2026-11-03 Quizbank 어휘 탭에 표현): 대본 줄 앞에 — 처음 보는 표현은 카드 예문으로 먼저.
  const cards = EXPRESSION_CARDS.get(language) ?? new Map<string, QuizSource[]>();
  for (const entry of entries) if (entry.key.startsWith("e|") && entry.sources.length) cards.set(entry.key, entry.sources);
  EXPRESSION_CARDS.set(language, cards);
}

const EXPRESSION_CARDS = new Map<string, Map<string, QuizSource[]>>();

/** 열쇠가 가리키는 문장들(문제 재료) — 그 조각(piece)이 문장에 그대로 든 것엔 piece를 붙인다. */
export function quizSources(language: string, key: string): QuizSource[] {
  const base = baseSources(language, key);
  // 문제은행이 더한 예문(curriculum/qbank.ts) — 앱 데이터 뒤에, 같은 문장은 한 번.
  const grown = grownItems(language, key);
  if (!grown.length) return base;
  const seen = new Set(base.map((source) => source.text));
  const pos = base[0]?.pos;
  const extra = grown.filter((item) => !seen.has(item.text) && item.text.includes(item.piece)).map((item): QuizSource => ({ text: item.text, gloss: item.gloss, from: "qbank", stage: item.stage, piece: item.piece, who: "me", ...(pos ? { pos } : {}), ...(item.wrong?.length ? { wrong: item.wrong } : {}) }));
  return [...base, ...extra];
}

/**
 * 답한 뒤 보여 준 같은 열쇠의 다른 예문(2026-10-31 사용자 "퀴즈 후에 예문도 몇 개" → "바꿔줘"): 화면(QuizPlayer)이 moreExamples로 받고,
 * 보여 준 문장은 그 열쇠의 다음 빈칸 재료에서 뒤로 민다(방금 읽은 문장이 바로 빈칸으로 나오면 베끼기). 이 폰 메모리에만.
 */
const SHOWN_EXAMPLES = new Map<string, Set<string>>();

export function moreExamples(language: string, key: string, current: string, n = 2): QuizSource[] {
  const id = `${language}|${key}`;
  const shown = SHOWN_EXAMPLES.get(id) ?? new Set<string>();
  const list = quizSources(language, key).filter((source) => source.text !== current && source.who !== "them" && Boolean(source.piece) && source.text.includes(source.piece!));
  const fresh = list.filter((source) => !shown.has(source.text));
  const picked = [...fresh, ...list.filter((source) => shown.has(source.text))].slice(0, n);
  for (const source of picked) shown.add(source.text);
  SHOWN_EXAMPLES.set(id, shown);
  return picked;
}

/**
 * 그 열쇠로 최근에 낸 문장(이 폰, 열쇠마다 ASKED_KEEP개) — 다음에 같은 열쇠를 낼 때 뒤로 민다
 * (가상 사용자 2026-11-01: 단어 시험·다시 보기가 몇 분 전·1일째와 같은 문장이라 문장을 외워 맞힘). 다른 문장이 없으면 그대로 쓴다.
 */
const ASKED = "quizAsked.v1";
const ASKED_KEEP = 4;
const ASKED_KEYS = 600;
const askedMemory = new Map<string, Record<string, string[]>>();

function askedOf(language: string): Record<string, string[]> {
  const have = askedMemory.get(language);
  if (have) return have;
  let read: Record<string, string[]> = {};
  try {
    if (typeof localStorage !== "undefined") read = (JSON.parse(localStorage.getItem(`${ASKED}.${language}`) ?? "null") as Record<string, string[]> | null) ?? {};
  } catch {
    read = {};
  }
  askedMemory.set(language, read);
  return read;
}

/** 이 문장을 그 열쇠로 냈다(문제를 화면에 올리는 쪽이 부름 — 묶음 퀴즈·수업 퀴즈). */
export function noteAsked(language: string, key: string, text: string): void {
  if (!key || !text) return;
  const all = askedOf(language);
  all[key] = [text, ...(all[key] ?? []).filter((one) => one !== text)].slice(0, ASKED_KEEP);
  const keys = Object.keys(all);
  if (keys.length > ASKED_KEYS) for (const old of keys.slice(0, keys.length - ASKED_KEYS)) delete all[old];
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(`${ASKED}.${language}`, JSON.stringify(all));
  } catch {
    // 메모리에는 남음.
  }
}

/** 최근에 낸 문장(오래된 것이 뒤). */
export function askedTexts(language: string, key: string): readonly string[] {
  return askedOf(language)[key] ?? [];
}

/** 답한 뒤 예문으로 보여 준 문장·최근에 낸 문장을 뒤로(다른 문장이 있으면 그쪽부터 빈칸으로). 최근에 낸 것은 오래된 것부터 다시. */
function shownLast(language: string, key: string, list: QuizSource[], later?: ReadonlySet<string>): QuizSource[] {
  const asked = askedTexts(language, key);
  if (asked.length) {
    const rank = (text: string) => asked.indexOf(text);
    list = [...list.filter((source) => rank(source.text) < 0), ...list.filter((source) => rank(source.text) >= 0).sort((a, b) => rank(b.text) - rank(a.text))];
  }
  const kept = SHOWN_EXAMPLES.get(`${language}|${key}`);
  const shown = later?.size ? new Set([...(kept ?? []), ...later]) : kept;
  if (!shown?.size) return list;
  return [...list.filter((source) => !shown.has(source.text)), ...list.filter((source) => shown.has(source.text))];
}

/**
 * 여러 소재가 같이 쓰던 문장은 한 소재만 쓰고 나머지는 새 예문으로(curriculum/examples, 2026-11-01 사용자 "요소가 3개라면 추가 문장은 2개") —
 * 같은 날·며칠 안에 다른 열쇠로 같은 문장이 또 나오던 것(퀴즈 전수 점검 1,397문제). 문장구조(f|)·표현(e|)만.
 */
function baseSources(language: string, key: string): QuizSource[] {
  const raw = rawSources(language, key);
  const extra = SHARED_EXAMPLES_OFF.has(language) ? undefined : EXTRA_EXAMPLES[language]?.[key];
  if (!extra?.length) return raw;
  const frame = key.startsWith("f|") ? frameOf(language, key.slice(2)) : undefined;
  const pieceIn = (text: string) => (frame ? frame.core.find((core) => core && text.includes(core)) : key.startsWith("e|") ? pieceOf(text, key.slice(2)) ?? undefined : undefined);
  const gone = new Set(extra.map((one) => one.replaces));
  const stageOf = new Map(raw.map((source) => [source.text, source.stage]));
  const added = extra.flatMap((one): QuizSource[] => {
    const piece = pieceIn(one.text);
    if (!piece) return [];
    return [{ text: one.text, gloss: { en: one.en, ko: one.ko }, from: frame?.id ?? "extra", stage: stageOf.get(one.replaces) ?? frame?.stage ?? 1, piece, who: "me", ...(frame ? { frame: frame.id } : {}) }];
  });
  // 원래 문장 자리에 새 예문(같은 차례 — 앞 재료가 먼저 나오는 순서를 지킨다).
  const out: QuizSource[] = [];
  for (const source of raw) {
    if (!gone.has(source.text)) {
      out.push(source);
      continue;
    }
    const next = added.find((one) => extra.find((e) => e.text === one.text)?.replaces === source.text);
    if (next) out.push(next);
  }
  for (const one of added) if (!out.includes(one)) out.push(one);
  return out;
}

function rawSources(language: string, key: string): QuizSource[] {
  if (key.startsWith("u|") || key.startsWith("w|")) return GAP_SOURCES.get(language)?.get(key) ?? [];
  const scripts = allScriptsFor(language);
  const out: QuizSource[] = [];
  const seen = new Set<string>();
  const add = (source: QuizSource) => {
    if (!source.text || seen.has(source.text)) return;
    seen.add(source.text);
    out.push(source);
  };
  if (key.startsWith("f|")) {
    const frame = frameOf(language, key.slice(2));
    if (!frame) return [];
    const pieceIn = (text: string) => frame.core.find((core) => core && text.includes(core));
    for (const example of frame.examples) add({ text: example.text, gloss: example.gloss, from: frame.id, stage: frame.stage, piece: pieceIn(example.text), frame: frame.id });
    for (const script of scripts) {
      for (const line of script.lines) {
        if (line.who === "me" && line.frames?.includes(frame.id)) add({ text: line.text, gloss: line.gloss, from: script.id, stage: script.stage, piece: pieceIn(line.text), frame: frame.id });
      }
    }
    return out;
  }
  if (key.startsWith("e|")) {
    const expression = key.slice(2);
    // 그 표현을 핵심으로 둔 대본 먼저, 그다음 다른 대본에 그 표현이 그대로 나온 줄(상대 줄 포함) — 같은 표현을 다른 상황에서 다시
    // (2026-10-29 사용자 "지속학습에서 계속 던져주는 식으로 노출 수를").
    for (const card of EXPRESSION_CARDS.get(language)?.get(key) ?? []) add(card);
    const ordered = [...scripts.filter((s) => s.expressions.includes(expression)), ...scripts.filter((s) => !s.expressions.includes(expression))];
    for (const script of ordered) {
      for (const line of script.lines) {
        // 핵심 표현은 소문자·문장부호 없이 적혀 있다("hola" ↔ "¡Hola!") — 줄에 든 그대로의 조각을 쓴다.
        const piece = pieceOf(line.text, expression);
        if (piece) add({ text: line.text, gloss: line.gloss, from: script.id, stage: script.stage, piece, who: line.who === "me" ? "me" : "them" });
      }
    }
    // 빈도 단어 카드 예문 중 그 표현이 그대로 든 문장도(2026-10-29 사용자 "문법·표현 퀴즈 소재가 한정" → 단어 데이터 연결, 4개까지 — 단계 0이라 어느 단계에서나).
    let extra = 0;
    for (const [k, list] of GAP_SOURCES.get(language)?.entries() ?? []) {
      if (extra >= 4) break;
      if (!k.startsWith("w|")) continue;
      for (const source of list) {
        const piece = pieceOf(source.text, expression);
        if (!piece || seen.has(source.text)) continue;
        add({ text: source.text, gloss: source.gloss, from: source.from, stage: 0, piece, who: "me" });
        extra += 1;
      }
    }
    return out;
  }
  if (key.startsWith("g|")) {
    const [stage, index] = key.slice(2).split(":").map(Number);
    // 그 문법 칸을 쓰는 문장구조(데이터의 frame.grammar) — 문제 재료는 이 틀이 실제로 든 줄만(2026-11-03 사용자 "문법 수업 퀴즈 고쳐":
    // 대본에 그 문법 표시만 있으면 줄마다 다 넣어 과거시제 수업에 "Do you have anything a little cheaper?"가 나왔다).
    const linked = allFramesFor(language).filter((frame) => frame.stage === stage && (frame.grammar ?? []).includes(index!));
    const linkedIds = new Set(linked.map((frame) => frame.id));
    for (const frame of linked) {
      for (const example of frame.examples) {
        const piece = frame.core.find((core) => core && example.text.includes(core));
        if (piece) add({ text: example.text, gloss: example.gloss, from: frame.id, stage: frame.stage, piece, frame: frame.id });
      }
    }
    for (const script of scripts) {
      // 그 단계에서 그 문법을 쓰는 대본 + 뒤 단계에서 그 문법을 다시 쓰는 대본(earlierGrammar).
      const here = script.stage === stage && (script.grammar ?? []).includes(index!);
      const again = (script.earlierGrammar ?? []).includes(`${stage}:${index}`);
      if (!here && !again) continue;
      for (const line of script.lines) {
        if (line.who !== "me") continue;
        const frameId = (line.frames ?? []).find((id) => linkedIds.has(id) && frameOf(language, id)?.core.some((core) => core && line.text.includes(core)));
        if (!frameId) continue;
        const piece = frameOf(language, frameId)?.core.find((core) => core && line.text.includes(core));
        add({ text: line.text, gloss: line.gloss, from: script.id, stage: script.stage, piece, frame: frameId });
      }
    }
    return out;
  }
  return [];
}

/** 고르기 오답 후보: 같은 갈래 다른 열쇠의 조각(가까운 단계 먼저). */
function decoys(language: string, key: string, stage: number, pos?: string): string[] {
  if (key.startsWith("w|")) {
    // 빈도 단어: 같이 받아 둔 다른 낱말의 쓴 꼴 — **같은 품사만**(사용자 2026-10-30 "선지가 다수일 시 다 같은 품사로").
    // 품사를 모르면(옛 카드) 보기를 만들지 않는다 — 다른 품사가 섞여 한눈에 지워지는 보기보다 문제를 안 내는 쪽.
    if (!pos) return [];
    const samePos = [...(GAP_SOURCES.get(language)?.entries() ?? [])].filter(([k, sources]) => k !== key && k.startsWith("w|") && sources[0]?.pos === pos);
    // 같은 주제 낱말이 둘 넘으면 그 안에서만(가상 사용자 2026-11-01 crimen/cisne/consejo·tamaño/taza/hombro — 철자만 닮은 다른 주제 낱말은 뜻으로 바로 지워짐).
    const topic = GAP_SOURCES.get(language)?.get(key)?.[0]?.topic;
    const sameTopic = topic && topic !== "function" ? samePos.filter(([, sources]) => sources[0]?.topic === topic) : [];
    return [...new Set((sameTopic.length >= 2 ? sameTopic : samePos).map(([, sources]) => sources[0]?.piece ?? "").filter(Boolean))];
  }
  if (key.startsWith("u|")) {
    const others = [...(GAP_SOURCES.get(language)?.entries() ?? [])].filter(([k]) => k !== key).map(([, sources]) => sources[0]?.piece ?? "").filter(Boolean);
    const skeleton = allScriptsFor(language).flatMap((script) => script.expressions);
    return [...new Set([...others, ...skeleton])];
  }
  const near = (s: number) => Math.abs(s - stage) <= 1;
  if (key.startsWith("e|")) {
    const mine = key.slice(2);
    return [
      ...new Set(
        allScriptsFor(language)
          .filter((script) => near(script.stage))
          .flatMap((script) => script.expressions)
          .filter((expression) => expression !== mine),
      ),
    ];
  }
  const mine = key.startsWith("f|") ? key.slice(2) : "";
  return [
    ...new Set(
      allFramesFor(language)
        .filter((frame) => frame.id !== mine && near(frame.stage))
        .flatMap((frame) => frame.core),
    ),
  ];
}

/** 띄어쓰기 없는 문장인지(조각을 붙여 보여 줄지). */
export function spacedText(text: string): boolean {
  return !isSpaceless(text);
}

const lower = (text: string) => text.toLocaleLowerCase();
const same = (a: string, b: string) => lower(a) === lower(b);

/**
 * 문장구조 조각의 헷갈리는 오답(2026-10-30 사용자 "다른 선지가 누가 봐도 오답" → 살짝 틀린 꼴, frames/decoys/) — 줄의 대소문자에 맞춘다.
 */
export function nearMisses(language: string, frameId: string, piece: string, from: Partial<Record<string, Record<string, string[]>>> = DECOYS): string[] {
  const table = from[language];
  if (!table) return [];
  const exact = table[`${frameId}|${piece}`];
  if (exact) return exact;
  // 조각이 문장 첫머리라 대문자로 시작하면 오답도.
  const list = Object.entries(table).find(([k]) => k.startsWith(`${frameId}|`) && lower(k.slice(frameId.length + 1)) === lower(piece))?.[1] ?? [];
  const upper = piece.charAt(0) !== piece.charAt(0).toLocaleLowerCase();
  return upper ? list.map((one) => one.charAt(0).toLocaleUpperCase() + one.slice(1)) : list;
}

/** 단계 핵심 표현의 헷갈리는 오답(expressions/decoys/, 2026-10-30) — 줄 첫머리 대문자에 맞춘다. */
export function expressionNearMisses(language: string, expression: string, piece: string): string[] {
  const list = EXPR_DECOYS[language]?.[expression] ?? [];
  const upper = piece.charAt(0) !== piece.charAt(0).toLocaleLowerCase() && expression.charAt(0) === expression.charAt(0).toLocaleLowerCase();
  return upper ? list.map((one) => one.charAt(0).toLocaleUpperCase() + one.slice(1)) : list;
}

/** 열쇠에 맞는 헷갈리는 오답(문장구조·표현은 미리 만든 데이터, 문제은행이 더한 것도 — curriculum/qbank). */
export function nearOf(language: string, key: string, piece: string): string[] {
  const made = key.startsWith("f|") ? nearMisses(language, key.slice(2), piece) : key.startsWith("e|") ? expressionNearMisses(language, key.slice(2), piece) : key.startsWith("w|") ? wordNearMisses(language, piece) : [];
  // 낱말(w|)의 문제은행 오답 중 철자 실수 꼴·운만 맞춘 낱말(totaly·aera·tank — 가상 사용자 2026-11-01 "철자 고르기")은 뺀다. 활용·성수 꼴(perra·perros)은 둔다.
  const grown = grownDecoys(language, key, piece).filter((one) => !key.startsWith("w|") || isSpaceless(piece) || !spellingOnly(one, piece));
  return [...new Set([...made, ...grown])];
}

/**
 * 문장 안 조각 자리: 다른 낱말 속이 아닌 곳(2026-10-31 가상 사용자 — "t___ phone"(the 안의 he), 今日 안의 日을 비움).
 * 띄어쓰는 말은 앞뒤가 글자가 아닌 자리(없으면 -1 — 문제를 안 만듦), 띄어쓰기 없는 말은 낱말 자르기로 그 조각과 같은 낱말 자리(없으면 첫 자리).
 */
export function pieceAt(text: string, piece: string, language = ""): number {
  if (!piece) return -1;
  if (isSpaceless(text) || isSpaceless(piece)) {
    const words = segmentWords(text, language);
    let from = 0;
    for (const word of words) {
      const at = text.indexOf(word, from);
      if (at < 0) continue;
      if (word === piece) return at;
      from = at + word.length;
    }
    return text.indexOf(piece);
  }
  const letter = /[\p{L}\p{M}\p{Nd}]/u;
  for (let at = text.indexOf(piece); at >= 0; at = text.indexOf(piece, at + 1)) {
    const before = at > 0 ? text[at - 1]! : "";
    const after = text[at + piece.length] ?? "";
    const startOk = !before || !letter.test(before) || !letter.test(piece[0]!);
    const endOk = !after || !letter.test(after) || !letter.test(piece[piece.length - 1]!);
    if (startOk && endOk) return at;
  }
  // 낱말로 따로 선 자리가 없으면(카드 예문이 그 낱말을 다른 낱말 속에만 담음) 문제를 만들지 않는다.
  return -1;
}

/**
 * 빈칸 말고 같은 문장에 그 조각이 또 있나(가상 사용자 2026-11-01 "No ___ sé, lo siento — 뒤의 lo를 보고 고름"). 있으면 문제를 만들지 않는다.
 * 띄어쓰는 말은 따로 선 낱말 자리만, 띄어쓰기 없는 말은 낱말 자르기로 같은 낱말만 센다. 대소문자는 가리지 않는다.
 */
export function pieceTwice(text: string, piece: string, language = ""): boolean {
  const at = pieceAt(text, piece, language);
  if (at < 0) return false;
  const rest = text.slice(0, at) + " ".repeat(piece.length) + text.slice(at + piece.length);
  const lowered = piece.toLocaleLowerCase();
  if (isSpaceless(text) || isSpaceless(piece)) return segmentWords(rest, language).some((word) => word.toLocaleLowerCase() === lowered);
  return pieceAt(rest.toLocaleLowerCase(), lowered, language) >= 0;
}

export function chooseOf(language: string, key: string, source: QuizSource, random: () => number): QuizQuestion | null {
  const piece = source.piece;
  if (!piece) return null;
  const at = pieceAt(source.text, piece, language);
  if (at < 0 || pieceTwice(source.text, piece, language)) return null;
  // 문법 칸(g|) 조각은 그 줄의 문장구조 조각이라 그 문장구조의 헷갈리는 오답을 쓴다.
  const nearKey = key.startsWith("g|") && source.frame ? `f|${source.frame}` : key;
  const near = nearOf(language, nearKey, piece);
  const fits = (one: string) => Boolean(one) && !same(one, piece) && !lower(source.text).includes(lower(one)) && !lower(piece).includes(lower(one)) && !lower(one).includes(lower(piece));
  // 낱말(w|)의 실수 꼴은 정답을 품거나 정답에 들 수 있다(you → your, totally → total) — 문장에 낱말로 따로 있지만 않으면 된다
  // (가상 사용자 2026-11-01: WORD_DECOYS가 이 규칙에 걸러져 생김새만 닮은 다른 낱말 crimen/cisne/consejo가 나옴).
  const wordFits = (one: string) => (isSpaceless(piece) ? fits(one) : Boolean(one) && !same(one, piece) && pieceAt(lower(source.text), lower(one), language) < 0);
  // 낱말은 손으로 정한 실수 꼴(wordDecoys.ts)이 있으면 그것만 — 문제은행 오답(nearby·I처럼 문장에 맞는 말이 섞였던 것)보다 앞선다.
  // 문제은행이 이 문장에 맞춰 만든 같은 낱말의 다른 꼴(be → is·was·been, 2026-11-02 사용자 "형태만 달라진 같은 단어로 선지")이 둘 이상이면 그것만 — 문장마다 "여기선 틀림"을 본 것이라 표보다 앞선다.
  // 꼴은 같은 낱말이라 정답을 품어도 된다(喝 → 喝了·食べ → 食べた) — 그 문장에 이미 들어 있지만 않으면.
  const formFits = (one: string) => Boolean(one) && !same(one, piece) && (isSpaceless(piece) ? !lower(source.text).includes(lower(one)) : pieceAt(lower(source.text), lower(one), language) < 0);
  const forms = key.startsWith("w|") ? (source.wrong ?? []).filter(formFits) : [];
  const own = forms.length >= 2 ? forms : key.startsWith("w|") ? wordNearMisses(language, piece).filter(wordFits) : [];
  const nearFit = own.length ? own : near.filter(key.startsWith("w|") ? wordFits : fits);
  // 문장구조·표현·문법은 그 정답의 실수 꼴(데이터·문제은행)만 — 다른 문제의 조각은 품사·자리가 안 맞아 한눈에 지워지거나 거꾸로 문장에 맞아 답이 둘
  // (2026-11-01 퀴즈 전수 점검 ko 4~5단계 13문제). 모자라면 고르기를 안 만들고 빈칸 쓰기·순서로 넘어간다.
  // 낱말(w|)·사용자 표현(u|)만 남의 조각 중 생김새가 가장 닮은 것으로 채운다(같은 품사 안에서 — 2026-10-30 사용자).
  const ownOnly = key.startsWith("f|") || key.startsWith("e|") || key.startsWith("g|");
  if (ownOnly && nearFit.length < 2) return null;
  // 낱말: 실수 꼴이 하나뿐이면 같은 품사의 닮은 낱말로 하나 채운다(실수 꼴 먼저).
  const pool = nearFit.length >= 2 ? nearFit : [...nearFit, ...mostAlike(piece, decoys(language, key, source.stage, source.pos).filter(fits), nearFit.length ? 1 : 5)];
  // 대소문자만 다른 같은 말("cuánto cuesta"·"Cuánto cuesta")은 보기에 한 번만(2026-10-30 화면 확인).
  // 보기 첫 글자를 정답에 맞춘다(문장 가운데 빈칸에 "Our·Who"처럼 대문자 보기가 섞여 한눈에 지워짐 — 가상 사용자 2026-10-31).
  const caseLike = (one: string) => {
    const first = piece[0] ?? "";
    if (first.toLocaleLowerCase() === first.toLocaleUpperCase() || one === "I" || /^I\b/.test(one)) return one;
    const head = one[0] ?? "";
    return (first === first.toLocaleLowerCase() ? head.toLocaleLowerCase() : head.toLocaleUpperCase()) + one.slice(1);
  };
  const ordered = nearFit.length ? [...shuffled(nearFit, random), ...pool.filter((one) => !nearFit.includes(one))] : shuffled(pool, random);
  const wrong = [...new Map(ordered.map((one) => caseLike(one)).filter((one) => !same(one, piece) && (isSpaceless(piece) ? !lower(source.text).includes(lower(one)) : pieceAt(lower(source.text), lower(one), language) < 0)).map((one) => [lower(one), one])).values()].slice(0, 2);
  if (wrong.length < 2) return null;
  const options = shuffled([piece, ...wrong], random);
  return {
    kind: "choose",
    text: source.text,
    before: source.text.slice(0, at),
    after: source.text.slice(at + piece.length),
    options,
    answer: options.indexOf(piece),
    gloss: source.gloss,
    from: source.from,
    ...(source.own ? { mine: true } : {}),
  };
}

/** 두 말의 편집 거리(짧은 조각용). */
function distance(a: string, b: string): number {
  const x = [...a];
  const y = [...b];
  let prev = Array.from({ length: y.length + 1 }, (_, i) => i);
  for (let i = 1; i <= x.length; i += 1) {
    const row = [i];
    for (let j = 1; j <= y.length; j += 1) row[j] = Math.min(prev[j]! + 1, row[j - 1]! + 1, prev[j - 1]! + (x[i - 1] === y[j - 1] ? 0 : 1));
    prev = row;
  }
  return prev[y.length]!;
}

/** 후보 중 조각과 생김새가 가장 닮은 n개(글자 차이 비율 + 첫 글자·길이) — 한눈에 지워지는 보기를 줄인다. */
export function mostAlike(piece: string, candidates: readonly string[], n: number): string[] {
  const p = piece.toLocaleLowerCase();
  const score = (one: string) => {
    const c = one.toLocaleLowerCase();
    const longer = Math.max([...p].length, [...c].length) || 1;
    let s = distance(p, c) / longer;
    if ([...c][0] === [...p][0]) s -= 0.15;
    s += Math.abs([...c].length - [...p].length) / longer / 2;
    return s;
  };
  return [...new Set(candidates)].map((one) => [one, score(one)] as const).sort((a, b) => a[1] - b[1]).slice(0, n).map(([one]) => one);
}

/** 빈칸 쓰기 문제: 비울 조각이 짧을 때만(세 낱말·띄어쓰기 없는 말은 여덟 글자까지) — 길면 치기 힘들어 학습보다 타자가 된다. */
export function typeOf(language: string, source: QuizSource, key = ""): QuizQuestion | null {
  const piece = source.piece?.trim();
  if (!piece) return null;
  // 한자가 든 답: 읽기가 있으면 병음·히라가나(로마자)로 쳐도 맞음(2026-11-01 사용자 "입력으로"), 없으면 치지 않게 — 고르기로
  // (가나·한자 입력기가 없으면 칠 수 없음 — 가상 사용자 준호가 人·日을 2주 내내 못 침).
  if ((language === "ja" || language === "zh") && /\p{Script=Han}/u.test(piece) && !readingOf(language, piece)) return null;
  const at = pieceAt(source.text, piece, language);
  if (at < 0 || pieceTwice(source.text, piece, language)) return null;
  const short = isSpaceless(piece) ? [...piece].length <= 8 : segmentWords(piece, language).length <= 3 && piece.length <= 24;
  if (!short) return null;
  const near = key ? nearOf(language, key, piece) : [];
  return { kind: "type", text: source.text, before: source.text.slice(0, at), after: source.text.slice(at + piece.length), answer: piece, gloss: source.gloss, from: source.from, ...(near.length ? { near } : {}) };
}

/**
 * 친 말이 맞는지: 대소문자·문장부호·띄어쓰기(띄어쓰기 없는 말은 전부)·곧은/굽은 따옴표는 따지지 않는다.
 * "loose"(맞음으로 세고 바른 꼴을 보여 줌):
 * - 라틴 글자의 악센트만 빠짐 — 태국어·힌디어의 모음 부호(\p{M})는 글자라 지우지 않는다.
 * - 한 글자 오타(2026-10-30 사용자 "타이핑해서 맞추는 식"): 다섯 글자 넘는 낱말의 가운데에서 한 글자만 — 낱말 끝 두 글자(-s·-ed·성수 어미)는
 *   문법이라 봐주지 않고, 띄어쓰기 없는 말·한국어(한 글자가 조사·어미)도 봐주지 않는다. near(헷갈리는 오답)와 같은 꼴도 아니다.
 * - 일본어를 로마자로 침(ga → が): 소리가 같으면(가타카나 장음 ー 포함). 한자가 든 답은 여기서 못 맞추고 서버 다시 보기(typed-check)로.
 */
/**
 * 쓰기 칸의 첫 글자 도움(입력칸 안내 글, 기본으로 — 사용자 2026-11-10 "답이 여럿인 빈칸은 첫 글자", "💡 빼고"): "첫 글자…".
 * 글자는 자소 묶음 단위(Intl.Segmenter — 힌디·태국 모음 기호를 떼지 않음). 셋보다 짧은 답·한자가 든 답은 첫 글자가 답의 큰 몫이라 없음("").
 */
export function firstCue(answer: string, mode?: "len" | "none"): string {
  if (mode === "none") return "";
  const text = answer.trim();
  if (!text || /\p{Script=Han}/u.test(text)) return "";
  let parts: string[];
  try {
    parts = [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text)].map((one) => one.segment);
  } catch {
    parts = [...text];
  }
  const letters = parts.filter((one) => /[\p{L}\p{N}]/u.test(one));
  if (letters.length < 3) return "";
  // 게이지 아래쪽: 첫 글자 + 남은 글자 수만큼 밑줄(띄어쓰기는 그대로).
  if (mode === "len") return parts.map((one, i) => (i === 0 || /\s/.test(one) ? one : "＿")).join("");
  return `${parts[0]}…`;
}

export function typedRight(answer: string, typed: string, options: { language?: string; near?: readonly string[] } = {}): "exact" | "loose" | false {
  const norm = (text: string) => {
    const base = text.normalize("NFC").toLocaleLowerCase().replace(/[’‘`´]/g, "'").replace(/[\p{P}\p{S}]+/gu, " ").replace(/\s+/g, " ").trim();
    return isSpaceless(base) ? base.replace(/\s+/g, "") : base;
  };
  const a = norm(answer);
  const b = norm(typed);
  if (!b) return false;
  if (a === b) return "exact";
  const latin = (text: string) => text.normalize("NFD").replace(/(\p{Script=Latin})\p{M}+/gu, "$1").normalize("NFC");
  // 부호 하나로 뜻이 갈리는 말은 봐주지 않는다(가상 사용자 2026-11-01 "años 자리에 anos, Él 자리에 El도 맞음").
  if (latin(a) === latin(b) && !meaningMark(a, b, options.language)) return "loose";
  if (latin(a) === latin(b)) return false;
  if (options.near?.some((one) => norm(one) === b || latin(norm(one)) === latin(b))) return false;
  // 조사 は·へ·を는 소리대로(wa·e·o) 치니 비교할 때만 소리로 맞춘다.
  const sound = (text: string) => text.replace(/は/g, "わ").replace(/へ/g, "え").replace(/を/g, "お");
  // 한자가 든 답을 읽기로 침(2026-11-01): 중국어 병음(성조 부호·숫자·없음 모두), 일본어 히라가나·가타카나·로마자.
  const reading = /\p{Script=Han}/u.test(answer) && (options.language === "zh" || options.language === "ja") ? readingOf(options.language, answer.trim()) : null;
  if (reading && options.language === "zh" && hasLatin(typed) && plainPinyin(reading) === plainPinyin(typed)) return tonedPinyinMatch(reading, typed) === false ? false : "loose";
  if (reading && options.language === "ja") {
    const kana = hasLatin(typed) ? romajiToHiragana(typed).replace(/\s+/g, "") : typed.replace(/\s+/g, "");
    if (sameKana(sound(reading), sound(kana))) return "loose";
  }
  if (options.language === "ja" && hasLatin(typed) && !/[一-鿿]/u.test(answer) && sameKana(sound(a), sound(romajiToHiragana(b).replace(/\s+/g, "")))) return "loose";
  if (typoOk(a, b, options.language)) return "loose";
  return false;
}

/**
 * 부호를 빼면 다른 말이 되는 경우: 스페인어 ñ(n과 다른 글자), 뜻을 가르는 한 음절 부호(él/el · tú/tu · sí/si · sé/se · más/mas · mí/mi · té/te · dé/de),
 * 프랑스어 à/a · où/ou · là/la, 포르투갈어 é/e · está/esta. 그 밖의 빠진 부호는 "거의 맞음"으로 둔다.
 */
const MARK_PAIRS: Record<string, readonly string[]> = {
  es: ["él", "tú", "sí", "sé", "más", "mí", "té", "dé", "qué", "cómo", "dónde", "cuándo", "quién", "cuál", "está", "esté"],
  fr: ["à", "où", "là", "çà", "dû", "sûr"],
  pt: ["é", "está", "têm", "pôde", "pôr", "pára", "avô", "avó"],
};

export function meaningMark(answer: string, typed: string, language?: string): boolean {
  if (language === "es" && [...answer].some((ch, i) => (ch === "ñ" || ch === "Ñ") && typed.normalize("NFC")[i] !== ch)) return true;
  const pairs = MARK_PAIRS[language ?? ""];
  if (!pairs) return false;
  const words = answer.toLocaleLowerCase().split(/\s+/);
  const typedWords = typed.toLocaleLowerCase().split(/\s+/);
  return words.some((word, i) => pairs.includes(word.replace(/[\p{P}]/gu, "")) && typedWords[i] !== undefined && typedWords[i] !== word);
}

/** 철자만 틀린 꼴(겹자 빼기·더하기, 이웃 글자 바꾸기)이나 첫 글자만 다른 운 맞춤인가 — 낱말 오답으로 쓰지 않는다. */
export function spellingOnly(decoy: string, piece: string): boolean {
  const a = decoy.toLocaleLowerCase();
  const b = piece.toLocaleLowerCase();
  if (a === b) return false;
  if (a[0] !== b[0] && distance(a, b) <= 2) return true;
  if (a.length === b.length) {
    const diff = [...a].map((ch, i) => (ch === b[i] ? -1 : i)).filter((i) => i >= 0);
    if (diff.length === 2 && diff[1] === diff[0]! + 1 && a[diff[0]!] === b[diff[1]!] && a[diff[1]!] === b[diff[0]!]) return true;
  }
  const [long, short] = a.length > b.length ? [a, b] : [b, a];
  if (long.length === short.length + 1) {
    for (let i = 0; i < long.length; i += 1) {
      if (long.slice(0, i) + long.slice(i + 1) === short && (long[i] === long[i - 1] || long[i] === long[i + 1])) return true;
    }
  }
  return false;
}

/** 한 글자 오타로 봐줄 수 있나(typedRight 설명). */
function typoOk(a: string, b: string, language?: string): boolean {
  if (!language || language === "ko" || isSpaceless(a) || isSpaceless(b)) return false;
  if (distance(a, b) !== 1) return false;
  const x = [...a];
  const y = [...b];
  let at = 0;
  while (at < x.length && at < y.length && x[at] === y[at]) at += 1;
  // 고친 자리가 든 낱말(답 쪽).
  let start = at;
  while (start > 0 && x[start - 1] !== " ") start -= 1;
  let end = at;
  while (end < x.length && x[end] !== " ") end += 1;
  const word = end - start;
  if (word < 5) return false;
  const offset = at - start;
  return offset > 0 && offset < word - 2;
}

/** 일본어 활용 조각(さ·れ·ま·した)은 한 조각으로 — 낱말 자르기가 동사 꼬리를 잘게 나눠 순서 문제가 이상해진다. */
const JA_TAIL = /^(?:[ぁ-ゖ]|した|します|ました|ません|ます|です|でした|たい|ない|なかった|れる|られ|れ|て|た|だ|って|った|ている|てい|ています|ていました|てる|ちゃ|じゃ|います|いました|いる|せん)$/u;
const JA_PARTICLE = new Set(["は", "が", "を", "に", "で", "へ", "と", "も", "の", "か", "ね", "よ", "や"]);
const JA_HAN = /[一-鿿々]/u;
const JA_KATA = /^[ァ-ヺー]+$/u;
const JA_NUM = /^[〇一二三四五六七八九十百千万]+$/u;
/**
 * 한 글자로 잘린 뒤가 접미사라면 앞 한자 낱말에 붙인다(担当+者, 番号+札, 十一+時).
 * 한 글자 한자가 앞쪽이면 접미사가 아니어도 붙인다(会+社員, 試+着) — 조사 없이 한자가 이어지면 한 낱말의 앞부분이다.
 */
const JA_SUFFIX = new Set("者場部口時中様語員日人分目的屋店室代券費料製化性感所側内外上下後前用力庁係行機器品士師札家案制回主会".split(""));

/** ICU가 한자 낱말을 중간에서 자른 것을 순서 조각으로 쓰기 전에 붙인다. 조사(は·を)나 한 글자 동사(映画+見)는 그대로 둔다. */
function joinJaCompounds(words: string[]): string[] {
  const out: string[] = [];
  for (const word of words) {
    const prev = out[out.length - 1];
    if (prev && (prev === "お" || prev === "ご") && JA_HAN.test(word.charAt(0))) {
      out[out.length - 1] = prev + word;
      continue;
    }
    const prevHan = Boolean(prev && JA_HAN.test(prev.slice(-1)));
    if (prev && prevHan && JA_HAN.test(word.charAt(0)) && (prev.length === 1 || (word.length === 1 && JA_SUFFIX.has(word)))) {
      out[out.length - 1] = prev + word;
      continue;
    }
    if (prev && prev.length === 1 && prevHan && /^[ぁ-ゖ]/.test(word) && !JA_PARTICLE.has(word)) {
      out[out.length - 1] = prev + word;
      continue;
    }
    // 숫자(五〇三)와 한 글자로 갈라진 가타카나(パク).
    if (prev && ((JA_NUM.test(prev) && JA_NUM.test(word.charAt(0))) || (JA_KATA.test(prev) && JA_KATA.test(word) && (prev.length === 1 || word.length === 1)))) {
      out[out.length - 1] = prev + word;
      continue;
    }
    out.push(word);
  }
  return out;
}

export function tilesOf(text: string, language: string): string[] {
  const words = segmentWords(text, language);
  if (language !== "ja") return words;
  const out: string[] = [];
  for (const word of joinJaCompounds(words)) {
    const prev = out[out.length - 1];
    // 조사 뒤에 붙은 한 글자(へ+お)는 활용이 아니다.
    if (prev && JA_TAIL.test(word) && !JA_PARTICLE.has(word) && !JA_PARTICLE.has(prev) && (JA_TAIL.test(prev) || /[ぁ-ゖ]$/u.test(prev) || JA_HAN.test(prev.slice(-1)))) {
      out[out.length - 1] = prev + word;
    } else out.push(word);
  }
  return out;
}

/** 순서 맞추기 조각: 긴 줄은 이웃 낱말을 묶어 8조각 안팎으로(조각이 너무 많으면 화면이 넘침). */
export function orderTiles(text: string, language: string): string[] {
  const words = tilesOf(text, language);
  if (words.length <= 10) return words;
  const size = Math.ceil(words.length / 8);
  const glue = isSpaceless(text) ? "" : " ";
  const out: string[] = [];
  for (let i = 0; i < words.length; i += size) out.push(words.slice(i, i + size).join(glue));
  return out;
}

/** 퀴즈 순서 문제 낱말 수 상한(낱말 하나 = 조각 하나). */
export const ORDER_MAX = 12;

export function orderOf(language: string, source: QuizSource, random: () => number, options: { least?: number } = {}): QuizQuestion | null {
  // 퀴즈 순서 문제는 낱말 하나가 조각 하나(가상 사용자 2026-11-01 "My name / is Rosa." — 이웃 낱말을 묶으면 틀째로 붙어 베끼기가 됨).
  // ORDER_MAX 낱말이 넘는 줄은 내지 않는다(이웃 낱말을 묶는 orderTiles는 오늘 할 것 대본 카드 미리 보기만).
  const words = tilesOf(source.text, language);
  if (words.length < (options.least ?? 3) || words.length > ORDER_MAX) return null;
  const indices = words.map((_, i) => i);
  let tiles = shuffled(indices, random);
  for (let tries = 0; tries < 4 && tiles.every((value, i) => words[value] === words[i]); tries += 1) tiles = shuffled(indices, random);
  if (tiles.every((value, i) => words[value] === words[i])) return null;
  return { kind: "order", text: source.text, words, tiles, spaced: spacedText(source.text), gloss: source.gloss, from: source.from };
}

/** 고른 조각 차례가 맞는지(같은 낱말이 둘이면 어느 쪽이든). */
export function orderCorrect(words: readonly string[], picked: readonly number[]): boolean {
  return picked.length === words.length && picked.every((index, i) => words[index] === words[i]);
}

/** 틀린 줄의 낱말 중 고친 줄과 맞춰지지 않는 것(가장 긴 공통 차례 밖). */
export function wrongWords(wrong: readonly string[], right: readonly string[]): number[] {
  const norm = (word: string) => word.toLocaleLowerCase().replace(/[\p{P}]/gu, "");
  const a = wrong.map(norm);
  const b = right.map(norm);
  const table: number[][] = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) table[i]![j] = a[i] === b[j] ? table[i + 1]![j + 1]! + 1 : Math.max(table[i + 1]![j]!, table[i]![j + 1]!);
  }
  const kept = new Set<number>();
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      kept.add(i);
      i += 1;
      j += 1;
    } else if (table[i + 1]![j]! >= table[i]![j + 1]!) i += 1;
    else j += 1;
  }
  return a.map((_, index) => index).filter((index) => !kept.has(index) && a[index]);
}

export function fixOf(language: string, card: QuizCard, random: () => number): QuizQuestion | null {
  if (!card.wrong || !card.right || card.wrong === card.right) return null;
  const words = segmentWords(card.wrong, language);
  const bad = wrongWords(words, segmentWords(card.right, language));
  if (bad.length && bad.length < words.length) return { kind: "fix", wrong: card.wrong, right: card.right, note: card.note, words, bad };
  // 고친 게 빠진 말을 더한 것뿐이면(또는 다 바뀌었으면) 두 문장 중 맞는 것.
  const options = shuffled([card.right, card.wrong], random);
  return { kind: "fix", wrong: card.wrong, right: card.right, note: card.note, words, bad: [], options, answer: options.indexOf(card.right) };
}

/**
 * 틀린 문장과 바른 문장의 다른 자리(앞뒤로 같은 낱말을 걷어 낸 가운데): 틀린 쪽 낱말 번호와 바른 쪽 말.
 * 한 자리가 세 낱말을 넘거나(여러 군데 고친 줄), 바른 쪽이 비거나(낱말을 빼기만 함) 틀린 쪽이 비면(빠진 말을 넣기만 함) null — 누르고 칠 자리가 없다.
 */
export function diffSpan(language: string, wrong: string, right: string): { words: string[]; bad: number[]; want: string } | null {
  const words = segmentWords(wrong, language);
  const goal = segmentWords(right, language);
  const norm = (word: string) => word.toLocaleLowerCase().replace(/[\p{P}]/gu, "");
  let head = 0;
  while (head < words.length && head < goal.length && norm(words[head]!) === norm(goal[head]!)) head += 1;
  let tail = 0;
  while (tail < words.length - head && tail < goal.length - head && norm(words[words.length - 1 - tail]!) === norm(goal[goal.length - 1 - tail]!)) tail += 1;
  const bad = words.map((_, i) => i).slice(head, words.length - tail);
  const want = goal.slice(head, goal.length - tail);
  if (!bad.length || !want.length || bad.length > 3 || want.length > 3) return null;
  // 문장 끝 부호는 고칠 말에 넣지 않는다("Japan." → "Japan").
  const glue = isSpaceless(right) ? "" : " ";
  const text = want.join(glue).replace(/^[\p{P}]+|[\p{P}]+$/gu, "");
  return text ? { words, bad, want: text } : null;
}

/** 확실히 틀린 꼴만(frames/decoys/plain) — 문장 첫머리 대문자에 맞춘다. */
export function plainMisses(language: string, frameId: string, piece: string): string[] {
  return nearMisses(language, frameId, piece, PLAIN_DECOYS);
}

/**
 * 틀린 곳 찾아 고치기 한 문제: 예문의 문장구조 조각을 확실히 틀린 꼴로 바꾼다. clean이면 바꾸지 않은 문장(틀린 곳 없음).
 * 그 조각의 확실히 틀린 꼴이 없으면 null(뜻만 다른 맞는 말을 틀렸다고 하지 않게).
 */
export function spotOf(language: string, key: string, source: QuizSource, random: () => number, clean = false): SpotQuestion | null {
  const piece = source.piece;
  const frameId = key.startsWith("f|") ? key.slice(2) : source.frame;
  // 표현(e|)도(2026-11-01 정기 시험 4칸): 오답 표 정리 뒤 표현 오답은 모두 그 표현의 실수 꼴(맞는 대안·다른 품사는 뺌)이라 그대로 틀린 꼴로 쓴다.
  const expression = key.startsWith("e|") ? key.slice(2) : "";
  if (!piece || (!frameId && !expression)) return null;
  const at = pieceAt(source.text, piece, language);
  if (at < 0) return null;
  const plain = frameId ? plainMisses(language, frameId, piece) : expressionNearMisses(language, expression, piece);
  const misses = plain.filter((one) => one && !same(one, piece) && !lower(source.text).includes(lower(one)));
  if (!misses.length) return null;
  const words = segmentWords(source.text, language);
  if (words.length < 3 || words.length > 14) return null;
  if (clean) return { kind: "spot", text: source.text, right: source.text, words, bad: [], want: "", gloss: source.gloss, from: source.from };
  const miss = shuffled(misses, random)[0]!;
  let rest = source.text.slice(at + piece.length);
  // 프랑스어 생략(qu'·j'): 조각은 아포스트로피로 끝나 다음 낱말과 붙어 있는데 오답은 아니면 띄우고, 거꾸로면 붙인다.
  const elided = (text: string) => /['’]$/.test(text);
  if (elided(piece) && !elided(miss) && rest && !/^\s/.test(rest)) rest = ` ${rest}`;
  else if (!elided(piece) && elided(miss)) rest = rest.replace(/^\s+/, "");
  const wrong = source.text.slice(0, at) + miss + rest;
  const span = diffSpan(language, wrong, source.text);
  if (!span) return null;
  return { kind: "spot", text: wrong, right: source.text, words: span.words, bad: span.bad, want: span.want, gloss: source.gloss, from: source.from, near: [miss] };
}

/** 튜터가 고친 내 줄로 틀린 곳 고치기(내가 실제로 한 실수) — 자리가 하나로 안 잡히면 null(그땐 예전 fix). */
export function spotFromCard(language: string, card: QuizCard): SpotQuestion | null {
  if (!card.wrong || !card.right || same(card.wrong, card.right)) return null;
  const span = diffSpan(language, card.wrong, card.right);
  if (!span || span.words.length > 16) return null;
  return { kind: "spot", text: card.wrong, right: card.right, words: span.words, bad: span.bad, want: span.want, ...(card.note ? { note: card.note } : {}), from: "card", mine: true };
}

/** 고친 말이 맞는지(틀린 곳 고치기) — 빈칸 쓰기와 같은 채점, 틀린 꼴 그대로 다시 친 것은 틀림. */
export function fixedRight(question: SpotQuestion, typed: string, language: string): "exact" | "loose" | false {
  const wrongPart = question.bad.map((i) => question.words[i]).join(isSpaceless(question.text) ? "" : " ");
  return typedRight(question.want, typed, { language, near: [...(question.near ?? []), wrongPart] });
}

/**
 * 열쇠 하나의 퀴즈: [고친 줄] → 고르기·순서 → 말하기, 셋까지. 재료가 모자라면 문제가 둘 이하일 수 있고, 하나도 못 만들면 null(그땐 원래 대본으로).
 * seed = 그날(같은 날 다시 열면 같은 문제).
 */
/**
 * round = 이 열쇠를 이 폰에서 몇 번 풀었나(quizLog n): 문장을 돌려 매번 다른 줄로, 모양도 돌린다 —
 * 0번째 고르기 먼저(알아보기) · 1번째 맞추기 먼저(구조) · 2번째부터 말하기 둘(꺼내기). 시험(checkup·stageTest·placement)은 round 없이.
 */
/**
 * 문법·문장구조 열쇠는 말하기로 맞음/틀림을 가리지 않는다(2026-10-29 사용자 "문법 요소가 말하기 채점에 연결된 게 문제" → "1, 2번 먼저"):
 * 받아쓰기가 작은 표지(3인칭 s·관사·조사)를 고쳐 듣고, 판정은 뜻으로 해서 그 규칙을 틀려도 맞음이 된다. 그래서 이 열쇠의 문제는 고르기·순서·빈칸만.
 */
export function speakScored(key: string): boolean {
  return !key.startsWith("g|") && !key.startsWith("f|");
}

/**
 * 단어 퀴즈(빈도 단어 w|, 2026-10-29 사용자 "새 낱말 퀴즈는 단어 퀴즈인 거야?" → 셋 다): 빈칸(그 낱말 자리) 먼저 →
 * 낱말 뜻 고르기(예문 속 그 낱말에 밑줄, 보기는 다른 낱말 뜻) → 그 예문 말하기(밑줄). 학습 조합과 상관없이 이 모양.
 */
export function wordQuiz(language: string, key: string, seed = ""): Quiz | null {
  // 단어 퀴즈 = 예문 빈칸 하나(2026-10-30 사용자 "단어 퀴즈는 단순하게 맞추기 > 예문 형태로, 발음·듣기 문제는 삭제").
  // 같은 낱말을 모양만 바꿔 세 번 묻지 않는다 — 낱말 여럿은 묶음으로 한 문제씩.
  const source = shownLast(language, key, quizSources(language, key))[0];
  if (!source?.piece || !source.text.includes(source.piece)) return null;
  const random = rng(`${key}|${seed}|word`);
  // 단어는 빈칸만(사용자 2026-10-30, 짝 맞추기는 2026-11-03에 뺌) — 빈칸을 못 만들면 순서 맞추기로 넘기지 않는다.
  // 빈칸 쓰기를 먼저(2026-10-30 사용자 "타이핑 문제를 대거") — 보기로 고르기는 다음 문장에서.
  const typed = typeOf(language, source, key);
  const question = chooseOf(language, key, source, random);
  const list = [typed, question].filter((one): one is QuizQuestion => Boolean(one));
  return list.length ? { key, questions: list } : null;
}

/**
 * 묶음 퀴즈(2026-10-29 사용자 "세 부분을 합쳐서 묶음 퀴즈로"): 열쇠 여럿에서 한 문제씩 — 같은 열쇠를 세 번 묻지 않는다.
 * 열쇠마다 그 열쇠 퀴즈의 첫 문제(말하기는 묶음에 하나까지, 같은 문장 두 번 없음). 문제마다 열쇠를 같이 돌려준다(결과는 열쇠마다 기록).
 */
// 빈칸 쓰기가 셋에 하나 넘게(2026-10-30 사용자 "빈칸에 들어갈 단어를 타이핑하는 단순 문제를 대거 늘려줘").
const BUNDLE_KINDS: readonly QuizQuestion["kind"][] = ["type", "choose", "type", "order", "type", "meaning", "say"];

/** 복습에서 고른 문제 모양(2026-10-30 사용자 "각각의 탭에 들어갔을 때 학습 방식을 선택하게") — 없으면 돌아가며. */
export type QuizStyle = Extract<QuizQuestion["kind"], "type" | "choose" | "order" | "say" | "meaning">;

export function bundleQuiz(
  language: string,
  keys: readonly string[],
  /** strict: 고른 모양(style)만 — 못 만드는 열쇠는 건너뜀(퀴즈 칸 = 빈칸 고르기만, 사용자 2026-10-30). */
  options: {
    seed?: string;
    stage?: number;
    style?: QuizStyle;
    strict?: boolean;
    /** 고른 모양과 번갈아 낼 모양(빈칸 고르기 ↔ 빈칸 쓰기, 2026-10-30). */
    alternate?: QuizStyle;
    /** strict인데 고른 모양을 못 만드는 열쇠에 대신 낼 모양(빈칸 쓰기를 못 만드는 긴 조각 → 빈칸 고르기). */
    fallback?: QuizStyle;
    /**
     * 틀린 곳 찾아 고치기를 섞는다(2026-10-30 사용자 "문장 내에서 틀린 부분을 맞추고 수정하는 식 · 대화 속 틀린 문장 고르기"):
     * cards = 열쇠마다 튜터가 고친 내 줄(내 실수 먼저). 대화에서 틀린 줄은 문법 탭과 함께 뺌(2026-11-03).
     */
    spots?: SpotMix;
  } = {},
): { questions: QuizQuestion[]; keys: string[] } {
  const questions: QuizQuestion[] = [];
  const out: string[] = [];
  const texts = new Set<string>();
  let says = 0;
  for (const key of keys) {
    if (questions.length >= QUIZ_SIZE + 1) break;
    // 모양을 돌아가며(빈칸 → 순서 → 말하기 → 뜻) — 묶음이 한 모양만 되지 않게. 단어(w|)는 단어 퀴즈의 첫 문제(빈칸).
    const want = options.style ? (options.alternate && questions.length % 2 === 0 ? options.alternate : options.style) : BUNDLE_KINDS[questions.length % BUNDLE_KINDS.length]!;
    // 모양을 고른 묶음이면 못 만들 때 쓰기는 맨 끝에(고른 모양에 가까운 것부터).
    const order = options.style ? [want, ...[...new Set(BUNDLE_KINDS)].filter((kind) => kind !== want && kind !== "type"), ...(want === "type" ? [] : (["type"] as const))] : [want, ...[...new Set(BUNDLE_KINDS)].filter((kind) => kind !== want)];
    const quiz = key.startsWith("w|") ? buildQuiz(language, key, { seed: options.seed, stage: options.stage }) : (buildQuiz(language, key, { seed: options.seed, stage: options.stage, kinds: order }) ?? buildQuiz(language, key, { seed: options.seed, stage: options.stage }));
    if (!quiz) continue;
    const textOf = (q: QuizQuestion) => ("text" in q ? q.text : q.kind === "fix" ? q.right : "");
    const usable = (q: QuizQuestion) => !texts.has(textOf(q)) && (q.kind !== "say" || says < 1 || options.style === "say") && q.kind !== "fix";
    let pick = quiz.questions.find((q) => q.kind === want && usable(q)) ?? (options.strict && options.style ? undefined : (options.style ? quiz.questions.find((q) => q.kind !== "type" && usable(q)) : undefined) ?? quiz.questions.find(usable));
    if (!pick && options.strict && options.fallback) {
      const again = key.startsWith("w|") ? quiz : buildQuiz(language, key, { seed: options.seed, stage: options.stage, kinds: [options.fallback] });
      pick = again?.questions.find((q) => q.kind === options.fallback && usable(q));
    }
    if (!pick) continue;
    if (pick.kind === "say") says += 1;
    texts.add(textOf(pick));
    questions.push(pick);
    out.push(key);
  }
  if (options.spots) addSpots(language, keys, questions, out, texts, options);
  return { questions, keys: out };
}

/** anyCard: 묶음 열쇠 밖의 고친 줄도(틀린 것 탭 — 내 실수가 먼저). */
export type SpotMix = { cards?: ReadonlyMap<string, QuizCard>; anyCard?: boolean };

/** 묶음에 틀린 곳 고치기 하나를 끼운다 — 내 실수 줄 먼저, 없으면 문장구조 예문, 넷에 하나는 틀린 곳 없는 문장. */
function addSpots(
  language: string,
  keys: readonly string[],
  questions: QuizQuestion[],
  out: string[],
  texts: Set<string>,
  options: { seed?: string; stage?: number; spots?: SpotMix },
): void {
  const random = rng(`${keys.join(",")}|${options.seed ?? ""}|spot`);
  // 같은 열쇠를 모양만 바꿔 바로 잇지 않게(RULES 학습 점검 ④) — 끼울 자리 앞뒤 열쇠는 빼고, 없으면 그 열쇠도.
  const at = Math.min(2, out.length);
  const near = new Set([out[at - 1], out[at]].filter(Boolean));
  const ordered = [...keys.filter((key) => !near.has(key)), ...keys.filter((key) => near.has(key))];
  let spot: { question: QuizQuestion; key: string } | null = null;
  const cardKeys = options.spots?.anyCard ? [...(options.spots.cards?.keys() ?? [])].filter((key) => !ordered.includes(key)) : [];
  for (const key of [...ordered, ...cardKeys]) {
    const card = options.spots?.cards?.get(key);
    const mine = card ? spotFromCard(language, card) : null;
    if (mine && !texts.has(mine.text)) {
      spot = { question: mine, key };
      break;
    }
  }
  if (!spot) {
    const clean = random() < 0.25;
    for (const key of ordered) {
      if (!key.startsWith("f|") && !key.startsWith("g|")) continue;
      const sources = shuffled(quizSources(language, key), random).filter((source) => !texts.has(source.text) && (!options.stage || source.stage <= options.stage + 1));
      for (const source of sources) {
        // 틀린 곳 없는 문장도 그 조각에 확실히 틀린 꼴이 있는 문장만(같은 문장이 다른 날 틀리게 나올 수 있게).
        const made = spotOf(language, key, source, random, clean);
        if (made) {
          spot = { question: made, key };
          break;
        }
      }
      if (spot) break;
    }
  }
  if (spot) {
    texts.add((spot.question as SpotQuestion).right);
    questions.splice(at, 0, spot.question);
    out.splice(at, 0, spot.key);
  }
}

export function buildQuiz(
  language: string,
  key: string,
  options: {
    card?: QuizCard | null;
    seed?: string;
    round?: number;
    mix?: QuizMix;
    kinds?: readonly QuizQuestion["kind"][];
    stage?: number;
    /** 뒤로 미룰 문장(문장구조 수업이 설명에서 이미 보여 준 예문 — 가상 사용자 2026-11-01 "퀴즈가 방금 본 예문 그대로"). 다른 문장이 없을 때만 쓴다. */
    later?: ReadonlySet<string>;
  } = {},
): Quiz | null {
  // 지금 단계 + 1까지의 예문만(2026-10-29 사용자 — 1단계에 4·5단계 업무 문장이 나옴). 그 안에 없으면 가까운 단계부터.
  const near = (list: QuizSource[]): QuizSource[] => {
    const stage = options.stage;
    if (!stage) return list;
    const inside = list.filter((source) => source.stage === 0 || source.stage <= stage + 1);
    if (inside.length) return inside;
    const closest = Math.min(...list.map((source) => source.stage));
    return list.filter((source) => source.stage === closest);
  };
  if (key.startsWith("w|")) {
    const word = wordQuiz(language, key, options.seed);
    // 모양을 골랐으면 그 모양만(없으면 단어 퀴즈 그대로).
    const only = word && options.kinds?.length ? word.questions.filter((q) => options.kinds!.includes(q.kind)) : [];
    if (word && only.length) return { key, questions: only };
    // 모양을 골랐는데 그 모양을 못 만들면 내지 않는다(부르는 쪽이 다른 열쇠로).
    if (options.kinds?.length) return null;
    // 단어는 빈칸만 — 빈칸을 못 만들면 순서·말하기·뜻 고르기로 넘어가지 않는다(사용자 2026-10-30, 짝 맞추기는 2026-11-03에 뺌).
    return word;
  }
  // 조합(말하기·읽기)이 정한 모양, "알아서"면 항목에 맞는 모양(curriculum/learnStyle.ts — 부르는 쪽이 kinds로).
  const kinds = options.mix && options.mix !== "auto" ? MIX_KINDS[options.mix] : options.kinds;
  if (kinds?.length) {
    const random = rng(`${key}|${options.seed ?? ""}|${kinds.join(",")}`);
    const all = shuffled(near(quizSources(language, key)), rng(key));
    const shift = options.round && all.length ? (options.round * 2) % all.length : 0;
    const questions = mixQuiz(language, key, shownLast(language, key, [...all.slice(shift), ...all.slice(0, shift)], options.later), kinds, random);
    const fix = options.card ? fixOf(language, options.card, random) : null;
    const list = fix ? [fix, ...questions].slice(0, QUIZ_SIZE) : questions;
    // 조합대로 둘 넘게 못 만들면 앱이 돌리는 퀴즈로 — 읽기 조합은 그 전에 말하기 없는 모양으로 한 번 더.
    if (list.length >= 2) return { key, questions: list };
    if (options.mix === "read") {
      const again = mixQuiz(language, key, all, ["choose", "meaning", "order"], random);
      if (again.length >= 2) return { key, questions: again };
    }
  }
  const random = rng(`${key}|${options.seed ?? ""}`);
  const all = options.round === undefined ? shuffled(near(quizSources(language, key)), random) : shuffled(near(quizSources(language, key)), rng(key));
  const shift = options.round && all.length ? (options.round * 2) % all.length : 0;
  const sources = shownLast(language, key, [...all.slice(shift), ...all.slice(0, shift)], options.later);
  const speakable = (source: QuizSource) => source.who !== "them" && speakScored(key);
  const questions: QuizQuestion[] = [];
  const used = new Set<string>();
  const fix = options.card ? fixOf(language, options.card, random) : null;
  if (fix) questions.push(fix);
  const middle: QuizQuestion[] = [];
  // 빈칸 쓰기 하나 먼저(2026-10-30).
  for (const source of sources) {
    const typed = typeOf(language, source, key);
    if (typed) {
      middle.push(typed);
      used.add(source.text);
      break;
    }
  }
  for (const source of sources) {
    if (middle.some((q) => q.kind === "choose")) break;
    if (used.has(source.text)) continue;
    const choose = chooseOf(language, key, source, random);
    if (choose) {
      middle.push(choose);
      used.add(source.text);
    }
  }
  for (const source of sources) {
    if (used.has(source.text)) continue;
    const order = orderOf(language, source, random);
    if (order) {
      middle.push(order);
      used.add(source.text);
      break;
    }
  }
  // 재료가 한 문장뿐이면(뼈대 밖 막힌 것) 같은 문장으로 맞추기도.
  if (!middle.some((q) => q.kind === "order") && sources.length === 1) {
    const order = orderOf(language, sources[0]!, random);
    if (order) middle.push(order);
  }
  const sayFrom = sources.find((source) => speakable(source) && !used.has(source.text)) ?? sources.find(speakable);
  const round = options.round ?? 0;
  if (round === 1) middle.sort((a, b) => (a.kind === "order" ? -1 : 0) - (b.kind === "order" ? -1 : 0));
  // 세 번째부터: 고르기 대신 다른 줄 말하기 하나 더(꺼내기를 늘림).
  const secondSay = round >= 2 && !fix ? sources.find((source) => speakable(source) && !used.has(source.text) && source.text !== sayFrom?.text) : undefined;
  const middleKept = secondSay ? middle.filter((q) => q.kind !== "choose").slice(0, 1) : middle;
  // 문법 열쇠: 말하기 자리에 다른 줄 맞추기(없으면 고르기) 하나 더.
  if (!speakScored(key)) {
    for (const source of sources) {
      if (used.has(source.text)) continue;
      const extra = orderOf(language, source, random) ?? chooseOf(language, key, source, random);
      if (extra) {
        middle.push(extra);
        used.add(source.text);
        break;
      }
    }
  }
  const room = QUIZ_SIZE - questions.length - (sayFrom ? 1 : 0) - (secondSay ? 1 : 0);
  questions.push(...middleKept.slice(0, Math.max(0, room)));
  if (secondSay) questions.push({ kind: "say", text: secondSay.text, gloss: secondSay.gloss, from: secondSay.from });
  if (sayFrom) questions.push({ kind: "say", text: sayFrom.text, gloss: sayFrom.gloss, from: sayFrom.from });
  return questions.length >= 2 ? { key, questions } : null;
}

/**
 * 문장구조 수업 퀴즈 세 문제(가상 사용자 2026-11-01 U25 — 쓰기 → 같은 조각 고르기 → 순서가 한 틀의 같은 답을 세 번 물음):
 * 문제마다 다른 것을, 다른 문장으로 묻는다.
 * ① 빈칸 쓰기 — 틀 조각을 떠올려 친다(대본 줄·문제은행 예문 먼저, 설명에서 보여 준 예문은 뒤로).
 * ② 틀린 곳 찾아 고치기 — 그 틀의 확실히 틀린 꼴(frames/decoys/plain)이 든 문장에서 틀린 낱말을 찾아 바른 꼴로. 못 만들면 뜻 고르기.
 * ③ 낱말 순서 — 낱말 넷 이상인 다른 문장(긴 것부터), 낱말 하나가 조각 하나. 못 만들면 뜻 고르기·고르기.
 * 같은 조각을 고르는 문제(고르기)는 다른 모양을 못 만들 때만.
 */
/**
 * them: 상대 줄 예문도 재료로(표현 — 내 줄에 한 번만 나오는 표현이 많아 문제가 안 만들어지던 것, 2026-11-02 사용자 "다른 방식은 문제밖에/설명만").
 * min: 이만큼 만들어지면 냄(기본 2). avoid: 이 문장은 쓰지 않음(대본 앞 수업 — 곧 할 대화의 내 줄이 답이 되지 않게).
 */
export function lessonQuiz(
  language: string,
  key: string,
  options: { seed?: string; stage?: number; later?: ReadonlySet<string>; them?: boolean; min?: number; avoid?: ReadonlySet<string> } = {},
): QuizQuestion[] {
  const random = rng(`${key}|${options.seed ?? ""}|lesson`);
  const stage = options.stage;
  const all = quizSources(language, key).filter((source) => (options.them || source.who !== "them") && !options.avoid?.has(source.text));
  const inside = stage ? all.filter((source) => source.stage === 0 || source.stage <= stage + 1) : all;
  const sources = shownLast(language, key, shuffled(inside.length ? inside : all, random), options.later);
  const used = new Set<string>();
  const out: QuizQuestion[] = [];
  const take = (make: (source: QuizSource) => QuizQuestion | null, list: readonly QuizSource[] = sources): boolean => {
    for (const source of list) {
      if (used.has(source.text)) continue;
      const made = make(source);
      if (made) {
        used.add(source.text);
        out.push(made);
        return true;
      }
    }
    return false;
  };
  if (!take((source) => typeOf(language, source, key))) take((source) => chooseOf(language, key, source, random));
  if (!take((source) => spotOf(language, key, source, random))) take((source) => meaningOf(language, source, random));
  const longest = [...sources].sort((a, b) => tilesOf(b.text, language).length - tilesOf(a.text, language).length);
  if (!take((source) => orderOf(language, source, random, { least: 4 }), longest)) {
    if (!take((source) => meaningOf(language, source, random))) take((source) => chooseOf(language, key, source, random));
  }
  return out.length >= (options.min ?? 2) ? out : [];
}

/** 두 뜻풀이의 모양이 비슷한가(뜻 고르기 오답 — 낱말 수, 띄어 쓰지 않으면 글자 수). */
export function similarShape(a: string, b: string): boolean {
  const words = (text: string) => text.trim().split(/[\s/,;·]+/u).filter(Boolean).length;
  const wa = words(a), wb = words(b);
  if (wa > 1 || wb > 1) return Math.abs(wa - wb) <= 1;
  const la = [...a.trim()].length, lb = [...b.trim()].length;
  return Math.max(la, lb) <= 2 * Math.max(1, Math.min(la, lb));
}

/** 같은 단계 근처의 다른 줄(뜻 고르기 오답). */
function otherLines(language: string, source: QuizSource): { text: string; gloss: ScriptGloss }[] {
  const near = (s: number) => source.stage === 0 || Math.abs(s - source.stage) <= 1;
  const out: { text: string; gloss: ScriptGloss }[] = [];
  for (const script of allScriptsFor(language)) {
    if (!near(script.stage)) continue;
    for (const line of script.lines) if (line.text !== source.text && line.gloss?.en && line.gloss.en !== source.gloss.en) out.push({ text: line.text, gloss: line.gloss });
  }
  return out;
}

function meaningOf(language: string, source: QuizSource, random: () => number): QuizQuestion | null {
  if (source.gloss.raw === undefined && !source.gloss.en) return null;
  const wrong = shuffled(otherLines(language, source), random).slice(0, 2).map((line) => line.gloss);
  if (wrong.length < 2) return null;
  const options = shuffled([source.gloss, ...wrong], random);
  return { kind: "meaning", text: source.text, options, answer: options.indexOf(source.gloss), gloss: source.gloss, from: source.from };
}

/** 조합마다 세 문제의 모양(앞에서부터, 못 만들면 다음 것). */
const MIX_KINDS: Record<Exclude<QuizMix, "auto">, QuizQuestion["kind"][]> = {
  speak: ["order", "say", "say"],
  read: ["type", "choose", "type"],
};

/** 조합을 정한 퀴즈: 문장마다 그 조합의 모양으로(같은 문장은 한 번). */
function mixQuiz(language: string, key: string, sources: readonly QuizSource[], kinds: readonly QuizQuestion["kind"][], random: () => number): QuizQuestion[] {
  const used = new Set<string>();
  const out: QuizQuestion[] = [];
  for (const wanted of kinds) {
    // 문법 열쇠는 말하기 대신 고르기(못 만들면 아래에서 맞추기로).
    const kind: QuizQuestion["kind"] = wanted === "say" && !speakScored(key) ? (out.some((q) => q.kind === "choose") ? "order" : "choose") : wanted;
    const pool = sources.filter((source) => !used.has(source.text) && (kind !== "say" || source.who !== "them"));
    const fallback = sources.filter((source) => kind !== "say" || source.who !== "them");
    let made: QuizQuestion | null = null;
    for (const source of [...pool, ...fallback]) {
      made =
        kind === "type" ? typeOf(language, source, key)
        : kind === "choose" ? chooseOf(language, key, source, random)
        : kind === "order" ? orderOf(language, source, random)
        : kind === "meaning" ? meaningOf(language, source, random)
        : { kind: "say", text: source.text, gloss: source.gloss, from: source.from };
      if (made && !out.some((q) => q.kind === made!.kind && "text" in q && "text" in made! && q.text === made!.text)) {
        used.add(source.text);
        break;
      }
      made = null;
    }
    if (made) out.push(made);
  }
  return out;
}

/** 묶음을 넘겼나: 센 문제의 70% 이상. */
export function unitPassed(correct: number, counted: number): boolean {
  return counted > 0 && correct / counted >= 0.7;
}

/** 이 열쇠로 퀴즈를 낼 수 있는지(오늘 할 것이 퀴즈와 원래 대본 중 고를 때). */
export function canQuiz(language: string, key: string): boolean {
  return buildQuiz(language, key) !== null;
}

/** 조각 순서 문제의 맞는 문장 모양(띄어쓰기 없는 언어는 붙여서). */
export function joinWords(words: readonly string[], spaced: boolean): string {
  return words.join(spaced ? " " : "");
}

/**
 * 개편 퀴즈(2026-11-07 사용자 "단어카드에서 뜻만 가리거나 반대로 뜻만 보여주는 형태로" → "일단 만들고 보여줘", 설계 hub/work/drafts/quiz-mix-2026-11-04.md):
 * 낱말(w|)·표현(e|) 카드 하나로 두 모양.
 * 2026-11-06 사용자 "그냥 카드를 그대로 두고 예문에 빈칸, 단어만 가리고": 카드 한 장(낱말 · 뜻 · 예문 · 예문 뜻) 그대로, 한 칸만 가린다.
 *   hide = 뜻 가림 — 낱말·예문(밑줄)은 보이고 뜻 칸과 예문 뜻만 가림 → 뜻 넷 중 고르기(오답 = 같은 종류·같은 품사의 다른 카드 뜻)
 *   show = 낱말 가림 — 뜻·예문 뜻은 보이고 낱말 칸과 예문 속 그 말만 빈칸 → 예문 속 꼴 쓰기(사전형도 맞음)
 * 카드(뜻)가 아직 안 왔거나 오답이 모자라면 null — 부르는 쪽이 예전 모양으로.
 */
/** 언어마다 바로 앞 뜻 가림 문제에 나온 보기(뜻) — 다음 문제 보기에서 뺀다. */
/** 보기 뜻을 다시 안 쓰는 최근 문제 수(고르기). */
export const RECENT_OPTION_QUESTIONS = 3;
const RECENT_OPTIONS = new Map<string, Set<string>[]>();

/** 낱말·표현 카드 앞면(Logbank "배운 것" 목록 — 2026-11-07): 퀴즈와 같은 카드(낱말·뜻·예문·예문 뜻), 첫 예문. 없으면 null. */
export function cardFaceOf(language: string, key: string): { word: string; meaning: string; text: string; piece: string; gloss: ScriptGloss } | null {
  const pool = key.startsWith("w|") ? GAP_SOURCES.get(language) : key.startsWith("e|") ? EXPRESSION_CARDS.get(language) : undefined;
  const source = (pool?.get(key) ?? []).find((one) => one.wordGloss?.trim() && one.piece && one.text.includes(one.piece));
  if (!source?.wordGloss || !source.piece) return null;
  return { word: key.slice(2), meaning: source.wordGloss.trim(), text: source.text, piece: source.piece, gloss: source.gloss };
}

/** 카드 예문 하나(최근에 이 열쇠로 낸 문장은 뒤로 — cardQuiz와 같은 고르기). 사다리 4칸 문장 전체 쓰기가 씀. */
export function cardSourceOf(language: string, key: string, seed: string): QuizSource | undefined {
  const pool = key.startsWith("w|") ? GAP_SOURCES.get(language) : key.startsWith("e|") ? EXPRESSION_CARDS.get(language) : undefined;
  const usable = (pool?.get(key) ?? []).filter((one) => one.wordGloss?.trim() && one.piece && one.text.includes(one.piece));
  const asked = askedTexts(language, key);
  const unasked = usable.filter((one) => !asked.includes(one.text));
  const oldest = [...usable].sort((a, b) => asked.indexOf(b.text) - asked.indexOf(a.text))[0];
  return unasked.length ? unasked[Math.floor(rng(`${seed}|${key}|src`)() * unasked.length)] : oldest;
}

export function cardQuiz(language: string, key: string, mode: "hide" | "show", seed: string): QuizQuestion | null {
  const kind = key.startsWith("w|") ? "w" : key.startsWith("e|") ? "e" : null;
  if (!kind) return null;
  const pool = kind === "w" ? GAP_SOURCES.get(language) : EXPRESSION_CARDS.get(language);
  // 예문이 여럿이면 차례(seed)마다 다른 것 — 다시 볼 때 같은 문장을 기억으로 풀지 않게(2026-11-07 점검 easy-repeat).
  const usable = (pool?.get(key) ?? []).filter((one) => one.wordGloss?.trim() && one.piece && one.text.includes(one.piece));
  // 최근에 이 열쇠로 낸 문장(noteAsked — 첫 측정·퀴즈)은 뒤로: 안 낸 예문이 있으면 그중에서, 다 냈으면 가장 오래전 것(2026-11-10 구성 고치기 —
  // 틀린 것이 몇 분 뒤 같은 예문으로 다시 나와 기억으로 고름, 가상 사용자 11-07·11-09 easy-repeat).
  const asked = askedTexts(language, key);
  const unasked = usable.filter((one) => !asked.includes(one.text));
  const oldest = [...usable].sort((a, b) => asked.indexOf(b.text) - asked.indexOf(a.text))[0];
  const source = unasked.length ? unasked[Math.floor(rng(`${seed}|${key}|src`)() * unasked.length)] : oldest;
  if (!source?.wordGloss || !pool) return null;
  const answer = key.slice(2);
  const gloss = source.wordGloss.trim();
  const norm = (text: string) => text.normalize("NFC").toLocaleLowerCase().replace(/[\s.,;:!?。、]+/gu, " ").trim();
  const others: { key: string; gloss: string; pos?: string; at: number }[] = [];
  let at = -1;
  let index = 0;
  for (const [other, sources] of pool) {
    index += 1;
    if (other === key) at = index;
    if (other === key || !other.startsWith(`${kind}|`)) continue;
    const one = sources.find((item) => item.wordGloss?.trim());
    if (one?.wordGloss) others.push({ key: other, gloss: one.wordGloss.trim(), ...(one.pos ? { pos: one.pos } : {}), at: index });
  }
  const random = rng(`${seed}|${key}|${mode}`);
  const face: QuizCardFace = { word: answer, meaning: gloss };
  if (mode === "show") {
    // 낱말 가림: 카드의 뜻·예문 뜻은 그대로, 낱말 칸과 예문 속 그 말만 빈칸 — 예문 속 꼴을 쓴다(사전형도 맞음).
    const at = source.text.indexOf(source.piece!);
    return {
      kind: "type",
      text: source.text,
      before: source.text.slice(0, at),
      after: source.text.slice(at + source.piece!.length),
      answer: source.piece!,
      gloss: source.gloss,
      from: key,
      card: face,
    };
  }
  // 오답: 같은 품사 + 빈도 순위가 가까운 카드의 뜻 먼저(드문 낱말 뜻은 한눈에 지워짐 — 2026-11-07 점검 easy-decoy "area ↔ 바나나"),
  // 최근 세 문제에 보기로 나온 뜻은 빼고(같은 보기가 다음 문제 정답·오답으로 다시 — easy-repeat).
  const recent = new Set((RECENT_OPTIONS.get(language) ?? []).flatMap((one) => [...one]));
  // 이 문제의 정답 뜻이 방금 보기로 나왔으면 고르기는 소거로 풀림 — 표현은 쓰기(낱말 가림)로(2026-11-10 구성 고치기, 11-07 "have — 앞 문제 오답이던 소유하다가 정답").
  // 낱말은 한 모양이라 쓰기 대신 스스로 체크(퀴즈 다시 짜기 3단계).
  if (recent.has(norm(gloss))) return kind === "w" ? { kind: "know", text: source.text, mark: source.piece!, gloss: source.gloss, from: key, card: face } : cardQuiz(language, key, "show", seed);
  const seen = new Set([norm(gloss)]);
  const samePos = others.filter((other) => !source.pos || other.pos === source.pos);
  const near = samePos.filter((other) => at < 0 || Math.abs(other.at - at) <= 200);
  // 모양이 비슷한 뜻 먼저(가상 사용자 2026-11-09 easy-decoy: "소리 내어 말하다" 옆 "파도타기", "لا أظن ذلك" 옆 "الفاتورة" — 표현은 품사가 없어
  // 낱말 하나짜리 뜻이 한눈에 지워짐). 띄어 쓰는 앱 언어는 낱말 수 차이 1 이하, 안 띄어 쓰는 언어(ja·zh·th)는 글자 수 두 배 안.
  const shaped = (list: typeof others) => list.filter((other) => similarShape(other.gloss, gloss));
  const wrong: string[] = [];
  // 낱말(퀴즈 다시 짜기 3단계, 사용자 2026-11-10 "선지가 다수일 시 고르기"): 같은 품사·모양이 비슷한 뜻만 보기로 — 셋이 안 모이면
  // 한눈에 지워지는 보기로 채우지 않고 스스로 체크(kind "know"). 표현은 품사가 없어 예전 차례 그대로.
  const candidates = kind === "w" ? [...shuffled(shaped(near), random), ...shuffled(shaped(samePos), random)] : [...shuffled(shaped(near), random), ...shuffled(shaped(samePos), random), ...shuffled(shaped(others), random), ...shuffled(near, random), ...shuffled(samePos, random), ...shuffled(others, random)];
  for (const other of candidates) {
    if (wrong.length >= 3) break;
    const n = norm(other.gloss);
    if (seen.has(n) || recent.has(n)) continue;
    seen.add(n);
    wrong.push(other.gloss);
  }
  if (wrong.length < 3) return kind === "w" ? { kind: "know", text: source.text, mark: source.piece!, gloss: source.gloss, from: key, card: face } : null;
  RECENT_OPTIONS.set(language, [new Set([norm(gloss), ...wrong.map(norm)]), ...(RECENT_OPTIONS.get(language) ?? [])].slice(0, RECENT_OPTION_QUESTIONS));
  const right: ScriptGloss = { en: "", raw: gloss };
  const options = shuffled([right, ...wrong.map((raw): ScriptGloss => ({ en: "", raw }))], random);
  return { kind: "meaning", text: source.text, options, answer: options.indexOf(right), gloss: source.gloss, from: key, mark: source.piece, card: face };
}
