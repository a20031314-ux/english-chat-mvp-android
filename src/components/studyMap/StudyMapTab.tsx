"use client";

import { voiceCallAvailable } from "@/lib/platform";
import { needsLetters, saveLettersFirst } from "@/lib/curriculum/lettersFirst";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePremium } from "@/contexts/PremiumContext";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { UICopy } from "@/lib/copy";
import {
  finishStudyMapDraw,
  pendingStudyMapDraw,
  startStudyMapDraw,
  subscribeStudyMapDraw,
  type DrawResult,
  fetchStudyMap,
  restorePreviousStudyMap,
  type MapError,
  type MapRecord,
} from "@/lib/studyMapClient";
import { LedgerPanel } from "@/components/studyMap/LedgerPanel";
import { NotesPanel } from "@/components/notes/NotesPanel";
import { NotebookSection } from "@/components/notes/NotebookSection";
import { GrowthNetwork, type BoardMode, type BoardOptions } from "@/components/studyMap/GrowthNetwork";
import { StageExamples, StagePicker, useStages, type StageView } from "@/components/studyMap/StageCheck";
import { useItemStats } from "@/lib/curriculum/useItemStats";
import { PlacementPlayer } from "@/components/studyMap/PlacementPlayer";
import type { CheckResult } from "@/lib/curriculum/checkup";
import { reviewLabel } from "@/lib/curriculum/dailyPlan";
import { FOCUS_IDS, GAP_IDS, USE_IDS, type FocusId, type GapId, type UseId } from "@/lib/learner/selfCheck";
import { scenariosForLanguage } from "@/lib/roleplay/catalog";
import { AccountCard } from "@/components/account/AccountCard";
import { isFeatureOn, readFeatures, readFeaturesOnServer, subscribeFeatures } from "@/lib/features";
import { readEntryDoor } from "@/lib/doors";

/**
 * 커리큘럼만(2026-10-28 사용자 "커리큘럼이랑 동떨어져 있는 이전 기능은 다 숨겨줘"): 시작은 대화 예시로 단계만 고르고(체크 3질문·지도 그리기 없음,
 * POST /api/learner/self-check), 내 표현 목록·노트 칸은 숨긴다. 기록은 서버에 그대로. 되돌리려면 false.
 */
const CURRICULUM_ONLY = true;

const noSubscribe = () => () => {};

/**
 * My 탭: 계정 카드 → 자라는 중(네 갈래 어휘·문법·표현·발음 — 망·그래프·단계, NotebookSection) → 내 표현 → 노트(단어장·모은 것).
 * 지도 기록(api/curriculum)은 단계(stageId)와 체크를 들고 있어 남는다 — "새 목표"·"다음 단계로"가 체크 화면(GoalForm)으로 다시 그린다.
 * 예전 목표 지도 화면(주제·미션·복습)은 2026-10-27에 뺐다. 서버 API는 2.74 이하 앱이 쓴다.
 */
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
  // 다른 탭에 갔다 와도 그리는 중이면 그대로(studyMapClient.ts startStudyMapDraw).
  const [drawing, setDrawing] = useState(() => Boolean(pendingStudyMapDraw(targetLanguage)));
  const [limit, setLimit] = useState(0);
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  const [editing, setEditing] = useState(() => Boolean(pendingStudyMapDraw(targetLanguage)));

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
    return () => {
      cancelled = true;
    };
  }, [targetLanguage, isPremium]);

  const map = record?.map ?? null;
  // 고른 시작 단계(지도 없이 단계만 고른 사람도 단계 보기로).
  const [chosenStage, setChosenStage] = useState<string | null>(null);
  const [stageLoaded, setStageLoaded] = useState(!CURRICULUM_ONLY);
  useEffect(() => {
    if (!CURRICULUM_ONLY) return;
    let cancelled = false;
    void fetch(apiUrl(`/api/learner/self-check?lang=${encodeURIComponent(targetLanguage)}`), { headers: entitlementHeaders(isPremium) })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { selfCheck?: { stage?: string } | null } | null) => {
        if (cancelled) return;
        setChosenStage(data?.selfCheck?.stage ?? null);
        setStageLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setStageLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [targetLanguage, isPremium]);
  const started = Boolean(map) || (CURRICULUM_ONLY && Boolean(chosenStage));
  const showForm = !loading && stageLoaded && (editing || !started);
  // 단계 범위(영어·일본어·한국어): 대화 예시로 시작 단계 고르기·지도 위 목표 대화. 지도가 바뀌면 진행을 다시 읽는다.
  const stagesData = useStages(targetLanguage, locale, isPremium, map ? `${map.id}:${Object.keys(record?.missions ?? {}).length}` : "");
  const stages = stagesData?.stages ?? null;
  const [startStage, setStartStage] = useState<string | null>(null);

  const applyDraw = useCallback((result: DrawResult) => {
    setDrawing(false);
    if (!result.ok) {
      setError(result.error);
      setLimit(result.limit ?? 0);
      return;
    }
    setRecord(result.record);
    setEditing(false);
    setStartStage(null);
  }, []);

  // 그리는 동안 화면을 떠났다 돌아왔으면: 아직 도는 요청을 다시 기다리거나, 그사이 끝난 결과를 받는다.
  useEffect(() => {
    const pending = pendingStudyMapDraw(targetLanguage);
    if (!pending) {
      setDrawing(false);
      return;
    }
    let cancelled = false;
    setDrawing(true);
    setEditing(true);
    void pending.promise.then((result) => {
      if (cancelled) return;
      finishStudyMapDraw(targetLanguage, pending);
      applyDraw(result);
    });
    return () => {
      cancelled = true;
    };
  }, [targetLanguage, applyDraw]);

  const draw = async (goal: string, selfCheck: SelfCheckAnswer | null, typed = "") => {
    setDrawing(true);
    setError(null);
    const pending = startStudyMapDraw({
      goal,
      ...(selfCheck ? { selfCheck } : {}),
      targetLanguage,
      interfaceLanguage: locale,
      isPremium,
    }, typed);
    const result = await pending.promise;
    // 화면을 떠났으면 결과는 돌아올 때 위 effect가 받는다(이 컴포넌트는 이미 없음).
    if (!mountedRef.current) return;
    finishStudyMapDraw(targetLanguage, pending);
    applyDraw(result);
  };

  const restore = async () => {
    const restored = await restorePreviousStudyMap(targetLanguage, isPremium);
    if (restored) {
      setRecord({ ...restored, hasPrevious: true });
      setEditing(false);
    }
  };

  // 수준별 틀(2026-10-24, 사용자 "망·그래프 구조를 노트에 통합"): 예전 "지도" 보기의 단계 목표와 노트 뼈대를 한 틀로.
  // 사다리에서 고른 단계의 네 갈래(어휘·문법·표현·발음) + 이 단계 대화 예시(StageExamples). 망·그래프에서는 오늘의 학습만.
  const stageByOrder = (order: number) => stages?.find((stage) => stage.order === order) ?? null;
  const board = (mode: BoardMode, options: BoardOptions) => (
    <NotebookSection
      ui={ui}
      locale={locale}
      language={targetLanguage}
      isPremium={isPremium}
      frame={mode === "map"}
      view={mode}
      part={options.part}
      onPart={options.onPart}
      stageDetail={(order) => {
        const stage = stageByOrder(order);
        return stage ? <StageExamples ui={ui} stage={stage} /> : null;
      }}
      masteredOf={(order, index) => {
        const stage = stageByOrder(order);
        const id = stage?.grammar?.[index]?.constructionId;
        return Boolean(id && stagesData?.current?.stageId === stage?.id && stagesData.current?.grammarMastered?.includes(id));
      }}
      canSpeak={voiceCallAvailable() && scenariosForLanguage(targetLanguage).length > 0}
      onNextStage={(order) => {
        // 다음 단계 고르기(예전 "다음 단계" 흐름 그대로 — 단계 고르기·지도 다시 그리기, 사용자가 확인).
        const next = stageByOrder(order + 1);
        setStartStage(next?.id ?? null);
        setEditing(true);
      }}
    />
  );

  return (
    <div className="tb-panel flex h-full min-h-0 flex-col overflow-hidden rounded-2xl">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <h1 className="text-base font-semibold text-white">{ui.homeTabProfile}</h1>
        {started && !editing ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-[12px] text-neutral-300 hover:bg-white/10"
          >
            {CURRICULUM_ONLY ? ui.stageRechoose : ui.mapNewGoal}
          </button>
        ) : null}
      </header>

      {/* Profile: growth (four parts — net, graph, stage) → my expressions → notes. With no map yet, the ticks first.
          The old goal map (topics, missions), asking about progress, My's "try today" card and the notes index left on 2026-10-27. */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto mb-4 max-w-2xl">
          <AccountCard ui={ui} locale={locale} />
        </div>
        {loading || !stageLoaded ? (
          <p className="text-sm text-slate-400">{ui.mapLoading}</p>
        ) : showForm && CURRICULUM_ONLY ? (
          <StageStart
            ui={ui}
            locale={locale}
            targetLanguage={targetLanguage}
            isPremium={isPremium}
            stages={stages}
            startStage={startStage ?? chosenStage}
            canCancel={started}
            onCancel={() => setEditing(false)}
            onStarted={(stageId) => {
              setChosenStage(stageId);
              setStartStage(null);
              setEditing(false);
            }}
          />
        ) : showForm ? (
          <>
            <GoalForm
              ui={ui}
              locale={locale}
              targetLanguage={targetLanguage}
              isPremium={isPremium}
              drawing={drawing}
              error={error}
              limit={limit}
              canCancel={Boolean(map)}
              hasPrevious={Boolean(record?.hasPrevious)}
              stages={stages}
              startStage={startStage}
              onDraw={draw}
              onCancel={() => setEditing(false)}
              onRestore={restore}
            />
            {!map ? (
              <div className="mx-auto mt-6 max-w-md">
                <GrowthNetwork ui={ui} board={board} />
                <div className="mt-3">
                  <LedgerPanel ui={ui} locale={locale} targetLanguage={targetLanguage} isPremium={isPremium} />
                </div>
                {notesOn ? (
                  <div className="mt-3">
                    <NotesPanel ui={ui} locale={locale} targetLanguage={targetLanguage} />
                  </div>
                ) : null}
              </div>
            ) : null}
          </>
        ) : started ? (
          <div className="mx-auto max-w-2xl">
            <GrowthNetwork ui={ui} board={board} plain={CURRICULUM_ONLY} />
            {CURRICULUM_ONLY ? null : (
              <div className="mt-3">
                <LedgerPanel ui={ui} locale={locale} targetLanguage={targetLanguage} isPremium={isPremium} />
              </div>
            )}
            {notesOn && !CURRICULUM_ONLY ? (
              <div className="mt-3">
                <NotesPanel ui={ui} locale={locale} targetLanguage={targetLanguage} />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

    </div>
  );
}

type SelfCheckAnswer = { gaps: GapId[]; focus: FocusId[]; use?: UseId; stage?: string };

/**
 * How a map starts: three questions answered by ticking, not a goal to write
 * and a level to pick (learner/selfCheck.ts). Where they feel they fall short,
 * what they want to work on most, and — if they like — where they will use it.
 * Writing a goal is still there, underneath, for whoever wants to.
 */
function GoalForm({
  ui,
  locale,
  targetLanguage,
  isPremium,
  drawing,
  error,
  limit,
  canCancel,
  hasPrevious,
  stages,
  startStage,
  onDraw,
  onCancel,
  onRestore,
}: {
  ui: UICopy;
  locale: string;
  targetLanguage: string;
  isPremium: boolean;
  drawing: boolean;
  error: MapError | null;
  limit: number;
  canCancel: boolean;
  hasPrevious: boolean;
  /** 단계 범위가 있는 학습 언어면 대화 예시 목록(없으면 null — 예전 체크만). */
  stages: StageView[] | null;
  /** "다음 단계로 새 지도"에서 왔을 때 미리 골라 둘 단계. */
  startStage: string | null;
  onDraw: (goal: string, selfCheck: SelfCheckAnswer | null, typed?: string) => void;
  onCancel: () => void;
  onRestore: () => void;
}) {
  // 그리는 중에 다른 탭에 갔다 오면 고른 체크·쓴 목표를 그대로 보여 준다(studyMapClient.ts startStudyMapDraw).
  const pendingForm = pendingStudyMapDraw(targetLanguage)?.form;
  const [gaps, setGaps] = useState<GapId[]>(() => (pendingForm?.selfCheck?.gaps ?? []) as GapId[]);
  const [focus, setFocus] = useState<FocusId[]>(() => (pendingForm?.selfCheck?.focus ?? []) as FocusId[]);
  const [use, setUse] = useState<UseId | null>(() => (pendingForm?.selfCheck?.use ?? null) as UseId | null);
  const [goal, setGoal] = useState(() => pendingForm?.typed ?? "");
  const [stage, setStage] = useState<string | null>(() => pendingForm?.selfCheck?.stage ?? startStage);

  // What they ticked last time, shown again when they start a new map.
  useEffect(() => {
    let cancelled = false;
    void fetch(apiUrl(`/api/learner/self-check?lang=${encodeURIComponent(targetLanguage)}`), {
      headers: entitlementHeaders(isPremium),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { selfCheck?: SelfCheckAnswer | null } | null) => {
        const check = data?.selfCheck;
        if (cancelled || !check || pendingStudyMapDraw(targetLanguage)) return;
        setGaps(check.gaps ?? []);
        setFocus(check.focus ?? []);
        setUse(check.use ?? null);
        if (!startStage && check.stage) setStage(check.stage);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [targetLanguage, isPremium, startStage]);
  // 다른 학습 언어로 바꾸면 고른 단계는 그 언어 것이 아니다.
  const stageOk = Boolean(stage && stages?.some((entry) => entry.id === stage));
  const stageTitle = stageOk ? (stages?.find((entry) => entry.id === stage)?.title ?? "") : "";

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
  const ticked = gaps.length > 0 || focus.length > 0 || use !== null || stageOk;
  const ready = !drawing && (ticked || written.length >= 2);
  // With nothing written, the map's goal line is what they ticked, in their language.
  const composed = [...(stageTitle ? [stageTitle] : []), ...(use ? [useLabel[use]] : []), ...gaps.map((g) => gapLabel[g]), ...focus.map((f) => focusLabel[f])]
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
        onDraw(written.length >= 2 ? written : composed, ticked ? { gaps, focus, ...(use ? { use } : {}), ...(stageOk && stage ? { stage } : {}) } : null, goal);
      }}
    >
      {stages?.length ? (
        <StagePicker ui={ui} stages={stages} chosen={stageOk ? stage : null} onChoose={setStage} disabled={drawing} script={{ targetLanguage, locale, isPremium }} />
      ) : null}
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
      {drawing ? <MapDrawProgress ui={ui} targetLanguage={targetLanguage} /> : null}
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

function MapDrawProgress({ ui, targetLanguage }: { ui: UICopy; targetLanguage: string }) {
  const progress = useSyncExternalStore(
    (listener) => subscribeStudyMapDraw(targetLanguage, listener),
    () => pendingStudyMapDraw(targetLanguage)?.progress ?? null,
    () => null,
  );
  const startedAt = pendingStudyMapDraw(targetLanguage)?.startedAt ?? 0;
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  if (!progress) return null;
  const seconds = startedAt ? Math.max(0, Math.round((now - startedAt) / 1000)) : 0;
  const planned = progress.step === "fill";
  const total = progress.total ?? 0;
  const done = progress.done ?? 0;
  const topics = [...(progress.skeleton?.topics ?? [])].sort((a, b) => a.order - b.order);
  const row = (state: "done" | "now" | "wait", label: string) => (
    <li className={`flex items-center gap-2 text-note ${state === "wait" ? "text-slate-500" : state === "now" ? "text-ink" : "text-slate-400"}`}>
      <span aria-hidden className={`inline-block h-2 w-2 rounded-full ${state === "done" ? "bg-good" : state === "now" ? "animate-pulse bg-white" : "bg-white/20"}`} />
      {label}
    </li>
  );
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line bg-white/5 px-3 py-2.5" aria-live="polite">
      <div className="flex items-start justify-between gap-3">
        <ol className="flex flex-col gap-1.5">
          {row(planned ? "done" : "now", ui.mapStepPlan)}
          {row(planned ? (total && done >= total ? "done" : "now") : "wait", total ? `${ui.mapStepFill} ${done}/${total}` : ui.mapStepFill)}
        </ol>
        <span className="shrink-0 text-note tabular-nums text-slate-500">{ui.mapStepSeconds.replace("{n}", String(seconds))}</span>
      </div>
      {topics.length ? (
        <div className="flex flex-col gap-1 border-t border-line pt-2">
          <p className="text-note font-medium text-ink">{progress.skeleton?.title}</p>
          <ol className="flex flex-col gap-1">
            {topics.map((topic) => (
              <li key={topic.id} className="text-note leading-snug text-slate-400">
                {topic.order}. {topic.title}
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}


/**
 * 커리큘럼만(CURRICULUM_ONLY): 대화 예시로 시작 단계를 고르고 "시작"(지도 그리기·체크 질문 없음). 고르면 서버에 단계만 저장.
 */
function StageStart({
  ui,
  locale,
  targetLanguage,
  isPremium,
  stages,
  startStage,
  canCancel,
  onCancel,
  onStarted,
}: {
  ui: UICopy;
  locale: string;
  targetLanguage: string;
  isPremium: boolean;
  stages: StageView[] | null;
  startStage: string | null;
  canCancel: boolean;
  onCancel: () => void;
  onStarted: (stageId: string) => void;
}) {
  const [stage, setStage] = useState<string | null>(startStage);
  const [firstPick, setFirstPick] = useState(false);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);
  // 처음 시험(실력 확인, lib/curriculum/placement.ts)으로 정할지, 대화 예시로 고를지 — 처음엔 둘 중 고르게(2026-10-29 사용자).
  const [mode, setMode] = useState<"choose" | "test" | "pick">(startStage || !canCancel ? "pick" : "choose");
  // 시험 문제 통계를 미리 받아 둔다(첫 묶음부터 가르는 문제 먼저, curriculum/itemStats.ts).
  useItemStats(targetLanguage);
  const firstStage = stages?.length ? [...stages].sort((a, b) => a.order - b.order)[0]!.id : null;
  const chosenStage = stage ?? (!canCancel && !startStage && !firstPick ? firstStage : null);
  const stageOk = Boolean(chosenStage && stages?.some((entry) => entry.id === chosenStage));
  // 처음(2026-10-29 사용자 "첫 화면은 대화 선택형 단계 구분 정도로 간소화, 세부 측정은 이후로"): 시험·고르기 갈림 없이 바로 대화 예시로 단계 고르기,
  // 1단계가 골라진 채(누르면 바로 시작). 실력 확인 시험은 학습 하나 뒤 계속 공부에서(TodayPlan).
  const firstRun = !canCancel && !startStage;
  if (!stages?.length) return <p className="text-sm text-slate-400">{ui.mapLoading}</p>;
  const idOf = (order: number) => stages.find((entry) => entry.order === order)?.id ?? stages[0]!.id;
  const start = async (chosen = chosenStage) => {
    if (!chosen || !stages.some((entry) => entry.id === chosen) || saving) return;
    setSaving(true);
    setFailed(false);
    const ok = await fetch(apiUrl("/api/learner/self-check"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
      body: JSON.stringify({ language: targetLanguage, stage: chosen }),
    })
      .then((response) => response.ok)
      .catch(() => false);
    setSaving(false);
    if (ok) onStarted(chosen);
    else setFailed(true);
  };
  const saveTest = (result: CheckResult) => {
    void fetch(apiUrl("/api/curriculum/scripts"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
      body: JSON.stringify({ language: targetLanguage, checkup: result }),
    }).catch(() => undefined);
  };
  if (mode === "choose") {
    return (
      <div className="mx-auto flex max-w-md flex-col gap-3">
        <button type="button" data-placement-take onClick={() => setMode("test")} className="tb-btn rounded-xl px-4 py-3 text-note font-semibold">
          {ui.placementTake}
        </button>
        <button type="button" onClick={() => setMode("pick")} className="rounded-xl border border-line px-4 py-3 text-note text-slate-200 hover:bg-white/5">
          {ui.placementPick}
        </button>
        {canCancel ? (
          <button type="button" onClick={onCancel} className="self-center text-meta text-slate-400 underline-offset-4 hover:underline">
            {ui.billingClose}
          </button>
        ) : null}
      </div>
    );
  }
  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">
      {mode === "test" ? (
        <PlacementPlayer
          ui={ui}
          locale={locale}
          language={targetLanguage}
          labelOf={(key) => reviewLabel(targetLanguage, key)}
          onFinish={saveTest}
          onStart={(order) => void start(idOf(order))}
          onPick={(order) => {
            setStage(idOf(order));
            setMode("pick");
          }}
          onClose={() => setMode(startStage ? "pick" : "choose")}
        />
      ) : null}
      {/* Stage 0 — letters and sounds (2026-10-29), only where the learning language uses another script. */}
      {needsLetters(targetLanguage) ? (
        <button
          type="button"
          data-letters-first
          disabled={saving}
          onClick={() => {
            saveLettersFirst(targetLanguage, true);
            void start(firstStage);
          }}
          className="flex items-center justify-between gap-2 rounded-xl border border-line px-4 py-3 text-start text-note text-slate-100 hover:bg-white/5 disabled:opacity-40"
        >
          <span>
            {ui.stageNumber.replace("{n}", "0")} · {ui.scriptEntry}
          </span>
          <span aria-hidden className="text-slate-400 rtl:rotate-180">›</span>
        </button>
      ) : null}
      <StagePicker
        ui={ui}
        stages={stages}
        chosen={stageOk ? chosenStage : null}
        onChoose={(id) => {
          setFirstPick(true);
          setStage(id);
        }}
        disabled={saving} script={{ targetLanguage, locale, isPremium }} />
      <button
        type="button"
        disabled={!stageOk || saving}
        onClick={() => void start()}
        className="tb-btn rounded-xl px-4 py-3 text-note font-semibold disabled:opacity-40"
      >
        {ui.stageBegin}
      </button>
      {firstRun ? null : (
        <button type="button" onClick={() => setMode("test")} className="self-center rounded-full border border-line px-3 py-1 text-caption text-slate-300 hover:bg-white/10">
          {ui.placementTake}
        </button>
      )}
      {failed ? <p className="text-sm text-rose-300">{ui.mapFailed}</p> : null}
      {canCancel ? (
        <button type="button" onClick={onCancel} className="self-center text-meta text-slate-400 underline-offset-4 hover:underline">
          {ui.billingClose}
        </button>
      ) : null}
    </div>
  );
}
