"use client";

import { FindInMy } from "@/components/FindInMy";
import type { UICopy } from "@/lib/copy";
import type { RecapFrame, RecapItem } from "@/lib/roleplay/recap";

/**
 * 통화 정리 카드 — 통화가 끝난 화면 맨 아래와 통화 기록 돌아보기(2026-10-30 사용자 "통화 기록을 학습자료로, My 해당 부분으로 연결").
 * 줄마다: 무엇인지(고친 말·힌트·뜻을 본 말) · 학습 언어 문장 · 그 문장의 문장구조 🧩(누르면 My n단계 그 수업) — 틀이 없으면 🔎 My에서 찾기.
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
  if (!items.length) return null;
  const label = (item: RecapItem) =>
    item.kind === "fix" ? ui.roleplayBetter : item.kind === "hint" ? `💡 ${ui.missionHint}` : ui.callRecapLooked;
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
            {item.said ? (
              <p dir="auto" className="mt-0.5 text-meta text-slate-500 line-through">
                {item.said}
              </p>
            ) : null}
            <p dir="auto" className="mt-0.5 text-note text-slate-100">
              {item.line}
            </p>
            {item.meaning ? <p className="mt-0.5 text-meta text-slate-400">{item.meaning}</p> : null}
            {item.frames.length ? (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {item.frames.map((frame) => (
                  <button
                    key={frame.id}
                    type="button"
                    onClick={() => onOpenFrame(frame)}
                    className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-meta text-slate-100 hover:bg-white/10"
                  >
                    <span aria-hidden>🧩</span>
                    <bdi dir="auto">{frame.pattern}</bdi>
                    <span className="text-slate-400">· {ui.stageNumber.replace("{n}", String(frame.stage))}</span>
                  </button>
                ))}
              </div>
            ) : (
              <FindInMy ui={ui} text={item.line} sentence={item.line} language={language} locale={locale} onDone={onLeave} />
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
