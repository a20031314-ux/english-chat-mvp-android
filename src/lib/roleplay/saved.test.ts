import assert from "node:assert/strict";
import test from "node:test";
import { findScenario, sentencesFor } from "./catalog.ts";
import { afterSaying, currentInstruction, startSession } from "./session.ts";
import type { SessionState } from "./session.ts";
import type { TranscriptLine } from "./review.ts";
import {
  MAX_SAVED_CONVERSATIONS,
  isUnfinished,
  normalizeSaved,
  readSaved,
  removeSaved,
  resumableFor,
  resumeFrom,
  stateToResume,
  titleFor,
  upsertSaved,
  writeSaved,
  type SavedConversation,
} from "./saved.ts";

const open = findScenario("open-talk-en")!;

function conversation(partial: Partial<SavedConversation> = {}): SavedConversation {
  return {
    id: "c1",
    scenarioId: open.id,
    language: "en",
    title: "i went to busan",
    startedAt: 1000,
    updatedAt: 2000,
    state: startSession(open),
    said: [],
    memory: { text: "", upTo: 0 },
    ...partial,
  };
}

/** A tiny stand-in for localStorage, which node has no opinion about. */
function store(initial: Record<string, string> = {}): Storage {
  const rows = new Map(Object.entries(initial));
  return {
    get length() {
      return rows.size;
    },
    clear: () => rows.clear(),
    getItem: (key: string) => rows.get(key) ?? null,
    key: (index: number) => [...rows.keys()][index] ?? null,
    removeItem: (key: string) => void rows.delete(key),
    setItem: (key: string, value: string) => void rows.set(key, value),
  } as Storage;
}

test("a conversation is named after the first thing they said", () => {
  // The character's opening line is the same every time and names nothing, so
  // a list titled by it would be a column of one title repeated.
  const said: TranscriptLine[] = [
    { who: "tutor", text: "Hey! Good to see you. How's your day going?" },
    { who: "learner", text: "i went to busan last weekend" },
  ];
  assert.equal(titleFor(said, "Just talk"), "i went to busan last weekend");
});

test("a conversation nobody spoke in keeps the scene's name", () => {
  assert.equal(titleFor([], "Just talk"), "Just talk");
  // "…" is what an unusable turn is shown as; it is not a title.
  assert.equal(titleFor([{ who: "learner", text: "…" }], "Just talk"), "Just talk");
});

test("finished and put down are different things", () => {
  // One can be carried on and the other can only be read, and the door has to
  // tell them apart to know what to offer.
  assert.ok(isUnfinished(conversation()));
  assert.ok(!isUnfinished(conversation({ finishedAt: 3000 })));
  const ended: SessionState = { ...startSession(open), finished: true };
  assert.ok(!isUnfinished(conversation({ state: ended })));
});

test("the scene carries on with the most recent one it could", () => {
  const list = [
    conversation({ id: "old", updatedAt: 1 }),
    conversation({ id: "new", updatedAt: 9 }),
    conversation({ id: "done", updatedAt: 99, finishedAt: 100 }),
    conversation({ id: "elsewhere", updatedAt: 999, scenarioId: "cafe-order" }),
  ];
  assert.equal(resumableFor(list, open.id)?.id, "new");
  assert.equal(resumableFor(list, "cafe-order")?.id, "elsewhere");
  assert.equal(resumableFor([], open.id), null);
});

test("resuming does not resume the middle of a turn", () => {
  // A queue is lines the character had not finished saying and pending is a
  // turn already sent; neither survives the screen going away, and putting the
  // learner back into one would have them waiting on something that is gone.
  const mid: SessionState = {
    ...startSession(open),
    queue: [{ text: "That sounds great." }],
    pending: { heard: "i went to busan", attempts: 1, hesitationMs: 0 },
    listeningSince: 12345,
  };
  const resumed = stateToResume(mid);
  assert.deepEqual(resumed.queue, []);
  assert.equal(resumed.pending, null);
  assert.equal(resumed.listeningSince, null);
  assert.equal(resumed.nodeId, mid.nodeId, "but it is the same conversation");
  assert.deepEqual(resumed.history, mid.history);
});

test("writing the same conversation again replaces it rather than piling up", () => {
  const first = conversation({ updatedAt: 1 });
  const later = conversation({ updatedAt: 2, title: "and then busan" });
  const list = upsertSaved(upsertSaved([], first), later);
  assert.equal(list.length, 1);
  assert.equal(list[0]!.title, "and then busan");
});

test("only so many are kept, and it is the oldest that goes", () => {
  let list: SavedConversation[] = [];
  for (let i = 0; i < MAX_SAVED_CONVERSATIONS + 5; i += 1) {
    list = upsertSaved(list, conversation({ id: `c${i}`, updatedAt: i }));
  }
  assert.equal(list.length, MAX_SAVED_CONVERSATIONS);
  assert.equal(list[0]!.id, `c${MAX_SAVED_CONVERSATIONS + 4}`, "newest first");
  assert.ok(!list.some((row) => row.id === "c0"), "the oldest is the one dropped");
});

test("a row that is not the shape this expects is dropped, not half-read", () => {
  // Storage outlives builds. A row written by an older one, or edited by hand,
  // goes back into the state machine if it is believed — so it is checked.
  assert.equal(normalizeSaved(null), null);
  assert.equal(normalizeSaved({ id: "c1" }), null);
  assert.equal(normalizeSaved({ ...conversation(), state: { nodeId: 1 } }), null);
  assert.equal(normalizeSaved({ ...conversation(), said: "nope" }), null);
  assert.ok(normalizeSaved(JSON.parse(JSON.stringify(conversation()))));
});

test("notes that did not survive the trip do not break the conversation", () => {
  const row = normalizeSaved({ ...JSON.parse(JSON.stringify(conversation())), memory: 7 });
  assert.deepEqual(row?.memory, { text: "", upTo: 0 });
});

test("a conversation survives being written and read back", () => {
  const disk = store();
  const said: TranscriptLine[] = [
    { who: "tutor", text: "Hey!" },
    { who: "learner", text: "hi", better: "Hi there!" },
  ];
  writeSaved(disk, [conversation({ said })]);
  const back = readSaved(disk);
  assert.equal(back.length, 1);
  assert.deepEqual(back[0]!.said, said, "the marks under their line come back too");
});

test("unreadable storage is the same as none", () => {
  // Losing the list is not worth a broken tab: the conversation on screen is
  // still the conversation.
  assert.deepEqual(readSaved(store({ roleplayConversations: "{not json" })), []);
  assert.deepEqual(readSaved(store({ roleplayConversations: '"a string"' })), []);
  assert.deepEqual(readSaved(null), []);
  assert.doesNotThrow(() => writeSaved(null, []));
});

test("removing one leaves the rest", () => {
  const list = [conversation({ id: "a" }), conversation({ id: "b" })];
  assert.deepEqual(
    removeSaved(list, "a").map((row) => row.id),
    ["b"],
  );
});

test("a conversation closed on its greeting does not greet again", () => {
  // Reported from a phone: three conversations opened as one, hello, hello,
  // hello. A line goes into the transcript when it starts being said and the
  // state moves past it only when the audio ends, so closing during the
  // greeting — most of the two seconds it takes — saves a row whose transcript
  // has the line and whose state has not said it.
  const scenario = open;
  const bank = sentencesFor("en");
  const greeting = currentInstruction(scenario, bank, startSession(scenario));
  assert.equal(greeting.do, "say");
  const said: TranscriptLine[] = [{ who: "tutor", text: greeting.text! }];

  const { state, said: back } = resumeFrom(
    conversation({ state: startSession(scenario), said }),
    scenario,
    bank,
    1000,
  );
  const next = currentInstruction(scenario, bank, state);
  assert.equal(next.do, "listen", "it is their turn, not the greeting again");
  assert.deepEqual(back, said, "and the transcript is left alone");
});

test("the line it skips is put into what the character remembers", () => {
  // The other half of the same disagreement: history is written by afterSaying
  // too, so a greeting the learner was shown but the state never committed was
  // invisible to the character. Catching the state up fixes both at once.
  const scenario = open;
  const bank = sentencesFor("en");
  const greeting = currentInstruction(scenario, bank, startSession(scenario));
  const { state } = resumeFrom(
    conversation({ state: startSession(scenario), said: [{ who: "tutor", text: greeting.text! }] }),
    scenario,
    bank,
    1000,
  );
  assert.equal(state.history.at(-1)?.text, greeting.text);
});

test("a conversation that got past the greeting resumes where it stood", () => {
  // The common case must not be disturbed: nothing is skipped when the
  // transcript and the state already agree.
  const scenario = open;
  const bank = sentencesFor("en");
  let state = startSession(scenario);
  state = afterSaying(scenario, bank, state, 0).state; // the greeting finished
  const said: TranscriptLine[] = [
    { who: "tutor", text: "Hey! Good to see you. How's your day going?" },
    { who: "learner", text: "pretty good" },
  ];
  const resumed = resumeFrom(conversation({ state, said }), scenario, bank, 1000);
  assert.equal(resumed.state.nodeId, state.nodeId);
  assert.deepEqual(resumed.state.history, state.history, "nothing added twice");
});
