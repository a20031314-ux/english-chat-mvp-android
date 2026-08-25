import type { EnglishAnalysisTarget } from "@/lib/englishAnalysis";

export type ContentSelection = {
  text: string;
  contextSentence: string;
  previous?: string;
  next?: string;
  sectionId?: string;
  page?: number;
  boundingBox?: { x: number; y: number; w: number; h: number };
  mode?: "sentence" | "span";
};

export function neighborsAround(
  blocks: string[],
  selected: string,
): { previous?: string; next?: string; sentence: string } {
  const needle = selected.replace(/\s+/g, " ").trim();
  const index = blocks.findIndex((block) => block.includes(needle));
  const sentence = index >= 0 ? blocks[index] : needle;
  return {
    sentence,
    ...(index > 0 ? { previous: blocks[index - 1] } : {}),
    ...(index >= 0 && index < blocks.length - 1
      ? { next: blocks[index + 1] }
      : {}),
  };
}

/** Maps original-content selection onto the existing analysis target. */
export function selectionAnalysisTarget(input: {
  selectedText: string;
  contextSentence?: string;
  previous?: string;
  next?: string;
  language?: string;
  intent?: "sentence" | "word";
  sourceType?: EnglishAnalysisTarget["sourceType"];
}): EnglishAnalysisTarget {
  const selected = input.selectedText.replace(/\s+/g, " ").trim();
  const sentence =
    input.contextSentence?.replace(/\s+/g, " ").trim() || selected;
  const words = selected.split(/\s+/).filter(Boolean);
  const intent =
    input.intent ??
    (words.length <= 2 && selected.length < 42 ? "word" : "sentence");
  const context = [input.previous, input.next].filter(
    (row): row is string => Boolean(row?.trim()),
  );
  return {
    selectedText: selected,
    contextSentence: sentence,
    sourceType: input.sourceType ?? "web",
    intent,
    allowVocabSave: true,
    ...(context.length ? { context } : {}),
    ...(input.language ? { language: input.language } : {}),
  };
}
