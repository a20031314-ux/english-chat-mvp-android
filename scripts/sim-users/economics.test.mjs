import assert from "node:assert/strict";
import test from "node:test";
import { PLANS, options, perSignup, simulate } from "./economics.mjs";

const o = options([]);
const type = (id) => o.assume.types[id];
const plan = (id) => PLANS.find((p) => p.id === id);

test("구독자는 광고가 없고, 무료만 광고 수입이 생긴다", () => {
  for (const id of ["lite", "plus", "premium", "premiumNew"]) {
    const r = simulate(type("열심히"), plan(id).terms, o);
    assert.equal(r.adKrw("high"), 0, id);
    assert.equal(r.n.rewarded, 0, id);
  }
  assert.ok(simulate(type("열심히"), plan("free").terms, o).adKrw("low") > 0);
});

test("요금 한도로 잘린다: 무료 채팅은 기본 + 보상형 상한까지만", () => {
  const r = simulate(type("한도 꽉"), plan("free").terms, o);
  const perDay = plan("free").terms.dailyChat + o.ads.rewardedDailyMax * o.ads.rewardChats;
  assert.equal(r.n.chats, perDay * 30);
  assert.ok(r.n.rewarded <= o.ads.rewardedDailyMax * 30);
  assert.equal(r.n.callMinutes, 0);
  const lite = simulate(type("한도 꽉"), plan("lite").terms, o);
  assert.equal(lite.n.chats, 30 * 30);
  assert.equal(lite.n.callMinutes, 7 * 30);
});

test("광고 설정을 바꾸면 결과가 따라 바뀐다(배너 끄면 무료 수입이 준다)", () => {
  const off = { ...o, ads: { ...o.ads, bannerEnabled: false } };
  assert.ok(simulate(type("꾸준히"), plan("free").terms, off).adKrw("mid") < simulate(type("꾸준히"), plan("free").terms, o).adKrw("mid"));
});

test("본전 전환율에서 전체 손익이 0", () => {
  const r = perSignup(o, o.conv, "mid");
  if (r.breakEvenConv && r.breakEvenConv < 1) assert.ok(Math.abs(perSignup(o, r.breakEvenConv, "mid").net) < 1e-6);
});

test("결과가 늘 같다(무작위 없음)", () => {
  assert.equal(simulate(type("꾸준히"), plan("free").terms, o).net("mid"), simulate(type("꾸준히"), plan("free").terms, o).net("mid"));
});
