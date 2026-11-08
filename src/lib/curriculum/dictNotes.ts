/**
 * 사전 주석(2026-11-08 사용자 "카드의 예문이나 특정 요소 중 궁금한 게 사전 안의 내용이면 그 카드를 펼쳐서 — 앱 안 모든 텍스트에" → "주석으로 달리는 식"):
 * 학습 언어 문장 하나 → 그 문장에 든 Languagebank 표제어(표현 e| · 단어 w|), 나온 차례대로.
 * 모델·서버 없이 폰에 있는 단어 목록(vocabBank)과 단계 핵심 표현(stages)만 쓴다.
 *
 * 단어는 원래 꼴로 찾는다 — 언어마다 가벼운 규칙(영어 -s·-ed·-ing·불규칙 꼴, 로망스어 복수·생략 부호, 한국어 조사·어미,
 * 일본어 ます꼴 줄기, 아랍어 ال·و, 인도네시아어 -nya). 규칙으로 못 찾는 꼴은 그냥 안 단다(틀린 카드보다 없는 편이 낫다).
 * 기능어(대명사·전치사·관사 등)와 아주 흔한 말(순위 30 안)은 빼고, 한 문장에 최대 MAX_NOTES.
 */
import type { BankWord } from "./vocabBank.ts";
import { posGroup } from "./vocabBank.ts";
import { expressionKeysIn } from "./lessonKey.ts";
import { segmentWords, isSpaceless } from "../wordSegments.ts";

export const MAX_NOTES = 5;
/** 이 순위 안은 너무 흔해서 주석으로 안 단다(be·have·하다 같은 것). */
export const COMMON_RANK = 30;

export type DictNote = { key: string; label: string; rank: number };

type Index = { byWord: Map<string, { w: string; rank: number; pos: string }>; irregular: Map<string, string> };
const indexes = new WeakMap<readonly BankWord[], Index>();

/** 단어 목록 → 찾기 표(소문자 꼴 → 원래 단어·순위). irregular = 불규칙 꼴 → 원래 꼴(영어 word-traits f). */
export function indexBank(bank: readonly BankWord[], irregular?: Record<string, string>): Index {
  const have = indexes.get(bank);
  if (have && !irregular) return have;
  const byWord = new Map<string, { w: string; rank: number; pos: string }>();
  bank.forEach((one, rank) => {
    const low = one.w.toLocaleLowerCase();
    if (!byWord.has(low)) byWord.set(low, { w: one.w, rank, pos: one.pos });
  });
  const index = { byWord, irregular: new Map(Object.entries(irregular ?? {}).map(([form, base]) => [form.toLocaleLowerCase(), base.toLocaleLowerCase()])) };
  indexes.set(bank, index);
  return index;
}

/** word-traits의 불규칙 꼴(영어 f, 아랍어 pl 등) → {꼴: 원래 꼴}. */
export function irregularForms(traits: Record<string, { f?: Record<string, string | undefined>; pl?: string }> | null | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [base, one] of Object.entries(traits ?? {})) {
    for (const form of [...Object.values(one.f ?? {}), one.pl]) if (form && form !== base) out[form] = base;
  }
  return out;
}

const KO_PARTICLES = ["으로부터", "에게서", "한테서", "에서는", "에서도", "으로는", "까지", "부터", "에서", "에게", "한테", "께서", "처럼", "보다", "으로", "이랑", "랑", "하고", "와", "과", "을", "를", "이", "가", "은", "는", "에", "도", "만", "의", "로", "야", "요"];
const JA_I_TO_U: Record<string, string> = { い: "う", き: "く", ぎ: "ぐ", し: "す", ち: "つ", に: "ぬ", び: "ぶ", み: "む", り: "る" };
const ELISION = /^(?:l|d|j|qu|n|s|c|m|t|dell|nell|all|sull|dall|un)['’]/i;

/** 한국어 줄기 끝 글자의 줄어든 꼴을 푼다: 받침 ㅆ(과거) 떼기, 해 → 하, 와 → 오, 워 → 우, 여 → 이. */
function koUncontract(stem: string): string[] {
  const code = stem.charCodeAt(stem.length - 1) - 0xac00;
  if (code < 0 || code > 11171) return [];
  const lead = Math.floor(code / 588);
  const vowel = Math.floor((code % 588) / 28);
  const tail = code % 28;
  if (tail !== 0 && tail !== 20) return [];
  const make = (v: number) => stem.slice(0, -1) + String.fromCharCode(0xac00 + lead * 588 + v * 28);
  const out = [make(vowel)];
  // ㅐ(해) → ㅏ(하), ㅘ(봐) → ㅗ(보), ㅝ(줘) → ㅜ(주), ㅕ(져) → ㅣ(지)
  const loose: Record<number, number> = { 1: 0, 9: 8, 14: 13, 6: 20 };
  if (loose[vowel] !== undefined) out.push(make(loose[vowel]!));
  return out;
}

/** 한 꼴 → 원래 꼴 후보(먼저 것이 우선). */
export function baseCandidates(language: string, token: string, irregular?: ReadonlyMap<string, string>): string[] {
  const low = token.toLocaleLowerCase();
  const out = [low];
  const add = (one: string) => {
    if (one && !out.includes(one)) out.push(one);
  };
  const base = irregular?.get(low);
  if (base) add(base);
  if (language === "en") {
    const word = low.replace(/['’]s$/, "");
    add(word);
    if (word.endsWith("ies")) add(`${word.slice(0, -3)}y`);
    if (word.endsWith("es")) add(word.slice(0, -2));
    if (word.endsWith("s") && !word.endsWith("ss")) add(word.slice(0, -1));
    if (word.endsWith("ied")) add(`${word.slice(0, -3)}y`);
    if (word.endsWith("ed")) {
      add(word.slice(0, -2));
      add(word.slice(0, -1));
      if (/(.)\1ed$/.test(word)) add(word.slice(0, -3));
    }
    if (word.endsWith("ing")) {
      add(word.slice(0, -3));
      add(`${word.slice(0, -3)}e`);
      if (/(.)\1ing$/.test(word)) add(word.slice(0, -4));
    }
    for (const end of ["er", "est"]) if (word.endsWith(end)) {
      add(word.slice(0, -end.length));
      add(word.slice(0, -end.length + 1));
    }
  } else if (language === "es" || language === "pt" || language === "fr" || language === "it") {
    const word = low.replace(ELISION, "");
    add(word);
    if (word.endsWith("es")) add(word.slice(0, -2));
    if (word.endsWith("s") || word.endsWith("x")) add(word.slice(0, -1));
    if (language === "it" && /[ie]$/.test(word)) {
      add(`${word.slice(0, -1)}o`);
      add(`${word.slice(0, -1)}a`);
      add(`${word.slice(0, -1)}e`);
    }
  } else if (language === "ko") {
    for (const particle of KO_PARTICLES) if (low.length > particle.length && low.endsWith(particle)) add(low.slice(0, -particle.length));
    // 어간 + 다(먹었어요 → 먹다, 가고 → 가다): 앞에서부터 줄인 줄기마다, 줄어든 꼴(만났 → 만나, 했 → 하, 봤 → 보)도.
    for (let cut = low.length - 1; cut >= 1; cut -= 1) {
      const stem = low.slice(0, cut);
      add(`${stem}다`);
      for (const loose of koUncontract(stem)) add(`${loose}다`);
    }
  } else if (language === "ja") {
    add(`${low}る`);
    const last = low.slice(-1);
    if (JA_I_TO_U[last]) add(`${low.slice(0, -1)}${JA_I_TO_U[last]}`);
  } else if (language === "ar") {
    for (const prefix of ["وال", "بال", "فال", "كال", "لل", "ال", "و", "ف", "ب"]) if (low.length > prefix.length + 1 && low.startsWith(prefix)) add(low.slice(prefix.length));
  } else if (language === "id") {
    for (const end of ["nya", "lah", "kah", "pun"]) if (low.length > end.length + 2 && low.endsWith(end)) add(low.slice(0, -end.length));
  }
  return out;
}

/** 문장 → 표제어(나온 차례, 겹치면 한 번). 표현이 먼저(여러 낱말 묶음), 단어는 두세 낱말 묶음부터 맞춘다. */
export function dictNotes(language: string, text: string, bank: readonly BankWord[], irregular?: Record<string, string>, max = MAX_NOTES): DictNote[] {
  const clean = text.trim();
  if (!clean || !bank.length) return [];
  const index = indexBank(bank, irregular);
  const out: DictNote[] = [];
  const seen = new Set<string>();
  const push = (note: DictNote) => {
    if (seen.has(note.key) || out.length >= max) return;
    seen.add(note.key);
    out.push(note);
  };
  for (const key of expressionKeysIn(language, clean, max)) push({ key, label: key.slice(2), rank: -1 });
  const spaceless = isSpaceless(clean);
  const tokens = segmentWords(clean, language)
    .map((one) => one.replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu, ""))
    .filter((one) => one && !/^\p{N}+$/u.test(one));
  const lookup = (form: string) => {
    for (const candidate of baseCandidates(language, form, index.irregular)) {
      const hit = index.byWord.get(candidate);
      if (hit) return hit;
    }
    return null;
  };
  for (let i = 0; i < tokens.length && out.length < max; ) {
    let step = 1;
    for (let n = Math.min(3, tokens.length - i); n >= 1; n -= 1) {
      const phrase = tokens.slice(i, i + n).join(spaceless ? "" : " ");
      const hit = n > 1 ? index.byWord.get(phrase.toLocaleLowerCase()) ?? null : lookup(phrase);
      if (!hit) continue;
      step = n;
      if (hit.rank >= COMMON_RANK && posGroup(hit.pos) !== "function") push({ key: `w|${hit.w}`, label: hit.w, rank: hit.rank });
      break;
    }
    i += step;
  }
  return out;
}
