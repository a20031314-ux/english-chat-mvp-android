/**
 * 말하는 방 새 기능 묶음(2026-10-18~19 추가분) — 임시 계정 셋(A 방장, B 손님, C 구경).
 *
 *   언어로 거르기(내 조합이면 보이고, 상관없는 언어면 안 보임) · 🌐 자유 대화방(어떤 언어로 걸러도 보임, 방장이 나가면 사라짐)
 *   · 채팅만 참여(textOnly) · 남의 줄 집어 묻기(인용은 서버가 채움, 없는 줄은 NO_QUOTE) · 방 줄을 쪽지(1:1)로 묻기
 *   · 방장 넘기기(듣는 사람에겐 안 됨 → 올린 뒤 넘김 → 옛 방장은 권한 없음) · 잠시 닫기 → 내 방 목록 → 다시 열기(같은 번호)
 *   · 방장이 나가면 방이 닫힘(남은 사람은 방 없음)
 *
 * 방 이름은 [test], 계정은 숨김·끝에 삭제. 모델 호출 없음(쪽지는 글만). 14명 중 1명.
 */
import { LANGUAGES } from "../personas.mjs";
import { checkHttp, issue } from "../detect.mjs";
import { expectError, makeAccounts } from "../accounts.mjs";

export default {
  id: "roomsplus",
  label: "말하는 방 새 기능",
  every: 14,
  note: "임시 계정 3개 — 숨김·끝에 삭제, 방 이름 [test]",
  estimate() {
    return { requests: 48, usd: 0 };
  },
  async run({ persona, userId, call, bank, step }) {
    const P = "rooms";
    const acc = makeAccounts({ call, userId, step, prefix: P, persona });
    const lines = (bank.learner[persona.target] ?? []).filter((l) => l.ok).map((l) => l.text);
    const other = LANGUAGES.find((l) => l !== persona.target && l !== persona.ui);
    const inList = (res, id) => (res.body?.rooms ?? []).some((r) => r.id === id);

    try {
      const A = await acc.signup("a", { nickname: `${bank.nickname[persona.target]}✦` });
      const B = await acc.signup("b", { nickname: bank.nickname[persona.ui] });
      const C = await acc.signup("c");
      if (!A || !B || !C) return;

      // ── 언어 조합 방 + 거르기 ──
      const created = await acc.room(A, "create", { name: `[test] ${persona.target}↔${persona.ui} ${persona.id}`, languages: [persona.target, persona.ui] });
      const roomId = created.body?.room?.id;
      step({ title: "방 만들기 (A)", status: created.status, ms: created.ms, outputs: [{ label: "방", text: roomId }], issues: checkHttp(P, created) });
      if (!roomId) return;
      await acc.room(A, "join", { roomId, langs: [persona.target, persona.ui] });

      const mineLang = await acc.room(C, "list", { langs: [persona.target] });
      const otherLang = await acc.room(C, "list", { langs: [other] });
      const fIssues = [...checkHttp(P, mineLang), ...checkHttp(P, otherLang)];
      if (mineLang.status === 200 && !inList(mineLang, roomId)) fIssues.push(issue("error", "rooms_logic", `${persona.target}로 거르면 그 언어 방이 안 보임`));
      if (otherLang.status === 200 && inList(otherLang, roomId)) fIssues.push(issue("error", "rooms_logic", `상관없는 언어(${other})로 걸렀는데 방이 보임`));
      const hostSees = await acc.room(A, "list", {});
      if (hostSees.status === 200 && !(hostSees.body?.rooms ?? []).find((r) => r.id === roomId)?.mine) fIssues.push(issue("warn", "rooms_logic", "방장 목록에 내 방 표시(mine)가 없음"));
      step({ title: "언어로 거르기", status: mineLang.status, ms: mineLang.ms, outputs: [{ label: "결과", text: `${persona.target}: ${inList(mineLang, roomId) ? "보임" : "안 보임"} · ${other}: ${inList(otherLang, roomId) ? "보임" : "안 보임"}` }], issues: fIssues });

      // ── 🌐 자유 대화방 ──
      const freePeer = `${A.peerId}f`.slice(0, 40);
      const free = await acc.room(A, "create", { name: `[test] 🌐 ${persona.id}`, free: true, languages: [persona.target], peerId: freePeer });
      const freeId = free.body?.room?.id;
      const frIssues = checkHttp(P, free);
      if (free.status === 200 && (free.body?.room?.languages ?? []).length) frIssues.push(issue("error", "rooms_logic", "자유 대화방에 방 언어가 남음"));
      if (freeId) {
        await acc.room(A, "join", { roomId: freeId, peerId: freePeer });
        const seen = await acc.room(C, "list", { langs: [other] });
        if (!inList(seen, freeId)) frIssues.push(issue("error", "rooms_logic", `자유 대화방이 ${other}로 거르면 안 보임`));
        const gone = await acc.room(A, "leave", { roomId: freeId, peerId: freePeer });
        if (!gone.body?.closed) frIssues.push(issue("error", "rooms_logic", "방장이 나갔는데 자유 대화방이 닫히지 않음"));
        const after = await acc.room(C, "list", {});
        if (inList(after, freeId)) frIssues.push(issue("error", "rooms_logic", "닫힌 자유 대화방이 목록에 남음"));
      }
      step({ title: "🌐 자유 대화방", status: free.status, ms: free.ms, outputs: [{ label: "방", text: freeId }], issues: frIssues });

      // ── 채팅만 참여 + 줄 집어 묻기 ──
      // 앱은 들어간 뒤 매 물음(poll)에 참여 방식을 실어 보낸다(RoomView textOnlyRef).
      const bJoin = await acc.room(B, "join", { roomId, role: "listener", langs: [persona.ui, persona.target] });
      const bPoll = await acc.room(B, "poll", { roomId, since: 0, role: "listener", textOnly: true });
      const tIssues = [...checkHttp(P, bJoin), ...checkHttp(P, bPoll)];
      const aView = await acc.room(A, "poll", { roomId, since: 0 });
      const bAsSeen = (aView.body?.members ?? []).find((m) => m.peerId === B.peerId);
      if (aView.status === 200 && (bAsSeen?.role !== "listener" || bAsSeen?.textOnly !== true)) {
        tIssues.push(issue("error", "rooms_logic", `채팅만으로 바꿨는데 방장 화면에 ${bAsSeen?.role}·textOnly ${bAsSeen?.textOnly}`));
      }
      step({ title: "B 채팅만 참여", status: bPoll.status, ms: bPoll.ms, outputs: [{ label: "방장이 보는 B", text: `${bAsSeen?.role} · 채팅만 ${bAsSeen?.textOnly ? "예" : "아니오"}` }], issues: tIssues });

      const aLine = await acc.room(A, "line", { roomId, kind: "text", text: lines[0] ?? "hello" });
      const seq = aLine.body?.line?.seq;
      const asked = await acc.room(B, "line", { roomId, kind: "text", text: bank.askMeaning[persona.ui], quoteSeq: seq, ask: true });
      const qIssues = [...checkHttp(P, aLine), ...checkHttp(P, asked)];
      const q = asked.body?.line?.quote;
      if (asked.status === 200) {
        if (q?.text !== (lines[0] ?? "hello")) qIssues.push(issue("error", "rooms_logic", `집은 줄 인용이 다름: ${q?.text}`));
        if (asked.body?.line?.ask !== true) qIssues.push(issue("error", "rooms_logic", "묻기 표시(ask)가 없음"));
        if (q?.nickname !== A.nickname) qIssues.push(issue("warn", "rooms_logic", `인용 이름이 A가 아님: ${q?.nickname}`));
      }
      const noQuote = await acc.room(B, "line", { roomId, kind: "text", text: "?", quoteSeq: 99999, ask: true });
      qIssues.push(...expectError(P, noQuote, "NO_QUOTE", "없는 줄을 집기"));
      const speechAsListener = await acc.room(B, "line", { roomId, kind: "speech", text: "x" });
      qIssues.push(...expectError(P, speechAsListener, "NOT_SPEAKER", "듣는 사람이 말 줄 쓰기"));
      step({ title: "줄 집어 \"무슨 뜻이에요?\"", input: bank.askMeaning[persona.ui], status: asked.status, ms: asked.ms, outputs: [{ label: "인용", text: q ? `${q.nickname}: ${q.text}` : "" }], issues: qIssues });

      // 아이콘(🙂, 2026-10-24): 기본 묶음 Noto로 채팅 줄. 글 없이도 되고, 옛 앱용 자리표 글이 붙는다. 틀린 아이콘은 BAD_ICON.
      const iconLine = await acc.room(B, "line", { roomId, kind: "text", text: "", icon: { pack: "ip_notofaces", id: "ic_noto1f600" } });
      const iIssues = checkHttp(P, iconLine);
      if (iconLine.status === 200) {
        if (iconLine.body?.line?.icon?.pack !== "ip_notofaces") iIssues.push(issue("error", "rooms_logic", "아이콘 줄에 icon이 없음"));
        if (!iconLine.body?.line?.text) iIssues.push(issue("error", "rooms_logic", "아이콘만 보낸 줄에 자리표 글이 없음(옛 앱이 빈 줄)"));
      }
      const badIcon = await acc.room(B, "line", { roomId, kind: "text", text: "", icon: { pack: "ip_notofaces", id: "ic_nope000" } });
      iIssues.push(...expectError(P, badIcon, "BAD_ICON", "없는 아이콘 보내기"));
      step({ title: "방 채팅 아이콘 🙂", status: iconLine.status, ms: iconLine.ms, outputs: [{ label: "줄", text: `${iconLine.body?.line?.text ?? ""} · ${iconLine.body?.line?.icon?.id ?? "-"}` }], issues: iIssues });

      const note = await acc.dm(B, "send", { target: A.id, text: bank.askMeaning[persona.ui], roomQuote: { roomId, seq }, ask: true });
      const nIssues = checkHttp(P, note);
      if (note.status === 200 && note.body?.message?.quote?.roomId !== roomId) nIssues.push(issue("error", "rooms_logic", "쪽지에 방 인용이 없음"));
      step({ title: "방 줄을 쪽지로 묻기", status: note.status, ms: note.ms, outputs: [{ label: "쪽지 인용", text: note.body?.message?.quote?.text }], issues: nIssues });

      // ── 방장 넘기기 ──
      const tooEarly = await acc.room(A, "transfer", { roomId, target: B.peerId });
      const hIssues = expectError(P, tooEarly, "NOT_SPEAKER", "듣는 사람에게 방장 넘기기");
      await acc.room(A, "grant", { roomId, target: B.peerId, role: "speaker" });
      await acc.room(B, "poll", { roomId, since: 0 });
      const moved = await acc.room(A, "transfer", { roomId, target: B.peerId });
      hIssues.push(...checkHttp(P, moved));
      // C는 방 밖이라 목록으로 본다.
      const listed = (await acc.room(C, "list", {})).body?.rooms?.find((r) => r.id === roomId);
      if (moved.status === 200 && listed && listed.hostAccountId !== B.id) hIssues.push(issue("error", "rooms_logic", "넘겼는데 목록의 방장이 그대로"));
      const oldHost = await acc.room(A, "grant", { roomId, target: B.peerId, role: "listener" });
      hIssues.push(...expectError(P, oldHost, "NOT_HOST", "옛 방장이 방장 권한 쓰기"));
      step({ title: "방장 넘기기 (A → B)", status: moved.status, ms: moved.ms, outputs: [{ label: "방장", text: listed?.hostNickname ?? "" }], issues: hIssues });

      // ── 잠시 닫기 → 다시 열기 ──
      const paused = await acc.room(B, "pause", { roomId });
      const pIssues = checkHttp(P, paused);
      const aAfter = await acc.room(A, "poll", { roomId, since: 0 });
      if (aAfter.status === 200) pIssues.push(issue("error", "rooms_logic", "잠시 닫았는데 남은 사람이 계속 방에 있음"));
      const parked = await acc.room(B, "parked", {});
      if (!(parked.body?.rooms ?? []).some((r) => r.id === roomId)) pIssues.push(issue("error", "rooms_logic", "잠시 닫은 방이 내 방 목록에 없음"));
      const cJoin = await acc.room(C, "join", { roomId });
      pIssues.push(...expectError(P, cJoin, "NO_ROOM", "닫힌 방에 들어가기"));
      const reopened = await acc.room(B, "reopen", { roomId });
      pIssues.push(...checkHttp(P, reopened));
      if (reopened.status === 200 && reopened.body?.room?.id !== roomId) pIssues.push(issue("error", "rooms_logic", `다시 연 방 번호가 다름: ${reopened.body?.room?.id}`));
      const parked2 = await acc.room(B, "parked", {});
      if ((parked2.body?.rooms ?? []).some((r) => r.id === roomId)) pIssues.push(issue("warn", "rooms_logic", "다시 열었는데 내 방 목록에 남음"));
      step({ title: "잠시 닫기 → 다시 열기 (B)", status: paused.status, ms: paused.ms, outputs: [{ label: "다시 연 방", text: reopened.body?.room?.id }], issues: pIssues });

      // ── 방장이 나가면 닫힘 ──
      await acc.room(B, "join", { roomId });
      await acc.room(C, "join", { roomId });
      const left = await acc.room(B, "leave", { roomId });
      const cIssues = checkHttp(P, left);
      if (!left.body?.closed) cIssues.push(issue("error", "rooms_logic", "방장이 나갔는데 방이 닫히지 않음"));
      const cPoll = await acc.room(C, "poll", { roomId, since: 0 });
      if (cPoll.status === 200) cIssues.push(issue("error", "rooms_logic", "방장이 나간 뒤에도 남은 사람이 방에 있음"));
      step({ title: "방장이 나가면 방 닫힘", status: left.status, ms: left.ms, outputs: [{ label: "남은 사람", text: `${cPoll.status} ${cPoll.body?.error ?? ""}` }], issues: cIssues });
    } finally {
      await acc.cleanup();
    }
  },
};
