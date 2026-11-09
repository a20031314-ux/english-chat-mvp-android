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

export type LifeFact = { text: string; at: number; n: number; calls: string[] };

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

/** 튜터 프로필 "기억하는 나"에서 사용자가 지운 사실(2026-11-09). 다음 통화 지시에서도 빠진다. */
export function removeLifeFact(language: string, text: string, store: Store | null = browserStore()): LifeFact[] {
  if (!store) return [];
  const all = readAll(store);
  const kept = (all[language] ?? []).filter((fact) => !sameFact(fact.text, text));
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
  return `Today is ${dayStamp(now)}.\n${kept.map((fact) => `${dayStamp(fact.at)}: ${fact.text}`).join("\n")}`;
}
