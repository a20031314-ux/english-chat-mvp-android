"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  ARCHIVE_STORAGE_KEY,
  ChatMessage,
  ConversationSession,
  normalizeConversationSession,
  normalizeSavedItem,
  SavedItem,
} from "./ArchivePanel";
import { APP_LOCALE_STORAGE_KEY, isLocale, Locale } from "@/lib/copy";
import { useUiCopy } from "@/hooks/useUiCopy";
import {
  loadLearningCards,
  persistLearningCards,
  type LearningCard,
} from "@/lib/learningCards";
import { normalizeHowToSayExpression, type HowToSayExpression } from "@/lib/howToSay";
import { LanguageSelector } from "./LanguageSelector";
import { MessageBubble } from "./MessageBubble";
import { ChatHistoryPanel } from "./ChatHistoryPanel";
import { PaywallModal } from "./PaywallModal";
import { usePremium } from "@/contexts/PremiumContext";
import { useLearningLanguageOptional } from "@/contexts/LearningLanguageContext";
import { Capacitor } from "@capacitor/core";
import {
  FREE_DAILY_CHAT_LIMIT,
  PREMIUM_CLIENT_HEADER,
} from "@/lib/billing/config";
import { isLocalPlanDebugEnabled } from "@/lib/billing/billingService";
import { resolveChatInputMode } from "@/lib/inputLanguage";
import {
  alignCorrectionToGrammar,
  substantiveNorm,
} from "@/lib/correctionNorm";
import {
  DEFAULT_LEARNING_LANGUAGE_CODE,
  isLearningLanguageCode,
  type LearningLanguageCode,
} from "@/lib/learningLanguages";

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
  isTranslating?: boolean;
  /** From “use this expression” — continue chat without a grammar card */
  suppressCorrectionCard?: boolean;
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
  if (!isPremium) {
    return {};
  }
  return { [PREMIUM_CLIENT_HEADER]: "1" };
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

const FALLBACK_CORRECTION_EXPLANATION: Record<string, string> = {
  ko: "이 부분을 이렇게 고치면 더 자연스러워요.",
  en: "This wording is clearer and more natural.",
  es: "Esta forma suena más clara y natural.",
  ja: "こう直すとより自然です。",
  zh: "这样改会更自然。",
  vi: "Cách diễn đạt này tự nhiên hơn.",
  fr: "Cette formulation est plus naturelle.",
  pt: "Essa formulação fica mais natural.",
  id: "Susunan ini terdengar lebih natural.",
};

function normalizeCorrectionResult(
  originalMessage: string,
  correction: ChatModeApiResponse["correction"] | undefined,
  locale: string,
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
        ? (FALLBACK_CORRECTION_EXPLANATION[locale] ??
          FALLBACK_CORRECTION_EXPLANATION.ko)
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
    if (turn.userMessage.trim()) {
      messages.push({
        id: `${turn.id}-user`,
        role: "user",
        content: turn.userMessage,
        createdAt: Date.now(),
      });
    }

    if (turn.mode === "chat" && turn.assistantMessage) {
      messages.push({
        id: `${turn.id}-assistant`,
        role: "assistant",
        content: JSON.stringify({
          assistantMessage: turn.assistantMessage || "",
          spokenReply: turn.spokenReply || "",
          correctionResult: turn.correctionResult || null,
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
      try {
        const parsed = JSON.parse(message.content) as {
          assistantMessage?: string;
          spokenReply?: string;
          correctionResult?: CorrectionResult;
        };
        assistantMessage = parsed.assistantMessage || "";
        spokenReply = parsed.spokenReply || "";
        correctionResult = parsed.correctionResult;
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
  onLocaleChange?: (locale: Locale) => void;
};

export function ChatWindow({
  tabMode = false,
  locale: localeProp,
  onLocaleChange,
}: ChatWindowProps) {
  const { isPremium, isBillingReady, refreshPremium, setPremiumForUi } =
    usePremium();
  const learningLanguage = useLearningLanguageOptional();
  const targetLanguage =
    learningLanguage?.targetLanguage ?? DEFAULT_LEARNING_LANGUAGE_CODE;
  const [sessionLanguageCode, setSessionLanguageCode] =
    useState<LearningLanguageCode>(targetLanguage);
  const [localeState, setLocaleState] = useState<Locale>(() => {
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
  const setLocale = (next: Locale) => {
    if (onLocaleChange) {
      onLocaleChange(next);
    } else {
      setLocaleState(next);
    }
  };
  const ui = useUiCopy(locale);
  const [bookToast, setBookToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [chatModeOn, setChatModeOn] = useState(true);
  const [askExpressionOn, setAskExpressionOn] = useState(false);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
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
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string>(makeSessionId());
  const [currentSessionCreatedAt, setCurrentSessionCreatedAt] = useState<number>(
    Date.now(),
  );
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);

  const dailyLimit = entitlement.dailyLimit ?? SESSION_MESSAGE_LIMIT;
  const isChatDailyLimitReached =
    !isPremium && entitlement.dailyUsed >= dailyLimit;
  const isChatInputBlocked = isChatDailyLimitReached;

  const openPaywall = useCallback((_reason?: string) => {
    setIsPaywallOpen(true);
  }, []);

  const refreshEntitlement = useCallback(async () => {
    try {
      const url = apiUrl("/api/entitlement");
      const response = await fetch(url, {
        headers: premiumRequestHeaders(isPremium),
      });
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
    try {
      localStorage.setItem(APP_LOCALE_STORAGE_KEY, locale);
    } catch {
      // ignore
    }
  }, [locale]);

  useEffect(() => {
    setTurns((previous) =>
      previous.map((turn) =>
        turn.translatedMessage || turn.isTranslating
          ? { ...turn, translatedMessage: undefined, isTranslating: false }
          : turn,
      ),
    );
  }, [locale]);

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
    setChatModeOn(true);
    setAskExpressionOn(false);
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

  useEffect(() => {
    if (isChatDailyLimitReached) {
      openPaywall("PAYWALL_OPEN_LIMIT_REACHED");
    }
  }, [isChatDailyLimitReached, openPaywall]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [turns, currentSessionId]);

  const sendChatMessage = async (message: string) => {
    const url = apiUrl("/api/chat");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...premiumRequestHeaders(isPremium),
      },
      body: JSON.stringify({
        message,
        mode: "chat",
        locale,
        interfaceLanguage: locale,
        targetLanguage: sessionLanguageCode,
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
      }),
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
    const correctionResult = normalizeCorrectionResult(
      message,
      data.correction,
      locale,
    );

    setTurns((previous) => [
      ...previous,
      {
        id: `${Date.now()}`,
        mode: "chat",
        userMessage: message,
        assistantMessage:
          data.assistantMessage?.trim() || "Yeah, go on.",
        spokenReply: data.spokenReply?.trim() || undefined,
        translatedMessage:
          locale === "en"
            ? undefined
            : data.spokenReply?.trim() || undefined,
        correctionResult,
      },
    ]);
  };

  const fetchExpressionResult = async (message: string) => {
    const url = apiUrl("/api/chat");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...premiumRequestHeaders(isPremium),
      },
      body: JSON.stringify({
        message,
        mode: "how_to_say",
        locale,
        interfaceLanguage: locale,
        targetLanguage: sessionLanguageCode,
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
      }),
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
      throw new Error("Failed to get expression response.");
    }

    const data = (await response.json()) as ExpressionApiResponse;
    const expressionResult = normalizeHowToSayExpression(message, data);
    const spokenEnglish = expressionResult.expression;
    const correctionResult = data.correction
      ? normalizeCorrectionResult(spokenEnglish, data.correction, locale)
      : undefined;

    setTurns((previous) => [
      ...previous,
      {
        id: `${Date.now()}`,
        mode: "how_to_say",
        userMessage: message,
        expressionResult,
        assistantMessage:
          data.assistantMessage?.trim() || "Yeah, go on.",
        spokenReply: data.spokenReply?.trim() || undefined,
        translatedMessage:
          locale === "en"
            ? undefined
            : data.spokenReply?.trim() || undefined,
        correctionResult,
        suppressCorrectionCard: true,
      },
    ]);
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

  const translateAssistantMessage = async (turnId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed || locale === "en") {
      return;
    }

    setTurns((previous) =>
      previous.map((turn) =>
        turn.id === turnId
          ? { ...turn, isTranslating: true }
          : turn,
      ),
    );

    try {
      const nearby = turns
        .flatMap((turn) =>
          [turn.userMessage, turn.assistantMessage].filter(
            (line): line is string => Boolean(line?.trim()),
          ),
        )
        .slice(-6);
      const response = await fetch(apiUrl("/api/translate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: trimmed,
          locale,
          interfaceLanguage: locale,
          targetLanguage: sessionLanguageCode,
          sourceType: "conversation",
          context: nearby,
        }),
      });
      if (!response.ok) {
        throw new Error("translate failed");
      }
      const data = (await response.json()) as { translated?: string };
      const translated = data.translated?.trim() || "";
      if (!translated) {
        throw new Error("empty translation");
      }
      setTurns((previous) =>
        previous.map((turn) =>
          turn.id === turnId
            ? { ...turn, translatedMessage: translated, isTranslating: false }
            : turn,
        ),
      );
    } catch {
      setTurns((previous) =>
        previous.map((turn) =>
          turn.id === turnId ? { ...turn, isTranslating: false } : turn,
        ),
      );
      setBookToast(ui.translateFailed);
    }
  };

  const allModesOn = chatModeOn && askExpressionOn;

  const toggleAllModes = () => {
    const next = !allModesOn;
    setChatModeOn(next);
    setAskExpressionOn(next);
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

  const toggleChatMode = () => {
    setChatModeOn((prev) => {
      if (prev && !askExpressionOn) return true;
      return !prev;
    });
  };

  const toggleAskExpression = () => {
    setAskExpressionOn((prev) => {
      if (prev && !chatModeOn) return true;
      return !prev;
    });
  };

  const startNewChat = () => {
    setTurns([]);
    setInput("");
    setChatModeOn(true);
    setAskExpressionOn(false);
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
    setChatModeOn(true);
    setAskExpressionOn(false);
    setInput("");
    setIsChatHistoryOpen(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const endCurrentSession = () => {
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

  const handleAiStart = async () => {
    if (isSending || turns.length > 0) return;
    setChatModeOn(true);
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
          targetLanguage: sessionLanguageCode,
          recent: [],
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
      setTurns([
        {
          id: `${Date.now()}`,
          mode: "chat",
          userMessage: "",
          assistantMessage,
          spokenReply: data.spokenReply?.trim() || undefined,
          translatedMessage:
            locale === "en"
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

  const handleSend = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) {
      return;
    }

    const modeToUse = resolveChatInputMode(trimmed, {
      chatEnabled: chatModeOn,
      askExpressionEnabled: askExpressionOn,
      locale,
    });

    if (isChatDailyLimitReached) {
      openPaywall("PAYWALL_OPEN_LIMIT_REACHED");
      return;
    }

    setIsSending(true);
    try {
      if (modeToUse === "how_to_say") {
        await fetchExpressionResult(trimmed);
      } else {
        await sendChatMessage(trimmed);
      }
      await refreshEntitlement();
      setInput("");
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
          ...(modeToUse === "how_to_say"
            ? {
                expressionResult: {
                  expression: trimmed,
                  example: "Please try again later.",
                },
              }
            : {
                assistantMessage: "지금 처리에 문제가 있었어요.",
                correctionResult: {
                  corrected: trimmed,
                  natural: trimmed,
                  explanation: "일시적인 오류입니다. 잠시 후 다시 시도해 주세요.",
                  hasError: true,
                },
              }),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <section
        className={`flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200 shadow-lg ${
          tabMode ? "h-full max-w-none bg-slate-50" : "h-[92vh] max-w-3xl bg-slate-50"
        }`}
      >
        <header className="border-b border-slate-200 bg-white px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {!tabMode ? (
              <button
                type="button"
                onClick={() => {
                  snapshotCurrentChat();
                  setConversationSessions(loadConversationSessions());
                  setIsChatHistoryOpen(true);
                }}
                aria-label={ui.chatHistoryTitle}
                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
              >
                ☰
              </button>
            ) : (
              <div className="shrink-0">
                <LanguageSelector locale={locale} onChange={setLocale} />
              </div>
            )}

            <div className="min-w-0 flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 md:justify-start">
                <p className="text-[11px] text-slate-500 sm:text-xs">
                  {isPremium
                    ? ui.planPremium
                    : ui.planFree
                        .replace("{used}", String(entitlement.dailyUsed))
                        .replace("{limit}", String(dailyLimit))}
                </p>
                {isLocalPlanDebugEnabled() ? (
                  <div className="flex overflow-hidden rounded-full border border-slate-200 text-[10px] font-medium">
                    <button
                      type="button"
                      onClick={() => setPremiumForUi(false)}
                      className={`px-2 py-0.5 ${
                        !isPremium
                          ? "bg-slate-900 text-white"
                          : "bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      무료
                    </button>
                    <button
                      type="button"
                      onClick={() => setPremiumForUi(true)}
                      className={`px-2 py-0.5 ${
                        isPremium
                          ? "bg-slate-900 text-white"
                          : "bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      프리미엄
                    </button>
                  </div>
                ) : !isPremium ? (
                  <button
                    type="button"
                    onClick={() => openPaywall()}
                    className="shrink-0 rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-medium text-white shadow-sm hover:bg-slate-800 sm:text-[11px]"
                  >
                    {ui.upgradeCta}
                  </button>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <button
                type="button"
                onClick={endCurrentSession}
                className="rounded-full border border-teal-600 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 hover:bg-teal-100"
              >
                {ui.endSession}
              </button>
              <button
                type="button"
                onClick={() => {
                  snapshotCurrentChat();
                  setConversationSessions(loadConversationSessions());
                  setIsChatHistoryOpen(true);
                }}
                className="rounded-full border border-teal-600 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 hover:bg-teal-100"
              >
                {ui.chatHistoryTitle}
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 space-y-2 overflow-y-auto p-2.5 sm:space-y-4 sm:p-4">
          {isChatDailyLimitReached ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-950">
              <p className="leading-relaxed">{ui.paywallLimitBanner}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {turns.length > 0 ? (
                  <button
                    type="button"
                    onClick={endCurrentSession}
                    className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-950 hover:bg-amber-100"
                  >
                    {ui.endSession}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => openPaywall("PAYWALL_OPEN_LIMIT_REACHED")}
                  className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                >
                  {ui.upgradeCta}
                </button>
              </div>
            </div>
          ) : null}
          {turns.map((turn) => {

            return (
              <article key={turn.id} className="space-y-1.5 sm:space-y-2">
                {turn.userMessage.trim() ? (
                  <MessageBubble
                    role="user"
                    message={turn.userMessage}
                    attachedEnglish={
                      turn.mode === "how_to_say"
                        ? turn.expressionResult?.expression
                        : undefined
                    }
                    correction={
                      turn.mode === "chat" &&
                      turn.correctionResult &&
                      turn.correctionResult.hasError &&
                      shouldShowCorrectionCard(
                        turn.userMessage,
                        turn.correctionResult,
                      )
                        ? {
                            original: turn.userMessage,
                            corrected: turn.correctionResult.corrected,
                          }
                        : undefined
                    }
                    labels={{
                      listen: ui.listen,
                    }}
                  />
                ) : null}

                {turn.mode === "chat" &&
                  turn.assistantMessage &&
                  !turn.correctionResult && (
                    <MessageBubble
                      role="assistant"
                      message={turn.assistantMessage}
                      translatedMessage={turn.translatedMessage}
                      isTranslating={turn.isTranslating}
                      labels={{
                        listen: ui.listen,
                        translate: ui.translate,
                        translating: ui.translating,
                        translation: ui.translation,
                      }}
                      onTranslate={
                        locale === "en"
                          ? undefined
                          : () =>
                              void translateAssistantMessage(
                                turn.id,
                                turn.assistantMessage || "",
                              )
                      }
                    />
                  )}

                {turn.mode === "chat" &&
                  turn.correctionResult &&
                  turn.assistantMessage && (
                    <MessageBubble
                      role="assistant"
                      message={turn.assistantMessage}
                      translatedMessage={turn.translatedMessage}
                      isTranslating={turn.isTranslating}
                      labels={{
                        listen: ui.listen,
                        translate: ui.translate,
                        translating: ui.translating,
                        translation: ui.translation,
                      }}
                      onTranslate={
                        locale === "en"
                          ? undefined
                          : () =>
                              void translateAssistantMessage(
                                turn.id,
                                turn.assistantMessage || "",
                              )
                      }
                    />
                  )}

                {turn.mode === "how_to_say" && turn.assistantMessage ? (
                  <MessageBubble
                    role="assistant"
                    message={turn.assistantMessage}
                    translatedMessage={turn.translatedMessage}
                    isTranslating={turn.isTranslating}
                    labels={{
                      listen: ui.listen,
                      translate: ui.translate,
                      translating: ui.translating,
                      translation: ui.translation,
                    }}
                    onTranslate={
                      locale === "en"
                        ? undefined
                        : () =>
                            void translateAssistantMessage(
                              turn.id,
                              turn.assistantMessage || "",
                            )
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
          className="sticky bottom-0 z-20 border-t border-slate-200 bg-white p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:p-4 sm:pb-4"
        >
          <>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={toggleAllModes}
                aria-label={`${ui.chatMode}, ${ui.askExpression}`}
                aria-pressed={allModesOn}
                title={`${ui.chatMode} · ${ui.askExpression}`}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition ${
                  allModesOn
                    ? "bg-teal-500 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                  aria-hidden
                >
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="9" cy="7" r="2" fill="currentColor" />
                  <circle cx="15" cy="12" r="2" fill="currentColor" />
                  <circle cx="11" cy="17" r="2" fill="currentColor" />
                </svg>
              </button>
              <button
                type="button"
                onClick={toggleChatMode}
                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                  chatModeOn
                    ? "bg-teal-500 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
                aria-pressed={chatModeOn}
              >
                {ui.chatMode}
              </button>
              <button
                type="button"
                onClick={toggleAskExpression}
                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                  askExpressionOn
                    ? "bg-teal-500 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
                aria-pressed={askExpressionOn}
              >
                {ui.askExpression}
              </button>
              <span
                className="ml-1 inline-flex items-center gap-2 text-[10px] text-slate-500"
                aria-hidden
              >
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-[2px] bg-teal-500" />
                  {ui.toggleLegendOn}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-[2px] border border-slate-300 bg-white" />
                  {ui.toggleLegendOff}
                </span>
              </span>
            </div>

            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                rows={2}
                readOnly={isChatInputBlocked}
                onFocus={() => {
                  if (isChatInputBlocked) {
                    openPaywall("PAYWALL_OPEN_LIMIT_REACHED");
                  }
                }}
                className={`w-full resize-none rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-500 ${
                  isChatInputBlocked ? "cursor-pointer bg-slate-50" : ""
                }`}
              />
              <div className="flex shrink-0 flex-col items-stretch gap-1.5">
              {turns.length === 0 ? (
              <button
                type="button"
                disabled={isSending}
                onClick={() => void handleAiStart()}
                aria-label={ui.chatStartCta}
                title={ui.chatStartCta}
                className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
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
          className="pointer-events-none fixed bottom-6 left-1/2 z-[70] max-w-[min(90vw,20rem)] -translate-x-1/2 px-4"
          role="status"
        >
          <div className="pointer-events-auto whitespace-pre-line rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm leading-snug text-slate-800 shadow-lg">
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
      />

      <PaywallModal
        isOpen={isPaywallOpen}
        locale={locale}
        ui={ui}
        onClose={() => setIsPaywallOpen(false)}
        onPremiumActivated={(message) => {
          setBookToast(message);
          void refreshPremium();
          void refreshEntitlement();
        }}
        onInfoToast={(message) => setBookToast(message)}
      />
    </>
  );
}
