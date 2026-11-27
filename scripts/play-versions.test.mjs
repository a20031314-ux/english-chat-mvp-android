import assert from "node:assert/strict";
import test from "node:test";
import { pageOf, patchState, stateCell, topOf, versionNameOf } from "./play-versions.mjs";

const data = {
  checkedAt: "2026-11-28T00:20:00Z",
  tracks: {
    production: { codes: [95], names: ["95 (2.81)"] },
    beta: { codes: [], names: [] },
    alpha: { codes: [], names: [] },
    internal: { codes: [96, 95], names: ["2.82"] },
  },
};

test("출시 이름에서 버전 이름, 트랙에서 가장 높은 코드", () => {
  assert.equal(versionNameOf("95 (2.81)"), "2.81");
  assert.equal(versionNameOf("2.80.0"), "2.80.0");
  assert.equal(versionNameOf("release"), "");
  assert.deepEqual(topOf(data.tracks.internal), { code: 96, name: "2.82" });
  assert.equal(topOf(data.tracks.beta), null);
});

test("STATE 칸: 프로덕션 값 + 앞선 시험 트랙 + 저장소보다 높으면 알림", () => {
  const cell = stateCell(data, 94);
  assert.equal(cell, "**2.81 (versionCode 95)**(Play 확인 2026-11-28) · 내부 테스트 2.82 — 저장소 versionCode 94보다 높음, 저장소 버전을 올려야 함");
  assert.equal(stateCell(data, 95)?.includes("저장소"), false);
  assert.equal(stateCell({ tracks: {} }, 94), null);
});

test("STATE 줄의 둘째 칸만 바뀜", () => {
  const before = "| 항목 | 값 | 어디서 |\n| Play에 올라간 앱 | **2.80 (versionCode 94)**(사용자 2026-11-23) | `package.json` + x |\n| 다음 | y | z |\n";
  const after = patchState(before, "**2.81 (versionCode 95)**(Play 확인 2026-11-28)");
  assert.equal(after, "| 항목 | 값 | 어디서 |\n| Play에 올라간 앱 | **2.81 (versionCode 95)**(Play 확인 2026-11-28) | `package.json` + x |\n| 다음 | y | z |\n");
});

test("페이지: 트랙 네 줄과 저장소 어긋남", () => {
  const page = pageOf({ ...data, tracks: { ...data.tracks, alpha: { codes: [], names: [], error: "403" } } }, 94);
  assert.match(page, /프로덕션 `production` \| 2\.81 · versionCode 95/);
  assert.match(page, /비공개 테스트 `alpha` \| 읽지 못함 \(403\)/);
  assert.match(page, /Play가 앞섬/);
});
