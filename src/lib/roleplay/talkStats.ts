/**
 * 대화 소재(통화 끝 튜터 메모 호출이 고르는 topics — memory.ts·listen.ts) 목록과, 옛 통화 카드에 남아 있는 숫자 모양(callNotes talk).
 * 대화 비교 표(처음 3통 vs 최근 3통 숫자)는 2026-11-28 말풍선 장면(talkMemory.ts answerGain)으로 바꾸며 지웠다 — 새 통화는 숫자를 남기지 않는다.
 */

/** 소재 id — Quizbank 주제(vocabBank TOPICS) 가운데 대화 소재가 되는 것. 이름은 copy topic*. */
export const TALK_TOPICS = ["people", "food", "home", "work", "health", "travel", "shopping", "time", "feelings", "nature", "society"] as const;
export type TalkTopic = (typeof TALK_TOPICS)[number];

/** 옛 통화 카드(2026-11-28 전)에 남은 숫자 — 읽는 곳은 없고, 저장 모양만. */
export type TalkStats = {
  /** 센 내 줄 수. */
  n: number;
  /** 줄당 낱말 수 평균. */
  words: number;
  /** 2단계 이상 낱말 몫(0~1, 빈도 목록에 있는 내용어 중). */
  level: number;
  /** 고쳐진 줄 몫(0~1). */
  fixed: number;
  /** 내가 물은 줄 수. */
  asked: number;
  /** 처음 3분 내 낱말 수 · 내 말의 몫(0~1). 줄 시각이 없으면 없음. */
  mine3?: number;
  share?: number;
  /** 문형이 든 줄 몫(0~1) · 쓴 문법·표현 가짓수 · 가장 높은 단계(0 = 없음) — 표시가 온 통화만. */
  shaped?: number;
  kinds?: number;
  top?: number;
};

/** 서버 답의 소재를 목록 안 것만, 둘까지. */
export function readTopics(value: unknown): TalkTopic[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((one): one is TalkTopic => typeof one === "string" && (TALK_TOPICS as readonly string[]).includes(one)))].slice(0, 2);
}
