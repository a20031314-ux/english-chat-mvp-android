"use client";

import { createContext, useContext } from "react";

/**
 * My 큰 칸마다 색(2026-11-01 사용자 "ui 색상은 각각의 탭에 맞춰줘"): 칸 테두리·제목만 칸 색이던 것을 칸 안의 강조(빈칸·고른 것·정답 보기·체크 줄·시험 줄)까지.
 * Stagebank 노랑(status-learned, 빈칸은 예전 amber 그대로) · Quizbank 초록(good) · Logbank 하늘(info) — NotebookSection LAYER_TONE과 같은 색.
 * 칸이 BankToneProvider로 감싸면 그 안의 퀴즈·시트(포털이어도 React 문맥은 이어짐)가 useBankTone으로 받는다. 감싸지 않은 곳(수업·시험 화면 등)은 stage.
 * 맞음 초록(good)·틀림 빨강(bad, 2026-11-03 사용자 "오답 표시는 빨간색")은 칸과 상관없이 그대로. hub/app/DESIGN.md "My 큰 칸 색".
 */
export type BankToneId = "stage" | "keep" | "log";

export type BankTone = {
  /** 답한 뒤 보여 주는 정답·예문 속 조각. */
  accent: string;
  /** 답하기 전 빈칸(＿＿＿·①②). */
  blank: string;
  /** 누른 낱말·보기(답하기 전). */
  pick: string;
  /** 입력칸 힌트 글자 · 포커스 테두리. */
  hint: string;
  focus: string;
  /** 줄 버튼(시험 줄·지금 할 것 카드). */
  soft: string;
  /** 고른 칩·줄. */
  on: string;
  /** 밑줄 색. */
  mark: string;
  /** 고른 탭·토글 칩(2026-11-03 사용자 "탭별로 색을 상단 버튼에 맞춰줘" — 위 칸 이름 버튼과 같은 모양). */
  chip: string;
  /** 그래프·게이지 면(Logbank 육각형). */
  fill: string;
  stroke: string;
  bar: string;
};

const TONES: Record<BankToneId, BankTone> = {
  stage: {
    accent: "text-status-learned",
    blank: "text-amber-200",
    pick: "border-amber-300/70 bg-amber-300/10 text-amber-100",
    hint: "placeholder:text-amber-200/70",
    focus: "focus:border-amber-300/60",
    soft: "border-status-learned/50 bg-status-learned/[0.06] hover:bg-status-learned/10",
    on: "border-status-learned/60 bg-status-learned/10",
    mark: "decoration-status-learned",
    chip: "border border-status-learned/60 bg-status-learned/10 text-status-learned",
    fill: "fill-status-learned",
    stroke: "stroke-status-learned",
    bar: "bg-status-learned",
  },
  keep: {
    accent: "text-good",
    blank: "text-good",
    pick: "border-good/70 bg-good/10 text-ink",
    hint: "placeholder:text-good/70",
    focus: "focus:border-good/60",
    soft: "border-good/50 bg-good/[0.06] hover:bg-good/10",
    on: "border-good/60 bg-good/10",
    mark: "decoration-good",
    chip: "border border-good/60 bg-good/10 text-good",
    fill: "fill-good",
    stroke: "stroke-good",
    bar: "bg-good",
  },
  log: {
    accent: "text-info",
    blank: "text-info",
    pick: "border-info/70 bg-info/10 text-ink",
    hint: "placeholder:text-info/70",
    focus: "focus:border-info/60",
    soft: "border-info/50 bg-info/[0.06] hover:bg-info/10",
    on: "border-info/60 bg-info/10",
    mark: "decoration-info",
    chip: "border border-info/60 bg-info/10 text-info",
    fill: "fill-info",
    stroke: "stroke-info",
    bar: "bg-info",
  },
};

const BankToneContext = createContext<BankToneId>("stage");

export function BankToneProvider({ tone, children }: { tone: BankToneId; children: React.ReactNode }) {
  return <BankToneContext.Provider value={tone}>{children}</BankToneContext.Provider>;
}

/** 칸을 이미 아는 곳(Quizbank 몸통을 만드는 TodayPlan처럼 칸 밖에서 그리는 코드)이 직접 고른다. */
export function bankTone(id: BankToneId): BankTone {
  return TONES[id];
}

export function useBankTone(): BankTone {
  return TONES[useContext(BankToneContext)];
}
