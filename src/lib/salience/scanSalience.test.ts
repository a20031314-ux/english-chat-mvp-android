import assert from "node:assert/strict";
import { test } from "node:test";
import { logLinguisticSalience } from "./scanSalience.ts";

test("English sentence yields UD tokens and linguistic salience candidates", () => {
  const sentence = "She ended up turfing him out of the party because he'd already been there.";
  const result = logLinguisticSalience({
    sentence,
    language: "en",
    nativeLanguage: "ko",
  });

  assert.equal(result.parser, "english-rules");
  assert.ok(result.tokens.length >= 10);
  assert.ok(result.tokens.some((t) => t.upos === "VERB"));
  assert.ok(result.tokens.some((t) => t.depRelation === "compound:prt" || t.upos === "ADP"));

  const tags = result.candidates.flatMap((c) => c.signalTags);
  assert.ok(
    tags.some((t) => t === "phrasal_verb" || t === "mwe_verb_adp"),
    `expected phrasal verb, got ${tags.join(",")}`,
  );
  assert.ok(
    tags.some((t) => t === "irregular_verb"),
    `expected irregular verb, got ${tags.join(",")}`,
  );
  assert.ok(
    tags.some((t) => t === "contrast_article"),
    `expected article contrast vs Korean, got ${tags.join(",")}`,
  );
  assert.ok(result.candidates[0]!.totalScore > 0.4);
});
