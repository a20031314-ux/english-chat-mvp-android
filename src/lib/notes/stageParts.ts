/**
 * 단계를 네 갈래로 잰다: 어휘 · 문법 · 표현 · 발음(사용자 2026-10-25 "어휘, 문법, 표현, 발음 이런 식으로 나눠서
 * 수준별로 발음이 부족하면 발음을 향상해서 다음 단계로 넘어가게").
 *
 * - 어휘: 장부에서 낱말(두 낱말까지) — 숙지 1, 배움 ½. 단계마다 누적 목표(VOCAB_TARGETS).
 * - 문법: 그 단계 문법 칸마다 — 영어 구문 숙지면 1, 아니면 칸에 든 습득한 표현 둘이면 1·하나면 ½.
 * - 표현: 그 단계 핵심 표현(curriculum/stages expressions) — 숙지 1, 배움 ½(stageProgress와 같은 셈).
 * - 발음: 다시 말해 본 줄에서 모든 낱말이 맞게 들린 수(learner/growth pronunciation). 한 번도 해 보지 않았으면
 *   "재료 없음" — 다음 단계 조건에서 빠진다(통화를 안 쓰거나 iOS처럼 통화가 없는 곳에서 막히지 않게).
 *
 * 잰 갈래가 모두 STAGE_DONE_SHARE(70%) 이상이면 다음 단계로 갈 수 있다(넘기는 것은 사용자가 고른다).
 * 아니면 가장 모자란 갈래를 "다음 단계까지" 하나로 짚는다. 레벨 이름은 없다(단계 번호만).
 *
 * 요소 태그(2026-10-26 사용자 "그렇게 해줘" — 한 문장에 여러 학습 요소): 습득한 표현은 주 칸 밖에 함께 보여 준 문법 칸(`also`)도
 * 채우고, 튜터가 고친 줄은 걸친 갈래(`parts`)마다 "최근 짚임"으로 센다. 짚임은 채우지 않는다(틀린 것이라) —
 * 70% 아래 갈래 가운데 최근 2주에 MISTAKE_FOCUS번 이상 짚인 갈래가 있으면 그것을 "다음 단계까지"로 먼저 짚는다.
 *
 * 순수.
 */
import { STAGE_DONE_SHARE, stageProgress } from "../curriculum/stages/index.ts";
import { bankScriptsFor, scriptTally } from "../curriculum/stageScripts.ts";
import { framesFor } from "../curriculum/frames.ts";
import type { Stage } from "../curriculum/stages/types.ts";
import type { Ledger, LedgerState, LedgerTab, OutputPlace } from "../learner/ledger.ts";
import { ledgerKey } from "../learner/ledger.ts";
import { segmentWords } from "../wordSegments.ts";
import { grammarNodeId, type FixCard, type PhrasePlace } from "./notebook.ts";

export const PART_IDS = ["vocab", "grammar", "expression", "pronunciation"] as const;
export type PartId = (typeof PART_IDS)[number];

/** 단계 n까지 쌓을 낱말 수(누적). */
export const VOCAB_TARGETS = [30, 80, 150, 250, 400] as const;
/** 단계 n까지 맞게 다시 말한 줄 수(누적, growth STAGE_THRESHOLDS.pronunciation과 같은 눈금). */
export const PRON_TARGETS = [3, 10, 25, 50, 100] as const;

export type PartView = {
  id: PartId;
  /** 채운 양(½ 단위까지). 화면은 반올림해 보인다. */
  done: number;
  total: number;
  /** false = 아직 재료 없음(발음만) — 다음 단계 조건에서 빠진다. */
  measured: boolean;
};

export type StageParts = {
  order: number;
  parts: PartView[];
  /** 잰 갈래가 모두 70% 이상. */
  ready: boolean;
  /** 다음 단계까지 가장 모자란 갈래(준비됐거나 잰 게 없으면 null). */
  weakest: PartId | null;
  /** 그 단계 핵심 표현과 지금 상태(표현 갈래를 열면 보이는 목록). */
  expressions: { text: string; state: LedgerState | null }[];
  /** 그 단계 대본(curriculum/stageScripts.ts): 통과한 수·전체·통과한 id. 대본이 있는 언어에서 앱이 scripts=1로 물을 때만. */
  scripts?: { done: number; total: number; passed: string[] };
};

export function shareOf(part: PartView): number {
  return part.total ? Math.min(1, part.done / part.total) : 0;
}

/** 낱말로 볼 것: 두 낱말까지(띄어쓰기 없는 말은 Intl.Segmenter로 자름). */
export function isWordish(text: string, language: string): boolean {
  const words = segmentWords(text, language).filter((word) => /[\p{L}\p{N}]/u.test(word));
  return words.length > 0 && words.length <= 2;
}

const credit = (state: LedgerState) => (state === "mastered" ? 1 : state === "learned" ? 0.5 : 0);

export function vocabScore(ledger: Ledger | null, language: string): number {
  let score = 0;
  for (const item of Object.values(ledger?.items ?? {})) {
    if (item.state !== "met" && isWordish(item.text, language)) score += credit(item.state);
  }
  return score;
}

/** 낱말 목록(최근 것부터) — 어휘 갈래를 열면 보인다. */
export function vocabWords(ledger: Ledger | null, language: string, limit = 40): { text: string; state: LedgerState }[] {
  return Object.values(ledger?.items ?? {})
    .filter((item) => item.state !== "met" && isWordish(item.text, language))
    .sort((a, b) => (b.masteredAt ?? b.helpAt ?? 0) - (a.masteredAt ?? a.helpAt ?? 0))
    .slice(0, limit)
    .map((item) => ({ text: item.text, state: item.state }));
}

export function stageParts(input: {
  stage: Stage;
  language: string;
  ledger: Ledger | null;
  /** 노트에 칸을 정한 표현(열쇠 = 장부 열쇠). */
  phrases: Record<string, PhrasePlace>;
  /** 영어: 숙지한 구문 id. */
  constructionsMastered?: ReadonlySet<string>;
  /** 다시 말해 모든 낱말이 맞은 수 / 해 본 수(growth). */
  pronunciation: { points: number; tries: number };
  /** 미리 잰 낱말 점수(단계마다 다시 세지 않게). */
  vocab?: number;
  /** 갈래마다 최근 2주에 튜터가 짚은 수(recentMistakes). */
  mistakes?: Partial<Record<PartId, number>>;
}): StageParts {
  const { stage, ledger } = input;
  const index = Math.max(0, Math.min(stage.order, VOCAB_TARGETS.length) - 1);

  const vocabTotal = VOCAB_TARGETS[index]!;
  const vocab: PartView = { id: "vocab", done: Math.min(vocabTotal, input.vocab ?? vocabScore(ledger, input.language)), total: vocabTotal, measured: true };

  // 문법 칸마다 든 습득한 표현(배움·숙지)의 수.
  const inNode = new Map<string, number>();
  for (const [key, place] of Object.entries(input.phrases)) {
    const state = ledger?.items[key]?.state;
    if (!state || state === "met") continue;
    for (const node of nodesOf(place)) inNode.set(node, (inNode.get(node) ?? 0) + 1);
  }
  let grammarDone = 0;
  for (const grammar of stage.grammar) {
    if (grammar.constructionId && input.constructionsMastered?.has(grammar.constructionId)) {
      grammarDone += 1;
      continue;
    }
    const filled = inNode.get(grammarNodeId(stage.order, grammar)) ?? 0;
    grammarDone += filled >= 2 ? 1 : filled === 1 ? 0.5 : 0;
  }
  const grammar: PartView = { id: "grammar", done: grammarDone, total: stage.grammar.length, measured: stage.grammar.length > 0 };

  const progress = ledger ? stageProgress(stage, ledger) : { total: stage.expressions.length, mastered: 0, learned: 0 };
  const expression: PartView = { id: "expression", done: progress.mastered + progress.learned / 2, total: progress.total, measured: progress.total > 0 };

  const pronTotal = PRON_TARGETS[index]!;
  const pronunciation: PartView = {
    id: "pronunciation",
    done: Math.min(pronTotal, input.pronunciation.points),
    total: pronTotal,
    measured: input.pronunciation.tries > 0,
  };

  const parts = [vocab, grammar, expression, pronunciation];
  const measured = parts.filter((part) => part.measured);
  const ready = measured.length > 0 && measured.every((part) => shareOf(part) >= STAGE_DONE_SHARE);
  const below = measured.filter((part) => shareOf(part) < STAGE_DONE_SHARE);
  const focus = below
    .filter((part) => (input.mistakes?.[part.id] ?? 0) >= MISTAKE_FOCUS)
    .sort((a, b) => (input.mistakes?.[b.id] ?? 0) - (input.mistakes?.[a.id] ?? 0) || shareOf(a) - shareOf(b))[0];
  const weakest = ready ? null : (focus?.id ?? measured.slice().sort((a, b) => shareOf(a) - shareOf(b))[0]?.id ?? null);

  const items = Object.values(ledger?.items ?? {});
  const expressions = stage.expressions.map((text) => {
    const key = ledgerKey(text);
    const direct = ledger?.items[key];
    const states = direct ? [direct.state] : items.filter((item) => key && ledgerKey(item.text).includes(key)).map((item) => item.state);
    const state: LedgerState | null = states.includes("mastered") ? "mastered" : states.includes("learned") ? "learned" : states.includes("met") ? "met" : null;
    return { text, state };
  });

  return { order: stage.order, parts, ready, weakest, expressions };
}

/**
 * 다음 단계 = 네 갈래 70% + 그 단계 대본을 모두 통과(2026-10-27 사용자 "네 갈래 70% + 대본").
 * 대본이 없는 언어·단계는 예전 조건 그대로. 옛 앱(대본 화면 없음)은 이걸 거치지 않는다(/api/notebook scripts=1일 때만).
 */
export function withScripts(rows: StageParts[], language: string, passed: ReadonlySet<string>, skipped: ReadonlySet<string> = new Set()): StageParts[] {
  return rows.map((row) => {
    const tally = scriptTally(language, row.order, passed);
    // 시험으로 걸러진(이미 아는) 상황 대본도 다음 단계 조건에서는 한 것으로(curriculum/known.ts) — 목록(passed)은 실제 통과만.
    if (skipped.size) tally.done = scriptTally(language, row.order, new Set([...passed, ...skipped])).done;
    if (!tally.total) return row;
    // 틀 바꿔 말하기(curriculum/frames.ts)의 통과도 같은 목록에 — 다음 단계 조건(done/total)에는 넣지 않는다.
    const frames = framesFor(language, row.order).filter((frame) => passed.has(frame.id)).map((frame) => frame.id);
    // 대본 은행 장면(2026-10-30)도 통과 목록에만 — 오늘 할 것이 다음 장면을 고르게, 조건에는 안 셈.
    const bank = bankScriptsFor(language, row.order).filter((script) => passed.has(script.id)).map((script) => script.id);
    const scripts = { ...tally, passed: [...tally.passed, ...frames, ...bank] };
    return { ...row, scripts, ready: row.ready && scripts.done >= scripts.total };
  });
}

/** 표현이 채우는 칸: 주 칸 + 함께 걸친 문법 칸. */
function nodesOf(place: PhrasePlace): string[] {
  return [...(place.node ? [place.node] : []), ...(place.also ?? []).filter((id) => id !== place.node)];
}

/** "다음 단계까지"를 짚임 쪽으로 돌리는 최근 짚임 수. */
export const MISTAKE_FOCUS = 3;
const MISTAKE_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;

/** 태그가 없는 옛 카드는 칸으로 갈래를 짐작한다(문법 칸 → 문법, 관용·말투·뉘앙스 → 표현, 낱말·철자 → 어휘, 글자·소리 → 발음). */
export function partsOfCard(card: Pick<FixCard, "parts" | "node">): PartId[] {
  if (card.parts?.length) return card.parts;
  const node = card.node ?? "";
  if (/^g\d-/.test(node)) return ["grammar"];
  if (node.startsWith("i-") || node === "d-register" || node === "d-nuance") return ["expression"];
  if (node === "d-word" || node === "d-spelling") return ["vocab"];
  // 글자·소리 칸은 화면에서 발음 갈래 아래에 있다(NotebookSection PART_NODES).
  if (node.startsWith("s-")) return ["pronunciation"];
  return [];
}

/** 갈래마다 최근 2주의 진짜 실수 수(노트 카드 + 오늘의 학습 후보, 같은 줄은 한 번). 오타·뜻 짐작·궁금한 장면은 빼고. */
export function recentMistakes(cards: FixCard[], now: number): Record<PartId, number> {
  const out: Record<PartId, number> = { vocab: 0, grammar: 0, expression: 0, pronunciation: 0 };
  const seen = new Set<string>();
  for (const card of cards) {
    if ((card.kind ?? "mistake") !== "mistake" || now - card.at > MISTAKE_WINDOW_MS) continue;
    const key = `${card.wrong}\u0000${card.right}`;
    if (seen.has(key)) continue;
    seen.add(key);
    for (const part of partsOfCard(card)) out[part] += 1;
  }
  return out;
}

export const HISTORY_DAYS = 14;

/**
 * 갈래마다 최근 14일 하루하루 늘어난 양(그래프 보기, 2026-10-25). 오래된 날 → 오늘.
 * - 어휘·표현: 낱말·그 단계 핵심 표현이 배움이 된 날(첫 사용) ½, 숙지가 된 날 ½.
 * - 문법: 그 단계 문법 칸에 표현이 들어온 날 ½.
 * - 발음: growth의 날마다 점수(맞게 다시 말한 줄).
 * `dayOf`는 사용자 시간대의 YYYY-MM-DD(billing/plans localDay).
 */
export function partHistory(input: {
  stage: Stage;
  language: string;
  ledger: Ledger | null;
  phrases: Record<string, PhrasePlace>;
  pronunciationDays: Record<string, number>;
  now: number;
  dayOf: (at: number) => string;
}): Record<PartId, number[]> {
  const days = Array.from({ length: HISTORY_DAYS }, (_, i) => input.dayOf(input.now - (HISTORY_DAYS - 1 - i) * 24 * 60 * 60 * 1000));
  const index = new Map(days.map((day, i) => [day, i]));
  const out: Record<PartId, number[]> = { vocab: days.map(() => 0), grammar: days.map(() => 0), expression: days.map(() => 0), pronunciation: days.map(() => 0) };
  const bump = (part: PartId, at: number | undefined, amount: number) => {
    if (!at) return;
    const i = index.get(input.dayOf(at));
    if (i !== undefined) out[part][i]! += amount;
  };
  const stageKeys = new Set(input.stage.expressions.map((text) => ledgerKey(text)).filter(Boolean));
  for (const [key, item] of Object.entries(input.ledger?.items ?? {})) {
    if (item.state === "met") continue;
    const part: PartId | null = stageKeys.has(key) ? "expression" : isWordish(item.text, input.language) ? "vocab" : null;
    if (!part) continue;
    bump(part, item.outputs[0]?.at ?? item.firstMet?.at, 0.5);
    if (item.state === "mastered") bump(part, item.masteredAt, 0.5);
  }
  const grammarNodes = new Set(input.stage.grammar.map((g) => grammarNodeId(input.stage.order, g)));
  for (const [key, place] of Object.entries(input.phrases)) {
    if (!nodesOf(place).some((node) => grammarNodes.has(node))) continue;
    const state = input.ledger?.items[key]?.state;
    if (!state || state === "met") continue;
    bump("grammar", place.at, 0.5);
  }
  days.forEach((day, i) => {
    out.pronunciation[i] = input.pronunciationDays[day] ?? 0;
  });
  return out;
}

/** 갈래 기록 한 줄(망·그래프를 누르면 보이는 "무엇을 공부했나", 2026-10-29 사용자 "누르면 뭘 공부했는지 구체적으로"). */
export type PartLogItem = {
  at: number;
  /** 배움(처음 써 봄) · 숙지(혼자 씀) · 고침(튜터가 고친 내 줄). */
  kind: "learned" | "mastered" | "fixed";
  /** 학습 언어 — 낱말·표현, 고침이면 내가 쓴 줄. */
  text: string;
  /** 고침: 고친 줄. */
  right?: string;
  /** 어디서: 채팅·통화·대본(mission)·복습·영상 등. */
  where?: OutputPlace | LedgerTab | FixCard["where"];
  /** 문법: 그 단계 문법 칸 id(앱이 칸 이름으로). */
  node?: string;
};

export const PART_LOG_MAX = 60;
/** Logbank 한 줄: 낱낱 + 갈래·단계(2026-10-31, 모든 단계 최근 14일). */
export type LogItem = PartLogItem & { part: PartId; stage: number };
export const LOG_MAX = 200;

/**
 * 지금 단계 네 갈래의 최근 기록(partHistory와 같은 셈의 낱낱 + 튜터가 고친 줄), 새것부터, 갈래마다 60개까지.
 * 그래프 막대(하루)를 누르면 그날 것만, 망 꼭짓점을 누르면 그 갈래 전부. 발음은 줄이 남지 않아(growth는 날마다 숫자) 고침만.
 */
export function partLog(input: {
  stage: Stage;
  language: string;
  ledger: Ledger | null;
  phrases: Record<string, PhrasePlace>;
  cards: readonly FixCard[];
  now: number;
  days?: number;
}): Record<PartId, PartLogItem[]> {
  const since = input.now - (input.days ?? HISTORY_DAYS) * 24 * 60 * 60 * 1000;
  const out: Record<PartId, PartLogItem[]> = { vocab: [], grammar: [], expression: [], pronunciation: [] };
  const push = (part: PartId, item: PartLogItem) => {
    if (item.at >= since && item.at <= input.now + 60_000) out[part].push(item);
  };
  const stageKeys = new Set(input.stage.expressions.map((text) => ledgerKey(text)).filter(Boolean));
  const grammarNodes = new Set(input.stage.grammar.map((g) => grammarNodeId(input.stage.order, g)));
  for (const [key, item] of Object.entries(input.ledger?.items ?? {})) {
    if (item.state === "met") continue;
    const learnedAt = item.outputs[0]?.at ?? item.firstMet?.at;
    const where = item.outputs[0]?.where ?? item.firstMet?.tab;
    const part: PartId | null = stageKeys.has(key) ? "expression" : isWordish(item.text, input.language) ? "vocab" : null;
    if (part) {
      if (learnedAt) push(part, { at: learnedAt, kind: "learned", text: item.text, where });
      if (item.state === "mastered" && item.masteredAt) push(part, { at: item.masteredAt, kind: "mastered", text: item.text, where: item.outputs.at(-1)?.where });
    }
    const place = input.phrases[key];
    const node = place ? nodesOf(place).find((one) => grammarNodes.has(one)) : undefined;
    if (node && place) push("grammar", { at: place.at, kind: item.state === "mastered" ? "mastered" : "learned", text: item.text, where, node });
  }
  const seen = new Set<string>();
  for (const card of input.cards) {
    if ((card.kind ?? "mistake") !== "mistake") continue;
    const key = `${card.wrong}\u0000${card.right}`;
    if (seen.has(key)) continue;
    seen.add(key);
    for (const part of partsOfCard(card)) {
      const node = part === "grammar" ? [card.node, ...(card.also ?? [])].find((one) => one && grammarNodes.has(one)) ?? card.node ?? undefined : undefined;
      push(part, { at: card.at, kind: "fixed", text: card.wrong, right: card.right, where: card.where, ...(node ? { node } : {}) });
    }
  }
  for (const part of PART_IDS) out[part] = out[part].sort((a, b) => b.at - a.at).slice(0, PART_LOG_MAX);
  return out;
}
