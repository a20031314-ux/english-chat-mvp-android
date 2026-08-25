import type { AnalysisDimension, DimensionPromptContext } from "./types.ts";

const DIMENSION_ROLE: Record<AnalysisDimension, string> = {
  syntax:
    "Explain the grammatical structure: how this span is built, how it is usually built, and how it is used in THIS sentence. Do not dump a textbook chapter.",
  usageInContext:
    "Explain how this expression is typically used, then why it was chosen in THIS sentence (instead of a plainer alternative).",
  phonology:
    "Explain pronunciation changes that happen in this span (linking, stress shift, deletion, assimilation, tone sandhi). Only if something actually changes; do not invent a phonology lesson.",
  morphology:
    "Break the form into stem + affixes / endings / particles. Flag irregular inflection. Show only the pieces that change meaning here.",
  pragmatics:
    "Explain register, politeness, honorifics, or interpersonal nuance carried by this span. Skip if the span is socially neutral.",
  etymology:
    "Give a short origin note only when it helps remember an idiom or frozen chunk. One or two sentences, not a history essay.",
};

export function buildDimensionPrompt(
  dimension: AnalysisDimension,
  ctx: DimensionPromptContext,
): string {
  const focus =
    ctx.focus.length > 0
      ? ctx.focus.map((item) => `- ${item}`).join("\n")
      : "- whatever is actually at issue in this span";
  const tags = ctx.signalTags.length > 0 ? ctx.signalTags.join(", ") : "(none)";

  return `You are a ${ctx.languageName} learning assistant.
Write learner-facing text in ${ctx.explanationLanguage}.
The learner's native language is ${ctx.nativeLanguage}. Contrast with it only when it clarifies.

Dimension: ${dimension}
${DIMENSION_ROLE[dimension]}

Language-profile focus for this dimension (prefer these if they apply; skip if they do not):
${focus}

Full sentence:
${ctx.sentence}

Span to analyze:
${ctx.spanText}

Salience tags from the scanner (hints, not a checklist): ${tags}

Rules:
- 2–5 short sentences. No bullet dump of every possible fact.
- Analyze ${ctx.languageName} in its own terms. Do not force English grammar labels onto other languages.
- If this dimension does not matter for THIS span, reply with exactly: SKIP
- Do not translate the whole sentence. Do not invent examples unless one short one makes the pattern reusable.`;
}

export function buildAllDimensionPrompts(
  dimensions: AnalysisDimension[],
  ctx: Omit<DimensionPromptContext, "focus"> & {
    focusByDimension: Partial<Record<AnalysisDimension, string[]>>;
  },
): Array<{ dimension: AnalysisDimension; prompt: string }> {
  return dimensions.map((dimension) => ({
    dimension,
    prompt: buildDimensionPrompt(dimension, {
      ...ctx,
      focus: ctx.focusByDimension[dimension] ?? [],
    }),
  }));
}
