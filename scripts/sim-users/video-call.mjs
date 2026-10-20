/**
 * 1:1 영상통화 점검 — 실제 앱(www)을 헤드리스 브라우저 둘로 띄워, 1:1 대화의 📞로 통화를 열고
 * 둘 다 "카메라 켜기"를 누른 뒤 서로 영상이 오는지(받은 영상 바이트·화면의 video 크기) 본다.
 *
 *   npm run build:capacitor   (www가 지금 코드여야)
 *   NODE_USE_ENV_PROXY=1 node --experimental-strip-types scripts/sim-users/video-call.mjs [--locale ko] [--target en] [--locale2 ar] [--target2 es]
 *
 * - 가짜 카메라·마이크(크롬 --use-fake-device-for-media-stream: 움직이는 시험 화면 + 삐 소리).
 * - 임시 계정 둘(숨김), 첫 메시지·답으로 대화를 연 뒤 📞. 끝에 계정 삭제.
 * - 스크린샷: tmp/sim-users/<실행>/caller.png·callee.png(카메라 켬), caller-off.png(상대가 끈 뒤).
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { shortId } from "./accounts.mjs";
import { forgetAtEnd } from "./forget.mjs";
import { roomCopy } from "../../src/lib/rooms/copy.ts";

const args = process.argv.slice(2);
const opt = (name, fallback) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : fallback; };
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const WWW = path.join(ROOT, "www");
const API = (process.env.API_BASE || "https://english-chat-mvp.vercel.app").replace(/\/$/, "");
const PORT = Number(process.env.PORT || 4212);
const RUN = `video-${new Date().toISOString().replace(/[-:]/g, "").slice(0, 13)}`;
const OUT = path.join(ROOT, "tmp/sim-users", RUN);
fs.mkdirSync(OUT, { recursive: true });
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");

const SIDES = [
  { name: "caller", locale: opt("locale", "ko"), target: opt("target", "ja") },
  { name: "callee", locale: opt("locale2", "ar"), target: opt("target2", "es") },
];

async function api(uid, pathname, body, token) {
  const response = await fetch(`${API}${pathname}`, {
    method: body === undefined ? "GET" : "POST",
    headers: { "content-type": "application/json", "x-rc-user": uid, ...(token ? { "x-auth-token": token } : {}) },
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

/** 브라우저 안: 연결을 모아 받은 영상·소리 바이트와 화면의 video 크기를 센다. */
const TRACK = () => {
  const Native = window.RTCPeerConnection;
  window.__pcs = [];
  window.__ice = [];
  window.RTCPeerConnection = function (config, ...rest) {
    window.__ice.push((config?.iceServers ?? []).flatMap((row) => [].concat(row.urls)));
    const pc = new Native(config, ...rest);
    window.__pcs.push(pc);
    return pc;
  };
  window.RTCPeerConnection.prototype = Native.prototype;
  window.__videoStats = async () => {
    let videoIn = 0;
    let audioIn = 0;
    let videoOut = 0;
    const states = [];
    for (const pc of window.__pcs) {
      states.push(pc.connectionState);
      if (pc.connectionState !== "connected") continue;
      const stats = await pc.getStats();
      stats.forEach((s) => {
        if (s.type === "inbound-rtp" && s.kind === "video") videoIn += s.bytesReceived ?? 0;
        if (s.type === "inbound-rtp" && s.kind === "audio") audioIn += s.bytesReceived ?? 0;
        if (s.type === "outbound-rtp" && s.kind === "video") videoOut += s.bytesSent ?? 0;
      });
    }
    const videos = [...document.querySelectorAll("video")].map((v) => ({ w: v.videoWidth, h: v.videoHeight, label: v.getAttribute("aria-label") }));
    return { states, videoIn, audioIn, videoOut, videos, ice: window.__ice };
  };
};

const people = [];
const result = { run: RUN, sides: SIDES };
let browser;
try {
  for (const side of SIDES) {
    const uid = `simcheck-${RUN}-${side.name}`;
    const username = `simvd${shortId(uid)}`.slice(0, 20);
    const signed = await api(uid, "/api/account/password/signup", { username, password: `sim-${shortId(username)}-pw!` });
    if (!signed.body?.token) throw new Error(`가입 실패 ${side.name}: ${signed.status}`);
    await api(uid, "/api/account/profile", { nickname: `video-${side.name}`, bio: "", hidden: true }, signed.body.token);
    const me = (await api(uid, "/api/account/me", undefined, signed.body.token)).body?.account;
    people.push({ ...side, uid, token: signed.body.token, id: signed.body.account.id, account: me });
  }
  const [a, b] = people;
  // 첫 메시지 → 답하면 대화가 열린다(그래야 📞).
  const first = await api(a.uid, "/api/dm", { action: "send", target: b.id, text: "[test] hi" }, a.token);
  const reply = await api(b.uid, "/api/dm", { action: "send", target: a.id, text: "[test] hello" }, b.token);
  if (first.status !== 200 || reply.status !== 200) throw new Error(`대화 열기 실패 ${first.status}/${reply.status}`);

  browser = await chromium.launch({
    ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}),
    args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--autoplay-policy=no-user-gesture-required"],
  });
  const pages = [];
  for (const person of people) {
    const context = await browser.newContext({ viewport: { width: 412, height: 915 }, permissions: ["microphone", "camera"] });
    await context.addInitScript(TRACK);
    const page = await context.newPage();
    page.on("console", (msg) => { if (msg.type() === "warning" && msg.text().includes("[rooms]")) console.log(`[${person.name}]`, msg.text()); });
    await page.route("**/api/**", (route) => route.continue({ headers: { ...route.request().headers(), "x-rc-user": person.uid } }));
    await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
    await page.evaluate(([token, acct, locale, target]) => {
      localStorage.setItem("appTargetLanguage", target);
      localStorage.setItem("appUiLocale", locale);
      localStorage.setItem("chatOwnLanguageTipSeen", "1");
      localStorage.setItem("whatsNewSeenVersion", "999");
      localStorage.setItem("ec_auth_token", token);
      localStorage.setItem("ec_account", JSON.stringify(acct));
    }, [person.token, person.account, person.locale, person.target]);
    await page.goto(BASE + "/?screen=talk", { waitUntil: "domcontentloaded" });
    pages.push(page);
  }
  const [pa, pb] = pages;
  const ta = roomCopy(a.locale);
  const tb = roomCopy(b.locale);

  // 걸기: 대화 목록 → 상대 → 📞.
  await pa.getByText(`video-${b.name}`).first().click({ timeout: 30_000 });
  // 대화가 열린 상태(답이 온 대화)로 불러와진 뒤에 📞 — 먼저 누르면 "대화가 열린 뒤에" 안내만.
  await pa.getByText("[test] hello").first().waitFor({ timeout: 30_000 });
  await pa.waitForTimeout(1500);
  await pa.getByRole("button", { name: ta.call, exact: true }).click({ timeout: 15_000 });
  await pa.getByRole("button", { name: new RegExp(ta.cameraOn) }).waitFor({ timeout: 30_000 });
  // 받기: 대화 목록 → 상대 → 받기.
  await pb.getByText(`video-${a.name}`).first().click({ timeout: 30_000 });
  await pb.getByRole("button", { name: tb.callJoin, exact: true }).click({ timeout: 30_000 });
  await pb.getByRole("button", { name: new RegExp(tb.cameraOn) }).waitFor({ timeout: 30_000 });
  await pa.waitForTimeout(6000);
  result.beforeCamera = await Promise.all(pages.map((p) => p.evaluate(() => window.__videoStats())));

  await pa.getByRole("button", { name: new RegExp(ta.cameraOn) }).click();
  await pb.getByRole("button", { name: new RegExp(tb.cameraOn) }).click();
  await pa.waitForTimeout(8000);
  result.cameraOn = await Promise.all(pages.map((p) => p.evaluate(() => window.__videoStats())));
  await pa.screenshot({ path: path.join(OUT, "caller.png") });
  await pb.screenshot({ path: path.join(OUT, "callee.png") });

  // 받는 쪽이 끄면 거는 쪽은 사진 + "카메라 꺼짐".
  await pb.getByRole("button", { name: new RegExp(tb.cameraOff) }).click();
  await pa.waitForTimeout(4000);
  result.calleeOff = {
    callerSeesOffLabel: await pa.getByText(ta.cameraOffLabel).first().isVisible().catch(() => false),
    stats: await pa.evaluate(() => window.__videoStats()),
  };
  await pa.screenshot({ path: path.join(OUT, "caller-off.png") });
} catch (error) {
  result.error = String(error?.message ?? error).split("\n")[0];
  console.log("멈춤:", result.error);
  for (const [i, page] of (browser?.contexts() ?? []).flatMap((c) => c.pages()).entries()) {
    await page.screenshot({ path: path.join(OUT, `error-${i}.png`) }).catch(() => undefined);
  }
} finally {
  await browser?.close().catch(() => undefined);
  server.close();
  for (const p of people) await api(p.uid, "/api/account/delete", {}, p.token).catch(() => undefined);
  await forgetAtEnd(API, RUN);
  fs.writeFileSync(path.join(OUT, "video.json"), JSON.stringify(result, null, 1));
  console.log(JSON.stringify(result, null, 1));
  console.log("결과:", OUT);
}
