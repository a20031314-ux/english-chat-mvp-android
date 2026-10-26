"use client";

import { useState } from "react";
import type { UICopy } from "@/lib/copy";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import { isLedgerText } from "@/lib/learner/ledger";
import { ledgerPlace } from "@/lib/learner/comprehensionClient";
import { refreshLedger } from "@/lib/learner/ledgerClient";

/**
 * The learner's own say about the words in the sentence sheet
 * (hub/drafts/learner-led-map.md, sentence by sentence):
 *
 *   I know this / I don't know this — kept in their ledger as a mark, never
 *   taken as mastery, which only producing a phrase earns.
 *
 * "지도에 넣기"(목표 지도 주제에 할 일 하나, /api/curriculum/pick)는 2026-10-27 My 예전 목표 지도와 함께 뺐다 —
 * 궁금한 부분은 "🔎 My에서 찾기"(FindInMy)로 틀의 칸에. 서버 API는 2.74 이하 앱이 쓴다.
 * Nothing is sent until a button is pressed.
 */
type Mark = "known" | "unknown";

export function MarkForMap({
  ui,
  text,
  language,
}: {
  ui: UICopy;
  text: string;
  sentence?: string;
  language: string;
  asked?: { question: string; answer: string };
}) {
  const [mark, setMark] = useState<Mark | null>(null);
  if (!isLedgerText(text, language)) return null;

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

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-[13px] ${
      active ? "border-white/50 bg-white/20 text-white" : "border-white/15 bg-white/5 text-slate-200 hover:bg-white/10"
    }`;

  return (
    <section className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex flex-wrap gap-1.5">
        <button type="button" aria-pressed={mark === "known"} onClick={() => sendMark("known")} className={chip(mark === "known")}>
          {ui.markKnown}
        </button>
        <button type="button" aria-pressed={mark === "unknown"} onClick={() => sendMark("unknown")} className={chip(mark === "unknown")}>
          {ui.markUnknown}
        </button>
      </div>
    </section>
  );
}
