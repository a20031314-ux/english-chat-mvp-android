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

test("import points follow the video's length, in thousandths", () => {
  // 쓴 만큼(2026-10-23): 3분 = 1포인트, 올림은 0.001 단위로만.
  assert.equal(importPointsForDuration(1), 0.006);
  assert.equal(importPointsForDuration(180), 1);
  assert.equal(importPointsForDuration(181), 1.006);
  assert.equal(importPointsForDuration(7 * 60), 2.334);
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

test("premium custom import charges its length on first prepare only", () => {
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
  if (first.ok) assert.equal(first.billablePoints, 1.334);

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

test("premium imports can use purchased points once the grant is spent", () => {
  const base = {
    isPremium: true,
    videoId: "abcdefghijk",
    language: "en" as const,
    durationSeconds: 9 * 60,
    usedPoints: monthlyImportPoints(true),
    billedVideoIds: [],
    trialVideoIds: [],
  };
  const without = evaluateVideoAccess(base);
  assert.equal(without.ok, false);
  if (!without.ok) assert.equal(without.reason, "quota");
  const withBought = evaluateVideoAccess({ ...base, purchasedPoints: 3 });
  assert.equal(withBought.ok, true);
  if (withBought.ok) assert.equal(withBought.billablePoints, 3);
  const tooFew = evaluateVideoAccess({ ...base, purchasedPoints: 2 });
  assert.equal(tooFew.ok, false);
});

test("free users cannot import even with purchased points", () => {
  const decision = evaluateVideoAccess({
    isPremium: false,
    videoId: "abcdefghijk",
    language: "en",
    durationSeconds: 60,
    usedPoints: 0,
    purchasedPoints: 50,
    billedVideoIds: [],
    trialVideoIds: [],
  });
  assert.equal(decision.ok, false);
  if (!decision.ok) assert.equal(decision.reason, "import_locked");
});
