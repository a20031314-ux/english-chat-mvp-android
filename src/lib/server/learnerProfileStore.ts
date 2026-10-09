import type OpenAI from "openai";
import { kvGetJson, kvSetJson } from "./kv.ts";
import { isIdentified } from "./identity.ts";
import { constructionsFor } from "../learner/constructions.ts";
import { classifyMessage, classifyPrompt, readClassification } from "../learner/classify.ts";
import {
  applyEvent,
  applyLearnerLine,
  applyTutorLine,
  parseComprehension,
  type ComprehensionEvent,
  type ComprehensionRecord,
} from "../learner/comprehension.ts";
import {
  applyTurn,
  parseProfile,
  withPlan,
  type LearnerPlan,
  type LearnerProfile,
} from "../learner/profile.ts";

/**
 * Where a learner's construction profile (learner/profile.ts) is kept: one per
 * person and learning language, ids and outcomes only — the sentence a turn was
 * read from is used for the one classification call and not stored.
 *
 * Kept as long as it is used, like the study map beside it.
 */

const TTL_SECONDS = 400 * 24 * 60 * 60;
const MODEL = () => process.env.OPENAI_LEARNER_MODEL?.trim() || "gpt-4.1-mini";

function key(userId: string, language: string): string {
  return `learnerProfile:v1:${userId}:${language}`;
}

function comprehensionKey(userId: string, language: string): string {
  return `learnerComprehension:v1:${userId}:${language}`;
}

export async function readComprehension(userId: string, language: string): Promise<ComprehensionRecord> {
  return parseComprehension(await kvGetJson(comprehensionKey(userId, language)), language);
}

async function updateComprehension(
  userId: string,
  language: string,
  change: (record: ComprehensionRecord) => ComprehensionRecord,
): Promise<ComprehensionRecord> {
  const before = await readComprehension(userId, language);
  const after = change(before);
  if (after !== before) await kvSetJson(comprehensionKey(userId, language), after, TTL_SECONDS);
  return after;
}

/** Things the learner did with a tutor's line: looked up, analysed, asked, saved. */
export async function recordComprehensionEvents(
  userId: string,
  language: string,
  events: ComprehensionEvent[],
): Promise<ComprehensionRecord | null> {
  if (!isIdentified(userId) || events.length === 0) return null;
  try {
    return await updateComprehension(userId, language, (record) =>
      events.reduce((r, event) => applyEvent(r, event), record),
    );
  } catch (error) {
    console.error("[learner-comprehension] record failed", error);
    return null;
  }
}

/**
 * A chat turn's two lines against what the learner has looked up: the tutor's
 * reply counts as a quiet appearance of anything in it, and the learner's own
 * sentence — when the correction kept the phrase — as use. Neither line is
 * stored.
 */
export async function observeChatLines(input: {
  userId: string;
  language: string;
  tutorLine: string;
  learnerLine?: { sentence: string; corrected: string };
}): Promise<void> {
  if (!isIdentified(input.userId)) return;
  try {
    await updateComprehension(input.userId, input.language, (record) => {
      if (Object.keys(record.items).length === 0) return record;
      let next = record;
      if (input.learnerLine) {
        next = applyLearnerLine(next, input.learnerLine.sentence, input.learnerLine.corrected);
      }
      return input.tutorLine ? applyTutorLine(next, input.tutorLine) : next;
    });
  } catch (error) {
    console.error("[learner-comprehension] observe failed", error);
  }
}

export async function readLearnerProfile(userId: string, language: string): Promise<LearnerProfile> {
  return parseProfile(await kvGetJson(key(userId, language)), language);
}

export async function saveLearnerPlan(
  userId: string,
  language: string,
  plan: Partial<LearnerPlan>,
): Promise<LearnerProfile> {
  const next = withPlan(await readLearnerProfile(userId, language), plan);
  await kvSetJson(key(userId, language), next, TTL_SECONDS);
  return next;
}

/**
 * Read one chat turn into the profile. Run after the reply has gone out
 * (next/server `after`), so a slow or failed call never costs the learner
 * their turn; every failure is logged and swallowed.
 */
export async function observeChatTurn(input: {
  openai: OpenAI;
  userId: string;
  language: string;
  sentence: string;
  corrected: string;
}): Promise<void> {
  try {
    if (!isIdentified(input.userId)) return;
    const list = constructionsFor(input.language);
    const sentence = input.sentence.replace(/\s+/g, " ").trim().slice(0, 400);
    if (list.length === 0 || sentence.split(" ").length < 3) return;
    const completion = await input.openai.chat.completions.create({
      model: MODEL(),
      temperature: 0,
      max_tokens: 150,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: classifyPrompt(list) },
        { role: "user", content: classifyMessage(sentence, input.corrected.trim().slice(0, 400)) },
      ],
    });
    const outcomes = readClassification(completion.choices[0]?.message?.content ?? "", list);
    if (outcomes.length === 0) return;
    const profile = await readLearnerProfile(input.userId, input.language);
    await kvSetJson(key(input.userId, input.language), applyTurn(profile, outcomes), TTL_SECONDS);
  } catch (error) {
    console.error("[learner-profile] observe failed", error);
  }
}
