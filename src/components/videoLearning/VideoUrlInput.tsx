"use client";

import { FormEvent, type ReactNode } from "react";
import type { UICopy } from "@/lib/copy";

export function VideoUrlInput({
  ui,
  value,
  error,
  hint,
  onChange,
  onSubmit,
  library,
  children,
}: {
  ui: UICopy;
  value: string;
  error: string | null;
  hint?: string | null;
  onChange: (value: string) => void;
  onSubmit: () => void;
  library?: ReactNode;
  children?: ReactNode;
}) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col px-4 py-10">
      <p className="text-center text-lg font-semibold text-white">
        {ui.videoLearnHeadline}
      </p>
      <p className="mt-2 text-center text-sm leading-relaxed text-slate-400">
        {ui.videoLearnBody}
      </p>
      {hint ? (
        <p className="mt-2 text-center text-xs leading-relaxed text-slate-500">
          {hint}
        </p>
      ) : null}
      {library}
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={ui.videoLearnUrlPlaceholder}
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
          className="w-full rounded-xl border border-white/15 bg-[#101010] px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-white/40"
        />
        <button
          type="submit"
          className="w-full rounded-xl bg-[#e8e8e4] px-4 py-2.5 text-sm font-medium text-neutral-900 shadow-[0_0_16px_rgba(255,255,255,0.28)] hover:bg-[#f5f5f3]"
        >
          {ui.videoLearnLoad}
        </button>
      </form>
      {error ? (
        <p className="mt-3 text-center text-sm text-rose-300">{error}</p>
      ) : null}
      {children}
    </div>
  );
}
