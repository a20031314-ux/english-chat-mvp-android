import assert from "node:assert/strict";
import test from "node:test";
import {
  LIFE_KEEP_DAYS,
  LIFE_MAX,
  LIFE_ONCE_DAYS,
  followUpFact,
  lifeFactsPrompt,
  markLifeAsked,
  mergeLifeFacts,
  readLifeFacts,
  type LifeFact,
} from "./lifeFacts.ts";

const DAY = 86_400_000;

function store() {
  const data = new Map<string, string>();
  return { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => void data.set(key, value) };
}

test("같은 통화에서 두 번 적어도 한 번으로 남고, 다음 통화면 횟수가 는다", () => {
  const box = store();
  const now = Date.now();
  mergeLifeFacts("en", ["They went to the gym."], now, "call-1", box);
  mergeLifeFacts("en", ["They went to the gym."], now + 1000, "call-1", box);
  const once = readLifeFacts("en", box);
  assert.equal(once.length, 1);
  assert.equal(once[0]?.n, 1);
  mergeLifeFacts("en", ["they went to the gym"], now + DAY, "call-2", box);
  const twice = readLifeFacts("en", box);
  assert.equal(twice[0]?.n, 2);
  assert.equal(twice[0]?.calls.length, 2);
});

test("한 번뿐인 오래된 일은 지시에서 빠지고, 다시 들은 일은 더 오래 남는다", () => {
  const now = Date.UTC(2026, 10, 4, 3, 0, 0);
  const facts: LifeFact[] = [
    { text: "They went to the gym.", at: now - (LIFE_ONCE_DAYS + 1) * DAY, n: 1, calls: ["a"] },
    { text: "They work at a cafe.", at: now - (LIFE_ONCE_DAYS + 1) * DAY, n: 2, calls: ["a", "b"] },
    { text: "They live in Busan.", at: now - (LIFE_KEEP_DAYS + 1) * DAY, n: 4, calls: ["a"] },
  ];
  const prompt = lifeFactsPrompt(facts, now);
  assert.match(prompt, /Today is /);
  assert.doesNotMatch(prompt, /gym/);
  assert.match(prompt, /cafe/);
  assert.doesNotMatch(prompt, /Busan/);
});

test("상한을 넘으면 한 번만 들은 오래된 일부터 빠진다", () => {
  const box = store();
  const now = Date.now();
  for (let i = 0; i < LIFE_MAX; i += 1) {
    mergeLifeFacts("ja", [`Fact ${i}`], now + i, `call-${i}`, box);
  }
  mergeLifeFacts("ja", ["Fact 0"], now + LIFE_MAX, "again", box);
  mergeLifeFacts("ja", ["The newest fact."], now + LIFE_MAX + 1, "extra", box);
  const kept = readLifeFacts("ja", box);
  assert.equal(kept.length, LIFE_MAX);
  assert.ok(kept.some((fact) => fact.text === "Fact 0"));
  assert.ok(kept.some((fact) => fact.text === "The newest fact."));
  assert.equal(kept.some((fact) => fact.text === "Fact 1"), false);
});

test("이어 물은 기억은 쉰다 — 같은 날 다음 통화가 '오늘도 카페 갔어?'를 또 묻지 않게(사용자 2026-11-28)", () => {
  const box = store();
  const day0 = Date.parse("2026-11-20T09:00:00");
  mergeLifeFacts("en", ["about: They work at a café.", "habit: Ella va al gimnasio cada mañana."], day0, "call-1", box);
  const hello = [{ who: "tutor" }];
  const today = Date.parse("2026-11-28T08:00:00");
  const first = followUpFact(lifeFactsPrompt(readLifeFacts("en", box), today), hello);
  assert.match(first ?? "", /gimnasio/, "습관이 먼저");
  markLifeAsked("en", first!, today, box);
  const prompt = lifeFactsPrompt(readLifeFacts("en", box), today + 3_600_000);
  assert.match(prompt, /gimnasio.*\[asked 2026-11-28\]/);
  const second = followUpFact(prompt, hello);
  assert.match(second ?? "", /café/, "물은 습관은 쉬고 다음 것");
  markLifeAsked("en", second!, today + 3_600_000, box);
  assert.equal(followUpFact(lifeFactsPrompt(readLifeFacts("en", box), today + 7_200_000), hello), null, "둘 다 물었으면 그날은 없음");
  // 습관은 7일 뒤, 그 밖은 14일 뒤 다시
  assert.match(followUpFact(lifeFactsPrompt(readLifeFacts("en", box), today + 8 * DAY), hello) ?? "", /gimnasio/);
  assert.equal(followUpFact(lifeFactsPrompt(readLifeFacts("en", box), today + 8 * DAY), hello)?.includes("café"), false);
});

test("날 지난 예정은 그 날 뒤에 한 번 물었으면 끝", () => {
  const prior = "Today is 2026-11-27.\n2026-11-20: plan 2026-11-24: 月曜日に試験がある。 [asked 2026-11-25]";
  assert.equal(followUpFact(prior, [{ who: "tutor" }]), null);
  assert.ok(followUpFact(prior.replace(" [asked 2026-11-25]", ""), [{ who: "tutor" }]));
});
