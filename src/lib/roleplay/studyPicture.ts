/**
 * 수업 통화가 겨냥할 칸 하나(그림 없음 — 첫 마디와 감독 지시에만).
 * 부족하다고 이미 판정된 칸 중, 말로 연습되는 칸만. 없으면 보통 인사.
 */
import { CHECK_PRIOR, computeFill, fillCatalog, type FillCell } from "../curriculum/fill.ts";
import { callTurnsOf, fillEvents } from "../curriculum/fillInputs.ts";
import { readFillCheck } from "../curriculum/fillCheck.ts";
import { readFirstCheck } from "../curriculum/firstCheck.ts";
import { readDayResults } from "../curriculum/dayLog.ts";
import { readQuizDays } from "../curriculum/quizDays.ts";
import { loadBank, peekBank } from "../curriculum/vocabBank.ts";
import { segmentWords } from "../wordSegments.ts";
import { readCallDays } from "./callDays.ts";

/** 말로 연습하는 꼭짓점. 어휘 이해(뜻 고르기)·틀린 꼴(철자)은 퀴즈·수업 쪽. */
const SPEAK = new Set(["vocabUse", "sentUse", "listen", "talk"]);

export function pickStudyCell(weak: readonly FillCell[]): FillCell | null {
  return weak.find((cell) => SPEAK.has(cell.axis) && !cell.id.startsWith("miss:")) ?? null;
}

export async function loadStudyCell(language: string, now = Date.now()): Promise<FillCell | null> {
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
  const result = computeFill({
    catalog: fillCatalog(language, words),
    check,
    stage,
    placed: readFirstCheck(language),
    events: fillEvents({
      language,
      known: {},
      quiz: readQuizDays(language),
      results: readDayResults(language),
      items: [],
      checkups: [],
      segment: (text) => segmentWords(text, language),
    }),
    calls: callTurnsOf(Object.values(readCallDays(language))),
    now,
  });
  return pickStudyCell(result.weak);
}
