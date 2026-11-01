// 퀴즈 전수 점검 표시를 원인별로 묶는 규칙 — 보고서(report.mjs)와 변경 감시(scripts/watch/watch.mjs)가 같이 쓴다.

/** 앱 언어만 다른 같은 표시는 하나로(uis에 앱 언어를 모음). */
export function distinctMarks(rows) {
  const id = (row) => `${row.learn}|${row.reason}|${row.questions[0]?.key}|${row.questions[0]?.kind}|${row.questions[0]?.text}|${row.note.replace(/^.*?앱: /, "")}`;
  const out = new Map();
  for (const row of rows) {
    const key = id(row);
    const have = out.get(key);
    if (have) have.uis.add(row.ui);
    else out.set(key, { ...row, uis: new Set([row.ui]) });
  }
  return out;
}

/** [원인 이름, 표시가 이 원인인가, 무엇을 고치면 되나] — 앞에서부터 처음 맞는 원인 하나에 센다. */
export const CAUSES = [
  ["뜻 줄에 답 — 앱 언어 = 학습 언어", (r) => r.reason === "easy-leak" && !r.uis.has("*") && [...r.uis].every((ui) => ui === r.learn), "답하기 전 뜻 줄이 학습 언어 그대로라 문장이 보임. 한 곳(뜻 줄 고르는 quizGloss)에서 앱 언어 = 학습 언어면 뜻 줄을 답한 뒤로."],
  ["뜻 줄에 답 — 다른 앱 언어", (r) => r.reason === "easy-leak" && !r.uis.has("*") && [...r.uis].some((ui) => ui !== r.learn), "그 앱 언어 뜻풀이 옮김이 학습 언어(영어) 그대로 저장됐거나 옮김이 없어 영어로 나옴 — 서버 옮긴 표(server/stageCopy.ts) 다시 옮기기·quizGloss가 영어 학습에 영어 뜻을 안 보이게."],
  ["빈칸 밖에 답", (r) => r.reason === "easy-leak" && r.uis.has("*"), ""],
  ["같은 날 같은 문장", (r) => r.reason === "easy-repeat" && r.note.includes("같은 날 같은 문장"), "다른 열쇠가 같은 대본 줄을 재료로 나눠 씀(같은 문장 여러 열쇠) — 묶음·하루 단위로 문장 겹침 빼기."],
  ["며칠 안 다른 열쇠로 같은 문장", (r) => r.reason === "easy-repeat" && r.note.includes("다른 열쇠"), ""],
  ["맞혀서 쉬는 열쇠가 다시", (r) => r.reason === "easy-repeat" && r.note.includes("쉬어야"), "대화 속 틀린 줄(quiz.ts dialogOf)이 쉬는 중인 열쇠를 가리지 않고 고름."],
  ["같은 열쇠 연달아", (r) => r.reason === "easy-repeat" && (r.note.includes("연달아") || r.note.includes("모양만")), ""],
];

/** 원인 이름 → 문제 수(원인에 안 맞는 표시는 이유 코드로). */
export function causeCounts(rows) {
  const counts = {};
  for (const row of distinctMarks(rows).values()) {
    const cause = CAUSES.find(([, test]) => test(row))?.[0] ?? row.reason;
    counts[cause] = (counts[cause] ?? 0) + 1;
  }
  return counts;
}
