export function fillQuizBlank(prompt: string, answer: string): string {
  if (!/_{2,}/.test(prompt)) {
    return prompt.replace(/\s+/g, " ").trim();
  }
  return prompt
    .replace(/_{2,}/, answer.trim())
    .replace(/\s+/g, " ")
    .replace(/\s+([?.!,])/g, "$1")
    .trim();
}

function tokens(value: string): string[] {
  return value.toLowerCase().match(/[a-z0-9']+/g) ?? [];
}

function splitBlank(prompt: string): {
  before: string;
  blank: string;
  after: string;
} | null {
  const match = prompt.match(/_{2,}/);
  if (!match || match.index === undefined) return null;
  return {
    before: prompt.slice(0, match.index),
    blank: match[0],
    after: prompt.slice(match.index + match[0].length),
  };
}

function overlapLength(left: string[], right: string[]): number {
  const max = Math.min(left.length, right.length);
  for (let n = max; n >= 1; n -= 1) {
    if (left.slice(-n).join(" ") === right.slice(0, n).join(" ")) return n;
  }
  return 0;
}

function joinBlank(before: string, blank: string, after: string): string {
  return `${before.trimEnd()} ${blank} ${after.trimStart()}`
    .replace(/\s+/g, " ")
    .replace(/\s+([?.!,])/g, "$1")
    .trim();
}

function stripLeadingWords(text: string, count: number): string {
  let remaining = count;
  return text
    .replace(/[A-Za-z0-9']+/g, (word) => {
      if (remaining > 0) {
        remaining -= 1;
        return "";
      }
      return word;
    })
    .replace(/^\s+/, "")
    .replace(/\s+/g, " ");
}

function stripTrailingWords(text: string, count: number): string {
  const found = text.match(/[A-Za-z0-9']+/g) ?? [];
  if (found.length <= count) return "";
  let remaining = found.length - count;
  return text
    .replace(/[A-Za-z0-9']+/g, (word) => {
      if (remaining > 0) {
        remaining -= 1;
        return word;
      }
      return "";
    })
    .replace(/\s+$/, "")
    .replace(/\s+/g, " ");
}

export function hasJoinOverlap(prompt: string, answer: string): boolean {
  const parts = splitBlank(prompt);
  if (!parts) return false;
  const before = tokens(parts.before);
  const after = tokens(parts.after);
  const ans = tokens(answer);
  return overlapLength(before, ans) > 0 || overlapLength(ans, after) > 0;
}

export function isWellFormedBlankFill(prompt: string, answer: string): boolean {
  if (!answer.trim()) return false;
  if (!/_{2,}/.test(prompt)) return true;
  return !hasJoinOverlap(prompt, answer);
}

export function repairQuizBlank(
  prompt: string,
  choices: string[],
  correctIndex: number,
): { prompt: string; choices: string[] } | null {
  const correct = choices[correctIndex];
  if (!correct?.trim()) return null;
  if (!/_{2,}/.test(prompt)) return { prompt, choices };
  if (isWellFormedBlankFill(prompt, correct)) return { prompt, choices };

  const parts = splitBlank(prompt);
  if (!parts) return null;

  const afterOverlap = overlapLength(tokens(correct), tokens(parts.after));
  if (afterOverlap > 0) {
    const nextPrompt = joinBlank(
      parts.before,
      parts.blank,
      stripLeadingWords(parts.after, afterOverlap),
    );
    if (isWellFormedBlankFill(nextPrompt, correct)) {
      return { prompt: nextPrompt, choices };
    }
  }

  const beforeOverlap = overlapLength(tokens(parts.before), tokens(correct));
  if (beforeOverlap > 0) {
    const nextPrompt = joinBlank(
      stripTrailingWords(parts.before, beforeOverlap),
      parts.blank,
      parts.after,
    );
    if (isWellFormedBlankFill(nextPrompt, correct)) {
      return { prompt: nextPrompt, choices };
    }
  }

  if (afterOverlap > 0) {
    const trimmed = stripTrailingWords(correct, afterOverlap).trim();
    if (trimmed && isWellFormedBlankFill(prompt, trimmed)) {
      const nextChoices = choices.slice();
      nextChoices[correctIndex] = trimmed;
      const unique = new Set(nextChoices.map((c) => c.toLowerCase()));
      if (unique.size === nextChoices.length) {
        return { prompt, choices: nextChoices };
      }
    }
  }

  return null;
}

export function ensureWellFormedQuizQuestion<
  T extends { prompt: string; choices: string[]; correctIndex: number },
>(question: T): T {
  const repaired = repairQuizBlank(
    question.prompt,
    question.choices,
    question.correctIndex,
  );
  if (!repaired) return question;
  return { ...question, prompt: repaired.prompt, choices: repaired.choices };
}
