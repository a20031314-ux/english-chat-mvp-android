import type { LearningLanguageCode } from "../learningLanguages.ts";

/**
 * The shape of a scripted roleplay.
 *
 * A roleplay is the cheap half of talking: the tutor's lines are known before
 * anyone opens the app, so their audio is made once and served to everyone from
 * a file. What costs anything at run time is listening to the learner, and the
 * live tutor on the occasions the script cannot answer.
 *
 * Two decisions shape everything here.
 *
 * Sentences are separate from scenarios. "What size?" belongs to a café, not to
 * one particular café script, and keying its audio to a scenario would record
 * and store it again for every script that says it.
 *
 * Scenarios are graphs rather than lists. A list is a rail: whatever the learner
 * says, the next line is the next line, so a reasonable question gets a reply to
 * a different question. Branches let the script answer more of what people
 * actually say, and because they rejoin, sentences grow with the number of
 * branches while paths grow with their product.
 *
 * Nothing here calls a model. This is the content; the pipeline reads it.
 */

/** A line of tutor speech, reusable across every scenario that says it. */
export type Sentence = {
  text: string;
  /** Shown beside the audio, in the learner's own language. */
  translation?: string;
};

/** Sentences for one language, keyed by an id scenarios refer to. */
export type SentenceBank = Record<string, Sentence>;

export type TutorNode = {
  type: "tutor";
  id: string;
  /** Key into the bank. Several scenarios may point at the same one. */
  say: string;
  /** Where to go once it has been spoken. Null ends the scenario. */
  next: string | null;
};

/** One thing the learner might say, and where saying it leads. */
export type Branch = {
  /** Phrasings that count. Matching is the pipeline's business. */
  match: string[];
  go: string;
};

export type LearnerNode = {
  type: "learner";
  id: string;
  /** What they are trying to do, in their own language. */
  goal: string;
  hint?: string;
  /**
   * Checked in order, first match wins, so put the specific before the general.
   */
  expect: Branch[];
  /**
   * Where to go when nothing matched — normally a scripted "sorry?" that loops
   * back, which is far cheaper than waking the tutor for a mumble.
   *
   * Leaving it out means the tutor is woken instead. That is the whole design:
   * the script covers what it can, and the live tutor is what happens at the
   * edges rather than what happens by default.
   */
  onMiss?: string;
};

export type ScriptNode = TutorNode | LearnerNode;

export type RoleplayScenario = {
  id: string;
  language: LearningLanguageCode;
  title: string;
  /**
   * Where this takes place and who each side is, written for the model rather
   * than the learner: it is what the live tutor is handed when it is woken
   * mid-scene, so it arrives knowing the situation instead of inferring it from
   * the last thing said.
   */
  setting: string;
  /** Who the tutor is playing. The learner plays themselves. */
  tutorRole: string;
  /**
   * Deliberately no difficulty here. A graph is walked differently by different
   * people, so a label on the scenario describes neither of them. Difficulty
   * lives in difficulty.ts as a dial that moves while the conversation runs.
   */
  start: string;
  nodes: Record<string, ScriptNode>;
};

/**
 * A 64-bit FNV-1a, so an audio file can be named after what it contains.
 *
 * Written out rather than taken from node:crypto because this module is read on
 * the client too, and a hash used for a filename needs to be reproducible, not
 * cryptographic. Sixty-four bits leaves collisions out of reach at any library
 * size this will ever have.
 */
function fnv1a64(value: string): string {
  const prime = 1099511628211n;
  const mask = (1n << 64n) - 1n;
  let hash = 14695981039346656037n;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash ^ BigInt(value.charCodeAt(i))) * prime) & mask;
  }
  return hash.toString(36);
}

/**
 * Where a sentence's audio lives.
 *
 * Named after the text, the voice and the language rather than the scenario, so
 * the same line said in two scenarios is one file — and so changing a sentence
 * produces a new name instead of leaving everyone with the old recording.
 *
 * mp3 rather than the pcm the streaming route serves: at 24kHz sixteen-bit,
 * stored lines are about twelve times the size for no benefit once they are
 * files rather than a stream.
 */
export function sentenceAudioPath(
  text: string,
  voice: string,
  language: string,
): string {
  return `/roleplay/audio/${language}/${fnv1a64(`${voice}:${text.trim()}`)}.mp3`;
}

export function isTutorNode(node: ScriptNode): node is TutorNode {
  return node.type === "tutor";
}

export function isLearnerNode(node: ScriptNode): node is LearnerNode {
  return node.type === "learner";
}

/** Every node a branch or `next` can lead to from this one. */
export function successorsOf(node: ScriptNode): string[] {
  if (isTutorNode(node)) return node.next ? [node.next] : [];
  const targets = node.expect.map((branch) => branch.go);
  return node.onMiss ? [...targets, node.onMiss] : targets;
}

/** Sentence ids a scenario needs, which is exactly what needs audio. */
export function sentenceIdsUsed(scenario: RoleplayScenario): string[] {
  const ids = new Set<string>();
  for (const node of Object.values(scenario.nodes)) {
    if (isTutorNode(node)) ids.add(node.say);
  }
  return [...ids];
}

/** Node ids pointed at by something that do not exist. */
export function danglingTargets(scenario: RoleplayScenario): string[] {
  const missing = new Set<string>();
  if (!scenario.nodes[scenario.start]) missing.add(scenario.start);
  for (const node of Object.values(scenario.nodes)) {
    for (const target of successorsOf(node)) {
      if (!scenario.nodes[target]) missing.add(target);
    }
  }
  return [...missing];
}

/** Nodes no path from the start can reach — written but never heard. */
export function unreachableNodes(scenario: RoleplayScenario): string[] {
  const seen = new Set<string>();
  const queue = [scenario.start];
  while (queue.length > 0) {
    const id = queue.shift();
    if (!id || seen.has(id)) continue;
    const node = scenario.nodes[id];
    if (!node) continue;
    seen.add(id);
    queue.push(...successorsOf(node));
  }
  return Object.keys(scenario.nodes).filter((id) => !seen.has(id));
}

/**
 * Learner nodes whose branches lead straight to another learner node.
 *
 * The learner would speak, and then be asked to speak again with nothing said
 * in between, which reads as the app having missed the first answer.
 */
export function learnerFollowedByLearner(
  scenario: RoleplayScenario,
): string[] {
  const offenders = new Set<string>();
  for (const node of Object.values(scenario.nodes)) {
    if (!isLearnerNode(node)) continue;
    for (const target of successorsOf(node)) {
      const next = scenario.nodes[target];
      if (next && isLearnerNode(next)) offenders.add(`${node.id}→${target}`);
    }
  }
  return [...offenders];
}

/** Whether any path from the start reaches a tutor node that ends the scenario. */
export function hasEnding(scenario: RoleplayScenario): boolean {
  const seen = new Set<string>();
  const queue = [scenario.start];
  while (queue.length > 0) {
    const id = queue.shift();
    if (!id || seen.has(id)) continue;
    const node = scenario.nodes[id];
    if (!node) continue;
    seen.add(id);
    if (isTutorNode(node) && node.next === null) return true;
    queue.push(...successorsOf(node));
  }
  return false;
}
