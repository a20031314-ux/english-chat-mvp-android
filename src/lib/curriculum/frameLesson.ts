/**
 * 문장구조 수업(2026-10-30 사용자 "일반적인 설명(문법, 구문) > 문제풀이 > 대화" → 대화는 주고받기형):
 * 틀 하나를 열면 ① 설명(틀·뜻·짧은 설명·예문 넷 듣기) → ② 문제 풀이(그 틀 퀴즈 세 문제, curriculum/quiz.ts) →
 * ③ 대화(상대 줄을 듣고 그 틀로 대답, 뜻으로 판단). 대화 차례를 모두(원문 안 보고) 맞히면 그 틀 익힘.
 * 설명·대화 재료는 서버가 틀마다 한 번 만들어 같이 씀(server/frameLesson.ts, /api/curriculum/frame-lesson). 못 받으면 대화는 틀 예문으로.
 */
import type { Frame } from "./frames.ts";
import { glossFor } from "./stageScripts.ts";

/** 대화 한 차례: 상대 줄(학습 언어)·그 뜻(앱 언어), 내가 할 대답(학습 언어)·그 뜻(앱 언어). */
export type LessonTurn = { them: string; themGloss: string; me: string; meGloss: string };
/** 구조 한 조각: 틀의 고정 부분(학습 언어, ___ 칸이면 "___")과 그 조각이 하는 일(앱 언어). */
export type LessonPart = { piece: string; role: string };
/** 설명(2026-10-30 사용자 "이 표현은 이런 뜻이고 왜 이런 구조고 예문은 이런 게 있다"): 뜻 · 구조(조각마다) · 쓰임. explain은 v4까지의 줄글. */
export type FrameLesson = { explain: string[]; meaning?: string; parts?: LessonPart[]; usage?: string; turns: LessonTurn[] };

export type LessonStep = "explain" | "quiz" | "talk" | "done";

/** 서버 수업이 없을 때의 대화: 틀 예문을 내 대답으로(상대 줄 없이 뜻만). */
export function fallbackTurns(frame: Frame, locale: string): LessonTurn[] {
  return frame.examples.slice(1, 4).map((example) => ({ them: "", themGloss: "", me: example.text, meGloss: glossFor(example.gloss, locale) }));
}

/** 대화 차례를 모두 원문을 보지 않고 맞혔으면 통과. */
export function lessonPassed(results: readonly { good: boolean; revealed: boolean }[], turns: number): boolean {
  return turns > 0 && results.length >= turns && results.slice(0, turns).every((one) => one.good && !one.revealed);
}
