/**
 * 넓어지는 원(src/lib/curriculum/circle.ts) 가상 학습자 시뮬레이션 — 숫자(복습 날·틀린 것 한도)를 바꿀 때 먼저 돌린다.
 *   node --experimental-strip-types scripts/quiz-circle-sim.ts [days=14] [perDay=40]
 * 학습자 셋: 이미 많이 아는 사람(앞 1,000개 대부분 앎) · 처음 배우는 사람 · 잘 잊는 사람.
 * 낱말마다 "기억 세기" — 처음엔 순위에 따라, 틀린 뒤 답을 보면 오르고, 맞히면 더 오르고, 날마다 조금씩 잊는다.
 * 탭은 처음 보는 낱말만, 단어 시험(틀린 것 + 맞힌 것)은 때가 되면 바로 본다고 침.
 * 보는 것: 날마다 탭 정답률, 탭에서 이미 본 낱말이 다시 나온 수(0이어야), 단어 시험 횟수·정답률, 익힘·틀림.
 */
import { emptyCircle, growCircle, noteAnswer, noteTest, pickCircle, circleView, wordTest, wordTestDue, type Circle } from "../src/lib/curriculum/circle.ts";

const days = Number(process.argv[2] ?? 14);
const perDay = Number(process.argv[3] ?? 40);
const BUNDLE = 4;
const DAY = 24 * 60 * 60 * 1000;
const order = Array.from({ length: 700 }, (_, i) => `w|word${i}`);

type Learner = { name: string; prior: (rank: number) => number; learn: number; forget: number };
const learners: Learner[] = [
  { name: "많이 앎", prior: (rank) => (rank < 400 ? 0.92 : rank < 600 ? 0.6 : 0.2), learn: 0.35, forget: 0.03 },
  { name: "처음", prior: () => 0.05, learn: 0.3, forget: 0.04 },
  { name: "잘 잊음", prior: () => 0.1, learn: 0.2, forget: 0.1 },
];

let seed = 7;
const random = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);

for (const learner of learners) {
  seed = 7;
  const memory = new Map<string, number>();
  order.forEach((key, rank) => memory.set(key, learner.prior(rank)));
  let circle: Circle = emptyCircle();
  let now = Date.UTC(2026, 10, 1, 9);
  const rows: string[] = [];
  for (let day = 1; day <= days; day += 1) {
    let right = 0;
    let asked = 0;
    let last = new Set<string>();
    const rightToday = new Set<string>();
    let repeat = 0;
    let tests = 0;
    let testRight = 0;
    let testAsked = 0;
    const dayName = `d${day}`;
    while (asked < perDay) {
      if (wordTestDue(circle, { now, today: dayName, usable: () => true })) {
        tests += 1;
        for (const key of wordTest(circle, { now, usable: () => true })) {
          const p = memory.get(key)!;
          const correct = random() < p;
          memory.set(key, Math.min(0.98, p + (correct ? learner.learn * 0.6 : learner.learn) * (1 - p)));
          circle = noteAnswer(circle, key, correct, now);
          testRight += correct ? 1 : 0;
          testAsked += 1;
          now += 20 * 1000;
        }
        circle = noteTest(circle, dayName, now);
      }
      const keys = pickCircle(circle, order, { n: BUNDLE, now, usable: () => true, known: () => false, skip: last });
      if (!keys.length) break;
      for (const key of keys) {
        const p = memory.get(key)!;
        const correct = random() < p;
        if (rightToday.has(key)) repeat += 1;
        rightToday.add(key);
        memory.set(key, Math.min(0.98, p + (correct ? learner.learn * 0.6 : learner.learn) * (1 - p)));
        circle = noteAnswer(circle, key, correct, now);
        circle = growCircle(circle, order, () => false);
        right += correct ? 1 : 0;
        asked += 1;
        now += 20 * 1000;
      }
      last = new Set(keys);
    }
    const view = circleView(circle, order, () => false);
    rows.push(`${String(day).padStart(2)}일  ${String(asked).padStart(3)}문제  탭 정답률 ${String(Math.round((right / Math.max(1, asked)) * 100)).padStart(3)}%  본 낱말 다시 ${repeat}  시험 ${tests}번 ${testAsked ? Math.round((testRight / testAsked) * 100) : 0}%  원 ${String(circle.size).padStart(3)}  익힘 ${view.counts.known} · 틀림 ${view.counts.learning}`);
    // 하룻밤: 잊기.
    for (const [key, p] of memory) memory.set(key, Math.max(0.02, p * (1 - learner.forget)));
    now += DAY - perDay * 20 * 1000;
  }
  console.log(`\n# ${learner.name}`);
  console.log(rows.join("\n"));
}
