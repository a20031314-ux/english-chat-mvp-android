/**
 * 단계 범위 고르기·진행 재기(순수 함수). 데이터는 언어별 파일(en·ja·ko), 모양은 types.ts.
 * 지금은 영어·일본어·한국어만 — 다른 학습 언어는 `ladderFor`가 null이고 예전 체크·지도가 그대로 쓰인다.
 */
import { ledgerKey, type Ledger } from "../../learner/ledger.ts";
import { EN_LADDER } from "./en.ts";
import { JA_LADDER } from "./ja.ts";
import { KO_LADDER } from "./ko.ts";
import type { Stage, StageLadder, StageText } from "./types.ts";

export type { Stage, StageLadder, StageText, StageDialogue, StageLine } from "./types.ts";

const LADDERS: Record<string, StageLadder> = { en: EN_LADDER, ja: JA_LADDER, ko: KO_LADDER };

export const STAGE_ID = /^[a-z]{2}-[1-9]$/;

export function ladderFor(language: string): StageLadder | null {
  return LADDERS[language] ?? null;
}

export function stageById(id: string | null | undefined): Stage | null {
  if (!id || !STAGE_ID.test(id)) return null;
  const ladder = ladderFor(id.slice(0, 2));
  return ladder?.stages.find((stage) => stage.id === id) ?? null;
}

/** 다음 단계(없으면 null). */
export function nextStage(stage: Stage): Stage | null {
  return stageById(`${stage.id.slice(0, 2)}-${stage.order + 1}`);
}

/** 지도 그리기·사람에게 보일 때 쓰는 앱 언어 글. ko·en 밖은 서버가 옮긴 글(stageCopy)을 따로 쓴다. */
export function stageText(text: StageText, ui: string): string {
  return (ui === "ko" ? text.ko : undefined) ?? text.en;
}

export type StageProgress = {
  total: number;
  mastered: number;
  learned: number;
  /** 아직 숙지 안 한 표현(데이터 순서) — 튜터 요약·지도가 다음에 겨냥할 것. */
  open: string[];
  /** 0–1. 숙지 1, 배운 것 0.5. */
  share: number;
};

/** 숙지로 다음 단계를 여는 문턱. 배운 것은 절반으로 친다. */
export const STAGE_DONE_SHARE = 0.7;

/**
 * 단계 표현이 표현 장부에서 어디까지 왔나. 장부 열쇠(ledgerKey)가 같거나, 장부 표현이 단계 표현을 품고 있으면 같은 것으로 본다
 * (일본어·한국어는 띄어쓰기·어미가 붙어서 — "お願いします"를 "これお願いします"로 썼어도).
 */
export function stageProgress(stage: Stage, ledger: Ledger): StageProgress {
  const items = Object.values(ledger.items);
  let mastered = 0;
  let learned = 0;
  const open: string[] = [];
  for (const expression of stage.expressions) {
    const key = ledgerKey(expression);
    if (!key) continue;
    const direct = ledger.items[key];
    const states = direct
      ? [direct.state]
      : items.filter((item) => ledgerKey(item.text).includes(key)).map((item) => item.state);
    if (states.includes("mastered")) mastered += 1;
    else {
      if (states.includes("learned")) learned += 1;
      open.push(expression);
    }
  }
  const total = stage.expressions.length;
  return { total, mastered, learned, open, share: total ? (mastered + learned / 2) / total : 0 };
}

/** 지도를 그리는 모델에게 주는 단계 범위(영어 설명 + 학습 언어 표현). */
export function stageScopeForPrompt(stage: Stage, target: string): string {
  const list = (rows: string[]) => rows.map((row) => `  - ${row}`).join("\n");
  return `The learner is working through one fixed stage of a ${target} course. Build the map only from this stage's scope:
- What they will be able to do at the end:
${list(stage.canDo.map((text) => text.en))}
- Situations:
${list(stage.situations.map((text) => text.en))}
- Grammar (each with an example):
${list(stage.grammar.map((g) => `${g.name.en} — ${g.example}`))}
- Core ${target} expressions they should be able to say (use them in starters, listenFor and tasks; spread them across topics):
${list(stage.expressions)}
- Listening: ${stage.listening.en}
- Pronunciation: ${stage.pronunciation.en}`;
}
