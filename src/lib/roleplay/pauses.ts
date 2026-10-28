/**
 * 낱말 사이 멈칫한 곳(2026-10-29 사용자 "사용자의 발화를 끊어서 망설인 부분, 맞는 부분과 어긋난 부분을 디테일하게").
 *
 * 받아쓰기(Scribe)가 낱말마다 시작·끝 시각을 주면, 앞 낱말 끝과 다음 낱말 시작 사이가 PAUSE_GAP_S 넘는 곳을 [그 뒤 낱말, 초]로.
 * "음·어·uh·えーと" 같은 군말이 낱말로 적혔으면 그것도 멈칫으로 보고 그다음 낱말에 붙인다. 순수 모듈(서버 listen·화면·테스트).
 */
export const PAUSE_GAP_S = 0.7;

const FILLERS = new Set([
  "uh", "um", "umm", "uhm", "er", "erm", "hmm", "mm", "ah", "eh",
  "음", "어", "으", "아", "그", "저", "음…", "어…",
  "えー", "えーと", "えっと", "あの", "あのー", "うーん", "ええと",
  "嗯", "呃", "那个", "额",
  "este", "eh", "pues", "bueno", "euh", "ben", "ehm", "tipo", "né", "ну", "э", "эм", "ehm",
  "ອື", "เอ่อ", "อืม", "ừ", "ờ", "à", "uhh", "hmm…",
]);

const bare = (word: string) => word.toLocaleLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");

export function isFiller(word: string): boolean {
  const b = bare(word).replace(/[ー〜~]+$/u, "ー");
  return FILLERS.has(b) || FILLERS.has(bare(word)) || /^(u+h+m*|u+m+|e+r+m*|h+m+|m{2,})$/u.test(b);
}

export function pausesOf(words: readonly { text: string; start: number; end: number }[]): [string, number][] {
  const out: [string, number][] = [];
  let lastEnd: number | null = null;
  let carried = 0;
  let filler = false;
  for (const word of words) {
    const text = word.text.trim();
    if (!text || !/[\p{L}\p{N}]/u.test(text)) continue;
    const gap = lastEnd === null ? 0 : Math.max(0, word.start - lastEnd);
    if (isFiller(text)) {
      // 군말 자체도 멈칫 — 그 앞 쉼과 군말 길이를 다음 낱말로 넘긴다.
      carried += gap + Math.max(0.3, word.end - word.start);
      filler = true;
      lastEnd = word.end;
      continue;
    }
    const total = gap + carried;
    // 군말이 있었으면 짧아도 멈칫, 없으면 PAUSE_GAP_S 넘는 쉼만.
    if (lastEnd !== null && (filler || total >= PAUSE_GAP_S)) out.push([text, Math.round(total * 10) / 10]);
    carried = 0;
    filler = false;
    lastEnd = word.end;
  }
  return out.slice(0, 6);
}
