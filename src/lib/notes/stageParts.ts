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
 * 순수.
 */
import { STAGE_DONE_SHARE, stageProgress } from "../curriculum/stages/index.ts";
import type { Stage } from "../curriculum/stages/types.ts";
import type { Ledger, LedgerState } from "../learner/ledger.ts";
import { ledgerKey } from "../learner/ledger.ts";
import { segmentWords } from "../wordSegments.ts";
import { grammarNodeId, type PhrasePlace } from "./notebook.ts";

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
}): StageParts {
  const { stage, ledger } = input;
  const index = Math.max(0, Math.min(stage.order, VOCAB_TARGETS.length) - 1);

  const vocabTotal = VOCAB_TARGETS[index]!;
  const vocab: PartView = { id: "vocab", done: Math.min(vocabTotal, input.vocab ?? vocabScore(ledger, input.language)), total: vocabTotal, measured: true };

  // 문법 칸마다 든 습득한 표현(배움·숙지)의 수.
  const inNode = new Map<string, number>();
  for (const [key, place] of Object.entries(input.phrases)) {
    const state = ledger?.items[key]?.state;
    if (!place.node || !state || state === "met") continue;
    inNode.set(place.node, (inNode.get(place.node) ?? 0) + 1);
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
  const weakest = ready ? null : (measured.slice().sort((a, b) => shareOf(a) - shareOf(b))[0]?.id ?? null);

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
