// 틀린 곳 데이터·문장 색인 에이전트용 재료(scripts/spots/README.md).
//   node --experimental-strip-types scripts/spots/plan.mjs <언어>
// → 표준 출력: 단계마다 문법 칸(g|단계:번호 · 이름 · 예문) · 표현 수
// → tmp/spots/<언어>.sentences.tsv: ref(w|낱말#0) \t 낱말 단계 \t 문장 \t en \t 흐름 단서(1이면 en에 because·but·so… 있음)
import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const lang = process.argv[2];
if (!lang) throw new Error("언어");
const { ladderFor } = await import(path.join(root, "src/lib/curriculum/stages/index.ts"));
const { stageOfRank } = await import(path.join(root, "src/lib/curriculum/vocabBank.ts"));
const { WORDS } = await import(path.join(root, `src/lib/curriculum/vocab/${lang}.ts`));
const rank = new Map(WORDS.map((row, i) => [String(row[0]).toLocaleLowerCase(), i]));
const ladder = ladderFor(lang);
for (const stage of ladder.stages) {
  console.log(`\n## ${stage.order}단계 — ${stage.title.ko ?? stage.title.en} · 표현 ${stage.expressions.length}`);
  stage.grammar.forEach((g, i) => console.log(`g|${stage.order}:${i}\t${g.name.ko ?? ""} / ${g.name.en}\t${g.example}`));
}
const dict = JSON.parse(fs.readFileSync(path.join(root, `src/lib/curriculum/word-sentences/${lang}.json`), "utf8"));
const CLUE = /\b(because|since|as a result|so that|so\b|that's why|therefore|due to|because of|thanks to|but|although|though|even though|however|despite|in spite of|yet|instead|while|so \w+ that|too \w+ to|enough to|if|unless|otherwise)\b/i;
const rows = [];
for (const [key, list] of Object.entries(dict)) {
  const r = rank.get(key.slice(2).toLocaleLowerCase());
  const st = r === undefined ? 9 : stageOfRank(lang, r);
  (list ?? []).forEach((one, i) => {
    if (!one?.text) return;
    rows.push([`${key}#${i}`, st, one.text.replace(/\s+/g, " "), (one.en ?? "").replace(/\s+/g, " "), CLUE.test(one.en ?? "") ? 1 : 0].join("\t"));
  });
}
fs.mkdirSync(path.join(root, "tmp/spots"), { recursive: true });
fs.writeFileSync(path.join(root, `tmp/spots/${lang}.sentences.tsv`), rows.join("\n") + "\n");
console.log(`\n문장 ${rows.length} → tmp/spots/${lang}.sentences.tsv (단서 ${rows.filter((r) => r.endsWith("\t1")).length})`);
