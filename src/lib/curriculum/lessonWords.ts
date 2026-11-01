/**
 * 수업 대화 낱말 거르기(가상 사용자 2026-11-01 준호 052 — 일본어 1단계 첫 수업 대화에 배운 적 없는 緑茶):
 * 모델이 만든 수업 대화 줄(server/frameLesson.ts)에 그 단계보다 한참 위 낱말이 들면 그 차례를 버린다.
 * - 빈도 목록(curriculum/vocabBank.ts)에 있는 낱말은 그 낱말 단계가 틀 단계 + 1까지만.
 * - 한자가 든 일본어·중국어 낱말은 빈도 목록에도, 그 단계 + 1까지의 대본·틀 예문에도 없으면 버린다(목록 밖 한자말은 거의 어려운 말).
 * - 띄어 쓰는 말의 목록 밖 낱말(활용형·이름)은 그대로 둔다 — 모양만으로는 어려운지 모른다.
 * 순수 모듈(서버·테스트). 문장 자르기는 wordSegments(태국어·일본어·중국어 낱말 단위), \p{M}는 지우지 않는다.
 */
import { segmentWords, isSpaceless } from "../wordSegments.ts";
import { wordStage, type BankWord } from "./vocabBank.ts";
import { allScriptsFor } from "./stageScripts.ts";
import { allFramesFor } from "./frames.ts";

const HAN = /\p{Script=Han}/u;
const fold = (word: string) => word.toLocaleLowerCase().replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu, "");

/** 그 단계 + 1까지 앱이 보여 준 문장(대본 줄·틀 예문)을 한 덩어리로. */
function shownText(language: string, stage: number): string {
  const lines = allScriptsFor(language)
    .filter((script) => script.stage <= stage + 1)
    .flatMap((script) => script.lines.map((line) => line.text));
  const examples = allFramesFor(language)
    .filter((frame) => frame.stage <= stage + 1)
    .flatMap((frame) => frame.examples.map((example) => example.text));
  return [...lines, ...examples].join("\n");
}

const shownCache = new Map<string, string>();
const bankCache = new WeakMap<readonly BankWord[], Map<string, number>>();

function stageMap(language: string, bank: readonly BankWord[]): Map<string, number> {
  let map = bankCache.get(bank);
  if (!map) {
    map = new Map();
    bank.forEach((word, index) => {
      const key = fold(word.w);
      if (!map!.has(key)) map!.set(key, wordStage(language, word, index));
    });
    bankCache.set(bank, map);
  }
  return map;
}

/** 문장에서 그 단계 학습자에게 너무 이른 낱말(없으면 []). */
export function tooEarlyWords(language: string, text: string, stage: number, bank: readonly BankWord[]): string[] {
  const id = `${language}|${stage}`;
  let shown = shownCache.get(id);
  if (shown === undefined) {
    shown = shownText(language, stage);
    shownCache.set(id, shown);
  }
  const stages = stageMap(language, bank);
  const out: string[] = [];
  for (const raw of segmentWords(text, language)) {
    const word = fold(raw);
    if (!word || /^\p{Nd}+$/u.test(word)) continue;
    const at = stages.get(word);
    if (at !== undefined) {
      if (at > stage + 1 && !shown.toLocaleLowerCase().includes(word)) out.push(raw);
      continue;
    }
    if ((language === "ja" || language === "zh") && isSpaceless(word) && HAN.test(word) && !shown.includes(word)) out.push(raw);
  }
  return out;
}
