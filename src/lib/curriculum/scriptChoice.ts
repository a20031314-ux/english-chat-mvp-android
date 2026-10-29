/**
 * 대본 "고르기"·"맞추기"(2026-10-29 사용자 "녹음>평가의 단순 구조 외에 객관식 같은 다른 학습 방식" → "통과 기준도 정할 수 있게,
 * 객관식은 어휘적으로 헷갈리는 선택지·문법적으로 헷갈리는 선택지 등 다양화, 상황에 맞는 표현 고르기는 너무 쉬워서 뺌").
 *
 * 내 줄마다 빈칸 하나(그 줄의 핵심 표현 → 문장구조 조각 → 가장 긴 낱말)와 오답 셋:
 * - grammar: 같은 낱말의 틀린 꼴·조사·관사·전치사·어미(학습자가 실제로 헷갈리는 쪽)
 * - vocab:   생김새나 뜻이 비슷하지만 이 문장엔 안 맞는 다른 낱말·표현
 * 오답은 대본마다 한 번 모델이 만들어 모두가 같이 쓴다(서버 /api/curriculum/choices, 모델 `scriptChoices`) — 받기 전·실패하면 아래 규칙으로 기기에서.
 * 순수 모듈: 서버 라우트·화면·테스트가 같이 쓴다.
 */
import { allFramesFor } from "./frames.ts";
import { allScriptsFor, type StageScript } from "./stageScripts.ts";
import { pieceOf } from "./quiz.ts";
import { isSpaceless, segmentWords } from "../wordSegments.ts";

export type ChoiceType = "vocab" | "grammar";
export type ChoiceOption = { text: string; type: ChoiceType };
/** 내 줄 하나의 문제: 빈칸(줄에 그대로 든 조각)과 오답. */
export type LineChoice = { blank: string; wrong: ChoiceOption[] };
export type ScriptChoices = Record<number, LineChoice>;

export const WRONG_COUNT = 3;

const lower = (text: string) => text.toLocaleLowerCase();

/** 빈칸으로 비울 조각: 그 줄에 든 핵심 표현 → 문장구조 조각 → 가장 긴 낱말. */
export function blankFor(language: string, script: StageScript, index: number): string | null {
  const line = script.lines[index];
  if (!line || line.who !== "me") return null;
  for (const expression of script.expressions) {
    const piece = pieceOf(line.text, expression);
    if (piece && piece.length < line.text.length * 0.9) return piece;
  }
  const frames = allFramesFor(language);
  for (const id of line.frames ?? []) {
    const core = frames.find((frame) => frame.id === id)?.core.find((piece) => piece && line.text.includes(piece));
    if (core) return core;
  }
  const words = segmentWords(line.text, language)
    .map((word) => word.replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu, ""))
    .filter((word) => /[\p{L}]/u.test(word) && line.text.includes(word));
  if (!words.length) return null;
  return [...words].sort((a, b) => [...b].length - [...a].length)[0]!;
}

/* ---------- 규칙 오답(모델 없이) ---------- */

/** 언어마다 서로 헷갈리는 기능어 묶음(조사·관사·전치사·조동사·어미). 꼴을 바꿔 "문법" 오답을 만든다. */
const CONFUSABLE: Record<string, string[][]> = {
  en: [["a", "an", "the"], ["in", "on", "at"], ["to", "for", "with"], ["do", "does", "did"], ["is", "are", "was", "were"], ["have", "has", "had"], ["this", "that", "these", "those"], ["can", "could", "would"], ["some", "any"], ["much", "many"], ["I", "me", "my"]],
  es: [["el", "la", "los", "las"], ["un", "una", "unos"], ["es", "está", "son", "están"], ["ser", "estar"], ["a", "en", "de", "con"], ["por", "para"], ["me", "te", "se", "le"], ["mi", "mis", "tu"], ["soy", "estoy"], ["del", "al"]],
  fr: [["le", "la", "les"], ["un", "une", "des"], ["de", "du", "à", "au"], ["suis", "es", "est", "sont"], ["ai", "as", "a", "ont"], ["mon", "ma", "mes"], ["ce", "cette", "ces"], ["en", "dans", "sur"]],
  it: [["il", "lo", "la", "i", "gli", "le"], ["un", "una", "uno"], ["di", "a", "da", "in", "con"], ["sono", "è", "sei"], ["ho", "hai", "ha"], ["mi", "ti", "si"], ["del", "della", "dei"]],
  pt: [["o", "a", "os", "as"], ["um", "uma"], ["de", "em", "para", "por", "com"], ["é", "está", "são", "estão"], ["sou", "estou"], ["do", "da", "no", "na"], ["meu", "minha"]],
  id: [["di", "ke", "dari"], ["ini", "itu"], ["sudah", "belum", "akan", "sedang"], ["saya", "aku", "kamu"], ["tidak", "bukan"], ["yang", "dan"]],
  vi: [["đã", "đang", "sẽ"], ["của", "cho", "với"], ["không", "chưa"], ["này", "đó", "kia"], ["ở", "tại", "đến"], ["rất", "lắm", "quá"]],
  ru: [["в", "на", "с", "к"], ["мне", "меня", "мой", "моя"], ["это", "этот", "эта"], ["был", "была", "было", "были"], ["не", "нет"], ["я", "мы", "ты"]],
  ar: [["في", "على", "إلى", "من"], ["هذا", "هذه", "ذلك", "تلك"], ["أنا", "أنت", "هو", "هي"], ["لا", "لم", "لن"]],
  hi: [["का", "की", "के"], ["में", "पर", "से", "को"], ["है", "हैं", "था", "थी", "थे"], ["मैं", "मुझे", "मेरा"], ["नहीं", "मत"]],
  ja: [["は", "が", "を", "に", "で", "へ", "と", "も"], ["です", "でした", "ます", "ました", "ません"], ["から", "まで", "より"], ["この", "その", "あの"], ["て", "た"]],
  zh: [["了", "过", "着"], ["的", "得", "地"], ["在", "再"], ["不", "没"], ["吗", "呢", "吧"], ["会", "能", "可以"], ["这", "那"]],
  th: [["ครับ", "ค่ะ", "คะ"], ["ไม่", "ไม่ได้"], ["แล้ว", "จะ", "กำลัง"], ["ที่", "ซึ่ง"], ["ของ", "ให้", "กับ"], ["นี้", "นั้น"]],
  ko: [["은", "는", "이", "가"], ["을", "를"], ["에", "에서", "로", "으로"], ["요", "어요", "아요", "예요", "이에요"], ["았어요", "었어요", "할 거예요"], ["도", "만"]],
};

/** 띄어쓰기 없는 글을 문장부호까지 남기고 조각으로(다시 이으면 원래 글). */
function segmentAll(text: string, language: string): string[] {
  if (typeof Intl === "undefined" || typeof Intl.Segmenter !== "function") return [text];
  return [...new Intl.Segmenter(language, { granularity: "word" }).segment(text)].map((part) => part.segment);
}

/** 한 낱말 안에서 바꿀 수 있는 기능어(한국어는 낱말 끝 조사·어미, 띄어쓰기 없는 언어는 낱말 단위로 잘린 조각). */
function swapsOf(language: string, text: string): string[] {
  const sets = CONFUSABLE[language] ?? [];
  const out: string[] = [];
  const words = isSpaceless(text) ? segmentAll(text, language) : text.split(/(\s+)/);
  words.forEach((word, i) => {
    if (!word.trim()) return;
    const bare = word.replace(/[\p{P}]+$/u, "");
    const tail = word.slice(bare.length);
    for (const set of sets) {
      const exact = set.find((item) => lower(item) === lower(bare));
      if (exact) {
        for (const other of set) {
          if (other === exact) continue;
          const keep = bare[0] && bare[0] !== bare[0].toLocaleLowerCase() ? other[0]!.toLocaleUpperCase() + other.slice(1) : other;
          const next = [...words];
          next[i] = keep + tail;
          out.push(next.join(""));
        }
        continue;
      }
      // 한국어: 낱말 끝에 붙은 조사·어미("학생이에요" → "학생예요").
      if (language === "ko") {
        const ending = [...set].sort((a, b) => b.length - a.length).find((item) => bare.length > item.length && bare.endsWith(item));
        if (ending) {
          for (const other of set) {
            if (other === ending) continue;
            const next = [...words];
            next[i] = bare.slice(0, -ending.length) + other + tail;
            out.push(next.join(""));
          }
        }
      }
    }
  });
  return [...new Set(out)].filter((option) => option !== text && option.trim());
}

function editDistance(a: string, b: string): number {
  const x = [...a];
  const y = [...b];
  const row = Array.from({ length: y.length + 1 }, (_, j) => j);
  for (let i = 1; i <= x.length; i += 1) {
    let prev = row[0]!;
    row[0] = i;
    for (let j = 1; j <= y.length; j += 1) {
      const temp = row[j]!;
      row[j] = Math.min(row[j]! + 1, row[j - 1]! + 1, prev + (x[i - 1] === y[j - 1] ? 0 : 1));
      prev = temp;
    }
  }
  return row[y.length]!;
}

/** "어휘" 오답 후보: 가까운 단계 대본의 핵심 표현·문장구조 조각·낱말 중 생김새가 가까운 것(편집 거리 순). */
function lookalikes(language: string, blank: string, stage: number, line: string): string[] {
  const pool = new Set<string>();
  for (const script of allScriptsFor(language)) {
    if (Math.abs(script.stage - stage) > 1) continue;
    for (const expression of script.expressions) pool.add(expression);
    for (const row of script.lines) {
      if (row.who !== "me") continue;
      for (const word of segmentWords(row.text, language)) {
        const bare = word.replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu, "");
        if (/[\p{L}]/u.test(bare)) pool.add(bare);
      }
    }
  }
  for (const frame of allFramesFor(language)) if (Math.abs(frame.stage - stage) <= 1) frame.core.forEach((core) => pool.add(core));
  const size = [...blank].length;
  return [...pool]
    .filter((text) => text && lower(text) !== lower(blank) && !lower(line).includes(lower(text)) && !lower(blank).includes(lower(text)) && !lower(text).includes(lower(blank)))
    .filter((text) => [...text].length >= Math.min(2, size) && Math.abs([...text].length - size) <= Math.max(2, Math.ceil(size * 0.6)))
    .map((text) => ({ text, d: editDistance(lower(text), lower(blank)) / Math.max(size, [...text].length) }))
    .sort((a, b) => a.d - b.d || a.text.localeCompare(b.text))
    .map((row) => row.text);
}

/** 기기에서 만드는 오답(문법 둘·어휘 하나를 먼저, 모자라면 다른 쪽으로 채움). */
export function ruleChoice(language: string, script: StageScript, index: number): LineChoice | null {
  const blank = blankFor(language, script, index);
  const line = script.lines[index];
  if (!blank || !line) return null;
  const grammar = swapsOf(language, blank).map((text) => ({ text, type: "grammar" as const }));
  const vocab = lookalikes(language, blank, script.stage, line.text).map((text) => ({ text, type: "vocab" as const }));
  const picked: ChoiceOption[] = [...grammar.slice(0, 2), ...vocab.slice(0, 1)];
  for (const extra of [...vocab.slice(1), ...grammar.slice(2)]) {
    if (picked.length >= WRONG_COUNT) break;
    picked.push(extra);
  }
  const wrong = dedupe(blank, picked).slice(0, WRONG_COUNT);
  return wrong.length >= 2 ? { blank, wrong } : null;
}

function dedupe(blank: string, options: ChoiceOption[]): ChoiceOption[] {
  const seen = new Set([lower(blank.trim())]);
  return options.filter((option) => {
    const key = lower(option.text.trim());
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/* ---------- 모델 오답(서버, 대본마다 한 번) ---------- */

export function choicesPrompt(input: { targetName: string; stage: number }): string {
  return `You write multiple-choice distractors for a ${input.targetName} speaking script used by learners at stage ${input.stage} of 5 (1 = beginner).

For each of the learner's lines you get its index, the sentence, its meaning, and a suggested blank (a piece of the sentence the learner must recall). Keep the suggested blank unless a different piece of the same sentence teaches more; the blank must be copied exactly from the sentence.

Write exactly ${WRONG_COUNT} wrong options for the blank:
- at least one "grammar": the same words in a form a learner of ${input.targetName} typically confuses here — wrong particle, article, preposition, conjugation, agreement, word order or politeness ending.
- at least one "vocab": a different word or phrase that looks or sounds similar, or is a near-synonym that does not fit this sentence or situation.
Every option must be clearly wrong when put in the blank, plausible for a learner at this stage, written in ${input.targetName}, and about as long as the blank. Never repeat the correct blank, never give two options that differ only in punctuation or capital letters, and never give an option that is also a correct answer.

Answer only JSON: {"lines":[{"i":<index>,"blank":"<exact piece>","wrong":[{"text":"…","type":"grammar"|"vocab"}]}]}`;
}

export function choicesInput(language: string, script: StageScript): { i: number; text: string; meaning: string; blank: string }[] {
  return script.lines.flatMap((line, i) => {
    if (line.who !== "me") return [];
    const blank = blankFor(language, script, i);
    return blank ? [{ i, text: line.text, meaning: line.gloss.en, blank }] : [];
  });
}

/** 모델 답 검사: 빈칸은 그 줄에 그대로, 오답은 서로 다르고 정답이 아니며, 문법·어휘가 하나씩은 있게(모자라면 규칙 오답으로 채움). */
export function parseChoices(raw: string, language: string, script: StageScript): ScriptChoices {
  let rows: unknown[] = [];
  try {
    const body = JSON.parse(raw) as { lines?: unknown[] };
    rows = Array.isArray(body.lines) ? body.lines : [];
  } catch {
    rows = [];
  }
  const out: ScriptChoices = {};
  for (const row of rows) {
    const item = row as { i?: unknown; blank?: unknown; wrong?: unknown };
    const i = typeof item.i === "number" ? item.i : -1;
    const line = script.lines[i];
    if (!line || line.who !== "me" || out[i]) continue;
    const blank = typeof item.blank === "string" ? item.blank.trim() : "";
    if (!blank || !line.text.includes(blank) || blank.length >= line.text.length) continue;
    const limit = Math.max(12, [...blank].length * 3);
    const wrong = dedupe(
      blank,
      (Array.isArray(item.wrong) ? item.wrong : []).flatMap((option): ChoiceOption[] => {
        const value = option as { text?: unknown; type?: unknown };
        const text = typeof value.text === "string" ? value.text.replace(/\s+/g, " ").trim() : "";
        const type = value.type === "grammar" || value.type === "vocab" ? value.type : null;
        if (!text || !type || [...text].length > limit) return [];
        // 빈칸에 넣으면 원래 문장과 같아지는 것(문장부호·대소문자만 다름)은 정답이라 뺀다.
        if (lower(text).replace(/[\p{P}\s]/gu, "") === lower(blank).replace(/[\p{P}\s]/gu, "")) return [];
        return [{ text, type }];
      }),
    ).slice(0, WRONG_COUNT);
    // 모델이 한쪽만 냈으면(문법만·어휘만) 같은 빈칸의 규칙 오답으로 다른 쪽을 하나 채운다.
    const fill = ruleChoice(language, script, i);
    for (const type of ["grammar", "vocab"] as const) {
      if (wrong.some((option) => option.type === type) || !fill || fill.blank !== blank) continue;
      const extra = fill.wrong.find((option) => option.type === type && !wrong.some((w) => lower(w.text) === lower(option.text)));
      if (!extra) continue;
      if (wrong.length < WRONG_COUNT) wrong.push(extra);
      else wrong[WRONG_COUNT - 1] = extra;
    }
    if (wrong.length >= 2) out[i] = { blank, wrong: wrong.slice(0, WRONG_COUNT) };
  }
  return out;
}

/* ---------- 오답 확인(서버, 대본마다 한 번 더): 정답처럼 받아들여질 오답은 뺀다 ---------- */

export function checkPrompt(input: { targetName: string }): string {
  return `You check multiple-choice distractors for ${input.targetName} learners. Each item is a sentence from a dialogue with one option written into a blank, plus the previous line for context.
Say which items a fluent ${input.targetName} speaker would accept as correct and natural in that context (same meaning or an acceptable alternative). Those must not be used as wrong answers. Judge only the filled sentence; ignore capital letters.
Answer only JSON: {"accepted":["<id>", …]} — an empty list if none.`;
}

/** 오답마다 그 오답을 빈칸에 넣은 문장(앞 줄과 함께) — id는 "줄:번호". */
export function checkInput(script: StageScript, choices: ScriptChoices): { id: string; before: string; sentence: string }[] {
  return Object.entries(choices).flatMap(([at, choice]) => {
    const i = Number(at);
    const line = script.lines[i];
    if (!line) return [];
    const before = script.lines[i - 1]?.text ?? "";
    return choice.wrong.map((option, k) => ({ id: `${i}:${k}`, before, sentence: line.text.replace(choice.blank, option.text) }));
  });
}

/** 확인 답에서 "받아들여짐"인 오답을 빼고, 오답이 둘 아래로 줄면 그 줄은 기기 규칙으로 넘긴다(빼 버림). */
export function applyCheck(choices: ScriptChoices, raw: string): ScriptChoices {
  let accepted = new Set<string>();
  try {
    const body = JSON.parse(raw) as { accepted?: unknown };
    accepted = new Set(Array.isArray(body.accepted) ? body.accepted.filter((id): id is string => typeof id === "string") : []);
  } catch {
    return choices;
  }
  const out: ScriptChoices = {};
  for (const [at, choice] of Object.entries(choices)) {
    const wrong = choice.wrong.filter((_, k) => !accepted.has(`${at}:${k}`));
    if (wrong.length >= 2) out[Number(at)] = { blank: choice.blank, wrong };
  }
  return out;
}

/** 이 줄의 문제: 서버 것 → 없으면 기기 규칙. */
export function choiceForLine(language: string, script: StageScript, index: number, server?: ScriptChoices | null): LineChoice | null {
  return server?.[index] ?? ruleChoice(language, script, index);
}

/* ---------- 통과 기준(사용자가 고름) ---------- */

/** speak = 말하기로 맞힌 줄만 통과로 셈(기본), any = 고르기·맞추기로 맞힌 줄도. */
export type PassRule = "speak" | "any";
export const PASS_RULE_KEY = "scriptPassRule.v1";
