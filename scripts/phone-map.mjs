/**
 * 폰 화면 지도: 서비스 지도와 같은 칸·그림을 휴대폰 화면 모양(상단바·하단 탭)으로 보여 주는 페이지.
 * 탭·버튼을 누르면 그 기능의 스크린샷과 설명이 뜨고, "실제로 열기"는 웹 앱의 그 화면(?screen=…)을 새 창에 연다.
 * 구조도로 보는 서비스 지도(hub/README.md "서비스 지도")는 그대로 두고, 이 페이지는 따로 올린다.
 *
 * 실행: npm run service-map(또는 -- --no-capture) 다음에 node scripts/phone-map.mjs
 *       → tmp/phone-map/index.html. 그림은 tmp/service-map/shots/를 같은 경로(shots/…)로 같이 올린다.
 * 올리기: Artifact 도구로 tmp/phone-map/index.html을 hub/README.md "폰 화면 지도" 주소(url)에, files는 tmp/phone-map/files.json.
 */
import fs from "node:fs";
import path from "node:path";
import { createJiti } from "jiti";

const ROOT = process.cwd();
const MAP_DIR = path.resolve("tmp/service-map");
const OUT_DIR = path.resolve("tmp/phone-map");
const dataFile = path.join(MAP_DIR, "data.json");
if (!fs.existsSync(dataFile)) {
  console.error("tmp/service-map/data.json 없음 — 먼저 npm run service-map -- --no-capture");
  process.exit(1);
}
const map = JSON.parse(fs.readFileSync(dataFile, "utf8"));
const jiti = createJiti(import.meta.url, { alias: { "@": path.resolve("src") } });
const doorsLib = await jiti.import(path.resolve("src/lib/doors.ts"));

const APP = "https://www.languagebank.net";
// 칸 → 웹 앱에서 그 화면을 여는 주소. 없는 칸(시트처럼 화면 안에서만 열리는 것)은 가장 가까운 탭.
const OPEN = {
  webapp: `${APP}/`,
  invite: `${APP}/invite`,
  stores: "https://play.google.com/store/apps/details?id=com.yourname.englishchat",
  shell: `${APP}/?screen=talk`,
  billing: `${APP}/subscribe`,
  feedback: `${APP}/?screen=talk`,
  talk: `${APP}/?screen=talk`,
  chat: `${APP}/?screen=chat`,
  call: `${APP}/?screen=chat`,
  dm: `${APP}/?screen=talk`,
  groups: `${APP}/?screen=talk`,
  video: `${APP}/?screen=video`,
  people: `${APP}/?screen=people`,
  board: `${APP}/?screen=people`,
  rewards: `${APP}/?screen=people`,
  room: `${APP}/?screen=rooms`,
  my: `${APP}/?screen=map`,
  growth: `${APP}/?screen=map`,
  notes: `${APP}/?screen=vocab`,
  sheet: `${APP}/?screen=chat`,
  learner: `${APP}/?screen=map`,
};

// 앱 탭 이름(AppHome) → 지도 칸
const TAB_NODE = { talk: "talk", chat: "chat", roleplay: "call", video: "video", people: "people", rooms: "room", map: "my", random: "spin" };
const TAB_LABEL = { talk: "대화", chat: "채팅", roleplay: "통화", video: "영상 학습", people: "사람", rooms: "Room", map: "My", random: "랜덤" };
const TAB_ICON = { talk: "talk", chat: "talk", roleplay: "call", video: "video", people: "people", rooms: "room", map: "my", random: "dice" };

// 창구: doors.ts의 하단 탭·첫 화면·주소를 그대로.
const DOOR_NODE = { "group-call": "moyeo", "random-chat": "pingo", "random-meet": "spin" };
const doors = doorsLib.DOORS.filter((d) => DOOR_NODE[d.id]).map((d) => {
  const node = DOOR_NODE[d.id];
  const base = `https://${d.host}.languagebank.net`;
  return {
    id: d.id,
    node,
    name: d.name,
    host: `${d.host}.languagebank.net`,
    start: d.start,
    tabs: d.tabs.map((t) => ({ tab: t, node: TAB_NODE[t], label: TAB_LABEL[t], icon: TAB_ICON[t], open: node === "spin" ? null : `${base}/?screen=${t}` })),
    open: node === "spin" ? null : `${base}/`,
  };
});
for (const d of doors) OPEN[d.node] = d.open;

const modes = {
  app: {
    label: "안드로이드 · 웹",
    tabs: ["talk", "video", "people", "rooms", "map"].map((t) => ({ tab: t, node: TAB_NODE[t], label: TAB_LABEL[t], icon: TAB_ICON[t], open: `${APP}/?screen=${t}` })),
  },
  ios: {
    label: "iOS 1차",
    tabs: ["chat", "video", "map"].map((t) => ({ tab: t, node: TAB_NODE[t], label: TAB_LABEL[t], icon: TAB_ICON[t], open: `${APP}/?screen=${t}` })),
  },
};

const nodes = map.nodes.map((n) => ({
  id: n.id,
  tier: n.tier,
  kind: n.kind || "",
  parent: n.parent || "",
  title: n.title,
  sub: n.sub,
  status: n.status || "",
  summary: n.summary,
  points: n.points || [],
  path: n.path || "",
  links: n.links || [],
  code: n.code ? { title: n.code.title, screens: n.code.screens.length, apis: n.code.apis.length } : null,
  steps: n.steps.map((s) => ({ heading: s.heading, body: s.body, img: s.img, from: s.from, alts: s.alts || [] })),
  open: OPEN[n.id] ?? null,
}));

const used = new Set();
for (const n of nodes) for (const s of n.steps) for (const img of [s.img, ...s.alts.map((a) => a.img)]) if (img) used.add(img);

const data = { nodes, doors, modes, builtAt: map.builtAt, commit: map.commit };
fs.mkdirSync(OUT_DIR, { recursive: true });
const template = fs.readFileSync(path.join(ROOT, "scripts/phone-map.template.html"), "utf8");
fs.writeFileSync(path.join(OUT_DIR, "index.html"), template.replace("/*PHONE_DATA*/null", JSON.stringify(data).replace(/</g, "\\u003c")));
fs.writeFileSync(
  path.join(OUT_DIR, "files.json"),
  JSON.stringify(Object.fromEntries([...used].sort().map((rel) => [rel, path.join(MAP_DIR, rel)])), null, 1),
);
console.log(`폰 화면 지도 → tmp/phone-map/index.html (칸 ${nodes.length}, 그림 ${used.size}장)`);
