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
import { UpdateNotice } from "@/components/UpdateNotice";
import { noteUpdateLevel } from "@/lib/appUpdate";
import { copy } from "@/lib/copy";

/** Stands in for a response carrying the header the server sets. */
function saying(level: string) {
  return { headers: { get: (name: string) => (name === "x-app-update" ? level : null) } };
}

export default function UpdateNoticePreview() {
  const [shown, setShown] = useState(0);
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
      <div className="mt-4 max-w-md overflow-hidden rounded-2xl border border-white/10">
        <UpdateNotice key={shown} ui={copy.ko} />
      </div>
    </main>
  );
}
