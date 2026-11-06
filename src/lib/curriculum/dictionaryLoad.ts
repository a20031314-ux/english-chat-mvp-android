"use client";

import { loadBank, stageOfRank } from "./vocabBank";
import type { DictEntry } from "./dictionary";
import { loadWordSentences } from "./wordSentencesLoad";
import { apiUrl } from "../apiBase";

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
      rank: index,
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

export type WordSense = { gloss: string; pos?: string; example?: string; exampleGloss?: string };
const SENSE_CACHE = "wordSense.v1";
const SENSE_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * 낱말의 여러 뜻(앱 언어, 2026-11-06) — 서버가 낱말 × 앱 언어마다 한 번 만들어 고정한 것(server/wordSenses.ts). 이 폰에 30일.
 * 실패·빈 답은 남기지 않는다.
 */
export async function fetchSenses(language: string, ui: string, word: string): Promise<WordSense[]> {
  const name = `${SENSE_CACHE}.${language}.${ui}.${word}`;
  try {
    const raw = JSON.parse(localStorage.getItem(name) ?? "null") as { at: number; senses: WordSense[] } | null;
    if (raw && Date.now() - raw.at < SENSE_MS && Array.isArray(raw.senses) && raw.senses.length) return raw.senses;
  } catch {
    // 없음.
  }
  const body = await fetch(apiUrl(`/api/curriculum/words?lang=${encodeURIComponent(language)}&ui=${encodeURIComponent(ui)}&senses=${encodeURIComponent(word)}`))
    .then((response) => (response.ok ? (response.json() as Promise<{ senses?: WordSense[] }>) : null))
    .catch(() => null);
  const senses = Array.isArray(body?.senses) ? body!.senses!.filter((one) => one && typeof one.gloss === "string" && one.gloss) : [];
  if (senses.length) {
    try {
      localStorage.setItem(name, JSON.stringify({ at: Date.now(), senses }));
    } catch {
      // 이번에만.
    }
  }
  return senses;
}
