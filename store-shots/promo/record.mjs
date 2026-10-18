// 홍보 영상용 실사용 녹화: 실제 앱(www, /api는 운영)을 휴대폰 크기로 띄워 한 장면을 진짜로 해 보며 녹화한다.
// 결과: tmp/promo/<locale>/raw.mp4 + events.json(장면마다 영상 안의 시각, 카드 표현 글자).
// 녹화는 Chrome 화면 전송(CDP screencast)으로 2배 해상도 프레임을 받아 이어 붙인다 —
// Playwright 녹화는 기기 배율을 무시해 흐리다.
// 그다음 node store-shots/promo/make.mjs <locale> 가 자막·프레임·확대·목소리를 입혀 세로 쇼츠로 만든다.
//
// 장면(1편): 편한 말로 쓴 줄 → 튜터가 학습 언어로 → "표현 보기" 카드 → "이 표현으로 말해보기".
// 필요: npm run build:capacitor, Playwright. 운영 채팅 1번을 쓴다(테스트 사용자 promo-<날짜>-<locale>).
//
// Run: node --experimental-strip-types store-shots/promo/record.mjs ko
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const locale = process.argv[2] || "ko";
const ROOT = process.cwd();
const WWW = path.join(ROOT, "www");
const API = process.env.API_BASE || "https://english-chat-mvp.vercel.app";
const OUT = path.join(ROOT, "tmp", "promo", locale);
const target = locale === "en" ? "es" : "en";

/** 막혔을 때 실제로 쓸 법한 한 줄(캡처 스크립트와 같은 문장). */
const STUCK_LINE = {
  ko: "주말에 친구랑 약속 있었는데 바람맞았어",
  en: "I had plans with a friend this weekend but they stood me up",
  ja: "週末に友達と約束してたのに、すっぽかされちゃった",
  zh: "周末跟朋友约好了，结果被放鸽子了",
  es: "Tenía planes con un amigo el fin de semana, pero me dejó plantado",
  hi: "वीकेंड पर दोस्त के साथ प्लान था, पर वो आया ही नहीं",
};

async function loadCopy() {
  const dir = path.join(ROOT, "tmp", "copycheck");
  fs.mkdirSync(dir, { recursive: true });
  const source = fs
    .readFileSync(path.join(ROOT, "src/lib/copy.ts"), "utf8")
    .replace('"@/lib/locales/generated.json"', '"../../src/lib/locales/generated.json" with { type: "json" }')
    .replace('"@/lib/locales/overlays.json"', '"../../src/lib/locales/overlays.json" with { type: "json" }')
    .replace('"@/lib/learningLanguages"', '"../../src/lib/learningLanguages.ts"');
  const file = path.join(dir, `promo-${process.pid}.ts`);
  fs.writeFileSync(file, source);
  try {
    return (await import(`file://${file}`)).copy;
  } finally {
    fs.rmSync(file, { force: true });
  }
}
const ui = (await loadCopy())[locale];

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
await new Promise((r) => server.listen(4290, "127.0.0.1", r));
const BASE = "http://127.0.0.1:4290";

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const t0 = Date.now();
const context = await browser.newContext({
  viewport: { width: 412, height: 915 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const events = {};
const mark = (name) => (events[name] = Date.now() / 1000);
const day = new Date().toISOString().slice(0, 10).replace(/-/g, "");
await context.route("**/api/**", (route) => route.continue({ headers: { ...route.request().headers(), "x-rc-user": `promo-${day}-${locale}` } }));
await context.addInitScript(([t, l]) => {
  localStorage.setItem("appTargetLanguage", t);
  localStorage.setItem("appUiLocale", l);
  localStorage.setItem("chatOwnLanguageTipSeen", "1");
  localStorage.setItem("whatsNewSeenVersion", "999");
  // 누른 곳에 손가락 원: 보는 사람이 어디를 눌렀는지 알게.
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
await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 824, maxHeight: 1830, everyNthFrame: 1 });
const exactly = (t) => new RegExp(`^${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);
// 손가락 원이 보이게 마우스로 누른다(요소 가운데).
async function tap(locator) {
  const box = await locator.boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}
try {
  await page.goto(`${BASE}/?screen=chat`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(4500);
  const box = page.locator("textarea:visible").first();
  await tap(box);
  mark("typeStart");
  await page.keyboard.type(STUCK_LINE[locale], { delay: 90 });
  mark("typeEnd");
  await page.waitForTimeout(500);
  await tap(page.getByRole("button", { name: exactly(ui.send) }));
  mark("sent");
  const show = page.getByRole("button", { name: exactly(ui.chatShowExpression) });
  await show.last().waitFor();
  mark("reply");
  await page.waitForTimeout(1800);
  await tap(show.last());
  mark("cardTap");
  const use = page.getByRole("button", { name: exactly(ui.chatUseExpression) });
  await use.last().waitFor();
  mark("card");
  // 카드의 표현 글자(목소리로 읽어 줄 것): "이 표현으로 말해보기" 버튼이 든 카드의 첫 줄.
  events.expression = await use.last().evaluate((btn) => {
    let el = btn;
    for (let i = 0; i < 5 && el.parentElement; i++) el = el.parentElement;
    const lines = el.innerText.split("\n").map((s) => s.trim()).filter(Boolean);
    return lines.find((l) => /[A-Za-z]{3,}/.test(l) && l.split(" ").length >= 3) ?? "";
  });
  await page.waitForTimeout(2600);
  await tap(use.last());
  mark("use");
  await page.waitForTimeout(2400);
  mark("end");
} finally {
  await cdp.send("Page.stopScreencast").catch(() => {});
  await context.close();
  await browser.close();
  server.close();
}
// 프레임은 화면이 바뀔 때만 온다: 각 프레임을 다음 프레임까지 보여 주는 목록으로 25fps 영상을 만든다.
const start = frames[0].at;
const list = frames
  .map((f, i) => {
    const next = i + 1 < frames.length ? frames[i + 1].at : events.end;
    return `file '${f.file}'\nduration ${Math.max(0.01, next - f.at).toFixed(3)}`;
  })
  .join("\n");
fs.writeFileSync(path.join(OUT, "frames.txt"), `${list}\nfile '${frames.at(-1).file}'\n`);
const { execFileSync } = await import("node:child_process");
execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", path.join(OUT, "frames.txt"),
  "-vf", "fps=25,scale=824:1830:flags=lanczos,format=yuv420p", "-c:v", "libx264", "-crf", "16", path.join(OUT, "raw.mp4")]);
for (const key of Object.keys(events)) if (typeof events[key] === "number") events[key] = +(events[key] - start).toFixed(3);
fs.rmSync(framesDir, { recursive: true, force: true });
fs.writeFileSync(path.join(OUT, "events.json"), JSON.stringify(events, null, 2));
console.log(JSON.stringify(events, null, 2));
