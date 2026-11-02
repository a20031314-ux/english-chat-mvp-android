/** 채팅 기록·저장 항목의 모양(예전 ArchivePanel 화면에서 떼어 냄 — 그 화면은 그려지는 곳이 없어 지움, 2026-10-23). */
import {
  coerceLanguageCode,
  type LearningLanguageCode,
} from "./learningLanguages.ts";
import { isTutorGender, type TutorGender } from "./chatPartner.ts";

export const ARCHIVE_STORAGE_KEY = "savedItems";
/** AI 대화 기록(이 기기). ChatWindow가 쓰고, 대화 탭 튜터 줄이 마지막 말을 읽는다. */
export const CONVERSATION_SESSIONS_KEY = "conversationSessions";

export type SavedItem = {
  id: string;
  type: "correction" | "expression";
  title: string;
  original?: string;
  corrected?: string;
  natural?: string;
  explanation?: string;
  example?: string;
  languageCode: LearningLanguageCode;
  createdAt: number;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "helper";
  content: string;
  createdAt: number;
  attachmentUrl?: string;
};

export type ConversationSession = {
  id: string;
  title: string;
  createdAt: number;
  endedAt?: number;
  messageCount: number;
  messages: ChatMessage[];
  languageCode: LearningLanguageCode;
  /**
   * 그 대화의 튜터(여자·남자) — 튜터마다 따로 된 대화방(사용자 2026-11-02 "튜터프로필도 사람처럼 팔로우, 채팅걸기").
   * 예전 기록에는 없어서 처음 읽을 때 그때 고른 튜터로 붙인다(ChatWindow loadConversationSessions).
   */
  tutorGender?: TutorGender;
};

/**
 * 이 언어·튜터의 이어 할 대화 — 기억해 둔 방 id가 열려 있으면 그것, 아니면 그 튜터의 가장 최근 열린 대화.
 * 튜터가 붙지 않은 대화는 `untagged` 튜터 것으로 본다.
 */
export function resumableFor(
  sessions: readonly ConversationSession[],
  languageCode: LearningLanguageCode,
  gender: TutorGender,
  activeId: string | null,
  untagged: TutorGender,
): ConversationSession | null {
  const mine = sessions.filter(
    (session) => session.languageCode === languageCode && (session.tutorGender ?? untagged) === gender && !session.endedAt && session.messages.length > 0,
  );
  return (activeId ? mine.find((session) => session.id === activeId) : undefined) ?? mine[0] ?? null;
}

/** 이 언어·튜터와의 마지막 말(대화 탭 줄 아래 한 줄). 저장 순서가 최근 먼저다(saveConversationSession). */
export function lastLineFor(
  sessions: readonly ConversationSession[],
  languageCode: LearningLanguageCode,
  gender: TutorGender,
  untagged: TutorGender,
): string {
  const session = sessions.find((item) => item.languageCode === languageCode && (item.tutorGender ?? untagged) === gender && item.messages.length > 0);
  for (const message of session ? [...session.messages].reverse() : []) {
    if (message.role === "helper") continue;
    const text = shownText(message).replace(/\s+/g, " ").trim();
    if (text) return text;
  }
  return "";
}

/** 저장된 줄의 보이는 글 — 튜터 답은 JSON(assistantMessage 등, ChatWindow toSessionMessages)으로 저장된다. */
function shownText(message: ChatMessage): string {
  if (message.role !== "assistant" || !message.content.trimStart().startsWith("{")) return message.content;
  try {
    const parsed = JSON.parse(message.content) as { assistantMessage?: unknown };
    return typeof parsed.assistantMessage === "string" ? parsed.assistantMessage : "";
  } catch {
    return message.content;
  }
}

export function normalizeSavedItem(raw: unknown): SavedItem | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string" || !o.id) return null;
  if (o.type !== "correction" && o.type !== "expression") return null;
  if (typeof o.title !== "string") return null;
  if (typeof o.createdAt !== "number") return null;
  return {
    id: o.id,
    type: o.type,
    title: o.title,
    languageCode: coerceLanguageCode(o.languageCode),
    createdAt: o.createdAt,
    ...(typeof o.original === "string" ? { original: o.original } : {}),
    ...(typeof o.corrected === "string" ? { corrected: o.corrected } : {}),
    ...(typeof o.natural === "string" ? { natural: o.natural } : {}),
    ...(typeof o.explanation === "string"
      ? { explanation: o.explanation }
      : {}),
    ...(typeof o.example === "string" ? { example: o.example } : {}),
  };
}

export function normalizeConversationSession(
  raw: unknown,
): ConversationSession | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string" || !o.id) return null;
  if (typeof o.title !== "string") return null;
  if (typeof o.createdAt !== "number") return null;
  if (typeof o.messageCount !== "number") return null;
  if (!Array.isArray(o.messages)) return null;
  return {
    id: o.id,
    title: o.title,
    createdAt: o.createdAt,
    messageCount: o.messageCount,
    messages: o.messages as ConversationSession["messages"],
    languageCode: coerceLanguageCode(o.languageCode),
    ...(typeof o.endedAt === "number" ? { endedAt: o.endedAt } : {}),
    ...(isTutorGender(o.tutorGender) ? { tutorGender: o.tutorGender } : {}),
  };
}

