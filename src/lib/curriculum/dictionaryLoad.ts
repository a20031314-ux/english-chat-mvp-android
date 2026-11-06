"use client";

import { loadBank, stageOfRank } from "./vocabBank";
import type { DictEntry } from "./dictionary";
import { loadWordSentences } from "./wordSentencesLoad";

const GLOSS: Record<string, () => Promise<{ default: Record<string, string> }>> = {
  en: () => import("./dictionary/en-gloss.json"),
};

const cache = new Map<string, Promise<DictEntry[]>>();

/** 그 언어의 사전. 빈도 순. 예문은 예문 파일의 첫 문장, 뜻은 넣어 둔 짧은 뜻. */
export function loadDictionary(language: string): Promise<DictEntry[]> {
  const have = cache.get(language);
  if (have) return have;
  const made = build(language);
  cache.set(language, made);
  return made;
}

async function build(language: string): Promise<DictEntry[]> {
  const [bank, sentences, gloss] = await Promise.all([
    loadBank(language),
    loadWordSentences(language),
    GLOSS[language]?.().then((mod) => mod.default).catch(() => null) ?? Promise.resolve(null),
  ]);
  return bank.map((word, index) => {
    const lines = sentences?.[`w|${word.w}`] ?? [];
    const line = lines[0];
    const second = lines[1];
    const meaning = gloss?.[word.w];
    return {
      word: word.w,
      pos: word.pos,
      ...(word.reading ? { reading: word.reading } : {}),
      stage: stageOfRank(language, index),
      ...(meaning ? { gloss: meaning } : {}),
      ...(line?.text ? { line: line.text, ...(line.ko ? { lineKo: line.ko } : {}), ...(line.en ? { lineEn: line.en } : {}) } : {}),
      ...(second?.text ? { line2: { text: second.text, ...(second.ko ? { ko: second.ko } : {}), ...(second.en ? { en: second.en } : {}) } } : {}),
      lineCount: lines.length,
    };
  });
}
