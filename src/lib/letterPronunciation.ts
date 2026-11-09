/** Single letter that should show instant pronunciation (not vocab sheet). */
export function isPronounceableAlphabetLetter(text: string): boolean {
  if (!text || Array.from(text).length !== 1) return false;
  return /^[\u0400-\u04FF]$/u.test(text);
}
