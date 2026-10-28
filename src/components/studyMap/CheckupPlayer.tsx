"use client";

import { useEffect, useState } from "react";
import { maybeShowInterstitial } from "@/lib/ads";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { QuestionView, type Answer } from "@/components/studyMap/QuizPlayer";
import type { UICopy } from "@/lib/copy";
import { CHECK_ORIGINS, rateOf, summarize, type CheckItem, type CheckOrigin, type CheckResult } from "@/lib/curriculum/checkup";
import { PART_IDS, type PartId } from "@/lib/notes/stageParts";
import { stopTts } from "@/lib/ttsPlayer";

/**
 * 이번 주 확인(lib/curriculum/checkup.ts, 2026-10-29): 12문제를 한 번씩(첫 답만 셈, 원문 보기·다시 하기 없음) → 결과 한 장.
 * 결과는 네 갈래마다 맞힌 수와 지난번과의 차이, 배운 때(최근·예전·다음 단계)마다 맞힌 수, 틀린 것 이름 — 등급·점수는 없다.
 * 끝나면 onFinish(결과)로 부르는 쪽이 서버에 남긴다(틀린 것은 다시 볼 것). result가 있으면 문제 없이 그 결과만 보인다.
 */
export function CheckupPlayer({
  ui,
  locale,
  language,
  stage,
  items,
  previous,
  result: shown,
  labelOf,
  onFinish,
  onClose,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  stage: number;
  items: readonly CheckItem[];
  /** 지난번 결과(차이를 보일 때) — 없으면 차이 없음. */
  previous: CheckResult | null;
  /** 이미 끝낸 확인을 다시 볼 때. */
  result?: CheckResult | null;
  /** 열쇠 이름(틀린 것 목록). */
  labelOf: (key: string) => string;
  onFinish: (result: CheckResult) => void;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [result, setResult] = useState<CheckResult | null>(shown ?? null);
  useEffect(() => () => stopTts(), []);
  const done = Boolean(result) || index >= items.length;
  const close = () => {
    if (done && !shown) void maybeShowInterstitial("checkupEnd");
    onClose();
  };
  const question = items[index]?.question;
  return (
    <FullScreenLayer>
      <header className="flex shrink-0 items-start gap-2 border-b border-line px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-body font-semibold text-ink">{ui.checkupTitle}</h2>
          {!done ? (
            <p className="mt-0.5 text-caption tabular-nums text-slate-400">
              {index + 1}/{items.length}
            </p>
          ) : null}
        </div>
        <button type="button" onClick={close} aria-label={ui.billingClose} className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10">
          ✕
        </button>
      </header>
      <div data-checkup className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {!done && question ? (
          <QuestionView
            key={index}
            ui={ui}
            locale={locale}
            language={language}
            question={question}
            answered={answers[index] ?? null}
            onAnswer={(value) => setAnswers((current) => (current[index] ? current : { ...current, [index]: value }))}
            onNext={() => {
              const next = index + 1;
              if (next >= items.length) {
                // 마지막 문제 다음: 첫 답만으로 결과(말하기를 못 한 것은 빼고).
                const finished = summarize(
                  items,
                  items.map((_, i) => (answers[i]?.skipped ? null : (answers[i]?.correct ?? false))),
                  stage,
                );
                setResult(finished);
                onFinish(finished);
              }
              setIndex(next);
            }}
          />
        ) : null}
        {done && result ? <CheckupResult ui={ui} result={result} previous={previous} labelOf={labelOf} onClose={close} /> : null}
      </div>
    </FullScreenLayer>
  );
}

function partName(ui: UICopy, part: PartId): string {
  return { vocab: ui.partVocab, grammar: ui.partGrammar, expression: ui.partExpression, pronunciation: ui.partPronunciation }[part];
}

function originName(ui: UICopy, origin: CheckOrigin): string {
  return { recent: ui.checkupRecent, old: ui.checkupOld, ahead: ui.checkupAhead }[origin];
}

function CheckupResult({
  ui,
  result,
  previous,
  labelOf,
  onClose,
}: {
  ui: UICopy;
  result: CheckResult;
  previous: CheckResult | null;
  labelOf: (key: string) => string;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-2">
        {PART_IDS.filter((part) => result.parts[part]).map((part) => {
          const [right, total] = result.parts[part]!;
          const now = rateOf(result.parts[part])!;
          const before = rateOf(previous?.parts[part]);
          const diff = before === null ? null : Math.round((now - before) * 100);
          return (
            <li key={part} data-part={part} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="min-w-0 flex-1 text-note text-ink">{partName(ui, part)}</span>
                {diff !== null && diff !== 0 ? (
                  <span className={`text-caption tabular-nums ${diff > 0 ? "text-good" : "text-warn"}`}>
                    {ui.checkupPrev} {diff > 0 ? "▲" : "▼"}
                  </span>
                ) : null}
                <span className="text-caption tabular-nums text-slate-300">
                  {right}/{total}
                </span>
              </div>
              <div className="relative h-1.5 overflow-hidden rounded-full bg-white/10">
                {before !== null ? <span className="absolute inset-y-0 start-0 bg-white/20" style={{ width: `${Math.round(before * 100)}%` }} /> : null}
                <span className="absolute inset-y-0 start-0 rounded-full bg-status-learned" style={{ width: `${Math.round(now * 100)}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
      <ul className="flex flex-col gap-1 border-t border-line pt-3">
        {CHECK_ORIGINS.filter((origin) => result.origins[origin]).map((origin) => (
          <li key={origin} className="flex items-center gap-2 text-caption">
            <span className="min-w-0 flex-1 text-slate-400">{originName(ui, origin)}</span>
            <span className="tabular-nums text-slate-300">
              {result.origins[origin]![0]}/{result.origins[origin]![1]}
            </span>
          </li>
        ))}
      </ul>
      {result.wrong.length ? (
        <div className="flex flex-col gap-1.5 border-t border-line pt-3">
          <h3 className="text-caption font-semibold text-warn">{ui.checkupWrong}</h3>
          <div className="flex flex-wrap gap-1.5">
            {result.wrong.map((key) => (
              <span key={key} dir="auto" className="rounded-full border border-warn/40 px-2.5 py-0.5 text-caption text-slate-200">
                {labelOf(key)}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      <button type="button" onClick={onClose} className="self-center rounded-full bg-white/90 px-5 py-1.5 text-caption font-semibold text-slate-900">
        {ui.billingClose}
      </button>
    </div>
  );
}
