import { newStudyId } from "@/lib/studyMaterials/ids";
import { stackedOcrBox } from "@/lib/studyMaterials/ocrResult";
import { splitSentences } from "@/lib/studyMaterials/splitSentences";
import type {
  ExtractedSection,
  ReadingProgress,
  StudyDocument,
  StudyDocumentType,
  StudyImageOverlay,
  StudyParagraph,
  StudySection,
  StudySource,
} from "@/lib/studyMaterials/types";

const MAX_SECTIONS = 400;
const MAX_PARAGRAPHS = 8000;

function sourceForType(type: StudyDocumentType): StudySource {
  if (type === "txt") return "text";
  return type;
}

export function buildStudyDocument(input: {
  title: string;
  type: StudyDocumentType;
  fileName?: string;
  language?: string;
  sections: ExtractedSection[];
}): StudyDocument {
  const id = newStudyId("doc");
  const createdAt = new Date().toISOString();
  const sections: StudySection[] = [];
  let paragraphCount = 0;

  for (const raw of input.sections.slice(0, MAX_SECTIONS)) {
    const paragraphs: StudyParagraph[] = [];
    for (const block of raw.paragraphs) {
      const text = block.replace(/\s+/g, " ").trim();
      if (!text) continue;
      if (paragraphCount >= MAX_PARAGRAPHS) break;
      const keepWhole = Boolean(raw.imageDataUrl || raw.boxes?.length);
      const sentences = (keepWhole ? [text] : splitSentences(text)).map(
        (sentence, position) => ({
          id: newStudyId("s"),
          text: sentence,
          position,
        }),
      );
      if (sentences.length === 0) continue;
      paragraphs.push({
        id: newStudyId("p"),
        text,
        sentences,
      });
      paragraphCount += 1;
    }
    if (paragraphs.length === 0 && !raw.imageDataUrl) continue;
    const overlays: StudyImageOverlay[] = [];
    if (raw.imageDataUrl && raw.boxes && raw.boxes.length > 0) {
      paragraphs.forEach((paragraph, index) => {
        const sentence = paragraph.sentences[0];
        if (!sentence) return;
        const box = raw.boxes?.[index];
        const fallback = stackedOcrBox(index, paragraphs.length);
        overlays.push({
          sentenceId: sentence.id,
          paragraphId: paragraph.id,
          x: box?.x ?? fallback.x,
          y: box?.y ?? fallback.y,
          w: box?.w ?? fallback.w,
          h: box?.h ?? fallback.h,
        });
      });
    }
    sections.push({
      id: newStudyId("sec"),
      paragraphs,
      ...(raw.title ? { title: raw.title } : {}),
      ...(typeof raw.page === "number" ? { page: raw.page } : {}),
      ...(raw.chapter ? { chapter: raw.chapter } : {}),
      ...(raw.imageDataUrl ? { imageDataUrl: raw.imageDataUrl } : {}),
      ...(overlays.length ? { overlays } : {}),
    });
  }

  const progress: ReadingProgress = {
    documentId: id,
    progressPercent: 0,
    updatedAt: createdAt,
  };

  return {
    id,
    title: input.title.trim() || input.fileName || "Untitled",
    source: sourceForType(input.type),
    type: input.type,
    createdAt,
    sections,
    progress,
    stats: { savedExpressions: 0, analyzedSentences: 0 },
    ...(input.fileName ? { fileName: input.fileName } : {}),
    ...(input.language ? { language: input.language } : {}),
  };
}

export function countSentences(document: StudyDocument): number {
  let total = 0;
  for (const section of document.sections) {
    for (const paragraph of section.paragraphs) {
      total += paragraph.sentences.length;
    }
  }
  return total;
}

export function documentHasText(document: StudyDocument): boolean {
  if (countSentences(document) > 0) return true;
  return document.sections.some((section) => Boolean(section.imageDataUrl));
}
