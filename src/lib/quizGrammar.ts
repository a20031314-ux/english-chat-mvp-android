const FUNCTION_WORDS = new Set([
  "a",
  "an",
  "the",
  "to",
  "for",
  "of",
  "in",
  "on",
  "at",
  "by",
  "with",
  "from",
  "into",
  "onto",
  "upon",
  "about",
  "over",
  "under",
  "between",
  "among",
  "through",
  "during",
  "before",
  "after",
  "without",
  "within",
  "that",
  "which",
  "who",
  "whom",
  "whose",
  "what",
  "if",
  "whether",
  "than",
  "as",
  "so",
  "not",
  "no",
  "nor",
  "and",
  "or",
  "but",
  "because",
  "although",
  "though",
  "since",
  "until",
  "unless",
  "while",
  "when",
  "where",
  "how",
  "been",
  "being",
  "is",
  "are",
  "was",
  "were",
  "be",
  "am",
  "do",
  "does",
  "did",
  "have",
  "has",
  "had",
  "will",
  "would",
  "can",
  "could",
  "should",
  "must",
  "may",
  "might",
  "shall",
  "need",
  "much",
  "many",
  "few",
  "little",
  "some",
  "any",
  "each",
  "every",
  "another",
  "other",
  "more",
  "most",
  "less",
  "least",
  "enough",
  "such",
  "this",
  "these",
  "those",
]);

const IRREGULAR_LEMMAS = [
  ["go", "goes", "going", "went", "gone"],
  ["be", "am", "is", "are", "was", "were", "been", "being"],
  ["have", "has", "had", "having"],
  ["do", "does", "did", "done", "doing"],
  ["say", "says", "said"],
  ["make", "makes", "made"],
  ["take", "takes", "took", "taken"],
  ["come", "comes", "came"],
  ["see", "sees", "saw", "seen"],
  ["get", "gets", "got", "gotten"],
  ["know", "knows", "knew", "known"],
  ["think", "thinks", "thought"],
  ["give", "gives", "gave", "given"],
  ["find", "finds", "found"],
  ["tell", "tells", "told"],
  ["become", "becomes", "became"],
  ["leave", "leaves", "left"],
  ["feel", "feels", "felt"],
  ["bring", "brings", "brought"],
  ["begin", "begins", "began", "begun"],
  ["keep", "keeps", "kept"],
  ["hold", "holds", "held"],
  ["write", "writes", "wrote", "written"],
  ["stand", "stands", "stood"],
  ["hear", "hears", "heard"],
  ["let", "lets"],
  ["mean", "means", "meant"],
  ["set", "sets"],
  ["meet", "meets", "met"],
  ["run", "runs", "ran"],
  ["pay", "pays", "paid"],
  ["sit", "sits", "sat"],
  ["speak", "speaks", "spoke", "spoken"],
  ["lie", "lies", "lay", "lain"],
  ["lead", "leads", "led"],
  ["read", "reads"],
  ["grow", "grows", "grew", "grown"],
  ["lose", "loses", "lost"],
  ["fall", "falls", "fell", "fallen"],
  ["send", "sends", "sent"],
  ["build", "builds", "built"],
  ["understand", "understands", "understood"],
  ["draw", "draws", "drew", "drawn"],
  ["break", "breaks", "broke", "broken"],
  ["spend", "spends", "spent"],
  ["cut", "cuts"],
  ["rise", "rises", "rose", "risen"],
  ["drive", "drives", "drove", "driven"],
  ["buy", "buys", "bought"],
  ["wear", "wears", "wore", "worn"],
  ["choose", "chooses", "chose", "chosen"],
  ["suggest", "suggests", "suggested", "suggesting"],
];

function words(value: string): string[] {
  return value.toLowerCase().match(/[a-z']+/g) ?? [];
}

function stem(value: string): string {
  return value.replace(/(ing|ed|es|s|er|est|ly)$/i, "");
}

export function isFunctionWord(word: string): boolean {
  return FUNCTION_WORDS.has(word.toLowerCase());
}

export function likelySameLemma(a: string, b: string): boolean {
  const x = a.toLowerCase();
  const y = b.toLowerCase();
  if (x === y) return true;
  const sx = stem(x);
  const sy = stem(y);
  if (sx && sx === sy && sx.length >= 3) return true;
  return IRREGULAR_LEMMAS.some((group) => group.includes(x) && group.includes(y));
}

function sameBag(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const left = [...a].sort();
  const right = [...b].sort();
  return left.every((word, i) => word === right[i]);
}

export function isLexicalSubstitution(
  original?: string,
  corrected?: string,
): boolean {
  if (!original || !corrected) return false;
  const o = words(original);
  const c = words(corrected);
  if (o.length === 0 || c.length === 0 || o.length !== c.length) return false;
  const diffs: Array<[string, string]> = [];
  for (let i = 0; i < o.length; i += 1) {
    if (o[i] !== c[i]) diffs.push([o[i] ?? "", c[i] ?? ""]);
  }
  if (diffs.length === 0) return false;
  return diffs.every(
    ([from, to]) =>
      !isFunctionWord(from) &&
      !isFunctionWord(to) &&
      !likelySameLemma(from, to),
  );
}

export function looksLikeGrammarChange(
  original?: string,
  corrected?: string,
  explanation?: string,
): boolean {
  if (!original || !corrected) return false;
  if (isLexicalSubstitution(original, corrected)) return false;

  const blob = `${original} ${corrected} ${explanation || ""}`.toLowerCase();
  if (
    /\b(tense|grammar|article|preposition|word order|subject.?verb|plural|singular|agreement|clause|conditional|문법|시제|전치사|관사|어순|주어|동사)\b/.test(
      blob,
    )
  ) {
    return true;
  }

  const o = words(original);
  const c = words(corrected);
  if (sameBag(o, c) && o.join(" ") !== c.join(" ")) return true;

  const contentO = o.filter((w) => !isFunctionWord(w)).map(stem);
  const contentC = c.filter((w) => !isFunctionWord(w)).map(stem);
  if (
    contentO.length > 0 &&
    sameBag(contentO, contentC) &&
    original.replace(/\s+/g, " ").trim().toLowerCase() !==
      corrected.replace(/\s+/g, " ").trim().toLowerCase()
  ) {
    return true;
  }

  return false;
}

export function isGrammarQuizSource(input: {
  category?: string;
  originalSentence?: string;
  correctedSentence?: string;
  explanation?: string;
}): boolean {
  if (isLexicalSubstitution(input.originalSentence, input.correctedSentence)) {
    return false;
  }
  if (input.category === "grammar") return true;
  return looksLikeGrammarChange(
    input.originalSentence,
    input.correctedSentence,
    input.explanation,
  );
}

/** True when choices test word meaning, not grammar. */
export function isVocabularyStyleQuestion(
  prompt: string,
  choices: string[],
  type?: string,
): boolean {
  if (type === "vocabulary") return true;
  if (/\b(mean|meaning|synonym|opposite|뜻|의미|번역)\b/i.test(prompt)) {
    return true;
  }

  const tokenized = choices.map((choice) => words(choice));
  if (tokenized.some((tokens) => tokens.length === 0)) return false;

  const allSingleContentWords = tokenized.every(
    (tokens) => tokens.length === 1 && !isFunctionWord(tokens[0] ?? ""),
  );
  if (allSingleContentWords) {
    const lemmas = tokenized.map((tokens) => tokens[0] ?? "");
    const sameFamily = lemmas.every(
      (word, index) => index === 0 || likelySameLemma(lemmas[0] ?? "", word),
    );
    if (!sameFamily) return true;
  }

  return false;
}

export function sessionHasVocabularyQuiz(questions: Array<{
  type?: string;
  prompt: string;
  choices: string[];
}>): boolean {
  return questions.some((question) =>
    isVocabularyStyleQuestion(question.prompt, question.choices, question.type),
  );
}
