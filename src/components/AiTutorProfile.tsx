"use client";

import { useEffect, useState } from "react";
import { ProfileFrame } from "@/components/ProfileFrame";
import { sendAppIntent } from "@/lib/appIntents";
import type { UICopy } from "@/lib/copy";
import { chatPartnerForLanguage, type TutorGender } from "@/lib/chatPartner";
import { useLearningLanguageOptional } from "@/contexts/LearningLanguageContext";
import { useTutorGender, writeTutorGender } from "@/lib/tutorGender";
import { APP_LOCALE_STORAGE_KEY } from "@/lib/copy";
import { tutorAbout } from "@/lib/tutorAbout";
import { setTutorFollow, useFollowedTutors } from "@/lib/tutorFollows";
import { roomCopy } from "@/lib/rooms/copy";
import { CALL_NOTES_EVENT, readCallNotes, type CallNote } from "@/lib/roleplay/callNotes";
import { readCalls } from "@/lib/roleplay/callStore";
import { readHomework, type Homework } from "@/lib/roleplay/replay";
import { homeworkOf, lastMemoOf } from "@/lib/roleplay/tutorDesk";

/** 지금 앱 언어(AppHome이 저장) — 바뀌면 ui가 바뀌어 이 화면도 다시 그려져 새 값을 읽는다. */
function appLocale(): string {
  try {
    return globalThis.localStorage?.getItem(APP_LOCALE_STORAGE_KEY) ?? "en";
  } catch {
    return "en";
  }
}

/** 튜터 자기소개(lib/tutorAbout.ts — 학습 언어·고른 성별, 앱 언어로). 없으면 예전 글(aiTutorBio). */
function useTutorAbout(targetLanguage: string, fallback: string, pick?: TutorGender): string {
  const chosen = useTutorGender(targetLanguage);
  const gender = pick ?? chosen;
  const lang = chatPartnerForLanguage(targetLanguage, gender).languageCode;
  return tutorAbout(lang, gender, appLocale()) || fallback;
}

/**
 * AI 튜터도 사람 중 하나(2026-10-27 사용자 "AI 튜터를 아예 사람들과 통합해줘. 프로필 탭에 가면 AI 튜터가 있고 대화를 걸 수 있는 흐름으로").
 * 사람 탭 목록 맨 위에 사람 카드처럼 한 줄, 누르면 프로필 시트 — 💬 메시지(AI 대화) · 📞 통화 · 통화 기록.
 * 이름·국기는 학습 언어별 튜터(lib/chatPartner.ts — AI 대화 머리와 같은 사람). 로그인 없이도 보인다(AI 기능은 로그인 없이).
 * 소개 글은 튜터 자기소개만(lib/tutorAbout.ts) — 실제 사람 프로필처럼, AI라는 표시는 이름 아래 "AI 튜터" 칩 하나(사용자 2026-11-02 "그냥 실제 캐릭터처럼 쓰고 AI 표시만"). 예전 설명 글 `aiTutorBio`는 소개가 없을 때만.
 */
/**
 * AI 튜터 그림(2026-10-27 사용자 "AI 아이콘으로 이미지와 프로필을 만들어 넣어줘. 사람처럼 만들 필요는 없고"):
 * 사람 얼굴 대신 말풍선 + 반짝임. 색은 토큰(info)에서 — currentColor.
 * 2026-11-01 사용자 "이걸로 국가별로 튜터 프로필에 넣어줘"·"성별별로 만들었어": 그 언어·성의 튜터 그림(public/tutors, chatPartner.ts `photo`).
 * 언어를 모를 때만 이 아이콘. 언어를 안 주면 지금 학습 언어, 성을 안 주면 고른 튜터.
 */
export function AiAvatar({ size = 60, language, gender }: { size?: number; language?: string; gender?: TutorGender }) {
  const learning = useLearningLanguageOptional();
  const lang = language ?? learning?.targetLanguage ?? null;
  const chosen = useTutorGender(lang);
  const photo = lang ? chatPartnerForLanguage(lang, gender ?? chosen).photo : undefined;
  if (photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo}
        alt=""
        aria-hidden
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="shrink-0 rounded-full border border-info/40 object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-full border border-info/40 bg-info/15 text-info"
    >
      <svg viewBox="0 0 48 48" width={Math.round(size * 0.6)} height={Math.round(size * 0.6)} fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
        {/* 말풍선 */}
        <path d="M9 12.5A5.5 5.5 0 0 1 14.5 7h19A5.5 5.5 0 0 1 39 12.5v13A5.5 5.5 0 0 1 33.5 31H22l-8 7v-7h0.5A5.5 5.5 0 0 1 9 25.5z" />
        {/* 반짝임(큰 별 + 작은 별) */}
        <path d="M23 12.5l1.6 4.2 4.2 1.6-4.2 1.6L23 24.1l-1.6-4.2-4.2-1.6 4.2-1.6z" fill="currentColor" stroke="none" />
        <path d="M31.5 21.5l0.8 2 2 0.8-2 0.8-0.8 2-0.8-2-2-0.8 2-0.8z" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

function TutorName({ targetLanguage, gender, className = "" }: { targetLanguage: string; gender?: TutorGender; className?: string }) {
  const chosen = useTutorGender(targetLanguage);
  const partner = chatPartnerForLanguage(targetLanguage, gender ?? chosen);
  return (
    <span className={`flex min-w-0 items-center gap-1.5 ${className}`}>
      <bdi className="truncate">{partner.givenName}</bdi>
      {partner.flagCountry ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/flags/${partner.flagCountry}.png`} alt="" className="h-3.5 w-5 shrink-0 object-cover" />
      ) : null}
    </span>
  );
}

/**
 * 그 튜터와 채팅(사용자 2026-11-02 "튜터프로필도 아예 사람처럼 팔로우, 채팅걸기까지"): 그 튜터로 정하고(튜터별 대화방 — 그 튜터와 하던 대화가 열림)
 * AI 대화를 연다. 예전 💬(대화 탭으로 옮기기만, 2026-10-30에 뺌)과 달리 바로 그 사람과의 대화로 간다.
 */
export function chatWithTutor(targetLanguage: string, gender: TutorGender | undefined) {
  if (gender) writeTutorGender(targetLanguage, gender);
  sendAppIntent("openTab", { tab: "chat" });
}

export type CallKind = "talk" | "lesson" | "twenty" | "teach";

/** 그 튜터와 통화: 튜터 목소리를 그 사람으로 정하고(채팅·통화가 같이 따라감, lib/tutorGender.ts) 그 종류의 통화를 연다. */
export function callTutor(targetLanguage: string, gender: TutorGender | undefined, kind: CallKind = "talk") {
  if (gender) writeTutorGender(targetLanguage, gender);
  sendAppIntent("startCall", kind === "lesson" ? { lesson: true } : kind === "talk" ? {} : { game: kind });
}

/**
 * 사람 탭 맨 위 AI 튜터 둘(그 학습 언어의 여자·남자 튜터, 사용자 2026-11-02 "AI 튜터가 한쪽 성별만 떠") — 지금 고른 튜터가 먼저.
 */
export function AiTutorPeople({ ui, targetLanguage, canCall }: { ui: UICopy; targetLanguage: string; canCall: boolean }) {
  const chosen = useTutorGender(targetLanguage);
  const order: TutorGender[] = chosen === "f" ? ["f", "m"] : ["m", "f"];
  return (
    <div className="flex flex-col gap-3">
      {order.map((gender) => (
        <AiTutorPerson key={gender} ui={ui} targetLanguage={targetLanguage} canCall={canCall} gender={gender} />
      ))}
    </div>
  );
}

/** 사람 탭 목록의 AI 튜터 한 줄(사람 카드와 같은 모양). */
export function AiTutorPerson({ ui, targetLanguage, canCall, gender }: { ui: UICopy; targetLanguage: string; canCall: boolean; gender?: TutorGender }) {
  const [open, setOpen] = useState(false);
  const about = useTutorAbout(targetLanguage, ui.aiTutorBio, gender);
  return (
    <>
      <div className="flex gap-3 border-b border-white/[0.07] pb-3">
        <button type="button" onClick={() => setOpen(true)} className="shrink-0 self-start" aria-label={ui.talkAiTutor}>
          <AiAvatar language={targetLanguage} gender={gender} />
        </button>
        <div className="min-w-0 flex-1">
          <button type="button" onClick={() => setOpen(true)} className="block w-full text-start">
            <TutorName targetLanguage={targetLanguage} gender={gender} className="text-body font-semibold text-white" />
            <span className="mt-1 inline-block rounded-full bg-info/15 px-2 py-0.5 text-meta text-info">{ui.talkAiTutor}</span>
            <p className="mt-1.5 line-clamp-2 text-note leading-relaxed text-slate-300">{about}</p>
          </button>
          <div className="mt-1.5 flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => chatWithTutor(targetLanguage, gender)}
              className="rounded-full border border-white/20 px-3 py-1 text-meta text-slate-100"
            >
              💬 {roomCopy(appLocale()).message}
            </button>
            {canCall ? <CallDoors ui={ui} look="icons" onPick={(kind) => callTutor(targetLanguage, gender, kind)} /> : null}
          </div>
        </div>
      </div>
      {open ? <AiTutorSheet ui={ui} targetLanguage={targetLanguage} canCall={canCall} gender={gender} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

/**
 * 튜터 화면이 보는 "이 튜터 몫"(사용자 2026-11-09 "logbank와 겹치는 값은 표시하지 말고 저대로 만들어줘", 시안 https://claude.ai/artifact/MUsRq7Fg5e878sd8E9gMte):
 * 그 튜터가 낸 숙제 · 그 튜터의 마지막 메모. 숫자는 Logbank 몫이라 없다. 튜터가 기억하는 삶(tutorLife.v1)은 화면에 띄우지 않는다 — 통화에서 튜터가 꺼내는 게 목적(사용자 2026-11-09). 이 폰 저장만 읽음(lib/roleplay/tutorDesk.ts).
 */
export function useTutorDesk(language: string, gender: TutorGender) {
  const chosen = useTutorGender(language);
  const [desk, setDesk] = useState<{ homework: Homework | null; memo: CallNote | null }>({ homework: null, memo: null });
  useEffect(() => {
    const load = () => {
      try {
        const notes = readCallNotes(language);
        const ids = readCalls().map((call) => call.id);
        setDesk({
          homework: homeworkOf(readHomework(globalThis.localStorage, language), notes, ids, gender, chosen),
          memo: lastMemoOf(notes, gender, chosen),
        });
      } catch {
        setDesk({ homework: null, memo: null });
      }
    };
    load();
    window.addEventListener("focus", load);
    window.addEventListener("storage", load);
    window.addEventListener(CALL_NOTES_EVENT, load);
    return () => {
      window.removeEventListener("focus", load);
      window.removeEventListener("storage", load);
      window.removeEventListener(CALL_NOTES_EVENT, load);
    };
  }, [language, gender, chosen]);
  return desk;
}

/** 숙제 한 줄(TodayCards HomeworkRow와 같은 이름·같은 문 — openCall replay → 숙제 화면). */
export function TutorHomework({ ui, homework, className = "" }: { ui: UICopy; homework: Homework; className?: string }) {
  return (
    <button
      type="button"
      data-tutor-homework={homework.done ? "done" : "open"}
      onClick={() => sendAppIntent("openCall", { id: homework.callId, replay: true })}
      className={`flex min-h-11 w-full items-center gap-2 rounded-xl border px-3 py-2 text-start ${
        homework.done ? "border-good/30 bg-good/10" : "border-warn/30 bg-warn/10 hover:bg-warn/15"
      } ${className}`}
    >
      <span className={`text-body font-semibold ${homework.done ? "text-good" : "text-warn"}`}>{ui.homeworkTag}</span>
      <span className="min-w-0 flex-1 truncate text-note text-slate-300">
        {ui.quizTag} · {ui.homeworkTalk}
      </span>
      <span aria-hidden className={`text-note ${homework.done ? "text-good" : "text-warn"} ${homework.done ? "" : "rtl:rotate-180"}`}>
        {homework.done ? "✓" : "›"}
      </span>
    </button>
  );
}

/** 숙제가 남은 튜터 얼굴 모서리 점. */
export function HomeworkDot({ size = 12 }: { size?: number }) {
  return <span aria-hidden style={{ width: size, height: size }} className="absolute -end-0.5 -top-0.5 rounded-full border-2 border-surface bg-warn" />;
}

function shortDay(at: number, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(at);
  } catch {
    return new Date(at).toLocaleDateString();
  }
}

/**
 * 통화 문 — 자유대화 · 수업 · 게임을 같은 층으로(사용자 2026-11-09 "자유대화, 수업, 게임.. 이런 옵션들은 같은 층위로 나열해줘"):
 * 셋 다 같은 크기·같은 모양, 게임을 누르면 그 아래 줄에 스무고개 · 가르치기. "wide"는 프로필·고른 튜터 줄(이름 붙은 버튼), "icons"는 다른 튜터 줄(아이콘만).
 */
export function CallDoors({ ui, onPick, look = "wide", className = "" }: { ui: UICopy; onPick: (kind: CallKind) => void; look?: "wide" | "icons"; className?: string }) {
  const [games, setGames] = useState(false);
  const doors: { kind: "talk" | "lesson" | "game"; icon: string; label: string }[] = [
    { kind: "talk", icon: "📞", label: ui.callModeTalk },
    { kind: "lesson", icon: "🎓", label: ui.callModeStudy },
    { kind: "game", icon: "🎲", label: ui.callModeGame },
  ];
  const tap = (kind: "talk" | "lesson" | "game") => (kind === "game" ? setGames((open) => !open) : onPick(kind));
  const on = "border-white/60 bg-white/15";
  const sub = (
    <div className="grid grid-cols-2 gap-2">
      <button type="button" data-call-choice="twenty" onClick={() => onPick("twenty")} className="min-h-11 rounded-xl border border-white/20 px-2 text-note text-slate-100 hover:bg-white/10">
        {ui.gameTwenty}
      </button>
      <button type="button" data-call-choice="teach" onClick={() => onPick("teach")} className="min-h-11 rounded-xl border border-white/20 px-2 text-note text-slate-100 hover:bg-white/10">
        {ui.gameTeach} <span className="ms-1 rounded-full bg-warn/20 px-1.5 text-caption text-warn">{ui.mapLevelAdvanced}</span>
      </button>
    </div>
  );
  if (look === "icons") {
    return (
      <>
        {doors.map((door) => (
          <button
            key={door.kind}
            type="button"
            data-call-choice={door.kind}
            onClick={() => tap(door.kind)}
            aria-label={door.label}
            title={door.label}
            {...(door.kind === "game" ? { "aria-expanded": games } : {})}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-title hover:bg-white/10 ${door.kind === "game" && games ? on : "border-line"}`}
          >
            <span aria-hidden>{door.icon}</span>
          </button>
        ))}
        {games ? <div className="basis-full px-1 pt-1">{sub}</div> : null}
      </>
    );
  }
  return (
    <div data-call-doors className={`flex flex-col gap-2 ${className}`}>
      <div className="grid grid-cols-3 gap-2">
        {doors.map((door) => (
          <button
            key={door.kind}
            type="button"
            data-call-choice={door.kind}
            onClick={() => tap(door.kind)}
            {...(door.kind === "game" ? { "aria-expanded": games } : {})}
            className={`min-h-11 rounded-xl border px-2 text-note font-medium text-ink hover:bg-white/10 ${door.kind === "game" && games ? on : "border-white/20"}`}
          >
            {door.icon} {door.label}
          </button>
        ))}
      </div>
      {games ? sub : null}
    </div>
  );
}

/**
 * AI 튜터 프로필 시트 — 사람 프로필과 같은 틀(ProfileFrame, 2026-11-02 사용자 "프로필 구조 통일").
 * 2026-11-09 "이 튜터와의 공부"(시안): 문 자유대화 · 수업 · 게임(같은 층) → 숙제 → 튜터 메모 → 아래 팔로우 · 메시지 · 통화 기록.
 */
export function AiTutorSheet({
  ui,
  targetLanguage,
  canCall,
  gender,
  onClose,
}: {
  ui: UICopy;
  targetLanguage: string;
  canCall: boolean;
  gender?: TutorGender;
  onClose: () => void;
}) {
  const about = useTutorAbout(targetLanguage, ui.aiTutorBio, gender);
  const chosen = useTutorGender(targetLanguage);
  const who = gender ?? chosen;
  const name = chatPartnerForLanguage(targetLanguage, who).givenName;
  const locale = appLocale();
  // 사람 프로필과 같은 버튼 이름(rooms/copy — 14개 언어 이미 있음).
  const t = roomCopy(locale);
  const following = useFollowedTutors(targetLanguage).includes(who);
  const desk = useTutorDesk(targetLanguage, who);
  const go = (action: () => void) => () => {
    onClose();
    action();
  };
  const small = "min-h-11 rounded-xl border border-white/20 px-2 text-note text-slate-100 hover:bg-white/5";
  return (
    <ProfileFrame
      label={name}
      closeLabel={ui.billingClose}
      onClose={onClose}
      face={<AiAvatar size={64} language={targetLanguage} gender={gender} />}
      name={<TutorName targetLanguage={targetLanguage} gender={gender} />}
      sub={<span className="inline-block rounded-full bg-info/15 px-2 py-0.5 text-meta text-info">{ui.talkAiTutor}</span>}
      bio={
        <p className="whitespace-pre-line text-body leading-relaxed text-slate-200" dir="auto">
          {about}
        </p>
      }
    >
      {canCall ? <CallDoors ui={ui} className="mt-3" onPick={(kind) => go(() => callTutor(targetLanguage, who, kind))()} /> : null}
      {desk.homework ? (
        <div className="mt-3" onClickCapture={() => onClose()}>
          <TutorHomework ui={ui} homework={desk.homework} />
        </div>
      ) : null}
      {desk.memo?.summary ? (
        <div data-tutor-memo className="mt-3 rounded-xl bg-surface-sunk p-3">
          <p className="text-caption text-slate-400">{shortDay(desk.memo.at, locale)}</p>
          <p dir="auto" className="mt-1 whitespace-pre-line text-body leading-relaxed text-slate-200">
            {desk.memo.summary}
          </p>
        </div>
      ) : null}
      {/* 사람 프로필처럼: 팔로우(대화 탭에 그 튜터 줄) · 메시지(그 튜터와의 AI 대화) · 통화 기록 — 차단·신고는 기본 튜터라 없음. */}
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-3">
        <button
          type="button"
          aria-pressed={following}
          onClick={() => setTutorFollow(targetLanguage, who, !following)}
          className={following ? small : "min-h-11 rounded-xl bg-violet-500 px-2 text-note font-medium text-white"}
        >
          {following ? `✓ ${t.following}` : `+ ${t.follow}`}
        </button>
        <button type="button" onClick={go(() => chatWithTutor(targetLanguage, who))} className={small}>
          💬 {t.message}
        </button>
        {canCall ? (
          <button type="button" onClick={go(() => sendAppIntent("openCall", {}))} className={small}>
            {ui.callRecordsTitle}
          </button>
        ) : null}
      </div>
    </ProfileFrame>
  );
}
