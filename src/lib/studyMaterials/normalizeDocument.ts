import { newStudyId } from "@/lib/studyMaterials/ids";
import {
  OCR_LAYOUT_VERSION,
  groupLinesIntoSentences,
} from "@/lib/studyMaterials/mergeSentences";
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
    const overlays: StudyImageOverlay[] = [];
    const useReadySentences = Boolean(raw.readySentences);
    const regions =
      !useReadySentences && raw.boxes?.length
        ? groupLinesIntoSentences(raw.boxes)
        : [];

    if (useReadySentences) {
      for (const block of raw.paragraphs) {
        const text = block.replace(/\s+/g, " ").trim();
        if (!text) continue;
        if (paragraphCount >= MAX_PARAGRAPHS) break;
        const sentence = {
          id: newStudyId("s"),
          text,
          position: 0,
        };
        paragraphs.push({
          id: newStudyId("p"),
          text,
          sentences: [sentence],
        });
        paragraphCount += 1;
      }
    } else if (regions.length > 0) {
      for (const region of regions) {
        if (paragraphCount >= MAX_PARAGRAPHS) break;
        const sentence = {
          id: newStudyId("s"),
          text: region.text,
          position: 0,
        };
        const paragraph: StudyParagraph = {
          id: newStudyId("p"),
          text: region.text,
          sentences: [sentence],
        };
        paragraphs.push(paragraph);
        paragraphCount += 1;
        if (raw.imageDataUrl) {
          for (const line of region.lines) {
            overlays.push({
              sentenceId: sentence.id,
              paragraphId: paragraph.id,
              x: line.x,
              y: line.y,
              w: line.w,
              h: line.h,
            });
          }
        }
      }
    } else {
      for (const block of raw.paragraphs) {
        const text = block.replace(/\s+/g, " ").trim();
        if (!text) continue;
        if (paragraphCount >= MAX_PARAGRAPHS) break;
        const sentences = splitSentences(text).map((sentence, position) => ({
          id: newStudyId("s"),
          text: sentence,
          position,
        }));
        if (sentences.length === 0) continue;
        paragraphs.push({
          id: newStudyId("p"),
          text: sentences.map((row) => row.text).join(" "),
          sentences,
        });
        paragraphCount += 1;
      }
    }
    if (
      paragraphs.length === 0 &&
      !raw.imageDataUrl &&
      !raw.keepEmpty &&
      !raw.sourcePath
    ) {
      continue;
    }
    sections.push({
      id: newStudyId("sec"),
      paragraphs,
      ...(raw.title ? { title: raw.title } : {}),
      ...(typeof raw.page === "number" ? { page: raw.page } : {}),
      ...(raw.chapter ? { chapter: raw.chapter } : {}),
      ...(raw.sourcePath ? { sourcePath: raw.sourcePath } : {}),
      ...(raw.imageDataUrl ? { imageDataUrl: raw.imageDataUrl } : {}),
      ...(overlays.length ? { overlays } : {}),
      ...(raw.imageDataUrl ? { ocrEngine: OCR_LAYOUT_VERSION } : {}),
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
  if (document.sourceFileId) return true;
  if (countSentences(document) > 0) return true;
  return document.sections.some(
    (section) =>
      Boolean(section.imageDataUrl) || typeof section.page === "number",
  );
}
