"use client";

import { NativeAdSlot } from "@/components/NativeAdSlot";
import { BankFlip } from "@/components/studyMap/BankFlip";
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import type { UICopy } from "@/lib/copy";
import { DictionaryBody } from "@/components/studyMap/Dictionary";
import { loadBank, posGroup, stageOfRank, type BankWord } from "@/lib/curriculum/vocabBank";
import { ladderFor } from "@/lib/curriculum/stages/index";
import { glossFor } from "@/lib/curriculum/stageScripts";
import { openLesson } from "@/lib/appIntents";
import { LETTERS_OPEN_EVENT, takeLettersOpen } from "@/lib/curriculum/lettersOpen";
import { LEDGER_EVENT, readLedger } from "@/lib/curriculum/logLedger";
import { estimateChance, latestCheck } from "@/lib/curriculum/skillCheck";
import { oftenUsed, talkCounts } from "@/lib/curriculum/wordUse";

/**
 * Languagebank 탭 — Stagebank 자리의 사전(2026-11-06 개편 1단계, 스위치 lib/reform.ts). 설계 hub/work/drafts/languagebank-2026-11-03.md,
 * 시안 https://claude.ai/artifact/Bzy6aC9rEvoonjYVTq4WtW "Languagebank 탭".
 *
 * - 맨 위 찾기(단어 사전 — studyMap/Dictionary DictionaryBody, 낱말을 열면 그 낱말 화면).
 * - 전체보기: 단어·표현·문법 띠 하나씩 — 난이도 구간 폭 = 그 구간 개수, 색 진하기 = 어림(아마 앎) 이어서 흐려짐, 비율 + ?.
 *   단어 어림 = 퀴즈 수준 맞추기 경계(vocabLevel levelOf·knowChance, 이 폰 quizCircle.v1). 표현·문법은 순위가 없어 난이도 안 차례를
 *   같은 눈금에 놓고 같은 경계로(시안과 같음 — 체크 셋을 만들 때 바꿈).
 * - 종류 화면: 줄(단어 = 주제 | 품사, 표현·문법 = 난이도) × 열(난이도), 칸 = 비율·개수, 누르면 아래 묶음.
 * - 묶음: 칩(진하기 = 어림), 낱말 → 사전 낱말 화면, 표현·문법 → 그 수업(openLesson, studyMap/LessonHost).
 * 학습한 단어 표시는 여기 없음(사용자 2026-11-06 — 낱말 화면과 Logbank에만).
 * 자주 쓴 말(2026-11-09): 전체보기 맨 위에 대화에서 많이 쓴 낱말·표현 줄(숫자 = 대화 수, wordUse.ts), 묶음 순서 [학습 | 대화] — 칠하기·학습한 수는 퀴즈 그대로.
 * 2026-11-09(사용자 "옛 상태의 데이터, 이름들은 다 삭제"): 칠하기·숫자는 학습한 것만(studyTimeline.ts knowTag — 학습 · n번 학습 · 자주 씀), 어림·체크 셋·내 것 곡선은 뺌. 아래는 그 전.
 * 2026-11-07(사용자 "데이터상 맞지 않는 것들도"): 표현·문법은 낱말 어림을 빌리지 않고 체크 셋(사건 장부 — 앎 1 · 적용이 힘듦 ½ · 처음 봄 0)으로.
 * 예전엔 낱말 경계를 표현·문법에도 씌워 세 종류 %가 늘 같았다(체감 점검 11-07). 낱말만 어림(~).
 */
type Kind = "word" | "expr" | "gram";
type Item = { key: string; name: string; lv: number; rank: number; group: string; word?: string };
type View = { kind: Kind | null; axis: "topic" | "pos"; row: string | null; lv: number | null };

const STARTS = [0, 0, 700, 1500, 2500, 3500, 5000, 7000];
const ribbon = (items: readonly Item[], chance: (one: Item) => number): CSSProperties => {
  if (!items.length) return { background: "color-mix(in oklab, var(--color-status-learned) 4%, transparent)" };
  const sorted = [...items].sort((a, b) => a.rank - b.rank);
  const steps = Math.min(10, sorted.length);
  const stops = Array.from({ length: steps }, (_, i) => {
    const one = sorted[Math.floor((i * (sorted.length - 1)) / Math.max(1, steps - 1))]!;
    return `color-mix(in oklab, var(--color-status-learned) ${Math.round(6 + 80 * chance(one))}%, transparent) ${Math.round((100 * i) / Math.max(1, steps - 1))}%`;
  });
  return { background: steps > 1 ? `linear-gradient(90deg, ${stops.join(", ")})` : stops[0]!.split(" ").slice(0, -1).join(" ") };
};

/** 표현·문법은 난이도 안 차례대로 그 단계 순위 구간에 고르게 놓는다. */
function placed(items: Omit<Item, "rank">[]): Item[] {
  const by = new Map<number, Omit<Item, "rank">[]>();
  for (const one of items) by.set(one.lv, [...(by.get(one.lv) ?? []), one]);
  return items.map((one) => {
    const list = by.get(one.lv)!;
    const at = list.indexOf(one);
    const a = STARTS[one.lv] ?? 0;
    const b = STARTS[one.lv + 1] ?? a + 1000;
    return { ...one, rank: a + ((at + 0.5) / list.length) * (b - a) };
  });
}

/**
 * letters: 글자가 다른 학습 언어의 글자·소리 칸(2026-11-07 사용자 "0단계 … 사전 중 하나로 편입") — row는 개관 줄(누르면 열기), body는 칸 안.
 * 오늘 카드·통화 숙제가 openLettersBank로 열면(curriculum/lettersOpen.ts) 이 칸이 바로 열린다.
 */
export function LanguageBank({
  ui,
  language,
  locale,
  stage,
  letters,
}: {
  ui: UICopy;
  language: string;
  locale: string;
  stage: number;
  letters?: { row: (open: () => void) => ReactNode; body: ReactNode };
}) {
  const [word, setWord] = useState<string | null>(null);
  const [lettersView, setLettersView] = useState(() => Boolean(letters) && takeLettersOpen(language));
  useEffect(() => {
    if (!letters) return;
    const on = (event: Event) => {
      const detail = (event as CustomEvent<{ language?: string }>).detail;
      if (detail?.language && detail.language !== language) return;
      takeLettersOpen(language);
      setLettersView(true);
      setWord(null);
    };
    window.addEventListener(LETTERS_OPEN_EVENT, on);
    return () => window.removeEventListener(LETTERS_OPEN_EVENT, on);
  }, [letters, language]);
  const [words, setWords] = useState<readonly BankWord[] | null>(null);
  const [view, setView] = useState<View>({ kind: null, axis: "topic", row: null, lv: null });
  const [help, setHelp] = useState(false);
  const [flip, setFlip] = useState<string[] | null>(null);
  // 묶음 순서: 학습(난이도 순 그대로) | 대화(대화에서 쓴 수 많은 것부터) — 숫자는 섞지 않는다(2026-11-09).
  const [order, setOrder] = useState<"quiz" | "talk">("quiz");
  useEffect(() => {
    let live = true;
    void loadBank(language).then((list) => {
      if (!live) return;
      setWords(list);
    });
    return () => {
      live = false;
    };
  }, [language, stage]);
  const [ledgerTick, setLedgerTick] = useState(0);
  useEffect(() => {
    const on = () => setLedgerTick((n) => n + 1);
    window.addEventListener(LEDGER_EVENT, on);
    return () => window.removeEventListener(LEDGER_EVENT, on);
  }, []);
  const ledger = useMemo(() => {
    void ledgerTick;
    return readLedger(language);
  }, [language, ledgerTick]);
  // 칠하기 = 추정(2026-11-09 사용자 "추정을 다시 넣고, 학습 단어는 해당 카드에만"): 가장 최근 첫 측정·실력 확인 하나로
  // 칸마다 아는 정도(skillCheck.ts estimateChance)를 칠하기로만. 학습(퀴즈 기록)은 낱말 카드에만. 잰 적이 없으면 칠하지 않음.
  const check = useMemo(() => {
    void ledgerTick;
    return latestCheck(language);
  }, [language, ledgerTick]);
  // 대화에서 쓴 수(curriculum/wordUse.ts) — 퀴즈 칠하기와 따로, 자주 쓴 말 줄·대화 순서에만.
  const talks = useMemo(() => talkCounts(ledger), [ledger]);
  const often = useMemo(() => oftenUsed(ledger, 8), [ledger]);
  const items = useMemo(() => {
    const ladder = ladderFor(language);
    const wordItems: Item[] = (words ?? []).map((one, rank) => ({
      key: `w|${one.w}`,
      name: one.w,
      word: one.w,
      lv: stageOfRank(language, rank),
      rank,
      group: one.topic ?? "function",
    }));
    const posOf = new Map((words ?? []).map((one) => [one.w, posGroup(one.pos)]));
    const expr = placed((ladder?.stages ?? []).flatMap((st) => st.expressions.map((e) => ({ key: `e|${e}`, name: e, lv: st.order, group: String(st.order) }))));
    const gram = placed(
      (ladder?.stages ?? []).flatMap((st) => st.grammar.map((g, index) => ({ key: `g|${st.order}:${index}`, name: glossFor(g.name, locale), lv: st.order, group: String(st.order) }))),
    );
    return { word: wordItems, expr, gram, posOf };
  }, [words, language, locale]);
  // 낱말 곡선의 합을 잰 경계 b에 맞춘다 — 곡선 꼬리 때문에 칠한 양이 실력 확인 표(≈b)보다 커지지 않게.
  const wordScale = useMemo(() => {
    if (!check) return 1;
    const sum = items.word.reduce((total, one) => total + estimateChance(check, { kind: "word", rank: one.rank, lv: one.lv }), 0);
    return sum > 0 ? Math.min(1, check.b / sum) : 1;
  }, [check, items.word]);
  const valueOf = (one: Item) => {
    if (!check) return 0;
    const kind = one.key.startsWith("w|") ? "word" : one.key.startsWith("e|") ? "expr" : "gram";
    const chance = estimateChance(check, { kind, rank: one.rank, lv: one.lv });
    return kind === "word" ? Math.min(1, chance * wordScale) : chance;
  };
  // 숫자 = 개수만(2026-11-09 사용자 "채워진 숫자보다 색깔로만, 수치는 단어 개수만") — 추정은 칠하기로만. 아랍어 화면에서도 묶어 둠(LRI … PDI).
  const countOf = (list: readonly Item[]) => (list.length ? `\u2066${list.length.toLocaleString()}\u2069` : "");
  const kindName: Record<Kind, string> = { word: ui.partVocab, expr: ui.partExpression, gram: ui.partGrammar };
  const levels = (kind: Kind) => (kind === "word" ? [1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5]);
  const lvName = (lv: number) => (lv === 6 ? ui.lbExtended : String(lv));
  const topicName: Record<string, string> = {
    people: ui.topicPeople, food: ui.topicFood, home: ui.topicHome, work: ui.topicWork, health: ui.topicHealth, travel: ui.topicTravel, shopping: ui.topicShopping,
    time: ui.topicTime, feelings: ui.topicFeelings, actions: ui.topicActions, describing: ui.topicDescribing, nature: ui.topicNature, society: ui.topicSociety, function: ui.topicFunction,
  };
  const posName: Record<string, string> = { noun: ui.posNoun, verb: ui.posVerb, adj: ui.posAdj, adv: ui.posAdv, function: ui.posFunction };
  const rowOf = (kind: Kind, one: Item) => (kind === "word" ? (view.axis === "pos" ? items.posOf.get(one.word ?? "") ?? "function" : one.group) : String(one.lv));
  const openItem = (kind: Kind, one: Item) => {
    if (kind === "word") setWord(one.word ?? null);
    else openLesson({ language, key: one.key });
  };
  const helpButton = (
    <button type="button" data-lb-help aria-label={ui.lbEstimate} title={ui.lbEstimate} onClick={() => setHelp((on) => !on)} className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line text-meta text-slate-400">
      ?
    </button>
  );
  const toAll = () => {
    setLettersView(false);
    setView({ kind: null, axis: "topic", row: null, lv: null });
  };
  const crumbs: { label: string; go: () => void }[] = [{ label: ui.vocabByAll, go: toAll }];
  if (lettersView && letters) crumbs.push({ label: ui.notebookScript, go: () => undefined });
  else if (view.kind) crumbs.push({ label: kindName[view.kind], go: () => setView({ ...view, row: null, lv: null }) });
  const kind = view.kind;
  const bundle =
    kind && (view.row || view.lv)
      ? items[kind]
          .filter((one) => (!view.row || rowOf(kind, one) === view.row) && (!view.lv || one.lv === view.lv))
          .sort((a, b) => (order === "talk" ? (talks.get(b.key) ?? 0) - (talks.get(a.key) ?? 0) : 0) || a.rank - b.rank)
      : null;
  if (kind && bundle) {
    const rowLabel = view.row ? (kind === "word" ? (view.axis === "pos" ? posName[view.row] : topicName[view.row]) ?? view.row : "") : "";
    crumbs.push({ label: [view.lv ? ui.dictionaryStage.replace("{n}", lvName(view.lv)) : "", rowLabel].filter(Boolean).join(" · "), go: () => undefined });
  }
  return (
    <div data-languagebank className="flex flex-col gap-3">
      {/* 찾기 · 낱말 화면(단어 사전과 같은 몸통). 낱말을 열면 아래 색인은 숨긴다. */}
      <div data-lb-search className="flex min-h-0 flex-col">
        <DictionaryBody ui={ui} language={language} locale={locale} word={word} onIndex={() => setWord(null)} onPick={(w) => setWord(w)} />
      </div>
      {word ? null : (
        <>
          <nav aria-label={ui.languagebankTitle} className="flex flex-wrap items-center gap-1.5 text-note">
            {crumbs.map((one, index) => (
              <span key={`${one.label}-${index}`} className="flex items-center gap-1.5">
                {index ? <span aria-hidden className="text-slate-600 rtl:rotate-180">›</span> : null}
                <button type="button" onClick={one.go} className={index === crumbs.length - 1 ? "font-semibold text-ink" : "text-slate-400 hover:text-ink"}>
                  {one.label}
                </button>
              </span>
            ))}
            <span className="flex-1" />
            {helpButton}
          </nav>
          {help ? (
            <div role="note" data-lb-help-note className="flex items-start gap-2 rounded-xl border border-line bg-surface-raised px-3 py-2 text-caption text-slate-200">
              <span className="flex-1">{ui.lbEstimateHelp}</span>
              <button type="button" aria-label={ui.billingClose} onClick={() => setHelp(false)} className="text-slate-500">
                ✕
              </button>
            </div>
          ) : null}
          {lettersView && letters ? <div data-lb-letters>{letters.body}</div> : null}
          {!lettersView && letters && !kind ? letters.row(() => setLettersView(true)) : null}
          {lettersView ? null : !words ? <p className="py-6 text-center text-meta text-slate-500">…</p> : null}
          {!lettersView && words && !kind && often.length ? (
            <section data-lb-often className="rounded-2xl border border-line bg-surface p-3">
              <p className="text-note font-semibold text-info">{ui.lbOftenUsed}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {often.map((one) => (
                  <button
                    key={one.key}
                    type="button"
                    dir="auto"
                    data-lb-often-key={one.key}
                    onClick={() => (one.key.startsWith("w|") ? setWord(one.key.slice(2)) : openLesson({ language, key: one.key }))}
                    className="flex items-baseline gap-1.5 rounded-lg border border-line px-2.5 py-1 text-note text-ink hover:bg-white/5"
                  >
                    {one.key.slice(2)}
                    <span className="text-meta tabular-nums text-info">{one.n}</span>
                  </button>
                ))}
              </div>
            </section>
          ) : null}
          {!lettersView && words && !kind
            ? (["word", "expr", "gram"] as const).map((k) => {
                const all = items[k];
                if (!all.length) return null;
                return (
                  <section key={k} data-lb-kind={k} className="rounded-2xl border border-line bg-surface p-3">
                    <button type="button" onClick={() => setView({ kind: k, axis: "topic", row: null, lv: null })} className="flex w-full items-baseline gap-2 text-start">
                      <span className="text-note font-semibold text-status-learned">{kindName[k]}</span>
                      <span className="flex-1" />
                      <span className="text-title font-semibold text-ink">{countOf(all)}</span>
                      <span aria-hidden className="text-slate-500 rtl:rotate-180">›</span>
                    </button>
                    <div className="mt-2 flex gap-1">
                      {levels(k).map((lv) => {
                        const part = all.filter((one) => one.lv === lv);
                        if (!part.length) return null;
                        return (
                          <button
                            key={lv}
                            type="button"
                            aria-label={`${kindName[k]} ${ui.dictionaryStage.replace("{n}", lvName(lv))} ${countOf(part)}`}
                            onClick={() => setView({ kind: k, axis: "topic", row: null, lv })}
                            className="flex min-w-[1.75rem] flex-col gap-1"
                            style={{ flexGrow: part.length, flexBasis: 0 }}
                          >
                            <span className="block h-9 rounded-lg" style={ribbon(part, valueOf)} />
                            <span className="text-center text-meta text-slate-500">{lvName(lv)}</span>
                            <span className="text-center text-meta text-slate-400">{countOf(part)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                );
              })
            : null}
          {!lettersView && words && kind ? (
            <>
              {kind === "word" ? (
                <div className="flex gap-1.5">
                  {(["topic", "pos"] as const).map((axis) => (
                    <button
                      key={axis}
                      type="button"
                      aria-pressed={view.axis === axis}
                      onClick={() => setView({ ...view, axis, row: null })}
                      className={`rounded-lg border px-3 py-1 text-caption ${view.axis === axis ? "border-status-learned/50 bg-status-learned/10 font-semibold text-status-learned" : "border-line text-slate-400"}`}
                    >
                      {axis === "topic" ? ui.vocabByTopic : ui.vocabByPos}
                    </button>
                  ))}
                </div>
              ) : null}
              <div className="grid gap-1" style={{ gridTemplateColumns: `4.5rem repeat(${levels(kind).length}, minmax(0, 1fr))` }}>
                <span />
                {levels(kind).map((lv) => (
                  <button key={lv} type="button" onClick={() => setView({ ...view, row: null, lv })} className={`rounded-lg py-0.5 text-meta ${view.lv === lv && !view.row ? "bg-status-learned/15 text-status-learned" : "text-slate-500"}`}>
                    {lvName(lv)}
                  </button>
                ))}
                {(kind === "word" ? Object.keys(view.axis === "pos" ? posName : topicName) : ["all"]).map((row) => {
                  const inRow = kind === "word" ? items[kind].filter((one) => rowOf(kind, one) === row) : items[kind];
                  if (!inRow.length) return null;
                  return (
                    <div key={row} className="contents">
                      <button
                        type="button"
                        disabled={kind !== "word"}
                        onClick={() => setView({ ...view, row, lv: null })}
                        className={`truncate text-start text-meta ${view.row === row && !view.lv ? "text-status-learned" : "text-slate-400"}`}
                      >
                        {kind === "word" ? (view.axis === "pos" ? posName[row] : topicName[row]) : kindName[kind]}
                      </button>
                      {levels(kind).map((lv) => {
                        const cell = inRow.filter((one) => one.lv === lv);
                        const on = (view.row === row || kind !== "word") && view.lv === lv;
                        return (
                          <button
                            key={lv}
                            type="button"
                            disabled={!cell.length}
                            data-lb-cell
                            onClick={() => setView({ ...view, row: kind === "word" ? row : null, lv })}
                            className={`flex h-10 flex-col items-center justify-center rounded-lg border leading-tight ${on ? "border-ink" : "border-line"}`}
                            style={ribbon(cell, valueOf)}
                          >
                            <span className="text-caption font-semibold text-ink">{countOf(cell)}</span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
              {bundle ? (
                <section data-lb-bundle className="rounded-2xl border border-line bg-surface p-3">
                  <div className="flex items-center gap-2">
                    <p className="flex-1 text-meta text-slate-400">
                      {countOf(bundle)}
                    </p>
                    <div className="flex gap-1" role="group">
                      {(["quiz", "talk"] as const).map((one) => (
                        <button
                          key={one}
                          type="button"
                          data-lb-order={one}
                          aria-pressed={order === one}
                          onClick={() => setOrder(one)}
                          className={`rounded-lg border px-2 py-0.5 text-meta ${order === one ? "border-status-learned/50 bg-status-learned/10 font-semibold text-status-learned" : "border-line text-slate-400"}`}
                        >
                          {one === "quiz" ? ui.quizTag : ui.homeTabTalk}
                        </button>
                      ))}
                    </div>
                    {/* 넘겨 보기(2026-11-08): 단어 묶음만 — 표현·문법은 수업으로 연다. */}
                    {kind === "word" ? (
                      <button type="button" data-lb-flip aria-label={ui.flipStart} title={ui.flipStart} onClick={() => setFlip(bundle.map((one) => one.word ?? one.name))} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-note text-slate-900">
                        <span aria-hidden>▶</span>
                      </button>
                    ) : null}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {bundle.slice(0, 200).map((one) => (
                      <button key={one.key} type="button" dir="auto" onClick={() => openItem(kind, one)} className="flex items-baseline gap-1.5 rounded-lg border border-line px-2.5 py-1 text-note text-ink">
                        {one.name}
                        {order === "talk" && talks.get(one.key) ? <span className="text-meta tabular-nums text-info">{talks.get(one.key)}</span> : null}
                      </button>
                    ))}
                  </div>
                </section>
              ) : null}
            </>
          ) : null}
        </>
      )}
      {/* Languagebank 맨 끝 네이티브 하나(색인·묶음·낱말 화면 아래 — 둘러보는 목록 끝, 바닥 칸·전체 화면 모두, 글자 연습 중에는 없음). */}
      {lettersView ? null : <NativeAdSlot feedId="my-full" slotKey="langbank-list" spaced />}
      {flip ? <BankFlip ui={ui} language={language} locale={locale} words={flip} onClose={() => setFlip(null)} /> : null}
    </div>
  );
}


