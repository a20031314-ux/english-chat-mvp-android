/**
 * 소리 연결 부하 점검 — 실제 앱(www)을 헤드리스 브라우저 N개로 띄워 한 방에 넣고, 가짜 마이크로
 * 서로 소리를 잇게 한 뒤(모두가 모두와 직접 잇는 방식) 연결이 몇 개 성공했는지·소리가 오는지 본다.
 *
 *   npm run build:capacitor   (www가 지금 코드여야)
 *   NODE_USE_ENV_PROXY=1 node scripts/sim-users/load-voice.mjs --people 8 [--seconds 60]
 *
 * - 방장 계정이 API로 방을 만들고, 방장 브라우저가 들어가면 방장이 그 브라우저로 옮겨 간다(같은 계정이 다시 들어옴).
 *   말하기 자리는 방장 브라우저 이름표로 API에서 올려 준다(최대 8자리).
 * - 브라우저마다 RTCPeerConnection을 감싸 연결 상태·받은 소리 바이트를 센다(앱 코드는 그대로).
 * - 이 작업 공간은 CPU 2개라 브라우저가 많으면 CPU가 먼저 한계 — 결과는 "서버·신호가 버티는지"와 "연결이 서는지" 위주로 읽는다.
 * - 임시 계정은 숨김·끝에 삭제. 방 이름 [test].
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { shortId, ROOM_CODE } from "./accounts.mjs";

const args = process.argv.slice(2);
const num = (name, fallback) => { const i = args.indexOf(`--${name}`); return i >= 0 ? Number(args[i + 1]) : fallback; };
const PEOPLE = num("people", 8);
const SECONDS = num("seconds", 60);
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const WWW = path.join(ROOT, "www");
const API = (process.env.API_BASE || "https://english-chat-mvp.vercel.app").replace(/\/$/, "");
const PORT = Number(process.env.PORT || 4211);
const RUN = `voice-${new Date().toISOString().replace(/[-:]/g, "").slice(0, 13)}`;
const OUT = path.join(ROOT, "tmp/sim-users", RUN);
fs.mkdirSync(OUT, { recursive: true });
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");

async function api(uid, pathname, body, token) {
  const response = await fetch(`${API}${pathname}`, {
    method: body === undefined ? "GET" : "POST",
    headers: { "content-type": "application/json", "x-rc-user": uid, ...(token ? { "x-auth-token": token } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, body: await response.json().catch(() => null) };
}

// www + /api 프록시(screens.mjs와 같은 방식)
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".txt": "text/plain", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".webp": "image/webp", ".mp3": "audio/mpeg" };
const server = http.createServer(async (req, res) => {
  if (req.url.startsWith("/api/")) {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const headers = { ...req.headers };
    for (const h of ["host", "origin", "referer", "content-length"]) delete headers[h];
    try {
      const upstream = await fetch(API + req.url, { method: req.method, headers, body: ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.concat(chunks) });
      res.writeHead(upstream.status, { "content-type": upstream.headers.get("content-type") || "application/octet-stream" });
      res.end(Buffer.from(await upstream.arrayBuffer()));
    } catch {
      res.writeHead(502);
      res.end();
    }
    return;
  }
  let file = path.join(WWW, decodeURIComponent(req.url.split("?")[0]));
  if (file.endsWith(path.sep)) file += "index.html";
  if (!fs.existsSync(file) && fs.existsSync(file + ".html")) file += ".html";
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise((resolve) => server.listen(PORT, "127.0.0.1", resolve));
const BASE = `http://127.0.0.1:${PORT}`;

/** 브라우저 안: RTCPeerConnection을 감싸 상태를 모은다. */
const TRACK = () => {
  const Native = window.RTCPeerConnection;
  window.__pcs = [];
  window.RTCPeerConnection = function (...a) {
    const pc = new Native(...a);
    window.__pcs.push(pc);
    return pc;
  };
  window.RTCPeerConnection.prototype = Native.prototype;
  window.__pcStats = async () => {
    let audioIn = 0;
    const states = {};
    for (const pc of window.__pcs) {
      states[pc.connectionState] = (states[pc.connectionState] ?? 0) + 1;
      if (pc.connectionState === "connected") {
        const stats = await pc.getStats();
        stats.forEach((s) => { if (s.type === "inbound-rtp" && s.kind === "audio") audioIn += s.bytesReceived ?? 0; });
      }
    }
    return { total: window.__pcs.length, states, audioIn };
  };
};

const people = [];
const result = { run: RUN, people: PEOPLE, seconds: SECONDS };
let browser;
try {
  for (let i = 0; i < PEOPLE; i += 1) {
    const uid = `simcheck-${RUN}-v${i}`;
    const username = `simvc${shortId(uid)}`.slice(0, 20);
    const signed = await api(uid, "/api/account/password/signup", { username, password: `sim-${shortId(username)}-pw!` });
    if (!signed.body?.token) throw new Error(`가입 실패 ${i}: ${signed.status}`);
    await api(uid, "/api/account/profile", { nickname: `voice-${i}`, bio: "", hidden: true }, signed.body.token);
    const me = (await api(uid, "/api/account/me", undefined, signed.body.token)).body?.account;
    people.push({ i, uid, token: signed.body.token, id: signed.body.account.id, account: me });
  }
  const host = people[0];
  const roomName = `[test] 소리 연결 ${shortId(RUN)}`;
  const made = await api(host.uid, "/api/rooms", { code: ROOM_CODE, action: "create", peerId: `nodehost${shortId(RUN)}`, name: roomName, languages: ["en", "ko"] }, host.token);
  const roomId = made.body?.room?.id;
  if (!roomId) throw new Error(`방 만들기 실패 ${made.status}`);
  result.roomId = roomId;

  browser = await chromium.launch({
    ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}),
    args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--autoplay-policy=no-user-gesture-required"],
  });
  const pages = [];
  for (const person of people) {
    const context = await browser.newContext({ viewport: { width: 412, height: 915 }, permissions: ["microphone"] });
    await context.addInitScript(TRACK);
    const page = await context.newPage();
    await page.route("**/api/**", (route) => route.continue({ headers: { ...route.request().headers(), "x-rc-user": person.uid } }));
    await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
    await page.evaluate(([token, acct, code]) => {
      localStorage.setItem("appTargetLanguage", "en");
      localStorage.setItem("appUiLocale", "ko");
      localStorage.setItem("chatOwnLanguageTipSeen", "1");
      localStorage.setItem("whatsNewSeenVersion", "999");
      localStorage.setItem("ec_auth_token", token);
      localStorage.setItem("ec_account", JSON.stringify(acct));
      localStorage.setItem("roomsInviteCode", code);
    }, [person.token, person.account, ROOM_CODE]);
    await page.goto(BASE + "/?screen=rooms", { waitUntil: "domcontentloaded" });
    await page.getByText(roomName).first().click({ timeout: 30_000 });
    pages.push(page);
    console.log(`브라우저 ${person.i + 1}/${PEOPLE} 들어감`);
    await page.waitForTimeout(1500);
  }
  await pages[0].waitForTimeout(6000);

  // 방장 브라우저의 이름표로 말하기 자리 올리기(방장 포함 최대 8).
  const peek = await api(host.uid, "/api/rooms", { code: ROOM_CODE, action: "peek", peerId: `nodehost${shortId(RUN)}`, roomId }, host.token);
  const hostPeer = peek.body?.room?.hostPeerId;
  const polled = await api(host.uid, "/api/rooms", { code: ROOM_CODE, action: "poll", peerId: hostPeer, roomId, since: 0 }, host.token);
  const members = polled.body?.members ?? [];
  result.membersSeenByServer = members.length;
  let granted = 0;
  for (const m of members.filter((m) => m.peerId !== hostPeer && m.role !== "speaker").slice(0, 7)) {
    const g = await api(host.uid, "/api/rooms", { code: ROOM_CODE, action: "grant", peerId: hostPeer, roomId, target: m.peerId, role: "speaker" }, host.token);
    if (g.status === 200) granted += 1;
  }
  result.granted = granted;

  // 유지하며 15초마다 연결 상태
  result.timeline = [];
  const until = Date.now() + SECONDS * 1000;
  while (Date.now() < until) {
    await pages[0].waitForTimeout(15_000);
    const stats = await Promise.all(pages.map((p) => p.evaluate(() => window.__pcStats()).catch(() => null)));
    const row = { at: Math.round((SECONDS * 1000 - (until - Date.now())) / 1000), perBrowser: stats };
    result.timeline.push(row);
    const connected = stats.reduce((a, s) => a + (s?.states?.connected ?? 0), 0);
    const total = stats.reduce((a, s) => a + (s?.total ?? 0), 0);
    console.log(`${row.at}초: 연결 ${connected}/${total} (기대 ${PEOPLE * (PEOPLE - 1)}), 소리 받은 브라우저 ${stats.filter((s) => (s?.audioIn ?? 0) > 0).length}/${PEOPLE}`);
  }
  await pages[0].screenshot({ path: path.join(OUT, "host.png") });
  await pages.at(-1).screenshot({ path: path.join(OUT, "last.png") });
  const final = await api(host.uid, "/api/rooms", { code: ROOM_CODE, action: "poll", peerId: hostPeer, roomId, since: 0 }, host.token);
  result.final = { members: (final.body?.members ?? []).length, speakers: (final.body?.members ?? []).filter((m) => m.role === "speaker").length, lines: (final.body?.lines ?? []).length };
} catch (error) {
  result.error = String(error?.message ?? error).split("\n")[0];
  console.log("멈춤:", result.error);
} finally {
  await browser?.close().catch(() => undefined);
  server.close();
  for (const p of people) await api(p.uid, "/api/account/delete", {}, p.token).catch(() => undefined);
  fs.writeFileSync(path.join(OUT, "voice.json"), JSON.stringify(result, null, 1));
  console.log(JSON.stringify({ ...result, timeline: result.timeline?.map((r) => ({ at: r.at, connected: r.perBrowser.map((s) => s?.states?.connected ?? 0), total: r.perBrowser.map((s) => s?.total ?? 0) })) }, null, 1));
}
