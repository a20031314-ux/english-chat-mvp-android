import assert from "node:assert/strict";
import test from "node:test";
import { bestTier, callWindowStart, localDay, parseOffset, planFromSubscriber, premiumDailyAt, termsFor, tierForProduct } from "./plans.ts";
import { isScriptsApp } from "../appVersion.ts";
import { evaluateVideoAccess } from "./videoPrep.ts";

const OCT_16 = Date.parse("2026-10-16T03:00:00Z");

test("each plan's terms are the ones decided", () => {
  assert.deepEqual(
    ["free", "lite", "plus"].map((tier) => {
      const t = termsFor(tier as "free" | "lite" | "plus", OCT_16, null);
      return [t.dailyCallMinutes, t.dailyChat, t.libraryOpen, t.canImport];
    }),
    [
      [null, 7, false, false],
      [7, 30, false, true],
      [10, 50, false, true],
    ],
  );
});

test("AI 도움·방 자막·팩 한도(흑자 구조 2026-10-20): 무료가 가장 작고 요금이 오를수록 늘거나 같다", () => {
  const order = ["free", "lite", "plus", "premium"] as const;
  const terms = order.map((tier) => termsFor(tier, OCT_16, null));
  assert.deepEqual(terms.map((t) => t.dailyAiHelp), [20, 100, 150, 300]);
  assert.deepEqual(terms.map((t) => t.dailyCaptionLines), [100, 300, 600, 1200]);
  assert.deepEqual(terms.map((t) => t.packDaysPerWeek), [2, null, null, null]);
  assert.equal(termsFor("premium", Date.UTC(2100, 1, 1), "2100-01-01").dailyAiHelp, 300);
});

test("premium keeps its old terms until the switch day, and the grant for that month", () => {
  const before = termsFor("premium", OCT_16, null);
  assert.equal(before.dailyCallMinutes, null);
  assert.equal(before.monthlyGrantPoints, 80);
  assert.equal(before.dailyChat, null);

  assert.equal(termsFor("premium", OCT_16, "2026-10-20").dailyCallMinutes, null);
  const switchMonth = termsFor("premium", Date.parse("2026-10-21T00:00:00Z"), "2026-10-20");
  assert.deepEqual(
    [switchMonth.dailyCallMinutes, switchMonth.monthlyGrantPoints, switchMonth.dailyChat, switchMonth.extraPacks],
    [15, 80, 100, 2],
  );
  const next = termsFor("premium", Date.parse("2026-11-02T00:00:00Z"), "2026-10-20");
  assert.equal(next.monthlyGrantPoints, 0);
  assert.equal(premiumDailyAt(OCT_16, null).daily, false);
});

test("store products map to plans, base plans included, and unknown ones to nothing", () => {
  assert.equal(tierForProduct("lite_monthly"), "lite");
  assert.equal(tierForProduct("plus_monthly:monthly-base"), "plus");
  assert.equal(tierForProduct("premium_monthly"), "premium");
  assert.equal(tierForProduct("points_100"), null);
  assert.equal(tierForProduct(null), null);
  assert.equal(bestTier(["lite", "premium", "plus"]), "premium");
});

test("RevenueCat's entitlement names the plan; an unknown product with it reads as premium", () => {
  const future = new Date(Date.now() + 86_400_000).toISOString();
  const past = new Date(Date.now() - 86_400_000).toISOString();
  const body = (product: string | null, expires: string | null) => ({
    subscriber: { entitlements: { premium: { expires_date: expires, product_identifier: product } } },
  });
  assert.equal(planFromSubscriber(body("lite_monthly", future)), "lite");
  assert.equal(planFromSubscriber(body("plus_monthly:p1m", future)), "plus");
  assert.equal(planFromSubscriber(body("promo_grant", future)), "premium");
  assert.equal(planFromSubscriber(body("lite_monthly", past)), "free");
  assert.equal(planFromSubscriber({}), "free");
});

test("the day resets at the learner's midnight, Korea's when unknown", () => {
  const late = Date.parse("2026-10-16T16:00:00Z");
  assert.equal(localDay(late, null), "2026-10-17");
  assert.equal(localDay(late, -300), "2026-10-16");
  assert.equal(parseOffset("540"), 540);
  assert.equal(parseOffset("-330"), -330);
  assert.equal(parseOffset("99999"), null);
  assert.equal(parseOffset("abc"), null);
  assert.equal(parseOffset(null), null);
});

test("only a plan with the library open gets every library video; imports use bought points", () => {
  const base = {
    isPremium: true,
    videoId: "not-a-library-id",
    language: "en" as const,
    durationSeconds: 120,
    usedPoints: 0,
    billedVideoIds: [],
    trialVideoIds: [],
  };
  const lite = termsFor("lite", OCT_16, null);
  const noPoints = evaluateVideoAccess({ ...base, purchasedPoints: 0, libraryOpen: lite.libraryOpen, grant: lite.monthlyGrantPoints });
  assert.deepEqual(noPoints, { ok: false, reason: "quota", maxSeconds: 15 * 60 });
  const bought = evaluateVideoAccess({ ...base, purchasedPoints: 5, libraryOpen: lite.libraryOpen, grant: lite.monthlyGrantPoints });
  assert.equal(bought.ok, true);
  // The old premium terms still import from the monthly grant.
  assert.equal(evaluateVideoAccess({ ...base, purchasedPoints: 0 }).ok, true);
});

test("대본 플랜(2,900원): 사흘마다 통화 5분·채팅 20, 무료는 대본 앱(2.76~)에서 채팅·통화 없음", () => {
  const script = termsFor("script", Date.parse("2026-10-28T00:00:00Z"));
  assert.equal(script.priceKrw, 2900);
  assert.equal(script.dailyCallMinutes, 5);
  assert.equal(script.callWindowDays, 3);
  assert.equal(script.dailyChat, 20);
  assert.equal(tierForProduct("script_monthly:monthly"), "script");
  assert.equal(bestTier(["script", "free"]), "script");
  assert.equal(bestTier(["script", "lite"]), "lite");
  const oldFree = termsFor("free");
  assert.equal(oldFree.dailyChat, 7);
  assert.ok(oldFree.freeTrialPoints > 0);
  const newFree = termsFor("free", Date.now(), null, { scriptsApp: true });
  assert.equal(newFree.dailyChat, 0);
  assert.equal(newFree.freeTrialPoints, 0);
  assert.equal(newFree.packDaysPerWeek, 0);
  // 사흘 칸: 같은 칸의 날은 같은 첫날, 칸이 바뀌면 다음 첫날
  const days = ["2026-10-27", "2026-10-28", "2026-10-29", "2026-10-30", "2026-10-31"].map((day) => callWindowStart(day, 3));
  assert.equal(callWindowStart("2026-10-28", 1), "2026-10-28");
  const starts = new Set(days);
  for (const start of starts) assert.equal(callWindowStart(start, 3), start);
  assert.ok(starts.size >= 2 && starts.size <= 3);
  // 첫날에서 사흘 안은 모두 같은 칸
  const first = [...starts][1]!;
  const plus = (n: number) => new Date(Date.parse(`${first}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);
  assert.deepEqual([0, 1, 2].map((n) => callWindowStart(plus(n), 3)), [first, first, first]);
  assert.notEqual(callWindowStart(plus(3), 3), first);
});

test("대본 앱 판정: 2.76부터, 모르는 빌드는 옛 앱", () => {
  assert.equal(isScriptsApp("2.76"), true);
  assert.equal(isScriptsApp("2.76.0"), true);
  assert.equal(isScriptsApp("2.80"), true);
  assert.equal(isScriptsApp("2.75.0"), false);
  assert.equal(isScriptsApp("unknown"), false);
  assert.equal(isScriptsApp(null), false);
});
