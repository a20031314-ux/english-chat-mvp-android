/**
 * 말하는 방·프로필·사람 사이 묶음 — 가상 사용자 두 명(방장 A, 손님 B)이 같은 방에서.
 *
 *   A·B 임시 계정 가입 → A 프로필 저장(닉네임·소개·사진) → 내 계정에 그대로인지 → B가 A 프로필 보기 → B가 A 팔로우(숫자)
 *   → A 방 만들기·들어가기(말하기 자리) → B 들어가기(듣는 사람 + 손들기) → B가 방장 권한 쓰면 막힘
 *   → A가 B 올리기 → B 말하기 자리 → B 댓글이 A에게 B 이름으로 → A가 B 내리기 → A가 B 내보내기 → B 다시 못 들어옴
 *   → B가 A 차단하면 방 목록에서 A 방이 안 보임 → 풀기 → 신고는 입력 검사만(빈 사유·자기 신고) → 나가기 → 두 계정 삭제
 *
 * 신고는 실제로 넣지 않는다 — 운영자가 보는 전체 신고 목록에 쌓이기 때문. 방 이름은 [test], 바로 나간다.
 * 2026-10-18부터 방 만들기·들어가기는 로그인한 사람만. 모델 호출 없음. 28명 중 1명.
 * 입장 코드는 ROOM_INVITE_CODE 환경변수, 없으면 기본값.
 */
import { checkDelivered, checkHttp, issue } from "../detect.mjs";

const CODE = process.env.ROOM_INVITE_CODE ?? "LB2026";
// 2×2 PNG — 프로필 사진 저장·읽기 확인용.
const PHOTO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAE0lEQVR4nGPQqrgGRAzS66uACAAlrAV5k8yOagAAAABJRU5ErkJggg==";

function shortId(text) {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ ch.codePointAt(0), 16777619);
  return (h >>> 0).toString(36);
}

export default {
  id: "rooms",
  label: "말하는 방·프로필",
  every: 28,
  note: "임시 계정 2개 — 끝에 삭제, 방 이름 [test], 신고는 입력 검사만",
  estimate() {
    return { requests: 34, usd: 0 };
  },
  async run({ persona, userId, call, bank, step }) {
    const P = "rooms";
    const people = [];

    async function signup(tag) {
      const uid = `${userId}-${tag}`;
      const username = `simchk${shortId(uid)}${tag}`.slice(0, 20);
      const res = await call(uid, "/api/account/password/signup", { body: { username, password: `sim-${shortId(username)}-pw!` } });
      const issues = checkHttp(P, res);
      if (res.status === 200 && !res.body?.token) issues.push(issue("error", "rooms_shape", "가입했는데 토큰이 없음"));
      step({ title: `임시 계정 가입 ${tag.toUpperCase()}`, input: username, status: res.status, ms: res.ms, issues });
      if (!res.body?.token) return null;
      // 테스트 계정은 숨김 — 실제 사용자의 "사람" 목록에 뜨지 않게.
      await call(uid, "/api/account/profile", { body: { nickname: `sim-${tag}`, bio: "", hidden: true }, headers: { "x-auth-token": res.body.token } });
      const person = {
        tag,
        uid,
        id: res.body.account?.id,
        headers: { "x-auth-token": res.body.token },
        peerId: `sim${shortId(uid)}${tag}${persona.id}`.slice(0, 40).padEnd(8, "x"),
      };
      people.push(person);
      return person;
    }
    const as = (person, path, opts = {}) => call(person.uid, path, { ...opts, headers: { ...person.headers, ...(opts.headers ?? {}) } });
    const room = (person, action, extra = {}) => as(person, "/api/rooms", { body: { code: CODE, action, peerId: person.peerId, ...extra } });
    const social = (person, action, extra = {}) => as(person, "/api/social", { body: { action, ...extra } });

    try {
      const A = await signup("a");
      const B = await signup("b");
      if (!A || !B) return;

      // ── 프로필 ──
      const nickname = bank.nickname[persona.ui];
      const bio = bank.mapGoal[persona.ui];
      const saved = await as(A, "/api/account/profile", { body: { nickname, bio, photo: PHOTO, hidden: true } });
      const sIssues = checkHttp(P, saved);
      step({ title: "프로필 저장 (A)", input: `${nickname} · ${bio}`, status: saved.status, ms: saved.ms, issues: sIssues });

      const me = await as(A, "/api/account/me", { method: "GET" });
      const meIssues = checkHttp(P, me);
      const prof = me.body?.account?.profile;
      if (me.status === 200) {
        if (prof?.nickname !== nickname) meIssues.push(issue("error", "rooms_logic", `닉네임이 다르게 저장됨: ${prof?.nickname}`));
        if (prof?.bio !== bio) meIssues.push(issue("error", "rooms_logic", `소개가 다르게 저장됨: ${String(prof?.bio).slice(0, 40)}`));
        if (prof?.photo !== PHOTO) meIssues.push(issue("error", "rooms_logic", "사진이 저장되지 않음"));
      }
      step({ title: "내 계정 다시 읽기 (A)", status: me.status, ms: me.ms, outputs: [{ label: "프로필", text: `${prof?.nickname ?? "-"} · ${prof?.bio ?? ""} · 사진 ${prof?.photo ? "있음" : "없음"}` }], issues: meIssues });

      const seen = await social(B, "profile", { target: A.id });
      const seenIssues = checkHttp(P, seen);
      const pub = seen.body?.profile;
      if (seen.status === 200) {
        if (pub?.nickname !== nickname) seenIssues.push(issue("error", "rooms_logic", `다른 사람이 보는 닉네임이 다름: ${pub?.nickname}`));
        if (pub?.bio !== bio) seenIssues.push(issue("error", "rooms_logic", "다른 사람이 보는 소개가 다름"));
        if (!pub?.photo) seenIssues.push(issue("error", "rooms_logic", "다른 사람이 볼 때 사진이 없음"));
        if (pub?.isMe) seenIssues.push(issue("error", "rooms_logic", "B가 보는데 isMe=true"));
        if ("username" in (pub ?? {}) || "email" in (pub ?? {})) seenIssues.push(issue("error", "rooms_logic", "공개 프로필에 아이디·이메일이 나옴"));
      }
      step({ title: "B가 A 프로필 보기", status: seen.status, ms: seen.ms, outputs: [{ label: "보이는 것", text: `${pub?.nickname ?? "-"} · 팔로워 ${pub?.followers ?? "-"} · ${pub?.since ?? ""}` }], issues: seenIssues });

      const followed = await social(B, "follow", { target: A.id });
      const fIssues = checkHttp(P, followed);
      const after = await social(B, "profile", { target: A.id });
      if (after.status === 200) {
        if (!after.body?.profile?.isFollowing) fIssues.push(issue("error", "rooms_logic", "팔로우했는데 isFollowing=false"));
        if ((after.body?.profile?.followers ?? 0) < 1) fIssues.push(issue("error", "rooms_logic", "팔로우했는데 팔로워 수가 0"));
      }
      step({ title: "B가 A 팔로우", status: followed.status, ms: followed.ms, outputs: [{ label: "팔로워", text: String(after.body?.profile?.followers ?? "-") }], issues: fIssues });

      // ── 방 ──
      const created = await room(A, "create", { name: `[test] sim ${persona.id}`, languages: [persona.target, persona.ui].filter((v, i, a) => a.indexOf(v) === i) });
      const cIssues = checkHttp(P, created);
      const roomId = created.body?.room?.id;
      if (created.status === 200 && !/^[a-z2-9]{6}$/.test(roomId ?? "")) cIssues.push(issue("error", "rooms_shape", `방 id 형식이 이상함: ${roomId}`));
      step({ title: "방 만들기 (A)", status: created.status, ms: created.ms, outputs: [{ label: "방", text: roomId }], issues: cIssues });
      if (!roomId) return;

      try {
        const aJoin = await room(A, "join", { roomId, langs: [persona.target, persona.ui] });
        const ajIssues = checkHttp(P, aJoin);
        if (aJoin.status === 200 && aJoin.body?.member?.role !== "speaker") ajIssues.push(issue("error", "rooms_logic", `방장이 들어갔는데 ${aJoin.body?.member?.role}`));
        if (aJoin.status === 200 && aJoin.body?.member?.nickname !== nickname) ajIssues.push(issue("warn", "rooms_logic", `방 안 이름이 프로필 닉네임이 아님: ${aJoin.body?.member?.nickname}`));
        step({ title: "A 들어가기", status: aJoin.status, ms: aJoin.ms, outputs: [{ label: "자리", text: `${aJoin.body?.member?.role ?? "-"} · ${aJoin.body?.member?.nickname ?? ""}` }], issues: ajIssues });

        const bJoin = await room(B, "join", { roomId, langs: [persona.ui, persona.target] });
        const bjIssues = checkHttp(P, bJoin);
        const bm = bJoin.body?.member;
        if (bJoin.status === 200 && (bm?.role !== "listener" || !bm?.hand)) bjIssues.push(issue("error", "rooms_logic", `손님이 들어갔는데 ${bm?.role}·손 ${bm?.hand}`));
        step({ title: "B 들어가기 (손들기)", status: bJoin.status, ms: bJoin.ms, outputs: [{ label: "자리", text: `${bm?.role ?? "-"} · 손 ${bm?.hand ? "듦" : "안 듦"}` }], issues: bjIssues });

        const aSees = await room(A, "poll", { roomId, since: 0 });
        const asIssues = checkHttp(P, aSees);
        const bInA = (aSees.body?.members ?? []).find((m) => m.peerId === B.peerId);
        if (aSees.status === 200 && !bInA?.hand) asIssues.push(issue("error", "rooms_logic", "방장 화면에 B의 손든 표시가 없음"));
        step({ title: "방장이 손든 사람 보기", status: aSees.status, ms: aSees.ms, outputs: [{ label: "사람", text: (aSees.body?.members ?? []).map((m) => `${m.nickname}(${m.role}${m.hand ? "✋" : ""})`).join(" · ") }], issues: asIssues });

        const sneaky = await room(B, "grant", { roomId, target: A.peerId, role: "listener" });
        const skIssues = [];
        if (sneaky.status !== 403 || sneaky.body?.error !== "NOT_HOST") skIssues.push(issue("error", "rooms_logic", `손님이 방장 권한을 썼는데 ${sneaky.status} ${sneaky.body?.error ?? ""}`));
        step({ title: "B가 방장 권한 시도 (막혀야)", status: sneaky.status, ms: sneaky.ms, outputs: [{ label: "응답", text: sneaky.body?.error }], issues: skIssues });

        const up = await room(A, "grant", { roomId, target: B.peerId, role: "speaker" });
        const upIssues = checkHttp(P, up);
        const bUp = await room(B, "poll", { roomId, since: 0 });
        upIssues.push(...checkHttp(P, bUp));
        const bSelf = (bUp.body?.members ?? []).find((m) => m.peerId === B.peerId);
        if (bUp.status === 200 && bSelf?.role !== "speaker") upIssues.push(issue("error", "rooms_logic", `방장이 올렸는데 B가 ${bSelf?.role}`));
        step({ title: "A가 B 올리기", status: up.status, ms: up.ms, outputs: [{ label: "B 자리", text: bSelf?.role }], issues: upIssues });

        const text = (bank.learner[persona.target] ?? []).find((l) => l.ok)?.text ?? "hello";
        const line = await room(B, "line", { roomId, text, kind: "text" });
        const lnIssues = checkHttp(P, line);
        const aRead = await room(A, "poll", { roomId, since: 0 });
        // 같은 글로 찾지 않고 B의 마지막 줄로 — 잘려 온 줄도 잡는다(사용자 2026-10-27 "다른 사용자의 발화가 끊기지 않는지").
        const got = (aRead.body?.lines ?? []).filter((l) => l.nickname === bJoin.body?.member?.nickname).at(-1);
        if (aRead.status === 200 && !got) lnIssues.push(issue("error", "rooms_logic", "B 댓글이 방장에게 안 보임"));
        if (got) lnIssues.push(...checkDelivered("rooms", text, got.text, { label: "방장이 받은 B 댓글" }));
        if (got && got.nickname !== bJoin.body?.member?.nickname) lnIssues.push(issue("warn", "rooms_logic", `댓글 이름이 B 이름이 아님: ${got.nickname}`));
        step({ title: "B 댓글 → A가 받기", input: text, status: line.status, ms: line.ms, outputs: [{ label: "받은 줄", text: got ? `${got.nickname}: ${got.text}` : "" }], issues: lnIssues });

        const down = await room(A, "grant", { roomId, target: B.peerId, role: "listener" });
        const dnIssues = checkHttp(P, down);
        const bDown = await room(B, "poll", { roomId, since: 0 });
        const bSelf2 = (bDown.body?.members ?? []).find((m) => m.peerId === B.peerId);
        if (bDown.status === 200 && bSelf2?.role !== "listener") dnIssues.push(issue("error", "rooms_logic", `방장이 내렸는데 B가 ${bSelf2?.role}`));
        step({ title: "A가 B 내리기", status: down.status, ms: down.ms, outputs: [{ label: "B 자리", text: bSelf2?.role }], issues: dnIssues });

        const out = await room(A, "grant", { roomId, target: B.peerId, role: "out" });
        const outIssues = checkHttp(P, out);
        const bKicked = await room(B, "poll", { roomId, since: 0 });
        if (bKicked.status !== 403 || bKicked.body?.error !== "KICKED") outIssues.push(issue("error", "rooms_logic", `내보냈는데 B 물음이 ${bKicked.status} ${bKicked.body?.error ?? ""}`));
        const bAgain = await room(B, "join", { roomId });
        if (bAgain.status !== 403 || bAgain.body?.error !== "BANNED") outIssues.push(issue("error", "rooms_logic", `내보낸 사람이 다시 들어옴: ${bAgain.status} ${bAgain.body?.error ?? ""}`));
        step({ title: "A가 B 내보내기 → 다시 못 들어옴", status: out.status, ms: out.ms, outputs: [{ label: "B", text: `${bKicked.body?.error ?? bKicked.status} → 다시 들어가기 ${bAgain.body?.error ?? bAgain.status}` }], issues: outIssues });

        // 차단하면 그 사람 방이 목록에서 사라진다
        const listed = async (who) => ((await room(who, "list")).body?.rooms ?? []).some((r) => r.id === roomId);
        const before = await listed(B);
        const blocked = await social(B, "block", { target: A.id });
        const bkIssues = checkHttp(P, blocked);
        const hidden = !(await listed(B));
        if (!before) bkIssues.push(issue("warn", "rooms_logic", "차단 전에도 B 목록에 방이 없음(빈 방 정리 시간일 수 있음)"));
        else if (!hidden) bkIssues.push(issue("error", "rooms_logic", "방장을 차단했는데 B 목록에 그 방이 보임"));
        const unblocked = await social(B, "unblock", { target: A.id });
        bkIssues.push(...checkHttp(P, unblocked));
        step({ title: "B가 A 차단 → 목록에서 숨김 → 풀기", status: blocked.status, ms: blocked.ms, outputs: [{ label: "목록", text: `차단 전 ${before ? "보임" : "안 보임"} · 차단 뒤 ${hidden ? "안 보임" : "보임"}` }], issues: bkIssues });

        // 신고는 입력 검사만 (진짜 신고는 운영자 목록에 쌓임)
        const empty = await social(B, "report", { target: A.id, reason: "" });
        const self = await social(A, "report", { target: A.id, reason: "test" });
        const rpIssues = [];
        if (empty.body?.error !== "NO_REASON") rpIssues.push(issue("error", "rooms_logic", `빈 사유 신고가 ${empty.status} ${empty.body?.error ?? "통과"}`));
        if (self.body?.error !== "SELF") rpIssues.push(issue("error", "rooms_logic", `자기 신고가 ${self.status} ${self.body?.error ?? "통과"}`));
        step({ title: "신고 입력 검사 (빈 사유·자기 신고)", status: empty.status, ms: empty.ms, outputs: [{ label: "응답", text: `${empty.body?.error} · ${self.body?.error}` }], issues: rpIssues });
      } finally {
        const left = await room(A, "leave", { roomId });
        // 2026-10-18부터 방장이 나가면 방이 닫힌다.
        const lIssues = checkHttp(P, left);
        if (left.status === 200 && !left.body?.closed) lIssues.push(issue("error", "rooms_logic", "방장이 나갔는데 방이 닫히지 않음"));
        step({ title: "A 나가기 (방 닫힘)", status: left.status, ms: left.ms, issues: lIssues });
      }
    } finally {
      for (const person of people) {
        const removed = await as(person, "/api/account/delete", { body: {} });
        step({ title: `임시 계정 삭제 ${person.tag.toUpperCase()}`, status: removed.status, ms: removed.ms, issues: checkHttp(P, removed) });
      }
    }
  },
};
