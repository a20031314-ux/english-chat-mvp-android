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

export type WhatsNewTab = "map" | "chat" | "roleplay" | "video" | "vocab" | "rooms" | "people";

export type WhatsNewItem = {
  id: string;
  title: keyof UICopy;
  body: keyof UICopy;
  /** File name under /whats-new/<version>/<locale>/, without extension. */
  shot: string;
  /** Where "try it" goes. */
  tab: WhatsNewTab;
};

export type ReleaseNote = {
  version: string;
  /** Play versionCode (android/app/build.gradle). Play's update check reports only this, so the banner maps it back to a version. */
  code: number;
  items: WhatsNewItem[];
};

export const RELEASE_NOTES: ReleaseNote[] = [
  {
    version: "2.69",
    code: 83,
    items: [
      { id: "people", title: "whatsNewPeopleTitle", body: "whatsNewPeopleBody", shot: "people", tab: "people" },
      { id: "quote", title: "whatsNewQuoteTitle", body: "whatsNewQuoteBody", shot: "quote", tab: "rooms" },
      { id: "layouts", title: "whatsNewLayoutsTitle", body: "whatsNewLayoutsBody", shot: "layouts", tab: "rooms" },
      { id: "host", title: "whatsNewHostTitle", body: "whatsNewHostBody", shot: "host", tab: "rooms" },
    ],
  },
  {
    // 2.67(81)은 내부 테스트에서만 돌았다. 2.66에서 바로 오는 사람에게 2.67 항목이
    // 아직 없어서(dev 열린 일), 이 묶음이 2.68의 새 탭·메시지·로그인을 알린다.
    version: "2.68",
    code: 82,
    items: [
      { id: "rooms", title: "whatsNewRoomsTitle", body: "whatsNewRoomsBody", shot: "rooms", tab: "rooms" },
      { id: "dm", title: "whatsNewDmTitle", body: "whatsNewDmBody", shot: "dm", tab: "rooms" },
      { id: "account", title: "whatsNewAccountTitle", body: "whatsNewAccountBody", shot: "account", tab: "map" },
    ],
  },
  {
    version: "2.66",
    code: 80,
    items: [
      { id: "ledger", title: "whatsNewLedgerTitle", body: "whatsNewLedgerBody", shot: "ledger", tab: "map" },
      { id: "links", title: "whatsNewLinksTitle", body: "whatsNewLinksBody", shot: "links", tab: "chat" },
      { id: "pick", title: "whatsNewPickTitle", body: "whatsNewPickBody", shot: "pick", tab: "chat" },
      { id: "calltools", title: "whatsNewCallToolsTitle", body: "whatsNewCallToolsBody", shot: "calltools", tab: "roleplay" },
    ],
  },
  {
    version: "2.65",
    code: 79,
    items: [
      { id: "mission", title: "whatsNewMissionTitle", body: "whatsNewMissionBody", shot: "mission", tab: "map" },
      { id: "progress", title: "whatsNewProgressTitle", body: "whatsNewProgressBody", shot: "progress", tab: "map" },
      { id: "weak", title: "whatsNewWeakTitle", body: "whatsNewWeakBody", shot: "weak", tab: "map" },
      { id: "meant", title: "whatsNewMeantTitle", body: "whatsNewMeantBody", shot: "meant", tab: "roleplay" },
    ],
  },
  {
    // 2.63 shipped these without anything to say so; 2.64 is the first build
    // that can, so it introduces them.
    version: "2.64",
    code: 78,
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

/** The release a Play versionCode belongs to, if it has notes. */
export function versionForCode(code: number, notes: ReleaseNote[] = RELEASE_NOTES): string | null {
  return notes.find((note) => note.code === code)?.version ?? null;
}

/**
 * What a build that is still on `current` would get by updating to `target`:
 * every release after the one it has, up to and including the one on offer,
 * newest first. This is what the update banner shows — the same notes and
 * pictures the "what's new" sheet shows after the update, but read before it.
 */
export function notesBetween(
  current: string,
  target: string,
  notes: ReleaseNote[] = RELEASE_NOTES,
): ReleaseNote[] {
  if (!target) return [];
  return notes
    .filter(
      (note) =>
        (!current || compareVersions(note.version, current) > 0) &&
        compareVersions(note.version, target) <= 0,
    )
    .sort((a, b) => compareVersions(b.version, a.version));
}

/** The newest release that has notes. */
export function latestNotedVersion(notes: ReleaseNote[] = RELEASE_NOTES): string {
  return [...notes].sort((a, b) => compareVersions(b.version, a.version))[0]?.version ?? "";
}
