import assert from "node:assert/strict";
import test from "node:test";
import type { LogEvent } from "../curriculum/logLedger.ts";
import { recentLearned } from "./recentLearned.ts";

const day = 24 * 60 * 60;
const quiz = (k: string, r: LogEvent["r"], t: number): LogEvent => ({ k, src: "quiz", r, t });

test("요즘 배운 것: 최근 7일 퀴즈의 낱말·표현, 틀린 것 먼저 — ja(띄어쓰기 없음)·es(라틴)", () => {
  const now = 100 * day;
  const events: LogEvent[] = [
    quiz("w|食べる", "ok", now - day),
    quiz("w|駅", "miss", now - 2 * day),
    quiz("e|お願いします", "ok", now - 3 * day),
    quiz("g|1:2", "miss", now - day),
    quiz("w|古い", "ok", now - 9 * day),
    { k: "w|水", src: "call", r: "used", t: now - day },
  ];
  assert.deepEqual(recentLearned(events, now), ["駅", "食べる", "お願いします"]);
  const es = [quiz("w|casa", "ok", now - 1), quiz("w|perro", "ok", now - 2), quiz("e|por favor", "miss", now - 3)];
  assert.deepEqual(recentLearned(es, now, 2), ["por favor", "casa"]);
  assert.deepEqual(recentLearned([], now), []);
});
