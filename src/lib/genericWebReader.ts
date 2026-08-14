import type { EnglishAnalysisTarget } from "@/lib/englishAnalysis";
import { inferTranslationSourceType } from "@/lib/naturalTranslation";

/**
 * Generic web selection → analysis request.
 * Site-specific adapters (Reddit, YouTube, …) can wrap this later.
 */

export type WebReaderSelection = {
  selectedText: string;
  contextSentence: string;
  surroundingContext?: string[];
  pageTitle?: string;
  sourceUrl?: string;
};

export type WebReaderAnalysisRequest =
  | { kind: "element"; target: EnglishAnalysisTarget }
  | { kind: "sentence"; text: string }
  | { kind: "invalid"; reason: "empty" };

function clean(value: unknown, max = 800) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

export function parseWebReaderSelection(raw: unknown): WebReaderSelection | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const selectedText = clean(o.selectedText, 2000);
  const contextSentence = clean(o.contextSentence, 800) || selectedText;
  if (!selectedText) return null;

  const surroundingContext: string[] = [];
  if (Array.isArray(o.surroundingContext)) {
    for (const item of o.surroundingContext) {
      const line = clean(item, 300);
      if (!line) continue;
      surroundingContext.push(line);
      if (surroundingContext.length >= 2) break;
    }
  }

  return {
    selectedText,
    contextSentence,
    ...(surroundingContext.length ? { surroundingContext } : {}),
    ...(clean(o.pageTitle, 200) ? { pageTitle: clean(o.pageTitle, 200) } : {}),
    ...(clean(o.sourceUrl, 2000)
      ? { sourceUrl: clean(o.sourceUrl, 2000) }
      : {}),
  };
}

export function isSentenceLevelSelection(
  selectedText: string,
  contextSentence: string,
) {
  const selected = selectedText.replace(/\s+/g, " ").trim();
  const context = contextSentence.replace(/\s+/g, " ").trim();
  if (!selected) return false;
  if (selected.toLowerCase() === context.toLowerCase()) return true;
  if (selected.length > context.length + 8) return true;
  return /[.!?]["']?\s+[A-Z]/.test(selected);
}

export function resolveWebReaderAnalysis(
  raw: unknown,
): WebReaderAnalysisRequest {
  const selection = parseWebReaderSelection(raw);
  if (!selection) return { kind: "invalid", reason: "empty" };

  if (
    isSentenceLevelSelection(
      selection.selectedText,
      selection.contextSentence,
    ) ||
    selection.selectedText.length > 200
  ) {
    return { kind: "sentence", text: selection.selectedText };
  }

  return {
    kind: "element",
    target: {
      selectedText: selection.selectedText,
      contextSentence: selection.contextSentence || selection.selectedText,
      sourceType: inferTranslationSourceType(selection.sourceUrl),
      ...(selection.surroundingContext?.length
        ? { context: selection.surroundingContext }
        : {}),
    },
  };
}
