"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { TTSButton } from "@/components/TTSButton";
import { usePremium } from "@/contexts/PremiumContext";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { UICopy } from "@/lib/copy";
import { frameById } from "@/lib/curriculum/frames";
import { glossFor } from "@/lib/curriculum/stageScripts";
import { useStageGlosses } from "@/lib/curriculum/useStageGlosses";
import type { WeakSpot } from "@/lib/curriculum/weakSpots";
import { learningLanguageSpeechTag, type LearningLanguageCode } from "@/lib/learningLanguages";

/**
 * 복습 = 읽고 정리(2026-10-30 사용자 "복습이 퀴즈랑 소재가 겹치니 읽거나 정리하는 형태로" → A): 지난번에 틀린 것(curriculum/weakSpots.ts —
 * 튜터가 고친 내 줄·대본에서 틀린 줄·헷갈려요)을 카드로 읽는다. 카드마다 [알아요 | 헷갈려요]: 알아요면 이 폰에서 목록에서 빠지고,
 * 헷갈려요면 그 열쇠를 다시 볼 것으로(서버 check) — 퀴즈 칸이 그것부터 낸다. 문제 풀기는 퀴즈 칸만 한다.
 */

const KEY = "reviewNotes.v1";
const EVENT = "lb-review-notes";

function readRaw(): string {
  try {
    return localStorage.getItem(KEY) ?? "{}";
  } catch {
    return "{}";
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** 아직 "알아요"를 누르지 않은 카드 — 칸 머리 숫자와 목록이 같이 쓴다(이 폰, 언어마다). */
export function useReviewNotes(language: string, spots: readonly WeakSpot[]) {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "{}");
  const done = useMemo(() => {
    try {
      return (JSON.parse(raw) as Record<string, Record<string, number>>)[language] ?? {};
    } catch {
      return {};
    }
  }, [raw, language]);
  const left = useMemo(() => spots.filter((spot) => !done[spot.key]), [spots, done]);
  const markKnown = (key: string) => {
    try {
      const all = JSON.parse(readRaw()) as Record<string, Record<string, number>>;
      // 오래된 것부터 버려 언어마다 300개까지.
      const mine = Object.fromEntries(Object.entries({ ...(all[language] ?? {}), [key]: Date.now() }).sort((a, b) => b[1] - a[1]).slice(0, 300));
      localStorage.setItem(KEY, JSON.stringify({ ...all, [language]: mine }));
    } catch {
      // 이 화면에서만.
    }
    window.dispatchEvent(new Event(EVENT));
  };
  return { left, markKnown };
}

/** 헷갈려요를 다시 볼 것으로 보낼 열쇠: 문장구조 카드면 f|틀, 다시 볼 것(review)이면 그 열쇠. */
function checkKeyOf(language: string, spot: WeakSpot): string | null {
  if (spot.kind === "review") return spot.key;
  if (spot.open && frameById(language, spot.open.id)) return `f|${spot.open.id}`;
  return null;
}

export function ReviewNotes({
  ui,
  locale,
  language,
  notes,
  onKnown,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  notes: readonly WeakSpot[];
  onKnown: (key: string) => void;
}) {
  const { isPremium } = usePremium();
  const [unsure, setUnsure] = useState<Record<string, boolean>>({});
  // 대본 줄 뜻은 앱 언어로(서버가 옮김) — 받으면 다시 그린다.
  useStageGlosses(language, 1, locale);
  useStageGlosses(language, 2, locale);
  useStageGlosses(language, 3, locale);
  const tag = learningLanguageSpeechTag(language as LearningLanguageCode);
  const frameOf = (spot: WeakSpot) => (spot.kind === "review" && spot.key.startsWith("f|") ? frameById(language, spot.key.slice(2)) : null);
  if (!notes.length) return <p data-review-notes className="px-1 py-2 text-caption text-slate-400">✓ {ui.studyReviewNone}</p>;
  const confuse = (spot: WeakSpot) => {
    setUnsure((current) => ({ ...current, [spot.key]: true }));
    const key = checkKeyOf(language, spot);
    if (!key) return;
    void fetch(apiUrl("/api/curriculum/scripts"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
      body: JSON.stringify({ language, check: { [key]: false } }),
    }).catch(() => undefined);
  };
  return (
    <ul data-review-notes className="flex flex-col gap-2">
      {notes.slice(0, 20).map((spot) => {
        const say = spot.kind === "fix" ? spot.right : spot.kind === "line" ? spot.text : (frameOf(spot)?.examples[0]?.text ?? "");
        return (
          <li key={spot.key} data-review-note className="rounded-xl border border-bad/30 bg-bad/[0.05] px-3 py-2.5">
            {spot.kind === "fix" ? (
              <>
                <p dir="auto" className="text-caption text-slate-400 line-through">
                  {spot.wrong}
                </p>
                <p dir="auto" className="mt-0.5 text-note text-emerald-200">
                  {spot.right}
                </p>
                {spot.note ? (
                  <p dir="auto" className="mt-1 text-meta text-slate-300">
                    {spot.note}
                  </p>
                ) : null}
              </>
            ) : spot.kind === "line" ? (
              <>
                <p dir="auto" className="text-note text-ink">
                  {spot.text}
                </p>
                <p dir="auto" className="mt-0.5 text-meta text-slate-400">
                  {glossFor(spot.gloss, locale)}
                </p>
              </>
            ) : frameOf(spot) ? (
              <>
                {/* A pattern to look at again: the pattern, what it does, and one full example to read. */}
                <p dir="auto" className="text-note text-ink">
                  {frameOf(spot)!.pattern}
                </p>
                <p dir="auto" className="mt-0.5 text-meta text-slate-400">
                  {glossFor(frameOf(spot)!.meaning, locale)}
                </p>
                {frameOf(spot)!.examples[0] ? (
                  <p dir="auto" className="mt-1 text-note text-emerald-200">
                    {frameOf(spot)!.examples[0]!.text}
                  </p>
                ) : null}
              </>
            ) : (
              <p dir="auto" className="text-note text-ink">
                {spot.label}
              </p>
            )}
            <div className="mt-2 flex items-center gap-1.5">
              {say ? <TTSButton text={say} lang={tag} className="shrink-0" /> : null}
              <span className="flex-1" />
              <button
                type="button"
                data-note-unsure
                aria-pressed={Boolean(unsure[spot.key])}
                onClick={() => confuse(spot)}
                className={`rounded-full px-3 py-1 text-caption ${unsure[spot.key] ? "bg-warn/20 text-warn" : "border border-line text-slate-300 hover:bg-white/10"}`}
              >
                {ui.checkUnsure}
              </button>
              <button
                type="button"
                data-note-known
                onClick={() => onKnown(spot.key)}
                className="rounded-full border border-line px-3 py-1 text-caption text-slate-200 hover:bg-white/10"
              >
                {ui.checkKnown}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
