"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { UICopy } from "@/lib/copy";
import type { CustomNode, FixCard, NotebookChapter, NotebookEdit } from "@/lib/notes/notebook";
import { sceneShotFor } from "@/lib/notes/sceneShots";
import { onLocate, takeLocate, type LocateHandoff } from "@/lib/notes/locateHandoff";
import { PART_IDS, shareOf, type PartId, type PartLogItem, type StageParts } from "@/lib/notes/stageParts";
import { sendAppIntent } from "@/lib/appIntents";
import { ScriptAmount } from "@/components/studyMap/ScriptAmount";
import { StageScripts, type ScriptRecommend } from "@/components/studyMap/StageScripts";
import type { RedoItem } from "@/lib/curriculum/frameRedo";
import { useScriptPack } from "@/lib/curriculum/useScriptPack";
import { reviewLabel, type ReviewMap } from "@/lib/curriculum/dailyPlan";
import { TodayPlan } from "@/components/studyMap/TodayPlan";
import { CheckupPlayer } from "@/components/studyMap/CheckupPlayer";
import { useCheckups } from "@/lib/curriculum/useCheckups";
import { skippedIds, type KnownMap } from "@/lib/curriculum/known";
import { skeletonTotals, skeletonView, toNextStage } from "@/lib/notes/skeletonTotals";
import { frontierStage, useStudyMode, type StudyMode } from "@/lib/curriculum/studyMode";
import { needsLetters, useLettersFirst } from "@/lib/curriculum/lettersFirst";
import { LettersPlan, ScriptEntry } from "@/components/studyMap/ScriptPractice";
import { ladderFor } from "@/lib/curriculum/stages";
import { STAGE_DONE_SHARE } from "@/lib/curriculum/stages";
import { peekItemStats, useItemStats } from "@/lib/curriculum/useItemStats";
import { buildStageTest, failedToday, stageTestResult } from "@/lib/curriculum/stageTest";
import type { CheckResult } from "@/lib/curriculum/checkup";
import { dayOfBar, PartDetailSheet, type PartAll } from "@/components/notes/PartDetailSheet";
import { WeakStrip } from "@/components/studyMap/WeakStrip";
import { curriculumItems } from "@/lib/curriculum/dailyPlan";
import { allMisses } from "@/lib/curriculum/scriptMisses";
import { weakSpots, wordsToShow } from "@/lib/curriculum/weakSpots";
import { morningDays } from "@/lib/curriculum/morningDigest";
import { onMorningChange, readMorning, scheduleMorning } from "@/lib/morningNotify";
import { allScriptsFor, glossFor, scriptForExpressions } from "@/lib/curriculum/stageScripts";
import { allFramesFor } from "@/lib/curriculum/frames";

/**
 * 노트의 뼈대 칸(글자·소리·문법)과 내가 만든 칸, 그 안의 짚은 장면 카드(notes/notebook.ts, /api/notebook).
 * 어휘·표현(예전 목차)은 NotesPanel이 그대로 그린다.
 *
 * 칸 이름 옆 숫자가 짚인 횟수 — 많은 칸이 위로 와서 "여기에 집중"이 된다. 설명 글은 두지 않는다(hub/DESIGN.md "안내 글").
 * 맨 위 "오늘의 학습": 오늘 짚인 후보를 고르고(진짜 실수·또 틀린 것은 미리 체크), 기기에 찍어 둔 화면을 "화면 함께"로 붙여 노트에 넣는다.
 * 지난 날 후보는 "지난 학습"(7일).
 */

type NodeView = { id: string; chapter: NotebookChapter; stage?: number; index?: number; name: string; example?: string; note?: string; ahead?: boolean };
type Book = {
  stage: number;
  nodes: NodeView[];
  custom: CustomNode[];
  renames: Record<string, string>;
  memos: Record<string, string>;
  cards: FixCard[];
  pending: FixCard[];
  today: string;
  /** 단계 사다리(번호·이름, 앱 언어) — 옛 서버면 비어 있다. */
  stages: { order: number; title: string }[];
  /** 습득한 표현(장부 배움·숙지)이 든 칸(2026-10-24). */
  phrases: PhraseView[];
  /** 단계마다 네 갈래(어휘·문법·표현·발음)와 다음 단계 조건(2026-10-25) — 옛 서버면 없다. */
  parts?: StageParts[];
  words?: { text: string; state: "met" | "learned" | "mastered" }[];
  pronunciationNotes?: Record<string, string>;
  /** 지금 단계 갈래별 최근 14일(그래프 보기). */
  partDays?: Record<PartId, number[]> | null;
  /** 같은 14일의 낱낱(배움·숙지·고침) — 망·그래프를 누르면(PartDetailSheet). 옛 서버면 없다. */
  partItems?: Record<PartId, PartLogItem[]> | null;
  /** 오늘의 대본(서버 curriculum/scriptPick.ts, scripts=1). */
  recommend?: ScriptRecommend;
  /** 틀린 틀 다시 연습(서버 curriculum/frameRedo.ts, scripts=1). */
  redo?: RedoItem[];
  /** 학습 끝 체크로 다시 볼 것(서버 curriculum/dailyPlan.ts, scripts=1). */
  review?: ReviewMap;
};
const NO_REVIEW: ReviewMap = {};
/**
 * 커리큘럼(단계·대본·문장구조)만 남기기(2026-10-28 사용자 "커리큘럼이랑 동떨어져 있는 이전 기능은 다 숨겨줘", 노트 틀은 "대본에 붙이기"):
 * 노트 칸 목록(관용·세부·내 칸·자리 없음)·칸 이름 바꾸기·칸 추가·메모·카드 옮기기를 숨기고, 문법 칸은 그 문법이 나오는 대본·문장구조로 잇는다.
 * 기록(카드·칸)은 서버에 그대로 — 다시 연습·오늘의 대본이 쓴다. 되돌리려면 false.
 */
const CURRICULUM_ONLY = true;

type MyLayer = "today" | "stage" | "review";
const LAYER_KEY = "myLayer.v1";
function readLayer(): MyLayer | null {
  try {
    const saved = localStorage.getItem(LAYER_KEY);
    if (saved === "none") return null;
    return saved === "stage" || saved === "review" ? saved : "today";
  } catch {
    return "today";
  }
}

type RelatedItem = { id: string; stage: number; kind: "script" | "frame"; label: string; passed: boolean };

/** 문법 칸(그 단계 문법 번호)이 나오는 대본·문장구조 — 대본의 grammar·뒤 단계의 earlierGrammar, 문장구조의 grammar. */
function relatedFor(language: string, locale: string, stage: number, index: number, passed: ReadonlySet<string>): RelatedItem[] {
  const out: RelatedItem[] = [];
  for (const script of allScriptsFor(language)) {
    const here = script.stage === stage && (script.grammar ?? []).includes(index);
    const later = script.stage > stage && (script.earlierGrammar ?? []).includes(`${stage}:${index}`);
    if (here || later) out.push({ id: script.id, stage: script.stage, kind: "script", label: glossFor(script.setting, locale), passed: passed.has(script.id) });
  }
  for (const frame of allFramesFor(language)) {
    if (frame.stage === stage && (frame.grammar ?? []).includes(index)) out.push({ id: frame.id, stage: frame.stage, kind: "frame", label: frame.pattern, passed: passed.has(frame.id) });
  }
  return out.sort((a, b) => a.stage - b.stage || (a.kind === b.kind ? 0 : a.kind === "script" ? -1 : 1)).slice(0, 8);
}

type PhraseView = { key: string; text: string; state: "met" | "learned" | "mastered"; node: string };
type Group = NotebookChapter | "mine" | "loose";

/** 관용·세부 고정 칸 이름은 앱 문구로(서버는 영어·한국어 기본만 준다). */
const fixedName = (ui: UICopy, id: string): string | undefined =>
  ({
    "i-idiom": ui.notebookNodeIdiom,
    "i-together": ui.notebookNodeTogether,
    "i-set": ui.notebookNodeSet,
    "d-word": ui.notebookNodeWord,
    "d-register": ui.notebookNodeRegister,
    "d-spelling": ui.notebookNodeSpelling,
    "d-nuance": ui.notebookNodeNuance,
  })[id];
type PickGroup = "today" | "earlier";

/** notes/notebook.ts `defaultPicked`와 같은 규칙(그 모듈은 뼈대 자료를 끌고 와서 화면에 들이지 않는다). */
const picksByDefault = (card: FixCard) => card.again === true || (card.kind ?? "mistake") === "mistake";

function newNodeId(): string {
  return `c-${Math.random().toString(36).slice(2, 10).padEnd(8, "0")}`;
}

function when(at: number, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(at);
  } catch {
    return "";
  }
}

export function NotebookSection({
  ui,
  locale,
  language,
  isPremium,
  frame = true,
  stageDetail,
  masteredOf,
  onTry,
  onNextStage,
  canSpeak = false,
  view,
  part: focusPart = null,
  onPart,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  isPremium: boolean;
  /** false면 "오늘의 학습" 버튼과 시트만(My 망·그래프 보기 위). 틀(단계 사다리·칸)은 "단계" 보기에서. */
  frame?: boolean;
  /** 고른 단계의 목표 대화·할 수 있는 것(My가 StageGoal로 그림) — 사다리 아래, 문법 칸 위. */
  stageDetail?: (order: number) => ReactNode;
  /** 단계 자료의 그 문법을 숙지했는지(✓). */
  masteredOf?: (stage: number, index: number) => boolean;
  /** 그 문법으로 바로 연습(채팅). */
  onTry?: (stage: number, index: number) => void;
  /** 네 갈래가 다 차면 "다음 단계로"(My가 단계 고르기를 연다). */
  onNextStage?: (order: number) => void;
  /** AI 통화로 말해 볼 수 있는지(발음 연습 버튼). */
  canSpeak?: boolean;
  /** 틀 밖(frame false)에서 그릴 보기: 망 = 네 꼭짓점, 그래프 = 갈래별 2주. 갈래를 누르면 onPart(→ 단계 보기). */
  view?: "net" | "graph" | "map";
  /** 단계 보기에서 처음 열 갈래(망·그래프에서 누른 것). */
  part?: PartId | null;
  onPart?: (part: PartId) => void;
}) {
  // 앱에 없는 학습 언어의 대본·틀은 서버에서(2.76 이후 더한 언어).
  useScriptPack(language);
  const [book, setBook] = useState<Book | null>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [nodeOpen, setNodeOpen] = useState<string | null>(null);
  const [moving, setMoving] = useState<string | null>(null);
  const [picking, setPicking] = useState<PickGroup | null>(null);
  const [viewShot, setViewShot] = useState<string | null>(null);
  const [movingPhrase, setMovingPhrase] = useState<string | null>(null);
  // 문장분석 시트 "My에서 찾기"로 넘어온 궁금한 장면(lib/notes/locateHandoff.ts) — 그 칸을 열고 "이 장면 넣기".
  const [question, setQuestion] = useState<LocateHandoff | null>(null);
  const [focusStage, setFocusStage] = useState<number | null>(null);
  // 문법 칸 → 그 문법의 대본·문장구조 열기(CURRICULUM_ONLY).
  const [jump, setJump] = useState<{ stage: number; id: string; at: number } | null>(null);
  // 대본을 통과하면 다시 불러 다음 단계 조건(parts[].ready)을 새로.
  const [reload, setReload] = useState(0);
  // My 큰 칸(오늘 할 것 · n단계 · 복습) 중 펼친 하나(2026-10-30 사용자 "큰 층위 하나만 보이게"). 이 폰에만.
  const [layer, setLayerState] = useState<MyLayer | null>(readLayer);
  const openLayer = (next: MyLayer | null) => {
    setLayerState(next);
    try {
      localStorage.setItem(LAYER_KEY, next ?? "none");
    } catch {
      // 다음에 열 때 처음 칸으로.
    }
  };
  // 사다리에서 아무 단계나 "이 단계로 정하기"(2026-10-29) — 조건·시험 없이 지금 단계를 바꾼다.
  const setStageTo = (order: number) => {
    const id = ladderFor(language)?.stages.find((one) => one.order === order)?.id;
    if (!id) return;
    setLetters(false);
    void fetch(apiUrl("/api/learner/self-check"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
      body: JSON.stringify({ language, stage: id }),
    })
      .then((response) => response.ok && setReload((n) => n + 1))
      .catch(() => undefined);
  };
  // "다음 단계로" 앞의 단계 시험(curriculum/stageTest.ts, 2026-10-29 사용자 "시험을 중심으로"): 고른 단계, 시험 결과(서버 checkups).
  const [stageTestFor, setStageTestFor] = useState<number | null>(null);
  const { checkups, known, save: saveCheckup } = useCheckups(language);
  // 단계대로 | 자유롭게(curriculum/studyMode.ts): 자유롭게면 가장 낮은 열린 단계를 기준으로, 단계 시험·조건 없음.
  const [studyMode, setStudyMode] = useStudyMode(language);
  // 0단계 — 글자·소리(curriculum/lettersFirst.ts): 글자가 다른 학습 언어에서 고르면 일일 학습 자리에 글자 묶음.
  const [lettersFlag, setLetters] = useLettersFirst(language);
  const lettersOn = lettersFlag && needsLetters(language);
  const skipped = useMemo(() => skippedIds(language, known), [language, known]);
  useItemStats(language);
  const loaded = Boolean(book);
  useEffect(() => {
    if (!loaded) return;
    const take = () => {
      const handed = takeLocate(language);
      if (!handed) return;
      setQuestion(handed);
      if (handed.stage) setFocusStage(handed.stage);
      if (handed.node) setNodeOpen(handed.node);
    };
    take();
    return onLocate(take);
  }, [loaded, language]);

  useEffect(() => {
    let cancelled = false;
    fetch(apiUrl(`/api/notebook?lang=${encodeURIComponent(language)}&ui=${encodeURIComponent(locale)}&scripts=1`), {
      headers: entitlementHeaders(isPremium),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: Book | null) => {
        if (!cancelled && body?.nodes) setBook({ ...body, pending: body.pending ?? [], today: body.today ?? "", stages: body.stages ?? [], phrases: body.phrases ?? [] });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [language, locale, isPremium, reload]);

  const edit = useCallback(
    async (change: NotebookEdit) => {
      try {
        const response = await fetch(apiUrl("/api/notebook"), {
          method: "POST",
          headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
          body: JSON.stringify({ language, edit: change }),
        });
        const body = (await response.json().catch(() => null)) as Partial<Book> | null;
        if (response.ok && body?.cards) {
          setBook((current) =>
            current
              ? {
                  ...current,
                  cards: body.cards!,
                  custom: body.custom ?? current.custom,
                  renames: body.renames ?? current.renames,
                  memos: body.memos ?? current.memos,
                  pending: body.pending ?? current.pending,
                }
              : current,
          );
        }
      } catch {
        // 다음에 열 때 서버 것으로 다시 그린다.
      }
    },
    [language, isPremium],
  );

  /** 고른 후보를 노트로, 화면을 붙인 것은 그림을 올린다(그림이 실패해도 카드는 들어간다). */
  const commit = useCallback(
    async (ids: string[], shots: Record<string, string>) => {
      await edit({ op: "commit", ids, shots: Object.keys(shots) });
      for (const [id, image] of Object.entries(shots)) {
        await fetch(apiUrl("/api/notebook"), {
          method: "POST",
          headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
          body: JSON.stringify({ language, shot: { id, image } }),
        }).catch(() => undefined);
      }
    },
    [edit, language, isPremium],
  );

  /** 궁금한 장면을 카드로(화면 함께면 그림도 올린다). */
  const addQuestion = useCallback(
    async (q: LocateHandoff, withShot: boolean) => {
      const id = newCardIdClient();
      const shot = withShot && q.shot ? q.shot : null;
      await edit({ op: "addQuestion", id, text: q.text, sentence: q.sentence, note: q.note, node: q.node, where: q.where, ...(shot ? { shotId: id } : {}) });
      if (shot) {
        await fetch(apiUrl("/api/notebook"), {
          method: "POST",
          headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
          body: JSON.stringify({ language, shot: { id, image: shot } }),
        }).catch(() => undefined);
      }
      setQuestion(null);
    },
    [edit, language, isPremium],
  );

  // 칸 옆 숫자 = 짚은 장면 카드 + 습득한 표현.
  const counts = useMemo(() => {
    const out: Record<string, number> = {};
    for (const card of book?.cards ?? []) out[card.node ?? ""] = (out[card.node ?? ""] ?? 0) + 1;
    for (const phrase of book?.phrases ?? []) out[phrase.node] = (out[phrase.node] ?? 0) + 1;
    return out;
  }, [book]);
  /** 칸이 "채워졌는지": 숙지 > 배움 > 카드만 > 빈 칸(점 색). */
  const fill = useMemo(() => {
    const out: Record<string, "mastered" | "learned"> = {};
    for (const phrase of book?.phrases ?? []) {
      if (phrase.state === "met" || out[phrase.node] === "mastered") continue;
      out[phrase.node] = phrase.state;
    }
    return out;
  }, [book]);

  /** 표현 옮기기: 화면은 바로, 서버는 뒤에(node null = 노트의 어휘·표현으로). */
  const movePhrase = useCallback(
    (key: string, node: string | null) => {
      setBook((current) =>
        current
          ? { ...current, phrases: node ? current.phrases.map((p) => (p.key === key ? { ...p, node } : p)) : current.phrases.filter((p) => p.key !== key) }
          : current,
      );
      void edit({ op: "movePhrase", phrase: key, node });
    },
    [edit],
  );

  // 아침 알림(lib/morningNotify.ts): 기록을 받을 때마다·설정을 바꿀 때 앞으로 7일을 다시 건다. 단계 보기에서만(두 번 걸지 않게).
  useEffect(() => {
    if (!book || !frame) return;
    const run = () => {
      const settings = readMorning();
      if (!settings.on) {
        void scheduleMorning([], ui.morningSetting);
        return;
      }
      const review = book.review ?? NO_REVIEW;
      const passed = new Set((book.parts ?? []).flatMap((row) => row.scripts?.passed ?? []));
      const spots = weakSpots({ language, fixes: [...book.cards, ...book.pending], misses: allMisses(language), review, limit: 14 });
      const upcoming = curriculumItems(language, book.stage)
        .filter((item) => !passed.has(item.id))
        .slice(0, 12)
        .map((item) => item.id);
      const texts = morningDays({
        locale,
        title: ui.morningTitle,
        fallback: ui.planTitle,
        spots,
        words: wordsToShow(language, review, upcoming, settings.words * 7),
        wordsPerDay: settings.words,
      });
      void scheduleMorning(texts, ui.morningSetting);
    };
    run();
    return onMorningChange(run);
  }, [book, frame, language, locale, ui]);

  if (!book) return null;
  const nameOf = (id: string) =>
    book.custom.find((node) => node.id === id)?.name ?? book.renames[id] ?? fixedName(ui, id) ?? book.nodes.find((node) => node.id === id)?.name ?? "";
  // 뒤 단계 문법은 카드가 들어온 칸만.
  const inChapter = (chapter: NotebookChapter) => book.nodes.filter((node) => node.chapter === chapter && (!node.ahead || (counts[node.id] ?? 0) > 0));
  const sum = (ids: string[]) => ids.reduce((total, id) => total + (counts[id] ?? 0), 0);
  const grammarName = (stage: number, index: number) => {
    const node = book.nodes.find((one) => one.chapter === "grammar" && one.stage === stage && one.index === index);
    return node ? nameOf(node.id) : "";
  };
  /** 오늘 할 것·틀린 줄·문법 칸에서 고른 상황·문장구조 → 단계 칸을 펼치고 연다. */
  const openScript = (stage: number, id: string) => {
    openLayer("stage");
    setJump({ stage, id, at: Date.now() });
  };
  const stageRow = (book.parts ?? []).find((row) => row.order === book.stage) ?? null;
  const stageLeft = stageRow ? toNextStage(stageRow.parts, STAGE_DONE_SHARE) : 0;
  /** 내 진척 시트 안의 망·그래프(예전 My 맨 위 [망 | 그래프 | 단계] 토글을 여기로, 2026-10-30). */
  const partsView = (mode: "net" | "graph") =>
    book.parts?.length ? (
      <PartsOverview
        ui={ui}
        locale={locale}
        view={mode}
        parts={stageRow ?? book.parts[0]!}
        days={book.partDays ?? null}
        items={book.partItems ?? null}
        allOf={(id, row) =>
          id === "vocab"
            ? (book.words ?? []).map((word) => ({ text: word.text, state: word.state }))
            : id === "expression"
              ? row.expressions.map((item) => ({ text: item.text, state: item.state }))
              : id === "grammar"
                ? book.nodes.filter((node) => node.chapter === "grammar" && node.stage === row.order).map((node) => ({ text: nameOf(node.id), state: fill[node.id] ?? null }))
                : []
        }
        nodeName={nameOf}
        onPart={() => openLayer("stage")}
      />
    ) : null;
  // 네 갈래 틀이 있으면 글자·소리(발음)·관용 표현(표현)·세부(어휘·표현)는 그 갈래 안에서 — 아래 줄에는 내가 만든 칸·자리 없음만.
  const inParts = frame && book.stages.length > 0 && (book.parts?.length ?? 0) > 0;
  const rows: Array<{ key: Group; label: string; count: number; show: boolean }> = [
    { key: "script", label: ui.notebookScript, count: sum(inChapter("script").map((n) => n.id)), show: !inParts && inChapter("script").length > 0 },
    // 문법은 아래 단계 틀(StageFrame)로 펼쳐 보인다. 옛 서버(단계 사다리 없음)면 예전처럼 한 줄.
    { key: "grammar", label: ui.notebookGrammar, count: sum(inChapter("grammar").map((n) => n.id)), show: inChapter("grammar").length > 0 && book.stages.length === 0 },
    { key: "idiom", label: ui.notebookIdioms, count: sum(inChapter("idiom").map((n) => n.id)), show: !inParts && inChapter("idiom").length > 0 },
    { key: "detail", label: ui.notebookDetails, count: sum(inChapter("detail").map((n) => n.id)), show: !inParts && inChapter("detail").length > 0 },
    { key: "mine", label: ui.notebookMine, count: sum(book.custom.map((n) => n.id)), show: true },
    { key: "loose", label: ui.notesLoose, count: counts[""] ?? 0, show: (counts[""] ?? 0) > 0 },
  ];
  const todayPending = book.pending.filter((card) => card.day === book.today);
  const earlierPending = book.pending.filter((card) => card.day !== book.today);
  const openNode = nodeOpen ? { id: nodeOpen, name: nameOf(nodeOpen), view: book.nodes.find((node) => node.id === nodeOpen) } : null;
  const movingCard = moving ? book.cards.find((card) => card.id === moving) ?? null : null;

  return (
    <>
      {!CURRICULUM_ONLY && (todayPending.length || earlierPending.length) ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {todayPending.length ? (
            <button
              type="button"
              onClick={() => setPicking("today")}
              className="rounded-lg bg-status-learned/20 px-3 py-1.5 text-note font-semibold text-ink"
            >
              {ui.notebookToday} · {todayPending.length}
            </button>
          ) : null}
          {earlierPending.length ? (
            <button
              type="button"
              onClick={() => setPicking("earlier")}
              className="rounded-lg border border-line px-3 py-1.5 text-caption text-slate-300"
            >
              {ui.notebookPastDays} · {earlierPending.length}
            </button>
          ) : null}
        </div>
      ) : null}
      {question && !question.node ? (
        <QuestionBox ui={ui} question={question} onAdd={(withShot) => void addQuestion(question, withShot)} onClose={() => setQuestion(null)} />
      ) : null}
      {stageTestFor !== null && onNextStage ? (
        <StageTestGate
          ui={ui}
          locale={locale}
          language={language}
          stage={stageTestFor}
          checkups={checkups}
          labelOf={(key) => {
            if (!key.startsWith("g|")) return reviewLabel(language, key);
            const [stage, index] = key.slice(2).split(":").map(Number);
            const node = book.nodes.find((one) => one.chapter === "grammar" && one.stage === stage && one.index === index);
            return node ? nameOf(node.id) : key;
          }}
          onFinish={(result) => void saveCheckup(result)}
          onNext={() => {
            const order = stageTestFor;
            setStageTestFor(null);
            onNextStage(order);
          }}
          onClose={() => setStageTestFor(null)}
        />
      ) : null}
      {frame && CURRICULUM_ONLY && book.stages.length ? (
        <MyLayers
          ui={ui}
          language={language}
          open={layer}
          onOpen={openLayer}
          today={
            lettersOn ? (
              { summary: null, body: <LettersPlan ui={ui} targetLanguage={language} locale={locale} isPremium={isPremium} onDone={() => setLetters(false)} /> }
            ) : null
          }
          plan={
            !lettersOn && book.parts?.some((row) => row.scripts)
              ? (render) => (
                  <TodayPlan
                    ui={ui}
                    locale={locale}
                    language={language}
                    stage={studyMode === "free" ? frontierStage(book.parts ?? [], book.stage) : book.stage}
                    free={studyMode === "free"}
                    passed={(book.parts ?? []).flatMap((row) => row.scripts?.passed ?? [])}
                    review={book.review ?? NO_REVIEW}
                    recommended={book.recommend?.id ?? null}
                    redo={(book.redo ?? []).map((item) => ({ frame: item.frame, card: { wrong: item.card.wrong, right: item.card.right, note: item.card.note } }))}
                    weakest={(book.parts ?? []).find((row) => row.order === book.stage)?.weakest ?? null}
                    expressions={(book.parts ?? []).find((row) => row.order === book.stage)?.expressions ?? []}
                    cards={book.cards}
                    onOpen={openScript}
                    onStageChanged={() => setReload((n) => n + 1)}
                    grammarName={grammarName}
                  >
                    {render}
                  </TodayPlan>
                )
              : null
          }
          stage={{
            title: ui.stageNumber.replace("{n}", String(lettersOn ? 0 : book.stage)),
            summary: studyMode === "free" ? ui.modeFree : stageLeft > 0 ? ui.toNextStage.replace("{n}", String(stageLeft)) : null,
            body: (
              <>
                {book.parts?.some((row) => row.scripts) ? (
                  <SkeletonProgress
                    ui={ui}
                    language={language}
                    stage={lettersOn ? 0 : book.stage}
                    free={studyMode === "free"}
                    onMode={setStudyMode}
                    row={lettersOn ? null : ((book.parts ?? []).find((row) => row.order === book.stage) ?? null)}
                    known={known}
                    passed={(book.parts ?? []).flatMap((row) => row.scripts?.passed ?? [])}
                    views={partsView}
                    extra={<ScriptAmount inside ui={ui} locale={locale} language={language} passed={(book.parts ?? []).flatMap((row) => row.scripts?.passed ?? [])} skipped={skipped} />}
                  />
                ) : null}
        <StageFrame
                  ui={ui}
                  stages={book.stages}
                  current={book.stage}
                  nodes={book.nodes.filter((node) => node.chapter === "grammar")}
                  allNodes={book.nodes.filter((node) => !node.ahead)}
                  counts={counts}
                  fill={fill}
                  nameOf={nameOf}
                  onOpen={setNodeOpen}
                  detail={stageDetail}
                  masteredOf={masteredOf}
                  focus={focusStage}
                  parts={book.parts ?? []}
                  words={book.words ?? []}
                  pronunciationNotes={book.pronunciationNotes ?? {}}
                  onTry={onTry}
                  onNextStage={onNextStage && studyMode !== "free" ? (order) => setStageTestFor(order) : undefined}
                  free={studyMode === "free"}
                  onSetStage={setStageTo}
                  letters={
                    needsLetters(language)
                      ? { on: lettersOn, panel: <ScriptEntry ui={ui} targetLanguage={language} locale={locale} isPremium={isPremium} />, onPick: () => setLetters(true) }
                      : undefined
                  }
                  canSpeak={canSpeak}
                  focusPart={focusPart}
                  jump={jump}
                  onJumped={() => setJump(null)}
                  scripts={(order, row, openFor) => (
                    <StageScripts
                      ui={ui}
                      locale={locale}
                      language={language}
                      stage={order}
                      passed={row?.scripts?.passed ?? []}
                      skipped={skipped}
                      onPassed={() => setReload((n) => n + 1)}
                      expressionStates={Object.fromEntries((row?.expressions ?? []).map((item) => [item.text, item.state]))}
                      openFor={openFor}
                      recommended={!CURRICULUM_ONLY && book.recommend && book.recommend.stage === order ? book.recommend : null}
                      redo={order === book.stage ? (book.redo ?? []) : []}
                      onRedoDone={(id) => {
                        setBook((current) => (current ? { ...current, redo: (current.redo ?? []).filter((item) => item.frame !== id) } : current));
                        setReload((n) => n + 1);
                      }}
                    />
                  )}
                  scriptFor={(order, open) => scriptForExpressions(language, order, open)?.id ?? null}
                />
              </>
            ),
          }}
          weak={
            <WeakStrip
              ui={ui}
              locale={locale}
              language={language}
              spots={weakSpots({ language, fixes: [...book.cards, ...book.pending], misses: allMisses(language), review: book.review ?? NO_REVIEW, grammarName })}
              onOpen={openScript}
            />
          }
        />
      ) : null}
      {frame && book.stages.length && book.parts?.some((row) => row.scripts) && !CURRICULUM_ONLY ? (
        <ScriptAmount ui={ui} locale={locale} language={language} passed={(book.parts ?? []).flatMap((row) => row.scripts?.passed ?? [])} skipped={skipped} />
      ) : null}
      {frame && !CURRICULUM_ONLY && book.stages.length ? (
        <StageFrame
          ui={ui}
          stages={book.stages}
          current={book.stage}
          nodes={book.nodes.filter((node) => node.chapter === "grammar")}
          allNodes={book.nodes.filter((node) => !node.ahead)}
          counts={counts}
          fill={fill}
          nameOf={nameOf}
          onOpen={setNodeOpen}
          detail={stageDetail}
          masteredOf={masteredOf}
          focus={focusStage}
          parts={book.parts ?? []}
          words={book.words ?? []}
          pronunciationNotes={book.pronunciationNotes ?? {}}
          onTry={onTry}
          onNextStage={onNextStage && studyMode !== "free" ? (order) => setStageTestFor(order) : undefined}
          free={studyMode === "free"}
          onSetStage={setStageTo}
          letters={
            needsLetters(language)
              ? { on: lettersOn, panel: <ScriptEntry ui={ui} targetLanguage={language} locale={locale} isPremium={isPremium} />, onPick: () => setLetters(true) }
              : undefined
          }
          canSpeak={canSpeak}
          focusPart={focusPart}
          jump={jump}
          onJumped={() => setJump(null)}
          scripts={(order, row, openFor) => (
            <StageScripts
              ui={ui}
              locale={locale}
              language={language}
              stage={order}
              passed={row?.scripts?.passed ?? []}
              skipped={skipped}
              onPassed={() => setReload((n) => n + 1)}
              expressionStates={Object.fromEntries((row?.expressions ?? []).map((item) => [item.text, item.state]))}
              openFor={openFor}
              recommended={!CURRICULUM_ONLY && book.recommend && book.recommend.stage === order ? book.recommend : null}
              redo={order === book.stage ? (book.redo ?? []) : []}
              onRedoDone={(id) => {
                setBook((current) => (current ? { ...current, redo: (current.redo ?? []).filter((item) => item.frame !== id) } : current));
                setReload((n) => n + 1);
              }}
            />
          )}
          scriptFor={(order, open) => scriptForExpressions(language, order, open)?.id ?? null}
        />
      ) : null}
      {!frame && (view === "net" || view === "graph") && book.parts?.length ? (
        <PartsOverview
          ui={ui}
          locale={locale}
          view={view}
          parts={book.parts.find((row) => row.order === book.stage) ?? book.parts[0]!}
          days={book.partDays ?? null}
          items={book.partItems ?? null}
          allOf={(id, row) =>
            id === "vocab"
              ? (book.words ?? []).map((word) => ({ text: word.text, state: word.state }))
              : id === "expression"
                ? row.expressions.map((item) => ({ text: item.text, state: item.state }))
                : id === "grammar"
                  ? book.nodes
                      .filter((node) => node.chapter === "grammar" && node.stage === row.order)
                      .map((node) => ({ text: nameOf(node.id), state: fill[node.id] ?? null }))
                  : []
          }
          nodeName={nameOf}
          onPart={onPart}
        />
      ) : null}
      {frame && !CURRICULUM_ONLY ? (
      <ul className="mt-2 divide-y divide-white/5">
        {rows
          .filter((row) => row.show)
          .map((row) => (
            <li key={row.key}>
              <button type="button" onClick={() => setGroup(row.key)} className="flex w-full items-center gap-3 py-2.5 text-start">
                <span className="min-w-0 flex-1 text-note text-ink">{row.label}</span>
                <span className="w-7 shrink-0 text-end text-caption tabular-nums text-slate-400">{row.count || ""}</span>
                <span aria-hidden className="text-caption text-slate-500">›</span>
              </button>
            </li>
          ))}
      </ul>
      ) : null}

      {group ? (
        <Sheet ui={ui} title={rows.find((row) => row.key === group)?.label ?? ""} onClose={() => setGroup(null)}>
          {group === "loose" ? (
            <CardList
              ui={ui}
              locale={locale}
              cards={book.cards.filter((card) => !card.node)}
              onMove={setMoving}
              onShot={setViewShot}
              edit={edit}
            />
          ) : group === "mine" ? (
            <MineList ui={ui} custom={book.custom} counts={counts} onOpen={setNodeOpen} edit={edit} />
          ) : (
            <NodeList ui={ui} nodes={inChapter(group)} stage={book.stage} counts={counts} nameOf={nameOf} onOpen={setNodeOpen} />
          )}
        </Sheet>
      ) : null}

      {picking ? (
        <Sheet ui={ui} title={picking === "today" ? ui.notebookToday : ui.notebookPastDays} onClose={() => setPicking(null)}>
          <PickList
            key={picking}
            ui={ui}
            language={language}
            cards={picking === "today" ? todayPending : earlierPending}
            nameOf={(id) => (id ? nameOf(id) : ui.notesLoose)}
            onCommit={async (ids, shots) => {
              await commit(ids, shots);
              setPicking(null);
            }}
          />
        </Sheet>
      ) : null}

      {viewShot ? <ShotSheet ui={ui} language={language} isPremium={isPremium} shotId={viewShot} onClose={() => setViewShot(null)} /> : null}

      {openNode ? (
        <Sheet ui={ui} title={openNode.name} onClose={() => setNodeOpen(null)}>
          <NodeBody
            key={openNode.id}
            ui={ui}
            locale={locale}
            id={openNode.id}
            name={openNode.name}
            view={openNode.view}
            memo={book.memos[openNode.id] ?? ""}
            cards={book.cards.filter((card) => card.node === openNode.id)}
            phrases={book.phrases.filter((phrase) => phrase.node === openNode.id)}
            top={
              question && question.node === openNode.id ? (
                <QuestionBox ui={ui} question={question} onAdd={(withShot) => void addQuestion(question, withShot)} onClose={() => setQuestion(null)} />
              ) : null
            }
            onMovePhrase={setMovingPhrase}
            onMove={setMoving}
            onShot={setViewShot}
            edit={edit}
            related={
              CURRICULUM_ONLY && openNode.view?.chapter === "grammar" && openNode.view.stage !== undefined && openNode.view.index !== undefined
                ? relatedFor(language, locale, openNode.view.stage, openNode.view.index, new Set((book.parts ?? []).flatMap((row) => row.scripts?.passed ?? [])))
                : undefined
            }
            onJump={(stage, id) => {
              setNodeOpen(null);
              setJump({ stage, id, at: Date.now() });
            }}
            onTry={
              onTry && openNode.view?.chapter === "grammar" && openNode.view.stage !== undefined && openNode.view.index !== undefined
                ? () => {
                    onTry(openNode.view!.stage!, openNode.view!.index!);
                    setNodeOpen(null);
                  }
                : undefined
            }
          />
        </Sheet>
      ) : null}

      {movingPhrase ? (
        <Sheet ui={ui} title={ui.notebookMoveTo} onClose={() => setMovingPhrase(null)}>
          <ul className="mt-2 space-y-1">
            {[...book.nodes.filter((node) => !node.ahead).map((node) => node.id), ...book.custom.map((node) => node.id), ""].map((id) => (
              <li key={id || "vocab"}>
                <button
                  type="button"
                  disabled={book.phrases.find((p) => p.key === movingPhrase)?.node === id}
                  onClick={() => {
                    movePhrase(movingPhrase, id || null);
                    setMovingPhrase(null);
                  }}
                  className="w-full rounded-lg px-3 py-2 text-start text-note text-slate-200 hover:bg-white/10 disabled:opacity-40"
                >
                  {id ? nameOf(id) : ui.notebookVocab}
                </button>
              </li>
            ))}
          </ul>
        </Sheet>
      ) : null}

      {movingCard ? (
        <Sheet ui={ui} title={ui.notebookMoveTo} onClose={() => setMoving(null)}>
          <ul className="mt-2 space-y-1">
            {[...book.nodes.filter((node) => !node.ahead).map((node) => node.id), ...book.custom.map((node) => node.id)].map((id) => (
              <li key={id}>
                <button
                  type="button"
                  disabled={movingCard.node === id}
                  onClick={() => {
                    void edit({ op: "move", card: movingCard.id, node: id });
                    setMoving(null);
                  }}
                  className="w-full rounded-lg px-3 py-2 text-start text-note text-slate-200 hover:bg-white/10 disabled:opacity-40"
                >
                  {nameOf(id)}
                </button>
              </li>
            ))}
          </ul>
        </Sheet>
      ) : null}
    </>
  );
}

/**
 * 수준별 틀(2026-10-24 사용자: "수준별 학습틀, 학습한 걸 틀에 넣어 키워가는 흐름이 보여야"):
 * 단계 사다리(1 2 3 4 5 — 지나온 단계·지금·다음), 고른 단계의 문법 칸이 바로 펼쳐지고,
 * 짚인 장면이 든 칸은 채워진 점 + 횟수, 위에 "채운 칸 / 이 단계 칸". 다음 단계도 눌러 미리 본다.
 * 설명 글 없이 번호·이름·숫자만(hub/DESIGN.md "안내 글").
 */
function partLabels(ui: UICopy): Record<PartId, string> {
  return { vocab: ui.partVocab, grammar: ui.partGrammar, expression: ui.partExpression, pronunciation: ui.partPronunciation };
}

/**
 * 망·그래프 보기(2026-10-25 사용자 "망, 그래프도 변경 내용에 맞게 통합" → 1번): 단계 보기와 같은 네 갈래.
 * 망 = 지금 단계에서 찬 정도(꼭짓점, 점선 = 다음 단계 기준 70%), 그래프 = 갈래마다 최근 14일 막대. 갈래를 누르면 단계 보기의 그 갈래.
 */
function PartsOverview({
  ui,
  locale,
  view,
  parts,
  days,
  items,
  allOf,
  nodeName,
  onPart,
}: {
  ui: UICopy;
  locale: string;
  view: "net" | "graph";
  parts: StageParts;
  days: Record<PartId, number[]> | null;
  /** 같은 14일의 낱낱(서버 partItems) — 없으면(옛 서버) 누르면 예전처럼 단계 보기로. */
  items: Record<PartId, PartLogItem[]> | null;
  allOf: (part: PartId, row: StageParts) => PartAll;
  nodeName: (id: string) => string;
  onPart?: (part: PartId) => void;
}) {
  const label = partLabels(ui);
  const byId = new Map(parts.parts.map((row) => [row.id, row]));
  // 누르면 "무엇을 공부했나"(2026-10-29): 갈래(망 꼭짓점·그래프 이름) 또는 그 갈래의 하루(그래프 막대).
  const [detail, setDetail] = useState<{ part: PartId; bar: number | null } | null>(null);
  const summaryOf = (id: PartId) => {
    const row = byId.get(id);
    return row?.measured ? `${Math.round(row.done)}/${row.total}` : "";
  };
  const show = (part: PartId, bar: number | null = null) => (items ? setDetail({ part, bar }) : onPart?.(part));
  const sheet = detail ? (
    <PartDetailSheet
      ui={ui}
      locale={locale}
      part={detail.part}
      title={label[detail.part]}
      summary={summaryOf(detail.part)}
      items={items?.[detail.part] ?? []}
      all={allOf(detail.part, parts)}
      day={detail.bar === null ? null : dayOfBar(detail.bar)}
      dayCount={detail.bar === null ? undefined : days?.[detail.part]?.[detail.bar]}
      nodeName={nodeName}
      onStage={
        onPart
          ? () => {
              const part = detail.part;
              setDetail(null);
              onPart(part);
            }
          : undefined
      }
      onClose={() => setDetail(null)}
    />
  ) : null;
  const head = (
    <p className="mt-2 text-caption text-slate-400">
      <span className="font-semibold text-ink">{ui.stageNumber.replace("{n}", String(parts.order))}</span>
      {parts.ready ? <> · {ui.partReady}</> : parts.weakest ? <> · {ui.partToNext.replace("{part}", label[parts.weakest])}</> : null}
    </p>
  );
  if (view === "graph") {
    const top = Math.max(1, ...PART_IDS.flatMap((id) => days?.[id] ?? []));
    return (
      <div>
        {head}
        <ul className="mt-2 space-y-1">
          {PART_IDS.map((id) => {
            const row = byId.get(id);
            const list = days?.[id] ?? [];
            const sum = list.reduce((a, b) => a + b, 0);
            const weakest = parts.weakest === id;
            return (
              <li key={id} className="flex w-full items-center gap-3 rounded-lg px-2 py-1">
                <button type="button" onClick={() => show(id)} className={`w-20 shrink-0 py-2 text-start text-note hover:underline ${weakest ? "font-semibold text-warn" : "text-ink"}`}>
                  {label[id]}
                </button>
                <span dir="ltr" className="flex h-10 min-w-0 flex-1 items-end gap-0.5">
                  {list.map((value, index) => (
                    <button
                      key={index}
                      type="button"
                      aria-label={`${label[id]} ${index + 1}`}
                      onClick={() => show(id, index)}
                      className="flex h-full min-w-0 flex-1 items-end hover:bg-white/5"
                    >
                      <span
                        className={`block w-full rounded-sm ${value ? (weakest ? "bg-warn" : "bg-status-learned") : "bg-white/[0.06]"}`}
                        style={{ height: `${value ? Math.max(12, Math.round((value / top) * 100)) : 8}%` }}
                      />
                    </button>
                  ))}
                </span>
                <button type="button" onClick={() => show(id)} className="w-12 shrink-0 py-2 text-end text-caption tabular-nums text-slate-400">
                  {row && !row.measured ? "–" : sum ? `+${Math.round(sum * 10) / 10}` : ""}
                </button>
              </li>
            );
          })}
        </ul>
        {sheet}
      </div>
    );
  }
  // 망: 위 어휘 · 오른쪽 문법 · 아래 표현 · 왼쪽 발음.
  const W = 280;
  const C = 140;
  const R = 92;
  const dir: Record<PartId, [number, number]> = { vocab: [0, -1], grammar: [1, 0], expression: [0, 1], pronunciation: [-1, 0] };
  const at = (id: PartId, share: number): [number, number] => [C + dir[id][0] * R * share, C + dir[id][1] * R * share];
  const shape = (share: (id: PartId) => number) => PART_IDS.map((id) => at(id, share(id)).join(",")).join(" ");
  const shareFor = (id: PartId) => {
    const row = byId.get(id);
    return row && row.measured ? Math.max(0.04, shareOf(row)) : 0.04;
  };
  return (
    <div>
      {head}
      <div className="relative mx-auto mt-2 aspect-square w-full max-w-[18rem]" dir="ltr">
        <svg viewBox={`0 0 ${W} ${W}`} className="absolute inset-0 h-full w-full" aria-hidden>
          <polygon points={shape(() => 1)} className="fill-white/[0.03] stroke-white/10" />
          <polygon points={shape(() => 0.7)} className="fill-none stroke-white/30" strokeDasharray="4 4" />
          {PART_IDS.map((id) => (
            <line key={id} x1={C} y1={C} x2={at(id, 1)[0]} y2={at(id, 1)[1]} className="stroke-white/10" />
          ))}
          <polygon points={shape(shareFor)} className="fill-status-learned/30 stroke-status-learned" strokeWidth={2} />
        </svg>
        {PART_IDS.map((id) => {
          const row = byId.get(id);
          const weakest = parts.weakest === id;
          const pos =
            id === "vocab" ? "left-1/2 top-0 -translate-x-1/2" : id === "grammar" ? "right-0 top-1/2 -translate-y-1/2" : id === "expression" ? "bottom-0 left-1/2 -translate-x-1/2" : "left-0 top-1/2 -translate-y-1/2";
          return (
            <button
              key={id}
              type="button"
              onClick={() => show(id)}
              className={`absolute ${pos} rounded-lg bg-surface/80 px-2 py-1 text-center text-caption ${weakest ? "text-warn" : "text-ink"}`}
            >
              <span className="block font-semibold">{label[id]}</span>
              <span className="block tabular-nums text-slate-400">{row?.measured ? `${Math.round(row.done)}/${row.total}` : ui.myNoData}</span>
            </button>
          );
        })}
      </div>
      {sheet}
    </div>
  );
}

/** 갈래마다 노트 고정 칸(그 갈래를 열면 아래에 칸 줄로). 문법은 단계 칸, 발음은 글자·소리 칸. */
const PART_NODES: Record<PartId, readonly string[]> = {
  vocab: ["d-word", "d-spelling"],
  grammar: [],
  expression: ["i-idiom", "i-together", "i-set", "d-register", "d-nuance"],
  pronunciation: [],
};

/**
 * 수준별 틀(2026-10-25 사용자 "어휘, 문법, 표현, 발음 이런 식으로 나눠서 … 발음이 부족하면 발음을 향상해서 다음 단계로"):
 * 단계 사다리 → 그 단계의 네 갈래(막대) → 가장 모자란 갈래 "다음 단계까지" + 연습 → 고른 갈래의 칸·목록 → 이 단계 목표(접힘).
 * 네 갈래가 다 차면(잰 것만, 70%) "다음 단계로". 옛 서버(parts 없음)면 예전처럼 문법 칸만.
 */
function StageFrame({
  ui,
  stages,
  current,
  nodes,
  allNodes,
  counts,
  fill,
  nameOf,
  onOpen,
  detail,
  masteredOf,
  focus,
  parts,
  words,
  pronunciationNotes,
  onNextStage,
  focusPart = null,
  scripts,
  scriptFor,
  jump = null,
  onJumped,
  free = false,
  onSetStage,
  letters,
}: {
  ui: UICopy;
  stages: { order: number; title: string }[];
  current: number;
  nodes: NodeView[];
  allNodes: NodeView[];
  counts: Record<string, number>;
  fill: Record<string, "mastered" | "learned">;
  nameOf: (id: string) => string;
  onOpen: (id: string) => void;
  detail?: (order: number) => ReactNode;
  masteredOf?: (stage: number, index: number) => boolean;
  /** 이 단계를 펼쳐 보인다("My에서 찾기"로 온 칸의 단계). */
  focus?: number | null;
  parts: StageParts[];
  words: { text: string; state: "met" | "learned" | "mastered" }[];
  pronunciationNotes: Record<string, string>;
  onTry?: (stage: number, index: number) => void;
  onNextStage?: (order: number) => void;
  canSpeak: boolean;
  /** 망·그래프에서 누른 갈래 — 지금 단계의 그 갈래를 연다. */
  focusPart?: PartId | null;
  /** 그 단계 대본(맨 위, 2026-10-27 "My탭도 대본에 맞추고"). openFor = 표현 연습으로 열 대본. */
  scripts?: (order: number, row: StageParts | null, openFor: { id: string; at: number } | null) => ReactNode;
  /** 아직 배우지 않은 표현이 든 대본 id(표현 갈래 연습 → 그 대본, 2026-10-28 "표현연결"). */
  scriptFor?: (order: number, open: string[]) => string | null;
  /** 밖(문법 칸)에서 고른 대본·문장구조 — 그 단계로 옮겨 연다. */
  jump?: { stage: number; id: string; at: number } | null;
  /** 연 뒤 밖의 jump를 비운다 — 칸을 접었다 펴면(다시 그려지면) 같은 대본이 또 열리던 것(2026-10-30 사용자 화면). */
  onJumped?: () => void;
  /** 자유롭게(curriculum/studyMode.ts): 다음 단계 조건을 안 보인다. */
  free?: boolean;
  /** 보고 있는 단계를 지금 단계로(조건·시험 없이). */
  onSetStage?: (order: number) => void;
  /** 0단계 — 글자·소리(글자가 다른 학습 언어만): 사다리 맨 앞 0, 그 칸의 연습, 고르기. */
  letters?: { on: boolean; panel: ReactNode; onPick: () => void };
}) {
  const now = letters?.on ? 0 : Math.max(1, Math.min(current, stages.length));
  const ladder = letters ? [{ order: 0, title: "" }, ...stages] : stages;
  const [shown, setShown] = useState(focus ?? now);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 밖에서 고른 단계(찾기)로 옮겨 간다
    if (focus) setShown(focus);
  }, [focus]);
  const stageParts = parts.find((row) => row.order === shown) ?? null;
  // 고른 갈래: 처음엔 가장 모자란 갈래(없으면 문법). "My에서 찾기"로 온 문법 칸이면 문법.
  const [picked, setPicked] = useState<PartId | null>(focusPart);
  const [openScript, setOpenScript] = useState<{ id: string; at: number } | null>(null);
  const [jumped, setJumped] = useState(0);
  if (jump && jump.at !== jumped) {
    // 렌더 중 한 번(같은 at은 다시 안 함) — 그 단계를 보이고 대본·문장구조를 연다.
    setJumped(jump.at);
    setShown(jump.stage);
    setOpenScript({ id: jump.id, at: jump.at });
  }
  useEffect(() => {
    if (jump && jump.at === jumped) onJumped?.();
  }, [jump, jumped, onJumped]);
  const part: PartId = picked ?? (focus ? "grammar" : (stageParts?.weakest ?? "grammar"));
  const inStage = (order: number) => nodes.filter((node) => (node.stage ?? 1) === order);
  const filledOf = (node: NodeView) => Boolean(fill[node.id]) || Boolean(masteredOf?.(node.stage ?? 1, node.index ?? -1));
  const filledIn = (order: number) => inStage(order).filter(filledOf).length;
  const label: Record<PartId, string> = { vocab: ui.partVocab, grammar: ui.partGrammar, expression: ui.partExpression, pronunciation: ui.partPronunciation };
  const readyOf = (order: number) => parts.find((row) => row.order === order)?.ready ?? false;

  const dot = (node: NodeView) =>
    fill[node.id] === "mastered" || masteredOf?.(node.stage ?? 1, node.index ?? -1)
      ? "bg-status-mastered"
      : fill[node.id] === "learned"
        ? "bg-status-learned"
        : (counts[node.id] ?? 0)
          ? "bg-status-pending"
          : "border border-line";
  const stateDot = (state: "met" | "learned" | "mastered" | null) =>
    state === "mastered" ? "bg-status-mastered" : state === "learned" ? "bg-status-learned" : state === "met" ? "bg-status-pending" : "border border-line";
  const nodeRows = (list: NodeView[]) => (
    <ul className="divide-y divide-white/5">
      {list.map((node) => {
        const count = counts[node.id] ?? 0;
        return (
          <li key={node.id}>
            <button type="button" onClick={() => onOpen(node.id)} className="flex w-full items-center gap-3 py-2 text-start">
              <span aria-hidden className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot(node)}`} />
              <span className="min-w-0 flex-1">
                <span className={`block text-note ${shown > now && !count ? "text-slate-400" : "text-ink"}`}>{nameOf(node.id)}</span>
                {node.example ? (
                  <span dir="auto" className="block truncate text-meta text-slate-500">
                    {node.example}
                  </span>
                ) : null}
              </span>
              {masteredOf?.(node.stage ?? 1, node.index ?? -1) ? <span className="shrink-0 text-caption text-good">✓</span> : null}
              <span className="w-7 shrink-0 text-end text-caption tabular-nums text-slate-400">{count || ""}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
  const chips = (list: { text: string; state: "met" | "learned" | "mastered" | null }[]) => (
    <ul className="flex flex-wrap gap-1.5 py-2">
      {list.map((item) => (
        <li key={item.text} className="flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-2 py-1 text-caption text-slate-200">
          <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${stateDot(item.state)}`} />
          <span dir="auto">{item.text}</span>
        </li>
      ))}
    </ul>
  );

  const openExpressions = (stageParts?.expressions ?? []).filter((item) => item.state !== "mastered" && item.state !== "learned").map((item) => item.text);
  const expressionScript = scriptFor && openExpressions.length ? scriptFor(shown, openExpressions) : null;
  /** 그 갈래 연습: 아직인 표현이 든 대본을 연다 — 그런 대본이 있을 때만(채팅·통화로 보내던 "채팅으로"·"통화로"는 뺌, 2026-10-29 사용자 "이동만 하고 할 게 안 보이는 버튼 삭제"). */
  const practice = (id: PartId) => {
    if (id === "expression" && expressionScript) setOpenScript((current) => ({ id: expressionScript, at: (current?.at ?? 0) + 1 }));
  };
  const practiceLabel = () => ui.stageScriptsTitle;
  const canPractice = (id: PartId) => id === "expression" && Boolean(expressionScript);

  return (
    <div className="mt-3">
      <ol className="flex items-center">
        {ladder.map((stage, index) => {
          const done = stage.order < now;
          const here = stage.order === now;
          const on = stage.order === shown;
          return (
            <li key={stage.order} className={`flex items-center ${index ? "flex-1" : ""}`}>
              {index ? <span aria-hidden className={`h-px flex-1 ${stage.order <= now ? "bg-status-learned/60" : "bg-white/10"}`} /> : null}
              <button
                type="button"
                aria-pressed={on}
                aria-label={ui.stageNumber.replace("{n}", String(stage.order))}
                onClick={() => {
                  setShown(stage.order);
                  setPicked(null);
                }}
                className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-caption tabular-nums ${
                  here ? "bg-status-learned font-semibold text-black" : done ? "bg-status-learned/30 text-ink" : "border border-line text-slate-500"
                } ${on ? "ring-2 ring-white/70 ring-offset-2 ring-offset-black" : ""}`}
              >
                {stage.order}
                {!parts.length && filledIn(stage.order) ? (
                  <span className="absolute -top-1 -end-1 rounded-full bg-white/90 px-1 text-meta leading-tight text-black">{filledIn(stage.order)}</span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ol>
      {/* 단계 = 말하는 힘의 크기(상황 이름이 아님, 2026-10-25). 제목은 단계 번호(stageNumber)만 — 상황처럼 읽히는 단계 제목은 뺌(사용자 요청 2026-10-25). */}
      <div className="mt-3 flex items-center gap-2">
        <p className={`min-w-0 flex-1 text-note font-semibold ${shown > now ? "text-slate-400" : "text-ink"}`}>{ui.stageNumber.replace("{n}", String(shown))}</p>
        {shown !== now && (onSetStage || letters) && !free ? (
          <button
            type="button"
            data-set-stage
            onClick={() => (shown === 0 ? letters?.onPick() : onSetStage?.(shown))}
            className="shrink-0 rounded-full border border-line px-3 py-1 text-caption text-slate-200 hover:bg-white/10"
          >
            {ui.setStageHere}
          </button>
        ) : null}
      </div>
      {shown === 0 && letters ? <div className="mt-2">{letters.panel}</div> : scripts?.(shown, stageParts, openScript)}

      {stageParts ? (
        <>
          {/* 다음 단계 조건: 지금 단계에서만. 다 찼으면 partReady 버튼, 아니면 가장 모자란 갈래 + 연습. */}
          {shown === now && !free ? (
            readyOf(shown) && onNextStage && shown < stages.length ? (
              <button
                type="button"
                onClick={() => onNextStage(shown)}
                className="mt-2 w-full rounded-xl bg-status-learned py-2.5 text-note font-semibold text-black"
              >
                {ui.partReady} ›
              </button>
            ) : !stageParts.weakest && stageParts.scripts && stageParts.scripts.done < stageParts.scripts.total ? (
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-warn/40 bg-warn/10 px-3 py-2">
                <span className="min-w-0 flex-1 text-note text-ink">
                  {ui.scriptsToNext.replace("{n}", String(stageParts.scripts.total - stageParts.scripts.done))}
                </span>
              </div>
            ) : stageParts.weakest ? (
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-warn/40 bg-warn/10 px-3 py-2">
                <span className="min-w-0 flex-1 text-note text-ink">{ui.partToNext.replace("{part}", label[stageParts.weakest])}</span>
                {canPractice(stageParts.weakest) ? (
                  <button
                    type="button"
                    onClick={() => practice(stageParts.weakest!)}
                    className="shrink-0 rounded-lg bg-platinum px-3 py-1.5 text-caption font-semibold text-black"
                  >
                    {practiceLabel()}
                  </button>
                ) : null}
              </div>
            ) : null
          ) : null}

          <ul className="mt-2 space-y-1" role="group">
            {stageParts.parts.map((row) => {
              const share = shareOf(row);
              const on = row.id === part;
              const weakest = shown === now && row.id === stageParts.weakest;
              return (
                <li key={row.id}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setPicked(row.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-start ${on ? "bg-white/10" : "hover:bg-white/5"}`}
                  >
                    <span className={`w-20 shrink-0 text-note ${weakest ? "font-semibold text-warn" : "text-ink"}`}>{label[row.id]}</span>
                    {row.measured ? (
                      <>
                        <span className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                          <span
                            className={`block h-full rounded-full ${share >= 0.7 ? "bg-status-mastered" : weakest ? "bg-warn" : "bg-status-learned"}`}
                            style={{ width: `${Math.round(share * 100)}%` }}
                          />
                        </span>
                        <span className="w-14 shrink-0 text-end text-caption tabular-nums text-slate-400">
                          {Math.round(row.done)}/{row.total}
                        </span>
                      </>
                    ) : (
                      <span className="min-w-0 flex-1 text-caption text-slate-500">{ui.myNoData}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* 고른 갈래의 칸·목록. */}
          <div className="mt-2 rounded-xl bg-surface-sunk px-3 py-1">
            {part === "grammar" ? nodeRows(inStage(shown)) : null}
            {part === "expression" ? (
              <>
                {chips(stageParts.expressions)}
                {nodeRows(allNodes.filter((node) => PART_NODES.expression.includes(node.id)))}
              </>
            ) : null}
            {part === "vocab" ? (
              <>
                {words.length ? chips(words) : null}
                <button type="button" onClick={() => sendAppIntent("openNotes", { section: "words" })} className="flex w-full items-center justify-between py-2 text-start text-note text-ink">
                  <span>{ui.homeTabVocab}</span>
                  <span aria-hidden className="text-caption text-slate-500 rtl:rotate-180">›</span>
                </button>
                {nodeRows(allNodes.filter((node) => PART_NODES.vocab.includes(node.id)))}
              </>
            ) : null}
            {part === "pronunciation" ? (
              <>
                {pronunciationNotes[String(shown)] ? <p dir="auto" className="py-2 text-note text-slate-200">{pronunciationNotes[String(shown)]}</p> : null}
                {nodeRows(allNodes.filter((node) => node.chapter === "script"))}
              </>
            ) : null}
            {canPractice(part) ? (
              <div className="flex justify-end py-2">
                <button type="button" onClick={() => practice(part)} className="rounded-lg border border-line px-3 py-1.5 text-caption text-slate-200 hover:bg-white/10">
                  {practiceLabel()}
                </button>
              </div>
            ) : null}
          </div>
        </>
      ) : (
        // 옛 서버: 문법 칸만(예전 틀).
        <div className="mt-1">{nodeRows(inStage(shown))}</div>
      )}

      {detail?.(shown)}
    </div>
  );
}

function NodeList({
  ui,
  nodes,
  stage,
  counts,
  nameOf,
  onOpen,
}: {
  ui: UICopy;
  nodes: NodeView[];
  stage: number;
  counts: Record<string, number>;
  nameOf: (id: string) => string;
  onOpen: (id: string) => void;
}) {
  // 짚인 칸이 위로(많은 순), 나머지는 자료 순서. 앞 단계 문법은 "이전 부분"에 접어 둔다.
  const order = (list: NodeView[]) =>
    [...list].sort((a, b) => (counts[b.id] ?? 0) - (counts[a.id] ?? 0));
  const now = order(nodes.filter((node) => node.chapter !== "grammar" || (node.stage ?? 1) >= stage));
  const earlier = order(nodes.filter((node) => node.chapter === "grammar" && (node.stage ?? 1) < stage));
  const row = (node: NodeView) => (
    <li key={node.id}>
      <button type="button" onClick={() => onOpen(node.id)} className="flex w-full items-center gap-3 py-2.5 text-start">
        <span className="min-w-0 flex-1">
          <span className="block text-note text-ink">{nameOf(node.id)}</span>
          {node.example ? (
            <span dir="auto" className="block truncate text-meta text-slate-500">
              {node.example}
            </span>
          ) : null}
        </span>
        <span className="w-7 shrink-0 text-end text-caption tabular-nums text-slate-400">{counts[node.id] || ""}</span>
      </button>
    </li>
  );
  return (
    <>
      <ul className="mt-2 divide-y divide-white/5">{now.map(row)}</ul>
      {earlier.length ? (
        <details className="mt-3">
          <summary className="cursor-pointer text-caption text-slate-400">
            {ui.notebookEarlier} · {earlier.length}
          </summary>
          <ul className="mt-1 divide-y divide-white/5">{earlier.map(row)}</ul>
        </details>
      ) : null}
    </>
  );
}

function MineList({
  ui,
  custom,
  counts,
  onOpen,
  edit,
}: {
  ui: UICopy;
  custom: CustomNode[];
  counts: Record<string, number>;
  onOpen: (id: string) => void;
  edit: (change: NotebookEdit) => Promise<void>;
}) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  return (
    <>
      <ul className="mt-2 divide-y divide-white/5">
        {custom.map((node) => (
          <li key={node.id}>
            <button type="button" onClick={() => onOpen(node.id)} className="flex w-full items-center gap-3 py-2.5 text-start">
              <span className="min-w-0 flex-1 text-note text-ink">{node.name}</span>
              <span className="w-7 shrink-0 text-end text-caption tabular-nums text-slate-400">{counts[node.id] || ""}</span>
            </button>
          </li>
        ))}
      </ul>
      {adding ? (
        <form
          className="mt-2 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (!name.trim()) return;
            void edit({ op: "addNode", id: newNodeId(), name: name.trim() });
            setName("");
            setAdding(false);
          }}
        >
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={40}
            aria-label={ui.notebookNodeName}
            placeholder={ui.notebookNodeName}
            autoFocus
            className="min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 py-2 text-note text-ink placeholder:text-slate-500"
          />
          <button type="submit" className="shrink-0 rounded-lg border border-line px-3 py-2 text-caption text-slate-200 hover:bg-white/10">
            {ui.notebookSave}
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="mt-2 rounded-lg border border-line px-3 py-1.5 text-caption text-slate-200 hover:bg-white/10"
        >
          {ui.notebookAddNode}
        </button>
      )}
    </>
  );
}

function NodeBody({
  ui,
  locale,
  id,
  name,
  view,
  memo,
  cards,
  onMove,
  onShot,
  edit,
  onTry,
  phrases = [],
  onMovePhrase,
  top,
  related,
  onJump,
}: {
  ui: UICopy;
  locale: string;
  id: string;
  name: string;
  onTry?: () => void;
  phrases?: PhraseView[];
  onMovePhrase?: (key: string) => void;
  top?: ReactNode;
  /** 이 문법이 나오는 대본·문장구조(CURRICULUM_ONLY, 2026-10-28 "대본에 붙이기"). */
  related?: RelatedItem[];
  onJump?: (stage: number, id: string) => void;
  view?: NodeView;
  memo: string;
  cards: FixCard[];
  onMove: (card: string) => void;
  onShot: (shotId: string) => void;
  edit: (change: NotebookEdit) => Promise<void>;
}) {
  const [renaming, setRenaming] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftMemo, setDraftMemo] = useState(memo);
  const custom = id.startsWith("c-");
  return (
    <div className="mt-2">
      {top}
      {view?.example ? (
        <p dir="auto" className="text-note text-slate-200">
          {view.example}
        </p>
      ) : null}
      {view?.note ? <p className="mt-1 text-caption text-slate-400">{view.note}</p> : null}
      {onTry ? (
        <button type="button" onClick={onTry} className="tb-btn mt-2 rounded-lg px-3 py-1.5 text-caption font-semibold">
          {ui.stageTry}
        </button>
      ) : null}

      {related?.length ? (
        <ul className="mt-3 flex flex-col gap-1.5">
          {related.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onJump?.(item.stage, item.id)}
                className="flex w-full items-center gap-2 rounded-xl border border-line px-3 py-2 text-start hover:bg-white/5"
              >
                <span className="shrink-0 text-meta text-slate-400">{item.kind === "frame" ? ui.amountFrames : ui.stageScriptsTitle}</span>
                <span dir="auto" className="min-w-0 flex-1 truncate text-note text-ink">
                  {item.label}
                </span>
                {item.passed ? <span className="shrink-0 text-caption text-good">✓</span> : null}
                <span aria-hidden className="shrink-0 text-caption text-slate-500 rtl:rotate-180">›</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {CURRICULUM_ONLY ? null : (
      <>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setRenaming((on) => !on)}
          className="rounded-lg border border-line px-2 py-1 text-caption text-slate-300 hover:bg-white/10"
        >
          {ui.notebookRename}
        </button>
        {custom ? (
          <button
            type="button"
            onClick={() => void edit({ op: "deleteNode", node: id })}
            className="rounded-lg border border-line px-2 py-1 text-caption text-slate-400 hover:bg-white/10"
          >
            {ui.notebookDelete}
          </button>
        ) : null}
      </div>
      {renaming ? (
        <form
          className="mt-2 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            void edit({ op: "renameNode", node: id, name: draftName.trim() });
            setRenaming(false);
          }}
        >
          <input
            value={draftName}
            onChange={(event) => setDraftName(event.target.value)}
            maxLength={40}
            aria-label={ui.notebookNodeName}
            autoFocus
            className="min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 py-2 text-note text-ink"
          />
          <button type="submit" className="shrink-0 rounded-lg border border-line px-3 py-2 text-caption text-slate-200 hover:bg-white/10">
            {ui.notebookSave}
          </button>
        </form>
      ) : null}

      <textarea
        value={draftMemo}
        onChange={(event) => setDraftMemo(event.target.value)}
        onBlur={() => {
          if (draftMemo.trim() !== memo.trim()) void edit({ op: "memoNode", node: id, memo: draftMemo });
        }}
        rows={2}
        maxLength={1000}
        aria-label={ui.notebookMemo}
        placeholder={ui.notebookMemo}
        dir="auto"
        className="mt-3 w-full resize-y rounded-lg border border-line bg-surface px-3 py-2 text-note text-ink placeholder:text-slate-500"
      />
      </>
      )}

      {phrases.length ? (
        <ul className="mt-3 space-y-1">
          {[...phrases]
            .sort((a, b) => (a.state === b.state ? 0 : a.state === "mastered" ? -1 : 1))
            .map((phrase) => (
              <li key={phrase.key} className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-1.5">
                <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${phrase.state === "mastered" ? "bg-status-mastered" : phrase.state === "learned" ? "bg-status-learned" : "bg-status-pending"}`} />
                <span dir="auto" className="min-w-0 flex-1 text-note text-ink">
                  {phrase.text}
                </span>
                {onMovePhrase && !CURRICULUM_ONLY ? (
                  <button type="button" onClick={() => onMovePhrase(phrase.key)} className="shrink-0 text-caption text-slate-400 hover:text-slate-200">
                    {ui.notebookMove}
                  </button>
                ) : null}
              </li>
            ))}
        </ul>
      ) : null}
      <CardList ui={ui} locale={locale} cards={cards} onMove={onMove} onShot={onShot} edit={edit} />
    </div>
  );
}

function CardList({
  ui,
  locale,
  cards,
  onMove,
  onShot,
  edit,
}: {
  ui: UICopy;
  locale: string;
  cards: FixCard[];
  onMove: (card: string) => void;
  onShot: (shotId: string) => void;
  edit: (change: NotebookEdit) => Promise<void>;
}) {
  const where: Record<FixCard["where"], string> = {
    chat: ui.homeTabChat,
    call: ui.homeTabCall,
    dm: ui.homeTabMessages,
    room: ui.homeTabRooms,
    video: ui.homeTabVideo,
  };
  if (!cards.length) return null;
  return (
    <ul className="mt-3 space-y-2">
      {cards.map((card) => (
        <FixCardRow key={card.id} ui={ui} locale={locale} card={card} where={where[card.where] ?? ""} onMove={onMove} onShot={onShot} edit={edit} />
      ))}
    </ul>
  );
}

function FixCardRow({
  ui,
  locale,
  card,
  where,
  onMove,
  onShot,
  edit,
}: {
  ui: UICopy;
  locale: string;
  card: FixCard;
  where: string;
  onMove: (card: string) => void;
  onShot: (shotId: string) => void;
  edit: (change: NotebookEdit) => Promise<void>;
}) {
  const [memoOpen, setMemoOpen] = useState(false);
  const [memo, setMemo] = useState(card.memo ?? "");
  return (
    <li className="rounded-lg bg-white/[0.04] px-3 py-2.5">
      {card.kind === "question" ? (
        // 궁금했던 장면: 고른 부분(크게) + 그 문장(사람 대화면 없음).
        <>
          <p dir="auto" className="flex gap-1.5 text-note font-semibold text-ink">
            <span aria-hidden className="shrink-0 text-info">❓</span>
            <span className="min-w-0">{card.right}</span>
          </p>
          {card.wrong && card.wrong.replace(/[\s.!?。！？]+$/u, "") !== card.right.replace(/[\s.!?。！？]+$/u, "") ? (
            <p dir="auto" className="mt-0.5 ps-5 text-caption text-slate-400">
              {card.wrong}
            </p>
          ) : null}
        </>
      ) : (
        <>
          <p dir="auto" className="flex gap-1.5 text-note text-slate-400">
            <span aria-hidden className="shrink-0 text-rose-300">✗</span>
            <span className="min-w-0 line-through decoration-rose-300/60">{card.wrong}</span>
          </p>
          <p dir="auto" className="mt-0.5 flex gap-1.5 text-note text-ink">
            <span aria-hidden className="shrink-0 text-emerald-300">✓</span>
            <span className="min-w-0">{card.right}</span>
          </p>
        </>
      )}
      {card.note ? (
        <p dir="auto" className="mt-1 text-caption text-slate-300">
          {card.note}
        </p>
      ) : null}
      {card.memo && !memoOpen ? (
        <p dir="auto" className="mt-1 whitespace-pre-line text-caption text-amber-100/90">
          {card.memo}
        </p>
      ) : null}
      {card.suggest && !card.node && !CURRICULUM_ONLY ? (
        <button
          type="button"
          onClick={() => void edit({ op: "acceptSuggest", card: card.id, id: newNodeId() })}
          className="mt-1.5 rounded-lg border border-line px-2 py-0.5 text-caption text-slate-200 hover:bg-white/10"
        >
          {ui.notebookSuggest.replace("{name}", card.suggest)} · {ui.notebookMake}
        </button>
      ) : null}
      {memoOpen ? (
        <form
          className="mt-1.5"
          onSubmit={(event) => {
            event.preventDefault();
            void edit({ op: "memoCard", card: card.id, memo });
            setMemoOpen(false);
          }}
        >
          <textarea
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
            rows={2}
            maxLength={1000}
            aria-label={ui.notebookMemo}
            dir="auto"
            autoFocus
            className="w-full resize-y rounded-lg border border-line bg-surface px-3 py-2 text-note text-ink"
          />
          <button type="submit" className="mt-1 rounded-lg border border-line px-2 py-1 text-caption text-slate-200 hover:bg-white/10">
            {ui.notebookSave}
          </button>
        </form>
      ) : null}
      <div className="mt-1.5 flex items-center gap-2 text-meta text-slate-500">
        <span className="min-w-0 flex-1 truncate">
          {where} · {when(card.at, locale)}
        </span>
        {card.shotId ? (
          <button type="button" onClick={() => onShot(card.shotId!)} className="shrink-0 hover:text-slate-300">
            {ui.notebookScreen}
          </button>
        ) : null}
        {CURRICULUM_ONLY ? null : (
          <>
            <button type="button" onClick={() => onMove(card.id)} className="shrink-0 hover:text-slate-300">
              {ui.notebookMove}
            </button>
            <button type="button" onClick={() => setMemoOpen((on) => !on)} className="shrink-0 hover:text-slate-300">
              {ui.notebookMemo}
            </button>
          </>
        )}
        <button type="button" onClick={() => void edit({ op: "deleteCard", card: card.id })} className="shrink-0 hover:text-slate-300">
          {ui.notebookDelete}
        </button>
      </div>
    </li>
  );
}

function PickList({
  ui,
  language,
  cards,
  nameOf,
  onCommit,
}: {
  ui: UICopy;
  language: string;
  cards: FixCard[];
  nameOf: (id: string | null) => string;
  onCommit: (ids: string[], shots: Record<string, string>) => Promise<void>;
}) {
  const [picked, setPicked] = useState<Set<string>>(() => new Set(cards.filter(picksByDefault).map((card) => card.id)));
  const [withShot, setWithShot] = useState<Set<string>>(() => new Set());
  const [shots, setShots] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  // 이 기기에 찍어 둔 화면이 있는 줄만 "화면 함께"를 보인다.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const found: Record<string, string> = {};
      for (const card of cards) {
        const image = await sceneShotFor(language, card.wrong);
        if (image) found[card.id] = image;
      }
      if (!cancelled) setShots(found);
    })();
    return () => {
      cancelled = true;
    };
  }, [cards, language]);

  const toggle = (set: Set<string>, id: string) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  };
  // 칸별로 묶고, 많이 짚인 칸이 위로.
  const groups = new Map<string, FixCard[]>();
  for (const card of cards) {
    const key = card.node ?? "";
    groups.set(key, [...(groups.get(key) ?? []), card]);
  }
  const ordered = [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
  const tag = (card: FixCard) =>
    [card.again ? ui.notebookAgain : "", card.kind === "typo" ? ui.notebookTypo : "", card.kind === "meant" ? ui.notebookMeant : ""].filter(Boolean);

  return (
    <div className="mt-2">
      {ordered.map(([node, list]) => (
        <section key={node || "loose"} className="mt-3 first:mt-0">
          <p className="text-meta font-semibold tracking-wide text-slate-500">{nameOf(node || null)}</p>
          <ul className="mt-1 space-y-1.5">
            {list.map((card) => (
              <li key={card.id} className="rounded-lg bg-white/[0.04] px-3 py-2">
                <label className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={picked.has(card.id)}
                    onChange={() => setPicked((set) => toggle(set, card.id))}
                    className="mt-1 h-4 w-4 shrink-0 accent-violet-400"
                  />
                  <span className="min-w-0 flex-1">
                    <span dir="auto" className="block text-note text-slate-400 line-through decoration-rose-300/60">
                      {card.wrong}
                    </span>
                    <span dir="auto" className="block text-note text-ink">
                      {card.right}
                    </span>
                    {card.note ? (
                      <span dir="auto" className="mt-0.5 block text-caption text-slate-300">
                        {card.note}
                      </span>
                    ) : null}
                    {tag(card).length ? (
                      <span className="mt-1 flex flex-wrap gap-1">
                        {tag(card).map((label) => (
                          <span key={label} className="rounded-lg bg-white/10 px-1.5 py-0.5 text-meta text-slate-300">
                            {label}
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </span>
                </label>
                {shots[card.id] && picked.has(card.id) ? (
                  <label className="mt-1.5 flex items-center gap-2 ps-6 text-caption text-slate-300">
                    <input
                      type="checkbox"
                      checked={withShot.has(card.id)}
                      onChange={() => setWithShot((set) => toggle(set, card.id))}
                      className="h-3.5 w-3.5 accent-sky-400"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={shots[card.id]} alt="" className="h-10 w-auto rounded-lg border border-line" />
                    <span>{ui.notebookWithScreen}</span>
                  </label>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ))}
      <button
        type="button"
        disabled={busy || picked.size === 0}
        onClick={async () => {
          setBusy(true);
          const ids = cards.filter((card) => picked.has(card.id)).map((card) => card.id);
          const attach = Object.fromEntries(ids.filter((id) => withShot.has(id) && shots[id]).map((id) => [id, shots[id]!]));
          await onCommit(ids, attach);
          setBusy(false);
        }}
        className="tb-btn mt-4 w-full rounded-lg px-3 py-2 text-note font-semibold disabled:opacity-40"
      >
        {ui.notebookAddToNotes} · {picked.size}
      </button>
    </div>
  );
}

function ShotSheet({
  ui,
  language,
  isPremium,
  shotId,
  onClose,
}: {
  ui: UICopy;
  language: string;
  isPremium: boolean;
  shotId: string;
  onClose: () => void;
}) {
  const [image, setImage] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch(apiUrl(`/api/notebook?lang=${encodeURIComponent(language)}&shot=${encodeURIComponent(shotId)}`), { headers: entitlementHeaders(isPremium) })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: { image?: string } | null) => {
        if (!cancelled && body?.image) setImage(body.image);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [language, isPremium, shotId]);
  return (
    <Sheet ui={ui} title={ui.notebookScreen} onClose={onClose}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {image ? <img src={image} alt="" className="mt-2 w-full rounded-lg border border-line" /> : null}
    </Sheet>
  );
}

function Sheet({ ui, title, onClose, children }: { ui: UICopy; title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <BodyLayer>
      <div className="fixed inset-0 z-[80] flex flex-col justify-end bg-black/60 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))] sm:items-center sm:justify-center">
        <button type="button" className="absolute inset-0 cursor-default" aria-label={ui.billingClose} onClick={onClose} />
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="relative z-10 max-h-full w-full max-w-md overflow-y-auto overscroll-contain rounded-2xl border border-line bg-surface-sunk p-4"
        >
          <div className="flex items-start gap-2">
            <h3 className="min-w-0 flex-1 text-title font-semibold text-ink">{title}</h3>
            <button type="button" onClick={onClose} aria-label={ui.billingClose} className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10">
              ✕
            </button>
          </div>
          {children}
        </div>
      </div>
    </BodyLayer>
  );
}

function newCardIdClient(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** 궁금한 장면 넣기: 고른 부분·문장·한 줄 설명, 그 순간 화면(있으면 "화면 함께"). */
function QuestionBox({
  ui,
  question,
  onAdd,
  onClose,
}: {
  ui: UICopy;
  question: LocateHandoff;
  onAdd: (withShot: boolean) => void;
  onClose: () => void;
}) {
  const [withShot, setWithShot] = useState(Boolean(question.shot));
  const [busy, setBusy] = useState(false);
  return (
    <div className="mb-3 mt-2 rounded-xl border border-info/40 bg-info/10 p-3">
      <div className="flex items-start gap-2">
        <p dir="auto" className="min-w-0 flex-1 text-note font-semibold text-ink">
          ❓ {question.text}
        </p>
        <button type="button" onClick={onClose} aria-label={ui.insightClose} className="shrink-0 rounded-lg px-1.5 text-caption text-slate-400 hover:bg-white/10">
          ✕
        </button>
      </div>
      {question.sentence && question.sentence !== question.text ? (
        <p dir="auto" className="mt-0.5 text-caption text-slate-400">
          {question.sentence}
        </p>
      ) : null}
      {question.note ? (
        <p dir="auto" className="mt-1 text-caption text-slate-200">
          {question.note}
        </p>
      ) : null}
      {question.shot ? (
        <label className="mt-2 flex items-center gap-2 text-caption text-slate-300">
          <input type="checkbox" checked={withShot} onChange={() => setWithShot((on) => !on)} className="h-3.5 w-3.5 accent-sky-400" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={question.shot} alt="" className="h-14 w-auto rounded-lg border border-line" />
          <span>{ui.notebookWithScreen}</span>
        </label>
      ) : null}
      <button
        type="button"
        disabled={busy}
        onClick={() => {
          setBusy(true);
          onAdd(withShot);
        }}
        className="tb-btn mt-2 w-full rounded-lg px-3 py-2 text-note font-semibold disabled:opacity-50"
      >
        {ui.notebookQuestionAdd}
      </button>
    </div>
  );
}

/**
 * "다음 단계로" 앞의 단계 시험(curriculum/stageTest.ts): 넘으면 결과의 [다음 단계로 ›]가 예전 흐름(단계 고르기)으로, 못 넘으면 닫기만 —
 * 그 단계에서 틀린 것은 다시 볼 것으로 가고, 같은 날 다시 누르면 시험 대신 그 결과를 보인다.
 */
function StageTestGate({
  ui,
  locale,
  language,
  stage,
  checkups,
  labelOf,
  onFinish,
  onNext,
  onClose,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  stage: number;
  checkups: readonly CheckResult[];
  labelOf: (key: string) => string;
  onFinish: (result: CheckResult) => void;
  onNext: () => void;
  onClose: () => void;
}) {
  const [opened] = useState(() => Date.now());
  const failed = useMemo(() => failedToday(checkups, stage, opened), [checkups, stage, opened]);
  const [shown] = useState<CheckResult | null>(failed);
  // 연 때의 문제로 고정(모두의 문제 통계로 가르는 문제 먼저, curriculum/itemStats.ts — 단계 보기가 미리 받아 둠).
  const [items] = useState(() => (shown ? [] : buildStageTest({ language, stage, now: opened, stats: peekItemStats(language) })));
  const previous = [...checkups].reverse().find((result) => result.kind && result !== shown) ?? null;
  return (
    <CheckupPlayer
      ui={ui}
      locale={locale}
      language={language}
      stage={stage}
      items={items}
      result={shown}
      previous={previous}
      title={`${ui.placementTitle} · ${ui.stageNumber.replace("{n}", String(stage))}`}
      finishWith={(answers) => stageTestResult(items, answers, stage)}
      heading={(result) => (result.passed ? ui.stageTestPassed.replace("{n}", String(result.stage)) : undefined)}
      actions={(result) =>
        result.passed ? (
          <button type="button" data-stage-next onClick={onNext} className="self-center rounded-full bg-status-learned px-5 py-1.5 text-caption font-semibold text-black">
            {ui.partReady} ›
          </button>
        ) : undefined
      }
      labelOf={labelOf}
      onFinish={onFinish}
      onClose={onClose}
    />
  );
}

/**
 * My 맨 위 한 줄(2026-10-29 사용자 "정해진 학습으로 뼈대 → 지속 학습으로 채우고 → AI·사용자 간 학습으로 적용"):
 * 지금 단계와 다음 단계까지의 몫(잰 갈래 평균, My 안 재료만 — notes/myParts.ts) + 네 갈래 막대.
 */
/**
 * My 맨 위(2026-10-29 사용자 "정해진 데이터 중 얼마나 학습했다" → "진행해줘", lib/notes/skeletonTotals.ts):
 * 지금 단계 · 다음 단계까지 n개, 그 아래 갈래마다 이미 앎 / 그 언어 뼈대 전체(배우는 중은 옅게), 뼈대 밖은 한 줄.
 */
function SkeletonProgress({
  ui,
  language,
  stage,
  row,
  known,
  passed,
  free,
  onMode,
  extra,
  views,
}: {
  ui: UICopy;
  language: string;
  stage: number;
  row: StageParts | null;
  known: KnownMap;
  passed: readonly string[];
  free: boolean;
  onMode: (mode: StudyMode) => void;
  /** 시트 아래에 같이 — 말한 문장·할 수 있는 일(ScriptAmount inside). */
  extra?: ReactNode;
  /** 시트 안 보기 [막대 | 망 | 그래프](예전 My 맨 위 토글). */
  views?: (mode: "net" | "graph") => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [look, setLook] = useState<"bars" | "net" | "graph">("bars");
  const passedKey = passed.join("|");
  const totals = useMemo(() => skeletonTotals(language, { known, passed: new Set(passedKey.split("|")) }), [language, known, passedKey]);
  const left = row ? toNextStage(row.parts, STAGE_DONE_SHARE) : 0;
  const label = partLabels(ui);
  // 진척은 My 안 한 곳(2026-10-29 사용자 "이미 앎·할 수 있는 일을 매번 보여 주지 말고 My 탭 안에 하나로"): 한 줄 → 누르면 시트에 전부.
  return (
    <>
      <button
        type="button"
        data-my-progress-open
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-xl border border-line px-3 py-2 text-start hover:bg-white/5"
      >
        <span aria-hidden className="shrink-0 text-caption">📊</span>
        <span className="min-w-0 flex-1 truncate text-note text-ink">{ui.myProgressTitle}</span>
        <span aria-hidden className="shrink-0 text-caption text-slate-500 rtl:rotate-180">›</span>
      </button>
      {open ? (
        <BodyLayer>
          <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 sm:items-center" onClick={() => setOpen(false)}>
            <div
              role="dialog"
              aria-modal="true"
              data-my-progress-sheet
              onClick={(event) => event.stopPropagation()}
              className="flex max-h-[85vh] w-full max-w-md flex-col overflow-y-auto rounded-t-2xl border border-line bg-surface p-4 sm:rounded-2xl"
            >
              <div className="flex items-center gap-2">
                <h3 className="min-w-0 flex-1 text-note font-semibold text-ink">{ui.myProgressTitle}</h3>
                <button type="button" aria-label={ui.billingClose} onClick={() => setOpen(false)} className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10">
                  ✕
                </button>
              </div>
    <div data-my-progress className="mt-3 flex flex-col gap-1.5 px-1">
      <div className="flex items-center gap-2">
        {free ? null : <span className="text-note font-semibold text-ink">{ui.stageNumber.replace("{n}", String(stage))}</span>}
        {!free && left > 0 ? <span className="min-w-0 truncate text-meta tabular-nums text-slate-400">{ui.toNextStage.replace("{n}", String(left))}</span> : null}
        <span role="group" data-study-mode className="ms-auto flex shrink-0 gap-0.5 rounded-full border border-line p-0.5">
          {(["staged", "free"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              aria-pressed={(mode === "free") === free}
              onClick={() => onMode(mode)}
              className={`rounded-full px-2.5 py-0.5 text-meta ${(mode === "free") === free ? "bg-white/15 text-ink" : "text-slate-400 hover:bg-white/10"}`}
            >
              {mode === "free" ? ui.modeFree : ui.modeStaged}
            </button>
          ))}
        </span>
      </div>
      {views ? (
        <span role="group" data-progress-look className="flex gap-1.5">
          {(["bars", "net", "graph"] as const).map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={look === id}
              onClick={() => setLook(id)}
              className={`rounded-full px-2.5 py-0.5 text-meta ${look === id ? "bg-white/15 text-ink" : "text-slate-400 hover:bg-white/10"}`}
            >
              {id === "bars" ? ui.skillViewList : id === "net" ? ui.myViewNet : ui.myViewGraph}
            </button>
          ))}
        </span>
      ) : null}
      {look !== "bars" && views ? views(look) : null}
      {look === "bars" ? skeletonView(totals).map((part) => (
        <div key={part.id} data-total-part={part.id} className="flex items-center gap-2">
          <span className="w-14 shrink-0 truncate text-caption text-slate-300">{label[part.id]}</span>
          <span className="relative h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white/10">
            <span className="absolute inset-y-0 start-0 rounded-full bg-status-learned/35" style={{ width: `${Math.round(((part.known + part.learning) / part.total) * 100)}%` }} />
            <span className="absolute inset-y-0 start-0 rounded-full bg-status-learned" style={{ width: `${Math.round((part.known / part.total) * 100)}%` }} />
          </span>
          <span dir="ltr" className="shrink-0 text-caption tabular-nums text-ink">
            {part.known} / {part.total}
          </span>
          {part.learning ? <span className="shrink-0 text-meta tabular-nums text-slate-500">{ui.totalsLearning.replace("{n}", String(part.learning))}</span> : null}
        </div>
      )) : null}
      {totals.outside.known + totals.outside.learning > 0 ? (
        <p className="text-meta tabular-nums text-slate-500">{ui.totalsOutside.replace("{n}", String(totals.outside.known + totals.outside.learning))}</p>
      ) : null}
    </div>
              {extra}
            </div>
          </div>
        </BodyLayer>
      ) : null}
    </>
  );
}



type LayerPart = { summary: ReactNode; body: ReactNode };
type PlanParts = { today: LayerPart; keep: LayerPart; overlays: ReactNode };

/**
 * My 큰 칸 셋(2026-10-30 사용자 "큰 층위 하나만 보이게 하고 나머지는 그 층위 아래로 — 모든 기능이 같은 층위로 나열된 게 문제"):
 * 오늘 할 것(오늘 목록, 설정은 접힘) · n단계(내 진척, 사다리, 방식 칩 [상황 | 표현·문법 | 문장구조], 다음 단계 조건) · 복습(계속 공부·단어장·시험·틀린 줄).
 * 한 번에 하나만 펼친다. 퀴즈·시험 화면(overlays)은 칸이 접혀도 떠 있어야 해서 따로.
 */
function MyLayers({
  ui,
  open,
  onOpen,
  today,
  plan,
  stage,
  weak,
}: {
  ui: UICopy;
  language: string;
  open: MyLayer | null;
  onOpen: (layer: MyLayer | null) => void;
  /** 0단계 글자 묶음일 때 오늘 할 것 자리(TodayPlan 없음). */
  today: LayerPart | null;
  plan: ((render: (parts: PlanParts) => ReactNode) => ReactNode) | null;
  stage: LayerPart & { title: string };
  weak: ReactNode;
}) {
  const card = (id: MyLayer, title: string, summary: ReactNode, body: ReactNode) => {
    const on = open === id;
    return (
      <section key={id} data-my-layer={id} className={`mt-3 rounded-2xl border ${on ? "border-status-learned/40 bg-status-learned/[0.04]" : "border-line"}`}>
        <button
          type="button"
          aria-expanded={on}
          onClick={() => onOpen(on ? null : id)}
          className="flex w-full items-center gap-2 px-3 py-3 text-start"
        >
          <h3 className={`min-w-0 flex-1 truncate text-note font-semibold ${on ? "text-status-learned" : "text-ink"}`}>{title}</h3>
          {summary ? <span className="shrink-0 text-caption text-slate-400">{summary}</span> : null}
          <span aria-hidden className={`shrink-0 text-caption text-slate-500 transition-transform ${on ? "rotate-90" : "rtl:rotate-180"}`}>›</span>
        </button>
        {on ? <div className="px-3 pb-3">{body}</div> : null}
      </section>
    );
  };
  const draw = (parts?: PlanParts) => {
    const first = parts?.today ?? today;
    return (
      <>
        {first ? card("today", ui.planTitle, first.summary, first.body) : null}
        {card("stage", stage.title, stage.summary, stage.body)}
        {parts || weak ? card("review", ui.keepTitle, parts?.keep.summary ?? null, (
          <>
            {parts?.keep.body}
            {weak}
          </>
        )) : null}
        {parts?.overlays}
      </>
    );
  };
  return <>{plan ? plan(draw) : draw()}</>;
}
