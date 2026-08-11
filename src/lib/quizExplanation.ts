import { fillQuizBlank } from "@/lib/quizBlank";
import { loadLearningPoints } from "@/lib/learningPoints";
import type { QuizQuestion } from "@/lib/quizSession";

export { fillQuizBlank };

const PREPOSITIONS = new Set([
  "to",
  "for",
  "of",
  "in",
  "on",
  "at",
  "by",
  "with",
  "from",
  "into",
  "onto",
  "about",
]);
const ARTICLES = new Set(["a", "an", "the"]);
const MOTION_VERBS = new Set([
  "go",
  "goes",
  "going",
  "went",
  "gone",
  "come",
  "comes",
  "coming",
  "came",
  "get",
  "gets",
  "getting",
  "got",
]);

function norm(value: string): string {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

function words(value: string): string[] {
  return value.toLowerCase().match(/[a-z']+/g) ?? [];
}

function similarText(a: string, b: string): boolean {
  const na = norm(a);
  const nb = norm(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  const shorter = na.length <= nb.length ? na : nb;
  const longer = na.length <= nb.length ? nb : na;
  if (shorter.length < 10) return false;
  return longer.includes(shorter) && shorter.length / longer.length >= 0.55;
}

function quotedEnglish(explanation: string): string[] {
  const matches = explanation.matchAll(/['"“”‘’]([^'"“”‘’]{4,})['"“”‘’]/g);
  return [...matches]
    .map((m) => m[1]?.trim() ?? "")
    .filter((q) => /[a-z]/i.test(q));
}

export function explanationMatchesLocale(text: string, locale: string): boolean {
  const value = text.trim();
  if (!value) return false;
  if (locale === "ko") return /[가-힣]/.test(value);
  if (locale === "ja") return /[\u3040-\u30ff]/.test(value);
  if (locale === "zh") return /[\u4e00-\u9fff]/.test(value);
  if (locale === "en") return true;
  return !/^[A-Za-z0-9\s'",.:;!?()\-—–/]+$/.test(value);
}

function hasGrammarReason(explanation: string): boolean {
  return /\b(전치사|관사|시제|어순|주어|동사|복수|단수|비교|관계절|접속|가정법|조건문|과거분사|현재완료|과거완료|원형|도치|부정사|동명사|활용|preposition|article|tense|agreement|word order|conditional|participle|infinitive|because|requires|instead)\b/i.test(
    explanation,
  );
}

function isTautologyExplanation(explanation: string): boolean {
  return /기능어예요|이 문법 자리에 맞는|이 구조에 맞지|이 동사\/형용사 뒤에는 전치사|다른 보기는.{0,24}(틀려|맞지|쓸 수 없|어색)|The other options (leave out|do not fit|are wrong)/i.test(
    explanation,
  );
}

export function isShallowQuizExplanation(
  explanation: string,
  correctChoice: string,
  filled: string,
): boolean {
  const text = explanation.trim();
  if (!text) return true;
  if (isTautologyExplanation(text)) return true;
  if (/이 문제에서는 .+가 맞아요\.\s*완성하면/.test(text)) return true;
  if (/그래서 ".+"가 맞고,\s*완성하면/.test(text) && isTautologyExplanation(text)) {
    return true;
  }
  if (/The answer here is ".+"\. The full sentence is/.test(text)) return true;
  if (/En esta pregunta la respuesta es/.test(text)) return true;
  if (/この問題では「.+」が正解です。完成形は/.test(text)) return true;
  if (/这道题的正确答案是/.test(text)) return true;

  const onlyRestatesAnswer =
    text.includes(correctChoice) &&
    (text.includes(filled) || norm(text).includes(norm(filled))) &&
    !hasGrammarReason(text);
  return onlyRestatesAnswer;
}

export function isPastMistakeExplanation(input: {
  explanation: string;
  prompt: string;
  correctChoice: string;
  sourceExplanation?: string;
  originalSentence?: string;
  correctedSentence?: string;
}): boolean {
  const explanation = input.explanation.trim();
  if (!explanation) return true;

  const filled = fillQuizBlank(input.prompt, input.correctChoice);
  const filledN = norm(filled);
  const orig = input.originalSentence || "";
  const corr = input.correctedSentence || "";

  if (
    input.sourceExplanation &&
    norm(explanation) === norm(input.sourceExplanation)
  ) {
    return true;
  }

  for (const quote of quotedEnglish(explanation)) {
    const quoteN = norm(quote);
    const quoteIsThisQuiz =
      quoteN === filledN ||
      (filledN.includes(quoteN) && quoteN.length >= filledN.length * 0.8);
    if (quoteIsThisQuiz) continue;
    if (similarText(quote, orig) || similarText(quote, corr)) return true;
    if (quote.split(/\s+/).length >= 3 && !filledN.includes(quoteN)) return true;
    if (
      filledN.includes(quoteN) &&
      quoteN.length < filledN.length * 0.8 &&
      (/[?]/.test(quote) || quote.split(/\s+/).length >= 4)
    ) {
      return true;
    }
  }

  const expN = norm(explanation);
  if (orig && similarText(expN, orig) && !similarText(orig, filled)) return true;
  if (corr && similarText(expN, corr) && !similarText(corr, filled)) return true;

  return false;
}

const PAST_PARTICIPLES = new Set([
  "known",
  "been",
  "seen",
  "gone",
  "done",
  "taken",
  "given",
  "written",
  "eaten",
  "spoken",
  "broken",
  "chosen",
  "forgotten",
  "grown",
  "shown",
  "thrown",
  "worn",
  "born",
  "become",
  "come",
  "made",
  "said",
  "told",
  "found",
  "left",
  "felt",
  "kept",
  "heard",
  "lost",
  "bought",
  "thought",
  "taught",
  "caught",
  "brought",
]);

function isPastParticiple(word: string): boolean {
  const w = word.toLowerCase();
  return PAST_PARTICIPLES.has(w) || /ed$/.test(w);
}

function grammarReason(
  locale: string,
  prompt: string,
  correct: string,
  filled: string,
): string {
  const ko = locale === "ko";
  const parts = prompt.split(/_{2,}/);
  const before = words(parts[0] ?? "");
  const after = words(parts[1] ?? "");
  const next = after[0] ?? "";
  const correctWords = words(correct);
  const filledWords = words(filled);
  const correctPreps = correctWords.filter((word) => PREPOSITIONS.has(word));
  const correctArticles = correctWords.filter((word) => ARTICLES.has(word));
  const motion = before.some((word) => MOTION_VERBS.has(word));
  const hasIf = filledWords.includes("if");
  const hasWouldHave = /\bwould have\b/i.test(filled);
  const hasWould = /\bwould\b/i.test(filled) && !hasWouldHave;
  const hasWill = /\bwill\b/i.test(filled);

  if (hasIf && hasWouldHave && /^had$/i.test(correct) && isPastParticiple(next)) {
    return ko
      ? `과거에 일어나지 않은 일에 대한 가정(가정법 과거완료)이에요. if절은 had + 과거분사(${next}), 주절은 would have + 과거분사를 씁니다.`
      : `This is a third conditional (imagining a different past). The if-clause takes had + past participle (${next}); the main clause takes would have + past participle.`;
  }
  if (hasIf && hasWouldHave && /^(have|would have)$/i.test(correct)) {
    return ko
      ? `가정법 과거완료의 주절은 would have + 과거분사 형태예요. if절의 had와 짝을 이룹니다.`
      : `In a third conditional, the main clause uses would have + past participle, pairing with had in the if-clause.`;
  }
  if (hasIf && hasWould && /^(were|was|had)$/i.test(correct)) {
    return ko
      ? `현재와 다른 일에 대한 가정(가정법 과거)이에요. if절은 과거형, 주절은 would + 동사원형입니다.`
      : `This is a second conditional. The if-clause uses a past form; the main clause uses would + base verb.`;
  }
  if (hasIf && hasWill) {
    return ko
      ? `일어날 수 있는 미래에 대한 조건문이에요. if절은 현재형, 주절은 will + 동사원형입니다.`
      : `This is a first conditional: present tense in the if-clause, will + base verb in the main clause.`;
  }
  if (
    /^(have|has)$/i.test(correct) &&
    isPastParticiple(next)
  ) {
    return ko
      ? `현재완료예요. have/has 뒤에 과거분사(${next})를 써서 지금까지의 경험을 나타냅니다.`
      : `This is the present perfect: have/has + past participle (${next}).`;
  }
  if (/^had$/i.test(correct) && isPastParticiple(next) && !hasIf) {
    return ko
      ? `과거완료예요. 더 이전의 일을 말할 때 had + 과거분사(${next})를 씁니다.`
      : `This is the past perfect: had + past participle (${next}) for an earlier past event.`;
  }
  if (motion && correctPreps.includes("to") && correctArticles.includes("the")) {
    return ko
      ? `go/went처럼 이동을 나타내는 동사 뒤에는 장소 앞에 전치사 to가 필요하고, 특정한 장소에는 the를 붙입니다.`
      : `After a motion verb like go/went, a destination needs to, and a specific place usually takes the.`;
  }
  if (motion && correctPreps.includes("to")) {
    return ko
      ? `go/went 다음에는 목적지 앞에 전치사 to를 씁니다.`
      : `After go/went, a destination is introduced with to.`;
  }
  if (correctArticles.length === 1 && correctWords.length === 1) {
    const article = correctArticles[0];
    if (article === "an") {
      return ko
        ? `다음에 오는 단어가 모음 소리로 시작해서 관사는 an을 씁니다.`
        : `Use an before a vowel sound.`;
    }
    if (article === "a") {
      return ko
        ? `다음에 오는 단어가 자음 소리로 시작해서 관사는 a를 씁니다.`
        : `Use a before a consonant sound.`;
    }
    return ko
      ? `이미 정해진 대상을 가리킬 때는 정관사 the를 씁니다.`
      : `Use the for a specific, already identified noun.`;
  }
  if (/\?/.test(prompt) && /^(what|how|where|when|why|who)\b/i.test(correct)) {
    return ko
      ? `의문문은 의문사 다음에 조동사/동사가 오고 그다음 주어가 옵니다.`
      : `In a question, the question word is followed by the auxiliary/verb, then the subject.`;
  }
  if (
    before.some((word) => /^(what|how|where|when|why|who)$/.test(word)) &&
    /^(should|can|could|would|will|do|does|did|is|are|was|were)$/i.test(correct)
  ) {
    return ko
      ? `의문문에서는 의문사 뒤에 조동사가 오고, 주어는 그 뒤에 옵니다. 평서문 어순(주어+동사)이 아닙니다.`
      : `After a question word, put the auxiliary before the subject — not statement word order.`;
  }
  if (/\byesterday|last |ago\b/i.test(prompt) && /ed$|went|was|were|did|had/.test(correct)) {
    return ko
      ? `yesterday/last/ago처럼 과거 시점이 있으면 동사는 과거형이 와야 해요.`
      : `Time words like yesterday/last/ago require a past-tense verb.`;
  }
  if (
    /^for$/i.test(correct) &&
    /\b(\d+|hours?|days?|weeks?|months?|years?|minutes?|seconds?)\b/i.test(
      `${prompt} ${filled}`,
    )
  ) {
    return ko
      ? `기간(몇 시간/며칠 등)을 말할 때는 전치사 for를 씁니다. since는 시작 시점에 씁니다.`
      : `Use for with a duration (how long). Use since with a starting point.`;
  }
  if (hasIf && /^(am|is|are|do|does|have|has|know|think|go|want)$/i.test(correct)) {
    return ko
      ? `일반적인 조건문에서는 if 뒤에 현재형을 씁니다. if절에 will을 쓰지 않습니다.`
      : `In a regular conditional, use the present tense after if — not will.`;
  }
  if (/\bwait(ing|ed|s)?\b/i.test(prompt) && /^for$/i.test(correct)) {
    return ko
      ? `"wait for + 사람/대상"은 '~을 기다리다'라는 뜻이에요. wait about는 이 의미로 쓰지 않습니다.`
      : `"wait for + person/thing" means to wait until they arrive. "wait about" is not used this way.`;
  }
  if (/\bdo\b/i.test(before.join(" ")) && /^with$/i.test(correct)) {
    return ko
      ? `"do with ~"는 어떤 대상이나 상황을 어떻게 처리할지/어떻게 해나갈지를 물을 때 써요. "What should I do with this?"처럼요.`
      : `"do with ~" asks how to handle or use something, as in "What should I do with this?"`;
  }
  if (/\bdo\b/i.test(before.join(" ")) && /^for$/i.test(correct)) {
    return ko
      ? `"do for ~"는 누군가를 위해, 또는 미래를 위해 무엇을 할 수 있는지를 물을 때 써요.`
      : `"do for ~" asks what you can do to help someone or to benefit a goal.`;
  }
  if (correctPreps.length > 0 && correctWords.length <= 3) {
    return ko
      ? `이 문장에서는 "${correct}"가 동사와 뒤에 오는 말을 잇는 전치사예요. 이 조합이 여기서 필요한 의미를 만듭니다.`
      : `In this sentence, "${correct}" is the preposition that creates the intended meaning with the verb.`;
  }

  if (ko) {
    if (hasIf) {
      return `if가 있는 조건/가정 문장이에요. 빈칸은 if절의 시제(had/과거형/현재형)를 주절의 would/will과 맞춰야 합니다.`;
    }
    return `완성된 문장 "${filled}"의 시제·전치사·어순이 이 문법 자리에 맞습니다.`;
  }
  if (hasIf) {
    return `This is a conditional. The blank must match the if-clause tense to would/will in the main clause.`;
  }
  return `The completed sentence "${filled}" uses the tense, preposition, or word order required in this slot.`;
}

export function fallbackQuizExplanation(
  locale: string,
  prompt: string,
  correctChoice: string,
  choices: string[] = [],
  correctIndex = 0,
): string {
  const filled = fillQuizBlank(prompt, correctChoice);
  return grammarReason(locale, prompt, correctChoice, filled);
}

export function sanitizeQuizExplanation(input: {
  explanation: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  locale: string;
  sourceExplanation?: string;
  originalSentence?: string;
  correctedSentence?: string;
}): string {
  const correctChoice =
    input.choices[input.correctIndex] ?? input.choices[0] ?? "";
  const filled = fillQuizBlank(input.prompt, correctChoice);
  const pastMistake = isPastMistakeExplanation({
    explanation: input.explanation,
    prompt: input.prompt,
    correctChoice,
    sourceExplanation: input.sourceExplanation,
    originalSentence: input.originalSentence,
    correctedSentence: input.correctedSentence,
  });
  const shallow = isShallowQuizExplanation(
    input.explanation,
    correctChoice,
    filled,
  );

  const wrongLanguage = !explanationMatchesLocale(
    input.explanation,
    input.locale,
  );

  if (pastMistake || shallow || wrongLanguage) {
    return fallbackQuizExplanation(
      input.locale,
      input.prompt,
      correctChoice,
      input.choices,
      input.correctIndex,
    );
  }
  return input.explanation.trim();
}

export function explanationForQuizQuestion(
  question: Pick<
    QuizQuestion,
    "explanation" | "prompt" | "choices" | "correctIndex" | "sourceId"
  >,
  locale: string,
): string {
  let sourceExplanation = "";
  let originalSentence = "";
  let correctedSentence = "";
  if (question.sourceId) {
    const point = loadLearningPoints().find((p) => p.id === question.sourceId);
    if (point) {
      sourceExplanation = point.explanation;
      originalSentence = point.originalSentence;
      correctedSentence = point.correctedSentence;
    }
  }
  return sanitizeQuizExplanation({
    explanation: question.explanation,
    prompt: question.prompt,
    choices: question.choices,
    correctIndex: question.correctIndex,
    locale,
    sourceExplanation,
    originalSentence,
    correctedSentence,
  });
}

function localizedNote(text: string | undefined, locale: string): string {
  const value = text?.trim() ?? "";
  if (!value) return "";
  return explanationMatchesLocale(value, locale) ? value : "";
}

export function displayQuizFeedback(
  question: QuizQuestion,
  locale: string,
  selectedIndex: number | null,
): { reason: string; selectedNote: string; example: string } {
  const reason = explanationForQuizQuestion(question, locale);
  const selectedNote =
    selectedIndex != null && selectedIndex !== question.correctIndex
      ? localizedNote(question.choiceNotes?.[selectedIndex], locale)
      : "";
  return {
    reason,
    selectedNote,
    example: (question.example || "").trim(),
  };
}
