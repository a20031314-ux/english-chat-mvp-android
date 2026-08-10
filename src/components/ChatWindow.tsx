"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  ARCHIVE_STORAGE_KEY,
  ChatMessage,
  ConversationSession,
  SavedItem,
} from "./ArchivePanel";
import { APP_LOCALE_STORAGE_KEY, copy, isLocale, Locale } from "@/lib/copy";
import {
  loadLearningCards,
  persistLearningCards,
  type LearningCard,
} from "@/lib/learningCards";
import {
  buildSessionReport,
  clearSessionReports,
  deleteSessionReport,
  loadSessionReports,
  migrateSessionsToReports,
  saveSessionReport,
  type SessionReport,
} from "@/lib/sessionReports";
import { seedDemoMonthlyReports } from "@/lib/seedDemoMonthlyReports";
import { CorrectionCard } from "./CorrectionCard";
import { HowToSayCard } from "./HowToSayCard";
import { LanguageSelector } from "./LanguageSelector";
import { MessageBubble } from "./MessageBubble";
import { MonthlyReportPage } from "./MonthlyReportPage";
import { ChatHistoryPanel } from "./ChatHistoryPanel";
import { ReportPanel } from "./ReportPanel";
import { SessionReportView } from "./SessionReportView";
import { VocabWordPreview } from "./VocabWordPreview";
import { PaywallModal } from "./PaywallModal";
import { usePremium } from "@/contexts/PremiumContext";
import { Capacitor } from "@capacitor/core";
import type { YearMonth } from "@/lib/monthlyReports";
import {
  FREE_DAILY_CHAT_LIMIT,
  PREMIUM_CLIENT_HEADER,
} from "@/lib/billing/config";
import { prepareQuizAfterReport } from "@/lib/quizService";
import { resolveChatInputMode } from "@/lib/inputLanguage";
import {
  isWordSaved,
  loadVocabulary,
  persistVocabulary,
  saveVocabularyWords,
  type VocabularyEntry,
  type VocabLookupResult,
} from "@/lib/vocabulary";

type CorrectionResult = {
  corrected: string;
  natural: string;
  explanation: string;
  hasError: boolean;
};

type ExpressionResult = {
  expression: string;
  example: string;
};

type InputMode = "chat" | "how_to_say";

type ChatTurn = {
  id: string;
  mode: InputMode;
  userMessage: string;
  assistantMessage?: string;
  correctionResult?: CorrectionResult;
  expressionResult?: ExpressionResult;
  translatedMessage?: string;
  isTranslating?: boolean;
  /** From “use this expression” — continue chat without a grammar card */
  suppressCorrectionCard?: boolean;
};

type ChatModeApiResponse = {
  assistantMessage: string;
  correction: {
    corrected: string;
    natural: string;
    explanation: string;
  };
};

type ExpressionApiResponse = {
  expression: string;
  example: string;
};

const SESSION_MESSAGE_LIMIT = FREE_DAILY_CHAT_LIMIT;

function premiumRequestHeaders(isPremium: boolean): HeadersInit {
  if (!isPremium) {
    return {};
  }
  return { [PREMIUM_CLIENT_HEADER]: "1" };
}
const CONVERSATION_SESSIONS_KEY = "conversationSessions";
const CHAT_CARDS_VISIBLE_KEY = "chatCardsVisible";
const VOCAB_CHECK_ON_KEY = "chatVocabCheckOn";
const VERCEL_FALLBACK_API_BASE = "https://english-chat-mvp.vercel.app";

function loadChatCardsVisible(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = window.localStorage.getItem(CHAT_CARDS_VISIBLE_KEY);
    if (raw === null) return true;
    return raw !== "0";
  } catch {
    return true;
  }
}

function persistChatCardsVisible(visible: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CHAT_CARDS_VISIBLE_KEY, visible ? "1" : "0");
  } catch {
    // ignore
  }
}

function loadVocabCheckOn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(VOCAB_CHECK_ON_KEY) === "1";
  } catch {
    return false;
  }
}

function persistVocabCheckOn(on: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(VOCAB_CHECK_ON_KEY, on ? "1" : "0");
  } catch {
    // ignore
  }
}

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

type MainView =
  | { type: "chat" }
  | { type: "monthlyReport"; ym: YearMonth; returnPanel?: boolean }
  | { type: "sessionReport"; reportId: string; returnPanel?: boolean };

type HistoryState = {
  talkbankMainView?: MainView;
};

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

/** Compare meaning-bearing text; ignore case, spacing, punctuation, and contractions. */
function expandContractions(text: string) {
  return text
    .replace(/\bI'm\b/gi, "I am")
    .replace(/\byou're\b/gi, "you are")
    .replace(/\bhe's\b/gi, "he is")
    .replace(/\bshe's\b/gi, "she is")
    .replace(/\bit's\b/gi, "it is")
    .replace(/\bwe're\b/gi, "we are")
    .replace(/\bthey're\b/gi, "they are")
    .replace(/\bI've\b/gi, "I have")
    .replace(/\byou've\b/gi, "you have")
    .replace(/\bwe've\b/gi, "we have")
    .replace(/\bthey've\b/gi, "they have")
    .replace(/\bI'll\b/gi, "I will")
    .replace(/\byou'll\b/gi, "you will")
    .replace(/\bhe'll\b/gi, "he will")
    .replace(/\bshe'll\b/gi, "she will")
    .replace(/\bwe'll\b/gi, "we will")
    .replace(/\bthey'll\b/gi, "they will")
    .replace(/\bI'd\b/gi, "I would")
    .replace(/\byou'd\b/gi, "you would")
    .replace(/\bhe'd\b/gi, "he would")
    .replace(/\bshe'd\b/gi, "she would")
    .replace(/\bwe'd\b/gi, "we would")
    .replace(/\bthey'd\b/gi, "they would")
    .replace(/\bisn't\b/gi, "is not")
    .replace(/\baren't\b/gi, "are not")
    .replace(/\bwasn't\b/gi, "was not")
    .replace(/\bweren't\b/gi, "were not")
    .replace(/\bdon't\b/gi, "do not")
    .replace(/\bdoesn't\b/gi, "does not")
    .replace(/\bdidn't\b/gi, "did not")
    .replace(/\bcan't\b/gi, "cannot")
    .replace(/\bcannot\b/gi, "cannot")
    .replace(/\bwon't\b/gi, "will not")
    .replace(/\bwouldn't\b/gi, "would not")
    .replace(/\bcouldn't\b/gi, "could not")
    .replace(/\bshouldn't\b/gi, "should not")
    .replace(/\bhaven't\b/gi, "have not")
    .replace(/\bhasn't\b/gi, "has not")
    .replace(/\bhadn't\b/gi, "had not")
    .replace(/\blet's\b/gi, "let us")
    .replace(/\bthat's\b/gi, "that is")
    .replace(/\bwhat's\b/gi, "what is")
    .replace(/\bthere's\b/gi, "there is")
    .replace(/\bhere's\b/gi, "here is");
}

function substantiveNorm(text: string) {
  return expandContractions(text)
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeCorrectionResult(
  originalMessage: string,
  correction: ChatModeApiResponse["correction"] | undefined,
  locale: string,
): CorrectionResult {
  const corrected = correction?.corrected?.trim() || originalMessage;
  const natural = correction?.natural?.trim() || corrected;
  const rawExplanation = stripExplanationLabel(
    correction?.explanation?.trim() || "",
  );
  const explanation = isPlaceholderExplanation(rawExplanation)
    ? ""
    : rawExplanation;

  const hasError =
    substantiveNorm(corrected) !== substantiveNorm(originalMessage);

  return {
    corrected: hasError ? corrected : originalMessage.trim(),
    natural,
    explanation:
      hasError && !explanation
        ? (FALLBACK_CORRECTION_EXPLANATION[locale] ??
          FALLBACK_CORRECTION_EXPLANATION.ko)
        : hasError
          ? explanation
          : "",
    hasError,
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
    const parsed = JSON.parse(raw) as SavedItem[];
    return Array.isArray(parsed) ? parsed : [];
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
    const parsed = JSON.parse(raw) as ConversationSession[];
    return Array.isArray(parsed) ? parsed : [];
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

function deleteConversationSession(id: string) {
  if (typeof window === "undefined") {
    return;
  }
  const next = loadConversationSessions().filter((session) => session.id !== id);
  window.localStorage.setItem(CONVERSATION_SESSIONS_KEY, JSON.stringify(next));
}

function clearConversationSessions() {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(CONVERSATION_SESSIONS_KEY, JSON.stringify([]));
}

function toSessionMessages(turns: ChatTurn[]): ChatMessage[] {
  return turns.flatMap((turn) => {
    const userMessage: ChatMessage = {
      id: `${turn.id}-user`,
      role: "user",
      content: turn.userMessage,
      createdAt: Date.now(),
    };

    if (turn.mode === "chat") {
      const assistantPayload = {
        assistantMessage: turn.assistantMessage || "",
        correctionResult: turn.correctionResult || null,
      };
      return [
        userMessage,
        {
          id: `${turn.id}-assistant`,
          role: "assistant",
          content: JSON.stringify(assistantPayload),
          createdAt: Date.now(),
        },
      ];
    }

    if (turn.expressionResult) {
      return [
        userMessage,
        {
          id: `${turn.id}-helper`,
          role: "helper",
          content: JSON.stringify({ expressionResult: turn.expressionResult }),
          createdAt: Date.now(),
        },
      ];
    }

    return [userMessage];
  });
}

function fromSessionMessages(messages: ChatMessage[]): ChatTurn[] {
  const turns: ChatTurn[] = [];
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
      let correctionResult: CorrectionResult | undefined;
      try {
        const parsed = JSON.parse(message.content) as {
          assistantMessage?: string;
          correctionResult?: CorrectionResult;
        };
        assistantMessage = parsed.assistantMessage || "";
        correctionResult = parsed.correctionResult;
      } catch {
        assistantMessage = message.content;
      }

      turns.push({
        id: pendingUser.id.replace("-user", ""),
        mode: "chat",
        userMessage: pendingUser.content,
        assistantMessage,
        correctionResult,
      });
      pendingUser = null;
      continue;
    }

    if (message.role === "helper") {
      let expressionResult: ExpressionResult = {
        expression: pendingUser.content,
        example: "",
      };
      try {
        const parsed = JSON.parse(message.content) as {
          expressionResult?: ExpressionResult;
        };
        if (parsed.expressionResult) {
          expressionResult = {
            expression: parsed.expressionResult.expression,
            example: parsed.expressionResult.example,
          };
        }
      } catch {
        expressionResult = {
          expression: message.content,
          example: "",
        };
      }

      turns.push({
        id: pendingUser.id.replace("-user", ""),
        mode: "how_to_say",
        userMessage: pendingUser.content,
        expressionResult,
      });
      pendingUser = null;
    }
  }

  return turns;
}

function buildCorrectionSavedItem(turn: ChatTurn): SavedItem | null {
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
    createdAt: Date.now(),
  };
}

function buildExpressionSavedItem(turn: ChatTurn): SavedItem | null {
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
    createdAt: Date.now(),
  };
}

type ChatWindowProps = {
  /** Home-tab embedding: hide report side nav; report opens via parent tabs. */
  tabMode?: boolean;
  locale?: Locale;
  onLocaleChange?: (locale: Locale) => void;
  onSessionReportCreated?: (report: SessionReport) => void;
  onBackToHome?: () => void;
};

export function ChatWindow({
  tabMode = false,
  locale: localeProp,
  onLocaleChange,
  onSessionReportCreated,
  onBackToHome,
}: ChatWindowProps) {
  const { isPremium, isBillingReady, refreshPremium } = usePremium();
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
  const ui = copy[locale];
  const [bookToast, setBookToast] = useState<string | null>(null);
  const [vocabPickMode, setVocabPickMode] = useState(false);
  const [vocabEntries, setVocabEntries] = useState<VocabularyEntry[]>([]);
  const [previewWord, setPreviewWord] = useState<string | null>(null);
  const [previewDetail, setPreviewDetail] = useState<VocabLookupResult | null>(
    null,
  );
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewLoadFailed, setPreviewLoadFailed] = useState(false);
  const [isVocabSaving, setIsVocabSaving] = useState(false);
  const [reportConfirmOpen, setReportConfirmOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const previewRequestIdRef = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [chatModeOn, setChatModeOn] = useState(true);
  const [askExpressionOn, setAskExpressionOn] = useState(false);
  const [showChatCards, setShowChatCards] = useState(true);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [, setLearningCards] = useState<LearningCard[]>([]);
  const [conversationSessions, setConversationSessions] = useState<ConversationSession[]>(
    [],
  );
  const [sessionReports, setSessionReports] = useState<SessionReport[]>([]);
  const [mainView, setMainView] = useState<MainView>({ type: "chat" });
  const mainViewRef = useRef<MainView>({ type: "chat" });
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
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);

  const dailyLimit = entitlement.dailyLimit ?? SESSION_MESSAGE_LIMIT;
  const isChatDailyLimitReached =
    !isPremium && entitlement.dailyUsed >= dailyLimit;
  const isChatInputBlocked =
    chatModeOn && !askExpressionOn && isChatDailyLimitReached;

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
    mainViewRef.current = mainView;
  }, [mainView]);

  const pushMainView = useCallback((next: MainView) => {
    if (typeof window !== "undefined") {
      window.history.pushState(
        { talkbankMainView: next } satisfies HistoryState,
        "",
      );
    }
    setMainView(next);
    setIsArchiveOpen(false);
  }, []);

  const goBackMainView = useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
      return;
    }
    setMainView({ type: "chat" });
  }, []);

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const prev = mainViewRef.current;
      const next =
        (event.state as HistoryState | null)?.talkbankMainView ??
        ({ type: "chat" } as const);
      setMainView(next);
      if (
        next.type === "chat" &&
        (prev.type === "sessionReport" || prev.type === "monthlyReport") &&
        prev.returnPanel
      ) {
        setIsArchiveOpen(true);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    setSavedItems(loadSavedItems());
    const sessions = loadConversationSessions();
    setConversationSessions(sessions);
    migrateSessionsToReports(sessions, locale);
    setSessionReports(seedDemoMonthlyReports());
    setLearningCards(loadLearningCards());
    setShowChatCards(loadChatCardsVisible());
    setVocabPickMode(loadVocabCheckOn());
    void refreshEntitlement();
    // Migrate once on mount; locale is read for title/summary language of new imports only.
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

    const firstMessage = turns[0]?.userMessage || "Conversation Session";
    const session: ConversationSession = {
      id: currentSessionId,
      title:
        firstMessage.length > 28 ? `${firstMessage.slice(0, 28)}...` : firstMessage,
      createdAt: currentSessionCreatedAt,
      endedAt: sessionEnded ? Date.now() : undefined,
      messageCount: turns.length,
      messages: toSessionMessages(turns),
    };

    saveConversationSession(session);
    setConversationSessions(loadConversationSessions());
  }, [turns, currentSessionId, currentSessionCreatedAt, sessionEnded]);

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

  const sendChatMessage = async (
    message: string,
    options?: { fromExpression?: boolean },
  ) => {
    const url = apiUrl("/api/chat");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...premiumRequestHeaders(isPremium),
      },
      body: JSON.stringify({ message, mode: "chat", locale }),
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
          data.assistantMessage?.trim() || "Got it. Tell me one more sentence.",
        correctionResult,
        suppressCorrectionCard: options?.fromExpression === true,
      },
    ]);
  };

  const fetchExpressionResult = async (message: string) => {
    const url = apiUrl("/api/chat");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, mode: "how_to_say" }),
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

    setTurns((previous) => [
      ...previous,
      {
        id: `${Date.now()}`,
        mode: "how_to_say",
        userMessage: message,
        expressionResult: {
          expression: data.expression?.trim() || message,
          example: data.example?.trim() || "Please try again later.",
        },
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
      const response = await fetch(apiUrl("/api/translate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, locale }),
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

  const toggleVocabCheck = () => {
    setVocabPickMode((prev) => {
      const next = !prev;
      persistVocabCheckOn(next);
      if (!next) {
        setPreviewWord(null);
        setPreviewDetail(null);
        setIsPreviewLoading(false);
        setPreviewLoadFailed(false);
        setIsVocabSaving(false);
      } else {
        setVocabEntries(loadVocabulary());
      }
      return next;
    });
  };

  const closeVocabPreview = () => {
    if (isVocabSaving) return;
    setPreviewWord(null);
    setPreviewDetail(null);
    setIsPreviewLoading(false);
    setPreviewLoadFailed(false);
  };

  const openVocabPreview = async (word: string) => {
    const trimmed = word.trim();
    if (!trimmed || isVocabSaving) return;

    const requestId = previewRequestIdRef.current + 1;
    previewRequestIdRef.current = requestId;

    setPreviewWord(trimmed);
    setPreviewDetail(null);
    setPreviewLoadFailed(false);
    setIsPreviewLoading(true);
    setVocabEntries(loadVocabulary());

    try {
      const response = await fetch(apiUrl("/api/vocab/gloss"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ words: [trimmed], locale }),
      });
      if (!response.ok) {
        throw new Error("gloss failed");
      }
      const data = (await response.json()) as { items?: VocabLookupResult[] };
      if (previewRequestIdRef.current !== requestId) return;
      const item =
        Array.isArray(data.items) && data.items.length > 0
          ? data.items[0]
          : { word: trimmed, gloss: trimmed };
      setPreviewDetail({
        word: item.word || trimmed,
        gloss: item.gloss || trimmed,
        ...(item.example ? { example: item.example } : {}),
        ...(item.partOfSpeech ? { partOfSpeech: item.partOfSpeech } : {}),
      });
    } catch {
      if (previewRequestIdRef.current !== requestId) return;
      setPreviewLoadFailed(true);
    } finally {
      if (previewRequestIdRef.current === requestId) {
        setIsPreviewLoading(false);
      }
    }
  };

  const confirmSaveVocabWord = () => {
    if (!previewWord || !previewDetail || isVocabSaving) return;
    setIsVocabSaving(true);
    try {
      const updated = saveVocabularyWords(loadVocabulary(), [previewDetail]);
      persistVocabulary(updated);
      setVocabEntries(updated);
      setBookToast(ui.vocabPickSavedToast);
      setPreviewWord(null);
      setPreviewDetail(null);
      setPreviewLoadFailed(false);
    } catch {
      setBookToast(ui.vocabPickFailed);
    } finally {
      setIsVocabSaving(false);
    }
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
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const snapshotCurrentChat = () => {
    if (turns.length === 0) {
      return;
    }
    const firstMessage = turns[0]?.userMessage || "Conversation Session";
    saveConversationSession({
      id: currentSessionId,
      title:
        firstMessage.length > 28
          ? `${firstMessage.slice(0, 28)}...`
          : firstMessage,
      createdAt: currentSessionCreatedAt,
      endedAt: undefined,
      messageCount: turns.length,
      messages: toSessionMessages(turns),
    });
    setConversationSessions(loadConversationSessions());
  };

  const openConversationSession = (session: ConversationSession) => {
    if (session.id !== currentSessionId) {
      snapshotCurrentChat();
    }

    // Ended sessions already have a frozen report — continue as a new session id.
    if (session.endedAt) {
      setCurrentSessionId(makeSessionId());
      setCurrentSessionCreatedAt(Date.now());
    } else {
      setCurrentSessionId(session.id);
      setCurrentSessionCreatedAt(session.createdAt);
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
    const firstMessage = turns[0]?.userMessage || "Conversation Session";
    saveConversationSession({
      id: currentSessionId,
      title:
        firstMessage.length > 28
          ? `${firstMessage.slice(0, 28)}...`
          : firstMessage,
      createdAt: currentSessionCreatedAt,
      endedAt,
      messageCount: turns.length,
      messages,
    });
    setConversationSessions(loadConversationSessions());
    setBookToast(ui.sessionSavedToHistoryToast);
    setIsArchiveOpen(false);
    setIsChatHistoryOpen(false);
    startNewChat();
  };

  const openCreatedReport = (
    report: SessionReport,
    options?: { clearChat?: boolean },
  ) => {
    setSessionReports(loadSessionReports());
    setConversationSessions(loadConversationSessions());
    setBookToast(ui.reportCreatedToast);
    setIsArchiveOpen(false);
    setIsChatHistoryOpen(false);
    if (options?.clearChat !== false) {
      startNewChat();
    }
    if (tabMode && onSessionReportCreated) {
      onSessionReportCreated(report);
    } else {
      pushMainView({
        type: "sessionReport",
        reportId: report.id,
        returnPanel: false,
      });
    }
  };

  const createReportFromCurrent = () => {
    if (turns.length === 0) {
      setBookToast(ui.reportCreateEmptyToast);
      return;
    }
    setReportConfirmOpen(true);
  };

  const confirmCreateReportFromCurrent = () => {
    if (turns.length === 0) {
      setReportConfirmOpen(false);
      setBookToast(ui.reportCreateEmptyToast);
      return;
    }

    const endedAt = Date.now();
    const messages = toSessionMessages(turns);
    const report = buildSessionReport({
      sessionId: currentSessionId,
      createdAt: currentSessionCreatedAt,
      messages,
      messageCount: turns.length,
      locale,
      endedAt,
    });
    saveSessionReport(report);
    saveConversationSession({
      id: currentSessionId,
      title: report.title,
      createdAt: currentSessionCreatedAt,
      endedAt,
      messageCount: turns.length,
      messages,
    });
    setReportConfirmOpen(false);
    openCreatedReport(report, { clearChat: true });
    void prepareQuizAfterReport(locale).then((session) => {
      if (session) {
        setBookToast(ui.quizReadyToast);
      }
    });
  };

  const createReportFromHistorySession = (session: ConversationSession) => {
    if (!session.messages?.length) {
      setBookToast(ui.reportCreateEmptyToast);
      return;
    }
    const endedAt = session.endedAt ?? Date.now();
    const report = buildSessionReport({
      sessionId: session.id,
      createdAt: session.createdAt,
      messages: session.messages,
      messageCount: session.messageCount || session.messages.length,
      locale,
      endedAt,
    });
    saveSessionReport(report);
    saveConversationSession({
      ...session,
      title: report.title,
      endedAt,
    });
    openCreatedReport(report, {
      clearChat: session.id === currentSessionId,
    });
    void prepareQuizAfterReport(locale).then((ready) => {
      if (ready) {
        setBookToast(ui.quizReadyToast);
      }
    });
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

    if (modeToUse === "chat" && isChatDailyLimitReached) {
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

  const handleUseExpressionAsMessage = async (text: string) => {
    const message = text.trim();
    if (!message || isSending) {
      return;
    }
    if (isChatDailyLimitReached) {
      openPaywall("PAYWALL_OPEN_LIMIT_REACHED");
      return;
    }

    setChatModeOn(true);
    setIsSending(true);
    try {
      await sendChatMessage(message, { fromExpression: true });
      await refreshEntitlement();
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
          mode: "chat",
          userMessage: message,
          assistantMessage: "지금 처리에 문제가 있었어요.",
          suppressCorrectionCard: true,
          correctionResult: {
            corrected: message,
            natural: message,
            explanation: "일시적인 오류입니다. 잠시 후 다시 시도해 주세요.",
            hasError: true,
          },
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const openReport = (report: SessionReport, options?: { returnPanel?: boolean }) => {
    pushMainView({
      type: "sessionReport",
      reportId: report.id,
      returnPanel: options?.returnPanel ?? true,
    });
  };

  const openMonthlyReport = (ym: YearMonth) => {
    pushMainView({ type: "monthlyReport", ym, returnPanel: true });
  };

  const activeSessionReport =
    mainView.type === "sessionReport"
      ? sessionReports.find((r) => r.id === mainView.reportId) ?? null
      : null;

  const isReportMain =
    !tabMode &&
    (mainView.type === "monthlyReport" || mainView.type === "sessionReport");

  return (
    <>
      <section
        className={`flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200 shadow-lg ${
          tabMode ? "h-full" : "h-[92vh]"
        } ${
          isReportMain
            ? "max-w-4xl bg-white"
            : tabMode
              ? "max-w-none bg-slate-50"
              : "max-w-3xl bg-slate-50"
        }`}
      >
        {!tabMode && mainView.type === "monthlyReport" ? (
          <MonthlyReportPage
            key={`${mainView.ym.year}-${mainView.ym.month}`}
            reports={sessionReports}
            locale={locale}
            ui={ui}
            initialYm={mainView.ym}
            onBack={goBackMainView}
            onOpenReport={(report) =>
              openReport(report, { returnPanel: false })
            }
          />
        ) : !tabMode &&
          mainView.type === "sessionReport" &&
          activeSessionReport ? (
          <SessionReportView
            key={activeSessionReport.id}
            report={activeSessionReport}
            ui={ui}
            locale={locale}
            onBack={goBackMainView}
          />
        ) : (
          <>
        <header className="border-b border-slate-200 bg-white px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {!tabMode ? (
              <button
                type="button"
                onClick={() => setIsArchiveOpen(true)}
                aria-label="Open reports menu"
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
                {!isPremium ? (
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
                onClick={createReportFromCurrent}
                className="rounded-full border border-teal-600 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 hover:bg-teal-100"
              >
                {ui.createReport}
              </button>
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
                <MessageBubble
                  role="user"
                  message={turn.userMessage}
                  pickMode={vocabPickMode}
                  isWordSaved={(word) => isWordSaved(vocabEntries, word)}
                  savingWord={previewWord}
                  onWordClick={(word) => {
                    void openVocabPreview(word);
                  }}
                  labels={{
                    listen: ui.listen,
                  }}
                />

                {turn.mode === "chat" &&
                  turn.correctionResult &&
                  turn.assistantMessage && (
                    <>
                      {showChatCards &&
                      !turn.suppressCorrectionCard &&
                      shouldShowCorrectionCard(
                        turn.userMessage,
                        turn.correctionResult,
                      ) ? (
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
                          pickMode={vocabPickMode}
                          isWordSaved={(word) => isWordSaved(vocabEntries, word)}
                          savingWord={previewWord}
                          onWordClick={(word) => {
                            void openVocabPreview(word);
                          }}
                          labels={{
                            listen: ui.listen,
                            natural: ui.natural,
                            blockTitle: ui.correctionBlockTitle,
                            myLine: ui.correctionMyLine,
                            tryThis: ui.correctionTryThis,
                          }}
                        />
                      ) : null}
                      <MessageBubble
                        role="assistant"
                        message={turn.assistantMessage}
                        translatedMessage={turn.translatedMessage}
                        isTranslating={turn.isTranslating}
                        pickMode={vocabPickMode}
                        isWordSaved={(word) => isWordSaved(vocabEntries, word)}
                        savingWord={previewWord}
                        onWordClick={(word) => {
                          void openVocabPreview(word);
                        }}
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
                    </>
                  )}

                {turn.mode === "how_to_say" && turn.expressionResult && (
                  <HowToSayCard
                    expression={turn.expressionResult.expression}
                    example={turn.expressionResult.example}
                    pickMode={vocabPickMode}
                    isWordSaved={(word) => isWordSaved(vocabEntries, word)}
                    savingWord={previewWord}
                    onWordClick={(word) => {
                      void openVocabPreview(word);
                    }}
                    labels={{
                      title: ui.expressionHelperTitle,
                      example: ui.example,
                      listen: ui.listen,
                    }}
                    actions={
                      <button
                        type="button"
                        onClick={() =>
                          handleUseExpressionAsMessage(
                            turn.expressionResult?.expression || "",
                          )
                        }
                        className="rounded-md bg-slate-900 px-2 py-1 text-xs text-white hover:bg-slate-700"
                      >
                        {ui.useThisExpression}
                      </button>
                    }
                  />
                )}
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
              <button
                type="button"
                onClick={toggleVocabCheck}
                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                  vocabPickMode
                    ? "bg-teal-500 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
                aria-pressed={vocabPickMode}
              >
                {ui.vocabSaveFromChat}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowChatCards((prev) => {
                    const next = !prev;
                    persistChatCardsVisible(next);
                    return next;
                  });
                }}
                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                  showChatCards
                    ? "bg-teal-500 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
                aria-pressed={showChatCards}
              >
                {ui.chatCardsLabel}
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
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
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
          </>
        </form>
          </>
        )}
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

      {previewWord ? (
        <VocabWordPreview
          word={previewWord}
          detail={previewDetail}
          isLoading={isPreviewLoading}
          isSaving={isVocabSaving}
          loadFailed={previewLoadFailed}
          alreadySaved={isWordSaved(vocabEntries, previewWord)}
          ui={ui}
          onClose={closeVocabPreview}
          onSave={confirmSaveVocabWord}
        />
      ) : null}

      {reportConfirmOpen ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-900/40 p-3 sm:items-center">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label={ui.reportCreateConfirmCancel}
            onClick={() => setReportConfirmOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-create-confirm-title"
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
          >
            <div className="px-4 py-4">
              <h2
                id="report-create-confirm-title"
                className="text-base font-semibold text-slate-900"
              >
                {ui.reportCreateConfirmTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {ui.reportCreateConfirmBody}
              </p>
            </div>
            <div className="flex gap-2 border-t border-slate-100 px-4 py-3">
              <button
                type="button"
                onClick={() => setReportConfirmOpen(false)}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {ui.reportCreateConfirmCancel}
              </button>
              <button
                type="button"
                onClick={confirmCreateReportFromCurrent}
                className="flex-1 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                {ui.reportCreateConfirmCta}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {!tabMode ? (
        <ReportPanel
          isOpen={isArchiveOpen}
          reports={sessionReports}
          locale={locale}
          ui={ui}
          onClose={() => setIsArchiveOpen(false)}
          onDeleteReport={(id) => {
            deleteSessionReport(id);
            setSessionReports(loadSessionReports());
          }}
          onClearReports={() => {
            clearSessionReports();
            setSessionReports([]);
          }}
          onOpenReport={(report) => openReport(report, { returnPanel: true })}
          onOpenMonthly={openMonthlyReport}
        />
      ) : null}

      <ChatHistoryPanel
        isOpen={isChatHistoryOpen}
        sessions={conversationSessions.filter((s) => s.messageCount > 0)}
        currentSessionId={currentSessionId}
        reportedSessionIds={new Set(sessionReports.map((r) => r.sessionId))}
        locale={locale}
        ui={ui}
        onClose={() => setIsChatHistoryOpen(false)}
        onOpenSession={openConversationSession}
        onCreateReport={createReportFromHistorySession}
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
              ? conversationSessions.filter((s) => s.id === currentSessionId)
              : [];
          clearConversationSessions();
          for (const session of keepCurrent) {
            saveConversationSession(session);
          }
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
