export const REVIEW_PACK_KEY = "reviewMaterialsPack";
export const REVIEW_QUEUE_KEY = "reviewMaterialsQueue";
export const REVIEW_PACK_UPDATED_EVENT = "reviewPackUpdated";
export const REVIEW_BUSY_EVENT = "reviewBusy";

export function notifyReviewBusy(busy: boolean) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(REVIEW_BUSY_EVENT, { detail: { busy } }));
}

export type GrammarReviewCard = {
  kind: "grammar";
  id: string;
  title: string;
  explanation: string;
  original: string;
  corrected: string;
  examples: string[];
};

export type VocabSense = {
  gloss: string;
  examples: string[];
};

export type SimilarWord = {
  word: string;
  gloss: string;
};

export type VocabReviewCard = {
  kind: "vocabulary";
  id: string;
  word: string;
  senses: VocabSense[];
  similar: SimilarWord[];
};

export type ReviewCard = GrammarReviewCard | VocabReviewCard;

function sentenceKey(value: string): string {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

export function uniqueReviewSentences(
  sentences: string[],
  exclude: string[] = [],
): string[] {
  const seen = new Set(
    exclude.map(sentenceKey).filter((key) => key.length > 0),
  );
  const unique: string[] = [];
  for (const sentence of sentences) {
    const trimmed = sentence.replace(/\s+/g, " ").trim();
    const key = sentenceKey(trimmed);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(trimmed);
  }
  return unique;
}

export type ReviewPack = {
  reportId: string;
  reportTitle: string;
  locale: string;
  sourceKey: string;
  generatedAt: number;
  cards: ReviewCard[];
};

export type ReviewQueue = {
  packs: ReviewPack[];
};

function notifyUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(REVIEW_PACK_UPDATED_EVENT));
}

function isPack(value: unknown): value is ReviewPack {
  if (!value || typeof value !== "object") return false;
  const o = value as ReviewPack;
  return (
    typeof o.reportId === "string" &&
    typeof o.sourceKey === "string" &&
    Array.isArray(o.cards) &&
    o.cards.length > 0
  );
}

export function loadReviewQueue(): ReviewQueue {
  if (typeof window === "undefined") return { packs: [] };
  try {
    const queueRaw = JSON.parse(
      localStorage.getItem(REVIEW_QUEUE_KEY) || "null",
    );
    if (queueRaw && typeof queueRaw === "object" && Array.isArray(queueRaw.packs)) {
      return {
        packs: queueRaw.packs.filter(isPack),
      };
    }

    const legacy = JSON.parse(localStorage.getItem(REVIEW_PACK_KEY) || "null");
    if (legacy && typeof legacy === "object" && Array.isArray(legacy.cards)) {
      const reportId =
        typeof legacy.reportId === "string"
          ? legacy.reportId
          : typeof legacy.sourceKey === "string"
            ? legacy.sourceKey
            : "legacy";
      if (legacy.cards.length === 0) return { packs: [] };
      return {
        packs: [
          {
            reportId,
            reportTitle:
              typeof legacy.reportTitle === "string" ? legacy.reportTitle : "",
            locale: typeof legacy.locale === "string" ? legacy.locale : "ko",
            sourceKey:
              typeof legacy.sourceKey === "string"
                ? legacy.sourceKey
                : reportId,
            generatedAt:
              typeof legacy.generatedAt === "number" ? legacy.generatedAt : 0,
            cards: legacy.cards,
          },
        ],
      };
    }
  } catch {
    // ignore
  }
  return { packs: [] };
}

export function persistReviewQueue(queue: ReviewQueue) {
  if (typeof window === "undefined") return;
  localStorage.setItem(REVIEW_QUEUE_KEY, JSON.stringify(queue));
  notifyUpdated();
}

export function appendReviewPack(pack: ReviewPack) {
  const queue = loadReviewQueue();
  if (queue.packs.some((item) => item.reportId === pack.reportId)) {
    return queue;
  }
  const next = { packs: [...queue.packs, pack] };
  persistReviewQueue(next);
  return next;
}

export function completeReviewPack(reportId: string) {
  const queue = loadReviewQueue();
  persistReviewQueue({
    packs: queue.packs.filter((item) => item.reportId !== reportId),
  });
}

export function clearReviewQueue() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(REVIEW_QUEUE_KEY);
  localStorage.removeItem(REVIEW_PACK_KEY);
  notifyUpdated();
}

/** @deprecated use loadReviewQueue */
export function loadReviewPack(): ReviewPack | null {
  return loadReviewQueue().packs[0] ?? null;
}

/** @deprecated use clearReviewQueue */
export function clearReviewPack() {
  clearReviewQueue();
}
