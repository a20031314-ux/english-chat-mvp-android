"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { maybeShowInterstitial } from "@/lib/ads";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { Attempt } from "@/components/RoleplayReview";
import { sayLine } from "@/components/RoleplayOwnLine";
import { TTSButton } from "@/components/TTSButton";
import { usePremium } from "@/contexts/PremiumContext";
import { readCachedAccount, subscribeSession } from "@/lib/account/session";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { UICopy } from "@/lib/copy";
import type { RedoItem } from "@/lib/curriculum/frameRedo";
import {
  blankOf,
  frameById,
  frameModes,
  framesFor,
  isNameExample,
  personalizeFrame,
  scriptsWithFrame,
  type Frame,
  type FrameExample,
  type FrameMode,
} from "@/lib/curriculum/frames";
import { cleanBesidesName, glossFor, SCRIPT_VOICES, usableName, type StageScript } from "@/lib/curriculum/stageScripts";
import { learningLanguageSpeechTag, type LearningLanguageCode } from "@/lib/learningLanguages";
import { compareToTarget, type Practice } from "@/lib/roleplay/practice";
import { HearingButtons, LineGrade, PauseChips, ResumeChoice, useHearing } from "@/components/studyMap/StageScripts";
import { missedLines, noteLine } from "@/lib/curriculum/scriptMisses";
import { clearResume, readResume, resumeKey, saveResume, type ResumeState } from "@/lib/curriculum/resume";
import { SelfCheck } from "@/components/studyMap/TodayPlan";
import { playTts, stopTts } from "@/lib/ttsPlayer";

/**
 * 틀 바꿔 말하기(curriculum/frames.ts, ko·ja·es 1~3단계): 단계 대본 아래 목록 → 틀 하나를 열면 예문 넷을 차례로.
 * "따라 말하기"는 문장을 보고 듣고, "틀만"은 빈칸 틀과 넣을 말만 보고 말한다. 3단계부터 "내 말로"는 빈칸에 내 이야기를 넣는다.
 * 넷을 모두 틀만·내 말로(원문을 열지 않고) 맞히면 통과. 끝나면 그 틀이 내 줄에 든 대본으로 이어 간다(onOpenScript — StageScripts가 연다).
 *
 * 다시 연습(2026-10-28, curriculum/frameRedo.ts): 튜터가 같은 틀을 14일에 두 번 고쳤으면 대본 목록 맨 위에 카드(FrameRedoCards).
 * 열면 내가 쓴 줄 → 고친 줄 → 대본에서 그 틀이 나온 줄, 그리고 고친 줄 따라 말하기 → 틀만 둘 → 내 말로 하나. 모두 맞히면 3일 쉼.
 */

type Mode = FrameMode;
type Result = { heard: string; practice: Practice | null; clean: boolean; mode: Mode; unclear?: string[]; pauses?: [string, number][]; stuck?: boolean };
type Step = { example: FrameExample; mode: Mode };

function useNickname(): string | null {
  return useSyncExternalStore(subscribeSession, () => readCachedAccount()?.profile.nickname ?? null, () => null);
}

export function StageFrames({
  ui,
  locale,
  language,
  stage,
  passed,
  redo = [],
  openFor = null,
  onPassed,
  onOpenScript,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  stage: number;
  passed: readonly string[];
  /** 다시 권하는 틀(/api/notebook redo) — 목록에 ◐. */
  redo?: readonly RedoItem[];
  /** 밖(문법 칸)에서 고른 문장구조를 연다(at = 누른 때). */
  openFor?: { id: string; at: number } | null;
  onPassed?: (id: string) => void;
  onOpenScript: (script: StageScript) => void;
}) {
  const frames = framesFor(language, stage);
  const [open, setOpen] = useState<Frame | null>(null);
  const [handled, setHandled] = useState(0);
  if (openFor && openFor.at !== handled) {
    setHandled(openFor.at);
    const found = frames.find((frame) => frame.id === openFor.id);
    if (found) setOpen(found);
  }
  if (!frames.length) return null;
  const done = frames.filter((frame) => passed.includes(frame.id)).length;
  const again = new Set(redo.map((item) => item.frame));
  return (
    <section className="mt-3 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <h3 className="min-w-0 flex-1 text-caption font-semibold text-slate-300">{ui.framesTitle}</h3>
        <span className="text-caption tabular-nums text-slate-400">
          {done}/{frames.length}
        </span>
      </div>
      <ul className="grid grid-cols-2 gap-2">
        {frames.map((frame) => {
          const ok = passed.includes(frame.id);
          const redoing = again.has(frame.id);
          return (
            <li key={frame.id}>
              <button
                type="button"
                onClick={() => setOpen(frame)}
                className={`flex h-full w-full flex-col items-start gap-0.5 rounded-xl border px-3 py-2 text-start hover:bg-white/5 ${redoing ? "border-warn/60" : ok ? "border-status-mastered/50" : "border-line"}`}
              >
                <span dir="auto" className="text-note text-slate-100">
                  {frame.pattern}{" "}
                  {redoing ? <span className="text-caption text-warn">◐</span> : ok ? <span className="text-caption text-good">✓</span> : null}
                </span>
                <span dir="auto" className="text-meta text-slate-400">
                  {glossFor(frame.meaning, locale)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {open ? (
        <FramePlayer
          ui={ui}
          locale={locale}
          language={language}
          frame={open}
          passed={passed.includes(open.id)}
          onPassed={onPassed}
          onClose={() => setOpen(null)}
          onOpenScript={(script) => {
            setOpen(null);
            onOpenScript(script);
          }}
        />
      ) : null}
    </section>
  );
}

/** 대본 목록 맨 위: 다시 연습할 틀(두 개까지) — 내가 쓴 줄과 고친 줄, 누르면 다시 연습. */
export function FrameRedoCards({
  ui,
  locale,
  language,
  redo,
  passed,
  onDone,
  onOpenScript,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  redo: readonly RedoItem[];
  passed: readonly string[];
  onDone: (frameId: string) => void;
  onOpenScript: (script: StageScript) => void;
}) {
  const [open, setOpen] = useState<RedoItem | null>(null);
  const finished = useRef(new Set<string>());
  const close = () => {
    // 통과 화면을 본 뒤 닫을 때 목록에서 뺀다(통과하자마자 빼면 화면이 바로 닫힘).
    const id = open?.frame;
    setOpen(null);
    if (id && finished.current.has(id)) onDone(id);
  };
  const items = redo.flatMap((item) => {
    const frame = frameById(language, item.frame);
    return frame ? [{ item, frame }] : [];
  });
  if (!items.length) return null;
  const current = open ? items.find(({ item }) => item.frame === open.frame) : null;
  return (
    <div className="flex flex-col gap-2">
      {items.map(({ item, frame }) => (
        <button
          key={item.frame}
          type="button"
          onClick={() => setOpen(item)}
          className="flex flex-col gap-1 rounded-2xl border border-warn/50 bg-warn/[0.06] px-3 py-2.5 text-start hover:bg-warn/10"
        >
          <span className="flex items-center gap-2">
            <span className="text-caption font-semibold text-warn">◐ {ui.frameRedo}</span>
            <span dir="auto" className="min-w-0 flex-1 truncate text-note text-slate-100">
              {frame.pattern}
            </span>
            <span className="text-caption tabular-nums text-slate-400">×{item.count}</span>
          </span>
          <span dir="auto" className="truncate text-caption text-slate-400 line-through">
            {item.card.wrong}
          </span>
          <span dir="auto" className="truncate text-note text-emerald-200">
            {item.card.right}
          </span>
        </button>
      ))}
      {current ? (
        <FramePlayer
          ui={ui}
          locale={locale}
          language={language}
          frame={current.frame}
          passed={passed.includes(current.frame.id)}
          redo={current.item}
          onPassed={(id) => finished.current.add(id)}
          onClose={close}
          onOpenScript={(script) => {
            close();
            onOpenScript(script);
          }}
        />
      ) : null}
    </div>
  );
}

/** 다시 연습 차례: 고친 줄 따라 말하기 → 틀만 둘 → 내 말로 하나. */
function redoSteps(frame: Frame, redo: RedoItem): Step[] {
  const right: FrameExample = { text: redo.card.right, slot: "", cue: { en: "" }, gloss: { en: "" } };
  const rest = frame.examples.filter((example) => example.text !== redo.card.right);
  return [
    { example: right, mode: "shadow" },
    ...rest.slice(0, 2).map((example) => ({ example, mode: "blank" as Mode })),
    ...(rest[2] ? [{ example: rest[2], mode: "own" as Mode }] : []),
  ];
}

/** 대본에서 그 틀이 나온 내 줄 하나(틀 태그). */
function scriptLineFor(language: string, frame: Frame): string | null {
  for (const script of scriptsWithFrame(language, frame)) {
    const line = script.lines.find((one) => one.who === "me" && one.frames?.includes(frame.id));
    if (line) return line.text;
  }
  return null;
}

function FramePlayer({
  ui,
  locale,
  language,
  frame: baseFrame,
  passed,
  redo,
  onPassed,
  onClose,
  onOpenScript,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  frame: Frame;
  passed: boolean;
  redo?: RedoItem;
  onPassed?: (id: string) => void;
  onClose: () => void;
  onOpenScript: (script: StageScript) => void;
}) {
  const { isPremium } = usePremium();
  const nickname = useNickname();
  const frame = useMemo(() => personalizeFrame(baseFrame, language, nickname), [baseFrame, language, nickname]);
  const name = usableName(nickname);
  const [mode, setMode] = useState<Mode>("shadow");
  const steps: Step[] = useMemo(
    () => (redo ? redoSteps(frame, redo) : frame.examples.map((example) => ({ example, mode: "shadow" as Mode }))),
    [frame, redo],
  );
  const modeAt = (i: number): Mode => (redo ? steps[i]!.mode : mode);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Record<number, Result>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [listening, setListening] = useState(false);
  const hearing = useHearing();
  const [limited, setLimited] = useState(false);
  const [justPassed, setJustPassed] = useState(false);
  const sent = useRef(false);
  const tag = learningLanguageSpeechTag(language as LearningLanguageCode);
  const done = index >= steps.length;
  // 이어서 하기(lib/curriculum/resume.ts) — 다시 연습은 차례가 달라 따로 남긴다.
  const resumeId = resumeKey(redo ? "redo" : "frame", language, baseFrame.id);
  const [offer, setOffer] = useState<ResumeState<Result> | null>(() => readResume<Result>(resumeId));
  // 지난번에 틀린 예문(이 폰) — 다시 연습 차례는 예문 순서가 달라 표시만 안 한다.
  const [missed] = useState<Set<number>>(() => (redo ? new Set<number>() : missedLines(language, baseFrame.id)));
  useEffect(() => {
    if (offer) return;
    if (done) clearResume(resumeId);
    else saveResume<Result>(resumeId, { index, results, revealed, mode });
  }, [offer, done, resumeId, index, results, revealed, mode]);
  const resume = () => {
    if (!offer) return;
    setResults(offer.results);
    setRevealed(offer.revealed);
    if (offer.mode && !redo) setMode(offer.mode as Mode);
    setIndex(Math.min(offer.index, steps.length));
    setOffer(null);
  };
  const passes =
    done &&
    steps.every((step, i) => {
      const result = results[i];
      if (!result?.clean || revealed[i]) return false;
      return redo ? true : result.mode !== "shadow";
    });
  const scripts = done ? scriptsWithFrame(language, frame) : [];
  const fromScript = redo ? scriptLineFor(language, frame) : null;
  const currentMode = steps[index] ? modeAt(index) : mode;

  // 따라 말하기면 문장을 먼저 들려준다.
  useEffect(() => {
    if (offer) return;
    const step = steps[index];
    if (step && currentMode === "shadow") void playTts(step.example.text, tag, SCRIPT_VOICES.me);
  }, [index, currentMode, steps, tag, offer]);
  useEffect(() => () => stopTts(), []);

  useEffect(() => {
    if (!passes || sent.current) return;
    sent.current = true;
    void fetch(apiUrl("/api/curriculum/scripts"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
      body: JSON.stringify({ language, id: frame.id, ...(redo ? { redo: true } : {}) }),
    })
      .then((response) => {
        if (!response.ok) return;
        setJustPassed(true);
        onPassed?.(frame.id);
      })
      .catch(() => undefined);
  }, [passes, language, frame.id, redo, isPremium, onPassed]);

  const say = async () => {
    const step = steps[index];
    if (!step || listening) return;
    const { example } = step;
    const stepMode = modeAt(index);
    stopTts();
    setListening(true);
    const own = stepMode === "own";
    const { heard, practice, unclear, pauses } = await sayLine(example.text, {
      targetLanguage: language as LearningLanguageCode,
      nativeLanguage: locale as LearningLanguageCode,
      isPremium,
      scriptId: frame.id,
      mode: stepMode,
      ...(own ? { frame: frame.pattern, meaning: glossFor(frame.meaning, "en") } : {}),
      onLimit: () => setLimited(true),
      ...hearing.options,
    });
    setListening(false);
    // 잘 모르겠어요: 들린 데까지 짚고 예문을 연다(통과로 안 셈).
    const stuck = hearing.takeStuck();
    if (stuck) setRevealed((r) => ({ ...r, [index]: true }));
    const outcomes = compareToTarget(example.text, heard).outcomes;
    const clean =
      Boolean(heard) &&
      (own
        ? practice?.good === true
        : compareToTarget(example.text, heard).clean ||
          practice?.good === true ||
          (isNameExample(example) && cleanBesidesName(outcomes, name)));
    setResults((current) => ({ ...current, [index]: { heard, practice, clean: clean && !stuck, mode: stepMode, unclear, pauses, stuck } }));
    if ((heard || stuck) && !redo) noteLine(language, frame.id, index, !clean || stuck);
  };

  const restart = () => {
    stopTts();
    clearResume(resumeId);
    setOffer(null);
    sent.current = false;
    setJustPassed(false);
    setResults({});
    setRevealed({});
    setIndex(0);
  };

  return (
    <FullScreenLayer>
      <header className="flex shrink-0 items-start gap-2 border-b border-line px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="min-w-0 flex-1">
          <h2 dir="auto" className="text-body font-semibold text-ink">
            {redo ? <span className="text-warn">◐ </span> : null}
            {frame.pattern} {passed && !redo ? <span className="text-caption text-good">✓</span> : null}
          </h2>
          <p dir="auto" className="mt-0.5 text-caption text-slate-400">
            {glossFor(frame.meaning, locale)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            // 끝까지 한 문장구조를 닫을 때만 전면 광고(대본과 같은 순간).
            if (done) void maybeShowInterstitial("scriptEnd");
            onClose();
          }}
          aria-label={ui.billingClose}
          className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10"
        >
          ✕
        </button>
      </header>
      {redo ? (
        <div className="flex shrink-0 flex-col gap-1 border-b border-line px-4 py-2.5">
          <p dir="auto" className="text-note text-slate-400 line-through">
            {redo.card.wrong}
          </p>
          <p dir="auto" className="text-chat text-emerald-200">
            {redo.card.right}
          </p>
          {redo.card.note ? (
            <p dir="auto" className="text-caption text-slate-300">
              {redo.card.note}
            </p>
          ) : null}
          {fromScript ? (
            <p dir="auto" className="mt-1 text-caption text-slate-400">
              {ui.frameRedoScript}: <bdi dir="auto" className="text-slate-200">{fromScript}</bdi>
            </p>
          ) : null}
        </div>
      ) : (
        <div role="group" className="flex shrink-0 gap-1.5 border-b border-line px-4 py-2">
          {frameModes(frame.stage)
            .map((id) => [id, { shadow: ui.scriptModeShadow, blank: ui.frameModeBlank, own: ui.scriptModeOwn }[id]] as const)
            .map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={mode === id}
                onClick={() => setMode(id)}
                className={`rounded-full px-3 py-1 text-caption ${mode === id ? "bg-white/90 text-slate-900" : "border border-line text-slate-300 hover:bg-white/10"}`}
              >
                {label}
              </button>
            ))}
        </div>
      )}

      {offer ? <ResumeChoice ui={ui} at={offer.index} total={steps.length} onResume={resume} onRestart={restart} /> : null}
      <ol className={`min-h-0 flex-1 overflow-y-auto px-3 py-3 ${offer ? "hidden" : ""}`}>
        {steps.slice(0, Math.min(index + 1, steps.length)).map((step, i) => {
          const { example } = step;
          const current = i === index;
          const result = results[i];
          const stepMode = result?.mode ?? modeAt(i);
          const own = stepMode === "own";
          const show = !own && (!current || stepMode === "shadow" || revealed[i] || Boolean(result));
          const gloss = glossFor(example.gloss, locale);
          return (
            <li key={i} className="mb-2">
              <div className={`rounded-2xl px-3 py-2 ${current ? "border border-amber-300/40 bg-amber-300/[0.06]" : "bg-white/[0.06]"}`}>
                {own || gloss ? (
                  <p dir="auto" className={current && !result ? "text-note text-slate-200" : "text-caption text-slate-400"}>
                    {current && !result && missed.has(i) ? <span className="text-warn">◐ </span> : null}
                    {own
                      ? glossFor(frame.meaning, locale)
                      : current && !result
                        ? ui.scriptSayPrompt.split("{line}").map((part, k) =>
                            k === 0 ? (
                              part
                            ) : (
                              <span key={k}>
                                <bdi dir="auto">{gloss}</bdi>
                                {part}
                              </span>
                            ),
                          )
                        : gloss}
                  </p>
                ) : null}
                <div className="mt-1 flex items-start gap-2">
                  <p dir="auto" className="min-w-0 flex-1 text-chat text-slate-100">
                    {own ? result?.heard || frame.pattern : show ? example.text : blankOf(example)}
                  </p>
                  {show ? <TTSButton text={example.text} lang={tag} voice={SCRIPT_VOICES.me} className="shrink-0" /> : null}
                </div>
                {!show && !own ? (
                  <p dir="auto" className="mt-1 text-caption text-amber-200">
                    ＿＿＿ = {glossFor(example.cue, locale)}
                  </p>
                ) : null}
                {result ? (
                  result.clean ? (
                    <>
                      <LineGrade ui={ui} exact={!own && compareToTarget(example.text, result.heard).clean} unclear={result.unclear ?? []} practice={result.practice} pauses={result.pauses ?? []} />
                      {result.practice && (own || (stepMode !== "shadow" && !compareToTarget(example.text, result.heard).clean) || (result.unclear?.length ?? 0) > 0) ? (
                        <p className="mt-1 text-note text-slate-200">{result.practice.note}</p>
                      ) : null}
                    </>
                  ) : (
                    <>
                      {own ? null : <Attempt outcomes={compareToTarget(example.text, result.heard).outcomes} ui={ui} pauses={result.pauses} />}
                      <PauseChips ui={ui} pauses={result.pauses ?? []} />
                      {result.practice ? <p className="mt-1.5 text-note text-slate-200">{result.practice.note}</p> : null}
                      {result.practice?.verdict === "wrong" && result.practice.better ? (
                        <p dir="auto" className="mt-1 text-chat text-emerald-200">→ {result.practice.better}</p>
                      ) : null}
                    </>
                  )
                ) : null}
                {current && limited ? <p className="mt-2 text-caption text-warn">{ui.scriptLimit}</p> : null}
                {current && !limited ? (
                  <div className="mt-2 flex flex-wrap justify-end gap-1.5">
                    {!show && !own ? (
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
                        <button type="button" onClick={() => setIndex((n) => n + 1)} className="rounded-full bg-white/90 px-3 py-1.5 text-caption font-semibold text-slate-900">
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
          <li className="mt-3 flex flex-col gap-2">
            <p className="text-center text-note text-slate-200">{passes || justPassed ? `✓ ${ui.scriptPassed}` : ui.scriptDone}</p>
            <SelfCheck ui={ui} language={language} id={frame.id} />
            <div className="flex justify-center">
              <button type="button" onClick={restart} className="rounded-full border border-line px-4 py-1.5 text-caption text-slate-200 hover:bg-white/10">
                {ui.scriptRestart}
              </button>
            </div>
            {scripts.length ? (
              <>
                <h3 className="mt-2 text-caption font-semibold text-slate-300">{ui.frameScriptsTitle}</h3>
                {scripts.slice(0, 3).map((script) => (
                  <button
                    key={script.id}
                    type="button"
                    onClick={() => onOpenScript(script)}
                    className="flex items-center justify-between gap-2 rounded-xl border border-line px-3 py-2.5 text-start hover:bg-white/5"
                  >
                    <span dir="auto" className="min-w-0 flex-1 text-note text-slate-100">
                      {glossFor(script.setting, locale)}
                    </span>
                    <span aria-hidden className="text-caption text-slate-500 rtl:rotate-180">›</span>
                  </button>
                ))}
              </>
            ) : null}
          </li>
        ) : null}
      </ol>
    </FullScreenLayer>
  );
}
