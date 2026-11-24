"use client";

/**
 * 첫 단계 고르기 — 첫 측정 화면(계산 lib/curriculum/firstCheck.ts).
 * ① 글자(글자가 다른 학습 언어만) → ② 문단 고르기(단계 문단 한 장씩 [어려워요 · 딱 맞아요 · 쉬워요]) → ③ 결과 한 장 [시작].
 * 어디서나 건너뛰기 = 1단계 시작(결과 장 없이). My 처음 화면(StudyMapTab) 자리.
 * 결과는 이 폰에만: 낱말 경계(quizCircle.v1 lv) · firstCheck.v1 · 글자부터면 lettersFirst. 서버에는 부르는 쪽이 지금 단계만.
 * 문단 고르기는 스스로 고른 것이라 장부(logbank)에 넣지 않는다 — 수준은 Quizbank 답으로 맞춰 간다.
 */
import { useEffect, useMemo, useState } from "react";
import type { UICopy } from "@/lib/copy";
import { learningLanguageSpeechTag } from "@/lib/learningLanguages";
import { playTts, stopTts } from "@/lib/ttsPlayer";
import { scriptFor } from "@/lib/curriculum/scripts/index";
import { needsLetters } from "@/lib/curriculum/letterLangs";
import { stageCuts } from "@/lib/curriculum/vocabBank";
import { PROBE } from "@/lib/curriculum/vocabLevel";
import { loadParas } from "@/lib/curriculum/spotLoad";
import type { SpotItem } from "@/lib/curriculum/spotErrors";
import { emptyCircle, type Circle } from "@/lib/curriculum/circle";
import {
  fixedLines,
  letterQuestions,
  lettersWeak,
  paragraphsByStage,
  paraResult,
  rateParagraph,
  saveFirstCheck,
  startParaWalk,
  wordsAbout,
  type FirstCheckResult,
  type ParaRate,
  type ParaWalk,
} from "@/lib/curriculum/firstCheck";

type Step = "letters" | "para" | "result";

export function FirstCheck({
  ui,
  locale,
  language,
  onDone,
  onSkip,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  /** 결과 장의 [시작] — 결과는 이미 이 폰에 저장됨. 부르는 쪽이 지금 단계를 서버에. */
  onDone: (result: FirstCheckResult) => void;
  /** 건너뛰기 — 1단계에서 시작. */
  onSkip: () => void;
}) {
  const seed = useMemo(() => `${language}|first|${Date.now()}`, [language]);
  const course = useMemo(() => (needsLetters(language) ? scriptFor(language) : null), [language]);
  const letterQs = useMemo(() => (course ? letterQuestions(course, seed) : []), [course, seed]);
  const speech = learningLanguageSpeechTag(language);
  const say = (text: string) => void playTts(text, speech).catch(() => undefined);
  useEffect(() => () => stopTts(), []);

  const [step, setStep] = useState<Step>(letterQs.length ? "letters" : "para");
  const [help, setHelp] = useState(false);
  // ① 글자
  const [letterAt, setLetterAt] = useState(0);
  const [letterAnswers, setLetterAnswers] = useState<boolean[]>([]);
  const [letterPicked, setLetterPicked] = useState<string | null>(null);
  // ② 문단
  const [paras, setParas] = useState<Map<number, SpotItem> | null>(null);
  const [walk, setWalk] = useState<ParaWalk | null>(null);
  const [result, setResult] = useState<FirstCheckResult | null>(null);
  const cuts = stageCuts(language);
  const stages = useMemo(() => (paras ? [...paras.keys()].sort((a, b) => a - b) : []), [paras]);

  useEffect(() => {
    let alive = true;
    void loadParas(language).then((list) => {
      if (!alive) return;
      const map = paragraphsByStage(list, seed);
      setParas(map);
      setWalk(startParaWalk([...map.keys()].sort((a, b) => a - b)));
    });
    return () => {
      alive = false;
    };
  }, [language, seed]);

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
      setStep("para");
    }, 700);
  };

  // ② 문단: 지금 단계의 바른 글.
  const para = step === "para" && walk && walk.done === null ? paras?.get(walk.stage) : undefined;
  const lines = useMemo(() => (para ? fixedLines(para, language) : []), [para, language]);
  const rate = (value: ParaRate) => {
    if (!walk) return;
    stopTts();
    const next = rateParagraph(walk, value, stages);
    setWalk(next);
    if (next.done !== null) choose(next.done);
  };
  // 문단이 하나도 없는 언어(읽기 실패 포함)는 1단계.
  useEffect(() => {
    if (step === "para" && paras && !paras.size) choose(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, paras]);

  const choose = (stage: number) => {
    const out = paraResult(stage, cuts);
    // 낱말 경계 → Quizbank 수준 맞추기(고른 단계에서 시작, 가늠 단계 건너뜀 — 그 뒤는 답으로 고쳐 감).
    try {
      const name = `quizCircle.v1.${language}`;
      const raw = JSON.parse(localStorage.getItem(name) ?? "null") as Circle | null;
      const circle = raw && typeof raw.size === "number" && raw.items ? raw : emptyCircle();
      localStorage.setItem(name, JSON.stringify({ ...circle, lv: { b: out.b, n: PROBE, picked: true } }));
    } catch {
      // 이번에만.
    }
    finish(out);
  };

  const finish = (out: FirstCheckResult) => {
    saveFirstCheck(language, out);
    setResult(out);
    setStep("result");
  };

  const dots: Step[] = [...(letterQs.length ? (["letters"] as Step[]) : []), "para", "result"];
  const dotOn = (one: Step) => dots.indexOf(one) <= dots.indexOf(step);
  const label = step === "letters" ? `${ui.fcLetters} · ${letterAt + 1}/${letterQs.length}` : "";

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
      {label ? <p className="text-caption text-slate-400">{label}</p> : null}

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

      {step === "para" ? (
        para ? (
          <div className="flex flex-col gap-4">
            <div data-para-card={para.stage} className="flex flex-col gap-2 rounded-2xl border border-line bg-white/5 px-4 py-5">
              {lines.map((line, index) => (
                <p key={index} dir="auto" className="text-chat leading-relaxed text-ink">
                  {line}
                </p>
              ))}
              <button type="button" onClick={() => say(lines.join(" "))} aria-label={ui.listen} className="self-end rounded-full px-2 text-note text-slate-300 hover:bg-white/5">
                🔊
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button type="button" data-para-rate="hard" onClick={() => rate("hard")} className="rounded-xl border border-line px-2 py-3 text-note text-slate-200 hover:bg-white/5">
                {ui.fcHard}
              </button>
              <button type="button" data-para-rate="fit" onClick={() => rate("fit")} className="tb-btn rounded-xl px-2 py-3 text-note font-semibold">
                {ui.fcFit}
              </button>
              <button type="button" data-para-rate="easy" onClick={() => rate("easy")} className="rounded-xl border border-line px-2 py-3 text-note text-slate-200 hover:bg-white/5">
                {ui.fcEasy}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400">{ui.loading}</p>
        )
      ) : null}

      {step === "result" && result ? (
        <div data-first-result className="flex flex-col gap-3">
          <h3 className="text-body font-semibold text-ink">{ui.stageStartTitle}</h3>
          {help ? <p className="text-caption text-slate-400">{ui.fcHelp}</p> : null}
          {result.letters ? (
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
            {ui.fcStart}
          </button>
        </div>
      ) : null}
    </div>
  );
}
