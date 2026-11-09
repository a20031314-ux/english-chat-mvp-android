#!/usr/bin/env node
/**
 * 탭끼리 확인 요청 — 알리기만 하지 않고 "그쪽 탭에서도 이렇게 되나 확인하고 답해 달라"를 만들고 받는다
 * (사용자 2026-11-09 "이 기능이 바뀌었는데 그쪽 채팅에서도 적용되느냐를 확인해달라는 식의 소통이 자동화되어야").
 * 원본 hub/chat/asks.json, 사람이 보는 판 hub/chat/ASKS.md(쓸 때마다 다시 씀, 허브 페이지에도).
 *
 *   node scripts/asks.mjs apply --from 2 --base <커밋> --what "퀴즈 다음 문제 고르기를 바꿈"
 *        바뀐 코드(scripts/scope.mjs --diff)가 닿는 다른 탭마다 요청 하나: 그 탭 화면 파일 목록 + 볼 것.
 *        닿는 다른 탭이 없어도 "범위 봄" 기록을 남긴다(끝내기 훅이 이것을 본다).
 *   node scripts/asks.mjs delete --from 2 --what "옛 다음 문제 고르기(pickNext)" --files src/lib/a.ts,src/lib/b.ts [--why "새 것과 같이 불림"]
 *        옛 코드를 지울지 사용자에게 묻는 요청(받는 쪽 user). 시작 훅이 모든 채팅에 띄우고, 채팅이 사용자에게 묻고 답을 적는다.
 *   node scripts/asks.mjs answer <id> --by 3 --status 맞음|고침|해당없음 [--note "…"]      탭 요청에 답
 *   node scripts/asks.mjs answer <id> --by user --status 지움|남김 [--until "2.81 뒤"] [--note]  삭제 질문에 사용자 답
 *   node scripts/asks.mjs list [--to 3|user] [--all]
 *   node scripts/asks.mjs --check     원본·판이 맞는지(CI)
 *
 * 다른 스크립트가 쓰는 것: readAsks() · openFor(tab) (.claude/hooks/hub.mjs · leftovers.mjs · hub-page.mjs)
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA = path.join(ROOT, "hub/chat/asks.json");
const PAGE = path.join(ROOT, "hub/chat/ASKS.md");
const KEEP_DAYS = 14;

const today = () => new Date(Date.now() + 9 * 3600_000).toISOString().slice(0, 10);
const nowKst = () => new Date(Date.now() + 9 * 3600_000).toISOString().slice(0, 16).replace("T", " ");

export function readAsks() {
  try {
    return JSON.parse(fs.readFileSync(DATA, "utf8"));
  } catch {
    return { asks: [], scopes: [] };
  }
}

/** 이 탭(또는 "user") 앞으로 온 열린 요청 */
export function openFor(to) {
  return readAsks().asks.filter((a) => a.status === "open" && (to == null || String(a.to) === String(to)));
}

function tabName(tab) {
  if (tab === "user") return "사용자";
  try {
    const t = JSON.parse(fs.readFileSync(path.join(ROOT, "hub/chat/tabs.json"), "utf8")).tabs[tab];
    return t ? `${tab} ${t.name}` : String(tab);
  } catch {
    return String(tab);
  }
}

function render(data) {
  const lines = [];
  lines.push("# 확인 요청");
  lines.push("");
  lines.push("> **자동 생성 — 손으로 고치지 않는다.** 원본 `hub/chat/asks.json` → `node scripts/asks.mjs`(머리 주석에 쓰는 법).");
  lines.push("> 기능을 바꾼 채팅이 그 코드가 닿는 **다른 탭마다** \"거기서도 이렇게 되나\" 요청을 만들고(`apply`), 받는 탭이 확인해 답한다(`answer`). 옛 코드를 지울지는 **사용자에게** 묻는다(`delete`).");
  lines.push("> 시작 훅이 열린 요청을 채팅에 넣고, `/take N`은 그 탭 요청부터 처리한다. 끝내기 훅은 다른 탭에 닿는 변경에 요청이 없으면 막는다.");
  lines.push("");
  const open = data.asks.filter((a) => a.status === "open");
  const toUser = open.filter((a) => a.to === "user");
  const toTabs = open.filter((a) => a.to !== "user");
  lines.push(`## 사용자에게 물을 것 — 옛 코드 지우기 (${toUser.length})`);
  lines.push("");
  if (!toUser.length) lines.push("없음");
  for (const a of toUser) {
    lines.push(`- **${a.id}** (${a.at}, 탭 ${a.from}) ${a.what}${a.why ? ` — ${a.why}` : ""}`);
    for (const f of a.files ?? []) lines.push(`  - \`${f}\``);
  }
  lines.push("");
  lines.push(`## 탭이 확인할 것 (${toTabs.length})`);
  lines.push("");
  if (!toTabs.length) lines.push("없음", "");
  const byTab = new Map();
  for (const a of toTabs) byTab.set(a.to, [...(byTab.get(a.to) ?? []), a]);
  for (const [tab, list] of [...byTab].sort()) {
    lines.push(`### 탭 ${tabName(tab)}`);
    lines.push("");
    for (const a of list) {
      lines.push(`- **${a.id}** (${a.at}, 탭 ${a.from}${a.head ? ` · ${a.head}` : ""}) ${a.what}`);
      if (a.features?.length) lines.push(`  - 기능: ${a.features.join(" · ")}`);
      lines.push(`  - 볼 곳: ${(a.files ?? []).slice(0, 10).map((f) => `\`${f.replace(/^src\//, "")}\``).join(" · ")}${(a.files ?? []).length > 10 ? ` … ${a.files.length - 10}개 더` : ""}`);
      lines.push(`  - 볼 것: 이 화면들에서도 새 동작이 나오나 · 옛 동작(같은 일을 따로 하는 코드)이 남았나 · 문구 14개 언어`);
    }
    lines.push("");
  }
  const done = data.asks.filter((a) => a.status !== "open").slice(-20).reverse();
  lines.push(`## 최근 답 (${done.length}, ${KEEP_DAYS}일 뒤 저절로 빠짐 — 경위는 git 기록)`);
  lines.push("");
  if (!done.length) lines.push("없음");
  for (const a of done) lines.push(`- ${a.id} → ${tabName(a.to)}: **${a.status}**${a.until ? ` (${a.until})` : ""}${a.note ? ` — ${a.note}` : ""} · ${a.what} (${a.answeredAt ?? ""})`);
  lines.push("");
  return lines.join("\n");
}

function write(data) {
  const cutoff = Date.now() - KEEP_DAYS * 86400_000;
  data.asks = data.asks.filter((a) => a.status === "open" || !a.answeredAt || Date.parse(a.answeredAt.replace(" ", "T") + ":00+09:00") > cutoff);
  data.scopes = (data.scopes ?? []).slice(-40);
  fs.writeFileSync(DATA, JSON.stringify(data, null, 2) + "\n");
  fs.writeFileSync(PAGE, render(data));
}

function nextId(data, from) {
  // 번호는 보내는 탭마다 따로 센다 — 두 채팅이 같은 날 따로 만들어도 rebase 때 같은 id가 안 생기게(a<날>-<탭>-<n>)
  const day = today().replace(/-/g, "").slice(2);
  const key = `${day}-${from}`;
  const n = (data.seq?.[key] ?? 0) + 1;
  data.seq = { ...Object.fromEntries(Object.entries(data.seq ?? {}).filter(([k]) => k.startsWith(day))), [key]: n };
  return `a${key}-${n}`;
}

function opt(args, name) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
}

const git = (...a) => execFileSync("git", a, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();

async function apply(args) {
  const from = opt(args, "from");
  const what = opt(args, "what");
  if (!from || !what) throw new Error('apply에는 --from <내 탭> --what "무엇이 바뀌었나"가 필요');
  const { scopeOf, changedSince } = await import("./scope.mjs");
  let files = (opt(args, "files") ?? "").split(",").filter(Boolean);
  let keys = [];
  const base = opt(args, "base");
  if (base) {
    const changed = changedSince(base);
    files.push(...changed.files.filter((f) => f.startsWith("src/")));
    keys = changed.keys;
  }
  const feature = opt(args, "feature");
  if (feature) {
    const ledger = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/features.json"), "utf8"));
    const one = ledger.features.find((x) => x.id === feature);
    if (!one) throw new Error(`기능 장부에 없음: ${feature}`);
    files.push(...(one.code ?? []));
  }
  files = [...new Set(files)].filter((f) => fs.existsSync(path.join(ROOT, f)));
  const data = readAsks();
  let head = "";
  try {
    head = git("rev-parse", "--short", "HEAD");
  } catch {}
  const result = scopeOf(files, keys);
  const others = result.usedBy.filter((t) => String(t) !== String(from));
  const made = [];
  for (const tab of others) {
    const tabFiles = result.tabs[tab].files.map((f) => f.file);
    const same = data.asks.find((a) => a.status === "open" && a.kind === "apply" && String(a.from) === String(from) && String(a.to) === String(tab) && a.what === what);
    if (same) {
      same.files = [...new Set([...(same.files ?? []), ...tabFiles])];
      same.head = head;
      made.push(same.id);
      continue;
    }
    const ask = { id: nextId(data, from), at: nowKst(), kind: "apply", from: String(from), to: String(tab), what, files: tabFiles, features: result.features.map((f) => f.name), base: base ?? null, head, status: "open" };
    data.asks.push(ask);
    made.push(ask.id);
  }
  data.scopes = [...(data.scopes ?? []), { at: nowKst(), from: String(from), base: base ?? null, head, what, tabs: result.usedBy, asks: made }];
  write(data);
  if (!others.length) console.log(`다른 탭에 닿지 않음(닿는 탭: ${result.usedBy.join(", ") || "없음"}) — 범위 본 기록만 남김`);
  else console.log(`확인 요청 ${made.length}개: ${others.map((t) => `탭 ${tabName(t)}`).join(" · ")} — hub/chat/ASKS.md`);
  if (result.sameNames.length) {
    console.log("같은 이름을 따로 정의한 곳(같은 일을 두 번 하면 한쪽만 고쳐짐) — 확인해서 옛 쪽이면 지우거나 `delete`로 사용자에게:");
    for (const s of result.sameNames) console.log(`  ${s.name}: ${s.at} ↔ ${s.also.join(", ")}`);
  }
}

function del(args) {
  const from = opt(args, "from");
  const what = opt(args, "what");
  const files = (opt(args, "files") ?? "").split(",").filter(Boolean);
  if (!from || !what || !files.length) throw new Error('delete에는 --from <내 탭> --what "무엇" --files a,b가 필요');
  const data = readAsks();
  const ask = { id: nextId(data, from), at: nowKst(), kind: "delete", from: String(from), to: "user", what, why: opt(args, "why") ?? "", files, status: "open" };
  data.asks.push(ask);
  write(data);
  console.log(`사용자 삭제 질문 ${ask.id} — 지금 사용자에게 묻고(AskUserQuestion) 답을 answer로 적는다`);
}

function answer(args) {
  const id = args[1];
  const status = opt(args, "status");
  const by = opt(args, "by");
  const data = readAsks();
  const ask = data.asks.find((a) => a.id === id);
  if (!ask) throw new Error(`없는 요청: ${id}`);
  const allowed = ask.kind === "delete" ? ["지움", "남김"] : ["맞음", "고침", "해당없음"];
  if (!allowed.includes(status)) throw new Error(`--status는 ${allowed.join("|")}`);
  if (ask.kind === "delete" && by !== "user") throw new Error("삭제 질문의 답은 사용자만 — --by user (사용자가 답한 것을 적을 때)");
  if (ask.kind === "delete" && status === "남김" && !opt(args, "until")) throw new Error('남김이면 --until "언제 다시 볼지"(예: "2.81 자를 때")');
  Object.assign(ask, { status, by: by ?? "", note: opt(args, "note") ?? "", until: opt(args, "until") ?? "", answeredAt: nowKst() });
  write(data);
  console.log(`${id} → ${status}`);
}

function list(args) {
  const to = opt(args, "to");
  const all = args.includes("--all");
  const rows = readAsks().asks.filter((a) => (all || a.status === "open") && (to == null || String(a.to) === String(to)));
  if (!rows.length) return console.log("열린 요청 없음");
  for (const a of rows) console.log(`${a.id} [${a.status}] 탭 ${a.from} → ${tabName(a.to)}: ${a.what}\n    ${(a.files ?? []).slice(0, 8).join(" · ")}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  try {
    if (args.includes("--check")) {
      const data = readAsks();
      const want = render(data);
      const have = fs.existsSync(PAGE) ? fs.readFileSync(PAGE, "utf8") : "";
      if (want !== have) {
        console.error("hub/chat/ASKS.md가 asks.json과 다름 — node scripts/asks.mjs render");
        process.exit(1);
      }
      console.log(`확인 요청: 열림 ${data.asks.filter((a) => a.status === "open").length}`);
    } else if (args[0] === "apply") await apply(args);
    else if (args[0] === "delete") del(args);
    else if (args[0] === "answer") answer(args);
    else if (args[0] === "render") write(readAsks());
    else list(args);
  } catch (error) {
    console.error(String(error.message ?? error));
    process.exit(2);
  }
}
