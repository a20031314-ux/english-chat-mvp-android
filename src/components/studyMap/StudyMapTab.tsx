"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { usePremium } from "@/contexts/PremiumContext";
import { onAppIntent, sendAppIntent, takeAppIntent } from "@/lib/appIntents";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { UICopy } from "@/lib/copy";
import {
  connectionsOf,
  listenForPhrases,
  type MapActivity,
  type MapTopic,
  type StudyMap,
  type TopicStatus,
} from "@/lib/curriculum/map";
import {
  drawStudyMap,
  fetchDueItems,
  fetchStudyMap,
  findScenes,
  restorePreviousStudyMap,
  saveTopicStatus,
  type DueItem,
  type MapError,
  type MapRecord,
  type SceneMatch,
} from "@/lib/studyMapClient";
import type { TopicCounts } from "@/lib/curriculum/missions";
import { recommendedNext, recommendedOrder } from "@/lib/curriculum/recommend";
import { normalizeYouTubeWatchUrl } from "@/lib/videoLearning";
import { BodyLayer } from "@/components/FullScreenLayer";
import { MissionScreen } from "@/components/studyMap/MissionScreen";
import { TopicItems, ItemBar } from "@/components/studyMap/TopicItems";
import { LearnerPanel } from "@/components/studyMap/LearnerPanel";
import { LedgerPanel } from "@/components/studyMap/LedgerPanel";
import { NotesPanel } from "@/components/notes/NotesPanel";
import { NextStepCard } from "@/components/NextStepCard";
import { GrowthNetwork } from "@/components/studyMap/GrowthNetwork";
import { FOCUS_IDS, GAP_IDS, USE_IDS, type FocusId, type GapId, type UseId } from "@/lib/learner/selfCheck";
import { scenariosForLanguage } from "@/lib/roleplay/catalog";
import { AccountCard } from "@/components/account/AccountCard";
import { isFeatureOn, readFeatures, readFeaturesOnServer, subscribeFeatures } from "@/lib/features";
import { readEntryDoor } from "@/lib/doors";

const noSubscribe = () => () => {};

/**
 * 학습 지도: a learner's goal drawn as topics in four sectors, in an order,
 * with the reasons they connect — and every topic a door into the tab where it
 * is practised.
 *
 * The map itself is made and kept by the server (api/curriculum, lib/curriculum
 * /map.ts); this screen draws it, keeps the learner's place in it, and sends
 * them off: a chat with the first line already typed, a call, the word list, or
 * — the part that is new — the scene in a video where the topic's expressions
 * are actually said (api/video-index/find).
 */


type Clip = { videoId: string; title: string; durationSeconds?: number };

function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function statusOf(record: MapRecord | null, topicId: string): TopicStatus {
  return record?.status[topicId] ?? "todo";
}


export function StudyMapTab({
  ui,
  locale,
  targetLanguage,
}: {
  ui: UICopy;
  locale: string;
  targetLanguage: string;
}) {
  const { isPremium } = usePremium();
  // 쓸 기능 고르기(lib/features.ts): 노트를 숨기면 My에서 빠진다(통화를 숨기면 NextStepCard가 통화를 권하지 않음).
  // 창구 모드(웹의 창구 주소)는 고르기가 없다.
  const door = useSyncExternalStore(noSubscribe, readEntryDoor, () => null);
  const features = useSyncExternalStore(subscribeFeatures, readFeatures, readFeaturesOnServer);
  const notesOn = Boolean(door) || isFeatureOn(features.off, "notes");
  const [record, setRecord] = useState<MapRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<MapError | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [limit, setLimit] = useState(0);
  const [editing, setEditing] = useState(false);
  const [openTopicId, setOpenTopicId] = useState<string | null>(null);
  const [lastOpenedId, setLastOpenedId] = useState<string | null>(null);
  const [clips, setClips] = useState<Clip[]>([]);
  const [missionTopicId, setMissionTopicId] = useState<string | null>(null);
  const [reviewItems, setReviewItems] = useState<DueItem[] | null>(null);

  // After practice or review the server has moved items along; read it again.
  const reload = useCallback(async () => {
    const result = await fetchStudyMap(targetLanguage, isPremium);
    if (result.ok) setRecord(result.record);
  }, [targetLanguage, isPremium]);

  const startReview = useCallback(async () => {
    const due = await fetchDueItems(targetLanguage, isPremium);
    setReviewItems(due?.items ?? []);
  }, [targetLanguage, isPremium]);

  useEffect(() => {
    let cancelled = false;
    void fetchStudyMap(targetLanguage, isPremium).then((result) => {
      if (cancelled) return;
      setLoading(false);
      if (result.ok) {
        setRecord(result.record);
        setError(null);
      } else {
        setError(result.error);
      }
    });
    void fetch(apiUrl(`/api/video-library?language=${encodeURIComponent(targetLanguage)}`))
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { clips?: Clip[] } | null) => {
        if (!cancelled && Array.isArray(data?.clips)) setClips(data.clips);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [targetLanguage, isPremium]);

  const map = record?.map ?? null;
  const showForm = !loading && (editing || !map);

  const draw = async (goal: string, selfCheck: SelfCheckAnswer | null) => {
    setDrawing(true);
    setError(null);
    const result = await drawStudyMap({
      goal,
      ...(selfCheck ? { selfCheck } : {}),
      targetLanguage,
      interfaceLanguage: locale,
      isPremium,
    });
    setDrawing(false);
    if (!result.ok) {
      setError(result.error);
      setLimit(result.limit ?? 0);
      return;
    }
    setRecord(result.record);
    setEditing(false);
    setOpenTopicId(null);
    setLastOpenedId(null);
  };

  const restore = async () => {
    const restored = await restorePreviousStudyMap(targetLanguage, isPremium);
    if (restored) {
      setRecord({ ...restored, hasPrevious: true });
      setEditing(false);
    }
  };

  const setStatus = useCallback(
    async (topicId: string, status: TopicStatus) => {
      if (!map) return;
      // Shown at once; the server's answer replaces it when it comes.
      setRecord((current) =>
        current ? { ...current, status: { ...current.status, [topicId]: status } } : current,
      );
      const saved = await saveTopicStatus({
        language: targetLanguage,
        mapId: map.id,
        topicId,
        status,
        isPremium,
      });
      if (saved)
        setRecord((current) => ({ ...saved, hasPrevious: current?.hasPrevious, missions: current?.missions }));
    },
    [map, targetLanguage, isPremium],
  );

  // "Try this" in another tab can send a learner to a topic's tasks. This tab
  // mounts only when shown, so that request arrives first: hold it until the
  // map has loaded, then open the topic (appIntents.ts).
  const [askedTopic, setAskedTopic] = useState<string | null>(() => takeAppIntent("openTopic")?.topicId ?? null);
  const openTopic = (topicId: string) => {
    setOpenTopicId(topicId);
    setLastOpenedId(topicId);
    setAskedTopic(null);
  };

  useEffect(
    () =>
      onAppIntent("openTopic", ({ topicId }) => {
        takeAppIntent("openTopic");
        setAskedTopic(topicId);
      }),
    [],
  );
  const sheetTopicId =
    openTopicId ?? (askedTopic && map?.topics.some((topic) => topic.id === askedTopic) ? askedTopic : null);
  const closeSheet = () => {
    setOpenTopicId(null);
    setAskedTopic(null);
  };

  return (
    <div className="tb-panel flex h-full min-h-0 flex-col overflow-hidden rounded-2xl">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <h1 className="text-base font-semibold text-white">{ui.homeTabProfile}</h1>
        {map && !editing ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-[12px] text-neutral-300 hover:bg-white/10"
          >
            {ui.mapNewGoal}
          </button>
        ) : null}
      </header>

      {/* A profile, not a map: what to try next, what has piled up, and the
          goal's map folded underneath for whoever wants it. A learner with no
          map starts from the ticks, with nothing empty above them. */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto mb-4 max-w-2xl">
          <AccountCard ui={ui} locale={locale} />
          {door ? null : (
            <button
              type="button"
              onClick={() => sendAppIntent("openGuide", { manage: true })}
              className="mt-2 flex w-full items-center justify-between rounded-xl border border-line px-4 py-2.5 text-start text-note text-slate-200 hover:bg-white/5"
            >
              <span>{ui.featurePickTitle}</span>
              <span aria-hidden className="text-slate-400 rtl:rotate-180">›</span>
            </button>
          )}
        </div>
        {loading ? (
          <p className="text-sm text-slate-400">{ui.mapLoading}</p>
        ) : showForm ? (
          <>
            <GoalForm
              ui={ui}
              targetLanguage={targetLanguage}
              isPremium={isPremium}
              drawing={drawing}
              error={error}
              limit={limit}
              canCancel={Boolean(map)}
              hasPrevious={Boolean(record?.hasPrevious)}
              onDraw={draw}
              onCancel={() => setEditing(false)}
              onRestore={restore}
            />
            {!map ? (
              <div className="mx-auto mt-6 max-w-md">
                <GrowthNetwork ui={ui} locale={locale} targetLanguage={targetLanguage} isPremium={isPremium} />
                <div className="mt-3">
                  <LedgerPanel ui={ui} locale={locale} targetLanguage={targetLanguage} isPremium={isPremium} />
                </div>
                {notesOn ? (
                  <div className="mt-3">
                    <NotesPanel ui={ui} locale={locale} targetLanguage={targetLanguage} isPremium={isPremium} />
                  </div>
                ) : null}
              </div>
            ) : null}
          </>
        ) : map ? (
          <div className="mx-auto max-w-2xl">
            <div className="mb-3">
              <NextStepCard
                ui={ui}
                locale={locale}
                targetLanguage={targetLanguage}
                canCall={scenariosForLanguage(targetLanguage).length > 0}
                onOpenTopic={openTopic}
                refreshKey={map.id}
              />
            </div>
            <GrowthNetwork
              ui={ui}
              locale={locale}
              targetLanguage={targetLanguage}
              isPremium={isPremium}
              refreshKey={map.id}
              mapSlot={
                <>
                  <div className="px-1">
                    <p className="text-[11px] font-semibold tracking-wide text-slate-400">{ui.profileGoalTitle}</p>
                    <p className="mt-0.5 truncate text-[14px] font-medium text-slate-100">{map.title}</p>
                  </div>
                  <div className="mt-3">
                    <LearnerPanel
                      ui={ui}
                      locale={locale}
                      targetLanguage={targetLanguage}
                      isPremium={isPremium}
                      onRedraw={() => setEditing(true)}
                    />
                  </div>
                  <div className="mt-3">
                    <MapView
                      ui={ui}
                      locale={locale}
                      onRedraw={() => setEditing(true)}
                      map={map}
                      record={record}
                      lastOpenedId={lastOpenedId}
                      onOpenTopic={openTopic}
                      onReview={() => void startReview()}
                    />
                  </div>
                </>
              }
            />
            <div className="mt-3">
              <LedgerPanel ui={ui} locale={locale} targetLanguage={targetLanguage} isPremium={isPremium} />
            </div>
            {notesOn ? (
              <div className="mt-3">
                <NotesPanel ui={ui} locale={locale} targetLanguage={targetLanguage} isPremium={isPremium} />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {map && sheetTopicId ? (
        <TopicSheet
          ui={ui}
          map={map}
          topic={map.topics.find((topic) => topic.id === sheetTopicId) ?? null}
          status={statusOf(record, sheetTopicId)}
          clips={clips}
          targetLanguage={targetLanguage}
          onStatus={(status) => void setStatus(sheetTopicId, status)}
          onOpenTopic={openTopic}
          onClose={closeSheet}
          missions={record?.missions?.[sheetTopicId]}
          onPractise={() => {
            setMissionTopicId(sheetTopicId);
            closeSheet();
          }}
        />
      ) : null}

      {map && missionTopicId ? (() => {
        const topic = map.topics.find((entry) => entry.id === missionTopicId);
        return topic ? (
          <MissionScreen
            ui={ui}
            map={map}
            topic={topic}
            targetLanguage={targetLanguage}
            isPremium={isPremium}
            onClose={() => {
              setMissionTopicId(null);
              void reload();
            }}
          />
        ) : null;
      })() : null}

      {map && reviewItems ? (
        <MissionScreen
          ui={ui}
          map={map}
          review={reviewItems}
          targetLanguage={targetLanguage}
          isPremium={isPremium}
          onClose={() => {
            setReviewItems(null);
            void reload();
          }}
        />
      ) : null}
    </div>
  );
}

type SelfCheckAnswer = { gaps: GapId[]; focus: FocusId[]; use?: UseId };

/**
 * How a map starts: three questions answered by ticking, not a goal to write
 * and a level to pick (learner/selfCheck.ts). Where they feel they fall short,
 * what they want to work on most, and — if they like — where they will use it.
 * Writing a goal is still there, underneath, for whoever wants to.
 */
function GoalForm({
  ui,
  targetLanguage,
  isPremium,
  drawing,
  error,
  limit,
  canCancel,
  hasPrevious,
  onDraw,
  onCancel,
  onRestore,
}: {
  ui: UICopy;
  targetLanguage: string;
  isPremium: boolean;
  drawing: boolean;
  error: MapError | null;
  limit: number;
  canCancel: boolean;
  hasPrevious: boolean;
  onDraw: (goal: string, selfCheck: SelfCheckAnswer | null) => void;
  onCancel: () => void;
  onRestore: () => void;
}) {
  const [gaps, setGaps] = useState<GapId[]>([]);
  const [focus, setFocus] = useState<FocusId[]>([]);
  const [use, setUse] = useState<UseId | null>(null);
  const [goal, setGoal] = useState("");

  // What they ticked last time, shown again when they start a new map.
  useEffect(() => {
    let cancelled = false;
    void fetch(apiUrl(`/api/learner/self-check?lang=${encodeURIComponent(targetLanguage)}`), {
      headers: entitlementHeaders(isPremium),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { selfCheck?: SelfCheckAnswer | null } | null) => {
        const check = data?.selfCheck;
        if (cancelled || !check) return;
        setGaps(check.gaps ?? []);
        setFocus(check.focus ?? []);
        setUse(check.use ?? null);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [targetLanguage, isPremium]);

  const gapLabel: Record<GapId, string> = {
    speaking: ui.selfGapSpeaking,
    accuracy: ui.selfGapAccuracy,
    words: ui.selfGapWords,
    listening: ui.selfGapListening,
    pronunciation: ui.selfGapPronunciation,
    natural: ui.selfGapNatural,
  };
  const focusLabel: Record<FocusId, string> = {
    speaking: ui.selfFocusSpeaking,
    listening: ui.selfFocusListening,
    writing: ui.selfFocusWriting,
    words: ui.selfFocusWords,
  };
  const useLabel: Record<UseId, string> = {
    daily: ui.selfUseDaily,
    travel: ui.selfUseTravel,
    work: ui.selfUseWork,
    video: ui.selfUseVideo,
  };

  const written = goal.replace(/\s+/g, " ").trim();
  const ticked = gaps.length > 0 || focus.length > 0 || use !== null;
  const ready = !drawing && (ticked || written.length >= 2);
  // With nothing written, the map's goal line is what they ticked, in their language.
  const composed = [...(use ? [useLabel[use]] : []), ...gaps.map((g) => gapLabel[g]), ...focus.map((f) => focusLabel[f])]
    .join(" · ")
    .slice(0, 300);

  const toggle = <T extends string>(list: T[], value: T, max = Infinity): T[] =>
    list.includes(value) ? list.filter((entry) => entry !== value) : [...list, value].slice(-max);

  const chip = (selected: boolean) =>
    `rounded-full border px-3 py-1.5 text-[13px] transition ${
      selected ? "border-white/50 bg-white/15 text-white" : "border-white/10 text-slate-300 hover:bg-white/5"
    }`;

  return (
    <form
      className="mx-auto flex max-w-md flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (!ready) return;
        onDraw(written.length >= 2 ? written : composed, ticked ? { gaps, focus, ...(use ? { use } : {}) } : null);
      }}
    >
      <fieldset className="flex flex-col gap-2" disabled={drawing}>
        <legend className="text-[15px] font-semibold text-slate-100">{ui.selfGapsTitle}</legend>
        <div className="mt-1 flex flex-wrap gap-2">
          {GAP_IDS.map((id) => (
            <button key={id} type="button" aria-pressed={gaps.includes(id)} onClick={() => setGaps(toggle(gaps, id))} className={chip(gaps.includes(id))}>
              {gapLabel[id]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2" disabled={drawing}>
        <legend className="text-[15px] font-semibold text-slate-100">{ui.selfFocusTitle}</legend>
        <div className="mt-1 flex flex-wrap gap-2">
          {FOCUS_IDS.map((id) => (
            <button key={id} type="button" aria-pressed={focus.includes(id)} onClick={() => setFocus(toggle(focus, id, 2))} className={chip(focus.includes(id))}>
              {focusLabel[id]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2" disabled={drawing}>
        <legend className="text-[14px] font-medium text-slate-200">{ui.selfUseTitle}</legend>
        <div className="mt-1 flex flex-wrap gap-2">
          {USE_IDS.map((id) => (
            <button key={id} type="button" aria-pressed={use === id} onClick={() => setUse(use === id ? null : id)} className={chip(use === id)}>
              {useLabel[id]}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1.5">
        <span className="text-[12px] text-slate-400">{ui.selfOwnGoal}</span>
        <textarea
          value={goal}
          onChange={(event) => setGoal(event.target.value.slice(0, 300))}
          rows={2}
          placeholder={ui.mapGoalPlaceholder}
          disabled={drawing}
          className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-[14px] leading-relaxed text-slate-100 placeholder:text-slate-500 focus:border-white/30 focus:outline-none"
        />
      </label>

      <button
        type="submit"
        disabled={!ready}
        className="rounded-xl bg-[#e8e8e4] px-4 py-3 text-sm font-medium text-neutral-900 hover:bg-[#f5f5f3] disabled:opacity-40"
      >
        {drawing ? ui.mapDrawing : ui.mapDraw}
      </button>
      {error ? (
        <p className="text-sm text-rose-300">
          {error === "identity"
            ? ui.mapIdentityRequired
            : error === "limit"
              ? ui.mapLimitReached.replace("{limit}", String(limit || ""))
              : ui.mapFailed}
        </p>
      ) : null}
      <div className="flex justify-center gap-4 text-[12px]">
        {canCancel ? (
          <button type="button" onClick={onCancel} className="text-slate-400 underline-offset-4 hover:underline">
            {ui.billingClose}
          </button>
        ) : null}
        {hasPrevious ? (
          <button type="button" onClick={onRestore} className="text-slate-400 underline-offset-4 hover:underline">
            {ui.mapRestore}
          </button>
        ) : null}
      </div>
    </form>
  );
}

const STATUS_DOT: Record<TopicStatus, string> = {
  todo: "bg-white/20",
  doing: "bg-amber-300",
  done: "bg-emerald-400",
};

function MapView({
  ui,
  locale,
  onRedraw,
  map,
  record,
  lastOpenedId,
  onOpenTopic,
  onReview,
}: {
  ui: UICopy;
  locale: string;
  onRedraw: () => void;
  map: StudyMap;
  record: MapRecord | null;
  lastOpenedId: string | null;
  onOpenTopic: (id: string) => void;
  onReview: () => void;
}) {
  const status = record?.status ?? {};
  // The order recommended now: what they keep getting wrong first, then what
  // they started, then the drawn order (curriculum/recommend.ts).
  const recommended = useMemo(
    () => recommendedOrder(map, record?.status ?? {}, record?.missions ?? {}),
    [map, record],
  );
  const placeOf = useMemo(
    () => new Map(recommended.map((row) => [row.topic.id, row])),
    [recommended],
  );
  const ordered = useMemo(() => [...map.topics].sort((a, b) => a.order - b.order), [map]);
  const done = map.topics.filter((topic) => status[topic.id] === "done").length;
  // Where the map's phrases stand, from what the learner has produced.
  const items = Object.values(record?.missions ?? {}).reduce(
    (sum, c) => ({
      mastered: sum.mastered + c.mastered,
      learned: sum.learned + c.learned,
      toLearn: sum.toLearn + c.toLearn,
      due: sum.due + c.due,
    }),
    { mastered: 0, learned: 0, toLearn: 0, due: 0 },
  );
  const anyItems = items.mastered + items.learned + items.toLearn > 0;
  const nextRow = recommendedNext(recommended);
  const next = nextRow?.topic ?? null;
  // After a topic is closed, the ones it connects to stay lit.
  const lit = new Set(
    lastOpenedId ? connectionsOf(map, lastOpenedId).map((entry) => entry.topic.id) : [],
  );

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      {/* A map is written in the language the app was in when it was drawn.
          Switched to another, its topics would read in the old one. */}
      {map.uiLanguage && map.uiLanguage !== locale ? (
        <div className="rounded-xl border border-amber-200/30 bg-amber-200/5 px-3 py-2.5">
          <p className="text-[12px] leading-relaxed text-amber-100">{ui.mapOtherLanguage}</p>
          <button
            type="button"
            onClick={onRedraw}
            className="mt-1.5 text-[12px] font-medium text-amber-50 underline underline-offset-4"
          >
            {ui.mapRedrawHere}
          </button>
        </div>
      ) : null}
      <section>
        <h2 className="text-lg font-semibold text-white">{map.title}</h2>
        <p className="mt-1 text-[12px] text-slate-500">{map.goal}</p>
        {map.summary ? (
          <p className="mt-2 text-[13px] leading-relaxed text-slate-300">{map.summary}</p>
        ) : null}
        <div className="mt-3 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-emerald-400"
              style={{ width: `${map.topics.length ? (done / map.topics.length) * 100 : 0}%` }}
            />
          </div>
          <span className="shrink-0 text-[12px] text-slate-400">
            {ui.mapProgress.replace("{done}", String(done)).replace("{total}", String(map.topics.length))}
          </span>
        </div>
        {anyItems ? (
          <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
            <ItemBar counts={items} />
            <p className="mt-1.5 text-[12px] tabular-nums text-slate-300">
              {ui.mapItemsSummary
                .replace("{mastered}", String(items.mastered))
                .replace("{learned}", String(items.learned))
                .replace("{toLearn}", String(items.toLearn))}
            </p>
            {items.due > 0 ? (
              <button
                type="button"
                onClick={onReview}
                className="mt-2 rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-3 py-1.5 text-[13px] font-medium text-emerald-100"
              >
                {ui.reviewStart.replace("{n}", String(items.due))}
              </button>
            ) : null}
          </div>
        ) : null}
        {next ? (
          <button
            type="button"
            onClick={() => onOpenTopic(next.id)}
            className="mt-3 w-full rounded-xl bg-[#e8e8e4] px-4 py-3 text-left text-sm font-medium text-neutral-900 hover:bg-[#f5f5f3]"
          >
            {ui.mapContinue}
            <span className="ms-2 font-normal text-neutral-600">
              {nextRow?.place}. {next.title}
            </span>
            {nextRow?.picked ? (
              <span className="ms-2 inline-block whitespace-nowrap rounded-full bg-violet-500/15 px-2 py-0.5 text-[11px] font-normal text-violet-700">
                {ui.mapPickedChip.replace("{n}", String(nextRow.picked))}
              </span>
            ) : null}
            {nextRow?.weak ? (
              <span className="ms-2 inline-block whitespace-nowrap rounded-full bg-rose-500/15 px-2 py-0.5 text-[11px] font-normal text-rose-700">
                {ui.mapWeakChip.replace("{n}", String(nextRow.weak))}
              </span>
            ) : null}
          </button>
        ) : null}
      </section>

      <section>
        <p className="text-[11px] font-semibold tracking-wide text-slate-500">{ui.mapOrderTitle}</p>
        <p className="mt-0.5 text-[11px] text-slate-600">{ui.mapOrderAdaptive}</p>
        <ol className="mt-2 flex gap-1.5 overflow-x-auto pb-1">
          {recommended.map(({ topic, place, weak, picked }) => (
            <li key={topic.id} className="shrink-0">
              <button
                type="button"
                onClick={() => onOpenTopic(topic.id)}
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] text-slate-300 hover:bg-white/10 ${
                  picked ? "border-violet-300/40" : weak ? "border-rose-300/40" : "border-white/10"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status[topic.id] ?? "todo"]}`} />
                {place}. {topic.title}
                {picked ? (
                  <span className="whitespace-nowrap text-[11px] text-violet-200">{ui.mapPickedChip.replace("{n}", String(picked))}</span>
                ) : null}
                {weak ? (
                  <span className="whitespace-nowrap text-[11px] text-rose-200">{ui.mapWeakChip.replace("{n}", String(weak))}</span>
                ) : null}
              </button>
            </li>
          ))}
        </ol>
      </section>

      {map.sectors.map((sector) => {
        const topics = ordered.filter((topic) => topic.sector === sector.id);
        if (topics.length === 0) return null;
        return (
          <section key={sector.id}>
            <p className="text-[13px] font-semibold text-slate-100">
              <span className="mr-1.5 text-slate-500">{sector.id}</span>
              {sector.title}
            </p>
            {sector.description ? (
              <p className="mt-0.5 text-[12px] leading-relaxed text-slate-500">{sector.description}</p>
            ) : null}
            <ul className="mt-2 grid grid-cols-2 gap-2">
              {topics.map((topic) => (
                <li key={topic.id}>
                  <button
                    type="button"
                    onClick={() => onOpenTopic(topic.id)}
                    className={`h-full w-full rounded-xl border px-3 py-2.5 text-left transition hover:bg-white/10 ${
                      lit.has(topic.id)
                        ? "border-amber-200/50 bg-amber-200/5"
                        : topic.id === lastOpenedId
                          ? "border-white/40 bg-white/5"
                          : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status[topic.id] ?? "todo"]}`} />
                      {placeOf.get(topic.id)?.place ?? topic.order}
                    </span>
                    {placeOf.get(topic.id)?.picked ? (
                      <span className="me-1 mt-1 inline-block rounded-full bg-violet-300/10 px-1.5 py-0.5 text-[10px] text-violet-200">
                        {ui.mapPickedChip.replace("{n}", String(placeOf.get(topic.id)!.picked))}
                      </span>
                    ) : null}
                    {placeOf.get(topic.id)?.weak ? (
                      <span className="mt-1 inline-block rounded-full bg-rose-300/10 px-1.5 py-0.5 text-[10px] text-rose-200">
                        {ui.mapWeakChip.replace("{n}", String(placeOf.get(topic.id)!.weak))}
                      </span>
                    ) : null}
                    <span className="mt-1 block text-[13px] font-medium leading-snug text-slate-100">
                      {topic.title}
                    </span>
                    {record?.missions?.[topic.id]?.total ? (
                      <span className="mt-2 block">
                        <ItemBar counts={record.missions[topic.id]!} />
                      </span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function TopicSheet({
  ui,
  map,
  topic,
  status,
  clips,
  targetLanguage,
  onStatus,
  onOpenTopic,
  onClose,
  missions,
  onPractise,
}: {
  ui: UICopy;
  map: StudyMap;
  topic: MapTopic | null;
  status: TopicStatus;
  clips: Clip[];
  targetLanguage: string;
  onStatus: (status: TopicStatus) => void;
  onOpenTopic: (id: string) => void;
  onClose: () => void;
  missions?: TopicCounts;
  onPractise: () => void;
}) {
  if (!topic) return null;
  const sector = map.sectors.find((entry) => entry.id === topic.sector);
  const connections = connectionsOf(map, topic.id);

  // Going to practise counts as starting the topic.
  const startPractice = () => {
    if (status === "todo") onStatus("doing");
  };

  return (
    <BodyLayer>
    <div className="fixed inset-0 z-[80] flex flex-col justify-end bg-black/60 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))] sm:items-center sm:justify-center">
      <button type="button" className="absolute inset-0 cursor-default" aria-label={ui.billingClose} onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="map-topic-title"
        className="relative z-10 max-h-full w-full max-w-md overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-[#0e0e0e] p-4"
      >
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-slate-500">
              {sector?.title}
            </p>
            <h3 id="map-topic-title" className="mt-0.5 text-base font-semibold text-white">
              {topic.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={ui.billingClose}
            className="shrink-0 rounded-lg px-2 py-1 text-sm text-slate-400 hover:bg-white/10"
          >
            ✕
          </button>
        </div>
        {topic.summary ? (
          <p className="mt-2 text-[13px] leading-relaxed text-slate-300">{topic.summary}</p>
        ) : null}

        <div className="mt-3 flex gap-1.5">
          {(
            [
              ["doing", ui.mapMarkDoing],
              ["done", ui.mapMarkDone],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => onStatus(status === value ? "todo" : value)}
              aria-pressed={status === value}
              className={`rounded-full border px-3 py-1 text-[12px] ${
                status === value
                  ? value === "done"
                    ? "border-emerald-400/60 bg-emerald-400/15 text-emerald-200"
                    : "border-amber-300/60 bg-amber-300/10 text-amber-100"
                  : "border-white/15 text-slate-400 hover:bg-white/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* The way in that asks the learner to produce something: a task at a
            time, checked, with the answer held back until they ask for it. */}
        <button
          type="button"
          onClick={onPractise}
          className="mt-4 w-full rounded-xl bg-[#e8e8e4] px-4 py-3 text-left text-neutral-900 hover:bg-white"
        >
          <span className="flex items-center justify-between gap-2">
            <span className="text-[14px] font-semibold">{ui.missionStart}</span>
            {missions && missions.total > 0 ? (
              <span className="text-[12px] tabular-nums text-neutral-600">
                {ui.missionProgress.replace("{done}", String(missions.done)).replace("{total}", String(missions.total))}
              </span>
            ) : null}
          </span>
        </button>

        {missions && missions.total > 0 ? (
          <TopicItems
            ui={ui}
            mapId={map.id}
            topicId={topic.id}
            targetLanguage={targetLanguage}
          />
        ) : null}

        <p className="mt-5 text-[11px] font-semibold tracking-wide text-slate-500">{ui.mapPractice}</p>
        <ul className="mt-2 space-y-2">
          {topic.activities.map((activity, index) => (
            <li key={`${activity.tab}-${index}`}>
              <ActivityCard
                ui={ui}
                topic={topic}
                activity={activity}
                clips={clips}
                targetLanguage={targetLanguage}
                onGo={() => {
                  startPractice();
                  onClose();
                }}
              />
            </li>
          ))}
        </ul>

        {connections.length ? (
          <>
            <p className="mt-5 text-[11px] font-semibold tracking-wide text-slate-500">
              {ui.mapConnections}
            </p>
            <ul className="mt-2 space-y-1.5">
              {connections.map(({ topic: other, why }) => (
                <li key={other.id}>
                  <button
                    type="button"
                    onClick={() => onOpenTopic(other.id)}
                    className="w-full rounded-lg bg-white/5 px-3 py-2 text-left hover:bg-white/10"
                  >
                    <span className="text-[13px] font-medium text-slate-100">
                      {other.title}
                    </span>
                    <span className="mt-0.5 block text-[12px] leading-relaxed text-slate-400">{why}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </div>
    </BodyLayer>
  );
}

function ActivityCard({
  ui,
  topic,
  activity,
  clips,
  targetLanguage,
  onGo,
}: {
  ui: UICopy;
  topic: MapTopic;
  activity: MapActivity;
  clips: Clip[];
  targetLanguage: string;
  onGo: () => void;
}) {
  const tabLabel: Record<MapActivity["tab"], string> = {
    chat: ui.homeTabChat,
    roleplay: ui.homeTabCall,
    video: ui.homeTabVideo,
    vocab: ui.homeTabVocab,
  };

  // Chat and calls start a conversation that already knows the topic: the
  // tutor speaks first in it (learner/practice.ts). The word list has nothing
  // to start, so it only opens.
  const go = () => {
    if (activity.tab === "chat" || activity.tab === "roleplay") {
      sendAppIntent("practice", {
        tab: activity.tab,
        goal: { situation: `${topic.title}. ${activity.task}` },
        title: topic.title,
      });
    } else {
      sendAppIntent("openTab", { tab: activity.tab });
    }
    onGo();
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-[11px] font-semibold text-slate-500">{tabLabel[activity.tab]}</p>
      <p className="mt-1 text-[13px] leading-relaxed text-slate-200">{activity.task}</p>
      {activity.tab === "chat" && activity.starter ? (
        <p dir="auto" className="mt-1.5 rounded-lg bg-black/30 px-2.5 py-1.5 text-start text-[13px] text-slate-100">
          {activity.starter}
        </p>
      ) : null}
      {activity.tab === "video" ? (
        <VideoActivity ui={ui} activity={activity} clips={clips} targetLanguage={targetLanguage} onGo={onGo} />
      ) : (
        <button
          type="button"
          onClick={go}
          className="mt-2 rounded-lg bg-white/15 px-3 py-1.5 text-[12px] text-slate-100 hover:bg-white/20"
        >
          {ui.mapGoTo.replace("{tab}", tabLabel[activity.tab])}
        </button>
      )}
    </div>
  );
}

function VideoActivity({
  ui,
  activity,
  clips,
  targetLanguage,
  onGo,
}: {
  ui: UICopy;
  activity: MapActivity;
  clips: Clip[];
  targetLanguage: string;
  onGo: () => void;
}) {
  const phrases = listenForPhrases(activity);
  const clip = activity.videoId ? clips.find((entry) => entry.videoId === activity.videoId) : undefined;
  const [scenes, setScenes] = useState<SceneMatch[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [failed, setFailed] = useState(false);

  const openVideo = (videoId: string, startSeconds?: number, durationSeconds?: number) => {
    sendAppIntent("openTab", { tab: "video" });
    sendAppIntent("openVideo", {
      url: normalizeYouTubeWatchUrl(videoId),
      ...(startSeconds != null ? { startSeconds: Math.max(0, startSeconds - 1) } : {}),
      ...(durationSeconds ? { durationSeconds } : {}),
    });
    onGo();
  };

  const search = async () => {
    setSearching(true);
    setFailed(false);
    const found = await findScenes(targetLanguage, phrases);
    setSearching(false);
    if (found === null) setFailed(true);
    setScenes(found ?? []);
  };

  return (
    <div className="mt-2 space-y-2">
      {phrases.length ? (
        <div>
          <p className="text-[11px] text-slate-500">{ui.mapListenFor}</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {phrases.map((phrase) => (
              <span key={phrase} className="rounded-full bg-white/10 px-2 py-0.5 text-[12px] text-slate-100">
                {phrase}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-1.5">
        {phrases.length ? (
          <button
            type="button"
            onClick={() => void search()}
            disabled={searching}
            className="rounded-lg bg-white/15 px-3 py-1.5 text-[12px] text-slate-100 hover:bg-white/20 disabled:opacity-50"
          >
            {searching ? ui.mapScenesLoading : ui.mapFindScenes}
          </button>
        ) : null}
        {clip ? (
          <button
            type="button"
            onClick={() => openVideo(clip.videoId, undefined, clip.durationSeconds)}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-left text-[12px] text-slate-300 hover:bg-white/10"
          >
            {ui.mapLibraryClip}: <bdi>{clip.title}</bdi>
          </button>
        ) : null}
      </div>

      {scenes ? (
        scenes.length === 0 ? (
          <div className="rounded-lg bg-black/30 px-3 py-2">
            <p className="text-[12px] leading-relaxed text-slate-400">
              {failed ? ui.mapScenesFailed : ui.mapScenesEmpty}
            </p>
            <button
              type="button"
              onClick={() => {
                sendAppIntent("openTab", { tab: "video" });
                onGo();
              }}
              className="mt-1.5 text-[12px] text-slate-200 underline underline-offset-4"
            >
              {ui.mapGoTo.replace("{tab}", ui.homeTabVideo)}
            </button>
          </div>
        ) : (
          <ul className="space-y-2">
            {scenes.map((match) => (
              <li key={match.videoId} className="rounded-lg bg-black/30 px-3 py-2">
                <p className="text-[12px] font-medium text-slate-200">
                  {match.title || match.videoId}
                </p>
                <ul className="mt-1 space-y-1">
                  {match.found.flatMap((entry) =>
                    entry.hits.map((hit) => (
                      <li key={`${entry.expression}-${hit.start}`}>
                        <button
                          type="button"
                          onClick={() => openVideo(match.videoId, hit.start, match.durationSeconds)}
                          className="w-full rounded-md px-1 py-1 text-left hover:bg-white/10"
                        >
                          <span className="mr-1.5 text-[11px] font-semibold text-amber-200/90">
                            ▶ {formatTime(hit.start)}
                          </span>
                          <span className="text-[12px] leading-relaxed text-slate-300">{hit.text}</span>
                        </button>
                      </li>
                    )),
                  )}
                </ul>
              </li>
            ))}
          </ul>
        )
      ) : null}
    </div>
  );
}
