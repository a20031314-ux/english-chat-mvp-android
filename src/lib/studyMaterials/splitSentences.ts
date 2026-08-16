const ABBREV = /\b(?:Mr|Mrs|Ms|Dr|Prof|Sr|Jr|vs|etc|e\.g|i\.e|No|St|Vol|pp)\.$/i;

export function splitSentences(text: string): string[] {
  const raw = text.replace(/\s+/g, " ").trim();
  if (!raw) return [];

  if (/[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/.test(raw)) {
    return raw
      .split(/(?<=[。．！？!?])/)
      .map((part) => part.trim())
      .filter(Boolean);
  }

  const parts: string[] = [];
  let buf = "";
  for (const chunk of raw.split(/(\s+)/)) {
    buf += chunk;
    const trimmed = buf.trim();
    if (!trimmed) continue;
    if (/[.!?…]["'")\]]*$/.test(trimmed) && !ABBREV.test(trimmed)) {
      parts.push(trimmed);
      buf = "";
    }
  }
  const tail = buf.trim();
  if (tail) parts.push(tail);
  return parts.length > 0 ? parts : [raw];
}
