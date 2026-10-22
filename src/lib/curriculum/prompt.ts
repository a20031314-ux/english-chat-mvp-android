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
  /**
   * What they said about themselves (learner/selfCheck.ts selfCheckMapRules),
   * already written as rules. When present it replaces the chosen plan.
   */
  selfCheck?: string;
  level: StudyMap["level"];
  /** Name of the language being learned, in English (e.g. "Spanish"). */
  target: string;
  /** Name of the language the app is read in, in English (e.g. "Korean"). */
  uiName: string;
  library: { videoId: string; title: string }[];
  /**
   * 언어별로 고정한 단계 범위(curriculum/stages, stageScopeForPrompt). 있으면 지도는 그 범위 안에서만,
   * 상황 하나를 단원 하나로 그린다. 영어·일본어·한국어 먼저(2026-10-22).
   */
  stageScope?: string;
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

function learnerSection(learner: MapRequest["learner"], selfCheck?: string): string {
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
${selfCheck ? "" : `${FOCUS_RULE[learner.plan.focus]}\n${METHOD_RULE[learner.plan.method]}`}
Name the construction in the topic's title or summary when a topic is there for it, in plain words a learner understands.`;
}

// 예전 지도는 상황 하나를 네 칸(상황·문법·단어·소리)으로 쪼개 같은 말을 네 번 했다(2026-10-22 사용자 "난잡"). 지시에 베낄 예문은 두지 않는다(RULES).
const ONE_UNIT_RULE =
  "Never split one situation into separate topics per sector. The grammar, words and sounds a single situation needs belong inside that situation's topic (in its summary, starter, listenFor and tasks). Give a topic of its own in B, C or D only to a structure, word family or sound that several situations share, and say in its summary which ones.";

const STAGE_TOPIC_RULES =
  "Write 6 to 10 topics in total. Each topic is one unit the learner can finish in one or two sittings, taken from the stage scope below; most are situations (A). Every core expression of the stage appears in at least one topic, in a chat starter, in listenFor or named in a task, and its summary says concretely what they will be able to say. Cover every grammar point of the stage somewhere. Stay inside the stage: nothing much harder or much easier.";

export function mapSystemPrompt(input: MapRequest): string {
  const sectors = SECTOR_IDS.map((id) => `  ${id}: ${SECTOR_BRIEFS[id]}`).join("\n");
  const library = input.library.length
    ? input.library.map((clip) => `  ${clip.videoId}: ${clip.title}`).join("\n")
    : "  (none this month — leave videoId out)";
  return `You design a study map for one person learning ${input.target}. They told you what they want to be able to do; you lay out what to study to get there.

The map has four fixed sectors:
${sectors}

${input.stageScope ? STAGE_TOPIC_RULES : `Write 8 to 12 topics in total, at least 2 in every sector. Each topic is small enough to study in one or two sittings and specific to this goal, never a broad category. Pitch them at a ${input.level} learner.`}
${ONE_UNIT_RULE}

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
- links: 1 to 3 other topics this one connects to, mostly in other sectors, each with "why": one sentence on how the two help each other.

${input.stageScope ? `\n${input.stageScope}\n` : ""}
${learnerSection(input.learner, input.selfCheck)}
${input.selfCheck ? `\n${input.selfCheck}\n` : ""}

Also give the map a title (a few words) and a summary (two sentences: what the goal takes, and the path the order follows), and give each sector a title and a one-line description specific to this goal.

Write every title, summary, description, task and why in ${input.uiName}. Only "starter" and "listenFor" are in ${input.target}. Quote ${input.target} words inside quotes when you mention them.

Return only a json object:
{"title":"","summary":"","sectors":[{"id":"A","title":"","description":""}],"topics":[{"id":"A1","sector":"A","title":"","summary":"","order":1,"activities":[{"tab":"chat","task":"","starter":""},{"tab":"video","task":"","listenFor":"","videoId":""}],"links":[{"to":"B1","why":""}]}]}`;
}

export function mapUserMessage(input: MapRequest): string {
  return JSON.stringify({ goal: input.goal, level: input.level });
}

/** For tests: whether the chosen plan's lines are left out when a self-check speaks instead. */
export const PLAN_RULES = { FOCUS_RULE, METHOD_RULE };

/* ───────── 나눠 그리기(2026-10-23): 짜기 한 번 → 연습 채우기 여러 번 나란히 ─────────
 * 한 번에 다 쓰면 40~50초(재시도면 85초). 지도의 뼈대(제목·요약·칸·주제·순서)만 먼저 짜고,
 * 주제마다 연습·이어진 주제는 몇 개씩 나눠 나란히 채운다. 뼈대가 오면 화면에 바로 보인다.
 */

function libraryLines(input: MapRequest): string {
  return input.library.length
    ? input.library.map((clip) => `  ${clip.videoId}: ${clip.title}`).join("\n")
    : "  (none this month — leave videoId out)";
}

function activityRules(input: MapRequest): string {
  return `- activities: 1 to 3 ways to practise it in this app. Each has a tab and a task, one short sentence saying what to do there:
    chat — writing back and forth with a tutor. Add "starter": the first line the learner could send, in ${input.target}.
    roleplay — a spoken call with a character in a scene.
    video — watching real people say it. Add "listenFor": 1 to 3 short expressions from this topic, in ${input.target}, separated by " | " — the app finds scenes in videos where they are said. If a clip from this list fits the topic, also put its id in "videoId" (not in the task); otherwise leave videoId out. Only these ids:
${libraryLines(input)}
    vocab — reviewing the words they saved.
- links: 1 to 3 other topics of the map this one connects to, mostly in other sectors, each with "why": one sentence on how the two help each other.`;
}

/** 1단계: 뼈대만. covers는 채우기 단계에 넘기는 "이 주제가 꼭 연습시킬 것"(저장하지 않음). */
export function mapPlanPrompt(input: MapRequest): string {
  const sectors = SECTOR_IDS.map((id) => `  ${id}: ${SECTOR_BRIEFS[id]}`).join("\n");
  return `You design a study map for one person learning ${input.target}. They told you what they want to be able to do; you lay out what to study to get there. In this step you plan the map; the practice activities are written afterwards from your plan.

The map has four fixed sectors:
${sectors}

${input.stageScope ? STAGE_TOPIC_RULES : `Write 8 to 12 topics in total, at least 2 in every sector. Each topic is small enough to study in one or two sittings and specific to this goal, never a broad category. Pitch them at a ${input.level} learner.`}
${ONE_UNIT_RULE}

Topic ids are the sector letter and a number: A1, A2, B1, … Give every topic:
- title: a few words.
- summary: one sentence on what they will be able to do after it.
- order: its place in the order you recommend studying the whole map, 1 first. Start with a situation they can use soon, and bring in what it needs right before it is needed — pronunciation and listening topics too, next to the situations they serve, not saved for the end.
- covers: the ${input.target} expressions, structures, words or sounds this topic must make them practise, separated by " | " — the activities will be written from it.
${input.stageScope ? `\n${input.stageScope}\n` : ""}
${learnerSection(input.learner, input.selfCheck)}
${input.selfCheck ? `\n${input.selfCheck}\n` : ""}

Also give the map a title (a few words) and a summary (two sentences: what the goal takes, and the path the order follows), and give each sector a title and a one-line description specific to this goal.

Write every title, summary and description in ${input.uiName}. Only "covers" is in ${input.target}. Quote ${input.target} words inside quotes when you mention them.

Return only a json object:
{"title":"","summary":"","sectors":[{"id":"A","title":"","description":""}],"topics":[{"id":"A1","sector":"A","title":"","summary":"","order":1,"covers":""}]}`;
}

export type PlannedTopic = { id: string; sector: string; title: string; summary: string; order: number; covers: string };

/** 2단계: 정해진 주제 몇 개의 연습·이어진 주제만. 지도 전체(뼈대)를 같이 보여 줘 이을 곳을 알게 한다. */
export function mapFillPrompt(input: MapRequest, plan: { title: string; topics: PlannedTopic[] }, ids: string[]): string {
  const outline = plan.topics
    .map((t) => `  ${t.id} (${t.sector}, #${t.order}) ${t.title} — ${t.summary}${t.covers ? ` [covers: ${t.covers}]` : ""}`)
    .join("\n");
  return `You write the practice for part of a study map for one person learning ${input.target}. The map is already planned:

Map: ${plan.title}
${outline}

Write activities and links for these topics only: ${ids.join(", ")}. For each:
${activityRules(input)}

Make the activities practise what the topic covers: put its expressions in chat starters, in listenFor or name them in tasks, so every covered item is practised somewhere. Links point only to topic ids of the map above.
${input.stageScope ? `\n${input.stageScope}\n` : ""}
${learnerSection(input.learner, input.selfCheck)}
${input.selfCheck ? `\n${input.selfCheck}\n` : ""}

Write every task and why in ${input.uiName}. Only "starter" and "listenFor" are in ${input.target}. Quote ${input.target} words inside quotes when you mention them.

Return only a json object:
{"topics":[{"id":"${ids[0] ?? "A1"}","activities":[{"tab":"chat","task":"","starter":""},{"tab":"video","task":"","listenFor":"","videoId":""}],"links":[{"to":"","why":""}]}]}`;
}

/** 뼈대 주제를 채우기 묶음으로: 추천 순서대로 size개씩(마지막 묶음이 너무 작으면 앞에 붙임). */
export function fillGroups(topics: { id: string; order: number }[], size = 3): string[][] {
  const ordered = [...topics].sort((a, b) => a.order - b.order).map((t) => t.id);
  const groups: string[][] = [];
  for (let i = 0; i < ordered.length; i += size) groups.push(ordered.slice(i, i + size));
  if (groups.length > 1 && groups[groups.length - 1].length < 2) {
    const last = groups.pop()!;
    groups[groups.length - 1].push(...last);
  }
  return groups;
}

