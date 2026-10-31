/**
 * 날마다 한 공부의 결과(2026-11-01 사용자 "Logbank는 결과 샷(통화면 학습 결과 창)으로 첨부해서 기록 — 폰에만, 일일 총학습으로").
 * 문장구조 수업·꺼내 쓰기·상황 대본이 끝날 때 결과(맞힌 수·내가 말한 줄)를 이 폰에 남기고, Logbank가 그날 칸에 결과 카드로 그린다.
 * 통화는 따로 남기지 않는다 — 이미 폰에 있는 통화 기록(roleplay/callStore)으로 통화 정리 카드를 그린다. Quizbank는 curriculum/quizDays.ts.
 * 서버에 보내지 않는다(학습자 문장 — hub/RULES "데이터·보안"). 언어마다 최근 60일, 300개까지.
 */
import { localDay } from "./resume.ts";

const KEY = "dayLog.v1";
const KEEP_DAYS = 60;
const MAX = 300;
const SAID_MAX = 5;
export const DAY_LOG_EVENT = "lb-daylog";

export type DayResultKind = "lesson" | "recall" | "script";
export type DayResult = {
  kind: DayResultKind;
  /** 문장구조 id · 대본 id · "recall". */
  item: string;
  /** 카드 제목(문장구조 틀·장면 이름). */
  title: string;
  right: number;
  total: number;
  passed?: boolean;
  /** 내가 말한 줄(들린 것) — 맞음/틀림, 다섯 줄까지. */
  said: { text: string; good: boolean }[];
  at: number;
  day: string;
};

export function readDayResults(language: string): DayResult[] {
  try {
    const raw = JSON.parse(localStorage.getItem(`${KEY}.${language}`) ?? "null") as DayResult[] | null;
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

/** 결과 하나를 더한다(순수). 같은 날 같은 것을 또 하면 둘 다 남긴다 — 다시 한 것도 그날 한 공부. */
export function addDayResult(list: readonly DayResult[], result: DayResult, now = Date.now()): DayResult[] {
  const since = now - KEEP_DAYS * 24 * 60 * 60 * 1000;
  return [...list.filter((one) => one.at >= since), { ...result, said: result.said.filter((one) => one.text.trim()).slice(0, SAID_MAX) }].slice(-MAX);
}

export function noteDayResult(language: string, result: Omit<DayResult, "at" | "day">, now = new Date()): void {
  try {
    const next = addDayResult(readDayResults(language), { ...result, at: now.getTime(), day: localDay(now) }, now.getTime());
    localStorage.setItem(`${KEY}.${language}`, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(DAY_LOG_EVENT, { detail: { language } }));
  } catch {
    // 이번에만.
  }
}

function save(language: string, list: DayResult[]): void {
  try {
    localStorage.setItem(`${KEY}.${language}`, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(DAY_LOG_EVENT, { detail: { language } }));
  } catch {
    // 이번에만.
  }
}

/** 결과 카드 하나 지우기(Logbank ×, 2026-11-01). */
export function removeDayResult(language: string, at: number, item: string): void {
  save(language, readDayResults(language).filter((one) => !(one.at === at && one.item === item)));
}

/** 그날 결과 카드 모두 지우기(Logbank 날짜 줄 🗑). */
export function clearDayResults(language: string, day: string): void {
  save(language, readDayResults(language).filter((one) => one.day !== day));
}
