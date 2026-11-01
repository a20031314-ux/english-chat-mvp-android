"use client";

/**
 * AI 통화 화면(RoleplayScreen)의 그리기 조각 — 머리·내 쪽 "…"·바닥(2026-11-01 통화 구조 정리, 모양 그대로 옮김).
 */
import type { UICopy } from "@/lib/copy";
import type { Instruction } from "@/lib/roleplay/session";

/** 학습자 쪽 "…" 말풍선 — 말하는 중·받아쓰는 중, 또는 튜터가 아직 판단하지 않은 내 줄. */
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

export function CallHeader({
  ui,
  title,
  subtitle,
  over,
  showMyLines,
  onToggleMyLines,
  showTranslations,
  onToggleTranslations,
  onClose,
}: {
  ui: UICopy;
  title: string;
  subtitle: string;
  over: boolean;
  showMyLines: boolean;
  onToggleMyLines: () => void;
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
      {/* A conversation that is still going is put down, not shut. It is
          written down as it happens, so leaving here loses nothing and the
          door offers to carry on with it. Once it has ended there is nothing
          to come back to and the button says so. */}
      <div className="flex items-center gap-2">
        {over ? null : (
          <button
            type="button"
            onClick={onToggleMyLines}
            aria-pressed={showMyLines}
            className={`rounded-lg border px-3 py-1.5 text-caption transition ${
              showMyLines ? "border-white/40 bg-white/15 text-slate-100" : "border-white/15 text-slate-400 hover:bg-white/10"
            }`}
          >
            {ui.roleplayMyLines}
          </button>
        )}
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
          {over ? ui.billingClose : ui.roleplayPause}
        </button>
      </div>
    </header>
  );
}

export function CallFooter({
  ui,
  instruction,
  showHelp,
  onHelp,
  outOfPoints,
  onClose,
}: {
  ui: UICopy;
  instruction: Instruction | null;
  /** 💡 힌트: 말이 없거나 말하다 끊겼을 때만. 누르면 대화가 멈추고 힌트 패널 → 같은 턴으로 돌아온다. */
  showHelp: boolean;
  onHelp: () => void;
  outOfPoints: false | "points" | "daily";
  onClose: () => void;
}) {
  return (
    <footer className="shrink-0 border-t border-white/10 p-3 pb-[env(safe-area-inset-bottom)]">
      {instruction?.do === "listen" ? (
        <div className="flex flex-col gap-2">
          {/* 열린 대화의 목표 안내 글은 뺐다(화면 속 설명 금지, 2026-10-23). 대본 장면의 할 일만. */}
          {instruction.goal ? <p className="text-[13px] text-neutral-300">{instruction.goal}</p> : null}
          {instruction.hint ? <p className="text-[12px] text-neutral-500">{instruction.hint}</p> : null}
          {showHelp ? (
            <button
              type="button"
              onClick={onHelp}
              className="self-center rounded-full border border-line px-4 py-1.5 text-meta text-title hover:bg-white/10"
            >
              💡 {ui.missionHint}
            </button>
          ) : null}
        </div>
      ) : null}

      {instruction?.do === "finish" && outOfPoints ? (
        <p className="mb-2 text-[13px] leading-relaxed text-neutral-300">
          {outOfPoints === "daily" ? ui.roleplayOutOfToday : ui.roleplayOutOfPoints}
        </p>
      ) : null}

      {instruction?.do === "finish" ? (
        <button type="button" onClick={onClose} className="w-full rounded-xl bg-white/15 px-4 py-3 text-sm text-neutral-100">
          {ui.billingClose}
        </button>
      ) : null}
    </footer>
  );
}
