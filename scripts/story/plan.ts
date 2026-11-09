/**
 * 낱말 예문 이야기 — 다음 묶음 계획(모델 없음). 설계 hub/work/drafts/word-sentences-all-languages.md
 *
 *   node --experimental-strip-types scripts/story/plan.ts <언어> [--size 40] [--skip <낱말,…>]
 *
 * 남은 낱말(빈도 순)에서 가장 낮은 단계만 보고:
 *   주제 낱말(actions·describing·function 밖) 약 24개 — 가장 많이 남은 주제 + 가까운 주제,
 *   어디나 들어가는 낱말(actions·describing·function) 약 16개 — 빈도 순.
 * 무대 A = 그 주제의 곳, 무대 B = 다른 주제의 곳(이미 쓴 파일 이름에 든 무대는 피함), 이름 둘, 파일 이름, 언어 규칙을 찍는다.
 * 쓰는 쪽은 이 목록 그대로 이야기 둘을 scripts/story/<언어>/<파일>.tsv 로 쓰고 analyze → merge 한다.
 */
import fs from "node:fs";
import path from "node:path";
import { loadBank, stageOfRank, wordKey } from "../../src/lib/curriculum/vocabBank.ts";

const root = process.cwd();
const args = process.argv.slice(2);
const lang = args[0] ?? "";
const sizeAt = args.indexOf("--size");
const size = sizeAt >= 0 ? Number(args[sizeAt + 1]) || 40 : 40;
const skipAt = args.indexOf("--skip");
const skip = new Set(skipAt >= 0 ? (args[skipAt + 1] ?? "").split(",").map((w) => w.normalize("NFC").trim()) : []);
const conf = JSON.parse(fs.readFileSync(path.join(root, "scripts/story/settings.json"), "utf8")) as {
  settings: Record<string, string[]>;
  topicSetting: Record<string, string>;
  names: Record<string, string[]>;
  rules: Record<string, string>;
  skip?: Record<string, string[]>;
};
for (const w of conf.skip?.[lang] ?? []) skip.add(w.normalize("NFC"));
const NEUTRAL = new Set(["actions", "describing", "function"]);

const bank = await loadBank(lang);
if (!bank.length) {
  console.error(`언어 없음: ${lang}`);
  process.exit(1);
}
const bookFile = path.join(root, "src/lib/curriculum/word-sentences", `${lang}.json`);
const book = (fs.existsSync(bookFile) ? JSON.parse(fs.readFileSync(bookFile, "utf8")) : {}) as Record<string, unknown[]>;
const todo = bank
  .map((word, index) => ({ word, index, stage: stageOfRank(lang, index) }))
  .filter((one) => (book[wordKey(one.word.w)]?.length ?? 0) < 2 && !skip.has(one.word.w));
if (!todo.length) {
  console.log(`${lang}: 남은 낱말 없음`);
  process.exit(0);
}
const stage = Math.min(...todo.map((one) => one.stage));
const pool = todo.filter((one) => one.stage === stage);
const topical = pool.filter((one) => !NEUTRAL.has(one.word.topic ?? "function"));
const neutral = pool.filter((one) => NEUTRAL.has(one.word.topic ?? "function"));

// 주제: 가장 많이 남은 주제부터, 24개가 찰 때까지 다음 주제를 붙인다.
const byTopic = new Map<string, typeof pool>();
for (const one of topical) byTopic.set(one.word.topic!, [...(byTopic.get(one.word.topic!) ?? []), one]);
const topics = [...byTopic].sort((a, b) => b[1].length - a[1].length);
const wantTopical = Math.min(Math.round(size * 0.6), topical.length);
const picked: typeof pool = [];
const used: string[] = [];
for (const [topic, list] of topics) {
  if (picked.length >= wantTopical) break;
  used.push(topic);
  picked.push(...list.slice(0, wantTopical - picked.length));
}
picked.push(...neutral.slice(0, size - picked.length));
// 그 단계가 모자라면 다음 단계에서(빈도 순) 채운다.
if (picked.length < size) {
  const have = new Set(picked.map((one) => one.word.w));
  picked.push(...todo.filter((one) => !have.has(one.word.w)).slice(0, size - picked.length));
}
picked.sort((a, b) => a.index - b.index);

// 무대: A = 첫 주제의 곳, B = 다른 주제의 곳. 이미 쓴 파일 이름에 든 무대는 피한다.
const dir = path.join(root, "scripts/story", lang);
const done = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".tsv")) : [];
const slug = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");
const fresh = (list: string[]) => list.filter((s) => !done.some((f) => f.includes(slug(s))));
const groupA = conf.topicSetting[used[0] ?? ""] ?? "people";
const optionsA = fresh(conf.settings[groupA] ?? []);
// 다 쓴 무대 묶음이면 묶음 수로 돌려 가며(같은 무대 연달아 안 나오게).
const allA = conf.settings[groupA] ?? ["neighbors"];
const settingA = optionsA.length ? optionsA[done.length % optionsA.length]! : allA[done.length % allA.length]!;
const others = Object.keys(conf.settings).filter((g) => g !== groupA && !used.some((t) => conf.topicSetting[t] === g));
const groupB = others[(done.length * 7 + 3) % others.length]!;
const optionsB = fresh(conf.settings[groupB] ?? []);
const allB = conf.settings[groupB]!;
const settingB = optionsB[0] ?? allB[(done.length * 3 + 1) % allB.length]!;
const names = conf.names[lang] ?? [];
const nameA = names[(done.length * 2) % names.length] ?? "A";
const nameB = names[(done.length * 2 + 1) % names.length] ?? "B";
const seq = String(done.filter((f) => f.startsWith(String(stage))).length + 1).padStart(3, "0");
const file = `scripts/story/${lang}/${stage}-${seq}-${slug(settingA)}-${slug(settingB)}.tsv`;

console.log(`언어 ${lang} · 단계 ${stage} · 남은 ${todo.length} (이 단계 ${pool.length}) · 이번 ${picked.length}낱말`);
console.log(`파일: ${file}`);
console.log(`이야기 A — 무대: ${settingA} · 주인공: ${nameA}   (주제 ${used.join("·") || "섞음"})`);
console.log(`이야기 B — 무대: ${settingB} · 주인공: ${nameB}`);
console.log(`언어 규칙: ${conf.rules[lang] ?? "-"}`);
console.log(`낱말(순위 · 낱말 · 품사 · 주제):`);
for (const one of picked) console.log(`${one.index}\t${one.word.w}\t${one.word.pos}\t${one.word.topic ?? "-"}${one.word.reading ? `\t${one.word.reading}` : ""}`);
