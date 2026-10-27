/**
 * 틀 바꿔 말하기 — 빈칸 하나가 있는 문장 틀을 익히고, 빈칸만 바꿔 여러 번 말한다(2026-10-28 사용자 "일단 틀을 학습시켜놓고 다양하게 적용 가능한
 * 구문·표현 위주로" → "시작해줘", 시범: 일본어 1~2단계).
 *
 * 틀마다 예문 넷 — 빈칸(slot)을 채운 온전한 문장(활용까지 미리 맞춤, 모델 안 씀). 화면: 틀과 빈칸에 넣을 말(cue)을 보고 말하기 →
 * 낱말 비교(roleplay/practice.ts). 예문을 모두 "틀만" 보고 맞히면 통과 → 대본 통과와 같은 저장(/api/curriculum/scripts, id가 틀 id),
 * 틀의 핵심 표현이 장부에 배움으로. 그 틀(core)이 내 줄에 든 대본을 이어서 보여 준다 — 같은 틀을 다른 장면에서.
 */
import { ES_FRAMES } from "./frames/es.ts";
import { JA_FRAMES } from "./frames/ja.ts";
import { KO_FRAMES } from "./frames/ko.ts";
import { scriptsFor, swapName, usableName, type ScriptGloss, type StageScript, type StageScriptLine } from "./stageScripts.ts";

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

const ALL: Partial<Record<string, Frame[]>> = { ja: JA_FRAMES, ko: KO_FRAMES, es: ES_FRAMES };

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

const NAME_CUE = /\s*\(your name\)\s*$/;
const NAME_CUE_KO = /\s*\(내 이름\)\s*$/;

/** 예문이 학습자 이름 자리인지(뜻 "… (your name)"). */
export function isNameExample(example: FrameExample): boolean {
  return NAME_CUE.test(example.cue.en);
}

/**
 * 이름 자리 예문(뜻 "루카스 (your name)")을 사용자 닉네임으로 — 대본(personalize)처럼, 한국어는 뒤 조사(이에요/예요)까지 맞춘다.
 * 닉네임이 없거나 쓸 수 없으면 그대로.
 */
export function personalizeFrame(frame: Frame, language: string, nickname: string | null | undefined): Frame {
  const name = usableName(nickname);
  if (!name || !frame.examples.some(isNameExample)) return frame;
  return {
    ...frame,
    examples: frame.examples.map((example) => {
      if (!isNameExample(example)) return example;
      const en = example.cue.en.replace(NAME_CUE, "");
      const ko = example.cue.ko?.replace(NAME_CUE_KO, "");
      const text = swapName(example.text, [example.slot], name, language === "ko");
      return {
        text,
        slot: name,
        cue: { en: `${name} (your name)`, ...(example.cue.ko !== undefined ? { ko: `${name}(내 이름)` } : {}) },
        gloss: {
          en: swapName(example.gloss.en, [en], name, false),
          ...(example.gloss.ko !== undefined ? { ko: ko ? swapName(example.gloss.ko, [ko], name, true) : example.gloss.ko } : {}),
        },
      };
    }),
  };
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
