"use client";

import { BankFlip } from "@/components/studyMap/BankFlip";
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import type { UICopy } from "@/lib/copy";
import { DictionaryBody } from "@/components/studyMap/Dictionary";
import { loadBank, posGroup, stageCuts, stageOfRank, type BankWord } from "@/lib/curriculum/vocabBank";
import { knowChance, levelOf, type Level } from "@/lib/curriculum/vocabLevel";
import { emptyCircle, type Circle } from "@/lib/curriculum/circle";
import { ladderFor } from "@/lib/curriculum/stages/index";
import { glossFor } from "@/lib/curriculum/stageScripts";
import { openLesson } from "@/lib/appIntents";
import { LETTERS_OPEN_EVENT, takeLettersOpen } from "@/lib/curriculum/lettersOpen";
import { LEDGER_EVENT, readLedger } from "@/lib/curriculum/logLedger";
import { checkStates } from "@/lib/curriculum/checkState";
import { ownCurve, type OwnPoint } from "@/lib/curriculum/learnedView";

/**
 * Languagebank 탭 — Stagebank 자리의 사전(2026-11-06 개편 1단계, 스위치 lib/reform.ts). 설계 hub/drafts/languagebank-2026-11-03.md,
 * 시안 https://claude.ai/artifact/Bzy6aC9rEvoonjYVTq4WtW "Languagebank 탭".
 *
 * - 맨 위 찾기(단어 사전 — studyMap/Dictionary DictionaryBody, 낱말을 열면 그 낱말 화면).
 * - 전체보기: 단어·표현·문법 띠 하나씩 — 난이도 구간 폭 = 그 구간 개수, 색 진하기 = 어림(아마 앎) 이어서 흐려짐, 비율 + ?.
 *   단어 어림 = 퀴즈 수준 맞추기 경계(vocabLevel levelOf·knowChance, 이 폰 quizCircle.v1). 표현·문법은 순위가 없어 난이도 안 차례를
 *   같은 눈금에 놓고 같은 경계로(시안과 같음 — 체크 셋을 만들 때 바꿈).
 * - 종류 화면: 줄(단어 = 주제 | 품사, 표현·문법 = 난이도) × 열(난이도), 칸 = 비율·개수, 누르면 아래 묶음.
 * - 묶음: 칩(진하기 = 어림), 낱말 → 사전 낱말 화면, 표현·문법 → 그 수업(openLesson, studyMap/LessonHost).
 * 학습한 단어 표시는 여기 없음(사용자 2026-11-06 — 낱말 화면과 Logbank에만).
 * 2026-11-07(사용자 "데이터상 맞지 않는 것들도"): 표현·문법은 낱말 어림을 빌리지 않고 체크 셋(사건 장부 — 앎 1 · 적용이 힘듦 ½ · 처음 봄 0)으로.
 * 예전엔 낱말 경계를 표현·문법에도 씌워 세 종류 %가 늘 같았다(체감 점검 11-07). 낱말만 어림(~).
 */
type Kind = "word" | "expr" | "gram";
type Item = { key: string; name: string; lv: number; rank: number; group: string; word?: string };
type View = { kind: Kind | null; axis: "topic" | "pos"; row: string | null; lv: number | null };

const STARTS = [0, 0, 700, 1500, 2500, 3500, 5000, 7000];
const tint = (p: number): CSSProperties => ({ background: `color-mix(in oklab, var(--color-status-learned) ${Math.round(6 + 80 * p)}%, transparent)` });
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

function readLevel(language: string, stage: number): Level {
  let circle: Circle = emptyCircle();
  try {
    const raw = JSON.parse(localStorage.getItem(`quizCircle.v1.${language}`) ?? "null") as Circle | null;
    if (raw && typeof raw.size === "number" && raw.items) circle = raw;
  } catch {
    // 없으면 처음 어림.
  }
  return levelOf(circle, Math.max(1, stage), stageCuts(language));
}

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
  const [level, setLevel] = useState<Level | null>(null);
  useEffect(() => {
    let live = true;
    void loadBank(language).then((list) => {
      if (!live) return;
      setWords(list);
      setLevel(readLevel(language, stage));
    });
    return () => {
      live = false;
    };
  }, [language, stage]);
  const chance = (rank: number) => (level ? knowChance(level, rank) : 0);
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
  const states = useMemo(() => checkStates(ledger), [ledger]);
  const valueOf = (one: Item) => {
    if (one.key.startsWith("w|")) return chance(one.rank);
    const level = states.get(one.key)?.level;
    return level === "known" ? 1 : level === "hard" ? 0.5 : 0;
  };
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
  const avg = (list: readonly Item[]) => (list.length ? list.reduce((sum, one) => sum + valueOf(one), 0) / list.length : 0);
  // 낱말은 어림이라 "~", 표현·문법은 체크 셋 그대로.
  const pct = (list: readonly Item[]) => (list.length ? `${list[0]!.key.startsWith("w|") ? "~" : ""}${Math.round(100 * avg(list))}%` : "");
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
  const bundle = kind && (view.row || view.lv) ? items[kind].filter((one) => (!view.row || rowOf(kind, one) === view.row) && (!view.lv || one.lv === view.lv)).sort((a, b) => a.rank - b.rank) : null;
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
          {lettersView ? null : !words || !level ? <p className="py-6 text-center text-meta text-slate-500">…</p> : null}
          {!lettersView && words && level && !kind
            ? (["word", "expr", "gram"] as const).map((k) => {
                const all = items[k];
                if (!all.length) return null;
                return (
                  <section key={k} data-lb-kind={k} className="rounded-2xl border border-line bg-surface p-3">
                    <button type="button" onClick={() => setView({ kind: k, axis: "topic", row: null, lv: null })} className="flex w-full items-baseline gap-2 text-start">
                      <span className="text-note font-semibold text-status-learned">{kindName[k]}</span>
                      <span className="text-meta text-slate-500">{all.length.toLocaleString()}</span>
                      <span className="flex-1" />
                      <span className="text-title font-semibold text-ink">{pct(all)}</span>
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
                            aria-label={`${kindName[k]} ${ui.dictionaryStage.replace("{n}", lvName(lv))} ${pct(part)}`}
                            onClick={() => setView({ kind: k, axis: "topic", row: null, lv })}
                            className="flex min-w-[1.75rem] flex-col gap-1"
                            style={{ flexGrow: part.length, flexBasis: 0 }}
                          >
                            <span className="block h-9 rounded-lg" style={ribbon(part, valueOf)} />
                            <span className="text-center text-meta text-slate-500">{lvName(lv)}</span>
                            <span className="text-center text-meta text-slate-400">{pct(part)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                );
              })
            : null}
          {!lettersView && words && level && kind ? (
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
              <OwnCurve ui={ui} points={ownPoints(ledger, new Set(items[kind].map((one) => one.key)))} />
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
                            <span className="text-caption font-semibold text-ink">{pct(cell)}</span>
                            <span className="text-meta text-slate-400">{cell.length || ""}</span>
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
                      {bundle.length.toLocaleString()} · {pct(bundle)}
                    </p>
                    {/* 넘겨 보기(2026-11-08): 단어 묶음만 — 표현·문법은 수업으로 연다. */}
                    {kind === "word" ? (
                      <button type="button" data-lb-flip aria-label={ui.flipStart} title={ui.flipStart} onClick={() => setFlip(bundle.map((one) => one.word ?? one.name))} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-note text-slate-900">
                        <span aria-hidden>▶</span>
                      </button>
                    ) : null}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {bundle.slice(0, 200).map((one) => (
                      <button key={one.key} type="button" dir="auto" onClick={() => openItem(kind, one)} className="rounded-lg border border-line px-2.5 py-1 text-note text-ink" style={tint(valueOf(one))}>
                        {one.name}
                      </button>
                    ))}
                  </div>
                </section>
              ) : null}
            </>
          ) : null}
        </>
      )}
      {flip ? <BankFlip ui={ui} language={language} locale={locale} words={flip} onClose={() => setFlip(null)} /> : null}
    </div>
  );
}

/** 최근 이 폰 날짜 n일(오래된 것부터, 오늘까지). */
function recentDays(n: number): { days: string[]; today: string } {
  const pad = (v: number) => String(v).padStart(2, "0");
  const key = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const now = new Date();
  const days = Array.from({ length: n }, (_, i) => key(new Date(now.getFullYear(), now.getMonth(), now.getDate() - (n - 1 - i))));
  return { days, today: key(now) };
}

const OWN_DAYS = 14;

function ownPoints(ledger: Parameters<typeof ownCurve>[0], keys: ReadonlySet<string>): OwnPoint[] {
  const { days, today } = recentDays(OWN_DAYS);
  return ownCurve(ledger, days, (key) => keys.has(key), today);
}

/**
 * 내 것 곡선(종류 화면 머리, 2026-11-07 사용자 "Languagebank 각 사전 아래 그래프, 채운 것만"): 최근 14일 날마다 그날 끝의
 * 앎(선) · 앎 + 적용이 힘듦(옅은 면) 개수 — 체크 셋(checkState.ts) 그대로라 거의 늘 오르고, 확인에서 잊으면 내려간다.
 * 푼 것이 없으면 안 그린다. 학습량(푼 수)은 Logbank에만.
 */
function OwnCurve({ ui, points }: { ui: UICopy; points: readonly OwnPoint[] }) {
  const real = points.filter((one): one is NonNullable<OwnPoint> => Boolean(one));
  const last = real[real.length - 1];
  if (!last || !real.some((one) => one.known + one.hard > 0)) return null;
  const W = 320;
  const H = 56;
  const max = Math.max(1, ...real.map((one) => one.known + one.hard)) * 1.15;
  const step = W / Math.max(1, points.length - 1);
  const y = (v: number) => H - (v / max) * (H - 4);
  const at = (i: number) => (step * i).toFixed(1);
  const idx = points.map((one, i) => (one ? i : -1)).filter((i) => i >= 0);
  const area = `M${at(idx[0]!)},${H} ` + idx.map((i) => `L${at(i)},${y(points[i]!.known + points[i]!.hard).toFixed(1)}`).join(" ") + ` L${at(idx[idx.length - 1]!)},${H} Z`;
  const line = idx.map((i, n) => `${n ? "L" : "M"}${at(i)},${y(points[i]!.known).toFixed(1)}`).join(" ");
  return (
    <figure data-lb-own className="m-0 flex flex-col gap-1 rounded-xl border border-line px-3 py-2">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ui.lbCurve} direction="ltr" preserveAspectRatio="none" className="h-14 w-full">
        <path d={area} className="fill-status-learned/15" />
        <path d={line} className="fill-none stroke-status-learned" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <p className="flex flex-wrap gap-x-3 text-meta tabular-nums text-slate-400">
        <span className="inline-flex items-center gap-1">
          <span aria-hidden className="h-0.5 w-3 rounded-full bg-status-learned" />
          {`${ui.knownTag} ${last.known}`}
        </span>
        <span className="inline-flex items-center gap-1">
          <span aria-hidden className="h-2 w-3 rounded-full bg-status-learned/15" />
          {`${ui.lbCardHard} ${last.hard}`}
        </span>
      </p>
    </figure>
  );
}
