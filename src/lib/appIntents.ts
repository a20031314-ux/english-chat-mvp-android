/**
 * One screen asking another to do something: the study map sending a learner
 * to practise a topic in chat, a call, a video or the word list.
 *
 * The tabs are siblings that never held references to each other, and the map
 * should not start to — so a request is a window event with a typed payload.
 * Whoever owns the thing listens: AppHome switches tabs, ChatWindow fills its
 * input, VideoLearningTab loads a video and seeks to the scene.
 */

import type { PracticeGoal } from "@/lib/learner/practice";

export type AppIntents = {
  /** Switch to a bottom tab. */
  openTab: { tab: "map" | "chat" | "roleplay" | "video" | "vocab" };
  /** Put a first line in the chat input, for the learner to send or change. */
  chatDraft: { text: string };
  /** Load a video and, once it plays, jump to the scene. */
  openVideo: { url: string; startSeconds?: number; durationSeconds?: number };
  /**
   * Start a conversation with something to practise in it (learner/practice.ts):
   * chat opens with the tutor speaking first, a call opens the open conversation
   * already in the situation. AppHome switches to the tab; the tab starts it.
   */
  practice: {
    tab: "chat" | "roleplay";
    goal: PracticeGoal;
    /** What the learner sees it called, in the interface language. */
    title?: string;
    /** The mistake as the learner's map names it, in the interface language. */
    mistakeLabel?: string;
    /** For today's pack: questions already answered in an earlier call, so its count carries on. */
    packAnswered?: number;
  };
  /** Open a topic of the study map, for its tasks. */
  openTopic: { topicId: string };
};

const PREFIX = "talkbank:";

/**
 * The last request of each kind, for a screen that is not there yet when it is
 * sent: the call and map tabs are only mounted while shown, so the request that
 * switches to them arrives before they can listen. They take it when they mount.
 */
const pending = new Map<keyof AppIntents, { detail: unknown; at: number; takenAt?: number }>();
const PENDING_MS = 5000;
/**
 * Taken is cleared, but not at once: React may run a state initialiser twice
 * in development, and the second run has to see what the first took.
 */
const TAKEN_GRACE_MS = 300;

export function sendAppIntent<K extends keyof AppIntents>(name: K, detail: AppIntents[K]) {
  if (typeof window === "undefined") return;
  pending.set(name, { detail, at: Date.now() });
  window.dispatchEvent(new CustomEvent(`${PREFIX}${name}`, { detail }));
}

/** A request sent in the last few seconds and not yet taken; taking it clears it. */
export function takeAppIntent<K extends keyof AppIntents>(
  name: K,
  accept: (detail: AppIntents[K]) => boolean = () => true,
): AppIntents[K] | null {
  const row = pending.get(name);
  const now = Date.now();
  if (!row || now - row.at > PENDING_MS) return null;
  if (row.takenAt !== undefined && now - row.takenAt > TAKEN_GRACE_MS) return null;
  const detail = row.detail as AppIntents[K];
  if (!accept(detail)) return null;
  row.takenAt ??= now;
  return detail;
}

/** Listen for one kind of request; returns the function that stops listening. */
export function onAppIntent<K extends keyof AppIntents>(
  name: K,
  handle: (detail: AppIntents[K]) => void,
): () => void {
  if (typeof window === "undefined") return () => undefined;
  const listener = (event: Event) => handle((event as CustomEvent<AppIntents[K]>).detail);
  window.addEventListener(`${PREFIX}${name}`, listener);
  return () => window.removeEventListener(`${PREFIX}${name}`, listener);
}
