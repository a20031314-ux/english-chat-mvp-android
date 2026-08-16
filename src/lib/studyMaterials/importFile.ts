import { extractEpubDocument } from "@/lib/studyMaterials/extractEpub";
import { extractPdfDocument } from "@/lib/studyMaterials/extractPdf";
import { extractTxtDocument } from "@/lib/studyMaterials/extractTxt";
import { documentHasText } from "@/lib/studyMaterials/normalizeDocument";
import {
  StudyImportError,
  type ImportStage,
  type StudyDocument,
  type StudyDocumentType,
} from "@/lib/studyMaterials/types";

const MAX_BYTES = 40 * 1024 * 1024;

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
  if (type.startsWith("image/") || /\.(png|jpe?g|webp|gif|bmp)$/.test(name)) {
    return "image";
  }
  return null;
}

export async function importStudyFile(
  file: File,
  onStage?: (stage: ImportStage) => void,
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
      "Image text recognition is not available yet.",
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

  if (!documentHasText(document)) {
    throw new StudyImportError("no_text", "No text was found in this file.");
  }

  onStage?.("normalizing");
  onStage?.("ready");
  return document;
}
