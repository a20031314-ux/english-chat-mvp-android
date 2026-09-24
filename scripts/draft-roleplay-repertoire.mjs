/**
 * Drafting the lines an open conversation reaches for, in a language that has
 * none yet.
 *
 * The bank is English only. Everything the character says in the other thirteen
 * languages is written by the model on the spot, which costs a synthesis every
 * turn, cannot be two lines, and repeats itself with nothing to stop it. The
 * lines themselves are cheap to add — a repertoire line ships as words, not as
 * sixty kilobytes of audio (033eba1) — so what stood in the way was never the
 * shipping. It was that nobody here can read a Thai sentence and say whether it
 * is one anybody would say.
 *
 * Three things answer most of that, and all three are already written down:
 * what goes wrong in this language, in its own terms (lib/languageFocus.ts);
 * the register to hold, given as a line the scene already speaks rather than as
 * a rule; and what each line is *for*, which the English bank says by example.
 *
 * The English line is given as the role to fill, never as something to
 * translate. "What did you do there?" is not the sentence wanted in Japanese;
 * the sentence wanted is whatever a Japanese speaker says to point back at what
 * somebody just told them. Ids are mirrored so the two banks can be read side
 * by side afterwards, and so the report can compare which lines get used.
 *
 * Prints rather than saves, exactly as draft-roleplay-scenario.mjs does and for
 * the same reason: the reading is the expensive half and a file written
 * automatically is a file nobody reads. Pipe it to tmp/ and hand it to
 * review-roleplay-lines.mjs --file, which now knows this language too.
 *
 * Run: node --experimental-strip-types scripts/draft-roleplay-repertoire.mjs <language>
 *      ... --print   (show the brief instead of asking for a draft)
 */
import { readFileSync } from "node:fs";
import { justTalkSentences, justTalkScenarios } from "../src/lib/roleplay/justTalk.ts";
import { targetLanguageFocusHints } from "../src/lib/languageFocus.ts";
import {
  coerceLanguageCode,
  learningLanguageName,
} from "../src/lib/learningLanguages.ts";

const MODEL = process.env.OPENAI_DRAFT_MODEL ?? "gpt-4.1";

function apiKey() {
  const fromEnv = process.env.OPENAI_API_KEY?.trim();
  if (fromEnv) return fromEnv;
  try {
    for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
      const at = line.indexOf("=");
      if (at === -1) continue;
      if (line.slice(0, at).trim() !== "OPENAI_API_KEY") continue;
      return line.slice(at + 1).trim().replace(/^"|"$/g, "");
    }
  } catch {
    // Falls through to the message below.
  }
  console.error("No OPENAI_API_KEY, in the environment or in .env.local.");
  process.exit(2);
}

const [, , rawLanguage] = process.argv;
if (!rawLanguage || rawLanguage.startsWith("--")) {
  console.error("Usage: draft-roleplay-repertoire.mjs <language> [--print]\n");
  console.error("A language other than 'en': English is the one that has these already.");
  process.exit(2);
}
const language = coerceLanguageCode(rawLanguage);
const targetName = learningLanguageName(language);
if (language === "en") {
  console.error("English already has a repertoire; this exists to give one to the others.");
  process.exit(2);
}

const banks = justTalkSentences();
const scenario = justTalkScenarios().find((one) => one.language === language);
if (!scenario) {
  console.error(`No open conversation for ${language}.`);
  process.exit(2);
}

/** The English bank, which is the specification of what kinds of line are wanted. */
const english = banks.en ?? {};
const wanted = Object.entries(english).filter(([id]) => id.startsWith("talk."));
if (wanted.length === 0) {
  console.error("The English repertoire is empty; there is nothing to mirror.");
  process.exit(2);
}

/** The scene's own two lines, which is where its register is already decided. */
const own = banks[language] ?? {};
const greeting = own["open.hi"]?.text ?? "";
const goodbye = own["open.bye"]?.text ?? "";

const roles = wanted
  .map(([id, sentence]) => `- ${id} — the line that does what "${sentence.text}" does`)
  .join("\n");

const INSTRUCTIONS = `You are writing the lines a character reaches for in an open, spoken conversation in ${targetName}, for a language-learning app. The learner speaks Korean.

The scene: ${scenario.setting}
The character is: ${scenario.tutorRole}

THE REGISTER. These two lines are the scene's own, and they have already decided how this character speaks:
  greeting: "${greeting}"
  goodbye:  "${goodbye}"
Every line you write is in that same register. In some languages that is a decision made afresh on every sentence; a set of lines that disagrees about it is worse than one written slightly too formally throughout. Match these two.

WHAT THESE LINES ARE FOR. Half of them are reactions to whatever the person just said. The other half are follow-up questions that point back at what was just said rather than naming it — that is the whole reason they work. A question that names its subject ("How was Busan?") can only be written once the answer is known. A question that points back ("What did you do there?") fits whatever was just said, and can be written in advance. Write the pointing-back kind. If ${targetName} has a more natural way to point back than a pronoun, use it.

A turn is often a reaction and then a question, played one after the other, so each line has to stand alone and also sit naturally beside another.

DO NOT TRANSLATE. The English below is there to say what job each line does, not what it should say. Write the line a ${targetName} speaker actually says in that moment. If the English line's job does not exist in ${targetName}, or is done by something quite different, write that instead — the id is the job, not the wording.

The lines to write, by id:
${roles}

What goes wrong in ${targetName} in particular, which none of these may get wrong:
${targetLanguageFocusHints(language)}

Each line must be one breath long — something said out loud, not read.
"translation" is a Korean gloss of what the line does in that moment, the way a Korean speaker would say it — not a word-for-word rendering.

Reply as JSON only:
{"sentences": {"<id>": {"text": "<the line, in ${targetName}>", "translation": "<Korean>"}}}

One entry per id given, all ${wanted.length} of them, and no ids that were not given.`;

if (process.argv.includes("--print")) {
  console.log(INSTRUCTIONS);
  process.exit(0);
}

const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey()}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: MODEL,
    messages: [{ role: "user", content: INSTRUCTIONS }],
    response_format: { type: "json_object" },
    max_tokens: 6000,
  }),
});

if (!response.ok) {
  console.error(`${response.status} ${(await response.text()).slice(0, 400)}`);
  process.exit(1);
}

const body = await response.json();
const draft = JSON.parse(body.choices?.[0]?.message?.content ?? "{}");
const sentences = draft.sentences ?? {};

const missing = wanted.map(([id]) => id).filter((id) => !sentences[id]);
const extra = Object.keys(sentences).filter(
  (id) => !wanted.some(([wantedId]) => wantedId === id),
);
for (const id of missing) console.error(`// missing: ${id}`);
for (const id of extra) console.error(`// not asked for: ${id}`);

// The shape review-roleplay-lines.mjs --file reads, with the register in it so
// the reader is held to the same line the writer was.
console.log(
  JSON.stringify(
    {
      language,
      tutorRole: scenario.tutorRole,
      setting: scenario.setting,
      register: greeting,
      sentences,
    },
    null,
    2,
  ),
);
console.error(
  `\n// ${Object.keys(sentences).length} of ${wanted.length} lines, drafted by ${MODEL}.` +
    `\n// Nothing is written to src/. Save it, read it, and run:` +
    `\n//   npm run roleplay:review -- --file <path>`,
);
