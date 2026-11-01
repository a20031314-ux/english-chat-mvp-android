"use client";

import { useEffect } from "react";
import { FindInMy } from "@/components/FindInMy";
import { RightWithChanges, SaidWithMistakes } from "@/components/RoleplayReview";
import { openLesson } from "@/lib/appIntents";
import { correctionReplacementSnippet } from "@/lib/textDiff";
import { notePool } from "@/lib/curriculum/exam";
import { expressionKeysIn, type LessonScene } from "@/lib/curriculum/lessonKey";
import type { UICopy } from "@/lib/copy";
import type { RecapFrame, RecapItem } from "@/lib/roleplay/recap";

/**
 * 통화 정리 카드 — 통화가 끝난 화면 맨 아래와 통화 기록 돌아보기(2026-10-30 사용자 "통화 기록을 학습자료로, My 해당 부분으로 연결").
 * 줄마다: 무엇인지(고친 말·힌트·못 알아들은 말·뜻을 본 말) · 학습 언어 문장 · 그 문장의 문장구조 🧩(누르면 My n단계 그 수업) — 틀이 없으면 🔎 My에서 찾기.
 * 설명 글은 없음(화면 속 부연설명 금지) — 이름·상태만.
 */
export function CallRecap({
  ui,
  language,
  locale,
  items,
  saved,
  onOpenFrame,
  onLeave,
}: {
  ui: UICopy;
  language: string;
  locale: string;
  items: RecapItem[];
  /** 찾은 문장구조를 다시 볼 것에 넣었다(상태 한 줄). */
  saved: boolean;
  onOpenFrame: (frame: RecapFrame) => void;
  /** My로 가기 전에 통화 화면을 닫는다(🔎 My에서 찾기). */
  onLeave: () => void;
}) {
  // 고친 말·힌트·못 알아들은 말의 문장구조·표현은 정기 시험 재료로(curriculum/exam.ts, 2026-11-01).
  // 그 문장도 같이(시험에서 그 문장을 먼저 문제로, 2026-11-01).
  useEffect(() => {
    for (const item of items) {
      const scene = sceneOf(item);
      for (const frame of item.frames) notePool(language, `f|${frame.id}`, "stuck", Date.now(), scene);
      for (const key of expressionKeysIn(language, item.line)) notePool(language, key, "stuck", Date.now(), scene);
    }
  }, [items, language]);
  void onOpenFrame;
  if (!items.length) return null;
  const label = (item: RecapItem) =>
    item.kind === "fix"
      ? ui.roleplayBetter
      : item.kind === "hint"
        ? `💡 ${ui.missionHint}`
        : item.kind === "missed"
          ? `🙉 ${ui.roleplayMissed}`
          : ui.callRecapLooked;
  return (
    <section className="mt-4 rounded-2xl border border-line bg-white/[0.03] p-3" data-call-recap>
      <header className="flex items-center justify-between gap-2">
        <h3 className="text-note font-semibold text-title">{ui.callRecapTitle}</h3>
        {saved ? <span className="text-caption text-slate-400">✓ {ui.studyReview}</span> : null}
      </header>
      <ol className="mt-2 space-y-2">
        {items.map((item, index) => (
          <li key={`${item.kind}-${index}`} className="rounded-xl bg-white/[0.04] px-3 py-2">
            <p className="text-caption text-slate-400">{label(item)}</p>
            {/* 고친 말: 내가 한 말은 틀린 곳만 표시, 고친 문장은 바뀐 곳만 초록(사용자 2026-11-01). */}
            {item.said ? (
              <p className="mt-0.5 text-meta text-slate-400">
                <SaidWithMistakes said={item.said} right={item.line} />
              </p>
            ) : null}
            <p className="mt-0.5 text-note text-slate-100">
              {item.said ? <RightWithChanges said={item.said} right={item.line} /> : <bdi dir="auto">{item.line}</bdi>}
            </p>
            {item.meaning ? <p className="mt-0.5 text-meta text-slate-400">{item.meaning}</p> : null}
            {item.frames.length || expressionKeysIn(language, item.line).length ? (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {expressionKeysIn(language, item.line).map((key) => (
                  <button key={key} type="button" data-recap-expression onClick={() => openLesson({ language, key, scene: sceneOf(item) })} className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-meta text-slate-100 hover:bg-white/10">
                    <span aria-hidden>🔤</span>
                    <bdi dir="auto">{key.slice(2)}</bdi>
                  </button>
                ))}
                {item.frames.map((frame) => (
                  <button
                    key={frame.id}
                    type="button"
                    // 그 문장을 들고 그 수업으로(수업 맨 위 "통화에서" 카드) — 통화 화면 위에 열려 닫으면 여기로 돌아온다.
                    onClick={() => openLesson({ language, key: `f|${frame.id}`, scene: sceneOf(item) })}
                    className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-meta text-slate-100 hover:bg-white/10"
                  >
                    <span aria-hidden>🧩</span>
                    <bdi dir="auto">{frame.pattern}</bdi>
                    <span className="text-slate-400">· {ui.stageNumber.replace("{n}", String(frame.stage))}</span>
                  </button>
                ))}
              </div>
            ) : (
              <FindInMy ui={ui} text={findText(item)} sentence={item.line} language={language} locale={locale} onDone={onLeave} lessonScene={sceneOf(item)} />
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

/** 통화 정리 한 줄 → 수업·시험에 들고 갈 장면(이 폰에만). */
function sceneOf(item: RecapItem): LessonScene {
  return { line: item.line, ...(item.said ? { said: item.said } : {}), ...(item.before ? { before: item.before } : {}), ...(item.meaning ? { meaning: item.meaning } : {}) };
}

/**
 * 🔎 My에서 찾기가 찾을 것 — 고친 말이면 고친 곳만(문장 전체가 아니라), 나머지는 그 줄.
 * 2026-11-01 store → dev: "我…没有看见长城…的 → 没有去长城"이 문장 전체로 찾아 "不로 부정하기"(문장에 있는 부정)를 열었음 — 고친 곳은 看见→去.
 */
function findText(item: RecapItem): string {
  if (item.kind !== "fix" || !item.said) return item.line;
  // 문장부호만인 조각은 빼고, 남은 글자가 두 자도 안 되면(일본어 활용 "き"처럼) 그 줄 전체로 — 한 글자로는 찾을 칸이 정해지지 않는다.
  const changed = correctionReplacementSnippet(item.said, item.line)
    .split(" · ")
    .map((piece) => piece.trim())
    .filter((piece) => /[\p{L}\p{N}]/u.test(piece))
    .join(" · ");
  return [...changed.replace(/[^\p{L}\p{M}\p{N}]/gu, "")].length >= 2 ? changed : item.line;
}
