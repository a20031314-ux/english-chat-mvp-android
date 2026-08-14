"use client";

import { FormEvent } from "react";
import type { UICopy } from "@/lib/copy";

export function VideoUrlInput({
  ui,
  value,
  error,
  onChange,
  onSubmit,
}: {
  ui: UICopy;
  value: string;
  error: string | null;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col px-4 py-10">
      <p className="text-center text-lg font-semibold text-slate-900">
        {ui.videoLearnHeadline}
      </p>
      <p className="mt-2 text-center text-sm leading-relaxed text-slate-600">
        {ui.videoLearnBody}
      </p>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={ui.videoLearnUrlPlaceholder}
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500"
        />
        <button
          type="submit"
          className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          {ui.videoLearnLoad}
        </button>
      </form>
      {error ? (
        <p className="mt-3 text-center text-sm text-rose-700">{error}</p>
      ) : null}
    </div>
  );
}
