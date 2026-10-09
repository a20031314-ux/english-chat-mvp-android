import type { TranscriptLine, TranscriptRecord } from "./transcript.ts";
import { segmentChunk } from "../wordSegments.ts";

/**
 * Where in a video an expression is actually said.
 *
 * A search engine only knows a video's title and description. Once its words
 * are kept (transcript.ts) the question can be asked of what people say in it:
 * does "end up" come up, how often, and at what second. That turns a
 * recommendation from "a video about cafés" into "the scene at 3:12 where they
 * say it twice".
 *
 * English is matched with a little care for how phrases move in speech:
 *
 * - inflection: "end up" finds "ended up", "ending up", "ends up"; a short
 *   table covers the irregular verbs that phrases are built on ("go" → "went");
 * - placeholders: "someone", "something", "sb", "sth" and "one's" stand for one
 *   to three words, so "stand someone up" finds "stood me up";
 * - separable particles: a two-word verb + particle also finds the particle a
 *   word or two later, so "wait out" finds "wait it out".
 *
 * Other languages are matched as written, word for word. Good enough to start;
 * the shape of the result does not change when it gets better.
 *
 * Pure.
 */

export type ExpressionHit = {
  lineIndex: number;
  start: number;
  end: number;
  text: string;
  /** The words in the line that matched. */
  matched: string;
};

export type VideoMatch = {
  videoId: string;
  title?: string;
  durationSeconds: number;
  /** Expressions found, each with where it was said. */
  found: Array<{ expression: string; hits: ExpressionHit[] }>;
  /** Total occurrences across all expressions. */
  hitCount: number;
};

const PLACEHOLDERS = new Set([
  "someone",
  "somebody",
  "something",
  "sb",
  "sth",
  "one's",
  "someone's",
  "oneself",
]);

const PARTICLES = new Set([
  "up", "out", "off", "on", "in", "down", "over", "away", "back", "around", "through",
]);

/** Irregular forms of verbs phrases are commonly built on. */
const IRREGULAR: Record<string, string[]> = {
  be: ["am", "is", "are", "was", "were", "been", "being", "'m", "'re", "'s"],
  have: ["has", "had", "having", "'ve", "'d"],
  do: ["does", "did", "done", "doing"],
  go: ["goes", "went", "gone", "going"],
  get: ["gets", "got", "gotten", "getting"],
  take: ["takes", "took", "taken", "taking"],
  come: ["comes", "came", "coming"],
  make: ["makes", "made", "making"],
  give: ["gives", "gave", "given", "giving"],
  run: ["runs", "ran", "running"],
  say: ["says", "said", "saying"],
  see: ["sees", "saw", "seen", "seeing"],
  find: ["finds", "found", "finding"],
  tell: ["tells", "told", "telling"],
  think: ["thinks", "thought", "thinking"],
  leave: ["leaves", "left", "leaving"],
  keep: ["keeps", "kept", "keeping"],
  feel: ["feels", "felt", "feeling"],
  bring: ["brings", "brought", "bringing"],
  buy: ["buys", "bought", "buying"],
  stand: ["stands", "stood", "standing"],
  hold: ["holds", "held", "holding"],
  sit: ["sits", "sat", "sitting"],
  speak: ["speaks", "spoke", "spoken", "speaking"],
  break: ["breaks", "broke", "broken", "breaking"],
  wake: ["wakes", "woke", "woken", "waking"],
  fall: ["falls", "fell", "fallen", "falling"],
  catch: ["catches", "caught", "catching"],
  hang: ["hangs", "hung", "hanging"],
  put: ["puts", "putting"],
  set: ["sets", "setting"],
  let: ["lets", "letting"],
  cut: ["cuts", "cutting"],
  pay: ["pays", "paid", "paying"],
  lose: ["loses", "lost", "losing"],
  meet: ["meets", "met", "meeting"],
  throw: ["throws", "threw", "thrown", "throwing"],
  show: ["shows", "showed", "shown", "showing"],
  know: ["knows", "knew", "known", "knowing"],
  grow: ["grows", "grew", "grown", "growing"],
  write: ["writes", "wrote", "written", "writing"],
  drive: ["drives", "drove", "driven", "driving"],
  pick: ["picks", "picked", "picking"],
};

/**
 * Lowercased words with surrounding punctuation stripped; apostrophes kept.
 * Japanese, Chinese and Thai are cut by the word segmenter (wordSegments.ts),
 * so a phrase inside a line can be found in it at all.
 */
export function wordsOf(text: string, language?: string): string[] {
  return text
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[^\p{L}\p{M}\p{N}\s']/gu, " ")
    .split(/\s+/)
    .flatMap((chunk) => segmentChunk(chunk, language))
    .map((word) => word.replace(/^[^\p{L}\p{M}\p{N}']+|[^\p{L}\p{M}\p{N}']+$/gu, ""))
    .filter(Boolean);
}

const CONSONANT = /[bcdfghjklmnpqrstvwxz]$/;

/** Every form an English word of an expression may take in speech. */
export function formsOf(word: string): Set<string> {
  const forms = new Set<string>([word]);
  for (const form of IRREGULAR[word] ?? []) forms.add(form);
  if (!/^[a-z]+$/.test(word) || word.length < 2) return forms;
  forms.add(`${word}s`);
  forms.add(`${word}es`);
  if (word.endsWith("e")) {
    forms.add(`${word}d`);
    forms.add(`${word.slice(0, -1)}ing`);
  } else {
    forms.add(`${word}ed`);
    forms.add(`${word}ing`);
  }
  if (word.endsWith("y") && CONSONANT.test(word.slice(0, -1))) {
    forms.add(`${word.slice(0, -1)}ies`);
    forms.add(`${word.slice(0, -1)}ied`);
  }
  // stop → stopped, stopping (short consonant-vowel-consonant words).
  if (/^[^aeiou]*[aeiou][bdgklmnprt]$/.test(word)) {
    const last = word.slice(-1);
    forms.add(`${word}${last}ed`);
    forms.add(`${word}${last}ing`);
  }
  return forms;
}

type Step =
  | { kind: "word"; forms: Set<string>; allowGapBefore: number; prefix?: boolean }
  | { kind: "slot" };

function compile(expression: string, english: boolean, language: string): Step[] {
  const words = wordsOf(expression, language);
  // Korean attaches particles and endings to the word ("데" in "데를"), so a
  // word of the expression matches the start of a word in the line.
  const prefix = language.split("-")[0] === "ko";
  const steps: Step[] = words.map((word) =>
    english && PLACEHOLDERS.has(word)
      ? { kind: "slot" as const }
      : {
          kind: "word" as const,
          forms: english ? formsOf(word) : new Set([word]),
          allowGapBefore: 0,
          ...(prefix ? { prefix: true } : {}),
        },
  );
  // A verb + particle pair may be split by its object: "wait (it) out".
  if (english && steps.length === 2) {
    const [, last] = steps;
    const lastWord = words[1];
    if (last?.kind === "word" && lastWord && PARTICLES.has(lastWord)) {
      last.allowGapBefore = 2;
    }
  }
  return steps;
}

/** Try to match the steps starting at `from`; returns the index after the match. */
function matchAt(tokens: string[], steps: Step[], from: number): number | null {
  const go = (stepIndex: number, at: number): number | null => {
    if (stepIndex === steps.length) return at;
    const step = steps[stepIndex]!;
    if (step.kind === "slot") {
      for (let take = 1; take <= 3 && at + take <= tokens.length; take += 1) {
        const done = go(stepIndex + 1, at + take);
        if (done !== null) return done;
      }
      return null;
    }
    const maxGap = stepIndex === 0 ? 0 : step.allowGapBefore;
    for (let gap = 0; gap <= maxGap && at + gap < tokens.length; gap += 1) {
      const token = tokens[at + gap]!;
      if (
        step.forms.has(token) ||
        (step.prefix && [...step.forms].some((form) => token.startsWith(form)))
      ) {
        const done = go(stepIndex + 1, at + gap + 1);
        if (done !== null) return done;
      }
    }
    return null;
  };
  return go(0, from);
}

export function findExpression(
  lines: TranscriptLine[],
  expression: string,
  language = "en",
): ExpressionHit[] {
  const english = language.split("-")[0] === "en";
  const steps = compile(expression, english, language);
  if (steps.length === 0 || steps.every((step) => step.kind === "slot")) return [];
  const hits: ExpressionHit[] = [];
  lines.forEach((line, lineIndex) => {
    const tokens = wordsOf(line.text, language);
    for (let from = 0; from < tokens.length; from += 1) {
      const end = matchAt(tokens, steps, from);
      if (end !== null) {
        hits.push({
          lineIndex,
          start: line.start,
          end: line.end,
          text: line.text,
          matched: tokens.slice(from, end).join(" "),
        });
        from = end - 1;
      }
    }
  });
  return hits;
}

/**
 * Rank videos by how much of what the learner is working on is said in them.
 * A video that says more of the expressions beats one that says one of them
 * many times; ties go to more occurrences, then the shorter video.
 */
export function matchVideos(
  records: TranscriptRecord[],
  expressions: string[],
  limit = 20,
): VideoMatch[] {
  const wanted = [...new Set(expressions.map((e) => e.replace(/\s+/g, " ").trim()).filter(Boolean))];
  const matches: VideoMatch[] = [];
  for (const record of records) {
    const found = wanted
      .map((expression) => ({
        expression,
        hits: findExpression(record.lines, expression, record.language),
      }))
      .filter((entry) => entry.hits.length > 0);
    if (found.length === 0) continue;
    matches.push({
      videoId: record.videoId,
      ...(record.title ? { title: record.title } : {}),
      durationSeconds: record.durationSeconds,
      found,
      hitCount: found.reduce((sum, entry) => sum + entry.hits.length, 0),
    });
  }
  matches.sort(
    (a, b) =>
      b.found.length - a.found.length ||
      b.hitCount - a.hitCount ||
      a.durationSeconds - b.durationSeconds,
  );
  return matches.slice(0, limit);
}
