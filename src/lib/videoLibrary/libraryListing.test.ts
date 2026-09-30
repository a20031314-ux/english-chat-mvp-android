import { test } from "node:test";
import assert from "node:assert/strict";
import {
  bundledListing,
  normalizeLibraryListing,
} from "./libraryListing.ts";

test("the build's own month is a real answer, not a loading state", () => {
  const listing = bundledListing("en");
  assert.ok(listing.clips.length > 0);
  assert.equal(listing.trialVideoIds.length, 3);
  assert.equal(listing.trialVideoIds[0], listing.clips[0]!.videoId);
});

test("a served month replaces it, free clips and all", () => {
  const listing = normalizeLibraryListing({
    month: "2026-10",
    trialVideoIds: ["b"],
    clips: [
      { videoId: "a", title: "One", durationSeconds: 200 },
      { videoId: "b", title: "Two", durationSeconds: 300 },
    ],
  });
  assert.ok(listing);
  assert.equal(listing!.month, "2026-10");
  assert.deepEqual(listing!.trialVideoIds, ["b"]);
  assert.equal(listing!.clips.length, 2);
});

test("an answer with no clips keeps the month the build came with", () => {
  assert.equal(normalizeLibraryListing({ month: "2026-10", clips: [] }), null);
  assert.equal(normalizeLibraryListing({}), null);
  assert.equal(normalizeLibraryListing("nope"), null);
  assert.equal(normalizeLibraryListing(null), null);
});

test("half a clip is not a clip", () => {
  const listing = normalizeLibraryListing({
    clips: [
      { videoId: "a", title: "One", durationSeconds: 200 },
      { videoId: "", title: "No id", durationSeconds: 200 },
      { videoId: "c", title: "No length", durationSeconds: 0 },
      { title: "Nothing at all" },
    ],
  });
  assert.equal(listing!.clips.length, 1);
});

test("free clips nobody sent do not lock the library", () => {
  // A server naming ids that are not in its own list would otherwise leave a
  // free learner with every clip locked.
  const listing = normalizeLibraryListing({
    trialVideoIds: ["not-in-the-list"],
    clips: [
      { videoId: "a", title: "One", durationSeconds: 200 },
      { videoId: "b", title: "Two", durationSeconds: 200 },
    ],
  });
  assert.deepEqual(listing!.trialVideoIds, ["a", "b"]);
});
