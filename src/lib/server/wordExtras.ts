/**
 * 찾아서 늘어나는 단어 은행(2026-10-31 사용자 "단어 검색 기능 — 은행에 없는 단어를 사용자가 검색하면 자동 추가 → 다른 사용자에게 반영"):
 * 단어장에서 낱말을 찾으면, 빈도 단어 목록(curriculum/vocabBank.ts)에 없고 아직 아무도 더하지 않은 낱말은 모델(Haiku, translate 경로)이
 * ① 그 언어의 실제 낱말인지(오타면 바른 꼴로) ② 사전형·품사·주제(·일본어 읽기) ③ 빈도 단어와 같은 카드(쓴 꼴·예문·뜻·예문 뜻)를 만들어
 * 모두가 같이 쓰는 추가 목록에 넣는다(`wordsextra:v1:<언어>:<n>` 50개 묶음 + 개수). 다른 사용자는 다음에 단어 묶음을 받을 때 같이 받는다.
 * 학습자 글은 찾은 낱말 하나뿐이고 누가 찾았는지는 남기지 않는다(하루 더하기 한도를 세는 열쇠만 하루 뒤 사라짐).
 */
import { kvGetJson, kvGetNumber, kvIncrBy, kvSetJson } from "./kv.ts";
import { completeChat } from "./llm.ts";
import { getOpenAIClient } from "./openai.ts";
import { translated, textsFingerprint } from "./stageCopy.ts";
import { INTERFACE_LANGUAGE_LABELS } from "../learningLanguages.ts";
import { BANK_CHUNK, loadBank, POS_GROUPS, TOPICS } from "../curriculum/vocabBank.ts";
import { isSpaceless, segmentWords } from "../wordSegments.ts";
import type { WordCard } from "./wordCards.ts";

export type ExtraWord = WordCard & { pos: string; topic?: string };

const TTL_SECONDS = 800 * 24 * 60 * 60;
/** 언어마다 더할 수 있는 낱말 수, 한 사람이 하루에 더할 수 있는 수. */
export const EXTRA_CAP = 3000;
export const ADDS_PER_DAY = 30;

const countKey = (language: string) => `wordsextra:v1:${language}:count`;
const chunkKey = (language: string, chunk: number) => `wordsextra:v1:${language}:${chunk}`;
const indexKey = (language: string, word: string) => `wordsextra:v1:${language}:w:${word}`;

/** 찾는 말 다듬기: 앞뒤 공백·문장부호를 떼고, 라틴 글자면 소문자. 낱말(두 낱말까지)이 아니면 null. */
export function normalizeQuery(language: string, raw: string): string | null {
  const text = raw.normalize("NFC").trim().replace(/^[\p{P}\p{S}\s]+|[\p{P}\p{S}\s]+$/gu, "");
  if (!text || text.length > 30 || /[\p{Nd}<>{}@/\\]/u.test(text)) return null;
  // 띄어쓰기 없는 말은 낱말 자르기가 합성어를 쪼개니(ตุ่นปากเป็ด → 셋) 글자 수로, 나머지는 두 낱말까지.
  if (isSpaceless(text) ? [...text].length > 12 : segmentWords(text, language).length > 2) return null;
  return /\p{Script=Latin}|\p{Script=Cyrillic}/u.test(text) ? text.toLocaleLowerCase() : text;
}

export async function extraCount(language: string): Promise<number> {
  return Math.min(EXTRA_CAP, await kvGetNumber(countKey(language)).catch(() => 0));
}

export async function extraChunk(language: string, chunk: number): Promise<ExtraWord[]> {
  return (await kvGetJson<ExtraWord[]>(chunkKey(language, chunk)).catch(() => null)) ?? [];
}

async function makeCard(language: string, query: string): Promise<ExtraWord | null> {
  const client = getOpenAIClient();
  if (!client) return null;
  const name = INTERFACE_LANGUAGE_LABELS[language] ?? language;
  const completion = await completeChat(client, "translate", {
    temperature: 0.2,
    max_tokens: 1200,
    messages: [
      {
        role: "system",
        content: `A learner of ${name} looked up a word. Decide if it is a real, common ${name} word (or a common misspelling of one). If it is not a ${name} word, or it is a name of a person, brand or place, or it is rude, answer exactly NO.
Otherwise answer one line:
W|<dictionary form in ${name}>|<part of speech: ${POS_GROUPS.join(", ")}, or another word for function words>|<topic: ${TOPICS.join(", ")}>|<reading in kana if Japanese, else ->|<form as it appears in the sentence>|<one short natural everyday sentence in ${name}, 4 to 10 words, using the word>|<short English meaning, 1 to 4 words>|<English translation of the sentence>
No digits.`,
      },
      { role: "user", content: query },
    ],
  });
  const raw = String(completion.choices[0]?.message?.content ?? "").trim();
  const line = raw.split(/\r?\n/).map((one) => one.replace(/^[\s*\-•]+/u, "").replace(/\*\*/g, "")).find((one) => one.startsWith("W|"));
  if (!line) return null;
  const cells = line.split("|").map((cell) => cell.trim());
  if (cells.length < 9) return null;
  const [, w, pos, topic, reading, piece, example, gloss, exampleGloss] = cells as [string, string, string, string, string, string, string, string, string];
  const card: ExtraWord = {
    w: normalizeQuery(language, w) ?? "",
    piece,
    example,
    gloss,
    exampleGloss,
    pos: pos.toLowerCase(),
    ...((TOPICS as readonly string[]).includes(topic) ? { topic } : {}),
    ...(language === "ja" && reading && reading !== "-" ? { reading } : {}),
  };
  if (!card.w || !piece || !example.includes(piece) || example.length > 90 || /\p{Nd}/u.test(example) || !gloss || !exampleGloss) return null;
  return card;
}

export type SearchResult = { status: "bank" | "extra" | "added" | "invalid" | "limit"; word?: string; card?: ExtraWord };

/**
 * 찾은 낱말: 빈도 목록·추가 목록에 있으면 그대로, 없으면 만들어 더한다. user는 하루 한도를 세는 데만(남기지 않음).
 */
export async function searchWord(language: string, query: string, user: string, onMake?: () => void): Promise<SearchResult> {
  const word = normalizeQuery(language, query);
  if (!word) return { status: "invalid" };
  const bank = await loadBank(language);
  const inBank = (w: string) => bank.some((one) => one.w.toLocaleLowerCase() === w.toLocaleLowerCase() || one.reading === w);
  if (inBank(word)) return { status: "bank", word };
  const at = await kvGetJson<{ chunk: number }>(indexKey(language, word)).catch(() => null);
  if (at) {
    const card = (await extraChunk(language, at.chunk)).find((one) => one.w === word);
    if (card) return { status: "extra", word, card };
  }
  if ((await extraCount(language)) >= EXTRA_CAP) return { status: "limit", word };
  const day = new Date().toISOString().slice(0, 10);
  const used = await kvIncrBy(`wordsextra:v1:rate:${day}:${user || "anon"}`, 1, 2 * 24 * 60 * 60).catch(() => ADDS_PER_DAY + 1);
  if (used > ADDS_PER_DAY) return { status: "limit", word };
  onMake?.();
  const card = await makeCard(language, word).catch(() => null);
  if (!card) return { status: "invalid", word };
  // 사전형이 빈도 목록·추가 목록에 이미 있으면 새로 더하지 않는다(찾은 꼴 → 사전형으로 안내).
  if (inBank(card.w)) return { status: "bank", word: card.w };
  const known = await kvGetJson<{ chunk: number }>(indexKey(language, card.w)).catch(() => null);
  if (known) {
    const have = (await extraChunk(language, known.chunk)).find((one) => one.w === card.w);
    if (have) return { status: "extra", word: card.w, card: have };
  }
  const n = await kvIncrBy(countKey(language), 1).catch(() => 0);
  if (!n) return { status: "invalid", word };
  const chunk = Math.floor((n - 1) / BANK_CHUNK);
  const list = await extraChunk(language, chunk);
  await kvSetJson(chunkKey(language, chunk), [...list.filter((one) => one.w !== card.w), card], TTL_SECONDS).catch(() => undefined);
  await kvSetJson(indexKey(language, card.w), { chunk }, TTL_SECONDS).catch(() => undefined);
  if (card.w !== word) await kvSetJson(indexKey(language, word), { chunk }, TTL_SECONDS).catch(() => undefined);
  return { status: "added", word: card.w, card };
}

/** 앱 언어로 뜻 둘을 옮긴 카드들. */
export async function cardsInUi(language: string, cards: readonly ExtraWord[], ui: string, onMake?: () => void): Promise<ExtraWord[]> {
  if (ui === "en" || !cards.length) return [...cards];
  const lines = cards.flatMap((card) => [card.gloss, card.exampleGloss]);
  const moved = await translated(lines, ui, INTERFACE_LANGUAGE_LABELS[ui] ?? "English", `wordsextra:v1:gloss:${language}:${textsFingerprint(lines)}:${ui}`, onMake).catch(() => null);
  if (!moved) return [...cards];
  return cards.map((card, i) => ({ ...card, gloss: moved[i * 2] || card.gloss, exampleGloss: moved[i * 2 + 1] || card.exampleGloss }));
}
