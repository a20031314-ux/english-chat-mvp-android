"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { UICopy } from "@/lib/copy";
import type { ElementId } from "@/lib/learner/growth";
import { onLocate } from "@/lib/notes/locateHandoff";
import type { PartId } from "@/lib/notes/stageParts";

/**
 * My "자라는 중": 보기 칩 [망 | 그래프 | 단계]와 그 아래 노트 틀(NotebookSection이 그림).
 * 2026-10-25부터 세 보기 모두 같은 네 갈래(어휘·문법·표현·발음, notes/stageParts.ts) — 예전 여섯 요소(learner/growth.ts)는
 * 화면에서 빠지고 계산(오늘 해볼 것·튜터 요약)에만 남는다. elementNames는 팩 카드가 쓴다.
 * 예전 목표 지도(접힘)·직접 묻기는 2026-10-27에 뺐다(사용자 "예전 기능은 다 지워줘").
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
  board,
}: {
  ui: UICopy;
  /**
   * 수준별 틀(2026-10-25 사용자 "망, 그래프도 변경 내용에 맞게 통합" → 1번): 세 보기 모두 노트 틀의 네 갈래.
   * 망 = 네 꼭짓점(지금 단계에서 찬 정도), 그래프 = 갈래마다 최근 2주, 단계 = 사다리·갈래·칸·대화 예시.
   */
  board: (mode: BoardMode, options: BoardOptions) => ReactNode;
}) {
  const [mode, setModeState] = useState<MyViewMode>(readViewMode);
  const [part, setPart] = useState<PartId | null>(null);
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
      <div className="mt-2 px-1">{board(mode, options)}</div>
    </section>
  );
}
