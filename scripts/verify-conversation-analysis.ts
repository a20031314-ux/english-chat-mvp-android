import {
  analysisTalksAboutTutor,
  buildHeuristicConversationAnalysis,
  extractAnalysisTurns,
  normalizeConversationAnalysis,
  type ConversationInsight,
} from "../src/lib/conversationAnalysis.ts";

function asMessages(lines: string[]) {
  const messages = [];
  let id = 1;
  for (const user of lines) {
    messages.push({
      id: `u${id}`,
      role: "user" as const,
      content: user,
      createdAt: id,
    });
    messages.push({
      id: `a${id}`,
      role: "assistant" as const,
      content: JSON.stringify({
        assistantMessage: "What are you planning to study?",
      }),
      createdAt: id,
    });
    id += 1;
  }
  return messages;
}

let failed = 0;
function check(label: string, ok: boolean) {
  console.log(`${ok ? "OK  " : "FAIL"} ${label}`);
  if (!ok) failed += 1;
}

const jobChat = asMessages([
  "I've been thinking about changing my job.",
  "I think changing jobs would be better.",
  "I think I want something new.",
  "I think it depends on the salary.",
]);

const naturalChat = asMessages([
  "I haven't really thought about it that way.",
  "I'm not sure I completely agree.",
  "but I still haven't decided yet.",
]);

const shortChat = asMessages(["I like traveling.", "Yes."]);

const reactChat = asMessages([
  "That sounds like great advice! Taking breaks can really help with focus.",
  "I usually take a short walk when I feel tired.",
]);

const job = buildHeuristicConversationAnalysis(jobChat, "ko");
const natural = buildHeuristicConversationAnalysis(naturalChat, "ko");
const short = buildHeuristicConversationAnalysis(shortChat, "ko");
const react = buildHeuristicConversationAnalysis(reactChat, "ko");

const allInsights: ConversationInsight[] = [
  ...job.insights,
  ...natural.insights,
  ...short.insights,
];

check(
  "1. finds a real strong phrase (I've been thinking)",
  job.insights.some((item) =>
    (item.evidence || "").includes("I've been thinking"),
  ),
);

check(
  "2. analyzes nuance/tone/natural on natural lines",
  natural.insights.some((item) =>
    ["NUANCE", "NATURAL", "TONE", "CONNECTION"].includes(item.category),
  ),
);

check(
  "3. does not repeat grammar-correction language",
  !allInsights.some((item) =>
    /틀렸|오류|교정|incorrect|grammar error/i.test(item.analysis),
  ),
);

check(
  "4. not just abstract praise — title + evidence + analysis",
  job.insights.every(
    (item) => item.title.length > 12 && item.evidence && item.analysis.length > 20,
  ),
);

const jobLines = [
  "I've been thinking about changing my job.",
  "I think changing jobs would be better.",
  "I think I want something new.",
  "I think it depends on the salary.",
];
check(
  "5. evidence comes from learner lines",
  job.insights.every((item) => !item.evidence || jobLines.includes(item.evidence)),
);

check(
  "6. next goal has title + pattern + example",
  Boolean(job.nextGoal?.title && job.nextGoal.pattern && job.nextGoal.example),
);

check(
  "7. does not overclaim native-like on 'I like traveling'",
  !short.insights.some((item) =>
    /원어민스러운 고급|native-like advanced|아주 원어민/i.test(
      `${item.title} ${item.analysis}`,
    ),
  ),
);

const fakeAi = normalizeConversationAnalysis(
  {
    insights: [
      {
        category: "CONVERSATION",
        sentiment: "improvement",
        title: "질문 반복",
        evidence: "What are you planning to study?",
        analysis: "AI가 질문을 통해 대화를 이어갔어요.",
      },
      {
        category: "NUANCE",
        sentiment: "positive",
        title: "고민의 뉘앙스",
        evidence: "I've been thinking about changing my job.",
        analysis: "I've been thinking about ~ 로 고민 중이라는 느낌이 나요.",
      },
    ],
    nextGoal: {
      title: "이유 붙이기",
      body: "because로 이유를 붙여 보세요.",
      pattern: "I think ___ because ___.",
      example:
        "I think working from home is better because I can concentrate more easily.",
    },
  },
  extractAnalysisTurns(jobChat),
);

check(
  "extra. drops tutor-centered / tutor-quoted insights",
  Boolean(
    fakeAi &&
      !analysisTalksAboutTutor(fakeAi) &&
      fakeAi.insights.every(
        (item) => item.evidence !== "What are you planning to study?",
      ),
  ),
);

check(
  "extra. short chat explains limited data instead of inventing habits",
  Boolean(short.shortConversationNote),
);

check(
  "extra. reaction line gets insight cards, not an empty analysis",
  react.insights.length >= 2 &&
    react.insights.some((item) =>
      (item.evidence || "").includes("That sounds like great advice"),
    ),
);

const thin = normalizeConversationAnalysis(
  {
    insights: [],
    nextGoal: {
      title: "Improve Sentence Structure",
      body: "Focus on using correct verb forms and varying your sentence structures.",
      pattern: "I realized ___ when ___",
      example: "I realized I forgot my wallet when I got to the checkout.",
    },
  },
  extractAnalysisTurns(reactChat),
);
check(
  "extra. rejects next-goal-only / grammar-goal analysis",
  thin === null,
);

console.log("\n--- sample: job chat ---");
for (const item of job.insights) {
  console.log(`- [${item.category}/${item.sentiment}] ${item.title}`);
  console.log(`  ${item.evidence}`);
}
console.log("nextGoal:", job.nextGoal?.title, "→", job.nextGoal?.example);

if (failed > 0) {
  process.exit(1);
}
