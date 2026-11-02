import { chatPartnerForLanguage, type TutorGender } from "../chatPartner.ts";
import { quotesOwnLine } from "./noteCheck.ts";
import { personaBrief } from "../tutorPersona.ts";
import {
  interfaceLanguageName,
  learningLanguageScript,
  learningLanguageName,
  type LearningLanguageCode,
} from "../learningLanguages.ts";
import { compareVersions } from "../appVersion.ts";
import { languageEvidence } from "../inputLanguage.ts";
import { explanationInLearningLanguage } from "../languageLearningAnalysis.ts";
import { targetLanguageFocusHints, tutorSpeechRules } from "../languageFocus.ts";
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
  /**
   * 학습자가 "내 말도 하는 튜터"를 골랐다(lib/tutorLanguage.ts). 캐릭터는 학습 언어로 이어 가되,
   * 학습자가 자기 말로 말하거나 막히면 그 말로 한 문장까지 소리 내어 받아 줄 수 있다.
   */
  bilingual?: boolean;
  /**
   * 학습자가 통화 화면의 🙉 못 알아들었어요를 눌렀다(2026-11-01): 바로 앞 튜터 말을 더 쉽게 다시 말한다.
   * 이때 `heard`는 비어 있고, 학습자 줄도 없다.
   */
  missed?: boolean;
  /**
   * 고른 튜터(여자·남자, lib/tutorGender.ts) — "그냥 대화"에서만. 이름·성별을 말해 둬서 화면의 이름·목소리와 맞고,
   * 말하는 사람의 성에 따라 꼴이 바뀌는 언어(ru·hi·ar·es·fr·it·pt)에서 자기를 말하는 꼴이 맞게. 없으면 그 언어의 예전 튜터.
   */
  tutorGender?: TutorGender;
  /**
   * 튜터 수업(2026-11-02 사용자 "진짜 튜터 역할로 표현·발화 교정·피드백에 집중한 모드") — "그냥 대화"에서만.
   * 큰 실수만 소리로 짚고(고친 문장 → 다시 말해 보기), 내 말(앱 언어)을 알아듣고, 짧은 내 말 한마디를 섞는다.
   * 통화 화면 🎓로 켜고 끔(lib/callStyle.ts) — 차례마다 실려서 통화 중에 바꿔도 다음 차례부터.
   */
  coach?: boolean;
  /**
   * 튜터 수업: 튜터가 다시 말해 보라고 해서 기다리는 문장(앱이 들고 있다가 다음 차례에 실음). 비면 기다리는 것 없음 —
   * 그때는 pass·miss가 올 수 없다(운영 2026-11-02: 기다리는 것 없이 "pass"가 와서 아무 줄에 ✓가 붙을 뻔함).
   */
  redo?: string;
  /** 그 문장을 지금까지 몇 번 말해 보라고 했나(1·2). 2면 이번이 마지막 — 또 틀려도 다시 묻지 않고 넘어간다. */
  redoTries?: number;
};

/** 같은 문장을 다시 말해 보라고 하는 최대 횟수(사용자 결정 없음, 설계 2026-11-02: 두 번까지). */
export const REDO_MAX_TRIES = 2;

/**
 * 튜터 수업에서 이 차례가 "다시 말해 보기"의 어디쯤인가.
 * ask = 고친 문장(또는 더 자연스러운 표현)을 들려주고 다시 말해 보라고 함 · pass = 다시 말한 게 맞음 · miss = 아직 틀림.
 */
export type Retry = "ask" | "pass" | "miss";
const RETRIES: readonly Retry[] = ["ask", "pass", "miss"];

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
  /**
   * What they were trying to say, rebuilt — when their sentence was too broken,
   * half in their own language, or used a word that says something else, so
   * the meaning had to be worked out from the conversation. Shown under their
   * bubble as "is this what you meant?". Never alongside `better`.
   */
  meant?: string;
  /**
   * 맞게 말했지만 원어민이 더 자연스럽게 말하는 꼴(사용자 2026-11-02 "통화에도"). 고친 말이 아니라서 고친 수·복습 카드·
   * 통화 정리에는 안 들어가고, 그 줄 아래 💡로만. `better`·`meant`와 함께 오지 않는다.
   */
  smoother?: string;
  next: DirectionNext;
  /**
   * A recorded line to say straight after, when the conversation had to be
   * brought home and the director's own line did not ask the question.
   */
  follow?: string;
  /**
   * A reaction to say before `say`, in the bank's own words, so that it plays
   * from the shared speech cache instead of being synthesised (reactions.ts).
   * Only for a build that sent ROLEPLAY_REACT_CLIENT_HEADER.
   */
  react?: { text: string; translation?: string };
  /**
   * In a daily pack: questions answered with this turn, of the pack's. From
   * the server's record, so a follow-up the tutor asked of its own is not
   * counted as a pack question (pack/pack.ts PACK_FOLLOWS).
   */
  progress?: { answered: number; total: number };
  /** 튜터 수업에서만(DirectorRequest.coach): 다시 말해 보기의 어디쯤인가. ask면 `better`나 `meant`가 다시 말할 문장. */
  retry?: Retry;
  /** 튜터 수업: 이번 ask는 고친 게 아니라 더 자연스러운 표현을 건넨 것(말한 건 맞았음) — 화면 카드가 💡로(2026-11-02). */
  offer?: boolean;
};

/**
 * 이 차례에 학습자 줄을 실제로 고쳤나 — 고친 문장(meant·better), 없으면 "".
 * 튜터 수업의 표현 건네기(offer)는 맞게 말한 줄에 건넨 것이라 better에 실려 와도 고친 말이 아니다:
 * 고친 수·취소선·통화 정리·노트 카드(fileFix)·약점 기록에 들어가지 않는다(점검 2026-11-02).
 */
export function correctionOf(direction: Pick<Direction, "better" | "meant" | "offer"> | null | undefined): string {
  if (!direction) return "";
  if (direction.meant) return direction.meant;
  return direction.offer ? "" : (direction.better ?? "");
}

/** 표현 건네기(offer)로 건넨 문장 — 그 줄 아래 💡 더 자연스럽게(smoother)로 보이고 다시 말해 볼 문장이 된다. */
export function offeredOf(direction: Pick<Direction, "better" | "meant" | "offer"> | null | undefined): string {
  return direction?.offer && !direction.meant ? (direction.better ?? "") : "";
}

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
 * Sent by builds that show `meant` under the learner's line (2.65 on). Older
 * builds only know `better`, so they are given the rebuilt sentence there
 * rather than nothing (api/roleplay/turn).
 */
export const ROLEPLAY_MEANT_CLIENT_HEADER = "x-roleplay-meant";

/**
 * Sent by builds that play `react` as a line of its own before `say` (2.67 on).
 * Older builds are given the character's line whole (reactions.ts).
 */
export const ROLEPLAY_REACT_CLIENT_HEADER = "x-roleplay-react";

/** A direction for a build that does not know `meant`: the rebuilt sentence rides in `better`. */
export function meantForOldClients(direction: Direction): Direction {
  if (!direction.meant) return direction;
  const { meant, ...rest } = direction;
  return { ...rest, better: meant };
}

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
/**
 * Whether a note hands the learner something to say.
 *
 * A note is the words they needed, explained in their own language — so it has
 * some of the language they are learning in it. Seen from a phone: a sentence
 * cut off at "…coffee and" came back with the character finishing it ("and
 * what else do they have there?") and a note that was only the Korean of that
 * line, shown under the learner's words as if it were about them. A note with
 * no word of the target language in it is a translation of something, not a
 * tip, and goes.
 *
 * Only checkable where the two languages are written differently; between two
 * Latin-script languages a note is kept as it is.
 */
/** Whether a sentence is written in the language being learned, where that can be told. */
export function inTargetLanguage(
  text: string,
  request: Pick<DirectorRequest, "targetLanguage" | "nativeLanguage">,
): boolean {
  if (learningLanguageScript(request.targetLanguage) === learningLanguageScript(request.nativeLanguage)) {
    return true;
  }
  const evidence = languageEvidence(text, request.targetLanguage, request.nativeLanguage);
  return evidence.learning > evidence.ui;
}

export function givesThemWords(
  note: string,
  request: Pick<DirectorRequest, "targetLanguage" | "nativeLanguage">,
): boolean {
  if (!note) return false;
  if (learningLanguageScript(request.targetLanguage) === learningLanguageScript(request.nativeLanguage)) {
    return true;
  }
  if (languageEvidence(note, request.targetLanguage, request.nativeLanguage).learning === 0) return false;
  // And it is explained in their own language. A tip written wholly in the language
  // being learned ("Puedes decir …" under a Russian app — sim-users 2026-10-18) is
  // one they may not be able to read; better no tip than that one.
  return !explanationInLearningLanguage(note, request.nativeLanguage, request.targetLanguage);
}

/**
 * 두 언어 캐릭터(lib/tutorLanguage.ts): 학습 언어 원어민인데 학습자의 말도 꽤 한다 — 소리 내어 말하는 줄에서 한 문장까지.
 * "가르치는 말은 소리로 하지 않는다"의 단 하나 예외. 베낄 수 있는 예문은 넣지 않는다.
 */
export function bilingualCharacterRule(target: string, native: string): string {
  return `- They chose to talk with someone who also speaks ${native}: you have lived among ${native} speakers for a while and speak ${native} fairly well, with an accent. Keep talking in ${target}. When they speak ${native}, mix ${native} into a ${target} sentence, or are stuck, you may start "say" with ONE short sentence in ${native}, said out loud, that hands them the ${target} words for the main thing they were trying to say (their point, never fillers or hesitation words) — then go straight back to ${target} in the same turn. That ${native} sentence is only ever about their words: never ask a question, make small talk or move the conversation on in ${native}. Never more than one short ${native} sentence in a turn, never a whole turn in ${native}, and none at all while they are managing in ${target}. This is the one exception to keeping teaching out of what you say; "note", "better" and "meant" work as before.
`;
}

/**
 * 튜터 수업(DirectorRequest.coach)의 지시 — "그냥 대화"의 "가르치는 말은 소리로 하지 않는다"를 뒤집는다.
 * 큰 실수만 짚고(사용자 2026-11-02 "강도는 큰 것만"), 앱 언어를 알아듣고, 짧은 앱 언어 한마디를 섞는다("잘 모르겠어 → 괜찮아",
 * "중간에 짧게 괜찮아, 다시 해 봐"). 다시 말해 보기는 같은 문장에 두 번까지. 베낄 수 있는 예문은 넣지 않는다(RULES).
 */
/** 같은 문장을 이미 두 번 말해 보라고 했다 — 이번이 마지막 시도. */
function lastRedoTry(request: Pick<DirectorRequest, "redo" | "redoTries">): boolean {
  return Boolean(request.redo?.trim()) && (request.redoTries ?? 1) >= REDO_MAX_TRIES;
}

/** 글자만(소문자, 띄어쓰기·문장부호 없이) — 띄어쓰기 없는 언어도 같은 방식으로 "이 말이 들어 있나"를 본다. 표시(\p{M})는 지우지 않는다. */
function lettersOf(text: string): string {
  return text.toLowerCase().replace(/[^\p{L}\p{M}\p{N}]/gu, "");
}

/** 튜터 수업은 "그냥 대화"(열린 장면)에서만 — 대본 장면은 할 일이 정해져 있어 예전 그대로. */
export function isCoaching(request: Pick<DirectorRequest, "coach">, scenario: Pick<RoleplayScenario, "openEnded">): boolean {
  return Boolean(request.coach && scenario.openEnded);
}

export function coachRules(target: string, native: string, bilingual: boolean): string {
  return `How you tutor:
- They speak ${native} and you understand it completely. They may say anything in ${native}, or mix it into ${target}, at any time.
- Pick up only big mistakes: the ones that change or blur what they mean, or that any listener would notice at once — the wrong time (tense), a word that means something else, words in an order that does not work, a missing word the sentence needs, ${native} in the middle of a ${target} sentence. Let everything else go: a small ending or article (as likely the speech recogniser's doing as theirs), informal speech, answering in a fragment, pronunciation. A turn without a big mistake is just conversation.
- A turn with a big mistake is the correction and nothing else: if you like, a very short word of encouragement; then their whole sentence said right, once, simply; then ask them to say it again. Ask no new question in that turn. Put the right sentence in "better" ("meant" when it had to be rebuilt from what they were trying to say) and set "retry" to "ask".
- On the turn after you asked: if they said it right, small slips allowed, set "retry" to "pass", praise it in a word or two and carry the conversation on with a question. If not, set "retry" to "miss", say the right sentence once more — shorter if you can — and ask once more. Never ask a third time for the same sentence: after a second miss, tell them it is fine and carry on. If they said something else instead of repeating it, leave "retry" empty and carry on.
- When they say a whole sentence in ${native}: a few words to show you understood, then the ${target} sentence for exactly what they said, and have them say it ("meant", "retry": "ask") — even when you understood it perfectly. Checking back with a question is only for when you truly cannot tell what they meant.
- When they say they do not know, or cannot say it: do not make up an answer for them. Make it easier — ask again in fewer words, offer two choices to pick from, or give the start of a sentence they can finish. Only when they asked how to say something in particular, hand them that sentence to say.
- Now and then, never right after a correction and no more than once in three turns, when they got through fine but a much more natural everyday way exists, offer it and ask them to try it: that sentence goes in "better", with "retry" set to "ask" and "offer" set to true (it is not a correction: what they said was fine).
- ${
    bilingual
      ? `You may say up to one short sentence in ${native} in a turn — comfort, or what the correction is about — never small talk or a question in ${native}.`
      : `You may mix in a few words of ${native} at a time — comfort, "try again", "almost" — never a whole sentence of conversation in ${native}.`
  } Everything else is ${target}.
- Explanations stay out loud only as a few words. "note" is the reason for a correction in one short line in ${native}, shown on screen and never said aloud; empty when there was no correction.
- "better" and "meant" are only for a correction or an offer, never for anything you let go.
`;
}

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
  /**
   * What this language in particular gets wrong, in its own terms.
   *
   * The chat tab has corrected against this since long before the call tab
   * existed, and the call tab has been correcting against nothing: the same
   * learner got a rewrite judged on Korean particles in one place and on
   * general good sense in the other. Since it is fixed per language it sits in
   * the fixed half of the brief, where the prompt cache can keep it.
   *
   * Not for English, which has no row and needs none — the list of failures was
   * drawn up from English in the first place, and a generic paragraph here
   * would be a rule the model applies to every turn and can never satisfy.
   */
  const focus =
    request.targetLanguage === "en"
      ? ""
      : targetLanguageFocusHints(request.targetLanguage);
  const native = interfaceLanguageName(request.nativeLanguage);
  const role = scenario.tutorRole;
  const steps = scriptSteps(scenario);
  const quote = (id?: string) => (id && bank[id] ? `"${bank[id]!.text}"` : "");

  const coaching = isCoaching(request, scenario);
  const partner = scenario.openEnded ? chatPartnerForLanguage(scenario.language, request.tutorGender) : null;
  const who = partner
    ? `You are ${partner.givenName}, the ${role} — a ${partner.gender === "f" ? "woman" : "man"}; when you speak about yourself, use the forms a ${partner.gender === "f" ? "woman" : "man"} uses. ${personaBrief(partner.languageCode, partner.gender)}`.trim()
    : `You are the ${role}.`;
  const fixed = `${who} ${scenario.setting}

${
  coaching
    ? `You are talking out loud with someone who is learning ${target}, and they asked you to be their tutor for this call: a real conversation about their own life, in which you pick up their big mistakes and have them say it right. Everything said on your side of this conversation so far was you, and you carry on as yourself.`
    : `You are talking out loud with someone who is learning ${target}. Everything said on your side of this conversation so far was you, and you carry on as yourself. Never mention a tutor, practice, mistakes, lessons or a script, and never step out of the scene.`
}

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
- If they are stuck — silence, the wrong words — help the way a real ${role} would: ask again more simply, or say the choices out loud. Put the phrase they could use in "note", in ${target}, explained in ${native}.
- A sentence that stops on a word like "and", "but", "because" or "the" was cut off while they were still thinking, not abandoned. Do not finish it for them. Answer what they did say and leave them room to go on ("And…?", "Go on"). That is on_track, not stuck.
- "note" is never a translation or an explanation of your own line, or of the question you ask next. It is about their words: what they could say.
- Only their messages are theirs. What you said earlier — a story, a plan, something you watched — is yours: never ask them about it or say they told you it.
- If they asked or said something else, answer it briefly, like a person would.
${tutorSpeechRules(request.targetLanguage)}
${
  coaching
    ? `- One or two short sentences.
${coachRules(target, native, Boolean(request.bilingual && request.nativeLanguage !== request.targetLanguage))}`
    : `- One or two short sentences. Teaching never goes in what you say out loud; it is written, not spoken, and there are two places for it that do not overlap. "note" is for a moment they could not get through: the words they needed, so they can go on. "better" is their sentence, put right. Use whichever fits; both are read, and both are shown under the words they are about — never said aloud.
- "better" is their own last sentence put right, written the way someone who grew up with ${target} would say it — only when it has a real mistake: grammar, a wrong form, a word that is wrong for what they meant. It is shown under their words, not said aloud, and you never refer to it. A sentence with no mistake that a native would just phrase differently is not "better": that goes in "smoother".
- "meant" is for a sentence too broken to just put right: words in the wrong order or missing, a word from ${native} in the middle, a word that says something else ("I am go cafe yesterday", "I want 예약 a table"). Work out what they were trying to say from what they said and what you had just asked, and write that as a ${target} speaker would say it. Keep the kind of sentence it was: what they told you stays a statement, what they asked stays a question. Fill "better" or "meant", never both.
${request.bilingual && request.nativeLanguage !== request.targetLanguage ? `${bilingualCharacterRule(target, native)}
` : ""}`
}- "smoother" is only for a sentence that is already correct and that you leave alone: when someone who grew up with ${target} would clearly say the same thing another way here (a more idiomatic phrase, the usual spoken form), write that way; otherwise leave it empty. Another word for the same thing that is no better is not a reason. Never with "better" or "meant".
- If you cannot tell what they meant, do not guess in "meant". Check with them in what you say, the way a person would — say back what you think they meant, as a question ("Oh, you went to a cafe yesterday?") — and leave "meant" empty.

Reply as JSON only:
{"open": "<a ready line's id, or empty>", "follow": "<a ready line's id, or empty>", "say": "<your line, in ${target}, or empty when open and follow already say it>", "note": "<in ${native}, or empty>", "better": "<their sentence with its mistake fixed, in ${target} — empty when nothing in it was wrong>", "meant": "<what they were trying to say, in ${target}, or empty>", "smoother": "<their correct sentence said more naturally, in ${target}, or empty>", ${coaching ? `"retry": "ask" | "pass" | "miss" | "", "offer": true | false, ` : ""}"assessment": "on_track" | "stuck" | "off_script" | "topic_change" | "closing", "next": ${scenario.openEnded ? `"free" | "end"` : `"step:<id>" | "free" | "end"`}}
${
  coaching
    ? `
"retry" follows "How you tutor": "ask" when this turn has them say a sentence again, "pass" or "miss" on the turn they tried it, empty otherwise.`
    : `
"better" is their last sentence, written as a ${target} speaker would have said it. Fill it whenever one would notice something — a verb in the wrong form, a word that is not the one for this, an order that reads wrong, a doubled subject, a missing word that changes the meaning. Keep their sentence and their meaning; do not write a different one.

Leave it empty when:
- they were understandable and simply informal, or answered in a fragment, which is how people talk
- the only thing you would change is a small ending or article, which is as likely to be the speech recogniser's doing as theirs
- nothing is wrong with it
Correcting something they said correctly costs more than saying nothing.`
}${
    focus
      ? `

What goes wrong in ${target} in particular, which is what to look at before deciding ${coaching ? "a sentence has no big mistake" : "there is nothing to fix"}:
${focus}`
      : ""
  }

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
    coaching
      ? request.redo
        ? (request.redoTries ?? 1) >= REDO_MAX_TRIES
          ? `You have asked them twice to say "${request.redo}". This turn is their last try: "pass" if they said it right; otherwise "miss" — tell them it is fine in a few words and carry the conversation on with a question. Do not ask them to say it again.`
          : `You asked them to say "${request.redo}" again, and this turn is their try at it: "pass" if they said it right, "miss" if not.`
        : `Nothing is waiting to be repeated: "retry" is "ask" or empty this turn.`
      : "",
    request.missed
      ? `They did not catch your last line and pressed "I didn't catch that". Say what you meant again in different, easier words — never the same sentence or a near copy of it. Fewer words, the most common ones, one idea; if it was a question, make it one they can answer with a word or two, or offer two choices. Talk the way a person does when the line is bad and the listener is still learning. Do not move on, do not change the subject and do not mention that they missed it; keep "next" where it was and leave "open" and "follow" empty. Leave "note", "better", "meant" and "smoother" empty, and give "stuck" as the assessment.`
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
    content: request.missed
      ? "(they did not catch what you just said)"
      : request.heard.trim() || "(silence — they have not said anything)",
  });
  return messages;
}

function words(text: string): string {
  return text
    .toLowerCase()
    // Marks are letters: stripping them cuts Thai and Devanagari syllables down
    // to bare consonants, and two lines that share nothing can end up sharing a
    // token string. Both sides of a comparison are mangled alike, so nothing
    // was visibly wrong — but saidRecently asks whether one line occurs inside
    // another, and that is exactly the question a collision answers wrongly.
    .replace(/[^\p{L}\p{M}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)
    .join(" ");
}

/** The same sentence once punctuation and case are set aside. */
/**
 * Whether a rewrite is of this line at all.
 *
 * Seen on production: a correct "The food was the best part." came back with
 * the previous line's correction ("Last weekend I went to the beach…") as its
 * rewrite, and it would have been shown under the wrong sentence. A real
 * rewrite keeps most of what was said; one that shares almost nothing with it
 * is about something else. Compared by pairs of letters, so scripts without
 * spaces are measured the same way as the rest.
 */
export function rewritesThis(rewrite: string, heard: string): boolean {
  const pairs = (text: string) => {
    const letters = Array.from(text.toLowerCase().replace(/[^\p{L}\p{M}\p{N}]/gu, ""));
    const out = new Map<string, number>();
    for (let i = 0; i < letters.length - 1; i += 1) {
      const pair = letters[i]! + letters[i + 1]!;
      out.set(pair, (out.get(pair) ?? 0) + 1);
    }
    return out;
  };
  const a = pairs(rewrite);
  const b = pairs(heard);
  const total = [...a.values()].reduce((n, v) => n + v, 0) + [...b.values()].reduce((n, v) => n + v, 0);
  if (total === 0) return true;
  let shared = 0;
  for (const [pair, count] of a) shared += Math.min(count, b.get(pair) ?? 0);
  return (2 * shared) / total >= 0.3;
}

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
    meant?: unknown;
    smoother?: unknown;
    next?: unknown;
    retry?: unknown;
    offer?: unknown;
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
  /**
   * The reaction half of a turn, which may not be a question.
   *
   * "open" is what the character says back to what it was just told and
   * "follow" is the question after it. The bank holds both kinds and the model
   * sometimes takes one from the wrong half: seen on a phone, "what did you do
   * today?" answered with "What did you do there?" — a question that points
   * back at nothing, standing where an answer belonged.
   *
   * Asked for in words first, and the wording made it worse rather than better,
   * so it is a rule here instead. Ending in a question mark is the test rather
   * than containing one: "Oh really? Tell me more." is a reaction and reads as
   * one, while anything that finishes by asking is the other half.
   */
  /**
   * Each half of a turn holds its own kind of line, and the bank divides
   * cleanly into the two: thirty-five that end by asking and eighteen that do
   * not.
   *
   * "open" is what the character says back to what it was just told, so it may
   * not be a question — "what did you do today?" answered with "What did you do
   * there?" was on a phone. "follow" is the question after it, so it may not be
   * a reaction: the character asked "what do you study in English?" and then,
   * before anything had been answered, added "Oh really? Tell me more." Two
   * sentences in a row with nothing between them, which is how it reads.
   *
   * The brief asks for both and the model complies unevenly, so both are rules.
   * Ending in a question mark is the test rather than containing one, because
   * the most-used line in the bank is "Oh really? Tell me more." and it is a
   * reaction.
   */
  //
  // Not every language ends a question with "?". Japanese and Chinese use the
  // full-width ？ and Arabic the mirrored ؟, and reading only the ASCII one
  // classified all fifty-three Japanese lines as reactions — which would have
  // refused every follow and quietly killed the two-line turn in Japanese the
  // day it shipped. Thai marks a question with a particle and no punctuation at
  // all; it has no bank yet, and when it gets one this will not be able to tell.
  const QUESTION_MARKS = ["?", "？", "؟"];
  const asksSomething = (id: string) => {
    const text = (bank[id]?.text ?? "").trim();
    return QUESTION_MARKS.some((mark) => text.endsWith(mark));
  };
  const namedOpen = readyId(record.open);
  const openId = namedOpen && asksSomething(namedOpen) ? "" : namedOpen;
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
  const written =
    typeof record.note === "string"
      ? record.note.trim().replace(/^note\s*:\s*/i, "").slice(0, 300)
      : "";
  // A note that quotes the character's own line is about that line, not about
  // their words — seen in a call (2026-10-25): "I am lying on the bed." came
  // back with a note explaining "Are you watching something?", the question the
  // character was about to ask, shown under the learner's sentence.
  const spoken = [text, bank[openId]?.text ?? "", bank[followId]?.text ?? "", bank[id]?.text ?? ""].filter(Boolean);
  // When they were stuck the note may well repeat the character's choices ("Card, or cash?") — that is the help.
  const coaching = isCoaching(request, scenario);
  const note = givesThemWords(written, request) && (assessment === "stuck" || !quotesOwnLine(written, spoken, request.heard)) ? written : "";

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
  const better0 =
    rewritten &&
    request.heard.trim() &&
    !sameWords(rewritten, request.heard) &&
    rewritesThis(rewritten, request.heard)
      ? rewritten
      : "";
  // What they meant, rebuilt. Held to the same tests as the rewrite, and to
  // being in the language they are learning: a "meant" in their own language
  // is a translation of the idea, not a sentence they can say (givesThemWords).
  const rebuilt =
    typeof record.meant === "string" ? record.meant.trim().slice(0, 200) : "";
  const meant =
    rebuilt &&
    request.heard.trim() &&
    !sameWords(rebuilt, request.heard) &&
    inTargetLanguage(rebuilt, request)
      ? rebuilt
      : "";
  // Both filled, which the prompt rules out: the rebuilt one is the one that
  // says what they were after, so it wins.
  const better = meant ? "" : better0;
  // 맞는 줄의 더 자연스러운 말: 고친 말이 없을 때만, 들은 말을 바꿔 쓴 것이고 학습 언어일 때만.
  const smoothed = typeof record.smoother === "string" ? record.smoother.trim().slice(0, 200) : "";
  const smoother =
    smoothed &&
    !better &&
    !meant &&
    request.heard.trim() &&
    !sameWords(smoothed, request.heard) &&
    rewritesThis(smoothed, request.heard) &&
    inTargetLanguage(smoothed, request)
      ? smoothed
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
  /**
   * A question that points back needs something to point at.
   *
   * The lines in the bank work because they refer rather than name — "what did
   * you do there?" fits whatever place was just mentioned. When the learner
   * asked a question instead of telling the character something, there is no
   * referent, and the brief's claim that they "fit anything" is exactly what
   * over-applies them: reported from a phone, "i'm good, how about you?"
   * answered with "Same here, actually." and then "What are they like?" — a
   * "they" with nothing behind it.
   *
   * The reaction was right and only the follow was wrong, so only the follow
   * goes. Their question is also still unanswered, which is its own reason not
   * to pile another one on top of it. The scene's own scripted question is
   * untouched: that one names what it asks and is what keeps a step answerable.
   */
  const theyAsked = request.heard.trim().endsWith("?");
  // A reaction in the question half is the other way this comes apart.
  const reactedTwice = Boolean(followId) && !asksSomething(followId);
  const chosenFollow =
    (repeats || theyAsked || reactedTwice ? "" : followId) || follow;

  // 튜터 수업: 다시 말해 보기의 어디쯤인가. ask는 다시 말할 문장(better·meant)이 있을 때만 — 없으면 앱이 보여 줄 게 없다.
  const named = typeof record.retry === "string" ? (record.retry.trim().toLowerCase() as Retry) : "";
  const waiting = Boolean(request.redo?.trim());
  const retry: Retry | "" =
    !coaching || !named || !RETRIES.includes(named) || !request.heard.trim()
      ? ""
      : named === "ask" && !(better || meant)
        ? ""
        : // pass·miss는 기다리는 문장이 있을 때만. 마지막 시도에서 다시 묻는 ask는 miss(넘어감)로.
          (named === "pass" || named === "miss") && !waiting
          ? ""
          : // 기다리던 문장을 또 말해 보라는 ask = 아직(miss). 운영에서 같은 문장으로 ask가 온 적 있음.
            named === "ask" && waiting && sameWords(better || meant, request.redo ?? "")
            ? "miss"
            : named;
  const givingUp = retry === "miss" && lastRedoTry(request);
  // 다시 말해 보라는 차례(ask·마지막 아닌 miss)에는 소리 내는 말에 그 문장이 들어 있어야 한다 — 운영(es/ar 2026-11-02)에서
  // "¡Qué bien!"만 하고 고친 문장을 말하지 않은 차례가 있었다. 없으면 뒤에 붙인다.
  const repeatThis = (retry === "ask" || (retry === "miss" && !givingUp)) ? meant || better || request.redo || "" : "";
  if (repeatThis) {
    const spokenNow = "id" in say ? bank[say.id]?.text ?? "" : say.text;
    if (!lettersOf(spokenNow).includes(lettersOf(repeatThis))) {
      say = { text: [spokenNow, repeatThis].filter(Boolean).join(" ") };
    }
  }
  // 튜터 수업의 note는 고친 까닭 한 줄(앱 언어) — 고친 말과 같이 보이고, 고친 문장을 따와도 된다.
  // 학습 언어로만 쓴 설명은 못 읽을 수 있어 뺀다(givesThemWords와 같은 까닭).
  const coachNote =
    coaching && (better || meant) && written && !explanationInLearningLanguage(written, request.nativeLanguage, request.targetLanguage)
      ? written
      : "";

  return {
    assessment,
    say,
    note: coachNote || (better || meant ? "" : note),
    next,
    ...(better ? { better } : {}),
    ...(meant ? { meant } : {}),
    ...(smoother ? { smoother } : {}),
    // 다시 말해 보라고 한 차례에는 다음 질문을 얹지 않는다 — 고친 문장을 말할 차례다.
    ...(chosenFollow && retry !== "ask" && !(retry === "miss" && !givingUp) ? { follow: chosenFollow } : {}),
    ...(retry ? { retry } : {}),
    // 표현 건네기는 고친 말(better)로 온 ask에서만 — 내 말 문장을 바꿔 준 것(meant)은 건네기가 아니다.
    ...(retry === "ask" && better && !meant && record.offer === true ? { offer: true } : {}),
  };
}
