import { takeAiHelp } from "@/lib/server/aiHelp";
import { captionPartCounts } from "@/lib/server/entitlementStore";
import { NextRequest, after } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { meterRequest } from "@/lib/server/meterRequest";
import { getOpenAIClient } from "@/lib/server/openai";
import { heardInAny, heardOrNothing } from "@/lib/roleplay/transcript";
import { cleanLanguages } from "@/lib/rooms/roomFilter";
import { learningLanguageName } from "@/lib/learningLanguages";
import { requestUserId } from "@/lib/server/premiumRequest";
import { confidenceFromLogprobs, noteRecognition } from "@/lib/server/learnerMetrics";
import { toFile } from "openai";
import { isNextGenTranscribe, turnTranscribeModel, wantsTrialReport } from "@/lib/server/speechModels";
import { externalSttReady, isExternalStt, transcribeExternal } from "@/lib/server/sttProviders";
import { confidenceOfLogprobs, confidenceOfWords, isUnsure, type SpeechConfidence } from "@/lib/speechConfidence";

export const dynamic = "force-dynamic";

/**
 * What the learner just said, as fast as it can be had.
 *
 * A spoken turn used to go through the video subtitle pipeline, which is built
 * for a different job and charges for it: whisper-1, verbose JSON, segment and
 * word timestamps, and a second transcription of the whole clip if the first
 * one is refused. It also carries a prompt about background music and song
 * lyrics, written for film, which tells a model listening to a person in a
 * quiet room to consider outputting nothing.
 *
 * A turn needs one short string and needs it now. Everything the learner says
 * is followed by silence until this returns, then the character thinking, then
 * the line being synthesised — three waits in a row with a person sitting
 * there, so the one that was paying for subtitle machinery is the one to cut.
 */
// 모델은 server/speechModels.ts에서 고른다(gpt-4o-mini-transcribe 2027-02-26 종료 → gpt-transcribe로 옮기는 중).

/** A turn is seconds of speech. Anything larger is not one. */
const MAX_TURN_BYTES = 8 * 1024 * 1024;

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  const client = getOpenAIClient();
  if (!client) {
    return jsonWithCors(request, { error: "MISSING_OPENAI_KEY" }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const audioBase64 = typeof body.audioBase64 === "string" ? body.audioBase64 : "";
  if (!audioBase64) {
    return jsonWithCors(request, { error: "NO_AUDIO" }, { status: 400 });
  }
  const bytes = Buffer.from(audioBase64, "base64");
  if (bytes.byteLength === 0 || bytes.byteLength > MAX_TURN_BYTES) {
    return jsonWithCors(request, { error: "NO_AUDIO" }, { status: 413 });
  }

  // A speaker in a person-to-person room (api/rooms) uses the same fast path,
  // but is not necessarily speaking the language they learn — a language
  // exchange swaps — so nothing is noted about them as a learner.
  const forRoom = body.room === true;
  // 쉼마다 자른 조각(rooms/speechParts.ts): 같은 말의 번호와 순번, 그리고 앞 조각에서 받아쓴 글(맥락).
  const utterance = typeof body.utterance === "string" && /^[A-Za-z0-9_-]{4,40}$/.test(body.utterance) ? body.utterance : "";
  const previous = typeof body.previous === "string" ? body.previous.replace(/\s+/g, " ").trim().slice(-240) : "";
  if (forRoom) {
    // 말하는 방 자막은 하루 줄 수 한도(billing/plans.ts dailyCaptionLines). 넘으면 자막만 멈추고 음성 대화는 그대로.
    // 말 하나를 한 줄로 센다(뒷조각은 세지 않음, entitlementStore.captionPartCounts).
    const counts = utterance ? await captionPartCounts(requestUserId(request), utterance).catch(() => true) : true;
    if (counts) {
      const caption = await takeAiHelp(request, "caption");
      if (!caption.ok) return jsonWithCors(request, { error: caption.error, limit: caption.limit }, { status: 429 });
    }
  }
  void meterRequest(request, forRoom ? "roomListen" : "roleplayListen");

  const mimeType = typeof body.mimeType === "string" ? body.mimeType : "audio/webm";
  const filename = typeof body.filename === "string" ? body.filename : "turn.webm";
  // Only the base tag: the API takes "en", not "en-US".
  const language =
    typeof body.language === "string"
      ? body.language.trim().toLowerCase().split(/[-_]/)[0]
      : "";

  // A room says which languages are spoken in it (two, usually). One is a hint;
  // two are named in the prompt instead, and the answer must be in one of them.
  const roomLanguages = forRoom ? cleanLanguages(body.languages) : [];
  const hint = roomLanguages.length === 1 ? roomLanguages[0] : language;
  const spoken =
    roomLanguages.length > 1 ? ` They speak ${roomLanguages.map((code) => learningLanguageName(code)).join(" or ")}.` : "";

  const model = turnTranscribeModel(request);
  // 바깥 받아쓰기가 실패하면 OpenAI로 다시 — 그때 쓸 모델(Vercel 값 또는 기본값).
  const openaiModel = isExternalStt(model) ? turnTranscribeModel() : model;
  const nextGen = isNextGenTranscribe(openaiModel);
  const started = Date.now();
  // gpt-transcribe는 language 대신 languages(배열)를 받고 temperature는 문서에 없다. 방의 두 언어를 그대로 넘길 수 있다.
  const languageHint = nextGen
    ? (roomLanguages.length ? { languages: roomLanguages } : hint.length === 2 ? { languages: [hint] } : {})
    : hint.length === 2
      ? { language: hint }
      : {};
  const asked = {
    model: isExternalStt(openaiModel) ? "gpt-4o-mini-transcribe" : openaiModel,
    ...(nextGen ? {} : { temperature: 0 }),
    ...languageHint,
    // Says what kind of audio this is, which is most of what stops a model
    // handed half a second of sound from filling the gap with something it
    // has heard often. The language hint alone did not.
    //
    // And says it is a learner, written down as said. A recogniser tidies
    // grammar on its way to text — "I go there yesterday" comes out "I went
    // there yesterday" — and a mistake it fixes is one the tutor never sees,
    // so it can neither correct it nor work out what was meant (director.ts).
    prompt:
      "A language learner speaking one short turn in a casual conversation. Write exactly what they say, mistakes included: wrong verb forms, missing words, words from another language. Do not correct it. If nobody speaks, or there is only noise, write nothing." +
      spoken +
      // 뒷조각: 앞에서 한 말을 알려 줘야 문장 중간에서 시작하는 소리를 제대로 잇는다. 앞 글을 다시 쓰지는 말라고.
      (previous ? ` This audio continues what they just said: "${previous}". Write only the words in this audio, not the earlier ones.` : ""),
  };

  // OpenAI 밖 받아쓰기(Scribe v2·AssemblyAI). 키가 없거나 실패하면 아래 OpenAI 길로(한 마디가 사라지지 않게).
  if (isExternalStt(model) && externalSttReady(model)) {
    try {
      const heard = await transcribeExternal(model, {
        bytes,
        mimeType,
        filename,
        languages: roomLanguages.length ? roomLanguages : hint.length === 2 ? [hint] : [],
        context: previous,
      });
      const raw = heard.text;
      const text = roomLanguages.length > 1 ? heardInAny(raw, roomLanguages) : heardOrNothing(raw, hint);
      const userId = requestUserId(request);
      if (!forRoom) after(() => noteRecognition(userId, text, heard.confidence));
      const sure = confidenceOfWords(heard.words.map((word) => word.confidence));
      const unsure = Boolean(text) && isUnsure(sure, model);
      if (wantsTrialReport(request)) {
        return jsonWithCors(request, { text, raw, confidence: heard.confidence, sure, unsure, detected: heard.languages, words: heard.words, model, ms: Date.now() - started });
      }
      return jsonWithCors(request, { text, ...(unsure ? { unsure } : {}) });
    } catch (error) {
      console.error(`[roleplay/listen] ${model} failed, falling back:`, error);
      if (wantsTrialReport(request)) {
        return jsonWithCors(request, { text: "", error: String((error as Error)?.message ?? error).slice(0, 300), model, ms: Date.now() - started }, { status: 502 });
      }
    }
  }
  try {
    // The words are the same either way. Asked as JSON with token
    // probabilities so the recogniser's confidence can be kept beside the turn
    // (learnerMetrics.ts) — the one figure about a spoken turn nothing else
    // can recover. A model that refuses the option is asked the old way, plain
    // text, so a turn never fails for the sake of a measurement. No timestamps:
    // they are what made the subtitle path slow and a turn has no use for them.
    // gpt-transcribe 계열은 SDK 타입에 아직 없는 필드(languages)를 받아서, 부르는 곳을 한 군데로 모은다.
    type Asked = Record<string, unknown>;
    const transcribe = async (extra: Asked) =>
      (await client.audio.transcriptions.create({
        ...asked,
        ...extra,
        file: await toFile(bytes, filename, { type: mimeType }),
      } as unknown as Parameters<typeof client.audio.transcriptions.create>[0])) as unknown;
    const textOf = (result: unknown) =>
      typeof result === "string" ? result : String((result as { text?: unknown })?.text ?? "");
    // 새 모델은 text 형식을 문서에 안 적어 둬서 언제나 json으로 묻는다.
    const plain: Asked = nextGen ? { response_format: "json" } : { response_format: "text" };
    let raw: string;
    let confidence: number | null = null;
    let sure: SpeechConfidence = { mean: null, min: null };
    let detected: unknown = null;
    try {
      const result = await transcribe({ response_format: "json", include: ["logprobs"] });
      raw = textOf(result);
      detected = (result as { languages?: unknown }).languages ?? null;
      confidence = confidenceFromLogprobs((result as { logprobs?: unknown }).logprobs);
      sure = confidenceOfLogprobs((result as { logprobs?: unknown }).logprobs);
    } catch (error) {
      if ((error as { status?: number })?.status !== 400) throw error;
      const result = await transcribe(plain);
      raw = textOf(result);
      detected = (result as { languages?: unknown })?.languages ?? null;
    }
    // Checked on the way back as well, because neither the hint nor the prompt
    // is a guarantee: a reply in a script this language does not use was not a
    // transcription of it (roleplay/transcript.ts).
    let text = roomLanguages.length > 1 ? heardInAny(raw, roomLanguages) : heardOrNothing(raw, hint);
    const heardText = text;
    if (!text && raw.trim() && roomLanguages.length > 1) {
      // Written in neither of the room's scripts: invented. Asked once more with
      // the room's first language (the one it is about) as the hint.
      const again = textOf(
        await transcribe({ ...plain, ...(nextGen ? { languages: [roomLanguages[0]] } : { language: roomLanguages[0] }) }),
      );
      text = heardOrNothing(again, roomLanguages[0]);
    }
    const userId = requestUserId(request);
    if (!forRoom) after(() => noteRecognition(userId, text, confidence));
    // 확신이 낮은 줄은 앱이 말풍선 끝에 "?"(speechConfidence.ts). 옛 앱은 이 값을 모르고 지나간다.
    // 다시 받아쓴 줄(방 언어 밖 글자)은 첫 답의 확률이 그 글과 맞지 않아 표시하지 않는다.
    const unsure = Boolean(text) && text === heardText && isUnsure(sure, asked.model);
    if (wantsTrialReport(request)) {
      return jsonWithCors(request, { text, raw, confidence, sure, unsure, detected, model, ms: Date.now() - started });
    }
    return jsonWithCors(request, { text, ...(unsure ? { unsure } : {}) });
  } catch (error) {
    console.error("[roleplay/listen]", error);
    return jsonWithCors(request, { error: "STT_FAILED" }, { status: 502 });
  }
}
