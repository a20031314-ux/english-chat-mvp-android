"use client";

import { useEffect, useRef, useState } from "react";
import { LearningLanguageFlag } from "@/components/LearningLanguageFlag";
import { LOCALE_OPTIONS, type Locale } from "@/lib/copy";

type LanguageSelectorProps = {
  locale: Locale;
  onChange: (locale: Locale) => void;
  label?: string;
  className?: string;
};

export function LanguageSelector({
  locale,
  onChange,
  label,
  className = "",
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const current =
    LOCALE_OPTIONS.find((option) => option.key === locale) ?? LOCALE_OPTIONS[0];

  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (rootRef.current && target && !rootRef.current.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={`relative flex items-center gap-2 ${className}`.trim()}
    >
      {label ? (
        <span className="shrink-0 text-[11px] font-medium text-slate-500">
          {label}
        </span>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={label ?? current.label}
        className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50"
      >
        <LearningLanguageFlag
          language={{
            flag: current.flag,
            flagCountry: current.flagCountry,
            nativeLabel: current.label,
          }}
        />
        <span>{current.label}</span>
        <span aria-hidden="true" className="text-slate-400">
          ▾
        </span>
      </button>

      {open ? (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-30 mt-1 max-h-64 min-w-[12rem] overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg sm:left-auto sm:right-0"
        >
          {LOCALE_OPTIONS.map((option) => (
            <li
              key={option.key}
              role="option"
              aria-selected={locale === option.key}
            >
              <button
                type="button"
                onClick={() => {
                  onChange(option.key as Locale);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition ${
                  locale === option.key
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <LearningLanguageFlag
                  language={{
                    flag: option.flag,
                    flagCountry: option.flagCountry,
                    nativeLabel: option.label,
                  }}
                />
                <span>{option.label}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
