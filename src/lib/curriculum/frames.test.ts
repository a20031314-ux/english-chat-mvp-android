import { test } from "node:test";
import assert from "node:assert/strict";
import { blankOf, frameById, frameModes, framesFor, framesOfScript, isNameExample, personalizeFrame, scriptsWithFrame } from "./frames.ts";
import { FUNCTIONS, functionById } from "./functions.ts";
import { scriptsFor } from "./stageScripts.ts";
import { ladderFor } from "./stages/index.ts";

/** 틀이 있는 언어·단계(2026-10-28 1단계 "틀을 뼈대로": ko·es·ja 1~3단계). */
const FRAMED: Record<string, number[]> = Object.fromEntries(
  ["ko", "ja", "es", "en", "zh", "vi", "id", "th", "fr", "it", "pt", "ru", "ar", "hi"].filter((language) => framesFor(language, 1).length).map((language) => [language, [1, 2, 3]]),
);

test("공통 기능 목록: id 겹침 없음, 이름 en·ko, 단계 1~5", () => {
  const ids = new Set<string>();
  for (const one of FUNCTIONS) {
    assert.ok(!ids.has(one.id), `${one.id} 겹침`);
    ids.add(one.id);
    assert.ok(one.name.en && one.name.ko, `${one.id} 이름`);
    assert.ok(one.stage >= 1 && one.stage <= 5, `${one.id} 단계`);
  }
  assert.ok(FUNCTIONS.length >= 100, "기능 수");
  assert.equal(functionById("없음"), null);
});

test("틀: 예문 넷, 빈칸·틀 조각이 문장에, 기능 id, 단계 문법을 모두 덮음", () => {
  for (const [language, stages] of Object.entries(FRAMED)) {
    const ladder = ladderFor(language)!;
    const ids = new Set<string>();
    for (const order of stages) {
      const stage = ladder.stages.find((one) => one.order === order)!;
      const frames = framesFor(language, order);
      assert.ok(frames.length >= 12, `${language}-${order} 틀 수 ${frames.length}`);
      for (const frame of frames) {
        assert.ok(!ids.has(frame.id), `${frame.id} 겹침`);
        ids.add(frame.id);
        assert.ok(frame.id.startsWith(`${language}-f${order}-`), `${frame.id} id 모양`);
        assert.ok(frame.fn && functionById(frame.fn), `${frame.id} 기능 ${frame.fn}`);
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
          assert.ok(blankOf(example).includes("＿＿＿"), `${frame.id} 빈칸 가리기`);
        }
      }
      const covered = new Set(frames.flatMap((frame) => frame.grammar ?? []));
      assert.deepEqual(stage.grammar.map((_, i) => i).filter((i) => !covered.has(i)), [], `${language}-${order} 틀 없는 문법`);
    }
  }
  assert.deepEqual(framesFor("xx", 1), []);
  assert.equal(frameById("ja", "없음"), null);
});

test("대본 줄 틀 태그: 내 줄에만, 있는 틀, 같은 단계·앞 단계 것", () => {
  for (const [language, stages] of Object.entries(FRAMED)) {
    for (const order of stages) {
      for (const script of scriptsFor(language, order)) {
        for (const line of script.lines) {
          for (const id of line.frames ?? []) {
            assert.equal(line.who, "me", `${script.id} 상대 줄에 틀 ${id}`);
            const frame = frameById(language, id);
            assert.ok(frame, `${script.id} 없는 틀 ${id}`);
            assert.ok(frame.stage <= script.stage, `${script.id} 뒤 단계 틀 ${id}`);
          }
        }
        if (script.situation !== undefined) assert.ok(framesOfScript(script).length >= 1, `${script.id} 틀 태그 없음`);
      }
    }
  }
});

test("이 틀이 나오는 대본: 태그로 찾고, 그 단계 대본이 먼저", () => {
  for (const [language, stages] of Object.entries(FRAMED)) {
    for (const order of stages) {
      for (const frame of framesFor(language, order)) {
        const found = scriptsWithFrame(language, frame);
        for (const script of found) {
          assert.ok(script.stage <= frame.stage);
          assert.ok(framesOfScript(script).includes(frame.id), `${frame.id} → ${script.id}`);
        }
        for (let i = 1; i < found.length; i += 1) assert.ok(found[i - 1].stage >= found[i].stage, `${frame.id} 순서`);
      }
    }
  }
});

test("틀 화면 방식: 1~2단계 따라·틀만, 3단계부터 내 말로", () => {
  assert.deepEqual(frameModes(1), ["shadow", "blank"]);
  assert.deepEqual(frameModes(2), ["shadow", "blank"]);
  assert.deepEqual(frameModes(3), ["shadow", "blank", "own"]);
});

test("이름 자리 예문은 닉네임으로(한국어 조사까지)", () => {
  const ko = framesFor("ko", 1).find((frame) => frame.examples.some(isNameExample))!;
  const mine = personalizeFrame(ko, "ko", "민준");
  const example = mine.examples.find(isNameExample)!;
  assert.ok(example.text.includes("민준이에요"), example.text);
  assert.equal(example.slot, "민준");
  assert.ok(example.cue.en.startsWith("민준"));
  assert.ok(!blankOf(example).includes("민준"));
  assert.ok(personalizeFrame(ko, "ko", "지아").examples.find(isNameExample)!.text.includes("지아예요"));
  assert.equal(personalizeFrame(ko, "ko", ""), ko);
  const ja = framesFor("ja", 1).find((frame) => frame.examples.some(isNameExample))!;
  assert.ok(personalizeFrame(ja, "ja", "Omar").examples.find(isNameExample)!.text.includes("Omar"));
});

test("앱에 없는 언어: 서버가 보낸 대본·틀을 넣고, 앱에 든 언어는 안 바꿈", async () => {
  const { registerScripts, scriptsFor: scripts, allScriptsFor } = await import("./stageScripts.ts");
  const { registerFrames, allFramesFor } = await import("./frames.ts");
  const ko = allScriptsFor("ko");
  assert.equal(registerScripts("ko", [{ id: "x", stage: 1, lines: [], expressions: [], setting: { en: "x" } }]), false);
  assert.equal(allScriptsFor("ko"), ko);
  assert.equal(registerScripts("zz", "nope"), false);
  assert.equal(registerScripts("zz", [{ id: "zz-1-1", stage: 1, situation: 0, lines: [], expressions: [], setting: { en: "x" } }, { bad: 1 }]), true);
  assert.equal(scripts("zz", 1).length, 1);
  const frame = framesFor("es", 1)[0]!;
  assert.equal(registerFrames("zz", [{ ...frame, id: "zz-f1-01" }, null]), true);
  assert.equal(allFramesFor("zz").length, 1);
  assert.equal(registerFrames("es", [frame]), false);
});
