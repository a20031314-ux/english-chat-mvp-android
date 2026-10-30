/**
 * 자라는 문제은행 — 서버(2026-10-30 사용자 "그때그때 AI가 만들기, 문제은행식으로 계속 증식"). 규칙은 curriculum/qbankRules.ts.
 *
 * 열쇠(e|표현 · f|문장구조 · w|낱말)마다 모두가 같이 쓰는 묶음 `qbank:v1:<언어>:<열쇠>`: 모델(Haiku, translate 경로)이 만든 새 예문(학습 언어 + 영어 뜻)과
 * 조각마다 헷갈리는 오답. 앱이 보낸 풀이 결과(문장·맞음·보기·고른 보기 — 학습자가 친 글 없음)로 셈을 올리고, 너무 쉬운 예문·아무도 안 고르는 오답은 빼며,
 * needGrow면 한 번 더 만든다. 하루 전체 성장은 DAILY_BUDGET번까지(넘으면 있는 것만 돌려줌). 앱 언어 뜻은 stageCopy.translated로 옮겨 둔다.
 */
import { kvGetJson, kvIncrBy, kvSetJson } from "./kv.ts";
import { completeChat } from "./llm.ts";
import { getOpenAIClient } from "./openai.ts";
import { textsFingerprint, translated } from "./stageCopy.ts";
import { INTERFACE_LANGUAGE_LABELS } from "../learningLanguages.ts";
import { allFramesFor } from "../curriculum/frames.ts";
import { ladderFor } from "../curriculum/stages/index.ts";
import { acceptDecoy, acceptItem, applyResults, emptyEntry, needGrow, publicView, type BankEntry, type BankResult } from "../curriculum/qbankRules.ts";
import { allScriptsFor } from "../curriculum/stageScripts.ts";

const TTL_SECONDS = 400 * 24 * 60 * 60;
export const DAILY_BUDGET = 400;
const KEEP_RETIRED = 20;

const bankKey = (language: string, key: string) => `qbank:v1:${language}:${key}`;


/** 열쇠가 가리키는 조각(앱 데이터로 확인 — 아무 글이나 받지 않는다)과 무엇인지. */
export function targetOf(language: string, key: string): { piece: string; what: string } | null {
  if (key.startsWith("f|")) {
    const frame = allFramesFor(language).find((one) => one.id === key.slice(2));
    const core = frame?.core.find(Boolean);
    return frame && core ? { piece: core, what: `the sentence pattern "${frame.pattern}" (its fixed part "${core}")` } : null;
  }
  if (key.startsWith("e|")) {
    const expression = key.slice(2);
    const known = (ladderFor(language)?.stages ?? []).some((stage) => stage.expressions.includes(expression));
    return known ? { piece: expression, what: `the expression "${expression}"` } : null;
  }
  if (key.startsWith("w|")) {
    const word = key.slice(2).trim();
    if (!word || word.length > 30 || /[\p{Nd}<>{}]/u.test(word)) return null;
    return { piece: word, what: `the word "${word}"` };
  }
  return null;
}

async function makeMore(language: string, key: string, stage: number, entry: BankEntry): Promise<{ items: { t: string; p: string; g: string }[]; decoys: string[]; raw: string } | null> {
  const target = targetOf(language, key);
  const client = getOpenAIClient();
  if (!target || !client) return null;
  const name = INTERFACE_LANGUAGE_LABELS[language] ?? language;
  const have = [...entry.items.map((item) => item.t), ...allScriptsFor(language).flatMap((script) => script.lines.map((line) => line.text)).filter((text) => text.toLocaleLowerCase().includes(target.piece.toLocaleLowerCase()))].slice(0, 12);
  const decoysHave = Object.values(entry.decoys).flat().map((d) => d.d);
  const completion = await completeChat(client, "translate", {
    temperature: 0.8,
    max_tokens: 1600,
    messages: [
      {
        role: "system",
        content: `You write quiz material for learners of ${name} at level ${stage} of 5 (1 = absolute beginner). Target: ${target.what}.
1) Write four NEW short, natural, everyday sentences in ${name} that each contain "${target.piece}" exactly as written (same letters). Level ${stage}: ${stage <= 1 ? "very short, simple words only" : stage <= 3 ? "short, common words" : "natural everyday length"}. Different situations from each other and from the sentences given. No digits (write numbers as words), no names of real people or brands, nothing rude.
S|<sentence in ${name}>|<plain English translation>
2) Write three wrong options for the blank where "${target.piece}" goes: near misses a learner might plausibly but wrongly use — wrong conjugation, agreement, particle/case/preposition, word order, a look-alike word. Each must be wrong in every sentence above. Never an acceptable alternative (no contraction, synonym, politeness variant or spelling variant that is also correct). Must not contain "${target.piece}" and must not be part of it.
D|<wrong option>
Answer with exactly four S lines and three D lines, nothing else.`,
      },
      { role: "user", content: `Sentences already used (do not repeat): ${have.join(" / ") || "(none)"}\nWrong options already used: ${decoysHave.join(" / ") || "(none)"}` },
    ],
  });
  const raw = String(completion.choices[0]?.message?.content ?? "");
  const items: { t: string; p: string; g: string }[] = [];
  const decoys: string[] = [];
  const existing = new Set(have);
  for (const line of raw.split(/\r?\n/)) {
    // "1. S|…", "**S|**…", "- D|…"처럼 앞에 붙은 것은 떼고 읽는다.
    const cells = line.replace(/^[\s>*\-•\d.)]*/u, "").replace(/\*\*/g, "").split("|").map((cell) => cell.trim());
    if (cells[0] === "S" && cells[1] && cells[2] && acceptItem(entry, cells[1], target.piece, existing)) {
      // 조각은 문장 안 그대로의 꼴로(대소문자).
      const at = cells[1].toLocaleLowerCase().indexOf(target.piece.toLocaleLowerCase());
      const piece = cells[1].toLocaleLowerCase().length === cells[1].length ? cells[1].slice(at, at + target.piece.length) : target.piece;
      existing.add(cells[1]);
      items.push({ t: cells[1], p: piece, g: cells[2] });
    }
    if (cells[0] === "D" && cells[1]) decoys.push(cells[1]);
  }
  return { items, decoys, raw };
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * 열쇠 하나: 결과를 셈에 넣고, 필요하면 키우고, 앱에 보낼 모양을 돌려준다. onMake는 모델을 부를 때마다(계량).
 */
export async function bankFor(language: string, key: string, stage: number, results: readonly BankResult[], onMake?: () => void): Promise<BankEntry | null> {
  const target = targetOf(language, key);
  if (!target) return null;
  const storeKey = bankKey(language, key);
  let entry = (await kvGetJson<BankEntry>(storeKey).catch(() => null)) ?? emptyEntry();
  let changed = false;
  if (results.length) {
    entry = applyResults(entry, results);
    changed = true;
  }
  const day = today();
  // 키우기는 앱이 지금 풀려는 열쇠만(onMake가 있을 때) — 결과만 온 열쇠는 셈만.
  if (onMake && needGrow(entry, day)) {
    const spent = await kvIncrBy(`qbank:v1:budget:${day}`, 1, 2 * 24 * 60 * 60).catch(() => DAILY_BUDGET + 1);
    if (spent <= DAILY_BUDGET) {
      onMake?.();
      const more = await makeMore(language, key, stage, entry).catch(() => null);
      if (more) {
        entry = { ...entry, items: [...entry.items], decoys: { ...entry.decoys } };
        for (const item of more.items) entry.items.push({ ...item, s: stage, n: 0, r: 0 });
        // 오답은 조각의 기본 꼴에 붙인다(예문마다 대소문자가 달라도 같은 칸).
        const slot = target.piece;
        const list = [...(entry.decoys[slot] ?? [])];
        for (const decoy of more.decoys) if (acceptDecoy(slot, decoy, list) && !entry.items.some((item) => item.t.toLocaleLowerCase().includes(decoy.toLocaleLowerCase()))) list.push({ d: decoy, n: 0, k: 0 });
        entry.decoys[slot] = list.slice(-6);
        // 하나도 못 건졌으면 모델 답을 묶음에 잠깐 남긴다(점검 — 앱에는 안 감, 다음 성장 때 덮임).
        (entry as BankEntry & { last?: string }).last = !more.items.length || !list.length ? more.raw.slice(0, 800) : "";
        entry.grownAt = entry.served;
        entry.dayGrows = entry.day === day ? entry.dayGrows + 1 : 1;
        entry.day = day;
        changed = true;
      }
    }
  }
  if (changed) {
    // 뺀 예문은 최근 것만 조금 남긴다(같은 문장을 다시 만들지 않게).
    const live = entry.items.filter((item) => !item.off);
    const off = entry.items.filter((item) => item.off).slice(-KEEP_RETIRED);
    entry = { ...entry, items: [...off, ...live] };
    await kvSetJson(storeKey, entry, TTL_SECONDS).catch(() => undefined);
  }
  return entry;
}

/** 앱에 보낼 모양(앱 언어 뜻을 붙여서). */
export async function bankView(language: string, key: string, entry: BankEntry, ui: string, onMake?: () => void) {
  const view = publicView(entry);
  if (ui === "en" || !view.items.length) return { ...view, items: view.items.map((item) => ({ ...item })) };
  const uiName = INTERFACE_LANGUAGE_LABELS[ui] ?? "English";
  const moved = await translated(view.items.map((item) => item.gloss), ui, uiName, `qbank:v1:gloss:${language}:${textsFingerprint(view.items.map((item) => item.gloss))}:${ui}`, onMake).catch(() => null);
  return { ...view, items: view.items.map((item, i) => ({ ...item, ...(moved?.[i] ? { uiGloss: moved[i] } : {}) })) };
}
