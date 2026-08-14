import assert from "node:assert/strict";
import test from "node:test";
import {
  looksSceneDependent,
  sceneDebugSlice,
} from "./debugSubtitleContext.ts";
import {
  getSceneContextAtTime,
  sceneContextForUnit,
} from "./getSceneContextAtTime.ts";
import type { SceneContext } from "./sceneTypes.ts";

const birthdaySpeechScene: SceneContext = {
  id: "scene-speech",
  startTime: 14,
  endTime: 22,
  setting: "birthday gathering",
  situation: "a group of people is encouraging one man to speak",
  interaction: "several people are looking at and cheering toward the same man",
  mood: "celebratory and playful",
  visualCues: ["people are smiling", "attention is focused on one person"],
  confidence: 0.91,
};

test("reuses one SceneContext across several subtitle timestamps", () => {
  const scenes = [birthdaySpeechScene];
  assert.equal(getSceneContextAtTime(scenes, 17.2)?.id, "scene-speech");
  assert.match(
    getSceneContextAtTime(scenes, 18)?.situation ?? "",
    /encouraging/,
  );
  assert.equal(
    getSceneContextAtTime(scenes, 20)?.setting,
    "birthday gathering",
  );
  assert.match(
    sceneContextForUnit(scenes, 17.2, 19.5)?.mood ?? "",
    /playful/i,
  );
});

test("marks Speech! Speech! Speech! as scene-dependent", () => {
  assert.equal(looksSceneDependent("Speech! Speech! Speech!"), true);
  assert.equal(
    looksSceneDependent("Today we're going to talk about React."),
    false,
  );
});

test("exposes compact debug slice for Speech! decision logs", () => {
  const slice = sceneDebugSlice(birthdaySpeechScene);
  assert.equal(slice?.setting, "birthday gathering");
  assert.match(slice?.situation ?? "", /encouraging/);
  assert.match(slice?.mood ?? "", /playful/);
  // Expected adapt inputs for this fixture:
  // PREVIOUS: Happy birthday to you!
  // CURRENT: Speech! Speech! Speech!
  // NEXT: I am the luckiest man alive.
  // SCENE: group urging one man to speak → not dictionary "연설"
});
