/**
 * frames/decoys/plain/<언어>.json(확실히 틀린 꼴만, Claude 판단) → 같은 이름 .ts + index.ts.
 * 앱·테스트가 JSON을 바로 가져오지 않게(node --experimental-strip-types로 도는 순수 모듈) TS로 옮긴다.
 * Run: node scripts/plain-decoys.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "src/lib/curriculum/frames/decoys/plain");
const langs = readdirSync(DIR).filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5)).sort();
for (const lang of langs) {
  const data = JSON.parse(readFileSync(path.join(DIR, `${lang}.json`), "utf8"));
  const name = `${lang.toUpperCase()}_PLAIN`;
  writeFileSync(path.join(DIR, `${lang}.ts`), `/** ${lang} 문장구조 오답 중 확실히 틀린 꼴(scripts/plain-decoys.mjs가 ${lang}.json에서 만듦). */\nexport const ${name}: Record<string, string[]> = ${JSON.stringify(data, null, 2)};\n`);
}
const head = `/**
 * 문장구조 헷갈리는 오답 중 **확실히 틀린 꼴**만(2026-10-30, 틀린 곳 찾아 고치기 — 사용자 "문장 내에서 틀린 부분을 맞추고 수정하는 식").
 * frames/decoys/의 오답에는 뜻만 다른 맞는 말(어디 → 언제)·맞는 변형(I'm ↔ I am)이 섞여 있어, 그 문장에 넣었을 때 선생님이 틀렸다고 고칠 것만 남겼다.
 * Claude가 오답마다 판단(원어민 확인 전), 맞춤법만 틀린 꼴은 뺌 — 고칠 땐 <언어>.json을 고치고 node scripts/plain-decoys.mjs.
 */
`;
const imports = langs.map((lang) => `import { ${lang.toUpperCase()}_PLAIN } from "./${lang}.ts";`).join("\n");
writeFileSync(
  path.join(DIR, "index.ts"),
  `${head}${imports}\n\nexport const PLAIN_DECOYS: Partial<Record<string, Record<string, string[]>>> = { ${langs.map((lang) => `${lang}: ${lang.toUpperCase()}_PLAIN`).join(", ")} };\n`,
);
console.log(`plain decoys: ${langs.join(", ")}`);
