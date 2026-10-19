import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import {
  FEEDBACK_DAILY_LIMIT,
  FEEDBACK_TTL_SECONDS,
  type FeedbackItem,
  type FeedbackSubmission,
} from "../feedback.ts";
import { kvGetJson, kvIncrBy, kvListPush, kvListRange, kvSetJson } from "./kv.ts";

/**
 * Where in-app feedback is kept until it is read: one record per send, the
 * picture under its own key so a list of records stays small, and an index of
 * ids in the order they came. Everything expires after ninety days.
 */

const ITEM = (id: string) => `feedback:v1:item:${id}`;
const IMAGE = (id: string) => `feedback:v1:img:${id}`;
const INDEX = "feedback:v1:index";
const DAILY = (sender: string, day: string) => `feedback:v1:daily:${sender}:${day}`;

/** Counts people, not sends, without keeping who they are. */
export function senderTag(userId: string): string {
  return createHash("sha256").update(`feedback:${userId}`).digest("hex").slice(0, 16);
}

export async function saveFeedback(
  userId: string,
  submission: FeedbackSubmission,
  now = Date.now(),
): Promise<{ ok: true; id: string } | { ok: false; error: "LIMIT" }> {
  const sender = senderTag(userId);
  const day = new Date(now).toISOString().slice(0, 10);
  const count = await kvIncrBy(DAILY(sender, day), 1, 2 * 24 * 60 * 60);
  if (count > FEEDBACK_DAILY_LIMIT) return { ok: false, error: "LIMIT" };

  const id = `${now.toString(36)}-${randomUUID().slice(0, 8)}`;
  const { image, ...rest } = submission;
  const item: FeedbackItem = { ...rest, id, at: now, sender, hasImage: Boolean(image) };
  if (image) await kvSetJson(IMAGE(id), image, FEEDBACK_TTL_SECONDS);
  await kvSetJson(ITEM(id), item, FEEDBACK_TTL_SECONDS);
  await kvListPush(INDEX, [id], FEEDBACK_TTL_SECONDS);
  return { ok: true, id };
}

/** Records newer than `since`, oldest first, at most `limit`. */
export async function listFeedback(since: number, limit = 300): Promise<FeedbackItem[]> {
  const ids = await kvListRange(INDEX, 0, -1);
  const out: FeedbackItem[] = [];
  for (const id of ids) {
    const at = Number.parseInt(id.split("-")[0] ?? "", 36);
    if (!Number.isFinite(at) || at <= since) continue;
    const item = await kvGetJson<FeedbackItem>(ITEM(id));
    if (item) out.push(item);
    if (out.length >= limit) break;
  }
  return out;
}

export async function feedbackImage(id: string): Promise<string | null> {
  if (!/^[a-z0-9]+-[a-f0-9]{8}$/.test(id)) return null;
  return kvGetJson<string>(IMAGE(id));
}

/**
 * Reading feedback is for the person who runs the app. The key is checked
 * against its hash, so the repository holds nothing that opens it; the key
 * itself lives with the scheduled task that sorts the feedback.
 */
const READ_KEY_SHA256 = "529f65c9e45dd4d12ba2b1f58432be559ed67212af64d2248e81911c7b5daedf";

export function canReadFeedback(key: string | null): boolean {
  if (!key) return false;
  const given = createHash("sha256").update(key.trim()).digest();
  const want = Buffer.from(READ_KEY_SHA256, "hex");
  return given.length === want.length && timingSafeEqual(given, want);
}
