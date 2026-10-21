"use client";

import { useEffect, useMemo, useState } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { UICopy } from "@/lib/copy";
import type { LedgerState, LedgerSummary, LedgerTab, Place } from "@/lib/learner/ledger";
import { loadVocabulary } from "@/lib/vocabulary";
import { WordLedgerLine, placeLabel } from "@/components/LedgerLinks";
import { goToFirstMet, setLinksShown, useLinksShown } from "@/lib/learner/ledgerClient";

/**
 * 내 표현: what this learner has met, learned and can produce in the language
 * they are learning, from every tab (learner/ledger.ts). A line on the map
 * tab, and a sheet with how it has grown week by week, how much of it is
 * still in use, where it came from, and the phrases themselves.
 *
 * No level is shown — counts of phrases they can produce, nothing graded.
 */

type Row = {
  text: string;
  state: LedgerState;
  firstMet: Place;
  lastOutput: { at: number; where: string; unaided: boolean } | null;
  understood: boolean;
  onMap: boolean;
  lastAt: number;
};

const DOT: Record<LedgerState, string> = {
  mastered: "bg-status-mastered",
  learned: "bg-status-learned",
  met: "bg-white/25",
};

const SENT_KEY = (language: string) => `ledgerWordListSent:v1:${language}`;

/** The word list lived on the device; it is sent once so the ledger starts with it. */
async function sendWordListOnce(language: string, isPremium: boolean): Promise<boolean> {
  try {
    if (localStorage.getItem(SENT_KEY(language))) return false;
    const words = loadVocabulary()
      .filter((entry) => entry.languageCode === language)
      .map((entry) => entry.word.trim())
      .filter(Boolean);
    for (let i = 0; i < words.length; i += 50) {
      const response = await fetch(apiUrl("/api/learner/ledger"), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
        body: JSON.stringify({
          language,
          meets: words.slice(i, i + 50).map((text) => ({ kind: "save", text, tab: "vocab" })),
        }),
      });
      if (!response.ok) return false;
    }
    localStorage.setItem(SENT_KEY(language), String(Date.now()));
    return words.length > 0;
  } catch {
    return false;
  }
}

export function LedgerPanel({
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
  const [data, setData] = useState<{ summary: LedgerSummary; items: Row[] } | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = () =>
      fetch(apiUrl(`/api/learner/ledger?lang=${encodeURIComponent(targetLanguage)}`), {
        headers: entitlementHeaders(isPremium),
      })
        .then((response) => (response.ok ? response.json() : null))
        .then((body: { summary?: LedgerSummary; items?: Row[] } | null) => {
          if (!cancelled && body?.summary) setData({ summary: body.summary, items: body.items ?? [] });
        })
        .catch(() => undefined);
    void load().then(async () => {
      if (await sendWordListOnce(targetLanguage, isPremium)) await load();
    });
    return () => {
      cancelled = true;
    };
  }, [targetLanguage, isPremium]);

  if (!data) return null;
  const { counts, masteredThisWeek } = data.summary;
  const total = counts.met + counts.learned + counts.mastered;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mb-2 flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-start"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-semibold tracking-wide text-slate-500">{ui.ledgerTitle}</span>
          <span className="mt-0.5 block text-[13px] tabular-nums text-slate-100">
            {total === 0
              ? ui.ledgerEmptyShort
              : `${ui.itemsMastered} ${counts.mastered} · ${ui.itemsLearned} ${counts.learned} · ${ui.ledgerMet} ${counts.met}`}
          </span>
        </span>
        {masteredThisWeek > 0 ? (
          <span className="shrink-0 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] text-emerald-200">
            {ui.ledgerThisWeek.replace("{n}", String(masteredThisWeek))}
          </span>
        ) : null}
        <span className="shrink-0 text-[12px] text-slate-400">{ui.learnerMore}</span>
      </button>
      {open ? (
        <LedgerSheet ui={ui} locale={locale} language={targetLanguage} data={data} onClose={() => setOpen(false)} />
      ) : null}
    </>
  );
}

function LedgerSheet({
  ui,
  locale,
  language,
  data,
  onClose,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  data: { summary: LedgerSummary; items: Row[] };
  onClose: () => void;
}) {
  const [filter, setFilter] = useState<LedgerState | "all">("all");
  const [opened, setOpened] = useState<string | null>(null);
  const linksOn = useLinksShown();
  const { summary, items } = data;
  const tabName: Record<LedgerTab, string> = {
    chat: ui.homeTabChat,
    call: ui.homeTabCall,
    video: ui.homeTabVideo,
    vocab: ui.homeTabVocab,
    map: ui.homeTabMap,
  };
  const stateName: Record<LedgerState, string> = {
    mastered: ui.itemsMastered,
    learned: ui.itemsLearned,
    met: ui.ledgerMet,
  };
  const weeks = summary.weeks.slice(-12);
  // A floor, so a first phrase is a small bar and not a full one.
  const peak = Math.max(10, ...weeks.map((w) => w.mastered + w.learned));
  const sources = (Object.entries(summary.bySource) as Array<[LedgerTab, number]>)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1]);
  const sourceTotal = sources.reduce((sum, [, n]) => sum + n, 0);
  const shown = useMemo(
    () => (filter === "all" ? items : items.filter((item) => item.state === filter)),
    [filter, items],
  );

  return (
    <BodyLayer>
      <div className="fixed inset-0 z-[80] flex flex-col justify-end bg-black/60 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))] sm:items-center sm:justify-center">
        <button type="button" className="absolute inset-0 cursor-default" aria-label={ui.billingClose} onClick={onClose} />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ledger-title"
          className="relative z-10 max-h-full w-full max-w-md overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-[#0e0e0e] p-4"
        >
          <div className="flex items-start gap-2">
            <h3 id="ledger-title" className="min-w-0 flex-1 text-base font-semibold text-white">
              {ui.ledgerTitle}
            </h3>
            <button
              type="button"
              onClick={onClose}
              aria-label={ui.billingClose}
              className="rounded-lg px-2 py-1 text-[13px] text-slate-400 hover:bg-white/10"
            >
              ✕
            </button>
          </div>
          <label className="mt-2 flex items-center justify-between gap-3 rounded-lg bg-white/[0.04] px-3 py-2 text-[12px] text-slate-300">
            <span>{ui.linksToggle}</span>
            <input
              type="checkbox"
              checked={linksOn}
              onChange={(event) => setLinksShown(event.target.checked)}
              className="h-4 w-4 accent-sky-400"
            />
          </label>

          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            {(["mastered", "learned", "met"] as LedgerState[]).map((state) => (
              <div key={state} className="rounded-xl bg-white/[0.04] px-2 py-2.5">
                <span className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                  <span className={`h-1.5 w-1.5 rounded-full ${DOT[state]}`} />
                  {stateName[state]}
                </span>
                <span className="mt-0.5 block text-xl font-semibold tabular-nums text-white">
                  {summary.counts[state]}
                </span>
              </div>
            ))}
          </div>

          {weeks.length > 0 ? (
            <section className="mt-4">
              <p className="text-[11px] font-semibold tracking-wide text-slate-500">{ui.ledgerWeeklyTitle}</p>
              <div className="mt-2 flex h-24 items-end gap-1 border-b border-white/10" aria-hidden>
                {weeks.map((w) => (
                  <div key={w.week} className="flex h-full max-w-8 flex-1 flex-col justify-end" title={w.week}>
                    <div className="w-full bg-amber-300/70" style={{ height: `${(w.learned / peak) * 100}%` }} />
                    <div className="w-full rounded-b-sm bg-emerald-400" style={{ height: `${(w.mastered / peak) * 100}%` }} />
                  </div>
                ))}
              </div>
              <p className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-emerald-400" />
                  {ui.itemsMastered}
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-amber-300/70" />
                  {ui.itemsLearned}
                </span>
                <span dir="ltr" className="ms-auto tabular-nums">
                  {weeks[0]!.week} – {weeks[weeks.length - 1]!.week}
                </span>
              </p>
            </section>
          ) : null}

          <section className="mt-4 rounded-xl bg-white/[0.04] px-3 py-2.5">
            <p className="text-[12px] text-slate-400">{ui.ledgerRetention}</p>
            <p className="mt-0.5 text-lg font-semibold tabular-nums text-white">
              {summary.retention === null ? ui.ledgerRetentionNone : `${Math.round(summary.retention * 100)}%`}
            </p>
          </section>

          {sources.length > 0 ? (
            <section className="mt-4">
              <p className="text-[11px] font-semibold tracking-wide text-slate-500">{ui.ledgerSourcesTitle}</p>
              <ul className="mt-2 space-y-1.5">
                {sources.map(([tab, n]) => (
                  <li key={tab} className="flex items-center gap-2 text-[12px] text-slate-300">
                    <span className="w-16 shrink-0 truncate">{tabName[tab]}</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                      <span className="block h-full rounded-full bg-sky-400/70" style={{ width: `${(n / sourceTotal) * 100}%` }} />
                    </span>
                    <span className="w-8 shrink-0 text-end tabular-nums text-slate-400">{n}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="mt-4">
            <div className="flex flex-wrap gap-1.5">
              {(["all", "mastered", "learned", "met"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  aria-pressed={filter === key}
                  className={`rounded-full border px-2.5 py-1 text-[12px] ${
                    filter === key ? "border-white/40 bg-white/15 text-white" : "border-white/10 text-slate-400"
                  }`}
                >
                  {key === "all" ? ui.ledgerAll : stateName[key]}
                </button>
              ))}
            </div>
            {shown.length === 0 ? (
              <p className="mt-3 text-[12px] leading-relaxed text-slate-500">{ui.ledgerEmpty}</p>
            ) : (
              <ul className="mt-2 space-y-1.5">
                {shown.map((item) => (
                  <li key={`${item.state}-${item.text}`} className="rounded-lg bg-white/[0.03] px-3 py-2">
                    <button
                      type="button"
                      onClick={() => setOpened(opened === item.text ? null : item.text)}
                      aria-expanded={opened === item.text}
                      className="flex w-full items-start gap-2 text-start"
                    >
                      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${DOT[item.state]}`} />
                      <span className="min-w-0 flex-1">
                        <span dir="auto" className="block text-start text-[13px] leading-snug text-slate-100">
                          {item.text}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-slate-500">
                          {tabName[item.firstMet.tab] ?? ""}
                          {item.firstMet.tab === "video" && typeof item.firstMet.t === "number"
                            ? ` · ${Math.floor(item.firstMet.t / 60)}:${String(item.firstMet.t % 60).padStart(2, "0")}`
                            : ""}
                          {item.understood ? ` · ${ui.ledgerUnderstood}` : ""}
                          {item.onMap && item.firstMet.tab !== "map" ? ` · ${ui.homeTabMap}` : ""}
                        </span>
                      </span>
                    </button>
                    {opened === item.text ? (
                      <div className="mt-1 ps-3.5">
                        <WordLedgerLine ui={ui} locale={locale} word={item.text} language={language} onLeave={onClose} />
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            goToFirstMet(item.firstMet);
                          }}
                          className="mt-1.5 rounded-lg border border-white/15 px-2 py-0.5 text-[11px] text-slate-200 hover:bg-white/10"
                        >
                          {ui.linkGoBack} · {placeLabel(ui, item.firstMet)}
                        </button>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </BodyLayer>
  );
}
