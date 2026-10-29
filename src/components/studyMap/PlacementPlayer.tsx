"use client";

import { useEffect, useMemo, useState } from "react";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { CheckupResult } from "@/components/studyMap/CheckupPlayer";
import { QuestionView, type Answer } from "@/components/studyMap/QuizPlayer";
import type { UICopy } from "@/lib/copy";
import type { CheckResult } from "@/lib/curriculum/checkup";
import {
  nextPlacementStage,
  PLACEMENT_ENOUGH,
  PLACEMENT_FIRST,
  placementBlock,
  placementResult,
  stageKeys,
  type PlacementItem,
} from "@/lib/curriculum/placement";
import { stopTts } from "@/lib/ttsPlayer";

/**
 * 처음 시험(실력 확인, lib/curriculum/placement.ts): 2단계에서 4문제씩, 맞히면 위 단계·막히면 아래 단계로 → 시작 단계.
 * 첫 답만 셈(원문 보기·다시 하기 없음). 중간에 ✕를 눌러도 PLACEMENT_ENOUGH문제 넘게 답했으면 거기까지로 결과를 보인다.
 * 결과 = "n단계에서 시작" + 단계별·갈래별 맞힌 수 + [시작] (부르는 쪽이 그 단계를 저장) · [그냥 고르기].
 */
export function PlacementPlayer({
  ui,
  locale,
  language,
  labelOf,
  onFinish,
  onStart,
  onPick,
  onClose,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  labelOf: (key: string) => string;
  /** 결과가 나오면 한 번(서버에 남기기). */
  onFinish: (result: CheckResult) => void;
  /** 결과의 [시작] — 그 단계 번호로 시작. */
  onStart: (stage: number) => void;
  /** 결과의 [그냥 고르기] — 대화 예시로 고르기(그 단계를 골라 둔 채로). */
  onPick: (stage: number) => void;
  onClose: () => void;
}) {
  const seed = useMemo(() => `${language}|placement|${new Date().toDateString()}`, [language]);
  const [items, setItems] = useState<PlacementItem[]>(() =>
    placementBlock({ language, stage: PLACEMENT_FIRST, used: new Set(), says: 0, seed }),
  );
  const [extraDone, setExtraDone] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [result, setResult] = useState<CheckResult | null>(null);
  useEffect(() => () => stopTts(), []);

  const scored = (list: readonly PlacementItem[], given: Record<number, Answer>) =>
    list.map((_, i) => (given[i] === undefined || given[i]!.skipped ? null : given[i]!.correct));
  const finish = (list: readonly PlacementItem[], given: Record<number, Answer>) => {
    const done = placementResult(list, scored(list, given));
    setResult(done);
    onFinish(done);
  };
  const advance = () => {
    const next = index + 1;
    if (next < items.length) {
      setIndex(next);
      return;
    }
    // 묶음 끝: 다음 단계를 정해 다음 묶음을 붙이거나 끝낸다.
    const last = items[items.length - 1]!.stage;
    const tallies = placementResult(items, scored(items, answers)).stages ?? {};
    const stage = nextPlacementStage({ last, tallies, asked: items.length, extraDone, hasKeys: (s) => stageKeys(language, s).length > 0 });
    const block =
      stage === null
        ? []
        : placementBlock({ language, stage, used: new Set(items.map((item) => item.key)), says: items.filter((item) => item.question.kind === "say").length, seed });
    if (!block.length) {
      finish(items, answers);
      return;
    }
    if (items.some((item) => item.stage === stage)) setExtraDone(true);
    setItems([...items, ...block]);
    setIndex(next);
  };
  const close = () => {
    const answered = Object.values(answers).filter((answer) => !answer.skipped).length;
    if (!result && answered >= PLACEMENT_ENOUGH) {
      finish(items.slice(0, index + (answers[index] ? 1 : 0)), answers);
      return;
    }
    onClose();
  };
  const question = result ? null : items[index]?.question;
  return (
    <FullScreenLayer>
      <header className="flex shrink-0 items-start gap-2 border-b border-line px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-body font-semibold text-ink">{ui.placementTitle}</h2>
          {!result ? <p className="mt-0.5 text-caption tabular-nums text-slate-400">{index + 1}</p> : null}
        </div>
        <button type="button" onClick={result ? onClose : close} aria-label={ui.billingClose} className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10">
          ✕
        </button>
      </header>
      <div data-placement className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {question ? (
          <QuestionView
            key={index}
            ui={ui}
            locale={locale}
            language={language}
            question={question}
            answered={answers[index] ?? null}
            onAnswer={(value) => setAnswers((current) => (current[index] ? current : { ...current, [index]: value }))}
            onNext={advance}
          />
        ) : null}
        {result ? (
          <CheckupResult
            ui={ui}
            result={result}
            previous={null}
            labelOf={labelOf}
            onClose={onClose}
            heading={ui.placementStart.replace("{n}", String(result.stage))}
            actions={
              <div className="flex flex-wrap justify-center gap-2">
                <button type="button" onClick={() => onPick(result.stage)} className="rounded-full border border-line px-4 py-1.5 text-caption text-slate-200 hover:bg-white/10">
                  {ui.placementPick}
                </button>
                <button type="button" data-placement-start onClick={() => onStart(result.stage)} className="rounded-full bg-white/90 px-5 py-1.5 text-caption font-semibold text-slate-900">
                  {ui.stageBegin}
                </button>
              </div>
            }
          />
        ) : null}
      </div>
    </FullScreenLayer>
  );
}
