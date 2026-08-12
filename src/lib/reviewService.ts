import { apiUrl } from "@/lib/apiBase";
import type { Locale } from "@/lib/copy";
import {
  appendReviewPack,
  loadReviewQueue,
  notifyReviewBusy,
  uniqueReviewSentences,
  type ReviewCard,
  type ReviewPack,
} from "@/lib/reviewMaterials";
import {
  collectReviewSeedsForReport,
  reportHasReviewableAnalysis,
  type ReviewSeeds,
} from "@/lib/reviewSources";
import type { SessionReport } from "@/lib/sessionReports";

const inflightReports = new Set<string>();

function fallbackCards(seeds: ReviewSeeds): ReviewCard[] {
  const cards: ReviewCard[] = [];
  for (const item of seeds.grammar) {
    const explanation = item.explanation.trim();
    if (!explanation) continue;
    if (
      item.original.toLowerCase() === item.corrected.toLowerCase()
    ) {
      continue;
    }
    cards.push({
      kind: "grammar",
      id: item.id,
      title: "",
      explanation,
      original: item.original,
      corrected: item.corrected,
      examples: uniqueReviewSentences(item.examples, [
        item.original,
        item.corrected,
      ]),
    });
  }
  for (const item of seeds.vocabulary) {
    cards.push({
      kind: "vocabulary",
      id: item.id,
      word: item.word,
      senses: [
        {
          gloss: item.gloss || item.word,
          examples: item.context ? [item.context] : [],
        },
      ],
      similar: [],
    });
  }
  return cards;
}

function normalizeCards(cards: ReviewCard[]): ReviewCard[] {
  return cards
    .filter((card) => {
      if (!card || typeof card.id !== "string") return false;
      if (card.kind === "vocabulary") return true;
      if (card.kind !== "grammar") return false;
      if (!card.explanation?.trim()) return false;
      if (
        card.original &&
        card.corrected &&
        card.original.toLowerCase() === card.corrected.toLowerCase()
      ) {
        return false;
      }
      return true;
    })
    .map((card) =>
      card.kind === "grammar"
        ? {
            ...card,
            title: "",
            examples: uniqueReviewSentences(card.examples, [
              card.original,
              card.corrected,
            ]),
          }
        : card,
    );
}

async function requestCards(
  locale: Locale,
  seeds: ReviewSeeds,
): Promise<ReviewCard[]> {
  try {
    const response = await fetch(apiUrl("/api/review-materials"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locale,
        grammar: seeds.grammar,
        vocabulary: seeds.vocabulary,
      }),
    });
    if (response.ok) {
      const data = (await response.json()) as { cards?: ReviewCard[] };
      const cards = normalizeCards(data.cards || []);
      if (cards.length > 0) return cards;
    }
  } catch (error) {
    console.error("[review] generate failed, using report fallback", error);
  }
  return fallbackCards(seeds);
}

export async function generateReviewPackForReport(
  locale: Locale,
  report: SessionReport,
): Promise<ReviewPack | null> {
  if (!reportHasReviewableAnalysis(report)) return null;

  const existing = loadReviewQueue().packs.find(
    (pack) => pack.reportId === report.id,
  );
  if (existing) return existing;
  if (inflightReports.has(report.id)) return null;

  inflightReports.add(report.id);
  notifyReviewBusy(true);
  try {
    if (loadReviewQueue().packs.some((pack) => pack.reportId === report.id)) {
      return (
        loadReviewQueue().packs.find((pack) => pack.reportId === report.id) ??
        null
      );
    }

    const seeds = collectReviewSeedsForReport(report);
    const cards = await requestCards(locale, seeds);
    if (cards.length === 0) return null;

    const pack: ReviewPack = {
      reportId: report.id,
      reportTitle: report.title?.trim() || "",
      locale,
      sourceKey: seeds.sourceKey,
      generatedAt: Date.now(),
      cards,
    };
    appendReviewPack(pack);
    return pack;
  } finally {
    inflightReports.delete(report.id);
    notifyReviewBusy(inflightReports.size > 0);
  }
}

export async function prepareReviewAfterReport(
  locale: Locale,
  report: SessionReport,
): Promise<ReviewPack | null> {
  try {
    return await generateReviewPackForReport(locale, report);
  } catch (error) {
    console.error("[review] prepare after report failed", error);
    return null;
  }
}
