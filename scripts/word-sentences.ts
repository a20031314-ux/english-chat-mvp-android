/**
 * 빈도 낱말마다 전용 문장 2개. 표현·문법 문장(owned/)과 따로 둔다.
 * 빈칸은 그 문장에 한 번 나오는 그 낱말(또는 그 활용형).
 *
 * 결과: src/lib/curriculum/word-sentences/<언어>.json
 *   { "w|name": [{ "text", "en", "ko", "blank" }, ...2] }
 *
 * Run: node --experimental-strip-types scripts/word-sentences.ts [언어…] [--limit N]
 *      node --experimental-strip-types scripts/word-sentences.ts --check
 * 이미 2개가 있는 낱말은 건너뛴다.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pieceAt, pieceTwice } from "../src/lib/curriculum/quiz.ts";
import { loadBank, stageOfRank, wordKey, type BankWord } from "../src/lib/curriculum/vocabBank.ts";

const ROOT = process.cwd();
const DIR = path.join(ROOT, "src/lib/curriculum/word-sentences");
const LANGS = ["en", "ko", "ja", "zh", "es", "fr", "it", "pt", "ru", "ar", "id", "vi", "th", "hi"];
const NEED = 2;
const BATCH = 25;
const NAMES: Record<string, string> = {
  en: "English", ko: "Korean", ja: "Japanese", zh: "Chinese", es: "Spanish", fr: "French", it: "Italian",
  pt: "Portuguese", ru: "Russian", ar: "Arabic", id: "Indonesian", vi: "Vietnamese", th: "Thai", hi: "Hindi",
};

type Sentence = { text: string; en: string; ko: string; blank: string };
type Book = Record<string, Sentence[]>;
type Row = Sentence & { w?: string };

const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const limitAt = args.indexOf("--limit");
const limit = limitAt >= 0 ? Number(args[limitAt + 1]) : Infinity;
const only = args.filter((arg, i) => LANGS.includes(arg) && (limitAt < 0 || i !== limitAt + 1));
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
  const ordered = Object.fromEntries(Object.entries(book).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(path.join(DIR, `${language}.json`), `${JSON.stringify(ordered, null, 1)}\n`);
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

/** 한국어 동사·형용사의 사전형(가다, 가능하다)은 발화가 아니다. */
function citation(language: string, word: BankWord, text: string): boolean {
  if (language !== "ko" || (word.pos !== "verb" && word.pos !== "adj")) return false;
  return pieceAt(text, word.w, language) >= 0;
}

function accept(language: string, stage: number, word: BankWord, raw: Row, taken: Set<string>): Sentence | string {
  const text = raw.text?.normalize("NFC").replace(/\s+/g, " ").trim() ?? "";
  const blank = raw.blank?.normalize("NFC").replace(/\s+/g, " ").trim() ?? "";
  const ko = raw.ko?.trim() ?? "";
  const en = raw.en?.trim() ?? "";
  if (!text || !blank || blank === text) return "빈칸";
  if (/\d/u.test(text) || text.length > (stage <= 1 ? 80 : 140)) return "길이";
  if (!inScript(language, text)) return "글자";
  if (pieceAt(text, blank, language) < 0 || pieceTwice(text, blank, language)) return "빈칸 자리";
  if (citation(language, word, text)) return "사전형";
  if (!/\p{Script=Hangul}/u.test(ko)) return "한국어";
  if (!/[A-Za-z]/.test(en) || /\p{Script=Hangul}/u.test(en)) return "영어";
  if (language !== "ko" && ko.includes(text)) return "한국어가 문장을 베낌";
  if (/\b(the word|this word|means that|phrase)\b/i.test(text)) return "설명문";
  const key = norm(text);
  if (taken.has(key)) return "중복";
  taken.add(key);
  return { text, en, ko, blank };
}

function prompt(language: string, words: { word: BankWord; stage: number }[]): { system: string; user: string } {
  const system = [
    `You write two short sentences a native ${NAMES[language]} speaker would actually say.`,
    "Write that sentence first, in the target language. Do not translate an English sentence, and do not keep a dictionary citation form a speaker would not say.",
    "No digits. Do not define the word.",
    "blank is the exact spoken form copied from the sentence, once. It may be conjugated or carry a particle. If the word is an ending stuck to another word, blank that whole spoken word.",
    language === "ko"
      ? "Korean verbs and adjectives must be spoken forms such as 가요, 갔어요, 가능해요, 가벼워요. Never write 가다, 먹다, 가능하다, 가볍다, 가르치다."
      : `The sentence must sound like spoken ${NAMES[language]}, not like English rewritten word for word.`,
    "en is an English translation of the sentence you wrote. ko is a Korean translation of that same sentence. If the sentence is already English, en may match it. If it is already Korean, ko may match it.",
    "Reply with JSON only: {\"sentences\":[{\"w\",\"text\",\"en\",\"ko\",\"blank\"}, ...]}. Two objects per word, in the same order as the list.",
  ].join(" ");
  const user = words.map((item, index) => `${index + 1}|${item.word.w}|${item.word.pos}|stage ${item.stage}`).join("\n");
  return { system, user };
}

function parse(raw: string): Row[] {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("JSON 없음");
  const body = JSON.parse(raw.slice(start, end + 1)) as { sentences?: Row[] };
  return body.sentences ?? [];
}

async function ask(system: string, user: string): Promise<Row[]> {
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

async function fillBatch(language: string, words: { word: BankWord; stage: number }[], book: Book, taken: Set<string>): Promise<void> {
  const pending = new Map(words.map((item) => [item.word.w, item]));
  let last = "";
  for (let attempt = 0; attempt < 3 && pending.size; attempt += 1) {
    let got: Row[] = [];
    try {
      const built = prompt(language, [...pending.values()]);
      got = await ask(built.system, built.user);
    } catch (error) {
      last = error instanceof Error ? error.message : String(error);
      if (/429/.test(last)) await new Promise((resolve) => setTimeout(resolve, 15_000));
      continue;
    }
    for (const raw of got) {
      const item = raw.w ? pending.get(raw.w) : undefined;
      if (!item) continue;
      const sentence = accept(language, item.stage, item.word, raw, taken);
      if (typeof sentence === "string") continue;
      const key = wordKey(item.word.w);
      const have = book[key] ?? [];
      have.push(sentence);
      book[key] = have;
      if (have.length >= NEED) pending.delete(item.word.w);
    }
  }
  if (pending.size) console.log(`${language} 묶음 남음 ${pending.size}${last ? ` (${last})` : ""}`);
}

function report() {
  let words = 0;
  let sentences = 0;
  let short = 0;
  for (const language of langs) {
    const book = readBook(language);
    const ready = Object.values(book).filter((list) => list.length >= NEED);
    const n = ready.reduce((sum, list) => sum + list.length, 0);
    words += ready.length;
    sentences += n;
    short += Object.values(book).filter((list) => list.length < NEED).length;
    console.log(`${language}: 낱말 ${ready.length} · 문장 ${n} · 모자람 ${Object.values(book).length - ready.length}`);
  }
  console.log(`합 낱말 ${words} · 문장 ${sentences} · 모자람 ${short}`);
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
    const bank = await loadBank(language);
    const book = readBook(language);
    const taken = new Set<string>();
    for (const list of Object.values(book)) for (const sentence of list) taken.add(norm(sentence.text));
    const todo = bank
      .map((word, index) => ({ word, stage: stageOfRank(language, index) }))
      .filter((item) => (book[wordKey(item.word.w)]?.length ?? 0) < NEED);
    const slice = todo.slice(0, Math.max(0, limit - made));
    made += slice.length;
    const batches: { word: BankWord; stage: number }[][] = [];
    for (let at = 0; at < slice.length; at += BATCH) batches.push(slice.slice(at, at + BATCH));
    console.log(`${language}: 만들 ${slice.length} · 묶음 ${batches.length}`);
    let writing = Promise.resolve();
    await pool(batches, 6, async (batch) => {
      await fillBatch(language, batch, book, taken);
      writing = writing.then(() => writeBook(language, book));
      await writing;
      const ready = batch.filter((item) => (book[wordKey(item.word.w)]?.length ?? 0) >= NEED).length;
      console.log(`${language} ${batch[0]?.word.w ?? "?"} ${ready}/${batch.length}`);
    });
    writeBook(language, book);
    console.log(`${language} 끝`);
    if (made >= limit) break;
  }
  report();
}
