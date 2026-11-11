/**
 * 틀린 곳 고르기 데이터(퀴즈 다시 짜기 2단계 재료, hub/work/drafts/quiz-redesign-2026-11-10.md §4) — 형식·검사·선지(밑줄). 순수.
 *
 * 한 문항 = 학습 언어 줄(한 문장이면 하나, 문단이면 3~6) 중 1~3곳을 틀리게 바꾼 것. 낱말 칸은 quiz.ts tilesOf(ja·zh·th는 낱말로,
 * ko는 조사 붙은 덩어리, 띄어 쓰는 언어는 문장부호가 칸에 붙음) — `at`은 그 칸 번호(틀린 줄 기준).
 *  - shape: "s" 한 문장 · "l" 앞 문맥 한 줄 + 한 문장 · "P1"~"P4" 문단 난이도(설계안 §4 표).
 *  - type: "form" 꼴 틀림(활용·조사·성수·어순…) · "meaning" 뜻 틀림(꼴은 맞고 흐름상 틀린 낱말 — 단서가 있어야, 고칠 칸이 하나뿐).
 *  - clue: 뜻 틀림의 단서 칸(선지(밑줄)에 안 넣음 — 단서 쪽을 골라도 말이 되는 일을 막음).
 * 고정 데이터 `spot-errors/<언어>.json`(한 문장·앞 줄, 에이전트 → 판정 에이전트)·`story-errors/<언어>.json`(문단), 서버가 미리 만든 것(server/spotMake.ts)이 같은 모양.
 */
import { tilesOf } from "./quiz.ts";

export type SpotShape = "s" | "l" | "P1" | "P2" | "P3" | "P4";
export type SpotType = "form" | "meaning";
export type SpotKind = "form" | "particle" | "order" | "word" | "missing" | "spell" | "agree" | "tense" | "article";

export type SpotErr = {
  line: number;
  at: number;
  wrong: string;
  right: string;
  type: SpotType;
  kind: SpotKind;
  /** 꼴 틀림이면 그 문법 칸(g|단계:번호), 뜻 틀림이면 낱말 열쇠(w|낱말)가 있으면. */
  g?: string;
  w?: string;
  why: { en: string; ko: string };
};

export type SpotItem = {
  id: string;
  stage: number;
  shape: SpotShape;
  /** 재료: 사전 예문 "w|낱말#0" · 새로 씀 "new". */
  src: string;
  /** 앞 문맥 한 줄(누를 수 없음, shape "l"). */
  lead?: string;
  /** 틀린 곳이 든 줄(화면에 보일 그대로). */
  lines: string[];
  errors: SpotErr[];
  /** 뜻 틀림 단서 칸(lines[0] 기준) — 선지(밑줄)에 안 넣음. */
  clue?: number[];
  /** 바른 글의 뜻(en·ko — 다른 앱 언어는 서버가 옮김). */
  gloss: { en: string; ko: string };
};

const SHAPE_LINES: Record<SpotShape, [number, number]> = { s: [1, 1], l: [1, 1], P1: [3, 3], P2: [4, 4], P3: [5, 5], P4: [6, 6] };
const SHAPE_ERRORS: Record<SpotShape, [number, number]> = { s: [1, 1], l: [1, 1], P1: [1, 1], P2: [1, 2], P3: [2, 2], P4: [1, 3] };
const KINDS = new Set<SpotKind>(["form", "particle", "order", "word", "missing", "spell", "agree", "tense", "article"]);

/** 칸 글에서 문장부호를 뗀 것(비교용 — \p{M}은 남김). */
export function bare(cell: string): string {
  return cell.normalize("NFC").replace(/[\p{P}\p{S}\s]/gu, "").toLocaleLowerCase();
}

export function spotCells(text: string, language: string): string[] {
  return tilesOf(text, language);
}

/** 문항 검사 — 문제 목록(빈 배열이면 통과). 앱이 읽기 전에도, 에이전트 결과를 합칠 때도(scripts/spots/check.mjs). */
export function spotProblems(item: SpotItem, language: string): string[] {
  const out: string[] = [];
  if (!item.id || typeof item.id !== "string") out.push("id");
  if (!Number.isInteger(item.stage) || item.stage < 0 || item.stage > 9) out.push("stage");
  const lines = SHAPE_LINES[item.shape];
  if (!lines) return [...out, "shape"];
  if (!Array.isArray(item.lines) || item.lines.length < lines[0] || item.lines.length > lines[1] || item.lines.some((one) => typeof one !== "string" || !one.trim())) out.push("lines");
  if (item.shape === "l" ? !item.lead?.trim() : item.lead !== undefined) out.push("lead");
  const errs = SHAPE_ERRORS[item.shape];
  if (!Array.isArray(item.errors) || item.errors.length < errs[0] || item.errors.length > errs[1]) out.push("errors");
  if (!item.gloss?.en?.trim() || !item.gloss?.ko?.trim()) out.push("gloss");
  const seen = new Set<string>();
  for (const [i, err] of (item.errors ?? []).entries()) {
    const line = item.lines?.[err.line];
    if (typeof line !== "string") {
      out.push(`e${i}.line`);
      continue;
    }
    const cells = spotCells(line, language);
    const cell = cells[err.at];
    if (cell === undefined) out.push(`e${i}.at`);
    else if (!bare(cell).includes(bare(err.wrong)) || !bare(err.wrong)) out.push(`e${i}.wrong≠칸「${cell}」`);
    if (!bare(err.right) || bare(err.right) === bare(err.wrong)) out.push(`e${i}.right`);
    if (err.type !== "form" && err.type !== "meaning") out.push(`e${i}.type`);
    if (!KINDS.has(err.kind)) out.push(`e${i}.kind`);
    if (!err.why?.en?.trim() || !err.why?.ko?.trim()) out.push(`e${i}.why`);
    if (err.g !== undefined && !/^g\|\d+:\d+$/.test(err.g)) out.push(`e${i}.g`);
    const spot = `${err.line}:${err.at}`;
    if (seen.has(spot)) out.push(`e${i}.겹침`);
    seen.add(spot);
  }
  // 뜻 틀림 한 문장은 단서 칸이 있거나 앞 줄이 있어야(고칠 칸이 하나뿐 — 설계안 §4).
  const meaning = (item.errors ?? []).some((err) => err.type === "meaning");
  if (meaning && item.shape === "s" && !item.clue?.length) out.push("clue");
  if (item.clue) {
    const n = spotCells(item.lines?.[0] ?? "", language).length;
    if (item.clue.some((at) => !Number.isInteger(at) || at < 0 || at >= n || (item.errors ?? []).some((err) => err.line === 0 && err.at === at))) out.push("clue.at");
  }
  return out;
}
