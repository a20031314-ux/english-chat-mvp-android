import assert from "node:assert/strict";
import test from "node:test";
import {
  evaluateVideoAccess,
  importPointsForDuration,
  maxVideoPrepSeconds,
  monthlyImportPoints,
} from "./videoPrep.ts";
import {
  currentLibraryPack,
  trialEligibleVideoIds,
} from "../videoLibrary/catalog.ts";

const englishPack = currentLibraryPack("en", new Date("2026-08-15T00:00:00Z"));
const trialIds = trialEligibleVideoIds(englishPack);
const libraryId = trialIds[0] ?? "";
const lockedLibraryId = englishPack?.clips[3]?.videoId ?? "";

test("import points round up to 3-minute units", () => {
  assert.equal(importPointsForDuration(1), 1);
  assert.equal(importPointsForDuration(180), 1);
  assert.equal(importPointsForDuration(181), 2);
  assert.equal(importPointsForDuration(12 * 60), 4);
  assert.equal(importPointsForDuration(15 * 60), 5);
});

test("free users can open the first three catalog clips", () => {
  assert.ok(libraryId);
  const decision = evaluateVideoAccess({
    isPremium: false,
    videoId: libraryId,
    language: "en",
    durationSeconds: 4 * 60,
    usedPoints: 0,
    billedVideoIds: [],
    trialVideoIds: [],
  });
  assert.equal(decision.ok, true);
  if (decision.ok) {
    assert.equal(decision.kind, "library");
    assert.equal(decision.billablePoints, 0);
  }
});

test("free users cannot open the rest of the monthly library", () => {
  assert.ok(lockedLibraryId);
  const decision = evaluateVideoAccess({
    isPremium: false,
    videoId: lockedLibraryId,
    language: "en",
    durationSeconds: 4 * 60,
    usedPoints: 0,
    billedVideoIds: [],
    trialVideoIds: trialIds,
  });
  assert.equal(decision.ok, false);
  if (!decision.ok) assert.equal(decision.reason, "catalog_locked");
});

test("free users cannot import a custom URL", () => {
  const decision = evaluateVideoAccess({
    isPremium: false,
    videoId: "dQw4w9wgGcQ",
    language: "en",
    durationSeconds: 3 * 60,
    usedPoints: 0,
    billedVideoIds: [],
    trialVideoIds: [],
  });
  assert.equal(decision.ok, false);
  if (!decision.ok) assert.equal(decision.reason, "import_locked");
});

test("premium library clips cost zero points", () => {
  const decision = evaluateVideoAccess({
    isPremium: true,
    videoId: lockedLibraryId,
    language: "en",
    durationSeconds: 5 * 60,
    usedPoints: 0,
    billedVideoIds: [],
    trialVideoIds: [],
  });
  assert.equal(decision.ok, true);
  if (decision.ok) assert.equal(decision.billablePoints, 0);
});

test("premium custom import charges rounded points on first prepare only", () => {
  const first = evaluateVideoAccess({
    isPremium: true,
    videoId: "dQw4w9wgGcQ",
    language: "en",
    durationSeconds: 4 * 60,
    usedPoints: 0,
    billedVideoIds: [],
    trialVideoIds: [],
  });
  assert.equal(first.ok, true);
  if (first.ok) assert.equal(first.billablePoints, 2);

  const replay = evaluateVideoAccess({
    isPremium: true,
    videoId: "dQw4w9wgGcQ",
    language: "en",
    durationSeconds: 4 * 60,
    usedPoints: 2,
    billedVideoIds: ["dQw4w9wgGcQ"],
    trialVideoIds: [],
  });
  assert.equal(replay.ok, true);
  if (replay.ok) assert.equal(replay.billablePoints, 0);
});

test("a video longer than 15 minutes is rejected, not billed", () => {
  const decision = evaluateVideoAccess({
    isPremium: true,
    videoId: "dQw4w9wgGcQ",
    language: "en",
    durationSeconds: 40 * 60,
    usedPoints: 0,
    billedVideoIds: [],
    trialVideoIds: [],
  });
  assert.equal(decision.ok, false);
  if (!decision.ok) {
    assert.equal(decision.reason, "too_long");
    assert.equal(decision.maxSeconds, maxVideoPrepSeconds(true));
  }
});

test("every learning language has an August 2026 library pack", () => {
  const languages = [
    "en",
    "ko",
    "ja",
    "zh",
    "es",
    "fr",
    "it",
    "pt",
    "ru",
    "ar",
    "id",
    "vi",
    "th",
    "hi",
  ] as const;
  for (const language of languages) {
    const pack = currentLibraryPack(language, new Date("2026-08-15T00:00:00Z"));
    assert.ok(pack, `missing library pack for ${language}`);
    assert.ok(pack.clips.length >= 4, `${language} pack is too small`);
    assert.ok(
      pack.clips.every((clip) => clip.durationSeconds <= 15 * 60),
      `${language} has a clip over 15 minutes`,
    );
  }
});

test("monthly import points block another custom video", () => {
  const decision = evaluateVideoAccess({
    isPremium: true,
    videoId: "dQw4w9wgGcQ",
    language: "en",
    durationSeconds: 60,
    usedPoints: monthlyImportPoints(true),
    billedVideoIds: [],
    trialVideoIds: [],
  });
  assert.equal(decision.ok, false);
  if (!decision.ok) assert.equal(decision.reason, "quota");
});
