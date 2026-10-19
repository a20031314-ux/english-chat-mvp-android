/**
 * 의견함 카드가 반영·완료되면, 그 카드에 묶인 사람들에게 반영 소식을 보낸다(한 번에).
 *
 *   FEEDBACK_KEY=… node scripts/feedback-notify.mjs <소식 JSON 파일>
 *
 * 파일 모양(tmp/feedback/에 두고 커밋하지 않음 — 보낸 사람 해시가 들어 있다):
 *   {
 *     "card": "kbd-hide",
 *     "appVersion": "2.70",            // 앱 빌드가 필요한 수정이면 그 버전, 서버만이면 ""
 *     "texts": { "ko": "…", "ja": "…" },  // 받는 사람들의 UI 언어마다 한 줄(없는 언어는 영어 → 한국어)
 *     "recipients": [{ "sender": "<16자 해시>", "uiLocale": "ja" }]  // 의견함 카드 senders
 *   }
 * 그림 언어(shots)는 public/feedback-fix/<card>/ 아래 before·after가 둘 다 있는 언어로 저절로 채운다.
 * 보내기 전에 그 그림이 운영 사이트에 올라가 있는지(PR이 병합·배포됐는지) 확인한다.
 * 같은 카드를 다시 보내도 이미 받은 사람은 건너뛴다(완료 뒤 새로 같은 의견을 보낸 사람만 새로 받음).
 */
import fs from "node:fs";
import path from "node:path";

const API = process.env.API_BASE || "https://english-chat-mvp.vercel.app";
const KEY = process.env.FEEDBACK_KEY;
const file = process.argv[2];
if (!KEY || !file) {
  console.error("사용법: FEEDBACK_KEY=… node scripts/feedback-notify.mjs <소식 JSON>");
  process.exit(2);
}
const body = JSON.parse(fs.readFileSync(file, "utf8"));
const dir = path.join(process.cwd(), "public", "feedback-fix", body.card);
const shots = fs.existsSync(dir)
  ? fs.readdirSync(dir).filter((locale) => ["before", "after"].every((s) => fs.existsSync(path.join(dir, locale, `${s}.webp`))))
  : [];

for (const locale of shots) {
  const url = `${API}/feedback-fix/${body.card}/${locale}/after.webp`;
  const head = await fetch(url, { method: "HEAD" }).catch(() => null);
  if (!head?.ok) {
    console.error(`그림이 아직 운영에 없습니다: ${url} — PR 병합·배포 뒤 다시`);
    process.exit(1);
  }
}

const response = await fetch(`${API}/api/feedback/fixed`, {
  method: "POST",
  headers: { "content-type": "application/json", "x-feedback-key": KEY },
  body: JSON.stringify({ ...body, shots }),
});
const result = await response.json().catch(() => ({}));
if (!response.ok) {
  console.error(`실패 ${response.status}: ${JSON.stringify(result)}`);
  process.exit(1);
}
console.log(`보냄 ${result.sent}명, 이미 받은 사람 ${result.skipped}명, 그림 언어 ${shots.join(",") || "없음"}`);
