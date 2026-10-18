/**
 * 사람·친구 초대 묶음 — 임시 계정 둘(A 초대한 사람, B 링크로 온 사람).
 *
 *   내 초대 코드 → 로그인 없이 링크 열기(초대한 사람 이름·사진, 공개 방이면 방) → 없는 코드는 막힘
 *   → B가 받기 = 서로 팔로우 → 내 코드로 받기는 self → 비공개(1:1 통화) 방은 링크에 안 나옴
 *   → 사람 목록: 숨김 계정·나 자신은 안 나옴
 *
 * 테스트 계정은 숨김이라 실제 사용자의 사람 목록에 뜨지 않는다. 모델 호출 없음. 14명 중 1명.
 */
import { checkHttp, issue } from "../detect.mjs";
import { expectError, makeAccounts } from "../accounts.mjs";

export default {
  id: "people",
  label: "사람·친구 초대",
  every: 14,
  note: "임시 계정 2개 — 숨김·끝에 삭제",
  estimate() {
    return { requests: 22, usd: 0 };
  },
  async run({ persona, userId, call, bank, step }) {
    const P = "people";
    const acc = makeAccounts({ call, userId, step, prefix: P, persona });

    try {
      const A = await acc.signup("a", { nickname: bank.nickname[persona.ui], bio: bank.mapGoal[persona.ui] });
      const B = await acc.signup("b", { nickname: bank.nickname[persona.target] });
      if (!A || !B) return;

      // ── 초대 코드·링크 ──
      const mine = await acc.as(A, "/api/invite", { body: { action: "mine" } });
      const code = mine.body?.code;
      const mIssues = checkHttp(P, mine);
      if (mine.status === 200 && !code) mIssues.push(issue("error", "people_shape", "초대 코드가 없음"));
      const again = await acc.as(A, "/api/invite", { body: { action: "mine" } });
      if (code && again.body?.code !== code) mIssues.push(issue("warn", "people_logic", "다시 물으니 초대 코드가 바뀜"));
      step({ title: "내 초대 코드 (A)", status: mine.status, ms: mine.ms, outputs: [{ label: "코드", text: code }], issues: mIssues });
      if (!code) return;

      const room = await acc.room(A, "create", { name: `[test] invite ${persona.id}`, languages: [persona.target, persona.ui] });
      const roomId = room.body?.room?.id;
      if (roomId) await acc.room(A, "join", { roomId });
      const lookup = await call(`${userId}-anon`, "/api/invite", { body: { action: "lookup", c: code, ...(roomId ? { room: roomId } : {}) } });
      const lIssues = checkHttp(P, lookup);
      if (lookup.status === 200) {
        if (lookup.body?.inviter?.nickname !== A.nickname) lIssues.push(issue("error", "people_logic", `링크의 이름이 다름: ${lookup.body?.inviter?.nickname}`));
        if (lookup.body?.isMe) lIssues.push(issue("error", "people_logic", "로그인 안 한 사람인데 isMe=true"));
        if (roomId && lookup.body?.room?.id !== roomId) lIssues.push(issue("error", "people_logic", "공개 방 초대인데 링크에 방이 없음"));
        if ("username" in (lookup.body?.inviter ?? {}) || "email" in (lookup.body?.inviter ?? {})) lIssues.push(issue("error", "people_logic", "링크에 아이디·이메일이 나옴"));
      }
      const badCode = await call(`${userId}-anon`, "/api/invite", { body: { action: "lookup", c: "zzzzzzzz" } });
      if (badCode.status === 200) lIssues.push(issue("error", "people_logic", "없는 초대 코드가 통과"));
      step({ title: "로그인 없이 초대 링크 열기", status: lookup.status, ms: lookup.ms, outputs: [{ label: "보이는 것", text: `${lookup.body?.inviter?.nickname ?? "-"} · 방 ${lookup.body?.room?.name ?? "없음"}` }, { label: "없는 코드", text: `${badCode.status} ${badCode.body?.error ?? ""}` }], issues: lIssues });
      if (roomId) await acc.room(A, "leave", { roomId });

      // ── 받기 = 서로 팔로우 ──
      const accepted = await acc.as(B, "/api/invite", { body: { action: "accept", c: code } });
      const aIssues = checkHttp(P, accepted);
      const bSeesA = await acc.social(B, "profile", { target: A.id });
      const aSeesB = await acc.social(A, "profile", { target: B.id });
      if (accepted.status === 200) {
        if (accepted.body?.inviterId !== A.id) aIssues.push(issue("error", "people_logic", "받기 결과의 초대한 사람이 다름"));
        if (!bSeesA.body?.profile?.isFollowing) aIssues.push(issue("error", "people_logic", "초대를 받았는데 B가 A를 팔로우하지 않음"));
        if (!aSeesB.body?.profile?.isFollowing) aIssues.push(issue("error", "people_logic", "초대를 받았는데 A가 B를 팔로우하지 않음"));
      }
      const self = await acc.as(A, "/api/invite", { body: { action: "accept", c: code } });
      if (self.body?.self !== true) aIssues.push(issue("error", "people_logic", `내 코드로 받기가 self가 아님: ${JSON.stringify(self.body)}`));
      step({ title: "B가 초대 받기 → 서로 팔로우", status: accepted.status, ms: accepted.ms, outputs: [{ label: "팔로우", text: `B→A ${bSeesA.body?.profile?.isFollowing ? "예" : "아니오"} · A→B ${aSeesB.body?.profile?.isFollowing ? "예" : "아니오"}` }], issues: aIssues });

      // ── 비공개 방은 링크에 안 나옴 ──
      await acc.dm(A, "send", { target: B.id, text: "hi" });
      const reply = await acc.dm(B, "send", { target: A.id, text: "hi" });
      const threadId = reply.body?.thread?.id;
      const callRes = threadId ? await acc.dm(A, "call", { threadId, peerId: A.peerId }) : null;
      const privateId = callRes?.body?.room?.id;
      const pIssues = [];
      if (privateId) {
        const leak = await call(`${userId}-anon`, "/api/invite", { body: { action: "lookup", c: code, room: privateId } });
        if (leak.body?.room) pIssues.push(issue("error", "people_logic", "1:1 통화 방이 초대 링크에 나옴"));
        step({ title: "비공개 방은 링크에 안 나옴", status: leak.status, ms: leak.ms, outputs: [{ label: "방", text: leak.body?.room ? "보임" : "안 보임" }], issues: pIssues });
      }

      // ── 사람 목록 ──
      const pinged = await acc.social(A, "ping", { learn: persona.target, ui: persona.ui });
      const list = await acc.social(B, "people", { learn: persona.target, ui: persona.ui });
      const sIssues = [...checkHttp(P, pinged), ...checkHttp(P, list)];
      const people = list.body?.people ?? [];
      if (list.status === 200) {
        if (people.some((p) => p.id === A.id)) sIssues.push(issue("error", "people_logic", "숨김 계정이 사람 목록에 나옴"));
        if (people.some((p) => p.id === B.id)) sIssues.push(issue("error", "people_logic", "사람 목록에 나 자신이 나옴"));
        if (people.some((p) => !p.nickname)) sIssues.push(issue("warn", "people_logic", "이름 없는 사람이 목록에 나옴"));
        if (people.length > 60) sIssues.push(issue("warn", "people_logic", `사람 목록이 ${people.length}명(60명까지)`));
      }
      const signedOut = await call(`${userId}-anon`, "/api/social", { body: { action: "people" } });
      sIssues.push(...expectError(P, signedOut, "SIGNED_OUT", "로그인 없이 사람 목록"));
      step({ title: "사람 목록", status: list.status, ms: list.ms, outputs: [{ label: "목록", text: `${people.length}명 · 숨김 계정 ${people.some((p) => p.id === A.id) ? "보임" : "안 보임"}` }], issues: sIssues });
    } finally {
      await acc.cleanup();
    }
  },
};
