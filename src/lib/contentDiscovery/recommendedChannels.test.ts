import assert from "node:assert/strict";
import test from "node:test";
import { recommendedChannelSeeds } from "./recommendedChannels.ts";
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
  assert.equal(isStudyableUpload({ title: "【夜ニュースライブ】最新ニュース" }), false);
});
