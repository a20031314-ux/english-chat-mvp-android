// 문제 표시(/mark)의 이유 이름과 고칠 자리 — 화면 점검(triage.mjs)과 퀴즈 전수 점검(scripts/quiz-sweep/)이 같이 쓴다.
// 표시 한 줄: { persona, learn, ui, day, reason, note, shot, questions: [{ key, kind, text, options?, answer?, before?, after? }] }

export const NAMES = {
  "easy-decoy": "오답이 한눈에 지워짐",
  "easy-leak": "답이 화면에 보임",
  "easy-copy": "베끼면 됨",
  "easy-repeat": "같은 문제 또",
  "easy-level": "수준보다 쉬움",
  "hard-level": "배운 적 없음",
  "hard-ambiguous": "답이 여럿",
  "wrong-judge": "채점이 이상함",
  // 퀴즈 전수 점검(코드 검사)만 쓰는 것
  "easy-order": "순서 맞추기 조각이 너무 적음",
  "split-word": "조각이 낱말 중간에서 잘림",
  "no-meaning": "뜻 줄이 비어 무엇을 말할지 모름",
  unnatural: "문장이 어색함",
  other: "그 밖에",
};

/** 정답 조각(고르기 = 보기[정답 자리], 쓰기 = answer 글자). */
export const pieceOf = (q) => (Array.isArray(q.options) && typeof q.answer === "number" ? q.options[q.answer] : typeof q.answer === "string" ? q.answer : q.right ?? "");

/** 고칠 자리 — 데이터로 고칠 수 있으면 그 파일·키, 아니면 코드 자리. */
export function target(reason, q, learn) {
  const key = q.key ?? "";
  const piece = pieceOf(q);
  const fromBank = q.from === "qbank";
  if (reason === "easy-decoy" || reason === "hard-ambiguous") {
    if (fromBank) return `문제은행 KV qbank:v1:${learn}:${key} 오답·예문(서버 server/qbank.ts — 도태 기다리거나 직접 지움)`;
    if (key.startsWith("f|")) return `src/lib/curriculum/frames/decoys/${learn}.ts "${key.slice(2)}|${piece}"${reason === "hard-ambiguous" ? " (맞는 대안이면 빼고 plain/에서도)" : ""}`;
    if (key.startsWith("e|")) return `src/lib/curriculum/expressions/decoys/${learn}.ts "${key.slice(2)}"`;
    if (key.startsWith("w|")) return `src/lib/curriculum/wordDecoys.ts WORD_DECOYS.${learn}["${String(piece).toLocaleLowerCase()}"]`;
    return "src/lib/curriculum/quiz.ts decoys()";
  }
  if (reason === "easy-leak") return "src/components/studyMap/QuizPlayer.tsx(뜻 줄·예문) · stageScripts.ts quizGloss · FrameLesson 제목 · quiz.ts 재료(pieceTwice)";
  if (reason === "easy-copy") return "src/lib/curriculum/quiz.ts shownLast·buildQuiz 재료(바로 본 예문 빼기) · FrameLesson 퀴즈 재료";
  if (reason === "easy-repeat") return "src/lib/curriculum/circle.ts·nextStudy.ts(간격) · TodayPlan 첫 문제";
  if (reason === "easy-level" || reason === "hard-level") return key.startsWith("w|") ? "src/lib/curriculum/vocabBank.ts STAGE_CUTS·낱말 단계" : "그 열쇠의 단계(frames·stageScripts stage) · quiz.ts near()";
  if (reason === "wrong-judge") return "src/lib/curriculum/quiz.ts typedRight·decoys · src/app/api/curriculum/typed-check(open) · server scriptJudge";
  if (reason === "easy-order" || reason === "split-word") return "src/lib/curriculum/quiz.ts tilesOf·orderTiles · src/lib/wordSegments.ts";
  if (reason === "no-meaning") return "src/lib/curriculum/stageScripts.ts quizGloss · 뜻풀이 옮기기 server/stageCopy.ts";
  if (reason === "unnatural") return fromBank ? `문제은행 KV qbank:v1:${learn}:${key} 예문` : "그 문장의 데이터 파일(frames·stageScripts·대본 은행)";
  return "";
}
