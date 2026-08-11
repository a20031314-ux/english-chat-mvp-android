import { isGrammarError } from "@/lib/correctionNorm";
import type { SessionReport } from "@/lib/sessionReports";
import { loadVocabulary, type VocabularyEntry } from "@/lib/vocabulary";

export type GrammarReviewSeed = {
  id: string;
  title: string;
  original: string;
  corrected: string;
  explanation: string;
  examples: string[];
  sourceReportId: string | null;
};

export type VocabReviewSeed = {
  id: string;
  word: string;
  gloss: string;
  context: string;
  sourceReportId: string | null;
};

export type ReviewSeeds = {
  sourceKey: string;
  reportId: string | null;
  grammar: GrammarReviewSeed[];
  vocabulary: VocabReviewSeed[];
};

const PER_TYPE_LIMIT = 16;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function wordAppearsInText(word: string, haystack: string): boolean {
  const trimmed = word.trim();
  if (!trimmed) return false;
  const pattern = new RegExp(`\\b${escapeRegExp(trimmed)}\\b`, "i");
  return pattern.test(haystack);
}

function reportSearchText(report: SessionReport): string {
  const parts: string[] = [];
  for (const message of report.messages || []) {
    if (message.content) parts.push(message.content);
  }
  for (const item of report.improvements || []) {
    parts.push(item.original, item.better);
  }
  for (const item of report.analysisItems || []) {
    parts.push(item.original, item.corrected || "");
  }
  for (const item of report.learningItems || []) {
    parts.push(item.expression);
  }
  return parts.join("\n");
}

function wasSavedDuringReport(entry: VocabularyEntry, report: SessionReport): boolean {
  const start = report.createdAt;
  const end = (report.endedAt || report.createdAt) + 120_000;
  return entry.createdAt >= start && entry.createdAt <= end;
}

function seedsFromReport(report: SessionReport): {
  grammar: GrammarReviewSeed[];
  vocabulary: VocabReviewSeed[];
} {
  const grammar: GrammarReviewSeed[] = [];
  const vocabulary: VocabReviewSeed[] = [];
  const seenGrammar = new Set<string>();
  const seenVocab = new Set<string>();

  const pushGrammar = (seed: GrammarReviewSeed) => {
    const original = seed.original.trim();
    const corrected = seed.corrected.trim();
    const key =
      original && corrected
        ? `${original.toLowerCase()}::${corrected.toLowerCase()}`
        : seed.id;
    if (seenGrammar.has(key) || grammar.length >= PER_TYPE_LIMIT) return;
    if (!original && !corrected && !seed.explanation.trim()) return;
    seenGrammar.add(key);
    grammar.push({ ...seed, original, corrected });
  };

  const pushVocab = (seed: VocabReviewSeed) => {
    const key = seed.word.toLowerCase();
    if (seenVocab.has(key) || vocabulary.length >= PER_TYPE_LIMIT) return;
    if (!seed.word.trim() || seed.word.trim().split(/\s+/).length > 3) return;
    seenVocab.add(key);
    vocabulary.push(seed);
  };

  for (const item of report.improvements || []) {
    if (!isGrammarError(item.original, item.better)) continue;
    pushGrammar({
      id: `g-${report.id}-${grammar.length}`,
      title: item.explanation.slice(0, 48) || "Grammar",
      original: item.original,
      corrected: item.better,
      explanation: item.explanation,
      examples: [],
      sourceReportId: report.id,
    });
  }

  for (const item of report.analysisItems || []) {
    if (item.type !== "correction" || !item.corrected) continue;
    if (!isGrammarError(item.original, item.corrected)) continue;
    pushGrammar({
      id: item.id || `g-a-${report.id}-${grammar.length}`,
      title: item.grammarPoint?.trim() || item.explanation.slice(0, 48) || "Grammar",
      original: item.original,
      corrected: item.corrected,
      explanation: item.explanation,
      examples:
        item.example?.trim() &&
        item.example.trim().toLowerCase() !== item.original.trim().toLowerCase() &&
        item.example.trim().toLowerCase() !== item.corrected.trim().toLowerCase()
          ? [item.example.trim()]
          : [],
      sourceReportId: report.id,
    });
  }

  for (const item of report.learningItems || []) {
    const expression = item.expression.trim();
    if (!expression) continue;
    if (!expression.includes("~") && expression.split(/\s+/).length <= 3) continue;
    pushGrammar({
      id: `g-learn-${report.id}-${expression}`,
      title: item.reason.slice(0, 48) || expression,
      original: expression,
      corrected: expression,
      explanation: item.reason,
      examples: [],
      sourceReportId: report.id,
    });
  }

  const haystack = reportSearchText(report);
  const saved = [...loadVocabulary()].sort(
    (a, b) => b.word.trim().length - a.word.trim().length,
  );
  for (const entry of saved) {
    if (
      !wasSavedDuringReport(entry, report) &&
      !wordAppearsInText(entry.word, haystack)
    ) {
      continue;
    }
    pushVocab({
      id: entry.id,
      word: entry.word,
      gloss: entry.gloss,
      context: entry.example || "",
      sourceReportId: report.id,
    });
  }

  return { grammar, vocabulary };
}

function hasReviewableAnalysis(seeds: {
  grammar: GrammarReviewSeed[];
  vocabulary: VocabReviewSeed[];
}): boolean {
  const realGrammar = seeds.grammar.some(
    (item) =>
      item.original &&
      item.corrected &&
      item.original.toLowerCase() !== item.corrected.toLowerCase(),
  );
  return realGrammar || seeds.vocabulary.length > 0;
}

export function collectReviewSeedsForReport(report: SessionReport): ReviewSeeds {
  const { grammar, vocabulary } = seedsFromReport(report);
  return {
    sourceKey: `report:${report.id}:${report.createdAt}`,
    reportId: report.id,
    grammar,
    vocabulary,
  };
}

export function reportHasReviewableAnalysis(report: SessionReport): boolean {
  return hasReviewableAnalysis(seedsFromReport(report));
}
