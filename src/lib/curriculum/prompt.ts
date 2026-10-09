import { SECTOR_BRIEFS, SECTOR_IDS, type StudyMap } from "./map.ts";

/**
 * What the model is told when it draws a study map.
 *
 * Plain text in, one json object out, checked afterwards by normalizeMap —
 * so this asks for the shape, and map.ts decides what of it is kept. Kept apart
 * from the call so the wording can be read and tested without a key.
 *
 * The map is only worth having if every topic can be practised here, so the
 * activities are limited to the four tabs, and the videos to the clips this
 * month's library actually has. A topic the app cannot help with is a topic
 * the learner reads about and closes.
 */

export type MapRequest = {
  goal: string;
  level: StudyMap["level"];
  /** Name of the language being learned, in English (e.g. "Spanish"). */
  target: string;
  /** Name of the language the app is read in, in English (e.g. "Korean"). */
  uiName: string;
  library: { videoId: string; title: string }[];
  /**
   * What their chats say about their sentences, and how they want to go on
   * (learner/profile.ts profileBrief). Absent for someone with no history.
   */
  learner?: {
    level: string | null;
    weak: string[];
    learning: string[];
    nextBandConstructions: string[];
    plan: { focus: "weak" | "next" | "topic"; method: "chat" | "roleplay" | "video" | "mixed" };
    /** Phrases from the tutor they now understand but have not used themselves. */
    understoodNotUsed?: string[];
    /** Phrases they looked up or asked about and have studied. */
    studied?: string[];
  };
};

const FOCUS_RULE = {
  weak: "Their chosen focus is shoring up the weak constructions: give each of them a topic in the expressions-and-grammar sector (B), tied to a situation in A where it is needed, and make the chat starters call for them.",
  next: "Their chosen focus is widening: bring in constructions they have not mastered yet as B topics, each tied to a situation in A where it is natural, and keep weak ones only where they fit.",
  topic: "Their chosen focus is the situations themselves: follow the goal's situations, and touch weak constructions only where a situation naturally needs them.",
} as const;

const METHOD_RULE = {
  chat: "They prefer to practise in chat: make chat the first activity of most topics.",
  roleplay: "They prefer to practise by speaking: make a roleplay call the first activity of most topics.",
  video: "They prefer to learn from videos: give most topics a video activity with listenFor.",
  mixed: "They like a mix: spread the activities across the tabs.",
} as const;

function learnerSection(learner: MapRequest["learner"]): string {
  if (!learner) return "";
  const list = (items: string[]) => (items.length ? items.map((item) => `  - ${item}`).join("\n") : "  (none yet)");
  return `

What their own sentences in chat show so far (constructions they use, judged on their recent uses; no level is claimed from this):
- Weak — wrong in recent uses:
${list(learner.weak)}
- Still settling:
${list(learner.learning.slice(0, 8))}
- Not mastered yet, in the order courses usually bring them in:
${list(learner.nextBandConstructions.slice(0, 8))}
- Phrases from the tutor they now understand but have not used yet:
${list((learner.understoodNotUsed ?? []).slice(0, 10))}
- Phrases they stopped at and studied, not yet met again:
${list((learner.studied ?? []).slice(0, 10))}
Understanding a phrase is half of having it: give the understood ones a chance to be said — in chat starters, roleplay tasks or listenFor — and bring the studied ones back where they fit.
${FOCUS_RULE[learner.plan.focus]}
${METHOD_RULE[learner.plan.method]}
Name the construction in the topic's title or summary when a topic is there for it, in plain words a learner understands.`;
}

export function mapSystemPrompt(input: MapRequest): string {
  const sectors = SECTOR_IDS.map((id) => `  ${id}: ${SECTOR_BRIEFS[id]}`).join("\n");
  const library = input.library.length
    ? input.library.map((clip) => `  ${clip.videoId}: ${clip.title}`).join("\n")
    : "  (none this month — leave videoId out)";
  return `You design a study map for one person learning ${input.target}. They told you what they want to be able to do; you lay out what to study to get there.

The map has four fixed sectors:
${sectors}

Write 8 to 12 topics in total, at least 2 in every sector. Each topic is small enough to study in one or two sittings and specific to this goal — "Ordering at a café: asking for changes", not "Restaurants". Pitch them at a ${input.level} learner.

Topic ids are the sector letter and a number: A1, A2, B1, … Give every topic:
- title: a few words.
- summary: one sentence on what they will be able to do after it.
- order: its place in the order you recommend studying the whole map, 1 first. Start with a situation they can use soon, and bring in what it needs right before it is needed — pronunciation and listening topics too, next to the situations they serve, not saved for the end.
- activities: 1 to 3 ways to practise it in this app. Each has a tab and a task, one short sentence saying what to do there:
    chat — writing back and forth with a tutor. Add "starter": the first line the learner could send, in ${input.target}.
    roleplay — a spoken call with a character in a scene.
    video — watching real people say it. Add "listenFor": 1 to 3 short expressions from this topic, in ${input.target}, separated by " | " ("end up | wait it out") — the app finds scenes in videos where they are said. If a clip from this list fits the topic, also put its id in "videoId" (not in the task); otherwise leave videoId out. Only these ids:
${library}
    vocab — reviewing the words they saved.
- links: 1 to 3 other topics this one connects to, mostly in other sectors, each with "why": one sentence on how the two help each other ("the polite request forms in B2 are what you say when ordering in A1").

${learnerSection(input.learner)}

Also give the map a title (a few words) and a summary (two sentences: what the goal takes, and the path the order follows), and give each sector a title and a one-line description specific to this goal.

Write every title, summary, description, task and why in ${input.uiName}. Only "starter" and "listenFor" are in ${input.target}. Quote ${input.target} words inside quotes when you mention them.

Return only a json object:
{"title":"","summary":"","sectors":[{"id":"A","title":"","description":""}],"topics":[{"id":"A1","sector":"A","title":"","summary":"","order":1,"activities":[{"tab":"chat","task":"","starter":""},{"tab":"video","task":"","listenFor":"","videoId":""}],"links":[{"to":"B1","why":""}]}]}`;
}

export function mapUserMessage(input: MapRequest): string {
  return JSON.stringify({ goal: input.goal, level: input.level });
}
