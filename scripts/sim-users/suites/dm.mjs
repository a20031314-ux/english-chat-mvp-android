/**
 * 1:1 메시지 묶음 — 임시 계정 셋(A 먼저 보냄, B 받음, C 낯선 사람).
 *
 *   첫 메시지는 요청(pending) → 답하기 전엔 3번까지만(PENDING_LIMIT) → 받은 사람 목록에 요청 표시 → 답하면 열림
 *   → 남의 메시지 집어 묻기(인용은 서버가 채움) → 📞 둘만의 통화 방(비공개: 남은 못 들어옴) → 둘 다 나가면 통화 기록이 대화에
 *   → 거절하면 보낸 사람은 더 못 보냄(DECLINED) → 차단하면 못 보냄(BLOCKED)
 *
 * 계정은 숨김·끝에 삭제. 모델 호출 없음. 14명 중 1명.
 */
import { checkHttp, checkText, issue } from "../detect.mjs";
import { expectError, makeAccounts } from "../accounts.mjs";

export default {
  id: "dm",
  label: "1:1 메시지",
  every: 14,
  note: "임시 계정 3개 — 숨김·끝에 삭제",
  estimate() {
    return { requests: 40, usd: 0 };
  },
  async run({ persona, userId, call, bank, step }) {
    const P = "dm";
    const acc = makeAccounts({ call, userId, step, prefix: P, persona });
    const lines = (bank.learner[persona.target] ?? []).filter((l) => l.ok).map((l) => l.text);
    const say = (i) => lines[i % Math.max(1, lines.length)] ?? `hello ${i}`;

    try {
      const A = await acc.signup("a", { nickname: bank.nickname[persona.target] });
      const B = await acc.signup("b", { nickname: bank.nickname[persona.ui] });
      const C = await acc.signup("c");
      if (!A || !B || !C) return;

      // ── 요청 ──
      const empty = await acc.dm(A, "open", { target: B.id });
      const rIssues = checkHttp(P, empty);
      if (empty.status === 200 && (empty.body?.thread || (empty.body?.messages ?? []).length)) rIssues.push(issue("error", "dm_logic", "처음인데 대화가 이미 있음"));
      const sent = [];
      for (let i = 0; i < 3; i += 1) sent.push(await acc.dm(A, "send", { target: B.id, text: say(i) }));
      for (const s of sent) rIssues.push(...checkHttp(P, s));
      const threadId = sent[0].body?.thread?.id;
      if (sent[2].body?.thread?.status !== "pending") rIssues.push(issue("error", "dm_logic", `답 전인데 대화가 ${sent[2].body?.thread?.status}`));
      const fourth = await acc.dm(A, "send", { target: B.id, text: say(3) });
      rIssues.push(...expectError(P, fourth, "PENDING_LIMIT", "답 전 4번째 메시지"));
      step({ title: "A가 B에게 첫 메시지 (요청)", input: say(0), status: sent[0].status, ms: sent[0].ms, outputs: [{ label: "상태", text: sent[2].body?.thread?.status }], issues: rIssues });
      if (!threadId) return;

      const inbox = await acc.dm(B, "inbox", {});
      const iIssues = checkHttp(P, inbox);
      const mine = (inbox.body?.threads ?? []).find((t) => t.thread?.id === threadId);
      if (inbox.status === 200) {
        if (!mine) iIssues.push(issue("error", "dm_logic", "받은 사람 목록에 대화가 없음"));
        else {
          if (!mine.request) iIssues.push(issue("error", "dm_logic", "받은 사람에게 요청 표시가 없음"));
          if ((mine.unread ?? 0) < 3) iIssues.push(issue("warn", "dm_logic", `안 읽은 수가 ${mine.unread}`));
        }
      }
      step({ title: "B 받은 목록", status: inbox.status, ms: inbox.ms, outputs: [{ label: "요청", text: mine ? `요청 ${mine.request ? "예" : "아니오"} · 안 읽음 ${mine.unread}` : "" }], issues: iIssues });

      const reply = await acc.dm(B, "send", { target: A.id, text: say(4) });
      const oIssues = checkHttp(P, reply);
      if (reply.status === 200 && reply.body?.thread?.status !== "open") oIssues.push(issue("error", "dm_logic", `답했는데 대화가 ${reply.body?.thread?.status}`));
      const more = await acc.dm(A, "send", { target: B.id, text: say(5) });
      oIssues.push(...checkHttp(P, more));
      const aPoll = await acc.dm(A, "poll", { threadId, since: 0 });
      const count = (aPoll.body?.messages ?? []).filter((m) => m.kind === "text").length;
      if (aPoll.status === 200 && count !== 5) oIssues.push(issue("error", "dm_logic", `메시지가 ${count}개(5개여야)`));
      step({ title: "B가 답하면 대화 열림", input: say(4), status: reply.status, ms: reply.ms, outputs: [{ label: "대화", text: `${reply.body?.thread?.status} · 메시지 ${count}` }], issues: oIssues });

      // ── 집어 묻기 ──
      const firstSeq = (aPoll.body?.messages ?? []).find((m) => m.from === A.id)?.seq;
      const asked = await acc.dm(B, "send", { target: A.id, text: bank.askMeaning[persona.ui], quoteSeq: firstSeq, ask: true });
      const qIssues = checkHttp(P, asked);
      const quote = asked.body?.message?.quote;
      if (asked.status === 200) {
        if (quote?.text !== say(0)) qIssues.push(issue("error", "dm_logic", `인용이 다름: ${quote?.text}`));
        if (asked.body?.message?.ask !== true) qIssues.push(issue("error", "dm_logic", "묻기 표시가 없음"));
        qIssues.push(...checkText(P, persona, asked.body?.message?.text, { lang: null, label: "질문" }));
      }
      const noQuote = await acc.dm(B, "send", { target: A.id, text: "?", quoteSeq: 99999, ask: true });
      qIssues.push(...expectError(P, noQuote, "NO_QUOTE", "없는 메시지 집기"));
      step({ title: "메시지 집어 \"무슨 뜻이에요?\"", input: bank.askMeaning[persona.ui], status: asked.status, ms: asked.ms, outputs: [{ label: "인용", text: quote?.text }], issues: qIssues });

      // ── 둘만의 통화 ──
      const callRes = await acc.dm(A, "call", { threadId, peerId: A.peerId });
      const cIssues = checkHttp(P, callRes);
      const callRoom = callRes.body?.room;
      if (callRes.status === 200) {
        if (!callRoom?.private) cIssues.push(issue("error", "dm_logic", "1:1 통화 방이 비공개가 아님"));
        if (callRes.body?.message?.kind !== "call") cIssues.push(issue("error", "dm_logic", "대화에 통화 줄이 없음"));
      }
      if (callRoom?.id) {
        const stranger = await acc.room(C, "join", { roomId: callRoom.id });
        if (stranger.status === 200) cIssues.push(issue("error", "dm_logic", "남이 1:1 통화 방에 들어감"));
        const publicList = await acc.room(C, "list", {});
        if ((publicList.body?.rooms ?? []).some((r) => r.id === callRoom.id)) cIssues.push(issue("error", "dm_logic", "1:1 통화 방이 공개 목록에 보임"));
        const aJoin = await acc.room(A, "join", { roomId: callRoom.id });
        const bJoin = await acc.room(B, "join", { roomId: callRoom.id });
        cIssues.push(...checkHttp(P, aJoin), ...checkHttp(P, bJoin));
        if (bJoin.status === 200 && bJoin.body?.member?.role !== "speaker") cIssues.push(issue("error", "dm_logic", `1:1 통화인데 B가 ${bJoin.body?.member?.role}`));
        await acc.room(A, "line", { roomId: callRoom.id, kind: "speech", text: say(1), lang: persona.target });
        await acc.room(B, "line", { roomId: callRoom.id, kind: "speech", text: say(2), lang: persona.target });
        await acc.room(A, "leave", { roomId: callRoom.id });
        await acc.room(B, "leave", { roomId: callRoom.id });
        const ended = await acc.dm(B, "endCall", { roomId: callRoom.id });
        if (ended.body?.logged !== true) cIssues.push(issue("error", "dm_logic", `둘 다 나갔는데 통화 기록이 안 남음: ${JSON.stringify(ended.body)}`));
        const after = await acc.dm(A, "poll", { threadId, since: 0 });
        const log = (after.body?.messages ?? []).filter((m) => m.kind === "callLog").pop();
        if (ended.body?.logged && (log?.lines ?? []).length !== 2) cIssues.push(issue("error", "dm_logic", `통화 기록 줄이 ${(log?.lines ?? []).length}개(2개여야)`));
        step({ title: "📞 둘만의 통화 → 기록", status: callRes.status, ms: callRes.ms, outputs: [{ label: "기록", text: (log?.lines ?? []).map((l) => `${l.nickname}: ${l.text}`).join(" / ") }, { label: "낯선 사람", text: `${stranger.status} ${stranger.body?.error ?? ""}` }], issues: cIssues });
      } else {
        step({ title: "📞 둘만의 통화 → 기록", status: callRes.status, ms: callRes.ms, issues: cIssues });
      }

      // ── 거절 ──
      const cSend = await acc.dm(C, "send", { target: B.id, text: say(6) });
      const cThread = cSend.body?.thread?.id;
      const declined = cThread ? await acc.dm(B, "decline", { threadId: cThread }) : { status: 0, body: {} };
      const dIssues = [...checkHttp(P, cSend), ...checkHttp(P, declined)];
      const again = await acc.dm(C, "send", { target: B.id, text: say(7) });
      dIssues.push(...expectError(P, again, "DECLINED", "거절당한 뒤 다시 보내기"));
      step({ title: "B가 C의 요청 거절", status: declined.status, ms: declined.ms, outputs: [{ label: "C 다시 보내기", text: again.body?.error }], issues: dIssues });

      // ── 차단 ──
      const blocked = await acc.social(A, "block", { target: B.id });
      const bIssues = checkHttp(P, blocked);
      const fromB = await acc.dm(B, "send", { target: A.id, text: say(8) });
      bIssues.push(...expectError(P, fromB, "BLOCKED", "차단당한 뒤 보내기"));
      const opened = await acc.dm(B, "open", { target: A.id });
      if (opened.status === 200 && opened.body?.blocked !== true) bIssues.push(issue("warn", "dm_logic", "차단된 대화를 열었는데 blocked 표시가 없음"));
      await acc.social(A, "unblock", { target: B.id });
      step({ title: "A가 B 차단 → 못 보냄", status: blocked.status, ms: blocked.ms, outputs: [{ label: "B 보내기", text: fromB.body?.error }], issues: bIssues });
    } finally {
      await acc.cleanup();
    }
  },
};
