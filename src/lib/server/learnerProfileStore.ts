import type OpenAI from "openai";
import { kvGetJson, kvSetJson } from "./kv.ts";
import { isIdentified } from "./identity.ts";
import { constructionsFor } from "../learner/constructions.ts";
import { classifyMessage, classifyPrompt, readClassification } from "../learner/classify.ts";
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
