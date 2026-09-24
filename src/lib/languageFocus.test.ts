import assert from "node:assert/strict";
import test from "node:test";
import { SUPPORTED_LEARNING_LANGUAGES } from "./learningLanguages.ts";
import { targetLanguageFocusHints } from "./languageFocus.ts";

/** The shape of the row a language falls back to when it has none of its own. */
function isFallback(hint: string): boolean {
  return hint.startsWith("Focus on real morphosyntax");
}

test("every language the app teaches has a row of its own", () => {
  // The fallback is a sentence about morphosyntax in general, which is what a
  // rubric says when it has nothing to say. A language reaching it gets a
  // reviewer that cannot tell a particle from a postposition — and unlike a
  // missing translation, nothing about that is visible from outside.
  //
  // English is the exception and belongs to be one: it has its own analysis
  // path (englishAnalysis.ts) and never reaches this.
  const missing = SUPPORTED_LEARNING_LANGUAGES.map((language) => language.code)
    .filter((code) => code !== "en")
    .filter((code) => isFallback(targetLanguageFocusHints(code)));
  assert.deepEqual(missing, [], `these languages fall back to the generic row: ${missing}`);
});

test("a language whose every sentence picks a register says which one", () => {
  // The reason this is worth having outside the chat route. A sentence bank has
  // to hold one register across all of its lines — the scene's own greeting
  // already commits to one — and a drafter told only "write casual Japanese"
  // has been told less than this row already knows.
  const decides: Record<string, RegExp> = {
    ja: /polite vs plain/i,
    ko: /politeness|높임/,
    vi: /register/i,
    th: /polite particles|register/i,
    hi: /honorific/i,
    ar: /register/i,
  };
  for (const [code, names] of Object.entries(decides)) {
    assert.match(
      targetLanguageFocusHints(code as never),
      names,
      `${code} does not say what its register decision is`,
    );
  }
});

test("the row is written in the language's own terms, not in English labels", () => {
  // Measured by the thing that makes it useful: it names the actual particles,
  // affixes and endings rather than describing them. A row that stopped doing
  // that would still read as a rubric and would have stopped being one.
  assert.match(targetLanguageFocusHints("ja"), /は\/が\/を/);
  assert.match(targetLanguageFocusHints("ko"), /은\/는\/이\/가/);
  assert.match(targetLanguageFocusHints("zh"), /了\/过\/着/);
  assert.match(targetLanguageFocusHints("th"), /ครับ\/ค่ะ/);
  assert.match(targetLanguageFocusHints("vi"), /đã\/đang\/sẽ/);
});

test("the Romance languages share a row and still name themselves", () => {
  // One row for four languages is the one place this generalises, and it only
  // works because the row interpolates which of them is being talked about.
  for (const code of ["es", "fr", "it", "pt"] as const) {
    const hint = targetLanguageFocusHints(code);
    assert.match(hint, /Romance focus/);
    assert.match(hint, /subjunctive/);
    assert.ok(!isFallback(hint));
  }
  assert.notEqual(targetLanguageFocusHints("es"), targetLanguageFocusHints("fr"));
});
