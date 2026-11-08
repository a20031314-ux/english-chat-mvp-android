/**
 * 통화 대본(TranscriptLine[])에 표시를 붙이는 순수 함수 — RoleplayScreen에서 옮김(2026-11-01 통화 구조 정리).
 * 모두 새 배열을 돌려주고, 붙일 줄이 없으면 받은 배열을 그대로 돌려준다.
 */
import type { StuckTurn, TranscriptLine } from "./review.ts";
import { REDO_MAX_TRIES } from "./director.ts";
import type { TurnMark } from "./turnTally.ts";
import { focusFix } from "./fixFocus.ts";

/**
 * Put what was said about their sentence under their sentence.
 *
 * Either field, because the character uses whichever it reaches for: a rewrite
 * of what they said, a word about it in their own language, or both. What
 * matters is that it lands under the words it is about, where they are looking
 * in the seconds before they are answered.
 */
export function markAboutTheirLine(
  lines: TranscriptLine[],
  about: { better?: string; meant?: string; smoother?: string; about?: string; redo?: "pass" | "miss"; turn?: TurnMark },
): TranscriptLine[] {
  const index = lines.map((line) => line.who).lastIndexOf("learner");
  if (index < 0) return lines;
  const marked = [...lines];
  marked[index] = { ...marked[index]!, ...about };
  return marked;
}

/** 마지막 학습자 줄 바로 앞 튜터 줄이 🙉로 쉽게 다시 한 말인가(차례 재기 — 다시 들은 뒤 알아들음). */
export function answeredAfterMissed(lines: readonly TranscriptLine[]): boolean {
  const index = lines.map((line) => line.who).lastIndexOf("learner");
  for (let i = index - 1; i >= 0; i -= 1) if (lines[i]!.who === "tutor") return Boolean(lines[i]!.again);
  return false;
}

/**
 * Mark the turn they just struggled on, once the tutor has said so.
 *
 * The learner's line is already in the transcript by then — it went up the
 * moment they stopped speaking — so the evidence is attached to it afterwards
 * rather than held back until the answer arrives.
 */
export function markStuck(lines: TranscriptLine[], turn: Omit<StuckTurn, "asked">): TranscriptLine[] {
  const index = lines.map((line) => line.who).lastIndexOf("learner");
  if (index < 0) return lines;
  const asked =
    lines
      .slice(0, index)
      .reverse()
      .find((line) => line.who === "tutor")?.text ?? "";
  const marked = [...lines];
  marked[index] = { ...marked[index]!, stuck: { ...turn, asked } };
  return marked;
}

/** 통화 중 💡 힌트로 받은 문장을 마지막 튜터 줄(그 질문) 아래 도움말로 — 이미 도움말이 있으면 그대로. */
export function tipOnLastTutorLine(lines: TranscriptLine[], tip: string): TranscriptLine[] {
  const index = lines.map((line) => line.who).lastIndexOf("tutor");
  if (index < 0 || lines[index]!.tip) return lines;
  const marked = [...lines];
  marked[index] = { ...marked[index]!, tip };
  return marked;
}

/** 🙉 못 알아들었어요를 누른 튜터 줄 — 통화 정리의 "못 알아들은 말"(recap.ts). 튜터 줄이 아니면 그대로. */
export function markMissed(lines: TranscriptLine[], index: number): TranscriptLine[] {
  const line = lines[index];
  if (!line || line.who !== "tutor" || line.missed) return lines;
  const marked = [...lines];
  marked[index] = { ...line, missed: true };
  return marked;
}

/** 번역을 받아 온 튜터 줄에 붙인다 — 같은 글의 튜터 줄 중 아직 번역이 없는 것 모두. */
export function withTranslation(lines: TranscriptLine[], text: string, translation: string): TranscriptLine[] {
  return lines.map((line) =>
    line.who === "tutor" && line.text === text && !line.translation ? { ...line, translation } : line,
  );
}

/** 통화 요약 한 줄의 수(끝난 화면 맨 위, 2026-11-01): 고친 내 말 · 받은 힌트 · 못 알아들은 튜터 말. */
export function tallyCall(lines: TranscriptLine[]): { fixed: number; hints: number; missed: number; redone: number } {
  let fixed = 0;
  let hints = 0;
  let missed = 0;
  let redone = 0;
  for (const line of lines) {
    if (line.who === "learner") {
      if ((line.better || line.meant || "").trim()) fixed += 1;
      if (line.redo === "pass") redone += 1;
    } else {
      if (line.tip) hints += 1;
      if (line.missed) missed += 1;
    }
  }
  return { fixed, hints, missed, redone };
}

/** 튜터 수업에서 기다리는 "다시 말해 보기" — 문장과 그 문장을 말해 보라고 한 횟수. */
export type RedoWait = { line: string; tries: number };

/**
 * 감독 답의 retry로 다음 기다림을 정한다(2026-11-02). ask = 새 문장(같은 문장이면 횟수 +1), miss = 한 번 더(이미 마지막이었으면 넘어감),
 * pass·그 밖 = 끝. 서버도 같은 규칙으로 pass·miss를 거르지만(director.ts) 앱이 들고 있는 값이 다음 차례에 실리니 여기서도 지킨다.
 */
export function nextRedo(current: RedoWait, retry: "ask" | "pass" | "miss" | undefined, sentence: string | undefined): RedoWait {
  const done = { line: "", tries: 0 };
  const said = (sentence ?? "").trim();
  if (retry === "ask") {
    if (!said) return current.line ? current : done;
    return { line: said, tries: current.line && current.line === said ? current.tries + 1 : 1 };
  }
  if (retry === "miss") {
    if (!current.line || current.tries >= REDO_MAX_TRIES) return done;
    return { line: said || current.line, tries: current.tries + 1 };
  }
  return done;
}

/**
 * 튜터 수업 통화 중 내 얼굴 아래 카드(사용자 2026-11-02 "튜터가 표현을 알려 주거나 내 말을 고쳐 줄 때 화면에 표시").
 * fix = 내 말을 고침(틀린 곳 표시 → 고친 문장) · meant = 내 말(앱 언어)·부서진 말을 학습 언어 문장으로 · offer = 맞게 말했는데 더 자연스러운 표현.
 * why = 고친 까닭 한 줄(앱 언어), passed = 다시 말해서 맞힘(다음 보통 차례에 사라짐).
 */
/**
 * quiet = 자유대화 카드(2026-11-07): 튜터는 말로 짚지 않고 화면에만 — 다시 말해 보기(🔁) 없음.
 * old = 그 뒤 한 차례가 지나 흐려진 카드(그다음 차례에 사라짐).
 */
export type CoachCard = { kind: "fix" | "meant" | "offer"; said: string; right: string; why: string; passed?: boolean; quiet?: boolean; old?: boolean };

export function nextCoachCard(
  current: CoachCard | null,
  turn: { retry?: "ask" | "pass" | "miss"; better?: string; meant?: string; note?: string; offer?: boolean; smoother?: string; heard: string; gaveUp: boolean; quiet?: boolean },
): CoachCard | null {
  const right = (turn.meant || turn.better || "").trim();
  const why = (turn.note ?? "").trim();
  // 자유대화: 고친 말·더 자연스러운 말을 그 차례에 바로 카드로, 새 카드가 없으면 한 차례 흐리게 남겼다가 사라짐.
  if (turn.quiet && !turn.retry) {
    const said = turn.heard.trim();
    // 맞는 앞 문장까지 지우지 않게 바뀐 문장만(fixFocus.ts, 2026-11-08 점검).
    if (right && said) return { kind: turn.meant ? "meant" : "fix", ...(turn.meant ? { said, right } : focusFix(said, right)), why, quiet: true };
    const smoother = (turn.smoother ?? "").trim();
    if (smoother && said) return { kind: "offer", said, right: smoother, why: "", quiet: true };
    return current?.quiet && !current.old ? { ...current, old: true } : null;
  }
  if (turn.retry === "ask") {
    if (!right) return current;
    const kind = turn.offer ? "offer" : turn.meant ? "meant" : "fix";
    const pair = kind === "fix" ? focusFix(turn.heard.trim(), right) : { said: turn.heard.trim(), right };
    return { kind, ...pair, why: turn.offer ? "" : why };
  }
  if (turn.retry === "miss") {
    if (!current || turn.gaveUp) return null;
    // 처음 틀린 말은 그대로 두고(무엇을 고쳤는지), 고친 문장·까닭만 새것으로.
    return { ...current, right: right || current.right, why: why || current.why, passed: false };
  }
  if (turn.retry === "pass") return current ? { ...current, passed: true } : null;
  return null;
}

/** 끝에서부터 말없이 지나간 내 차례("…")가 몇 번 이어졌나 — 튜터 줄은 건너뛰고, 말한 내 줄에서 멈춘다. */
export function silentRun(said: readonly { who: string; text: string }[]): number {
  let run = 0;
  for (let i = said.length - 1; i >= 0; i -= 1) {
    const line = said[i];
    if (line.who !== "learner") continue;
    if (line.text.trim() && line.text.trim() !== "…") break;
    run += 1;
  }
  return Math.max(1, run);
}
