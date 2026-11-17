import { spotFromCard, type QuizQuestion } from "../curriculum/quiz.ts";
import { focusFix, mixedScript } from "./fixFocus.ts";
import { sentencesOf } from "./reactions.ts";
import type { ReplayScene } from "./replay.ts";

/**
 * 숙제 퀴즈(2026-11-08 사용자 "숙제는 숙제 > 하위탭(퀴즈, 대화) 구조로"): 그 통화에서 나온 것만, 모델 없음.
 * ① 튜터가 고친 내 줄의 바뀐 문장만 → 틀린 곳 찾아 고치기(눌러서 찾고 바른 꼴을 씀, 자리가 안 잡히면 안 냄) — 최대 셋
 * ② 장면(대화 탭)의 내 줄 조각 → 앱 언어 뜻을 먼저 보고 빈칸 쓰기 — 합쳐 여섯까지. 내가 통화에서 그대로 말한 조각·①의 답·
 *    한 문장 통째는 안 비움, 같은 문장은 한 번(2026-11-08 통화 체감 점검 표시 반영).
 * 대화 탭은 같은 조각을 말로, 퀴즈는 글로 — 둘 다 하면 숙제 끝(replay.ts homeworkComplete).
 */
export const HOMEWORK_QUIZ_MAX = 6;
const MAX_FIXES = 3;

function sentencesOfLine(text: string): string[] {
  return sentencesOf(text).map((part) => part.trim());
}

export function homeworkQuiz(
  language: string,
  said: readonly { who: "tutor" | "learner"; text: string; better?: string; meant?: string }[],
  scenes: readonly ReplayScene[],
): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  const seen = new Set<string>();
  const norm = (text: string) => text.toLocaleLowerCase().replace(/[\p{P}\s]+/gu, " ").trim();
  // 내가 통화에서 그대로 말한 말(그 조각을 비우면 베끼기 — 2026-11-08 점검 easy-copy).
  const mine = said.filter((line) => line.who === "learner").map((line) => norm(line.text)).join(" | ");
  const fixedWords: string[] = [];

  for (const line of said) {
    if (out.length >= MAX_FIXES) break;
    const fullRight = (line.better || line.meant || "").trim();
    const fullWrong = line.text.trim();
    if (line.who !== "learner" || !fullRight || !fullWrong || fullWrong === "…" || norm(fullRight) === norm(fullWrong)) continue;
    // 바뀐 문장만, 앱 언어 낱말이 섞인 줄은 빼고, 고칠 자리를 직접 써야 하는 문제만(한 번 누르면 끝나는 고르기는 안 냄 — 점검 easy-level).
    const { said: wrong, right } = focusFix(fullWrong, fullRight);
    if (seen.has(norm(right)) || mixedScript(wrong, right)) continue;
    const question = spotFromCard(language, { wrong, right });
    if (!question) continue;
    seen.add(norm(right));
    fixedWords.push(norm(question.want));
    out.push(question);
  }

  for (const scene of scenes) {
    for (const line of scene.lines) {
      if (out.length >= HOMEWORK_QUIZ_MAX) return out;
      if (line.who !== "me" || !line.piece) continue;
      const piece = line.piece;
      const at = line.text.indexOf(piece);
      const key = norm(piece);
      if (at < 0 || !key || seen.has(key) || seen.has(norm(line.text))) continue;
      // 통화에서 그대로 말한 조각·방금 고치기 문제의 답·한 문장 통째(뜻 없이는 답이 여럿)는 비우지 않는다.
      if (mine.includes(key) || fixedWords.some((word) => word && key.includes(word))) continue;
      const sentence = sentencesOfLine(line.text).find((part) => part.includes(piece));
      if (sentence && norm(sentence) === key) continue;
      seen.add(key);
      seen.add(norm(line.text));
      out.push({
        kind: "type",
        text: line.text,
        before: line.text.slice(0, at),
        after: line.text.slice(at + piece.length),
        answer: piece,
        gloss: { en: line.meaning, raw: line.meaning },
        from: "homework",
      });
    }
  }
  return out;
}
