/**
 * 이번 주 확인(2026-10-29 사용자 "정기적인 시험이 언어능력 측정에 도움이 될까 — 이걸 바탕으로 퀴즈·커리큘럼, 역으로도" → "1번 만들어줘").
 *
 * 연습 기록은 다시 해서 통과한 것·고른 것·원문을 본 것까지 섞여 실력과 차이가 난다. 확인은 힌트 없이 한 번에, 배운 것과 안 배운 것을 섞어
 * "기억하고 있는지(오래전 것)"와 "처음 보는 데서도 되는지(다음 단계 것)"를 따로 본다. 레벨·등급은 만들지 않는다(STATE "학습 수준은 보여주지 않는다") —
 * 결과는 네 갈래(어휘·문법·표현·발음)마다 맞힌 수와 지난번과의 차이, 틀린 열쇠뿐.
 *
 * - 주기: 7일에 한 번(CHECKUP_EVERY_MS). 고를 수 있고 강제하지 않는다.
 * - 구성: 12문제 — 최근 배운 것 6 · 오래전에 배운 것 4 · 다음 단계 것 2(모자라면 다른 칸에서 채움).
 * - 문제: 퀴즈(quiz.ts)와 같은 모양에서 열쇠마다 한 문제 — 고르기·순서, 말하기는 3문제까지(발음 갈래). 모델은 말하기 판정만.
 * - 결과 → 학습: 틀린 열쇠는 다시 볼 것(헷갈려요처럼 2일 뒤), 약하게 나온 갈래는 계속 공부가 먼저(checkupWeakest).
 * 순수 모듈: 화면(studyMap/CheckupPlayer)·서버(/api/curriculum/scripts checkup)·테스트가 같이 쓴다.
 */
import { isWordish, PART_IDS, type PartId } from "../notes/stageParts.ts";
import { DAY_MS, isCurriculumKey, reviewKeysOf, type ReviewMap } from "./dailyPlan.ts";
import type { QuizLog } from "./nextStudy.ts";
import { buildQuiz, type QuizQuestion } from "./quiz.ts";
import { allScriptsFor } from "./stageScripts.ts";

export type CheckOrigin = "recent" | "old" | "ahead";
export const CHECK_ORIGINS: readonly CheckOrigin[] = ["recent", "old", "ahead"];

export type CheckItem = { key: string; part: PartId; origin: CheckOrigin; question: QuizQuestion };

/** 한 갈래·한 칸의 [맞힘, 낸 수]. */
export type Tally = [number, number];

/** 확인 한 번의 결과 — 열쇠와 맞힘만(문장·들린 말은 남기지 않는다). */
export type CheckResult = {
  at: number;
  stage: number;
  parts: Partial<Record<PartId, Tally>>;
  origins: Partial<Record<CheckOrigin, Tally>>;
  wrong: string[];
};

export const CHECKUP_SIZE = 12;
export const CHECKUP_EVERY_MS = 7 * DAY_MS;
/** 말하기 문제 수(대본 판단을 부르는 것은 이것뿐 — 원가). */
export const CHECKUP_SAY = 3;
/** 이 안에 배우거나 풀었으면 "최근". */
export const RECENT_MS = 14 * DAY_MS;
/** 서버가 남기는 결과 수. */
export const CHECKUP_KEEP = 12;

const QUOTA: Record<CheckOrigin, number> = { recent: 6, old: 4, ahead: 2 };

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function shuffled<T>(list: readonly T[], seed: string): T[] {
  let a = hash(seed) || 1;
  const random = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...list];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/** 확인할 때가 됐는지(처음이거나 마지막 확인에서 7일). */
export function checkupDue(results: readonly CheckResult[], now = Date.now()): boolean {
  const last = results.reduce((max, result) => Math.max(max, result.at), 0);
  return now - last >= CHECKUP_EVERY_MS;
}

/** 이번 주 씨앗(같은 주에 다시 열어도 같은 문제). 월요일 시작, UTC 날 기준. */
export function weekSeed(language: string, now = Date.now()): string {
  const day = Math.floor(now / DAY_MS);
  // 1970-01-01은 목요일 — +3이면 월요일 시작 주.
  return `${language}|w${Math.floor((day + 3) / 7)}`;
}

/** 문제 하나가 어느 갈래를 보나: 말하기 = 발음, 문장구조·문법 = 문법, 표현은 낱말 하나면 어휘. */
export function partOf(language: string, key: string, kind: QuizQuestion["kind"]): PartId {
  if (kind === "say") return "pronunciation";
  if (key.startsWith("f|") || key.startsWith("g|")) return "grammar";
  return isWordish(key.slice(2), language) ? "vocab" : "expression";
}

/** 칸마다 열쇠 후보(겹치면 앞 칸). */
export function checkupPools(input: {
  language: string;
  stage: number;
  passed: ReadonlySet<string>;
  review: ReviewMap;
  log: QuizLog;
  now: number;
}): Record<CheckOrigin, string[]> {
  const { language, stage, passed, review, log, now } = input;
  const scripts = allScriptsFor(language);
  const recent = new Set<string>();
  const old = new Set<string>();
  const ahead = new Set<string>();
  for (const [key, entry] of Object.entries(review)) (now - entry.at < RECENT_MS ? recent : old).add(key);
  for (const [key, entry] of Object.entries(log)) (now - entry.at < RECENT_MS ? recent : old).add(key);
  for (const script of scripts) {
    if (!passed.has(script.id)) continue;
    const into = script.stage >= stage ? recent : old;
    for (const key of reviewKeysOf(language, script.id)) into.add(key);
  }
  // 다음 단계(마지막 단계면 지금 단계의 아직 안 한 것) — 처음 보는 데서 되는지.
  const next = stage < 5 ? scripts.filter((script) => script.stage === stage + 1) : scripts.filter((script) => script.stage === stage && !passed.has(script.id));
  for (const script of next) for (const key of reviewKeysOf(language, script.id)) ahead.add(key);
  for (const key of recent) old.delete(key);
  for (const key of [...recent, ...old]) ahead.delete(key);
  const ok = (key: string) => isCurriculumKey(language, key);
  return { recent: [...recent].filter(ok), old: [...old].filter(ok), ahead: [...ahead].filter(ok) };
}

/**
 * 이번 주 확인 문제. 칸마다 정한 수를 뽑고(모자라면 다른 칸에서), 열쇠마다 퀴즈에서 한 문제 —
 * 말하기 CHECKUP_SAY까지(발음), 나머지는 고르기를 먼저, 없으면 순서. 같은 갈래가 몰리지 않게 문제를 섞는다.
 */
export function buildCheckup(input: {
  language: string;
  stage: number;
  passed: ReadonlySet<string>;
  review: ReviewMap;
  log: QuizLog;
  now?: number;
  seed?: string;
}): CheckItem[] {
  const now = input.now ?? Date.now();
  const seed = input.seed ?? weekSeed(input.language, now);
  const pools = checkupPools({ ...input, now });
  const items: CheckItem[] = [];
  const used = new Set<string>();
  let says = 0;
  let alternate = 0;
  // 열쇠 하나 → 문제 하나(못 만들면 건너뜀). 말하기는 4번째마다, 다음 단계 것엔 내지 않는다(처음 보는 문장을 뜻만 보고 말하기는 너무 어렵다).
  const add = (key: string, origin: CheckOrigin): boolean => {
    if (used.has(key)) return false;
    used.add(key);
    const quiz = buildQuiz(input.language, key, { seed });
    if (!quiz) return false;
    const pick = (kind: QuizQuestion["kind"]) => quiz.questions.find((q) => q.kind === kind);
    const sayOk = says < CHECKUP_SAY && origin !== "ahead";
    const wantSay = sayOk && items.length % 4 === 3;
    const question =
      (wantSay ? pick("say") : undefined) ??
      (alternate % 2 === 0 ? (pick("choose") ?? pick("order")) : (pick("order") ?? pick("choose"))) ??
      (sayOk ? pick("say") : undefined);
    if (!question) return false;
    if (question.kind === "say") says += 1;
    else alternate += 1;
    items.push({ key, part: partOf(input.language, key, question.kind), origin, question });
    return true;
  };
  const lists = Object.fromEntries(CHECK_ORIGINS.map((origin) => [origin, shuffled(pools[origin], `${seed}|${origin}`)])) as Record<CheckOrigin, string[]>;
  for (const origin of CHECK_ORIGINS) {
    let count = 0;
    for (const key of lists[origin]) {
      if (count >= QUOTA[origin] || items.length >= CHECKUP_SIZE) break;
      if (add(key, origin)) count += 1;
    }
  }
  // 모자라면 최근 → 오래전 → 다음 단계 순으로 채운다.
  for (const origin of CHECK_ORIGINS) {
    for (const key of lists[origin]) {
      if (items.length >= CHECKUP_SIZE) break;
      add(key, origin);
    }
  }
  // 문제 순서: 칸이 몰리지 않게 섞되 말하기 자리는 그대로(4번째마다).
  const says_ = items.filter((item) => item.question.kind === "say");
  const rest = shuffled(items.filter((item) => item.question.kind !== "say"), `${seed}|order`);
  const out: CheckItem[] = [];
  while (rest.length || says_.length) {
    if (out.length % 4 === 3 && says_.length) out.push(says_.shift()!);
    else if (rest.length) out.push(rest.shift()!);
    else out.push(says_.shift()!);
  }
  return out;
}

/** 답(첫 답만, 말하기를 못 한 것은 null)으로 결과를 만든다. */
export function summarize(items: readonly CheckItem[], answers: readonly (boolean | null)[], stage: number, now = Date.now()): CheckResult {
  const parts: Partial<Record<PartId, Tally>> = {};
  const origins: Partial<Record<CheckOrigin, Tally>> = {};
  const wrong: string[] = [];
  items.forEach((item, i) => {
    const answer = answers[i];
    if (answer === null || answer === undefined) return;
    const part = (parts[item.part] ??= [0, 0]);
    const origin = (origins[item.origin] ??= [0, 0]);
    part[1] += 1;
    origin[1] += 1;
    if (answer) {
      part[0] += 1;
      origin[0] += 1;
    } else if (!wrong.includes(item.key)) wrong.push(item.key);
  });
  return { at: now, stage, parts, origins, wrong };
}

/** 서버로 받은 결과 하나를 믿을 만한 모양으로(숫자 범위·열쇠 모양). 틀리면 null. */
export function cleanResult(raw: unknown, language: string, now = Date.now()): CheckResult | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Partial<CheckResult>;
  const stage = Number(value.stage);
  if (!Number.isInteger(stage) || stage < 1 || stage > 5) return null;
  const tally = (t: unknown): Tally | null =>
    Array.isArray(t) && t.length === 2 && t.every((n) => Number.isInteger(n) && n >= 0 && n <= CHECKUP_SIZE) && t[0] <= t[1] ? [t[0], t[1]] : null;
  const pick = <K extends string>(record: unknown, keys: readonly K[]) => {
    const out: Partial<Record<K, Tally>> = {};
    if (!record || typeof record !== "object") return out;
    for (const key of keys) {
      const t = tally((record as Record<string, unknown>)[key]);
      if (t && t[1] > 0) out[key] = t;
    }
    return out;
  };
  const parts = pick(value.parts, PART_IDS);
  const origins = pick(value.origins, CHECK_ORIGINS);
  if (!Object.keys(parts).length) return null;
  const wrong = (Array.isArray(value.wrong) ? value.wrong : [])
    .filter((key): key is string => typeof key === "string" && key.length <= 80 && /^[efg]\|/.test(key) && isCurriculumKey(language, key))
    .slice(0, CHECKUP_SIZE);
  return { at: now, stage, parts, origins, wrong };
}

/** 갈래 하나의 맞힌 몫(0~1), 낸 게 없으면 null. */
export function rateOf(tally: Tally | undefined): number | null {
  return tally && tally[1] > 0 ? tally[0] / tally[1] : null;
}

/**
 * 계속 공부가 먼저 볼 갈래: 최근 4주 확인(셋까지)을 합쳐 낸 게 2문제 이상인 갈래 중 가장 낮은 것. 다 80% 이상이면 null(연습 기록 쪽 갈래를 쓴다).
 */
export function checkupWeakest(results: readonly CheckResult[], now = Date.now()): PartId | null {
  const recent = [...results].filter((result) => now - result.at < 28 * DAY_MS).sort((a, b) => b.at - a.at).slice(0, 3);
  let worst: { part: PartId; rate: number } | null = null;
  for (const part of PART_IDS) {
    const sum = recent.reduce<Tally>((acc, result) => {
      const t = result.parts[part];
      return t ? [acc[0] + t[0], acc[1] + t[1]] : acc;
    }, [0, 0]);
    if (sum[1] < 2) continue;
    const rate = sum[0] / sum[1];
    if (!worst || rate < worst.rate) worst = { part, rate };
  }
  return worst && worst.rate < 0.8 ? worst.part : null;
}

/** 확인을 낼 만큼 배운 게 있는지(배운 것 — 최근·오래전 — 이 절반 이상). 처음 쓰는 사람에게 다음 단계 문제만 내지 않게. */
export function checkupReady(items: readonly CheckItem[]): boolean {
  return items.filter((item) => item.origin !== "ahead").length >= CHECKUP_SIZE / 2;
}
