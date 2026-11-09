"use client";

import { QUIZ_FOCUS_EVENT, takeQuizFocus } from "@/lib/curriculum/quizFocus";
import { cardFaces, checkStates, dayOfSeconds } from "@/lib/curriculum/checkState";
import { answeredKeys, cardMode, expressionChance } from "@/lib/curriculum/quizTier";
import { reviewKeys as ledgerReview } from "@/lib/curriculum/todayCards";
import { noteLedger, readLedger } from "@/lib/curriculum/logLedger";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePremium } from "@/contexts/PremiumContext";
import { apiUrl } from "@/lib/apiBase";
import { ladderFor } from "@/lib/curriculum/stages";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { UICopy } from "@/lib/copy";
import type { ReviewMap } from "@/lib/curriculum/dailyPlan";
import { bundleQuiz, cardQuiz, QUIZ_SIZE, registerQuizSources, registerWordGender, type QuizCard, type QuizQuestion } from "@/lib/curriculum/quiz";
import { announceKnown, useCheckups } from "@/lib/curriculum/useCheckups";
import { confirmDue, knownState } from "@/lib/curriculum/known";
import { useWordBank } from "@/lib/curriculum/useWordBank";
import { useExpressionCards } from "@/lib/curriculum/useExpressionCards";
import { nextExpressions } from "@/lib/curriculum/expressionDeck";
import { latestCheck } from "@/lib/curriculum/skillCheck";
import { chooseFromPrepared, pickPrepared, turnPrepared, typeFromPrepared } from "@/lib/curriculum/preparedQuiz";
import { knownSlotWeight } from "@/lib/curriculum/languagePairs";
import { loadWordTraits } from "@/lib/curriculum/wordTraits";
import { learnerLanguages } from "@/lib/curriculum/learnerLanguages";
import { readCachedAccount } from "@/lib/account/session";
import { factsOf } from "@/lib/account/profileFacts";
import { usePrepared } from "@/lib/curriculum/preparedLoad";
import { peekBank, stageCuts, wordKey } from "@/lib/curriculum/vocabBank";
import { knowChance, levelOf, noteLevelBatch, pickLevelWords, presumedWords, tooEarly } from "@/lib/curriculum/vocabLevel";
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
 * 낱말·표현은 카드 한 장에서 한 칸 가림(quiz.ts cardQuiz, 모양은 quizTier.ts), 결과는 사건 장부(logLedger)·quizDays·서버 익힘(/api/curriculum/scripts check).
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
  const ok = new Set(readLedger(language).filter((event) => event.r === "ok").map((event) => event.k));
  return prepared.map((item) => item.key).filter((key) => ok.has(key));
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
  // 어림 hard(예문 없이 쓰기)로 낸 열쇠 — 맞히면 장부 쓰기 sure(curriculum/quizTier.ts).
  const sureKeys = useRef<Set<string>>(new Set());
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
  // 맞나 틀리나 관사 성 규칙(es·fr·it·pt)에 쓸 낱말 성(word-traits).
  useEffect(() => {
    let live = true;
    void loadWordTraits(language).then((book) => {
      if (live && book) registerWordGender(language, book);
    });
    return () => {
      live = false;
    };
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
  const finishMany = (all: readonly { key: string; correct: boolean; review?: string; shape?: "c" | "t"; miss?: string; seen?: boolean; src?: "judge" }[]) => {
    const results = all.filter((one) => !one.seen);
    if (!results.length) return;
    let logged = log;
    for (const { key, correct, shape, miss, src } of results) {
      const sure = sureKeys.current.has(key) && shape === "t";
      sureKeys.current.delete(key);
      noteQuizDay(language, localDay(), correct, key, shape, miss, src, sure);
      logged = recordQuiz(logged, key, correct);
    }
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
  // 아는 확률 어림: 단어 = 수준 어림 × 빈도 순위, 표현 = 그 표현 단계 vs 지금 단계(curriculum/quizTier.ts).
  const estimateOf = (key: string): number | null => {
    if (key.startsWith("w|")) {
      const rank = rankOf.get(key);
      return rank === undefined ? null : knowChance(levelOf(circleRef.current, stage, cuts), rank);
    }
    if (key.startsWith("e|")) {
      const at = ladderFor(language)?.stages.find((one) => one.expressions.includes(key.slice(2)))?.order;
      return at === undefined ? null : expressionChance(at, stage);
    }
    return null;
  };
  // 카드 문제 하나: 기록이 있으면 기록대로(맞나 틀리나 섞음), 없으면 어림으로 고르기·쓰기·예문 없이 쓰기.
  const askCard = (key: string, face: (key: string) => "hide" | "show", answered: ReadonlySet<string>, seed: string): QuizQuestion | null => {
    const how = cardMode(face(key), answered.has(key), estimateOf(key));
    const question = cardQuiz(language, key, how.mode, seed, { judge: how.judge, bare: how.bare });
    if (question && how.bare) sureKeys.current.add(key);
    return question;
  };
  /** 같은 칸의 바꾼 문장이 있는 문법 칸(problems/<언어>-gv.json)은 다시 볼 때도 그 칸 퀴즈 답 수 차례의 다른 문장으로. 없으면 null(묶음 퀴즈). */
  const turnedGrammar = (key: string, events: readonly { k: string; src: string }[]): QuizQuestion | null => {
    const item = prepared?.find((one) => one.key === key && one.kind === "grammar");
    return item?.variants?.length ? chooseFromPrepared(turnPrepared(item, events.filter((one) => one.k === key && one.src === "quiz").length)) : null;
  };
  /** 열쇠마다 카드 문제, 카드가 없는 열쇠(문법·문장구조 등)는 old(묶음 퀴즈)로 — 순서는 받은 대로. */
  const askKeys = (keys: readonly string[], old: (rest: readonly string[]) => { keys: string[]; questions: QuizQuestion[] }): { keys: string[]; questions: QuizQuestion[] } => {
    const ledgerNow = readLedger(language);
    const face = cardFaces(ledgerNow);
    const answered = answeredKeys(ledgerNow);
    const made = keys.map((key) => ({ key, question: askCard(key, face, answered, `${day}-${round}`) ?? turnedGrammar(key, ledgerNow) }));
    const rest = made.filter((one) => !one.question).map((one) => one.key);
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
    const keys = levelPick(QUIZ_SIZE + 1, { skip: lastCircle.current });
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
      const more = nextExpressions(exprCards.deck, { seen: exprSeen, ready: (key) => exprCards.ready.has(key), skip: lastCircle.current, ...(exprFrom ? { from: exprFrom } : {}) });
      keys.splice(Math.min(1, keys.length), 0, ...more);
    }
    // 같은 단계 문법은 이 학습자에게 무거운 칸(모국어·아는 언어에 없는 개념)부터 — 프로필 모국어 → 국적 → 앱 언어.
    const speaks = learnerLanguages(factsOf(readCachedAccount()?.profile.facts), locale).known;
    const head = prepared ? pickPrepared(prepared, { stage, skip: new Set([...lastCircle.current, ...preparedRest(language, prepared)]), ...(speaks.length ? { weight: (key: string) => knownSlotWeight(speaks, language, key) } : {}) }) : [];
    lastCircle.current = new Set([...head.map((item) => item.key), ...keys]);
    if (!keys.length && !head.length) return null;
    void growBank(language, locale, keys.map((key) => ({ key, stage })));
    // 다음 묶음에 나올 새 낱말도 미리(문제은행 미리 받기).
    void growBank(language, locale, levelPick(8, { skip: new Set(keys) }).map((key) => ({ key, stage })));
    const questions: QuizQuestion[] = [];
    const used: string[] = [];
    const writtenWord = new Map((prepared ?? []).filter((item) => item.kind === "word").map((item) => [item.key, item]));
    // 같은 칸은 나올 때마다 다른 문장(바꾼 사전 예문이 있는 칸만) — 이 폰 장부의 그 칸 퀴즈 답 수로 차례.
    const asked = readLedger(language);
    for (const item of head) {
      const made = chooseFromPrepared(turnPrepared(item, asked.filter((one) => one.k === item.key && one.src === "quiz").length));
      if (made) {
        questions.push(made);
        used.push(item.key);
      }
    }
    // 낱말·표현은 카드 한 장에서 한 칸 가림(카드가 없을 때만 넣어 둔 영어 단어 문제·묶음 퀴즈).
    const ledgerNow = asked;
    const face = cardFaces(ledgerNow);
    const answered = answeredKeys(ledgerNow);
    for (const key of keys) {
      const word = face(key) === "show" ? writtenWord.get(key) : undefined;
      const question = askCard(key, face, answered, `${day}-${round}`) ?? (word ? typeFromPrepared(word) : null) ?? bundleQuiz(language, [key], { seed: `${day}-${round}-${key}`, stage, style: "choose", fallback: "type", strict: true }).questions[0];
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
          finishMany(parts.map((part) => ({ key: part.key, correct: part.correct, review: review[part.key] ? part.key : undefined, ...(part.seen ? { seen: true } : {}), ...(part.shape ? { shape: part.shape } : {}), ...(part.src ? { src: part.src } : {}) })))
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
