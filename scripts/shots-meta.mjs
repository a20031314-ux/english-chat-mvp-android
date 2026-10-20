/**
 * 스크린샷 모음 페이지의 meta/plan 문서 만들기(hub/SHOTS.md): 그림이 필요한 칸·지도 칸 목록·지도에 쓰는 그림.
 * 먼저 scripts/shots-plan.mjs와 npm run service-map을 돌린 뒤. → tmp/shots/meta-plan.json (ArtifactData set meta/plan file_path)
 */
import fs from "node:fs";
const plan = JSON.parse(fs.readFileSync("tmp/shots/plan.json", "utf8"));
const map = JSON.parse(fs.readFileSync("tmp/service-map/needs.json", "utf8"));
const used = new Set(Object.values(plan.sections));
for (const scenes of Object.values(plan.nodes)) for (const sc of scenes) [sc.primary, ...sc.alts].forEach((id) => used.add(id));
fs.writeFileSync("tmp/shots/meta-plan.json", JSON.stringify({ at: plan.today, needs: map.needs, nodes: map.nodes, used: [...used].sort() }));
console.log(`meta/plan: 그림이 필요한 칸 ${map.needs.length} · 지도에 쓰는 그림 ${used.size} → tmp/shots/meta-plan.json`);
