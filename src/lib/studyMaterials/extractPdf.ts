import { buildStudyDocument } from "@/lib/studyMaterials/normalizeDocument";
import { StudyImportError, type ExtractedSection, type StudyDocument } from "@/lib/studyMaterials/types";

function lineKey(y: number): number {
  return Math.round(y * 2) / 2;
}

export async function extractPdfDocument(input: {
  data: ArrayBuffer;
  fileName?: string;
}): Promise<StudyDocument> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  let pdf;
  try {
    pdf = await pdfjs.getDocument({
      data: new Uint8Array(input.data.slice(0)),
    }).promise;
  } catch (error) {
    const name = error && typeof error === "object" && "name" in error
      ? String((error as { name?: string }).name)
      : "";
    if (/password/i.test(name) || /password/i.test(String(error))) {
      throw new StudyImportError(
        "protected",
        "This file is protected and cannot be opened.",
      );
    }
    throw new StudyImportError("failed", "Could not read this PDF.");
  }

  const sections: ExtractedSection[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const lines = new Map<number, string[]>();
    for (const item of content.items) {
      if (!item || typeof item !== "object" || !("str" in item)) continue;
      const str = String((item as { str?: string }).str || "");
      if (!str.trim()) continue;
      const transform = (item as { transform?: number[] }).transform;
      const y = Array.isArray(transform) ? Number(transform[5]) || 0 : 0;
      const key = lineKey(y);
      const row = lines.get(key) ?? [];
      row.push(str);
      lines.set(key, row);
    }

    const ordered = [...lines.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([, parts]) => parts.join(" ").replace(/\s+/g, " ").trim())
      .filter(Boolean);

    const paragraphs: string[] = [];
    let buf: string[] = [];
    for (const line of ordered) {
      buf.push(line);
      if (line.length < 48 || /[.!?…"”']$/.test(line)) {
        paragraphs.push(buf.join(" "));
        buf = [];
      }
    }
    if (buf.length) paragraphs.push(buf.join(" "));

    sections.push({
      title: `p. ${pageNumber}`,
      page: pageNumber,
      keepEmpty: true,
      paragraphs: paragraphs.length > 0 ? paragraphs : [],
    });
  }

  const title =
    input.fileName?.replace(/\.[^.]+$/, "") ||
    sections[0]?.paragraphs[0]?.slice(0, 80) ||
    "PDF";

  if (pdf.numPages === 0) {
    throw new StudyImportError("no_text", "No pages were found in this PDF.");
  }

  return buildStudyDocument({
    title,
    type: "pdf",
    fileName: input.fileName,
    sections,
  });
}
