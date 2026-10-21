/**
 * "기능을 쓰면 이렇게 나온다" — 앱 웹 화면(www)을 띄우고 /api는 운영(또는 --api)으로 보내,
 * 가상 사용자가 기능을 실제로 써 본 화면을 언어 조합마다 찍는다.
 *
 *   npm run build:capacitor      (www가 없으면 먼저)
 *   npm run sim:screens -- [--combos ja:ko,en:ja,es:ar,en:ko] [--scenes chat-correct,map] [--run-id …]
 *   재현 한 장: --combos ar:vi --scenes chat-correct --text "😂😂👍🔥"  (점검에서 문제가 난 문장을 채팅에 그대로 보내 찍음)
 *
 * 결과: tmp/sim-users/<실행>/screens/<학습>-<앱>/<장면>.png 과 screens.html(장면 × 조합 갤러리).
 * 장면마다 따로 시도한다 — 하나가 막혀도 나머지는 찍고, 막힌 장면은 그 순간 화면을 "실패"로 남긴다.
 *
 * 한 조합 = 테스트 사용자 하나(무료 하루 채팅 10번 안: 채팅 2 + 자라는 중 3 + 미션 1 + 직접 묻기 1),
 * 로그인은 임시 계정(프로필·방에 필요), 방은 두 번째 임시 계정이 방장. 끝에 두 계정을 지운다.
 * 학습 언어 문장은 bank.json(가상 사용자와 같은 시드).
 */
import http from "node:http";
import { forgetAtEnd } from "./forget.mjs";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const value = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 || at + 1 >= args.length ? fallback : args[at + 1];
};
const ROOT = process.cwd();
const WWW = path.join(ROOT, "www");
const API = (value("api", process.env.API_BASE) || "https://english-chat-mvp.vercel.app").replace(/\/$/, "");
const PORT = Number(process.env.PORT || 4199);
const COMBOS = value("combos", "ja:ko,en:ja,es:ar,en:ko").split(",").map((c) => {
  const [target, ui] = c.split(":");
  return { target, ui };
});
const ONLY_SCENES = value("scenes", null)?.split(",") ?? null;
/** --model-routes: 점검 사용자 요청만 다른 모델로(서버 llm.ts adoptSimRoutes) — 예: '{"basic":"anthropic: claude-haiku-5-5"}' */
const MODEL_ROUTES = value("model-routes", null);
/** --text: chat-correct가 시드 문장 대신 이 문장을 보낸다(문제 재현 캡처용). */
const REPRO_TEXT = value("text", null);
const stamp = new Date(Date.now() + 9 * 3600_000).toISOString().replace(/[-:]/g, "").slice(0, 13).replace("T", "-");
const RUN_ID = value("run-id", `screens-${stamp}`);
const OUT = path.join(ROOT, value("out", `tmp/sim-users/${RUN_ID}`), "screens");
const ROOM_CODE = process.env.ROOM_INVITE_CODE ?? "LB2026";
const PHOTO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAE0lEQVR4nGPQqrgGRAzS66uACAAlrAV5k8yOagAAAABJRU5ErkJggg==";

if (!fs.existsSync(path.join(WWW, "index.html"))) {
  console.error("www/가 없어요. npm run build:capacitor를 먼저.");
  process.exit(2);
}
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const bank = JSON.parse(fs.readFileSync(new URL("./bank.json", import.meta.url), "utf8"));
const { roomCopy } = await import(`file://${path.join(ROOT, "src/lib/rooms/copy.ts")}`);

/** copy.ts는 "@/"로 불러와 Node가 못 읽는다 — 경로를 바꾼 사본으로 읽고 바로 지운다(capture-whats-new.mjs와 같은 방법). */
async function loadCopy() {
  const dir = path.join(ROOT, "tmp", "copycheck");
  fs.mkdirSync(dir, { recursive: true });
  const source = fs
    .readFileSync(path.join(ROOT, "src/lib/copy.ts"), "utf8")
    .replace('"@/lib/locales/generated.json"', '"../../src/lib/locales/generated.json" with { type: "json" }')
    .replace('"@/lib/locales/overlays.json"', '"../../src/lib/locales/overlays.json" with { type: "json" }')
    .replace('"@/lib/learningLanguages"', '"../../src/lib/learningLanguages.ts"');
  const file = path.join(dir, `sim-screens-${Date.now()}.ts`);
  fs.writeFileSync(file, source);
  try {
    return (await import(`file://${file}`)).copy;
  } finally {
    fs.rmSync(file, { force: true });
  }
}
const copy = await loadCopy();

// ── www + /api 프록시 ──
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".txt": "text/plain", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2", ".webp": "image/webp", ".mp3": "audio/mpeg" };
const server = http.createServer(async (req, res) => {
  if (req.url.startsWith("/api/")) {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const headers = { ...req.headers };
    for (const h of ["host", "origin", "referer", "content-length"]) delete headers[h];
    try {
      if (MODEL_ROUTES) headers["x-sim-model-routes"] = MODEL_ROUTES;
      const upstream = await fetch(API + req.url, { method: req.method, headers, body: ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.concat(chunks) });
      const type = upstream.headers.get("content-type") || "application/octet-stream";
      res.writeHead(upstream.status, { "content-type": type });
      if (type.includes("ndjson") && upstream.body) {
        // 채팅 스트림(답 먼저 → 교정)은 받는 대로 흘려 보낸다 — 모아 보내면 앱에서 한 번에 뜬다.
        for await (const chunk of upstream.body) res.write(chunk);
        res.end();
      } else {
        res.end(Buffer.from(await upstream.arrayBuffer()));
      }
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
  if (!fs.existsSync(file)) {
    res.writeHead(404);
    res.end();
    return;
  }
  res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise((resolve) => server.listen(PORT, "127.0.0.1", resolve));
const BASE = `http://127.0.0.1:${PORT}`;

const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const exactly = (text) => new RegExp(`^${escape(text)}$`);

/** 운영 API를 Node에서 직접(방장 계정·정리용). */
async function api(uid, pathname, body, token) {
  const response = await fetch(`${API}${pathname}`, {
    method: body === undefined ? "GET" : "POST",
    headers: { "content-type": "application/json", "x-rc-user": uid, ...(token ? { "x-auth-token": token } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, body: await response.json().catch(() => null) };
}

function shortId(text) {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ ch.codePointAt(0), 16777619);
  return (h >>> 0).toString(36);
}

async function signup(uid, tag) {
  const username = `simscr${shortId(uid)}${tag}`.slice(0, 20);
  const res = await api(uid, "/api/account/password/signup", { username, password: `sim-${shortId(username)}-pw!` });
  if (!res.body?.token) throw new Error(`임시 계정 가입 실패 ${res.status} ${JSON.stringify(res.body)}`);
  return { uid, token: res.body.token, account: res.body.account };
}

/** 학습 언어 문장 고르기: 틀린 것 하나, 맞는 것 여러 개. */
function linesFor(target) {
  const lines = bank.learner[target] ?? bank.learner.en;
  return {
    slipped: lines.find((l) => !l.ok && l.level >= 2 && l.level <= 3)?.text ?? lines[0].text,
    clean: lines.filter((l) => l.ok).map((l) => l.text),
  };
}

// ── 장면 ──
// 각 장면: { id, label, run(ctx) } — run이 끝난 화면을 찍는다. ctx.state로 앞 장면의 결과를 넘긴다.
const SCENES = [
  {
    id: "chat-correct",
    label: "채팅 — 틀린 문장을 보내면 \"고칠 곳이 있어요\" 칩(기본 눌러서 보기)",
    async run({ page, ui, wait, target }) {
      await page.goto(`${BASE}/?screen=chat`, { waitUntil: "domcontentloaded" });
      await wait(3000);
      const before = await page.getByRole("button", { name: exactly(ui.insightAnalyze) }).count();
      await page.locator("textarea:visible").first().fill(REPRO_TEXT ?? linesFor(target).slipped);
      await page.getByRole("button", { name: exactly(ui.send) }).click();
      for (let i = 0; i < 60; i++) {
        await wait(500);
        if ((await page.getByRole("button", { name: exactly(ui.insightAnalyze) }).count()) > before + 1) break;
      }
      await wait(2500);
    },
  },
  {
    id: "chat-reply-first",
    label: "채팅 — 답이 먼저 뜨고 ✎ 고친 문장 표시는 조금 뒤(스트림)",
    async run({ page, ui, wait, target }) {
      await page.goto(`${BASE}/?screen=chat`, { waitUntil: "domcontentloaded" });
      await wait(3000);
      const before = await page.getByRole("button", { name: exactly(ui.insightAnalyze) }).count();
      await page.locator("textarea:visible").first().fill(REPRO_TEXT ?? linesFor(target).slipped);
      await page.getByRole("button", { name: exactly(ui.send) }).click();
      // 답 줄이 생기는 순간을 찍는다(교정 표시가 아직 없을 수 있음).
      for (let i = 0; i < 120; i++) {
        await wait(100);
        if ((await page.getByRole("button", { name: exactly(ui.insightAnalyze) }).count()) > before + 1) break;
      }
    },
  },
  {
    id: "chat-correct-open",
    label: "채팅 — 칩을 누르면 고친 문장이 열림(위험한 줄은 확인 모델이 먼저 봄)",
    async run({ page, ui, wait }) {
      const chip = page.getByRole("button", { name: exactly(ui.chatCorrectionChip) });
      for (let i = 0; i < 20 && !(await chip.count()); i++) await wait(500);
      if (!(await chip.count())) return; // 고칠 곳이 없던 줄 — 그대로 찍는다
      const verified = page.waitForResponse((r) => r.url().includes("/api/chat/verify"), { timeout: 15000 }).catch(() => undefined);
      await chip.last().click();
      await verified;
      for (let i = 0; i < 30 && (await chip.count()); i++) await wait(300);
      await wait(1200);
    },
  },
  {
    id: "chat-expression",
    label: "채팅 — 편한 말로 쓰고 \"표현 보기\"",
    async run({ page, ui, wait, locale }) {
      await page.locator("textarea:visible").first().fill(bank.ownLanguage[locale]);
      await page.getByRole("button", { name: exactly(ui.send) }).click();
      const show = page.getByRole("button", { name: exactly(ui.chatShowExpression) });
      for (let i = 0; i < 60 && !(await show.count()); i++) await wait(500);
      await wait(1500);
      await show.last().click();
      const use = page.getByRole("button", { name: exactly(ui.chatUseExpression) });
      for (let i = 0; i < 40 && !(await use.count()); i++) await wait(1000);
      await wait(800);
    },
  },
  {
    id: "chat-reading",
    label: "채팅 — 튜터 말 \"해석\"",
    async run({ page, ui, wait }) {
      const translated = page.waitForResponse((r) => r.url().includes("/api/translate"), { timeout: 30000 }).catch(() => undefined);
      await page.getByRole("button", { name: exactly(ui.chatReading) }).last().click();
      await translated;
      await wait(2000);
    },
  },
  {
    id: "sentence-ask",
    label: "문장분석 — 표현을 골라 빠른 질문(뜻)",
    async run({ page, ui, wait }) {
      await page.getByRole("button", { name: exactly(ui.insightAnalyze) }).last().click();
      await wait(4500);
      const slider = page.locator("[role=slider]").first();
      const box = await slider.boundingBox();
      const count = await slider.locator("> span").count();
      const x = (i) => box.x + (box.width * (i + 0.5)) / count;
      const y = box.y + box.height / 2;
      await page.mouse.move(x(Math.max(0, count - 3)), y);
      await page.mouse.down();
      await page.mouse.move(x(count - 1), y, { steps: 5 });
      await page.mouse.up();
      await wait(700);
      await page.getByRole("button", { name: ui.quickAskMeaning }).click();
      const loading = ui.askLoading.replace("…", "");
      for (let i = 0; i < 40; i++) {
        await wait(1000);
        if (!(await page.locator("[role=dialog]").last().innerText()).includes(loading)) break;
      }
      await wait(800);
    },
  },
  {
    id: "word-card",
    label: "문장분석 — 낱말을 누르면 단어 카드",
    async run({ page, ui, wait }) {
      const words = page.locator("[role=dialog] p button");
      const texts = await words.allInnerTexts();
      let best = 0;
      texts.forEach((t, i) => {
        if (t.trim().length > texts[best].trim().length) best = i;
      });
      if (!texts.length) throw new Error("누를 낱말이 없음");
      await words.nth(best).click();
      const loading = ui.vocabPreviewLoading.replace("…", "");
      for (let i = 0; i < 40; i++) {
        await wait(700);
        if (!(await page.locator("[role=dialog]").last().innerText()).includes(loading)) break;
      }
      await wait(1200);
    },
  },
  {
    id: "vocab-search",
    label: "단어장(노트 안) — 내 언어로 검색",
    async run({ page, ui, wait, locale }) {
      // 2.69부터 단어장은 My 노트 안: 옛 링크(?screen=vocab)가 노트의 단어장 시트를 연다.
      await page.goto(`${BASE}/?screen=vocab`, { waitUntil: "domcontentloaded" });
      await wait(4000);
      const box = page.locator("input:visible").last();
      await box.fill(bank.vocabWord[locale]);
      await page.getByRole("button", { name: exactly(ui.vocabSearchCta) }).last().click();
      for (let i = 0; i < 40 && !(await page.getByText(ui.vocabResultsTitle).count()); i++) await wait(500);
      await wait(1500);
    },
  },
  {
    id: "selfcheck",
    label: "My — 지도 시작 체크 3질문",
    async run({ page, ui, wait }) {
      await page.goto(`${BASE}/?screen=map`, { waitUntil: "domcontentloaded" });
      await wait(3000);
      await page.evaluate(() => localStorage.setItem("myViewMode", "map"));
      await page.goto(`${BASE}/?screen=map`, { waitUntil: "domcontentloaded" });
      await wait(3000);
      await page.getByRole("button", { name: exactly(ui.selfGapSpeaking) }).click();
      await page.getByRole("button", { name: exactly(ui.selfGapListening) }).click();
      await page.getByRole("button", { name: exactly(ui.selfFocusSpeaking) }).click();
      await page.getByRole("button", { name: exactly(ui.selfUseTravel) }).click();
      await page.getByRole("button", { name: ui.mapDraw }).scrollIntoViewIfNeeded();
      await wait(600);
    },
  },
  {
    id: "map",
    label: "My — 체크로 그린 학습 지도",
    async run({ page, ui, wait, locale }) {
      await page.locator("textarea:visible").first().fill(bank.mapGoal[locale]).catch(() => undefined);
      await page.getByRole("button", { name: ui.mapDraw }).click();
      const drawing = ui.mapDrawing.split("…")[0];
      for (let i = 0; i < 120; i++) {
        await wait(1000);
        if (!(await page.locator("body").innerText()).includes(drawing)) break;
      }
      await wait(1500);
    },
  },
  {
    id: "mission",
    label: "지도 — 미션을 써 보면 확인·교정",
    async run({ page, ui, wait, state }) {
      await page.getByRole("button", { name: new RegExp(escape(ui.mapContinue)) }).first().click();
      await wait(1000);
      const missions = page.waitForResponse((r) => r.url().includes("/api/curriculum/missions"), { timeout: 90000 });
      await page.getByRole("button", { name: new RegExp(escape(ui.missionStart)) }).first().click();
      const data = await (await missions).json();
      state.mission = data.missions?.[0];
      await wait(1200);
      await page.getByRole("button", { name: exactly(ui.missionHint) }).click();
      await wait(500);
      // 예시 답에서 한 낱말을 빼서 고칠 거리를 남긴다.
      const words = String(state.mission?.answer ?? "").split(" ");
      const answer = words.length > 3 ? [words[0], ...words.slice(2)].join(" ") : String(state.mission?.answer ?? "");
      await page.locator("textarea:visible").last().fill(answer);
      await page.getByRole("button", { name: exactly(ui.missionCheck) }).click();
      const checking = ui.missionChecking.replace("…", "");
      for (let i = 0; i < 45; i++) {
        await wait(1000);
        if (!(await page.locator("body").innerText()).includes(checking)) break;
      }
      await wait(1500);
    },
  },
  {
    id: "today",
    label: "My — \"오늘 해볼 것\" 카드",
    async run({ page, ui, wait }) {
      await page.goto(`${BASE}/?screen=map`, { waitUntil: "domcontentloaded" });
      for (let i = 0; i < 30 && !(await page.getByRole("button", { name: ui.nextByChat }).count()); i++) await wait(500);
      await page.getByRole("button", { name: ui.nextByChat }).first().scrollIntoViewIfNeeded();
      await page.mouse.wheel(0, -200);
      await wait(1200);
    },
  },
  {
    id: "growth",
    label: "My — 맞게 쓴 줄을 보낸 뒤 \"자라는 중\"",
    async run({ page, ui, wait, target }) {
      await page.evaluate(() => localStorage.setItem("myViewMode", "net"));
      await page.goto(`${BASE}/?screen=chat`, { waitUntil: "domcontentloaded" });
      await wait(3500);
      for (const line of linesFor(target).clean.slice(0, 3)) {
        const before = await page.getByRole("button", { name: exactly(ui.insightAnalyze) }).count();
        await page.locator("textarea:visible").first().fill(line);
        await page.getByRole("button", { name: exactly(ui.send) }).click();
        for (let i = 0; i < 60; i++) {
          await wait(500);
          if ((await page.getByRole("button", { name: exactly(ui.insightAnalyze) }).count()) > before) break;
        }
        await wait(1200);
      }
      await wait(4000);
      await page.goto(`${BASE}/?screen=map`, { waitUntil: "domcontentloaded" });
      await wait(5000);
      await page.locator(`section[aria-label="${ui.myNetworkTitle}"]`).first().evaluate((el) => el.scrollIntoView({ block: "start" }));
      await page.mouse.wheel(0, -90);
      await wait(800);
    },
  },
  {
    id: "element",
    label: "My — 요소(정확도)를 누르면 시트",
    async run({ page, ui, wait }) {
      await page.locator(`[aria-label^="${ui.myElAccuracy}"]`).first().click();
      await wait(1500);
    },
  },
  {
    id: "myask",
    label: "My — 직접 묻기 답",
    async run({ page, ui, wait }) {
      await page.locator("[role=dialog]").getByRole("button", { name: ui.billingClose }).first().click().catch(() => undefined);
      await wait(600);
      await page.getByRole("button", { name: exactly(ui.myAskQuick1) }).first().click();
      await wait(1000);
      for (let i = 0; i < 45 && (await page.getByText(ui.myAskThinking).count()); i++) await wait(1000);
      await wait(800);
      await page.getByRole("button", { name: new RegExp(escape(ui.myGrowIt)) }).first().scrollIntoViewIfNeeded().catch(() => undefined);
      await page.mouse.wheel(0, 120);
      await wait(800);
    },
  },
  {
    id: "ledger",
    label: "My — 내 표현",
    async run({ page, ui, wait }) {
      await page.goto(`${BASE}/?screen=map`, { waitUntil: "domcontentloaded" });
      await wait(4000);
      await page.getByRole("button", { name: new RegExp(escape(ui.ledgerTitle)) }).first().click();
      await wait(2500);
    },
  },
  {
    id: "call-home",
    label: "통화 — 첫 화면(오늘의 팩·오늘 해볼 것)",
    async run({ page, wait }) {
      await page.goto(`${BASE}/?screen=roleplay`, { waitUntil: "domcontentloaded" });
      await wait(5000);
    },
  },
  {
    id: "video-library",
    label: "영상 — 이달의 영상 목록",
    async run({ page, ui, wait }) {
      await page.goto(`${BASE}/?screen=video`, { waitUntil: "domcontentloaded" });
      await wait(4000);
      await page.getByText(ui.videoLearnLibraryTitle).first().scrollIntoViewIfNeeded().catch(() => undefined);
      await page.mouse.wheel(0, 120);
      await wait(1500);
    },
  },
  {
    id: "guide",
    label: "사용법(?) 시트",
    async run({ page, ui, wait }) {
      await page.goto(`${BASE}/?screen=chat`, { waitUntil: "domcontentloaded" });
      await wait(3000);
      await page.getByRole("button", { name: exactly(ui.guideOpen) }).first().click();
      await wait(3000);
    },
  },
  {
    id: "feedback",
    label: "의견 보내기 시트",
    async run({ page, ui, wait }) {
      await page.keyboard.press("Escape").catch(() => undefined);
      await page.goto(`${BASE}/?screen=chat`, { waitUntil: "domcontentloaded" });
      await wait(3000);
      await page.getByRole("button", { name: exactly(ui.feedbackOpen) }).first().click();
      await wait(2500);
    },
  },
  {
    id: "account",
    label: "프로필 — 내 계정 카드(닉네임·소개·사진)",
    async run({ page, wait, ui }) {
      await page.goto(`${BASE}/?screen=map`, { waitUntil: "domcontentloaded" });
      await wait(4000);
      await page.getByText(ui.accountEdit, { exact: true }).first().scrollIntoViewIfNeeded().catch(() => undefined);
      await page.mouse.wheel(0, -200);
      await wait(800);
    },
  },
  {
    id: "account-edit",
    label: "프로필 — 편집 시트",
    async run({ page, wait, ui }) {
      // 카드 전체가 한 버튼이고 "편집"은 그 안의 글자다.
      await page.getByText(ui.accountEdit, { exact: true }).first().click();
      await wait(1500);
    },
  },
  {
    id: "rooms-list",
    label: "말하는 방 — 열린 방 목록",
    async run({ page, wait, rc, state }) {
      // 2.68부터 하단 "Room" 탭.
      await page.goto(`${BASE}/?screen=rooms`, { waitUntil: "domcontentloaded" });
      await wait(4000);
      await page.getByRole("button", { name: exactly(rc.refresh) }).first().click().catch(() => undefined);
      await wait(2000);
      await page.getByText(state.roomName).first().scrollIntoViewIfNeeded().catch(() => undefined);
      await wait(800);
    },
  },
  {
    id: "room-inside",
    label: "말하는 방 — 들어가면 자리·손들기·댓글",
    async run({ page, wait, rc, state }) {
      // 방 카드 전체가 "말하며 들어가기" 버튼이다.
      await page.getByText(state.roomName).first().click();
      await wait(6000);
    },
  },
  {
    id: "room-comment",
    label: "말하는 방 — 편한 말 댓글을 \"학습 언어로\"",
    async run({ page, wait, rc, locale }) {
      await page.locator(`input[placeholder="${rc.commentPlaceholder}"], textarea[placeholder="${rc.commentPlaceholder}"]`).first().fill(bank.ownLanguage[locale]);
      await page.getByRole("button", { name: exactly(rc.howToSay) }).first().click();
      for (let i = 0; i < 40 && !(await page.getByRole("button", { name: exactly(rc.sendThis) }).count()); i++) await wait(750);
      await wait(1000);
    },
  },
  {
    id: "room-profile",
    label: "말하는 방 — 방장 프로필 시트(팔로우·차단·신고)",
    async run({ page, wait, state }) {
      await page.keyboard.press("Escape").catch(() => undefined);
      await page.locator(`[aria-label="${state.hostNickname}"]`).first().click();
      await wait(2500);
    },
  },
  {
    id: "notes",
    label: "My — 노트(장·주제 목차에 모인 표현·단어)",
    async run({ page, ui, wait }) {
      await page.goto(`${BASE}/?screen=map`, { waitUntil: "domcontentloaded" });
      await wait(5000);
      await page.getByText(ui.notesTitle, { exact: true }).first().scrollIntoViewIfNeeded();
      await page.mouse.wheel(0, -120);
      await wait(2500);
    },
  },
  {
    id: "notes-words",
    label: "My — 노트 안 단어장",
    async run({ page, ui, wait }) {
      await page.locator("section").filter({ hasText: ui.notesTitle }).getByRole("button", { name: new RegExp(`^${escape(ui.homeTabVocab)}`) }).first().click();
      await wait(2000);
    },
  },
  {
    id: "people",
    label: "사람 — 최근 접속한 사람 (개인정보 때문에 테스트 계정만 보이게 거름)",
    async run({ page, wait, state }) {
      await prepareSocial(state);
      // 실제 사용자의 이름·사진이 화면에 찍히지 않게: 사람 목록 응답을 이 실행의 테스트 계정 카드로 바꾼다.
      await page.route("**/api/social", async (route) => {
        const body = route.request().postDataJSON?.() ?? {};
        if (body.action !== "people") return route.continue({ headers: { ...route.request().headers(), "x-rc-user": state.uid } });
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ people: state.peopleCards }) });
      });
      await page.goto(`${BASE}/?screen=people`, { waitUntil: "domcontentloaded" });
      await wait(5000);
    },
  },
  {
    id: "people-profile",
    label: "사람 — 프로필(팔로우·메시지)",
    async run({ page, wait, state }) {
      await page.getByText(state.hostNickname, { exact: true }).first().click();
      await wait(3000);
      await page.unroute("**/api/social").catch(() => undefined);
    },
  },
  {
    id: "invite-welcome",
    label: "친구 초대 링크로 앱을 열면",
    async run({ page, wait, state }) {
      await prepareSocial(state);
      await page.goto(`${BASE}/?invite=${state.hostInvite}${state.roomId ? `&room=${state.roomId}` : ""}`, { waitUntil: "domcontentloaded" });
      await wait(5000);
    },
  },
  {
    id: "messages",
    label: "메시지 — 단체방·1:1 목록(받은 초대 포함)",
    async run({ page, wait, state }) {
      await prepareSocial(state);
      // 앞 장면의 초대 환영 시트를 닫는다(앱은 받은 초대를 저장해 두고 다시 띄움).
      await page.evaluate(() => localStorage.removeItem("invite:pending:v1"));
      await page.goto(`${BASE}/?screen=messages`, { waitUntil: "domcontentloaded" });
      await wait(6000);
    },
  },
  {
    id: "dm-thread",
    label: "메시지 — 1:1 대화(집어 묻기·통화 기록)",
    async run({ page, wait, state }) {
      await page.getByText(state.hostNickname, { exact: true }).first().click();
      await wait(5000);
    },
  },
  {
    id: "group-thread",
    label: "메시지 — 단체방 대화(집어 묻기)",
    async run({ page, wait, state }) {
      await page.goto(`${BASE}/?screen=messages`, { waitUntil: "domcontentloaded" });
      await wait(5000);
      await page.getByText(state.groupName, { exact: true }).first().click();
      await wait(5000);
    },
  },
];

/**
 * 사람 사이 장면에 쓸 기록: 방장(B)·친구(C)와 1:1 대화(집어 묻기·통화 기록), 단체방 둘(참여한 것·받은 초대),
 * 사람 목록 카드, 방장의 초대 코드. 모두 이 실행의 숨김 테스트 계정끼리.
 */
async function prepareSocial(state) {
  if (state.socialReady) return;
  state.socialReady = true;
  const { me, host, friend, target, locale } = state;
  const lines = (bank.learner[target] ?? []).filter((l) => l.ok).map((l) => l.text);
  const say = (i) => lines[i % Math.max(1, lines.length)] ?? "hello";
  const dm = (who, action, extra) => api(who.uid, "/api/dm", { code: ROOM_CODE, action, ...extra }, who.token);
  const groups = (who, action, extra) => api(who.uid, "/api/groups", { code: ROOM_CODE, action, ...extra }, who.token);
  const room = (who, action, extra) => api(who.uid, "/api/rooms", { code: ROOM_CODE, action, ...extra }, who.token);

  // 1:1: 방장이 먼저, 내가 답(대화 열림), 내가 방장 말을 집어 묻기, 방장이 답, 짧은 통화 기록.
  const first = await dm(host, "send", { target: me.account.id, text: say(0) });
  await dm(me, "send", { target: host.account.id, text: say(1) });
  const threadId = first.body?.thread?.id;
  const hostSeq = first.body?.message?.seq;
  await dm(me, "send", { target: host.account.id, text: bank.askMeaning[target], quoteSeq: hostSeq, ask: true });
  await dm(host, "send", { target: me.account.id, text: say(2) });
  if (threadId) {
    const mePeer = `simme${shortId(me.uid)}`;
    const hostPeer = `simhd${shortId(host.uid)}`;
    const callRes = await dm(me, "call", { threadId, peerId: mePeer });
    const callRoom = callRes.body?.room?.id;
    if (callRoom) {
      await room(me, "join", { peerId: mePeer, roomId: callRoom });
      await room(host, "join", { peerId: hostPeer, roomId: callRoom });
      await room(host, "line", { peerId: hostPeer, roomId: callRoom, kind: "speech", text: say(3), lang: target });
      await room(me, "line", { peerId: mePeer, roomId: callRoom, kind: "speech", text: say(4), lang: target });
      await room(me, "leave", { peerId: mePeer, roomId: callRoom });
      await room(host, "leave", { peerId: hostPeer, roomId: callRoom });
      await dm(me, "endCall", { roomId: callRoom });
    }
  }
  // 친구가 보낸 요청 하나(목록에 "메시지 요청").
  await dm(friend, "send", { target: me.account.id, text: say(5) });

  // 단체방: 내가 만들고 둘 다 참여, 대화 몇 줄 + 집어 묻기.
  state.groupName = `[test] ${target}↔${locale} study`;
  const made = await groups(me, "create", { name: state.groupName, languages: [target, locale], invite: [host.account.id, friend.account.id] });
  const groupId = made.body?.group?.id;
  state.groupIds = [];
  if (groupId) {
    state.groupIds.push(groupId);
    await groups(host, "answer", { groupId, accept: true });
    await groups(friend, "answer", { groupId, accept: true });
    const hostLine = await groups(host, "send", { groupId, text: say(6) });
    await groups(friend, "send", { groupId, text: say(7) });
    await groups(me, "send", { groupId, text: bank.askMeaning[target], quoteSeq: hostLine.body?.message?.seq, ask: true });
    await groups(host, "send", { groupId, text: say(8) });
  }
  // 친구가 만든 단체방의 받은 초대(목록에 "참여").
  const invited = await groups(friend, "create", { name: `[test] ${target} club`, languages: [target], invite: [me.account.id] });
  if (invited.body?.group?.id) state.groupIds.push(invited.body.group.id);

  // 사람 목록 카드: 이 실행의 테스트 계정만.
  const now = Date.now();
  state.peopleCards = [
    { id: host.account.id, nickname: state.hostNickname, bio: bank.askGrowth[target], hasPhoto: true, ui: target, learn: locale, lastSeen: now - 60_000, isFollowing: false },
    { id: friend.account.id, nickname: state.friendNickname, bio: bank.mapGoal[locale], hasPhoto: true, ui: locale, learn: target, lastSeen: now - 3 * 3600_000, isFollowing: true },
  ];
  await api(me.uid, "/api/social", { action: "follow", target: friend.account.id }, me.token);
  state.hostInvite = (await api(host.uid, "/api/invite", { action: "mine" }, host.token)).body?.code ?? "";
}

function keepAlive(host, roomId, peerId) {
  const tick = () => api(host.uid, "/api/rooms", { code: ROOM_CODE, action: "poll", peerId, roomId, since: 0 }, host.token).catch(() => undefined);
  const timer = setInterval(tick, 3000);
  return () => clearInterval(timer);
}

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const results = [];
for (const combo of COMBOS) {
  const { target, ui: locale } = combo;
  const ui = copy[locale];
  const rc = roomCopy(locale);
  const dir = path.join(OUT, `${target}-${locale}`);
  fs.mkdirSync(dir, { recursive: true });
  const uid = `simcheck-${RUN_ID}-${target}${locale}`;
  const people = [];
  let stopHost = () => {};
  const state = {};
  const row = { combo, shots: [] };
  results.push(row);
  const context = await browser.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const wait = (ms) => page.waitForTimeout(ms);
  try {
    // 로그인한 학습자(A)와 방장(B)
    const me = await signup(uid, "a");
    people.push(me);
    // 모든 테스트 계정은 숨김 — 실제 사용자의 "사람" 목록에 뜨지 않게.
    await api(uid, "/api/account/profile", { nickname: bank.nickname[locale], bio: bank.mapGoal[locale], photo: PHOTO, hidden: true }, me.token);
    const host = await signup(`${uid}-host`, "h");
    people.push(host);
    const hostNickname = `${bank.nickname[target]}✦`;
    await api(host.uid, "/api/account/profile", { nickname: hostNickname, bio: bank.askGrowth[target], photo: PHOTO, hidden: true }, host.token);
    state.hostNickname = hostNickname;
    const friend = await signup(`${uid}-friend`, "f");
    people.push(friend);
    state.friendNickname = `${bank.nickname[locale]}·${bank.nickname[target]}`.slice(0, 20);
    await api(friend.uid, "/api/account/profile", { nickname: state.friendNickname, bio: bank.mapGoal[locale], photo: PHOTO, hidden: true }, friend.token);
    Object.assign(state, { uid, target, locale, me: { ...me }, host: { ...host }, friend: { ...friend } });
    state.roomName = `[test] ${target}↔${locale} ${shortId(uid)}`;
    const account = (await api(uid, "/api/account/me", undefined, me.token)).body?.account;

    await page.route("**/api/**", (route) => route.continue({ headers: { ...route.request().headers(), "x-rc-user": uid } }));
    await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
    await page.evaluate(([t, l, token, acct, code]) => {
      localStorage.setItem("appTargetLanguage", t);
      localStorage.setItem("appUiLocale", l);
      localStorage.setItem("chatOwnLanguageTipSeen", "1");
      localStorage.setItem("whatsNewSeenVersion", "999");
      localStorage.setItem("ec_auth_token", token);
      localStorage.setItem("ec_account", JSON.stringify(acct));
      localStorage.setItem("roomsInviteCode", code);
    }, [target, locale, me.token, account, ROOM_CODE]);

    for (const scene of SCENES) {
      if (ONLY_SCENES && !ONLY_SCENES.includes(scene.id)) continue;
      if (scene.id === "rooms-list") {
        // 방장이 방을 열고 들어가 있게: 만들기·들어가기·댓글 한 줄, 그동안 계속 물음.
        const created = await api(host.uid, "/api/rooms", { code: ROOM_CODE, action: "create", peerId: `simhost${shortId(uid)}`, name: state.roomName, languages: [target, locale] }, host.token);
        state.roomId = created.body?.room?.id;
        if (state.roomId) {
          await api(host.uid, "/api/rooms", { code: ROOM_CODE, action: "join", peerId: `simhost${shortId(uid)}`, roomId: state.roomId, langs: [target, locale] }, host.token);
          await api(host.uid, "/api/rooms", { code: ROOM_CODE, action: "line", peerId: `simhost${shortId(uid)}`, roomId: state.roomId, kind: "text", text: linesFor(target).clean[0] }, host.token);
          stopHost = keepAlive(host, state.roomId, `simhost${shortId(uid)}`);
        }
      }
      const file = path.join(dir, `${scene.id}.png`);
      const started = Date.now();
      try {
        await scene.run({ page, ui, rc, wait, locale, target, state });
        await page.screenshot({ path: file });
        row.shots.push({ id: scene.id, label: scene.label, file, ok: true, seconds: Math.round((Date.now() - started) / 1000) });
        console.log(`${target}:${locale} ✓ ${scene.id}`);
      } catch (error) {
        await page.screenshot({ path: file }).catch(() => undefined);
        row.shots.push({ id: scene.id, label: scene.label, file, ok: false, error: String(error?.message ?? error).split("\n")[0].slice(0, 200) });
        console.log(`${target}:${locale} ✗ ${scene.id}: ${String(error?.message ?? error).split("\n")[0].slice(0, 160)}`);
      }
    }
  } catch (error) {
    row.error = String(error?.message ?? error).slice(0, 300);
    console.log(`${target}:${locale} 준비 실패: ${row.error}`);
  } finally {
    stopHost();
    if (state.roomId && people[1]) await api(people[1].uid, "/api/rooms", { code: ROOM_CODE, action: "leave", peerId: `simhost${shortId(uid)}`, roomId: state.roomId }, people[1].token).catch(() => undefined);
    // 단체방은 모두 떠나고(빈 단체방은 30일 뒤 사라짐) 계정을 지운다.
    for (const groupId of state.groupIds ?? []) {
      for (const person of people) await api(person.uid, "/api/groups", { code: ROOM_CODE, action: "leave", groupId }, person.token).catch(() => undefined);
    }
    for (const person of people) await api(person.uid, "/api/account/delete", {}, person.token).catch(() => undefined);
    await context.close();
  }
}
await browser.close();
server.close();
await forgetAtEnd(API, RUN_ID);

// ── 갤러리 ──
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const sceneIds = SCENES.filter((s) => !ONLY_SCENES || ONLY_SCENES.includes(s.id));
const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>기능 화면</title>
<style>:root{--bg:#fcfcfb;--panel:#fff;--line:#e4e3df;--ink:#0b0b0b;--ink2:#52514e;--crit:#d03b3b}
@media (prefers-color-scheme: dark){:root{--bg:#1a1a19;--panel:#22221f;--line:#383835;--ink:#f0efec;--ink2:#c3c2b7;--crit:#e66767}}
body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.5 system-ui,"Apple SD Gothic Neo","Noto Sans KR",sans-serif}main{max-width:1400px;margin:0 auto;padding:24px 16px}
h1{font-size:20px;margin:0 0 4px}h2{font-size:15px;margin:28px 0 8px}.meta{color:var(--ink2);font-size:12px}
.row{display:grid;grid-template-columns:repeat(${COMBOS.length},minmax(160px,1fr));gap:10px}figure{margin:0;background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:6px}
figure img{width:100%;border-radius:6px;display:block}figcaption{font-size:11px;color:var(--ink2);margin-top:4px}.fail{color:var(--crit);font-weight:600}
.head{display:grid;grid-template-columns:repeat(${COMBOS.length},minmax(160px,1fr));gap:10px;position:sticky;top:0;background:var(--bg);padding:6px 0;font-weight:600;font-size:12px;z-index:1}
@media (max-width:700px){.row,.head{grid-template-columns:repeat(2,1fr)}}</style></head><body><main>
<h1>기능 화면 — 쓰면 이렇게 나와요</h1><div class="meta">${esc(RUN_ID)} · ${esc(API)} · 조합 ${COMBOS.map((c) => `${c.target} 학습·${c.ui} 앱`).join(", ")} · 실패 ${results.flatMap((r) => r.shots).filter((s) => !s.ok).length}장</div>
<div class="head">${COMBOS.map((c) => `<div>${c.target} 학습 · ${c.ui} 앱</div>`).join("")}</div>
${sceneIds.map((scene) => `<h2>${esc(scene.label)}</h2><div class="row">${results.map((r) => {
  const shot = r.shots.find((s) => s.id === scene.id);
  if (!shot) return `<figure><figcaption class="fail">${esc(r.error ?? "찍지 못함")}</figcaption></figure>`;
  const rel = path.relative(path.dirname(OUT), shot.file).split(path.sep).join("/");
  return `<figure><img loading="lazy" src="${rel}" alt="${esc(scene.label)} ${r.combo.target}/${r.combo.ui}">${shot.ok ? "" : `<figcaption class="fail">막힘: ${esc(shot.error)}</figcaption>`}</figure>`;
}).join("")}</div>`).join("\n")}
</main></body></html>`;
fs.writeFileSync(path.join(path.dirname(OUT), "screens.html"), html);
fs.writeFileSync(path.join(path.dirname(OUT), "screens.json"), JSON.stringify(results, null, 2));
const fails = results.flatMap((r) => r.shots.filter((s) => !s.ok).map((s) => `${r.combo.target}:${r.combo.ui} ${s.id}`));
console.log(`\n장면 ${results.reduce((n, r) => n + r.shots.length, 0)}장 · 막힘 ${fails.length}${fails.length ? ` (${fails.join(", ")})` : ""}`);
console.log(`갤러리: ${path.relative(ROOT, path.join(path.dirname(OUT), "screens.html"))}`);
