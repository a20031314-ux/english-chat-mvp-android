"use client";

import { useEffect, useRef, useState } from "react";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { Attempt } from "@/components/RoleplayReview";
import { sayLine } from "@/components/RoleplayOwnLine";
import { TTSButton } from "@/components/TTSButton";
import { usePremium } from "@/contexts/PremiumContext";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { UICopy } from "@/lib/copy";
import { blankOf, frameModes, framesFor, scriptsWithFrame, type Frame, type FrameMode } from "@/lib/curriculum/frames";
import { glossFor, SCRIPT_VOICES, type StageScript } from "@/lib/curriculum/stageScripts";
import { learningLanguageSpeechTag, type LearningLanguageCode } from "@/lib/learningLanguages";
import { compareToTarget, type Practice } from "@/lib/roleplay/practice";
import { playTts, stopTts } from "@/lib/ttsPlayer";

/**
 * 틀 바꿔 말하기(curriculum/frames.ts, 2026-10-28 시범 일본어 1~2단계): 단계 대본 아래 목록 → 틀 하나를 열면 예문 넷을 차례로.
 * "따라 말하기"는 문장을 보고 듣고, "틀만"은 빈칸 틀과 넣을 말만 보고 말한다. 3단계부터 "내 말로"는 빈칸에 내 이야기를 넣는다.
 * 넷을 모두 틀만·내 말로(원문을 열지 않고) 맞히면 통과.
 * 끝나면 그 틀이 내 줄에 든 대본으로 이어 간다(onOpenScript — StageScripts가 연다).
 */

type Mode = FrameMode;
type Result = { heard: string; practice: Practice | null; clean: boolean; mode: Mode };

export function StageFrames({
  ui,
  locale,
  language,
  stage,
  passed,
  onPassed,
  onOpenScript,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  stage: number;
  passed: readonly string[];
  onPassed?: (id: string) => void;
  onOpenScript: (script: StageScript) => void;
}) {
  const frames = framesFor(language, stage);
  const [open, setOpen] = useState<Frame | null>(null);
  if (!frames.length) return null;
  const done = frames.filter((frame) => passed.includes(frame.id)).length;
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
          return (
            <li key={frame.id}>
              <button
                type="button"
                onClick={() => setOpen(frame)}
                className={`flex h-full w-full flex-col items-start gap-0.5 rounded-xl border px-3 py-2 text-start hover:bg-white/5 ${ok ? "border-status-mastered/50" : "border-line"}`}
              >
                <span dir="auto" className="text-note text-slate-100">
                  {frame.pattern} {ok ? <span className="text-caption text-good">✓</span> : null}
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

function FramePlayer({
  ui,
  locale,
  language,
  frame,
  passed,
  onPassed,
  onClose,
  onOpenScript,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  frame: Frame;
  passed: boolean;
  onPassed?: (id: string) => void;
  onClose: () => void;
  onOpenScript: (script: StageScript) => void;
}) {
  const { isPremium } = usePremium();
  const [mode, setMode] = useState<Mode>("shadow");
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Record<number, Result>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [listening, setListening] = useState(false);
  const [limited, setLimited] = useState(false);
  const [justPassed, setJustPassed] = useState(false);
  const sent = useRef(false);
  const tag = learningLanguageSpeechTag(language as LearningLanguageCode);
  const done = index >= frame.examples.length;
  const passes =
    done &&
    frame.examples.every((_, i) => {
      const result = results[i];
      return Boolean(result?.clean && result.mode !== "shadow" && !revealed[i]);
    });
  const scripts = done ? scriptsWithFrame(language, frame) : [];

  // 따라 말하기면 문장을 먼저 들려준다.
  useEffect(() => {
    const example = frame.examples[index];
    if (example && mode === "shadow") void playTts(example.text, tag, SCRIPT_VOICES.me);
  }, [index, mode, frame, tag]);
  useEffect(() => () => stopTts(), []);

  useEffect(() => {
    if (!passes || sent.current) return;
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
  }, [passes, language, frame.id, isPremium, onPassed]);

  const say = async () => {
    const example = frame.examples[index];
    if (!example || listening) return;
    stopTts();
    setListening(true);
    const own = mode === "own";
    const { heard, practice } = await sayLine(example.text, {
      targetLanguage: language as LearningLanguageCode,
      nativeLanguage: locale as LearningLanguageCode,
      isPremium,
      scriptId: frame.id,
      ...(own ? { frame: frame.pattern, meaning: glossFor(frame.meaning, "en") } : {}),
      onLimit: () => setLimited(true),
    });
    setListening(false);
    const clean = Boolean(heard) && (own ? practice?.good === true : compareToTarget(example.text, heard).clean || practice?.good === true);
    setResults((current) => ({ ...current, [index]: { heard, practice, clean, mode } }));
  };

  const restart = () => {
    stopTts();
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
            {frame.pattern} {passed ? <span className="text-caption text-good">✓</span> : null}
          </h2>
          <p dir="auto" className="mt-0.5 text-caption text-slate-400">
            {glossFor(frame.meaning, locale)}
          </p>
        </div>
        <button type="button" onClick={onClose} aria-label={ui.billingClose} className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10">
          ✕
        </button>
      </header>
      <div role="group" className="flex shrink-0 gap-1.5 border-b border-line px-4 py-2">
        {frameModes(frame.stage).map((id) => [id, { shadow: ui.scriptModeShadow, blank: ui.frameModeBlank, own: ui.scriptModeOwn }[id]] as const).map(([id, label]) => (
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

      <ol className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        {frame.examples.slice(0, Math.min(index + 1, frame.examples.length)).map((example, i) => {
          const current = i === index;
          const result = results[i];
          const own = (result?.mode ?? mode) === "own";
          const show = !own && (!current || mode === "shadow" || revealed[i] || Boolean(result));
          return (
            <li key={i} className="mb-2">
              <div className={`rounded-2xl px-3 py-2 ${current ? "border border-amber-300/40 bg-amber-300/[0.06]" : "bg-white/[0.06]"}`}>
                <p dir="auto" className={current && !result ? "text-note text-slate-200" : "text-caption text-slate-400"}>
                  {own
                    ? glossFor(frame.meaning, locale)
                    : current && !result
                    ? ui.scriptSayPrompt.split("{line}").map((part, k) =>
                        k === 0 ? (
                          part
                        ) : (
                          <span key={k}>
                            <bdi dir="auto">{glossFor(example.gloss, locale)}</bdi>
                            {part}
                          </span>
                        ),
                      )
                    : glossFor(example.gloss, locale)}
                </p>
                <div className="mt-1 flex items-start gap-2">
                  <p dir="auto" className="min-w-0 flex-1 text-chat text-slate-100">
                    {own ? (result?.heard || frame.pattern) : show ? example.text : blankOf(example)}
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
                      <p className="mt-1.5 text-caption text-emerald-300">✓ {ui.scriptClean}</p>
                      {own && result.practice ? <p className="mt-1 text-note text-slate-200">{result.practice.note}</p> : null}
                    </>
                  ) : (
                    <>
                      {own ? null : <Attempt outcomes={compareToTarget(example.text, result.heard).outcomes} ui={ui} />}
                      {result.practice ? <p className="mt-1.5 text-note text-slate-200">{result.practice.note}</p> : null}
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
          <li className="mt-3 flex flex-col gap-2">
            <p className="text-center text-note text-slate-200">{passes || justPassed ? `✓ ${ui.scriptPassed}` : ui.scriptDone}</p>
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
