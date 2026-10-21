/**
 * 단계 범위 — 학습 언어마다 한 번 정해 둔 "이만큼 하면 여기까지 간다"(2026-10-22, hub/drafts/map-premium-2026-10-22.md).
 *
 * 지도를 사람마다 처음부터 그리면 같은 상황이 네 칸으로 쪼개지고 지시문의 예시를 베꼈다. 그래서 뼈대는 언어별로 고정하고,
 * 사람마다 다른 것은 시작 단계(대화 예시로 고름)와 단계 안의 순서·비중(체크·기록)만 둔다.
 *
 * 화면에 레벨 이름·숫자는 보이지 않는다(STATE "수준 안 보임"). 단계는 대화 예시와 "할 수 있게 되는 것"으로만 보인다.
 * `band`는 안에서만: 영어 구문 목록(learner/constructions.ts)과 잇는 데 쓴다.
 *
 * 글은 영어(en)와 한국어(ko)를 손으로 써 두고, 다른 앱 언어는 서버가 한 번 옮겨 저장한다(server/stageCopy.ts).
 * 학습 언어 글(대화 줄·표현·문법 예문)은 그 언어 그대로.
 */

/** 앱 언어 글. ko는 학습 언어가 한국어일 때 빠질 수 있다(그때 대화 줄은 이미 한국어). */
export type StageText = { en: string; ko?: string };

export type StageLine = {
  who: "A" | "B";
  /** 학습 언어. */
  text: string;
  /** 뜻. */
  en: string;
  ko?: string;
};

export type StageDialogue = {
  /** 어디서 누구와(한 줄). */
  setting: StageText;
  lines: StageLine[];
};

export type StageGrammar = {
  name: StageText;
  /** 학습 언어 예문 하나. */
  example: string;
  /** 영어만: learner/constructions.ts id — 채팅 문장으로 숙지를 판단한다. */
  constructionId?: string;
};

export type Stage = {
  /** "en-1" … "en-5". */
  id: string;
  /** 1 = 가장 쉬움. */
  order: number;
  /** 안에서만. 화면에 보이지 않는다. */
  band: "A1" | "A2" | "B1" | "B2" | "C1";
  /** 이 단계를 한 줄로("간단한 자기소개와 주문을 해낸다") — 레벨 이름 아님. */
  title: StageText;
  /** 마치면 할 수 있는 것 5~7개. */
  canDo: StageText[];
  /** 이 단계가 다루는 장면 3~5개. */
  situations: StageText[];
  grammar: StageGrammar[];
  /** 학습 언어의 핵심 표현 15~25개, 짧은 덩어리(1~5낱말). 표현 장부 숙지로 진행을 잰다. */
  expressions: string[];
  listening: StageText;
  pronunciation: StageText;
  /** [0] 수준 고르기에 보이는 대화, [1] 지도 위 "목표" 대화(다른 장면). */
  dialogues: [StageDialogue, StageDialogue];
};

export type StageLadder = {
  language: string;
  /** 데이터를 고치면 올린다 — 옮긴 글 저장(stageCopy)이 새로 만들어진다. */
  version: number;
  stages: Stage[];
};
