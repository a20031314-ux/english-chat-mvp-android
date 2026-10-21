"use client";

import { useState } from "react";
import type { UICopy } from "@/lib/copy";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import { sendAppIntent } from "@/lib/appIntents";
import { isLedgerText } from "@/lib/learner/ledger";
import { ledgerPlace } from "@/lib/learner/comprehensionClient";
import { refreshLedger } from "@/lib/learner/ledgerClient";

/**
 * The learner's own say about the words in the sentence sheet
 * (hub/drafts/learner-led-map.md, sentence by sentence):
 *
 *   I know this / I don't know this — kept in their ledger as a mark, never
 *   taken as mastery, which only producing a phrase earns;
 *   Put it on my map — written as one task on the topic it fits, practised
 *   first and marked as their pick, with what they asked about it if they did.
 *
 * Nothing is sent until a button is pressed.
 */
type Mark = "known" | "unknown";

export function MarkForMap({
  ui,
  text,
  sentence,
  language,
  asked,
}: {
  ui: UICopy;
  text: string;
  sentence: string;
  language: string;
  asked?: { question: string; answer: string };
}) {
  const [mark, setMark] = useState<Mark | null>(null);
  const [state, setState] = useState<
    { at: "idle" } | { at: "adding" } | { at: "added"; topic: string } | { at: "noMap" } | { at: "failed" }
  >({ at: "idle" });
  const markable = isLedgerText(text, language);

  const sendMark = (next: Mark) => {
    setMark(next);
    void fetch(apiUrl("/api/learner/ledger"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...entitlementHeaders() },
      body: JSON.stringify({ language, marks: [{ text, mark: next, tab: ledgerPlace().tab }] }),
    })
      .then(() => refreshLedger(language, true))
      .catch(() => undefined);
  };

  const addToMap = async () => {
    setState({ at: "adding" });
    try {
      const response = await fetch(apiUrl("/api/curriculum/pick"), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...entitlementHeaders() },
        body: JSON.stringify({ language, text, sentence, tab: ledgerPlace().tab, ...(asked ? { asked } : {}) }),
      });
      const data = (await response.json().catch(() => ({}))) as { topicTitle?: string; error?: string };
      if (response.status === 409 && data.error === "NO_MAP") return setState({ at: "noMap" });
      if (!response.ok) return setState({ at: "failed" });
      setState({ at: "added", topic: data.topicTitle ?? "" });
      void refreshLedger(language, true);
    } catch {
      setState({ at: "failed" });
    }
  };

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-[13px] ${
      active ? "border-white/50 bg-white/20 text-white" : "border-white/15 bg-white/5 text-slate-200 hover:bg-white/10"
    }`;

  return (
    <section className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex flex-wrap gap-1.5">
        {markable ? (
          <>
            <button type="button" aria-pressed={mark === "known"} onClick={() => sendMark("known")} className={chip(mark === "known")}>
              {ui.markKnown}
            </button>
            <button type="button" aria-pressed={mark === "unknown"} onClick={() => sendMark("unknown")} className={chip(mark === "unknown")}>
              {ui.markUnknown}
            </button>
          </>
        ) : null}
        <button
          type="button"
          onClick={() => void addToMap()}
          disabled={state.at === "adding" || state.at === "added"}
          className="rounded-full border border-violet-300/40 bg-violet-400/15 px-3 py-1.5 text-[13px] text-violet-100 hover:bg-violet-400/25 disabled:opacity-60"
        >
          {state.at === "adding" ? ui.markAdding : ui.markToMap}
        </button>
      </div>
      {state.at === "added" ? (
        <p className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-violet-100">
          <span>{ui.markedToMap.replace("{topic}", state.topic)}</span>
          <button
            type="button"
            onClick={() => sendAppIntent("openTab", { tab: "map" })}
            className="underline underline-offset-4"
          >
            {ui.markOpenMap}
          </button>
        </p>
      ) : state.at === "noMap" ? (
        <p className="mt-2 text-[12px] text-slate-400">{ui.markNoMap}</p>
      ) : state.at === "failed" ? (
        <p className="mt-2 text-[12px] text-rose-300">{ui.markFailed}</p>
      ) : null}
    </section>
  );
}
