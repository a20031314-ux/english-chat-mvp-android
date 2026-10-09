/**
 * The shapes the curriculum engine works in.
 *
 * The study map in ../map.ts is one curriculum: a goal, laid out as topics in
 * sectors, in an order, with the reasons topics lead into each other, and with
 * ways to practise each topic. That shape is not particular to language. A
 * learner who wants to understand how software reaches hardware, a student
 * with a syllabus and lecture slides, someone building their first web page —
 * each wants the same thing drawn from their goal. What changes is what the
 * sectors are, what "practise it" can mean, and what the topics may point at.
 *
 * So the engine is the shared part, and a Pack is the part that changes. A
 * pack says which sectors there are (fixed, as for language, or chosen by the
 * model from the goal), what activities a topic may carry and what each needs,
 * and how to frame the goal for the model. Everything the model returns goes
 * through normalize.ts against the pack, so a pack is also the contract for
 * what a screen built on it can rely on.
 *
 * Plain module, no imports from the app: the server, a screen and the tests
 * read the same rules, and another product can take this folder as it is.
 */

export const CURRICULUM_SCHEMA_VERSION = 1;

export type Level = "beginner" | "intermediate" | "advanced";
export const LEVELS: Level[] = ["beginner", "intermediate", "advanced"];

/** Same three states the language map keeps, so progress stores can be shared. */
export type TopicStatus = "todo" | "doing" | "done";

/* ----------------------------- what a pack declares ----------------------------- */

/** A sector that is always there, with what it is for. */
export type SectorSpec = { id: string; brief: string };

/**
 * One extra field an activity may carry, beyond its task sentence.
 *
 * "text" is free text up to max characters. "ref" must be one of the ids the
 * caller offered under that name in CurriculumInput.refs — the library clips,
 * say — and anything else is dropped rather than linked to nothing.
 */
export type ActivityField =
  | { name: string; type: "text"; brief: string; max?: number }
  | { name: string; type: "ref"; brief: string; refs: string };

/** A way to practise a topic: in the app this is usually a tab or a screen. */
export type ActivitySpec = {
  kind: string;
  brief: string;
  fields?: ActivityField[];
};

export type Pack = {
  /** Stable name, written into every curriculum the pack draws. */
  id: string;
  /** What kind of thing the learner is doing, in one line, for the prompt. */
  framing: (input: CurriculumInput) => string;
  /**
   * Fixed sectors are the same on every map (stable screens, comparable
   * progress). Free sectors are chosen by the model from the goal, between
   * min and max of them, lettered A, B, C… in the order given.
   */
  sectors: { mode: "fixed"; list: SectorSpec[] } | { mode: "free"; min: number; max: number; brief: string };
  topics: { min: number; max: number; perSector: number; ask: [number, number] };
  activities: { list: ActivitySpec[]; perTopic: [number, number] };
  /**
   * Whether topics point at pages of the materials given in the input — a
   * course built on lecture slides. Off for packs with no materials.
   */
  sources?: boolean;
  /** Extra rules for the prompt, one per line, in the pack's own words. */
  rules?: (input: CurriculumInput) => string[];
};

/* ------------------------------- what a caller gives ------------------------------- */

/** One document the curriculum may be built on, with its pages as plain text. */
export type Material = { id: string; title: string; pages: string[] };

export type CurriculumInput = {
  goal: string;
  level: Level;
  /** Language every title, summary and task is written in, by English name ("Korean"). */
  writeIn: string;
  /** What is being studied, by name, when the pack needs it ("Spanish", "전자회로 1"). */
  subject?: string;
  /** A syllabus, table of contents or exam range the map must follow, as given. */
  scope?: string;
  /** How the learner wants things laid out — "examples first", "short". */
  prefs?: string;
  /** Things activities may point at, by name: { library: [{ id, title }] }. */
  refs?: Record<string, { id: string; title: string }[]>;
  materials?: Material[];
};

/* --------------------------------- what comes back --------------------------------- */

export type CurriculumSector = { id: string; title: string; description: string };

export type CurriculumActivity = { kind: string; task: string } & Record<string, string>;

export type CurriculumLink = { to: string; why: string };

/** A page range in one of the input materials, 1-based and inclusive. */
export type CurriculumSource = { material: string; from: number; to: number };

export type CurriculumTopic = {
  id: string;
  sector: string;
  title: string;
  summary: string;
  /** Position in the recommended order, 1-based, contiguous. */
  order: number;
  activities: CurriculumActivity[];
  links: CurriculumLink[];
  sources: CurriculumSource[];
};

export type Curriculum = {
  v: number;
  id: string;
  pack: string;
  goal: string;
  level: Level;
  title: string;
  summary: string;
  sectors: CurriculumSector[];
  topics: CurriculumTopic[];
  createdAt: string;
};

export type NormalizeResult = {
  curriculum: Curriculum;
  /** What was dropped and why, for logs. Never shown to the learner. */
  dropped: string[];
  /** Material pages no topic covers, by material id — empty when every page is placed. */
  uncovered: Record<string, number[]>;
};
