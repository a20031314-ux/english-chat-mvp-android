import { test } from "node:test";
import assert from "node:assert/strict";
const store = new Map<string, string>();
(globalThis as { localStorage?: unknown }).localStorage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v), removeItem: (k: string) => void store.delete(k) };
const { buildExam, examDue, EXAM_POOL_MIN, finishExam, notePool, readLadder, readPool, replyQuestion, rungQuestion, RUNG_KIND } = await import("./exam.ts");
const { allFramesFor } = await import("./frames.ts");
const { ladderFor } = await import("./stages/index.ts");

function poolOf(language: string, n: number): string[] {
  const keys = [...allFramesFor(language).filter((frame) => frame.stage <= 2).map((frame) => `f|${frame.id}`), ...(ladderFor(language)?.stages.slice(0, 2).flatMap((stage) => stage.expressions.map((e) => `e|${e}`)) ?? [])];
  return keys.slice(0, n);
}

test("모인 소재: 문장구조·표현·문법만, 20개면 시험, 알아요는 3칸부터", () => {
  store.clear();
  notePool("es", "w|casa", "wrong");
  assert.equal(Object.keys(readPool("es")).length, 0);
  const keys = poolOf("es", EXAM_POOL_MIN);
  for (const key of keys.slice(0, -1)) notePool("es", key, "wrong");
  assert.equal(examDue(readPool("es")), false);
  notePool("es", keys.at(-1)!, "claimed");
  assert.equal(examDue(readPool("es")), true);
  assert.equal(readLadder("es")[keys.at(-1)!], 3);
});

test("사다리 칸 모양: 1 고르기 · 2 순서 · 3 쓰기 · 4 틀린 곳 — 못 만들면 다른 칸 (es·ja·ko)", () => {
  for (const language of ["es", "ja", "ko"]) {
    let made = 0;
    for (const key of poolOf(language, 30)) {
      for (const rung of [1, 2, 3, 4]) {
        const one = rungQuestion(language, key, rung, { stage: 3, seed: "t" });
        if (!one) continue;
        made += 1;
        assert.equal(one.question.kind, RUNG_KIND[one.rung], `${language} ${key} ${rung}`);
      }
    }
    assert.ok(made > 60, `${language} ${made}`);
  }
});

test("시험 한 판: 한 소재 한 문제, 같은 문장 두 번 없음, 파트 순서, 대화 응답은 상대 줄 글이 보기에 없음 (es·ja·ko)", () => {
  for (const language of ["es", "ja", "ko"]) {
    store.clear();
    const keys = poolOf(language, 24);
    for (const key of keys) notePool(language, key, "wrong");
    const items = buildExam({ language, stage: 3, pool: readPool(language), ladder: {}, log: {}, seed: "t" });
    assert.ok(items.length >= 12, `${language} ${items.length}`);
    const used = items.flatMap((item) => item.keys ?? [item.key]);
    assert.equal(new Set(used).size, used.length, language);
    const texts = items.map((item) => ("text" in item.question ? item.question.text : "")).filter(Boolean);
    assert.equal(new Set(texts).size, texts.length, language);
    const order = ["vocab", "recognize", "recall", "reply", "dialog"];
    const seq = items.map((item) => order.indexOf(item.section));
    assert.deepEqual(seq, [...seq].sort((a, b) => a - b), language);
    for (const item of items) if (item.question.kind === "reply") assert.ok(!item.question.options.includes(item.question.them));
  }
});

test("결과: 맞히면 칸 올림·모인 소재에서 빠짐, 틀리면 칸 내림·남음, 알아요 문장구조를 맞히면 익힘으로", () => {
  store.clear();
  const [a, b] = poolOf("es", 2) as [string, string];
  notePool("es", a, "claimed");
  notePool("es", b, "wrong");
  const pool = readPool("es");
  const items = [
    { key: a, section: "recall" as const, rung: 3, claimed: true, question: rungQuestion("es", a, 3, { stage: 3, seed: "x" })!.question },
    { key: b, section: "recognize" as const, rung: 2, question: rungQuestion("es", b, 2, { stage: 3, seed: "x" })!.question },
  ];
  const out = finishExam({ items, answers: [true, false], stage: 2, pool, ladder: { [a]: 3, [b]: 2 } });
  assert.equal(out.ladder[a], 4);
  assert.equal(out.ladder[b], 1);
  assert.ok(!out.pool[a] && out.pool[b]?.r.includes("wrong"));
  assert.deepEqual(out.confirmed, a.startsWith("f|") ? [a.slice(2)] : []);
  assert.equal(out.result.kind, "exam");
  assert.deepEqual(out.result.wrong, [b]);
});

test("대화 응답: 상대 줄 → 그 소재가 든 다음 내 줄, 오답 둘 (es·ko)", () => {
  for (const language of ["es", "ko"]) {
    const made = poolOf(language, 40).map((key) => replyQuestion(language, key, { stage: 3, seed: "r" })).filter(Boolean);
    assert.ok(made.length >= 5, `${language} ${made.length}`);
    for (const q of made) if (q?.kind === "reply") assert.equal(q.options.length, 3);
  }
});

test("통화에서 고친 문장: 모인 소재에 장면으로 남고, 시험은 그 문장을 먼저 — 4칸은 내가 한 틀린 말 그대로 (en·es·ja)", async () => {
  const { allFramesFor: frames } = await import("./frames.ts");
  const cases: [string, string, string, string][] = [
    ["en", "f|en-f1-01", "My name is Mina.", "My name are Mina."],
    ["es", "f|es-f1-01", "Me llamo Ana.", "Me llamas Ana."],
  ];
  const ja = frames("ja").find((frame) => frame.core.some((core) => core === "から来ました"));
  if (ja) cases.push(["ja", `f|${ja.id}`, "わたしは韓国から来ました。", "わたしは韓国に来ました。"]);
  for (const [language, key, line, said] of cases) {
    store.clear();
    notePool(language, key, "stuck", Date.now(), { line, said });
    const entry = readPool(language)[key]!;
    assert.equal(entry.s?.[0]?.line, line, language);
    const spot = rungQuestion(language, key, 4, { stage: 3, seed: "c", own: entry.s });
    assert.equal(spot?.rung, 4, language);
    assert.ok(spot?.question.kind === "spot" && spot.question.text === said && spot.question.right === line, `${language} ${JSON.stringify(spot?.question)}`);
    const typed = rungQuestion(language, key, 3, { stage: 3, seed: "c", own: entry.s });
    assert.ok(typed && "text" in typed.question && typed.question.text === line, `${language} 3칸 ${JSON.stringify(typed?.question)}`);
    // 틀리면 장면이 남는다.
    const out = finishExam({ items: [{ key, section: "recall", rung: 3, question: typed!.question }], answers: [false], stage: 1, pool: readPool(language), ladder: {} });
    assert.equal(out.pool[key]?.s?.[0]?.line, line);
  }
});
