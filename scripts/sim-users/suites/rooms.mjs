/**
 * 말하는 방 묶음(시험 기능) — 글 줄만으로, 로그인한 사람으로.
 *   임시 계정 가입 → 방 만들기 → 들어가기(방장 = 말하기 자리) → 댓글 한 줄 → 받아 보기 → 나가기 → 계정 삭제
 * 2026-10-18부터 방 만들기·들어가기는 로그인한 사람만(SIGNED_OUT). 임시 계정은 끝에 지운다(계정 삭제는 학습 기록을 지움 대기열에 넣음).
 * 방 목록은 모든 사용자에게 보이므로 이름에 [test]를 붙이고 바로 나간다. 모델 호출 없음. 28명 중 1명.
 * 입장 코드는 ROOM_INVITE_CODE 환경변수, 없으면 기본값.
 */
import { checkHttp, issue } from "../detect.mjs";

const CODE = process.env.ROOM_INVITE_CODE ?? "LB2026";

function shortId(text) {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ ch.codePointAt(0), 16777619);
  return (h >>> 0).toString(36);
}

export default {
  id: "rooms",
  label: "말하는 방",
  every: 28,
  note: "임시 계정으로 로그인 — 끝에 삭제, 방 이름 [test]",
  estimate() {
    return { requests: 8, usd: 0 };
  },
  async run({ persona, userId, call, bank, step }) {
    const P = "rooms";
    const username = `simchk${shortId(userId)}`.slice(0, 20);
    const signup = await call(userId, "/api/account/password/signup", { body: { username, password: `sim-${shortId(username)}-pw!` } });
    const sIssues = checkHttp(P, signup);
    const token = signup.body?.token;
    if (signup.status === 200 && !token) sIssues.push(issue("error", "rooms_shape", "가입했는데 토큰이 없음"));
    step({ title: "임시 계정 가입", input: username, status: signup.status, ms: signup.ms, issues: sIssues });
    if (!token) return;
    const auth = { "x-auth-token": token };

    try {
      const peerId = `sim${shortId(userId)}${persona.id}`.slice(0, 40).padEnd(8, "x");
      const post = (action, extra) => call(userId, "/api/rooms", { body: { code: CODE, action, peerId, ...extra }, headers: auth });

      const created = await post("create", { name: `[test] sim ${persona.id}`, languages: [persona.target, persona.ui].filter((v, i, a) => a.indexOf(v) === i) });
      const cIssues = checkHttp(P, created);
      const roomId = created.body?.room?.id;
      if (created.status === 200 && !/^[a-z2-9]{6}$/.test(roomId ?? "")) cIssues.push(issue("error", "rooms_shape", `방 id 형식이 이상함: ${roomId}`));
      step({ title: "방 만들기", status: created.status, ms: created.ms, outputs: [{ label: "방", text: roomId }], issues: cIssues });
      if (!roomId) return;

      try {
        const joined = await post("join", { roomId });
        const jIssues = checkHttp(P, joined);
        if (joined.status === 200 && joined.body?.member?.role !== "speaker") jIssues.push(issue("error", "rooms_logic", `방장이 들어갔는데 ${joined.body?.member?.role}`));
        step({ title: "들어가기", status: joined.status, ms: joined.ms, outputs: [{ label: "자리", text: `${joined.body?.member?.role ?? "-"} · ${joined.body?.member?.nickname ?? ""}` }], issues: jIssues });

        const text = (bank.learner[persona.target] ?? []).find((l) => l.ok)?.text ?? "hello";
        const line = await post("line", { roomId, text, kind: "text" });
        step({ title: "댓글 쓰기", input: text, status: line.status, ms: line.ms, issues: checkHttp(P, line) });

        const polled = await post("poll", { roomId, since: 0 });
        const pIssues = checkHttp(P, polled);
        if (polled.status === 200 && !(polled.body?.lines ?? []).some((l) => l.text === text)) pIssues.push(issue("error", "rooms_logic", "쓴 댓글이 방에서 안 보임"));
        if (polled.status === 200 && !(polled.body?.members ?? []).some((m) => m.peerId === peerId)) pIssues.push(issue("error", "rooms_logic", "방 사람 목록에 내가 없음"));
        step({ title: "방 받아 보기", status: polled.status, ms: polled.ms, outputs: [{ label: "줄", text: (polled.body?.lines ?? []).map((l) => l.text).join(" | ") }], issues: pIssues });
      } finally {
        const left = await post("leave", { roomId });
        step({ title: "나가기", status: left.status, ms: left.ms, issues: checkHttp(P, left) });
      }
    } finally {
      const removed = await call(userId, "/api/account/delete", { body: {}, headers: auth });
      step({ title: "임시 계정 삭제", status: removed.status, ms: removed.ms, issues: checkHttp(P, removed) });
    }
  },
};
