"use client";

import { useEffect, useMemo, useState } from "react";
import { translateUtterance } from "@/lib/translateUtterance";
import { withTranslation } from "@/lib/roleplay/transcriptMarks";
import { keepCall, readCalls } from "@/lib/roleplay/callStore";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { CallRecap } from "@/components/roleplay/CallRecap";
import { CallReplay } from "@/components/roleplay/CallReplay";
import { findScenario } from "@/lib/roleplay/catalog";
import { CallPages, CallSummary, MeFace, TutorFace } from "@/components/roleplay/CallParts";
import { hadFix, tallyCall } from "@/lib/roleplay/transcriptMarks";
import { buildRecap } from "@/lib/roleplay/recap";
import { RoleplayLine, RoleplayReviewPanel } from "@/components/RoleplayReview";
import { fetchReview, fetchPractice, listenOnce } from "@/lib/roleplay/listen";
import type { Review, StuckTurn } from "@/lib/roleplay/review";
import { useEnglishAnalysisOptional } from "@/contexts/EnglishAnalysisContext";
import { callSeconds, type SavedConversation } from "@/lib/roleplay/saved";
import type { UICopy } from "@/lib/copy";
import { sayLine } from "@/lib/speech/sayLine";
import { coerceLanguageCode, type LearningLanguageCode } from "@/lib/learningLanguages";

/** 돌아보기에서 받은 튜터 줄 해석을 그 통화 기록에 넣는다(순서·시각은 그대로). */
function keepGloss(id: string, text: string, translated: string) {
  const row = readCalls().find((one) => one.id === id);
  if (!row) return;
  keepCall({ ...row, said: withTranslation(row.said, text, translated) });
}

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
  /** 숙제 줄에서 열었을 때 — 숙제 화면 [퀴즈 | 대화]를 바로 연다. */
  openReplay?: boolean;
  ui: UICopy;
  onClose: () => void;
  /** My로 넘어갈 때 — 돌아보기와 그 아래 통화 기록 목록까지 닫는다(없으면 onClose). */
  onLeave?: () => void;
  nativeLanguage: LearningLanguageCode;
  isPremium: boolean;
}) {
  const [reviewing, setReviewing] = useState<{ turn: StuckTurn; review: Review | null; failed: boolean } | null>(null);
  const openReview = (turn: StuckTurn) => {
    setReviewing({ turn, review: null, failed: false });
    void fetchReview({ scenarioId: saved.scenarioId, turn, nativeLanguage, isPremium }).then((review) =>
      setReviewing((current) => (current && current.turn === turn ? { ...current, review, failed: review === null } : current)),
    );
  };
  const sayAgain = (target: string) =>
    sayLine(target, { targetLanguage: coerceLanguageCode(saved.language), nativeLanguage, isPremium });
  const recap = useMemo(() => buildRecap(saved.language, saved.said), [saved]);
  // 결과창에는 튜터 줄 해석을 붙인다(2026-11-03 사용자) — 그때 안 받아 둔 줄은 열 때 한 번 받아 통화 기록에도 넣어 둔다(다음에 다시 안 받음).
  const [glosses, setGlosses] = useState<Record<string, string>>({});
  const lines = useMemo(() => Object.entries(glosses).reduce((current, [text, translated]) => withTranslation(current, text, translated), saved.said), [saved, glosses]);
  useEffect(() => {
    if (saved.language === nativeLanguage) return;
    let alive = true;
    const missing = [...new Set(saved.said.filter((line) => line.who === "tutor" && !line.translation && line.text.trim()).map((line) => line.text))];
    for (const text of missing) {
      void translateUtterance({ text, locale: nativeLanguage, interfaceLanguage: nativeLanguage, targetLanguage: coerceLanguageCode(saved.language), sourceType: "conversation" })
        .then((translated) => {
          if (!translated) return;
          keepGloss(saved.id, text, translated);
          if (alive) setGlosses((current) => ({ ...current, [text]: translated }));
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
      {/* Scrolls as a whole like the end screen, so the transcript pages are not squeezed (2026-11-18). */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto [&>*]:shrink-0">
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
          homework={hadFix(saved.said)}
          said={saved.said}
          level={saved.state.difficulty?.level ?? 2}
          isPremium={isPremium}
          openFirst={openReplay}
        />
      ) : null}

      <div className="flex h-[70dvh] min-h-80 flex-col">
      <CallPages ui={ui}>
        {lines.map((line, index) => (
          <RoleplayLine
            key={index}
            // 막힌 차례의 [할 수 있었던 말]은 통화 중·끝 화면과 같은 창(사용자 2026-11-27 — 여기선 버튼을 숨겼고 끝 화면에선 눌러도 안 떴음).
            line={line}
            ui={ui}
            face={line.who === "learner" ? <MeFace /> : <TutorFace />}
            flat
            onReview={openReview}
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
              onLeave={onLeave ?? onClose}
            />
          </li>
        ) : null}
      </CallPages>
      </div>
      </div>
      {reviewing ? (
        <RoleplayReviewPanel
          turn={reviewing.turn}
          review={reviewing.review}
          failed={reviewing.failed}
          ui={ui}
          onClose={() => setReviewing(null)}
          onSayItBack={async (target) => {
            const { heard } = await listenOnce({ language: saved.language, isPremium });
            const practice = heard ? await fetchPractice({ scenarioId: saved.scenarioId, target, heard, nativeLanguage, isPremium }) : null;
            return { heard, practice };
          }}
        />
      ) : null}
    </FullScreenLayer>
  );
}
