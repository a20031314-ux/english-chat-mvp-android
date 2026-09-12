"use client";

import { useEffect, useState } from "react";
import {
  noteUpdateLevel,
  openStoreListing,
  updateLevel,
  watchUpdateLevel,
} from "@/lib/appUpdate";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { UpdateLevel } from "@/lib/appVersion";
import type { UICopy } from "@/lib/copy";

/**
 * Telling someone their build has been left behind.
 *
 * A bar when there is a newer build, and a screen they cannot get past when the
 * one they have no longer works against the server. Both say the same thing;
 * only the way out differs.
 *
 * This is the app's only voice. Testers come from a reciprocal-testing service
 * with no channel back to them, so there is no mail to send and no notice to
 * post: whatever has to be said has to be said here.
 */
export function UpdateNotice({ ui }: { ui: UICopy }) {
  const [level, setLevel] = useState<UpdateLevel>(() => updateLevel());

  useEffect(() => watchUpdateLevel(setLevel), []);

  // One request at start, so the answer is there before anything else has
  // happened to ask for it. Every other response updates it for free.
  useEffect(() => {
    void fetch(apiUrl("/api/entitlement"), { headers: entitlementHeaders() })
      .then(noteUpdateLevel)
      .catch(() => {
        // Offline says nothing about the build; the level stays as it was.
      });
  }, []);

  if (level === "none") return null;

  if (level === "required") {
    return (
      <div className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-4 bg-[#050505] p-6 text-center">
        <p className="text-[15px] leading-relaxed text-neutral-100">
          {ui.updateRequired}
        </p>
        <button
          type="button"
          onClick={openStoreListing}
          className="rounded-xl bg-white/15 px-5 py-3 text-sm text-neutral-100 hover:bg-white/20"
        >
          {ui.updateAction}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={openStoreListing}
      className="flex w-full shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-white/10 px-4 py-2 text-left text-[12px] text-neutral-200"
    >
      <span>{ui.updateAvailable}</span>
      <span className="shrink-0 rounded-full border border-white/25 px-2 py-0.5 text-[11px]">
        {ui.updateAction}
      </span>
    </button>
  );
}
