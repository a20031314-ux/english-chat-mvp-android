/**
 * 오늘 배운 것에 직접 묻기(2026-10-28 사용자 "더 궁금한 건 직접 질문하게 해서 데이터로 쌓으면" → 질문은 유료만,
 * "답 자체를 다 쌓지 말고, 사용자가 어디가 부족하고 어디를 모르는지 기록하는 식으로").
 * 모델은 답과 함께 질문이 걸린 곳(오늘 배운 것의 열쇠)을 고른다 — 서버는 그 열쇠만 남기고 질문·답 글은 버린다.
 */

export const MAX_ASK_CHARS = 300;

export type AskTopic = { key: string; label: string };
export type AskAnswer = { answer: string; about: string[] };

export function askPrompt(input: { uiName: string; targetName: string }): string {
  return [
    `You are a ${input.targetName} tutor. The learner just finished today's practice and asks a question about it.`,
    `Answer in ${input.uiName}, in at most four short sentences. Quote ${input.targetName} words or sentences exactly when they help; write any example yourself from the learner's topics, never from these instructions.`,
    "If the question is not about the language, say briefly that you can only help with the language.",
    'You get "topics": what was practised today, each with a "key". In "about", list the keys (one to three) the question is really about — the place the learner is unsure of. Use only keys from "topics"; if none fits, give an empty list.',
    'Reply with JSON only: {"answer": string, "about": string[]}.',
  ].join("\n");
}

export function parseAskAnswer(raw: string, allowed: ReadonlySet<string>): AskAnswer | null {
  try {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start < 0 || end <= start) return null;
    const parsed = JSON.parse(raw.slice(start, end + 1)) as { answer?: unknown; about?: unknown };
    const answer = typeof parsed.answer === "string" ? parsed.answer.trim() : "";
    if (!answer) return null;
    const about = Array.isArray(parsed.about) ? parsed.about.filter((key): key is string => typeof key === "string" && allowed.has(key)) : [];
    return { answer: answer.slice(0, 1200), about: [...new Set(about)].slice(0, 3) };
  } catch {
    return null;
  }
}

/** 화면이 보낸 오늘의 열쇠와 이름 — 열쇠는 그 언어 커리큘럼에 있는 것만(isCurriculumKey). */
export function parseTopics(raw: unknown, isKey: (key: string) => boolean): AskTopic[] {
  if (!Array.isArray(raw)) return [];
  const out: AskTopic[] = [];
  for (const item of raw.slice(0, 40)) {
    if (!item || typeof item !== "object") continue;
    const { key, label } = item as { key?: unknown; label?: unknown };
    if (typeof key !== "string" || typeof label !== "string" || !isKey(key)) continue;
    out.push({ key, label: label.replace(/\s+/g, " ").trim().slice(0, 80) });
  }
  return out;
}
