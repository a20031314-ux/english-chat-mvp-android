import {
  explanationLanguageGuard,
  interfaceLanguageDisplayName,
} from "../languageLearningAnalysis.ts";
import { learningLanguageName } from "../learningLanguages.ts";
import { pickNonOverlapping, withCharOffsets } from "./candidates.ts";
import type {
  LearnerLevel,
  RankedSalienceCandidate,
  SalienceCandidate,
  UdToken,
} from "./types.ts";

const LEVEL_MIN_SCORE: Record<LearnerLevel, number> = {
  beginner: 0.55,
  intermediate: 0.4,
  advanced: 0.45,
};

const BEGINNER_DROP = new Set(["literary", "etymology", "community_slang"]);
const ADVANCED_DROP_IF_ALONE = new Set([
  "contrast_article",
  "contrast_preposition",
  "contrast_3sg_s",
]);

export function filterByLearnerLevel(
  candidates: SalienceCandidate[],
  level: LearnerLevel,
): SalienceCandidate[] {
  const min = LEVEL_MIN_SCORE[level];
  return candidates.filter((item) => {
    if (item.totalScore < min) return false;
    if (level === "beginner" && item.signalTags.every((tag) => BEGINNER_DROP.has(tag))) {
      return false;
    }
    if (level === "advanced") {
      const onlyBasic = item.signalTags.every((tag) => ADVANCED_DROP_IF_ALONE.has(tag));
      if (onlyBasic) return false;
    }
    return true;
  });
}

export function reasonFromTags(tags: string[]): string {
  if (tags.includes("phrasal_verb") || tags.includes("idiom")) {
    return "Fixed multi-word unit — meaning is not the sum of the parts.";
  }
  if (tags.includes("community_slang") || tags.includes("neologism")) {
    return "Source-typical slang / in-group wording.";
  }
  if (tags.includes("literary")) {
    return "Written/literary wording that is easy to skip in a translation.";
  }
  if (tags.includes("irregular_verb")) {
    return "Irregular form — the shape itself is the learning point.";
  }
  if (tags.includes("contrast_article")) {
    return "Article use that the learner's native language does not mark this way.";
  }
  if (tags.length) return tags.join(", ");
  return "High-value span for this sentence.";
}

/** Hide scanner tags and empty strings from learner-facing "why here" copy. */
export function isLearnerFacingSalienceReason(
  text: string | null | undefined,
): boolean {
  const trimmed = (text ?? "").trim();
  if (!trimmed) return false;
  return !/^[a-z][a-z0-9_]*(?:\s*,\s*[a-z][a-z0-9_]*)*$/i.test(trimmed);
}

export function rankByScore(
  tokens: UdToken[],
  candidates: SalienceCandidate[],
  topN: number,
): RankedSalienceCandidate[] {
  const ranked = candidates
    .slice()
    .sort((a, b) => b.totalScore - a.totalScore || a.tokenRange.start - b.tokenRange.start)
    .map((item) => withCharOffsets(tokens, item, ""));
  return pickNonOverlapping(ranked, topN);
}

export function buildRankPrompt(input: {
  sentence: string;
  language: string;
  nativeLanguage: string;
  learnerLevel: LearnerLevel;
  topN: number;
  candidates: SalienceCandidate[];
}): string {
  const explanationName = interfaceLanguageDisplayName(input.nativeLanguage);
  const languageName = learningLanguageName(input.language);
  const guard = explanationLanguageGuard({
    interfaceLanguage: input.nativeLanguage,
    fieldsDescription: "each ranked.reason",
    learningLanguage: input.language,
  });

  return `You rank learning spans for a ${input.learnerLevel} learner of ${languageName} (explanation language: ${explanationName}).
${guard}

Sentence:
${input.sentence}

Candidates (JSON):
${JSON.stringify(
    input.candidates.map((item) => ({
      start: item.tokenRange.start,
      end: item.tokenRange.end,
      text: item.originalText,
      tags: item.signalTags,
      linguistic: Number(item.linguisticScore.toFixed(2)),
      source: Number(item.sourceExpressionScore.toFixed(2)),
    })),
  )}

Pick at most ${input.topN} spans the learner should study HERE.
Beginner: prefer core reusable chunks; drop trivia and literary flourish.
Advanced: prefer nuance, idiom, register; drop elementary articles/prepositions unless they carry the joke or the meaning.
Intermediate: reusable chunks and patterns.

Return ONLY JSON:
{"ranked":[{"start":0,"end":1,"reason":"one sentence in ${explanationName} why this is worth learning"}]}

Rules:
- start/end MUST be one of the candidate ranges.
- reason MUST be written only in ${explanationName}. Do not put scanner tags like key_expression in reason.
- Order best-first.
- Fewer than ${input.topN} is fine. Empty ranked is fine if nothing is worth teaching.`;
}

export function applyRankedJson(
  tokens: UdToken[],
  candidates: SalienceCandidate[],
  raw: unknown,
  topN: number,
): RankedSalienceCandidate[] | null {
  if (!raw || typeof raw !== "object") return null;
  const ranked = (raw as { ranked?: unknown }).ranked;
  if (!Array.isArray(ranked)) return null;
  const byKey = new Map(
    candidates.map((item) => [`${item.tokenRange.start}:${item.tokenRange.end}`, item] as const),
  );
  const out: RankedSalienceCandidate[] = [];
  for (const item of ranked) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const start = typeof o.start === "number" ? o.start : NaN;
    const end = typeof o.end === "number" ? o.end : NaN;
    const found = byKey.get(`${start}:${end}`);
    if (!found) continue;
    const reason =
      typeof o.reason === "string" &&
      isLearnerFacingSalienceReason(o.reason)
        ? o.reason.trim()
        : "";
    out.push(withCharOffsets(tokens, found, reason));
    if (out.length >= topN) break;
  }
  return pickNonOverlapping(out, topN);
}
