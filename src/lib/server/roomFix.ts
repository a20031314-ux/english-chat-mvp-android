import type OpenAI from "openai";
import { completeChat } from "./llm.ts";
import { recordTokens } from "./meterRequest.ts";
import { shouldKeepLearnerLine } from "../correctionGuard.ts";
import { findIrregularSlips, koreanSlipHint, repairIrregularSlips } from "../koreanSlips.ts";
import { foreignWords } from "../vocabScript.ts";
import { targetLanguageFocusHints } from "../languageFocus.ts";
import { explanationInLearningLanguage, explanationLanguageGuard } from "../languageLearningAnalysis.ts";
import { INTERFACE_LANGUAGE_LABELS, learningLanguageName, type LearningLanguageCode } from "../learningLanguages.ts";
import { touchesDisputed } from "../rooms/agreement.ts";

/**
 * 말하는 방 내 줄 교정 — 받아쓴 말 한 마디를 채팅 교정과 같은 기준으로 고친다(2026-10-22, 사용자 결정).
 *
 * 채팅과 다른 점: 쓴 글이 아니라 받아쓴 말이다. 문장부호·대소문자·띄어쓰기는 받아쓰기가 정한 것이라 짚지 않고,
 * 말에서 흔한 것(머뭇거림 "음·uh", 말 고쳐 하기, 되풀이)은 실수가 아니다. 두 받아쓰기가 다르게 들은 낱말(disputed)은
 * 실제로 무슨 말인지 모르니 고치지 않는다 — 고친 문장이 그 낱말을 건드리면 교정을 버린다(agreement.touchesDisputed).
 * 답을 만들지 않고 교정만(사람끼리 대화라 튜터 답이 없다). 학습자 문장은 저장하지 않는다.
 */

export type RoomFix = { corrected: string; explanation: string; hasError: boolean; dropped?: "disputed" };

function asText(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

export function roomFixSystem(target: LearningLanguageCode, ui: string): string {
  const name = learningLanguageName(target);
  const uiName = INTERFACE_LANGUAGE_LABELS[ui] ?? INTERFACE_LANGUAGE_LABELS.ko;
  const guard = explanationLanguageGuard({ interfaceLanguage: ui, fieldsDescription: "explanation", learningLanguage: target });
  return `You correct one spoken line from a ${name} learner talking with other people in a voice room. The line is a speech-to-text transcript of what they said, mistakes included.

Return the correction:
- corrected: their line with every REAL ${name} mistake fixed — grammar, conjugation/inflection, particles/case markers, function words, word order that breaks the language, wrong tense/aspect, politeness that is wrong for who they talk to, a word from another language they used because they did not know the ${name} word. Keep their meaning and keep their wording wherever it is already acceptable spoken ${name}.
- explanation: 1–2 short sentences in ${uiName} naming exactly what changed and why. Never mention a change you did not make. "" if nothing changed.
- If the line has no real mistake, corrected = the line exactly and explanation = "".

This is speech, not writing:
- Punctuation, capital letters and spacing come from the transcriber, not the learner. Never correct them and never mention them.
- Fillers and hesitations (uh, um, 음, 어, えっと), a restarted phrase, a repeated word, and casual spoken forms are not mistakes. Leave them.
- Very short replies (one or two words) are complete answers. Keep them unless the word itself is wrong.
- Do not rewrite acceptable speech into textbook wording. Never lower the politeness they used.
- "unsure" lists words the transcriber was not sure it heard right. Keep each of those words exactly as it is in corrected, and do not base a correction on them.

${targetLanguageFocusHints(target)}
${guard}

Return ONLY JSON: {"corrected":"...","explanation":"..."}`;
}

export async function runRoomFix(
  openai: OpenAI,
  input: { text: string; target: LearningLanguageCode; ui: string; recent: string[]; disputed: string[] },
): Promise<RoomFix> {
  const { text, target, ui, disputed } = input;
  const koSlips = target === "ko" ? findIrregularSlips(text) : [];
  const mixed = foreignWords(text, target);
  const noticed = [
    target === "ko" ? koreanSlipHint(text) : "",
    mixed.length
      ? `Words from another language: ${mixed.map((w) => `"${w}"`).join(", ")}. Unless one is a name, put the ${learningLanguageName(target)} word in corrected and name it in the explanation.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");
  const completion = await completeChat(openai, "roomFix", {
    messages: [
      { role: "system", content: roomFixSystem(target, ui) },
      {
        role: "user",
        content: JSON.stringify({
          line: text,
          recent: input.recent.slice(-6),
          ...(disputed.length ? { unsure: disputed } : {}),
          ...(noticed ? { noticed } : {}),
        }),
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.2,
    max_tokens: 400,
  });
  void recordTokens("roomFix", completion.usage);
  const raw = completion.choices[0]?.message?.content ?? "";
  const parsed = JSON.parse(raw) as { corrected?: unknown; explanation?: unknown };
  let corrected = asText(parsed.corrected) || text;
  let explanation = asText(parsed.explanation);
  if (target === "ko") corrected = repairIrregularSlips(corrected, [...koSlips, ...findIrregularSlips(corrected)]);
  const same = { corrected: text, explanation: "", hasError: false };
  // 고칠 게 없는 줄(문장부호만 다름, 짧은 답을 늘림, 다른 말로 바꿈 등)은 그대로.
  if (!koSlips.length && shouldKeepLearnerLine(text, corrected, target)) return same;
  // 다르게 들은 낱말을 건드린 교정은 믿을 수 없다 — 버린다.
  if (touchesDisputed(corrected, disputed, target)) return { ...same, dropped: "disputed" };
  // 설명이 앱 언어가 아니면(배우는 언어로 씀) 설명 없이 고친 문장만.
  if (explanation && explanationInLearningLanguage(explanation, ui, target)) explanation = "";
  return { corrected, explanation, hasError: true };
}
