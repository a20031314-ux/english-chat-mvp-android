/**
 * 단체방 묶음 — 임시 계정 셋(A 방장, B·C 초대받음).
 *
 *   초대로만 만들기 → 초대받은 사람 목록에 초대 표시 → 받기 전엔 줄을 못 보고 못 씀 → B 받기, C 거절
 *   → 글·집어 묻기(인용은 서버가 채움) → C 다시 초대·받기 → 방장 아닌 사람의 내보내기 막힘 → A가 B 내보내기(B는 REMOVED)
 *   → 방장 넘기기(A → C, 옛 방장 권한 없음) → 📞 단체방 통화(비공개, 내보낸 사람은 못 들어옴) → 모두 나가면 통화 기록 → 나가기
 *
 * 이름은 [test], 계정은 숨김·끝에 삭제. 모델 호출 없음. 14명 중 1명.
 */
import { checkHttp, issue } from "../detect.mjs";
import { expectError, makeAccounts } from "../accounts.mjs";

export default {
  id: "groups",
  label: "단체방",
  every: 14,
  note: "임시 계정 3개 — 숨김·끝에 삭제, 이름 [test]",
  estimate() {
    return { requests: 42, usd: 0 };
  },
  async run({ persona, userId, call, bank, step }) {
    const P = "group";
    const acc = makeAccounts({ call, userId, step, prefix: P, persona });
    const lines = (bank.learner[persona.target] ?? []).filter((l) => l.ok).map((l) => l.text);
    const say = (i) => lines[i % Math.max(1, lines.length)] ?? `hello ${i}`;
    let groupId = null;

    try {
      const A = await acc.signup("a", { nickname: bank.nickname[persona.target] });
      const B = await acc.signup("b", { nickname: bank.nickname[persona.ui] });
      const C = await acc.signup("c");
      if (!A || !B || !C) return;

      // ── 만들기·초대 ──
      const made = await acc.groups(A, "create", { name: `[test] ${persona.target}↔${persona.ui} ${persona.id}`, languages: [persona.target, persona.ui], invite: [B.id, C.id] });
      const mIssues = checkHttp(P, made);
      const group = made.body?.group;
      groupId = group?.id ?? null;
      if (made.status === 200) {
        if (!(group?.members ?? []).includes(A.id) || (group?.members ?? []).length !== 1) mIssues.push(issue("error", "group_logic", `만든 직후 사람이 ${JSON.stringify(group?.members)}`));
        if (!(group?.invited ?? []).includes(B.id) || !(group?.invited ?? []).includes(C.id)) mIssues.push(issue("error", "group_logic", "초대 목록에 B·C가 없음"));
      }
      step({ title: "단체방 만들기 (B·C 초대)", status: made.status, ms: made.ms, outputs: [{ label: "단체방", text: `${group?.name ?? "-"} · 초대 ${(group?.invited ?? []).length}` }], issues: mIssues });
      if (!groupId) return;

      const bMine = await acc.groups(B, "mine", {});
      const iIssues = checkHttp(P, bMine);
      const summary = (bMine.body?.groups ?? []).find((g) => g.group?.id === groupId);
      if (bMine.status === 200 && !summary?.invite) iIssues.push(issue("error", "group_logic", "초대받은 사람 목록에 초대 표시가 없음"));
      await acc.groups(A, "send", { groupId, text: say(0) });
      const peek = await acc.groups(B, "open", { groupId });
      if (peek.status === 200 && (peek.body?.messages ?? []).length) iIssues.push(issue("error", "group_logic", "초대만 받은 사람이 줄을 봄"));
      const early = await acc.groups(B, "send", { groupId, text: say(1) });
      iIssues.push(...expectError(P, early, "NOT_MEMBER", "받기 전 글쓰기"));
      step({ title: "B 초대 받은 상태", status: bMine.status, ms: bMine.ms, outputs: [{ label: "목록", text: summary ? `초대 ${summary.invite ? "예" : "아니오"}` : "없음" }, { label: "열기", text: `줄 ${(peek.body?.messages ?? []).length}` }], issues: iIssues });

      // ── 받기·거절 ──
      const bYes = await acc.groups(B, "answer", { groupId, accept: true });
      const cNo = await acc.groups(C, "answer", { groupId, accept: false });
      const aIssues = [...checkHttp(P, bYes), ...checkHttp(P, cNo)];
      if (bYes.status === 200 && !(bYes.body?.group?.members ?? []).includes(B.id)) aIssues.push(issue("error", "group_logic", "받았는데 B가 사람 목록에 없음"));
      const cAfter = await acc.groups(C, "open", { groupId });
      aIssues.push(...expectError(P, cAfter, "NO_GROUP", "거절한 사람이 열기"));
      step({ title: "B 받기 · C 거절", status: bYes.status, ms: bYes.ms, outputs: [{ label: "사람", text: (bYes.body?.group?.members ?? []).length }], issues: aIssues });

      // ── 글·집어 묻기 ──
      const bOpen = await acc.groups(B, "open", { groupId });
      const msgs = bOpen.body?.messages ?? [];
      const aText = msgs.find((m) => m.kind === "text" && m.from === A.id);
      const qIssues = checkHttp(P, bOpen);
      if (bOpen.status === 200 && !aText) qIssues.push(issue("error", "group_logic", "받은 뒤에도 A의 글이 안 보임"));
      const asked = await acc.groups(B, "send", { groupId, text: bank.askMeaning[persona.ui], quoteSeq: aText?.seq, ask: true });
      qIssues.push(...checkHttp(P, asked));
      if (asked.status === 200 && asked.body?.message?.quote?.text !== say(0)) qIssues.push(issue("error", "group_logic", `인용이 다름: ${asked.body?.message?.quote?.text}`));
      const noQuote = await acc.groups(B, "send", { groupId, text: "?", quoteSeq: 99999, ask: true });
      qIssues.push(...expectError(P, noQuote, "NO_QUOTE", "없는 줄 집기"));
      step({ title: "단체방 글 집어 묻기", input: bank.askMeaning[persona.ui], status: asked.status, ms: asked.ms, outputs: [{ label: "인용", text: asked.body?.message?.quote?.text }], issues: qIssues });

      // ── 다시 초대 → 내보내기 ──
      const reinvite = await acc.groups(B, "invite", { groupId, target: C.id });
      const cYes = await acc.groups(C, "answer", { groupId, accept: true });
      const kIssues = [...checkHttp(P, reinvite), ...checkHttp(P, cYes)];
      const notOwner = await acc.groups(B, "kick", { groupId, target: C.id });
      kIssues.push(...expectError(P, notOwner, "NOT_OWNER", "방장 아닌 사람이 내보내기"));
      const kicked = await acc.groups(A, "kick", { groupId, target: B.id });
      kIssues.push(...checkHttp(P, kicked));
      const bGone = await acc.groups(B, "open", { groupId });
      kIssues.push(...expectError(P, bGone, "REMOVED", "내보내진 사람이 열기"));
      step({ title: "B가 C 다시 초대 · A가 B 내보내기", status: kicked.status, ms: kicked.ms, outputs: [{ label: "B", text: bGone.body?.error }], issues: kIssues });

      // ── 방장 넘기기 ──
      const moved = await acc.groups(A, "transfer", { groupId, target: C.id });
      const tIssues = checkHttp(P, moved);
      const aOpen = await acc.groups(A, "open", { groupId });
      if (aOpen.status === 200 && aOpen.body?.group?.owner !== C.id) tIssues.push(issue("error", "group_logic", "넘겼는데 방장이 그대로"));
      const oldOwner = await acc.groups(A, "kick", { groupId, target: C.id });
      tIssues.push(...expectError(P, oldOwner, "NOT_OWNER", "옛 방장이 내보내기"));
      step({ title: "방장 넘기기 (A → C)", status: moved.status, ms: moved.ms, outputs: [{ label: "방장", text: aOpen.body?.group?.owner === C.id ? "C" : "그대로" }], issues: tIssues });

      // ── 📞 단체방 통화 ──
      const callRes = await acc.groups(C, "call", { groupId, peerId: C.peerId });
      const cIssues = checkHttp(P, callRes);
      const room = callRes.body?.room;
      if (room?.id) {
        if (!room.private) cIssues.push(issue("error", "group_logic", "단체방 통화 방이 비공개가 아님"));
        const outsider = await acc.room(B, "join", { roomId: room.id });
        if (outsider.status === 200) cIssues.push(issue("error", "group_logic", "내보낸 사람이 단체방 통화에 들어감"));
        const sameRoom = await acc.groups(A, "call", { groupId, peerId: A.peerId });
        if (sameRoom.body?.room?.id !== room.id) cIssues.push(issue("error", "group_logic", "통화 중인데 다른 사람이 📞를 누르니 새 방이 생김"));
        await acc.room(C, "join", { roomId: room.id });
        await acc.room(A, "join", { roomId: room.id });
        await acc.room(C, "line", { roomId: room.id, kind: "speech", text: say(2), lang: persona.target });
        const live = await acc.groups(A, "open", { groupId });
        if ((live.body?.call?.live ?? 0) < 2) cIssues.push(issue("warn", "group_logic", `통화 중 사람 수가 ${live.body?.call?.live}`));
        await acc.room(C, "leave", { roomId: room.id });
        await acc.room(A, "leave", { roomId: room.id });
        const ended = await acc.groups(A, "endCall", { groupId, roomId: room.id });
        if (ended.body?.logged !== true) cIssues.push(issue("error", "group_logic", `모두 나갔는데 통화 기록이 안 남음: ${JSON.stringify(ended.body)}`));
        const after = await acc.groups(C, "open", { groupId });
        const log = (after.body?.messages ?? []).filter((m) => m.kind === "callLog").pop();
        if (ended.body?.logged && !(log?.lines ?? []).length) cIssues.push(issue("error", "group_logic", "통화 기록에 줄이 없음"));
        step({ title: "📞 단체방 통화 → 기록", status: callRes.status, ms: callRes.ms, outputs: [{ label: "기록", text: (log?.lines ?? []).map((l) => `${l.nickname}: ${l.text}`).join(" / ") }, { label: "내보낸 사람", text: `${outsider.status} ${outsider.body?.error ?? ""}` }], issues: cIssues });
      } else {
        step({ title: "📞 단체방 통화 → 기록", status: callRes.status, ms: callRes.ms, issues: cIssues });
      }
    } finally {
      if (groupId) {
        for (const person of acc.people) await acc.groups(person, "leave", { groupId }).catch(() => undefined);
      }
      await acc.cleanup();
    }
  },
};
