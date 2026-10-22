import assert from "node:assert/strict";
import test from "node:test";

delete process.env.KV_REST_API_URL;
delete process.env.KV_REST_API_TOKEN;
delete process.env.UPSTASH_REDIS_REST_URL;
delete process.env.UPSTASH_REDIS_REST_TOKEN;

const { recordThank, readContrib, creditFixedFeedback, markStudyDay, forgetContrib } = await import("./contribStore.ts");
const { addLine } = await import("./roomStore.ts");
const { send } = await import("./dmStore.ts");
const { createPost, addComment } = await import("./boardStore.ts");
const { block } = await import("./socialStore.ts");
const { kvSetJson } = await import("./kv.ts");

const originalWarn = console.warn;
console.warn = () => {};
test.after(() => {
  console.warn = originalWarn;
});

const DAY = 24 * 60 * 60 * 1000;
const asker = "lb_" + "1".repeat(24);
const answerer = "lb_" + "2".repeat(24);
const stranger = "lb_" + "3".repeat(24);
const fresh = "lb_" + "4".repeat(24);

async function seedAccount(id: string, createdAt: number) {
  await kvSetJson(`account:v1:${id}`, {
    id,
    createdAt: new Date(createdAt).toISOString(),
    dataUserId: `acct:${id}`,
    email: null,
    googleSub: null,
    profile: { nickname: id.slice(-4), bio: "", hasPhoto: false, updatedAt: new Date(createdAt).toISOString() },
  });
}

await seedAccount(asker, Date.now() - 30 * DAY);
await seedAccount(answerer, Date.now() - 30 * DAY);
await seedAccount(stranger, Date.now() - 30 * DAY);
await seedAccount(fresh, Date.now() - DAY);

function speech(accountId: string, text: string, extra: Record<string, unknown> = {}) {
  return { kind: "text" as const, peerId: accountId.slice(-6), accountId, nickname: "n", text, startedAt: Date.now(), endedAt: Date.now(), ...extra };
}

test("방: 내 ❓ 질문에 단 답만, 질문하지 않은 사람은 못 누른다", async () => {
  const room = "ja-r1";
  const said = await addLine(room, speech(answerer, "それはいいですね"));
  const asked = await addLine(room, speech(asker, "これ、どういう意味ですか？", { quote: { seq: said.seq, nickname: "n", text: said.text, accountId: answerer }, ask: true }));
  const answer = await addLine(room, speech(answerer, "좋다는 뜻이에요", { quote: { seq: asked.seq, nickname: "n", text: asked.text, accountId: asker } }));

  const notAsker = await recordThank({ me: stranger, target: { kind: "room", roomId: room, seq: answer.seq }, lang: "ja", day: "2026-10-23" });
  assert.deepEqual(notAsker, { error: "NOT_ASKER" });
  const ok = await recordThank({ me: asker, target: { kind: "room", roomId: room, seq: answer.seq }, lang: "ja", day: "2026-10-23" });
  assert.deepEqual(ok, { ok: true, counted: true });
  const again = await recordThank({ me: asker, target: { kind: "room", roomId: room, seq: answer.seq }, lang: "ja", day: "2026-10-24" });
  assert.deepEqual(again, { error: "ALREADY" });
  // 질문 줄이 아닌 줄(인용만 한 보통 댓글)에 단 답은 안 된다.
  const plainQuote = await addLine(room, speech(asker, "そうですね", { quote: { seq: said.seq, nickname: "n", text: said.text, accountId: answerer } }));
  const reply = await addLine(room, speech(answerer, "네", { quote: { seq: plainQuote.seq, nickname: "n", text: plainQuote.text, accountId: asker } }));
  assert.deepEqual(await recordThank({ me: asker, target: { kind: "room", roomId: room, seq: reply.seq }, lang: "ja", day: "2026-10-25" }), { error: "NOT_ASKER" });

  const summary = await readContrib(answerer);
  assert.equal(summary.help, 1);
  assert.deepEqual(summary.helpByLang, { ja: 1 });
});

test("쪽지: 같은 대화에서 내 질문을 집은 답만, 같은 두 사람은 하루 한 번", async () => {
  const first = await send({ from: answerer, to: asker, kind: "text", text: "Me encanta" });
  assert.ok(first.ok);
  const asked = await send({ from: asker, to: answerer, kind: "text", text: "¿Qué significa esto?", quote: { seq: first.ok ? first.message.seq : 0, nickname: "n", text: "Me encanta" }, ask: true });
  assert.ok(asked.ok);
  const answer = await send({ from: answerer, to: asker, kind: "text", text: "정말 좋아한다는 뜻", quote: { seq: asked.ok ? asked.message.seq : 0, nickname: "n", text: "q" } });
  assert.ok(answer.ok);
  if (!answer.ok) return;
  const threadId = answer.thread.id;
  const sameDayOther = await recordThank({ me: asker, target: { kind: "dm", threadId, seq: answer.message.seq }, lang: "es", day: "2026-10-23" });
  // 방에서 오늘 이미 이 사람에게 눌렀다 — 같은 두 사람 하루 한 번.
  assert.deepEqual(sameDayOther, { error: "TODAY" });
  const nextDay = await recordThank({ me: asker, target: { kind: "dm", threadId, seq: answer.message.seq }, lang: "es", day: "2026-10-26" });
  assert.deepEqual(nextDay, { ok: true, counted: true });
  // 대화에 없는 사람은 대화를 못 찾는다.
  assert.deepEqual(await recordThank({ me: stranger, target: { kind: "dm", threadId, seq: answer.message.seq }, lang: "es", day: "2026-10-26" }), { error: "NOT_FOUND" });
});

test("게시판: 내 글의 댓글·내 댓글 아래 답글만, 자기 댓글은 안 된다", async () => {
  const post = await createPost({ author: asker, language: "th", text: "ช่วยด้วย", boostMs: 99 * DAY });
  assert.ok("ok" in post);
  if (!("ok" in post)) return;
  const comment = await addComment({ author: stranger, postId: post.ok.id, text: "답" });
  const mine = await addComment({ author: asker, postId: post.ok.id, text: "고마워요" });
  assert.ok("ok" in comment && "ok" in mine);
  if (!("ok" in comment) || !("ok" in mine)) return;
  assert.deepEqual(await recordThank({ me: answerer, target: { kind: "board", postId: post.ok.id, commentId: comment.ok.id }, lang: "th", day: "2026-10-23" }), { error: "NOT_ASKER" });
  assert.deepEqual(await recordThank({ me: asker, target: { kind: "board", postId: post.ok.id, commentId: mine.ok.id }, lang: "th", day: "2026-10-23" }), { error: "SELF" });
  assert.deepEqual(await recordThank({ me: asker, target: { kind: "board", postId: post.ok.id, commentId: comment.ok.id }, lang: "th", day: "2026-10-23" }), { ok: true, counted: true });
});

test("새 계정이 누른 것은 숫자에 안 들어가고, 서로 차단한 사이는 안 된다", async () => {
  const post = await createPost({ author: fresh, language: "en", text: "help" });
  if (!("ok" in post)) return assert.fail("post");
  const comment = await addComment({ author: stranger, postId: post.ok.id, text: "sure" });
  if (!("ok" in comment)) return assert.fail("comment");
  const before = (await readContrib(stranger)).help;
  assert.deepEqual(await recordThank({ me: fresh, target: { kind: "board", postId: post.ok.id, commentId: comment.ok.id }, lang: "en", day: "2026-10-23" }), { ok: true, counted: false });
  assert.equal((await readContrib(stranger)).help, before);

  const post2 = await createPost({ author: answerer, language: "en", text: "q" });
  if (!("ok" in post2)) return assert.fail("post2");
  const c2 = await addComment({ author: stranger, postId: post2.ok.id, text: "a" });
  if (!("ok" in c2)) return assert.fail("c2");
  await block(stranger, answerer);
  assert.deepEqual(await recordThank({ me: answerer, target: { kind: "board", postId: post2.ok.id, commentId: c2.ok.id }, lang: "en", day: "2026-10-23" }), { error: "BLOCKED" });
});

test("반영된 의견은 카드마다 한 번, 공부한 날은 하루 한 번, 계정을 지우면 요약도", async () => {
  assert.equal(await creditFixedFeedback(asker, ["card-1", "card-1", "card-2"]), 2);
  assert.equal(await creditFixedFeedback(asker, ["card-2"]), 0);
  await markStudyDay(asker, "2026-10-22");
  await markStudyDay(asker, "2026-10-22");
  await markStudyDay(asker, "2026-10-23");
  const summary = await readContrib(asker);
  assert.equal(summary.made, 2);
  assert.deepEqual(summary.days, ["2026-10-22", "2026-10-23"]);
  assert.equal(summary.gave[answerer] !== undefined, true);
  await forgetContrib(asker);
  assert.equal((await readContrib(asker)).made, 0);
});
