"use client";

import { useEffect, useRef, useState } from "react";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { Attempt } from "@/components/RoleplayReview";
import { sayLine } from "@/components/RoleplayOwnLine";
import { TTSButton } from "@/components/TTSButton";
import { usePremium } from "@/contexts/PremiumContext";
import { apiUrl } from "@/lib/apiBase";
import { sendAppIntent } from "@/lib/appIntents";
import type { UICopy } from "@/lib/copy";
import { entitlementHeaders } from "@/lib/billing/billingService";
import {
  countsForPass,
  glossFor,
  hintOf,
  modesFor,
  runPasses,
  scriptsFor,
  variantOf,
  type LineRun,
  type ScriptMode,
  type StageScript,
} from "@/lib/curriculum/stageScripts";
import { learningLanguageSpeechTag, type LearningLanguageCode } from "@/lib/learningLanguages";
import { compareToTarget, type Practice } from "@/lib/roleplay/practice";
import { playTts, stopTts } from "@/lib/ttsPlayer";

/**
 * My 단계 보기의 "대본으로 연습" — 단계마다 상황별 대본(curriculum/stageScripts.ts), 맨 위에 둔다.
 * 상대 줄은 소리로 나오고 내 줄에서 멈춘다. 보는 방식은 단계마다(modesFor): 1~2 따라 말하기·첫 글자만·가리기, 3~5 따라 말하기·가리기·내 말로.
 * 🎤 → 원문 방식은 낱말 비교(roleplay/practice.ts) + 한 줄, "내 말로"는 뜻이 통하는지(모델). 내 줄을 모두 통과 방식으로 맞히면
 * /api/curriculum/scripts에 통과를 남긴다 — 다음 단계 = 네 갈래 70% + 그 단계 대본 모두 통과.
 * 3~4단계 상대 줄은 판마다 바뀐다(alt). 5단계는 goal과 "통화로 해 보기"(그 상황으로 AI 통화).
 */

const MODE_KEY = "stageScriptMode";
type Result = { heard: string; practice: Practice | null; clean: boolean; mode: ScriptMode };

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
}: {
  ui: UICopy;
  locale: string;
  language: string;
  stage: number;
  /** 통과한 대본 id(/api/notebook parts[].scripts.passed). */
  passed: readonly string[];
  onPassed?: (id: string) => void;
}) {
  const scripts = scriptsFor(language, stage);
  const [open, setOpen] = useState<StageScript | null>(null);
  if (!scripts.length) return null;
  const done = scripts.filter((script) => passed.includes(script.id)).length;
  return (
    <section className="mt-3 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <h3 className="min-w-0 flex-1 text-caption font-semibold text-slate-300">{ui.stageScriptsTitle}</h3>
        <span aria-hidden className="flex gap-1">
          {scripts.map((script) => (
            <span key={script.id} className={`h-2 w-2 rounded-full ${passed.includes(script.id) ? "bg-status-mastered" : "border border-line"}`} />
          ))}
        </span>
        <span className="text-caption tabular-nums text-slate-400">
          {done}/{scripts.length}
        </span>
      </div>
      {scripts.map((script) => {
        const ok = passed.includes(script.id);
        return (
          <button
            key={script.id}
            type="button"
            onClick={() => setOpen(script)}
            className="flex items-center justify-between gap-2 rounded-xl border border-line px-3 py-2.5 text-start hover:bg-white/5"
          >
            <span dir="auto" className="min-w-0 flex-1 text-note text-slate-100">
              {glossFor(script.setting, locale)}
            </span>
            {ok ? (
              <span className="shrink-0 text-caption text-good">✓ {ui.scriptPassed}</span>
            ) : (
              <span className="shrink-0 text-meta tabular-nums text-slate-500">{script.lines.filter((line) => line.who === "me").length} 🎤</span>
            )}
            <span aria-hidden className="text-caption text-slate-500 rtl:rotate-180">›</span>
          </button>
        );
      })}
      {open ? (
        <ScriptPlayer
          ui={ui}
          locale={locale}
          language={language}
          script={open}
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
}: {
  ui: UICopy;
  locale: string;
  language: string;
  script: StageScript;
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
    const line = script.lines[index];
    if (!line) return;
    const token = ++run.current;
    if (line.who === "them") {
      void playTts(textAt(index), tag).finally(() => {
        if (run.current === token) setIndex((current) => (current === index ? current + 1 : current));
      });
    } else if (mode === "shadow") {
      void playTts(line.text, tag);
    }
    bottom.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    // textAt은 picks로 정해진다 — picks가 바뀌는 건 처음부터 다시 할 때뿐.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, script, tag, mode]);

  useEffect(() => () => stopTts(), []);

  const done = index >= script.lines.length;
  const runs: Record<number, LineRun> = Object.fromEntries(
    Object.entries(results).map(([i, result]) => [i, { clean: result.clean, mode: result.mode, revealed: Boolean(revealed[Number(i)]) }]),
  );
  const passes = done && runPasses(script, runs);

  useEffect(() => {
    if (!passes || sent.current) return;
    sent.current = true;
    void fetch(apiUrl("/api/curriculum/scripts"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
      body: JSON.stringify({ language, id: script.id }),
    })
      .then((response) => {
        if (!response.ok) return;
        setJustPassed(true);
        onPassed?.(script.id);
      })
      .catch(() => undefined);
  }, [passes, language, script.id, isPremium, onPassed]);

  const say = async () => {
    const line = script.lines[index];
    if (!line || listening) return;
    stopTts();
    setListening(true);
    const own = mode === "own" && !revealed[index];
    const before = index > 0 ? textAt(index - 1) : "";
    const { heard, practice } = await sayLine(line.text, {
      targetLanguage: language as LearningLanguageCode,
      nativeLanguage: locale as LearningLanguageCode,
      isPremium,
      ...(own ? { meaning: glossFor(line.gloss, locale), before } : {}),
    });
    setListening(false);
    // 원문 방식: 낱말이 다 맞거나, 받아쓰기가 같은 소리를 다른 글자로 적은 것(はじめ ↔ 初め)을 확인 한마디가 good으로 볼 때.
    // 내 말로: 뜻이 통한다고 볼 때만.
    const clean = Boolean(heard) && (own ? practice?.good === true : compareToTarget(line.text, heard).clean || practice?.good === true);
    setResults((current) => ({ ...current, [index]: { heard, practice, clean, mode: own ? "own" : mode } }));
  };

  const next = () => setIndex((current) => current + 1);
  const restart = () => {
    stopTts();
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

      <ol className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
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
                    <TTSButton text={variant.text} lang={tag} className="shrink-0" />
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
                <p dir="auto" className="text-caption text-slate-400">
                  {glossFor(line.gloss, locale)}
                </p>
                <div className="mt-1 flex items-start gap-2">
                  <p dir="auto" className="min-w-0 flex-1 text-chat text-slate-100">
                    {show ? line.text : mode === "hint" ? hintOf(line.text, language) : "· · ·"}
                  </p>
                  {show ? <TTSButton text={line.text} lang={tag} className="shrink-0" /> : null}
                </div>
                {result ? (
                  result.clean ? (
                    <p className="mt-1.5 text-caption text-emerald-300">
                      ✓ {ui.scriptClean}
                      {countsForPass(script.stage, result.mode) && !revealed[i] ? null : <span className="text-slate-500"> · {modeLabel[result.mode]}</span>}
                    </p>
                  ) : ownResult ? (
                    <>
                      <div className="mt-3 rounded-xl bg-white/5 p-3">
                        <p className="text-meta text-slate-500">{ui.roleplayPracticeHeard}</p>
                        <p dir="auto" className="mt-1 text-note text-amber-300">
                          {result.heard || "…"}
                        </p>
                      </div>
                      {result.practice ? <p className="mt-1.5 text-note text-slate-200">{result.practice.note}</p> : null}
                    </>
                  ) : (
                    <>
                      <Attempt outcomes={compareToTarget(line.text, result.heard).outcomes} ui={ui} />
                      {result.practice ? <p className="mt-1.5 text-note text-slate-200">{result.practice.note}</p> : null}
                    </>
                  )
                ) : null}
                {result?.clean && ownResult && result.practice ? <p className="mt-1 text-caption text-slate-400">{result.practice.note}</p> : null}
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
            <p className="text-note text-slate-200">{passes || justPassed ? `✓ ${ui.scriptPassed}` : ui.scriptDone}</p>
            <div className="flex gap-2">
              <button type="button" onClick={restart} className="rounded-full border border-line px-4 py-1.5 text-caption text-slate-200 hover:bg-white/10">
                {ui.scriptRestart}
              </button>
              {script.goal ? (
                <button type="button" onClick={call} className="rounded-full bg-white/90 px-4 py-1.5 text-caption font-semibold text-slate-900">
                  📞 {ui.scriptCall}
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

/** 상대 줄마다 이번 판에 쓸 말(alt가 없으면 늘 원래 줄). */
function freshPicks(script: StageScript): Record<number, number> {
  const picks: Record<number, number> = {};
  script.lines.forEach((line, i) => {
    if (line.who === "them" && line.alt?.length) picks[i] = Math.floor(Math.random() * (line.alt.length + 1));
  });
  return picks;
}
