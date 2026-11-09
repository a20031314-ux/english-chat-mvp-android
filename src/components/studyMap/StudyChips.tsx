"use client";

import { useMemo, type ReactNode } from "react";
import { openLesson } from "@/lib/appIntents";
import { dayOfSeconds } from "@/lib/curriculum/checkState";
import type { LessonScene } from "@/lib/curriculum/lessonKey";
import { readLedger } from "@/lib/curriculum/logLedger";
import { studyFor, type StudyWith } from "@/lib/curriculum/wordUse";
import type { UICopy } from "@/lib/copy";

/**
 * 같이 배우기 칩 줄(`lbStudyWith`) — 한 기능, 여러 자리(2026-11-09):
 *   Languagebank 단어 화면(그 단어와 같이) · 채팅 표현 보기 아래 · 통화 정리 줄(하고 싶었던 말 — 사용자 "발화 의도 → 해당 카드").
 * 누르면 그 소재 수업(openLesson). 고르기는 curriculum/wordUse.ts(모델 없음, 이 폰 장부로 덜 다진 것 먼저). 없으면 안 보임(또는 fallback).
 */
export function StudyChipRow({
  ui,
  language,
  list,
  above = false,
  scene,
  title = true,
}: {
  ui: UICopy;
  language: string;
  list: readonly StudyWith[];
  /** 전체를 덮는 층(채팅·사전 시트) 위에서 열 때. */
  above?: boolean;
  /** 수업 맨 위에 들고 갈 그 장면(통화 정리). */
  scene?: LessonScene;
  title?: boolean;
}) {
  if (!list.length) return null;
  return (
    <div data-study-with className={title ? "mt-3" : "mt-1.5"}>
      {title ? <p className="text-meta text-slate-500">{ui.lbStudyWith}</p> : null}
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {list.map((one) => (
          <button
            key={one.key}
            type="button"
            dir="auto"
            data-study-with-key={one.key}
            onClick={() => openLesson({ language, key: one.key, ...(scene ? { scene } : {}), ...(above ? { above: true } : {}) })}
            className="rounded-lg border border-line px-2.5 py-1 text-start text-note text-ink hover:bg-white/5"
          >
            <span aria-hidden className="me-1">{one.key.startsWith("e|") ? "💬" : one.key.startsWith("g|") ? "📐" : "🧩"}</span>
            {one.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** 하고 싶었던 말 한 줄(line = 학습 언어, said = 내가 한 말)의 같이 배우기. 고를 게 없으면 fallback. */
export function StudyChips({
  ui,
  language,
  locale,
  line,
  said,
  above,
  scene,
  title,
  fallback = null,
}: {
  ui: UICopy;
  language: string;
  locale: string;
  line: string;
  said?: string;
  above?: boolean;
  scene?: LessonScene;
  title?: boolean;
  fallback?: ReactNode;
}) {
  const list = useMemo(
    () => studyFor({ language, locale, line, said, events: readLedger(language), dayOf: (t) => dayOfSeconds(t) }),
    [language, locale, line, said],
  );
  if (!list.length) return <>{fallback}</>;
  return <StudyChipRow ui={ui} language={language} list={list} above={above} scene={scene} title={title} />;
}
