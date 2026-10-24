import type OpenAI from "openai";
import { randomBytes } from "node:crypto";
import { completeChat } from "./llm.ts";
import { kvDelete, kvGetJson, kvSetJson } from "./kv.ts";
import { isIdentified } from "./identity.ts";
import { readSelfCheck } from "./selfCheckStore.ts";
import { getDailyOpUsed } from "./entitlementStore.ts";
import type { MeteredOp } from "./modelCalls.ts";
import {
  addPending,
  isCardId,
  locateMessage,
  locatePrompt,
  noteFitsUi,
  phraseMessage,
  phrasePrompt,
  placePhrases,
  readPhrasePlaces,
  PHRASES_PER_CALL,
  isRealFix,
  parseNotebook,
  placeMessage,
  placeOptions,
  placePrompt,
  readPlacement,
  skeletonFor,
  stageOrderOf,
  type FixKind,
  type FixWhere,
  type NotebookRecord,
} from "../notes/notebook.ts";
import { INTERFACE_LANGUAGE_LABELS, learningLanguageName } from "../learningLanguages.ts";
import type { LedgerItem } from "../learner/ledger.ts";
import { ledgerKey, isLedgerText, type LedgerTab } from "../learner/ledger.ts";
import { recordMeets } from "./ledgerStore.ts";

/**
 * 노트(notes/notebook.ts)의 계정 저장소 — 짚은 장면 카드·내가 만든 칸·이름 바꾸기·메모.
 *
 * 학습자가 쓴 문장이 서버에 남는 곳은 여기뿐이다(사용자 결정 2026-10-23, STATE "노트 문장 저장"):
 * 튜터가 고친 줄만, 그 사람의 학습 언어별로, 계정·학습 id를 지우면 함께 지운다(accountPurge가 키에 든 id로 지움).
 */

export const NOTEBOOK_TTL_SECONDS = 400 * 24 * 60 * 60;
/** 하루에 모델로 칸을 고르는 카드 수. 넘으면 카드는 "아직 자리 없음"으로 남는다. */
export const DAILY_FILES = 60;

export function notebookKey(userId: string, language: string): string {
  return `notebook:v1:${userId}:${language}`;
}

export async function readNotebook(userId: string, language: string): Promise<NotebookRecord> {
  return parseNotebook(await kvGetJson(notebookKey(userId, language)));
}

export async function saveNotebook(userId: string, language: string, record: NotebookRecord): Promise<void> {
  await kvSetJson(notebookKey(userId, language), record, NOTEBOOK_TTL_SECONDS);
}

/** 카드에 붙인 화면(기기에서 찍은 JPEG data URL). 카드를 지우거나 계정을 지우면 함께 지운다. */
export const MAX_SHOT_BYTES = 200_000;

export function shotKey(userId: string, language: string, shotId: string): string {
  return `notebookShot:v1:${userId}:${language}:${shotId}`;
}

export function isShotImage(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("data:image/jpeg;base64,") && value.length <= MAX_SHOT_BYTES * 1.37;
}

export async function readShot(userId: string, language: string, shotId: string): Promise<string | null> {
  if (!isCardId(shotId)) return null;
  const image = await kvGetJson<string>(shotKey(userId, language, shotId));
  return isShotImage(image) ? image : null;
}

/** 노트 카드가 이 화면 id를 가리킬 때만 저장한다. */
export async function saveShot(userId: string, language: string, shotId: string, image: string): Promise<boolean> {
  if (!isCardId(shotId) || !isShotImage(image)) return false;
  const record = await readNotebook(userId, language);
  if (!record.cards.some((card) => card.shotId === shotId)) return false;
  await kvSetJson(shotKey(userId, language, shotId), image, NOTEBOOK_TTL_SECONDS);
  return true;
}

export async function deleteShots(userId: string, language: string, shotIds: string[]): Promise<void> {
  const keys = shotIds.filter(isCardId).map((id) => shotKey(userId, language, id));
  if (keys.length) await kvDelete(keys).catch(() => undefined);
}

/** 지금 단계(시작 단계 고르기에서 고른 것, 없으면 1). */
export async function currentStageOrder(userId: string, language: string): Promise<number> {
  const check = await readSelfCheck(userId, language).catch(() => null);
  const stageId = check?.stage;
  return typeof stageId === "string" && stageId.startsWith(`${language}-`) ? stageOrderOf(stageId) : 1;
}

export function newCardId(): string {
  return randomBytes(8).toString("hex");
}

/**
 * 튜터가 고친 한 줄을 오늘의 학습 후보로: 모델이 칸을 고르고 한 줄 설명·짚임 종류(실수/오타)를 쓴다.
 * 노트에는 사용자가 고른 것만 들어간다(notes/notebook.ts `commit`). 답이 나간 뒤 돌고, 실패는 삼킨다.
 * 고친 데가 없는 줄(문장부호만 등)은 넣지 않는다. `kind: "meant"`는 통화의 뜻 짐작(모델 판단보다 앞선다).
 */
export async function fileFix(input: {
  openai: OpenAI | null;
  userId: string;
  language: string;
  ui: string;
  wrong: string;
  right: string;
  explanation?: string;
  where: FixWhere;
  /** 사용자 시간대의 오늘(YYYY-MM-DD). */
  day: string;
  kind?: FixKind;
  meter?: (op: MeteredOp) => void;
  now?: number;
}): Promise<void> {
  if (!isIdentified(input.userId) || !isRealFix(input.wrong, input.right)) return;
  const now = input.now ?? Date.now();
  try {
    const before = await readNotebook(input.userId, input.language);
    const skeleton = skeletonFor(input.language, await currentStageOrder(input.userId, input.language), true);
    const known = new Set([...skeleton.map((node) => node.id), ...before.custom.map((node) => node.id)]);
    let placement = { node: null as string | null, note: input.explanation ?? "" } as ReturnType<typeof readPlacement>;
    const canAsk = input.openai && known.size > 0 && (await getDailyOpUsed(input.userId, "notebookFix")) < DAILY_FILES;
    if (canAsk && input.openai) {
      input.meter?.("notebookFix");
      const uiName = INTERFACE_LANGUAGE_LABELS[input.ui] ?? "English";
      const completion = await completeChat(input.openai, "notes", {
        temperature: 0,
        max_tokens: 300,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: placePrompt({
              target: learningLanguageName(input.language),
              uiName,
              options: placeOptions(skeleton, before.custom),
            }),
          },
          { role: "user", content: placeMessage(input.wrong, input.right, input.explanation ?? "") },
        ],
      });
      placement = readPlacement(completion.choices[0]?.message?.content ?? "", known, input.explanation ?? "");
      // 설명이 앱 언어가 아니면 튜터 설명(앱 언어)으로.
      if (placement.note && !noteFitsUi(placement.note, input.ui)) placement = { ...placement, note: input.explanation ?? "" };
    }
    // 모델을 부르는 동안 사용자가 편집했을 수 있어 다시 읽고 넣는다.
    const latest = await readNotebook(input.userId, input.language);
    const after = addPending(latest, {
      id: newCardId(),
      wrong: input.wrong,
      right: input.right,
      note: placement.note,
      node: placement.node,
      ...(placement.suggest ? { suggest: placement.suggest } : {}),
      where: input.where,
      at: now,
      kind: input.kind ?? placement.kind ?? "mistake",
      day: input.day,
    }, now);
    if (after !== latest) await saveNotebook(input.userId, input.language, after);
  } catch (error) {
    console.error("[notebook-file]", error);
  }
}

/** 하루에 습득한 표현의 칸을 고르는 모델 호출 수(한 번에 PHRASES_PER_CALL개). */
export const DAILY_PHRASE_CALLS = 6;

/**
 * 습득한 표현(장부의 배움·숙지)을 틀의 칸에 넣는다(2026-10-24 사용자 "습득한 표현은 웬만하면 틀 안에").
 * 아직 칸이 없는 것만, 최근 것부터 한 번에 PHRASES_PER_CALL개. 노트를 열 때 답이 나간 뒤 돌고(/api/notebook GET), 실패는 삼킨다.
 * 처음 열면 그동안 쌓인 것을 하루 DAILY_PHRASE_CALLS번까지 나눠 넣는다.
 */
export async function placeLearnedPhrases(input: {
  openai: OpenAI | null;
  userId: string;
  language: string;
  items: LedgerItem[];
  meter?: (op: MeteredOp) => void;
  now?: number;
}): Promise<number> {
  if (!input.openai || !isIdentified(input.userId)) return 0;
  const now = input.now ?? Date.now();
  try {
    const before = await readNotebook(input.userId, input.language);
    const todo = input.items
      .filter((item) => item.state !== "met")
      .map((item) => ({ key: ledgerKey(item.text), text: item.text, at: item.lastAt ?? 0 }))
      .filter((item) => item.key && !before.phrases[item.key])
      .sort((a, b) => b.at - a.at)
      .slice(0, PHRASES_PER_CALL);
    if (!todo.length) return 0;
    if ((await getDailyOpUsed(input.userId, "notebookPhrases")) >= DAILY_PHRASE_CALLS) return 0;
    const skeleton = skeletonFor(input.language, await currentStageOrder(input.userId, input.language), true);
    const known = new Set([...skeleton.map((node) => node.id), ...before.custom.map((node) => node.id)]);
    input.meter?.("notebookPhrases");
    const completion = await completeChat(input.openai, "notes", {
      temperature: 0,
      max_tokens: 1200,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: phrasePrompt({ target: learningLanguageName(input.language), options: placeOptions(skeleton, before.custom) }) },
        { role: "user", content: phraseMessage(todo.map((item) => item.text)) },
      ],
    });
    const places = readPhrasePlaces(completion.choices[0]?.message?.content ?? "", todo.length, known);
    const placed = todo.flatMap((item, index) => (places[index] === undefined ? [] : [{ key: item.key, node: places[index] ?? null }]));
    if (!placed.length) return 0;
    // 모델을 부르는 동안 사용자가 편집했을 수 있어 다시 읽고 넣는다.
    const fresh = await readNotebook(input.userId, input.language);
    await saveNotebook(input.userId, input.language, placePhrases(fresh, placed, now));
    return placed.length;
  } catch {
    return 0;
  }
}

/** 하루에 "My에서 찾기"로 모델을 부르는 수. 넘으면 이미 칸이 있는 것만 찾는다. */
export const DAILY_LOCATES = 40;

export type LocateResult = { node: string | null; stage?: number; note: string };

/**
 * 문장분석 시트에서 궁금한 부분 → 틀의 칸(2026-10-24 사용자 "모르는 부분이 My 어디에 있는지 찾아 학습").
 * 이미 칸이 있는 표현이면 모델 없이 그 칸(설명은 빈 칸). 찾은 칸은 노트의 표현 자리에 남기고(만남), 장부에도 "물어봄"으로.
 */
export async function locatePart(input: {
  openai: OpenAI | null;
  userId: string;
  language: string;
  ui: string;
  text: string;
  sentence: string;
  tab: LedgerTab;
  meter?: (op: MeteredOp) => void;
  now?: number;
}): Promise<LocateResult | null> {
  if (!isIdentified(input.userId)) return null;
  const now = input.now ?? Date.now();
  const key = ledgerKey(input.text);
  if (!key) return null;
  const record = await readNotebook(input.userId, input.language);
  const skeleton = skeletonFor(input.language, await currentStageOrder(input.userId, input.language), true);
  const stageOf = (node: string | null) => skeleton.find((n) => n.id === node)?.stage;
  const known = new Set([...skeleton.map((node) => node.id), ...record.custom.map((node) => node.id)]);
  // 이미 찾은 표현(같은 앱 언어 설명까지 있으면)은 모델 없이.
  const cached = record.phrases[key];
  if (cached?.node && known.has(cached.node) && cached.note && cached.noteUi === input.ui) {
    return { node: cached.node, ...(stageOf(cached.node) ? { stage: stageOf(cached.node) } : {}), note: cached.note };
  }
  if (!input.openai || (await getDailyOpUsed(input.userId, "notebookLocate")) >= DAILY_LOCATES) return { node: null, note: "" };
  const uiName = INTERFACE_LANGUAGE_LABELS[input.ui] ?? "English";
  const ask = async (nudge: boolean) => {
    input.meter?.("notebookLocate");
    const completion = await completeChat(input.openai!, "notes", {
      temperature: 0,
      max_tokens: 250,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: locatePrompt({ target: learningLanguageName(input.language), uiName, options: placeOptions(skeleton, record.custom) }) },
        { role: "user", content: locateMessage(input.text, input.sentence) + (nudge ? `\nWrite "note" in ${uiName}.` : "") },
      ],
    });
    return readPlacement(completion.choices[0]?.message?.content ?? "", known, "");
  };
  // 설명이 앱 언어가 아니면 한 번 더 묻고, 그래도 아니면 설명 없이(칸은 쓴다).
  let placed = await ask(false);
  if (placed.note && !noteFitsUi(placed.note, input.ui)) {
    const again = await ask(true).catch(() => null);
    placed = again && (!again.note || noteFitsUi(again.note, input.ui)) ? { ...again, node: again.node ?? placed.node } : { ...placed, note: "" };
  }
  if (placed.node) {
    const fresh = await readNotebook(input.userId, input.language);
    await saveNotebook(input.userId, input.language, placePhrases(fresh, [{ key, node: placed.node, note: placed.note, noteUi: input.ui }], now));
    if (isLedgerText(input.text, input.language)) await recordMeets(input.userId, input.language, [{ kind: "ask", text: input.text, tab: input.tab }], now).catch(() => undefined);
  }
  return { node: placed.node, ...(stageOf(placed.node) ? { stage: stageOf(placed.node) } : {}), note: placed.note };
}
