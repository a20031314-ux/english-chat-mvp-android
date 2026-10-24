import { test } from "node:test";
import assert from "node:assert/strict";
import { createPost } from "./boardStore.ts";
import { groupForPost, joinPostGroup, roomForPost, withLinks } from "./boardLinks.ts";
import { createGroup, kickFromGroup, readGroup, requestMate } from "./groupStore.ts";
import { createRoom, joinRoom } from "./roomStore.ts";
import { block } from "./socialStore.ts";

// KV 접속 정보 없이 메모리로(kv.ts).
const ok = <T>(result: { ok: T } | { error: string }): T => {
  assert.ok("ok" in result, JSON.stringify(result));
  return (result as { ok: T }).ok;
};

test("a recruiting post lets readers join the writer's group at once", async () => {
  const group = await createGroup({ owner: "acc_recruit1", name: "日本語 夜の勉強会", languages: ["ja", "ko"], invite: [] });
  assert.ok(await groupForPost("acc_recruit1", group.id));
  assert.ok(!(await groupForPost("acc_outside1", group.id)));
  const post = ok(await createPost({ author: "acc_recruit1", language: "ja", text: "毎晩9時に話しましょう", topic: "group", groupId: group.id }));

  const [seen] = await withLinks("acc_reader01", [post]);
  assert.equal(seen!.group!.joined, false);
  assert.equal(seen!.group!.members, 1);

  const joined = ok(await joinPostGroup("acc_reader01", post));
  assert.equal(joined.joined, true);
  assert.ok((await readGroup(group.id))!.members.includes("acc_reader01"));
  // 다시 눌러도 그대로.
  assert.equal(ok(await joinPostGroup("acc_reader01", post)).members, 2);

  // 방장이 내보낸 사람·서로 차단한 사람은 글로 다시 못 들어온다.
  await kickFromGroup("acc_recruit1", group.id, "acc_reader01");
  assert.deepEqual(await joinPostGroup("acc_reader01", post), { error: "FORBIDDEN" });
  await block("acc_reader02", "acc_recruit1");
  assert.deepEqual(await joinPostGroup("acc_reader02", post), { error: "FORBIDDEN" });
  // 글쓴이 자신은 누를 일이 없다.
  assert.deepEqual(await joinPostGroup("acc_recruit1", post), { error: "FORBIDDEN" });
});

test("a mate pair cannot be posted as a group to join", async () => {
  await requestMate("acc_mate0001", "acc_mate0002", ["es", "ar"]);
  const { group } = await requestMate("acc_mate0002", "acc_mate0001", ["es", "ar"]);
  assert.equal(group.team?.kind, "mate");
  assert.ok(!(await groupForPost("acc_mate0001", group.id)));
});

test("a voice-room post shows whether the writer's public room is still open", async () => {
  const room = await createRoom({ name: "Charla en español", languages: ["es", "ar"], hostPeerId: "peer_boardhost", hostAccountId: "acc_roomhost" });
  assert.ok(await roomForPost("acc_roomhost", room.id));
  assert.ok(!(await roomForPost("acc_someone1", room.id)));
  const priv = await createRoom({ name: "dm", languages: [], hostPeerId: "peer_boardpriv", hostAccountId: "acc_roomhost", private: true, allowed: ["acc_roomhost"] });
  assert.ok(!(await roomForPost("acc_roomhost", priv.id)));

  const post = ok(await createPost({ author: "acc_roomhost", language: "es", text: "¡Vengan a hablar!", topic: "room", roomId: room.id }));
  assert.equal((await withLinks("acc_reader03", [post]))[0]!.room!.open, false);
  await joinRoom({ id: room.id, peerId: "peer_boardhost", nickname: "Ana", wantRole: "speaker", accountId: "acc_roomhost" });
  const [open] = await withLinks("acc_reader03", [post]);
  assert.equal(open!.room!.open, true);
  assert.equal(open!.room!.name, "Charla en español");
});
