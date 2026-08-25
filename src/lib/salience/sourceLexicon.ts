import type { SourceContext } from "./types.ts";

export type LexiconEntry = {
  /** Space-separated lemmas / words to match (lowercase). */
  phrase: string;
  tags: string[];
  score: number;
  /** If set, only fire for these source types. Omit = all sources. */
  contexts?: SourceContext[];
};

/**
 * Compact seed lexicon. Not Wiktionary — just enough to prove matching.
 * Unknown expressions are filled in later by the source-context LLM pass.
 */
export const SOURCE_LEXICON: LexiconEntry[] = [
  { phrase: "end up", tags: ["idiom", "phrasal_verb"], score: 0.82 },
  { phrase: "turf out", tags: ["idiom", "phrasal_verb"], score: 0.88 },
  { phrase: "kick out", tags: ["idiom", "phrasal_verb"], score: 0.8 },
  { phrase: "figure out", tags: ["idiom", "phrasal_verb"], score: 0.8 },
  { phrase: "give up", tags: ["idiom", "phrasal_verb"], score: 0.78 },
  { phrase: "hang out", tags: ["idiom", "phrasal_verb"], score: 0.76 },
  { phrase: "work out", tags: ["idiom", "phrasal_verb"], score: 0.74 },
  { phrase: "look after", tags: ["idiom", "phrasal_verb"], score: 0.8 },
  { phrase: "put up with", tags: ["idiom", "phrasal_verb"], score: 0.88 },
  { phrase: "once in a while", tags: ["idiom"], score: 0.8 },
  { phrase: "by the way", tags: ["idiom"], score: 0.7 },
  { phrase: "kind of", tags: ["hedge"], score: 0.62, contexts: ["videoLearning", "chat"] },
  { phrase: "gonna", tags: ["spoken_reduction"], score: 0.7, contexts: ["videoLearning", "chat"] },
  { phrase: "wanna", tags: ["spoken_reduction"], score: 0.7, contexts: ["videoLearning", "chat"] },
  { phrase: "ain't", tags: ["spoken_reduction"], score: 0.72, contexts: ["videoLearning", "chat"] },
  { phrase: "no cap", tags: ["community_slang"], score: 0.9, contexts: ["webReading", "chat"] },
  { phrase: "low key", tags: ["community_slang"], score: 0.84, contexts: ["webReading", "chat"] },
  { phrase: "low-key", tags: ["community_slang"], score: 0.84, contexts: ["webReading", "chat"] },
  { phrase: "high key", tags: ["community_slang"], score: 0.8, contexts: ["webReading", "chat"] },
  { phrase: "imo", tags: ["abbreviation", "community_slang"], score: 0.78, contexts: ["webReading", "chat"] },
  { phrase: "lol", tags: ["abbreviation", "community_slang"], score: 0.7, contexts: ["webReading", "chat"] },
  { phrase: "tbh", tags: ["abbreviation", "community_slang"], score: 0.78, contexts: ["webReading", "chat"] },
  { phrase: "ngl", tags: ["abbreviation", "community_slang"], score: 0.8, contexts: ["webReading", "chat"] },
  { phrase: "iykyk", tags: ["abbreviation", "community_slang"], score: 0.86, contexts: ["webReading"] },
  { phrase: "rizz", tags: ["community_slang", "neologism"], score: 0.88, contexts: ["webReading", "chat"] },
  { phrase: "nevertheless", tags: ["literary"], score: 0.72, contexts: ["ebook"] },
  { phrase: "thus", tags: ["literary"], score: 0.68, contexts: ["ebook"] },
  { phrase: "whereby", tags: ["literary"], score: 0.8, contexts: ["ebook"] },
  { phrase: "henceforth", tags: ["literary"], score: 0.82, contexts: ["ebook"] },
  { phrase: "inasmuch as", tags: ["literary"], score: 0.84, contexts: ["ebook"] },
  { phrase: "echar de menos", tags: ["idiom"], score: 0.86 },
  { phrase: "것 같", tags: ["hedge"], score: 0.7 },
];
