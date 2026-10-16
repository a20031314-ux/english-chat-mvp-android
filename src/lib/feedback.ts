/**
 * Feedback a learner sends from inside the app: what bothered them, in their
 * own words, with the screen it happened on.
 *
 * Shared by the sheet that sends it and the route that keeps it. Kept apart
 * from the AI-content report (reportContent.ts), which is a narrower thing Play
 * requires: this is for anything at all — a button that is hard to find, a
 * screen that is cut off, a wish.
 *
 * What is kept, and for how long, is stated on the sheet itself: the note, the
 * picture if they leave it attached, and where in the app they were. Nothing
 * is sent until they press send.
 */

export const FEEDBACK_NOTE_MAX = 1000;

/** A screenshot, re-encoded small on the device before it is sent. */
export const FEEDBACK_IMAGE_MAX_BYTES = 450_000;
export const FEEDBACK_IMAGE_MAX_WIDTH = 720;

/** Kept this long, then gone on their own. */
export const FEEDBACK_TTL_SECONDS = 90 * 24 * 60 * 60;

/** Per person per day, so a stuck button cannot fill the store. */
export const FEEDBACK_DAILY_LIMIT = 15;

export const FEEDBACK_TABS = ["map", "chat", "roleplay", "video", "vocab", "other"] as const;
export type FeedbackTab = (typeof FEEDBACK_TABS)[number];

export type FeedbackSubmission = {
  note: string;
  /** data:image/jpeg;base64,… or empty. */
  image: string;
  tab: FeedbackTab;
  uiLocale: string;
  learningLanguage: string;
  appVersion: string;
  platform: "android" | "web";
};

export type FeedbackItem = Omit<FeedbackSubmission, "image"> & {
  id: string;
  at: number;
  /** A stable, non-reversible tag for the sender, to count people rather than sends. */
  sender: string;
  hasImage: boolean;
};

export function isFeedbackTab(value: unknown): value is FeedbackTab {
  return typeof value === "string" && (FEEDBACK_TABS as readonly string[]).includes(value);
}

/** Bytes a base64 data URL decodes to. */
export function dataUrlBytes(dataUrl: string): number {
  const at = dataUrl.indexOf(",");
  const body = at >= 0 ? dataUrl.slice(at + 1) : dataUrl;
  const padding = body.endsWith("==") ? 2 : body.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((body.length * 3) / 4) - padding);
}

/** Only a JPEG or WebP picture, within the size the device was asked to keep to. */
export function acceptableImage(value: unknown): string {
  if (typeof value !== "string" || !value) return "";
  if (!/^data:image\/(jpeg|webp|png);base64,[A-Za-z0-9+/=]+$/.test(value)) return "";
  return dataUrlBytes(value) <= FEEDBACK_IMAGE_MAX_BYTES ? value : "";
}
