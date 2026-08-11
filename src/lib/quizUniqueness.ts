import { fillQuizBlank, isWellFormedBlankFill } from "@/lib/quizBlank";

const PREPOSITIONS = new Set([
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
  "about",
  "over",
  "under",
]);

const BARE_PRESENT_VERBS = new Set([
  "suggest",
  "recommend",
  "want",
  "need",
  "go",
  "come",
  "make",
  "take",
  "look",
  "seem",
  "try",
  "ask",
  "tell",
  "say",
  "become",
  "wait",
  "listen",
]);

export function isSinglePreposition(choice: string): boolean {
  const tokens = choice.toLowerCase().trim().split(/\s+/);
  return tokens.length === 1 && PREPOSITIONS.has(tokens[0] ?? "");
}

export const TARGET_QUIZ_SIZE = 5;
export const QUIZ_CANDIDATE_POOL = 8;

export function promptSentenceCount(prompt: string): number {
  return prompt
    .split(/[\n.!?]+/)
    .map((line) => line.replace(/_{2,}/g, " ").trim())
    .filter((line) => line.length > 2).length;
}

/** Frames where several prepositions are all natural with different meanings. */
export function isOpenPrepositionFrame(prompt: string): boolean {
  const compact = prompt.replace(/\s+/g, " ");
  return (
    /\bdo(es|ing)? _{2,} (my |your |his |her |our |the )?(future|life|it|this|that)\b/i.test(
      compact,
    ) ||
    /\b(think|talk|speak|deal)(s|ing|ed)? _{2,}/i.test(compact)
  );
}

export function hasSubjectVerbClash(prompt: string, choice: string): boolean {
  const before = prompt.split(/_{2,}/)[0] ?? "";
  const first = (choice.toLowerCase().match(/[a-z']+/g) ?? [])[0] ?? "";
  if (!first || !BARE_PRESENT_VERBS.has(first)) return false;
  if (/\b(i|you|we|they)\b/i.test(before)) return false;
  if (/\b(he|she|it|this|that|everyone|somebody|nobody)\b/i.test(before)) {
    return true;
  }
  return /\bthe [a-z]+\b/i.test(before) && !/\bthe [a-z]+s\b/i.test(before);
}

export function isAmbiguousPrepositionItem(
  prompt: string,
  choices: string[],
): boolean {
  const prepCount = choices.filter(isSinglePreposition).length;
  if (prepCount < 2) return false;
  if (!isOpenPrepositionFrame(prompt)) return false;
  return promptSentenceCount(prompt) < 2;
}

export function choiceLooksViable(prompt: string, choice: string): boolean {
  if (!choice.trim()) return false;
  if (!isWellFormedBlankFill(prompt, choice)) return false;
  if (hasSubjectVerbClash(prompt, choice)) return false;
  return true;
}

export function hasUniqueLocalAnswer(
  prompt: string,
  choices: string[],
  correctIndex: number,
): boolean {
  const correct = choices[correctIndex];
  if (!correct || !choiceLooksViable(prompt, correct)) return false;
  if (isAmbiguousPrepositionItem(prompt, choices)) return false;

  return true;
}

export function keepUniqueQuestions<
  T extends { prompt: string; choices: string[]; correctIndex: number },
>(questions: T[]): T[] {
  return questions.filter((question) =>
    hasUniqueLocalAnswer(
      question.prompt,
      question.choices,
      question.correctIndex,
    ),
  );
}

export function filledChoices(
  prompt: string,
  choices: string[],
): Array<{ choice: string; filled: string; viable: boolean }> {
  return choices.map((choice) => ({
    choice,
    filled: fillQuizBlank(prompt, choice),
    viable: choiceLooksViable(prompt, choice),
  }));
}

export function sessionHasAmbiguousQuiz(
  questions: Array<{
    prompt: string;
    choices: string[];
    correctIndex: number;
  }>,
): boolean {
  return questions.some(
    (question) =>
      !hasUniqueLocalAnswer(
        question.prompt,
        question.choices,
        question.correctIndex,
      ),
  );
}
