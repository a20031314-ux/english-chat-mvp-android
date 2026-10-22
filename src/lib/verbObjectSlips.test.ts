import assert from "node:assert/strict";
import test from "node:test";
import { explainVerbObjectSlips, promoteVerbObjectSlip, VERB_OBJECT_EXPLAIN_LANGUAGES } from "./verbObjectSlips.ts";

test("natural이 'to 사람'으로 고쳤으면 corrected도", () => {
  const out = promoteVerbObjectSlip("Can you explain me this word?", "Can you explain this word to me?");
  assert.equal(out?.corrected, "Can you explain this word to me?");
  assert.deepEqual(out?.slips, [{ verb: "explain", person: "me" }]);
  assert.equal(
    promoteVerbObjectSlip("She explained us the rules, then we started.", "She explained the rules to us, and then we started.")?.corrected,
    "She explained the rules to us, then we started.",
  );
  assert.equal(
    promoteVerbObjectSlip("Could you describe me your city", "Could you describe your city to me?")?.corrected,
    "Could you describe your city to me",
  );
});

test("뒤가 의문사 절이면 'to 사람'을 동사 바로 뒤에", () => {
  assert.equal(
    promoteVerbObjectSlip("Please explain me what this means.", "Please explain to me what this means.")?.corrected,
    "Please explain to me what this means.",
  );
});

test("natural이 다르게 바꿔 썼거나 그대로면 손대지 않는다", () => {
  assert.equal(promoteVerbObjectSlip("Can you explain me this word?", "What does this word mean?"), null);
  assert.equal(promoteVerbObjectSlip("Can you explain me this word?", "Can you explain me this word?"), null);
  assert.equal(promoteVerbObjectSlip("Can you explain this word to me?", "Can you explain this word to me?"), null);
  assert.equal(promoteVerbObjectSlip("Tell me the story.", "Tell me the story, please."), null); // tell은 사람을 바로 둔다
});

test("설명은 14개 앱 언어, 한국어는 영어 낱말 뒤 조사 없이", () => {
  assert.equal(VERB_OBJECT_EXPLAIN_LANGUAGES.length, 14);
  for (const ui of VERB_OBJECT_EXPLAIN_LANGUAGES) {
    assert.match(explainVerbObjectSlips([{ verb: "explain", person: "me" }], ui), /'explain … to me'/, ui);
  }
  assert.doesNotMatch(explainVerbObjectSlips([{ verb: "explain", person: "me" }], "ko"), /'[a-z …]+'(는|은|를|을|이|가|으로|로)/);
  assert.match(explainVerbObjectSlips([{ verb: "explain", person: "me" }], "xx"), /can't take the person/);
});
