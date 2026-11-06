"use client";

/**
 * 통화 화면 공용 조각 — AI 통화(roleplay/CallParts)와 사람 통화(rooms/RoomView 통화 모드)가 같이 쓴다
 * (사용자 2026-11-01 "AI 대화와 사용자 간 대화는 연동해서 같게").
 * 위 칸 = 상대(들), 가는 선, 아래 칸 = 나, 맨 아래 둥근 버튼 줄, 자막은 켰을 때만 한 줄.
 */
import { useEffect, useState, type ReactNode } from "react";

/** 통화를 연 뒤로 흐른 시간 m:ss — 1초마다. */
export function useCallClock(): string {
  const [startedAt] = useState(() => Date.now());
  const [now, setNow] = useState(startedAt);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return formatCallTime(Math.floor((now - startedAt) / 1000));
}

export function formatCallTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** 얼굴 둘레 — 말하는 중이면 숨 쉬듯(상대 = 파랑, 나 = 초록), 내 차례면 옅게. */
export function SpeakingRing({
  speaking,
  waiting = false,
  tone = "info",
  children,
}: {
  speaking: boolean;
  waiting?: boolean;
  tone?: "info" | "good";
  children: ReactNode;
}) {
  return (
    <div className="relative flex items-center justify-center">
      <span
        aria-hidden
        className={`absolute inset-[-12px] rounded-full border-2 transition-opacity ${
          speaking
            ? `animate-pulse opacity-100 ${tone === "good" ? "border-good/60" : "border-info/50"}`
            : waiting
              ? "border-white/15 opacity-100"
              : "opacity-0"
        }`}
      />
      {children}
    </div>
  );
}

/** 말하는 중 막대(얼굴 아래). */
export function TalkingBars({ on }: { on: boolean }) {
  return (
    <div className="flex h-6 items-end justify-center gap-1" aria-hidden>
      {on
        ? [0, 1, 2, 3, 4].map((bar) => (
            <span key={bar} className="w-1 animate-pulse rounded-full bg-good" style={{ height: `${8 + ((bar * 7) % 16)}px`, animationDelay: `${bar * 110}ms` }} />
          ))
        : null}
    </div>
  );
}

/** 자막 한 줄(상대가 마지막에 한 말). 여럿이면 앞에 이름. */
export function CallCaption({ text, meaning, name, onTap }: { text: string; meaning?: string; name?: string; /** 누르면 해석 켬/끔(AI 통화 — 다음 줄들도 그대로, 2026-11-06). */ onTap?: () => void }) {
  return (
    <div
      className={`w-full rounded-2xl bg-black/40 px-4 py-2 ${onTap ? "cursor-pointer hover:bg-black/50" : ""}`}
      data-call-caption
      {...(onTap ? { role: "button", tabIndex: 0, "aria-expanded": Boolean(meaning), onClick: onTap, onKeyDown: (event: React.KeyboardEvent) => (event.key === "Enter" || event.key === " ") && (event.preventDefault(), onTap()) } : {})}
    >
      <p dir="auto" className="text-chat leading-snug text-slate-100">
        {name ? <bdi className="me-1.5 text-meta text-slate-400">{name}</bdi> : null}
        {text}
      </p>
      {meaning ? <p className="mt-0.5 text-meta text-slate-400">{meaning}</p> : null}
    </div>
  );
}

/** 맨 아래 둥근 버튼 하나(아이콘 + 작은 이름). 끝내기는 빨강. */
export function CallButton({
  icon,
  label,
  onClick,
  disabled,
  pressed,
  tone = "plain",
  callout = false,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  pressed?: boolean;
  tone?: "plain" | "end" | "warn";
  /** 지금 누를 차례라 눈에 띄게(글 없이 — 끝내기: 튜터가 작별 인사를 했을 때, 2026-11-06). */
  callout?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
      aria-label={label}
      title={label}
      className="flex min-w-0 max-w-[4.5rem] flex-1 flex-col items-center gap-1.5 disabled:opacity-40"
    >
      <span
        aria-hidden
        className={`flex h-14 w-14 items-center justify-center rounded-full text-title transition ${callout ? "scale-110 ring-4 ring-bad/40 motion-safe:animate-pulse " : ""}${
          tone === "end"
            ? "bg-bad text-white"
            : tone === "warn"
              ? "bg-bad/30 text-white"
              : pressed
                ? "bg-white text-slate-900"
                : "bg-white/10 text-slate-100 hover:bg-white/20"
        }`}
      >
        {icon}
      </span>
      <span className="text-center text-caption leading-tight text-slate-300">{label}</span>
    </button>
  );
}

/** 버튼 줄 틀(맨 아래). */
export function CallButtonRow({ children }: { children: ReactNode }) {
  return (
    <footer className="shrink-0 px-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-3" data-call-controls>
      <div className="mx-auto flex max-w-md items-start justify-between">{children}</div>
    </footer>
  );
}

/** 말풍선 옆 얼굴 자리 — AI 대화·1:1·단체방·통화 대본이 같은 크기·같은 자리(아래 맞춤). */
export const CHAT_FACE_SIZE = 28;
export function ChatFaceSlot({ children }: { children: ReactNode }) {
  return <span className="mb-0.5 shrink-0">{children}</span>;
}

/** 이 기기에 남는 켬/끔(통화 자막·끝난 대본 번역). 저장이 안 되면 이번 통화에만 바뀐다. */
/**
 * 이 기기에 기억하는 켬/끔. 한 번도 안 눌렀으면 `fallback`(그때그때 다를 수 있음 — 글자를 아직 모르는 학습자면 자막·해석 켬, 2026-11-06).
 */
export function useStoredToggle(key: string, fallback = false): [boolean, () => void] {
  const [raw, setRaw] = useState<string | null>(() => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  });
  const on = raw === null ? fallback : raw === "1";
  const toggle = () => {
    const next = on ? "0" : "1";
    try {
      localStorage.setItem(key, next);
    } catch {
      // Not kept, still switched for this conversation.
    }
    setRaw(next);
  };
  return [on, toggle];
}

/** AI 통화 튜터 수업 켬/끔(🎓, 2026-11-02) — 이 기기에 기억, 그냥 대화에서만. */
export const CALL_COACH_KEY = "callCoach.v1";

/** 통화 자막 켬/끔 — AI 통화와 사람 통화가 같은 값(한쪽에서 켜면 다른 쪽도, 2026-11-01). */
export const CALL_CAPTIONS_KEY = "roleplayCaptions";

/** AI 통화 자막의 해석 켬/끔 — 자막 줄을 누르면 바뀌고 다음 통화도 그대로(2026-11-06 사용자 "자막 해석도 켜고 끌 수 있게", 예전엔 누른 그 줄만). */
export const CALL_MEANING_KEY = "callMeaning.v1";
