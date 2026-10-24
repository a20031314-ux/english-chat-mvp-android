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
 * 짚인 줄은 바로 카드가 되지 않고 "오늘의 학습" 후보(`pending`)로 쌓인다 — 사용자가 고른 것만 노트에 들어가고(화면 함께 고르기),
 * 안 고른 후보는 7일 뒤 사라진다(2026-10-24 사용자 결정). 진짜 실수·또 틀린 것은 미리 골라 둔다(`defaultPicked`).
 * 학습자 문장이 들어가는 유일한 저장소라 계정을 지우면 함께 지운다(STATE "노트 문장 저장").
 *
 * 순수.
 */

import { ladderFor } from "../curriculum/stages/index.ts";
import type { StageText } from "../curriculum/stages/types.ts";
import { scriptFor } from "../curriculum/scripts/index.ts";

export type NotebookChapter = "script" | "grammar" | "idiom" | "detail";

/**
 * 모든 학습 언어에 같은 고정 칸(2026-10-24 사용자 "습득한 표현은 웬만하면 틀 안에"):
 * 관용 표현 셋(관용구·자주 붙는 말·정해진 말)과 세부 넷(단어 고르기·말투·철자·뉘앙스).
 * 화면 이름은 앱 문구(copy.ts notebookNode*), 여기 이름은 모델에게 주는 설명과 영어·한국어 기본.
 */
export const FIXED_NODES: { id: string; chapter: "idiom" | "detail"; name: StageText; hint: string }[] = [
  { id: "i-idiom", chapter: "idiom", name: { en: "Idioms and sayings", ko: "관용구" }, hint: "idioms, sayings, figurative expressions whose meaning is not the sum of the words" },
  { id: "i-together", chapter: "idiom", name: { en: "Words that go together", ko: "자주 붙는 말" }, hint: "collocations, phrasal verbs, fixed word pairs (make a decision, look forward to)" },
  { id: "i-set", chapter: "idiom", name: { en: "Set phrases", ko: "정해진 말" }, hint: "greetings, thanks, apologies, reactions, fillers said as a whole" },
  { id: "d-word", chapter: "detail", name: { en: "Choosing the right word", ko: "단어 고르기" }, hint: "picking between similar words, false friends, the word that fits" },
  { id: "d-register", chapter: "detail", name: { en: "Register and politeness", ko: "말투·높임" }, hint: "polite or casual forms, honorifics, formal vs spoken" },
  { id: "d-spelling", chapter: "detail", name: { en: "Spelling and writing", ko: "철자·표기" }, hint: "spelling, accents, characters, punctuation, spacing" },
  { id: "d-nuance", chapter: "detail", name: { en: "Nuance", ko: "뉘앙스" }, hint: "shades of meaning, tone, what sounds natural vs odd" },
];

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
  /** 지금 단계보다 뒤의 문법 — 카드가 들어온 칸만 화면에 보인다(틀린 것이 다음 단계 문법일 때). */
  ahead?: boolean;
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
  /** 어떤 짚임인지: 진짜 실수 / 오타·철자 / 통화의 "이렇게 말하려던 거죠?"(뜻 짐작). 없으면 실수로 본다. */
  kind?: FixKind;
  /** 같은 칸에 2주 안에 짚인 게 또 있음(후보를 만들 때 정함). */
  again?: boolean;
  /** 후보가 생긴 날(사용자 시간대, YYYY-MM-DD). */
  day?: string;
  /** 노트에 넣을 때 붙인 화면의 id(그림은 따로 저장 — server/notebookStore.ts `shotKey`). */
  shotId?: string;
};

export type FixKind = "mistake" | "typo" | "meant";
export const FIX_KINDS: FixKind[] = ["mistake", "typo", "meant"];

export type CustomNode = { id: string; name: string; at: number };

export type NotebookRecord = {
  v: 1;
  cards: FixCard[];
  custom: CustomNode[];
  /** 뼈대 칸 이름 바꾸기(사용자). */
  renames: Record<string, string>;
  /** 칸마다 내 메모. */
  memos: Record<string, string>;
  /** 오늘의 학습 후보(아직 노트에 안 넣은 짚임). 7일이 지나면 빠진다. */
  pending: FixCard[];
  /**
   * 습득한 표현(장부에서 배움·숙지)을 넣은 칸 — 열쇠는 장부 열쇠(learner/ledger.ts ledgerKey).
   * node null = 틀이 아니라 노트의 어휘·표현으로(그냥 낱말). 사용자가 옮겼으면 moved(다시 고르지 않음).
   */
  phrases: Record<string, PhrasePlace>;
};

export type PhrasePlace = { node: string | null; at: number; moved?: boolean };
export const MAX_PHRASES = 800;
/** 한 번에 칸을 고르는 표현 수. */
export const PHRASES_PER_CALL = 30;

export const MAX_CARDS = 400;
export const MAX_CUSTOM = 40;
export const MAX_LINE = 300;
export const MAX_NOTE = 160;
export const MAX_NAME = 40;
export const MAX_MEMO = 1000;
export const MAX_PENDING = 200;
export const PENDING_KEEP_MS = 7 * 24 * 60 * 60 * 1000;
export const AGAIN_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;

export function emptyNotebook(): NotebookRecord {
  return { v: 1, cards: [], custom: [], renames: {}, memos: {}, pending: [], phrases: {} };
}

const NODE_ID = /^(?:g\d-[a-z0-9-]{1,48}|s-[a-z0-9-]{1,48}|c-[a-z0-9]{4,24}|[id]-[a-z]{2,16})$/;
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
 * `withAhead`면 뒤 단계 문법도 `ahead`로 붙인다 — 칸 고르기 후보로(과거형을 틀린 1단계 학습자의 카드가 현재형 칸에 가지 않게).
 */
export function skeletonFor(language: string, currentStage: number, withAhead = false): SkeletonNode[] {
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
    if (stage.order > upTo && !withAhead) continue;
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
        ...(stage.order > upTo ? { ahead: true } : {}),
      });
    });
  }
  FIXED_NODES.forEach((node, index) => nodes.push({ id: node.id, chapter: node.chapter, index, name: node.name }));
  return nodes;
}

/** 모델에게 줄 칸 목록(영어 이름·예문, 내가 만든 칸은 그 이름 그대로). */
export function placeOptions(skeleton: SkeletonNode[], custom: CustomNode[]): string {
  return [
    ...skeleton.map((node) =>
      node.chapter === "idiom" || node.chapter === "detail"
        ? `${node.id} — ${node.chapter === "idiom" ? "expressions" : "detail"}: ${node.name.en} (${FIXED_NODES.find((fixed) => fixed.id === node.id)?.hint ?? ""})`
        : `${node.id} — ${node.chapter === "script" ? "letters/sounds" : node.ahead ? "grammar (later)" : "grammar"}: ${node.name.en}${node.example ? ` (e.g. ${node.example})` : ""}`,
    ),
    ...custom.map((node) => `${node.id} — the learner's own section: ${node.name}`),
  ].join("\n");
}

export function placePrompt(input: { target: string; uiName: string; options: string }): string {
  return `A learner of ${input.target} wrote a line and a tutor corrected it. File the correction into the learner's notebook.

Sections (id — what it is):
${input.options}

- "node": the one section a learner would open to study this mistake — the grammar point or letters/sounds it is about. Prefer the section that names exactly that point, even one marked "(later)"; never put it under a different point just because it is earlier. A mistake about word choice, politeness, spelling or nuance goes to the matching detail section; one about an idiom or a word pairing to the matching expressions section; if none fits, use "none".
- "suggest": only when "node" is "none" — a short section name in ${input.uiName}, two to four words, naming the general point (never the learner's words).
- "note": one short line in ${input.uiName} saying what was wrong and what the right form is, under 80 characters. Plain, no greeting, no praise. Words of ${input.target} may appear in quotes.
- "kind": "typo" when the only change is a slip of spelling or typing (a missing or swapped letter, a wrong accent mark, a misspelled word) that the learner clearly knows; otherwise "mistake" (grammar, word choice, word order, a missing word, a wrong form).
- Never repeat or translate the learner's whole line.

Return only json: {"node":"<id or none>","suggest":"...","note":"...","kind":"mistake or typo"}`;
}

export function placeMessage(wrong: string, right: string, explanation: string): string {
  return JSON.stringify({ learner: wrong, corrected: right, ...(explanation ? { tutorNote: explanation.slice(0, 300) } : {}) });
}

export type Placement = { node: string | null; suggest?: string; note: string; kind?: FixKind };

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
  const kind = data.kind === "typo" ? "typo" : data.kind === "mistake" ? "mistake" : undefined;
  return { node, ...(suggest ? { suggest } : {}), note, ...(kind ? { kind } : {}) };
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
    pending: Array.isArray(row.pending) ? row.pending.filter((card) => card && isCardId(card.id)) : [],
    phrases: cleanPhrases(row.phrases),
  };
}

function cleanPhrases(value: unknown): Record<string, PhrasePlace> {
  if (!value || typeof value !== "object") return {};
  const out: Record<string, PhrasePlace> = {};
  for (const [key, place] of Object.entries(value as Record<string, PhrasePlace>)) {
    if (!isPhraseKey(key) || !place || typeof place !== "object") continue;
    out[key] = { node: place.node && isNodeId(place.node) ? place.node : null, at: Number(place.at) || 0, ...(place.moved ? { moved: true } : {}) };
  }
  return out;
}

export function isPhraseKey(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= 200 && value === value.trim();
}

/** 칸을 고른 표현을 넣는다(옮긴 것은 그대로). 넘치면 오래된 것부터. */
export function placePhrases(record: NotebookRecord, placed: Array<{ key: string; node: string | null }>, now = Date.now()): NotebookRecord {
  if (!placed.length) return record;
  const phrases = { ...record.phrases };
  for (const { key, node } of placed) {
    if (!isPhraseKey(key) || phrases[key]?.moved) continue;
    phrases[key] = { node: node && isNodeId(node) ? node : null, at: now };
  }
  const keys = Object.keys(phrases);
  if (keys.length > MAX_PHRASES) {
    for (const key of keys.sort((a, b) => phrases[a]!.at - phrases[b]!.at).slice(0, keys.length - MAX_PHRASES)) delete phrases[key];
  }
  return { ...record, phrases };
}

/** 습득한 표현의 칸 고르기(여러 개를 한 번에). */
export function phrasePrompt(input: { target: string; options: string }): string {
  return `A learner of ${input.target} has picked up the phrases below. File each into the learner's notebook so the notebook grows by level.

Sections (id — what it is):
${input.options}

For each phrase pick one:
- a grammar section when the phrase is a clear example of that grammar point — match the form the phrase actually uses (its tense, aspect, comparison, mood…), and take the exact point even when it is marked "(later)"; a past-tense phrase never goes under a present-tense point;
- "i-idiom", "i-together" or "i-set" when it is an idiom, a collocation or phrasal verb, or a set phrase said as a whole;
- a letters/sounds or detail section only when the phrase is really about that;
- a learner's own section when its name fits;
- "vocab" only for a single word or a short noun phrase with no verb (it stays in the word list). A whole sentence or question never goes to "vocab": put it under the grammar point it uses, or under "i-set" when it is said as a whole.

Return only json: {"places":[{"i":<index>,"node":"<id or vocab>"}]} with one entry per phrase.`;
}

export function phraseMessage(texts: string[]): string {
  return JSON.stringify({ phrases: texts.map((text, i) => ({ i, text })) });
}

/** 모델 답 → 표현 순서대로 칸(null = 어휘). 답이 없거나 모르는 칸이면 undefined(다음에 다시). */
export function readPhrasePlaces(raw: string, count: number, known: ReadonlySet<string>): Array<string | null | undefined> {
  const out: Array<string | null | undefined> = Array.from({ length: count }, () => undefined);
  let rows: unknown = [];
  try {
    rows = (JSON.parse(raw) as { places?: unknown })?.places ?? [];
  } catch {
    rows = [];
  }
  if (!Array.isArray(rows)) return out;
  for (const row of rows as Array<{ i?: unknown; node?: unknown }>) {
    const i = typeof row?.i === "number" ? row.i : -1;
    if (i < 0 || i >= count || !Number.isInteger(i)) continue;
    if (row.node === "vocab") out[i] = null;
    else if (typeof row.node === "string" && known.has(row.node)) out[i] = row.node;
  }
  return out;
}

/** 새 카드. 같은 칸에 같은 틀림→고침이 이미 있으면 시각만 새로(같은 실수를 또 한 것). 오래된 것부터 넘친다. */
export function addCard(record: NotebookRecord, card: FixCard): NotebookRecord {
  const wrong = clean(card.wrong, MAX_LINE);
  const right = clean(card.right, MAX_LINE);
  if (!isRealFix(wrong, right) || !isCardId(card.id)) return record;
  const twin = record.cards.find((c) => same(c.wrong, wrong) && same(c.right, right));
  if (twin) {
    const shotId = card.shotId && isCardId(card.shotId) ? card.shotId : twin.shotId;
    return { ...record, cards: record.cards.map((c) => (c === twin ? { ...c, at: card.at, ...(shotId ? { shotId } : {}) } : c)) };
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
    ...(card.kind && FIX_KINDS.includes(card.kind) ? { kind: card.kind } : {}),
    ...(card.shotId && isCardId(card.shotId) ? { shotId: card.shotId } : {}),
  };
  const cards = [...record.cards, next].sort((a, b) => b.at - a.at).slice(0, MAX_CARDS);
  return { ...record, cards };
}

/** 7일 넘은 후보를 뺀다. */
export function prunePending(record: NotebookRecord, now = Date.now()): NotebookRecord {
  const pending = record.pending.filter((card) => now - card.at < PENDING_KEEP_MS);
  return pending.length === record.pending.length ? record : { ...record, pending };
}

/**
 * 짚인 줄을 오늘의 학습 후보로. 같은 틀림→고침 후보가 이미 있으면 시각만 새로.
 * "또": 노트에 같은 줄이 있거나, 같은 칸에 2주 안의 카드·다른 날 후보가 있으면.
 */
export function addPending(record: NotebookRecord, card: FixCard, now = Date.now()): NotebookRecord {
  const wrong = clean(card.wrong, MAX_LINE);
  const right = clean(card.right, MAX_LINE);
  if (!isRealFix(wrong, right) || !isCardId(card.id)) return record;
  const base = prunePending(record, now);
  const twin = base.pending.find((c) => same(c.wrong, wrong) && same(c.right, right));
  if (twin) return { ...base, pending: base.pending.map((c) => (c === twin ? { ...c, at: card.at } : c)) };
  const node = card.node && isNodeId(card.node) ? card.node : null;
  const recent = (c: FixCard) => card.at - c.at < AGAIN_WINDOW_MS;
  const again =
    base.cards.some((c) => same(c.wrong, wrong) && same(c.right, right)) ||
    (node !== null &&
      (base.cards.some((c) => c.node === node && recent(c)) || base.pending.some((c) => c.node === node && c.day !== card.day && recent(c))));
  const next: FixCard = {
    id: card.id,
    wrong,
    right,
    note: clean(card.note, MAX_NOTE),
    node,
    ...(card.suggest && !node ? { suggest: clean(card.suggest, MAX_NAME) } : {}),
    where: FIX_WHERE.includes(card.where) ? card.where : "chat",
    at: card.at,
    kind: card.kind && FIX_KINDS.includes(card.kind) ? card.kind : "mistake",
    ...(again ? { again: true } : {}),
    ...(card.day && /^\d{4}-\d{2}-\d{2}$/.test(card.day) ? { day: card.day } : {}),
  };
  const pending = [next, ...base.pending].sort((a, b) => b.at - a.at).slice(0, MAX_PENDING);
  return { ...base, pending };
}

/** 고르기 화면에서 처음부터 체크해 둘 것: 진짜 실수, 또 틀린 것. 오타·뜻 짐작은 비워 둔다. */
export function defaultPicked(card: FixCard): boolean {
  return card.again === true || (card.kind ?? "mistake") === "mistake";
}

export type NotebookEdit =
  | { op: "move"; card: string; node: string | null }
  | { op: "memoCard"; card: string; memo: string }
  | { op: "deleteCard"; card: string }
  | { op: "addNode"; id: string; name: string }
  | { op: "renameNode"; node: string; name: string }
  | { op: "deleteNode"; node: string }
  | { op: "memoNode"; node: string; memo: string }
  | { op: "acceptSuggest"; card: string; id: string }
  | { op: "commit"; ids: string[]; shots: string[] }
  | { op: "dismiss"; ids: string[] }
  | { op: "movePhrase"; phrase: string; node: string | null };

const idList = (value: unknown): string[] | null =>
  Array.isArray(value) && value.length <= MAX_PENDING && value.every(isCardId) ? [...new Set(value as string[])] : null;

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
    case "commit": {
      const ids = idList(row.ids);
      const shots = row.shots === undefined ? [] : idList(row.shots);
      return ids && ids.length && shots ? { op: "commit", ids, shots: shots.filter((id) => ids.includes(id)) } : null;
    }
    case "dismiss": {
      const ids = idList(row.ids);
      return ids && ids.length ? { op: "dismiss", ids } : null;
    }
    case "movePhrase":
      return isPhraseKey(row.phrase) && (row.node === null || isNodeId(row.node)) ? { op: "movePhrase", phrase: row.phrase, node: row.node as string | null } : null;
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
    case "commit": {
      // 고른 후보를 노트로(화면을 붙인 것은 shot 표시). 같은 줄이 이미 노트에 있으면 그 카드의 시각만 새로.
      let next: NotebookRecord = record;
      for (const id of edit.ids) {
        const card = record.pending.find((c) => c.id === id);
        if (!card) continue;
        const { again: _a, day: _d, ...rest } = card;
        void _a;
        void _d;
        next = addCard(next, { ...rest, at: now, ...(edit.shots.includes(id) ? { shotId: id } : {}) });
      }
      const picked = new Set(edit.ids);
      return { ...next, pending: next.pending.filter((c) => !picked.has(c.id)) };
    }
    case "dismiss": {
      const drop = new Set(edit.ids);
      return { ...record, pending: record.pending.filter((c) => !drop.has(c.id)) };
    }
    case "acceptSuggest": {
      const card = cardAt(edit.card);
      if (!card?.suggest) return record;
      const added = customIds.has(edit.id) ? record : applyEdit(record, { op: "addNode", id: edit.id, name: card.suggest }, now);
      if (added === record && !customIds.has(edit.id)) return record;
      return applyEdit(added, { op: "move", card: edit.card, node: edit.id }, now);
    }
    case "movePhrase":
      return { ...record, phrases: { ...record.phrases, [edit.phrase]: { node: edit.node, at: now, moved: true } } };
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
