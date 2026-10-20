/**
 * 사람끼리 쓰는 기능을 각자의 시선으로 찍기 — 실제 앱(www)을 계정 셋으로 띄워
 * 1:1 메시지(요청 → 답장으로 열림 → 줄 집어 묻기), 1:1 통화(걸기 → 받기 → 통화 중 → 통화 기록),
 * 단체방(대화 → 📞 단체방 통화 → 다른 사람에게 "지금 n명 통화 중")을 찍는다.
 *
 *   npm run build:capacitor
 *   NODE_USE_ENV_PROXY=1 node --experimental-strip-types scripts/sim-users/social-views.mjs
 *
 * 사람(숨김 임시 계정, 끝에 삭제): 지수(영어 배움 · 앱 한국어) · Mina(한국어 배움 · 앱 영어) · Leo(영어 배움 · 앱 한국어, 단체방만).
 * 숨김 계정이라 사람 탭 목록에는 안 나온다(실제 사용자 얼굴을 찍지 않으려고) — 프로필은 대화 화면에서 연다.
 * 통화의 받아쓴 말은 가짜 마이크라 생기지 않아, 말하기 자리의 줄은 API로 넣는다(앱이 받아쓴 뒤 보내는 것과 같은 요청).
 * 결과: tmp/sim-users/<실행>/social-views/*.png, shots.json
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
const PORT = Number(process.env.PORT || 4223);
const RUN = value("run-id", `socialviews-${new Date(Date.now() + 9 * 3600_000).toISOString().replace(/[-:]/g, "").slice(0, 13)}`);
const OUT = path.join(ROOT, "tmp/sim-users", RUN, "social-views");
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
    const username = `simsv${shortId(uid)}`.slice(0, 20);
    const signed = await api({ uid }, "/api/account/password/signup", { username, password: `sim-${shortId(username)}-pw!` });
    if (!signed.body?.token) throw new Error(`가입 실패 ${c.key}: ${signed.status} ${JSON.stringify(signed.body)}`);
    const person = { ...c, uid, token: signed.body.token };
    await api(person, "/api/account/profile", { nickname: c.nick, bio: c.bio, hidden: true, targetLanguage: c.target, uiLanguage: c.ui });
    person.account = (await api(person, "/api/account/me")).body?.account;
    people[c.key] = person;
  }
  const { me, mina, leo } = people;
  const dm = (who, action, extra) => api(who, "/api/dm", { code: ROOM_CODE, action, ...extra });
  const groups = (who, action, extra) => api(who, "/api/groups", { code: ROOM_CODE, action, ...extra });

  // Mina가 먼저 1:1 메시지(요청). 단체방: Leo가 만들고 지수·Mina 초대, Mina는 받음.
  const first = await dm(mina, "send", { target: me.account.id, text: "Hi! I'm learning Korean. 저는 미나예요. Can we practice together?" });
  if (first.status !== 200) console.log("요청 실패", first.status, first.body);
  const groupName = "[test] 영어·한국어 스터디";
  const made = await groups(leo, "create", { name: groupName, languages: ["en", "ko"], invite: [me.account.id, mina.account.id] });
  const groupId = made.body?.group?.id;
  if (groupId) await groups(mina, "answer", { groupId, accept: true });

  browser = await chromium.launch({
    ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}),
    args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--autoplay-policy=no-user-gesture-required"],
  });
  await openPage(me);
  await openPage(mina);

  // ① 지수: 대화 탭 — AI 튜터 줄 · 단체방 초대 · 메시지 요청
  await goTalk(me);
  await shot(me, "01-talk-list.png", "대화 탭 — AI 튜터 · 단체방 초대 · 메시지 요청", "맨 위 AI 튜터 줄, 받은 단체방 초대, 처음 보낸 사람의 메시지 요청.");

  // ② 지수: 요청을 열어 답장 → 대화가 열림
  await tryDo("요청 열기", async () => {
    await me.page.getByText("Mina", { exact: true }).first().click();
    await wait(3500);
  });
  await shot(me, "02-dm-request.png", "1:1 — 받은 메시지 요청", "답장하면 대화가 열린다. 거절할 수도 있다.");
  await tryDo("답장", async () => {
    await me.page.locator(`textarea[placeholder="${me.t.messagePlaceholder}"], input[placeholder="${me.t.messagePlaceholder}"]`).first().fill("반가워요! I'm learning English. Let's practice 😊");
    await me.page.getByRole("button", { name: re(me.t.send) }).last().click();
    await wait(3000);
  });
  await dm(mina, "send", { target: me.account.id, text: "Great! What did you do last weekend?" });
  await dm(me, "send", { target: mina.account.id, text: "I go to Busan with my family. It was so fun!" });
  await dm(mina, "send", { target: me.account.id, text: "Nice! Small tip: \"I went to Busan\" 😊 부산 좋죠! 바다 봤어요?" });
  await wait(9000);

  // ③ 지수: Mina의 줄을 눌러 번역 → 묻기
  await tryDo("줄 누르기", async () => {
    await me.page.getByText("Nice! Small tip", { exact: false }).last().click();
    await wait(5000);
  });
  await shot(me, "03-dm-thread-me.png", "1:1 — 열린 대화, 상대 줄 누르기", "줄을 누르면 앱 언어 번역, ❓ 무슨 뜻이에요? · ↩ 답하기. 상대가 고쳐 준 표현도 그대로 남는다.");

  // ④ Mina(앱 영어): 같은 대화
  await goTalk(mina);
  await tryDo("Mina 대화 열기", async () => {
    await mina.page.getByText("지수", { exact: true }).first().click();
    await wait(4000);
  });
  await shot(mina, "04-dm-thread-mina.png", "1:1 — 상대(Mina, 앱 영어) 화면", "같은 대화가 Mina의 앱 언어(영어)로. 한국어를 배우는 쪽.");

  // ⑤ Mina가 📞 → Mina는 통화 화면, 지수 대화에는 "통화 요청 · 받기"
  await tryDo("Mina 통화 걸기", async () => {
    await mina.page.locator(`button[aria-label="${mina.t.call}"]`).last().click();
    await wait(7000);
  });
  await shot(mina, "05-call-caller.png", "1:1 통화 — 건 사람(Mina)", "둘만의 비공개 방이 열려 상대를 기다린다.");
  await wait(4000);
  await shot(me, "06-call-incoming.png", "1:1 통화 — 받는 사람(지수) 대화에 통화 요청", "📞 통화 요청 · 받기.");
  await tryDo("받기", async () => {
    await me.page.getByRole("button", { name: new RegExp(`^${me.t.callJoin}$`) }).last().click();
    await wait(8000);
  });

  // 통화 중 줄: 받아쓴 말은 가짜 마이크라 생기지 않아 API로(앱이 받아쓴 뒤 보내는 것과 같은 요청).
  step(`통화 방 지수 ${JSON.stringify(me.joined)} · Mina ${JSON.stringify(mina.joined)}`);
  if (me.joined && mina.joined) {
    for (const [person, text] of [[mina, "So, did you see the sea in Busan?"], [me, "Yes! We saw the sea and ate 회. It was really fresh."], [mina, "회 is raw fish, right? 맛있었겠다!"]]) {
      const r = await api(person, "/api/rooms", { code: ROOM_CODE, action: "line", peerId: person.joined.peerId, roomId: person.joined.roomId, kind: "speech", text, lang: (text.match(/[가-힣]/g) ?? []).length > text.length / 3 ? "ko" : "en" });
      if (r.status !== 200) console.log("  줄 실패", r.status, r.body);
      await wait(800);
    }
    await wait(6000);
  }
  await shot(me, "07-call-me.png", "1:1 통화 — 통화 중(지수)", "자리 2칸, 자막·채팅, 마이크.");
  await shot(mina, "08-call-mina.png", "1:1 통화 — 통화 중(Mina, 앱 영어)", "");

  // 끝: 둘 다 나가기 → 대화에 통화 기록
  await tryDo("지수 나가기", async () => {
    await me.page.getByRole("button", { name: new RegExp(`^${me.t.leave}$`) }).last().click();
    await wait(2500);
  });
  await tryDo("Mina 나가기", async () => {
    await mina.page.getByRole("button", { name: new RegExp(`^${mina.t.leave}$`) }).last().click();
    await wait(6000);
  });
  await goTalk(me);
  await tryDo("대화 다시 열기", async () => {
    await me.page.getByText("Mina", { exact: true }).first().click();
    await wait(5000);
  });
  await tryDo("통화 기록 펼치기", async () => {
    await me.page.getByText(me.t.callEnded, { exact: false }).last().click();
    await wait(1500);
  });
  await shot(me, "09-call-log.png", "1:1 — 통화가 끝나면 대화에 통화 기록", "통화 기록 카드 — 펼치면 통화 중 자막 줄, 줄을 집어 다시 물을 수 있다.");

  // 단체방: 지수가 초대를 받고, 대화 몇 줄
  if (groupId) {
    await groups(me, "answer", { groupId, accept: true });
    const l1 = await groups(leo, "send", { groupId, text: "Welcome to our study group! Let's talk only in English today 🙂" });
    await groups(mina, "send", { groupId, text: "오늘은 한국어도 조금 해요! 다들 주말 잘 보냈어요?" });
    await groups(me, "send", { groupId, text: "I went to Busan. Mina taught me \"I went\" 😆" });
    void l1;
    await wait(2000);
    await goTalk(me);
    await tryDo("단체방 열기", async () => {
      await me.page.getByText(groupName, { exact: false }).filter({ visible: true }).first().click();
      await wait(5000);
    });
    await shot(me, "11-group.png", "단체방 — 세 사람 대화", "말풍선마다 사진, 줄을 누르면 번역·묻기. 위 📞로 단체방 통화.");

    // Mina가 단체방 통화를 시작 → 지수 화면에 "지금 n명 통화 중"
    await goTalk(mina);
    await tryDo("Mina 단체방 통화", async () => {
      // 눌림을 가로막는 층이 있어도 앱의 버튼을 그대로 누른다(DOM click).
      await mina.page.getByText(groupName, { exact: false }).filter({ visible: true }).first().evaluate((el) => el.click());
      await wait(4000);
      await mina.page.locator(`button[aria-label="${mina.t.call}"]:visible`).last().evaluate((el) => el.click());
      await wait(9000);
    });
    await shot(mina, "12-group-call-mina.png", "단체방 통화 — 시작한 사람(Mina)", "단체방 사람만 들어오는 비공개 방.");
    await me.page.reload({ waitUntil: "domcontentloaded" });
    await wait(5000);
    await tryDo("지수 단체방 다시 열기", async () => {
      await me.page.getByText(groupName, { exact: false }).filter({ visible: true }).first().click();
      await wait(6000);
    });
    await shot(me, "13-group-call-live.png", "단체방 통화 — 다른 사람 화면", "🎙 지금 n명 통화 중 · 들어가기.");
  }
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
