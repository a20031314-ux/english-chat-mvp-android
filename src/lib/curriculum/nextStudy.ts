/**
 * 계속 공부(2026-10-29 사용자 "퀴즈쪽도 개편 — 다 하면 계속해서 필요한 부분을 공부하게, 항상 공부할 수 있되 부족한 부분부터 채우는 식으로").
 *
 * 오늘 할 것을 다 해도, 안 해도 언제나 "다음에 풀 것"을 하나씩 내준다 — 끝없이. 순서(부족한 것부터):
 *   1. again  날짜가 된 다시 볼 것(학습 끝 헷갈려요·물어본 곳, 서버 review)
 *   1½. confirm 시험에서 맞혀 확인 중인 것(curriculum/known.ts) — 다른 날 맞힐 때마다 이미 앎에 가까워짐
 *   2. missed 이 폰에서 퀴즈로 틀렸던 것(오래된 것부터)
 *   2½. gap   대화에서 막힌 것(튜터가 고친 줄에 새로 들어간 말·표현 보기로 연 표현, curriculum/gaps.ts)
 *   3. weak   지금 단계에서 가장 모자란 갈래(stageParts weakest)의 열쇠 — 표현·어휘·발음은 아직 숙지 안 된 핵심 표현, 문법은 그 단계 문법 칸
 *   4. new    아직 통과 안 한 그 단계 대본의 표현·문장구조(곧 나올 것 미리)
 *   5. keep   통과한 대본의 것 중 오래 안 푼 것(다지기)
 * 갈래 고르기(2026-10-29 사용자 "지속 학습도 단어·문법 등으로 나눠도 돼" → "진행해줘"): focus가 있으면 그 갈래 열쇠만, 모자란 갈래도 그것,
 * 지금 단계 것이 떨어지면 다음 단계들(곧 나옴)까지 — 고른 갈래를 끝없이. 발음은 문법 열쇠만 뺌(말하기 채점이 없어서, quiz.ts speakScored).
 * 두 줄(2026-10-29 사용자 "복습/이외 카테고리로 나눠줘, 버튼으로"): lane "review" = 1·1½·2·2½·5(다시 볼 것·확인 중·틀렸던 것·막힌 것·다지기, 갈래 없이),
 * lane "learn" = 3·4·빈도 단어 + 뒤 단계(고른 갈래 또는 알아서). lane이 없으면 예전처럼 모두 한 줄.
 * 복습은 틀린 것만(2026-10-30 사용자 "지속 학습 문제를 맞추면 확인 쪽으로 넘어가버려" → "복습은 틀린 것만"): lane "review" = 1·2·2½(다시 볼 것·틀렸던 것·막힌 것),
 * 맞힌 것의 확인(1½ 확인 중)과 다지기(5)는 lane "learn"에 섞는다 — 새 것 둘마다 확인 하나(CONFIRM_EVERY), 다지기는 맨 뒤. 이번 주 확인(checkup)은 그대로 확인 중을 낸다.
 * 사흘 안에 맞힌 열쇠와 이번에 이미 낸 열쇠는 빼고, 퀴즈를 못 만드는 열쇠도 뺀다. 모델을 부르지 않는 순수 모듈(화면 TodayPlan·테스트).
 */
import { isWordish, type PartId } from "../notes/stageParts.ts";
import type { LedgerState } from "../learner/ledger.ts";
import { DAY_MS, grammarKey, isCurriculumKey, reviewKeysOf, type ReviewMap } from "./dailyPlan.ts";
import { canQuiz } from "./quiz.ts";
import { allScriptsFor } from "./stageScripts.ts";

export type StudyReason = "again" | "confirm" | "missed" | "gap" | "word" | "weak" | "new" | "keep";
export type StudyPick = { key: string; reason: StudyReason; part?: PartId };

/** 열쇠마다 이 폰에서 푼 기록(열쇠만, 문장은 없음). */
export type QuizLog = Record<string, { n: number; right: number; at: number; last: boolean }>;

/** 맞힌 열쇠는 이만큼 쉬게 한다. */
export const QUIZ_REST_MS = 3 * DAY_MS;
/** 이만큼 안에 푼 열쇠는 다음 것으로 내지 않고 뒤로. */
export const RECENT_MS = 30 * 60 * 1000;
/** 한 번에 내다보는 수(화면은 첫 것만 씀 — 테스트·다음 문제 미리 보기용). */
const LOOKAHEAD = 30;
/** 새로 배우기 줄에서 새 것 몇 개마다 확인 중 하나를 섞을지·한 번에 내다볼 확인 중 수. */
export const CONFIRM_EVERY = 2;
const CONFIRM_LOOKAHEAD = 10;

/** 열쇠의 갈래(checkup.partOf에서 말하기 빼고, myParts와 같은 나눔). */
export function keyPart(language: string, key: string): PartId {
  if (key.startsWith("f|") || key.startsWith("g|")) return "grammar";
  return isWordish(key.slice(2), language) ? "vocab" : "expression";
}

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
  /** 대화에서 막힌 것(curriculum/gaps.ts — 고친 줄·표현 보기), 최근 것부터 — 틀렸던 것 다음에. 이미 앎은 부르는 쪽이 뺌. */
  gaps?: readonly string[];
  /** 빈도 단어 묶음에서 아직 모르는 낱말 열쇠(w|, 순위 순, curriculum/vocabBank.ts) — 어휘 갈래면 막힌 것 다음, 알아서면 부족한 갈래 다음. */
  words?: readonly string[];
  /** 고른 갈래(없으면 알아서 — 네 갈래 섞어 부족한 것부터). */
  focus?: PartId | null;
  /** 복습만 / 새로 배우기만(없으면 둘 다). */
  lane?: "review" | "learn";
  now?: number;
}): StudyPick[] {
  const lane = input.lane ?? null;
  const reviewing = lane !== "learn";
  const learning = lane !== "review";
  const focus = lane === "review" ? null : (input.focus ?? null);
  const fits = (key: string) => !focus || (focus === "pronunciation" ? keyPart(input.language, key) !== "grammar" : keyPart(input.language, key) === focus);
  const weakest = focus ?? input.weakest;
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
    if (!fits(key) || !isCurriculumKey(input.language, key) || !canQuiz(input.language, key)) return;
    // 날짜 된 다시 볼 것은 쉬는 중이어도 낸다(서버가 정한 날).
    if (reason !== "again" && reason !== "confirm" && resting(key)) return;
    out.push(part ? { key, reason, part } : { key, reason });
  };

  if (reviewing) {
    for (const [key] of Object.entries(input.review).filter(([, entry]) => entry.due <= now).sort((a, b) => a[1].due - b[1].due)) add(key, "again");

    // 확인 중: 오늘 아직 안 푼 것만(confirmDue가 거름) — 쉬는 중이어도 낸다(맞힌 날을 늘려야 이미 앎). 복습 줄에는 안 넣음(맞힌 것).
    if (!lane) for (const key of input.confirm ?? []) add(key, "confirm");

    for (const [key] of Object.entries(input.log).filter(([, entry]) => !entry.last).sort((a, b) => a[1].at - b[1].at)) add(key, "missed");

    for (const key of input.gaps ?? []) add(key, "gap");
  }

  // 새로 배우기 줄의 확인 중은 따로 모았다가 끝에서 새 것 사이에 섞는다.
  const confirms: StudyPick[] = [];
  if (lane === "learn") {
    for (const key of input.confirm ?? []) {
      if (confirms.length >= CONFIRM_LOOKAHEAD) break;
      if (seen.has(key) || skip.has(key)) continue;
      seen.add(key);
      if (fits(key) && isCurriculumKey(input.language, key) && canQuiz(input.language, key)) confirms.push({ key, reason: "confirm" });
    }
  }

  if (learning && focus === "vocab") for (const key of input.words ?? []) add(key, "word");

  const scripts = allScriptsFor(input.language);
  const here = scripts.filter((script) => script.stage === input.stage);
  const open = here.filter((script) => !input.passed.has(script.id));
  if (!learning) {
    // 복습 줄은 다지기로 끝.
  } else if (weakest === "grammar") {
    // 문법 칸: 아직 통과 안 한 대본이 쓰는 칸 먼저.
    const indexes = [...new Set([...open, ...here].flatMap((script) => script.grammar ?? []))];
    for (const index of indexes) add(grammarKey(input.stage, index), "weak", "grammar");
  } else if (weakest) {
    const fresh = (input.expressions ?? []).filter((row) => row.state !== "mastered").map((row) => row.text);
    const fromScripts = [...open, ...here].flatMap((script) => script.expressions);
    for (const text of [...fresh, ...fromScripts]) add(`e|${text}`, "weak", weakest);
  }

  if (learning && !focus) for (const key of input.words ?? []) add(key, "word");

  if (learning) for (const script of open) for (const key of reviewKeysOf(input.language, script.id)) add(key, "new");

  // 다지기: 통과한 대본(지금 단계와 그 앞)의 것 — 한 번도 안 푼 것, 그다음 오래전에 푼 것.
  const done = scripts.filter((script) => script.stage <= input.stage && input.passed.has(script.id)).sort((a, b) => b.stage - a.stage);
  const keep = done.flatMap((script) => reviewKeysOf(input.language, script.id));
  const order = (key: string) => input.log[key]?.at ?? 0;
  const keepKeys = [...new Set(keep)].sort((a, b) => order(a) - order(b));
  if (!lane) for (const key of keepKeys) add(key, "keep");

  // 갈래를 골랐거나 새로 배우기 줄이면 뒤 단계 것까지 곧 나옴으로(끝없이).
  if (learning && (focus || lane === "learn")) {
    for (const script of scripts.filter((one) => one.stage > input.stage && !input.passed.has(one.id)).sort((a, b) => a.stage - b.stage)) {
      for (const key of reviewKeysOf(input.language, script.id)) add(key, "new");
      if (focus === "grammar" || (!focus && lane === "learn")) for (const index of script.grammar ?? []) add(grammarKey(script.stage, index), "new");
    }
  }

  // 방금 푼 것은 뒤로(2026-10-29 사용자 — 같은 표현만 계속 나옴): 30분 안에 푼 열쇠는 맞든 틀리든, 다시 볼 것·확인 중·틀렸던 것이 아니면 맨 뒤.
  if (lane === "learn") for (const key of keepKeys) add(key, "keep");

  const recent = (pick: StudyPick) => pick.reason !== "again" && pick.reason !== "confirm" && pick.reason !== "missed" && now - (input.log[pick.key]?.at ?? -Infinity) < RECENT_MS;
  const ordered = [...out.filter((pick) => !recent(pick)), ...out.filter(recent)];
  if (!confirms.length) return ordered;
  // 새 것 CONFIRM_EVERY개마다 확인 중 하나, 남은 확인 중은 다지기 앞에.
  const mixed: StudyPick[] = [];
  let left = [...confirms];
  ordered.forEach((pick, index) => {
    if (pick.reason === "keep" && left.length) { mixed.push(...left); left = []; }
    mixed.push(pick);
    if ((index + 1) % CONFIRM_EVERY === 0 && left.length && pick.reason !== "keep") mixed.push(left.shift()!);
  });
  return [...mixed, ...left];
}
