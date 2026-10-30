"use client";

import { useMemo, useState } from "react";
import type { UICopy } from "@/lib/copy";
import { BodyLayer } from "@/components/FullScreenLayer";
import { POS_GROUPS, peekBank, posGroup } from "@/lib/curriculum/vocabBank";
import type { WordbookRow } from "@/lib/curriculum/wordbook";

/**
 * 지속 학습 [어휘]의 단어장(2026-10-29 사용자 "단어장은 그래프나 망으로 진행률을 보여 주고, 탭하면 열 수 있게").
 * 카드: [그래프 | 망](이 폰에 기억) — 그래프 = 최근 14일 동안 쌓인 낱말 수(앎 진하게), 망 = 품사별 낱말 수(가장 많은 칸 기준, 빈도 단어 목록에 있는 낱말만).
 * 누르면 시트에 전체 목록(최근 순, 앎·배우는 중·저장 색), 낱말을 누르면 뜻 시트(그 위 층).
 */
type View = "graph" | "net";
const VIEW_KEY = "wordbookView.v1";
const DAYS = 14;
const DAY_MS = 86400000;

function readView(): View {
  try {
    return localStorage.getItem(VIEW_KEY) === "net" ? "net" : "graph";
  } catch {
    return "graph";
  }
}

function dayStart(at: number): number {
  const d = new Date(at);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export function WordbookCard({
  ui,
  language,
  words,
  onWord,
  compact = false,
  icon = false,
}: {
  ui: UICopy;
  language: string;
  words: readonly WordbookRow[];
  onWord: (word: string) => void;
  /** 지속 학습 어휘 탭 안: 이름·개수 한 줄만, 누르면 시트(2026-10-30 "기능 안의 옵션이 주요 기능처럼"). */
  compact?: boolean;
  /** 퀴즈 칸 머리의 아이콘(📖)만 — 누르면 같은 시트. */
  icon?: boolean;
}) {
  const [view, setView] = useState<View>(readView);
  const [open, setOpen] = useState(false);
  const [now] = useState(() => Date.now());
  const pick = (next: View) => {
    setView(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      // 이번에만.
    }
  };
  const knownCount = words.filter((row) => row.state === "known").length;
  const learningCount = words.filter((row) => row.state === "learning").length;
  // 그래프: 그날까지 쌓인 수(앎 / 전체).
  const days = useMemo(() => {
    if (!now) return [];
    const today = dayStart(now);
    return Array.from({ length: DAYS }, (_, index) => {
      const end = today - (DAYS - 1 - index) * DAY_MS + DAY_MS;
      const upTo = words.filter((row) => row.at < end);
      return { end, total: upTo.length, known: upTo.filter((row) => row.state === "known").length };
    });
  }, [words, now]);
  const top = Math.max(1, ...days.map((day) => day.total));
  // 망: 품사별(빈도 단어 목록의 품사).
  const pos = useMemo(() => {
    const bank = peekBank(language);
    const byWord = new Map((bank ?? []).map((word) => [word.w.toLowerCase(), word.pos]));
    const count: Record<string, { all: number; known: number }> = Object.fromEntries(POS_GROUPS.map((id) => [id, { all: 0, known: 0 }]));
    for (const row of words) {
      const p = byWord.get(row.word.toLowerCase());
      if (p === undefined) continue;
      const one = count[posGroup(p)]!;
      one.all += 1;
      if (row.state === "known") one.known += 1;
    }
    return POS_GROUPS.map((id) => ({ id, ...count[id]! }));
  }, [words, language]);
  const posName: Record<string, string> = { noun: ui.posNoun, verb: ui.posVerb, adj: ui.posAdj, adv: ui.posAdv, function: ui.posFunction };
  const posTop = Math.max(1, ...pos.map((one) => one.all));

  const sheet = (
        <BodyLayer>
          <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 sm:items-center" onClick={() => setOpen(false)}>
            <div
              role="dialog"
              aria-modal="true"
              data-wordbook-sheet
              onClick={(event) => event.stopPropagation()}
              className="flex max-h-[80vh] w-full max-w-md flex-col rounded-t-2xl border border-line bg-surface p-4 sm:rounded-2xl"
            >
              <div className="flex items-center gap-2">
                <h3 className="min-w-0 flex-1 text-note font-semibold text-ink">
                  {ui.vocabTitle} <span dir="ltr" className="tabular-nums text-slate-400">{words.length}</span>
                </h3>
                <button type="button" aria-label={ui.billingClose} onClick={() => setOpen(false)} className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10">
                  ✕
                </button>
              </div>
              <ul className="mt-3 flex min-h-0 flex-wrap gap-1.5 overflow-y-auto">
                {words.map((row) => (
                  <li key={row.word}>
                    <button
                      type="button"
                      onClick={() => onWord(row.word)}
                      className={`rounded-full border px-2.5 py-1 text-start text-meta ${row.state === "known" ? "border-status-mastered/40 text-good" : row.state === "learning" ? "border-status-learned/40 text-ink" : "border-line text-slate-300"}`}
                    >
                      <bdi dir="auto">{row.word}</bdi>
                      {row.gloss ? <span className="ms-1 text-slate-500">{row.gloss}</span> : null}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </BodyLayer>
  );
  if (icon) {
    return (
      <>
        <button
          type="button"
          data-wordbook-open
          aria-label={`${ui.vocabTitle} ${words.length}`}
          title={`${ui.vocabTitle} ${words.length}`}
          onClick={() => setOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-caption text-slate-400 hover:bg-white/10 hover:text-ink"
        >
          <span aria-hidden>📖</span>
        </button>
        {open ? sheet : null}
      </>
    );
  }
  return (
    <div data-wordbook className="mt-2 flex flex-col gap-1.5">
      {compact ? (
        <button type="button" data-wordbook-open onClick={() => setOpen(true)} className="flex items-center gap-2 px-1 text-start text-meta text-slate-400 hover:text-slate-200">
          <span className="min-w-0 flex-1 tabular-nums">
            {ui.vocabTitle} <span dir="ltr">{words.length}</span>
          </span>
          <span aria-hidden className="rtl:rotate-180">›</span>
        </button>
      ) : null}
      <div hidden={compact} className="flex items-center gap-2 px-1">
        <p className="min-w-0 flex-1 text-caption tabular-nums text-slate-300">
          {ui.vocabTitle} <span dir="ltr">{words.length}</span>
          {knownCount ? <span className="ms-1.5 text-meta text-slate-500">{ui.knownTag} {knownCount}</span> : null}
          {learningCount ? <span className="ms-1.5 text-meta text-slate-500">{ui.totalsLearning.replace("{n}", String(learningCount))}</span> : null}
        </p>
        <span role="group" data-wordbook-view className="flex shrink-0 rounded-full border border-line p-0.5">
          {(["graph", "net"] as const).map((one) => (
            <button
              key={one}
              type="button"
              aria-pressed={view === one}
              aria-label={one === "graph" ? ui.myViewGraph : ui.myViewNet}
              title={one === "graph" ? ui.myViewGraph : ui.myViewNet}
              onClick={() => pick(one)}
              className={`rounded-full px-2 py-1 ${view === one ? "bg-white/15 text-ink" : "text-slate-400"}`}
            >
              {/* Icons only (2026-10-29, user); the name stays in aria-label and title. */}
              {one === "graph" ? (
                <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
                  <rect x="2" y="9" width="3" height="5" fill="currentColor" />
                  <rect x="6.5" y="6" width="3" height="8" fill="currentColor" />
                  <rect x="11" y="2" width="3" height="12" fill="currentColor" />
                </svg>
              ) : (
                <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
                  <polygon points="8,1.5 14.5,6.2 12,14 4,14 1.5,6.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  <polygon points="8,5 11,7.4 9.8,11 6.2,11 5,7.4" fill="currentColor" />
                </svg>
              )}
            </button>
          ))}
        </span>
      </div>
      <button
        type="button"
        hidden={compact}
        data-wordbook-open
        aria-label={ui.vocabTitle}
        onClick={() => setOpen(true)}
        className="rounded-xl border border-line px-3 py-2 hover:bg-white/5"
      >
        {view === "graph" ? (
          <span dir="ltr" className="flex h-16 items-end gap-1">
            {days.map((day) => (
              <span key={day.end} className="relative flex h-full flex-1 items-end">
                <span className="flex w-full flex-col justify-end overflow-hidden bg-status-learned/35" style={{ height: `${Math.max(day.total ? 4 : 0, Math.round((day.total / top) * 100))}%` }}>
                  <span className="block w-full bg-status-mastered" style={{ height: day.total ? `${Math.round((day.known / day.total) * 100)}%` : 0 }} />
                </span>
              </span>
            ))}
          </span>
        ) : (
          <Net rows={pos.map((one) => ({ label: posName[one.id] ?? one.id, value: one.all / posTop, known: one.known / posTop, count: one.all }))} />
        )}
      </button>
      {open ? sheet : null}
    </div>
  );
}

/** 품사 다섯 꼭짓점 망(가장 많은 칸 = 끝). */
function Net({ rows }: { rows: readonly { label: string; value: number; known: number; count: number }[] }) {
  const width = 230;
  const height = 160;
  const cx = width / 2;
  const cy = height / 2 + 4;
  const r = 50;
  const at = (index: number, scale: number) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / rows.length;
    return [cx + Math.cos(angle) * r * scale, cy + Math.sin(angle) * r * scale] as const;
  };
  const shape = (pick: (row: (typeof rows)[number]) => number) => rows.map((row, index) => at(index, Math.max(0.04, pick(row))).join(",")).join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="mx-auto h-36 w-full max-w-xs" aria-hidden>
      <polygon points={rows.map((_, index) => at(index, 1).join(",")).join(" ")} fill="none" stroke="currentColor" className="text-white/15" />
      <polygon points={rows.map((_, index) => at(index, 0.5).join(",")).join(" ")} fill="none" stroke="currentColor" className="text-white/10" />
      <polygon points={shape((row) => row.value)} className="fill-status-learned/30 stroke-status-learned" />
      <polygon points={shape((row) => row.known)} className="fill-status-mastered/50" />
      {rows.map((row, index) => {
        const [x, y] = at(index, 1.32);
        return (
          <text key={row.label} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="fill-slate-400 text-meta" style={{ fontSize: 9 }}>
            {row.label} {row.count}
          </text>
        );
      })}
    </svg>
  );
}
