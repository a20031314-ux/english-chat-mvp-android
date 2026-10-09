import type { Construction } from "./constructions.ts";
import type { Outcome } from "./profile.ts";

/**
 * Reading one learner sentence for the constructions in it, and whether each
 * came out right.
 *
 * The chat already corrects every sentence; this asks a small model one narrow
 * question about the pair — which constructions on the fixed list does the
 * learner's sentence use, and which of them did the correction have to fix —
 * so the answer is ids, never prose. A construction the sentence does not use
 * is not mentioned at all: not using the past tense is not a mistake in it.
 *
 * Pure: the prompt and the reading of the answer.
 */

export function classifyPrompt(list: Construction[]): string {
  const lines = list.map((c) => `${c.id} — ${c.en}: ${c.hint}`).join("\n");
  return `You label one English sentence written by a language learner.

You get the learner's sentence and a corrected version (the same when nothing needed fixing). Decide which constructions from this list the LEARNER'S sentence attempts, and for each, whether it was right.

${lines}

- "used": ids the learner's sentence uses correctly.
- "missed": ids the learner's sentence attempts but gets wrong — the correction had to change that part.
- Only constructions actually present in the learner's sentence. Leave out what it does not attempt.
- A word-choice or spelling fix that is not one of these constructions is left out.
- At most 6 ids in each list.

Return only json: {"used":[],"missed":[]}`;
}

export function classifyMessage(sentence: string, corrected: string): string {
  return JSON.stringify({ learner: sentence, corrected: corrected || sentence });
}

/** Read the model's answer into outcomes; unknown ids and junk are dropped. */
export function readClassification(raw: string, list: Construction[]): Outcome[] {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!data || typeof data !== "object") return [];
  const known = new Set(list.map((c) => c.id));
  const row = data as Record<string, unknown>;
  const ids = (value: unknown) =>
    Array.isArray(value)
      ? [...new Set(value.filter((id): id is string => typeof id === "string" && known.has(id)))].slice(0, 6)
      : [];
  const missed = ids(row.missed);
  const used = ids(row.used).filter((id) => !missed.includes(id));
  return [
    ...used.map((id) => ({ id, ok: true })),
    ...missed.map((id) => ({ id, ok: false })),
  ];
}
