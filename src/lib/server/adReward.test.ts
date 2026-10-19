import assert from "node:assert/strict";
import { generateKeyPairSync, sign } from "node:crypto";
import test from "node:test";
import { issueAdRewardToken, readAdRewardToken, ssvKeyId, verifySsv } from "./adReward.ts";
import { getAdRewardsToday, grantAdReward } from "./entitlementStore.ts";
import { SHARED_ANONYMOUS_ID } from "./identity.ts";

const { privateKey, publicKey } = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
const pem = publicKey.export({ type: "spki", format: "pem" }).toString();
const keys = [{ keyId: 3335741209, pem }];

function signed(message: string, keyId = 3335741209, key = privateKey): string {
  const sig = sign("sha256", Buffer.from(message), key).toString("base64url");
  return `?${message}&signature=${sig}&key_id=${keyId}`;
}

const token = issueAdRewardToken("rc:abc-123")!;
const message = `ad_network=5450213213286189855&ad_unit=3513667692&custom_data=${encodeURIComponent(token)}&reward_amount=1&reward_item=Reward&timestamp=1792346540682&transaction_id=tx-1&user_id=`;

test("우리 표: 사용자 id를 되찾고, 고친 표는 거부", () => {
  assert.equal(readAdRewardToken(token), "rc:abc-123");
  assert.equal(readAdRewardToken(token.slice(0, -1) + (token.endsWith("A") ? "B" : "A")), null);
  assert.equal(readAdRewardToken("cmM6eHl6.aaaa"), null);
  assert.equal(readAdRewardToken(""), null);
});

test("Google 서명이 맞으면 콜백 내용을 읽는다", () => {
  const cb = verifySsv(signed(message), keys);
  assert.ok(cb);
  assert.equal(cb.adUnit, "3513667692");
  assert.equal(cb.transactionId, "tx-1");
  assert.equal(readAdRewardToken(cb.customData), "rc:abc-123");
  assert.equal(ssvKeyId(signed(message)), "3335741209");
});

test("서명이 틀리거나 내용을 바꾸면 거부", () => {
  const other = generateKeyPairSync("ec", { namedCurve: "prime256v1" }).privateKey;
  assert.equal(verifySsv(signed(message, 3335741209, other), keys), null);
  assert.equal(verifySsv(signed(message).replace("tx-1", "tx-2"), keys), null);
  assert.equal(verifySsv(signed(message, 999), keys), null);
  assert.equal(verifySsv(`?${message}`, keys), null);
});

test("보상: 같은 거래는 한 번, 하루 상한, 익명은 없음", async () => {
  const user = "rc:ad-reward-test";
  assert.equal(await grantAdReward(user, "t-a", 2), "granted");
  assert.equal(await grantAdReward(user, "t-a", 2), "duplicate");
  assert.equal(await grantAdReward(user, "t-b", 2), "granted");
  assert.equal(await grantAdReward(user, "t-c", 2), "capped");
  assert.equal(await getAdRewardsToday(user), 2);
  assert.equal(await grantAdReward(SHARED_ANONYMOUS_ID, "t-d", 2), "anonymous");
});
