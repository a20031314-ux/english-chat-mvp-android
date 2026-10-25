// 홍보 쇼츠 "오류교정" 편 녹화: 실제 앱(www, /api는 운영)에서 학습 언어로 틀린 문장을 써 보내고,
// 내 줄 아래 "✎ 고칠 곳" 칩 → 눌러서 고친 문장이 바로 아래 열리는 것까지.
// 결과: tmp/promo/fix/<locale>/raw.mp4 + events.json(장면 시각, 보낸 문장·고친 문장).
// 그다음 node store-shots/promo/make.mjs fix <locale>.
//
// 학습 조합은 combos.mjs(LEARN). 녹화는 record.mjs와 같은 방식(Chrome 화면 전송, 2배 해상도).
// 운영 채팅 1번(테스트 사용자 promo-fix-<날짜>-<locale>).
// 고친 문장이 맞는지는 사람이 events.json의 sent·corrected를 읽고 확인한다 — 틀린 교정은 홍보에 쓰지 않는다.
//
// Run: node --experimental-strip-types store-shots/promo/record-fix.mjs ar
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { chromium } from "playwright";
import { LEARN } from "./combos.mjs";

const locale = process.argv[2] || "ko";
const target = LEARN[locale];
if (!target) throw new Error(`no learning language for ${locale} (combos.mjs LEARN)`);
const ROOT = process.cwd();
const WWW = path.join(ROOT, "www");
const API = process.env.API_BASE || "https://english-chat-mvp.vercel.app";
const OUT = path.join(ROOT, "tmp", "promo", "fix", locale);

/** 학습 언어마다 배우는 사람이 실제로 쓸 법한, 고칠 곳이 분명한 한 줄(시제·조사). */
const MISTAKE = {
  en: "Yesterday I go to the beach with my friends and we swim a lot.",
  ko: "어제 저는 친구가 만나서 같이 영화를 봐요.",
  ja: "昨日、友達と映画を見ます。とても面白いです。",
  es: "Ayer yo voy a la playa con mis amigos.",
};
const line = process.env.PROMO_LINE || MISTAKE[target];
if (!line) throw new Error(`no mistake line for learning language ${target}`);

async function loadCopy() {
  const dir = path.join(ROOT, "tmp", "copycheck");
  fs.mkdirSync(dir, { recursive: true });
  const source = fs
    .readFileSync(path.join(ROOT, "src/lib/copy.ts"), "utf8")
    .replace('"@/lib/locales/generated.json"', '"../../src/lib/locales/generated.json" with { type: "json" }')
    .replace('"@/lib/locales/overlays.json"', '"../../src/lib/locales/overlays.json" with { type: "json" }')
    .replace('"@/lib/learningLanguages"', '"../../src/lib/learningLanguages.ts"');
  const file = path.join(dir, `promo-fix-${process.pid}.ts`);
  fs.writeFileSync(file, source);
  try {
    return (await import(`file://${file}`)).copy;
  } finally {
    fs.rmSync(file, { force: true });
  }
}
const ui = (await loadCopy())[locale];
if (!ui) throw new Error(`no interface strings for ${locale}`);

const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".webp": "image/webp", ".mp3": "audio/mpeg", ".txt": "text/plain" };
const server = http.createServer(async (req, res) => {
  if (req.url.startsWith("/api/")) {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const headers = { ...req.headers };
    for (const h of ["host", "origin", "referer", "content-length"]) delete headers[h];
    try {
      const up = await fetch(API + req.url, { method: req.method, headers, body: ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.concat(chunks) });
      res.writeHead(up.status, { "content-type": up.headers.get("content-type") || "application/octet-stream" });
      res.end(Buffer.from(await up.arrayBuffer()));
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
  if (!fs.existsSync(file)) return res.writeHead(404).end();
  res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(4291, "127.0.0.1", r));
const BASE = "http://127.0.0.1:4291";

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const events = { locale, target, sent: line };
const mark = (name) => (events[name] = Date.now() / 1000);
const day = new Date().toISOString().slice(0, 10).replace(/-/g, "");
await context.route("**/api/**", (route) => route.continue({ headers: { ...route.request().headers(), "x-rc-user": `promo-fix-${day}-${locale}-${process.pid}` } }));
await context.addInitScript(([t, l]) => {
  localStorage.setItem("appTargetLanguage", t);
  localStorage.setItem("appUiLocale", l);
  localStorage.setItem("chatOwnLanguageTipSeen", "1");
  localStorage.setItem("whatsNewSeenVersion", "999");
  localStorage.setItem("chatCorrectionViewMode", "tap");
    // 화면 전송은 바뀐 프레임만 보낸다 — 가끔 멈춰 마지막 장면(열린 교정)이 안 찍혔다(ko). 보이지 않는 점을 매 프레임 바꿔 계속 받는다.
    addEventListener("DOMContentLoaded", () => {
      const dot = document.createElement("div");
      dot.style.cssText = "position:fixed;left:0;top:0;width:1px;height:1px;z-index:99998;pointer-events:none;background:#000";
      document.body.appendChild(dot);
      let on = false;
      const tick = () => {
        on = !on;
        dot.style.opacity = on ? "0.011" : "0.012";
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  addEventListener("pointerdown", (e) => {
    const dot = document.createElement("div");
    dot.style.cssText = `position:fixed;left:${e.clientX - 22}px;top:${e.clientY - 22}px;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.35);border:2px solid rgba(255,255,255,.8);z-index:99999;pointer-events:none;transition:transform .45s ease-out,opacity .45s ease-out`;
    document.body.appendChild(dot);
    requestAnimationFrame(() => {
      dot.style.transform = "scale(1.8)";
      dot.style.opacity = "0";
    });
    setTimeout(() => dot.remove(), 600);
  }, true);
}, [target, locale]);

const page = await context.newPage();
page.setDefaultTimeout(60000);
const frames = [];
const framesDir = path.join(OUT, "frames");
fs.mkdirSync(framesDir, { recursive: true });
const cdp = await context.newCDPSession(page);
cdp.on("Page.screencastFrame", async ({ data, metadata, sessionId }) => {
  const file = path.join(framesDir, `${String(frames.length).padStart(5, "0")}.jpg`);
  fs.writeFileSync(file, Buffer.from(data, "base64"));
  frames.push({ file, at: metadata.timestamp });
  await cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
});
const exactly = (t) => new RegExp(`^${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);
async function tap(locator) {
  const box = await locator.boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}
try {
  await page.goto(`${BASE}/?screen=chat`, { waitUntil: "domcontentloaded" });
  await page.locator("textarea:visible").first().waitFor();
  await page.waitForTimeout(2500);
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 824, maxHeight: 1830, everyNthFrame: 1 });
  await page.waitForTimeout(1500);
  const box = page.locator("textarea:visible").first();
  await tap(box);
  mark("typeStart");
  await page.keyboard.type(line, { delay: 70 });
  mark("typeEnd");
  await page.waitForTimeout(400);
  await tap(page.getByRole("button", { name: exactly(ui.send) }));
  mark("sentAt");
  const chip = page.getByRole("button", { name: exactly(ui.chatCorrectionChip) });
  await chip.last().waitFor({ timeout: 90000 });
  mark("chip");
  // 튜터 답이 다 올라오게 잠깐.
  await page.waitForTimeout(2200);
  // 칩이 든 말풍선(내 줄)을 표시해 두고, 열린 뒤 그 안의 글을 읽는다.
  await chip.last().evaluate((btn) => {
    let el = btn.parentElement;
    while (el && el.innerText.trim().split("\n").length < 2 && el.parentElement) el = el.parentElement;
    el?.setAttribute("data-promo-bubble", "1");
  });
  await tap(chip.last());
  mark("chipTap");
  // 위험한 줄은 확인 모델이 한 번 더 본다(칩이 "확인 중"이 됨) — 칩이 사라지면 열린 것.
  // "확인 중"인 칩도 아직 안 열린 것.
  await page.waitForFunction(
    ([label, busy]) => ![...document.querySelectorAll("button")].some((b) => b.innerText.includes(label) || b.innerText.includes(busy)),
    [ui.chatCorrectionChip, ui.chatCorrectionChecking],
    { timeout: 90000 },
  );
  mark("open");
  await page.waitForTimeout(300);
  events.bubbleText = await page.locator("[data-promo-bubble]").last().innerText().catch(() => "");
  const box2 = await page.locator("[data-promo-bubble]").last().boundingBox().catch(() => null);
  if (box2) events.bubbleBox = { x: box2.x / 412, y: box2.y / 915, w: box2.width / 412, h: box2.height / 915 };
  await page.waitForTimeout(3600);
  mark("fixedEnd");
  // My로 이어짐(사용자 2026-10-26 "my탭과 연결되는 장면"): 고친 줄이 My "오늘의 학습"에 후보로 → 골라 노트에 넣기.
  if (process.env.PROMO_MY !== "0") {
    const startsWith = (t) => new RegExp(`^\\s*${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
    const myTab = page.getByRole("button", { name: exactly(ui.homeTabProfile) }).or(page.getByRole("link", { name: exactly(ui.homeTabProfile) })).or(page.locator(`[aria-label="${ui.homeTabProfile}"]`));
    const today = page.getByRole("button", { name: startsWith(ui.notebookToday) });
    // 후보는 서버가 교정 뒤 따로 만든다 — 생길 때까지 My를 다시 연다(최대 약 40초, 화면 밖에서).
    let found = false;
    for (let i = 0; i < 8 && !found; i++) {
      await tap(myTab.first());
      if (i === 0) mark("myTap");
      found = await today.first().waitFor({ timeout: 5000 }).then(() => true, () => false);
      if (!found) {
        await page.goto(`${BASE}/?screen=chat`, { waitUntil: "domcontentloaded" });
        await page.locator("textarea:visible").first().waitFor();
      }
    }
    if (found) {
      await today.first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      mark("myShown");
      events.myBox = await today.first().boundingBox().then((b) => (b ? { x: b.x / 412, y: b.y / 915, w: b.width / 412, h: b.height / 915 } : null));
      await page.waitForTimeout(1800);
      await tap(today.first());
      mark("todayTap");
      const add = page.getByRole("button", { name: startsWith(ui.notebookAddToNotes) });
      await add.first().waitFor({ timeout: 20000 });
      await page.waitForTimeout(500);
      mark("todaySheet");
      events.todayText = (await page.locator('[role="dialog"]').last().innerText().catch(() => "")).slice(0, 500);
      await page.waitForTimeout(2600);
      await tap(add.first());
      mark("added");
      await page.waitForTimeout(3200);
    } else {
      events.myMissing = true;
    }
  }
  mark("end");
  await page.screenshot({ path: path.join(OUT, "final.png") });
} finally {
  await cdp.send("Page.stopScreencast").catch(() => {});
  await context.close();
  await browser.close();
  server.close();
}
const start = frames[0].at;
const list = frames
  .map((f, i) => {
    const next = i + 1 < frames.length ? frames[i + 1].at : events.end;
    return `file '${f.file}'\nduration ${Math.max(0.01, next - f.at).toFixed(3)}`;
  })
  .join("\n");
fs.writeFileSync(path.join(OUT, "frames.txt"), `${list}\nfile '${frames.at(-1).file}'\n`);
execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", path.join(OUT, "frames.txt"),
  "-vf", "fps=25,scale=824:1830:flags=lanczos,format=yuv420p", "-c:v", "libx264", "-crf", "16", path.join(OUT, "raw.mp4")]);
for (const key of Object.keys(events)) if (typeof events[key] === "number") events[key] = +(events[key] - start).toFixed(3);
fs.rmSync(framesDir, { recursive: true, force: true });
fs.writeFileSync(path.join(OUT, "events.json"), JSON.stringify(events, null, 2));
console.log(JSON.stringify(events, null, 2));
