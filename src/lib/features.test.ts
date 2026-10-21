import { test } from "node:test";
import assert from "node:assert/strict";
import {
  FEATURE_IDS,
  FEATURE_PRESETS,
  cleanFeatureState,
  featureOfGo,
  featureOfTab,
  isFeatureOn,
  looksLikeFreshInstall,
  matchingPreset,
  presetOff,
} from "./features.ts";
import { GUIDE_CHAPTERS } from "./guide/content.ts";
import { WHATS_NEW_SEEN_KEY } from "./whatsNew.ts";

const store = (rows: Record<string, string>) => ({ getItem: (key: string) => rows[key] ?? null });

test("처음 설치만 고르기 화면: 저장값·새로워진 점·쓴 흔적이 있으면 묻지 않는다", () => {
  assert.equal(looksLikeFreshInstall(store({})), true);
  assert.equal(looksLikeFreshInstall(store({ appFeatures: "{}" })), false);
  assert.equal(looksLikeFreshInstall(store({ [WHATS_NEW_SEEN_KEY]: "2.70" })), false);
  assert.equal(looksLikeFreshInstall(store({ conversationSessions: "[]" })), false);
});

test("Room은 사람이 켜져 있어야 켜진다", () => {
  assert.equal(isFeatureOn([], "rooms"), true);
  assert.equal(isFeatureOn(["people"], "rooms"), false);
  assert.equal(isFeatureOn(["rooms"], "people"), true);
});

test("묶음: 전부는 아무것도 끄지 않고, 꺼 둔 목록으로 묶음을 다시 찾는다", () => {
  assert.deepEqual(presetOff("all"), []);
  for (const preset of FEATURE_PRESETS) assert.equal(matchingPreset(presetOff(preset.id)), preset.id);
  assert.equal(matchingPreset(["notes"]), null);
  assert.deepEqual(presetOff("solo").sort(), ["people", "rooms", "video"]);
});

test("저장값 정리: 모르는 값은 버리고, chosen이 없으면 고른 것으로", () => {
  assert.deepEqual(cleanFeatureState({ off: ["video", "nope"], chosen: false }), { off: ["video"], chosen: false });
  assert.deepEqual(cleanFeatureState({}), { off: [], chosen: true });
  assert.equal(cleanFeatureState(null), null);
});

test("사용법 장마다 기능이 정해져 있다(AI 채팅·My만 늘 켜짐)", () => {
  const locked = GUIDE_CHAPTERS.filter((chapter) => featureOfGo(chapter.go) === null).map((chapter) => chapter.id);
  assert.deepEqual(locked.sort(), ["ai-chat", "my"]);
  const covered = new Set(GUIDE_CHAPTERS.map((chapter) => featureOfGo(chapter.go)).filter(Boolean));
  for (const feature of FEATURE_IDS) assert.ok(covered.has(feature), feature);
});

test("탭 → 기능: 채팅·My는 숨길 수 없다", () => {
  assert.equal(featureOfTab("chat"), null);
  assert.equal(featureOfTab("map"), null);
  assert.equal(featureOfTab("messages"), "people");
  assert.equal(featureOfTab("vocab"), "notes");
});
