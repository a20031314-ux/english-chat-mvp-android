"use client";

import { useEffect, useRef, useState } from "react";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { TTSButton } from "@/components/TTSButton";
import type { UICopy } from "@/lib/copy";
import type { MapTopic, StudyMap, TopicStatus } from "@/lib/curriculum/map";
import {
  missionProgress,
  nextMission,
  type Mission,
  type MissionCheck,
  type TopicMissions,
} from "@/lib/curriculum/missions";
import { checkMission, fetchMissions, type MissionError } from "@/lib/studyMapClient";
import { learningLanguageTextDir } from "@/lib/learningLanguages";

/**
 * A topic practised one task at a time.
 *
 * The task says what to do, never what to say. The learner writes it; it is
 * checked and comes back done, close (with the corrected sentence) or not yet
 * (with a nudge). Hints open one at a time — a direction, the start of a
 * sentence, then an example answer — so the answer is the last thing offered,
 * not the first. Each try is a sent chat and counts as one.
 */

type Attempt = { text: string; check: MissionCheck };

function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in values ? String(values[key]) : whole,
  );
}

export function MissionScreen({
  ui,
  map,
  topic,
  targetLanguage,
  isPremium,
  onProgress,
  onClose,
}: {
  ui: UICopy;
  map: StudyMap;
  topic: MapTopic;
  targetLanguage: string;
  isPremium: boolean;
  /** Missions done and the topic's status, as the server now has them. */
  onProgress: (summary: { done: number; total: number }, status?: TopicStatus) => void;
  onClose: () => void;
}) {
  const [state, setState] = useState<TopicMissions | null>(null);
  const [loadError, setLoadError] = useState<MissionError | null>(null);
  const [loadTry, setLoadTry] = useState(0);
  const [current, setCurrent] = useState<Mission | null>(null);
  const [hints, setHints] = useState(0);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [draft, setDraft] = useState("");
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<MissionError | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const dir = learningLanguageTextDir(targetLanguage);

  useEffect(() => {
    let cancelled = false;
    void fetchMissions({ language: targetLanguage, mapId: map.id, topicId: topic.id, isPremium }).then(
      (result) => {
        if (cancelled) return;
        if (!result.ok) {
          setLoadError(result.error);
          return;
        }
        setLoadError(null);
        setState(result.topic);
        setCurrent(nextMission(result.topic));
        onProgress(missionProgress(result.topic));
      },
    );
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadTry]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [attempts.length, hints, checking]);

  const last = attempts[attempts.length - 1];
  const doneNow = Boolean(last && last.check.verdict !== "miss");
  const progress = missionProgress(state);
  const finished = state !== null && current === null;

  const submit = async () => {
    const text = draft.trim();
    if (!text || !current || checking) return;
    setChecking(true);
    setCheckError(null);
    const result = await checkMission({
      language: targetLanguage,
      mapId: map.id,
      topicId: topic.id,
      missionId: current.id,
      answer: text,
      hints,
      tries: attempts.length + 1,
      isPremium,
    });
    setChecking(false);
    if (!result.ok) {
      setCheckError(result.error);
      return;
    }
    setDraft("");
    setAttempts((list) => [...list, { text, check: result.check }]);
    if (result.results && state) {
      const next = { ...state, results: result.results };
      setState(next);
      onProgress(missionProgress(next), result.status);
    }
  };

  const goNext = () => {
    if (!state) return;
    setAttempts([]);
    setHints(0);
    setCheckError(null);
    setCurrent(nextMission(state));
  };

  const retry = () => {
    setDraft("");
    setCheckError(null);
    // Another go is practice; the first result already counts.
    document.getElementById("mission-answer")?.focus();
  };

  const errorText = (error: MissionError, forLoad: boolean) =>
    error === "limit"
      ? ui.dailyLimitReached
      : error === "changed"
        ? ui.missionMapChanged
        : forLoad
          ? ui.missionFailed
          : ui.missionCheckFailed;

  const clean = state ? Object.values(state.results).filter((r) => r.hints === 0).length : 0;
  const hinted = state ? Object.values(state.results).filter((r) => r.hints > 0).length : 0;
  const hintLabel = hints === 0 ? ui.missionHint : hints === 1 ? ui.missionHintMore : ui.missionShowAnswer;

  return (
    <FullScreenLayer>
      <header className="flex shrink-0 items-center gap-3 border-b border-white/10 px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top,0px))]">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-slate-500">
            {topic.id} · {state ? fill(ui.missionProgress, progress) : ""}
          </p>
          <h2 className="truncate text-[15px] font-semibold text-white">{topic.title}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={ui.billingClose}
          className="shrink-0 rounded-lg px-2 py-1 text-sm text-slate-400 hover:bg-white/10"
        >
          ✕
        </button>
      </header>

      {state ? (
        <div className="h-1 shrink-0 bg-white/5">
          <div
            className="h-full bg-emerald-400/70 transition-[width]"
            style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }}
          />
        </div>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto flex max-w-xl flex-col gap-3">
          {!state && !loadError ? <p className="text-[13px] text-slate-400">{ui.missionLoading}</p> : null}
          {loadError ? (
            <button
              type="button"
              onClick={() => {
                setLoadError(null);
                setLoadTry((n) => n + 1);
              }}
              className="rounded-xl border border-white/10 px-3 py-3 text-left text-[13px] text-slate-300"
            >
              {errorText(loadError, true)}
            </button>
          ) : null}

          {finished ? (
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-4">
              <p className="text-[15px] font-semibold text-emerald-100">{ui.missionDoneTitle}</p>
              <p className="mt-1 text-[13px] text-slate-300">{fill(ui.missionDoneBody, { clean, hinted })}</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 rounded-lg bg-[#e8e8e4] px-3 py-1.5 text-[13px] font-medium text-neutral-900"
              >
                {ui.missionBackToMap}
              </button>
            </div>
          ) : null}

          {current ? (
            <>
              <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-4">
                <p className="text-[11px] font-semibold tracking-wide text-slate-500">
                  {ui.missionTask} {progress.done + 1}/{progress.total}
                </p>
                <p className="mt-1 text-[15px] leading-relaxed text-slate-100">{current.task}</p>
              </div>

              {hints > 0 ? (
                <ol className="flex flex-col gap-1.5">
                  <li className="rounded-xl bg-white/[0.03] px-3 py-2 text-[13px] text-slate-300">
                    {ui.missionHint} 1 · {current.hints[0]}
                  </li>
                  {hints > 1 ? (
                    <li className="rounded-xl bg-white/[0.03] px-3 py-2 text-[13px] text-slate-300">
                      {ui.missionHint} 2 · <span dir={dir}>{current.hints[1]}</span>
                    </li>
                  ) : null}
                  {hints > 2 ? (
                    <li className="flex items-start gap-2 rounded-xl bg-white/[0.03] px-3 py-2 text-[13px] text-slate-300">
                      <span className="min-w-0 flex-1">
                        {ui.missionAnswerLabel} · <span dir={dir} className="text-slate-100">{current.answer}</span>
                      </span>
                      <TTSButton text={current.answer} lang={targetLanguage} />
                    </li>
                  ) : null}
                </ol>
              ) : null}

              {attempts.map((attempt, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="ml-auto max-w-[85%] rounded-2xl bg-white/10 px-3 py-2 text-[14px] text-neutral-100" dir={dir}>
                    {attempt.text}
                  </div>
                  <div
                    className={`rounded-2xl border px-3 py-2.5 ${
                      attempt.check.verdict === "pass"
                        ? "border-emerald-400/40 bg-emerald-400/5"
                        : attempt.check.verdict === "close"
                          ? "border-amber-300/40 bg-amber-300/5"
                          : "border-white/15 bg-white/[0.03]"
                    }`}
                  >
                    <p
                      className={`text-[13px] font-semibold ${
                        attempt.check.verdict === "pass"
                          ? "text-emerald-200"
                          : attempt.check.verdict === "close"
                            ? "text-amber-100"
                            : "text-slate-200"
                      }`}
                    >
                      {attempt.check.verdict === "pass"
                        ? ui.missionPass
                        : attempt.check.verdict === "close"
                          ? ui.missionClose
                          : ui.missionMiss}
                    </p>
                    {attempt.check.better ? (
                      <div className="mt-1.5">
                        <p className="text-[11px] text-slate-500">{ui.missionBetter}</p>
                        <div className="mt-0.5 flex items-start gap-2">
                          <p className="min-w-0 flex-1 text-[14px] leading-snug text-emerald-200" dir={dir}>
                            {attempt.check.better}
                          </p>
                          <TTSButton text={attempt.check.better} lang={targetLanguage} />
                        </div>
                      </div>
                    ) : null}
                    {attempt.check.feedback ? (
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-300">{attempt.check.feedback}</p>
                    ) : null}
                  </div>
                  {attempt.check.reply ? (
                    <div className="mr-auto flex max-w-[85%] items-start gap-2 rounded-2xl bg-[#141414] px-3 py-2">
                      <p className="min-w-0 flex-1 text-[14px] leading-snug text-neutral-100" dir={dir}>
                        {attempt.check.reply}
                      </p>
                      <TTSButton text={attempt.check.reply} lang={targetLanguage} />
                    </div>
                  ) : null}
                </div>
              ))}

              {checkError ? (
                <p className="text-[13px] text-amber-200">{errorText(checkError, false)}</p>
              ) : null}
            </>
          ) : null}
          <div ref={endRef} />
        </div>
      </div>

      {current ? (
        <footer className="shrink-0 border-t border-white/10 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] pt-3">
          <div className="mx-auto flex max-w-xl flex-col gap-2">
            {doneNow ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={retry}
                  className="flex-1 rounded-xl border border-white/15 py-2.5 text-[13px] text-slate-200"
                >
                  {ui.missionRetry}
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="flex-1 rounded-xl bg-[#e8e8e4] py-2.5 text-[13px] font-medium text-neutral-900"
                >
                  {ui.missionNext}
                </button>
              </div>
            ) : null}
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => setHints((n) => Math.min(3, n + 1))}
                disabled={hints >= 3 || checking}
                className="shrink-0 rounded-xl border border-white/15 px-3 py-2.5 text-[12px] text-slate-300 disabled:opacity-40"
              >
                {hintLabel}
              </button>
              <textarea
                id="mission-answer"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                    event.preventDefault();
                    void submit();
                  }
                }}
                rows={2}
                dir={dir}
                placeholder={ui.missionPlaceholder}
                className="min-h-[44px] min-w-0 flex-1 resize-none rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-[14px] text-neutral-100 placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => void submit()}
                disabled={!draft.trim() || checking}
                className="shrink-0 rounded-xl bg-[#e8e8e4] px-3 py-2.5 text-[13px] font-medium text-neutral-900 disabled:opacity-40"
              >
                {checking ? ui.missionChecking : ui.missionCheck}
              </button>
            </div>
          </div>
        </footer>
      ) : null}
    </FullScreenLayer>
  );
}
