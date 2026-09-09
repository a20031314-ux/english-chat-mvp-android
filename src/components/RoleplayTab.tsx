"use client";

import { useState } from "react";
import { useBillingUi } from "@/components/BillingScreen";
import { RoleplayScreen } from "@/components/RoleplayScreen";
import { useCall } from "@/contexts/CallContext";
import type { LearningLanguageCode } from "@/lib/learningLanguages";
import { scenariosForLanguage } from "@/lib/roleplay/catalog";
import type { UICopy } from "@/lib/copy";

/**
 * The scenes available to practise, and the door into one.
 *
 * This began as a button in the chat composer, beside the call, because a
 * roleplay is the cheap way to do what a call does. That was the right size for
 * one scenario and the wrong size for a catalog: the thing free users are meant
 * to open daily cannot live behind an icon next to a text box. It is a tab now,
 * and the list is the tab rather than an overlay over one — which also removed
 * a layer, since only the scene itself still needs to cover the screen.
 *
 * When a scenario runs out of script, the live tutor is opened through the same
 * call everything else uses. There is one call in the app and this borrows it
 * rather than starting a second — which is also why the call button stays in
 * chat. A call is an escalation from something, not a destination; promoting it
 * to a tab of its own would invert the ladder this mode is built on.
 *
 * There is no gate here, and that is a decision rather than an omission. A
 * scripted scene costs a transcription per learner turn — a won or two for a
 * whole scenario, against eighty-five for a minute of call — so metering it
 * would cost more in refused practice than it could ever save. Free users get
 * every scenario, without a count.
 *
 * What that does not open is the expensive door. Waking the live tutor goes
 * through `call.start` like every other call, and the trial-count and points
 * gates live in /api/realtime/call, so they apply whoever knocked. Free
 * roleplay is therefore not a way to reach a free call.
 *
 * The number to watch is the ratio of roleplayCorrect to roleplayListen in the
 * meter. Corrections are supposed to be written into the nodes in advance; a
 * generated one means a scenario failed to anticipate its own trouble, and a
 * count climbing towards the listen count means the scripts, not the price,
 * are what needs revisiting.
 */
export function RoleplayTab({
  targetLanguage,
  nativeLanguage,
  ui,
}: {
  targetLanguage: LearningLanguageCode;
  nativeLanguage: LearningLanguageCode;
  ui: UICopy;
}) {
  const call = useCall();
  const { openBilling } = useBillingUi();
  const [playing, setPlaying] = useState<string | null>(null);
  const scenarios = scenariosForLanguage(targetLanguage);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <p className="shrink-0 px-4 pt-3 text-[12px] text-neutral-500">
        {ui.roleplayIntro}
      </p>
      <ul className="min-h-0 flex-1 overflow-y-auto p-3">
        {scenarios.map((scenario) => (
          <li key={scenario.id} className="mb-2">
            <button
              type="button"
              onClick={() => setPlaying(scenario.id)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-left transition hover:bg-white/10"
            >
              <span className="block text-[14px] text-neutral-100">
                {scenario.title}
              </span>
              <span className="mt-0.5 block text-[12px] text-neutral-500">
                {scenario.tutorRole}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* RoleplayScreen carries its own portalled layer, so it is rendered
          bare here rather than wrapped in a second one. */}
      {playing ? (
        <RoleplayScreen
          scenarioId={playing}
          nativeLanguage={nativeLanguage}
          ui={ui}
          onClose={() => setPlaying(null)}
          onWakeTutor={async (opening) => {
            const result = await call.start(
              targetLanguage,
              nativeLanguage,
              opening,
            );
            if (result.ok) return { ok: true };
            // Hung up while it was connecting. They know why; saying it back to
            // them would be the app arguing with a decision they just made.
            if (result.reason === "aborted") return { ok: false, message: null };
            // The trial is spent. The paywall carries the explanation, and it
            // renders above this screen rather than behind it, so the message
            // would only be said twice.
            if (result.reason === "trial") {
              openBilling();
              return { ok: false, message: null };
            }
            // A subscriber whose allowance ran out already bought the thing;
            // selling it to them again would be the wrong answer.
            if (result.reason === "points") {
              return { ok: false, message: ui.chatCallNoPoints };
            }
            return {
              ok: false,
              message:
                result.reason === "mic" ? ui.chatMicDenied : ui.chatCallFailed,
            };
          }}
        />
      ) : null}
    </div>
  );
}

/** Whether this language has anything to practise, so an empty tab can be hidden. */
export function hasRoleplay(targetLanguage: LearningLanguageCode): boolean {
  return scenariosForLanguage(targetLanguage).length > 0;
}
