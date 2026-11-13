import { chooseOf, lessonQuiz, quizSources, rng, spotFromCard, type QuizQuestion } from "../curriculum/quiz.ts";
import { allFramesFor } from "../curriculum/frames.ts";
import { focusFix, mixedScript } from "./fixFocus.ts";
import { sentencesOf } from "./reactions.ts";
import type { ReplayScene } from "./replay.ts";

/**
 * 숙제 퀴즈(2026-11-08 사용자 "숙제는 숙제 > 하위탭(퀴즈, 대화) 구조로"): 그 통화에서 나온 것만, 모델 없음.
 * ① 튜터가 고친 내 줄의 바뀐 문장만 → 틀린 곳 찾아 고치기(눌러서 찾고 바른 꼴을 씀, 자리가 안 잡히면 안 냄) — 최대 셋
 * ② 장면(대화 탭)의 내 줄 조각 → 앱 언어 뜻을 먼저 보고 빈칸 쓰기 — 합쳐 여섯까지. 내가 통화에서 그대로 말한 조각·①의 답·
 *    한 문장 통째는 안 비움, 같은 문장은 한 번(2026-11-08 통화 체감 점검 표시 반영).
 * ③ 수업 계획(lessonPlan.ts LessonTrace): 그 통화가 다룬 틀마다 한 문제(빈칸 쓰기 먼저 — 떠올려 쓰기) 최대 셋, 다음 틀 예습 한 문제(고르기 — 알아보기).
 *    틀 문제의 결과는 틀마다(keys) → 다음 수업 숙제 리뷰(lessonPlan.ts lastHomework).
 * 대화 탭은 같은 조각을 말로, 퀴즈는 글로 — 둘 다 하면 숙제 끝(replay.ts homeworkComplete).
 */
export const HOMEWORK_QUIZ_MAX = 8;
const MAX_FIXES = 3;
const MAX_FRAMES = 3;

/** 문제와, 틀 문제면 그 틀 열쇠(f|…) — 아니면 "". 예습 문제는 결과를 리뷰에 쓰지 않으니 "". */
export type HomeworkQuiz = { questions: QuizQuestion[]; keys: string[] };

/** 틀 하나의 숙제 문제 — 떠올려 쓰는 칸(빈칸 쓰기 → 틀린 곳 → 순서) 먼저, 예습은 고르기 먼저. */
function frameQuestion(language: string, key: string, seed: string, preview: boolean, avoid: ReadonlySet<string>): QuizQuestion | null {
  const frame = allFramesFor(language).find((one) => one.id === key.slice(2));
  if (!frame) return null;
  // 예습은 처음 보는 틀 — 쓰게 하지 않고 알아보기(고르기)만(RULES 11 ③).
  if (preview) {
    const random = rng(`hw|${seed}|${key}`);
    for (const source of quizSources(language, key)) {
      if (avoid.has(source.text) || (source.stage && source.stage > frame.stage + 1)) continue;
      const choose = chooseOf(language, key, source, random);
      if (choose) return choose;
    }
  }
  const made = lessonQuiz(language, key, { seed: `hw|${seed}`, stage: frame.stage, min: 1, avoid });
  const order: QuizQuestion["kind"][] = preview ? ["choose", "type", "spot", "order"] : ["type", "spot", "order", "choose"];
  for (const kind of order) {
    const found = made.find((question) => question.kind === kind);
    if (found) return found;
  }
  return made[0] ?? null;
}

function sentencesOfLine(text: string): string[] {
  return sentencesOf(text).map((part) => part.trim());
}

export function homeworkQuiz(
  language: string,
  said: readonly { who: "tutor" | "learner"; text: string; better?: string; meant?: string }[],
  scenes: readonly ReplayScene[],
  lesson?: { covered: readonly string[]; next?: string } | null,
  seed = "",
): HomeworkQuiz {
  const out: QuizQuestion[] = [];
  const keys: string[] = [];
  const done = (): HomeworkQuiz => ({ questions: out, keys: [...keys, ...Array(Math.max(0, out.length - keys.length)).fill("")] });
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
    keys.push("");
  }

  // 다룬 틀마다 한 문제, 예습은 끝에 하나 — 자리를 먼저 잡아 두고 장면 조각이 남은 칸을 채운다.
  const asked = new Set<string>();
  const frameQs: { question: QuizQuestion; key: string }[] = [];
  for (const key of (lesson?.covered ?? []).slice(0, MAX_FRAMES)) {
    const question = frameQuestion(language, key, seed, false, asked);
    if (!question) continue;
    if ("text" in question) asked.add(question.text);
    frameQs.push({ question, key });
  }
  const preview = lesson?.next && !lesson.covered.includes(lesson.next) ? frameQuestion(language, lesson.next, seed, true, asked) : null;
  for (const one of frameQs) {
    out.push(one.question);
    keys.push(one.key);
  }
  const room = HOMEWORK_QUIZ_MAX - (preview ? 1 : 0);

  for (const scene of scenes) {
    for (const line of scene.lines) {
      if (out.length >= room) return withPreview();
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
      keys.push("");
    }
  }
  return withPreview();

  function withPreview(): HomeworkQuiz {
    if (preview && !out.includes(preview)) {
      out.push(preview);
      keys.push("");
    }
    return done();
  }
}
