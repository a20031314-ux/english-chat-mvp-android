"use client";

import { useEffect, useState } from "react";
import type { PreparedItem } from "./preparedQuiz";
import { stageOfRank } from "./vocabBank";
import { ladderFor } from "./stages/index";
import { apiUrl } from "../apiBase";

type Raw = {
  kind?: string;
  gloss?: string;
  before?: string;
  after?: string;
  answer?: string;
  options?: string[];
  hint?: string;
  mark?: string;
  why?: string;
  line?: string;
};

const FILES: Record<string, (() => Promise<{ default: Record<string, Raw> }>)[]> = {
  en: [
    () => import("./problems/en.json"),
    () => import("./problems/en-e2.json"),
    () => import("./problems/en-e3.json"),
    () => import("./problems/en-e4.json"),
    () => import("./problems/en-e5.json"),
    () => import("./problems/en-g2.json"),
    () => import("./problems/en-g3.json"),
    () => import("./problems/en-g4.json"),
    () => import("./problems/en-g5.json"),
    // en-w2 … en-w70. 없는 번호는 빈 객체로 넘어간다.
    ...Array.from({ length: 69 }, (_, index) => {
      const n = index + 2;
      return () => import(`./problems/en-w${n}.json`).catch(() => ({ default: {} as Record<string, Raw> }));
    }),
    () => import("./problems/en-g.json"),
  ],
  // 문법 고르기(앱 언어 한국어, 2026-11-06 사용자 "490문제 … 그냥 만들어줘") — 언어마다 그 학습 언어 문법 칸 하나에 한 문제.
  zh: [() => import("./problems/zh-g.json")],
  ja: [() => import("./problems/ja-g.json")],
  es: [() => import("./problems/es-g.json")],
  fr: [() => import("./problems/fr-g.json")],
  it: [() => import("./problems/it-g.json")],
  pt: [() => import("./problems/pt-g.json")],
  ru: [() => import("./problems/ru-g.json")],
  vi: [() => import("./problems/vi-g.json")],
  id: [() => import("./problems/id-g.json")],
  ar: [() => import("./problems/ar-g.json")],
  th: [() => import("./problems/th-g.json")],
  hi: [() => import("./problems/hi-g.json")],
};

const cache = new Map<string, Promise<PreparedItem[] | null>>();

/** 그 언어에 넣어 둔 표현·문법·단어 문제. 파일이 없으면 null(Quizbank는 예전 표현 카드를 쓴다). */
export function loadPrepared(language: string): Promise<PreparedItem[] | null> {
  const have = cache.get(language);
  if (have) return have;
  const files = FILES[language];
  if (!files) {
    const empty = Promise.resolve(null);
    cache.set(language, empty);
    return empty;
  }
  const made = build(language, files);
  cache.set(language, made);
  return made;
}

async function build(language: string, files: (() => Promise<{ default: Record<string, Raw> }>)[]): Promise<PreparedItem[]> {
  const stageOf = new Map<string, number>();
  for (const stage of ladderFor(language)?.stages ?? []) {
    for (const text of stage.expressions) stageOf.set(`e|${text}`, stage.order);
  }
  const ranks = new Map<string, number>();
  if (language === "en") {
    const { WORDS } = await import("./vocab/en.ts");
    WORDS.forEach((row, index) => ranks.set(String(row[0]).toLocaleLowerCase(), index));
  }
  const books = await Promise.all(files.map((load) => load()));
  const items: PreparedItem[] = [];
  for (const book of books) {
    for (const [key, raw] of Object.entries(book.default ?? {})) {
      if (!raw.gloss || !raw.answer || !raw.line) continue;
      if (raw.kind === "word") {
        const rank = ranks.get(key.slice(2).toLocaleLowerCase());
        if (rank === undefined) continue;
        items.push({
          key,
          kind: "word",
          stage: stageOfRank(language, rank),
          gloss: raw.gloss,
          before: "",
          after: "",
          answer: raw.answer,
          options: [],
          line: raw.line,
          why: "",
          ...(raw.hint ? { hint: raw.hint } : {}),
          ...(raw.mark ? { mark: raw.mark } : {}),
        });
        continue;
      }
      if (raw.kind !== "expression" && raw.kind !== "grammar") continue;
      if (!raw.why || !raw.options?.length) continue;
      const stage = raw.kind === "grammar" ? Number(key.split("|")[1]?.split(":")[0]) : stageOf.get(key);
      if (!stage || Number.isNaN(stage)) continue;
      items.push({
        key,
        kind: raw.kind,
        stage,
        gloss: raw.gloss,
        before: raw.before ?? "",
        after: raw.after ?? "",
        answer: raw.answer,
        options: raw.options,
        line: raw.line,
        why: raw.why,
      });
    }
  }
  return items;
}

const COPY = "preparedCopy.v2";
const COPY_DAYS = 30;

/**
 * 앱 언어가 한국어가 아니면 뜻·까닭을 그 말로(server/preparedCopy.ts, 2026-11-06 사용자 "다른 앱언어도 나오게해줘").
 * 옮긴 것이 없는 문제와 단어 문제(뜻이 한국어뿐 — 카드가 맡음)는 뺀다. 이 폰에 30일.
 */
async function inUi(language: string, ui: string, items: PreparedItem[]): Promise<PreparedItem[]> {
  if (ui === "ko") return items;
  const cacheKey = `${COPY}.${language}.${ui}`;
  let copy: Record<string, { gloss: string; why: string }> | null = null;
  try {
    const kept = JSON.parse(localStorage.getItem(cacheKey) ?? "null") as { at: number; copy: Record<string, { gloss: string; why: string }> } | null;
    if (kept && Date.now() - kept.at < COPY_DAYS * 86400000 && Object.keys(kept.copy).length) copy = kept.copy;
  } catch {
    copy = null;
  }
  if (!copy) {
    const body = await fetch(apiUrl(`/api/curriculum/words?prepared=1&lang=${encodeURIComponent(language)}&ui=${encodeURIComponent(ui)}`))
      .then((response) => (response.ok ? (response.json() as Promise<{ copy?: Record<string, { gloss: string; why: string }> }>) : null))
      .catch(() => null);
    copy = body?.copy && typeof body.copy === "object" ? body.copy : {};
    // 다 옮겨졌을 때만 남긴다(일부 실패면 다음에 다시).
    const want = items.filter((item) => item.kind !== "word").length;
    if (Object.keys(copy).length >= want) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify({ at: Date.now(), copy }));
      } catch {
        // 이번에만.
      }
    }
  }
  const out: PreparedItem[] = [];
  for (const item of items) {
    if (item.kind === "word") continue;
    const one = copy[item.key];
    if (one?.gloss && one.why) out.push({ ...item, gloss: one.gloss, why: one.why });
  }
  return out;
}

/** ui = 앱 언어. 앱 언어 = 학습 언어면 없음(뜻 줄이 곧 문장). */
export function usePrepared(language: string, ui = "ko"): PreparedItem[] | null {
  const want = language && ui !== language ? language : "";
  return usePreparedFor(want, ui);
}

function usePreparedFor(language: string, ui: string): PreparedItem[] | null {
  // 언어를 바꾸면 그 언어 것이 올 때까지 null(예전 언어 문제를 잠깐이라도 내지 않게).
  const id = `${language}|${ui}`;
  const [loaded, setLoaded] = useState<{ id: string; items: PreparedItem[] | null } | null>(null);
  useEffect(() => {
    let live = true;
    void loadPrepared(language)
      .then((list) => (list ? inUi(language, ui, list) : null))
      .then((list) => {
        if (live) setLoaded({ id, items: list?.length ? list : null });
      });
    return () => {
      live = false;
    };
  }, [language, ui, id]);
  return loaded && loaded.id === id ? loaded.items : null;
}
