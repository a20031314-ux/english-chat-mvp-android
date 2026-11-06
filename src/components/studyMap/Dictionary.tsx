"use client";

import { useEffect, useMemo, useState } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import { TTSButton } from "@/components/TTSButton";
import { useBankTone } from "@/components/studyMap/bankTone";
import type { UICopy } from "@/lib/copy";
import { searchDictionary, type DictEntry } from "@/lib/curriculum/dictionary";
import { fetchSenses, loadDictionary, type WordSense } from "@/lib/curriculum/dictionaryLoad";
import { BANK_CHUNK, posGroup, wordKey } from "@/lib/curriculum/vocabBank";
import { grownItems, growBank } from "@/lib/curriculum/qbank";
import { cachedGlosses, fetchWordChunk } from "@/lib/curriculum/useWordBank";
import { glossFor } from "@/lib/curriculum/stageScripts";

/**
 * Quizbank 어휘 탭의 단어 사전(2026-11-04). 빈도 목록을 단어·뜻으로 찾고, 항목은 품사·단계·짧은 뜻·예문 둘.
 * 예문 파일에 둘이 안 되는 낱말은 열 때 퀴즈와 같은 문제은행(lib/curriculum/qbank.ts growBank, 열쇠 w|낱말)이 만들어 채운다
 * (2026-11-06 사용자 "검색 후 열었을 때 생성하는 흐름도") — 모두가 같이 쓰고, 검토를 거쳐 사전 파일에 올린다(scripts/dict-promote.mjs).
 */
type Shown = { text: string; gloss?: string };

/** 문제은행 예문 → 보일 줄(앱 언어 뜻). */
function grownLines(language: string, word: string, locale: string, have: readonly string[], room: number): Shown[] {
  if (room <= 0) return [];
  return grownItems(language, wordKey(word))
    .filter((item) => !have.includes(item.text))
    .slice(0, room)
    .map((item) => ({ text: item.text, gloss: glossFor(item.gloss, locale) }));
}
export function DictionaryButton({ ui, language, locale }: { ui: UICopy; language: string; locale: string }) {
  const tone = useBankTone();
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<DictEntry[] | null>(null);
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<DictEntry | null>(null);
  // 연 낱말의 예문이 둘이 안 되면: 이 폰에 받아 둔 문제은행 예문부터 보이고, 모자라면 서버에 키워 달라고(같은 열쇠는 10분에 한 번).
  const [making, setMaking] = useState<string | null>(null);
  // 앱 언어 뜻(2026-11-06 사용자 "뜻 넣어줘"): 낱말 카드 묶음(퀴즈와 같은 것 — 처음이면 서버가 묶음째 만들어 모두가 같이 씀)의 뜻과
  // 사전 예문의 앱 언어 뜻. 넣어 둔 한국어 짧은 뜻(영어 학습)은 한국어 앱에서 그대로 먼저.
  const [cardGloss, setCardGloss] = useState<Record<string, string>>({});
  const [lineGloss2, setLineGloss2] = useState<Record<string, string>>({});
  // 여러 뜻(2026-11-06 사용자 "뜻이 여러 개일 때는?" → "붙여줘"): 서버가 낱말 × 앱 언어마다 한 번 만들어 고정(server/wordSenses.ts).
  // 둘 이상이면 뜻 한 줄 대신 번호 목록(뜻 · 품사 · 그 뜻 예문). 하나면 위 뜻 한 줄 그대로.
  const [senses, setSenses] = useState<Record<string, WordSense[]>>({});
  const [grown, setGrown] = useState(0);
  const haveLines = (entry: DictEntry) => [entry.line, entry.line2?.text].filter((one): one is string => Boolean(one));
  const made = useMemo(
    () => (picked && (picked.lineCount ?? 0) < 2 ? grownLines(language, picked.word, locale, haveLines(picked), 2 - haveLines(picked).length) : []),
    // grown은 받아 온 뒤 다시 읽게 하는 표시.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [picked, language, locale, grown],
  );
  const openEntry = (entry: DictEntry) => {
    setPicked(entry);
    if (!senses[entry.word]) {
      void fetchSenses(language, locale, entry.word).then((list) => {
        if (list.length) setSenses((now) => ({ ...now, [entry.word]: list }));
      });
    }
    if (typeof entry.rank === "number" && !cardGloss[entry.word]) {
      void fetchWordChunk(language, locale, Math.floor(entry.rank / BANK_CHUNK)).then(({ cards, dict }) => {
        const words = Object.fromEntries(cards.filter((card) => typeof card.gloss === "string" && card.gloss).map((card) => [card.w, card.gloss]));
        const lines = Object.fromEntries(Object.values(dict).flat().filter((line) => typeof line.gloss === "string" && line.gloss && line.gloss !== line.text).map((line) => [line.text, line.gloss]));
        setCardGloss((now) => ({ ...now, ...words }));
        setLineGloss2((now) => ({ ...now, ...lines }));
      });
    }
    if ((entry.lineCount ?? 0) >= 2) return;
    const have = haveLines(entry);
    if (grownLines(language, entry.word, locale, have, 2 - have.length).length >= 2 - have.length) return;
    setMaking(entry.word);
    void growBank(language, locale, [{ key: wordKey(entry.word), stage: Math.min(5, entry.stage) }]).finally(() => {
      setMaking((now) => (now === entry.word ? null : now));
      setGrown((n) => n + 1);
    });
  };
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
  // 찾기·목록의 뜻: 한국어 앱은 넣어 둔 짧은 뜻, 그 밖은 이 폰에 받아 둔 카드 뜻(퀴즈·사전에서 연 묶음) — 앱 언어 아닌 뜻은 섞지 않는다.
  const shaped = useMemo(() => {
    if (!entries) return null;
    const saved = cachedGlosses(language, locale, Math.ceil(entries.length / BANK_CHUNK));
    return entries.map((entry) => {
      const gloss = (locale === "ko" ? entry.gloss : undefined) || cardGloss[entry.word] || saved.get(entry.word);
      return { ...entry, gloss };
    });
  }, [entries, language, locale, cardGloss]);
  const hits = shaped ? searchDictionary(shaped, query) : [];
  // 예문 뜻은 한국어·영어만 있다 — 한국어가 아닌 앱 언어에는 한국어를 보이지 않는다.
  const lineGloss = (entry: DictEntry) => lineGloss2[entry.line ?? ""] || (locale === "ko" ? entry.lineKo || entry.lineEn : entry.lineEn);
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
                  {(() => {
                    const many = senses[picked.word] ?? [];
                    if (many.length >= 2) {
                      return (
                        <ol data-dictionary-senses className="mt-2 flex flex-col gap-2">
                          {many.map((sense, index) => (
                            <li key={sense.gloss} className="flex gap-2">
                              <span className="w-4 shrink-0 text-meta text-slate-500">{index + 1}.</span>
                              <div className="min-w-0">
                                <p dir="auto" className="text-chat text-ink">
                                  {sense.gloss}
                                  {sense.pos ? <span className="ms-1.5 text-meta text-slate-500">{posName[posGroup(sense.pos)] ?? ""}</span> : null}
                                </p>
                                {sense.example ? <p dir="auto" className="mt-0.5 text-meta text-slate-300">{sense.example}</p> : null}
                                {sense.example && sense.exampleGloss && sense.exampleGloss !== sense.example ? <p dir="auto" className="text-meta text-slate-500">{sense.exampleGloss}</p> : null}
                              </div>
                            </li>
                          ))}
                        </ol>
                      );
                    }
                    const gloss = (locale === "ko" ? picked.gloss : undefined) || cardGloss[picked.word] || many[0]?.gloss;
                    return gloss ? <p dir="auto" data-dictionary-gloss className="mt-2 text-chat text-ink">{gloss}</p> : null;
                  })()}
                  {(() => {
                    const shown: Shown[] = [
                      ...(picked.line ? [{ text: picked.line, gloss: lineGloss(picked) }] : []),
                      ...(picked.line2 ? [{ text: picked.line2.text, gloss: lineGloss2[picked.line2.text] || (locale === "ko" ? picked.line2.ko || picked.line2.en : picked.line2.en) }] : []),
                      ...made,
                      // 여러 뜻 목록에 이미 나온 문장은 다시 보이지 않는다.
                    ].filter((one) => !(senses[picked.word] ?? []).some((sense) => (senses[picked.word]?.length ?? 0) >= 2 && sense.example === one.text));
                    const busy = making === picked.word;
                    if (!shown.length && !busy) return null;
                    return (
                      <div data-dictionary-examples className="mt-3 rounded-xl bg-white/[0.04] px-3 py-2">
                        <p className="text-meta text-slate-500">{ui.dictionaryExample}</p>
                        {shown.map((one) => (
                          <div key={one.text} className="mt-1.5 first-of-type:mt-0.5">
                            <p dir="auto" className="text-chat text-ink">{one.text}</p>
                            {one.gloss && one.gloss !== one.text ? <p dir="auto" className="mt-0.5 text-meta text-slate-400">{one.gloss}</p> : null}
                          </div>
                        ))}
                        {busy ? <p aria-busy className="mt-1.5 animate-pulse text-meta text-slate-500">…</p> : null}
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <ul className="mt-3 flex min-h-0 flex-col gap-1 overflow-y-auto">
                  {query.trim() && entries && hits.length === 0 ? <li className="px-1 py-2 text-meta text-slate-500">{ui.dictionaryEmpty}</li> : null}
                  {hits.map((entry) => (
                    <li key={entry.word}>
                      <button
                        type="button"
                        onClick={() => openEntry(entry)}
                        className="flex w-full items-baseline gap-2 rounded-xl px-2 py-1.5 text-start hover:bg-white/[0.06]"
                      >
                        <bdi dir="auto" className="text-chat text-ink">{entry.word}</bdi>
                        {entry.gloss ? <span dir="auto" className="min-w-0 truncate text-meta text-slate-400">{entry.gloss}</span> : null}
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
