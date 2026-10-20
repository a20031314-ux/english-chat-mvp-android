import { chromium } from "playwright";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: 390, height: 900 } });
await p.goto("file://" + process.argv[2]);
console.log(await p.evaluate(() => { const w = document.documentElement.clientWidth; return [document.documentElement.scrollWidth, [...document.querySelectorAll("body *")].filter(e => e.getBoundingClientRect().right > w + 1 && !e.closest(".table-scroll") && !e.closest("pre")).slice(0,6).map(e => e.tagName + "." + e.className + ":" + (e.textContent||"").slice(0,40))]; }));
await b.close();
