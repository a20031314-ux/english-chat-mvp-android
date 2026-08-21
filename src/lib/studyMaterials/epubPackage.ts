import JSZip from "jszip";
import { splitSentences } from "@/lib/studyMaterials/splitSentences";
import { StudyImportError } from "@/lib/studyMaterials/types";

export type EpubChapter = {
  path: string;
  title: string;
  html: string;
  paragraphs: string[];
};

export type EpubPackage = {
  title: string;
  chapters: EpubChapter[];
};

function attr(el: Element | null, name: string): string {
  return el?.getAttribute(name) || "";
}

export function resolveEpubHref(basePath: string, href: string): string {
  const clean = href.split("#")[0] || href;
  const base = basePath.split("/").slice(0, -1).join("/");
  const joined = [base, clean].filter(Boolean).join("/");
  return joined.replace(/\/+/g, "/").replace(/^\//, "");
}

function paragraphsFromHtml(html: string): { title?: string; paragraphs: string[] } {
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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function wrapSentencesInDocument(doc: Document) {
  const blocks = [
    ...doc.querySelectorAll("p, li, blockquote, h1, h2, h3, h4"),
  ];
  for (const el of blocks) {
    if (el.closest(".study-s")) continue;
    if (el.querySelector("img, table, svg, .study-s")) continue;
    const text = el.textContent?.replace(/\s+/g, " ").trim() || "";
    if (text.length < 2) continue;
    const parts = splitSentences(text);
    if (parts.length === 0) continue;
    el.innerHTML = parts
      .map((part) => {
        const safe = escapeHtml(part);
        return `<span class="study-s" data-study-sentence="${safe}">${safe}</span>`;
      })
      .join(" ");
  }
}

function sanitizeChapterDom(parsed: Document) {
  parsed
    .querySelectorAll("script, iframe, object, embed, form, link[rel='preload']")
    .forEach((node) => node.remove());
  parsed.querySelectorAll("*").forEach((el) => {
    for (const named of [...el.attributes]) {
      const name = named.name;
      const value = named.value.trim().toLowerCase();
      if (/^on/i.test(name) || value.startsWith("javascript:")) {
        el.removeAttribute(name);
      }
    }
  });
}

export async function loadEpubPackage(data: ArrayBuffer): Promise<EpubPackage> {
  const zip = await JSZip.loadAsync(data);
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
  const opfPath = attr(container.querySelector("rootfile"), "full-path");
  if (!opfPath) {
    throw new StudyImportError("failed", "Could not find the EPUB package file.");
  }

  const opfXml = await zip.file(opfPath)?.async("string");
  if (!opfXml) {
    throw new StudyImportError("failed", "Could not read the EPUB package file.");
  }
  const opf = new DOMParser().parseFromString(opfXml, "application/xml");
  const title = opf.querySelector("title")?.textContent?.trim() || "Book";

  const manifest = new Map<string, string>();
  opf.querySelectorAll("manifest > item").forEach((item) => {
    const id = attr(item, "id");
    const href = attr(item, "href");
    if (id && href) manifest.set(id, href);
  });

  const chapters: EpubChapter[] = [];
  let chapterIndex = 0;
  for (const itemref of [...opf.querySelectorAll("spine > itemref")]) {
    const idref = attr(itemref, "idref");
    const href = idref ? manifest.get(idref) : "";
    if (!href) continue;
    const path = resolveEpubHref(opfPath, href);
    const file = zip.file(path) || zip.file(decodeURIComponent(path));
    if (!file) continue;
    const html = await file.async("string");
    const extracted = paragraphsFromHtml(html);
    const paragraphs = extracted.paragraphs.filter(
      (block, index) =>
        !(index === 0 && extracted.title && block === extracted.title),
    );
    if (paragraphs.length === 0 && !html.includes("<img")) continue;
    chapterIndex += 1;
    chapters.push({
      path,
      title: extracted.title || `Chapter ${chapterIndex}`,
      html,
      paragraphs: paragraphs.length > 0 ? paragraphs : extracted.paragraphs,
    });
  }

  if (chapters.length === 0) {
    throw new StudyImportError("no_text", "No text was found in this EPUB.");
  }

  return { title, chapters };
}

async function blobUrlForPath(
  zip: JSZip,
  path: string,
  cache: Map<string, string>,
): Promise<string | null> {
  const existing = cache.get(path);
  if (existing) return existing;
  const file = zip.file(path) || zip.file(decodeURIComponent(path));
  if (!file) return null;
  const blob = await file.async("blob");
  const url = URL.createObjectURL(blob);
  cache.set(path, url);
  return url;
}

export async function prepareEpubChapterHtml(input: {
  zip: JSZip;
  chapterPath: string;
  html: string;
  blobUrls: Map<string, string>;
}): Promise<string> {
  const parsed = new DOMParser().parseFromString(input.html, "text/html");
  sanitizeChapterDom(parsed);

  const rewrite = async (value: string | null) => {
    if (!value || /^(https?:|data:|blob:|#)/i.test(value)) return value;
    const path = resolveEpubHref(input.chapterPath, value);
    return (await blobUrlForPath(input.zip, path, input.blobUrls)) || value;
  };

  for (const img of [...parsed.querySelectorAll("img")]) {
    const src = await rewrite(img.getAttribute("src"));
    if (src) img.setAttribute("src", src);
  }
  for (const image of [...parsed.querySelectorAll("image")]) {
    const href =
      image.getAttribute("href") || image.getAttribute("xlink:href");
    const next = await rewrite(href);
    if (next) {
      image.setAttribute("href", next);
      image.setAttribute("xlink:href", next);
    }
  }

  const styles: string[] = [
    `html,body{margin:0;padding:0;background:#fff;color:#1e293b;}
     body{font-family:Georgia,"Times New Roman",serif;font-size:18px;line-height:1.75;padding:1.25rem 1.1rem 3rem;max-width:42rem;margin:0 auto;}
     img,svg,video{max-width:100%;height:auto;}
     a{color:inherit;text-decoration:underline;text-underline-offset:2px;}
     h1,h2,h3{font-family:Georgia,serif;line-height:1.3;letter-spacing:.01em;}
     p{margin:0 0 1em;}
     .study-s{cursor:pointer;border-radius:4px;}
     .study-s:hover{background:#fef3c7;}
     .study-s.is-on{background:#fde68a;}
     ::selection{background:#fde68a;}`,
  ];
  for (const link of [...parsed.querySelectorAll("link[rel='stylesheet']")]) {
    const href = link.getAttribute("href");
    const path = href ? resolveEpubHref(input.chapterPath, href) : "";
    const file = path
      ? input.zip.file(path) || input.zip.file(decodeURIComponent(path))
      : null;
    if (file) {
      styles.push(await file.async("string"));
    }
    link.remove();
  }

  const style = parsed.createElement("style");
  style.textContent = styles.join("\n");
  parsed.head.appendChild(style);
  wrapSentencesInDocument(parsed);
  return "<!DOCTYPE html>" + parsed.documentElement.outerHTML;
}

export function neighborTextFromSelection(
  root: Document | HTMLElement,
  selected: string,
): { previous?: string; next?: string; sentence: string } {
  const block =
    root instanceof Document
      ? root.getSelection()?.anchorNode
      : null;
  const node =
    block && "nodeType" in block
      ? block.nodeType === Node.TEXT_NODE
        ? block.parentElement
        : (block as Element)
      : null;
  const container =
    node?.closest("p, li, blockquote, h1, h2, h3, h4, td, div") ||
    node ||
    null;
  const sentence = (container?.textContent || selected)
    .replace(/\s+/g, " ")
    .trim();
  const siblings = container?.parentElement
    ? [...container.parentElement.children].filter((el) =>
        /^(P|LI|BLOCKQUOTE|H1|H2|H3|H4)$/i.test(el.tagName),
      )
    : [];
  const index = container ? siblings.indexOf(container as Element) : -1;
  const previous =
    index > 0
      ? siblings[index - 1]?.textContent?.replace(/\s+/g, " ").trim()
      : undefined;
  const next =
    index >= 0
      ? siblings[index + 1]?.textContent?.replace(/\s+/g, " ").trim()
      : undefined;
  return {
    sentence,
    ...(previous ? { previous } : {}),
    ...(next ? { next } : {}),
  };
}

export function revokeBlobUrls(urls: Map<string, string>) {
  for (const url of urls.values()) URL.revokeObjectURL(url);
  urls.clear();
}
