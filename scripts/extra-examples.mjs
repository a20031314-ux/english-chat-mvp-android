/**
 * src/lib/curriculum/examples/<언어>.json(여러 소재가 같이 쓰던 문장을 바꿀 새 예문, Claude가 씀 — scripts/shared-examples.ts) → 같은 이름 .ts + index.ts.
 * 앱·테스트가 JSON을 바로 가져오지 않게 TS로 옮긴다(frames/decoys/plain과 같은 방식). Run: node scripts/extra-examples.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "src/lib/curriculum/examples");
// 언어를 주면 그 언어만(다른 언어 JSON을 쓰는 중일 때).
const only = process.argv.slice(2);
const langs = readdirSync(DIR).filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5)).filter((lang) => !only.length || only.includes(lang)).sort();
for (const lang of langs) {
  const data = JSON.parse(readFileSync(path.join(DIR, `${lang}.json`), "utf8"));
  writeFileSync(path.join(DIR, `${lang}.ts`), `/** ${lang} 새 예문(scripts/extra-examples.mjs가 ${lang}.json에서 만듦). */\nimport type { ExtraExample } from "./types.ts";\n\nexport const ${lang.toUpperCase()}_EXTRA: Record<string, ExtraExample[]> = ${JSON.stringify(data, null, 1)};\n`);
}
const imports = langs.map((lang) => `import { ${lang.toUpperCase()}_EXTRA } from "./${lang}.ts";`).join("\n");
writeFileSync(
  path.join(DIR, "index.ts"),
  `/**
 * 여러 소재(문장구조·표현)가 같이 쓰던 예문을 소재마다 따로(2026-11-01 사용자 "요소가 3개라면 추가 문장은 2개") — 열쇠 → 새 예문(replaces = 이 열쇠에서 빼는 원래 문장).
 * quiz.ts baseSources가 그 열쇠의 원래 문장을 빼고 새 예문을 붙인다. 뜻풀이는 en·ko, 다른 앱 언어는 server/stageCopy.ts가 옮김.
 * 고칠 땐 <언어>.json → node scripts/extra-examples.mjs, 검사 node --experimental-strip-types scripts/shared-examples.ts check.
 */
export type { ExtraExample } from "./types.ts";
import type { ExtraExample } from "./types.ts";
${imports}

export const EXTRA_EXAMPLES: Partial<Record<string, Record<string, ExtraExample[]>>> = { ${langs.map((lang) => `${lang}: ${lang.toUpperCase()}_EXTRA`).join(", ")} };

/** 점검 스크립트가 새 예문을 넣기 전 상태를 셀 때만 언어를 넣는다. */
export const SHARED_EXAMPLES_OFF = new Set<string>();
`,
);
console.log(`extra examples: ${langs.join(", ") || "(없음)"}`);
