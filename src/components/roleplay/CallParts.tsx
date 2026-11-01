"use client";

/**
 * AI 통화 화면(RoleplayScreen)의 그리기 조각.
 * 2026-11-01 사용자 "ui를 실제 통화처럼, 튜터 말도 기본은 가리고 선택적으로 보거나 끝나고 한눈에":
 * 통화 중 = 튜터 얼굴·이름·통화 시간·누가 말하는지 + 자막 한 줄(켰을 때만) + 아래 버튼 넷.
 * 끝나면 = 머리(제목·번역·닫기) + 전체 대본 + 통화 정리 + 바닥(닫기).
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AiAvatar } from "@/components/AiTutorProfile";
import { MyAvatarFace } from "@/components/account/AccountCard";
import { CallButton, CallButtonRow, CallCaption, CHAT_FACE_SIZE, formatCallTime, SpeakingRing, TalkingBars, useCallClock } from "@/components/speech/CallKit";
import { chatPartnerForLanguage, type TutorGender } from "@/lib/chatPartner";
import { useTutorGender } from "@/lib/tutorGender";
import type { UICopy } from "@/lib/copy";
import type { Instruction } from "@/lib/roleplay/session";

/** 학습자 쪽 "…" 말풍선 — 끝난 대본에서 아직 판단 전이던 내 줄. */
export function LearnerComposing() {
  return (
    <li className="mb-2 flex justify-end" aria-hidden>
      <div className="rounded-2xl bg-white/[0.07] px-3 py-2 text-chat text-slate-400">
        <span className="composing-dots inline-flex gap-1">
          <span>•</span>
          <span>•</span>
          <span>•</span>
        </span>
      </div>
    </li>
  );
}

export type CallSpeaker = "tutor" | "learner" | "thinking" | "listening" | null;

/**
 * 통화 중 화면 — 영상 통화처럼 위는 AI 튜터, 아래는 나(사용자 2026-11-01 "위는 ai튜터, 아래는 사용자 화면 구조로").
 * 맨 위 한 줄: 통화 시간 · 오늘 남은 시간.
 * 위 칸: 튜터 얼굴(말할 때 둘레)·이름·국기·생각 중 점 셋·자막 한 줄(자막을 켰거나 두 번 못 알아들었을 때만).
 * 아래 칸: 내 얼굴(내가 말할 때 둘레·막대, 내 차례면 옅은 둘레)·대본 장면이면 지금 할 일. 내 말 글은 통화 중에 없다.
 */
export function CallStage({
  language,
  speaker,
  timeLeft,
  caption,
  goal,
  gender,
}: {
  language: string;
  /** 이 통화의 튜터(통화를 열 때 고정). 없으면 지금 고른 튜터. */
  gender?: TutorGender;
  speaker: CallSpeaker;
  /** 오늘 남은 통화 시간 한 줄(서버가 답을 못 하면 null). */
  timeLeft: string | null;
  caption: { text: string; meaning?: string } | null;
  /** 대본 장면이면 지금 할 일(열린 대화에는 없음). */
  goal?: string;
}) {
  const chosen = useTutorGender(language);
  const partner = chatPartnerForLanguage(language, gender ?? chosen);
  const clock = useCallClock();
  return (
    <div className="flex min-h-0 flex-1 flex-col" data-call-stage>
      <p className="shrink-0 px-4 pt-3 text-center text-meta tabular-nums text-slate-400">
        {clock}
        {timeLeft ? <span className="text-slate-500"> · {timeLeft}</span> : null}
      </p>

      {/* 위: AI 튜터 */}
      <section className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-6 text-center" data-call-tutor>
        <SpeakingRing speaking={speaker === "tutor"}>
          <AiAvatar size={96} language={language} gender={partner.gender} />
        </SpeakingRing>
        <p className="flex items-center gap-2 text-title font-semibold text-ink">
          <bdi>{partner.givenName}</bdi>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/flags/${partner.flagCountry}.png`} alt="" className="h-4 w-6 object-cover" />
        </p>
        <div className="flex min-h-[4.5rem] w-full max-w-md flex-col items-center justify-start" aria-live="polite">
          {speaker === "thinking" ? (
            <span aria-hidden className="composing-dots inline-flex gap-1 text-slate-400">
              <span>•</span>
              <span>•</span>
              <span>•</span>
            </span>
          ) : caption ? (
            <CallCaption text={caption.text} meaning={caption.meaning} />
          ) : null}
        </div>
      </section>

      <div aria-hidden className="mx-6 shrink-0 border-t border-white/10" />

      {/* 아래: 나 */}
      <section className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-6 text-center" data-call-me>
        <SpeakingRing speaking={speaker === "learner"} waiting={speaker === "listening"} tone="good">
          <MyAvatarFace size={96} />
        </SpeakingRing>
        {speaker === "listening" ? (
          <div className="flex h-6 items-end justify-center" aria-hidden>
            <span className="text-title opacity-60">🎙</span>
          </div>
        ) : (
          <TalkingBars on={speaker === "learner"} />
        )}
        {goal ? <p className="max-w-md text-meta text-slate-400">{goal}</p> : null}
      </section>
    </div>
  );
}

/**
 * 통화 중 아래 버튼 넷: 🙉 못 알아들었어요 · 💬 자막 · 💡 힌트 · 끝내기(빨강).
 * 끝내기는 통화를 내려놓는 것 — 기록에 남아 통화 기록에서 이어서 할 수 있다(예전 "중단").
 */
export function CallControls({
  ui,
  canAnswer,
  captions,
  onMissed,
  onToggleCaptions,
  onHint,
  onEnd,
}: {
  ui: UICopy;
  /** 내 차례라 못 알아들었어요·힌트를 누를 수 있다. */
  canAnswer: boolean;
  captions: boolean;
  onMissed: () => void;
  onToggleCaptions: () => void;
  onHint: () => void;
  onEnd: () => void;
}) {
  return (
    <CallButtonRow>
      <CallButton icon="🙉" label={ui.roleplayMissed} onClick={onMissed} disabled={!canAnswer} />
      <CallButton icon="💬" label={ui.roleplayCaptions} onClick={onToggleCaptions} pressed={captions} />
      <CallButton icon="💡" label={ui.missionHint} onClick={onHint} disabled={!canAnswer} />
      <CallButton icon="📞" label={ui.roleplayPause} onClick={onEnd} tone="end" />
    </CallButtonRow>
  );
}

/** 끝난 뒤 머리: 제목 · 번역 켬/끔 · 닫기. */
export function CallHeader({
  ui,
  title,
  subtitle,
  showTranslations,
  onToggleTranslations,
  onClose,
}: {
  ui: UICopy;
  title: string;
  subtitle: string;
  showTranslations: boolean;
  onToggleTranslations: () => void;
  onClose: () => void;
}) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
      <div>
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        <p className="text-[11px] text-neutral-500">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleTranslations}
          aria-pressed={showTranslations}
          className={`rounded-lg border px-3 py-1.5 text-[12px] transition ${
            showTranslations ? "border-white/40 bg-white/15 text-neutral-100" : "border-white/15 text-neutral-400 hover:bg-white/10"
          }`}
        >
          {ui.roleplayTranslations}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-white/15 px-3 py-1.5 text-[12px] text-neutral-300 hover:bg-white/10"
        >
          {ui.billingClose}
        </button>
      </div>
    </header>
  );
}

/** 끝난 뒤 바닥: 시간이 떨어졌으면 한 줄 + 닫기. */
export function CallFooter({
  ui,
  instruction,
  outOfPoints,
  onClose,
}: {
  ui: UICopy;
  instruction: Instruction | null;
  outOfPoints: false | "points" | "daily";
  onClose: () => void;
}) {
  return (
    <footer className="shrink-0 border-t border-white/10 p-3 pb-[env(safe-area-inset-bottom)]">
      {instruction?.do === "finish" && outOfPoints ? (
        <p className="mb-2 text-[13px] leading-relaxed text-neutral-300">
          {outOfPoints === "daily" ? ui.roleplayOutOfToday : ui.roleplayOutOfPoints}
        </p>
      ) : null}
      <button type="button" onClick={onClose} className="w-full rounded-xl bg-white/15 px-4 py-3 text-sm text-neutral-100">
        {ui.billingClose}
      </button>
    </footer>
  );
}

/**
 * 끝난 화면 맨 위 통화 요약 한 줄(사용자 2026-11-01 "통화 요약 한 줄"): 튜터 얼굴·이름 · ⏱ 통화 시간 · ✎ 고친 말 · 💡 힌트 · 🙉 못 알아들은 말.
 * 0인 칸은 뺀다. 이름은 아이콘의 title·aria-label로(화면 속 설명 글 없음).
 */
export function CallSummary({
  ui,
  language,
  seconds,
  tally,
  gender,
}: {
  ui: UICopy;
  language: string;
  gender?: TutorGender;
  seconds: number;
  tally: { fixed: number; hints: number; missed: number };
}) {
  const chosen = useTutorGender(language);
  const partner = chatPartnerForLanguage(language, gender ?? chosen);
  const time = formatCallTime(seconds);
  const chips = [
    { icon: "✎", n: tally.fixed, label: ui.roleplayBetter },
    { icon: "💡", n: tally.hints, label: ui.missionHint },
    { icon: "🙉", n: tally.missed, label: ui.roleplayMissed },
  ].filter((chip) => chip.n > 0);
  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-white/10 px-4 py-3" data-call-summary>
      <AiAvatar size={40} language={language} gender={partner.gender} />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-body font-semibold text-ink">
          <bdi className="truncate">{partner.givenName}</bdi>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/flags/${partner.flagCountry}.png`} alt="" className="h-3.5 w-5 shrink-0 object-cover" />
        </p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-meta tabular-nums text-slate-300">
          <span>⏱ {time}</span>
          {chips.map((chip) => (
            <span key={chip.icon} title={chip.label} aria-label={`${chip.label} ${chip.n}`}>
              {chip.icon} {chip.n}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

/** 대본 줄 옆 얼굴 — 튜터·나(채팅과 같은 크기). */
export function TutorFace() {
  return <AiAvatar size={CHAT_FACE_SIZE} />;
}
export function MeFace() {
  return <MyAvatarFace size={CHAT_FACE_SIZE} />;
}

/**
 * 끝난 통화의 대본·통화 정리를 화면 높이만큼 끊어 옆으로 넘겨 보기(사용자 2026-11-01 "결과를 화면 기준으로 끊어서 넘겨 가면서, 너무 길어질 때를 대비").
 * 줄을 세로로 길게 늘어놓지 않고 CSS 단(column) 한 칸 = 화면 한 장으로 흘린다 — 줄을 눌러 도구가 펼쳐져 길이가 바뀌어도 브라우저가 다시 나눈다.
 * 줄 하나는 장 사이에서 잘리지 않는다(break-inside: avoid, 한 장보다 긴 줄만 잘림). 손가락으로 옆으로 밀면 넘어가고, 놓으면 가까운 장에 맞춘다.
 * 장이 둘 이상이면 아래에 ‹ n / m ›(처음 장 = 대본 처음부터). ‹ › 는 오른쪽에서 왼쪽 화면에서 글자가 저절로 뒤집힌다(bidi mirroring) — 돌리지 않는다.
 */
export function CallPages({ ui, children }: { ui: UICopy; children: ReactNode }) {
  const ref = useRef<HTMLOListElement>(null);
  const [width, setWidth] = useState(0);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const settle = useRef<number | null>(null);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const w = el.clientWidth;
    setWidth(w);
    if (w > 0) {
      setPages(Math.max(1, Math.round(el.scrollWidth / w)));
      setPage(Math.min(Math.round(Math.abs(el.scrollLeft) / w), Math.max(0, Math.round(el.scrollWidth / w) - 1)));
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(el);
    // 줄이 펼쳐지거나 번역·통화 정리가 늦게 와도 장 수를 다시 센다.
    const mutate = new MutationObserver(() => window.requestAnimationFrame(measure));
    mutate.observe(el, { childList: true, subtree: true, characterData: true, attributes: true });
    return () => {
      resize.disconnect();
      mutate.disconnect();
    };
  }, [measure]);

  // 아랍어 등 오른쪽에서 왼쪽 화면은 scrollLeft가 0에서 음수로 간다.
  const rtl = () => (ref.current ? getComputedStyle(ref.current).direction === "rtl" : false);
  const go = (to: number) => {
    const el = ref.current;
    if (!el || !width) return;
    const next = Math.max(0, Math.min(pages - 1, to));
    el.scrollTo({ left: (rtl() ? -1 : 1) * next * width, behavior: "smooth" });
    setPage(next);
  };
  const onScroll = () => {
    const el = ref.current;
    if (!el || !width) return;
    setPage(Math.round(Math.abs(el.scrollLeft) / width));
    if (settle.current) window.clearTimeout(settle.current);
    // 밀다가 놓으면 가까운 장에 맞춘다(단은 scroll-snap 대상이 아니라서).
    settle.current = window.setTimeout(() => {
      const at = Math.round(Math.abs(el.scrollLeft) / width);
      const target = (rtl() ? -1 : 1) * at * width;
      if (Math.abs(el.scrollLeft - target) > 2) el.scrollTo({ left: target, behavior: "smooth" });
    }, 120);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col" data-call-pages>
      <div className="min-h-0 flex-1 px-3 pt-3">
        <ol
          ref={ref}
          onScroll={onScroll}
          className="h-full overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>*]:break-inside-avoid"
          style={{ columnWidth: width ? `${width}px` : undefined, columnGap: 0, columnFill: "auto" }}
        >
          {children}
        </ol>
      </div>
      {pages > 1 ? (
        <nav className="flex shrink-0 items-center justify-center gap-4 py-1.5 text-meta tabular-nums text-slate-400" aria-label={`${page + 1} / ${pages}`}>
          <button
            type="button"
            onClick={() => go(page - 1)}
            disabled={page === 0}
            aria-label={ui.studyChapterPrev}
            title={ui.studyChapterPrev}
            className="rounded-full px-3 py-1 text-title text-slate-200 disabled:opacity-30"
          >
            ‹
          </button>
          <span data-call-page>
            {page + 1} / {pages}
          </span>
          <button
            type="button"
            onClick={() => go(page + 1)}
            disabled={page >= pages - 1}
            aria-label={ui.studyChapterNext}
            title={ui.studyChapterNext}
            className="rounded-full px-3 py-1 text-title text-slate-200 disabled:opacity-30"
          >
            ›
          </button>
        </nav>
      ) : null}
    </div>
  );
}
