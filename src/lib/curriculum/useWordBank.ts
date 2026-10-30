"use client";

/**
 * 지속 학습의 빈도 단어(curriculum/vocabBank.ts): 목록을 불러오고, 아직 모르는 첫 낱말이 든 50개 묶음(과 다음 묶음)의 카드를 받아
 * 퀴즈 재료로 넘긴다(quiz.ts registerQuizSources — 예문 빈칸·뜻·듣기·말하기). 카드는 이 폰에도 묶음·앱 언어마다 남겨 다시 받지 않는다.
 * 돌려주는 것: 목록 크기·이미 앎·배우는 중 수, 다음에 낼 낱말 열쇠(순위 순, 이미 앎·확인 중 빼고).
 */
import { useEffect, useMemo, useState } from "react";
import { apiUrl } from "@/lib/apiBase";
import { BANK_CHUNK, groupsOf, hasBank, inPick, loadBank, peekBank, posGroup, quizPos, wordKey, wordStage, type BankWord, type VocabPick } from "@/lib/curriculum/vocabBank";
import { allScriptsFor } from "@/lib/curriculum/stageScripts";
import { segmentWords } from "@/lib/wordSegments";
import { knownState, type KnownMap } from "@/lib/curriculum/known";
import { registerQuizSources, type QuizSource } from "@/lib/curriculum/quiz";

type Card = { w: string; piece: string; example: string; gloss: string; exampleGloss: string; reading?: string };
const CACHE = "wordCards.v1";
const NEXT_MAX = 40;

/** 기능어(대명사·관사·조사 등)는 뒤로(2026-10-29 사용자 — 새 낱말이 ない·i·el부터 나옴). 기능어 칸을 고르면 그대로. */
function late(word: BankWord, pick?: VocabPick | null, userStage = 2): boolean {
  if (pick && pick.value === "function" && (pick.by === "pos" || pick.by === "topic")) return false;
  // 1단계는 기능어(대명사·조사·전치사)를 먼저 다(2026-10-31 설계 — 문장을 만들려면 먼저 필요).
  if (userStage <= 1) return false;
  return posGroup(word.pos) === "function" || word.topic === "function";
}

function readCached(language: string, ui: string, chunk: number | string): Card[] | null {
  try {
    const raw = JSON.parse(localStorage.getItem(`${CACHE}.${language}.${ui}.${chunk}`) ?? "null") as Card[] | null;
    return Array.isArray(raw) && raw.length ? raw : null;
  } catch {
    return null;
  }
}

function sourcesOf(card: Card, pos: string | undefined): QuizSource[] {
  // 품사(목록의 pos → 묶음 noun·verb·adj·adv·function) — 빈칸 보기를 같은 품사로만(quiz.ts decoys, 사용자 2026-10-30).
  return [{ text: card.example, gloss: { en: "", raw: card.exampleGloss }, from: wordKey(card.w), stage: 0, piece: card.piece, who: "me", wordGloss: card.gloss, ...(pos ? { pos: quizPos(pos) } : {}) }];
}

/** 순위 index의 카드 묶음: 빈도 목록은 "b<n>", 그 뒤 찾아서 더한 낱말은 "x<n>". */
function chunkOf(index: number, baseLength: number): string {
  return index < baseLength ? `b${Math.floor(index / BANK_CHUNK)}` : `x${Math.floor((index - baseLength) / BANK_CHUNK)}`;
}

const EXTRAS = "wordsExtra.v1";
const EXTRAS_MS = 6 * 60 * 60 * 1000;

function readExtras(language: string): BankWord[] {
  try {
    const raw = JSON.parse(localStorage.getItem(`${EXTRAS}.${language}`) ?? "null") as { at: number; words: BankWord[] } | null;
    return Array.isArray(raw?.words) ? raw!.words : [];
  } catch {
    return [];
  }
}

/** 더한 낱말 목록(6시간마다 새로, 실패하면 null). */
async function fetchExtras(language: string, force = false): Promise<BankWord[] | null> {
  try {
    const raw = JSON.parse(localStorage.getItem(`${EXTRAS}.${language}`) ?? "null") as { at: number; words: BankWord[] } | null;
    if (!force && raw && Date.now() - raw.at < EXTRAS_MS) return raw.words;
  } catch {
    // 새로 받는다.
  }
  const body = await fetch(apiUrl(`/api/curriculum/words?lang=${encodeURIComponent(language)}&extra=1&list=1`))
    .then((response) => (response.ok ? (response.json() as Promise<{ words?: (string | number)[][] }>) : null))
    .catch(() => null);
  if (!Array.isArray(body?.words)) return null;
  const words: BankWord[] = body!.words!.map(([w, pos, topic, reading, stage]) => ({
    w: String(w ?? ""),
    pos: String(pos ?? ""),
    ...(topic ? { topic: String(topic) } : {}),
    ...(reading ? { reading: String(reading) } : {}),
    ...(Number(stage) >= 1 && Number(stage) <= 6 ? { stage: Number(stage) } : {}),
  })).filter((one) => one.w);
  try {
    localStorage.setItem(`${EXTRAS}.${language}`, JSON.stringify({ at: Date.now(), words }));
  } catch {
    // 이번에만.
  }
  return words;
}

/**
 * 단어장에서 낱말 찾기(2026-10-31): 서버가 빈도 목록·더한 목록을 보고, 없으면 확인해 모두의 목록에 더한다.
 * 카드가 오면 바로 퀴즈 재료로 등록하고, 더한 목록을 다시 받게 표시한다. 돌려줌: 상태와 사전형.
 */
export async function searchWord(language: string, ui: string, word: string): Promise<{ status: string; word?: string } | null> {
  const body = await fetch(apiUrl("/api/curriculum/words"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lang: language, ui, word }),
  })
    .then((response) => (response.ok ? (response.json() as Promise<{ status: string; word?: string; card?: Card & { pos?: string } }>) : null))
    .catch(() => null);
  if (!body) return null;
  if (body.card) {
    const card = body.card;
    registerQuizSources(language, [{ key: wordKey(card.w), sources: sourcesOf(card, card.pos) }]);
    glossOf.set(`${language}|${card.w}`, card.gloss);
  }
  if (body.status === "added") void fetchExtras(language, true);
  return { status: body.status, ...(body.word ? { word: body.word } : {}) };
}

/** 앱이 단계마다 가르치는 낱말(대본 줄에 나온 꼴, 소문자) → 가장 이른 단계. 낱말 단계를 그 아래로 당기는 데 씀. */
const taughtCache = new Map<string, Map<string, number>>();
function taughtStages(language: string): Map<string, number> {
  const have = taughtCache.get(language);
  if (have) return have;
  const out = new Map<string, number>();
  for (const script of allScriptsFor(language)) {
    for (const line of script.lines) {
      for (const word of segmentWords(line.text, language)) {
        const key = word.toLocaleLowerCase();
        if (!out.has(key) || out.get(key)! > script.stage) out.set(key, script.stage);
      }
    }
  }
  taughtCache.set(language, out);
  return out;
}

/** 낱말 뜻(앱 언어) — 퀴즈 제목 옆 등. */
const glossOf = new Map<string, string>();
export function wordGloss(language: string, word: string): string {
  return glossOf.get(`${language}|${word}`) ?? "";
}

/**
 * userStage: 지금 내 단계 — 그 위 단계 낱말은 내지 않는다(mine 빼고). mine: 내가 찾거나 저장한 낱말(단계 무관 맨 앞).
 * 고르는 순서(2026-10-31 설계): mine → 지금 단계 필수 → 아래 단계 필수 중 아직 모르는 것 → (5단계면) 확장.
 */
export function useWordBank(language: string, ui: string, known: KnownMap, pick?: VocabPick | null, userStage = 5, mine?: ReadonlySet<string>) {
  const [bank, setBank] = useState<readonly BankWord[] | null>(() => peekBank(language));
  const [ready, setReady] = useState<Set<string>>(new Set());
  // 사용자들이 찾아서 더한 낱말(server/wordExtras.ts) — 빈도 목록 뒤에 붙인다(2026-10-31 사용자 "검색하면 자동 추가 → 다른 사용자에게 반영").
  const [extras, setExtras] = useState<readonly BankWord[]>(() => readExtras(language));
  useEffect(() => {
    if (!hasBank(language)) return;
    let alive = true;
    void loadBank(language).then((list) => alive && setBank(list));
    void fetchExtras(language).then((list) => alive && list && setExtras(list));
    return () => {
      alive = false;
    };
  }, [language]);
  const base = bank && bank.length && hasBank(language) ? bank : null;
  const list = useMemo(() => {
    if (!base) return null;
    const taught = taughtStages(language);
    const joined = [...base, ...extras.filter((one) => !base.some((b) => b.w === one.w))];
    // 순위 칸 + 대본에서 배우는 단계로 낱말마다 단계(curriculum/vocabBank.ts wordStage).
    // 찾아서 더한 낱말은 서버가 판정한 단계(없으면 확장 6) — 목록 뒤 자리는 순위가 아니다.
    return joined.map((word, index) => ({ ...word, stage: index >= base.length ? (word.stage ?? 6) : wordStage(language, word, index, taught) }));
  }, [base, extras, language]);
  const baseLength = base?.length ?? 0;
  const mineKey = mine ? [...mine].sort().join("|") : "";
  // 낼 차례(순위 index 목록): 내 것 → 지금 단계 → 아래 단계(높은 것부터) → 확장(5단계일 때만). 지금 단계 위는 없음.
  const order = useMemo(() => {
    if (!list) return [] as number[];
    const top = Math.max(1, Math.min(5, userStage));
    const rank = (index: number) => {
      const word = list[index]!;
      if (mine?.has(word.w)) return 0;
      const stage = word.stage ?? 6;
      if (stage === top) return 1;
      if (stage < top) return 2 + (top - stage);
      if (stage === 6 && top >= 5) return 10;
      return -1;
    };
    return list
      .map((_, index) => [index, rank(index)] as const)
      .filter(([, r]) => r >= 0)
      .sort((a, b) => a[1] - b[1] || a[0] - b[0])
      .map(([index]) => index);
    // mineKey stands for mine.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, userStage, mineKey]);
  // 고른 칸(curriculum/vocabBank.ts inPick)에서 아직 모르는(이미 앎·확인 중이 아닌) 앞 낱말들이 든 묶음(셋까지).
  const pickKey = pick ? `${pick.by}:${pick.value}` : "all:";
  const chunks = useMemo(() => {
    if (!list) return "";
    const out: string[] = [];
    let open = 0;
    for (const index of order) {
      if (open >= 12) break;
      const word = list[index]!;
      if (known[wordKey(word.w)] || !inPick(word, index, pick) || (!mine?.has(word.w) && late(word, pick, userStage))) continue;
      open += 1;
      const c = chunkOf(index, baseLength);
      if (!out.includes(c)) out.push(c);
      if (out.length >= 3) break;
    }
    const first = out[0];
    if (out.length === 1 && first?.startsWith("b") && (Number(first.slice(1)) + 1) * BANK_CHUNK < baseLength && (!pick || pick.by === "all" || pick.by === "stage")) out.push(`b${Number(first.slice(1)) + 1}`);
    return out.join(",");
    // pickKey stands for pick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, known, pickKey, baseLength, order, userStage, mineKey]);
  useEffect(() => {
    if (!list || !chunks) return;
    let alive = true;
    const want = chunks.split(",");
    void Promise.all(
      want.map(async (id) => {
        const extra = id.startsWith("x");
        const c = Number(id.slice(1));
        const cacheId = extra ? `x${c}` : c;
        const cached = readCached(language, ui, cacheId);
        if (cached) return cached;
        const body = await fetch(apiUrl(`/api/curriculum/words?lang=${encodeURIComponent(language)}&ui=${encodeURIComponent(ui)}&chunk=${c}${extra ? "&extra=1" : ""}`))
          .then((response) => (response.ok ? (response.json() as Promise<{ cards?: Card[] }>) : null))
          .catch(() => null);
        const cards = Array.isArray(body?.cards) ? body!.cards! : [];
        // 더한 낱말 묶음은 다 찬 것만 이 폰에 남긴다(마지막 묶음은 계속 자람).
        if (cards.length && (!extra || cards.length >= BANK_CHUNK)) {
          try {
            localStorage.setItem(`${CACHE}.${language}.${ui}.${cacheId}`, JSON.stringify(cards));
          } catch {
            // 이번에만.
          }
        }
        return cards;
      }),
    ).then((groups) => {
      if (!alive) return;
      const cards = groups.flat();
      const posOf = new Map([...(peekBank(language) ?? []), ...extras].map((word) => [word.w, word.pos]));
      registerQuizSources(language, cards.map((card) => ({ key: wordKey(card.w), sources: sourcesOf(card, posOf.get(card.w)) })));
      for (const card of cards) glossOf.set(`${language}|${card.w}`, card.gloss);
      setReady((current) => new Set([...current, ...cards.map((card) => wordKey(card.w))]));
    });
    return () => {
      alive = false;
    };
    // extras는 품사를 찾는 데만(목록이 바뀌면 chunks도 바뀜).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, chunks, language, ui]);
  return useMemo(() => {
    if (!list) return null;
    let knownCount = 0;
    let learning = 0;
    for (const word of list) {
      const state = knownState(known, wordKey(word.w));
      if (state === "known") knownCount += 1;
      else if (state === "checking") learning += 1;
    }
    const open = order
      .map((index) => ({ word: list[index]!, index, key: wordKey(list[index]!.w) }))
      .filter(({ word, index, key }) => !known[key] && ready.has(key) && inPick(word, index, pick));
    const isLate = (word: BankWord) => !mine?.has(word.w) && late(word, pick, userStage);
    const next = [...open.filter(({ word }) => !isLate(word)), ...open.filter(({ word }) => isLate(word))].map(({ key }) => key).slice(0, NEXT_MAX);
    // 고른 기준의 칸마다 이미 앎 / 전체.
    const by = pick?.by && pick.by !== "all" ? pick.by : null;
    const groups = by
      ? groupsOf(list, by, by === "stage" ? userStage : 5).map((id) => {
          let have = 0;
          let total = 0;
          list.forEach((word, index) => {
            if (!inPick(word, index, { by, value: id })) return;
            total += 1;
            if (knownState(known, wordKey(word.w)) === "known") have += 1;
          });
          return { id, known: have, total };
        })
      : [];
    return { total: list.length, known: knownCount, learning, next, groups };
    // pickKey stands for pick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, known, ready, pickKey, order, userStage, mineKey]);
}
