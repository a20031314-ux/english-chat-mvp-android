import {
  applyTurn,
  settingsForLevel,
  startingDifficulty,
  type DifficultyState,
  type TurnOutcome,
} from "./difficulty.ts";
import {
  questionFor,
  type Direction,
  type DirectorRequest,
  type SpokenLine,
} from "./director.ts";
import {
  isLearnerNode,
  isTutorNode,
  liveBranches,
  sentenceAudioPath,
  type LearnerNode,
  type RoleplayScenario,
  type SentenceBank,
} from "./script.ts";

/**
 * Walking a scenario.
 *
 * Pure: it says what should happen next and never does it. Playing audio,
 * capturing speech and asking the director are the caller's, which is what lets
 * the part that decides — which branch was taken, when a retry is a retry, when
 * the script has run out — be exercised without a microphone.
 *
 * The script goes first on every turn it can take. When it cannot, the turn is
 * handed to the director (director.ts), whose answer comes back through
 * `applyDirection` and is spoken like any other line. There is no correction
 * step and no button: from the learner's side the character simply answers.
 */

/** A line waiting to be spoken. Without `audioPath` it is synthesised in the scene's voice. */
export type QueuedLine = {
  text: string;
  translation?: string;
  audioPath?: string;
};

/** What the caller should do next. */
export type Instruction =
  | {
      do: "say";
      text: string;
      translation?: string;
      /**
       * Where the recorded audio for this line lives. Absent for a line the
       * director wrote just now, which the caller synthesises in `voice`.
       */
      audioPath?: string;
      voice: string;
    }
  | {
      do: "listen";
      /** Empty while the conversation is off the script: there is no task then. */
      goal: string;
      /** Present only when the difficulty dial is low enough to offer it. */
      hint?: string;
    }
  | {
      /** The script cannot take this turn. Ask the director, then `applyDirection`. */
      do: "direct";
      request: Omit<DirectorRequest, "targetLanguage" | "nativeLanguage">;
    }
  | { do: "finish" };

export type SessionState = {
  scenarioId: string;
  /**
   * The node the scenario is on. While the conversation is off the script this
   * stays on the learner step it will come back to.
   */
  nodeId: string;
  mode: "script" | "free";
  difficulty: DifficultyState;
  /** Tries on the current learner node. Reset on arrival at a new one. */
  attempts: number;
  /** Whether a hint has been shown for the current node. */
  hintShown: boolean;
  /** When the current listen began, so hesitation can be measured. */
  listeningSince: number | null;
  /** Branch targets already reached, so a rejoining side question is asked once. */
  visited: string[];
  /** Lines the director asked for, spoken before anything else happens. */
  queue: QueuedLine[];
  /** A turn waiting on the director, with what is needed to score it afterwards. */
  pending: { heard: string; attempts: number; hesitationMs: number } | null;
  /** Consecutive turns spent off the script. */
  freeTurns: number;
  /** Director turns this session. */
  directedTurns: number;
  /** What has been said, for the director to read. */
  history: SpokenLine[];
  /** The director has closed the conversation; finish once the queue is spoken. */
  closing: boolean;
  finished: boolean;
};

export function startSession(
  scenario: RoleplayScenario,
  level?: number,
): SessionState {
  return {
    scenarioId: scenario.id,
    nodeId: scenario.start,
    mode: "script",
    difficulty: startingDifficulty(level),
    attempts: 0,
    hintShown: false,
    listeningSince: null,
    visited: [],
    queue: [],
    pending: null,
    freeTurns: 0,
    directedTurns: 0,
    history: [],
    closing: false,
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

/** Sounds people make while thinking, which transcription writes down as words. */
const FILLERS = new Set(["um", "umm", "uh", "uhh", "er", "erm", "hmm", "hm", "mm", "mmm", "ah", "eh"]);

/**
 * Whether a turn had nothing in it but hesitation.
 *
 * Such a turn goes to the scene's recorded "sorry?" where it has one: asking the
 * director what to say to "mmm" buys nothing a recording does not already say.
 */
export function isMumble(heard: string): boolean {
  return normalize(heard).every((word) => FILLERS.has(word));
}

/**
 * How much of a phrasing is present in what was heard, 0 to 1.
 *
 * Containment rather than similarity: the entries in `match` are the part that
 * matters — "can I get a coffee" — and a learner who says it with "please" on
 * the end has not said something less correct. Comparing whole strings would
 * punish them for being polite.
 *
 * Deliberately not a model. A miss here is not a verdict any more — it hands the
 * turn to the director, who can still find the answer right — so this only has
 * to be good at the easy cases, and it is free and instant on those.
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
  visited: string[] = [],
): { go: string; score: number } | null {
  let best: { go: string; score: number } | null = null;
  // Branches are checked in order and ties keep the earlier one, so a scenario
  // can put the specific before the general and rely on it. A side question
  // already answered is not offered again, or it could be asked forever.
  for (const branch of liveBranches(node, visited)) {
    for (const phrase of branch.match) {
      const score = phraseScore(phrase, heard);
      if (!best || score > best.score) best = { go: branch.go, score };
    }
  }
  if (!best || best.score < strictness) return null;
  return best;
}

function recorded(
  scenario: RoleplayScenario,
  bank: SentenceBank,
  id: string,
): QueuedLine | null {
  const sentence = bank[id];
  if (!sentence) return null;
  return {
    text: sentence.text,
    translation: sentence.translation,
    audioPath: sentenceAudioPath(sentence.text, scenario.voice, scenario.language),
  };
}

function instructionFor(
  scenario: RoleplayScenario,
  bank: SentenceBank,
  state: SessionState,
): Instruction {
  if (state.finished) return { do: "finish" };
  const queued = state.queue[0];
  if (queued) return { do: "say", ...queued, voice: scenario.voice };
  if (state.closing) return { do: "finish" };
  if (state.pending) {
    return {
      do: "direct",
      request: {
        scenarioId: scenario.id,
        nodeId: state.nodeId,
        mode: state.mode,
        heard: state.pending.heard,
        history: state.history,
        freeTurns: state.freeTurns,
        directedTurns: state.directedTurns,
        level: state.difficulty.level,
      },
    };
  }
  const node = scenario.nodes[state.nodeId];
  if (!node) return { do: "finish" };
  if (isTutorNode(node)) {
    const line = recorded(scenario, bank, node.say);
    // A missing sentence is a content bug the tests catch; ending is better
    // than playing silence at someone.
    if (!line) return { do: "finish" };
    return { do: "say", ...line, voice: scenario.voice };
  }
  if (state.mode === "free") return { do: "listen", goal: "" };
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

function remember(history: SpokenLine[], line: SpokenLine): SpokenLine[] {
  return [...history, line];
}

/** Stamp the start of listening on a state that is about to listen. */
function listeningIfDue(
  scenario: RoleplayScenario,
  bank: SentenceBank,
  state: SessionState,
  now: number,
): { state: SessionState; instruction: Instruction } {
  const instruction = currentInstruction(scenario, bank, state);
  const stamped =
    instruction.do === "listen" ? { ...state, listeningSince: now } : state;
  return { state: stamped, instruction };
}

/**
 * Start the turn's clock again after the learner stopped to read a review.
 *
 * Hesitation is the silence from `listeningSince` to the moment they speak, so
 * time spent reading would otherwise be counted as struggling and pull the
 * level down under someone who stopped precisely because they wanted to
 * understand. The turn is not otherwise touched: the same question is still
 * being asked, and the attempts already spent on it still stand.
 */
export function resumeListening(
  scenario: RoleplayScenario,
  bank: SentenceBank,
  state: SessionState,
  now: number,
): { state: SessionState; instruction: Instruction } {
  return listeningIfDue(scenario, bank, state, now);
}

/**
 * Move on from a line that has finished playing.
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
  const queued = state.queue[0];
  if (queued) {
    const rest = state.queue.slice(1);
    const spoken: SessionState = {
      ...state,
      queue: rest,
      history: remember(state.history, { who: "tutor", text: queued.text }),
      finished: state.closing && rest.length === 0,
    };
    return listeningIfDue(scenario, bank, spoken, now);
  }

  const node = scenario.nodes[state.nodeId];
  if (!node || !isTutorNode(node)) {
    return { state, instruction: currentInstruction(scenario, bank, state) };
  }
  const said = bank[node.say];
  const history = said
    ? remember(state.history, { who: "tutor", text: said.text })
    : state.history;
  if (node.next === null) {
    return {
      state: { ...state, history, finished: true },
      instruction: { do: "finish" },
    };
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
    history,
    nodeId: node.next,
    listeningSince: next && isLearnerNode(next) ? now : null,
  };
  return { state: moved, instruction: currentInstruction(scenario, bank, moved) };
}

export type SubmitResult = {
  state: SessionState;
  instruction: Instruction;
  /** Whether the script took the answer. A director turn is decided later. */
  matched: boolean;
  /** Whether the level moved as a result. Usually not worth showing. */
  difficultyChanged: boolean;
};

/**
 * Take what the learner said and move.
 *
 * The script takes what it can: a matched answer moves along the graph, and a
 * turn with nothing but hesitation in it gets the scene's recorded "sorry?".
 * Everything else — a real sentence the script did not expect, a question about
 * something else, a change of subject, being stuck past the point where "sorry?"
 * helps — is handed to the director.
 */
export function submitSpeech(
  scenario: RoleplayScenario,
  bank: SentenceBank,
  state: SessionState,
  heard: string,
  now: number,
  /**
   * When their voice began, if the microphone could tell. Hesitation is the
   * silence before an answer, so it ends here — not at `now`, which since the
   * turn started ending itself also counts the whole sentence and the pause
   * after it. Measured to `now`, any answer longer than a couple of seconds
   * read as a struggle, and the level sank on learners who were doing fine.
   */
  speechStartedAt?: number | null,
): SubmitResult {
  const node = scenario.nodes[state.nodeId];
  if (!node || !isLearnerNode(node) || state.pending || state.queue.length > 0) {
    return {
      state,
      instruction: currentInstruction(scenario, bank, state),
      matched: false,
      difficultyChanged: false,
    };
  }

  const settings = settingsForLevel(state.difficulty.level);
  const attempts = state.attempts + 1;
  const answeredAt = speechStartedAt ?? now;
  const hesitationMs = state.listeningSince
    ? Math.max(0, answeredAt - state.listeningSince)
    : 0;
  const history = heard.trim()
    ? remember(state.history, { who: "learner", text: heard.trim() })
    : state.history;
  // Off the script, a word that happens to match the step waiting at home is
  // not an answer to it: "I love large dogs" is not a size. The director reads
  // every turn until it brings the conversation back.
  const hit =
    state.mode === "script"
      ? judge(node, heard, settings.matchStrictness, state.visited)
      : null;

  if (hit) {
    const adjusted = applyTurn(state.difficulty, {
      matched: true,
      attempts,
      usedHint: state.hintShown,
      wokeTutor: false,
      hesitationMs,
    });
    const moved: SessionState = {
      ...state,
      history,
      nodeId: hit.go,
      difficulty: adjusted.state,
      attempts: 0,
      hintShown: false,
      listeningSince: null,
      visited: state.visited.includes(hit.go)
        ? state.visited
        : [...state.visited, hit.go],
    };
    return {
      state: moved,
      instruction: currentInstruction(scenario, bank, moved),
      matched: true,
      difficultyChanged: adjusted.changed,
    };
  }

  const pardon =
    state.mode === "script" &&
    node.onMiss &&
    isMumble(heard) &&
    attempts < settings.tutorPatienceAttempts;
  if (pardon) {
    const adjusted = applyTurn(state.difficulty, {
      matched: false,
      attempts,
      usedHint: state.hintShown,
      wokeTutor: false,
      hesitationMs,
    });
    const recovering: SessionState = {
      ...state,
      history,
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

  const waiting: SessionState = {
    ...state,
    history,
    listeningSince: null,
    pending: { heard: heard.trim(), attempts, hesitationMs },
  };
  return {
    state: waiting,
    instruction: currentInstruction(scenario, bank, waiting),
    matched: false,
    difficultyChanged: false,
  };
}

function withNote(translation: string | undefined, note: string): string | undefined {
  if (!note) return translation || undefined;
  return translation ? `${translation}  ·  ${note}` : note;
}

/**
 * Carry out what the director decided.
 *
 * The line is queued to be spoken — from its recording when it is a bank line,
 * synthesised in the scene's voice when it was written now — and the scene moves
 * to wherever the director sent it. The turn is scored here rather than when it
 * was heard, because only now is it known whether it was a struggle: a correct
 * answer nobody wrote down is not one, and should not pull the level down.
 */
export function applyDirection(
  scenario: RoleplayScenario,
  bank: SentenceBank,
  state: SessionState,
  direction: Direction,
  now: number,
): { state: SessionState; instruction: Instruction; difficultyChanged: boolean } {
  const pending = state.pending ?? { heard: "", attempts: state.attempts, hesitationMs: 0 };

  const said: QueuedLine | null =
    "id" in direction.say
      ? recorded(scenario, bank, direction.say.id)
      : { text: direction.say.text, translation: direction.say.translation };
  const queue: QueuedLine[] = [];
  // A note rides with the character's line only when it is help for getting
  // through a moment they were stuck in. Anything said about a sentence they
  // managed to say belongs under that sentence, which the caller attaches.
  const spokenNote = direction.assessment === "stuck" ? direction.note : "";
  if (said) queue.push({ ...said, translation: withNote(said.translation, spokenNote) });
  const follow = direction.follow ? recorded(scenario, bank, direction.follow) : null;
  if (follow) queue.push(follow);

  const struggled = direction.assessment === "stuck";
  const outcome: TurnOutcome = {
    matched: !struggled,
    attempts: struggled ? pending.attempts : 1,
    usedHint: state.hintShown,
    wokeTutor: struggled,
    hesitationMs: pending.hesitationMs,
  };
  const adjusted = applyTurn(state.difficulty, outcome);

  let moved: SessionState = {
    ...state,
    queue,
    pending: null,
    difficulty: adjusted.state,
    directedTurns: state.directedTurns + 1,
    listeningSince: null,
  };
  if ("end" in direction.next) {
    moved = { ...moved, closing: true };
  } else if ("free" in direction.next) {
    moved = { ...moved, mode: "free", freeTurns: state.freeTurns + 1 };
  } else {
    const stayed = direction.next.step === state.nodeId;
    moved = {
      ...moved,
      mode: "script",
      freeTurns: 0,
      nodeId: direction.next.step,
      attempts: stayed ? pending.attempts : 0,
      hintShown: stayed ? state.hintShown : false,
    };
  }
  // A director that answered with nothing sayable still has to leave the
  // learner somewhere they can speak from.
  if (queue.length === 0 && moved.closing) moved = { ...moved, finished: true };
  const next = listeningIfDue(scenario, bank, moved, now);
  return { ...next, difficultyChanged: adjusted.changed };
}

/**
 * The director could not be reached, or answered with nothing usable.
 *
 * The scene falls back on what it has recorded: the help written for this step,
 * or its "sorry?", or — off the script — the question it is waiting to come
 * back to. The learner hears the character carry on, only less cleverly.
 */
export function directionFailed(
  scenario: RoleplayScenario,
  bank: SentenceBank,
  state: SessionState,
  now: number,
): { state: SessionState; instruction: Instruction } {
  const node = scenario.nodes[state.nodeId];
  const base: SessionState = {
    ...state,
    pending: null,
    listeningSince: null,
    // The turn still happened, so a second miss is still a second miss.
    attempts: state.pending?.attempts ?? state.attempts,
  };
  if (!node || !isLearnerNode(node)) return listeningIfDue(scenario, bank, base, now);

  if (state.mode === "free") {
    const question = questionFor(scenario, node.id);
    const line = question ? recorded(scenario, bank, question) : null;
    const back: SessionState = {
      ...base,
      mode: "script",
      freeTurns: 0,
      queue: line ? [line] : [],
    };
    return listeningIfDue(scenario, bank, back, now);
  }
  const help = node.correction ? recorded(scenario, bank, node.correction) : null;
  if (help) return listeningIfDue(scenario, bank, { ...base, queue: [help] }, now);
  if (node.onMiss) {
    const pardon: SessionState = { ...base, nodeId: node.onMiss };
    return listeningIfDue(scenario, bank, pardon, now);
  }
  return listeningIfDue(scenario, bank, base, now);
}
