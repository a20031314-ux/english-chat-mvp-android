/**
 * 틀 바꿔 말하기 — 빈칸 하나가 있는 문장 틀을 익히고, 빈칸만 바꿔 여러 번 말한다(2026-10-28 사용자 "일단 틀을 학습시켜놓고 다양하게 적용 가능한
 * 구문·표현 위주로" → "시작해줘", 시범: 일본어 1~2단계).
 *
 * 틀마다 예문 넷 — 빈칸(slot)을 채운 온전한 문장(활용까지 미리 맞춤, 모델 안 씀). 화면: 틀과 빈칸에 넣을 말(cue)을 보고 말하기 →
 * 낱말 비교(roleplay/practice.ts). 예문을 모두 "틀만" 보고 맞히면 통과 → 대본 통과와 같은 저장(/api/curriculum/scripts, id가 틀 id),
 * 틀의 핵심 표현이 장부에 배움으로. 그 틀(core)이 내 줄에 든 대본을 이어서 보여 준다 — 같은 틀을 다른 장면에서.
 */
import { JA_FRAMES } from "./frames/ja.ts";
import { scriptsFor, type ScriptGloss, type StageScript, type StageScriptLine } from "./stageScripts.ts";

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

const ALL: Partial<Record<string, Frame[]>> = { ja: JA_FRAMES };

export function framesFor(language: string, stage: number): Frame[] {
  return (ALL[language] ?? []).filter((frame) => frame.stage === stage);
}

export function frameById(language: string, id: string): Frame | null {
  return (ALL[language] ?? []).find((frame) => frame.id === id) ?? null;
}

/** 틀 줄의 모양: 빈칸 자리를 지운 문장("写真を撮っ___"이 아니라 틀 그대로 + 빈칸 뜻). */
export function blankOf(example: FrameExample): string {
  return example.text.replace(example.slot, "＿＿＿");
}

export type FrameMode = "shadow" | "blank" | "own";

/** 1~2단계는 따라 말하기·틀만, 3단계부터 "내 말로"(틀은 그대로, 빈칸은 내 이야기 — 틀을 맞게 썼는지 모델이 봄). */
export function frameModes(stage: number): FrameMode[] {
  return stage >= 3 ? ["shadow", "blank", "own"] : ["shadow", "blank"];
}

/** 대본 줄에 붙은 틀 태그(lines[].frames)가 이 틀을 가리키는지. */
export function lineUsesFrame(line: StageScriptLine, frameId: string): boolean {
  return line.who === "me" && Boolean(line.frames?.includes(frameId));
}

/** 이 대본의 내 줄이 쓰는 틀 id들(겹침 없이, 처음 나온 차례). */
export function framesOfScript(script: StageScript): string[] {
  return [...new Set(script.lines.flatMap((line) => (line.who === "me" ? (line.frames ?? []) : [])))];
}

/**
 * 이 틀이 내 줄에 든 대본 — 같은 틀을 장면 속에서. 대본 줄의 틀 태그로 찾는다(2026-10-28 1단계 "틀을 뼈대로").
 * 그 단계 대본을 먼저, 앞 단계는 뒤에. 태그가 하나도 없는 언어(옛 데이터)만 틀 조각(core)으로 찾는다.
 */
export function scriptsWithFrame(language: string, frame: Frame): StageScript[] {
  const all: StageScript[] = [];
  for (let stage = frame.stage; stage >= 1; stage -= 1) all.push(...scriptsFor(language, stage));
  const tagged = all.some((script) => script.lines.some((line) => line.frames?.length));
  return all.filter((script) =>
    script.lines.some((line) =>
      tagged ? lineUsesFrame(line, frame.id) : line.who === "me" && frame.core.some((core) => line.text.includes(core)),
    ),
  );
}
