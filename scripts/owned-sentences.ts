/**
 * 표제어마다 전용 문장 3개(2026-11-03 Languagebank 결정). 표현(e|)·문법(g|)만.
 * 한 문장의 주인은 하나다. 단어(w|)는 지금 카드 길을 그대로 둔다.
 *
 * 결과: src/lib/curriculum/owned/<언어>.json
 *   { "e|excuse me": [{ "text", "en", "ko", "blank" }, ...3], "g|1:0": [...] }
 * blank = 그 문장에서 이 표제어만 비울 조각(문장 안에 한 번, 그대로).
 *
 * Run: node --experimental-strip-types scripts/owned-sentences.ts [언어…] [--limit N]
 *      node --experimental-strip-types scripts/owned-sentences.ts --check
 * 이미 3개가 있는 열쇠는 건너뛴다. 중간에 끊겨도 이어서 한다.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { allFramesFor } from "../src/lib/curriculum/frames.ts";
import { pieceAt, pieceOf, pieceTwice } from "../src/lib/curriculum/quiz.ts";
import { allScriptsFor } from "../src/lib/curriculum/stageScripts.ts";
import { ladderFor } from "../src/lib/curriculum/stages/index.ts";
import { INTERFACE_LANGUAGE_LABELS } from "../src/lib/learningLanguages.ts";

const ROOT = process.cwd();
const DIR = path.join(ROOT, "src/lib/curriculum/owned");
const LANGS = ["en", "ko", "ja", "zh", "es", "fr", "it", "pt", "ru", "ar", "id", "vi", "th", "hi"];
const NEED = 3;
const MODEL = "claude-haiku-5-5";

type Sentence = { text: string; en: string; ko: string; blank: string };
type Book = Record<string, Sentence[]>;
type Item = {
  key: string;
  kind: "expression" | "grammar";
  stage: number;
  name: string;
  hint: string;
};

const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const limitAt = args.indexOf("--limit");
const limit = limitAt >= 0 ? Number(args[limitAt + 1]) : Infinity;
const only = args.filter((arg, i) => !arg.startsWith("--") && (limitAt < 0 || i !== limitAt + 1) && LANGS.includes(arg));
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

/** 뒤집힌 질문(where are, do you)은 그 질문으로 말한다. "how about you" 같은 맞장구는 앞 문장 뒤에 와도 된다. */
function embeddedQuestion(text: string, piece: string): boolean {
  const at = text.toLocaleLowerCase().indexOf(piece.toLocaleLowerCase());
  if (at <= 0) return false;
  const inverted =
    /^(where|what|who|when|why|how)\s+(am|is|are|do|does|did|can|could|will|would|have|has)\b/iu.test(piece) ||
    /^(am|is|are|do|does|did|can|could|will|would)\s+/iu.test(piece);
  if (!inverted) return false;
  const before = text.slice(0, at).trim();
  return !/^(hi|hello|hey|excuse me|good morning|good afternoon|good evening)[,!.?\s]*$/iu.test(before);
}

function itemsOf(language: string): Item[] {
  const out: Item[] = [];
  for (const stage of ladderFor(language)?.stages ?? []) {
    stage.expressions.forEach((expression) => {
      out.push({ key: `e|${expression}`, kind: "expression", stage: stage.order, name: expression, hint: expression });
    });
    stage.grammar.forEach((grammar, index) => {
      const frames = allFramesFor(language)
        .filter((frame) => frame.stage === stage.order && (frame.grammar ?? []).includes(index))
        .map((frame) => frame.pattern);
      out.push({
        key: `g|${stage.order}:${index}`,
        kind: "grammar",
        stage: stage.order,
        name: grammar.name.en,
        hint: `${grammar.name.en}. Example already in the app (do not repeat): ${grammar.example}${frames.length ? `. Patterns that use it: ${frames.join(" / ")}` : ""}`,
      });
    });
  }
  return out;
}

function takenOf(language: string, book: Book): Set<string> {
  const taken = new Set<string>();
  const add = (text: string) => {
    const key = norm(text);
    if (key) taken.add(key);
  };
  for (const frame of allFramesFor(language)) for (const example of frame.examples) add(example.text);
  for (const script of allScriptsFor(language)) for (const line of script.lines) add(line.text);
  for (const stage of ladderFor(language)?.stages ?? []) for (const grammar of stage.grammar) add(grammar.example);
  const extra = path.join(ROOT, "src/lib/curriculum/examples", `${language}.json`);
  if (existsSync(extra)) {
    const data = JSON.parse(readFileSync(extra, "utf8")) as Record<string, { text?: string }[]>;
    for (const list of Object.values(data)) for (const one of list) if (one.text) add(one.text);
  }
  for (const list of Object.values(book)) for (const one of list) add(one.text);
  return taken;
}

function readBook(language: string): Book {
  const file = path.join(DIR, `${language}.json`);
  if (!existsSync(file)) return {};
  return JSON.parse(readFileSync(file, "utf8")) as Book;
}

function writeBook(language: string, book: Book) {
  mkdirSync(DIR, { recursive: true });
  const ordered = Object.fromEntries(Object.entries(book).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(path.join(DIR, `${language}.json`), `${JSON.stringify(ordered, null, 1)}\n`);
}

function englishGloss(text: string): boolean {
  return Boolean(text) && !/[^\p{Script=Latin}\p{P}\p{S}\p{N}\p{Zs}]/u.test(text);
}

function koreanGloss(text: string): boolean {
  return /[가-힣]/.test(text);
}

/** 받은 문장이 이 표제어만의 문장인지. 맞으면 고친 문장, 아니면 까닭. */
function accept(language: string, item: Item, raw: Sentence, taken: Set<string>, batch: Set<string>): Sentence | string {
  const text = raw.text?.normalize("NFC").replace(/\s+/g, " ").trim() ?? "";
  const en = raw.en?.replace(/\s+/g, " ").trim() ?? "";
  const ko = raw.ko?.replace(/\s+/g, " ").trim() ?? "";
  const blank = raw.blank?.normalize("NFC").trim() ?? "";
  if (!text || !en || !ko || !blank) return "빈 칸";
  if (/\d/.test(text)) return "숫자";
  if (text.length > (item.stage <= 1 ? 80 : 140)) return "너무 김";
  if (norm(text) === norm(en) && language !== "en") return "영어 뜻이 문장 그대로";
  if (!englishGloss(en)) return "영어 뜻이 영어가 아님";
  if (!koreanGloss(ko)) return "한국어 뜻 없음";
  if (language !== "ko" && blank && ko.toLocaleLowerCase().includes(blank.toLocaleLowerCase())) return "한국어 뜻에 학습 언어가 남음";
  const mentions = /\b(say|says|said|ask|asks|asked|phrase|expression)\b/iu;
  if (mentions.test(text) && !mentions.test(item.name) && !mentions.test(blank)) return "표제어를 설명하는 문장";
  if (item.kind === "expression" && /^(is it|are you|do you|does|can you|could you)\b/iu.test(text) && !/^(is it|are you|do you|does|can you|could you)\b/iu.test(item.name)) return "표현을 다른 질문으로 비틈";
  if (embeddedQuestion(text, item.kind === "expression" ? item.name : blank)) return "질문을 다른 문장 안에 넣음";
  if (taken.has(norm(text)) || batch.has(norm(text))) return "이미 있는 문장";
  if (item.kind === "expression") {
    const piece = pieceOf(text, item.name);
    if (!piece) return `표현 "${item.name}"이 따로 없음`;
    if (pieceTwice(text, piece, language)) return "표현이 두 번";
    return { text, en, ko, blank: piece };
  }
  if (pieceAt(text, blank, language) < 0) return `빈칸 "${blank}" 자리 없음`;
  if (pieceTwice(text, blank, language)) return "빈칸이 두 번";
  if (blank.length > 40 || norm(blank) === norm(text)) return "빈칸이 문장 전체";
  return { text, en, ko, blank };
}

function prompt(language: string, item: Item, have: string[]): { system: string; user: string } {
  const name = INTERFACE_LANGUAGE_LABELS[language] ?? language;
  const level = item.stage <= 1 ? "very short, simple words only" : item.stage <= 3 ? "short, common words" : "natural everyday length";
  const target =
    item.kind === "expression"
      ? `the expression "${item.name}" exactly (same letters). "blank" is that expression as it appears in the sentence.`
      : `this grammar point, and nothing else: ${item.hint}. "blank" is a continuous piece copied letter for letter from the line (no dots, no underscores, no spaces you add). It must occur once. If the grammar is an ending or a particle stuck to a word, blank that whole word. If the grammar has two separated parts, blank only the first part.`;
  const system = `You write lines a person would actually say, for learners of ${name}, stage ${item.stage} of 5. ${level}.
Write exactly 3 NEW short everyday lines in ${name}. Each line contains ${target}
The line is the thing said. It is not a sentence about saying it. Never write "I say …", "you ask …", "the teacher says …", or put the target in quotation as a word being discussed.
If the target is itself a question, the line is that question, optionally after Hi or Hello. Never tuck it inside another clause ("I want to know where are you from" is wrong).
If the target is a short reply such as "not really", the line can be just that reply.
If the target is given in a dictionary form, copy those letters into the line. Do not conjugate or shorten it.
Each line uses it once, in a different situation. No digits (write numbers as words), no real people, brands or rare place names, nothing rude.
"en" is the meaning in plain English, not a copy of the ${name} line unless the line is already English. "ko" is the meaning in plain Korean, with no ${name} words left in it.
Do not repeat a line you are shown.
Answer with one JSON object and nothing else: {"sentences":[{"text":"","en":"","ko":"","blank":""},{"text":"","en":"","ko":"","blank":""},{"text":"","en":"","ko":"","blank":""}]}`;
  const user = have.length ? `Do not repeat:\n${have.slice(0, 24).join("\n")}` : "No sentences yet.";
  return { system, user };
}

function parseSentences(raw: string): Sentence[] {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("JSON 없음");
  const body = JSON.parse(raw.slice(start, end + 1)) as { sentences?: Sentence[] };
  return body.sentences ?? [];
}

async function ask(system: string, user: string): Promise<Sentence[]> {
  const anthropic = keyOf("ANTHROPIC_API_KEY");
  if (anthropic) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": anthropic, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: MODEL, max_tokens: 1200, temperature: 0.7, system, messages: [{ role: "user", content: user }] }),
    });
    if (!response.ok) throw new Error(`anthropic ${response.status}: ${(await response.text()).slice(0, 180)}`);
    const data = (await response.json()) as { content?: { type: string; text?: string }[] };
    const raw = (data.content ?? []).filter((block) => block.type === "text").map((block) => block.text ?? "").join("");
    return parseSentences(raw);
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
      max_tokens: 1200,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!response.ok) throw new Error(`openai ${response.status}: ${(await response.text()).slice(0, 180)}`);
  const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  return parseSentences(data.choices?.[0]?.message?.content ?? "");
}

async function fill(language: string, item: Item, book: Book, taken: Set<string>): Promise<string | null> {
  const have = [...(book[item.key] ?? [])];
  const seen = have.map((one) => one.text);
  let last = "";
  for (let attempt = 0; attempt < 3 && have.length < NEED; attempt += 1) {
    let got: Sentence[] = [];
    try {
      const built = prompt(language, item, [...seen, ...(last ? [`Last try was rejected: ${last}`] : [])]);
      got = await ask(built.system, built.user);
    } catch (error) {
      last = error instanceof Error ? error.message : String(error);
      if (/429/.test(last)) {
        await new Promise((r) => setTimeout(r, 15_000));
        continue;
      }
      return last;
    }
    const batch = new Set<string>();
    const problems: string[] = [];
    for (const raw of got) {
      const sentence = accept(language, item, raw, taken, batch);
      if (typeof sentence === "string") {
        problems.push(sentence);
        continue;
      }
      have.push(sentence);
      batch.add(norm(sentence.text));
      taken.add(norm(sentence.text));
      seen.push(sentence.text);
      if (have.length >= NEED) break;
    }
    last = problems.join(", ");
  }
  if (have.length < 2) return last || "2개 미만";
  book[item.key] = have.slice(0, NEED);
  return null;
}

function report() {
  let keys = 0;
  let sentences = 0;
  let short = 0;
  for (const language of langs) {
    const book = readBook(language);
    const items = itemsOf(language);
    const ready = items.filter((item) => (book[item.key]?.length ?? 0) >= 2);
    const n = ready.reduce((sum, item) => sum + (book[item.key]?.length ?? 0), 0);
    keys += ready.length;
    sentences += n;
    short += items.length - ready.length;
    console.log(`${language}: 표제어 ${ready.length}/${items.length} · 문장 ${n} · 아직 ${items.length - ready.length}`);
  }
  console.log(`합 표제어 ${keys} · 문장 ${sentences} · 아직 ${short}`);
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
  let made = 0;
  for (const language of langs) {
    const book = readBook(language);
    const taken = takenOf(language, book);
    const todo = itemsOf(language).filter((item) => (book[item.key]?.length ?? 0) < NEED).slice(0, Math.max(0, limit - made));
    console.log(`${language}: 만들 ${todo.length}`);
    made += todo.length;
    let writing = Promise.resolve();
    await pool(todo, 6, async (item) => {
      const problem = await fill(language, item, book, taken);
      writing = writing.then(() => writeBook(language, book));
      await writing;
      const n = book[item.key]?.length ?? 0;
      console.log(`${language} ${item.key} ${problem ? `실패 ${n} (${problem})` : `${n}`}`);
    });
    writeBook(language, book);
    console.log(`${language} 끝`);
    if (made >= limit) break;
  }
  report();
}
