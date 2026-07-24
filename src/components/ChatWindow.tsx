"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ARCHIVE_STORAGE_KEY,
  ArchivePanel,
  ChatMessage,
  ConversationSession,
  SavedItem,
} from "./ArchivePanel";
import { APP_LOCALE_STORAGE_KEY, copy, Locale } from "@/lib/copy";
import {
  loadLearningCards,
  persistLearningCards,
  type LearningCard,
} from "@/lib/learningCards";
import { CorrectionCard } from "./CorrectionCard";
import { HowToSayCard } from "./HowToSayCard";
import { LanguageSelector } from "./LanguageSelector";
import { MessageBubble } from "./MessageBubble";
import { SaveButton } from "./SaveButton";
import { PaywallModal } from "./PaywallModal";
import { usePremium } from "@/contexts/PremiumContext";
import { Capacitor } from "@capacitor/core";
import {
  FREE_DAILY_CHAT_LIMIT,
  PREMIUM_CLIENT_HEADER,
} from "@/lib/billing/config";

type CorrectionResult = {
  highlighted: string;
  corrected: string;
  natural: string;
  explanation: string;
  hasError: boolean;
};

type ExpressionResult = {
  expression: string;
  explanation: string;
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
};

type ChatModeApiResponse = {
  assistantMessage: string;
  correction: {
    highlighted: string;
    corrected: string;
    natural: string;
    explanation: string;
  };
};

type ExpressionApiResponse = {
  expression: string;
  explanation: string;
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

function normalizeCorrectionResult(
  originalMessage: string,
  correction: ChatModeApiResponse["correction"],
): CorrectionResult {
  const corrected = correction.corrected?.trim() || originalMessage;
  const highlighted = correction.highlighted?.trim() || originalMessage;
  const natural = correction.natural?.trim() || corrected;
  const explanation =
    correction.explanation?.trim() || "일시적인 오류입니다. 다시 시도해 주세요.";

  const hasBracketError =
    highlighted.includes("[") && (highlighted.includes("->") || highlighted.includes("→"));
  const correctedChanged =
    corrected.replace(/\s+/g, " ").trim() !==
    originalMessage.replace(/\s+/g, " ").trim();
  const hasError = hasBracketError || correctedChanged;

  return {
    corrected,
    highlighted,
    natural,
    explanation,
    hasError,
  };
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
        explanation: "",
        example: "",
      };
      try {
        const parsed = JSON.parse(message.content) as {
          expressionResult?: ExpressionResult;
        };
        if (parsed.expressionResult) {
          expressionResult = parsed.expressionResult;
        }
      } catch {
        expressionResult = {
          expression: message.content,
          explanation: "",
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
    explanation: turn.expressionResult.explanation,
    example: turn.expressionResult.example,
    createdAt: Date.now(),
  };
}

export function ChatWindow() {
  const router = useRouter();
  const { isPremium, isBillingReady, refreshPremium } = usePremium();
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === "undefined") {
      return "ko";
    }
    try {
      const raw = localStorage.getItem(APP_LOCALE_STORAGE_KEY);
      if (raw === "ko" || raw === "en" || raw === "es") {
        return raw;
      }
    } catch {
      // ignore
    }
    return "ko";
  });
  const ui = copy[locale];
  const [bookToast, setBookToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<InputMode>("chat");
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
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);

  const dailyLimit = entitlement.dailyLimit ?? SESSION_MESSAGE_LIMIT;
  const isChatDailyLimitReached =
    !isPremium && entitlement.dailyUsed >= dailyLimit;
  const isChatInputBlocked = mode === "chat" && isChatDailyLimitReached;

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
    setConversationSessions(loadConversationSessions());
    setLearningCards(loadLearningCards());
    void refreshEntitlement();
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

  const sendChatMessage = async (message: string) => {
    const url = apiUrl("/api/chat");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...premiumRequestHeaders(isPremium),
      },
      body: JSON.stringify({ message, mode: "chat" }),
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
    const correctionResult = normalizeCorrectionResult(message, data.correction);

    setTurns((previous) => [
      ...previous,
      {
        id: `${Date.now()}`,
        mode: "chat",
        userMessage: message,
        assistantMessage:
          data.assistantMessage?.trim() || "Got it. Tell me one more sentence.",
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
          explanation:
            data.explanation?.trim() || "일시적인 오류입니다. 다시 시도해 주세요.",
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

  const saveLearningCardFromTurn = (turn: ChatTurn) => {
    const corrected =
      turn.mode === "how_to_say"
        ? turn.expressionResult?.expression
        : turn.correctionResult?.corrected;
    const explanation =
      turn.mode === "how_to_say"
        ? turn.expressionResult?.explanation
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

  const startNewChat = () => {
    setTurns([]);
    setInput("");
    setMode("chat");
    setSessionEnded(false);
    setCurrentSessionId(makeSessionId());
    setCurrentSessionCreatedAt(Date.now());
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const endCurrentSession = () => {
    if (turns.length === 0) {
      startNewChat();
      return;
    }

    setSessionEnded(true);
    startNewChat();
  };

  const handleSend = async (event: FormEvent) => {
    event.preventDefault();
    if (mode === "chat" && isChatInputBlocked) {
      openPaywall("PAYWALL_OPEN_LIMIT_REACHED");
      return;
    }
    const trimmed = input.trim();
    if (!trimmed || isSending) {
      return;
    }

    setIsSending(true);
    try {
      if (mode === "how_to_say") {
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
          mode,
          userMessage: trimmed,
          ...(mode === "how_to_say"
            ? {
                expressionResult: {
                  expression: trimmed,
                  explanation: "일시적인 오류입니다. 잠시 후 다시 시도해 주세요.",
                  example: "Please try again later.",
                },
              }
            : {
                assistantMessage: "지금 처리에 문제가 있었어요.",
                correctionResult: {
                  highlighted: trimmed,
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

    setMode("chat");
    setIsSending(true);
    try {
      await sendChatMessage(message);
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
          correctionResult: {
            highlighted: message,
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

  const handleTranslate = async (turnId: string, text: string) => {
    setTurns((previous) =>
      previous.map((turn) =>
        turn.id === turnId ? { ...turn, isTranslating: true } : turn,
      ),
    );

    try {
      const url = apiUrl("/api/translate");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to translate.");
      }

      const data = (await response.json()) as { translated: string };

      setTurns((previous) =>
        previous.map((turn) =>
          turn.id === turnId
            ? {
                ...turn,
                translatedMessage: data.translated,
                isTranslating: false,
              }
            : turn,
        ),
      );
    } catch {
      setTurns((previous) =>
        previous.map((turn) =>
          turn.id === turnId
            ? {
                ...turn,
                translatedMessage: ui.translateFailed,
                isTranslating: false,
              }
            : turn,
        ),
      );
    }
  };

  const openConversationSession = (session: ConversationSession) => {
    setCurrentSessionId(session.id);
    setCurrentSessionCreatedAt(session.createdAt);
    setSessionEnded(false);
    setTurns(fromSessionMessages(session.messages));
    setMode("chat");
    setIsArchiveOpen(false);
  };

  return (
    <>
      <section className="flex h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-lg">
        <header className="border-b border-slate-200 bg-white px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIsArchiveOpen(true)}
              aria-label="Open archive menu"
              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
            >
              ☰
            </button>

            <div className="min-w-0 flex-1 text-center md:text-left">
              <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
                {ui.appTitle}
              </h1>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 md:justify-start">
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

            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => router.push("/learning")}
                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
              >
                {ui.learningBookNav}
              </button>
              <button
                type="button"
                onClick={endCurrentSession}
                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
              >
                {ui.endSession}
              </button>
            </div>
          </div>
          <div className="mt-2 flex justify-center md:mt-1 md:justify-end">
            <LanguageSelector locale={locale} onChange={setLocale} />
          </div>
        </header>

        <div className="flex-1 space-y-2 overflow-y-auto p-2.5 sm:space-y-4 sm:p-4">
          {isChatDailyLimitReached ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-950">
              <p className="leading-relaxed">{ui.paywallLimitBanner}</p>
              <button
                type="button"
                onClick={() => openPaywall("PAYWALL_OPEN_LIMIT_REACHED")}
                className="mt-2 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
              >
                {ui.upgradeCta}
              </button>
            </div>
          ) : null}
          {turns.length === 0 && (
            <p className="whitespace-pre-line rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
              {ui.chatEmptyHint}
            </p>
          )}
          {turns.map((turn) => {
            const correctionSavedId = `correction-${turn.id}`;
            const expressionSavedId = `expression-${turn.id}`;
            const correctionSaved = savedItems.some((item) => item.id === correctionSavedId);
            const expressionSaved = savedItems.some((item) => item.id === expressionSavedId);

            return (
              <article key={turn.id} className="space-y-1.5 sm:space-y-2">
                <MessageBubble
                  role="user"
                  message={turn.userMessage}
                  labels={{
                    translate: ui.translate,
                    translating: ui.translating,
                    translation: ui.translation,
                    listen: ui.listen,
                  }}
                />

                {turn.mode === "chat" &&
                  turn.correctionResult &&
                  turn.assistantMessage && (
                    <>
                      <CorrectionCard
                        original={turn.userMessage}
                        highlighted={turn.correctionResult.highlighted}
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
                          title: ui.correctionTitle,
                          highlighted: ui.highlighted,
                          corrected: ui.corrected,
                          natural: ui.natural,
                          explanation: ui.explanation,
                          listen: ui.listen,
                          noCorrectionNeeded: ui.noCorrectionNeeded,
                        }}
                        onRetry={(text) => {
                          setMode("chat");
                          setInput(text);
                          requestAnimationFrame(() => inputRef.current?.focus());
                        }}
                        actions={
                          <SaveButton
                            isSaved={correctionSaved}
                            saveLabel={ui.save}
                            savedLabel={ui.saved}
                            onSave={() => {
                              saveItemFromTurn(buildCorrectionSavedItem(turn));
                              saveLearningCardFromTurn(turn);
                            }}
                          />
                        }
                      />
                      <MessageBubble
                        role="assistant"
                        message={turn.assistantMessage}
                        translatedMessage={turn.translatedMessage}
                        isTranslating={turn.isTranslating}
                        onTranslate={() =>
                          handleTranslate(turn.id, turn.assistantMessage ?? "")
                        }
                        labels={{
                          translate: ui.translate,
                          translating: ui.translating,
                          translation: ui.translation,
                          listen: ui.listen,
                        }}
                      />
                    </>
                  )}

                {turn.mode === "how_to_say" && turn.expressionResult && (
                  <HowToSayCard
                    expression={turn.expressionResult.expression}
                    explanation={turn.expressionResult.explanation}
                    example={turn.expressionResult.example}
                    labels={{
                      title: ui.expressionHelperTitle,
                      explanation: ui.explanation,
                      example: ui.example,
                    }}
                    actions={
                      <div className="flex flex-wrap gap-2">
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
                        <SaveButton
                          isSaved={expressionSaved}
                          saveLabel={ui.save}
                          savedLabel={ui.saved}
                          onSave={() => {
                            saveItemFromTurn(buildExpressionSavedItem(turn));
                            saveLearningCardFromTurn(turn);
                          }}
                        />
                      </div>
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
            <div className="mb-2 flex gap-2">
              <button
                type="button"
                onClick={() => setMode("chat")}
                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                  mode === "chat"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
              >
                {ui.chatMode}
              </button>
              <button
                type="button"
                onClick={() => setMode("how_to_say")}
                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                  mode === "how_to_say"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
              >
                {ui.askExpression}
              </button>
            </div>

            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={
                  mode === "chat" ? ui.inputPlaceholder : ui.expressionPlaceholder
                }
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
                onClick={(event) => {
                  if (isChatInputBlocked) {
                    event.preventDefault();
                    openPaywall("PAYWALL_OPEN_LIMIT_REACHED");
                  }
                }}
                className="shrink-0 whitespace-nowrap rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSending ? `${ui.send}...` : ui.send}
              </button>
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

      <ArchivePanel
        isOpen={isArchiveOpen}
        conversationSessions={conversationSessions}
        ui={ui}
        onClose={() => setIsArchiveOpen(false)}
        onDeleteConversationSession={(id) => {
          deleteConversationSession(id);
          setConversationSessions(loadConversationSessions());
        }}
        onClearConversationSessions={() => {
          clearConversationSessions();
          setConversationSessions(loadConversationSessions());
        }}
        onOpenConversationSession={openConversationSession}
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
