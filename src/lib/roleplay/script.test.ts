import assert from "node:assert/strict";
import test from "node:test";
import { realtimeCallVoice } from "../realtimeCallSession.ts";
import { SCENARIOS, findScenario } from "./catalog.ts";
import {
  consecutiveLearnerTurns,
  duplicateStepIds,
  tutorLineAudioPath,
  tutorLines,
} from "./script.ts";

/**
 * Voices gpt-4o-mini-tts accepts, from OpenAI's text-to-speech guide.
 *
 * Held here because the scripted lines and the live tutor have to be the same
 * person: a scenario's audio is synthesised through the TTS model while the
 * tutor that interrupts it speaks through the realtime one, and a voice only
 * one of them supports would change who is talking mid-conversation.
 */
const TTS_VOICES = [
  "alloy", "ash", "ballad", "coral", "echo", "fable",
  "nova", "onyx", "sage", "shimmer", "verse", "marin", "cedar",
];

test("the call's voice is one the scripted lines can also be spoken in", () => {
  for (const language of ["en", "ko", "ja", "vi"] as const) {
    const voice = realtimeCallVoice(language);
    assert.ok(
      TTS_VOICES.includes(voice),
      `${language} calls use "${voice}", which gpt-4o-mini-tts cannot speak — the scripted half of a conversation would change voice`,
    );
  }
});

test("every scenario has unique step ids", () => {
  // Audio is stored per line id, so a duplicate silently overwrites a recording.
  for (const scenario of SCENARIOS) {
    assert.deepEqual(
      duplicateStepIds(scenario),
      [],
      `${scenario.id} repeats a step id`,
    );
  }
});

test("no scenario asks the learner to speak twice in a row", () => {
  // The second turn would be spoken into silence, which reads as a crash.
  for (const scenario of SCENARIOS) {
    assert.deepEqual(
      consecutiveLearnerTurns(scenario),
      [],
      `${scenario.id} has back-to-back learner turns`,
    );
  }
});

test("a scenario opens and closes with the tutor", () => {
  for (const scenario of SCENARIOS) {
    assert.equal(scenario.steps.at(0)?.type, "tutor", `${scenario.id} opening`);
    assert.equal(scenario.steps.at(-1)?.type, "tutor", `${scenario.id} closing`);
  }
});

test("every learner turn offers more than one way to be right", () => {
  // A single accepted phrasing teaches recitation. People say the same thing
  // several ways and the scenario has to know that before the live tutor is
  // woken to explain why a perfectly good answer was refused.
  for (const scenario of SCENARIOS) {
    for (const step of scenario.steps) {
      if (step.type !== "learner") continue;
      assert.ok(
        step.accept.length >= 2,
        `${scenario.id}/${step.id} accepts only ${step.accept.length}`,
      );
      assert.ok(step.goal.length > 0, `${scenario.id}/${step.id} has no goal`);
    }
  }
});

test("every tutor line carries text to synthesise and a place to keep it", () => {
  for (const scenario of SCENARIOS) {
    const lines = tutorLines(scenario);
    assert.ok(lines.length > 0, `${scenario.id} has no spoken lines`);
    const paths = new Set<string>();
    for (const line of lines) {
      assert.ok(line.text.trim().length > 0, `${scenario.id}/${line.id} is empty`);
      const path = tutorLineAudioPath(scenario, line);
      assert.ok(!paths.has(path), `${path} is claimed twice`);
      paths.add(path);
    }
  }
});

test("audio paths are scoped by language and scenario", () => {
  // Two scenarios may both have a "greet" line; their files must not collide.
  const scenario = findScenario("cafe-order");
  assert.ok(scenario);
  const [first] = tutorLines(scenario);
  assert.ok(first);
  assert.equal(
    tutorLineAudioPath(scenario, first),
    `/roleplay/en/cafe-order/${first.id}.pcm`,
  );
});

test("the setting is written for the tutor that gets woken, not for the learner", () => {
  // It is handed to the live model as context, so it has to say where this is
  // and who each side is rather than being a title.
  for (const scenario of SCENARIOS) {
    assert.ok(
      scenario.setting.length > 60,
      `${scenario.id} setting is too thin to orient a tutor arriving mid-scene`,
    );
    assert.ok(scenario.tutorRole.length > 0, `${scenario.id} has no tutor role`);
  }
});
