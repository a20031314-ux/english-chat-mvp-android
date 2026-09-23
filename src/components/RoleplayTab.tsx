"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { RoleplayPast } from "@/components/RoleplayPast";
import { RoleplayScreen } from "@/components/RoleplayScreen";
import type { LearningLanguageCode } from "@/lib/learningLanguages";
import { scenariosForLanguage } from "@/lib/roleplay/catalog";
import {
  readSaved,
  resumableFor,
  upsertSaved,
  writeSaved,
  type SavedConversation,
} from "@/lib/roleplay/saved";
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
 * With one scene there is no list: a catalogue built for eight and holding a
 * single card reads as a screen something was removed from. It becomes a door —
 * a line about what happens, and one button. The list returns by itself the day
 * there is more than one thing to choose between.
 *
 * The door is still a button rather than the tab itself. Opening the scene is
 * what opens the microphone, and doing that the moment someone taps the tab
 * would ask for a permission and start recording before they meant to begin.
 *
 * This is also where conversations are kept. The screen says what there is to
 * write down and this writes it, because the list outlives any one of them: a
 * conversation put down halfway is offered back at the door, and the ones that
 * ended are a list underneath it. Before this, closing the scene was the same
 * as losing it, and the only way to end one that let the character say goodbye
 * was to say goodbye out loud.
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
 */
/** Never fires: whether there is storage to read is fixed per environment. */
const subscribe = () => () => {};

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
  const [resuming, setResuming] = useState<SavedConversation | null>(null);
  const [reading, setReading] = useState<SavedConversation | null>(null);
  const [written, setWritten] = useState<SavedConversation[] | null>(null);
  const scenarios = scenariosForLanguage(targetLanguage);

  const only = scenarios.length === 1 ? scenarios[0] : null;

  // False while rendering on the server and through hydration, true after —
  // the same shape FullScreenLayer uses, and for the same reason: there is no
  // storage to read on the server, and reading it in an effect would be a state
  // write in an effect or a hydration mismatch, depending which way it is done.
  const onClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  // Read once, when there is something to read from. Nothing else writes here,
  // so what this holds after the first write is the whole of it.
  const stored = useMemo(
    () => (onClient ? readSaved(globalThis.localStorage) : []),
    [onClient],
  );
  const saved = written ?? stored;

  const keep = useCallback(
    (conversation: SavedConversation) => {
      setWritten((current) => {
        const next = upsertSaved(current ?? stored, conversation);
        writeSaved(globalThis.localStorage, next);
        return next;
      });
    },
    [stored],
  );

  const open = (scenarioId: string, carryOn: SavedConversation | null) => {
    setResuming(carryOn);
    setPlaying(scenarioId);
  };

  const carryOn = only ? resumableFor(saved, only.id) : null;
  // Everything except what the door is already offering to carry on with.
  // Filtering to finished ones instead would hide a conversation that was put
  // down and then had a newer one started over it: not offered, not listed,
  // and gone as far as anyone could tell.
  const offered = new Set(
    scenarios.map((scenario) => resumableFor(saved, scenario.id)?.id).filter(Boolean),
  );
  const past = saved.filter(
    (row) => row.language === targetLanguage && !offered.has(row.id),
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* One scene is not a list of one. A catalogue laid out for eight and
          holding a single card reads as a screen something was taken off,
          which is exactly what happened and exactly what the learner should
          not be shown. So while there is one thing to do, this is the door to
          it; the list comes back on its own when there is a choice to make. */}
      {only ? (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
          <p className="text-[13px] leading-relaxed text-neutral-400">
            {ui.roleplayIntro}
          </p>
          {/* Carrying one on comes first when there is one to carry on: it is
              the thing they left in the middle, and starting over would throw
              it away without saying so. */}
          {carryOn ? (
            <button
              type="button"
              onClick={() => open(only.id, carryOn)}
              className="w-full max-w-xs rounded-2xl bg-white/15 px-6 py-4 text-[15px] font-medium text-neutral-100 transition hover:bg-white/20"
            >
              {ui.roleplayResume}
              <span className="mt-1 block truncate text-[12px] font-normal text-neutral-400">
                {carryOn.title}
              </span>
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => open(only.id, null)}
            className={
              carryOn
                ? "w-full max-w-xs rounded-2xl border border-white/15 px-6 py-3 text-[14px] text-neutral-300 transition hover:bg-white/10"
                : "w-full max-w-xs rounded-2xl bg-white/15 px-6 py-4 text-[15px] font-medium text-neutral-100 transition hover:bg-white/20"
            }
          >
            {ui.roleplayStart}
          </button>
        </div>
      ) : (
        <>
          <p className="shrink-0 px-4 pt-3 text-[12px] text-neutral-500">
            {ui.roleplayIntro}
          </p>
          <ul className="min-h-0 flex-1 overflow-y-auto p-3">
            {scenarios.map((scenario) => (
              <li key={scenario.id} className="mb-2">
                <button
                  type="button"
                  onClick={() => open(scenario.id, resumableFor(saved, scenario.id))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-left transition hover:bg-white/10"
                >
                  <span className="block text-[14px] text-neutral-100">
                    {scenario.title}
                  </span>
                  <span className="mt-0.5 block text-[12px] text-neutral-500">
                    {resumableFor(saved, scenario.id)
                      ? ui.roleplayResume
                      : scenario.tutorRole}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* The ones that ended. Kept out of the way of the door — this is for
          reading afterwards, not for choosing what to do now — and absent
          entirely until there is something in it, so the screen does not carry
          an empty heading around. */}
      {past.length > 0 ? (
        <section className="shrink-0 border-t border-white/10 px-4 py-3">
          <h3 className="text-[12px] font-medium text-neutral-400">{ui.roleplayPast}</h3>
          <ul className="mt-2 max-h-40 overflow-y-auto">
            {past.map((row) => (
              <li key={row.id}>
                <button
                  type="button"
                  onClick={() => setReading(row)}
                  className="w-full rounded-lg px-1 py-2 text-left transition hover:bg-white/5"
                >
                  <span className="block truncate text-[13px] text-neutral-200">
                    {row.title}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-neutral-500">
                    {new Date(row.startedAt).toLocaleDateString()}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* RoleplayScreen carries its own portalled layer, so it is rendered
          bare here rather than wrapped in a second one. */}
      {playing ? (
        <RoleplayScreen
          scenarioId={playing}
          nativeLanguage={nativeLanguage}
          ui={ui}
          resume={resuming}
          onSaved={keep}
          onClose={() => {
            setPlaying(null);
            setResuming(null);
          }}
        />
      ) : null}

      {reading ? (
        <RoleplayPast saved={reading} ui={ui} onClose={() => setReading(null)} />
      ) : null}
    </div>
  );
}

/** Whether this language has anything to practise, so an empty tab can be hidden. */
export function hasRoleplay(targetLanguage: LearningLanguageCode): boolean {
  return scenariosForLanguage(targetLanguage).length > 0;
}
