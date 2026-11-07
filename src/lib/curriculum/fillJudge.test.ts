import { test } from "node:test";
import assert from "node:assert/strict";
import { BANK_AXES, computeFill, fillCatalog, type FillEvent } from "./fill.ts";
import { DAY_STEP, fillAt, fillChain, judgeFill, MICRO_MAX } from "./fillJudge.ts";
import { loadBank } from "./vocabBank.ts";

const DAY = 86_400_000;
const utcStart = (ms: number) => Math.floor(ms / DAY) * DAY;

/** 날마다 1단계 낱말 30개(다섯에 넷 맞힘)를 이어서 푼 사람. */
async function learner(language: string, days: number) {
  const catalog = fillCatalog(language, await loadBank(language));
  const words = [...catalog.vocab.values()].filter((item) => item.key.startsWith("w|")).slice(0, days * 30);
  const t0 = Date.UTC(2026, 9, 1, 10);
  const events: FillEvent[] = words.map((item, i) => ({ at: t0 + Math.floor(i / 30) * DAY + (i % 30) * 60_000, key: item.key, correct: i % 5 !== 0, source: "quiz", use: false, choose: false }));
  return { catalog, events, t0 };
}

test("하루 판정: 공부한 날마다 꼭짓점당 ±2%p까지, 오늘 답은 미세 몫(±2%p) (es·ja)", async () => {
  for (const language of ["es", "ja"]) {
    const { catalog, events, t0 } = await learner(language, 6);
    const now = t0 + 5 * DAY + 3 * 3_600_000; // 엿새째 오후(그날 답 일부)
    const input = { catalog, check: null, stage: 1, events: events.filter((e) => e.at < now), calls: [], now };
    const chain = fillChain(input, utcStart);
    assert.equal(chain.days.length, 5, language);
    let prev = chain.prior;
    for (const day of chain.days) {
      for (const axis of BANK_AXES) assert.ok(Math.abs(day.value[axis] - prev[axis]) <= DAY_STEP + 1e-9, `${language} ${axis}`);
      prev = day.value;
    }
    const shown = judgeFill(computeFill(input), chain, input, utcStart);
    const raw = computeFill(input);
    for (const axis of BANK_AXES) assert.ok(Math.abs(shown.axes[axis].fill - prev[axis]) <= MICRO_MAX + 1e-9, `${language} ${axis} 미세`);
    // 판정은 오름(맞힘 80%), 하지만 raw보다 느리게.
    assert.ok(shown.axes.vocabRead.fill > 0, language);
    assert.ok(shown.axes.vocabRead.fill <= raw.axes.vocabRead.fill + 1e-9, `${language} ${shown.axes.vocabRead.fill} ${raw.axes.vocabRead.fill}`);
  }
});

test("답 하나는 화면 숫자를 거의 안 움직임(0.1%p 아래), 같은 날 안에선 그날 끝까지 판정 그대로 (es)", async () => {
  const { catalog, events, t0 } = await learner("es", 3);
  const now = t0 + 2 * DAY + 20 * 60_000;
  const input = { catalog, check: null, stage: 1, events: events.filter((e) => e.at < now), calls: [], now };
  const chain = fillChain(input, utcStart);
  const a = fillAt(chain, input, now - 60_000, utcStart).axes.vocabRead.fill;
  const b = fillAt(chain, input, now, utcStart).axes.vocabRead.fill;
  assert.ok(Math.abs(b - a) < 0.001, `${a} ${b}`);
  assert.ok(b - a >= 0, "맞힌 답은 조금이라도 올림");
});
