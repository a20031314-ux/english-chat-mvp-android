// 홍보 쇼츠 "문장 뜯어보기" 편 녹화: 학습 언어로 한 줄 → 튜터 답 → 튜터 줄을 눌러 "분석" → 문장분석 시트가 다 그려질 때까지.
// 결과: tmp/promo/analyze/<locale>/raw.mp4 + events.json(장면 시각, 분석한 문장, 시트 위치).
// 그다음 node store-shots/promo/make.mjs analyze <locale>. 학습 조합은 combos.mjs LEARN.
//
// Run: node --experimental-strip-types store-shots/promo/record-analyze.mjs en
import path from "node:path";
import { LEARN } from "./combos.mjs";
import { exactly, loadCopy, record } from "./harness.mjs";

const locale = process.argv[2] || "en";
const target = LEARN[locale];
if (!target) throw new Error(`no learning language for ${locale}`);
const ROOT = process.cwd();

/** 학습 언어로 맞게 쓴 한 줄 — 튜터가 학습 언어로 길게 답하게. */
const OPENER = {
  ko: "주말에 친구랑 홍대에 갔는데 사람이 정말 많았어요.",
  en: "I went to a concert last night and it was amazing.",
  ja: "週末に友達と渋谷に行ったら、人がすごく多かったです。",
  es: "Anoche fui a un concierto y fue increíble.",
};
const line = process.env.PROMO_LINE || OPENER[target];
/** 고른 부분에 대해 직접 묻는 질문 — 실제로 궁금할 법한, 고른 말이 무엇이든 통하는 것(말투·쓰임). */
const QUESTION = {
  en: "Can I say this to my boss?",
  es: "¿Puedo usar esto en un correo formal?",
  ko: "이거 선배한테 써도 돼?",
  ja: "これ、先輩に使っても大丈夫？",
  ar: "هل أستطيع قول هذا لمديري؟",
  id: "Boleh aku pakai ini ke atasan?",
  vi: "Mình nói câu này với sếp được không?",
  th: "พูดแบบนี้กับหัวหน้าได้ไหม",
};
const ui = (await loadCopy(ROOT))[locale];
const day = new Date().toISOString().slice(0, 10).replace(/-/g, "");

const events = await record({
  root: ROOT,
  out: path.join(ROOT, "tmp", "promo", "analyze", locale),
  user: `promo-analyze-${day}-${locale}-${process.pid}`,
  locale,
  target,
  port: 4293,
  scene: async (page, { tap, mark, events, startScreencast }) => {
    events.sent = line;
    await page.locator("textarea:visible").first().waitFor();
    await page.waitForTimeout(2500);
    await startScreencast();
    await page.waitForTimeout(1200);
    await tap(page.locator("textarea:visible").first());
    mark("typeStart");
    await page.keyboard.type(line, { delay: 60 });
    await page.waitForTimeout(300);
    await tap(page.getByRole("button", { name: exactly(ui.send) }));
    mark("sentAt");
    // 튜터 줄: 어두운 말풍선(role=button, 왼쪽). 답이 다 올 때까지(글이 1.5초 그대로).
    const tutor = page.locator('div[role="button"].rounded-bl-sm');
    await tutor.first().waitFor({ timeout: 90000 });
    let prev = "";
    for (let i = 0; i < 40; i++) {
      const now = await tutor.last().innerText();
      if (now && now === prev) break;
      prev = now;
      await page.waitForTimeout(750);
    }
    mark("reply");
    events.reply = prev;
    await page.waitForTimeout(1200);
    await tap(tutor.last());
    mark("lineTap");
    const analyze = page.getByRole("button", { name: exactly(ui.insightAnalyze) });
    await analyze.last().waitFor();
    await page.waitForTimeout(900);
    await tap(analyze.last());
    // 여러 문장이면 고르는 목록 — 가장 긴 문장(설명할 거리가 많은 것).
    await page.waitForTimeout(700);
    const dialogNow = await page.locator('[role="dialog"]').count();
    if (!dialogNow) {
      const choices = page.locator('button[dir="auto"].truncate');
      const n = await choices.count();
      if (n) {
        let best = 0;
        let bestLen = -1;
        for (let i = 0; i < n; i++) {
          const t = (await choices.nth(i).innerText()).trim();
          if (t.length > bestLen) {
            best = i;
            bestLen = t.length;
          }
        }
        events.picked = (await choices.nth(best).innerText()).trim();
        await page.waitForTimeout(500);
        await tap(choices.nth(best));
      }
    }
    mark("analyzeTap");
    const dialog = page.locator('[role="dialog"]').last();
    await dialog.waitFor({ timeout: 60000 });
    mark("sheet");
    // 시트 글이 2초 그대로면 다 그려진 것.
    let last = "";
    let steady = 0;
    for (let i = 0; i < 80 && steady < 4; i++) {
      const now = await dialog.innerText();
      steady = now === last ? steady + 1 : 0;
      last = now;
      await page.waitForTimeout(500);
    }
    mark("loaded");
    events.sheetText = last.slice(0, 600);
    const box = await dialog.boundingBox();
    if (box) events.sheetBox = { x: box.x / 412, y: box.y / 915, w: box.width / 412, h: box.height / 915 };
    await page.waitForTimeout(1500);
    // 문장 일부 고르기(사용자 2026-10-26): 점 줄을 끌어 끝부분 두세 낱말(어미·조사가 모이는 곳)을 고른다.
    const slider = dialog.locator('[role="slider"]').first();
    const count = Number(await slider.getAttribute("aria-valuemax")) + 1;
    const sb = await slider.boundingBox();
    const endIdx = Math.max(0, count - (count > 4 ? 2 : 1));
    const startIdx = Math.max(0, endIdx - (count > 6 ? 2 : 1));
    const dotX = (k) => sb.x + ((k + 0.5) / count) * sb.width;
    const y = sb.y + sb.height / 2;
    await page.mouse.move(dotX(startIdx), y);
    mark("pickStart");
    await page.mouse.down();
    for (let k = 1; k <= 12; k++) {
      await page.mouse.move(dotX(startIdx) + ((dotX(endIdx) - dotX(startIdx)) * k) / 12, y);
      await page.waitForTimeout(45);
    }
    await page.mouse.up();
    mark("picked");
    await page.waitForTimeout(1600);
    events.pickedText = (await dialog.innerText()).slice(0, 300);
    // 구체적인 질문을 직접 쓴다.
    const askBox = dialog.locator("textarea").first();
    await askBox.scrollIntoViewIfNeeded();
    await tap(askBox);
    mark("askType");
    await page.keyboard.type(QUESTION[locale] ?? QUESTION.en, { delay: 55 });
    await page.waitForTimeout(500);
    await tap(dialog.getByRole("button", { name: exactly(ui.askSend) }).first());
    mark("askTap");
    const before = await dialog.innerText();
    let text = before;
    steady = 0;
    for (let i = 0; i < 120 && steady < 4; i++) {
      await page.waitForTimeout(500);
      const now = await dialog.innerText();
      if (now === before || now.includes(ui.askLoading)) continue;
      steady = now === text ? steady + 1 : 0;
      text = now;
    }
    mark("answer");
    events.answerText = text.slice(0, 1200);
    await page.mouse.move(206, 600);
    for (let i = 0; i < 6; i++) {
      await page.mouse.wheel(0, 60);
      await page.waitForTimeout(150);
    }
    await page.waitForTimeout(2600);
    // My로 이어짐: 🔎 My에서 찾기 → My 단계 보기의 그 칸.
    const find = dialog.getByRole("button", { name: new RegExp(ui.findInMy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) }).first();
    await find.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    mark("findShown");
    await tap(find);
    mark("findTap");
    // 찾는 중… → My 화면의 칸 시트. 화면이 2초 그대로면 도착.
    let shot = "";
    steady = 0;
    for (let i = 0; i < 60 && steady < 4; i++) {
      await page.waitForTimeout(500);
      const now = await page.locator("body").innerText();
      if (now.includes(ui.findInMyBusy)) continue;
      steady = now === shot ? steady + 1 : 0;
      shot = now;
    }
    mark("myShown");
    events.myText = (await page.locator('[role="dialog"]').last().innerText().catch(() => "")).slice(0, 400);
    await page.waitForTimeout(2200);
    // 이 장면 넣기 → 그 칸에 카드로 남는다.
    const addMoment = page.getByRole("button", { name: exactly(ui.notebookQuestionAdd) }).first();
    if (await addMoment.isVisible().catch(() => false)) {
      await tap(addMoment);
      mark("momentAdded");
    }
    await page.waitForTimeout(3000);
  },
});
console.log(JSON.stringify(events, null, 2));
