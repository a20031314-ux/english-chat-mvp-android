/**
 * 계속 공부(2026-10-29 사용자 "퀴즈쪽도 개편 — 다 하면 계속해서 필요한 부분을 공부하게, 항상 공부할 수 있되 부족한 부분부터 채우는 식으로").
 *
 * 오늘 할 것을 다 해도, 안 해도 언제나 "다음에 풀 것"을 하나씩 내준다 — 끝없이. 순서(부족한 것부터):
 *   1. again  날짜가 된 다시 볼 것(학습 끝 헷갈려요·물어본 곳, 서버 review)
 *   1½. confirm 시험에서 맞혀 확인 중인 것(curriculum/known.ts) — 다른 날 맞힐 때마다 이미 앎에 가까워짐
 *   2. missed 이 폰에서 퀴즈로 틀렸던 것(오래된 것부터)
 *   3. weak   지금 단계에서 가장 모자란 갈래(stageParts weakest)의 열쇠 — 표현·어휘·발음은 아직 숙지 안 된 핵심 표현, 문법은 그 단계 문법 칸
 *   4. new    아직 통과 안 한 그 단계 대본의 표현·문장구조(곧 나올 것 미리)
 *   5. keep   통과한 대본의 것 중 오래 안 푼 것(다지기)
 * 사흘 안에 맞힌 열쇠와 이번에 이미 낸 열쇠는 빼고, 퀴즈를 못 만드는 열쇠도 뺀다. 모델을 부르지 않는 순수 모듈(화면 TodayPlan·테스트).
 */
import type { PartId } from "../notes/stageParts.ts";
import type { LedgerState } from "../learner/ledger.ts";
import { DAY_MS, grammarKey, isCurriculumKey, reviewKeysOf, type ReviewMap } from "./dailyPlan.ts";
import { canQuiz } from "./quiz.ts";
import { allScriptsFor } from "./stageScripts.ts";

export type StudyReason = "again" | "confirm" | "missed" | "weak" | "new" | "keep";
export type StudyPick = { key: string; reason: StudyReason; part?: PartId };

/** 열쇠마다 이 폰에서 푼 기록(열쇠만, 문장은 없음). */
export type QuizLog = Record<string, { n: number; right: number; at: number; last: boolean }>;

/** 맞힌 열쇠는 이만큼 쉬게 한다. */
export const QUIZ_REST_MS = 3 * DAY_MS;
/** 한 번에 내다보는 수(화면은 첫 것만 씀 — 테스트·다음 문제 미리 보기용). */
const LOOKAHEAD = 30;

export function recordQuiz(log: QuizLog, key: string, right: boolean, now = Date.now()): QuizLog {
  const before = log[key];
  const next = { ...log, [key]: { n: (before?.n ?? 0) + 1, right: (before?.right ?? 0) + (right ? 1 : 0), at: now, last: right } };
  // 오래된 것부터 버려 400개까지.
  const keys = Object.keys(next);
  if (keys.length > 400) {
    for (const old of keys.sort((a, b) => next[a]!.at - next[b]!.at).slice(0, keys.length - 400)) delete next[old];
  }
  return next;
}

export function nextStudy(input: {
  language: string;
  stage: number;
  passed: ReadonlySet<string>;
  review: ReviewMap;
  log: QuizLog;
  /** 지금 단계에서 가장 모자란 갈래(없으면 null). */
  weakest: PartId | null;
  /** 지금 단계 핵심 표현과 장부 상태(stageParts expressions). */
  expressions?: readonly { text: string; state: LedgerState | null }[];
  /** 이번에 이미 낸 열쇠. */
  skip?: ReadonlySet<string>;
  /** 시험에서 맞혀 확인 중인 열쇠(curriculum/known.ts confirmDue) — 다시 볼 것 다음에. */
  confirm?: readonly string[];
  now?: number;
}): StudyPick[] {
  const now = input.now ?? Date.now();
  const skip = input.skip ?? new Set<string>();
  const out: StudyPick[] = [];
  const seen = new Set<string>();
  const resting = (key: string) => {
    const entry = input.log[key];
    return Boolean(entry?.last && now - entry.at < QUIZ_REST_MS);
  };
  const add = (key: string, reason: StudyReason, part?: PartId) => {
    if (out.length >= LOOKAHEAD || seen.has(key) || skip.has(key)) return;
    seen.add(key);
    if (!isCurriculumKey(input.language, key) || !canQuiz(input.language, key)) return;
    // 날짜 된 다시 볼 것은 쉬는 중이어도 낸다(서버가 정한 날).
    if (reason !== "again" && reason !== "confirm" && resting(key)) return;
    out.push(part ? { key, reason, part } : { key, reason });
  };

  for (const [key] of Object.entries(input.review).filter(([, entry]) => entry.due <= now).sort((a, b) => a[1].due - b[1].due)) add(key, "again");

  // 확인 중: 오늘 아직 안 푼 것만(confirmDue가 거름) — 쉬는 중이어도 낸다(맞힌 날을 늘려야 이미 앎).
  for (const key of input.confirm ?? []) add(key, "confirm");

  for (const [key] of Object.entries(input.log).filter(([, entry]) => !entry.last).sort((a, b) => a[1].at - b[1].at)) add(key, "missed");

  const scripts = allScriptsFor(input.language);
  const here = scripts.filter((script) => script.stage === input.stage);
  const open = here.filter((script) => !input.passed.has(script.id));
  if (input.weakest === "grammar") {
    // 문법 칸: 아직 통과 안 한 대본이 쓰는 칸 먼저.
    const indexes = [...new Set([...open, ...here].flatMap((script) => script.grammar ?? []))];
    for (const index of indexes) add(grammarKey(input.stage, index), "weak", "grammar");
  } else if (input.weakest) {
    const fresh = (input.expressions ?? []).filter((row) => row.state !== "mastered").map((row) => row.text);
    const fromScripts = [...open, ...here].flatMap((script) => script.expressions);
    for (const text of [...fresh, ...fromScripts]) add(`e|${text}`, "weak", input.weakest);
  }

  for (const script of open) for (const key of reviewKeysOf(input.language, script.id)) add(key, "new");

  // 다지기: 통과한 대본(지금 단계와 그 앞)의 것 — 한 번도 안 푼 것, 그다음 오래전에 푼 것.
  const done = scripts.filter((script) => script.stage <= input.stage && input.passed.has(script.id)).sort((a, b) => b.stage - a.stage);
  const keep = done.flatMap((script) => reviewKeysOf(input.language, script.id));
  const order = (key: string) => input.log[key]?.at ?? 0;
  for (const key of [...new Set(keep)].sort((a, b) => order(a) - order(b))) add(key, "keep");

  return out;
}
