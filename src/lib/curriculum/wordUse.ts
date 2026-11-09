/**
 * Languagebank의 "대화에서 쓴 수"와 추천(2026-11-09 사용자 "자주 쓰는 단어를 languagebank에 — 앱 내에서 총 n번 썼다, 그걸 바탕으로 추천카드"
 * → "문제풀이와 대화에서 사용한 수치를 분리해서" → "추천 카드까지 넣어서"). 순수 모듈 — 모델 없음, 이 폰의 장부(logLedger.ts)만.
 *
 *   대화 수   통화·채팅·사람 대화에서 맞게 쓴 기록(used) 수 — 통화는 통화 하나에 한 번, AI 채팅은 하루 한 번 남는다(그래서 "몇 번의 대화").
 *            퀴즈 쪽 숫자(n번 학습 = 답한 날 수, studyTimeline.ts knowTag)와 섞지 않는다.
 *   자주 쓴 말 대화 수가 많은 낱말·표현(많은 것부터).
 *   같이 배우기 그 낱말이 든 단계 표현 + 예문에 그 낱말이 든 문장구조(빈칸에 이 말이 들어가는 틀) + 그 낱말 예문에 든 문장구조·문법·표현
 *            — 퀴즈로 아직 안 다진 것(답한 날 2일 미만) 먼저, 최대 셋.
 */
import type { LogEvent } from "./logLedger.ts";
import { ladderFor } from "./stages/index.ts";
import { allFramesFor } from "./frames.ts";
import { glossFor } from "./stageScripts.ts";
import { recapLedgerKeys } from "../roleplay/recap.ts";
import { segmentWords } from "../wordSegments.ts";

const talked = (event: LogEvent) => event.r === "used" && (event.src === "call" || event.src === "chat" || event.src === "people");
const quizLike = (event: LogEvent) => (event.src === "quiz" || event.src === "exam" || event.src === "judge") && (event.r === "ok" || event.r === "miss");

/** 순수: 열쇠마다 대화에서 맞게 쓴 기록 수. */
export function talkCounts(events: readonly LogEvent[]): Map<string, number> {
  const out = new Map<string, number>();
  for (const event of events) if (talked(event)) out.set(event.k, (out.get(event.k) ?? 0) + 1);
  return out;
}

/** 순수: 대화 수가 많은 낱말·표현(w|·e|) — 많은 것부터, 같으면 최근에 쓴 것부터. */
export function oftenUsed(events: readonly LogEvent[], max = 8): { key: string; n: number }[] {
  const counts = talkCounts(events);
  const last = new Map<string, number>();
  for (const event of events) if (talked(event)) last.set(event.k, Math.max(last.get(event.k) ?? 0, event.t));
  return [...counts]
    .filter(([key]) => key.startsWith("w|") || key.startsWith("e|"))
    .sort((a, b) => b[1] - a[1] || (last.get(b[0]) ?? 0) - (last.get(a[0]) ?? 0))
    .slice(0, max)
    .map(([key, n]) => ({ key, n }));
}

/** 순수: 열쇠마다 퀴즈로 답한 날 수. */
function quizDayCounts(events: readonly LogEvent[], dayOf: (t: number) => string): Map<string, number> {
  const days = new Map<string, Set<string>>();
  for (const event of events) {
    if (!quizLike(event)) continue;
    const set = days.get(event.k) ?? new Set<string>();
    set.add(dayOf(event.t));
    days.set(event.k, set);
  }
  return new Map([...days].map(([key, set]) => [key, set.size]));
}

/**
 * 문장에 이 낱말이 드나 — 낱말 단위(wordSegments, 타이어도 낱말로 잘라 "กิน"이 "เกิน"에 걸리지 않게).
 * 일본어·중국어는 글자 안에 든 것, 일본어 용언은 끝 가나를 뗀 줄기(食べる → 食べ, 行く → 行)로 활용형도.
 */
export function containsWord(language: string, word: string): (text: string) => boolean {
  const needle = word.toLocaleLowerCase();
  if (language === "ja" || language === "zh") {
    const stem = language === "ja" && /[\p{Script=Han}][\p{Script=Hiragana}]+$/u.test(word) ? word.replace(/[\p{Script=Hiragana}]$/u, "") : word;
    return (text) => text.includes(word) || (stem !== word && text.includes(stem));
  }
  return (text) => segmentWords(text, language).some((piece) => piece.toLocaleLowerCase() === needle);
}

/** 낱말이 든 단계 표현(띄어 쓰는 언어는 낱말 단위, 띄어쓰기 없는 언어는 글자 안에 든 것). */
export function expressionsWith(language: string, word: string): string[] {
  const has = containsWord(language, word);
  const out: string[] = [];
  for (const stage of ladderFor(language)?.stages ?? []) {
    for (const expression of stage.expressions) {
      if (expression.toLocaleLowerCase() === word.toLocaleLowerCase()) continue;
      if (has(expression) && !out.includes(expression)) out.push(expression);
    }
  }
  return out;
}

/** 낱말이 예문에 든 문장구조 id — 이 말을 빈칸에 넣어 쓰는 틀(낮은 단계부터). */
export function framesWith(language: string, word: string): string[] {
  const has = containsWord(language, word);
  return allFramesFor(language)
    .filter((frame) => frame.examples.some((example) => has(example.text)))
    .sort((a, b) => a.stage - b.stage)
    .map((frame) => frame.id);
}

export type StudyWith = { key: string; label: string; days: number };

/**
 * 순수(장부를 받아서): 낱말 하나의 같이 배우기 — 그 낱말이 든 표현, 그 낱말 예문(lines)에 든 문장구조·문법·표현.
 * 퀴즈로 답한 날이 2일 미만인 것 먼저(같으면 찾은 순서), 최대 max. label은 화면 이름(문법은 앱 언어 이름).
 */
export function studyWith(input: { language: string; locale: string; word: string; lines: readonly string[]; events: readonly LogEvent[]; dayOf: (t: number) => string; max?: number }): StudyWith[] {
  const { language, locale, word, lines, events, dayOf, max = 3 } = input;
  const found: string[] = [];
  const add = (key: string) => {
    if (key !== `w|${word}` && !found.includes(key)) found.push(key);
  };
  for (const expression of expressionsWith(language, word)) add(`e|${expression}`);
  const seen = recapLedgerKeys(
    language,
    lines.filter((line) => line.trim()).map((text) => ({ who: "learner" as const, text })),
  ).used;
  // 문장구조(예문에 이 말이 든 틀 → 낱말 예문의 틀) → 표현 → 문법(이름이 있는 것만).
  for (const id of framesWith(language, word).slice(0, 2)) add(`f|${id}`);
  for (const key of seen.filter((one) => one.startsWith("f|"))) add(key);
  for (const key of seen.filter((one) => one.startsWith("e|"))) add(key);
  for (const key of seen.filter((one) => one.startsWith("g|"))) add(key);
  const days = quizDayCounts(events, dayOf);
  const labelled = found
    .map((key) => ({ key, label: keyName(language, locale, key), days: days.get(key) ?? 0 }))
    .filter((one) => one.label);
  return [...labelled.filter((one) => one.days < 2), ...labelled.filter((one) => one.days >= 2)].slice(0, max);
}

/** 열쇠의 화면 이름 — 문장구조 = 틀, 문법 = 그 단계 문법 이름(앱 언어), 낱말·표현 = 그대로. */
export function keyName(language: string, locale: string, key: string): string {
  if (key.startsWith("f|")) return allFramesFor(language).find((frame) => frame.id === key.slice(2))?.pattern ?? "";
  if (key.startsWith("g|")) {
    const [stage, index] = key.slice(2).split(":").map(Number);
    const grammar = ladderFor(language)?.stages.find((one) => one.order === stage)?.grammar[index ?? -1];
    return grammar ? glossFor(grammar.name, locale) : "";
  }
  return key.slice(2);
}
