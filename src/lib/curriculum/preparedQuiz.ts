/**
 * 넣어 둔 표현·문법 고르기 문제(problems/*.json)를 Quizbank 문제로 바꾼다.
 * 뜻은 보기 앞에 나오고, 정답은 파일에 적힌 보기뿐이다. 순수.
 */
import { rng, shuffled, type QuizQuestion } from "./quiz.ts";
import type { ChoiceVariant } from "./ladderQuiz.ts";

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
  /** 해석 없이는 다른 보기도 맞는 문장(시제·주어·조동사·말투 — problems/needs-meaning.json). 3단계부터도 해석을 먼저 보인다. */
  needsMeaning?: true;
};

export type PreparedVariant = Pick<PreparedItem, "before" | "after" | "answer" | "options" | "line" | "gloss" | "why" | "needsMeaning">;

/**
 * 해석을 문제 앞에 보일까(사용자 2026-11-12 "1+2로" — 어휘가 아닌 문법·틀린 곳 문제):
 * 1~2단계 학습자는 늘(문장 자체를 못 읽음), 3단계부터는 해석 없이는 답이 갈리는 문장만. 나머지는 답한 뒤에. 고르기·틀린 곳만 — 빈칸 쓰기는 늘 해석 먼저(사용자 2026-11-28, QuizPlayer TypeView).
 */
export function meaningFirst(stage: number, item?: { needsMeaning?: true }): boolean {
  return stage <= 2 || Boolean(item?.needsMeaning);
}

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

export function chooseFromPrepared(item: PreparedItem, first = true): QuizQuestion | null {
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
    prepared: { why: item.why, ...(first ? {} : { meaningLater: true as const }) },
  };
}

/** 지금 단계의 문법, 그다음 표현. 앞 단계는 그 단계가 떨어졌을 때만. 더 높은 단계는 넣지 않는다. */
export function pickPrepared(
  items: readonly PreparedItem[],
  options: { stage: number; skip?: ReadonlySet<string>; grammar?: number; expression?: number; weight?: (key: string) => number; lastAt?: (key: string) => number },
): PreparedItem[] {
  const skip = options.skip ?? new Set<string>();
  // 마지막으로 낸 때가 오래된 칸부터(안 낸 칸 = 0이 맨 앞) — 차례가 고정이라 날마다 첫 묶음이 be동사였음(사용자 2026-11-24 "문법 요소가 여러 개인데 왜 be동사만").
  // 같으면 언어 조합 비중(languagePairs.ts knownSlotWeight, 2026-11-08: 모국어에 없는 개념부터), 그다음 원래 차례.
  const heavier = (list: PreparedItem[]) =>
    list
      .map((item, i) => ({ item, i, at: options.lastAt?.(item.key) ?? 0, w: options.weight?.(item.key) ?? 1 }))
      .sort((a, b) => a.at - b.at || b.w - a.w || a.i - b.i)
      .map((one) => one.item);
  const take = (kind: PreparedItem["kind"], n: number) => {
    const open = items.filter((item) => item.kind === kind && item.stage <= options.stage && !skip.has(item.key));
    const here = heavier(open.filter((item) => item.stage === options.stage));
    // 지금 단계를 다 풀면 바로 아래 단계부터(예전엔 1단계부터 — 2026-11-09 측정: es 5단계가 5단계 일곱 칸 뒤 g|1:0·1:1·1:5).
    const earlier = heavier(open.filter((item) => item.stage < options.stage)).sort((a, b) => b.stage - a.stage);
    return [...here, ...earlier].slice(0, n);
  };
  return [...take("grammar", options.grammar ?? 1), ...take("expression", options.expression ?? 1)];
}

/** 문제은행이 만든 문법 칸 문장 하나(curriculum/qbank.ts GrownItem 중 쓰는 칸만). */
export type GrownGrammar = { text: string; piece: string; wrong?: readonly string[]; why?: string; gloss: { en: string; ko?: string }; ui?: { code: string; gloss?: string; why?: string }; v?: "c" | "m" | "x"; lead?: string };

/**
 * 문제은행 문장 → 같은 칸의 다른 문장(PreparedVariant, 2026-11-24 회차 묶음): 앱 언어 뜻·까닭이 있을 때만(영어 앱은 원문).
 * 빈칸 조각이 문장에 그대로 있고 꼴 오답이 둘 이상인 것만. 순수.
 */
export function grownVariants(grown: readonly GrownGrammar[], ui: string): PreparedVariant[] {
  const out: PreparedVariant[] = [];
  for (const one of grown) {
    if (one.v) continue;
    const at = one.text.indexOf(one.piece);
    const wrong = (one.wrong ?? []).filter((w) => w && w !== one.piece);
    if (at < 0 || !one.piece || wrong.length < 2 || !one.why) continue;
    const gloss = ui === "en" ? one.gloss.en : one.ui?.code === ui ? one.ui.gloss : ui === "ko" ? one.gloss.ko : undefined;
    const why = ui === "en" ? one.why : one.ui?.code === ui ? one.ui.why : undefined;
    if (!gloss || !why) continue;
    out.push({ before: one.text.slice(0, at), after: one.text.slice(at + one.piece.length), answer: one.piece, options: [one.piece, ...wrong.slice(0, 3)], line: one.text, gloss, why });
  }
  return out;
}

/** 넣어 둔 칸 + 문제은행 문장(같은 문장은 한 번). 순수. */
export function withGrown(item: PreparedItem, extra: readonly PreparedVariant[]): PreparedItem {
  if (!extra.length) return item;
  const have = new Set([item.line, ...(item.variants ?? []).map((one) => one.line)]);
  const more = extra.filter((one) => !have.has(one.line));
  return more.length ? { ...item, variants: [...(item.variants ?? []), ...more] } : item;
}

/** 문제은행이 만든 고르기의 다른 모양(문맥·대답 고르기·틀린 문장) → ladderQuiz.ts ChoiceVariant. 앱 언어 뜻·까닭이 있을 때만. 순수. */
export function grownChoices(grown: readonly GrownGrammar[], ui: string): ChoiceVariant[] {
  const out: ChoiceVariant[] = [];
  for (const one of grown) {
    if (!one.v || !one.why) continue;
    const gloss = ui === "en" ? one.gloss.en : one.ui?.code === ui ? one.ui.gloss : ui === "ko" ? one.gloss.ko : undefined;
    const why = ui === "en" ? one.why : one.ui?.code === ui ? one.ui.why : undefined;
    if (!gloss || !why) continue;
    const wrong = (one.wrong ?? []).filter(Boolean);
    if (one.v === "c") {
      const at = one.text.indexOf(one.piece);
      if (!one.lead || at < 0 || !one.piece || wrong.length < 2) continue;
      out.push({ v: "c", lead: one.lead, line: one.text, before: one.text.slice(0, at), after: one.text.slice(at + one.piece.length), answer: one.piece, options: [one.piece, ...wrong.slice(0, 3)], gloss, why });
    } else if (one.v === "m") {
      // 상대 줄(lead)이 있어야 — 그 전에 만든 상황 한 줄 모양은 안 냄.
      if (!wrong[0] || !one.lead) continue;
      out.push({ v: "m", them: one.lead, themGloss: gloss, right: one.text, wrong: wrong[0], why });
    } else {
      // 맞는 문장이 틀린 문장을 고친 것뿐이면 나란히 놓여 답이 샌다(서버도 거르지만 그 전에 만든 것까지).
      const rights = wrong.filter((line) => !nearLine(line, one.text));
      const fixed = one.piece && one.piece !== one.text ? one.piece : "";
      if (rights.length >= 3) out.push({ v: "x", wrong: one.text, rights: rights.slice(0, 3), why, ...(fixed ? { fixed } : {}) });
    }
  }
  return out;
}

/** 두 문장이 몇 글자만 다른가(앞뒤 같은 글자를 걷고 남은 차이 넷 이하, 문장부호·띄어쓰기 무시 — 띄어쓰기 없는 말도). 순수. */
export function nearLine(a: string, b: string): boolean {
  const bare = (text: string) => text.toLocaleLowerCase().replace(/[\p{P}\s]/gu, "");
  const x = bare(a);
  const y = bare(b);
  let head = 0;
  while (head < x.length && head < y.length && x[head] === y[head]) head += 1;
  let tail = 0;
  while (tail < x.length - head && tail < y.length - head && x[x.length - 1 - tail] === y[y.length - 1 - tail]) tail += 1;
  return Math.max(x.length, y.length) - head - tail <= 4;
}
