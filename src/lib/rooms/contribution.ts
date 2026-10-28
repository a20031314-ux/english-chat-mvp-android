/**
 * 기여(남에게 해 준 것)와 꾸준함 — 프로필 칸과 노출 가산(설계: hub/drafts/profile-2026-10-23.md).
 *
 * - "도움됐어요": 질문한 사람만 그 답에 누른다(방 ❓의 답, 쪽지 질문의 답, 게시판 댓글).
 *   같은 두 사람 사이 하루 한 번, 가입 7일이 안 된 사람이 누른 것은 0, 서로 주고받는 사이는 반만 센다.
 * - 반영된 의견: 의견함에서 "반영"된 카드를 보낸 사람(로그인한 계정)마다 한 번.
 * - 꾸준함: 채팅·통화한 날(학습자 시간대 날짜).
 *
 * 보상은 돈이 아니라 노출이다 — 최근 30일 기여 점수만큼 사람 목록에서 접속 시각을 앞당기고(최대 6시간),
 * 게시판 새 글을 위로 올린다(최대 3시간). 오래된 기여는 창 밖으로 빠져 지금 활발한 사람이 올라온다.
 *
 * 계정마다 요약 하나(server/contribStore.ts). 문장·누가 무엇을 물었는지는 남기지 않는다. 순수.
 */

export const CONTRIB_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
/** 이 기간보다 새 계정이 누른 "도움됐어요"는 점수에 넣지 않는다(새 계정으로 서로 올려 주기 막기). */
export const THANK_MIN_ACCOUNT_AGE_MS = 7 * 24 * 60 * 60 * 1000;
/** 반영된 의견 하나의 무게(도움됐어요 하나 = 1). */
export const MADE_WEIGHT = 2;
/** 요약에 남기는 최근 기록 수 — 30일 창을 계산하기에 넉넉하게. */
const RECENT_MAX = 300;
const DAYS_MAX = 60;
const GAVE_MAX = 200;

export const PEOPLE_BOOST_MAX_MS = 6 * 60 * 60 * 1000;
export const BOARD_BOOST_MAX_MS = 3 * 60 * 60 * 1000;

export type ThankKind = "room" | "dm" | "board";

export type ContribSummary = {
  /** 받은 도움됐어요 전부(배지·"도움 준 답 n"). */
  help: number;
  /** 언어별 받은 수(답한 말의 언어 = 물은 사람의 학습 언어). */
  helpByLang: Record<string, number>;
  /** 반영된 의견 수. */
  made: number;
  /** 최근 기록 [시각, 무게] — 점수 계산용. */
  recent: [number, number][];
  /** 내가 도움됐어요를 누른 사람 → 마지막 시각(서로 주고받는 사이 찾기). */
  gave: Record<string, number>;
  /** 채팅·통화한 날(YYYY-MM-DD, 학습자 시간대). */
  days: string[];
};

export const EMPTY_CONTRIB: ContribSummary = { help: 0, helpByLang: {}, made: 0, recent: [], gave: {}, days: [] };

export function contribOf(stored: Partial<ContribSummary> | null | undefined): ContribSummary {
  if (!stored) return { ...EMPTY_CONTRIB, helpByLang: {}, recent: [], gave: {}, days: [] };
  return {
    help: Number.isFinite(stored.help) ? Number(stored.help) : 0,
    helpByLang: stored.helpByLang && typeof stored.helpByLang === "object" ? { ...stored.helpByLang } : {},
    made: Number.isFinite(stored.made) ? Number(stored.made) : 0,
    recent: Array.isArray(stored.recent) ? stored.recent.filter((row) => Array.isArray(row) && row.length === 2) : [],
    gave: stored.gave && typeof stored.gave === "object" ? { ...stored.gave } : {},
    days: Array.isArray(stored.days) ? stored.days.filter((day) => typeof day === "string") : [],
  };
}

/**
 * 이 도움됐어요의 무게: 누른 사람이 가입 7일 전이면 0(숫자에도 안 넣음), 받는 사람이 최근 30일 안에
 * 누른 사람에게 도움됐어요를 준 적이 있으면(서로 주고받는 사이) 0.5, 아니면 1.
 */
export function thankWeight(input: {
  giverCreatedAt: number;
  giverId: string;
  receiver: ContribSummary;
  now: number;
}): number {
  if (input.now - input.giverCreatedAt < THANK_MIN_ACCOUNT_AGE_MS) return 0;
  const back = input.receiver.gave[input.giverId];
  if (typeof back === "number" && input.now - back < CONTRIB_WINDOW_MS) return 0.5;
  return 1;
}

function trimRecent(rows: [number, number][], now: number): [number, number][] {
  return rows.filter(([at]) => now - at < CONTRIB_WINDOW_MS).slice(-RECENT_MAX);
}

/** 받는 사람 요약에 도움됐어요 하나. 무게 0이면 그대로. */
export function addThankReceived(summary: ContribSummary, input: { weight: number; lang: string | null; now: number }): ContribSummary {
  if (input.weight <= 0) return summary;
  const helpByLang = { ...summary.helpByLang };
  if (input.lang) helpByLang[input.lang] = (helpByLang[input.lang] ?? 0) + 1;
  return {
    ...summary,
    help: summary.help + 1,
    helpByLang,
    recent: trimRecent([...summary.recent, [input.now, input.weight]], input.now),
  };
}

/** 누른 사람 요약에 "누구에게 줬는지"(서로 주고받는 사이 판단용). 오래된 것부터 버린다. */
export function addThankGiven(summary: ContribSummary, receiverId: string, now: number): ContribSummary {
  const entries = Object.entries({ ...summary.gave, [receiverId]: now })
    .filter(([, at]) => now - at < CONTRIB_WINDOW_MS)
    .sort((a, b) => a[1] - b[1])
    .slice(-GAVE_MAX);
  return { ...summary, gave: Object.fromEntries(entries) };
}

export function addMade(summary: ContribSummary, now: number): ContribSummary {
  return { ...summary, made: summary.made + 1, recent: trimRecent([...summary.recent, [now, MADE_WEIGHT]], now) };
}

export function addStudyDay(summary: ContribSummary, day: string): ContribSummary {
  if (summary.days.includes(day)) return summary;
  return { ...summary, days: [...summary.days, day].sort().slice(-DAYS_MAX) };
}

/** 최근 30일 기여 점수. */
export function contribScore(summary: ContribSummary, now: number): number {
  return summary.recent.reduce((sum, [at, weight]) => (now - at < CONTRIB_WINDOW_MS ? sum + weight : sum), 0);
}

/** 점수 구간 → 앞당길 시간(최대값의 비율). 작게 시작해 운영 보며 조정. */
function boostShare(score: number): number {
  if (score >= 30) return 1;
  if (score >= 10) return 2 / 3;
  if (score >= 3) return 1 / 3;
  if (score >= 1) return 1 / 6;
  return 0;
}

export function peopleBoostMs(score: number): number {
  return Math.round(boostShare(score) * PEOPLE_BOOST_MAX_MS);
}

export function boardBoostMs(score: number): number {
  return Math.round(boostShare(score) * BOARD_BOOST_MAX_MS);
}

function previousDay(day: string): string {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

/**
 * 꾸준함: 오늘(학습자 날짜)까지 7일 안에 공부한 날 수와 연속일. 오늘 아직 안 했으면 어제까지 이어진 것을 센다.
 */
export function streakOf(days: readonly string[], today: string): { week: number; run: number } {
  const set = new Set(days);
  let week = 0;
  let cursor = today;
  for (let i = 0; i < 7; i += 1) {
    if (set.has(cursor)) week += 1;
    cursor = previousDay(cursor);
  }
  let run = 0;
  cursor = set.has(today) ? today : previousDay(today);
  while (set.has(cursor)) {
    run += 1;
    cursor = previousDay(cursor);
  }
  return { week, run };
}

/** 가장 많이 받은 언어(배지 옆 "· 한국어"). 없으면 null. */
export function topHelpLang(summary: ContribSummary): string | null {
  let best: string | null = null;
  let most = 0;
  for (const [lang, count] of Object.entries(summary.helpByLang)) {
    if (count > most) {
      best = lang;
      most = count;
    }
  }
  return best;
}

/** 공개 프로필의 기여·꾸준함 칸(켠 것만). */
export type ProfileBadges = {
  help?: { count: number; lang: string | null };
  streak?: { week: number; run: number };
  maker?: { count: number };
  /** 공부 기록(칸 study를 켰을 때, 숫자만 — server/contribStore readStudy, 2026-10-28). */
  study?: { scripts: number; frames: number; lines: number };
};

export function badgesFor(
  summary: ContribSummary,
  show: { help: boolean; streak: boolean; maker: boolean },
  today: string,
): ProfileBadges {
  const out: ProfileBadges = {};
  if (show.help && summary.help > 0) out.help = { count: summary.help, lang: topHelpLang(summary) };
  if (show.streak) {
    const streak = streakOf(summary.days, today);
    if (streak.week > 0) out.streak = streak;
  }
  if (show.maker && summary.made > 0) out.maker = { count: summary.made };
  return out;
}
