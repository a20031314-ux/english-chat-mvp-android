import { realtimeCallVoice } from "../realtimeCallSession.ts";
import {
  applyTurn,
  settingsForLevel,
  startingDifficulty,
  type DifficultyState,
  type TurnOutcome,
} from "./difficulty.ts";
import {
  isLearnerNode,
  isTutorNode,
  sentenceAudioPath,
  type LearnerNode,
  type RoleplayScenario,
  type SentenceBank,
} from "./script.ts";

/**
 * Walking a scenario.
 *
 * Pure: it says what should happen next and never does it. Playing audio,
 * capturing speech and waking the live tutor are the caller's, which is what
 * lets the part that decides — which branch was taken, when a retry is a retry,
 * when the script has run out — be exercised without a microphone.
 *
 * The shape mirrors the call transcript's reader: hand it what happened, take
 * back what to do.
 */

/** What the caller should do next. */
export type Instruction =
  | {
      do: "say";
      text: string;
      translation?: string;
      /** Where the pre-generated audio for this line lives. */
      audioPath: string;
    }
  | {
      do: "listen";
      goal: string;
      /** Present only when the difficulty dial is low enough to offer it. */
      hint?: string;
    }
  | {
      do: "wakeTutor";
      /**
       * Everything the live tutor needs to arrive knowing where it is. It has
       * been silent until now, so nothing about the scene is in its context.
       */
      context: {
        setting: string;
        tutorRole: string;
        goal: string;
        heard: string;
      };
    }
  | { do: "finish" };

export type SessionState = {
  scenarioId: string;
  nodeId: string;
  difficulty: DifficultyState;
  /** Tries on the current learner node. Reset on arrival at a new one. */
  attempts: number;
  /** Whether a hint has been shown for the current node. */
  hintShown: boolean;
  /** When the current listen began, so hesitation can be measured. */
  listeningSince: number | null;
  finished: boolean;
};

export function startSession(
  scenario: RoleplayScenario,
  level?: number,
): SessionState {
  return {
    scenarioId: scenario.id,
    nodeId: scenario.start,
    difficulty: startingDifficulty(level),
    attempts: 0,
    hintShown: false,
    listeningSince: null,
    finished: false,
  };
}

/** Strip everything that is not a word, so punctuation cannot fail a match. */
function normalize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * How much of a phrasing is present in what was heard, 0 to 1.
 *
 * Containment rather than similarity: the entries in `match` are the part that
 * matters — "can I get a coffee" — and a learner who says it with "please" on
 * the end has not said something less correct. Comparing whole strings would
 * punish them for being polite.
 *
 * Deliberately not a model. A wrong answer here costs a scripted retry or, at
 * worst, a tutor who explains something the learner already knew; paying for a
 * judgement on every turn to avoid that is the wrong trade. The seam is here if
 * that turns out to be false.
 */
export function phraseScore(phrase: string, heard: string): number {
  const wanted = normalize(phrase);
  if (wanted.length === 0) return 0;
  const said = new Set(normalize(heard));
  const hits = wanted.filter((word) => said.has(word)).length;
  return hits / wanted.length;
}

/** The best-scoring branch, and whether it clears the current strictness. */
export function judge(
  node: LearnerNode,
  heard: string,
  strictness: number,
): { go: string; score: number } | null {
  let best: { go: string; score: number } | null = null;
  // Branches are checked in order and ties keep the earlier one, so a scenario
  // can put the specific before the general and rely on it.
  for (const branch of node.expect) {
    for (const phrase of branch.match) {
      const score = phraseScore(phrase, heard);
      if (!best || score > best.score) best = { go: branch.go, score };
    }
  }
  if (!best || best.score < strictness) return null;
  return best;
}

function instructionFor(
  scenario: RoleplayScenario,
  bank: SentenceBank,
  state: SessionState,
): Instruction {
  if (state.finished) return { do: "finish" };
  const node = scenario.nodes[state.nodeId];
  if (!node) return { do: "finish" };
  if (isTutorNode(node)) {
    const sentence = bank[node.say];
    // A missing sentence is a content bug the tests catch; ending is better
    // than playing silence at someone.
    if (!sentence) return { do: "finish" };
    return {
      do: "say",
      text: sentence.text,
      translation: sentence.translation,
      audioPath: sentenceAudioPath(
        sentence.text,
        realtimeCallVoice(scenario.language),
        scenario.language,
      ),
    };
  }
  const settings = settingsForLevel(state.difficulty.level);
  return {
    do: "listen",
    goal: node.goal,
    // The hint is held back until they have actually missed once: offering it
    // up front answers the question before it has been asked.
    ...(settings.showHints && node.hint && state.attempts > 0
      ? { hint: node.hint }
      : {}),
  };
}

/** What to do at the current node, without changing anything. */
export function currentInstruction(
  scenario: RoleplayScenario,
  bank: SentenceBank,
  state: SessionState,
): Instruction {
  return instructionFor(scenario, bank, state);
}

/**
 * Move on from a tutor line that has finished playing.
 *
 * Separate from answering, because these are different events: one is audio
 * ending, the other is a person speaking, and folding them together made it
 * impossible to say when the listening actually began.
 */
export function afterSaying(
  scenario: RoleplayScenario,
  bank: SentenceBank,
  state: SessionState,
  now: number,
): { state: SessionState; instruction: Instruction } {
  const node = scenario.nodes[state.nodeId];
  if (!node || !isTutorNode(node)) {
    return { state, instruction: currentInstruction(scenario, bank, state) };
  }
  if (node.next === null) {
    const finished = { ...state, finished: true };
    return { state: finished, instruction: { do: "finish" } };
  }
  const next = scenario.nodes[node.next];
  const arriving = isLearnerNode(next!)
    ? // A learner node reached from elsewhere is a fresh question; one reached
      // from its own retry line is the same question again, so attempts carry.
      state.nodeId === next.onMiss || node.next === state.nodeId
      ? state
      : { ...state, attempts: 0, hintShown: false }
    : state;
  const moved: SessionState = {
    ...arriving,
    nodeId: node.next,
    listeningSince: next && isLearnerNode(next) ? now : null,
  };
  return { state: moved, instruction: currentInstruction(scenario, bank, moved) };
}

export type SubmitResult = {
  state: SessionState;
  instruction: Instruction;
  /** Whether the answer was accepted for this turn. */
  matched: boolean;
  /** Whether the level moved as a result. Usually not worth showing. */
  difficultyChanged: boolean;
};

/**
 * Take what the learner said and move.
 *
 * A miss goes to the scripted recovery when the node has one, and wakes the
 * live tutor when it does not or when patience has run out. That is the whole
 * arrangement: the script handles what it can, cheaply, and a person is what
 * happens at the edges.
 */
export function submitSpeech(
  scenario: RoleplayScenario,
  bank: SentenceBank,
  state: SessionState,
  heard: string,
  now: number,
): SubmitResult {
  const node = scenario.nodes[state.nodeId];
  if (!node || !isLearnerNode(node)) {
    return {
      state,
      instruction: currentInstruction(scenario, bank, state),
      matched: false,
      difficultyChanged: false,
    };
  }

  const settings = settingsForLevel(state.difficulty.level);
  const hit = judge(node, heard, settings.matchStrictness);
  const attempts = state.attempts + 1;
  const hesitationMs = state.listeningSince ? now - state.listeningSince : 0;
  const outOfPatience = !hit && attempts >= settings.tutorPatienceAttempts;
  const wakingTutor = !hit && (!node.onMiss || outOfPatience);

  const outcome: TurnOutcome = {
    matched: Boolean(hit),
    attempts,
    usedHint: state.hintShown,
    wokeTutor: wakingTutor,
    hesitationMs,
  };
  const adjusted = applyTurn(state.difficulty, outcome);

  if (hit) {
    const moved: SessionState = {
      ...state,
      nodeId: hit.go,
      difficulty: adjusted.state,
      attempts: 0,
      hintShown: false,
      listeningSince: null,
    };
    return {
      state: moved,
      instruction: currentInstruction(scenario, bank, moved),
      matched: true,
      difficultyChanged: adjusted.changed,
    };
  }

  if (wakingTutor) {
    // The node is not left: after the tutor has helped, the learner answers the
    // same question. Attempts are kept so a second miss is still a second miss.
    const held: SessionState = {
      ...state,
      difficulty: adjusted.state,
      attempts,
      listeningSince: null,
    };
    return {
      state: held,
      instruction: {
        do: "wakeTutor",
        context: {
          setting: scenario.setting,
          tutorRole: scenario.tutorRole,
          goal: node.goal,
          heard,
        },
      },
      matched: false,
      difficultyChanged: adjusted.changed,
    };
  }

  const recovering: SessionState = {
    ...state,
    nodeId: node.onMiss!,
    difficulty: adjusted.state,
    attempts,
    hintShown: settingsForLevel(adjusted.state.level).showHints,
    listeningSince: null,
  };
  return {
    state: recovering,
    instruction: currentInstruction(scenario, bank, recovering),
    matched: false,
    difficultyChanged: adjusted.changed,
  };
}

/** Carry on at the same question once the live tutor has finished helping. */
export function afterTutor(
  scenario: RoleplayScenario,
  bank: SentenceBank,
  state: SessionState,
  now: number,
): { state: SessionState; instruction: Instruction } {
  const listening: SessionState = { ...state, listeningSince: now };
  return {
    state: listening,
    instruction: currentInstruction(scenario, bank, listening),
  };
}

/**
 * What to hand the live tutor when it is woken mid-scene.
 *
 * It has heard nothing: the scripted half of the conversation happened as audio
 * files, and the realtime session is being opened for the first time right now.
 * So everything it needs has to arrive in one message — where it is, who it is,
 * what the learner was trying to do, and what they actually said.
 *
 * `ask` is deliberately narrow. The tutor is being called for one stuck turn,
 * not taking over the scenario, and a tutor that starts a conversation here
 * leaves the learner somewhere the script cannot pick up again.
 */
export function tutorHandover(
  context: Extract<Instruction, { do: "wakeTutor" }>["context"],
  languageName: string,
): { scene: string; ask: string } {
  return {
    scene: [
      `<scene>`,
      `You are already in this conversation, playing the ${context.tutorRole}.`,
      context.setting,
      `The learner was trying to: ${context.goal}`,
      `They just said: "${context.heard}"`,
      `It did not fit, and they are stuck.`,
      `</scene>`,
    ].join("\n"),
    ask:
      `Help with this one turn, in ${languageName}, in a sentence or two. ` +
      `Stay the ${context.tutorRole} — do not explain that you are a tutor or that this is practice. ` +
      `Say what they could have said, then hand the turn straight back. ` +
      `Do not read the tags aloud and do not start a new conversation.`,
  };
}
