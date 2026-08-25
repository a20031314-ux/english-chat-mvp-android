import { isWordToken, tokenize } from "../textTokens.ts";
import {
  ADP,
  ADV,
  AUX,
  CCONJ,
  DET,
  PARTICLES,
  PRON,
  SCONJ,
  isIrregularVerbForm,
  verbLemma,
} from "./englishClosedClass.ts";
import type { UdToken } from "./types.ts";

function lemmaOf(word: string, upos: string): string {
  const lower = word.toLowerCase();
  if (upos === "VERB" || upos === "AUX") {
    return verbLemma(lower.replace(/n't$/, "")) ?? stripVerbAffix(lower);
  }
  if (upos === "NOUN" && /s$/i.test(word) && word.length > 3 && !/ss$/i.test(word)) {
    return lower.replace(/ies$/, "y").replace(/es$/, "").replace(/s$/, "");
  }
  return lower.replace(/'s$/, "");
}

function stripVerbAffix(lower: string): string {
  if (lower.endsWith("ing") && lower.length > 5) return lower.slice(0, -3);
  if (lower.endsWith("ied") && lower.length > 4) return `${lower.slice(0, -3)}y`;
  if (lower.endsWith("ed") && lower.length > 4) return lower.slice(0, -2);
  if (lower.endsWith("es") && lower.length > 4) return lower.slice(0, -2);
  if (lower.endsWith("s") && lower.length > 3 && !lower.endsWith("ss")) return lower.slice(0, -1);
  return lower;
}

function looksLikeVerb(word: string): boolean {
  const lower = word.toLowerCase().replace(/n't$/, "");
  if (verbLemma(lower)) return true;
  if (/(ing|ed|es)$/i.test(lower) && lower.length > 4) return true;
  return false;
}

function tagUpos(word: string, prev: string | null, next: string | null): string {
  const lower = word.toLowerCase();
  if (/^n'?t$/.test(lower) || lower === "not") return "PART";
  if (/^to$/.test(lower) && next && looksLikeVerb(next) && !ADP.has((next ?? "").toLowerCase())) {
    return "PART";
  }
  if (SCONJ.has(lower) && lower !== "that") return "SCONJ";
  if (CCONJ.has(lower)) return "CCONJ";
  if (DET.has(lower) && lower !== "that" && lower !== "this") return "DET";
  if (AUX.has(lower) || /'(?:d|ve|ll|re|m|s)$/.test(lower) || /^(?:i|you|he|she|it|we|they)'(?:d|ve|ll|re|m|s)$/.test(lower)) {
    if (/^(?:he|she|it|that|there)'s$/.test(lower)) return "AUX";
    if (/'s$/.test(lower) && PRON.has(lower.replace(/'s$/, ""))) return "AUX";
    if (/'s$/.test(lower) && !AUX.has(lower) && !PRON.has(lower.replace(/'s$/, ""))) {
      return "PART";
    }
    if (AUX.has(lower) || /'(?:d|ve|ll|re|m)$/.test(lower)) return "AUX";
  }
  if (PRON.has(lower) && lower !== "that" && lower !== "this") return "PRON";
  if (lower === "that" || lower === "this") {
    if (next && DET.has(next.toLowerCase())) return "PRON";
    if (next && /^[A-Z]/.test(next)) return "DET";
    if (next && looksLikeVerb(next)) return "PRON";
    return "SCONJ";
  }
  if (PARTICLES.has(lower) && prev && looksLikeVerb(prev)) return "ADP";
  if (ADP.has(lower) || PARTICLES.has(lower)) return "ADP";
  if (ADV.has(lower) || /ly$/i.test(word)) return "ADV";
  if (looksLikeVerb(word)) return AUX.has(lower) ? "AUX" : "VERB";
  if (/(ous|ful|less|ive|able|al|ic)$/i.test(word)) return "ADJ";
  return "NOUN";
}

function morphFor(word: string, upos: string): Record<string, string> {
  const lower = word.toLowerCase();
  const feats: Record<string, string> = {};
  if (upos === "VERB" || upos === "AUX") {
    const lemma = lemmaOf(word, upos);
    if (isIrregularVerbForm(word.replace(/n't$/i, ""))) feats.VerbFormHint = "Irregular";
    if (/ing$/i.test(lower)) feats.VerbForm = "Gerund";
    else if (/ed$/i.test(lower) || ["was", "were", "had", "did", "got", "went", "came"].includes(lower)) {
      feats.Tense = "Past";
    } else if (["is", "are", "am", "has", "does"].includes(lower) || /s$/i.test(lower)) {
      feats.Number = "Sing";
      feats.Person = "3";
    }
    if (["been", "gone", "done", "seen", "taken", "given", "gotten"].includes(lower)) {
      feats.VerbForm = "Part";
      feats.Tense = "Past";
    }
    feats.Lemma = lemma;
  }
  if (upos === "DET" && /^(the|a|an)$/.test(lower)) feats.Definite = lower === "the" ? "Def" : "Ind";
  if (upos === "NOUN" && /s$/i.test(word) && word.length > 3 && !/ss$/i.test(word)) {
    feats.Number = "Plur";
  }
  return feats;
}

function assignDeps(tokens: UdToken[]): void {
  const root =
    tokens.find((t) => t.upos === "VERB") ??
    tokens.find((t) => t.upos === "AUX") ??
    tokens[0];
  if (!root) return;
  root.depRelation = "root";
  root.headIndex = -1;

  for (const token of tokens) {
    if (token.index === root.index) continue;
    const prev = tokens[token.index - 1];
    const next = tokens[token.index + 1];

    if (token.upos === "DET") {
      const noun = tokens.slice(token.index + 1).find((t) => t.upos === "NOUN" || t.upos === "PRON");
      token.depRelation = "det";
      token.headIndex = noun?.index ?? root.index;
      continue;
    }
    if (token.upos === "AUX") {
      token.depRelation = "aux";
      token.headIndex = root.index;
      continue;
    }
    if (token.upos === "PART" && token.text.toLowerCase() === "to") {
      token.depRelation = "mark";
      token.headIndex = next?.index ?? root.index;
      continue;
    }
    if (token.upos === "PART") {
      token.depRelation = "advmod";
      token.headIndex = prev && (prev.upos === "VERB" || prev.upos === "AUX") ? prev.index : root.index;
      continue;
    }
    if (token.upos === "ADP") {
      const afterVerb = prev && (prev.upos === "VERB" || prev.upos === "AUX" || prev.upos === "PRON");
      if (afterVerb && PARTICLES.has(token.text.toLowerCase())) {
        const verb = [...tokens.slice(0, token.index)].reverse().find((t) => t.upos === "VERB") ?? root;
        token.depRelation = "compound:prt";
        token.headIndex = verb.index;
        continue;
      }
      const noun = tokens.slice(token.index + 1).find((t) => t.upos === "NOUN" || t.upos === "PRON");
      token.depRelation = "case";
      token.headIndex = noun?.index ?? root.index;
      continue;
    }
    if (token.upos === "ADV") {
      token.depRelation = "advmod";
      token.headIndex = root.index;
      continue;
    }
    if (token.upos === "ADJ") {
      const noun = tokens.slice(token.index + 1).find((t) => t.upos === "NOUN");
      token.depRelation = "amod";
      token.headIndex = noun?.index ?? root.index;
      continue;
    }
    if (token.upos === "SCONJ" || token.upos === "CCONJ") {
      token.depRelation = token.upos === "SCONJ" ? "mark" : "cc";
      token.headIndex = root.index;
      continue;
    }
    if (token.upos === "PRON" || token.upos === "NOUN") {
      if (token.index < root.index) {
        token.depRelation = "nsubj";
        token.headIndex = root.index;
      } else {
        token.depRelation = "obj";
        token.headIndex = root.index;
      }
    }
  }
}

export function parseUd(sentence: string, language: string): {
  tokens: UdToken[];
  parser: "english-rules" | "generic-tokenize";
} {
  if (language === "en" || language.startsWith("en-")) {
    return { tokens: parseEnglishUd(sentence), parser: "english-rules" };
  }
  return { tokens: parseGenericUd(sentence), parser: "generic-tokenize" };
}

export function parseEnglishUd(sentence: string): UdToken[] {
  const raw = tokenize(sentence);
  const words: { text: string; charStart: number; charEnd: number }[] = [];
  let offset = 0;
  for (const piece of raw) {
    if (isWordToken(piece)) {
      words.push({ text: piece, charStart: offset, charEnd: offset + piece.length });
    }
    offset += piece.length;
  }

  const tokens: UdToken[] = words.map((word, index) => {
    const prev = words[index - 1]?.text ?? null;
    const next = words[index + 1]?.text ?? null;
    const upos = tagUpos(word.text, prev, next);
    return {
      index,
      text: word.text,
      lemma: lemmaOf(word.text, upos),
      upos,
      morphFeatures: morphFor(word.text, upos),
      depRelation: "dep",
      headIndex: -1,
      charStart: word.charStart,
      charEnd: word.charEnd,
    };
  });
  assignDeps(tokens);
  return tokens;
}

function parseGenericUd(sentence: string): UdToken[] {
  const raw = tokenize(sentence);
  const tokens: UdToken[] = [];
  let offset = 0;
  for (const piece of raw) {
    if (isWordToken(piece)) {
      tokens.push({
        index: tokens.length,
        text: piece,
        lemma: piece.toLowerCase(),
        upos: "X",
        morphFeatures: {},
        depRelation: "dep",
        headIndex: -1,
        charStart: offset,
        charEnd: offset + piece.length,
      });
    }
    offset += piece.length;
  }
  if (tokens[0]) {
    tokens[0].depRelation = "root";
  }
  return tokens;
}

/**
 * LLM fallback schema for languages without a local UD parser.
 * Not called in the rule-based scan; later stages can fill tokens this way.
 */
export const UD_LLM_JSON_SCHEMA = {
  tokens: [
    {
      text: "string",
      upos: "ADJ|ADP|ADV|AUX|CCONJ|DET|INTJ|NOUN|NUM|PART|PRON|PROPN|PUNCT|SCONJ|SYM|VERB|X",
      lemma: "string",
      morphFeatures: { Case: "Nom|Acc|Gen|Dat|...", Tense: "Past|Pres|Fut", Number: "Sing|Plur" },
      depRelation: "nsubj|obj|iobj|obl|root|aux|cop|case|det|amod|advmod|compound:prt|mark|cc|conj|...",
      headIndex: 0,
    },
  ],
} as const;
