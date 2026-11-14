"use client";

import { QUIZ_FOCUS_EVENT } from "@/lib/curriculum/quizFocus";
import { LanguageBank } from "@/components/studyMap/LanguageBank";
import { noteSpot, takeSpotPart } from "@/lib/resumeSpot";
import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { BankToneProvider } from "@/components/studyMap/bankTone";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { UICopy } from "@/lib/copy";
import type { CustomNode, FixCard } from "@/lib/notes/notebook";
import type { LogItem, StageParts } from "@/lib/notes/stageParts";
import { onAppIntent } from "@/lib/appIntents";
import type { RedoItem } from "@/lib/curriculum/frameRedo";
import { useScriptPack } from "@/lib/curriculum/useScriptPack";
import type { ReviewMap } from "@/lib/curriculum/dailyPlan";
import { Quizbank } from "@/components/studyMap/Quizbank";
import { needsLetters, useLettersFirst } from "@/lib/curriculum/lettersFirst";
import { LettersBank, LettersRow } from "@/components/studyMap/ScriptPractice";
import { LETTERS_OPEN_EVENT, peekLettersOpen } from "@/lib/curriculum/lettersOpen";
import { useItemStats } from "@/lib/curriculum/useItemStats";
import { TodayCards } from "@/components/studyMap/TodayCards";
import { Logbank } from "@/components/studyMap/Logbank";
import { BankHelpButton } from "@/components/studyMap/BankHelp";
import { scheduleMorning } from "@/lib/morningNotify";

/**
 * My 칸 셋 [Logbank · Quizbank · Languagebank] — 위 칸 이름 줄이 탭, 누른 칸 하나만 제자리에, 칸을 누르면 전체 화면.
 * Logbank = 오늘 카드·배운 것·학습 타임라인, Quizbank = 한 흐름 퀴즈(TodayPlan), Languagebank = 사전(+ 글자가 다른 언어면 글자·소리 칸).
 * 재료는 /api/notebook(단계·문법 칸 이름·고친 줄·Logbank 기록). 칸 이름·흐름은 hub/app/STRUCTURE.md "My".
 */

type NodeView = { id: string; chapter: string; stage?: number; index?: number; name: string };
type Book = {
  stage: number;
  nodes: NodeView[];
  custom: CustomNode[];
  renames: Record<string, string>;
  cards: FixCard[];
  stages: { order: number; title: string }[];
  parts?: StageParts[];
  logItems?: LogItem[];
  redo?: RedoItem[];
  review?: ReviewMap;
};
const NO_REVIEW: ReviewMap = {};

type MyLayer = "log" | "keep" | "lang";
const ORDER_WITH_QUIZ: MyLayer[] = ["log", "keep", "lang"];
const ORDER_LETTERS: MyLayer[] = ["log", "lang"];

/** 탭을 바꾸면 이름 줄이 보이게 My 맨 위로(긴 칸을 내려 본 채 바꿨을 때). */
function scrollToTabs() {
  window.setTimeout(() => {
    const bar = document.querySelector("[data-my-jump]");
    if (bar && bar.getBoundingClientRect().top < 0) bar.scrollIntoView({ block: "start", behavior: "smooth" });
  }, 30);
}

export function NotebookSection({
  ui,
  locale,
  language,
  isPremium,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  isPremium: boolean;
}) {
  // 앱에 없는 학습 언어의 문장구조·대본 자료는 서버에서(퀴즈 재료).
  useScriptPack(language);
  useItemStats(language);
  const [book, setBook] = useState<Book | null>(null);
  // 첫 칸은 Logbank — 통화 끝 숙제 "글자·소리"로 들어왔으면 Languagebank(그 칸이 글자 칸을 연다, lettersOpen.ts).
  const [tab, setTab] = useState<MyLayer>(() => (peekLettersOpen(language) ? "lang" : "log"));
  const openLayer = (next: MyLayer) => {
    setTab(next);
    scrollToTabs();
  };
  // 오늘 카드(Logbank)를 누르면 Quizbank로 — 그 판의 열쇠는 Quizbank가 가져감(curriculum/quizFocus.ts).
  // 글자·소리 칸(Languagebank 안)을 여는 신호 — 오늘 카드(0단계)·통화 숙제.
  useEffect(() => {
    const quiz = () => setTab("keep");
    const letters = () => setTab("lang");
    window.addEventListener(QUIZ_FOCUS_EVENT, quiz);
    window.addEventListener(LETTERS_OPEN_EVENT, letters);
    return () => {
      window.removeEventListener(QUIZ_FOCUS_EVENT, quiz);
      window.removeEventListener(LETTERS_OPEN_EVENT, letters);
    };
  }, []);
  // 단어장 열기 신호(openNotes words·?screen=vocab) → Quizbank.
  useEffect(() => onAppIntent("openNotes", () => setTab("keep")), []);
  // 0단계 — 글자·소리(curriculum/lettersFirst.ts): 글자가 다른 학습 언어에서 글자부터 고르면 Quizbank 대신 글자 칸.
  const [lettersFlag, setLetters] = useLettersFirst(language);
  const lettersOn = lettersFlag && needsLetters(language);
  // 예전 아침 알림(Stagebank ⚙에서 켜던 것)은 개편에 켜고 끌 곳이 없어 걸어 둔 것을 지운다(2026-11-09).
  useEffect(() => {
    void scheduleMorning([], ui.morningSetting);
  }, [ui.morningSetting]);

  useEffect(() => {
    let cancelled = false;
    fetch(apiUrl(`/api/notebook?lang=${encodeURIComponent(language)}&ui=${encodeURIComponent(locale)}&scripts=1&logDays=366`), {
      headers: entitlementHeaders(isPremium),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: Book | null) => {
        if (!cancelled && body?.nodes) setBook({ ...body, stages: body.stages ?? [], custom: body.custom ?? [], renames: body.renames ?? {}, cards: body.cards ?? [] });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [language, locale, isPremium]);

  if (!book || !book.stages.length) return null;
  const nameOf = (id: string) => book.custom.find((node) => node.id === id)?.name ?? book.renames[id] ?? book.nodes.find((node) => node.id === id)?.name ?? "";
  const grammarName = (stage: number, index: number) => {
    const node = book.nodes.find((one) => one.chapter === "grammar" && one.stage === stage && one.index === index);
    return node ? nameOf(node.id) : "";
  };
  return (
    <>
    <div className="mb-4">
      <TodayCards ui={ui} language={language} locale={locale} grammarName={grammarName} />
    </div>
    <MyLayers
      ui={ui}
      language={language}
      locale={locale}
      tab={tab}
      onOpen={openLayer}
      languagebank={
        <LanguageBank
          ui={ui}
          language={language}
          locale={locale}
          stage={book.stage}
          letters={
            needsLetters(language)
              ? {
                  row: (open) => <LettersRow ui={ui} targetLanguage={language} locale={locale} isPremium={isPremium} onOpen={open} />,
                  body: <LettersBank ui={ui} targetLanguage={language} locale={locale} isPremium={isPremium} onDone={lettersOn ? () => setLetters(false) : undefined} />,
                }
              : undefined
          }
        />
      }
      plan={
        !lettersOn && book.parts?.some((row) => row.scripts)
          ? (render) => (
              <Quizbank
                ui={ui}
                locale={locale}
                language={language}
                stage={book.stage}
                review={book.review ?? NO_REVIEW}
                redo={(book.redo ?? []).map((item) => ({ frame: item.frame, card: { wrong: item.card.wrong, right: item.card.right, note: item.card.note } }))}
                cards={book.cards}
              >
                {render}
              </Quizbank>
            )
          : null
      }
      logbank={(head) => <Logbank ui={ui} locale={locale} language={language} items={book.logItems ?? []} nodeName={nameOf} grammarName={grammarName} head={head} />}
    />
    </>
  );
}

type LayerPart = { summary: ReactNode; body: ReactNode };
type PlanParts = { keep: LayerPart; review: LayerPart; overlays: ReactNode };

/** 칸마다 다른 색 — 펼친 칸의 테두리·바탕·제목, 고르지 않은 이름 버튼도 그 칸 색. hub/app/DESIGN.md "My 큰 칸 색". */
const LAYER_TONE: Record<MyLayer, { box: string; title: string; dim: string }> = {
  keep: { box: "border-good/40 bg-good/[0.04]", title: "text-good", dim: "border-good/20 text-good/70" },
  log: { box: "border-info/40 bg-info/[0.04]", title: "text-info", dim: "border-info/20 text-info/70" },
  lang: { box: "border-status-learned/40 bg-status-learned/[0.04]", title: "text-status-learned", dim: "border-status-learned/20 text-status-learned/70" },
};

/** 칸 이름 줄 = 탭. 누르면 그 칸 하나만 아래에. 전체 화면 위에도 같은 줄 + ✕. */
function LayerJump({
  items,
  onJump,
  active,
  onClose,
  closeLabel,
  help,
}: {
  items: { id: MyLayer; title: string }[];
  onJump: (id: MyLayer) => void;
  active: MyLayer;
  /** 전체 화면일 때 ✕. */
  onClose?: () => void;
  closeLabel?: string;
  /** 전체 화면에서 그 칸의 "?". */
  help?: ReactNode;
}) {
  return (
    <nav
      data-my-jump
      role="tablist"
      className={onClose ? "flex shrink-0 gap-1.5 border-b border-line px-3 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]" : "sticky -top-4 z-10 -mx-1 flex gap-1.5 bg-surface px-1 pb-2 pt-3"}
    >
      {items.map((one) => (
        <button
          key={one.id}
          type="button"
          role="tab"
          data-my-jump-to={one.id}
          aria-selected={active === one.id}
          aria-current={active === one.id ? "true" : undefined}
          dir="auto"
          onClick={() => onJump(one.id)}
          className={`min-w-0 flex-auto truncate rounded-full border px-2.5 py-1.5 text-caption font-semibold ${active === one.id ? `${LAYER_TONE[one.id].box} ${LAYER_TONE[one.id].title}` : `${LAYER_TONE[one.id].dim} hover:bg-white/5`}`}
        >
          {one.title}
        </button>
      ))}
      {help ? <div className="flex shrink-0 items-center">{help}</div> : null}
      {onClose ? (
        <button type="button" data-my-full-close aria-label={closeLabel} title={closeLabel} onClick={onClose} className="shrink-0 rounded-full px-2 py-1.5 text-caption text-slate-400 hover:bg-white/10">
          ✕
        </button>
      ) : null}
    </nav>
  );
}

function MyLayers({
  ui,
  language,
  locale,
  tab,
  onOpen,
  languagebank,
  plan,
  logbank,
}: {
  ui: UICopy;
  language: string;
  locale: string;
  /** 지금 보는 탭(위 칸 이름 줄). */
  tab: MyLayer;
  onOpen: (layer: MyLayer) => void;
  languagebank: ReactNode;
  /** Quizbank — 0단계 글자 묶음이면 없음(칸 둘). */
  plan: ((render: (parts: PlanParts) => ReactNode) => ReactNode) | null;
  /** Logbank 칸 안(머리 아이콘을 받아서). */
  logbank: (head: ReactNode) => ReactNode;
}) {
  // 탭을 누르면 그 칸이 제자리에 작게, 그 칸을 누르면 전체 화면 — 안에서 탭을 누르면 칸만 바뀜, ✕로 제자리.
  const [full, setFull] = useState(false);
  // 앱을 나갔다 다시 켜면 마지막 칸·전체 화면으로(lib/resumeSpot.ts). 예전 Stagebank 자리("stage")는 Languagebank로.
  useEffect(() => {
    const my = takeSpotPart("my");
    if (!my) return;
    if (my.bank === "keep" || my.bank === "log") onOpen(my.bank);
    else if (my.bank === "stage" || my.bank === "lang") onOpen("lang");
    if (my.full) setFull(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    noteSpot({ my: { bank: tab, full } });
  }, [tab, full]);
  /** 작은 칸 안을 누르면 전체 화면 — 버튼·입력칸 같은 조작은 그대로, 칸 밖 층(시트)에서 올라온 누름은 빼고. */
  const enlargeOnTap = (event: MouseEvent<HTMLElement>) => {
    const target = event.target as Element | null;
    if (!target || !event.currentTarget.contains(target)) return;
    if (target.closest("button, a, input, textarea, select, label, summary, [role=button], [role=tab], [role=radio], [role=checkbox], [role=switch], [contenteditable=true], [data-no-enlarge]")) return;
    setFull(true);
  };
  const draw = (parts?: PlanParts) => {
    const order = parts ? ORDER_WITH_QUIZ : ORDER_LETTERS;
    const shown: MyLayer = order.includes(tab) ? tab : "lang";
    const titleOf = (id: MyLayer) => (id === "keep" ? ui.keepTitle : id === "lang" ? ui.languagebankTitle : ui.logbankTitle);
    const help = (id: MyLayer) => (id === "lang" ? null : <BankHelpButton ui={ui} locale={locale} language={language} bank={id} title={titleOf(id)} />);
    const bodyOf = (id: MyLayer): { summary: ReactNode; body: ReactNode } =>
      id === "keep" && parts ? parts.keep : id === "log" ? { summary: null, body: logbank(parts?.review.body ?? null) } : { summary: null, body: languagebank };
    const { summary, body } = bodyOf(shown);
    // 칸 안의 강조색도 그 칸 색(studyMap/bankTone.tsx).
    const toned = <BankToneProvider tone={shown === "lang" ? "stage" : shown}>{body}</BankToneProvider>;
    const items = order.map((id) => ({ id, title: titleOf(id) }));
    const pressTab = (id: MyLayer) => {
      if (id !== shown) onOpen(id);
    };
    if (full)
      return (
        <>
          <FullScreenLayer>
            <LayerJump items={items} onJump={pressTab} active={shown} onClose={() => setFull(false)} closeLabel={ui.billingClose} help={help(shown) ?? undefined} />
            <div className="min-h-0 flex-1 overflow-y-auto">
              <div key={shown} data-my-layer={shown} data-my-full className="px-3 pb-6 pt-3">
                {toned}
              </div>
            </div>
          </FullScreenLayer>
          {parts?.overlays}
        </>
      );
    return (
      <>
        <LayerJump items={items} onJump={pressTab} active={shown} />
        <section key={shown} data-my-layer={shown} onClick={enlargeOnTap} className={`mt-3 scroll-mt-14 rounded-2xl border ${LAYER_TONE[shown].box}`}>
          <div className="flex items-center gap-2 pe-3">
            <button type="button" data-my-enlarge aria-label={`${titleOf(shown)} · ${ui.videoLearnFullscreen}`} onClick={() => setFull(true)} className="flex min-w-0 flex-1 items-center gap-2 py-3 ps-3 text-start">
              <h3 className={`min-w-0 flex-1 truncate text-note font-semibold ${LAYER_TONE[shown].title}`}>{titleOf(shown)}</h3>
              {summary ? <span className="shrink-0 text-caption text-slate-400">{summary}</span> : null}
              <span aria-hidden className="shrink-0 text-caption text-slate-500">⤢</span>
            </button>
            {help(shown)}
          </div>
          <div className="px-3 pb-3">{toned}</div>
        </section>
        {parts?.overlays}
      </>
    );
  };
  return <>{plan ? plan(draw) : draw()}</>;
}
