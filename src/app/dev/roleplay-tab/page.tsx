"use client";

/**
 * A look at the call tab in both of its shapes.
 *
 * The tab is a door while one scene is offered and a list when several are, and
 * which one you get depends on a switch in the catalog rather than on anything
 * a developer can see from the outside. This renders the real `RoleplayTab`
 * inside a panel the size of the real one, so the empty-looking case that
 * prompted the change can be compared against what replaced it.
 *
 * Only the tab is real; tapping through into a scene needs a microphone.
 *
 * Dev-only: reachable at /dev/roleplay-tab in `next dev`. It stays out of the
 * APK because `scripts/build-capacitor.mjs` moves this whole folder aside for
 * the static export.
 */

import { RoleplayTab } from "@/components/RoleplayTab";
import { copy } from "@/lib/copy";

export default function RoleplayTabPreview() {
  const ui = copy.ko;
  return (
    <main className="min-h-screen bg-[#050505] p-4 text-neutral-200">
      <h1 className="text-sm font-semibold text-white">/dev/roleplay-tab</h1>
      <p className="mt-1 text-[12px] text-neutral-500">
        진짜 컴포넌트. 시나리오가 하나면 문, 여럿이면 목록입니다.
      </p>
      <div className="mt-4 flex h-[640px] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/10">
        <header className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
          <h2 className="text-base font-semibold text-white">{ui.roleplayTitle}</h2>
        </header>
        <div className="min-h-0 flex-1 overflow-hidden">
          <RoleplayTab targetLanguage="en" nativeLanguage="ko" ui={ui} />
        </div>
      </div>
    </main>
  );
}
