import type { TranscriptLine } from "./review.ts";

/**
 * 통화 중 화면에 둘 내 줄인지. 튜터가 아직 판단하지 않은 줄(그 뒤에 아무 줄도 없음)은 "…"로 둔다 —
 * 글을 띄웠다가 지우면 깜박이니까. 판단이 끝났는데 고친 문장·되살린 뜻·한마디·막힘이 없으면 숨긴다.
 * 통화가 끝나면(돌아보기·다시 말해보기) 늘 전부.
 */
export function learnerLineView(lines: TranscriptLine[], index: number, options: { showAll: boolean; over: boolean }): "show" | "waiting" | "hidden" {
  const line = lines[index]!;
  if (line.who !== "learner" || options.showAll || options.over) return "show";
  if (line.better || line.meant || line.about || line.stuck) return "show";
  return index === lines.length - 1 ? "waiting" : "hidden";
}
