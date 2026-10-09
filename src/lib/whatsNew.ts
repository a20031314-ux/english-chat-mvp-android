/**
 * What changed in a release, told once to the people who updated into it.
 *
 * The update banner gets someone to install a build; nothing told them what
 * the build changed, so a release could add a tab and a learner would find it
 * by accident, or never. This is the list the app shows on the first launch
 * after an update — in the learner's own interface language, with a picture of
 * each change taken in that language.
 *
 * The notes ship inside the app (a build can only describe itself), and the
 * pictures stay on the server, one set per interface language, so the app does
 * not carry fourteen languages' worth of screenshots to show one.
 *
 * Adding a release: add an entry at the top of RELEASE_NOTES with copy keys
 * written in all fourteen locales, and run
 * `node scripts/capture-whats-new.mjs <version>` to make the pictures.
 */
import type { UICopy } from "./copy.ts";
import { compareVersions } from "./appVersion.ts";

export type WhatsNewTab = "map" | "chat" | "roleplay" | "video" | "vocab";

export type WhatsNewItem = {
  id: string;
  title: keyof UICopy;
  body: keyof UICopy;
  /** File name under /whats-new/<version>/<locale>/, without extension. */
  shot: string;
  /** Where "try it" goes. */
  tab: WhatsNewTab;
};

export type ReleaseNote = { version: string; items: WhatsNewItem[] };

export const RELEASE_NOTES: ReleaseNote[] = [
  {
    // 2.63 shipped these without anything to say so; 2.64 is the first build
    // that can, so it introduces them.
    version: "2.64",
    items: [
      { id: "map", title: "whatsNewMapTitle", body: "whatsNewMapBody", shot: "map", tab: "map" },
      { id: "chat", title: "whatsNewChatTitle", body: "whatsNewChatBody", shot: "chat", tab: "chat" },
      { id: "ask", title: "whatsNewAskTitle", body: "whatsNewAskBody", shot: "ask", tab: "chat" },
    ],
  },
];

export const WHATS_NEW_SEEN_KEY = "whatsNewSeenVersion";

/**
 * The last build without this sheet. Someone with no record of having seen it
 * but with signs of having used the app updated from this build or older.
 */
export const LAST_VERSION_WITHOUT_SHEET = "2.63";

/**
 * Keys only use writes. A first launch writes a session id and the learning
 * language before anyone has done anything, so those prove nothing.
 */
export const USE_SIGNAL_KEYS = [
  "conversationSessions",
  "roleplayConversations",
  "vocabularyEntries",
  "savedItems",
  "englishAnalysisRecent",
  "sentenceNotes.v1",
  "videoStudySessions",
  "videoLearningSaves",
  "learningCards",
  "appUiLocale",
];

/**
 * The notes to show, newest first, merged into one list.
 *
 * - seen: the version recorded when the sheet was last closed (null if never)
 * - current: this build's version
 * - usedBefore: whether storage shows the app was used before this launch
 *
 * A fresh install has nothing to catch up on. Someone who skipped versions
 * gets every release in between, once.
 */
export function pendingNotes(
  seen: string | null,
  current: string,
  usedBefore: boolean,
  notes: ReleaseNote[] = RELEASE_NOTES,
): WhatsNewItem[] {
  if (!current) return [];
  const from = seen ?? (usedBefore ? LAST_VERSION_WITHOUT_SHEET : null);
  if (from === null) return [];
  return notes
    .filter(
      (note) =>
        compareVersions(note.version, from) > 0 &&
        compareVersions(note.version, current) <= 0,
    )
    .sort((a, b) => compareVersions(b.version, a.version))
    .flatMap((note) => note.items);
}

/** The release a set of pictures belongs to, for the image URL. */
export function noteVersionOf(item: WhatsNewItem, notes: ReleaseNote[] = RELEASE_NOTES): string {
  return notes.find((note) => note.items.includes(item))?.version ?? "";
}

/** Where a picture lives on the server. */
export function shotPath(version: string, locale: string, shot: string): string {
  return `/whats-new/${version}/${locale}/${shot}.webp`;
}
