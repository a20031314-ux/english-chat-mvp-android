"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { maybeShowInterstitial } from "@/lib/ads";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { Attempt } from "@/components/RoleplayReview";
import { sayLine } from "@/components/RoleplayOwnLine";
import { TTSButton } from "@/components/TTSButton";
import { HearingButtons, LineGrade, PauseChips, useHearing } from "@/components/studyMap/StageScripts";
import { usePremium } from "@/contexts/PremiumContext";
import type { UICopy } from "@/lib/copy";
import { buildQuiz, joinWords, orderCorrect, quizPassed, unitPassed, type QuizCard, type QuizMix, type QuizQuestion, type QuizStyle } from "@/lib/curriculum/quiz";
import { quizGloss, SCRIPT_VOICES } from "@/lib/curriculum/stageScripts";
import { useAllStageGlosses } from "@/lib/curriculum/useStageGlosses";
import { readKindLog, saveKind, styleKinds } from "@/lib/curriculum/learnStyle";
import { learningLanguageSpeechTag, type LearningLanguageCode } from "@/lib/learningLanguages";
import { compareToTarget, type Practice, type WordOutcome } from "@/lib/roleplay/practice";
import { stopTts } from "@/lib/ttsPlayer";

/**
 * 약한 곳 퀴즈(lib/curriculum/quiz.ts, 2026-10-28 사용자 "틀린 부분을 퀴즈로"): 오늘 할 것의 "퀴즈" 칸을 누르면 열린다.
 * 문제 셋(틀린 낱말 누르기·빈칸 고르기·순서 맞추기 → 말하기). 첫 답만 점수로 센다(말하기는 다시 해 볼 수 있음).
 * 끝나면 onDone(맞음) — 부르는 쪽이 다시 볼 것에 반영한다. 틀렸으면 이어서 원래 대본(onThen).
 */

/** skipped = 말하기 한도에 걸려 못 함 — 점수에서 뺀다. */
export type Answer = { correct: boolean; heard?: string; practice?: Practice | null; unclear?: string[]; skipped?: boolean; pauses?: [string, number][] };

export function QuizPlayer({
  ui,
  locale,
  language,
  quizKey,
  title,
  card,
  seed,
  round,
  stage,
  onDone,
  onThen,
  onClose,
  reason,
  onMore,
  stopHint = false,
  mix,
  style,
  unit,
  bundleKeys,
  onBundle,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  quizKey: string;
  /** 머리에 보일 열쇠 이름(문장구조 틀·표현·문법 칸). */
  title: string;
  card?: QuizCard;
  /** 그날(같은 날 다시 열면 같은 문제). */
  seed: string;
  /** 이 열쇠를 이 폰에서 푼 횟수(quizLog n). */
  round?: number;
  /** 지금 단계 — 예문을 이 단계 + 1까지에서(curriculum/quiz.ts buildQuiz). */
  stage?: number;
  onDone: (passed: boolean) => void;
  /** 틀렸을 때 원래 대본·문장구조로 — 없으면 버튼 없음. */
  onThen?: () => void;
  onClose: () => void;
  /** 계속 공부에서 연 퀴즈: 왜 이 문제인지(다시·틀렸던 것·부족 · 문법·곧 나옴·다지기). */
  reason?: string;
  /** 끝나면 "다음 문제" — 다음 필요한 것으로(lib/curriculum/nextStudy.ts). 없으면 버튼 없음. */
  onMore?: () => void;
  /** 연달아 두 번 틀림: 다음 문제보다 원래 대본을 앞에. */
  stopHint?: boolean;
  /** 학습 조합(curriculum/quiz.ts QuizMix) — 말하기·듣기·읽기 위주면 그 모양으로. */
  mix?: QuizMix;
  /** 복습에서 고른 문제 모양 — 셋 다 이 모양으로(조합 mix보다 앞섬). */
  style?: QuizStyle;
  /** 대본 하나를 문제 묶음으로(buildUnit) — 있으면 열쇠 퀴즈 대신 이것, 70% 넘으면 넘김. */
  unit?: readonly QuizQuestion[];
  /** 묶음 퀴즈(curriculum/quiz.ts bundleQuiz): unit 문제마다의 열쇠 — 끝나면 onBundle로 열쇠마다 결과. */
  bundleKeys?: readonly string[];
  onBundle?: (results: { key: string; correct: boolean; skipped: boolean }[]) => void;
}) {
  // round: 이 열쇠를 몇 번 풀었나 — 매번 다른 줄·다른 모양(curriculum/quiz.ts buildQuiz). 연 동안은 고정.
  const [opened] = useState(() => round);
  // "알아서"(또는 조합 없음): 이 항목에 맞는 모양 + 이 사람이 약한 모양을 앞에(curriculum/learnStyle.ts). 연 동안 고정.
  const [kinds] = useState(() => (style ? [style, style, style] : unit || (mix && mix !== "auto") ? undefined : styleKinds(language, quizKey, readKindLog(language))));
  const quiz = useMemo(
    () => (unit ? { key: quizKey, questions: [...unit] } : buildQuiz(language, quizKey, { card, seed, round: opened, mix: style ? undefined : mix, kinds, stage })),
    [language, quizKey, card, seed, opened, mix, style, unit, kinds, stage],
  );
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const reported = useRef(false);
  const questions = useMemo(() => quiz?.questions ?? [], [quiz]);
  const done = index >= questions.length;
  // 끝까지 푼 퀴즈를 닫을 때만 전면 광고(무료·안드로이드, 간격은 lib/ads.ts).
  const closeQuiz = () => {
    if (done && questions.length) void maybeShowInterstitial("quizEnd");
    onClose();
  };
  const correct = Object.values(answers).filter((answer) => answer.correct).length;
  const counted = questions.length - Object.values(answers).filter((answer) => answer.skipped).length;
  const passed = unit ? unitPassed(correct, counted) : quizPassed(correct, counted);

  useEffect(() => {
    if (!done || reported.current || !questions.length) return;
    reported.current = true;
    if (bundleKeys && onBundle) {
      onBundle(questions.map((_, i) => ({ key: bundleKeys[i] ?? quizKey, correct: Boolean(answers[i]?.correct), skipped: Boolean(answers[i]?.skipped) })));
      return;
    }
    if (counted > 0) onDone(passed);
  }, [done, questions, counted, passed, onDone, bundleKeys, onBundle, answers, quizKey]);
  useEffect(() => () => stopTts(), []);

  const answer = (value: Answer) => {
    if (answers[index]) return;
    // 모양별 기록(이 폰): 다음에 이 열쇠의 약한 모양을 앞에(curriculum/learnStyle.ts). 묶음·건너뛴 말하기는 빼고.
    const kind = questions[index]?.kind;
    if (!unit && kind && !value.skipped) saveKind(language, quizKey, kind, value.correct);
    setAnswers((current) => (current[index] ? current : { ...current, [index]: value }));
  };
  const question = questions[index];

  return (
    <FullScreenLayer>
      <header className="flex shrink-0 items-start gap-2 border-b border-line px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="min-w-0 flex-1">
          <h2 dir="auto" className="truncate text-body font-semibold text-ink">
            {/* A quiz shows no key in its title (2026-10-29, user: the title gave the answer away); a script unit keeps its scene name. */}
            {unit && !bundleKeys ? <bdi>{title}</bdi> : <span className="text-warn">{ui.quizTag}</span>}
          </h2>
          <p className="mt-0.5 text-caption tabular-nums text-slate-400">
            {Math.min(index + 1, questions.length)}/{questions.length}
            {reason ? <span className="text-slate-500"> · {reason}</span> : null}
          </p>
        </div>
        <button type="button" onClick={closeQuiz} aria-label={ui.billingClose} className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10">
          ✕
        </button>
      </header>
      <div data-quiz className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {question ? (
          <QuestionView
            key={index}
            ui={ui}
            locale={locale}
            language={language}
            question={question}
            answered={answers[index] ?? null}
            onAnswer={answer}
            onNext={() => setIndex((n) => n + 1)}
          />
        ) : null}
        {done && questions.length ? (
          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="text-body font-semibold text-ink">{passed ? `✓ ${ui.quizRight}` : ui.quizWrong}</p>
            <p className="text-caption tabular-nums text-slate-400">{ui.quizScore.replace("{n}", String(correct)).replace("{m}", String(counted))}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {!passed && onThen ? (
                <button
                  type="button"
                  onClick={onThen}
                  className={`rounded-full px-4 py-1.5 text-caption font-semibold ${!onMore || stopHint ? "bg-white/90 text-slate-900" : "border border-line text-slate-200 hover:bg-white/10"}`}
                >
                  {ui.quizToScript}
                </button>
              ) : null}
              {onMore ? (
                <button
                  type="button"
                  onClick={onMore}
                  className={`rounded-full px-4 py-1.5 text-caption font-semibold ${!passed && onThen && stopHint ? "border border-line text-slate-200 hover:bg-white/10" : "bg-white/90 text-slate-900"}`}
                >
                  {ui.quizNext} ›
                </button>
              ) : null}
              <button type="button" onClick={closeQuiz} className="rounded-full border border-line px-4 py-1.5 text-caption text-slate-200 hover:bg-white/10">
                {ui.billingClose}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </FullScreenLayer>
  );
}

function kindName(ui: UICopy, kind: QuizQuestion["kind"]): string {
  return { fix: ui.quizKindFix, choose: ui.quizKindChoose, order: ui.quizKindOrder, say: ui.quizKindSay, meaning: ui.quizKindMeaning }[kind];
}

export function QuestionView({
  ui,
  locale,
  language,
  question,
  answered,
  onAnswer,
  onNext,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  question: QuizQuestion;
  answered: Answer | null;
  onAnswer: (answer: Answer) => void;
  onNext: () => void;
}) {
  const tag = learningLanguageSpeechTag(language as LearningLanguageCode);
  // 여러 단계 문장이 섞여 나오니 모든 단계 뜻풀이를 앱 언어로 받아 둔다(받으면 다시 그림).
  useAllStageGlosses(language, locale);
  // Tap-to-pick answers that are right move on by themselves (first run had ~20 taps to the first script, 2026-10-29).
  // Wrong answers stay so the right one can be read; say/order keep the button.
  const autoNext = Boolean(answered?.correct && !answered.skipped && (question.kind === "choose" || question.kind === "meaning"));
  const nextRef = useRef(onNext);
  useEffect(() => {
    nextRef.current = onNext;
  });
  useEffect(() => {
    if (!autoNext) return;
    const timer = window.setTimeout(() => nextRef.current(), 900);
    return () => window.clearTimeout(timer);
  }, [autoNext, question]);
  return (
    <section data-kind={question.kind} className="flex flex-col gap-3">
      <span className="self-start rounded-full border border-line px-2.5 py-0.5 text-meta text-slate-400">{kindName(ui, question.kind)}</span>
      {question.kind === "fix" ? <FixView question={question} answered={answered} onAnswer={onAnswer} tag={tag} /> : null}
      {question.kind === "choose" ? <ChooseView locale={locale} language={language} question={question} answered={answered} onAnswer={onAnswer} tag={tag} /> : null}
      {question.kind === "order" ? <OrderView ui={ui} locale={locale} language={language} question={question} answered={answered} onAnswer={onAnswer} tag={tag} /> : null}
      {question.kind === "meaning" ? (
        <PickView locale={locale} language={language} question={question} answered={answered} onAnswer={onAnswer} tag={tag} />
      ) : null}
      {question.kind === "say" ? <SayView ui={ui} locale={locale} language={language} question={question} answered={answered} onAnswer={onAnswer} tag={tag} /> : null}
      {answered ? (
        <div className="flex items-center justify-between gap-2">
          <span className={`text-note font-semibold ${answered.correct ? "text-good" : "text-warn"}`}>
            {answered.skipped ? "" : answered.correct ? `✓ ${ui.quizRight}` : ui.quizWrong}
          </span>
          <button type="button" onClick={onNext} className="rounded-full bg-white/90 px-4 py-1.5 text-caption font-semibold text-slate-900">
            {ui.scriptNext}
          </button>
        </div>
      ) : null}
    </section>
  );
}

const chip = "rounded-xl border px-3 py-2 text-chat";

function FixView({
  question,
  answered,
  onAnswer,
  tag,
}: {
  question: Extract<QuizQuestion, { kind: "fix" }>;
  answered: Answer | null;
  onAnswer: (answer: Answer) => void;
  tag: string;
}) {
  const [tapped, setTapped] = useState<number | null>(null);
  if (question.options) {
    return (
      <div className="flex flex-col gap-2">
        {question.options.map((option, i) => {
          const isRight = i === question.answer;
          const style = answered ? (isRight ? "border-good bg-good/10 text-ink" : "border-line text-slate-500 line-through") : "border-line text-slate-100 hover:bg-white/5";
          return (
            <button key={i} type="button" dir="auto" disabled={Boolean(answered)} onClick={() => onAnswer({ correct: isRight })} className={`${chip} text-start ${style}`}>
              {option}
            </button>
          );
        })}
        {answered ? <Explain question={question} tag={tag} /> : null}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <p dir="auto" className="flex flex-wrap gap-1.5">
        {question.words.map((word, i) => {
          const bad = question.bad.includes(i);
          const style = answered
            ? bad
              ? "border-warn bg-warn/15 text-warn"
              : tapped === i
                ? "border-line text-slate-500 line-through"
                : "border-transparent text-slate-200"
            : "border-line text-slate-100 hover:bg-white/10";
          return (
            <button
              key={i}
              type="button"
              disabled={Boolean(answered)}
              onClick={() => {
                setTapped(i);
                onAnswer({ correct: bad });
              }}
              className={`rounded-lg border px-2 py-1 text-chat ${style}`}
            >
              {word}
            </button>
          );
        })}
      </p>
      {answered ? <Explain question={question} tag={tag} /> : null}
    </div>
  );
}

function Explain({ question, tag }: { question: Extract<QuizQuestion, { kind: "fix" }>; tag: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-white/[0.04] px-3 py-2">
      <div className="flex items-start gap-2">
        <p dir="auto" className="min-w-0 flex-1 text-chat text-emerald-200">
          {question.right}
        </p>
        <TTSButton text={question.right} lang={tag} voice={SCRIPT_VOICES.me} className="shrink-0" />
      </div>
      {question.note ? (
        <p dir="auto" className="text-caption text-slate-300">
          {question.note}
        </p>
      ) : null}
    </div>
  );
}

function ChooseView({
  locale,
  language,
  question,
  answered,
  onAnswer,
  tag,
}: {
  locale: string;
  language: string;
  question: Extract<QuizQuestion, { kind: "choose" }>;
  answered: Answer | null;
  onAnswer: (answer: Answer) => void;
  tag: string;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const shown = answered ? question.options[question.answer]! : "＿＿＿";
  return (
    <div className="flex flex-col gap-3">
      <p dir="auto" className="text-note text-slate-400">
        {quizGloss(question.gloss, locale, language) ?? "…"}
      </p>
      <div className="flex items-start gap-2">
        <p dir="auto" className="min-w-0 flex-1 text-chat text-slate-100">
          {question.before}
          <strong className={`font-semibold ${answered ? "text-status-learned" : "text-amber-200"}`}>{shown}</strong>
          {question.after}
        </p>
        {answered ? <TTSButton text={question.text} lang={tag} voice={SCRIPT_VOICES.me} className="shrink-0" /> : null}
      </div>
      <div className="flex flex-col gap-2">
        {question.options.map((option, i) => {
          const isRight = i === question.answer;
          const style = answered
            ? isRight
              ? "border-good bg-good/10 text-ink"
              : picked === i
                ? "border-warn text-warn line-through"
                : "border-line text-slate-500"
            : "border-line text-slate-100 hover:bg-white/5";
          return (
            <button
              key={i}
              type="button"
              dir="auto"
              disabled={Boolean(answered)}
              onClick={() => {
                setPicked(i);
                onAnswer({ correct: isRight });
              }}
              className={`${chip} text-start ${style}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function OrderView({
  ui,
  locale,
  language,
  question,
  answered,
  onAnswer,
  tag,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  question: Extract<QuizQuestion, { kind: "order" }>;
  answered: Answer | null;
  onAnswer: (answer: Answer) => void;
  tag: string;
}) {
  const [placed, setPlaced] = useState<number[]>([]);
  const left = question.tiles.filter((tile) => !placed.includes(tile));
  const full = placed.length === question.words.length;
  return (
    <div className="flex flex-col gap-3">
      <p dir="auto" className="text-note text-slate-400">
        {quizGloss(question.gloss, locale, language) ?? "…"}
      </p>
      <div dir="auto" className="flex min-h-11 flex-wrap gap-1.5 rounded-xl border border-dashed border-line px-2 py-2">
        {placed.map((tile, i) => (
          <button
            key={`${tile}-${i}`}
            type="button"
            disabled={Boolean(answered)}
            onClick={() => setPlaced((current) => current.filter((_, k) => k !== i))}
            className="rounded-lg bg-white/10 px-2 py-1 text-chat text-ink"
          >
            {question.words[tile]}
          </button>
        ))}
      </div>
      {answered ? (
        <div className="flex items-start gap-2">
          <p dir="auto" className="min-w-0 flex-1 text-chat text-emerald-200">
            {question.text}
          </p>
          <TTSButton text={question.text} lang={tag} voice={SCRIPT_VOICES.me} className="shrink-0" />
        </div>
      ) : (
        <>
          {/* Keeps its height when emptied, so the check button below does not jump under the finger (2026-10-29 virtual users: last chip / next ignored on first tap). */}
          <div dir="auto" className="flex min-h-11 flex-wrap gap-1.5">
            {left.map((tile) => (
              <button key={tile} type="button" onClick={() => setPlaced((current) => [...current, tile])} className="rounded-lg border border-line px-2 py-1 text-chat text-slate-100 hover:bg-white/10">
                {question.words[tile]}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={!full}
            onClick={() => onAnswer({ correct: orderCorrect(question.words, placed) || joinWords(placed.map((tile) => question.words[tile]!), question.spaced) === joinWords(question.words, question.spaced) })}
            className="self-end rounded-full bg-white/90 px-4 py-1.5 text-caption font-semibold text-slate-900 disabled:opacity-50"
          >
            {ui.quizCheck}
          </button>
        </>
      )}
    </div>
  );
}

/** 뜻 고르기(문장 → 앱 언어 뜻). 듣고 고르기는 뺌(2026-10-30). */
function PickView({
  locale,
  language,
  question,
  answered,
  onAnswer,
  tag,
}: {
  locale: string;
  language: string;
  question: Extract<QuizQuestion, { kind: "meaning" }>;
  answered: Answer | null;
  onAnswer: (answer: Answer) => void;
  tag: string;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const label = (i: number) => quizGloss(question.options[i]!, locale, language) ?? "…";
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-2">
        <p dir="auto" className="min-w-0 flex-1 text-chat text-slate-100">
          <Marked text={question.text} mark={question.mark} />
        </p>
        <TTSButton text={question.text} lang={tag} voice={SCRIPT_VOICES.them} className="shrink-0" />
      </div>
      <div className="flex flex-col gap-2">
        {question.options.map((_, i) => {
          const isRight = i === question.answer;
          const style = answered
            ? isRight
              ? "border-good bg-good/10 text-ink"
              : picked === i
                ? "border-warn text-warn line-through"
                : "border-line text-slate-500"
            : "border-line text-slate-100 hover:bg-white/5";
          return (
            <button
              key={i}
              type="button"
              dir="auto"
              disabled={Boolean(answered)}
              onClick={() => {
                setPicked(i);
                onAnswer({ correct: isRight });
              }}
              className={`${chip} text-start ${style}`}
            >
              {label(i)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** The target line, the words that did not come out as said in bold amber (shown form keeps case and punctuation). */
function ModelWords({ outcomes }: { outcomes: WordOutcome[] }) {
  return (
    <>
      {outcomes.map((outcome, index) => {
        const text = outcome.shown ?? outcome.word;
        const gap = outcome.space === false || index === outcomes.length - 1 ? "" : " ";
        return (
          <span key={index}>
            {outcome.kind === "kept" ? text : <b className="font-semibold text-amber-300">{text}</b>}
            {gap}
          </span>
        );
      })}
    </>
  );
}

/** 단어 퀴즈: 문장 속 그 낱말에 밑줄(처음 나온 곳 하나). */
function Marked({ text, mark }: { text: string; mark?: string }) {
  const at = mark ? text.indexOf(mark) : -1;
  if (!mark || at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span data-word-mark className="underline decoration-status-learned decoration-2 underline-offset-4">{mark}</span>
      {text.slice(at + mark.length)}
    </>
  );
}

function SayView({
  ui,
  locale,
  language,
  question,
  answered,
  onAnswer,
  tag,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  question: Extract<QuizQuestion, { kind: "say" }>;
  answered: Answer | null;
  onAnswer: (answer: Answer) => void;
  tag: string;
}) {
  const { isPremium } = usePremium();
  const [listening, setListening] = useState(false);
  const [limited, setLimited] = useState(false);
  const [last, setLast] = useState<Answer | null>(null);
  const hearing = useHearing();
  const say = async () => {
    if (listening) return;
    stopTts();
    setListening(true);
    const { heard, practice, unclear, pauses } = await sayLine(question.text, {
      targetLanguage: language as LearningLanguageCode,
      nativeLanguage: locale as LearningLanguageCode,
      isPremium,
      scriptId: question.from,
      mode: "hide",
      onLimit: () => {
        setLimited(true);
        onAnswer({ correct: false, skipped: true });
      },
      ...hearing.options,
    });
    setListening(false);
    // 잘 모르겠어요: 들린 데까지 짚고 틀림으로(정답 문장이 보임).
    const stuck = hearing.takeStuck();
    const compared = compareToTarget(question.text, heard);
    const result: Answer = { correct: !stuck && Boolean(heard) && (compared.clean || practice?.good === true), heard, practice, unclear, pauses };
    if (stuck && !heard) {
      setLast(result);
      onAnswer(result);
      return;
    }
    setLast(result);
    // 점수는 첫 번째만, 다시 말한 것은 보여 주기만.
    if (heard) onAnswer(result);
  };
  const result = last ?? answered;
  return (
    <div className="flex flex-col gap-3">
      <p dir="auto" className="text-chat text-slate-100">
        {quizGloss(question.gloss, locale, language) ?? "…"}
      </p>
      {question.mark ? (
        <span dir="auto" data-say-word className="self-start rounded-full border border-status-learned/50 px-3 py-1 text-note text-ink underline decoration-status-learned underline-offset-4">
          {question.mark}
        </span>
      ) : null}
      {result ? (
        <>
          {/* 맞았지만 낱말이 다르면 내가 한 말 그대로(대본 화면과 같음, 2026-10-29). */}
          {result.correct && result.heard && !compareToTarget(question.text, result.heard).clean ? (
            <div className="rounded-xl bg-white/5 p-2.5">
              <p className="text-meta text-slate-500">{ui.roleplayPracticeHeard}</p>
              <p dir="auto" className="mt-1 text-chat text-slate-100">
                {result.heard}
              </p>
            </div>
          ) : null}
          {/* Right but worded differently: "Say it like this" + the line with the words that differ marked (2026-10-29 — meaning-judged, so not counted wrong). */}
          {result.correct && result.heard && !compareToTarget(question.text, result.heard).clean ? (
            <div data-say-model className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-meta text-slate-500">{ui.chatExpressionTitle}</p>
                <p dir="auto" className="mt-1 text-chat text-emerald-200">
                  <ModelWords outcomes={compareToTarget(question.text, result.heard).outcomes} />
                </p>
              </div>
              <TTSButton text={question.text} lang={tag} voice={SCRIPT_VOICES.me} className="shrink-0" />
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <p dir="auto" className="min-w-0 flex-1 text-chat text-emerald-200">
                <Marked text={question.text} mark={question.mark} />
              </p>
              <TTSButton text={question.text} lang={tag} voice={SCRIPT_VOICES.me} className="shrink-0" />
            </div>
          )}
          {result.correct ? (
            <LineGrade ui={ui} exact={compareToTarget(question.text, result.heard ?? "").clean} unclear={result.unclear ?? []} practice={result.practice ?? null} pauses={result.pauses ?? []} />
          ) : (
            <>
              <Attempt outcomes={compareToTarget(question.text, result.heard ?? "").outcomes} ui={ui} pauses={result.pauses} />
              <PauseChips ui={ui} pauses={result.pauses ?? []} />
            </>
          )}
        </>
      ) : null}
      {limited ? <p className="text-caption text-warn">{ui.scriptLimit}</p> : null}
      {!limited && (!result || !result.correct) ? (
        <div className="flex items-center justify-end gap-2">
          {/* 말할 수 없을 때(마이크·자리): 건너뛰면 점수에서 뺀다 — 계속 공부가 여기서 막히지 않게. */}
          {listening ? <HearingButtons ui={ui} hearing={hearing} /> : null}
          {!result && !listening ? (
            <button type="button" onClick={() => onAnswer({ correct: false, skipped: true })} disabled={listening} className="rounded-full px-3 py-1.5 text-caption text-slate-400 hover:bg-white/10 disabled:opacity-50">
              {ui.quizSkip}
            </button>
          ) : null}
          <button type="button" onClick={() => void say()} disabled={listening} className="rounded-full bg-white/90 px-4 py-1.5 text-caption font-semibold text-slate-900 disabled:opacity-60">
            {listening ? ui.roleplayPracticeListening : result ? ui.roleplayPracticeRetry : ui.scriptSay}
          </button>
        </div>
      ) : null}
    </div>
  );
}
