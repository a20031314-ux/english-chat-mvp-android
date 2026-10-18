import { test } from "node:test";
import assert from "node:assert/strict";
import { parseRoomLayout, pendingNotes } from "./layout.ts";

test("보는 방식: 모르는 값·빈 값은 그룹(대화 보기)", () => {
  assert.equal(parseRoomLayout("call"), "call");
  assert.equal(parseRoomLayout("chat"), "chat");
  assert.equal(parseRoomLayout("grid"), "group");
  assert.equal(parseRoomLayout(null), "group");
});

test("쪽지 알림: 이 방에 있는 사람의 안 읽은 대화만, 닫은 것은 다시 안 뜸", () => {
  const row = (other: string, unread: number, id: string, lastSeq: number) => ({ other, unread, thread: { id, lastSeq } });
  const threads = [row("lb_yuki", 1, "t1", 4), row("lb_omar", 0, "t2", 9), row("lb_lucia", 2, "t3", 7)];
  assert.deepEqual(pendingNotes(threads, ["lb_yuki", "lb_omar"], []).map((r) => r.other), ["lb_yuki"]);
  assert.deepEqual(pendingNotes(threads, ["lb_yuki"], ["t1:4"]), []);
  // 같은 대화에 새 쪽지가 오면(번호가 바뀌면) 다시 뜬다.
  assert.equal(pendingNotes([row("lb_yuki", 1, "t1", 5)], ["lb_yuki"], ["t1:4"]).length, 1);
});

test("힌트 살짝만: 첫 낱말, 띄어쓰기 없는 말은 첫 두 글자", async () => {
  const { peekHint } = await import("./layout.ts");
  assert.equal(peekHint("I'm 22 years old."), "I'm …");
  assert.equal(peekHint("Tengo veintidós años."), "Tengo …");
  assert.equal(peekHint("ฉันอายุยี่สิบสองปี", "th"), "ฉัน …");
  assert.equal(peekHint("私は二十二歳です。", "ja").endsWith(" …"), true);
  assert.notEqual(peekHint("私は二十二歳です。", "ja"), "私は二十二歳です。 …");
});
