"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { UICopy } from "@/lib/copy";
import {
  BANDS,
  constructionLabel,
  constructionsFor,
  findConstruction,
} from "@/lib/learner/constructions";
import {
  MIN_TURNS_FOR_LEVEL,
  PLAN_FOCUSES,
  PLAN_METHODS,
  bandProgress,
  constructionsByStatus,
  currentLevel,
  nextBand,
  overcome,
  parseProfile,
  type LearnerPlan,
  type LearnerProfile,
} from "@/lib/learner/profile";

/**
 * Where the learner's sentences stand: the level reached so far, how each band
 * is filling, which constructions still go wrong and which have been overcome,
 * the weeks behind it — and the choice of how to go on, which the next map
 * drawn reads (curriculum/prompt.ts).
 *
 * Folded to one line on top of the map; the detail opens under it.
 */
export function LearnerPanel({
  ui,
  locale,
  targetLanguage,
  isPremium,
  onRedraw,
}: {
  ui: UICopy;
  locale: string;
  targetLanguage: string;
  isPremium: boolean;
  /** Draw the map again with the plan as it stands. */
  onRedraw?: () => void;
}) {
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [open, setOpen] = useState(false);
  const supported = constructionsFor(targetLanguage).length > 0;

  useEffect(() => {
    if (!supported) return;
    let cancelled = false;
    void fetch(apiUrl(`/api/learner/profile?lang=${encodeURIComponent(targetLanguage)}`), {
      headers: entitlementHeaders(isPremium),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { profile?: unknown } | null) => {
        if (!cancelled && data?.profile) setProfile(parseProfile(data.profile, targetLanguage));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [supported, targetLanguage, isPremium]);

  if (!supported || !profile) return null;

  const level = currentLevel(profile);
  const next = nextBand(profile);
  const bands = bandProgress(profile);
  const nextRow = bands.find((row) => row.band === next);
  const byStatus = constructionsByStatus(profile);
  const beaten = overcome(profile);
  const label = (id: string) => {
    const c = findConstruction(id);
    return c ? constructionLabel(c, locale) : id;
  };

  const savePlan = async (plan: Partial<LearnerPlan>) => {
    setProfile((current) => (current ? { ...current, plan: { ...current.plan, ...plan } } : current));
    try {
      const response = await fetch(apiUrl("/api/learner/profile"), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
        body: JSON.stringify({ language: targetLanguage, plan }),
      });
      const data = (await response.json().catch(() => null)) as { profile?: unknown } | null;
      if (response.ok && data?.profile) setProfile(parseProfile(data.profile, targetLanguage));
    } catch {
      // Kept on screen; saved next time.
    }
  };

  const headline =
    level
      ? ui.learnerLevelNow.replace("{level}", level)
      : profile.turns < MIN_TURNS_FOR_LEVEL
        ? ui.learnerMeasuring
            .replace("{n}", String(profile.turns))
            .replace("{min}", String(MIN_TURNS_FOR_LEVEL))
        : ui.learnerLevelNow.replace("{level}", "—");

  const focusLabel = {
    weak: ui.learnerFocusWeak,
    next: ui.learnerFocusNext,
    topic: ui.learnerFocusTopic,
  } as const;
  const methodLabel = {
    chat: ui.learnerMethodChat,
    roleplay: ui.learnerMethodRoleplay,
    video: ui.learnerMethodVideo,
    mixed: ui.learnerMethodMixed,
  } as const;

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 text-left"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-semibold tracking-wide text-slate-500">
            {ui.learnerTitle}
          </span>
          <span className="mt-0.5 block text-[15px] font-semibold text-white">{headline}</span>
          {nextRow ? (
            <span className="mt-0.5 block text-[12px] text-slate-400">
              {ui.learnerNextBand
                .replace("{band}", nextRow.band)
                .replace("{mastered}", String(nextRow.mastered))
                .replace("{total}", String(nextRow.total))}
              {byStatus.weak.length ? ` · ${ui.learnerWeak} ${byStatus.weak.length}` : ""}
            </span>
          ) : null}
        </span>
        <span className="shrink-0 text-[12px] text-slate-400">{open ? ui.learnerLess : ui.learnerMore}</span>
      </button>

      {open ? (
        <div className="mt-3 space-y-4">
          <ul className="space-y-1.5" aria-label={ui.learnerTitle}>
            {bands.map((row) => (
              <li key={row.band} className="flex items-center gap-2">
                <span
                  className={`w-7 shrink-0 text-[12px] font-semibold ${
                    row.band === level ? "text-emerald-300" : row.band === next ? "text-amber-200" : "text-slate-500"
                  }`}
                >
                  {row.band}
                </span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <span
                    className={`block h-full rounded-full ${row.share >= 0.6 ? "bg-emerald-400" : "bg-amber-300/80"}`}
                    style={{ width: `${row.share * 100}%` }}
                  />
                </span>
                <span className="w-10 shrink-0 text-right text-[11px] text-slate-500">
                  {row.mastered}/{row.total}
                </span>
              </li>
            ))}
          </ul>

          {profile.history.length > 1 ? (
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-slate-500">{ui.learnerHistory}</p>
              <ol className="mt-1.5 flex gap-1.5 overflow-x-auto">
                {profile.history.slice(-8).map((row) => (
                  <li key={row.week} className="shrink-0 rounded-lg bg-black/30 px-2 py-1 text-center">
                    <span className="block text-[10px] text-slate-500">{row.week.slice(5)}</span>
                    <span className="block text-[12px] font-semibold text-slate-100">{row.level ?? "—"}</span>
                    <span className="block text-[10px] text-slate-500">✓{row.mastered}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          {byStatus.weak.length ? (
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-slate-500">{ui.learnerWeak}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {byStatus.weak.map((id) => (
                  <span key={id} className="rounded-full border border-rose-300/40 px-2 py-0.5 text-[12px] text-rose-200">
                    {label(id)}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {beaten.length ? (
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-slate-500">{ui.learnerOvercome}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {beaten.map((id) => (
                  <span key={id} className="rounded-full border border-emerald-400/40 px-2 py-0.5 text-[12px] text-emerald-200">
                    ✓ {label(id)}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {byStatus.learning.length ? (
            <p className="text-[12px] text-slate-400">
              {ui.learnerLearning.replace("{n}", String(byStatus.learning.length))}
            </p>
          ) : null}

          {profile.turns === 0 ? <p className="text-[12px] text-slate-400">{ui.learnerEmpty}</p> : null}

          <div>
            <p className="text-[11px] font-semibold tracking-wide text-slate-500">{ui.learnerPlanTitle}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5" role="radiogroup" aria-label={ui.learnerPlanTitle}>
              {PLAN_FOCUSES.map((focus) => (
                <PlanChip
                  key={focus}
                  on={profile.plan.focus === focus}
                  label={focusLabel[focus]}
                  onClick={() => void savePlan({ focus })}
                />
              ))}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1.5" role="radiogroup" aria-label={ui.learnerPlanTitle}>
              {PLAN_METHODS.map((method) => (
                <PlanChip
                  key={method}
                  on={profile.plan.method === method}
                  label={methodLabel[method]}
                  onClick={() => void savePlan({ method })}
                />
              ))}
            </div>
            {onRedraw ? (
              <button
                type="button"
                onClick={onRedraw}
                className="mt-2.5 w-full rounded-lg bg-white/15 px-3 py-2 text-[13px] text-slate-100 hover:bg-white/20"
              >
                {ui.learnerRedraw}
              </button>
            ) : null}
          </div>

          <p className="text-[11px] leading-relaxed text-slate-500">
            {ui.learnerNote.replace("{bands}", BANDS.join("·"))}
          </p>
        </div>
      ) : null}
    </section>
  );
}

function PlanChip({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={on}
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-[12px] ${
        on ? "border-white/40 bg-white/15 text-white" : "border-white/10 text-slate-400 hover:bg-white/5"
      }`}
    >
      {label}
    </button>
  );
}
