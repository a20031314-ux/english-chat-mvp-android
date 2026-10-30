/**
 * 꺼내 쓰기(2026-10-30 사용자 "'~라고 말해 보세요' 식으로 숙지한 부분을 활용", `hub/drafts/frames-first-2026-10-30.md`):
 * 익힌 문장구조(틀 연습을 통과한 틀)만으로 앱 언어 뜻을 보고 학습 언어로 말한다. 묶음 RECALL_SIZE문제.
 *
 * - 문제 재료: 서버가 틀 하나·둘마다 한 번 만든 문장(server/recallPrompts.ts) + 대본에서 그 틀이 나온 내 줄(뜻이 14개 앱 언어로 이미 있음).
 * - 고르기: 아직 꺼내 쓰지 않은 익힌 틀 먼저, 익힌 틀이 셋 넘으면 두 틀을 섞은 문제도(새 틀 + 앞서 익힌 틀).
 * - 맞히면 그 틀 열쇠 `r|틀id`가 생기고(서버 known, curriculum/known.ts — 다른 날 세 번이면 이미 앎과 같은 셈), 틀리면 지워진다.
 * - 단계 조건(2026-10-30 사용자 "둘 다 70%"): 그 단계 틀 중 익힘 70% + 꺼내 씀 70% → 단계 시험.
 * 순수 모듈(화면·서버·테스트).
 */
import { framesFor, type Frame } from "./frames.ts";
import { STAGE_DONE_SHARE } from "./stages/index.ts";
import { glossFor, scriptsFor } from "./stageScripts.ts";
import type { KnownMap } from "./known.ts";

/** line = 대본 줄(gloss는 그 줄의 뜻 — 화면이 "…라고 말해 보세요"로 감쌈), 아니면 gloss가 이미 말하라는 지시. */
export type RecallPrompt = { text: string; gloss: string; frames: string[]; line?: boolean };

export const RECALL_SIZE = 5;

export const recallKey = (frameId: string) => `r|${frameId}`;

const fold = (text: string) => text.normalize("NFC").toLowerCase().replace(/[’']/g, "'");

/** 문장이 틀마다 알아보는 조각(core) 하나를 담고 있나 — 띄어쓰기 없는 말도 그대로 찾는다(조각은 붙여 쓴 글자). */
export function recallFits(language: string, text: string, frames: readonly Pick<Frame, "core">[]): boolean {
  void language;
  const sentence = fold(text);
  return frames.every((frame) => frame.core.some((core) => core.trim() && sentence.includes(fold(core.trim()))));
}

/** 그 단계 틀 중 익힌 것(통과)·꺼내 쓴 것(r| 열쇠). */
export function stageFrameTally(language: string, stage: number, passed: ReadonlySet<string> | ReadonlyMap<string, unknown>, known: KnownMap | null | undefined) {
  const frames = framesFor(language, stage);
  const learned = frames.filter((frame) => passed.has(frame.id));
  const recalled = frames.filter((frame) => Boolean(known?.[recallKey(frame.id)]));
  const total = frames.length;
  const ready = total > 0 && learned.length / total >= STAGE_DONE_SHARE && recalled.length / total >= STAGE_DONE_SHARE;
  return { total, learned: learned.length, recalled: recalled.length, ready, learnedIds: learned.map((frame) => frame.id), recalledIds: recalled.map((frame) => frame.id) };
}

/**
 * 이번 묶음에 쓸 틀 묶음(틀 id 하나 또는 두 개 "a+b", 정렬). learnedOrder = 익힌 틀(오래된 것부터).
 * 꺼내 쓰지 않은 틀을 먼저, 익힌 틀이 셋 이상이면 그 틀에 앞서 익힌 틀 하나를 붙인 짝도 섞는다.
 */
export function recallSets(learnedOrder: readonly string[], known: KnownMap | null | undefined, size = RECALL_SIZE): string[] {
  if (!learnedOrder.length) return [];
  const fresh = learnedOrder.filter((id) => !known?.[recallKey(id)]);
  const done = learnedOrder.filter((id) => known?.[recallKey(id)]).sort((a, b) => (known![recallKey(a)]!.at ?? 0) - (known![recallKey(b)]!.at ?? 0));
  const order = [...fresh.slice().reverse(), ...done];
  const out: string[] = [];
  const mix = learnedOrder.length >= 3;
  for (let i = 0; out.length < size && i < order.length * 2; i += 1) {
    const id = order[i % order.length]!;
    if (mix && i % 2 === 1) {
      const partner = learnedOrder.find((other) => other !== id && !out.includes([id, other].sort().join("+")));
      if (partner) {
        out.push([id, partner].sort().join("+"));
        continue;
      }
    }
    if (!out.includes(id)) out.push(id);
  }
  return out.slice(0, size);
}

/** 대본에서 그 틀이 나온 내 줄(뜻은 앱 언어로) — 서버 문제가 없을 때도 쓸 수 있는 재료. */
export function recallFromScripts(language: string, frame: Frame, locale: string): RecallPrompt[] {
  const out: RecallPrompt[] = [];
  const seen = new Set(frame.examples.map((example) => example.text));
  for (let stage = frame.stage; stage >= 1; stage -= 1) {
    for (const script of scriptsFor(language, stage)) {
      for (const line of script.lines) {
        if (line.who !== "me" || seen.has(line.text)) continue;
        const tagged = line.frames?.includes(frame.id) ?? false;
        if (!tagged && !recallFits(language, line.text, [frame])) continue;
        const gloss = glossFor(line.gloss, locale);
        if (!gloss || gloss === line.text) continue;
        seen.add(line.text);
        out.push({ text: line.text, gloss, frames: [frame.id], line: true });
      }
    }
  }
  return out;
}

/** 묶음 RECALL_SIZE문제: 묶음(set)마다 하나씩 돌아가며, 이미 낸 문장은 빼고. */
export function recallBundle(sets: readonly string[], prompts: Readonly<Record<string, readonly RecallPrompt[]>>, size = RECALL_SIZE, seed = 0): RecallPrompt[] {
  const out: RecallPrompt[] = [];
  const used = new Set<string>();
  for (let round = 0; out.length < size && round < 6; round += 1) {
    for (const set of sets) {
      if (out.length >= size) break;
      const list = prompts[set] ?? [];
      if (!list.length) continue;
      const pick = list[(seed + round) % list.length]!;
      if (used.has(pick.text)) continue;
      used.add(pick.text);
      out.push(pick);
    }
  }
  return out;
}
