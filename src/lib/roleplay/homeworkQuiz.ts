import { spotFromCard, type QuizQuestion } from "../curriculum/quiz.ts";
import { focusFix, mixedScript, overlap } from "./fixFocus.ts";
import { sentencesOf } from "./reactions.ts";
import type { ReplayScene } from "./replay.ts";
import { segmentWords } from "../wordSegments.ts";

/**
 * 숙제 퀴즈(2026-11-08 사용자 "숙제는 숙제 > 하위탭(퀴즈, 대화) 구조로"): 그 통화에서 나온 것만, 모델 없음.
 * ① 튜터가 고친 내 줄의 바뀐 문장만 → 틀린 곳 찾아 고치기(눌러서 찾고 바른 꼴을 씀, 자리가 안 잡히면 안 냄, 코치 한마디가 있으면 답한 뒤 왜) — 최대 셋
 * ② 장면(대화 탭)의 내 줄 조각 → 앱 언어 뜻을 먼저 보고 빈칸 쓰기 — 합쳐 여섯까지. 내가 통화에서 그대로 말한 조각·①의 답·
 *    한 문장 통째는 안 비움, 같은 문장은 한 번(2026-11-08 통화 체감 점검 표시 반영). 통화에서 내가 한 말을 다듬은 줄만
 *    (장면이 새로 지어낸 줄은 배운 적 없는 말 — 2026-11-19 점검 hard-level), 같은 줄에 조각의 첫 낱말이 또 있으면 안 비움(por la noche ↔ por la mañana, easy-leak).
 * 대화 탭은 같은 조각을 말로, 퀴즈는 글로 — 둘 다 하면 숙제 끝(replay.ts homeworkComplete).
 */
export const HOMEWORK_QUIZ_MAX = 6;
const MAX_FIXES = 3;

const normText = (text: string) => text.toLocaleLowerCase().replace(/[\p{P}\s]+/gu, " ").trim();

/** 낱말 단위(wordSegments — ja·zh·th도 낱말로) — 글자 includes면 짧은 답(a·la·de)이 다른 낱말 속에서도 걸림. */
function wordsOf(text: string, language?: string): string[] {
  return segmentWords(normText(text), language);
}

/** needle 낱말들이 hay 낱말 속에 그 순서로 붙어 있나. */
function hasWords(hay: readonly string[], needle: readonly string[]): boolean {
  if (!needle.length || needle.length > hay.length) return false;
  for (let i = 0; i + needle.length <= hay.length; i++) {
    if (needle.every((word, j) => hay[i + j] === word)) return true;
  }
  return false;
}

function sentencesOfLine(text: string): string[] {
  return sentencesOf(text).map((part) => part.trim());
}

export function homeworkQuiz(
  language: string,
  said: readonly { who: "tutor" | "learner"; text: string; better?: string; meant?: string; about?: string }[],
  scenes: readonly ReplayScene[],
): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  const seen = new Set<string>();
  const norm = (text: string) => text.toLocaleLowerCase().replace(/[\p{P}\s]+/gu, " ").trim();
  // 내가 통화에서 그대로 말한 말(그 조각을 비우면 베끼기 — 2026-11-08 점검 easy-copy).
  const mineLines = said.filter((line) => line.who === "learner" && line.text.trim() && line.text.trim() !== "…").map((line) => line.text);
  const mine = mineLines.map(norm).join(" | ");
  const fixedWords: string[][] = [];

  for (const line of said) {
    if (out.length >= MAX_FIXES) break;
    const fullRight = (line.better || line.meant || "").trim();
    const fullWrong = line.text.trim();
    if (line.who !== "learner" || !fullRight || !fullWrong || fullWrong === "…" || norm(fullRight) === norm(fullWrong)) continue;
    // 바뀐 문장만, 앱 언어 낱말이 섞인 줄은 빼고, 고칠 자리를 직접 써야 하는 문제만(한 번 누르면 끝나는 고르기는 안 냄 — 점검 easy-level).
    const { said: wrong, right } = focusFix(fullWrong, fullRight);
    if (seen.has(norm(right)) || mixedScript(wrong, right)) continue;
    const made = spotFromCard(language, { wrong, right });
    if (!made) continue;
    // 코치가 그 줄에 단 한마디(앱 언어)를 Quizbank 틀린 곳처럼 답한 뒤 "왜"로(연결 묶음 quiz-make, 2026-11-24).
    const about = line.about?.trim();
    const question = about ? { ...made, why: { en: about, ko: about } } : made;
    seen.add(norm(right));
    fixedWords.push(wordsOf(question.want, language));
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
      const pieceWords = wordsOf(piece, language);
      if (mine.includes(key) || fixedWords.some((words) => hasWords(pieceWords, words))) continue;
      const sentence = sentencesOfLine(line.text).find((part) => part.includes(piece));
      if (sentence && norm(sentence) === key) continue;
      // 통화에서 내가 한 말을 다듬은 줄만 — 가장 닮은 내 줄과 낱말 40% 이상.
      if (!mineLines.some((one) => overlap(sentence ?? line.text, one) >= 0.4)) continue;
      // 같은 줄 다른 곳에 조각의 첫 낱말이 또 있으면 그 꼴을 보고 채움.
      const head = norm(piece).split(" ")[0] ?? "";
      const rest = norm(line.text.slice(0, at) + " " + line.text.slice(at + piece.length));
      if (head.length >= 2 && !/[぀-ヿ㐀-鿿]/.test(head) && ` ${rest} `.includes(` ${head} `)) continue;
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

/**
 * 숙제 대화(대화 시뮬레이션): 퀴즈에서 이미 글로 쓴 조각은 빈칸 없이 — 뜻만 보고 한 줄 전체를 말한다
 * (2026-11-19 체감 점검 셋 다 "퀴즈와 바로 뒤 대화가 같은 문장·같은 빈칸").
 */
export function sceneAfterQuiz(scene: ReplayScene, quiz: readonly QuizQuestion[], language?: string): ReplayScene {
  const done = quiz
    .map((question) => (question.kind === "spot" ? question.want : question.kind === "type" ? question.answer : ""))
    .map((text) => wordsOf(text, language))
    .filter((words) => words.length);
  if (!done.length) return scene;
  return {
    ...scene,
    lines: scene.lines.map((line) => {
      if (line.who !== "me" || !line.piece) return line;
      const key = wordsOf(line.piece, language);
      return done.some((one) => hasWords(key, one) || hasWords(one, key)) ? { ...line, piece: null } : line;
    }),
  };
}
