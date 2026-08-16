import JSZip from "jszip";
import { buildStudyDocument } from "@/lib/studyMaterials/normalizeDocument";
import {
  StudyImportError,
  type ExtractedSection,
  type StudyDocument,
} from "@/lib/studyMaterials/types";

function textContent(html: string): { title?: string; paragraphs: string[] } {
  const parsed = new DOMParser().parseFromString(html, "text/html");
  parsed
    .querySelectorAll("script, style, nav, header, footer")
    .forEach((node) => node.remove());

  const heading =
    parsed.querySelector("h1, h2, h3")?.textContent?.replace(/\s+/g, " ").trim() ||
    undefined;

  const blocks = parsed.querySelectorAll("p, h1, h2, h3, h4, li, blockquote");
  const paragraphs: string[] = [];
  if (blocks.length > 0) {
    blocks.forEach((node) => {
      const text = node.textContent?.replace(/\s+/g, " ").trim();
      if (text) paragraphs.push(text);
    });
  } else {
    const body = parsed.body?.textContent?.replace(/\s+/g, " ").trim();
    if (body) paragraphs.push(body);
  }
  return { title: heading, paragraphs };
}

function attr(el: Element | null, name: string): string {
  return el?.getAttribute(name) || "";
}

function resolveHref(opfPath: string, href: string): string {
  const base = opfPath.split("/").slice(0, -1).join("/");
  const joined = [base, href].filter(Boolean).join("/");
  return joined.replace(/\/+/g, "/").replace(/^\//, "");
}

export async function extractEpubDocument(input: {
  data: ArrayBuffer;
  fileName?: string;
}): Promise<StudyDocument> {
  const zip = await JSZip.loadAsync(input.data);
  if (zip.file("META-INF/encryption.xml")) {
    throw new StudyImportError(
      "protected",
      "This file is protected and cannot be opened.",
    );
  }

  const containerXml = await zip.file("META-INF/container.xml")?.async("string");
  if (!containerXml) {
    throw new StudyImportError("failed", "This EPUB is missing a container file.");
  }
  const container = new DOMParser().parseFromString(
    containerXml,
    "application/xml",
  );
  const rootfile = container.querySelector("rootfile");
  const opfPath = attr(rootfile, "full-path");
  if (!opfPath) {
    throw new StudyImportError("failed", "Could not find the EPUB package file.");
  }

  const opfXml = await zip.file(opfPath)?.async("string");
  if (!opfXml) {
    throw new StudyImportError("failed", "Could not read the EPUB package file.");
  }
  const opf = new DOMParser().parseFromString(opfXml, "application/xml");
  const title =
    opf.querySelector("title")?.textContent?.trim() ||
    input.fileName?.replace(/\.[^.]+$/, "") ||
    "Book";

  const manifest = new Map<string, string>();
  opf.querySelectorAll("manifest > item").forEach((item) => {
    const id = attr(item, "id");
    const href = attr(item, "href");
    if (id && href) manifest.set(id, href);
  });

  const sections: ExtractedSection[] = [];
  const spine = [...opf.querySelectorAll("spine > itemref")];
  let chapterIndex = 0;
  for (const itemref of spine) {
    const idref = attr(itemref, "idref");
    const href = idref ? manifest.get(idref) : "";
    if (!href) continue;
    const path = resolveHref(opfPath, href.split("#")[0] || href);
    const file = zip.file(path) || zip.file(decodeURIComponent(path));
    if (!file) continue;
    const html = await file.async("string");
    const extracted = textContent(html);
    const paragraphs = extracted.paragraphs.filter(
      (block, index) =>
        !(index === 0 && extracted.title && block === extracted.title),
    );
    if (paragraphs.length === 0) continue;
    chapterIndex += 1;
    const chapterTitle = extracted.title || `Chapter ${chapterIndex}`;
    sections.push({
      title: chapterTitle,
      chapter: chapterTitle,
      paragraphs,
    });
  }

  if (sections.length === 0) {
    throw new StudyImportError("no_text", "No text was found in this EPUB.");
  }

  return buildStudyDocument({
    title,
    type: "epub",
    fileName: input.fileName,
    sections,
  });
}
