/**
 * 지난 통화에서 들은 삶 — 다음 통화가 "저번 주에도 헬스장"을 말할 수 있게(2026-11-04).
 *
 * 통화 원문은 최근 20통만 남고, 그 안 노트도 그 통화에서 끝난다. 여기에는 삶이 짧은 문장과
 * 들은 날짜만 남는다. 고친 문장·문법은 넣지 않는다(접을 때 지시). 이 폰에만.
 * 한 번만 나오고 두 달이 지난 일, 반년이 지난 일은 다음 통화에 안 실린다.
 */
const KEY = "tutorLife.v1";
const DAY = 86_400_000;

/** 이 폰에 남기는 상한. */
export const LIFE_MAX = 24;
/** 한 통화 지시에 실리는 상한. 최근 것부터. */
export const LIFE_PROMPT_MAX = 12;
/** 한 통화에서만 들은 일이 빠지는 날. */
export const LIFE_ONCE_DAYS = 60;
/** 여러 번 들었어도 빠지는 날. */
export const LIFE_KEEP_DAYS = 180;

/** asked = 튜터가 이 기억을 이어 물은 날(followUpFact로 고른 통화가 끝날 때) — 같은 걸 통화마다 묻지 않게(사용자 2026-11-28 "오늘도 카페 갔어?"가 계속). */
export type LifeFact = { text: string; at: number; n: number; calls: string[]; asked?: number };

type Store = { getItem(key: string): string | null; setItem(key: string, value: string): void };

function browserStore(): Store | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function dayStamp(at: number): string {
  const date = new Date(at);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** 학습자 기기의 오늘. 접기 지시가 "어제"를 이 날짜로 적게. */
export function lifeDay(at = Date.now()): string {
  return dayStamp(at);
}

function sameFact(a: string, b: string): boolean {
  const norm = (text: string) => text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
  const left = norm(a);
  return left.length > 0 && left === norm(b);
}

function readAll(store: Store): Record<string, LifeFact[]> {
  try {
    const raw = JSON.parse(store.getItem(KEY) ?? "{}") as Record<string, unknown>;
    const out: Record<string, LifeFact[]> = {};
    for (const [language, list] of Object.entries(raw)) {
      if (!Array.isArray(list)) continue;
      out[language] = list.filter(isFact);
    }
    return out;
  } catch {
    return {};
  }
}

function isFact(raw: unknown): raw is LifeFact {
  if (typeof raw !== "object" || raw === null) return false;
  const row = raw as LifeFact;
  return typeof row.text === "string" && row.text.trim() !== "" && typeof row.at === "number" && typeof row.n === "number" && Array.isArray(row.calls);
}

export function readLifeFacts(language: string, store: Store | null = browserStore()): LifeFact[] {
  if (!store) return [];
  return readAll(store)[language] ?? [];
}

/** 이번 통화에서 들은 사실을 더한다. 같은 통화가 두 번 적어도 횟수는 한 번. */
export function mergeLifeFacts(
  language: string,
  facts: readonly string[],
  at: number,
  callId: string,
  store: Store | null = browserStore(),
): LifeFact[] {
  if (!store) return [];
  const all = readAll(store);
  const list = all[language] ?? [];
  for (const raw of facts) {
    const text = raw.trim().slice(0, 180);
    if (!text) continue;
    const found = list.find((fact) => sameFact(fact.text, text));
    if (!found) {
      list.push({ text, at, n: 1, calls: [callId] });
      continue;
    }
    if (at >= found.at) {
      found.at = at;
      found.text = text;
    }
    if (!found.calls.includes(callId)) {
      found.n += 1;
      found.calls = [...found.calls, callId].slice(-8);
    }
  }
  const kept = trimFacts(list);
  all[language] = kept;
  store.setItem(KEY, JSON.stringify(all));
  return kept;
}

function trimFacts(list: LifeFact[]): LifeFact[] {
  const next = [...list];
  const oldestOnce = (fact: LifeFact) => (fact.n < 2 ? fact.at : fact.at + LIFE_KEEP_DAYS * DAY);
  while (next.length > LIFE_MAX) {
    let drop = 0;
    for (let i = 1; i < next.length; i += 1) {
      if (oldestOnce(next[i]!) < oldestOnce(next[drop]!)) drop = i;
    }
    next.splice(drop, 1);
  }
  return next;
}

/** 다음 통화 지시. 비면 지난 통화를 모르는 것과 같다. */
export function lifeFactsPrompt(facts: readonly LifeFact[], now: number): string {
  const kept = facts
    .filter((fact) => {
      const age = now - fact.at;
      if (age > LIFE_KEEP_DAYS * DAY) return false;
      if (fact.n < 2 && age > LIFE_ONCE_DAYS * DAY) return false;
      return true;
    })
    .sort((a, b) => b.at - a.at)
    .slice(0, LIFE_PROMPT_MAX);
  if (!kept.length) return "";
  return `Today is ${dayStamp(now)}.\n${kept.map((fact) => `${dayStamp(fact.at)}: ${fact.text}${fact.asked ? ` [asked ${dayStamp(fact.asked)}]` : ""}`).join("\n")}`;
}

/** 다시 이어 묻기까지 쉬는 날 — 습관 7일, 그 밖(사람·일·장소) 14일. 날 지난 예정은 그 날 뒤에 한 번 물었으면 끝. */
const ASK_AGAIN_DAYS = { habit: 7, other: 14 } as const;

/**
 * 이어 물을 기억 하나(사용자 2026-11-22 "오늘도 운동 갔어? 식의 대화") — 열린 통화 초반, 튜터 말이 한두 번 나간 뒤에만.
 * prior = lifeFactsPrompt("Today is D.\nD: kind: text[ [asked D]]"). 종류: habit(되풀이) · like(좋아함 — 묻지 않음) · done D(한 번 한 일 — 3일 안 한 번만) · plan D · about(늘 그런 것).
 * 고르는 순서: 날이 지난 지 7일 안의 예정 → 3일 안에 한 번 한 일 → 습관 → 아직 올 예정(오늘 포함) → 그 밖(7일 넘게 지난 예정은 뺌), 같은 종류 안에서는 날마다 돌려 가며.
 * 최근에 이어 물은 기억([asked D])은 쉰다 — 통화를 몇 번 해도 같은 걸 또 묻지 않게(사용자 2026-11-28).
 */
export function followUpFact(prior: string | undefined, history: readonly { who: string }[]): string | null {
  const tutorSaid = history.filter((line) => line.who === "tutor").length;
  if (!prior?.trim() || tutorSaid < 1 || tutorSaid > 2) return null;
  const lines = prior.trim().split("\n");
  const today = /^Today is (\d{4}-\d{2}-\d{2})/.exec(lines[0] ?? "")?.[1];
  if (!today) return null;
  const daysSince = (day: string) => Math.round((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${day}T00:00:00Z`)) / 86_400_000);
  const ranked: { rank: number; line: string }[] = [];
  for (const line of lines.slice(1)) {
    const match = /^\d{4}-\d{2}-\d{2}: (.+?)(?: \[asked (\d{4}-\d{2}-\d{2})\])?$/.exec(line.trim());
    const fact = match?.[1];
    if (!fact) continue;
    const asked = match[2];
    const plan = /^plan(?: (\d{4}-\d{2}-\d{2}))?:/i.exec(fact);
    const habit = /^habit:/i.test(fact);
    // 좋아하는 것은 묻지 않는다(화제로만 — 기억 목록에 남음). 한 번 한 일은 그 날부터 3일 안, 한 번만 "어땠어?"(사용자 2026-11-28 "그때 카페를 갔다와 운동을 좋아한다는 다르잖아").
    if (/^like:/i.test(fact)) continue;
    const once = /^done(?: (\d{4}-\d{2}-\d{2}))?:/i.exec(fact);
    if (once) {
      const ago = daysSince(once[1] ?? line.trim().slice(0, 10));
      if (asked || ago > 3) continue;
      ranked.push({ rank: 3.5, line: line.trim() });
      continue;
    }
    // 날 지난 예정은 그 날부터 7일 안에만 맨 앞(그 뒤엔 답을 들었을 것 — 통화마다 또 묻지 않게), 오늘 예정은 아직 올 예정(11-22 변경 감시).
    const due = plan?.[1] ? daysSince(plan[1]) : null;
    if (asked) {
      if (due !== null && due > 0 && asked >= plan![1]!) continue;
      if (daysSince(asked) < (habit ? ASK_AGAIN_DAYS.habit : ASK_AGAIN_DAYS.other)) continue;
    }
    const rank = plan ? (due !== null && due > 0 ? (due <= 7 ? 4 : 0) : 2) : habit ? 3 : 1;
    if (rank === 0) continue;
    ranked.push({ rank, line: line.trim() });
  }
  if (!ranked.length) return null;
  const best = Math.max(...ranked.map((one) => one.rank));
  const pool = ranked.filter((one) => one.rank === best);
  const dayNumber = Math.floor(Date.parse(`${today}T00:00:00Z`) / 86_400_000);
  return pool[dayNumber % pool.length]!.line;
}

/** 이번 통화에서 이어 물은 기억에 그날을 적는다(prior는 통화를 시작할 때 만든 글, line = followUpFact가 고른 줄). */
export function markLifeAsked(language: string, line: string, at: number, store: Store | null = browserStore()): void {
  if (!store) return;
  const text = /^\d{4}-\d{2}-\d{2}: (.+?)(?: \[asked \d{4}-\d{2}-\d{2}\])?$/.exec(line.trim())?.[1];
  if (!text) return;
  const all = readAll(store);
  const found = (all[language] ?? []).find((fact) => sameFact(fact.text, text));
  if (!found) return;
  found.asked = at;
  store.setItem(KEY, JSON.stringify(all));
}
