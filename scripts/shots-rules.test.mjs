import test from "node:test";
import assert from "node:assert/strict";
import { planShots, isStale } from "./shots-rules.mjs";

const base = { area: "room", node: "room", scene: "seat", state: "ok", bytes: 50_000, source: "커밋 전 확인", date: "2026-10-20" };
const shot = (id, extra = {}) => ({ id, assetId: `a-${id}`, ...base, ...extra });

test("한국어 앱 화면이 대표, 다른 언어 조합은 보조", () => {
  const plan = planShots({ shots: [shot("ja", { lang: "ja" }), shot("ko", { lang: "ko" }), shot("ar", { lang: "ar" })], today: "2026-10-20" });
  assert.equal(plan.nodes.room[0].primary, "ko");
  assert.deepEqual(plan.nodes.room[0].alts, ["ja", "ar"]);
});

test("한국어가 없으면 다음 조합이 대표", () => {
  const plan = planShots({ shots: [shot("ar", { lang: "ar" }), shot("ja", { lang: "ja" })], today: "2026-10-20" });
  assert.equal(plan.nodes.room[0].primary, "ja");
});

test("찍은 뒤 영역이 바뀐 화면은 후보에서 빠지고, 30일 지나면 정리 예정", () => {
  const old = shot("old", { lang: "ko", date: "2026-09-01" });
  assert.equal(isStale(old, { room: "2026-09-10" }), true);
  const soon = planShots({ shots: [old], changed: { room: "2026-09-10" }, today: "2026-09-20" });
  assert.equal(soon.nodes.room, undefined);
  assert.equal(soon.marks.length, 0);
  const later = planShots({ shots: [old], changed: { room: "2026-09-10" }, today: "2026-10-11" });
  assert.match(later.marks[0].reason, /옛 화면/);
});

test("빈 화면·옛 화면·중복은 바로 정리 예정, 고른 그림과 남기기는 안 건드림", () => {
  const plan = planShots({
    shots: [
      shot("blank", { lang: "ko", scene: "a", bytes: 5000 }),
      shot("hands", { lang: "ko", scene: "b", state: "old" }),
      shot("dup-old", { lang: "ja", scene: "c", date: "2026-10-18" }),
      shot("dup-new", { lang: "ja", scene: "c", date: "2026-10-20" }),
      shot("kept", { lang: "ko", scene: "d", bytes: 100, keep: true }),
      shot("picked", { lang: "ko", scene: "e", state: "old" }),
    ],
    picks: { "room.host": { shotId: "picked" } },
    today: "2026-10-20",
  });
  const reasons = Object.fromEntries(plan.marks.map((m) => [m.id, m.reason]));
  assert.equal(reasons.blank, "빈 화면");
  assert.equal(reasons.hands, "바뀐 옛 화면");
  assert.equal(reasons["dup-old"], "같은 장면 중복");
  assert.equal(reasons["dup-new"], undefined);
  assert.equal(reasons.kept, undefined);
  assert.equal(reasons.picked, undefined);
  assert.equal(plan.sections["room.host"], "picked");
});

test("정리 예정 7일 뒤 지우고, 그사이 고르면 풀어 줌", () => {
  const trash = { at: "2026-10-10", reason: "빈 화면" };
  const plan = planShots({
    shots: [shot("gone", { lang: "ko", scene: "x", trash }), shot("saved", { lang: "ko", scene: "y", trash })],
    picks: { "node.room": { shotId: "saved" } },
    today: "2026-10-17",
  });
  assert.deepEqual(plan.deletes, [{ id: "gone", assetId: "a-gone" }]);
  assert.deepEqual(plan.unmarks, ["saved"]);
});

test("오류·가상 사용자 화면은 14일 뒤", () => {
  const plan = planShots({
    shots: [shot("err", { lang: "ko", scene: "e", state: "error", date: "2026-10-01" }), shot("sim", { lang: "ko", scene: "s", source: "가상 사용자", date: "2026-10-01" })],
    today: "2026-10-15",
  });
  assert.equal(plan.marks.length, 2);
});
