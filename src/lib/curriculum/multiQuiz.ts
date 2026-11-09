import { typedRight, type QuizQuestion } from "./quiz.ts";
export type MultiQuestion = Extract<QuizQuestion, { kind: "multi" }>;
export type SpotsQuestion = Extract<QuizQuestion, { kind: "spots" }>;
export type MultiOptions = {
  stage: number;
  seed: string;
  /** 이 소재를 이미 맞혔나(한 소재 문제를 지난 것만 복합에). */
  learned: (key: string) => boolean;
  /** 이 갈래 소재가 적어도 하나(문법 탭 = f|, 표현 탭 = e|). */
  wants?: (key: string) => boolean;
  /** 먼저 낼 순서(작을수록 먼저 — 잊을 때가 가까운 소재). */
  rank?: (key: string) => number;
  /** 이번에 이미 낸 문장. */
  avoid?: ReadonlySet<string>;
};

/** 복합 빈칸 하나의 채점(빈칸 쓰기와 같은 기준). */
export function multiBlankRight(blank: MultiQuestion["blanks"][number], typed: string, language: string): "exact" | "loose" | false {
  return typedRight(blank.answer, typed, { language, near: blank.near });
}

/** 복합 틀린 곳 하나의 채점 — 틀린 꼴 그대로 다시 친 것은 틀림. */
export function spotsFixRight(error: SpotsQuestion["errors"][number], typed: string, language: string): "exact" | "loose" | false {
  return typedRight(error.want, typed, { language, near: error.near });
}
