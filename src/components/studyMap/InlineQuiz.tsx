"use client";

import { useEffect, useRef, useState } from "react";
import { QuestionView, type Answer } from "@/components/studyMap/QuizPlayer";
import { NativeAdSlot, useNativeRefresh } from "@/components/NativeAdSlot";
import { maybeShowInterstitial } from "@/lib/ads";
import type { UICopy } from "@/lib/copy";
import type { QuizQuestion } from "@/lib/curriculum/quiz";
import { stopTts } from "@/lib/ttsPlayer";
import { quizShapeOf } from "@/lib/curriculum/missKind";
import { segmentWords } from "@/lib/wordSegments";

/**
 * 칸 안에서 바로 푸는 퀴즈(2026-10-30 사용자 "아예 퀴즈 화면을 보여 줘서 클릭을 유도하고 풀면 다음 문제로 — 설명이나 옵션은 그 내부에"):
 * 버튼·이름·이유 줄 없이 첫 문제가 바로 보이고, 답하면 다음 문제, 묶음이 끝나면 make()로 다음 묶음을 받아 이어 간다.
 * 결과는 문제마다 바로 onResult(부르는 쪽이 기록·다시 볼 것에 넣음). make()가 null이면 onEmpty를 그린다.
 */
export type QuizBatch = { questions: QuizQuestion[]; keys: string[] };

/** 광고 한 묶음 = 문제 10개(2026-11-01): 넘긴 뒤 다음 묶음으로 갈 때 전면 한 번(quizBreak). 아래 네이티브는 문제가 바뀔 때 60초마다(useNativeRefresh). */
const AD_ROUND = 10;

export function InlineQuiz({
  ui,
  locale,
  language,
  resetKey,
  make,
  retryKey,
  onResult,
  onParts,
  empty,
  explainLink = false,
  dictDoor = false,
  adKey,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  /** 바뀌면(탭·방식·학습 언어) 새 묶음부터. */
  resetKey: string;
  make: () => QuizBatch | null;
  /** Changes when the material behind make() arrives (e.g. word cards): an empty quiz tries make() again. */
  retryKey?: string;
  onResult: (result: { key: string; correct: boolean; skipped: boolean; shape?: "c" | "t"; miss?: string }) => void;
  /** 복합 문제(소재 여럿)의 결과를 한 번에 — 없으면 소재마다 onResult. */
  onParts?: (parts: { key: string; correct: boolean; seen?: boolean; shape?: "c" | "t" }[]) => void;
  empty: React.ReactNode;
  /** 틀리면 "설명"으로 Stagebank 그 소재 수업(다시 보기 탭). */
  explainLink?: boolean;
  /** 답한 뒤 사전 문(개편 Quizbank, QuestionView dictDoor). */
  dictDoor?: boolean;
  /**
   * Quizbank에서 이어 푸는 퀴즈(있으면): 문제 아래 네이티브(Quizbank 전체 화면에서만, 문제가 바뀔 때 60초 넘었으면 새 광고)와
   * 10문제를 넘긴 뒤 묶음 경계의 전면(quizBreak). 오늘 할 것의 한 문제에는 없음(항목 사이 광고 없음).
   */
  adKey?: string;
}) {
  const [batch, setBatch] = useState<QuizBatch | null>(null);
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState<Answer | null>(null);
  // 묶음마다 번호 — 다음 묶음 첫 문제가 같은 열쇠여도 고른 답이 남지 않게.
  const [serial, setSerial] = useState(0);
  // 지난 쉼 뒤 답한 문제 수(전면 묶음 경계).
  const sinceBreak = useRef(0);
  // 문제 아래 네이티브 교체 번호 — 문제가 바뀔 때 앞 광고가 60초 넘었으면 새것(문제 도중에는 안 바꿈).
  const adRound = useNativeRefresh(`${serial}-${index}`);
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
  // 처음 그릴 때는 위 resetKey 효과가 이미 make()를 불렀다 — 여기서 또 부르면 그 묶음을 덮는다(오늘 카드가 맡긴 열쇠 묶음이 사라짐, 2026-11-07).
  const firstRetry = useRef(true);
  useEffect(() => {
    if (firstRetry.current) {
      firstRetry.current = false;
      return;
    }
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
    // 묶음 경계: 10문제를 넘겼으면 쉼 — 전면은 다음 묶음을 받는 이 순간에만(문제 도중·답 보기 중에는 없음, 3분 간격은 lib/ads.ts).
    if (adKey && sinceBreak.current >= AD_ROUND) {
      sinceBreak.current = 0;
      void maybeShowInterstitial("quizBreak");
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
          sinceBreak.current += 1;
          // 복합 문제는 소재(열쇠)마다 따로 기록(curriculum/multiQuiz.ts).
          if (value.parts?.length) {
            if (onParts) onParts(value.parts);
            else for (const part of value.parts) if (!part.seen) onResult({ key: part.key, correct: part.correct, skipped: false });
          }
          else onResult({ key: batch.keys[index] ?? "", correct: value.correct, skipped: Boolean(value.skipped), ...quizShapeOf(question, value, (text) => segmentWords(text, language)) });
        }}
        onNext={next}
        bankKey={batch.keys[index]}
        explainLink={explainLink}
        dictDoor={dictDoor}
      />
      {/* Quizbank 문제 아래 빈 공간에 네이티브 하나(바닥 칸·전체 화면 모두 — My 탭은 배너가 없어 한 화면에 광고 하나) — 입력칸·버튼과 한 줄 넘게 띄우고, 키보드가 올라오면 숨김, 문제가 바뀔 때 60초 넘었으면 새 광고. */}
      {adKey ? <NativeAdSlot feedId="quiz-inline" slotKey={`${adKey}-${adRound}`} spaced /> : null}
    </div>
  );
}
