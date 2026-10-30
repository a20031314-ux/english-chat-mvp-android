"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { maybeShowInterstitial } from "@/lib/ads";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { sayLine } from "@/components/RoleplayOwnLine";
import { TTSButton } from "@/components/TTSButton";
import { usePremium } from "@/contexts/PremiumContext";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { UICopy } from "@/lib/copy";
import { fallbackTurns, lessonPassed, type FrameLesson as Lesson, type LessonStep, type LessonTurn } from "@/lib/curriculum/frameLesson";
import type { Frame } from "@/lib/curriculum/frames";
import { markPracticed } from "@/lib/curriculum/practicedToday";
import { buildQuiz, type QuizQuestion } from "@/lib/curriculum/quiz";
import { glossFor, SCRIPT_VOICES } from "@/lib/curriculum/stageScripts";
import { learningLanguageSpeechTag, type LearningLanguageCode } from "@/lib/learningLanguages";
import type { Practice } from "@/lib/roleplay/practice";
import { playTts, stopTts } from "@/lib/ttsPlayer";
import { QuestionView, type Answer } from "@/components/studyMap/QuizPlayer";
import { HearingButtons, LineGrade, useHearing } from "@/components/studyMap/StageScripts";

/**
 * 문장구조 수업(curriculum/frameLesson.ts, 2026-10-30 사용자 "일반적인 설명(문법, 구문) > 문제풀이 > 대화" → 주고받기형):
 * ① 설명 — 틀·뜻·짧은 설명(서버가 틀마다 한 번 만든 것)·예문 넷(뜻·🔊)
 * ② 퀴즈 — 그 틀 문제 세 개(빈칸·순서 등, 틀리면 설명을 다시 볼 수 있음)
 * ③ 대화 — 상대 줄을 듣고(🔊 자동) 그 틀로 대답, 뜻으로 판단(대본 "내 말로"와 같음). 원문 보기 없이 모두 맞히면 그 틀 익힘.
 */

/** 조각이 틀에서 나오는 자리(없으면 맨 뒤). */
const partAt = (pattern: string, piece: string) => (pattern.indexOf(piece) < 0 ? pattern.length : pattern.indexOf(piece));

type TalkResult = { heard: string; practice: Practice | null; good: boolean; revealed: boolean };

export function FrameLesson({
  ui,
  locale,
  language,
  frame,
  passed,
  onPassed,
  onClose,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  frame: Frame;
  passed: boolean;
  onPassed?: (id: string) => void;
  onClose: () => void;
}) {
  const { isPremium } = usePremium();
  const tag = learningLanguageSpeechTag(language as LearningLanguageCode);
  const [step, setStep] = useState<LessonStep>("explain");
  const [lesson, setLesson] = useState<Lesson | null | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    const url = apiUrl(`/api/curriculum/frame-lesson?lang=${encodeURIComponent(language)}&ui=${encodeURIComponent(locale)}&frame=${encodeURIComponent(frame.id)}`);
    const get = () =>
      fetch(url, { headers: entitlementHeaders(isPremium) })
        .then((response) => (response.ok ? response.json() : null))
        .catch(() => null)
        .then((body: { lesson?: Lesson | null } | null) => body?.lesson ?? null);
    // 처음 만드는 틀은 모델이 한 번 실패할 수 있어 한 번만 다시 묻는다(만든 뒤엔 저장된 것이 바로 옴).
    void get()
      .then((first) => first ?? new Promise<Lesson | null>((resolve) => window.setTimeout(() => void get().then(resolve), 1500)))
      .then((lessonNow) => {
        if (alive) setLesson(lessonNow);
      });
    return () => {
      alive = false;
    };
  }, [language, locale, frame.id, isPremium]);
  useEffect(() => () => stopTts(), []);

  // ② 퀴즈: 그 틀 열쇠로 세 문제(말하기 문제는 ③이 하니 뺌).
  const [seed] = useState(() => String(Date.now() % 1000));
  const questions = useMemo<QuizQuestion[]>(() => {
    const quiz = buildQuiz(language, `f|${frame.id}`, { seed, stage: frame.stage });
    return (quiz?.questions ?? []).filter((question) => question.kind !== "say").slice(0, 3);
  }, [language, frame.id, frame.stage, seed]);
  const [qIndex, setQIndex] = useState(0);
  const [answered, setAnswered] = useState<Answer | null>(null);

  // ③ 대화
  const turns: LessonTurn[] = useMemo(() => (lesson?.turns?.length ? lesson.turns : fallbackTurns(frame, locale)), [lesson, frame, locale]);
  const [tIndex, setTIndex] = useState(0);
  const [results, setResults] = useState<TalkResult[]>([]);
  const [listening, setListening] = useState(false);
  const [limited, setLimited] = useState(false);
  const hearing = useHearing();
  const sent = useRef(false);
  const [justPassed, setJustPassed] = useState(false);
  const turn = turns[tIndex];

  // 대화 차례가 바뀌면 상대 줄을 먼저 들려준다.
  useEffect(() => {
    if (step !== "talk" || !turn?.them) return;
    void playTts(turn.them, tag, SCRIPT_VOICES.them);
  }, [step, turn, tag]);

  const finished = step === "done";
  useEffect(() => {
    if (!finished) return;
    markPracticed(language, frame.id);
    if (sent.current || !lessonPassed(results, turns.length)) return;
    sent.current = true;
    void fetch(apiUrl("/api/curriculum/scripts"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
      body: JSON.stringify({ language, id: frame.id }),
    })
      .then((response) => {
        if (!response.ok) return;
        setJustPassed(true);
        onPassed?.(frame.id);
      })
      .catch(() => undefined);
  }, [finished, results, turns.length, language, frame.id, isPremium, onPassed]);

  const say = async () => {
    if (!turn || listening) return;
    stopTts();
    setListening(true);
    const { heard, practice } = await sayLine(turn.me, {
      targetLanguage: language as LearningLanguageCode,
      nativeLanguage: locale as LearningLanguageCode,
      isPremium,
      scriptId: frame.id,
      mode: "recall",
      meaning: turn.meGloss,
      ...(turn.them ? { before: turn.them } : {}),
      onLimit: () => setLimited(true),
      ...hearing.options,
    });
    setListening(false);
    const stuck = hearing.takeStuck();
    setResults((current) => {
      const next = [...current];
      next[tIndex] = { heard, practice, good: Boolean(heard) && practice?.good === true && !stuck, revealed: Boolean(current[tIndex]?.revealed) || stuck };
      return next;
    });
  };
  const reveal = () =>
    setResults((current) => {
      const next = [...current];
      next[tIndex] = { heard: current[tIndex]?.heard ?? "", practice: current[tIndex]?.practice ?? null, good: current[tIndex]?.good ?? false, revealed: true };
      return next;
    });

  const steps: { id: Exclude<LessonStep, "done">; label: string }[] = [
    { id: "explain", label: ui.explanation },
    ...(questions.length ? [{ id: "quiz" as const, label: ui.quizTag }] : []),
    { id: "talk", label: ui.homeTabTalk },
  ];
  const at = finished ? steps.length : steps.findIndex((one) => one.id === step);
  const goNext = () => {
    const nextStep = steps[at + 1]?.id ?? "done";
    setStep(nextStep);
  };
  const result = results[tIndex];
  const ok = lessonPassed(results, turns.length);

  return (
    <FullScreenLayer>
      <header className="flex shrink-0 items-start gap-2 border-b border-line px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="min-w-0 flex-1">
          <h2 dir="auto" className="text-body font-semibold text-ink">
            {frame.pattern} {passed || justPassed ? <span className="text-caption text-good">✓</span> : null}
          </h2>
          <p dir="auto" className="mt-0.5 text-caption text-slate-400">
            {glossFor(frame.meaning, locale)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (finished) void maybeShowInterstitial("scriptEnd");
            onClose();
          }}
          aria-label={ui.billingClose}
          className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10"
        >
          ✕
        </button>
      </header>
      {/* Three steps: explanation → quiz → talk (2026-10-30, user). Tapping a past step goes back to it. */}
      <ol data-lesson-steps className="flex shrink-0 items-center gap-1.5 border-b border-line px-4 py-2">
        {steps.map((one, index) => (
          <li key={one.id} className="flex items-center gap-1.5">
            {index > 0 ? <span aria-hidden className="text-meta text-slate-600 rtl:rotate-180">›</span> : null}
            <button
              type="button"
              data-lesson-step={one.id}
              disabled={index > at}
              aria-current={index === at ? "step" : undefined}
              onClick={() => setStep(one.id)}
              className={`rounded-full px-3 py-1 text-caption ${index === at ? "bg-white/90 text-slate-900" : index < at ? "border border-good/40 text-good" : "border border-line text-slate-500"}`}
            >
              {index < at ? "✓ " : ""}
              {one.label}
            </button>
          </li>
        ))}
      </ol>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {step === "explain" ? (
          <div data-lesson-explain className="flex flex-col gap-3">
            {lesson === undefined ? <p className="text-caption text-slate-400">…</p> : null}
            {/* Structured explanation (2026-10-30, user): meaning → structure (each fixed part and what it does) → usage → examples. */}
            <section data-lesson-meaning>
              <h3 className="text-meta font-semibold text-slate-400">{ui.aboutMeaning}</h3>
              <p dir="auto" className="mt-0.5 text-note text-ink">
                {lesson?.meaning || glossFor(frame.meaning, locale)}
              </p>
            </section>
            {lesson?.parts?.length ? (
              <section data-lesson-parts>
                <h3 className="text-meta font-semibold text-slate-400">{ui.insightPattern}</h3>
                <ul className="mt-1 flex flex-col gap-1.5">
                  {/* In the order the parts appear in the pattern (the model sometimes lists the blank last). */}
                  {[...lesson.parts]
                    .sort((a, b) => partAt(frame.pattern, a.piece) - partAt(frame.pattern, b.piece))
                    .map((part, index) => (
                    <li key={index} className="flex items-baseline gap-2">
                      <span dir="auto" className={`shrink-0 rounded-lg px-1.5 py-0.5 text-chat ${part.piece.includes("___") ? "border border-dashed border-status-learned/60 text-status-learned" : "bg-white/10 text-ink"}`}>
                        {part.piece}
                      </span>
                      <span dir="auto" className="min-w-0 text-note text-slate-300">
                        {part.role}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : lesson?.explain?.length ? (
              <ul className="flex flex-col gap-1.5 rounded-xl border border-line bg-surface-sunk px-3 py-2.5">
                {lesson.explain.map((line, index) => (
                  <li key={index} dir="auto" className="text-note text-slate-200">
                    {line}
                  </li>
                ))}
              </ul>
            ) : null}
            {lesson?.usage ? (
              <section data-lesson-usage>
                <h3 className="text-meta font-semibold text-slate-400">{ui.aboutUsage}</h3>
                <p dir="auto" className="mt-0.5 text-note text-slate-200">
                  {lesson.usage}
                </p>
              </section>
            ) : null}
            <h3 className="-mb-1 text-meta font-semibold text-slate-400">{ui.example}</h3>
            <ul className="flex flex-col gap-2">
              {frame.examples.map((example, index) => (
                <li key={index} className="flex items-start gap-2 rounded-xl bg-white/[0.06] px-3 py-2">
                  <span className="min-w-0 flex-1">
                    <span dir="auto" className="block text-chat text-ink">
                      {example.slot && example.text.includes(example.slot) ? (
                        <>
                          {example.text.slice(0, example.text.indexOf(example.slot))}
                          <span className="rounded-lg bg-status-learned/25 px-0.5">{example.slot}</span>
                          {example.text.slice(example.text.indexOf(example.slot) + example.slot.length)}
                        </>
                      ) : (
                        example.text
                      )}
                    </span>
                    <span dir="auto" className="mt-0.5 block text-meta text-slate-400">
                      {glossFor(example.gloss, locale)}
                    </span>
                  </span>
                  <TTSButton text={example.text} lang={tag} voice={SCRIPT_VOICES.me} className="shrink-0" />
                </li>
              ))}
            </ul>
            <button type="button" data-lesson-next onClick={goNext} className="self-end rounded-full bg-white/90 px-5 py-1.5 text-caption font-semibold text-slate-900">
              {ui.scriptNext}
            </button>
          </div>
        ) : null}

        {step === "quiz" && questions[qIndex] ? (
          <div data-lesson-quiz>
            <p className="mb-1 text-meta tabular-nums text-slate-500">
              {qIndex + 1}/{questions.length}
            </p>
            <QuestionView
              key={qIndex}
              ui={ui}
              locale={locale}
              language={language}
              question={questions[qIndex]!}
              answered={answered}
              onAnswer={(value) => {
                if (!answered) setAnswered(value);
              }}
              onNext={() => {
                setAnswered(null);
                if (qIndex + 1 < questions.length) setQIndex(qIndex + 1);
                else goNext();
              }}
            />
          </div>
        ) : null}

        {step === "talk" && turn ? (
          <div data-lesson-talk className="flex flex-col gap-2">
            <p className="text-meta tabular-nums text-slate-500">
              {tIndex + 1}/{turns.length}
            </p>
            {turn.them ? (
              <div className="flex items-start gap-2 self-start rounded-2xl bg-white/10 px-3 py-2">
                <span className="min-w-0">
                  <span dir="auto" className="block text-chat text-slate-100">
                    {turn.them}
                  </span>
                  <span dir="auto" className="mt-0.5 block text-meta text-slate-400">
                    {turn.themGloss}
                  </span>
                </span>
                <TTSButton text={turn.them} lang={tag} voice={SCRIPT_VOICES.them} className="shrink-0" />
              </div>
            ) : null}
            <div className="flex flex-col gap-1 self-end rounded-2xl border border-amber-300/40 bg-amber-300/[0.06] px-3 py-2 sm:max-w-[85%]">
              <p dir="auto" className="text-note text-slate-200">
                {ui.scriptSayPrompt.split("{line}").map((part, k) =>
                  k === 0 ? (
                    part
                  ) : (
                    <span key={k}>
                      <bdi dir="auto">{turn.meGloss}</bdi>
                      {part}
                    </span>
                  ),
                )}
              </p>
              <p dir="auto" className="text-meta text-slate-500">
                {frame.pattern}
              </p>
              {result?.heard ? (
                <p dir="auto" className="text-chat text-slate-100">
                  {result.heard}
                </p>
              ) : null}
              {result ? (
                result.good ? (
                  <LineGrade ui={ui} exact={false} unclear={[]} practice={result.practice} />
                ) : result.practice?.note ? (
                  <p className="text-note text-slate-200">{result.practice.note}</p>
                ) : null
              ) : null}
              {result?.revealed || result?.good || (result && !result.good) ? (
                <div className="flex items-start gap-2">
                  <p dir="auto" className="min-w-0 flex-1 text-chat text-emerald-200">→ {result?.practice?.better && !result.good ? result.practice.better : turn.me}</p>
                  <TTSButton text={turn.me} lang={tag} voice={SCRIPT_VOICES.me} className="shrink-0" />
                </div>
              ) : null}
              {limited ? <p className="text-caption text-warn">{ui.scriptLimit}</p> : null}
              {!limited ? (
                <div className="mt-1 flex flex-wrap justify-end gap-1.5">
                  {listening ? <HearingButtons ui={ui} hearing={hearing} /> : null}
                  {!result ? (
                    <button type="button" onClick={reveal} className="rounded-full border border-line px-3 py-1.5 text-caption text-slate-300 hover:bg-white/10">
                      {ui.scriptReveal}
                    </button>
                  ) : null}
                  {result && !result.good ? (
                    <button type="button" onClick={() => void say()} disabled={listening} className="rounded-full border border-line px-3 py-1.5 text-caption text-slate-200 hover:bg-white/10 disabled:opacity-50">
                      {listening ? ui.roleplayPracticeListening : ui.roleplayPracticeRetry}
                    </button>
                  ) : null}
                  {result && (result.good || result.heard) ? (
                    <button
                      type="button"
                      data-lesson-talk-next
                      onClick={() => (tIndex + 1 < turns.length ? setTIndex(tIndex + 1) : setStep("done"))}
                      className="rounded-full bg-white/90 px-3 py-1.5 text-caption font-semibold text-slate-900"
                    >
                      {ui.scriptNext}
                    </button>
                  ) : null}
                  {!result || (result.revealed && !result.heard) ? (
                    <button type="button" data-lesson-say onClick={() => void say()} disabled={listening} className="rounded-full bg-white/90 px-4 py-1.5 text-caption font-semibold text-slate-900 disabled:opacity-60">
                      {listening ? ui.roleplayPracticeListening : ui.scriptSay}
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {finished ? (
          <div data-lesson-done className="mt-4 flex flex-col items-center gap-3">
            <p className="text-note text-slate-200">{ok || justPassed ? `✓ ${ui.scriptPassed}` : ui.scriptDone}</p>
            <div className="flex gap-2">
              {!ok ? (
                <button
                  type="button"
                  onClick={() => {
                    setResults([]);
                    setTIndex(0);
                    setStep("talk");
                  }}
                  className="rounded-full border border-line px-4 py-1.5 text-caption text-slate-200 hover:bg-white/10"
                >
                  {ui.scriptRestart}
                </button>
              ) : null}
              <button type="button" onClick={onClose} className="rounded-full bg-white/90 px-5 py-1.5 text-caption font-semibold text-slate-900">
                {ui.billingClose}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </FullScreenLayer>
  );
}
