export type StudyOcrBox = {
  text: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type StudyOcrResult = {
  title: string;
  paragraphs: string[];
  boxes: StudyOcrBox[];
};

function asTrimmed(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function unit(value: number): number {
  const scaled = value > 1 ? value / 100 : value;
  if (scaled < 0) return 0;
  if (scaled > 1) return 1;
  return scaled;
}

export function normalizeOcrBox(
  raw: unknown,
): Omit<StudyOcrBox, "text"> | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const x = asNumber(row.x);
  const y = asNumber(row.y);
  const w = asNumber(row.w ?? row.width);
  const h = asNumber(row.h ?? row.height);
  if (x == null || y == null || w == null || h == null) return null;
  const box = { x: unit(x), y: unit(y), w: unit(w), h: unit(h) };
  if (box.x + box.w > 1) box.w = Math.max(0, 1 - box.x);
  if (box.y + box.h > 1) box.h = Math.max(0, 1 - box.y);
  if (box.w < 0.012 || box.h < 0.01) return null;
  return box;
}

export function parseLooseModelJson(raw: string | null | undefined): unknown {
  const source = (raw ?? "").trim();
  if (!source) throw new Error("empty model response");
  let text = source;
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  }
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    if (start < 0) throw new Error("no json object");
    let slice = text.slice(start);
    const last = slice.lastIndexOf("}");
    if (last > 0) {
      try {
        return JSON.parse(slice.slice(0, last + 1));
      } catch {
        // truncated: drop a partial last item and close the structure
      }
    }
    slice = slice.replace(/,\s*\{[^}]*$/, "");
    slice = slice.replace(/,\s*$/, "");
    if (!slice.includes("]")) slice += "]";
    if (!slice.trim().endsWith("}")) slice += "}";
    return JSON.parse(slice);
  }
}

export function parseStudyOcrResult(raw: unknown): StudyOcrResult {
  if (!raw || typeof raw !== "object") {
    return { title: "", paragraphs: [], boxes: [] };
  }
  const row = raw as Record<string, unknown>;
  const title = asTrimmed(row.title).slice(0, 80);
  const boxes: StudyOcrBox[] = [];
  const paragraphs: string[] = [];
  const sentenceList = Array.isArray(row.sentences)
    ? row.sentences
    : Array.isArray(row.blocks)
      ? row.blocks
      : Array.isArray(row.regions)
        ? row.regions
        : Array.isArray(row.boxes)
          ? row.boxes
          : [];

  const pushSentence = (value: unknown) => {
    const text =
      typeof value === "string"
        ? asTrimmed(value)
        : asTrimmed((value as { text?: unknown } | null)?.text).replace(
            /\s+/g,
            " ",
          );
    const clean = text.replace(/\s+/g, " ").trim();
    if (!clean) return;
    paragraphs.push(clean.slice(0, 4000));
  };

  if (Array.isArray(row.sentences) && row.sentences.length > 0) {
    for (const item of row.sentences) {
      pushSentence(item);
      if (paragraphs.length >= 160) break;
    }
    return { title, paragraphs, boxes };
  }

  const blockList = sentenceList;

  for (const item of blockList) {
    if (!item || typeof item !== "object") continue;
    const text = asTrimmed((item as { text?: unknown }).text).replace(
      /\s+/g,
      " ",
    );
    if (!text) continue;
    paragraphs.push(text.slice(0, 4000));
    const box = normalizeOcrBox(item);
    if (box) boxes.push({ text: text.slice(0, 4000), ...box });
    if (boxes.length >= 160) break;
  }

  if (paragraphs.length === 0 && Array.isArray(row.paragraphs)) {
    for (const item of row.paragraphs) {
      const text = asTrimmed(item).replace(/\s+/g, " ");
      if (text) paragraphs.push(text.slice(0, 4000));
      if (paragraphs.length >= 160) break;
    }
  }

  if (paragraphs.length === 0) {
    const text = asTrimmed(row.text);
    if (text) {
      for (const block of text.split(/\n{2,}/)) {
        const line = block.replace(/\s+/g, " ").trim();
        if (line) paragraphs.push(line.slice(0, 4000));
        if (paragraphs.length >= 160) break;
      }
    }
  }

  return { title, paragraphs, boxes };
}
