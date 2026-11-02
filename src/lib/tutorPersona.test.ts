import assert from "node:assert/strict";
import test from "node:test";
import { conversationPartnerIdentity, tutorGenderOfVoice, tutorVoice } from "./chatPartner.ts";
import { SUPPORTED_LEARNING_LANGUAGES } from "./learningLanguages.ts";
import { TUTOR_ABOUT } from "./tutorAbout.ts";
import { TUTOR_PERSONAS, personaBrief, personaVoice, tutorPersona } from "./tutorPersona.ts";
import { VOXTRAL_LANGUAGES } from "./server/voxtralLanguages.ts";

const CODES = SUPPORTED_LEARNING_LANGUAGES.map((entry) => entry.code);

test("튜터 28명 모두 성격·말투·목소리가 있다", () => {
  for (const code of CODES) {
    for (const gender of ["f", "m"] as const) {
      const persona = tutorPersona(code, gender);
      assert.ok(persona, `${code}-${gender}`);
      assert.ok(persona.personality.length > 10 && persona.talk.length > 10 && persona.voice.length > 30, `${code}-${gender} too thin`);
      assert.ok(TUTOR_ABOUT[code]?.[gender], `${code}-${gender} has a persona but no profile`);
    }
  }
  assert.deepEqual(Object.keys(TUTOR_PERSONAS).sort(), [...CODES].sort());
});

test("Voxtral이 흉내 낼 언어는 튜터마다 그 사람 말투의 참고 문장이 있다", () => {
  for (const code of VOXTRAL_LANGUAGES) {
    for (const gender of ["f", "m"] as const) {
      assert.ok(tutorPersona(code, gender)?.ref, `${code}-${gender} ref`);
    }
  }
});

test("목소리 지시는 그 성별·성인으로 쓴다(실존 인물·어린이 없음)", () => {
  for (const code of CODES) {
    assert.match(personaVoice(code, "f"), /\bwoman\b/i, `${code}-f`);
    assert.match(personaVoice(code, "m"), /\bman\b/i, `${code}-m`);
    for (const gender of ["f", "m"] as const) {
      assert.doesNotMatch(personaVoice(code, gender), /\b(child|kid|girl|boy|teen)\b/i, `${code}-${gender}`);
    }
  }
});

test("성격·말투는 태도만 — 높임·길이·교정 규칙을 넘지 않는다고 지시에 적힌다, 채팅 정체성에도 들어간다", () => {
  const brief = personaBrief("ja", "f");
  assert.match(brief, /speech level still follows how they speak to you/);
  assert.match(brief, /do not repeat the same exclamation/);
  // 띄어쓰기 없는 언어·영어 아닌 라틴 언어·아랍어
  for (const code of ["ja", "es", "ar"]) {
    const identity = conversationPartnerIdentity(code, "m");
    assert.ok(identity.includes(personaBrief(code, "m")), `${code} identity carries the persona`);
  }
  assert.match(conversationPartnerIdentity("ar", "f"), /Modern Standard Arabic/);
});

test("튜터 목소리 이름으로 누구인지 찾는다 — 장면 목소리는 null", () => {
  for (const code of CODES) {
    assert.equal(tutorGenderOfVoice(code, tutorVoice(code, "f")), "f", code);
    assert.equal(tutorGenderOfVoice(code, tutorVoice(code, "m")), "m", code);
  }
  assert.equal(tutorGenderOfVoice("en", "fable"), null);
});
