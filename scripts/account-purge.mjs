/**
 * 지운 계정의 학습 기록을 지금 지운다 (매주 크론 /api/account/purge와 같은 일).
 * 자세한 이유: src/lib/server/accountPurge.ts.
 *
 * Run:
 *   npm run account:purge              (지울 것만 보여 줌)
 *   npm run account:purge -- --apply   (실제로 지움)
 *
 * KV_REST_API_URL / KV_REST_API_TOKEN 필요(환경 변수 또는 .env.local).
 */
import { readFileSync } from "node:fs";

function loadEnvFromFile() {
  if (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) return;
  try {
    for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
      const at = line.indexOf("=");
      if (at === -1) continue;
      const key = line.slice(0, at).trim();
      const value = line.slice(at + 1).trim().replace(/^"|"$/g, "");
      if (key && !process.env[key]) process.env[key] = value;
    }
  } catch {
    // KV 층이 저장소 없이 돈다고 알린다.
  }
}
loadEnvFromFile();

const { purgeDeletedAccounts } = await import("../src/lib/server/accountPurge.ts");
const report = await purgeDeletedAccounts({ apply: process.argv.includes("--apply"), log: console.log });
console.log(
  report.preview
    ? `미리 보기: 계정 ${report.ids}개, 키 ${report.keys}개. --apply로 지움.`
    : `끝: 계정 ${report.ids}개, 키 ${report.keys}개 지움, 다음으로 미룬 것 ${report.requeued}개.`,
);
