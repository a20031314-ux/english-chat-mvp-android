/**
 * 틀린 틀 "다시 연습"(2026-10-28 사용자 "다시연습기능 넣어줘", `hub/drafts/script-curriculum-2026-10-28.md` 구현안 2단계).
 *
 * 튜터가 고친 줄(노트 카드·오늘의 학습 후보)에 모델이 그 줄이 걸친 틀 id를 붙인다(server/notebookStore.ts fileFix → card.frame).
 * 같은 틀이 14일 안에 두 번 짚이면 그 틀을 다시 권한다. 다시 연습을 끝내면 3일 쉬고, 그 뒤엔 끝낸 뒤 새로 짚인 것만 센다.
 * 한 번에 두 개까지(하루 권유 2번). 모델을 부르지 않는다.
 */
import type { FixCard } from "../notes/notebook.ts";

export const REDO_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;
export const REDO_REST_MS = 3 * 24 * 60 * 60 * 1000;
export const REDO_AFTER = 2;
export const REDO_MAX = 2;

export type RedoCard = { id: string; wrong: string; right: string; note: string; where: FixCard["where"]; at: number };
export type RedoItem = { frame: string; count: number; card: RedoCard };

/** 다시 권할 틀(많이 짚인 것, 같으면 최근 것 먼저). done = 틀 id → 마지막으로 다시 연습을 끝낸 때. */
export function framesToRedo(
  cards: readonly FixCard[],
  done: Readonly<Record<string, number>>,
  now = Date.now(),
  max = REDO_MAX,
): RedoItem[] {
  const byFrame = new Map<string, FixCard[]>();
  const seen = new Set<string>();
  for (const card of cards) {
    if (!card.frame || seen.has(card.id)) continue;
    seen.add(card.id);
    const kind = card.kind ?? "mistake";
    if (kind !== "mistake" && kind !== "meant") continue;
    if (now - card.at > REDO_WINDOW_MS) continue;
    const last = done[card.frame] ?? 0;
    if (card.at <= last) continue;
    byFrame.set(card.frame, [...(byFrame.get(card.frame) ?? []), card]);
  }
  const out: RedoItem[] = [];
  for (const [frame, list] of byFrame) {
    if (now - (done[frame] ?? 0) < REDO_REST_MS) continue;
    if (list.length < REDO_AFTER) continue;
    const latest = [...list].sort((a, b) => b.at - a.at)[0]!;
    out.push({
      frame,
      count: list.length,
      card: { id: latest.id, wrong: latest.wrong, right: latest.right, note: latest.note, where: latest.where, at: latest.at },
    });
  }
  return out.sort((a, b) => b.count - a.count || b.card.at - a.card.at).slice(0, max);
}
