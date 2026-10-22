/**
 * 글자·소리 기초 — 대화 단계(stages) 앞의 "글자부터"(2026-10-22, 사용자 결정).
 * 1단계 대화도 "아직 어려워요"인 사람에게, 그 언어를 읽고 소리 내는 데 필요한 것만: 일본어 가나, 한글 자모·받침,
 * 중국어 병음·성조, 태국·아랍·힌디·러시아 문자, 베트남어 성조·기호, 라틴 문자 언어는 철자-발음 규칙.
 *
 * 묶음(group) 하나가 한 번에 익힐 분량(5~12개). 연습: 카드 → 듣고 고르기 → 보고 고르기. 묶음을 통과하면 서버에 남는다.
 * 글은 영어(en)·한국어(ko)를 손으로, 다른 앱 언어는 단계 글과 같이 처음 한 번 옮긴다.
 */
import type { StageText } from "../stages/types.ts";

export type ScriptItem = {
  /** 화면에 크게 보일 글자(들): "あ", "ㄱ", "ก", "ma (mā má mǎ mà)", "ñ". */
  char: string;
  /** 읽는 법(로마자·한글 독자 모두 알아볼 수 있게 라틴 문자로): "a", "g/k", "k (ko kai)". */
  reading: string;
  /** 목소리(TTS)로 읽힐 학습 언어 글. 글자 하나는 잘 안 읽히는 언어면 이름이나 짧은 낱말. */
  say: string;
  /** 이 글자가 들어간 쉬운 낱말 하나(학습 언어)와 뜻. */
  example?: { word: string; meaning: StageText };
};

export type ScriptGroup = {
  /** "ja-hira-1" 같은 id — 언어 접두어 + 짧은 이름. */
  id: string;
  title: StageText;
  /** 이 묶음에서 알아 둘 규칙 한 줄(예: "작은 っ는 한 박자 쉼"). 없으면 빈 칸 없이 생략. */
  note?: StageText;
  items: ScriptItem[];
};

export type ScriptCourse = {
  language: string;
  version: number;
  /** "히라가나·가타카나" 같은 이름. */
  title: StageText;
  groups: ScriptGroup[];
};
