"use client";

import { useEffect, useRef, useState } from "react";
import { LOCALE_OPTIONS, type Locale } from "@/lib/copy";

type LanguageSelectorProps = {
  locale: Locale;
  onChange: (locale: Locale) => void;
};

export function LanguageSelector({ locale, onChange }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const currentLabel =
    LOCALE_OPTIONS.find((option) => option.key === locale)?.label ?? "한국어";

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
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50"
      >
        {currentLabel} ▾
      </button>

      {open ? (
        <ul
          role="listbox"
          className="absolute right-0 z-20 mt-1 max-h-64 min-w-[10.5rem] overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
        >
          {LOCALE_OPTIONS.map((option) => (
            <li key={option.key} role="option" aria-selected={locale === option.key}>
              <button
                type="button"
                onClick={() => {
                  onChange(option.key);
                  setOpen(false);
                }}
                className={`block w-full px-3 py-2 text-left text-xs transition ${
                  locale === option.key
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
