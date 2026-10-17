import assert from "node:assert/strict";
import test from "node:test";

delete process.env.KV_REST_API_URL;
delete process.env.KV_REST_API_TOKEN;
delete process.env.UPSTASH_REDIS_REST_URL;
delete process.env.UPSTASH_REDIS_REST_TOKEN;
delete process.env.AUTH_SECRET;

const { issueAuthToken, verifyAuthToken } = await import("./authToken.ts");
const { readTokenInfo } = await import("./googleIdToken.ts");
const { letterFor, supportedLetterLocales } = await import("./emailSender.ts");
const store = await import("./accountStore.ts");
const { kvListRange } = await import("./kv.ts");
const shared = await import("../account/shared.ts");
const { keyBelongsTo, purgeDeletedAccounts } = await import("./accountPurge.ts");
const { kvSetJson, kvGetJson } = await import("./kv.ts");

const originalWarn = console.warn;
console.warn = () => {};
test.after(() => {
  console.warn = originalWarn;
});

test("토큰: 발급한 것은 읽히고, 고치거나 오래된 것은 안 읽힌다", () => {
  const now = Date.UTC(2026, 9, 18);
  const token = issueAuthToken({ accountId: "lb_" + "a".repeat(24), dataUserId: "rc:$RCAnonymousID:abc" }, now);
  assert.ok(token);
  const claims = verifyAuthToken(token, now + 1000);
  assert.equal(claims?.dataUserId, "rc:$RCAnonymousID:abc");
  assert.equal(claims?.accountId, "lb_" + "a".repeat(24));

  const [body, sig] = token!.split(".");
  const forged = Buffer.from(JSON.stringify({ v: 1, a: "lb_x", u: "rc:someone-else", t: now / 1000 })).toString("base64url");
  assert.equal(verifyAuthToken(`${forged}.${sig}`, now), null);
  assert.equal(verifyAuthToken(`${body}.${sig.slice(0, -2)}xx`, now), null);
  assert.equal(verifyAuthToken(token, now + 401 * 24 * 60 * 60 * 1000), null);
  assert.equal(verifyAuthToken("", now), null);
  assert.equal(verifyAuthToken(null, now), null);
});

test("토큰: 다른 비밀로 서명한 것은 안 읽힌다", () => {
  const token = issueAuthToken({ accountId: "lb_" + "b".repeat(24), dataUserId: "acct:x" });
  process.env.AUTH_SECRET = "another-secret";
  try {
    assert.equal(verifyAuthToken(token), null);
  } finally {
    delete process.env.AUTH_SECRET;
  }
});

test("Google tokeninfo: 우리 앱·Google 발급·확인된 메일만", () => {
  const now = 1_800_000_000;
  const good = { aud: "web-id", iss: "https://accounts.google.com", sub: "1234567890", email: "Mina@Gmail.com", email_verified: "true", name: "Mina", exp: String(now + 60) };
  assert.deepEqual(readTokenInfo(good, ["web-id"], now), { sub: "1234567890", email: "mina@gmail.com", name: "Mina" });
  assert.equal(readTokenInfo({ ...good, aud: "other" }, ["web-id"], now), null);
  assert.equal(readTokenInfo({ ...good, iss: "evil.example" }, ["web-id"], now), null);
  assert.equal(readTokenInfo({ ...good, exp: String(now - 1) }, ["web-id"], now), null);
  assert.equal(readTokenInfo({ ...good, email_verified: "false" }, ["web-id"], now)?.email, null);
});

test("프로필 입력 정리: 글자 수는 보이는 글자로, 한국어·일본어·태국어·스페인어", () => {
  assert.equal(shared.cleanNickname("  민지\n  ☕️  "), "민지 ☕️");
  assert.equal(shared.visibleLength("👩‍👩‍👧"), 1);
  assert.equal(shared.visibleLength("สวัสดี"), 4); // 태국어 모음 기호는 앞 글자에 붙는다
  assert.equal(shared.cleanNickname("あ".repeat(30)).length, shared.NICKNAME_MAX);
  assert.equal(shared.cleanNickname("José Martínez"), "José Martínez");
  assert.equal(shared.cleanBio("한 줄\n\n\n\n두 줄"), "한 줄\n\n두 줄");
  assert.equal(shared.visibleLength(shared.cleanBio("ก".repeat(500))), shared.BIO_MAX);
  assert.equal(shared.cleanNickname(42), "");
});

test("이메일·사진·코드 검사", () => {
  assert.equal(shared.normalizeEmail(" Mina@Example.COM "), "mina@example.com");
  assert.equal(shared.normalizeEmail("mina@example"), null);
  assert.equal(shared.normalizeEmail("no at sign"), null);
  assert.equal(shared.cleanPhoto("data:image/jpeg;base64,AAAA"), "data:image/jpeg;base64,AAAA");
  assert.equal(shared.cleanPhoto("data:image/svg+xml;base64,AAAA"), null);
  assert.equal(shared.cleanPhoto("data:image/jpeg;base64," + "A".repeat(200_000)), null);
  assert.ok(shared.isEmailCode("012345"));
  assert.ok(!shared.isEmailCode("12345"));
});

test("코드 메일: 14개 언어 모두 코드와 시간이 들어간다", () => {
  const locales = supportedLetterLocales();
  assert.equal(locales.length, 14);
  for (const locale of locales) {
    const letter = letterFor(locale, "482913", 10);
    assert.ok(letter.subject.includes("482913"), locale);
    assert.ok(letter.body.includes("482913") && letter.body.includes("10"), locale);
    assert.ok(!letter.body.includes("{"), locale);
  }
  assert.equal(letterFor("xx", "1", 10).subject, letterFor("en", "1", 10).subject);
});

test("이메일 계정: 처음엔 이 기기 기록을 계정에 묶고, 다음 기기는 같은 계정", async () => {
  const first = await store.findOrCreateAccount({ kind: "email", email: "a@example.com" }, "rc:device-a");
  assert.equal(first.created, true);
  assert.equal(first.account.dataUserId, "rc:device-a");

  const again = await store.findOrCreateAccount({ kind: "email", email: "a@example.com" }, "rc:device-b");
  assert.equal(again.created, false);
  assert.equal(again.account.id, first.account.id);
  assert.equal(again.account.dataUserId, "rc:device-a");
});

test("기록 없는 기기(웹)는 계정 자신의 id로 시작", async () => {
  const { account } = await store.findOrCreateAccount({ kind: "email", email: "web@example.com" }, "local-anonymous");
  assert.equal(account.dataUserId, `acct:${account.id}`);
});

test("Google로 로그인해도 같은 메일의 이메일 계정과 이어진다", async () => {
  const email = await store.findOrCreateAccount({ kind: "email", email: "same@example.com" }, "rc:p");
  const google = await store.findOrCreateAccount({ kind: "google", sub: "99999", email: "same@example.com", name: "Same" }, "rc:q");
  assert.equal(google.account.id, email.account.id);
  assert.equal(google.account.googleSub, "99999");
  const viaSub = await store.findOrCreateAccount({ kind: "google", sub: "99999", email: null, name: null }, "rc:r");
  assert.equal(viaSub.account.id, email.account.id);
});

test("새 Google 계정은 이름을 닉네임으로", async () => {
  const { account } = await store.findOrCreateAccount({ kind: "google", sub: "11111", email: null, name: "다은" }, "rc:z");
  assert.equal(account.profile.nickname, "다은");
});

test("프로필 저장·사진 넣고 빼기·삭제", async () => {
  const { account } = await store.findOrCreateAccount({ kind: "email", email: "p@example.com" }, "rc:prof");
  const withPhoto = await store.saveProfile(account, { nickname: "Ana", bio: "Aprendo coreano.", photo: "data:image/jpeg;base64,AAAA" });
  const pub = await store.toPublic(withPhoto);
  assert.equal(pub.profile.photo, "data:image/jpeg;base64,AAAA");
  assert.equal(pub.profile.bio, "Aprendo coreano.");

  const kept = await store.saveProfile(withPhoto, { nickname: "Ana", bio: "" });
  assert.equal((await store.toPublic(kept)).profile.photo, "data:image/jpeg;base64,AAAA");
  const removed = await store.saveProfile(kept, { nickname: "Ana", bio: "", photo: null });
  assert.equal((await store.toPublic(removed)).profile.photo, null);

  await store.deleteAccount(removed);
  assert.equal(await store.readAccount(removed.id), null);
  const fresh = await store.findOrCreateAccount({ kind: "email", email: "p@example.com" }, "rc:prof2");
  assert.equal(fresh.created, true);
  assert.ok((await kvListRange(store.PURGE_QUEUE_KEY)).includes("rc:prof"));
});

test("이메일 코드: 맞으면 한 번만, 틀리면 다섯 번에 막힘, 한 시간 다섯 번 발송", async () => {
  const code = await store.createEmailCode("c@example.com");
  assert.ok(code && shared.isEmailCode(code));
  const wrong = code === "000000" ? "111111" : "000000";
  assert.equal(await store.checkEmailCode("c@example.com", wrong), "wrong");
  assert.equal(await store.checkEmailCode("c@example.com", code!), "ok");
  assert.equal(await store.checkEmailCode("c@example.com", code!), "expired");

  const second = await store.createEmailCode("c@example.com");
  const bad = second === "000000" ? "111111" : "000000";
  for (let i = 0; i < store.EMAIL_CODE_ATTEMPTS - 1; i += 1) {
    assert.equal(await store.checkEmailCode("c@example.com", bad), "wrong");
  }
  assert.equal(await store.checkEmailCode("c@example.com", bad), "locked");
  assert.equal(await store.checkEmailCode("c@example.com", second!), "expired");

  for (let i = 2; i < store.EMAIL_SENDS_PER_HOUR; i += 1) assert.ok(await store.createEmailCode("c@example.com"));
  assert.equal(await store.createEmailCode("c@example.com"), null);
});

test("지운 계정 기록 지우기: 그 id 조각이 든 키만", async () => {
  assert.ok(keyBelongsTo("learnerProfile:v1:rc:abc:ja", "rc:abc"));
  assert.ok(!keyBelongsTo("learnerProfile:v1:rc:abcd:ja", "rc:abc"));
  assert.ok(keyBelongsTo("usage:chat:rc:abc", "rc:abc"));

  const { account } = await store.findOrCreateAccount({ kind: "email", email: "gone@example.com" }, "rc:gone1");
  await kvSetJson("ledger:v1:rc:gone1:ja", { a: 1 });
  await kvSetJson("ledger:v1:rc:gone10:ja", { a: 2 });
  await store.deleteAccount(account);
  const preview = await purgeDeletedAccounts({ apply: false });
  assert.equal(preview.preview, true);
  assert.ok(await kvGetJson("ledger:v1:rc:gone1:ja"));
  await purgeDeletedAccounts({ apply: true });
  assert.equal(await kvGetJson("ledger:v1:rc:gone1:ja"), null);
  assert.deepEqual(await kvGetJson("ledger:v1:rc:gone10:ja"), { a: 2 });
  assert.equal((await kvListRange(store.PURGE_QUEUE_KEY)).length, 0);
});
