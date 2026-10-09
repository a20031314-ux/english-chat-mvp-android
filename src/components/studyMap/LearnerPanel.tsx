"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/apiBase";
import { sendAppIntent } from "@/lib/appIntents";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { UICopy } from "@/lib/copy";
import { constructionLabel, findConstruction } from "@/lib/learner/constructions";
import {
  askTopics,
  countByState,
  emptyComprehension,
  parseComprehension,
  type AskAbout,
  type ComprehensionRecord,
} from "@/lib/learner/comprehension";
import {
  PLAN_FOCUSES,
  PLAN_METHODS,
  constructionsByStatus,
  parseProfile,
  type LearnerPlan,
  type LearnerProfile,
} from "@/lib/learner/profile";
import { improvements, suggestNext, type Suggestion } from "@/lib/learner/suggest";
import { findScenes, type SceneMatch } from "@/lib/studyMapClient";
import { normalizeYouTubeWatchUrl } from "@/lib/videoLearning";

/**
 * What the learner's own data says they need, and what to study for it.
 *
 * No level is shown: a level needs a standard behind it, and a few grammar
 * points read from chat are not one. What is shown is what the data does say —
 * where sentences go wrong and which phrases from the tutor they stop at
 * (with the evidence: "3 of the last 5"), what has stopped going wrong, the
 * weeks behind it, and a short list of what to study next, each with a way
 * to start on it now. The plan chosen here is what the next map is drawn for
 * (curriculum/prompt.ts).
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
  const [comprehension, setComprehension] = useState<ComprehensionRecord | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetch(apiUrl(`/api/learner/profile?lang=${encodeURIComponent(targetLanguage)}`), {
      headers: entitlementHeaders(isPremium),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { profile?: unknown; comprehension?: unknown } | null) => {
        if (cancelled || !data) return;
        if (data.profile) setProfile(parseProfile(data.profile, targetLanguage));
        setComprehension(
          data.comprehension
            ? parseComprehension(data.comprehension, targetLanguage)
            : emptyComprehension(targetLanguage, 0),
        );
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [targetLanguage, isPremium]);

  if (!profile) return null;

  const byStatus = constructionsByStatus(profile);
  const counts = comprehension ? countByState(comprehension) : null;
  const suggestions = suggestNext(profile, comprehension);
  const better = improvements(profile, comprehension);
  const needCount = byStatus.weak.length + (counts?.stuck ?? 0);
  const betterCount = better.constructions.length + better.phrases.length;
  const nothingYet = profile.turns === 0 && !(comprehension && Object.keys(comprehension.items).length);
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
  const aboutLabel: Record<AskAbout, string> = {
    meaning: ui.aboutMeaning,
    grammar: ui.aboutGrammar,
    usage: ui.aboutUsage,
    nuance: ui.aboutNuance,
    pronunciation: ui.aboutPronunciation,
    other: ui.aboutOther,
  };
  const topics = comprehension ? askTopics(comprehension) : [];

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
            {ui.needsTitle}
          </span>
          <span className="mt-0.5 block text-[15px] font-semibold text-white">
            {nothingYet
              ? ui.needsNothingYet
              : ui.needsSummary
                  .replace("{need}", String(needCount))
                  .replace("{better}", String(betterCount))}
          </span>
          {suggestions[0] ? (
            <span className="mt-0.5 block truncate text-[12px] text-slate-400">
              {ui.needsNextUp}:{" "}
              {suggestions[0].kind === "construction" ? label(suggestions[0].id) : suggestions[0].text}
            </span>
          ) : null}
        </span>
        <span className="shrink-0 text-[12px] text-slate-400">{open ? ui.learnerLess : ui.learnerMore}</span>
      </button>

      {open ? (
        <div className="mt-3 space-y-4">
          {nothingYet ? <p className="text-[12px] text-slate-400">{ui.needsEmpty}</p> : null}

          {suggestions.length ? (
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-slate-500">{ui.needsSuggestTitle}</p>
              <ul className="mt-2 space-y-2">
                {suggestions.map((suggestion) => (
                  <li key={suggestion.kind === "construction" ? suggestion.id : suggestion.text}>
                    <SuggestionCard
                      ui={ui}
                      suggestion={suggestion}
                      title={suggestion.kind === "construction" ? label(suggestion.id) : suggestion.text}
                      targetLanguage={targetLanguage}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {betterCount ? (
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-slate-500">{ui.needsBetterTitle}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {better.constructions.map((id) => (
                  <span key={id} className="rounded-full border border-emerald-400/40 px-2 py-0.5 text-[12px] text-emerald-200">
                    ✓ {label(id)}
                  </span>
                ))}
                {better.phrases.map((text) => (
                  <span key={text} className="rounded-full border border-sky-300/40 px-2 py-0.5 text-[12px] text-sky-100">
                    ✓ {text}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {profile.history.length > 1 ? (
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-slate-500">{ui.learnerHistory}</p>
              <ol className="mt-1.5 flex gap-1.5 overflow-x-auto">
                {profile.history.slice(-8).map((row) => (
                  <li key={row.week} className="shrink-0 rounded-lg bg-black/30 px-2 py-1 text-center">
                    <span className="block text-[10px] text-slate-500">{row.week.slice(5)}</span>
                    <span className="block text-[12px] font-semibold text-emerald-200">✓{row.mastered}</span>
                    <span className="block text-[11px] text-rose-200">!{row.weak}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-1 text-[11px] text-slate-500">{ui.needsHistoryKey}</p>
            </div>
          ) : null}

          {topics.length ? (
            <p className="text-[12px] text-slate-400">
              {ui.compAsks}: {topics.map(([about, n]) => `${aboutLabel[about]} ${n}`).join(" · ")}
            </p>
          ) : null}

          <div>
            <p className="text-[11px] font-semibold tracking-wide text-slate-500">{ui.learnerPlanTitle}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5" role="radiogroup" aria-label={ui.learnerPlanTitle}>
              {PLAN_FOCUSES.map((focus) => (
                <PlanChip key={focus} on={profile.plan.focus === focus} label={focusLabel[focus]} onClick={() => void savePlan({ focus })} />
              ))}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1.5" role="radiogroup" aria-label={ui.learnerPlanTitle}>
              {PLAN_METHODS.map((method) => (
                <PlanChip key={method} on={profile.plan.method === method} label={methodLabel[method]} onClick={() => void savePlan({ method })} />
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

          <p className="text-[11px] leading-relaxed text-slate-500">{ui.needsNote}</p>
        </div>
      ) : null}
    </section>
  );
}

function SuggestionCard({
  ui,
  suggestion,
  title,
  targetLanguage,
}: {
  ui: UICopy;
  suggestion: Suggestion;
  title: string;
  targetLanguage: string;
}) {
  const [scenes, setScenes] = useState<SceneMatch[] | null>(null);
  const [searching, setSearching] = useState(false);
  const reason = suggestion.reason;
  const why =
    reason.type === "missed"
      ? ui.needsWhyMissed.replace("{uses}", String(reason.uses)).replace("{misses}", String(reason.misses))
      : reason.type === "stuck"
        ? ui.needsWhyStuck.replace("{n}", String(reason.lookups))
        : reason.type === "unused"
          ? ui.needsWhyUnused
          : reason.type === "studied"
            ? ui.needsWhyStudied
            : ui.needsWhyNew;
  const example =
    suggestion.kind === "construction" ? findConstruction(suggestion.id)?.hint : undefined;

  const practise = () => {
    sendAppIntent("openTab", { tab: "chat" });
    if (suggestion.kind === "phrase") sendAppIntent("chatDraft", { text: suggestion.text });
  };

  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-2.5">
      <p className="text-[13px] font-medium text-slate-100">{title}</p>
      <p className="mt-0.5 text-[12px] text-slate-400">{why}</p>
      {example ? <p className="mt-1 text-[12px] text-slate-300">{ui.needsExample}: {example}</p> : null}
      <div className="mt-2 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={practise}
          className="rounded-lg bg-white/15 px-2.5 py-1 text-[12px] text-slate-100 hover:bg-white/20"
        >
          {ui.needsPractiseChat}
        </button>
        {suggestion.kind === "phrase" ? (
          <button
            type="button"
            disabled={searching}
            onClick={async () => {
              setSearching(true);
              setScenes((await findScenes(targetLanguage, [suggestion.text])) ?? []);
              setSearching(false);
            }}
            className="rounded-lg border border-white/15 px-2.5 py-1 text-[12px] text-slate-300 hover:bg-white/10 disabled:opacity-50"
          >
            {searching ? ui.mapScenesLoading : ui.mapFindScenes}
          </button>
        ) : null}
      </div>
      {scenes ? (
        scenes.length ? (
          <ul className="mt-2 space-y-1">
            {scenes.flatMap((match) =>
              match.found.flatMap((entry) =>
                entry.hits.slice(0, 2).map((hit) => (
                  <li key={`${match.videoId}-${hit.start}`}>
                    <button
                      type="button"
                      onClick={() => {
                        sendAppIntent("openTab", { tab: "video" });
                        sendAppIntent("openVideo", {
                          url: normalizeYouTubeWatchUrl(match.videoId),
                          startSeconds: Math.max(0, hit.start - 1),
                          durationSeconds: match.durationSeconds,
                        });
                      }}
                      className="w-full rounded-md px-1 py-1 text-left text-[12px] text-slate-300 hover:bg-white/10"
                    >
                      ▶ {Math.floor(hit.start / 60)}:{String(Math.floor(hit.start % 60)).padStart(2, "0")} · {hit.text}
                    </button>
                  </li>
                )),
              ),
            )}
          </ul>
        ) : (
          <p className="mt-2 text-[12px] text-slate-500">{ui.mapScenesEmpty}</p>
        )
      ) : null}
    </div>
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
