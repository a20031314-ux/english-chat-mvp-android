/**
 * Every language the app teaches, checked for the things that have a right
 * answer.
 *
 * The app is built around English taught to Korean speakers, and the parts
 * written by hand drifted towards that without anyone deciding to: a French
 * speaker learning Japanese was shown the Japanese greeting with a Korean line
 * under it and told what to do next in Korean too. Both were found by reading
 * the code, which is a poor way to find the third one.
 *
 * So this is the layer of that question which needs no speaker of the language.
 * Whether a sentence is natural is a judgement; whether it is written in the
 * script its language uses is a fact, and so is whether a language has a voice,
 * a way out of the conversation, and a row saying what goes wrong in it.
 * Everything here is a fact.
 *
 * What it deliberately does not do is ask a model anything. That is the second
 * layer — does the reply answer what was said, does the correction correct —
 * and it costs money and returns opinions. This costs nothing and returns
 * facts, so it can run before every release and fail a build.
 *
 * Run: npm run check:languages
 */
import { SCENARIOS, sentencesFor } from "../src/lib/roleplay/catalog.ts";
import { BANK_GLOSS_LANGUAGE } from "../src/lib/roleplay/justTalk.ts";
import { scenarioSentenceIds } from "../src/lib/roleplay/script.ts";
import { looksLikeLanguage } from "../src/lib/roleplay/transcript.ts";
import { targetLanguageFocusHints } from "../src/lib/languageFocus.ts";
import { isTtsVoice } from "../src/lib/roleplay/voices.ts";
import {
  SUPPORTED_LEARNING_LANGUAGES,
  learningLanguageName,
} from "../src/lib/learningLanguages.ts";

const problems = [];
const note = (language, what) => problems.push({ language, what });

/**
 * A gloss with its quotations taken out.
 *
 * An explanation written for a learner quotes the thing they are learning —
 * "어디로 갈까요? ... "Can you take me to the central station."처럼 말하면
 * 됩니다." is Korean prose around an English sentence, and counting letters
 * called it English. The quoted part is the one bit of it that is supposed to
 * be in the other language, so it does not get a vote.
 */
const withoutQuotes = (text) => text.replace(/["“”][^"“”]*["“”]/g, " ");

for (const { code } of SUPPORTED_LEARNING_LANGUAGES) {
  const scenes = SCENARIOS.filter((scenario) => scenario.language === code);
  if (scenes.length === 0) {
    note(code, "has no scene at all");
    continue;
  }
  const bank = sentencesFor(code);

  for (const scenario of scenes) {
    const where = scenes.length > 1 ? ` (${scenario.id})` : "";

    // A voice the speech model will not accept is a line that cannot be said.
    if (!isTtsVoice(scenario.voice)) {
      note(code, `voice "${scenario.voice}" is not one the speech model takes${where}`);
    }

    // The scene's name is read by the learner, in the language they are learning.
    if (!looksLikeLanguage(scenario.title, code)) {
      note(code, `the scene is called "${scenario.title}", which is not written in ${learningLanguageName(code)}${where}`);
    }

    for (const id of scenarioSentenceIds(scenario)) {
      const sentence = bank[id];
      if (!sentence) {
        note(code, `${id} is said by the scene and missing from the bank${where}`);
        continue;
      }
      // What the character says is the language being learned. This is the one
      // nothing else checks: transcript.ts reads the learner's side only.
      if (!looksLikeLanguage(sentence.text, code)) {
        note(code, `${id} is spoken as "${sentence.text.slice(0, 32)}", not in ${learningLanguageName(code)}${where}`);
      }
      // A gloss is read rather than heard, so it belongs to whoever is reading.
      // The bank's are all one language and the screen hides them from anyone
      // else; a gloss in some third language would reach everybody wrongly.
      if (
        sentence.translation &&
        !looksLikeLanguage(withoutQuotes(sentence.translation), BANK_GLOSS_LANGUAGE)
      ) {
        note(code, `${id} is glossed as "${sentence.translation.slice(0, 32)}", which is not ${BANK_GLOSS_LANGUAGE}${where}`);
      }
    }

    // The scripted way out. Without one the learner can only leave by closing
    // the screen, and the recorded goodbye — one of the two lines a language
    // records — is never heard.
    for (const node of Object.values(scenario.nodes)) {
      if (node.type !== "learner") continue;
      const leaving = node.expect.flatMap((branch) => branch.match);
      if (leaving.length === 0) {
        note(code, `${node.id} accepts nothing${where}`);
      }
      for (const phrase of leaving) {
        if (!looksLikeLanguage(phrase, code)) {
          note(code, `${node.id} listens for "${phrase}", which is not ${learningLanguageName(code)}${where}`);
        }
      }
    }
  }

  // What goes wrong in this language, which both the corrector and the reviewer
  // read. English is the language the list was drawn up from and has no row.
  if (code !== "en" && targetLanguageFocusHints(code).startsWith("Focus on real morphosyntax")) {
    note(code, "falls back to the generic rubric: no row in languageFocus.ts");
  }
}

const languages = SUPPORTED_LEARNING_LANGUAGES.length;
if (problems.length === 0) {
  console.log(`${languages} languages, nothing to report.`);
  console.log("Checked: a scene, a voice the speech model takes, a name and lines");
  console.log("written in the language, a gloss readable by whoever is shown it,");
  console.log("a way out that listens in the right language, and a rubric of its own.");
  process.exit(0);
}

const byLanguage = new Map();
for (const problem of problems) {
  byLanguage.set(problem.language, [...(byLanguage.get(problem.language) ?? []), problem.what]);
}
for (const [code, what] of byLanguage) {
  console.error(`${code} — ${learningLanguageName(code)}`);
  for (const one of what) console.error(`    ${one}`);
}
console.error(
  `\n${problems.length} problem(s) across ${byLanguage.size} of ${languages} languages.`,
);
process.exit(1);
