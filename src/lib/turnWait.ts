/**
 * 내 말 기다리기 — 통화에서 멈춘 뒤 몇 초 조용해야 튜터 차례로 넘기나(사용자 2026-11-23 "사용자가 대화 속도를 조절하게", 0.9~2초).
 * 채팅 ⋮ "말 빠르기" 아래와 통화 ⓘ 창에서 고르고, 이 기기에 하나만 기억(언어 상관없이). 통화 듣기(listenForTurn trailingMs)가 읽는다.
 * 고르지 않았으면 1.8초. 900ms "멈칫" 표시와 연습(5초)은 따로(hearFrame.ts).
 */
import { useSyncExternalStore } from "react";

export const TURN_WAITS = [0.9, 1.2, 1.5, 1.8, 2] as const;
export type TurnWait = (typeof TURN_WAITS)[number];
export const DEFAULT_TURN_WAIT: TurnWait = 1.8;
export const TURN_WAIT_KEY = "turnWait.v1";

export function parseTurnWait(raw: unknown): TurnWait {
  const value = typeof raw === "number" ? raw : Number(raw);
  return TURN_WAITS.includes(value as TurnWait) ? (value as TurnWait) : DEFAULT_TURN_WAIT;
}

const listeners = new Set<() => void>();
let chosenNow: TurnWait | null = null;

export function readTurnWait(): TurnWait {
  if (chosenNow !== null) return chosenNow;
  try {
    const raw = globalThis.localStorage?.getItem(TURN_WAIT_KEY);
    return raw == null ? DEFAULT_TURN_WAIT : parseTurnWait(raw);
  } catch {
    return DEFAULT_TURN_WAIT;
  }
}

/** 통화 듣기에 넘길 밀리초. */
export function turnWaitMs(): number {
  return Math.round(readTurnWait() * 1000);
}

export function writeTurnWait(wait: TurnWait): void {
  chosenNow = wait;
  try {
    globalThis.localStorage?.setItem(TURN_WAIT_KEY, String(wait));
  } catch {
    // 이번 실행에만.
  }
  for (const listener of listeners) listener();
}

export function useTurnWait(): TurnWait {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    readTurnWait,
    () => DEFAULT_TURN_WAIT,
  );
}
