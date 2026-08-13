import type { ChatMessage, ConversationSession } from "@/components/ArchivePanel";
import type { Locale } from "@/lib/copy";
import {
  buildHeuristicConversationAnalysis,
  CONVERSATION_ANALYSIS_VERSION,
  type ConversationAnalysis,
} from "@/lib/conversationAnalysis";
import { dropAddedStyleWords, isGrammarError } from "@/lib/correctionNorm";
import { correctionErrorMass } from "@/lib/textDiff";

export const SESSION_REPORTS_KEY = "sessionReports";
export const SESSION_REPORTS_UPDATED_EVENT = "sessionReportsUpdated";
const SESSION_REPORTS_MIGRATED_KEY = "sessionReportsMigratedV1";

/** Below this many user chat turns, score is withheld */
export const REPORT_MIN_TURNS_FOR_SCORE = 3;

export type ReportStrength = {
  sentence: string;
  note: string;
};

export type ReportImprovement = {
  original: string;
  better: string;
  explanation: string;
};

export type ReportLearningItem = {
  expression: string;
  reason: string;
};

export type ReportExpressionItem = {
  original: string;
  used: string;
  simpler?: string;
  moreNative?: string;
  analysis?: string;
};

/** Deep-learning unit linked to a user message (Detailed Analysis). */
export type ReportAnalysisItem = {
  id: string;
  messageId: string;
  type: "correction" | "strength";
  original: string;
  corrected?: string;
  explanation: string;
  alternative?: string;
  /** Short grammar focus label, e.g. past tense */
  grammarPoint?: string;
  /** Extra example sentence using the target grammar */
  example?: string;
};

/** Score factors that sum toward native-level colloquial English (100). */
export type ScoreFactorId =
  | "accuracy"
  | "naturalness"
  | "fluency"
  | "spokenStyle";

export type ScoreFactor = {
  id: ScoreFactorId;
  earned: number;
  max: number;
};

export type ScoreBreakdown = {
  factors: ScoreFactor[];
  total: number;
};

export type SessionReport = {
  id: string;
  sessionId: string;
  title: string;
  createdAt: number;
  endedAt: number;
  messageCount: number;
  /** Frozen transcript at session end */
  messages: ChatMessage[];
  conversationSummary: string;
  /** null when not enough dialogue for a reliable score */
  score: number | null;
  scoreInsufficient: boolean;
  /** Factor breakdown toward native-colloquial 100; older reports may omit */
  scoreBreakdown?: ScoreBreakdown;
  strengths: ReportStrength[];
  improvements: ReportImprovement[];
  learningItems: ReportLearningItem[];
  /** how_to_say lines used in this session */
  expressionItems?: ReportExpressionItem[];
  /** Preferred detailed-analysis payload; older reports may omit this */
  analysisItems?: ReportAnalysisItem[];
  /** Conversation-level coaching; older reports may omit this */
  conversationAnalysis?: ConversationAnalysis;
  conversationAnalysisVersion?: number;
};

type CorrectionPayload = {
  assistantMessage?: string;
  correctionResult?: {
    corrected?: string;
    natural?: string;
    explanation?: string;
    hasError?: boolean;
    highlighted?: string;
  };
};

type TurnSlice = {
  userMessageId: string;
  userMessage: string;
  corrected?: string;
  natural?: string;
  explanation?: string;
  hasError: boolean;
  assistantMessage?: string;
};

function t(
  locale: Locale,
  map: { en: string } & Partial<Record<Locale, string>>,
) {
  return map[locale] ?? map.en;
}

export function loadSessionReports(): SessionReport[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SESSION_REPORTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SessionReport[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function persistSessionReports(reports: SessionReport[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_REPORTS_KEY, JSON.stringify(reports));
  window.dispatchEvent(new Event(SESSION_REPORTS_UPDATED_EVENT));
}

export function saveSessionReport(report: SessionReport) {
  const current = loadSessionReports();
  const next = [report, ...current.filter((r) => r.id !== report.id)];
  persistSessionReports(next);
  return report;
}

export function deleteSessionReport(id: string) {
  persistSessionReports(loadSessionReports().filter((r) => r.id !== id));
}

export function clearSessionReports() {
  persistSessionReports([]);
}

export function getSessionReport(id: string): SessionReport | null {
  return loadSessionReports().find((r) => r.id === id) ?? null;
}

function parseTurns(messages: ChatMessage[]): TurnSlice[] {
  const turns: TurnSlice[] = [];
  let pending: ChatMessage | null = null;

  for (const message of messages) {
    if (message.role === "user") {
      pending = message;
      continue;
    }
    if (!pending) continue;

    if (message.role === "assistant") {
      let corrected: string | undefined;
      let natural: string | undefined;
      let explanation: string | undefined;
      let hasError = false;
      let assistantMessage = "";
      try {
        const parsed = JSON.parse(message.content) as CorrectionPayload;
        assistantMessage = parsed.assistantMessage || "";
        const c = parsed.correctionResult;
        corrected = c?.corrected;
        natural = c?.natural;
        explanation = c?.explanation;
        hasError = Boolean(c?.hasError);
      } catch {
        assistantMessage = message.content;
      }
      turns.push({
        userMessageId: pending.id,
        userMessage: pending.content,
        corrected,
        natural,
        explanation,
        hasError,
        assistantMessage,
      });
      pending = null;
      continue;
    }

    if (message.role === "helper") {
      pending = null;
    }
  }

  return turns;
}

function parseExpressionItems(messages: ChatMessage[]): ReportExpressionItem[] {
  const items: ReportExpressionItem[] = [];
  let pending: ChatMessage | null = null;

  for (const message of messages) {
    if (message.role === "user") {
      pending = message;
      continue;
    }
    if (message.role !== "helper" || !pending) {
      if (message.role === "assistant") pending = null;
      continue;
    }

    let used = "";
    let simpler = "";
    let moreNative = "";
    let analysis = "";
    try {
      const parsed = JSON.parse(message.content) as {
        expressionResult?: {
          expression?: string;
          simpler?: string;
          moreNative?: string;
          analysis?: string;
        };
      };
      const expr = parsed.expressionResult;
      used = expr?.expression?.trim() || "";
      simpler = expr?.simpler?.trim() || "";
      moreNative = expr?.moreNative?.trim() || "";
      analysis = expr?.analysis?.trim() || "";
    } catch {
      used = message.content.trim();
    }

    if (used) {
      items.push({
        original: pending.content.trim(),
        used,
        ...(simpler ? { simpler } : {}),
        ...(moreNative ? { moreNative } : {}),
        ...(analysis ? { analysis } : {}),
      });
    }
    pending = null;
  }

  return items;
}

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Average sentence length that earns the full 20 fluency points. */
const FLUENCY_FULL_CHARS = 60;

/**
 * Learner English words needed before zero errors can earn the full accuracy 40.
 * Short perfect sessions stay below the ceiling until there is enough evidence.
 */
const ACCURACY_FULL_WORDS = 40;

function learnerSentences(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  const parts = trimmed
    .split(/(?<=[.!?])(?:\s+|$)/)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [trimmed];
}

function averageSentenceChars(turns: TurnSlice[]): number {
  const lengths = turns.flatMap((turn) =>
    learnerSentences(turn.userMessage).map((sentence) => sentence.length),
  );
  if (lengths.length === 0) return 0;
  return lengths.reduce((sum, n) => sum + n, 0) / lengths.length;
}

function normPhrase(text: string) {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

function contentWords(text: string): string[] {
  return text.toLowerCase().match(/[a-z0-9']+/g) ?? [];
}

function englishProductionRatio(text: string): number {
  const englishWords = (text.match(/[A-Za-z]+/g) || []).length;
  const otherWords = (
    text.match(/[\uac00-\ud7af]+|[\u3040-\u30ff\u3400-\u9fff]+/g) || []
  ).length;
  if (englishWords + otherWords === 0) return 0;
  return englishWords / (englishWords + otherWords);
}

function styleProximity(from: string, to: string): number {
  if (normPhrase(from) === normPhrase(to)) return 1;
  const fromWords = contentWords(from);
  if (fromWords.length === 0) return 0;
  const toWords = new Set(contentWords(to));
  const kept = fromWords.filter((word) => toWords.has(word)).length;
  return kept / fromWords.length;
}

const SPOKEN_NATIVE_PATTERN =
  /\b(because|so|since|though|anyway|actually|maybe|probably|I guess|I think|kind of|sort of|it depends|I'm gonna|I wanna|gonna|wanna|haven't|hasn't|don't|doesn't|didn't|I'm|I've|I'd|that's|there's|what's|can't|won't|isn't|aren't)\b/i;

/**
 * 0 = almost no English, 1 = everyday native speech.
 * Ignores grammar mistakes (compares the grammar-fixed line to the native rewrite).
 */
function turnNativeNaturalness(turn: TurnSlice): number {
  const text = turn.userMessage;
  const english = englishProductionRatio(text);
  if (english < 0.15) {
    return english * 0.2;
  }

  const styleBase = (turn.corrected || text).trim();
  const natural = (turn.natural || styleBase).trim();
  let style = 1;
  if (
    natural &&
    normPhrase(natural) !== normPhrase(styleBase) &&
    normPhrase(natural) !== normPhrase(text)
  ) {
    style = styleProximity(styleBase, natural);
  }

  const spoken = SPOKEN_NATIVE_PATTERN.test(text)
    ? 1
    : english > 0.6
      ? 0.4
      : 0.15;

  return Math.max(
    0,
    Math.min(1, 0.55 * style + 0.3 * english + 0.15 * spoken),
  );
}

function detectTopics(texts: string[], locale: Locale): string[] {
  const blob = texts.join(" ").toLowerCase();
  const topics: string[] = [];
  const rules: { keys: RegExp; label: { en: string } & Partial<Record<Locale, string>> }[] = [
    {
      keys: /\b(weekend|saturday|sunday|주말)\b/,
      label: {
        ko: "주말 계획",
        en: "weekend plans",
        es: "planes de fin de semana",
        ja: "週末の予定",
        zh: "周末计划",
      },
    },
    {
      keys: /\b(friend|friends|만나|친구)\b/,
      label: {
        ko: "친구와의 만남",
        en: "meeting friends",
        es: "quedar con amigos",
        ja: "友人との予定",
        zh: "和朋友见面",
      },
    },
    {
      keys: /\b(gym|workout|exercise|운동|헬스)\b/,
      label: {
        ko: "운동",
        en: "fitness",
        es: "ejercicio",
        ja: "運動",
        zh: "运动",
      },
    },
    {
      keys: /\b(work|office|meeting|직장|회사|회의)\b/,
      label: {
        ko: "직장",
        en: "work",
        es: "trabajo",
        ja: "仕事",
        zh: "工作",
      },
    },
    {
      keys: /\b(travel|trip|japan|korea|여행)\b/,
      label: {
        ko: "여행",
        en: "travel",
        es: "viajes",
        ja: "旅行",
        zh: "旅行",
      },
    },
    {
      keys: /\b(food|eat|restaurant|lunch|dinner|음식|밥)\b/,
      label: {
        ko: "음식",
        en: "food",
        es: "comida",
        ja: "食事",
        zh: "饮食",
      },
    },
    {
      keys: /\b(plan|planning|계획)\b/,
      label: {
        ko: "계획",
        en: "plans",
        es: "planes",
        ja: "計画",
        zh: "计划",
      },
    },
  ];
  for (const rule of rules) {
    if (rule.keys.test(blob)) topics.push(t(locale, rule.label));
  }
  return topics;
}

function buildTitle(turns: TurnSlice[], locale: Locale): string {
  const topics = detectTopics(
    turns.map((t) => t.userMessage),
    locale,
  );
  if (topics.length >= 2) {
    return t(locale, {
      ko: `${topics[0]}과 ${topics[1]}에 대한 대화`,
      en: `A chat about ${topics[0]} and ${topics[1]}`,
      es: `Una conversación sobre ${topics[0]} y ${topics[1]}`,
    });
  }
  if (topics.length === 1) {
    return t(locale, {
      ko: `${topics[0]}에 대한 대화`,
      en: `A chat about ${topics[0]}`,
      es: `Una conversación sobre ${topics[0]}`,
    });
  }
  const first = turns[0]?.userMessage?.trim();
  if (first) {
    const short = first.length > 28 ? `${first.slice(0, 28)}…` : first;
    return t(locale, {
      ko: `“${short}”로 시작한 대화`,
      en: `Chat starting with “${short}”`,
      es: `Chat que empezó con “${short}”`,
    });
  }
  return t(locale, {
    ko: "영어 대화 세션",
    en: "English conversation session",
    es: "Sesión de conversación en inglés",
  });
}

function buildSummary(turns: TurnSlice[], locale: Locale): string {
  const topics = detectTopics(
    turns.map((x) => x.userMessage),
    locale,
  );
  const samples = turns
    .map((x) => x.userMessage.trim())
    .filter((s) => s.length > 8)
    .slice(0, 3);

  if (topics.length > 0 && samples.length > 0) {
    return t(locale, {
      ko: `오늘은 ${topics.slice(0, 2).join("과 ")}에 대해 이야기했어요. ${
        samples.length > 1
          ? "최근 경험과 앞으로의 계획도 함께 나눴습니다."
          : "그 주제로 생각을 영어로 표현해 보았습니다."
      }`,
      en: `Today you talked about ${topics.slice(0, 2).join(" and ")}. ${
        samples.length > 1
          ? "You also shared recent experiences and what you’d like to do next."
          : "You practiced putting those ideas into English."
      }`,
      es: `Hoy hablaste de ${topics.slice(0, 2).join(" y ")}. ${
        samples.length > 1
          ? "También compartiste experiencias recientes y lo que quieres hacer después."
          : "Practicaste expresar esas ideas en inglés."
      }`,
    });
  }

  if (samples.length >= 2) {
    return t(locale, {
      ko: `이 세션에서는 여러 문장으로 자신의 상황을 설명했어요. 질문과 답변을 이어가며 대화를 이어갔습니다.`,
      en: `In this session you described your situation in several sentences and kept the conversation going with questions and answers.`,
      es: `En esta sesión describiste tu situación en varias frases y mantuviste la conversación con preguntas y respuestas.`,
    });
  }

  if (samples.length === 1) {
    return t(locale, {
      ko: `짧게나마 영어로 자신의 이야기를 말해 본 세션이에요.`,
      en: `A short session where you practiced saying something about yourself in English.`,
      es: `Una sesión breve en la que practicaste decir algo sobre ti en inglés.`,
    });
  }

  return t(locale, {
    ko: "이번 세션의 대화 내용이 아직 많지 않아요.",
    en: "There wasn’t much conversation in this session yet.",
    es: "Todavía no hubo mucha conversación en esta sesión.",
  });
}

/**
 * Native-colloquial English = 100.
 * Four spoken-chat factors; earned points are what you kept from each max.
 */
function computeScoreBreakdown(turns: TurnSlice[]): ScoreBreakdown {
  const chatTurns = turns.filter(
    (t) => t.corrected !== undefined || t.assistantMessage,
  );

  // Weight by words so mixed long/short turns ≈ a short session of average lines.
  let writtenWords = 0;
  let wrongWords = 0;
  let naturalWeighted = 0;
  let spokenWeighted = 0;
  let lengthSum = 0;

  for (const turn of chatTurns) {
    const written = Math.max(1, wordCount(turn.userMessage));
    lengthSum += written;

    if (!turn.corrected?.trim() || !isGrammarError(turn.userMessage, turn.corrected)) {
      writtenWords += written;
    } else {
      const mass = correctionErrorMass(turn.userMessage, turn.corrected);
      writtenWords += mass.writtenWords;
      wrongWords += mass.wrongWords;
    }

    naturalWeighted += turnNativeNaturalness(turn) * written;
    if (SPOKEN_NATIVE_PATTERN.test(turn.userMessage)) {
      spokenWeighted += written;
    }
  }

  const wordMass = Math.max(1, writtenWords);
  const lengthMass = Math.max(1, lengthSum);
  const errorRate = wrongWords / wordMass;
  const observedAccuracy = 1 - Math.min(1, errorRate);
  // One correct line ≠ full accuracy; scale the ceiling with how much English was produced.
  const accuracyEvidence = Math.min(1, wordMass / ACCURACY_FULL_WORDS);
  const accuracyCeiling = 12 + 28 * accuracyEvidence;
  const accuracy = Math.round(
    Math.min(observedAccuracy * 40, accuracyCeiling),
  );
  const naturalness = Math.round((naturalWeighted / lengthMass) * 25);

  const avgChars = averageSentenceChars(chatTurns);
  const fluency = Math.round(
    Math.max(0, Math.min(20, (avgChars / FLUENCY_FULL_CHARS) * 20)),
  );

  const spokenStyle = Math.round((spokenWeighted / lengthMass) * 15);

  const factors: ScoreFactor[] = [
    { id: "accuracy", earned: accuracy, max: 40 },
    { id: "naturalness", earned: naturalness, max: 25 },
    { id: "fluency", earned: fluency, max: 20 },
    { id: "spokenStyle", earned: spokenStyle, max: 15 },
  ];

  const total = Math.max(
    0,
    Math.min(
      100,
      factors.reduce((sum, f) => sum + f.earned, 0),
    ),
  );

  return { factors, total };
}

/** Grammar-error turns in the frozen transcript — not analysis-card count. */
export function countGrammarCorrections(report: SessionReport): number {
  return parseTurns(report.messages).filter(
    (turn) =>
      Boolean(turn.corrected) &&
      isGrammarError(turn.userMessage, turn.corrected || ""),
  ).length;
}

/** Recompute from transcript so naturalness tweaks apply to existing reports. */
export function getReportScoreBreakdown(
  report: SessionReport,
): ScoreBreakdown | null {
  if (report.scoreInsufficient || report.score == null) return null;
  const turns = parseTurns(report.messages);
  if (turns.length === 0) {
    return report.scoreBreakdown ?? null;
  }
  return computeScoreBreakdown(turns);
}

function buildStrengths(
  turns: TurnSlice[],
  locale: Locale,
): ReportStrength[] {
  const out: ReportStrength[] = [];
  for (const turn of turns) {
    if (out.length >= 3) break;
    const text = turn.userMessage;
    if (!turn.hasError && wordCount(text) >= 6) {
      if (/\b(haven't|has yet|yet)\b/i.test(text)) {
        out.push({
          sentence: text,
          note: t(locale, {
            ko: "현재완료와 yet을 자연스럽게 사용했습니다.",
            en: "You used the present perfect with “yet” naturally.",
            es: "Usaste el presente perfecto con “yet” de forma natural.",
          }),
        });
        continue;
      }
      if (/\bbecause\b/i.test(text)) {
        out.push({
          sentence: text,
          note: t(locale, {
            ko: "이유를 because로 자연스럽게 덧붙였습니다.",
            en: "You added a reason with “because” naturally.",
            es: "Añadiste una razón con “because” de forma natural.",
          }),
        });
        continue;
      }
      if (/\b(I'm planning|I plan to|I'm going to)\b/i.test(text)) {
        out.push({
          sentence: text,
          note: t(locale, {
            ko: "계획을 말하는 표현을 잘 사용했습니다.",
            en: "You used planning language well.",
            es: "Usaste bien el lenguaje de planes.",
          }),
        });
        continue;
      }
      if (wordCount(text) >= 9) {
        out.push({
          sentence: text,
          note: t(locale, {
            ko: "생각을 비교적 긴 문장으로 명확히 전달했습니다.",
            en: "You expressed your idea clearly in a fuller sentence.",
            es: "Expresaste tu idea con claridad en una frase más completa.",
          }),
        });
      }
    }
  }
  return out.slice(0, 3);
}

function buildImprovements(
  turns: TurnSlice[],
  locale: Locale,
): ReportImprovement[] {
  const out: ReportImprovement[] = [];
  for (const turn of turns) {
    if (out.length >= 5) break;
    if (!turn.corrected || !isGrammarError(turn.userMessage, turn.corrected)) {
      continue;
    }
    const original = turn.userMessage.trim();
    const better = dropAddedStyleWords(turn.userMessage, turn.corrected);
    if (!better || better === original) continue;

    let explanation =
      turn.explanation?.trim() ||
      t(locale, {
        ko: "조금 더 자연스러운 표현으로 다듬을 수 있어요.",
        en: "This can be polished into a more natural phrasing.",
        es: "Se puede pulir a una formulación más natural.",
      });

    if (/\bwent\b/i.test(better) && /\bgo\b/i.test(original)) {
      explanation = t(locale, {
        ko: "과거 경험을 말할 때는 went처럼 과거형을 사용합니다.",
        en: "Use past forms like “went” when talking about past experiences.",
        es: "Usa formas de pasado como “went” al hablar de experiencias pasadas.",
      });
    } else if (/\bto\b/i.test(better) && /went .+[^to] /i.test(original)) {
      explanation = t(locale, {
        ko: "go/went 뒤에 장소가 올 때는 보통 to를 씁니다.",
        en: "After go/went, places usually need “to”.",
        es: "Después de go/went, los lugares suelen llevar “to”.",
      });
    }

    out.push({ original, better, explanation });
  }
  return out.slice(0, 5);
}

function buildLearningItems(
  turns: TurnSlice[],
  improvements: ReportImprovement[],
  locale: Locale,
): ReportLearningItem[] {
  const items: ReportLearningItem[] = [];
  const push = (expression: string, reason: string) => {
    if (items.some((i) => i.expression === expression)) return;
    if (items.length >= 5) return;
    items.push({ expression, reason });
  };

  for (const turn of turns) {
    const text = turn.userMessage;
    if (/\bdecide|decided|haven't\b/i.test(text)) {
      push(
        "I haven't decided ~ yet.",
        t(locale, {
          ko: "아직 정하지 못한 계획을 말할 때 바로 쓸 수 있어요.",
          en: "Useful when you still haven’t chosen a plan.",
          es: "Útil cuando aún no has decidido un plan.",
        }),
      );
    }
    if (/\bdepend|depends\b/i.test(text)) {
      push(
        "It depends on ~",
        t(locale, {
          ko: "조건에 따라 달라질 때 자연스러운 표현입니다.",
          en: "Natural when the answer depends on something.",
          es: "Natural cuando la respuesta depende de algo.",
        }),
      );
    }
    if (/\bplan|planning|weekend\b/i.test(text)) {
      push(
        "I'm planning to ~",
        t(locale, {
          ko: "앞으로의 계획을 말할 때 자주 쓰입니다.",
          en: "Common for talking about upcoming plans.",
          es: "Común para hablar de planes próximos.",
        }),
      );
    }
    if (/\bfriend|meet\b/i.test(text)) {
      push(
        "I'm meeting ~",
        t(locale, {
          ko: "약속을 말할 때 쓸 수 있는 표현입니다.",
          en: "Handy for talking about arranged meetups.",
          es: "Útil para hablar de quedadas.",
        }),
      );
    }
  }

  for (const imp of improvements.slice(0, 2)) {
    const snippet = imp.better.split(/\s+/).slice(0, 5).join(" ");
    if (snippet.length >= 8) {
      push(
        `${snippet}…`,
        t(locale, {
          ko: "오늘 교정한 문장에서 다시 쓸 수 있는 핵심 표현입니다.",
          en: "A key phrase from today’s corrections worth reusing.",
          es: "Una frase clave de las correcciones de hoy para reutilizar.",
        }),
      );
    }
  }

  return items.slice(0, 5);
}

function buildGrammarFocus(
  original: string,
  corrected: string,
  explanation: string,
  locale: Locale,
): { grammarPoint: string; example: string } {
  const o = original.toLowerCase();
  const c = corrected.toLowerCase();

  if (
    (/\bgo\b/.test(o) && /\bwent\b/.test(c)) ||
    (/\bsee\b/.test(o) && /\bsaw\b/.test(c)) ||
    (/\beated\b|\bate\b/.test(o) === false && /\bate\b/.test(c) && /\beat\b/.test(o)) ||
    (/yesterday|last\s+(week|night|month)/i.test(original) &&
      /\b(go|see|eat|buy|come)\b/i.test(original) &&
      /\b(went|saw|ate|bought|came)\b/i.test(corrected))
  ) {
    return {
      grammarPoint: t(locale, {
        ko: "과거시제",
        en: "Past tense",
        es: "Pasado",
      }),
      example: t(locale, {
        ko: "예: I went to the store yesterday.",
        en: "e.g. I went to the store yesterday.",
        es: "Ej.: I went to the store yesterday.",
      }),
    };
  }

  if (
    (/\bgo\b|\bwent\b/.test(o) && /\bto\b/.test(c) && !/\bto\b/.test(o)) ||
    (/went\s+(?:the|a|my|his|her|our|their)\s+\w+/i.test(original) &&
      /went\s+to\b/i.test(corrected))
  ) {
    return {
      grammarPoint: t(locale, {
        ko: "전치사 to (장소)",
        en: "Preposition “to” (place)",
        es: "Preposición “to” (lugar)",
      }),
      example: t(locale, {
        ko: "예: She went to the gym after work.",
        en: "e.g. She went to the gym after work.",
        es: "Ej.: She went to the gym after work.",
      }),
    };
  }

  if (
    /\b(a|an|the)\b/i.test(corrected) &&
    !/\b(a|an|the)\b/i.test(original.split(/\s+/).slice(0, 6).join(" "))
  ) {
    return {
      grammarPoint: t(locale, {
        ko: "관사 (a / the)",
        en: "Articles (a / the)",
        es: "Artículos (a / the)",
      }),
      example: t(locale, {
        ko: "예: I had a really busy day today.",
        en: "e.g. I had a really busy day today.",
        es: "Ej.: I had a really busy day today.",
      }),
    };
  }

  if (
    (/\bwill\b/.test(o) && /\b(i'm|'m)\s+going\s+to\b/i.test(corrected)) ||
    (/\bwill\b/.test(o) && /\b'll\b/.test(corrected))
  ) {
    return {
      grammarPoint: t(locale, {
        ko: "미래 표현",
        en: "Future forms",
        es: "Futuro",
      }),
      example: t(locale, {
        ko: "예: I'm going to meet my friends this weekend.",
        en: "e.g. I'm going to meet my friends this weekend.",
        es: "Ej.: I'm going to meet my friends this weekend.",
      }),
    };
  }

  if (
    /\b(don't|doesn't|didn't|isn't|aren't|wasn't|weren't|haven't|hasn't)\b/i.test(
      corrected,
    ) &&
    !/\b(don't|doesn't|didn't|isn't|aren't|wasn't|weren't|haven't|hasn't)\b/i.test(
      original,
    )
  ) {
    return {
      grammarPoint: t(locale, {
        ko: "부정문",
        en: "Negatives",
        es: "Negación",
      }),
      example: t(locale, {
        ko: "예: I don't usually drink coffee at night.",
        en: "e.g. I don't usually drink coffee at night.",
        es: "Ej.: I don't usually drink coffee at night.",
      }),
    };
  }

  if (
    /\b(he|she|it)\s+\w+s\b/i.test(corrected) &&
    /\b(he|she|it)\s+\w+\b/i.test(original) &&
    !/\b(he|she|it)\s+\w+s\b/i.test(original)
  ) {
    return {
      grammarPoint: t(locale, {
        ko: "3인칭 단수 (-s)",
        en: "3rd-person -s",
        es: "3.ª persona -s",
      }),
      example: t(locale, {
        ko: "예: She works from home on Fridays.",
        en: "e.g. She works from home on Fridays.",
        es: "Ej.: She works from home on Fridays.",
      }),
    };
  }

  if (/\b(in|on|at)\b/i.test(corrected) && explanation) {
    return {
      grammarPoint: t(locale, {
        ko: "전치사",
        en: "Prepositions",
        es: "Preposiciones",
      }),
      example: t(locale, {
        ko: "예: I'll see you on Monday at 3.",
        en: "e.g. I'll see you on Monday at 3.",
        es: "Ej.: I'll see you on Monday at 3.",
      }),
    };
  }

  // Fallback: treat the corrected line as the model example
  return {
    grammarPoint: t(locale, {
      ko: "문법·표현",
      en: "Grammar / wording",
      es: "Gramática / redacción",
    }),
    example: corrected.trim()
      ? t(locale, {
          ko: `예: ${corrected.trim()}`,
          en: `e.g. ${corrected.trim()}`,
          es: `Ej.: ${corrected.trim()}`,
        })
      : explanation,
  };
}

function withGrammarFocus(
  item: ReportAnalysisItem,
  locale: Locale,
): ReportAnalysisItem {
  if (item.type !== "correction") return item;
  if (item.grammarPoint?.trim() && item.example?.trim()) return item;
  const focus = buildGrammarFocus(
    item.original,
    item.corrected || item.original,
    item.explanation,
    locale,
  );
  return {
    ...item,
    grammarPoint: item.grammarPoint?.trim() || focus.grammarPoint,
    example: item.example?.trim() || focus.example,
  };
}

function buildAnalysisItems(
  turns: TurnSlice[],
  _strengths: ReportStrength[],
  improvements: ReportImprovement[],
  locale: Locale,
): ReportAnalysisItem[] {
  const items: ReportAnalysisItem[] = [];
  const usedMessageIds = new Set<string>();

  for (const imp of improvements) {
    if (items.length >= 8) break;
    const turn = turns.find(
      (t) => t.userMessage.trim() === imp.original.trim(),
    );
    if (!turn || usedMessageIds.has(turn.userMessageId)) continue;
    if (!turn.corrected || !isGrammarError(turn.userMessage, turn.corrected)) {
      continue;
    }
    usedMessageIds.add(turn.userMessageId);

    const corrected = dropAddedStyleWords(turn.userMessage, turn.corrected);
    const natural = (turn.natural || "").trim();
    const alternative =
      natural &&
      natural !== corrected &&
      natural !== turn.userMessage.trim()
        ? natural
        : undefined;
    const focus = buildGrammarFocus(
      imp.original,
      corrected,
      imp.explanation,
      locale,
    );

    items.push({
      id: `analysis-${turn.userMessageId}-correction`,
      messageId: turn.userMessageId,
      type: "correction",
      original: imp.original,
      corrected,
      explanation: imp.explanation,
      alternative,
      grammarPoint: focus.grammarPoint,
      example: focus.example,
    });
  }

  // Fill from remaining error turns
  for (const turn of turns) {
    if (items.length >= 8) break;
    if (!turn.corrected || !isGrammarError(turn.userMessage, turn.corrected)) {
      continue;
    }
    if (usedMessageIds.has(turn.userMessageId)) continue;
    const better = dropAddedStyleWords(turn.userMessage, turn.corrected);
    if (!better || better === turn.userMessage.trim()) continue;
    usedMessageIds.add(turn.userMessageId);
    const explanation =
      turn.explanation?.trim() ||
      t(locale, {
        ko: "조금 더 자연스러운 표현으로 다듬을 수 있어요.",
        en: "This can be polished into a more natural phrasing.",
        es: "Se puede pulir a una formulación más natural.",
      });
    const focus = buildGrammarFocus(
      turn.userMessage.trim(),
      better,
      explanation,
      locale,
    );
    items.push({
      id: `analysis-${turn.userMessageId}-correction`,
      messageId: turn.userMessageId,
      type: "correction",
      original: turn.userMessage.trim(),
      corrected: better,
      explanation,
      alternative:
        turn.natural &&
        turn.corrected &&
        turn.natural !== turn.corrected
          ? turn.natural
          : undefined,
      grammarPoint: focus.grammarPoint,
      example: focus.example,
    });
  }

  return items.slice(0, 8).map((item) => withGrammarFocus(item, locale));
}

/**
 * Resolve analysis items for UI — only incorrect / weak lines, with grammar + example.
 */
export function getReportAnalysisItems(
  report: SessionReport,
  locale: Locale = "en",
): ReportAnalysisItem[] {
  const turns = parseTurns(report.messages);
  const stored = (report.analysisItems || [])
    .filter((item) => item.type === "correction" && item.corrected)
    .map((item) => {
      const grammarCorrected = dropAddedStyleWords(
        item.original,
        item.corrected || "",
      );
      const turn = turns.find(
        (t) => t.userMessage.trim() === item.original.trim(),
      );
      const natural = (
        item.alternative ||
        turn?.natural ||
        item.corrected ||
        ""
      ).trim();
      return {
        ...item,
        corrected: grammarCorrected,
        alternative:
          natural &&
          natural.toLowerCase() !== grammarCorrected.toLowerCase() &&
          natural.toLowerCase() !== item.original.trim().toLowerCase()
            ? natural
            : undefined,
      };
    })
    .filter(
      (item) =>
        item.corrected &&
        isGrammarError(item.original, item.corrected) &&
        item.corrected.trim().toLowerCase() !==
          item.original.trim().toLowerCase(),
    );
  if (stored.length > 0) {
    return stored.map((item) => withGrammarFocus(item, locale));
  }

  return buildAnalysisItems(
    turns,
    report.strengths,
    report.improvements,
    locale,
  );
}

export type ConversationReviewEntry = {
  messageId: string;
  role: "user" | "assistant" | "helper";
  text: string;
  lightCorrection?: {
    original: string;
    natural: string;
  };
};

/** Build read-only conversation flow with optional light corrections only. */
export function buildConversationReview(
  messages: ChatMessage[],
): ConversationReviewEntry[] {
  const entries: ConversationReviewEntry[] = [];
  let pendingUser: ChatMessage | null = null;

  for (const message of messages) {
    if (message.role === "user") {
      pendingUser = message;
      continue;
    }

    if (message.role === "assistant") {
      let assistantText = message.content;
      let lightCorrection: ConversationReviewEntry["lightCorrection"];
      try {
        const parsed = JSON.parse(message.content) as CorrectionPayload;
        assistantText =
          parsed.assistantMessage ||
          parsed.correctionResult?.corrected ||
          message.content;
        const c = parsed.correctionResult;
        if (pendingUser && c?.hasError) {
          const natural = (c.natural || c.corrected || "").trim();
          const original = pendingUser.content.trim();
          if (natural && natural !== original) {
            lightCorrection = { original, natural };
          }
        }
      } catch {
        // plain text
      }

      if (pendingUser) {
        entries.push({
          messageId: pendingUser.id,
          role: "user",
          text: pendingUser.content,
          lightCorrection,
        });
        pendingUser = null;
      }
      entries.push({
        messageId: message.id,
        role: "assistant",
        text: assistantText,
      });
      continue;
    }

    if (message.role === "helper") {
      let helperText = message.content;
      try {
        const parsed = JSON.parse(message.content) as {
          expressionResult?: { expression?: string };
        };
        helperText =
          parsed.expressionResult?.expression || message.content;
      } catch {
        // plain
      }
      if (pendingUser) {
        entries.push({
          messageId: pendingUser.id,
          role: "user",
          text: pendingUser.content,
        });
        pendingUser = null;
      }
      entries.push({
        messageId: message.id,
        role: "helper",
        text: helperText,
      });
    }
  }

  if (pendingUser) {
    entries.push({
      messageId: pendingUser.id,
      role: "user",
      text: pendingUser.content,
    });
  }

  return entries;
}

export type BuildReportInput = {
  sessionId: string;
  createdAt: number;
  messages: ChatMessage[];
  messageCount: number;
  locale: Locale;
  endedAt?: number;
};

/**
 * Build a frozen learning report from a completed session transcript.
 * Heuristic “coach” analysis from real turns — does not invent user sentences.
 */
export function buildSessionReport(input: BuildReportInput): SessionReport {
  const turns = parseTurns(input.messages);
  const expressionItems = parseExpressionItems(input.messages);
  const chatTurnCount = turns.filter(
    (x) => x.assistantMessage !== undefined || x.corrected !== undefined,
  ).length;
  const endedAt = input.endedAt ?? Date.now();
  const improvements = buildImprovements(turns, input.locale);
  const strengths = buildStrengths(turns, input.locale);
  const learningItems = buildLearningItems(
    turns,
    improvements,
    input.locale,
  );
  const analysisItems = buildAnalysisItems(
    turns,
    strengths,
    improvements,
    input.locale,
  );
  const conversationAnalysis = buildHeuristicConversationAnalysis(
    input.messages,
    input.locale,
  );
  const scoreInsufficient = chatTurnCount < REPORT_MIN_TURNS_FOR_SCORE;
  const scoreBreakdown = scoreInsufficient
    ? undefined
    : computeScoreBreakdown(turns);

  return {
    id: `report-${input.sessionId}`,
    sessionId: input.sessionId,
    title: buildTitle(turns, input.locale),
    createdAt: input.createdAt,
    endedAt,
    messageCount: input.messageCount,
    messages: input.messages,
    conversationSummary: buildSummary(turns, input.locale),
    score: scoreBreakdown?.total ?? null,
    scoreInsufficient,
    ...(scoreBreakdown ? { scoreBreakdown } : {}),
    strengths,
    improvements,
    learningItems,
    ...(expressionItems.length > 0 ? { expressionItems } : {}),
    analysisItems,
    conversationAnalysis,
    conversationAnalysisVersion: CONVERSATION_ANALYSIS_VERSION,
  };
}

/**
 * Import completed conversationSessions into reports.
 * Only sessions with endedAt (explicitly finished / reported) are imported —
 * never auto-convert an in-progress chat into a report.
 */
export function migrateSessionsToReports(
  sessions: ConversationSession[],
  locale: Locale,
): SessionReport[] {
  if (typeof window === "undefined") return [];

  const existing = loadSessionReports();
  const openSessionIds = new Set(
    sessions.filter((session) => !session.endedAt).map((session) => session.id),
  );
  // Drop reports that were auto-created from chats still in progress.
  let kept = existing.filter((report) => !openSessionIds.has(report.sessionId));
  const bySession = new Set(kept.map((r) => r.sessionId));
  const added: SessionReport[] = [];

  for (const session of sessions) {
    if (bySession.has(session.id)) continue;
    if (!session.messages?.length) continue;
    if (!session.endedAt) continue;

    const report = buildSessionReport({
      sessionId: session.id,
      createdAt: session.createdAt,
      messages: session.messages,
      messageCount: session.messageCount || session.messages.length,
      locale,
      endedAt: session.endedAt,
    });
    added.push(report);
    bySession.add(session.id);
  }

  if (added.length > 0 || kept.length !== existing.length) {
    persistSessionReports([...added, ...kept]);
  }
  try {
    window.localStorage.setItem(SESSION_REPORTS_MIGRATED_KEY, "1");
  } catch {
    // ignore
  }
  return loadSessionReports();
}

export function formatReportDate(ts: number, locale: Locale): string {
  const d = new Date(ts);
  const tag = LOCALE_TAGS[locale] ?? "en-US";
  if (locale === "ko") {
    return `${d.getMonth() + 1}월 ${d.getDate()}일`;
  }
  if (locale === "ja") {
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  }
  if (locale === "zh") {
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  }
  return d.toLocaleDateString(tag, { month: "short", day: "numeric" });
}

const LOCALE_TAGS: Partial<Record<Locale, string>> = {
  ko: "ko-KR",
  en: "en-US",
  es: "es-ES",
  ja: "ja-JP",
  zh: "zh-CN",
  vi: "vi-VN",
  fr: "fr-FR",
  pt: "pt-BR",
  id: "id-ID",
};
