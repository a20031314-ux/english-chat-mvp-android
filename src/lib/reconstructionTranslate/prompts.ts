import type { MeaningExtraction, TranslationContext } from "./types.ts";
import { DEFAULT_SPEECH_TEXTURE } from "./types.ts";

function langName(code: string): string {
  const names: Record<string, string> = {
    en: "English",
    ko: "Korean",
    ja: "Japanese",
    zh: "Chinese",
    es: "Spanish",
    fr: "French",
    de: "German",
  };
  return names[code] ?? code;
}

function contextBlock(ctx: TranslationContext): string {
  const lines: string[] = [];
  if (ctx.videoContext?.trim()) lines.push(`Situation / video context: ${ctx.videoContext.trim()}`);
  if (ctx.speakerRelationship?.trim()) {
    lines.push(`Speaker-listener relationship (hint): ${ctx.speakerRelationship.trim()}`);
  }
  if (ctx.previousLines?.length) {
    lines.push(`Previous lines: ${ctx.previousLines.join(" / ")}`);
  }
  if (ctx.nextLines?.length) {
    lines.push(`Following lines: ${ctx.nextLines.join(" / ")}`);
  }
  if (ctx.sourceType) lines.push(`Source type: ${ctx.sourceType}`);
  return lines.length ? lines.join("\n") : "(no extra context)";
}

/** Current 1-pass style: the source sentence remains the object being translated. */
export function onePassSystem(ctx: TranslationContext): string {
  const target = langName(ctx.targetLang);
  const source = langName(ctx.sourceLang);
  return `Translate the ${source} line into natural spoken ${target}.

Prefer what a native ${target} speaker would say in this situation.
Match register (casual vs polite). Keep jokes, hedges, and force.
Do not add tutor notes.

Return ONLY JSON: {"translated":"..."}`;
}

export function onePassUser(ctx: TranslationContext): string {
  return JSON.stringify({
    text: ctx.sourceText,
    context: contextBlock(ctx),
  });
}

/**
 * Step 1: meaning only. Must not produce a target-language caption,
 * and must not retell the source clause-by-clause.
 */
export function extractMeaningSystem(ctx: TranslationContext): string {
  const source = langName(ctx.sourceLang);
  return `You extract WHAT a ${source} utterance is doing. You do not translate it.

Restate WHAT WAS SAID as plain ${source} content — the idea a listener takes away.
Write the content of the utterance, not a reporter describing the speaker.
WRONG: "The speaker is mentioning DeepSeek" / "Someone is asking about OpenAI"
RIGHT: "And China — well, DeepSeek, which shocked the world" / "Asking: is it called open-weight?"
Do NOT start with "The speaker is", "Someone is talking/mentioning/asking/explaining".
Do NOT copy the original clause pattern (clefts like "the reason X is", "what I'm saying is", "the thing is").
Do NOT write a sentence that could be used as a ${langName(ctx.targetLang)} subtitle or translation.
Do NOT mention word order.

Also extract SPEECH TEXTURE as a separate object (not mixed into coreMeaning):
- register: casual spoken vs formal written vs ordinary
- hedges/fillers and what they are doing (stall, soften, hedge)
- whether the speaker corrects or contradicts themselves
- repetitions used for emphasis
- whether the utterance runs on or comes in short chops
Texture is not a translation. Do not rewrite fillers into ${langName(ctx.targetLang)}.

Return ONLY JSON:
{
  "coreMeaning": "plain restatement of what was said, not a reporter note, not a translation",
  "speakerIntent": "inform | advise | refuse | hedge | question | sarcasm | joke | complain | other",
  "formalityLevel": "intimate | casual | polite | formal",
  "speakerRelationship": "friends | public explainer | host-guest | stranger-polite | unknown",
  "keyEntities": ["proper names, numbers, or terms that must survive"],
  "speechTexture": {
    "registerType": "formal_written | casual_spoken | standard",
    "fillers": ["source hedges/fillers such as I know / kind of / I feel like — empty if none"],
    "hasSelfCorrection": false,
    "repetitionForEmphasis": ["phrases repeated for emphasis — empty if none"],
    "sentenceRhythm": "run_on | short_choppy | standard"
  }
}`;
}

export function extractMeaningUser(ctx: TranslationContext): string {
  return JSON.stringify({
    sourceText: ctx.sourceText,
    extra: contextBlock(ctx),
  });
}

/**
 * Step 2: compose a new target utterance from meaning only.
 * The original sentence is intentionally absent so the model cannot calque it.
 */
export function generateTranslationSystem(ctx: TranslationContext): string {
  const target = langName(ctx.targetLang);
  return `You will receive the MEANING of something someone said — not the original wording.

Write an ON-SCREEN ${target} caption: the line THE SPEAKER said, in the same spoken register this app's ${target} UI uses. What a native would actually put on screen.

The caption IS the utterance. Not a recap of the utterance.
WRONG: "Someone is asking about OpenAI" / "오픈AI에 대해 질문하고 있어" / "~에 대해 이야기하고 있어요"
RIGHT: "오픈웨이트라는 거예요?" / "그리고 최근 뭐니뭐니 해도 화제의 문샷 AI."

Permissions (use them):
- You are composing a new utterance, not mapping words.
- Drop source discourse frames (the reason X is / what I'm saying is / the thing is). Say the point.
- Split or merge only if a caption still stays one breath. Prefer shorter than the meaning note.
- Drop subjects/objects that a native would leave implicit.
- Frozen idioms become ${target} idioms or ordinary talk, never a word-for-word calque.
- Keep the listed names/numbers exact.

Speech texture (separate from structure):
- If registerType is casual_spoken: do not polish this into a tidy written sentence.
  Keep the same kind of hesitation, hedge, self-correction, and emphasis the texture lists,
  using whatever devices a native ${target} speaker would actually use in speech.
  A clean essay that drops those devices is a miss even if the meaning is right.
- If registerType is formal_written: a tidy sentence is fine.
- If sentenceRhythm is run_on or short_choppy, keep that pacing; do not "fix" it into a lecture.

Constraints:
- Same intent, attitude, and formality.
- No translator notes, labels, or quotes around the line.
- Do not invent facts, dates, topics, or objects that were not in the meaning.
- Do not unpack the line into extra commentary. Caption only.
- Do not describe the speaker ("someone is talking/mentioning/explaining/asking"). Say what they said.

Return ONLY JSON: {"translated":"..."}`;
}

export function generateTranslationUser(
  ctx: TranslationContext,
  meaning: MeaningExtraction,
): string {
  const texture = meaning.speechTexture ?? DEFAULT_SPEECH_TEXTURE;
  return JSON.stringify({
    situation: contextBlock(ctx),
    coreMeaning: meaning.coreMeaning,
    speakerIntent: meaning.speakerIntent,
    formalityLevel: meaning.formalityLevel,
    speakerRelationship: meaning.speakerRelationship,
    mustKeep: meaning.keyEntities,
    speechTexture: texture,
  });
}

/**
 * First reading for the analysis panel. Source stays in view.
 * Fuller than a caption; may keep discourse frames. Not a subtitle.
 */
export function firstInterpretationSystem(ctx: TranslationContext): string {
  const target = langName(ctx.targetLang);
  const source = langName(ctx.sourceLang);
  return `Write a FIRST READING of this ${source} line in ${target} for a learner analysis panel.

This is NOT an on-screen caption. Do not subtitle-compress.
Keep the information the speaker packed in, including discourse frames
("what I'm trying to say", "the reason is") when they are doing work.
Match the source register in ${target} (casual source → casual ${target}, not a textbook).
Do not add tutor notes. Do not invent facts.
Do not recap the speaker ("someone is talking about X", "~에 대해 이야기하고 있어요"). Write the line they said.

Return ONLY JSON: {"translated":"..."}`;
}

export function firstInterpretationUser(ctx: TranslationContext): string {
  return JSON.stringify({
    text: ctx.sourceText,
    context: contextBlock(ctx),
  });
}

/**
 * Step 3 (optional): review the 2-pass line. Source is allowed here
 * so meaning drift can be caught — but the job is still "rewrite if
 * translationese", not "translate the source again".
 */
export function critiqueTranslationSystem(ctx: TranslationContext): string {
  const target = langName(ctx.targetLang);
  return `You review a ${target} line that was composed from meaning, not from a word mapping.

Keep it if a native would say it in this situation.
Rewrite it only when needed.

Rewrite when:
- leftover ${langName(ctx.sourceLang)} clause shape / translationese
- the joke or sarcasm was explained instead of performed
- the line recaps the speaker instead of being the utterance
  ("someone is talking about X", "~에 대해 이야기하고 있어요")
- facts were added that the meaning did not contain
- registerType was casual_spoken but the line reads like tidy written prose
  (hedges, stalls, self-correction, or emphasis rhythm were ironed out)

Do not rewrite just to sound fancier.
If you rewrite: same intent, formality, names/numbers, and speech texture.
Return the ${target} line only — no notes.

Return ONLY JSON:
{"translated":"...","changed":false}`;
}

export function critiqueTranslationUser(
  ctx: TranslationContext,
  meaning: MeaningExtraction,
  draft: string,
): string {
  return JSON.stringify({
    sourceText: ctx.sourceText,
    draft,
    coreMeaning: meaning.coreMeaning,
    speakerIntent: meaning.speakerIntent,
    formalityLevel: meaning.formalityLevel,
    mustKeep: meaning.keyEntities,
    speechTexture: meaning.speechTexture ?? DEFAULT_SPEECH_TEXTURE,
  });
}
