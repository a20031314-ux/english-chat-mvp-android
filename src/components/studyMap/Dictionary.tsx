"use client";

import { useEffect, useState } from "react";
import { noteLedger } from "@/lib/curriculum/logLedger";
import { BodyLayer } from "@/components/FullScreenLayer";
import { TTSButton } from "@/components/TTSButton";
import { useBankTone } from "@/components/studyMap/bankTone";
import type { UICopy } from "@/lib/copy";
import { searchDictionary, type DictEntry } from "@/lib/curriculum/dictionary";
import { loadDictionary } from "@/lib/curriculum/dictionaryLoad";
import { posGroup } from "@/lib/curriculum/vocabBank";

/**
 * Quizbank 어휘 탭의 단어 사전(2026-11-04). 빈도 목록을 단어·뜻으로 찾고, 항목은 품사·단계·짧은 뜻·예문 하나.
 */
export function DictionaryButton({ ui, language, locale }: { ui: UICopy; language: string; locale: string }) {
  const tone = useBankTone();
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<DictEntry[] | null>(null);
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<DictEntry | null>(null);
  useEffect(() => {
    if (!open || entries) return;
    let live = true;
    void loadDictionary(language).then((list) => {
      if (live) setEntries(list);
    });
    return () => {
      live = false;
    };
  }, [open, entries, language]);
  const posName: Record<string, string> = { noun: ui.posNoun, verb: ui.posVerb, adj: ui.posAdj, adv: ui.posAdv, function: ui.posFunction };
  const hits = entries ? searchDictionary(entries, query) : [];
  // 예문 뜻은 한국어·영어만 있다 — 한국어가 아닌 앱 언어에는 한국어를 보이지 않는다.
  const lineGloss = (entry: DictEntry) => (locale === "ko" ? entry.lineKo || entry.lineEn : entry.lineEn);
  return (
    <>
      <button
        type="button"
        data-dictionary-open
        aria-label={ui.dictionaryTitle}
        title={ui.dictionaryTitle}
        onClick={() => setOpen(true)}
        className="flex h-8 w-8 items-center justify-center rounded-full text-caption text-slate-400 hover:bg-white/10 hover:text-ink"
      >
        <span aria-hidden>📕</span>
      </button>
      {open ? (
        <BodyLayer>
          <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 sm:items-center" onClick={() => setOpen(false)}>
            <div
              role="dialog"
              aria-modal="true"
              data-dictionary
              onClick={(event) => event.stopPropagation()}
              className="flex max-h-[80vh] w-full max-w-md flex-col rounded-t-2xl border border-line bg-surface p-4 sm:rounded-2xl"
            >
              <div className="flex items-center gap-2">
                <h3 className="min-w-0 flex-1 text-note font-semibold text-ink">{ui.dictionaryTitle}</h3>
                <button type="button" aria-label={ui.billingClose} onClick={() => setOpen(false)} className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10">
                  ✕
                </button>
              </div>
              <form
                role="search"
                className="mt-3"
                onSubmit={(event) => event.preventDefault()}
              >
                <input
                  dir="auto"
                  value={query}
                  aria-label={ui.dictionarySearch}
                  placeholder={ui.dictionarySearch}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setPicked(null);
                  }}
                  className={`w-full rounded-xl border border-line bg-transparent px-3 py-2 text-chat text-slate-100 outline-none ${tone.focus}`}
                />
              </form>
              {picked ? (
                <div data-dictionary-entry className="mt-3 min-h-0 overflow-y-auto">
                  <button type="button" onClick={() => setPicked(null)} className="text-meta text-slate-400 hover:text-ink">
                    <span aria-hidden className="rtl:rotate-180">‹ </span>
                    {ui.dictionaryTitle}
                  </button>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <p dir="auto" className="text-xl font-semibold text-ink">{picked.word}</p>
                    <TTSButton text={picked.word} ariaLabel={ui.listen} />
                  </div>
                  {picked.reading ? <p dir="auto" className="mt-0.5 text-meta text-slate-400">{picked.reading}</p> : null}
                  <p className="mt-1 text-meta text-slate-400">
                    {posName[posGroup(picked.pos)] ?? picked.pos}
                    <span className="mx-1.5">·</span>
                    {ui.dictionaryStage.replace("{n}", String(picked.stage))}
                  </p>
                  {locale === "ko" && picked.gloss ? <p dir="auto" className="mt-2 text-chat text-ink">{picked.gloss}</p> : null}
                  {picked.line ? (
                    <div className="mt-3 rounded-xl bg-white/[0.04] px-3 py-2">
                      <p className="text-meta text-slate-500">{ui.dictionaryExample}</p>
                      <p dir="auto" className="mt-0.5 text-chat text-ink">{picked.line}</p>
                      {lineGloss(picked) ? <p dir="auto" className="mt-0.5 text-meta text-slate-400">{lineGloss(picked)}</p> : null}
                    </div>
                  ) : null}
                </div>
              ) : (
                <ul className="mt-3 flex min-h-0 flex-col gap-1 overflow-y-auto">
                  {query.trim() && entries && hits.length === 0 ? <li className="px-1 py-2 text-meta text-slate-500">{ui.dictionaryEmpty}</li> : null}
                  {hits.map((entry) => (
                    <li key={entry.word}>
                      <button
                        type="button"
                        onClick={() => {
                          setPicked(entry);
                          noteLedger(language, [{ k: `w|${entry.word.toLocaleLowerCase()}`, src: "dict", r: "look" }]);
                        }}
                        className="flex w-full items-baseline gap-2 rounded-xl px-2 py-1.5 text-start hover:bg-white/[0.06]"
                      >
                        <bdi dir="auto" className="text-chat text-ink">{entry.word}</bdi>
                        {locale === "ko" && entry.gloss ? <span dir="auto" className="min-w-0 truncate text-meta text-slate-400">{entry.gloss}</span> : null}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </BodyLayer>
      ) : null}
    </>
  );
}
