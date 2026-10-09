import type {
  CurriculumActivity,
  CurriculumInput,
  CurriculumLink,
  CurriculumSector,
  CurriculumSource,
  CurriculumTopic,
  Level,
  NormalizeResult,
  Pack,
} from "./types.ts";
import { CURRICULUM_SCHEMA_VERSION } from "./types.ts";

/**
 * Keep what is well formed, against the pack.
 *
 * A curriculum is written by a model, so everything here treats it as
 * untrusted: sectors the pack allows, topics in those sectors with ids that
 * say which sector they are in, activities of kinds the pack has with only the
 * fields it declares, references only to things the caller offered, page
 * ranges only inside the materials given, links only between topics that
 * exist, and an order with no gaps. What does not pass is dropped and named,
 * rather than drawn as a line to nowhere or a button that opens nothing.
 *
 * Returns null when too little survives to be worth drawing.
 */

const SECTOR_LETTERS = "ABCDEFGH";

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

function int(value: unknown): number | null {
  const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(n) ? Math.round(n) : null;
}

function rows(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.filter((v) => v && typeof v === "object") as Record<string, unknown>[] : [];
}

/** The sector ids a pack allows, before the model has said anything. */
export function allowedSectorIds(pack: Pack): string[] {
  return pack.sectors.mode === "fixed"
    ? pack.sectors.list.map((s) => s.id)
    : SECTOR_LETTERS.slice(0, pack.sectors.max).split("");
}

export function normalizeCurriculum(
  raw: unknown,
  pack: Pack,
  input: CurriculumInput,
  base: { id: string; createdAt: string },
): NormalizeResult | null {
  const dropped: string[] = [];
  const root = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;

  /* sectors */
  const sectorsIn = rows(root.sectors);
  let sectors: CurriculumSector[];
  if (pack.sectors.mode === "fixed") {
    sectors = pack.sectors.list.map(({ id }) => {
      const found = sectorsIn.find((s) => text(s.id, 2).toUpperCase() === id) ?? {};
      return { id, title: text(found.title, 40), description: text(found.description, 160) };
    });
    for (const s of sectors) if (!s.title) dropped.push(`sector ${s.id} had no title`);
  } else {
    // Free sectors are lettered by position, whatever ids the model wrote.
    sectors = [];
    for (const s of sectorsIn) {
      const title = text(s.title, 40);
      if (!title) { dropped.push("a sector had no title"); continue; }
      if (sectors.length >= pack.sectors.max) { dropped.push(`sector "${title}" over the limit of ${pack.sectors.max}`); continue; }
      sectors.push({ id: SECTOR_LETTERS[sectors.length], title, description: text(s.description, 160) });
    }
  }
  // When the model renumbered free sectors, topics follow by the id it used.
  const renamed = new Map<string, string>();
  if (pack.sectors.mode === "free") {
    let i = 0;
    for (const s of sectorsIn) {
      if (!text(s.title, 40)) continue;
      const said = text(s.id, 2).toUpperCase();
      if (i < sectors.length && said) renamed.set(said, sectors[i].id);
      i++;
    }
  }
  const sectorIds = new Set(sectors.map((s) => s.id));

  /* topics */
  const kinds = new Map(pack.activities.list.map((a) => [a.kind, a]));
  const refSets = new Map(Object.entries(input.refs ?? {}).map(([name, list]) => [name, new Set(list.map((r) => r.id))]));
  const materials = (input.materials ?? []).map((m, i) => ({ key: `M${i + 1}`, id: m.id, pages: m.pages.length }));
  const seen = new Set<string>();
  let topics: CurriculumTopic[] = [];

  for (const row of rows(root.topics).slice(0, pack.topics.max * 2)) {
    let id = text(row.id, 4).toUpperCase();
    let sector = text(row.sector, 2).toUpperCase();
    if (pack.sectors.mode === "free") {
      sector = renamed.get(sector) ?? sector;
      if (/^[A-Z]\d+$/.test(id)) id = (renamed.get(id[0]) ?? id[0]) + id.slice(1);
    }
    const title = text(row.title, 60);
    if (!/^[A-H][1-9]\d?$/.test(id) || !sectorIds.has(sector) || id[0] !== sector || !title || seen.has(id)) {
      dropped.push(`topic ${id || "?"} malformed, repeated or outside the sectors`);
      continue;
    }
    seen.add(id);

    const activities: CurriculumActivity[] = [];
    for (const a of rows(row.activities)) {
      const kind = text(a.kind ?? a.tab, 16);
      const spec = kinds.get(kind);
      const task = text(a.task, 200);
      if (!spec || !task) { dropped.push(`${id}: activity "${kind}" unknown or without a task`); continue; }
      const activity: CurriculumActivity = { kind, task };
      for (const field of spec.fields ?? []) {
        const value = text(a[field.name], field.type === "text" ? field.max ?? 200 : 40);
        if (!value) continue;
        if (field.type === "ref") {
          if (refSets.get(field.refs)?.has(value)) {
            activity[field.name] = value;
            // Models repeat the id in the sentence; the screen shows a title instead.
            const stripped = activity.task.split(value).join("").replace(/\s+([,.:;])/g, "$1").replace(/^[\s:·-]+/, "").replace(/\s+/g, " ").trim();
            if (stripped) activity.task = stripped;
          } else dropped.push(`${id}: ${field.name} ${value} is not one of the ${field.refs} offered`);
        } else activity[field.name] = value;
      }
      activities.push(activity);
    }

    const sources: CurriculumSource[] = [];
    if (pack.sources) {
      for (const s of rows(row.sources)) {
        const m = materials.find((x) => x.key === text(s.material ?? s.m, 4).toUpperCase());
        const from = int(s.from), to = int(s.to ?? s.from);
        if (!m || from === null || to === null || from < 1 || to < from || from > m.pages) {
          dropped.push(`${id}: page range outside the materials`);
          continue;
        }
        sources.push({ material: m.id, from, to: Math.min(to, m.pages) });
      }
    }

    topics.push({
      id,
      sector,
      title,
      summary: text(row.summary, 200),
      order: int(row.order) ?? Number.MAX_SAFE_INTEGER,
      activities: activities.slice(0, pack.activities.perTopic[1]),
      links: rows(row.links)
        .map((l) => ({ to: text(l.to, 4).toUpperCase(), why: text(l.why, 200) }))
        .map((l) => (pack.sectors.mode === "free" && /^[A-Z]\d+$/.test(l.to) ? { ...l, to: (renamed.get(l.to[0]) ?? l.to[0]) + l.to.slice(1) } : l))
        .filter((l) => l.to && l.why),
      sources,
    });
  }
  topics = topics.slice(0, pack.topics.max);

  /* links: only to topics that exist, never to themselves, once per pair */
  const ids = new Set(topics.map((t) => t.id));
  for (const topic of topics) {
    const kept = new Map<string, CurriculumLink>();
    for (const link of topic.links) {
      if (!ids.has(link.to) || link.to === topic.id) { dropped.push(`${topic.id}: link to ${link.to} goes nowhere`); continue; }
      if (!kept.has(link.to)) kept.set(link.to, link);
    }
    topic.links = [...kept.values()].slice(0, 4);
  }

  /* order: as given, made contiguous */
  topics.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  topics.forEach((t, i) => { t.order = i + 1; });

  if (topics.length < pack.topics.min) return null;
  if (pack.sectors.mode === "free" && sectors.length < pack.sectors.min) return null;
  for (const s of sectors) if (!topics.some((t) => t.sector === s.id)) dropped.push(`sector ${s.id} has no topics`);

  /* which material pages no topic covers — a course should place every page */
  const uncovered: Record<string, number[]> = {};
  if (pack.sources) {
    for (const m of input.materials ?? []) {
      const covered = new Set<number>();
      for (const t of topics) for (const s of t.sources) if (s.material === m.id) for (let p = s.from; p <= s.to; p++) covered.add(p);
      const missing: number[] = [];
      for (let p = 1; p <= m.pages.length; p++) if (!covered.has(p)) missing.push(p);
      if (missing.length) uncovered[m.id] = missing;
    }
  }

  return {
    curriculum: {
      v: CURRICULUM_SCHEMA_VERSION,
      id: base.id,
      pack: pack.id,
      goal: input.goal,
      level: input.level as Level,
      title: text(root.title, 80) || input.goal.slice(0, 80),
      summary: text(root.summary, 300),
      sectors,
      topics,
      createdAt: base.createdAt,
    },
    dropped,
    uncovered,
  };
}
