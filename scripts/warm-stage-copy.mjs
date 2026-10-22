#!/usr/bin/env node
/**
 * 단계 범위·글자 기초 화면 글을 모든 학습 언어 × 앱 언어로 미리 옮겨 둔다(stagecopy:v1, server/stageCopy.ts).
 * 처음 연 사람이 10~20초 기다리지 않게 — 데이터 version을 올리거나 새 언어를 더한 뒤 한 번.
 *   NODE_USE_ENV_PROXY=1 node scripts/warm-stage-copy.mjs [--api https://…] [--only stages|script]
 * 점검 사용자(simcheck-warmcopy-…)로 부르고 끝나면 그 사용자 데이터를 지운다(옮긴 글은 모두 함께 쓰는 것이라 남음).
 */
const args = process.argv.slice(2);
const value = (name, fallback) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : fallback; };
const API = value("api", "https://english-chat-mvp.vercel.app").replace(/\/$/, "");
const only = value("only", "");
const LANGS = ["en", "ja", "ko", "es", "zh", "vi", "fr", "it", "pt", "ru", "id", "ar", "th", "hi"];
const uid = `simcheck-warmcopy-${Date.now()}`;
const headers = { "content-type": "application/json", "x-rc-user": uid };
const jobs = [];
for (const lang of LANGS) for (const ui of LANGS) {
  if (ui === "en" || ui === "ko" || ui === lang) continue;
  if (only !== "script") jobs.push(`/api/curriculum/stages?lang=${lang}&ui=${ui}`);
  if (only !== "stages") jobs.push(`/api/curriculum/script?lang=${lang}&ui=${ui}`);
}
let failed = 0;
async function worker() {
  while (jobs.length) {
    const path = jobs.shift();
    const started = Date.now();
    try {
      const response = await fetch(API + path, { headers });
      const body = await response.json();
      const sample = body.stages?.[0]?.title ?? body.course?.title ?? "";
      console.log(response.status, `${Date.now() - started}ms`, path.replace("/api/curriculum/", ""), sample.slice(0, 40));
      if (!response.ok) failed += 1;
    } catch (error) {
      failed += 1;
      console.log("ERR", path, String(error).slice(0, 80));
    }
  }
}
await Promise.all(Array.from({ length: 4 }, worker));
await fetch(`${API}/api/simcheck/forget`, { method: "POST", headers, body: JSON.stringify({ prefix: uid.replace("simcheck-", "") }) }).catch(() => undefined);
console.log(failed ? `실패 ${failed}` : "모두 200");
