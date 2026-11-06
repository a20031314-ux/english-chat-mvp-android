/**
 * 남이 쓴 예문의 출처 목록(CC BY 표시)을 public/credits/example-sentences.txt로 만든다.
 * word-sentences/<언어>.json 문장의 src "tatoeba:<번호>/<작성자> en:<번호>/<작성자>"에서.
 * Run: node scripts/credits-sentences.mjs
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
const DIR = path.join(process.cwd(), "src/lib/curriculum/word-sentences");
const lines = [];
const authors = new Map();
const shared = {};
for (const file of readdirSync(DIR).filter((f) => f.endsWith(".json")).sort()) {
  const book = JSON.parse(readFileSync(path.join(DIR, file), "utf8"));
  for (const list of Object.values(book)) for (const s of list) {
    if (s.src === "krdict" || s.src === "wiktionary") { (shared[s.src] ??= []).push(`${file.replace(".json", "")}\t${s.text}`); continue; }
    if (!s.src?.startsWith("tatoeba:")) continue;
    const parts = s.src.split(" ").map((p) => p.replace(/^(tatoeba|en):/, ""));
    for (const p of parts) { const [, by] = p.split("/"); if (by) authors.set(by, (authors.get(by) ?? 0) + 1); }
    lines.push(`${file.replace(".json", "")}\t${parts.map((p) => { const [id, by] = p.split("/"); return `#${id} ${by || "(unknown)"}`; }).join("\t")}\t${s.text}`);
  }
}
const head = [
  "Example sentences from Tatoeba (https://tatoeba.org)",
  "License: Creative Commons Attribution 2.0 France (CC BY 2.0 FR) — https://creativecommons.org/licenses/by/2.0/fr/",
  "Each line: language, sentence number and author, English translation number and author, sentence.",
  "Sentence page: https://tatoeba.org/sentences/show/<number>",
  "Korean translations by languagebank.",
  "",
  `Authors (${authors.size}): ${[...authors.keys()].sort((a, b) => a.localeCompare(b)).join(", ")}`,
  "",
];
const tail = [
  "",
  "Example sentences from the Basic Korean Dictionary (한국어기초사전, https://krdict.korean.go.kr), National Institute of Korean Language",
  "License: Creative Commons Attribution-ShareAlike 2.0 Korea (CC BY-SA 2.0 KR) — https://creativecommons.org/licenses/by-sa/2.0/kr/",
  "English translations by languagebank, shared under the same license.",
  "",
  ...(shared.krdict ?? []),
  "",
  "Example sentences from Wiktionary (https://www.wiktionary.org), Wiktionary contributors",
  "License: Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0) — https://creativecommons.org/licenses/by-sa/4.0/",
  "Korean translations by languagebank, shared under the same license.",
  "",
  ...(shared.wiktionary ?? []),
];
lines.push(...tail);
mkdirSync(path.join(process.cwd(), "public/credits"), { recursive: true });
writeFileSync(path.join(process.cwd(), "public/credits/example-sentences.txt"), `${[...head, ...lines].join("\n")}\n`);
console.log(`문장 ${lines.length - tail.length} · 작성자 ${authors.size} · 한국어기초사전 ${shared.krdict?.length ?? 0} · 위키낱말사전 ${shared.wiktionary?.length ?? 0}`);
