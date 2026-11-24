// 1년 퀴즈 흐름 시뮬레이션(사용자 2026-11-24 "문제풀이 1년치를 가정하고 학습 흐름이 어떻게 되는지") — 실제 ladder.ts·preparedQuiz.ts·vocabLevel.ts 함수에
// 가짜 학습자(문법 실력 L·참 낱말 경계 V, 칸마다 연습으로 조금씩 오름)와 가짜 시계(하루 3묶음·주 6일)를 붙여 단계·회차·종류별 문제 수를 본다.
// 문제은행 문법 문장은 회차마다 칸마다 하나씩 있다고 어림(실제는 서버가 칸마다 넷씩 만들고 판정에서 일부 떨어짐). 숫자는 어림, 흐름의 모양을 본다.
//   node --experimental-strip-types scripts/sim/quiz-year.mts <언어> <low|mid|high> [new|old]   (old = 단계 올리기·회차 없이)
import fs from "node:fs";
import { kindShares, kindCounts, missRates, recentRuns, stepReach, stepLadder, rightToday, rungOf, DONE, axisOf, climbCleared, nextRound, noteRoundUsed, type Reach, type QuizRound } from "../../src/lib/curriculum/ladder.ts";
import { pickPrepared, type PreparedItem } from "../../src/lib/curriculum/preparedQuiz.ts";
import { noteLevelBatch, startLevel, knowChance, type Level } from "../../src/lib/curriculum/vocabLevel.ts";
import { stageCuts, stageOfRank } from "../../src/lib/curriculum/vocabBank.ts";
import { ladderFor } from "../../src/lib/curriculum/stages/index.ts";

const [lang = "en", who = "mid", mode = "new"] = process.argv.slice(2);
const NEW = mode === "new";
let round: QuizRound = { r: 1, used: {} };
const lines = (key: string) => [key + "#0", ...Array.from({ length: 4 * 3 }, (_, i) => `${key}#${i + 1}`)]; // 넣어 둔 1 + 문제은행이 회차마다 넷씩(어림)
const dir = "src/lib/curriculum/problems/";
const stageOf = new Map<string, number>();
for (const s of ladderFor(lang)?.stages ?? []) for (const t of s.expressions) stageOf.set(`e|${t}`, s.order);
const items: PreparedItem[] = [];
for (const f of fs.readdirSync(dir).filter((f) => (f.startsWith(lang + "-") || f === lang + ".json") && !f.includes("gv"))) {
  for (const [key, r] of Object.entries<any>(JSON.parse(fs.readFileSync(dir + f, "utf8")))) {
    if (!r.gloss || !r.answer || !r.line || !r.why || !r.options?.length || (r.kind !== "grammar" && r.kind !== "expression")) continue;
    const stage = r.kind === "grammar" ? Number(key.split("|")[1]?.split(":")[0]) : stageOf.get(key);
    if (stage) items.push({ key, kind: r.kind, stage, gloss: r.gloss, before: "", after: "", answer: r.answer, options: r.options, line: r.line, why: r.why });
  }
}
const hasExpr = items.some((i) => i.kind === "expression");
// 학습자: 문법 실력 L(단계 눈금), 참 낱말 경계 V(순위), 첫 측정 단계 base.
const P = { low: { L: 1.3, V: 500, base: 1, grow: 0.004 }, mid: { L: 3.2, V: 2500, base: 1, grow: 0.003 }, high: { L: 4.8, V: 5000, base: 3, grow: 0.002 } }[who as "mid"];
const cuts = stageCuts(lang);
let L = P.L, V = P.V;
let level: Level = startLevel(P.base, cuts);
let reach: Reach = { s: P.base, n: 0, ok: 0 };
let ladder: Record<string, number> = {};
const skill = new Map<string, number>(); // 칸마다 연습으로 오른 몫
const ledger: { k: string; src: string; r: string; t: number }[] = [];
const seenW = new Set<string>();
const rnd = (() => { let s = 7; return () => ((s = (s * 1103515245 + 12345) % 2 ** 31) / 2 ** 31); })();
const sig = (x: number) => 1 / (1 + Math.exp(-x));
const rungHard = [0, 0, 0.4, 0.7, 1.0];
const log: string[] = [];
let t = 1_800_000_000;
let gramAsked = 0, exprAsked = 0, wordAsked = 0, outDay = -1;
const perStage: Record<number, number> = {};
for (let day = 0; day < 365; day++) {
  const rest = day % 7 === 6; // 일주일에 하루 쉼
  if (!rest) for (let batch = 0; batch < 3; batch++) {
    const now = t + day * 86400 + batch * 1800;
    const counts = kindCounts(7, kindShares(P.base, missRates(ledger, now), recentRuns(ledger, now)));
    const today = rightToday(ledger, now);
    const lastAt = new Map<string, number>(); for (const e of ledger) lastAt.set(e.k, e.t);
    const skip = new Set(items.map((i) => i.key).filter((k) => rungOf(ladder, k) >= DONE || today.has(k)));
    if (NEW) {
      const opened = nextRound(items.filter((i) => i.kind === "grammar").map((i) => i.key), ladder, round, (k) => lines(k).some((l) => !(round.used[k] ?? []).includes(l)));
      if (opened) { ladder = opened.ladder; round = opened.round; reach = { s: P.base, n: 0, ok: 0 }; log.push(`    ${day + 1}일째 ${round.r}회차 시작`); }
      const axis = axisOf(items.filter((i) => i.kind === "grammar").map((i) => i.key), ladder);
      if (axis && round.a !== axis) { round = { ...round, a: axis }; reach = { s: P.base, n: 0, ok: 0 }; }
      reach = axis ? climbCleared(reach, P.base, (s) => items.some((i) => i.kind === "grammar" && i.stage === s && rungOf(ladder, i.key) === axis)) : reach;
      for (const i of items) if (i.kind === "grammar" && rungOf(ladder, i.key) !== axis) skip.add(i.key);
    }
    const head = pickPrepared(items, { stage: reach.s, grammar: counts.g, expression: hasExpr ? counts.e : 0, skip, lastAt: (k) => lastAt.get(k) ?? 0 });
    if (!head.some((i) => i.kind === "grammar") && outDay < 0 && items.filter((i) => i.kind === "grammar").every((i) => skip.has(i.key) && rungOf(ladder, i.key) >= DONE)) outDay = day;
    for (const it of head) {
      const rung = Math.max(1, rungOf(ladder, it.key));
      const own = Math.min(1.2, skill.get(it.key) ?? 0);
      const guess = rung === 1 ? 1 / 3 : 0;
      const p = guess + (1 - guess) * sig(2 * (L + own - it.stage + 0.5 - rungHard[rung]!));
      const ok = rnd() < p;
      const seen = ledger.some((e) => e.k === it.key);
      const was = rungOf(ladder, it.key);
      ladder = stepLadder(ladder, it.key, rung, ok);
      if (rungOf(ladder, it.key) === 3 && it.kind === "expression") ladder = { ...ladder, [it.key]: DONE };
      if (was < DONE && rungOf(ladder, it.key) >= DONE) { const fresh = lines(it.key).find((l) => !(round.used[it.key] ?? []).includes(l)); if (fresh) round = noteRoundUsed(round, it.key, [fresh]); }
      reach = stepReach(reach, P.base, it.stage, ok);
      skill.set(it.key, own + 0.35);
      ledger.push({ k: it.key, src: "quiz", r: ok ? "ok" : "miss", t: now });
      if (it.kind === "grammar") { gramAsked++; perStage[it.stage] = (perStage[it.stage] ?? 0) + 1; } else exprAsked++;
    }
    // 낱말: 경계 근처 새 낱말(대략 b ~ b+band 순위)
    for (let i = 0; i < Math.max(0, counts.w - 1) + (hasExpr ? 0 : counts.e); i++) {
      let rank = Math.max(0, Math.round(level.b + (rnd() - 0.3) * Math.max(60, level.b * 0.3)));
      while (seenW.has(`w|${rank}`)) rank += 1;
      const k = `w|${rank}`; seenW.add(k);
      const ok = rnd() < 1 / 3 + (2 / 3) * knowChance({ b: V, n: 99 }, Math.max(0, rank));
      level = noteLevelBatch(level, Math.max(0, rank), ok, { choose: true, total: 20000, fresh: true });
      ledger.push({ k: `w|x${rank}`, src: "quiz", r: ok ? "ok" : "miss", t: now });
      wordAsked++;
    }
  }
  L += P.grow; V *= 1.001;
  if ([6, 13, 29, 59, 89, 179, 364].includes(day)) {
    const g = items.filter((i) => i.kind === "grammar"); const e = items.filter((i) => i.kind === "expression");
    const doneG = g.filter((i) => rungOf(ladder, i.key) >= DONE).length; const doneE = e.filter((i) => rungOf(ladder, i.key) >= DONE).length;
    log.push(`${String(day + 1).padStart(3)}일 | ${round.r}회차 문법 단계 ${reach.s} | 문법 끝낸 칸 ${doneG}/${g.length}${e.length ? ` · 표현 ${doneE}/${e.length}` : ""} | 낱말 경계 ${Math.round(level.b)}위(${stageOfRank(lang, Math.round(level.b))}단계, 참 ${Math.round(V)}) | 누적 문법 ${gramAsked}·표현 ${exprAsked}·낱말 ${wordAsked}`);
  }
}
console.log(`${lang} ${who} (첫 측정 ${P.base}단계, 하루 3묶음·주 6일)`); console.log(log.join("\n"));
console.log(`문법 칸이 다 끝난 날: ${outDay < 0 ? "1년 안에 안 끝남" : outDay + 1 + "일째"} · 단계별 문법 문제 수 ${JSON.stringify(perStage)}`);
