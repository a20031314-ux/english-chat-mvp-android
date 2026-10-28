import { test } from "node:test";
import assert from "node:assert/strict";
import { allMisses, missedLines, noteLine } from "./scriptMisses.ts";
import { weakSpots, wordsToShow } from "./weakSpots.ts";
import { morningDays } from "./morningDigest.ts";
import { reuseTargets, unchanged, usedTargets } from "./reuse.ts";
import { allScriptsFor } from "./stageScripts.ts";
import { allFramesFor } from "./frames.ts";

function memory() {
  const map = new Map<string, string>();
  return { getItem: (k: string) => map.get(k) ?? null, setItem: (k: string, v: string) => void map.set(k, v) };
}

const NOW = Date.UTC(2026, 9, 28, 9);
const DAY = 24 * 60 * 60 * 1000;

test("대본 틀린 줄: 틀리면 횟수, 맞히면 지움, 언어별", () => {
  const store = memory();
  assert.equal(noteLine("th", "th-1-1", 3, true, NOW, store), 1);
  assert.equal(noteLine("th", "th-1-1", 3, true, NOW + 1, store), 2);
  noteLine("es", "es-1-1", 1, true, NOW, store);
  assert.deepEqual([...missedLines("th", "th-1-1", store)], [3]);
  noteLine("th", "th-1-1", 3, false, NOW + 2, store);
  assert.equal(missedLines("th", "th-1-1", store).size, 0);
  assert.equal(allMisses("es", store)[0]!.id, "es-1-1");
});

test("지난번에 틀린 것: 고친 줄·틀린 대본 줄·헷갈려요를 최근 순, 오타와 오래된 것은 뺌", () => {
  const script = allScriptsFor("ja")[0]!;
  const me = script.lines.findIndex((line) => line.who === "me");
  const frame = allFramesFor("ja")[0]!;
  const spots = weakSpots({
    language: "ja",
    fixes: [
      { id: "a", wrong: "私は学生わ", right: "私は学生です", note: "", at: NOW - DAY, frame: frame.id },
      { id: "b", wrong: "x", right: "y", at: NOW - DAY, kind: "typo" },
      { id: "c", wrong: "old", right: "new", at: NOW - 40 * DAY },
    ],
    misses: [{ id: script.id, line: me, n: 2, at: NOW - 2 * DAY }],
    review: { [`f|${frame.id}`]: { due: NOW + DAY, step: 1, at: NOW - 3 * DAY }, "e|わかりました": { due: NOW, step: 2, at: NOW } },
    now: NOW,
  });
  assert.deepEqual(spots.map((spot) => spot.kind), ["fix", "line", "review"]);
  assert.equal(spots[0]!.open?.id, frame.id);
  assert.equal(spots[1]!.open?.id, script.id);
  const words = wordsToShow("es", { "e|mucho gusto": { due: NOW, step: 1, at: NOW } }, ["es-1-1"], 3);
  assert.equal(words[0], "mucho gusto");
  assert.equal(words.length, 3);
});

test("아침 알림 글: 날마다 다르게, 아무것도 없으면 한 줄", () => {
  const spots = weakSpots({
    language: "es",
    fixes: [1, 2, 3].map((n) => ({ id: String(n), wrong: `w${n}`, right: `r${n}`, at: NOW - n, note: "" })),
    misses: [],
    review: {},
    now: NOW,
  });
  const days = morningDays({ locale: "ko", title: "오늘의 학습", fallback: "오늘 할 것", spots, words: ["hola", "gracias", "vale", "adiós"], wordsPerDay: 2 });
  assert.equal(days.length, 7);
  assert.notEqual(days[0]!.body, days[1]!.body);
  assert.ok(days[0]!.largeBody.includes("hola · gracias"));
  assert.ok(days[1]!.largeBody.includes("vale · adiós"));
  const empty = morningDays({ locale: "ko", title: "t", fallback: "오늘 할 것", spots: [], words: [], wordsPerDay: 3, days: 1 });
  assert.equal(empty[0]!.body, "오늘 할 것");
});

test("대화 속에서 다시 쓰게: 헷갈려요 둘, 문장구조는 조각이 모두 있어야, 교정이 바꾸지 않았을 때만", () => {
  const frame = allFramesFor("es").find((f) => f.core.length)!;
  const review = {
    "e|mucho gusto": { due: NOW, step: 1, at: NOW },
    [`f|${frame.id}`]: { due: NOW, step: 1, at: NOW - 1 },
    "e|vale": { due: NOW, step: 2, at: NOW },
    "e|adiós": { due: NOW, step: 1, at: NOW - 5 },
  };
  const targets = reuseTargets("es", review);
  // 체크한 것 모두(다시 볼 단계와 상관없이), 최근 순 — 2026-10-29 "잘 썼어요" 표시만.
  assert.deepEqual(targets.map((target) => target.key), ["e|mucho gusto", "e|vale", `f|${frame.id}`, "e|adiós"]);
  assert.deepEqual(usedTargets("es", "¡Mucho gusto, Ana!", targets).map((target) => target.key), ["e|mucho gusto"]);
  assert.ok(usedTargets("es", frame.examples[0]!.text, targets).some((target) => target.kind === "frame"));
  const ja = reuseTargets("ja", { "e|よろしくお願いします": { due: NOW, step: 1, at: NOW } });
  assert.equal(usedTargets("ja", "はじめまして、よろしくお願いします。", ja).length, 1);
  assert.ok(unchanged("Mucho gusto, Ana.", "mucho gusto, Ana"));
  assert.ok(!unchanged("Mucho gusto Ana", "Mucho gusto, Ana"));
});
