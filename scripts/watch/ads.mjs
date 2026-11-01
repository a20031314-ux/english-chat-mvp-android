// 광고 구조 맞추기 — 기능이 바뀌면 광고 자리가 아직 원칙(hub/ADS.md 위쪽)에 맞는지, 손익 계산이 새 흐름을 세는지 보고,
// 다시 짤 안을 숫자와 함께 낸다(사용자 2026-11-01 "광고 삽입 구조도 기능 변경에 따라 재구성하고 알려 주면"). 변경 감시가 부른다.
// 고치지 않는다 — 안은 hub/ads-plan.md·reports.md로, 바꾸는 것은 사용자가 "바꿔줘" 한 뒤(설정은 Vercel ADS_*, 자리는 앱 빌드).
//
//   node --experimental-strip-types scripts/watch/ads.mjs facts
//        코드의 광고 순간·자리·배너 탭(hub/ADS.md 자동 부분) · 손익 계산이 세는 순간(economics MODELED_MOMENTS) ·
//        이번 범위(tmp/watch/plan.json)의 화면 흐름 변화(hub/STRUCTURE.md 위쪽 diff)·바뀐 화면 파일 → tmp/watch/ads-facts.json
//   … ads.mjs estimate --format=interstitial --per-month=6          새 자리 하나: 무료 사용자 한 사람이 한 달에 n번 보면 1,000명당 월 수익(낮음·중간·높음)
//   … ads.mjs settings --ads-gap=240 [--ads-after-chats=3 …]       Vercel ADS_* 값만 바꾸면: 손익(economics) 1,000명당·무료 유형별 차이
//   … ads.mjs scenario                                              ads-plan.json의 안마다(econ 칸) 손익을 economics로 다시 계산 — 안 하나씩·모두 넣었을 때
//                                                                   1,000명당 월(전환 3%, 단가 중간)·무료 한 사람 → per1000Mid 덮어씀 + tmp/watch/ads-scenario.json
//   … ads.mjs render                                                tmp/watch/ads-plan.json(검토 에이전트가 씀) → hub/ads-plan.md, 알릴 것 → tmp/watch/ads-notify.json
//
// 알림 기준: 원칙 위반(넣지 않는 곳·흐름 도중에 뜸) · 손익 계산에서 빠진 순간이 새로 생김 · 안 하나가 1,000명당 월 ±20,000원 넘게 바꿈.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { AD_REVENUE_USD } from "../../src/lib/billing/ads.ts";
import { KRW_PER_USD } from "../../src/lib/billing/cost.ts";
import { MODELED_MOMENTS } from "../sim-users/economics.mjs";
import { numberOf, tableCells } from "./tables.mjs";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "tmp/watch");
const NODE = ["--experimental-strip-types", "--disable-warning=MODULE_TYPELESS_PACKAGE_JSON"];
export const ADS_ALERT_PER_1000 = 20_000; // 원/월, 가입자 1,000명당
const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};
const won = (n) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(Math.round(n)).toLocaleString("ko-KR")}원`;
const git = (...a) => execFileSync("git", a, { cwd: ROOT, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 }).trim();

function adsAuto() {
  const text = fs.readFileSync(path.join(ROOT, "hub/ADS.md"), "utf8");
  const auto = text.slice(text.indexOf("<!-- 자동"));
  const section = (title) => auto.split(/\n(?=### |## )/).find((s) => s.startsWith(`### ${title}`)) ?? "";
  const rows = (s) => s.split("\n").filter((l) => /^\| `/.test(l)).map((l) => l.split("|").slice(1, -1).map((c) => c.trim()));
  const moments = rows(section("전면 광고")).map(([id, when, where]) => ({ id: id.replace(/`/g, ""), when, where }));
  const native = rows(section("네이티브 광고")).map(([feed, slot, , where]) => ({ feed: feed.replace(/`/g, ""), slot: slot.replace(/`/g, ""), where }));
  const other = section("배너").split("\n").filter((l) => l.startsWith("- **"));
  return { moments, native, other };
}

function facts() {
  const ads = adsAuto();
  const plan = fs.existsSync(path.join(OUT, "plan.json")) ? JSON.parse(fs.readFileSync(path.join(OUT, "plan.json"), "utf8")) : {};
  let flowDiff = "";
  if (plan.from && plan.to) {
    try {
      flowDiff = git("diff", `${plan.from}..${plan.to}`, "--", "hub/STRUCTURE.md");
      flowDiff = flowDiff.split("\n").filter((l) => /^[+-][^+-]/.test(l) && !/## 자동/.test(l)).slice(0, 80).join("\n");
    } catch {
      flowDiff = "";
    }
  }
  const unmodeled = ads.moments.filter((m) => !MODELED_MOMENTS.includes(m.id)).map((m) => m.id);
  const screenFiles = (plan.files ?? []).filter((f) => /^src\/components\//.test(f));
  const out = { at: new Date().toISOString(), range: plan.from ? `${plan.from}..${plan.to}` : "", moments: ads.moments, native: ads.native, other: ads.other, modeled: MODELED_MOMENTS, unmodeled, screenFiles, flowDiff };
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, "ads-facts.json"), JSON.stringify(out, null, 1) + "\n");
  console.log(`전면 순간 ${ads.moments.length}(손익 계산에 없는 것 ${unmodeled.length}: ${unmodeled.join(", ") || "없음"}) · 네이티브 자리 ${ads.native.length} · 바뀐 화면 파일 ${screenFiles.length} · 흐름 변화 줄 ${flowDiff ? flowDiff.split("\n").length : 0}`);
}

function readAssume() {
  const assume = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/sim-users/economics.json"), "utf8"));
  return { fill: assume.adFillRate?.rate ?? 0.9 };
}

/** 한 사람이 한 달에 n번 보는 광고 하나의 1,000명당 월 수익(무료 사용자 기준). */
export function estimate(format, perMonth) {
  const usd = AD_REVENUE_USD[format];
  if (!usd) throw new Error(`형식 없음: ${format} (${Object.keys(AD_REVENUE_USD).join(", ")})`);
  const { fill } = readAssume();
  const at = (u) => perMonth * fill * u * KRW_PER_USD.rate * 1000;
  return { low: at(usd.low), mid: at((usd.low + usd.high) / 2), high: at(usd.high) };
}

function econ(flags) {
  return tableCells(execFileSync("node", [...NODE, "scripts/sim-users/economics.mjs", ...flags], { cwd: ROOT, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 }));
}

function settings() {
  const flags = process.argv.slice(3).filter((a) => a.startsWith("--ads-"));
  if (!flags.length) throw new Error("--ads-gap=240 처럼 economics의 --ads-* 값을 주세요");
  const base = econ([]);
  const after = econ(flags.flatMap((f) => f.split(/=(.*)/s).slice(0, 2))); // economics는 "--ads-gap 300" 꼴
  const rows = [];
  for (const [key, a] of Object.entries(base)) {
    const b = after[key];
    if (b === undefined || a === b) continue;
    if (!/^(1\.|3\.|4\.)/.test(key)) continue;
    const na = numberOf(a);
    const nb = numberOf(b);
    if (na?.unit !== "원" || nb?.unit !== "원") continue;
    rows.push({ key, before: na.value, after: nb.value, diff: nb.value - na.value });
  }
  const per1000 = rows.find((r) => /^4\..* · 광고 단가 중간 · 3%$/.test(r.key)) ?? rows.find((r) => /^4\..* · 광고 단가 중간/.test(r.key));
  console.log(JSON.stringify({ flags, per1000Mid: per1000 ?? null, rows: rows.sort((x, y) => Math.abs(y.diff) - Math.abs(x.diff)).slice(0, 12) }, null, 1));
}

/** economics를 한 번 돌려 머리 숫자 둘: 가입자 1,000명당 월(단가 중간·전환 3%), 무료 한 사람 월(중간). */
function econHead(scenario) {
  const out = execFileSync("node", [...NODE, "scripts/sim-users/economics.mjs", ...(scenario ? ["--scenario", JSON.stringify(scenario)] : [])], { cwd: ROOT, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
  const cells = tableCells(out);
  const key = Object.keys(cells).find((k) => /^4\..* · 광고 단가 중간 · 3%$/.test(k));
  const free = out.match(/무료 사용자 평균[^\n]*남는 돈 ([^ ]+)원 \/ ([^ ]+)원/);
  const num = (t) => Number(String(t).replace(/−/g, "-").replace(/[+,원\s]/g, ""));
  return { per1000: key ? numberOf(cells[key]).value : null, freePerson: free ? num(free[2]) : null };
}

const merge = (list) => ({
  extraAds: list.flatMap((e) => e.extraAds ?? []),
  my: Object.assign({}, ...list.map((e) => e.my ?? {})),
});

function scenario() {
  const file = planFile();
  const plan = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : [];
  const base = econHead(null);
  for (const p of plan) {
    if (!p.econ) continue;
    const r = econHead(merge([p.econ]));
    p.per1000Mid = r.per1000 - base.per1000;
    p.freePersonMid = r.freePerson - base.freePerson;
  }
  // 모두 넣으면: 같은 alt(서로 바꿔 끼우는 안) 중에는 1,000명당이 가장 좋은 것 하나만.
  const chosen = new Map();
  // risky(정책·원칙상 권하지 않음 — 숫자만 보여 줌)는 합계에 넣지 않는다.
  for (const p of plan.filter((x) => x.econ && !x.risky)) {
    const id = p.alt ?? p.what;
    if (!chosen.has(id) || p.per1000Mid > chosen.get(id).per1000Mid) chosen.set(id, p);
  }
  const picked = [...chosen.values()].filter((p) => p.per1000Mid > 0 || p.severity === "notify");
  const all = picked.length ? econHead(merge(picked.map((p) => p.econ))) : base;
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, "ads-plan.json"), JSON.stringify(plan, null, 1) + "\n");
  const result = { base, all, picked: picked.map((p) => p.what) };
  fs.writeFileSync(path.join(OUT, "ads-scenario.json"), JSON.stringify(result, null, 1) + "\n");
  console.log(`지금 1,000명당 ${won(base.per1000)} · 무료 한 사람 ${won(base.freePerson)} → 안 ${picked.length}개 넣으면 ${won(all.per1000)} · ${won(all.freePerson)}`);
}

/** 안 목록: 이번 실행의 tmp/watch/ads-plan.json, 없으면 지난번 것(hub/ads-plan.json — 새로 받은 저장소에서 이어 적기). */
function planFile() {
  const now = path.join(OUT, "ads-plan.json");
  return fs.existsSync(now) ? now : path.join(ROOT, "hub/ads-plan.json");
}

function render() {
  const file = planFile();
  const factsFile = path.join(OUT, "ads-facts.json");
  const plan = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : [];
  const f = fs.existsSync(factsFile) ? JSON.parse(fs.readFileSync(factsFile, "utf8")) : { unmodeled: [] };
  const notify = [];
  const lines = [
    "## 재구성 제안 (변경 감시, 자동)",
    "",
    `> 기능이 바뀐 범위 ${f.range || "—"}를 보고 광고 자리를 원칙(위쪽)과 다시 맞춘 안. ${new Date().toISOString().slice(0, 10)} · \`scripts/watch/ads.mjs\` + 검토 에이전트(\`scripts/watch/ADS-REVIEW.md\`). 바꾸는 것은 사용자가 "바꿔줘" 한 뒤 — 설정은 Vercel \`ADS_*\`(바로), 자리는 앱 빌드.`,
    "",
  ];
  if (f.unmodeled?.length) lines.push(`- **손익 계산에 안 들어간 전면 순간:** ${f.unmodeled.map((m) => `\`${m}\``).join(" · ")} — \`hub/economics.md\`의 광고 수익이 이 순간들을 세지 않음(\`economics.mjs\` simulate·MODELED_MOMENTS).`, "");
  const scFile = path.join(OUT, "ads-scenario.json");
  const sc = fs.existsSync(scFile) ? JSON.parse(fs.readFileSync(scFile, "utf8")) : null;
  if (sc) lines.push(`- **손익(\`hub/economics.md\` 계산, 가입자 1,000명당 월 · 단가 중간 · 전환 3%):** 지금 ${won(sc.base.per1000)}(무료 한 사람 ${won(sc.base.freePerson)}) → 아래 안 중 ${sc.picked.length}개(원칙 위반 고침 + 수입이 느는 것, 바꿔 끼우는 안은 좋은 쪽 하나)를 넣으면 **${won(sc.all.per1000)}**(무료 한 사람 ${won(sc.all.freePerson)}).`, "");
  if (!plan.length) lines.push("이번 범위에서 바꿀 안 없음.");
  else {
    lines.push("| 무엇 | 어디 | 왜(원칙) | 1,000명당 월(중간) | 무료 한 사람 | 바로/빌드 | 근거 |", "|---|---|---|---|---|---|---|");
    for (const p of plan) {
      const money = typeof p.per1000Mid === "number" ? won(p.per1000Mid) : "—";
      lines.push(`| ${p.severity === "notify" ? "**" : ""}${p.kind}: ${p.what}${p.severity === "notify" ? "**" : ""} | ${p.where ?? "—"} | ${p.why ?? "—"} | ${money}${p.alt ? ` (택1: ${p.alt})` : ""}${p.risky ? " (권하지 않음 — 합계 제외)" : ""} | ${typeof p.freePersonMid === "number" ? won(p.freePersonMid) : "—"} | ${p.appBuild ? "앱 빌드" : "서버 바로"} | ${p.basis ?? "—"} |`);
      if (p.severity === "notify" || (typeof p.per1000Mid === "number" && Math.abs(p.per1000Mid) >= ADS_ALERT_PER_1000)) notify.push(`${p.kind}: ${p.what}${typeof p.per1000Mid === "number" ? ` (1,000명당 월 ${won(p.per1000Mid)})` : ""}`);
    }
  }
  fs.writeFileSync(path.join(ROOT, "hub/ads-plan.md"), lines.join("\n") + "\n");
  fs.writeFileSync(path.join(ROOT, "hub/ads-plan.json"), JSON.stringify(plan, null, 1) + "\n"); // 다음 실행이 이어 적을 수 있게
  fs.writeFileSync(path.join(OUT, "ads-notify.json"), JSON.stringify(notify, null, 1) + "\n");
  console.log(`안 ${plan.length} · 알릴 것 ${notify.length} · 손익에 없는 순간 ${f.unmodeled?.length ?? 0}`);
}

const command = process.argv[2];
if (command === "facts") facts();
else if (command === "estimate") {
  const r = estimate(arg("format", "interstitial"), Number(arg("per-month", "4")));
  console.log(JSON.stringify(Object.fromEntries(Object.entries(r).map(([k, v]) => [k, Math.round(v)]))));
} else if (command === "settings") settings();
else if (command === "scenario") scenario();
else if (command === "render") render();
else if (process.argv[1]?.endsWith("ads.mjs")) {
  console.log("facts | estimate --format=… --per-month=… | settings --ads-…=… | scenario | render");
  process.exitCode = 1;
}
