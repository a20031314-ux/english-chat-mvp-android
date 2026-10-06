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
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { SCENARIOS, sentencesFor } from "../src/lib/roleplay/catalog.ts";
import { BANK_GLOSS_LANGUAGE } from "../src/lib/roleplay/justTalk.ts";
import { scenarioSentenceIds } from "../src/lib/roleplay/script.ts";
import { looksLikeLanguage } from "../src/lib/roleplay/transcript.ts";
import { targetLanguageFocusHints } from "../src/lib/languageFocus.ts";
import { isTtsVoice } from "../src/lib/roleplay/voices.ts";
import {
  SUPPORTED_LEARNING_LANGUAGES,
  learningLanguageName,
  uiLocaleOptions,
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

/**
 * The other half of the same question: the language the app is read in.
 *
 * Above is about the language being taught. This is about the one the learner
 * reads the app through, where the drift runs the other way — a string written
 * by hand in Korean, or a table of translations that stops short of fourteen,
 * and everyone outside it gets Korean. Both of those were live: the chat screen
 * told every learner "지금 처리에 문제가 있었어요." when a turn failed, and the
 * fallback correction explanation covered nine of the fourteen and sent the
 * other five to the Korean one.
 *
 * Facts again, so the rules are narrow. A quoted string is checked; a comment
 * or a regular expression is not, because Korean belongs in both — one explains
 * and the other matches what the model wrote.
 */
const LOCALES = uiLocaleOptions().map((option) => option.key);

/**
 * Screens that are Korean on purpose. The web landing page, the web checkout
 * notice and the page metadata are the Korean storefront; the /dev pages are
 * for whoever is building this. None of them is inside the app a learner uses.
 */
const KOREAN_ON_PURPOSE = [
  // Prompts, not screens: what the model is told, and the examples it is
  // shown, are written in Korean and the route picks them by interface
  // language. Everything a learner reads comes back from the model.
  "src/app/api/",
  "src/components/LandingPage.tsx",
  "src/app/subscribe/",
  "src/app/layout.tsx",
  "src/app/dev/",
  // The privacy policy carries a full Korean version beside the English one,
  // on purpose: Korean law asks for it, and it is a document, not a screen
  // that switches with the interface language.
  "src/app/privacy/",
];

const HANGUL = /[가-힣]/;

function sourceFiles(root) {
  const out = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
        continue;
      }
      if (/\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry)) out.push(full);
    }
  };
  walk(root);
  return out;
}

/**
 * Quoted spans only: comments and regular expressions never get here.
 *
 * Double quotes and backticks, not apostrophes — this repository writes its
 * strings with the first two, and treating an apostrophe as a quote made every
 * "learner's" in a comment open a string that swallowed the rest of the line.
 */
function stringLiterals(line) {
  const out = [];
  let quote = null;
  let start = 0;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (quote) {
      if (ch === "\\") {
        i += 1;
        continue;
      }
      if (ch === quote) {
        out.push(line.slice(start, i));
        quote = null;
      }
      continue;
    }
    if (ch === '"' || ch === "`") {
      quote = ch;
      start = i + 1;
    }
    if (ch === "/" && line[i + 1] === "/") break;
  }
  return out;
}

const uiProblems = [];
const uiNote = (where, what) => uiProblems.push({ where, what });

// 1. A table of translations that stops short. The shape is a run of lines each
//    naming a locale and a string, which is how every such table here is
//    written; one missing locale is one interface language reading another's.
for (const file of [...sourceFiles("src/components"), ...sourceFiles("src/app")]) {
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  const at = file.replace(/\\/g, "/");
  let run = [];
  let runStart = 0;
  const closeRun = () => {
    if (run.length >= 3) {
      const missing = LOCALES.filter((code) => !run.includes(code));
      if (missing.length > 0 && missing.length < LOCALES.length) {
        uiNote(
          `${at}:${runStart}`,
          `a table keyed by interface language is missing ${missing.join(", ")}`,
        );
      }
    }
    run = [];
  };
  lines.forEach((line, index) => {
    const match = line.match(/^\s*([a-z]{2})\s*:\s*["'`]/);
    if (match && LOCALES.includes(match[1])) {
      if (run.length === 0) runStart = index + 1;
      run.push(match[1]);
      return;
    }
    if (line.trim() === "" || line.trim().startsWith("//")) return;
    closeRun();
  });
  closeRun();

  // 2. Korean written into a screen every learner sees. A `ko:` line is one
  //    entry of a table, and rule 1 is the one that judges those.
  if (KOREAN_ON_PURPOSE.some((allowed) => at.includes(allowed))) continue;
  lines.forEach((line, index) => {
    if (!HANGUL.test(line)) return;
    if (/^\s*ko\s*:/.test(line)) return;
    const opener = line.trim();
    if (opener.startsWith("//") || opener.startsWith("*") || opener.startsWith("/*")) {
      return;
    }
    for (const literal of stringLiterals(line)) {
      if (HANGUL.test(literal)) {
        uiNote(`${at}:${index + 1}`, `Korean written into the screen: "${literal.slice(0, 40)}"`);
        return;
      }
    }
  });
}

// 3. The eleven generated locales, against each other. A key one of them lacks
//    is a screen that falls back to whatever the caller does with undefined,
//    and a Korean value in any of them is Korean reaching that language.
{
  const generated = JSON.parse(
    readFileSync("src/lib/locales/generated.json", "utf8"),
  );
  const codes = Object.keys(generated);
  const union = new Set(codes.flatMap((code) => Object.keys(generated[code])));
  for (const code of codes) {
    const missing = [...union].filter((key) => !(key in generated[code]));
    if (missing.length > 0) {
      uiNote(
        `generated.json:${code}`,
        `missing ${missing.length} key(s) the other locales have: ${missing.slice(0, 4).join(", ")}`,
      );
    }
    for (const [key, value] of Object.entries(generated[code])) {
      if (typeof value === "string" && HANGUL.test(value)) {
        uiNote(`generated.json:${code}`, `${key} is still in Korean: "${value.slice(0, 40)}"`);
      }
    }
  }
}

const languages = SUPPORTED_LEARNING_LANGUAGES.length;
if (problems.length === 0 && uiProblems.length === 0) {
  console.log(`${languages} languages, nothing to report.`);
  console.log("Checked: a scene, a voice the speech model takes, a name and lines");
  console.log("written in the language, a gloss readable by whoever is shown it,");
  console.log("a way out that listens in the right language, and a rubric of its own.");
  console.log(
    `Also ${LOCALES.length} interface languages: no Korean written into a screen,`,
  );
  console.log("no table of translations stopping short, no generated locale short a key.");
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
if (problems.length > 0) {
  console.error(
    `\n${problems.length} problem(s) across ${byLanguage.size} of ${languages} languages taught.`,
  );
}
if (uiProblems.length > 0) {
  console.error(`\nInterface language — ${uiProblems.length} problem(s):`);
  for (const problem of uiProblems) {
    console.error(`    ${problem.where}  ${problem.what}`);
  }
}
process.exit(1);
