// 체감 점검(2026-10-29 사용자 "할 일이 명확한가·계속할 이유·실력 향상 체감을 가상 사용자로"): 가상 사용자(앱을 모르는 에이전트)가 직접 모는 앱.
// 먼저: npm run build:capacitor, 가짜 마이크 소리
//   ffmpeg -f lavfi -i "anoisesrc=d=1.4:c=pink:a=0.3" -f lavfi -t 7 -i anullsrc=r=48000:cl=mono -filter_complex "[0]aresample=48000,aformat=channel_layouts=mono[a];[a][1]concat=n=2:v=0:a=1" -ar 48000 -ac 1 tmp/ux/voice.wav
// 그다음 사람마다 하나씩 띄우고(run_in_background), 에이전트에게 scripts/ux-check/BRIEF.md + 인물·PORT·NAME을 준다. 결과: tmp/ux/run/<이름>/, tmp/ux/notes/<이름>.md
// 한계: /day는 폰 시계만 넘긴다(서버는 오늘) — 그래프 날짜·이번 주 확인 7일 규칙은 이 점검에서 믿지 않는다.
// 가상 사용자가 직접 모는 앱: node scripts/ux-check/driver.mjs <학습언어> <앱언어> <이름> <제어포트>
// 제어(curl): GET /shot · POST /click {text} 또는 {x,y} · POST /type {text} · POST /scroll {dy} · POST /say {text} · POST /key {key} · POST /reload · POST /day {n} · POST /stop
import http from "node:http"; import path from "node:path"; import fs from "node:fs";
import { chromium, serve, state, api, ROOT } from "./lib.mjs";
const [learn, ui, name, controlPort] = process.argv.slice(2);
const OUT = path.join(ROOT, "tmp/ux/run", name); fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const appPort = Number(controlPort) + 100;
const server = await serve(appPort);
state.uid = `simcheck-ux-${Date.now().toString(36)}-${name}`;
const browser = await chromium.launch({ args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", `--use-file-for-fake-audio-capture=${path.join(ROOT, "tmp/ux/voice.wav")}`] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, colorScheme: "dark", hasTouch: true });
await ctx.addInitScript(([learn, ui]) => { if (!localStorage.getItem("appUiLocale")) { localStorage.setItem("appUiLocale", ui); localStorage.setItem("appTargetLanguage", learn); } }, [learn, ui]);
const page = await ctx.newPage();
let pendingSay = "";
let dayOffset = 0;
// 받아쓰기는 가상 사용자가 "말한" 글로 바꾼다(판정은 운영 그대로).
await page.route("**/api/roleplay/listen", (route) => {
  const text = pendingSay; pendingSay = "";
  return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ text }) });
});
await page.goto(`http://localhost:${appPort}/`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(5000);
const log = [];
let n = 0;
async function shot() {
  n += 1;
  const file = path.join(OUT, `${String(n).padStart(3, "0")}.png`);
  await page.screenshot({ path: file });
  const buttons = await page.evaluate(() => [...document.querySelectorAll("button, a, [role=button], input, textarea")]
    .filter((e) => { const r = e.getBoundingClientRect(); if (!(r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight)) return false; const cx = Math.min(innerWidth - 1, Math.max(0, r.x + r.width / 2)), cy = Math.min(innerHeight - 1, Math.max(0, r.y + r.height / 2)); const top = document.elementFromPoint(cx, cy); return Boolean(top && (top === e || e.contains(top))); })
    .map((e) => { const r = e.getBoundingClientRect(); return { text: (e.innerText || e.getAttribute("aria-label") || e.getAttribute("placeholder") || e.value || "").trim().replace(/\s+/g, " ").slice(0, 60), x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2), disabled: e.disabled || undefined }; })
    .filter((b) => b.text).slice(0, 60));
  return { file, buttons };
}
const send = (res, code, body) => { res.writeHead(code, { "content-type": "application/json" }); res.end(JSON.stringify(body)); };
const control = http.createServer(async (req, res) => {
  const chunks = []; for await (const c of req) chunks.push(c);
  let body = {}; try { body = JSON.parse(Buffer.concat(chunks).toString() || "{}"); } catch {}
  const route = req.url.split("?")[0];
  try {
    if (route === "/shot") return send(res, 200, await shot());
    if (route === "/click") {
      if (typeof body.x === "number") await page.mouse.click(body.x, body.y);
      else {
        // 화면 맨 위에 보이는 것 중 글이 맞는 것(가려진 것은 안 누름).
        const at = await page.evaluate((want) => {
          const norm = (t) => (t || "").replace(/\s+/g, " ").trim().toLowerCase();
          const w = norm(want);
          const all = [...document.querySelectorAll("button, a, [role=button], input, textarea, li, label, span, p, div")];
          const hits = all.filter((e) => { const t = norm(e.innerText || e.getAttribute("aria-label") || e.getAttribute("placeholder")); return t && t.includes(w); })
            .map((e) => { const r = e.getBoundingClientRect(); const t = norm(e.innerText || e.getAttribute("aria-label") || e.getAttribute("placeholder")); return { e, r, len: t.length, exact: t === w || t.replace(/^[^\p{L}\p{N}]+/u, "") === w }; })
            .filter(({ e, r }) => { if (!(r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight)) return false; const top = document.elementFromPoint(r.x + r.width / 2, Math.min(innerHeight - 1, Math.max(0, r.y + r.height / 2))); return Boolean(top && (top === e || e.contains(top) || top.contains(e))); })
            .sort((a, b) => Number(b.exact) - Number(a.exact) || a.len - b.len);
          const pick = hits[0];
          return pick ? { x: pick.r.x + pick.r.width / 2, y: Math.min(innerHeight - 1, Math.max(1, pick.r.y + pick.r.height / 2)) } : null;
        }, body.text);
        if (!at) return send(res, 404, { error: "화면 맨 위에 그 글이 없음 — /shot의 buttons 좌표로 눌러라" });
        await page.mouse.click(at.x, at.y);
      }
      log.push({ at: Date.now(), click: body });
      await page.waitForTimeout(body.wait ?? 2200);
      return send(res, 200, await shot());
    }
    if (route === "/type") { await page.keyboard.type(body.text ?? "", { delay: 20 }); log.push({ type: body.text }); await page.waitForTimeout(600); return send(res, 200, await shot()); }
    if (route === "/key") { await page.keyboard.press(body.key ?? "Enter"); await page.waitForTimeout(1500); return send(res, 200, await shot()); }
    if (route === "/scroll") { await page.mouse.move(195, 450); await page.mouse.wheel(0, body.dy ?? 500); await page.waitForTimeout(700); return send(res, 200, await shot()); }
    if (route === "/reload") { await page.reload({ waitUntil: "domcontentloaded" }); await page.waitForTimeout(6000); return send(res, 200, await shot()); }
    if (route === "/wait") { await page.waitForTimeout(Math.min(25000, body.ms ?? 3000)); return send(res, 200, await shot()); }
    if (route === "/say") { pendingSay = String(body.text ?? ""); log.push({ say: pendingSay }); return send(res, 200, { ok: true, note: "다음 🎤 한 번이 이 말로 들린다. 이제 🎤 버튼을 눌러라." }); }
    if (route === "/day") {
      // 며칠이 지난 것처럼: 그동안 대본을 하루 1~2개씩 했다고 치고(운영 API), 폰 날짜를 넘긴다.
      const days = Math.max(1, Number(body.n ?? 1));
      const pack = await (await fetch(`https://www.languagebank.net/api/curriculum/scripts?pack=1&lang=${learn}`, { headers: { "x-rc-user": state.uid, "x-app-version": "2.77.0" } })).json();
      const list = (pack.scripts ?? []).sort((a, b) => a.stage - b.stage || (a.situation ?? 99) - (b.situation ?? 99));
      const notes = await (await fetch(`https://www.languagebank.net/api/notebook?lang=${learn}&scripts=1`, { headers: { "x-rc-user": state.uid, "x-app-version": "2.77.0" } })).json().catch(() => ({}));
      const passed = new Set((notes.parts ?? []).flatMap((p) => p.scripts?.passed ?? []));
      const todo = list.filter((s) => !passed.has(s.id)).slice(0, Math.round(days * 1.2));
      for (const s of todo) await api("/api/curriculum/scripts", { language: learn, id: s.id, outcome: "unaided" });
      const frames = (pack.frames ?? []).slice(0, Math.floor(days / 3));
      for (const f of frames) await api("/api/curriculum/scripts", { language: learn, id: f.id });
      dayOffset += days;
      await page.clock.install({ time: new Date(Date.now() + dayOffset * 86400000) }).catch(() => {});
      await page.evaluate(() => localStorage.removeItem("dailyPlan.today.v1"));
      await page.reload({ waitUntil: "domcontentloaded" }); await page.waitForTimeout(6000);
      log.push({ day: dayOffset, passedNow: todo.map((s) => s.id) });
      return send(res, 200, { day: dayOffset, newlyPassed: todo.length, ...(await shot()) });
    }
    if (route === "/stop") {
      send(res, 200, { ok: true });
      fs.writeFileSync(path.join(OUT, "actions.json"), JSON.stringify(log, null, 2));
      await api("/api/simcheck/forget", {});
      await browser.close(); server.close(); control.close(); process.exit(0);
    }
    send(res, 404, { error: "unknown" });
  } catch (error) { send(res, 500, { error: String(error).slice(0, 300) }); }
});
control.listen(Number(controlPort), () => console.log(`ready ${controlPort} uid=${state.uid}`));
