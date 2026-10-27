"use client";

import { useEffect, useRef, useState } from "react";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { Attempt } from "@/components/RoleplayReview";
import { sayLine } from "@/components/RoleplayOwnLine";
import { TTSButton } from "@/components/TTSButton";
import { usePremium } from "@/contexts/PremiumContext";
import type { UICopy } from "@/lib/copy";
import { glossFor, hintOf, scriptsFor, type StageScript } from "@/lib/curriculum/stageScripts";
import { learningLanguageSpeechTag, type LearningLanguageCode } from "@/lib/learningLanguages";
import { compareToTarget, type Practice } from "@/lib/roleplay/practice";
import { playTts, stopTts } from "@/lib/ttsPlayer";

/**
 * My 단계 보기의 "대본으로 연습"(2026-10-27 사용자 "A에서 가리거나 멈추고 따라 말해보기 > 확인", 시범 ko·ja·es 1~2단계).
 * 상대 줄은 소리로 나오고, 내 줄에서 멈춘다 — 보는 방식은 따라 말하기(원문 + 소리 먼저)·첫 글자만·가리기(뜻만).
 * 🎤로 말하면 통화 "다시 말해보기"와 같은 비교(roleplay/practice.ts — 낱말마다 맞음·다름, 발음 점수 아님)와 한 줄 설명.
 * 모델은 확인 한마디(/api/roleplay/practice)와 받아쓰기만 — 대본·소리는 미리 있거나 공유 캐시.
 */

type Mode = "shadow" | "hint" | "hide";
const MODE_KEY = "stageScriptMode";
type Result = { heard: string; practice: Practice | null; clean: boolean };

function readMode(): Mode {
  try {
    const saved = localStorage.getItem(MODE_KEY);
    return saved === "hint" || saved === "hide" ? saved : "shadow";
  } catch {
    return "shadow";
  }
}

export function StageScripts({ ui, locale, language, stage }: { ui: UICopy; locale: string; language: string; stage: number }) {
  const scripts = scriptsFor(language, stage);
  const [open, setOpen] = useState<StageScript | null>(null);
  if (!scripts.length) return null;
  return (
    <section className="mt-3 flex flex-col gap-2">
      <h3 className="text-caption font-semibold text-slate-400">{ui.stageScriptsTitle}</h3>
      {scripts.map((script) => (
        <button
          key={script.id}
          type="button"
          onClick={() => setOpen(script)}
          className="flex items-center justify-between gap-2 rounded-xl border border-line px-3 py-2.5 text-start hover:bg-white/5"
        >
          <span className="min-w-0 flex-1 text-note text-slate-100">{glossFor(script.setting, locale)}</span>
          <span className="shrink-0 text-meta tabular-nums text-slate-500">{script.lines.filter((line) => line.who === "me").length} 🎤</span>
          <span aria-hidden className="text-caption text-slate-500 rtl:rotate-180">›</span>
        </button>
      ))}
      {open ? <ScriptPlayer ui={ui} locale={locale} language={language} script={open} onClose={() => setOpen(null)} /> : null}
    </section>
  );
}

function ScriptPlayer({ ui, locale, language, script, onClose }: { ui: UICopy; locale: string; language: string; script: StageScript; onClose: () => void }) {
  const { isPremium } = usePremium();
  const [mode, setModeState] = useState<Mode>(readMode);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Record<number, Result>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [listening, setListening] = useState(false);
  const tag = learningLanguageSpeechTag(language as LearningLanguageCode);
  const run = useRef(0);
  const bottom = useRef<HTMLDivElement>(null);

  const setMode = (next: Mode) => {
    setModeState(next);
    try {
      localStorage.setItem(MODE_KEY, next);
    } catch {
      // This session only.
    }
  };

  // 상대 줄은 들려주고 다음으로, 내 줄은 멈춘다(따라 말하기면 내 줄도 먼저 들려준다).
  useEffect(() => {
    const line = script.lines[index];
    if (!line) return;
    const token = ++run.current;
    if (line.who === "them") {
      void playTts(line.text, tag).finally(() => {
        if (run.current === token) setIndex((current) => (current === index ? current + 1 : current));
      });
    } else if (mode === "shadow") {
      void playTts(line.text, tag);
    }
    bottom.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [index, script, tag, mode]);

  useEffect(() => () => stopTts(), []);

  const say = async () => {
    const line = script.lines[index];
    if (!line || listening) return;
    stopTts();
    setListening(true);
    const { heard, practice } = await sayLine(line.text, {
      targetLanguage: language as LearningLanguageCode,
      nativeLanguage: locale as LearningLanguageCode,
      isPremium,
    });
    setListening(false);
    // 받아쓰기가 같은 소리를 다른 글자로 적은 것(はじめ ↔ 初め)은 확인 한마디가 good으로 본다 — 그때도 통과.
    const clean = Boolean(heard) && (compareToTarget(line.text, heard).clean || practice?.good === true);
    setResults((current) => ({ ...current, [index]: { heard, practice, clean } }));
  };

  const next = () => setIndex((current) => current + 1);
  const restart = () => {
    stopTts();
    setResults({});
    setRevealed({});
    setIndex(0);
  };

  const done = index >= script.lines.length;

  return (
    <FullScreenLayer>
      <header className="flex shrink-0 items-center gap-2 border-b border-line px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <h2 className="min-w-0 flex-1 truncate text-body font-semibold text-ink">{glossFor(script.setting, locale)}</h2>
        <button type="button" onClick={onClose} aria-label={ui.billingClose} className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10">
          ✕
        </button>
      </header>
      <div role="group" className="flex shrink-0 gap-1.5 border-b border-line px-4 py-2">
        {(
          [
            ["shadow", ui.scriptModeShadow],
            ["hint", ui.scriptModeHint],
            ["hide", ui.scriptModeHide],
          ] as const
        ).map(([id, label]) => (
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
        {script.lines.slice(0, Math.min(index + 1, script.lines.length)).map((line, i) => {
          const gloss = glossFor(line.gloss, locale);
          if (line.who === "them") {
            return (
              <li key={i} className="mb-2 flex justify-start">
                <div className="max-w-[85%] rounded-2xl bg-white/[0.06] px-3 py-2">
                  <div className="flex items-start gap-2">
                    <p dir="auto" className="min-w-0 flex-1 text-chat text-slate-100">{line.text}</p>
                    <TTSButton text={line.text} lang={tag} className="shrink-0" />
                  </div>
                  <p className="mt-0.5 text-caption text-slate-500">{gloss}</p>
                </div>
              </li>
            );
          }
          const current = i === index;
          const result = results[i];
          const show = !current || mode === "shadow" || revealed[i] || Boolean(result);
          return (
            <li key={i} className="mb-2 flex justify-end">
              <div className={`max-w-[88%] rounded-2xl px-3 py-2 ${current ? "border border-amber-300/40 bg-amber-300/[0.06]" : "bg-white/[0.09]"}`}>
                <p className="text-caption text-slate-400">{gloss}</p>
                <div className="mt-1 flex items-start gap-2">
                  <p dir="auto" className="min-w-0 flex-1 text-chat text-slate-100">
                    {show ? line.text : mode === "hint" ? hintOf(line.text, language) : "· · ·"}
                  </p>
                  {show ? <TTSButton text={line.text} lang={tag} className="shrink-0" /> : null}
                </div>
                {result ? (
                  result.clean ? (
                    <p className="mt-1.5 text-caption text-emerald-300">✓ {ui.scriptClean}</p>
                  ) : (
                    <>
                      <Attempt outcomes={compareToTarget(line.text, result.heard).outcomes} ui={ui} />
                      {result.practice ? <p className="mt-1.5 text-note text-slate-200">{result.practice.note}</p> : null}
                    </>
                  )
                ) : null}
                {current ? (
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
            <p className="text-note text-slate-200">{ui.scriptDone}</p>
            <button type="button" onClick={restart} className="rounded-full border border-line px-4 py-1.5 text-caption text-slate-200 hover:bg-white/10">
              {ui.scriptRestart}
            </button>
          </li>
        ) : null}
        <div ref={bottom} />
      </ol>
    </FullScreenLayer>
  );
}
