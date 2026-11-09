#!/usr/bin/env node
/**
 * Carries a chat's work into the hub without relying on the chat to remember.
 *
 *   start    SessionStart (startup/resume/clear): note where this chat began and
 *            hand it the inbox and the last handoffs.
 *   compact  SessionStart after compaction: the summary loses detail, so say
 *            again what this chat has committed and what the hub expects.
 *   stop     Stop: a chat that committed work and left no handoff in
 *            hub/chat/log/ is not allowed to finish until it writes one. A chat
 *            that changed app code (src/) must also have touched the app
 *            structure (hub/app/STRUCTURE.md, scripts/structure.json) or said
 *            "구조: 변화 없음" in its handoff, and the structure map must
 *            still cover every screen file, API route and page.
 *            A chat whose conversation was compacted is asked, once, to hand
 *            its tab over (hub/chat/tabs.md, /pass N) at the next stopping point.
 *            Three more checks for changed app code (사용자 2026-11-09):
 *            - scope: if the change reaches screens of another tab
 *              (scripts/scope.mjs), the chat must have run scripts/asks.mjs
 *              apply after its last src commit, so those tabs get a request to
 *              confirm and answer — not a one-way notice.
 *            - old code: the chat's log entry says "- 옛 것: …" (없음 / 지움 /
 *              asked the user), so a replaced way is never left running silently.
 *            - leftovers: scripts/leftovers.mjs --check finds no new dead code
 *              that was neither deleted nor put to the user as a delete ask.
 *   start also lists open asks (hub/chat/asks.json): requests for each tab and
 *   delete questions the chat must put to the user.
 *
 * Hooks read JSON on stdin; for SessionStart, stdout becomes context. Any
 * failure here stays silent and lets the chat carry on: a broken hook must
 * never be the reason someone cannot work.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

process.on("uncaughtException", () => process.exit(0));

const mode = process.argv[2];
const ROOT = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const HUB = path.join(ROOT, "hub");

function readInput() {
  try {
    return JSON.parse(fs.readFileSync(0, "utf8") || "{}");
  } catch {
    return {};
  }
}

function git(...args) {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
}

function stateFile(sessionId) {
  const dir = path.join(os.tmpdir(), "claude-hub-sessions");
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, `${String(sessionId || "unknown").replace(/[^\w-]/g, "_")}.json`);
}

function readState(sessionId) {
  try {
    return JSON.parse(fs.readFileSync(stateFile(sessionId), "utf8"));
  } catch {
    return null;
  }
}

/** Lines in the inbox addressed to anyone, without the header. */
function inboxLines() {
  try {
    return fs
      .readFileSync(path.join(HUB, "work", "inbox.md"), "utf8")
      .split("\n")
      .filter((line) => /^- \d{4}-\d{2}-\d{2} /.test(line));
  } catch {
    return [];
  }
}

/** Open asks from hub/chat/asks.json (scripts/asks.mjs). */
function openAsks() {
  try {
    return JSON.parse(fs.readFileSync(path.join(HUB, "chat", "asks.json"), "utf8")).asks.filter((a) => a.status === "open");
  } catch {
    return [];
  }
}

function asksText() {
  const open = openAsks();
  if (!open.length) return "";
  const parts = [];
  const toUser = open.filter((a) => a.to === "user");
  if (toUser.length) {
    parts.push(
      "[허브] 사용자에게 물을 옛 코드 지우기 " + toUser.length + "개 (hub/chat/ASKS.md) — 사용자가 이 채팅에 있으면 첫 답에서 AskUserQuestion으로 묻고(지움/남김+언제 다시 볼지), " +
        "`node scripts/asks.mjs answer <id> --by user --status 지움|남김 [--until …]`로 적어 커밋. 지움이면 그 코드를 지운다(그 탭 일이면 그 탭에 apply 요청).\n" +
        toUser.map((a) => `- ${a.id} (탭 ${a.from}) ${a.what}: ${(a.files ?? []).join(", ")}`).join("\n"),
    );
  }
  const byTab = new Map();
  for (const a of open.filter((x) => x.to !== "user")) byTab.set(a.to, [...(byTab.get(a.to) ?? []), a]);
  if (byTab.size) {
    parts.push(
      "[허브] 탭에 온 확인 요청 (hub/chat/ASKS.md) — 이 채팅이 그 탭이면 다른 일보다 먼저: 볼 곳 화면에서도 새 동작인지·옛 동작이 남았는지 확인 → 필요하면 고치고 → " +
        "`node scripts/asks.mjs answer <id> --by <탭> --status 맞음|고침|해당없음 --note \"…\"` → 커밋.\n" +
        [...byTab]
          .sort()
          .map(([tab, list]) => `탭 ${tab}: ` + list.map((a) => `${a.id} (탭 ${a.from}에서) ${a.what}`).join(" / "))
          .join("\n"),
    );
  }
  return parts.join("\n\n");
}

/** The last few handoff entries, newest last, trimmed to fit in context. */
function lastHandoffs(count = 2, limit = 2500) {
  try {
    const dir = path.join(HUB, "chat", "log");
    const files = fs.readdirSync(dir).filter((f) => /^\d{4}-\d{2}\.md$/.test(f)).sort();
    const entries = [];
    for (const file of files.slice(-2)) {
      const text = fs.readFileSync(path.join(dir, file), "utf8");
      for (const part of text.split(/\n(?=## \d{4}-\d{2}-\d{2} )/).slice(1)) entries.push(part.trim());
    }
    const shown = entries.slice(-count).join("\n\n");
    return shown.length > limit ? shown.slice(0, limit) + "\n…" : shown;
  } catch {
    return "";
  }
}

/**
 * Commits this chat made: [{ sha, subject, work, log }], oldest first.
 *
 * Read from the reflog rather than base..HEAD, so commits that arrived by
 * `git pull` — other chats' work — are not mistaken for this chat's. Commits
 * since replaced by an amend or a rebase drop out because they are no longer
 * in HEAD's history; the rebased copies are counted instead.
 */
function commitsSince(base, startedAt) {
  if (!base || !startedAt) return [];
  const since = Math.floor(Date.parse(startedAt) / 1000) - 1;
  let reflog = "";
  try {
    reflog = git("reflog", "--date=unix", "--format=%H %gd %gs");
  } catch {
    return [];
  }
  const shas = [];
  for (const line of reflog.split("\n")) {
    const match = line.match(/^(\w+) \S+@\{(\d+)\} (.*)$/);
    if (!match || Number(match[2]) < since) continue;
    if (!/^(commit|rebase \(pick\)|cherry-pick)/.test(match[3])) continue;
    if (!shas.includes(match[1])) shas.push(match[1]);
  }
  const mine = [];
  for (const sha of shas.reverse()) {
    try {
      execFileSync("git", ["merge-base", "--is-ancestor", sha, "HEAD"], { cwd: ROOT, stdio: "ignore" });
    } catch {
      continue;
    }
    const [head, ...files] = git("show", "--name-only", "--format=%h %s", sha).split("\n").filter(Boolean);
    const [short, ...subject] = head.split(" ");
    const log = files.some((f) => f.startsWith("hub/chat/log/"));
    let structureNote = false;
    let oldNote = false;
    if (log) {
      try {
        const added = git("show", "--format=", sha, "--", "hub/chat/log");
        structureNote = /^\+\s*- 구조:/m.test(added);
        oldNote = /^\+\s*- 옛 것:/m.test(added);
      } catch {
        // A note we cannot read counts as missing; the chat is asked once more.
      }
    }
    const tabs = files.map((f) => f.match(/^hub\/chat\/handoff\/(\d)\.md$/)?.[1]).filter(Boolean);
    mine.push({
      sha: short,
      subject: subject.join(" "),
      work: files.some((f) => !f.startsWith("hub/")),
      log,
      src: files.some((f) => f.startsWith("src/")),
      handoff: files.some((f) => f.startsWith("hub/chat/handoff/")),
      tabs,
      asks: files.includes("hub/chat/asks.json"),
      oldNote,
      structure: files.some((f) => f === "hub/app/STRUCTURE.md" || f === "scripts/structure.json") || structureNote,
    });
  }
  return mine;
}

/** Work committed after the last commit that wrote a handoff. */
function unrecorded(commits) {
  let lastLog = -1;
  commits.forEach((c, i) => {
    if (c.log) lastLog = i;
  });
  return commits.slice(lastLog + 1).filter((c) => c.work);
}

const input = readInput();

if (mode === "start" || mode === "compact") {
  let head = "";
  try {
    head = git("rev-parse", "HEAD");
  } catch {
    // Not a git checkout: nothing to track, but the context below still helps.
  }
  const existing = readState(input.session_id);
  if (!existing && head) {
    fs.writeFileSync(stateFile(input.session_id), JSON.stringify({ base: head, startedAt: new Date().toISOString() }));
  }
  if (mode === "compact" && existing) {
    // 압축 횟수 — 끝내기 훅이 양도를 권하는 신호(hub/chat/tabs.md "언제 양도하나").
    existing.compactions = (existing.compactions ?? 0) + 1;
    fs.writeFileSync(stateFile(input.session_id), JSON.stringify(existing));
  }

  const parts = [];
  if (mode === "compact") {
    parts.push(
      "[허브] 대화가 압축되어 세부 내용이 줄었다. 이어가기 전에 이 채팅이 맡은 역할의 `hub/work/roles/<역할>.md`를 다시 읽어라.",
    );
    parts.push(
      "[허브] 채팅이 길어졌다 — 지금 하던 일 단위를 마치면 이 탭을 양도한다(hub/chat/tabs.md, `/pass N` → 사용자에게 \"새 채팅에서 'N번 받기'\"). 일 중간에는 끊지 않는다.",
    );
    const mine = commitsSince(existing?.base, existing?.startedAt);
    if (mine.length) {
      parts.push("이 채팅에서 지금까지 한 커밋:\n" + mine.map((c) => `- ${c.sha} ${c.subject}`).join("\n"));
    }
    const missing = unrecorded(mine);
    if (missing.length) {
      parts.push(
        `이 중 ${missing.length}개는 아직 hub/chat/log에 인계 기록이 없다. 지금 바로 hub/chat/log/YYYY-MM.md에 한 항목을 남기고 역할 파일의 열린 일을 고쳐 커밋하라.`,
      );
    }
  } else {
    parts.push(
      "[허브] 이 저장소는 채팅을 역할(dev/qa/store)로 나누고 기억은 hub/에 둔다. 요청에 맞는 `hub/work/roles/<역할>.md`를 읽고 시작하고, 끝날 때 역할 파일과 hub/chat/log에 남겨라 (hub/README.md). " +
        "코드를 고치기 전에 hub/app/STRUCTURE.md(앱 전체구조, CLAUDE.md가 불러옴)에서 영역과 영향 범위를 보고, 고친 커밋에서 구조도 고친다. " +
        "채팅은 번호 붙은 탭으로 일한다(hub/chat/tabs.md — 1 메인·2 My·3 AI·4 사람·5 점검·6 스토어): 사용자가 \"N번 받기\"라고 하면 `/take N`, 길어지면 `/pass N`으로 양도.",
    );
  }
  const asks = asksText();
  if (asks) parts.push(asks);
  const inbox = inboxLines();
  if (inbox.length) parts.push("역할끼리 넘긴 일 (hub/work/inbox.md):\n" + inbox.join("\n"));
  const handoffs = lastHandoffs();
  if (handoffs) parts.push("최근 인계 기록 (hub/chat/log):\n" + handoffs);
  process.stdout.write(parts.join("\n\n") + "\n");
  process.exit(0);
}

/**
 * App code changed without the structure being looked at: no commit of this
 * chat touched hub/app/STRUCTURE.md or scripts/structure.json, and no handoff said
 * "구조: …". Returns the commits that changed src/, or [] when all is well.
 */
function structureUnchecked(commits) {
  const changed = commits.filter((c) => c.src);
  if (!changed.length || commits.some((c) => c.structure)) return [];
  return changed;
}

/** The structure map's own check (every screen file, API and page has an area). "" when it passes. */
function structureMapProblems() {
  try {
    execFileSync("node", [path.join(ROOT, "scripts", "structure.mjs"), "--check", "--assign-only"], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 15_000,
    });
    return "";
  } catch (error) {
    // No script yet (an older checkout) or node missing: never block on that.
    if (!fs.existsSync(path.join(ROOT, "scripts", "structure.mjs")) || error.code === "ENOENT") return "";
    return String(error.stderr || error.stdout || "").trim();
  }
}

/** Run a repo script; returns { ok, out } and never throws. */
function runScript(args, timeout = 30_000) {
  try {
    const out = execFileSync("node", args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout });
    return { ok: true, out };
  } catch (error) {
    if (error.code === "ENOENT" || error.signal) return { ok: true, out: "" }; // node 없음·시간 넘김: 막지 않는다
    return { ok: false, out: String(error.stderr || error.stdout || "").trim() };
  }
}

/**
 * 바뀐 코드가 다른 탭 화면에 닿는데 확인 요청(scripts/asks.mjs apply)을 안 만들었으면 그 탭들.
 * 이 채팅의 탭: 이 채팅이 쓴 hub/chat/handoff/N.md(받기·양도), 모르면 닿는 탭이 하나뿐일 때 그 탭으로 본다.
 */
function scopeUnasked(commits, base) {
  const lastSrc = commits.map((c) => c.src).lastIndexOf(true);
  if (lastSrc < 0 || !base) return null;
  if (commits.slice(lastSrc).some((c) => c.asks)) return null;
  if (!fs.existsSync(path.join(ROOT, "scripts", "scope.mjs"))) return null;
  const { ok, out } = runScript([path.join(ROOT, "scripts", "scope.mjs"), "--diff", base, "--json", "--quick"]);
  if (!ok || !out) return null;
  let usedBy = [];
  try {
    usedBy = JSON.parse(out).usedBy ?? [];
  } catch {
    return null;
  }
  const mine = [...new Set(commits.flatMap((c) => c.tabs))];
  const others = mine.length ? usedBy.filter((t) => !mine.includes(String(t))) : usedBy.length > 1 ? usedBy : [];
  return others.length ? { others, mine, usedBy } : null;
}

if (mode === "stop") {
  if (input.stop_hook_active) process.exit(0);
  const state = readState(input.session_id);
  const commits = commitsSince(state?.base, state?.startedAt);
  const missing = unrecorded(commits);
  const unchecked = structureUnchecked(commits);
  const mapProblems = commits.some((c) => c.src) ? structureMapProblems() : "";
  const anySrc = commits.some((c) => c.src);
  const scope = anySrc ? scopeUnasked(commits, state?.base) : null;
  const oldUnsaid = anySrc && !commits.some((c) => c.oldNote);
  const leftovers =
    anySrc && fs.existsSync(path.join(ROOT, "scripts", "leftovers.mjs")) ? runScript([path.join(ROOT, "scripts", "leftovers.mjs"), "--check"]) : { ok: true };
  // 압축된 채팅은 한 번 양도를 권한다(이미 hub/chat/handoff/에 남겼으면 안 함).
  const askPass = Boolean(state && (state.compactions ?? 0) >= 1 && !state.passAsked && !commits.some((c) => c.handoff));
  if (askPass) {
    state.passAsked = new Date().toISOString();
    try {
      fs.writeFileSync(stateFile(input.session_id), JSON.stringify(state));
    } catch {
      // 못 적으면 다음 끝에 한 번 더 권할 뿐.
    }
  }
  if (missing.length === 0 && unchecked.length === 0 && !mapProblems && !askPass && !scope && !oldUnsaid && leftovers.ok) process.exit(0);

  const reasons = [];
  if (missing.length) {
    reasons.push(
      "이 채팅에서 커밋한 작업이 허브에 인계되지 않았다:\n" +
        missing.map((c) => `- ${c.sha} ${c.subject}`).join("\n") +
        "\n\n끝내기 전에: hub/chat/log/YYYY-MM.md에 한 항목(한 일 / 남긴 일 / 커밋), 해당 역할 파일의 열린 일 갱신, " +
        "다른 역할에 넘길 것은 hub/work/inbox.md에 한 줄. 그다음 커밋하고 푸시한 브랜치에 같이 올려라. " +
        "형식은 hub/README.md와 hub/chat/log 맨 위. 화면·기능·한도가 바뀌었으면 PRODUCT.md도 같이 고쳐라.",
    );
  }
  if (unchecked.length) {
    reasons.push(
      "앱 코드(src/)를 바꿨는데 전체구조(hub/app/STRUCTURE.md)를 확인한 흔적이 없다:\n" +
        unchecked.map((c) => `- ${c.sha} ${c.subject}`).join("\n") +
        "\n\n화면 흐름·탭·영역이 바뀌었으면 hub/app/STRUCTURE.md 위쪽(손으로 쓴 부분)을 고치고, 새 화면 파일·API·페이지는 " +
        "scripts/structure.json에 영역을 넣은 뒤 node scripts/structure.mjs. 구조가 그대로면 hub/chat/log 항목에 " +
        "\"- 구조: 변화 없음\" 한 줄. 커밋하고 푸시하라.",
    );
  }
  if (mapProblems) {
    reasons.push("전체구조 자리표가 코드와 어긋난다 (CI structure도 실패한다):\n" + mapProblems);
  }
  if (scope) {
    reasons.push(
      `바꾼 코드가 다른 탭 화면에도 닿는다(닿는 탭 ${scope.usedBy.join(", ")}${scope.mine.length ? ` · 이 채팅 ${scope.mine.join(", ")}` : ""}) — 알리기만 하지 말고 그 탭에 확인 요청을 만든다:\n` +
        `node scripts/asks.mjs apply --from <이 채팅 탭> --base ${state.base.slice(0, 10)} --what "무엇이 어떻게 바뀌었나 한 줄"\n` +
        "(먼저 `node scripts/scope.mjs --diff " + state.base.slice(0, 10) + "`로 그 탭 파일을 보고, 이 채팅에서 같이 고칠 수 있는 곳은 고친 뒤). hub/chat/asks.json·ASKS.md를 커밋·push하라.",
    );
  }
  if (oldUnsaid) {
    reasons.push(
      "앱 코드를 바꿨는데 옛 방식을 어떻게 했는지 기록이 없다. 바꾼 것이 옛 방식(알고리즘·화면·계산)을 대신했으면 옛 코드가 아직 불리는지 찾아(scripts/scope.mjs가 보이는 \"같은 이름\"·장부 replaces) " +
        "같은 커밋에서 지우거나, 지울지 사용자에게 묻는다(`node scripts/asks.mjs delete --from <탭> --what \"…\" --files …` 후 바로 AskUserQuestion). " +
        "그리고 hub/chat/log 항목에 한 줄: `- 옛 것: 없음` / `- 옛 것: 지움 <무엇>` / `- 옛 것: 사용자에게 물음 <ask id>`. 커밋·push하라.",
    );
  }
  if (!leftovers.ok) {
    reasons.push("새로 남은 옛 코드가 있다 (CI languages도 실패한다):\n" + leftovers.out);
  }
  if (askPass) {
    reasons.push(
      "이 채팅은 대화가 압축될 만큼 길어졌다(hub/chat/tabs.md \"언제 양도하나\"). 지금 일 단위가 끝났으면 `/pass N`(.claude/skills/pass/SKILL.md)으로 " +
        "hub/chat/handoff/N.md를 쓰고 커밋·push한 뒤 사용자에게 \"N번 양도함 — 새 채팅에서 'N번 받기'\"라고 알려라. " +
        "아직 일 중간이거나 사용자가 이 채팅에서 계속하길 원하면, 사용자에게 한 줄로 양도를 권하기만 하고 하던 일을 마쳐라(이 알림은 한 번만).",
    );
  }
  process.stdout.write(JSON.stringify({ decision: "block", reason: reasons.join("\n\n") }));
  process.exit(0);
}

process.exit(0);
