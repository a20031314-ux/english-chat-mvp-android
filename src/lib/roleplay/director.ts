import {
  interfaceLanguageName,
  learningLanguageName,
  type LearningLanguageCode,
} from "../learningLanguages.ts";
import {
  isLearnerNode,
  isTutorNode,
  sentenceIdsUsed,
  type LearnerNode,
  type RoleplayScenario,
  type SentenceBank,
} from "./script.ts";

/**
 * The tutor who watches the conversation and steps in where the script cannot.
 *
 * The script carries the conversation for as long as it can: recorded lines,
 * matched answers, no model involved. When the learner says something it cannot
 * take — they are stuck, they said something right that nobody wrote down, they
 * asked about something else, they changed the subject — the turn comes here.
 * One text-model call decides what the character says next and where the
 * conversation goes after it: back into the script at some step, or off it for a
 * turn or two, or to a close.
 *
 * Nothing about this is visible to the learner. The line comes out in the
 * scene's own voice, in the same bubble as every other line, and whenever a
 * recorded line fits the director picks that instead of writing one — which is
 * both cheaper (no synthesis) and better (a line a person wrote and checked).
 * The explicit teaching, when there is any, goes in the note under the bubble,
 * in the learner's own language, never in the character's mouth.
 *
 * What stops this becoming the open-ended free conversation it replaces is the
 * leash: a run of turns off the script is capped, and at the cap the director is
 * made to bring the conversation home.
 *
 * Pure. The prompt is built and the answer is checked here, so both can be
 * tested without a network; the route only moves bytes.
 */

/** Consecutive turns the conversation may spend off the script. */
export const FREE_TURN_LIMIT = 4;

/**
 * Director turns in one session before it is closed. A ceiling on what one
 * session can cost, set well past any scene anyone would sit through.
 */
export const DIRECTED_TURN_LIMIT = 40;

/** How much of the conversation the director is shown. */
export const HISTORY_LINES = 12;

export type Assessment =
  | "on_track"
  | "stuck"
  | "off_script"
  | "topic_change"
  | "closing";

const ASSESSMENTS: readonly Assessment[] = [
  "on_track",
  "stuck",
  "off_script",
  "topic_change",
  "closing",
];

export type SpokenLine = { who: "tutor" | "learner"; text: string };

/** What the app sends when the script could not take a turn. */
export type DirectorRequest = {
  scenarioId: string;
  /** The learner step the conversation is on, or will return to. */
  nodeId: string;
  mode: "script" | "free";
  /** What was just heard. Empty when they said nothing usable. */
  heard: string;
  history: SpokenLine[];
  /** Consecutive turns already spent off the script. */
  freeTurns: number;
  /** Director turns already spent this session. */
  directedTurns: number;
  /** The difficulty dial, 1 to 5. */
  level: number;
  targetLanguage: LearningLanguageCode;
  nativeLanguage: LearningLanguageCode;
};

/** What the character says: a recorded line by id, or one written now. */
export type DirectionLine = { id: string } | { text: string; translation: string };

export type DirectionNext = { step: string } | { free: true } | { end: true };

/** The director's decision, once checked against the scene. */
export type Direction = {
  assessment: Assessment;
  say: DirectionLine;
  /** A tip in the learner's own language, shown under the line. May be empty. */
  note: string;
  next: DirectionNext;
  /**
   * A recorded line to say straight after, when the conversation had to be
   * brought home and the director's own line did not ask the question.
   */
  follow?: string;
};

export type Step = {
  id: string;
  goal: string;
  /** Sentence id of the line that normally asks this step's question. */
  questionId?: string;
  /** Sentence id of the help written in advance for this step. */
  helpId?: string;
};

/**
 * The line that normally asks a learner step's question.
 *
 * The tutor node leading into it — but not its "sorry?", which leads into it too
 * and asks nothing, and not a side answer that rejoins it, which is why the
 * first one in writing order wins: scenarios write the question before the
 * detours back to it.
 */
export function questionFor(
  scenario: RoleplayScenario,
  learnerId: string,
): string | undefined {
  const pardons = new Set(
    Object.values(scenario.nodes)
      .filter(isLearnerNode)
      .map((node) => node.onMiss)
      .filter(Boolean),
  );
  for (const node of Object.values(scenario.nodes)) {
    if (isTutorNode(node) && node.next === learnerId && !pardons.has(node.id)) {
      return node.say;
    }
  }
  return undefined;
}

export function scriptSteps(scenario: RoleplayScenario): Step[] {
  return Object.values(scenario.nodes)
    .filter(isLearnerNode)
    .map((node: LearnerNode) => ({
      id: node.id,
      goal: node.goal,
      questionId: questionFor(scenario, node.id),
      helpId: node.correction,
    }));
}

/**
 * Lines that already have audio in this scene's voice.
 *
 * A recording is the text in one voice, so the bank is only free to reuse where
 * a scene with the same voice already had the line made. Everything else the
 * director says is synthesised, which is also how the bank learns what it is
 * missing: a line generated often is a line worth writing down.
 */
export function recordedLines(
  scenario: RoleplayScenario,
  scenarios: readonly RoleplayScenario[],
  bank: SentenceBank,
): { id: string; text: string }[] {
  const ids = new Set<string>();
  for (const other of scenarios) {
    if (other.voice !== scenario.voice || other.language !== scenario.language) continue;
    for (const id of sentenceIdsUsed(other)) ids.add(id);
  }
  return [...ids]
    .filter((id) => bank[id])
    .map((id) => ({ id, text: bank[id]!.text }));
}

function mustReturn(request: DirectorRequest, scenario: RoleplayScenario): boolean {
  return (
    !scenario.openEnded &&
    request.mode === "free" &&
    request.freeTurns + 1 >= FREE_TURN_LIMIT
  );
}

function lastTurn(request: DirectorRequest): boolean {
  return request.directedTurns + 1 >= DIRECTED_TURN_LIMIT;
}

export function directorSystemPrompt(input: {
  scenario: RoleplayScenario;
  bank: SentenceBank;
  recorded: { id: string; text: string }[];
  request: DirectorRequest;
}): string {
  const { scenario, bank, recorded, request } = input;
  const target = learningLanguageName(request.targetLanguage);
  const native = interfaceLanguageName(request.nativeLanguage);
  const role = scenario.tutorRole;
  const steps = scriptSteps(scenario);
  const current = steps.find((step) => step.id === request.nodeId);
  const quote = (id?: string) => (id && bank[id] ? `"${bank[id]!.text}"` : "(none)");

  const where = scenario.openEnded
    ? `This is an open conversation with no script to return to. Keep it going the way a friendly person would: answer, react, ask them something back, and keep your turns short so they do most of the talking. Use "next": "free" unless they are ending it.`
    : [
        `Where the scene is:`,
        current
          ? `- Current step "${current.id}": ${current.goal} — normally asked with ${quote(current.questionId)}${current.helpId ? `; help written for it: ${current.helpId}` : ""}`
          : `- Current step: (unknown)`,
        request.mode === "free"
          ? `- The conversation is off the script right now (${request.freeTurns} of ${FREE_TURN_LIMIT} free turns used), and "${request.nodeId}" is the step to come back to.`
          : "",
        `- Steps of the scene, in order:`,
        ...steps.map(
          (step) => `  - step:${step.id} — ${step.goal} — asked with ${quote(step.questionId)}`,
        ),
      ]
        .filter(Boolean)
        .join("\n");

  const nextRules = scenario.openEnded
    ? `- "free" — the conversation carries on.\n- "end" — your line closes the conversation.`
    : [
        `- "step:<id>" — your line leads into that step, so it must ask that step's question (or be that step's recorded question). Use this to go back to the script, including jumping ahead when they already answered later steps.`,
        `- "free" — stay off the script for one more turn.`,
        `- "end" — your line closes the conversation.`,
        `Go back to the script as soon as it feels natural; a real ${role} would.`,
        mustReturn(request, scenario)
          ? `You have used up the free turns: you must answer with "step:<id>" now.`
          : "",
      ]
        .filter(Boolean)
        .join("\n");

  return `You are the ${role} in a spoken conversation with someone learning ${target}.

${scenario.setting}

The conversation normally follows a script. You are the one watching it: the learner has just said something the script could not take, and you decide what the ${role} says next. To the learner this has to feel like the same person simply carrying on. Never step out of the scene, and never mention a tutor, practice, mistakes, or a script.

Learner level: ${request.level} of 5. At 1–2 use short, common words and one idea per sentence; at 4–5 talk naturally.

${where}

Recorded lines you can say. When one fits exactly, answer with its id instead of writing a line — it is what a person wrote for this scene:
${recorded.map((line) => `- ${line.id}: "${line.text}"`).join("\n") || "- (none)"}

First decide what happened ("assessment"). Judge what they meant, not their wording — someone who says they will sit by the window has answered "for here or to go?":
- "on_track": they answered, just not in words the script expected. Accept it and move on to the next step.
- "stuck": they could not do it — silence, a fragment, the wrong words. Help in character: ask again more simply, or offer the choices out loud (the step's written help, if it has one, is usually the right line). "note" is required here: the phrase they could use, explained in ${native}.
- "off_script": something reasonable but beside the point. Answer it briefly, the way a real ${role} would.
- "topic_change": they took the conversation somewhere else. Go along with it.
- "closing": they are ending the conversation.

Then say one line — one or two short sentences, in ${target} — and choose "next":
${nextRules}
${lastTurn(request) ? `\nThis is the last turn of the session: close the conversation warmly and answer with "end".\n` : ""}
When you write a line yourself, "translation" is always required: it is shown under the line.
"note" is for teaching and is shown in writing under your line. Leave it empty unless it helps; never put teaching in the spoken line.

Reply as JSON only:
{"assessment": "...", "say": {"id": "<recorded id>"} or {"text": "<in ${target}>", "translation": "<in ${native}>"}, "note": "<in ${native}, or empty>", "next": "step:<id>" or "free" or "end"}`;
}

/** The conversation so far and the turn that could not be taken, as the model reads it. */
export function directorUserMessage(request: DirectorRequest): string {
  const last = request.history[request.history.length - 1];
  // The turn in question is said once, at the end, where it cannot be mistaken
  // for something the director already answered.
  const earlier =
    last && last.who === "learner" && last.text.trim() === request.heard.trim()
      ? request.history.slice(0, -1)
      : request.history;
  const lines = earlier
    .slice(-HISTORY_LINES)
    .map((line) => `${line.who === "tutor" ? "You" : "Learner"}: ${line.text}`);
  const heard = request.heard.trim()
    ? `The learner just said: "${request.heard.trim()}"`
    : `The learner just said nothing usable — silence, or a sound that was not words.`;
  return [...lines, "", heard].join("\n");
}

function words(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)
    .join(" ");
}

/** The same sentence once punctuation and case are set aside. */
function sameWords(a: string, b: string): boolean {
  return words(a) === words(b);
}

function parseNext(raw: unknown): DirectionNext | null {
  if (typeof raw !== "string") return null;
  const value = raw.trim();
  if (value === "free") return { free: true };
  if (value === "end") return { end: true };
  const step = value.startsWith("step:") ? value.slice(5).trim() : value;
  return step ? { step } : null;
}

/**
 * Read the director's answer and hold it to the scene, or give nothing.
 *
 * The model is told the rules and this checks them anyway, because every one it
 * breaks lands on the learner: an id with no recording would play silence, a
 * step that does not exist would strand the scene, and a run of free turns past
 * the cap is exactly the open-ended conversation this exists to avoid.
 */
export function parseDirection(
  raw: string,
  context: {
    scenario: RoleplayScenario;
    bank: SentenceBank;
    recordedIds: ReadonlySet<string>;
    request: DirectorRequest;
  },
): Direction | null {
  const { scenario, bank, recordedIds, request } = context;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;
  const record = parsed as {
    assessment?: unknown;
    say?: unknown;
    note?: unknown;
    next?: unknown;
  };

  const assessment = ASSESSMENTS.includes(record.assessment as Assessment)
    ? (record.assessment as Assessment)
    : "off_script";

  const sayRecord =
    typeof record.say === "object" && record.say !== null
      ? (record.say as { id?: unknown; text?: unknown; translation?: unknown })
      : {};
  const id = typeof sayRecord.id === "string" ? sayRecord.id.trim() : "";
  const text = typeof sayRecord.text === "string" ? sayRecord.text.trim() : "";
  const translation =
    typeof sayRecord.translation === "string" ? sayRecord.translation.trim() : "";
  let say: DirectionLine;
  if (id && recordedIds.has(id)) {
    say = { id };
  } else if (text) {
    // The model often writes out a recorded line word for word instead of
    // naming it. The recording is the same words for free, in a read someone
    // checked, so it is used instead.
    const same = [...recordedIds].find(
      (candidate) => bank[candidate] && sameWords(bank[candidate]!.text, text),
    );
    say = same ? { id: same } : { text, translation };
  } else if (id && bank[id]) {
    // A real line with no recording in this voice: still the right words, so
    // they are spoken rather than thrown away.
    say = { text: bank[id]!.text, translation: bank[id]!.translation ?? "" };
  } else {
    return null;
  }

  const note = typeof record.note === "string" ? record.note.trim().slice(0, 300) : "";

  const learnerIds = new Set(
    Object.values(scenario.nodes)
      .filter(isLearnerNode)
      .map((node) => node.id),
  );
  let next = parseNext(record.next) ?? { step: request.nodeId };
  if ("step" in next && !learnerIds.has(next.step)) next = { step: request.nodeId };
  // An open conversation has nowhere else to be; its one step is the talking.
  if (scenario.openEnded && "free" in next) next = { step: request.nodeId };

  // Seen from the real model: it moves the scene on to payment and, in the
  // same answer, picks the recording that asks "for here or to go?" again. A
  // step can only be walked into with its own question, so a recorded question
  // belonging to some other step is swapped for the target's.
  if ("step" in next && "id" in say) {
    const going = next.step;
    const picked = say.id;
    const target = questionFor(scenario, going);
    const askedFor = [...learnerIds].find(
      (step) => step !== going && questionFor(scenario, step) === picked,
    );
    if (askedFor && target && recordedIds.has(target)) say = { id: target };
  }

  let follow: string | undefined;
  if (mustReturn(request, scenario) && "free" in next) {
    next = { step: request.nodeId };
    const question = questionFor(scenario, request.nodeId);
    // The director's line was written to stay off the script, so it does not
    // ask the question the conversation is going back to. The recording does.
    if (question && recordedIds.has(question) && !("id" in say && say.id === question)) {
      follow = question;
    }
  }
  if (lastTurn(request)) {
    next = { end: true };
    follow = undefined;
  }

  return { assessment, say, note, next, ...(follow ? { follow } : {}) };
}
