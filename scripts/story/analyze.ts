// 이야기 → 문장 나눔(모든 언어 — 문법·표현 칸은 규칙 파일이 있는 언어만). node --experimental-strip-types scripts/story/analyze.ts <언어> <이야기.tsv>  — 줄: 이야기\t문장\ten\tko\t낱말=꼴;…  → 문장마다 낱말·문법(es 규칙)·표현·문장구조, 낱말마다 예문 둘 나눔, tmp/story/<언어>/<파일>.merge.json(→ word-sentences.ts --merge … --src made)
import fs from "node:fs";
import path from "node:path";
import { pieceAt, pieceTwice } from "../../src/lib/curriculum/quiz.ts";
import { framesInLine } from "../../src/lib/roleplay/recap.ts";
import { ladderFor } from "../../src/lib/curriculum/stages/index.ts";
const [lang, file] = process.argv.slice(2);
const root = process.cwd();
// 문법·표현 규칙은 있는 언어만(지금 es). 없으면 그 칸만 건너뛰고 낱말 나눔·빈칸 검사는 한다.
const rulesFile = path.join(root, `scripts/sentence-index/${lang}-rules.mjs`);
const rules = fs.existsSync(rulesFile) ? await import(rulesFile) : { makeForms: () => null, grammarKeys: () => [], expressionKeys: () => [] };
const { WORDS } = await import(path.join(root, `src/lib/curriculum/vocab/${lang}.ts`));
const traitsFile = path.join(root, `src/lib/curriculum/word-traits/${lang}.json`);
const traits = fs.existsSync(traitsFile) ? JSON.parse(fs.readFileSync(traitsFile, "utf8")) : {};
const forms = rules.makeForms(WORDS.filter((one: string[]) => one[1] === "verb").map((one: string[]) => one[0]));
const nouns = Object.fromEntries(Object.entries(traits as Record<string, { g?: string }>).filter(([, t]) => t.g === "m" || t.g === "f").map(([w, t]) => [w, t.g]));
const ladder = ladderFor(lang);
const exprs = ladder ? ladder.stages.flatMap((s) => s.expressions) : [];
const gname = (key: string) => { const [st, i] = key.slice(2).split(":").map(Number); return ladder?.stages.find((s) => s.order === st)?.grammar[i]?.name.ko ?? key; };
type Line = { story: string; text: string; en: string; ko: string; words: { w: string; form: string; ok: boolean; why?: string }[]; grammar: string[]; expr: string[]; frames: string[] };
const lines: Line[] = fs.readFileSync(file, "utf8").split("\n").filter(Boolean).map((row) => {
  const [story, text, en, ko, uses = ""] = row.split("\t");
  const words = uses.split(";").filter(Boolean).map((one) => {
    const [w, form] = one.split("=").map((x) => (x ?? "").normalize("NFC").trim());
    const at = pieceAt(text, form, lang);
    const twice = at >= 0 && pieceTwice(text, form, lang);
    // 실패 이유: 없음(문장 맨 앞 대문자면 "맨 앞") · 두 번
    const why = at < 0 ? (text.includes(form) ? "낱말 경계" : text.toLocaleLowerCase().startsWith(form.toLocaleLowerCase()) ? "맨 앞(대문자)" : "없음") : twice ? "두 번" : undefined;
    return { w, form, ok: !why, why };
  });
  return { story, text, en, ko, words, grammar: rules.grammarKeys(text, forms, nouns), expr: rules.expressionKeys(text, exprs).map((k: string) => k), frames: framesInLine(lang, text).map((f) => `f|${f.id} ${f.pattern}`) };
});
// 나눠 주기: 단어마다 서로 다른 이야기에서 둘, 문장 하나는 단어 셋까지.
const load = new Map<number, number>();
const give = new Map<string, number[]>();
for (const sameStory of [false, true]) for (const [i, line] of lines.entries()) for (const one of line.words) if (one.ok) {
  const have = give.get(one.w) ?? [];
  if (have.length >= 2 || have.includes(i) || (load.get(i) ?? 0) >= 3) continue;
  if (!sameStory && have.length === 1 && lines[have[0]].story === line.story) continue;
  have.push(i); give.set(one.w, have); load.set(i, (load.get(i) ?? 0) + 1);
}
const out: string[] = [];
for (const [i, l] of lines.entries()) {
  const tags = [...l.words.map((w) => `${w.ok ? "" : `✗[${w.why}]`}${w.w}${w.form !== w.w ? `(${w.form})` : ""}`), ...l.grammar.map((g) => `📐${gname(g)}`), ...l.expr.map((e) => `💬${e.slice(2)}`), ...l.frames.map((f) => `🧩${f.split(" ").slice(1).join(" ")}`)];
  out.push(`${l.story}${String(i + 1).padStart(2, "0")}\t${l.text}\t${tags.join(" · ")}`);
}
console.log(out.join("\n"));
const words = new Set(lines.flatMap((l) => l.words.map((w) => w.w)));
const full = [...words].filter((w) => (give.get(w)?.length ?? 0) >= 2);
const grammar = new Set(lines.flatMap((l) => l.grammar)); const expr = new Set(lines.flatMap((l) => l.expr)); const frames = new Set(lines.flatMap((l) => l.frames));
console.log(`\n문장 ${lines.length} · 단어 ${words.size}개 중 예문 둘 ${full.length} · 빈칸 실패 ${lines.flatMap((l) => l.words).filter((w) => !w.ok).length} · 문법 ${grammar.size}칸(${[...grammar].map(gname).join(", ")}) · 표현 ${expr.size}(${[...expr].map((e) => e.slice(2)).join(", ")}) · 문장구조 ${frames.size}`);
console.log(`문장 하나당 대상 평균 ${(lines.reduce((s, l) => s + l.words.length + l.grammar.length + l.expr.length + l.frames.length, 0) / lines.length).toFixed(1)}`);
// --merge 파일(단어 예문)
const rows = [...give].flatMap(([w, idx]) => idx.map((i) => ({ w, text: lines[i].text, en: lines[i].en, ko: lines[i].ko, blank: lines[i].words.find((x) => x.w === w)!.form })));
// 언어마다 폴더 — 여러 언어를 동시에 돌려도 merge 파일 이름이 겹치지 않게.
fs.mkdirSync(path.join(root, "tmp/story", lang), { recursive: true });
const mergeFile = path.join(root, "tmp/story", lang, path.basename(file).replace(/\.tsv$/, ".merge.json"));
fs.writeFileSync(mergeFile, JSON.stringify({ sentences: rows }));
console.log(`merge 파일: ${path.relative(root, mergeFile)}`);
