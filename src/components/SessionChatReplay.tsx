"use client";

import { useMemo } from "react";
import type { ChatMessage } from "@/components/ArchivePanel";
import { CorrectionCard } from "@/components/CorrectionCard";
import { MessageBubble } from "@/components/MessageBubble";
import type { UICopy } from "@/lib/copy";
import { hydrateReplayTurns } from "@/lib/replayChatTurns";

type SessionChatReplayProps = {
  messages: ChatMessage[];
  ui: UICopy;
};

export function SessionChatReplay({ messages, ui }: SessionChatReplayProps) {
  const turns = useMemo(() => hydrateReplayTurns(messages), [messages]);

  if (turns.length === 0) {
    return <p className="text-sm text-slate-500">{ui.reportReviewEmpty}</p>;
  }

  return (
    <div className="max-h-[min(70dvh,40rem)] space-y-3 overflow-y-auto border-l border-slate-200 pl-3 sm:space-y-4 sm:pl-4">
      {turns.map((turn) => (
        <article key={turn.id} className="space-y-2">
          {turn.userMessage.trim() ? (
            <MessageBubble
              role="user"
              message={turn.userMessage}
              attachedEnglish={
                turn.mode === "how_to_say"
                  ? turn.expressionResult?.expression
                  : undefined
              }
              labels={{ listen: ui.listen }}
            />
          ) : null}

          {turn.mode === "chat" && turn.correctionResult && turn.assistantMessage ? (
            <>
              <CorrectionCard
                original={turn.userMessage}
                corrected={turn.correctionResult.corrected}
                natural={turn.correctionResult.natural}
                explanation={turn.correctionResult.explanation}
                hasError={turn.correctionResult.hasError}
                feedback={
                  turn.correctionResult.hasError
                    ? ui.correctionFeedbackError
                    : ui.correctionFeedbackCorrect
                }
                labels={{
                  listen: ui.listen,
                  natural: ui.natural,
                  blockTitle: ui.correctionBlockTitle,
                  myLine: ui.correctionMyLine,
                  tryThis: ui.correctionTryThis,
                }}
              />
              <MessageBubble
                role="assistant"
                message={turn.assistantMessage}
                labels={{ listen: ui.listen }}
              />
            </>
          ) : null}

          {turn.mode === "chat" &&
          !turn.correctionResult &&
          turn.assistantMessage ? (
            <MessageBubble
              role="assistant"
              message={turn.assistantMessage}
              labels={{ listen: ui.listen }}
            />
          ) : null}

          {turn.mode === "how_to_say" && turn.assistantMessage ? (
            <MessageBubble
              role="assistant"
              message={turn.assistantMessage}
              labels={{ listen: ui.listen }}
            />
          ) : null}
        </article>
      ))}
    </div>
  );
}
