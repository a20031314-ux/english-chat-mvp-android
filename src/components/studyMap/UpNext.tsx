"use client";
import type { UICopy } from "@/lib/copy";
import { goUpNext, useUpNext } from "@/lib/curriculum/upNext";

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
