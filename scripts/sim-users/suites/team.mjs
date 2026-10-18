/**
 * 러닝메이트·팀 워크스페이스 묶음 — 임시 계정 셋(A 방장, B 팀원, C 초대만 받음).
 *
 *   메이트: A가 B에게 신청(pending, 이름 없는 둘만의 방) → B도 A에게 신청하면 수락(joined) → 다시 신청해도 하나(mates)
 *   팀: 단체방(B 받기, C는 초대만) → 팀 되기 전 워크스페이스 NOT_TEAM → 방장 아닌 B의 팀 만들기 막힘 → A가 팀으로 → 두 번 ALREADY
 *   → B 목표·정기 모임(잘못된 형식 막힘, null로 지우기) → 초대만 받은 C는 못 고치고 못 봄
 *   → B 공유(메모) · A가 B 것 지우기 막힘 → 팀 대화에서 "무슨 뜻?"으로 집어 물은 줄이 워크스페이스 표현으로 → 같이 한 날에 오늘
 *   → B가 나가면 B가 남긴 것(공유·물은 줄)이 워크스페이스에서 사라짐
 *
 * 팀은 400일 남지만 계정을 지우면 모든 단체방에서 나가므로 끝에 계정 삭제로 정리된다. 모델 호출 없음. 14명 중 1명.
 */
import { checkHttp, issue } from "../detect.mjs";
import { expectError, makeAccounts } from "../accounts.mjs";

export default {
  id: "team",
  label: "러닝메이트·팀",
  every: 14,
  note: "임시 계정 3개 — 숨김·끝에 삭제, 이름 [test]",
  estimate() {
    return { requests: 34, usd: 0 };
  },
  async run({ persona, userId, call, bank, step }) {
    const P = "team";
    const acc = makeAccounts({ call, userId, step, prefix: P, persona });
    const lines = (bank.learner[persona.target] ?? []).filter((l) => l.ok).map((l) => l.text);
    const say = (i) => lines[i % Math.max(1, lines.length)] ?? `hello ${i}`;
    const languages = [persona.target, persona.ui];

    try {
      const A = await acc.signup("a", { nickname: bank.nickname[persona.target] });
      const B = await acc.signup("b", { nickname: bank.nickname[persona.ui] });
      const C = await acc.signup("c");
      if (!A || !B || !C) return;

      // ── 러닝메이트 ──
      const ask = await acc.groups(A, "mate", { target: B.id, languages });
      const mIssues = checkHttp(P, ask);
      const mateId = ask.body?.group?.id;
      if (ask.status === 200) {
        if (ask.body?.state !== "pending") mIssues.push(issue("error", "team_logic", `첫 신청 상태가 ${ask.body?.state}`));
        if (ask.body?.group?.team?.kind !== "mate") mIssues.push(issue("error", "team_logic", "메이트 방에 team.kind=mate 없음"));
        if (!(ask.body?.group?.invited ?? []).includes(B.id)) mIssues.push(issue("error", "team_logic", "메이트 신청을 B가 초대로 받지 않음"));
      }
      const back = await acc.groups(B, "mate", { target: A.id, languages: [persona.ui, persona.target] });
      mIssues.push(...checkHttp(P, back));
      if (back.status === 200) {
        if (back.body?.state !== "joined") mIssues.push(issue("error", "team_logic", `상대 신청이 있는데 B 신청이 ${back.body?.state}(joined여야)`));
        if (back.body?.group?.id !== mateId) mIssues.push(issue("error", "team_logic", "두 사람 사이 메이트가 둘이 됨"));
      }
      const again = await acc.groups(A, "mate", { target: B.id, languages });
      if (again.status === 200 && (again.body?.state !== "mates" || again.body?.group?.id !== mateId)) mIssues.push(issue("error", "team_logic", `이미 메이트인데 다시 신청 → ${again.body?.state}`));
      const mateSpace = mateId ? await acc.groups(B, "space", { groupId: mateId }) : null;
      if (mateSpace) mIssues.push(...checkHttp(P, mateSpace));
      step({ title: "러닝메이트 신청 → 맞신청 = 수락", status: back.status, ms: back.ms, outputs: [{ label: "상태", text: `${ask.body?.state} → ${back.body?.state} → ${again.body?.state}` }], issues: mIssues });

      // ── 팀으로 ──
      const made = await acc.groups(A, "create", { name: `[test] team ${persona.target}↔${persona.ui} ${persona.id}`, languages, invite: [B.id, C.id] });
      const groupId = made.body?.group?.id;
      const tIssues = checkHttp(P, made);
      if (!groupId) { step({ title: "팀 만들 단체방", status: made.status, issues: tIssues }); return; }
      await acc.groups(B, "answer", { groupId, accept: true });
      tIssues.push(...expectError(P, await acc.groups(A, "space", { groupId }), "NOT_TEAM", "팀 되기 전 워크스페이스"));
      tIssues.push(...expectError(P, await acc.groups(B, "team", { groupId }), "NOT_OWNER", "방장 아닌 사람이 팀으로"));
      const team = await acc.groups(A, "team", { groupId });
      tIssues.push(...checkHttp(P, team));
      if (team.status === 200 && team.body?.group?.team?.kind !== "team") tIssues.push(issue("error", "team_logic", "팀으로 했는데 team.kind가 team이 아님"));
      tIssues.push(...expectError(P, await acc.groups(A, "team", { groupId }), "ALREADY", "두 번 팀으로"));
      step({ title: "단체방 → 팀 (방장만)", status: team.status, ms: team.ms, issues: tIssues });

      // ── 목표·정기 모임 ──
      const goalText = say(0).slice(0, 60);
      const goal = await acc.groups(B, "goal", { groupId, goal: goalText });
      const gIssues = checkHttp(P, goal);
      if (goal.status === 200 && (goal.body?.group?.team?.goal !== goalText || goal.body?.group?.team?.goalBy !== B.id)) gIssues.push(issue("error", "team_logic", "목표·정한 사람이 반영 안 됨"));
      gIssues.push(...expectError(P, await acc.groups(B, "schedule", { groupId, schedule: { days: [9], time: "25:00", tz: "Asia/Seoul" } }), "BAD_SCHEDULE", "잘못된 정기 모임"));
      const sched = await acc.groups(B, "schedule", { groupId, schedule: { days: [2, 4], time: "21:00", tz: "Asia/Seoul" } });
      gIssues.push(...checkHttp(P, sched));
      if (sched.status === 200 && sched.body?.group?.team?.schedule?.time !== "21:00") gIssues.push(issue("error", "team_logic", "정기 모임이 반영 안 됨"));
      const cleared = await acc.groups(A, "schedule", { groupId, schedule: null });
      if (cleared.status === 200 && cleared.body?.group?.team?.schedule) gIssues.push(issue("error", "team_logic", "정기 모임 지우기가 안 됨"));
      gIssues.push(...expectError(P, await acc.groups(C, "goal", { groupId, goal: "x" }), "NOT_MEMBER", "초대만 받은 사람이 목표 고치기"));
      gIssues.push(...expectError(P, await acc.groups(C, "space", { groupId }), "NOT_MEMBER", "초대만 받은 사람이 워크스페이스 보기"));
      step({ title: "목표·정기 모임", input: goalText, status: goal.status, ms: goal.ms, outputs: [{ label: "정기 모임", text: JSON.stringify(sched.body?.group?.team?.schedule ?? null) }], issues: gIssues });

      // ── 공유·물은 줄이 쌓임 ──
      const share = await acc.groups(B, "share", { groupId, text: say(1), note: bank.askMeaning[persona.ui] });
      const sIssues = checkHttp(P, share);
      const itemId = share.body?.item?.id;
      if (itemId) sIssues.push(...expectError(P, await acc.groups(A, "unshare", { groupId, itemId }), "NOT_YOURS", "남이 공유한 것 지우기"));
      sIssues.push(...expectError(P, await acc.groups(B, "share", { groupId, text: "  " }), "NO_TEXT", "빈 공유"));
      await acc.groups(A, "send", { groupId, text: say(2) });
      const opened = await acc.groups(B, "open", { groupId });
      const aLine = (opened.body?.messages ?? []).find((m) => m.kind === "text" && m.from === A.id);
      if (aLine) await acc.groups(B, "send", { groupId, text: bank.askMeaning[persona.ui], quoteSeq: aLine.seq, ask: true });
      const space = await acc.groups(A, "space", { groupId });
      sIssues.push(...checkHttp(P, space));
      const items = space.body?.space?.items ?? [];
      if (space.status === 200) {
        if (!items.some((i) => i.kind === "share" && i.id === itemId)) sIssues.push(issue("error", "team_logic", "공유한 것이 워크스페이스에 없음"));
        if (aLine && !items.some((i) => i.kind === "phrase" && i.text === say(2) && i.by === B.id)) sIssues.push(issue("error", "team_logic", "집어 물은 줄이 워크스페이스 표현으로 안 쌓임"));
        const today = new Date().toISOString().slice(0, 10);
        if (!(space.body?.space?.days ?? []).includes(today)) sIssues.push(issue("error", "team_logic", "같이 한 날에 오늘이 없음"));
      }
      step({ title: "공유·집어 물은 줄 → 워크스페이스", status: space.status, ms: space.ms, outputs: [{ label: "쌓인 것", text: items.map((i) => `${i.kind}: ${String(i.text).slice(0, 30)}`).join(" · ") }], issues: sIssues });

      // ── 나가면 내 것은 지움 ──
      const left = await acc.groups(B, "leave", { groupId });
      const lIssues = checkHttp(P, left);
      const after = await acc.groups(A, "space", { groupId });
      const leftovers = (after.body?.space?.items ?? []).filter((i) => i.by === B.id);
      if (after.status === 200 && leftovers.length) lIssues.push(issue("error", "team_logic", `나간 B가 남긴 것 ${leftovers.length}개가 그대로`));
      step({ title: "B 나가기 → B가 남긴 것 지움", status: left.status, ms: left.ms, outputs: [{ label: "남은 것", text: String((after.body?.space?.items ?? []).length) }], issues: lIssues });
    } finally {
      await acc.cleanup();
    }
  },
};
