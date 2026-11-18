/**
 * 빈칸에 쓴 말을 줄에 넣는다 — 그 줄 전체로 대조하려고(소재 수업 FrameLesson 대화 빈칸).
 * 순수 모듈.
 */
import { isSpaceless } from "../wordSegments.ts";

/** 띄어쓰기 없는 언어(ja·zh·th)는 그대로 붙이고, 그 밖엔 앞뒤 띄어쓰기를 맞춘다. */
export function fillBlank(text: string, piece: string, typed: string): string {
  const at = text.indexOf(piece);
  if (at < 0) return typed;
  const word = typed.trim();
  if (isSpaceless(text)) return text.slice(0, at) + word + text.slice(at + piece.length);
  return `${text.slice(0, at)} ${word} ${text.slice(at + piece.length)}`.replace(/\s+/g, " ").replace(/\s+([,.!?;:])/g, "$1").trim();
}
