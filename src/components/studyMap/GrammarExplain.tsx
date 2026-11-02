"use client";

/**
 * 문법 한 장 설명(2026-11-03 사용자 "문법 설명 넣어줘", curriculum/fixedLessons/grammar.ts):
 * 규칙 → 꼴 표(원래 꼴 → 바뀐 꼴 · 한 줄) → 예외 → 쓰임 → 흔한 실수(틀린 꼴 → 바른 꼴 · 까닭) → 이 문법을 쓰는 문장구조(누르면 그 수업).
 * 문장구조 수업 설명(FixedExplain)과 같은 칸 모양.
 */
import { openLesson } from "@/lib/appIntents";
import type { UICopy } from "@/lib/copy";
import type { GrammarLesson } from "@/lib/curriculum/fixedLessons/grammar";
import { allFramesFor } from "@/lib/curriculum/frames";

export function GrammarExplain({ page, ui, language }: { page: GrammarLesson; ui: UICopy; language: string }) {
  const [stage, index] = page.key.slice(2).split(":").map(Number);
  const frames = allFramesFor(language).filter((frame) => frame.stage === stage && (frame.grammar ?? []).includes(index!));
  return (
    <>
      <section data-grammar-rule>
        <h3 className="text-meta font-semibold text-slate-400">{ui.aboutMeaning}</h3>
        <p dir="auto" className="mt-0.5 text-note text-ink">
          {page.rule}
        </p>
      </section>
      <section data-grammar-forms>
        <h3 className="text-meta font-semibold text-slate-400">{ui.insightPattern}</h3>
        <ul className="mt-1 flex flex-col gap-1">
          {page.forms.map((row, at) => (
            <li key={at} className="flex flex-wrap items-baseline gap-x-2 rounded-xl bg-white/[0.04] px-3 py-1.5">
              <span dir="auto" className="text-chat text-slate-300">
                {row.from}
              </span>
              <span aria-hidden className="text-slate-500 rtl:rotate-180">→</span>
              <span dir="auto" className="text-chat font-semibold text-status-learned">
                {row.to}
              </span>
              <span dir="auto" className="min-w-0 basis-full text-meta text-slate-400 sm:basis-auto">
                {row.note}
              </span>
            </li>
          ))}
        </ul>
        {page.exceptions?.trim() ? (
          <p dir="auto" className="mt-1 text-note text-slate-300">
            ⚠ {page.exceptions}
          </p>
        ) : null}
      </section>
      <section data-grammar-usage>
        <h3 className="text-meta font-semibold text-slate-400">{ui.aboutUsage}</h3>
        <p dir="auto" className="mt-0.5 text-note text-slate-200">
          {page.usage}
        </p>
      </section>
      {page.mistakes.length ? (
        <section data-grammar-mistakes>
          <h3 className="text-meta font-semibold text-slate-400">{ui.lessonMistakes}</h3>
          <ul className="mt-1 flex flex-col gap-1.5">
            {page.mistakes.map((one, at) => (
              <li key={at} className="rounded-xl bg-white/[0.06] px-3 py-2">
                <span dir="auto" className="block text-chat">
                  <span className="text-bad line-through">{one.wrong}</span>
                  <span className="mx-1.5 text-slate-500">→</span>
                  <span className="text-status-learned">{one.right}</span>
                </span>
                <span dir="auto" className="mt-0.5 block text-meta text-slate-400">
                  {one.why}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {frames.length ? (
        <section data-grammar-frames>
          <h3 className="text-meta font-semibold text-slate-400">🧩 {ui.framesTitle}</h3>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {frames.map((frame) => (
              <button
                key={frame.id}
                type="button"
                onClick={() => openLesson({ language, key: `f|${frame.id}` })}
                className="rounded-full border border-line px-3 py-1 text-caption text-slate-200 hover:bg-white/10"
              >
                <bdi dir="auto">{frame.pattern}</bdi>
              </button>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
