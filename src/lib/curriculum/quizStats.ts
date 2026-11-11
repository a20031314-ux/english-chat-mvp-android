/**
 * 퀴즈 측정(6단계, 설계안 §9 — "단계냐 유형이냐"): 답마다 종류 × 사다리 칸 × 단계 띠 × 게이지 × 무작위 모양 여부 × 맞음/틀림을 세어
 * 열 개씩 서버에 보낸다(/api/curriculum/quiz-stats — 숫자만, 학습자 글·누가 보냈는지 없음). 게이지를 옮긴 것도 센다.
 * 열에 하나는 사다리와 상관없이 칸을 무작위로 낸다(RANDOM_SHARE) — 단계 효과와 유형 효과를 떼어 보려고.
 */
import { apiUrl } from "../apiBase";

export const RANDOM_SHARE = 0.1;
const QUEUE = "quizStats.v1";
const FLUSH_AT = 10;

export type StatEvent = { f: string };

/** 답 하나의 칸 이름: 종류|칸(낱말 0)|단계|게이지|무작위(1/0)|ok·miss. */
export function statField(kind: string, rung: number, stage: number, gauge: number, random: boolean, correct: boolean): string {
  return `${kind}|${rung}|${stage}|${gauge}|${random ? 1 : 0}|${correct ? "ok" : "miss"}`;
}

/** 게이지를 옮김: gauge|이전>이후|단계. */
export function gaugeField(from: number, to: number, stage: number): string {
  return `gauge|${from}>${to}|${stage}`;
}

export function noteStat(language: string, field: string): void {
  try {
    const key = `${QUEUE}.${language}`;
    const queue = [...((JSON.parse(localStorage.getItem(key) ?? "[]") as string[]) ?? []), field].slice(-200);
    if (queue.length < FLUSH_AT) {
      localStorage.setItem(key, JSON.stringify(queue));
      return;
    }
    localStorage.setItem(key, "[]");
    void fetch(apiUrl("/api/curriculum/quiz-stats"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ language, fields: queue }) }).catch(() => undefined);
  } catch {
    // 못 세면 그만.
  }
}
