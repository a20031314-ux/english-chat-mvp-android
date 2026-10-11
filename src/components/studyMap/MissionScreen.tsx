"use client";

import { useEffect, useRef, useState } from "react";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { TTSButton } from "@/components/TTSButton";
import type { UICopy } from "@/lib/copy";
import type { MapTopic, StudyMap } from "@/lib/curriculum/map";
import {
  missionProgress,
  nextMission,
  topicCounts,
  type Mission,
  type MissionCheck,
  type MissionResult,
  type TopicMissions,
} from "@/lib/curriculum/missions";
import {
  checkMission,
  fetchMissions,
  markMissionSeen,
  type DueItem,
  type MissionError,
} from "@/lib/studyMapClient";
import { learningLanguageTextDir } from "@/lib/learningLanguages";

/**
 * Tasks done one at a time — a topic's new ones, or learned ones to produce
 * again from memory (review).
 *
 * The task says what to do, never what to say. The learner writes it; it is
 * checked and comes back done, close (with the corrected sentence) or not yet
 * (with a nudge). Hints open one at a time — a direction, the start of a
 * sentence, then an example answer — so the answer is the last thing offered,
 * not the first. Opening the answer is recorded as "seen", which is a mark and
 * not progress. Done unaided is what makes a phrase mastered (missions.ts),
 * and the screen says when that happens. Each try is a sent chat.
 */

type Attempt = { text: string; check: MissionCheck; moved?: "mastered" | "slipped" };

function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in values ? String(values[key]) : whole,
  );
}

export function MissionScreen({
  ui,
  map,
  topic,
  review,
  targetLanguage,
  isPremium,
  onClose,
}: {
  ui: UICopy;
  map: StudyMap;
  /** Practise this topic's tasks not yet done. */
  topic?: MapTopic;
  /** Or produce these learned ones again from memory. */
  review?: DueItem[];
  targetLanguage: string;
  isPremium: boolean;
  /** Closed; the map reads its progress again. */
  onClose: () => void;
}) {
  const reviewing = Boolean(review);
  const [state, setState] = useState<TopicMissions | null>(null);
  const [loadError, setLoadError] = useState<MissionError | null>(null);
  const [loadTry, setLoadTry] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [masteredInReview, setMasteredInReview] = useState(0);
  const [practiceCurrent, setPracticeCurrent] = useState<Mission | null>(null);
  const [hints, setHints] = useState(0);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [draft, setDraft] = useState("");
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<MissionError | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const dir = learningLanguageTextDir(targetLanguage);

  useEffect(() => {
    if (!topic) return;
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
        setPracticeCurrent(nextMission(result.topic));
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

  const reviewItem = review?.[reviewIndex] ?? null;
  const current: Mission | null = reviewing ? (reviewItem?.mission ?? null) : practiceCurrent;
  const currentTopicId = reviewing ? (reviewItem?.topicId ?? "") : (topic?.id ?? "");
  const title = reviewing ? ui.reviewTitle : (topic?.title ?? "");

  const last = attempts[attempts.length - 1];
  const doneNow = Boolean(last && last.check.verdict !== "miss");
  const progress = reviewing
    ? { done: reviewIndex, total: review?.length ?? 0 }
    : missionProgress(state);
  const finished = reviewing ? reviewItem === null : state !== null && practiceCurrent === null;
  const position = reviewing
    ? reviewIndex + 1
    : (state?.missions.findIndex((m) => m.id === current?.id) ?? 0) + 1;

  const submit = async () => {
    const text = draft.trim();
    if (!text || !current || checking) return;
    setChecking(true);
    setCheckError(null);
    const result = await checkMission({
      language: targetLanguage,
      mapId: map.id,
      topicId: currentTopicId,
      missionId: current.id,
      answer: text,
      hints,
      tries: attempts.length + 1,
      isPremium,
      mode: reviewing ? "review" : "mission",
    });
    setChecking(false);
    if (!result.ok) {
      setCheckError(result.error);
      return;
    }
    const before: MissionResult | undefined = state?.results[current.id];
    const now: MissionResult | undefined = result.results?.[current.id];
    const moved: Attempt["moved"] =
      !before?.mastered && now?.mastered ? "mastered" : before?.mastered && !now?.mastered ? "slipped" : undefined;
    if (moved === "mastered" && reviewing) setMasteredInReview((n) => n + 1);
    setDraft("");
    setAttempts((list) => [...list, { text, check: result.check, moved }]);
    if (result.results && state) setState({ ...state, results: result.results });
  };

  const goNext = () => {
    setAttempts([]);
    setHints(0);
    setCheckError(null);
    if (reviewing) setReviewIndex((n) => n + 1);
    else if (state) setPracticeCurrent(nextMission(state));
  };

  const openHint = () => {
    const next = Math.min(3, hints + 1);
    setHints(next);
    if (next === 3 && current) {
      markMissionSeen({
        language: targetLanguage,
        mapId: map.id,
        topicId: currentTopicId,
        missionId: current.id,
        isPremium,
      });
    }
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

  const counts = topicCounts(state);
  const hintLabel = hints === 0 ? ui.missionHint : hints === 1 ? ui.missionHintMore : ui.missionShowAnswer;

  return (
    <FullScreenLayer>
      <header className="flex shrink-0 items-center gap-3 border-b border-white/10 px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top,0px))]">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-slate-500">
            {reviewing ? reviewItem?.topicTitle ?? "" : topic?.id} ·{" "}
            {progress.total ? fill(ui.missionProgress, progress) : ""}
          </p>
          <h2 className="truncate text-[15px] font-semibold text-white">{title}</h2>
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

      {progress.total ? (
        <div className="h-1 shrink-0 bg-white/5">
          <div
            className="h-full bg-emerald-400/70 transition-[width]"
            style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }}
          />
        </div>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto flex max-w-xl flex-col gap-3">
          {!reviewing && !state && !loadError ? (
            <p className="text-[13px] text-slate-400">{ui.missionLoading}</p>
          ) : null}
          {reviewing && reviewIndex === 0 && attempts.length === 0 && reviewItem ? (
            <p className="text-[13px] leading-relaxed text-slate-400">{ui.reviewIntro}</p>
          ) : null}
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
              <p className="text-[15px] font-semibold text-emerald-100">
                {reviewing ? (review?.length ? ui.reviewTitle : ui.reviewEmpty) : ui.missionDoneTitle}
              </p>
              <p className="mt-1 text-[13px] text-slate-300">
                {reviewing
                  ? review?.length
                    ? `${ui.itemMasteredNow} · ${masteredInReview}/${review.length}`
                    : ""
                  : fill(ui.mapItemsSummary, counts)}
              </p>
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
                  {ui.missionTask} {position}/{progress.total}
                </p>
                {current.focus ? (
                  <p className="mt-1 inline-block rounded-full border border-rose-300/40 bg-rose-300/10 px-2 py-0.5 text-[11px] text-rose-100">
                    {ui.missionWeakLabel.replace("{focus}", current.focus)}
                  </p>
                ) : null}
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
                    {attempt.moved ? (
                      <p
                        className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[12px] font-medium ${
                          attempt.moved === "mastered"
                            ? "bg-emerald-400/15 text-emerald-200"
                            : "bg-amber-300/10 text-amber-100"
                        }`}
                      >
                        {attempt.moved === "mastered" ? ui.itemMasteredNow : ui.itemSlipped}
                      </p>
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
                onClick={openHint}
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
