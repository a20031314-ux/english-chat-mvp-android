/**
 * 빈도 단어 카드(2026-10-29, curriculum/vocabBank.ts): 50개 묶음마다 한 번 Haiku가 낱말마다 예문 한 줄·쓴 꼴·영어 뜻·예문 영어 뜻을 만들고,
 * 앱 언어가 영어가 아니면 뜻 둘을 옮겨 둔다(stageCopy.translated와 같은 방식). 모두가 같이 쓰는 저장(`words:v1`), 학습자 글 없음.
 * 예문은 그 낱말(또는 그 활용형 piece)을 그대로 담아야 하고(빈칸 문제), 짧고 일상적인 말 — 지키지 않은 줄은 버린다(그 낱말은 카드 없이 빠짐).
 */
import { kvGetJson, kvSetJson } from "./kv.ts";
import { completeChat } from "./llm.ts";
import { getOpenAIClient } from "./openai.ts";
import { textsFingerprint, translated } from "./stageCopy.ts";
import { BANK_CHUNK, loadBank, type BankWord } from "../curriculum/vocabBank.ts";
import { segmentWords } from "../wordSegments.ts";
import { INTERFACE_LANGUAGE_LABELS } from "../learningLanguages.ts";

export type WordCard = { w: string; piece: string; example: string; gloss: string; exampleGloss: string; reading?: string };

const TTL_SECONDS = 400 * 24 * 60 * 60;

function cardOk(language: string, card: WordCard): boolean {
  if (!card.piece || !card.example || !card.gloss || !card.exampleGloss) return false;
  if (!card.example.includes(card.piece) || card.example.length > 90) return false;
  const words = segmentWords(card.example, language).length;
  return words >= 2 && words <= 14;
}

async function makeCards(language: string, words: readonly BankWord[]): Promise<WordCard[] | null> {
  const client = getOpenAIClient();
  if (!client) return null;
  const name = INTERFACE_LANGUAGE_LABELS[language] ?? language;
  const completion = await completeChat(client, "translate", {
    temperature: 0.3,
    max_tokens: 9000,
    messages: [
      {
        role: "system",
        content: `You write flashcards for a beginner learning ${name}. For each numbered ${name} word, write one short, natural sentence a person would really say in everyday conversation (4 to 10 words), using that word in its most common meaning. The sentence must contain the word itself, or one inflected form of it; give that exact form as it appears in the sentence. Use simple, common words around it. No names of real people, brands or places, nothing rude. Then give a short English meaning of the word (1 to 4 words) and an English translation of the sentence.
Answer with exactly one line per word, in the same order, as <number>|<form in the sentence>|<sentence>|<English meaning>|<English translation>, and nothing else.`,
      },
      { role: "user", content: words.map((word, index) => `${index + 1}|${word.w}${word.pos ? ` (${word.pos})` : ""}`).join("\n") },
    ],
  });
  const raw = String(completion.choices[0]?.message?.content ?? "");
  const out: WordCard[] = [];
  const byNumber = new Map<number, string[]>();
  for (const line of raw.split(/\r?\n/)) {
    const match = /^\s*(\d+)\s*\|(.*)$/.exec(line);
    if (match) byNumber.set(Number(match[1]), match[2]!.split("|").map((part) => part.trim()));
  }
  words.forEach((word, index) => {
    const parts = byNumber.get(index + 1);
    if (!parts || parts.length < 4) return;
    const [piece, example, gloss, exampleGloss] = parts as [string, string, string, string];
    const card: WordCard = { w: word.w, piece, example, gloss, exampleGloss, ...(word.reading ? { reading: word.reading } : {}) };
    if (cardOk(language, card)) out.push(card);
  });
  return out.length >= words.length / 2 ? out : null;
}

/** 묶음 하나(순위 chunk*50 ~)의 카드. 앱 언어가 영어가 아니면 뜻을 그 말로. */
export async function wordCards(language: string, chunk: number, ui: string, uiName: string, onMake?: () => void): Promise<WordCard[]> {
  const bank = await loadBank(language);
  const words = bank.slice(chunk * BANK_CHUNK, (chunk + 1) * BANK_CHUNK);
  if (!words.length) return [];
  const key = `words:v1:${language}:${chunk}`;
  let cards = await kvGetJson<WordCard[]>(key).catch(() => null);
  if (!Array.isArray(cards) || !cards.length) {
    onMake?.();
    const made = await makeCards(language, words).catch(() => null);
    if (!made) return [];
    // 같은 묶음을 두 요청이 함께 만들면 먼저 저장된 것을 쓴다(뜻 옮김이 다른 예문에 붙지 않게, 2026-10-31).
    const raced = await kvGetJson<WordCard[]>(key).catch(() => null);
    cards = Array.isArray(raced) && raced.length ? raced : made;
    if (cards === made) await kvSetJson(key, cards, TTL_SECONDS).catch(() => undefined);
  } else {
    // 목록이 늘어 묶음 끝이 새로 찬 경우(예: 2,992개 → 7,000개, 2026-10-31): 카드 없는 낱말이 열 개 넘으면 그것만 더 만든다.
    const have = new Set(cards.map((card) => card.w));
    const missing = words.filter((word) => !have.has(word.w));
    if (missing.length > 10) {
      onMake?.();
      const more = await makeCards(language, missing).catch(() => null);
      if (more?.length) {
        cards = [...cards, ...more];
        await kvSetJson(key, cards, TTL_SECONDS).catch(() => undefined);
      }
    }
  }
  if (ui === "en") return cards;
  const lines = cards.flatMap((card) => [card.gloss, card.exampleGloss]);
  // 옮긴 뜻은 원문 줄에 묶는다 — 예전 열쇠는 카드가 바뀌어도 그대로 남아 다른 예문의 뜻이 붙었다(2026-10-31 태국어 ถัง).
  const moved = await translated(lines, ui, uiName, `words:v2:${language}:${chunk}:${ui}:${textsFingerprint(lines)}`, onMake);
  if (!moved) return cards;
  return cards.map((card, index) => ({ ...card, gloss: moved[index * 2]!, exampleGloss: moved[index * 2 + 1]! }));
}
