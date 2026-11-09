import { test } from "node:test";
import assert from "node:assert/strict";
import { claimMedia, readMediaMeta, sweepMedia, uploadMedia, type MediaMeta } from "./mediaStore.ts";
import { kvListPush, kvSetJson } from "./kv.ts";
import { newMediaId } from "../rooms/media.ts";
test("저장소 없으면 올리기는 UNAVAILABLE(검사도 안 부름)", async () => {
  const saved = process.env.BLOB_READ_WRITE_TOKEN;
  delete process.env.BLOB_READ_WRITE_TOKEN;
  let checked = false;
  const result = await uploadMedia({ owner: "acct_a", place: { kind: "board" }, bytes: new Uint8Array([1]), type: "image/webp", w: 1, h: 1, dailyLimit: 10, check: async () => (checked = true) });
  assert.deepEqual(result, { ok: false, error: "UNAVAILABLE" });
  assert.equal(checked, false);
  if (saved) process.env.BLOB_READ_WRITE_TOKEN = saved;
});

async function seed(meta: Partial<MediaMeta> & { id: string }): Promise<void> {
  const full: MediaMeta = { owner: "acct_owner", path: `media/${meta.id}.webp`, type: "image/webp", w: 640, h: 480, bytes: 100, place: { kind: "dm", threadId: "t1" }, createdAt: 0, used: false, expiresAt: 1000, ...meta };
  await kvSetJson(`media:v1:meta:${meta.id}`, full);
}

test("붙이기: 올린 사람·같은 곳·한 번만, 1:1은 30일 뒤 지울 날로", async () => {
  const id = newMediaId();
  await seed({ id });
  assert.equal(await claimMedia(id, "acct_someone", { kind: "dm", threadId: "t1" }), null);
  assert.equal(await claimMedia(id, "acct_owner", { kind: "dm", threadId: "t2" }), null);
  assert.equal(await claimMedia(id, "acct_owner", { kind: "group", groupId: "g_aaaaaaaaaa" }), null);
  const now = Date.UTC(2026, 9, 20);
  assert.deepEqual(await claimMedia(id, "acct_owner", { kind: "dm", threadId: "t1" }, now), { id, w: 640, h: 480 });
  const meta = await readMediaMeta(id);
  assert.equal(meta?.used, true);
  assert.equal(meta?.expiresAt, now + 30 * 24 * 60 * 60 * 1000);
  assert.equal(await claimMedia(id, "acct_owner", { kind: "dm", threadId: "t1" }), null);
  // 게시판에 붙은 사진은 지울 날이 없다(글과 함께).
  const board = newMediaId();
  await seed({ id: board, place: { kind: "board" } });
  await claimMedia(board, "acct_owner", { kind: "board" });
  assert.equal((await readMediaMeta(board))?.expiresAt, null);
});

test("매일 정리: 기간 지난 것만 지우고 게시판·늘어난 것은 둔다", async () => {
  const now = Date.UTC(2026, 9, 21, 12);
  const day = new Date(now).toISOString().slice(0, 10);
  const gone = newMediaId();
  const kept = newMediaId();
  const board = newMediaId();
  await seed({ id: gone, expiresAt: now - 1000 });
  await seed({ id: kept, expiresAt: now + 30 * 24 * 60 * 60 * 1000, used: true });
  await seed({ id: board, expiresAt: null, used: true, place: { kind: "board", postId: "b_x" } });
  await kvListPush(`media:v1:sweep:${day}`, [gone, kept, board]);
  const result = await sweepMedia(now, 1);
  assert.equal(result.deleted, 1);
  assert.equal(await readMediaMeta(gone), null);
  assert.ok(await readMediaMeta(kept));
  assert.ok(await readMediaMeta(board));
});
