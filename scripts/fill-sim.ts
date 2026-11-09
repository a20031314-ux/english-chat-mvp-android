/**
 * 채우기 수렴 시뮬레이션(hub/work/drafts/fill-gauge-2026-11-02.md 8절 2): 참 실력 × 처음 체크(맞게·틀리게) → 몇 문제 만에 참 실력 ±5%p에 닿는지,
 * 범위가 참 실력을 덮는지. 문제는 앱처럼 지금 어림 근처 위주(어림 −0.15 ~ +0.15에서 70%, 그 아래에서 30%), 고르기와 쓰기 반반.
 *
 *   node --experimental-strip-types scripts/fill-sim.ts [언어=es] [씨앗 수=20]
 *
 * 참 실력의 사람은 fill.ts와 다른 흐림(0.1)과 실수 5%·안다고 찍기로 답한다 — 모델이 자기 가정만 맞히지 않게.
 */
import { computeFill, fillCatalog, thetaForFill, type FillEvent } from "../src/lib/curriculum/fill.ts";
import { loadBank } from "../src/lib/curriculum/vocabBank.ts";

const language = process.argv[2] ?? "es";
const seeds = Number(process.argv[3] ?? 20);
const NOW = Date.UTC(2026, 10, 2);
const CHECKPOINTS = [10, 20, 40, 80, 160];
const TRUE_FILLS = [0.05, 0.2, 0.4, 0.67, 0.9];

const catalog = fillCatalog(language, await loadBank(language));
const items = [...catalog.vocab.values()].sort((a, b) => a.d - b.d);

function rng(seed: number) {
  let s = seed * 2654435761 % 2147483648;
  return () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
}

function pickNear(rand: () => number, center: number): (typeof items)[number] {
  const near = rand() < 0.7;
  const lo = near ? Math.max(0, center - 0.15) : 0;
  const hi = near ? Math.min(1, center + 0.15) : Math.max(0.05, center);
  const target = lo + rand() * (hi - lo);
  let a = 0;
  let b = items.length - 1;
  while (a < b) {
    const m = (a + b) >> 1;
    if (items[m]!.d < target) a = m + 1;
    else b = m;
  }
  return items[a]!;
}

type Row = { trueFill: number; check: number; at: number[]; err: number[]; covered: number[] };
const rows: Row[] = [];
for (const trueFill of TRUE_FILLS) {
  // 초급·중급·고급 체크는 2026-11-07에 없앰 — 시작 단계(1·2·4) 어림으로 본다.
  for (const check of [1, 2, 4]) {
    const err = CHECKPOINTS.map(() => 0);
    const covered = CHECKPOINTS.map(() => 0);
    const reached: number[] = [];
    for (let seed = 1; seed <= seeds; seed += 1) {
      const rand = rng(seed + Math.round(trueFill * 1000));
      const theta = thetaForFill(trueFill, 0.1);
      const events: FillEvent[] = [];
      let estimate = computeFill({ catalog, check: null, stage: check, events, calls: [], now: NOW }).axes.vocabRead.fill;
      let hit = -1;
      for (let i = 1; i <= CHECKPOINTS.at(-1)!; i += 1) {
        const item = pickNear(rand, estimate);
        const choose = rand() < 0.5;
        const knows = rand() < 1 / (1 + Math.exp((item.d - theta) / 0.1));
        const slip = rand() < 0.05;
        const correct = (knows && !slip) || (!knows && choose && rand() < 1 / 3);
        events.push({ at: NOW - (200 - i) * 60_000, key: item.key, correct, source: "quiz", use: false, choose });
        if (i % 5 === 0 || CHECKPOINTS.includes(i)) {
          const axis = computeFill({ catalog, check: null, stage: check, events, calls: [], now: NOW }).axes.vocabRead;
          estimate = axis.fill;
          if (hit < 0 && Math.abs(axis.fill - trueFill) <= 0.05) hit = i;
          const at = CHECKPOINTS.indexOf(i);
          if (at >= 0) {
            err[at] += Math.abs(axis.fill - trueFill) / seeds;
            covered[at] += (axis.low - 0.02 <= trueFill && trueFill <= axis.high + 0.02 ? 1 : 0) / seeds;
          }
        }
      }
      reached.push(hit < 0 ? Infinity : hit);
    }
    reached.sort((a, b) => a - b);
    rows.push({ trueFill, check, at: [reached[Math.floor(seeds / 2)]!, reached[Math.floor(seeds * 0.9) - 1]!], err, covered });
  }
}

console.log(`채우기 시뮬레이션 — ${language}, 어휘 이해, 씨앗 ${seeds}개`);
console.log(`참 실력 | 시작 단계 | ±5%p 닿은 문제 수(가운데 · 90%) | 평균 오차 ${CHECKPOINTS.join("/")}문제 | 범위가 참값을 덮음`);
for (const row of rows) {
  const fmt = (n: number) => (Number.isFinite(n) ? String(n) : ">160");
  console.log(`${Math.round(row.trueFill * 100)}% | ${row.check} | ${fmt(row.at[0]!)} · ${fmt(row.at[1]!)} | ${row.err.map((e) => (e * 100).toFixed(1)).join(" / ")} | ${row.covered.map((c) => Math.round(c * 100) + "%").join(" / ")}`);
}
