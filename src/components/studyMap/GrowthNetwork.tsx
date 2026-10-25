"use client";

import { useEffect, useState, type ReactNode } from "react";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { UICopy } from "@/lib/copy";
import type { ElementId } from "@/lib/learner/growth";
import { onLocate } from "@/lib/notes/locateHandoff";
import { sendAppIntent } from "@/lib/appIntents";
import { GAP_STEP } from "@/lib/learner/next";
import type { PartId } from "@/lib/notes/stageParts";

/**
 * My "자라는 중": 보기 칩 [망 | 그래프 | 단계]와 그 아래 노트 틀(NotebookSection이 그림), 내 학습에 대해 묻기.
 * 2026-10-25부터 세 보기 모두 같은 네 갈래(어휘·문법·표현·발음, notes/stageParts.ts) — 예전 여섯 요소(learner/growth.ts)는
 * 화면에서 빠지고 계산(오늘 해볼 것·튜터 요약)에만 남는다. elementNames는 팩 카드가 쓴다.
 */

export function elementNames(ui: UICopy): Record<ElementId, string> {
  return {
    speaking: ui.myElSpeaking,
    accuracy: ui.myElAccuracy,
    words: ui.myElWords,
    listening: ui.myElListening,
    pronunciation: ui.myElPronunciation,
    natural: ui.myElNatural,
  };
}

/** "내 학습에 대해 묻기" 답이 짚은 요소로 바로 연습. */
function growElement(id: ElementId, ui: UICopy) {
  const step = GAP_STEP[id];
  const title = {
    speaking: ui.nextGapSpeaking,
    accuracy: ui.nextGapAccuracy,
    words: ui.nextGapWords,
    listening: ui.nextGapListening,
    pronunciation: ui.nextGapPronunciation,
    natural: ui.nextGapNatural,
  }[id];
  sendAppIntent("practice", { tab: step.tab, goal: { situation: step.situation }, title });
}

/** How the learner chose to look at their record; remembered on this device. */
export type MyViewMode = "net" | "graph" | "map";
const VIEW_KEY = "myViewMode";

/** "단계" 보기를 한 번 보여 줬는지(2026-10-25 사용자: 2.74를 깔았는데 My가 예전과 같다 — 전에 고른 "그래프"가 남아 단계가 안 보였음). */
const STAGE_SHOWN_KEY = "myViewMode.stageShown";

function readViewMode(): MyViewMode {
  try {
    // 처음 한 번은 전에 고른 보기와 상관없이 "단계"로 연다. 그 뒤로는 고른 것을 그대로.
    if (!localStorage.getItem(STAGE_SHOWN_KEY)) {
      localStorage.setItem(STAGE_SHOWN_KEY, "1");
      localStorage.setItem(VIEW_KEY, "map");
      return "map";
    }
    const saved = localStorage.getItem(VIEW_KEY);
    // 2026-10-24: "단계"(예전 지도 + 노트 틀)가 처음 보기. 고른 적 있으면 그대로.
    return saved === "graph" || saved === "net" ? saved : "map";
  } catch {
    return "map";
  }
}

export type BoardMode = MyViewMode;
/** 세 보기가 같은 네 갈래(어휘·문법·표현·발음)를 그린다 — 망·그래프에서 갈래를 누르면 단계 보기의 그 갈래로. */
export type BoardOptions = { part: PartId | null; onPart: (part: PartId) => void };

export function GrowthNetwork({
  ui,
  locale,
  targetLanguage,
  isPremium,
  mapSlot,
  board,
}: {
  ui: UICopy;
  /** The interface language, which answers to questions are written in. */
  locale: string;
  targetLanguage: string;
  isPremium: boolean;
  refreshKey?: string | null;
  /** The goal's topics, shown when the learner looks at their record as a map; none before a map is drawn. */
  mapSlot?: ReactNode;
  /**
   * 수준별 틀(2026-10-25 사용자 "망, 그래프도 변경 내용에 맞게 통합" → 1번): 세 보기 모두 노트 틀의 네 갈래.
   * 망 = 네 꼭짓점(지금 단계에서 찬 정도), 그래프 = 갈래마다 최근 2주, 단계 = 사다리·갈래·칸·대화 예시.
   */
  board?: (mode: BoardMode, options: BoardOptions) => ReactNode;
}) {
  const [mode, setModeState] = useState<MyViewMode>(readViewMode);
  const [part, setPart] = useState<PartId | null>(null);
  const [goalMapOpen, setGoalMapOpen] = useState(false);
  const setMode = (next: MyViewMode) => {
    setModeState(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      // Back to the web next time; nothing lost.
    }
  };
  // 문장분석 시트 "My에서 찾기"로 오면 "단계" 보기로(이미 열려 있을 때 — 처음 열 때는 handOffLocate가 기억한 보기).
  useEffect(() => onLocate(() => setModeState("map")), []);
  const options: BoardOptions = {
    part,
    onPart: (next) => {
      setPart(next);
      setMode("map");
    },
  };

  return (
    <section aria-label={ui.myNetworkTitle} className="mt-3 rounded-2xl border border-white/10 px-3 pb-3 pt-3">
      <div className="flex items-center justify-between gap-2 px-1">
        <p className="text-[11px] font-semibold tracking-wide text-slate-400">{ui.myNetworkTitle}</p>
        <div role="group" aria-label={ui.myViewLabel} className="flex shrink-0 rounded-full border border-white/10 p-0.5">
          {(
            [
              ["net", ui.myViewNet],
              ["graph", ui.myViewGraph],
              ["map", ui.myViewMap],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={mode === id}
              onClick={() => setMode(id)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                mode === id ? "bg-white/90 text-slate-900" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-2">
        {board ? <div className="px-1">{board(mode, options)}</div> : null}
        {mode === "map" ? (
          /* 예전 목표 지도(상황·미션)는 틀과 섞이지 않게 접어 둔다(2026-10-25 사용자: 예전 구조와 섞이면 난잡하다). */
          mapSlot ? (
            board ? (
              <>
                <button
                  type="button"
                  aria-expanded={goalMapOpen}
                  onClick={() => setGoalMapOpen((value) => !value)}
                  className="mt-1 flex w-full items-center justify-between border-t border-white/5 px-1 py-2.5 text-start text-note text-slate-200"
                >
                  <span>{ui.partGoalMap}</span>
                  <span aria-hidden className={`text-caption text-slate-500 ${goalMapOpen ? "rotate-90" : "rtl:rotate-180"}`}>›</span>
                </button>
                {goalMapOpen ? <div className="mt-2">{mapSlot}</div> : null}
              </>
            ) : (
              mapSlot
            )
          ) : board ? null : (
            <p className="px-1 py-6 text-center text-[12px] text-slate-400">{ui.myViewMapEmpty}</p>
          )
        ) : null}
      </div>
      <AskBox ui={ui} locale={locale} targetLanguage={targetLanguage} isPremium={isPremium} />
    </section>
  );
}

/**
 * Asking about one's own progress, answered from the same data the network is
 * drawn from (learner/ask.ts). One question is one chat message; the answer may
 * name an element to grow, which becomes a button.
 */
function AskBox({
  ui,
  locale,
  targetLanguage,
  isPremium,
}: {
  ui: UICopy;
  locale: string;
  targetLanguage: string;
  isPremium: boolean;
}) {
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [reply, setReply] = useState<{ answer: string; grow: ElementId | null } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ask = async (text: string) => {
    const q = text.replace(/\s+/g, " ").trim();
    if (q.length < 2 || busy) return;
    setBusy(true);
    setError(null);
    setReply(null);
    try {
      const response = await fetch(apiUrl("/api/learner/ask"), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
        body: JSON.stringify({ language: targetLanguage, interfaceLanguage: locale, question: q, names: elementNames(ui) }),
      });
      if (response.status === 403) {
        setError(ui.myAskLimit);
        return;
      }
      const data = (await response.json().catch(() => null)) as {
        answer?: string;
        grow?: ElementId | null;
        thin?: boolean;
      } | null;
      if (response.ok && data?.thin) {
        setReply({ answer: ui.myAskThin, grow: data.grow ?? null });
        setQuestion("");
        return;
      }
      if (!response.ok || !data?.answer) {
        setError(ui.myAskFailed);
        return;
      }
      setReply({ answer: data.answer, grow: data.grow ?? null });
      setQuestion("");
    } catch {
      setError(ui.myAskFailed);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-2 px-1">
      <div className="flex flex-wrap gap-1.5">
        {[ui.myAskQuick1, ui.myAskQuick2].map((quick) => (
          <button
            key={quick}
            type="button"
            disabled={busy}
            onClick={() => void ask(quick)}
            className="rounded-full border border-white/15 px-2.5 py-1 text-[12px] text-slate-300 hover:bg-white/10 disabled:opacity-50"
          >
            {quick}
          </button>
        ))}
      </div>
      <form
        className="mt-2 flex items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void ask(question);
        }}
      >
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value.slice(0, 300))}
          placeholder={ui.myAskPlaceholder}
          aria-label={ui.myAskPlaceholder}
          disabled={busy}
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[13px] text-slate-100 placeholder:text-slate-500 focus:border-white/30 focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy || question.trim().length < 2}
          className="shrink-0 rounded-xl bg-white/15 px-3 py-2 text-[12px] font-medium text-slate-100 hover:bg-white/20 disabled:opacity-40"
        >
          {ui.myAskSend}
        </button>
      </form>
      <p className="mt-1 text-[11px] text-slate-500">{ui.myAskCost}</p>
      {busy ? <p className="mt-2 text-[12px] text-slate-400">{ui.myAskThinking}</p> : null}
      {error ? <p className="mt-2 text-[12px] text-rose-300">{error}</p> : null}
      {reply ? (
        <div className="mt-2 rounded-xl bg-white/[0.05] px-3 py-2.5">
          <p className="whitespace-pre-line text-[13px] leading-relaxed text-slate-100">{reply.answer}</p>
          {reply.grow ? (
            <button
              type="button"
              onClick={() => growElement(reply.grow!, ui)}
              className="mt-2 rounded-lg bg-[#e8e8e4] px-3 py-1.5 text-[12px] font-semibold text-neutral-900 hover:bg-white"
            >
              {ui.myGrowIt} · {elementNames(ui)[reply.grow]}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
