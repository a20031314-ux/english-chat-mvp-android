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
   * Leaving it out means the correction ladder is entered instead. That is the
   * whole design: the script covers what it can, and anything that costs money
   * happens at the edges rather than by default.
   */
  onMiss?: string;
  /**
   * What to say when they still cannot get there: a sentence id, like any other.
   *
   * The point of writing it in advance is that most misses at a given turn are
   * the same miss — everyone who stumbles on "for here or to go" stumbles on it
   * the same way, which is why the situation briefs record where each exchange
   * goes wrong. A correction written here is generated once and costs nothing to
   * play, where generating one per learner costs about ten times as much and
   * waking a live tutor about fifty.
   *
   * Left out where the trouble is not predictable. Then it is generated.
   */
  correction?: string;
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
 * FNV-1a twice with different seeds, so an audio file can be named after what
 * it contains.
 *
 * Written out rather than taken from node:crypto because this module is read on
 * the client too, and a hash used for a filename needs to be reproducible, not
 * cryptographic. Two thirty-two bit passes rather than one sixty-four bit one
 * because BigInt literals need a newer target than this project compiles to,
 * and two independent halves put collisions out of reach at any library size
 * this will ever have.
 */
function fnv1a32(value: string, seed: number): number {
  let hash = seed;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function contentHash(value: string): string {
  const low = fnv1a32(value, 2166136261);
  const high = fnv1a32(value, 1099511628); // A different seed, so the halves differ.
  return low.toString(36) + high.toString(36);
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
  return `/roleplay/audio/${language}/${contentHash(`${voice}:${text.trim()}`)}.mp3`;
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

/**
 * Branches worth offering, given where the learner has already been.
 *
 * A side question that rejoins — "do you have oat milk?" answered, then back to
 * the order — can be asked forever, because the graph has no memory of it. Once
 * its answer has been heard, the branch stops counting, so asking again falls
 * through to the recovery rather than round the loop again.
 */
export function liveBranches(node: LearnerNode, visited: string[]): Branch[] {
  const seen = new Set(visited);
  const fresh = node.expect.filter((branch) => !seen.has(branch.go));
  // Never strand a node: if every branch has been taken, they all count again.
  return fresh.length > 0 ? fresh : node.expect;
}

/** Sentence ids a scenario needs, which is exactly what needs audio. */
export function sentenceIdsUsed(scenario: RoleplayScenario): string[] {
  const ids = new Set<string>();
  for (const node of Object.values(scenario.nodes)) {
    if (isTutorNode(node)) ids.add(node.say);
    // Corrections are spoken too, so they are generated with everything else.
    else if (node.correction) ids.add(node.correction);
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
