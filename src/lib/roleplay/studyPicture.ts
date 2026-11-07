/**
 * 공부 모드가 띄우는 로그뱅크 육각형(2026-11-04).
 * 부족하다고 이미 판정된 칸 중, 말로 연습되는 칸만. 없으면 그림을 띄우지 않는다.
 */
import { CHECK_PRIOR, computeFill, fillCatalog, type FillCell, type FillResult } from "../curriculum/fill.ts";
import { callTurnsOf, fillEvents } from "../curriculum/fillInputs.ts";
import { readFillCheck } from "../curriculum/fillCheck.ts";
import { readDayResults } from "../curriculum/dayLog.ts";
import { readQuizDays } from "../curriculum/quizDays.ts";
import { COMPARE_MS } from "../curriculum/directionView.ts";
import { loadBank, peekBank } from "../curriculum/vocabBank.ts";
import { segmentWords } from "../wordSegments.ts";
import { readCallDays } from "./callDays.ts";

/** 말로 연습하는 꼭짓점. 어휘 이해(뜻 고르기)·틀린 꼴(철자)은 퀴즈·수업 쪽. */
const SPEAK = new Set(["vocabUse", "sentUse", "listen", "talk"]);

export type StudyPicture = { result: FillResult; before: FillResult | null; cell: FillCell };

export function pickStudyCell(weak: readonly FillCell[]): FillCell | null {
  return weak.find((cell) => SPEAK.has(cell.axis) && !cell.id.startsWith("miss:")) ?? null;
}

export async function loadStudyPicture(language: string, now = Date.now()): Promise<StudyPicture | null> {
  let words = peekBank(language);
  if (!words) {
    try {
      words = await loadBank(language);
    } catch {
      words = null;
    }
  }
  const check = readFillCheck(language);
  const stage = check ? CHECK_PRIOR[check].stage : 1; // 체크는 글자부터(0)만
  const catalog = fillCatalog(language, words);
  const events = fillEvents({
    language,
    known: {},
    quiz: readQuizDays(language),
    results: readDayResults(language),
    items: [],
    checkups: [],
    segment: (text) => segmentWords(text, language),
  });
  const calls = callTurnsOf(Object.values(readCallDays(language)));
  const result = computeFill({ catalog, check, stage, events, calls, now });
  const cell = pickStudyCell(result.weak);
  if (!cell) return null;
  const cut = now - COMPARE_MS;
  const before =
    events.some((one) => one.at < cut) || calls.some((one) => one.at < cut)
      ? computeFill({
          catalog,
          check,
          stage,
          events: events.filter((one) => one.at < cut),
          calls: calls.filter((one) => one.at < cut),
          now: cut,
        })
      : null;
  return { result, before, cell };
}
