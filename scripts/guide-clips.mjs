// 사용법(?) 칸의 설명 영상 — 실제 앱을 조작하는 장면 + 영상 안 자막 한 줄씩(사용자 2026-10-29 "기능 사용 + 그 안에 설명까지").
// 소리 없음·반복. 결과는 public/guide/<앱 언어>/<영상>.mp4, 칸 ↔ 영상은 src/lib/guide/content.ts GUIDE_CLIPS.
// 자막의 버튼 이름은 그 언어의 실제 문구(copy.ts)를 그대로 끼운다({planTitle} 같은 자리).
//
// 순서(저장소 맨 위에서):
//   1. npm run build:capacitor            (www — 지금 화면)
//   2. PLAYWRIGHT_BROWSERS_PATH=… node scripts/guide-clips.mjs my-today [ko,en,ja…]
//      /api는 운영으로(시험 사용자 simcheck-clip-…, 끝나면 지움), 🎤는 가짜 마이크 + 받아쓰기를 그 줄로 바꿔 끼움.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { chromium, serve, state, api, loadCopy, ROOT, API } from "./ux-check/lib.mjs";

const LOCALES = ["ko", "en", "es", "ja", "zh", "th", "vi", "id", "hi", "ar", "fr", "it", "pt", "ru"];
const [clipName = "my-today", only] = process.argv.slice(2);
const locales = only ? only.split(",") : LOCALES;
const learnFor = (locale) => (locale === "en" ? "es" : "en");

/** 영상마다 장면 자막(14개 언어). 「」 안은 그 언어 앱의 실제 버튼·칸 이름. */
const CAPTIONS = {
  "my-today": {
    ko: ["「{planTitle}」에서 하나를 눌러요", "내 차례에 「{scriptSay}」", "맞게 말하면 ★, 위 줄이 차요", "끝까지 말하면 「{scriptCompleted}」", "「{planTitle}」에 ✓"],
    en: ["Tap one in “{planTitle}”", "Your turn: “{scriptSay}”", "Say it right for ★ — the bar fills", "Finish for “{scriptCompleted}”", "“{planTitle}” gets a ✓"],
    es: ["Toca uno en «{planTitle}»", "Tu turno: «{scriptSay}»", "Dilo bien: ★ y la barra avanza", "Al terminar: «{scriptCompleted}»", "«{planTitle}» queda con ✓"],
    ja: ["「{planTitle}」から1つタップ", "自分の番は「{scriptSay}」", "正しく言えたら★、上のバーが進む", "最後まで言うと「{scriptCompleted}」", "「{planTitle}」に✓"],
    zh: ["在「{planTitle}」里点一个", "轮到你：「{scriptSay}」", "说对得★，上方进度增加", "说完显示「{scriptCompleted}」", "「{planTitle}」打上✓"],
    th: ["แตะหนึ่งรายการใน “{planTitle}”", "ถึงตาคุณ: “{scriptSay}”", "พูดถูกได้ ★ แถบด้านบนเพิ่มขึ้น", "พูดจนจบได้ “{scriptCompleted}”", "“{planTitle}” ขึ้น ✓"],
    vi: ["Chạm một mục trong “{planTitle}”", "Đến lượt bạn: “{scriptSay}”", "Nói đúng được ★, thanh phía trên tăng", "Nói hết sẽ “{scriptCompleted}”", "“{planTitle}” có dấu ✓"],
    id: ["Ketuk satu di “{planTitle}”", "Giliranmu: “{scriptSay}”", "Ucapkan dengan benar: ★, bilah di atas bertambah", "Selesaikan untuk “{scriptCompleted}”", "“{planTitle}” dapat ✓"],
    hi: ["“{planTitle}” में से एक पर टैप करें", "आपकी बारी: “{scriptSay}”", "सही बोलें तो ★, ऊपर की पट्टी बढ़ती है", "पूरा बोलने पर “{scriptCompleted}”", "“{planTitle}” पर ✓"],
    ar: ["اضغط على واحد في «{planTitle}»", "دورك: «{scriptSay}»", "قلها صحيحة: ★ ويتقدّم الشريط", "أكمل حتى النهاية: «{scriptCompleted}»", "تظهر ✓ في «{planTitle}»"],
    fr: ["Touchez-en un dans « {planTitle} »", "À vous : « {scriptSay} »", "Bien dit : ★ et la barre avance", "Allez au bout : « {scriptCompleted} »", "« {planTitle} » coché ✓"],
    it: ["Tocca uno in «{planTitle}»", "Tocca a te: «{scriptSay}»", "Detto bene: ★ e la barra avanza", "Arriva in fondo: «{scriptCompleted}»", "«{planTitle}» con ✓"],
    pt: ["Toque em um em “{planTitle}”", "Sua vez: “{scriptSay}”", "Falou certo: ★ e a barra avança", "Até o fim: “{scriptCompleted}”", "“{planTitle}” ganha ✓"],
    ru: ["Нажмите на один пункт в «{planTitle}»", "Ваша очередь: «{scriptSay}»", "Сказали верно — ★, полоса растёт", "До конца — «{scriptCompleted}»", "В «{planTitle}» появляется ✓"],
  },
};

const copyAll = await loadCopy();
const PORT = 4530;
const server = await serve(PORT);
const browser = await chromium.launch({
  args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", `--use-file-for-fake-audio-capture=${path.join(ROOT, "tmp/ux/voice.wav")}`],
});

for (const locale of locales) {
  const ui = copyAll[locale];
  const lines = CAPTIONS[clipName]?.[locale];
  if (!ui || !lines) throw new Error(`no captions for ${clipName}/${locale}`);
  const caption = (i) => lines[i].replace(/\{(\w+)\}/g, (_, key) => String(ui[key] ?? key).trim());
  const learn = learnFor(locale);
  state.uid = `simcheck-clip-${Date.now().toString(36)}-${locale}`;
  await api("/api/learner/self-check", { language: learn, stage: `${learn}-1` });

  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: "dark" });
  await ctx.addInitScript(([learn, locale]) => {
    localStorage.setItem("appTargetLanguage", learn);
    localStorage.setItem("appUiLocale", locale);
    localStorage.setItem("whatsNewSeenVersion", "9.99");
    localStorage.setItem("appFeatures", JSON.stringify({ off: [], chosen: true }));
    localStorage.setItem("myViewMode.stageShown", "1");
    // 누른 자리에 동그라미(영상에서 어디를 눌렀는지 보이게).
    window.addEventListener("mousedown", (e) => {
      const dot = document.createElement("div");
      dot.style.cssText = `position:fixed;left:${e.clientX - 18}px;top:${e.clientY - 18}px;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.35);border:3px solid rgba(255,255,255,.85);z-index:2147483647;pointer-events:none;transition:opacity .6s ease-out,transform .6s ease-out`;
      document.body.appendChild(dot);
      requestAnimationFrame(() => { dot.style.opacity = "0"; dot.style.transform = "scale(1.6)"; });
      setTimeout(() => dot.remove(), 700);
    }, true);
  }, [learn, locale]);
  const page = await ctx.newPage();
  let sayNext = "";
  await page.route("**/api/roleplay/listen", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ text: sayNext }) }));

  const showCaption = (text) => page.evaluate(([text, rtl]) => {
    let box = document.getElementById("__guide_cap");
    if (!box) {
      box = document.createElement("div");
      box.id = "__guide_cap";
      box.style.cssText = "position:fixed;left:14px;right:14px;top:84px;z-index:2147483646;pointer-events:none;display:flex;justify-content:center;transition:opacity .25s";
      const pill = document.createElement("div");
      pill.style.cssText = "max-width:100%;padding:10px 16px;border-radius:16px;background:rgba(255,214,10,.96);color:#111;font:700 17px/1.3 -apple-system,'Noto Sans','Noto Sans CJK KR','Noto Sans Thai','Noto Sans Devanagari','Noto Sans Arabic',sans-serif;text-align:center;box-shadow:0 6px 20px rgba(0,0,0,.45)";
      box.appendChild(pill);
      document.body.appendChild(box);
    }
    box.firstChild.dir = rtl ? "rtl" : "ltr";
    box.style.opacity = "0";
    setTimeout(() => { box.firstChild.textContent = text; box.style.opacity = "1"; }, 120);
  }, [text, locale === "ar"]);

  // 녹화: 화면 프레임 + 빨리 감을 구간(채점 기다림).
  const frames = [];
  const fast = [];
  const cdp = await ctx.newCDPSession(page);
  const work = path.join(ROOT, "tmp", "guide-clips", clipName, locale);
  fs.rmSync(work, { recursive: true, force: true });
  fs.mkdirSync(work, { recursive: true });
  cdp.on("Page.screencastFrame", async ({ data, metadata, sessionId }) => {
    const file = path.join(work, `${String(frames.length).padStart(5, "0")}.jpg`);
    fs.writeFileSync(file, Buffer.from(data, "base64"));
    frames.push({ file, at: metadata.timestamp });
    await cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
  });
  const now = () => page.evaluate(() => Date.now() / 1000);
  const wait = (ms) => page.waitForTimeout(ms);

  await page.goto(`http://localhost:${PORT}/?screen=map`, { waitUntil: "domcontentloaded" });
  await wait(8000);
  const firstItem = page.locator("section ul li button").first();
  await firstItem.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, -140));
  await wait(600);
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 85, maxWidth: 780, maxHeight: 1688, everyNthFrame: 1 });
  await wait(300);
  const start = await now();

  await showCaption(caption(0));
  await wait(3000);
  await firstItem.click();
  await wait(1800);

  const pack = await (await fetch(`${API}/api/curriculum/scripts?pack=1&lang=${learn}`, { headers: { "x-rc-user": state.uid } })).json();
  const script = (pack.scripts ?? []).filter((s) => s.stage === 1).sort((a, b) => (a.situation ?? 99) - (b.situation ?? 99))[0];
  const mine = script.lines.filter((l) => l.who === "me");
  let said = 0;
  await showCaption(caption(1));
  for (let turn = 0; turn < 14; turn += 1) {
    const say = page.locator("div.fixed button", { hasText: new RegExp(ui.scriptSay.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) }).last();
    const next = page.locator("div.fixed button", { hasText: new RegExp(`^${ui.scriptNext}$`) }).last();
    const finished = () => page.locator("div.fixed").last().innerText().then((t) => t.includes(ui.scriptCompleted)).catch(() => false);
    for (let w = 0; w < 30 && !(await say.count()) && !(await next.count()) && !(await finished()); w += 1) await wait(300);
    if (await finished()) break;
    if (await next.count()) { await next.click(); await wait(900); continue; }
    if (!(await say.count())) break;
    const k = (await page.locator("div.fixed ol li.justify-end").count()) - 1;
    sayNext = mine[Math.max(0, k)]?.text ?? "";
    await wait(350);
    await say.click();
    const from = await now();
    // 결과가 뜰 때까지(🎤 버튼이 다시 생기거나 다음 버튼) — 이 구간은 영상에서 빨리.
    await wait(1500);
    for (let w = 0; w < 40; w += 1) {
      const busy = await page.locator("div.fixed").last().evaluate((el) => /…|\.\.\./.test(el.innerText.slice(-200))).catch(() => false);
      if (!busy && ((await say.count()) || (await next.count()))) break;
      await wait(400);
    }
    fast.push([from + 0.4, (await now()) - 0.2]);
    said += 1;
    await wait(said === 1 ? 600 : 700);
    if (said === 1) { await showCaption(caption(2)); await wait(3400); }
  }
  await wait(800);
  await page.locator("div.fixed ol").last().evaluate((el) => el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })).catch(() => {});
  await showCaption(caption(3));
  await wait(4000);
  await page.locator("div.fixed button", { hasText: new RegExp(`^${ui.billingClose}$`) }).last().click().catch(() => page.keyboard.press("Escape"));
  await wait(1200);
  await showCaption(caption(4));
  await wait(4000);
  const end = await now();
  await cdp.send("Page.stopScreencast").catch(() => {});

  // 빨리 감기: 채점 기다림은 6배, 나머지는 1.4배(자막을 띄워 둔 시간은 그만큼 길게 잡음).
  const SPEED = 6, BASE = 1.4;
  const shown = (t) => {
    let out = t - start;
    for (const [a, b] of fast) {
      if (t <= a) continue;
      out -= (Math.min(t, b) - a) * (1 - BASE / SPEED);
    }
    return out / BASE;
  };
  const kept = frames.filter((f) => f.at >= start && f.at <= end);
  const list = kept.map((f, i) => `file '${f.file}'\nduration ${Math.max(0.02, shown(i + 1 < kept.length ? kept[i + 1].at : end) - shown(f.at)).toFixed(3)}`).join("\n");
  fs.writeFileSync(path.join(work, "frames.txt"), `${list}\nfile '${kept.at(-1).file}'\n`);
  const outDir = path.join(ROOT, "public", "guide", locale);
  fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, `${clipName}.mp4`);
  // 위 상단바(9%)와 아래 탭(7%)은 자른다 — 사용법 그림과 같은 틀.
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", path.join(work, "frames.txt"),
    "-vf", "fps=15,crop=iw:ih*0.838:0:ih*0.092,scale=600:-2:flags=lanczos,format=yuv420p",
    "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "30", "-movflags", "+faststart", out]);
  // 영상을 못 받을 때의 그림(첫 장면).
  console.log(`${locale} ${clipName}: ${kept.length}프레임 → ${(shown(end)).toFixed(1)}초, ${(fs.statSync(out).size / 1024).toFixed(0)}KB, 말한 줄 ${said}`);
  fs.rmSync(work, { recursive: true, force: true });
  await api("/api/simcheck/forget", {});
  await ctx.close();
}
await browser.close();
server.close();
