/**
 * 지난번에 틀린 것 모으기(2026-10-28 사용자 "틀린 걸 상기시켜 주는 기능" + "아침에 퀴즈 n개, 단어 n개" 알림).
 * 재료 셋을 한 목록으로 — 모델 안 부름:
 * - 튜터가 고친 내 줄(노트 카드·오늘의 학습 후보, 서버 notebook:v1 — 이미 저장하는 예외)
 * - 대본·문장구조 🎤 틀린 줄(이 폰, scriptMisses.ts — 줄 글은 우리 대본에서)
 * - 헷갈려요·직접 물어본 곳(다시 볼 것 열쇠, stageScripts:v1 review)
 * My 띠(WeakStrip)와 아침 알림(morningNotify.ts)이 같이 쓴다.
 */
import { allFramesFor } from "./frames.ts";
import { allScriptsFor, type ScriptGloss } from "./stageScripts.ts";
import { itemForKey, reviewLabel, type ReviewMap } from "./dailyPlan.ts";
import type { Miss } from "./scriptMisses.ts";

export type FixLike = { id: string; wrong: string; right: string; note?: string; at: number; kind?: string; frame?: string | null };

export type WeakSpot =
  | { kind: "fix"; key: string; at: number; wrong: string; right: string; note: string; open: { stage: number; id: string } | null }
  | { kind: "line"; key: string; at: number; text: string; gloss: ScriptGloss; open: { stage: number; id: string } }
  | { kind: "review"; key: string; at: number; label: string; open: { stage: number; id: string } | null };

const FIX_DAYS = 21 * 24 * 60 * 60 * 1000;

export function weakSpots(input: {
  language: string;
  fixes: readonly FixLike[];
  misses: readonly Miss[];
  review: ReviewMap;
  /** 문법 열쇠(g|) 이름 — 앱 언어 노트 칸. */
  grammarName?: (stage: number, index: number) => string;
  now?: number;
  limit?: number;
}): WeakSpot[] {
  const now = input.now ?? Date.now();
  const frames = allFramesFor(input.language);
  const scripts = allScriptsFor(input.language);
  const out: WeakSpot[] = [];
  for (const card of input.fixes) {
    if ((card.kind ?? "mistake") !== "mistake" || now - card.at > FIX_DAYS || !card.wrong || !card.right) continue;
    const frame = card.frame ? frames.find((f) => f.id === card.frame) : undefined;
    out.push({ kind: "fix", key: `fix|${card.id}`, at: card.at, wrong: card.wrong, right: card.right, note: card.note ?? "", open: frame ? { stage: frame.stage, id: frame.id } : null });
  }
  for (const miss of input.misses) {
    const script = scripts.find((s) => s.id === miss.id);
    const frame = script ? null : frames.find((f) => f.id === miss.id);
    const line = script?.lines[miss.line];
    const example = frame?.examples[miss.line];
    const text = line?.text ?? example?.text;
    const gloss = line?.gloss ?? example?.gloss;
    if (!text || !gloss) continue;
    out.push({ kind: "line", key: `line|${miss.id}|${miss.line}`, at: miss.at, text, gloss, open: { stage: (script ?? frame)!.stage, id: miss.id } });
  }
  for (const [key, entry] of Object.entries(input.review)) {
    // 헷갈려요(1단계)만 — 7일 뒤 한 번 더 볼 것(2단계)은 이미 한 번 알았다.
    if (entry.step !== 1) continue;
    let label = reviewLabel(input.language, key);
    if (key.startsWith("g|") && input.grammarName) {
      const [stage, index] = key.slice(2).split(":").map(Number);
      label = input.grammarName(stage!, index!);
    }
    if (!label) continue;
    const item = itemForKey(input.language, key);
    out.push({ kind: "review", key, at: entry.at, label, open: item ? { stage: item.stage, id: item.id } : null });
  }
  return out.sort((a, b) => b.at - a.at).slice(0, input.limit ?? 8);
}

/** 단어·표현 n개: 헷갈린 표현 먼저, 모자라면 앞으로 할 대본의 핵심 표현. */
export function wordsToShow(language: string, review: ReviewMap, upcoming: readonly string[], count: number): string[] {
  const unsure = Object.entries(review)
    .filter(([key]) => key.startsWith("e|"))
    .sort((a, b) => b[1].at - a[1].at)
    .map(([key]) => key.slice(2));
  const scripts = allScriptsFor(language);
  const next = upcoming.flatMap((id) => scripts.find((s) => s.id === id)?.expressions ?? []);
  return [...new Set([...unsure, ...next])].slice(0, count);
}
