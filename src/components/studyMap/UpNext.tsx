"use client";

import { BodyLayer } from "@/components/FullScreenLayer";
import type { UICopy } from "@/lib/copy";
import { dismissUpNext, goUpNext, useUpNext, useUpNextOffer } from "@/lib/curriculum/upNext";

/**
 * 다음 추천 버튼(lib/curriculum/upNext.ts): 수업 끝 화면에서 오늘 할 것의 다음 항목(다 했으면 Quizbank)으로.
 * own = 지금 연 수업 id(목록에서 뺌), close = 지금 화면 닫기(전면 광고 등 닫기와 같은 일).
 */
export function UpNextButton({ ui, own, close }: { ui: UICopy; own: string; close: () => void }) {
  const next = useUpNext(own);
  if (!next) return null;
  return (
    <button
      type="button"
      data-up-next
      onClick={() => goUpNext(next, close)}
      className="flex w-full max-w-sm items-center gap-3 rounded-xl border border-status-learned/50 bg-status-learned/[0.06] px-3 py-2.5 text-start hover:bg-status-learned/10"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-caption text-slate-400">{ui.needsNextUp}</span>
        <span dir="auto" className="block truncate text-note font-semibold text-ink">
          {next.label}
        </span>
      </span>
      <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/90 text-caption text-slate-900">
        ▶
      </span>
    </button>
  );
}

/** 수업을 닫은 뒤 My 아래에 잠깐(15초) 뜨는 다음 추천 줄 — 누르면 그것을 열고, ✕면 닫는다. */
export function UpNextBar({ ui }: { ui: UICopy }) {
  const offered = useUpNextOffer();
  if (!offered) return null;
  const { next } = offered;
  return (
    <BodyLayer>
      <div data-up-next-bar className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+5rem)] z-[80] flex justify-center px-4">
        <div className="pointer-events-auto flex w-full max-w-md items-center gap-2 rounded-2xl border border-status-learned/50 bg-surface px-3 py-2 shadow-lg">
          <button type="button" onClick={() => goUpNext(next)} className="flex min-w-0 flex-1 items-center gap-3 text-start">
            <span className="min-w-0 flex-1">
              <span className="block text-caption text-slate-400">{ui.needsNextUp}</span>
              <span dir="auto" className="block truncate text-note font-semibold text-ink">
                {next.label}
              </span>
            </span>
            <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/90 text-caption text-slate-900">
              ▶
            </span>
          </button>
          <button type="button" onClick={dismissUpNext} aria-label={ui.billingClose} className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10">
            ✕
          </button>
        </div>
      </div>
    </BodyLayer>
  );
}
