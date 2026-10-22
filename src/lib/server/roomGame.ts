import type OpenAI from "openai";
import { completeChat, extractJson } from "./llm.ts";
import { recordTokens } from "./meterRequest.ts";
import { learningLanguageName } from "../learningLanguages.ts";
import { readWordPick, type LiarTopic, type LiarWordPick } from "../rooms/liarGame.ts";
import { readMafiaStory, type MafiaStory } from "../rooms/mafiaGame.ts";

/** 말하는 방 게임의 AI 쪽(2026-10-23): 라이어 게임 제시어 고르기·답 판정, 마피아 배경 이야기. 저장은 `roomGameStore.ts`. */

const TOPIC_HINT: Record<LiarTopic, string> = {
  random: "any everyday topic (food, animals, places, jobs, things, sports, hobbies, weather, school, travel…) — pick one",
  food: "food and drinks",
  animal: "animals",
  place: "places (buildings, places in a town, nature spots)",
  job: "jobs",
  thing: "everyday objects",
  sport: "sports",
  hobby: "hobbies and free-time activities",
};

/**
 * 제시어 하나를 방의 모든 언어로. seed가 있으면(방장이 쓴 말, 어느 언어든) 그 말을 옮기기만 한다.
 * avoid = 이 방에서 최근에 나온 말(영어).
 */
export async function pickLiarWord(
  openai: OpenAI,
  input: { topic: LiarTopic; languages: string[]; avoid: string[]; seed?: string },
): Promise<LiarWordPick | null> {
  const names = input.languages.map((code) => `${code} = ${learningLanguageName(code)}`).join(", ");
  const system = `You pick the secret word for a "liar game" played by language learners in a voice room. Everyone but the liar gets the word; each player describes it in a sentence and the group then votes for who seems not to know it.

${input.seed ? `The host chose the word: "${input.seed}" (it may be written in any language). Use exactly that word — do not pick another one. Its topic is the everyday category it belongs to.` : `Pick ONE word from ${TOPIC_HINT[input.topic]}.`}
- A concrete, common noun a beginner already knows or can guess: easy to describe, with several things to say about it (shape, use, where you find it). No brand names, no people, nothing rude or scary.
- The topic must be a broad category that does not give the word away.
${input.avoid.length ? `- Not one of these (used recently in this room): ${input.avoid.join(", ")}.` : ""}

Write the topic and the word in each of these languages: ${names}. Use the plain everyday word a speaker of that language would use, in its normal script, without articles or explanations.

Return ONLY JSON: {"english": "<the word in English>", "topic": {${input.languages.map((code) => `"${code}": "..."`).join(", ")}}, "word": {${input.languages.map((code) => `"${code}": "..."`).join(", ")}}}`;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const completion = await completeChat(openai, "roomGame", {
        messages: [
          { role: "system", content: system },
          { role: "user", content: input.seed ? `Word: ${input.seed}` : `Topic: ${input.topic}` },
        ],
        response_format: { type: "json_object" },
        temperature: input.seed ? 0.2 : 1,
        max_tokens: 400,
      });
      void recordTokens("roomGameWord", completion.usage);
      const text = completion.choices[0]?.message?.content ?? "";
      const pick = readWordPick(JSON.parse(extractJson(text)), input.languages);
      if (pick && !input.avoid.some((word) => word.toLowerCase() === pick.english.toLowerCase())) return pick;
    } catch (error) {
      console.error("[room-game] word", error);
    }
  }
  return null;
}

/** 라이어의 답이 제시어와 같은 것을 가리키나(글자로 안 맞을 때만 부른다 — 다른 언어·다른 표기·동의어). */
export async function judgeLiarGuess(openai: OpenAI, input: { guess: string; words: Record<string, string> }): Promise<boolean> {
  try {
    const completion = await completeChat(openai, "roomGame", {
      messages: [
        {
          role: "system",
          content:
            'A player guessed the secret word of a word game. Decide if the guess names the same thing as the secret word (any language, spelling or script variant, singular/plural, or a true synonym counts; a related but different thing does not). Return ONLY JSON: {"same": true|false}',
        },
        { role: "user", content: JSON.stringify({ secret: input.words, guess: input.guess }) },
      ],
      response_format: { type: "json_object" },
      temperature: 0,
      max_tokens: 30,
    });
    void recordTokens("roomGameJudge", completion.usage);
    const parsed = JSON.parse(extractJson(completion.choices[0]?.message?.content ?? "")) as { same?: unknown };
    return parsed.same === true;
  } catch (error) {
    console.error("[room-game] judge", error);
    return false;
  }
}

/**
 * 마피아 배경 이야기(사회자 AI일 때 시작에 한 번): 무대 이름과 첫 밤을 여는 두 문장, 방의 언어들로.
 * 실패하면 이야기 없이 시작한다(게임은 그대로).
 */
export async function pickMafiaStory(openai: OpenAI, input: { languages: string[] }): Promise<MafiaStory | null> {
  const names = input.languages.map((code) => `${code} = ${learningLanguageName(code)}`).join(", ");
  const keys = input.languages.map((code) => `"${code}": "..."`).join(", ");
  try {
    const completion = await completeChat(openai, "roomGame", {
      messages: [
        {
          role: "system",
          content: `You are the narrator of a mafia (werewolf) party game played by language learners in a voice room. Invent a fresh, light setting (a place where a small group is stuck together for a few nights — never real people, nothing gory or scary; a playful mystery tone).

Write in each of these languages: ${names}.
- setting: the place, 2–5 words.
- intro: two short, simple sentences a beginner can read aloud, setting the scene as the first night falls. Present tense, everyday words.

Return ONLY JSON: {"setting": {${keys}}, "intro": {${keys}}}`,
        },
        { role: "user", content: "New game." },
      ],
      response_format: { type: "json_object" },
      temperature: 1,
      max_tokens: 900,
    });
    void recordTokens("roomGameStory", completion.usage);
    return readMafiaStory(JSON.parse(extractJson(completion.choices[0]?.message?.content ?? "")), input.languages);
  } catch (error) {
    console.error("[room-game] story", error);
    return null;
  }
}
