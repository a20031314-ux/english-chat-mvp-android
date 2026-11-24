// 문제 지도(사용자 2026-11-24 "문제 지도를 하나 그려줘. 업데이트되도록. 모든 문제를 다 풀었을 때를 가정하고 어떤 순서·구조로 문제가 나오는지").
// 지금 코드(ladder.ts 비율·사다리·단계·회차, vocabLevel.ts 낱말 경계, preparedQuiz.ts 고르기 순서)와 문제 데이터(problems·spot-errors·story-errors·vocab)를
// 읽어 hub/app/QUIZ-MAP.md를 만든다 — 손으로 고치지 않는다. 다 맞히는 학습자(첫 측정 건너뛰기 = 1단계, 하루 새 묶음 셋, 날마다)를 실제 함수로 돌려 날짜를 어림.
//   node --experimental-strip-types scripts/quiz-map.mts          → 다시 만들기
//   node --experimental-strip-types scripts/quiz-map.mts --check  → 코드·데이터와 맞는지(CI quiz-map)
// 허브 페이지 "문제 지도" 칸이 이 파일을 보여 준다(scripts/hub-page.mjs).
import fs from "node:fs";
import path from "node:path";
import { kindShares, kindCounts, stepReach, stepLadder, firstTryRung, rungOf, DONE, climbCleared, nextRound, noteRoundUsed, startParaLevel, REACH_BATCH, REACH_UP, REACH_DOWN, REACH_TOP, RUN_HOURS, KIND_BASE, KIND_BASE_LOW, type Reach, type QuizRound } from "../src/lib/curriculum/ladder.ts";
import { pickPrepared, type PreparedItem } from "../src/lib/curriculum/preparedQuiz.ts";
import { noteLevelBatch, startLevel, PROBE, BATCH, BATCH_STEP, type Level } from "../src/lib/curriculum/vocabLevel.ts";
import { stageCuts, stageOfRank } from "../src/lib/curriculum/vocabBank.ts";
import { ladderFor } from "../src/lib/curriculum/stages/index.ts";
import { SUPPORTED_LEARNING_LANGUAGES } from "../src/lib/learningLanguages.ts";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "hub/app/QUIZ-MAP.md");
const DIR = path.join(ROOT, "src/lib/curriculum");
const json = (p: string) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : null);
const LANGS = SUPPORTED_LEARNING_LANGUAGES.map((one) => one.code);
const BATCHES_A_DAY = 3;

type Data = { items: PreparedItem[]; spotKeys: Set<string>; spotsAt: Record<number, number>; storyAt: Record<string, number>; words: number; wordsAt: Record<number, number> };

async function dataOf(lang: string): Promise<Data> {
  const stageOf = new Map<string, number>();
  for (const s of ladderFor(lang)?.stages ?? []) for (const t of s.expressions) stageOf.set(`e|${t}`, s.order);
  const items: PreparedItem[] = [];
  const files = fs.readdirSync(path.join(DIR, "problems")).filter((f) => (f.startsWith(`${lang}-`) || f === `${lang}.json`) && !f.includes("gv")).sort();
  for (const f of files) {
    for (const [key, r] of Object.entries<Record<string, unknown>>(json(path.join(DIR, "problems", f)) ?? {})) {
      if (!r.gloss || !r.answer || !r.line || !r.why || !(r.options as unknown[] | undefined)?.length || (r.kind !== "grammar" && r.kind !== "expression")) continue;
      const stage = r.kind === "grammar" ? Number(key.split("|")[1]?.split(":")[0]) : stageOf.get(key);
      if (stage) items.push({ key, kind: r.kind, stage, gloss: String(r.gloss), before: "", after: "", answer: String(r.answer), options: r.options as string[], line: String(r.line), why: String(r.why) });
    }
  }
  const spotKeys = new Set<string>();
  const spotsAt: Record<number, number> = {};
  for (const one of (json(path.join(DIR, "spot-errors", `${lang}.json`)) ?? []) as { stage: number; errors?: { g?: string }[] }[]) {
    spotsAt[one.stage] = (spotsAt[one.stage] ?? 0) + 1;
    for (const e of one.errors ?? []) if (e.g) spotKeys.add(e.g);
  }
  const storyAt: Record<string, number> = {};
  for (const one of (json(path.join(DIR, "story-errors", `${lang}.json`)) ?? []) as { shape: string }[]) storyAt[one.shape] = (storyAt[one.shape] ?? 0) + 1;
  const { WORDS } = (await import(path.join(DIR, "vocab", `${lang}.ts`))) as { WORDS: unknown[] };
  const wordsAt: Record<number, number> = {};
  WORDS.forEach((_, i) => {
    const s = stageOfRank(lang, i);
    wordsAt[s] = (wordsAt[s] ?? 0) + 1;
  });
  return { items, spotKeys, spotsAt, storyAt, words: WORDS.length, wordsAt };
}

/** 다 맞히는 학습자 — 새 묶음만(다시 볼 것이 안 생김), 하루 셋. 문제은행 새 문장은 회차마다 칸마다 하나 있다고 본다. */
function perfect(lang: string, data: Data) {
  const grammar = data.items.filter((i) => i.kind === "grammar");
  const hasExpr = data.items.some((i) => i.kind === "expression");
  let ladder: Record<string, number> = {};
  let reach: Reach = { s: 1, n: 0, ok: 0 };
  let round: QuizRound = { r: 1, used: {} };
  let level: Level = startLevel(1, stageCuts(lang));
  const seen = new Set<string>();
  const doneDay = new Map<string, number>();
  const stageDay: Record<number, number> = { 1: 1 };
  const roundDay: Record<number, number> = { 1: 1 };
  const wordStageDay: Record<number, number> = {};
  const asked: string[] = [];
  const lastAt = new Map<string, number>();
  const per = { g: 0, e: 0, w: 0 };
  let t = 0;
  for (let day = 1; day <= 365; day++) {
    const today = new Set<string>();
    for (let b = 0; b < BATCHES_A_DAY; b++) {
      t += 1;
      const runs = { w: 10, g: 10, e: 10 };
      const counts = kindCounts(7, kindShares(1, { w: 0, g: 0, e: 0 }, runs));
      const opened = nextRound(grammar.map((i) => i.key), ladder, round, () => true);
      if (opened) {
        ladder = opened.ladder;
        round = opened.round;
        reach = { s: 1, n: 0, ok: 0 };
        roundDay[round.r] ??= day;
      }
      reach = climbCleared(reach, 1, (s) => grammar.some((i) => i.stage === s && rungOf(ladder, i.key) < DONE));
      const skip = new Set(data.items.map((i) => i.key).filter((k) => rungOf(ladder, k) >= DONE || today.has(k)));
      const head = pickPrepared(data.items, { stage: reach.s, grammar: counts.g, expression: hasExpr ? counts.e : 0, skip, lastAt: (k) => lastAt.get(k) ?? 0 });
      for (const it of head) {
        const rung = Math.max(1, rungOf(ladder, it.key));
        const was = rungOf(ladder, it.key);
        // 3칸(틀린 곳)은 그 칸 틀린 곳 데이터가 있을 때만 — 없으면 4칸으로.
        ladder = stepLadder(ladder, it.key, firstTryRung(rung, true, seen.has(it.key)), true);
        if (rungOf(ladder, it.key) === 3 && it.kind === "grammar" && !data.spotKeys.has(it.key)) ladder = { ...ladder, [it.key]: 4 };
        if (it.kind === "expression" && rungOf(ladder, it.key) === 3) ladder = { ...ladder, [it.key]: 4 };
        seen.add(it.key);
        today.add(it.key);
        lastAt.set(it.key, t);
        asked.push(it.key);
        reach = stepReach(reach, 1, it.stage, true);
        if (was < DONE && rungOf(ladder, it.key) >= DONE) {
          round = noteRoundUsed(round, it.key, [`${it.key}#${round.r}`]);
          if (!doneDay.has(`${round.r}|${it.kind}`)) doneDay.set(`${round.r}|${it.kind}|first`, day);
        }
        if (it.kind === "grammar") per.g += 1;
        else per.e += 1;
      }
      if (reach.s > 0) stageDay[reach.s] ??= day;
      const nw = Math.max(0, counts.w - 1) + 1 + (hasExpr ? 0 : counts.e);
      for (let i = 0; i < nw; i++) {
        const rank = Math.round(level.b);
        level = noteLevelBatch(level, rank, true, { choose: true, total: data.words, fresh: true });
        per.w += 1;
        const ws = stageOfRank(lang, Math.round(level.b));
        wordStageDay[ws] ??= day;
      }
    }
    const allG = grammar.every((i) => rungOf(ladder, i.key) >= DONE);
    if (allG && round.r === 1) doneDay.set("g1", doneDay.get("g1") ?? day);
    if (hasExpr && data.items.filter((i) => i.kind === "expression").every((i) => rungOf(ladder, i.key) >= DONE)) doneDay.set("e", doneDay.get("e") ?? day);
  }
  return { stageDay, roundDay, wordStageDay, g1: doneDay.get("g1") ?? roundDay[2], eDone: doneDay.get("e"), per, firstBatch: asked.slice(0, 12) };
}

const pct = (v: number) => `${Math.round(v)}%`;
const cnt = (c: Record<string, number>) => `낱말 ${c.w} · 문법 ${c.g} · 표현 ${c.e}`;

async function build(): Promise<string> {
  const low = kindCounts(7, kindShares(1, { w: null, g: null, e: null }));
  const high = kindCounts(7, kindShares(3, { w: null, g: null, e: null }));
  const lowRun = kindCounts(7, kindShares(1, { w: null, g: null, e: null }, { w: 0, g: 10, e: 0 }));
  const highRun = kindCounts(7, kindShares(3, { w: null, g: null, e: null }, { w: 0, g: 10, e: 0 }));
  const rows: string[] = [];
  const stageRows: string[] = [];
  const timeRows: string[] = [];
  for (const lang of LANGS) {
    const data = await dataOf(lang);
    const g = data.items.filter((i) => i.kind === "grammar");
    const e = data.items.filter((i) => i.kind === "expression");
    const at = (s: number, list: PreparedItem[]) => list.filter((i) => i.stage === s).length;
    stageRows.push(`| ${lang} | ${[1, 2, 3, 4, 5].map((s) => `${at(s, g)}${g.filter((i) => i.stage === s && data.spotKeys.has(i.key)).length < at(s, g) ? `(③${g.filter((i) => i.stage === s && data.spotKeys.has(i.key)).length})` : ""}`).join(" | ")} | ${e.length ? [1, 2, 3, 4, 5].map((s) => at(s, e)).join("·") : "카드"} | ${["P1", "P2", "P3", "P4"].map((p) => data.storyAt[p] ?? 0).join("·")} | ${data.words} |`);
    const run = perfect(lang, data);
    timeRows.push(`| ${lang} | ${[2, 3, 4, 5].map((s) => (run.stageDay[s] ? `${run.stageDay[s]}일` : "—")).join(" | ")} | ${run.g1 ? `${run.g1}일` : "—"} | ${[2, 3].map((r) => (run.roundDay[r] ? `${run.roundDay[r]}일` : "—")).join(" | ")} | ${run.eDone ? `${run.eDone}일` : e.length ? "—" : "카드"} | ${[2, 3, 4, 5, 6].map((s) => (run.wordStageDay[s] ? `${run.wordStageDay[s]}일` : "—")).join(" · ")} |`);
    if (lang === "en") rows.push(...run.firstBatch.map((k) => `\`${k}\``));
  }
  const lines: string[] = [];
  lines.push("# 문제 지도");
  lines.push("");
  lines.push("> **자동 생성 — 손으로 고치지 않는다.** `node --experimental-strip-types scripts/quiz-map.mts`가 지금 코드(`ladder.ts`·`vocabLevel.ts`·`preparedQuiz.ts`·`talkFill.ts`)와 문제 데이터(`problems/`·`spot-errors/`·`story-errors/`·`vocab/`)에서 만든다. main push 때 CI `quiz-map`이 다시 만든다.");
  lines.push(`> 규칙의 글은 \`hub/app/QUIZ.md\`, 실력이 섞인 학습자의 1년은 \`scripts/sim/quiz-year.mts\`. 여기 날짜는 **다 맞히는 학습자**(첫 측정 건너뛰기 = 1단계, 하루 새 묶음 ${BATCHES_A_DAY}개, 날마다)를 실제 함수로 돌린 어림.`);
  lines.push("");
  lines.push("## 1. 한 판의 흐름");
  lines.push("");
  lines.push("```");
  lines.push("Quizbank 열기");
  lines.push(" ├ 맡긴 열쇠가 있으면(넘겨 보기 남은 카드 등) 다섯씩 먼저");
  lines.push(" ├ 다시 볼 것이 있으면 ── [다시 볼 것 묶음] 대화 채우기 ≤2 → 대화에서 막힌 것 → [다시]·앎에서 틀린 것 → 처음 보고 틀린 것(1시간 뒤) · 8개까지");
  lines.push(" │                         ↕ 번갈아 (다 맞히면 다시 볼 것이 안 생겨 새 묶음만)");
  lines.push(" └ [새 묶음 7문제] 대화 채우기 1 → 문법 칸(닿은 단계부터) → 표현(영어는 넣어 둔 문제) → 낱말(경계 근처 + 아래 단계 하나) → 문단(단계에 따라)");
  lines.push("```");
  lines.push("");
  lines.push("## 2. 새 묶음 7문제의 종류 수");
  lines.push("");
  lines.push(`| 단계 | 출발 비율(낱말·문법·표현) | 문제 수 | 한 종류를 10개 연달아 맞히면(${RUN_HOURS}시간) |`);
  lines.push("|---|---|---|---|");
  lines.push(`| 1~2 | ${pct(KIND_BASE_LOW.w)} · ${pct(KIND_BASE_LOW.g)} · ${pct(KIND_BASE_LOW.e)} | ${cnt(low)} | 문법이 그랬다면: ${cnt(lowRun)} |`);
  lines.push(`| 3~5 | ${pct(KIND_BASE.w)} · ${pct(KIND_BASE.g)} · ${pct(KIND_BASE.e)} | ${cnt(high)} | 문법이 그랬다면: ${cnt(highRun)} |`);
  lines.push("");
  lines.push("다 맞히면 세 종류가 함께 줄어 비율은 출발과 같다. 14일 틀린 비율이 평균보다 높은 종류는 10%p마다 5%p 늘어난다(15~60%).");
  lines.push("");
  lines.push("## 3. 문법 칸 하나 — 사다리");
  lines.push("");
  lines.push("```");
  lines.push("① 고르기 ──처음에 맞힘──▶ ③ 틀린 곳(그 칸 틀린 곳 데이터가 있을 때, 없으면 ④) ──▶ ④ 문장 쓰기 ──▶ 끝");
  lines.push("    └─틀림/두 번째─▶ ② 빈칸 쓰기 ──▶ ③ …");
  lines.push("한 칸은 하루에 한 번(맞히면 20시간 쉼) → 다 맞혀도 칸 하나에 3일");
  lines.push("```");
  lines.push("");
  lines.push("## 4. 단계와 회차");
  lines.push("");
  lines.push("```");
  lines.push(`1단계 칸 ─다 끝내면─▶ 2단계 ─▶ … ─▶ 5단계   (그 단계 이상 답 ${REACH_BATCH}개마다 ${pct(REACH_UP * 100)} 이상이면 한 단계 위, ${pct(REACH_DOWN * 100)} 이하면 아래 · 첫 측정 단계 밑으로는 안 내려감 · 최고 ${REACH_TOP})`);
  lines.push("   ▲                                             │");
  lines.push("   └──── 1~5단계 문법을 다 끝내면 다음 회차 ◀────┘   (같은 칸, 새 문장 — 문제은행이 만들어 판정한 문장·튜터 줄. 새 문장이 없는 칸은 건너뜀)");
  lines.push("표현은 회차 없음(아래 단계 것도 계속 나옴) · 낱말은 끝이 없음 · 문단은 1~2단계 네 묶음에 하나, 3단계 둘에 하나, 4~5단계 묶음마다(하루 둘까지)");
  lines.push("```");
  lines.push("");
  lines.push("### 단계마다 넣어 둔 문제 수");
  lines.push("");
  lines.push("문법 칸 수(괄호 = 그중 ③ 틀린 곳 데이터가 있는 칸, 모두 있으면 생략) · 표현(넣어 둔 문제, 영어 밖은 표현 카드) · 문단 P1·P2·P3·P4 · 낱말.");
  lines.push("");
  lines.push("| 언어 | 문법 1 | 2 | 3 | 4 | 5 | 표현 1·2·3·4·5 | 문단 P1·P2·P3·P4 | 낱말 |");
  lines.push("|---|---|---|---|---|---|---|---|---|");
  lines.push(...stageRows);
  lines.push("");
  lines.push("## 5. 다 맞히면 언제 어디에 닿나 (어림)");
  lines.push("");
  lines.push(`문법 단계 2~5에 닿는 날 · 1회차 문법을 다 끝낸 날 · 2·3회차 시작 · 표현(넣어 둔 문제)을 다 끝낸 날 · 낱말 경계가 단계 2·3·4·5·6(확장)에 닿는 날(경계는 처음 ${PROBE}개는 답마다, 그 뒤 ${BATCH}개마다 ×${BATCH_STEP}).`);
  lines.push("");
  lines.push("| 언어 | 문법 2 | 3 | 4 | 5 | 1회차 끝 | 2회차 | 3회차 | 표현 끝 | 낱말 2·3·4·5·6 |");
  lines.push("|---|---|---|---|---|---|---|---|---|---|");
  lines.push(...timeRows);
  lines.push("");
  lines.push(`영어 첫 열두 문법·표현 문제 차례: ${rows.join(" → ")}`);
  lines.push("");
  return `${lines.join("\n")}\n`;
}

const text = await build();
if (process.argv.includes("--check")) {
  const have = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
  if (have !== text) {
    console.error("hub/app/QUIZ-MAP.md가 지금 코드·데이터와 달라요. node --experimental-strip-types scripts/quiz-map.mts 로 다시 만드세요.");
    process.exit(1);
  }
  console.log("문제 지도 최신");
} else {
  fs.writeFileSync(OUT, text);
  console.log(`문제 지도 → ${path.relative(ROOT, OUT)}`);
}
