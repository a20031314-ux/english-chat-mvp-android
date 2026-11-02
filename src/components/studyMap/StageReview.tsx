"use client";

/**
 * Stagebank 단계 돌아보기(2026-11-02 사용자 "학습완료한 단계, 스킵한 단계는 오른쪽 파일처럼 쭉 펼쳐서 결과를 보게"):
 * 지나온 단계(끝냈거나 건너뛴)의 문장구조 수업을 한 장에 모두 펼친다 — 고정 수업(조각 표·어순·흔한 실수·퀴즈·대화)에
 * 이 폰의 내 결과를 겹쳐서: 익힘 ✓ · 알아요로 넘김 · 아직, 수업 퀴즈 맞음/틀림, 대화에서 내가 쓴 줄 ✓✗.
 * 수업 내용은 /api/curriculum/fixed-lesson?stage=n(만들지 않고 있는 것만), 결과는 이 폰(dayLog·quizLog·exam pool)과 서버 통과 목록.
 * ▶ 누르면 그 수업을 다시(openLesson).
 */
import { useEffect, useMemo, useState } from "react";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { FixedExplain } from "@/components/studyMap/FixedExplain";
import { TTSButton } from "@/components/TTSButton";
import { apiUrl } from "@/lib/apiBase";
import { openLesson } from "@/lib/appIntents";
import type { UICopy } from "@/lib/copy";
import { readDayResults } from "@/lib/curriculum/dayLog";
import { readPool } from "@/lib/curriculum/exam";
import type { FixedLesson as Fixed, FixedQuiz } from "@/lib/curriculum/fixedLessons/check";
import { framesFor } from "@/lib/curriculum/frames";
import { readQuizLog } from "@/lib/curriculum/quizLogStore";
import { glossFor, quizGloss, SCRIPT_VOICES } from "@/lib/curriculum/stageScripts";
import { learningLanguageSpeechTag, type LearningLanguageCode } from "@/lib/learningLanguages";

type Status = "learned" | "claimed" | "open";

export function StageReview({ ui, locale, language, stage, passed, onClose }: { ui: UICopy; locale: string; language: string; stage: number; passed: readonly string[]; onClose: () => void }) {
  const frames = useMemo(() => framesFor(language, stage), [language, stage]);
  const [lessons, setLessons] = useState<Record<string, Fixed> | null>(null);
  useEffect(() => {
    let alive = true;
    void fetch(apiUrl(`/api/curriculum/fixed-lesson?lang=${encodeURIComponent(language)}&ui=${encodeURIComponent(locale)}&stage=${stage}`))
      .then((response) => (response.ok ? response.json() : null))
      .catch(() => null)
      .then((body: { lessons?: Record<string, Fixed> } | null) => {
        if (alive) setLessons(body?.lessons ?? {});
      });
    return () => {
      alive = false;
    };
  }, [language, locale, stage]);
  // 이 폰의 결과(열 때 한 번 읽음 — 이 화면에서 바뀌는 것 없음).
  const [mine] = useState(() => {
    const pool = readPool(language);
    const quiz = readQuizLog(language);
    const days = readDayResults(language).filter((one) => one.kind === "lesson");
    return { pool, quiz, days };
  });
  const tag = learningLanguageSpeechTag(language as LearningLanguageCode);
  const statusOf = (id: string): Status => (passed.includes(id) ? "learned" : mine.pool[`f|${id}`]?.r.includes("claimed") ? "claimed" : "open");
  const counts = frames.reduce((acc, frame) => ({ ...acc, [statusOf(frame.id)]: (acc[statusOf(frame.id)] ?? 0) + 1 }), {} as Partial<Record<Status, number>>);

  return (
    <FullScreenLayer>
      {/* 포털이라도 누름은 React 트리로 올라가 뒤의 My 칸 크게 보기(enlargeOnTap)가 받는다 — 여기서 멈춤. */}
      <div className="contents" onClick={(event) => event.stopPropagation()}>
      <header className="flex shrink-0 items-center gap-2 border-b border-line px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <h2 className="min-w-0 flex-1 text-body font-semibold text-ink">
          {ui.stageNumber.replace("{n}", String(stage))} · {ui.stageReview}
        </h2>
        <span data-review-counts className="shrink-0 text-caption tabular-nums text-slate-400">
          <span className="text-good">✓ {counts.learned ?? 0}</span>
          {counts.claimed ? <span className="ms-2">↷ {counts.claimed}</span> : null}
          <span className="ms-2">○ {counts.open ?? 0}</span>
        </span>
        <button type="button" onClick={onClose} aria-label={ui.billingClose} className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10">
          ✕
        </button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {lessons === null ? <p className="text-caption text-slate-400">…</p> : null}
        <ol className="flex flex-col gap-6">
          {frames.map((frame, index) => {
            const status = statusOf(frame.id);
            const fixed = lessons?.[frame.id];
            const quizLog = mine.quiz[`f|${frame.id}`];
            const said = mine.days.filter((one) => one.item === frame.id).sort((a, b) => b.at - a.at)[0]?.said ?? [];
            return (
              <li key={frame.id} data-review-frame={frame.id} data-review-status={status} className="flex flex-col gap-3 border-b border-line pb-6 last:border-0">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 w-6 shrink-0 text-caption tabular-nums text-slate-500">{index + 1}</span>
                  <div className="min-w-0 flex-1">
                    <h3 dir="auto" className="text-note font-semibold text-ink">
                      {frame.pattern}{" "}
                      {status === "learned" ? <span className="text-caption text-good">✓</span> : status === "claimed" ? <span className="text-caption text-slate-400">↷ {ui.checkKnown}</span> : <span className="text-caption text-slate-500">○</span>}
                    </h3>
                    <p dir="auto" className="mt-0.5 text-caption text-slate-400">
                      {fixed?.meaning || glossFor(frame.meaning, locale)}
                    </p>
                  </div>
                  <button
                    type="button"
                    data-review-open
                    aria-label={`${frame.pattern} ▶`}
                    title={frame.pattern}
                    onClick={() => openLesson({ language, key: `f|${frame.id}` })}
                    className={`shrink-0 rounded-full px-3 py-1 text-caption font-semibold ${status === "learned" ? "border border-line text-slate-200" : "bg-white/90 text-slate-900"}`}
                  >
                    ▶
                  </button>
                </div>
                {fixed ? (
                  <>
                    <FixedExplain fixed={fixed} ui={ui} tag={tag} />
                    <section data-review-quiz>
                      <h3 className="text-meta font-semibold text-slate-400">
                        {ui.quizTag} {quizLog ? quizLog.last ? <span className="text-good">✓</span> : <span className="text-warn">✗</span> : null}
                      </h3>
                      <ul className="mt-1 flex flex-col gap-1.5">
                        {fixed.quiz.map((q, at) => (
                          <QuizSolved key={at} q={q} />
                        ))}
                      </ul>
                    </section>
                    <section data-review-talk>
                      <h3 className="text-meta font-semibold text-slate-400">{ui.homeTabTalk}</h3>
                      <ul className="mt-1 flex flex-col gap-2">
                        {fixed.turns.map((turn, at) => {
                          const mineLine = said[at];
                          return (
                            <li key={at} className="flex flex-col gap-1 rounded-xl bg-white/[0.04] px-3 py-2">
                              <span dir="auto" className="text-chat text-slate-300">
                                {turn.them}
                              </span>
                              <span className="flex items-start gap-2">
                                <span className="min-w-0 flex-1">
                                  <span dir="auto" className="block text-chat text-ink">
                                    {turn.me}
                                  </span>
                                  <span dir="auto" className="block text-meta text-slate-500">
                                    {turn.meGloss}
                                  </span>
                                </span>
                                <TTSButton text={turn.me} lang={tag} voice={SCRIPT_VOICES.me} className="shrink-0" />
                              </span>
                              {mineLine?.text ? (
                                <span data-review-said dir="auto" className={`text-caption ${mineLine.good ? "text-good" : "text-warn"}`}>
                                  {mineLine.good ? "✓" : "✗"} {mineLine.text}
                                </span>
                              ) : null}
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                  </>
                ) : (
                  <ul className="flex flex-col gap-1.5">
                    {frame.examples.slice(0, 4).map((example, at) => (
                      <li key={at} className="flex items-start gap-2 rounded-xl bg-white/[0.06] px-3 py-2">
                        <span className="min-w-0 flex-1">
                          <span dir="auto" className="block text-chat text-ink">
                            {example.text}
                          </span>
                          {quizGloss(example.gloss, locale, language) ? (
                            <span dir="auto" className="mt-0.5 block text-meta text-slate-400">
                              {quizGloss(example.gloss, locale, language)}
                            </span>
                          ) : null}
                        </span>
                        <TTSButton text={example.text} lang={tag} voice={SCRIPT_VOICES.me} className="shrink-0" />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ol>
      </div>
      </div>
    </FullScreenLayer>
  );
}

/** 퀴즈 한 문제를 푼 꼴로: 빈칸에 정답을 칠해 넣고, 고치기는 틀린 곳 → 바른 꼴. */
function QuizSolved({ q }: { q: FixedQuiz }) {
  const filled = (before: string, answer: string, after: string) => (
    <>
      {before}
      <span className="rounded-lg bg-status-learned/20 px-1 text-status-learned">{answer}</span>
      {after}
    </>
  );
  return (
    <li className="rounded-xl bg-white/[0.04] px-3 py-2">
      <span dir="auto" className="block text-chat text-ink">
        {q.kind === "type" ? (
          filled(q.before, q.answer, q.after)
        ) : q.kind === "choose" ? (
          filled(q.before, q.options[q.answer] ?? "", q.after)
        ) : (
          <>
            <span className="text-warn line-through">{q.bad}</span>
            <span className="mx-1 text-slate-500">→</span>
            <span className="text-status-learned">{/^\((빼기|remove|削除|삭제)\)$/i.test(q.right.trim()) ? "∅" : q.right}</span>
            <span className="ms-2 text-slate-400">{q.wrong}</span>
          </>
        )}
      </span>
      <span dir="auto" className="mt-0.5 block text-meta text-slate-500">
        {q.cue}
      </span>
    </li>
  );
}
