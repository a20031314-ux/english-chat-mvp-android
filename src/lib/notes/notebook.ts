/**
 * 노트의 뼈대와 "짚은 장면" 카드(사용자 결정 2026-10-23, hub/drafts/notebook-2026-10-23.md).
 *
 * 뼈대는 학습 언어마다 손으로 써 둔 고정 자료에서 나온다 — 모델이 만들지 않는다.
 * - 글자·소리: 글자 기초 묶음(curriculum/scripts)
 * - 문법: 단계 범위의 문법(curriculum/stages) — 지금 단계까지(앞 단계는 "이전 부분")
 * - 어휘·표현: 예전 노트 목차(notes/outline.ts, 장 8 × 주제 3) — 화면이 따로 그린다
 * - 내가 만든 칸: 사용자가 더한 칸
 *
 * 카드는 튜터가 짚은 한 줄: 내가 쓴 줄(틀린 것) → 고친 줄 + 한 줄 설명, 어디서·언제.
 * 어느 칸에 넣을지는 모델이 고르고(server/notebookStore.ts), 사용자가 옮긴 카드는 다시 옮기지 않는다.
 * 학습자 문장이 들어가는 유일한 저장소라 계정을 지우면 함께 지운다(STATE "노트 문장 저장").
 *
 * 순수.
 */

import { ladderFor } from "../curriculum/stages/index.ts";
import type { StageText } from "../curriculum/stages/types.ts";
import { scriptFor } from "../curriculum/scripts/index.ts";

export type NotebookChapter = "script" | "grammar";

export type SkeletonNode = {
  id: string;
  chapter: NotebookChapter;
  /** 문법: 단계 순서(1부터). */
  stage?: number;
  /** 같은 단계 자료 안의 자리(화면 이름을 옮긴 글에서 찾을 때). */
  index: number;
  name: StageText;
  /** 학습 언어 예문(문법) 또는 글자 몇 개(글자·소리). */
  example?: string;
  note?: StageText;
  /** 영어 구문 목록 id(있으면). */
  constructionId?: string;
};

export type FixWhere = "chat" | "call" | "dm" | "room";
export const FIX_WHERE: FixWhere[] = ["chat", "call", "dm", "room"];

export type FixCard = {
  id: string;
  /** 내가 쓴 줄(학습 언어). */
  wrong: string;
  /** 고친 줄. */
  right: string;
  /** 한 줄 설명(만든 때의 앱 언어). */
  note: string;
  /** 넣은 칸 id(뼈대·내가 만든 칸). null이면 "아직 자리 없음". */
  node: string | null;
  /** 맞는 칸이 없을 때 모델이 제안한 새 칸 이름(앱 언어). */
  suggest?: string;
  where: FixWhere;
  at: number;
  /** 사용자가 옮겼으면 true — 다시 옮기지 않는다. */
  moved?: boolean;
  memo?: string;
};

export type CustomNode = { id: string; name: string; at: number };

export type NotebookRecord = {
  v: 1;
  cards: FixCard[];
  custom: CustomNode[];
  /** 뼈대 칸 이름 바꾸기(사용자). */
  renames: Record<string, string>;
  /** 칸마다 내 메모. */
  memos: Record<string, string>;
};

export const MAX_CARDS = 400;
export const MAX_CUSTOM = 40;
export const MAX_LINE = 300;
export const MAX_NOTE = 160;
export const MAX_NAME = 40;
export const MAX_MEMO = 1000;

export function emptyNotebook(): NotebookRecord {
  return { v: 1, cards: [], custom: [], renames: {}, memos: {} };
}

const NODE_ID = /^(?:g\d-[a-z0-9-]{1,48}|s-[a-z0-9-]{1,48}|c-[a-z0-9]{4,24})$/;
const CARD_ID = /^[a-z0-9]{6,24}$/;

export function isNodeId(value: unknown): value is string {
  return typeof value === "string" && NODE_ID.test(value);
}

export function isCardId(value: unknown): value is string {
  return typeof value === "string" && CARD_ID.test(value);
}

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/, "");
}

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? Array.from(value.replace(/\s+/g, " ").trim()).slice(0, max).join("") : "";
}

/** 문법 칸 id: 단계 순서 + (영어 구문 id 또는 영어 이름). 데이터 순서가 바뀌어도 같은 칸이다. */
export function grammarNodeId(stage: number, grammar: { name: StageText; constructionId?: string }): string {
  return `g${stage}-${slug(grammar.constructionId || grammar.name.en) || "x"}`;
}

/**
 * 지금 단계까지의 뼈대. 단계 범위가 없는 언어면 문법이 비고, 글자 기초가 없는 언어면 글자·소리가 빈다.
 * 같은 id가 두 번 나오면(같은 문법이 두 단계에) 뒤의 것을 버린다.
 */
export function skeletonFor(language: string, currentStage: number): SkeletonNode[] {
  const nodes: SkeletonNode[] = [];
  const seen = new Set<string>();
  const course = scriptFor(language);
  course?.groups.forEach((group, index) => {
    const id = `s-${slug(group.id)}`;
    if (seen.has(id)) return;
    seen.add(id);
    nodes.push({
      id,
      chapter: "script",
      index,
      name: group.title,
      example: group.items.slice(0, 6).map((item) => item.char).join(" "),
      ...(group.note ? { note: group.note } : {}),
    });
  });
  const ladder = ladderFor(language);
  const upTo = Math.max(1, Math.min(currentStage, ladder?.stages.length ?? 1));
  for (const stage of ladder?.stages ?? []) {
    if (stage.order > upTo) continue;
    stage.grammar.forEach((grammar, index) => {
      const id = grammarNodeId(stage.order, grammar);
      if (seen.has(id)) return;
      seen.add(id);
      nodes.push({
        id,
        chapter: "grammar",
        stage: stage.order,
        index,
        name: grammar.name,
        example: grammar.example,
        ...(grammar.constructionId ? { constructionId: grammar.constructionId } : {}),
      });
    });
  }
  return nodes;
}

/** 모델에게 줄 칸 목록(영어 이름·예문, 내가 만든 칸은 그 이름 그대로). */
export function placeOptions(skeleton: SkeletonNode[], custom: CustomNode[]): string {
  return [
    ...skeleton.map((node) =>
      `${node.id} — ${node.chapter === "script" ? "letters/sounds" : "grammar"}: ${node.name.en}${node.example ? ` (e.g. ${node.example})` : ""}`,
    ),
    ...custom.map((node) => `${node.id} — the learner's own section: ${node.name}`),
  ].join("\n");
}

export function placePrompt(input: { target: string; uiName: string; options: string }): string {
  return `A learner of ${input.target} wrote a line and a tutor corrected it. File the correction into the learner's notebook.

Sections (id — what it is):
${input.options}

- "node": the one section a learner would open to study this mistake — the grammar point or letters/sounds it is about. A mistake that is only a wrong word choice or a phrase goes to the closest grammar point it touches; if none fits at all, use "none".
- "suggest": only when "node" is "none" — a short section name in ${input.uiName}, two to four words, naming the general point (never the learner's words).
- "note": one short line in ${input.uiName} saying what was wrong and what the right form is, under 80 characters. Plain, no greeting, no praise. Words of ${input.target} may appear in quotes.
- Never repeat or translate the learner's whole line.

Return only json: {"node":"<id or none>","suggest":"...","note":"..."}`;
}

export function placeMessage(wrong: string, right: string, explanation: string): string {
  return JSON.stringify({ learner: wrong, corrected: right, ...(explanation ? { tutorNote: explanation.slice(0, 300) } : {}) });
}

export type Placement = { node: string | null; suggest?: string; note: string };

/** 모델 답 읽기. 모르는 칸은 null, 설명이 없으면 튜터 설명(있으면)으로. */
export function readPlacement(raw: string, known: ReadonlySet<string>, fallbackNote: string): Placement {
  let data: Record<string, unknown> = {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") data = parsed as Record<string, unknown>;
  } catch {
    data = {};
  }
  const node = typeof data.node === "string" && known.has(data.node) ? data.node : null;
  const suggest = node ? "" : clean(data.suggest, MAX_NAME);
  const note = clean(data.note, MAX_NOTE) || clean(fallbackNote, MAX_NOTE);
  return { node, ...(suggest ? { suggest } : {}), note };
}

function same(a: string, b: string): boolean {
  const bare = (s: string) => s.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{M}\p{N}]/gu, "");
  return bare(a) === bare(b);
}

/** 고친 데가 실제로 있는 줄인지(문장부호·대소문자만 다르면 아님). */
export function isRealFix(wrong: string, right: string): boolean {
  const w = clean(wrong, MAX_LINE);
  const r = clean(right, MAX_LINE);
  return Boolean(w && r) && !same(w, r);
}

export function parseNotebook(raw: unknown): NotebookRecord {
  const row = (raw ?? {}) as Partial<NotebookRecord>;
  if (row.v !== 1) return emptyNotebook();
  return {
    v: 1,
    cards: Array.isArray(row.cards) ? row.cards.filter((card) => card && isCardId(card.id)) : [],
    custom: Array.isArray(row.custom) ? row.custom.filter((node) => node && isNodeId(node.id)) : [],
    renames: row.renames && typeof row.renames === "object" ? row.renames : {},
    memos: row.memos && typeof row.memos === "object" ? row.memos : {},
  };
}

/** 새 카드. 같은 칸에 같은 틀림→고침이 이미 있으면 시각만 새로(같은 실수를 또 한 것). 오래된 것부터 넘친다. */
export function addCard(record: NotebookRecord, card: FixCard): NotebookRecord {
  const wrong = clean(card.wrong, MAX_LINE);
  const right = clean(card.right, MAX_LINE);
  if (!isRealFix(wrong, right) || !isCardId(card.id)) return record;
  const twin = record.cards.find((c) => same(c.wrong, wrong) && same(c.right, right));
  if (twin) {
    return { ...record, cards: record.cards.map((c) => (c === twin ? { ...c, at: card.at } : c)) };
  }
  const next: FixCard = {
    id: card.id,
    wrong,
    right,
    note: clean(card.note, MAX_NOTE),
    node: card.node && isNodeId(card.node) ? card.node : null,
    ...(card.suggest ? { suggest: clean(card.suggest, MAX_NAME) } : {}),
    where: FIX_WHERE.includes(card.where) ? card.where : "chat",
    at: card.at,
  };
  const cards = [...record.cards, next].sort((a, b) => b.at - a.at).slice(0, MAX_CARDS);
  return { ...record, cards };
}

export type NotebookEdit =
  | { op: "move"; card: string; node: string | null }
  | { op: "memoCard"; card: string; memo: string }
  | { op: "deleteCard"; card: string }
  | { op: "addNode"; id: string; name: string }
  | { op: "renameNode"; node: string; name: string }
  | { op: "deleteNode"; node: string }
  | { op: "memoNode"; node: string; memo: string }
  | { op: "acceptSuggest"; card: string; id: string };

/** 앱이 보낸 편집을 모양만 보고 받는다. 모르는 것은 null. */
export function parseEdit(value: unknown): NotebookEdit | null {
  const row = (value ?? {}) as Record<string, unknown>;
  switch (row.op) {
    case "move":
      return isCardId(row.card) && (row.node === null || isNodeId(row.node)) ? { op: "move", card: row.card, node: row.node as string | null } : null;
    case "memoCard":
      return isCardId(row.card) && typeof row.memo === "string" ? { op: "memoCard", card: row.card, memo: row.memo } : null;
    case "deleteCard":
      return isCardId(row.card) ? { op: "deleteCard", card: row.card } : null;
    case "addNode":
      return isNodeId(row.id) && String(row.id).startsWith("c-") && clean(row.name, MAX_NAME) ? { op: "addNode", id: row.id, name: clean(row.name, MAX_NAME) } : null;
    case "renameNode":
      return isNodeId(row.node) && typeof row.name === "string" ? { op: "renameNode", node: row.node, name: row.name } : null;
    case "deleteNode":
      return isNodeId(row.node) && String(row.node).startsWith("c-") ? { op: "deleteNode", node: row.node } : null;
    case "memoNode":
      return isNodeId(row.node) && typeof row.memo === "string" ? { op: "memoNode", node: row.node, memo: row.memo } : null;
    case "acceptSuggest":
      return isCardId(row.card) && isNodeId(row.id) && String(row.id).startsWith("c-") ? { op: "acceptSuggest", card: row.card, id: row.id } : null;
    default:
      return null;
  }
}

/** 편집 하나. 받을 수 없으면 그대로 돌려준다. */
export function applyEdit(record: NotebookRecord, edit: NotebookEdit, now = Date.now()): NotebookRecord {
  const cardAt = (id: string) => record.cards.find((card) => card.id === id);
  const customIds = new Set(record.custom.map((node) => node.id));
  switch (edit.op) {
    case "move": {
      if (!cardAt(edit.card)) return record;
      return {
        ...record,
        cards: record.cards.map((card) => {
          if (card.id !== edit.card) return card;
          const { suggest: _drop, ...rest } = card;
          void _drop;
          return { ...rest, node: edit.node, moved: true };
        }),
      };
    }
    case "memoCard": {
      const memo = clean(edit.memo, MAX_MEMO);
      return {
        ...record,
        cards: record.cards.map((card) => {
          if (card.id !== edit.card) return card;
          const { memo: _old, ...rest } = card;
          void _old;
          return memo ? { ...rest, memo } : rest;
        }),
      };
    }
    case "deleteCard":
      return { ...record, cards: record.cards.filter((card) => card.id !== edit.card) };
    case "addNode":
      if (customIds.has(edit.id) || record.custom.length >= MAX_CUSTOM) return record;
      return { ...record, custom: [...record.custom, { id: edit.id, name: edit.name, at: now }] };
    case "renameNode": {
      const name = clean(edit.name, MAX_NAME);
      if (customIds.has(edit.node)) {
        if (!name) return record;
        return { ...record, custom: record.custom.map((node) => (node.id === edit.node ? { ...node, name } : node)) };
      }
      const renames = { ...record.renames };
      if (name) renames[edit.node] = name;
      else delete renames[edit.node];
      return { ...record, renames };
    }
    case "deleteNode": {
      if (!customIds.has(edit.node)) return record;
      const memos = { ...record.memos };
      delete memos[edit.node];
      return {
        ...record,
        custom: record.custom.filter((node) => node.id !== edit.node),
        cards: record.cards.map((card) => (card.node === edit.node ? { ...card, node: null } : card)),
        memos,
      };
    }
    case "memoNode": {
      const memo = clean(edit.memo, MAX_MEMO);
      const memos = { ...record.memos };
      if (memo) memos[edit.node] = memo;
      else delete memos[edit.node];
      return { ...record, memos };
    }
    case "acceptSuggest": {
      const card = cardAt(edit.card);
      if (!card?.suggest) return record;
      const added = customIds.has(edit.id) ? record : applyEdit(record, { op: "addNode", id: edit.id, name: card.suggest }, now);
      if (added === record && !customIds.has(edit.id)) return record;
      return applyEdit(added, { op: "move", card: edit.card, node: edit.id }, now);
    }
  }
}

/** 칸마다 카드 수(화면의 숫자 — 많은 칸이 "여기에 집중"). */
export function cardCounts(record: NotebookRecord): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const card of record.cards) {
    const key = card.node ?? "";
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

/** 지금 단계: 지도의 단계 id(`ja-3`)에서, 없으면 1. */
export function stageOrderOf(stageId: string | null | undefined): number {
  const match = typeof stageId === "string" ? /^[a-z]{2}-(\d)$/.exec(stageId) : null;
  return match ? Number(match[1]) : 1;
}
