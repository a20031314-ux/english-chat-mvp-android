import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import type { CallScene } from "./callScene.ts";
import { branchPrompt, learnerNode, promptLineFor, readPick, ruleBranch } from "./branchPick.ts";
import { parseSceneId } from "./sceneStore.ts";

const scenes = (language: string) =>
  JSON.parse(fs.readFileSync(path.join(import.meta.dirname, "scenes", language, "s1.json"), "utf8")) as CallScene[];

test("모델 답 읽기: 번호는 1부터, null·이상한 답·범위 밖은 없음", () => {
  assert.equal(readPick('{"pick": 2}', 3), 1);
  assert.equal(readPick('{"pick":1}', 2), 0);
  assert.equal(readPick('{"pick": null}', 3), null);
  assert.equal(readPick('{"pick": 4}', 3), null);
  assert.equal(readPick('{"pick": 0}', 3), null);
  assert.equal(readPick("I think option 2", 3), null);
});

test("장면 id 읽기", () => {
  assert.deepEqual(parseSceneId("es-s1-03"), { language: "es", stage: 1 });
  assert.equal(parseSceneId("../es-s1-03"), null);
  assert.equal(parseSceneId("es-1-03"), null);
});

test("규칙으로 맞는 말은 모델 없이 그 가지로 — 띄어쓰기 없는 언어·라틴 언어", () => {
  for (const language of ["es", "ja", "th"]) {
    const scene = scenes(language)[0]!;
    const node = Object.values(scene.nodes).find((n) => n.type === "learner")!;
    if (node.type !== "learner") continue;
    const phrase = node.expect[0]!.match[0]!.split("{tutor}").join("Sofía");
    const picked = ruleBranch(scene, node.id, phrase, 0.6, { name: "Sofía", gender: "f" });
    assert.equal(picked?.by, "rule", `${language} ${phrase}`);
    assert.equal(picked?.go, node.expect[0]!.go);
    assert.equal(picked?.branch, 0);
  }
});

test("모델에 주는 글: 앞 튜터 줄·해낼 일·가지 뜻과 예시·학습자 말, 튜터 이름 채움", () => {
  const scene = scenes("es")[0]!;
  const node = Object.values(scene.nodes).find((n) => n.type === "learner")!;
  const learner = learnerNode(scene, node.id)!;
  const prompt = branchPrompt(scene, learner, "un cafe porfa", { name: "Mateo", gender: "m" });
  assert.match(prompt, /Language being learned: Spanish/);
  assert.match(prompt, /The learner said: "un cafe porfa"/);
  assert.ok(prompt.includes(learner.goal.en));
  assert.ok(prompt.includes(learner.expect[0]!.meaning));
  assert.ok(!prompt.includes("{tutor}"));
  const line = promptLineFor(scene, node.id);
  if (line) assert.ok(prompt.includes(line.split("{tutor}").join("Mateo")));
});
