"use client";

import type { Locale } from "@/lib/copy";
import {
  dayKeyFromParts,
  daysInMonth,
  firstWeekdayOfMonth,
  type YearMonth,
} from "@/lib/monthlyReports";
import type { SessionReport } from "@/lib/sessionReports";

const WEEKDAY_TAGS: Partial<Record<Locale, string>> = {
  ko: "ko-KR",
  en: "en-US",
  es: "es-ES",
  ja: "ja-JP",
  zh: "zh-CN",
  vi: "vi-VN",
  fr: "fr-FR",
  pt: "pt-BR",
  id: "id-ID",
};

type LearningCalendarProps = {
  ym: YearMonth;
  locale: Locale;
  reportsByDay: Map<string, SessionReport[]>;
  selectedDayKey: string | null;
  onSelectDay: (dayKey: string, reports: SessionReport[]) => void;
};

function weekdayLabels(locale: Locale): string[] {
  const tag = WEEKDAY_TAGS[locale] ?? "en-US";
  // 2023-01-01 was a Sunday — walk Sun→Sat
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(2023, 0, 1 + i);
    return d.toLocaleDateString(tag, { weekday: "short" });
  });
}

export function LearningCalendar({
  ym,
  locale,
  reportsByDay,
  selectedDayKey,
  onSelectDay,
}: LearningCalendarProps) {
  const labels = weekdayLabels(locale);
  const totalDays = daysInMonth(ym.year, ym.month);
  const lead = firstWeekdayOfMonth(ym.year, ym.month);
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === ym.year && today.getMonth() + 1 === ym.month;
  const todayDay = today.getDate();

  const cells: Array<{ day: number | null; key: string | null }> = [];
  for (let i = 0; i < lead; i++) cells.push({ day: null, key: null });
  for (let day = 1; day <= totalDays; day++) {
    cells.push({
      day,
      key: dayKeyFromParts(ym.year, ym.month, day),
    });
  }
  while (cells.length % 7 !== 0) cells.push({ day: null, key: null });

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 sm:p-4">
      <div className="grid grid-cols-7 gap-1 text-center">
        {labels.map((label, i) => (
          <div
            key={i}
            className="pb-1 text-[10px] font-medium uppercase tracking-wide text-slate-400 sm:text-[11px]"
          >
            {label}
          </div>
        ))}
        {cells.map((cell, index) => {
          if (cell.day == null || cell.key == null) {
            return <div key={`pad-${index}`} className="aspect-square" />;
          }

          const dayReports = reportsByDay.get(cell.key) ?? [];
          const hasLearning = dayReports.length > 0;
          const selected = selectedDayKey === cell.key;
          const isToday = isCurrentMonth && cell.day === todayDay;

          if (!hasLearning) {
            return (
              <div
                key={cell.key}
                className={`flex aspect-square items-center justify-center rounded-lg text-sm tabular-nums text-slate-300 ${
                  isToday ? "ring-1 ring-slate-300" : ""
                }`}
                aria-hidden
              >
                {cell.day}
              </div>
            );
          }

          return (
            <button
              key={cell.key}
              type="button"
              onClick={() => onSelectDay(cell.key!, dayReports)}
              aria-pressed={selected}
              aria-label={`${ym.year}-${ym.month}-${cell.day}`}
              className={`flex aspect-square items-center justify-center rounded-lg text-sm font-semibold tabular-nums transition ${
                selected
                  ? "bg-teal-700 text-white shadow-sm"
                  : "bg-teal-100 text-teal-900 hover:bg-teal-200"
              } ${isToday && !selected ? "ring-2 ring-teal-500 ring-offset-1" : ""}`}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
