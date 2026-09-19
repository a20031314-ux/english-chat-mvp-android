/**
 * Reading a draft the way a person would, before a person has to.
 *
 * Every sentence in the catalog was drafted by a model and then read by
 * someone, and that reading was always the expensive half — `draft-roleplay-
 * scenario.mjs` says so, and deliberately prints its draft rather than saving
 * it so the reading cannot be skipped. The trouble is that it does not scale:
 * the bank has to grow by hundreds before an open conversation has anything to
 * draw on, and nobody reads hundreds of lines carefully twice.
 *
 * So the reading is split three ways rather than dropped. The structure — every
 * node reachable, every sentence present, every step answerable in more than
 * one way — is already tests, and tests do not get tired. This is the second
 * part: the language itself, checked by a model that did not write it, against
 * a list of the things that actually went wrong before. What is left for a
 * person is the third part, which is judgement about where a learner gets
 * stuck, and that is per situation rather than per sentence.
 *
 * A verdict here is never the last word. "fix" and "cut" are where someone
 * looks, and "ok" only means nothing on the list was tripped.
 *
 * Pure: the prompt is built and the answer read here. The script moves bytes.
 */

/** A line waiting to be read, with enough around it to judge by. */
export type DraftLine = {
  /** Its id in the bank, so a verdict can be matched back to it. */
  id: string;
  text: string;
  /** The gloss that ships with it, if it has one. */
  translation?: string;
  /** Who says it — a barista and a friend do not sound alike. */
  role: string;
};

export type Verdict = {
  id: string;
  /** "ok" trips nothing; "fix" needs a change; "cut" should not ship at all. */
  verdict: "ok" | "fix" | "cut";
  /** Why, in one sentence. Empty for "ok". */
  why: string;
  /** The line rewritten, when the reviewer could write it. */
  suggestion?: string;
};

export const MAX_LINES_PER_REVIEW = 25;

/**
 * What the reviewer is asked to look for.
 *
 * Each of these is something that went wrong in this catalog, not a general
 * theory of good writing. A list of everything one could say about a sentence
 * produces a verdict on every sentence, which is the same as no verdict at all.
 */
export function draftReviewPrompt(input: {
  lines: DraftLine[];
  setting: string;
  targetLanguage: string;
  nativeLanguage: string;
}): string {
  const listed = input.lines
    .map(
      (line) =>
        `- id: ${line.id}\n  said by: ${line.role}\n  line: "${line.text}"${
          line.translation ? `\n  gloss: "${line.translation}"` : ""
        }`,
    )
    .join("\n");

  return `You are reading lines drafted for a language-learning roleplay before anyone records them. You did not write them. Your job is to catch what should not ship, not to improve what is already fine.

The learner is learning ${input.targetLanguage} and speaks ${input.nativeLanguage}. The scene: ${input.setting}

The lines:
${listed}

Judge each line against this list, and nothing else:
1. Would the person named actually say this, out loud, at work or among friends? These are spoken turns. Written-sounding lines, narrator lines and customer-service scripts are the failure this list exists for.
2. Is it one breath long? A line that has to be listened to twice is too long.
3. Does the gloss say what the line says, the way a ${input.nativeLanguage} speaker would say it in that moment — not word for word? "to go" at a café is takeaway, not travelling. A missing gloss is fine; a wrong one is not.
4. Does it teach something a learner should not copy: a phrasing that is regional, dated, stiff, or simply not what people say?
5. If it asks a question, can the learner answer it with what they would plausibly know at this point?

Verdicts:
- "ok" — nothing on the list is tripped. Say nothing else.
- "fix" — one of them is, and you can write the line better. Give the rewrite.
- "cut" — it should not exist here at all: it teaches the wrong thing, or nobody would say it.

Most lines in a decent draft are "ok". Reaching for "fix" on every line makes the pass useless, because then nobody reads the output either.

Reply as JSON only:
{"verdicts": [{"id": "<id>", "verdict": "ok" | "fix" | "cut", "why": "<one sentence in ${input.nativeLanguage}, empty when ok>", "suggestion": "<the line rewritten, in ${input.targetLanguage}, only for fix>"}]}

One entry per line given, in the same order, and no ids that were not given.`;
}

/**
 * The verdicts out of the answer, held to the lines that were asked about.
 *
 * A line the reviewer did not mention comes back as "ok" rather than missing:
 * a draft that silently loses half its lines between here and a person reading
 * the output is worse than one that says nothing, because the gap is invisible.
 */
export function parseDraftReview(raw: string, lines: DraftLine[]): Verdict[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  const list = (parsed as { verdicts?: unknown } | null)?.verdicts;
  const byId = new Map<string, Verdict>();
  if (Array.isArray(list)) {
    for (const entry of list) {
      const record = (typeof entry === "object" && entry !== null ? entry : {}) as {
        id?: unknown;
        verdict?: unknown;
        why?: unknown;
        suggestion?: unknown;
      };
      const id = typeof record.id === "string" ? record.id.trim() : "";
      if (!id || byId.has(id)) continue;
      const verdict =
        record.verdict === "fix" || record.verdict === "cut" ? record.verdict : "ok";
      const suggestion =
        typeof record.suggestion === "string" ? record.suggestion.trim() : "";
      byId.set(id, {
        id,
        verdict,
        why: verdict === "ok" ? "" : (typeof record.why === "string" ? record.why.trim() : ""),
        ...(verdict === "fix" && suggestion ? { suggestion } : {}),
      });
    }
  }
  return lines.map(
    (line) => byId.get(line.id) ?? { id: line.id, verdict: "ok" as const, why: "" },
  );
}

/** What a person still has to look at. */
export function needsEyes(verdicts: Verdict[]): Verdict[] {
  return verdicts.filter((verdict) => verdict.verdict !== "ok");
}
