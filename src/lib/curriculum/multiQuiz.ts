/**
 * 복합 퀴즈(2026-11-01 사용자 "문법·표현은 소재가 한정 — 다 풀면?" → "C(모양 올리기)에서 복합퀴즈, 한 문제에 학습 소재가 여러 개" → "진행해줘").
 *
 * 한 소재를 한 번 맞히면(이 폰 퀴즈 기록 연속 맞힘 1 이상, 또는 서버 익힘) 다음 단계는 **같은 문장 안 다른 맞힌 소재와 함께** 묻는다:
 * - multi(복합 빈칸): 대본 내 줄·문장구조 예문 중 맞힌 소재가 둘 이상 든 문장 — 그 소재 자리를 모두 비우고(2~3개) 직접 친다.
 * - spots(복합 틀린 곳): 같은 문장의 문장구조 조각 둘 이상을 확실히 틀린 꼴(frames/decoys/plain)로 바꾸고 — 모두 찾아 고친다.
 * 빈칸·틀린 곳마다 그 열쇠에 맞음/틀림을 따로 남긴다 → 틀리면 그 소재만 연속 맞힘 0(한 소재 문제부터 다시), 맞히면 더 오래 쉼.
 * 배운 적 없는 소재는 비우지 않는다(문장에 그대로 보임). 모델을 부르지 않는 순수 모듈 — 화면(TodayPlan)·테스트가 같이 쓴다.
 * 다음(사용자 "3·4번은 그다음"): 뜻 보고 통째로 쓰기 · 소재 칩 둘로 내 문장 만들기(서버 판단).
 */
import { allFramesFor } from "./frames.ts";
import { ladderFor } from "./stages/index.ts";
import { allScriptsFor, type ScriptGloss } from "./stageScripts.ts";
import { diffSpan, pieceAt, pieceOf, pieceTwice, plainMisses, rng, shuffled, typedRight, type QuizQuestion } from "./quiz.ts";
import { isSpaceless, segmentWords } from "../wordSegments.ts";

export type MultiQuestion = Extract<QuizQuestion, { kind: "multi" }>;
export type SpotsQuestion = Extract<QuizQuestion, { kind: "spots" }>;

/** 한 문장에 비우는 소재 수. */
export const MULTI_MAX = 3;

type Line = { text: string; gloss: ScriptGloss; from: string; stage: number; frames: string[] };
type Hit = { key: string; piece: string; at: number; frame?: string };

const lower = (text: string) => text.toLocaleLowerCase();

/** 재료: 지금 단계까지의 대본 내 줄 + 문장구조 예문(같은 문장은 한 번). */
function linesFor(language: string, stage: number): Line[] {
  const out: Line[] = [];
  const seen = new Set<string>();
  const add = (line: Line) => {
    if (!line.text || seen.has(line.text)) return;
    seen.add(line.text);
    out.push(line);
  };
  for (const script of allScriptsFor(language)) {
    if (script.stage > stage) continue;
    for (const line of script.lines) if (line.who === "me") add({ text: line.text, gloss: line.gloss, from: script.id, stage: script.stage, frames: line.frames ?? [] });
  }
  for (const frame of allFramesFor(language)) {
    if (frame.stage > stage) continue;
    for (const example of frame.examples) add({ text: example.text, gloss: example.gloss, from: frame.id, stage: frame.stage, frames: [frame.id] });
  }
  return out;
}

/** 문장 안 소재 자리들(문장구조 조각·단계 핵심 표현) — 겹치지 않게, 앞에서부터. */
function hitsOf(language: string, line: Line, stage: number): Hit[] {
  const hits: Hit[] = [];
  const frames = allFramesFor(language);
  for (const id of line.frames) {
    const frame = frames.find((one) => one.id === id);
    const piece = frame?.core.find((core) => core && line.text.includes(core));
    if (!piece) continue;
    hits.push({ key: `f|${id}`, piece, at: pieceAt(line.text, piece, language), frame: id });
  }
  for (const step of ladderFor(language)?.stages ?? []) {
    if (step.order > stage) continue;
    for (const expression of step.expressions) {
      const piece = pieceOf(line.text, expression);
      if (piece) hits.push({ key: `e|${expression}`, piece, at: pieceAt(line.text, piece, language) });
    }
  }
  const kept: Hit[] = [];
  for (const hit of hits.filter((one) => one.at >= 0 && !pieceTwice(line.text, one.piece, language)).sort((a, b) => a.at - b.at || b.piece.length - a.piece.length)) {
    if (kept.some((one) => one.key === hit.key)) continue;
    // 겹치는 자리(긴 표현 안의 짧은 표현)는 앞의 것 하나만.
    if (kept.some((one) => hit.at < one.at + one.piece.length && one.at < hit.at + hit.piece.length)) continue;
    kept.push(hit);
  }
  return kept;
}



export type MultiOptions = {
  stage: number;
  seed: string;
  /** 이 소재를 이미 맞혔나(한 소재 문제를 지난 것만 복합에). */
  learned: (key: string) => boolean;
  /** 이 갈래 소재가 적어도 하나(문법 탭 = f|, 표현 탭 = e|). */
  wants?: (key: string) => boolean;
  /** 먼저 낼 순서(작을수록 먼저 — 잊을 때가 가까운 소재). */
  rank?: (key: string) => number;
  /** 이번에 이미 낸 문장. */
  avoid?: ReadonlySet<string>;
};

type Pick = { line: Line; hits: Hit[] };

function candidates(language: string, options: MultiOptions, usable: (hit: Hit) => boolean): Pick[] {
  const random = rng(`${options.seed}|multi`);
  const picks: Pick[] = [];
  for (const line of linesFor(language, options.stage)) {
    if (options.avoid?.has(line.text)) continue;
    const hits = hitsOf(language, line, options.stage).filter((hit) => options.learned(hit.key) && usable(hit));
    if (hits.length < 2) continue;
    // 빈칸끼리 바로 붙으면(사이에 글자가 없음) 문맥이 없어 통째로 외워 쓰기가 된다 — 붙은 것은 앞의 것만.
    const spaced: Hit[] = [];
    for (const hit of hits) {
      const prev = spaced[spaced.length - 1];
      if (prev && !/[\p{L}\p{N}]/u.test(line.text.slice(prev.at + prev.piece.length, hit.at))) continue;
      spaced.push(hit);
    }
    if (spaced.length < 2) continue;
    if (options.wants && !spaced.some((hit) => options.wants!(hit.key))) continue;
    picks.push({ line, hits: spaced.slice(0, MULTI_MAX) });
  }
  const rank = (pick: Pick) => Math.min(...pick.hits.map((hit) => options.rank?.(hit.key) ?? 0));
  // 잊을 때가 가까운 소재가 든 문장 먼저, 같으면 소재가 많은 문장, 그다음 섞어서.
  return shuffled(picks, random).sort((a, b) => rank(a) - rank(b) || b.hits.length - a.hits.length);
}

/** 복합 틀린 곳 한 문제 — 문장구조 조각 둘 이상에 확실히 틀린 꼴이 있는 문장만(없으면 null). */
export function spotsOf(language: string, options: MultiOptions): { question: SpotsQuestion; keys: string[] } | null {
  const random = rng(`${options.seed}|spots`);
  const missOf = (hit: Hit) => (hit.frame ? plainMisses(language, hit.frame, hit.piece).filter((one) => one && lower(one) !== lower(hit.piece)) : []);
  for (const pick of candidates(language, options, (hit) => missOf(hit).length > 0)) {
    const { line } = pick;
    const words = segmentWords(line.text, language);
    if (words.length < 4 || words.length > 16) continue;
    // 틀린 꼴로 바꾸고, 바꾼 자리(글자 범위)를 틀린 문장 안에서 기억한다.
    let wrong = "";
    let from = 0;
    const ranges: { hit: Hit; start: number; end: number; miss: string }[] = [];
    for (const hit of pick.hits) {
      const miss = shuffled(missOf(hit).filter((one) => !lower(line.text).includes(lower(one))), random)[0];
      if (!miss) continue;
      wrong += line.text.slice(from, hit.at);
      ranges.push({ hit, start: wrong.length, end: wrong.length + miss.length, miss });
      wrong += miss;
      from = hit.at + hit.piece.length;
    }
    wrong += line.text.slice(from);
    if (ranges.length < 2) continue;
    // 틀린 문장을 낱말로 자르고, 바꾼 범위에 걸친 낱말 자리를 그 틀린 곳으로.
    const wrongWords = segmentWords(wrong, language);
    const spans: { start: number; end: number }[] = [];
    let cursor = 0;
    for (const word of wrongWords) {
      const at = wrong.indexOf(word, cursor);
      spans.push({ start: at, end: at + word.length });
      cursor = at + word.length;
    }
    const glue = isSpaceless(line.text) ? "" : " ";
    const errors = ranges.map((range) => ({
      key: range.hit.key,
      bad: spans.map((span, i) => (span.start < range.end && range.start < span.end ? i : -1)).filter((i) => i >= 0),
      want: range.hit.piece.replace(/^[\p{P}]+|[\p{P}]+$/gu, ""),
      near: [range.miss],
    }));
    // 틀린 곳끼리 같은 낱말을 나누면(붙은 조각) 고칠 자리가 하나로 안 잡힘 — 다른 문장으로.
    const used = errors.flatMap((error) => error.bad);
    if (errors.some((error) => !error.bad.length || error.bad.length > 3 || !error.want) || new Set(used).size !== used.length) continue;
    // 바꾼 범위 안에서도 실제로 달라진 낱말만 틀린 곳으로("Me gusta" → "Mi gusta"면 Mi만) — 낱말 수가 맞을 때.
    for (const error of errors) {
      const range = ranges.find((one) => one.hit.key === error.key)!;
      const local = diffSpan(language, range.miss, range.hit.piece);
      if (local && local.words.length === error.bad.length) {
        error.bad = local.bad.map((i) => error.bad[i]!);
        error.want = local.want;
        error.near = [local.bad.map((i) => local.words[i]).join(glue).replace(/^[\p{P}]+|[\p{P}]+$/gu, ""), range.miss];
        (error as { narrowed?: boolean }).narrowed = true;
      }
    }
    // 고칠 말 = 그 낱말 자리 전체의 바른 꼴(조각이 낱말 일부면 낱말째).
    for (const error of errors) {
      if ((error as { narrowed?: boolean }).narrowed) {
        delete (error as { narrowed?: boolean }).narrowed;
        continue;
      }
      const first = spans[error.bad[0]!]!.start;
      const last = spans[error.bad[error.bad.length - 1]!]!.end;
      const range = ranges.find((one) => one.hit.key === error.key)!;
      const fixed = wrong.slice(first, range.start) + range.hit.piece + wrong.slice(range.end, last);
      error.want = fixed.replace(/^[\p{P}]+|[\p{P}]+$/gu, "") || error.want;
      error.near = [wrongWords.slice(error.bad[0]!, error.bad[error.bad.length - 1]! + 1).join(glue).replace(/^[\p{P}]+|[\p{P}]+$/gu, ""), range.miss];
    }
    return { question: { kind: "spots", text: wrong, right: line.text, words: wrongWords, errors, gloss: line.gloss, from: line.from }, keys: errors.map((error) => error.key) };
  }
  return null;
}

/** 복합 빈칸 하나의 채점(빈칸 쓰기와 같은 기준). */
export function multiBlankRight(blank: MultiQuestion["blanks"][number], typed: string, language: string): "exact" | "loose" | false {
  return typedRight(blank.answer, typed, { language, near: blank.near });
}

/** 복합 틀린 곳 하나의 채점 — 틀린 꼴 그대로 다시 친 것은 틀림. */
export function spotsFixRight(error: SpotsQuestion["errors"][number], typed: string, language: string): "exact" | "loose" | false {
  return typedRight(error.want, typed, { language, near: error.near });
}
