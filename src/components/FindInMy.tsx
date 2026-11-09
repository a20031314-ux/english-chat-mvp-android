"use client";

import { openLesson } from "@/lib/appIntents";
import { expressionKeyOf, grammarKeyOfNode, type LessonScene } from "@/lib/curriculum/lessonKey";
import { useState } from "react";
import type { UICopy } from "@/lib/copy";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import { ledgerPlace } from "@/lib/learner/comprehensionClient";
import { DictionarySheet } from "@/components/studyMap/Dictionary";

/**
 * "🔎 My에서 찾기"(문장분석 시트·통화 정리): 서버가 그 말의 문법 칸을 고르면 그 소재 수업(openLesson), 표현이면 그 표현 수업,
 * 둘 다 아니면 사전 시트(그 낱말). 통화 정리에서 열면 그 문장을 들고 간다(lessonScene).
 */
export function FindInMy({
  ui,
  text,
  sentence,
  language,
  locale,
  onDone,
  lessonScene,
}: {
  ui: UICopy;
  text: string;
  sentence: string;
  language: string;
  locale: string;
  onDone: () => void;
  /** 통화 정리에서: 그 문장을 들고 수업으로(수업 맨 위 카드·시험 재료). */
  lessonScene?: LessonScene;
}) {
  const [state, setState] = useState<"idle" | "busy" | "failed">("idle");
  // 문법·표현 열쇠가 없는 말은 사전 시트(그 낱말)로.
  const [word, setWord] = useState<string | null>(null);
  const find = async () => {
    setState("busy");
    try {
      const response = await fetch(apiUrl("/api/notebook"), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...entitlementHeaders() },
        body: JSON.stringify({ language, locate: { text, sentence, ui: locale, tab: ledgerPlace().tab } }),
      });
      const found = (await response.json().catch(() => null)) as { node?: string | null } | null;
      if (!response.ok || !found) return setState("failed");
      const lessonKey = grammarKeyOfNode(language, found.node) ?? expressionKeyOf(language, text);
      setState("idle");
      if (!lessonKey) return setWord(text);
      openLesson({ language, key: lessonKey, above: true, ...(lessonScene ? { scene: lessonScene } : {}) });
      onDone();
    } catch {
      setState("failed");
    }
  };
  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => void find()}
        disabled={state === "busy"}
        className="w-full rounded-xl border border-line px-3 py-2 text-note text-slate-100 hover:bg-white/5 disabled:opacity-60"
      >
        🔎 {state === "busy" ? ui.findInMyBusy : ui.findInMy}
      </button>
      {state === "failed" ? <p className="mt-1 text-caption text-bad">{ui.markFailed}</p> : null}
      {word ? <DictionarySheet ui={ui} language={language} locale={locale} word={word} above onClose={() => setWord(null)} /> : null}
    </div>
  );
}
