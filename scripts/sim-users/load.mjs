/**
 * 부하 점검 — 운영 API에 여러 사람이 동시에 붙었을 때 오류·지연·꼬임이 생기는지.
 *
 *   NODE_USE_ENV_PROXY=1 node scripts/sim-users/load.mjs room  [--extra 20] [--seconds 45]   꽉 찬 방(16명) + 넘치는 사람
 *   NODE_USE_ENV_PROXY=1 node scripts/sim-users/load.mjs rooms [--rooms 4 --per 10 --seconds 40]  여러 방 동시
 *   NODE_USE_ENV_PROXY=1 node scripts/sim-users/load.mjs model [--concurrency 20]           채팅(모델) 동시 호출
 *
 * - 임시 계정은 숨김·끝에 삭제(오류가 나도). 방 이름은 [test].
 * - 멈춤 조건: 최근 10초 오류율 10% 초과, Vercel 앞단 막힘, 응답 p95 10초 초과 → 바로 멈추고 정리.
 * - 저장소(Upstash) 무료 한도를 생각해 짧게 돌린다. 끝에 예상 저장소 명령 수를 찍는다.
 * 결과: tmp/sim-users/load-<종류>-<시각>/load.json
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { makeClient, isEdgeBlock } from "./client.mjs";
import { shortId, ROOM_CODE } from "./accounts.mjs";

const args = process.argv.slice(2);
const kind = args[0];
const num = (name, fallback) => { const i = args.indexOf(`--${name}`); return i >= 0 ? Number(args[i + 1]) : fallback; };
const API = (() => { const i = args.indexOf("--api"); return i >= 0 ? args[i + 1] : "https://english-chat-mvp.vercel.app"; })();
const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 13);
const RUN = `load-${kind}-${stamp}`;
const OUT = join("tmp/sim-users", RUN);
const { call: rawCall, state } = makeClient({ api: API, maxRequests: 200_000, timeoutMs: 30_000 });

// ── 측정 ──
const samples = []; // { t, path, action, status, ms, error }
let stopped = "";
async function call(userId, path, opts = {}) {
  const res = await rawCall(userId, path, opts);
  samples.push({ t: Date.now(), path, action: opts.body?.action ?? opts.body?.mode ?? "", status: res.status, ms: res.ms, error: res.body?.error && typeof res.body.error === "string" ? res.body.error : res.error ? "NETWORK" : "" });
  return res;
}
const pct = (xs, p) => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[Math.min(s.length - 1, Math.floor(s.length * p))] : 0; };
function watchdog() {
  const now = Date.now();
  const recent = samples.filter((s) => now - s.t < 10_000);
  if (recent.length < 20) return;
  const bad = recent.filter((s) => s.status === 0 || s.status >= 500).length;
  if (bad / recent.length > 0.1) stopped ||= `최근 10초 오류율 ${Math.round((bad / recent.length) * 100)}%`;
  if ((state.edgeBlocks ?? 0) > 0) stopped ||= `Vercel 앞단 막힘 ${state.edgeBlocks}번`;
  if (pct(recent.map((s) => s.ms), 0.95) > 10_000) stopped ||= `p95 ${pct(recent.map((s) => s.ms), 0.95)}ms`;
}
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ── 계정 ──
const accounts = [];
async function signup(tag) {
  const uid = `simcheck-${RUN}-${tag}`;
  const username = `simld${shortId(uid)}`.slice(0, 20);
  const res = await call(uid, "/api/account/password/signup", { body: { username, password: `sim-${shortId(username)}-pw!` } });
  if (!res.body?.token) throw new Error(`가입 실패 ${tag}: ${res.status} ${JSON.stringify(res.body).slice(0, 80)}`);
  const headers = { "x-auth-token": res.body.token };
  await call(uid, "/api/account/profile", { body: { nickname: `load-${tag}`, bio: "", hidden: true }, headers });
  const person = { tag, uid, id: res.body.account.id, headers };
  accounts.push(person);
  return person;
}
async function cleanup() {
  for (const p of accounts) await rawCall(p.uid, "/api/account/delete", { body: {}, headers: p.headers, force: true });
}
const room = (person, peerId, action, extra = {}) => call(person.uid, "/api/rooms", { body: { code: ROOM_CODE, action, peerId, ...extra }, headers: person.headers });

/** 한 방을 만들고 people명(방장 포함)을 넣어 seconds 동안 1.5초마다 묻게 하며 말하고 댓글 단다. */
async function runRoom({ index, people, extra, seconds, owners }) {
  const host = owners[0];
  const hostPeer = `ldh${index}${shortId(RUN)}`.slice(0, 40).padEnd(8, "x");
  const made = await room(host, hostPeer, "create", { name: `[test] 부하 점검 ${index + 1}`, languages: ["en", "ko"] });
  const roomId = made.body?.room?.id;
  if (!roomId) throw new Error(`방 만들기 실패: ${made.status} ${JSON.stringify(made.body).slice(0, 80)}`);
  const members = [{ peerId: hostPeer, person: host, role: "speaker", since: 0, seen: new Set(), polls: 0 }];
  await room(host, hostPeer, "join", { roomId, role: "speaker", langs: ["en", "ko"] });
  const report = { roomId, joined: 1, full: 0, otherJoinErrors: {}, sent: [], lost: 0, orderBroken: 0, grants: 0 };

  const joiners = [];
  for (let i = 1; i < people + extra; i += 1) {
    // 방장 계정은 다시 들어오면 방장이 옮겨 가므로(다른 기기로 돌아온 방장) 다른 계정만 쓴다.
    const guests = owners.slice(1).filter((o) => o !== host);
    const person = guests[i % guests.length];
    const peerId = `ld${index}p${i}${shortId(RUN)}`.slice(0, 40).padEnd(8, "x");
    joiners.push(
      room(person, peerId, "join", { roomId, role: "listener", langs: ["en", "ko"] }).then((res) => {
        if (res.status === 200) { report.joined += 1; members.push({ peerId, person, role: "listener", since: 0, seen: new Set(), polls: 0 }); }
        else if (res.body?.error === "ROOM_FULL") report.full += 1;
        else report.otherJoinErrors[res.body?.error ?? res.status] = (report.otherJoinErrors[res.body?.error ?? res.status] ?? 0) + 1;
      }),
    );
  }
  await Promise.all(joiners);
  // 방장이 7명을 말하기 자리로.
  for (const m of members.slice(1, 8)) {
    const g = await room(host, hostPeer, "grant", { roomId, target: m.peerId, role: "speaker" });
    if (g.status === 200) { m.role = "speaker"; report.grants += 1; }
  }

  const end = Date.now() + seconds * 1000;
  let n = 0;
  await Promise.all(
    members.map(async (m, k) => {
      await sleep((k * 1500) / members.length); // 실제처럼 물음이 고르게 퍼지게
      let nextSay = Date.now() + 2000 + Math.random() * 4000;
      while (Date.now() < end && !stopped) {
        const res = await room(m.person, m.peerId, "poll", { roomId, since: m.since, role: m.role });
        m.polls += 1;
        if (res.status === 200) {
          for (const line of res.body.lines ?? []) { m.seen.add(line.seq); m.since = Math.max(m.since, line.seq); }
        }
        if (Date.now() >= nextSay) {
          n += 1;
          const text = `L${index}-${k}-${n} hello everyone, this is a load line`;
          const kindOf = m.role === "speaker" ? "speech" : "text";
          const said = await room(m.person, m.peerId, "line", { roomId, kind: kindOf, text, startedAt: Date.now() - 1500, endedAt: Date.now() });
          if (said.status === 200) report.sent.push(said.body.line.seq);
          nextSay = Date.now() + (m.role === "speaker" ? 5000 : 12000) + Math.random() * 3000;
        }
        watchdog();
        await sleep(1500);
      }
    }),
  );
  // 마지막 한 번 더 받아 보고, 각자 모든 줄을 받았는지.
  for (const m of members) {
    const res = await room(m.person, m.peerId, "poll", { roomId, since: m.since });
    for (const line of res.body?.lines ?? []) m.seen.add(line.seq);
    const missing = report.sent.filter((seq) => !m.seen.has(seq));
    if (missing.length) report.lost += 1;
  }
  const opened = await room(host, hostPeer, "poll", { roomId, since: 0 });
  const seqs = (opened.body?.lines ?? []).map((l) => l.seq);
  report.orderBroken = seqs.filter((s, i) => i > 0 && s <= seqs[i - 1]).length;
  report.lines = report.sent.length;
  report.membersAtEnd = (opened.body?.members ?? []).length;
  report.pollsPerMember = Math.round(members.reduce((a, m) => a + m.polls, 0) / members.length);
  delete report.sent;
  for (const m of members) await room(m.person, m.peerId, "leave", { roomId });
  return report;
}

async function runModel(concurrency) {
  const lines = ["I go to school yesterday.", "She don't like coffee.", "Can you recommend a good movie?", "我昨天去了商店买东西了明天。", "Je suis allé à la Paris."];
  const targets = ["en", "en", "en", "zh", "fr"];
  const jobs = Array.from({ length: concurrency }, (_, i) =>
    call(`simcheck-${RUN}-m${i}`, "/api/chat", { body: { mode: "chat", message: lines[i % 5], targetLanguage: targets[i % 5], interfaceLanguage: "ko", locale: "ko", recent: [] }, timeout: 60_000 }),
  );
  const res = await Promise.all(jobs);
  const by = {};
  for (const r of res) { const k = r.status === 200 ? "200" : `${r.status} ${r.body?.error ?? r.error ?? ""}`; by[k] = (by[k] ?? 0) + 1; }
  return { concurrency, statuses: by, msP50: pct(res.map((r) => r.ms), 0.5), msP95: pct(res.map((r) => r.ms), 0.95), msMax: Math.max(...res.map((r) => r.ms)) };
}

function summarize(extra) {
  const by = {};
  for (const s of samples) {
    const key = `${s.path.replace("/api/", "")}:${s.action}`;
    const row = (by[key] ??= { n: 0, errors: {}, ms: [] });
    row.n += 1;
    row.ms.push(s.ms);
    if (s.status !== 200) row.errors[`${s.status} ${s.error}`] = (row.errors[`${s.status} ${s.error}`] ?? 0) + 1;
  }
  const table = Object.fromEntries(Object.entries(by).map(([k, r]) => [k, { n: r.n, p50: pct(r.ms, 0.5), p95: pct(r.ms, 0.95), max: Math.max(...r.ms), errors: r.errors }]));
  const polls = by["rooms:poll"]?.n ?? 0;
  return { run: RUN, kind, api: API, stopped: stopped || null, requests: state.count, edgeBlocks: state.edgeBlocks ?? 0, seconds: Math.round((samples.at(-1)?.t - samples[0]?.t) / 1000), estimatedKvCommands: polls * 8 + (state.count - polls) * 4, table, ...extra };
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  let extra = {};
  try {
    if (kind === "model") {
      extra.model = [];
      for (const c of [num("concurrency", 20), num("concurrency2", 0)].filter(Boolean)) {
        extra.model.push(await runModel(c));
        console.log(JSON.stringify(extra.model.at(-1)));
        await sleep(5000);
      }
    } else if (kind === "room" || kind === "rooms") {
      const rooms = kind === "room" ? 1 : num("rooms", 4);
      const per = kind === "room" ? 16 : num("per", 10);
      const extraPeople = kind === "room" ? num("extra", 20) : 0;
      const owners = [];
      for (let i = 0; i < Math.min(8, per); i += 1) owners.push(await signup(`o${i}`));
      extra.rooms = await Promise.all(Array.from({ length: rooms }, (_, index) => runRoom({ index, people: per, extra: extraPeople, seconds: num("seconds", 45), owners: [owners[index % owners.length], ...owners.filter((_, j) => j !== index % owners.length)] })));
    } else {
      throw new Error("종류: room | rooms | model");
    }
  } catch (error) {
    extra.error = String(error);
  } finally {
    await cleanup();
  }
  const result = summarize(extra);
  writeFileSync(join(OUT, "load.json"), JSON.stringify(result, null, 1));
  console.log(JSON.stringify(result, null, 1));
}

await main();
