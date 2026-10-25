"use client";

import { useEffect, useState, type ReactNode } from "react";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import { sendAppIntent } from "@/lib/appIntents";
import { BodyLayer } from "@/components/FullScreenLayer";
import type { UICopy } from "@/lib/copy";
import type { ElementId, ElementView, GrowthView } from "@/lib/learner/growth";
import { GAP_STEP } from "@/lib/learner/next";
import { learningLanguageTextDir } from "@/lib/learningLanguages";
import { onLocate } from "@/lib/notes/locateHandoff";

/**
 * The My tab's picture of a learner's language: six elements around "me",
 * each as big as it has grown (learner/growth.ts). Leaves are the phrases that
 * grew it; one small element carries "grow this next". Tapping an element
 * opens what grew it, the last two weeks, and a way to grow it now.
 * (hub/drafts/my-growth-network.md)
 */

const W = 360;
const H = 300;
const CX = W / 2;
const CY = 140;
/** Where each element sits, clockwise from the top left. */
const PLACE: Record<ElementId, { x: number; y: number }> = {
  words: { x: CX - 95, y: CY - 78 },
  listening: { x: CX + 95, y: CY - 78 },
  natural: { x: CX + 128, y: CY + 22 },
  pronunciation: { x: CX + 62, y: CY + 108 },
  speaking: { x: CX - 62, y: CY + 108 },
  accuracy: { x: CX - 128, y: CY + 22 },
};

function radius(stage: number): number {
  return 13 + (Math.max(1, Math.min(6, stage)) - 1) * 5.5;
}

export function elementNames(ui: UICopy): Record<ElementId, string> {
  return {
    speaking: ui.myElSpeaking,
    accuracy: ui.myElAccuracy,
    words: ui.myElWords,
    listening: ui.myElListening,
    pronunciation: ui.myElPronunciation,
    natural: ui.myElNatural,
  };
}

function facts(ui: UICopy): Record<ElementId, string> {
  return {
    speaking: ui.myFactSpeaking,
    accuracy: ui.myFactAccuracy,
    words: ui.myFactWords,
    listening: ui.myFactListening,
    pronunciation: ui.myFactPronunciation,
    natural: ui.myFactNatural,
  };
}

function hows(ui: UICopy): Record<ElementId, string> {
  return {
    speaking: ui.myHowSpeaking,
    accuracy: ui.myHowAccuracy,
    words: ui.myHowWords,
    listening: ui.myHowListening,
    pronunciation: ui.myHowPronunciation.replace("{button}", ui.roleplaySayAgain),
    natural: ui.myHowNatural,
  };
}

function factLine(element: ElementView, ui: UICopy): string {
  if (!element.measured) return ui.myNoData;
  if (element.resting) return ui.myResting;
  if (element.points === 0) return "";
  return facts(ui)[element.id].replace("{n}", String(element.points));
}

/** The words a practice conversation for an element opens with, as "try this" calls it. */
function growTitle(id: ElementId, ui: UICopy): string {
  return {
    speaking: ui.nextGapSpeaking,
    accuracy: ui.nextGapAccuracy,
    words: ui.nextGapWords,
    listening: ui.nextGapListening,
    pronunciation: ui.nextGapPronunciation,
    natural: ui.nextGapNatural,
  }[id];
}

/** How the learner chose to look at their record; remembered on this device. */
export type MyViewMode = "net" | "graph" | "map";
const VIEW_KEY = "myViewMode";

/** "단계" 보기를 한 번 보여 줬는지(2026-10-25 사용자: 2.74를 깔았는데 My가 예전과 같다 — 전에 고른 "그래프"가 남아 단계가 안 보였음). */
const STAGE_SHOWN_KEY = "myViewMode.stageShown";

function readViewMode(): MyViewMode {
  try {
    // 처음 한 번은 전에 고른 보기와 상관없이 "단계"로 연다. 그 뒤로는 고른 것을 그대로.
    if (!localStorage.getItem(STAGE_SHOWN_KEY)) {
      localStorage.setItem(STAGE_SHOWN_KEY, "1");
      localStorage.setItem(VIEW_KEY, "map");
      return "map";
    }
    const saved = localStorage.getItem(VIEW_KEY);
    // 2026-10-24: "단계"(예전 지도 + 노트 틀)가 처음 보기. 고른 적 있으면 그대로.
    return saved === "graph" || saved === "net" ? saved : "map";
  } catch {
    return "map";
  }
}

export function GrowthNetwork({
  ui,
  locale,
  targetLanguage,
  isPremium,
  refreshKey,
  mapSlot,
  board,
}: {
  ui: UICopy;
  /** The interface language, which answers to questions are written in. */
  locale: string;
  targetLanguage: string;
  isPremium: boolean;
  refreshKey?: string | null;
  /** The goal's topics, shown when the learner looks at their record as a map; none before a map is drawn. */
  mapSlot?: ReactNode;
  /**
   * 수준별 틀(노트 뼈대, 2026-10-24 사용자 "망·그래프 구조를 노트에 통합"): "단계" 보기에서는 단계 사다리·칸 전체를,
   * 망·그래프에서는 오늘의 학습 버튼만(인자 false) 그린다. mapSlot(목표 주제)은 틀 아래.
   */
  board?: (inBoard: boolean) => ReactNode;
}) {
  const [view, setView] = useState<GrowthView | null>(null);
  const [mode, setModeState] = useState<MyViewMode>(readViewMode);
  const setMode = (next: MyViewMode) => {
    setModeState(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      // Back to the web next time; nothing lost.
    }
  };
  const [open, setOpen] = useState<ElementId | null>(null);
  const [goalMapOpen, setGoalMapOpen] = useState(false);
  // 문장분석 시트 "My에서 찾기"로 오면 "단계" 보기로(이미 열려 있을 때 — 처음 열 때는 handOffLocate가 기억한 보기).
  useEffect(() => onLocate(() => setModeState("map")), []);

  useEffect(() => {
    let cancelled = false;
    const tz = -new Date().getTimezoneOffset();
    void fetch(apiUrl(`/api/learner/growth?lang=${encodeURIComponent(targetLanguage)}&tz=${tz}`), {
      headers: entitlementHeaders(isPremium),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: GrowthView | null) => {
        if (!cancelled && data && Array.isArray(data.elements)) setView(data);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [targetLanguage, isPremium, refreshKey]);

  if (!view) return null;
  const names = elementNames(ui);
  const total = view.elements.reduce((sum, e) => sum + e.points, 0);
  const opened = open ? view.elements.find((e) => e.id === open) ?? null : null;

  return (
    <section aria-label={ui.myNetworkTitle} className="mt-3 rounded-2xl border border-white/10 px-3 pb-3 pt-3">
      <div className="flex items-center justify-between gap-2 px-1">
        <p className="text-[11px] font-semibold tracking-wide text-slate-400">{ui.myNetworkTitle}</p>
        <div role="group" aria-label={ui.myViewLabel} className="flex shrink-0 rounded-full border border-white/10 p-0.5">
          {(
            [
              ["net", ui.myViewNet],
              ["graph", ui.myViewGraph],
              ["map", ui.myViewMap],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={mode === id}
              onClick={() => setMode(id)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                mode === id ? "bg-white/90 text-slate-900" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {mode !== "map" && total === 0 ? <p className="mt-1 px-1 text-[11px] text-slate-500">{ui.myStart}</p> : null}
      {mode !== "map" && board ? <div className="px-1">{board(false)}</div> : null}
      {mode === "graph" ? (
        <GrowthGraph ui={ui} view={view} onOpen={setOpen} />
      ) : mode === "map" ? (
        <div className="mt-2">
          {board ? <div className="px-1">{board(true)}</div> : null}
          {/* 예전 목표 지도(상황·미션)는 틀과 섞이지 않게 접어 둔다(2026-10-25 사용자: 예전 구조와 섞이면 난잡하다). */}
          {mapSlot ? (
            board ? (
              <>
                <button
                  type="button"
                  aria-expanded={goalMapOpen}
                  onClick={() => setGoalMapOpen((value) => !value)}
                  className="mt-1 flex w-full items-center justify-between border-t border-white/5 px-1 py-2.5 text-start text-note text-slate-200"
                >
                  <span>{ui.partGoalMap}</span>
                  <span aria-hidden className={`text-caption text-slate-500 ${goalMapOpen ? "rotate-90" : "rtl:rotate-180"}`}>›</span>
                </button>
                {goalMapOpen ? <div className="mt-2">{mapSlot}</div> : null}
              </>
            ) : (
              mapSlot
            )
          ) : board ? null : (
            <p className="px-1 py-6 text-center text-[12px] text-slate-400">{ui.myViewMapEmpty}</p>
          )}
        </div>
      ) : (
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-1 w-full" role="group" aria-label={ui.myNetworkTitle}>
        {view.elements.map((e) => (
          <line
            key={`l-${e.id}`}
            x1={CX}
            y1={CY}
            x2={PLACE[e.id].x}
            y2={PLACE[e.id].y}
            className="stroke-white/15"
            strokeWidth={1}
          />
        ))}
        <circle cx={CX} cy={CY} r={15} className="fill-white/10 stroke-white/25" />
        <text x={CX} y={CY + 4} textAnchor="middle" className="fill-slate-200 text-[11px]">
          {ui.myCenter}
        </text>
        {view.elements.map((e) => {
          const { x, y } = PLACE[e.id];
          const r = radius(e.stage);
          const isNext = view.next === e.id;
          const leaves = e.leaves.slice(0, 5);
          const out = Math.atan2(y - CY, x - CX);
          const fact = factLine(e, ui);
          return (
            <g
              key={e.id}
              role="button"
              tabIndex={0}
              aria-label={`${names[e.id]}${fact ? ` · ${fact}` : ""}${isNext ? ` · ${ui.myNext}` : ""}`}
              onClick={() => setOpen(e.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setOpen(e.id);
                }
              }}
              className={`cursor-pointer outline-none ${e.resting ? "opacity-45" : ""}`}
            >
              {leaves.map((_, i) => {
                const angle = out + (i - (leaves.length - 1) / 2) * 0.42;
                const lx = x + Math.cos(angle) * (r + 12);
                const ly = y + Math.sin(angle) * (r + 12);
                return (
                  <g key={i}>
                    <line x1={x} y1={y} x2={lx} y2={ly} className="stroke-emerald-300/30" strokeWidth={1} />
                    <circle cx={lx} cy={ly} r={3.5} className="fill-emerald-300/70" />
                  </g>
                );
              })}
              {isNext ? (
                <circle cx={x} cy={y} r={r + 6} fill="none" className="stroke-rose-300" strokeWidth={1.5} strokeDasharray="3 3" />
              ) : null}
              <circle
                cx={x}
                cy={y}
                r={r}
                className={e.measured ? "fill-emerald-400/25 stroke-emerald-300/70" : "fill-transparent stroke-slate-500"}
                strokeWidth={1.2}
                strokeDasharray={e.measured ? undefined : "3 3"}
              />
              <circle cx={x} cy={y} r={Math.max(r, 22)} fill="transparent" />
              <text x={x} y={y + r + 13} textAnchor="middle" className="fill-slate-100 text-[11px] font-medium">
                {names[e.id]}
              </text>
              {isNext ? (
                <text x={x} y={y + r + 26} textAnchor="middle" className="fill-rose-300 text-[10.5px]">
                  {ui.myNext}
                </text>
              ) : fact ? (
                <text x={x} y={y + r + 26} textAnchor="middle" className="fill-slate-400 text-[10.5px]">
                  {fact}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      )}
      <AskBox ui={ui} locale={locale} targetLanguage={targetLanguage} isPremium={isPremium} />
      {opened ? (
        <ElementSheet
          ui={ui}
          element={opened}
          isNext={view.next === opened.id}
          targetLanguage={targetLanguage}
          onClose={() => setOpen(null)}
          onStages={
            board
              ? () => {
                  // 표현 폭은 노트의 어휘·표현(단어장), 나머지는 단계 틀(문법·글자·소리 칸에 짚인 장면).
                  if (opened.id === "words") sendAppIntent("openNotes", { section: "words" });
                  else setMode("map");
                  setOpen(null);
                }
              : undefined
          }
        />
      ) : null}
    </section>
  );
}

/**
 * The same record as rows: each element's last fourteen days as bars, all on
 * one scale so a busy element and a quiet one can be told apart at a glance.
 */
function GrowthGraph({ ui, view, onOpen }: { ui: UICopy; view: GrowthView; onOpen: (id: ElementId) => void }) {
  const names = elementNames(ui);
  const top = Math.max(1, ...view.elements.flatMap((e) => e.daily));
  return (
    <div className="mt-2 space-y-1">
      {view.elements.map((e) => {
        const isNext = view.next === e.id;
        const fact = factLine(e, ui);
        return (
          <button
            key={e.id}
            type="button"
            onClick={() => onOpen(e.id)}
            aria-label={`${names[e.id]}${fact ? ` · ${fact}` : ""}${isNext ? ` · ${ui.myNext}` : ""}`}
            className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-start hover:bg-white/[0.04] ${
              isNext ? "ring-1 ring-rose-300/50" : ""
            } ${e.resting ? "opacity-45" : ""}`}
          >
            <span className="w-24 shrink-0">
              <span className="block truncate text-[12.5px] font-medium text-slate-100">{names[e.id]}</span>
              <span className={`block truncate text-[10.5px] ${isNext ? "text-rose-300" : "text-slate-400"}`}>
                {isNext ? ui.myNext : fact || (e.measured ? "" : ui.myNoData)}
              </span>
            </span>
            <span aria-hidden className="flex h-8 min-w-0 flex-1 items-end gap-[3px]">
              {e.daily.map((n, i) => (
                <span
                  key={i}
                  className={`flex-1 rounded-sm ${n > 0 ? "bg-emerald-400/80" : "bg-white/[0.06]"}`}
                  style={{ height: n > 0 ? `${Math.max(18, (n / top) * 100)}%` : "18%" }}
                />
              ))}
            </span>
            <span className="w-10 shrink-0 text-end text-[11px] text-emerald-300">{e.week > 0 ? `+${e.week}` : ""}</span>
          </button>
        );
      })}
      <p className="flex justify-between px-2 pt-1 text-[10px] text-slate-500">
        <span>{ui.myDaily}</span>
      </p>
    </div>
  );
}

/** Start the conversation that grows an element, as "try this" would. */
function growElement(id: ElementId, ui: UICopy) {
  const step = GAP_STEP[id];
  sendAppIntent("practice", { tab: step.tab, goal: { situation: step.situation }, title: growTitle(id, ui) });
}

/**
 * Asking about one's own progress, answered from the same data the network is
 * drawn from (learner/ask.ts). One question is one chat message; the answer may
 * name an element to grow, which becomes a button.
 */
function AskBox({
  ui,
  locale,
  targetLanguage,
  isPremium,
}: {
  ui: UICopy;
  locale: string;
  targetLanguage: string;
  isPremium: boolean;
}) {
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [reply, setReply] = useState<{ answer: string; grow: ElementId | null } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ask = async (text: string) => {
    const q = text.replace(/\s+/g, " ").trim();
    if (q.length < 2 || busy) return;
    setBusy(true);
    setError(null);
    setReply(null);
    try {
      const response = await fetch(apiUrl("/api/learner/ask"), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
        body: JSON.stringify({ language: targetLanguage, interfaceLanguage: locale, question: q, names: elementNames(ui) }),
      });
      if (response.status === 403) {
        setError(ui.myAskLimit);
        return;
      }
      const data = (await response.json().catch(() => null)) as {
        answer?: string;
        grow?: ElementId | null;
        thin?: boolean;
      } | null;
      if (response.ok && data?.thin) {
        setReply({ answer: ui.myAskThin, grow: data.grow ?? null });
        setQuestion("");
        return;
      }
      if (!response.ok || !data?.answer) {
        setError(ui.myAskFailed);
        return;
      }
      setReply({ answer: data.answer, grow: data.grow ?? null });
      setQuestion("");
    } catch {
      setError(ui.myAskFailed);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-2 px-1">
      <div className="flex flex-wrap gap-1.5">
        {[ui.myAskQuick1, ui.myAskQuick2].map((quick) => (
          <button
            key={quick}
            type="button"
            disabled={busy}
            onClick={() => void ask(quick)}
            className="rounded-full border border-white/15 px-2.5 py-1 text-[12px] text-slate-300 hover:bg-white/10 disabled:opacity-50"
          >
            {quick}
          </button>
        ))}
      </div>
      <form
        className="mt-2 flex items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void ask(question);
        }}
      >
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value.slice(0, 300))}
          placeholder={ui.myAskPlaceholder}
          aria-label={ui.myAskPlaceholder}
          disabled={busy}
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[13px] text-slate-100 placeholder:text-slate-500 focus:border-white/30 focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy || question.trim().length < 2}
          className="shrink-0 rounded-xl bg-white/15 px-3 py-2 text-[12px] font-medium text-slate-100 hover:bg-white/20 disabled:opacity-40"
        >
          {ui.myAskSend}
        </button>
      </form>
      <p className="mt-1 text-[11px] text-slate-500">{ui.myAskCost}</p>
      {busy ? <p className="mt-2 text-[12px] text-slate-400">{ui.myAskThinking}</p> : null}
      {error ? <p className="mt-2 text-[12px] text-rose-300">{error}</p> : null}
      {reply ? (
        <div className="mt-2 rounded-xl bg-white/[0.05] px-3 py-2.5">
          <p className="whitespace-pre-line text-[13px] leading-relaxed text-slate-100">{reply.answer}</p>
          {reply.grow ? (
            <button
              type="button"
              onClick={() => growElement(reply.grow!, ui)}
              className="mt-2 rounded-lg bg-[#e8e8e4] px-3 py-1.5 text-[12px] font-semibold text-neutral-900 hover:bg-white"
            >
              {ui.myGrowIt} · {elementNames(ui)[reply.grow]}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function ElementSheet({
  ui,
  element,
  isNext,
  targetLanguage,
  onClose,
  onStages,
}: {
  ui: UICopy;
  element: ElementView;
  isNext: boolean;
  targetLanguage: string;
  onClose: () => void;
  onStages?: () => void;
}) {
  const name = elementNames(ui)[element.id];
  const fact = factLine(element, ui);
  const peak = Math.max(1, ...element.daily);
  const grow = () => {
    growElement(element.id, ui);
    onClose();
  };
  return (
    <BodyLayer>
      <div className="fixed inset-0 z-[80] flex flex-col justify-end bg-black/60 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))] sm:items-center sm:justify-center">
        <button type="button" className="absolute inset-0 cursor-default" aria-label={ui.billingClose} onClick={onClose} />
        <div
          role="dialog"
          aria-modal="true"
          aria-label={name}
          className="relative z-10 max-h-full w-full max-w-md overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-[#0e0e0e] p-4"
        >
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              {isNext ? <p className="text-[11px] font-semibold text-rose-300">{ui.myNext}</p> : null}
              <h3 className="text-base font-semibold text-white">{name}</h3>
              {fact ? <p className="mt-0.5 text-[13px] text-slate-300">{fact}</p> : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={ui.billingClose}
              className="shrink-0 rounded-lg px-2 py-1 text-sm text-slate-400 hover:bg-white/10"
            >
              ✕
            </button>
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-slate-400">{hows(ui)[element.id]}</p>

          {element.measured ? (
            <div className="mt-4">
              <div className="flex items-baseline justify-between">
                <p className="text-[11px] font-semibold tracking-wide text-slate-500">{ui.myDaily}</p>
                {element.week > 0 ? (
                  <p className="text-[11px] text-emerald-300">{ui.myWeek.replace("{n}", String(element.week))}</p>
                ) : null}
              </div>
              <div className="mt-2 flex h-16 items-end gap-1" aria-hidden>
                {element.daily.map((n, i) => (
                  <div key={i} className="flex h-full flex-1 flex-col justify-end rounded-sm bg-white/[0.06]">
                    <div
                      className="w-full rounded-sm bg-emerald-400/60"
                      style={{ height: `${n ? Math.max(8, (n / peak) * 100) : 0}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {element.leaves.length ? (
            <div className="mt-4">
              <p className="text-[11px] font-semibold tracking-wide text-slate-500">{ui.myLeaves}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {element.leaves.map((leaf) => (
                  <span
                    key={leaf}
                    dir={learningLanguageTextDir(targetLanguage)}
                    className="rounded-full bg-white/10 px-2 py-0.5 text-[12px] text-slate-100"
                  >
                    {leaf}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <button
            type="button"
            onClick={grow}
            className="mt-5 w-full rounded-xl bg-[#e8e8e4] px-4 py-3 text-[14px] font-semibold text-neutral-900 hover:bg-white"
          >
            {ui.myGrowIt}
          </button>
          {onStages ? (
            <button
              type="button"
              onClick={onStages}
              className="mt-2 w-full rounded-xl border border-line px-4 py-2.5 text-note text-slate-200 hover:bg-white/5"
            >
              {element.id === "words" ? ui.homeTabVocab : ui.myOpenStage}
            </button>
          ) : null}
        </div>
      </div>
    </BodyLayer>
  );
}
