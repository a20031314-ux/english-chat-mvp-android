/**
 * Whether the character answers what it was told, in a language nobody here
 * reads.
 *
 * check-language-coverage.mjs asks the questions that have a right answer: is
 * this written in the script the language uses, does it have a voice, a way
 * out, a rubric. This asks the one that does not. Does the reply respond to
 * what was said? Does the correction correct? Those are judgements, so this
 * costs money and returns opinions, and it is kept apart for that reason.
 *
 * It works because the judgement was already being made this way and found
 * something. Measuring the sentence bank in English — twelve turns, a model
 * that did not write the lines saying whether each reply answered what was said
 * — put the bank's misfit rate at a quarter of the turns it led, against none of
 * the ones the character wrote, and that measurement is why the bank is no
 * longer offered. The only thing stopping the same question being asked of
 * Thai was that nobody wrote the loop.
 *
 * The judge is given the language's own rubric (lib/languageFocus.ts), which is
 * the difference between a reader who knows that Japanese picks politeness on
 * every sentence and one who does not. Without it a judge grades Thai the way
 * it grades English, which is how this whole class of problem started.
 *
 * Read the number as a floor, not a grade. A judge can share a blind spot with
 * the model it is judging, and neither of them is a speaker. What it is good
 * for is comparison — one language against another, one change against the
 * build before it — and for catching the failures that are obvious once named.
 *
 * Run: node --experimental-strip-types scripts/check-conversation-quality.mjs [language]
 *      ... --all      (every language the app teaches)
 *      ... --turns 8  (how many exchanges to judge, default 6)
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { SCENARIOS, findScenario, sentencesFor } from "../src/lib/roleplay/catalog.ts";
import {
  parseDirection,
  recordedLines,
  tutorMessages,
  tutorSystemPrompt,
} from "../src/lib/roleplay/director.ts";
import { targetLanguageFocusHints } from "../src/lib/languageFocus.ts";
import {
  SUPPORTED_LEARNING_LANGUAGES,
  learningLanguageName,
} from "../src/lib/learningLanguages.ts";

const DIRECTOR = process.env.OPENAI_DIRECTOR_MODEL ?? "gpt-4.1-mini";
const JUDGE = process.env.OPENAI_JUDGE_MODEL ?? "gpt-4.1";

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
    // Reported below.
  }
  console.error("No OPENAI_API_KEY, in the environment or in .env.local.");
  process.exit(2);
}

const args = process.argv.slice(2);
const turnsAt = args.indexOf("--turns");
const TURNS = turnsAt === -1 ? 6 : Math.max(1, Number(args[turnsAt + 1]) || 6);
const all = args.includes("--all");
const named = args.find((arg) => !arg.startsWith("--") && arg !== String(TURNS));
const languages = all
  ? SUPPORTED_LEARNING_LANGUAGES.map((one) => one.code)
  : [named ?? "en"];

/**
 * One call, and a second and a third if the network drops it.
 *
 * A sweep of fourteen languages is well over a hundred calls, and the first one
 * died four languages in on a connection reset — taking the four with it. A
 * measurement that cannot survive one dropped packet measures nothing, and the
 * work already done is the expensive part.
 */
async function send(body, attempts = 3) {
  for (let attempt = 1; ; attempt += 1) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey()}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.ok) return await response.json();
      // A refusal is an answer; only a server having a moment is worth asking
      // again. Anything else stops here rather than being asked three times.
      if (response.status < 500 || attempt >= attempts) {
        console.error(`${response.status} ${(await response.text()).slice(0, 200)}`);
        return null;
      }
    } catch (error) {
      if (attempt >= attempts) {
        console.error(`  (gave up after ${attempts}: ${String(error).slice(0, 80)})`);
        return null;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
  }
}

async function ask(model, content, maxTokens = 1200) {
  const body = await send({
    model,
    messages: [{ role: "user", content }],
    response_format: { type: "json_object" },
    max_tokens: maxTokens,
  });
  if (!body) return {};
  return JSON.parse(body.choices?.[0]?.message?.content ?? "{}");
}

/**
 * What a learner would actually say, in the language they are learning.
 *
 * Asked for rather than written, because writing six plausible Thai turns is
 * the thing this whole script exists because nobody here can do. They are asked
 * to carry the mistakes a learner makes, since a turn with nothing wrong in it
 * never exercises the correction.
 */
async function learnerTurns(language) {
  /**
   * Kept, so that two runs are asking the same question.
   *
   * The docstring above says to compare a language against itself before a
   * change, and that was not true of the first version: it wrote new turns
   * every run, so any difference could as easily be the new turns as the
   * change. They are written once per language and reused, and the file is
   * there to be read — a measurement whose inputs nobody can see is a number to
   * take on faith. Delete it to ask a different set.
   */
  const kept = `tmp/quality-turns-${language}.json`;
  if (existsSync(kept)) {
    const saved = JSON.parse(readFileSync(kept, "utf8"));
    if (Array.isArray(saved.turns) && saved.turns.length > 0) return saved.turns.slice(0, TURNS);
  }
  const name = learningLanguageName(language);
  const { turns } = await ask(
    JUDGE,
    `Write ${TURNS} things somebody learning ${name} might say in a relaxed conversation with a friend, in ${name}.

Spread them: answering how their day was, telling a small story, asking the other person something back, saying they do not know, saying something was difficult.

They are a learner, so about half should carry the kind of mistake a learner of ${name} really makes:
${targetLanguageFocusHints(language)}

Reply as JSON only: {"turns": ["...", "..."]}`,
  );
  const written = Array.isArray(turns) ? turns.slice(0, TURNS) : [];
  if (written.length > 0) {
    mkdirSync("tmp", { recursive: true });
    writeFileSync(kept, `${JSON.stringify({ language, turns: written }, null, 2)}
`);
  }
  return written;
}

/** What the character says back, through the real director. */
async function reply(scenario, bank, heard, history) {
  const request = {
    scenarioId: scenario.id,
    nodeId: "talk",
    mode: "free",
    heard,
    history,
    context: "",
    freeTurns: 1,
    directedTurns: 2,
    level: 3,
    targetLanguage: scenario.language,
    nativeLanguage: "ko",
  };
  const recorded = recordedLines(scenario, SCENARIOS, bank);
  // Not through ask(): the director is sent a system brief and the turn as
  // messages, which is the shape being measured. Anything else would be
  // measuring a prompt this app never sends.
  const body = await send({
    model: DIRECTOR,
    messages: [
      { role: "system", content: tutorSystemPrompt({ scenario, bank, recorded, request }) },
      ...tutorMessages(request),
    ],
    response_format: { type: "json_object" },
    max_tokens: 300,
  });
  if (!body) return null;
  const direction = parseDirection(body.choices?.[0]?.message?.content ?? "", {
    scenario,
    bank,
    recordedIds: new Set(recorded.map((line) => line.id)),
    request,
  });
  if (!direction) return null;
  const head = "id" in direction.say ? bank[direction.say.id]?.text ?? "" : direction.say.text;
  const tail = direction.follow ? bank[direction.follow]?.text ?? "" : "";
  return {
    said: [head, tail].filter(Boolean).join(" "),
    better: direction.better ?? "",
    note: direction.note ?? "",
  };
}

async function measure(language) {
  const scenario = findScenario(`open-talk-${language}`);
  if (!scenario) return { language, skipped: "no scene" };
  const bank = sentencesFor(language);
  const name = learningLanguageName(language);

  const turns = await learnerTurns(language);
  if (turns.length === 0) return { language, skipped: "no turns to try" };

  const history = [{ who: "tutor", text: bank["open.hi"]?.text ?? "" }];
  const exchanges = [];
  for (const heard of turns) {
    const answer = await reply(scenario, bank, heard, [
      ...history,
      { who: "learner", text: heard },
    ]);
    if (!answer) continue;
    exchanges.push({ heard, ...answer });
    history.push({ who: "learner", text: heard }, { who: "tutor", text: answer.said });
  }
  if (exchanges.length === 0) return { language, skipped: "the director answered nothing" };

  const { verdicts } = await ask(
    JUDGE,
    `You are reading a conversation between somebody learning ${name} and the character teaching them. You did not write either side.

What goes wrong in ${name} in particular, which is what to judge against:
${targetLanguageFocusHints(language)}

For each exchange say:
- "fits": does the reply respond to what they actually said, with every pronoun referring to something real in their words?
- "inLanguage": is the reply written in ${name}?
- "correction": if a rewrite is given, is it a correct ${name} sentence keeping their meaning? Use "none" when no rewrite was given.

${exchanges
  .map(
    (one, index) =>
      `${index + 1}. them: "${one.heard}"\n   reply: "${one.said}"\n   rewrite: ${one.better ? `"${one.better}"` : "(none)"}`,
  )
  .join("\n")}

Reply as JSON only:
{"verdicts":[{"n":1,"fits":true|false,"inLanguage":true|false,"correction":"right"|"wrong"|"none","why":"<eight words, only when something is false or wrong>"}]}`,
  );

  const rows = exchanges.map((one, index) => ({
    ...one,
    verdict: (verdicts ?? []).find((v) => v.n === index + 1) ?? {},
  }));
  return { language, name, rows };
}

const results = [];
for (const language of languages) {
  const result = await measure(language);
  results.push(result);
  if (result.skipped) {
    console.log(`${language}  — ${result.skipped}`);
    continue;
  }
  const bad = result.rows.filter((row) => row.verdict.fits === false);
  const wrongLanguage = result.rows.filter((row) => row.verdict.inLanguage === false);
  const wrongFix = result.rows.filter((row) => row.verdict.correction === "wrong");
  console.log(
    `${language.padEnd(3)} ${String(result.name).padEnd(11)} ` +
      `${result.rows.length - bad.length}/${result.rows.length} fit` +
      (wrongLanguage.length ? `, ${wrongLanguage.length} not in ${result.name}` : "") +
      (wrongFix.length ? `, ${wrongFix.length} rewrite(s) wrong` : ""),
  );
  for (const row of [...bad, ...wrongLanguage, ...wrongFix]) {
    console.log(`      them:  ${row.heard.slice(0, 48)}`);
    console.log(`      said:  ${row.said.slice(0, 48)}   <- ${row.verdict.why ?? ""}`);
  }
}

const judged = results.filter((one) => !one.skipped);
const rows = judged.flatMap((one) => one.rows);
const fitting = rows.filter((row) => row.verdict.fits !== false).length;
console.log(
  `\n${fitting} of ${rows.length} replies fit, across ${judged.length} language(s).` +
    `\nA floor, not a grade: the judge is not a speaker either, and shares a` +
    `\nmaker with what it judges. Compare it against another language, or` +
    `\nagainst the same language before a change.`,
);
