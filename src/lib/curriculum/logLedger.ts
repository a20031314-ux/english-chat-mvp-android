/**
 * Logbank 사건 장부(2026-11-06 사용자 "2.80에 넣고" — 설계 hub/drafts/logbank-2026-11-06.md 2절, 순서 ①).
 * 퀴즈·통화 정리·사람 대화 교정·사전 찾기가 한 곳에 같이 쓴다. 지금 화면은 아직 이 장부를 읽지 않는다 —
 * 띠 2단계(체크 셋)를 만들 때 이미 몇 주 치 사건이 있게 먼저 쌓는다. 기존 저장(quizDays·dayLog·callDays)은 그대로.
 *
 * 학습자 문장은 넣지 않는다 — 열쇠(w|·e|·g|·f|·l|…)·출처·결과·방식·시각만. 이 폰에만, 학습 언어마다, 최근 1년.
 */

export type LogSource = "quiz" | "exam" | "call" | "people" | "dict" | "script";
/** ok 맞음 · miss 틀림 · used 통화·대화에서 씀 · look 찾아봄 */
export type LogResult = "ok" | "miss" | "used" | "look";
/** write 빈칸 쓰기 · pick 고르기(퀴즈만) */
export type LogMode = "write" | "pick";
export type LogEvent = { k: string; src: LogSource; r: LogResult; m?: LogMode; t: number };

/** 저장 꼴: 짧은 줄 [열쇠, 출처, 결과, 방식|"", 시각(초)] — 1년 치가 폰 저장 한도 안에 들게. */
type Row = [string, LogSource, LogResult, LogMode | "", number];
type Stored = { v: 1; migrated?: boolean; rows: Row[] };

const KEY = "logbank.v1";
export const LEDGER_EVENT = "lb-ledger";
export const KEEP_SECONDS = 366 * 24 * 60 * 60;
export const MAX_ROWS = 40000;
/** 같은 열쇠·출처·결과가 이만큼 안에 또 오면 한 번으로(같은 화면이 두 번 그려져 두 번 쓰는 것 막기). */
const SAME_SECONDS = 2;

const SOURCES: readonly LogSource[] = ["quiz", "exam", "call", "people", "dict", "script"];
const RESULTS: readonly LogResult[] = ["ok", "miss", "used", "look"];

function storageKey(language: string): string {
  return `${KEY}.${language}`;
}

function validRow(row: unknown): row is Row {
  return (
    Array.isArray(row) &&
    row.length === 5 &&
    typeof row[0] === "string" &&
    row[0].length > 2 &&
    SOURCES.includes(row[1] as LogSource) &&
    RESULTS.includes(row[2] as LogResult) &&
    (row[3] === "" || row[3] === "write" || row[3] === "pick") &&
    typeof row[4] === "number" &&
    Number.isFinite(row[4])
  );
}

export function parseLedger(raw: string | null): Stored {
  try {
    const value = JSON.parse(raw ?? "null") as Partial<Stored> | null;
    if (!value || value.v !== 1 || !Array.isArray(value.rows)) return { v: 1, rows: [] };
    return { v: 1, ...(value.migrated ? { migrated: true } : {}), rows: value.rows.filter(validRow) };
  } catch {
    return { v: 1, rows: [] };
  }
}

const toEvent = (row: Row): LogEvent => ({ k: row[0], src: row[1], r: row[2], ...(row[3] ? { m: row[3] } : {}), t: row[4] });
const toRow = (event: LogEvent): Row => [event.k, event.src, event.r, event.m ?? "", Math.round(event.t)];

/** 순수: 사건을 더하고, 1년 넘은 줄과 한도 넘는 앞줄을 뺀다. */
export function addEvents(stored: Stored, events: readonly LogEvent[], now: number): Stored {
  const cut = now - KEEP_SECONDS;
  const rows = stored.rows.filter((row) => row[4] >= cut);
  for (const event of events) {
    if (!event.k || event.k.length < 3 || event.t < cut) continue;
    const row = toRow(event);
    const dup = rows.some((one) => one[0] === row[0] && one[1] === row[1] && one[2] === row[2] && Math.abs(one[4] - row[4]) <= SAME_SECONDS);
    if (!dup) rows.push(row);
  }
  rows.sort((a, b) => a[4] - b[4]);
  return { ...stored, rows: rows.length > MAX_ROWS ? rows.slice(rows.length - MAX_ROWS) : rows };
}

export function readLedger(language: string): LogEvent[] {
  try {
    return parseLedger(globalThis.localStorage?.getItem(storageKey(language)) ?? null).rows.map(toEvent);
  } catch {
    return [];
  }
}

const nowSeconds = () => Math.floor(Date.now() / 1000);

/** 사건을 장부에 쓴다(시각을 안 주면 지금). 실패해도 화면은 그대로. */
export function noteLedger(language: string, events: readonly (Omit<LogEvent, "t"> & { t?: number })[]): void {
  if (!language || !events.length) return;
  try {
    const now = nowSeconds();
    const stored = parseLedger(globalThis.localStorage?.getItem(storageKey(language)) ?? null);
    const next = addEvents(stored, events.map((event) => ({ ...event, t: event.t ?? now })), now);
    globalThis.localStorage?.setItem(storageKey(language), JSON.stringify(next));
    globalThis.dispatchEvent?.(new CustomEvent(LEDGER_EVENT, { detail: { language } }));
  } catch {
    // 이번에만(저장 공간이 차면 다음 사건부터 다시).
  }
}

/** 퀴즈 기록 한 날 꼴(curriculum/quizDays.ts QuizDay 중 장부가 읽는 칸만). */
type QuizDayLike = { wrong?: string[]; okc?: string[]; okt?: string[]; wt?: string[] };

/**
 * 순수: 예전 퀴즈 날 기록 → 장부 사건(한 번만, 띠 2단계가 지난 기록도 보게).
 * 시각은 그날 정오(그날 안 순서는 모름). okc 고르기 맞음 · okt 쓰기 맞음 · wt 쓰기 틀림 · wrong 중 wt 아닌 것 = 고르기 틀림.
 */
export function eventsFromQuizDays(days: Record<string, QuizDayLike>): LogEvent[] {
  const out: LogEvent[] = [];
  for (const [day, one] of Object.entries(days)) {
    const [y, m, d] = day.split("-").map(Number);
    if (!y || !m || !d) continue;
    const t = Math.floor(new Date(y, m - 1, d, 12).getTime() / 1000);
    if (!Number.isFinite(t)) continue;
    for (const k of one.okc ?? []) out.push({ k, src: "quiz", r: "ok", m: "pick", t });
    for (const k of one.okt ?? []) out.push({ k, src: "quiz", r: "ok", m: "write", t });
    const wroteWrong = new Set(one.wt ?? []);
    for (const k of one.wt ?? []) out.push({ k, src: "quiz", r: "miss", m: "write", t });
    for (const k of one.wrong ?? []) if (!wroteWrong.has(k)) out.push({ k, src: "quiz", r: "miss", m: "pick", t });
  }
  return out;
}

/** 옮길 때 같은 사건인지: 열쇠·결과·방식·그 폰 날짜(예전 기록은 시각이 그날 정오뿐). */
function sameKey(k: string, r: string, m: string, t: number): string {
  const d = new Date(t * 1000);
  return `${k}|${r}|${m}|${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/** 예전 퀴즈 기록을 한 번 옮긴다(이미 옮겼으면 아무것도 안 함). Logbank를 처음 열 때 부른다. */
export function migrateLedger(language: string, readQuizDays: (language: string) => Record<string, QuizDayLike>): void {
  try {
    const stored = parseLedger(globalThis.localStorage?.getItem(storageKey(language)) ?? null);
    if (stored.migrated) return;
    // 업데이트 뒤 Logbank를 열기 전에 푼 퀴즈는 이미 장부에도 있다(noteQuizDay가 같이 씀) — 같은 날·열쇠·결과·방식은 건너뜀(2026-11-06 변경 감시).
    const have = new Set(stored.rows.filter((row) => row[1] === "quiz").map((row) => sameKey(row[0], row[2], row[3], row[4])));
    const fresh = eventsFromQuizDays(readQuizDays(language)).filter((event) => !have.has(sameKey(event.k, event.r, event.m ?? "", event.t)));
    const next = addEvents({ ...stored, migrated: true }, fresh, nowSeconds());
    globalThis.localStorage?.setItem(storageKey(language), JSON.stringify(next));
    // 장부만 읽는 개편 화면이 옮긴 기록으로 다시 그리게(2026-11-07 변경 감시 — 첫 열기에 띠·%·다시 볼 것이 비어 보임).
    if (fresh.length) globalThis.dispatchEvent?.(new CustomEvent(LEDGER_EVENT, { detail: { language } }));
  } catch {
    // 다음에 다시.
  }
}
