import { test } from "node:test";
import assert from "node:assert/strict";
import { blankOf, frameById, framesFor, scriptsWithFrame } from "./frames.ts";
import { ladderFor } from "./stages/index.ts";

test("틀(일본어 1~2단계 시범): 예문 넷, 빈칸·틀 조각이 문장에, 단계 문법을 모두 덮음", () => {
  const ladder = ladderFor("ja")!;
  const ids = new Set<string>();
  for (const order of [1, 2]) {
    const stage = ladder.stages.find((one) => one.order === order)!;
    const frames = framesFor("ja", order);
    assert.ok(frames.length >= 12, `ja-${order} 틀 수`);
    for (const frame of frames) {
      assert.ok(!ids.has(frame.id), `${frame.id} 겹침`);
      ids.add(frame.id);
      assert.ok(frame.pattern.includes("___"), `${frame.id} 빈칸`);
      assert.ok(frame.meaning.en && frame.meaning.ko, `${frame.id} 뜻`);
      assert.equal(frame.examples.length, 4, `${frame.id} 예문 수`);
      for (const index of frame.grammar ?? []) assert.ok(index >= 0 && index < stage.grammar.length, `${frame.id} 문법 ${index}`);
      for (const expression of frame.expressions ?? []) assert.ok(stage.expressions.includes(expression), `${frame.id} 표현 ${expression}`);
      for (const example of frame.examples) {
        assert.ok(example.text.includes(example.slot), `${frame.id} 빈칸이 문장에: ${example.text}`);
        assert.ok(frame.core.some((core) => example.text.includes(core)), `${frame.id} 틀 조각이 문장에: ${example.text}`);
        assert.ok(example.cue.en && example.cue.ko && example.gloss.en && example.gloss.ko, `${frame.id} 뜻`);
        assert.ok(!/\d/.test(example.text), `${frame.id} 숫자는 글로`);
        assert.ok(blankOf(example).includes("＿＿＿") && !blankOf(example).includes(example.slot), `${frame.id} 빈칸 가리기`);
      }
    }
    const covered = new Set(frames.flatMap((frame) => frame.grammar ?? []));
    assert.deepEqual(stage.grammar.map((_, i) => i).filter((i) => !covered.has(i)), [], `ja-${order} 틀 없는 문법`);
  }
  assert.deepEqual(framesFor("ko", 1), []);
  assert.equal(frameById("ja", "없음"), null);
});

test("이 틀이 나오는 대본: 내 줄에 틀 조각이 있는 그 단계·앞 단계 대본", () => {
  for (const frame of [...framesFor("ja", 1), ...framesFor("ja", 2)]) {
    for (const script of scriptsWithFrame("ja", frame)) {
      assert.ok(script.stage <= frame.stage);
      assert.ok(script.lines.some((line) => line.who === "me" && frame.core.some((core) => line.text.includes(core))), `${frame.id} → ${script.id}`);
    }
  }
});
