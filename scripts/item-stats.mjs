#!/usr/bin/env node
/**
 * 시험 문제 난이도 보고(lib/curriculum/itemStats.ts): 운영 서버의 모두의 통계를 언어마다 받아
 * 막힌 문제(맞힌 몫 15% 아래 — 문제·보기가 헷갈리게 짜였을 수 있음)·쉬운 문제(95% 위)·통계가 쌓인 문제 수를 보인다.
 *   node scripts/item-stats.mjs [언어…] [--min=20]
 * 막힌 문제는 그 열쇠의 대본·틀(stageScripts·frames)이나 퀴즈 보기(quiz.ts)를 먼저 본다.
 */
const API = process.env.API_BASE ?? "https://english-chat-mvp.vercel.app";
const LANGS = ["en", "ko", "ja", "zh", "es", "fr", "it", "pt", "ru", "id", "vi", "th", "ar", "hi"];
const args = process.argv.slice(2);
const min = Number(args.find((a) => a.startsWith("--min="))?.slice(6) ?? 20);
const langs = args.filter((a) => !a.startsWith("--"));
for (const lang of langs.length ? langs : LANGS) {
  const body = await fetch(`${API}/api/curriculum/scripts?lang=${lang}&itemStats=1`).then((r) => r.json()).catch(() => null);
  const rows = Object.entries(body?.stats ?? {}).map(([key, [right, n]]) => ({ key, right, n, rate: n ? right / n : 0 }));
  const enough = rows.filter((row) => row.n >= min);
  const stuck = enough.filter((row) => row.rate < 0.15).sort((a, b) => a.rate - b.rate);
  const easy = enough.filter((row) => row.rate > 0.95);
  const answers = rows.reduce((sum, row) => sum + row.n, 0);
  console.log(`${lang}: 문제 ${rows.length} · 답 ${answers} · 판단 ${enough.length} · 막힘 ${stuck.length} · 쉬움 ${easy.length}`);
  for (const row of stuck.slice(0, 10)) console.log(`  막힘 ${row.key}  ${row.right}/${row.n}`);
}
