"use client";

import { useEffect, useState } from "react";
import { FrameLesson } from "@/components/studyMap/FrameLesson";
import { onAppIntent, takeAppIntent, type AppIntents } from "@/lib/appIntents";
import type { UICopy } from "@/lib/copy";
import { notePool } from "@/lib/curriculum/exam";
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
  useEffect(() => {
    if (open) notePool(open.language, open.key, "opened");
  }, [open]);
  if (!open) return null;
  const { language, key } = open;
  const passed = streakOf(readQuizLog(language)[key]) > 0;
  const close = () => setOpen(null);
  if (key.startsWith("f|")) {
    const frame = frameById(language, key.slice(2));
    return frame ? <FrameLesson key={key} ui={ui} locale={locale} language={language} frame={frame} passed={passed} onClose={close} /> : null;
  }
  const stage = key.startsWith("g|")
    ? Number(key.slice(2).split(":")[0]) || 1
    : (ladderFor(language)?.stages.find((one) => one.expressions.includes(key.slice(2)))?.order ?? 1);
  if (!key.startsWith("e|") && !key.startsWith("g|")) return null;
  // 문법 칸 이름(앱 언어 — 수업이 오기 전 머리에).
  const grammar = key.startsWith("g|") ? ladderFor(language)?.stages.find((one) => one.order === stage)?.grammar[Number(key.split(":")[1])] : undefined;
  const title = grammar ? glossFor(grammar.name, locale) : undefined;
  return <FrameLesson key={key} ui={ui} locale={locale} language={language} subject={{ key, kind: key.startsWith("e|") ? "expression" : "grammar", stage, ...(title ? { title } : {}) }} passed={passed} onClose={close} />;
}
