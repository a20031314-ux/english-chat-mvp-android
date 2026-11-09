"use client";

/**
 * 첫 단계 고르기 — 첫 측정 화면(2026-11-07 사용자 "이대로 만들어줘", 설계 hub/work/drafts/placement-2026-11-06.md, 계산 lib/curriculum/firstCheck.ts).
 * ① 글자(글자가 다른 학습 언어만) → ② 낱말 예/아니오 24장 → 뜻 고르기 5 → ③ 표현·문법 오르기 → ④ 결과 한 장 [시작].
 * 어디서나 건너뛰기 = 1단계 시작(결과 장 없이). My 처음 화면(StudyMapTab) 자리.
 * 결과는 이 폰에만: 낱말 경계(quizCircle.v1 lv) · firstCheck.v1 · 장부(뜻 고르기·③ 답만, exam·pick) · 글자부터면 lettersFirst. 서버에는 부르는 쪽이 지금 단계만.
 * 다시 측정(recheck — 2026-11-09 2주마다 실력 확인, lib/curriculum/skillCheck.ts): 글자 없이 ②③, 오르기는 지난번 한 단계 아래부터,
 * 결과는 skillCheck.v1(firstCheck.v1은 그대로)과 낱말 경계, 결과 장은 지난번 → 이번. 단계(서버)는 안 바꿈.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import type { UICopy } from "@/lib/copy";
import { NativeAdSlot } from "@/components/NativeAdSlot";
import { QuestionView, type Answer } from "@/components/studyMap/QuizPlayer";
import { learningLanguageSpeechTag } from "@/lib/learningLanguages";
import { playTts, stopTts } from "@/lib/ttsPlayer";
import { scriptFor } from "@/lib/curriculum/scripts/index";
import { needsLetters } from "@/lib/curriculum/letterLangs";
import { loadBank, stageCuts, BANK_CHUNK, type BankWord } from "@/lib/curriculum/vocabBank";
import { fetchWordChunk } from "@/lib/curriculum/useWordBank";
import { usePrepared } from "@/lib/curriculum/preparedLoad";
import { chooseFromPrepared, type PreparedItem } from "@/lib/curriculum/preparedQuiz";
import { useExpressionCards } from "@/lib/curriculum/useExpressionCards";
import { cardQuiz, type QuizQuestion } from "@/lib/curriculum/quiz";
import { noteLedger } from "@/lib/curriculum/logLedger";
import { emptyCircle, type Circle } from "@/lib/curriculum/circle";
import { climbFrom, saveRecheck, type SkillCheck } from "@/lib/curriculum/skillCheck";
import {
  climbAnswer,
  climbNext,
  climbOut,
  climbStart,
  estimateB,
  falseYes,
  letterQuestions,
  lettersWeak,
  meaningRanks,
  nextYnCard,
  saveFirstCheck,
  seeded,
  startClimb,
  wordLevel,
  wordsAbout,
  YN_TOTAL,
  type Climb,
  type ClimbKind,
  type FirstCheckResult,
  type YnAnswer,
  type YnCard,
} from "@/lib/curriculum/firstCheck";

type Step = "letters" | "words" | "meaning" | "climb" | "result";
type Asked = { key: string; question: QuizQuestion; kind?: ClimbKind; rank?: number };

const FAKE_FILES: Record<string, () => Promise<{ default: { words: string[] } }>> = {
  ar: () => import("@/lib/curriculum/pseudowords/ar.json"),
  en: () => import("@/lib/curriculum/pseudowords/en.json"),
  es: () => import("@/lib/curriculum/pseudowords/es.json"),
  fr: () => import("@/lib/curriculum/pseudowords/fr.json"),
  hi: () => import("@/lib/curriculum/pseudowords/hi.json"),
  id: () => import("@/lib/curriculum/pseudowords/id.json"),
  it: () => import("@/lib/curriculum/pseudowords/it.json"),
  ja: () => import("@/lib/curriculum/pseudowords/ja.json"),
  ko: () => import("@/lib/curriculum/pseudowords/ko.json"),
  pt: () => import("@/lib/curriculum/pseudowords/pt.json"),
  ru: () => import("@/lib/curriculum/pseudowords/ru.json"),
  th: () => import("@/lib/curriculum/pseudowords/th.json"),
  vi: () => import("@/lib/curriculum/pseudowords/vi.json"),
  zh: () => import("@/lib/curriculum/pseudowords/zh.json"),
};

/** 뜻 고르기 한 문제(낱말 카드 앞면 — 낱말·예문은 보이고 뜻만 가림, quiz.ts cardQuiz "hide"와 같은 모양). 같은 품사 뜻 셋이 오답. */
async function meaningQuestion(language: string, ui: string, words: readonly BankWord[], rank: number, seed: string): Promise<Asked | null> {
  const word = words[rank];
  if (!word) return null;
  const { cards } = await fetchWordChunk(language, ui, Math.floor(rank / BANK_CHUNK));
  const card = cards.find((one) => one.w === word.w);
  if (!card?.gloss?.trim() || !card.example?.includes(card.piece)) return null;
  const posOf = new Map(words.slice(Math.floor(rank / BANK_CHUNK) * BANK_CHUNK, (Math.floor(rank / BANK_CHUNK) + 1) * BANK_CHUNK).map((one) => [one.w, one.pos]));
  const norm = (text: string) => text.trim().toLocaleLowerCase();
  const others = cards.filter((one) => one.w !== card.w && one.gloss?.trim() && norm(one.gloss) !== norm(card.gloss));
  const random = seeded(`${seed}|${card.w}`);
  const same = others.filter((one) => posOf.get(one.w) === word.pos).sort(() => random() - 0.5);
  const rest = others.filter((one) => posOf.get(one.w) !== word.pos).sort(() => random() - 0.5);
  const wrong: string[] = [];
  for (const one of [...same, ...rest]) {
    if (wrong.length >= 3) break;
    if (!wrong.some((w) => norm(w) === norm(one.gloss))) wrong.push(one.gloss.trim());
  }
  if (wrong.length < 3) return null;
  const right = { en: "", raw: card.gloss.trim() };
  const options = [right, ...wrong.map((raw) => ({ en: "", raw }))].sort(() => random() - 0.5);
  return {
    key: `w|${card.w}`,
    rank,
    question: { kind: "meaning", text: card.example, options, answer: options.indexOf(right), gloss: { en: "", raw: card.exampleGloss }, from: `w|${card.w}`, mark: card.piece, card: { word: card.w, meaning: card.gloss.trim() } },
  };
}

export function FirstCheck({
  ui,
  locale,
  language,
  onDone,
  onSkip,
  recheck,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  /** 결과 장의 [시작] — 결과는 이미 이 폰에 저장됨. 부르는 쪽이 지금 단계를 서버에. */
  onDone: (result: FirstCheckResult) => void;
  /** 건너뛰기 — 1단계에서 시작(다시 측정이면 닫기). */
  onSkip: () => void;
  /** 다시 측정: 지난 확인(없으면 null) — 글자 없이, 결과는 지난번과 나란히. */
  recheck?: { last: SkillCheck | null };
}) {
  const seed = useMemo(() => `${language}|${recheck ? "recheck" : "first"}|${Date.now()}`, [language, recheck]);
  const course = useMemo(() => (!recheck && needsLetters(language) ? scriptFor(language) : null), [language, recheck]);
  const letterQs = useMemo(() => (course ? letterQuestions(course, seed) : []), [course, seed]);
  const speech = learningLanguageSpeechTag(language);
  const say = (text: string) => void playTts(text, speech).catch(() => undefined);
  useEffect(() => () => stopTts(), []);

  const [step, setStep] = useState<Step>(letterQs.length ? "letters" : "words");
  const [help, setHelp] = useState(false);
  // ① 글자
  const [letterAt, setLetterAt] = useState(0);
  const [letterAnswers, setLetterAnswers] = useState<boolean[]>([]);
  const [letterPicked, setLetterPicked] = useState<string | null>(null);
  // ② 낱말
  const [words, setWords] = useState<readonly BankWord[] | null>(null);
  const [fakes, setFakes] = useState<string[] | null>(null);
  const [shown, setShown] = useState<YnCard[]>([]);
  const [ynAnswers, setYnAnswers] = useState<YnAnswer[]>([]);
  const ynRef = useRef<YnAnswer[]>([]);
  // 뜻 고르기 · ③
  const [asked, setAsked] = useState<Asked[]>([]);
  const [at, setAt] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const b0 = useRef<number | null>(null);
  const climbRef = useRef<Climb | null>(null);
  const [result, setResult] = useState<FirstCheckResult | null>(null);

  const prepared = usePrepared(language, locale);
  const exprCards = useExpressionCards(language, locale, 5);
  const cuts = stageCuts(language);

  useEffect(() => {
    let alive = true;
    void loadBank(language).then((list) => alive && setWords(list));
    void (FAKE_FILES[language]?.() ?? Promise.resolve({ default: { words: [] } }))
      .then((mod) => alive && setFakes(mod.default.words))
      .catch(() => alive && setFakes([]));
    return () => {
      alive = false;
    };
  }, [language]);

  // ① 글자: 문제가 바뀌면 소리부터.
  const letterQ = step === "letters" ? letterQs[letterAt] : undefined;
  useEffect(() => {
    if (letterQ) say(letterQ.say);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letterQ]);
  const pickLetter = (char: string) => {
    if (!letterQ || letterPicked) return;
    setLetterPicked(char);
    const next = [...letterAnswers, char === letterQ.answer];
    setLetterAnswers(next);
    window.setTimeout(() => {
      setLetterPicked(null);
      if (letterAt + 1 < letterQs.length) {
        setLetterAt(letterAt + 1);
        return;
      }
      if (lettersWeak(next)) {
        finish({ at: Date.now(), letters: true, b: 0, expression: 1, grammar: 1 });
        return;
      }
      setStep("words");
    }, 700);
  };

  // ② 예/아니오: 다음 카드.
  const ynReady = Boolean(words?.length && fakes);
  const card = step === "words" && ynReady ? shown[shown.length - 1] : undefined;
  useEffect(() => {
    if (step !== "words" || !ynReady || shown.length > ynAnswers.length) return;
    if (ynAnswers.length >= YN_TOTAL) return;
    const next = nextYnCard({ words: words!, cuts, fakes: fakes!, answers: ynAnswers, shown, seed });
    if (next) setShown([...shown, next]);
    else void toMeaning(ynAnswers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, ynReady, shown, ynAnswers]);
  const answerYn = (yes: boolean) => {
    if (!card || ynAnswers.length >= shown.length) return;
    const next = [...ynAnswers, { rank: card.rank, yes }];
    ynRef.current = next;
    setYnAnswers(next);
    if (next.length >= YN_TOTAL) void toMeaning(next);
  };

  // 뜻 고르기 문제 받기(낱말 카드 묶음 — 이 폰에 없으면 서버, 10초 넘으면 건너뜀).
  const toMeaning = async (yn: readonly YnAnswer[]) => {
    const list = words ?? [];
    const b = estimateB(yn, list.length);
    b0.current = b;
    setStep("meaning");
    const skip = new Set(yn.flatMap((one) => (one.rank === null ? [] : [one.rank])));
    const ranks = meaningRanks(b ?? Math.round((cuts[0] ?? 700) * 0.5), list, skip);
    const timeout = new Promise<null>((resolve) => window.setTimeout(() => resolve(null), 10_000));
    const made = await Promise.all(ranks.map((rank) => Promise.race([meaningQuestion(language, locale, list, rank, seed).catch(() => null), timeout])));
    const qs = made.filter((one): one is Asked => Boolean(one));
    if (!qs.length) {
      startClimbStep([], {});
      return;
    }
    setAsked(qs);
    setAt(0);
  };

  // ③ 표현·문법 한 문제(그 단계에 문제가 없으면 그 종류는 멈춤).
  const used = useRef(new Set<string>());
  const climbQuestion = (kind: ClimbKind, stage: number): Asked | null => {
    const fromPrepared = (prepared ?? []).filter((item: PreparedItem) => item.kind === kind && item.stage === stage && !used.current.has(item.key));
    const random = seeded(`${seed}|${kind}|${stage}|${used.current.size}`);
    for (const item of [...fromPrepared].sort(() => random() - 0.5)) {
      const question = chooseFromPrepared(item);
      if (question) return { key: item.key, question, kind };
    }
    if (kind === "expression") {
      const keys = exprCards.deck.filter((one) => one.stage === stage && exprCards.ready.has(one.key) && !used.current.has(one.key)).map((one) => one.key);
      for (const key of [...keys].sort(() => random() - 0.5)) {
        const question = cardQuiz(language, key, "hide", seed);
        if (question) return { key, question, kind };
      }
    }
    return null;
  };
  const advanceClimb = (climb: Climb, list: Asked[], given: Record<number, Answer>) => {
    let state = climb;
    for (let guard = 0; guard < 6; guard += 1) {
      const next = climbNext(state);
      if (!next) break;
      const one = climbQuestion(next.kind, next.stage);
      if (one) {
        used.current.add(one.key);
        climbRef.current = state;
        setAsked([...list, one]);
        setAt(list.length);
        return;
      }
      state = climbOut(state, next.kind);
    }
    climbRef.current = state;
    done(list, given, state);
  };
  const startClimbStep = (list: Asked[], given: Record<number, Answer>) => {
    setStep("climb");
    const has = (kind: ClimbKind) => (prepared ?? []).some((item) => item.kind === kind) || (kind === "expression" && exprCards.ready.size > 0);
    advanceClimb(startClimb({ expression: has("expression"), grammar: has("grammar") }, recheck ? climbFrom(recheck.last ?? undefined) : undefined), list, given);
  };

  const next = () => {
    const current = asked[at];
    const answer = answers[at];
    if (!current || !answer) return;
    if (step === "meaning") {
      if (at + 1 < asked.length && !asked[at + 1]?.kind) {
        setAt(at + 1);
        return;
      }
      startClimbStep(asked, answers);
      return;
    }
    if (step === "climb" && current.kind && climbRef.current) {
      advanceClimb(climbAnswer(climbRef.current, current.kind, answer.correct && !answer.skipped), asked, answers);
    }
  };

  const done = (list: Asked[], given: Record<number, Answer>, climb: Climb) => {
    const meaning = list.flatMap((one, i) => (one.rank !== undefined && given[i] ? [{ rank: one.rank, correct: given[i]!.correct }] : []));
    const level = wordLevel(b0.current, meaning, words?.length ?? 1, cuts);
    const out: FirstCheckResult = { at: Date.now(), letters: false, b: level.b, expression: climbStart(climb.lanes.expression), grammar: climbStart(climb.lanes.grammar), f: falseYes(ynRef.current) };
    // 낱말 경계 → Quizbank 수준 맞추기(가늠 단계 건너뜀).
    try {
      const name = `quizCircle.v1.${language}`;
      const raw = JSON.parse(localStorage.getItem(name) ?? "null") as Circle | null;
      const circle = raw && typeof raw.size === "number" && raw.items ? raw : emptyCircle();
      localStorage.setItem(name, JSON.stringify({ ...circle, lv: level }));
    } catch {
      // 이번에만.
    }
    // 실제로 푼 문제만 장부에(예/아니오는 스스로 말한 것이라 넣지 않음).
    noteLedger(
      language,
      list.flatMap((one, i) => (given[i] && !given[i]!.skipped ? [{ k: one.key, src: "exam" as const, r: given[i]!.correct ? ("ok" as const) : ("miss" as const), m: "pick" as const }] : [])),
    );
    finish(out);
  };

  const finish = (out: FirstCheckResult) => {
    if (recheck) saveRecheck(language, { at: out.at, b: out.b, expression: out.expression, grammar: out.grammar });
    else saveFirstCheck(language, out);
    setResult(out);
    setStep("result");
  };

  const dots: Step[] = [...(letterQs.length ? (["letters"] as Step[]) : []), "words", "climb", "result"];
  const dotOn = (one: Step) => dots.indexOf(one) <= dots.indexOf(step === "meaning" ? "words" : step);
  const question = (step === "meaning" || step === "climb") && asked[at] ? asked[at] : null;
  const label = step === "letters" ? ui.fcLetters : step === "words" || step === "meaning" ? ui.partVocab : question?.kind === "grammar" ? ui.partGrammar : ui.partExpression;
  const count =
    step === "letters"
      ? `${letterAt + 1}/${letterQs.length}`
      : step === "words"
        ? `${Math.min(YN_TOTAL, ynAnswers.length + 1)}/${YN_TOTAL}`
        : question?.kind && climbRef.current
          ? ui.stageNumber.replace("{n}", String(climbRef.current.lanes[question.kind].stage))
          : "";

  return (
    <div data-first-check={step} className="mx-auto flex max-w-md flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1" aria-hidden>
          {dots.map((one) => (
            <span key={one} className={`h-1 w-5 rounded-full ${dotOn(one) ? "bg-sky-300" : "bg-white/15"}`} />
          ))}
        </div>
        {step === "result" ? (
          <button type="button" onClick={() => setHelp(!help)} aria-label="?" className="rounded-full border border-line px-2 text-caption text-slate-300">
            ?
          </button>
        ) : (
          <button type="button" data-first-skip onClick={onSkip} className="text-caption text-slate-400 hover:text-slate-200">
            {ui.quizSkip}
          </button>
        )}
      </div>
      {step !== "result" ? (
        <p className="text-caption text-slate-400">
          {label}
          {count ? ` · ${count}` : ""}
        </p>
      ) : null}

      {letterQ ? (
        <div className="flex flex-col items-center gap-5">
          <button type="button" onClick={() => say(letterQ.say)} aria-label={ui.listen} className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-400/20 text-title text-sky-200">
            🔊
          </button>
          <div className="grid w-full grid-cols-2 gap-2">
            {letterQ.options.map((char) => {
              const tone = !letterPicked ? "border-line" : char === letterQ.answer ? "border-emerald-400" : char === letterPicked ? "border-amber-400" : "border-line opacity-50";
              return (
                <button key={char} type="button" dir="auto" onClick={() => pickLetter(char)} className={`rounded-xl border ${tone} py-4 text-title text-slate-100 hover:bg-white/5`}>
                  {char}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {step === "words" ? (
        card ? (
          <div className="flex flex-col gap-4">
            <div data-yn-card className="flex min-h-[10rem] flex-col items-center justify-center gap-1 rounded-2xl border border-line bg-white/5 px-4 py-8">
              <span dir="auto" className="text-title font-semibold text-slate-100">
                {card.word}
              </span>
              {card.reading ? <span className="text-caption text-slate-400">{card.reading}</span> : null}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" data-yn="no" onClick={() => answerYn(false)} className="rounded-xl border border-line px-4 py-3 text-note text-slate-200 hover:bg-white/5">
                {ui.fcUnknown}
              </button>
              <button type="button" data-yn="yes" onClick={() => answerYn(true)} className="tb-btn rounded-xl px-4 py-3 text-note font-semibold">
                {ui.fcKnow}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400">{ui.mapLoading}</p>
        )
      ) : null}

      {step === "meaning" && !question ? <p className="text-sm text-slate-400">{ui.mapLoading}</p> : null}
      {question ? (
        <QuestionView
          key={`${step}-${at}`}
          ui={ui}
          locale={locale}
          language={language}
          question={question.question}
          answered={answers[at] ?? null}
          onAnswer={(value) => setAnswers((current) => (current[at] ? current : { ...current, [at]: value }))}
          onNext={next}
          showExamples={false}
        />
      ) : null}

      {step === "result" && result ? (
        <div data-first-result className="flex flex-col gap-3">
          <h3 className="text-body font-semibold text-ink">{recheck ? ui.skillCheckTitle : ui.stageStartTitle}</h3>
          {help ? <p className="text-caption text-slate-400">{ui.fcHelp}</p> : null}
          {recheck ? (
            <RecheckResult ui={ui} locale={locale} last={recheck.last} now={result} />
          ) : result.letters ? (
            <p className="rounded-xl border border-line px-4 py-3 text-note text-slate-100">
              {ui.stageNumber.replace("{n}", "0")} · {ui.scriptEntry}
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-white/10 rounded-xl border border-line px-4">
              {[
                [ui.partVocab, ui.fcWordsAbout.replace("{n}", wordsAbout(result.b).toLocaleString(locale))],
                [ui.partExpression, ui.stageNumber.replace("{n}", String(result.expression))],
                [ui.partGrammar, ui.stageNumber.replace("{n}", String(result.grammar))],
              ].map(([name, value]) => (
                <div key={name} className="flex items-center justify-between py-3 text-note">
                  <span className="text-slate-100">{name}</span>
                  <span className="tabular-nums text-slate-300">{value}</span>
                </div>
              ))}
            </div>
          )}
          <button type="button" data-first-start onClick={() => onDone(result)} className="tb-btn rounded-xl px-4 py-3 text-note font-semibold">
            {recheck ? ui.billingClose : ui.fcStart}
          </button>
          {/* 📏 실력 확인 결과(14일마다 하는 시험의 끝) 아래 네이티브 하나 — 닫기 버튼과 한 줄 넘게 띄움. 처음 측정(설치 직후 온보딩)에는 없음. */}
          {recheck ? <NativeAdSlot feedId="results" slotKey="skill-check-end" spaced /> : null}
        </div>
      ) : null}
    </div>
  );
}

/** 다시 측정 결과: 줄마다 지난번 → 이번(늘면 초록). 지난번이 없으면 이번만. */
function RecheckResult({ ui, locale, last, now }: { ui: UICopy; locale: string; last: SkillCheck | null; now: FirstCheckResult }) {
  const words = (b: number) => ui.fcWordsAbout.replace("{n}", wordsAbout(b).toLocaleString(locale));
  const stage = (n: number) => ui.stageNumber.replace("{n}", String(n));
  const rows: [string, string, string | null, number][] = [
    [ui.partVocab, words(now.b), last ? words(last.b) : null, last ? wordsAbout(now.b) - wordsAbout(last.b) : 0],
    [ui.partExpression, stage(now.expression), last ? stage(last.expression) : null, last ? now.expression - last.expression : 0],
    [ui.partGrammar, stage(now.grammar), last ? stage(last.grammar) : null, last ? now.grammar - last.grammar : 0],
  ];
  return (
    <div data-recheck-result className="flex flex-col divide-y divide-white/10 rounded-xl border border-line px-4">
      {rows.map(([name, value, before, delta]) => (
        <div key={name} className="flex items-center justify-between gap-3 py-3 text-note">
          <span className="text-slate-100">{name}</span>
          <span className="tabular-nums text-slate-300">
            {before ? (
              <span className="text-slate-500">
                {before} <span className="inline-block rtl:rotate-180">→</span>{" "}
              </span>
            ) : null}
            <span className={delta > 0 ? "font-semibold text-good" : delta < 0 ? "text-bad" : ""}>{value}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
