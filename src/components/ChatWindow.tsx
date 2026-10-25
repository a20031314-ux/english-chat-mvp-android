"use client";

import { enterScene } from "@/lib/notes/sceneShots";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  ARCHIVE_STORAGE_KEY,
  ChatMessage,
  ConversationSession,
  normalizeConversationSession,
  normalizeSavedItem,
  SavedItem,
} from "@/lib/chatArchive";
import { ChatHttpError, postChatStream } from "@/lib/chatStream";
import { APP_LOCALE_STORAGE_KEY, isLocale, Locale } from "@/lib/copy";
import { useUiCopy } from "@/hooks/useUiCopy";
import {
  loadLearningCards,
  persistLearningCards,
  type LearningCard,
} from "@/lib/learningCards";
import { normalizeHowToSayExpression, type HowToSayExpression } from "@/lib/howToSay";
import { noteUpdateLevel } from "@/lib/appUpdate";
import { LedgerLinks } from "@/components/LedgerLinks";
import { refreshLedgerSoon } from "@/lib/learner/ledgerClient";
import { roomCopy } from "@/lib/rooms/copy";
import { MessageBubble } from "./MessageBubble";
import { ChatHistoryPanel } from "./ChatHistoryPanel";
import { useBillingUi } from "./BillingScreen";
import { usePremium } from "@/contexts/PremiumContext";
import { useLearningLanguageOptional } from "@/contexts/LearningLanguageContext";
import { Capacitor } from "@capacitor/core";
import { FREE_DAILY_CHAT_LIMIT } from "@/lib/billing/config";
import { entitlementHeaders } from "@/lib/billing/billingService";
import { maybeShowInterstitial, noteChatSent, rewardOffer, showRewardedForChats, waitForChatBonus, type RewardOffer } from "@/lib/ads";
import {
  writtenInLearningLanguage,
} from "@/lib/inputLanguage";
import {
  alignCorrectionToGrammar,
  substantiveNorm,
} from "@/lib/correctionNorm";
import {
  DEFAULT_LEARNING_LANGUAGE_CODE,
  isLearningLanguageCode,
  learningLanguageTextDir,
  type LearningLanguageCode,
} from "@/lib/learningLanguages";
import { chatPartnerForLanguage } from "@/lib/chatPartner";
import {
  detectConversationMode,
  type ConversationMode,
} from "@/lib/conversationMode";
import { onAppIntent, sendAppIntent, takeAppIntent } from "@/lib/appIntents";
import { NextStepCard, PracticeBanner, type PracticeRequest } from "@/components/NextStepCard";
import { PackCard } from "@/components/PackCard";
import { discardCall, readCalls, readCallsOnServer, subscribeCalls } from "@/lib/roleplay/callStore";
import { isUnfinished, type SavedConversation } from "@/lib/roleplay/saved";
import { saidPhrase } from "@/lib/learner/practice";
import { scenariosForLanguage } from "@/lib/roleplay/catalog";
import { ExpressionPeek } from "@/components/ExpressionPeek";
import { compressChatImage } from "@/lib/chatImage";
import { correctionRisk } from "@/lib/correctionRisk";
import { captureSceneSoon } from "@/lib/notes/sceneShots";
import {
  DEFAULT_CORRECTION_VIEW,
  readCorrectionView,
  writeCorrectionView,
  type CorrectionView,
} from "@/lib/correctionView";
import { formatCallDuration, type ChatCallEvent } from "@/lib/callSession";
import {
  ReportContentDialog,
  type ReportTarget,
} from "@/components/ReportContentDialog";

type CorrectionResult = {
  corrected: string;
  natural: string;
  explanation: string;
  hasError: boolean;
};

type ExpressionResult = HowToSayExpression;

type InputMode = "chat" | "how_to_say";

type ChatTurn = {
  id: string;
  mode: InputMode;
  userMessage: string;
  assistantMessage?: string;
  correctionResult?: CorrectionResult;
  expressionResult?: ExpressionResult;
  translatedMessage?: string;
  /** Conversational equivalent in the UI language — not a literal translation */
  spokenReply?: string;
  /** From “use this expression” — continue chat without a grammar card */
  suppressCorrectionCard?: boolean;
  /** Written in the learner's own language; how to say it is a card they open. */
  ownLanguage?: boolean;
  /** The folded correction was opened ("눌러서 보기"). */
  correctionOpen?: boolean;
  /** The check model is looking at this correction right now. */
  correctionChecking?: boolean;
  /** The check model has already looked (or it was not worth a look). */
  correctionVerified?: boolean;
  attachmentUrl?: string;
  conversationMode?: ConversationMode;
  /**
   * A call that was placed from this screen back when the chat had a phone
   * button. Nothing writes these any more — calling lives in its own tab — but
   * saved conversations still hold them, so they are still read and shown.
   */
  callEvent?: ChatCallEvent;
};

type ChatModeApiResponse = {
  assistantMessage: string;
  spokenReply?: string;
  correction: {
    corrected: string;
    natural: string;
    explanation: string;
  };
};

type ExpressionApiResponse = HowToSayExpression & {
  assistantMessage?: string;
  spokenReply?: string;
  correction?: {
    corrected: string;
    natural: string;
    explanation: string;
  };
};

const SESSION_MESSAGE_LIMIT = FREE_DAILY_CHAT_LIMIT;

function premiumRequestHeaders(isPremium: boolean): HeadersInit {
  return entitlementHeaders(isPremium);
}
const CONVERSATION_SESSIONS_KEY = "conversationSessions";
/** Legacy single active-id key (migrated into per-language map). */
const ACTIVE_CONVERSATION_ID_KEY = "activeConversationSessionId";
const ACTIVE_CONVERSATION_IDS_KEY = "activeConversationSessionIds";
const VERCEL_FALLBACK_API_BASE = "https://english-chat-mvp.vercel.app";

/** Web dev uses same-origin `/api/*`. Capacitor WebView uses bundled UI + remote API. */
function getApiBase(): string {
  if (typeof window === "undefined") {
    return VERCEL_FALLBACK_API_BASE;
  }

  const fromEnv = process.env.NEXT_PUBLIC_API_BASE?.trim();
  const remoteApiBase = fromEnv
    ? fromEnv.replace(/\/+$/, "")
    : VERCEL_FALLBACK_API_BASE;

  if (Capacitor.isNativePlatform()) {
    return remoteApiBase;
  }

  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") {
    return "";
  }

  return remoteApiBase;
}

function apiUrl(apiPath: string): string {
  const path = apiPath.startsWith("/") ? apiPath : `/${apiPath}`;
  const base = getApiBase().replace(/\/+$/, "");
  return base === "" ? path : `${base}${path}`;
}

type Plan = "free" | "pro";

type EntitlementState = {
  plan: Plan;
  dailyUsed: number;
  dailyLimit: number | null;
};

function isDailyLimitReachedError(error: unknown) {
  return error instanceof Error && error.message === "DAILY_LIMIT_REACHED";
}

function stripExplanationLabel(text: string) {
  return text.replace(/^(설명|Explanation|Explicaci[oó]n)\s*[:：]\s*/i, "").trim();
}

function isPlaceholderExplanation(text: string) {
  return /일시적인\s*오류/.test(text) || /temporary\s+error/i.test(text);
}

/**
 * Shown when the model found a mistake but wrote no reason for it.
 *
 * Typed by Locale rather than by string, so the next interface language cannot
 * be added without this line being written for it. It was nine of fourteen,
 * and the five without one — Italian, Russian, Arabic, Thai, Hindi — fell
 * through to the Korean sentence.
 */
const FALLBACK_CORRECTION_EXPLANATION: Record<Locale, string> = {
  ko: "이 부분을 이렇게 고치면 더 자연스러워요.",
  en: "This wording is clearer and more natural.",
  es: "Esta forma suena más clara y natural.",
  ja: "こう直すとより自然です。",
  zh: "这样改会更自然。",
  vi: "Cách diễn đạt này tự nhiên hơn.",
  fr: "Cette formulation est plus naturelle.",
  it: "Questa formulazione suona più naturale.",
  pt: "Essa formulação fica mais natural.",
  ru: "Так звучит естественнее.",
  id: "Susunan ini terdengar lebih natural.",
  ar: "هذه الصيغة أكثر طبيعية.",
  th: "สำนวนนี้ฟังดูเป็นธรรมชาติมากกว่า",
  hi: "इस तरह कहना ज़्यादा स्वाभाविक लगता है।",
};

function normalizeCorrectionResult(
  originalMessage: string,
  correction: ChatModeApiResponse["correction"] | undefined,
  locale: Locale,
): CorrectionResult {
  const aligned = alignCorrectionToGrammar(
    originalMessage,
    correction?.corrected?.trim() || originalMessage,
    correction?.natural?.trim() || "",
  );
  const rawExplanation = stripExplanationLabel(
    correction?.explanation?.trim() || "",
  );
  const explanation = isPlaceholderExplanation(rawExplanation)
    ? ""
    : rawExplanation;

  return {
    corrected: aligned.corrected,
    natural: aligned.natural,
    explanation:
      aligned.hasError && !explanation
        ? FALLBACK_CORRECTION_EXPLANATION[locale]
        : aligned.hasError
          ? explanation
          : "",
    hasError: aligned.hasError,
  };
}

function shouldShowCorrectionCard(
  original: string,
  result: CorrectionResult,
): boolean {
  const o = substantiveNorm(original);
  const c = substantiveNorm(result.corrected);
  const n = substantiveNorm(result.natural);
  // Real wording change only — not punctuation like "Hello" → "Hello."
  if (result.hasError && c !== o) return true;
  // Natural alternative that is actually different wording
  if (n && n !== o && n !== c) return true;
  return false;
}

/** 이번 실행에서 채팅 흘려 받기가 되는지(한 번 네트워크 층에서 실패하면 예전 방식). */
let chatStreamWorks = true;

function makeSessionId() {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadSavedItems(): SavedItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(ARCHIVE_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(normalizeSavedItem)
      .filter((item): item is SavedItem => item !== null);
  } catch {
    return [];
  }
}

function persistSavedItems(items: SavedItem[]) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("archiveUpdated"));
}

function loadConversationSessions(): ConversationSession[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CONVERSATION_SESSIONS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const sessions = parsed
      .map(normalizeConversationSession)
      .filter((item): item is ConversationSession => item !== null);
    return sessions;
  } catch {
    return [];
  }
}

function saveConversationSession(session: ConversationSession) {
  if (typeof window === "undefined") {
    return;
  }

  const current = loadConversationSessions();
  const withoutCurrent = current.filter((item) => item.id !== session.id);
  window.localStorage.setItem(
    CONVERSATION_SESSIONS_KEY,
    JSON.stringify([session, ...withoutCurrent]),
  );
}

function loadActiveConversationIds(): Partial<
  Record<LearningLanguageCode, string>
> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(ACTIVE_CONVERSATION_IDS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        const out: Partial<Record<LearningLanguageCode, string>> = {};
        for (const [key, value] of Object.entries(
          parsed as Record<string, unknown>,
        )) {
          if (typeof value === "string" && value && isLearningLanguageCode(key)) {
            out[key] = value;
          }
        }
        return out;
      }
    }
    // Migrate legacy single key → English workspace.
    const legacy = window.localStorage.getItem(ACTIVE_CONVERSATION_ID_KEY);
    if (legacy) {
      const migrated = { [DEFAULT_LEARNING_LANGUAGE_CODE]: legacy };
      window.localStorage.setItem(
        ACTIVE_CONVERSATION_IDS_KEY,
        JSON.stringify(migrated),
      );
      window.localStorage.removeItem(ACTIVE_CONVERSATION_ID_KEY);
      return migrated;
    }
  } catch {
    // ignore
  }
  return {};
}

function loadActiveConversationId(
  languageCode: LearningLanguageCode,
): string | null {
  return loadActiveConversationIds()[languageCode] ?? null;
}

function persistActiveConversationId(
  languageCode: LearningLanguageCode,
  id: string | null,
) {
  if (typeof window === "undefined") return;
  try {
    const current = loadActiveConversationIds();
    if (!id) {
      delete current[languageCode];
    } else {
      current[languageCode] = id;
    }
    window.localStorage.setItem(
      ACTIVE_CONVERSATION_IDS_KEY,
      JSON.stringify(current),
    );
    // Keep legacy key in sync for older builds reading English only.
    if (languageCode === DEFAULT_LEARNING_LANGUAGE_CODE) {
      if (!id) {
        window.localStorage.removeItem(ACTIVE_CONVERSATION_ID_KEY);
      } else {
        window.localStorage.setItem(ACTIVE_CONVERSATION_ID_KEY, id);
      }
    }
  } catch {
    // ignore
  }
}

function sessionLanguageOf(
  session: ConversationSession,
): LearningLanguageCode {
  return session.languageCode || DEFAULT_LEARNING_LANGUAGE_CODE;
}

function findResumableSession(
  sessions: ConversationSession[],
  languageCode: LearningLanguageCode,
): ConversationSession | null {
  const forLanguage = sessions.filter(
    (session) => sessionLanguageOf(session) === languageCode,
  );
  const activeId = loadActiveConversationId(languageCode);
  if (activeId) {
    const active = forLanguage.find(
      (session) =>
        session.id === activeId &&
        !session.endedAt &&
        session.messages?.length,
    );
    if (active) return active;
  }
  return (
    forLanguage.find(
      (session) => !session.endedAt && (session.messages?.length || 0) > 0,
    ) ?? null
  );
}

function deleteConversationSession(id: string) {
  if (typeof window === "undefined") {
    return;
  }
  const next = loadConversationSessions().filter((session) => session.id !== id);
  window.localStorage.setItem(CONVERSATION_SESSIONS_KEY, JSON.stringify(next));
}

function clearConversationSessionsForLanguage(languageCode: LearningLanguageCode) {
  if (typeof window === "undefined") {
    return;
  }
  const kept = loadConversationSessions().filter(
    (session) => sessionLanguageOf(session) !== languageCode,
  );
  window.localStorage.setItem(CONVERSATION_SESSIONS_KEY, JSON.stringify(kept));
}

function sessionTitleFromTurns(turns: ChatTurn[]): string {
  for (const turn of turns) {
    const text = turn.userMessage.trim() || turn.assistantMessage?.trim() || "";
    if (text) {
      return text.length > 28 ? `${text.slice(0, 28)}...` : text;
    }
  }
  return "Conversation Session";
}

function toSessionMessages(turns: ChatTurn[]): ChatMessage[] {
  return turns.flatMap((turn) => {
    const messages: ChatMessage[] = [];
    if (turn.userMessage.trim() || turn.attachmentUrl) {
      messages.push({
        id: `${turn.id}-user`,
        role: "user",
        content: turn.userMessage,
        createdAt: Date.now(),
        ...(turn.attachmentUrl ? { attachmentUrl: turn.attachmentUrl } : {}),
      });
    }

    if (turn.mode === "chat" && (turn.assistantMessage || turn.callEvent)) {
      messages.push({
        id: `${turn.id}-assistant`,
        role: "assistant",
        content: JSON.stringify({
          assistantMessage: turn.assistantMessage || "",
          spokenReply: turn.spokenReply || "",
          correctionResult: turn.correctionResult || null,
          ...(turn.callEvent ? { callEvent: turn.callEvent } : {}),
          // A line in their own language keeps its expression card, opened or not.
          ...(turn.ownLanguage ? { ownLanguage: true } : {}),
          ...(turn.ownLanguage && turn.expressionResult
            ? { expressionResult: turn.expressionResult }
            : {}),
        }),
        createdAt: Date.now(),
      });
      return messages;
    }

    if (turn.expressionResult) {
      messages.push({
        id: `${turn.id}-helper`,
        role: "helper",
        content: JSON.stringify({ expressionResult: turn.expressionResult }),
        createdAt: Date.now(),
      });
    }

    if (turn.mode === "how_to_say" && turn.assistantMessage) {
      messages.push({
        id: `${turn.id}-assistant`,
        role: "assistant",
        content: JSON.stringify({
          assistantMessage: turn.assistantMessage || "",
          spokenReply: turn.spokenReply || "",
          correctionResult: turn.correctionResult || null,
          fromHowToSay: true,
        }),
        createdAt: Date.now(),
      });
    }

    return messages;
  });
}

function fromSessionMessages(messages: ChatMessage[]): ChatTurn[] {
  const turns: ChatTurn[] = [];
  let pendingUser: ChatMessage | null = null;
  let pendingExpression: ExpressionResult | null = null;

  const flushHowToSay = (extra?: {
    assistantMessage?: string;
    spokenReply?: string;
    correctionResult?: CorrectionResult;
  }) => {
    if (!pendingUser || !pendingExpression) return;
    turns.push({
      id: pendingUser.id.replace("-user", ""),
      mode: "how_to_say",
      userMessage: pendingUser.content,
      expressionResult: pendingExpression,
      assistantMessage: extra?.assistantMessage,
      spokenReply: extra?.spokenReply,
      translatedMessage: extra?.spokenReply,
      correctionResult: extra?.correctionResult,
      suppressCorrectionCard: true,
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
      try {
        const parsed = JSON.parse(message.content) as {
          expressionResult?: ExpressionResult;
        };
        pendingExpression = parsed.expressionResult
          ? normalizeHowToSayExpression(
              pendingUser.content,
              parsed.expressionResult,
            )
          : { expression: pendingUser.content, example: "" };
      } catch {
        pendingExpression = {
          expression: message.content,
          example: "",
        };
      }
      continue;
    }

    if (message.role === "assistant") {
      let assistantMessage = "";
      let spokenReply = "";
      let correctionResult: CorrectionResult | undefined;
      let callEvent: ChatCallEvent | undefined;
      let ownLanguage = false;
      let ownExpression: ExpressionResult | undefined;
      try {
        const parsed = JSON.parse(message.content) as {
          assistantMessage?: string;
          spokenReply?: string;
          correctionResult?: CorrectionResult;
          callEvent?: ChatCallEvent;
          ownLanguage?: boolean;
          expressionResult?: ExpressionResult;
        };
        ownLanguage = parsed.ownLanguage === true;
        ownExpression = parsed.expressionResult?.expression ? parsed.expressionResult : undefined;
        assistantMessage = parsed.assistantMessage || "";
        spokenReply = parsed.spokenReply || "";
        correctionResult = parsed.correctionResult;
        callEvent = parsed.callEvent;
      } catch {
        assistantMessage = message.content;
      }

      if (pendingExpression) {
        flushHowToSay({
          assistantMessage,
          spokenReply: spokenReply || undefined,
          correctionResult,
        });
        continue;
      }

      if (!pendingUser) {
        turns.push({
          id: message.id.replace(/-assistant$/, "") || message.id,
          mode: "chat",
          userMessage: "",
          assistantMessage,
          spokenReply: spokenReply || undefined,
          translatedMessage: spokenReply || undefined,
          callEvent,
        });
        continue;
      }

      turns.push({
        id: pendingUser.id.replace("-user", ""),
        mode: "chat",
        userMessage: pendingUser.content,
        assistantMessage,
        spokenReply: spokenReply || undefined,
        translatedMessage: spokenReply || undefined,
        correctionResult,
        attachmentUrl: pendingUser.attachmentUrl,
        callEvent,
        ...(ownLanguage ? { ownLanguage: true } : {}),
        ...(ownExpression ? { expressionResult: ownExpression } : {}),
      });
      pendingUser = null;
    }
  }

  flushHowToSay();
  return turns;
}

function buildCorrectionSavedItem(
  turn: ChatTurn,
  languageCode: LearningLanguageCode,
): SavedItem | null {
  if (!turn.correctionResult) {
    return null;
  }

  return {
    id: `correction-${turn.id}`,
    type: "correction",
    title: turn.correctionResult.corrected,
    original: turn.userMessage,
    corrected: turn.correctionResult.corrected,
    natural: turn.correctionResult.natural,
    explanation: turn.correctionResult.explanation,
    languageCode,
    createdAt: Date.now(),
  };
}

function buildExpressionSavedItem(
  turn: ChatTurn,
  languageCode: LearningLanguageCode,
): SavedItem | null {
  if (!turn.expressionResult) {
    return null;
  }

  return {
    id: `expression-${turn.id}`,
    type: "expression",
    title: turn.expressionResult.expression,
    original: turn.userMessage,
    corrected: turn.expressionResult.expression,
    explanation: "",
    example: turn.expressionResult.example,
    languageCode,
    createdAt: Date.now(),
  };
}

type ChatWindowProps = {
  tabMode?: boolean;
  locale?: Locale;
  /**
   * 대화 목록 안의 화면일 때: 머리 맨 앞 "‹ 대화"(1:1 대화와 같은 자리, 2026-10-23 conversation-unify).
   * `unread`는 다른 대화의 안 읽음 수.
   */
  back?: { label: string; unread: number; onBack: () => void } | null;
  /** 머리의 📞(AI 튜터와 통화). 없으면 두지 않는다(통화 없는 언어·통화를 숨김). */
  onCall?: (() => void) | null;
  callLabel?: string;
  /** ⋮ 메뉴에 더할 것(내 문장 말해보기 등). */
  menuItems?: { label: string; onSelect: () => void }[];
  /** 빈 대화에 오늘의 팩 카드(대화 목록이 없는 화면 — iOS 1차·사람을 숨김). 대화 목록이 있으면 목록 맨 위에. */
  showPack?: boolean;
};

/**
 * 이 대화 안에서 건 AI 통화 — 1:1 대화의 🗒 통화 기록 카드와 같은 자리(2026-10-23, conversation-unify 3단계).
 * 멈춘 통화는 "이어서 하기", 끝난 통화는 "돌아보기"(CallHost가 연다). × = 이 기록 지우기(폰에만 있는 기록).
 */
function CallRecordCard({ call, ui, locale }: { call: SavedConversation; ui: ReturnType<typeof useUiCopy>; locale: string }) {
  const unfinished = isUnfinished(call);
  const time = new Date(call.updatedAt).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  return (
    <div className="flex justify-center">
      <div className="flex w-full max-w-sm items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-200">
        <span className="shrink-0">🗒 {ui.homeTabCall}</span>
        <span className="min-w-0 flex-1 truncate text-meta text-slate-500">
          <bdi>{call.title}</bdi> · {time}
        </span>
        {unfinished ? (
          <button
            type="button"
            onClick={() => sendAppIntent("startCall", { resumeId: call.id })}
            className="shrink-0 rounded-lg bg-emerald-500 px-2.5 py-1 text-xs font-medium text-black"
          >
            {ui.roleplayResume}
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => sendAppIntent("openCall", { id: call.id })}
          className="shrink-0 rounded-lg border border-white/15 px-2.5 py-1 text-xs text-slate-200 hover:bg-white/10"
        >
          {ui.packSeeRetro}
        </button>
        {/* 카드에서 바로 지우기(2026-10-25 사용자: 아이폰에서 통화 기록이 안 지워진다 — 지우기가 ⋮ 지난 대화 서랍에만 있었음). */}
        <button
          type="button"
          onClick={() => discardCall(call.id)}
          aria-label={ui.delete}
          title={ui.delete}
          className="-me-1 shrink-0 rounded-full px-1.5 text-title leading-none text-slate-500 hover:bg-white/10 hover:text-slate-200"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function ChatWindow({
  tabMode = false,
  locale: localeProp,
  back = null,
  onCall = null,
  callLabel,
  menuItems = [],
  showPack = false,
}: ChatWindowProps) {
  // "My에서 찾기"가 화면을 찍어도 되는 곳인지(lib/notes/sceneShots.ts — 사람끼리 대화는 안 찍음).
  useEffect(() => enterScene("chat"), []);
  const { isPremium, isBillingReady } = usePremium();
  const billing = useBillingUi();
  const learningLanguage = useLearningLanguageOptional();
  const targetLanguage =
    learningLanguage?.targetLanguage ?? DEFAULT_LEARNING_LANGUAGE_CODE;
  const [sessionLanguageCode, setSessionLanguageCode] =
    useState<LearningLanguageCode>(targetLanguage);
  const [localeState] = useState<Locale>(() => {
    if (typeof window === "undefined") {
      return "ko";
    }
    try {
      const raw = localStorage.getItem(APP_LOCALE_STORAGE_KEY);
      if (raw && isLocale(raw)) {
        return raw;
      }
    } catch {
      // ignore
    }
    return "ko";
  });
  const locale = localeProp ?? localeState;
  const ui = useUiCopy(locale);
  const [bookToast, setBookToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Both on by default, so what someone types decides what happens: a line in
  // the language they are learning is practice, a line in their own language
  // asks how to say it (inputLanguage.ts). With only chat on, an English
  // reader learning Spanish who typed English had it sent to the tutor as
  // practice and got Spanish back — the mode they needed was one they had to
  // find a toggle for. Every place that starts a conversation resets to this.
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  // A study-map topic can hand over the first line to send.
  useEffect(() => onAppIntent("chatDraft", ({ text }) => setInput(text)), []);
  const [isSending, setIsSending] = useState(false);
  // What this conversation was started to practise, from "try this" or the
  // map (learner/practice.ts). Sent with every turn so the tutor keeps to it;
  // dropped when the conversation ends or the learner stops it.
  const [practice, setPractice] = useState<PracticeRequest | null>(null);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [, setLearningCards] = useState<LearningCard[]>([]);
  const [conversationSessions, setConversationSessions] = useState<ConversationSession[]>(
    [],
  );
  const [entitlement, setEntitlement] = useState<EntitlementState>({
    plan: "free",
    dailyUsed: 0,
    dailyLimit: SESSION_MESSAGE_LIMIT,
  });
  const [currentSessionId, setCurrentSessionId] = useState<string>(makeSessionId());
  const [currentSessionCreatedAt, setCurrentSessionCreatedAt] = useState<number>(
    Date.now(),
  );
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
  const [sessionMenuOpen, setSessionMenuOpen] = useState(false);
  // 고친 문장 보기: 눌러서(기본) / 바로. 기기에 기억(lib/correctionView.ts).
  const [correctionView, setCorrectionView] = useState<CorrectionView>(DEFAULT_CORRECTION_VIEW);
  useEffect(() => {
    setCorrectionView(readCorrectionView());
  }, []);
  const chooseCorrectionView = (view: CorrectionView) => {
    setCorrectionView(view);
    writeCorrectionView(view);
  };
  const sessionMenuRef = useRef<HTMLDivElement>(null);
  const [sessionEnded, setSessionEnded] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);
  const [conversationMode, setConversationMode] =
    useState<ConversationMode>("native");
  const [reportTarget, setReportTarget] = useState<ReportTarget | null>(null);
  const partner = chatPartnerForLanguage(sessionLanguageCode);

  const dailyLimit = entitlement.dailyLimit ?? SESSION_MESSAGE_LIMIT;
  // Every plan but premium's old terms has a daily number (billing/plans.ts).
  const isChatDailyLimitReached =
    (!isPremium || entitlement.dailyLimit !== null) && entitlement.dailyUsed >= dailyLimit;
  const isChatInputBlocked = isChatDailyLimitReached;

  // 무료 한도에 닿았을 때 "광고 보고 채팅 더"(lib/ads.ts — 안드로이드·무료만, 보상은 서버가 확인).
  const [adOffer, setAdOffer] = useState<RewardOffer | null>(null);
  const [adState, setAdState] = useState<"idle" | "waiting" | "done" | "failed">("idle");
  useEffect(() => {
    if (!isChatDailyLimitReached || isPremium) {
      setAdOffer(null);
      return;
    }
    let cancelled = false;
    void rewardOffer().then((offer) => {
      if (!cancelled) setAdOffer(offer);
    });
    return () => {
      cancelled = true;
    };
  }, [isChatDailyLimitReached, isPremium]);
  useEffect(() => {
    if (adState !== "done" && adState !== "failed") return;
    const timer = window.setTimeout(() => setAdState("idle"), 5000);
    return () => window.clearTimeout(timer);
  }, [adState]);

  const openPaywall = useCallback((_reason?: string) => {
    billing.openBilling();
  }, [billing]);

  const refreshEntitlement = useCallback(async () => {
    try {
      const url = apiUrl("/api/entitlement");
      const response = await fetch(url, {
        headers: premiumRequestHeaders(isPremium),
      });
      // Costs nothing and is read off every answer: the server says on each one
      // whether this build has been left behind (lib/appUpdate.ts).
      noteUpdateLevel(response);
      if (!response.ok) {
        return;
      }
      const data = (await response.json()) as {
        plan?: Plan;
        dailyUsed?: number;
        dailyLimit?: number | null;
      };
      setEntitlement({
        plan: data.plan === "pro" ? "pro" : "free",
        dailyUsed: typeof data.dailyUsed === "number" ? data.dailyUsed : 0,
        dailyLimit:
          typeof data.dailyLimit === "number" || data.dailyLimit === null
            ? data.dailyLimit
            : SESSION_MESSAGE_LIMIT,
      });
    } catch {
      // keep current entitlement as fallback
    }
  }, [isPremium]);

  const [adGranted, setAdGranted] = useState(0);
  const watchAdForChats = async () => {
    if (adState === "waiting" || !adOffer) return;
    setAdState("waiting");
    const before = entitlement.dailyLimit;
    const result = await showRewardedForChats();
    if (result !== "shown") {
      setAdState("failed");
      return;
    }
    // 보상은 AdMob → 서버로 몇 초 뒤 도착한다. 중간에 닫았으면 늘지 않고 조용히 돌아온다.
    const limit = await waitForChatBonus(before);
    await refreshEntitlement();
    if (limit === null) {
      setAdState("idle");
      return;
    }
    setAdGranted(before === null ? adOffer.chats : limit - before);
    setAdState("done");
  };

  useEffect(() => {
    setSavedItems(loadSavedItems());
    const sessions = loadConversationSessions();
    setConversationSessions(sessions);
    setLearningCards(loadLearningCards());

    const resumable = findResumableSession(sessions, targetLanguage);
    setSessionLanguageCode(targetLanguage);
    if (resumable) {
      setCurrentSessionId(resumable.id);
      setCurrentSessionCreatedAt(resumable.createdAt);
      setTurns(fromSessionMessages(resumable.messages));
      setSessionEnded(false);
      persistActiveConversationId(targetLanguage, resumable.id);
    } else {
      setTurns([]);
      setCurrentSessionId(makeSessionId());
      setCurrentSessionCreatedAt(Date.now());
      setSessionEnded(false);
      persistActiveConversationId(targetLanguage, null);
    }

    void refreshEntitlement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshEntitlement]);

  useEffect(() => {
    if (isBillingReady) {
      void refreshEntitlement();
    }
  }, [isPremium, isBillingReady, refreshEntitlement]);

  useEffect(() => {
    if (!bookToast) {
      return;
    }
    const timer = window.setTimeout(() => setBookToast(null), 3800);
    return () => window.clearTimeout(timer);
  }, [bookToast]);

  useEffect(() => {
    const handleArchiveUpdated = () => {
      setSavedItems(loadSavedItems());
    };

    window.addEventListener("archiveUpdated", handleArchiveUpdated);
    return () => window.removeEventListener("archiveUpdated", handleArchiveUpdated);
  }, []);

  useEffect(() => {
    if (!currentSessionId) {
      return;
    }
    if (turns.length === 0) {
      return;
    }

    const session: ConversationSession = {
      id: currentSessionId,
      title: sessionTitleFromTurns(turns),
      createdAt: currentSessionCreatedAt,
      endedAt: sessionEnded ? Date.now() : undefined,
      messageCount: turns.length,
      messages: toSessionMessages(turns),
      languageCode: sessionLanguageCode,
    };

    saveConversationSession(session);
    if (!session.endedAt) {
      persistActiveConversationId(sessionLanguageCode, session.id);
    }
    setConversationSessions(loadConversationSessions());
  }, [
    turns,
    currentSessionId,
    currentSessionCreatedAt,
    sessionEnded,
    sessionLanguageCode,
  ]);

  // Learning-language workspaces are separate: switching target language
  // saves the current chat and opens that language's own conversation.
  const prevTargetLanguageRef = useRef(targetLanguage);
  useEffect(() => {
    if (prevTargetLanguageRef.current === targetLanguage) {
      return;
    }
    const previousLanguage = prevTargetLanguageRef.current;
    prevTargetLanguageRef.current = targetLanguage;

    if (turns.length > 0) {
      saveConversationSession({
        id: currentSessionId,
        title: sessionTitleFromTurns(turns),
        createdAt: currentSessionCreatedAt,
        endedAt: sessionEnded ? Date.now() : undefined,
        messageCount: turns.length,
        messages: toSessionMessages(turns),
        languageCode: previousLanguage,
      });
      if (!sessionEnded) {
        persistActiveConversationId(previousLanguage, currentSessionId);
      } else {
        persistActiveConversationId(previousLanguage, null);
      }
    }

    const sessions = loadConversationSessions();
    setConversationSessions(sessions);
    const resumable = findResumableSession(sessions, targetLanguage);
    setSessionLanguageCode(targetLanguage);
    setInput("");
    setIsChatHistoryOpen(false);

    if (resumable) {
      setCurrentSessionId(resumable.id);
      setCurrentSessionCreatedAt(resumable.createdAt);
      setTurns(fromSessionMessages(resumable.messages));
      setSessionEnded(false);
      persistActiveConversationId(targetLanguage, resumable.id);
    } else {
      setTurns([]);
      setCurrentSessionId(makeSessionId());
      setCurrentSessionCreatedAt(Date.now());
      setSessionEnded(false);
      persistActiveConversationId(targetLanguage, null);
    }
    // Intentionally keyed only on targetLanguage — workspace snapshot uses
    // current render values at the moment of the switch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetLanguage]);

  // 한도를 다 쓴 것만으로는 결제 화면을 띄우지 않는다: 채팅 창은 다른 탭에서도
  // 붙어 있어서, 앱을 열거나 탭을 바꿀 때마다 결제 화면이 다른 기능을 가렸다
  // (qa 2026-10-21). 결제 화면은 한도에서 보내려 할 때(handleSubmit)와 채팅 안
  // 안내 줄의 버튼으로만 연다.

  useEffect(() => {
    if (!sessionMenuOpen) return;
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (
        sessionMenuRef.current &&
        target &&
        !sessionMenuRef.current.contains(target)
      ) {
        setSessionMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [sessionMenuOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [turns, currentSessionId]);

  const sendChatMessage = async (
    message: string,
    imageDataUrl?: string,
    ownLanguage = false,
  ) => {
    const url = apiUrl("/api/chat");
    const headers = {
      "Content-Type": "application/json",
      ...premiumRequestHeaders(isPremium),
    };
    const requestBody = {
      message,
      mode: "chat",
      locale,
      interfaceLanguage: locale,
      targetLanguage: sessionLanguageCode,
      conversationMode,
      ...(imageDataUrl ? { imageDataUrl } : {}),
      ...(ownLanguage ? { ownLanguage: true } : {}),
      ...(practice ? { practice: practice.goal } : {}),
      recent: turns
        .flatMap((turn) => {
          const lines: string[] = [];
          if (turn.mode === "how_to_say" && turn.expressionResult?.expression) {
            lines.push(`me: ${turn.expressionResult.expression}`);
          } else if (turn.userMessage.trim() && turn.mode === "chat") {
            lines.push(`me: ${turn.userMessage.trim()}`);
          }
          if (turn.assistantMessage?.trim()) {
            lines.push(`other: ${turn.assistantMessage.trim()}`);
          }
          return lines;
        })
        .slice(-8),
    };

    const turnId = `${Date.now()}`;
    const showReply = (reply: { assistantMessage?: string; spokenReply?: string }) => {
      // The server reads this turn into the ledger after replying; look again
      // once it has, so a phrase just mastered says so.
      refreshLedgerSoon(sessionLanguageCode);
      setTurns((previous) => [
        ...previous,
        {
          id: turnId,
          mode: "chat",
          userMessage: message,
          assistantMessage: reply.assistantMessage?.trim() || "Yeah, go on.",
          spokenReply: reply.spokenReply?.trim() || undefined,
          translatedMessage:
            locale === sessionLanguageCode
              ? undefined
              : reply.spokenReply?.trim() || undefined,
          attachmentUrl: imageDataUrl,
          conversationMode,
          ...(ownLanguage ? { ownLanguage: true } : {}),
        },
      ]);
    };
    const applyCorrection = (correction: ChatModeApiResponse["correction"] | undefined) => {
      const correctionResult = normalizeCorrectionResult(message, correction, locale);
      setTurns((previous) =>
        previous.map((t) => (t.id === turnId ? { ...t, correctionResult } : t)),
      );
      // 짚인 줄은 이 기기에 그 순간 화면을 찍어 둔다 — 오늘의 학습에서 "화면 함께"로 노트에 붙일 수 있게(lib/notes/sceneShots.ts).
      if (!ownLanguage && correctionResult.hasError) captureSceneSoon(sessionLanguageCode, message);
      // "바로 보기"면 위험한 교정은 뒤에서 확인하고, 바뀌면 그 자리에서 고친다.
      if (correctionView === "auto" && !ownLanguage && correctionResult.hasError) {
        void verifyTurnCorrection(turnId, message, correctionResult);
      }
    };

    // 답을 먼저 띄우고, 교정(✎ 고친 문장)은 도착하면 붙는다(2026-10-22). 스트림이 안 되는 기기는 예전처럼 한 번에.
    if (chatStreamWorks) {
      let replied = false;
      try {
        let markReplied: () => void = () => {};
        const repliedSignal = new Promise<void>((resolve) => {
          markReplied = resolve;
        });
        const correctionArrives = postChatStream(url, headers, requestBody, (reply) => {
          replied = true;
          showReply(reply);
          markReplied();
        });
        // 답이 뜰 때까지만 기다린다 — 교정은 뒤에서.
        await Promise.race([repliedSignal, correctionArrives.then(() => undefined)]);
        void correctionArrives
          .then((correction) => {
            if (correction) applyCorrection(correction);
          })
          .catch(() => {});
        return;
      } catch (error) {
        if (replied) return;
        if (error instanceof ChatHttpError) {
          if (error.status === 403 && error.code === "DAILY_LIMIT_REACHED") {
            throw new Error("DAILY_LIMIT_REACHED");
          }
          throw new Error("Failed to get chat response.");
        }
        // 흘려 받기가 이 기기에서 안 됨(네트워크 층) — 이번 실행은 예전 방식으로.
        chatStreamWorks = false;
        console.error("[chat] streaming failed, falling back", error);
      }
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      if (response.status === 403) {
        const errorBody = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        if (errorBody.error === "DAILY_LIMIT_REACHED") {
          throw new Error("DAILY_LIMIT_REACHED");
        }
      }
      throw new Error("Failed to get chat response.");
    }

    const data = (await response.json()) as ChatModeApiResponse;
    showReply(data);
    applyCorrection(data.correction);
  };

  /** 확인 모델에 교정을 한 번 더(위험한 줄만 — 서버도 같은 규칙으로 다시 거른다). 끝나면 그 턴의 교정을 바꾼다. */
  const verifyTurnCorrection = async (
    turnId: string,
    original: string,
    result: CorrectionResult,
  ) => {
    const risk = correctionRisk({
      original,
      corrected: result.corrected,
      target: sessionLanguageCode,
      explanation: result.explanation,
    });
    if (!risk.risky) {
      setTurns((previous) =>
        previous.map((t) => (t.id === turnId ? { ...t, correctionVerified: true } : t)),
      );
      return;
    }
    setTurns((previous) =>
      previous.map((t) => (t.id === turnId ? { ...t, correctionChecking: true } : t)),
    );
    let next: CorrectionResult = result;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 9000);
      const response = await fetch(apiUrl("/api/chat/verify"), {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json", ...premiumRequestHeaders(isPremium) },
        body: JSON.stringify({
          original,
          corrected: result.corrected,
          explanation: result.explanation,
          targetLanguage: sessionLanguageCode,
          interfaceLanguage: locale,
          locale,
        }),
      });
      clearTimeout(timer);
      if (response.ok) {
        const data = (await response.json()) as {
          changed?: boolean;
          noError?: boolean;
          corrected?: string;
          explanation?: string;
        };
        if (data.noError) {
          next = { ...result, corrected: original, explanation: "", hasError: false };
        } else if (data.changed && data.corrected?.trim()) {
          next = {
            ...result,
            corrected: data.corrected.trim(),
            explanation: data.explanation?.trim() || result.explanation,
          };
        }
      }
    } catch {
      // 확인을 못 하면 싼 모델 교정 그대로.
    }
    setTurns((previous) =>
      previous.map((t) =>
        t.id === turnId
          ? { ...t, correctionResult: next, correctionChecking: false, correctionVerified: true }
          : t,
      ),
    );
  };

  /** 접힌 교정 열기: 아직 확인 전이면 확인하고 연다(기다림은 누른 뒤에만). */
  const openTurnCorrection = async (turn: ChatTurn) => {
    if (!turn.correctionResult || turn.correctionChecking) return;
    if (!turn.correctionVerified) {
      await verifyTurnCorrection(turn.id, turn.userMessage, turn.correctionResult);
    }
    setTurns((previous) =>
      previous.map((t) => (t.id === turn.id ? { ...t, correctionOpen: true } : t)),
    );
  };

  /**
   * How to say a line they wrote in their own language, fetched only when
   * they open it — so the conversation never waits on it — and kept on the
   * turn once fetched.
   */
  const openExpressionCard = async (turnId: string, message: string) => {
    const response = await fetch(apiUrl("/api/chat"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...premiumRequestHeaders(isPremium),
      },
      body: JSON.stringify({
        message,
        mode: "how_to_say",
        expressionOnly: true,
        locale,
        interfaceLanguage: locale,
        targetLanguage: sessionLanguageCode,
        // Only what came before this line: the tutor's reply to it would turn
        // "how do I say this" into "how do I answer that".
        recent: turns
          .slice(0, Math.max(0, turns.findIndex((turn) => turn.id === turnId)))
          .flatMap((turn) => [
            ...(turn.userMessage.trim() ? [`me: ${turn.userMessage.trim()}`] : []),
            ...(turn.assistantMessage?.trim() ? [`other: ${turn.assistantMessage.trim()}`] : []),
          ])
          .slice(-6),
      }),
    });
    // 오늘 AI 도움을 다 썼으면(서버 429 AI_HELP_LIMIT) 카드가 그 안내를 보인다.
    if (response.status === 429) throw new Error("AI_HELP_LIMIT");
    if (!response.ok) throw new Error("card failed");
    const data = (await response.json()) as ExpressionApiResponse;
    if (!data.expression?.trim()) throw new Error("empty card");
    setTurns((previous) =>
      previous.map((turn) =>
        turn.id === turnId ? { ...turn, expressionResult: data } : turn,
      ),
    );
  };


  const saveItemFromTurn = (item: SavedItem | null) => {
    if (!item) {
      return;
    }
    setSavedItems((previous) => {
      if (previous.some((saved) => saved.id === item.id)) {
        return previous;
      }
      const updated = [item, ...previous];
      persistSavedItems(updated);
      return updated;
    });
  };

  const saveLearningCardFromTurn = (turn: ChatTurn) => {
    const corrected =
      turn.mode === "how_to_say"
        ? turn.expressionResult?.expression
        : turn.correctionResult?.corrected;
    const explanation =
      turn.mode === "how_to_say"
        ? ""
        : turn.correctionResult?.explanation;

    const createdAt = Date.now();
    const newItem: LearningCard = {
      id: createdAt,
      original: turn.userMessage || "",
      corrected: corrected || "",
      explanation: explanation || "",
      languageCode: sessionLanguageCode,
      createdAt,
      savedAt: createdAt,
      status: "new",
      reviewCount: 0,
      lastReviewedAt: null,
    };

    if (turn.mode === "chat" && turn.correctionResult) {
      const { natural, corrected: corr, hasError } = turn.correctionResult;
      if (hasError && natural.trim() !== corr.trim()) {
        newItem.natural = natural.trim();
      }
    }

    try {
      const safeExisting = loadLearningCards();
      setLearningCards((prev) => {
        const base = prev.length > 0 ? prev : safeExisting;
        const updated = [...base, newItem];
        persistLearningCards(updated);
        setBookToast(ui.savedToBookToast.replace("{count}", String(updated.length)));
        return updated;
      });
    } catch (e) {
      console.error("Save error:", e);
    }
  };

  const startNewChat = () => {
    setPractice(null);
    setTurns([]);
    setInput("");
    setSessionEnded(false);
    setCurrentSessionId(makeSessionId());
    setCurrentSessionCreatedAt(Date.now());
    setSessionLanguageCode(targetLanguage);
    persistActiveConversationId(targetLanguage, null);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const snapshotCurrentChat = () => {
    if (turns.length === 0) {
      return;
    }
    saveConversationSession({
      id: currentSessionId,
      title: sessionTitleFromTurns(turns),
      createdAt: currentSessionCreatedAt,
      endedAt: undefined,
      messageCount: turns.length,
      messages: toSessionMessages(turns),
      languageCode: sessionLanguageCode,
    });
    persistActiveConversationId(sessionLanguageCode, currentSessionId);
    setConversationSessions(loadConversationSessions());
  };

  const openConversationSession = (session: ConversationSession) => {
    if (session.id !== currentSessionId) {
      snapshotCurrentChat();
    }

    const language = sessionLanguageOf(session);

    // Ended sessions stay in history — continue as a new session id.
    if (session.endedAt) {
      setCurrentSessionId(makeSessionId());
      setCurrentSessionCreatedAt(Date.now());
      setSessionLanguageCode(language);
      persistActiveConversationId(language, null);
    } else {
      setCurrentSessionId(session.id);
      setCurrentSessionCreatedAt(session.createdAt);
      setSessionLanguageCode(language);
      persistActiveConversationId(language, session.id);
    }
    setSessionEnded(false);
    setTurns(fromSessionMessages(session.messages));
    setInput("");
    setIsChatHistoryOpen(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const endCurrentSession = () => {
    // 대화를 끝내는 자리도 자연스러운 끝(채팅 몇 번 뒤에만, lib/ads.ts).
    void maybeShowInterstitial("chatLeave");
    if (turns.length === 0) {
      startNewChat();
      return;
    }

    const endedAt = Date.now();
    const messages = toSessionMessages(turns);
    saveConversationSession({
      id: currentSessionId,
      title: sessionTitleFromTurns(turns),
      createdAt: currentSessionCreatedAt,
      endedAt,
      messageCount: turns.length,
      messages,
      languageCode: sessionLanguageCode,
    });
    persistActiveConversationId(sessionLanguageCode, null);
    setConversationSessions(loadConversationSessions());
    setBookToast(ui.sessionSavedToHistoryToast);
    setIsChatHistoryOpen(false);
    startNewChat();
  };

  const handleAiStart = () => openConversation(null);

  /**
   * The tutor speaks first. With a practice goal it opens in the situation and
   * makes room for the phrases; either way an opening line is not a message
   * the learner sent, so it is not counted.
   */
  const openConversation = async (request: PracticeRequest | null, replacing = false) => {
    if (isSending || (!replacing && turns.length > 0)) return;
    setIsSending(true);
    try {
      const response = await fetch(apiUrl("/api/chat"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...premiumRequestHeaders(isPremium),
        },
        body: JSON.stringify({
          mode: "start",
          locale,
          interfaceLanguage: locale,
          targetLanguage: replacing ? targetLanguage : sessionLanguageCode,
          recent: [],
          ...(request ? { practice: request.goal } : {}),
        }),
      });
      if (!response.ok) {
        throw new Error("start failed");
      }
      const data = (await response.json()) as {
        assistantMessage?: string;
        spokenReply?: string;
      };
      const assistantMessage =
        data.assistantMessage?.trim() || "Hey — you been up to anything?";
      if (request) setPractice(request);
      setTurns([
        {
          id: `${Date.now()}`,
          mode: "chat",
          userMessage: "",
          assistantMessage,
          spokenReply: data.spokenReply?.trim() || undefined,
          translatedMessage:
            locale === sessionLanguageCode
              ? undefined
              : data.spokenReply?.trim() || undefined,
        },
      ]);
      requestAnimationFrame(() => inputRef.current?.focus());
    } catch {
      setBookToast(ui.chatStartFailed);
    } finally {
      setIsSending(false);
    }
  };

  /**
   * A conversation to practise something, asked for by "try this" or the map.
   * Whatever was on screen is kept in the history first, as ending a session
   * keeps it, and the new one starts with the tutor's opening line.
   */
  const startPractice = async (request: PracticeRequest) => {
    if (isSending) return;
    if (turns.length > 0) {
      saveConversationSession({
        id: currentSessionId,
        title: sessionTitleFromTurns(turns),
        createdAt: currentSessionCreatedAt,
        endedAt: Date.now(),
        messageCount: turns.length,
        messages: toSessionMessages(turns),
        languageCode: sessionLanguageCode,
      });
      setConversationSessions(loadConversationSessions());
    }
    startNewChat();
    await openConversation(request, true);
  };
  const startPracticeRef = useRef(startPractice);
  startPracticeRef.current = startPractice;
  useEffect(
    () =>
      onAppIntent("practice", (request) => {
        if (request.tab !== "chat") return;
        takeAppIntent("practice", (detail) => detail.tab === "chat");
        void startPracticeRef.current(request);
      }),
    [],
  );
  const practiceSaid = useMemo(() => {
    const said = new Set<string>();
    for (const phrase of practice?.goal.phrases ?? []) {
      if (turns.some((turn) => turn.userMessage && saidPhrase(turn.userMessage, phrase, sessionLanguageCode))) {
        said.add(phrase);
      }
    }
    return said;
  }, [practice, turns, sessionLanguageCode]);

  const handleSend = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    const photo = pendingPhoto;
    if ((!trimmed && !photo) || isSending) {
      return;
    }

    // One box for everything. A line in the language being learned is
    // practice; a line in their own language is something they could not say
    // yet — it goes to the conversation all the same, in one call, and how to
    // say it waits under the line as a card they open when they want it.
    const modeToUse: InputMode = "chat";
    const ownLanguage =
      Boolean(trimmed) &&
      !writtenInLearningLanguage(trimmed, sessionLanguageCode, locale);

    if (isChatDailyLimitReached) {
      openPaywall("PAYWALL_OPEN_LIMIT_REACHED");
      return;
    }

    const nextMode = detectConversationMode(trimmed);
    setConversationMode(nextMode);
    setIsSending(true);
    try {
      await sendChatMessage(trimmed, photo || undefined, ownLanguage);
      noteChatSent();
      await refreshEntitlement();
      setInput("");
      setPendingPhoto(null);
    } catch (error) {
      if (isDailyLimitReachedError(error)) {
        await refreshEntitlement();
        openPaywall("PAYWALL_OPEN_LIMIT_REACHED");
        return;
      }
      setTurns((previous) => [
        ...previous,
        {
          id: `${Date.now()}`,
          mode: modeToUse,
          userMessage: trimmed,
          attachmentUrl: photo || undefined,
          assistantMessage: ui.chatTempErrorReply,
          correctionResult: {
            corrected: trimmed,
            natural: trimmed,
            explanation: ui.chatTempErrorExplanation,
            hasError: true,
          },
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  // 이 대화가 시작된 뒤 건 AI 통화는 대화 안에 시간 순서대로 🗒 카드로(턴 id는 보낸 시각).
  const calls = useSyncExternalStore(subscribeCalls, readCalls, readCallsOnServer);
  const callsVersion = calls.reduce((latest, call) => Math.max(latest, call.updatedAt), 0);
  const timeline = useMemo(() => {
    const here = calls.filter((call) => call.language === sessionLanguageCode && call.startedAt >= currentSessionCreatedAt);
    const items: ({ kind: "turn"; at: number; turn: ChatTurn } | { kind: "call"; at: number; call: SavedConversation })[] = [
      ...turns.map((turn) => ({ kind: "turn" as const, at: Number.parseInt(turn.id, 10) || 0, turn })),
      ...here.map((call) => ({ kind: "call" as const, at: call.startedAt, call })),
    ];
    // 시각을 모르는 턴(옛 저장분)은 제자리에 둔다: 안정 정렬 + 통화만 시각으로 끼워 넣음.
    return here.length ? items.sort((a, b) => (a.at && b.at ? a.at - b.at : 0)) : items;
  }, [calls, turns, sessionLanguageCode, currentSessionCreatedAt]);

  const handlePickPhoto = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const dataUrl = await compressChatImage(file);
      setPendingPhoto(dataUrl);
    } catch {
      setBookToast(ui.chatStartFailed);
    }
  };

  return (
    <>
      <section
        className={`relative flex w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] ${
          tabMode ? "h-full max-w-none" : "h-[92vh] max-w-3xl"
        }`}
      >
        {/* 1:1 대화와 같은 머리(2026-10-23): ‹ 대화 · 튜터 · 📞 · ⋮. 모드 칩·세션 종료는 뺐다. */}
        <header className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-2 py-2">
          {back ? (
            <button
              type="button"
              onClick={back.onBack}
              className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-note text-slate-300 hover:bg-white/10"
            >
              <span aria-hidden className="rtl:rotate-180">‹</span>
              {back.label}
              {back.unread > 0 ? (
                <span className="ms-1 rounded-full bg-violet-500 px-1.5 text-meta font-semibold text-white">{Math.min(back.unread, 99)}</span>
              ) : null}
            </button>
          ) : null}
          <span className="flex min-w-0 flex-1 items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/flags/${partner.flagCountry}.png`} alt="" className="h-4 w-6 shrink-0 rounded-[2px] object-cover" />
            <span className="truncate text-body font-semibold text-ink">{partner.givenName}</span>
          </span>
          {onCall ? (
            <button
              type="button"
              onClick={onCall}
              aria-label={callLabel}
              title={callLabel}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-body hover:bg-white/10"
            >
              <span aria-hidden>📞</span>
            </button>
          ) : null}
          <div className="relative shrink-0" ref={sessionMenuRef}>
            <button
              type="button"
              aria-label={ui.sessionMenu}
              aria-expanded={sessionMenuOpen}
              onClick={() => setSessionMenuOpen((open) => !open)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-slate-200 hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
                <circle cx="12" cy="6" r="1.6" />
                <circle cx="12" cy="12" r="1.6" />
                <circle cx="12" cy="18" r="1.6" />
              </svg>
            </button>
            {sessionMenuOpen ? (
              <div className="absolute end-0 top-full z-30 mt-1 w-44 overflow-hidden rounded-xl border border-white/10 bg-[#121212] py-1 shadow-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setSessionMenuOpen(false);
                    endCurrentSession();
                  }}
                  className="block w-full px-3 py-2 text-start text-xs text-slate-100 hover:bg-white/10"
                >
                  {ui.chatHistoryNew}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSessionMenuOpen(false);
                    snapshotCurrentChat();
                    setConversationSessions(loadConversationSessions());
                    setIsChatHistoryOpen(true);
                  }}
                  className="block w-full px-3 py-2 text-start text-xs text-slate-100 hover:bg-white/10"
                >
                  {ui.chatHistoryTitle}
                </button>
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setSessionMenuOpen(false);
                      item.onSelect();
                    }}
                    className="block w-full px-3 py-2 text-start text-xs text-slate-100 hover:bg-white/10"
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setSessionMenuOpen(false);
                    setReportTarget({ surface: "chat", excerpt: "" });
                  }}
                  className="block w-full px-3 py-2 text-start text-xs text-slate-100 hover:bg-white/10"
                >
                  {ui.reportTitle}
                </button>
                <div className="border-t border-line px-3 py-2">
                  <p className="text-meta text-slate-400">{ui.chatCorrectionView}</p>
                  <div className="mt-1 flex flex-col gap-1" role="group" aria-label={ui.chatCorrectionView}>
                    {(["tap", "auto"] as const).map((view) => (
                      <button
                        key={view}
                        type="button"
                        aria-pressed={correctionView === view}
                        onClick={() => chooseCorrectionView(view)}
                        className={`rounded-lg px-2 py-1 text-start text-xs ${
                          correctionView === view
                            ? "bg-platinum text-slate-900"
                            : "text-slate-200 hover:bg-white/10"
                        }`}
                      >
                        {view === "tap" ? ui.chatCorrectionViewTap : ui.chatCorrectionViewAuto}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </header>

        <div className="flex-1 space-y-2 overflow-y-auto p-2.5 sm:space-y-4 sm:p-4">
          {isChatDailyLimitReached ? (
            <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-3 text-sm text-amber-100">
              <p className="leading-relaxed">
                {isPremium
                  ? ui.chatDailyUsedUp.replace("{limit}", String(dailyLimit))
                  : ui.paywallLimitBanner.replace("{limit}", String(dailyLimit))}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {!isPremium && adOffer ? (
                  <button
                    type="button"
                    disabled={adState === "waiting"}
                    onClick={() => void watchAdForChats()}
                    className="rounded-lg border border-amber-300/40 bg-amber-400/15 px-3 py-1.5 text-xs font-medium text-amber-100 hover:bg-amber-400/25 disabled:opacity-60"
                  >
                    {adState === "waiting"
                      ? ui.adRewardWaiting
                      : ui.adRewardCta.replace("{n}", String(adOffer.chats)).replace("{left}", String(adOffer.left))}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => openPaywall("PAYWALL_OPEN_LIMIT_REACHED")}
                  className="rounded-lg bg-[#e8e8e4] shadow-[0_0_12px_rgba(255,255,255,0.22)] px-3 py-1.5 text-xs font-medium text-neutral-900 hover:bg-[#f5f5f3]"
                >
                  {ui.upgradeCta}
                </button>
              </div>
            </div>
          ) : null}
          {adState === "failed" && isChatDailyLimitReached ? (
            <p className="px-1 text-xs text-amber-200">{ui.adRewardFailed}</p>
          ) : null}
          {adState === "done" && !isChatDailyLimitReached ? (
            <p className="px-1 text-xs text-emerald-300">{ui.adRewardDone.replace("{n}", String(adGranted))}</p>
          ) : null}
          {practice ? (
            <PracticeBanner
              ui={ui}
              request={practice}
              said={practiceSaid}
              targetLanguage={sessionLanguageCode}
              onStop={() => setPractice(null)}
            />
          ) : turns.length === 0 && !isSending ? (
            <>
            {showPack ? (
              <PackCard
                ui={ui}
                targetLanguage={targetLanguage}
                onStart={(request) => sendAppIntent("practice", request)}
                refreshKey={String(callsVersion)}
              />
            ) : null}
            <NextStepCard
              ui={ui}
              locale={locale}
              targetLanguage={targetLanguage}
              canCall={scenariosForLanguage(targetLanguage).length > 0}
              onStart={(request) => {
                if (request.tab === "chat") void startPractice(request);
                else sendAppIntent("practice", request);
              }}
            />
            </>
          ) : null}
          {timeline.map((item) => {
            if (item.kind === "call") {
              return <CallRecordCard key={`call-${item.call.id}`} call={item.call} ui={ui} locale={locale} />;
            }
            const turn = item.turn;
            const assistantReading =
              locale === sessionLanguageCode
                ? undefined
                : turn.spokenReply?.trim() ||
                  turn.translatedMessage?.trim() ||
                  undefined;
            const assistantLabels = {
              listen: ui.listen,
              analyze: ui.insightAnalyze,
              report: ui.reportContent,
              ...(assistantReading ? { reading: ui.chatReading } : {}),
            };

            const hasCorrection = Boolean(
              turn.mode === "chat" &&
                turn.correctionResult &&
                turn.correctionResult.hasError &&
                shouldShowCorrectionCard(turn.userMessage, turn.correctionResult),
            );
            return (
              <article key={turn.id} className="space-y-1.5 sm:space-y-2">
                {turn.callEvent?.kind === "ended" ? (
                  <p className="text-center text-[11px] text-slate-500">
                    {ui.chatCallEnded.replace(
                      "{duration}",
                      formatCallDuration(turn.callEvent.durationSeconds),
                    )}
                  </p>
                ) : null}
                {turn.userMessage.trim() || turn.attachmentUrl ? (
                  <MessageBubble
                    role="user"
                    message={turn.userMessage}
                    imageUrl={turn.attachmentUrl}
                    analyzeUserLine={
                      turn.mode === "chat" &&
                      writtenInLearningLanguage(
                        turn.userMessage,
                        sessionLanguageCode,
                        locale,
                      )
                    }
                    attachedEnglish={
                      turn.mode === "how_to_say"
                        ? turn.expressionResult?.expression
                        : undefined
                    }
                    correction={
                      hasCorrection && (correctionView === "auto" || turn.correctionOpen)
                        ? {
                            original: turn.userMessage,
                            corrected: turn.correctionResult!.corrected,
                          }
                        : undefined
                    }
                    correctionChip={
                      hasCorrection && correctionView === "tap" && !turn.correctionOpen
                        ? {
                            label: ui.chatCorrectionChip,
                            busyLabel: ui.chatCorrectionChecking,
                            busy: Boolean(turn.correctionChecking),
                            onOpen: () => void openTurnCorrection(turn),
                          }
                        : undefined
                    }
                    labels={{
                      listen: ui.listen,
                      analyze: ui.insightAnalyze,
                    }}
                  />
                ) : null}

                {/* Phrases in their sentence met in another tab, or just
                    mastered (hub/drafts/tab-connections.md). */}
                {turn.mode === "chat" && !turn.ownLanguage && turn.userMessage.trim() ? (
                  <div className="flex justify-end">
                    <LedgerLinks
                      ui={ui}
                      kind="mine"
                      masteredOnly
                      here="chat"
                      line={turn.correctionResult?.corrected?.trim() || turn.userMessage}
                      language={sessionLanguageCode}
                    />
                  </div>
                ) : null}

                {turn.ownLanguage && turn.userMessage.trim() ? (
                  <ExpressionPeek
                    ui={ui}
                    expression={turn.expressionResult}
                    onOpen={() => openExpressionCard(turn.id, turn.userMessage)}
                    onUse={(text) => {
                      setInput(text);
                      requestAnimationFrame(() => inputRef.current?.focus());
                    }}
                  />
                ) : null}

                {turn.mode === "chat" &&
                  turn.assistantMessage &&
                  !turn.correctionResult && (
                    <MessageBubble
                      role="assistant"
                      message={turn.assistantMessage}
                      reading={assistantReading}
                      labels={assistantLabels}
                      onReport={() =>
                        setReportTarget({
                          surface: "chat",
                          excerpt: turn.assistantMessage ?? "",
                        })
                      }
                    />
                  )}

                {turn.mode === "chat" &&
                  turn.correctionResult &&
                  turn.assistantMessage && (
                    <MessageBubble
                      role="assistant"
                      message={turn.assistantMessage}
                      reading={assistantReading}
                      labels={assistantLabels}
                      onReport={() =>
                        setReportTarget({
                          surface: "chat",
                          excerpt: turn.assistantMessage ?? "",
                        })
                      }
                    />
                  )}


                {turn.mode === "how_to_say" && turn.assistantMessage ? (
                  <MessageBubble
                    role="assistant"
                    message={turn.assistantMessage}
                    reading={assistantReading}
                    labels={assistantLabels}
                    onReport={() =>
                      setReportTarget({
                        surface: "chat",
                        excerpt: turn.assistantMessage ?? "",
                      })
                    }
                  />
                ) : null}
              </article>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={handleSend}
          className="sticky bottom-0 z-20 border-t border-white/10 bg-[#0a0a0a]/92 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md sm:p-4 sm:pb-4"
        >
          <>
            {pendingPhoto ? (
              <div className="mb-2 flex items-start gap-2">
                <img
                  src={pendingPhoto}
                  alt=""
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPendingPhoto(null)}
                  className="rounded-md border border-white/10 px-2 py-1 text-[11px] text-slate-300"
                >
                  {ui.chatRemovePhoto}
                </button>
              </div>
            ) : null}

            <div className="flex items-end gap-2">
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => void handlePickPhoto(event)}
              />
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                aria-label={ui.chatAttachPhoto}
                title={ui.chatAttachPhoto}
                className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-200 hover:bg-white/10"
              >
                +
              </button>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                rows={2}
                placeholder={roomCopy(locale).messagePlaceholder}
                aria-label={roomCopy(locale).messagePlaceholder}
                readOnly={isChatInputBlocked}
                onFocus={() => {
                  if (isChatInputBlocked) {
                    openPaywall("PAYWALL_OPEN_LIMIT_REACHED");
                  }
                }}
                className={`w-full resize-none rounded-xl border border-white/15 bg-[#101010] px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-white/40 ${
                  isChatInputBlocked ? "cursor-pointer" : ""
                }`}
                dir={learningLanguageTextDir(targetLanguage)}
              />
              <div className="flex shrink-0 flex-col items-stretch gap-1.5">
              {turns.length === 0 ? (
              <button
                type="button"
                disabled={isSending}
                onClick={() => void handleAiStart()}
                aria-label={ui.chatStartCta}
                title={ui.chatStartCta}
                className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  aria-hidden
                >
                  <rect
                    x="5"
                    y="7"
                    width="14"
                    height="11"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M12 4v3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="3.5" r="1.2" fill="currentColor" />
                  <circle cx="9.2" cy="12" r="1.2" fill="currentColor" />
                  <circle cx="14.8" cy="12" r="1.2" fill="currentColor" />
                  <path
                    d="M5 12H3.5M20.5 12H19"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              ) : null}
              <button
                type="submit"
                disabled={isSending}
                aria-label={isSending ? `${ui.send}...` : ui.send}
                onClick={(event) => {
                  if (isChatInputBlocked) {
                    event.preventDefault();
                    openPaywall("PAYWALL_OPEN_LIMIT_REACHED");
                  }
                }}
                className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl bg-[#e8e8e4] text-neutral-900 shadow-[0_0_16px_rgba(255,255,255,0.32)] transition hover:bg-[#f5f5f3] disabled:cursor-not-allowed disabled:bg-slate-600 disabled:shadow-none"
              >
                {isSending ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5 animate-spin"
                    aria-hidden
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeOpacity="0.25"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M21 12a9 9 0 0 0-9-9"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    aria-hidden
                  >
                    <path
                      d="M3.4 11.2 20.1 3.7a.8.8 0 0 1 1.1 1L14.3 20.6a.9.9 0 0 1-1.6.1l-3-5.3-5.4-2.9a.9.9 0 0 1 .1-1.6Z"
                      fill="currentColor"
                    />
                    <path
                      d="M9.8 15.4 20.6 4.5"
                      stroke="white"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </button>
              </div>
            </div>
          </>
        </form>
      </section>

      {bookToast ? (
        <div
          className="pointer-events-none fixed bottom-28 left-1/2 z-[70] max-w-[min(90vw,20rem)] -translate-x-1/2 px-4"
          role="status"
        >
          <div className="pointer-events-auto whitespace-pre-line rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-center text-sm leading-snug text-slate-100 shadow-lg">
            {bookToast}
          </div>
        </div>
      ) : null}

      <ChatHistoryPanel
        isOpen={isChatHistoryOpen}
        sessions={conversationSessions.filter(
          (s) =>
            s.messageCount > 0 &&
            sessionLanguageOf(s) === sessionLanguageCode,
        )}
        currentSessionId={currentSessionId}
        locale={locale}
        ui={ui}
        onClose={() => setIsChatHistoryOpen(false)}
        onOpenSession={openConversationSession}
        onDeleteSession={(id) => {
          if (id === currentSessionId) {
            return;
          }
          deleteConversationSession(id);
          setConversationSessions(loadConversationSessions());
        }}
        onClearSessions={() => {
          const keepCurrent =
            turns.length > 0
              ? conversationSessions.filter(
                  (s) =>
                    s.id === currentSessionId &&
                    sessionLanguageOf(s) === sessionLanguageCode,
                )
              : [];
          clearConversationSessionsForLanguage(sessionLanguageCode);
          for (const session of keepCurrent) {
            saveConversationSession(session);
          }
          persistActiveConversationId(
            sessionLanguageCode,
            keepCurrent[0]?.id ?? null,
          );
          setConversationSessions(loadConversationSessions());
        }}
        onStartNewChat={() => {
          snapshotCurrentChat();
          startNewChat();
        }}
        calls={calls
          .filter((call) => call.language === sessionLanguageCode)
          .map((call) => ({ id: call.id, title: call.title, at: call.startedAt }))}
        onOpenCall={(id) => {
          setIsChatHistoryOpen(false);
          sendAppIntent("openCall", { id });
        }}
        onDeleteCall={(id) => discardCall(id)}
      />

      {reportTarget ? (
        <ReportContentDialog
          ui={ui}
          locale={locale}
          learningLanguage={sessionLanguageCode}
          target={reportTarget}
          onClose={() => setReportTarget(null)}
          onSent={(ok) => setBookToast(ok ? ui.reportThanks : ui.reportFailed)}
        />
      ) : null}
    </>
  );
}
