/**
 * Draft a scenario graph from a situation brief.
 *
 * Writing thirty of these by hand is a week nobody has, and writing them badly
 * is worse than not writing them: a phrasing nobody checked is not a neutral
 * mistake in a language app, it teaches the wrong thing. So the model drafts and
 * a person reviews, which is the only part of this that was ever expensive.
 *
 * The output is printed, not written into the catalog. That is deliberate — the
 * gap where a human reads it is the point of the whole script, and a version
 * that saved straight into src/ would quietly remove it.
 *
 * Run: node --experimental-strip-types scripts/draft-roleplay-scenario.mjs <situation-id> [language]
 */
import { readFileSync } from "node:fs";
import { SITUATIONS, findSituation } from "../src/lib/roleplay/situations.ts";

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
const [, , situationId, language = "en"] = process.argv;

if (!situationId) {
  console.error("Usage: draft-roleplay-scenario.mjs <situation-id> [language]\n");
  console.error("Situations:");
  for (const situation of SITUATIONS) {
    console.error(`  ${situation.id.padEnd(24)} ${situation.title}`);
  }
  process.exit(2);
}

const situation = findSituation(situationId);
if (!situation) {
  console.error(`No situation "${situationId}".`);
  process.exit(2);
}

function apiKey() {
  const fromEnv = process.env.OPENAI_API_KEY?.trim();
  if (fromEnv) return fromEnv;
  try {
    const line = readFileSync(".env.local", "utf8")
      .split(/\r?\n/)
      .find((row) => row.startsWith("OPENAI_API_KEY="));
    const value = line?.slice("OPENAI_API_KEY=".length).trim().replace(/^"|"$/g, "");
    if (value) return value;
  } catch {
    // fall through
  }
  console.error("OPENAI_API_KEY is not set, and .env.local does not carry one.");
  process.exit(2);
}

/**
 * The rules a draft has to satisfy are the same ones the tests check, stated
 * here so the model aims at them rather than being corrected afterwards.
 */
const INSTRUCTIONS = `You are drafting a scripted roleplay for a language-learning app.

The learner speaks ${language}. The tutor plays a role and the learner plays themselves.

Return JSON only, shaped exactly like this:
{
  "sentences": { "<sentenceId>": { "text": "...", "translation": "<Korean>" } },
  "nodes": {
    "<nodeId>": { "type": "tutor", "id": "<nodeId>", "say": "<sentenceId>", "next": "<nodeId>|null" },
    "<nodeId>": { "type": "learner", "id": "<nodeId>", "goal": "<Korean>", "hint": "<Korean, optional>",
                  "expect": [ { "match": ["...", "..."], "go": "<nodeId>" } ], "onMiss": "<nodeId>, optional" }
  },
  "start": "<nodeId>"
}

Rules, all of which are enforced by tests:
- Tutor lines are fixed text. Their audio is generated once and shared, so nothing may vary per learner.
- Write speech, not prose: short turns, contractions, what someone actually says at work.
- Every learner node needs at least two accepted phrasings across its branches. One teaches recitation.
- "goal" and "hint" are written in Korean; everything the tutor says is in ${language}.
- Include at least one branch that answers a side question and then rejoins the main line.
- Give most learner nodes an "onMiss" pointing at a short scripted "sorry?" line that loops back.
  Leave "onMiss" off exactly where a live human tutor should take over instead.
- Exactly one node ends the scenario, with "next": null.
- Every node must be reachable from "start". No learner node may lead straight to another learner node.
- Sentence ids look like "${situationId.split("-")[0]}.something". Node ids are short and lowercase.

The situation:
  Role the tutor plays: ${situation.tutorRole}
  Setting: ${situation.setting}
  What the learner is trying to do: ${situation.objective}
  Where this usually goes wrong: ${situation.likelyTrouble}

Put a branch or a recovery where it usually goes wrong. That is the point of the draft.`;

const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey()}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: MODEL,
    messages: [{ role: "user", content: INSTRUCTIONS }],
    response_format: { type: "json_object" },
  }),
});

if (!response.ok) {
  console.error(`${response.status} ${(await response.text()).slice(0, 400)}`);
  process.exit(1);
}

const body = await response.json();
const draft = JSON.parse(body.choices?.[0]?.message?.content ?? "{}");

console.log(`// Draft for "${situation.title}" (${situationId}, ${language}).`);
console.log("// Review every line before it goes near the catalog: check the");
console.log("// phrasings are what people say, that the branch rejoins, and that");
console.log("// the node left without onMiss is the one worth a person.\n");
console.log("// --- sentences ---");
console.log(JSON.stringify(draft.sentences ?? {}, null, 2));
console.log("\n// --- scenario ---");
console.log(
  JSON.stringify(
    {
      id: situationId,
      language,
      title: situation.title,
      setting: situation.setting,
      tutorRole: situation.tutorRole,
      start: draft.start,
      nodes: draft.nodes ?? {},
    },
    null,
    2,
  ),
);
