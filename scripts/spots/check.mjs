// 틀린 곳 데이터 검사·합치기(퀴즈 다시 짜기 2단계, scripts/spots/README.md).
//   node --experimental-strip-types scripts/spots/check.mjs <언어|all>              → spot-errors·story-errors 파일 검사
//   node --experimental-strip-types scripts/spots/check.mjs <언어> --index <json>    → 판정한 색인을 sentence-index/<언어>.json으로
//   node --experimental-strip-types scripts/spots/check.mjs <언어> --try <json>      → 형식만 보기(합치지 않음)
//   node --experimental-strip-types scripts/spots/check.mjs <언어> --merge <json>    → 판정 통과 묶음을 그 언어 파일에 더함(형식 통과·id 겹침 없음만)
import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const { spotProblems } = await import(path.join(root, "src/lib/curriculum/spotErrors.ts"));
const LANGS = ["en", "es", "fr", "it", "pt", "ru", "ar", "hi", "id", "vi", "th", "ja", "zh", "ko"];
const fileOf = (lang, kind) => path.join(root, `src/lib/curriculum/${kind}/${lang}.json`);
const read = (file) => (fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : []);
const kindOf = (item) => (item.shape?.startsWith("P") ? "story-errors" : "spot-errors");
const [arg, flag, from] = process.argv.slice(2);
if (flag === "--index") {
  // 판정한 색인 → src/lib/curriculum/sentence-index/<언어>.json(사전 예문에 있는 ref만, 칸 열쇠 g|·e|만).
  const lang = arg;
  const idx = JSON.parse(fs.readFileSync(from, "utf8"));
  const book = JSON.parse(fs.readFileSync(path.join(root, `src/lib/curriculum/word-sentences/${lang}.json`), "utf8"));
  const out = {};
  let bad = 0;
  for (const [key, refs] of Object.entries(idx)) {
    if (!/^(g\|\d+:\d+|e\|.+)$/.test(key)) { bad++; continue; }
    const keep = [...new Set(refs)].filter((ref) => { const at = ref.lastIndexOf("#"); return Boolean(book[ref.slice(0, at)]?.[Number(ref.slice(at + 1))]); });
    bad += refs.length - keep.length;
    if (keep.length) out[key] = keep;
  }
  fs.writeFileSync(path.join(root, `src/lib/curriculum/sentence-index/${lang}.json`), JSON.stringify(out) + "\n");
  console.log(`색인 ${lang}: 칸 ${Object.keys(out).length} · ref ${Object.values(out).reduce((n, list) => n + list.length, 0)} · 뺌 ${bad}`);
} else if (flag === "--try") {
  // 에이전트 스스로 보기: 파일을 합치지 않고 형식만.
  const list = JSON.parse(fs.readFileSync(from, "utf8"));
  let bad = 0;
  for (const item of list) {
    const problems = spotProblems(item, arg);
    if (problems.length) { bad++; console.log(`✗ ${item.id}: ${problems.join(", ")}`); }
  }
  console.log(`${list.length}개 중 형식 문제 ${bad}`);
} else if (flag === "--merge") {
  const lang = arg;
  const incoming = JSON.parse(fs.readFileSync(from, "utf8"));
  const out = { "spot-errors": read(fileOf(lang, "spot-errors")), "story-errors": read(fileOf(lang, "story-errors")) };
  const ids = new Set([...out["spot-errors"], ...out["story-errors"]].map((one) => one.id));
  const lines = new Set([...out["spot-errors"], ...out["story-errors"]].map((one) => one.lines.join("\n")));
  let added = 0;
  for (const item of incoming) {
    const problems = spotProblems(item, lang);
    if (problems.length) { console.log(`뺌 ${item.id}: ${problems.join(", ")}`); continue; }
    if (ids.has(item.id) || lines.has(item.lines.join("\n"))) { console.log(`뺌 ${item.id}: 겹침`); continue; }
    ids.add(item.id); lines.add(item.lines.join("\n"));
    out[kindOf(item)].push(item); added++;
  }
  for (const kind of Object.keys(out)) if (out[kind].length) fs.writeFileSync(fileOf(lang, kind), JSON.stringify(out[kind], null, 0).replace(/\},\{"id"/g, '},\n{"id"') + "\n");
  console.log(`넣음 ${added}/${incoming.length}`);
} else {
  let bad = 0;
  for (const lang of arg === "all" || !arg ? LANGS : [arg]) {
    for (const kind of ["spot-errors", "story-errors"]) {
      const list = read(fileOf(lang, kind));
      if (!list.length) continue;
      const counts = {};
      for (const item of list) {
        const problems = spotProblems(item, lang);
        if (problems.length) { bad++; console.log(`✗ ${lang} ${item.id}: ${problems.join(", ")}`); }
        const k = `${item.shape}/${item.errors.map((e) => e.type[0]).join("")}`;
        counts[k] = (counts[k] ?? 0) + 1;
      }
      console.log(`${lang} ${kind} ${list.length} — ${Object.entries(counts).map(([k, n]) => `${k} ${n}`).join(" · ")}`);
    }
  }
  if (bad) process.exitCode = 1;
}
