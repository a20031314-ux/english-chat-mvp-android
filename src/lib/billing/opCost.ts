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

import {
  CALL_TRANSCRIBE_USD_PER_MINUTE,
  MINI_USD_PER_MTOK,
  ROLEPLAY_TURN,
  SUBTITLE_PASS_TOKENS,
  TTS_USD_PER_MINUTE,
  TUTOR_USD_PER_MTOK,
} from "./cost.ts";
import { MODEL_CALLS_PER_REQUEST } from "../server/modelCalls.ts";

export type ModelName = "mini" | "4.1-mini" | "4.1" | "sonnet-5.5";

/** 100만 토큰당 달러. 출처는 cost.ts PRICE_SOURCE. */
export const MODEL_USD_PER_MTOK: Record<ModelName, { input: number; output: number }> = {
  mini: MINI_USD_PER_MTOK, // gpt-4o-mini, chatModel() 기본값
  "4.1-mini": TUTOR_USD_PER_MTOK,
  "4.1": { input: 2, output: 8 },
  // Claude Sonnet 5.5 (platform.claude.com pricing, 2026-10-21). 확인 모델(llm.ts high 등급, 결정 2026-10-21).
  "sonnet-5.5": { input: 2, output: 10 },
};

export type Tokens = { input: number; output: number };

/** 잰 적이 없는 모델 호출 한 번의 토큰. 가정. */
export const DEFAULT_CALL_TOKENS: Tokens = { input: 2000, output: 300 };

/** 잰 것(measured)인지, 정해 둔 가정(assumed)인지. 보고서가 가정을 따로 보여 준다. */
export type Basis = "measured" | "assumed";

export type OpCost =
  /** 글 모델 호출. MODEL_CALLS_PER_REQUEST 횟수 × 호출당 토큰 값. */
  | { kind: "model"; model: ModelName; tokens?: Tokens; basis: Basis }
  /** 영상 자막 한 단계(cost.ts SUBTITLE_PASS_TOKENS, gpt-4o-mini) × 호출 횟수. */
  | { kind: "subtitle"; basis: Basis }
  /** 말 받아쓰기 한 번, 초 단위. */
  | { kind: "transcribe"; seconds: number; basis: Basis }
  /** 음성 합성 한 번, 초 단위. 캐시에서 나간 줄은 기록되지 않는다(tts route). */
  | { kind: "tts"; seconds: number; basis: Basis }
  /** 한 번에 대략 이만큼(달러). 다른 방식으로 쪼개기 어려운 것. */
  | { kind: "flat"; usd: number; basis: Basis }
  /** 돈이 안 드는 기록(비율을 보려고 세는 것). 모델 호출 0번이어야 한다. */
  | { kind: "counter" };

const mini = (tokens?: Tokens): OpCost => ({ kind: "model", model: "mini", tokens, basis: tokens ? "measured" : "assumed" });
/** 프롬프트 길이에서 어림한 토큰(잰 것은 아님) — 기본값 2000/300보다 훨씬 짧은 호출. */
const estimated = (tokens: Tokens): OpCost => ({ kind: "model", model: "mini", tokens, basis: "assumed" });
const tutor: OpCost = { kind: "model", model: "4.1-mini", basis: "assumed" };
const counter: OpCost = { kind: "counter" };

/**
 * op마다 값 매기는 법. 새 op를 modelCalls.ts에 더하면 여기에도 한 줄 —
 * 빠지면 opCost.test.ts가 실패한다.
 */
export const OP_COST: Record<string, OpCost> = {
  chat: mini(),
  chatReread: mini(),
  // 답만 쓰는 짧은 호출(교정 지시 없음) — 프롬프트 길이에서 어림.
  chatReply: estimated({ input: 1400, output: 120 }),
  howToSay: mini(),
  howToSayCard: mini(),
  roomHint: mini(),
  // 검사 모델은 무료, 남는 것은 Blob 저장(150KB × 30일)과 전송 — 한 장 약 $0.00002 + 몇 번 보기.
  mediaUpload: { kind: "flat", usd: 0.00005, basis: "assumed" },
  // 검사 모델은 무료, 남는 것은 서버 호출 한 번(저장 없음).
  randomFrame: { kind: "flat", usd: 0.000005, basis: "assumed" },
  chatStart: mini(),
  learnerAsk: mini(),
  analysisInput: mini(),
  analysisElement: mini(),
  expressionInsight: mini(),
  // 원문·고친 문장·설명만 보내는 짧은 확인(2026-10-21 어림). 지금 기본은 OpenAI(OPENAI_VERIFY_MODEL), MODEL_ROUTES로 Sonnet.
  chatVerify: { kind: "model", model: "sonnet-5.5", tokens: { input: 900, output: 200 }, basis: "assumed" },
  expressionAsk: tutor,
  expressionAskRetry: tutor,
  expressionAskQuick: tutor,
  curriculumGenerate: mini(),
  // 단계 다섯 개 글(약 120줄) 한 번 옮기기, 학습 언어 × 앱 언어마다 한 번(2026-10-22 어림).
  stageCopy: estimated({ input: 3500, output: 4500 }),
  // 영어 구문 목록(38개) 분류 프롬프트 약 3,400자 + 문장 두 줄, 답은 max_tokens 150의 짧은 JSON(2026-10-21 어림).
  learnerObserve: estimated({ input: 900, output: 80 }),
  curriculumMissions: mini(),
  learnerPick: { kind: "model", model: "4.1", basis: "assumed" },
  notesPlace: mini(),
  missionCheck: tutor,
  // 실수 종류 프롬프트 약 1,100~2,200자(이미 아는 실수 30개까지) + 두 줄, 답 짧은 JSON(2026-10-21 어림).
  weakRead: estimated({ input: 600, output: 80 }),
  weakMission: mini(),
  vocabGloss: mini(),
  learningSpans: mini(),
  translate: mini(),
  tts: { kind: "tts", seconds: 6, basis: "assumed" },
  videoPrepare: { kind: "subtitle", basis: "assumed" },
  videoWindow: { kind: "subtitle", basis: "assumed" },
  videoGloss: mini(),
  videoAnalyze: mini(),
  videoGlossKept: counter,
  translateKept: counter,
  roleplayListen: { kind: "transcribe", seconds: ROLEPLAY_TURN.learnerSpeakingSeconds, basis: "assumed" },
  roomListen: { kind: "transcribe", seconds: ROLEPLAY_TURN.learnerSpeakingSeconds, basis: "assumed" },
  roleplayCorrect: mini(),
  roleplayTurn: { kind: "model", model: "4.1-mini", tokens: { input: ROLEPLAY_TURN.input, output: ROLEPLAY_TURN.output }, basis: "measured" },
  roleplayContext: mini(),
  roleplayReview: { kind: "flat", usd: 0.002, basis: "assumed" },
  roleplayPractice: tutor,
  roleplayBankLine: counter,
  roleplayInventedLine: counter,
  roleplaySplitTurn: counter,
  roleplayReactionLine: counter,
  roleplaySession: counter,
  expressionUnits: mini(),
  vocabSearch: mini(),
  contentDiscovery: mini(),
};

export function callsPerRequest(op: string): number {
  return (MODEL_CALLS_PER_REQUEST as Record<string, number>)[op] ?? 1;
}

function tokensUsd(model: ModelName, tokens: Tokens): number {
  const price = MODEL_USD_PER_MTOK[model];
  return (tokens.input * price.input + tokens.output * price.output) / 1_000_000;
}

/**
 * 기록 한 번(요청 한 번)의 달러.
 * `measured`는 서버가 잰 호출당 평균 토큰(usage:tok:*)으로, 있으면 표의 값보다 앞선다.
 * 표에 없는 op는 기본값(gpt-4o-mini 한 번)으로 계산하지만, 테스트가 그런 op를 막는다.
 */
export function opUsd(op: string, measured?: Record<string, Tokens>): number {
  const spec = OP_COST[op] ?? mini();
  const calls = callsPerRequest(op);
  switch (spec.kind) {
    case "counter":
      return 0;
    case "flat":
      return spec.usd;
    case "transcribe":
      return (spec.seconds / 60) * CALL_TRANSCRIBE_USD_PER_MINUTE;
    case "tts":
      return (spec.seconds / 60) * TTS_USD_PER_MINUTE;
    case "subtitle":
      return calls * tokensUsd("mini", SUBTITLE_PASS_TOKENS);
    case "model":
      return calls * tokensUsd(spec.model, measured?.[op] ?? spec.tokens ?? DEFAULT_CALL_TOKENS);
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
export const CHAT_MESSAGE_OPS = ["chat", "chatReply", "learnerObserve", "weakRead"] as const;

export function chatMessageUsd(measured?: Record<string, Tokens>): number {
  return CHAT_MESSAGE_OPS.reduce((sum, op) => sum + opUsd(op, measured), 0);
}

/**
 * 보통 한 통: 따라붙는 호출이 도는 비율(가정, 2026-10-21).
 * - learnerObserve: 영어 학습자만(구문 목록이 영어뿐) + 짧고 맞은 줄은 건너뜀(learner/readGate.ts) → 셋에 하나꼴.
 * - weakRead: 지도가 있는 사람의 고칠 데 있는 줄만 → 셋에 하나꼴.
 * 2026-10-21부터 두 기록은 실제로 부를 때만 세므로, cost-report.mjs의 op별 횟수 ÷ chat 횟수가 이 비율의 실측이다.
 */
export const CHAT_FOLLOW_SHARE = { learnerObserve: 0.33, weakRead: 0.33, basis: "assumed" as Basis };

export function chatMessageTypicalUsd(measured?: Record<string, Tokens>): number {
  return (
    opUsd("chat", measured) +
    opUsd("chatReply", measured) +
    CHAT_FOLLOW_SHARE.learnerObserve * opUsd("learnerObserve", measured) +
    CHAT_FOLLOW_SHARE.weakRead * opUsd("weakRead", measured)
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
