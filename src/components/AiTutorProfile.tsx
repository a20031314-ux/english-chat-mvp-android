"use client";

import { useState } from "react";
import { PROFILE_WIDE_BUTTON, ProfileFrame } from "@/components/ProfileFrame";
import { sendAppIntent } from "@/lib/appIntents";
import type { UICopy } from "@/lib/copy";
import { chatPartnerForLanguage, type TutorGender } from "@/lib/chatPartner";
import { useLearningLanguageOptional } from "@/contexts/LearningLanguageContext";
import { useTutorGender, writeTutorGender } from "@/lib/tutorGender";
import { APP_LOCALE_STORAGE_KEY } from "@/lib/copy";
import { tutorAbout } from "@/lib/tutorAbout";
import { setTutorFollow, useFollowedTutors } from "@/lib/tutorFollows";
import { roomCopy } from "@/lib/rooms/copy";

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

type CallKind = "talk" | "lesson" | "quiz" | "twenty" | "teach";

/** 그 튜터와 통화: 튜터 목소리를 그 사람으로 정하고(채팅·통화가 같이 따라감, lib/tutorGender.ts) 그 종류의 통화를 연다. */
function callTutor(targetLanguage: string, gender: TutorGender | undefined, kind: CallKind = "talk") {
  if (gender) writeTutorGender(targetLanguage, gender);
  sendAppIntent("startCall", kind === "lesson" ? { lesson: true } : kind === "talk" ? {} : { game: kind });
}

/**
 * 📞를 누르면 펼쳐지는 통화 종류(2026-11-08 사용자 "튜터 프로필에 자유대화, 수업, 게임으로 나눠줘. 통화 버튼은 클릭하면 그 탭 나열이 펼쳐지게"):
 * [자유대화 · 수업 · 게임] — 게임을 누르면 [퀴즈 · 스무고개 · 가르치기(상급)]. 고르면 그 통화가 바로 시작.
 */
function CallChoices({ ui, wide, onPick }: { ui: UICopy; wide?: boolean; onPick: (kind: CallKind) => void }) {
  const [games, setGames] = useState(false);
  const chip = wide
    ? "flex-1 rounded-xl border border-white/20 px-3 py-2 text-sm text-slate-100 hover:bg-white/10"
    : "rounded-full border border-white/20 px-3 py-1 text-meta text-slate-100 hover:bg-white/10";
  const on = wide ? " border-white/60 bg-white/15" : " border-white/60 bg-white/15";
  return (
    <div data-call-choices className="mt-2 flex flex-col gap-2">
      <div className="flex flex-wrap justify-end gap-2">
        <button type="button" data-call-choice="talk" onClick={() => onPick("talk")} className={chip}>
          {ui.callModeTalk}
        </button>
        <button type="button" data-call-choice="lesson" onClick={() => onPick("lesson")} className={chip}>
          {ui.callModeStudy}
        </button>
        <button type="button" data-call-choice="game" aria-expanded={games} onClick={() => setGames((open) => !open)} className={chip + (games ? on : "")}>
          {ui.callModeGame} {games ? "▾" : "›"}
        </button>
      </div>
      {games ? (
        <div className="flex flex-wrap justify-end gap-2">
          <button type="button" data-call-choice="quiz" onClick={() => onPick("quiz")} className={chip}>
            {ui.quizTag}
          </button>
          <button type="button" data-call-choice="twenty" onClick={() => onPick("twenty")} className={chip}>
            {ui.gameTwenty}
          </button>
          {/* 튜터가 내 말을 배우는 사람을 연기 — 상급(잠그지 않고 표시만, 2026-11-08). */}
          <button type="button" data-call-choice="teach" onClick={() => onPick("teach")} className={chip}>
            {ui.gameTeach} <span className="ms-1 rounded-full bg-warn/20 px-1.5 text-caption text-warn">{ui.mapLevelAdvanced}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
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
  const [choosing, setChoosing] = useState(false);
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
          <div className="mt-1.5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => chatWithTutor(targetLanguage, gender)}
              className="rounded-full border border-white/20 px-3 py-1 text-meta text-slate-100"
            >
              💬 {roomCopy(appLocale()).message}
            </button>
            {canCall ? (
              <button
                type="button"
                onClick={() => setChoosing((now) => !now)}
                aria-label={ui.talkAiCall}
                aria-expanded={choosing}
                title={ui.talkAiCall}
                className={`rounded-full border px-3 py-1 text-meta text-slate-100 ${choosing ? "border-white/60 bg-white/15" : "border-white/20"}`}
              >
                📞 {ui.homeTabCall}
              </button>
            ) : null}
          </div>
          {canCall && choosing ? (
            <CallChoices
              ui={ui}
              onPick={(kind) => {
                setChoosing(false);
                callTutor(targetLanguage, gender, kind);
              }}
            />
          ) : null}
        </div>
      </div>
      {open ? <AiTutorSheet ui={ui} targetLanguage={targetLanguage} canCall={canCall} gender={gender} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

/** AI 튜터 프로필 시트 — 사람 프로필과 같은 틀(ProfileFrame, 2026-11-02 사용자 "프로필 구조 통일"). */
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
  // 사람 프로필과 같은 버튼 이름(rooms/copy — 14개 언어 이미 있음).
  const t = roomCopy(appLocale());
  const following = useFollowedTutors(targetLanguage).includes(who);
  const [choosing, setChoosing] = useState(false);
  const go = (action: () => void) => () => {
    onClose();
    action();
  };
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
      {/* 사람 프로필처럼: 팔로우(대화 탭에 그 튜터 줄) · 💬 메시지(그 튜터와의 AI 대화) — 차단·신고는 기본 튜터라 없음. */}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          aria-pressed={following}
          onClick={() => setTutorFollow(targetLanguage, who, !following)}
          className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium ${following ? "border border-white/25 text-slate-100" : "bg-violet-500 text-white"}`}
        >
          {following ? `✓ ${t.following}` : `+ ${t.follow}`}
        </button>
      </div>
      <button type="button" onClick={go(() => chatWithTutor(targetLanguage, who))} className={PROFILE_WIDE_BUTTON}>
        💬 {t.message}
      </button>
      {canCall ? (
        <>
          <button type="button" aria-expanded={choosing} onClick={() => setChoosing((now) => !now)} className={PROFILE_WIDE_BUTTON}>
            📞 {ui.homeTabCall} {choosing ? "▾" : ""}
          </button>
          {choosing ? <CallChoices ui={ui} wide onPick={(kind) => go(() => callTutor(targetLanguage, gender, kind))()} /> : null}
          <button type="button" onClick={go(() => sendAppIntent("openCall", {}))} className={PROFILE_WIDE_BUTTON}>
            {ui.callRecordsTitle}
          </button>
        </>
      ) : null}
    </ProfileFrame>
  );
}
