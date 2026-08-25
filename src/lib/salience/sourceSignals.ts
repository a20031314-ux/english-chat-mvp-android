import { locatePhrase, makeCandidate } from "./candidates.ts";
import { SOURCE_LEXICON } from "./sourceLexicon.ts";
import { sourceContextHint } from "./sourceContext.ts";
import type {
  SalienceCandidate,
  SourceContext,
  UdToken,
} from "./types.ts";

export function scoreSourceLexicon(
  tokens: UdToken[],
  sourceContext: SourceContext,
): SalienceCandidate[] {
  const out: SalienceCandidate[] = [];
  for (const entry of SOURCE_LEXICON) {
    if (entry.contexts && !entry.contexts.includes(sourceContext)) continue;
    for (const span of locatePhrase(tokens, entry.phrase)) {
      out.push(
        makeCandidate({
          tokens,
          start: span.start,
          end: span.end,
          sourceExpressionScore: entry.score,
          signalTags: [...entry.tags],
        }),
      );
    }
  }
  return out;
}

export function buildSourceExpressionPrompt(input: {
  sentence: string;
  language: string;
  sourceContext: SourceContext;
  alreadyFound: string[];
}): string {
  const found =
    input.alreadyFound.length > 0
      ? input.alreadyFound.map((text) => `- ${text}`).join("\n")
      : "(none yet)";
  return `Find source-specific expressions worth learning in this ${input.language} sentence.

${sourceContextHint(input.sourceContext)}

Sentence:
${input.sentence}

Already found (do not repeat):
${found}

Return ONLY JSON:
{"expressions":[{"text":"exact substring","tags":["idiom"],"score":0.0}]}

Rules:
- text MUST be an exact substring of the sentence.
- 0–4 items. Empty array is fine.
- score is 0–1 (how source-typical and worth learning).
- tags from: idiom, phrasal_verb, community_slang, neologism, abbreviation, literary, spoken_reduction, key_expression
- Do not invent grammar points. Do not repeat already-found spans.`;
}

export function parseSourceExpressionJson(
  raw: unknown,
  tokens: UdToken[],
): SalienceCandidate[] {
  if (!raw || typeof raw !== "object") return [];
  const expressions = (raw as { expressions?: unknown }).expressions;
  if (!Array.isArray(expressions)) return [];
  const out: SalienceCandidate[] = [];
  for (const item of expressions) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const text = typeof o.text === "string" ? o.text.replace(/\s+/g, " ").trim() : "";
    if (!text) continue;
    const spans = locatePhrase(tokens, text);
    if (spans.length === 0) continue;
    const tags = Array.isArray(o.tags)
      ? o.tags.filter((tag): tag is string => typeof tag === "string" && tag.length > 0)
      : ["key_expression"];
    const score =
      typeof o.score === "number" && Number.isFinite(o.score)
        ? Math.max(0, Math.min(1, o.score))
        : 0.7;
    for (const span of spans) {
      out.push(
        makeCandidate({
          tokens,
          start: span.start,
          end: span.end,
          sourceExpressionScore: score,
          signalTags: tags.length ? tags : ["key_expression"],
        }),
      );
    }
  }
  return out;
}
