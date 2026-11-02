/**
 * 자라는 문제은행 — 서버(2026-10-30 사용자 "그때그때 AI가 만들기, 문제은행식으로 계속 증식"). 규칙은 curriculum/qbankRules.ts.
 *
 * 열쇠(e|표현 · f|문장구조 · w|낱말)마다 모두가 같이 쓰는 묶음 `qbank:v1:<언어>:<열쇠>`: 모델(Haiku, translate 경로)이 만든 새 예문(학습 언어 + 영어 뜻)과
 * 조각마다 헷갈리는 오답. 앱이 보낸 풀이 결과(문장·맞음·보기·고른 보기 — 학습자가 친 글 없음)로 셈을 올리고, 너무 쉬운 예문·아무도 안 고르는 오답은 빼며,
 * needGrow면 한 번 더 만든다. 하루 전체 성장은 DAILY_BUDGET번까지(넘으면 있는 것만 돌려줌). 앱 언어 뜻은 stageCopy.translated로 옮겨 둔다.
 *
 * 출시 초반 미리 채우기·고정(2026-11-01 사용자 "출시 초반에만 문장 생성을 하고 문장은행에 추가, 시스템이 잘 돌아갈 시 고정"):
 * - seedBanks: 예약 작업(/api/curriculum/qbank/seed, vercel.json)이 문장구조·단계 핵심 표현 열쇠를 14개 언어 1단계부터 차례로 비어 있는 것만 채운다
 *   — 사용자가 처음 풀 때 이미 문제은행 예문이 있게. 하루 성장 예산과 따로(SEED_PER_RUN), 다 돌면 멈춤.
 * - Vercel `QBANK_FROZEN=1`: 성장·미리 채우기 멈춤, 너무 쉬운 예문·안 골리는 오답도 안 뺌(지금 있는 것으로 고정). `QBANK_SEED=off`: 미리 채우기만 멈춤.
 */
import { kvGetJson, kvIncrBy, kvSetJson } from "./kv.ts";
import { completeChat } from "./llm.ts";
import { getOpenAIClient } from "./openai.ts";
import { textsFingerprint, translated } from "./stageCopy.ts";
import { INTERFACE_LANGUAGE_LABELS, SUPPORTED_LEARNING_LANGUAGES } from "../learningLanguages.ts";
import { allFramesFor } from "../curriculum/frames.ts";
import { ladderFor } from "../curriculum/stages/index.ts";
import { acceptDecoy, acceptForms, acceptItem, applyResults, emptyEntry, needGrow, publicView, type BankDecoy, type BankEntry, type BankResult } from "../curriculum/qbankRules.ts";
import { allScriptsFor } from "../curriculum/stageScripts.ts";

const TTL_SECONDS = 400 * 24 * 60 * 60;
export const DAILY_BUDGET = 400;
const KEEP_RETIRED = 20;

const bankKey = (language: string, key: string) => `qbank:v1:${language}:${key}`;

/** 문제은행을 지금 있는 것으로 고정했나(Vercel QBANK_FROZEN=1). */
export function bankFrozen(): boolean {
  return process.env.QBANK_FROZEN?.trim() === "1";
}


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

async function makeMore(language: string, key: string, stage: number, entry: BankEntry): Promise<{ items: { t: string; p: string; g: string; w?: string[] }[]; decoys: string[]; raw: string } | null> {
  const target = targetOf(language, key);
  const client = getOpenAIClient();
  if (!target || !client) return null;
  const name = INTERFACE_LANGUAGE_LABELS[language] ?? language;
  // 앱에 이미 있는 문장(문장구조 예문·대본 줄)과 겹치지 않게 — 모델에 보여 주는 건 열둘, 거르는 건 전부.
  const inApp = [
    ...(key.startsWith("f|") ? (allFramesFor(language).find((one) => one.id === key.slice(2))?.examples.map((example) => example.text) ?? []) : []),
    ...allScriptsFor(language).flatMap((script) => script.lines.map((line) => line.text)).filter((text) => text.toLocaleLowerCase().includes(target.piece.toLocaleLowerCase())),
  ];
  const have = [...entry.items.map((item) => item.t), ...inApp].slice(0, 12);
  const word = key.startsWith("w|");
  const decoysHave = Object.values(entry.decoys).flat().map((d) => d.d);
  const completion = await completeChat(client, "translate", {
    temperature: 0.8,
    max_tokens: 1600,
    messages: [
      {
        role: "system",
        content: `You write quiz material for learners of ${name} at level ${stage} of 5 (1 = absolute beginner). Target: ${target.what}.
1) Write four NEW short, natural, everyday sentences in ${name} that each contain ${word ? `the word "${target.piece}" — in two of them use it exactly as written, and in the other two (when the word has other forms in ${name}) use a different form of it (another tense, person, number, case, comparative or ending) that the sentence clearly needs` : `"${target.piece}" exactly as written (same letters)`}. Level ${stage}: ${stage <= 1 ? "very short, simple words only" : stage <= 3 ? "short, common words" : "natural everyday length"}. Different situations from each other and from the sentences given. No digits (write numbers as words), no names of real people or brands, nothing rude.
${word ? `S|<sentence in ${name}>|<plain English translation>|<the form of the word exactly as it appears in the sentence>|<wrong forms>
For <wrong forms>: up to three OTHER forms of this same word (same word, different tense/person/number/case/comparative/ending — never a different word, never a misspelling), separated by ";", each grammatically WRONG in this exact sentence. The sentence must give a clear clue (subject, time word, auxiliary, agreement) so that only the form used fits. Leave out any form that would also be correct here. If the word has no other forms in ${name}, leave it empty.` : `S|<sentence in ${name}>|<plain English translation>`}
2) Write three wrong options for the blank where "${target.piece}" goes: ${key.startsWith("w|") ? `wrong forms a learner might really produce — another form of the same word that does not fit here (conjugation, agreement, part of speech), or a real word of the same kind that is grammatically wrong in this slot. Never a misspelling, a made-up word, or a word that only rhymes or looks alike` : "near misses a learner might plausibly but wrongly use — wrong conjugation, agreement, particle/case/preposition, word order, a look-alike word"}. Each must be wrong in every sentence above. Never an acceptable alternative (no contraction, synonym, politeness variant or spelling variant that is also correct). Must not contain "${target.piece}" and must not be part of it.
D|<wrong option>
Answer with exactly four S lines and three D lines, nothing else.`,
      },
      { role: "user", content: `Sentences already used (do not repeat): ${have.join(" / ") || "(none)"}\nWrong options already used: ${decoysHave.join(" / ") || "(none)"}` },
    ],
  });
  const raw = String(completion.choices[0]?.message?.content ?? "");
  const items: { t: string; p: string; g: string; w?: string[] }[] = [];
  const decoys: string[] = [];
  const existing = new Set([...have, ...inApp]);
  for (const line of raw.split(/\r?\n/)) {
    // "1. S|…", "**S|**…", "- D|…"처럼 앞에 붙은 것은 떼고 읽는다.
    const cells = line.replace(/^[\s>*\-•\d.)]*/u, "").replace(/\*\*/g, "").split("|").map((cell) => cell.trim());
    // 낱말(w|)은 문장 속 꼴(넷째 칸)이 빈칸 — 다른 꼴로 쓴 문장도 받는다(2026-11-02 사용자 "형태만 달라진 같은 단어로 선지").
    const form = word && cells[3] && cells[3].length <= 40 && cells[1]?.toLocaleLowerCase().includes(cells[3].toLocaleLowerCase()) ? cells[3] : target.piece;
    if (cells[0] === "S" && cells[1] && cells[2] && acceptItem(entry, cells[1], form, existing)) {
      // 조각은 문장 안 그대로의 꼴로(대소문자).
      const at = cells[1].toLocaleLowerCase().indexOf(form.toLocaleLowerCase());
      const piece = cells[1].toLocaleLowerCase().length === cells[1].length ? cells[1].slice(at, at + form.length) : form;
      const wrong = word ? acceptForms(cells[1], piece, (cells[4] ?? "").split(";")) : [];
      existing.add(cells[1]);
      items.push({ t: cells[1], p: piece, g: cells[2], ...(wrong.length ? { w: wrong } : {}) });
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
    entry = applyResults(entry, results, { frozen: bankFrozen() });
    changed = true;
  }
  const day = today();
  // 키우기는 앱이 지금 풀려는 열쇠만(onMake가 있을 때) — 결과만 온 열쇠는 셈만.
  if (onMake && !bankFrozen() && needGrow(entry, day, { forms: key.startsWith("w|") })) {
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

/** 미리 채울 열쇠 — 단계 1부터, 단계마다 14개 언어의 문장구조 틀(f|) 다음 단계 핵심 표현(e|). 늘 같은 순서(커서로 이어 감). */
export function seedKeys(): { language: string; key: string; stage: number }[] {
  const out: { language: string; key: string; stage: number }[] = [];
  const languages = SUPPORTED_LEARNING_LANGUAGES.map((one) => one.code);
  for (let stage = 1; stage <= 5; stage += 1) {
    for (const language of languages) {
      for (const frame of allFramesFor(language)) if (frame.stage === stage) out.push({ language, key: `f|${frame.id}`, stage });
      const step = (ladderFor(language)?.stages ?? []).find((one) => one.order === stage);
      for (const expression of step?.expressions ?? []) out.push({ language, key: `e|${expression}`, stage });
    }
  }
  return out;
}

export const SEED_PER_RUN = 30;
const SEED_CURSOR = "qbank:v1:seed:cursor";

/**
 * 한 번 돌 때 SEED_PER_RUN개까지 비어 있는(예문 없음) 열쇠를 채운다. 이미 예문이 있는 열쇠는 건너뛴다(모델 안 부름).
 * onMake는 모델을 부를 때마다(계량). 끝까지 돌면 done.
 */
export async function seedBanks(onMake?: () => void, limit = SEED_PER_RUN): Promise<{ made: number; skipped: number; at: number; total: number; done: boolean; off?: string }> {
  const keys = seedKeys();
  if (bankFrozen()) return { made: 0, skipped: 0, at: 0, total: keys.length, done: false, off: "frozen" };
  if (process.env.QBANK_SEED?.trim() === "off") return { made: 0, skipped: 0, at: 0, total: keys.length, done: false, off: "seed off" };
  let at = (await kvGetJson<{ at: number }>(SEED_CURSOR).catch(() => null))?.at ?? 0;
  let made = 0;
  let skipped = 0;
  const day = today();
  // 한 번에 너무 오래 걸리지 않게(Vercel 한도) — 모델 호출 limit번 또는 살펴본 열쇠 limit×20개까지.
  while (at < keys.length && made < limit && made + skipped < limit * 20) {
    const one = keys[at]!;
    at += 1;
    const storeKey = bankKey(one.language, one.key);
    const entry = (await kvGetJson<BankEntry>(storeKey).catch(() => null)) ?? emptyEntry();
    if (entry.items.some((item) => !item.off) || !targetOf(one.language, one.key)) {
      skipped += 1;
      continue;
    }
    onMake?.();
    const more = await makeMore(one.language, one.key, one.stage, entry).catch(() => null);
    made += 1;
    if (!more?.items.length) continue;
    const slot = targetOf(one.language, one.key)!.piece;
    const next: BankEntry = { ...entry, items: more.items.map((item) => ({ ...item, s: one.stage, n: 0, r: 0 })), decoys: { ...entry.decoys } };
    const list: BankDecoy[] = [];
    for (const decoy of more.decoys) if (acceptDecoy(slot, decoy, list) && !next.items.some((item) => item.t.toLocaleLowerCase().includes(decoy.toLocaleLowerCase()))) list.push({ d: decoy, n: 0, k: 0 });
    next.decoys[slot] = list;
    next.day = day;
    next.dayGrows = 1;
    next.grownAt = next.served;
    await kvSetJson(storeKey, next, TTL_SECONDS).catch(() => undefined);
  }
  await kvSetJson(SEED_CURSOR, { at }, TTL_SECONDS).catch(() => undefined);
  return { made, skipped, at, total: keys.length, done: at >= keys.length };
}

/** 대화에서 온 튜터 줄을 하루에 이만큼까지 판정(모델 한 번씩). */
export const OFFER_BUDGET = 300;

/**
 * 대화에서 온 튜터 줄(2026-11-01 사용자 "예문을 통화·채팅 문장으로" → B-1 "사용자 정보가 있는 문장은 걸러서", lib/curriculum/talkQuiz.ts):
 * 앱이 이미 거른 줄(모든 낱말이 빈도 목록 안·숫자 없음)을 모델이 한 번 더 — 특정인을 알아볼 정보·민감한 내용(건강·연애·돈·정치·종교)·
 * 앞 대화 없이는 이상한 문장·문법 오류가 있으면 버리고, 통과하면 영어 뜻과 함께 그 열쇠 묶음에 더한다. 누가 보냈는지는 남기지 않는다.
 * 돌려줌: 더한 수. 고정(QBANK_FROZEN)이면 아무것도 안 함.
 */
export async function offerToBank(language: string, offers: readonly { key: string; text: string; stage: number }[], onMake?: () => void): Promise<number> {
  if (bankFrozen()) return 0;
  const client = getOpenAIClient();
  if (!client) return 0;
  const name = INTERFACE_LANGUAGE_LABELS[language] ?? language;
  let added = 0;
  for (const offer of offers) {
    const target = targetOf(language, offer.key);
    const text = offer.text.trim();
    if (!target || !text || text.length > 140 || /\p{Nd}/u.test(text) || !text.toLocaleLowerCase().includes(target.piece.toLocaleLowerCase())) continue;
    const storeKey = bankKey(language, offer.key);
    const entry = (await kvGetJson<BankEntry>(storeKey).catch(() => null)) ?? emptyEntry();
    if (entry.items.some((item) => item.t === text) || entry.items.filter((item) => !item.off).length >= 40) continue;
    const spent = await kvIncrBy(`qbank:v1:offer:${today()}`, 1, 2 * 24 * 60 * 60).catch(() => OFFER_BUDGET + 1);
    if (spent > OFFER_BUDGET) break;
    onMake?.();
    const completion = await completeChat(client, "translate", {
      temperature: 0,
      max_tokens: 300,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You screen one ${name} sentence taken from a tutor's line in a language-learning chat, before it is shown to other learners as a quiz example.
Reject it (ok false) if ANY of these is true: it could identify or describe a specific real person or their private life (names, places they live or work, family details, plans with dates); it touches health, relationships, money, politics, religion, sexuality, or anything sensitive; it only makes sense with the earlier conversation (refers to "that", "there", "it" or something said before without saying what); it has any grammar or spelling mistake; it is not a natural everyday sentence for a learner.
Otherwise ok true, with a plain English translation.
Reply with JSON only: {"ok":true,"en":"<translation>"} or {"ok":false}.`,
        },
        { role: "user", content: text },
      ],
    }).catch(() => null);
    const reply = String(completion?.choices[0]?.message?.content ?? "");
    let parsed: { ok?: boolean; en?: string } = {};
    try {
      parsed = JSON.parse(reply.slice(reply.indexOf("{"), reply.lastIndexOf("}") + 1)) as { ok?: boolean; en?: string };
    } catch {
      continue;
    }
    if (parsed.ok !== true || !parsed.en || parsed.en.length > 200) continue;
    const at = text.toLocaleLowerCase().indexOf(target.piece.toLocaleLowerCase());
    const piece = text.toLocaleLowerCase().length === text.length && at >= 0 ? text.slice(at, at + target.piece.length) : target.piece;
    const fresh = (await kvGetJson<BankEntry>(storeKey).catch(() => null)) ?? entry;
    if (fresh.items.some((item) => item.t === text)) continue;
    const next: BankEntry = { ...fresh, items: [...fresh.items, { t: text, p: piece, g: parsed.en, s: Math.min(5, Math.max(1, offer.stage)), n: 0, r: 0, o: "talk" }] };
    await kvSetJson(storeKey, next, TTL_SECONDS).catch(() => undefined);
    added += 1;
  }
  return added;
}
