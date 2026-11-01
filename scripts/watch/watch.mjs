// 변경 감시(2026-11-01 사용자 "기능 변경 후 비용·광고·퀴즈가 어떻게 바뀌는지 자동으로 알려 줘 — 기능 채팅이 다 하면 오래 걸리니 따로 두고, 알려야 할 것만 나한테").
// 예약 작업 "변경 감시"가 2시간마다 부른다. 개발 채팅은 아무것도 안 해도 된다. 고치지 않고, 재고 비교하고 알릴 것만 고른다.
//
//   node scripts/watch/watch.mjs plan      마지막으로 본 커밋(hub/watch.json last) 뒤 main의 바뀐 파일 → tmp/watch/plan.json, diff.patch
//                                          볼 것이 없으면(허브·문서만 바뀜) "nothing" — 예약 작업은 거기서 끝.
//   node scripts/watch/watch.mjs measure   지금 코드로 잼(모델·네트워크 없음, 약 1~2분) → tmp/watch/now.json
//                                          비용표(plan-cost) · 손익(economics) · 광고 지도(ads-map) 표의 모든 칸 + 퀴즈 전수 점검 원인별 수
//   node scripts/watch/watch.mjs compare   hub/watch.json 기준값과 비교 → tmp/watch/delta.json · tmp/watch/summary.md(알릴 것 notify 표시)
//   node scripts/watch/watch.mjs save      지금 값을 기준값으로(hub/watch.json — last·at·metrics) — 보고를 남긴 뒤 커밋할 때
//
// 알림 기준(사용자 2026-11-01 기본값으로 정함): 돈 칸(원)이 500원 넘게 바뀜 · 전면 광고 순간·광고 자리가 생기거나 없어짐 ·
// 퀴즈 원인이 새로 생김(0 → n) 또는 20건 넘게 늚. 그 밖의 차이는 알림 없이 보고만(아침 일일 보고가 묶음).
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { causeCounts } from "../quiz-sweep/causes.mjs";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "tmp/watch");
const STATE = path.join(ROOT, "hub/watch.json");
fs.mkdirSync(OUT, { recursive: true });
const MONEY_ALERT = 500;
const QUIZ_ALERT = 20;
const NODE = ["--experimental-strip-types", "--disable-warning=MODULE_TYPELESS_PACKAGE_JSON"];

const git = (...args) => execFileSync("git", args, { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }).trim();
const readState = () => (fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, "utf8")) : { last: "", at: "", metrics: null });
const writeJson = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 1) + "\n");

// ---------- 무엇이 바뀌었나 ----------
/** 앱·서버·점검 도구 코드만 본다(허브·문서·tmp는 보지 않음 — 감시 자신의 커밋도 여기서 빠진다). */
const watched = (file) => (file.startsWith("src/") || file.startsWith("scripts/") || file === "package.json") && !file.startsWith("scripts/watch/");

const CHECKS = {
  quiz: (f) => /^src\/(lib\/curriculum\/|components\/studyMap\/|lib\/server\/qbank|app\/api\/curriculum\/)/.test(f) || f.startsWith("scripts/quiz-sweep/"),
  money: (f) => /^src\/lib\/(billing\/|server\/(llm|modelCalls|meterRequest|entitlementStore|premiumRequest|speechModels)|aiDefaults|ads\.ts|webAds)/.test(f) || /^scripts\/(plan-cost|sim-users\/economics|ads-map)/.test(f) || /^src\/app\/api\//.test(f),
  ads: (f) => /^src\/(lib\/(ads|webAds|billing\/ads)\.ts|components\/(NativeAdSlot|WebAdSlot|AppHome)\.tsx)/.test(f) || f === "scripts/ads-map.mjs",
  screens: (f) => f.startsWith("src/components/") || f === "src/lib/copy.ts" || f.startsWith("src/lib/locales/"),
  review: (f) => f.startsWith("src/"),
};

/** 영역(작업 줄 설계의 줄 이름 — hub/drafts/lanes-2026-11-01.md)으로 대충 나눔: 보고·받은 일을 어느 쪽에 줄지. */
function laneOf(file) {
  if (/curriculum|studyMap|notes\/|notebook|stageScript|qbank|wordCards|wordExtras|frameLesson|recall/.test(file)) return "my";
  if (/roleplay|ChatWindow|chat|Call|pack|correction|tutorLanguage|video|contentDiscovery|realtime|turn\.ts|secondListen|stt/i.test(file)) return "ai";
  if (/rooms|random|invite|dm|group|board|social|presence|icon|media|identity|suspension|team/i.test(file)) return "people";
  return "공통";
}

function plan() {
  const state = readState();
  git("fetch", "--quiet", "origin", "main");
  const to = git("rev-parse", "origin/main");
  let from = state.last;
  if (from) {
    try {
      git("cat-file", "-e", `${from}^{commit}`);
    } catch {
      // 얕은 clone이라 없으면 더 받아 본다.
      try {
        git("fetch", "--quiet", "--depth=500", "origin", "main");
        git("cat-file", "-e", `${from}^{commit}`);
      } catch {
        from = "";
      }
    }
  }
  if (!from) {
    // 처음: 기준값만 만든다(비교할 것 없음).
    writeJson(path.join(OUT, "plan.json"), { first: true, from: "", to, commits: [], files: [], checks: Object.fromEntries(Object.keys(CHECKS).map((k) => [k, false])), lanes: {} });
    console.log(`first — 기준값이 없음(처음). measure → save로 기준만 만든다. main ${to.slice(0, 7)}`);
    return;
  }
  if (from === to) {
    writeJson(path.join(OUT, "plan.json"), { nothing: true, from, to });
    console.log("nothing — 새 커밋 없음");
    return;
  }
  const commits = git("log", "--format=%H%x09%an%x09%s", `${from}..${to}`).split("\n").filter(Boolean).map((line) => {
    const [sha, author, subject] = line.split("\t");
    const files = git("show", "--name-only", "--format=", sha).split("\n").filter(Boolean);
    return { sha: sha.slice(0, 7), author, subject, files: files.filter(watched) };
  });
  const files = [...new Set(commits.flatMap((c) => c.files))];
  const checks = Object.fromEntries(Object.entries(CHECKS).map(([name, test]) => [name, files.some(test)]));
  // 광고는 코드에 새 광고 순간·자리를 부르는 줄이 생겨도.
  const diff = files.length ? git("diff", `${from}..${to}`, "--", ...files) : "";
  if (/maybeShowInterstitial\(|<NativeAdSlot|<WebAdSlot/.test(diff.split("\n").filter((l) => /^[+-]/.test(l)).join("\n"))) checks.ads = true;
  const lanes = {};
  for (const file of files) (lanes[laneOf(file)] ??= []).push(file);
  // 리뷰용 diff: 테스트·데이터 큰 파일은 줄 수만, 그 밖은 내용(최대 4,000줄).
  const bigData = (f) => /\/(vocab|bank|decoys|stageScripts\/bank)\//.test(f) || /\.json$/.test(f) || /locales\//.test(f);
  const reviewFiles = files.filter((f) => f.startsWith("src/") && !bigData(f));
  const patch = reviewFiles.length ? git("diff", "-U3", `${from}..${to}`, "--", ...reviewFiles).split("\n").slice(0, 4000).join("\n") : "";
  const dataStat = files.filter(bigData).length ? git("diff", "--stat", `${from}..${to}`, "--", ...files.filter(bigData)) : "";
  fs.writeFileSync(path.join(OUT, "diff.patch"), patch + (dataStat ? `\n\n# 데이터 파일(내용 생략)\n${dataStat}\n` : ""));
  const nothing = !files.length;
  writeJson(path.join(OUT, "plan.json"), { nothing, from, to, commits, files, checks, lanes });
  if (nothing) console.log(`nothing — 커밋 ${commits.length}개가 허브·문서만 바꿈`);
  else console.log(`커밋 ${commits.length}개 · 파일 ${files.length}개 · 볼 것: ${Object.entries(checks).filter(([, v]) => v).map(([k]) => k).join(", ") || "없음"} · 줄: ${Object.keys(lanes).join(", ")}`);
}

// ---------- 재기 ----------
/** 마크다운 표의 모든 칸 → { "절 · 행 · 열": "칸 글" }. 절은 바로 앞 ## / ### 머리. */
function tableCells(markdown) {
  const cells = {};
  let section = "";
  let header = null;
  for (const line of markdown.split("\n")) {
    const heading = line.match(/^#{2,4}\s+(.*)/);
    if (heading) {
      section = heading[1].trim();
      header = null;
      continue;
    }
    if (!line.startsWith("|")) {
      header = null;
      continue;
    }
    const row = line.split("|").slice(1, -1).map((c) => c.trim());
    if (row.every((c) => /^:?-+:?$/.test(c))) continue;
    if (!header) {
      header = row;
      continue;
    }
    row.slice(1).forEach((cell, i) => {
      cells[`${section} · ${row[0]} · ${header[i + 1] ?? i + 1}`] = cell;
    });
  }
  return cells;
}

/** 칸 글에서 첫 숫자(원·%) — "⚠ -2,132원 (-86%)" → -2132, "−350원" → -350. */
function numberOf(cell) {
  const m = String(cell).replace(/−/g, "-").replace(/\*\*/g, "").match(/([+-]?\s?[\d,]+(?:\.\d+)?)\s*(원|%)?/);
  if (!m) return null;
  return { value: Number(m[1].replace(/[\s,]/g, "")), unit: m[2] ?? "" };
}

function run(cmd, args) {
  return execFileSync(cmd, args, { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] });
}

function measure() {
  const started = Date.now();
  const now = { at: new Date().toISOString(), commit: git("rev-parse", "HEAD").slice(0, 7), tables: {}, quiz: null };
  now.tables.costs = tableCells(run("node", [...NODE, "scripts/plan-cost.mjs", "--stdout"]));
  now.tables.economics = tableCells(run("node", [...NODE, "scripts/sim-users/economics.mjs"]));
  // 광고 지도는 파일에 쓰는 도구라, 쓴 뒤 읽고 원래대로 돌린다(CI가 main에서 다시 만들어 커밋함).
  const adsBefore = fs.readFileSync(path.join(ROOT, "hub/ADS.md"), "utf8");
  try {
    run("node", [...NODE, "scripts/ads-map.mjs"]);
    const ads = fs.readFileSync(path.join(ROOT, "hub/ADS.md"), "utf8");
    now.tables.ads = tableCells(ads.slice(ads.indexOf("<!-- 자동")));
  } finally {
    fs.writeFileSync(path.join(ROOT, "hub/ADS.md"), adsBefore);
  }
  // 퀴즈 전수 점검(앱 데이터만, 모델·네트워크 없음).
  const date = `watch-${now.commit}`;
  run("node", [...NODE, "scripts/quiz-sweep/sweep.ts", `--date=${date}`, "--judge=0"]);
  const marksFile = path.join(ROOT, "tmp/quiz-sweep", date, "marks.jsonl");
  const marks = fs.readFileSync(marksFile, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
  now.quiz = { causes: causeCounts(marks), marks: marksFile };
  writeJson(path.join(OUT, "now.json"), now);
  console.log(`잼: 비용표 ${Object.keys(now.tables.costs).length}칸 · 손익 ${Object.keys(now.tables.economics).length}칸 · 광고 ${Object.keys(now.tables.ads).length}칸 · 퀴즈 원인 ${Object.keys(now.quiz.causes).length}개 (${((Date.now() - started) / 1000).toFixed(0)}초)`);
}

// ---------- 비교 ----------
const DOC_NAME = { costs: "비용표(hub/costs.md)", economics: "손익(hub/economics.md)", ads: "광고 지도(hub/ADS.md)" };

function compare() {
  const state = readState();
  const now = JSON.parse(fs.readFileSync(path.join(OUT, "now.json"), "utf8"));
  const plan = fs.existsSync(path.join(OUT, "plan.json")) ? JSON.parse(fs.readFileSync(path.join(OUT, "plan.json"), "utf8")) : {};
  const base = state.metrics;
  const items = [];
  if (!base) {
    writeJson(path.join(OUT, "delta.json"), { first: true, items: [] });
    fs.writeFileSync(path.join(OUT, "summary.md"), "기준값이 없어 이번에는 기준만 만듦(비교 없음).\n");
    console.log("기준값 없음 — 비교 없이 기준만");
    return;
  }
  for (const doc of ["costs", "economics", "ads"]) {
    const before = base.tables?.[doc] ?? {};
    const after = now.tables[doc] ?? {};
    for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
      const a = before[key];
      const b = after[key];
      if (a === b) continue;
      if (a === undefined || b === undefined) {
        // 광고 순간·자리 줄이 생기거나 없어짐은 알림.
        const row = key.split(" · ")[1] ?? key;
        const isAdRow = doc === "ads";
        items.push({ kind: doc, key, before: a ?? null, after: b ?? null, change: a === undefined ? "생김" : "없어짐", notify: isAdRow, row });
        continue;
      }
      const na = numberOf(a);
      const nb = numberOf(b);
      const diff = na && nb && na.unit === nb.unit ? nb.value - na.value : null;
      const money = (na?.unit === "원" || nb?.unit === "원") && diff !== null;
      items.push({ kind: doc, key, before: a, after: b, diff, unit: nb?.unit ?? "", notify: money && Math.abs(diff) >= MONEY_ALERT });
    }
  }
  const qa = base.quiz?.causes ?? {};
  const qb = now.quiz?.causes ?? {};
  for (const cause of new Set([...Object.keys(qa), ...Object.keys(qb)])) {
    const a = qa[cause] ?? 0;
    const b = qb[cause] ?? 0;
    if (a === b) continue;
    items.push({ kind: "quiz", key: cause, before: a, after: b, diff: b - a, notify: (a === 0 && b > 0) || b - a >= QUIZ_ALERT });
  }
  // 표에 행이 생기거나 없어지면 칸마다가 아니라 한 줄로.
  const seen = new Set();
  const merged = items.filter((item) => {
    if (!item.change) return true;
    const id = `${item.kind}|${item.change}|${item.row}`;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  const notify = merged.filter((item) => item.notify);
  writeJson(path.join(OUT, "delta.json"), { from: plan.from ?? "", to: plan.to ?? now.commit, items: merged, notify: notify.length });
  // 사람이 읽는 요약(보고·알림 재료).
  const fmt = (v) => (v === null || v === undefined ? "—" : String(v));
  const lines = [];
  const sign = (n) => (n > 0 ? `+${n.toLocaleString("ko-KR")}` : n.toLocaleString("ko-KR"));
  const group = (kind, title) => {
    const list = merged.filter((item) => item.kind === kind);
    if (!list.length) return;
    lines.push(`### ${title} — 바뀐 칸 ${list.length}${list.some((i) => i.notify) ? " (알림)" : ""}`);
    for (const item of list.sort((x, y) => Number(y.notify) - Number(x.notify) || Math.abs(y.diff ?? 0) - Math.abs(x.diff ?? 0)).slice(0, 12)) {
      if (item.change) lines.push(`- ${item.notify ? "**" : ""}${item.change}: ${item.row}${item.notify ? "**" : ""}`);
      else if (kind === "quiz") lines.push(`- ${item.notify ? "**" : ""}${item.key}: ${item.before} → ${item.after} (${sign(item.diff)})${item.notify ? "**" : ""}`);
      else lines.push(`- ${item.notify ? "**" : ""}${item.key}: ${fmt(item.before)} → ${fmt(item.after)}${item.diff !== null && item.diff !== undefined ? ` (${sign(item.diff)}${item.unit})` : ""}${item.notify ? "**" : ""}`);
    }
    if (list.length > 12) lines.push(`- … 그 밖 ${list.length - 12}칸`);
    lines.push("");
  };
  group("costs", DOC_NAME.costs);
  group("economics", DOC_NAME.economics);
  group("ads", DOC_NAME.ads);
  group("quiz", "퀴즈 전수 점검 원인별 문제 수");
  const text = lines.length ? lines.join("\n") : "숫자로 바뀐 것 없음(비용표·손익·광고 지도·퀴즈 원인 모두 그대로).\n";
  fs.writeFileSync(path.join(OUT, "summary.md"), text);
  console.log(`바뀐 칸 ${merged.length} · 알릴 것 ${notify.length}`);
}

function save() {
  const now = JSON.parse(fs.readFileSync(path.join(OUT, "now.json"), "utf8"));
  const plan = fs.existsSync(path.join(OUT, "plan.json")) ? JSON.parse(fs.readFileSync(path.join(OUT, "plan.json"), "utf8")) : {};
  const state = readState();
  const { marks, ...quiz } = now.quiz ?? {};
  writeJson(STATE, {
    _: "변경 감시(scripts/watch/watch.mjs)의 기준값 — 손으로 고치지 않는다. last = 마지막으로 본 main 커밋, metrics = 그때 잰 값.",
    last: plan.to || git("rev-parse", "HEAD"),
    at: now.at,
    screensFiredAt: state.screensFiredAt ?? "",
    metrics: { commit: now.commit, tables: now.tables, quiz },
  });
  console.log(`기준값 저장: ${String(plan.to || "").slice(0, 7) || now.commit}`);
}

/** 화면 점검을 바로 부를지(하루 한 번까지 — 30분 넘게 걸리는 점검이라). 부르면 시각을 남김. */
function screens() {
  const state = readState();
  const last = state.screensFiredAt ? Date.parse(state.screensFiredAt) : 0;
  const due = Date.now() - last > 20 * 60 * 60 * 1000;
  console.log(due ? "fire" : `skip — 마지막 ${state.screensFiredAt}`);
  if (due && process.argv.includes("--mark")) {
    state.screensFiredAt = new Date().toISOString();
    writeJson(STATE, state);
  }
}

const COMMANDS = { plan, measure, compare, save, screens };
const command = COMMANDS[process.argv[2]];
if (command) command();
else {
  console.error("plan | measure | compare | save | screens [--mark]");
  process.exitCode = 1;
}
