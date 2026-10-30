"use client";

/**
 * 배울 수 있는 것(2026-10-31 사용자 "총체적으로 학습 가능한 분량 — 문법은 어느 범위까지, 단어 n개, 은행이 추가될 때마다 업데이트 — 학습 유인"):
 * n단계 칸 진척 아이콘 옆 책 아이콘 → 시트. 맨 위 큰 숫자(낱말 · 문법 · 표현 · 문장구조 · 상황), 아래 단계마다 문법 칸 이름과 수.
 * 진척이 아니라 범위라 내가 한 것은 세지 않는다(진척은 이름만 — 2026-10-30). 수는 curriculum/contentScope.ts, 낱말은 useWordBank wordsByStage.
 */
import { useEffect, useState } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import { apiUrl } from "@/lib/apiBase";
import type { UICopy } from "@/lib/copy";
import { contentScope, type StageScope } from "@/lib/curriculum/contentScope";
import { wordsByStage } from "@/lib/curriculum/useWordBank";

type StageNames = { order: number; title: string; grammar: string[] };
const namesCache = new Map<string, StageNames[]>();

async function stageNames(language: string, locale: string): Promise<StageNames[]> {
  const id = `${language}|${locale}`;
  const have = namesCache.get(id);
  if (have) return have;
  const body = await fetch(apiUrl(`/api/curriculum/stages?lang=${encodeURIComponent(language)}&ui=${encodeURIComponent(locale)}`))
    .then((response) => (response.ok ? (response.json() as Promise<{ stages?: { order: number; title: string; grammar?: { name: string }[] }[] }>) : null))
    .catch(() => null);
  const list = (body?.stages ?? []).map((stage) => ({ order: stage.order, title: stage.title, grammar: (stage.grammar ?? []).map((one) => one.name) }));
  if (list.length) namesCache.set(id, list);
  return list;
}

export function ContentScopeButton({ ui, locale, language }: { ui: UICopy; locale: string; language: string }) {
  const [open, setOpen] = useState(false);
  const [words, setWords] = useState<Record<number, number> | null>(null);
  const [names, setNames] = useState<StageNames[]>([]);
  useEffect(() => {
    if (!open) return;
    let alive = true;
    void wordsByStage(language).then((counts) => alive && setWords(counts));
    void stageNames(language, locale).then((list) => alive && setNames(list));
    return () => {
      alive = false;
    };
  }, [open, language, locale]);
  const scope = contentScope(language, words);
  const big: { id: string; label: string; value: number }[] = [
    { id: "words", label: ui.partVocab, value: scope.total.words },
    { id: "grammar", label: ui.partGrammar, value: scope.total.grammar },
    { id: "expressions", label: ui.partExpression, value: scope.total.expressions },
    { id: "frames", label: ui.amountFrames, value: scope.total.frames },
    { id: "scenes", label: ui.stageScriptsTitle, value: scope.total.scenes },
  ].filter((one) => one.value > 0);
  const counts = (row: StageScope) =>
    [
      [ui.partVocab, row.words],
      [ui.partExpression, row.expressions],
      [ui.amountFrames, row.frames],
      [ui.stageScriptsTitle, row.scenes],
    ]
      .filter(([, value]) => Number(value) > 0)
      .map(([label, value]) => `${label} ${Number(value).toLocaleString(locale)}`)
      .join(" · ");
  return (
    <>
      <button
        type="button"
        data-scope-open
        aria-label={ui.scopeTitle}
        title={ui.scopeTitle}
        onClick={() => setOpen(true)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-slate-300 hover:bg-white/10"
      >
        {/* Open book icon, no label (2026-10-30 icon-only rule). */}
        <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
          <path d="M8 4.2C6.6 3.2 4.6 2.8 2 3v9.2c2.6-.2 4.6.2 6 1.2 1.4-1 3.4-1.4 6-1.2V3c-2.6-.2-4.6.2-6 1.2Z" />
          <path d="M8 4.2v9.2" />
        </svg>
      </button>
      {open ? (
        <BodyLayer>
          <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 sm:items-center" onClick={() => setOpen(false)}>
            <div
              role="dialog"
              aria-modal="true"
              aria-label={ui.scopeTitle}
              data-scope-sheet
              onClick={(event) => event.stopPropagation()}
              className="flex max-h-[85vh] w-full max-w-md flex-col gap-3 overflow-y-auto rounded-t-2xl border border-line bg-surface p-4 sm:rounded-2xl"
            >
              <div className="flex items-center gap-2">
                <h3 className="min-w-0 flex-1 text-note font-semibold text-ink">{ui.scopeTitle}</h3>
                <button type="button" aria-label={ui.billingClose} onClick={() => setOpen(false)} className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10">
                  ✕
                </button>
              </div>
              <ul data-scope-total className="grid grid-cols-3 gap-2">
                {big.map((one) => (
                  <li key={one.id} data-scope-item={one.id} className="flex flex-col items-center rounded-xl border border-line px-2 py-2">
                    <span className="text-heading font-semibold text-ink">{one.value.toLocaleString(locale)}</span>
                    <span className="text-meta text-slate-400">{one.label}</span>
                  </li>
                ))}
              </ul>
              <ol className="flex flex-col gap-2">
                {scope.stages.map((row) => {
                  const named = names.find((one) => one.order === row.stage);
                  return (
                    <li key={row.stage} data-scope-stage={row.stage} className="rounded-xl border border-line p-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-note font-semibold text-ink">{ui.stageNumber.replace("{n}", String(row.stage))}</span>
                        {named?.title ? <span className="min-w-0 flex-1 truncate text-meta text-slate-400">{named.title}</span> : null}
                      </div>
                      {named?.grammar.length ? (
                        <ul className="mt-1.5 flex flex-wrap gap-1">
                          {named.grammar.map((name) => (
                            <li key={name} dir="auto" className="rounded-full bg-white/5 px-2 py-0.5 text-meta text-slate-300">
                              {name}
                            </li>
                          ))}
                        </ul>
                      ) : row.grammar ? (
                        <p className="mt-1 text-meta text-slate-400">{`${ui.partGrammar} ${row.grammar}`}</p>
                      ) : null}
                      <p className="mt-1.5 text-meta text-slate-400">{counts(row)}</p>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </BodyLayer>
      ) : null}
    </>
  );
}
