/**
 * 기능 하나(기록 이름 op) 한 번이 얼마인지 — 비용 계산이 읽는 단 하나의 표.
 *
 * 서버는 모델을 쓰는 요청마다 `meterRequest(request, op)`로 기록하고
 * (modelCalls.ts), 그 기록에 값을 매기는 곳이 여기다. 전에는 값 매기는 규칙이
 * scripts/cost-report.mjs 안에 흩어져 있어서, 새 op가 생기면 아무도 모르게
 * "모델 호출 1번, gpt-4o-mini, 2000/300 토큰"이라는 기본값으로 계산됐다.
 *
 * 이제 MODEL_CALLS_PER_REQUEST의 op마다 여기 한 줄이 꼭 있어야 하고
 * (opCost.test.ts가 확인, CI에서 실패), 그 줄은 무엇으로 값을 매기는지와
 * 그 숫자가 잰 것인지 가정인지를 말한다. 요금별 비용 표(hub/costs.md,
 * scripts/plan-cost.mjs)와 실측 보고서(scripts/cost-report.mjs)가 같은 표를 읽는다.
 *
 * 순수 파일: 스크립트가 바로 읽을 수 있게 "@/" 경로를 쓰지 않는다.
 */

import { ROLEPLAY_TURN, SUBTITLE_PASS_TOKENS, TTS_USD_PER_MINUTE } from "./cost.ts";
import { MODEL_CALLS_PER_REQUEST } from "../server/modelCalls.ts";
import { SPEECH_DEFAULTS, codeTextModel, codeTtsModel, type TextTask } from "../aiDefaults.ts";
import { sttPerMinute, textPrice, ttsPerMinute } from "./modelPrices.ts";

/**
 * 2026-10-22부터: op는 모델 이름이 아니라 **기능(task)**을 적는다. 그 기능이 지금 쓰는 모델은 `lib/aiDefaults.ts`(코드 기본값 —
 * 서버 `llm.ts`가 쓰는 것과 같은 표)에서, 단가는 `modelPrices.ts`에서 읽는다. 그래서 기본 모델을 바꾸는 커밋 하나로
 * 비용 표(hub/costs.md, CI가 main push마다 다시 계산)가 저절로 바뀐다. op의 기능이 그 op를 기록하는 경로가 실제로 부르는
 * 기능인지는 `scripts/cost-coverage.mjs`가 확인한다.
 */
export function opModel(task: TextTask): string {
  return codeTextModel(task);
}

export type Tokens = { input: number; output: number };

/** 잰 적이 없는 모델 호출 한 번의 토큰. 가정. */
export const DEFAULT_CALL_TOKENS: Tokens = { input: 2000, output: 300 };

/** 잰 것(measured)인지, 정해 둔 가정(assumed)인지. 보고서가 가정을 따로 보여 준다. */
export type Basis = "measured" | "assumed";

export type OpCost =
  /** 글 모델 호출 — 그 기능(task)의 코드 기본 모델 단가 × MODEL_CALLS_PER_REQUEST 횟수 × 호출당 토큰. */
  | { kind: "llm"; task: TextTask; tokens?: Tokens; basis: Basis }
  /** 영상 자막 한 단계(cost.ts SUBTITLE_PASS_TOKENS, "video" 기능 모델) × 호출 횟수. */
  | { kind: "subtitle"; basis: Basis }
  /** 말 받아쓰기 한 번, 초 단위. stt: turn = 통화·방 한 마디, second = 방 교정의 두 번째 의견, video = 영상. */
  | { kind: "transcribe"; seconds: number; stt: "turn" | "second" | "video"; basis: Basis }
  /** 음성 합성 한 번, 초 단위(코드 기본 목소리 모델). 캐시에서 나간 줄은 기록되지 않는다(tts route). */
  | { kind: "tts"; seconds: number; basis: Basis }
  /** 한 번에 대략 이만큼(달러). 다른 방식으로 쪼개기 어려운 것. */
  | { kind: "flat"; usd: number; basis: Basis }
  /** 돈이 안 드는 기록(비율을 보려고 세는 것). 모델 호출 0번이어야 한다. */
  | { kind: "counter" };

/** 잰 적 없는 기본 토큰(2000/300)으로. */
const llm = (task: TextTask, tokens?: Tokens): OpCost => ({ kind: "llm", task, tokens, basis: tokens ? "measured" : "assumed" });
/** 프롬프트 길이에서 어림한 토큰(잰 것은 아님) — 기본값 2000/300보다 훨씬 짧은 호출. */
const estimated = (task: TextTask, tokens: Tokens): OpCost => ({ kind: "llm", task, tokens, basis: "assumed" });
const listen = (stt: "turn" | "second" | "video"): OpCost => ({ kind: "transcribe", seconds: ROLEPLAY_TURN.learnerSpeakingSeconds, stt, basis: "assumed" });
const counter: OpCost = { kind: "counter" };

/**
 * op마다 값 매기는 법. 새 op를 modelCalls.ts에 더하면 여기에도 한 줄 —
 * 빠지면 opCost.test.ts가 실패한다.
 */
export const OP_COST: Record<string, OpCost> = {
  chat: llm("chat"),
  chatReread: llm("chat"),
  // 답만 쓰는 짧은 호출(교정 지시 없음) — 프롬프트 길이에서 어림.
  chatReply: estimated("chat", { input: 1400, output: 120 }),
  howToSay: llm("howToSay"),
  howToSayCard: llm("howToSay"),
  // 검사 모델은 무료, 남는 것은 Blob 저장(150KB × 30일)과 전송 — 한 장 약 $0.00002 + 몇 번 보기.
  mediaUpload: { kind: "flat", usd: 0.00005, basis: "assumed" },
  // 아이콘: 검사 무료 + 256px WebP 저장·변환(서버 CPU) — 사진과 같은 자리 값.
  iconUpload: { kind: "flat", usd: 0.00005, basis: "assumed" },
  // 검사 모델은 무료, 남는 것은 서버 호출 한 번(저장 없음).
  randomFrame: { kind: "flat", usd: 0.000005, basis: "assumed" },
  chatStart: llm("chat"),
  learnerAsk: llm("learnerAsk"),
  analysisInput: llm("analysis"),
  analysisElement: llm("analysis"),
  expressionInsight: llm("expression"),
  // 원문·고친 문장·설명만 보내는 짧은 확인(2026-10-21 어림).
  chatVerify: estimated("chatVerify", { input: 900, output: 200 }),
  expressionAsk: llm("ask"),
  expressionAskRetry: llm("ask"),
  expressionAskQuick: llm("ask"),
  // 지도 그리기: 지시·단계 범위 약 3,500토큰 + 지도 JSON과 먼저 생각하는 몫 약 8,000(Sonnet, 2026-10-22 어림).
  // 나눠 그리기(2026-10-23): 뼈대만(생각 포함) — 예전 한 번에 쓰던 8000보다 짧다. 채우기는 아래 따로.
  curriculumGenerate: estimated("curriculumMap", { input: 3500, output: 4000 }),
  curriculumMapFill: estimated("curriculumMapFill", { input: 4000, output: 1800 }),
  // 단계 다섯 개 글(약 120줄) 한 번 옮기기, 학습 언어 × 앱 언어마다 한 번(2026-10-22 어림).
  stageCopy: estimated("translate", { input: 3500, output: 4500 }),
  // 빈도 단어 50개 카드 한 번 만들기 + 뜻 100줄 옮기기(2026-10-29 어림), 묶음 × 앱 언어마다 한 번.
  wordCards: estimated("translate", { input: 2500, output: 9000 }),
  // 꺼내 쓰기 문제 여섯 줄 만들기 + 뜻 여섯 줄 옮기기(2026-10-30 어림), 틀 묶음 × 앱 언어마다 한 번.
  recallPrompts: estimated("translate", { input: 600, output: 500 }),
  // 문장구조 설명 세 줄 + 주고받기 세 번 만들기 + 뜻 아홉 줄 옮기기(2026-10-30 어림), 틀 × 앱 언어마다 한 번.
  frameLesson: estimated("translate", { input: 700, output: 700 }),
  qbankGrow: estimated("translate", { input: 500, output: 400 }),
  // 단계 하나의 줄(약 150~250) 읽는 법 — 60줄 묶음 서너 번(2026-10-29 어림).
  stageReadings: estimated("translate", { input: 6000, output: 9000 }),
  // 영어 구문 목록(38개) 분류 프롬프트 약 3,400자 + 문장 두 줄, 답은 max_tokens 150의 짧은 JSON(2026-10-21 어림).
  learnerObserve: estimated("learnerRead", { input: 900, output: 80 }),
  curriculumMissions: llm("curriculum"),
  learnerPick: llm("curriculum"),
  notesPlace: llm("notes"),
  // 틀 목록(1~3단계 최대 약 60줄, 2026-10-28 "다시 연습")이 더해져 약 800토큰 늘었다.
  notebookFix: estimated("notes", { input: 2300, output: 120 }),
  // 칸 목록(지금·뒤 단계 문법 + 고정 칸 약 60줄) + 표현 30개, 답은 30줄 JSON(2026-10-24 어림).
  notebookPhrases: estimated("notes", { input: 2700, output: 900 }),
  // 칸 목록 + 고른 부분·문장, 답은 칸 id + 한 줄 설명(2026-10-24 어림).
  notebookLocate: estimated("notes", { input: 2400, output: 80 }),
  missionCheck: llm("mission"),
  // 실수 종류 프롬프트 약 1,100~2,200자(이미 아는 실수 30개까지) + 두 줄, 답 짧은 JSON(2026-10-21 어림).
  weakRead: estimated("learnerRead", { input: 600, output: 80 }),
  weakMission: llm("curriculum"),
  vocabGloss: llm("vocab"),
  learningSpans: llm("analysis"),
  translate: llm("translate"),
  tts: { kind: "tts", seconds: 6, basis: "assumed" },
  videoPrepare: { kind: "subtitle", basis: "assumed" },
  videoWindow: { kind: "subtitle", basis: "assumed" },
  videoGloss: llm("video"),
  videoAnalyze: llm("video"),
  videoGlossKept: counter,
  translateKept: counter,
  roleplayListen: listen("turn"),
  roomListen: listen("turn"),
  // 방 내 줄 교정: 교정 지시(약 2,400자) + 한 마디·앞 6줄, 답은 짧은 JSON(2026-10-22 어림).
  roomFix: estimated("roomFix", { input: 900, output: 120 }),
  // 두 번째 받아쓰기는 확신이 어중간한 조각만(조각 하나 몇 초).
  roomFixListen: listen("second"),
  // 라이어 게임: 제시어(주제·언어 최대 6개 JSON), 답 판정(예/아니오). 2026-10-23 어림.
  roomGameWord: estimated("roomGame", { input: 450, output: 160 }),
  roomGameJudge: estimated("roomGame", { input: 220, output: 20 }),
  // 마피아 배경 이야기: 무대 이름 + 두 문장 × 언어 최대 6개.
  roomGameStory: estimated("roomGame", { input: 250, output: 500 }),
  roleplayCorrect: llm("roleplayTutor"),
  roleplayTurn: { kind: "llm", task: "roleplayTutor", tokens: { input: ROLEPLAY_TURN.input, output: ROLEPLAY_TURN.output }, basis: "measured" },
  roleplayContext: llm("roleplayContext"),
  // 장면·대화 약 1,500토큰 + 이유 문장(추론 모델이면 생각 토큰 포함 약 800, 2026-10-22 어림 — 예전 정액 $0.002와 같은 규모).
  roleplayReview: estimated("roleplayReview", { input: 1500, output: 800 }),
  roleplayPractice: llm("roleplayPractice"),
  scriptJudge: llm("scriptJudge"),
  scriptRecheck: llm("scriptRecheck"),
  quizTypedCheck: estimated("scriptJudge", { input: 250, output: 10 }),
  scriptChoices: llm("scriptChoices"),
  roleplayBankLine: counter,
  roleplayInventedLine: counter,
  roleplaySplitTurn: counter,
  roleplayReactionLine: counter,
  roleplaySession: counter,
  expressionUnits: llm("analysis"),
  vocabSearch: llm("vocab"),
  contentDiscovery: llm("video"),
};

export function callsPerRequest(op: string): number {
  return (MODEL_CALLS_PER_REQUEST as Record<string, number>)[op] ?? 1;
}

function tokensUsd(model: string, tokens: Tokens): number {
  const price = textPrice(model);
  return (tokens.input * price.input + tokens.output * price.output) / 1_000_000;
}

const STT_MODEL = {
  turn: () => SPEECH_DEFAULTS.turnTranscribe,
  second: () => SPEECH_DEFAULTS.secondTranscribe,
  video: () => SPEECH_DEFAULTS.videoTranscribe,
} as const;

/** 비용 표가 이 op에 매긴 모델(보고서에 보이려고). 모델이 없는 op는 null. */
export function opPricedModel(op: string): string | null {
  const spec = OP_COST[op];
  if (!spec) return null;
  switch (spec.kind) {
    case "llm":
      return opModel(spec.task);
    case "subtitle":
      return opModel("video");
    case "transcribe":
      return STT_MODEL[spec.stt]();
    case "tts":
      return codeTtsModel();
    default:
      return null;
  }
}

/**
 * 기록 한 번(요청 한 번)의 달러.
 * `measured`는 서버가 잰 호출당 평균 토큰(usage:tok:*)으로, 있으면 표의 값보다 앞선다.
 * 표에 없는 op는 기본값(채팅 모델 한 번)으로 계산하지만, 테스트가 그런 op를 막는다.
 */
export function opUsd(op: string, measured?: Record<string, Tokens>): number {
  const spec = OP_COST[op] ?? llm("chat");
  const calls = callsPerRequest(op);
  switch (spec.kind) {
    case "counter":
      return 0;
    case "flat":
      return spec.usd;
    case "transcribe":
      return (spec.seconds / 60) * sttPerMinute(STT_MODEL[spec.stt]());
    case "tts":
      return (spec.seconds / 60) * ttsPerMinute(codeTtsModel());
    case "subtitle":
      return calls * tokensUsd(opModel("video"), SUBTITLE_PASS_TOKENS);
    case "llm":
      return calls * tokensUsd(opModel(spec.task), measured?.[op] ?? spec.tokens ?? DEFAULT_CALL_TOKENS);
  }
}

/** 잰 값이 아니라 가정으로 값을 매기는 op들 — 보고서의 "믿기 어려운 숫자" 목록. */
export function assumedOps(): string[] {
  return Object.entries(OP_COST)
    .filter(([op, spec]) => spec.kind !== "counter" && spec.basis === "assumed" && callsPerRequest(op) > 0)
    .map(([op]) => op);
}

/**
 * 채팅 한 통이 부르는 기록들. 답(chat) 뒤에 문장 읽기(learnerObserve)와,
 * 고친 줄이면 실수 종류 읽기(weakRead)가 따라간다(chat route `after`).
 * 새 앱(2026-10-22~)은 답만 쓰는 호출(chatReply)이 교정 호출과 나란히 늘 붙는다 — 옛 앱엔 없지만 넉넉히 넣어 센다.
 * 최악 계산은 넷 다(모든 문장이 길고 틀린 영어 학습자), 다시 쓰기(chatReread)는 옛 앱에서만·드물어 뺀다.
 */
export const CHAT_MESSAGE_OPS = ["chat", "chatReply", "learnerObserve", "weakRead", "notebookFix"] as const;

export function chatMessageUsd(measured?: Record<string, Tokens>): number {
  return CHAT_MESSAGE_OPS.reduce((sum, op) => sum + opUsd(op, measured), 0);
}

/**
 * 보통 한 통: 따라붙는 호출이 도는 비율(가정, 2026-10-21).
 * - learnerObserve: 영어 학습자만(구문 목록이 영어뿐) + 짧고 맞은 줄은 건너뜀(learner/readGate.ts) → 셋에 하나꼴.
 * - weakRead: 지도가 있는 사람의 고칠 데 있는 줄만 → 셋에 하나꼴.
 * - notebookFix: 고칠 데 있는 줄을 노트 칸에 넣기(2026-10-23, 지도 없어도) → 셋에 하나꼴.
 * 2026-10-21부터 두 기록은 실제로 부를 때만 세므로, cost-report.mjs의 op별 횟수 ÷ chat 횟수가 이 비율의 실측이다.
 */
export const CHAT_FOLLOW_SHARE = { learnerObserve: 0.33, weakRead: 0.33, notebookFix: 0.33, basis: "assumed" as Basis };

export function chatMessageTypicalUsd(measured?: Record<string, Tokens>): number {
  return (
    opUsd("chat", measured) +
    opUsd("chatReply", measured) +
    CHAT_FOLLOW_SHARE.learnerObserve * opUsd("learnerObserve", measured) +
    CHAT_FOLLOW_SHARE.weakRead * opUsd("weakRead", measured) +
    CHAT_FOLLOW_SHARE.notebookFix * opUsd("notebookFix", measured)
  );
}

/**
 * 오늘의 팩 한 번(12문답, 약 7분). 질문은 은행의 녹음이라 합성이 거의 없고,
 * 문답마다 받아쓰기 한 번과 캐릭터의 판단 한 번이 든다. 맞장구·벗어난 턴만
 * 새로 합성한다고 보고 그 비율을 가정한다(hub/drafts/daily-pack.md "비용").
 */
export const PACK = {
  // Twelve questions and up to three follow-ups of the tutor's own (pack.ts PACK_FOLLOWS).
  items: 12,
  follows: 3,
  // The questions come from the shared cache; reactions now name what was said
  // and follow-ups are new lines, so about a third of what is spoken is synthesised.
  synthesisedShare: 0.35,
  basis: "assumed" as Basis,
};

export function packUsd(): number {
  const perItem =
    opUsd("roleplayListen") +
    opUsd("roleplayTurn") +
    (ROLEPLAY_TURN.tutorSpeakingSeconds / 60) * TTS_USD_PER_MINUTE * PACK.synthesisedShare;
  return (PACK.items + PACK.follows) * perItem;
}
