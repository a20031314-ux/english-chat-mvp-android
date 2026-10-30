"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { maybeShowInterstitial } from "@/lib/ads";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { sayLine } from "@/components/RoleplayOwnLine";
import { TTSButton } from "@/components/TTSButton";
import { usePremium } from "@/contexts/PremiumContext";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { UICopy } from "@/lib/copy";
import { frameById } from "@/lib/curriculum/frames";
import type { KnownMap } from "@/lib/curriculum/known";
import { recallBundle, recallFromScripts, recallKey, recallSets, type RecallPrompt } from "@/lib/curriculum/recall";
import { SCRIPT_VOICES } from "@/lib/curriculum/stageScripts";
import { RECALL_ITEM } from "@/lib/curriculum/dailyPlan";
import { markPracticed } from "@/lib/curriculum/practicedToday";
import { announceKnown } from "@/lib/curriculum/useCheckups";
import { learningLanguageSpeechTag, type LearningLanguageCode } from "@/lib/learningLanguages";
import type { Practice } from "@/lib/roleplay/practice";
import { stopTts } from "@/lib/ttsPlayer";
import { HearingButtons, LineGrade, useHearing } from "@/components/studyMap/StageScripts";

/**
 * 꺼내 쓰기(curriculum/recall.ts, 2026-10-30 사용자 "'~라고 말해 보세요' 식으로 숙지한 부분을 활용"): 익힌 문장구조로
 * 앱 언어 뜻을 보고 학습 언어로 말한다. 묶음 다섯 문제 — 문제는 서버가 틀마다 한 번 만든 것(/api/curriculum/recall), 못 받으면 대본 줄.
 * 판단은 대본 "내 말로"와 같다(뜻이 통하면 통과, roleplay/practice meaning). 끝나면 맞힌 틀 r| 열쇠를 서버에(/api/curriculum/scripts check).
 */

type Result = { heard: string; practice: Practice | null; good: boolean };

export function RecallPlayer({
  ui,
  locale,
  language,
  learned,
  known,
  onClose,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  /** 익힌 문장구조 id(오래된 것부터). */
  learned: readonly string[];
  known: KnownMap;
  onClose: () => void;
}) {
  const { isPremium } = usePremium();
  const tag = learningLanguageSpeechTag(language as LearningLanguageCode);
  // 묶음은 연 때 한 번 정한다(풀면서 known이 바뀌어도 그대로).
  const [sets] = useState(() => recallSets(learned, known));
  const [prompts, setPrompts] = useState<Record<string, RecallPrompt[]> | null>(null);
  useEffect(() => {
    let alive = true;
    const local = Object.fromEntries(
      sets.map((set) => {
        const frame = set.includes("+") ? null : frameById(language, set);
        return [set, frame ? recallFromScripts(language, frame, locale) : []];
      }),
    );
    void fetch(apiUrl(`/api/curriculum/recall?lang=${encodeURIComponent(language)}&ui=${encodeURIComponent(locale)}&sets=${encodeURIComponent(sets.join(","))}`), {
      headers: entitlementHeaders(isPremium),
    })
      .then((response) => (response.ok ? response.json() : null))
      .catch(() => null)
      .then((body: { prompts?: Record<string, RecallPrompt[]> } | null) => {
        if (!alive) return;
        const merged: Record<string, RecallPrompt[]> = {};
        for (const set of sets) merged[set] = [...(body?.prompts?.[set] ?? []), ...(local[set] ?? [])];
        setPrompts(merged);
      });
    return () => {
      alive = false;
    };
  }, [sets, language, locale, isPremium]);
  const [seed] = useState(() => Date.now() % 7);
  const items = useMemo(() => (prompts ? recallBundle(sets, prompts, undefined, seed) : []), [prompts, sets, seed]);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Record<number, Result>>({});
  const [listening, setListening] = useState(false);
  const [limited, setLimited] = useState(false);
  const hearing = useHearing();
  const done = prompts !== null && index >= items.length;
  const sent = useRef(false);
  useEffect(() => () => stopTts(), []);

  // 끝나면 틀마다 한 번: 맞힌 문제가 있으면 맞힘, 하나짜리 문제를 틀리기만 했으면 틀림(두 틀 섞은 문제는 틀려도 지우지 않음).
  useEffect(() => {
    if (!done || sent.current || !items.length) return;
    sent.current = true;
    markPracticed(language, RECALL_ITEM);
    const check: Record<string, boolean> = {};
    items.forEach((item, i) => {
      const result = results[i];
      if (!result) return;
      for (const id of item.frames) {
        const key = recallKey(id);
        if (result.good) check[key] = true;
        else if (item.frames.length === 1 && check[key] === undefined) check[key] = false;
      }
    });
    if (!Object.keys(check).length) return;
    void fetch(apiUrl("/api/curriculum/scripts"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
      body: JSON.stringify({ language, check, quiz: true }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: { known?: unknown } | null) => {
        if (body?.known) announceKnown(language, body.known);
      })
      .catch(() => undefined);
  }, [done, items, results, language, isPremium]);

  const say = async () => {
    const item = items[index];
    if (!item || listening) return;
    stopTts();
    setListening(true);
    const { heard, practice } = await sayLine(item.text, {
      targetLanguage: language as LearningLanguageCode,
      nativeLanguage: locale as LearningLanguageCode,
      isPremium,
      scriptId: item.frames[0],
      mode: "recall",
      meaning: item.gloss,
      onLimit: () => setLimited(true),
      ...hearing.options,
    });
    setListening(false);
    const stuck = hearing.takeStuck();
    setResults((current) => ({ ...current, [index]: { heard, practice, good: Boolean(heard) && practice?.good === true && !stuck } }));
  };

  const right = Object.values(results).filter((result) => result.good).length;
  return (
    <FullScreenLayer>
      <header className="flex shrink-0 items-center gap-2 border-b border-line px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <h2 className="min-w-0 flex-1 truncate text-body font-semibold text-ink">{ui.recallTitle}</h2>
        <span className="text-caption tabular-nums text-slate-400">
          {Math.min(index + 1, Math.max(items.length, 1))}/{items.length || "…"}
        </span>
        <button
          type="button"
          onClick={() => {
            if (done) void maybeShowInterstitial("scriptEnd");
            onClose();
          }}
          aria-label={ui.billingClose}
          className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10"
        >
          ✕
        </button>
      </header>
      <ol data-recall className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        {prompts === null ? <li className="py-6 text-center text-caption text-slate-400">…</li> : null}
        {items.slice(0, Math.min(index + 1, items.length)).map((item, i) => {
          const current = i === index;
          const result = results[i];
          const patterns = item.frames.map((id) => frameById(language, id)?.pattern).filter(Boolean);
          return (
            <li key={i} className="mb-2">
              <div className={`rounded-2xl px-3 py-2 ${current ? "border border-amber-300/40 bg-amber-300/[0.06]" : "bg-white/[0.06]"}`}>
                <p dir="auto" className={current && !result ? "text-note text-slate-200" : "text-caption text-slate-400"}>
                  {ui.scriptSayPrompt.split("{line}").map((part, k) =>
                    k === 0 ? (
                      part
                    ) : (
                      <span key={k}>
                        <bdi dir="auto">{item.gloss}</bdi>
                        {part}
                      </span>
                    ),
                  )}
                </p>
                <p dir="auto" className="mt-1 text-meta text-slate-500">
                  {patterns.join(" · ")}
                </p>
                {result ? (
                  <>
                    <div className="mt-1 flex items-start gap-2">
                      <p dir="auto" className="min-w-0 flex-1 text-chat text-slate-100">
                        {result.heard || "—"}
                      </p>
                    </div>
                    {result.good ? <LineGrade ui={ui} exact={false} unclear={[]} practice={result.practice} /> : null}
                    {result.practice?.note ? <p className="mt-1 text-note text-slate-200">{result.practice.note}</p> : null}
                    <div className="mt-1 flex items-start gap-2">
                      <p dir="auto" className="min-w-0 flex-1 text-chat text-emerald-200">→ {result.good ? item.text : result.practice?.better || item.text}</p>
                      <TTSButton text={result.good ? item.text : result.practice?.better || item.text} lang={tag} voice={SCRIPT_VOICES.me} className="shrink-0" />
                    </div>
                  </>
                ) : null}
                {current && limited ? <p className="mt-2 text-caption text-warn">{ui.scriptLimit}</p> : null}
                {current && !limited ? (
                  <div className="mt-2 flex flex-wrap justify-end gap-1.5">
                    {listening ? <HearingButtons ui={ui} hearing={hearing} /> : null}
                    {result && !result.good ? (
                      <button type="button" onClick={() => void say()} disabled={listening} className="rounded-full border border-line px-3 py-1.5 text-caption text-slate-200 hover:bg-white/10 disabled:opacity-50">
                        {listening ? ui.roleplayPracticeListening : ui.roleplayPracticeRetry}
                      </button>
                    ) : null}
                    {result ? (
                      <button type="button" data-recall-next onClick={() => setIndex((n) => n + 1)} className="rounded-full bg-white/90 px-3 py-1.5 text-caption font-semibold text-slate-900">
                        {ui.scriptNext}
                      </button>
                    ) : (
                      <button type="button" data-recall-say onClick={() => void say()} disabled={listening} className="rounded-full bg-white/90 px-4 py-1.5 text-caption font-semibold text-slate-900 disabled:opacity-60">
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
          <li data-recall-done className="mt-3 flex flex-col items-center gap-2">
            <p className="text-note text-slate-200">
              {items.length ? `${right}/${items.length}` : ui.recallNone}
            </p>
            <button type="button" onClick={onClose} className="rounded-full border border-line px-4 py-1.5 text-caption text-slate-200 hover:bg-white/10">
              {ui.billingClose}
            </button>
          </li>
        ) : null}
      </ol>
    </FullScreenLayer>
  );
}
