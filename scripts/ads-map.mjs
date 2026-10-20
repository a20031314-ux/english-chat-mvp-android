#!/usr/bin/env node
/**
 * 광고 구조(hub/ADS.md)의 자동 부분을 코드에서 만든다.
 *
 *   npm run ads:map              자동 부분을 다시 써 넣는다
 *   npm run ads:map -- --check   자동 부분이 최신인지, 모든 광고 자리에 설명·영역이 있는지 (어긋나면 exit 1)
 *   npm run ads:map -- --places-only   광고 자리에 설명·영역이 있는지만 (CI가 모든 push에서)
 *
 * 손으로 쓰는 부분(원칙·안 넣는 곳·보류·사람 할 일)은 ADS.md의 표시 줄 위에 있고 이 스크립트는 건드리지 않는다.
 * 읽는 것: 설정·단위·단가 `src/lib/billing/ads.ts`, 앱 쪽 광고 자리(`<NativeAdSlot`, `maybeShowInterstitial(`,
 * 배너·앱 오프닝 탭 목록 `AppHome.tsx`), 영역은 `scripts/structure.json`, 손익은 `scripts/sim-users/economics.mjs`.
 * 새 전면 광고 순간(moment)에 설명이 없으면 실패한다 — 광고 자리가 문서 없이 늘지 않게.
 * 날짜·커밋 같은 바뀌는 값은 쓰지 않는다(쓸데없는 커밋 방지).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ADMOB_UNITS, AD_REVENUE_USD, DEFAULT_ADS_SETTINGS } from "../src/lib/billing/ads.ts";
import { KRW_PER_USD } from "../src/lib/billing/cost.ts";
import { PLANS, blended, options, perSignup } from "./sim-users/economics.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src");
const DOC = path.join(ROOT, "hub", "ADS.md");
const BEGIN = "<!-- 자동: scripts/ads-map.mjs가 아래를 다시 쓴다. 손으로 고치지 않는다. -->";
const END = "<!-- 자동 끝 -->";
const CHECK = process.argv.includes("--check");
const PLACES_ONLY = process.argv.includes("--places-only");

/** 전면 광고 순간 → 사람이 읽는 설명. 새 순간을 코드에 더하면 여기에도 한 줄(없으면 --check 실패). */
const MOMENTS = {
  callEnd: "AI 통화가 끝나고 돌아보기로 넘어갈 때",
  packEnd: "오늘의 팩을 끝까지 마쳤을 때",
  missionDone: "미션 하나를 마치고 \"다음\"을 눌렀을 때",
  chatLeave: "AI 채팅을 몇 번(설정 `interstitialAfterChats`) 보낸 뒤 채팅 화면을 떠나거나 대화를 끝낼 때",
  roomLeave: "공개 말하는 방에 몇 분(설정 `roomLeaveMinutes`) 넘게 있다 나올 때 — 1:1·단체방 통화는 제외",
  videoLeave: "영상을 몇 분(설정 `videoLeaveMinutes`) 넘게 보고 나올 때",
};

/** 탭 id → 화면 이름(hub/STRUCTURE.md "안에서 쓰는 이름"). */
const TAB_NAMES = { map: "My", video: "영상 학습", vocab: "단어장", talk: "대화", chat: "AI 채팅", roleplay: "통화", rooms: "Room", people: "사람" };

const rel = (p) => path.relative(ROOT, p).split(path.sep).join("/");
const walk = (dir, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
};

const structure = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts", "structure.json"), "utf8"));
function areaOf(file) {
  const id = "components/" + rel(file).replace(/^src\/components\//, "").replace(/\.tsx?$/, "");
  let best = null;
  for (const key of Object.keys(structure.assign)) {
    const hit = key.endsWith("/") ? id.startsWith(key) : id === key;
    if (hit && (!best || key.length > best.length)) best = key;
  }
  const area = best ? structure.assign[best] : null;
  return area ? { area, name: structure.areas[area] ?? area } : null;
}

/** 그 줄 바로 위의 주석(// … 또는 {/* … *\/}) — 자리 설명으로 쓴다. */
function commentAbove(lines, index) {
  for (let i = index - 1; i >= Math.max(0, index - 4); i -= 1) {
    const line = lines[i].trim();
    const block = line.match(/^\{\/\*\s*(.+?)\s*\*\/\}$/);
    if (block) return block[1];
    const slash = line.match(/^\/\/\s*(.+)$/);
    if (slash) return slash[1];
    if (line && !/^[({]|^\?|^\)|^<li|^<\/?Fragment|^\{index/.test(line)) break;
  }
  return "";
}

const problems = [];
const native = [];
const interstitial = [];
for (const file of walk(path.join(SRC, "components"))) {
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split("\n");
  lines.forEach((line, index) => {
    const slot = line.match(/<NativeAdSlot\s+feedId="([^"]+)"\s+slotKey="([^"]+)"/);
    if (slot) native.push({ feed: slot[1], slot: slot[2], file, note: commentAbove(lines, index) });
    for (const m of line.matchAll(/maybeShowInterstitial\(\s*(?:"([^"]+)"|([^,)]+))/g)) {
      const moments = m[1] ? [m[1]] : [...m[2].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
      for (const moment of moments) interstitial.push({ moment, file });
    }
  });
}
const appHome = fs.readFileSync(path.join(SRC, "components", "AppHome.tsx"), "utf8");
const tabList = (name) => [...(appHome.match(new RegExp(`const ${name}: AppTab\\[\\] = \\[([^\\]]*)\\]`))?.[1] ?? "").matchAll(/"([^"]+)"/g)].map((m) => m[1]);
const bannerTabs = tabList("BANNER_TABS");
const noAppOpenTabs = tabList("NO_APP_OPEN_TABS");
if (!bannerTabs.length) problems.push("AppHome.tsx에서 BANNER_TABS를 못 찾음");

// AdsSettings 필드 설명(타입의 /** … */)과 환경 변수(adsSettings의 env.X).
const adsSource = fs.readFileSync(path.join(SRC, "lib", "billing", "ads.ts"), "utf8");
const typeBlock = adsSource.match(/export type AdsSettings = \{([\s\S]*?)\n\};/)?.[1] ?? "";
const fieldNote = {};
for (const m of typeBlock.matchAll(/\/\*\*\s*([\s\S]*?)\s*\*\/\s*\n\s*(\w+):/g)) fieldNote[m[2]] = m[1].replace(/\s*\n\s*\*\s*/g, " ");
const fieldEnv = {};
for (const m of adsSource.matchAll(/(\w+): (?:intFrom|flagFrom)\((?:env\.(\w+)|flag)/g)) fieldEnv[m[1]] = m[2] ?? "ADS_ENABLED";

const esc = (s) => String(s).replace(/\|/g, "\\|");
const won = (usd) => `${(usd * KRW_PER_USD.rate).toFixed(usd * KRW_PER_USD.rate < 1 ? 2 : 1)}원`;
const signed = (n) => `${n < 0 ? "−" : "+"}${Math.round(Math.abs(n)).toLocaleString("ko-KR")}원`;
const where = (file) => {
  const a = areaOf(file);
  if (!a) problems.push(`${rel(file)}: scripts/structure.json에 영역이 없음`);
  return a ? `${a.name.split(" — ")[0]} \`${a.area}\`` : "(영역 없음)";
};

const out = [];
out.push("## 자동: 광고 자리 (코드에서)", "");
out.push("### 전면 광고 (건너뛰기는 AdMob이 붙임)", "", "| 순간 | 언제 | 부르는 곳 |", "|---|---|---|");
const byMoment = new Map();
for (const item of interstitial) {
  if (!byMoment.has(item.moment)) byMoment.set(item.moment, new Set());
  byMoment.get(item.moment).add(item.file);
}
for (const [moment, files] of [...byMoment].sort(([a], [b]) => a.localeCompare(b))) {
  if (!MOMENTS[moment]) problems.push(`전면 광고 순간 "${moment}"의 설명이 없음 → scripts/ads-map.mjs MOMENTS`);
  out.push(`| \`${moment}\` | ${MOMENTS[moment] ?? "(설명 없음)"} | ${[...files].sort().map((f) => `${where(f)} · \`${rel(f).replace(/^src\/components\//, "")}\``).join(" ／ ")} |`);
}
out.push("", `모든 전면 광고는 서로 ${DEFAULT_ADS_SETTINGS.interstitialMinGapSeconds / 60}분(설정 \`interstitialMinGapSeconds\`) 안에 다시 뜨지 않고, 미리 받아 둔 광고가 있을 때만 뜬다.`, "");

out.push("### 네이티브 광고 (목록 사이 앱 카드 모양)", "", "| 화면(피드) | 자리 | 설명 | 영역 · 파일 |", "|---|---|---|---|");
for (const n of [...native].sort((a, b) => a.feed.localeCompare(b.feed) || a.slot.localeCompare(b.slot))) {
  out.push(`| \`${n.feed}\` | \`${n.slot}\` | ${esc(n.note) || "—"} | ${where(n.file)} · \`${rel(n.file).replace(/^src\/components\//, "")}\` |`);
}
const feeds = new Set(native.map((n) => n.feed));
out.push("", `피드 ${feeds.size}개, 자리 ${native.length}개. 플러그인 한도: 한 피드에 광고 3개, 동시에 피드 2개 — 그래서 보이는 탭에서만 붙인다(\`NativeAdSlot\` \`active\`).`, "");

out.push("### 배너 · 앱 오프닝 · 보상형", "");
out.push(`- **배너**(하단 탭 바로 위): ${bannerTabs.map((t) => `${TAB_NAMES[t] ?? t} \`${t}\``).join(" · ")} 탭에서만 (\`AppHome.tsx\` \`BANNER_TABS\`). 시트가 열리거나 글을 쓰는 동안 숨김.`);
out.push(`- **앱 오프닝**: 앱을 켤 때·${DEFAULT_ADS_SETTINGS.appOpenAwayMinutes}분 넘게 떠났다 돌아올 때, 설치 ${DEFAULT_ADS_SETTINGS.appOpenAfterDays}일 뒤부터 ${DEFAULT_ADS_SETTINGS.appOpenGapHours}시간에 한 번. 안 띄우는 탭: ${noAppOpenTabs.map((t) => `${TAB_NAMES[t] ?? t} \`${t}\``).join(" · ")} (\`NO_APP_OPEN_TABS\`).`);
out.push(`- **보상형**: ${DEFAULT_ADS_SETTINGS.rewardedDailyMax > 0 ? `채팅 한도 안내의 "광고 보고 채팅 ${DEFAULT_ADS_SETTINGS.rewardChats}번 더", 하루 ${DEFAULT_ADS_SETTINGS.rewardedDailyMax}번(AdMob 서버 확인 \`/api/ads/ssv\`).` : `**꺼짐**(기본 하루 0번). 켜면 채팅 한도 안내에 "광고 보고 채팅 ${DEFAULT_ADS_SETTINGS.rewardChats}번 더"(AdMob 서버 확인 \`/api/ads/ssv\`).`}`, "");

out.push("## 자동: 설정 (서버 `/api/ads/config`, 앱 빌드 없이 Vercel 환경 변수로)", "", "| 설정 | 기본값 | 환경 변수 | 뜻 |", "|---|---|---|---|");
for (const [key, value] of Object.entries(DEFAULT_ADS_SETTINGS)) {
  if (!fieldEnv[key]) problems.push(`설정 ${key}의 환경 변수를 못 찾음(ads.ts adsSettings)`);
  out.push(`| \`${key}\` | ${typeof value === "boolean" ? (value ? "켬" : "끔") : value} | \`${fieldEnv[key] ?? "?"}\` | ${esc(fieldNote[key] ?? "")} |`);
}
out.push("", "구독자(라이트·플러스·프리미엄)·iOS·웹은 광고 없음 — 서버가 `enabled: false`, 앱은 `platform.ts` `adsAvailable()`.", "");

out.push("## 자동: 광고 단위 (AdMob, `ads.ts` `ADMOB_UNITS`)", "", "| 형식 | 단위 ID |", "|---|---|");
for (const [kind, id] of Object.entries(ADMOB_UNITS)) out.push(`| ${kind} | \`${id}\` |`);
out.push("");

out.push(`## 자동: 수익 가정과 손익 (1달러 ${KRW_PER_USD.rate.toLocaleString("ko-KR")}원)`, "", "| 형식 | 1번 수익 낮음 ~ 높음 |", "|---|---|");
for (const [kind, r] of Object.entries(AD_REVENUE_USD)) if (typeof r === "object") out.push(`| ${kind} | ${won(r.low)} ~ ${won(r.high)} |`);
out.push("", `출처: ${AD_REVENUE_USD.source}. AdMob 실제 eCPM이 쌓이면 \`ads.ts\` \`AD_REVENUE_USD\`를 고친다.`, "");
const o = options([], {});
const free = blended(PLANS[0], o.assume.mix.free, o);
const row = ["low", "mid", "high"].map((s) => signed(perSignup(o, o.conv, s).net * 1000));
out.push(
  `가상 사용자 손익(\`hub/economics.md\`, 결제 전환 ${Math.round(o.conv * 100)}%): 가입자 1,000명당 한 달 단가 낮음 **${row[0]}** · 중간 **${row[1]}** · 높음 **${row[2]}**.`,
  `무료 한 사람 한 달: 원가 ${signed(-free.costKrw).replace("−", "")}, 광고 ${signed(free.ad.mid).replace("+", "")}(중간) → ${signed(free.net("mid"))}.`,
  "",
);

const auto = out.join("\n").trimEnd();
const doc = fs.readFileSync(DOC, "utf8");
const start = doc.indexOf(BEGIN);
const end = doc.indexOf(END);
if (start < 0 || end < start) {
  console.error(`hub/ADS.md에 표시 줄(${BEGIN} … ${END})이 없음`);
  process.exit(1);
}
const next = `${doc.slice(0, start + BEGIN.length)}\n\n${auto}\n\n${doc.slice(end)}`;
if (problems.length) {
  console.error(problems.map((p) => `- ${p}`).join("\n"));
  process.exit(1);
}
if (PLACES_ONLY) {
  console.log(`광고 자리 ${native.length + byMoment.size}곳 모두 설명·영역 있음`);
} else if (CHECK) {
  if (next !== doc) {
    console.error("hub/ADS.md 자동 부분이 코드와 다르다 → npm run ads:map");
    process.exit(1);
  }
  console.log("광고 구조 최신");
} else {
  fs.writeFileSync(DOC, next);
  console.log(next === doc ? "hub/ADS.md 그대로" : "hub/ADS.md 갱신");
}
