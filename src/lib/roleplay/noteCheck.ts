/**
 * 줄 아래 설명이 그 줄에 대한 것인지(통화 팁 — director.ts, 가상 사용자 점검 — scripts/sim-users/detect.mjs가 같이 씀).
 * 순수, 다른 것을 가져오지 않는다(점검 스크립트가 바로 읽음).
 */
/**
 * Whether a note quotes the character's own line rather than the learner's words:
 * a run of three words or more that is in what the character says and not in
 * what they said. Words are compared lowercased, letters and digits only, so the
 * check works for any script that separates words with spaces; for the ones that
 * do not (ja/zh/th) a run of eight characters stands in for three words.
 */
export function quotesOwnLine(note: string, spoken: readonly string[], heard: string): boolean {
  const words = (value: string) => value.toLowerCase().match(/[\p{L}\p{M}\p{N}']+/gu) ?? [];
  const runs = (value: string): Set<string> => {
    const list = words(value);
    const out = new Set<string>();
    for (let i = 0; i + 3 <= list.length; i++) out.add(list.slice(i, i + 3).join(" "));
    // Scripts without spaces: one "word" can be a whole clause, so use character runs.
    for (const word of list) if (word.length >= 8) for (let i = 0; i + 8 <= word.length; i++) out.add(word.slice(i, i + 8));
    return out;
  };
  const theirs = runs(heard);
  const inNote = runs(note);
  return spoken.some((line) => [...runs(line)].some((run) => inNote.has(run) && !theirs.has(run)));
}

