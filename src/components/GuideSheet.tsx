"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { FeatureMap } from "@/components/FeatureMap";
import { apiUrl } from "@/lib/apiBase";
import { onAppIntent } from "@/lib/appIntents";
import type { Locale, UICopy } from "@/lib/copy";
import type { GuideChapter, GuideGo, GuideSection, GuideTabId } from "@/lib/guide/content";
import { fillGuideLabels, loadGuide, readCachedGuide, type GuideData } from "@/lib/guide/client";
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
 * 사용법 창 하나(2026-10-20, hub/DESIGN.md "안내 글"). 위쪽 "?"는 지금 화면의 기능 칸으로 열고,
 * 새로워진 점의 "자세히"는 그 칸으로 연다(appIntent `openGuide`). 기능별 묶음마다 "이 화면으로 가기".
 *
 * 글은 서버에서 온다(/api/guide, src/lib/guide/content.ts) — 푸시로 고칠 수 있게. 버튼 이름은
 * {ui:<키>}로 와서 이 사람의 화면 문구로 채워지므로, 글과 버튼이 같은 버튼을 다르게 부를 수 없다.
 * 묶음을 못 받은 옛 저장분이면 예전처럼 탭별로 보여 준다.
 *
 * 쓸 기능 고르기(2026-10-21, lib/features.ts): 장마다 [사용함 | 사용안함]. 숨긴 장은 흐리게 남아 다시 켜는 곳이 된다.
 * 처음 설치한 사람에겐 첫 화면이 이 창의 "고르기" 모양(장마다 첫 칸 하나 + 묶음 버튼 + 시작하기/건너뛰기 = 전부 사용).
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
  vocab: "notes",
};

/**
 * The picture of one step, in this person's interface language, or the English
 * one while theirs has not been taken; left out if neither loads.
 */
function GuideShot({ locale, shot }: { locale: string; shot: string }) {
  const [source, setSource] = useState<"own" | "en" | "none">(locale === "en" ? "en" : "own");
  if (source === "none") return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={apiUrl(`/guide/${source === "own" ? locale : "en"}/${shot}.webp`)}
      alt=""
      loading="lazy"
      onError={() => setSource(source === "own" ? "en" : "none")}
      className="mt-2 max-h-[48vh] w-auto max-w-full rounded-xl border border-line"
    />
  );
}

/** 짧은 영상(소리 없음, 반복). 못 받으면 그림으로. */
function GuideClip({ locale, clip, shot }: { locale: string; clip: string; shot?: string }) {
  const [source, setSource] = useState<"own" | "en" | "none">(locale === "en" ? "en" : "own");
  if (source === "none") return shot ? <GuideShot locale={locale} shot={shot} /> : null;
  const folder = source === "own" ? locale : "en";
  return (
    <video
      key={folder}
      src={apiUrl(`/guide/${folder}/${clip}.mp4`)}
      poster={shot ? apiUrl(`/guide/${folder}/${shot}.webp`) : undefined}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      onError={() => setSource(source === "own" ? "en" : "none")}
      className="mt-2 max-h-[48vh] w-auto max-w-full rounded-xl border border-line"
    />
  );
}

function SectionView({
  section,
  ui,
  locale,
  isNew,
  anchor,
}: {
  section: GuideSection;
  ui: UICopy;
  locale: string;
  isNew?: boolean;
  anchor?: string;
}) {
  return (
    <section data-guide-section={anchor} className="scroll-mt-4">
      <h3 className="flex items-center gap-2 text-body font-semibold text-ink">
        <span>{fillGuideLabels(section.heading, ui)}</span>
        {isNew ? (
          <span className="rounded-full bg-info/15 px-2 py-0.5 text-meta font-semibold text-info">{ui.guideNew}</span>
        ) : null}
      </h3>
      <div className="mt-1.5 flex flex-col gap-1.5 text-note leading-relaxed text-slate-300">
        {section.body.map((paragraph) => (
          <p key={paragraph}>{fillGuideLabels(paragraph, ui)}</p>
        ))}
      </div>
      {section.clip ? (
        <GuideClip locale={locale} clip={section.clip} shot={section.shot} />
      ) : section.shot ? (
        <GuideShot locale={locale} shot={section.shot} />
      ) : null}
    </section>
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
  tabs,
  availableGo,
  onGo,
  newSections = [],
  features = null,
  onChosen,
  pickHeader,
}: {
  ui: UICopy;
  locale: Locale;
  /** 지금 화면(AppHome 탭). */
  tab: string;
  /** 묶음을 못 받았을 때 쓰는 예전 탭 목록. */
  tabs: { id: GuideTabId; label: string }[];
  /** 이 빌드에서 열 수 있는 곳 — 없는 기능(iOS의 사람·Room 등)의 묶음은 보이지 않는다. */
  availableGo: GuideGo[];
  onGo: (go: GuideGo) => void;
  /** 이번 빌드에서 새로 생긴 칸(새로워진 점이 가리키는 칸): "새로" 표시. */
  newSections?: string[];
  /** 쓸 기능 고르기(lib/features.ts). 없으면(창구 모드) 스위치를 안 보인다. */
  features?: FeatureState | null;
  /** 처음 고르기를 마쳤을 때(첫 화면을 정하려고). */
  onChosen?: (off: FeatureId[]) => void;
  /** 고르기 화면 위에 둘 것(학습 언어·화면 언어 — 첫 화면이 상단바를 가리므로). */
  pickHeader?: ReactNode;
}) {
  // 처음 설치면 기능 고르기가 첫 화면: 고르기를 마칠 때까지(features.chosen) 열려 있다.
  const picking = Boolean(features && !features.chosen);
  const [openAsked, setOpen] = useState(false);
  const open = openAsked || picking;
  const [data, setData] = useState<GuideData | null>(null);
  const [failed, setFailed] = useState(false);
  // 펼칠 곳: 묶음 id, 또는 칸 id(새로워진 점에서).
  const [target, setTarget] = useState<{ chapter: string; section?: string; hidden?: boolean; manage?: boolean }>({ chapter: "ai-chat" });
  const [oldTab, setOldTab] = useState<GuideTabId>("chat");
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
    setOldTab((["map", "chat", "roleplay", "video", "vocab", "rooms"] as const).find((id) => id === tab) ?? (tab === "people" ? "rooms" : "chat"));
    setFailed(false);
    setOpen(true);
  };

  // 새로워진 점 "자세히": 그 칸으로. 숨긴 기능으로 가려던 곳·My "기능 고르기"도 여기로.
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
  const chapters: GuideChapter[] = (shown?.chapters ?? []).filter((chapter) => availableGo.includes(chapter.go));
  const sectionChapter = target.section ? chapters.find((chapter) => chapter.sections.some((row) => row.id === target.section))?.id : undefined;
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
    const selector = target.section ? `[data-guide-section="${target.section}"]` : `[data-guide-chapter="${focusChapter}"]`;
    const element = root?.querySelector(selector);
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

  const oldPage = shown?.tabs?.[oldTab];
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
          {picking && pickHeader ? (
            <div className="relative z-10 flex shrink-0 flex-wrap items-center gap-2 border-b border-line px-4 py-2">{pickHeader}</div>
          ) : null}
          {picking ? null : (
            <div className="flex shrink-0 gap-2 overflow-x-auto border-b border-line px-4 py-2" role="tablist">
              {chapters.length
                ? chapters.map((chapter) => (
                    <button
                      key={chapter.id}
                      type="button"
                      role="tab"
                      aria-selected={focusChapter === chapter.id}
                      onClick={() => {
                        setTarget({ chapter: chapter.id });
                        jump(chapter.id);
                      }}
                      className={`shrink-0 rounded-full px-3 py-1 text-caption ${
                        focusChapter === chapter.id
                          ? "bg-platinum text-canvas"
                          : `border border-line hover:bg-white/10 ${chapterOn(chapter) ? "text-slate-300" : "text-slate-500"}`
                      }`}
                    >
                      {fillGuideLabels(chapter.title, ui)}
                    </button>
                  ))
                : tabs.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={oldTab === item.id}
                      onClick={() => setOldTab(item.id)}
                      className={`shrink-0 rounded-full px-3 py-1 text-caption ${
                        oldTab === item.id ? "bg-platinum text-canvas" : "border border-line text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
            </div>
          )}
          <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] pt-4">
            {showMap ? (
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
                  // 고르기 화면은 장마다 첫 칸 하나만(그림 먼저, 짧게).
                  const sections = picking ? chapter.sections.slice(0, 1) : chapter.sections;
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
                      <div className={`flex flex-col gap-5 ${on ? "" : "opacity-60"}`}>
                        {sections.map((section) => (
                          <SectionView
                            key={section.id}
                            section={section}
                            ui={ui}
                            locale={locale}
                            anchor={section.id}
                            isNew={!picking && newSections.includes(section.id)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : oldPage ? (
              <div className="mx-auto flex max-w-xl flex-col gap-5">
                {oldPage.sections.map((section) => (
                  <SectionView key={section.heading} section={section} ui={ui} locale={locale} />
                ))}
              </div>
            ) : (
              <p className="mt-10 text-center text-note text-slate-400">{failed ? ui.guideUnavailable : ui.guideLoading}</p>
            )}
          </div>
          {picking ? (
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
