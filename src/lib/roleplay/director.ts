import { gameRules, roundOverOf, type CallGame } from "./callGames.ts";
import { chatPartnerForLanguage, type TutorGender } from "../chatPartner.ts";
import { quotesOwnLine } from "./noteCheck.ts";
import { compareToTarget, formSlip } from "./practice.ts";
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
import { frameUsed } from "../curriculum/scriptBank.ts";
import { FN_GROUPS, type FnGroup } from "../curriculum/fnGroups.ts";
import { LEAD_HOW, type Heard, type Lead, type LeadHow } from "./turnTally.ts";
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
/** 🙉 뒤 튜터가 "천천히 해요"만 하지 않게(2026-11-08 사용자 "괜찮아 천천히 해가 아니라 더 쉬운 말로 풀어 주거나 화제 전환"). */
const NOREASSURE = ' Do not answer with reassurance alone ("no rush", "take your time", "it\'s okay", "don\'t worry") — the easier words themselves are the help.';

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
  /**
   * 지난 통화에서 들은 삶(lifeFacts.ts). 이 통화의 context와 따로, 날짜가 적힌 짧은 목록.
   * 비어 있으면 지난 통화를 모른다.
   */
  prior?: string;
  /**
   * 옛 앱(2.79 이하)이 보내는 수업 통화의 부족한 칸 이름(앱 언어). 새 앱은 `lesson` — 최소 지원 2.80이면 지움.
   */
  study?: string;
  /** 옛 앱: 그 칸을 말하는 첫 마디. */
  studyOpen?: boolean;
  /**
   * 수업 통화의 지금 소재(lessonPlan.ts, hub/work/drafts/lesson-plan-2026-11-12.md) — 앱이 단계를 정한다.
   * 틀은 판정하지 않고 튜터가 그 틀로 되받는다. 예문은 싣지 않는다(베낄 문장 금지).
   */
  lesson?: LessonRequest;
  /**
   * 수업 통화(coach)에서 학습자가 말없이 지나간 차례가 이번까지 몇 번 이어졌나(2026-11-07) — 화면에 🙉·💡가 없어
   * 튜터가 먼저: 1이면 들었는지 묻고 질문을 쉽게 다시, 2 이상이면 이어 말할 문장 앞부분 힌트.
   */
  silent?: number;
  /**
   * 지난 통화에서 고친 문장(fixMemory.ts). 날 | 틀린 점 | 고친 문장.
   * 비어 있으면 지난 고침을 모른다.
   */
  fixes?: string;
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
  /** 🙉를 같은 질문에 두 번째로 — 쉽게 다시 한 줄도 못 알아들었다. 그 질문은 두고 쉬운 다른 화제로. */
  missedAgain?: boolean;
  /** 튜터와 게임(callGames.ts, 2026-11-08) — 자유대화 장면에서만. */
  game?: CallGame;
  /** 스무고개 이번 판의 답(앱이 고름, 영어). */
  gameSecret?: string;
  /** 이번 판에서 학습자가 한 차례 수. */
  gameCount?: number;
  /** 게임 통화의 첫 마디(튜터가 먼저 규칙을 말함). */
  gameStart?: boolean;
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
  /**
   * 자유대화 채우기(2026-11-06, hub/work/drafts/call-modes-2026-11-06.md 6절): 이번 튜터 차례가 몰아갈 곳 한 줄(영어, 모델용).
   * 앱이 기록으로 고른다(talkAims.ts). 튜터는 말하지 않고, 학습자 말과 안 맞으면 버린다. 예문은 넣지 않는다.
   */
  aim?: string;
  /** 바로 앞 튜터 차례에 실었던 aim — 이번 학습자 말이 그걸 해냈는지 `aim` 측정 칸으로 돌려준다. */
  aimCheck?: string;
};

/** 자유대화 채우기 측정: 앞 차례 겨냥을 이번 말에서 맞게 씀(used)·썼지만 틀림(wrong). */
export type AimResult = "used" | "wrong";
const AIM_RESULTS: readonly AimResult[] = ["used", "wrong"];
/** 수업 소재(앱이 보냄): 틀·뜻(앱 언어)·넣을 낱말·단계, 물어본 뒤인가, 좋다면 이어 갈 다음 틀. */
export type LessonRequest = {
  pattern: string;
  meaning: string;
  words: string[];
  step: "show" | "draw" | "move" | "ask";
  asked?: boolean;
  /** 대화 첫 마디(학습자가 아직 말하지 않음). */
  open?: boolean;
  /** 학습자가 ⏭를 눌러 이 소재로 넘어옴 — 인사 없이 바로 시작. */
  skip?: boolean;
  /** 지난 숙제에서 이 틀이 어땠나(첫 소재가 숙제 리뷰일 때, 첫 마디에만). */
  review?: "missed" | "right" | "undone";
  next?: { pattern: string; meaning: string; words: string[] };
};
/** 수업 소재 글 길이 상한(서버가 자름). */
export const LESSON_MAX_CHARS = 160;

/** 서버: 앱이 보낸 수업 소재를 읽는다 — 모르는 꼴은 버린다(없는 것으로). */
export function readLesson(raw: unknown): LessonRequest | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const one = raw as Record<string, unknown>;
  const text = (value: unknown) => (typeof value === "string" ? value.trim().slice(0, LESSON_MAX_CHARS) : "");
  const words = (value: unknown) =>
    Array.isArray(value) ? value.map(text).filter(Boolean).slice(0, 3) : [];
  const pattern = text(one.pattern);
  const step = one.step;
  if (!pattern || (step !== "show" && step !== "draw" && step !== "move" && step !== "ask")) return undefined;
  const next = one.next && typeof one.next === "object" ? (one.next as Record<string, unknown>) : null;
  const nextPattern = next ? text(next.pattern) : "";
  return {
    pattern,
    meaning: text(one.meaning),
    words: words(one.words),
    step,
    ...(one.asked === true ? { asked: true } : {}),
    ...(one.open === true ? { open: true } : {}),
    ...(one.skip === true ? { skip: true } : {}),
    ...(one.review === "missed" || one.review === "right" || one.review === "undone" ? { review: one.review } : {}),
    ...(next && nextPattern ? { next: { pattern: nextPattern, meaning: text(next.meaning), words: words(next.words) } } : {}),
  };
}

/** aim·aimCheck 글 길이 상한(서버가 자름). */
export const AIM_MAX_CHARS = 200;

/**
 * 차례 재기 칸의 뜻(같은 호출, 화면엔 안 보임 — Logbank 육각형 듣기·실전 대화, 2026-11-02). 짧게: 출력 몇 토큰.
 */
function MEASURE_RULES(openEnded: boolean, target: string, native: string): string {
  return `These last fields only record how their turn went; they change nothing you say.
"heard": only when your previous line asked them something or waited for an answer — "yes" when what they said answers it, "off" when it answers something else (they seem to have misheard), "vague" when it would fit any question ("yes yes", "I think so", "okay") and dodges this one; empty when you had not asked, or when the transcript is too broken to tell.${openEnded ? `
"lead": "lead" when they bring in something you did not ask for — a question back, a new topic, or their own detail or reason that widens the talk ("how": "ask", "topic" or "extend"); "follow" when they answer what you asked, fully enough; "min" when they give only enough to get by (a word or two, "yes", repeating your words).` : ""}
"fn": what their turn was doing — self (about themselves or people), ask (asking or checking), request (asking for, offering, inviting, ordering), time (when, past, plans, sequence), reason (why, if, must, can), compare (comparing, amounts, describing things), mind (feelings, opinions, reactions), daily (thanks, sorry, problems, directions, getting things done); empty if nothing.
"native": true when all or most of their turn was in ${native} rather than ${target}.`;
}

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
  /**
   * 차례 재기(Logbank 육각형 듣기·실전 대화, 2026-11-02 hub/work/drafts/fill-gauge-2026-11-02.md 9절) — 같은 호출에서 판단, 화면엔 안 보임.
   * heard: 튜터가 바로 앞에서 물었을 때 그 말에 맞게 답했나(yes)·엉뚱한 답(off)·아무 질문에나 맞는 얼버무림(vague).
   */
  heard?: Heard;
  /** 그냥 대화에서: 묻지 않은 걸 스스로 꺼냄(lead) · 물은 것에 충분히(follow) · 살아남을 만큼만(min). */
  lead?: Lead;
  /** lead일 때 어떻게 — 되묻기·새 화제·덧붙여 넓힘. */
  leadHow?: LeadHow;
  /** 이 차례가 한 말의 일 묶음(curriculum/fnGroups). */
  fnGroup?: FnGroup;
  /** 차례 전부(또는 거의)를 앱 언어로 말함. */
  native?: boolean;
  /** 자유대화 채우기: aimCheck를 보냈을 때만 — 앞 차례 겨냥을 이번 말에서 해냈나. */
  aim?: AimResult;
  /** 스무고개: 이 차례에 판이 끝남(맞힘·스무 번) — 앱이 다음 답을 고른다(callGames.ts). */
  round?: "over";
  /** 수업 소재: 학습자가 다른 걸 하자고 함(또는 물어본 뒤 좋다고 함) — 앱이 다음 소재로(lessonPlan.ts advanceRun). */
  move?: true;
};

export type { Heard, Lead, LeadHow };
const HEARDS: readonly Heard[] = ["yes", "off", "vague"];
const LEADS: readonly Lead[] = ["lead", "follow", "min"];

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

/** `needle`의 글자가 `hay` 안에서 시작되는 자리. 문장부호·띄어쓰기는 건너뛴다. */
function phraseStart(hay: string, needle: string): number {
  const want = lettersOf(needle);
  if (!want) return -1;
  for (let i = 0; i < hay.length; i++) {
    if (!/[\p{L}\p{M}\p{N}]/u.test(hay[i] ?? "")) continue;
    if (lettersOf(hay.slice(i)).startsWith(want)) return i;
  }
  return -1;
}

/** 고친 문장을 인용으로 감싼 부호. 예문을 읽듯 소리 나지 않게 그 문장 바로 앞뒤만 걷는다. */
const CITATION_MARK = /[「」『』“”„«»‹›"]/u;
const CITATION_PAD = /[\s.。．!！?？,、，]/u;

function unquoteRight(line: string, right: string): string {
  const at = phraseStart(line, right);
  const want = lettersOf(right);
  if (at < 0 || !want) return line;
  const chars = [...line];
  let before = at;
  while (before > 0 && /\s/u.test(chars[before - 1]!)) before--;
  while (before > 0 && CITATION_MARK.test(chars[before - 1]!)) {
    chars[before - 1] = "";
    before--;
    while (before > 0 && /\s/u.test(chars[before - 1]!)) before--;
  }
  let got = "";
  let i = at;
  while (i < chars.length && got.length < want.length) {
    const ch = chars[i] ?? "";
    if (/[\p{L}\p{M}\p{N}]/u.test(ch)) got += ch;
    i++;
  }
  while (i < chars.length && (CITATION_PAD.test(chars[i]!) || CITATION_MARK.test(chars[i]!))) {
    if (CITATION_MARK.test(chars[i]!)) chars[i] = "";
    i++;
  }
  return chars.join("").replace(/[ \t]{2,}/g, " ").trim();
}

/**
 * 튜터 수업에서 큰 실수를 고쳐 주는 차례에 실제로 소리 내는 줄.
 *
 * 맞장구 뒤에 고친 문장을 붙이지 않는다. 순서는 틀린 곳을 짚는 말(앱 언어) → 고친 문장
 * (그 뒤에 모델이 붙인 "다시"는 남긴다). 문장을 감싼 인용 부호는 걷어, 예문처럼 읽히지 않게.
 * 짚는 말이 없으면 문장만.
 */
export function spokenCoachFix(modelSay: string, point: string, right: string): string {
  const said = modelSay.trim();
  if (!right) return said;
  const atRight = phraseStart(said, right);
  const tail = atRight >= 0 ? said.slice(atRight).trim() : "";
  const atPoint = point ? phraseStart(said, point) : -1;
  let spoken: string;
  if (tail && atPoint >= 0 && atPoint <= atRight) spoken = said.slice(atPoint).trim();
  else if (tail && point && atPoint < 0) spoken = `${point} ${tail}`.trim();
  else if (tail && !point) {
    const lead = said.slice(0, atRight);
    spoken = lettersOf(lead) ? tail : said;
  } else spoken = [point, right].filter(Boolean).join(" ");
  return unquoteRight(spoken, right);
}

/** 튜터 수업은 "그냥 대화"(열린 장면)에서만 — 대본 장면은 할 일이 정해져 있어 예전 그대로. */
export function isCoaching(request: Pick<DirectorRequest, "coach">, scenario: Pick<RoleplayScenario, "openEnded">): boolean {
  return Boolean(request.coach && scenario.openEnded);
}

export function coachRules(target: string, native: string, bilingual: boolean, lessonPattern = ""): string {
  return `How you tutor:${
    lessonPattern
      ? `
- First, the one exception: the lesson pattern "${lessonPattern}" (see "Today's lesson point") is never corrected, drilled or graded. A mistake in it — a wrong form inside it counts — or not using it is answered only by saying it back the right way inside your reply, as conversation. "note", "better", "meant", "retry" and "offer" stay empty for it, and you never ask them to say it again. When they use it, no word that grades it (right, correct, good) — just answer.`
      : ""
  }
- They speak ${native} and you understand it completely. They may say anything in ${native}, or mix it into ${target}, at any time.
- Pick up only big mistakes: the ones that change or blur what they mean, or that any listener would notice at once — the wrong time (tense), a word that means something else, words in an order that does not work, a missing word the sentence needs, ${native} in the middle of a ${target} sentence. Let everything else go: a small ending or article (as likely the speech recogniser's doing as theirs), informal speech, answering in a fragment, pronunciation. A turn without a big mistake is just conversation.
- A turn with a big mistake is three spoken beats and nothing else, in this order: (1) point out what was wrong in one short phrase in ${native} — name the mistake (the time, the word, the order, the missing word), the same words as "note", said out loud; (2) their whole sentence said right, once, in ${target}, in your own manner — your rhythm and everyday wording, still at the speech level they use with you — spoken as your own line, never wrapped in quotation marks or read out as a cited example; the words stay their sentence put right, not a different story of yours; (3) ask them to say it again in a few words of ${target}, in that same manner: a short nudge rather than a polite set phrase, and not in ${native}. Ask no new question. Do not react to what they told you, and do not use a ready line. Leave "open" and "follow" empty. Put the right sentence alone in "better" ("meant" when it had to be rebuilt from what they were trying to say) and set "retry" to "ask". Change only the words that are wrong: every other word, and every sentence of their turn that was already right, stays exactly as they said it (do not drop a pronoun, swap a word for one you like better or tidy the punctuation) — leave out of "better" any sentence that had no mistake. Do not put the corrected sentence in "note".
- On the turn after you asked: if they said it right, small slips allowed, set "retry" to "pass", praise it in a word or two and carry the conversation on with a question. If not, set "retry" to "miss", say the right sentence once more — shorter if you can, still in your own manner — and ask once more in a few words of ${target}. Never ask a third time for the same sentence: after a second miss, tell them it is fine and carry on. If they said something else instead of repeating it, leave "retry" empty and carry on.
- When they say a whole sentence in ${native}: a few words to show you understood, then the ${target} sentence for exactly what they said, and have them say it ("meant", "retry": "ask") — even when you understood it perfectly. Checking back with a question is only for when you truly cannot tell what they meant.
- When they said nothing at all (what you heard is empty): they may not have caught you, or not know how to answer — there are no buttons on their screen for this, so you check. What to do is written under "This turn".
- When they say they do not know, or cannot say it: do not make up an answer for them. Make it easier — ask again in fewer words, offer two choices to pick from, or give the start of a sentence they can finish. Only when they asked how to say something in particular, hand them that sentence to say.
- Now and then, never right after a correction and no more than once in three turns, when they got through fine but a much more natural everyday way exists, offer it and ask them to try it: that sentence goes in "better", with "retry" set to "ask" and "offer" set to true (it is not a correction: what they said was fine).
- ${
    bilingual
      ? `You may say up to one short sentence in ${native} in a turn — comfort, or what the correction is about — never small talk or a question in ${native}.`
      : `You may mix in a few words of ${native} at a time — comfort, "try again", "almost" — never a whole sentence of conversation in ${native}.`
  } Everything else is ${target}.
- "note" is that spoken point-out: one short line in ${native}, the same words you say first. It is also shown on screen. Empty when there was no correction. Do not add a longer explanation.
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
/** 수업 통화 첫 침묵에 앞에 붙이는 "제 말 들렸어요?" — 학습자 앱 언어(앱 언어 = 감독 요청 nativeLanguage). */
/** 다시 말해 보기에서 꼴이 아직 다를 때 앞에 붙이는 앱 언어 한 마디(뒤에 고친 문장). */
export const ALMOST_AGAIN: Partial<Record<string, string>> = {
  ko: "거의 됐어요. 한 번 더요.",
  en: "Almost. One more time.",
  es: "Casi. Otra vez.",
  ja: "おしい。もう一度。",
  zh: "差一点。再说一次。",
  vi: "Gần đúng rồi. Thêm lần nữa nhé.",
  fr: "Presque. Encore une fois.",
  it: "Quasi. Ancora una volta.",
  pt: "Quase. Mais uma vez.",
  ru: "Почти. Ещё раз.",
  id: "Hampir. Sekali lagi.",
  ar: "تقريبًا. مرة أخرى.",
  th: "เกือบแล้ว อีกครั้งนะ",
  hi: "लगभग। एक बार और।",
};

/** 기다리던 문장(redo)과 들은 말 사이에 같은 낱말의 다른 꼴이 있나. */
export function redoFormSlip(redo: string, heard: string): boolean {
  if (!redo.trim() || !heard.trim()) return false;
  return compareToTarget(redo, heard).outcomes.some((outcome) => outcome.kind === "changed" && formSlip(outcome.word, outcome.heardAs));
}

/** 통화 첫 마디(학습자가 아직 아무 말도 안 함) — 침묵 차례가 아니다(수업 첫 마디에 "들렸어요?"가 붙던 것, 2026-11-12). */
export function openingTurn(request: Pick<DirectorRequest, "history" | "studyOpen" | "lesson">): boolean {
  // 첫 질문 뒤의 침묵은 침묵 차례다 — 튜터 말이 하나도 없을 때만 첫 마디(변경 감시 리뷰 2026-11-12). ⏭(skip)도 침묵이 아니다.
  return Boolean(request.studyOpen || request.lesson?.open || request.lesson?.skip) || request.history.length === 0;
}

export const CAUGHT_IT: Partial<Record<string, string>> = {
  ko: "제 말 들렸어요?",
  en: "Did you catch that?",
  es: "¿Me has oído?",
  ja: "聞こえましたか？",
  zh: "听到了吗？",
  vi: "Bạn có nghe rõ không?",
  fr: "Tu m'as entendu ?",
  it: "Mi hai sentito?",
  pt: "Você me ouviu?",
  ru: "Вы меня услышали?",
  id: "Kamu dengar tadi?",
  ar: "هل سمعتني؟",
  th: "ได้ยินไหม",
  hi: "क्या आपने सुना?",
};

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
    ? `You are talking out loud with someone who is learning ${target}, and they asked you to be their tutor for this call. They chose to study on this call: a real conversation about their own life, in which you pick up their big mistakes and have them say it right. Everything said on your side of this conversation so far was you, and you carry on as yourself.`
    : `You are talking out loud with someone who is learning ${target}. Everything said on your side of this conversation so far was you, and you carry on as yourself. Never mention a tutor, practice, mistakes, lessons or a script, and never step out of the scene.`
}

${
  scenario.openEnded
    ? coaching
      ? `There is nothing to get done: this is a real conversation, and on an ordinary turn you answer, react, and ask them something back, in one or two short sentences. On a turn you correct a big mistake, do not do that: no reaction, no new question, "open" and "follow" empty. That turn is only the three beats in "How you tutor", and you still say them in your own manner — how you talk — not as a teacher reading an example.`
      : `There is nothing to get done: this is just a conversation. They chose free conversation for this call. Answer, react, ask them something back, and keep your turns short so they do most of the talking. Never correct a sentence out loud and never ask them to repeat one.`
    : `What you are here to get done, in this order:
${steps
  .map((step) => `- step:${step.id} — ${step.goal}${quote(step.questionId) ? ` — you ask it with ${quote(step.questionId)}` : ""}`)
  .join("\n")}`
}

How to answer them:
- Judge what they meant, not their wording. Someone who says they will sit by the window has told you "for here".
- If they answered, just not in the words you expected, take it and move on.
${scenario.openEnded && !coaching ? `- If they are stuck — silence, the wrong words — ask again more simply, inside the conversation: easier words, or two choices, or a smaller question. Do not answer with reassurance alone ("no rush", "take your time", "it's okay") — the easier question itself is the help. Leave "note" empty.` : `- If they are stuck — silence, the wrong words — help the way a real ${role} would: ask again more simply, or say the choices out loud. Put the phrase they could use in "note", in ${target}, explained in ${native}.`}
- A sentence that stops on a word like "and", "but", "because" or "the" was cut off while they were still thinking, not abandoned. Do not finish it for them. Answer what they did say and leave them room to go on ("And…?", "Go on"). That is on_track, not stuck.
- "note" is never a translation or an explanation of your own line, or of the question you ask next. It is about their words: what they could say.
- Only their messages are theirs. What you said earlier — a story, a plan, something you watched — is yours: never ask them about it or say they told you it.
- If they asked or said something else, answer it briefly, like a person would.
${scenario.openEnded && !coaching ? `- When what they just said had a mistake, let the right form come up in your own reply, the way someone who heard them would naturally say it back: use their idea again with the wording put right, inside your reaction or your question. Never point it out, never stress it and never ask them to say it again — it is part of the conversation, not a correction. When there was no mistake, do nothing of the kind.\n` : ""}${scenario.openEnded && !coaching ? `- Now and then — about one turn in three, when they are managing, never two in a row and never right after a correction — end on a reaction or a short remark of your own instead of a question, and leave them room to take the conversation where they want.\n` : ""}${tutorSpeechRules(request.targetLanguage, partner?.gender)}
${
  coaching
    ? `- One or two short sentences.
${coachRules(target, native, Boolean(request.bilingual && request.nativeLanguage !== request.targetLanguage), request.lesson?.pattern)}`
    : scenario.openEnded
      ? `- One or two short sentences. They chose free conversation for this call, so what you say out loud is only the conversation. Never correct a sentence out loud, never ask them to repeat it, and never mention practice, mistakes or a lesson.
- Corrections are written, never spoken: they appear on their screen while you keep talking. "better" is their own last sentence put right — only when it has a real mistake: grammar, a wrong form, a word that is wrong for what they meant. Change only the words that are wrong: every other word, and every sentence of their turn that was already right, stays exactly as they said it (do not drop a pronoun, swap a word for one you like better or tidy the punctuation) — leave out of "better" any sentence that had no mistake. "meant" is for a sentence too broken to just put right: write what they were trying to say, as a ${target} speaker would. Fill "better" or "meant", never both, and never refer to them in what you say.
- When "better" or "meant" is filled, "note" names the mistake in one short phrase in ${native} (the time, the word, the order, the missing word) — no corrected sentence and no longer explanation in it. Otherwise leave "note" empty.`
      : `- One or two short sentences. Teaching never goes in what you say out loud; it is written, not spoken, and there are two places for it that do not overlap. "note" is for a moment they could not get through: the words they needed, so they can go on. "better" is their sentence, put right. Use whichever fits; both are read, and both are shown under the words they are about — never said aloud.
- "better" is their own last sentence put right, written the way someone who grew up with ${target} would say it — only when it has a real mistake: grammar, a wrong form, a word that is wrong for what they meant. Change only the words that are wrong: every other word, and every sentence of their turn that was already right, stays exactly as they said it (do not drop a pronoun, swap a word for one you like better or tidy the punctuation) — leave out of "better" any sentence that had no mistake. It is shown under their words, not said aloud, and you never refer to it. A sentence with no mistake that a native would just phrase differently is not "better": that goes in "smoother".
- "meant" is for a sentence too broken to just put right: words in the wrong order or missing, a word from ${native} in the middle, a word that says something else ("I am go cafe yesterday", "I want 예약 a table"). Work out what they were trying to say from what they said and what you had just asked, and write that as a ${target} speaker would say it. Keep the kind of sentence it was: what they told you stays a statement, what they asked stays a question. Fill "better" or "meant", never both.
${request.bilingual && request.nativeLanguage !== request.targetLanguage ? `${bilingualCharacterRule(target, native)}
` : ""}`
}${`- "smoother" is only for a sentence that is already correct and that you leave alone: when someone who grew up with ${target} would clearly say the same thing another way here (a more idiomatic phrase, the usual spoken form), write that way; otherwise leave it empty. Another word for the same thing that is no better is not a reason. Never with "better" or "meant".
- If you cannot tell what they meant, do not guess in "meant". Check with them in what you say, the way a person would — say back what you think they meant, as a question ("Oh, you went to a cafe yesterday?") — and leave "meant" empty.
`}

Reply as JSON only:
{"open": "<a ready line's id, or empty>", "follow": "<a ready line's id, or empty>", ${request.game === "teach" ? `"slip_right": "<the correct ${native} sentence you are about to break, or empty on a turn you only ask a question>", "slip": "<what you broke in it, in a few ${target} words, or empty>", ` : ""}"say": "<your line, in ${target}, or empty when open and follow already say it>", "note": "<in ${native}, or empty>", "better": "<their sentence with its mistake fixed, in ${target} — empty when nothing in it was wrong>", "meant": "<what they were trying to say, in ${target}, or empty>", "smoother": "<their correct sentence said more naturally, in ${target}, or empty>", ${coaching ? `"retry": "ask" | "pass" | "miss" | "", "offer": true | false, ` : ""}"assessment": "on_track" | "stuck" | "off_script" | "topic_change" | "closing", "next": ${scenario.openEnded ? `"free" | "end"` : `"step:<id>" | "free" | "end"`}, "heard": "yes" | "off" | "vague" | "", ${scenario.openEnded ? `"lead": "lead" | "follow" | "min" | "", "how": "ask" | "topic" | "extend" | "", "aim": "used" | "wrong" | "", ` : ""}"fn": "${FN_GROUPS.join('" | "')}" | "", "native": true | false${request.game === "twenty" ? `, "round": "over" | ""` : ""}${request.lesson ? `, "move": true | false` : ""}}
${MEASURE_RULES(Boolean(scenario.openEnded), target, native)}
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
    ? `- "free": always. They hang up themselves when they want to. When they are leaving, say a short, warm goodbye in your own manner, give "closing" as the assessment and still "free" — and if they carry on talking after all, simply carry on.\n- "end": only when you are told this is the last turn you have.`
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
      ? `Lines you already have, ready to play in your own voice. A turn of yours is usually a reaction and then a question, and both halves can come from here — "That sounds great." then "What did you do there?" is a whole turn. Use them when they are what you would have said: answer with "open" for the reaction and "follow" for the question, by their ids. Either may be left out, and when nothing here is what you would have said, write your own line in "say" instead. Whatever you put in "follow" has to move the conversation on: asking them to repeat themselves is a whole turn by itself, never the second half of one. The questions here point back at what they just said rather than naming it, which is why they fit anything:${coaching ? ` On a turn you correct a mistake, do not use these lines. Leave "open" and "follow" empty and write the three beats in "say", in your own manner.` : ""}\n${repertoire.join("\n")}`
      : "",
    scenario.openEnded || !current
      ? ""
      : request.mode === "free"
        ? `Right now you have drifted off your list (${request.freeTurns} of ${FREE_TURN_LIMIT} turns); step:${current.id} is where to come back to.${
            mustReturn(request, scenario) ? ` Come back to it now, with "step:${current.id}".` : ""
          }`
        : `Right now you are on step:${current.id} — ${current.goal}.`,
    request.prior?.trim()
      ? `What you remember about them from earlier conversations. Each line starts with the day you heard it. Bring one up only when it fits what they just said, in your own manner, and never read this list out loud. Do not invent a memory that is not written here.
${request.prior.trim()}`
      : "",
    request.fixes?.trim()
      ? `Corrections from earlier calls. Each line is the day, what was wrong, and the sentence said right. If what they just said is that sentence said right and you are not correcting them, say once, in your own manner, that last time it was off and this time it is right. If they got it wrong again, do not mention the old mistake. Do not invent a correction that is not written here.
${request.fixes.trim()}`
      : "",
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
    scenario.openEnded && request.game
      ? gameRules({
          game: request.game,
          target: request.targetLanguage,
          native: request.nativeLanguage,
          count: request.gameCount ?? 0,
          start: request.gameStart,
          secret: request.gameSecret,
        })
      : "",
    request.missed && request.missedAgain && scenario.openEnded
      ? `They pressed "I didn't catch that" again: they did not understand your easier version either. Let that question go — do not repeat it or explain it — and move to a different, easier topic from their own life — something they told you earlier in this call or in what you know of them (their work or studies, plans, family, a place, a hobby), or else their day today; not food or drinks unless they talked about them — with one short question they can answer with a word or two (or two choices to pick from). Use the most common words. Do not mention that they missed it and do not apologise.${NOREASSURE} Leave "note", "better", "meant" and "smoother" empty, and give "stuck" as the assessment.`
      : request.missed
        ? `They did not catch your last line and pressed "I didn't catch that". Say what you meant again in different, easier words — never the same sentence or a near copy of it. Fewer words, the most common ones, one idea; if it was a question, make it one they can answer with a word or two, or offer two choices. Talk the way a person does when the line is bad and the listener is still learning. Do not move on, do not change the subject and do not mention that they missed it; keep "next" where it was and leave "open" and "follow" empty.${NOREASSURE} Leave "note", "better", "meant" and "smoother" empty, and give "stuck" as the assessment.`
        : "",
    lastTurn(request)
      ? `This is the last turn you have: close the conversation warmly, with "end".`
      : "",
    scenario.openEnded && request.aim?.trim()
      ? `Where to take the conversation on this turn, for you only: ${request.aim.trim()}
Do it inside the conversation, in your own manner. Never say this out loud, never name it, never teach it and never ask them to practise anything. If it does not fit what they just said, or they just brought up something of their own, leave it and simply follow them.`
      : "",
    scenario.openEnded && request.aimCheck?.trim()
      ? `On your last turn you were steering toward: ${request.aimCheck.trim()}
"aim" is about their turn you are answering now: "used" when it did that and the part it was about was right, "wrong" when it did that with a mistake in that part, "" when it did not do it. Always give it on this turn.`
      : scenario.openEnded
        ? `Leave "aim" empty.`
        : "",
    isCoaching(request, scenario) && !openingTurn(request) && !request.heard.trim() && !request.missed
      ? (request.silent ?? 1) >= 2
        ? `This turn: they have said nothing for ${request.silent} turns in a row. Do not ask whether they heard you again. Give a hint: say out loud the start of a sentence in ${target} that answers your last question, stopping where their own words would go, and invite them to finish it — in ${target}, at most a few words of ${native}. Put that same start in "note". "assessment" is "stuck".`
        : `This turn: they said nothing. Say only your last question again, in fewer and easier words of ${target} — nothing in ${native}, and do not ask whether they heard you: the app says that first, in their language. "assessment" is "stuck".`
      : "",
    request.lesson ? lessonRules(request.lesson, request.heard.trim() !== "") : "",
    !request.lesson && request.study?.trim()
      ? request.studyOpen
        ? `They have not spoken yet. They chose to study. Their weak point from their record is "${request.study.trim()}". Your line names that point and says today you will work on it, in your own manner. One or two short sentences. Leave "note", "better", "meant", "smoother" and "retry" empty. Do not correct anything and do not ask them to repeat a sentence.`
        : `Their weak point from their record is "${request.study.trim()}". Keep this conversation on that point.`
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
      : request.heard.trim() ||
        // ⏭: 침묵이 아니라 다음 소재로 가자는 것 — "(silence)"로 보내면 튜터가 "들렸어요?"·같은 질문을 다시 함(운영 2026-11-13).
        (request.lesson?.skip ? "(they tapped the button to move on to something new — not silence)" : "(silence — they have not said anything)"),
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
    heard?: unknown;
    lead?: unknown;
    how?: unknown;
    fn?: unknown;
    native?: unknown;
    aim?: unknown;
    move?: unknown;
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
  // 그냥 대화는 학습자가 끝내기를 눌러 끊는다(사용자 2026-11-06 "종료시점을 명확하게… 버튼"). 튜터가 작별로 읽어도
  // 통화는 열어 두고(assessment closing → 앱이 끝내기 버튼을 강조), 닫는 건 한도 차례뿐. 점검: 짧은 "ありがとう"를
  // 작별로 읽어 6턴에 닫힌 통화가 둘.
  if (scenario.openEnded && "end" in next && !lastTurn(request)) next = { step: request.nodeId };
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
  // 자유대화: 말로는 안 짚고 고친 문장·짚는 한 줄은 화면 카드로만(사용자 2026-11-07 "공부모드는 자유대화에 텍스트나 이펙트로").
  const freeTalk = scenario.openEnded && !coaching;
  const keptBetter = better;
  const keptMeant = meant;
  const keptSmoother = smoother;

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
  const named0: Retry | "" =
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
  // 모델이 pass라 해도 기다리던 문장의 낱말을 다른 꼴로 말했으면(meetings → meeting, trabajar → trabajo) 아직 — "Nice, you got it"이 틀린 말을 칭찬함(체감 점검 2026-11-12).
  // 마지막 시도는 모델 말(괜찮다며 넘어감)을 그대로 둔다.
  const slipped = named0 === "pass" && waiting && !lastRedoTry(request) && redoFormSlip(request.redo ?? "", request.heard);
  const retry: Retry | "" = slipped ? "miss" : named0;
  const givingUp = retry === "miss" && lastRedoTry(request);
  // 튜터 수업의 note는 틀린 곳을 짚는 한 줄(앱 언어) — 카드에도 보이고, 고쳐 주는 차례에는 그 말을 먼저 소리 낸다.
  // 학습 언어로만 쓴 설명은 못 읽을 수 있어 뺀다(givesThemWords와 같은 까닭).
  const coachNote =
    (coaching || freeTalk) && (better || meant) && written && !explanationInLearningLanguage(written, request.nativeLanguage, request.targetLanguage)
      ? written
      : "";
  const offering = retry === "ask" && Boolean(better) && !meant && record.offer === true;
  // 큰 실수를 고쳐 주는 차례: 맞장구를 버리고, 짚는 말 → 고친 문장(→ 다시)만 소리 낸다.
  // 건네기(offer)·아직(miss)은 예전처럼, 문장이 빠졌을 때만 뒤에 붙인다.
  if (slipped) {
    const lead = request.nativeLanguage !== request.targetLanguage ? ALMOST_AGAIN[request.nativeLanguage] ?? "" : "";
    say = { text: [lead, request.redo?.trim() ?? ""].filter(Boolean).join(" ") };
  } else if (retry === "ask" && !offering && (better || meant)) {
    const spoken = spokenCoachFix(text, coachNote, meant || better);
    if (spoken) say = { text: spoken };
  } else {
    const repeatThis = (retry === "miss" && !givingUp) || offering ? meant || better || request.redo || "" : "";
    if (repeatThis) {
      const spokenNow = "id" in say ? bank[say.id]?.text ?? "" : say.text;
      if (!lettersOf(spokenNow).includes(lettersOf(repeatThis))) {
        say = { text: [spokenNow, repeatThis].filter(Boolean).join(" ") };
      }
    }
  }

  // 수업 통화 첫 침묵(2026-11-07): "들었어요?"는 앱 언어 고정 한 마디로 앞에 붙인다 — 모델에게 맡기면 학습 언어로 묻는 일이 잦았다(운영 ja·es).
  if (coaching && !openingTurn(request) && !request.heard.trim() && !request.missed && (request.silent ?? 1) < 2) {
    const caught = CAUGHT_IT[request.nativeLanguage];
    const spokenNow = "id" in say ? bank[say.id]?.text ?? "" : say.text;
    if (caught && request.nativeLanguage !== request.targetLanguage && !spokenNow.startsWith(caught)) {
      say = { text: [caught, spokenNow].filter(Boolean).join(" ") };
    }
  }

  return {
    assessment,
    say,
    note: freeTalk ? coachNote : coachNote || (keptBetter || keptMeant ? "" : note),
    next,
    ...(keptBetter ? { better: keptBetter } : {}),
    ...(keptMeant ? { meant: keptMeant } : {}),
    ...(keptSmoother ? { smoother: keptSmoother } : {}),
    // 다시 말해 보라고 한 차례에는 다음 질문을 얹지 않는다 — 고친 문장을 말할 차례다.
    ...(chosenFollow && retry !== "ask" && !(retry === "miss" && !givingUp) ? { follow: chosenFollow } : {}),
    ...(retry ? { retry } : {}),
    // 표현 건네기는 고친 말(better)로 온 ask에서만 — 내 말 문장을 바꿔 준 것(meant)은 건네기가 아니다.
    ...(retry === "ask" && better && !meant && record.offer === true ? { offer: true } : {}),
    ...turnMeasure(record, request, scenario),
    ...aimMeasure(record, request, scenario),
    // 묻는 차례엔 move를 버리고(운영 en 2026-11-12: 묻지도 않고 move), 물은 다음 말한 차례엔 다시 말해 보기가 아니면 늘 move — 모델 판단에 맡기지 않는다(전수 점검 2026-11-14).
    ...(request.lesson && request.heard.trim() && !request.missed && (request.lesson.step === "ask" ? request.lesson.asked && retry !== "ask" && !(retry === "miss" && !givingUp) : record.move === true) ? { move: true as const } : {}),
    ...(roundOverOf(record as { round?: unknown }, scenario.openEnded ? request.game : undefined) ? { round: "over" as const } : {}),
  };
}

/**
 * 수업 소재 지시(사용자 2026-11-12): 틀은 판정하지 않고 되받기, 큰 실수는 수업 교정 그대로(B안).
 * 단계는 앱이 정한다 — 모델은 그 단계의 일만, 그리고 "move"(다른 걸 하자/좋다)만 알려 준다.
 */
export function lessonRules(lesson: LessonRequest, spoke: boolean): string {
  const words = lesson.words.length ? ` Words that fit it: ${lesson.words.join(", ")}.` : "";
  const head = `Today's lesson point, for you only: the pattern "${lesson.pattern}" (${lesson.meaning}).${words} Never explain it, name it as grammar or show it as a rule — it lives only in the conversation.`;
  const recast = `This point is never corrected — it overrides "How you tutor" for it. If their turn could have used this pattern and did not, or got any part of the pattern wrong (a wrong form inside it counts): do not point it out, do not ask them to say it again, and leave "note", "better", "meant" and "retry" empty for it — instead, in your reply, say back what they meant using the pattern, naturally, as part of the conversation (the way a friend picks up your words) — as their words, clearly about them (after a word like "so", or turned to "you"), never as if it were about you — then carry on. When they do use it, do not praise or comment on it either; just answer. Only a big mistake outside the pattern is handled as "How you tutor" says.`;
  // 다음 틀 이름은 "다른 거 해 볼까요?"를 물은 다음 차례에만 — 다른 차례에 실으면 모델이 끌려가 다음 틀을 미리 물음(P4 점검 es "¿De dónde eres?" 2026-11-13).
  const startNext = lesson.next
    ? `, then in the same line move to a moment where "${lesson.next.pattern}" (${lesson.next.meaning}) fits, use it yourself twice and ask one easy question`
    : ", then simply carry on the conversation";
  const move = `"move" is true only when their turn asks to stop this and do something else; then answer it in a few words and ask them one easy question about their day. Otherwise false.`;
  // 첫 마디는 인사부터, ⏭는 인사 없이 바로, 말없는 차례(침묵)는 침묵 규칙("This turn")만 — 단계 지시를 붙이지 않는다.
  const lead = lesson.open ? `They have not spoken yet. Greet them in a few words, say in a few easy words that this call is a lesson where you practise one way of saying things together, then ` : lesson.skip ? `They tapped to move on to something new. Drop your last question — do not repeat it, do not ask whether they heard you, no greeting and no comment on the tap — and straight away, ` : `Now `;
  const quiet = lesson.open || lesson.skip ? ` Leave "note", "better", "meant", "smoother" and "retry" empty.` : "";
  // 숙제 리뷰(사용자 2026-11-12 설계 5절): 첫 마디에서 지난 숙제의 그 틀로 시작 — 틀린 것·답·점수는 말하지 않는다.
  const review =
    (lesson.open || lesson.skip) && lesson.review
      ? {
          missed: `This pattern was in their homework from last time, and they got it wrong there. Do not mention the mistake, the answer or a score — just bring the pattern back. `,
          undone: `This pattern was in their homework from last time, and they have not done it yet. Mention the homework once, in a few words and with no blame, then do it with them by talking. `,
          right: `They did their homework on this pattern well last time — say so in a few words. `,
        }[lesson.review]
      : "";
  const opening = lesson.open || lesson.skip;
  const silent = !spoke && !lesson.open && !lesson.skip;
  const step = (() => {
    if (silent) return "";
    switch (lesson.step) {
      case "show":
        return `${review}${lead}move the conversation to a moment from your own life where this pattern fits and use it yourself twice — two true, natural sentences about you, with something different in the blank each time (never a word that makes the sentence odd) — then ask them one easy question that they could answer with the same pattern.${quiet}`;
      case "draw":
        return `${review}${lead}ask one question that they can only answer well with this pattern — about the thing that fills the blank, in their own life or one of the words. If they have already told you that, do not ask it again: set up a small new moment in a sentence (someone new they meet, a form to fill, a phone call) where saying it as a whole sentence is natural, and ask what they would say there. A question about their day, their weekend or anything the pattern does not answer is wrong on this turn.${quiet}`;
      case "move":
        return `${review}${opening ? lead : "They have used it once. Now "}take the conversation to a different situation where the same pattern fits — another place, time or occasion in their own life — and ask them about the blank again, so that their natural answer is the pattern exactly as written (same words around the blank, about themselves), only with a new word in the blank. Not a question about someone else or about anything else.${quiet}`;
      case "ask":
        return lesson.asked
          ? // 물은 다음 말한 차례는 앱이 넘긴다 — 모델은 묻기도 move도 자주 빠뜨림(전수 점검 2026-11-13·14: 묻지 않고 내용 질문, "좋아요"에도 move 꺼짐).
            `The lesson moves on to the next point now, whatever they said. React to their turn in a few words${startNext}. Do not ask again whether to move on. Only if this turn corrects a big mistake ("How you tutor"), do just that — the move waits.`
          : `They have used it twice. React to their turn in a few words, with no question of your own, then end your line by asking once, in your own words, whether they want to try something new — that is the only question in this turn. "move" is false on this turn.`;
    }
  })();
  // move 줄(다음 틀 이름이 들어 있음)은 학습자가 말한 차례에만 — 첫 마디·⏭에 붙으면 모델이 다음 틀로 건너뜀(운영 es·en 2026-11-13).
  return [head, recast, step, lesson.step === "ask" || !spoke ? "" : move].filter(Boolean).join("\n");
}

/**
 * 튜터가 수업 틀을 고쳐 버렸나(운영 es·en 2026-11-12 — 지시만으로는 "Me llama" → 다시 말해 보기가 남음).
 * 학습자 말에는 틀이 없고 고친 문장에는 있으면, 그 고침은 틀에 대한 것이다. 틀 밖 큰 실수(학습자 말에 틀이 있음)는 그대로(B안).
 */
export function lessonDrilled(request: Pick<DirectorRequest, "lesson" | "heard" | "missed">, direction: Pick<Direction, "better" | "meant" | "retry" | "offer">): boolean {
  const pattern = request.lesson?.pattern;
  const heard = request.heard.trim();
  if (!pattern || !heard || request.missed) return false;
  const fixed = (direction.meant || direction.better || "").trim();
  if (!fixed) return false;
  return frameUsed(pattern, fixed) && !frameUsed(pattern, heard);
}

/** 다시 쓴 줄도 여전히 틀을 짚나 — 처음 줄의 짚는 말(note)을 그대로 말하거나 다시 말해 보기를 시킴(P4 점검 en "My name are" 2026-11-13: 교정 칸은 비웠는데 말로 "Say it again"). */
export function stillDrilled(first: Pick<Direction, "note">, redone: Pick<Direction, "say" | "retry">, languages?: { native: string; target: string }): boolean {
  if (redone.retry === "ask") return true;
  const note = (first.note ?? "").trim();
  const said = "text" in redone.say ? redone.say.text : "";
  if (note.length >= 2 && said.includes(note)) return true;
  // 짚는 말은 앱 언어로 나온다 — 글자가 다른 앱 언어의 글자가 섞였으면 말로 짚은 것(되받기 줄엔 앱 언어가 없음, 운영 en/ko "주어와 동사가 맞지 않아요").
  // 한자는 일본어 줄에도 있다 — 중국어 앱으로 일본어를 배우면 가르지 않는다.
  const script = languages && !(languages.native === "zh" && languages.target === "ja") ? NATIVE_SCRIPT[languages.native] : undefined;
  return Boolean(script && languages && NATIVE_SCRIPT[languages.target] !== script && script.test(said));
}

/** 앱 언어의 글자(라틴이 아닌 것만 — 라틴끼리는 가르지 못함). */
const NATIVE_SCRIPT: Partial<Record<string, RegExp>> = {
  ko: /\p{Script=Hangul}/u,
  ja: /[\p{Script=Hiragana}\p{Script=Katakana}]/u,
  zh: /\p{Script=Han}/u,
  ar: /\p{Script=Arabic}/u,
  th: /\p{Script=Thai}/u,
  hi: /\p{Script=Devanagari}/u,
  ru: /\p{Script=Cyrillic}/u,
};

/** 고쳐 버린 차례를 다시 쓰게 하는 한 줄(같은 대화 뒤에 붙임). */
export function lessonRedoPrompt(pattern: string): string {
  return `Your answer above corrected the lesson pattern "${pattern}". That is not allowed. Write this turn again, as the same JSON: "note", "better", "meant", "smoother" and "retry" empty and "offer" false. In "say": no word about a mistake in any language, no "say it again" — say back what they meant using the pattern, naturally, as part of the conversation, then carry on with a question.`;
}

/** 다시 써도 고쳐 버렸으면: 고친 칸을 다 비우고 고친 문장만 말한다(대화가 끊기지 않게, 드묾). */
export function undrilled(direction: Direction): Direction {
  const fixed = (direction.meant || direction.better || "").trim();
  const rest = { ...direction };
  delete rest.better;
  delete rest.meant;
  delete rest.retry;
  delete rest.offer;
  delete rest.smoother;
  return { ...rest, note: "", say: fixed ? { text: fixed } : direction.say };
}

/** 자유대화 채우기 측정 읽기: aimCheck를 보낸 그냥 대화 차례에서만, 학습자 말이 있을 때만. 모르는 값은 버린다. */
export function aimMeasure(
  record: { aim?: unknown },
  request: Pick<DirectorRequest, "aimCheck" | "heard" | "missed">,
  scenario: Pick<RoleplayScenario, "openEnded">,
): Pick<Direction, "aim"> {
  if (!scenario.openEnded || !request.aimCheck?.trim() || request.missed || !request.heard.trim()) return {};
  return AIM_RESULTS.includes(record.aim as AimResult) ? { aim: record.aim as AimResult } : {};
}

/**
 * 차례 재기 칸 읽기(2026-11-02). 학습자 말이 없는 차례(🙉 다시·빈 말)에는 없음. 이끌어 감은 그냥 대화에서만,
 * 모르는 값은 버린다(빈 값 = 판단 못 함).
 */
export function turnMeasure(
  record: { heard?: unknown; lead?: unknown; how?: unknown; fn?: unknown; native?: unknown },
  request: Pick<DirectorRequest, "heard" | "missed">,
  scenario: Pick<RoleplayScenario, "openEnded">,
): Pick<Direction, "heard" | "lead" | "leadHow" | "fnGroup" | "native"> {
  if (request.missed || !request.heard.trim()) return {};
  const heard = HEARDS.includes(record.heard as Heard) ? (record.heard as Heard) : undefined;
  const lead = scenario.openEnded && LEADS.includes(record.lead as Lead) ? (record.lead as Lead) : undefined;
  const leadHow = lead === "lead" && LEAD_HOW.includes(record.how as LeadHow) ? (record.how as LeadHow) : undefined;
  const fnGroup = FN_GROUPS.includes(record.fn as FnGroup) ? (record.fn as FnGroup) : undefined;
  return {
    ...(heard ? { heard } : {}),
    ...(lead ? { lead } : {}),
    ...(leadHow ? { leadHow } : {}),
    ...(fnGroup ? { fnGroup } : {}),
    ...(record.native === true ? { native: true } : {}),
  };
}
