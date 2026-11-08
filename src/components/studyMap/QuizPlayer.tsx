"use client";

import { CardProgressDots, ladderName } from "@/components/studyMap/Growth";
import { quizShapeOf } from "@/lib/curriculum/missKind";
import { readLedger } from "@/lib/curriculum/logLedger";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { fireTodayEnd, maybeShowInterstitial } from "@/lib/ads";
import { NativeAdSlot } from "@/components/NativeAdSlot";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { Attempt } from "@/components/speech/Attempt";
import { sayLine } from "@/lib/speech/sayLine";
import { TTSButton } from "@/components/TTSButton";
import { HearingButtons, LineGrade, PauseChips, useHearing } from "@/components/studyMap/StageScripts";
import { usePremium } from "@/contexts/PremiumContext";
import type { UICopy } from "@/lib/copy";
import { KO_PARTICLE_PAIRS, slipBadIndex, buildQuiz, fixedRight, joinWords, moreExamples, noteAsked, orderCorrect, quizPassed, typedRight, unitPassed, type QuizCard, type QuizMix, type QuizQuestion, type QuizStyle, type SpotQuestion } from "@/lib/curriculum/quiz";
import { recheckTyped } from "@/lib/curriculum/typedCheck";
import { entitlementHeaders } from "@/lib/billing/billingService";
import { isSpaceless } from "@/lib/wordSegments";
import { quizGloss, SCRIPT_VOICES } from "@/lib/curriculum/stageScripts";
import { useBankTone } from "@/components/studyMap/bankTone";
import { multiBlankRight, spotsFixRight, type MultiQuestion, type SpotsQuestion } from "@/lib/curriculum/multiQuiz";
import { useAllStageGlosses } from "@/lib/curriculum/useStageGlosses";
import { readKindLog, saveKind, styleKinds } from "@/lib/curriculum/learnStyle";
import { noteBankResult } from "@/lib/curriculum/qbank";
import { learningLanguageSpeechTag, type LearningLanguageCode } from "@/lib/learningLanguages";
import { compareToTarget, type Practice, type WordOutcome } from "@/lib/roleplay/practice";
import { playTts, stopTts } from "@/lib/ttsPlayer";
import { openLesson } from "@/lib/appIntents";
import { DictionarySheet } from "@/components/studyMap/Dictionary";
import { useOptionNotes } from "@/lib/curriculum/optionNotes";

/**
 * 약한 곳 퀴즈(lib/curriculum/quiz.ts, 2026-10-28 사용자 "틀린 부분을 퀴즈로"): 오늘 할 것의 "퀴즈" 칸을 누르면 열린다.
 * 문제 셋(틀린 낱말 누르기·빈칸 고르기·순서 맞추기 → 말하기). 첫 답만 점수로 센다(말하기는 다시 해 볼 수 있음).
 * 끝나면 onDone(맞음) — 부르는 쪽이 다시 볼 것에 반영한다. 틀렸으면 이어서 원래 대본(onThen).
 */

/** skipped = 말하기 한도에 걸려 못 함 — 점수에서 뺀다. */
export type Answer = { correct: boolean; heard?: string; practice?: Practice | null; unclear?: string[]; skipped?: boolean; pauses?: [string, number][]; /** 고른 보기(문제은행 셈 — 한눈에 지워지는 오답 찾기). */ picked?: string;
  /** 💡 힌트·모르겠어요로 답을 본 차례 — 맞게 쳤어도 맞음으로 세지 않는다(correct false), 화면엔 ✓ 대신 💡. */
  assisted?: boolean;
  /** 맞나 틀리나: 바른 꼴까지 쳐서 답함(쓰기로 셈) — 판단만이면 없음(고르기로 셈). */
  typed?: boolean;
  /** 복합 문제(multi·spots): 소재(열쇠)마다 맞음/틀림 — 부르는 쪽이 열쇠마다 따로 기록한다. */
  /** 소재마다 결과 — seen = 봤음만(맞나 틀리나의 카드 낱말: 문제가 그 낱말을 묻지 않음, 장부·익힘에 안 셈). */
  parts?: { key: string; correct: boolean; seen?: boolean; shape?: "c" | "t"; src?: "judge" }[];
};

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
  fromToday = false,
  glossFirst = false,
  scoreEnd = false,
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
  /** 오늘 할 것에서 연 묶음(대본 하나 문제) — 닫을 때 전면 광고는 그날 마지막 항목일 때만(lib/ads.ts fireTodayEnd). */
  fromToday?: boolean;
  /** 빈칸 쓰기에서 앱 언어 뜻을 먼저 보여 준다(통화 숙제 — 뜻 없이는 답이 여럿, 2026-11-08 점검). */
  glossFirst?: boolean;
  /** 끝 화면 제목을 맞음/틀림 대신 점수만(통화 숙제 — 4/6에 "틀렸어요"가 실패처럼 보임, 2026-11-08 점검). */
  scoreEnd?: boolean;
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
    if (fromToday) fireTodayEnd();
    else if (done && questions.length) void maybeShowInterstitial("quizEnd");
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
            {unit && (!bundleKeys || title) ? <bdi>{title}</bdi> : <span className="text-warn">{ui.quizTag}</span>}
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
            bankKey={bundleKeys?.[index] ?? quizKey}
            glossFirst={glossFirst}
          />
        ) : null}
        {done && questions.length ? (
          <div className="mt-6 flex flex-col items-center gap-3">
            {scoreEnd ? null : <p className="text-body font-semibold text-ink">{passed ? `✓ ${ui.quizRight}` : ui.quizWrong}</p>}
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
            {/* 끝 화면 점수 아래 네이티브 하나(닫을 때 전면은 그대로) — 버튼과 한 줄 넘게 띄움. */}
            <NativeAdSlot feedId="results" slotKey={`quiz-end-${seed}`} spaced />
          </div>
        ) : null}
      </div>
    </FullScreenLayer>
  );
}

export function QuestionView({
  ui,
  locale,
  language,
  question: given,
  answered,
  onAnswer: giveAnswer,
  onNext,
  bankKey,
  showExamples = true,
  explainLink = false,
  autoAdvance = true,
  glossFirst = false,
  dictDoor = false,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  question: QuizQuestion;
  answered: Answer | null;
  onAnswer: (answer: Answer) => void;
  onNext: () => void;
  /** 이 문제의 열쇠 — 주면 풀이(문장·맞음·보기·고른 보기)를 문제은행 셈에 보탠다(curriculum/qbank.ts). */
  bankKey?: string;
  /** 답한 뒤 다른 예문 둘(문장구조 수업은 끔 — 설명에 예문이 있고 다음 문제가 미리 정해져 있어, 보여 준 예문이 바로 다음 문제로 나옴, 가상 사용자 2026-11-01). */
  showExamples?: boolean;
  /** 틀리면 "설명"으로 Stagebank 그 소재 수업을 연다(2026-11-01 설계 — 설명은 Stagebank 한 곳, 문제는 Quizbank). 시험 중엔 끔. */
  explainLink?: boolean;
  /** 맞힌 고르기·쓰기를 잠깐 뒤 저절로 넘김(문장구조 수업은 끔 — 결과를 보고 "다음"). */
  autoAdvance?: boolean;
  /** 빈칸 쓰기의 뜻 줄을 답하기 전에도(문장구조 수업 — 배운 틀을 뜻을 보고 떠올림). 낱말 문제는 늘 답한 뒤에만(2026-10-31). */
  glossFirst?: boolean;
  /**
   * 개편 Quizbank(lib/reform.ts): 답한 뒤 그 소재의 사전 문 — 낱말은 사전 시트(그 낱말 화면), 표현·문법·문장구조는 그 수업(openLesson).
   * 답하기 전에는 없다(정답이 보임). 틀리거나 모르겠어요면 진하게.
   */
  dictDoor?: boolean;
}) {
  const [dictWord, setDictWord] = useState<string | null>(null);
  // 답하기 전 그 열쇠의 장부(답하면 부르는 쪽이 곧바로 장부에 씀) — 점 셋의 "전"(개편만, 2026-11-08).
  // 맞나 틀리나는 문법을 물어서 점 셋도 그 문법 열쇠(2026-11-08).
  const dotKey = given.kind === "judge" ? given.slip.key : bankKey;
  const ledgerBefore = useMemo(() => (dictDoor && dotKey ? readLedger(language).filter((event) => event.k === dotKey) : []),
    // 문제가 바뀔 때만 다시 — 답한 뒤에는 그대로.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dictDoor, dotKey, given, language]);
  // 뜻 고르기인데 앱 언어로 보일 뜻이 없으면(앱 언어 = 학습 언어 — 보기가 곧 문장) 듣고 말하기로(2026-11-01 퀴즈 전수 점검).
  const question: QuizQuestion = useMemo(
    () =>
      given.kind === "meaning" && quizGloss(given.options[given.answer]!, locale, language) === null
        ? { kind: "say", text: given.text, gloss: given.gloss, from: given.from, ...(given.mark ? { mark: given.mark } : {}) }
        : given,
    [given, locale, language],
  );
  const onAnswer = (value: Answer) => {
    // 문제은행 셈은 그 열쇠의 빈칸 문제만(틀린 곳 고치기의 문장은 일부러 틀린 문장이라 셈에 넣지 않음).
    if (bankKey && !answered && !value.skipped && (question.kind === "type" || question.kind === "choose")) {
      noteBankResult(language, bankKey, { text: question.text, correct: value.correct, ...(question.kind === "choose" ? { options: question.options, picked: value.picked } : {}) });
    }
    giveAnswer(value);
  };
  const tag = learningLanguageSpeechTag(language as LearningLanguageCode);
  // 여러 단계 문장이 섞여 나오니 모든 단계 뜻풀이를 앱 언어로 받아 둔다(받으면 다시 그림).
  useAllStageGlosses(language, locale);
  // Tap-to-pick answers that are right move on by themselves (first run had ~20 taps to the first script, 2026-10-29).
  // Wrong answers stay so the right one can be read; say/order keep the button.
  // Blank questions with a key show more examples after the answer, so they wait for 다음 (user, 2026-10-31).
  // 문법 칸(g|)은 같은 문법을 쓴 아무 대본 줄이라 문제와 상관없어 보임(가상 사용자 2026-11-01 "정답 뒤 예문이 늘 Me llamo/Soy de") — 빼기.
  const examples = showExamples && Boolean(bankKey) && !bankKey?.startsWith("g|") && (question.kind === "choose" || question.kind === "type");
  // 개편(📕 문이 붙은 퀴즈 — dictDoor)은 맞혀도 저절로 넘어가지 않는다: 답한 뒤 카드(뜻·예문)를 보고 📕나 다음을 고르게(2026-11-07 사용자 "풀면 바로 넘어가버려").
  const autoNext = Boolean(autoAdvance && !dictDoor && !dictWord && answered?.correct && !answered.skipped && !examples && (question.kind === "choose" || question.kind === "meaning" || question.kind === "type" || question.kind === "spot"));
  const nextRef = useRef(onNext);
  useEffect(() => {
    nextRef.current = onNext;
  });
  // 낸 문장을 그 열쇠에 남긴다 — 다음에 같은 열쇠는 다른 문장부터(quiz.ts noteAsked, 가상 사용자 2026-11-01 "단어 시험이 1일째와 같은 문장").
  useEffect(() => {
    if (bankKey && "text" in given && given.text) noteAsked(language, bankKey, given.text);
  }, [bankKey, given, language]);
  useEffect(() => {
    if (!autoNext) return;
    const timer = window.setTimeout(() => nextRef.current(), 900);
    return () => window.clearTimeout(timer);
  }, [autoNext, question]);
  return (
    <section
      data-kind={question.kind}
      // 점검(가상 사용자 /mark)이 "어느 문제가 왜 쉬웠나"를 문제째 남기게(2026-11-01 사용자 "피드백을 구체화해서 바로 반영"): 열쇠·문장·보기.
      data-quiz-key={bankKey}
      data-quiz-meta={quizMeta(question)}
      className="flex flex-col gap-3"
    >
      {/* No kind label (gap, order…) — the question's shape is the task (user, 2026-10-30); 2026-11-02 shapes made distinct + 🔍/🔀 icon (no text). Checks read data-kind. */}
      {question.kind === "fix" ? <FixView question={question} answered={answered} onAnswer={onAnswer} tag={tag} /> : null}
      {question.kind === "type" ? <TypeView ui={ui} locale={locale} language={language} question={question} answered={answered} onAnswer={onAnswer} tag={tag} strict={Boolean(bankKey?.startsWith("w|"))} glossFirst={glossFirst} /> : null}
      {question.kind === "spot" ? <SpotView ui={ui} locale={locale} language={language} question={question} answered={answered} onAnswer={onAnswer} tag={tag} /> : null}
      {question.kind === "choose" ? <ChooseView ui={ui} strict={Boolean(bankKey?.startsWith("w|"))} locale={locale} language={language} question={question} answered={answered} onAnswer={onAnswer} tag={tag} /> : null}
      {question.kind === "talk" ? <TalkView ui={ui} language={language} question={question} answered={answered} onAnswer={onAnswer} tag={tag} /> : null}
      {question.kind === "multi" ? <MultiView ui={ui} locale={locale} language={language} question={question} answered={answered} onAnswer={onAnswer} tag={tag} /> : null}
      {question.kind === "spots" ? <SpotsView ui={ui} locale={locale} language={language} question={question} answered={answered} onAnswer={onAnswer} tag={tag} /> : null}
      {question.kind === "order" ? <OrderView ui={ui} locale={locale} language={language} question={question} answered={answered} onAnswer={onAnswer} tag={tag} /> : null}
      {question.kind === "meaning" ? (
        <PickView locale={locale} language={language} question={question} answered={answered} onAnswer={onAnswer} tag={tag} />
      ) : null}
      {question.kind === "judge" ? <JudgeView ui={ui} locale={locale} language={language} question={question} answered={answered} onAnswer={onAnswer} tag={tag} /> : null}
      {question.kind === "say" ? <SayView ui={ui} locale={locale} language={language} question={question} answered={answered} onAnswer={onAnswer} tag={tag} /> : null}
      {question.kind === "reply" ? <ReplyView locale={locale} language={language} question={question} answered={answered} onAnswer={onAnswer} tag={tag} /> : null}
      {answered && examples && bankKey && "text" in question ? <MoreExamples key={question.text} locale={locale} language={language} bankKey={bankKey} current={question.text} tag={tag} /> : null}
      {answered ? (
        <div className="flex items-center justify-between gap-2">
          <span className={`text-note font-semibold ${answered.correct ? "text-good" : "text-bad"}`}>
            {answered.skipped ? "" : answered.correct ? `✓ ${ui.quizRight}` : answered.assisted ? "💡" : ui.quizWrong}
          </span>
          {/* 개편: 답한 순간 그 소재의 점 셋이 바뀜(studyMap/Growth CardProgressDots, 2026-11-08). 문제마다 새로 그려 답하기 전 장부를 잡는다. */}
          {dictDoor && dotKey && /^[wefg]\|/.test(dotKey) && !answered.skipped ? (
            <CardProgressDots
              key={`${dotKey}|${"text" in question ? question.text : ""}`}
              events={ledgerBefore}
              locale={locale}
              bankKey={dotKey}
              mode={quizShapeOf(question as never, { correct: answered.correct, ...(answered.typed ? { typed: true } : {}) }, (text) => text.split(" ")).shape === "t" ? "write" : "pick"}
              correct={answered.correct && !answered.assisted}
            />
          ) : null}
          {dictDoor && bankKey && /^[wefg]\|/.test(bankKey) ? (
            <button
              type="button"
              data-quiz-dict
              onClick={() => (bankKey.startsWith("w|") ? setDictWord(bankKey.slice(2)) : openLesson({ language, key: bankKey }))}
              className={`ms-auto rounded-full border px-3 py-1 text-caption hover:bg-white/10 ${answered.correct ? "border-line text-slate-400" : "border-slate-300 font-semibold text-ink"}`}
            >
              <span aria-hidden>📕 </span>
              {ui.languagebankTitle}
            </button>
          ) : null}
          {explainLink && !answered.correct && bankKey && /^[efg]\|/.test(bankKey) ? (
            <button type="button" data-quiz-explain onClick={() => openLesson({ language, key: bankKey })} className="ms-auto rounded-full border border-line px-3 py-1 text-caption text-slate-300 hover:bg-white/10">
              {ui.explanation}
            </button>
          ) : null}
          <button type="button" onClick={onNext} className="rounded-full bg-white/90 px-4 py-1.5 text-caption font-semibold text-slate-900">
            {ui.scriptNext}
          </button>
        </div>
      ) : null}
      {dictWord ? <DictionarySheet ui={ui} language={language} locale={locale} word={dictWord} title={ui.languagebankTitle} onClose={() => setDictWord(null)} /> : null}
    </section>
  );
}

/** 문제 한 줄 요약(점검용 data 속성): 모양·문장·보기·정답 자리 — 화면에 보이는 것 그대로라 새로 드러나는 것은 없다(정답 자리 빼고). */
function quizMeta(question: QuizQuestion): string {
  const q = question as Partial<{ text: string; options: string[]; answer: number | string; right: string; shown: string; wrong: string | null; from: string }>;
  return JSON.stringify({ kind: question.kind, ...(q.from ? { from: q.from } : {}), ...(q.text ? { text: q.text } : {}), ...(q.options ? { options: q.options } : {}), ...(q.answer !== undefined ? { answer: q.answer } : {}), ...(q.right ? { right: q.right } : {}), ...(question.kind === "judge" ? { shown: q.shown, wrong: q.wrong, bad: question.wrong ? slipBadIndex(question.slip) : -1 } : {}) });
}

const chip = "rounded-xl border px-3 py-2 text-chat";

/**
 * 답한 뒤 같은 낱말·틀의 다른 예문 둘(2026-10-31 사용자 "퀴즈 후에 예문도" → "바꿔줘"): 그 조각에 색, 뜻, 🔊.
 * 예문이 없으면(문제은행이 아직 안 자람) 아무것도 안 그린다. 보여 준 문장은 그 열쇠의 다음 빈칸에서 뒤로(quiz.ts moreExamples).
 */
function MoreExamples({ locale, language, bankKey, current, tag }: { locale: string; language: string; bankKey: string; current: string; tag: string }) {
  const tone = useBankTone();
  const [list] = useState(() => moreExamples(language, bankKey, current));
  if (!list.length) return null;
  return (
    <ul data-quiz-more className="flex flex-col gap-2 border-t border-line pt-2">
      {list.map((source) => {
        const piece = source.piece ?? "";
        const at = piece ? source.text.indexOf(piece) : -1;
        const gloss = quizGloss(source.gloss, locale, language);
        return (
          <li key={source.text} className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <p dir="auto" className="text-note text-slate-200">
                {at >= 0 ? (
                  <>
                    {source.text.slice(0, at)}
                    <strong className={`font-semibold ${tone.accent}`}>{piece}</strong>
                    {source.text.slice(at + piece.length)}
                  </>
                ) : (
                  source.text
                )}
              </p>
              {gloss ? (
                <p dir="auto" className="text-meta text-slate-400">
                  {gloss}
                </p>
              ) : null}
            </div>
            <TTSButton text={source.text} lang={tag} voice={SCRIPT_VOICES.me} className="shrink-0" />
          </li>
        );
      })}
    </ul>
  );
}

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
              ? "border-bad bg-bad/15 text-bad"
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

type Graded = "exact" | "loose" | "also" | false;

/** 원래 정답과 다른데 맞음으로 본 답 아래 한 줄: "이 답도 맞아요. 원래 정답: X". */
function AlsoRight({ ui, answer }: { ui: UICopy; answer: string }) {
  const tone = useBankTone();
  return (
    <p dir="auto" data-quiz-also className="text-caption text-slate-300">
      ✓ {ui.quizAlsoRight} <bdi className={`font-semibold ${tone.accent}`}>{answer}</bdi>
    </p>
  );
}

/** 친 답이 기기 채점으로 틀림일 때 서버 다시 보기(typedCheck) — 맞는 다른 꼴이면 맞음. 헷갈리는 오답을 그대로 친 것은 묻지 않는다. */
function useTypedGrade(language: string) {
  const { isPremium } = usePremium();
  const [checking, setChecking] = useState(false);
  // "also" = 기기 채점은 틀림인데 서버가 맞는 다른 답으로 봄 — 맞음으로 세고 원래 정답을 같이 보여 준다(사용자 2026-11-01 "일단 정답 처리, 원래 정답은 이런 것도 가능").
  const grade = async (local: Graded, input: { kind: "blank" | "fix"; sentence: string; answer: string; typed: string; open?: boolean }, plainWrong: boolean): Promise<Graded> => {
    if (local || plainWrong) return local;
    setChecking(true);
    const ok = await recheckTyped({ language, ...input }, entitlementHeaders(isPremium));
    setChecking(false);
    return ok ? "also" : false;
  };
  return { checking, grade };
}

/** 입력칸 + 확인 · 💡(첫 글자 → 글자 수) · 모르겠어요. 빈칸 쓰기와 틀린 곳 고치기가 같이 쓴다. */
function TypeBox({
  ui,
  tag,
  answer,
  done,
  result,
  busy,
  onSubmit,
  onGiveUp,
  hint,
  onHint,
  autoFocus = true,
}: {
  ui: UICopy;
  tag: string;
  answer: string;
  done: boolean;
  result: Graded | null;
  busy: boolean;
  onSubmit: (typed: string) => void;
  onGiveUp: () => void;
  hint: number;
  onHint: () => void;
  autoFocus?: boolean;
}) {
  const tone = useBankTone();
  const [typed, setTyped] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    // 다음 문제부터는 바로 칠 수 있게(처음 여는 순간 키보드가 튀어나오지 않게).
    if (autoFocus && (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "BUTTON")) inputRef.current?.focus({ preventScroll: true });
  }, [autoFocus]);
  const submit = () => {
    if (done || busy || !typed.trim()) return;
    onSubmit(typed);
  };
  const letters = [...answer];
  // 💡 한 번 = 첫 글자, 두 번 = 첫 글자 + 남은 글자 수만큼 밑줄(띄어쓰기는 그대로).
  const hintText = hint >= 2 ? letters.map((ch, i) => (i === 0 || ch === " " ? ch : "＿")).join("") : hint === 1 ? `${letters[0] ?? ""}…` : "";
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          dir="auto"
          lang={tag}
          value={typed}
          disabled={done}
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          placeholder={hintText || (/\p{Script=Han}/u.test(answer) ? (tag.startsWith("zh") ? "pīnyīn" : tag.startsWith("ja") ? "ひらがな" : undefined) : undefined)}
          onChange={(event) => setTyped(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.nativeEvent.isComposing) submit();
          }}
          className={`min-w-0 flex-1 rounded-xl border bg-transparent px-3 py-2 text-chat outline-none ${tone.hint} ${done ? (result ? "border-good text-ink" : "border-bad text-bad line-through") : `border-line text-slate-100 ${tone.focus}`}`}
        />
        {done ? null : (
          <button type="button" onClick={submit} disabled={!typed.trim() || busy} className="rounded-full bg-white/90 px-4 py-1.5 text-caption font-semibold text-slate-900 disabled:opacity-50">
            {busy ? "…" : ui.quizCheck}
          </button>
        )}
      </div>
      {done ? (
        result === "also" ? (
          <AlsoRight ui={ui} answer={answer} />
        ) : result === "loose" || !result ? (
          <p dir="auto" className="text-caption text-slate-300">
            → <bdi className={`font-semibold ${tone.accent}`}>{answer}</bdi>
          </p>
        ) : null
      ) : (
        <div className="flex items-center gap-2">
          {hint < 2 ? (
            <button
              type="button"
              data-quiz-hint
              onClick={() => {
                // 힌트는 입력칸 안내 글로 보여서, 이미 쓴 글이 있으면 안 보였다(2026-11-07 점검 Layla "tu" + 힌트 → "tuel") — 쓴 글을 비운다.
                setTyped("");
                onHint();
              }}
              className="rounded-full border border-line px-3 py-1 text-caption text-slate-300 hover:bg-white/10">
              💡 {ui.missionHint}
            </button>
          ) : null}
          <button type="button" data-quiz-giveup onClick={onGiveUp} className="rounded-full border border-line px-3 py-1 text-caption text-slate-400 hover:bg-white/10">
            {ui.markUnknown}
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * 빈칸 쓰기(2026-10-30 사용자 "빈칸에 들어갈 단어를 타이핑" → "그냥 타이핑해서 맞추는 식"): 뜻 · 빈칸 문장 · 입력칸 하나 · 확인.
 * 채점은 quiz.ts typedRight(악센트·한 글자 오타·일본어 로마자 봐줌), 그래도 틀림이면 서버가 같은 뜻의 맞는 꼴인지 한 번 더(typedCheck).
 * 💡·모르겠어요로 답을 본 차례는 맞음으로 세지 않는다.
 */
function TypeView({
  ui,
  locale,
  language,
  question,
  answered,
  onAnswer,
  tag,
  strict = false,
  glossFirst = false,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  question: Extract<QuizQuestion, { kind: "type" }>;
  answered: Answer | null;
  onAnswer: (answer: Answer) => void;
  tag: string;
  /** 낱말 문제(w|): 그 낱말을 썼는지 본다 — 문장에 맞는 다른 낱말은 맞음으로 세지 않는다(가상 사용자 2026-11-01 "totally 자리에 really도 맞았어요"). */
  strict?: boolean;
  /** 뜻 줄을 답하기 전에도(문장구조 수업). */
  glossFirst?: boolean;
}) {
  const tone = useBankTone();
  const [result, setResult] = useState<Graded | null>(null);
  const [hint, setHint] = useState(0);
  // 낱말 문제에 문장에 맞는 다른 낱말을 침 — 틀림도 맞음도 아니고 다시 치게(가상 사용자 2026-11-01 #9 "really도 맞는데 틀림").
  const [otherWord, setOtherWord] = useState(false);
  const { checking, grade } = useTypedGrade(language);
  const gloss = quizGloss(question.gloss, locale, language);
  const wordQuiz = Boolean(question.prepared);
  const card = question.card;
  const submit = async (typed: string) => {
    if (card) {
      // 카드 낱말 가림: 예문 속 꼴 또는 사전형 — 기기에서만(모델 없음).
      const local = typedRight(question.answer, typed, { language, near: question.near }) || typedRight(card.word, typed, { language });
      setResult(local);
      onAnswer({ correct: Boolean(local) && hint === 0, ...(hint ? { assisted: true } : {}) });
      return;
    }
    if (wordQuiz) {
      const local = typedRight(question.answer, typed, { language, near: question.near });
      setResult(local);
      onAnswer({ correct: Boolean(local) && hint === 0, ...(hint ? { assisted: true } : {}) });
      return;
    }
    const local = typedRight(question.answer, typed, { language, near: question.near });
    const plainWrong = Boolean(question.near?.some((one) => typedRight(one, typed, { language }) === "exact"));
    const sentence = `${question.before}___${question.after}`;
    // 낱말 문제는 문장에 맞는지(open)로 물어 맞으면 "그 낱말을" 다시 치게, 뜻 줄을 먼저 보인 수업은 같은 뜻인지(Pienso que = Creo que), 그 밖은 문장에 맞으면 맞음.
    const final = await grade(local, { kind: "blank", sentence, answer: question.answer, typed: typed.trim(), open: strict || !(glossFirst && gloss) }, plainWrong);
    if (strict && final === "also") {
      setOtherWord(true);
      return;
    }
    setResult(final);
    onAnswer({ correct: Boolean(final) && hint === 0, ...(hint ? { assisted: true } : {}) });
  };
  if (card) {
    return (
      <div className="flex flex-col gap-3">
        <CardFace
          word={answered ? card.word : null}
          meaning={card.meaning}
          line={
            <>
              {question.before}
              <strong className={`font-semibold ${answered ? tone.accent : tone.blank}`}>{answered ? question.answer : "＿＿＿"}</strong>
              {question.after}
            </>
          }
          lineGloss={gloss}
          speak={answered ? { text: question.text, tag } : null}
        />
        <TypeBox
          ui={ui}
          tag={tag}
          answer={question.answer}
          done={Boolean(answered)}
          result={answered ? result : null}
          busy={false}
          hint={hint}
          onHint={() => setHint((n) => n + 1)}
          onSubmit={(typed) => void submit(typed)}
          onGiveUp={() => {
            setResult(false);
            onAnswer({ correct: false, assisted: true });
          }}
        />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      {answered || (glossFirst && gloss) || wordQuiz ? (
        <p dir="auto" data-quiz-gloss className="text-note text-slate-400">
          {quizGloss(question.gloss, locale, language) ?? ""}
        </p>
      ) : null}
      {wordQuiz && (question.prepared?.mark || question.prepared?.hint) ? (
        <p data-quiz-cue dir="auto" className="text-meta text-slate-400">
          {[question.prepared?.mark, question.prepared?.hint].filter(Boolean).join(" · ")}
        </p>
      ) : null}
      {wordQuiz && !answered ? null : (
      <div className="flex items-start gap-2">
        <p dir="auto" className="min-w-0 flex-1 text-chat text-slate-100">
          {wordQuiz ? question.text : question.before}
          {wordQuiz ? null : (
          <strong className={`font-semibold ${answered ? tone.accent : tone.blank}`}>{answered ? question.answer : "＿＿＿"}</strong>
          )}
          {wordQuiz ? null : question.after}
        </p>
        {answered ? <TTSButton text={question.text} lang={tag} voice={SCRIPT_VOICES.me} className="shrink-0" /> : null}
      </div>
      )}
      <TypeBox
        ui={ui}
        tag={tag}
        answer={question.answer}
        done={Boolean(answered)}
        result={answered ? result : null}
        busy={checking}
        hint={hint}
        onHint={() => setHint((n) => n + 1)}
        onSubmit={(typed) => {
          setOtherWord(false);
          void submit(typed);
        }}
        onGiveUp={() => {
          setResult(false);
          onAnswer({ correct: false, assisted: true });
        }}
      />
      {otherWord && !answered ? (
        <p data-quiz-other-word className="text-caption text-slate-300">
          {ui.quizOtherWord}
        </p>
      ) : null}
    </div>
  );
}

/**
 * 틀린 곳 찾아 고치기(2026-10-30 사용자 "문장 내에서 틀린 부분을 맞추고 수정하는 식"): 낱말을 눌러 틀린 곳 → 바른 꼴을 직접 친다.
 * "틀린 곳 없음"도 답이 될 수 있다(넷에 하나, 찍어 맞히기 막기). 틀린 낱말이 아닌 곳을 누르면 바로 틀림 + 바른 문장.
 */
function SpotView({
  ui,
  locale,
  language,
  question,
  answered,
  onAnswer,
  tag,
  bare = false,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  question: SpotQuestion;
  answered: Answer | null;
  onAnswer: (answer: Answer) => void;
  tag: string;
  /** 대화 안: 뜻 줄·"틀린 곳 없음" 없이(그 줄이 틀린 줄인 걸 이미 앎). */
  bare?: boolean;
}) {
  const tone = useBankTone();
  const [tapped, setTapped] = useState<number | null>(null);
  const [said, setSaid] = useState<"none" | null>(null);
  const [result, setResult] = useState<Graded | null>(null);
  const [hint, setHint] = useState(0);
  const { checking, grade } = useTypedGrade(language);
  const clean = question.bad.length === 0;
  const found = tapped !== null && question.bad.includes(tapped);
  const glue = isSpaceless(question.text) ? "" : " ";
  const submit = async (typed: string) => {
    const local = fixedRight(question, typed, language);
    const wrongPart = question.bad.map((i) => question.words[i]).join(glue);
    const plainWrong = typedRight(wrongPart, typed, { language }) === "exact" || Boolean(question.near?.some((one) => typedRight(one, typed, { language }) === "exact"));
    const before = question.words.slice(0, question.bad[0]).join(glue);
    const after = question.words.slice((question.bad[question.bad.length - 1] ?? 0) + 1).join(glue);
    const mine = [before, typed.trim(), after].filter(Boolean).join(glue);
    const final = await grade(local, { kind: "fix", sentence: question.text, answer: question.right, typed: mine }, plainWrong);
    setResult(final);
    onAnswer({ correct: Boolean(final) && hint === 0, ...(hint ? { assisted: true } : {}) });
  };
  const gloss = question.gloss ? quizGloss(question.gloss, locale, language) : null;
  return (
    <div className="flex flex-col gap-3">
      {!bare && gloss ? (
        <p dir="auto" className="text-note text-slate-400">
          {gloss}
        </p>
      ) : null}
      {/* 2026-11-02 사용자 — 순서 문제와 틀린 곳 찾기가 섞여 보임: 낱말 칸(테두리) 대신 한 줄 문장처럼 — 낱말마다 점선 밑줄만, 누르면 칠함.
          순서 문제(OrderView)는 빈칸 자리 + 테두리 없는 낱말 조각이라 모양이 다르다. 앞의 🔍는 찾기 표시(이름 글 없이). */}
      <p dir="auto" className="text-chat leading-loose text-slate-100" data-spot-words>
        {!bare ? (
          <span aria-hidden className="me-1.5 select-none text-caption opacity-70">
            🔍
          </span>
        ) : null}
        {question.words.map((word, i) => {
          const bad = question.bad.includes(i);
          const style = answered
            ? bad
              ? "bg-bad/15 text-bad"
              : tapped === i
                ? "text-slate-500 line-through"
                : "text-slate-200"
            : tapped === i
              ? tone.pick
              : "underline decoration-slate-500 decoration-dotted underline-offset-4 hover:bg-white/10";
          return (
            <span key={i}>
              {i > 0 && glue ? glue : null}
              <button
                type="button"
                disabled={Boolean(answered) || found}
                onClick={() => {
                  setTapped(i);
                  if (!question.bad.includes(i)) {
                    setResult(false);
                    onAnswer({ correct: false });
                  }
                }}
                className={`inline rounded-lg px-0.5 ${style}`}
              >
                {word}
              </button>
            </span>
          );
        })}
      </p>
      {!bare && !answered && !found ? (
        <button
          type="button"
          data-spot-none
          onClick={() => {
            setSaid("none");
            setResult(clean ? "exact" : false);
            onAnswer({ correct: clean });
          }}
          className="self-start rounded-full border border-line px-3 py-1 text-caption text-slate-200 hover:bg-white/10"
        >
          {ui.quizNoMistake}
        </button>
      ) : null}
      {found && !clean ? (
        <TypeBox
          ui={ui}
          tag={tag}
          answer={question.want}
          done={Boolean(answered)}
          result={answered ? result : null}
          busy={checking}
          hint={hint}
          onHint={() => setHint((n) => n + 1)}
          onSubmit={(typed) => void submit(typed)}
          onGiveUp={() => {
            setResult(false);
            onAnswer({ correct: false, assisted: true });
          }}
        />
      ) : null}
      {answered && (!found || clean || said) ? (
        <div className="flex items-start gap-2 rounded-xl bg-white/[0.04] px-3 py-2">
          <p dir="auto" className="min-w-0 flex-1 text-chat text-emerald-200">
            {clean ? `✓ ${question.right}` : question.right}
          </p>
          <TTSButton text={question.right} lang={tag} voice={SCRIPT_VOICES.me} className="shrink-0" />
        </div>
      ) : null}
      {answered && found && !clean ? (
        <div className="flex items-start gap-2">
          <p dir="auto" className="min-w-0 flex-1 text-meta text-slate-300">
            {question.right}
          </p>
          <TTSButton text={question.right} lang={tag} voice={SCRIPT_VOICES.me} className="shrink-0" />
        </div>
      ) : null}
      {answered && question.note ? (
        <p dir="auto" className="text-caption text-slate-300">
          {question.note}
        </p>
      ) : null}
    </div>
  );
}

function ChooseView({
  ui,
  locale,
  language,
  question,
  answered,
  onAnswer,
  tag,
  strict = false,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  question: Extract<QuizQuestion, { kind: "choose" }>;
  answered: Answer | null;
  onAnswer: (answer: Answer) => void;
  tag: string;
  /** 낱말 문제(w|): 그 낱말을 골랐는지만 본다 — 다른 보기를 서버에 다시 묻지 않음(단어 시험에서 일부러 틀린 보기가 맞음으로 기록됨, 2026-11-01). */
  strict?: boolean;
}) {
  const tone = useBankTone();
  const [picked, setPicked] = useState<number | null>(null);
  // 뜻 줄 없이 내니 다른 보기도 문장에 맞을 수 있다(Su/El agua) — 틀린 보기를 고르면 서버가 한 번 더 보고, 맞으면 맞음(2026-10-31).
  const [alsoOk, setAlsoOk] = useState(false);
  /** 낱말 문제에서 고른 보기가 문장에도 맞았던 것(끄고 다시 고르게). */
  const [fitting, setFitting] = useState<number[]>([]);
  const { checking, grade } = useTypedGrade(language);
  const shown = answered ? question.options[question.answer]! : "＿＿＿";
  const notes = useOptionNotes(answered && !question.prepared ? { sentence: `${question.before}___${question.after}`, options: question.options, answer: question.answer, mine: question.mine } : null, language, locale);
  return (
    <div className="flex flex-col gap-3">
      {question.prepared || answered ? (
        <p dir="auto" data-quiz-gloss className="text-note text-slate-400">
          {quizGloss(question.gloss, locale, language) ?? ""}
        </p>
      ) : null}
      <div className="flex items-start gap-2">
        <p dir="auto" className="min-w-0 flex-1 text-chat text-slate-100">
          {question.before}
          <strong className={`font-semibold ${answered ? tone.accent : tone.blank}`}>{shown}</strong>
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
                ? alsoOk
                  ? "border-good/60 text-ink"
                  : "border-bad text-bad"
                : "border-line text-slate-500"
            : fitting.includes(i)
              ? "border-line text-slate-500"
              : "border-line text-slate-100 hover:bg-white/5";
          return (
            <button
              key={i}
              type="button"
              dir="auto"
              disabled={Boolean(answered) || checking || fitting.includes(i)}
              onClick={async () => {
                setPicked(i);
                if (question.prepared) {
                  onAnswer({ correct: isRight, picked: option });
                  return;
                }
                if (isRight) {
                  onAnswer({ correct: true, picked: option });
                  return;
                }
                if (strict) {
                  // 낱말 문제: 고른 보기도 문장에 맞으면(뜻 줄 없이 냄 — You/I, nearby/naked) 틀림으로 세지 않고 그 보기만 끄고 다시 고르게(2026-11-01 체감 점검 #6·#7).
                  const fits = await grade(false, { kind: "blank", sentence: `${question.before}___${question.after}`, answer: question.options[question.answer]!, typed: option, open: true }, false);
                  if (fits) {
                    setFitting((current) => [...current, i]);
                    return;
                  }
                  onAnswer({ correct: false, picked: option });
                  return;
                }
                const ok = await grade(false, { kind: "blank", sentence: `${question.before}___${question.after}`, answer: question.options[question.answer]!, typed: option, open: true }, false);
                setAlsoOk(Boolean(ok));
                onAnswer({ correct: Boolean(ok), picked: option });
              }}
              className={`${chip} text-start ${style}`}
            >
              <span className={answered && !isRight && picked === i && !alsoOk ? "line-through" : ""}>{option}</span>
              {answered && notes[i]?.meaning ? (
                <span data-option-meaning dir="auto" className="mt-0.5 block text-meta text-slate-400">
                  {notes[i]!.meaning}
                </span>
              ) : null}
              {answered && !isRight && notes[i]?.why ? (
                <span data-option-why dir="auto" className="mt-0.5 block text-meta text-bad">
                  {notes[i]!.why}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      {answered && !answered.correct && question.prepared ? (
        <p data-quiz-why dir="auto" className="text-note text-slate-300">
          {question.prepared.why}
        </p>
      ) : null}
      {answered && alsoOk ? <AlsoRight ui={ui} answer={question.options[question.answer]!} /> : null}
      {fitting.length && !answered ? (
        <p data-quiz-other-word className="text-caption text-slate-300">
          {ui.quizOtherWord}
        </p>
      ) : null}
    </div>
  );
}

/**
 * 대화 조각 빈칸(curriculum/talkQuiz.ts): 내 AI 채팅·통화에서 떼 온 두세 줄 + 마지막 줄의 소재 자리를 비움.
 * 채점은 빈칸 쓰기와 같음(그 소재를 썼는지 — 다른 말을 넣는 open 다시 보기는 안 함). 칠 수 없는 조각은 고르기. 뜻은 답한 뒤 그 줄에만(통화 줄은 번역이 있음).
 */
function TalkView({ ui, language, question, answered, onAnswer, tag }: { ui: UICopy; language: string; question: Extract<QuizQuestion, { kind: "talk" }>; answered: Answer | null; onAnswer: (answer: Answer) => void; tag: string }) {
  const tone = useBankTone();
  const [result, setResult] = useState<Graded | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [hint, setHint] = useState(0);
  const { checking, grade } = useTypedGrade(language);
  const sentence = `${question.before}___${question.after}`;
  const submit = async (typed: string) => {
    const local = typedRight(question.answer, typed, { language, near: question.near });
    const plainWrong = Boolean(question.near?.some((one) => typedRight(one, typed, { language }) === "exact"));
    const final = await grade(local, { kind: "blank", sentence, answer: question.answer, typed: typed.trim() }, plainWrong);
    setResult(final);
    onAnswer({ correct: Boolean(final) && hint === 0, ...(hint ? { assisted: true } : {}) });
  };
  const target = question.lines[question.at];
  return (
    <div className="flex flex-col gap-3" data-talk>
      <ul className="flex flex-col gap-1.5">
        {question.lines.map((line, i) => {
          const mine = line.who === "me";
          const last = i === question.at;
          return (
            <li key={i} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-3 py-2 ${mine ? "bg-white/10" : "bg-white/[0.04]"} ${last ? "" : "opacity-70"}`}>
                <p dir="auto" className="text-chat text-slate-100">
                  {last ? (
                    <>
                      {question.before}
                      <strong className={`font-semibold ${answered ? tone.accent : tone.blank}`}>{answered ? question.answer : "＿＿＿"}</strong>
                      {question.after}
                    </>
                  ) : (
                    line.text
                  )}
                </p>
                {last && answered && target?.gloss ? (
                  <p dir="auto" className="mt-0.5 text-meta text-slate-400">
                    {target.gloss}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
      {answered ? (
        <div className="flex justify-end">
          <TTSButton text={question.text} lang={tag} voice={SCRIPT_VOICES.me} />
        </div>
      ) : null}
      {question.options ? (
        <div className="flex flex-wrap gap-1.5">
          {question.options.map((option) => {
            const style = answered ? (option === question.answer ? "border-good bg-good/10 text-ink" : picked === option ? "border-bad text-bad line-through" : "border-line text-slate-500") : "border-line text-slate-100 hover:bg-white/5";
            return (
              <button
                key={option}
                type="button"
                dir="auto"
                disabled={Boolean(answered)}
                onClick={() => {
                  setPicked(option);
                  onAnswer({ correct: option === question.answer, picked: option });
                }}
                className={`${chip} ${style}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      ) : (
        <TypeBox
          ui={ui}
          tag={tag}
          answer={question.answer}
          done={Boolean(answered)}
          result={answered ? result : null}
          busy={checking}
          hint={hint}
          onHint={() => setHint((n) => n + 1)}
          onSubmit={(typed) => void submit(typed)}
          onGiveUp={() => {
            setResult(false);
            onAnswer({ correct: false, assisted: true });
          }}
        />
      )}
    </div>
  );
}

const CIRCLED = ["①", "②", "③", "④"];

/**
 * 복합 빈칸(2026-11-01 사용자 "복합퀴즈 — 한 문제에 학습 소재가 여러 개", curriculum/multiQuiz.ts): 한 문장에 이미 맞힌 소재 자리 둘·셋이 비어 있다.
 * 빈칸마다 직접 치거나(한자가 든 조각은 고르기) — 확인 한 번에 빈칸마다 채점(빈칸 쓰기와 같은 기준 + 서버 다시 보기), 결과는 빈칸마다 그 열쇠에.
 * 뜻 줄은 답한 뒤에만(빈칸 쓰기와 같음).
 */
function MultiView({ ui, locale, language, question, answered, onAnswer, tag }: { ui: UICopy; locale: string; language: string; question: MultiQuestion; answered: Answer | null; onAnswer: (answer: Answer) => void; tag: string }) {
  const tone = useBankTone();
  const [typed, setTyped] = useState<string[]>(() => question.blanks.map(() => ""));
  const [results, setResults] = useState<Graded[] | null>(null);
  const { checking, grade } = useTypedGrade(language);
  const ready = question.blanks.every((_, i) => typed[i]?.trim());
  const finish = (graded: Graded[]) => {
    setResults(graded);
    const parts = question.blanks.map((blank, i) => ({ key: blank.key, correct: Boolean(graded[i]) }));
    onAnswer({ correct: parts.every((one) => one.correct), parts });
  };
  const submit = async () => {
    if (!ready || checking || answered) return;
    const graded = await Promise.all(
      question.blanks.map(async (blank, i) => {
        const mine = typed[i]!.trim();
        if (blank.options) return (mine === blank.answer ? "exact" : false) as Graded;
        const local = multiBlankRight(blank, mine, language);
        const plainWrong = Boolean(blank.near?.some((one) => typedRight(one, mine, { language }) === "exact"));
        // 다른 빈칸은 정답으로 채운 문장에서 이 빈칸만 다시 본다(같은 뜻의 다른 꼴만 — 이 소재를 썼는지 보는 문제라 open 아님).
        const sentence = question.chunks.map((chunk, k) => chunk + (k < question.blanks.length ? (k === i ? "___" : question.blanks[k]!.answer) : "")).join("");
        return grade(local, { kind: "blank", sentence, answer: blank.answer, typed: mine }, plainWrong);
      }),
    );
    finish(graded);
  };
  return (
    <div className="flex flex-col gap-3" data-multi>
      {answered ? (
        <p dir="auto" data-quiz-gloss className="text-note text-slate-400">
          {quizGloss(question.gloss, locale, language) ?? ""}
        </p>
      ) : null}
      <div className="flex items-start gap-2">
        <p dir="auto" className="min-w-0 flex-1 text-chat text-slate-100">
          {question.chunks.map((chunk, k) => (
            <span key={k}>
              {chunk}
              {k < question.blanks.length ? (
                answered ? (
                  <strong className={`font-semibold ${results?.[k] ? "text-good" : "text-bad underline decoration-dotted"}`}>{question.blanks[k]!.answer}</strong>
                ) : (
                  <strong className={`font-semibold ${tone.blank}`}>＿{CIRCLED[k]}＿</strong>
                )
              ) : null}
            </span>
          ))}
        </p>
        {answered ? <TTSButton text={question.text} lang={tag} voice={SCRIPT_VOICES.me} className="shrink-0" /> : null}
      </div>
      <div className="flex flex-col gap-2">
        {question.blanks.map((blank, i) => {
          const result = results?.[i];
          return (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span aria-hidden className={`w-5 shrink-0 text-center text-caption ${tone.blank}`}>
                  {CIRCLED[i]}
                </span>
                {blank.options ? (
                  <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                    {blank.options.map((option) => {
                      const on = typed[i] === option;
                      const style = answered ? (option === blank.answer ? "border-good bg-good/10 text-ink" : on ? "border-bad text-bad line-through" : "border-line text-slate-500") : on ? tone.pick : "border-line text-slate-100 hover:bg-white/5";
                      return (
                        <button key={option} type="button" dir="auto" disabled={Boolean(answered)} onClick={() => setTyped((list) => list.map((one, k) => (k === i ? option : one)))} className={`rounded-lg border px-2.5 py-1 text-chat ${style}`}>
                          {option}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <input
                    dir="auto"
                    lang={tag}
                    value={typed[i] ?? ""}
                    disabled={Boolean(answered)}
                    autoCapitalize="none"
                    autoCorrect="off"
                    autoComplete="off"
                    spellCheck={false}
                    onChange={(event) => setTyped((list) => list.map((one, k) => (k === i ? event.target.value : one)))}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.nativeEvent.isComposing) void submit();
                    }}
                    className={`min-w-0 flex-1 rounded-xl border bg-transparent px-3 py-2 text-chat outline-none ${answered ? (result ? "border-good text-ink" : "border-bad text-bad line-through") : `border-line text-slate-100 ${tone.focus}`}`}
                  />
                )}
              </div>
              {answered && !blank.options ? (
                result === "also" ? (
                  <div className="ps-7">
                    <AlsoRight ui={ui} answer={blank.answer} />
                  </div>
                ) : result === "loose" || !result ? (
                  <p dir="auto" className="ps-7 text-caption text-slate-300">
                    → <bdi className={`font-semibold ${tone.accent}`}>{blank.answer}</bdi>
                  </p>
                ) : null
              ) : null}
            </div>
          );
        })}
      </div>
      {answered ? null : (
        <div className="flex items-center gap-2">
          <button type="button" data-multi-check onClick={() => void submit()} disabled={!ready || checking} className="rounded-full bg-white/90 px-4 py-1.5 text-caption font-semibold text-slate-900 disabled:opacity-50">
            {checking ? "…" : ui.quizCheck}
          </button>
          <button type="button" data-quiz-giveup onClick={() => finish(question.blanks.map(() => false))} className="rounded-full border border-line px-3 py-1 text-caption text-slate-400 hover:bg-white/10">
            {ui.markUnknown}
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * 복합 틀린 곳(같은 날, curriculum/multiQuiz.ts spotsOf): 한 문장에 확실히 틀린 꼴이 둘·셋 — 낱말을 눌러 틀린 곳을 찾고 그 자리마다 바른 꼴을 친다.
 * 틀린 곳이 아닌 낱말을 두 번 누르면 끝(못 찾은 곳은 틀림). 머리의 ✎ n/m = 찾은 곳 / 틀린 곳 수. 결과는 틀린 곳마다 그 열쇠에.
 */
function SpotsView({ ui, locale, language, question, answered, onAnswer, tag }: { ui: UICopy; locale: string; language: string; question: SpotsQuestion; answered: Answer | null; onAnswer: (answer: Answer) => void; tag: string }) {
  const tone = useBankTone();
  const [done, setDone] = useState<(Graded | null)[]>(() => question.errors.map(() => null));
  const [active, setActive] = useState<number | null>(null);
  const [misses, setMisses] = useState<number[]>([]);
  const [hint, setHint] = useState(0);
  const glue = isSpaceless(question.text) ? "" : " ";
  const errorAt = (word: number) => question.errors.findIndex((error) => error.bad.includes(word));
  const finish = (graded: (Graded | null)[]) => {
    setActive(null);
    const parts = question.errors.map((error, i) => ({ key: error.key, correct: Boolean(graded[i]) }));
    onAnswer({ correct: parts.every((one) => one.correct), parts });
  };
  const resolve = (index: number, result: Graded) => {
    const next = done.map((one, i) => (i === index ? result : one));
    setDone(next);
    setActive(null);
    setHint(0);
    if (next.every((one) => one !== null)) finish(next);
  };
  const found = done.filter((one) => one !== null).length;
  const gloss = quizGloss(question.gloss, locale, language);
  return (
    <div className="flex flex-col gap-3" data-spots>
      <div className="flex items-start justify-between gap-2">
        {gloss ? (
          <p dir="auto" className="min-w-0 flex-1 text-note text-slate-400">
            {gloss}
          </p>
        ) : (
          <span />
        )}
        <span aria-hidden className="shrink-0 rounded-full border border-line px-2 py-0.5 text-caption text-slate-300">
          ✎ {found}/{question.errors.length}
        </span>
      </div>
      <p dir="auto" className={`flex flex-wrap ${glue ? "gap-1.5" : "gap-0.5"}`} data-spot-words>
        {question.words.map((word, i) => {
          const e = errorAt(i);
          const style = answered
            ? e >= 0
              ? done[e]
                ? "border-good/60 bg-good/10 text-ink"
                : "border-bad bg-bad/15 text-bad"
              : misses.includes(i)
                ? "border-line text-slate-500 line-through"
                : "border-transparent text-slate-200"
            : e >= 0 && done[e] !== null
              ? done[e]
                ? "border-good/60 bg-good/10 text-ink"
                : "border-bad bg-bad/15 text-bad"
              : e >= 0 && active === e
                ? tone.pick
                : misses.includes(i)
                  ? "border-line text-slate-500 line-through"
                  : "border-line text-slate-100 hover:bg-white/10";
          return (
            <button
              key={i}
              type="button"
              disabled={Boolean(answered) || misses.includes(i) || (e >= 0 && done[e] !== null)}
              onClick={() => {
                if (e >= 0) {
                  setActive(e);
                  setHint(0);
                  return;
                }
                const next = [...misses, i];
                setMisses(next);
                // 틀린 곳이 아닌 낱말을 두 번 누르면 끝 — 못 찾은 곳은 틀림.
                if (next.length >= 2) finish(done);
              }}
              className={`rounded-lg border px-2 py-1 text-chat ${style}`}
            >
              {word}
            </button>
          );
        })}
      </p>
      {active !== null && !answered ? (
        <TypeBox
          key={active}
          ui={ui}
          tag={tag}
          answer={question.errors[active]!.want}
          done={false}
          result={null}
          busy={false}
          hint={hint}
          onHint={() => setHint((n) => n + 1)}
          onSubmit={(typed) => {
            const right = spotsFixRight(question.errors[active]!, typed, language);
            // 💡로 답을 본 자리는 맞게 쳐도 맞음으로 세지 않는다.
            resolve(active, hint ? false : right);
          }}
          onGiveUp={() => resolve(active, false)}
        />
      ) : null}
      {!answered && active === null ? (
        <button type="button" data-quiz-giveup onClick={() => finish(done)} className="self-start rounded-full border border-line px-3 py-1 text-caption text-slate-400 hover:bg-white/10">
          {ui.markUnknown}
        </button>
      ) : null}
      {answered ? (
        <div className="flex flex-col gap-1">
          {question.errors.map((error, i) => (
            <p key={i} dir="auto" className="text-caption text-slate-300">
              <span aria-hidden className={done[i] ? "text-good" : "text-bad"}>{done[i] ? "✓ " : "✗ "}</span>
              <bdi className="text-slate-500 line-through">{error.near[0]}</bdi> → <bdi className={`font-semibold ${tone.accent}`}>{error.want}</bdi>
            </p>
          ))}
          <div className="mt-1 flex items-start gap-2 rounded-xl bg-white/[0.04] px-3 py-2">
            <p dir="auto" className="min-w-0 flex-1 text-chat text-emerald-200">
              {question.right}
            </p>
            <TTSButton text={question.right} lang={tag} voice={SCRIPT_VOICES.me} className="shrink-0" />
          </div>
        </div>
      ) : null}
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
      {/* 뜻 줄이 없으면(앱 언어 = 학습 언어) 듣고 맞추기. */}
      {quizGloss(question.gloss, locale, language) === null ? (
        <TTSButton text={question.text} lang={tag} voice={SCRIPT_VOICES.me} className="self-start" />
      ) : (
        <p dir="auto" className="text-note text-slate-400">
          {quizGloss(question.gloss, locale, language)}
        </p>
      )}
      {/* 2026-11-02: 맞출 자리를 낱말 수만큼 빈칸으로 보여 줘서 순서대로 채우기가 한눈에(틀린 곳 찾기와 다른 모양). 🔀 = 순서. */}
      <div dir="auto" className="flex min-h-11 flex-wrap items-center gap-1.5" data-order-slots>
        <span aria-hidden className="select-none text-caption opacity-70">
          🔀
        </span>
        {placed.map((tile, i) => (
          <button
            key={`${tile}-${i}`}
            type="button"
            disabled={Boolean(answered)}
            onClick={() => setPlaced((current) => current.filter((_, k) => k !== i))}
            className="rounded-lg border border-line px-2 py-1 text-chat text-ink"
          >
            {question.words[tile]}
          </button>
        ))}
        {answered
          ? null
          : question.words.slice(placed.length).map((_, i) => (
              <span key={`slot-${i}`} aria-hidden className="inline-block h-8 w-10 rounded-lg border border-dashed border-line" />
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
              <button key={tile} type="button" onClick={() => setPlaced((current) => [...current, tile])} className="rounded-lg bg-white/10 px-2 py-1 text-chat text-slate-100 hover:bg-white/15">
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

/**
 * 맞나 틀리나(2026-11-08 사용자 "틀린 답을 끼워 넣고 맞는지 판단" → "단어꼴을 바꾸지 말고 조동사 같은 문법 요소로"):
 * 카드(낱말 칸 가림 · 뜻 · 예문 — 카드 낱말에 밑줄 · 예문 뜻) → ⭕ / ❌(글 없이, 이름은 aria-label).
 * 맞는 문장에 ⭕ = 맞음 · 틀린 문장에 ❌ = 문장의 낱말을 눌러 끼운 말 찾기(맞으면 맞음) · 판단이 틀리면 틀림.
 * 답한 뒤: 끼운 말에 줄(바꾼 것이면 옆에 바른 말) + 까닭 한 줄(규칙마다 정한 문구). 결과는 문법 열쇠(slip.key)에, 낱말은 봤음만(parts seen).
 */
function JudgeView({ ui, locale, language, question, answered, onAnswer, tag }: { ui: UICopy; locale: string; language: string; question: Extract<QuizQuestion, { kind: "judge" }>; answered: Answer | null; onAnswer: (answer: Answer) => void; tag: string }) {
  const tone = useBankTone();
  const [said, setSaid] = useState<"o" | "x" | null>(null);
  const [tapped, setTapped] = useState<number | null>(null);
  const slip = question.slip;
  const wrong = question.wrong !== null;
  const shownText = wrong ? `${slip.lead}${slip.bad}${slip.tail}` : question.text;
  const words = shownText.split(" ");
  const badAt = slipBadIndex(slip);
  // 밑줄은 카드 낱말에만(조사는 빼고 — 한국어 조사가 붙은 빈칸 "가구를"에서 "가구"만).
  const word = slip.attached ? question.card.word : question.shown;
  const markAt = wrong ? (slip.attached ? slip.lead.length - word.length : slip.lead.length + slip.bad.length + 1) : question.before.length;
  // 점수(2026-11-08 사용자 "이쪽은 활용점수에"): 틀린 곳을 짚음 = 활용(장부 judge · 쓰기와 같게 체크 셋을 올림), ⭕ 맞는 문장 = 학습(고르기), 판단·짚기가 틀림 = judge 틀림.
  const finish = (correct: boolean, extra: Partial<Answer> = {}, how: { shape: "c" | "t"; judged: boolean } = { shape: "c", judged: true }) =>
    onAnswer({ correct, ...extra, ...(how.shape === "t" ? { typed: true } : {}), parts: [{ key: slip.key, correct, shape: how.shape, ...(how.judged ? { src: "judge" as const } : {}) }, { key: question.from, correct: true, seen: true }] });
  const judge = (pick: "o" | "x") => {
    if (said || answered) return;
    setSaid(pick);
    if (pick === "o") finish(!wrong, { picked: "o" }, { shape: "c", judged: wrong });
    else if (!wrong) finish(false, { picked: "x" });
  };
  const tap = (i: number) => {
    if (answered || tapped !== null) return;
    setTapped(i);
    finish(i === badAt, { picked: "x" }, { shape: i === badAt ? "t" : "c", judged: true });
  };
  const finding = said === "x" && wrong && !answered;
  const why = (() => {
    if (slip.rule === "modalTo") return ui.judgeWhyTo.replace("{w}", slip.modal ?? "");
    if (slip.rule === "beBase") return ui.judgeWhyBe;
    if (slip.rule === "an") return ui.judgeWhyAn;
    if (slip.rule === "particle") {
      const pair = KO_PARTICLE_PAIRS.find((one) => one.includes(slip.fix)) ?? [slip.fix, slip.bad];
      return ui.judgeWhyParticle.replace("{yes}", pair[0]!).replace("{no}", pair[1]!);
    }
    return ui.judgeWhyGender.replace("{w}", question.card.word).replace("{g}", slip.gender === "f" ? ui.judgeFem : ui.judgeMasc);
  })();
  const marked = (text: string, accent: boolean) => (
    <>
      {text.slice(0, markAt)}
      <span data-judge-shown className={`font-semibold underline decoration-2 underline-offset-4 ${accent ? tone.accent : "text-ink"}`}>{text.slice(markAt, markAt + word.length)}</span>
      {text.slice(markAt + word.length)}
    </>
  );
  const grammarName = ladderName(language, locale, slip.key);
  return (
    <div className="flex flex-col gap-3">
      <CardFace
        word={answered ? question.card.word : null}
        meaning={question.card.meaning}
        line={
          finding ? (
            <span className="inline-flex flex-wrap gap-1">
              {words.map((one, i) => (
                <button key={i} type="button" data-judge-word={i} onClick={() => tap(i)} className="rounded-lg border border-line px-1.5 py-0.5 hover:bg-white/10">
                  {one}
                </button>
              ))}
            </span>
          ) : answered && wrong ? (
            <>
              {slip.lead}
              <s className="text-bad decoration-2">{slip.bad}</s>
              {slip.fix ? (
                <>
                  {slip.attached ? null : " "}
                  <strong className={`font-semibold ${tone.accent}`}>{slip.fix}</strong>
                </>
              ) : null}
              {slip.tail}
            </>
          ) : (
            marked(shownText, Boolean(answered))
          )
        }
        lineGloss={quizGloss(question.gloss, locale, language)}
        speak={answered ? { text: question.text, tag } : null}
      />
      {said ? null : (
        <div className="flex items-center justify-center gap-3">
          <button type="button" data-judge="o" aria-label={ui.quizRight} title={ui.quizRight} onClick={() => judge("o")} className="flex h-12 w-20 items-center justify-center rounded-full border border-line text-xl hover:bg-white/10">
            ⭕
          </button>
          <button type="button" data-judge="x" aria-label={ui.quizWrong} title={ui.quizWrong} onClick={() => judge("x")} className="flex h-12 w-20 items-center justify-center rounded-full border border-line text-xl hover:bg-white/10">
            ❌
          </button>
        </div>
      )}
      {answered && wrong ? (
        <p data-judge-why dir="auto" className="text-caption text-slate-300">
          {why}
        </p>
      ) : null}
      {answered && grammarName ? (
        <button type="button" data-judge-grammar onClick={() => openLesson({ language, key: slip.key })} className={`self-start rounded-full border border-line px-3 py-1 text-caption ${tone.accent} hover:bg-white/10`}>
          📐 {grammarName} ›
        </button>
      ) : null}
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
  const card = question.card;
  return (
    <div className="flex flex-col gap-3">
      {card ? (
        <CardFace
          word={card.word}
          meaning={answered ? card.meaning : null}
          line={<Marked text={question.text} mark={question.mark} />}
          lineGloss={answered ? quizGloss(question.gloss, locale, language) : null}
          speak={{ text: question.text, tag }}
        />
      ) : (
      <div className="flex items-start gap-2">
        <p dir="auto" className="min-w-0 flex-1 text-chat text-slate-100">
          <Marked text={question.text} mark={question.mark} />
        </p>
        <TTSButton text={question.text} lang={tag} voice={SCRIPT_VOICES.them} className="shrink-0" />
      </div>
      )}
      <div className="flex flex-col gap-2">
        {question.options.map((_, i) => {
          const isRight = i === question.answer;
          const style = answered
            ? isRight
              ? "border-good bg-good/10 text-ink"
              : picked === i
                ? "border-bad text-bad line-through"
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

/**
 * 카드 한 장(개편 cardQuiz, 2026-11-06 사용자 "카드를 그대로 두고 예문에 빈칸, 단어만 가리고"): 낱말 · 뜻 · 예문 · 예문 뜻.
 * 가린 칸은 null(＿＿＿) — 뜻 가림이면 예문 뜻도 답한 뒤에(뜻이 새지 않게), 낱말 가림이면 예문에도 빈칸.
 */
export function CardFace({ word, meaning, line, lineGloss, speak }: { word: string | null; meaning: string | null; line: ReactNode; lineGloss: string | null; speak: { text: string; tag: string } | null }) {
  const tone = useBankTone();
  const hidden = <span className={`font-semibold ${tone.blank}`}>＿＿＿</span>;
  return (
    <div data-quiz-card className="flex flex-col gap-2 rounded-xl border border-line p-3">
      <p dir="auto" data-card-word className="text-xl font-semibold text-ink">
        {word ?? hidden}
      </p>
      <p dir="auto" data-card-meaning className="text-chat text-slate-200">
        {meaning ?? hidden}
      </p>
      <div className="flex items-start gap-2 border-t border-line pt-2">
        <div className="min-w-0 flex-1">
          <p dir="auto" className="text-chat text-slate-100">
            {line}
          </p>
          {lineGloss ? (
            <p dir="auto" data-quiz-gloss className="mt-0.5 text-note text-slate-400">
              {lineGloss}
            </p>
          ) : null}
        </div>
        {speak ? <TTSButton text={speak.text} lang={speak.tag} voice={SCRIPT_VOICES.me} className="shrink-0" /> : null}
      </div>
    </div>
  );
}

/** 단어 퀴즈: 문장 속 그 낱말에 밑줄(처음 나온 곳 하나). */
function Marked({ text, mark }: { text: string; mark?: string }) {
  const tone = useBankTone();
  const at = mark ? text.indexOf(mark) : -1;
  if (!mark || at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span data-word-mark className={`underline ${tone.mark} decoration-2 underline-offset-4`}>{mark}</span>
      {text.slice(at + mark.length)}
    </>
  );
}

/** 대화 응답(정기 시험): 상대 줄을 먼저 들려주고(🔊 다시), 보기 셋에서 내 대답을 고른다. 상대 줄 글·뜻은 답한 뒤에. */
function ReplyView({
  locale,
  language,
  question,
  answered,
  onAnswer,
  tag,
}: {
  locale: string;
  language: string;
  question: Extract<QuizQuestion, { kind: "reply" }>;
  answered: Answer | null;
  onAnswer: (answer: Answer) => void;
  tag: string;
}) {
  const tone = useBankTone();
  const [picked, setPicked] = useState<number | null>(null);
  useEffect(() => {
    void playTts(question.them, tag, SCRIPT_VOICES.them);
  }, [question.them, tag]);
  return (
    <div className="flex flex-col gap-3" data-reply>
      <div className="flex items-start gap-2 self-start rounded-2xl bg-white/10 px-3 py-2">
        <TTSButton text={question.them} lang={tag} voice={SCRIPT_VOICES.them} className="shrink-0" />
        {answered ? (
          <span className="min-w-0">
            <span dir="auto" className="block text-chat text-slate-100">
              {question.them}
            </span>
            <span dir="auto" className="mt-0.5 block text-meta text-slate-400">
              {quizGloss(question.themGloss, locale, language) ?? ""}
            </span>
          </span>
        ) : (
          <span aria-hidden className="self-center text-chat text-slate-500">…</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {question.options.map((option, i) => {
          const isRight = i === question.answer;
          const style = answered
            ? isRight
              ? "border-good bg-good/10 text-ink"
              : picked === i
                ? "border-bad text-bad line-through"
                : "border-line text-slate-500"
            : picked === i
              ? tone.pick
              : "border-line text-slate-100 hover:bg-white/5";
          return (
            <button
              key={i}
              type="button"
              dir="auto"
              disabled={Boolean(answered)}
              onClick={() => {
                setPicked(i);
                onAnswer({ correct: isRight, picked: option });
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
  const tone = useBankTone();
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
      {/* 뜻 줄이 없으면(앱 언어 = 학습 언어) 듣고 말하기. */}
      {quizGloss(question.gloss, locale, language) === null ? (
        <TTSButton text={question.text} lang={tag} voice={SCRIPT_VOICES.me} className="self-start" />
      ) : (
        <p dir="auto" className="text-chat text-slate-100">
          {quizGloss(question.gloss, locale, language)}
        </p>
      )}
      {question.mark ? (
        <span dir="auto" data-say-word className={`self-start rounded-full border px-3 py-1 text-note text-ink underline underline-offset-4 ${tone.on} ${tone.mark}`}>
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
