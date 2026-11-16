import fs from "node:fs"; import path from "node:path";
const { guideSlides } = await import(path.resolve("src/lib/guide/slides.ts"));
const chapter = process.argv[2] || "ai-call", tabName = process.argv[3] || "AI 튜터와 통화";
const names = { "{ui:callModeTalk}": "자유대화", "{ui:callModeStudy}": "수업", "{ui:callModeGame}": "게임", "{ui:gameTeach}": "가르치기", "{ui:callRecordsTitle}": "통화 기록", "{ui:keepTitle}": "Quizbank", "{ui:languagebankTitle}": "Languagebank", "{ui:logbankTitle}": "Logbank" };
const fill = (t) => t.replace(/\{ui:\w+\}/g, (m) => names[m] ?? m);
const groups = guideSlides("ko")[chapter];
const data = {}; const banks = [];
for (const g of groups) { banks.push([g.id, fill(g.title)]); data[g.id] = g.slides.map((s) => ({ title: s.title, src: "data:image/webp;base64," + fs.readFileSync(`public/guide/ko/${s.shot}.webp`).toString("base64") })); }
const tabs = ["My", "AI 튜터", "AI 튜터와 통화", "대화", "영상 학습", "사람", "Room"].map((t) => `<button class="chip ${t === tabName ? "on" : ""}" ${t === tabName ? "" : "disabled"}>${t}</button>`).join("");
const tpl = fs.readFileSync("tmp/guide-my/my-guide-preview.html", "utf8");
let html = tpl.replace(/<div class="row">.*?<\/div>/s, `<div class="row">${tabs}</div>`)
  .replace(/const BANKS=.*?;let bank/s, `const BANKS=${JSON.stringify(banks)},DATA=${JSON.stringify(data)};let bank`)
  .replace("<title>My 탭 사용법 미리보기</title>", `<title>${tabName} 사용법 미리보기</title>`);
fs.writeFileSync(`tmp/guide-slides/${chapter}-preview.html`, html); console.log(banks.map((b) => b[1] + " " + data[b[0]].length).join(" · "));
