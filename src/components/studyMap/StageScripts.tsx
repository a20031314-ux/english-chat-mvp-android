"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { FrameRedoCards, StageFrames } from "@/components/studyMap/StageFrames";
import type { RedoItem } from "@/lib/curriculum/frameRedo";
import { useStageGlosses } from "@/lib/curriculum/useStageGlosses";
import { Attempt } from "@/components/RoleplayReview";
import { sayLine } from "@/components/RoleplayOwnLine";
import { TTSButton } from "@/components/TTSButton";
import { usePremium } from "@/contexts/PremiumContext";
import { readCachedAccount, subscribeSession } from "@/lib/account/session";
import { apiUrl } from "@/lib/apiBase";
import { sendAppIntent } from "@/lib/appIntents";
import type { UICopy } from "@/lib/copy";
import { entitlementHeaders } from "@/lib/billing/billingService";
import {
  cleanBesidesName,
  countsForPass,
  glossFor,
  isSituationScript,
  passOutcome,
  hintOf,
  modesFor,
  personalize,
  runPasses,
  usableName,
  scriptsFor,
  scriptVoice,
  variantOf,
  type LineRun,
  type ScriptMode,
  type StageScript,
} from "@/lib/curriculum/stageScripts";
import type { LedgerState } from "@/lib/learner/ledger";
import { learningLanguageSpeechTag, type LearningLanguageCode } from "@/lib/learningLanguages";
import { compareToTarget, type Practice } from "@/lib/roleplay/practice";
import { playTts, stopTts } from "@/lib/ttsPlayer";
import { SelfCheck } from "@/components/studyMap/TodayPlan";
import { clearResume, readResume, resumeKey, saveResume, type ResumeState } from "@/lib/curriculum/resume";

/**
 * My 단계 보기의 "대본으로 연습" — 단계마다 상황별 대본(curriculum/stageScripts.ts), 맨 위에 둔다.
 * 상대 줄은 소리로 나오고 내 줄에서 멈춘다. 보는 방식은 단계마다(modesFor): 1~2 따라 말하기·첫 글자만·가리기, 3~5 따라 말하기·가리기·내 말로.
 * 🎤 → 원문 방식은 낱말 비교(roleplay/practice.ts) + 한 줄, "내 말로"는 뜻이 통하는지(모델). 내 줄을 모두 통과 방식으로 맞히면
 * /api/curriculum/scripts에 통과를 남기고 그 대본의 핵심 표현이 장부에 오른다(표현 갈래). 다음 단계 = 네 갈래 70% + 그 단계 상황 대본 모두 통과.
 * 상황 대본에 안 나온 핵심 표현은 짧은 표현 대본(situation 없음)으로 — 목록 아래 따로.
 * 3~4단계 상대 줄은 판마다 바뀐다(alt). 5단계는 goal과 "통화로 해 보기"(그 상황으로 AI 통화).
 */

const MODE_KEY = "stageScriptMode";

/** 오늘의 대본(서버가 고름): 문법 이름은 앱 언어, 표현은 학습 언어. */
export type ScriptRecommend = {
  stage: number;
  id: string;
  why: { kind: "grammar" | "expression"; items: string[] } | { kind: "next" };
};
type Result = { heard: string; practice: Practice | null; clean: boolean; mode: ScriptMode; unclear?: string[] };

function readMode(stage: number): ScriptMode {
  const allowed = modesFor(stage);
  try {
    const saved = localStorage.getItem(`${MODE_KEY}.${stage <= 2 ? "early" : "late"}`) as ScriptMode | null;
    return saved && allowed.includes(saved) ? saved : "shadow";
  } catch {
    return "shadow";
  }
}

export function StageScripts({
  ui,
  locale,
  language,
  stage,
  passed,
  onPassed,
  expressionStates = {},
  openFor = null,
  recommended = null,
  redo = [],
  onRedoDone,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  stage: number;
  /** 통과한 대본 id(/api/notebook parts[].scripts.passed). */
  passed: readonly string[];
  onPassed?: (id: string) => void;
  /** 그 단계 핵심 표현의 장부 상태(/api/notebook parts[].expressions) — 대본마다 붙은 표현 칩의 점. */
  expressionStates?: Record<string, LedgerState | null>;
  /** "다음 단계까지: 표현" 연습 → 이 대본을 연다(at = 누른 때, 같은 대본을 다시 열 수 있게). */
  openFor?: { id: string; at: number } | null;
  /** 이 단계의 오늘의 대본(맨 위 카드). */
  recommended?: ScriptRecommend | null;
  /** 틀린 틀 다시 연습(/api/notebook redo, 지금 단계에서만 넘김). */
  redo?: readonly RedoItem[];
  onRedoDone?: (frameId: string) => void;
}) {
  const scripts = scriptsFor(language, stage);
  const [open, setOpen] = useState<StageScript | null>(null);
  // 영어·한국어 밖 앱 언어: 뜻풀이를 옮긴 표를 받아 둔다(받으면 다시 그림).
  useStageGlosses(language, stage, locale);
  // 대본의 학습자 이름 자리에 로그인한 사용자의 닉네임(없으면 대본 이름 그대로).
  const nickname = useSyncExternalStore(subscribeSession, () => readCachedAccount()?.profile.nickname ?? null, () => null);
  // 같은 대본이면 같은 객체(재생 effect가 다시 돌지 않게).
  const shown = useMemo(() => (open ? personalize(open, language, nickname) : null), [open, language, nickname]);
  const [handled, setHandled] = useState(0);
  const [frameFor, setFrameFor] = useState<{ id: string; at: number } | null>(null);
  if (openFor && openFor.at !== handled) {
    // 밖에서 고른 대본을 연다(렌더 중 한 번 — 같은 at은 다시 안 연다).
    setHandled(openFor.at);
    setOpen(scripts.find((script) => script.id === openFor.id) ?? null);
    // 문장구조 id면 아래 StageFrames가 연다(문법 칸 → 문장구조, 2026-10-28).
    setFrameFor(scripts.some((script) => script.id === openFor.id) ? null : openFor);
  }
  if (!scripts.length) return null;
  const situations = scripts.filter(isSituationScript);
  const extras = scripts.filter((script) => !isSituationScript(script));
  const done = situations.filter((script) => passed.includes(script.id)).length;
  const dot = (state: LedgerState | null | undefined) =>
    state === "mastered" ? "bg-status-mastered" : state === "learned" ? "bg-status-learned" : state === "met" ? "bg-status-pending" : "border border-line";
  const row = (script: StageScript) => {
    const ok = passed.includes(script.id);
    return (
      <button
        key={script.id}
        type="button"
        onClick={() => setOpen(script)}
        className="flex items-center justify-between gap-2 rounded-xl border border-line px-3 py-2.5 text-start hover:bg-white/5"
      >
        <span className="min-w-0 flex-1">
          <span dir="auto" className="block text-note text-slate-100">
            {glossFor(script.setting, locale)}
          </span>
          {script.expressions.length ? (
            <span className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
              {script.expressions.map((expression) => (
                <span key={expression} className="flex items-center gap-1 text-meta text-slate-400">
                  <span aria-hidden className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot(expressionStates[expression])}`} />
                  <span dir="auto">{expression}</span>
                </span>
              ))}
            </span>
          ) : null}
        </span>
        {ok ? (
          <span className="shrink-0 text-caption text-good">✓</span>
        ) : (
          <span className="shrink-0 text-meta tabular-nums text-slate-500">{script.lines.filter((line) => line.who === "me").length} 🎤</span>
        )}
        <span aria-hidden className="text-caption text-slate-500 rtl:rotate-180">›</span>
      </button>
    );
  };
  const picked = recommended ? scripts.find((script) => script.id === recommended.id) ?? null : null;
  const reason = !recommended
    ? ""
    : recommended.why.kind === "grammar"
      ? ui.scriptWhyGrammar.replace("{items}", recommended.why.items.join(" · "))
      : recommended.why.kind === "expression"
        ? ui.scriptWhyExpression.replace("{items}", recommended.why.items.join(" · "))
        : ui.scriptWhyNext;
  return (
    <section className="mt-3 flex flex-col gap-2">
      {redo.length ? (
        <FrameRedoCards
          ui={ui}
          locale={locale}
          language={language}
          redo={redo}
          passed={passed}
          onDone={(id) => onRedoDone?.(id)}
          onOpenScript={setOpen}
        />
      ) : null}
      {picked ? (
        <button
          type="button"
          onClick={() => setOpen(picked)}
          className="flex items-center gap-3 rounded-xl border border-status-learned/50 bg-status-learned/10 px-3 py-3 text-start hover:bg-status-learned/15"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-caption font-semibold text-status-learned">{ui.scriptTodayTitle}</span>
            <span dir="auto" className="mt-0.5 block text-note text-ink">
              {glossFor(picked.setting, locale)}
            </span>
            <span dir="auto" className="mt-0.5 block text-meta text-slate-300">
              {reason}
            </span>
          </span>
          <span aria-hidden className="text-caption text-slate-400 rtl:rotate-180">›</span>
        </button>
      ) : null}
      <div className="flex items-center gap-2">
        <h3 className="min-w-0 flex-1 text-caption font-semibold text-slate-300">{ui.stageScriptsTitle}</h3>
        <span aria-hidden className="flex gap-1">
          {situations.map((script) => (
            <span key={script.id} className={`h-2 w-2 rounded-full ${passed.includes(script.id) ? "bg-status-mastered" : "border border-line"}`} />
          ))}
        </span>
        <span className="text-caption tabular-nums text-slate-400">
          {done}/{situations.length}
        </span>
      </div>
      {situations.map(row)}
      {extras.length ? (
        <>
          <h3 className="mt-2 text-caption font-semibold text-slate-300">{ui.scriptsByExpression}</h3>
          {extras.map(row)}
        </>
      ) : null}
      <StageFrames ui={ui} locale={locale} language={language} stage={stage} passed={passed} redo={redo} openFor={frameFor} onPassed={onPassed} onOpenScript={setOpen} />
      {open ? (
        <ScriptPlayer
          ui={ui}
          locale={locale}
          language={language}
          script={shown ?? open}
          learnerName={open.name ? usableName(nickname) : null}
          passed={passed.includes(open.id)}
          onPassed={onPassed}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </section>
  );
}

function ScriptPlayer({
  ui,
  locale,
  language,
  script,
  passed,
  onPassed,
  onClose,
  learnerName = null,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  script: StageScript;
  /** 대본에 넣은 사용자 이름 — 받아쓰기가 이름을 다르게 적어도 그 낱말은 셈에서 뺀다. */
  learnerName?: string | null;
  passed: boolean;
  onPassed?: (id: string) => void;
  onClose: () => void;
}) {
  const { isPremium } = usePremium();
  const modes = modesFor(script.stage);
  const [mode, setModeState] = useState<ScriptMode>(() => readMode(script.stage));
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Record<number, Result>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  // 3~4단계 상대 줄: 판마다 고른 말(원래 줄 또는 alt).
  const [picks, setPicks] = useState<Record<number, number>>(() => freshPicks(script));
  const [listening, setListening] = useState(false);
  const [justPassed, setJustPassed] = useState(false);
  // 이어서 하기(lib/curriculum/resume.ts): 오늘 중간까지 한 것이 있으면 먼저 "이어서 하기 / 처음부터".
  const resumeId = resumeKey("script", language, script.id);
  const [offer, setOffer] = useState<ResumeState<Result> | null>(() => readResume<Result>(resumeId));
  // 오늘 대본 말하기 한도(plans.ts dailyScriptLines)에 닿으면 🎤를 닫는다.
  const [limited, setLimited] = useState(false);
  const tag = learningLanguageSpeechTag(language as LearningLanguageCode);
  const run = useRef(0);
  const sent = useRef(false);
  const bottom = useRef<HTMLDivElement>(null);

  const setMode = (next: ScriptMode) => {
    setModeState(next);
    try {
      localStorage.setItem(`${MODE_KEY}.${script.stage <= 2 ? "early" : "late"}`, next);
    } catch {
      // This session only.
    }
  };

  const textAt = (i: number) => {
    const line = script.lines[i];
    if (!line) return "";
    return line.who === "them" ? variantOf(line, picks[i] ?? 0).text : line.text;
  };

  // 상대 줄은 들려주고 다음으로, 내 줄은 멈춘다(따라 말하기면 내 줄도 먼저 들려준다).
  useEffect(() => {
    if (offer) return;
    const line = script.lines[index];
    if (!line) return;
    const token = ++run.current;
    if (line.who === "them") {
      void playTts(textAt(index), tag, scriptVoice("them", textAt(index), learnerName)).finally(() => {
        if (run.current === token) setIndex((current) => (current === index ? current + 1 : current));
      });
    } else if (mode === "shadow") {
      void playTts(line.text, tag, scriptVoice("me", line.text, learnerName));
    }
    bottom.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    // textAt은 picks로 정해진다 — picks가 바뀌는 건 처음부터 다시 할 때뿐.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, script, tag, mode, offer]);

  useEffect(() => () => stopTts(), []);

  const done = index >= script.lines.length;
  // 한 줄 지날 때마다 이 폰에 남기고, 끝까지 하면 지운다.
  useEffect(() => {
    if (offer) return;
    if (done) clearResume(resumeId);
    else saveResume<Result>(resumeId, { index, results, revealed, picks });
  }, [offer, done, resumeId, index, results, revealed, picks]);
  const resume = () => {
    if (!offer) return;
    setResults(offer.results);
    setRevealed(offer.revealed);
    if (offer.picks) setPicks(offer.picks);
    setIndex(Math.min(offer.index, script.lines.length));
    setOffer(null);
  };
  const runs: Record<number, LineRun> = Object.fromEntries(
    Object.entries(results).map(([i, result]) => [i, { clean: result.clean, mode: result.mode, revealed: Boolean(revealed[Number(i)]) }]),
  );
  const passes = done && runPasses(script, runs);
  const outcome = passes ? passOutcome(runs) : "unaided";

  useEffect(() => {
    if (!passes || sent.current) return;
    sent.current = true;
    void fetch(apiUrl("/api/curriculum/scripts"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
      body: JSON.stringify({ language, id: script.id, outcome }),
    })
      .then((response) => {
        if (!response.ok) return;
        setJustPassed(true);
        onPassed?.(script.id);
      })
      .catch(() => undefined);
  }, [passes, outcome, language, script.id, isPremium, onPassed]);

  const say = async () => {
    const line = script.lines[index];
    if (!line || listening) return;
    stopTts();
    setListening(true);
    const own = mode === "own" && !revealed[index];
    const before = index > 0 ? textAt(index - 1) : "";
    const { heard, practice, unclear } = await sayLine(line.text, {
      targetLanguage: language as LearningLanguageCode,
      nativeLanguage: locale as LearningLanguageCode,
      isPremium,
      scriptId: script.id,
      mode,
      onLimit: () => setLimited(true),
      ...(own ? { meaning: glossFor(line.gloss, locale), before } : {}),
    });
    setListening(false);
    // 원문 방식: 낱말이 다 맞거나, 받아쓰기가 같은 소리를 다른 글자로 적은 것(はじめ ↔ 初め)을 확인 한마디가 good으로 볼 때.
    // 내 말로: 뜻이 통한다고 볼 때만.
    const compared = compareToTarget(line.text, heard);
    const named = Boolean(learnerName) && line.text.includes(learnerName!);
    const exact = compared.clean || (named && cleanBesidesName(compared.outcomes, learnerName));
    const clean = Boolean(heard) && (own ? practice?.good === true : exact || practice?.good === true);
    setResults((current) => ({ ...current, [index]: { heard, practice, clean, mode: own ? "own" : mode, unclear } }));
  };

  const next = () => setIndex((current) => current + 1);
  const restart = () => {
    stopTts();
    clearResume(resumeId);
    setOffer(null);
    sent.current = false;
    setJustPassed(false);
    setResults({});
    setRevealed({});
    setPicks(freshPicks(script));
    setIndex(0);
  };
  const call = () => {
    stopTts();
    onClose();
    const setting = glossFor(script.setting, locale);
    const goal = script.goal ? glossFor(script.goal, locale) : "";
    sendAppIntent("practice", { tab: "roleplay", goal: { situation: goal ? `${setting} — ${goal}` : setting }, title: setting });
  };

  // 배운 표현을 자유 대화에서(2026-10-28 사용자 "주기적으로 자유대화에서 적용"): 그 대본의 핵심 표현으로 AI 통화. 통화 분이 없는 요금은 통화 쪽이 구독 안내를 띄운다.
  const applyCall = () => {
    stopTts();
    onClose();
    const setting = glossFor(script.setting, locale);
    sendAppIntent("practice", { tab: "roleplay", goal: { situation: setting, phrases: script.expressions.slice(0, 3) }, title: setting });
  };

  const modeLabel: Record<ScriptMode, string> = {
    shadow: ui.scriptModeShadow,
    hint: ui.scriptModeHint,
    hide: ui.scriptModeHide,
    own: ui.scriptModeOwn,
  };

  return (
    <FullScreenLayer>
      <header className="flex shrink-0 items-center gap-2 border-b border-line px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <h2 dir="auto" className="min-w-0 flex-1 truncate text-body font-semibold text-ink">
          {glossFor(script.setting, locale)}
        </h2>
        {passed ? <span className="shrink-0 text-caption text-good">✓</span> : null}
        <button type="button" onClick={onClose} aria-label={ui.billingClose} className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10">
          ✕
        </button>
      </header>
      {script.goal ? (
        <div className="flex shrink-0 items-center gap-2 border-b border-line px-4 py-2">
          <p dir="auto" className="min-w-0 flex-1 text-caption text-slate-300">
            🎯 {glossFor(script.goal, locale)}
          </p>
          <button type="button" onClick={call} className="shrink-0 rounded-full border border-line px-3 py-1 text-caption text-slate-200 hover:bg-white/10">
            📞 {ui.scriptCall}
          </button>
        </div>
      ) : null}
      <div role="group" className="flex shrink-0 gap-1.5 border-b border-line px-4 py-2">
        {modes.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={mode === id}
            onClick={() => setMode(id)}
            className={`rounded-full px-3 py-1 text-caption ${mode === id ? "bg-white/90 text-slate-900" : "border border-line text-slate-300 hover:bg-white/10"}`}
          >
            {modeLabel[id]}
          </button>
        ))}
      </div>

      {offer ? <ResumeChoice ui={ui} at={offer.index} total={script.lines.length} onResume={resume} onRestart={restart} /> : null}
      <ol className={`min-h-0 flex-1 overflow-y-auto px-3 py-3 ${offer ? "hidden" : ""}`}>
        {script.lines.slice(0, Math.min(index + 1, script.lines.length)).map((line, i) => {
          if (line.who === "them") {
            const variant = variantOf(line, picks[i] ?? 0);
            return (
              <li key={i} className="mb-2 flex justify-start">
                <div className="max-w-[85%] rounded-2xl bg-white/[0.06] px-3 py-2">
                  <div className="flex items-start gap-2">
                    <p dir="auto" className="min-w-0 flex-1 text-chat text-slate-100">
                      {variant.text}
                    </p>
                    <TTSButton text={variant.text} lang={tag} voice={scriptVoice("them", variant.text, learnerName)} className="shrink-0" />
                  </div>
                  <p dir="auto" className="mt-0.5 text-caption text-slate-500">
                    {glossFor(variant.gloss, locale)}
                  </p>
                </div>
              </li>
            );
          }
          const current = i === index;
          const result = results[i];
          const show = !current || mode === "shadow" || revealed[i] || Boolean(result);
          const ownResult = result?.mode === "own";
          return (
            <li key={i} className="mb-2 flex justify-end">
              <div className={`max-w-[88%] rounded-2xl px-3 py-2 ${current ? "border border-amber-300/40 bg-amber-300/[0.06]" : "bg-white/[0.09]"}`}>
                {/* The line to say now: its meaning framed as an instruction (scriptSayPrompt, user request 2026-10-28). */}
                {current && !result ? (
                  <p dir="auto" className="text-note text-slate-200">
                    {ui.scriptSayPrompt.split("{line}").map((part, k) =>
                      k === 0 ? (
                        part
                      ) : (
                        <span key={k}>
                          {/* bdi: an English meaning inside an Arabic prompt keeps its own direction. */}
                          <bdi dir="auto">{glossFor(line.gloss, locale)}</bdi>
                          {part}
                        </span>
                      ),
                    )}
                  </p>
                ) : (
                  <p dir="auto" className="text-caption text-slate-400">
                    {glossFor(line.gloss, locale)}
                  </p>
                )}
                {show || mode === "hint" ? (
                  <div className="mt-1 flex items-start gap-2">
                    <p dir="auto" className="min-w-0 flex-1 text-chat text-slate-100">
                      {show ? line.text : hintOf(line.text, language)}
                    </p>
                    {show ? <TTSButton text={line.text} lang={tag} voice={scriptVoice("me", line.text, learnerName)} className="shrink-0" /> : null}
                  </div>
                ) : null}
                {result ? (
                  result.clean ? (
                    <>
                    <LineGrade ui={ui} exact={compareToTarget(line.text, result.heard).clean} unclear={result.unclear ?? []} practice={result.practice} />
                    {countsForPass(script.stage, result.mode) && !revealed[i] ? null : <span className="text-caption text-slate-500">{modeLabel[result.mode]}</span>}
                    {/* 맞게 바꿔 말해 통과(낱말이 대본과 다름)·흐릿했던 낱말: 한마디(2026-10-28). */}
                    {result.practice?.note && ((result.mode !== "shadow" && !compareToTarget(line.text, result.heard).clean) || (result.unclear?.length ?? 0) > 0) ? (
                      <p className="mt-1 text-note text-slate-200">{result.practice.note}</p>
                    ) : null}
                    </>
                  ) : ownResult ? (
                    <>
                      <div className="mt-3 rounded-xl bg-white/5 p-3">
                        <p className="text-meta text-slate-500">{ui.roleplayPracticeHeard}</p>
                        <p dir="auto" className="mt-1 text-note text-amber-300">
                          {result.heard || "…"}
                        </p>
                      </div>
                      {result.practice ? <p className="mt-1.5 text-note text-slate-200">{result.practice.note}</p> : null}
                      {result.practice?.verdict === "wrong" && result.practice.better ? (
                        <p dir="auto" className="mt-1 text-chat text-emerald-200">→ {result.practice.better}</p>
                      ) : null}
                    </>
                  ) : (
                    <>
                      <Attempt outcomes={compareToTarget(line.text, result.heard).outcomes} ui={ui} />
                      {result.practice ? <p className="mt-1.5 text-note text-slate-200">{result.practice.note}</p> : null}
                      {result.practice?.verdict === "wrong" && result.practice.better ? (
                        <p dir="auto" className="mt-1 text-chat text-emerald-200">→ {result.practice.better}</p>
                      ) : null}
                    </>
                  )
                ) : null}
                {result?.clean && ownResult && result.practice ? <p className="mt-1 text-caption text-slate-400">{result.practice.note}</p> : null}
                {current && limited ? <p className="mt-2 text-caption text-warn">{ui.scriptLimit}</p> : null}
                {current && !limited ? (
                  <div className="mt-2 flex flex-wrap justify-end gap-1.5">
                    {!show ? (
                      <button type="button" onClick={() => setRevealed((r) => ({ ...r, [i]: true }))} className="rounded-full border border-line px-3 py-1.5 text-caption text-slate-300 hover:bg-white/10">
                        {ui.scriptReveal}
                      </button>
                    ) : null}
                    {result ? (
                      <>
                        {!result.clean ? (
                          <button type="button" onClick={() => void say()} disabled={listening} className="rounded-full border border-line px-3 py-1.5 text-caption text-slate-200 hover:bg-white/10 disabled:opacity-50">
                            {listening ? ui.roleplayPracticeListening : ui.roleplayPracticeRetry}
                          </button>
                        ) : null}
                        <button type="button" onClick={next} className="rounded-full bg-white/90 px-3 py-1.5 text-caption font-semibold text-slate-900">
                          {ui.scriptNext}
                        </button>
                      </>
                    ) : (
                      <button type="button" onClick={() => void say()} disabled={listening} className="rounded-full bg-white/90 px-4 py-1.5 text-caption font-semibold text-slate-900 disabled:opacity-60">
                        {listening ? ui.roleplayPracticeListening : ui.scriptSay}
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
        {done ? (
          <li className="mt-3 flex flex-col items-center gap-2">
            <p className="text-note text-slate-200">{passes || justPassed ? `✓ ${ui.scriptPassed}` : ui.scriptDone}</p>
            <SelfCheck ui={ui} language={language} id={script.id} />
            <div className="flex gap-2">
              <button type="button" onClick={restart} className="rounded-full border border-line px-4 py-1.5 text-caption text-slate-200 hover:bg-white/10">
                {ui.scriptRestart}
              </button>
              {script.goal ? (
                <button type="button" onClick={call} className="rounded-full bg-white/90 px-4 py-1.5 text-caption font-semibold text-slate-900">
                  📞 {ui.scriptCall}
                </button>
              ) : script.expressions.length ? (
                <button type="button" onClick={applyCall} className="rounded-full bg-white/90 px-4 py-1.5 text-caption font-semibold text-slate-900">
                  📞 {ui.scriptApplyCall}
                </button>
              ) : null}
            </div>
          </li>
        ) : null}
        <div ref={bottom} />
      </ol>
    </FullScreenLayer>
  );
}

/** 오늘 중간까지 한 대본·문장구조를 다시 열면: 어디까지 했는지 + 이어서 하기 / 처음부터. */
export function ResumeChoice({ ui, at, total, onResume, onRestart }: { ui: UICopy; at: number; total: number; onResume: () => void; onRestart: () => void }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-6">
      <span aria-hidden className="flex gap-1">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`h-2 w-2 rounded-full ${i < at ? "bg-status-learned" : "border border-line"}`} />
        ))}
      </span>
      <p className="text-caption tabular-nums text-slate-400">
        {Math.min(at, total)}/{total}
      </p>
      <div className="flex gap-2">
        <button type="button" onClick={onRestart} className="rounded-full border border-line px-4 py-1.5 text-caption text-slate-200 hover:bg-white/10">
          {ui.scriptRestart}
        </button>
        <button type="button" onClick={onResume} className="rounded-full bg-white/90 px-4 py-1.5 text-caption font-semibold text-slate-900">
          {ui.scriptResume}
        </button>
      </div>
    </div>
  );
}

/** 상대 줄마다 이번 판에 쓸 말(alt가 없으면 늘 원래 줄). */
function freshPicks(script: StageScript): Record<number, number> {
  const picks: Record<number, number> = {};
  script.lines.forEach((line, i) => {
    if (line.who === "them" && line.alt?.length) picks[i] = Math.floor(Math.random() * (line.alt.length + 1));
  });
  return picks;
}

/**
 * 맞힌 줄의 평가(2026-10-28 사용자 "잘 들렸어요보다 perfect 느낌으로, 아니면 이 부분 발음이 약간 어긋났다"):
 * 낱말이 대본 그대로 + 받아쓰기가 망설인 낱말이 없으면 ★ 완벽해요, 아니면 ✓ 잘 들렸어요 + 흐릿했던 낱말 칩.
 */
export function LineGrade({
  ui,
  exact,
  unclear,
  practice = null,
}: {
  ui: UICopy;
  exact: boolean;
  unclear: readonly string[];
  /** 떠올려 말한 줄의 세 갈래(natural·awkward) — 대본과 낱말이 다를 때만 의미가 있다. */
  practice?: Practice | null;
}) {
  const perfect = exact && unclear.length === 0;
  const awkward = !exact && practice?.verdict === "awkward";
  const natural = !exact && practice?.verdict === "natural";
  const label = perfect ? `★ ${ui.scriptPerfect}` : awkward ? `△ ${ui.scriptAwkward}` : natural ? `✓ ${ui.scriptNatural}` : `✓ ${ui.scriptClean}`;
  return (
    <div className="mt-1.5 flex flex-col gap-1">
      <p className={`text-caption font-semibold ${perfect ? "text-status-learned" : awkward ? "text-warn" : "text-emerald-300"}`}>{label}</p>
      {awkward && practice?.better ? (
        <p dir="auto" className="text-chat text-ink">
          {practice.better}
        </p>
      ) : null}
      {unclear.length ? (
        <p className="flex flex-wrap items-center gap-1.5 text-caption text-slate-400">
          <span>{ui.scriptUnclear}</span>
          {unclear.map((word) => (
            <span key={word} dir="auto" className="rounded-full border border-warn/50 px-2 py-0.5 text-warn">
              {word}
            </span>
          ))}
        </p>
      ) : null}
    </div>
  );
}
