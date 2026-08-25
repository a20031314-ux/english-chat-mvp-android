export type ConversationMode = "native" | "tutor";

const TUTOR_HINTS: RegExp[] = [
  /어렵/,
  /너무 어려/,
  /모르겠어/,
  /모르겠어요/,
  /잘 모르/,
  /어떻게 말/,
  /뭐라\s*해/,
  /뭐라고 해/,
  /이게 뭐야/,
  /무슨 뜻/,
  /설명해/,
  /문법/,
  /튜터/,
  /help me say/i,
  /how (?:can|do) i say/i,
  /what does .+ mean/i,
  /i don'?t understand/i,
  /can you explain/i,
  /\btutor\b/i,
];

/** Temporary tutor mode only when the learner is stuck. Default is native chat. */
export function detectConversationMode(message: string): ConversationMode {
  const text = message.trim();
  if (!text) return "native";
  return TUTOR_HINTS.some((pattern) => pattern.test(text)) ? "tutor" : "native";
}

export function isConversationMode(value: unknown): value is ConversationMode {
  return value === "native" || value === "tutor";
}
