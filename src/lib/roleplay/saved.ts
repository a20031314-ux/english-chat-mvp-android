import type { ConversationMemory } from "./memory.ts";
import type { TranscriptLine } from "./review.ts";
import { afterSaying, currentInstruction, type SessionState } from "./session.ts";
import type { RoleplayScenario, SentenceBank } from "./script.ts";

/**
 * Conversations kept, so that closing one is not the same as losing it.
 *
 * Until now a conversation lived in React state and nowhere else: the screen
 * had one button, it unmounted the scene, and everything said went with it.
 * There was also no way to stop — the only exit that let the character say
 * goodbye was to say goodbye out loud, which is a thing to know rather than a
 * thing to find.
 *
 * So a conversation is written down as it happens, and the door offers to carry
 * on with it. The chat tab already works this way (ChatWindow's
 * conversationSessions); this is the same idea, with more to keep, because
 * resuming a scene means restoring where the conversation stood and not only
 * what was said in it.
 *
 * What is deliberately *not* kept is the id the server charges against. Its
 * clock runs from when the conversation started, so resuming an hour later
 * under the same id would fall due for every five minutes in between and charge
 * for an hour nobody spent. A resumed conversation is a new id and a new clock:
 * one point at the start of each sitting, which makes putting it down and
 * picking it up cost slightly more rather than less, and so is not a way around
 * paying for it.
 *
 * Pure apart from the two functions that touch storage, which take it as an
 * argument so the rest can be tested without a browser.
 */

export const SAVED_CONVERSATIONS_KEY = "roleplayConversations";

/**
 * How many to keep. Long enough to be a record worth having, short enough that
 * it never becomes the reason local storage is full: these carry a transcript
 * each, and the oldest is the one nobody is coming back to.
 */
export const MAX_SAVED_CONVERSATIONS = 20;

export type SavedConversation = {
  id: string;
  scenarioId: string;
  /** The language it was spoken in, so a listing can be filtered to one. */
  language: string;
  /** What to call it in a list: their first sentence, or the scene's name. */
  title: string;
  startedAt: number;
  updatedAt: number;
  /**
   * When the conversation actually ended. Absent while it is only put down,
   * which is the difference between "carry on" and "read it again".
   */
  finishedAt?: number;
  state: SessionState;
  said: TranscriptLine[];
  memory: ConversationMemory;
};

/** Whether this one can be carried on rather than only read. */
export function isUnfinished(saved: SavedConversation): boolean {
  return saved.finishedAt === undefined && !saved.state.finished;
}

/**
 * What to call a conversation in a list.
 *
 * Their first sentence, because that is what they will recognise — the
 * character's opening line is the same every time and names nothing. Falls back
 * to the scene's own title when they had not said anything yet.
 */
export function titleFor(said: readonly TranscriptLine[], fallback: string): string {
  const first = said.find((line) => line.who === "learner" && line.text.trim());
  const text = first?.text.trim();
  if (!text || text === "…") return fallback;
  return text.length > 60 ? `${text.slice(0, 57)}…` : text;
}

/**
 * A stored row, believed only as far as it can be checked.
 *
 * Anything on local storage was written by a build that may be older than this
 * one, or edited by hand, so a row that is not the shape this expects is
 * dropped rather than half-read. The session state is the part worth being
 * careful about: it is fed straight back into the state machine.
 */
export function normalizeSaved(raw: unknown): SavedConversation | null {
  if (typeof raw !== "object" || raw === null) return null;
  const row = raw as Record<string, unknown>;
  const state = row.state as SessionState | undefined;
  if (
    typeof row.id !== "string" ||
    typeof row.scenarioId !== "string" ||
    typeof row.language !== "string" ||
    typeof row.title !== "string" ||
    typeof row.startedAt !== "number" ||
    typeof row.updatedAt !== "number" ||
    !Array.isArray(row.said) ||
    typeof state !== "object" ||
    state === null ||
    typeof state.nodeId !== "string" ||
    !Array.isArray(state.history)
  ) {
    return null;
  }
  const memory = row.memory as ConversationMemory | undefined;
  return {
    id: row.id,
    scenarioId: row.scenarioId,
    language: row.language,
    title: row.title,
    startedAt: row.startedAt,
    updatedAt: row.updatedAt,
    ...(typeof row.finishedAt === "number" ? { finishedAt: row.finishedAt } : {}),
    state,
    said: row.said as TranscriptLine[],
    memory:
      memory && typeof memory.text === "string" && typeof memory.upTo === "number"
        ? memory
        : { text: "", upTo: 0 },
  };
}

/** Newest first, capped, with the row being written replacing any older copy. */
export function upsertSaved(
  list: readonly SavedConversation[],
  saved: SavedConversation,
): SavedConversation[] {
  const rest = list.filter((row) => row.id !== saved.id);
  return [saved, ...rest]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, MAX_SAVED_CONVERSATIONS);
}

export function removeSaved(
  list: readonly SavedConversation[],
  id: string,
): SavedConversation[] {
  return list.filter((row) => row.id !== id);
}

/**
 * The conversation this scene would carry on with, if there is one.
 *
 * The most recent unfinished one for that scene. Older unfinished ones stay in
 * the list to be read; offering a choice of which to resume would be a second
 * screen to answer a question nobody asked.
 */
export function resumableFor(
  list: readonly SavedConversation[],
  scenarioId: string,
): SavedConversation | null {
  return (
    list
      .filter((row) => row.scenarioId === scenarioId && isUnfinished(row))
      .sort((a, b) => b.updatedAt - a.updatedAt)[0] ?? null
  );
}

/**
 * What a saved conversation resumes into.
 *
 * The queue and the turn in flight are dropped. Both are the middle of a moment
 * — lines the character had not finished saying, a turn already sent and not
 * yet answered — and neither survives the screen going away. Resuming puts the
 * conversation back where it can be spoken to, which is what the learner is
 * coming back for.
 */
export function stateToResume(state: SessionState): SessionState {
  return { ...state, queue: [], pending: null, listeningSince: null };
}

/**
 * Where a saved conversation picks up, transcript and state agreeing.
 *
 * They can disagree, and the disagreement is easy to create. A line goes into
 * the transcript when it starts being said, because the learner is reading
 * along; the state moves past it only when the audio finishes. Close in between
 * — which is most of the two seconds a greeting takes — and the saved row holds
 * a conversation whose transcript has the line and whose state has not said it.
 *
 * Resuming then said it again, on top of a transcript that already had it.
 * Reported from a phone as three conversations opening as one: hello, hello,
 * hello. Each had been opened and closed on the greeting, and each resume added
 * another copy.
 *
 * So the transcript is believed and the state is brought up to it. `afterSaying`
 * is the right tool for that rather than a nudge of the node: it also puts the
 * line into `history`, which is what the character reads, and which was equally
 * missing — the director could not see a greeting the learner had been shown.
 *
 * The cost is a line that was displayed but never heard, because it was closed
 * before the sound began, is not heard on the way back either. Against hearing
 * it twice that is the better half of the trade, and it is the half the learner
 * has already read.
 */
export function resumeFrom(
  saved: SavedConversation,
  scenario: RoleplayScenario,
  bank: SentenceBank,
  now: number,
): { state: SessionState; said: TranscriptLine[] } {
  let state = stateToResume(saved.state);
  const lastSpoken = [...saved.said].reverse().find((line) => line.who === "tutor");
  if (!lastSpoken) return { state, said: saved.said };
  // One step, not a loop: only the node the conversation is sitting on can be
  // about to repeat itself, and a scene that said the same line twice in a row
  // on purpose would be caught by the second condition anyway.
  const about = currentInstruction(scenario, bank, state);
  if (about.do === "say" && about.text === lastSpoken.text) {
    state = afterSaying(scenario, bank, state, now).state;
  }
  return { state, said: saved.said };
}

export function readSaved(store: Storage | undefined | null): SavedConversation[] {
  if (!store) return [];
  try {
    const raw = store.getItem(SAVED_CONVERSATIONS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(normalizeSaved)
      .filter((row): row is SavedConversation => row !== null)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    // Unreadable storage is the same as none: the conversation on screen is
    // still the conversation, and losing the list is not worth a broken tab.
    return [];
  }
}

export function writeSaved(
  store: Storage | undefined | null,
  list: readonly SavedConversation[],
): void {
  if (!store) return;
  try {
    store.setItem(SAVED_CONVERSATIONS_KEY, JSON.stringify(list));
  } catch {
    // Full, or refused. Nothing here is worth interrupting a conversation for.
  }
}
