import type { CurriculumInput, Pack } from "./types.ts";

/**
 * What the model is told when it draws a curriculum with a given pack.
 *
 * One system prompt, one short user message, one json object back — checked
 * afterwards by normalize.ts, so this asks for the shape and the pack decides
 * what of it is kept. Kept apart from the call so the wording can be read and
 * tested without a key, and so the same words go to whichever provider runs it.
 *
 * Materials are sent as the first part of each page, cut to fit: enough to see
 * where a topic starts and ends, not the whole text. A page with no text (a
 * scanned slide, a diagram) still gets its number, so ranges stay continuous.
 */

const MATERIAL_BUDGET = 28000;

export type CurriculumPrompt = { system: string; user: string; maxTokens: number };

function materialsBlock(input: CurriculumInput): string {
  const materials = input.materials ?? [];
  if (!materials.length) return "";
  const pages = materials.reduce((n, m) => n + m.pages.length, 0);
  const per = Math.max(60, Math.min(500, Math.floor(MATERIAL_BUDGET / Math.max(1, pages))));
  return materials
    .map((m, i) => `[M${i + 1}] ${m.title} (${m.pages.length} pages)\n` +
      m.pages.map((t, p) => `p.${p + 1}: ${t.replace(/\s+/g, " ").slice(0, per)}`).join("\n"))
    .join("\n\n");
}

export function buildCurriculumPrompt(pack: Pack, input: CurriculumInput): CurriculumPrompt {
  const sectorPart = pack.sectors.mode === "fixed"
    ? `The map has ${pack.sectors.list.length} fixed sectors:\n${pack.sectors.list.map((s) => `  ${s.id}: ${s.brief}`).join("\n")}`
    : `Choose ${pack.sectors.min} to ${pack.sectors.max} sectors for this goal and letter them A, B, C… in the order they are studied. ${pack.sectors.brief}`;

  const activityPart = pack.activities.list.map((a) => {
    const fields = (a.fields ?? []).map((f) => {
      if (f.type === "ref") {
        const offered = input.refs?.[f.refs] ?? [];
        const list = offered.length ? offered.map((r) => `        ${r.id}: ${r.title}`).join("\n") : "        (none — do not use this field)";
        return `      "${f.name}": ${f.brief} Only these ids:\n${list}`;
      }
      return `      "${f.name}": ${f.brief}`;
    }).join("\n");
    return `    ${a.kind} — ${a.brief}${fields ? `\n${fields}` : ""}`;
  }).join("\n");

  const materials = materialsBlock(input);
  const sourcePart = pack.sources && materials
    ? `- sources: the page ranges of the materials this topic is taught from, [{"material":"M1","from":3,"to":7}]. Every page of every material belongs to some topic (cover and contents go with the first). A topic the materials do not teach gets [].`
    : "";

  const [askMin, askMax] = pack.topics.ask;
  const rules = (pack.rules?.(input) ?? []).map((r) => `- ${r}`).join("\n");

  const system = `${pack.framing(input)}

${sectorPart}

Write ${askMin} to ${askMax} topics in total, at least ${pack.topics.perSector} in every sector. Each topic is small enough to study in one or two sittings and specific to this goal. Pitch them at a ${input.level} learner.

Topic ids are the sector letter and a number: A1, A2, B1, … Give every topic:
- title: a few words.
- summary: one sentence on what they will be able to do after it.
- order: its place in the order you recommend studying the whole map, 1 first. Bring in what a topic needs right before it is needed.
- activities: ${pack.activities.perTopic[0]} to ${pack.activities.perTopic[1]} ways to practise it. Each has a "kind" and a "task", one short sentence saying what to do:
${activityPart}
- links: 1 to 3 other topics this one connects to, mostly in other sectors, each with "why": one sentence on how the two help each other.
${sourcePart}
${rules}
${input.scope ? `\nFollow this scope as given — its range, its order and its terms. Do not add topics outside it:\n"""${input.scope.slice(0, 6000)}"""\n` : ""}${materials ? `\nMaterials:\n${materials}\n` : ""}${input.prefs ? `\nThe learner asked for: ${input.prefs}\n` : ""}
Also give the map a title (a few words) and a summary (two sentences: what the goal takes, and the path the order follows), and give each sector a title and a one-line description specific to this goal.

Write every title, summary, description, task and why in ${input.writeIn}.

Return only a json object:
{"title":"","summary":"","sectors":[{"id":"A","title":"","description":""}],"topics":[{"id":"A1","sector":"A","title":"","summary":"","order":1,"activities":[{"kind":"${pack.activities.list[0]?.kind ?? ""}","task":""}],"links":[{"to":"B1","why":""}]${pack.sources && materials ? ',"sources":[{"material":"M1","from":1,"to":3}]' : ""}}]}`;

  return {
    system: system.replace(/\n{3,}/g, "\n\n"),
    user: JSON.stringify({ goal: input.goal, level: input.level, ...(input.subject ? { subject: input.subject } : {}) }),
    maxTokens: materials ? 6000 : 4000,
  };
}
