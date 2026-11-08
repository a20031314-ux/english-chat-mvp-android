import { fixOf, spotFromCard, type QuizQuestion } from "../curriculum/quiz.ts";
import type { ReplayScene } from "./replay.ts";

/**
 * 숙제 퀴즈(2026-11-08 사용자 "숙제는 숙제 > 하위탭(퀴즈, 대화) 구조로"): 그 통화에서 나온 것만, 모델 없음.
 * ① 튜터가 고친 내 줄 → 틀린 곳 찾아 고치기(자리가 안 잡히면 둘 중 맞는 문장) — 최대 셋
 * ② 장면(대화 탭)의 내 줄 조각 → 앱 언어 뜻 + 빈칸 쓰기 — 합쳐 여섯까지, 같은 조각은 한 번.
 * 대화 탭은 같은 조각을 말로, 퀴즈는 글로 — 둘 다 하면 숙제 끝(replay.ts homeworkComplete).
 */
export const HOMEWORK_QUIZ_MAX = 6;
const MAX_FIXES = 3;

export function homeworkQuiz(
  language: string,
  said: readonly { who: "tutor" | "learner"; text: string; better?: string; meant?: string }[],
  scenes: readonly ReplayScene[],
): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  const seen = new Set<string>();
  const norm = (text: string) => text.toLocaleLowerCase().replace(/[\p{P}\s]+/gu, " ").trim();
  let seed = 7;
  const random = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);

  for (const line of said) {
    if (out.length >= MAX_FIXES) break;
    const right = (line.better || line.meant || "").trim();
    const wrong = line.text.trim();
    if (line.who !== "learner" || !right || !wrong || wrong === "…" || norm(right) === norm(wrong) || seen.has(norm(right))) continue;
    const question = spotFromCard(language, { wrong, right }) ?? fixOf(language, { wrong, right }, random);
    if (!question) continue;
    seen.add(norm(right));
    out.push(question);
  }

  for (const scene of scenes) {
    for (const line of scene.lines) {
      if (out.length >= HOMEWORK_QUIZ_MAX) return out;
      if (line.who !== "me" || !line.piece) continue;
      const at = line.text.indexOf(line.piece);
      if (at < 0 || seen.has(norm(line.piece))) continue;
      seen.add(norm(line.piece));
      out.push({
        kind: "type",
        text: line.text,
        before: line.text.slice(0, at),
        after: line.text.slice(at + line.piece.length),
        answer: line.piece,
        gloss: { en: line.meaning, raw: line.meaning },
        from: "homework",
      });
    }
  }
  return out;
}
