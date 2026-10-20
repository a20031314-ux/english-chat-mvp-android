/**
 * 말하는 방을 역할별 시선으로 찍기 — 실제 앱(www)을 계정 5개로 띄워 한 방에 넣고, 각자 화면을 찍는다.
 *
 *   npm run build:capacitor
 *   NODE_USE_ENV_PROXY=1 node scripts/sim-users/room-views.mjs [--ui ko] [--target en]
 *
 * 사람(모두 숨김 임시 계정, 끝에 삭제):
 *   방장 — 방을 열고, 손든 사람을 올림 · 말하기 — 자리에 올라 말함 · 듣기 — 👂 듣기만, 손을 듦 ·
 *   채팅만 — 💬 소리 없이 자막·채팅 · 복합 — 말하기 자리에서 말도 하고 남의 줄을 집어 "무슨 뜻이에요?"
 * 장면: 각자의 방 화면 → 방장의 "방 닫기" 고르기 → ⏸ 잠시 닫기 → 남은 사람의 "방이 닫혔어요" → 방장 로비의 "내 방 · 잠시 닫음".
 * 받아쓴 말은 가짜 마이크라 생기지 않으므로, 말하기 자리 사람의 줄은 API로 넣는다(앱이 받아쓴 뒤 보내는 것과 같은 요청).
 * 결과: tmp/sim-users/<실행>/room-views/*.png + index.html(한 장 갤러리).
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { shortId, ROOM_CODE } from "./accounts.mjs";
import { forgetAtEnd } from "./forget.mjs";
import { roomCopy } from "../../src/lib/rooms/copy.ts";

const args = process.argv.slice(2);
const value = (name, fallback) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : fallback; };
const UI = value("ui", "ko");
const TARGET = value("target", "en");
const t = roomCopy(UI);
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const WWW = path.join(ROOT, "www");
const API = (process.env.API_BASE || "https://english-chat-mvp.vercel.app").replace(/\/$/, "");
const PORT = Number(process.env.PORT || 4222);
const RUN = value("run-id", `roomviews-${new Date(Date.now() + 9 * 3600_000).toISOString().replace(/[-:]/g, "").slice(0, 13)}`);
const OUT = path.join(ROOT, "tmp/sim-users", RUN, "room-views");
fs.mkdirSync(OUT, { recursive: true });
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(person, pathname, body) {
  const response = await fetch(`${API}${pathname}`, {
    method: body === undefined ? "GET" : "POST",
    headers: { "content-type": "application/json", "x-rc-user": person.uid, ...(person.token ? { "x-auth-token": person.token } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, body: await response.json().catch(() => null) };
}

// www + /api 프록시
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

const CAST = [
  { key: "host", nick: "지수", role: "방장" },
  { key: "speaker", nick: "Mina", role: "음성 대화(말하기 자리)" },
  { key: "listener", nick: "준호", role: "관전자(👂 듣기, 손 듦)" },
  { key: "chat", nick: "Leo", role: "채팅 사용자(💬 채팅만)" },
  { key: "mixed", nick: "하나", role: "복합(말하기 + 채팅 + 줄 집어 묻기)" },
];
const shots = [];
const people = {};
let browser;
async function shot(page, file, who, title, note) {
  await wait(1200);
  await page.screenshot({ path: path.join(OUT, file) });
  shots.push({ file, who, title, note });
  console.log(`찍음 ${file} — ${who}: ${title}`);
}

try {
  for (const c of CAST) {
    const uid = `simcheck-${RUN}-${c.key}`;
    const username = `simrv${shortId(uid)}`.slice(0, 20);
    const signed = await api({ uid }, "/api/account/password/signup", { username, password: `sim-${shortId(username)}-pw!` });
    if (!signed.body?.token) throw new Error(`가입 실패 ${c.key}: ${signed.status} ${JSON.stringify(signed.body)}`);
    const person = { ...c, uid, token: signed.body.token };
    await api(person, "/api/account/profile", { nickname: c.nick, bio: "", hidden: true });
    person.account = (await api(person, "/api/account/me")).body?.account;
    people[c.key] = person;
  }
  const host = people.host;
  const roomName = `[test] 주말 이야기 ${shortId(RUN).slice(0, 4)}`;
  const made = await api(host, "/api/rooms", { code: ROOM_CODE, action: "create", peerId: `rvhost${shortId(RUN)}`, name: roomName, languages: [TARGET, UI] });
  const roomId = made.body?.room?.id;
  if (!roomId) throw new Error(`방 만들기 실패 ${made.status} ${JSON.stringify(made.body)}`);

  browser = await chromium.launch({
    ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}),
    args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--autoplay-policy=no-user-gesture-required"],
  });
  for (const key of ["host", "speaker", "mixed", "listener", "chat"]) {
    const person = people[key];
    const context = await browser.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 1, permissions: ["microphone"] });
    const page = await context.newPage();
    await page.route("**/api/**", (route) => route.continue({ headers: { ...route.request().headers(), "x-rc-user": person.uid } }));
    await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
    await page.evaluate(([token, acct, code, target, ui]) => {
      localStorage.setItem("appTargetLanguage", target);
      localStorage.setItem("appUiLocale", ui);
      localStorage.setItem("chatOwnLanguageTipSeen", "1");
      localStorage.setItem("whatsNewSeenVersion", "999");
      localStorage.setItem("ec_auth_token", token);
      localStorage.setItem("ec_account", JSON.stringify(acct));
      localStorage.setItem("roomsInviteCode", code);
    }, [person.token, person.account, ROOM_CODE, TARGET, UI]);
    await page.goto(BASE + "/?screen=rooms", { waitUntil: "domcontentloaded" });
    if (key === "listener") {
      await wait(3500);
      await shot(page, "00-lobby.png", "준호", "로비 — 열린 방 카드", "방 언어·방장·인원. 누르면 들어간다.");
    }
    await page.getByText(roomName).first().click({ timeout: 30_000 });
    person.page = page;
    await wait(2500);
  }
  await wait(5000);

  // 서버에서 각자의 이름표(peerId)를 찾는다.
  const peek = await api(host, "/api/rooms", { code: ROOM_CODE, action: "peek", peerId: `rvhost${shortId(RUN)}`, roomId });
  const hostPeer = peek.body?.room?.hostPeerId;
  host.peer = hostPeer;
  const members = (await api(host, "/api/rooms", { code: ROOM_CODE, action: "poll", peerId: hostPeer, roomId, since: 0 })).body?.members ?? [];
  for (const m of members) for (const p of Object.values(people)) if (m.accountId === p.account?.id) p.peer = m.peerId;
  console.log("방 사람", members.map((m) => `${m.nickname}:${m.role}`).join(", "));

  // 참여 방식: 듣기·채팅만은 각자 아래 줄에서 고른다(앱 그대로).
  await people.listener.page.getByRole("button", { name: new RegExp(`👂\\s*${t.joinListen}`) }).first().click().catch((e) => console.log("듣기 고르기 실패", e.message));
  await people.chat.page.getByRole("button", { name: new RegExp(`💬\\s*${t.joinChat}`) }).first().click().catch((e) => console.log("채팅만 고르기 실패", e.message));
  await wait(2500);
  // 말하기 자리: 방장이 Mina·하나를 올린다(손든 사람 올리기와 같은 요청).
  for (const key of ["speaker", "mixed"]) {
    const g = await api(host, "/api/rooms", { code: ROOM_CODE, action: "grant", peerId: hostPeer, roomId, target: people[key].peer, role: "speaker" });
    if (g.status !== 200) console.log("올리기 실패", key, g.status, g.body);
  }
  await wait(4000);
  // 손: 카드를 눌러 들어오면 이미 손을 든 상태다(말하기 자리는 방장이 올려 줘야). 준호·Leo는 그대로 둔다.

  // 대화: 말하기 자리는 받아쓴 말, 채팅만은 댓글.
  const say = async (key, text, kind = "speech") => {
    const p = people[key];
    const r = await api(p, "/api/rooms", { code: ROOM_CODE, action: "line", peerId: p.peer, roomId, kind, text, ...(kind === "speech" ? { lang: TARGET } : {}) });
    if (r.status !== 200) console.log("줄 실패", key, r.status, r.body);
    await wait(900);
    return r.body?.line;
  };
  await say("host", "Hi everyone! Let's talk about our weekend plans.");
  await say("speaker", "I'm going hiking with my friends on Saturday.");
  await say("mixed", "That sounds fun. Which mountain are you going to?");
  await say("speaker", "Bukhansan. It's a bit tough, but the view is worth it.");
  await say("chat", "저는 이번 주말에 집에서 쉬려고요 😅", "text");
  await say("chat", "I will rest at home this weekend.", "text");
  await say("host", "Resting is a good plan too, Leo.");
  await wait(6000);

  // 하나: Mina의 줄을 눌러 번역 → "무슨 뜻이에요?" → 보내기.
  const mp = people.mixed.page;
  await mp.getByText("the view is worth it", { exact: false }).first().click().catch((e) => console.log("줄 누르기 실패", e.message));
  await wait(5000);
  await shot(mp, "05a-mixed-tap.png", "하나", "복합 — 남의 줄을 누르면 번역과 묻기·답하기", "줄 아래 앱 언어 번역, ❓ 무슨 뜻이에요? · ↩ 답하기 · ✉ 쪽지로 묻기.");
  await mp.getByRole("button", { name: new RegExp(t.askMeaning) }).first().click().catch((e) => console.log("묻기 실패", e.message));
  await wait(1500);
  await shot(mp, "05b-mixed-ask.png", "하나", "복합 — 묻기를 누르면 인용과 질문이 채워짐", "질문은 배우는 언어로 미리 채워진다. 그대로 보내거나 고친다.");
  await mp.getByRole("button", { name: new RegExp(`^${t.send}$`) }).first().click().catch((e) => console.log("보내기 실패", e.message));
  await wait(7000);

  await shot(people.host.page, "01-host.png", "지수", "방장 — 👑, 손든 사람, 방 닫기", "말하기 자리 격자(👑 방장), 듣는 사람 줄의 ✋, 위의 방 닫기.");
  await shot(people.speaker.page, "02-speaker.png", "Mina", "음성 대화 — 내 말을 누가 물어봄", "말하기 자리. 하나가 내 줄을 물어 노란 테두리 \"…님이 내 말을 물어봤어요\".");
  await shot(people.listener.page, "03-listener.png", "준호", "관전자 — 듣기만, 손 든 상태", "자막은 그대로 보이고 댓글로 참여할 수 있다. 방장이 올려 주면 말한다.");
  await shot(people.chat.page, "04-chat.png", "Leo", "채팅 사용자 — 💬 채팅만", "소리는 잇지 않는다. 자막과 채팅으로 함께한다.");
  await shot(mp, "05c-mixed-after.png", "하나", "복합 — 물은 뒤 내 화면", "채팅에 인용 붙은 질문, 집힌 줄 옆 ❓ 수.");

  // 방장: 방 닫기 → 고르기 → 잠시 닫기
  const hp = people.host.page;
  await hp.getByRole("button", { name: new RegExp(`^${t.closeRoom}$`) }).first().click();
  await wait(1500);
  await shot(hp, "06-host-close.png", "지수", "방 중단 — 방장의 방 닫기 고르기", "👑 방장 넘기고 나가기 / ⏸ 잠시 닫기 / 방 닫기.");
  await hp.getByRole("button", { name: new RegExp(t.leavePause.split(" ")[0]) }).first().click();
  await wait(9000);
  await shot(people.chat.page, "07-closed-chat.png", "Leo", "방 중단 — 남은 사람 화면", "방장이 잠시 닫으면 남은 사람에게 \"방이 닫혔어요\".");
  await shot(people.listener.page, "07b-closed-listener.png", "준호", "방 중단 — 듣던 사람 화면", "");
  await hp.goto(BASE + "/?screen=rooms", { waitUntil: "domcontentloaded" });
  await wait(5000);
  await shot(hp, "08-host-parked.png", "지수", "방 중단 — 방장 로비의 잠시 닫은 방", "\"내 방 · 잠시 닫음 → 다시 열기\"로 같은 방 번호로 다시 연다(30일).");
  // 다시 열어 두지 않고 정리: 잠시 닫은 방은 계정을 지우면 함께 사라진다.
} catch (error) {
  console.log("멈춤:", String(error?.message ?? error).split("\n")[0]);
} finally {
  await browser?.close().catch(() => undefined);
  server.close();
  for (const p of Object.values(people)) await api(p, "/api/account/delete", {}).catch(() => undefined);
  await forgetAtEnd(API, RUN);
  const ordered = [...shots].sort((a, b) => a.file.localeCompare(b.file));
  fs.writeFileSync(path.join(OUT, "shots.json"), JSON.stringify(ordered, null, 1));
  console.log(`${ordered.length}장 → ${path.relative(ROOT, OUT)}`);
}
