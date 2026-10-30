/**
 * 약한 곳 퀴즈(2026-10-28 사용자 "어려워하거나 틀린 부분을 퀴즈로" → "퀴즈부터 만들어줘", `hub/drafts/today-weak-practice-2026-10-28.md`).
 *
 * 다시 볼 열쇠 하나(e|표현 · f|문장구조 · g|단계:문법)와, 있으면 튜터가 고친 내 줄(노트 카드)로 짧은 문제 셋을 기기에서 만든다 — 모델을 부르지 않는다.
 * 재료는 이미 앱에 든 것뿐: 문장구조 예문, 대본 내 줄(문장구조 태그·핵심 표현·문법 태그), 고친 줄.
 *
 * 문제 종류:
 * - fix    내가 틀린 줄에서 틀린 낱말 누르기(고친 줄과 낱말 차이). 차이가 빠진 말뿐이면 두 문장 중 맞는 것 고르기.
 * - choose 문장에서 그 표현·문장구조 조각을 비우고 셋 중 고르기(오답 = 같은 갈래 다른 열쇠의 조각, 그 문장에 없는 것).
 * - order  낱말 조각을 섞어 순서 맞추기(띄어쓰기 없는 언어는 wordSegments로 자름).
 * - say    뜻만 보고 말하기(🎤, 대본과 같은 판정) — 늘 마지막.
 * 맞음 = 셋 중 둘 이상. 순수 모듈: 화면(TodayPlan QuizPlayer)과 테스트가 같이 쓴다.
 */
import { allFramesFor } from "./frames.ts";
import { allScriptsFor, type ScriptGloss, type StageScript } from "./stageScripts.ts";
import { segmentWords, isSpaceless } from "../wordSegments.ts";

/** who: 상대 줄("them")은 고르기·맞추기에만, 말하기는 내 줄·예문만. */
export type QuizSource = { text: string; gloss: ScriptGloss; from: string; stage: number; piece?: string; who?: "me" | "them"; /** 빈도 단어: 그 낱말의 뜻(앱 언어). */ wordGloss?: string };

/** 튜터가 고친 내 줄(노트 카드에서 — 폰의 오늘 목록에만 들고 다닌다). */
export type QuizCard = { wrong: string; right: string; note?: string };

export type QuizQuestion =
  | { kind: "fix"; wrong: string; right: string; note?: string; words: string[]; bad: number[]; options?: string[]; answer?: number }
  | { kind: "choose"; text: string; before: string; after: string; options: string[]; answer: number; gloss: ScriptGloss; from: string }
  | { kind: "order"; text: string; words: string[]; tiles: number[]; spaced: boolean; gloss: ScriptGloss; from: string }
  | { kind: "say"; text: string; gloss: ScriptGloss; from: string; mark?: string }
  /** 뜻 고르기: 문장을 보고 뜻(앱 언어) 고르기(보기 = 다른 줄의 뜻). */
  | { kind: "meaning"; text: string; options: ScriptGloss[]; answer: number; gloss: ScriptGloss; from: string; /** 단어 퀴즈: 문장 안 밑줄 낱말 — 보기는 그 낱말의 뜻. */ mark?: string };

/**
 * 학습 조합(2026-10-29 사용자 "방식에 이름을 붙이기보다 나눠서 고르거나 학습 조합을 짜 주는 식"):
 * auto = 앱이 돌림(풀 때마다 다른 모양) · speak = 말하기 위주 · read = 읽고 고르기 위주.
 * 듣기 위주(듣고 고르기)는 뺌(2026-10-30 사용자 "발음, 듣기 문제는 그냥 삭제" — 보기가 뜻부터 달라 듣지 않아도 풀렸음).
 */
export type QuizMix = "auto" | "speak" | "read";

export type Quiz = { key: string; questions: QuizQuestion[] };

export const QUIZ_MINUTES = 2;
export const QUIZ_SIZE = 3;

/** 셋 중 둘 이상 맞으면 맞음(둘뿐이면 둘 다). */
export function quizPassed(correct: number, total: number): boolean {
  return total > 0 && correct >= Math.min(total, 2);
}

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** 같은 열쇠·같은 날이면 같은 문제(다시 열어도 바뀌지 않게). */
function rng(seed: string): () => number {
  let a = hash(seed) || 1;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(list: readonly T[], random: () => number): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/** 문장 안에서 표현을 대소문자 구별 없이 찾아, 문장에 적힌 그대로의 조각을 돌려준다. */
export function pieceOf(text: string, expression: string): string | null {
  if (!expression) return null;
  const at = text.toLocaleLowerCase().indexOf(expression.toLocaleLowerCase());
  if (at < 0 || text.toLocaleLowerCase().length !== text.length) return text.includes(expression) ? expression : null;
  return text.slice(at, at + expression.length);
}

function frameOf(language: string, id: string) {
  return allFramesFor(language).find((frame) => frame.id === id) ?? null;
}

/**
 * 뼈대 밖에서 막힌 것(u|, curriculum/gaps.ts)의 재료 — 화면이 이 폰·노트 카드에서 모아 넘긴다(대본에 없어서).
 * 고르기 오답은 다른 막힌 것의 말 + 가까운 뼈대 표현.
 */
const GAP_SOURCES = new Map<string, Map<string, QuizSource[]>>();

export function registerQuizSources(language: string, entries: readonly { key: string; sources: QuizSource[] }[]): void {
  const map = GAP_SOURCES.get(language) ?? new Map<string, QuizSource[]>();
  for (const entry of entries) if ((entry.key.startsWith("u|") || entry.key.startsWith("w|")) && entry.sources.length) map.set(entry.key, entry.sources);
  GAP_SOURCES.set(language, map);
}

/** 열쇠가 가리키는 문장들(문제 재료) — 그 조각(piece)이 문장에 그대로 든 것엔 piece를 붙인다. */
export function quizSources(language: string, key: string): QuizSource[] {
  if (key.startsWith("u|") || key.startsWith("w|")) return GAP_SOURCES.get(language)?.get(key) ?? [];
  const scripts = allScriptsFor(language);
  const out: QuizSource[] = [];
  const seen = new Set<string>();
  const add = (source: QuizSource) => {
    if (!source.text || seen.has(source.text)) return;
    seen.add(source.text);
    out.push(source);
  };
  if (key.startsWith("f|")) {
    const frame = frameOf(language, key.slice(2));
    if (!frame) return [];
    const pieceIn = (text: string) => frame.core.find((core) => core && text.includes(core));
    for (const example of frame.examples) add({ text: example.text, gloss: example.gloss, from: frame.id, stage: frame.stage, piece: pieceIn(example.text) });
    for (const script of scripts) {
      for (const line of script.lines) {
        if (line.who === "me" && line.frames?.includes(frame.id)) add({ text: line.text, gloss: line.gloss, from: script.id, stage: script.stage, piece: pieceIn(line.text) });
      }
    }
    return out;
  }
  if (key.startsWith("e|")) {
    const expression = key.slice(2);
    // 그 표현을 핵심으로 둔 대본 먼저, 그다음 다른 대본에 그 표현이 그대로 나온 줄(상대 줄 포함) — 같은 표현을 다른 상황에서 다시
    // (2026-10-29 사용자 "지속학습에서 계속 던져주는 식으로 노출 수를").
    const ordered = [...scripts.filter((s) => s.expressions.includes(expression)), ...scripts.filter((s) => !s.expressions.includes(expression))];
    for (const script of ordered) {
      for (const line of script.lines) {
        // 핵심 표현은 소문자·문장부호 없이 적혀 있다("hola" ↔ "¡Hola!") — 줄에 든 그대로의 조각을 쓴다.
        const piece = pieceOf(line.text, expression);
        if (piece) add({ text: line.text, gloss: line.gloss, from: script.id, stage: script.stage, piece, who: line.who === "me" ? "me" : "them" });
      }
    }
    // 빈도 단어 카드 예문 중 그 표현이 그대로 든 문장도(2026-10-29 사용자 "문법·표현 퀴즈 소재가 한정" → 단어 데이터 연결, 4개까지 — 단계 0이라 어느 단계에서나).
    let extra = 0;
    for (const [k, list] of GAP_SOURCES.get(language)?.entries() ?? []) {
      if (extra >= 4) break;
      if (!k.startsWith("w|")) continue;
      for (const source of list) {
        const piece = pieceOf(source.text, expression);
        if (!piece || seen.has(source.text)) continue;
        add({ text: source.text, gloss: source.gloss, from: source.from, stage: 0, piece, who: "me" });
        extra += 1;
      }
    }
    return out;
  }
  if (key.startsWith("g|")) {
    const [stage, index] = key.slice(2).split(":").map(Number);
    for (const script of scripts) {
      // 그 단계에서 그 문법을 쓰는 대본 + 뒤 단계에서 그 문법을 다시 쓰는 대본(earlierGrammar).
      const here = script.stage === stage && (script.grammar ?? []).includes(index!);
      const again = (script.earlierGrammar ?? []).includes(`${stage}:${index}`);
      if (!here && !again) continue;
      for (const line of script.lines) {
        if (line.who !== "me") continue;
        // 문법 칸은 낱말 조각이 없다 — 그 줄의 문장구조 조각이 있으면 고르기 문제에 쓴다.
        const piece = (line.frames ?? []).map((id) => frameOf(language, id)?.core.find((core) => core && line.text.includes(core))).find(Boolean);
        add({ text: line.text, gloss: line.gloss, from: script.id, stage: script.stage, piece });
      }
    }
    // 그 문법 칸을 쓰는 문장구조 예문도.
    for (const frame of allFramesFor(language)) {
      if (frame.stage !== stage || !(frame.grammar ?? []).includes(index!)) continue;
      for (const example of frame.examples) add({ text: example.text, gloss: example.gloss, from: frame.id, stage: frame.stage, piece: frame.core.find((core) => core && example.text.includes(core)) });
    }
    return out;
  }
  return [];
}

/** 고르기 오답 후보: 같은 갈래 다른 열쇠의 조각(가까운 단계 먼저). */
function decoys(language: string, key: string, stage: number): string[] {
  if (key.startsWith("w|")) {
    // 빈도 단어: 같이 받아 둔 다른 낱말(가까운 순위)의 쓴 꼴.
    return [...new Set([...(GAP_SOURCES.get(language)?.entries() ?? [])].filter(([k]) => k !== key && k.startsWith("w|")).map(([, sources]) => sources[0]?.piece ?? "").filter(Boolean))];
  }
  if (key.startsWith("u|")) {
    const others = [...(GAP_SOURCES.get(language)?.entries() ?? [])].filter(([k]) => k !== key).map(([, sources]) => sources[0]?.piece ?? "").filter(Boolean);
    const skeleton = allScriptsFor(language).flatMap((script) => script.expressions);
    return [...new Set([...others, ...skeleton])];
  }
  const near = (s: number) => Math.abs(s - stage) <= 1;
  if (key.startsWith("e|")) {
    const mine = key.slice(2);
    return [
      ...new Set(
        allScriptsFor(language)
          .filter((script) => near(script.stage))
          .flatMap((script) => script.expressions)
          .filter((expression) => expression !== mine),
      ),
    ];
  }
  const mine = key.startsWith("f|") ? key.slice(2) : "";
  return [
    ...new Set(
      allFramesFor(language)
        .filter((frame) => frame.id !== mine && near(frame.stage))
        .flatMap((frame) => frame.core),
    ),
  ];
}

/** 띄어쓰기 없는 문장인지(조각을 붙여 보여 줄지). */
export function spacedText(text: string): boolean {
  return !isSpaceless(text);
}

const lower = (text: string) => text.toLocaleLowerCase();
const same = (a: string, b: string) => lower(a) === lower(b);

function chooseOf(language: string, key: string, source: QuizSource, random: () => number): QuizQuestion | null {
  const piece = source.piece;
  if (!piece) return null;
  const at = source.text.indexOf(piece);
  if (at < 0) return null;
  const wrong = shuffled(
    decoys(language, key, source.stage).filter((one) => one && !same(one, piece) && !lower(source.text).includes(lower(one)) && !lower(piece).includes(lower(one)) && !lower(one).includes(lower(piece))),
    random,
  ).slice(0, 2);
  if (wrong.length < 2) return null;
  const options = shuffled([piece, ...wrong], random);
  return {
    kind: "choose",
    text: source.text,
    before: source.text.slice(0, at),
    after: source.text.slice(at + piece.length),
    options,
    answer: options.indexOf(piece),
    gloss: source.gloss,
    from: source.from,
  };
}

/** 일본어 활용 조각(さ·れ·ま·した)은 한 조각으로 — 낱말 자르기가 동사 꼬리를 잘게 나눠 순서 문제가 이상해진다. */
const JA_TAIL = /^(?:[ぁ-ゖ]|した|します|ました|ません|ます|です|でした|たい|ない|なかった|れる|られ|れ|て|た|だ|って|った|ている|ています|ていました|てる|ちゃ|じゃ|います|いました|いる)$/u;
const JA_PARTICLE = new Set(["は", "が", "を", "に", "で", "へ", "と", "も", "の", "か", "ね", "よ", "や"]);

export function tilesOf(text: string, language: string): string[] {
  const words = segmentWords(text, language);
  if (language !== "ja") return words;
  const out: string[] = [];
  for (const word of words) {
    const prev = out[out.length - 1];
    if (prev && JA_TAIL.test(word) && !JA_PARTICLE.has(word) && (JA_TAIL.test(prev) || /[ぁ-ゖ]$/u.test(prev) || /[一-鿿]$/u.test(prev))) {
      out[out.length - 1] = prev + word;
    } else out.push(word);
  }
  return out;
}

/** 순서 맞추기 조각: 긴 줄은 이웃 낱말을 묶어 8조각 안팎으로(조각이 너무 많으면 화면이 넘침). */
export function orderTiles(text: string, language: string): string[] {
  const words = tilesOf(text, language);
  if (words.length <= 10) return words;
  const size = Math.ceil(words.length / 8);
  const glue = isSpaceless(text) ? "" : " ";
  const out: string[] = [];
  for (let i = 0; i < words.length; i += size) out.push(words.slice(i, i + size).join(glue));
  return out;
}

export function orderOf(language: string, source: QuizSource, random: () => number): QuizQuestion | null {
  const words = orderTiles(source.text, language);
  if (words.length < 3 || words.length > 10) return null;
  const indices = words.map((_, i) => i);
  let tiles = shuffled(indices, random);
  for (let tries = 0; tries < 4 && tiles.every((value, i) => words[value] === words[i]); tries += 1) tiles = shuffled(indices, random);
  if (tiles.every((value, i) => words[value] === words[i])) return null;
  return { kind: "order", text: source.text, words, tiles, spaced: spacedText(source.text), gloss: source.gloss, from: source.from };
}

/** 고른 조각 차례가 맞는지(같은 낱말이 둘이면 어느 쪽이든). */
export function orderCorrect(words: readonly string[], picked: readonly number[]): boolean {
  return picked.length === words.length && picked.every((index, i) => words[index] === words[i]);
}

/** 틀린 줄의 낱말 중 고친 줄과 맞춰지지 않는 것(가장 긴 공통 차례 밖). */
export function wrongWords(wrong: readonly string[], right: readonly string[]): number[] {
  const norm = (word: string) => word.toLocaleLowerCase().replace(/[\p{P}]/gu, "");
  const a = wrong.map(norm);
  const b = right.map(norm);
  const table: number[][] = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) table[i]![j] = a[i] === b[j] ? table[i + 1]![j + 1]! + 1 : Math.max(table[i + 1]![j]!, table[i]![j + 1]!);
  }
  const kept = new Set<number>();
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      kept.add(i);
      i += 1;
      j += 1;
    } else if (table[i + 1]![j]! >= table[i]![j + 1]!) i += 1;
    else j += 1;
  }
  return a.map((_, index) => index).filter((index) => !kept.has(index) && a[index]);
}

export function fixOf(language: string, card: QuizCard, random: () => number): QuizQuestion | null {
  if (!card.wrong || !card.right || card.wrong === card.right) return null;
  const words = segmentWords(card.wrong, language);
  const bad = wrongWords(words, segmentWords(card.right, language));
  if (bad.length && bad.length < words.length) return { kind: "fix", wrong: card.wrong, right: card.right, note: card.note, words, bad };
  // 고친 게 빠진 말을 더한 것뿐이면(또는 다 바뀌었으면) 두 문장 중 맞는 것.
  const options = shuffled([card.right, card.wrong], random);
  return { kind: "fix", wrong: card.wrong, right: card.right, note: card.note, words, bad: [], options, answer: options.indexOf(card.right) };
}

/**
 * 열쇠 하나의 퀴즈: [고친 줄] → 고르기·순서 → 말하기, 셋까지. 재료가 모자라면 문제가 둘 이하일 수 있고, 하나도 못 만들면 null(그땐 원래 대본으로).
 * seed = 그날(같은 날 다시 열면 같은 문제).
 */
/**
 * round = 이 열쇠를 이 폰에서 몇 번 풀었나(quizLog n): 문장을 돌려 매번 다른 줄로, 모양도 돌린다 —
 * 0번째 고르기 먼저(알아보기) · 1번째 맞추기 먼저(구조) · 2번째부터 말하기 둘(꺼내기). 시험(checkup·stageTest·placement)은 round 없이.
 */
/**
 * 문법·문장구조 열쇠는 말하기로 맞음/틀림을 가리지 않는다(2026-10-29 사용자 "문법 요소가 말하기 채점에 연결된 게 문제" → "1, 2번 먼저"):
 * 받아쓰기가 작은 표지(3인칭 s·관사·조사)를 고쳐 듣고, 판정은 뜻으로 해서 그 규칙을 틀려도 맞음이 된다. 그래서 이 열쇠의 문제는 고르기·순서·빈칸만.
 */
export function speakScored(key: string): boolean {
  return !key.startsWith("g|") && !key.startsWith("f|");
}

/**
 * 단어 퀴즈(빈도 단어 w|, 2026-10-29 사용자 "새 낱말 퀴즈는 단어 퀴즈인 거야?" → 셋 다): 빈칸(그 낱말 자리) 먼저 →
 * 낱말 뜻 고르기(예문 속 그 낱말에 밑줄, 보기는 다른 낱말 뜻) → 그 예문 말하기(밑줄). 학습 조합과 상관없이 이 모양.
 */
export function wordQuiz(language: string, key: string, seed = ""): Quiz | null {
  // 단어 퀴즈 = 예문 빈칸 하나(2026-10-30 사용자 "단어 퀴즈는 단순하게 맞추기 > 예문 형태로, 발음·듣기 문제는 삭제").
  // 같은 낱말을 모양만 바꿔 세 번 묻지 않는다 — 낱말 여럿은 짝 맞추기(WordMatch) 뒤 묶음으로 한 문제씩.
  const source = quizSources(language, key)[0];
  if (!source?.piece || !source.text.includes(source.piece)) return null;
  const random = rng(`${key}|${seed}|word`);
  const question = chooseOf(language, key, source, random) ?? orderOf(language, source, random);
  return question ? { key, questions: [question] } : null;
}

/**
 * 묶음 퀴즈(2026-10-29 사용자 "세 부분을 합쳐서 묶음 퀴즈로"): 열쇠 여럿에서 한 문제씩 — 같은 열쇠를 세 번 묻지 않는다.
 * 열쇠마다 그 열쇠 퀴즈의 첫 문제(말하기는 묶음에 하나까지, 같은 문장 두 번 없음). 문제마다 열쇠를 같이 돌려준다(결과는 열쇠마다 기록).
 */
const BUNDLE_KINDS: readonly QuizQuestion["kind"][] = ["choose", "order", "say", "meaning"];

/** 복습에서 고른 문제 모양(2026-10-30 사용자 "각각의 탭에 들어갔을 때 학습 방식을 선택하게") — 없으면 돌아가며. */
export type QuizStyle = Extract<QuizQuestion["kind"], "choose" | "order" | "say" | "meaning">;

export function bundleQuiz(language: string, keys: readonly string[], options: { seed?: string; stage?: number; style?: QuizStyle } = {}): { questions: QuizQuestion[]; keys: string[] } {
  const questions: QuizQuestion[] = [];
  const out: string[] = [];
  const texts = new Set<string>();
  let says = 0;
  for (const key of keys) {
    if (questions.length >= QUIZ_SIZE + 1) break;
    // 모양을 돌아가며(빈칸 → 순서 → 말하기 → 뜻) — 묶음이 한 모양만 되지 않게. 단어(w|)는 단어 퀴즈의 첫 문제(빈칸).
    const want = options.style ?? BUNDLE_KINDS[questions.length % BUNDLE_KINDS.length]!;
    const order = [want, ...BUNDLE_KINDS.filter((kind) => kind !== want)];
    const quiz = key.startsWith("w|") ? buildQuiz(language, key, { seed: options.seed, stage: options.stage }) : (buildQuiz(language, key, { seed: options.seed, stage: options.stage, kinds: order }) ?? buildQuiz(language, key, { seed: options.seed, stage: options.stage }));
    if (!quiz) continue;
    const textOf = (q: QuizQuestion) => ("text" in q ? q.text : q.kind === "fix" ? q.right : "");
    const usable = (q: QuizQuestion) => !texts.has(textOf(q)) && (q.kind !== "say" || says < 1 || options.style === "say") && q.kind !== "fix";
    const pick = quiz.questions.find((q) => q.kind === want && usable(q)) ?? quiz.questions.find(usable);
    if (!pick) continue;
    if (pick.kind === "say") says += 1;
    texts.add(textOf(pick));
    questions.push(pick);
    out.push(key);
  }
  return { questions, keys: out };
}

export function buildQuiz(
  language: string,
  key: string,
  options: { card?: QuizCard | null; seed?: string; round?: number; mix?: QuizMix; kinds?: readonly QuizQuestion["kind"][]; stage?: number } = {},
): Quiz | null {
  // 지금 단계 + 1까지의 예문만(2026-10-29 사용자 — 1단계에 4·5단계 업무 문장이 나옴). 그 안에 없으면 가까운 단계부터.
  const near = (list: QuizSource[]): QuizSource[] => {
    const stage = options.stage;
    if (!stage) return list;
    const inside = list.filter((source) => source.stage === 0 || source.stage <= stage + 1);
    if (inside.length) return inside;
    const closest = Math.min(...list.map((source) => source.stage));
    return list.filter((source) => source.stage === closest);
  };
  if (key.startsWith("w|")) {
    const word = wordQuiz(language, key, options.seed);
    // 모양을 골랐으면 그 모양만(없으면 단어 퀴즈 그대로).
    const only = word && options.kinds?.length ? word.questions.filter((q) => options.kinds!.includes(q.kind)) : [];
    if (word && only.length) return { key, questions: only };
    if (word) return word;
  }
  // 조합(말하기·읽기)이 정한 모양, "알아서"면 항목에 맞는 모양(curriculum/learnStyle.ts — 부르는 쪽이 kinds로).
  const kinds = options.mix && options.mix !== "auto" ? MIX_KINDS[options.mix] : options.kinds;
  if (kinds?.length) {
    const random = rng(`${key}|${options.seed ?? ""}|${kinds.join(",")}`);
    const all = shuffled(near(quizSources(language, key)), rng(key));
    const shift = options.round && all.length ? (options.round * 2) % all.length : 0;
    const questions = mixQuiz(language, key, [...all.slice(shift), ...all.slice(0, shift)], kinds, random);
    const fix = options.card ? fixOf(language, options.card, random) : null;
    const list = fix ? [fix, ...questions].slice(0, QUIZ_SIZE) : questions;
    // 조합대로 둘 넘게 못 만들면 앱이 돌리는 퀴즈로.
    if (list.length >= 2) return { key, questions: list };
  }
  const random = rng(`${key}|${options.seed ?? ""}`);
  const all = options.round === undefined ? shuffled(near(quizSources(language, key)), random) : shuffled(near(quizSources(language, key)), rng(key));
  const shift = options.round && all.length ? (options.round * 2) % all.length : 0;
  const sources = [...all.slice(shift), ...all.slice(0, shift)];
  const speakable = (source: QuizSource) => source.who !== "them" && speakScored(key);
  const questions: QuizQuestion[] = [];
  const used = new Set<string>();
  const fix = options.card ? fixOf(language, options.card, random) : null;
  if (fix) questions.push(fix);
  const middle: QuizQuestion[] = [];
  for (const source of sources) {
    if (middle.some((q) => q.kind === "choose")) break;
    const choose = chooseOf(language, key, source, random);
    if (choose) {
      middle.push(choose);
      used.add(source.text);
    }
  }
  for (const source of sources) {
    if (used.has(source.text)) continue;
    const order = orderOf(language, source, random);
    if (order) {
      middle.push(order);
      used.add(source.text);
      break;
    }
  }
  // 재료가 한 문장뿐이면(뼈대 밖 막힌 것) 같은 문장으로 맞추기도.
  if (!middle.some((q) => q.kind === "order") && sources.length === 1) {
    const order = orderOf(language, sources[0]!, random);
    if (order) middle.push(order);
  }
  const sayFrom = sources.find((source) => speakable(source) && !used.has(source.text)) ?? sources.find(speakable);
  const round = options.round ?? 0;
  if (round === 1) middle.sort((a, b) => (a.kind === "order" ? -1 : 0) - (b.kind === "order" ? -1 : 0));
  // 세 번째부터: 고르기 대신 다른 줄 말하기 하나 더(꺼내기를 늘림).
  const secondSay = round >= 2 && !fix ? sources.find((source) => speakable(source) && !used.has(source.text) && source.text !== sayFrom?.text) : undefined;
  const middleKept = secondSay ? middle.filter((q) => q.kind !== "choose").slice(0, 1) : middle;
  // 문법 열쇠: 말하기 자리에 다른 줄 맞추기(없으면 고르기) 하나 더.
  if (!speakScored(key)) {
    for (const source of sources) {
      if (used.has(source.text)) continue;
      const extra = orderOf(language, source, random) ?? chooseOf(language, key, source, random);
      if (extra) {
        middle.push(extra);
        used.add(source.text);
        break;
      }
    }
  }
  const room = QUIZ_SIZE - questions.length - (sayFrom ? 1 : 0) - (secondSay ? 1 : 0);
  questions.push(...middleKept.slice(0, Math.max(0, room)));
  if (secondSay) questions.push({ kind: "say", text: secondSay.text, gloss: secondSay.gloss, from: secondSay.from });
  if (sayFrom) questions.push({ kind: "say", text: sayFrom.text, gloss: sayFrom.gloss, from: sayFrom.from });
  return questions.length >= 2 ? { key, questions } : null;
}

/** 같은 단계 근처의 다른 줄(뜻 고르기 오답). */
function otherLines(language: string, source: QuizSource): { text: string; gloss: ScriptGloss }[] {
  const near = (s: number) => source.stage === 0 || Math.abs(s - source.stage) <= 1;
  const out: { text: string; gloss: ScriptGloss }[] = [];
  for (const script of allScriptsFor(language)) {
    if (!near(script.stage)) continue;
    for (const line of script.lines) if (line.text !== source.text && line.gloss?.en && line.gloss.en !== source.gloss.en) out.push({ text: line.text, gloss: line.gloss });
  }
  return out;
}

function meaningOf(language: string, source: QuizSource, random: () => number): QuizQuestion | null {
  if (source.gloss.raw === undefined && !source.gloss.en) return null;
  const wrong = shuffled(otherLines(language, source), random).slice(0, 2).map((line) => line.gloss);
  if (wrong.length < 2) return null;
  const options = shuffled([source.gloss, ...wrong], random);
  return { kind: "meaning", text: source.text, options, answer: options.indexOf(source.gloss), gloss: source.gloss, from: source.from };
}

/** 조합마다 세 문제의 모양(앞에서부터, 못 만들면 다음 것). */
const MIX_KINDS: Record<Exclude<QuizMix, "auto">, QuizQuestion["kind"][]> = {
  speak: ["order", "say", "say"],
  read: ["choose", "meaning", "order"],
};

/** 조합을 정한 퀴즈: 문장마다 그 조합의 모양으로(같은 문장은 한 번). */
function mixQuiz(language: string, key: string, sources: readonly QuizSource[], kinds: readonly QuizQuestion["kind"][], random: () => number): QuizQuestion[] {
  const used = new Set<string>();
  const out: QuizQuestion[] = [];
  for (const wanted of kinds) {
    // 문법 열쇠는 말하기 대신 고르기(못 만들면 아래에서 맞추기로).
    const kind: QuizQuestion["kind"] = wanted === "say" && !speakScored(key) ? (out.some((q) => q.kind === "choose") ? "order" : "choose") : wanted;
    const pool = sources.filter((source) => !used.has(source.text) && (kind !== "say" || source.who !== "them"));
    const fallback = sources.filter((source) => kind !== "say" || source.who !== "them");
    let made: QuizQuestion | null = null;
    for (const source of [...pool, ...fallback]) {
      made =
        kind === "choose" ? chooseOf(language, key, source, random)
        : kind === "order" ? orderOf(language, source, random)
        : kind === "meaning" ? meaningOf(language, source, random)
        : { kind: "say", text: source.text, gloss: source.gloss, from: source.from };
      if (made && !out.some((q) => q.kind === made!.kind && "text" in q && "text" in made! && q.text === made!.text)) {
        used.add(source.text);
        break;
      }
      made = null;
    }
    if (made) out.push(made);
  }
  return out;
}

/**
 * 대본 하나를 대화 대신 문제 묶음으로(학습 조합이 말하기 위주가 아닐 때, 2026-10-29): 대본 줄마다 그 조합의 모양 하나씩, 8문제까지.
 * 다 풀어 70% 넘게 맞히면 그 대본을 넘긴 것으로(화면이 /api/curriculum/scripts에 보냄 — 통과 기준 "모든 방식"과 같은 셈).
 */
export function buildUnit(language: string, scriptId: string, mix: Exclude<QuizMix, "auto">, seed: string): QuizQuestion[] {
  const script = allScriptsFor(language).find((one) => one.id === scriptId);
  if (!script) return [];
  const random = rng(`${scriptId}|${mix}|${seed}`);
  const lines = script.lines.map((line) => ({ text: line.text, gloss: line.gloss, from: script.id, stage: script.stage, who: line.who === "me" ? ("me" as const) : ("them" as const), piece: script.expressions.map((e) => pieceOf(line.text, e)).find(Boolean) ?? undefined }));
  const kinds = MIX_KINDS[mix];
  const out: QuizQuestion[] = [];
  lines.forEach((source, i) => {
    if (out.length >= 8) return;
    const kind = kinds[i % kinds.length]!;
    const made =
      kind === "choose" ? (source.piece ? chooseOf(language, `e|${script.expressions.find((e) => pieceOf(source.text, e))}`, source, random) : null) ?? meaningOf(language, source, random)
      : kind === "order" ? orderOf(language, source, random)
      : kind === "meaning" ? meaningOf(language, source, random)
      : source.who === "me" ? ({ kind: "say", text: source.text, gloss: source.gloss, from: source.from } as QuizQuestion) : meaningOf(language, source, random);
    if (made) out.push(made);
  });
  return out;
}

/** 묶음을 넘겼나: 센 문제의 70% 이상. */
export function unitPassed(correct: number, counted: number): boolean {
  return counted > 0 && correct / counted >= 0.7;
}

/** 이 열쇠로 퀴즈를 낼 수 있는지(오늘 할 것이 퀴즈와 원래 대본 중 고를 때). */
export function canQuiz(language: string, key: string): boolean {
  return buildQuiz(language, key) !== null;
}

/** 조각 순서 문제의 맞는 문장 모양(띄어쓰기 없는 언어는 붙여서). */
export function joinWords(words: readonly string[], spaced: boolean): string {
  return words.join(spaced ? " " : "");
}


/** 대본 🎤에서 같은 줄을 두 번 이상 틀리면 약한 곳으로 본다. */
export const SCRIPT_MISSES = 2;

/**
 * 대본에서 자꾸 틀린 내 줄 → 다시 볼 열쇠(그 줄의 문장구조 태그 + 그 줄에 든 핵심 표현). 학습 끝 체크에 "헷갈려요"로 미리 들어간다.
 * misses = 줄 번호 → 틀린 횟수(말이 들렸는데 맞지 않은 것만).
 */
export function weakKeysOfScript(script: StageScript, misses: Readonly<Record<number, number>>): string[] {
  const out = new Set<string>();
  for (const [at, count] of Object.entries(misses)) {
    const line = script.lines[Number(at)];
    if (!line || line.who !== "me" || count < SCRIPT_MISSES) continue;
    for (const frame of line.frames ?? []) out.add(`f|${frame}`);
    for (const expression of script.expressions) if (pieceOf(line.text, expression)) out.add(`e|${expression}`);
  }
  return [...out];
}
