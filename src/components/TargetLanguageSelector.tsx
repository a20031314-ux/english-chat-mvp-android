"use client";

import { useEffect, useRef, useState } from "react";
import { LearningLanguageFlag } from "@/components/LearningLanguageFlag";
import { useLearningLanguage } from "@/contexts/LearningLanguageContext";
import { SUPPORTED_LEARNING_LANGUAGES } from "@/lib/learningLanguages";

type TargetLanguageSelectorProps = {
  /** Optional short label shown before the control */
  label?: string;
  className?: string;
};

export function TargetLanguageSelector({
  label,
  className = "",
}: TargetLanguageSelectorProps) {
  const { targetLanguage, setTargetLanguage, targetLanguageInfo } =
    useLearningLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
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
        aria-label={label ?? "Learning language"}
        className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50"
      >
        <LearningLanguageFlag language={targetLanguageInfo} />
        <span>{targetLanguageInfo.nativeLabel}</span>
        <span aria-hidden="true" className="text-slate-400">
          ▾
        </span>
      </button>

      {open ? (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-30 mt-1 max-h-[min(24rem,70vh)] min-w-[12rem] overflow-y-auto overflow-x-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg sm:left-auto sm:right-0"
        >
          {SUPPORTED_LEARNING_LANGUAGES.map((lang) => (
            <li
              key={lang.code}
              role="option"
              aria-selected={targetLanguage === lang.code}
            >
              <button
                type="button"
                onClick={() => {
                  setTargetLanguage(lang.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition ${
                  targetLanguage === lang.code
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <LearningLanguageFlag language={lang} />
                <span>{lang.nativeLabel}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
