// 문장 색인 1단계: 운영 서버의 낱말 카드 예문을 언어마다 모두 받아 tmp/sentence-index/<언어>.cards.json에 둔다.
//   node scripts/sentence-index/fetch.mjs es [ui=ko]
// 카드는 서버에 이미 만들어진 것을 읽기만 한다(그 앱 언어로 처음 여는 묶음이면 서버가 뜻을 옮김 — 앱 언어는 대개 만들어진 ko).
import fs from "node:fs";
import path from "node:path";
const [lang = "es", ui = "ko"] = process.argv.slice(2);
const API = "https://www.languagebank.net/api/curriculum/words";
const out = path.join(process.cwd(), "tmp/sentence-index");
fs.mkdirSync(out, { recursive: true });
const { WORDS } = await import(path.join(process.cwd(), `src/lib/curriculum/vocab/${lang}.ts`));
const chunks = Math.ceil(WORDS.length / 50);
const cards = [];
let next = 0;
async function worker() {
  while (next < chunks) {
    const c = next++;
    for (let tries = 0; tries < 3; tries++) {
      try {
        const r = await fetch(`${API}?lang=${lang}&ui=${ui}&chunk=${c}`, { headers: { "x-app-version": "2.80.0" } });
        const body = await r.json();
        for (const card of body.cards ?? []) if (card.example) cards.push({ w: card.w, example: card.example, piece: card.piece, gloss: card.exampleGloss ?? "" });
        break;
      } catch {
        await new Promise((ok) => setTimeout(ok, 1500));
      }
    }
  }
}
await Promise.all([worker(), worker(), worker(), worker()]);
fs.writeFileSync(path.join(out, `${lang}.cards.json`), JSON.stringify(cards));
console.log(`${lang}: 묶음 ${chunks} · 카드 예문 ${cards.length}`);
