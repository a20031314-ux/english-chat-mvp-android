"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { isFeatureOn, readFeatures, readFeaturesOnServer, subscribeFeatures } from "@/lib/features";
import { readEntryDoor } from "@/lib/doors";
import { voiceCallAvailable } from "@/lib/platform";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import { sendAppIntent, type AppIntents } from "@/lib/appIntents";
import type { UICopy } from "@/lib/copy";
import type { NextStep } from "@/lib/learner/next";
import { learningLanguageTextDir } from "@/lib/learningLanguages";

/**
 * "Try this": one next thing to do, from what the learner's own data shows
 * (learner/next.ts), with a button that starts it — a conversation whose tutor
 * already knows what it is for. One at a time; "something else" moves on, and
 * a step passed over three times rests until tomorrow.
 *
 * Shown where a conversation starts (chat, the call tab) and on top of the map.
 */

type Loaded = { steps: NextStep[]; labelLanguage: string | null };

export type PracticeRequest = AppIntents["practice"];

const PASSES_KEY = "nextStepPasses";

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function readPasses(): Record<string, number> {
  try {
    const raw = JSON.parse(localStorage.getItem(PASSES_KEY) ?? "null") as { day?: string; counts?: Record<string, number> } | null;
    return raw?.day === today() && raw.counts ? raw.counts : {};
  } catch {
    return {};
  }
}

function writePasses(counts: Record<string, number>) {
  try {
    localStorage.setItem(PASSES_KEY, JSON.stringify({ day: today(), counts }));
  } catch {
    // A pass not remembered shows the step again, which is harmless.
  }
}

const cache = new Map<string, { at: number; data: Loaded }>();

async function loadSteps(language: string, fresh: boolean): Promise<Loaded | null> {
  const hit = cache.get(language);
  if (!fresh && hit && Date.now() - hit.at < 60_000) return hit.data;
  try {
    const response = await fetch(apiUrl(`/api/learner/next?lang=${encodeURIComponent(language)}`), {
      headers: entitlementHeaders(),
    });
    if (!response.ok) return null;
    const body = (await response.json()) as { steps?: NextStep[]; labelLanguage?: string | null };
    if (!Array.isArray(body.steps)) return null;
    const data = { steps: body.steps, labelLanguage: body.labelLanguage ?? null };
    cache.set(language, { at: Date.now(), data });
    return data;
  } catch {
    return null;
  }
}

export function stepTexts(step: NextStep, ui: UICopy, labelOk: boolean): { title: string; why: string } {
  const quote = (text: string) => `“${text}”`;
  switch (step.kind) {
    case "mistake":
      return {
        title: ui.nextMistake,
        why: ui.nextMistakeWhy.replace("{n}", String(step.count ?? 2)),
      };
    case "phrase":
      return {
        title: ui.nextPhrase.replace("{phrase}", quote(step.phrase ?? "")),
        why: step.used ? ui.nextPhraseWhy.replace("{n}", String(step.days ?? 7)) : ui.nextPhraseNew,
      };
    case "gap": {
      const titles = {
        speaking: ui.nextGapSpeaking,
        accuracy: ui.nextGapAccuracy,
        words: ui.nextGapWords,
        listening: ui.nextGapListening,
        pronunciation: ui.nextGapPronunciation,
        natural: ui.nextGapNatural,
      } as const;
      return { title: step.gap ? titles[step.gap] : ui.nextFree, why: ui.nextGapWhy };
    }
    case "situation":
      return {
        title:
          labelOk && step.topicTitle
            ? ui.nextSituation.replace("{topic}", quote(step.topicTitle))
            : ui.nextSituationAny,
        why: ui.nextSituationWhy,
      };
    case "mission":
      return {
        title:
          labelOk && step.topicTitle
            ? ui.nextMission.replace("{topic}", quote(step.topicTitle))
            : ui.nextMissionAny,
        why: ui.nextMissionWhy.replace("{done}", String(step.done ?? 0)).replace("{total}", String(step.total ?? 0)),
      };
    default:
      return { title: ui.nextFree, why: ui.nextFreeWhy };
  }
}

const noSubscribe = () => () => {};

export function NextStepCard({
  ui,
  locale,
  targetLanguage,
  canCall: languageHasCall,
  onStart,
  refreshKey,
}: {
  ui: UICopy;
  locale: string;
  targetLanguage: string;
  /** Whether this language has the call tab. */
  canCall: boolean;
  /** Start here instead of sending a request to another tab. */
  onStart?: (request: PracticeRequest) => void;
  /** Changes when what the steps are made from changes (a new map), so they are read again. */
  refreshKey?: string | null;
}) {
  // 통화를 숨겼으면(lib/features.ts, 창구 모드는 제외) 통화를 권하지 않고 채팅으로.
  const features = useSyncExternalStore(subscribeFeatures, readFeatures, readFeaturesOnServer);
  const door = useSyncExternalStore(noSubscribe, readEntryDoor, () => null);
  const callBuilt = useSyncExternalStore(noSubscribe, voiceCallAvailable, () => true);
  const canCall = callBuilt && languageHasCall && (Boolean(door) || isFeatureOn(features.off, "call"));
  const [data, setData] = useState<Loaded | null>(() => cache.get(targetLanguage)?.data ?? null);
  const [passes, setPasses] = useState<Record<string, number>>(() =>
    typeof window === "undefined" ? {} : readPasses(),
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void loadSteps(targetLanguage, true).then((loaded) => {
      if (!cancelled && loaded) setData(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [targetLanguage, refreshKey]);

  const steps = useMemo(
    () =>
      (data?.steps ?? []).filter(
        // 지도 할 일(미션)은 새 앱에 화면이 없다(2026-10-27 My 예전 목표 지도 뺌) — 서버는 2.74 이하 앱에 그대로 준다.
        (step) => step.tab !== "map" && (passes[step.key] ?? 0) < 3 && (step.tab !== "roleplay" || canCall || step.goal),
      ),
    [data, passes, canCall],
  );
  const step = steps.length ? steps[index % steps.length]! : null;

  const pass = useCallback(() => {
    if (!step) return;
    const next = { ...passes, [step.key]: (passes[step.key] ?? 0) + 1 };
    writePasses(next);
    setPasses(next);
    setIndex((value) => value + 1);
  }, [passes, step]);

  if (!step) return null;
  const labelOk = !data?.labelLanguage || data.labelLanguage === locale;
  const { title } = stepTexts(step, ui, labelOk);
  const preferred: "chat" | "roleplay" = step.tab === "roleplay" && !canCall ? "chat" : step.tab === "roleplay" ? "roleplay" : "chat";

  const start = (tab: "chat" | "roleplay") => {
    if (!step.goal) return;
    const request: PracticeRequest = {
      tab,
      goal: step.goal,
      title,
      ...(step.mistakeLabel && labelOk ? { mistakeLabel: step.mistakeLabel } : {}),
    };
    if (onStart) onStart(request);
    else sendAppIntent("practice", request);
  };
  const buttons: Array<{ label: string; act: () => void; primary: boolean }> = [];
  {
    const order: Array<"chat" | "roleplay"> = preferred === "roleplay" ? ["roleplay", "chat"] : ["chat", "roleplay"];
    for (const tab of order) {
      if (tab === "roleplay" && !canCall) continue;
      buttons.push({
        label: tab === "chat" ? ui.nextByChat : ui.nextByCall,
        act: () => start(tab),
        primary: tab === preferred,
      });
    }
  }

  return (
    <section
      aria-label={ui.nextTitle}
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-start"
    >
      <p className="text-[11px] font-semibold tracking-wide text-slate-400">{ui.nextTitle}</p>
      <p className="mt-1 text-[14px] font-semibold leading-snug text-slate-100">{title}</p>
      {step.kind === "mistake" && step.mistakeLabel && labelOk ? (
        <p className="mt-1.5 inline-block rounded-full bg-rose-300/10 px-2 py-0.5 text-[11px] text-rose-200">
          {step.mistakeLabel}
        </p>
      ) : null}
      {step.goal?.phrases?.length && step.kind !== "phrase" ? (
        <div className="mt-2">
          <p className="text-[11px] text-slate-500">{ui.nextPhrasesLabel}</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {step.goal.phrases.map((phrase) => (
              <span
                key={phrase}
                dir={learningLanguageTextDir(targetLanguage)}
                className="rounded-full bg-white/10 px-2 py-0.5 text-[12px] text-slate-100"
              >
                {phrase}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {buttons.map((button) => (
          <button
            key={button.label}
            type="button"
            onClick={button.act}
            className={
              button.primary
                ? "rounded-lg bg-[#e8e8e4] px-3 py-1.5 text-[12px] font-semibold text-neutral-900 hover:bg-white"
                : "rounded-lg border border-white/15 px-3 py-1.5 text-[12px] text-slate-200 hover:bg-white/10"
            }
          >
            {button.label}
          </button>
        ))}
        {steps.length > 1 ? (
          <button
            type="button"
            onClick={pass}
            className="ms-auto rounded-lg px-2 py-1.5 text-[12px] text-slate-400 underline-offset-4 hover:text-slate-200 hover:underline"
          >
            {ui.nextOther}
          </button>
        ) : null}
      </div>
    </section>
  );
}

/**
 * The strip above a conversation started with something to practise: what it
 * is for, the phrases with a tick once said, and a way to drop it.
 */
export function PracticeBanner({
  ui,
  request,
  said,
  targetLanguage,
  onStop,
}: {
  ui: UICopy;
  request: PracticeRequest;
  /** Phrases already said in this conversation. */
  said: Set<string>;
  targetLanguage: string;
  onStop: () => void;
}) {
  const { goal, title, mistakeLabel } = request;
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-start">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold text-slate-400">{ui.practiceNow}</p>
          {title ? <p className="mt-0.5 text-[13px] leading-snug text-slate-100">{title}</p> : null}
          {mistakeLabel ? (
            <p className="mt-0.5 text-[12px] text-rose-200">{ui.practiceWatch.replace("{label}", mistakeLabel)}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onStop}
          className="shrink-0 rounded-md px-2 py-0.5 text-[11px] text-slate-400 hover:bg-white/10"
        >
          {ui.practiceStop}
        </button>
      </div>
      {goal.phrases?.length ? (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {goal.phrases.map((phrase) => {
            const done = said.has(phrase);
            return (
              <span
                key={phrase}
                dir={learningLanguageTextDir(targetLanguage)}
                className={`rounded-full px-2 py-0.5 text-[12px] ${
                  done ? "bg-emerald-400/15 text-emerald-200" : "bg-white/10 text-slate-200"
                }`}
              >
                {done ? "✓ " : ""}
                {phrase}
              </span>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
