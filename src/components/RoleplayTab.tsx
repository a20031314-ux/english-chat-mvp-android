"use client";

import { useState } from "react";
import { RoleplayScreen } from "@/components/RoleplayScreen";
import type { LearningLanguageCode } from "@/lib/learningLanguages";
import { scenariosForLanguage } from "@/lib/roleplay/catalog";
import type { UICopy } from "@/lib/copy";

/**
 * The scenes available to practise, and the door into one.
 *
 * One scene today, in every language: "Just talk", where there is no errand to
 * finish and the character carries the whole conversation. The scripted errands
 * are written and recorded but not offered, because they exist in English alone
 * and a tab that is a list of scenes in one language and a single conversation
 * in another is two products — see SCRIPTED_SCENES_OFFERED in catalog.ts.
 *
 * A list of one reads as a start button, which is what it is. Opening the scene
 * is what opens the microphone, and doing that the moment someone taps the tab
 * would ask for a permission and start recording before they meant to begin.
 *
 * This is the whole of calling now. The realtime free-talk call used to be a
 * separate feature behind a phone button in the chat tab; "Just talk" is that
 * conversation, carried by the same character who carries the scenes, at a
 * fraction of the price. There is no other door.
 *
 * Help arrives inside the conversation, as the character's next line, never
 * behind a button. What can be asked for afterwards is an explanation: a turn
 * the tutor judged a struggle keeps a button that stops and looks back at it
 * (roleplay/review.ts).
 *
 * Not metered yet. What it costs is the ratio of roleplayTurn to roleplayListen
 * in the meter — how much of the conversation the script is carrying — and
 * that is the number to read before a price is put on it.
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
        />
      ) : null}
    </div>
  );
}

/** Whether this language has anything to practise, so an empty tab can be hidden. */
export function hasRoleplay(targetLanguage: LearningLanguageCode): boolean {
  return scenariosForLanguage(targetLanguage).length > 0;
}
