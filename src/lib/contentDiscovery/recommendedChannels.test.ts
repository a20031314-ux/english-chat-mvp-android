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
  assert.equal(recommendedChannelSeed("fr", "hugo")?.name, "HugoDécrypte");
  assert.equal(recommendedChannelSeed("en", "missing"), null);
});
