/**
 * A study map: one learner's goal, laid out as topics in four sectors, in an
 * order, with the reasons topics lead into each other.
 *
 * The shape follows the study map the product is modelled on — a goal at the
 * top, a recommended order across the top, sectors as columns, and lines
 * between topics that say why — with the sectors fixed for language: the
 * situation you want to handle, the expressions and grammar it takes, the
 * words, and how it sounds. Fixed so the screen is stable and progress can be
 * compared across maps; what fills them comes from the goal.
 *
 * A map is generated (generate.ts), so everything here treats it as untrusted
 * input: normalizeMap keeps only what is well formed — topics in a known
 * sector, links between topics that exist, an order with no gaps, activities
 * on tabs the app has, and video ids from the library actually offered — and
 * says what it dropped, rather than drawing a line to nowhere.
 *
 * Plain module, no imports from the app, so the server, the screen and the
 * tests read the same rules.
 */

export const MAP_SCHEMA_VERSION = 1;

export const SECTOR_IDS = ["A", "B", "C", "D"] as const;
export type SectorId = (typeof SECTOR_IDS)[number];

/** What each sector is for, in the words the generator is given. */
export const SECTOR_BRIEFS: Record<SectorId, string> = {
  A: "Situations — the real moments the goal is about (introducing yourself, ordering, a meeting, small talk).",
  B: "Expressions and grammar — the structures and set phrases those situations need (politeness, asking, past tense).",
  C: "Vocabulary — the words and word families those situations use.",
  D: "Pronunciation and listening — how it sounds and how to follow it at natural speed.",
};

export const ACTIVITY_TABS = ["chat", "roleplay", "video", "vocab"] as const;
export type ActivityTab = (typeof ACTIVITY_TABS)[number];

export type MapActivity = {
  tab: ActivityTab;
  /** What to do there, in the learner's language. */
  task: string;
  /** For chat: a first line to start with, in the language being learned. */
  starter?: string;
  /** For video: a clip from this month's library. */
  videoId?: string;
  /**
   * For video: the expressions to listen for, in the language being learned,
   * separated by " | " ("end up | wait it out"). What the app searches kept
   * video transcripts for (videoIndex/match.ts), so a topic can open the scene
   * where they are said — not only a clip from the month's seven.
   */
  listenFor?: string;
};

/** The expressions a video activity asks to listen for, one per entry. */
export function listenForPhrases(activity: Pick<MapActivity, "listenFor">): string[] {
  return (activity.listenFor ?? "")
    .split("|")
    .map((phrase) => phrase.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 4);
}

export type MapLink = { to: string; why: string };

export type MapTopic = {
  id: string;
  sector: SectorId;
  title: string;
  summary: string;
  /** Position in the recommended order, 1-based. */
  order: number;
  activities: MapActivity[];
  links: MapLink[];
};

export type MapSector = { id: SectorId; title: string; description: string };

export type StudyMap = {
  v: number;
  id: string;
  language: string;
  uiLanguage: string;
  goal: string;
  title: string;
  summary: string;
  level: "beginner" | "intermediate" | "advanced";
  sectors: MapSector[];
  topics: MapTopic[];
  createdAt: string;
};

export type TopicStatus = "todo" | "doing" | "done";

const MAX_TOPICS = 16;
const MIN_TOPICS = 6;

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

/**
 * Keep what is well formed. Returns null when too little survives to be a map
 * worth drawing; otherwise the map and a list of what was dropped and why.
 */
export function normalizeMap(
  raw: unknown,
  base: {
    id: string;
    language: string;
    uiLanguage: string;
    goal: string;
    level: StudyMap["level"];
    createdAt: string;
    libraryVideoIds: string[];
  },
): { map: StudyMap; dropped: string[] } | null {
  const dropped: string[] = [];
  const input = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;

  const sectorsIn = Array.isArray(input.sectors) ? (input.sectors as Record<string, unknown>[]) : [];
  const sectors: MapSector[] = SECTOR_IDS.map((id) => {
    const found = sectorsIn.find((s) => s?.id === id) ?? {};
    return { id, title: text(found.title, 40), description: text(found.description, 160) };
  });
  for (const sector of sectors) if (!sector.title) dropped.push(`sector ${sector.id} had no title`);

  const library = new Set(base.libraryVideoIds);
  const topicsIn = Array.isArray(input.topics) ? (input.topics as Record<string, unknown>[]) : [];
  const seen = new Set<string>();
  let topics: MapTopic[] = [];
  for (const row of topicsIn.slice(0, MAX_TOPICS * 2)) {
    const id = text(row?.id, 4).toUpperCase();
    const sector = text(row?.sector, 1).toUpperCase() as SectorId;
    const title = text(row?.title, 60);
    if (!/^[A-D][1-9]\d?$/.test(id) || !SECTOR_IDS.includes(sector) || id[0] !== sector || !title || seen.has(id)) {
      dropped.push(`topic ${id || "?"} malformed or repeated`);
      continue;
    }
    seen.add(id);
    const activities: MapActivity[] = [];
    for (const a of Array.isArray(row.activities) ? (row.activities as Record<string, unknown>[]) : []) {
      const tab = text(a?.tab, 10) as ActivityTab;
      const task = text(a?.task, 200);
      if (!ACTIVITY_TABS.includes(tab) || !task) {
        dropped.push(`${id}: activity on unknown tab "${tab}"`);
        continue;
      }
      const activity: MapActivity = { tab, task };
      const starter = text(a.starter, 200);
      if (tab === "chat" && starter) activity.starter = starter;
      const videoId = text(a.videoId, 20);
      if (tab === "video" && videoId) {
        if (library.has(videoId)) activity.videoId = videoId;
        else dropped.push(`${id}: video ${videoId} is not in the library`);
      }
      const listenFor = text(a.listenFor, 120);
      if (tab === "video" && listenFor) activity.listenFor = listenFor;
      // The id is for the app; the screen shows the clip's title. Models
      // repeat it in the sentence anyway ("watch nZP7pb_t4oA and…").
      for (const known of library) {
        if (activity.task.includes(known)) {
          activity.task = activity.task.split(known).join("").replace(/\s+([,.:;])/g, "$1").replace(/^[\s:·-]+/, "").replace(/\s+/g, " ").trim();
        }
      }
      if (!activity.task) activity.task = task;
      activities.push(activity);
    }
    topics.push({
      id,
      sector,
      title,
      summary: text(row.summary, 200),
      order: typeof row.order === "number" && Number.isFinite(row.order) ? row.order : Number.MAX_SAFE_INTEGER,
      activities: activities.slice(0, 4),
      links: Array.isArray(row.links)
        ? (row.links as Record<string, unknown>[])
            .map((l) => ({ to: text(l?.to, 4).toUpperCase(), why: text(l?.why, 200) }))
            .filter((l) => l.to && l.why)
        : [],
    });
  }
  topics = topics.slice(0, MAX_TOPICS);

  // Links only to topics that exist, never to themselves, once each pair.
  const ids = new Set(topics.map((t) => t.id));
  for (const topic of topics) {
    const kept = new Map<string, MapLink>();
    for (const link of topic.links) {
      if (!ids.has(link.to) || link.to === topic.id) {
        dropped.push(`${topic.id}: link to ${link.to} goes nowhere`);
        continue;
      }
      if (!kept.has(link.to)) kept.set(link.to, link);
    }
    topic.links = [...kept.values()].slice(0, 4);
  }

  // The order the generator gave, made contiguous: 1..n with no gaps or ties.
  topics.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  topics.forEach((topic, index) => {
    topic.order = index + 1;
  });

  if (topics.length < MIN_TOPICS) return null;
  for (const sector of SECTOR_IDS) {
    if (!topics.some((t) => t.sector === sector)) dropped.push(`sector ${sector} has no topics`);
  }

  return {
    map: {
      v: MAP_SCHEMA_VERSION,
      id: base.id,
      language: base.language,
      uiLanguage: base.uiLanguage,
      goal: base.goal,
      title: text(input.title, 80) || base.goal.slice(0, 80),
      summary: text(input.summary, 300),
      level: base.level,
      sectors,
      topics,
      createdAt: base.createdAt,
    },
    dropped,
  };
}

/** Every link touching a topic, either way, with the reason as written. */
export function connectionsOf(map: StudyMap, topicId: string): { topic: MapTopic; why: string }[] {
  const byId = new Map(map.topics.map((t) => [t.id, t]));
  const out: { topic: MapTopic; why: string }[] = [];
  const self = byId.get(topicId);
  for (const link of self?.links ?? []) {
    const other = byId.get(link.to);
    if (other) out.push({ topic: other, why: link.why });
  }
  for (const other of map.topics) {
    if (other.id === topicId) continue;
    const back = other.links.find((l) => l.to === topicId);
    if (back && !out.some((o) => o.topic.id === other.id)) out.push({ topic: other, why: back.why });
  }
  return out;
}

/** The first topic in order that is not done — what "continue" opens. */
export function nextTopic(map: StudyMap, status: Record<string, TopicStatus>): MapTopic | null {
  return map.topics.find((t) => status[t.id] !== "done") ?? null;
}
