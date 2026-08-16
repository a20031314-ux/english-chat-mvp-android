import { buildStudyDocument } from "@/lib/studyMaterials/normalizeDocument";
import { StudyImportError, type StudyDocument } from "@/lib/studyMaterials/types";

export function extractTxtDocument(input: {
  text: string;
  fileName?: string;
}): StudyDocument {
  const paragraphs = input.text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.replace(/\n/g, " ").trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    throw new StudyImportError("no_text", "No text was found in this file.");
  }

  const title =
    paragraphs[0]?.slice(0, 80) ||
    input.fileName?.replace(/\.[^.]+$/, "") ||
    "Text";

  return buildStudyDocument({
    title,
    type: "txt",
    fileName: input.fileName,
    sections: [{ title, paragraphs }],
  });
}
