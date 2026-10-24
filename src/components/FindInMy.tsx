"use client";

import { useState } from "react";
import type { UICopy } from "@/lib/copy";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import { sendAppIntent } from "@/lib/appIntents";
import { ledgerPlace } from "@/lib/learner/comprehensionClient";
import { currentScene, snapScene } from "@/lib/notes/sceneShots";
import { handOffLocate } from "@/lib/notes/locateHandoff";

/**
 * 문장분석 시트의 "🔎 My에서 찾기"(2026-10-24 사용자 "모르는 부분이 My 어디에 있는지 찾아 학습, 스크린샷과 함께"):
 * 누르는 순간 뒤 화면을 찍고(시트는 빼고, AI 대화·통화·영상만) → 서버가 틀의 칸을 고르고 → 시트를 닫고 My "단계"로.
 * 거기서 그 칸이 열리고 "이 장면 넣기"(화면 함께)를 고른다(NotebookSection).
 */
export function FindInMy({
  ui,
  text,
  sentence,
  language,
  locale,
  onDone,
}: {
  ui: UICopy;
  text: string;
  sentence: string;
  language: string;
  locale: string;
  onDone: () => void;
}) {
  const [state, setState] = useState<"idle" | "busy" | "failed">("idle");
  const find = async () => {
    setState("busy");
    const scene = currentScene();
    const shot = await snapScene();
    try {
      const response = await fetch(apiUrl("/api/notebook"), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...entitlementHeaders() },
        body: JSON.stringify({ language, locate: { text, sentence, ui: locale, tab: ledgerPlace().tab } }),
      });
      const found = (await response.json().catch(() => null)) as { node?: string | null; stage?: number; note?: string } | null;
      if (!response.ok || !found) return setState("failed");
      const social = scene === "dm" || scene === "room";
      handOffLocate({
        language,
        text,
        sentence: social ? "" : sentence,
        node: found.node ?? null,
        ...(found.stage ? { stage: found.stage } : {}),
        note: found.note ?? "",
        where: scene,
        shot: social ? null : shot,
      });
      onDone();
      sendAppIntent("openTab", { tab: "map" });
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
    </div>
  );
}
