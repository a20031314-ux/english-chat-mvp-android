/**
 * 틀 바꿔 말하기 — 빈칸 하나가 있는 문장 틀을 익히고, 빈칸만 바꿔 여러 번 말한다(2026-10-28 사용자 "일단 틀을 학습시켜놓고 다양하게 적용 가능한
 * 구문·표현 위주로" → "시작해줘", 시범: 일본어 1~2단계).
 *
 * 틀마다 예문 넷 — 빈칸(slot)을 채운 온전한 문장(활용까지 미리 맞춤, 모델 안 씀). 화면: 틀과 빈칸에 넣을 말(cue)을 보고 말하기 →
 * 낱말 비교(roleplay/practice.ts). 예문을 모두 "틀만" 보고 맞히면 통과 → 대본 통과와 같은 저장(/api/curriculum/scripts, id가 틀 id),
 * 틀의 핵심 표현이 장부에 배움으로. 그 틀(core)이 내 줄에 든 대본을 이어서 보여 준다 — 같은 틀을 다른 장면에서.
 */
import { ES_FRAMES } from "./frames/es.ts";
import { HI_FRAMES } from "./frames/hi.ts";
import { AR_FRAMES } from "./frames/ar.ts";
import { RU_FRAMES } from "./frames/ru.ts";
import { PT_FRAMES } from "./frames/pt.ts";
import { IT_FRAMES } from "./frames/it.ts";
import { FR_FRAMES } from "./frames/fr.ts";
import { TH_FRAMES } from "./frames/th.ts";
import { VI_FRAMES } from "./frames/vi.ts";
import { ID_FRAMES } from "./frames/id.ts";
import { EN_FRAMES } from "./frames/en.ts";
import { ZH_FRAMES } from "./frames/zh.ts";
import { JA_FRAMES } from "./frames/ja.ts";
import { KO_FRAMES } from "./frames/ko.ts";
import { type ScriptGloss, type StageScript } from "./stageScripts.ts";

export type FrameExample = {
  /** 온전한 문장(학습 언어). */
  text: string;
  /** text 안에서 빈칸을 채운 부분(활용된 꼴 그대로). */
  slot: string;
  /** 빈칸에 넣을 말의 뜻(사전형) — "사진을 찍다". */
  cue: ScriptGloss;
  /** 문장 전체의 뜻. */
  gloss: ScriptGloss;
};

export type Frame = {
  /** "ja-f1-01". */
  id: string;
  stage: number;
  /** 공통 기능 id(curriculum/functions.ts) — 언어가 달라도 같은 일을 하는 틀끼리 묶인다. */
  fn?: string;
  /** 빈칸을 ___로 둔 틀 — "___てもいいですか". */
  pattern: string;
  /** 문장에서 이 틀을 알아보는 조각(대본 줄 찾기에 씀). */
  core: string[];
  /** 무엇을 하는 틀인지(앱 언어). */
  meaning: ScriptGloss;
  grammar?: number[];
  expressions?: string[];
  examples: FrameExample[];
};

const ALL: Partial<Record<string, Frame[]>> = { ja: JA_FRAMES, ko: KO_FRAMES, es: ES_FRAMES, zh: ZH_FRAMES, en: EN_FRAMES, id: ID_FRAMES, vi: VI_FRAMES, th: TH_FRAMES, fr: FR_FRAMES, it: IT_FRAMES, pt: PT_FRAMES, ru: RU_FRAMES, ar: AR_FRAMES, hi: HI_FRAMES };

/** 이 학습 언어의 틀 전부(앱에 없는 언어를 서버가 보낼 때). */
export function allFramesFor(language: string): Frame[] {
  return ALL[language] ?? [];
}

/** 앱에 없는 언어의 틀을 서버에서 받아 넣는다(registerScripts와 같이). */
export function registerFrames(language: string, frames: unknown): boolean {
  if (ALL[language]?.length || !Array.isArray(frames)) return false;
  const ok = frames.filter(
    (frame): frame is Frame =>
      Boolean(frame) &&
      typeof frame.id === "string" &&
      typeof frame.stage === "number" &&
      typeof frame.pattern === "string" &&
      Array.isArray(frame.core) &&
      Array.isArray(frame.examples) &&
      frame.examples.length > 0,
  );
  if (!ok.length) return false;
  ALL[language] = ok;
  return true;
}

export function framesFor(language: string, stage: number): Frame[] {
  return (ALL[language] ?? []).filter((frame) => frame.stage === stage);
}

export function frameById(language: string, id: string): Frame | null {
  return (ALL[language] ?? []).find((frame) => frame.id === id) ?? null;
}

export type FrameMode = "shadow" | "blank" | "own";
/** 이 대본의 내 줄이 쓰는 틀 id들(겹침 없이, 처음 나온 차례). */
export function framesOfScript(script: StageScript): string[] {
  return [...new Set(script.lines.flatMap((line) => (line.who === "me" ? (line.frames ?? []) : [])))];
}
