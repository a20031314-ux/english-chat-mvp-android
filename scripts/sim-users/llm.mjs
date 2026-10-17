/**
 * 선택 기능: OPENAI_API_KEY(또는 .env.local)가 있을 때만.
 *   judgeConversation — 대화 하나를 언어별 기준(languageFocus.ts)으로 평가
 *   personaLine       — 페르소나가 다음에 할 말을 직접 지어냄(--llm-persona)
 *
 * 규칙 검출(detect.mjs)과 달리 의견이라 돈이 들고 틀릴 수 있다. 숫자는 바닥선으로,
 * 이전 실행과 비교하는 데 쓴다 (check-conversation-quality.mjs와 같은 생각).
 */
import { readFileSync } from "node:fs";
import { targetLanguageFocusHints } from "../../src/lib/languageFocus.ts";
import { learningLanguageName } from "../../src/lib/learningLanguages.ts";
import { describePersona } from "./personas.mjs";

export const JUDGE_MODEL = process.env.SIM_JUDGE_MODEL ?? "gpt-4.1-mini";
export const PERSONA_MODEL = process.env.SIM_PERSONA_MODEL ?? "gpt-4.1-mini";

export function openaiKey() {
  const fromEnv = process.env.OPENAI_API_KEY?.trim();
  if (fromEnv) return fromEnv;
  try {
    for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
      const at = line.indexOf("=");
      if (at !== -1 && line.slice(0, at).trim() === "OPENAI_API_KEY") return line.slice(at + 1).trim().replace(/^"|"$/g, "");
    }
  } catch {
    // 없으면 null
  }
  return null;
}

async function ask(model, content, maxTokens = 900) {
  const key = openaiKey();
  if (!key) return null;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model, messages: [{ role: "user", content }], response_format: { type: "json_object" }, max_tokens: maxTokens }),
      });
      if (response.ok) {
        const body = await response.json();
        return JSON.parse(body.choices?.[0]?.message?.content ?? "{}");
      }
      if (response.status < 500) return null;
    } catch {
      // 다시
    }
    await new Promise((r) => setTimeout(r, attempt * 1500));
  }
  return null;
}

export async function judgeConversation(persona, transcript) {
  const lines = transcript
    .map((t, i) => [
      `#${i + 1} learner: ${t.text}`,
      t.reply ? `#${i + 1} tutor: ${t.reply}` : null,
      t.corrected ? `#${i + 1} corrected: ${t.corrected}` : null,
      t.explanation ? `#${i + 1} explanation (should be in UI language "${persona.ui}"): ${t.explanation}` : null,
    ].filter(Boolean).join("\n"))
    .join("\n");
  const result = await ask(JUDGE_MODEL, `You review a language-learning chat app. The learner studies ${learningLanguageName(persona.target)}; the app interface language is "${persona.ui}".
Learner profile: ${describePersona(persona)}

What a correction in this language should look at:
${targetLanguageFocusHints(persona.target)}

Product rules: the tutor always replies in the learning language, keeps the conversation going naturally, never shows a CEFR level, corrections must be right and explanations must be in the interface language.

Transcript:
${lines}

List only real problems a learner would notice: a wrong or missing correction, a correction that changes meaning, a reply that ignores what was said, difficulty far off the learner's level, wrong language, unsafe or off-topic compliance. Do not nitpick style.
Reply as JSON only: {"issues":[{"turn":1,"severity":"error|warn","kind":"short_snake_case","note":"one sentence in Korean"}]}`);
  return Array.isArray(result?.issues) ? result.issues : [];
}

export async function personaLine(persona, history, fallback) {
  const result = await ask(PERSONA_MODEL, `Play a learner of ${learningLanguageName(persona.target)} chatting with a tutor app.
Profile: ${describePersona(persona)}. Their own language is "${persona.ui}".
Make the mistakes this profile really makes:
${targetLanguageFocusHints(persona.target)}
Conversation so far:
${history.slice(-6).join("\n") || "(the tutor just opened)"}
Write the learner's next single message in ${learningLanguageName(persona.target)} (or in their own language if the profile gives up when stuck and they are stuck). Reply as JSON only: {"text":"..."}`, 200);
  const text = typeof result?.text === "string" ? result.text.trim() : "";
  return text || fallback;
}
