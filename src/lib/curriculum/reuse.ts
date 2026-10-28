/**
 * 대화에서 잘 썼어요(2026-10-29 사용자 "자유대화에 어떻게든 표현을 끼워 넣으면 수행 완료가 돼 버려 — 적용은 빼고, 체크한 것들은
 * 자유롭게 학습하다가 그 표현을 쓸 때 잘 적용했다 정도의 표시"): 튜터가 표현을 끌어내지 않는다(예전 reusePrompt는 뺌).
 * 학습자가 채팅에서 스스로 체크한 표현·문장구조(헷갈려요·물어본 것 — 다시 볼 것 어느 단계든)를 고칠 데 없이 쓰면 그 줄 아래 표시만.
 * 다시 볼 날짜·숙지는 바꾸지 않는다(끼워 넣어 끝내는 일이 없게). 모델을 더 부르지 않는다 — 낱말 맞춤.
 */
import { allFramesFor } from "./frames.ts";
import type { ReviewMap } from "./dailyPlan.ts";
import { hasPhrase } from "./learnedWhere.ts";

export type ReuseTarget = { key: string; label: string; kind: "phrase" | "frame"; pieces: string[] };

export function reuseTargets(language: string, review: ReviewMap, limit = 40): ReuseTarget[] {
  const frames = allFramesFor(language);
  const out: ReuseTarget[] = [];
  for (const [key] of Object.entries(review).sort((a, b) => b[1].at - a[1].at)) {
    if (key.startsWith("e|")) out.push({ key, label: key.slice(2), kind: "phrase", pieces: [key.slice(2)] });
    else if (key.startsWith("f|")) {
      const frame = frames.find((f) => f.id === key.slice(2));
      if (frame?.core.length) out.push({ key, label: frame.pattern, kind: "frame", pieces: frame.core });
    }
    if (out.length >= limit) break;
  }
  return out;
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
