"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { fireTodayEnd, maybeShowInterstitial } from "@/lib/ads";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { NativeAdSlot, useNativeRefresh } from "@/components/NativeAdSlot";
import { sayLine } from "@/lib/speech/sayLine";
import { TTSButton } from "@/components/TTSButton";
import { usePremium } from "@/contexts/PremiumContext";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { UICopy } from "@/lib/copy";
import { fallbackTurns, lessonPassed, type FrameLesson as Lesson, type LessonStep, type LessonTurn } from "@/lib/curriculum/frameLesson";
import { noteDayResult } from "@/lib/curriculum/dayLog";
import type { Frame } from "@/lib/curriculum/frames";
import { markPracticed } from "@/lib/curriculum/practicedToday";
import { lessonQuiz, pieceOf, quizSources, type QuizQuestion } from "@/lib/curriculum/quiz";
import { notePool } from "@/lib/curriculum/exam";
import { pieceIn, type LessonScene } from "@/lib/curriculum/lessonKey";
import { growBank } from "@/lib/curriculum/qbank";
import { noteQuizLog } from "@/lib/curriculum/quizLogStore";
import { glossFor, quizGloss, SCRIPT_VOICES, type ScriptGloss } from "@/lib/curriculum/stageScripts";
import { learningLanguageSpeechTag, type LearningLanguageCode } from "@/lib/learningLanguages";
import { useAllStageGlosses } from "@/lib/curriculum/useStageGlosses";
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

/** Stagebank 표현·문법 칸 하나(2026-11-01 설계 — 문장구조 수업과 같은 화면, 퀴즈 칸 없이 설명 › 대화). */
export type LessonSubject = { key: string; kind: "expression" | "grammar"; stage: number; title?: string };
type Example = { text: string; gloss: ScriptGloss; slot?: string };

export function FrameLesson({
  ui,
  locale,
  language,
  frame,
  subject,
  scene,
  passed,
  onPassed,
  onClose,
  fromToday = false,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  /** 오늘 할 것에서 연 수업 — 닫을 때 전면 광고는 항목 사이에 없고 그날 마지막 항목일 때만(lib/ads.ts fireTodayEnd). */
  fromToday?: boolean;
  /** 문장구조 하나 — 또는 subject(표현·문법 칸). */
  frame?: Frame;
  subject?: LessonSubject;
  /** 통화 등에서 들고 온 그 문장 — 설명 맨 위 카드(2026-11-01 사용자 "그 문장을 두고 단계 학습으로 이동해서 소재를 설명"). */
  scene?: LessonScene;
  passed: boolean;
  onPassed?: (id: string) => void;
  onClose: () => void;
}) {
  const { isPremium } = usePremium();
  const tag = learningLanguageSpeechTag(language as LearningLanguageCode);
  const key = frame ? `f|${frame.id}` : subject!.key;
  const itemId = frame?.id ?? key;
  const stageOf = frame?.stage ?? subject?.stage ?? 1;
  // 예문 뜻을 앱 언어로(영어·한국어 밖 앱 언어는 서버가 옮긴 표 — 받으면 다시 그림).
  useAllStageGlosses(language, locale);
  const [step, setStep] = useState<LessonStep>("explain");
  const [lesson, setLesson] = useState<(Lesson & { title?: string }) | null | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    const url = frame
      ? apiUrl(`/api/curriculum/frame-lesson?lang=${encodeURIComponent(language)}&ui=${encodeURIComponent(locale)}&frame=${encodeURIComponent(frame.id)}`)
      : apiUrl(`/api/curriculum/item-lesson?lang=${encodeURIComponent(language)}&ui=${encodeURIComponent(locale)}&key=${encodeURIComponent(key)}`);
    const get = () =>
      fetch(url, { headers: entitlementHeaders(isPremium) })
        .then((response) => (response.ok ? response.json() : null))
        .catch(() => null)
        .then((body: { lesson?: (Lesson & { title?: string }) | null } | null) => body?.lesson ?? null);
    // 처음 만드는 틀은 모델이 한 번 실패할 수 있어 한 번만 다시 묻는다(만든 뒤엔 저장된 것이 바로 옴).
    void get()
      .then((first) => first ?? new Promise<Lesson | null>((resolve) => window.setTimeout(() => void get().then(resolve), 1500)))
      .then((lessonNow) => {
        if (alive) setLesson(lessonNow);
      });
    return () => {
      alive = false;
    };
  }, [language, locale, frame, key, isPremium]);
  useEffect(() => () => stopTts(), []);

  // ② 퀴즈: 그 틀 열쇠로 세 문제(말하기 문제는 ③이 하니 뺌).
  const [seed] = useState(() => String(Date.now() % 1000));
  // 문제은행(curriculum/qbank.ts)에 그 틀 예문을 부탁 — 설명을 읽는 동안 오면 퀴즈가 설명에 없던 문장으로(2026-11-01).
  const [grown, setGrown] = useState(0);
  const onExplain = useRef(true);
  useEffect(() => {
    void growBank(language, locale, [{ key, stage: stageOf }], (count) => {
      if (count && onExplain.current) setGrown((n) => n + 1);
    });
  }, [language, locale, key, stageOf]);
  useEffect(() => {
    onExplain.current = step === "explain";
  }, [step]);
  // 표현·문법 칸 예문: 그 소재 재료 중 내 줄 넷(소재 자리 칠함) — 문장구조는 틀 예문 넷.
  const shownExamples = useMemo<Example[]>(() => {
    if (frame) return frame.examples;
    return quizSources(language, key)
      .filter((source) => source.who !== "them" && source.piece && (source.stage === 0 || source.stage <= stageOf + 1))
      .slice(0, 4)
      // 표현은 그 표현을 칠하고, 문법 칸은 칠하지 않는다(재료의 조각은 다른 문장구조 조각이라 엉뚱한 곳이 칠해짐).
      .map((source) => ({ text: source.text, gloss: source.gloss, slot: key.startsWith("e|") ? (pieceOf(source.text, key.slice(2)) ?? undefined) : undefined }));
  }, [frame, language, key, stageOf]);
  const questions = useMemo<QuizQuestion[]>(() => {
    void grown;
    // 표현·문법 칸은 퀴즈 칸 없이 설명 › 대화(문제는 Quizbank 시험·다시 보기, 2026-11-01 설계).
    if (!frame) return [];
    // 설명에서 보여 준 예문 넷은 뒤로 — 대본 줄·문제은행 예문이 있으면 그걸로(가상 사용자 2026-11-01 easy-copy).
    // 세 문제가 같은 답을 세 번 묻지 않게: 빈칸 쓰기 · 틀린 곳 고치기 · 낱말 순서, 문제마다 다른 문장(quiz.ts lessonQuiz, 2026-11-01 U25).
    return lessonQuiz(language, `f|${frame.id}`, { seed, stage: frame.stage, later: new Set(shownExamples.map((example) => example.text)) });
  }, [language, frame, seed, shownExamples, grown]);
  const [qIndex, setQIndex] = useState(0);
  // 퀴즈 아래 네이티브 교체 번호 — 문제가 바뀔 때 앞 광고가 60초 넘었으면 새것(문제 도중에는 안 바꿈, lib/ads.ts NATIVE_REFRESH_MS).
  const adRound = useNativeRefresh(`q${qIndex}`, step === "quiz");
  const [answered, setAnswered] = useState<Answer | null>(null);
  /** 수업 퀴즈 답(맞음) — 끝나면 퀴즈 기록(quizLog)에 한 번(모두 맞히면 익힘, 2026-11-01). */
  const quizRight = useRef<boolean[]>([]);

  // ③ 대화
  const turns: LessonTurn[] = useMemo(
    () =>
      lesson?.turns?.length
        ? lesson.turns
        : frame
          ? fallbackTurns(frame, locale, language)
          : shownExamples.slice(1, 4).map((example) => ({ them: "", themGloss: "", me: example.text, meGloss: quizGloss(example.gloss, locale, language) ?? "" })),
    [lesson, frame, locale, language, shownExamples],
  );
  // Meaning line that would show the answer itself (app language = learning language, or an untranslated English gloss) → listen and say instead (RULES 11①, 2026-11-01 review).
  const turnGloss = (one: LessonTurn | undefined) => {
    if (!one?.meGloss || locale === language) return "";
    const plain = (text: string) => text.toLocaleLowerCase().replace(/[\p{P}\s]+/gu, "");
    return plain(one.meGloss) === plain(one.me) ? "" : one.meGloss;
  };
  const [tIndex, setTIndex] = useState(0);
  const [results, setResults] = useState<TalkResult[]>([]);
  const [listening, setListening] = useState(false);
  const [limited, setLimited] = useState(false);
  const hearing = useHearing();
  const sent = useRef(false);
  const [justPassed, setJustPassed] = useState(false);
  const turn = turns[tIndex];

  // 대화 차례가 바뀌면 상대 줄을 먼저 들려주고, 끝나면 바로 듣는다(2026-10-30 사용자 "말하기 버튼 없이 바로 녹음" — 차례마다 한 번, 다시는 버튼).
  const autoHeard = useRef(-1);
  const sayRef = useRef<() => Promise<void>>(async () => undefined);
  useEffect(() => {
    if (step !== "talk" || !turn) return;
    let alive = true;
    const listen = () => {
      if (!alive || autoHeard.current === tIndex) return;
      autoHeard.current = tIndex;
      void sayRef.current();
    };
    if (turn.them) void playTts(turn.them, tag, SCRIPT_VOICES.them).finally(listen);
    else window.setTimeout(listen, 250);
    return () => {
      alive = false;
    };
  }, [step, turn, tag, tIndex]);
  // 닫으면 듣던 것도 끝낸다.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => hearing.saidAll(), []);

  const finished = step === "done";
  // Logbank 그날 결과 카드(이 폰에만, curriculum/dayLog.ts, 2026-11-01).
  const logged = useRef(false);
  useEffect(() => {
    if (!finished) return;
    markPracticed(language, itemId);
    const good = lessonPassed(results, turns.length);
    if (!logged.current) {
      logged.current = true;
      // 대화에서 막힌 소재는 정기 시험 재료로(curriculum/exam.ts).
      if (!good) notePool(language, key, "stuck");
      noteDayResult(language, {
        kind: "lesson",
        item: itemId,
        title: frame?.pattern ?? lesson?.title ?? subject?.title ?? key.slice(2),
        right: results.filter((one) => one?.good).length,
        total: turns.length,
        passed: lessonPassed(results, turns.length),
        said: results.map((one) => ({ text: one?.heard ?? "", good: Boolean(one?.good) })),
      });
    }
    if (sent.current || !good) return;
    sent.current = true;
    // 표현·문법 칸: 대화를 모두 맞히면 퀴즈 기록에 맞음(익힘 — 잊을 때 시험에 다시). 서버 통과 기록은 문장구조만.
    if (!frame) {
      noteQuizLog(language, key, true);
      setJustPassed(true);
      onPassed?.(key);
      return;
    }
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
  }, [finished, results, turns.length, language, frame, itemId, key, lesson, subject, isPremium, onPassed]);

  const say = async () => {
    if (!turn || listening) return;
    stopTts();
    setListening(true);
    const { heard, practice } = await sayLine(turn.me, {
      targetLanguage: language as LearningLanguageCode,
      nativeLanguage: locale as LearningLanguageCode,
      isPremium,
      scriptId: itemId,
      mode: "recall",
      ...(turnGloss(turn) ? { meaning: turnGloss(turn) } : {}),
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
  sayRef.current = say;
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
  const hideFrame = step === "quiz" || step === "talk";
  // "이름 말하기: 제 이름은 ___예요." → "이름 말하기" — 뒤쪽은 틀을 그대로 담고 있어 답이 된다.
  const meaningText = frame ? glossFor(frame.meaning, locale) : (lesson?.meaning ?? "");
  const meaningHead = meaningText.split(/[:：]/)[0]!.replace(/\s*[(（][^)）]*[)）]/g, "").trim();
  // 표현은 표현 그대로, 문법 칸은 서버가 옮긴 이름(없으면 부르는 쪽 이름). 퀴즈·대화 단계에서 뜻이 없으면 표현 이름은 숨김(답이라서).
  const titleText = frame?.pattern ?? (key.startsWith("e|") ? key.slice(2) : subject?.title || lesson?.title || "");
  // 닫기(✕·끝 화면 "닫기" 같음): 끝까지 한 수업이면 전면 광고 — 오늘 할 것에서 연 것은 그날 마지막 항목일 때만.
  const close = () => {
    if (fromToday) fireTodayEnd();
    else if (finished) void maybeShowInterstitial("scriptEnd");
    onClose();
  };

  return (
    <FullScreenLayer>
      <header className="flex shrink-0 items-start gap-2 border-b border-line px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="min-w-0 flex-1">
          {/* Quiz and talk steps hide the pattern (user, 2026-10-30: the title gave the answer away) — only what the pattern is for. */}
          <h2 dir="auto" className="text-body font-semibold text-ink">
            {hideFrame ? meaningHead || (key.startsWith("e|") ? "" : titleText) : titleText} {passed || justPassed ? <span className="text-caption text-good">✓</span> : null}
          </h2>
          {hideFrame || !meaningText ? null : (
            <p dir="auto" className="mt-0.5 text-caption text-slate-400">
              {meaningText}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={close}
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
            {scene ? <SceneCard scene={scene} piece={pieceIn(language, key, scene.line)} tag={tag} /> : null}
            {lesson === undefined ? <p className="text-caption text-slate-400">…</p> : null}
            {/* Structured explanation (2026-10-30, user): meaning → structure (each fixed part and what it does) → usage → examples. */}
            <section data-lesson-meaning>
              <h3 className="text-meta font-semibold text-slate-400">{ui.aboutMeaning}</h3>
              <p dir="auto" className="mt-0.5 text-note text-ink">
                {lesson?.meaning || meaningText}
              </p>
            </section>
            {lesson?.parts?.length ? (
              <section data-lesson-parts>
                <h3 className="text-meta font-semibold text-slate-400">{ui.insightPattern}</h3>
                <ul className="mt-1 flex flex-col gap-1.5">
                  {/* In the order the parts appear in the pattern (the model sometimes lists the blank last). */}
                  {[...lesson.parts]
                    .sort((a, b) => partAt(frame?.pattern ?? "", a.piece) - partAt(frame?.pattern ?? "", b.piece))
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
              {shownExamples.map((example, index) => (
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
                    {/* No meaning line when it would just repeat the sentence (English learners with an untranslated app language). */}
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
            <div className="flex items-center justify-end gap-2">
              {/* The first screen shows what this lesson teaches, so a learner who knows it can skip — the next test checks it (user, 2026-11-01). */}
              {!passed && !justPassed ? (
                <button
                  type="button"
                  data-lesson-known
                  onClick={() => {
                    notePool(language, key, "claimed");
                    onClose();
                  }}
                  className="rounded-full border border-line px-4 py-1.5 text-caption text-slate-200 hover:bg-white/10"
                >
                  {ui.checkKnown}
                </button>
              ) : null}
              <button type="button" data-lesson-next onClick={goNext} className="rounded-full bg-white/90 px-5 py-1.5 text-caption font-semibold text-slate-900">
                {ui.scriptNext}
              </button>
            </div>
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
                if (answered) return;
                setAnswered(value);
                quizRight.current[qIndex] = value.correct && !value.skipped;
              }}
              bankKey={key}
              showExamples={false}
              // 수업 퀴즈는 답한 뒤 맞음/틀림을 보고 "다음"으로 넘어간다(가상 사용자 2026-11-01 — 쓰기 답이 표시 없이 넘어감), 빈칸 쓰기는 뜻 줄을 먼저(틀을 떠올릴 단서 — 틀은 이미 배움).
              autoAdvance={false}
              glossFirst
              onNext={() => {
                setAnswered(null);
                if (qIndex + 1 < questions.length) setQIndex(qIndex + 1);
                else {
                  const rights = quizRight.current.slice(0, questions.length);
                  if (rights.length) noteQuizLog(language, key, rights.length === questions.length && rights.every(Boolean));
                  quizRight.current = [];
                  goNext();
                }
              }}
            />
            {/* 수업 퀴즈 아래 빈 공간에 네이티브 하나(사용자 2026-11-01 ‘수업 퀴즈 단계에도’) — 버튼과 띄우고, 키보드가 올라오면 숨김, 문제가 바뀔 때 60초 넘었으면 새 광고. */}
            <NativeAdSlot feedId="quiz-inline" slotKey={`lesson-${itemId}-${adRound}`} spaced />
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
              {!turnGloss(turn) ? <TTSButton text={turn.me} lang={tag} voice={SCRIPT_VOICES.me} className="self-start" /> : (
              <p dir="auto" className="text-note text-slate-200">
                {ui.scriptSayPrompt.split("{line}").map((part, k) =>
                  k === 0 ? (
                    part
                  ) : (
                    <span key={k}>
                      <bdi dir="auto">{turnGloss(turn)}</bdi>
                      {part}
                    </span>
                  ),
                )}
              </p>
              )}
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
                    logged.current = false;
                    setTIndex(0);
                    setStep("talk");
                  }}
                  className="rounded-full border border-line px-4 py-1.5 text-caption text-slate-200 hover:bg-white/10"
                >
                  {ui.scriptRestart}
                </button>
              ) : null}
              <button type="button" onClick={close} className="rounded-full bg-white/90 px-5 py-1.5 text-caption font-semibold text-slate-900">
                {ui.billingClose}
              </button>
            </div>
            {/* 끝 화면 점수 아래 네이티브 하나(닫을 때 전면은 그대로) — 버튼과 한 줄 넘게 띄움. */}
            <NativeAdSlot feedId="results" slotKey={`lesson-end-${itemId}`} spaced />
          </div>
        ) : null}
      </div>
    </FullScreenLayer>
  );
}

/** 수업 맨 위 "통화에서" 카드: 앞 튜터 줄 · 내가 한 말(지움) → 고친 문장(이 소재 칠함) · 🔊. 글 설명 없이 📞만. */
function SceneCard({ scene, piece, tag }: { scene: LessonScene; piece: string | null; tag: string }) {
  const at = piece ? scene.line.indexOf(piece) : -1;
  return (
    <section data-lesson-scene className="flex flex-col gap-1 rounded-xl border border-status-learned/40 bg-status-learned/[0.06] px-3 py-2.5">
      <span aria-hidden className="text-caption">📞</span>
      {scene.before ? (
        <p dir="auto" className="text-meta text-slate-400">
          {scene.before}
        </p>
      ) : null}
      {scene.said && scene.said.trim() !== scene.line.trim() ? (
        <p dir="auto" className="text-note text-slate-500 line-through">
          {scene.said}
        </p>
      ) : null}
      <div className="flex items-start gap-2">
        <p dir="auto" className="min-w-0 flex-1 text-chat text-ink">
          {at >= 0 && piece ? (
            <>
              {scene.line.slice(0, at)}
              <span className="rounded-lg bg-status-learned/25 px-0.5">{piece}</span>
              {scene.line.slice(at + piece.length)}
            </>
          ) : (
            scene.line
          )}
        </p>
        <TTSButton text={scene.line} lang={tag} voice={SCRIPT_VOICES.me} className="shrink-0" />
      </div>
      {scene.meaning ? (
        <p dir="auto" className="text-meta text-slate-400">
          {scene.meaning}
        </p>
      ) : null}
    </section>
  );
}
