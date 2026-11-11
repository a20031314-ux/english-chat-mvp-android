"use client";

import { QUIZ_FOCUS_EVENT, takeQuizFocus } from "@/lib/curriculum/quizFocus";
import { checkStates, dayOfSeconds } from "@/lib/curriculum/checkState";
import { DONE, kindCounts, kindShares, missRates, readLadder, rungOf, saveLadder, stepLadder } from "@/lib/curriculum/ladder";
import { expressionAsk, grammarAsk } from "@/lib/curriculum/ladderQuiz";
import { loadSpots, spotsFor } from "@/lib/curriculum/spotLoad";
import type { PreparedItem } from "@/lib/curriculum/preparedQuiz";
import { reviewKeys as ledgerReview } from "@/lib/curriculum/todayCards";
import { noteLedger, readLedger } from "@/lib/curriculum/logLedger";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePremium } from "@/contexts/PremiumContext";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { UICopy } from "@/lib/copy";
import type { ReviewMap } from "@/lib/curriculum/dailyPlan";
import { askedTexts, bundleQuiz, cardQuiz, registerQuizSources, type QuizCard, type QuizQuestion } from "@/lib/curriculum/quiz";
import { announceKnown, useCheckups } from "@/lib/curriculum/useCheckups";
import { confirmDue, knownState } from "@/lib/curriculum/known";
import { useWordBank } from "@/lib/curriculum/useWordBank";
import { useExpressionCards } from "@/lib/curriculum/useExpressionCards";
import { nextExpressions } from "@/lib/curriculum/expressionDeck";
import { latestCheck } from "@/lib/curriculum/skillCheck";
import { pickPrepared, turnFresh } from "@/lib/curriculum/preparedQuiz";
import { knownSlotWeight } from "@/lib/curriculum/languagePairs";
import { learnerLanguages } from "@/lib/curriculum/learnerLanguages";
import { readCachedAccount } from "@/lib/account/session";
import { factsOf } from "@/lib/account/profileFacts";
import { usePrepared } from "@/lib/curriculum/preparedLoad";
import { peekBank, stageCuts, wordKey } from "@/lib/curriculum/vocabBank";
import { levelOf, noteLevelBatch, pickLevelWords, presumedWords, tooEarly } from "@/lib/curriculum/vocabLevel";
import { gapSources, gapsFromCards, mergeGaps, readLocalGaps } from "@/lib/curriculum/gaps";
import { InlineQuiz, type QuizBatch } from "@/components/studyMap/InlineQuiz";
import { useStageGlosses } from "@/lib/curriculum/useStageGlosses";
import { recordQuiz, type QuizLog } from "@/lib/curriculum/nextStudy";
import { commonWords, hitsIn, readTalks, shareable, talkShareOn } from "@/lib/curriculum/talkQuiz";
import { QUIZ_LOG_EVENT, readQuizLog, saveQuizLog } from "@/lib/curriculum/quizLogStore";
import { growBank, offerBank } from "@/lib/curriculum/qbank";
import { noteQuizDay } from "@/lib/curriculum/quizDays";
import { emptyCircle, growCircle, noteAnswer, trimCircle, type Circle } from "@/lib/curriculum/circle";
import { loadVocabulary } from "@/lib/vocabulary";
import { useVocabPreviewOptional } from "@/contexts/VocabPreviewContext";

/**
 * Quizbank — 한 흐름 퀴즈(설계 hub/app/QUIZ.md §3): Logbank 오늘 카드가 맡긴 열쇠 →
 * 다시 볼 것(장부 todayCards.ts reviewKeys)과 새 묶음(낱말 수준 어림 vocabLevel + 표현 카드 + 넣어 둔 문법·표현 문제) 번갈아.
 * 낱말은 예문 속 뜻만(고르기·스스로 체크), 문법·표현은 사다리(ladder.ts — 고르기 → 빈칸 쓰기 → 틀린 곳 → 문장 만들기), 결과는 사건 장부(logLedger)·quizDays·서버 익힘(/api/curriculum/scripts check).
 * 칸 몸통(keep)과 칸 밖에 떠야 하는 것(overlays)을 children으로 넘긴다 — 칸을 그리는 쪽은 notes/NotebookSection.
 */

const REVIEW_EVENT = "lb-review";

function localDay(now = new Date()): string {
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

/** 서버가 다시 볼 것을 바꾸면 알린다(같은 언어의 Quizbank가 다시 읽음). */
function announceReview(language: string, review: ReviewMap) {
  window.dispatchEvent(new CustomEvent(REVIEW_EVENT, { detail: { language, review } }));
}

/** 넣어 둔 문제 중 맞혀서 쉬는 열쇠(장부에 ok — 맞힌 것은 새 묶음에 다시 안 냄, [다시]·틀림은 다시 볼 것이 냄). */
function preparedRest(language: string, prepared: readonly { key: string }[] | null): string[] {
  if (!prepared?.length) return [];
  // 사다리 끝(4칸 문장 만들기까지 맞힘)만 새 묶음에서 쉰다(퀴즈 다시 짜기 4단계, ladder.ts).
  const ladder = readLadder(language);
  return prepared.map((item) => item.key).filter((key) => rungOf(ladder, key) >= DONE);
}

export function Quizbank({
  ui,
  locale,
  language,
  stage,
  review: initialReview,
  redo = [],
  cards = [],
  children,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  stage: number;
  review: ReviewMap;
  /** 튜터가 고친 줄(노트 카드) — 새로 들어간 말이 "막혔던 말"(curriculum/gaps.ts), 다시 볼 것의 틀린 곳 고치기 재료. */
  cards?: readonly { wrong: string; right: string; note: string; at: number; kind?: string }[];
  /** 튜터가 같은 틀을 두 번 고친 것(/api/notebook redo). */
  redo?: readonly { frame: string; card: QuizCard }[];
  children: (parts: { keep: { summary: ReactNode; body: ReactNode }; review: { summary: ReactNode; body: ReactNode }; overlays: ReactNode }) => ReactNode;
}) {
  // 문장구조·대본 이름은 앱 언어로(서버가 옮김) — 퀴즈 뜻 줄이 쓴다.
  useStageGlosses(language, stage, locale);
  const { isPremium } = usePremium();
  const [review, setReview] = useState<ReviewMap>(initialReview);
  const [now, setNow] = useState(0);
  useEffect(() => setNow(Date.now()), []);
  const day = now ? localDay(new Date(now)) : "";
  const [log, setLog] = useState<QuizLog>({});
  const [round, setRound] = useState(0);
  // 지금 묶음이 다시 볼 것인지(번갈아 내기), Logbank 오늘 카드가 맡긴 열쇠(curriculum/quizFocus.ts).
  const reviewBatch = useRef(false);
  const focusKeys = useRef<string[]>([]);
  // 이 묶음에서 문법·표현 열쇠를 낸 사다리 칸(ladder.ts) — 답이 오면 사다리를 옮긴다.
  const askedRung = useRef<Map<string, number>>(new Map());
  const [focusSerial, setFocusSerial] = useState(0);
  useEffect(() => {
    const take = () => {
      const focus = takeQuizFocus(language);
      if (!focus) return;
      focusKeys.current = focus.keys;
      setFocusSerial(focus.serial);
    };
    take();
    window.addEventListener(QUIZ_FOCUS_EVENT, take);
    return () => window.removeEventListener(QUIZ_FOCUS_EVENT, take);
  }, [language]);
  // 저장한 단어(lib/vocabulary.ts, 이 폰)는 수준과 상관없이 낱말 퀴즈 맨 앞.
  const [savedWords, setSavedWords] = useState<ReturnType<typeof loadVocabulary>>([]);
  const preview = useVocabPreviewOptional();
  useEffect(() => {
    setSavedWords(loadVocabulary());
  }, [language, preview?.savingWord]);
  const { known } = useCheckups(language);
  const mineWords = useMemo(() => new Set(savedWords.filter((one) => one.languageCode === language).map((one) => one.word.trim())), [savedWords, language]);
  // 낱말 원(curriculum/circle.ts) — 수준 어림(lv)과 본 낱말을 이 폰에.
  const circleStore = `quizCircle.v1.${language}`;
  const [circle, setCircle] = useState<Circle>(emptyCircle);
  const circleRef = useRef<Circle>(circle);
  useEffect(() => {
    let loaded: Circle = emptyCircle();
    try {
      const raw = JSON.parse(localStorage.getItem(circleStore) ?? "null") as Circle | null;
      if (raw && typeof raw.size === "number" && raw.items && typeof raw.items === "object") loaded = raw;
    } catch {
      // 이 폰에 없으면 처음부터.
    }
    circleRef.current = loaded;
    setCircle(loaded);
  }, [circleStore]);
  const saveCircle = (next: Circle) => {
    circleRef.current = next;
    setCircle(next);
    try {
      localStorage.setItem(circleStore, JSON.stringify(next));
    } catch {
      // 이번에만.
    }
  };
  const lastCircle = useRef<Set<string>>(new Set());
  const [circleNeed, setCircleNeed] = useState<string[]>([]);
  const bank = useWordBank(language, locale, known, null, stage, mineWords, circleNeed);
  const knownWord = (key: string) => knownState(known, key) === "known";
  // 낱말 묶음에 섞는 덩어리 표현(curriculum/expressionDeck.ts): 1~지금 단계, 문장구조와 같은 표현은 빠짐.
  const exprCards = useExpressionCards(language, locale, stage);
  // 넣어 둔 문법·표현 문제: 한국어 앱은 원문, 다른 앱 언어는 서버가 옮긴 뜻·까닭(server/preparedCopy.ts).
  const prepared = usePrepared(language, locale);
  // 사다리 3칸 틀린 곳 문항(spot-errors) — 묶음을 짜기 전에 미리 읽어 둔다.
  useEffect(() => {
    void loadSpots(language);
  }, [language]);
  const isDeckKey = (key: string) => key.startsWith("w|") || key.startsWith("e|");
  const cuts = stageCuts(language);
  // 원은 카드가 온 낱말로만 센다(카드 없는 낱말이 원 안에 남으면 원이 안 커짐).
  const circleOrder = useMemo(() => (bank ? bank.orderKeys.filter((key) => bank.ready.has(key)) : []), [bank]);
  const ranked = useMemo(() => bank?.ranked ?? [], [bank]);
  const rankOf = useMemo(() => new Map(ranked.map((key, index) => [key, index])), [ranked]);
  const mineKeys = useMemo(() => [...mineWords].map((word) => wordKey(word)), [mineWords]);
  const levelPick = (n: number, options: { want?: boolean; skip?: ReadonlySet<string> } = {}) => {
    if (!bank) return [] as string[];
    const usable = (key: string) => bank.ready.has(key);
    const mine = mineKeys.filter((key) => !circleRef.current.items[key] && !knownWord(key) && !options.skip?.has(key) && (options.want || usable(key))).slice(0, n);
    const rest = pickLevelWords(circleRef.current, levelOf(circleRef.current, stage, cuts), { n: n - mine.length, ranked, cuts, usable, known: knownWord, skip: new Set([...(options.skip ?? []), ...mine]), want: options.want });
    return [...mine, ...rest];
  };
  // 수준 근처인데 아직 카드가 없는 낱말(열둘까지) — 그 묶음을 받아 오게.
  const needKey = bank ? levelPick(16, { want: true }).filter((key) => !bank.ready.has(key)).slice(0, 12).join("\n") : "";
  useEffect(() => {
    // 열쇠 안에 "|"가 있어(w|낱말) 줄바꿈으로 잇고 나눈다.
    setCircleNeed(needKey ? needKey.split("\n") : []);
  }, [needKey]);
  // 대화의 튜터 줄 중 걸러진 것을 하루 한 번 다섯 줄까지 모두의 문제은행에 내놓는다(설정 talkShare — 기본 켬, AI 대화 ⋮에서 끔).
  const bankReady = Boolean(bank?.total);
  useEffect(() => {
    if (!bankReady || !talkShareOn()) return;
    const frequency = (peekBank(language) ?? []).map((word) => word.w);
    if (!frequency.length) return;
    const words = commonWords(language, frequency);
    const stamp = `talkOfferDay.v1.${language}`;
    const today = new Date().toDateString();
    try {
      if (localStorage.getItem(stamp) === today) return;
      localStorage.setItem(stamp, today);
    } catch {
      return;
    }
    const offers: { key: string; text: string; stage: number }[] = [];
    for (const conv of readTalks(language)) {
      for (const line of conv) {
        if (!shareable(language, line, words)) continue;
        const hit = hitsIn(language, line.text, 5)[0];
        if (hit && !offers.some((one) => one.text === line.text)) offers.push({ key: hit.key, text: line.text, stage });
      }
    }
    if (offers.length) void offerBank(language, offers.slice(-12));
  }, [language, stage, bankReady]);
  useEffect(() => {
    setLog(readQuizLog(language));
  }, [language]);
  // 다른 화면(소재 수업)이 쓴 기록을 다시 읽는다.
  useEffect(() => {
    const reload = (event: Event) => {
      if ((event as CustomEvent<string>).detail === language) setLog(readQuizLog(language));
    };
    window.addEventListener(QUIZ_LOG_EVENT, reload);
    return () => window.removeEventListener(QUIZ_LOG_EVENT, reload);
  }, [language]);
  useEffect(() => {
    setReview(initialReview);
  }, [initialReview]);
  useEffect(() => {
    const on = (event: Event) => {
      const detail = (event as CustomEvent<{ language: string; review: ReviewMap }>).detail;
      if (detail?.language === language) setReview(detail.review);
    };
    window.addEventListener(REVIEW_EVENT, on);
    return () => window.removeEventListener(REVIEW_EVENT, on);
  }, [language]);
  // 대화에서 막힌 것: 노트 카드 + 이 폰의 표현 보기 → 퀴즈 재료(틀린 곳 고치기)로 넘긴다.
  const cardsKey = cards.map((card) => `${card.at}`).join(",");
  const gaps = useMemo(() => {
    const list = mergeGaps(gapsFromCards(language, cards), typeof window === "undefined" ? [] : readLocalGaps(language));
    registerQuizSources(language, list.map((gap) => ({ key: gap.key, sources: gapSources(gap) })));
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, cardsKey, now]);
  // 튜터가 고친 내 줄(틀린 곳 찾아 고치기 재료): 막힌 것의 고친 줄 + 같은 틀을 두 번 고친 줄(redo, f|틀).
  const spotCards = useMemo(() => {
    const map = new Map<string, QuizCard>();
    for (const item of redo) map.set(`f|${item.frame}`, item.card);
    for (const gap of gaps) if (gap.card && !map.has(gap.key)) map.set(gap.key, gap.card);
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gaps, redo.map((item) => `${item.frame}:${item.card.wrong}`).join("|")]);

  if (!now) return null;

  // 결과를 열쇠마다(묶음 퀴즈는 여럿을 한 번에 — 상태를 한 번에 고쳐 덮어쓰지 않게).
  // seen = 봤음만(맞나 틀리나의 카드 낱말 — 그 문제는 문법을 물음): 장부·기록·익힘에 안 셈.
  const finishMany = (all: readonly { key: string; correct: boolean; review?: string; shape?: "c" | "t"; miss?: string; seen?: boolean }[]) => {
    const results = all.filter((one) => !one.seen);
    if (!results.length) return;
    let logged = log;
    let ladder = readLadder(language);
    for (const { key, correct, shape, miss } of results) {
      noteQuizDay(language, localDay(), correct, key, shape, miss);
      logged = recordQuiz(logged, key, correct);
      // 사다리(문법·표현): 낸 칸에서 맞으면 다음 칸, 틀리면 그 칸(ladder.ts).
      const rung = askedRung.current.get(key);
      if (rung !== undefined) {
        ladder = stepLadder(ladder, key, rung, correct);
        askedRung.current.delete(key);
      }
    }
    saveLadder(language, ladder);
    setLog(logged);
    saveQuizLog(language, logged, false);
    // 다시 볼 것에서 온 것은 결과 그대로, 한 번 맞히면 익힘 — 이미 익힘이고 다시 볼 것도 아니면 확인 날일 때만 서버에.
    const check: Record<string, boolean> = {};
    for (const { key, correct, review: fromReview } of results) {
      if (!fromReview && !review[key] && correct && known[key] && !confirmDue({ [key]: known[key]! }, Date.now()).length) continue;
      check[key] = correct;
    }
    if (!Object.keys(check).length) return;
    void fetch(apiUrl("/api/curriculum/scripts"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
      body: JSON.stringify({ language, check, quiz: true }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: { review?: ReviewMap; known?: unknown } | null) => {
        if (body?.review) announceReview(language, body.review);
        if (body?.known) announceKnown(language, body.known);
      })
      .catch(() => undefined);
  };
  /** 그 문법 칸의 틀린 곳 문항 하나(최근에 안 낸 것 먼저, 묶음마다 돌림). */
  const spotOf = (key: string) => {
    const list = spotsFor(language, key);
    if (!list.length) return null;
    const asked = askedTexts(language, key);
    const fresh = list.filter((one) => !asked.includes(one.lines[0] ?? ""));
    const pool = fresh.length ? fresh : list;
    return pool[(round + key.length) % pool.length] ?? null;
  };
  /** 문법·표현 열쇠 하나 → 사다리 칸 문제(ladderQuiz.ts). 낸 칸을 기억해 답이 오면 사다리를 옮긴다. */
  const ladderAsk = (key: string, events: readonly { k: string; src: string }[], ladder: ReturnType<typeof readLadder>, item?: PreparedItem): QuizQuestion | null => {
    const prep = item ?? prepared?.find((one) => one.key === key);
    const current = Math.min(4, rungOf(ladder, key));
    const made = prep
      ? grammarAsk(turnFresh(prep, preparedTurn(events, key), askedTexts(language, key)), current, spotOf(key), language)
      : key.startsWith("e|")
        ? expressionAsk(language, key, current, `${day}-${round}`)
        : null;
    if (!made) return null;
    askedRung.current.set(key, made.rung);
    return made.question;
  };
  // 카드 문제 하나: 낱말은 한 모양(뜻 묻기), 문법·표현은 사다리.
  const askCard = (key: string, events: readonly { k: string; src: string }[], ladder: ReturnType<typeof readLadder>, seed: string): QuizQuestion | null => {
    // 낱말은 한 모양 — 예문 속 그 낱말의 뜻(고르기, 그럴듯한 보기가 셋 안 모이면 스스로 체크). 퀴즈 다시 짜기 3단계(사용자 2026-11-10).
    if (key.startsWith("w|")) return cardQuiz(language, key, "hide", seed);
    return ladderAsk(key, events, ladder);
  };
  /** 열쇠마다 카드 문제, 카드가 없는 열쇠(문법·문장구조 등)는 old(묶음 퀴즈)로 — 순서는 받은 대로. */
  const askKeys = (keys: readonly string[], old: (rest: readonly string[]) => { keys: string[]; questions: QuizQuestion[] }): { keys: string[]; questions: QuizQuestion[] } => {
    const ledgerNow = readLedger(language);
    const ladder = readLadder(language);
    const made = keys.map((key) => ({ key, question: askCard(key, ledgerNow, ladder, `${day}-${round}`) }));
    // 낱말은 카드(뜻 묻기)가 없으면 빼고 넘어간다 — 다른 모양(빈칸 쓰기)으로 대신 내지 않는다(퀴즈 다시 짜기 3단계).
    const rest = made.filter((one) => !one.question && !one.key.startsWith("w|")).map((one) => one.key);
    const back = rest.length ? old(rest) : { keys: [], questions: [] };
    const byKey = new Map(back.keys.map((key, index) => [key, back.questions[index]!] as const));
    const out: { keys: string[]; questions: QuizQuestion[] } = { keys: [], questions: [] };
    for (const one of made) {
      const question = one.question ?? byKey.get(one.key);
      if (!question) continue;
      out.keys.push(one.key);
      out.questions.push(question);
    }
    return out;
  };
  /** 맡긴 열쇠 묶음. */
  const keysBatch = (keys: readonly string[]) => {
    void growBank(language, locale, keys.map((key) => ({ key, stage })));
    const made = askKeys(keys, (rest) => bundleQuiz(language, rest, { seed: `${day}-${round}`, stage, style: "type", fallback: "choose", strict: true }));
    return made.questions.length ? made : null;
  };
  /** 다시 볼 것 묶음 — 장부·체크 셋에서(오늘 카드와 같은 기록, todayCards.ts reviewKeys), 방금 묶음에 나온 열쇠는 빼고. */
  const reviewBatchOf = () => {
    const ledger = readLedger(language);
    const keys = ledgerReview({ events: ledger, states: checkStates(ledger), now: Math.floor(Date.now() / 1000), today: (t) => dayOfSeconds(t) }).filter((key) => !lastCircle.current.has(key));
    void growBank(language, locale, keys.slice(0, 16).map((key) => ({ key, stage })));
    const made = askKeys(keys.slice(0, 8), (rest) => bundleQuiz(language, rest, { seed: `${day}-${round}`, stage, style: "type", fallback: "choose", strict: true, spots: { cards: spotCards, anyCard: true } }));
    return made.questions.length ? made : null;
  };
  const takeBatch = (made: { keys: string[]; questions: QuizQuestion[] } | null): QuizBatch | null => {
    if (!made) return null;
    setRound((n) => n + 1);
    return made;
  };
  const recordOne = (one: { key: string; correct: boolean; skipped: boolean; shape?: "c" | "t"; miss?: string }) => {
    const fromReview = reviewBatch.current;
    // "모르겠어요"·답 보기는 원에서는 틀림으로(다시 나오게), 장부에도 틀림(miss).
    if (one.skipped && one.key && !fromReview && bank && isDeckKey(one.key)) saveCircle(trimCircle(growCircle(noteAnswer(circleRef.current, one.key, false, Date.now()), circleOrder, knownWord)));
    if (one.skipped && one.key) noteLedger(language, [{ k: one.key, src: "quiz", r: "miss", ...(one.shape ? { m: one.shape === "t" ? "write" : "pick" } : {}) }]);
    if (one.skipped || !one.key) return;
    if (!fromReview && bank && isDeckKey(one.key)) {
      const before = circleRef.current;
      const rank = rankOf.get(one.key);
      if (rank !== undefined) {
        // 수준 맞추기: 처음 보는 낱말(고르기)은 찍어 맞힐 몫을 빼고 경계를 고치고, 경계보다 한참 위를 틀린 것은 "아직 이른 낱말"로.
        const fresh = !before.items[one.key] || Boolean(before.items[one.key]!.e);
        const lv = levelOf(before, stage, cuts);
        const early = fresh && tooEarly(lv, rank, one.correct);
        const next = noteAnswer(before, one.key, one.correct, Date.now(), early);
        saveCircle(trimCircle({ ...next, lv: noteLevelBatch(lv, rank, one.correct, { choose: fresh, total: ranked.length, fresh }) }));
      } else saveCircle(trimCircle(growCircle(noteAnswer(before, one.key, one.correct, Date.now()), circleOrder, knownWord)));
    }
    finishMany([{ key: one.key, correct: one.correct, review: review[one.key] ? one.key : undefined, shape: one.shape, miss: one.miss }]);
  };
  /** 새 묶음: 수준 근처 낱말 + 아래 단계 "아마 앎" 하나 + 아직 안 본 표현 하나 + 넣어 둔 문법·표현 문제. */
  const makeFresh = (): QuizBatch | null => {
    if (!bank || !ranked.length) return null;
    // 종류 비율(ladder.ts kindShares — 단어 40 · 문법 35 · 표현 25, 1~2단계 50 · 30 · 20, 최근 14일 틀린 비율이 높은 쪽으로).
    const counts = kindCounts(BATCH_SIZE, kindShares(stage, missRates(readLedger(language), Math.floor(Date.now() / 1000))));
    const keys = levelPick(Math.max(0, counts.w - 1), { skip: lastCircle.current });
    if (keys.length) {
      const low = presumedWords(circleRef.current, levelOf(circleRef.current, stage, cuts), { ranked, usable: (key) => bank.ready.has(key), known: knownWord, n: 1, seed: round });
      for (const one of low) if (!keys.includes(one) && !lastCircle.current.has(one)) keys.splice(Math.min(2, keys.length), 0, one);
    }
    // 넣어 둔 표현 문제가 없는 언어(영어 말고는 문법만 넣어 둠)는 표현 카드를 둘째 자리에.
    if (!prepared?.some((item) => item.kind === "expression")) {
      // 가장 최근 확인(첫 측정·실력 확인, skillCheck.ts latestCheck)의 표현 단계부터 — 그 아래 단계는 본 표현 네 개에 하나만 끼워 확인(사용자 2026-11-09 "어쩌다 한 번이면 괜찮").
      // 몇 번째인지는 본 표현 수로 센다(묶음 번호는 다시 볼 것 묶음과 번갈아 홀짝이 고정).
      const exprSeen = (key: string) => Boolean(circleRef.current.items[key]) || knownWord(key);
      const placed = latestCheck(language);
      const exprFrom = placed && exprCards.deck.filter((one) => exprSeen(one.key)).length % 4 !== 3 ? placed.expression : undefined;
      const more = nextExpressions(exprCards.deck, { seen: exprSeen, ready: (key) => exprCards.ready.has(key), skip: lastCircle.current, ...(exprFrom ? { from: exprFrom } : {}) }).slice(0, counts.e);
      keys.splice(Math.min(1, keys.length), 0, ...more);
    }
    // 같은 단계 문법은 이 학습자에게 무거운 칸(모국어·아는 언어에 없는 개념)부터 — 프로필 모국어 → 국적 → 앱 언어.
    const speaks = learnerLanguages(factsOf(readCachedAccount()?.profile.facts), locale).known;
    const head = prepared ? pickPrepared(prepared, { stage, grammar: counts.g, expression: prepared.some((item) => item.kind === "expression") ? counts.e : 0, skip: new Set([...lastCircle.current, ...preparedRest(language, prepared)]), ...(speaks.length ? { weight: (key: string) => knownSlotWeight(speaks, language, key) } : {}) }) : [];
    lastCircle.current = new Set([...head.map((item) => item.key), ...keys]);
    if (!keys.length && !head.length) return null;
    void growBank(language, locale, keys.map((key) => ({ key, stage })));
    // 다음 묶음에 나올 새 낱말도 미리(문제은행 미리 받기).
    void growBank(language, locale, levelPick(8, { skip: new Set(keys) }).map((key) => ({ key, stage })));
    const questions: QuizQuestion[] = [];
    const used: string[] = [];
    // 같은 칸은 나올 때마다 다른 문장(바꾼 사전 예문이 있는 칸만) — 이 폰 장부의 그 칸 퀴즈 답 수로 차례.
    const asked = readLedger(language);
    const ladderNow = readLadder(language);
    for (const item of head) {
      const made = ladderAsk(item.key, asked, ladderNow, item);
      if (made) {
        questions.push(made);
        used.push(item.key);
      }
    }
    // 낱말·표현은 카드 한 장에서 한 칸 가림(카드가 없을 때만 넣어 둔 영어 단어 문제·묶음 퀴즈).
    for (const key of keys) {
      const question = askCard(key, asked, ladderNow, `${day}-${round}`) ?? (key.startsWith("w|") ? undefined : bundleQuiz(language, [key], { seed: `${day}-${round}-${key}`, stage, style: "choose", fallback: "type", strict: true }).questions[0]);
      if (question) {
        questions.push(question);
        used.push(key);
      }
    }
    return questions.length ? takeBatch({ keys: used, questions }) : null;
  };
  const keepMake = (): QuizBatch | null => {
    if (focusKeys.current.length) {
      const keys = focusKeys.current.slice(0, 5);
      focusKeys.current = focusKeys.current.slice(5);
      reviewBatch.current = false;
      const made = keysBatch(keys);
      if (made) return takeBatch(made);
    }
    // 다시 볼 것이 있으면 새 묶음과 번갈아(연달아 다시 볼 것만 나오지 않게), 새 것이 떨어지면 다시 볼 것만.
    if (!reviewBatch.current) {
      const due = reviewBatchOf();
      if (due) {
        reviewBatch.current = true;
        lastCircle.current = new Set(due.keys);
        return takeBatch(due);
      }
    }
    reviewBatch.current = false;
    const fresh = makeFresh();
    if (fresh) return fresh;
    const due = reviewBatchOf();
    if (!due) return null;
    reviewBatch.current = true;
    return takeBatch(due);
  };
  const keepBody = (
    <div data-keep-learning data-focus-serial={focusSerial}>
      {/* Today line above the question — the cell that grew lights up briefly (same numbers as the Logbank today line). */}
      <InlineQuiz
        ui={ui}
        locale={locale}
        language={language}
        explainLink={false}
        resetKey={`${language}|${focusSerial}`}
        make={keepMake}
        adKey="keep"
        retryKey={`${bank?.next.length ?? -1}|${bank?.ready.size ?? 0}|${spotCards.size}|${prepared?.length ?? -1}`}
        onResult={recordOne}
        onParts={(parts) =>
          // 복합 문제: 소재마다 한 번에(따로 부르면 기록이 서로 덮임).
          finishMany(parts.map((part) => ({ key: part.key, correct: part.correct, review: review[part.key] ? part.key : undefined, ...(part.seen ? { seen: true } : {}), ...(part.shape ? { shape: part.shape } : {}) })))
        }
        dictDoor
        empty={
          !bank || !ranked.length ? (
            <p className="px-1 py-2 text-caption text-slate-400">…</p>
          ) : (
            <p className="px-1 py-2 text-caption text-slate-400">✓ {ui.planAllDone}</p>
          )
        }
      />
    </div>
  );
  return children({
    keep: { summary: null, body: keepBody },
    review: { summary: null, body: null },
    overlays: null,
  });
}

/** 넣어 둔 칸이 나온 횟수 — 퀴즈와 첫 측정·실력 확인(exam) 답을 같이 센다(첫 측정에서 본 문장 다음 문장부터). */
function preparedTurn(events: readonly { k: string; src: string }[], key: string): number {
  return events.filter((one) => one.k === key && (one.src === "quiz" || one.src === "exam")).length;
}

/** 새 묶음 문제 수(종류 비율로 나눔, ladder.ts kindCounts). */
const BATCH_SIZE = 7;
