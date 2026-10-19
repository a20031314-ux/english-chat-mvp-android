import { test } from "node:test";
import assert from "node:assert/strict";
import { fillInvite, inviteCopy, INVITE_COPY_KEYS, INVITE_COPY_LOCALES } from "./copy.ts";
import { parseInviteParams, playStoreUrl, androidIntentUrl, referrerFor, inviteWebUrl } from "./shared.ts";

test("초대 문구: 14개 언어 모두 키가 비지 않고, 자리 표시가 그대로", () => {
  assert.equal(INVITE_COPY_LOCALES.length, 14);
  for (const locale of INVITE_COPY_LOCALES) {
    const t = inviteCopy(locale);
    for (const key of INVITE_COPY_KEYS) assert.ok(t[key]?.trim(), `${locale} ${key}`);
    assert.ok(t.welcomeTitle.includes("{name}"), locale);
    assert.ok(t.pageTitle.includes("{name}"), locale);
    assert.ok(t.shareRoomText.includes("{room}"), locale);
    assert.ok(t.pageRoom.includes("{room}") && t.pageRoom.includes("{n}"), locale);
  }
});

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
