"use client";

import { useEffect, useState } from "react";
import type { UICopy } from "@/lib/copy";
import { glossFor } from "@/lib/curriculum/stageScripts";
import type { WeakSpot } from "@/lib/curriculum/weakSpots";
import { localNotificationsAvailable } from "@/lib/platform";
import { allowMorning, MORNING_WORDS, onMorningChange, readMorning, saveMorning, type MorningSettings } from "@/lib/morningNotify";

/**
 * My 단계 보기 맨 위 "지난번에 틀린 것"(2026-10-28 사용자 "틀린 걸 상기시켜 주는 기능", curriculum/weakSpots.ts):
 * 튜터가 고친 내 줄(취소선 → 고친 줄)·대본에서 틀린 줄(◐)·헷갈려요(?)를 최근 순으로 옆으로 넘겨 본다. 누르면 그 대본·문장구조.
 */
export function WeakStrip({
  ui,
  locale,
  spots,
  onOpen,
}: {
  ui: UICopy;
  locale: string;
  spots: readonly WeakSpot[];
  onOpen: (stage: number, id: string) => void;
}) {
  if (!spots.length) return null;
  return (
    <section className="mt-3">
      <h3 className="text-caption font-semibold text-slate-300">{ui.weakTitle}</h3>
      <ul className="mt-2 flex snap-x gap-2 overflow-x-auto pb-1">
        {spots.map((spot) => (
          <li key={spot.key} className="w-64 shrink-0 snap-start">
            <button
              type="button"
              disabled={!spot.open}
              onClick={() => spot.open && onOpen(spot.open.stage, spot.open.id)}
              className="flex h-full w-full flex-col gap-1 rounded-xl border border-warn/40 bg-warn/[0.06] px-3 py-2 text-start enabled:hover:bg-warn/10"
            >
              {spot.kind === "fix" ? (
                <>
                  <span dir="auto" className="line-clamp-2 text-caption text-slate-400 line-through">
                    {spot.wrong}
                  </span>
                  <span dir="auto" className="line-clamp-2 text-note text-emerald-200">
                    {spot.right}
                  </span>
                  {spot.note ? (
                    <span dir="auto" className="line-clamp-2 text-meta text-slate-500">
                      {spot.note}
                    </span>
                  ) : null}
                </>
              ) : spot.kind === "line" ? (
                <>
                  <span dir="auto" className="line-clamp-2 text-note text-ink">
                    <span className="text-warn">◐ </span>
                    {spot.text}
                  </span>
                  <span dir="auto" className="line-clamp-2 text-meta text-slate-500">
                    {glossFor(spot.gloss, locale)}
                  </span>
                </>
              ) : (
                <span dir="auto" className="line-clamp-2 text-note text-ink">
                  <span className="text-warn">? </span>
                  {spot.label}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** 오늘 할 것 안 "🔔 아침 알림"(lib/morningNotify.ts) — 앱 안에서만. 켜면 알림 허용을 한 번 묻는다. */
export function MorningControl({ ui }: { ui: UICopy }) {
  const [settings, setSettings] = useState<MorningSettings | null>(null);
  const [open, setOpen] = useState(false);
  const [denied, setDenied] = useState(false);
  useEffect(() => {
    if (!localNotificationsAvailable()) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 이 폰에 저장한 설정은 붙은 뒤에 읽는다
    setSettings(readMorning());
    return onMorningChange(() => setSettings(readMorning()));
  }, []);
  if (!settings) return null;
  const time = `${String(settings.hour).padStart(2, "0")}:${String(settings.minute).padStart(2, "0")}`;
  const change = async (next: MorningSettings) => {
    if (next.on && !settings.on) {
      const allowed = await allowMorning();
      setDenied(!allowed);
      if (!allowed) return;
    }
    saveMorning(next);
  };
  return (
    <div className="mt-2">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="rounded-full border border-line px-3 py-1 text-caption text-slate-300 hover:bg-white/10"
      >
        🔔 {ui.morningSetting} · {settings.on ? `${time} · ${ui.morningWords.replace("{n}", String(settings.words))}` : ui.morningOff}
      </button>
      {open ? (
        <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl border border-line px-3 py-2">
          <div role="radiogroup" aria-label={ui.morningSetting} className="flex gap-0.5 rounded-xl border border-line p-0.5">
            {[false, true].map((on) => (
              <button
                key={String(on)}
                type="button"
                role="radio"
                aria-checked={settings.on === on}
                onClick={() => void change({ ...settings, on })}
                className={`rounded-lg px-2.5 py-1 text-caption ${settings.on === on ? (on ? "bg-platinum text-canvas" : "bg-white/15 text-ink") : "text-slate-400 hover:bg-white/10"}`}
              >
                {on ? ui.featureOn : ui.morningOff}
              </button>
            ))}
          </div>
          <input
            type="time"
            value={time}
            aria-label={ui.morningSetting}
            onChange={(event) => {
              const [hour, minute] = event.target.value.split(":").map(Number);
              if (Number.isInteger(hour) && Number.isInteger(minute)) void change({ ...settings, hour: hour!, minute: minute! });
            }}
            className="rounded-lg border border-line bg-transparent px-2 py-1 text-caption text-ink"
          />
          <div role="radiogroup" aria-label={ui.morningWords.replace("{n}", "")} className="flex gap-1">
            {MORNING_WORDS.map((words) => (
              <button
                key={words}
                type="button"
                role="radio"
                aria-checked={settings.words === words}
                onClick={() => void change({ ...settings, words })}
                className={`rounded-full px-2.5 py-1 text-caption ${settings.words === words ? "bg-white/90 text-slate-900" : "border border-line text-slate-300 hover:bg-white/10"}`}
              >
                {ui.morningWords.replace("{n}", String(words))}
              </button>
            ))}
          </div>
          {denied ? <p className="w-full text-caption text-warn">{ui.morningDenied}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
