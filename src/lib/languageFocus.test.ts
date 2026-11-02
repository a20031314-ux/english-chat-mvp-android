import assert from "node:assert/strict";
import test from "node:test";
import { SUPPORTED_LEARNING_LANGUAGES } from "./learningLanguages.ts";
import { targetLanguageFocusHints, tutorSpeechRules } from "./languageFocus.ts";

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

test("the call tutor keeps one speech level, the learner's", () => {
  // 가상 사용자 196명(2026-11-01): ko 학습자 해요체에 튜터 반말 42턴.
  const ko = tutorSpeechRules("ko");
  assert.match(ko, /해요체/);
  assert.match(ko, /Never mix/);
  // 반말 인사 뒤 첫 답이 반말로 남던 것(10/41), 해요체 답에 -구나 섞임(6).
  assert.match(ko, /not your greeting/);
  assert.match(ko, /never -구나/);
  assert.match(tutorSpeechRules("ja"), /です\/ます/);
  // Every language says to follow how the learner speaks, with or without a row.
  for (const { code: language } of SUPPORTED_LEARNING_LANGUAGES) {
    assert.match(tutorSpeechRules(language), /the one they use with you/, language);
    assert.match(tutorSpeechRules(language), /newest message/, language);
    assert.match(tutorSpeechRules(language), /they have moved on/, language);
  }
});

test("Arabic is Modern Standard throughout, in the call and in corrections", () => {
  // ar 튜터 레반트 방언 ↔ 고친 말 표준어 18턴(2026-11-01) — 사용자 결정: 표준어로 통일.
  assert.match(tutorSpeechRules("ar"), /Modern Standard Arabic/);
  assert.match(tutorSpeechRules("ar"), /never a dialect/);
  assert.match(targetLanguageFocusHints("ar"), /Modern Standard Arabic/);
  assert.doesNotMatch(tutorSpeechRules("es"), /Arabic/);
});

test("한국어 통화 튜터는 번역투(그렇군요·-지요)를 피하게 한다", () => {
  // 사용자 2026-11-02 "그렇군요. 피곤할 때는 푹 쉬는 게 제일이지요 — 영어를 번역한 말투". 예전 규칙이 해요체 예로 -군요를 먼저 들어 매 답이 "-시군요"로 시작.
  const ko = tutorSpeechRules("ko");
  assert.match(ko, /not like English put into Korean/);
  assert.match(ko, /never as the opener/);
  assert.doesNotMatch(ko, /: -군요, -네요/);
});

test("통화 튜터: 영어 반응을 옮긴 꼴을 피하고, 태국어 존칭 끝말은 튜터 성별대로", () => {
  // 사용자 2026-11-02 "다른 언어도 영어 지시 때문에 번역체인지" — 운영 표본: zh 听起来 4/6, ru Понимаю 4/6, ar يبدو أن 3/6, th 여자 튜터가 ครับ.
  for (const language of ["zh", "es", "ar", "ru", "ja", "th"] as const) assert.match(tutorSpeechRules(language), /not like English put into it/, language);
  assert.match(tutorSpeechRules("zh"), /听起来/);
  assert.match(tutorSpeechRules("th", "f"), /you are a woman: ค่ะ/);
  assert.match(tutorSpeechRules("th", "m"), /you are a man: ครับ/);
});
