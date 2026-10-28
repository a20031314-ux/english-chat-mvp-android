/**
 * 아침 알림 글(2026-10-28 사용자 "잠금화면에 띄우기 — 아침에 일어나서 퀴즈 n개, 단어 n개"): 앞으로 7일, 날마다 다른 것.
 * 모델 안 부름, 폰에서 만든다. 머리 한 줄 = 지난번에 틀린 것 하나, 펼치면 틀린 것 둘 + 단어 n개.
 */
import { glossFor } from "./stageScripts.ts";
import type { WeakSpot } from "./weakSpots.ts";

export type MorningText = { title: string; body: string; largeBody: string };

export function spotLine(spot: WeakSpot, locale: string): string {
  if (spot.kind === "fix") return `✎ ${spot.wrong} → ${spot.right}`;
  if (spot.kind === "line") return `◐ ${spot.text} (${glossFor(spot.gloss, locale)})`;
  return `? ${spot.label}`;
}

export function morningDays(input: {
  locale: string;
  title: string;
  /** 틀린 것도 단어도 없을 때 한 줄(오늘 할 것 이름 · n분). */
  fallback: string;
  spots: readonly WeakSpot[];
  words: readonly string[];
  wordsPerDay: number;
  days?: number;
}): MorningText[] {
  const days = input.days ?? 7;
  const out: MorningText[] = [];
  for (let day = 0; day < days; day++) {
    const spots = input.spots.length ? [0, 1].map((i) => input.spots[(day * 2 + i) % input.spots.length]!).filter((spot, i, all) => all.indexOf(spot) === i) : [];
    const words = input.words.length
      ? Array.from({ length: Math.min(input.wordsPerDay, input.words.length) }, (_, i) => input.words[(day * input.wordsPerDay + i) % input.words.length]!)
      : [];
    const lines = spots.map((spot) => spotLine(spot, input.locale));
    const body = lines[0] ?? (words.length ? words.join(" · ") : input.fallback);
    const largeBody = [...lines, ...(words.length ? [words.join(" · ")] : [])].join("\n") || input.fallback;
    out.push({ title: input.title, body, largeBody });
  }
  return out;
}
