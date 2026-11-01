/**
 * 통화 대본(TranscriptLine[])에 표시를 붙이는 순수 함수 — RoleplayScreen에서 옮김(2026-11-01 통화 구조 정리).
 * 모두 새 배열을 돌려주고, 붙일 줄이 없으면 받은 배열을 그대로 돌려준다.
 */
import type { StuckTurn, TranscriptLine } from "./review.ts";

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
  about: { better?: string; meant?: string; about?: string },
): TranscriptLine[] {
  const index = lines.map((line) => line.who).lastIndexOf("learner");
  if (index < 0) return lines;
  const marked = [...lines];
  marked[index] = { ...marked[index]!, ...about };
  return marked;
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

/** 번역을 받아 온 튜터 줄에 붙인다 — 같은 글의 튜터 줄 중 아직 번역이 없는 것 모두. */
export function withTranslation(lines: TranscriptLine[], text: string, translation: string): TranscriptLine[] {
  return lines.map((line) =>
    line.who === "tutor" && line.text === text && !line.translation ? { ...line, translation } : line,
  );
}
