import type { ChatMessage } from "@/components/ArchivePanel";
import { alignCorrectionToGrammar } from "@/lib/correctionNorm";
import type { HowToSayExpression } from "@/lib/howToSay";

export type ReplayCorrection = {
  corrected: string;
  natural: string;
  explanation: string;
  hasError: boolean;
};

export type ReplayExpression = HowToSayExpression;

export type ReplayTurn = {
  id: string;
  mode: "chat" | "how_to_say";
  userMessage: string;
  assistantMessage?: string;
  correctionResult?: ReplayCorrection;
  expressionResult?: ReplayExpression;
};

function parseExpression(
  content: string,
  fallback: string,
): ReplayExpression {
  try {
    const parsed = JSON.parse(content) as {
      expressionResult?: Partial<HowToSayExpression>;
    };
    const expr = parsed.expressionResult;
    if (expr && typeof expr.expression === "string" && expr.expression.trim()) {
      return {
        expression: expr.expression.trim(),
        example: typeof expr.example === "string" ? expr.example : "",
        ...(typeof expr.simpler === "string" && expr.simpler.trim()
          ? { simpler: expr.simpler.trim() }
          : {}),
        ...(typeof expr.moreNative === "string" && expr.moreNative.trim()
          ? { moreNative: expr.moreNative.trim() }
          : {}),
        ...(typeof expr.analysis === "string" && expr.analysis.trim()
          ? { analysis: expr.analysis.trim() }
          : {}),
      };
    }
  } catch {
    // plain
  }
  return { expression: content.trim() || fallback, example: "" };
}

/**
 * Rebuild chat turns from a frozen session transcript for report replay.
 */
export function hydrateReplayTurns(messages: ChatMessage[]): ReplayTurn[] {
  const turns: ReplayTurn[] = [];
  let pendingUser: ChatMessage | null = null;
  let pendingExpression: ReplayExpression | null = null;

  const flushHowToSay = (assistantMessage?: string) => {
    if (!pendingUser || !pendingExpression) return;
    turns.push({
      id: pendingUser.id.replace(/-user$/, "") || pendingUser.id,
      mode: "how_to_say",
      userMessage: pendingUser.content,
      expressionResult: pendingExpression,
      ...(assistantMessage ? { assistantMessage } : {}),
    });
    pendingUser = null;
    pendingExpression = null;
  };

  for (const message of messages) {
    if (message.role === "user") {
      flushHowToSay();
      pendingUser = message;
      continue;
    }

    if (message.role === "helper") {
      if (!pendingUser) continue;
      pendingExpression = parseExpression(
        message.content,
        pendingUser.content,
      );
      continue;
    }

    if (message.role === "assistant") {
      let assistantMessage = "";
      let correctionResult: ReplayCorrection | undefined;
      try {
        const parsed = JSON.parse(message.content) as {
          assistantMessage?: string;
          correctionResult?: Partial<ReplayCorrection> | null;
        };
        assistantMessage = parsed.assistantMessage || "";
        const c = parsed.correctionResult;
        if (c && pendingUser && !pendingExpression) {
          const aligned = alignCorrectionToGrammar(
            pendingUser.content,
            typeof c.corrected === "string" && c.corrected.trim()
              ? c.corrected
              : pendingUser.content,
            typeof c.natural === "string" && c.natural.trim()
              ? c.natural
              : "",
          );
          correctionResult = {
            corrected: aligned.corrected,
            natural: aligned.natural,
            explanation:
              typeof c.explanation === "string" && aligned.hasError
                ? c.explanation
                : "",
            hasError: aligned.hasError,
          };
        }
      } catch {
        assistantMessage = message.content;
      }

      if (pendingExpression) {
        flushHowToSay(assistantMessage);
        continue;
      }

      turns.push({
        id: (pendingUser?.id.replace(/-user$/, "") ||
          message.id.replace(/-assistant$/, "") ||
          message.id),
        mode: "chat",
        userMessage: pendingUser?.content || "",
        assistantMessage,
        correctionResult,
      });
      pendingUser = null;
    }
  }

  flushHowToSay();
  if (pendingUser) {
    turns.push({
      id: pendingUser.id.replace(/-user$/, "") || pendingUser.id,
      mode: "chat",
      userMessage: pendingUser.content,
    });
  }

  return turns;
}
