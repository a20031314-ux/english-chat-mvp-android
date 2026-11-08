"use client";

import { useEffect, useMemo, useState } from "react";
import { translateUtterance } from "@/lib/translateUtterance";
import { withTranslation } from "@/lib/roleplay/transcriptMarks";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { CallRecap } from "@/components/roleplay/CallRecap";
import { CallReplay } from "@/components/roleplay/CallReplay";
import { findScenario } from "@/lib/roleplay/catalog";
import { CallPages, CallSummary, MeFace, TutorFace } from "@/components/roleplay/CallParts";
import { tallyCall } from "@/lib/roleplay/transcriptMarks";
import { buildRecap } from "@/lib/roleplay/recap";
import { handOffFrame } from "@/lib/notes/locateHandoff";
import { sendAppIntent } from "@/lib/appIntents";
import { RoleplayLine } from "@/components/RoleplayReview";
import { useEnglishAnalysisOptional } from "@/contexts/EnglishAnalysisContext";
import { callSeconds, type SavedConversation } from "@/lib/roleplay/saved";
import type { UICopy } from "@/lib/copy";
import { sayLine } from "@/lib/speech/sayLine";
import { coerceLanguageCode, type LearningLanguageCode } from "@/lib/learningLanguages";

/**
 * A conversation that has already happened, read back.
 *
 * The same lines the scene drew, with everything that was learned about them
 * still attached — the gloss somebody tapped for, their own sentence said
 * better, the note under it. The one thing missing is the offer to look back at
 * a turn they got stuck on: that asks the model about a conversation in
 * progress, and this is not one. The evidence is still on the line, so the
 * button can be given back the day it makes sense to ask afterwards.
 *
 * Read-only on purpose. A conversation is carried on from the door, where the
 * microphone is opened deliberately, not from a page somebody was reading.
 */
export function RoleplayPast({
  saved,
  ui,
  onClose,
  nativeLanguage,
  isPremium,
  onLeave,
  openReplay = false,
}: {
  saved: SavedConversation;
  /** 숙제 줄에서 열었을 때 — 🎭 장면을 바로 연다. */
  openReplay?: boolean;
  ui: UICopy;
  onClose: () => void;
  /** My로 넘어갈 때 — 돌아보기와 그 아래 통화 기록 목록까지 닫는다(없으면 onClose). */
  onLeave?: () => void;
  nativeLanguage: LearningLanguageCode;
  isPremium: boolean;
}) {
  const sayAgain = (target: string) =>
    sayLine(target, { targetLanguage: coerceLanguageCode(saved.language), nativeLanguage, isPremium });
  const recap = useMemo(() => buildRecap(saved.language, saved.said), [saved]);
  // 결과창에는 튜터 줄 해석을 붙인다(2026-11-03 사용자) — 그때 안 받아 둔 줄은 열 때 한 번 받는다(이 화면에서만, 저장은 그대로).
  const [glosses, setGlosses] = useState<Record<string, string>>({});
  const lines = useMemo(() => Object.entries(glosses).reduce((current, [text, translated]) => withTranslation(current, text, translated), saved.said), [saved, glosses]);
  useEffect(() => {
    if (saved.language === nativeLanguage) return;
    let alive = true;
    const missing = [...new Set(saved.said.filter((line) => line.who === "tutor" && !line.translation && line.text.trim()).map((line) => line.text))];
    for (const text of missing) {
      void translateUtterance({ text, locale: nativeLanguage, interfaceLanguage: nativeLanguage, targetLanguage: coerceLanguageCode(saved.language), sourceType: "conversation" })
        .then((translated) => {
          if (alive && translated) setGlosses((current) => ({ ...current, [text]: translated }));
        })
        .catch(() => undefined);
    }
    return () => {
      alive = false;
    };
  }, [saved, nativeLanguage]);
  const analysis = useEnglishAnalysisOptional();
  const analyze = analysis
    ? (text: string) =>
        analysis.open({
          selectedText: text,
          contextSentence: text,
          sourceType: "conversation",
          language: saved.language,
          intent: "sentence",
        })
    : undefined;
  return (
    <FullScreenLayer>
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="min-w-0">
          <h2 dir="auto" className="truncate text-start text-sm font-semibold text-white">{saved.title}</h2>
          <p className="text-[11px] text-neutral-500">
            {new Date(saved.startedAt).toLocaleString()}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg border border-white/15 px-3 py-1.5 text-[12px] text-neutral-300 hover:bg-white/10"
        >
          {ui.billingClose}
        </button>
      </header>
      <CallSummary
        ui={ui}
        language={saved.language}
        seconds={callSeconds(saved)}
        tally={tallyCall(saved.said)}
      />
      {findScenario(saved.scenarioId)?.openEnded ? (
        <CallReplay
          ui={ui}
          language={saved.language}
          locale={nativeLanguage}
          scenarioId={saved.scenarioId}
          callId={saved.id}
          lesson={saved.mode === "lesson"}
          said={saved.said}
          level={saved.state.difficulty?.level ?? 2}
          isPremium={isPremium}
          openFirst={openReplay}
        />
      ) : null}

      <CallPages ui={ui}>
        {lines.map((line, index) => (
          <RoleplayLine
            key={index}
            // Nothing here asks the model anything, so the line is drawn
            // without the two things that would: looking back at a stuck turn,
            // and fetching a gloss that was never fetched at the time.
            line={line.stuck ? { ...line, stuck: undefined } : line}
            ui={ui}
            face={line.who === "learner" ? <MeFace /> : <TutorFace />}
            flat
            onReview={() => undefined}
            onAnalyze={analyze}
            onSayAgain={sayAgain}
            ledgerLanguage={saved.language}
          />
        ))}
        {/* 통화 정리(roleplay/recap.ts) — 끝난 화면과 같은 카드. 다시 볼 것에는 끝날 때 이미 넣었으니 여기선 넣지 않는다. */}
        {recap.length ? (
          <li>
            <CallRecap
              ui={ui}
              language={saved.language}
              locale={nativeLanguage}
              items={recap}
              saved={false}
              onOpenFrame={(frame) => {
                handOffFrame({ language: saved.language, stage: frame.stage, id: frame.id });
                (onLeave ?? onClose)();
                sendAppIntent("openTab", { tab: "map" });
              }}
              onLeave={onLeave ?? onClose}
            />
          </li>
        ) : null}
      </CallPages>
    </FullScreenLayer>
  );
}
