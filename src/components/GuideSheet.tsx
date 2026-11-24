"use client";

import { useEffect, useRef, useState } from "react";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { NativeAdSlot } from "@/components/NativeAdSlot";
import { FeatureMap } from "@/components/FeatureMap";
import { apiUrl } from "@/lib/apiBase";
import { onAppIntent } from "@/lib/appIntents";
import type { Locale, UICopy } from "@/lib/copy";
import type { GuideChapter, GuideGo } from "@/lib/guide/content";
import { fillGuideLabels, loadGuide, readCachedGuide, type GuideData } from "@/lib/guide/client";
import type { GuideSlideGroup } from "@/lib/guide/slides";
import {
  FEATURE_PRESETS,
  applyPreset,
  featureOfGo,
  finishChoosing,
  isFeatureOn,
  matchingPreset,
  setFeatureOn,
  type FeatureId,
  type FeaturePresetId,
  type FeatureState,
} from "@/lib/features";

/**
 * 사용법 창 하나(2026-10-20, hub/app/DESIGN.md "안내 글"). 위쪽 "?"는 지금 화면의 기능 칸으로 열고,
 * 새로워진 점의 "자세히"는 그 칸으로 연다(appIntent `openGuide`). 기능별 묶음마다 "이 화면으로 가기".
 *
 * 장마다 넘겨 보기 장면만(lib/guide/slides.ts, 문구는 그림 안) — 장 이름·칸 칩은 서버(/api/guide)가 {ui:<키>}로 준다.
 * 장면이 없는 장(옛 앱용 글만 있는 장)은 이 앱에선 안 보인다.
 *
 * 쓸 기능 고르기(2026-10-21, lib/features.ts): 장마다 [사용함 | 사용안함]. 숨긴 장은 흐리게 남아 다시 켜는 곳이 된다.
 * 처음 설치한 사람에겐 첫 화면이 이 창의 "고르기" 모양(장마다 첫 장면 하나 + 묶음 버튼 + 시작하기/건너뛰기 = 전부 사용).
 */

/** 화면 → 처음 펼칠 묶음. */
const SCREEN_CHAPTER: Record<string, string> = {
  talk: "messages",
  chat: "ai-chat",
  roleplay: "ai-call",
  messages: "messages",
  video: "video",
  people: "people",
  rooms: "rooms",
  map: "my",
};

/**
 * 장 안의 넘겨 보기(2026-11-14, lib/guide/slides.ts): 칸 칩 → 첫 장 = 그 칸의 핵심, 옆으로 넘기면 세부.
 * 문구는 그림 안에 있다 — 여기선 칸 이름(화면 문구)만.
 */
function SlideDeck({ groups, ui, locale, section }: { groups: GuideSlideGroup[]; ui: UICopy; locale: string; section?: string }) {
  // 새로워진 점 "자세히"가 예전 칸 id로 열면 그 칸을 대신하는 칸을 고른 채로(slides.ts covers).
  const [groupId, setGroupId] = useState((section && groups.find((one) => one.covers?.includes(section))?.id) ?? groups[0]?.id ?? "");
  const [at, setAt] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const group = groups.find((one) => one.id === groupId) ?? groups[0];
  if (!group) return null;
  const go = (index: number) => {
    const root = track.current;
    if (!root) return;
    const next = Math.max(0, Math.min(group.slides.length - 1, index));
    root.scrollTo({ left: next * root.clientWidth * (document.dir === "rtl" ? -1 : 1), behavior: "smooth" });
  };
  return (
    <div data-guide-slides className="flex flex-col gap-3">
      {groups.length > 1 ? (
      <div className="flex flex-wrap gap-2" role="tablist">
        {groups.map((one) => (
          <button
            key={one.id}
            type="button"
            role="tab"
            data-guide-slide-group={one.id}
            aria-selected={one.id === group.id}
            onClick={() => {
              setGroupId(one.id);
              setAt(0);
              track.current?.scrollTo({ left: 0 });
            }}
            className={`rounded-full px-3 py-1 text-caption ${one.id === group.id ? "bg-platinum text-canvas" : "border border-line text-slate-300 hover:bg-white/10"}`}
          >
            {fillGuideLabels(one.title, ui)}
          </button>
        ))}
      </div>
      ) : null}
      <div
        ref={track}
        key={group.id}
        onScroll={(event) => {
          const root = event.currentTarget;
          setAt(Math.round(Math.abs(root.scrollLeft) / Math.max(1, root.clientWidth)));
        }}
        className="flex snap-x snap-mandatory overflow-x-auto"
      >
        {group.slides.map((slide) => (
          // 높이를 미리 잡아 둔다 — 그림이 늦게 와도 "자세히"로 연 장까지 내려간 자리가 밀리지 않게.
          <div key={slide.shot} className="flex h-[70vh] w-full shrink-0 snap-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={apiUrl(`/guide/${locale}/${slide.shot}.webp`)} alt={slide.title} loading="lazy" className="h-full w-auto max-w-full rounded-2xl object-contain" />
          </div>
        ))}
      </div>
      {group.slides.length > 1 ? (
        <div className="flex items-center justify-between">
          <button type="button" aria-label={ui.studyChapterPrev} onClick={() => go(at - 1)} disabled={at === 0} className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-slate-200 disabled:opacity-30">
            <span aria-hidden className="inline-block rtl:rotate-180">‹</span>
          </button>
          <div className="flex gap-1.5">
            {group.slides.map((slide, index) => (
              <span key={slide.shot} className={`h-1.5 rounded-full ${index === at ? "w-4 bg-platinum" : "w-1.5 bg-white/20"}`} />
            ))}
          </div>
          <button type="button" aria-label={ui.studyChapterNext} onClick={() => go(at + 1)} disabled={at >= group.slides.length - 1} className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-slate-200 disabled:opacity-30">
            <span aria-hidden className="inline-block rtl:rotate-180">›</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

const PRESET_LABEL: Record<FeaturePresetId, keyof UICopy> = {
  solo: "featurePresetSolo",
  video: "featurePresetVideo",
  people: "featurePresetPeople",
  all: "featurePresetAll",
};

function PresetRow({ ui, off }: { ui: UICopy; off: FeatureId[] }) {
  const active = matchingPreset(off);
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={ui.featurePresets}>
      {FEATURE_PRESETS.map((preset) => (
        <button
          key={preset.id}
          type="button"
          aria-pressed={active === preset.id}
          onClick={() => applyPreset(preset.id)}
          className={`rounded-full px-3 py-1.5 text-caption ${
            active === preset.id ? "bg-platinum text-canvas" : "border border-line text-slate-200 hover:bg-white/10"
          }`}
        >
          {String(ui[PRESET_LABEL[preset.id]])}
        </button>
      ))}
    </div>
  );
}

/** 장 제목 옆 [사용함 | 사용안함]. AI 채팅·My는 "항상 사용". */
function FeatureSwitch({ ui, feature, off }: { ui: UICopy; feature: FeatureId | null; off: FeatureId[] }) {
  if (!feature) return <span className="shrink-0 text-meta text-slate-400">{ui.featureAlways}</span>;
  const on = isFeatureOn(off, feature);
  const option = (value: boolean, label: string) => (
    <button
      type="button"
      role="radio"
      aria-checked={on === value}
      onClick={() => setFeatureOn(feature, value)}
      className={`rounded-lg px-2.5 py-1 text-caption ${on === value ? (value ? "bg-platinum text-canvas" : "bg-white/15 text-ink") : "text-slate-400 hover:bg-white/10"}`}
    >
      {label}
    </button>
  );
  return (
    <div role="radiogroup" className="flex shrink-0 gap-0.5 rounded-xl border border-line p-0.5">
      {option(true, ui.featureOn)}
      {option(false, ui.featureOff)}
    </div>
  );
}

/**
 * 처음 설치(2026-10-28 사용자 "처음 설치한 사람은 기능 설명 > 사용/안 씀 체크 흐름"): 고를 수 있는 기능마다 한 장씩 —
 * 그 장의 첫 칸(그림 + 한두 줄) 아래 "사용함 / 사용안함", 누르면 다음 장. 끝나면 고른 대로 시작(첫 화면 My).
 * 사람을 안 쓰면 Room도 묻지 않고 끈다(방은 사람 기능의 일부).
 */
function FirstRunSteps({
  ui,
  locale,
  chapters,
  slides,
  off,
  onDone,
}: {
  ui: UICopy;
  locale: Locale;
  chapters: GuideChapter[];
  slides: Record<string, GuideSlideGroup[]>;
  off: FeatureId[];
  onDone: () => void;
}) {
  const steps: { chapter: GuideChapter; feature: FeatureId }[] = [];
  for (const chapter of chapters) {
    const feature = featureOfGo(chapter.go);
    if (!feature) continue;
    const at = steps.findIndex((step) => step.feature === feature);
    // 같은 기능의 장이 둘이면(대화·사람 = 사람 기능) 사람 장으로.
    if (at >= 0) {
      if (chapter.go === "people") steps[at] = { chapter, feature };
      continue;
    }
    steps.push({ chapter, feature });
  }
  const [index, setIndex] = useState(0);
  const visible = steps.filter((step) => !(step.feature === "rooms" && !isFeatureOn(off, "people")));
  const step = visible[Math.min(index, visible.length - 1)];
  if (!step) return null;
  const answer = (on: boolean) => {
    setFeatureOn(step.feature, on);
    if (step.feature === "people" && !on) setFeatureOn("rooms", false);
    // 이번 답을 넣은 뒤의 장 목록(사람을 끄면 Room 장이 빠진다)에서 다음 장으로.
    const peopleOn = step.feature === "people" ? on : isFeatureOn(off, "people");
    const next = steps.filter((one) => !(one.feature === "rooms" && !peopleOn));
    const at = next.findIndex((one) => one.feature === step.feature);
    if (at + 1 >= next.length) onDone();
    else setIndex(at + 1);
  };
  // 그 장의 첫 장면 하나.
  const first = slides[step.chapter.id]?.[0]?.slides[0];
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      <div className="flex items-center gap-2">
        {index > 0 ? (
          <button type="button" onClick={() => setIndex(index - 1)} aria-label={ui.billingClose} className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10">
            <span aria-hidden className="inline-block rtl:rotate-180">‹</span>
          </button>
        ) : null}
        <span aria-hidden className="flex flex-1 justify-center gap-1.5">
          {visible.map((one, i) => (
            <span key={one.feature} className={`h-1.5 w-6 rounded-full ${i <= index ? "bg-platinum" : "bg-white/15"}`} />
          ))}
        </span>
        <span className="text-caption tabular-nums text-slate-400">
          {Math.min(index + 1, visible.length)}/{visible.length}
        </span>
      </div>
      <h2 className="text-title font-semibold text-ink">{fillGuideLabels(step.chapter.title, ui)}</h2>
      {first ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={apiUrl(`/guide/${locale}/${first.shot}.webp`)} alt={first.title} className="mx-auto max-h-[60vh] w-auto max-w-full rounded-2xl object-contain" />
      ) : null}
      <div className="sticky bottom-0 flex gap-2 bg-canvas pb-1 pt-2">
        <button type="button" onClick={() => answer(false)} className="flex-1 rounded-xl border border-line py-3 text-note text-slate-200 hover:bg-white/10">
          {ui.featureOff}
        </button>
        <button type="button" onClick={() => answer(true)} className="flex-1 rounded-xl bg-platinum py-3 text-note font-medium text-canvas hover:bg-platinum-hover">
          {ui.featureOn}
        </button>
      </div>
    </div>
  );
}

const PICK_VIEW_KEY = "featurePickView";
function readPickView(): "map" | "list" {
  try {
    return globalThis.localStorage?.getItem(PICK_VIEW_KEY) === "list" ? "list" : "map";
  } catch {
    return "map";
  }
}

export function GuideButton({
  ui,
  locale,
  tab,
  availableGo,
  onGo,
  features = null,
  onChosen,
}: {
  ui: UICopy;
  locale: Locale;
  /** 지금 화면(AppHome 탭). */
  tab: string;
  /** 이 빌드에서 열 수 있는 곳 — 없는 기능(iOS의 사람·Room 등)의 묶음은 보이지 않는다. */
  availableGo: GuideGo[];
  onGo: (go: GuideGo) => void;
  /** 쓸 기능 고르기(lib/features.ts). 없으면(창구 모드) 스위치를 안 보인다. */
  features?: FeatureState | null;
  /** 처음 고르기를 마쳤을 때(첫 화면을 정하려고). */
  onChosen?: (off: FeatureId[]) => void;
}) {
  // 처음 설치면 기능 고르기가 첫 화면: 고르기를 마칠 때까지(features.chosen) 열려 있다.
  const picking = Boolean(features && !features.chosen);
  const [openAsked, setOpen] = useState(false);
  const open = openAsked || picking;
  const [data, setData] = useState<GuideData | null>(null);
  const [failed, setFailed] = useState(false);
  // 펼칠 곳: 묶음 id, 또는 칸 id(새로워진 점에서).
  const [target, setTarget] = useState<{ chapter: string; section?: string; hidden?: boolean; manage?: boolean }>({ chapter: "ai-chat" });
  // 쓸 기능 고르기의 보는 방식: 구조도(체크) | 설명(장마다 그림). 이 기기에 기억(보는 방식 고르기, DESIGN.md).
  const [pickView, setPickViewState] = useState<"map" | "list">(readPickView);
  const setPickView = (next: "map" | "list") => {
    setPickViewState(next);
    try {
      localStorage.setItem(PICK_VIEW_KEY, next);
    } catch {
      // 이번에만.
    }
  };
  const scroller = useRef<HTMLDivElement>(null);
  // 구조도에서 누른 장: 설명 보기가 그려진 뒤 그 장으로 내린다.
  const pendingJump = useRef<string | null>(null);

  const openAt = (next: { chapter?: string; section?: string; hidden?: boolean; manage?: boolean }) => {
    setTarget({ chapter: next.chapter ?? SCREEN_CHAPTER[tab] ?? "ai-chat", section: next.section, hidden: next.hidden, manage: next.manage });
    setFailed(false);
    setOpen(true);
  };

  // 새로워진 점 "자세히": 그 칸으로. 숨긴 기능으로 가려던 곳도 여기로(쓸 기능 고르기는 이 창 맨 앞 탭).
  useEffect(() => onAppIntent("openGuide", (detail) => openAt(detail)));

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void loadGuide(locale).then((loaded) => {
      if (cancelled) return;
      if (loaded) setData(loaded);
      else setFailed(true);
    });
    return () => {
      cancelled = true;
    };
  }, [open, locale]);

  const shown = data ?? (open ? readCachedGuide(locale) : null);
  const slides = shown?.slides ?? {};
  // 장면이 있는 장만(옛 앱용 글만 있는 장은 안 보인다).
  const chapters: GuideChapter[] = (shown?.chapters ?? []).filter((chapter) => availableGo.includes(chapter.go) && slides[chapter.id]?.length);
  // 새로워진 점 "자세히"는 칸 id로 연다 — 그 칸을 대신하는 장면 칸(covers)이 든 장으로.
  const sectionChapter = target.section
    ? chapters.find((chapter) => slides[chapter.id]?.some((group) => group.covers?.includes(target.section!)) || chapter.sections.some((row) => row.id === target.section))?.id
    : undefined;
  const focusChapter = sectionChapter ?? target.chapter;
  const off = features?.off ?? [];
  const chapterOn = (chapter: GuideChapter) => {
    const feature = featureOfGo(chapter.go);
    return !features || !feature || isFeatureOn(off, feature);
  };

  // 열리면 그 묶음(또는 칸)으로 내린다. 고르기·기능 고르기는 맨 위부터.
  useEffect(() => {
    if (!open || !chapters.length || picking || target.manage) return;
    const root = scroller.current;
    const element = root?.querySelector(`[data-guide-chapter="${focusChapter}"]`);
    if (element instanceof HTMLElement) element.scrollIntoView({ block: "start" });
  }, [open, chapters.length, focusChapter, target.section, picking, target.manage]);

  useEffect(() => {
    const chapterId = pendingJump.current;
    if (!chapterId || pickView !== "list" || !chapters.length) return;
    const element = scroller.current?.querySelector(`[data-guide-chapter="${chapterId}"]`);
    if (element instanceof HTMLElement) {
      element.scrollIntoView({ block: "start" });
      pendingJump.current = null;
    }
  });

  const jump = (chapterId: string) => {
    const element = scroller.current?.querySelector(`[data-guide-chapter="${chapterId}"]`);
    if (element instanceof HTMLElement) element.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  const finish = (skip: boolean) => {
    finishChoosing(skip);
    setOpen(false);
    onChosen?.(skip ? [] : off);
  };

  const choosing = Boolean(features && (picking || target.manage));
  const showMap = choosing && pickView === "map";
  // 구조도에서 칸 이름을 누르면 설명 보기의 그 장으로.
  const openChapterFromMap = (chapterId: string) => {
    pendingJump.current = chapterId;
    setPickView("list");
    setTarget((prev) => ({ ...prev, chapter: chapterId }));
  };
  const pickTop = choosing ? (
    <div className="flex flex-col gap-3">
      <PresetRow ui={ui} off={off} />
      <div role="radiogroup" aria-label={ui.featurePickTitle} className="flex gap-0.5 self-start rounded-xl border border-line p-0.5">
        {(["map", "list"] as const).map((view) => (
          <button
            key={view}
            type="button"
            role="radio"
            aria-checked={pickView === view}
            onClick={() => setPickView(view)}
            className={`rounded-lg px-3 py-1 text-caption ${pickView === view ? "bg-white/15 text-ink" : "text-slate-400 hover:bg-white/10"}`}
          >
            {view === "map" ? ui.featureViewMap : ui.featureViewList}
          </button>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => openAt({})}
        aria-label={ui.guideOpen}
        title={ui.guideOpen}
        className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-white/5 text-note font-semibold text-slate-100 hover:bg-white/10"
      >
        ?
      </button>
      {open ? (
        <FullScreenLayer>
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top,0px))]">
            <h2 className="text-chat font-semibold text-ink">{picking ? ui.featurePickTitle : ui.guideOpen}</h2>
            <button
              type="button"
              onClick={() => (picking ? finish(true) : setOpen(false))}
              className="rounded-lg border border-line px-3 py-1.5 text-caption text-slate-200 hover:bg-white/10"
            >
              {picking ? ui.featurePickSkip : ui.guideClose}
            </button>
          </div>
          {picking ? null : (
            <div className="flex shrink-0 gap-2 overflow-x-auto border-b border-line px-4 py-2" role="tablist">
              {/* Feature picker lives here as the first tab (2026-10-29: moved out of My into the guide). */}
              {features && chapters.length ? (
                <button
                  type="button"
                  role="tab"
                  data-feature-pick-tab
                  aria-selected={Boolean(target.manage)}
                  onClick={() => setTarget((prev) => ({ ...prev, manage: !prev.manage }))}
                  className={`shrink-0 rounded-full px-3 py-1 text-caption ${
                    target.manage ? "bg-platinum text-canvas" : "border border-line text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {ui.featurePickTitle}
                </button>
              ) : null}
              {chapters.map((chapter) => (
                    <button
                      key={chapter.id}
                      type="button"
                      role="tab"
                      aria-selected={!target.manage && focusChapter === chapter.id}
                      onClick={() => {
                        setTarget({ chapter: chapter.id });
                        jump(chapter.id);
                      }}
                      className={`shrink-0 rounded-full px-3 py-1 text-caption ${
                        !target.manage && focusChapter === chapter.id
                          ? "bg-platinum text-canvas"
                          : `border border-line hover:bg-white/10 ${chapterOn(chapter) ? "text-slate-300" : "text-slate-500"}`
                      }`}
                    >
                      {fillGuideLabels(chapter.title, ui)}
                    </button>
              ))}
            </div>
          )}
          <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] pt-4">
            {picking && chapters.length ? (
              <FirstRunSteps ui={ui} locale={locale} chapters={chapters} slides={slides} off={off} onDone={() => finish(false)} />
            ) : showMap ? (
              <div className="mx-auto flex max-w-xl flex-col gap-4">
                {pickTop}
                <FeatureMap
                  ui={ui}
                  off={off}
                  social={availableGo.includes("people")}
                  callAvailable={availableGo.includes("roleplay")}
                  onOpenChapter={openChapterFromMap}
                />
              </div>
            ) : chapters.length ? (
              <div className={`mx-auto flex max-w-xl flex-col ${picking ? "gap-6" : "gap-10"}`}>
                {pickTop}
                {chapters.map((chapter) => {
                  const feature = featureOfGo(chapter.go);
                  const on = chapterOn(chapter);
                  // 고르기 화면(설명 보기)은 장마다 첫 장면 하나만.
                  const deck = slides[chapter.id] ?? [];
                  const groups = choosing ? deck.slice(0, 1).map((group) => ({ ...group, slides: group.slides.slice(0, 1) })) : deck;
                  return (
                    <div key={chapter.id} data-guide-chapter={chapter.id} className="scroll-mt-4">
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2">
                        <h2 className={`text-title font-semibold ${on ? "text-ink" : "text-slate-400"}`}>{fillGuideLabels(chapter.title, ui)}</h2>
                        <div className="flex flex-wrap items-center gap-2">
                          {features ? <FeatureSwitch ui={ui} feature={feature} off={off} /> : null}
                          {/* 글에는 가는 길을 쓰지 않는다: 그 화면으로는 이 버튼이 데려간다. */}
                          {!picking && on ? (
                            <button
                              type="button"
                              onClick={() => {
                                setOpen(false);
                                onGo(chapter.go);
                              }}
                              className="shrink-0 rounded-lg border border-line px-3 py-1.5 text-caption text-slate-200 hover:bg-white/10"
                            >
                              {ui.guideGoThere} <span aria-hidden className="inline-block rtl:rotate-180">›</span>
                            </button>
                          ) : null}
                        </div>
                      </div>
                      <div className={on ? "" : "opacity-60"}>
                        <SlideDeck key={target.section ?? ""} groups={groups} ui={ui} locale={locale} section={sectionChapter === chapter.id ? target.section : undefined} />
                      </div>
                    </div>
                  );
                })}
                {/* 장 본문 맨 끝 네이티브 하나(2026-11-01 — 읽는 안내 끝, 장 머리 스위치·‘이 화면으로 가기’와 떨어짐). 쓸 기능 고르기에는 없음. */}
                {!choosing ? <NativeAdSlot feedId="sheets" slotKey="guide-end" spaced /> : null}
              </div>
            ) : (
              <p className="mt-10 text-center text-note text-slate-400">{failed ? ui.guideUnavailable : ui.loading}</p>
            )}
          </div>
          {picking && !chapters.length ? (
            <div className="shrink-0 border-t border-line px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] pt-3">
              <button
                type="button"
                onClick={() => finish(false)}
                className="w-full rounded-xl bg-platinum py-3 text-note font-medium text-canvas hover:bg-platinum-hover"
              >
                {ui.featurePickStart}
              </button>
            </div>
          ) : null}
        </FullScreenLayer>
      ) : null}
    </>
  );
}
