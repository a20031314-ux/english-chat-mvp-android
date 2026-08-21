import type { StudyOcrBox } from "./ocrResult";
import { splitSentences } from "./splitSentences";
import type { StudySection } from "./types";

export type SentenceBox = {
  text: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type SentenceRegion = {
  text: string;
  lines: SentenceBox[];
};

/** Taller than this is a paragraph/column blob, not a word or line. */
export const MAX_LINE_HEIGHT = 0.16;

/** Stored after vision reads the page as a list of complete sentences. */
export const OCR_LAYOUT_VERSION = "vision-sentences-1";

function readingOrder(a: SentenceBox, b: SentenceBox) {
  const threshold = Math.max(0.012, Math.min(a.h, b.h) * 0.55);
  if (Math.abs(a.y - b.y) > threshold) return a.y - b.y;
  return a.x - b.x;
}

function joinText(parts: string[]) {
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function padBox(box: SentenceBox): SentenceBox {
  const padX = Math.min(0.006, Math.max(0.002, box.w * 0.04));
  const padY = Math.min(0.005, Math.max(0.001, box.h * 0.2));
  const x = Math.max(0, box.x - padX);
  const y = Math.max(0, box.y - padY);
  return {
    ...box,
    x,
    y,
    w: Math.min(1 - x, box.w + padX * 2),
    h: Math.min(1 - y, box.h + padY * 2),
  };
}

function collapseRows(boxes: SentenceBox[]): SentenceBox[] {
  const ordered = [...boxes].sort(readingOrder);
  const rows: SentenceBox[][] = [];
  for (const box of ordered) {
    const row = rows[rows.length - 1];
    if (!row) {
      rows.push([box]);
      continue;
    }
    const sample = row[0];
    const sameRow =
      Math.abs(box.y - sample.y) <=
      Math.max(0.01, Math.min(box.h, sample.h) * 0.55);
    if (sameRow) row.push(box);
    else rows.push([box]);
  }
  return rows.map((row) => {
    if (row.length === 1) return padBox(row[0]);
    const left = Math.min(...row.map((box) => box.x));
    const top = Math.min(...row.map((box) => box.y));
    const right = Math.max(...row.map((box) => box.x + box.w));
    const bottom = Math.max(...row.map((box) => box.y + box.h));
    return padBox({
      text: joinText(row.map((box) => box.text)),
      x: left,
      y: top,
      w: Math.max(0.008, right - left),
      h: Math.max(0.008, bottom - top),
    });
  });
}

function usableBoxes(boxes: Array<SentenceBox | StudyOcrBox>): SentenceBox[] {
  return boxes
    .map((box) => ({
      ...box,
      text: box.text.replace(/\s+/g, " ").trim(),
    }))
    .filter(
      (box) =>
        box.text && box.h > 0.003 && box.h <= MAX_LINE_HEIGHT && box.w > 0.002,
    );
}

/** Split a two-column textbook page so left and right are read separately. */
export function splitIntoColumns(boxes: SentenceBox[]): SentenceBox[][] {
  if (boxes.length < 8) return [boxes];
  const bins = 40;
  const counts = new Array<number>(bins).fill(0);
  for (const box of boxes) {
    const start = Math.max(0, Math.floor(box.x * bins));
    const end = Math.min(bins, Math.ceil((box.x + box.w) * bins));
    for (let i = start; i < end; i += 1) counts[i] += 1;
  }
  const leftBound = Math.floor(bins * 0.28);
  const rightBound = Math.floor(bins * 0.72);
  let bestMid = 0;
  let bestWidth = 0;
  let i = leftBound;
  while (i < rightBound) {
    if (counts[i] <= 1) {
      let j = i;
      while (j < rightBound && counts[j] <= 1) j += 1;
      const width = j - i;
      if (width >= 2) {
        const mid = (i + j) / 2 / bins;
        const leftN = boxes.filter((box) => box.x + box.w / 2 < mid).length;
        const rightN = boxes.length - leftN;
        if (leftN >= 3 && rightN >= 3 && width > bestWidth) {
          bestWidth = width;
          bestMid = mid;
        }
      }
      i = j;
    } else {
      i += 1;
    }
  }
  if (!bestMid) return [boxes];
  return [
    boxes.filter((box) => box.x + box.w / 2 < bestMid),
    boxes.filter((box) => box.x + box.w / 2 >= bestMid),
  ].filter((column) => column.length > 0);
}

function regionsFromColumn(column: SentenceBox[]): SentenceRegion[] {
  const ordered = [...column].sort(readingOrder);
  if (ordered.length === 0) return [];
  const full = joinText(ordered.map((box) => box.text));
  const sentences = splitSentences(full);
  if (sentences.length <= 1) {
    return [{ text: full, lines: collapseRows(ordered) }];
  }

  const buckets: SentenceRegion[] = sentences.map((text) => ({
    text,
    lines: [],
  }));
  const ends = sentences.map((_, index) =>
    joinText(sentences.slice(0, index + 1)).length,
  );
  let index = 0;
  let filled = 0;

  for (const box of ordered) {
    const bucket = buckets[index] ?? buckets[buckets.length - 1];
    bucket.lines.push(box);
    filled += (filled > 0 ? 1 : 0) + box.text.length;
    while (index < sentences.length - 1 && filled >= ends[index] - 1) {
      index += 1;
    }
  }

  return buckets
    .filter((bucket) => bucket.lines.length > 0 && bucket.text)
    .map((bucket) => ({
      text: bucket.text,
      lines: collapseRows(bucket.lines),
    }));
}

/**
 * Group OCR words/lines into sentences.
 * Coordinates stay on the original words; we only union words that
 * belong to the same sentence, so two sentences on one line stay apart.
 */
export function groupLinesIntoSentences(
  boxes: Array<SentenceBox | StudyOcrBox>,
): SentenceRegion[] {
  const usable = usableBoxes(boxes);
  if (usable.length === 0) return [];
  return splitIntoColumns(usable).flatMap(regionsFromColumn);
}

/**
 * Hit targets for the original image/PDF.
 * Each item is a tight line of one sentence; `text` is the full sentence.
 */
export function mergeOcrBoxesToSentences(
  boxes: Array<SentenceBox | StudyOcrBox>,
): SentenceBox[] {
  return groupLinesIntoSentences(boxes).flatMap((region) =>
    region.lines.map((line) => ({
      text: region.text,
      x: line.x,
      y: line.y,
      w: line.w,
      h: line.h,
    })),
  );
}

export function imageOverlaysNeedRefresh(section: StudySection): boolean {
  if (!section.imageDataUrl) return false;
  return section.ocrEngine !== OCR_LAYOUT_VERSION;
}

export function sentencesFromTextLayer(
  container: HTMLElement,
  page: HTMLElement,
): SentenceBox[] {
  const pageRect = page.getBoundingClientRect();
  if (pageRect.width < 8 || pageRect.height < 8) return [];
  const boxes: SentenceBox[] = [];
  for (const span of container.querySelectorAll("span")) {
    const text = span.textContent?.replace(/\s+/g, " ").trim() || "";
    if (!text) continue;
    const rect = span.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) continue;
    boxes.push({
      text,
      x: (rect.left - pageRect.left) / pageRect.width,
      y: (rect.top - pageRect.top) / pageRect.height,
      w: rect.width / pageRect.width,
      h: rect.height / pageRect.height,
    });
  }
  return mergeOcrBoxesToSentences(boxes);
}
