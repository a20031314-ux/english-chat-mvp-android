/**
 * 넣어 둔 표현·문법 고르기 문제(problems/*.json)를 Quizbank 문제로 바꾼다.
 * 뜻은 보기 앞에 나오고, 정답은 파일에 적힌 보기뿐이다. 순수.
 */
import { rng, shuffled, type QuizQuestion } from "./quiz.ts";

export type PreparedItem = {
  key: string;
  kind: "expression" | "grammar";
  stage: number;
  gloss: string;
  before: string;
  after: string;
  answer: string;
  options: string[];
  line: string;
  why: string;
  /** 같은 칸의 다른 문장(규칙으로 바꾼 사전 예문, problems/<언어>-gv.json) — 나올 때마다 차례로. 앱 언어로 뜻이 있을 때만. */
  variants?: readonly PreparedVariant[];
};

export type PreparedVariant = Pick<PreparedItem, "before" | "after" | "answer" | "options" | "line" | "gloss" | "why">;

/** 그 칸이 나온 횟수(turn)로 문장을 고른다 — 0이면 원래 문장, 그다음은 바꾼 문장 차례로(같은 문장이 연달아 안 나오게). 순수. */
export function turnPrepared(item: PreparedItem, turn: number): PreparedItem {
  const list = item.variants ?? [];
  if (!list.length) return item;
  const at = ((Math.floor(turn) % (list.length + 1)) + list.length + 1) % (list.length + 1);
  return at === 0 ? item : { ...item, ...list[at - 1]! };
}

/**
 * turnPrepared + 최근에 낸 문장(quiz.ts askedTexts — 첫 측정·퀴즈) 건너뛰기: turn부터 차례로 돌며 안 낸 문장을 고른다.
 * 다 냈으면 turn 그대로(2026-11-10 구성 고치기 — 첫 측정에서 틀린 칸이 몇 분 뒤 같은 문장·같은 보기로). 순수.
 */
export function turnFresh(item: PreparedItem, turn: number, asked: readonly string[]): PreparedItem {
  const n = (item.variants?.length ?? 0) + 1;
  for (let step = 0; step < n; step += 1) {
    const one = turnPrepared(item, turn + step);
    if (!asked.includes(one.line)) return one;
  }
  return turnPrepared(item, turn);
}

export function chooseFromPrepared(item: PreparedItem): QuizQuestion | null {
  const options = item.options.filter((option) => option.trim());
  const at = options.findIndex((option) => option === item.answer || option.toLocaleLowerCase() === item.answer.toLocaleLowerCase());
  if (at < 0 || options.length < 2 || !item.line.trim() || !item.gloss.trim() || !item.why.trim()) return null;
  const order = shuffled(options.map((_, index) => index), rng(`${item.key}|${item.line}`));
  const next = order.map((index) => options[index]!);
  return {
    kind: "choose",
    text: item.line,
    before: item.before,
    after: item.after,
    options: next,
    answer: order.indexOf(at),
    gloss: { en: "", raw: item.gloss },
    from: item.key,
    prepared: { why: item.why },
  };
}

/** 지금 단계의 문법, 그다음 표현. 앞 단계는 그 단계가 떨어졌을 때만. 더 높은 단계는 넣지 않는다. */
export function pickPrepared(
  items: readonly PreparedItem[],
  options: { stage: number; skip?: ReadonlySet<string>; grammar?: number; expression?: number; weight?: (key: string) => number },
): PreparedItem[] {
  const skip = options.skip ?? new Set<string>();
  // 언어 조합 비중(languagePairs.ts knownSlotWeight, 2026-11-08): 같은 단계 안에서 무거운 칸(모국어에 없는 개념)부터, 같으면 원래 차례.
  const heavier = (list: PreparedItem[]) => (options.weight ? list.map((item, i) => ({ item, i, w: options.weight!(item.key) })).sort((a, b) => b.w - a.w || a.i - b.i).map((one) => one.item) : list);
  const take = (kind: PreparedItem["kind"], n: number) => {
    const open = items.filter((item) => item.kind === kind && item.stage <= options.stage && !skip.has(item.key));
    const here = heavier(open.filter((item) => item.stage === options.stage));
    // 지금 단계를 다 풀면 바로 아래 단계부터(예전엔 1단계부터 — 2026-11-09 측정: es 5단계가 5단계 일곱 칸 뒤 g|1:0·1:1·1:5).
    const earlier = heavier(open.filter((item) => item.stage < options.stage)).sort((a, b) => b.stage - a.stage);
    return [...here, ...earlier].slice(0, n);
  };
  return [...take("grammar", options.grammar ?? 1), ...take("expression", options.expression ?? 1)];
}
