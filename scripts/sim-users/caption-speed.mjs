/**
 * 말하는 방 자막 속도 재기 — 실제 앱(www)을 계정 둘로 띄우고, 말하는 사람에게 녹음 파일을 가짜 마이크로 넣어
 * 듣는 사람 화면에 "…" 말풍선과 글이 언제 뜨는지 잰다(받아쓰기 빠르게, 2026-10-20).
 *
 *   npm run build:capacitor
 *   NODE_USE_ENV_PROXY=1 node scripts/sim-users/caption-speed.mjs --audio <말소리.wav> [--ui ko] [--target en] [--expect "낱말1,낱말2"] [--fix-check]
 *
 * --fix-check(내 줄 교정, 2026-10-22): 받아쓴 뒤 말하는 사람 화면에 "✎ 고칠 곳이 있어요" 칩이 뜨는지 → 눌러 고친 문장이 열리는지,
 * 듣는 사람 화면에는 칩이 없는지 본다(틀린 문장을 녹음 파일로). speaker-fix.png·speaker-fix-open.png·listener.png.
 *
 * 녹음 파일: 앞에 조용함 → 말 → 짧은 쉼(0.6~1초) → 말 → 긴 조용함. 크롬 가짜 마이크는 파일을 되풀이하므로 첫 바퀴만 잰다.
 * 사람(숨김 임시 계정, 끝에 삭제): 말하는 사람(방장, 말하기 자리) · 듣는 사람(👂). 결과: tmp/sim-users/<실행>/caption-speed/ (화면·시간표 json).
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { shortId, ROOM_CODE } from "./accounts.mjs";
import { forgetAtEnd } from "./forget.mjs";
import { roomCopy } from "../../src/lib/rooms/copy.ts";

const args = process.argv.slice(2);
const value = (name, fallback) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : fallback; };
const AUDIO = value("audio");
if (!AUDIO || !fs.existsSync(AUDIO)) throw new Error("--audio <wav> 가 필요합니다");
const UI = value("ui", "ko");
const TARGET = value("target", "en");
const EXPECT = (value("expect", "") || "").split(",").map((w) => w.trim()).filter(Boolean);
const FIX_CHECK = args.includes("--fix-check");
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const WWW = path.join(ROOT, "www");
const API = (process.env.API_BASE || "https://english-chat-mvp.vercel.app").replace(/\/$/, "");
const PORT = Number(process.env.PORT || 4223);
const RUN = value("run-id", `capspeed-${new Date(Date.now() + 9 * 3600_000).toISOString().replace(/[-:]/g, "").slice(0, 13)}`);
const OUT = path.join(ROOT, "tmp/sim-users", RUN, "caption-speed");
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

const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".webp": "image/webp", ".mp3": "audio/mpeg" };
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

const people = {};
const browsers = [];
const events = [];
let shotComposing = false;

/** 화면에서 자막 칸의 "…" 말풍선 수와 말풍선 글들을 100ms마다 적는다. */
async function watch(page, who, ms) {
  const started = Date.now();
  let last = "";
  while (Date.now() - started < ms) {
    const snap = await page.evaluate(() => {
      const dots = document.querySelectorAll(".composing-dots").length;
      const texts = [...document.querySelectorAll("li span.text-chat, li span.text-title")].map((n) => n.textContent?.trim()).filter(Boolean);
      return { dots, texts };
    }).catch(() => null);
    if (snap) {
      // 듣는 사람 화면에 처음 "…"가 뜬 순간과, 글이 처음 채워진 순간을 한 장씩.
      if (who === "listener" && snap.dots > 0 && !shotComposing) {
        shotComposing = true;
        await page.screenshot({ path: path.join(OUT, "listener-composing.png") }).catch(() => undefined);
      }
      const key = JSON.stringify(snap);
      if (key !== last) {
        events.push({ who, at: Date.now(), ...snap });
        last = key;
      }
    }
    await wait(100);
  }
}

async function open(person, key, extraArgs) {
  const browser = await chromium.launch({
    ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}),
    args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--autoplay-policy=no-user-gesture-required", ...extraArgs],
  });
  browsers.push(browser);
  const context = await browser.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 1, permissions: ["microphone"] });
  const page = await context.newPage();
  await page.route("**/api/**", (route) => route.continue({ headers: { ...route.request().headers(), "x-rc-user": person.uid } }));
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await page.evaluate(([token, acct, code, target, ui]) => {
    localStorage.setItem("appTargetLanguage", target);
    localStorage.setItem("appUiLocale", ui);
    localStorage.setItem("whatsNewSeenVersion", "999");
    localStorage.setItem("ec_auth_token", token);
    localStorage.setItem("ec_account", JSON.stringify(acct));
    localStorage.setItem("roomsInviteCode", code);
  }, [person.token, person.account, ROOM_CODE, TARGET, UI]);
  person.page = page;
  person.key = key;
  return page;
}

try {
  for (const [key, nick] of [["speaker", "Mina"], ["listener", "준호"]]) {
    const uid = `simcheck-${RUN}-${key}`;
    const username = `simcs${shortId(uid)}`.slice(0, 20);
    const signed = await api({ uid }, "/api/account/password/signup", { username, password: `sim-${shortId(username)}-pw!` });
    if (!signed.body?.token) throw new Error(`가입 실패 ${key}: ${signed.status} ${JSON.stringify(signed.body)}`);
    const person = { uid, token: signed.body.token, nick };
    await api(person, "/api/account/profile", { nickname: nick, bio: "", hidden: true });
    person.account = (await api(person, "/api/account/me")).body?.account;
    people[key] = person;
  }
  const roomName = `[test] 자막 속도 ${shortId(RUN).slice(0, 4)}`;

  // 듣는 사람이 먼저 들어가 기다린다(말하는 사람의 녹음 파일이 처음부터 들리게).
  const speakerPeer = `cs${shortId(RUN)}`;
  const made = await api(people.speaker, "/api/rooms", { code: ROOM_CODE, action: "create", peerId: speakerPeer, name: roomName, languages: [TARGET, UI] });
  if (!made.body?.room?.id) throw new Error(`방 만들기 실패 ${made.status} ${JSON.stringify(made.body)}`);
  const lp = await open(people.listener, "listener", []);
  await lp.goto(BASE + "/?screen=rooms", { waitUntil: "domcontentloaded" });
  await lp.getByText(roomName).first().click({ timeout: 30_000 });
  await wait(2500);
  // 듣는 사람은 👂 듣기만(가짜 마이크의 삐 소리가 자막이 되지 않게).
  await lp.getByRole("button", { name: new RegExp(`👂\\s*${roomCopy(UI).joinListen}`) }).first().click().catch((e) => console.log("듣기 고르기 실패", e.message));
  await wait(2000);

  // 말하는 사람(방장): 같은 방에 들어가면 말하기 자리 → 마이크가 열리고 녹음 파일이 흘러나온다.
  const sp = await open(people.speaker, "speaker", [`--use-file-for-fake-audio-capture=${path.resolve(AUDIO)}`]);
  // 말하는 사람이 보낸 조각(말 번호·순번·크기)과 받아쓴 글.
  sp.on("requestfinished", async (request) => {
    if (!request.url().includes("/api/roleplay/listen")) return;
    try {
      const body = JSON.parse(request.postData() || "{}");
      const answer = await (await request.response())?.json().catch(() => null);
      events.push({ who: "part", at: Date.now(), mark: `조각 ${body.utterance ?? "-"}#${body.part ?? "-"} ${Math.round((body.audioBase64?.length ?? 0) * 0.75 / 1024)}KB → "${answer?.text ?? ""}"${body.previous ? ` (앞 글: ${body.previous})` : ""}` });
    } catch {
      // 기록만 못 함.
    }
  });
  await sp.goto(BASE + "/?screen=rooms", { waitUntil: "domcontentloaded" });
  await sp.getByText(roomName).first().click({ timeout: 30_000 });
  const t0 = Date.now();
  events.push({ who: "speaker", at: t0, mark: "방 들어감(마이크 열림 즈음)" });
  await Promise.all([watch(sp, "speaker", 20_000), watch(lp, "listener", 20_000)]);
  await sp.screenshot({ path: path.join(OUT, "speaker.png") });
  await lp.screenshot({ path: path.join(OUT, "listener.png") });
  if (FIX_CHECK) {
    const tc = roomCopy(UI);
    const chip = sp.getByRole("button", { name: new RegExp(tc.fixChip) }).first();
    const shown = await chip.waitFor({ timeout: 20_000 }).then(() => true).catch(() => false);
    console.log(`교정 칩(말하는 사람): ${shown ? "보임" : "안 보임"}`);
    if (shown) {
      await chip.scrollIntoViewIfNeeded().catch(() => undefined);
      await sp.screenshot({ path: path.join(OUT, "speaker-fix.png") });
      await chip.click();
      const opened = await sp.getByText(tc.fixTitle).first().waitFor({ timeout: 15_000 }).then(() => true).catch(() => false);
      await wait(500);
      await sp.screenshot({ path: path.join(OUT, "speaker-fix-open.png") });
      const card = await sp.evaluate((title) => {
        const node = [...document.querySelectorAll("p")].find((p) => p.textContent?.includes(title));
        return node?.parentElement?.parentElement?.textContent?.trim() ?? "";
      }, tc.fixTitle);
      console.log(`눌러 열기: ${opened ? "열림" : "안 열림"} · ${card}`);
    }
    const leaked = await lp.getByText(tc.fixChip).count();
    console.log(`듣는 사람 화면의 교정 칩: ${leaked}개`);
    await lp.screenshot({ path: path.join(OUT, "listener.png") });
  }

  const rel = events.map((e) => ({ ...e, t: ((e.at - t0) / 1000).toFixed(1) }));
  fs.writeFileSync(path.join(OUT, "timeline.json"), JSON.stringify(rel, null, 2));
  for (const e of rel) console.log(`${e.t}s ${e.who.padEnd(8)} ${e.mark ?? `… ${e.dots}  | ${e.texts.join(" / ")}`}`);
  const finalTexts = rel.filter((e) => e.who === "listener" && e.texts).at(-1)?.texts ?? [];
  if (EXPECT.length) {
    const joined = finalTexts.join(" ").toLowerCase();
    console.log(`기대 낱말: ${EXPECT.map((w) => `${w}${joined.includes(w.toLowerCase()) ? "✓" : "✗"}`).join(" ")}`);
  }
  console.log(`듣는 사람 마지막 말풍선 ${finalTexts.length}개: ${finalTexts.join(" / ")}`);
} catch (error) {
  console.log("멈춤:", String(error?.message ?? error).split("\n")[0]);
} finally {
  for (const b of browsers) await b.close().catch(() => undefined);
  server.close();
  for (const p of Object.values(people)) await api(p, "/api/account/delete", {}).catch(() => undefined);
  await forgetAtEnd(API, RUN).catch(() => undefined);
}
