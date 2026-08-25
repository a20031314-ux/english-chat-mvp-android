import assert from "node:assert/strict";
import test from "node:test";
import {
  chatPartnerForLanguage,
  conversationPartnerIdentity,
} from "./chatPartner.ts";

test("partner follows the target language country", () => {
  const english = chatPartnerForLanguage("en");
  assert.equal(english.givenName, "Alex");
  assert.equal(english.flagCountry, "us");

  const japanese = chatPartnerForLanguage("ja");
  assert.equal(japanese.givenName, "Yuki");
  assert.equal(japanese.flagCountry, "jp");
});

test("prompt identity is a native speaker, not a tutor", () => {
  const identity = conversationPartnerIdentity("en");
  assert.match(identity, /Alex/);
  assert.match(identity, /United States/);
  assert.match(identity, /not a language teacher/);
});
