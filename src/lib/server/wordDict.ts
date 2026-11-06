/**
 * 사전 예문을 어휘 퀴즈 재료로(2026-11-06 사용자 "퀴즈 알고리즘부터 — 예문 없는 단어는 퀴즈 풀 때마다 예문 생성 → 사전에 추가").
 *
 * - dictChunk: 낱말 카드 묶음(50개)과 같은 자리의 사전 예문을 앱 언어 뜻과 함께. 뜻은 ko·en은 파일 그대로, 다른 앱 언어는 영어 뜻을
 *   한 번 옮겨 모두가 같이 쓴다(`worddict:v1:<언어>:<앱 언어>:<지문>` — stageCopy.translated). 옮기기가 안 되면 영어 뜻.
 * - dictCount: 낱말의 사전 예문 수 — 둘 이상이면 문제은행(server/qbank.ts)이 그 낱말 예문을 키우지 않는다(만드는 건 예문 없는 낱말만).
 * - promotedWords: 문제은행이 만든 낱말 예문 중 사전에 올릴 만한 것(qbankRules.promotable) — 운영자 키로만(scripts/dict-promote.mjs).
 */
import { kvGetJsonMany, kvScanKeys } from "./kv.ts";
import { textsFingerprint, translated } from "./stageCopy.ts";
import { BANK_CHUNK, loadBank } from "../curriculum/vocabBank.ts";
import { dictLinesOf, loadWordSentences } from "../curriculum/wordSentencesLoad.ts";
import { promotable, reviewable, type BankEntry } from "../curriculum/qbankRules.ts";

export type DictQuizLine = { text: string; piece: string; gloss: string };

/** 묶음 하나(순위 chunk*50 ~)의 사전 예문, 낱말 → 줄들(앱 언어 뜻). */
export async function dictChunk(language: string, chunk: number, ui: string, uiName: string, onTranslate?: () => void): Promise<Record<string, DictQuizLine[]>> {
  const [bank, book] = await Promise.all([loadBank(language), loadWordSentences(language)]);
  if (!book) return {};
  const words = bank.slice(chunk * BANK_CHUNK, (chunk + 1) * BANK_CHUNK);
  const rows: { w: string; text: string; piece: string; en: string; ko: string }[] = [];
  for (const word of words) for (const line of dictLinesOf(book, word.w)) rows.push({ w: word.w, ...line });
  if (!rows.length) return {};
  let glosses: string[] = rows.map((row) => (ui === "ko" ? row.ko || row.en : row.en));
  if (ui !== "ko" && ui !== "en") {
    const english = rows.map((row) => row.en);
    const moved = await translated(english, ui, uiName, `worddict:v1:${language}:${ui}:${textsFingerprint(english)}`, onTranslate).catch(() => null);
    if (moved && moved.length === english.length) glosses = moved;
  }
  const out: Record<string, DictQuizLine[]> = {};
  rows.forEach((row, index) => {
    (out[row.w] ??= []).push({ text: row.text, piece: row.piece, gloss: glosses[index] ?? row.en });
  });
  return out;
}

/** 낱말의 사전 예문 수(퀴즈에 쓸 수 있는 것). */
export async function dictCount(language: string, word: string): Promise<number> {
  return dictLinesOf(await loadWordSentences(language), word).length;
}

export type PromotedLine = { w: string; text: string; piece: string; en: string; n: number; r: number };

/**
 * 사전에 올릴 후보: 문제은행 낱말 열쇠(w|) 중 예문이 둘이 안 되는 낱말의, 충분히 풀렸고 너무 쉽지도 이상하지도 않은 모델 예문.
 * 사전에 이미 있는 문장은 뺀다. 많이 풀린 것부터. unplayed면 덜 풀린 예문(사전에서 열어 만든 것 등)도 — 검토가 정한다(qbankRules.reviewable).
 */
export async function promotedWords(language: string, limit = 2000, options: { unplayed?: boolean } = {}): Promise<PromotedLine[]> {
  const book = await loadWordSentences(language);
  const keys = (await kvScanKeys(`qbank:v1:${language}:w|*`)).slice(0, 20000);
  const out: PromotedLine[] = [];
  for (let start = 0; start < keys.length; start += 200) {
    const part = keys.slice(start, start + 200);
    const entries = await kvGetJsonMany<BankEntry>(part);
    part.forEach((storeKey, index) => {
      const entry = entries[index];
      if (!entry) return;
      const word = storeKey.slice(`qbank:v1:${language}:w|`.length);
      const have = dictLinesOf(book, word);
      if (have.length >= 2) return;
      const seen = new Set(have.map((line) => line.text));
      for (const item of entry.items) {
        if (!(options.unplayed ? reviewable(item) : promotable(item)) || seen.has(item.t)) continue;
        out.push({ w: word, text: item.t, piece: item.p, en: item.g, n: item.n, r: item.r });
      }
    });
  }
  return out.sort((a, b) => b.n - a.n).slice(0, limit);
}
