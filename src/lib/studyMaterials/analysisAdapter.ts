import type { EnglishAnalysisTarget, EnglishInputAnalysis } from "@/lib/englishAnalysis";
import { analyzeEnglishInput } from "@/lib/englishAnalysisService";
import type {
  StudyDocument,
  StudyParagraph,
  StudySection,
  StudySentence,
} from "@/lib/studyMaterials/types";

export type StudySentenceContext = {
  previous?: string;
  selected: string;
  next?: string;
  paragraph: string;
};

export function studySentenceContext(
  paragraph: StudyParagraph,
  sentence: StudySentence,
): StudySentenceContext {
  const index = paragraph.sentences.findIndex((row) => row.id === sentence.id);
  const previous = index > 0 ? paragraph.sentences[index - 1]?.text : undefined;
  const next = index >= 0 ? paragraph.sentences[index + 1]?.text : undefined;
  return {
    selected: sentence.text,
    paragraph: paragraph.text,
    ...(previous ? { previous } : {}),
    ...(next ? { next } : {}),
  };
}

export function neighborContext(
  paragraph: StudyParagraph,
  sentence: StudySentence,
): string[] {
  const context = studySentenceContext(paragraph, sentence);
  return [context.previous, context.next].filter(
    (row): row is string => Boolean(row),
  );
}

export { selectionAnalysisTarget } from "@/lib/studyMaterials/contentSelection";

export function sentenceAnalysisTarget(input: {
  sentence: StudySentence;
  paragraph: StudyParagraph;
  selectedText?: string;
  language?: string;
}): EnglishAnalysisTarget {
  const selected = (input.selectedText || input.sentence.text)
    .replace(/\s+/g, " ")
    .trim();
  return {
    selectedText: selected,
    contextSentence: input.sentence.text,
    context: neighborContext(input.paragraph, input.sentence),
    sourceType: "web",
    intent: "sentence",
    ...(input.language ? { language: input.language } : {}),
  };
}

/** Thin adapter: existing overview analysis + surrounding sentences. */
export async function analyzeStudySentence(input: {
  sentence: StudySentence;
  paragraph: StudyParagraph;
  locale: string;
  targetLanguage: string;
}): Promise<EnglishInputAnalysis | null> {
  const context = studySentenceContext(input.paragraph, input.sentence);
  return analyzeEnglishInput({
    text: context.selected,
    locale: input.locale,
    interfaceLanguage: input.locale,
    targetLanguage: input.targetLanguage,
    sourceType: "web",
    language: input.targetLanguage,
    context: neighborContext(input.paragraph, input.sentence),
    paragraph: context.paragraph,
    ...(context.previous ? { previousContext: context.previous } : {}),
    ...(context.next ? { nextContext: context.next } : {}),
  });
}

export function locationForSentence(input: {
  document: StudyDocument;
  section: StudySection;
  paragraph: StudyParagraph;
  sentence: StudySentence;
  selectedText?: string;
  kind: "sentence" | "span";
  boundingBox?: { x: number; y: number; w: number; h: number };
}) {
  return {
    documentId: input.document.id,
    sectionId: input.section.id,
    paragraphId: input.paragraph.id,
    sentenceId: input.sentence.id,
    sourceText: input.sentence.text,
    selectedText: input.selectedText || input.sentence.text,
    kind: input.kind,
    ...(typeof input.section.page === "number"
      ? { page: input.section.page }
      : {}),
    ...(input.section.chapter ? { chapter: input.section.chapter } : {}),
    ...(input.boundingBox ? { boundingBox: input.boundingBox } : {}),
  };
}
