/**
 * 자유대화 채우기(2026-11-06, hub/drafts/call-modes-2026-11-06.md 6절) — 숙제 없이, 부족한 것이 필요해지는 화제로 대화를 몬다.
 *
 * 통화 전에 이 폰의 기록으로 겨냥을 최대 셋 고르고(planAims), 차례마다 다음 튜터 차례에 실을 겨냥을 하나 또는 없음으로 고른다
 * (beforeTurn → 감독 요청 `aim`·`aimCheck`, 답이 오면 afterTurn). 감독에게 가는 글은 짧은 영어 한 줄이고 예문을 넣지 않는다
 * (RULES — 모델이 예문을 베낌). 낱말을 다루지 않아 언어와 상관없다. 화면·저장 없는 순수 모듈.
 *
 * 차례 하나 늦음: 이번 학습자 말의 재기(lead 등)는 답과 함께 오므로, 이번 겨냥은 앞 말까지 보고 고른다.
 * 학습자가 이번 말에서 화제를 꺼냈으면 감독 지시가 겨냥을 버리게 한다(director.ts "leave it and simply follow them").
 */
import type { FnGroup } from "../curriculum/fnGroups.ts";
import type { Flow, Heard, Lead } from "./turnTally.ts";

export type AimKind = "fix" | "fn" | "lead";
export type Aim = {
  /** 통화를 넘어 같은 겨냥을 알아보는 열쇠(fix:<고친 문장> · fn:<갈래> · lead). */
  key: string;
  kind: AimKind;
  /** fix: 감독에게 간 고침 목록의 번호(1부터) · fn: 갈래. */
  ref: string;
  /** fix: 그 고침의 틀린 점 한 줄(앱 언어, 고침 목록 그대로) — "고침 n번"만으로는 튜터가 어디로 몰지 몰랐다(점검 2026-11-06). */
  point?: string;
};

type Run = { tries: number; used: number; wrong: number; last: number };

export type TalkAimState = {
  aims: Aim[];
  runs: Record<string, Run>;
  /** 지금까지 보낸 튜터 차례 수(인사 다음부터). */
  tutorTurns: number;
  /** lead "min"이 이어진 수. */
  minStreak: number;
  /** 바로 앞 학습자 말이 겨냥을 쉬어야 하는 말이었나(못 알아들음·막힘·스스로 꺼냄). */
  rest: boolean;
  /** 바로 앞 학습자 말이 살아남을 만큼만(min)이었나 — 그때 질문 없이 멈추면 대화가 끊긴다(점검 2026-11-06 ja). */
  lastMin: boolean;
  /** 바로 앞 튜터 차례에 실은 겨냥(열쇠·글). 이번 학습자 말로 확인한다. */
  sent: { key: string; text: string } | null;
};

/** 계획 겨냥은 한 통화 이만큼까지 싣는다. */
export const AIM_TRIES = 3;
/** 이만큼 맞게 쓰면 그 겨냥은 이 통화에서 끝. */
export const AIM_DONE_USED = 2;
/** 처음 이만큼의 튜터 차례는 겨냥 없이(인사·화제 잡기). */
export const AIM_WARMUP_TURNS = 2;
/** 같은 계획 겨냥 사이에 둘 튜터 차례. */
export const AIM_GAP = 2;
/** fn 갈래 몫을 볼 만큼 쌓인 차례 수(최근 통화 합). */
export const FN_MIN_TURNS = 30;
/** 이보다 적게 나온 갈래가 겨냥 후보. */
export const FN_RARE_SHARE = 0.05;
/** 저절로 많이 나오는 갈래(자기 이야기·묻기·인사)는 빼고, 말이 늘어야 나오는 갈래만. */
const STRETCH_FNS: readonly FnGroup[] = ["time", "reason", "compare", "mind"];

const FN_TEXT: Partial<Record<FnGroup, string>> = {
  time: "Ask something whose natural answer is about what they did before or will do later.",
  reason: "Ask something whose natural answer gives a reason, or says what they would do if things were different.",
  compare: "Ask something whose natural answer compares two things or describes what something is like.",
  mind: "Ask something whose natural answer says how they feel or what they think about something.",
};
const LEAD_TEXT = "Say something short of your own and stop without a question, leaving them room to take the conversation on.";
const EASY_TEXT = "Ask a question they can answer by picking one of two options.";

export function aimText(aim: Aim): string {
  if (aim.kind === "fix") {
    const what = aim.point?.trim() ? ` (what was wrong: "${aim.point.trim()}")` : "";
    return `Ask about something new in their life whose natural answer needs the same kind of sentence as correction ${aim.ref} in the list of corrections from earlier calls${what}. Do not mention the old mistake.`;
  }
  if (aim.kind === "lead") return LEAD_TEXT;
  return FN_TEXT[aim.ref as FnGroup] ?? "";
}

export type PlanInput = {
  /** 감독에게 가는 고침 목록 그대로(fixesPrompt와 같은 순서 — 마지막이 가장 최근). */
  fixes: readonly { right: string; point?: string }[];
  /** Logbank 부족 칸이 이끌기(실전 대화)인가. */
  wantsLead: boolean;
  /** 최근 통화들의 fn 갈래 셈 합(callDays turns.fn). */
  fnCounts: Partial<Record<FnGroup, number>>;
  /** 지난 통화들에서 겨냥마다 연달아 못 채운 수(talkAims.v1). 많을수록 뒤로. */
  misses?: Record<string, number>;
};

/** 통화 전 겨냥 최대 셋 — 같은 종류는 하나씩. */
export function planAims(input: PlanInput): Aim[] {
  const out: Aim[] = [];
  const lastFix = input.fixes.at(-1);
  if (lastFix?.right.trim()) {
    out.push({ key: `fix:${lastFix.right.trim()}`, kind: "fix", ref: String(input.fixes.length), ...(lastFix.point?.trim() ? { point: lastFix.point.trim() } : {}) });
  }
  if (input.wantsLead) out.push({ key: "lead", kind: "lead", ref: "lead" });
  const total = Object.values(input.fnCounts).reduce((sum, n) => sum + (n ?? 0), 0);
  if (total >= FN_MIN_TURNS) {
    const rare = STRETCH_FNS.map((fn) => ({ fn, share: (input.fnCounts[fn] ?? 0) / total }))
      .filter((row) => row.share < FN_RARE_SHARE)
      .sort((a, b) => a.share - b.share)[0];
    if (rare) out.push({ key: `fn:${rare.fn}`, kind: "fn", ref: rare.fn });
  }
  const misses = input.misses ?? {};
  return out
    .map((aim, at) => ({ aim, at }))
    .sort((a, b) => (misses[a.aim.key] ?? 0) - (misses[b.aim.key] ?? 0) || a.at - b.at)
    .map((row) => row.aim)
    .slice(0, 3);
}

export function startAims(aims: Aim[]): TalkAimState {
  return { aims, runs: {}, tutorTurns: 0, minStreak: 0, rest: false, lastMin: false, sent: null };
}

function runOf(state: TalkAimState, key: string): Run {
  return state.runs[key] ?? { tries: 0, used: 0, wrong: 0, last: -Infinity };
}

/** 다음 튜터 차례: 실을 겨냥(없으면 null)과 앞 차례 겨냥 확인(없으면 null). */
export function beforeTurn(state: TalkAimState): { state: TalkAimState; aim: string | null; aimCheck: string | null } {
  const turn = state.tutorTurns + 1;
  // 고르기 질문(easy)은 해낼 게 있는 겨냥이 아니라 확인하지 않는다.
  const aimCheck = state.sent && state.sent.key !== "easy" ? state.sent.text : null;
  const next = (pick: { key: string; text: string } | null, runs = state.runs, minStreak = state.minStreak) => ({
    state: { ...state, runs, minStreak, tutorTurns: turn, sent: pick },
    aim: pick?.text ?? null,
    aimCheck,
  });
  if (turn <= AIM_WARMUP_TURNS || state.rest) return next(null);
  if (state.minStreak >= 2) return next({ key: "easy", text: EASY_TEXT }, state.runs, 0);
  // 겨냥 다음 차례는 늘 쉰다 — 겨냥마다 간격만 두면 겨냥 셋이 돌아가며 매 차례 실렸다(점검 2026-11-06).
  if (state.sent) return next(null);
  for (const aim of state.aims) {
    if (aim.kind === "lead" && state.lastMin) continue;
    const run = runOf(state, aim.key);
    if (run.used >= AIM_DONE_USED || run.tries >= AIM_TRIES) continue;
    if (turn - run.last <= AIM_GAP) continue;
    const text = aimText(aim);
    if (!text) continue;
    return next({ key: aim.key, text }, { ...state.runs, [aim.key]: { ...run, tries: run.tries + 1, last: turn } });
  }
  return next(null);
}

export type TurnSeen = { lead?: Lead; heard?: Heard | "after"; flow?: Flow; missed?: boolean; aim?: "used" | "wrong" };

/** 감독 답이 온 뒤: 이번 학습자 말의 재기로 상태를 고친다. */
export function afterTurn(state: TalkAimState, seen: TurnSeen): TalkAimState {
  let runs = state.runs;
  const key = state.sent?.key;
  if (key && key !== "easy" && seen.aim) {
    const run = runOf(state, key);
    runs = { ...runs, [key]: { ...run, used: run.used + (seen.aim === "used" ? 1 : 0), wrong: run.wrong + (seen.aim === "wrong" ? 1 : 0) } };
  }
  const rest = Boolean(seen.missed || seen.heard === "off" || seen.flow === "stuck" || seen.lead === "lead");
  return { ...state, runs, rest, lastMin: seen.lead === "min", minStreak: seen.lead === "min" ? state.minStreak + 1 : 0 };
}

export type AimOutcome = { key: string; kind: AimKind; result: "used" | "wrong" | "none" };

/** 통화가 끝나면: 실어 본 겨냥마다 결과. 한 번도 못 실은 겨냥은 빠진다. */
export function aimResults(state: TalkAimState): AimOutcome[] {
  return state.aims.flatMap((aim) => {
    const run = state.runs[aim.key];
    if (!run || run.tries === 0) return [];
    const result = run.used > 0 ? "used" : run.wrong > 0 ? "wrong" : "none";
    return [{ key: aim.key, kind: aim.kind, result }];
  });
}
