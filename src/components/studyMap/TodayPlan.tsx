"use client";

import { useEffect, useMemo, useState } from "react";
import { usePremium } from "@/contexts/PremiumContext";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { UICopy } from "@/lib/copy";
import {
  daysLeft,
  PACES,
  reviewKeysOf,
  reviewLabel,
  todayPlan,
  type Pace,
  type PlanItem,
  type PlanOrder,
  type ReviewMap,
} from "@/lib/curriculum/dailyPlan";
import { allFramesFor } from "@/lib/curriculum/frames";
import { allScriptsFor, glossFor } from "@/lib/curriculum/stageScripts";

/**
 * 오늘 할 것(lib/curriculum/dailyPlan.ts, 2026-10-28 사용자 "매일 학습할 걸 정해 주는 흐름"):
 * 분량(5·10·20분)마다 "n일 완성", 순서(커리큘럼 순서 기본 · 내 기록에 맞춰), 목록(다시 볼 것 먼저) — 누르면 그 대본·문장구조를 연다.
 * 오늘 목록은 날짜·분량·순서로 이 폰에 묶어 두어, 하나를 끝내도 다른 것으로 바뀌지 않고 ✓가 붙는다.
 * 학습 끝 체크(SelfCheck)는 대본·문장구조 화면 끝에서 표현·문장구조마다 알아요/헷갈려요 → 서버 다시 볼 것(stageScripts:v1 review).
 */

const SETTINGS_KEY = "dailyPlan.v1";
const TODAY_KEY = "dailyPlan.today.v1";
const REVIEW_EVENT = "lb-review";

type Settings = { pace: Pace; order: PlanOrder };
type Snapshot = { day: string; language: string; pace: number; order: PlanOrder; items: PlanItem[] };

function readSettings(): Settings {
  try {
    const raw = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? "null") as Partial<Settings> | null;
    const pace = PACES.includes(raw?.pace as Pace) ? (raw!.pace as Pace) : 10;
    return { pace, order: raw?.order === "record" ? "record" : "curriculum" };
  } catch {
    return { pace: 10, order: "curriculum" };
  }
}

function localDay(now = new Date()): string {
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

function readSnapshot(): Snapshot | null {
  try {
    return JSON.parse(localStorage.getItem(TODAY_KEY) ?? "null") as Snapshot | null;
  } catch {
    return null;
  }
}

/** 학습 끝 체크가 서버에 반영되면 오늘 할 것이 다시 볼 것을 새로 읽는다. */
function announceReview(language: string, review: ReviewMap) {
  window.dispatchEvent(new CustomEvent(REVIEW_EVENT, { detail: { language, review } }));
}

export function TodayPlan({
  ui,
  locale,
  language,
  stage,
  passed,
  review: initialReview,
  recommended,
  onOpen,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  stage: number;
  passed: readonly string[];
  review: ReviewMap;
  /** 서버가 고른 오늘의 대본(내 기록에 맞춰). */
  recommended: string | null;
  onOpen: (stage: number, id: string) => void;
}) {
  const [settings, setSettings] = useState<Settings>({ pace: 10, order: "curriculum" });
  const [review, setReview] = useState<ReviewMap>(initialReview);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [now, setNow] = useState(0);
  useEffect(() => {
    // 저장해 둔 분량·순서와 오늘 목록은 화면에 붙은 뒤 읽는다(서버 그림과 어긋나지 않게).
     
    setSettings(readSettings());
    setSnapshot(readSnapshot());
    setNow(Date.now());
  }, []);
  useEffect(() => {
     
    setReview(initialReview);
  }, [initialReview]);
  useEffect(() => {
    const on = (event: Event) => {
      const detail = (event as CustomEvent<{ language: string; review: ReviewMap }>).detail;
      if (detail?.language === language) setReview(detail.review);
    };
    window.addEventListener(REVIEW_EVENT, on);
    return () => window.removeEventListener(REVIEW_EVENT, on);
  }, [language]);

  const passedKey = passed.join(",");
  const passedSet = useMemo(() => new Set(passedKey ? passedKey.split(",") : []), [passedKey]);
  const day = now ? localDay(new Date(now)) : "";
  const fresh = useMemo(
    () => (now ? todayPlan({ language, stage, passed: passedSet, review, pace: settings.pace, order: settings.order, recommended, now }) : []),
    // 오늘 목록은 분량·순서·언어가 바뀔 때만 새로(하나 끝냈다고 바꾸지 않는다) — passed·review는 처음 계산에만.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [now, language, stage, settings.pace, settings.order, recommended],
  );
  const same = snapshot && snapshot.day === day && snapshot.language === language && snapshot.pace === settings.pace && snapshot.order === settings.order;
  const items = same ? snapshot.items : fresh;
  useEffect(() => {
    if (same || !day || !fresh.length) return;
    const next: Snapshot = { day, language, pace: settings.pace, order: settings.order, items: fresh };
    try {
      localStorage.setItem(TODAY_KEY, JSON.stringify(next));
    } catch {
      // 이 화면에서만.
    }
     
    setSnapshot(next);
  }, [same, day, fresh, language, settings.pace, settings.order]);

  const save = (next: Settings) => {
    setSettings(next);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch {
      // 이 화면에서만.
    }
  };

  if (!now || !items.length) return null;
  const scripts = allScriptsFor(language);
  const frames = allFramesFor(language);
  const labelOf = (item: PlanItem) =>
    item.kind === "script"
      ? glossFor(scripts.find((s) => s.id === item.id)?.setting ?? { en: item.id }, locale)
      : (frames.find((f) => f.id === item.id)?.pattern ?? item.id);
  const doneOf = (item: PlanItem) => (item.review ? !review[item.review] || review[item.review]!.due > now : passedSet.has(item.id));
  const finished = items.every(doneOf);
  const minutes = items.reduce((sum, item) => sum + item.minutes, 0);

  return (
    <section className="mt-3 rounded-2xl border border-status-learned/40 bg-status-learned/[0.06] px-3 py-3">
      <div className="flex items-center gap-2">
        <h3 className="min-w-0 flex-1 text-caption font-semibold text-status-learned">{ui.planTitle}</h3>
        <span className="text-caption tabular-nums text-slate-400">{finished ? `✓ ${ui.planAllDone}` : ui.planMinutes.replace("{n}", String(minutes))}</span>
      </div>
      <div role="group" className="mt-2 flex flex-wrap gap-1.5">
        {PACES.map((pace) => {
          const days = daysLeft(language, pace, passedSet, stage);
          const on = settings.pace === pace;
          return (
            <button
              key={pace}
              type="button"
              aria-pressed={on}
              onClick={() => save({ ...settings, pace })}
              className={`rounded-full px-3 py-1 text-caption ${on ? "bg-white/90 text-slate-900" : "border border-line text-slate-300 hover:bg-white/10"}`}
            >
              {ui.planMinutes.replace("{n}", String(pace))}
              {days ? <span className={on ? "text-slate-600" : "text-slate-500"}> · {ui.planDays.replace("{n}", String(days))}</span> : null}
            </button>
          );
        })}
      </div>
      <div role="group" className="mt-1.5 flex flex-wrap gap-1.5">
        {(["curriculum", "record"] as const).map((order) => (
          <button
            key={order}
            type="button"
            aria-pressed={settings.order === order}
            onClick={() => save({ ...settings, order })}
            className={`rounded-full px-3 py-1 text-caption ${settings.order === order ? "bg-white/15 text-ink" : "text-slate-400 hover:bg-white/10"}`}
          >
            {order === "curriculum" ? ui.planOrderCurriculum : ui.planOrderRecord}
          </button>
        ))}
      </div>
      <ul className="mt-2 flex flex-col gap-1.5">
        {items.map((item) => {
          const done = doneOf(item);
          return (
            <li key={`${item.id}-${item.review ?? ""}`}>
              <button
                type="button"
                onClick={() => onOpen(item.stage, item.id)}
                className="flex w-full items-center gap-3 rounded-xl border border-line px-3 py-2 text-start hover:bg-white/5"
              >
                <span aria-hidden className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-caption ${done ? "bg-status-mastered text-slate-900" : "border border-line"}`}>
                  {done ? "✓" : ""}
                </span>
                <span className="min-w-0 flex-1">
                  <span dir="auto" className={`block truncate text-note ${done ? "text-slate-400" : "text-ink"}`}>
                    {labelOf(item)}
                  </span>
                  {item.review ? (
                    <span dir="auto" className="block truncate text-meta text-warn">
                      {ui.planAgain} · {reviewLabel(language, item.review)}
                    </span>
                  ) : null}
                </span>
                <span className="shrink-0 text-caption tabular-nums text-slate-500">{ui.planMinutes.replace("{n}", String(item.minutes))}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * 대본·문장구조 끝: 그 대본의 핵심 표현·문장구조마다 알아요/헷갈려요(헷갈려요 → 2일 뒤, 그 뒤 알아요 → 7일 뒤 한 번 더, 또 알아요 → 끝).
 * 누를 때마다 서버에 바로(POST /api/curriculum/scripts check).
 */
export function SelfCheck({ ui, language, id }: { ui: UICopy; language: string; id: string }) {
  const { isPremium } = usePremium();
  const keys = useMemo(() => reviewKeysOf(language, id), [language, id]);
  const [marks, setMarks] = useState<Record<string, boolean>>({});
  if (!keys.length) return null;
  const mark = (key: string, known: boolean) => {
    setMarks((current) => ({ ...current, [key]: known }));
    void fetch(apiUrl("/api/curriculum/scripts"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
      body: JSON.stringify({ language, check: { [key]: known } }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: { review?: ReviewMap } | null) => {
        if (body?.review) announceReview(language, body.review);
      })
      .catch(() => undefined);
  };
  return (
    <ul className="flex w-full flex-col gap-1.5">
      {keys.map((key) => (
        <li key={key} className="flex items-center gap-2 rounded-xl border border-line px-3 py-2">
          <span dir="auto" className="min-w-0 flex-1 text-note text-slate-100">
            {reviewLabel(language, key)}
          </span>
          <button
            type="button"
            aria-pressed={marks[key] === true}
            onClick={() => mark(key, true)}
            className={`shrink-0 rounded-full px-2.5 py-1 text-caption ${marks[key] === true ? "bg-status-mastered text-slate-900" : "border border-line text-slate-300 hover:bg-white/10"}`}
          >
            {ui.checkKnown}
          </button>
          <button
            type="button"
            aria-pressed={marks[key] === false}
            onClick={() => mark(key, false)}
            className={`shrink-0 rounded-full px-2.5 py-1 text-caption ${marks[key] === false ? "bg-warn text-slate-900" : "border border-line text-slate-300 hover:bg-white/10"}`}
          >
            {ui.checkUnsure}
          </button>
        </li>
      ))}
    </ul>
  );
}
