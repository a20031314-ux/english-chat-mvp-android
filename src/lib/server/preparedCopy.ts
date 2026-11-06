/**
 * 넣어 둔 문법·표현 문제(curriculum/problems/*.json — 뜻·까닭이 한국어)를 다른 앱 언어로(2026-11-06 사용자 "다른 앱언어도 나오게해줘").
 * 학습 언어 × 앱 언어 × 글 지문마다 한 번 옮겨 모두가 같이 씀(`preparedcopy:v1`, 학습자 글 없음). 보기·예문(학습 언어)은 옮기지 않는다.
 * 실패한 묶음은 빈 채 — 그 문제는 화면이 예전 모양으로 넘어간다(뜻이 한국어로 나오지 않게).
 */
import { kvGetJson, kvSetJson } from "./kv.ts";
import { completeChat } from "./llm.ts";
import { getOpenAIClient } from "./openai.ts";
import { looksLike, textsFingerprint } from "./stageCopy.ts";
import { INTERFACE_LANGUAGE_LABELS } from "../learningLanguages.ts";

type Raw = { kind?: string; gloss?: string; why?: string; options?: string[] };
export type PreparedCopy = Record<string, { gloss: string; why: string }>;

const TTL_SECONDS = 400 * 24 * 60 * 60;
const CHUNK = 40;

const FILES: Record<string, (() => Promise<{ default: Record<string, Raw> }>)[]> = {
  en: [2, 3, 4, 5].flatMap((n) => [() => import(`../curriculum/problems/en-e${n}.json`), () => import(`../curriculum/problems/en-g${n}.json`)]).concat([() => import("../curriculum/problems/en-g.json")]),
  ...Object.fromEntries(["zh", "ja", "es", "fr", "it", "pt", "ru", "vi", "id", "ar", "th", "hi"].map((lang) => [lang, [() => import(`../curriculum/problems/${lang}-g.json`)]])),
};

/** 옮길 문제(고르기만 — 단어 문제는 카드가 맡음): 열쇠 순서대로 [뜻, 까닭]. */
export async function preparedSource(language: string): Promise<{ key: string; gloss: string; why: string }[]> {
  const files = FILES[language];
  if (!files) return [];
  const books = await Promise.all(files.map((load) => load().catch(() => ({ default: {} as Record<string, Raw> }))));
  const out: { key: string; gloss: string; why: string }[] = [];
  for (const book of books) {
    for (const [key, raw] of Object.entries(book.default ?? {})) {
      if ((raw.kind === "grammar" || raw.kind === "expression") && raw.gloss && raw.why && raw.options?.length) out.push({ key, gloss: raw.gloss, why: raw.why });
    }
  }
  return out;
}

async function translateChunk(lines: string[], target: string, uiName: string, ui: string): Promise<string[] | null> {
  const client = getOpenAIClient();
  if (!client) return null;
  const completion = await completeChat(client, "translate", {
    temperature: 0,
    max_tokens: 6000,
    messages: [
      {
        role: "system",
        content: `Translate each numbered line from Korean into ${uiName}. The lines belong to a quiz on a ${target}-learning app read by a ${uiName} speaker: some are the meaning of a ${target} sentence, some explain in one sentence why a ${target} form is right. Write every line in ${uiName}. Keep every ${target} word, form, particle and grammar term exactly as written in ${target} — never translate or change them. Plain and natural, the same length or shorter. Answer with exactly ${lines.length} lines in the same order, each as <number>|<translation>, and nothing else.`,
      },
      { role: "user", content: lines.map((text, index) => `${index + 1}|${text.replace(/\s+/g, " ")}`).join("\n") },
    ],
  });
  const raw = String(completion.choices[0]?.message?.content ?? "");
  const byNumber = new Map<number, string>();
  for (const line of raw.split(/\r?\n/)) {
    const match = /^\s*(\d+)\s*[|｜]\s*(.*)$/.exec(line);
    if (match) byNumber.set(Number(match[1]), match[2]!.trim());
  }
  const texts = lines.map((_, index) => byNumber.get(index + 1) ?? "");
  if (texts.some((text) => !text) || !looksLike(ui, texts)) return null;
  return texts;
}

/**
 * 그 학습 언어 문제의 뜻·까닭을 앱 언어로. 한국어 앱은 원문 그대로, 앱 언어 = 학습 언어면 빈 표(뜻 줄이 곧 문장이라 문제를 안 냄).
 * `onMake`는 실제로 모델을 부를 때만(요금 기록 — preparedCopy op).
 */
export async function preparedCopy(language: string, ui: string, onMake?: () => void): Promise<PreparedCopy> {
  if (ui === language) return {};
  const source = await preparedSource(language);
  if (!source.length) return {};
  if (ui === "ko") return Object.fromEntries(source.map((one) => [one.key, { gloss: one.gloss, why: one.why }]));
  const uiName = INTERFACE_LANGUAGE_LABELS[ui];
  const target = INTERFACE_LANGUAGE_LABELS[language] ?? language;
  if (!uiName) return {};
  const out: PreparedCopy = {};
  let metered = false;
  const parts: (typeof source)[] = [];
  for (let start = 0; start < source.length; start += CHUNK / 2) parts.push(source.slice(start, start + CHUNK / 2));
  await Promise.all(
    parts.map(async (part) => {
      const lines = part.flatMap((one) => [one.gloss, one.why]);
      const key = `preparedcopy:v1:${language}:${ui}:${textsFingerprint(lines)}`;
      let texts: string[] | null = null;
      try {
        const kept = await kvGetJson<string[]>(key);
        if (Array.isArray(kept) && kept.length === lines.length) texts = kept;
      } catch {
        // 저장소가 안 되면 옮긴다.
      }
      if (!texts) {
        if (!metered) {
          metered = true;
          onMake?.();
        }
        texts = await translateChunk(lines, target, uiName, ui).catch(() => null);
        if (texts) await kvSetJson(key, texts, TTL_SECONDS).catch(() => undefined);
      }
      if (!texts) return;
      part.forEach((one, index) => {
        out[one.key] = { gloss: texts![index * 2]!, why: texts![index * 2 + 1]! };
      });
    }),
  );
  return out;
}
