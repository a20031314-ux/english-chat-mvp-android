import { apiUrl } from "@/lib/apiBase";
import { parseStudyOcrResult, type StudyOcrResult } from "@/lib/studyMaterials/ocrResult";
import { OCR_LAYOUT_VERSION } from "@/lib/studyMaterials/mergeSentences";
import { buildStudyDocument } from "@/lib/studyMaterials/normalizeDocument";
import {
  StudyImportError,
  type ExtractedSection,
  type StudyDocument,
  type StudySection,
} from "@/lib/studyMaterials/types";
import type { LearningLanguageCode } from "@/lib/learningLanguages";

const MAX_EDGE = 1600;
const JPEG_QUALITY = 0.82;
const MAX_DATA_URL_CHARS = 3_500_000;

export function extractImageDocument(input: {
  title?: string;
  fileName?: string;
  sections: ExtractedSection[];
}): StudyDocument {
  const title =
    input.fileName?.replace(/\.[^.]+$/, "") ||
    input.title?.trim() ||
    "Image";
  return buildStudyDocument({
    title,
    type: "image",
    fileName: input.fileName,
    sections: input.sections,
  });
}

export async function prepareStudyImageDataUrl(file: File): Promise<string> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new StudyImportError(
      "image_ocr_unavailable",
      "This image could not be opened.",
    );
  }

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new StudyImportError("failed", "Could not read this image.");
  }
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (next) => (next ? resolve(next) : reject(new Error("encode failed"))),
      "image/jpeg",
      JPEG_QUALITY,
    );
  });

  const dataUrl = await blobToDataUrl(blob);
  if (dataUrl.length > MAX_DATA_URL_CHARS) {
    throw new StudyImportError("too_large", "This file is too large.");
  }
  return dataUrl;
}

export function applyOcrToImageSection(
  section: StudySection,
  ocr: StudyOcrResult,
): StudySection {
  const rebuilt = buildStudyDocument({
    title: section.title || "Image",
    type: "image",
    sections: [
      {
        title: section.title,
        page: section.page,
        paragraphs: ocr.paragraphs,
        readySentences: true,
        imageDataUrl: section.imageDataUrl,
      },
    ],
  }).sections[0];
  if (!rebuilt) {
    return { ...section, lineBoxes: true, ocrEngine: OCR_LAYOUT_VERSION };
  }
  return {
    ...rebuilt,
    id: section.id,
    lineBoxes: true,
    ocrEngine: OCR_LAYOUT_VERSION,
  };
}

export async function requestStudyImageOcr(input: {
  image: string;
  targetLanguage?: LearningLanguageCode | string;
}): Promise<StudyOcrResult> {
  try {
    const response = await fetch(apiUrl("/api/study-ocr"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: input.image,
        targetLanguage: input.targetLanguage,
      }),
    });
    if (!response.ok) {
      return { title: "", paragraphs: [], boxes: [] };
    }
    return parseStudyOcrResult((await response.json()) as unknown);
  } catch {
    return { title: "", paragraphs: [], boxes: [] };
  }
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("encode failed"));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
