/**
 * 단계 학습 줄의 읽는 법(2026-10-29 사용자 "읽는 법 넣어줘", 0단계 다음 — 글자가 다른 학습 언어만, curriculum/lettersFirst.ts).
 * 일본어 = 히라가나(한자를 가나로, 가타카나는 그대로), 중국어 = 병음(성조 부호), 그 밖 = 라틴 문자 표기(한국어 개정 로마자 등).
 * 단계마다 줄을 60개씩 Haiku가 한 번 옮기고 모두가 같이 쓴다(`readings:v1`). 학습자 글 없음 — 대본 줄만.
 */
import { kvGetJson, kvSetJson } from "./kv.ts";
import { completeChat } from "./llm.ts";
import { getOpenAIClient } from "./openai.ts";
import { scriptsFor } from "../curriculum/stageScripts.ts";
import { needsLetters } from "../curriculum/letterLangs.ts";

const TTL_SECONDS = 400 * 24 * 60 * 60;
const CHUNK = 60;

const HOW: Record<string, string> = {
  ja: "in hiragana: write every kanji with its reading in hiragana for this sentence, keep katakana words and punctuation as they are",
  zh: "in Hanyu Pinyin with tone marks, one space between words",
  ko: "in Revised Romanization of Korean, spaced as the Korean words are",
  th: "in a simple Latin romanization with tone marks on the vowels (à á â ǎ for low, high, falling, rising; no mark for mid), one space between words",
  ar: "in a simple Latin transliteration with the short vowels written out (ā ī ū for long vowels, ʿ for ayn, ʾ for hamza)",
  ru: "in a simple Latin transliteration, with an acute accent on the stressed vowel",
  hi: "in a simple Latin transliteration (ā ī ū for long vowels, ṭ ḍ ṇ for retroflex sounds)",
};

function looksRight(language: string, text: string): boolean {
  if (!text) return false;
  if (language === "ja") return /^[\p{Script=Hiragana}\p{Script=Katakana}ー\s\p{P}\p{S}\d０-９A-Za-z]+$/u.test(text);
  return /^[\p{Script=Latin}\p{M}\s\p{P}\p{S}\dʼʾʿ]+$/u.test(text);
}

export function readingSources(language: string, stage: number): string[] {
  const out = new Set<string>();
  for (const script of scriptsFor(language, stage)) {
    for (const line of script.lines) {
      out.add(line.text);
      for (const variant of line.alt ?? []) out.add(variant.text);
    }
  }
  return [...out];
}

async function readChunk(language: string, lines: string[]): Promise<string[] | null> {
  const client = getOpenAIClient();
  if (!client) return null;
  const completion = await completeChat(client, "translate", {
    temperature: 0,
    max_tokens: 8000,
    messages: [
      {
        role: "system",
        content: `Each numbered line is a sentence a beginner learns. Write how each line is read aloud ${HOW[language]}. Do not translate, explain or add anything. Answer with exactly ${lines.length} lines in the same order, each as <number>|<reading>, and nothing else.`,
      },
      { role: "user", content: lines.map((text, index) => `${index + 1}|${text.replace(/\s+/g, " ")}`).join("\n") },
    ],
  });
  const raw = String(completion.choices[0]?.message?.content ?? "");
  const byNumber = new Map<number, string>();
  for (const row of raw.split(/\r?\n/)) {
    const match = /^\s*(\d+)\s*[|｜]\s*(.*)$/.exec(row);
    if (match) byNumber.set(Number(match[1]), match[2]!.trim());
  }
  const out = lines.map((_, index) => byNumber.get(index + 1) ?? "");
  // 모양이 안 맞는 줄은 비워 둔다(그 줄만 읽는 법 없이) — 절반 넘게 틀리면 실패로.
  const good = out.map((text) => (looksRight(language, text) ? text : ""));
  return good.filter(Boolean).length >= lines.length / 2 ? good : null;
}

/** 그 단계 줄 → 읽는 법(없는 줄은 빠짐). */
export async function stageReadings(language: string, stage: number, onMake?: () => void): Promise<Record<string, string>> {
  if (!needsLetters(language) || !HOW[language]) return {};
  const lines = readingSources(language, stage);
  const out: Record<string, string> = {};
  for (let start = 0, part = 0; start < lines.length; start += CHUNK, part += 1) {
    const chunk = lines.slice(start, start + CHUNK);
    const key = `readings:v1:${language}:${stage}:${part}:${chunk.length}`;
    let got = await kvGetJson<string[]>(key).catch(() => null);
    if (!Array.isArray(got) || got.length !== chunk.length) {
      onMake?.();
      got = await readChunk(language, chunk).catch(() => null);
      if (got) await kvSetJson(key, got, TTL_SECONDS).catch(() => undefined);
    }
    if (got) chunk.forEach((text, index) => got![index] && (out[text] = got![index]!));
  }
  return out;
}
