import { loadEpubPackage } from "@/lib/studyMaterials/epubPackage";
import { buildStudyDocument } from "@/lib/studyMaterials/normalizeDocument";
import type { ExtractedSection, StudyDocument } from "@/lib/studyMaterials/types";

export async function extractEpubDocument(input: {
  data: ArrayBuffer;
  fileName?: string;
}): Promise<StudyDocument> {
  const pack = await loadEpubPackage(input.data);
  const title =
    pack.title !== "Book"
      ? pack.title
      : input.fileName?.replace(/\.[^.]+$/, "") || pack.title;

  const sections: ExtractedSection[] = pack.chapters.map((chapter) => ({
    title: chapter.title,
    chapter: chapter.title,
    sourcePath: chapter.path,
    paragraphs:
      chapter.paragraphs.length > 0 ? chapter.paragraphs : [chapter.title],
  }));

  return buildStudyDocument({
    title,
    type: "epub",
    fileName: input.fileName,
    sections,
  });
}
