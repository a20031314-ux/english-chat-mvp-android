"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import { sendAppIntent } from "@/lib/appIntents";
import { BodyLayer } from "@/components/FullScreenLayer";
import type { UICopy } from "@/lib/copy";
import type { ElementId, ElementView, GrowthView } from "@/lib/learner/growth";
import { GAP_STEP } from "@/lib/learner/next";
import { learningLanguageTextDir } from "@/lib/learningLanguages";

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

export function GrowthNetwork({
  ui,
  locale,
  targetLanguage,
  isPremium,
  refreshKey,
}: {
  ui: UICopy;
  /** The interface language, which answers to questions are written in. */
  locale: string;
  targetLanguage: string;
  isPremium: boolean;
  refreshKey?: string | null;
}) {
  const [view, setView] = useState<GrowthView | null>(null);
  const [open, setOpen] = useState<ElementId | null>(null);

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
      <div className="flex items-baseline justify-between gap-2 px-1">
        <p className="text-[11px] font-semibold tracking-wide text-slate-400">{ui.myNetworkTitle}</p>
        <p className="text-[11px] text-slate-500">{total > 0 ? ui.myNetworkHint : ui.myStart}</p>
      </div>
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
      <AskBox ui={ui} locale={locale} targetLanguage={targetLanguage} isPremium={isPremium} />
      {opened ? (
        <ElementSheet
          ui={ui}
          element={opened}
          isNext={view.next === opened.id}
          targetLanguage={targetLanguage}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </section>
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
      const data = (await response.json().catch(() => null)) as { answer?: string; grow?: ElementId | null } | null;
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
}: {
  ui: UICopy;
  element: ElementView;
  isNext: boolean;
  targetLanguage: string;
  onClose: () => void;
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
        </div>
      </div>
    </BodyLayer>
  );
}
