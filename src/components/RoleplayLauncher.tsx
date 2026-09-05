"use client";

import { useState } from "react";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { RoleplayScreen } from "@/components/RoleplayScreen";
import { useCall } from "@/contexts/CallContext";
import type { LearningLanguageCode } from "@/lib/learningLanguages";
import { scenariosForLanguage } from "@/lib/roleplay/catalog";
import type { UICopy } from "@/lib/copy";

/**
 * Choosing a scene to practise, and the door into one.
 *
 * It sits beside the call button because that is what it is an alternative to.
 * A call is the expensive way to talk and this is the cheap one — the tutor's
 * lines are already recorded — so the two belong next to each other, with the
 * cheap one reachable first.
 *
 * When a scenario runs out of script, the live tutor is opened through the same
 * call everything else uses. There is one call in the app and this borrows it
 * rather than starting a second.
 */
export function RoleplayLauncher({
  targetLanguage,
  nativeLanguage,
  ui,
}: {
  targetLanguage: LearningLanguageCode;
  nativeLanguage: LearningLanguageCode;
  ui: UICopy;
}) {
  const call = useCall();
  const [listOpen, setListOpen] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);
  const scenarios = scenariosForLanguage(targetLanguage);

  // Nothing written for this language yet. A button that opens an empty list is
  // worse than no button.
  if (scenarios.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setListOpen(true)}
        aria-label={ui.roleplayTitle}
        title={ui.roleplayTitle}
        className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-200 transition hover:bg-white/10"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
          <path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm3 5h10v1.5H7V9Zm0 3.5h6V14H7v-1.5Z" />
        </svg>
      </button>

      {listOpen && !playing ? (
        <FullScreenLayer>
          <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
            <h2 className="text-sm font-semibold text-white">{ui.roleplayTitle}</h2>
            <button
              type="button"
              onClick={() => setListOpen(false)}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-[12px] text-neutral-300 hover:bg-white/10"
            >
              {ui.billingClose}
            </button>
          </header>
          <p className="px-4 pt-3 text-[12px] text-neutral-500">
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
        </FullScreenLayer>
      ) : null}

      {playing ? (
        <RoleplayScreen
          scenarioId={playing}
          nativeLanguage={nativeLanguage}
          ui={ui}
          onClose={() => {
            setPlaying(null);
            setListOpen(false);
          }}
          onWakeTutor={(opening) => {
            // Deliberately not awaited: the scenario should stay on screen while
            // the call connects, so the learner can see the line they were stuck
            // on while the tutor is arriving.
            void call.start(targetLanguage, nativeLanguage, opening);
          }}
        />
      ) : null}
    </>
  );
}
