// 포트폴리오 표지·기능 장(2026-11-18). 저장소 밖 빈 폴더에서 playwright 설치 뒤 shoot.mjs → call.mjs → build.mjs 순서(경로 raw/·out/은 그 폴더 기준, shoot.mjs의 OUT도 맞춰 고칠 것). 운영 웹을 찍고 시험 사용자 simcheck-portfolio-…는 끝에 지움. Logbank 숫자·곡선은 이 폰 장부에 넣은 보여 주기용 기록.
import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, colorScheme: "dark" });
const p = await ctx.newPage();
const why = encodeURIComponent("어제 일이라 go가 아니라 went예요.");
for (const [n, qs] of [["call-fix", `v=ai&card=fix&quiet=1&why=${why}`], ["call-cap", `v=ai&caption=1&meaning=1`]]) {
  await p.goto(`https://www.languagebank.net/dev/call-preview?${qs}&lang=ko&learn=en`); await p.waitForTimeout(5000);
  await p.screenshot({ path: `raw/${n}.png` });
}
await b.close();
