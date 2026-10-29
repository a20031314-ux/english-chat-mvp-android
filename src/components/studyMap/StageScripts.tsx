"use client";

import { useShowReading, useStageReadings } from "@/lib/curriculum/useStageReadings";
import { needsLetters } from "@/lib/curriculum/letterLangs";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { markPracticed } from "@/lib/curriculum/practicedToday";
import { maybeShowInterstitial } from "@/lib/ads";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { WayPicker, type Bubble } from "@/components/studyMap/WayPicker";
import { FrameRedoCards, StageFrames } from "@/components/studyMap/StageFrames";
import type { RedoItem } from "@/lib/curriculum/frameRedo";
import { framesFor, type Frame } from "@/lib/curriculum/frames";
import { useStageGlosses } from "@/lib/curriculum/useStageGlosses";
import { Attempt } from "@/components/RoleplayReview";
import { sayLine } from "@/components/RoleplayOwnLine";
import { TTSButton } from "@/components/TTSButton";
import { usePremium } from "@/contexts/PremiumContext";
import { readCachedAccount, subscribeSession } from "@/lib/account/session";
import { apiUrl } from "@/lib/apiBase";
import type { UICopy } from "@/lib/copy";
import { entitlementHeaders } from "@/lib/billing/billingService";
import {
  cleanBesidesName,
  countsForPass,
  linesToRedo,
  scriptProgress,
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
  isTapMode,
  type StageScript,
} from "@/lib/curriculum/stageScripts";
import type { LedgerState } from "@/lib/learner/ledger";
import { learningLanguageSpeechTag, type LearningLanguageCode } from "@/lib/learningLanguages";
import { compareToTarget, type Practice } from "@/lib/roleplay/practice";
import { playTts, stopTts } from "@/lib/ttsPlayer";
import { SelfCheck } from "@/components/studyMap/TodayPlan";
import { weakKeysOfScript } from "@/lib/curriculum/quiz";
import { PASS_RULE_KEY, type PassRule, type ScriptChoices } from "@/lib/curriculum/scriptChoice";
import { ScriptTap, tapKindFor } from "@/components/studyMap/ScriptTap";
import { clearResume, readResume, resumeKey, saveResume, type ResumeState } from "@/lib/curriculum/resume";
import { missedLines, noteLine } from "@/lib/curriculum/scriptMisses";

/**
 * My 단계 보기의 "대본으로 연습" — 단계마다 상황별 대본(curriculum/stageScripts.ts), 맨 위에 둔다.
 * 상대 줄은 소리로 나오고 내 줄에서 멈춘다. 보는 방식은 단계마다(modesFor): 1~2 따라 말하기·첫 글자만·가리기, 3~5 따라 말하기·가리기·내 말로.
 * 🎤 → 원문 방식은 낱말 비교(roleplay/practice.ts) + 한 줄, "내 말로"는 뜻이 통하는지(모델). 내 줄을 모두 통과 방식으로 맞히면
 * /api/curriculum/scripts에 통과를 남기고 그 대본의 핵심 표현이 장부에 오른다(표현 갈래). 다음 단계 = 네 갈래 70% + 그 단계 상황 대본 모두 통과.
 * 상황 대본에 안 나온 핵심 표현은 짧은 표현 대본(situation 없음)으로 — 목록 아래 따로.
 * 3~4단계 상대 줄은 판마다 바뀐다(alt). 5단계는 goal과 "통화로 해 보기"(그 상황으로 AI 통화).
 */

const MODE_KEY = "stageScriptMode";

type Method = "situation" | "expression" | "frame";


/** 오늘의 대본(서버가 고름): 문법 이름은 앱 언어, 표현은 학습 언어. */
export type ScriptRecommend = {
  stage: number;
  id: string;
  why: { kind: "grammar" | "expression"; items: string[] } | { kind: "next" };
};
type Result = { heard: string; practice: Practice | null; clean: boolean; mode: ScriptMode; unclear?: string[]; pauses?: [string, number][]; stuck?: boolean };

function readMode(stage: number): ScriptMode {
  const allowed = modesFor(stage);
  try {
    const saved = localStorage.getItem(`${MODE_KEY}.${stage <= 2 ? "early" : "late"}`) as ScriptMode | null;
    // 처음엔 통과로 세는 방식(1~2단계 첫 글자만, 3단계부터 가리기) — 따라 말하기는 고를 수 있지만 기본이면
    // 줄마다 ★를 받아도 통과가 안 됨(2026-10-29 가상 사용자 셋 다 "가장 헷갈린 순간").
    return saved && allowed.includes(saved) ? saved : allowed[1]!;
  } catch {
    return allowed[1]!;
  }
}

/** 상황 = 주고받는 대화: 첫 상황의 앞 두 줄(나 줄이 하나는 들도록). */
export function situationBubbles(script: StageScript | undefined): Bubble[] {
  if (!script) return [];
  const at = Math.max(0, script.lines.findIndex((line) => line.who === "me") - 1);
  return script.lines.slice(at, at + 2).map((line) => ({ side: line.who, text: line.text }));
}

/** 표현 = 한 줄 속 그 표현: 표현이 든 내 줄과 그 앞 줄, 표현은 칠함. */
export function expressionBubbles(script: StageScript, expression = script.expressions[0]): Bubble[] {
  const lower = (text: string) => text.toLowerCase();
  const at = script.lines.findIndex((line) => line.who === "me" && (!expression || lower(line.text).includes(lower(expression))));
  const mine = script.lines[at >= 0 ? at : script.lines.findIndex((line) => line.who === "me")];
  if (!mine) return [];
  const before = script.lines[script.lines.indexOf(mine) - 1];
  const start = expression ? lower(mine.text).indexOf(lower(expression)) : -1;
  const mark = start >= 0 && expression ? mine.text.slice(start, start + expression.length) : undefined;
  return [...(before ? [{ side: before.who, text: before.text }] : []), { side: "me" as const, text: mine.text, mark }];
}

/** 문장구조 = 같은 틀에 빈칸만 바뀜: 예문 셋, 바뀐 곳은 칠함. */
export function frameBubbles(frame: Frame): Bubble[] {
  return frame.examples.slice(0, 3).map((example) => ({ side: "me" as const, text: example.text, mark: example.slot }));
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
  skipped,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  stage: number;
  /** 통과한 대본 id(/api/notebook parts[].scripts.passed). */
  passed: readonly string[];
  /** 시험으로 걸러진(열쇠가 모두 확인 중·이미 앎) 대본 id — "앎" 꼬리표, 오늘 할 것에서 빠짐(curriculum/known.ts). */
  skipped?: ReadonlySet<string>;
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
  const [method, setMethod] = useState<Method>("situation");
  if (openFor && openFor.at !== handled) {
    // 밖에서 고른 대본을 연다(렌더 중 한 번 — 같은 at은 다시 안 연다).
    setHandled(openFor.at);
    setOpen(scripts.find((script) => script.id === openFor.id) ?? null);
    // 문장구조 id면 아래 StageFrames가 연다(문법 칸 → 문장구조, 2026-10-28).
    const target = scripts.find((script) => script.id === openFor.id);
    setFrameFor(target ? null : openFor);
    // 연 것이 있는 방식 칩으로 옮겨 둔다(닫은 뒤 목록이 그 자리에).
    setMethod(!target ? "frame" : isSituationScript(target) ? "situation" : "expression");
  }
  if (!scripts.length) return null;
  const situations = scripts.filter(isSituationScript);
  const extras = scripts.filter((script) => !isSituationScript(script));
  const done = situations.filter((script) => passed.includes(script.id)).length;
  const frames = framesFor(language, stage);
  const frameDone = frames.filter((frame) => passed.includes(frame.id)).length;
  const methods = [
    { id: "situation" as const, name: ui.stageScriptsTitle, count: situations.length ? `${done}/${situations.length}` : "", bubbles: situationBubbles(situations[0]) },
    ...(extras.length ? [{ id: "expression" as const, name: ui.scriptsByExpression, count: "", bubbles: expressionBubbles(extras[0]!) }] : []),
    ...(frames.length ? [{ id: "frame" as const, name: ui.framesTitle, count: `${frameDone}/${frames.length}`, bubbles: frameBubbles(frames[0]!) }] : []),
  ].map((one, index) => ({ ...one, label: String(index + 1) }));
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
        ) : skipped?.has(script.id) ? (
          <span data-known className="shrink-0 rounded-full border border-good/50 px-2 py-0.5 text-meta text-good">
            {ui.knownTag}
          </span>
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
      {/* One button for the way to practise; its sheet shows each way as a tiny dialogue (2026-10-30, user). */}
      <WayPicker ui={ui} ways={methods} value={method} onPick={setMethod} data="script-method" />
      {method === "situation" ? situations.map(row) : null}
      {method === "expression" ? extras.map(row) : null}
      <StageFrames ui={ui} locale={locale} language={language} stage={stage} passed={passed} redo={redo} openFor={frameFor} onPassed={onPassed} onOpenScript={setOpen} listHidden={method !== "frame"} />
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
  // 줄마다 틀린 횟수(들렸는데 안 맞은 것) — 두 번이면 끝 체크에 헷갈려요로 미리(curriculum/quiz.ts weakKeysOfScript).
  const [misses, setMisses] = useState<Record<number, number>>({});
  // 3~4단계 상대 줄: 판마다 고른 말(원래 줄 또는 alt).
  const [picks, setPicks] = useState<Record<number, number>>(() => freshPicks(script));
  const [listening, setListening] = useState(false);
  const hearing = useHearing();
  const [justPassed, setJustPassed] = useState(false);
  // 끝까지 했는데 통과 못 한 줄만 다시(2026-10-29 사용자 "무슨 기준으로 완료되는지") — 그 줄들만 차례로, 상대 줄은 건너뜀.
  const [retrying, setRetrying] = useState(false);
  // 이어서 하기(lib/curriculum/resume.ts): 오늘 중간까지 한 것이 있으면 먼저 "이어서 하기 / 처음부터".
  const resumeId = resumeKey("script", language, script.id);
  const [offer, setOffer] = useState<ResumeState<Result> | null>(() => readResume<Result>(resumeId));
  // 지난번에 🎤로 틀린 줄(이 폰, curriculum/scriptMisses.ts) — 열 때 한 번 읽어 그 줄에 ◐.
  const [missed] = useState<Set<number>>(() => missedLines(language, script.id));
  // 오늘 대본 말하기 한도(plans.ts dailyScriptLines)에 닿으면 🎤를 닫는다.
  const [limited, setLimited] = useState(false);
  // 통과 기준(2026-10-29 사용자 "통과 기준도 정할 수 있도록"): 말하기만(기본) | 모든 방식(고르기·맞추기도). 이 폰에 하나.
  const [passRule, setPassRuleState] = useState<PassRule>(() => {
    try {
      return localStorage.getItem(PASS_RULE_KEY) === "any" ? "any" : "speak";
    } catch {
      return "speak";
    }
  });
  const setPassRule = (next: PassRule) => {
    setPassRuleState(next);
    try {
      localStorage.setItem(PASS_RULE_KEY, next);
    } catch {
      // This session only.
    }
  };
  // 고르기 오답(서버가 대본마다 한 번 만든 것, /api/curriculum/choices) — 고르기를 처음 고를 때 받는다. 없으면 기기 규칙.
  const [choices, setChoices] = useState<ScriptChoices | null>(null);
  const asked = useRef(false);
  // 고르기·맞추기를 다시 할 때마다 보기 차례를 바꾼다.
  const [attempts, setAttempts] = useState<Record<number, number>>({});
  const tag = learningLanguageSpeechTag(language as LearningLanguageCode);
  // 읽는 법(글자가 다른 학습 언어, curriculum/useStageReadings.ts) — 줄 아래 작게, 칩으로 켜고 끔.
  const readings = useStageReadings(language, script.stage);
  const [showReading, setShowReading] = useShowReading(language, script.stage);
  const readingOf = (text: string) => {
    const reading = showReading ? readings[text] : undefined;
    return reading && reading.replace(/\s+/g, "") !== text.replace(/\s+/g, "") ? (
      <p dir="ltr" data-reading className="mt-0.5 text-caption text-slate-400">
        {reading}
      </p>
    ) : null;
  };
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

  useEffect(() => {
    if (mode !== "choose" || asked.current) return;
    asked.current = true;
    void fetch(apiUrl(`/api/curriculum/choices?lang=${encodeURIComponent(language)}&id=${encodeURIComponent(script.id)}`))
      .then((response) => (response.ok ? response.json() : null))
      .then((body: { choices?: ScriptChoices } | null) => {
        if (body?.choices && Object.keys(body.choices).length) setChoices(body.choices);
      })
      .catch(() => undefined);
  }, [mode, language, script.id]);

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
  const passes = done && runPasses(script, runs, passRule);
  // 끝까지 해 봤으면(통과 못 해도) 오늘 할 것 ✓ — 이 폰에만(curriculum/practicedToday.ts).
  useEffect(() => {
    if (done && Object.keys(results).length) markPracticed(language, script.id);
  }, [done, results, language, script.id]);
  // 통과로 셈해지지 않은 내 줄(틀림·원문 열어 봄·따라 말하기) — 끝 화면의 "통과까지 n줄"과 "그 줄만 다시".
  const toRedo = linesToRedo(script, runs, passRule);
  // 진행(실시간): 말해 본 줄 = 무언가 들렸거나 잘 모르겠어요를 누른 줄. 학습 완료 = 내 줄을 끝까지 다 말함(통과와 따로).
  const spokenRuns: Record<number, LineRun> = Object.fromEntries(Object.entries(runs).filter(([i]) => Boolean(results[Number(i)]?.heard || results[Number(i)]?.stuck || isTapMode(results[Number(i)]?.mode as ScriptMode))));
  const progress = scriptProgress(script, spokenRuns, passRule);
  const completed = done && progress.total > 0 && progress.said === progress.total;
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
    // 고르기·맞추기를 골랐지만 이 줄은 문제를 못 만들어 🎤로 말하는 경우 — 가리기로 셈한다.
    const speakMode: ScriptMode = isTapMode(mode) ? "hide" : mode;
    const own = speakMode === "own" && !revealed[index];
    const before = index > 0 ? textAt(index - 1) : "";
    const { heard, practice, unclear, pauses } = await sayLine(line.text, {
      targetLanguage: language as LearningLanguageCode,
      nativeLanguage: locale as LearningLanguageCode,
      isPremium,
      scriptId: script.id,
      mode: speakMode,
      onLimit: () => setLimited(true),
      ...hearing.options,
      ...(own ? { meaning: glossFor(line.gloss, locale), before } : {}),
    });
    setListening(false);
    // 잘 모르겠어요: 들린 데까지 짚고 원문을 연다 — 그 줄은 이번 판 통과로 안 셈(revealed).
    const stuck = hearing.takeStuck();
    if (stuck) setRevealed((r) => ({ ...r, [index]: true }));
    // 원문 방식: 낱말이 다 맞거나, 받아쓰기가 같은 소리를 다른 글자로 적은 것(はじめ ↔ 初め)을 확인 한마디가 good으로 볼 때.
    // 내 말로: 뜻이 통한다고 볼 때만.
    const compared = compareToTarget(line.text, heard);
    const named = Boolean(learnerName) && line.text.includes(learnerName!);
    const exact = compared.clean || (named && cleanBesidesName(compared.outcomes, learnerName));
    const clean = Boolean(heard) && (own ? practice?.good === true : exact || practice?.good === true);
    setResults((current) => ({ ...current, [index]: { heard, practice, clean: clean && !stuck, mode: own ? "own" : speakMode, unclear, pauses, stuck } }));
    if ((heard && !clean) || stuck) setMisses((current) => ({ ...current, [index]: (current[index] ?? 0) + 1 }));
    // 틀린 줄을 이 폰에 남긴다(맞히면 지움) — 다음에 열면 ◐, My "지난번에 틀린 것"(curriculum/scriptMisses.ts).
    if (heard) noteLine(language, script.id, index, !clean);
  };

  const tapAnswer = (i: number, tapMode: ScriptMode, correct: boolean) => {
    stopTts();
    setResults((current) => ({ ...current, [i]: { heard: "", practice: null, clean: correct, mode: tapMode } }));
    if (!correct) setMisses((current) => ({ ...current, [i]: (current[i] ?? 0) + 1 }));
    noteLine(language, script.id, i, !correct);
    if (correct) void playTts(script.lines[i]!.text, tag, scriptVoice("me", script.lines[i]!.text, learnerName));
  };
  const tapAgain = (i: number) => {
    setResults((current) => Object.fromEntries(Object.entries(current).filter(([k]) => Number(k) !== i)) as Record<number, Result>);
    setAttempts((current) => ({ ...current, [i]: (current[i] ?? 0) + 1 }));
  };

  const next = () =>
    setIndex((current) => (retrying ? (toRedo.find((i) => i > current) ?? script.lines.length) : current + 1));
  const redoMissed = () => {
    if (!toRedo.length) return;
    stopTts();
    const drop = <T,>(rows: Record<number, T>) => Object.fromEntries(Object.entries(rows).filter(([i]) => !toRedo.includes(Number(i)))) as Record<number, T>;
    setResults(drop);
    setRevealed(drop);
    sent.current = false;
    setRetrying(true);
    // 따라 말하기로 끝냈으면 그 줄만 다시는 통과로 세는 방식으로(따라 말하기로 다시 하면 또 통과가 안 됨).
    if (!countsForPass(script.stage, mode, passRule)) setModeState(modesFor(script.stage)[1]!);
    setIndex(toRedo[0]!);
  };
  // 끝까지 한 대본을 닫을 때만 전면 광고(무료·안드로이드, lib/ads.ts가 간격·요금을 본다 — 2026-10-29 사용자 "무료 사용자 대상 광고").
  const closeScript = () => {
    if (done) void maybeShowInterstitial("scriptEnd");
    onClose();
  };
  const restart = () => {
    stopTts();
    clearResume(resumeId);
    setOffer(null);
    sent.current = false;
    setJustPassed(false);
    setRetrying(false);
    setResults({});
    setRevealed({});
    setMisses({});
    setPicks(freshPicks(script));
    setIndex(0);
  };

  const modeLabel: Record<ScriptMode, string> = {
    shadow: ui.scriptModeShadow,
    hint: ui.scriptModeHint,
    hide: ui.scriptModeHide,
    own: ui.scriptModeOwn,
    choose: ui.scriptModeChoose,
    order: ui.scriptModeOrder,
  };

  return (
    <FullScreenLayer>
      <header className="flex shrink-0 items-center gap-2 border-b border-line px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <h2 dir="auto" className="min-w-0 flex-1 truncate text-body font-semibold text-ink">
          {glossFor(script.setting, locale)}
        </h2>
        {passed ? <span className="shrink-0 text-caption text-good">✓</span> : null}
        <button type="button" onClick={closeScript} aria-label={ui.billingClose} className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10">
          ✕
        </button>
      </header>
      {script.goal ? (
        <div className="flex shrink-0 items-center gap-2 border-b border-line px-4 py-2">
          <p dir="auto" className="min-w-0 flex-1 text-caption text-slate-300">
            🎯 {glossFor(script.goal, locale)}
          </p>
        </div>
      ) : null}
      <div role="group" className="flex shrink-0 flex-wrap items-center gap-1.5 border-b border-line px-4 py-2">
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
        {needsLetters(language) ? (
          <button
            type="button"
            data-reading-toggle
            aria-pressed={showReading}
            onClick={() => setShowReading(!showReading)}
            className={`rounded-full px-3 py-1 text-caption ${showReading ? "bg-white/15 text-ink" : "border border-line text-slate-400 hover:bg-white/10"}`}
          >
            {ui.readingToggle}
          </button>
        ) : null}
        <span role="group" aria-label={ui.passRuleTitle} className="ms-auto flex items-center gap-1 text-meta text-slate-500">
          {ui.passRuleTitle}
          {(["speak", "any"] as const).map((rule) => (
            <button
              key={rule}
              type="button"
              aria-pressed={passRule === rule}
              onClick={() => setPassRule(rule)}
              className={`rounded-full px-2 py-0.5 text-meta ${passRule === rule ? "bg-white/15 text-ink" : "text-slate-400 hover:bg-white/10"}`}
            >
              {rule === "speak" ? ui.passRuleSpeak : ui.passRuleAny}
            </button>
          ))}
        </span>
      </div>
      {/* Live progress (user, 2026-10-29): per own line ● counts toward passing · ◐ said, not yet · ○ not yet; says so when this mode does not count. */}
      <div className="flex shrink-0 items-center gap-2 border-b border-line px-4 py-1.5">
        <span aria-hidden className="flex gap-1">
          {script.lines.map((line, i) => {
            if (line.who !== "me") return null;
            const one = spokenRuns[i];
            const ok = one && one.clean && !one.revealed && countsForPass(script.stage, one.mode, passRule);
            return <span key={i} className={`h-2 w-2 rounded-full ${ok ? "bg-status-mastered" : one ? "bg-warn/70" : "border border-line"}`} />;
          })}
        </span>
        <span className="text-caption tabular-nums text-slate-300">{ui.scriptPassProgress.replace("{n}", String(progress.passed)).replace("{m}", String(progress.total))}</span>
        {!countsForPass(script.stage, mode, passRule) ? <span className="text-caption text-warn">· {ui.scriptPracticeOnly}</span> : null}
        {passed || justPassed ? <span className="ms-auto text-caption font-semibold text-good">★ {ui.scriptPassed}</span> : null}
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
                  {readingOf(variant.text)}
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
          // 맞았지만 대본과 낱말이 다른 줄(바꿔 말함·어색함): 내가 한 말을 그대로 보이고 대본 줄로 덮지 않는다(2026-10-29 사용자 "내 발화도 치환시켜서 띄워").
          const heardDiffers = (() => {
            if (!result?.clean || !result.heard) return false;
            const compared = compareToTarget(line.text, result.heard);
            const named = Boolean(learnerName) && line.text.includes(learnerName!);
            return !(compared.clean || (named && cleanBesidesName(compared.outcomes, learnerName)));
          })();
          const betterShown = heardDiffers && result?.practice?.verdict === "awkward" && Boolean(result.practice.better);
          // 고르기·맞추기(마이크 없이, ScriptTap): 지금 줄은 문제, 지난 줄은 원문 + ✓/✗. 낼 수 없는 줄이면 아래 🎤 그대로.
          const wantTap = current && isTapMode(mode) ? tapKindFor(language, script, i, mode as "choose" | "order", choices) : null;
          // 다른 방식으로 이미 답한 줄이면 새 문제를 띄우지 않는다(방식을 바꿔도 그 줄의 결과 그대로).
          const tapKind = wantTap && (!result || result.mode === wantTap) ? wantTap : null;
          if (tapKind || (result && isTapMode(result.mode))) {
            const counted = result ? countsForPass(script.stage, result.mode, passRule) : false;
            return (
              <li key={i} className="mb-2 flex justify-end">
                <div className={`w-[88%] rounded-2xl px-3 py-2 ${current ? "border border-amber-300/40 bg-amber-300/[0.06]" : "bg-white/[0.09]"}`}>
                  <p dir="auto" className={current && !result ? "text-note text-slate-200" : "text-caption text-slate-400"}>
                    {missed.has(i) && current && !result ? <span className="text-warn">◐ </span> : null}
                    {glossFor(line.gloss, locale)}
                  </p>
                  {tapKind ? (
                    <ScriptTap
                      key={`${i}-${attempts[i] ?? 0}-${tapKind}`}
                      ui={ui}
                      language={language}
                      script={script}
                      index={i}
                      kind={tapKind}
                      server={choices}
                      attempt={attempts[i] ?? 0}
                      onAnswer={(correct) => tapAnswer(i, tapKind, correct)}
                    />
                  ) : (
                    <>
                      <div className="mt-1 flex items-start gap-2">
                        <p dir="auto" className="min-w-0 flex-1 text-chat text-slate-100">
                          {line.text}
                        </p>
                        <TTSButton text={line.text} lang={tag} voice={scriptVoice("me", line.text, learnerName)} className="shrink-0" />
                      </div>
                      {readingOf(line.text)}
                    </>
                  )}
                  {result ? (
                    <p className={`mt-1 text-caption ${result.clean ? "text-good" : "text-warn"}`}>
                      {result.clean ? `✓ ${ui.quizRight}` : ui.quizWrong}
                      {result.clean && !counted ? <span className="text-slate-500"> · {modeLabel[result.mode]}</span> : null}
                    </p>
                  ) : null}
                  {current && result ? (
                    <div className="mt-2 flex flex-wrap justify-end gap-1.5">
                      {!result.clean ? (
                        <button type="button" onClick={() => tapAgain(i)} className="rounded-full border border-line px-3 py-1.5 text-caption text-slate-200 hover:bg-white/10">
                          {ui.roleplayPracticeRetry}
                        </button>
                      ) : null}
                      <button type="button" onClick={next} className="rounded-full bg-white/90 px-3 py-1.5 text-caption font-semibold text-slate-900">
                        {ui.scriptNext}
                      </button>
                    </div>
                  ) : null}
                </div>
              </li>
            );
          }
          return (
            <li key={i} className="mb-2 flex justify-end">
              <div className={`max-w-[88%] rounded-2xl px-3 py-2 ${current ? "border border-amber-300/40 bg-amber-300/[0.06]" : "bg-white/[0.09]"}`}>
                {/* The line to say now: its meaning framed as an instruction (scriptSayPrompt, user request 2026-10-28). */}
                {current && !result ? (
                  <p dir="auto" className="text-note text-slate-200">
                    {missed.has(i) ? <span className="text-warn">◐ </span> : null}
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
                {heardDiffers ? (
                  <div className="mt-2 rounded-xl bg-white/5 p-2.5">
                    <p className="text-meta text-slate-500">{ui.roleplayPracticeHeard}</p>
                    <p dir="auto" className="mt-1 text-chat text-slate-100">
                      {result!.heard}
                    </p>
                  </div>
                ) : show || mode === "hint" ? (
                  <div className="mt-1 flex items-start gap-2">
                    <p dir="auto" className="min-w-0 flex-1 text-chat text-slate-100">
                      {show ? line.text : hintOf(line.text, language)}
                    </p>
                    {show ? <TTSButton text={line.text} lang={tag} voice={scriptVoice("me", line.text, learnerName)} className="shrink-0" /> : null}
                  </div>
                ) : null}
                {show && !heardDiffers ? readingOf(line.text) : null}
                {result ? (
                  result.clean ? (
                    <>
                    <LineGrade ui={ui} exact={compareToTarget(line.text, result.heard).clean} unclear={result.unclear ?? []} practice={result.practice} pauses={result.pauses ?? []} />
                    {/* 대본 줄은 내 말 아래에(어색함이면 더 자연스러운 말이 이미 위에 있음). */}
                    {heardDiffers && !betterShown ? (
                      <div className="mt-1 flex items-start gap-2">
                        <p dir="auto" className="min-w-0 flex-1 text-note text-slate-400">
                          {line.text}
                        </p>
                        <TTSButton text={line.text} lang={tag} voice={scriptVoice("me", line.text, learnerName)} className="shrink-0" />
                      </div>
                    ) : null}
                    {countsForPass(script.stage, result.mode, passRule) && !revealed[i] ? null : <span className="text-caption text-slate-500">{modeLabel[result.mode]}</span>}
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
                      <Attempt outcomes={compareToTarget(line.text, result.heard).outcomes} ui={ui} pauses={result.pauses} />
                      <PauseChips ui={ui} pauses={result.pauses ?? []} />
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
                        {!result.clean && listening ? <HearingButtons ui={ui} hearing={hearing} /> : null}
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
                      <>
                        {listening ? <HearingButtons ui={ui} hearing={hearing} /> : null}
                        <button type="button" onClick={() => void say()} disabled={listening} className="rounded-full bg-white/90 px-4 py-1.5 text-caption font-semibold text-slate-900 disabled:opacity-60">
                          {listening ? ui.roleplayPracticeListening : ui.scriptSay}
                        </button>
                      </>
                    )}
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
        {done ? (
          <li className="mt-3 flex flex-col items-center gap-2">
            {completed ? <p className="text-body font-semibold text-good">✓ {ui.scriptCompleted}</p> : <p className="text-note text-slate-200">{ui.scriptDone}</p>}
            {passes || justPassed ? <p className="text-note font-semibold text-status-learned">★ {ui.scriptPassed}</p> : null}
            {!passes && !justPassed && toRedo.length ? (
              <div className="flex items-center gap-2">
                <span className="text-caption text-warn">◐ {ui.scriptToPass.replace("{n}", String(toRedo.length))}</span>
                <button type="button" onClick={redoMissed} className="rounded-full border border-warn/60 px-3 py-1 text-caption text-warn hover:bg-white/10">
                  {ui.scriptRetryMissed}
                </button>
              </div>
            ) : null}
            <SelfCheck ui={ui} language={language} id={script.id} weak={weakKeysOfScript(script, misses)} />
            <div className="flex gap-2">
              <button type="button" onClick={restart} className="rounded-full border border-line px-4 py-1.5 text-caption text-slate-200 hover:bg-white/10">
                {ui.scriptRestart}
              </button>
              <button type="button" onClick={closeScript} className="rounded-full bg-white/90 px-4 py-1.5 text-caption font-semibold text-slate-900">
                {ui.billingClose}
              </button>
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
  pauses = [],
}: {
  ui: UICopy;
  exact: boolean;
  unclear: readonly string[];
  /** 낱말 사이 멈칫한 곳 — 있으면 ★ 완벽해요 대신 ✓ + 칩. */
  pauses?: readonly [string, number][];
  /** 떠올려 말한 줄의 세 갈래(natural·awkward) — 대본과 낱말이 다를 때만 의미가 있다. */
  practice?: Practice | null;
}) {
  const perfect = exact && unclear.length === 0 && pauses.length === 0;
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
      <PauseChips ui={ui} pauses={pauses} />
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


/**
 * 말하는 동안(2026-10-29 사용자 "망설이면 바로 끊어버리는데 잘 모르겠어요 버튼을"): 연습 마이크는 멈칫해도 끊지 않고(patient),
 * 듣는 동안 "잘 모르겠어요", 멈칫하면 "다 말했어요"도. 잘 모르겠어요 = 들린 데까지 보내고 원문을 연다(통과로는 안 셈).
 */
export function useHearing() {
  const [paused, setPaused] = useState(false);
  const end = useRef<(() => void) | null>(null);
  const stuck = useRef(false);
  return {
    /** sayLine에 그대로 펼쳐 넣는다. */
    options: {
      patient: true,
      onPaused: setPaused,
      onReady: (endNow: () => void) => {
        stuck.current = false;
        end.current = endNow;
      },
    },
    /** 듣기가 끝난 뒤: 잘 모르겠어요를 눌렀는지(한 번 읽으면 지움). */
    takeStuck: () => {
      const was = stuck.current;
      stuck.current = false;
      end.current = null;
      setPaused(false);
      return was;
    },
    paused,
    unsure: () => {
      stuck.current = true;
      end.current?.();
    },
    saidAll: () => end.current?.(),
  };
}

export function HearingButtons({ ui, hearing }: { ui: UICopy; hearing: ReturnType<typeof useHearing> }) {
  return (
    <>
      <button type="button" onClick={hearing.unsure} className="rounded-full border border-warn/60 px-3 py-1.5 text-caption text-warn hover:bg-white/10">
        {ui.scriptUnsure}
      </button>
      {hearing.paused ? (
        <button type="button" onClick={hearing.saidAll} className="rounded-full bg-white/90 px-3 py-1.5 text-caption font-semibold text-slate-900">
          {ui.scriptSaidAll}
        </button>
      ) : null}
    </>
  );
}

/** 멈칫한 곳 칩(서버 pauses — 그 뒤에 나온 낱말과 쉰 초). */
export function PauseChips({ ui, pauses }: { ui: UICopy; pauses: readonly [string, number][] }) {
  if (!pauses.length) return null;
  return (
    <p className="flex flex-wrap items-center gap-1.5 text-caption text-slate-400">
      <span>{ui.scriptPaused}</span>
      {pauses.map(([word, sec], i) => (
        <span key={`${word}-${i}`} dir="auto" className="rounded-full border border-warn/50 px-2 py-0.5 text-warn">
          ⏸ <bdi>{word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "")}</bdi> · {sec}s
        </span>
      ))}
    </p>
  );
}
