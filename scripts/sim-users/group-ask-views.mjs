/**
 * 단체방에서 남의 줄을 집어 묻기 — 계정 셋(지수 en/ko · Mina ko/en · Leo)으로 단체방을 만들고,
 * 지수가 Leo의 줄을 눌러 번역 → ❓ 무슨 뜻이에요? → 보내기, Leo 화면의 "내 말을 물어봤어요", Leo의 답, Mina 화면을 찍는다.
 *
 *   npm run build:capacitor
 *   NODE_USE_ENV_PROXY=1 node --experimental-strip-types scripts/sim-users/group-ask-views.mjs
 *
 * 숨김 임시 계정, 끝에 계정·점검 데이터 삭제. 결과: tmp/sim-users/<실행>/group-ask-views/*.png
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { shortId, ROOM_CODE } from "./accounts.mjs";
import { forgetAtEnd } from "./forget.mjs";
import { roomCopy } from "../../src/lib/rooms/copy.ts";

const args = process.argv.slice(2);
const value = (name, fallback) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : fallback; };
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const WWW = path.join(ROOT, "www");
const API = (process.env.API_BASE || "https://english-chat-mvp.vercel.app").replace(/\/$/, "");
const PORT = Number(process.env.PORT || 4224);
const RUN = value("run-id", `groupask-${new Date(Date.now() + 9 * 3600_000).toISOString().replace(/[-:]/g, "").slice(0, 13)}`);
const OUT = path.join(ROOT, "tmp/sim-users", RUN, "group-ask-views");
fs.mkdirSync(OUT, { recursive: true });
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const re = (s) => new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

async function api(person, pathname, body) {
  const response = await fetch(`${API}${pathname}`, {
    method: body === undefined ? "GET" : "POST",
    headers: { "content-type": "application/json", "x-rc-user": person.uid, ...(person.token ? { "x-auth-token": person.token } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, body: await response.json().catch(() => null) };
}

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
  { key: "me", nick: "지수", target: "en", ui: "ko", bio: "영어로 수다 떨 친구 찾아요" },
  { key: "mina", nick: "Mina", target: "ko", ui: "en", bio: "Learning Korean. Let's exchange!" },
  { key: "leo", nick: "Leo", target: "en", ui: "ko", bio: "" },
];
const people = {};
const shots = [];
let browser;
const step = (msg) => console.log(`· ${msg}`);
async function shot(person, file, title, note) {
  await wait(1200);
  await person.page.screenshot({ path: path.join(OUT, file) });
  shots.push({ file, who: person.nick, title, note });
  console.log(`찍음 ${file} — ${person.nick}: ${title}`);
}
const tryDo = async (label, fn) => {
  try {
    await fn();
  } catch (error) {
    console.log(`  ${label} 실패: ${String(error?.message ?? error).split("\n")[0]}`);
  }
};

async function openPage(person) {
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
  }, [person.token, person.account, ROOM_CODE, person.target, person.ui]);
  // 통화 방 번호·내 이름표: 앱이 보내는 join 요청에서 읽는다(받아쓴 줄을 API로 넣으려고).
  page.on("request", (request) => {
    if (!request.url().includes("/api/rooms") || request.method() !== "POST") return;
    try {
      const body = JSON.parse(request.postData() ?? "{}");
      if (body.action === "join" && body.roomId && body.peerId) person.joined = { roomId: body.roomId, peerId: body.peerId };
    } catch {
      // 다른 요청
    }
  });
  person.page = page;
  person.t = roomCopy(person.ui);
}
const goTalk = async (person) => {
  await person.page.goto(BASE + "/?screen=talk", { waitUntil: "domcontentloaded" });
  await wait(5000);
};

try {
  for (const c of CAST) {
    const uid = `simcheck-${RUN}-${c.key}`;
    const username = `simga${shortId(uid)}`.slice(0, 20);
    const signed = await api({ uid }, "/api/account/password/signup", { username, password: `sim-${shortId(username)}-pw!` });
    if (!signed.body?.token) throw new Error(`가입 실패 ${c.key}: ${signed.status} ${JSON.stringify(signed.body)}`);
    const person = { ...c, uid, token: signed.body.token };
    await api(person, "/api/account/profile", { nickname: c.nick, bio: c.bio, hidden: true });
    person.account = (await api(person, "/api/account/me")).body?.account;
    people[c.key] = person;
  }
  const { me, mina, leo } = people;
  const groups = (who, action, extra) => api(who, "/api/groups", { code: ROOM_CODE, action, ...extra });
  const groupName = "[test] 영어·한국어 스터디";
  const made = await groups(leo, "create", { name: groupName, languages: ["en", "ko"], invite: [me.account.id, mina.account.id] });
  const groupId = made.body?.group?.id;
  if (!groupId) throw new Error(`단체방 만들기 실패 ${made.status} ${JSON.stringify(made.body)}`);
  await groups(me, "answer", { groupId, accept: true });
  await groups(mina, "answer", { groupId, accept: true });
  for (const [who, text] of [
    [leo, "Welcome! Today's topic: weekend plans 🙂"],
    [mina, "이번 주말에 친구랑 한강에서 치맥 하기로 했어요!"],
    [leo, "Sounds fun. I'm gonna crash at home and binge-watch a drama."],
    [me, "I want to go hiking but it might rain."],
  ]) {
    await groups(who, "send", { groupId, text });
    await wait(700);
  }

  browser = await chromium.launch({
    ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}),
    args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"],
  });
  for (const p of [me, mina, leo]) await openPage(p);
  const openGroup = async (p) => {
    await goTalk(p);
    await p.page.getByText(groupName, { exact: false }).filter({ visible: true }).first().evaluate((el) => el.click());
    await wait(5000);
  };

  // ① 지수(영어 배움): Leo의 영어 줄을 눌러 번역 → ❓ 무슨 뜻이에요?
  await openGroup(me);
  await tryDo("Leo 줄 누르기", async () => {
    await me.page.getByText("binge-watch a drama", { exact: false }).filter({ visible: true }).last().click();
    await wait(6000);
  });
  await shot(me, "01-tap-line.png", "지수 — 단체방에서 남의 줄을 누름", "앱 언어(한국어) 번역 + ❓ 무슨 뜻이에요? · ↩ 답하기.");
  await tryDo("묻기", async () => {
    await me.page.getByRole("button", { name: re(me.t.askMeaning) }).filter({ visible: true }).last().click();
    await wait(1500);
  });
  await shot(me, "02-ask-compose.png", "지수 — 묻기를 누르면 인용 + 질문 채워짐", "질문은 배우는 언어(영어)로 미리 채워져 있다. 그대로 보내거나 고친다.");
  await tryDo("보내기", async () => {
    await me.page.getByRole("button", { name: new RegExp(`^${me.t.send}$`) }).filter({ visible: true }).last().click();
    await wait(5000);
  });
  await shot(me, "03-ask-sent.png", "지수 — 보낸 뒤", "대화에 인용 붙은 질문.");

  // ② Leo(말한 사람): 내 말을 물어봤다는 표시 → ↩ 답하기
  await openGroup(leo);
  await wait(3000);
  await shot(leo, "04-leo-asked.png", "Leo — 내 말을 누가 물어봄", "노란 테두리 \"지수님이 내 말을 물어봤어요\".");
  await groups(leo, "send", { groupId, text: "\"Binge-watch\" means watching many episodes in a row, like 몰아보기 😄" });
  await wait(6000);

  // ③ Mina(한국어 배움 · 앱 영어): 같은 단체방 + 지수의 한국어 아닌 줄도 앱 언어로
  await openGroup(mina);
  await tryDo("Mina 줄 누르기", async () => {
    await mina.page.getByText("몰아보기", { exact: false }).filter({ visible: true }).last().click();
    await wait(6000);
  });
  await shot(mina, "05-mina-view.png", "Mina(앱 영어) — 같은 단체방, 답 줄을 누름", "질문·답이 한 흐름으로, 번역은 Mina의 앱 언어(영어)로.");
  await openGroup(me);
  await shot(me, "06-me-answer.png", "지수 — 답을 받은 화면", "Leo의 답(몰아보기)까지.");
} catch (error) {
  console.log("멈춤:", String(error?.message ?? error).split("\n")[0]);
} finally {
  await browser?.close().catch(() => undefined);
  server.close();
  for (const p of Object.values(people)) await api(p, "/api/account/delete", {}).catch(() => undefined);
  await forgetAtEnd(API, RUN);
  fs.writeFileSync(path.join(OUT, "shots.json"), JSON.stringify(shots, null, 1));
  console.log(`${shots.length}장 → ${path.relative(ROOT, OUT)}`);
}
