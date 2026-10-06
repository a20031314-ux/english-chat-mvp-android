"use client";

import { useEffect, useState } from "react";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { apiUrl } from "@/lib/apiBase";
import type { Locale, UICopy } from "@/lib/copy";

type GuideTabId = "chat" | "roleplay" | "video" | "vocab";
type GuideSection = { heading: string; body: string[] };
type Guide = Partial<Record<GuideTabId, { title: string; sections: GuideSection[] }>>;

/**
 * How to use the tab you are on, behind the "?" in the top bar.
 *
 * The words come from the server (/api/guide, src/lib/guide/content.ts) so the
 * guide can be corrected or extended with a push; this only knows how to draw
 * sections. The last copy fetched is kept on the phone, so it still opens
 * underground; one never fetched says so rather than showing an empty sheet.
 *
 * Button names in the text arrive as {ui:<copy key>} and are filled in from
 * this person's own copy here, so what the guide calls a button is what the
 * button says, in every language.
 */
function cacheKey(locale: string): string {
  return `guide.v1.${locale}`;
}

function readCached(locale: string): Guide | null {
  try {
    const raw = globalThis.localStorage?.getItem(cacheKey(locale));
    return raw ? (JSON.parse(raw) as { tabs: Guide }).tabs : null;
  } catch {
    return null;
  }
}

function fillLabels(text: string, ui: UICopy): string {
  const labels = ui as unknown as Record<string, unknown>;
  return text.replace(/\{ui:([a-zA-Z]+)\}/g, (_, key: string) =>
    typeof labels[key] === "string" ? (labels[key] as string) : "",
  );
}

export function GuideButton({
  ui,
  locale,
  tab,
  tabs,
}: {
  ui: UICopy;
  locale: Locale;
  tab: GuideTabId;
  tabs: { id: GuideTabId; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [showing, setShowing] = useState<GuideTabId>(tab);
  const [guide, setGuide] = useState<Guide | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void fetch(apiUrl(`/api/guide?lang=${encodeURIComponent(locale)}`))
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { tabs?: Guide } | null) => {
        if (cancelled) return;
        if (data?.tabs) {
          setGuide(data.tabs);
          try {
            globalThis.localStorage?.setItem(cacheKey(locale), JSON.stringify({ tabs: data.tabs }));
          } catch {
            // Fetched again next time.
          }
        } else {
          setFailed(true);
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [open, locale]);

  const shown = guide ?? (open ? readCached(locale) : null);
  const page = shown?.[showing];

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setShowing(tab);
          setFailed(false);
          setOpen(true);
        }}
        aria-label={ui.guideOpen}
        title={ui.guideOpen}
        className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[13px] font-semibold text-slate-100 hover:bg-white/10"
      >
        ?
      </button>
      {open ? (
        <FullScreenLayer>
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top,0px))]">
            <h2 className="text-[15px] font-semibold text-neutral-100">
              {page ? fillLabels(page.title, ui) : ui.guideOpen}
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-[12px] text-neutral-200 hover:bg-white/10"
            >
              {ui.guideClose}
            </button>
          </div>
          <div className="flex shrink-0 gap-2 overflow-x-auto border-b border-white/10 px-4 py-2" role="tablist">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={showing === item.id}
                onClick={() => setShowing(item.id)}
                className={`shrink-0 rounded-full px-3 py-1 text-[12px] ${
                  showing === item.id
                    ? "bg-[#e8e8e4] text-neutral-900"
                    : "border border-white/15 text-neutral-300 hover:bg-white/10"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] pt-4">
            {page ? (
              <div className="mx-auto flex max-w-xl flex-col gap-5">
                {page.sections.map((section) => (
                  <section key={section.heading}>
                    <h3 className="text-[14px] font-semibold text-neutral-100">
                      {fillLabels(section.heading, ui)}
                    </h3>
                    <div className="mt-1.5 flex flex-col gap-1.5 text-[13px] leading-relaxed text-neutral-300">
                      {section.body.map((paragraph) => (
                        <p key={paragraph}>{fillLabels(paragraph, ui)}</p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <p className="mt-10 text-center text-[13px] text-neutral-400">
                {failed ? ui.guideUnavailable : ui.guideLoading}
              </p>
            )}
          </div>
        </FullScreenLayer>
      ) : null}
    </>
  );
}
