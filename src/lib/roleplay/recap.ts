/**
 * 통화 정리 — 통화가 끝나면 이번 통화에서 모르거나 막혔던 것을 한 장으로(사용자 2026-10-30
 * "통화학습을 끝낼 시 기록을 학습자료로, My탭과 연결해서 모르는 요소가 있을 시 My탭의 해당 부분을 연결" → 셋 다·자동·통화만).
 *
 * 재료 셋:
 * - fix: 튜터가 고친 내 줄(better·meant) — 서버가 이미 복습 카드로 보냄(notes/notebook.ts fileFix).
 * - hint: 막혔을 때 받은 도움(튜터 줄의 tip — 튜터 도움말이나 💡 힌트로 받은 문장).
 * - looked: 번역이 접힌 채 눌러서 뜻을 본 튜터 줄(TranscriptLine.looked).
 * - missed: 통화 중 🙉 못 알아들었어요를 누른 튜터 줄(TranscriptLine.missed, 2026-11-01) — 뜻을 본 줄보다 먼저.
 * 줄마다 그 문장이 쓰는 문장구조(My 단계의 틀)를 찾는다 — 틀의 고정 부분이 모두 들었는지(scriptBank.ts frameUsed), 모델 호출 없음.
 * 찾은 틀은 다시 볼 것(f|틀 id)에 넣는다 — 숙지 숫자는 건드리지 않는다(학습 흐름 세 층, 적용 층 기록).
 */
import { allFramesFor, type Frame } from "../curriculum/frames.ts";
import { frameUsed } from "../curriculum/scriptBank.ts";
import { ladderFor } from "../curriculum/stages/index.ts";
import { pieceAt } from "../curriculum/quiz.ts";
import { segmentWords } from "../wordSegments.ts";
import { posGroup } from "../curriculum/vocabBank.ts";
import type { TranscriptLine } from "./review.ts";

export type RecapKind = "fix" | "hint" | "missed" | "looked";

export type RecapFrame = { id: string; stage: number; pattern: string };

export type RecapItem = {
  kind: RecapKind;
  /** 학습 언어 문장(고친 줄·도움말·튜터 줄). */
  line: string;
  /** 내가 처음 한 말(fix만). */
  said?: string;
  /** 앱 언어 뜻(missed·looked, 있으면). */
  meaning?: string;
  /** 바로 앞 튜터 줄(fix·hint — 그 장면을 수업에서 다시 보일 때). */
  before?: string;
  /** 이 문장이 쓰는 문장구조 — 높은 단계부터 둘까지. */
  frames: RecapFrame[];
};

/** 한 줄에 붙이는 틀 수. */
const FRAMES_PER_LINE = 2;
/** 정리에 보이는 줄 수. */
export const RECAP_MAX = 12;

/** 이 문장이 쓰는 문장구조(높은 단계 먼저 — 모르는 것은 대개 더 어려운 틀). */
export function framesInLine(language: string, line: string, pool: Frame[] = allFramesFor(language)): RecapFrame[] {
  const text = line.trim();
  if (!text) return [];
  return pool
    .filter((frame) => frameUsed(frame.pattern, text))
    .sort((a, b) => b.stage - a.stage || a.id.localeCompare(b.id))
    .slice(0, FRAMES_PER_LINE)
    .map((frame) => ({ id: frame.id, stage: frame.stage, pattern: frame.pattern }));
}

export function buildRecap(language: string, lines: TranscriptLine[]): RecapItem[] {
  const pool = allFramesFor(language);
  const items: RecapItem[] = [];
  const seen = new Set<string>();
  // 같은 문장은 한 장만(2026-11-01 store → dev "같은 줄 두 번 말하면 통화 정리 카드도 둘"): 대소문자·띄어쓰기·문장부호만 다른 것도 같은 줄,
  // 고친 말은 고친 문장이 같거나 내가 한 말이 같으면 같은 카드(같은 실수를 두 번 하면 고친 문장이 조금씩 달라도 한 장).
  const push = (item: Omit<RecapItem, "frames">) => {
    const line = sameLine(item.line);
    if (!line) return;
    const keys = [`${item.kind}|${line}`, ...(item.said && sameLine(item.said) ? [`said|${sameLine(item.said)}`] : [])];
    if (keys.some((key) => seen.has(key))) return;
    for (const key of keys) seen.add(key);
    items.push({ ...item, frames: framesInLine(language, item.line, pool) });
  };
  let lastTutor = "";
  for (const line of lines) {
    if (line.who === "learner") {
      const right = (line.meant || line.better || "").trim();
      if (right && right !== line.text.trim()) push({ kind: "fix", line: right, said: line.text, ...(lastTutor ? { before: lastTutor } : {}) });
      continue;
    }
    lastTutor = line.text;
    if (line.tip) push({ kind: "hint", line: line.tip, before: line.text });
    const meaning = line.translation ? { meaning: line.translation } : {};
    if (line.missed) push({ kind: "missed", line: line.text, ...meaning });
    else if (line.looked) push({ kind: "looked", line: line.text, ...meaning });
  }
  return items.slice(0, RECAP_MAX);
}

/**
 * 같은 줄인지 볼 때의 꼴: 소문자, 문장부호·기호·띄어쓰기 뺌. 모음 부호(\p{M} — 태국어·힌디어)는 글자의 일부라 남긴다.
 */
export function sameLine(text: string): string {
  return text.toLowerCase().replace(/[\p{P}\p{S}\s]+/gu, "").trim();
}

/** 다시 볼 것에 넣을 열쇠(f|틀 id) — 정리에 나온 틀, 한 번에 12개까지(서버 saveChecks 한도). */
export function recapReviewKeys(items: RecapItem[]): string[] {
  return [...new Set(items.flatMap((item) => item.frames.map((frame) => `f|${frame.id}`)))].slice(0, 12);
}

/** 단계 핵심 표현 중 이 줄에 든 것(대소문자 무시, 낱말 자리 — quiz.ts pieceAt, 띄어쓰기 없는 말은 낱말 자르기). */
export function expressionsInLine(language: string, line: string): string[] {
  const text = line.trim().toLocaleLowerCase();
  if (!text) return [];
  const out: string[] = [];
  for (const stage of ladderFor(language)?.stages ?? []) {
    for (const expression of stage.expressions) {
      const piece = expression.toLocaleLowerCase();
      if (piece.length >= 2 && pieceAt(text, piece, language) >= 0) out.push(expression);
    }
  }
  return out;
}

/** 이 줄의 문장구조가 가리키는 문법 칸(g|단계:번호 — frame.grammar). */
function grammarKeysOf(language: string, line: string, pool: Frame[]): string[] {
  const ids = new Set(framesInLine(language, line, pool).map((frame) => frame.id));
  return pool.filter((frame) => ids.has(frame.id)).flatMap((frame) => (frame.grammar ?? []).map((index) => `g|${frame.stage}:${index}`));
}

/** 줄 하나에서 장부 열쇠: 문장구조(f|)·그 문장구조의 문법(g|)·단계 핵심 표현(e|). */
function lineKeys(language: string, line: string, pool: Frame[]): string[] {
  return [
    ...framesInLine(language, line, pool).map((frame) => `f|${frame.id}`),
    ...grammarKeysOf(language, line, pool),
    ...expressionsInLine(language, line).map((expression) => `e|${expression}`),
  ];
}

/**
 * Logbank 사건 장부(curriculum/logLedger.ts, 2026-11-06)에 남길 통화 사건 — 문장은 빼고 열쇠만. 통화 결과 화면에서 모은다(모델 없음,
 * 사용자 2026-11-06 "통화는 결과창이 있는데 거기서 수집하면 되는 거 아냐?" — 튜터 쪽 판정을 쓰지 않음).
 * 고친 말: 바른 문장에만 든 열쇠 = 틀림(miss). 고칠 것 없이 내가 한 줄에 든 열쇠 = 씀(used). 같은 열쇠는 틀림이 앞선다.
 * 열쇠: 문장구조 f| · 그 문장구조의 문법 g| · 단계 핵심 표현 e|. 낱말(w|)은 빈도 목록이 필요해 wordLedgerKeys가 따로.
 */
export function recapLedgerKeys(language: string, lines: TranscriptLine[], pool: Frame[] = allFramesFor(language)): { miss: string[]; used: string[] } {
  const miss = new Set<string>();
  const used = new Set<string>();
  for (const line of lines) {
    if (line.who !== "learner") continue;
    const right = (line.meant || line.better || "").trim();
    if (right && right !== line.text.trim()) {
      const had = new Set(lineKeys(language, line.text, pool));
      for (const key of lineKeys(language, right, pool)) if (!had.has(key) || key.startsWith("f|")) miss.add(key);
    } else {
      for (const key of lineKeys(language, line.text, pool)) used.add(key);
    }
  }
  for (const key of miss) used.delete(key);
  return { miss: [...miss], used: [...used] };
}

/** 한국어는 조사가 낱말에 붙는다 — 어절 앞부분이 낱말(두 글자 이상)이고 뒤가 두 글자 이하면 그 낱말. */
function tokenWords(language: string, token: string, has: (word: string) => boolean): string[] {
  if (has(token)) return [token];
  if (language === "ko") {
    for (let cut = 1; cut <= 2 && token.length - cut >= 2; cut += 1) if (has(token.slice(0, -cut))) return [token.slice(0, -cut)];
  }
  return [];
}

/**
 * 같은 결과 화면에서 낱말(w|): 내 줄의 낱말 중 빈도 목록에 있는 것(사전형 그대로 나온 것만 — 활용 꼴은 세지 않음).
 * 기능어(대명사·조사·관사 등 posGroup function)는 너무 흔해 뺀다. bank = 빈도 목록(낱말 → 품사). 고친 말의 바른 문장에만 든 낱말 = 틀림.
 */
export function wordLedgerKeys(language: string, lines: TranscriptLine[], bank: ReadonlyMap<string, string>): { miss: string[]; used: string[] } {
  const has = (word: string) => {
    const pos = bank.get(word);
    return pos !== undefined && posGroup(pos) !== "function";
  };
  const wordsOf = (text: string) => new Set(segmentWords(text, language).flatMap((token) => tokenWords(language, token.toLocaleLowerCase(), has)));
  const miss = new Set<string>();
  const used = new Set<string>();
  for (const line of lines) {
    if (line.who !== "learner") continue;
    const right = (line.meant || line.better || "").trim();
    if (right && right !== line.text.trim()) {
      const had = wordsOf(line.text);
      for (const word of wordsOf(right)) if (!had.has(word)) miss.add(`w|${word}`);
      for (const word of had) used.add(`w|${word}`);
    } else {
      for (const word of wordsOf(line.text)) used.add(`w|${word}`);
    }
  }
  // 낱말은 둘 다 남긴다 — 다른 줄에서 맞게 쓴 낱말이 고친 문장에도 들었다고 그 씀을 지우지 않는다(체크 셋 계산이 같이 셈).
  return { miss: [...miss], used: [...used] };
}

/** 사람 대화 교정(방 내 줄 교정): 고친 문장에만 있는 문장구조 = 틀림 열쇠. */
export function fixLedgerKeys(language: string, original: string, corrected: string, pool: Frame[] = allFramesFor(language)): string[] {
  const had = new Set(framesInLine(language, original, pool).map((frame) => frame.id));
  return framesInLine(language, corrected, pool)
    .filter((frame) => !had.has(frame.id))
    .map((frame) => `f|${frame.id}`);
}
