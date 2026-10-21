"use client";

/**
 * A look at the update notice without being out of date.
 *
 * The notice only appears when the server says this build has been left behind,
 * which on a developer's machine it never is. This renders the real
 * `UpdateNotice` at each level by feeding it what a response would have said,
 * so the bar and the screen behind it can be looked at.
 *
 * Dev-only: reachable at /dev/update-notice in `next dev`. It stays out of the
 * APK because `scripts/build-capacitor.mjs` moves this whole folder aside for
 * the static export.
 */

import { useState } from "react";
import type { StoreUpdate } from "@/lib/appUpdate";
import { UpdateNotice } from "@/components/UpdateNotice";
import { noteUpdateLevel } from "@/lib/appUpdate";
import { copy, isLocale, type Locale } from "@/lib/copy";

/** Stands in for a response carrying the header the server sets. */
function saying(level: string) {
  return { headers: { get: (name: string) => (name === "x-app-update" ? level : null) } };
}

/** Play가 "versionCode 80(2.66)이 있어요"라고 답한 것처럼, 2.65 앱에서. */
const PLAY_SAYS: StoreUpdate = { available: true, code: 80, immediate: false };

export default function UpdateNoticePreview() {
  const [shown, setShown] = useState(0);
  const [play, setPlay] = useState(false);
  const [locale, setLocale] = useState<Locale>("ko");
  return (
    <main className="min-h-screen bg-[#050505] p-4 text-neutral-200">
      <h1 className="text-sm font-semibold text-white">/dev/update-notice</h1>
      <p className="mt-1 text-[12px] text-neutral-500">
        진짜 컴포넌트, 헤더만 흉내. 단계는 한 번 올라가면 내려오지 않으니
        required를 본 뒤에는 새로고침하세요.
      </p>
      <div className="mt-3 flex gap-2">
        {["available", "required"].map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => {
              noteUpdateLevel(saying(level));
              setShown((n) => n + 1);
            }}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-[12px] hover:bg-white/10"
          >
            {level}
          </button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setPlay(true);
            setShown((n) => n + 1);
          }}
          className="rounded-lg border border-white/15 px-3 py-1.5 text-[12px] hover:bg-white/10"
        >
          Play: 2.66(80) 있음, 앱 2.65
        </button>
        <select
          value={locale}
          onChange={(event) => isLocale(event.target.value) && setLocale(event.target.value)}
          className="rounded-lg border border-white/15 bg-transparent px-2 text-[12px]"
        >
          {Object.keys(copy).map((code) => (
            <option key={code} value={code}>{code}</option>
          ))}
        </select>
      </div>
      <div className="mt-4 max-w-md overflow-hidden rounded-2xl border border-white/10">
        <UpdateNotice
          key={`${shown}-${locale}`}
          ui={copy[locale]}
          locale={locale}
          preview={play ? PLAY_SAYS : undefined}
          from={play ? "2.65" : undefined}
        />
      </div>
    </main>
  );
}
