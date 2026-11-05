/**
 * 넣어 둔 표현·문법 고르기 문제(problems/*.json)를 Quizbank 문제로 바꾼다.
 * 뜻은 보기 앞에 나오고, 정답은 파일에 적힌 보기뿐이다. 순수.
 */
import { rng, shuffled, type QuizQuestion } from "./quiz.ts";

export type PreparedItem = {
  key: string;
  kind: "expression" | "grammar" | "word";
  stage: number;
  gloss: string;
  before: string;
  after: string;
  answer: string;
  options: string[];
  line: string;
  why: string;
  hint?: string;
  mark?: string;
};

export function chooseFromPrepared(item: PreparedItem): QuizQuestion | null {
  if (item.kind === "word") return null;
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

/** 넣어 둔 단어 문제: 뜻을 보고 그 단어를 쓴다. 문장은 답한 뒤에 보여주는 예문이다. */
export function typeFromPrepared(item: PreparedItem): QuizQuestion | null {
  if (item.kind !== "word" || !item.gloss.trim() || !item.answer.trim() || !item.line.trim()) return null;
  if (item.hint && item.hint.toLocaleLowerCase() === item.answer.toLocaleLowerCase()) return null;
  return {
    kind: "type",
    text: item.line,
    before: "",
    after: "",
    answer: item.answer,
    gloss: { en: "", raw: item.gloss },
    from: item.key,
    ...(item.hint || item.mark ? { prepared: { ...(item.hint ? { hint: item.hint } : {}), ...(item.mark ? { mark: item.mark } : {}) } } : { prepared: {} }),
  };
}

/** 지금 단계의 문법, 그다음 표현. 앞 단계는 그 단계가 떨어졌을 때만. 더 높은 단계는 넣지 않는다. */
export function pickPrepared(
  items: readonly PreparedItem[],
  options: { stage: number; skip?: ReadonlySet<string>; grammar?: number; expression?: number },
): PreparedItem[] {
  const skip = options.skip ?? new Set<string>();
  const take = (kind: PreparedItem["kind"], n: number) => {
    const open = items.filter((item) => item.kind === kind && item.stage <= options.stage && !skip.has(item.key));
    const here = open.filter((item) => item.stage === options.stage);
    const earlier = open.filter((item) => item.stage < options.stage);
    return [...here, ...earlier].slice(0, n);
  };
  return [...take("grammar", options.grammar ?? 1), ...take("expression", options.expression ?? 1)];
}
