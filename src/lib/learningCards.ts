import {
  coerceLanguageCode,
  type LearningLanguageCode,
} from "@/lib/learningLanguages";

export const LEARNING_CARDS_KEY = "learningCards";

/** Legacy recall confidence from the previous review flow */
export const LEARNING_REVIEW_KEY = "learningCardReview";

export type ReviewLevel = "forgot" | "vague" | "familiar";
export type LearningStatus = "new" | "practicing" | "usable";

export type LearningCard = {
  id: number;
  original: string;
  corrected: string;
  explanation: string;
  /** More native/natural wording when distinct from corrected */
  natural?: string;
  /** Learning language this card belongs to (legacy → "en") */
  languageCode: LearningLanguageCode;
  /** ms since epoch */
  createdAt: number;
  /** Legacy name kept readable so old localStorage cards continue to work */
  savedAt?: number;
  status: LearningStatus;
  reviewCount: number;
  lastReviewedAt: number | null;
};

export type ReviewMap = Record<string, ReviewLevel>;

export function normalizeLearningCard(raw: unknown): LearningCard | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "number") {
    return null;
  }
  if (typeof o.original !== "string") {
    return null;
  }
  if (typeof o.corrected !== "string") {
    return null;
  }
  if (typeof o.explanation !== "string") {
    return null;
  }
  const natural =
    typeof o.natural === "string" && o.natural.trim()
      ? o.natural.trim()
      : undefined;
  const savedAt = typeof o.savedAt === "number" ? o.savedAt : undefined;
  const createdAt =
    typeof o.createdAt === "number"
      ? o.createdAt
      : savedAt !== undefined
        ? savedAt
        : o.id;
  const status: LearningStatus =
    o.status === "usable" || o.status === "mastered"
      ? "usable"
      : o.status === "practicing" || o.status === "new"
        ? o.status
        : "new";
  const reviewCount =
    typeof o.reviewCount === "number" && Number.isFinite(o.reviewCount)
      ? Math.max(0, Math.floor(o.reviewCount))
      : 0;
  const lastReviewedAt =
    typeof o.lastReviewedAt === "number" && Number.isFinite(o.lastReviewedAt)
      ? o.lastReviewedAt
      : null;
  return {
    id: o.id,
    original: o.original,
    corrected: o.corrected,
    explanation: o.explanation,
    languageCode: coerceLanguageCode(o.languageCode),
    createdAt,
    status,
    reviewCount,
    lastReviewedAt,
    ...(natural ? { natural } : {}),
    ...(savedAt !== undefined ? { savedAt } : {}),
  };
}

export function loadLearningCards(): LearningCard[] {
  try {
    const data = JSON.parse(localStorage.getItem(LEARNING_CARDS_KEY) || "[]");
    if (!Array.isArray(data)) {
      return [];
    }
    const cards = data
      .map(normalizeLearningCard)
      .filter((c): c is LearningCard => c !== null);
    const needsRewrite = data.some(
      (row) =>
        row &&
        typeof row === "object" &&
        (row as Record<string, unknown>).languageCode == null,
    );
    if (needsRewrite && cards.length > 0) {
      persistLearningCards(cards);
    }
    return cards;
  } catch {
    return [];
  }
}

export function filterLearningCardsByLanguage(
  cards: LearningCard[],
  languageCode: LearningLanguageCode,
): LearningCard[] {
  return cards.filter((c) => c.languageCode === languageCode);
}

export function persistLearningCards(cards: LearningCard[]) {
  localStorage.setItem(LEARNING_CARDS_KEY, JSON.stringify(cards));
}

export function loadReviewMap(): ReviewMap {
  try {
    const data = JSON.parse(localStorage.getItem(LEARNING_REVIEW_KEY) || "{}");
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      return {};
    }
    const out: ReviewMap = {};
    for (const [k, v] of Object.entries(data)) {
      if (v === "forgot" || v === "vague" || v === "familiar") {
        out[k] = v;
      }
    }
    return out;
  } catch {
    return {};
  }
}

export function persistReviewMap(map: ReviewMap) {
  localStorage.setItem(LEARNING_REVIEW_KEY, JSON.stringify(map));
}

export function setReviewLevel(cardId: number, level: ReviewLevel) {
  const map = loadReviewMap();
  map[String(cardId)] = level;
  persistReviewMap(map);
}

export function removeReviewEntry(cardId: number) {
  const map = loadReviewMap();
  delete map[String(cardId)];
  persistReviewMap(map);
}

export function startOfLocalDayMs(now = Date.now()): number {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function countSavedToday(cards: LearningCard[]): number {
  const start = startOfLocalDayMs();
  return cards.filter((c) => c.createdAt >= start).length;
}

export function countByStatus(cards: LearningCard[], status: LearningStatus): number {
  return cards.filter((c) => c.status === status).length;
}

export function shouldShowNatural(card: LearningCard): boolean {
  const n = card.natural?.trim();
  if (!n) {
    return false;
  }
  const c = card.corrected.replace(/\s+/g, " ").trim();
  return n.replace(/\s+/g, " ").trim() !== c;
}

export function applyReviewLevel(card: LearningCard, level: ReviewLevel): LearningCard {
  const status: LearningStatus = level === "familiar" ? "usable" : "practicing";
  return {
    ...card,
    status,
    reviewCount: card.reviewCount + 1,
    lastReviewedAt: Date.now(),
  };
}

export function isReviewQueueCard(card: LearningCard): boolean {
  return card.status === "new" || card.status === "practicing";
}

