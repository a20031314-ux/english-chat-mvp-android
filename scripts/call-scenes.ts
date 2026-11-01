/**
 * 통화 장면 만들기 도구(2026-11-02, `hub/drafts/call-scripts-design-2026-11-01.md` 9·15절).
 *
 *   node --experimental-strip-types scripts/call-scenes.ts brief <lang> <stage>     — 쓰는 사람에게 줄 자료
 *   node --experimental-strip-types scripts/call-scenes.ts check <lang> <stage>     — src/lib/roleplay/scenes/<lang>/s<stage>.json 검사 + 빈틈 검사
 *   node --experimental-strip-types scripts/call-scenes.ts check-file <lang> <stage> <json>  — 다른 파일(작성 중)을 검사
 *   node --experimental-strip-types scripts/call-scenes.ts stats [stage]            — 언어별 장면·차례·문장 수
 *
 * 통과하면 "ok". 규칙은 src/lib/roleplay/callScene.ts.
 */
import fs from "node:fs";
import path from "node:path";
import { allFramesFor } from "../src/lib/curriculum/frames.ts";
import { ladderFor } from "../src/lib/curriculum/stages/index.ts";
import { frameUsed } from "../src/lib/curriculum/scriptBank.ts";
import { allScriptsFor, bankScriptsUpTo } from "../src/lib/curriculum/stageScripts.ts";
import { FUNCTIONS } from "../src/lib/curriculum/functions.ts";
import { checkScene, checkStageCoverage, isSceneLearner, type CallScene } from "../src/lib/roleplay/callScene.ts";
import { briefsForStage } from "../src/lib/roleplay/sceneBriefs.ts";

const LANGS = ["en", "es", "fr", "it", "pt", "ru", "ar", "hi", "id", "vi", "th", "zh", "ja", "ko"];
const [, , cmd, lang, stageArg, fileArg] = process.argv;
const root = path.resolve(import.meta.dirname, "..");
const sceneFile = (l: string, s: number) => path.join(root, "src/lib/roleplay/scenes", l, `s${s}.json`);

function stageOf(l: string, order: number) {
  return ladderFor(l)?.stages.find((one) => one.order === order) ?? null;
}

function context(l: string, stage: number) {
  const frames = new Map(allFramesFor(l).map((f) => [f.id, { stage: f.stage, pattern: f.pattern }]));
  return { frames, canDoCount: stageOf(l, stage)?.canDo.length ?? 6, needsKo: l !== "ko", frameUsed };
}

function targetFrames(l: string, stage: number): string[] {
  const dialogue = stageOf(l, stage)?.dialogues[1];
  if (!dialogue) return [];
  const pool = allFramesFor(l).filter((f) => f.stage <= stage);
  return [...new Set(dialogue.lines.flatMap((line) => pool.filter((f) => frameUsed(f.pattern, line.text)).map((f) => f.id)))]
    // 목표 대화에 든 그 단계 틀만 덮으면 된다(앞 단계 틀은 앞 단계 장면이 덮음).
    .filter((id) => pool.find((f) => f.id === id)?.stage === stage);
}

function check(l: string, stage: number, file: string): string[] {
  const scenes = JSON.parse(fs.readFileSync(file, "utf8")) as CallScene[];
  const ctx = context(l, stage);
  const problems = scenes.flatMap((scene) => {
    const own = [] as string[];
    if (scene.language !== l) own.push(`${scene.id}: language ${scene.language}`);
    if (scene.stage !== stage) own.push(`${scene.id}: stage ${scene.stage}`);
    return [...own, ...checkScene(scene, ctx)];
  });
  const briefs = new Set(briefsForStage(stage).map((brief) => brief.id));
  for (const scene of scenes) if (!briefs.has(scene.brief)) problems.push(`${scene.id}: 목록에 없는 brief ${scene.brief}`);
  const missing = [...briefs].filter((id) => !scenes.some((scene) => scene.brief === id));
  const coverage = checkStageCoverage(scenes, {
    stage,
    stageFrames: allFramesFor(l).filter((f) => f.stage === stage).map((f) => f.id),
    canDoCount: ctx.canDoCount,
    targetFrames: targetFrames(l, stage),
  });
  if (missing.length) coverage.push(`아직 없는 장면 ${missing.length}개: ${missing.join(", ")}`);
  return [...problems, ...coverage];
}

if (cmd === "brief" && lang && stageArg) {
  const stage = Number(stageArg);
  const st = stageOf(lang, stage);
  console.log(`# ${lang} ${stage}단계 통화 장면 자료\n`);
  console.log(`할 수 있는 일(canDo 번호):`);
  st?.canDo.forEach((c, i) => console.log(`  ${i} · ${c.en}`));
  console.log(`\n문장구조 틀(id · fn · pattern · 뜻 · 예문):`);
  for (const f of allFramesFor(lang).filter((one) => one.stage <= stage)) {
    console.log(`  ${f.id} · ${f.fn} · ${f.pattern} · ${f.meaning.en} · 예: ${f.examples.slice(0, 2).map((e) => e.text).join(" / ")}${f.stage < stage ? ` (앞 단계 ${f.stage})` : ""}`);
  }
  console.log(`\n핵심 표현: ${st?.expressions.join(" | ")}`);
  console.log(`\n목표 대화(이 단계를 마치면 혼자 할 수 있어야 함) — ${st?.dialogues[1]?.setting.en}:`);
  for (const line of st?.dialogues[1]?.lines ?? []) console.log(`  ${line.who}: ${line.text}  (${line.en})`);
  console.log(`목표 대화의 이 단계 틀: ${targetFrames(lang, stage).join(", ")}`);
  console.log(`\n말 기능: ${FUNCTIONS.filter((f) => f.stage <= stage).map((f) => f.id).join(", ")}`);
  console.log(`\n장면 목록(brief id · 종류 · 제목 · 역할 · 장면 · 해낼 것 · fns · 잘 막히는 곳):`);
  for (const brief of briefsForStage(stage)) {
    console.log(`  ${brief.id} · ${brief.kind} · ${brief.title.en} · ${brief.tutorRole} · ${brief.setting} · ${brief.objective} · ${brief.fns.join(",")} · ${brief.likelyTrouble}`);
  }
  console.log(`\n이미 있는 같은 단계 대본(한 줄기 대화 — 재료로 써도 됨, 글을 그대로 베끼지 말고 가지를 더해):`);
  for (const s of [...allScriptsFor(lang), ...bankScriptsUpTo(lang, stage)].filter((one) => one.stage === stage)) {
    console.log(`  [${s.id}] ${s.setting.en}`);
    for (const line of s.lines) console.log(`     ${line.who}: ${line.text}`);
  }
} else if ((cmd === "check" || cmd === "check-file") && lang && stageArg) {
  const stage = Number(stageArg);
  const file = cmd === "check" ? sceneFile(lang, stage) : path.resolve(fileArg ?? "");
  if (!fs.existsSync(file)) {
    console.error(`없음: ${file}`);
    process.exit(1);
  }
  const problems = check(lang, stage, file);
  if (problems.length) {
    console.log(problems.join("\n"));
    console.log(`\n문제 ${problems.length}개`);
    process.exit(1);
  }
  console.log("ok");
} else if (cmd === "stats") {
  const stage = Number(lang ?? 1);
  for (const l of LANGS) {
    const file = sceneFile(l, stage);
    if (!fs.existsSync(file)) {
      console.log(`${l}: 없음`);
      continue;
    }
    const scenes = JSON.parse(fs.readFileSync(file, "utf8")) as CallScene[];
    const turns = scenes.reduce((n, s) => n + Object.values(s.nodes).filter(isSceneLearner).length, 0);
    const sentences = scenes.reduce((n, s) => n + Object.keys(s.sentences).length, 0);
    const phrases = scenes.reduce((n, s) => n + Object.values(s.nodes).filter(isSceneLearner).reduce((m, node) => m + node.expect.reduce((k, br) => k + br.match.length, 0), 0), 0);
    const problems = check(l, stage, file).length;
    console.log(`${l}: 장면 ${scenes.length} · 학습자 차례 ${turns} · 튜터 문장 ${sentences} · 받는 문구 ${phrases} · 문제 ${problems}`);
  }
} else {
  console.error("usage: brief <lang> <stage> | check <lang> <stage> | check-file <lang> <stage> <json> | stats [stage]");
  process.exit(2);
}
