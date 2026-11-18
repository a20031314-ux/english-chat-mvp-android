import { kvGetJson, kvListPush, kvSetJson } from "@/lib/server/kv";
import {
  buildTranscriptRecord,
  parseTranscriptRecord,
  type TranscriptRecord,
} from "@/lib/videoIndex/transcript";
import type { PreparedTranscript } from "@/lib/videoSubtitle/types";

/**
 * Where the words of prepared videos are kept, one record per video and
 * language (lib/videoIndex/transcript.ts says what is in one and why).
 *
 * Two keys:
 * - `videoTranscript:v1:<lang>:<videoId>` — the record;
 * - `videoTranscripts:v1:<lang>` — the ids that have one, newest last, which is
 *   what a search walks. Pushed only when a record is new, so it stays a list of
 *   distinct videos.
 *
 * Long-lived rather than permanent: a video nobody opens for a year can be
 * prepared again if somebody does.
 */

const TTL_SECONDS = 400 * 24 * 60 * 60;
function recordKey(language: string, videoId: string): string {
  return `videoTranscript:v1:${language}:${videoId}`;
}

function listKey(language: string): string {
  return `videoTranscripts:v1:${language}`;
}

export async function readVideoTranscript(
  language: string,
  videoId: string,
): Promise<TranscriptRecord | null> {
  return parseTranscriptRecord(await kvGetJson(recordKey(language, videoId)));
}

/**
 * Keep what a successful preparation said. Failures to write are logged and
 * swallowed: the learner already has their video, and keeping it is a favour
 * to the next one.
 */
export async function keepVideoTranscript(
  prepared: PreparedTranscript,
  language: string,
  title?: string,
): Promise<void> {
  try {
    const record = buildTranscriptRecord({
      videoId: prepared.videoId,
      language,
      title: title || prepared.title,
      durationSeconds: prepared.durationSeconds,
      source: prepared.sttSource,
      segments: prepared.segments.map((segment) => ({
        startTime: segment.startTime,
        endTime: segment.endTime,
        text: segment.normalizedText || segment.rawText,
      })),
    });
    if (!record) return;
    const existing = await kvGetJson(recordKey(record.language, record.videoId));
    await kvSetJson(recordKey(record.language, record.videoId), record, TTL_SECONDS);
    if (!existing) {
      await kvListPush(listKey(record.language), [record.videoId], TTL_SECONDS);
    }
  } catch (error) {
    console.error("[video-transcript-store] keep failed", error);
  }
}
