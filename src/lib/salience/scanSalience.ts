import { scoreLinguisticSignals } from "./linguisticSignals.ts";
import type { LinguisticScanInput, LinguisticScanResult } from "./types.ts";
import { parseUd } from "./udParse.ts";

export function scanLinguisticSalience(input: LinguisticScanInput): LinguisticScanResult {
  const { tokens, parser } = parseUd(input.sentence, input.language);
  const candidates = scoreLinguisticSignals(tokens, input.nativeLanguage);
  return { tokens, parser, candidates };
}

export function logLinguisticSalience(input: LinguisticScanInput): LinguisticScanResult {
  const result = scanLinguisticSalience(input);
  console.info("[salience:ud]", {
    sentence: input.sentence,
    language: input.language,
    nativeLanguage: input.nativeLanguage,
    parser: result.parser,
    tokens: result.tokens.map((t) => ({
      i: t.index,
      text: t.text,
      upos: t.upos,
      lemma: t.lemma,
      dep: t.depRelation,
      head: t.headIndex,
      morph: t.morphFeatures,
    })),
  });
  console.info(
    "[salience:candidates]",
    result.candidates.map((c) => ({
      span: `${c.tokenRange.start}..${c.tokenRange.end}`,
      text: c.originalText,
      linguistic: Number(c.linguisticScore.toFixed(3)),
      source: c.sourceExpressionScore,
      total: Number(c.totalScore.toFixed(3)),
      tags: c.signalTags,
    })),
  );
  return result;
}
