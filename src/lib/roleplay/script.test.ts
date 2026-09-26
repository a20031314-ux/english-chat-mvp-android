import assert from "node:assert/strict";
import test from "node:test";
import { realtimeCallVoice } from "../realtimeCallSession.ts";
import { judge } from "./session.ts";
import { SCENARIOS, findScenario, scenariosForLanguage, sentencesFor } from "./catalog.ts";
import { SUPPORTED_LEARNING_LANGUAGES } from "../learningLanguages.ts";
import {
  danglingTargets,
  hasEnding,
  isLearnerNode,
  learnerFollowedByLearner,
  sentenceAudioPath,
  sentenceIdsUsed,
  unreachableNodes,
} from "./script.ts";
import { SITUATIONS, situationForScenario } from "./situations.ts";
import { TTS_VOICES } from "./voices.ts";

test("every scene is read in a voice the speech model has", () => {
  for (const scenario of SCENARIOS) {
    assert.ok(
      (TTS_VOICES as readonly string[]).includes(scenario.voice),
      `${scenario.id} is written for "${scenario.voice}", which gpt-4o-mini-tts cannot speak`,
    );
  }
  // The chat's spoken lines still go out through /api/tts in the call's voice
  // for the language; only a roleplay passes a voice of its own.
  for (const language of ["en", "ko", "ja", "vi"] as const) {
    const voice = realtimeCallVoice(language);
    assert.ok(
      (TTS_VOICES as readonly string[]).includes(voice),
      `${language} calls use "${voice}", which gpt-4o-mini-tts cannot speak`,
    );
  }
});

test("the catalog does not sound like one employee", () => {
  // The reason the scenarios stopped sharing the call's voice. Not "all
  // distinct" — thirteen voices will not cover thirty scenarios, and two cafés
  // may reasonably share a barista — but enough that a learner can tell a taxi
  // driver from a hotel receptionist.
  const voices = new Set(SCENARIOS.map((scenario) => scenario.voice));
  const wanted = Math.min(SCENARIOS.length, 5);
  assert.ok(
    voices.size >= wanted,
    `${SCENARIOS.length} scenarios share only ${voices.size} voice(s)`,
  );
});

test("nothing points at a node that does not exist", () => {
  for (const scenario of SCENARIOS) {
    assert.deepEqual(danglingTargets(scenario), [], `${scenario.id}`);
  }
});

test("every node can be reached from the start", () => {
  // An unreachable node is a line someone wrote, recorded, and nobody hears.
  for (const scenario of SCENARIOS) {
    assert.deepEqual(unreachableNodes(scenario), [], `${scenario.id}`);
  }
});

test("some path through every scenario ends", () => {
  // A graph with no exit is a conversation the learner cannot finish.
  for (const scenario of SCENARIOS) {
    assert.ok(hasEnding(scenario), `${scenario.id} never ends`);
  }
});

test("the learner is never asked to speak twice with nothing in between", () => {
  for (const scenario of SCENARIOS) {
    assert.deepEqual(learnerFollowedByLearner(scenario), [], `${scenario.id}`);
  }
});

test("every sentence a scenario asks for exists in its language's bank", () => {
  for (const scenario of SCENARIOS) {
    const bank = sentencesFor(scenario.language);
    for (const id of sentenceIdsUsed(scenario)) {
      assert.ok(bank[id], `${scenario.id} wants "${id}", which is not written`);
      assert.ok(bank[id]!.text.trim().length > 0, `"${id}" is empty`);
    }
  }
});

test("every learner node offers more than one way to be right", () => {
  // A single accepted phrasing teaches recitation, and would wake the tutor to
  // explain why a perfectly good sentence was refused.
  for (const scenario of SCENARIOS) {
    for (const node of Object.values(scenario.nodes)) {
      if (!isLearnerNode(node)) continue;
      const phrasings = node.expect.flatMap((branch) => branch.match);
      assert.ok(
        phrasings.length >= 2,
        `${scenario.id}/${node.id} accepts only ${phrasings.length}`,
      );
      assert.ok(node.goal.length > 0, `${scenario.id}/${node.id} has no goal`);
      assert.ok(node.expect.length > 0, `${scenario.id}/${node.id} has no branch`);
    }
  }
});

test("a scenario keeps some of its misses off the tutor", () => {
  // The arrangement in miniature: the script covers what it can, and waking a
  // live tutor for every mumble would be paying call rates for "sorry?".
  const scenario = findScenario("cafe-order");
  assert.ok(scenario);
  const learners = Object.values(scenario.nodes).filter(isLearnerNode);
  const recovered = learners.filter((node) => node.onMiss);
  assert.ok(
    recovered.length > 0,
    "no learner node has a scripted recovery, so every mumble costs a call",
  );
});

test("the same sentence is one audio file wherever it is said", () => {
  // The reason sentences live apart from scenarios at all.
  const a = sentenceAudioPath("What size?", "ash", "en");
  const b = sentenceAudioPath("  What size?  ", "ash", "en");
  assert.equal(a, b, "surrounding space should not make a second recording");
  assert.notEqual(a, sentenceAudioPath("What size?", "cedar", "en"));
  assert.notEqual(a, sentenceAudioPath("What size?", "ash", "ko"));
  assert.notEqual(a, sentenceAudioPath("What sizes?", "ash", "en"));
});

test("changing a sentence changes where its audio lives", () => {
  // Otherwise an edit would leave every learner hearing the old recording.
  const before = sentenceAudioPath("For here or to go?", "ash", "en");
  const after = sentenceAudioPath("For here, or to go?", "ash", "en");
  assert.notEqual(before, after);
  assert.match(after, /^\/roleplay\/audio\/en\/[a-z0-9]+\.mp3$/);
});

test("the setting is written for the tutor that gets woken", () => {
  for (const scenario of SCENARIOS) {
    assert.ok(
      scenario.setting.length > 60,
      `${scenario.id} setting is too thin to orient a tutor arriving mid-scene`,
    );
    assert.ok(scenario.tutorRole.length > 0, `${scenario.id} has no tutor role`);
  }
});

test("a branch can rejoin the line it came from", () => {
  // What makes coverage affordable: sentences grow with the number of branches
  // while paths grow with their product, because branches come back.
  const scenario = findScenario("cafe-order");
  assert.ok(scenario);
  const milk = scenario.nodes["milk-answer"];
  assert.ok(milk && milk.type === "tutor");
  assert.equal(milk.next, "order", "the milk answer should return to the order");
});

test("the situation list is briefs, and every field earns its place", () => {
  // These are drafted from and reviewed against, so a thin brief becomes a thin
  // scenario. The trouble note especially: a drafter cannot guess where a
  // conversation goes wrong, and a reviewer should not have to rediscover it.
  const ids = new Set<string>();
  for (const situation of SITUATIONS) {
    assert.ok(!ids.has(situation.id), `${situation.id} is listed twice`);
    ids.add(situation.id);
    assert.ok(situation.setting.length > 60, `${situation.id} setting is thin`);
    assert.ok(situation.objective.length > 20, `${situation.id} objective is thin`);
    assert.ok(
      situation.likelyTrouble.length > 20,
      `${situation.id} does not say where it goes wrong`,
    );
    assert.ok(situation.tutorRole.length > 0, `${situation.id} has no role`);
  }
});

test("every written scenario traces back to a situation on the list", () => {
  // Otherwise the list stops describing what exists and starts being decoration.
  for (const scenario of SCENARIOS) {
    assert.ok(
      situationForScenario(scenario.id),
      `${scenario.id} is written but not on the situation list`,
    );
  }
});

test("a written correction is accepted by the node that offers it", () => {
  // The failure this catches is quiet and cruel: a correction hands the learner
  // a sentence, they say it, and the same node refuses it — so the one rung of
  // the ladder that was supposed to be free sends them round again, or to a
  // call. Checked at the strictest setting, because that is where the margin is
  // thinnest and the learner most likely to be at the top of the dial.
  const STRICTEST = 0.8;
  for (const scenario of SCENARIOS) {
    const bank = sentencesFor(scenario.language);
    for (const node of Object.values(scenario.nodes)) {
      if (!isLearnerNode(node) || !node.correction) continue;
      const spoken = bank[node.correction]?.text ?? "";
      assert.ok(
        judge(node, spoken, STRICTEST, []),
        `${scenario.id}/${node.id} suggests "${spoken}", which it would then refuse`,
      );
    }
  }
});

test("a yes-or-no question accepts a yes", () => {
  // The bug this guards was reported from a real session: the driver asks "is
  // that alright?" and the only accepted phrasing was "that's fine". Every
  // ordinary answer — yes, sure, okay, it's ok — was heard as a miss, so the
  // learner was corrected for answering correctly.
  //
  // Only the turns that actually ask something answerable with a yes. A node
  // asking "small or large?" is right to refuse one.
  const yesNo: [string, string][] = [
    ["shop-size", "try-answer"],
    ["taxi", "route-answer"],
    ["hotel-checkin", "id-answer"],
  ];
  for (const [scenarioId, nodeId] of yesNo) {
    const scenario = findScenario(scenarioId);
    const node = scenario?.nodes[nodeId];
    assert.ok(scenario && node && isLearnerNode(node), `${scenarioId}/${nodeId}`);
    for (const said of ["yes", "sure", "okay"]) {
      assert.ok(
        judge(node, said, 0.8, []),
        `${scenarioId}/${nodeId} refuses "${said}"`,
      );
    }
  }
});

test("widening a node did not let its side question through", () => {
  // Accepting fragments makes the main branch easier to hit, which is exactly
  // what could swallow a question that has its own answer. Ties keep the
  // earlier branch, so the specific ones are written first and this checks the
  // arrangement still holds.
  const routes: [string, string, string, string][] = [
    ["cafe-order", "order", "do you have oat milk", "milk-answer"],
    ["restaurant-order", "order", "what is in the chicken", "dish-answer"],
    ["restaurant-order", "order", "the chicken please", "sides"],
    ["shop-size", "ask-size", "how much is this", "price-answer"],
    ["taxi", "destination", "how much is it to the station", "price-answer"],
    ["taxi", "destination", "the airport please", "route"],
    ["hotel-checkin", "id-answer", "do you need my passport", "id-repeat"],
    ["introducing-yourself", "job", "do you know many people here", "host-answer"],
  ];
  for (const [scenarioId, nodeId, said, expected] of routes) {
    const scenario = findScenario(scenarioId);
    const node = scenario?.nodes[nodeId];
    assert.ok(scenario && node && isLearnerNode(node), `${scenarioId}/${nodeId}`);
    for (const strictness of [0.4, 0.6, 0.8]) {
      assert.equal(
        judge(node, said, strictness, [])?.go,
        expected,
        `${scenarioId}/${nodeId} at ${strictness}: "${said}"`,
      );
    }
  }
});

test("every language the app teaches has something to talk to", () => {
  // The hole this fills: calling used to be a realtime call reached from the
  // chat screen, which worked in any language, and the scripted tab only ever
  // spoke English. Folding them together without this would have left everyone
  // learning anything else with no way to speak at all.
  for (const language of SUPPORTED_LEARNING_LANGUAGES) {
    const scenarios = scenariosForLanguage(language.code);
    assert.ok(
      scenarios.length > 0,
      `${language.code} has no scenario, so its tab is hidden and nothing replaces it`,
    );
    assert.ok(
      scenarios.some((scenario) => scenario.openEnded),
      `${language.code} has no open conversation, only errands`,
    );
  }
});

test("the tab is the same product whatever you are learning", () => {
  // The reason the scripted errands are not offered yet: they exist in English
  // and nowhere else, so offering them where they happen to exist would make
  // this a list of scenes for one language and a single conversation for the
  // other thirteen. Everyone gets the same thing until everyone can.
  const offered = SUPPORTED_LEARNING_LANGUAGES.map((language) =>
    scenariosForLanguage(language.code).map((scenario) => scenario.title).length,
  );
  assert.deepEqual(
    [...new Set(offered)],
    [1],
    `languages are offered different numbers of scenes: ${offered.join(", ")}`,
  );
});

test("an open conversation is scripted only at its ends", () => {
  // What makes it affordable in fourteen languages: two recorded lines each.
  // Everything between them is the character, spoken in the same voice.
  for (const scenario of SCENARIOS) {
    if (!scenario.openEnded) continue;
    assert.equal(
      sentenceIdsUsed(scenario).length,
      2,
      `${scenario.id} records more than a greeting and a goodbye`,
    );
  }
});

test("a repertoire line ships as words, not as a file", () => {
  // scripts/build-roleplay-audio.mjs records sentenceIdsUsed and nothing else,
  // so a repertoire line has no recording inside the app and is spoken through
  // the TTS route instead. RoleplayScreen leans on exactly that when it fetches
  // the second half of a turn while the first half is playing: a line that did
  // ship as a file would be paid for a synthesis it never needed.
  for (const scenario of SCENARIOS) {
    const recorded = new Set(sentenceIdsUsed(scenario));
    for (const id of scenario.repertoire ?? []) {
      assert.ok(
        !recorded.has(id),
        `${scenario.id}: ${id} is both recorded and offered as words`,
      );
    }
  }
});

test("an open conversation is not offered the bank's lines", () => {
  // The product decision, kept where it can be seen rather than only in a
  // constant. Measured twice with a model judging fit: the bank led sixteen
  // turns and five did not answer what was said, against none of the eight the
  // character wrote itself. Everything that acts on a repertoire still works —
  // this is the offer being withdrawn, not the machinery (justTalk.ts).
  for (const scenario of SCENARIOS) {
    if (!scenario.openEnded) continue;
    assert.deepEqual(
      scenario.repertoire ?? [],
      [],
      `${scenario.id} is offering lines again; if that is meant, this test should say so`,
    );
  }
});

test("the lines themselves are still written down", () => {
  // Withdrawn from the brief, not deleted. They were drafted, reviewed by a
  // model that did not write them, and corrected by hand; a scripted step is
  // where one ready line really is a whole turn, and they are waiting for it.
  const english = Object.keys(sentencesFor("en")).filter((id) => id.startsWith("talk."));
  const japanese = Object.keys(sentencesFor("ja")).filter((id) => id.startsWith("talk."));
  assert.equal(english.length, 53);
  assert.equal(japanese.length, 53);
});
