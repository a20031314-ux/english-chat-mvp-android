/**
 * 대화 속에서 다시 쓰게(2026-10-28 사용자 "대화 속에서 다시 쓰게 하는 기능"): 헷갈려요·직접 물어본 표현·문장구조(다시 볼 것 1단계)
 * 둘을 튜터에게 넘겨, 그 말이 자연스럽게 나올 질문을 하게 한다. 학습자가 고칠 데 없이 쓰면 "알아요"처럼 반영(다음은 7일 뒤 한 번).
 * 모델을 더 부르지 않는다 — 원래 부르는 튜터 지시에 한 단락, 썼는지는 낱말 맞춤으로.
 */
import { allFramesFor } from "./frames.ts";
import type { ReviewMap } from "./dailyPlan.ts";
import { hasPhrase } from "./learnedWhere.ts";

export type ReuseTarget = { key: string; label: string; kind: "phrase" | "frame"; pieces: string[] };

export function reuseTargets(language: string, review: ReviewMap, limit = 2): ReuseTarget[] {
  const frames = allFramesFor(language);
  const out: ReuseTarget[] = [];
  for (const [key, entry] of Object.entries(review).sort((a, b) => b[1].at - a[1].at)) {
    if (entry.step !== 1) continue;
    if (key.startsWith("e|")) out.push({ key, label: key.slice(2), kind: "phrase", pieces: [key.slice(2)] });
    else if (key.startsWith("f|")) {
      const frame = frames.find((f) => f.id === key.slice(2));
      if (frame?.core.length) out.push({ key, label: frame.pattern, kind: "frame", pieces: frame.core });
    }
    if (out.length >= limit) break;
  }
  return out;
}

/** 튜터 지시에 붙일 단락(영어 — 다른 지시와 같은 말). 예문은 넣지 않는다(베껴 쓰지 않게). */
export function reusePrompt(targets: readonly ReuseTarget[]): string {
  if (!targets.length) return "";
  const list = targets.map((target) => `"${target.label}" (${target.kind === "frame" ? "sentence pattern, ___ is the slot" : "expression"})`).join(", ");
  return [
    `Practice to bring back: the learner recently marked ${list} as unsure.`,
    "When it fits what you are talking about, ask something whose natural answer would use one of them — at most one per reply, and not every reply.",
    "Never name them, never quiz or explain them unless asked; if the learner uses one, just carry on the conversation.",
  ].join(" ");
}

/** 학습자 줄에 그 표현·문장구조가 들었는지(문장구조는 조각이 모두). */
export function usedTargets(language: string, message: string, targets: readonly ReuseTarget[]): ReuseTarget[] {
  return targets.filter((target) =>
    target.pieces.every((piece) => hasPhrase(message, piece, language) || message.toLocaleLowerCase().includes(piece.toLocaleLowerCase())),
  );
}

/** 교정이 바꾼 게 없는지(대소문자·끝 문장부호·빈칸만 다르면 같음). */
export function unchanged(message: string, corrected: string | null | undefined): boolean {
  if (!corrected) return false;
  const plain = (text: string) => text.toLocaleLowerCase().replace(/[\p{P}\s]+$/u, "").replace(/\s+/g, " ").trim();
  return plain(message) === plain(corrected);
}
