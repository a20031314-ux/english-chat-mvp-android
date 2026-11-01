import {
  learningLanguageName,
  type LearningLanguageCode,
} from "./learningLanguages.ts";

/**
 * What goes wrong in each language, in that language's own terms.
 *
 * Written by hand, one row per language the app teaches, and the only place in
 * the repository that says what "wrong" looks like outside English. It names
 * the things a rubric written in English would miss entirely: which particles
 * exist to be got wrong, which agreements have to hold, and — for the five
 * languages where it is a decision on every sentence — politeness and register.
 *
 * It lived inside the chat route, which is where it was needed first and where
 * it stayed private long enough to be forgotten about. It is not chat's: any
 * part of the app that has to judge a sentence in a language nobody here reads
 * wants exactly this, and the roleplay bank is the next thing that does. A
 * sentence bank for Japanese has to be written in one register throughout, and
 * "polite vs plain (です/ます vs 辞書形)" is already written down here.
 *
 * A caveat worth carrying with it: this describes the mistakes a learner makes,
 * not whether a line a native would say sounds natural. The two overlap almost
 * everywhere and are not the same question. Used as a checklist for drafted
 * lines it catches register drift and calques, which are most of what goes
 * wrong; it will not tell anyone that a grammatical sentence is one no one says.
 */
export function targetLanguageFocusHints(targetLanguage: LearningLanguageCode): string {
  switch (targetLanguage) {
    case "ja":
      return `Japanese focus (use Japanese terms, not English labels):
- Particles (は/が/を/に/で/と/も…), verb/adjective conjugation, polite vs plain (です/ます vs 辞書形), word order, counters, transitive/intransitive pairs when wrong, unnatural calques from Korean/English.`;
    case "ko":
      return `Korean focus (use Korean terms):
- Particles (은/는/이/가/을/를/에/에서…), endings/politeness (해요체/반말/합쇼체), conjugation, honorifics when required by context, spacing, unnatural calques.
- Irregular conjugation is the most missed error. ㅂ-irregular stems (덥다, 춥다, 맵다, 어렵다, 쉽다, 귀엽다, 무섭다…) turn ㅂ into 우 before 아/어 endings; ㄷ-irregular stems (듣다, 걷다, 묻다 'ask', 싣다) turn ㄷ into ㄹ before vowels; 르-irregular stems (부르다, 모르다, 다르다, 빠르다) double the ㄹ (ㄹ라/ㄹ러). A learner form that leaves such a stem unchanged before 어요/아요/었 is WRONG — fix it in corrected, and check that your own corrected form applies the irregular rule. Never tell them the unchanged form is also correct or merely more polite.
- A time word and the tense ending must agree (a past time word with a present or future ending, or a future time word with a past ending, is wrong).
- Respect: when the learner speaks TO or ABOUT a teacher, grandparent, parent, boss, customer or stranger, 반말 or a bare command is a real error even if everything else is right. corrected must use 해요체 with -(으)시- where it belongs (있으세요, 드셨어요, 주셨어요) and a request form instead of a command (해 주세요). natural must keep that respect too.
- Never lower politeness the learner already used: keep -(으)시-, keep 해요체/합쇼체. Any word + 요 (별로요, 그냥요, 아마도요, 몰라요) is correct polite speech. 할래요 and 할까요 are both polite.
- Not errors — leave them: numerals vs words for numbers, synonym choice (쯤/정도, 이랑/하고), spacing that is commonly accepted both ways (한잔하다, 해 주다/해주다), 이/가 or 을/를 before -고 싶다.
- The explanation names the exact part that changed (which particle, which ending) and the correct form.`;
    case "zh":
      return `Chinese focus (use Chinese terms):
- Word order, 了/过/着, measure words, 的/地/得, aspect/result complements, coverbs (在/把/被), missing or wrong function words, unnatural calques.`;
    case "es":
    case "fr":
    case "it":
    case "pt":
      return `Romance focus (use ${learningLanguageName(targetLanguage)} terms, not English labels):
- Gender/number agreement, articles, verb conjugation/tense/mood (incl. subjunctive when required), clitics/pronouns, prepositions, ser/estar or language-specific copula pairs when relevant, false friends, unnatural calques.`;
    case "ru":
      return `Russian focus (use Russian terms):
- Case endings, verb aspect (perfective/imperfective), agreement, prepositions + case, word order only when it breaks meaning, unnatural calques.`;
    case "ar":
      return `Arabic focus (use Arabic terms):
- Root-and-pattern morphology, definite article, gender/number agreement, idafa, attached pronouns/clitics, verb form, case only when it is clearly wrong.
- Register: everything you write in Arabic is Modern Standard Arabic (الفصحى) — your reply and every rewrite alike, never Levantine, Egyptian, Gulf or any other dialect, so the learner hears and reads one Arabic. A dialect word the learner used is not a mistake by itself: do not rewrite a sentence only to swap it, but when you rewrite for another reason, write the whole sentence in Modern Standard Arabic.`;
    case "id":
      return `Indonesian focus (use Indonesian terms):
- Affixes (me-/ber-/ter-/di-/ke-an), reduplication, particles (lah/kah/pun), word order, unnatural calques. Do not invent tense endings.`;
    case "vi":
      return `Vietnamese focus (use Vietnamese terms):
- Classifiers, aspect particles (đã/đang/sẽ), word order, pronouns/register, missing function words, unnatural calques. Do not split tones as spelling errors.`;
    case "th":
      return `Thai focus (use Thai terms):
- Word boundaries, classifiers, polite particles (ครับ/ค่ะ), serial verbs, missing function words, unnatural calques. Do not split words into letters.`;
    case "hi":
      return `Hindi focus (use Hindi terms):
- Postpositions, gender/number agreement, split verbs, honorifics, SOV word order, unnatural calques from English.
- कल means both yesterday and tomorrow: read which from their verb tense, and keep that same reading in your reply and in any rewrite.`;
    default:
      return `Focus on real morphosyntax, agreement, function words, and patterns that natives would mark as wrong in ${learningLanguageName(targetLanguage)}.`;
  }
}

/**
 * How the tutor speaks in a spoken conversation: one speech level, one variety,
 * picking up what the learner just said.
 *
 * Found by simulated users (2026-11-01, 196 users × 3 turns): in Korean every
 * turn answered a learner speaking 해요체 in 반말, sometimes both in one reply;
 * in Arabic the tutor spoke Levantine while its rewrites were Modern Standard;
 * in Portuguese and Russian it asked about an earlier topic while the learner's
 * newest one hung there. A learner copies the tutor, so whatever the tutor
 * mixes the learner learns mixed.
 *
 * The speech level follows the learner rather than the scene: a friend may open
 * in plain speech, and a learner who answers politely is not wrong to — the
 * tutor matching them keeps both sides in one register they can copy back.
 */
export function tutorSpeechRules(targetLanguage: LearningLanguageCode): string {
  const level: Partial<Record<LearningLanguageCode, string>> = {
    ko: "In Korean: if they speak 해요체 (or 합쇼체) to you, answer in 해요체; only when they speak 반말 to you may you use 반말. Never mix 반말 and 해요체 in one reply, or switch back and forth between replies.",
    ja: "In Japanese: if they speak です/ます to you, answer in です/ます; only when they speak plain form to you may you use plain form. Never mix the two in one reply.",
    es: "In Spanish: tú or usted, whichever they use with you, the same in every reply.",
    fr: "In French: tu or vous, whichever they use with you, the same in every reply.",
    it: "In Italian: tu or Lei, whichever they use with you, the same in every reply.",
    pt: "In Portuguese: você/tu forms as they use them with you, the same in every reply.",
    ru: "In Russian: ты or вы, whichever they use with you, the same in every reply.",
    hi: "In Hindi: तुम or आप, whichever they use with you, the same in every reply.",
    vi: "In Vietnamese: keep one pair of pronouns for you and them, matching how they address you.",
    th: "In Thai: use your polite particle (ครับ/ค่ะ, by your own gender) the same way in every reply.",
  };
  return [
    "How you speak:",
    `- One speech level for the whole conversation, the one they use with you. ${level[targetLanguage] ?? "If they speak to you formally, stay formal; if casually, you may be casual — never both in one reply."}`,
    targetLanguage === "ar"
      ? "- Speak Modern Standard Arabic (الفصحى) only — never a dialect, in what you say and in what you write in \"better\" and \"meant\" — so they hear the same Arabic they are corrected into."
      : "",
    "- Pick up the last thing they said. Your reaction and any question are about their newest message — what they just told you — not a topic from earlier, unless they finished with it or asked to go back.",
  ]
    .filter(Boolean)
    .join("\n");
}
