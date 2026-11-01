import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { allFramesFor } from "../curriculum/frames.ts";
import { frameUsed } from "../curriculum/scriptBank.ts";
import { ladderFor } from "../curriculum/stages/index.ts";
import { checkScene, checkStageCoverage, toScenario, type CallScene, type SceneContext } from "./callScene.ts";
import { briefsForStage, SCENE_BRIEFS } from "./sceneBriefs.ts";
import { FUNCTIONS } from "../curriculum/functions.ts";
import { currentInstruction, judge, startSession } from "./session.ts";

const SCENES = path.join(import.meta.dirname, "scenes");

function ctxFor(language: string, stage: number): SceneContext {
  return {
    frames: new Map(allFramesFor(language).map((f) => [f.id, { stage: f.stage, pattern: f.pattern }])),
    canDoCount: ladderFor(language)?.stages.find((s) => s.order === stage)?.canDo.length ?? 6,
    needsKo: language !== "ko",
    frameUsed,
  };
}

function sceneFiles(): { language: string; stage: number; scenes: CallScene[] }[] {
  if (!fs.existsSync(SCENES)) return [];
  return fs.readdirSync(SCENES).flatMap((language) =>
    fs
      .readdirSync(path.join(SCENES, language))
      .filter((name) => /^s\d\.json$/.test(name))
      .map((name) => ({
        language,
        stage: Number(name[1]),
        scenes: JSON.parse(fs.readFileSync(path.join(SCENES, language, name), "utf8")) as CallScene[],
      })),
  );
}

test("공통 장면 목록: 단계 1은 30개(상황 4·주제 6·변주 20), id 하나씩, 말 기능은 목록에 있는 것", () => {
  const one = briefsForStage(1);
  assert.equal(one.length, 30);
  assert.equal(one.filter((b) => b.kind === "errand").length, 4);
  assert.equal(one.filter((b) => b.kind === "topic").length, 6);
  assert.equal(new Set(SCENE_BRIEFS.map((b) => b.id)).size, SCENE_BRIEFS.length);
  const fns = new Set(FUNCTIONS.filter((f) => f.stage <= 1).map((f) => f.id));
  for (const brief of one) for (const fn of brief.fns) assert.ok(fns.has(fn), `${brief.id}: ${fn}`);
  // 1단계 말 기능은 목록 어딘가에서 모두 쓰인다.
  const used = new Set(one.flatMap((b) => b.fns));
  for (const fn of fns) assert.ok(used.has(fn), `1단계 기능 ${fn}을 쓰는 장면이 없음`);
});

test("장면 파일: 장면마다 규칙 통과, 30개가 다 있으면 빈틈 검사도 통과", () => {
  for (const { language, stage, scenes } of sceneFiles()) {
    const ctx = ctxFor(language, stage);
    for (const scene of scenes) {
      assert.equal(scene.language, language);
      assert.equal(scene.stage, stage);
      assert.deepEqual(checkScene(scene, ctx), []);
    }
    if (scenes.length >= briefsForStage(stage).length) {
      const coverage = checkStageCoverage(scenes, {
        stage,
        stageFrames: allFramesFor(language).filter((f) => f.stage === stage).map((f) => f.id),
        canDoCount: ctx.canDoCount,
        targetFrames: [],
      });
      assert.deepEqual(coverage, [], `${language} s${stage}`);
    }
  }
});

test("장면은 지금 통화 엔진으로 걸을 수 있다 — 첫 줄이 나오고, 바라는 대답이 다음 마디로", () => {
  for (const { scenes } of sceneFiles()) {
    for (const scene of scenes.slice(0, 3)) {
      const { scenario, bank } = toScenario(scene, "alloy", "ko");
      const state = startSession(scenario);
      assert.equal(state.nodeId, scene.start);
      assert.ok(currentInstruction(scenario, bank, state), scene.id);
      const firstLearner = Object.values(scenario.nodes).find((n) => n.type === "learner");
      if (firstLearner && firstLearner.type === "learner") {
        const phrase = firstLearner.expect[0]!.match[0]!;
        assert.equal(judge(firstLearner, phrase, 0.6)?.go, firstLearner.expect[0]!.go, `${scene.id} ${phrase}`);
      }
    }
  }
});

test("검사는 답이 새는 해낼 일과 빠진 쉬운 말을 잡는다", () => {
  const scene: CallScene = {
    id: "es-s1-99",
    language: "es",
    stage: 1,
    brief: "s1-cafe",
    title: { en: "t", ko: "t" },
    setting: "s",
    tutorRole: "r",
    canDo: [0],
    start: "t1",
    nodes: {
      t1: { type: "tutor", id: "t1", say: "a", next: "l1" },
      l1: {
        type: "learner",
        id: "l1",
        goal: { en: "Say un café, por favor", ko: "주문하세요" },
        expect: [
          { meaning: "orders", go: "t2", match: ["un café, por favor", "un té, por favor", "café, por favor"] },
          { meaning: "greets", go: "t2", match: ["hola", "buenos días", "hola, buenas"] },
        ],
        onMiss: "t1",
      },
      t2: { type: "tutor", id: "t2", say: "a", next: null },
    },
    sentences: { a: { text: "Hola", gloss: { en: "Hi", ko: "안녕" } } },
  };
  const problems = checkScene(scene, ctxFor("es", 1)).join("\n");
  assert.match(problems, /답 "un café, por favor"가 보임/);
  assert.match(problems, /easier 없음/);
  assert.match(problems, /학습자 차례 1개/);
});
