import type OpenAI from "openai";
import { randomBytes } from "node:crypto";
import { completeChat } from "./llm.ts";
import { kvGetJson, kvSetJson } from "./kv.ts";
import { isIdentified } from "./identity.ts";
import { readSelfCheck } from "./selfCheckStore.ts";
import { getDailyOpUsed } from "./entitlementStore.ts";
import type { MeteredOp } from "./modelCalls.ts";
import {
  addCard,
  isRealFix,
  parseNotebook,
  placeMessage,
  placeOptions,
  placePrompt,
  readPlacement,
  skeletonFor,
  stageOrderOf,
  type FixWhere,
  type NotebookRecord,
} from "../notes/notebook.ts";
import { INTERFACE_LANGUAGE_LABELS, learningLanguageName } from "../learningLanguages.ts";

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
 * 튜터가 고친 한 줄을 노트에 넣는다: 모델이 칸을 고르고 한 줄 설명을 쓴다. 답이 나간 뒤 돌고, 실패는 삼킨다.
 * 고친 데가 없는 줄(문장부호만 등)은 넣지 않는다.
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
    }
    // 모델을 부르는 동안 사용자가 편집했을 수 있어 다시 읽고 넣는다.
    const latest = await readNotebook(input.userId, input.language);
    const after = addCard(latest, {
      id: newCardId(),
      wrong: input.wrong,
      right: input.right,
      note: placement.note,
      node: placement.node,
      ...(placement.suggest ? { suggest: placement.suggest } : {}),
      where: input.where,
      at: now,
    });
    if (after !== latest) await saveNotebook(input.userId, input.language, after);
  } catch (error) {
    console.error("[notebook-file]", error);
  }
}
