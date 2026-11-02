/**
 * 고정 수업 퀴즈 셋(check.ts FixedQuiz) → 수업 화면이 그리는 문제 모양(curriculum/quiz.ts QuizQuestion).
 * 빈칸 쓰기 · 빈칸 고르기 · 틀린 곳 고치기(spot — 낱말을 눌러 틀린 곳을 찾고 바른 말을 침). 못 만드는 것은 뺀다.
 * 뜻(cue)은 이미 앱 언어라 gloss.raw로(quizGloss가 그대로 씀, 앱 언어 = 학습 언어면 숨김).
 */
import { diffSpan, type QuizQuestion } from "../quiz.ts";
import { isSpaceless, segmentWords } from "../../wordSegments.ts";
import type { FixedQuiz } from "./check.ts";

/** 바른 말이 "빼기"인 고치기(예: I can to drive → to를 뺌). */
const REMOVE = /^\((빼기|remove|削除|삭제)\)$|^$/i;

/**
 * 고르기 보기 섞기 — 원고는 정답이 늘 0번이라(생성 예시도 0) 그대로 내면 첫 보기만 누르면 맞는다(2026-11-02 보고함 major).
 * 문장으로 정한 고정 난수라 같은 문제는 늘 같은 자리(다시 열어도 그대로, 문제마다 다름).
 */
export function shuffleOptions(options: readonly string[], answer: number, seed: string): { options: string[]; answer: number } {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.codePointAt(0)!, 16777619) >>> 0;
  const order = options.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i -= 1) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    h = Math.imul(h ^ (h >>> 13), 3266489909) >>> 0;
    const j = h % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return { options: order.map((i) => options[i]), answer: order.indexOf(answer) };
}

/**
 * 빈칸 앞뒤 띄어쓰기(띄어 쓰는 말만): 모델이 "Last night I" + "a movie."처럼 띄어쓰기 없이 주면 문장이 붙어 보였다(2026-11-03 문법 한 장).
 * 앞 글 끝·뒤 글 처음에 한 칸 — 뒤 글이 문장부호로 시작하면 그대로.
 */
export function spaceAround(language: string, before: string, after: string): { before: string; after: string } {
  if (["ja", "zh", "th"].includes(language) || isSpaceless(`${before}${after}`)) return { before, after };
  const b = before && !/\s$/.test(before) && !/[¿¡(«"'"']$/u.test(before) ? `${before} ` : before;
  const a = after && !/^\s/.test(after) && !/^[\p{P}]/u.test(after) ? ` ${after}` : after;
  return { before: b, after: a };
}

export function fixedQuizQuestions(language: string, quiz: readonly FixedQuiz[], from: string): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  for (const raw of quiz) {
    const q = raw.kind === "fix" ? raw : { ...raw, ...spaceAround(language, raw.before, raw.after) };
    const gloss = { en: q.cue, raw: q.cue };
    if (q.kind === "type") {
      out.push({ kind: "type", text: `${q.before}${q.answer}${q.after}`, before: q.before, after: q.after, answer: q.answer, gloss, from });
    } else if (q.kind === "choose") {
      const right = q.options[q.answer];
      if (!right) continue;
      const mixed = shuffleOptions(q.options, q.answer, `${q.before}|${q.after}|${q.options.join("|")}`);
      out.push({ kind: "choose", text: `${q.before}${right}${q.after}`, before: q.before, after: q.after, options: mixed.options, answer: mixed.answer, gloss, from });
    } else {
      const at = q.wrong.indexOf(q.bad);
      if (at < 0) continue;
      const replaced = REMOVE.test(q.right.trim()) ? "" : q.right;
      const right = `${q.wrong.slice(0, at)}${replaced}${q.wrong.slice(at + q.bad.length)}`.replace(/\s{2,}/g, " ").replace(/\s+([.,!?])/g, "$1").replace(/\s+'/g, "'").trim();
      const span = diffSpan(language, q.wrong, right);
      if (span) {
        out.push({ kind: "spot", text: q.wrong, right, words: span.words, bad: span.bad, want: span.want, gloss, from });
        continue;
      }
      const words = segmentWords(q.wrong, language);
      // 빼기만 하는 고치기(I can to drive): 칠 말이 없어 두 문장 중 맞는 것 고르기.
      if (!replaced.trim()) {
        // 맞는 문장이 늘 앞이면 외워 버리니 문장 길이로 자리를 섞는다(같은 수업은 늘 같은 자리).
        const options = q.wrong.length % 2 ? [q.wrong, right] : [right, q.wrong];
        out.push({ kind: "fix", wrong: q.wrong, right, words, bad: [], options, answer: options.indexOf(right) });
        continue;
      }
      // 말을 더하는 고치기(I'm teacher → a teacher): 틀린 곳(bad 조각) 낱말을 누르고 바른 말 전체를 친다.
      const piece = segmentWords(q.bad, language).map((one) => one.toLocaleLowerCase());
      const start = words.findIndex((_, i) => piece.every((one, k) => words[i + k]?.toLocaleLowerCase().replace(/[\p{P}]/gu, "") === one.replace(/[\p{P}]/gu, "")));
      if (start < 0 || !piece.length) continue;
      out.push({ kind: "spot", text: q.wrong, right, words, bad: piece.map((_, k) => start + k), want: replaced.trim(), gloss, from });
    }
  }
  return out;
}
