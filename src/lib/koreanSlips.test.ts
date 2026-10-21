import assert from "node:assert/strict";
import test from "node:test";
import { casualToElder, findIrregularSlips, koreanSlipHint, repairIrregularSlips } from "./koreanSlips.ts";

test("ㅂ·ㄷ·르 불규칙 실수를 찾고 바로잡는다", () => {
  const cases: Array<[string, string]> = [
    ["날씨가 너무 덥어요.", "날씨가 너무 더워요."],
    ["이 음식이 너무 맵어요.", "이 음식이 너무 매워요."],
    ["한국어가 너무 어렵어요.", "한국어가 너무 어려워요."],
    ["저는 매일 밤 음악을 듣어요.", "저는 매일 밤 음악을 들어요."],
    ["어제 노래를 부르었어요.", "어제 노래를 불렀어요."],
    ["잘 모르아요.", "잘 몰라요."],
    ["친구를 돕았어요.", "친구를 도왔어요."],
    ["추운 날에는 춥은 옷이 없어요", "추운 날에는 추운 옷이 없어요"],
  ];
  for (const [wrong, right] of cases) {
    const slips = findIrregularSlips(wrong);
    assert.ok(slips.length > 0, wrong);
    assert.equal(repairIrregularSlips(wrong, slips), right);
  }
});

test("맞는 활용과 다른 낱말은 건드리지 않는다", () => {
  for (const ok of ["날씨가 너무 더워요.", "음악을 들어요.", "노래를 불러요.", "소매를 걷어 올렸어요.", "무덥어요", "옷을 입어요.", "덥다"]) {
    assert.deepEqual(findIrregularSlips(ok), [], ok);
  }
});

test("선생님·할머니께 반말이면 찾는다", () => {
  assert.equal(casualToElder("선생님, 내일 시간 있어?"), "선생님");
  assert.equal(casualToElder("할머니, 밥 먹었어?"), "할머니");
  assert.equal(casualToElder("사장님, 이거 빨리 해."), "사장님");
  assert.equal(casualToElder("선생님, 내일 시간 있으세요?"), null);
  assert.equal(casualToElder("선생님이 저한테 숙제를 줬어요."), null);
  assert.equal(casualToElder("친구야, 내일 시간 있어?"), null);
});

test("힌트는 찾은 게 없으면 비어 있다", () => {
  assert.equal(koreanSlipHint("저는 커피를 마셔요."), "");
  assert.match(koreanSlipHint("날씨가 덥어요"), /더워/);
  assert.match(koreanSlipHint("선생님, 시간 있어?"), /반말/);
});
