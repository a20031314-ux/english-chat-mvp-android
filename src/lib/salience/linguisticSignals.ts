import { PARTICLES } from "./englishClosedClass.ts";
import type { SalienceCandidate, UdToken } from "./types.ts";

type ContrastRule = {
  tag: string;
  score: number;
  match: (token: UdToken, tokens: UdToken[]) => boolean;
};

/** L1 features that typically do not exist (or work differently) in the native language. */
const CONTRAST_VS_NATIVE: Record<string, ContrastRule[]> = {
  ko: [
    {
      tag: "contrast_article",
      score: 0.72,
      match: (t) => t.upos === "DET" && /^(the|a|an)$/i.test(t.text),
    },
    {
      tag: "contrast_infinitive_to",
      score: 0.55,
      match: (t) => t.upos === "PART" && t.text.toLowerCase() === "to",
    },
    {
      tag: "contrast_do_support",
      score: 0.6,
      match: (t) => t.upos === "AUX" && /^(do|does|did)$/i.test(t.text),
    },
    {
      tag: "contrast_perfect_aux",
      score: 0.58,
      match: (t, tokens) =>
        t.upos === "AUX" &&
        /^(have|has|had|'ve|'d)$/i.test(t.text.replace(/^(?:i|you|we|they|he|she|it)/i, "")) &&
        tokens.some((x) => x.morphFeatures.VerbForm === "Part" || /^(been|gone|done|seen)$/i.test(x.text)),
    },
    {
      tag: "contrast_preposition",
      score: 0.42,
      match: (t) => t.upos === "ADP" && t.depRelation === "case",
    },
    {
      tag: "contrast_3sg_s",
      score: 0.45,
      match: (t) =>
        (t.upos === "VERB" || t.upos === "AUX") && t.morphFeatures.Person === "3" && t.morphFeatures.Number === "Sing",
    },
  ],
  ja: [
    {
      tag: "contrast_article",
      score: 0.72,
      match: (t) => t.upos === "DET" && /^(the|a|an)$/i.test(t.text),
    },
    {
      tag: "contrast_plural_s",
      score: 0.4,
      match: (t) => t.upos === "NOUN" && t.morphFeatures.Number === "Plur",
    },
    {
      tag: "contrast_preposition",
      score: 0.42,
      match: (t) => t.upos === "ADP" && t.depRelation === "case",
    },
  ],
  zh: [
    {
      tag: "contrast_article",
      score: 0.7,
      match: (t) => t.upos === "DET" && /^(the|a|an)$/i.test(t.text),
    },
    {
      tag: "contrast_tense_morph",
      score: 0.5,
      match: (t) => (t.upos === "VERB" || t.upos === "AUX") && Boolean(t.morphFeatures.Tense),
    },
  ],
  es: [
    {
      tag: "contrast_do_support",
      score: 0.65,
      match: (t) => t.upos === "AUX" && /^(do|does|did)$/i.test(t.text),
    },
    {
      tag: "contrast_phrasal_prt",
      score: 0.5,
      match: (t) => t.depRelation === "compound:prt",
    },
  ],
};

function nativeKey(code: string): string {
  const lower = code.toLowerCase();
  if (lower.startsWith("ko")) return "ko";
  if (lower.startsWith("ja")) return "ja";
  if (lower.startsWith("zh")) return "zh";
  if (lower.startsWith("es")) return "es";
  return lower.slice(0, 2);
}

function tokenText(tokens: UdToken[], start: number, end: number): string {
  return tokens
    .slice(start, end + 1)
    .map((t) => t.text)
    .join(" ");
}

function pushCandidate(
  out: SalienceCandidate[],
  tokens: UdToken[],
  start: number,
  end: number,
  tag: string,
  linguisticScore: number,
): void {
  const existing = out.find((c) => c.tokenRange.start === start && c.tokenRange.end === end);
  if (existing) {
    existing.linguisticScore = Math.min(1, existing.linguisticScore + linguisticScore * 0.45);
    if (!existing.signalTags.includes(tag)) existing.signalTags.push(tag);
    existing.totalScore = existing.linguisticScore + existing.sourceExpressionScore;
    return;
  }
  out.push({
    tokenRange: { start, end },
    originalText: tokenText(tokens, start, end),
    linguisticScore,
    sourceExpressionScore: 0,
    signalTags: [tag],
    totalScore: linguisticScore,
  });
}

function scoreContrast(tokens: UdToken[], nativeLanguage: string, out: SalienceCandidate[]): void {
  const rules = CONTRAST_VS_NATIVE[nativeKey(nativeLanguage)] ?? [];
  for (const token of tokens) {
    for (const rule of rules) {
      if (rule.match(token, tokens)) {
        pushCandidate(out, tokens, token.index, token.index, rule.tag, rule.score);
      }
    }
  }
}

function scoreIrregular(tokens: UdToken[], out: SalienceCandidate[]): void {
  for (const token of tokens) {
    if (token.morphFeatures.VerbFormHint !== "Irregular") continue;
    const lemma = token.lemma.toLowerCase();
    const text = token.text.toLowerCase();
    if (lemma === "be" && text !== "been") continue;
    if (lemma === "have" && /^(have|has)$/i.test(text)) continue;
    pushCandidate(out, tokens, token.index, token.index, "irregular_verb", 0.8);
  }
}

function scoreMultiword(tokens: UdToken[], out: SalienceCandidate[]): void {
  for (const token of tokens) {
    if (token.depRelation !== "compound:prt") continue;
    const verb = tokens[token.headIndex];
    if (!verb) continue;
    const start = Math.min(verb.index, token.index);
    const end = Math.max(verb.index, token.index);
    const between = tokens.slice(start + 1, end);
    const onlyPronounGap = between.every((t) => t.upos === "PRON" || t.upos === "ADV" || t.upos === "PART");
    if (!onlyPronounGap && end - start > 3) continue;
    const tag = PARTICLES.has(token.text.toLowerCase()) ? "phrasal_verb" : "mwe_verb_adp";
    pushCandidate(out, tokens, start, end, tag, 0.86);
  }

  for (let i = 0; i < tokens.length - 1; i += 1) {
    const a = tokens[i];
    const b = tokens[i + 1];
    if (a.upos === "VERB" && b.upos === "ADP" && PARTICLES.has(b.text.toLowerCase())) {
      pushCandidate(out, tokens, i, i + 1, "phrasal_verb", 0.74);
    }
  }
}

export function scoreLinguisticSignals(
  tokens: UdToken[],
  nativeLanguage: string,
): SalienceCandidate[] {
  const out: SalienceCandidate[] = [];
  scoreContrast(tokens, nativeLanguage, out);
  scoreIrregular(tokens, out);
  scoreMultiword(tokens, out);
  out.sort((a, b) => b.totalScore - a.totalScore || a.tokenRange.start - b.tokenRange.start);
  return out;
}
