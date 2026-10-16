/**
 * The daily pack: one seven-minute conversation a day, made from what the
 * learner's own practice shows (hub/drafts/daily-pack.md).
 *
 * The loop it is one turn of: measure → steer → fill → measure again. The
 * measuring happens everywhere (every chat and call turn already writes the
 * numbers this reads); steering is choosing today's centre — the gap that is
 * furthest behind — and a second gap beside it; filling is a conversation
 * whose questions are the kind that gap is filled by. When it ends, the
 * learner is told what it did, in facts, and tomorrow's pack starts from the
 * numbers it moved.
 *
 * How it plays: the pack rides on the language's "Just talk" scene with a
 * practice goal naming it. Every learner turn still goes to the tutor, which
 * keeps correcting and judging as always, but the tutor only reacts; the next
 * question is the pack's, chosen by the tutor from a short list so that one
 * that no longer fits what was said is passed over (api/roleplay/turn). The
 * questions are fixed lines (questions.ts), served from the shared speech
 * cache, so a pack costs a transcription and a short judgement per turn.
 *
 * Learner sentences are never kept here. A turn is recorded as numbers and the
 * names of phrases that were said.
 *
 * Pure.
 */

import type { GapId, SelfCheck, UseId } from "../learner/selfCheck.ts";
import type { TurnStats } from "../learner/brief.ts";
import { STRUGGLE } from "../learner/brief.ts";
import { packBankFor, type Frame, type Opener, type PackLine } from "./questions.ts";

/** About seven minutes: each exchange is a question, an answer and a reaction. */
export const PACK_ITEMS = 12;
const BLOCK = 3;
/** Openers a learner saw in the packs this many days back are not used again yet. */
export const AVOID_DAYS = 3;
/** A start this quick, on the first try, is a turn the words came out for. */
export const QUICK_START_MS = 4000;

export type PackItem = {
  /** A line from questions.ts, or "free" for a question the tutor writes itself. */
  id: string;
  text: string;
  translation: string;
  gap: GapId;
  frame: Frame;
  /** Index of the first item of this item's exchange. */
  block: number;
  /** A follow-up that fits the same opener, offered as a second choice. */
  alt?: PackLine;
  /** For a "free" item: the phrase the tutor's own question makes room for. */
  invite?: string;
};

export type PackTurn = {
  /** The item the learner was answering; -1 for the greeting before the first question. */
  index: number;
  gap: GapId | null;
  at: number;
  latencyMs: number | null;
  attempts: number | null;
  /** Null when the tutor did not judge the line. */
  corrected: boolean | null;
  stuck: boolean;
  /** Target phrases this answer contained. */
  used: string[];
};

export type Pack = {
  /** The learner's local day, YYYY-MM-DD: one pack per language per day. */
  day: string;
  language: string;
  centre: GapId;
  side: GapId;
  items: PackItem[];
  /** The next item to ask. */
  cursor: number;
  turns: PackTurn[];
  /** Learned phrases the learner is asked to try, and their ledger state when the pack was made. */
  phrases: { text: string; before: string }[];
  /** A recurring mistake to get right, in English, as the weak-point record names it. */
  mistake?: string;
  /** The My network's elements when the pack was made, so its end can say what grew. */
  growthBefore?: Partial<Record<GapId, { points: number; stage: number }>>;
  createdAt: number;
  finishedAt?: number;
};

/** An element of the My network as the pack reads it (learner/growth.ts). */
export type GrowthElement = { id: GapId; points: number; stage: number; measured: boolean };

export type FocusInput = {
  /**
   * The My network, when there is one: its "grow this next" is today's
   * centre, and the gap beside it is the next least grown — the same rule the
   * learner sees on the My tab, so the pack fills what the network shows.
   */
  growth?: { next: GapId | null; elements: GrowthElement[] } | null;
  stats: TurnStats;
  selfCheck: SelfCheck | null;
  /** Centres of the last few packs, newest first. */
  recentCentres: GapId[];
  hasRecurringMistake: boolean;
};

const ORDER: GapId[] = ["speaking", "accuracy", "words", "listening", "natural", "pronunciation"];

/** Pronunciation has no exchange of its own yet; it is practised by speaking out loud. */
function playable(gap: GapId): GapId {
  return gap === "pronunciation" ? "speaking" : gap;
}

/**
 * Today's centre and the gap beside it.
 *
 * What the turns show comes first — pauses before speaking point at speaking,
 * lines that keep needing correction at accuracy, a mistake that keeps coming
 * back at accuracy too. Then what they said when they started, in their order.
 * A centre is not used three days running, so a gap that will not move does
 * not crowd out every other.
 */
export function chooseFocus(input: FocusInput): { centre: GapId; side: GapId } {
  const { stats } = input;
  if (input.growth?.next) {
    const centre = playable(input.growth.next);
    const ticked = input.selfCheck?.gaps ?? [];
    const rank = (id: GapId) => (ticked.includes(id) ? ticked.indexOf(id) : ticked.length + ORDER.indexOf(id));
    const side = [...input.growth.elements]
      .filter((e) => e.measured && playable(e.id) !== centre)
      .sort((a, b) => a.stage - b.stage || rank(a.id) - rank(b.id))[0];
    return { centre, side: side ? playable(side.id) : centre === "natural" ? "words" : "natural" };
  }
  const measured: GapId[] = [];
  if (stats.medianLatencyMs !== null && stats.medianLatencyMs >= STRUGGLE.latencyMs) measured.push("speaking");
  if (stats.retryRate !== null && stats.retryRate >= STRUGGLE.retryRate) measured.push("speaking");
  if (stats.correctionRate !== null && stats.correctionRate >= STRUGGLE.correctionRate) measured.push("accuracy");
  if (input.hasRecurringMistake) measured.push("accuracy");
  const ranked: GapId[] = [];
  for (const gap of [...measured, ...(input.selfCheck?.gaps ?? []), ...ORDER]) {
    const usable = playable(gap);
    if (!ranked.includes(usable)) ranked.push(usable);
  }
  const tired = input.recentCentres.length >= 2 && input.recentCentres[0] === input.recentCentres[1]
    ? input.recentCentres[0]
    : null;
  const centre = ranked.find((gap) => gap !== tired) ?? ranked[0]!;
  const side = ranked.find((gap) => gap !== centre) ?? "natural";
  return { centre, side };
}

/** A small deterministic shuffle, so a day's pack is the same however often it is asked for. */
function seeded(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

export type ComposeInput = {
  language: string;
  day: string;
  /** Mixed into the shuffle so two learners on the same day do not get the same pack. */
  seed: string;
  centre: GapId;
  side: GapId;
  use?: UseId;
  /** Learned phrases worth trying, with their ledger state now. */
  phrases: { text: string; state: string }[];
  mistake?: string;
  /** Opener ids from the last few days' packs. */
  avoid: string[];
  growth?: GrowthElement[];
  now: number;
};

/**
 * Twelve questions in four exchanges: the centre twice, the side once, and a
 * fourth that serves what their own practice shows — a recurring mistake gets
 * something that happened (the tense it needs), a learned phrase gets a
 * question of the tutor's own that makes room for it, and otherwise everyday
 * small talk. Speaking is filled by quick questions in a row rather than an
 * opener and two follow-ups.
 */
export function composePack(input: ComposeInput): Pack | null {
  const bank = packBankFor(input.language);
  if (!bank) return null;
  const random = seeded(`${input.seed}:${input.day}:${input.language}`);
  const used = new Set<string>();
  const avoid = new Set(input.avoid);

  const pickOpeners = (gap: GapId, count: number): Opener[] => {
    const all = bank.openers.filter((o) => o.gap === gap && !used.has(o.id));
    const fresh = all.filter((o) => !avoid.has(o.id));
    const pool = fresh.length >= count ? fresh : all;
    // Openers from where they will use the language first, then the rest.
    const placed = shuffled(pool.filter((o) => input.use && o.use === input.use), random);
    const general = shuffled(pool.filter((o) => !o.use), random);
    const elsewhere = shuffled(pool.filter((o) => o.use && o.use !== input.use), random);
    const chosen = [...placed, ...general, ...elsewhere].slice(0, count);
    for (const opener of chosen) used.add(opener.id);
    return chosen;
  };

  const items: PackItem[] = [];
  const line = (opener: Opener, block: number): PackItem => ({
    id: opener.id,
    text: opener.text,
    translation: opener.translation,
    gap: opener.gap,
    frame: opener.frame,
    block,
  });

  const exchange = (gap: GapId) => {
    const block = items.length;
    if (gap === "speaking") {
      for (const opener of pickOpeners("speaking", BLOCK)) items.push(line(opener, block));
      return;
    }
    const [opener] = pickOpeners(gap, 1);
    if (!opener) return;
    items.push(line(opener, block));
    if (opener.frame === "quick") return;
    const follows = shuffled(bank.follows[opener.frame], random);
    for (let i = 0; i < BLOCK - 1 && i < follows.length; i += 1) {
      const alt = follows[BLOCK - 1 + i] ?? follows.find((f, j) => j !== i && j >= BLOCK - 1);
      items.push({
        id: follows[i]!.id,
        text: follows[i]!.text,
        translation: follows[i]!.translation,
        gap,
        frame: opener.frame,
        block,
        ...(alt && alt.id !== follows[i]!.id ? { alt } : {}),
      });
    }
  };

  const invite = input.phrases[0]?.text;
  exchange(input.centre);
  exchange(input.side);
  exchange(input.centre);
  if (input.mistake && input.centre !== "accuracy" && input.side !== "accuracy") {
    exchange("accuracy");
  } else if (invite) {
    const block = items.length;
    items.push({ id: "free", text: "", translation: "", gap: "words", frame: "describe", block, invite });
    const follows = shuffled(bank.follows.describe, random).slice(0, BLOCK - 1);
    for (const follow of follows) {
      items.push({ ...follow, gap: "words", frame: "describe", block });
    }
  } else {
    exchange(input.centre === "natural" || input.side === "natural" ? "words" : "natural");
  }

  return {
    day: input.day,
    language: input.language,
    centre: input.centre,
    side: input.side,
    items: items.slice(0, PACK_ITEMS),
    cursor: 0,
    turns: [],
    phrases: input.phrases.slice(0, 3).map((p) => ({ text: p.text, before: p.state })),
    ...(input.mistake ? { mistake: input.mistake } : {}),
    ...(input.growth?.length
      ? { growthBefore: Object.fromEntries(input.growth.map((e) => [e.id, { points: e.points, stage: e.stage }])) }
      : {}),
    createdAt: input.now,
  };
}

export type Candidate = { slot: number; index: number; text: string; translation: string; free?: string };

/**
 * What the tutor may ask next, best first: the planned question, another
 * follow-up that fits the same opener, and the start of the next exchange.
 * Empty when every question has been asked.
 */
export function candidates(pack: Pack): Candidate[] {
  const item = pack.items[pack.cursor];
  if (!item) return [];
  const out: Candidate[] = [];
  const add = (index: number, text: string, translation: string, free?: string) =>
    out.push({ slot: out.length + 1, index, text, translation, ...(free ? { free } : {}) });
  add(pack.cursor, item.text, item.translation, item.id === "free" ? item.invite : undefined);
  if (item.alt) add(pack.cursor, item.alt.text, item.alt.translation);
  const nextBlock = pack.items.findIndex((other, i) => i > pack.cursor && other.block !== item.block);
  if (nextBlock > 0 && item.block !== pack.cursor) {
    const next = pack.items[nextBlock]!;
    add(nextBlock, next.text, next.translation, next.id === "free" ? next.invite : undefined);
  }
  return out;
}

/** The pack after a turn: the answer recorded, and the cursor past the question chosen next. */
export function advance(pack: Pack, turn: Omit<PackTurn, "index" | "gap">, chosen: Candidate | null): Pack {
  const answering = pack.cursor - 1;
  const recorded: PackTurn = {
    ...turn,
    index: answering,
    gap: answering >= 0 ? pack.items[answering]?.gap ?? null : null,
  };
  return {
    ...pack,
    turns: [...pack.turns, recorded].slice(-40),
    cursor: chosen ? chosen.index + 1 : pack.cursor,
  };
}

/** Whether every question has been asked and answered. */
export function packDone(pack: Pack): boolean {
  return pack.cursor >= pack.items.length && pack.turns.some((t) => t.index === pack.items.length - 1);
}

export type Retro = {
  /** Questions answered, out of the pack's. */
  answered: number;
  planned: number;
  minutes: number;
  /** Quick questions started within four seconds on the first try. */
  quick: { done: number; of: number } | null;
  /** Answers that needed no correction, of those the tutor judged. */
  clean: { done: number; of: number } | null;
  stuck: number;
  phrases: { text: string; used: boolean; mastered: boolean }[];
  mistake: { name: string; clean: number; of: number } | null;
  /**
   * What changed in their record, for "added to My". Facts only: elements of
   * the My network that gained points since the pack was made (and whether
   * they moved up a stage), and phrases the ledger now counts as mastered.
   * Points earned elsewhere the same day are in it too — it is the record that
   * is reported, not a claim about this conversation alone.
   */
  changed: Array<
    | { kind: "grew"; element: GapId; points: number; stageUp: boolean }
    | { kind: "mastered"; phrase: string }
  >;
  centre: GapId;
  side: GapId;
};

/**
 * What the pack did, from its own turns and the ledger as it is now. Nothing
 * is inferred that the numbers do not show: a phrase counts as mastered only
 * if the ledger moved it there since the pack was made.
 */
export function retro(pack: Pack, ledgerStates: Record<string, string>, growthNow: GrowthElement[] = []): Retro {
  const answers = pack.turns.filter((t) => t.index >= 0);
  const quickTurns = answers.filter((t) => t.gap === "speaking");
  const quickDone = quickTurns.filter(
    (t) => (t.attempts ?? 1) === 1 && t.latencyMs !== null && t.latencyMs <= QUICK_START_MS,
  ).length;
  const judged = answers.filter((t) => t.corrected !== null);
  const cleanDone = judged.filter((t) => t.corrected === false).length;
  const accuracyTurns = judged.filter((t) => t.gap === "accuracy");
  const phrases = pack.phrases.map((p) => {
    const now = ledgerStates[p.text.toLowerCase()] ?? p.before;
    return {
      text: p.text,
      used: pack.turns.some((t) => t.used.some((u) => u.toLowerCase() === p.text.toLowerCase())),
      mastered: now === "mastered" && p.before !== "mastered",
    };
  });
  const times = pack.turns.map((t) => t.at);
  const minutes = times.length >= 2 ? Math.max(1, Math.round((Math.max(...times) - Math.min(...times)) / 60000)) : 0;
  const changed: Retro["changed"] = [];
  for (const element of growthNow) {
    const before = pack.growthBefore?.[element.id];
    if (!before) continue;
    const points = element.points - before.points;
    if (points > 0) changed.push({ kind: "grew", element: element.id, points, stageUp: element.stage > before.stage });
  }
  changed.sort((a, b) => (a.kind === "grew" && b.kind === "grew" ? b.points - a.points : 0));
  for (const phrase of phrases) if (phrase.mastered) changed.push({ kind: "mastered", phrase: phrase.text });
  const mistakeClean = accuracyTurns.filter((t) => t.corrected === false).length;
  return {
    answered: new Set(answers.map((t) => t.index)).size,
    planned: pack.items.length,
    minutes,
    quick: quickTurns.length ? { done: quickDone, of: quickTurns.length } : null,
    clean: judged.length ? { done: cleanDone, of: judged.length } : null,
    stuck: answers.filter((t) => t.stuck).length,
    phrases,
    mistake: pack.mistake ? { name: pack.mistake, clean: mistakeClean, of: accuracyTurns.length } : null,
    changed,
    centre: pack.centre,
    side: pack.side,
  };
}

/** What the tutor is told on a pack turn (English: the model's, not the learner's). */
export function packPrompt(pack: Pack, options: Candidate[]): string {
  if (options.length === 0) {
    return [
      "Today's guided practice is complete with this answer.",
      'React to what they said in a few words, then close the conversation warmly in one short line, with "end".',
    ].join("\n");
  }
  const listed = options.map((option) =>
    option.free
      ? `${option.slot}. (a short question of your own that gives them a natural chance to say "${option.free}" — do not say it or hint at it yourself)`
      : `${option.slot}. "${option.text}"`,
  );
  return [
    "Today's guided practice: after your reaction, the app itself asks the learner the next question. Your choices for it:",
    ...listed,
    `Pick the one that fits best after what they just said — 1 unless it no longer makes sense (for example they already answered it). Put its number in "ask".`,
    'In "say", write only a short reaction to what they said (a few words, no question), or leave it empty.',
    options.some((o) => o.free)
      ? 'If you pick the choice that is a question of your own, write your short reaction and that question together in "say".'
      : "",
    'If they are stuck, or asked you something, or are leaving: ignore the choices, answer as you normally would, and set "ask" to 0.',
  ]
    .filter(Boolean)
    .join("\n");
}

/** The tutor's pick from its answer, by number; null for none. */
export function readAsk(raw: string, options: Candidate[]): Candidate | null {
  let value: unknown;
  try {
    value = (JSON.parse(raw) as Record<string, unknown>).ask;
  } catch {
    return null;
  }
  const n = typeof value === "number" ? value : typeof value === "string" ? Number.parseInt(value, 10) : NaN;
  return options.find((option) => option.slot === n) ?? null;
}

export function isPackDay(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/** What the pack card shows, and the practice goal the call is opened with. */
export function packSummary(pack: Pack) {
  const answered = new Set(pack.turns.filter((t) => t.index >= 0).map((t) => t.index)).size;
  return {
    day: pack.day,
    centre: pack.centre,
    side: pack.side,
    questions: pack.items.length,
    answered,
    minutes: 7,
    phrases: pack.phrases.map((p) => p.text),
    status: (pack.finishedAt || packDone(pack) ? "done" : pack.turns.length ? "doing" : "new") as "new" | "doing" | "done",
    practice: {
      pack: pack.day,
      ...(pack.phrases.length ? { phrases: pack.phrases.map((p) => p.text) } : {}),
    },
  };
}
