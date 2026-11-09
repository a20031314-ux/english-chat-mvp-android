/**
 * 튜터 화면(대화 탭 튜터 줄·튜터 프로필)이 읽는 "이 튜터 몫" — 사용자 2026-11-09 "logbank와 겹치는 값은 표시하지 말고 저대로 만들어줘".
 * 숫자(통화 수·고친 말·다시 맞힘·나아진 점)는 Logbank가 원본이라 여기서 다시 세지 않는다. 튜터 화면에 오는 것은 문 셋뿐:
 * 숙제(그 튜터가 낸 것), 튜터 메모(그 튜터의 마지막 메모), 기억하는 나(lifeFacts — 언어마다 하나, 두 튜터가 같이 씀).
 * 모두 이 폰 저장(callHomework.v1 · callNotes.v1 · tutorLife.v1)에서 읽기만 한다.
 */
import type { TutorGender } from "../chatPartner.ts";
import type { CallNote } from "./callNotes.ts";
import type { Homework } from "./replay.ts";

/** 숙제가 이 튜터 것인지: 그 통화 카드의 튜터, 모르면 지금 고른 튜터. 통화 기록이 지워졌으면 없음. */
export function homeworkOf(
  homework: Homework | null,
  notes: readonly CallNote[],
  callIds: readonly string[],
  gender: TutorGender,
  chosen: TutorGender,
): Homework | null {
  if (!homework || !callIds.includes(homework.callId)) return null;
  const owner = notes.find((note) => note.id === homework.callId)?.gender ?? chosen;
  return owner === gender ? homework : null;
}

/** 이 튜터가 남긴 마지막 메모(앱 언어). 튜터가 적히지 않은 옛 카드는 지금 고른 튜터 것으로 본다. */
export function lastMemoOf(notes: readonly CallNote[], gender: TutorGender, chosen: TutorGender): CallNote | null {
  let best: CallNote | null = null;
  for (const note of notes) {
    if (!note.summary?.trim()) continue;
    if ((note.gender ?? chosen) !== gender) continue;
    if (!best || note.at > best.at) best = note;
  }
  return best;
}

/**
 * 기억하는 나는 튜터 쪽에서 쓴 영어 한 문장("They work at …") — 화면에서는 내 말로 보여 준다("I work at …").
 * 다음 통화 지시(lifeFactsPrompt)에는 원문 그대로 간다. 맨 앞 주어만 바꾼다.
 */
export function factAsMine(text: string): string {
  const trimmed = text.trim();
  const swaps: [RegExp, string][] = [
    [/^They are\b/i, "I am"],
    [/^They were\b/i, "I was"],
    [/^They're\b/i, "I'm"],
    [/^They've\b/i, "I've"],
    [/^They'll\b/i, "I'll"],
    [/^They'd\b/i, "I'd"],
    [/^Their\b/i, "My"],
    [/^They\b/i, "I"],
    [/^The (?:learner|user|student)(?:'s)?\b/i, ""],
  ];
  for (const [from, to] of swaps) {
    if (!from.test(trimmed)) continue;
    if (to) return trimmed.replace(from, to);
    const learner = /^The (?:learner|user|student)'s\b/i.test(trimmed);
    return trimmed.replace(/^The (?:learner|user|student)(?:'s)?\b/i, learner ? "My" : "I").replace(/^I is\b/, "I am").replace(/^I has\b/, "I have").replace(/^I was\b/, "I was");
  }
  return trimmed;
}
