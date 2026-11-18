/**
 * 통화 대본(TranscriptLine[])에 표시를 붙이는 순수 함수 — RoleplayScreen에서 옮김(2026-11-01 통화 구조 정리).
 * 모두 새 배열을 돌려주고, 붙일 줄이 없으면 받은 배열을 그대로 돌려준다.
 */
import type { StuckTurn, TranscriptLine } from "./review.ts";
import { REDO_MAX_TRIES } from "./director.ts";
import type { TurnMark } from "./turnTally.ts";
import { focusFix } from "./fixFocus.ts";
import { compareToTarget, formSlip } from "./practice.ts";

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

/** 코치 띠의 바른 문장과 따라 말해 본 횟수(2026-11-19 통화 하나 — 시키지 않고 건넴). */
export type RedoWait = { line: string; tries: number };

/** 이 통화에서 코치가 하나라도 고쳤나 — 그러면 끝 화면에 숙제. */
export function hadFix(lines: readonly TranscriptLine[]): boolean {
  return lines.some((line) => line.who === "learner" && Boolean((line.better || line.meant || "").trim()));
}

/**
 * 따라 말한 줄 채점(모델 없음): 낱말이 다 같으면(줄임말 차이는 같음) 맞힘, 긴 문장(다섯 낱말 이상)에서
 * 같은 낱말의 다른 꼴이 아닌 한 낱말만 다르면(받아쓰기 탓일 수 있음) 맞힘, 그 밖엔 아직.
 */
export function gradeRedo(redo: string, heard: string): "pass" | "miss" {
  const { outcomes, added, clean } = compareToTarget(redo, heard);
  if (clean) return "pass";
  const off = outcomes.filter((outcome) => outcome.kind !== "kept");
  if (off.some((outcome) => outcome.kind === "changed" && formSlip(outcome.word, outcome.heardAs))) return "miss";
  return outcomes.length >= 5 && off.length + added.length <= 1 ? "pass" : "miss";
}

/**
 * 새 고친 말이 없는 차례의 기다림: 따라 말해 맞혔으면 끝, 아직이면 한 번 더(REDO_MAX_TRIES까지),
 * 다른 말을 했으면 띠가 아직 떠 있는 한 차례만 그대로 두고 끝.
 */
export function nextShownRedo(current: RedoWait, turn: { repeated: boolean; graded?: "pass" | "miss"; cardUp: boolean }): RedoWait {
  const done = { line: "", tries: 0 };
  if (!current.line) return done;
  if (turn.repeated) return turn.graded === "miss" && current.tries + 1 < REDO_MAX_TRIES ? { line: current.line, tries: current.tries + 1 } : done;
  return turn.cardUp ? current : done;
}

/**
 * 코치 띠(2026-11-02 카드 → 2026-11-19 코치): fix = 내 말을 고침(틀린 곳 표시 → 고친 문장) · meant = 내 말(앱 언어)·부서진 말을
 * 학습 언어 문장으로 · offer = 맞게 말했는데 더 자연스러운 표현. why = 고친 까닭 한 줄(앱 언어), passed = 따라 말해 맞힘.
 * old = 그 뒤 한 차례가 지나 흐려진 띠(그다음 차례에 사라짐).
 */
export type CoachCard = { kind: "fix" | "meant" | "offer"; said: string; right: string; why: string; passed?: boolean; old?: boolean };

/** 튜터 차례마다: 고친 말·더 자연스러운 말이 있으면 새 띠, 없으면 떠 있던 띠를 한 차례 흐리게 남겼다 지움. */
export function nextCoachCard(
  current: CoachCard | null,
  turn: { better?: string; meant?: string; note?: string; smoother?: string; heard: string },
): CoachCard | null {
  const right = (turn.meant || turn.better || "").trim();
  const why = (turn.note ?? "").trim();
  const said = turn.heard.trim();
  // 맞는 앞 문장까지 지우지 않게 바뀐 문장만(fixFocus.ts, 2026-11-08 점검).
  if (right && said) return { kind: turn.meant ? "meant" : "fix", ...(turn.meant ? { said, right } : focusFix(said, right)), why };
  const smoother = (turn.smoother ?? "").trim();
  if (smoother && said) return { kind: "offer", said, right: smoother, why: "" };
  return current && !current.old ? { ...current, old: true } : null;
}

/** 따라 말한 차례의 띠: 맞히면 ✓, 아직이면 그대로(한 번 더), 더 기다리지 않으면 흐리게. */
export function gradedCoachCard(current: CoachCard, graded: "pass" | "miss", over: boolean): CoachCard {
  if (graded === "pass") return { ...current, passed: true, old: false };
  return over ? { ...current, passed: false, old: true } : { ...current, passed: false, old: false };
}
