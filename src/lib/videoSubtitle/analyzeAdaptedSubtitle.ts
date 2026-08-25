import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import { chatModel, getOpenAIClient } from "@/lib/videoSubtitle/openaiClient";
import { asRecord, asString, parseModelJson } from "@/lib/videoSubtitle/parseModelJson";
import { scenePayload, localeTargetName } from "@/lib/videoSubtitle/subtitleDraft";
import type { SceneContext } from "@/lib/videoSubtitle/sceneTypes";
import type { UtteranceTone } from "@/lib/videoSubtitle/subtitleDraft";
import type { VideoContext } from "@/lib/videoSubtitle/types";

export type VideoSubtitleLearningAnalysis = {
  subtitleId: string;
  keyExpression: string;
  keyMeaning: string;
  whyThisSubtitle: string;
  meaningInSentence: string;
  nuance: string;
  similar: string[];
};

export async function analyzeAdaptedSubtitle(input: {
  subtitleId: string;
  locale: string;
  original: string;
  naturalSubtitle: string;
  analysisTranslation?: string;
  meaning?: string;
  tone?: UtteranceTone;
  speakerStyle?: string;
  context?: VideoContext;
  sceneContext?: SceneContext;
  previous?: string[];
  next?: string[];
  nativeUnderstanding?: {
    understoodMeaning?: string;
    references?: Array<{
      expression: string;
      refersTo: string;
      evidenceLevel?: string;
    }>;
    intent?: string;
    tone?: string;
    establishedNote?: string;
  };
}): Promise<VideoSubtitleLearningAnalysis> {
  const client = getOpenAIClient();
  if (!client) throw new VideoPipelineError("MISSING_OPENAI_KEY");

  const inKorean = input.locale === "ko";
  const target = localeTargetName(input.locale);

  const completion = await client.chat.completions.create({
    model: chatModel(),
    temperature: 0.65,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: inKorean
          ? `학습자가 「이 표현은 뭐야?」라고 물었을 때처럼 답한다.

순서:
1) 원어민 시청자가 이 장면을 보고 실제로 이해한 의미 (nativeUnderstanding가 있으면 그걸 우선)
2) 그래서 한국어 자막이 왜 그런 느낌인지 — 지시어/암시가 어떻게 풀렸는지
3) 그 다음, 단어/표현의 일반적인 쓰임은 짧게 덧붙여도 된다

SCENE CONTEXT / nativeUnderstanding는 추가 증거다. 추측을 사실처럼 단정하지 않는다.
analysisSpoken이 있으면 자막(subtitle)과 다를 수 있다. 자막이 틀렸다는 식으로 말하지 말고, analysisSpoken은 원문을 풀어 읽은 처음 해석으로만 쓴다.
사전 나열보다 “한국인이 들으면 이런 분위기”를 우선한다.

JSON으로만 답한다:
{
  "keyExpression": "짚을 핵심 표현",
  "keyMeaning": "짧은 뜻",
  "whyThisSubtitle": "자막이 왜 그런 한국어 느낌이 되는지, 장면·지시 대상·말투 중심 설명",
  "meaningInSentence": "이 대화/장면에서 이 말이 하는 역할",
  "nuance": "태도·강도·친밀도·농담/진지 등 감각적인 메모",
  "similar": ["비슷한 한국어 감각의 다른 말 1~3개"]
}`
          : `Answer as if the learner asked what this expression is.

Write learner-facing fields ONLY in ${target}.
Order:
1) What a native viewer actually understood in THIS scene (prefer nativeUnderstanding when present)
2) Why the ${target} subtitle feels that way — how deixis/implication was unpacked
3) Optional short note on general usage

SCENE CONTEXT / nativeUnderstanding is extra evidence. Do not state guesses as facts.
If analysisSpoken is present it may differ from the on-screen subtitle. Do not say the subtitle is wrong; use analysisSpoken as the fuller first reading of the source.
Prefer “how a ${target} speaker would hear this vibe” over a dictionary dump.

Return JSON only:
{
  "keyExpression": "the key source expression",
  "keyMeaning": "short meaning in ${target}",
  "whyThisSubtitle": "why the caption has that ${target} feel — scene, referent, tone",
  "meaningInSentence": "what this line is doing in this conversation/scene",
  "nuance": "attitude, force, intimacy, joke vs serious",
  "similar": ["1–3 other ${target} lines with a similar feel"]
}`,
      },
      {
        role: "user",
        content: JSON.stringify({
          original: input.original,
          subtitle: input.naturalSubtitle,
          analysisSpoken: input.analysisTranslation || undefined,
          meaning: input.meaning,
          tone: input.tone,
          speakerStyle: input.speakerStyle,
          context: input.context,
          sceneContext: scenePayload(input.sceneContext),
          nativeUnderstanding: input.nativeUnderstanding,
          previous: input.previous ?? [],
          next: input.next ?? [],
        }),
      },
    ],
  });

  const parsed = asRecord(parseModelJson(completion.choices[0]?.message?.content));
  const similarRaw = Array.isArray(parsed?.similar) ? parsed.similar : [];
  const similar = similarRaw
    .map((row) => asString(row))
    .filter((row): row is string => Boolean(row))
    .slice(0, 4);

  return {
    subtitleId: input.subtitleId,
    keyExpression: asString(parsed?.keyExpression) || input.original.slice(0, 40),
    keyMeaning: asString(parsed?.keyMeaning) || "",
    whyThisSubtitle:
      asString(parsed?.whyThisSubtitle) ||
      asString(parsed?.meaningInSentence) ||
      "",
    meaningInSentence: asString(parsed?.meaningInSentence) || "",
    nuance: asString(parsed?.nuance) || "",
    similar,
  };
}
