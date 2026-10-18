/**
 * 사람 사이 묶음(방·메시지·단체방·초대·사람 목록)이 같이 쓰는 임시 계정.
 *
 * - 가입하면 바로 프로필을 숨김(`hidden: true`)으로 — 실제 사용자의 "사람" 목록에 테스트 계정이 뜨지 않게.
 * - 묶음이 끝나면(오류가 나도) 모두 지운다. 계정 삭제는 학습 기록을 지움 대기열에 넣는다.
 * - 말하는 방·메시지·단체방은 입장 코드가 필요할 수 있다: ROOM_INVITE_CODE, 없으면 기본값.
 */
import { checkHttp, issue } from "./detect.mjs";

export const ROOM_CODE = process.env.ROOM_INVITE_CODE ?? "LB2026";
// 2×2 PNG — 프로필 사진 저장·읽기 확인용.
export const PHOTO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAE0lEQVR4nGPQqrgGRAzS66uACAAlrAV5k8yOagAAAABJRU5ErkJggg==";

export function shortId(text) {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ ch.codePointAt(0), 16777619);
  return (h >>> 0).toString(36);
}

/**
 * @returns {{ signup, as, room, dm, groups, social, cleanup, people }}
 */
export function makeAccounts({ call, userId, step, prefix, persona }) {
  const people = [];

  async function signup(tag, { nickname, bio = "" } = {}) {
    const uid = `${userId}-${tag}`;
    const username = `simchk${shortId(uid)}${tag}`.slice(0, 20);
    const res = await call(uid, "/api/account/password/signup", { body: { username, password: `sim-${shortId(username)}-pw!` } });
    const issues = checkHttp(prefix, res);
    if (res.status === 200 && !res.body?.token) issues.push(issue("error", `${prefix}_shape`, "가입했는데 토큰이 없음"));
    const token = res.body?.token;
    if (token) {
      const prof = await call(uid, "/api/account/profile", {
        body: { nickname: nickname ?? `sim-${tag}`, bio, hidden: true },
        headers: { "x-auth-token": token },
      });
      issues.push(...checkHttp(prefix, prof));
    }
    step({ title: `임시 계정 가입 ${tag.toUpperCase()}`, input: username, status: res.status, ms: res.ms, issues });
    if (!token) return null;
    const person = {
      tag,
      uid,
      id: res.body.account?.id,
      nickname: nickname ?? `sim-${tag}`,
      headers: { "x-auth-token": token },
      peerId: `sim${shortId(uid)}${tag}${persona.id}`.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 40).padEnd(8, "x"),
    };
    people.push(person);
    return person;
  }

  const as = (person, path, opts = {}) => call(person.uid, path, { ...opts, headers: { ...person.headers, ...(opts.headers ?? {}) } });
  const room = (person, action, extra = {}) => as(person, "/api/rooms", { body: { code: ROOM_CODE, action, peerId: person.peerId, ...extra } });
  const dm = (person, action, extra = {}) => as(person, "/api/dm", { body: { code: ROOM_CODE, action, ...extra } });
  const groups = (person, action, extra = {}) => as(person, "/api/groups", { body: { code: ROOM_CODE, action, ...extra } });
  const social = (person, action, extra = {}) => as(person, "/api/social", { body: { action, ...extra } });

  async function cleanup() {
    for (const person of people) {
      const removed = await as(person, "/api/account/delete", { body: {} });
      step({ title: `임시 계정 삭제 ${person.tag.toUpperCase()}`, status: removed.status, ms: removed.ms, issues: checkHttp(prefix, removed) });
    }
  }

  return { signup, as, room, dm, groups, social, cleanup, people };
}

/** 응답 오류 코드가 기대와 같은지(막혀야 하는 동작). */
export function expectError(prefix, res, code, what) {
  if (res.body?.error === code) return [];
  return [issue("error", `${prefix}_logic`, `${what}: ${code}이어야 하는데 ${res.status} ${res.body?.error ?? "통과"}`)];
}
