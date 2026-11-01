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
  assert.equal(japanese.givenName, "Haruto");
  assert.equal(japanese.flagCountry, "jp");
});

test("prompt identity is a native speaker, not a tutor", () => {
  const identity = conversationPartnerIdentity("en");
  assert.match(identity, /Alex/);
  assert.match(identity, /United States/);
  assert.match(identity, /not a language teacher/);
});

test("every language has a woman and a man tutor; the default is the pictured one, old apps keep the old name", async () => {
  const { TTS_VOICES } = await import("./roleplay/voices.ts");
  const { SUPPORTED_LEARNING_LANGUAGES: LEARNING_LANGUAGES } = await import("./learningLanguages.ts");
  const { tutorChoices, defaultTutorGender, tutorVoice, serverTutorGender } = await import("./chatPartner.ts");
  const fs = await import("node:fs");
  const before: Record<string, string> = { en: "Alex", ko: "Minjun", ja: "Yuki", zh: "Chen", es: "Sofía", fr: "Camille", it: "Luca", pt: "Maria", ru: "Anya", ar: "Omar", id: "Raka", vi: "Linh", th: "Niran", hi: "Arjun" };
  for (const { code } of LEARNING_LANGUAGES) {
    const names = tutorChoices(code);
    assert.notEqual(names.f, names.m, code);
    // 옛 앱(튜터를 안 보냄)에 서버가 쓰는 튜터는 예전 이름 그대로.
    assert.equal(chatPartnerForLanguage(code, serverTutorGender(code, undefined)).givenName, before[code], `${code} old apps unchanged`);
    assert.equal(serverTutorGender(code, "f"), "f");
    // 기본 튜터는 그림이 있는 사람이고, 그 그림 파일이 있다.
    const pictured = chatPartnerForLanguage(code);
    assert.equal(pictured.gender, defaultTutorGender(code));
    for (const g of ["f", "m"] as const) {
      const photo = chatPartnerForLanguage(code, g).photo;
      assert.ok(fs.existsSync(`public${photo}`), photo);
    }
    // 두 목소리는 서로 다르고, 둘 다 목소리 목록에 있다.
    assert.notEqual(tutorVoice(code, "f"), tutorVoice(code, "m"), code);
    for (const g of ["f", "m"] as const) assert.ok((TTS_VOICES as readonly string[]).includes(tutorVoice(code, g)), `${code} ${g}`);
  }
});

test("chosen gender changes name, voice and the identity line (ja spaceless, es gendered Latin)", () => {
  const ja = chatPartnerForLanguage("ja", "m");
  assert.equal(ja.givenName, "Haruto");
  assert.equal(ja.gender, "m");
  const es = conversationPartnerIdentity("es", "m");
  assert.match(es, /Mateo/);
  assert.match(es, /a man/);
  assert.match(conversationPartnerIdentity("es", "f"), /Sofía.*a woman/);
  assert.equal(chatPartnerForLanguage("es", "f").photo, "/tutors/es-f.webp");
});

test("just talk takes the chosen tutor's voice; a recorded voice it no longer matches is synthesised", async () => {
  const { justTalkScenarios, withTutorGender } = await import("./roleplay/justTalk.ts");
  const { startSession, currentInstruction } = await import("./roleplay/session.ts");
  const { sentencesFor, findScenario } = await import("./roleplay/catalog.ts");
  for (const language of ["th", "es"]) {
    const scene = justTalkScenarios().find((s) => s.language === language)!;
    for (const gender of ["f", "m"] as const) {
      const used = withTutorGender(scene, gender);
      assert.equal(used.voice, chatPartnerForLanguage(language, gender).voice);
      const hello = currentInstruction(used, sentencesFor(language), startSession(used));
      assert.equal(hello?.do, "say");
      if (hello?.do !== "say") continue;
      assert.equal(hello.voice, used.voice);
      // 녹음과 같은 목소리면 파일, 아니면 파일 없이(합성).
      assert.equal(Boolean(hello.audioPath), used.voice === scene.voice, `${language} ${gender}`);
    }
  }
  // 대본 장면은 그 장면 사람의 목소리 그대로.
  const scripted = findScenario("cafe-order") ?? null;
  if (scripted && !scripted.openEnded) assert.equal(withTutorGender(scripted, "m"), scripted);
});

test("a woman tutor greets in the woman's form where the language marks it (ru, ar)", async () => {
  const { justTalkScenarios, withTutorGender } = await import("./roleplay/justTalk.ts");
  const { startSession, currentInstruction } = await import("./roleplay/session.ts");
  const { sentencesFor } = await import("./roleplay/catalog.ts");
  const hello = (language: string, gender: "f" | "m") => {
    const used = withTutorGender(justTalkScenarios().find((s) => s.language === language)!, gender);
    const said = currentInstruction(used, sentencesFor(language), startSession(used));
    return said?.do === "say" ? said : null;
  };
  assert.match(hello("ru", "f")!.text, /Рада/);
  assert.match(hello("ru", "m")!.text, /Рад /);
  assert.equal(hello("ru", "f")!.audioPath, undefined);
  assert.match(hello("ar", "f")!.text, /سعيدة/);
  assert.ok(hello("ar", "m")!.audioPath, "Omar keeps the recording");
});

test("the Arabic tutor is from no one country — no country in the brief, no flag by the name", () => {
  // 사용자 2026-11-01 "아랍어는 출신을 특정 나라로 두지 않는 걸로" — 사우디 사람이면 걸프 방언으로 끌렸다.
  for (const gender of ["f", "m"] as const) {
    const arabic = chatPartnerForLanguage("ar", gender);
    assert.equal(arabic.countryEn, "");
    assert.equal(arabic.flagCountry, "");
    const brief = conversationPartnerIdentity("ar", gender);
    assert.doesNotMatch(brief, / from /);
    assert.match(brief, /Modern Standard Arabic/);
  }
  assert.match(conversationPartnerIdentity("ja", "f"), / from Japan/);
});
