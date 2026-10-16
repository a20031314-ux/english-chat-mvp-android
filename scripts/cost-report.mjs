/**
 * What a learner actually costs, from the usage ledger (hub/drafts/pricing-2026-10.md).
 *
 * The pricing decision was made on estimates — a minute of call is about 11
 * won, a pack about 14 — and on a worst case where every subscriber fills
 * every daily allowance. This reads what people really did, day by day, and
 * prices it, so the plans can be checked against use rather than against the
 * worst case alone: what a typical day costs, what a heavy one costs, how
 * often a day would go past 7, 10 or 15 minutes of call, and how many chat
 * messages a day people send (the one cost cost.ts has never priced).
 *
 * Every request that spends model time is metered once per user and day
 * (`usage:op:<op>:<userId>:<day>`, kept 45 days). Each op is priced here from
 * cost.ts where it says, and from a stated assumption where it does not; the
 * assumptions are printed. Pass the OpenAI bill for the same days with --bill
 * and every figure is scaled so the total matches it — the estimate's shape,
 * the bill's size.
 *
 * Test traffic is left out: user ids named like the checks run from chats
 * (claude-…, …check…, …probe…, language-pass…, capture…).
 *
 * Run (needs KV credentials, as tester-usage-report.mjs):
 *   node --experimental-strip-types scripts/cost-report.mjs [--days 30] [--bill 12.34]
 *   node --experimental-strip-types scripts/cost-report.mjs --selftest
 */
import { readFileSync } from "node:fs";
import { MODEL_CALLS_PER_REQUEST } from "../src/lib/server/modelCalls.ts";
import {
  CALL_TRANSCRIBE_USD_PER_MINUTE,
  KRW_PER_USD,
  MINI_USD_PER_MTOK,
  ROLEPLAY_TURN,
  STORE_FEE_SHARE,
  TTS_USD_PER_MINUTE,
  SUBTITLE_PASS_TOKENS,
  TUTOR_USD_PER_MTOK,
} from "../src/lib/billing/cost.ts";

const subtitlePassUsd = () =>
  (SUBTITLE_PASS_TOKENS.input * MINI_USD_PER_MTOK.input + SUBTITLE_PASS_TOKENS.output * MINI_USD_PER_MTOK.output) / 1_000_000;

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf(name);
  return at >= 0 && args[at + 1] !== undefined ? Number(args[at + 1]) : fallback;
};

/** Assumptions for ops cost.ts does not price, printed with the report. */
export const ASSUMED = {
  miniCallTokens: { input: 2000, output: 300 },
  ttsSeconds: 6,
  listenSeconds: ROLEPLAY_TURN.learnerSpeakingSeconds,
  reviewUsd: 0.002,
};

const miniCallUsd =
  (ASSUMED.miniCallTokens.input * MINI_USD_PER_MTOK.input + ASSUMED.miniCallTokens.output * MINI_USD_PER_MTOK.output) /
  1_000_000;

/** USD for one metered request of an op. */
export function opUsd(op) {
  switch (op) {
    case "roleplayTurn":
      return (ROLEPLAY_TURN.input * TUTOR_USD_PER_MTOK.input + ROLEPLAY_TURN.output * TUTOR_USD_PER_MTOK.output) / 1_000_000;
    case "roleplayListen":
      return (ASSUMED.listenSeconds / 60) * CALL_TRANSCRIBE_USD_PER_MINUTE;
    case "tts":
      // Counted inside the function, so a line served from the edge cache is
      // not here: each one is a synthesis.
      return (ASSUMED.ttsSeconds / 60) * TTS_USD_PER_MINUTE;
    case "roleplayReview":
      return ASSUMED.reviewUsd;
    case "videoPrepare":
    case "videoWindow":
      return (MODEL_CALLS_PER_REQUEST[op] ?? 1) * subtitlePassUsd();
    default:
      return (MODEL_CALLS_PER_REQUEST[op] ?? 1) * miniCallUsd;
  }
}

const AREA = (op) =>
  op.startsWith("roleplay") || op === "tts" ? "call" : op.startsWith("video") ? "video" : op.startsWith("chat") || op === "howToSay" || op === "howToSayCard" ? "chat" : "other";

export const TEST_USER = /^(claude-|language-pass)|check|probe|capture|-pass-/i;

/** `usage:op:<op>:<userId>:<day>`; the user id may contain colons ("rc:"). */
export function parseOpKey(key) {
  const parts = key.split(":");
  if (parts.length < 5) return null;
  const day = parts[parts.length - 1];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return null;
  return { op: parts[2], userId: parts.slice(3, -1).join(":"), day };
}

function pct(values, p) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const at = (p / 100) * (sorted.length - 1);
  const low = Math.floor(at);
  // Between two values, the point between them: a median of two days is their middle.
  return sorted[low] + (sorted[Math.min(low + 1, sorted.length - 1)] - sorted[low]) * (at - low);
}

/** The report from rows of { op, userId, day, count }. Pure, so it can be checked without KV. */
export function summarize(rows, options = {}) {
  const krw = (usd) => Math.round(usd * KRW_PER_USD.rate * (options.scale ?? 1));
  const userDays = new Map();
  const byArea = { call: 0, chat: 0, video: 0, other: 0 };
  const byOp = new Map();
  let total = 0;
  for (const row of rows) {
    if (row.count <= 0 || TEST_USER.test(row.userId)) continue;
    const usd = opUsd(row.op) * row.count;
    total += usd;
    byArea[AREA(row.op)] += usd;
    byOp.set(row.op, (byOp.get(row.op) ?? 0) + usd);
    const key = `${row.userId}|${row.day}`;
    const day = userDays.get(key) ?? { userId: row.userId, usd: 0, chat: 0, callTurns: 0 };
    day.usd += usd;
    if (row.op === "chat") day.chat += row.count;
    if (row.op === "roleplayTurn") day.callTurns += row.count;
    userDays.set(key, day);
  }
  const days = [...userDays.values()];
  const users = new Map();
  for (const day of days) users.set(day.userId, (users.get(day.userId) ?? 0) + day.usd);
  const callMinutes = days.map((d) => (d.callTurns * ROLEPLAY_TURN.turnSeconds) / 60);
  const callDays = callMinutes.filter((m) => m > 0);
  const over = (limit) => (callDays.length ? Math.round((callDays.filter((m) => m > limit).length / callDays.length) * 100) : 0);
  const chats = days.map((d) => d.chat).filter((n) => n > 0);
  return {
    users: users.size,
    userDays: days.length,
    totalKrw: krw(total),
    byAreaKrw: Object.fromEntries(Object.entries(byArea).map(([k, v]) => [k, krw(v)])),
    topOps: [...byOp.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([op, usd]) => [op, krw(usd)]),
    perUserDayKrw: { median: krw(pct(days.map((d) => d.usd), 50)), p90: krw(pct(days.map((d) => d.usd), 90)), max: krw(Math.max(0, ...days.map((d) => d.usd))) },
    perUserWindowKrw: { median: krw(pct([...users.values()], 50)), p90: krw(pct([...users.values()], 90)), max: krw(Math.max(0, ...users.values())) },
    callMinutesPerDay: { days: callDays.length, median: +pct(callDays, 50).toFixed(1), p90: +pct(callDays, 90).toFixed(1), max: +Math.max(0, ...callDays).toFixed(1) },
    callDaysOver: { "7": over(7), "10": over(10), "15": over(15) },
    chatPerDay: { days: chats.length, median: Math.round(pct(chats, 50)), p90: Math.round(pct(chats, 90)), max: Math.max(0, ...chats) },
  };
}

function print(report, days, scale) {
  const won = (n) => `${n.toLocaleString("ko-KR")}원`;
  console.log(`최근 ${days}일, 실제 사용자 ${report.users}명, 사용한 날 ${report.userDays}개 (테스트 사용자 제외)`);
  console.log(scale !== 1 ? `청구서에 맞춰 ${scale.toFixed(2)}배로 보정함` : "추정 단가 그대로 (--bill 로 청구서 금액을 주면 보정)");
  console.log(`\n총 비용: ${won(report.totalKrw)}  (통화 ${won(report.byAreaKrw.call)} · 채팅 ${won(report.byAreaKrw.chat)} · 영상 ${won(report.byAreaKrw.video)} · 기타 ${won(report.byAreaKrw.other)})`);
  console.log(`많이 쓴 항목: ${report.topOps.map(([op, k]) => `${op} ${won(k)}`).join(", ")}`);
  console.log(`\n한 사람이 하루 쓰는 비용: 보통 ${won(report.perUserDayKrw.median)} · 많은 날(상위 10%) ${won(report.perUserDayKrw.p90)} · 최대 ${won(report.perUserDayKrw.max)}`);
  console.log(`한 사람이 이 기간 쓴 비용: 보통 ${won(report.perUserWindowKrw.median)} · 상위 10% ${won(report.perUserWindowKrw.p90)} · 최대 ${won(report.perUserWindowKrw.max)}`);
  const c = report.callMinutesPerDay;
  console.log(`\n통화한 날 ${c.days}개: 하루 통화 보통 ${c.median}분 · 상위 10% ${c.p90}분 · 최대 ${c.max}분`);
  console.log(`하루 통화가 7분 넘은 날 ${report.callDaysOver["7"]}% · 10분 ${report.callDaysOver["10"]}% · 15분 ${report.callDaysOver["15"]}%`);
  const h = report.chatPerDay;
  console.log(`채팅한 날 ${h.days}개: 하루 채팅 보통 ${h.median}번 · 상위 10% ${h.p90}번 · 최대 ${h.max}번`);
  console.log(`\n가정: 모델 호출 1번 = gpt-4o-mini ${ASSUMED.miniCallTokens.input}/${ASSUMED.miniCallTokens.output} 토큰, TTS 1번 = ${ASSUMED.ttsSeconds}초, 통화 턴 = ${ROLEPLAY_TURN.turnSeconds}초, 1달러 ${KRW_PER_USD.rate}원, 수수료 ${STORE_FEE_SHARE * 100}%`);
}

async function main() {
  if (args.includes("--selftest")) {
    const rows = [
      { op: "chat", userId: "rc:a", day: "2026-10-15", count: 12 },
      { op: "roleplayTurn", userId: "rc:a", day: "2026-10-15", count: 40 },
      { op: "roleplayListen", userId: "rc:a", day: "2026-10-15", count: 40 },
      { op: "tts", userId: "rc:a", day: "2026-10-15", count: 30 },
      { op: "chat", userId: "rc:b", day: "2026-10-15", count: 3 },
      { op: "chat", userId: "claude-packcheck-en-20261016", day: "2026-10-16", count: 99 },
    ];
    const report = summarize(rows);
    const ok =
      report.users === 2 &&
      report.callMinutesPerDay.max === 10 &&
      report.callDaysOver["7"] === 100 &&
      report.callDaysOver["10"] === 0 &&
      report.chatPerDay.max === 12;
    print(report, 1, 1);
    console.log(ok ? "\nselftest: ok" : "\nselftest: FAILED");
    process.exitCode = ok ? 0 : 1;
    return;
  }
  const { kvConfigured, kvGetNumbers, kvScanKeys } = await import("../src/lib/server/kv.ts");
  if (!kvConfigured()) {
    try {
      for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
        const at = line.indexOf("=");
        if (at <= 0 || line.startsWith("#")) continue;
        const name = line.slice(0, at).trim();
        if ((name.startsWith("KV_") || name.startsWith("UPSTASH_")) && !process.env[name]) {
          process.env[name] = line.slice(at + 1).trim().replace(/^"|"$/g, "");
        }
      }
    } catch {
      // Reported below.
    }
  }
  if (!kvConfigured()) {
    console.error("KV 접속 정보가 없어요. .env.local 에 KV_REST_API_URL / KV_REST_API_TOKEN 이 있는 저장소 폴더에서 실행하세요.");
    process.exit(2);
  }
  const days = flag("--days", 30);
  const since = new Date(Date.now() - (days - 1) * 86_400_000).toISOString().slice(0, 10);
  const keys = (await kvScanKeys("usage:op:*")).filter((key) => {
    const row = parseOpKey(key);
    return row && row.day >= since;
  });
  const counts = await kvGetNumbers(keys);
  const rows = keys.map((key, i) => ({ ...parseOpKey(key), count: counts[i] ?? 0 }));
  const estimated = summarize(rows);
  const bill = flag("--bill", 0);
  const scale = bill > 0 && estimated.totalKrw > 0 ? (bill * KRW_PER_USD.rate) / estimated.totalKrw : 1;
  print(scale === 1 ? estimated : summarize(rows, { scale }), days, scale);
}

await main();
