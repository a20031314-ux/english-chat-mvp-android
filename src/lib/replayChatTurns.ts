import type { ChatMessage } from "@/components/ArchivePanel";

export type ReplayCorrection = {
  corrected: string;
  natural: string;
  explanation: string;
  hasError: boolean;
};

export type ReplayExpression = {
  expression: string;
  example: string;
};

export type ReplayTurn = {
  id: string;
  mode: "chat" | "how_to_say";
  userMessage: string;
  assistantMessage?: string;
  correctionResult?: ReplayCorrection;
  expressionResult?: ReplayExpression;
};

/**
 * Rebuild chat turns from a frozen session transcript for report replay.
 */
export function hydrateReplayTurns(messages: ChatMessage[]): ReplayTurn[] {
  const turns: ReplayTurn[] = [];
  let pendingUser: ChatMessage | null = null;

  for (const message of messages) {
    if (message.role === "user") {
      pendingUser = message;
      continue;
    }

    if (!pendingUser) {
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
        if (c) {
          const corrected =
            typeof c.corrected === "string" && c.corrected.trim()
              ? c.corrected
              : pendingUser.content;
          const natural =
            typeof c.natural === "string" && c.natural.trim()
              ? c.natural
              : corrected;
          const explanation =
            typeof c.explanation === "string" ? c.explanation : "";
          const hasError =
            typeof c.hasError === "boolean"
              ? c.hasError
              : corrected.replace(/\s+/g, " ").trim().toLowerCase() !==
                pendingUser.content.replace(/\s+/g, " ").trim().toLowerCase();
          correctionResult = {
            corrected,
            natural,
            explanation,
            hasError,
          };
        }
      } catch {
        assistantMessage = message.content;
      }

      turns.push({
        id: pendingUser.id.replace(/-user$/, "") || message.id,
        mode: "chat",
        userMessage: pendingUser.content,
        assistantMessage,
        correctionResult,
      });
      pendingUser = null;
      continue;
    }

    if (message.role === "helper") {
      let expressionResult: ReplayExpression = {
        expression: pendingUser.content,
        example: "",
      };
      try {
        const parsed = JSON.parse(message.content) as {
          expressionResult?: Partial<ReplayExpression>;
        };
        if (parsed.expressionResult) {
          expressionResult = {
            expression:
              typeof parsed.expressionResult.expression === "string"
                ? parsed.expressionResult.expression
                : pendingUser.content,
            example:
              typeof parsed.expressionResult.example === "string"
                ? parsed.expressionResult.example
                : "",
          };
        }
      } catch {
        expressionResult = {
          expression: message.content,
          example: "",
        };
      }

      turns.push({
        id: pendingUser.id.replace(/-user$/, "") || message.id,
        mode: "how_to_say",
        userMessage: pendingUser.content,
        expressionResult,
      });
      pendingUser = null;
    }
  }

  if (pendingUser) {
    turns.push({
      id: pendingUser.id.replace(/-user$/, "") || pendingUser.id,
      mode: "chat",
      userMessage: pendingUser.content,
    });
  }

  return turns;
}
