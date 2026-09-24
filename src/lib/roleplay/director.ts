import {
  interfaceLanguageName,
  learningLanguageName,
  type LearningLanguageCode,
} from "../learningLanguages.ts";
import { compareVersions } from "../appVersion.ts";
import { REPERTOIRE_SINCE } from "./justTalk.ts";
import {
  isLearnerNode,
  isTutorNode,
  scenarioSentenceIds,
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

/**
 * How many of the character's own last lines count as just said.
 *
 * Measured over a hundred and twenty-seven plays: one line, "That sounds
 * great.", was 39% of them, and the top five were 64%. The bank has fifty-three
 * lines and the character kept reaching for the same handful, which is fine
 * arithmetic and bad conversation — the complaint a learner has is not that the
 * bank is small but that they heard this exact sentence two turns ago.
 *
 * So a line it has just said is not offered again for a while. Counted in
 * lines rather than turns because that is what the conversation is made of
 * here, and a turn may now be two of them: eight lines is roughly four
 * exchanges. Nothing is suppressed for good, and nothing stops the character
 * writing those words itself — this only takes the line off the list in front
 * of it, which is where the repetition was coming from.
 */
export const REPERTOIRE_COOLDOWN_LINES = 8;

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
/**
 * What the character says: a recorded line by id, or one written now.
 *
 * A written line carries no translation any more. Half of what this answer used
 * to contain was never going to be spoken — the translation and the teaching —
 * and output arrives a character at a time, so the learner waited in silence
 * for words that only ever appear on screen. A recorded line still has its
 * gloss, because that was written once and costs nothing; a written one is
 * translated when somebody asks for it (RoleplayScreen).
 */
export type DirectionLine =
  | { id: string }
  | { text: string; translation?: string };

export type DirectionNext = { step: string } | { free: true } | { end: true };

/** The director's decision, once checked against the scene. */
export type Direction = {
  assessment: Assessment;
  say: DirectionLine;
  /** A tip in the learner's own language, shown under the line. May be empty. */
  note: string;
  /**
   * What they just said, said better — their own sentence rewritten, shown
   * under their own bubble. Empty unless there is something real to fix.
   */
  better?: string;
  next: DirectionNext;
  /**
   * A recorded line to say straight after, when the conversation had to be
   * brought home and the director's own line did not ask the question.
   */
  follow?: string;
};

/**
 * Says the build can play a turn made of two bank lines.
 *
 * The lines an open conversation reaches for do not ship as audio — fifty-two
 * of the fifty-three have no file — so they exist in the app only as entries in
 * its own copy of the bank. A build released before those entries existed
 * cannot resolve their ids: it looks one up, finds nothing, queues nothing, and
 * opens the microphone on a character that said nothing at all. The server
 * deploys the moment this is pushed and the app does not follow for weeks, so
 * every build on a phone today is one of those.
 *
 * So the split turn is asked for rather than assumed, the same way the points
 * refusal is. A build that does not ask gets the same conversation written out
 * as one line, which every build can say.
 *
 * Temporary. It can go when MIN_SUPPORTED_APP_VERSION has passed the first
 * release that sends this, at which point `flattenForOldClients` goes with it.
 */
export const ROLEPLAY_BANK_CLIENT_HEADER = "x-roleplay-bank";

/**
 * Says the build reads the answer as it is written rather than all at once.
 *
 * Measured against the real model, eight runs a side: the whole answer takes
 * about a second (median 1020ms) and the ready line's id is in hand at 692ms,
 * because `open` is the first key and everything after it — the note, the
 * rewrite — is text nobody has to hear. So a third of a second can be spent
 * fetching the audio instead of waiting for words that only get read.
 *
 * Asked for, because the answer stops being one JSON object: a build that does
 * not ask gets exactly what it always got.
 */
export const ROLEPLAY_STREAM_CLIENT_HEADER = "x-roleplay-stream";

/**
 * The ready line the turn will open with, read out of an answer still arriving.
 *
 * Only ever a promise the finished answer will keep. `parseDirection` puts a
 * written line ahead of a named one, so a lead is claimed only once `say` has
 * come back empty — at which point nothing in the bank of rules can outrank the
 * named reaction, and the line this returns is the line that gets played.
 *
 * Null while either key is still being written, and null for an answer that
 * writes its own line. Both simply mean nothing is warmed early.
 */
export function leadFromPartial(partial: string): string | null {
  // A JSON string value up to the quote that closes it, escapes and all. A
  // value still being written has no closing quote yet and must not be read as
  // an empty one: that is the whole difference between warming the line the
  // answer is about to name and promising one it never will.
  const value = (name: string) =>
    new RegExp(`"${name}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`).exec(partial)?.[1];
  const open = value("open");
  const say = value("say");
  if (open === undefined || say === undefined) return null;
  return open && say === "" ? open : null;
}

/**
 * The same turn, written out for a build that cannot play it in two pieces.
 *
 * Both halves become one written line, because a written line is the one thing
 * every build has always been able to say. Nothing is lost but the caching: the
 * edge stores a line by the words asked for, so "That sounds great." warmed
 * once is free for everybody, while the same words joined to a question are a
 * string nobody has asked for before.
 */
export function flattenForOldClients(
  direction: Direction,
  bank: SentenceBank,
): Direction {
  const spoken = (line: DirectionLine) =>
    "id" in line
      ? { text: bank[line.id]?.text ?? "", translation: bank[line.id]?.translation ?? "" }
      : { text: line.text, translation: line.translation ?? "" };

  const head = spoken(direction.say);
  const tail = direction.follow ? spoken({ id: direction.follow }) : { text: "", translation: "" };
  // A line whose id this build does not know either: there is nothing to say
  // and nothing to gain by pretending, so the turn is left as it was.
  if (!head.text) return direction;

  const text = [head.text, tail.text].filter(Boolean).join(" ");
  const translation = [head.translation, tail.translation].filter(Boolean).join(" ");
  const { follow: _dropped, ...rest } = direction;
  return { ...rest, say: { text, ...(translation ? { translation } : {}) } };
}

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
 * Whether the character has just said these words.
 *
 * Reads the conversation it is already being sent rather than asking the app to
 * remember anything: the lines are right there in `history`, and a rule kept on
 * the server is one no released build has to be waiting for.
 *
 * Matched on the words, ignoring case and punctuation, and as a run inside the
 * line rather than the whole of it. A turn reaches the app as two lines now but
 * an older build is sent both halves joined into one (`flattenForOldClients`),
 * so "That sounds great." comes back as its own line from one and inside a
 * longer one from the other, and both have to count as said.
 */
export function saidRecently(
  history: readonly SpokenLine[],
): (text: string) => boolean {
  const recent = history
    .filter((line) => line.who === "tutor")
    .slice(-REPERTOIRE_COOLDOWN_LINES)
    .map((line) => ` ${words(line.text)} `);
  return (text: string) => {
    const said = words(text);
    return said !== "" && recent.some((line) => line.includes(` ${said} `));
  };
}

/**
 * The scenes as a particular build can actually play them.
 *
 * A repertoire line travels as an id and is resolved against the bank compiled
 * into the app, so offering one to a build that does not have it produces
 * silence: nothing resolves, nothing is queued, and the microphone opens on a
 * character that said nothing. That is not hypothetical — it is what 2.53 does
 * with the Japanese lines added after it was cut.
 *
 * The bank header cannot answer this. It says the build understands ids at all,
 * which 2.53 does; what matters is whether it holds *these* ids, and that is a
 * question per language with a version for an answer (REPERTOIRE_SINCE).
 *
 * Stripping the repertoire rather than refusing the turn is the whole point:
 * the character then writes its own lines, which is what it has always done in
 * a language with no bank. An older build loses the saving and keeps the
 * conversation, and gains both the day it updates.
 *
 * Applied to the whole list, not to one scene, because `recordedLines` gathers
 * the pool from every scene sharing a voice — a scene filtered on its own would
 * still have its ids offered back to it by its neighbour.
 */
export function playableBy(
  scenarios: readonly RoleplayScenario[],
  appVersion: string,
): RoleplayScenario[] {
  return scenarios.map((scenario) => {
    if (!scenario.repertoire || scenario.repertoire.length === 0) return scenario;
    const since = REPERTOIRE_SINCE[scenario.language];
    // No row is the same as not yet shipped: a bank nobody has written down the
    // release for is one no build can be assumed to hold.
    const held = since !== undefined && compareVersions(appVersion, since) >= 0;
    return held ? scenario : { ...scenario, repertoire: [] };
  });
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
    for (const id of scenarioSentenceIds(other)) ids.add(id);
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
- One or two short sentences. Teaching never goes in what you say out loud; it is written, not spoken, and there are two places for it that do not overlap. "note" is for a moment they could not get through: the words they needed, so they can go on. "better" is their sentence, put right. Use whichever fits; both are read, and both are shown under the words they are about — never said aloud.
- "better" is their own last sentence written the way someone who grew up with ${target} would say it. It is shown under their words, not said aloud, and you never refer to it.

Reply as JSON only:
{"open": "<a ready line's id, or empty>", "follow": "<a ready line's id, or empty>", "say": "<your line, in ${target}, or empty when open and follow already say it>", "note": "<in ${native}, or empty>", "better": "<their sentence, in ${target}, or empty>", "assessment": "on_track" | "stuck" | "off_script" | "topic_change" | "closing", "next": ${scenario.openEnded ? `"free" | "end"` : `"step:<id>" | "free" | "end"`}}

"better" is their last sentence, written as a ${target} speaker would have said it. Fill it whenever one would notice something — a verb in the wrong form, a word that is not the one for this, an order that reads wrong, a doubled subject, a missing word that changes the meaning. Keep their sentence and their meaning; do not write a different one.

Leave it empty when:
- they were understandable and simply informal, or answered in a fragment, which is how people talk
- the only thing you would change is a small ending or article, which is as likely to be the speech recogniser's doing as theirs
- nothing is wrong with it
Correcting something they said correctly costs more than saying nothing.

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
  const justSaid = saidRecently(request.history);
  const repertoire = scenario.openEnded
    ? (scenario.repertoire ?? [])
        .filter((id) => bank[id] && recorded.some((line) => line.id === id))
        .filter((id) => !justSaid(bank[id]!.text))
        .map((id) => `- ${id}: "${bank[id]!.text}"`)
    : [];
  const now = [
    `Level: ${request.level} of 5. At 1–2 use short, common words and one idea per sentence; at 4–5 talk naturally.`,
    usual.length > 0
      ? `What you usually say around here — when one fits, say it word for word:\n${usual.join("\n")}`
      : "",
    repertoire.length > 0
      ? `Lines you already have, ready to play in your own voice. A turn of yours is usually a reaction and then a question, and both halves can come from here — "That sounds great." then "What did you do there?" is a whole turn. Use them when they are what you would have said: answer with "open" for the reaction and "follow" for the question, by their ids. Either may be left out, and when nothing here is what you would have said, write your own line in "say" instead. Whatever you put in "follow" has to move the conversation on: asking them to repeat themselves is a whole turn by itself, never the second half of one. The questions here point back at what they just said rather than naming it, which is why they fit anything:\n${repertoire.join("\n")}`
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

/**
 * Words that carry no subject of their own, so sharing them means nothing.
 *
 * Not a general stopword list. "Here" and "go" stay, because "for here or to
 * go" is a question about almost nothing else. The tails apostrophes leave
 * behind ("that'll" arrives as "that ll") go in, and so do the number words a
 * price is made of: what "that'll be four fifty, card or cash?" asks is card or
 * cash.
 */
const COMMON_WORDS = new Set(
  (
    "a an and are as at be been can could d did do does eight eighty eleven fifteen fifty five for forty four fourteen from give got had has have how hundred i if in is it its just like ll m me my nine ninety of ok okay on one or our out please re right s say see seven seventy six sixty so sorry sure t ten than that thats the their them then these they thirteen thirty this three to too twelve twenty two up us ve want was we well what when which who will with would yeah yes you your"
  ).split(" "),
);

/**
 * Whether a line asks what a written question asks, rather than merely ending
 * in a question mark.
 *
 * Judged on the words carrying the question's subject, so the scene's own
 * wording is not required: "small or large?" is the size question however it is
 * phrased, and "would you like oat milk?" is not, though both are questions.
 */
function asksAbout(spoken: string, question: string): boolean {
  if (!spoken.includes("?")) return false;
  const subject = words(question)
    .split(" ")
    .filter((word) => word && !COMMON_WORDS.has(word));
  if (subject.length === 0) return true;
  const said = new Set(words(spoken).split(" "));
  return subject.filter((word) => said.has(word)).length / subject.length >= 0.5;
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
    open?: unknown;
    follow?: unknown;
    say?: unknown;
    translation?: unknown;
    note?: unknown;
    better?: unknown;
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
  // A turn built out of ready lines: a reaction, then a question, each played
  // from its own recording. Both halves are optional, and what is left over is
  // whatever the model wrote — so "open" plus a written line works too.
  const readyId = (value: unknown) => {
    const candidate = typeof value === "string" ? value.trim() : "";
    return candidate && recordedIds.has(candidate) ? candidate : "";
  };
  const openId = readyId(record.open);
  // Seen from the real model: the same id answered both halves, which plays
  // "What did you do there? What did you do there?" A repeat is worse than a
  // shorter turn, so the second copy is dropped rather than spoken.
  const followId = readyId(record.follow) === openId ? "" : readyId(record.follow);

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
  } else if (openId || followId) {
    // Nothing written, because the ready lines said it: the reaction is the
    // turn, and the question after it rides in "follow". A turn that is only a
    // question is a turn too, so the follow leads when there is no reaction —
    // it would otherwise be thrown away for having nothing in front of it.
    say = { id: openId || followId };
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

  // A reaction chosen from the ready lines always leads the turn. Anything the
  // model wrote as well becomes the part that plays after it — one turn, two
  // clips, which is what the queue has always done.
  if (openId && !("id" in say)) {
    say = { id: openId };
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

    // A line that asks something else is not that step's question, whatever the
    // model called it. Seen from the real model: "Yes, we have oat milk. Would
    // you like it in your latte?" with the scene left sitting on the size step
    // — so "yes please" was matched against "small" and "large" and missed.
    //
    // The scene is off its list for a moment, which is what "free" is for: the
    // answer goes to the character rather than the matcher, and the leash
    // brings it back. Not while they are stuck, where the question to keep
    // asking is this step's own, and not with the free turns spent, where the
    // recorded question is what drags the scene home.
    else if (
      !alreadyAsked &&
      assessment !== "stuck" &&
      !mustReturn(request, scenario) &&
      !asksAbout(spoken, (asking && bank[asking]?.text) || "")
    ) {
      next = { free: true };
    }
  }
  if (lastTurn(request)) {
    next = { end: true };
    follow = undefined;
  }

  // Their own sentence, said better. Held to being about what they actually
  // said: nothing to rewrite when they said nothing, and a rewrite that comes
  // back word for word is not a correction, it is noise under their line.
  const rewritten =
    typeof record.better === "string" ? record.better.trim().slice(0, 200) : "";
  // Said in both places, which the model does when it cannot decide: the
  // rewrite is the one shown under their own words, so the note goes.
  const better =
    rewritten && request.heard.trim() && !sameWords(rewritten, request.heard)
      ? rewritten
      : "";

  // The ready question the model asked for, unless the turn already asks it.
  // Naming the same line twice is caught above, but the same question can
  // arrive in two different shapes: seen from the real model, "Sorry, can you
  // say that again?" written out, with "Sorry, say that again?" named after it.
  // One turn, asked twice, which is worse than a turn with one half.
  const opening = "id" in say ? bank[say.id]?.text ?? "" : say.text;
  const followText = followId ? bank[followId]?.text ?? "" : "";
  const repeats =
    ("id" in say && say.id === followId) ||
    Boolean(
      followText &&
        // The same question in other words, and — seen from the real model —
        // the same words outright: "Yeah, I know that feeling. It must be hard
        // to find time then." with "Yeah, I know that feeling." named after it.
        (asksAbout(opening, followText) || words(opening).includes(words(followText))),
    );
  const chosenFollow = (repeats ? "" : followId) || follow;

  return {
    assessment,
    say,
    note: better ? "" : note,
    next,
    ...(better ? { better } : {}),
    ...(chosenFollow ? { follow: chosenFollow } : {}),
  };
}
