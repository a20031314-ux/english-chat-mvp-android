/**
 * 단어 사전 낱말의 여러 뜻(2026-11-06 사용자 "뜻이 여러 개일 때는?" → "고정 가능한 거야?" → "붙여줘").
 *
 * 낱말 × 앱 언어마다 처음 열 때 한 번 모델(vocab 경로)이 뜻 1~4개(뜻마다 품사·예문·예문 뜻)를 만들고,
 * `wordsense:v1:<언어>:<앱 언어>:<낱말>`에 남겨 모두가 같이 쓴다 — 그 뒤엔 모델을 부르지 않는다(고정).
 * 빈도 목록·찾아서 더한 낱말에 있는 낱말만 만든다(아무 글이나 넣어 모델을 부르지 못하게). 학습자 글은 받지 않는다.
 */
import { kvGetJson, kvSetJsonIfAbsent } from "./kv.ts";
import { completeChat } from "./llm.ts";
import { getOpenAIClient } from "./openai.ts";
import { INTERFACE_LANGUAGE_LABELS } from "../learningLanguages.ts";
import { loadBank } from "../curriculum/vocabBank.ts";
import { extraCount, extraChunk } from "./wordExtras.ts";
import { BANK_CHUNK } from "../curriculum/vocabBank.ts";

export type WordSense = { gloss: string; pos?: string; example?: string; exampleGloss?: string };

const POS: Record<string, string> = { noun: "noun", verb: "verb", adj: "adj", adjective: "adj", adv: "adv", adverb: "adv", other: "other" };
const TTL_SECONDS = 400 * 24 * 60 * 60;
export const senseKey = (language: string, ui: string, word: string) => `wordsense:v1:${language}:${ui}:${word}`;

/** 모델 답(JSON) → 뜻 목록. 뜻 칸이 빈 것은 버리고, 예문은 그 낱말(또는 앞 세 글자)을 담을 때만. 넷까지. */
export function parseSenses(raw: unknown, word: string): WordSense[] {
  const list = raw && typeof raw === "object" ? (raw as { senses?: unknown }).senses : null;
  if (!Array.isArray(list)) return [];
  const str = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");
  // 활용 꼴도 받게 앞부분만 본다: 두 글자 이하는 첫 글자, 그 위는 절반(셋까지) — 上がる → 上が, banco → ban.
  const chars = [...word.toLocaleLowerCase()];
  const stem = chars.slice(0, chars.length <= 2 ? 1 : Math.min(3, Math.ceil(chars.length / 2))).join("");
  const out: WordSense[] = [];
  for (const one of list) {
    if (!one || typeof one !== "object") continue;
    const o = one as Record<string, unknown>;
    const gloss = str(o.gloss, 80);
    if (!gloss || out.some((have) => have.gloss === gloss)) continue;
    const example = str(o.example, 160);
    const fits = example && example.toLocaleLowerCase().includes(stem) && !/\d/.test(example);
    const exampleGloss = str(o.exampleGloss, 200);
    const pos = POS[str(o.pos, 20).toLocaleLowerCase()] ?? (str(o.pos, 20) ? "other" : "");
    out.push({ gloss, ...(pos ? { pos } : {}), ...(fits ? { example, ...(exampleGloss ? { exampleGloss } : {}) } : {}) });
    if (out.length >= 4) break;
  }
  return out;
}

async function listed(language: string, word: string): Promise<{ pos?: string } | null> {
  const bank = await loadBank(language);
  const hit = bank.find((one) => one.w === word);
  if (hit) return { pos: hit.pos };
  const total = await extraCount(language).catch(() => 0);
  for (let c = 0; c * BANK_CHUNK < total; c += 1) {
    const found = (await extraChunk(language, c).catch(() => [])).find((one) => one.w === word);
    if (found) return { pos: found.pos };
  }
  return null;
}

/** 낱말의 뜻들(앱 언어). 저장된 것이 있으면 그것, 없으면 한 번 만든다. 목록에 없는 낱말·실패면 []. onMake는 모델을 부를 때만. */
export async function wordSenses(language: string, word: string, ui: string, onMake?: () => void): Promise<WordSense[]> {
  const w = word.trim().slice(0, 60);
  if (!w) return [];
  const key = senseKey(language, ui, w);
  const have = await kvGetJson<WordSense[]>(key).catch(() => null);
  if (Array.isArray(have)) return have;
  const entry = await listed(language, w);
  const client = getOpenAIClient();
  if (!entry || !client) return [];
  const name = INTERFACE_LANGUAGE_LABELS[language] ?? language;
  const uiName = INTERFACE_LANGUAGE_LABELS[ui] ?? "English";
  onMake?.();
  const completion = await completeChat(client, "vocab", {
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You write a learner's dictionary entry for the ${name} word given by the user${entry.pos ? ` (listed as ${entry.pos})` : ""}.
List its distinct common meanings, most common first: one meaning if it really has only one, at most four. Skip rare, archaic, slang and vulgar senses. Senses that only differ in nuance are one meaning.
For each meaning:
- gloss: a short natural meaning in ${uiName} (1 to 5 words; synonyms separated by commas are fine).
- pos: one of noun, verb, adj, adv, other.
- example: one short everyday ${name} sentence (4 to 10 words) using the word in exactly this meaning (the word itself or one inflected form). No digits, no names of real people or brands, nothing rude.
- exampleGloss: a natural ${uiName} translation of that sentence.
Answer with only JSON: {"senses":[{"gloss":"","pos":"","example":"","exampleGloss":""}]}`,
      },
      { role: "user", content: w },
    ],
  });
  const raw = completion.choices[0]?.message?.content;
  let senses: WordSense[] = [];
  try {
    senses = parseSenses(JSON.parse(String(raw ?? "")), w);
  } catch {
    senses = [];
  }
  // 빈 답은 남기지 않는다(다음에 다시). 먼저 남긴 사람이 있으면 그것이 고정.
  if (!senses.length) return [];
  const first = await kvSetJsonIfAbsent(key, senses, TTL_SECONDS).catch(() => false);
  if (first) return senses;
  return (await kvGetJson<WordSense[]>(key).catch(() => null)) ?? senses;
}
