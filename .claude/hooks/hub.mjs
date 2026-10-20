#!/usr/bin/env node
/**
 * Carries a chat's work into the hub without relying on the chat to remember.
 *
 *   start    SessionStart (startup/resume/clear): note where this chat began and
 *            hand it the inbox and the last handoffs.
 *   compact  SessionStart after compaction: the summary loses detail, so say
 *            again what this chat has committed and what the hub expects.
 *   stop     Stop: a chat that committed work and left no handoff in
 *            hub/log/ is not allowed to finish until it writes one. A chat
 *            that changed app code (src/) must also have touched the app
 *            structure (hub/STRUCTURE.md, scripts/structure.json) or said
 *            "구조: 변화 없음" in its handoff, and the structure map must
 *            still cover every screen file, API route and page.
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
      .readFileSync(path.join(HUB, "inbox.md"), "utf8")
      .split("\n")
      .filter((line) => /^- \d{4}-\d{2}-\d{2} /.test(line));
  } catch {
    return [];
  }
}

/** The last few handoff entries, newest last, trimmed to fit in context. */
function lastHandoffs(count = 2, limit = 2500) {
  try {
    const dir = path.join(HUB, "log");
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
    const log = files.some((f) => f.startsWith("hub/log/"));
    let structureNote = false;
    if (log) {
      try {
        structureNote = /^\+\s*- 구조:/m.test(git("show", "--format=", sha, "--", "hub/log"));
      } catch {
        // A note we cannot read counts as missing; the chat is asked once more.
      }
    }
    mine.push({
      sha: short,
      subject: subject.join(" "),
      work: files.some((f) => !f.startsWith("hub/")),
      log,
      src: files.some((f) => f.startsWith("src/")),
      structure: files.some((f) => f === "hub/STRUCTURE.md" || f === "scripts/structure.json") || structureNote,
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

  const parts = [];
  if (mode === "compact") {
    parts.push(
      "[허브] 대화가 압축되어 세부 내용이 줄었다. 이어가기 전에 이 채팅이 맡은 역할의 `hub/roles/<역할>.md`를 다시 읽어라.",
    );
    const mine = commitsSince(existing?.base, existing?.startedAt);
    if (mine.length) {
      parts.push("이 채팅에서 지금까지 한 커밋:\n" + mine.map((c) => `- ${c.sha} ${c.subject}`).join("\n"));
    }
    const missing = unrecorded(mine);
    if (missing.length) {
      parts.push(
        `이 중 ${missing.length}개는 아직 hub/log에 인계 기록이 없다. 지금 바로 hub/log/YYYY-MM.md에 한 항목을 남기고 역할 파일의 열린 일을 고쳐 커밋하라.`,
      );
    }
  } else {
    parts.push(
      "[허브] 이 저장소는 채팅을 역할(dev/qa/store)로 나누고 기억은 hub/에 둔다. 요청에 맞는 `hub/roles/<역할>.md`를 읽고 시작하고, 끝날 때 역할 파일과 hub/log에 남겨라 (hub/README.md). " +
        "코드를 고치기 전에 hub/STRUCTURE.md(앱 전체구조, CLAUDE.md가 불러옴)에서 영역과 영향 범위를 보고, 고친 커밋에서 구조도 고친다.",
    );
  }
  const inbox = inboxLines();
  if (inbox.length) parts.push("역할끼리 넘긴 일 (hub/inbox.md):\n" + inbox.join("\n"));
  const handoffs = lastHandoffs();
  if (handoffs) parts.push("최근 인계 기록 (hub/log):\n" + handoffs);
  process.stdout.write(parts.join("\n\n") + "\n");
  process.exit(0);
}

/**
 * App code changed without the structure being looked at: no commit of this
 * chat touched hub/STRUCTURE.md or scripts/structure.json, and no handoff said
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

if (mode === "stop") {
  if (input.stop_hook_active) process.exit(0);
  const state = readState(input.session_id);
  const commits = commitsSince(state?.base, state?.startedAt);
  const missing = unrecorded(commits);
  const unchecked = structureUnchecked(commits);
  const mapProblems = commits.some((c) => c.src) ? structureMapProblems() : "";
  if (missing.length === 0 && unchecked.length === 0 && !mapProblems) process.exit(0);

  const reasons = [];
  if (missing.length) {
    reasons.push(
      "이 채팅에서 커밋한 작업이 허브에 인계되지 않았다:\n" +
        missing.map((c) => `- ${c.sha} ${c.subject}`).join("\n") +
        "\n\n끝내기 전에: hub/log/YYYY-MM.md에 한 항목(한 일 / 남긴 일 / 커밋), 해당 역할 파일의 열린 일 갱신, " +
        "다른 역할에 넘길 것은 hub/inbox.md에 한 줄. 그다음 커밋하고 푸시한 브랜치에 같이 올려라. " +
        "형식은 hub/README.md와 hub/log 맨 위. 화면·기능·한도가 바뀌었으면 PRODUCT.md도 같이 고쳐라.",
    );
  }
  if (unchecked.length) {
    reasons.push(
      "앱 코드(src/)를 바꿨는데 전체구조(hub/STRUCTURE.md)를 확인한 흔적이 없다:\n" +
        unchecked.map((c) => `- ${c.sha} ${c.subject}`).join("\n") +
        "\n\n화면 흐름·탭·영역이 바뀌었으면 hub/STRUCTURE.md 위쪽(손으로 쓴 부분)을 고치고, 새 화면 파일·API·페이지는 " +
        "scripts/structure.json에 영역을 넣은 뒤 node scripts/structure.mjs. 구조가 그대로면 hub/log 항목에 " +
        "\"- 구조: 변화 없음\" 한 줄. 커밋하고 푸시하라.",
    );
  }
  if (mapProblems) {
    reasons.push("전체구조 자리표가 코드와 어긋난다 (CI structure도 실패한다):\n" + mapProblems);
  }
  process.stdout.write(JSON.stringify({ decision: "block", reason: reasons.join("\n\n") }));
  process.exit(0);
}

process.exit(0);
