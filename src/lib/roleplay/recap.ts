/**
 * 통화 정리 — 통화가 끝나면 이번 통화에서 모르거나 막혔던 것을 한 장으로(사용자 2026-10-30
 * "통화학습을 끝낼 시 기록을 학습자료로, My탭과 연결해서 모르는 요소가 있을 시 My탭의 해당 부분을 연결" → 셋 다·자동·통화만).
 *
 * 재료 셋:
 * - fix: 튜터가 고친 내 줄(better·meant) — 서버가 이미 복습 카드로 보냄(notes/notebook.ts fileFix).
 * - hint: 막혔을 때 받은 도움(튜터 줄의 tip — 튜터 도움말이나 💡 힌트로 받은 문장).
 * - looked: 번역이 접힌 채 눌러서 뜻을 본 튜터 줄(TranscriptLine.looked).
 * 줄마다 그 문장이 쓰는 문장구조(My 단계의 틀)를 찾는다 — 틀의 고정 부분이 모두 들었는지(scriptBank.ts frameUsed), 모델 호출 없음.
 * 찾은 틀은 다시 볼 것(f|틀 id)에 넣는다 — 숙지 숫자는 건드리지 않는다(학습 흐름 세 층, 적용 층 기록).
 */
import { allFramesFor, type Frame } from "../curriculum/frames.ts";
import { frameUsed } from "../curriculum/scriptBank.ts";
import type { TranscriptLine } from "./review.ts";

export type RecapKind = "fix" | "hint" | "looked";

export type RecapFrame = { id: string; stage: number; pattern: string };

export type RecapItem = {
  kind: RecapKind;
  /** 학습 언어 문장(고친 줄·도움말·튜터 줄). */
  line: string;
  /** 내가 처음 한 말(fix만). */
  said?: string;
  /** 앱 언어 뜻(looked만, 있으면). */
  meaning?: string;
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
  const push = (item: Omit<RecapItem, "frames">) => {
    const key = `${item.kind}|${item.line.trim().toLowerCase()}`;
    if (!item.line.trim() || seen.has(key)) return;
    seen.add(key);
    items.push({ ...item, frames: framesInLine(language, item.line, pool) });
  };
  for (const line of lines) {
    if (line.who === "learner") {
      const right = (line.meant || line.better || "").trim();
      if (right && right !== line.text.trim()) push({ kind: "fix", line: right, said: line.text });
      continue;
    }
    if (line.tip) push({ kind: "hint", line: line.tip });
    if (line.looked) push({ kind: "looked", line: line.text, ...(line.translation ? { meaning: line.translation } : {}) });
  }
  return items.slice(0, RECAP_MAX);
}

/** 다시 볼 것에 넣을 열쇠(f|틀 id) — 정리에 나온 틀, 한 번에 12개까지(서버 saveChecks 한도). */
export function recapReviewKeys(items: RecapItem[]): string[] {
  return [...new Set(items.flatMap((item) => item.frames.map((frame) => `f|${frame.id}`)))].slice(0, 12);
}
