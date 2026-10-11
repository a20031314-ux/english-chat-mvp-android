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
