/**
 * One screen asking another to do something: the study map sending a learner
 * to practise a topic in chat, a call, a video or the word list.
 *
 * The tabs are siblings that never held references to each other, and the map
 * should not start to — so a request is a window event with a typed payload.
 * Whoever owns the thing listens: AppHome switches tabs, ChatWindow fills its
 * input, VideoLearningTab loads a video and seeks to the scene.
 */

import type { PracticeGoal } from "@/lib/learner/practice";

export type AppIntents = {
  /** Switch to a bottom tab. */
  openTab: { tab: "map" | "chat" | "roleplay" | "video" | "vocab" };
  /** Put a first line in the chat input, for the learner to send or change. */
  chatDraft: { text: string };
  /** Load a video and, once it plays, jump to the scene. */
  openVideo: { url: string; startSeconds?: number; durationSeconds?: number };
  /**
   * Start a conversation with something to practise in it (learner/practice.ts):
   * chat opens with the tutor speaking first, a call opens the open conversation
   * already in the situation. AppHome switches to the tab; the tab starts it.
   */
  practice: {
    tab: "chat" | "roleplay";
    goal: PracticeGoal;
    /** What the learner sees it called, in the interface language. */
    title?: string;
    /** The mistake as the learner's map names it, in the interface language. */
    mistakeLabel?: string;
  };
  /**
   * AI 튜터와 통화(2026-10-23, conversation-unify 3단계 — 통화 첫 화면 없이 📞로 바로). `resumeId`면 멈춘 그 통화를 이어서.
   * CallHost가 받는다(앱 어디서나 떠 있는 통화 화면).
   */
  /** lesson = 수업 통화(My에서 연 것, 2026-11-07) — 없으면 자유대화. */
  startCall: { resumeId?: string; lesson?: boolean; game?: "quiz" | "twenty" | "teach" };
  /** 저장된 통화 하나를 돌아보기로 연다(대화 안 🗒 통화 기록 카드·지난 대화 서랍에서). */
  /** id 없음 = 통화 기록 목록(CallList, 2026-10-27 채팅과 통화 기록 분리). */
  /** replay = 그 통화의 🎭 장면을 바로(숙제 줄, 2026-11-08). */
  openCall: { id?: string; replay?: boolean };
  /** 내 문장 말해보기(예전 통화 첫 화면 → AI 대화 ⋮ 메뉴). */
  sayOwnLine: Record<string, never>;
  /** 노트(My)의 한 부분을 연다 — 단어장 탭이 노트로 들어온 뒤 "단어장으로" 가던 곳. */
  openNotes: { section: "words" };
  /**
   * 사용법 창을 그 칸으로 연다(새로워진 점의 "자세히", 2026-10-20). 칸 id는 guide/content.ts GUIDE_SECTION_IDS.
   * `chapter`는 묶음으로, `hidden`은 숨긴 기능으로 가려다 온 것(그 장 위에 안내), `manage`는 My "기능 고르기"(묶음 버튼 보임).
   */
  openGuide: { section?: string; chapter?: string; hidden?: boolean; manage?: boolean };
  /**
   * Stagebank의 소재 수업(문장구조·표현·문법 칸)을 연다 — "모를 때 이동해서 확인"(2026-11-01 설계, hub/drafts/quiz-pages-2026-11-01.md).
   * 통화 정리·대본 틀린 줄·Logbank 칩·Quizbank 틀린 문제가 보내고 LessonHost(앱 어디서나 뜨는 층)가 받는다. 열어 본 소재는 정기 시험 재료로 모인다.
   */
  openLesson: { language: string; key: string; /** 대화·통화 화면 위에서 열면(사전 주석) 그 위 층으로. */ above?: boolean; /** 통화 등에서 그 문장을 들고 옴(curriculum/lessonKey.ts LessonScene) — 수업 맨 위 카드·시험 재료. */ scene?: { line: string; said?: string; before?: string; meaning?: string } };
};

const PREFIX = "talkbank:";

/**
 * The last request of each kind, for a screen that is not there yet when it is
 * sent: the call and map tabs are only mounted while shown, so the request that
 * switches to them arrives before they can listen. They take it when they mount.
 */
const pending = new Map<keyof AppIntents, { detail: unknown; at: number; takenAt?: number }>();
const PENDING_MS = 5000;
/**
 * Taken is cleared, but not at once: React may run a state initialiser twice
 * in development, and the second run has to see what the first took.
 */
const TAKEN_GRACE_MS = 300;

export function sendAppIntent<K extends keyof AppIntents>(name: K, detail: AppIntents[K]) {
  if (typeof window === "undefined") return;
  pending.set(name, { detail, at: Date.now() });
  window.dispatchEvent(new CustomEvent(`${PREFIX}${name}`, { detail }));
}

/** A request sent in the last few seconds and not yet taken; taking it clears it. */
export function takeAppIntent<K extends keyof AppIntents>(
  name: K,
  accept: (detail: AppIntents[K]) => boolean = () => true,
): AppIntents[K] | null {
  const row = pending.get(name);
  const now = Date.now();
  if (!row || now - row.at > PENDING_MS) return null;
  if (row.takenAt !== undefined && now - row.takenAt > TAKEN_GRACE_MS) return null;
  const detail = row.detail as AppIntents[K];
  if (!accept(detail)) return null;
  row.takenAt ??= now;
  return detail;
}

/** Listen for one kind of request; returns the function that stops listening. */
export function onAppIntent<K extends keyof AppIntents>(
  name: K,
  handle: (detail: AppIntents[K]) => void,
): () => void {
  if (typeof window === "undefined") return () => undefined;
  const listener = (event: Event) => handle((event as CustomEvent<AppIntents[K]>).detail);
  window.addEventListener(`${PREFIX}${name}`, listener);
  return () => window.removeEventListener(`${PREFIX}${name}`, listener);
}

/** 소재 수업 열기(openLesson 신호) — 부르는 곳이 많아 한 줄로. */
export function openLesson(detail: AppIntents["openLesson"]): void {
  sendAppIntent("openLesson", detail);
}
