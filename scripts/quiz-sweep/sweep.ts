/**
 * 퀴즈 전수 점검(2026-11-01 사용자 "퀴즈 탭은 196명을 돌려서 모두 점검하는 건 무리인가?" → "일단 만들어줘").
 *
 * 화면을 누르는 가상 사용자 대신, 앱이 쓰는 같은 코드(curriculum/quiz.ts buildQuiz·bundleQuiz)로 문제를 대량으로 만들어
 * 학습 언어 14 × 앱 언어 14 = 196 조합 × 단계 1~5를 모두 규칙으로 검사한다. 모델을 부르지 않는다.
 *
 *   node --experimental-strip-types scripts/quiz-sweep/sweep.ts [--langs=ja,en] [--stages=1-5] [--net] [--judge=30]
 *   → tmp/quiz-sweep/<날>/marks.jsonl(화면 점검 /mark와 같은 모양) · stats.json · judge/<언어>.jsonl(판정 표본)
 *   → 보고서: node scripts/quiz-sweep/report.mjs
 *
 * 검사(문제마다):
 *   - 앱 언어와 상관없는 것: 빈칸 밖에 답이 또 있음(easy-leak) · 오답이 정답과 같거나 쳐도 맞음(wrong-judge) · 보기 겹침 ·
 *     순서 조각 둘 이하(easy-order) · 섞이지 않음(easy-copy) · 한자 낱말이 조각으로 잘림(split-word) · 지금 단계 + 1보다 위 문장(hard-level)
 *   - 앱 언어마다(뜻 줄이 답하기 전에 보이는 모양 — 순서·말하기·틀린 곳 고치기): 뜻 줄에 답이 보임(easy-leak, 앱 언어 = 학습 언어일 때 등) ·
 *     뜻 줄이 비어 무엇을 말할지 모름(no-meaning, --net으로 뜻풀이 옮김을 받았을 때만)
 * 문법·표현 탭의 하루 흐름은 그 탭이 2026-11-01에 빠져 더 이상 돌리지 않는다.
 *
 * --net(읽기만, 운영 API): 앱 언어별 뜻풀이 옮김(?glosses=1), 낱말 카드(앞 두 묶음, 앱 언어 en), 문제은행 묶음(점검 사용자라 서버가 키우지도 셈하지도 않음).
 * 처음 받는 뜻풀이·카드는 서버가 한 번 만들어 저장한다(모든 사용자가 처음 열 때와 같음). 받은 것은 tmp/quiz-sweep/cache에 남겨 다시 받지 않는다.
 */
import fs from "node:fs";
import path from "node:path";
import { buildQuiz, bundleQuiz, canQuiz, joinWords, typedRight, registerQuizSources, quizSources, type QuizQuestion, type QuizSource } from "../../src/lib/curriculum/quiz.ts";
import { grammarKey, isCurriculumKey, reviewKeysOf } from "../../src/lib/curriculum/dailyPlan.ts";
import { allScriptsFor, quizGloss, rememberGlosses, type ScriptGloss } from "../../src/lib/curriculum/stageScripts.ts";
import { allFramesFor } from "../../src/lib/curriculum/frames.ts";
import { ladderFor } from "../../src/lib/curriculum/stages/index.ts";
import { registerGrown } from "../../src/lib/curriculum/qbank.ts";
import { hasBank, loadBank, quizPos, wordKey, wordStage } from "../../src/lib/curriculum/vocabBank.ts";
import { SUPPORTED_LEARNING_LANGUAGES, INTERFACE_LANGUAGE_LABELS } from "../../src/lib/learningLanguages.ts";

const ROOT = process.cwd();
const API = "https://www.languagebank.net";
const arg = (name: string) => process.argv.find((one) => one.startsWith(`--${name}=`))?.split("=")[1];
const flag = (name: string) => process.argv.includes(`--${name}`);
const date = arg("date") ?? new Date().toISOString().slice(0, 10);
const LANGS = arg("langs")?.split(",") ?? SUPPORTED_LEARNING_LANGUAGES.map((one) => one.code);
const UIS = Object.keys(INTERFACE_LANGUAGE_LABELS);
const [from, to] = (arg("stages") ?? "1-5").split("-").map(Number);
const STAGES = Array.from({ length: (to ?? from!) - from! + 1 }, (_, i) => from! + i);
const NET = flag("net");
const JUDGE = Number(arg("judge") ?? 30);
const OUT = path.join(ROOT, "tmp/quiz-sweep", date);
const CACHE = path.join(ROOT, "tmp/quiz-sweep/cache");
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(path.join(OUT, "judge"), { recursive: true });
fs.mkdirSync(CACHE, { recursive: true });
const SIM_USER = `simcheck-quizsweep-${date}`;

// ---------- 운영에서 받기(읽기만, 캐시) ----------
async function cached<T>(name: string, get: () => Promise<T | null>): Promise<T | null> {
  const file = path.join(CACHE, `${name.replace(/[^\w.-]+/g, "_")}.json`);
  if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, "utf8")) as T;
  const value = await get().catch(() => null);
  if (value !== null) fs.writeFileSync(file, JSON.stringify(value));
  return value;
}
const headers = { "x-rc-user": SIM_USER, "x-app-version": "2.78.0", "content-type": "application/json" };
async function getJson<T>(url: string): Promise<T | null> {
  const response = await fetch(API + url, { headers });
  return response.ok ? ((await response.json()) as T) : null;
}
async function postJson<T>(url: string, body: unknown): Promise<T | null> {
  const response = await fetch(API + url, { method: "POST", headers, body: JSON.stringify(body) });
  return response.ok ? ((await response.json()) as T) : null;
}

type Card = { w: string; piece: string; example: string; gloss: string; exampleGloss: string };
const wordStageOf = new Map<string, number>();
async function loadNet(language: string): Promise<{ words: number; bank: number }> {
  let words = 0;
  let bank = 0;
  // 뜻풀이 옮김은 검사에 쓰이는 앱 언어만: 앱 언어 = 학습 언어(뜻 줄에 답이 보이나), 영어 학습이면 모든 앱 언어(옮김이 없으면 뜻 줄이 비는지).
  // 다른 학습 언어는 옮김이 없어도 영어 뜻이 보여서 검사가 같다. 네 개씩 같이 받는다.
  const glossUis = UIS.filter((ui) => ui !== "en" && ui !== "ko" && (ui === language || language === "en"));
  const jobs = glossUis.flatMap((ui) => STAGES.map((stage) => ({ ui, stage })));
  for (let i = 0; i < jobs.length; i += 4) {
    await Promise.all(jobs.slice(i, i + 4).map(async ({ ui, stage }) => {
      const body = await cached<{ glosses?: Record<string, string> }>(`glosses-${language}-${stage}-${ui}`, () => getJson(`/api/curriculum/scripts?glosses=1&lang=${language}&stage=${stage}&ui=${ui}`));
      if (body?.glosses) rememberGlosses(ui, body.glosses);
    }));
  }
  if (hasBank(language)) {
    const list = await loadBank(language);
    const index = new Map(list.map((word, i) => [word.w, i]));
    for (const chunk of [0, 1]) {
      const body = await cached<{ cards?: Card[] }>(`cards-${language}-${chunk}`, () => getJson(`/api/curriculum/words?lang=${language}&ui=en&chunk=${chunk}`));
      for (const card of body?.cards ?? []) {
        const at = index.get(card.w) ?? 0;
        const word = list[at];
        const key = wordKey(card.w);
        wordStageOf.set(`${language}|${key}`, word ? wordStage(language, word, at) : 1);
        registerQuizSources(language, [{ key, sources: [{ text: card.example, gloss: { en: card.exampleGloss }, from: key, stage: 0, piece: card.piece, who: "me", wordGloss: card.gloss, ...(word?.pos ? { pos: quizPos(word.pos) } : {}) }] }]);
        words += 1;
      }
    }
  }
  // 문제은행(점검 사용자 — 서버는 있는 묶음만 돌려줌).
  const keys = [...new Set(STAGES.flatMap((stage) => keysFor(language, stage)))].filter((key) => !key.startsWith("g|"));
  const parts = Array.from({ length: Math.ceil(keys.length / 8) }, (_, n) => ({ i: n * 8, part: keys.slice(n * 8, n * 8 + 8) }));
  const bodies = [];
  for (let n = 0; n < parts.length; n += 4) bodies.push(...(await Promise.all(parts.slice(n, n + 4).map(({ i, part }) => cached<{ banks?: Record<string, { items: { text: string; piece: string; gloss: string; stage: number }[]; decoys: Record<string, string[]> } | null> }>(
      `qbank-${language}-${part.join(",").slice(0, 120)}-${i}`,
      () => postJson("/api/curriculum/qbank", { language, ui: "en", keys: part.map((key) => ({ key, stage: 1 })), results: [] }),
    )))));
  for (const body of bodies) {
    for (const [key, one] of Object.entries(body?.banks ?? {})) {
      if (!one?.items?.length) continue;
      registerGrown(language, key, { decoys: one.decoys ?? {}, items: one.items.map((item) => ({ text: item.text, piece: item.piece, stage: item.stage, gloss: { en: item.gloss } })) });
      bank += 1;
    }
  }
  return { words, bank };
}

// ---------- 열쇠 ----------
function keysFor(language: string, stage: number): string[] {
  const out = new Set<string>();
  for (const script of allScriptsFor(language).filter((one) => one.stage === stage)) {
    for (const key of reviewKeysOf(language, script.id)) out.add(key);
    for (const index of script.grammar ?? []) out.add(grammarKey(stage, index));
  }
  for (const frame of allFramesFor(language)) if (frame.stage === stage) out.add(`f|${frame.id}`);
  for (const expression of ladderFor(language)?.stages.find((one) => one.order === stage)?.expressions ?? []) out.add(`e|${expression}`);
  for (const [at, s] of wordStageOf) if (at.startsWith(`${language}|`) && s === stage) out.add(at.slice(language.length + 1));
  return [...out].filter((key) => key.startsWith("w|") || isCurriculumKey(language, key));
}

// ---------- 표시 ----------
type Meta = { key: string; kind: string; text: string; from?: string; options?: string[]; answer?: number | string; before?: string; after?: string; right?: string; words?: string[] };
type Mark = { persona: string; learn: string; ui: string; day: number; reason: string; note: string; shot: string; stage: number; tab?: string; questions: Meta[] };
const marks: Mark[] = [];
const markSeen = new Set<string>();
function mark(row: Omit<Mark, "persona" | "shot" | "day"> & { day?: number }) {
  const q = row.questions[0];
  const id = [row.learn, row.ui, row.reason, row.tab ?? "", q?.key, q?.kind, q?.text, row.note.slice(0, 40)].join("|");
  if (markSeen.has(id)) return;
  markSeen.add(id);
  marks.push({ persona: "sweep", shot: "", day: row.day ?? 0, ...row });
}

const textOf = (q: QuizQuestion): string => ("text" in q ? q.text : q.kind === "fix" ? q.right : "");
function metaOf(key: string, q: QuizQuestion): Meta {
  const base: Meta = { key, kind: q.kind, text: textOf(q), ...("from" in q && q.from ? { from: q.from } : {}) };
  if (q.kind === "choose") return { ...base, options: q.options, answer: q.answer, before: q.before, after: q.after };
  if (q.kind === "type") return { ...base, answer: q.answer, before: q.before, after: q.after, ...(q.near?.length ? { options: q.near } : {}) };
  if (q.kind === "spot") return { ...base, right: q.right, answer: q.want, words: q.words };
  if (q.kind === "order") return { ...base, words: q.words };
  return base;
}
const norm = (text: string) => text.toLocaleLowerCase().normalize("NFC").replace(/[\s\p{P}]+/gu, "");
/** 보기 비교: 대소문자·앞뒤 부호만 무시(띄어쓰기는 다른 보기 — "aun que"와 "aunque"는 다른 오답). */
const normOption = (text: string) => text.toLocaleLowerCase().normalize("NFC").trim().replace(/\s+/g, " ").replace(/^[\p{P}\s]+|[\p{P}\s]+$/gu, "");
/** 글 안에 그 말이 낱말로 들어 있나 — 띄어 쓰는 글은 낱말 경계로("Me"가 "name" 안에 걸리지 않게), 안 띄어 쓰는 글은 그냥 포함. */
function hasWord(haystack: string, needle: string): boolean {
  const h = haystack.toLocaleLowerCase().normalize("NFC");
  const n = needle.toLocaleLowerCase().normalize("NFC").trim();
  if (!n) return false;
  if (!/\s/.test(h.trim())) return h.includes(n);
  const escaped = n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^\\p{L}\\p{M}\\p{N}])${escaped}($|[^\\p{L}\\p{M}\\p{N}])`, "u").test(h);
}
const HAN = /\p{Script=Han}/u;

/** 그 문장의 단계(재료에서) — 문제은행·대본·틀 예문. 모르면 null. */
function stageOfText(language: string, key: string, text: string): number | null {
  const source = quizSources(language, key).find((one) => one.text === text);
  return source && source.stage > 0 ? source.stage : null;
}

// ---------- 문제마다 검사 ----------
type Seen = { key: string; q: QuizQuestion; stage: number };
function checkQuestion(language: string, stage: number, { key, q }: Seen) {
  const meta = metaOf(key, q);
  const add = (reason: string, note: string, ui = "*") => mark({ learn: language, ui, reason, note, stage, questions: [meta] });
  if (q.kind === "choose" || q.kind === "type") {
    const answer = q.kind === "choose" ? q.options[q.answer] ?? "" : q.answer;
    // 낱말 경계가 없는 언어도 있어 글자 셋 이상일 때만(작은 조사·관사는 문장에 흔함).
    if (norm(answer).length >= 3 && hasWord(`${q.before} ${q.after}`, answer)) add("easy-leak", `빈칸 밖 문장에 답 "${answer}"이 또 있음`);
    if (q.kind === "choose") {
      if (q.answer < 0 || q.answer >= q.options.length) add("wrong-judge", "정답 자리가 보기 밖");
      const seen = new Set<string>();
      q.options.forEach((option, i) => {
        if (seen.has(normOption(option))) add("hard-ambiguous", `보기 "${option}"이 겹침`);
        seen.add(normOption(option));
        if (i !== q.answer && normOption(option) === normOption(answer)) add("wrong-judge", `오답 "${option}"이 정답과 같음(대소문자·부호만 다름)`);
      });
      if (q.options.length < 3) add("easy-decoy", `보기가 ${q.options.length}개뿐`);
    } else {
      if (typedRight(q.answer, q.answer, { language }) !== "exact") add("wrong-judge", `정답 "${q.answer}"을 그대로 쳐도 맞음이 아님`);
      for (const near of q.near ?? []) if (normOption(near) === normOption(q.answer)) add("wrong-judge", `헷갈리는 꼴 "${near}"이 정답과 같음 — 쳐도 틀림으로 셈`);
    }
  }
  if (q.kind === "order") {
    if (q.words.length <= 2) add("easy-order", `조각 ${q.words.length}개`);
    else if (q.tiles.every((tile, i) => tile === i)) add("easy-copy", "조각이 섞이지 않고 문장 순서 그대로");
    if (norm(joinWords(q.words, q.spaced)) !== norm(q.text)) add("other", `조각을 이으면 문장과 다름: ${q.words.join(" | ")}`);
    for (let i = 1; i < q.words.length; i += 1) {
      const a = q.words[i - 1]!;
      const b = q.words[i]!;
      // 일본어만 — 중국어는 한 글자 낱말이 흔해(我 | 是) 이 규칙으로 못 가린다.
      if (language === "ja" && HAN.test(a.slice(-1)) && HAN.test(b.charAt(0)) && (a.length === 1 || b.length === 1) && q.text.includes(a + b)) {
        add("split-word", `한자가 이어진 자리에서 잘림: ${a} | ${b} (${q.words.join(" | ")})`);
        break;
      }
    }
  }
  if (q.kind === "spot" && q.bad.length && norm(q.words[q.bad[0]!] ?? "") === norm(q.want)) add("wrong-judge", `고칠 낱말 "${q.want}"이 이미 바른 꼴`);
  const textStage = stageOfText(language, key, meta.text);
  if (textStage && textStage > stage + 1) add("hard-level", `${stage}단계 학습자에게 ${textStage}단계 문장`);
  const wordAt = key.startsWith("w|") ? wordStageOf.get(`${language}|${key}`) : undefined;
  if (wordAt && wordAt > stage) add("hard-level", `${stage}단계 학습자에게 ${wordAt}단계 낱말`);

  // 앱 언어마다: 답하기 전에 뜻 줄이 보이는 모양.
  const before: { gloss: ScriptGloss; answer: string; what: string }[] =
    q.kind === "order" || q.kind === "say" ? [{ gloss: q.gloss, answer: q.text, what: "문장" }]
    : q.kind === "spot" && q.gloss ? [{ gloss: q.gloss, answer: q.want, what: "고칠 말" }]
    : [];
  // 문제은행·낱말 카드는 앱 언어 en으로만 받았다(앱은 자기 앱 언어 뜻을 같이 받음) — 그 재료의 뜻 줄은 en 앱만 정확.
  const source = "from" in q ? String(q.from ?? "") : "";
  const uis = source === "qbank" || source.startsWith("w|") ? ["en"] : UIS;
  for (const one of before) {
    for (const ui of uis) {
      const shown = quizGloss(one.gloss, ui, language);
      // 뜻 줄이 실제로 어느 말로 보이나 — 학습 언어와 같은 말일 때만 답이 새는 것(스페인어 "me"가 영어 뜻 줄의 "me"에 걸리는 건 아님).
      const shownIn = one.gloss.raw !== undefined ? (ui === language ? ui : "?") : ui === "en" ? "en" : ui === "ko" ? (one.gloss.ko ? "ko" : "en") : shown && shown !== one.gloss.en ? ui : "en";
      if (shown === null) {
        // 앱 언어 = 학습 언어면 뜻 줄 대신 🔊 듣기(2026-11-01) — 비어 있는 게 맞음.
        if (NET && language === "en" && ui !== language && (q.kind === "say" || q.kind === "order")) add("no-meaning", `${INTERFACE_LANGUAGE_LABELS[ui]} 앱: 뜻 줄이 비어 있음`, ui);
        continue;
      }
      const want = norm(one.answer);
      const got = norm(shown);
      const leaked = shownIn === language && (one.what === "문장" ? want.length >= 4 && got.length >= 4 && (got.includes(want) || want.includes(got)) : want.length >= 2 && hasWord(shown, one.answer));
      if (leaked) {
        add("easy-leak", `${INTERFACE_LANGUAGE_LABELS[ui]} 앱: 답하기 전 뜻 줄 "${shown.slice(0, 60)}"에 ${one.what}이 그대로`, ui);
      }
    }
  }
}

// ---------- 문제 모으기 ----------
function questionsFor(language: string, stage: number, key: string): Seen[] {
  const out: Seen[] = [];
  const seen = new Set<string>();
  const push = (q: QuizQuestion | undefined, k = key) => {
    if (!q) return;
    const id = `${q.kind}|${textOf(q)}|${"answer" in q ? String(q.answer) : ""}`;
    if (seen.has(id)) return;
    seen.add(id);
    out.push({ key: k, q, stage });
  };
  for (const seed of ["a", "b"]) {
    for (const q of buildQuiz(language, key, { stage, seed })?.questions ?? []) push(q);
    for (const style of ["type", "choose"] as const) {
      const made = bundleQuiz(language, [key], { seed, stage, style, fallback: style === "type" ? "choose" : "type", strict: true });
      made.questions.forEach((q, i) => push(q, made.keys[i] ?? key));
    }
  }
  return out;
}

// ---------- 판정 표본 ----------
type JudgeRow = { id: string; learn: string; stage: number; key: string; kind: string; sentence: string; options?: string[]; answer: string; meaning: string; from: string };
function judgeRows(language: string, all: Seen[]): JudgeRow[] {
  // 같은 문장·같은 답은 한 번만(보기 순서만 다른 문제가 표본을 채우지 않게 — 판정 2026-11-01).
  const once = new Set<string>();
  const pool = all.filter(({ q }) => {
    if (q.kind !== "choose" && q.kind !== "type") return false;
    const id = `${q.before}|${q.after}|${q.kind === "choose" ? q.options[q.answer] : q.answer}`;
    if (once.has(id)) return false;
    once.add(id);
    return true;
  });
  // 단계마다 고르게, 고르기(오답이 보이는 것)·문제은행 먼저.
  const rank = ({ q }: Seen) => (q.kind === "choose" ? 0 : 1) + ("from" in q && q.from === "qbank" ? 0 : 0.5);
  const byStage = new Map<number, Seen[]>();
  for (const one of pool.sort((a, b) => rank(a) - rank(b))) byStage.set(one.stage, [...(byStage.get(one.stage) ?? []), one]);
  const out: JudgeRow[] = [];
  for (let i = 0; out.length < JUDGE && i < 500; i += 1) {
    let added = false;
    for (const list of byStage.values()) {
      const one = list[i];
      if (!one || out.length >= JUDGE) continue;
      added = true;
      const q = one.q as Extract<QuizQuestion, { kind: "choose" | "type" }>;
      out.push({
        id: `${language}-${out.length + 1}`,
        learn: language,
        stage: one.stage,
        key: one.key,
        kind: q.kind,
        sentence: `${q.before}___${q.after}`,
        ...(q.kind === "choose" ? { options: q.options } : q.near?.length ? { options: [q.answer, ...q.near] } : {}),
        answer: q.kind === "choose" ? q.options[q.answer] ?? "" : q.answer,
        meaning: q.gloss.en || q.gloss.raw || "",
        from: q.from,
      });
    }
    if (!added) break;
  }
  return out;
}

// ---------- 돌리기 ----------
const stats: { languages: Record<string, { keys: Record<number, number>; noQuiz: Record<number, number>; questions: Record<number, number>; words: number; bank: number }>; flows: never[]; net: boolean; days: number; uis: number } = {
  languages: {},
  flows: [],
  net: NET,
  days: 0,
  uis: UIS.length,
};
for (const language of LANGS) {
  const started = Date.now();
  const net = NET ? await loadNet(language) : { words: 0, bank: 0 };
  const entry = { keys: {} as Record<number, number>, noQuiz: {} as Record<number, number>, questions: {} as Record<number, number>, ...net };
  const all: Seen[] = [];
  for (const stage of STAGES) {
    const keys = keysFor(language, stage);
    entry.keys[stage] = keys.length;
    let none = 0;
    let count = 0;
    for (const key of keys) {
      const list = canQuiz(language, key) ? questionsFor(language, stage, key) : [];
      if (!list.length) none += 1;
      count += list.length;
      for (const one of list) checkQuestion(language, stage, one);
      all.push(...list);
    }
    entry.noQuiz[stage] = none;
    entry.questions[stage] = count;
  }
  stats.languages[language] = entry;
  const rows = judgeRows(language, all);
  fs.writeFileSync(path.join(OUT, "judge", `${language}.jsonl`), rows.map((row) => JSON.stringify(row)).join("\n") + (rows.length ? "\n" : ""));
  const qs = Object.values(entry.questions).reduce((a, b) => a + b, 0);
  console.error(`${language}: 열쇠 ${Object.values(entry.keys).reduce((a, b) => a + b, 0)} · 문제 ${qs} · 표시 누계 ${marks.length} · 판정 표본 ${rows.length}${NET ? ` · 낱말 ${net.words} · 문제은행 ${net.bank}` : ""} (${((Date.now() - started) / 1000).toFixed(1)}초)`);
}
fs.writeFileSync(path.join(OUT, "marks.jsonl"), marks.map((row) => JSON.stringify(row)).join("\n") + "\n");
fs.writeFileSync(path.join(OUT, "stats.json"), JSON.stringify(stats, null, 1));
console.error(`→ ${path.relative(ROOT, OUT)}/marks.jsonl (${marks.length}) · stats.json · judge/  다음: node scripts/quiz-sweep/report.mjs ${date}`);

export type { QuizSource };
