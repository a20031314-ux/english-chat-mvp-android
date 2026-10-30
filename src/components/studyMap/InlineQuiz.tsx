"use client";

import { useEffect, useRef, useState } from "react";
import { QuestionView, type Answer } from "@/components/studyMap/QuizPlayer";
import type { UICopy } from "@/lib/copy";
import type { QuizQuestion } from "@/lib/curriculum/quiz";
import { stopTts } from "@/lib/ttsPlayer";

/**
 * 칸 안에서 바로 푸는 퀴즈(2026-10-30 사용자 "아예 퀴즈 화면을 보여 줘서 클릭을 유도하고 풀면 다음 문제로 — 설명이나 옵션은 그 내부에"):
 * 버튼·이름·이유 줄 없이 첫 문제가 바로 보이고, 답하면 다음 문제, 묶음이 끝나면 make()로 다음 묶음을 받아 이어 간다.
 * 결과는 문제마다 바로 onResult(부르는 쪽이 기록·다시 볼 것에 넣음). make()가 null이면 onEmpty를 그린다.
 */
export type QuizBatch = { questions: QuizQuestion[]; keys: string[] };

export function InlineQuiz({
  ui,
  locale,
  language,
  resetKey,
  make,
  retryKey,
  onResult,
  empty,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  /** 바뀌면(탭·방식·학습 언어) 새 묶음부터. */
  resetKey: string;
  make: () => QuizBatch | null;
  /** Changes when the material behind make() arrives (e.g. word cards): an empty quiz tries make() again. */
  retryKey?: string;
  onResult: (result: { key: string; correct: boolean; skipped: boolean }) => void;
  empty: React.ReactNode;
}) {
  const [batch, setBatch] = useState<QuizBatch | null>(null);
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState<Answer | null>(null);
  // 묶음마다 번호 — 다음 묶음 첫 문제가 같은 열쇠여도 고른 답이 남지 않게.
  const [serial, setSerial] = useState(0);
  const makeRef = useRef(make);
  useEffect(() => {
    makeRef.current = make;
  });
  useEffect(() => {
    // 탭·방식이 바뀌면 그 모양의 새 묶음부터(effect 안에서 한 번 — 칸이 펼쳐질 때도).
    setBatch(makeRef.current());
    setIndex(0);
    setAnswered(null);
    setSerial((n) => n + 1);
  }, [resetKey]);
  // 재료(낱말 카드 등)가 늦게 오면 첫 make()가 비어 "오늘 끝"에 머문다(2026-10-31) — 비어 있을 때만 다시.
  const emptyRef = useRef(true);
  useEffect(() => {
    emptyRef.current = !batch?.questions.length;
  });
  useEffect(() => {
    if (retryKey === undefined || !emptyRef.current) return;
    const made = makeRef.current();
    if (!made?.questions.length) return;
    setBatch(made);
    setIndex(0);
    setAnswered(null);
    setSerial((n) => n + 1);
  }, [retryKey]);
  useEffect(() => () => stopTts(), []);

  const question = batch?.questions[index];
  if (!batch || !question) return <>{empty}</>;
  const next = () => {
    setAnswered(null);
    if (index + 1 < batch.questions.length) {
      setIndex(index + 1);
      return;
    }
    setBatch(makeRef.current());
    setIndex(0);
    setSerial((n) => n + 1);
  };
  return (
    <div data-inline-quiz className="mt-1">
      <QuestionView
        key={`${serial}-${index}`}
        ui={ui}
        locale={locale}
        language={language}
        question={question}
        answered={answered}
        onAnswer={(value) => {
          if (answered) return;
          setAnswered(value);
          onResult({ key: batch.keys[index] ?? "", correct: value.correct, skipped: Boolean(value.skipped) });
        }}
        onNext={next}
        bankKey={batch.keys[index]}
      />
    </div>
  );
}
