import assert from "node:assert/strict";
import { test } from "node:test";
import { recommendSalience } from "./pipeline.ts";
import { buildRankPrompt } from "./rankCandidates.ts";
import { sourceContextFromTranslation } from "./sourceContext.ts";
import { buildSourceExpressionPrompt } from "./sourceSignals.ts";

test("maps existing tab sourceType onto SourceContext", () => {
  assert.equal(sourceContextFromTranslation("subtitle"), "videoLearning");
  assert.equal(sourceContextFromTranslation("community"), "webReading");
  assert.equal(sourceContextFromTranslation("formal"), "ebook");
  assert.equal(sourceContextFromTranslation("conversation"), "chat");
});

test("source lexicon + linguistic merge logs video vs web vs ebook candidates", async () => {
  const sentence =
    "She ended up turfing him out of the party because he'd already been there.";
  const video = await recommendSalience({
    sentence,
    language: "en",
    nativeLanguage: "ko",
    sourceType: "subtitle",
    learnerLevel: "intermediate",
  });
  const tags = video.merged.flatMap((item) => item.signalTags);
  assert.ok(tags.includes("phrasal_verb") || tags.includes("idiom"));
  assert.ok(video.recommendations.length >= 1);
  assert.ok(video.recommendations.length <= 3);
  assert.ok(video.recommendations[0]!.charEnd > video.recommendations[0]!.charStart);

  const web = await recommendSalience({
    sentence: "ngl no cap that take was wild lol",
    language: "en",
    nativeLanguage: "ko",
    sourceType: "community",
    learnerLevel: "intermediate",
  });
  const webTags = web.merged.flatMap((item) => item.signalTags);
  assert.ok(
    webTags.includes("community_slang") || webTags.includes("abbreviation"),
    `expected slang, got ${webTags.join(",")}`,
  );

  const ebook = await recommendSalience({
    sentence: "He was poor, whereby he could not thus refuse.",
    language: "en",
    nativeLanguage: "ko",
    sourceType: "formal",
    learnerLevel: "advanced",
  });
  const ebookTags = ebook.merged.flatMap((item) => item.signalTags);
  assert.ok(ebookTags.includes("literary"), `expected literary, got ${ebookTags.join(",")}`);

  const webPrompt = buildSourceExpressionPrompt({
    sentence: "ngl no cap",
    language: "en",
    sourceContext: "webReading",
    alreadyFound: [],
  });
  assert.match(webPrompt, /slang/i);
  const rankPrompt = buildRankPrompt({
    sentence,
    language: "en",
    nativeLanguage: "ko",
    learnerLevel: "beginner",
    topN: 3,
    candidates: video.merged,
  });
  assert.match(rankPrompt, /Beginner/);
});

test("advanced level drops lone article contrast; LLM rank can reorder", async () => {
  const sentence = "She ended up turfing him out of the party because he'd already been there.";
  const advanced = await recommendSalience({
    sentence,
    language: "en",
    nativeLanguage: "ko",
    sourceType: "subtitle",
    learnerLevel: "advanced",
  });
  assert.ok(
    !advanced.recommendations.some((item) => item.originalText.toLowerCase() === "the"),
  );

  const ranked = await recommendSalience({
    sentence,
    language: "en",
    nativeLanguage: "ko",
    sourceType: "subtitle",
    learnerLevel: "intermediate",
    rankJson: async () => ({
      ranked: [{ start: 3, end: 5, reason: "Idiom the subtitle is built around." }],
    }),
  });
  assert.equal(ranked.recommendations[0]?.originalText.toLowerCase().includes("turf"), true);
  assert.match(ranked.recommendations[0]?.salienceReason ?? "", /Idiom/);
});
