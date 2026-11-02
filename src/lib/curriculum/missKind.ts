/**
 * 틀린 꼴 가르기(모델 없음, 2026-11-02 Logbank 육각형 활용 세부 칸 — hub/drafts/fill-gauge-2026-11-02.md 10절).
 * 퀴즈 화면(고른 오답)·채움 계산(curriculum/fill.ts)이 같이 쓴다. 순수 모듈.
 */
/** 틀린 꼴(어휘: 철자·꼴·다른 낱말 / 문장: 꼴·기능어·어순·빠짐). */
export const MISS_KINDS = ["spell", "form", "word", "particle", "order", "missing"] as const;
export type MissKind = (typeof MISS_KINDS)[number];

/**
 * 쓴 답·고른 오답과 정답의 차이로 틀린 꼴을 가른다. tokens = 낱말로 자른 것(wordSegments — 부르는 쪽이 자름, ja·zh·th 포함).
 * 같은 낱말이 순서만 다름 = 어순 · 정답 낱말이 빠짐 = 빠짐 · 기능어만 바뀜 = 기능어 · 앞이 같고 끝이 다름 = 꼴 · 한두 글자 = 철자 · 그 밖 = 다른 낱말.
 */
export function missKindOf(given: readonly string[], right: readonly string[], functionWords: ReadonlySet<string> = new Set()): MissKind {
  const norm = (list: readonly string[]) => list.map((one) => one.toLocaleLowerCase()).filter((one) => /[\p{L}\p{N}]/u.test(one));
  const a = norm(given);
  const b = norm(right);
  if (a.length === b.length && a.length > 1 && [...a].sort().join("\u0000") === [...b].sort().join("\u0000") && a.join() !== b.join()) return "order";
  const extra = a.filter((one) => !b.includes(one));
  const lacking = b.filter((one) => !a.includes(one));
  if (lacking.length && !extra.length) return "missing";
  if (extra.length && lacking.length && [...extra, ...lacking].every((one) => functionWords.has(one))) return "particle";
  if (extra.length === 1 && lacking.length === 1) return wordMiss(extra[0]!, lacking[0]!);
  return "word";
}

/** 낱말 하나끼리: 줄기(앞 글자들)가 같고 끝만 다름 = 꼴(활용·성수), 안쪽 한두 글자 = 철자, 그 밖 = 다른 낱말. */
function wordMiss(given: string, right: string): MissKind {
  const shorter = Math.min([...given].length, [...right].length);
  const prefix = sharedPrefix(given, right);
  if (shorter >= 3 && prefix >= Math.max(2, shorter - 3) && prefix < Math.max([...given].length, [...right].length)) return "form";
  if (editDistance(given, right) <= (shorter <= 4 ? 1 : 2)) return "spell";
  return "word";
}

function sharedPrefix(a: string, b: string): number {
  const x = [...a];
  const y = [...b];
  let i = 0;
  while (i < x.length && i < y.length && x[i] === y[i]) i += 1;
  return i;
}

function editDistance(a: string, b: string): number {
  const x = [...a];
  const y = [...b];
  const row = Array.from({ length: y.length + 1 }, (_, i) => i);
  for (let i = 1; i <= x.length; i += 1) {
    let prev = row[0]!;
    row[0] = i;
    for (let j = 1; j <= y.length; j += 1) {
      const here = row[j]!;
      row[j] = Math.min(row[j]! + 1, row[j - 1]! + 1, prev + (x[i - 1] === y[j - 1] ? 0 : 1));
      prev = here;
    }
  }
  return row[y.length]!;
}

/**
 * 퀴즈 한 문제의 모양(알아봄 c · 만들어 냄 t)과, 고른 오답이 있으면 틀린 꼴 — quizDays에 남겨 Logbank 육각형이 이해/활용을 가른다.
 * 고르기·대화 응답·순서·보기 있는 고치기 = c, 빈칸 쓰기·틀린 곳 고치기·말하기·복합 빈칸·대화에서 틀린 줄 = t.
 */
export function quizShapeOf(
  question: { kind: string; options?: readonly unknown[]; answer?: number | string },
  answer: { correct: boolean; picked?: string },
  segment: (text: string) => string[],
): { shape: "c" | "t"; miss?: MissKind } {
  const choose = question.kind === "choose" || question.kind === "meaning" || question.kind === "reply" || question.kind === "order" || (question.kind === "fix" && Boolean(question.options?.length));
  const shape = choose ? "c" : "t";
  if (answer.correct || !answer.picked || !question.options?.length || typeof question.answer !== "number") return { shape };
  const right = question.options[question.answer];
  return typeof right === "string" && right ? { shape, miss: missKindOf(segment(answer.picked), segment(right)) } : { shape };
}
