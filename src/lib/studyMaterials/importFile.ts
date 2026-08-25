import { extractEpubDocument } from "@/lib/studyMaterials/extractEpub";
import {
  extractImageDocument,
  prepareStudyImageDataUrl,
  requestStudyImageOcr,
} from "@/lib/studyMaterials/extractImage";
import { extractPdfDocument } from "@/lib/studyMaterials/extractPdf";
import { extractTxtDocument } from "@/lib/studyMaterials/extractTxt";
import { documentHasText } from "@/lib/studyMaterials/normalizeDocument";
import { saveStudySourceFile } from "@/lib/studyMaterials/storage";
import {
  StudyImportError,
  type ExtractedSection,
  type ImportStage,
  type StudyDocument,
  type StudyDocumentType,
} from "@/lib/studyMaterials/types";
import type { LearningLanguageCode } from "@/lib/learningLanguages";

const MAX_BYTES = 40 * 1024 * 1024;
const MAX_IMAGE_PAGES = 8;

export type StudyImportOptions = {
  targetLanguage?: LearningLanguageCode | string;
};

export function detectStudyFileType(file: File): StudyDocumentType | null {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  if (name.endsWith(".pdf") || type === "application/pdf") return "pdf";
  if (name.endsWith(".epub") || type.includes("epub")) return "epub";
  if (
    name.endsWith(".txt") ||
    name.endsWith(".text") ||
    type === "text/plain"
  ) {
    return "txt";
  }
  if (
    type.startsWith("image/") ||
    /\.(png|jpe?g|webp|gif|bmp|heic|heif)$/.test(name)
  ) {
    return "image";
  }
  return null;
}

export async function importStudyFiles(
  files: File[] | FileList,
  onStage?: (stage: ImportStage) => void,
  options?: StudyImportOptions,
): Promise<StudyDocument> {
  const list = Array.from(files).filter(Boolean).slice(0, MAX_IMAGE_PAGES);
  if (list.length === 0) {
    throw new StudyImportError("unsupported", "This file type is not supported yet.");
  }
  const kinds = list.map((file) => detectStudyFileType(file));
  if (list.length > 1 && kinds.every((kind) => kind === "image")) {
    throw new StudyImportError(
      "image_ocr_unavailable",
      "Photo reading is turned off for now.",
    );
  }
  return importStudyFile(list[0], onStage, options);
}

export async function importStudyFile(
  file: File,
  onStage?: (stage: ImportStage) => void,
  options?: StudyImportOptions,
): Promise<StudyDocument> {
  if (file.size > MAX_BYTES) {
    throw new StudyImportError("too_large", "This file is too large.");
  }

  const kind = detectStudyFileType(file);
  if (!kind) {
    throw new StudyImportError("unsupported", "This file type is not supported yet.");
  }

  if (kind === "image") {
    throw new StudyImportError(
      "image_ocr_unavailable",
      "Photo reading is turned off for now.",
    );
  }

  onStage?.("reading");
  const data = await file.arrayBuffer();
  onStage?.("extracting");

  let document: StudyDocument;
  if (kind === "txt") {
    const text = new TextDecoder("utf-8", { fatal: false }).decode(data);
    document = extractTxtDocument({ text, fileName: file.name });
  } else if (kind === "pdf") {
    document = await extractPdfDocument({ data, fileName: file.name });
  } else {
    document = await extractEpubDocument({ data, fileName: file.name });
  }

  if (kind === "pdf" || kind === "epub") {
    document.sourceFileId = document.id;
  }

  if (!documentHasText(document)) {
    throw new StudyImportError("no_text", "No text was found in this file.");
  }

  if (document.sourceFileId) {
    await saveStudySourceFile({
      id: document.id,
      documentId: document.id,
      mime:
        file.type ||
        (kind === "pdf" ? "application/pdf" : "application/epub+zip"),
      name: file.name,
      blob: new Blob([data], {
        type:
          file.type ||
          (kind === "pdf" ? "application/pdf" : "application/epub+zip"),
      }),
    });
  }

  onStage?.("normalizing");
  onStage?.("ready");
  return document;
}

async function importStudyImages(
  files: File[],
  onStage?: (stage: ImportStage) => void,
  options?: StudyImportOptions,
): Promise<StudyDocument> {
  onStage?.("reading");
  const sections: ExtractedSection[] = [];
  let title = "";

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    if (file.size > MAX_BYTES) {
      throw new StudyImportError("too_large", "This file is too large.");
    }
    onStage?.("extracting");
    const image = await prepareStudyImageDataUrl(file);
    const ocr = await requestStudyImageOcr({
      image,
      targetLanguage: options?.targetLanguage,
    });
    if (!title) title = ocr.title || file.name.replace(/\.[^.]+$/, "");
    sections.push({
      page: files.length > 1 ? index + 1 : undefined,
      paragraphs: ocr.paragraphs,
      imageDataUrl: image,
      readySentences: true,
    });
  }

  onStage?.("normalizing");
  const document = extractImageDocument({
    title,
    fileName: files[0]?.name,
    sections,
  });
  if (!documentHasText(document)) {
    throw new StudyImportError("no_text", "No text was found in this file.");
  }
  onStage?.("ready");
  return document;
}
