/**
 * 실행이 끝났는데 지워지지 않은 임시 계정(가입은 됐는데 삭제가 실패한 것)을 찾아 지운다.
 *   NODE_USE_ENV_PROXY=1 node scripts/sim-users/cleanup.mjs tmp/sim-users/<실행>/results.json
 * 계정 이름·비밀번호는 accounts.mjs와 같은 규칙으로 다시 만들어 로그인한 뒤 삭제한다(삭제하면 그 계정의 글·방도 정리됨).
 */
import { shortId } from "./accounts.mjs";
import { readFileSync } from "node:fs";
const API = "https://english-chat-mvp.vercel.app";
const r = JSON.parse(readFileSync(process.argv[2], "utf8"));
const left = new Map();
const PREFIX = { roomsplus: "rooms", dm: "dm", groups: "group", people: "people", board: "board", team: "team", tiers: "tiers" };
for (const u of r.records) {
  const bySuite = {};
  for (const t of u.transcript) {
    const m = /^임시 계정 (가입|삭제) ([A-Z])$/.exec(t.title ?? "");
    if (!m) continue;
    const key = `${t.suite}:${m[2]}`;
    bySuite[key] = bySuite[key] ?? {};
    bySuite[key][m[1]] = t.status;
  }
  for (const [key, v] of Object.entries(bySuite)) {
    if (v["가입"] === 200 && v["삭제"] !== 200) left.set(key.startsWith("rooms:") ? `${u.userId}-${key.split(":")[1].toLowerCase()}` : `${u.userId}-${PREFIX[key.split(":")[0]] ?? key.split(":")[0]}-${key.split(":")[1].toLowerCase()}`, key);
  }
}
console.log("남은 계정", left.size);
for (const [uid, key] of left) {
  const tag = uid.split("-").at(-1);
  const username = `simchk${shortId(uid)}${tag}`.slice(0, 20);
  const login = await fetch(`${API}/api/account/password/login`, { method: "POST", headers: { "content-type": "application/json", "x-rc-user": uid }, body: JSON.stringify({ username, password: `sim-${shortId(username)}-pw!` }) });
  const lj = await login.json().catch(() => ({}));
  if (!lj.token) { console.log(key, uid, "로그인 실패", login.status, lj.error); continue; }
  const del = await fetch(`${API}/api/account/delete`, { method: "POST", headers: { "content-type": "application/json", "x-rc-user": uid, "x-auth-token": lj.token }, body: "{}" });
  console.log(key, username, "삭제", del.status);
}
