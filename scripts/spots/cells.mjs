// 틀린 곳 데이터 쓰는 에이전트용: 줄 → 칸 번호(at) 보기.  node --experimental-strip-types scripts/spots/cells.mjs <언어> "<줄>" ["<줄>"…]
import path from "node:path";
const { spotCells } = await import(path.join(process.cwd(), "src/lib/curriculum/spotErrors.ts"));
const [lang, ...lines] = process.argv.slice(2);
for (const line of lines) console.log(spotCells(line, lang).map((cell, i) => `${i}:${cell}`).join("  "));
