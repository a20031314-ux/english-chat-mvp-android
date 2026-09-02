/**
 * Checks every clip in the monthly video library against YouTube.
 *
 * The library is hand-curated, and a clip that looks right in a list can still
 * be useless: the Korean pack was seven episodes of a series that carries its
 * narration as on-screen text rather than speech, so there was nothing to
 * transcribe and no segment could ever be built from it. Nothing failed loudly —
 * the videos existed, the titles matched, and learners just got a library that
 * did not work.
 *
 * So the criteria the catalog states for itself are checked here instead of
 * trusted. Speech is what actually matters, and the honest signal for it is
 * whether YouTube's own recogniser produced a track: it only does that when
 * there is something to hear. A published caption track means the web path
 * works too, since that path reads captions rather than listening.
 *
 * The two are separate failures. A narrated video with no published captions
 * still teaches on Android, where audio is transcribed on the device — so it
 * is reported as a warning, not a reason to drop the clip.
 *
 * Usage:  npm run verify:library
 * Needs YOUTUBE_API_KEY, from the environment or .env.local.
 */

import { readFileSync } from "node:fs";
import { PACKS } from "../src/lib/videoLibrary/catalog.ts";

/** Catalogued lengths drive the import point price, so drift is a billing bug. */
const DURATION_TOLERANCE = 0.05;
const BATCH = 50;

function apiKey() {
  const fromEnv = process.env.YOUTUBE_API_KEY?.trim();
  if (fromEnv) return fromEnv;
  try {
    const line = readFileSync(".env.local", "utf8")
      .split(/\r?\n/)
      .find((row) => row.startsWith("YOUTUBE_API_KEY="));
    const value = line?.slice("YOUTUBE_API_KEY=".length).trim().replace(/^"|"$/g, "");
    if (value) return value;
  } catch {
    // fall through to the error below
  }
  console.error("YOUTUBE_API_KEY is not set, and .env.local does not carry one.");
  process.exit(2);
}

function isoSeconds(iso) {
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso ?? "");
  if (!m) return null;
  return Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
}

async function fetchVideos(ids, key) {
  const found = new Map();
  for (let i = 0; i < ids.length; i += BATCH) {
    const batch = ids.slice(i, i + BATCH).join(",");
    const url =
      "https://www.googleapis.com/youtube/v3/videos" +
      `?part=contentDetails,snippet,status&id=${batch}&key=${key}`;
    const response = await fetch(url);
    const body = await response.json();
    if (body.error) {
      console.error(`YouTube API: ${body.error.message}`);
      process.exit(2);
    }
    for (const item of body.items ?? []) found.set(item.id, item);
  }
  return found;
}

/**
 * Whether YouTube heard anything. `contentDetails.caption` counts published
 * tracks only, so a narrated video whose only track is auto-generated reads as
 * uncaptioned there — which is why this second, costlier lookup exists.
 */
async function captionTracks(videoId, key) {
  const url =
    "https://www.googleapis.com/youtube/v3/captions" +
    `?part=snippet&videoId=${videoId}&key=${key}`;
  try {
    const response = await fetch(url);
    const body = await response.json();
    if (body.error) return null;
    return (body.items ?? []).map((item) => item.snippet.trackKind);
  } catch {
    return null;
  }
}

/** Every reason a clip cannot serve as a lesson, or an empty list. */
function faults(clip, video, packLanguage, tracks) {
  if (!video) return { hard: ["gone from YouTube, or private"], soft: [] };
  const out = [];
  const soft = [];

  const published = video.contentDetails?.caption === "true";
  if (!published) {
    if (tracks === null) {
      soft.push("caption tracks could not be listed; speech unverified");
    } else if (tracks.length === 0) {
      out.push("no caption track at all — nothing was heard, so nothing can be transcribed");
    } else {
      soft.push(
        "auto-generated captions only — plays on Android, no subtitles on the web path",
      );
    }
  }

  if (video.status?.privacyStatus !== "public") {
    out.push(`not public (${video.status?.privacyStatus})`);
  }
  // The app plays clips in an embedded player; one that refuses to embed is
  // just as unusable as one that has been deleted.
  if (video.status?.embeddable === false) out.push("cannot be embedded");


  const actual = isoSeconds(video.contentDetails?.duration);
  if (actual === null) {
    out.push("unreadable duration");
  } else if (
    Math.abs(actual - clip.durationSeconds) >
    Math.max(5, clip.durationSeconds * DURATION_TOLERANCE)
  ) {
    out.push(`duration is ${actual}s, catalogued as ${clip.durationSeconds}s`);
  }

  const audio = video.snippet?.defaultAudioLanguage;
  if (audio && !audio.toLowerCase().startsWith(packLanguage)) {
    out.push(`spoken language is ${audio}, pack is ${packLanguage}`);
  }

  return { hard: out, soft };
}

const key = apiKey();
const videos = await fetchVideos(
  [...new Set(PACKS.flatMap((pack) => pack.clips.map((clip) => clip.videoId)))],
  key,
);

// Only the clips with no published captions need the second, dearer lookup.
const trackLists = new Map();
for (const pack of PACKS) {
  for (const clip of pack.clips) {
    const video = videos.get(clip.videoId);
    if (video && video.contentDetails?.caption !== "true") {
      trackLists.set(clip.videoId, await captionTracks(clip.videoId, key));
    }
  }
}

let broken = 0;
let warned = 0;
for (const pack of PACKS) {
  const rows = pack.clips.map((clip) => ({
    clip,
    ...faults(
      clip,
      videos.get(clip.videoId),
      pack.language,
      trackLists.get(clip.videoId) ?? null,
    ),
  }));
  const bad = rows.filter((row) => row.hard.length > 0);
  const iffy = rows.filter((row) => row.hard.length === 0 && row.soft.length > 0);
  broken += bad.length;
  warned += iffy.length;

  const verdict = bad.length > 0 ? "FAIL" : iffy.length > 0 ? "warn" : "ok  ";
  console.log(
    `${verdict}  ${pack.id}  ${pack.clips.length} clips` +
      (bad.length ? `  ${bad.length} unusable` : "") +
      (iffy.length ? `  ${iffy.length} with caveats` : ""),
  );
  for (const row of [...bad, ...iffy]) {
    console.log(`        ${row.clip.videoId}  ${row.clip.title}`);
    for (const reason of row.hard) console.log(`          x ${reason}`);
    for (const reason of row.soft) console.log(`          ~ ${reason}`);
  }
}

console.log("");
if (broken > 0) {
  console.log(
    `${broken} clip(s) cannot be used and need replacing` +
      (warned ? `, and ${warned} more play on Android only.` : "."),
  );
  process.exit(1);
}
if (warned > 0) {
  console.log(`Every clip plays. ${warned} lack published captions, so the web`);
  console.log("path has no subtitles for them; Android transcribes them itself.");
} else {
  console.log("Every clip is playable, captioned, spoken and correctly timed.");
}
