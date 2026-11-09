import { test } from "node:test";
import assert from "node:assert/strict";
import { frameById, framesFor, framesOfScript } from "./frames.ts";
import { scriptsFor } from "./stageScripts.ts";
/** 틀이 있는 언어·단계(2026-10-28 1단계 "틀을 뼈대로": ko·es·ja 1~3단계). */
const FRAMED: Record<string, number[]> = Object.fromEntries(
  ["ko", "ja", "es", "en", "zh", "vi", "id", "th", "fr", "it", "pt", "ru", "ar", "hi"].filter((language) => framesFor(language, 1).length).map((language) => [language, [1, 2, 3, 4, 5]]),
);

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
