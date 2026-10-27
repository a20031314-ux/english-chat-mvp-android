/**
 * 서비스 지도: 웹 유입 창구 → 앱 틀 → 하단 탭 → 어디서나 열리는 것을 한 장의 구조도로,
 * 칸을 누르면 그 화면의 사용 그림과 기능 설명·가는 길·코드 영역이 열리는 웹 페이지.
 *
 * - 그림과 글은 사용법(?)에서 가져온다: `src/lib/guide/content.ts`의 한국어 글(GUIDE_KO) + `public/guide/ko/*.webp`.
 *   버튼 이름 {ui:키}는 `copy.ts` 한국어 문구로 채운다. 사용법을 고치면 지도도 다시 만들기만 하면 맞춰진다.
 * - 웹 창구(Moyeo·Pingo·웹 앱)는 운영 주소를 폰 크기로 찍는다(`--no-capture`면 지난번 그림을 그대로 쓴다).
 * - 코드 영역(화면 파일·API)은 `hub/STRUCTURE.md` 자동 부분에서 읽는다.
 *
 * 실행: node scripts/service-map.mjs [--no-capture]   → tmp/service-map/index.html + shots/
 * 올리기: Artifact 도구로 tmp/service-map/index.html을 hub/README.md "서비스 지도" 주소(url)에, shots/는 files로.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createJiti } from "jiti";

const ROOT = process.cwd();
const OUT_DIR = path.resolve("tmp/service-map");
const SHOTS = path.join(OUT_DIR, "shots");
const CAPTURE = !process.argv.includes("--no-capture");

const jiti = createJiti(import.meta.url, { alias: { "@": path.resolve("src") } });
const guide = await jiti.import(path.resolve("src/lib/guide/content.ts"));
const { copy } = await jiti.import(path.resolve("src/lib/copy.ts"));
const doorsLib = await jiti.import(path.resolve("src/lib/doors.ts"));
const ko = copy.ko;
const en = copy.en;
const fill = (text) =>
  text.replace(/\{ui:([a-zA-Z0-9]+)\}/g, (_, key) => (typeof ko[key] === "string" ? ko[key] : typeof en[key] === "string" ? en[key] : key));

// ── 그림: 사용법 칸(guide) · 새로워진 점(wn) · 웹 창구 캡처(web) ─────────────────────────────
fs.mkdirSync(SHOTS, { recursive: true });
const usedFiles = new Set();
function copyShot(src, name) {
  const from = path.join(ROOT, src);
  if (!fs.existsSync(from)) return null;
  const rel = `shots/${name}`;
  fs.copyFileSync(from, path.join(OUT_DIR, rel));
  usedFiles.add(rel);
  return rel;
}
// ── 스크린샷 모음(hub/SHOTS.md): tmp/shots/plan.json(scripts/shots-plan.mjs)과 내려받은 그림 tmp/shots/img/<assetId>.* ──
// 고른 그림(picks)은 그 사용법 칸 그림을 바꾸고, 칸마다 자동으로 고른 장면은 한국어 화면이 대표·다른 언어 조합은 보조(alts).
const SHOT_DIR = path.join(ROOT, "tmp/shots");
const plan = fs.existsSync(path.join(SHOT_DIR, "plan.json")) ? JSON.parse(fs.readFileSync(path.join(SHOT_DIR, "plan.json"), "utf8")) : null;
const shotRows = {};
if (plan && fs.existsSync(path.join(SHOT_DIR, "db/shots")))
  for (const f of fs.readdirSync(path.join(SHOT_DIR, "db/shots"))) if (f.endsWith(".json")) shotRows[f.slice(0, -5)] = JSON.parse(fs.readFileSync(path.join(SHOT_DIR, "db/shots", f), "utf8"));
const COMBO = { ko: "ja 학습 · ko 앱", ja: "en 학습 · ja 앱", ar: "es 학습 · ar 앱" };
const needs = [];
/** 모음의 그림 하나를 지도 묶음으로(내려받은 파일이 있을 때만). */
function galleryImg(id) {
  const row = shotRows[id];
  if (!row) return null;
  const dir = path.join(SHOT_DIR, "img");
  const file = fs.existsSync(dir) ? fs.readdirSync(dir).find((f) => f.startsWith(`${row.assetId}.`)) : null;
  if (file) return copyShot(path.relative(ROOT, path.join(dir, file)), `m-${row.assetId}${path.extname(file)}`);
  // 이 작업 공간에서 찍은 그림이면 원본 파일 그대로(내려받기 생략).
  if (row.file && fs.existsSync(path.join(ROOT, row.file))) return copyShot(row.file, `m-${row.assetId}${path.extname(row.file)}`);
  return null;
}
const altsOf = (ids) =>
  ids.map((id) => ({ img: galleryImg(id), label: COMBO[shotRows[id]?.lang] || shotRows[id]?.lang || "다른 조합" })).filter((a) => a.img);
function galleryStep(id, alts = [], why = "스크린샷 모음") {
  const row = shotRows[id];
  const img = galleryImg(id);
  if (!row || !img) return null;
  return { heading: row.title, body: [`${COMBO[row.lang] || row.lang || ""} · ${row.date}`], img, alts: altsOf(alts), from: why };
}

/** 사용법 칸 하나 → 그림·제목·글. 사용자가 그 칸에 고른 그림이 있으면 그것. */
function step(id) {
  const section = guide.guideSection(guide.GUIDE_KO, id);
  if (!section) throw new Error(`사용법 칸 없음: ${id}`);
  const picked = plan?.sections?.[id];
  const pickedImg = picked ? galleryImg(picked) : null;
  const img = pickedImg ?? (section.shot ? copyShot(`public/guide/ko/${section.shot}.webp`, `g-${section.shot}.webp`) : null);
  const heading = fill(section.heading).replace(/^\d+\.\s*/, "");
  if (!img) needs.push({ key: id, label: heading });
  return { heading, body: section.body.map(fill), img, from: pickedImg ? `사용법 ${id} · 고른 그림` : `사용법 ${id}` };
}
const wn = (version, shot, heading, body) => ({
  heading,
  body: [body],
  img: copyShot(`public/whats-new/${version}/ko/${shot}.webp`, `wn-${version}-${shot}.webp`),
  from: `새로워진 점 ${version}`,
});
const extra = (src, name, heading, body) => ({ heading, body: [body], img: copyShot(src, name), from: "그림" });

// 웹 창구는 운영 주소를 찍는다.
const WEB_TARGETS = [
  { name: "web-moyeo", url: "https://call.languagebank.net/" },
  { name: "web-moyeo-app", url: "https://call.languagebank.net/?screen=rooms" },
  { name: "web-pingo", url: "https://www.languagebank.net/door/random-chat" },
  { name: "web-pingo-app", url: "https://www.languagebank.net/?door=random-chat&screen=people" },
  { name: "web-app", url: "https://www.languagebank.net/" },
  { name: "web-whatsnew", url: "https://www.languagebank.net/", keepSheet: true },
];
if (CAPTURE) {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  for (const target of WEB_TARGETS) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      locale: "ko-KR",
      isMobile: true,
      hasTouch: true,
    });
    await context.addInitScript((keepSheet) => {
      try {
        localStorage.setItem("appUiLocale", "ko");
        localStorage.setItem("appTargetLanguage", "en");
        if (!keepSheet) localStorage.setItem("whatsNewSeenVersion", "99.0");
      } catch {}
    }, Boolean(target.keepSheet));
    const page = await context.newPage();
    try {
      await page.goto(target.url, { waitUntil: "networkidle", timeout: 45000 });
      await page.waitForTimeout(2500);
      await page.screenshot({ path: path.join(SHOTS, `${target.name}.jpg`), type: "jpeg", quality: 78 });
      console.log(`찍음 ${target.name} ← ${target.url}`);
    } catch (error) {
      console.warn(`못 찍음 ${target.name}: ${String(error.message).split("\n")[0]}`);
    }
    await context.close();
  }
  await browser.close();
}
const web = (name, heading, body) => {
  const rel = `shots/${name}.jpg`;
  const ok = fs.existsSync(path.join(OUT_DIR, rel));
  if (ok) usedFiles.add(rel);
  return { heading, body: [body], img: ok ? rel : null, from: "운영 주소 캡처" };
};

// ── 코드 영역: hub/STRUCTURE.md 자동 부분 ──────────────────────────────────────────────
const structure = fs.readFileSync(path.join(ROOT, "hub/STRUCTURE.md"), "utf8");
const areas = {};
for (const block of structure.split(/\n(?=### )/)) {
  const head = block.match(/^### (.+?) `(\w+)`/);
  if (!head) continue;
  const line = (label) => (block.match(new RegExp(`^- ${label}: (.+)$`, "m")) || [, ""])[1];
  const names = (text) => [...text.matchAll(/`([^`]+)`(\([^)]*\))?/g)].map((m) => m[1]);
  areas[head[2]] = { title: head[1], screens: names(line("화면")), apis: names(line("API")), pages: names(line("웹 페이지")) };
}

// ── 창구 정보: src/lib/doors.ts ─────────────────────────────────────────────────────────
const door = (id) => {
  const d = doorsLib.doorById(id);
  return { host: `${d.host}.languagebank.net`, name: d.name, headline: d.copy.ko.headline, features: d.copy.ko.features.map(([t, b]) => `${t} — ${b}`) };
};
const moyeo = door("group-call");
const pingo = door("random-chat");
const spin = door("random-meet");

// ── 칸(node) ───────────────────────────────────────────────────────────────────────────
// tier: entry(웹·스토어) · shell(앱 틀) · tab(하단 탭, children) · anywhere(어디서나)
// links: 누르면 같이 밝아지는 칸(들어가면 닿는 곳·같이 쓰는 곳)
const nodes = [
  // 유입 창구
  {
    id: "moyeo", tier: "entry", kind: "door", tone: "moyeo",
    title: moyeo.name, sub: `단체통화 · ${moyeo.host}`, area: "web", status: "열림",
    summary: `겉은 따로인 단체통화 서비스, 속은 같은 앱이에요. 소개 페이지 “${moyeo.headline}”에서 들어가면 앱이 창구 모드(첫 화면 Room, 하단 Room·대화·My)로 열려요.`,
    points: [...moyeo.features, "계정·구독·기록은 본 앱과 하나. 검색어: 단체통화·외국인 음성 채팅"],
    path: "call.languagebank.net → 지금 방 둘러보기 → Room 로비",
    links: ["room", "talk", "my"],
    steps: [web("web-moyeo", "소개 페이지", "검색으로 들어오는 첫 화면. 지금 열린 방 수를 60초마다 보여 줘요(사람·방 이름은 싣지 않음)."), web("web-moyeo-app", "창구 모드 앱", "같은 앱이 Moyeo 이름표를 달고 Room부터 열려요(하단 Room·대화·My). 처음 온 사람에게는 로그인 카드가 먼저 보여요.")],
  },
  {
    id: "pingo", tier: "entry", kind: "door", tone: "pingo",
    title: pingo.name, sub: `1:1 대화 · ${pingo.host}`, area: "web", status: "열림",
    summary: `랜덤채팅 검색으로 들어오는 1:1 대화 창구예요. 무작위 연결 없이, 지금 접속한 사람(내 말 배우는 사람 먼저)을 보고 골라 요청하고 상대가 수락하면 대화가 열려요.`,
    points: [...pingo.features, "2단계 ‘본인인증 바로 연결’은 인증 업체 계약 뒤"],
    path: "talk.languagebank.net → 지금 접속한 사람 보기 → 사람(🟢 지금 접속 중)",
    links: ["people", "dm", "talk"],
    steps: [web("web-pingo", "소개 페이지", "검색으로 들어오는 첫 화면. 지금 접속한 사람 수만 보여 줘요."), web("web-pingo-app", "창구 모드 앱", "Pingo 이름표로 사람 탭부터 열리고(하단 사람·대화·My), 로그인하면 ‘🟢 지금 접속 중’ 거르기로 보여요.")],
  },
  {
    id: "spin", tier: "entry", kind: "door", tone: "spin",
    title: spin.name, sub: `랜덤 채팅·영상 · ${spin.host}`, area: "random", status: "스위치 꺼짐",
    summary: `본인인증한 성인끼리 랜덤으로 이어 주는 채팅·영상통화 창구예요(웹만, 앱에는 없음). 소개 페이지 “${spin.headline}”에서 들어가면 창구 모드로 🎲 랜덤 탭부터 열려요.`,
    points: [...spin.features, "서버 스위치 RANDOM_ENABLED가 꺼져 있으면 ‘준비 중’", "켜지면 Pingo 사람 탭 위에 Spin으로 가는 줄", "켜기 전 사람 일: 사업자·본인인증 계약·법률 확인·도메인"],
    path: "spin.languagebank.net → 랜덤 시작하기 → 🎲 랜덤",
    links: ["pingo", "talk", "my"],
    steps: [],
  },
  {
    id: "webapp", tier: "entry", kind: "web",
    title: "웹 앱", sub: "www.languagebank.net", area: "shell",
    summary: "설치 없이 브라우저에서 쓰는 같은 앱이에요. main에 push하면 Vercel이 바로 배포해서, 앱 빌드 없이 가장 먼저 바뀌는 곳이에요.",
    points: ["AI 기능(채팅·통화·영상·My)은 로그인 없이, 사람·Room·메시지는 로그인해야", "광고는 목록 자리에 AdSense만(Vercel 값 넣기 전엔 꺼짐)", "업데이트 뒤 첫 실행에 ‘새로워진 점’"],
    path: "www.languagebank.net → 대화 탭",
    links: ["shell", "talk"],
    steps: [web("web-app", "첫 화면", "하단 탭 대화부터 열려요. 맨 위가 AI 튜터 줄, 로그인하면 그 아래 단체방·1:1이 보여요.")],
  },
  {
    id: "invite", tier: "entry", kind: "web",
    title: "친구 초대 링크", sub: "languagebank.net/invite", area: "invite",
    summary: "사람 탭의 ➕ 친구 초대로 만든 링크예요. 받은 사람이 앱을 열면 초대 환영 화면이 뜨고, 일주일 안에 이틀 이상 쓰면 둘 다 포인트를 받아요.",
    points: ["데려온 친구가 늘면 플러스·프리미엄 기간 보상", "보상 진행은 My의 🎁 초대 보상 카드에서"],
    path: "사람 → ➕ 친구 초대 → 링크 공유 → (받은 사람) 앱 열기 → 초대 환영",
    links: ["people", "shell"],
    steps: [step("people.invite"), step("people.rewards")],
  },
  {
    id: "stores", tier: "entry", kind: "store",
    title: "스토어 앱", sub: "Google Play · App Store(TestFlight)", area: "shell",
    summary: "안드로이드는 Play 2.68 공개, 2.70은 빌드·내부 테스트 대기예요. iOS는 TestFlight 2.70 — 사람 기능(대화·사람·Room·메시지) 없는 1차라 하단이 채팅·통화·영상 학습·My예요.",
    points: ["앱 ID com.yourname.englishchat (바꿀 수 없음)", "Play 업로드·서명은 사람이, Claude는 파일과 PR까지", "광고(AdMob)는 무료 안드로이드만"],
    path: "Play/App Store 설치 → 앱 열기",
    links: ["shell"],
    steps: [extra("store-shots/feature/featureGraphic.png", "store-feature.png", "Play 대표 그림", "스토어 등록정보의 대표 그림이에요.")],
  },

  // 앱 틀
  {
    id: "shell", tier: "shell",
    title: "상단바 · 앱 틀", sub: "언어 · 포인트 · ? 사용법 · 💬 의견", area: "shell",
    summary: "어느 탭에서나 위에 있는 줄이에요. 학습 언어·화면 언어를 바꾸고, 포인트/플랜을 누르면 결제 화면, ?는 지금 탭의 사용법 칸, 💬는 의견 보내기예요. 업데이트 뒤 첫 실행에 ‘새로워진 점’이 그림과 함께 한 번 떠요.",
    points: ["앱 열기 → AI 동의(iOS만) → 새로워진 점 → 초대 환영(초대로 왔을 때)", "학습 언어·화면 언어 각 14개", "업데이트 배너: 2.67부터 폰이 Play에 직접 물어 봄"],
    path: "모든 화면 맨 위",
    links: ["billing", "feedback"],
    steps: [web("web-whatsnew", "새로워진 점", "업데이트하고 처음 열면 바뀐 기능을 그림으로 보여 주고 ‘써보기’로 그 화면에 가요."), wn("2.68", "account", "계정", "로그인하면 사람·Room·메시지를 쓸 수 있어요.")],
  },
  {
    id: "billing", tier: "shell",
    title: "결제 · 포인트 · 광고", sub: "무료 · 라이트 · 플러스 · 프리미엄", area: "billing",
    summary: "상단 포인트/플랜이나 한도 안내에서 열리는 결제 화면이에요. 요금마다 하루 채팅 수와 자유 통화 분이 다르고, 넘으면 구매 포인트를 써요. 광고는 무료 사용자에게만 붙어요.",
    points: ["채팅 하루: 무료 7 / 라이트 30 / 플러스 50 / 프리미엄 100", "자유 통화 하루: 7 / 10 / 15분(오늘의 팩 별도, 이월 없음)", "8,900원만 이달의 영상 전체·추가 팩", "광고: 전면은 끝나는 자리에만, 채팅·통화·Room 안에는 없음"],
    path: "상단 포인트/플랜 → 결제 화면",
    links: ["shell", "chat", "call"],
    steps: [],
  },
  {
    id: "feedback", tier: "shell",
    title: "의견 보내기", sub: "💬 → 의견함 → 반영 소식", area: "feedback",
    summary: "상단 💬로 글과 사진을 보내면 의견함에 모이고, 사용자가 ‘반영’으로 고른 것만 고쳐요. 고쳐지면 보낸 사람에게 전·후 그림으로 반영 소식이 가요.",
    points: ["보낸 의견은 90일 보관(학습자 문장 중 유일한 예외)", "같은 의견은 한 번에 묶어 알림"],
    path: "상단 💬",
    links: ["shell"],
    steps: [],
  },

  // 하단 탭
  {
    id: "talk", tier: "tab", tab: "대화",
    title: "대화", sub: "첫 화면 · AI 튜터 줄 + 사람과의 대화", area: "talk",
    summary: "앱의 첫 화면이에요. 맨 위에 AI 튜터 줄이 고정되고(줄 → AI 채팅, 📞 → AI 통화), 아래로 단체방과 1:1 메시지가 이어져요.",
    points: ["채팅·통화를 열면 위에 ‘‹ 대화’, 하단은 대화가 켜진 채", "안 읽은 메시지 수 표시"],
    path: "하단 대화",
    links: ["chat", "call", "dm", "groups"],
    steps: [step("talk.list")],
    children: ["chat", "call", "dm", "groups"],
  },
  {
    id: "chat", tier: "child", parent: "talk",
    title: "AI 채팅", sub: "고쳐 주는 튜터", area: "chat",
    summary: "입력창 하나로 대화해요. 배우는 언어로 쓰면 틀린 점을 고쳐 주며 이어가고, 편한 말로 쓰면 튜터는 배우는 언어로 답하고 ‘표현 보기’로 표현 카드를 불러와요. 수준(A1·B2)은 보여 주지 않아요.",
    points: ["채팅 차감은 보낸 메시지 수(언어 상관없음)", "문장마다 ‘분석’ → 문장분석 시트"],
    path: "대화 → AI 튜터 줄",
    links: ["sheet", "learner", "billing"],
    steps: ["chat.next", "chat.talk", "chat.stuck", "chat.meaning", "chat.analyse", "chat.words", "chat.menu", "chat.history"].map(step),
  },
  {
    id: "call", tier: "child", parent: "talk",
    title: "AI 통화 · 오늘의 팩", sub: "말하고 돌아보기", area: "call",
    summary: "튜터와 소리로 말해요. 말이 끝나면 받아쓰고 튜터가 이어 말하며, 통화가 끝나면 돌아보기에서 내 문장을 고쳐 보고 다시 말해 봐요. 오늘의 팩은 상황 하나를 짧게 연습하는 묶음이에요.",
    points: ["자유 통화 하루 7 / 10 / 15분", "무료 오늘의 팩 7일에 2번", "통화 안에는 광고 없음, 끝나면 전면 광고"],
    path: "대화 → AI 튜터 📞",
    links: ["learner", "sheet", "billing"],
    steps: ["call.pack", "call.talk", "call.review", "call.ownline"].map(step),
  },
  {
    id: "dm", tier: "child", parent: "talk",
    title: "1:1 메시지", sub: "요청 → 수락 · 📞 영상통화", area: "talk",
    summary: "사람 탭이나 Room에서 메시지를 요청하고 상대가 수락하면 열려요. 남의 줄을 누르면 번역, 낱말을 골라 ‘무슨 뜻이에요?’로 물을 수 있어요. 📞는 둘만의 비공개 Room(카메라는 기본 꺼짐).",
    points: ["대화는 마지막 메시지로부터 30일 보관", "차단·신고 바로"],
    path: "사람 → 프로필 → 메시지 / 대화 목록의 1:1 줄",
    links: ["people", "room", "pingo"],
    steps: [step("messages.dm"), extra("public/guide/ko/rooms-dm.webp", "g-rooms-dm.webp", "1:1 대화 화면", "줄을 눌러 번역하고, 묻고 싶은 낱말을 골라 물어요."), wn("2.68", "dm", "메시지 요청", "처음엔 요청으로 가고, 상대가 받으면 대화가 열려요.")],
  },
  {
    id: "groups", tier: "child", parent: "talk",
    title: "단체방 · 팀", sub: "여럿이 · 워크스페이스", area: "talk",
    summary: "여럿이 쓰는 대화방이에요. 팀이면 ‘대화 | 워크스페이스’로 나뉘고, 📞 단체방 통화는 비공개 Room으로 열려요. Room에서 👥로 그 방 사람들과 단체방을 만들 수도 있어요.",
    points: ["러닝메이트·팀 줄은 My에서도 열림"],
    path: "대화 → 단체방 / + 단체방",
    links: ["room", "my"],
    steps: [step("messages.groups"), wn("2.69", "team", "팀 워크스페이스", "팀이 같이 모은 표현과 할 일을 한곳에서 봐요.")],
  },
  {
    id: "video", tier: "tab", tab: "영상 학습",
    title: "영상 학습", sub: "이달의 영상 · 자막 · 문장 바", area: "video",
    summary: "이달의 영상을 고르거나 링크를 넣으면 배우는 언어 자막이 깔리고, 지금 문장이 아래 문장 바에 떠요. 문장을 누르면 문장분석, 점을 끌어 부분만 골라 물을 수 있어요.",
    points: ["iOS는 라이브러리만", "영상을 몇 분 보고 나오면 전면 광고(무료 안드로이드)"],
    path: "하단 영상 학습",
    links: ["sheet", "learner"],
    steps: ["video.library", "video.subtitles", "video.bar", "video.ask"].map(step),
  },
  {
    id: "people", tier: "tab", tab: "사람",
    title: "사람", sub: "프로필 목록 · 게시판 · 친구 초대", area: "people",
    summary: "배우는 말과 쓰는 말이 맞는 사람을 찾아요. 칩으로 [사람 | 게시판]을 바꾸고, 프로필 시트에서 팔로우·메시지·메이트 신청·차단·신고를 해요.",
    points: ["로그인해야 보임", "Pingo로 오면 ‘🟢 지금 접속 중’ 거르기로 열림"],
    path: "하단 사람",
    links: ["dm", "invite", "pingo"],
    steps: [step("people.find"), step("people.board")],
    children: ["board", "rewards"],
  },
  {
    id: "board", tier: "child", parent: "people",
    title: "게시판", sub: "글 · 사진 1장 · 답글", area: "people",
    summary: "학습자끼리 글과 사진을 올리고 댓글·답글(한 단계)을 달아요.",
    points: ["맨 위 글을 지우면 답글도 같이"],
    path: "사람 → 게시판 칩",
    links: ["people"],
    steps: [step("people.board"), wn("2.69", "board", "게시판", "새로 생긴 게시판이에요.")],
  },
  {
    id: "rewards", tier: "child", parent: "people",
    title: "친구 초대 · 보상", sub: "➕ 초대 · 🎁 보상", area: "invite",
    summary: "초대 링크를 보내고, 친구가 쓰기 시작하면 둘 다 포인트를 받아요. 진행은 보상 카드에 숫자로 보여요.",
    points: [],
    path: "사람 → ➕ 친구 초대 / My → 🎁 초대 보상",
    links: ["invite", "my"],
    steps: [step("people.invite"), step("people.rewards")],
  },
  {
    id: "room", tier: "tab", tab: "Room",
    title: "Room", sub: "말하는 방 · 최대 8명", area: "room",
    summary: "로비에서 방을 골라 들어가요. 자리 8칸에 앉으면 말하고, 아니면 듣거나 댓글만 해도 돼요. 말은 자막으로 바로 뜨고(말 시작하면 ‘…’ 말풍선), 줄을 눌러 번역·인용·묻기를 해요.",
    points: ["보는 방식: 대화 / 사람별 / 채팅 위주 / 통화 위주", "방장이 자리를 올리고 내림", "Moyeo로 오면 여기가 첫 화면"],
    path: "하단 Room → 방 카드",
    links: ["moyeo", "groups", "dm"],
    steps: [extra("public/guide/ko/rooms-room.webp", "g-rooms-room.webp", "방 안", "자리·듣는 줄·자막·댓글이 한 화면에 있어요."), ...["room.find", "room.layouts", "room.quote", "room.stuck", "room.host"].map(step)],
  },
  {
    id: "my", tier: "tab", tab: "My",
    title: "My", sub: "계정 · 자라는 중 · 단계 대본", area: "my",
    summary: "학습 상태를 누적 기록으로 보여 주는 곳이에요. 맨 위 계정 카드와 초대 보상, 오늘 해볼 것, 여섯 부분이 자라는 모습, 내 표현과 노트가 이어져요. 지도가 없으면 체크 3질문으로 시작해요.",
    points: ["수준(레벨)은 보여 주지 않음", "배우는 언어마다 따로 저장"],
    path: "하단 My",
    links: ["learner", "groups", "rewards"],
    steps: ["my.start", "my.next", "my.ask"].map(step),
    children: ["growth", "notes"],
  },
  {
    id: "growth", tier: "child", parent: "my",
    title: "자라는 중 · 지도", sub: "망 | 그래프 | 지도", area: "my",
    summary: "여섯 부분이 쓸수록 커지고 줄지 않아요. 보는 방식을 망·그래프·지도 중에 고르고, 부분을 누르면 키운 표현과 ‘키우기’ 연습, 지도에서는 주제별 미션을 해요.",
    points: ["고른 보기는 기기에 기억"],
    path: "My → 자라는 중",
    links: ["learner", "chat", "call"],
    steps: ["my.growth", "my.graph", "my.element", "my.map"].map(step),
  },
  {
    id: "notes", tier: "child", parent: "my",
    title: "노트 · 단어장", sub: "장 8 × 주제 3", area: "my",
    summary: "내 표현·단어·문장분석에서 물은 것이 8개 장 주제별로 모여요. 검색하고, 주제마다 연습하고, 단어장 줄을 누르면 단어장이 열려요.",
    points: ["단어장은 하단 탭에서 빠지고 노트 안으로(2026-10-19)"],
    path: "My → 노트",
    links: ["sheet", "learner"],
    steps: ["my.notes", "words.find", "words.saved", "words.learn", "words.script"].map(step),
  },

  // 어디서나
  {
    id: "sheet", tier: "anywhere",
    title: "문장분석 · 표현 시트", sub: "채팅 · 통화 · 영상 · 노트에서", area: "sheet",
    summary: "어느 화면의 문장이든 ‘분석’을 누르면 아래에서 올라오는 시트예요. 문장 구조와 뜻, 점을 끌어 고른 부분에 대한 질문, 단어 뜻과 듣기가 있어요.",
    points: ["AI 도움 하루 한도: 무료 20 · 라이트 100 · 플러스 150 · 프리미엄 300"],
    path: "문장 → 분석",
    links: ["chat", "call", "video", "notes"],
    steps: ["chat.analyse", "chat.meaning", "video.ask", "chat.words"].map(step),
  },
  {
    id: "learner", tier: "anywhere",
    title: "오늘 해볼 것 · 표현 장부", sub: "여러 탭이 같이 씀", area: "learner",
    summary: "쌓인 기록으로 지금 할 것 하나를 권하는 카드와, 모든 탭에서 만난 표현이 쌓이는 장부예요. 채팅·통화 첫 화면과 My 맨 위에 같이 나와서, 바꾸면 세 곳을 다 봐야 해요.",
    points: ["표현의 세 상태: 숙지 / 배운 것 / 알아야 할 것", "학습자 문장은 서버에 저장하지 않음(표현만)"],
    path: "채팅·통화 첫 화면 / My 맨 위",
    links: ["chat", "call", "my", "growth"],
    steps: [step("my.next"), step("chat.next"), extra("public/guide/ko/ledger.webp", "g-ledger.webp", "표현 장부", "모든 탭에서 만난 표현이 상태별로 쌓여요.")],
  },
];

// 확인: links·children이 실제 칸을 가리키는지.
const ids = new Set(nodes.map((n) => n.id));
for (const n of nodes) for (const ref of [...(n.links || []), ...(n.children || [])]) if (!ids.has(ref)) throw new Error(`${n.id} → 없는 칸 ${ref}`);
for (const n of nodes) {
  n.steps = n.steps.filter(Boolean);
  // 이 칸에 고른 대표 그림(node.<칸>)은 맨 앞, 모음에서 자동으로 고른 장면은 뒤에(한국어 대표 + 보조).
  const picked = plan?.sections?.[`node.${n.id}`];
  const lead = picked ? galleryStep(picked, [], "고른 대표 그림") : null;
  const auto = (plan?.nodes?.[n.id] ?? []).filter((sc) => sc.primary !== picked).map((sc) => galleryStep(sc.primary, sc.alts)).filter(Boolean);
  n.steps = [...(lead ? [lead] : []), ...n.steps, ...auto];
  if (!n.steps.some((s) => s.img)) needs.push({ key: `node.${n.id}`, label: `${n.title} (칸 전체)` });
  const area = areas[n.area];
  n.code = area ? { id: n.area, title: area.title, screens: area.screens, apis: area.apis, pages: area.pages } : null;
}

// 지난 실행에서 남은, 이번에 안 쓰는 그림은 지운다(올릴 묶음을 가볍게).
for (const file of fs.readdirSync(SHOTS)) if (!usedFiles.has(`shots/${file}`)) fs.rmSync(path.join(SHOTS, file));

let commit = "";
try {
  commit = execFileSync("git", ["log", "-1", "--format=%h %cd", "--date=format:%Y-%m-%d"], { cwd: ROOT, encoding: "utf8" }).trim();
} catch {}
let apiCount = 0;
for (const a of Object.values(areas)) apiCount += a.apis.length;

// ── 갱신 기록: hub/service-map.json(칸마다 지문 + 바뀐 것 기록) ─────────────────────────
// 예약 작업 "서비스 지도 갱신"이 매일 이 스크립트를 돌린다. 칸의 글·그림(저장소 그림은 파일 내용,
// 운영 캡처는 글만 — 열린 방 수처럼 매번 달라지는 화면은 세지 않음)·코드 영역이 바뀌면 그 칸을 기록한다.
const SNAPSHOT = path.join(ROOT, "hub/service-map.json");
const hashOf = (value) => createHash("sha1").update(value).digest("hex").slice(0, 12);
const fileHash = (rel) => (rel && !rel.startsWith("shots/web-") && fs.existsSync(path.join(OUT_DIR, rel)) ? hashOf(fs.readFileSync(path.join(OUT_DIR, rel))) : "");
function fingerprint(n) {
  return {
    title: n.title,
    text: hashOf(JSON.stringify([n.title, n.sub, n.summary, n.points, n.path, n.status ?? "", n.steps.map((s) => [s.heading, s.body])])),
    // 운영 캡처는 찍혔는지와 상관없이 같게 센다(찍기가 한 번 실패해도 "바뀜"으로 보이지 않게).
    shots: hashOf(JSON.stringify(n.steps.map((s) => (s.from === "운영 주소 캡처" ? "web" : s.img ? `${s.img}:${fileHash(s.img)}` : "")))),
    links: hashOf(JSON.stringify([n.links ?? [], n.children ?? []])),
    code: hashOf(JSON.stringify(n.code ?? null)),
  };
}
const PART_NAME = { text: "설명", shots: "그림", links: "이어진 칸", code: "코드 영역" };
let previous = null;
try {
  previous = JSON.parse(fs.readFileSync(SNAPSHOT, "utf8"));
} catch {}
const now = new Date();
const kst = new Date(now.getTime() + 9 * 3600e3).toISOString().replace("T", " ").slice(0, 16);
const current = Object.fromEntries(nodes.map((n) => [n.id, fingerprint(n)]));
const changes = [];
if (previous?.nodes) {
  for (const n of nodes) {
    const before = previous.nodes[n.id];
    if (!before) {
      changes.push({ id: n.id, title: n.title, what: "새 칸" });
      continue;
    }
    const parts = Object.keys(PART_NAME).filter((k) => before[k] !== current[n.id][k]).map((k) => PART_NAME[k]);
    if (parts.length) changes.push({ id: n.id, title: n.title, what: parts.join(" · ") });
  }
  for (const [id, before] of Object.entries(previous.nodes)) if (!current[id]) changes.push({ id, title: before.title, what: "빠짐" });
} else {
  changes.push({ id: "", title: "처음 기록", what: `칸 ${nodes.length}개` });
}
// 지도에 아직 없는 것: 사용법 칸(그 밖에·옛 칸 제외)과 코드 영역 중 어느 칸도 안 쓰는 것, 창구(doors.ts) 중 칸이 없는 것.
const usedSections = new Set(nodes.flatMap((n) => n.steps.map((s) => s.from.replace(/^사용법 /, ""))));
const missing = {
  guide: guide.GUIDE_CHAPTERS.flatMap((c) => c.sections).filter((id) => !id.endsWith(".more") && !usedSections.has(id) && guide.guideSection(guide.GUIDE_KO, id)?.shot),
  areas: Object.keys(areas).filter((id) => !["ops", "account", "web"].includes(id) && !nodes.some((n) => n.area === id)),
  doors: doorsLib.DOORS.map((d) => d.id).filter((id) => !["group-call", "random-chat", "random-meet"].includes(id)),
};
const captured = CAPTURE ? WEB_TARGETS.filter((t) => fs.existsSync(path.join(SHOTS, `${t.name}.jpg`))).length : null;
const history = [...(previous?.history ?? [])];
if (changes.length) history.unshift({ at: kst, commit: commit.split(" ")[0], changes });
const snapshot = {
  _: "서비스 지도 갱신 기록. scripts/service-map.mjs가 쓴다(손으로 고치지 않음). 칸이 바뀐 날만 history에 한 줄.",
  checkedAt: kst,
  commit: commit.split(" ")[0],
  nodes: current,
  history: history.slice(0, 20),
};
// 바뀐 게 없으면 파일을 건드리지 않는다(매일 빈 커밋이 생기지 않게). checkedAt은 페이지에만 보인다.
if (changes.length) fs.writeFileSync(SNAPSHOT, JSON.stringify(snapshot, null, 1) + "\n");
fs.writeFileSync(path.join(OUT_DIR, "changes.json"), JSON.stringify({ checkedAt: kst, captured, changes, missing }, null, 1));
const missingCount = missing.guide.length + missing.areas.length + missing.doors.length;
if (missingCount) console.log(`지도에 없는 것 ${missingCount}: 사용법 칸 ${missing.guide.join(", ") || "-"} · 영역 ${missing.areas.join(", ") || "-"} · 창구 ${missing.doors.join(", ") || "-"}`);
console.log(changes.length ? `바뀐 칸 ${changes.length}: ${changes.map((c) => `${c.title}(${c.what})`).join(", ")}` : "바뀐 칸 없음");

const data = { nodes, commit, apiCount, builtAt: kst, history: snapshot.history, changesToday: changes.length, captured, webTotal: WEB_TARGETS.length };
// 폰 화면 지도(scripts/phone-map.mjs)가 같은 칸·그림을 쓴다.
fs.writeFileSync(path.join(OUT_DIR, "data.json"), JSON.stringify(data));
const template = fs.readFileSync(path.join(ROOT, "scripts/service-map.template.html"), "utf8");
fs.writeFileSync(path.join(OUT_DIR, "index.html"), template.replace("/*MAP_DATA*/null", JSON.stringify(data).replace(/</g, "\\u003c")));
const bytes = [...usedFiles].reduce((sum, rel) => sum + fs.statSync(path.join(OUT_DIR, rel)).size, 0);
console.log(`서비스 지도 → tmp/service-map/index.html (칸 ${nodes.length}, 그림 ${usedFiles.size}장 ${(bytes / 1e6).toFixed(1)}MB)`);
// 그림이 필요한 칸 → 스크린샷 모음 페이지 meta/plan에 Claude가 옮긴다(hub/SHOTS.md).
fs.writeFileSync(path.join(OUT_DIR, "needs.json"), JSON.stringify({ needs: [...new Map(needs.map((x) => [x.key, x])).values()], nodes: nodes.map((n) => ({ id: n.id, title: n.title })) }, null, 1));
fs.writeFileSync(path.join(OUT_DIR, "files.json"), JSON.stringify(Object.fromEntries([...usedFiles].sort().map((rel) => [rel, path.join(OUT_DIR, rel)])), null, 1));
