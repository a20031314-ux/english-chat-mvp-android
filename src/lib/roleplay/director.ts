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
 * The tutor who has been in the conversation all along, and speaks up where the
 * script cannot.
 *
 * The script carries the conversation for as long as it can: recorded lines,
 * matched answers, no model involved. When the learner says something it cannot
 * take — they are stuck, they said something right that nobody wrote down, they
 * asked about something else, they changed the subject — the turn comes here.
 *
 * The model is not handed a transcript to direct. It is the character: every
 * line the scene has spoken, recorded or not, arrives as its own turn, so it
 * simply says the next thing, the way it would in any conversation it had been
 * having. An observer picking lines and steps from lists made observer's
 * mistakes — a goodbye chosen mid-order, the right question asked while the
 * scene jumped past it — where a speaker carrying on its own conversation does
 * not. It says where the conversation is afterwards in one field: back into the
 * script at some step, off it for a moment, or closed.
 *
 * Nothing about this is visible to the learner. The line comes out in the
 * scene's own voice, in the same bubble as every other line, and when it is a
 * line the scene has a recording of, the recording plays — cheaper, and a read
 * someone checked. The explicit teaching, when there is any, goes in the note
 * under the bubble, in the learner's own language, never in the character's
 * mouth.
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

/**
 * The most conversation a request carries verbatim. The app sends every line
 * its notes do not cover (memory.ts), which stays between twenty and thirty;
 * this is the ceiling for when the notes have fallen behind.
 */
export const HISTORY_LINES = 40;

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
  /** The lines the tutor reads verbatim: every line its notes do not cover. */
  history: SpokenLine[];
  /** Notes on everything older than `history`, or empty (memory.ts). */
  context?: string;
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
 * Conversation lines out of a request body, trusting nothing about their shape.
 * Anything that is not a learner line is the tutor's; empty lines are dropped;
 * long ones are cut, since a turn nobody could say is not worth a model's time.
 */
export function readSpokenLines(raw: unknown): SpokenLine[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((line): SpokenLine => {
      const record = (typeof line === "object" && line !== null ? line : {}) as {
        who?: unknown;
        text?: unknown;
      };
      return {
        who: record.who === "learner" ? "learner" : "tutor",
        text: typeof record.text === "string" ? record.text.trim().slice(0, 500) : "",
      };
    })
    .filter((line) => line.text)
    .slice(-HISTORY_LINES);
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

/**
 * Who the model is, where it is, and what it still has to get done.
 *
 * Written as the character's own brief, not an observer's. The conversation
 * itself arrives as messages (`tutorMessages`) in which every line the scene
 * spoke — recorded or not — is the model's own turn, so when the script runs
 * out it is not a director reading a transcript and picking the next line from
 * a list: it is the barista, who has been talking all along, saying the next
 * thing. Continuing its own conversation is what a chat model does best, and it
 * is what keeps the voice from changing when help arrives.
 *
 * Fixed parts first and the moving parts last, so the start of it is the same
 * from one turn to the next and can be served from the prompt cache.
 */
export function tutorSystemPrompt(input: {
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
  const quote = (id?: string) => (id && bank[id] ? `"${bank[id]!.text}"` : "");

  const fixed = `You are the ${role}. ${scenario.setting}

You are talking out loud with someone who is learning ${target}. Everything said on your side of this conversation so far was you, and you carry on as yourself. Never mention a tutor, practice, mistakes, lessons or a script, and never step out of the scene.

${
  scenario.openEnded
    ? `There is nothing to get done: this is just a conversation. Answer, react, ask them something back, and keep your turns short so they do most of the talking.`
    : `What you are here to get done, in this order:
${steps
  .map((step) => `- step:${step.id} — ${step.goal}${quote(step.questionId) ? ` — you ask it with ${quote(step.questionId)}` : ""}`)
  .join("\n")}`
}

How to answer them:
- Judge what they meant, not their wording. Someone who says they will sit by the window has told you "for here".
- If they answered, just not in the words you expected, take it and move on.
- If they are stuck — silence, a fragment, the wrong words — help the way a real ${role} would: ask again more simply, or say the choices out loud. Put the phrase they could use in "note", explained in ${native}.
- If they asked or said something else, answer it briefly, like a person would.
- One or two short sentences. Teaching never goes in what you say out loud; it goes in "note", which is shown in writing under your line. Leave "note" empty unless it helps.
- "translation" is always required: your line as a ${native} speaker would say it in that situation, not word for word — "to go" at a café is takeaway, not travelling.

Reply as JSON only:
{"say": "<your line, in ${target}>", "translation": "<in ${native}>", "note": "<in ${native}, or empty>", "assessment": "on_track" | "stuck" | "off_script" | "topic_change" | "closing", "next": ${scenario.openEnded ? `"free" | "end"` : `"step:<id>" | "free" | "end"`}}

"assessment" is how their last turn went, for you to keep track: on_track (answered fine), stuck, off_script (something beside the point), topic_change, closing (they are leaving).
"next" is where the conversation is after your line:
${
  scenario.openEnded
    ? `- "free": it carries on.\n- "end": your line closes it.`
    : `- "step:<id>": your line ends by asking that step's question. Jump ahead if they already answered later steps; never go back to a step that is done — if they change an earlier answer, say so and stay where you are.
- "free": you are off your list for a moment, talking about something else.
- "end": your line closes the conversation.
Get back to your list as soon as it feels natural.`
}`;

  const current = steps.find((step) => step.id === request.nodeId);
  // Only the lines for where the conversation is and where it goes next. Shown
  // every line of the scene, the model copied whichever sounded close: asked
  // for something hot to eat, it answered with the milk line, and it asked the
  // size step's "small, or large?" while waiting on for-here-or-to-go.
  const upcoming = current ? steps[steps.indexOf(current) + 1] : undefined;
  const usual = [current?.questionId, current?.helpId, upcoming?.questionId]
    .filter((id): id is string => Boolean(id && recorded.some((line) => line.id === id)))
    .map((id) => `- "${bank[id]!.text}"`);
  const now = [
    `Level: ${request.level} of 5. At 1–2 use short, common words and one idea per sentence; at 4–5 talk naturally.`,
    usual.length > 0
      ? `What you usually say around here — when one fits, say it word for word:\n${usual.join("\n")}`
      : "",
    scenario.openEnded || !current
      ? ""
      : request.mode === "free"
        ? `Right now you have drifted off your list (${request.freeTurns} of ${FREE_TURN_LIMIT} turns); step:${current.id} is where to come back to.${
            mustReturn(request, scenario) ? ` Come back to it now, with "step:${current.id}".` : ""
          }`
        : `Right now you are on step:${current.id} — ${current.goal}.`,
    request.context?.trim()
      ? `What you remember from earlier in this conversation:
${request.context.trim()}`
      : "",
    lastTurn(request)
      ? `This is the last turn you have: close the conversation warmly, with "end".`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  return `${fixed}\n\n${now}`;
}

/**
 * The conversation as the model lives it: its own lines as its turns.
 *
 * Recorded lines go in as assistant messages exactly like lines it wrote,
 * because to the learner there is no difference and there should be none to
 * the model either. The turn the script could not take is the last user
 * message, said once.
 */
export function tutorMessages(
  request: DirectorRequest,
): { role: "assistant" | "user"; content: string }[] {
  const last = request.history[request.history.length - 1];
  const earlier =
    last && last.who === "learner" && last.text.trim() === request.heard.trim()
      ? request.history.slice(0, -1)
      : request.history;
  const messages = earlier.slice(-HISTORY_LINES).map((line) => ({
    role: line.who === "tutor" ? ("assistant" as const) : ("user" as const),
    content: line.text,
  }));
  messages.push({
    role: "user",
    content: request.heard.trim() || "(silence — they have not said anything)",
  });
  return messages;
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
    translation?: unknown;
    note?: unknown;
    next?: unknown;
  };

  const assessment = ASSESSMENTS.includes(record.assessment as Assessment)
    ? (record.assessment as Assessment)
    : "off_script";

  // The tutor answers with its line as a plain string. The older shape — a
  // recorded id, or text and translation in an object — is still read, so a
  // model that falls back on it is not thrown away for the form of its answer.
  const sayRecord =
    typeof record.say === "string"
      ? { text: record.say, translation: record.translation }
      : typeof record.say === "object" && record.say !== null
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

  // The field's own name sometimes comes back inside it — "note: ..." — which
  // would be read under the line as if it were part of the tip.
  const note =
    typeof record.note === "string"
      ? record.note.trim().replace(/^note\s*:\s*/i, "").slice(0, 300)
      : "";

  // Learner steps in the order the scene walks them.
  const order = scriptSteps(scenario).map((step) => step.id);
  const learnerIds = new Set(order);
  let next = parseNext(record.next) ?? { step: request.nodeId };
  if ("step" in next && !learnerIds.has(next.step)) next = { step: request.nodeId };
  // An open conversation has nowhere else to be; its one step is the talking.
  if (scenario.openEnded && "free" in next) next = { step: request.nodeId };

  // Seen from the real model: a silent turn at payment sent the scene back to
  // "for here or to go?", which the learner had already answered. A scene only
  // moves forward. Someone who changes an earlier answer is acknowledged in the
  // line, and the scene stays where it is.
  if ("step" in next && order.indexOf(next.step) < order.indexOf(request.nodeId)) {
    next = { step: request.nodeId };
  }

  // Recorded lines that belong to a step — its question, its written help — are
  // only used for that step, and when the line and "next" disagree, which half
  // is right depends on how the turn went. Every model tried got this wrong in
  // one direction or the other.
  //
  // Stuck, and the line asks the current step again (or is its help): the line
  // is right. "yes please, thank you" to "for here or to go?" was met with the
  // question again and a jump to payment — but what was said out loud is what
  // they will answer, so the scene stays.
  //
  // Otherwise the line is the wrong one and is swapped for the right step's.
  // "I'll sit by the window" was accepted and the scene moved to payment with
  // "for here or to go?" all over again; a stuck turn at for-here-or-to-go was
  // helped with the size step's "small, or large?".
  const steps = scriptSteps(scenario);
  const here = steps.find((step) => step.id === request.nodeId);
  const currentHelp = here?.helpId;
  if ("step" in next && "id" in say) {
    const picked = say.id;
    const going = next.step;
    const belongsTo = steps.find(
      (step) => step.questionId === picked || step.helpId === picked,
    )?.id;
    if (belongsTo && belongsTo !== going) {
      const movingOn = going !== request.nodeId;
      if (
        movingOn &&
        belongsTo === request.nodeId &&
        (assessment === "stuck" || picked === currentHelp)
      ) {
        next = { step: request.nodeId };
      } else {
        const stuckHere = assessment === "stuck" && going === request.nodeId;
        const replacement = stuckHere ? currentHelp : questionFor(scenario, going);
        if (replacement && recordedIds.has(replacement)) say = { id: replacement };
      }
    }
  }

  // Seen from the real model: "just the latte to go", said at payment, closed
  // the conversation with "have a good one!" and nobody ever paid. A scene
  // closes when the learner is leaving or its last step is done — not while
  // there are steps still ahead of it.
  if ("end" in next && !scenario.openEnded && assessment !== "closing") {
    const last = order[order.length - 1];
    if (request.nodeId !== last) next = { step: request.nodeId };
  }

  // Stuck and given no tip: the step's written help is the line for exactly
  // this moment — in character, with the phrase they need under it — so it is
  // used rather than a line that helps nobody learn anything.
  if (
    assessment === "stuck" &&
    !note &&
    "step" in next &&
    next.step === request.nodeId &&
    currentHelp &&
    recordedIds.has(currentHelp)
  ) {
    say = { id: currentHelp };
  }

  let follow: string | undefined;
  const forcedHome = mustReturn(request, scenario) && "free" in next;
  if (forcedHome) next = { step: request.nodeId };

  // Whatever step the conversation lands on, the learner has to have been
  // asked its question, or the turn is handed to them with nothing to answer.
  // Seen from the real model: "No problem! Just to confirm, that's a small latte
  // to go." — right, friendly, and it moved the scene to payment without ever
  // asking card or cash. A line that asks nothing is followed by the step's
  // recorded question. So is any line when the conversation was dragged home,
  // because it was written to stay off the script.
  //
  // The step's own asking line is used, except where that line is the scene's
  // greeting: "Hi there! What can I get you?" in the middle of an order is a
  // second hello, so the step's written help asks instead. The help is not the
  // default because it is written for a mishearing — "Sorry — card, or cash?"
  // after "That's fine, a latte to go" apologises for nothing.
  if ("step" in next && !scenario.openEnded) {
    const staying = next.step === request.nodeId;
    const opening = questionFor(scenario, next.step);
    const start = scenario.nodes[scenario.start];
    const greeting = start && isTutorNode(start) ? start.say : undefined;
    // Moving on, only the target's own asking line will do: the help belongs to
    // the step being left.
    const candidates = !staying
      ? [opening]
      : opening === greeting
        ? [currentHelp, opening]
        : [opening, currentHelp];
    const asking = candidates.find((id) => id && recordedIds.has(id));
    const spoken = "id" in say ? bank[say.id]?.text ?? "" : say.text;
    const alreadyAsked = "id" in say && candidates.includes(say.id);
    if (asking && !alreadyAsked && (forcedHome || !spoken.includes("?"))) {
      follow = asking;
    }
  }
  if (lastTurn(request)) {
    next = { end: true };
    follow = undefined;
  }

  return { assessment, say, note, next, ...(follow ? { follow } : {}) };
}
