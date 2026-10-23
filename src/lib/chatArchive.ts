/** 채팅 기록·저장 항목의 모양(예전 ArchivePanel 화면에서 떼어 냄 — 그 화면은 그려지는 곳이 없어 지움, 2026-10-23). */
import {
  coerceLanguageCode,
  type LearningLanguageCode,
} from "@/lib/learningLanguages";

export const ARCHIVE_STORAGE_KEY = "savedItems";

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
};

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
  };
}

