"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePremium } from "@/contexts/PremiumContext";
import { apiUrl } from "@/lib/apiBase";
import { ladderFor } from "@/lib/curriculum/stages";
import { PlacementPlayer } from "@/components/studyMap/PlacementPlayer";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { UICopy } from "@/lib/copy";
import {
  daysLeft,
  itemForKey,
  learnedFrom,
  PACES,
  RECALL_ITEM,
  reviewKeysOf,
  reviewLabel,
  todayPlan,
  type Pace,
  type PlanItem,
  type PlanOrder,
  type ReviewMap,
} from "@/lib/curriculum/dailyPlan";
import { allFramesFor } from "@/lib/curriculum/frames";
import { RecallPlayer } from "@/components/studyMap/RecallPlayer";
import { buildQuiz, buildUnit, bundleQuiz, orderTiles, QUIZ_SIZE, registerQuizSources, type QuizCard, type QuizMix, type QuizQuestion, type QuizStyle } from "@/lib/curriculum/quiz";
import { QuizPlayer } from "@/components/studyMap/QuizPlayer";
import { CheckupPlayer } from "@/components/studyMap/CheckupPlayer";
import { maybeShowInterstitial } from "@/lib/ads";
import { SkillRecord } from "@/components/studyMap/SkillRecord";
import { buildCheckup, checkupDue, checkupReady, checkupWeakest, type CheckResult } from "@/lib/curriculum/checkup";
import { bigTestDue, buildEntryCheck, buildStageTest, entryCheckResult, entryDue, failedToday, stageTestResult } from "@/lib/curriculum/stageTest";
import { announceKnown, useCheckups } from "@/lib/curriculum/useCheckups";
import { cleanKnown, confirmDue, knownState, skippedIds } from "@/lib/curriculum/known";
import { addTally, readTally, saveTally, type Tally } from "@/lib/curriculum/studyTally";
import { useWordBank, wordGloss } from "@/lib/curriculum/useWordBank";
import { peekBank, quizPos, type VocabBy, type VocabPick } from "@/lib/curriculum/vocabBank";
import { gapSources, gapsFromCards, mergeGaps, readLocalGaps } from "@/lib/curriculum/gaps";
import { markPracticed, PRACTICED_EVENT, readPracticed } from "@/lib/curriculum/practicedToday";
import { useItemStats } from "@/lib/curriculum/useItemStats";
import { useBillingUiOptional } from "@/components/BillingScreen";
import { MorningControl } from "@/components/studyMap/WeakStrip";
import { allScriptsFor, glossFor, isSituationScript, scriptById } from "@/lib/curriculum/stageScripts";
import { MiniDialogue, type Bubble } from "@/components/studyMap/WayPicker";
import { InlineQuiz, type QuizBatch } from "@/components/studyMap/InlineQuiz";
import { pickBankScript } from "@/lib/curriculum/scriptBank";
import { BodyLayer } from "@/components/FullScreenLayer";
import { MATCH_SIZE, WordMatch, matchPairs, type MatchPair } from "@/components/studyMap/WordMatch";
import { samePosRounds } from "@/lib/curriculum/wordRounds";
import { useStageGlosses } from "@/lib/curriculum/useStageGlosses";
import { whereLearned } from "@/lib/curriculum/learnedWhere";
import { keyPart, nextStudy, recordQuiz, type QuizLog, type StudyPick } from "@/lib/curriculum/nextStudy";
import { QUIZ_LOG_EVENT, readQuizLog, saveQuizLog } from "@/lib/curriculum/quizLogStore";
import type { PartId } from "@/lib/notes/stageParts";
import { wordbook } from "@/lib/curriculum/wordbook";
import { growBank } from "@/lib/curriculum/qbank";
import { noteQuizDay } from "@/lib/curriculum/quizDays";
import { emptyCircle, growCircle, itemState, noteAnswer, pickCircle, trimCircle, type Circle } from "@/lib/curriculum/circle";
import { WordbookCard } from "@/components/studyMap/Wordbook";
import { loadVocabulary } from "@/lib/vocabulary";
import { useVocabPreviewOptional } from "@/contexts/VocabPreviewContext";
import type { LedgerState } from "@/lib/learner/ledger";

/**
 * 오늘 할 것(lib/curriculum/dailyPlan.ts, 2026-10-28 사용자 "매일 학습할 걸 정해 주는 흐름"):
 * 분량(5·10·20분)마다 "n일 완성", 순서(커리큘럼 순서 기본 · 내 기록에 맞춰), 목록(다시 볼 것 먼저) — 누르면 그 대본·문장구조를 연다.
 * 오늘 목록은 날짜·분량·순서로 이 폰에 묶어 두어, 하나를 끝내도 다른 것으로 바뀌지 않고 ✓가 붙는다.
 * 학습 끝 체크(SelfCheck)는 대본·문장구조 화면 끝에서 표현·문장구조마다 알아요/헷갈려요 → 서버 다시 볼 것(stageScripts:v1 review).
 */

const SETTINGS_KEY = "dailyPlan.v1";
const TODAY_KEY = "dailyPlan.today.v1";
const REVIEW_EVENT = "lb-review";
/** 오늘 끝낸 퀴즈(열쇠) — 틀린 틀 다시 연습에서 온 퀴즈는 다시 볼 것에 없어서 이 폰에 날짜로 남긴다. */
const QUIZ_DONE_KEY = "dailyPlan.quizDone.v1";
function readQuizDone(day: string): Set<string> {
  try {
    const raw = JSON.parse(localStorage.getItem(QUIZ_DONE_KEY) ?? "null") as { day?: string; keys?: string[] } | null;
    return new Set(raw?.day === day ? (raw.keys ?? []) : []);
  } catch {
    return new Set();
  }
}

function saveQuizDone(day: string, keys: Set<string>) {
  try {
    localStorage.setItem(QUIZ_DONE_KEY, JSON.stringify({ day, keys: [...keys] }));
  } catch {
    // 이 화면에서만.
  }
}

type StudyFocus = "review" | "auto" | PartId;
/** 지속 학습의 두 줄(2026-10-29 사용자 "복습/이외 카테고리로 나눠줘" → "알아서·어휘·문법·표현·발음을 복습과 같은 층위로"). */
type StudyLane = "review" | "learn";
/** 복습 탭마다 고른 연습 방식(2026-10-30 사용자 "각각의 탭에 들어갔을 때 학습 방식을 선택하게"): 알아서 = 돌아가며, match = 단어 맞추기(어휘만). */
type Style = "auto" | QuizStyle | "match";
const STYLES: readonly Style[] = ["auto", "type", "choose", "order", "say", "meaning", "match"];
type Settings = { pace: Pace; order: PlanOrder; mix: QuizMix; focus: StudyFocus; vocab?: VocabPick; styles?: Partial<Record<StudyFocus, Style>> };
// 듣기 위주는 뺌(2026-10-30 사용자 "듣기 문제는 삭제") — 저장된 듣기는 랜덤으로.
const MIXES: readonly QuizMix[] = ["auto", "speak", "read"];
// 계속 공부 갈래(2026-10-29 "지속 학습도 단어·문법 등으로 나눠도 돼" → "진행해줘").
// 발음 버튼은 뺌(2026-10-29 사용자 — 표현과 같은 문제였음). 저장된 발음은 랜덤으로.
const FOCUSES: readonly StudyFocus[] = ["review", "auto", "vocab", "grammar", "expression"];
type Snapshot = { day: string; language: string; pace: number; order: PlanOrder; items: PlanItem[] };

function readSettings(): Settings {
  try {
    const raw = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? "null") as Partial<Settings> | null;
    const pace = PACES.includes(raw?.pace as Pace) ? (raw!.pace as Pace) : 10;
    const mix = MIXES.includes(raw?.mix as QuizMix) ? (raw!.mix as QuizMix) : "auto";
    const focus = FOCUSES.includes(raw?.focus as StudyFocus) ? (raw!.focus as StudyFocus) : "auto";
    // 옛 "band"(많이 쓰는 순) 설정은 버린다(전체) — 2026-10-31 단계로 바꿈.
    const vocab = raw?.vocab && ["all", "stage", "pos", "topic"].includes(raw.vocab.by) && typeof raw.vocab.value === "string" ? raw.vocab : undefined;
    const styles = Object.fromEntries(Object.entries(raw?.styles ?? {}).filter(([key, value]) => FOCUSES.includes(key as StudyFocus) && STYLES.includes(value as Style))) as Settings["styles"];
    return { pace, order: raw?.order === "record" ? "record" : "curriculum", mix, focus, ...(vocab ? { vocab } : {}), ...(styles && Object.keys(styles).length ? { styles } : {}) };
  } catch {
    return { pace: 10, order: "curriculum", mix: "auto", focus: "auto" };
  }
}

function localDay(now = new Date()): string {
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

function readSnapshot(): Snapshot | null {
  try {
    return JSON.parse(localStorage.getItem(TODAY_KEY) ?? "null") as Snapshot | null;
  } catch {
    return null;
  }
}

/** 학습 끝 체크가 서버에 반영되면 오늘 할 것이 다시 볼 것을 새로 읽는다. */
function announceReview(language: string, review: ReviewMap) {
  window.dispatchEvent(new CustomEvent(REVIEW_EVENT, { detail: { language, review } }));
}

export function TodayPlan({
  ui,
  locale,
  language,
  stage,
  passed,
  review: initialReview,
  recommended,
  onOpen,
  grammarName,
  redo = [],
  weakest = null,
  expressions = [],
  cards = [],
  onStageChanged,
  free = false,
  learned = null,
  children,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  stage: number;
  passed: readonly string[];
  review: ReviewMap;
  /** 튜터가 고친 줄(노트 카드) — 새로 들어간 말이 "막혔던 말"(curriculum/gaps.ts). */
  cards?: readonly { wrong: string; right: string; note: string; at: number; kind?: string }[];
  /** 튜터가 같은 틀을 두 번 고친 것(/api/notebook redo) — 고친 줄과 함께 퀴즈로. */
  redo?: readonly { frame: string; card: QuizCard }[];
  /** 서버가 고른 오늘의 대본(내 기록에 맞춰). */
  recommended: string | null;
  onOpen: (stage: number, id: string) => void;
  /** 문법 칸 이름(단계·번호 → 앱 언어, NotebookSection의 노트 칸). */
  grammarName: (stage: number, index: number) => string;
  /** 지금 단계에서 가장 모자란 갈래(stageParts weakest) — 계속 공부가 여기부터. */
  weakest?: PartId | null;
  /** 지금 단계 핵심 표현과 장부 상태(stageParts expressions). */
  expressions?: readonly { text: string; state: LedgerState | null }[];
  /** 실력 확인으로 시작 단계를 바꾼 뒤(NotebookSection이 다시 읽음). */
  onStageChanged?: () => void;
  /** 자유롭게(curriculum/studyMode.ts): 단계 시험·단계 미리 확인을 내지 않는다(stage = 가장 낮은 열린 단계). */
  free?: boolean;
  /** 일일 학습 카드 맨 아래에 묶는 "익힌 것"(ScriptAmount inside) — 지속 학습 숫자와 섞이지 않게. */
  learned?: ReactNode;
  /** 큰 칸 둘(오늘 할 것·복습)의 요약과 내용, 늘 떠 있어야 하는 퀴즈·시험 화면. */
  children: (parts: { today: { summary: ReactNode; body: ReactNode; done: boolean }; keep: { summary: ReactNode; body: ReactNode; wrong: boolean }; review: { summary: ReactNode; body: ReactNode }; overlays: ReactNode }) => ReactNode;
}) {
  // 대본 이름은 앱 언어로(서버가 옮김) — 받으면 다시 그린다. 오늘 목록은 지금 단계와 다음 단계까지.
  useStageGlosses(language, stage, locale);
  useStageGlosses(language, Math.min(5, stage + 1), locale);
  const { isPremium } = usePremium();
  const [settings, setSettings] = useState<Settings>({ pace: 10, order: "curriculum", mix: "auto", focus: "auto" });
  const [review, setReview] = useState<ReviewMap>(initialReview);
  // 복습은 지속 학습 아래 따로 칸(2026-10-30 사용자 "복습탭은 따로 독립된 탭으로, 지속학습 아래에") — 지속 학습 탭에는 복습이 없다(예전 설정의 review는 랜덤으로).
  // 지속 학습 탭은 어휘 · 문법 · 표현(2026-10-30 사용자 "지속 학습 > 단어 > 학습 방식" — 랜덤은 탭이 아니라 방식). 저장된 랜덤·복습은 어휘로.
  const keepFocus: PartId = settings.focus === "review" || settings.focus === "auto" ? "vocab" : settings.focus;
  const studyFocus: PartId | null = keepFocus;
  // 알아서일 때 세 번에 한 번은 새 낱말(빈도 단어)을 앞으로 — 부족한 갈래가 늘 앞을 차지해 낱말이 안 나오지 않게.
  const firstPick = (picks: readonly StudyPick[], lane: StudyLane = "learn"): StudyPick | undefined =>
    lane === "learn" && !studyFocus && round % 3 === 2 ? (picks.find((pick) => pick.reason === "word") ?? picks[0]) : picks[0];
  // 오늘 계속 공부로 는 것(curriculum/studyTally.ts, 이 폰).
  const [tally, setTally] = useState<Tally>({ day: "", known: [], fixed: [] });
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [now, setNow] = useState(0);
  // 오늘 배운 것에서 누른 칩 — 위 목록에서 그게 나온 대본·문장구조를 표시한다.
  const [picked, setPicked] = useState<string | null>(null);
  // 지금 연 퀴즈(오늘 목록의 한 칸)와 오늘 끝낸 퀴즈.
  const [quiz, setQuiz] = useState<PlanItem | null>(null);
  const [bundle, setBundle] = useState<{ keys: string[]; questions: QuizQuestion[] } | null>(null);
  const [quizDone, setQuizDone] = useState<Set<string>>(new Set());
  const [matching, setMatching] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState<"keep" | "review" | null>(null);
  const [todaySettings, setTodaySettings] = useState(false);
  // 오늘 할 것의 퀴즈 한 문제: 답은 "다음"을 누를 때 기록(바로 기록하면 맞음·틀림을 보기 전에 다음 할 것으로 바뀜).
  const todayServed = useRef<{ id: string; result: boolean | null } | null>(null);
  // 오늘 끝까지 해 본 대본·문장구조(통과 못 해도 ✓, curriculum/practicedToday.ts).
  const [practiced, setPracticed] = useState<Set<string>>(new Set());
  useEffect(() => {
    const load = () => setPracticed(readPracticed(language));
    load();
    const on = (event: Event) => {
      if ((event as CustomEvent<{ language: string }>).detail?.language === language) load();
    };
    window.addEventListener(PRACTICED_EVENT, on);
    return () => window.removeEventListener(PRACTICED_EVENT, on);
  }, [language]);
  // 계속 공부(끝없이): 푼 기록·이번에 낸 열쇠·연달아 틀린 수·지금 문제가 몇 번째인지(같은 열쇠라도 문제를 바꾸는 씨앗).
  const [log, setLog] = useState<QuizLog>({});
  const [asked, setAsked] = useState<Set<string>>(new Set());
  const askedWrong = useRef<Set<string>>(new Set());
  const [missRun, setMissRun] = useState(0);
  const [round, setRound] = useState(0);
  const [studying, setStudying] = useState<StudyPick | null>(null);
  const [lane, setLane] = useState<StudyLane>("learn");
  // 단어장(curriculum/wordbook.ts): 저장한 단어는 이 폰(lib/vocabulary.ts), 낱말을 누르면 뜻 시트.
  const [savedWords, setSavedWords] = useState<ReturnType<typeof loadVocabulary>>([]);
  const preview = useVocabPreviewOptional();
  useEffect(() => {
    setSavedWords(loadVocabulary());
  }, [language, preview?.savingWord]);
  // 이번 주 확인(lib/curriculum/checkup.ts): 서버에 남긴 결과(최근 12번)와 지금 연 것("take" = 풀기, "view" = 지난 결과 보기).
  const { checkups, known, save: saveCheckup } = useCheckups(language);
  const itemStats = useItemStats(language);
  // 빈도 단어 묶음(curriculum/vocabBank.ts — 지금 en·es·ja): 지속 학습의 어휘 분모와 새 낱말.
  // 기준만 고르고 칸을 안 골랐으면: 단계는 내 단계까지 전체(빈 값), 품사·주제는 첫 칸(명사 · 사람).
  const vocabPick: VocabPick | null =
    keepFocus === "vocab" && settings.vocab && settings.vocab.by !== "all"
      ? { by: settings.vocab.by, value: settings.vocab.value || ({ stage: "", pos: "noun", topic: "people" } as const)[settings.vocab.by] }
      : null;
  // 내가 저장한 낱말(이 학습 언어)은 단계와 상관없이 어휘 퀴즈 맨 앞(2026-10-31 낱말 층위 ⑤).
  const mineWords = useMemo(() => new Set(savedWords.filter((one) => one.languageCode === language).map((one) => one.word.trim())), [savedWords, language]);
  // 넓어지는 원(curriculum/circle.ts, 2026-10-31 사용자 "원을 키워 가면서 일정 비율 모르는 묶음으로 계속"): 어휘 탭에서 칸을 따로 안 골랐을 때.
  // 품사·주제 칸을 고르면 그 칸의 원을 따로(가상 사용자 셋 다 ⚙ 주제를 바꾼 뒤 예전 순서로 돌아가 같은 문장 반복 — 2026-10-31).
  const circleOn = true;
  const circleStore = !vocabPick || (vocabPick.by === "stage" && !vocabPick.value) ? `quizCircle.v1.${language}` : `quizCircle.v1.${language}.${vocabPick.by}:${vocabPick.value}`;
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
  const bank = useWordBank(language, locale, known, vocabPick, stage, mineWords, circleOn ? circleNeed : undefined);
  const knownWord = (key: string) => knownState(known, key) === "known";
  // 원 안인데 아직 카드가 없는 낱말(앞에서 열둘) — 그 묶음을 받아 오게.
  // 원은 카드가 온 낱말로만 센다(카드 없는 낱말이 원 안에 남으면 익힘 몫이 70%에 못 닿아 원이 안 커짐 — 가상 사용자 2026-10-31: 2주에 10개).
  const circleOrder = useMemo(() => (bank ? bank.orderKeys.filter((key) => bank.ready.has(key)) : []), [bank]);
  const needKey = circleOn && bank ? bank.orderKeys.slice(0, circle.size + 20).filter((key) => !bank.ready.has(key)).slice(0, 12).join("|") : "";
  useEffect(() => {
    setCircleNeed(needKey ? needKey.split("|") : []);
  }, [needKey]);
  const [frozenItems, setFrozenItems] = useState<readonly unknown[] | null>(null);
  const [checkupOpen, setCheckupOpen] = useState<"take" | "record" | "stage" | "entry" | "placement" | null>(null);
  // 큰 시험을 한 번도 안 본 사람: 이 폰에서 오늘 할 것을 처음 본 때(3일 뒤 단계 시험을 권함, curriculum/stageTest.ts bigTestDue).
  const [firstSeen, setFirstSeen] = useState(0);
  useEffect(() => {
    const key = `bigTestFirstSeen.${language}`;
    try {
      const saved = Number(localStorage.getItem(key));
      if (saved > 0) setFirstSeen(saved);
      else {
        localStorage.setItem(key, String(Date.now()));
        setFirstSeen(Date.now());
      }
    } catch {
      // 이 폰에 남기지 못하면 권하지 않는다.
    }
  }, [language]);
  // 틀린 것 탭에 들어갈 때마다 처음부터(그 탭에서 낸 것 빼기를 비움).
  useEffect(() => {
    if (settings.focus === "review") askedWrong.current = new Set();
  }, [settings.focus]);
  useEffect(() => {
    setLog(readQuizLog(language));
    setAsked(new Set());
    setMissRun(0);
  }, [language]);
  // 다른 화면(문장구조 수업)이 쓴 기록을 다시 읽는다.
  useEffect(() => {
    const reload = (event: Event) => {
      if ((event as CustomEvent<string>).detail === language) setLog(readQuizLog(language));
    };
    window.addEventListener(QUIZ_LOG_EVENT, reload);
    return () => window.removeEventListener(QUIZ_LOG_EVENT, reload);
  }, [language]);
  useEffect(() => {
    // 저장해 둔 분량·순서와 오늘 목록은 화면에 붙은 뒤 읽는다(서버 그림과 어긋나지 않게).
    setSettings(readSettings());
    setSnapshot(readSnapshot());
    setNow(Date.now());
  }, []);
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

  const passedKey = passed.join(",");
  const passedSet = useMemo(() => new Set(passedKey ? passedKey.split(",") : []), [passedKey]);
  // 시험에서 맞혀 확인 중·이미 앎인 것만으로 된 대본·문장구조는 커리큘럼에서 건너뜀(curriculum/known.ts) — 오늘 할 것·n일 완성.
  const skipSet = useMemo(() => skippedIds(language, known), [language, known]);
  const skipKey = [...skipSet].sort().join(",");
  const planPassed = useMemo(() => new Set([...passedSet, ...skipSet]), [passedSet, skipSet]);
  const confirm = confirmDue(known, now || Date.now());
  // 대화에서 막힌 것(뼈대 밖 포함): 노트 카드 + 이 폰의 표현 보기 → 퀴즈 재료를 넘기고, 이미 앎은 빼고 최근 것부터.
  const cardsKey = cards.map((card) => `${card.at}`).join(",");
  const gaps = useMemo(() => {
    const list = mergeGaps(gapsFromCards(language, cards), typeof window === "undefined" ? [] : readLocalGaps(language));
    registerQuizSources(language, list.map((gap) => ({ key: gap.key, sources: gapSources(gap) })));
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, cardsKey, now]);
  const gapKeys = gaps.filter((gap) => knownState(known, gap.key) !== "known").map((gap) => gap.key);
  // 튜터가 고친 내 줄(틀린 곳 찾아 고치기 재료): 막힌 것의 고친 줄 + 같은 틀을 두 번 고친 줄(redo, f|틀).
  const spotCards = useMemo(() => {
    const map = new Map<string, QuizCard>();
    for (const item of redo) map.set(`f|${item.frame}`, item.card);
    for (const gap of gaps) if (gap.card && !map.has(gap.key)) map.set(gap.key, gap.card);
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gaps, redo.map((item) => `${item.frame}:${item.card.wrong}`).join("|")]);
  const day = now ? localDay(new Date(now)) : "";
  useEffect(() => {
    if (day) setTally(readTally(language, day));
  }, [language, day]);
  useEffect(() => {
    if (day) setQuizDone(readQuizDone(day));
  }, [day]);
  const redoKey = redo.map((item) => `${item.frame}:${item.card.wrong}`).join("|");
  const fresh = useMemo(
    () => {
      if (!now) return [];
      // 채우기: 계속 공부와 같은 순서(아는지 확인 → 퀴즈로 틀렸던 것 → 부족한 갈래 → 곧 나올 것 → 다지기)에서 몇 개를 오늘 할 것 안에.
      const fill = nextStudy({ language, stage, passed: planPassed, review, log, weakest, expressions, confirm, gaps: gapKeys, now })
        // 다시 볼 것은 이미 앞에, 아직 안 배운 것(new)은 빼고 — 처음 쓰는 사람은 채우기 없이 새 대본만.
        .filter((pick) => pick.reason !== "again" && pick.reason !== "new")
        .map((pick) => pick.key);
      // 하루의 끝 대화 한 칸: 대본 은행에서 지금 단계 이하 장면 하나(2026-10-30 사용자 A).
      const sceneScript = pickBankScript({ language, stage, passed: planPassed, seed: localDay(new Date(now)) });
      const scene = sceneScript ? { id: sceneScript.id, stage: sceneScript.stage } : null;
      return todayPlan({ language, stage, passed: planPassed, review, pace: settings.pace, order: settings.order, recommended, redo, fill, scene, now });
    },
    // 오늘 목록은 분량·순서·언어가 바뀔 때만 새로(하나 끝냈다고 바꾸지 않는다) — passed·review는 처음 계산에만.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [now, language, stage, settings.pace, settings.order, recommended, redoKey, skipKey],
  );
  const same = snapshot && snapshot.day === day && snapshot.language === language && snapshot.pace === settings.pace && snapshot.order === settings.order;
  // 오늘 목록을 정한 뒤 시험으로 걸러진 것은(아직 안 했으면) 뺀다.
  const items = (same ? snapshot.items : fresh).filter((item) => !(item.kind !== "quiz" && skipSet.has(item.id) && !passedSet.has(item.id)));
  useEffect(() => {
    if (same || !day || !fresh.length) return;
    const next: Snapshot = { day, language, pace: settings.pace, order: settings.order, items: fresh };
    try {
      localStorage.setItem(TODAY_KEY, JSON.stringify(next));
    } catch {
      // 이 화면에서만.
    }
    setSnapshot(next);
  }, [same, day, fresh, language, settings.pace, settings.order]);

  // 대본을 대화 대신 문제 묶음으로 할지(학습 조합): 말하기 = 늘 대화, 읽기 = 묶음, 랜덤 = 상황 대본은 대화·나머지는 묶음.
  const [unitItem, setUnitItem] = useState<PlanItem | null>(null);
  // 꺼내 쓰기 칸(dailyPlan RECALL_ITEM, curriculum/recall.ts): 익힌 문장구조(지금 단계까지, 오래된 것부터)로.
  const [recalling, setRecalling] = useState(false);
  const recallLearned = allFramesFor(language).filter((frame) => frame.stage <= stage && passedSet.has(frame.id)).map((frame) => frame.id);
  const unitMixOf = (item: PlanItem): "read" | null => {
    if (item.kind !== "script") return null;
    if (settings.mix === "read") return "read";
    if (settings.mix === "speak") return null;
    const script = scripts.find((one) => one.id === item.id);
    if (!script || isSituationScript(script)) return null;
    return "read";
  };
  const save = (next: Settings) => {
    setSettings(next);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch {
      // 이 화면에서만.
    }
  };

  if (!now || !items.length) return null;
  const scripts = allScriptsFor(language);
  const frames = allFramesFor(language);
  const labelOf = (item: PlanItem) =>
    item.kind === "recall"
      ? ui.recallTitle
      : item.kind === "quiz"
      ? keyLabel(language, item.id, grammarName)
      : item.kind === "script"
      ? glossFor((scripts.find((s) => s.id === item.id) ?? scriptById(language, item.id))?.setting ?? { en: item.id }, locale)
      : (frames.find((f) => f.id === item.id)?.pattern ?? item.id);
  const doneOf = (item: PlanItem) =>
    item.kind === "recall"
      ? practiced.has(RECALL_ITEM)
      : item.kind === "quiz" && quizDone.has(item.id)
      ? true
      : item.review
        ? !review[item.review] || review[item.review]!.due > now
        : item.kind === "quiz"
          ? false
          : passedSet.has(item.id) || practiced.has(item.id);
  // 퀴즈 결과를 열쇠마다(묶음 퀴즈는 여럿을 한 번에 — 상태를 한 번에 고쳐 덮어쓰지 않게).
  const finishMany = (results: readonly { key: string; correct: boolean; review?: string }[]) => {
    if (!results.length) return;
    let logged = log;
    let nextTally = tally;
    for (const { key, correct } of results) {
      noteQuizDay(language, localDay(), correct, key);
      // 오늘 는 것: 틀렸다가 맞힘(이 폰 기록) — 이미 앎이 된 것은 서버 답에서.
      if (correct && logged[key] && !logged[key]!.last) nextTally = addTally(nextTally, { fixed: key });
      logged = recordQuiz(logged, key, correct);
    }
    if (nextTally !== tally) {
      setTally(nextTally);
      saveTally(language, nextTally);
    }
    setLog(logged);
    saveQuizLog(language, logged, false);
    const allRight = results.every((one) => one.correct);
    setMissRun((run) => (allRight ? 0 : run + 1));
    const nextDone = new Set([...quizDone, ...results.map((one) => one.key)]);
    setQuizDone(nextDone);
    saveQuizDone(day, nextDone);
    // 다시 볼 것에서 온 것은 결과 그대로(맞음 → 7일 뒤 한 번 더, 틀림 → 2일 뒤), 고친 줄에서 온 것은 틀렸을 때만 다시 볼 것에 넣는다.
    const check: Record<string, boolean> = {};
    for (const { key, correct, review: fromReview } of results) {
      // 한 번 맞히면 익힘(2026-11-01) — 맞힌 것도 서버에 알려 익힘을 만든다. 이미 익힘이고 다시 볼 것도 아니면 확인 날일 때만.
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
        if (body?.known) {
          announceKnown(language, body.known);
          const fresh = cleanKnown(body.known);
          const became = Object.keys(check).filter((key) => knownState(fresh, key) === "known" && knownState(known, key) !== "known");
          if (became.length) {
            setTally((current) => {
              const next = became.reduce((acc, key) => addTally(acc, { known: key }), current);
              saveTally(language, next);
              return next;
            });
          }
        }
      })
      .catch(() => undefined);
  };
  const finishQuiz = (item: PlanItem, passedQuiz: boolean) => finishMany([{ key: item.id, correct: passedQuiz, review: item.review }]);
  const finished = items.every(doneOf);
  // 이번 주 확인에서 약하게 나온 갈래가 있으면 계속 공부가 그것부터(없으면 연습 기록 쪽 갈래).
  const studyWeakest = checkupWeakest(checkups, now) ?? weakest;
  const lastCheckup = checkups.length ? checkups[checkups.length - 1]! : null;
  const lastBig = [...checkups].reverse().find((result) => result.kind) ?? null;
  const liveCheckupItems = checkupDue(checkups, now) ? buildCheckup({ language, stage, passed: passedSet, review, log, now, stats: itemStats, confirm }) : [];
  // 시험을 연 동안은 문제를 고정(통계·기록이 늦게 와도 풀던 문제가 바뀌지 않게).
  const checkupItems = checkupOpen === "take" && frozenItems ? (frozenItems as typeof liveCheckupItems) : liveCheckupItems;
  const checkupOffer = checkupDue(checkups, now) && checkupReady(checkupItems) && !bigTestDue(checkups, firstSeen, now);
  const finishCheckup = (result: CheckResult) => {
    void saveCheckup(result).then((body) => {
      if (body?.review) announceReview(language, body.review);
    });
  };
  // 큰 시험(처음 시험·단계 시험) 뒤 6주, 큰 시험이 없으면 처음 본 지 3일 — 지금 단계 시험을 권한다(이번 주 확인보다 앞).
  const stageTestOffer = free ? false : !checkupOpen || checkupOpen === "stage" ? bigTestDue(checkups, firstSeen, now) && !failedToday(checkups, stage, now) : false;
  const liveStageItems = stageTestOffer ? buildStageTest({ language, stage, now, stats: itemStats }) : [];
  const stageTestItems = checkupOpen === "stage" && frozenItems ? (frozenItems as typeof liveStageItems) : liveStageItems;
  // 단계 미리 확인(curriculum/stageTest.ts buildEntryCheck): 이 단계에서 이미 아는 것 거르기 — 단계마다 한 번, 이번 주 확인보다 앞.
  const liveEntryItems = !checkupOpen || checkupOpen === "entry" ? buildEntryCheck({ language, stage, known, passed: passedSet, now, stats: itemStats }) : [];
  const entryItems = checkupOpen === "entry" && frozenItems ? (frozenItems as typeof liveEntryItems) : liveEntryItems;
  const entryOffer = checkupOpen === "entry" || (!free && entryDue(checkups, stage, liveEntryItems));
  // 다음에 풀 것(부족한 것부터) — 오늘 목록에 든 퀴즈는 빼고.
  const studyQueue = (which: StudyLane, at: number, weakestNow: PartId | null, skipToday: readonly string[] = []) =>
    nextStudy({
      language,
      stage,
      passed: passedSet,
      review,
      log,
      weakest: weakestNow,
      expressions,
      // 틀린 것 탭(review 줄)은 이번에 낸 것 빼기를 따로 센다 — 퀴즈 탭에서 방금 틀린 문제가 틀린 것 탭에 바로 나오게(2026-10-30).
      skip: new Set([...(which === "review" ? askedWrong.current : asked), ...skipToday]),
      confirm: confirmDue(known, at),
      gaps: gapKeys,
      words: bank?.next,
      focus: studyFocus,
      lane: which,
      now: at,
    });
  const nextIn = (which: StudyLane, weakestNow: PartId | null) => firstPick(studyQueue(which, Date.now(), weakestNow), which) ?? null;
  const words = wordbook(language, known, savedWords, (word) => wordGloss(language, word));
  // 계속 공부 안의 시험: 단계 시험(6주) → 이번 주 확인 → 퀴즈. 시험을 끝내면 결과에서 [계속 공부 ›]로 이어서 퀴즈.
  const placeAt = async (order: number) => {
    const id = ladderFor(language)?.stages.find((one) => one.order === order)?.id;
    if (!id || order === stage) return;
    const ok = await fetch(apiUrl("/api/learner/self-check"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
      body: JSON.stringify({ language, stage: id }),
    })
      .then((response) => response.ok)
      .catch(() => false);
    if (ok) onStageChanged?.();
  };
  // 처음 시험은 첫 화면에서 빼고(2026-10-29 사용자 — 첫 대본까지 누름 줄이기) 대본·문장구조 하나를 해 본 뒤 여기서 한 번 권한다.
  const placementOffer = !lastBig && (passedSet.size > 0 || practiced.size > 0);
  // 새로 배우기 버튼의 시험(실력 확인 → 단계 시험 → 단계 미리 확인), 복습 버튼의 시험(이번 주 확인).
  const learnTest: "placement" | "stage" | "entry" | null = placementOffer ? "placement" : stageTestOffer && stageTestItems.length ? "stage" : entryOffer ? "entry" : null;
  const reviewTest: "take" | null = checkupOffer ? "take" : null;
  const itemsOf = (test: "placement" | "stage" | "entry" | "take") => (test === "placement" ? [] : test === "stage" ? stageTestItems : test === "entry" ? entryItems : checkupItems);
  const studyItem = (pick: StudyPick): PlanItem => {
    const practice = itemForKey(language, pick.key);
    return {
      id: pick.key,
      kind: "quiz",
      stage: practice?.stage ?? stage,
      minutes: 2,
      ...(review[pick.key] ? { review: pick.key } : {}),
      ...(practice ? { then: { id: practice.id, stage: practice.stage } } : {}),
      // 고친 줄에서 온 막힌 것: 틀린 줄 고르기 문제도(퀴즈 card).
      ...(pick.reason === "gap" && gaps.find((gap) => gap.key === pick.key)?.card ? { card: gaps.find((gap) => gap.key === pick.key)!.card } : {}),
    };
  };
  // 묶음 퀴즈(2026-10-29 사용자 "세 부분을 합쳐서 묶음 퀴즈로"): 랜덤은 갈래가 다른 열쇠부터, 문법·표현·복습은 그 줄의 열쇠 여럿에서 한 문제씩. 어휘는 단어 퀴즈 그대로.
  const bundleFor = (which: StudyLane, wordKeys?: readonly string[]): { keys: string[]; questions: QuizQuestion[] } | null => {
    // 어휘: 짝 맞추기에서 본 낱말들의 예문 빈칸, 낱말마다 한 문제(같은 낱말을 모양만 바꿔 세 번 묻지 않음, 2026-10-30).
    if (wordKeys) {
      // 문제은행이 이 낱말들을 늘려 두게(다음 묶음부터 쓰임, curriculum/qbank.ts).
      void growBank(language, locale, wordKeys.map((key) => ({ key, stage })));
      // 빈칸 쓰기(2026-10-30 사용자 "그냥 타이핑해서 맞추는 식") — 길어서 못 치는 조각만 빈칸 고르기.
      const made = bundleQuiz(language, wordKeys, { seed: `${day}-${round}`, stage, style: "type", fallback: "choose", strict: true });
      return made.questions.length ? made : null;
    }
    if (which === "learn" && studyFocus === "vocab") return null;
    const queue = studyQueue(which, Date.now(), studyWeakest);
    let keys: string[];
    if (which === "learn" && !studyFocus) {
      const firstOf = new Map<PartId, string>();
      for (const pick of queue) {
        const part = keyPart(language, pick.key);
        if (!firstOf.has(part)) firstOf.set(part, pick.key);
      }
      // 세 번에 한 번 앞에 오는 새 낱말도(firstPick).
      const lead = firstPick(queue, which)?.key;
      keys = [...new Set([...(lead ? [lead] : []), ...firstOf.values(), ...queue.map((pick) => pick.key)])];
    } else keys = queue.map((pick) => pick.key);
    void growBank(language, locale, keys.slice(0, 8).map((key) => ({ key, stage })));
    // 문법 탭·틀린 것 탭에는 틀린 곳 찾아 고치기를 하나씩(내가 고침받은 줄 먼저), 문법 탭은 대화 속 틀린 줄도(2026-10-30 사용자 "1,2,3 순서로").
    const grammarTab = which === "learn" && studyFocus === "grammar";
    const spots = which === "review" ? { cards: spotCards, anyCard: true } : grammarTab ? { cards: spotCards, dialog: round % 2 === 0 } : undefined;
    const made = bundleQuiz(language, keys.slice(0, 8), { seed: `${day}-${round}`, stage, style: "type", fallback: "choose", strict: true, ...(spots ? { spots } : {}) });
    // 틀린 것 탭은 한 문제만 남아도 낸다.
    return made.questions.length >= (which === "review" ? 1 : 2) ? made : null;
  };
  const startStudy = (pick: StudyPick | null, which: StudyLane = lane, wordKeys?: readonly string[]) => {
    setLane(which);
    if (!pick) {
      setStudying(null);
      setQuiz(null);
      setBundle(null);
      return;
    }
    // 어휘 계속 공부: 짝 맞추기면 짝부터(끝나면 같은 낱말들의 예문), 예문 빈칸이면 지금 공부 줄 낱말들로 바로.
    if (which === "learn" && studyFocus === "vocab" && !wordKeys) {
      if (keepStyle === "match") {
        setStudying(pick);
        setMatching(true);
        return;
      }
      const keys = studyQueue("learn", Date.now(), studyWeakest).map((one) => one.key).filter((key) => key.startsWith("w|"));
      if (keys.length) return startStudy(pick, which, keys.slice(0, MATCH_SIZE));
    }
    const made = bundleFor(which, wordKeys);
    if (made) {
      setAsked((current) => new Set([...current, ...made.keys]));
      setRound((n) => n + 1);
      setStudying(pick);
      setQuiz(null);
      setBundle(made);
      return;
    }
    setAsked((current) => new Set([...current, pick.key]));
    setRound((n) => n + 1);
    setStudying(pick);
    setQuiz(studyItem(pick));
  };
  const resultActions = (
    <div className="flex flex-wrap justify-center gap-2">
      <button
        type="button"
        onClick={() => {
          setCheckupOpen(null);
          void maybeShowInterstitial("checkupEnd");
        }}
        className="rounded-full border border-line px-4 py-1.5 text-caption text-slate-200 hover:bg-white/10"
      >
        {ui.billingClose}
      </button>
      <button
        type="button"
        data-test-continue
        onClick={() => {
          setCheckupOpen(null);
          const which: StudyLane = checkupOpen === "take" ? "review" : "learn";
          startStudy(nextIn(which, checkupWeakest(checkups, Date.now()) ?? weakest), which);
        }}
        className="rounded-full bg-white/90 px-5 py-1.5 text-caption font-semibold text-slate-900"
      >
        {ui.studyMore} ›
      </button>
    </div>
  );
  const unitMix = unitItem ? unitMixOf(unitItem) : null;
  // 같은 날·같은 조합이면 같은 문제(씨앗) — 다시 그려도 바뀌지 않는다.
  const unitQuestions = unitItem && unitMix ? buildUnit(language, unitItem.id, unitMix, day) : [];
  const minutes = items.reduce((sum, item) => sum + item.minutes, 0);

  // 단어 맞추기 짝(2026-10-30): 곧 배울 낱말(뜻을 받은 것) → 단어장 → 이 단계 문장구조 예문의 빈칸 말.
  const pairs = matchPairs([
    ...(bank?.next ?? []).map((key) => ({ word: key.slice(2), meaning: wordGloss(language, key.slice(2)) })),
    ...words.map((row) => ({ word: row.word, meaning: row.gloss })),
    ...allFramesFor(language)
      .filter((one) => one.stage <= Math.max(1, stage))
      .flatMap((one) => one.examples.map((ex) => ({ word: ex.slot, meaning: glossFor(ex.cue, locale) }))),
  ]).slice(0, MATCH_SIZE * 4);
  // 어휘 계속 공부의 짝: 지금 공부 줄의 낱말 열쇠(w|) — 뒤의 예문 빈칸이 같은 낱말로 이어진다.
  const posOfWord = new Map((peekBank(language) ?? []).map((word) => [word.w, quizPos(word.pos)]));
  const vocabPairs: MatchPair[] =
    studyFocus === "vocab"
      ? samePosRounds(
          matchPairs(
            studyQueue("learn", Date.now(), studyWeakest)
              .map((pick) => pick.key)
              .filter((key) => key.startsWith("w|"))
              .map((key) => ({ word: key.slice(2), meaning: wordGloss(language, key.slice(2)) })),
          ),
          (word) => posOfWord.get(word),
          MATCH_SIZE,
        )
      : [];
  // 탭(무엇을) → 그 탭의 연습 방식(어떻게), 2026-10-30 사용자. 그림은 그 모양으로 풀게 될 짧은 대화(이 단계 상황 줄·낱말에서).
  // 퀴즈 = 빈칸에 들어갈 말 고르기만(사용자 2026-10-30 "퀴즈를 빈칸에 들어갈 단어를 고르는 것으로 단순화") — 짝 맞추기·순서·말하기·뜻 고르기는 퀴즈 칸에서 안 냄.
  const keepStyle: Style = "choose";
  const reviewStyle: Style = "choose";
  // 퀴즈 칸의 따로 된 탭 "지난번에 틀린 것"(사용자 2026-10-30 "틀린 것 다시보기는 별도의 탭으로") — 설정의 focus "review"를 쓴다.
  const wrongTab = settings.focus === "review";
  const asQuiz = (one: Style): QuizStyle | undefined => (one === "auto" || one === "match" ? undefined : one);
  const styleFor = (which: StudyLane): QuizStyle | undefined => asQuiz(which === "review" ? reviewStyle : keepStyle);
  const waysFor = (focus: StudyFocus) => {
    const situation = allScriptsFor(language).filter((one) => one.stage === stage).find(isSituationScript);
    const lines = situation?.lines ?? [];
    const mineAt = Math.max(0, lines.findIndex((line) => line.who === "me"));
    const mine = lines[mineAt];
    const pair = pairs[0];
    if (!mine) return [];
    const tiles = orderTiles(mine.text, language);
    const mid = Math.floor(tiles.length / 2);
    const meaning: Bubble = { side: "them", text: glossFor(mine.gloss, locale), meaning: true };
    const blank: Bubble = { side: "me", text: mine.text.replace(tiles[mid] ?? "", "___"), mark: "___" };
    const pictures: Record<Style, Bubble[]> = {
      auto: [blank, { side: "me", text: [...tiles].reverse().join(" · ") }, { side: "me", text: `🎤 ${mine.text}` }],
      // 빈칸 쓰기: 뜻 → 빈칸 문장에 직접 친다(보기 없음, 2026-10-30).
      type: [meaning, blank, { side: "me", text: `⌨ ${tiles[mid] ?? ""}` }],
      choose: [blank, { side: "me", text: [tiles[mid], tiles[(mid + 1) % tiles.length]].filter(Boolean).join("  /  ") }],
      order: [meaning, { side: "me", text: [...tiles].reverse().join(" · ") }],
      say: [meaning, { side: "me", text: `🎤 ${mine.text}` }],
      meaning: pair
        ? [{ side: "me", text: pair.word, mark: pair.word }, { side: "them", text: pair.meaning, meaning: true }, ...(pairs[1] ? [{ side: "them" as const, text: pairs[1].meaning, meaning: true }] : [])]
        : [{ side: "me", text: mine.text }, meaning],
      match: (vocabPairs.length >= 3 ? vocabPairs : pairs).slice(0, 3).map((one) => ({ side: "me" as const, text: `${one.word}  —  ${one.meaning}`, mark: one.word })),
    };
    const label: Record<Style, string> = {
      auto: ui.studyRandom,
      type: ui.selfFocusWriting,
      choose: ui.quizKindChoose,
      order: ui.quizKindOrder,
      say: ui.quizKindSay,
      meaning: ui.quizKindMeaning,
      match: ui.wordMatch,
    };
    // 어휘: 짝 맞추기(→ 그 낱말들 예문 빈칸) · 예문 빈칸(2026-10-30 사용자 "단순하게 맞추기 > 예문 형태로").
    const ids: Style[] = focus === "vocab" ? [...(vocabPairs.length >= 3 ? (["match"] as const) : []), "type", "choose"] : ["auto", "type", "choose", "order", "say"];
    return ids.map((id) => ({ id, label: label[id], bubbles: pictures[id] }));
  };
  const todaySummary = <span className="tabular-nums">{finished ? `✓ ${ui.planAllDone}` : ui.planMinutes.replace("{n}", String(minutes))}</span>;
  // 오늘 할 것(2026-10-30 사용자 "퀴즈랑 똑같이 첫 화면으로 — 다 안 보여 줘도 되니까 뭘 할지 명확히"): 목록 대신 지금 할 것 하나를 크게,
  // 나머지는 점으로만. 퀴즈면 칸 안에서 바로 한 문제, 상황·문장구조·꺼내 쓰기면 첫 줄이 보이는 카드 하나(누르면 시작).
  const currentAt = items.findIndex((item) => !doneOf(item));
  const current = currentAt >= 0 ? items[currentAt]! : null;
  const openItem = (item: PlanItem) => (item.kind === "recall" ? setRecalling(true) : item.kind === "quiz" ? setQuiz(item) : unitMixOf(item) ? setUnitItem(item) : onOpen(item.stage, item.id));
  const todayMake = (): QuizBatch | null => {
    if (!current || current.kind !== "quiz") return null;
    const served = todayServed.current;
    if (served?.id === `${current.id}|${current.review ?? ""}`) {
      // 다음을 눌렀다 → 기록하면 이 항목이 끝나고 다음 할 것으로 넘어간다.
      if (served.result !== null) finishQuiz(current, served.result);
      todayServed.current = null;
      return null;
    }
    // 오늘 할 것의 퀴즈도 빈칸 쓰기 먼저(사용자 2026-10-30 "타이핑해서 맞추는 식") — 못 치는 긴 조각은 고르기, 빈칸을 못 만드는 항목(문법 칸 등)만 예전 모양.
    void growBank(language, locale, [{ key: current.id, stage }]);
    const blankKinds = ["type", "choose"] as const;
    const blankQuiz = buildQuiz(language, current.id, { card: current.card, seed: day, stage, kinds: [...blankKinds] });
    const blank = blankKinds.map((kind) => blankQuiz?.questions.find((q) => q.kind === kind)).find(Boolean);
    const quiz = blank ? null : buildQuiz(language, current.id, { card: current.card, seed: day, stage, mix: settings.mix });
    const first = blank ?? quiz?.questions[0];
    if (!first) return null;
    todayServed.current = { id: `${current.id}|${current.review ?? ""}`, result: null };
    return { questions: [first], keys: [current.id] };
  };
  const previewOf = (item: PlanItem): string => {
    if (item.kind === "script") return (scripts.find((one) => one.id === item.id) ?? scriptById(language, item.id))?.lines[0]?.text ?? "";
    if (item.kind === "frame") return frames.find((one) => one.id === item.id)?.examples[0]?.text ?? "";
    return "";
  };
  const todayBody = (
    <div data-today-plan>
      <div className="flex items-center gap-2">
        {/* 오늘 몇 개 중 어디까지 — 점만(이름 목록은 안 보임). */}
        <span role="img" aria-label={`${Math.max(0, currentAt < 0 ? items.length : currentAt)}/${items.length}`} data-today-dots className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
          {items.map((item, i) => (
            <span
              key={`${item.id}-${item.review ?? ""}`}
              aria-hidden
              className={`h-2 w-2 rounded-full ${doneOf(item) ? "bg-status-mastered" : i === currentAt ? "bg-status-learned" : "border border-line"}`}
            />
          ))}
        </span>
        <button
          type="button"
          data-plan-settings
          aria-expanded={todaySettings}
          aria-label={ui.planSettings}
          title={ui.planSettings}
          onClick={() => setTodaySettings(!todaySettings)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-caption text-slate-400 hover:bg-white/10 hover:text-ink"
        >
          <span aria-hidden>⚙</span>
        </button>
      </div>
      {current && current.kind === "quiz" ? (
        <InlineQuiz
          ui={ui}
          locale={locale}
          language={language}
          resetKey={`today|${current.id}|${current.review ?? ""}`}
          make={todayMake}
          onResult={(one) => {
            if (todayServed.current && !one.skipped) todayServed.current.result = one.correct;
          }}
          empty={null}
        />
      ) : current ? (
        <button
          type="button"
          data-today-current={current.kind}
          disabled={current.kind === "recall" && !recallLearned.length}
          onClick={() => openItem(current)}
          className="mt-1 flex w-full items-center gap-3 rounded-xl border border-status-learned/50 bg-status-learned/[0.06] px-3 py-3 text-start hover:bg-status-learned/10"
        >
          <span className="min-w-0 flex-1">
            <span dir="auto" className="block truncate text-note font-semibold text-ink">
              {labelOf(current)}
            </span>
            {previewOf(current) ? (
              <span dir="auto" className="mt-1 block truncate text-chat text-slate-300">
                {previewOf(current)}
              </span>
            ) : null}
          </span>
          <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/90 text-caption text-slate-900">
            ▶
          </span>
        </button>
      ) : null}
      {finished ? (
        <LearnedToday
          ui={ui}
          locale={locale}
          language={language}
          ids={items.map((item) => item.id)}
          grammarName={grammarName}
          picked={picked}
          onPick={(key) => setPicked((current) => (current === key ? null : key))}
          onOpen={onOpen}
          nameOf={(id) => {
            const item = items.find((one) => one.id === id);
            return item ? labelOf(item) : id;
          }}
        />
      ) : null}
      {learned}
      {/* Pace, order, mix and the morning reminder open from ⚙ (2026-10-30, user: one big level on screen, the rest beneath it). */}
      {todaySettings ? (
      <div data-plan-settings-panel className="mt-3 border-t border-line pt-2">
        <div role="group" className="flex flex-wrap gap-1.5">
        {PACES.map((pace) => {
          const days = daysLeft(language, pace, planPassed, stage);
          const on = settings.pace === pace;
          return (
            <button
              key={pace}
              type="button"
              aria-pressed={on}
              onClick={() => save({ ...settings, pace })}
              className={`rounded-full px-3 py-1 text-caption ${on ? "bg-white/90 text-slate-900" : "border border-line text-slate-300 hover:bg-white/10"}`}
            >
              {ui.planMinutes.replace("{n}", String(pace))}
              {days ? <span className={on ? "text-slate-600" : "text-slate-500"}> · {ui.planDays.replace("{n}", String(days))}</span> : null}
            </button>
          );
        })}
      </div>
      <div role="group" className="mt-1.5 flex flex-wrap gap-1.5">
        {(["curriculum", "record"] as const).map((order) => (
          <button
            key={order}
            type="button"
            aria-pressed={settings.order === order}
            onClick={() => save({ ...settings, order })}
            className={`rounded-full px-3 py-1 text-caption ${settings.order === order ? "bg-white/15 text-ink" : "text-slate-400 hover:bg-white/10"}`}
          >
            {order === "curriculum" ? ui.planOrderCurriculum : ui.planOrderRecord}
          </button>
        ))}
      </div>
      {/* Study mix (2026-10-29): scripts and quizzes take this mix's shape (curriculum/quiz.ts QuizMix). */}
      <div role="group" data-plan-mix className="mt-1.5 flex flex-wrap gap-1.5">
        {MIXES.map((mix) => (
          <button
            key={mix}
            type="button"
            aria-pressed={settings.mix === mix}
            onClick={() => save({ ...settings, mix })}
            className={`rounded-full px-3 py-1 text-caption ${settings.mix === mix ? "bg-white/15 text-ink" : "text-slate-400 hover:bg-white/10"}`}
          >
            {{ auto: ui.studyRandom, speak: ui.planMixSpeak, read: ui.planMixRead }[mix]}
          </button>
        ))}
      </div>
      <MorningControl ui={ui} />
      </div>
      ) : null}
    </div>
  );
  const overlays = (
    <>
      {recalling ? <RecallPlayer ui={ui} locale={locale} language={language} learned={recallLearned} known={known} onClose={() => setRecalling(false)} /> : null}
      {matching && vocabPairs.length >= 3 ? (
        <WordMatch
          ui={ui}
          pairs={vocabPairs}
          onClose={() => {
            setMatching(false);
            setStudying(null);
          }}
          onNext={(seen) => {
            setMatching(false);
            startStudy(studying, "learn", seen.map((word) => `w|${word}`));
          }}
        />
      ) : null}
      {checkupOpen === "stage" ? (
        <CheckupPlayer
          ui={ui}
          locale={locale}
          language={language}
          stage={stage}
          items={stageTestItems}
          previous={[...checkups].reverse().find((r) => r.kind) ?? null}
          title={`${ui.placementTitle} · ${ui.stageNumber.replace("{n}", String(stage))}`}
          finishWith={(answers) => stageTestResult(stageTestItems, answers, stage)}
          heading={(result) => (result.passed ? ui.stageTestPassed.replace("{n}", String(result.stage)) : undefined)}
          labelOf={(key) => keyLabel(language, key, grammarName)}
          actions={(result) => (result.passed ? undefined : resultActions)}
          onFinish={finishCheckup}
          onClose={() => setCheckupOpen(null)}
        />
      ) : null}
      {checkupOpen === "entry" ? (
        <CheckupPlayer
          ui={ui}
          locale={locale}
          language={language}
          stage={stage}
          items={entryItems}
          previous={null}
          title={ui.entryCheckTitle.replace("{n}", String(stage))}
          finishWith={(answers) => entryCheckResult(entryItems, answers, stage)}
          labelOf={(key) => keyLabel(language, key, grammarName)}
          actions={() => resultActions}
          onFinish={finishCheckup}
          onClose={() => setCheckupOpen(null)}
        />
      ) : null}
      {checkupOpen === "take" ? (
        <CheckupPlayer
          ui={ui}
          locale={locale}
          language={language}
          stage={stage}
          items={checkupItems}
          previous={lastCheckup}
          labelOf={(key) => keyLabel(language, key, grammarName)}
          actions={() => resultActions}
          onFinish={finishCheckup}
          onClose={() => setCheckupOpen(null)}
        />
      ) : null}
      {checkupOpen === "placement" ? (
        <PlacementPlayer
          ui={ui}
          locale={locale}
          language={language}
          labelOf={(key) => keyLabel(language, key, grammarName)}
          onFinish={(result) => void saveCheckup(result)}
          onStart={(order) => {
            setCheckupOpen(null);
            void placeAt(order);
          }}
          onPick={(order) => {
            setCheckupOpen(null);
            void placeAt(order);
          }}
          onClose={() => setCheckupOpen(null)}
        />
      ) : null}
      {checkupOpen === "record" ? (
        <SkillRecord ui={ui} locale={locale} checkups={checkups} labelOf={(key) => keyLabel(language, key, grammarName)} onClose={() => setCheckupOpen(null)} />
      ) : null}
      {unitItem && unitQuestions.length ? (
        <QuizPlayer
          key={`unit-${unitItem.id}`}
          ui={ui}
          locale={locale}
          language={language}
          quizKey={unitItem.id}
          title={labelOf(unitItem)}
          seed={day}
          unit={unitQuestions}
          onDone={(passedUnit) => {
            markPracticed(language, unitItem.id);
            if (!passedUnit) return;
            void fetch(apiUrl("/api/curriculum/scripts"), {
              method: "POST",
              headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
              body: JSON.stringify({ language, id: unitItem.id }),
            }).catch(() => undefined);
          }}
          onThen={() => {
            const item = unitItem;
            setUnitItem(null);
            onOpen(item.stage, item.id);
          }}
          onClose={() => setUnitItem(null)}
        />
      ) : null}
      {bundle ? (
        <QuizPlayer
          key={`bundle-${round}`}
          ui={ui}
          locale={locale}
          language={language}
          quizKey={bundle.keys[0]!}
          title=""
          seed={`${day}-${round}`}
          unit={bundle.questions}
          bundleKeys={bundle.keys}
          onBundle={(results) => finishMany(results.filter((one) => !one.skipped).map((one) => ({ key: one.key, correct: one.correct, review: review[one.key] ? one.key : undefined })))}
          onDone={() => undefined}
          stopHint={missRun >= 2}
          onMore={() => startStudy(nextIn(lane, studyWeakest), lane)}
          onClose={() => {
            setBundle(null);
            setStudying(null);
          }}
        />
      ) : null}
      {quiz ? (
        <QuizPlayer
          key={`${quiz.id}-${round}`}
          ui={ui}
          locale={locale}
          language={language}
          quizKey={quiz.id}
          title={labelOf(quiz)}
          card={quiz.card}
          seed={studying ? `${day}-${round}` : day}
          round={log[quiz.id]?.n ?? 0}
          stage={stage}
          mix={settings.mix}
          style={studying ? styleFor(lane) : undefined}
          stopHint={missRun >= 2}
          onMore={() => startStudy(nextIn(studying ? lane : "learn", studyWeakest))}
          onDone={(passedQuiz) => finishQuiz(quiz, passedQuiz)}
          onThen={
            quiz.then
              ? () => {
                  const then = quiz.then!;
                  setQuiz(null);
                  onOpen(then.stage, then.id);
                }
              : undefined
          }
          onClose={() => {
            setQuiz(null);
            setStudying(null);
          }}
        />
      ) : null}
    </>
  );
  // 칸 안에서 바로 푸는 퀴즈(2026-10-30 사용자 "아예 퀴즈 화면을 보여 줘서 … 풀면 다음 문제로, 설명이나 옵션은 그 내부에"):
  // 칸에는 문제만, 무엇을·어떻게·어떤 낱말은 ⚙ 시트, 단어장·실력 기록·시험은 아이콘.
  const recordOne = (one: { key: string; correct: boolean; skipped: boolean }) => {
    // "모르겠어요"·답 보기는 원에서는 틀림으로(다시 나오게), 다른 기록에는 그대로 안 셈.
    if (one.skipped && one.key && !wrongTab && keepFocus === "vocab" && circleOn && bank && one.key.startsWith("w|")) {
      saveCircle(trimCircle(growCircle(noteAnswer(circleRef.current, one.key, false, Date.now()), circleOrder, knownWord)));
    }
    if (one.skipped || !one.key) return;
    if (wrongTab) askedWrong.current.add(one.key);
    else setAsked((current) => new Set([...current, one.key]));
    if (!wrongTab && keepFocus === "vocab" && circleOn && bank && one.key.startsWith("w|")) {
      saveCircle(trimCircle(growCircle(noteAnswer(circleRef.current, one.key, one.correct, Date.now()), circleOrder, knownWord)));
    }
    finishMany([{ key: one.key, correct: one.correct, review: review[one.key] ? one.key : undefined }]);
  };
  const takeBatch = (made: { keys: string[]; questions: QuizQuestion[] } | null): QuizBatch | null => {
    if (!made) return null;
    if (wrongTab) for (const key of made.keys) askedWrong.current.add(key);
    else setAsked((current) => new Set([...current, ...made.keys]));
    setRound((n) => n + 1);
    return made;
  };
  // 어휘 짝 맞추기: 짝 다섯 → 그 낱말들 예문 빈칸 한 묶음 → 다시 짝(served = 이미 낸 묶음).
  const keepMake = (): QuizBatch | null => {
    if (wrongTab) return takeBatch(bundleFor("review"));
    if (keepFocus === "vocab" && circleOn && bank && circleOrder.length) {
      const keys = pickCircle(circleRef.current, circleOrder, { n: QUIZ_SIZE + 1, now: Date.now(), usable: (key) => bank.ready.has(key), known: knownWord, skip: lastCircle.current });
      lastCircle.current = new Set(keys);
      if (!keys.length) return null;
      void growBank(language, locale, keys.map((key) => ({ key, stage })));
      // 처음 보는 낱말은 고르기, 다시 나온 낱말은 쓰기(처음부터 쓰게 하면 첫날 정답률이 30%대 — 시뮬레이션).
      const questions: QuizQuestion[] = [];
      const used: string[] = [];
      for (const key of keys) {
        const fresh = itemState(circleRef.current, key, knownWord(key)) === "new";
        const made = bundleQuiz(language, [key], { seed: `${day}-${round}-${key}`, stage, style: fresh ? "choose" : "type", fallback: fresh ? "type" : "choose", strict: true });
        if (made.questions[0]) {
          questions.push(made.questions[0]);
          used.push(key);
        }
      }
      return questions.length ? takeBatch({ keys: used, questions }) : null;
    }
    if (keepFocus === "vocab") {
      const keys = studyQueue("learn", Date.now(), studyWeakest).map((one) => one.key).filter((key) => key.startsWith("w|"));
      return keys.length ? takeBatch(bundleFor("learn", keys.slice(0, MATCH_SIZE))) : null;
    }
    return takeBatch(bundleFor("learn"));
  };
  const iconButton = "flex h-8 w-8 items-center justify-center rounded-full text-caption text-slate-400 hover:bg-white/10 hover:text-ink";
  const testIcon = (test: "placement" | "stage" | "entry" | "take") => {
    const testList = itemsOf(test);
    const name =
      test === "placement" ? ui.placementTitle : test === "stage" ? `${ui.placementTitle} · ${ui.stageNumber.replace("{n}", String(stage))}` : test === "entry" ? ui.entryCheckTitle.replace("{n}", String(stage)) : ui.checkupTitle;
    return (
      <button
        type="button"
        {...(test === "placement" ? { "data-placement-offer": "" } : test === "stage" ? { "data-stage-test-offer": "" } : test === "entry" ? { "data-entry-offer": "" } : { "data-checkup-offer": "" })}
        aria-label={name}
        title={name}
        onClick={() => {
          if (test !== "placement") setFrozenItems(testList);
          setCheckupOpen(test);
        }}
        className={iconButton}
      >
        <span aria-hidden>📝</span>
      </button>
    );
  };
  const settingsIcon = (which: "keep" | "review") => (
    <button type="button" data-quiz-settings={which} aria-label={ui.planSettings} title={ui.planSettings} onClick={() => setSettingsOpen(which)} className={iconButton}>
      <span aria-hidden>⚙</span>
    </button>
  );
  const waysGrid = (ways: ReturnType<typeof waysFor>, value: Style, onPick: (next: Style) => void, data: string) => (
    <div data-way-sheet={data} className="grid grid-cols-2 gap-2">
      {ways.map((one) => (
        <button
          key={one.id}
          type="button"
          aria-pressed={value === one.id}
          data-way={one.id}
          aria-label={one.label}
          onClick={() => onPick(one.id)}
          className={`flex min-w-0 flex-col gap-2 rounded-xl border p-2 text-start ${value === one.id ? "border-status-learned bg-status-learned/10" : "border-line hover:bg-white/5"}`}
        >
          <MiniDialogue bubbles={one.bubbles} />
          <span className="text-caption font-semibold text-ink">{one.label}</span>
        </button>
      ))}
    </div>
  );
  const settingsSheet = settingsOpen ? (
    <BodyLayer>
      <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 sm:items-center" onClick={() => setSettingsOpen(null)}>
        <div
          role="dialog"
          aria-modal="true"
          aria-label={ui.planSettings}
          data-quiz-settings-sheet={settingsOpen}
          onClick={(event) => event.stopPropagation()}
          className="flex max-h-[85vh] w-full max-w-md flex-col gap-3 overflow-y-auto rounded-t-2xl border border-line bg-surface p-4 sm:rounded-2xl"
        >
          <div className="flex items-center justify-end">
            <button type="button" aria-label={ui.billingClose} onClick={() => setSettingsOpen(null)} className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10">
              ✕
            </button>
          </div>
          {settingsOpen === "keep" ? (
            <>
              {/* 어떤 낱말 */}
              {keepFocus === "vocab" && bank ? (
                <div data-vocab-by className="flex flex-col gap-1.5">
                  <div role="group" className="flex flex-wrap gap-1.5">
            {(["stage", "pos", "topic"] as const).map((by) => (
              <button
                key={by}
                type="button"
                aria-pressed={(settings.vocab?.by && settings.vocab.by !== "all" ? settings.vocab.by : "stage") === by}
                onClick={() => save({ ...settings, vocab: { by, value: "" } })}
                className={`rounded-full px-3 py-1 text-caption ${(settings.vocab?.by && settings.vocab.by !== "all" ? settings.vocab.by : "stage") === by ? "bg-white/15 text-ink" : "text-slate-400 hover:bg-white/10"}`}
              >
                {{ stage: ui.vocabByStage, pos: ui.vocabByPos, topic: ui.vocabByTopic }[by]}
              </button>
            ))}
          </div>
          {settings.vocab && settings.vocab.by !== "all" && bank.groups.length ? (
            <div role="group" data-vocab-groups className="flex flex-wrap gap-1.5">
              {bank.groups.map((group) => {
                const on = vocabPick?.value === group.id;
                return (
                  <button
                    key={group.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => save({ ...settings, vocab: { by: settings.vocab!.by, value: group.id } })}
                    className={`rounded-full border px-3 py-1 text-caption ${on ? "border-status-learned/60 bg-status-learned/10 text-ink" : "border-line text-slate-300 hover:bg-white/10"}`}
                  >
                    {vocabGroupName(ui, settings.vocab!.by, group.id)}
                  </button>
                );
              })}
            </div>
          ) : null}
                </div>
              ) : null}
            </>
          ) : (
            waysGrid(waysFor("review"), reviewStyle, (next) => save({ ...settings, styles: { ...settings.styles, review: next } }), "review-style")
          )}
        </div>
      </div>
    </BodyLayer>
  ) : null;
  const keepResetKey = `${language}|${wrongTab ? "review" : keepFocus}|${settings.vocab?.by ?? ""}|${settings.vocab?.value ?? ""}`;
  const keepTabs: readonly (PartId | "review")[] = ["vocab", "grammar", "expression", "review"];
  const keepBody = (
    <div data-keep-learning>
      <div className="flex items-center gap-1">
        {/* 무엇을 = 탭(사용자 2026-10-30): 어휘 · 문법 · 표현 · 지난번에 틀린 것 — 틀린 것 다시 풀기는 이 탭에서만(nextStudy review 줄). */}
        <div role="tablist" data-study-focus className="flex min-w-0 flex-1 flex-wrap gap-1.5">
          {keepTabs.map((tab) => {
            const on = tab === "review" ? wrongTab : !wrongTab && keepFocus === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={on}
                data-focus={tab}
                onClick={() => save({ ...settings, focus: tab })}
                className={`rounded-full px-3 py-1 text-caption ${on ? "bg-white/90 text-slate-900" : "border border-line text-slate-300 hover:bg-white/10"}`}
              >
                {tab === "review" ? ui.weakTitle : partName(ui, tab)}
              </button>
            );
          })}
        </div>
        {!wrongTab && keepFocus === "vocab" ? <WordbookCard icon ui={ui} language={language} locale={locale} words={words} onWord={(word) => preview?.open(word)} /> : null}
        {learnTest ? testIcon(learnTest) : null}
        {!wrongTab && keepFocus === "vocab" && bank ? settingsIcon("keep") : null}
      </div>
      <InlineQuiz
        ui={ui}
        locale={locale}
        language={language}
        resetKey={keepResetKey}
        make={keepMake}
        retryKey={`${bank?.next.length ?? -1}|${bank?.ready.size ?? 0}|${circleOrder.length}|${spotCards.size}`}
        onResult={recordOne}
        empty={
          !wrongTab && keepFocus === "vocab" && (!bank || !circleOrder.length) ? (
            <p className="px-1 py-2 text-caption text-slate-400">…</p>
          ) : (
            <p className="px-1 py-2 text-caption text-slate-400">✓ {wrongTab ? ui.studyReviewNone : ui.planAllDone}</p>
          )
        }
      />
      {settingsSheet}
    </div>
  );
  // 복습 칸(퀴즈 아래, 따로): 읽고 정리(2026-10-30 사용자 A — 카드는 NotebookSection이 studyMap/ReviewNotes로) + 📝 시험 아이콘.
  // 틀린 것 다시 풀기는 퀴즈 칸의 "지난번에 틀린 것" 탭(nextStudy review 줄).
  // Logbank 머리 아이콘(2026-10-31): 📈 실력 기록 · 📝 이번 주 확인 — 기록을 보는 곳이라 Quizbank에서 옮김.
  const reviewBody =
    reviewTest || checkups.length ? (
      <div data-review className="mb-2 flex items-center justify-end gap-0.5">
        {checkups.length ? (
          <button type="button" data-skill-record-open aria-label={ui.skillRecord} title={ui.skillRecord} onClick={() => setCheckupOpen("record")} className={iconButton}>
            <span aria-hidden>📈</span>
          </button>
        ) : null}
        {reviewTest ? testIcon(reviewTest) : null}
      </div>
    ) : null;
  // My는 큰 칸만 보이고 나머지는 그 안으로(2026-10-30 사용자): 칸을 그리는 쪽(NotebookSection)이 오늘 할 것 · 단계 · 지속 학습 · 복습 순서로 놓는다.
  return children({
    today: { summary: todaySummary, body: todayBody, done: finished },
    keep: { summary: null, body: keepBody, wrong: wrongTab },
    review: { summary: null, body: reviewBody },
    overlays,
  });
}

function vocabGroupName(ui: UICopy, by: VocabBy, id: string): string {
  if (by === "stage") return ui.stageNumber.replace("{n}", id);
  if (by === "pos") return ({ noun: ui.posNoun, verb: ui.posVerb, adj: ui.posAdj, adv: ui.posAdv, function: ui.posFunction } as Record<string, string>)[id] ?? id;
  const topics: Record<string, string> = {
    people: ui.topicPeople,
    food: ui.topicFood,
    home: ui.topicHome,
    work: ui.topicWork,
    health: ui.topicHealth,
    travel: ui.topicTravel,
    shopping: ui.topicShopping,
    time: ui.topicTime,
    feelings: ui.topicFeelings,
    actions: ui.topicActions,
    describing: ui.topicDescribing,
    nature: ui.topicNature,
    society: ui.topicSociety,
    function: ui.topicFunction,
  };
  return topics[id] ?? id;
}

function partName(ui: UICopy, part: PartId): string {
  return { vocab: ui.partVocab, grammar: ui.partGrammar, expression: ui.partExpression, pronunciation: ui.partPronunciation }[part];
}

/** 다시 볼 것·배운 것 열쇠의 이름(문법은 노트 칸 이름). */
function keyLabel(language: string, key: string, grammarName: (stage: number, index: number) => string): string {
  if (!key.startsWith("g|")) return reviewLabel(language, key);
  const [stage, index] = key.slice(2).split(":").map(Number);
  return grammarName(stage!, index!);
}

const PAID_TIERS = new Set(["lite", "plus", "premium"]);

/**
 * 오늘 분량을 다 하면: 오늘 배운 것(문장구조·문법·단어, curriculum/dailyPlan.ts learnedFrom) + 직접 묻기(유료만, /api/curriculum/ask).
 * 질문·답 글은 남기지 않고, 서버가 질문이 걸린 곳만 기록해 다시 볼 것에 넣는다 — 그 칩에 ?가 붙는다.
 */
function LearnedToday({
  ui,
  locale,
  language,
  ids,
  grammarName,
  picked,
  onPick,
  onOpen,
  nameOf,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  ids: readonly string[];
  grammarName: (stage: number, index: number) => string;
  /** 누른 칩(열쇠) — 그 아래 "어디에·어떻게"를 펼치고 위 목록의 그 대본에 테두리. */
  picked: string | null;
  onPick: (key: string) => void;
  onOpen: (stage: number, id: string) => void;
  nameOf: (id: string) => string;
}) {
  const { isPremium, tier } = usePremium();
  const billing = useBillingUiOptional();
  const idKey = ids.join(",");
  const learned = useMemo(() => learnedFrom(language, idKey ? idKey.split(",") : []), [language, idKey]);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [answer, setAnswer] = useState<{ text: string; about: string[] } | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [asked, setAsked] = useState<Set<string>>(new Set());
  const groups = [
    { id: "frames", label: ui.amountFrames, keys: learned.frames },
    { id: "grammar", label: ui.partGrammar, keys: learned.grammar },
    { id: "words", label: ui.learnedWords, keys: learned.words },
  ].filter((group) => group.keys.length);
  if (!groups.length) return null;
  const paid = PAID_TIERS.has(tier);
  const topics = groups.flatMap((group) => group.keys.map((key) => ({ key, label: keyLabel(language, key, grammarName) }))).filter((topic) => topic.label);

  const ask = async () => {
    const text = question.trim();
    if (text.length < 2 || asking) return;
    setAsking(true);
    setProblem(null);
    try {
      const response = await fetch(apiUrl("/api/curriculum/ask"), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
        body: JSON.stringify({ language, interfaceLanguage: locale, question: text, topics }),
      });
      const body = (await response.json().catch(() => null)) as { answer?: string; about?: string[]; review?: ReviewMap; error?: string } | null;
      if (response.ok && body?.answer) {
        setAnswer({ text: body.answer, about: body.about ?? [] });
        setAsked((current) => new Set([...current, ...(body.about ?? [])]));
        setQuestion("");
        if (body.review) announceReview(language, body.review);
      } else {
        setProblem(body?.error === "DAILY_LIMIT_REACHED" ? ui.askLimit : ui.askFailed);
      }
    } catch {
      setProblem(ui.askFailed);
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="mt-3 flex flex-col gap-2 border-t border-line pt-3">
      <h4 className="text-caption font-semibold text-slate-300">{ui.learnedTitle}</h4>
      {groups.map((group) => (
        <div key={group.id} className="flex flex-col gap-1">
          <span className="text-meta text-slate-500">{group.label}</span>
          <div className="flex flex-wrap gap-1.5">
            {group.keys.map((key) => {
              const label = keyLabel(language, key, grammarName);
              if (!label) return null;
              const flagged = asked.has(key);
              const on = picked === key;
              return (
                <button
                  key={key}
                  type="button"
                  dir="auto"
                  aria-pressed={on}
                  onClick={() => onPick(key)}
                  className={`rounded-full border px-2.5 py-1 text-caption ${on ? "border-status-learned bg-status-learned/15 text-ink" : flagged ? "border-warn/60 text-warn" : "border-line text-slate-200 hover:bg-white/10"}`}
                >
                  {label}
                  {flagged ? " ?" : ""}
                </button>
              );
            })}
          </div>
          {picked && group.keys.includes(picked) ? <WherePanel locale={locale} language={language} keyId={picked} ids={ids} nameOf={nameOf} onOpen={onOpen} /> : null}
        </div>
      ))}
      {paid ? (
        <>
          <div className="mt-1 flex items-center gap-2">
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value.slice(0, 300))}
              onKeyDown={(event) => {
                if (event.key === "Enter") void ask();
              }}
              aria-label={ui.askSend}
              dir="auto"
              className="min-w-0 flex-1 rounded-xl border border-line bg-transparent px-3 py-2 text-note text-ink"
            />
            <button
              type="button"
              onClick={() => void ask()}
              disabled={asking || question.trim().length < 2}
              className="shrink-0 rounded-full bg-white/90 px-4 py-1.5 text-caption font-semibold text-slate-900 disabled:opacity-50"
            >
              {asking ? "…" : ui.askSend}
            </button>
          </div>
          {problem ? <p className="text-caption text-warn">{problem}</p> : null}
          {answer ? (
            <p dir="auto" className="whitespace-pre-line rounded-xl bg-white/5 px-3 py-2 text-note text-slate-100">
              {answer.text}
            </p>
          ) : null}
        </>
      ) : billing ? (
        <button type="button" onClick={billing.openBilling} className="mt-1 self-start rounded-full border border-line px-4 py-1.5 text-caption text-slate-200 hover:bg-white/10">
          {ui.askSubscribe}
        </button>
      ) : null}
    </div>
  );
}

/** 누른 칩이 오늘 한 어디에, 어떤 줄로 나왔는지(curriculum/learnedWhere.ts) — 대본 이름·줄을 누르면 그 대본·문장구조로. */
function WherePanel({
  locale,
  language,
  keyId,
  ids,
  nameOf,
  onOpen,
}: {
  locale: string;
  language: string;
  keyId: string;
  ids: readonly string[];
  nameOf: (id: string) => string;
  onOpen: (stage: number, id: string) => void;
}) {
  const where = whereLearned(language, keyId, ids);
  if (!where.length) return null;
  return (
    <ul className="mt-1 flex flex-col gap-1.5 rounded-xl border border-status-learned/40 bg-white/[0.03] p-2">
      {where.map((item) => (
        <li key={item.id}>
          <button type="button" onClick={() => onOpen(item.stage, item.id)} className="flex w-full flex-col gap-1 rounded-lg px-2 py-1.5 text-start hover:bg-white/5">
            <span className="flex w-full items-center gap-2">
              <span dir="auto" className="min-w-0 flex-1 truncate text-meta text-slate-400">
                {nameOf(item.id)}
              </span>
              <span aria-hidden className="text-caption text-slate-500 rtl:rotate-180">›</span>
            </span>
            {item.lines.map((line, i) => (
              <span key={i} className="flex flex-col">
                <span dir="auto" className="text-note text-slate-100">
                  {line.hit ? (
                    <>
                      {line.text.slice(0, line.hit[0])}
                      <strong className="font-semibold text-status-learned">{line.text.slice(line.hit[0], line.hit[1])}</strong>
                      {line.text.slice(line.hit[1])}
                    </>
                  ) : (
                    line.text
                  )}
                </span>
                <span dir="auto" className="text-meta text-slate-500">
                  {glossFor(line.gloss, locale)}
                </span>
              </span>
            ))}
          </button>
        </li>
      ))}
    </ul>
  );
}

/**
 * 대본·문장구조 끝: 그 대본의 핵심 표현·문장구조마다 알아요/헷갈려요(헷갈려요 → 2일 뒤, 그 뒤 알아요 → 7일 뒤 한 번 더, 또 알아요 → 끝).
 * 누를 때마다 서버에 바로(POST /api/curriculum/scripts check).
 */
export function SelfCheck({ ui, language, id, weak = [] }: { ui: UICopy; language: string; id: string; weak?: readonly string[] }) {
  const { isPremium } = usePremium();
  const weakKey = weak.join(",");
  // 대본에서 자꾸 틀린 줄의 열쇠(weak)는 맨 앞에, 헷갈려요로 미리 표시하고 한 번 보낸다 — 알아요로 바꿀 수 있다.
  const keys = useMemo(() => {
    const extra = weakKey ? weakKey.split(",") : [];
    return [...new Set([...extra, ...reviewKeysOf(language, id)])].slice(0, 10);
  }, [language, id, weakKey]);
  // SelfCheck는 대본을 끝낼 때 새로 붙으므로 그때의 weak로 미리 표시한다.
  const [marks, setMarks] = useState<Record<string, boolean>>(() => Object.fromEntries(weak.map((key) => [key, false])));
  const sentWeak = useRef("");
  useEffect(() => {
    if (!weakKey || sentWeak.current === weakKey) return;
    sentWeak.current = weakKey;
    const extra = weakKey.split(",");
    void fetch(apiUrl("/api/curriculum/scripts"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
      body: JSON.stringify({ language, check: Object.fromEntries(extra.map((key) => [key, false])) }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: { review?: ReviewMap } | null) => {
        if (body?.review) announceReview(language, body.review);
      })
      .catch(() => undefined);
  }, [weakKey, language, isPremium]);
  if (!keys.length) return null;
  const mark = (key: string, known: boolean) => {
    setMarks((current) => ({ ...current, [key]: known }));
    void fetch(apiUrl("/api/curriculum/scripts"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
      body: JSON.stringify({ language, check: { [key]: known } }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: { review?: ReviewMap } | null) => {
        if (body?.review) announceReview(language, body.review);
      })
      .catch(() => undefined);
  };
  return (
    <ul className="flex w-full flex-col gap-1.5">
      {keys.map((key) => (
        <li key={key} className="flex items-center gap-2 rounded-xl border border-line px-3 py-2">
          <span dir="auto" className="min-w-0 flex-1 text-note text-slate-100">
            {reviewLabel(language, key)}
          </span>
          <button
            type="button"
            aria-pressed={marks[key] === true}
            onClick={() => mark(key, true)}
            className={`shrink-0 rounded-full px-2.5 py-1 text-caption ${marks[key] === true ? "bg-status-mastered text-slate-900" : "border border-line text-slate-300 hover:bg-white/10"}`}
          >
            {ui.checkKnown}
          </button>
          <button
            type="button"
            aria-pressed={marks[key] === false}
            onClick={() => mark(key, false)}
            className={`shrink-0 rounded-full px-2.5 py-1 text-caption ${marks[key] === false ? "bg-warn text-slate-900" : "border border-line text-slate-300 hover:bg-white/10"}`}
          >
            {ui.checkUnsure}
          </button>
        </li>
      ))}
    </ul>
  );
}
