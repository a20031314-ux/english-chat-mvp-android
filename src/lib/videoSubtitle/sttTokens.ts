/** Keep letters/numbers of any script. Latin-only stripping dropped Japanese. */
export function normalizeSttToken(value: string): string {
  return value
    .toLowerCase()
    .replace(/^[^\p{L}\p{N}']+|[^\p{L}\p{N}']+$/gu, "");
}

export function countCjkLetters(text: string): number {
  return (text.match(/\p{Script=Han}|\p{Script=Hiragana}|\p{Script=Katakana}|\p{Script=Hangul}/gu) ?? [])
    .length;
}

export function countLetters(text: string): number {
  return (text.match(/\p{L}|\p{N}/gu) ?? []).length;
}

/** Real dialogue, including unspaced Japanese/Korean lines Whisper often emits. */
export function looksLikeSubstantialDialogue(text: string): boolean {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed) return false;
  const words = trimmed.split(/\s+/).filter(Boolean).length;
  return countCjkLetters(trimmed) >= 8 || words >= 5 || countLetters(trimmed) >= 20;
}

/** Lone digits / punctuation Whisper sometimes leftover after a bad split. */
export function isJunkCue(text: string): boolean {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed) return true;
  if (countLetters(trimmed) === 0) return true;
  if (/^[\d\s.,:\-/]+$/.test(trimmed) && countLetters(trimmed) <= 3) return true;
  return false;
}
