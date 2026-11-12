/**
 * 사다리 칸 → 문제(퀴즈 다시 짜기 4단계, ladder.ts). 순수.
 *   문법(넣어 둔 문제 PreparedItem — turnFresh로 고른 문장): 1 고르기 · 2 빈칸 쓰기(뜻 먼저) · 3 틀린 곳(spot-errors) · 4 문장 전체 쓰기
 *   표현(카드): 1 뜻 고르기(cardQuiz hide) · 2 빈칸 쓰기(cardQuiz show) · 4 문장 전체 쓰기 — 3은 표현 틀린 곳 데이터가 없어 건너뜀
 */
import { cardQuiz, cardSourceOf, type QuizQuestion } from "./quiz.ts";
import type { ScriptGloss } from "./stageScripts.ts";
import { chooseFromPrepared, type PreparedItem } from "./preparedQuiz.ts";
import { spotCells, type SpotItem } from "./spotErrors.ts";
import { askRung, type Rung } from "./ladder.ts";

/** 바른 줄: 틀린 칸을 칸 위치로 되돌림 — 칸을 줄에서 차례로 찾아 그 자리만(같은 글자가 앞에 있어도, 문장부호·띄어쓰기는 그대로). */
export function fixedLine(line: string, cells: readonly string[], at: number, wrong: string, right: string): string {
  let cursor = 0;
  for (let i = 0; i < cells.length; i += 1) {
    const found = line.indexOf(cells[i]!, cursor);
    if (found < 0) return line;
    if (i === at) {
      const cell = cells[i]!;
      return line.slice(0, found) + cell.replace(wrong, right) + line.slice(found + cell.length);
    }
    cursor = found + cells[i]!.length;
  }
  return line;
}

/** 선지(밑줄) 칸: 틀린 칸들 + 다른 칸(단서 칸·글자 없는 칸 빼고)으로 다섯, 글 차례로. seed로 고정. */
export function pickCells(cells: readonly string[], errors: readonly number[], clue: readonly number[], seed: string, n = 5): number[] {
  const letters = (cell: string) => [...cell.replace(/[\p{P}\p{S}\s]/gu, "")].length;
  const cjk = (cell: string) => /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Thai}]/u.test(cell);
  const pool = cells.map((cell, i) => i).filter((i) => !errors.includes(i) && !clue.includes(i) && letters(cells[i]!) >= (cjk(cells[i]!) ? 1 : 2));
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
  const shuffled = pool.map((i) => ({ i, r: (h = Math.imul(h ^ (h >>> 15) ^ i, 2246822507) >>> 0) })).sort((a, b) => a.r - b.r).map((one) => one.i);
  const need = Math.max(0, n - errors.length);
  // 틀린 곳이 하나면 그 번호가 몇 번째일지도 고르게(문단 끝 문장에 있어도 늘 ⑤가 되지 않게).
  if (errors.length === 1) {
    const at = errors[0]!;
    const before = shuffled.filter((i) => i < at);
    const after = shuffled.filter((i) => i > at);
    let want = h % (need + 1);
    want = Math.min(want, before.length);
    want = Math.max(want, need - after.length);
    const others = [...before.slice(0, Math.max(0, want)), ...after.slice(0, need - Math.max(0, want))];
    return [...errors, ...others].sort((a, b) => a - b);
  }
  return [...errors, ...shuffled.slice(0, need)].sort((a, b) => a - b);
}

/** 틀린 곳 문항(한 문장) → 퀴즈 spot 문제. numbered = 선지(밑줄)(게이지 아래쪽·가운데). */
export function spotQuestion(item: SpotItem, language: string, key: string, numbered = false): QuizQuestion | null {
  const err = item.errors[0];
  const line = item.lines[0];
  if (!err || !line || item.lines.length !== 1) return null;
  const words = spotCells(line, language);
  const cell = words[err.at];
  if (!cell) return null;
  const right = fixedLine(line, words, err.at, err.wrong, err.right);
  if (right === line) return null;
  return {
    kind: "spot",
    text: line,
    right,
    words,
    bad: [err.at],
    want: err.right,
    gloss: { en: item.gloss.en, ko: item.gloss.ko },
    note: "",
    from: key,
    hasError: true,
    ...(err.type === "meaning" ? { glossAfter: true as const } : {}),
    ...(item.lead ? { lead: item.lead } : {}),
    ...(numbered ? { picks: pickCells(words, [err.at], item.clue ?? [], item.id) } : {}),
  };
}

/** 문단 문항(story-errors P1~P4) → 퀴즈 spots 문제. P1·P2 선지(밑줄), P4는 틀린 곳 수를 안 보임. */
export function paragraphQuestion(item: SpotItem, language: string): QuizQuestion | null {
  const lineCells = item.lines.map((line) => spotCells(line, language));
  const offsets: number[] = [];
  let total = 0;
  for (const cells of lineCells) {
    offsets.push(total);
    total += cells.length;
  }
  const words = lineCells.flat();
  const errors = item.errors.map((err) => ({ key: err.g ?? (err.w ? `w|${err.w}` : `g|${item.stage}:0`), bad: [offsets[err.line]! + err.at], want: err.right, near: [] as string[] }));
  if (errors.some((err) => !words[err.bad[0]!])) return null;
  const fixed = item.lines.map((line, li) => {
    let out = line;
    for (const err of item.errors.filter((one) => one.line === li)) out = fixedLine(out, lineCells[li]!, err.at, err.wrong, err.right);
    return out;
  });
  const spaced = item.lines.some((line) => /\s/.test(line));
  const numbered = item.shape === "P1" || item.shape === "P2";
  return {
    kind: "spots",
    text: item.lines.join(spaced ? " " : ""),
    right: fixed.join(spaced ? " " : ""),
    words,
    errors,
    gloss: { en: item.gloss.en, ko: item.gloss.ko },
    from: errors[0]!.key,
    ...(numbered ? { picks: pickCells(words, errors.map((err) => err.bad[0]!), [], item.id) } : {}),
    ...(item.shape === "P4" ? { hideCount: true as const } : {}),
    ...(item.errors.some((err) => err.type === "meaning") ? { glossAfter: true as const } : {}),
  };
}

function wholeOf(text: string, gloss: ScriptGloss, key: string, cue?: "len" | "none"): QuizQuestion {
  return { kind: "type", text, before: "", after: "", answer: text, gloss, from: key, whole: true, glossFirst: true, ...(cue ? { cue } : {}) };
}

/** 문법 칸 하나 → 낼 칸과 문제. spot = 그 칸의 틀린 곳 문항(최근에 안 낸 것 하나, 없으면 null). 끝났으면 null. */
export function grammarAsk(item: PreparedItem, current: number, spot: SpotItem | null, language: string, how: { cue?: "len" | "none"; numbered?: boolean } = {}): { rung: Rung; question: QuizQuestion } | null {
  const spotQ = spot ? spotQuestion(spot, language, item.key, how.numbered) : null;
  const rung = askRung(current, (one) => one !== 3 || Boolean(spotQ));
  if (!rung) return null;
  let question: QuizQuestion | null = null;
  if (rung === 1) question = chooseFromPrepared(item);
  if (rung === 2) {
    const near = item.options.filter((option) => option !== item.answer);
    question = { kind: "type", text: item.line, before: item.before, after: item.after, answer: item.answer, gloss: { en: "", raw: item.gloss }, from: item.key, near, glossFirst: true, ...(how.cue ? { cue: how.cue } : {}) };
  }
  if (rung === 3) question = spotQ;
  if (rung === 4) question = wholeOf(item.line, { en: "", raw: item.gloss }, item.key, how.cue);
  return question ? { rung, question } : null;
}

/** 표현 카드 하나 → 낼 칸과 문제(3은 건너뜀). */
export function expressionAsk(language: string, key: string, current: number, seed: string, cue?: "len" | "none"): { rung: Rung; question: QuizQuestion } | null {
  const rung = askRung(current, (one) => one !== 3);
  if (!rung) return null;
  if (rung === 1 || rung === 2) {
    const question = cardQuiz(language, key, rung === 1 ? "hide" : "show", seed);
    return question ? { rung, question } : null;
  }
  const source = cardSourceOf(language, key, seed);
  return source ? { rung, question: wholeOf(source.text, source.gloss, key, cue) } : null;
}
