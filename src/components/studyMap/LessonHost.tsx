"use client";

import { LayerAboveContext } from "@/components/FullScreenLayer";
import { noteSpot, takeSpotPart } from "@/lib/resumeSpot";
import { useCallback, useEffect, useState } from "react";
import { FrameLesson } from "@/components/studyMap/FrameLesson";
import { ExpressionCard } from "@/components/studyMap/ExpressionCard";
import { allFramesFor } from "@/lib/curriculum/frames";
import { isFrameExpression } from "@/lib/curriculum/expressionDeck";
import { onAppIntent, takeAppIntent, type AppIntents } from "@/lib/appIntents";
import type { UICopy } from "@/lib/copy";
import { frameById } from "@/lib/curriculum/frames";
import { streakOf } from "@/lib/curriculum/nextStudy";
import { readQuizLog } from "@/lib/curriculum/quizLogStore";
import { ladderFor } from "@/lib/curriculum/stages/index";
import { glossFor } from "@/lib/curriculum/stageScripts";

/**
 * Stagebank 소재 수업을 앱 어디서나 띄우는 층(2026-11-01 설계 "모를 때 이동해서 확인", hub/drafts/quiz-pages-2026-11-01.md 3절).
 * `openLesson` 신호(통화 정리·대본 틀린 줄·Logbank 칩·Quizbank 틀린 문제)를 받아 문장구조면 그 틀 수업, 표현·문법 칸이면 그 소재 수업을 연다.
 * 이렇게 들어와 연 소재는 정기 시험 재료로 모인다(curriculum/exam.ts "opened"). 화면은 FrameLesson 하나 — 설명은 Stagebank 한 곳.
 */
export function LessonHost({ ui, locale }: { ui: UICopy; locale: string }) {
  const [open, setOpen] = useState<AppIntents["openLesson"] | null>(() => takeAppIntent("openLesson"));
  useEffect(() => onAppIntent("openLesson", setOpen), []);
  // 앱을 나갔다 다시 켜면 열어 두었던 소재 수업을 다시(lib/resumeSpot.ts, 2026-11-02), 열고 닫을 때 이 폰에 남긴다.
  useEffect(() => {
    const lesson = takeSpotPart("lesson");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 다시 켤 때 한 번(takeSpotPart)
    if (lesson) setOpen((current) => current ?? lesson);
  }, []);
  useEffect(() => {
    noteSpot({ lesson: open ? { language: open.language, key: open.key } : undefined });
  }, [open]);
  // 표현 카드가 아직 없으면 예전 수업으로(그 표현 열쇠만, 닫으면 다시 카드부터).
  const [noCard, setNoCard] = useState<string | null>(null);
  const missing = useCallback(() => setNoCard(open?.key ?? null), [open?.key]);
  if (!open) return null;
  const { language, key } = open;
  const passed = streakOf(readQuizLog(language)[key]) > 0;
  const close = () => {
    setOpen(null);
    setNoCard(null);
  };
  const shown = (() => {
    if (key.startsWith("f|")) {
      const frame = frameById(language, key.slice(2));
      return frame ? <FrameLesson noAd key={key} ui={ui} locale={locale} language={language} frame={frame} scene={open.scene} passed={passed} onClose={close} /> : null;
    }
    // 🔤 표현(2026-11-03 사용자 "Abc 칩은 표현 카드로"): 문장구조와 같은 표현이면 그 문장구조 수업, 아니면 표현 카드.
    if (key.startsWith("e|")) {
      const expression = key.slice(2);
      if (isFrameExpression(language, expression)) {
        const frame = allFramesFor(language).find((one) => one.expressions?.includes(expression));
        if (frame) return <FrameLesson noAd key={key} ui={ui} locale={locale} language={language} frame={frame} scene={open.scene} passed={passed} onClose={close} />;
      }
      if (noCard !== key) {
        const at = ladderFor(language)?.stages.find((one) => one.expressions.includes(expression))?.order ?? 1;
        return <ExpressionCard key={key} ui={ui} locale={locale} language={language} expression={expression} stage={at} scene={open.scene} onMissing={missing} onClose={close} />;
      }
    }
    const stage = key.startsWith("g|")
      ? Number(key.slice(2).split(":")[0]) || 1
      : (ladderFor(language)?.stages.find((one) => one.expressions.includes(key.slice(2)))?.order ?? 1);
    if (!key.startsWith("e|") && !key.startsWith("g|")) return null;
    // 문법 칸 이름(앱 언어 — 수업이 오기 전 머리에).
    const grammar = key.startsWith("g|") ? ladderFor(language)?.stages.find((one) => one.order === stage)?.grammar[Number(key.split(":")[1])] : undefined;
    const title = grammar ? glossFor(grammar.name, locale) : undefined;
    return <FrameLesson noAd key={key} ui={ui} locale={locale} language={language} subject={{ key, kind: key.startsWith("e|") ? "expression" : "grammar", stage, ...(title ? { title } : {}) }} scene={open.scene} passed={passed} onClose={close} />;
  })();
  return <LayerAboveContext.Provider value={Boolean(open.above)}>{shown}</LayerAboveContext.Provider>;
}
