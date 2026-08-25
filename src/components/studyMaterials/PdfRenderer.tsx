"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SentenceHitLayer } from "@/components/studyMaterials/SentenceHitLayer";
import { ZoomableStage } from "@/components/studyMaterials/ZoomableStage";
import type { UICopy } from "@/lib/copy";
import type { ContentSelection } from "@/lib/studyMaterials/contentSelection";
import { neighborsAround } from "@/lib/studyMaterials/contentSelection";
import { requestStudyImageOcr } from "@/lib/studyMaterials/extractImage";
import {
  mergeOcrBoxesToSentences,
  sentencesFromTextLayer,
  type SentenceBox,
} from "@/lib/studyMaterials/mergeSentences";
import { getStudySourceFile } from "@/lib/studyMaterials/storage";
import type {
  StudyDocument,
  StudySection,
} from "@/lib/studyMaterials/types";

const TEXT_LAYER_CSS = `
.textLayer{position:absolute;inset:0;overflow:hidden;line-height:1;opacity:1;transform-origin:0 0;z-index:2;pointer-events:auto;-webkit-text-size-adjust:none;text-size-adjust:none;forced-color-adjust:none;}
.textLayer :is(span,br){color:transparent;position:absolute;white-space:pre;cursor:text;transform-origin:0% 0%;}
.textLayer span.markedContent{top:0;height:0;}
.textLayer ::selection{background:rgba(250,204,21,.45);}
`;

export function PdfRenderer({
  document,
  ui,
  selectedId,
  onSelection,
  onPage,
}: {
  document: StudyDocument;
  ui: UICopy;
  selectedId: string | null;
  onSelection: (selection: ContentSelection | null) => void;
  onPage: (section: StudySection, page: number) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<import("pdfjs-dist").PDFDocumentProxy | null>(null);
  const [pdfReady, setPdfReady] = useState(0);
  const [pageCount, setPageCount] = useState(document.sections.length || 1);
  const [width, setWidth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [sentenceBoxes, setSentenceBoxes] = useState<SentenceBox[]>([]);
  const [ocrHint, setOcrHint] = useState("");

  const page =
    document.progress.page && document.progress.page >= 1
      ? document.progress.page
      : 1;
  const section =
    document.sections.find((row) => row.page === page) ||
    document.sections[page - 1] ||
    document.sections[0];

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const sync = () => setWidth(node.clientWidth);
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setFailed(false);
    void (async () => {
      try {
        const file = await getStudySourceFile(document.id);
        if (!file) throw new Error("missing source");
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        const pdf = await pdfjs.getDocument({
          data: new Uint8Array(await file.blob.arrayBuffer()),
        }).promise;
        if (cancelled) {
          void pdf.cleanup();
          return;
        }
        pdfRef.current = pdf;
        setPageCount(pdf.numPages);
        setPdfReady((n) => n + 1);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
      void pdfRef.current?.cleanup();
      pdfRef.current = null;
    };
  }, [document.id]);

  useEffect(() => {
    const pdf = pdfRef.current;
    const canvas = canvasRef.current;
    const textLayerDiv = textRef.current;
    if (!pdf || !canvas || !textLayerDiv || width < 80) return;
    let cancelled = false;
    setLoading(true);
    setSentenceBoxes([]);
    onSelection(null);
    void (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        const pageProxy = await pdf.getPage(page);
        const unscaled = pageProxy.getViewport({ scale: 1 });
        const scale = width / unscaled.width;
        const viewport = pageProxy.getViewport({ scale });
        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;
        const renderTask = pageProxy.render({
          canvas,
          viewport,
          transform:
            outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined,
        });
        await renderTask.promise;
        if (cancelled) return;

        textLayerDiv.replaceChildren();
        textLayerDiv.style.width = `${viewport.width}px`;
        textLayerDiv.style.height = `${viewport.height}px`;
        const content = await pageProxy.getTextContent();
        const textLayer = new pdfjs.TextLayer({
          textContentSource: content,
          container: textLayerDiv,
          viewport,
        });
        await textLayer.render();
        if (cancelled) return;

        const pageNode = canvas.parentElement;
        if (pageNode) {
          const boxes = sentencesFromTextLayer(textLayerDiv, pageNode);
          if (boxes.length) setSentenceBoxes(boxes);
        }

        const chars = content.items.reduce((sum, item) => {
          if (!item || typeof item !== "object" || !("str" in item)) return sum;
          return sum + String((item as { str?: string }).str || "").trim().length;
        }, 0);

        if (chars < 12 && section) {
          setOcrHint("");
        }
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [onSelection, page, pdfReady, section?.id, ui.studyOcrPage, width]);

  const onPageRef = useRef(onPage);
  onPageRef.current = onPage;

  useEffect(() => {
    if (section) onPageRef.current(section, page);
  }, [page, section]);

  const onTextSelect = useCallback(() => {
    const root = textRef.current;
    const sel = window.getSelection();
    const text = sel?.toString().replace(/\s+/g, " ").trim() || "";
    if (!root || !sel || text.length < 2) {
      return;
    }
    const node = sel.anchorNode;
    if (node && !root.contains(node)) return;
    const blocks = (section?.paragraphs || []).map((row) => row.text);
    const around = neighborsAround(blocks, text);
    onSelection({
      text,
      contextSentence: around.sentence || text,
      sectionId: section?.id,
      page,
      mode: "span",
      ...(around.previous ? { previous: around.previous } : {}),
      ...(around.next ? { next: around.next } : {}),
    });
  }, [onSelection, page, section]);

  const go = (delta: number) => {
    const next = page + delta;
    if (next < 1 || next > pageCount) return;
    const row =
      document.sections.find((item) => item.page === next) ||
      document.sections[next - 1];
    if (row) onPage(row, next);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <style>{TEXT_LAYER_CSS}</style>
      <div ref={wrapRef} className="flex min-h-0 flex-1 flex-col">
        <ZoomableStage
          zoomInLabel={ui.studyZoomIn}
          zoomOutLabel={ui.studyZoomOut}
        >
          {failed ? (
            <p className="px-4 py-10 text-center text-sm text-slate-600">
              {ui.studyFailed}
            </p>
          ) : (
            <div className="relative w-full bg-white">
              <canvas ref={canvasRef} className="pointer-events-none block h-auto w-full" />
              <div
                ref={textRef}
                className="textLayer"
                onMouseUp={onTextSelect}
                onTouchEnd={onTextSelect}
              />
              {sentenceBoxes.length > 0 ? (
                <SentenceHitLayer
                  boxes={sentenceBoxes}
                  selectedText={
                    section?.paragraphs
                      .flatMap((row) => row.sentences)
                      .find((row) => row.id === selectedId)?.text || null
                  }
                  onSelect={(box) => {
                    const blocks = sentenceBoxes.map((row) => row.text);
                    const around = neighborsAround(blocks, box.text);
                    onSelection({
                      text: box.text,
                      contextSentence: around.sentence || box.text,
                      sectionId: section?.id,
                      page,
                      mode: "sentence",
                      boundingBox: {
                        x: box.x,
                        y: box.y,
                        w: box.w,
                        h: box.h,
                      },
                      ...(around.previous ? { previous: around.previous } : {}),
                      ...(around.next ? { next: around.next } : {}),
                    });
                  }}
                />
              ) : null}
              {loading || ocrHint ? (
                <p className="absolute inset-x-0 top-2 text-center text-[11px] text-slate-500">
                  {ocrHint || ui.studyStageReading}
                </p>
              ) : null}
            </div>
          )}
        </ZoomableStage>
      </div>
      <div className="flex shrink-0 items-center justify-between gap-2 border-t border-white/10 bg-[#0a0a0a] px-3 py-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => go(-1)}
          className="rounded-lg px-2 py-1.5 text-xs text-slate-300 hover:text-white disabled:text-slate-600"
        >
          {ui.studyChapterPrev}
        </button>
        <p className="text-[11px] text-slate-500">
          {ui.studyPages
            .replace("{current}", String(page))
            .replace("{total}", String(pageCount))}
        </p>
        <button
          type="button"
          disabled={page >= pageCount}
          onClick={() => go(1)}
          className="rounded-lg px-2 py-1.5 text-xs text-slate-300 hover:text-white disabled:text-slate-600"
        >
          {ui.studyChapterNext}
        </button>
      </div>
    </div>
  );
}
