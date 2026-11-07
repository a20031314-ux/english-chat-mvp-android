// 실행: node --experimental-strip-types scripts/curve-sim.ts [언어] — 2026-11-07 Logbank 학습 곡선 점검(hub/log 2026-11-07).
// 가상 학습자 30일: 장부(LogEvent)를 날마다 쌓고, 그날 끝의 확인된 실력(sureOf)·꼭짓점 %·내 것(앎·힘듦) 수를 본다.
// 사람 모형: 낱말 참 경계 trueB(빈도 순위), 문법 참 단계 trueG. 한 번 본 항목은 아는 확률이 오르고(배움), 안 보면 날마다 조금 잊음.
import { BANK_AXES, computeFill, fillCatalog } from "../src/lib/curriculum/fill.ts";
import { fillAt, fillChain, judgedAt } from "../src/lib/curriculum/fillJudge.ts";
import { ledgerFillEvents } from "../src/lib/curriculum/fillInputs.ts";
import { sureOf, ownCurve } from "../src/lib/curriculum/learnedView.ts";
import { checkStates, dayOfSeconds } from "../src/lib/curriculum/checkState.ts";
import { reviewKeys } from "../src/lib/curriculum/todayCards.ts";
import { loadBank } from "../src/lib/curriculum/vocabBank.ts";
import { knowChance, noteLevel, noteLevelBatch, PROBE, type Level } from "../src/lib/curriculum/vocabLevel.ts";
import type { LogEvent } from "../src/lib/curriculum/logLedger.ts";

const language = process.argv[2] ?? "es";
const DAYS = 30;
const NO_PLACED = process.env.NO_PLACED === "1";
// OLD=1: 예전(답마다 경계·숫자). 기본: 낱말 경계 10개 묶음 판정 + Logbank 하루 판정(fillJudge.ts, 2026-11-07).
const OLD = process.env.OLD === "1";
const utcStart = (ms: number) => Math.floor(ms / 86_400_000) * 86_400_000;
const D = 86400;
const T0 = Date.UTC(2026, 9, 1, 0) / 1000; // 10-01 UTC
const words = await loadBank(language);
const catalog = fillCatalog(language, words);
const grammar = [...catalog.sent.values()].filter((item) => item.key.startsWith("g|")).sort((a, b) => a.stage - b.stage || a.d - b.d);

function rng(seed: number) {
  let a = seed >>> 0 || 1;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Persona = { name: string; trueB: number; trueG: number; perDay: number; studyDays: (day: number) => boolean; slip: number };
const personas: Persona[] = [
  { name: "초급·매일 20", trueB: 300, trueG: 1, perDay: 20, studyDays: () => true, slip: 0.05 },
  { name: "중급·매일 20", trueB: 1500, trueG: 2.5, perDay: 20, studyDays: () => true, slip: 0.05 },
  { name: "고급·매일 30", trueB: 4000, trueG: 4, perDay: 30, studyDays: () => true, slip: 0.05 },
  { name: "중급·주 3일 10", trueB: 1500, trueG: 2.5, perDay: 10, studyDays: (d) => d % 7 === 0 || d % 7 === 2 || d % 7 === 4, slip: 0.05 },
  { name: "중급·몰아서(5일 50 후 쉼)", trueB: 1500, trueG: 2.5, perDay: 50, studyDays: (d) => d < 5 || (d >= 20 && d < 23), slip: 0.08 },
];

function run(p: Persona, seed: number) {
  const random = rng(seed);
  const ledger: LogEvent[] = [];
  // 배움: 열쇠마다 더해진 아는 몫과 마지막으로 본 날.
  const boost = new Map<string, { add: number; day: number }>();
  const baseKnow = (key: string, rank: number | null, stage: number) =>
    rank !== null ? knowChance({ b: p.trueB, n: 0 }, rank) : 1 / (1 + Math.exp((stage - 0.5 - p.trueG) / 0.4));
  const knowNow = (key: string, rank: number | null, stage: number, day: number) => {
    const base = baseKnow(key, rank, stage);
    const b = boost.get(key);
    if (!b) return base;
    const kept = b.add * Math.pow(0.5, (day - b.day) / 10); // 10일 반감 잊음
    return Math.min(0.98, base + (1 - base) * kept);
  };
  // 앱 쪽: 첫 측정이 낱말 경계를 어림(참의 0.7~1.3배), 그 뒤 퀴즈 답으로 noteLevel.
  let level: Level = { b: p.trueB * (0.7 + 0.6 * random()), n: PROBE, picked: true };
  // 첫 측정 결과(fill.ts placed): 경계 어림 + 문법·표현 시작 단계(참 단계 반올림 ±1).
  const placed = { at: T0 * 1000, letters: false, b: level.b, grammar: Math.max(1, Math.min(5, Math.round(p.trueG + (random() - 0.5)))), expression: Math.max(1, Math.min(5, Math.round(p.trueG + (random() - 0.5)))) };
  const seenRank = new Set<number>();
  const rows: { day: number; sure: number; read: number; use: number; n: number; fresh: number; again: number; known: number; hard: number; bAt: number }[] = [];
  for (let day = 0; day < DAYS; day += 1) {
    const dayStart = T0 + day * D + 9 * 3600;
    let fresh = 0;
    let again = 0;
    if (p.studyDays(day)) {
      const states = checkStates(ledger);
      // 앱과 같은 다시 볼 것(todayCards.ts reviewKeys — 확인 때·막힌 것·적용이 힘듦·틀린 새 것).
      const reviewPool = reviewKeys({ events: ledger, states, now: dayStart, today: (t) => dayOfSeconds(t, 0) });
      for (let i = 0; i < p.perDay; i += 1) {
        const t = dayStart + i * 40;
        let key: string;
        let rank: number | null = null;
        let stage = 1;
        const wantReview = reviewPool.length && i % 2 === 1;
        if (wantReview) {
          key = reviewPool.splice(Math.floor(random() * reviewPool.length), 1)[0]!;
          if (key.startsWith("w|")) rank = words.findIndex((w) => `w|${w.w}` === key);
          else stage = catalog.sent.get(key)?.stage ?? 1;
          again += 1;
        } else if (i % 5 === 4 && grammar.length) {
          // 문법 하나: 지금 단계 어림(참 단계 근처)에서 아직 안 본 것.
          const g = grammar.find((one) => one.stage <= Math.max(1, Math.round(p.trueG)) + 1 && !boost.has(one.key)) ?? grammar[0]!;
          key = g.key;
          stage = g.stage;
          fresh += 1;
        } else {
          // 새 낱말: 경계 바로 위(앱 pickLevelWords처럼 b ~ b+15%).
          let r = Math.min(words.length - 300, Math.round(level.b + level.b * 0.15 * random()));
          while (seenRank.has(r) && r < words.length - 1) r += 1;
          seenRank.add(r);
          rank = r;
          key = `w|${words[r]!.w}`;
          fresh += 1;
        }
        const prior = ledger.some((e) => e.k === key && e.r !== "look");
        const write = prior; // 처음은 고르기, 다시는 쓰기(개편 cardQuiz와 같음)
        const p0 = knowNow(key, rank, stage, day);
        const know = random() < p0 * (1 - p.slip);
        const correct = write ? know : know || random() < 1 / 3;
        ledger.push({ k: key, src: "quiz", r: correct ? "ok" : "miss", m: write ? "write" : "pick", t });
        // 배움: 풀어 보면(특히 틀리고 정답을 보면) 아는 몫이 오름.
        const b = boost.get(key);
        const cur = b ? b.add * Math.pow(0.5, (day - b.day) / 10) : 0;
        boost.set(key, { add: Math.min(0.9, cur + (correct ? 0.35 : 0.5) * (1 - cur)), day });
        if (rank !== null && !write) level = (OLD ? noteLevel : noteLevelBatch)(level, rank, correct, { choose: true, total: words.length, fresh: true });
      }
    }
    const end = (T0 + (day + 1) * D) * 1000;
    const events = ledgerFillEvents({ ledger, results: [], items: [], language, segment: (s) => s.split(" ") });
    const fill = computeFill({ catalog, check: null, stage: Math.max(1, Math.round(p.trueG)), placed: NO_PLACED ? null : placed, events, calls: [], now: end });
    const own = checkStates(ledger);
    let known = 0;
    let hard = 0;
    for (const s of own.values()) {
      if (s.level === "known") known += 1;
      else if (s.level === "hard") hard += 1;
    }
    rows.push({ day, sure: sureOf(fill), read: fill.axes.vocabRead.fill, use: fill.axes.vocabUse.fill, n: ledger.length, fresh, again, known, hard, bAt: level.b });
  }
  if (OLD) return { rows, micro: 0 };
  // 하루 판정: 마지막 날 다음 날 기준 사슬 하나로 날마다 그날 끝 값.
  const events = ledgerFillEvents({ ledger, results: [], items: [], language, segment: (s) => s.split(" ") });
  const input = { catalog, check: null, stage: Math.max(1, Math.round(p.trueG)), placed: NO_PLACED ? null : placed, events, calls: [], now: (T0 + DAYS * D) * 1000 + 1 };
  const chain = fillChain(input, utcStart);
  for (const r of rows) {
    const v = judgedAt(chain, (T0 + (r.day + 1) * D) * 1000);
    r.sure = BANK_AXES.reduce((a, axis) => a + v[axis], 0) / BANK_AXES.length;
    r.read = v.vocabRead;
    r.use = v.vocabUse;
  }
  // 답 하나가 화면을 움직이는 몫(어느 공부한 날 한가운데, 답 하나 앞뒤).
  let micro = 0;
  const studied = rows.filter((r) => r.fresh + r.again > 0);
  for (const r of studied.slice(0, 8)) {
    const mid = (T0 + r.day * D + 9 * 3600 + 10 * 40) * 1000;
    const a = sureOf(fillAt(chain, { ...input, now: mid + 1 }, mid - 40_000 + 1, utcStart));
    const b = sureOf(fillAt(chain, { ...input, now: mid + 1 }, mid + 1, utcStart));
    micro = Math.max(micro, Math.abs(b - a));
  }
  return { rows, micro };
}

const pct = (v: number) => (100 * v).toFixed(1).padStart(5);
console.log(OLD ? "예전(답마다)" : "새(낱말 10개 묶음 · 하루 판정 ±2%p · 답 하나 미세)");
for (const p of personas) {
  const { rows, micro } = run(p, 7);
  const diffs = rows.slice(1).map((r, i) => r.sure - rows[i]!.sure);
  const up = Math.max(...diffs);
  const down = Math.min(...diffs);
  const drops = diffs.filter((d) => d < -0.001).length;
  console.log(`\n■ ${p.name} (참 경계 ${p.trueB}, 문법 ${p.trueG}단계)`);
  console.log("  일 | 새로 다시 | 확인된실력 | 어휘이해 어휘활용 | 앎 힘듦 | 낱말 경계");
  for (const r of rows) if (r.day % 3 === 0 || r.day === DAYS - 1 || r.day < 3) console.log(`  ${String(r.day + 1).padStart(2)} | ${String(r.fresh).padStart(3)} ${String(r.again).padStart(3)} | ${pct(r.sure)}% | ${pct(r.read)}% ${pct(r.use)}% | ${String(r.known).padStart(3)} ${String(r.hard).padStart(3)} | ${Math.round(r.bAt)}`);
  if (!OLD) console.log(`  답 하나가 움직이는 몫(최대): ${(100 * micro).toFixed(3)}%p`);
  console.log(`  하루 변화: 최대 오름 ${pct(up)}%p · 최대 내림 ${pct(down)}%p · 내린 날 ${drops}일`);
  // 씨앗 여럿: 하루 변화 최대값 분포.
  const more = [11, 23, 37, 51].map((seed) => run(p, seed).rows);
  const ups = more.map((r) => Math.max(...r.slice(1).map((x, i) => x.sure - r[i]!.sure)));
  const downs = more.map((r) => Math.min(...r.slice(1).map((x, i) => x.sure - r[i]!.sure)));
  const ends = more.map((r) => r[r.length - 1]!.sure);
  console.log(`  씨앗 4개 더: 최대 오름 ${ups.map(pct).join(",")}%p · 최대 내림 ${downs.map(pct).join(",")}%p · 30일째 ${ends.map(pct).join(",")}%`);
}
