/**
 * What a point is worth, and how spending one is split.
 *
 * Kept free of storage and of the network so the arithmetic that decides what
 * someone is charged can be run on its own. Everything here is pure; the KV
 * rows and the call routes live elsewhere.
 */

/**
 * Two pots, not one.
 *
 * Granted points come with the subscription and expire with the month.
 * Purchased points were paid for separately and do not expire — turning them
 * into something that quietly vanishes at a month boundary would be taking
 * money for nothing.
 */
export type PointBalance = {
  granted: number;
  purchased: number;
};

/** Where a charge came from, kept so a refund can go back the same way. */
export type PointSpend = {
  fromGranted: number;
  fromPurchased: number;
};

export function totalPoints(balance: PointBalance): number {
  return Math.max(0, balance.granted) + Math.max(0, balance.purchased);
}

/**
 * Take points, granted first.
 *
 * Granted points are the ones with an expiry date, so they are the ones to burn
 * while they are still worth something. Spending what was paid for first would
 * quietly destroy the balance that had no deadline.
 *
 * Returns null when there is not enough, rather than a partial charge — a call
 * that cannot be paid for should not be opened at all.
 */
export function splitSpend(
  balance: PointBalance,
  points: number,
): PointSpend | null {
  const wanted = Math.max(0, Math.ceil(points));
  if (wanted === 0) return { fromGranted: 0, fromPurchased: 0 };
  if (totalPoints(balance) < wanted) return null;
  const fromGranted = Math.min(Math.max(0, balance.granted), wanted);
  return { fromGranted, fromPurchased: wanted - fromGranted };
}

/**
 * 포인트를 화면에 쓸 때(2026-10-23부터 쓴 만큼 소수로 깎임): 소수 첫째 자리까지, ".0"은 뺀다.
 * 잔액은 버림(실제보다 많아 보이지 않게), 드는 값은 올림(실제보다 싸 보이지 않게). 기기 언어의 소수점.
 */
export function formatPoints(value: number, round: "down" | "up" = "down"): string {
  const safe = Number.isFinite(value) ? Math.max(0, value) : 0;
  // 0.1 단위로 맞출 때 부동소수 오차(2.3 → 2.2999…)로 한 칸 어긋나지 않게 아주 작은 값을 더하고 뺀다.
  const tenths = round === "up" ? Math.ceil(safe * 10 - 1e-9) : Math.floor(safe * 10 + 1e-9);
  return (tenths / 10).toLocaleString(undefined, { maximumFractionDigits: 1 });
}
