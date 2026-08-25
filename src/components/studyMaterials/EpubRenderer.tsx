"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import JSZip from "jszip";
import { ZoomableStage } from "@/components/studyMaterials/ZoomableStage";
import type { UICopy } from "@/lib/copy";
import type { ContentSelection } from "@/lib/studyMaterials/contentSelection";
import {
  neighborTextFromSelection,
  prepareEpubChapterHtml,
  resolveEpubHref,
  revokeBlobUrls,
} from "@/lib/studyMaterials/epubPackage";
import { getStudySourceFile } from "@/lib/studyMaterials/storage";
import type { StudyDocument, StudySection } from "@/lib/studyMaterials/types";

export function EpubRenderer({
  document,
  ui,
  onSelection,
  onChapter,
}: {
  document: StudyDocument;
  ui: UICopy;
  onSelection: (selection: ContentSelection | null) => void;
  onChapter: (section: StudySection, index: number) => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const blobUrls = useRef(new Map<string, string>());
  const zipRef = useRef<JSZip | null>(null);
  const onSelectionRef = useRef(onSelection);
  onSelectionRef.current = onSelection;
  const [srcdoc, setSrcdoc] = useState("");
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const chapterIndex = useMemo(() => {
    const id = document.progress.sectionId;
    const found = document.sections.findIndex((row) => row.id === id);
    return found >= 0 ? found : 0;
  }, [document.progress.sectionId, document.sections]);

  const section = document.sections[chapterIndex] ?? document.sections[0];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFailed(false);
    setSrcdoc("");
    onSelectionRef.current(null);
    void (async () => {
      try {
        if (!zipRef.current) {
          const file = await getStudySourceFile(document.id);
          if (!file) throw new Error("missing source");
          zipRef.current = await JSZip.loadAsync(await file.blob.arrayBuffer());
        }
        const zip = zipRef.current;
        const path = section?.sourcePath;
        if (!path || !section) throw new Error("missing chapter");
        const entry =
          zip.file(path) ||
          zip.file(decodeURIComponent(path)) ||
          zip.file(resolveEpubHref("", path));
        if (!entry) throw new Error("missing html");
        const html = await entry.async("string");
        const prepared = await prepareEpubChapterHtml({
          zip,
          chapterPath: path,
          html,
          blobUrls: blobUrls.current,
        });
        if (!cancelled) setSrcdoc(prepared);
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chapterIndex, document.id, section?.id, section?.sourcePath]);

  useEffect(() => {
    return () => revokeBlobUrls(blobUrls.current);
  }, []);

  const onChapterRef = useRef(onChapter);
  onChapterRef.current = onChapter;

  useEffect(() => {
    if (section) onChapterRef.current(section, chapterIndex);
  }, [chapterIndex, section]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !srcdoc) return;
    const chapterId = section?.id;
    let onSelect: (() => void) | null = null;
    let onClick: ((event: MouseEvent) => void) | null = null;

    const attach = () => {
      const doc = iframe.contentDocument;
      if (!doc || onSelect) return;
      const resize = () => {
        const height = Math.max(
          doc.documentElement.scrollHeight,
          doc.body?.scrollHeight || 0,
          480,
        );
        iframe.style.height = `${height}px`;
      };
      resize();
      const emitSentence = (node: Element) => {
        const text =
          node.getAttribute("data-study-sentence")?.replace(/\s+/g, " ").trim() ||
          "";
        if (!text) return;
        doc.querySelectorAll(".study-s.is-on").forEach((el) => {
          el.classList.remove("is-on");
        });
        const wrap = node.closest(".study-s");
        wrap?.classList.add("is-on");
        const siblings = wrap?.parentElement
          ? [...wrap.parentElement.querySelectorAll(":scope > .study-s")]
          : [];
        const index = wrap ? siblings.indexOf(wrap) : -1;
        const previous =
          index > 0
            ? siblings[index - 1]?.getAttribute("data-study-sentence") || undefined
            : undefined;
        const next =
          index >= 0
            ? siblings[index + 1]?.getAttribute("data-study-sentence") || undefined
            : undefined;
        onSelectionRef.current({
          text,
          contextSentence: text,
          sectionId: chapterId,
          mode: "sentence",
          ...(previous ? { previous } : {}),
          ...(next ? { next } : {}),
        });
      };
      onClick = (event: MouseEvent) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const rail = target.closest(".study-s");
        if (!rail) return;
        event.preventDefault();
        event.stopPropagation();
        emitSentence(rail);
      };
      onSelect = () => {
        const text =
          doc.getSelection()?.toString().replace(/\s+/g, " ").trim() || "";
        if (text.length < 2) return;
        const around = neighborTextFromSelection(doc, text);
        onSelectionRef.current({
          text,
          contextSentence: around.sentence,
          sectionId: chapterId,
          mode: "span",
          ...(around.previous ? { previous: around.previous } : {}),
          ...(around.next ? { next: around.next } : {}),
        });
      };
      doc.addEventListener("click", onClick);
      doc.addEventListener("mouseup", onSelect);
      doc.addEventListener("touchend", onSelect);
    };

    iframe.addEventListener("load", attach);
    if (iframe.contentDocument?.readyState === "complete") attach();
    return () => {
      iframe.removeEventListener("load", attach);
      const doc = iframe.contentDocument;
      if (doc && onSelect) {
        doc.removeEventListener("mouseup", onSelect);
        doc.removeEventListener("touchend", onSelect);
      }
      if (doc && onClick) doc.removeEventListener("click", onClick);
    };
  }, [section?.id, srcdoc]);

  const go = (delta: number) => {
    const row = document.sections[chapterIndex + delta];
    if (!row) return;
    onSelectionRef.current(null);
    onChapter(row, chapterIndex + delta);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ZoomableStage
        zoomInLabel={ui.studyZoomIn}
        zoomOutLabel={ui.studyZoomOut}
      >
        {loading ? (
          <p className="px-4 py-10 text-center text-sm text-slate-500">
            {ui.studyStageReading}
          </p>
        ) : null}
        {failed ? (
          <p className="px-4 py-10 text-center text-sm text-slate-500">
            {ui.studyFailed}
          </p>
        ) : null}
        {srcdoc ? (
          <iframe
            ref={iframeRef}
            title={section?.title || document.title}
            sandbox="allow-same-origin"
            srcDoc={srcdoc}
            className="block w-full border-0 bg-white"
          />
        ) : null}
      </ZoomableStage>
      <div className="flex shrink-0 items-center justify-between gap-2 border-t border-white/10 bg-[#0a0a0a] px-3 py-2">
        <button
          type="button"
          disabled={chapterIndex <= 0}
          onClick={() => go(-1)}
          className="rounded-lg px-2 py-1.5 text-xs text-slate-300 hover:text-white disabled:text-slate-600"
        >
          {ui.studyChapterPrev}
        </button>
        <p className="min-w-0 truncate text-center text-[11px] text-slate-500">
          {section?.title || ""}
          {document.sections.length > 1
            ? ` · ${chapterIndex + 1} / ${document.sections.length}`
            : ""}
        </p>
        <button
          type="button"
          disabled={chapterIndex >= document.sections.length - 1}
          onClick={() => go(1)}
          className="rounded-lg px-2 py-1.5 text-xs text-slate-300 hover:text-white disabled:text-slate-600"
        >
          {ui.studyChapterNext}
        </button>
      </div>
    </div>
  );
}
