import { test } from "node:test";
import assert from "node:assert/strict";
import { fillInvite, inviteCopy } from "./copy.ts";
import { parseInviteParams, playStoreUrl, androidIntentUrl, referrerFor, inviteWebUrl } from "./shared.ts";
test("이름 채우기: 일본어·아랍어 이름, 이름 안의 {n}은 다시 바꾸지 않음", () => {
  assert.equal(fillInvite(inviteCopy("ja").welcomeTitle, { name: "さくら" }), "さくらさんから招待が届きました");
  assert.equal(fillInvite(inviteCopy("ar").welcomeTitle, { name: "ليلى" }), "دعاك ليلى");
  assert.equal(fillInvite("{name}·{n}", { name: "{n}", n: 3 }), "{n}·3");
});

test("초대 주소 → Play 설치 경로 → 앱이 되읽기", () => {
  const invite = { code: "ab3cd4ef", room: "k2m3n4" };
  assert.equal(inviteWebUrl(invite.code, invite.room), "https://www.languagebank.net/invite?c=ab3cd4ef&room=k2m3n4");
  assert.deepEqual(parseInviteParams(referrerFor(invite), "invite"), invite);
  const play = new URL(playStoreUrl(invite));
  assert.deepEqual(parseInviteParams(play.searchParams.get("referrer") ?? "", "invite"), invite);
  assert.ok(androidIntentUrl(invite).startsWith("intent://invite?c=ab3cd4ef&room=k2m3n4#Intent;scheme=languagebank;package=com.yourname.englishchat;"));
  assert.equal(parseInviteParams("?c=../../x"), null);
  assert.deepEqual(parseInviteParams("?c=AB3CD4EF"), { code: "ab3cd4ef", room: null });
});
