import assert from "node:assert/strict";
import test from "node:test";
import {
  recommendedChannelSeed,
  recommendedChannelSeeds,
} from "./recommendedChannels.ts";

test("recommendedChannelSeed looks up curated channels by learning language", () => {
  const english = recommendedChannelSeeds("en");
  assert.ok(english.some((row) => row.id === "bbc-news"));
  assert.equal(recommendedChannelSeed("en", "bbc-news")?.handle, "BBCNews");
  assert.equal(recommendedChannelSeed("en", "bbc-news")?.channelId, "UC16niRr50-MSBwiO3YDb3RA");
  assert.equal(recommendedChannelSeed("fr", "hugo")?.name, "HugoDécrypte");
  assert.equal(recommendedChannelSeed("en", "missing"), null);
});

test("every recommended channel is pinned to a channel id, once", () => {
  const languages = ["en", "ko", "ja", "zh", "es", "fr", "it", "pt", "ru", "ar", "id", "vi", "th", "hi"] as const;
  const seen = new Set<string>();
  for (const language of languages) {
    const seeds = recommendedChannelSeeds(language);
    assert.ok(seeds.length >= 2, `${language} has recommendations`);
    for (const seed of seeds) {
      assert.match(seed.channelId, /^UC[\w-]{22}$/, `${language}/${seed.id}`);
      assert.ok(!seen.has(seed.channelId), `${seed.channelId} listed twice`);
      seen.add(seed.channelId);
    }
  }
});

test("channel lists leave out Shorts and what is too long to prepare", async () => {
  const { isStudyableUpload } = await import("./studyableUpload.ts");
  assert.equal(isStudyableUpload({ title: "【大河ドラマ】第40回予告", durationSeconds: 16 }), false);
  assert.equal(isStudyableUpload({ title: "寧々の覚悟 | NHK | #shorts", durationSeconds: 70 }), false);
  assert.equal(isStudyableUpload({ title: "ข่าวเช้า", durationSeconds: 3600 }), false);
  assert.equal(isStudyableUpload({ title: "Así funciona el cerebro", durationSeconds: 300 }), true);
  assert.equal(isStudyableUpload({ title: "No length yet" }), true);
});
