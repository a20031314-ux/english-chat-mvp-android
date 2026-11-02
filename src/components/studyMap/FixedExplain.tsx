"use client";

import { TTSButton } from "@/components/TTSButton";
import type { UICopy } from "@/lib/copy";
import type { FixedLesson as Fixed } from "@/lib/curriculum/fixedLessons/check";
import { SCRIPT_VOICES } from "@/lib/curriculum/stageScripts";

/**
 * 고정 수업 설명(2026-11-02 사용자 "어느 부분이 ~가 되고 어떻게 이어지는지, 흔한 실수도 왜 틀리는지"):
 * 대표 예문 → 조각 · 앱 언어 · 하는 일 세 칸 표 → 어순 · 쓰임 · 대답 → 흔한 실수(틀린 꼴 → 바른 꼴 · 까닭).
 */
export function FixedExplain({ fixed, ui, tag }: { fixed: Fixed; ui: UICopy; tag: string }) {
  return (
    <>
      <section data-lesson-sample className="flex items-start gap-2 rounded-xl border border-status-learned/40 bg-status-learned/[0.06] px-3 py-2">
        <span className="min-w-0 flex-1">
          <span dir="auto" className="block text-chat font-semibold text-ink">
            {fixed.sample.text}
          </span>
          <span dir="auto" className="mt-0.5 block text-meta text-slate-400">
            {fixed.sample.gloss}
          </span>
        </span>
        <TTSButton text={fixed.sample.text} lang={tag} voice={SCRIPT_VOICES.me} className="shrink-0" />
      </section>
      <section data-lesson-map>
        <h3 className="text-meta font-semibold text-slate-400">{ui.insightPattern}</h3>
        <table className="mt-1 w-full border-separate border-spacing-y-1 text-note">
          <thead>
            <tr className="text-meta text-slate-500">
              <th className="pe-2 text-start font-normal">{ui.lessonPiece}</th>
              <th className="pe-2 text-start font-normal">{ui.aboutMeaning}</th>
              <th className="text-start font-normal">{ui.lessonRole}</th>
            </tr>
          </thead>
          <tbody>
            {fixed.map.map((row, index) => (
              <tr key={index} data-lesson-map-row className="align-baseline">
                <td className="pe-2">
                  <span dir="auto" className="inline-block whitespace-nowrap rounded-lg bg-white/10 px-1.5 py-0.5 text-chat text-ink">
                    {row.piece}
                  </span>
                </td>
                <td dir="auto" className="pe-2 text-status-learned">
                  {row.ui}
                </td>
                <td dir="auto" className="text-slate-300">
                  {row.role}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {[
        ["order", ui.lessonOrder, fixed.order],
        ["usage", ui.aboutUsage, fixed.slot],
        ["reply", ui.lessonReply, fixed.reply ?? ""],
      ]
        .filter(([, , text]) => text.trim())
        .map(([id, title, text]) => (
          <section key={id} data-lesson-fixed={id}>
            <h3 className="text-meta font-semibold text-slate-400">{title}</h3>
            <p dir="auto" className="mt-0.5 text-note text-slate-200">
              {text}
            </p>
          </section>
        ))}
      {fixed.mistakes.length ? (
        <section data-lesson-mistakes>
          <h3 className="text-meta font-semibold text-slate-400">{ui.lessonMistakes}</h3>
          <ul className="mt-1 flex flex-col gap-1.5">
            {fixed.mistakes.map((one, index) => (
              <li key={index} className="rounded-xl bg-white/[0.06] px-3 py-2">
                <span dir="auto" className="block text-chat">
                  <span className="text-warn line-through">{one.wrong}</span>
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
    </>
  );
}
