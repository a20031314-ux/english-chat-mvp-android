"use client";

import { useEffect, useState } from "react";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { apiUrl } from "@/lib/apiBase";
import { appVersion } from "@/lib/appVersion";
import { sendAppIntent } from "@/lib/appIntents";
import { fillGuideLabels, findGuideSection, loadGuide, readCachedGuide, type GuideData } from "@/lib/guide/client";
import type { Locale, UICopy } from "@/lib/copy";
import {
  USE_SIGNAL_KEYS,
  WHATS_NEW_SEEN_KEY,
  noteVersionOf,
  pendingNotes,
  shotPath,
  type WhatsNewItem,
  type WhatsNewTab,
} from "@/lib/whatsNew";

/**
 * Decided once, during the first render and before anything else on the
 * screen has had a chance to write to storage: whether this launch is the
 * first one since an update. A fresh install looks like no use at all, which
 * is what tells it apart from someone arriving from a build without the sheet.
 */
function readPending(): WhatsNewItem[] {
  if (typeof window === "undefined") return [];
  try {
    const storage = window.localStorage;
    const seen = storage.getItem(WHATS_NEW_SEEN_KEY);
    const usedBefore = USE_SIGNAL_KEYS.some((key) => storage.getItem(key) !== null);
    return pendingNotes(seen, appVersion(), usedBefore);
  } catch {
    return [];
  }
}

function markSeen() {
  try {
    const version = appVersion();
    if (version) window.localStorage.setItem(WHATS_NEW_SEEN_KEY, version);
  } catch {
    // Without storage it shows again next launch, which is the lesser problem.
  }
}

/**
 * A picture taken in the learner's interface language, falling back to the
 * English set, and to no picture at all when offline.
 */
function Shot({ item, locale, alt }: { item: WhatsNewItem; locale: Locale; alt: string }) {
  const version = noteVersionOf(item);
  const [source, setSource] = useState<"own" | "en" | "none">("own");
  if (source === "none") return null;
  const src = apiUrl(shotPath(version, source === "own" ? locale : "en", item.shot));
  return (
    // eslint-disable-next-line @next/next/no-img-element -- remote, per-locale, and the app is a static export
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setSource(source === "own" && locale !== "en" ? "en" : "none")}
      className="mx-auto mt-3 max-h-[360px] w-full max-w-[300px] rounded-xl border border-white/10 object-cover object-top"
    />
  );
}

export function WhatsNewSheet({
  ui,
  locale,
  onOpenTab,
}: {
  ui: UICopy;
  locale: Locale;
  onOpenTab: (tab: WhatsNewTab) => void;
}) {
  const [items, setItems] = useState<WhatsNewItem[]>(readPending);
  // 설명 글은 사용법 칸에서(item.guide). 못 받으면 노트 자체의 글.
  const [guide, setGuide] = useState<GuideData | null>(() => readCachedGuide(locale));
  const wantsGuide = items.some((item) => item.guide);
  useEffect(() => {
    if (!wantsGuide) return;
    let live = true;
    void loadGuide(locale).then((loaded) => {
      if (live && loaded) setGuide(loaded);
    });
    return () => {
      live = false;
    };
  }, [wantsGuide, locale]);

  // Nothing to show still records the version, so a fresh install is not
  // mistaken for an update next time.
  useEffect(() => {
    if (items.length === 0) markSeen();
  }, [items.length]);

  if (items.length === 0) return null;

  const close = (tab?: WhatsNewTab) => {
    markSeen();
    setItems([]);
    if (tab) onOpenTab(tab);
  };
  const titleOf = (item: WhatsNewItem): string => {
    const found = item.guide ? findGuideSection(guide, item.guide) : null;
    return found ? fillGuideLabels(found.section.heading, ui) : String(ui[item.title]);
  };
  const bodyOf = (item: WhatsNewItem): string[] => {
    const found = item.guide ? findGuideSection(guide, item.guide) : null;
    return found ? found.section.body.map((paragraph) => fillGuideLabels(paragraph, ui)) : [String(ui[item.body])];
  };

  return (
    <FullScreenLayer>
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top,0px))]">
        <h2 className="text-[15px] font-semibold text-neutral-100">{ui.whatsNewTitle}</h2>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-4">
        <div className="mx-auto flex max-w-xl flex-col gap-8 pb-6">
          {items.map((item) => (
            <section key={item.id}>
              <h3 className="text-chat font-semibold text-ink">{titleOf(item)}</h3>
              <div className="mt-1.5 flex flex-col gap-1.5 text-note leading-relaxed text-slate-300">
                {bodyOf(item).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <Shot item={item} locale={locale} alt={String(ui[item.title])} />
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => close(item.tab)}
                  className="rounded-lg border border-line px-3 py-1.5 text-caption text-slate-200 hover:bg-white/10"
                >
                  {ui.whatsNewTry}
                </button>
                {item.guide ? (
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      sendAppIntent("openGuide", { section: item.guide! });
                    }}
                    className="rounded-lg border border-line px-3 py-1.5 text-caption text-slate-200 hover:bg-white/10"
                  >
                    {ui.guideMore}
                  </button>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </div>
      <div className="shrink-0 border-t border-white/10 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] pt-3">
        <button
          type="button"
          onClick={() => close()}
          className="w-full rounded-xl bg-[#e8e8e4] py-3 text-[14px] font-medium text-neutral-900"
        >
          {ui.whatsNewDone}
        </button>
      </div>
    </FullScreenLayer>
  );
}
