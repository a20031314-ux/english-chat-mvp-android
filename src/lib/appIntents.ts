/**
 * One screen asking another to do something: the study map sending a learner
 * to practise a topic in chat, a call, a video or the word list.
 *
 * The tabs are siblings that never held references to each other, and the map
 * should not start to — so a request is a window event with a typed payload.
 * Whoever owns the thing listens: AppHome switches tabs, ChatWindow fills its
 * input, VideoLearningTab loads a video and seeks to the scene.
 */

export type AppIntents = {
  /** Switch to a bottom tab. */
  openTab: { tab: "map" | "chat" | "roleplay" | "video" | "vocab" };
  /** Put a first line in the chat input, for the learner to send or change. */
  chatDraft: { text: string };
  /** Load a video and, once it plays, jump to the scene. */
  openVideo: { url: string; startSeconds?: number; durationSeconds?: number };
};

const PREFIX = "talkbank:";

export function sendAppIntent<K extends keyof AppIntents>(name: K, detail: AppIntents[K]) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(`${PREFIX}${name}`, { detail }));
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
