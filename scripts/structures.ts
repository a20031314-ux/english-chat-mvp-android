/**
 * 문장구조 탭 표제어(2026-11-03, 화면은 아직).
 * 단계는 그 단계가 하려는 일만 보고, 틀·문법 예문·표현 목록은 보지 않는다.
 * 한 틀 = 빈칸이 있는 문장 뼈대. 문법 설명은 그 틀 안에 두고, 퀴즈는 뼈대 말이 아니라 빈칸을 묻는다.
 *
 * 결과: src/lib/curriculum/structures/<언어>.json
 *   { "1": [ Structure, ...10 ], ... "5": [...] }
 *
 * Run: node --experimental-strip-types scripts/structures.ts [언어…] [--stage 4]
 *      node --experimental-strip-types scripts/structures.ts --check
 * 한 단계에 8개 이상 있으면 건너뛴다.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { ladderFor } from "../src/lib/curriculum/stages/index.ts";

const ROOT = process.cwd();
const DIR = path.join(ROOT, "src/lib/curriculum/structures");
const LANGS = ["en", "ko", "ja", "zh", "es", "fr", "it", "pt", "ru", "ar", "id", "vi", "th", "hi"];
const NEED = 10;
const MIN = 8;
const NAMES: Record<string, string> = {
  en: "English", ko: "Korean", ja: "Japanese", zh: "Chinese", es: "Spanish", fr: "French", it: "Italian",
  pt: "Portuguese", ru: "Russian", ar: "Arabic", id: "Indonesian", vi: "Vietnamese", th: "Thai", hi: "Hindi",
};

type Example = { text: string; ko: string; en: string };
type Note = { nameKo: string; noteKo: string; nameEn: string; noteEn: string };
type Structure = {
  id: string;
  stage: number;
  pattern: string;
  meaningKo: string;
  meaningEn: string;
  examples: Example[];
  grammar: Note[];
  related: string[];
  quiz: { prompt: string; answer: string };
};
type Book = Record<string, Structure[]>;

const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const stageAt = args.indexOf("--stage");
const onlyStage = stageAt >= 0 ? Number(args[stageAt + 1]) : 0;
const only = args.filter((arg, i) => LANGS.includes(arg) && (stageAt < 0 || i !== stageAt + 1));
const langs = only.length ? only : LANGS;

function keyOf(name: string): string {
  const fromEnv = process.env[name]?.trim();
  if (fromEnv) return fromEnv;
  if (!existsSync(path.join(ROOT, ".env.local"))) return "";
  const line = readFileSync(path.join(ROOT, ".env.local"), "utf8")
    .split(/\r?\n/)
    .find((one) => one.startsWith(`${name}=`));
  return line?.slice(name.length + 1).trim().replace(/^"|"$/g, "") ?? "";
}

function norm(text: string): string {
  return text.normalize("NFC").replace(/\s+/g, " ").trim().toLocaleLowerCase();
}

function readBook(language: string): Book {
  const file = path.join(DIR, `${language}.json`);
  if (!existsSync(file)) return {};
  return JSON.parse(readFileSync(file, "utf8")) as Book;
}

function writeBook(language: string, book: Book) {
  mkdirSync(DIR, { recursive: true });
  const ordered = Object.fromEntries(Object.entries(book).sort(([a], [b]) => Number(a) - Number(b)));
  writeFileSync(path.join(DIR, `${language}.json`), `${JSON.stringify(ordered, null, 1)}\n`);
}

function goalsOf(language: string, stage: number): { title: string; canDo: string[]; situations: string[] } {
  const one = ladderFor(language)?.stages.find((item) => item.order === stage);
  if (!one) throw new Error(`${language} 단계 ${stage} 없음`);
  return {
    title: one.title.en,
    canDo: one.canDo.map((item) => item.en),
    situations: one.situations.map((item) => item.en),
  };
}

function inScript(language: string, text: string): boolean {
  const has: Record<string, RegExp> = {
    ko: /\p{Script=Hangul}/u,
    ja: /\p{Script=Hiragana}|\p{Script=Katakana}/u,
    zh: /\p{Script=Han}/u,
    ar: /\p{Script=Arabic}/u,
    ru: /\p{Script=Cyrillic}/u,
    th: /\p{Script=Thai}/u,
    hi: /\p{Script=Devanagari}/u,
  };
  return (has[language] ?? /[A-Za-z]/u).test(text);
}

/** 뼈대의 고정 말이 예문에 같은 순서로 있는지. */
function follows(pattern: string, text: string): boolean {
  const parts = pattern.split("___").map((part) => part.trim()).filter(Boolean);
  if (!parts.length) return false;
  let at = 0;
  const hay = text.normalize("NFC");
  for (const part of parts) {
    const found = hay.indexOf(part, at);
    if (found < 0) return false;
    at = found + part.length;
  }
  return true;
}

function answerIsSkeleton(pattern: string, answer: string): boolean {
  const piece = answer.trim().toLocaleLowerCase();
  if (!piece) return true;
  return pattern.split("___").some((part) => part.toLocaleLowerCase().includes(piece));
}

function hangul(text: string): boolean {
  return /\p{Script=Hangul}/u.test(text);
}

function english(text: string): boolean {
  return /[A-Za-z]/.test(text) && !/\p{Script=Hangul}/u.test(text);
}

function accept(language: string, stage: number, raw: Structure, seen: Set<string>): Structure | string {
  const pattern = raw.pattern?.normalize("NFC").replace(/\s+/g, " ").trim() ?? "";
  const slots = pattern.split("___").length - 1;
  if (slots < 1 || slots > 3) return "빈칸 수";
  if (pattern.split("___").some((part) => /[()/]/.test(part) || part.trim().startsWith("-"))) return "뼈대에 문법 기호";
  if (!inScript(language, pattern)) return "뼈대 글자";
  if (/\d/u.test(pattern)) return "뼈대 숫자";
  if (seen.has(norm(pattern))) return "뼈대 중복";
  if (!raw.meaningKo || !hangul(raw.meaningKo) || !raw.meaningEn || !english(raw.meaningEn)) return "뜻";
  if (raw.meaningKo.includes("___") || raw.meaningEn.includes("___")) return "뜻이 뼈대를 반복";
  const examples = Array.isArray(raw.examples) ? raw.examples : [];
  if (examples.length < 2) return "예문 수";
  const clean: Example[] = [];
  for (const example of examples.slice(0, 2)) {
    const text = example?.text?.normalize("NFC").replace(/\s+/g, " ").trim() ?? "";
    if (!text || !inScript(language, text) || /\d/u.test(text) || text.length > 180) return "예문";
    if (!follows(pattern, text)) {
      if (process.env.STRUCTURE_DEBUG) console.log(`  다름 ${pattern} :: ${text}`);
      return "예문이 뼈대와 다름";
    }
    if (!example.ko || !hangul(example.ko)) return "예문 한국어";
    if (!example.en || !english(example.en)) return "예문 영어";
    if (language !== "ko" && example.ko.includes(text)) return "한국어가 예문을 베낌";
    clean.push({ text, ko: example.ko.trim(), en: example.en.trim() });
  }
  const notes = (Array.isArray(raw.grammar) ? raw.grammar : []).slice(0, 2).filter((note) =>
    note && hangul(note.nameKo ?? "") && hangul(note.noteKo ?? "") && english(note.nameEn ?? "") && english(note.noteEn ?? ""),
  );
  if (!notes.length) return "문법 설명";
  const prompt = raw.quiz?.prompt?.normalize("NFC").replace(/\s+/g, " ").trim() ?? "";
  const answer = raw.quiz?.answer?.normalize("NFC").replace(/\s+/g, " ").trim() ?? "";
  if (prompt.split("___").length - 1 !== 1) return "퀴즈 빈칸";
  if (!answer || answer.length > 40 || /\d/u.test(answer) || answerIsSkeleton(pattern, answer)) return "퀴즈 답";
  const filled = prompt.replace("___", answer);
  if (!follows(pattern, filled) || !inScript(language, filled)) return "퀴즈가 뼈대와 다름";
  const related = (Array.isArray(raw.related) ? raw.related : [])
    .map((item) => String(item).replace(/\s+/g, " ").trim())
    .filter((item) => item.includes("___") && norm(item) !== norm(pattern))
    .slice(0, 2);
  seen.add(norm(pattern));
  return {
    id: "",
    stage,
    pattern,
    meaningKo: raw.meaningKo.trim(),
    meaningEn: raw.meaningEn.trim(),
    examples: clean,
    grammar: notes.map((note) => ({
      nameKo: note.nameKo.trim(),
      noteKo: note.noteKo.trim(),
      nameEn: note.nameEn.trim(),
      noteEn: note.noteEn.trim(),
    })),
    related,
    quiz: { prompt, answer },
  };
}

function prompt(language: string, stage: number, avoid: string[]): { system: string; user: string } {
  const goals = goalsOf(language, stage);
  const system = [
    `You write sentence-structure entries for learners of ${NAMES[language]}.`,
    "A structure is a pattern people actually say. Mark each open slot with ___. The other words are the pattern.",
    "Grammar is a short note on that same pattern. It is not its own entry, and the quiz does not blank those pattern words.",
    "The quiz blanks one slot: the words the speaker chooses. Leave the pattern words visible.",
    "Reply with JSON only: {\"structures\":[...]}.",
    "Each item: pattern, meaningKo, meaningEn, examples (exactly 2 of {text, ko, en}), grammar (1 or 2 of {nameKo, noteKo, nameEn, noteEn}), related (1 or 2 other patterns with ___), quiz {prompt, answer}.",
    "meaningKo and meaningEn say what the speaker is doing, in a few words, with no ___ and no copy of the pattern. Korean: 과거에 안 한 일을 가정하기. English: Talking about something you did not do.",
    "grammar.nameKo and grammar.nameEn name the grammar itself, such as 가정법 과거 or would have. The note says which blank that grammar belongs to.",
    "example.ko, nameKo and noteKo are Korean. example.en, nameEn and noteEn are English.",
    "examples are lines a person would say. No digits. Do not describe the pattern.",
    "Copy the pattern's fixed characters into every example and into the quiz line unchanged and in the same order. Do not rewrite, conjugate, or respell that fixed part.",
    "Write one spoken form. No chart marks in the pattern: no parentheses, slashes, or a hyphen before an ending. Not 은(는), 이/가, -대요, 았/었. Put that choice in the grammar note, and pick one form in the pattern.",
    "quiz.prompt is a full line with exactly one ___. quiz.answer is the words that fill it, and those words are not part of the pattern.",
    "Two slots may each get their own grammar note. Say which slot each note is about.",
    stage <= 2
      ? "This is an early stage: short, concrete patterns. At most one pattern may have two slots."
      : "This is a later stage: at least 4 of the 10 patterns have two slots, and the clauses can be complex.",
  ].join(" ");
  const user = [
    `Stage ${stage} of 5. Goal: ${goals.title}`,
    `Cover these, at least one pattern each: ${goals.canDo.map((item, index) => `${index + 1}. ${item}`).join(" ")}`,
    `Situations: ${goals.situations.join("; ")}`,
    `Write ${NEED} different patterns. Do not reuse these patterns: ${avoid.slice(-30).join(" | ") || "(none)"}`,
  ].join("\n");
  return { system, user };
}

function parse(raw: string): Structure[] {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("JSON 없음");
  const body = JSON.parse(raw.slice(start, end + 1)) as { structures?: Structure[] };
  return body.structures ?? [];
}

async function ask(system: string, user: string): Promise<Structure[]> {
  const anthropic = keyOf("ANTHROPIC_API_KEY");
  if (anthropic) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": anthropic, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: "claude-haiku-5-5", max_tokens: 8000, temperature: 0.7, system, messages: [{ role: "user", content: user }] }),
    });
    if (!response.ok) throw new Error(`anthropic ${response.status}: ${(await response.text()).slice(0, 180)}`);
    const data = (await response.json()) as { content?: { type: string; text?: string }[] };
    const raw = (data.content ?? []).filter((block) => block.type === "text").map((block) => block.text ?? "").join("");
    return parse(raw);
  }
  const openai = keyOf("OPENAI_API_KEY");
  if (!openai) throw new Error("모델 키 없음");
  const model = process.env.OPENAI_OWNED_MODEL ?? "gpt-4.1";
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${openai}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      max_tokens: 8000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!response.ok) throw new Error(`openai ${response.status}: ${(await response.text()).slice(0, 180)}`);
  const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  return parse(data.choices?.[0]?.message?.content ?? "");
}

function onePrompt(language: string, stage: number, avoid: string[]): { system: string; user: string } {
  const built = prompt(language, stage, avoid);
  return {
    system: `${built.system} Return exactly one structure. Each example.text is the pattern with every ___ replaced by words and nothing else rewritten.`,
    user: `${built.user}\nExample of the relationship, not content to copy: pattern "Had I ___, I would have ___." example "Had I known, I would have stayed."`,
  };
}

async function topUp(language: string, stage: number, book: Book) {
  const have = book[String(stage)] ?? [];
  let misses = 0;
  while (have.length < MIN && misses < 10) {
    const seen = new Set(Object.values(book).flat().map((item) => norm(item.pattern)));
    let got: Structure[] = [];
    try {
      const built = onePrompt(language, stage, [...seen]);
      got = await ask(built.system, built.user);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (/429/.test(message)) await new Promise((resolve) => setTimeout(resolve, 15_000));
      misses += 1;
      continue;
    }
    let taken: Structure | undefined;
    const reasons: string[] = [];
    for (const raw of got) {
      const result = accept(language, stage, raw, seen);
      if (typeof result === "string") reasons.push(result);
      else {
        taken = result;
        break;
      }
    }
    if (!taken) {
      const sample = got[0];
      console.log(`  ${language} ${stage} ${reasons.slice(0, 4).join(", ") || "빈 응답"} :: ${sample?.pattern ?? ""} :: ${sample?.examples?.[0]?.text ?? ""}`);
      misses += 1;
      continue;
    }
    misses = 0;
    have.push(taken);
    book[String(stage)] = have.map((item, index) => ({ ...item, id: `${language}-${stage}-${String(index + 1).padStart(2, "0")}` }));
    writeBook(language, book);
    console.log(`${language} ${stage} + ${have.length}`);
  }
}

async function fillStage(language: string, stage: number, avoid: string[]): Promise<Structure[]> {
  const seen = new Set<string>(avoid.map(norm));
  const kept: Structure[] = [];
  let last = "";
  for (let attempt = 0; attempt < 3 && kept.length < MIN; attempt += 1) {
    let got: Structure[] = [];
    try {
      const built = prompt(language, stage, [...avoid, ...kept.map((item) => item.pattern), ...(last ? [`rejected: ${last}`] : [])]);
      got = await ask(built.system, built.user);
    } catch (error) {
      last = error instanceof Error ? error.message : String(error);
      if (/429/.test(last)) await new Promise((resolve) => setTimeout(resolve, 15_000));
      continue;
    }
    const problems: string[] = [];
    for (const raw of got) {
      const structure = accept(language, stage, raw, seen);
      if (typeof structure === "string") {
        problems.push(structure);
        continue;
      }
      kept.push(structure);
      const doubles = kept.filter((item) => item.pattern.split("___").length - 1 >= 2).length;
      if (kept.length >= 14) break;
      if (kept.length >= NEED && (stage < 3 || doubles >= 4)) break;
    }
    last = problems.slice(0, 6).join(", ");
  }
  if (kept.length < MIN) console.log(`  거절 ${language} ${stage}: ${last}`);
  const ranked = stage >= 3
    ? [...kept.filter((item) => item.pattern.split("___").length - 1 >= 2), ...kept.filter((item) => item.pattern.split("___").length - 1 < 2)]
    : kept;
  return ranked.slice(0, NEED).map((item, index) => ({
    ...item,
    id: `${language}-${stage}-${String(index + 1).padStart(2, "0")}`,
  }));
}

function report() {
  let stages = 0;
  let structures = 0;
  let short = 0;
  for (const language of langs) {
    const book = readBook(language);
    const counts = [1, 2, 3, 4, 5].map((stage) => book[String(stage)]?.length ?? 0);
    const ready = counts.filter((count) => count >= MIN).length;
    const n = counts.reduce((sum, count) => sum + count, 0);
    stages += ready;
    structures += n;
    short += 5 - ready;
    console.log(`${language}: 단계 ${ready}/5 · 틀 ${n} · ${counts.join("/")}`);
  }
  console.log(`합 단계 ${stages} · 틀 ${structures} · 아직 ${short}`);
}

async function pool<T>(list: T[], size: number, run: (item: T) => Promise<void>) {
  let at = 0;
  await Promise.all(
    Array.from({ length: Math.min(size, list.length) }, async () => {
      while (at < list.length) {
        const item = list[at];
        at += 1;
        if (item) await run(item);
      }
    }),
  );
}

if (checkOnly) {
  report();
} else {
  await pool(langs, 3, async (language) => {
    const book = readBook(language);
    const stages = [1, 2, 3, 4, 5].filter((stage) => !onlyStage || stage === onlyStage);
    for (const stage of stages) {
      if ((book[String(stage)]?.length ?? 0) >= MIN) {
        console.log(`${language} ${stage} 있음`);
        continue;
      }
      if ((book[String(stage)]?.length ?? 0) > 0) {
        await topUp(language, stage, book);
        console.log(`${language} ${stage} ${book[String(stage)]?.length ?? 0}`);
        continue;
      }
      const avoid = Object.values(book).flat().map((item) => item.pattern);
      const made = await fillStage(language, stage, avoid);
      if (made.length < MIN) {
        console.log(`${language} ${stage} 실패 ${made.length}`);
        if (made.length > (book[String(stage)]?.length ?? 0)) book[String(stage)] = made;
      } else {
        book[String(stage)] = made;
        console.log(`${language} ${stage} ${made.length}`);
      }
      writeBook(language, book);
    }
    console.log(`${language} 끝`);
  });
  report();
}
