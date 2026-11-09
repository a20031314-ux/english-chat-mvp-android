"use client";

import { useSyncExternalStore } from "react";

/**
 * 다음 추천(사용자 2026-11-02 "권장 학습 흐름으로 해당 학습을 끝내거나 끌 때 다른 학습으로 이동 버튼"):
 * 오늘 할 것(TodayPlan)이 남은 항목을 차례대로 올려 두고, 수업(문장구조·표현·문법 수업, 상황, 꺼내 쓰기)은
 * 끝 화면에 그 첫 항목으로 가는 버튼을, 닫을 때는 My 아래에 잠깐 같은 줄(UpNextBar)을 띄운다.
 * 오늘 할 것을 다 했으면 Quizbank(NotebookSection이 fallback으로 올림). 이 폰 화면 상태만 — 저장하지 않는다.
 */

export type UpNext = { id: string; label: string; open: () => void };

const queue: UpNext[] = [];
const fallback: UpNext | null = null;
let offer: { own: string; at: number } | null = null;
let leaving = false;
let offerTimer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();
const OFFER_MS = 15_000;

const notify = () => {
  for (const listener of listeners) listener();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** 지금 연 것(own)을 빼고 다음 추천 하나. */
export function pickUpNext(own?: string): UpNext | null {
  return queue.find((one) => one.id !== own) ?? fallback;
}

/** 수업을 닫을 때 — My 아래에 다음 추천 줄을 잠깐(버튼으로 바로 넘어가는 중이면 안 띄움). */
export function offerUpNext(own: string): void {
  if (leaving) return;
  offer = { own, at: Date.now() };
  // 15초 지나면 저절로 거둔다(My 밖에서 닫았다가 나중에 My로 와도 옛 줄이 안 뜨게).
  if (offerTimer) clearTimeout(offerTimer);
  offerTimer = setTimeout(dismissUpNext, OFFER_MS);
  notify();
}

export function dismissUpNext(): void {
  if (!offer) return;
  offer = null;
  notify();
}

/** 다음 추천으로 넘어가기: 지금 화면을 닫고(close) 다음 것을 연다. 닫을 때 줄은 띄우지 않는다. */
export function goUpNext(next: UpNext, close?: () => void): void {
  leaving = true;
  offer = null;
  try {
    close?.();
  } finally {
    leaving = false;
  }
  window.setTimeout(() => next.open(), 0);
  notify();
}

let version = 0;
listeners.add(() => {
  version += 1;
});

const getVersion = () => version;

/** 다음 추천(지금 연 것 빼고) — 바뀌면 다시 그린다. */
export function useUpNext(own?: string): UpNext | null {
  useSyncExternalStore(subscribe, getVersion, getVersion);
  return pickUpNext(own);
}
