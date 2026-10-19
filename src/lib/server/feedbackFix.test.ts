import { test } from "node:test";
import assert from "node:assert/strict";

// 운영 저장소에 닿지 않게 메모리 저장소로.
delete process.env.KV_REST_API_URL;
delete process.env.KV_REST_API_TOKEN;
delete process.env.UPSTASH_REDIS_REST_URL;
delete process.env.UPSTASH_REDIS_REST_TOKEN;
console.warn = () => {};

const { senderTag } = await import("./feedbackStore.ts");
const { announceFix, takeFeedbackNews } = await import("./feedbackFixStore.ts");
const { SHARED_ANONYMOUS_ID } = await import("./identity.ts");
const { newsFor, pickLocale, fixLocaleOf } = await import("../feedbackFix.ts");

const fix = (card: string, appVersion = "") => ({
  card,
  at: Date.parse("2026-10-20T03:00:00Z"),
  appVersion,
  texts: { ko: "채팅 입력창이 키보드에 가리지 않아요", ja: "入力欄がキーボードに隠れなくなりました", ar: "لم يعد حقل الكتابة مخفيًا خلف لوحة المفاتيح" },
  shots: ["ko" as const, "ja" as const],
});

const ask = (ids: string[], ui = "ko", appVersion = "2.69", native = true) =>
  takeFeedbackNews({ userIds: ids, uiLocale: ui, appVersion, native });

test("같은 문제를 보낸 여러 사람에게 한 번에, 사람마다 한 번", async () => {
  const a = "rc:alice-1";
  const b = "rc:bob-1";
  const result = await announceFix(fix("kbd-hide"), [
    { sender: senderTag(a), uiLocale: "ja" },
    { sender: senderTag(a), uiLocale: "ja" },
    { sender: senderTag(b), uiLocale: "ar" },
  ]);
  assert.deepEqual(result, { sent: 2, skipped: 0 });

  // 다시 알려도 이미 받은 사람에겐 안 감(완료 뒤 같은 의견을 또 보낸 사람만 새로 받음).
  const again = await announceFix(fix("kbd-hide"), [{ sender: senderTag(a), uiLocale: "ja" }, { sender: senderTag("rc:carol"), uiLocale: "th" }]);
  assert.deepEqual(again, { sent: 1, skipped: 1 });

  const alice = await ask([a], "ja");
  assert.equal(alice.length, 1);
  assert.equal(alice[0].text, "入力欄がキーボードに隠れなくなりました");
  assert.equal(alice[0].before, "/feedback-fix/kbd-hide/ja/before.webp");
  assert.equal(alice[0].after, "/feedback-fix/kbd-hide/ja/after.webp");
  assert.equal(alice[0].needsUpdate, false);
  assert.deepEqual(await ask([a], "ja"), [], "한 번 보여 주면 지워짐");

  // 아랍어 문구는 있고 그림은 ko·ja뿐 → 문구는 아랍어, 그림은 영어가 없으니 한국어.
  const bob = await ask([b], "ar");
  assert.equal(bob[0].text, "لم يعد حقل الكتابة مخفيًا خلف لوحة المفاتيح");
  assert.equal(bob[0].before, "/feedback-fix/kbd-hide/ko/before.webp");

  // 태국어 문구가 없으면 한국어(영어가 없으니).
  const carol = await ask(["rc:carol"], "th");
  assert.equal(carol[0].text, "채팅 입력창이 키보드에 가리지 않아요");
});

test("앱 빌드가 필요한 수정: 옛 빌드엔 '업데이트하면' 한 번, 업데이트 뒤 '반영됐어요'", async () => {
  const id = "rc:dana-1";
  await announceFix(fix("map-scroll", "2.70"), [{ sender: senderTag(id), uiLocale: "ko" }]);

  const old = await ask([id], "ko", "2.69");
  assert.equal(old.length, 1);
  assert.equal(old[0].needsUpdate, true);
  assert.equal(old[0].appVersion, "2.70");
  assert.deepEqual(await ask([id], "ko", "2.69"), [], "옛 빌드에선 한 번만");

  const updated = await ask([id], "ko", "2.70");
  assert.equal(updated.length, 1);
  assert.equal(updated[0].needsUpdate, false);
  assert.deepEqual(await ask([id], "ko", "2.70"), []);

  // 웹은 늘 최신이라 기다리지 않는다.
  const web = "rc:web-1";
  await announceFix(fix("map-scroll-web", "2.70"), [{ sender: senderTag(web), uiLocale: "ko" }]);
  assert.equal((await ask([web], "ko", "2.69", false))[0].needsUpdate, false);
});

test("로그인 전에 보낸 의견도: 계정 id와 기기 id 어느 쪽으로든 찾음, 같은 카드는 한 번", async () => {
  const device = "rc:device-9";
  await announceFix(fix("login-before"), [{ sender: senderTag(device), uiLocale: "ko" }]);
  const news = await ask(["rc:account-data-1", device], "ko");
  assert.equal(news.length, 1);
});

test("id 없이 보낸 의견(공유 익명 id)은 아무에게도 가지 않음", async () => {
  const result = await announceFix(fix("anon"), [{ sender: senderTag(SHARED_ANONYMOUS_ID), uiLocale: "ko" }]);
  assert.deepEqual(result, { sent: 0, skipped: 0 });
  assert.deepEqual(await ask([SHARED_ANONYMOUS_ID]), []);
});

test("언어 고르기: ja-JP → ja, 없는 언어는 영어 → 한국어 → 아무거나", () => {
  assert.equal(fixLocaleOf("ja-JP"), "ja");
  assert.equal(fixLocaleOf("xx"), null);
  assert.equal(pickLocale("th", ["ja", "en"]), "en");
  assert.equal(pickLocale("th", ["ja"]), "ja");
  assert.equal(pickLocale("th", []), null);
  const noShots = newsFor({ ...fix("x"), shots: [] }, "ko", false);
  assert.equal(noShots.before, null);
});
