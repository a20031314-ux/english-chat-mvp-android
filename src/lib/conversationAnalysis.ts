import type { ChatMessage } from "@/components/ArchivePanel";
import type { Locale } from "@/lib/copy";

export const ANALYSIS_CATEGORIES = [
  "NATURAL",
  "NUANCE",
  "WORD_CHOICE",
  "TONE",
  "FLOW",
  "VARIETY",
  "CONNECTION",
  "EXPRESSION",
  "CONVERSATION",
  "IMPROVEMENT",
] as const;

export type AnalysisCategory = (typeof ANALYSIS_CATEGORIES)[number];
export type AnalysisSentiment = "positive" | "improvement";

export type ConversationInsight = {
  category: AnalysisCategory;
  sentiment: AnalysisSentiment;
  title: string;
  evidence?: string;
  analysis: string;
  suggestion?: string;
  example?: string;
};

export type ConversationNextGoal = {
  title: string;
  body: string;
  pattern?: string;
  example?: string;
};

export type ConversationAnalysis = {
  insights: ConversationInsight[];
  nextGoal?: ConversationNextGoal;
  shortConversationNote?: string;
};

export type AnalysisTurn = {
  user: string;
  assistant?: string;
};

/** Bump when stored analysis must be rebuilt. */
export const CONVERSATION_ANALYSIS_VERSION = 4;

const MIN_TURNS_FOR_PATTERN = 3;
const MIN_REPEAT_FOR_HABIT = 3;
const CATEGORY_SET = new Set<string>(ANALYSIS_CATEGORIES);

function t(locale: Locale, map: { en: string } & Partial<Record<Locale, string>>) {
  return map[locale] ?? map.en;
}

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function isQuestion(text: string) {
  return (
    /[?？]/.test(text) ||
    /^(what|why|how|where|when|who|which|do|does|did|are|is|was|were|can|could|would|will)\b/i.test(
      text.trim(),
    )
  );
}

export function extractAnalysisTurns(messages: ChatMessage[]): AnalysisTurn[] {
  const turns: AnalysisTurn[] = [];
  let pending: ChatMessage | null = null;

  for (const message of messages) {
    if (message.role === "user") {
      pending = message;
      continue;
    }
    if (!pending) continue;

    if (message.role === "assistant") {
      let assistant = "";
      try {
        const parsed = JSON.parse(message.content) as {
          assistantMessage?: string;
        };
        assistant = parsed.assistantMessage || "";
      } catch {
        assistant = message.content;
      }
      const user = pending.content.trim();
      if (user) {
        turns.push({ user, assistant: assistant.trim() });
      }
      pending = null;
      continue;
    }

    if (message.role === "helper") {
      pending = null;
    }
  }

  return turns;
}

export function nextGoalText(goal: ConversationNextGoal | undefined): string {
  if (!goal) return "";
  return [goal.title, goal.body, goal.pattern, goal.example]
    .filter(Boolean)
    .join(" ");
}

export function hasConversationAnalysisContent(
  analysis: ConversationAnalysis | undefined,
): boolean {
  if (!analysis) return false;
  return Boolean(
    analysis.insights.length ||
      nextGoalText(analysis.nextGoal).trim() ||
      analysis.shortConversationNote?.trim(),
  );
}

function stripCoachMeta(text: string) {
  return text
    .replace(/\bLEARNER\b/gi, "")
    .replace(/\bUSER\b/gi, "")
    .replace(/\bTUTOR\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function normalizeQuote(text: string) {
  return text.toLowerCase().replace(/[“”"'‘’]/g, "").replace(/\s+/g, " ").trim();
}

function findUserLine(candidate: string, userTexts: string[]): string | undefined {
  if (!candidate.trim()) return undefined;
  const needle = normalizeQuote(candidate);
  const exact = userTexts.find((text) => {
    const hay = normalizeQuote(text);
    return hay === needle || hay.includes(needle) || needle.includes(hay);
  });
  if (exact) return exact;

  const words = needle.split(" ").filter((word) => word.length > 2);
  if (words.length < 3) return undefined;
  return userTexts.find((text) => {
    const hay = normalizeQuote(text);
    for (let i = 0; i <= words.length - 3; i += 1) {
      if (hay.includes(words.slice(i, i + 3).join(" "))) return true;
    }
    return false;
  });
}

function evidenceFromQuotes(analysis: string, userTexts: string[]): string | undefined {
  const quotes = [...analysis.matchAll(/[“"']([^”"']{4,})[”"']/g)].map(
    (match) => match[1],
  );
  for (const quote of quotes) {
    const hit = findUserLine(quote, userTexts);
    if (hit) return hit;
  }
  return undefined;
}

function isWeakNextGoal(goal: ConversationNextGoal | undefined): boolean {
  if (!goal) return true;
  return /verb form|sentence structure|문법|시제|동사 형태|correct verb|clarity and engagement|improve sentence structure/i.test(
    nextGoalText(goal),
  );
}

function countMatches(texts: string[], re: RegExp) {
  return texts.filter((text) => re.test(text)).length;
}

function pickMatchingLine(texts: string[], re: RegExp): string | undefined {
  return texts.find((text) => re.test(text));
}

function pickShortOpinion(texts: string[]): string | undefined {
  return texts
    .filter((text) => wordCount(text) <= 8 && !/\bbecause\b/i.test(text))
    .sort((a, b) => wordCount(a) - wordCount(b))[0];
}

function expandForCoaching(original: string): string {
  const trimmed = original.replace(/[.!?]+$/, "").trim();
  const like = trimmed.match(/^I like (.+)$/i);
  if (like) {
    return `I like ${like[1]}, especially because I enjoy discovering new things about it.`;
  }
  const think = trimmed.match(/^I think (.+)$/i);
  if (think) {
    return `I think ${think[1]}, because I want to experience something new.`;
  }
  return `${trimmed}, because it matters to me and I’d like to share a bit more.`;
}

export function buildHeuristicConversationAnalysis(
  messages: ChatMessage[],
  locale: Locale,
): ConversationAnalysis {
  const turns = extractAnalysisTurns(messages);
  const userTexts = turns.map((turn) => turn.user);
  const turnCount = userTexts.length;
  const avgWords =
    turnCount === 0
      ? 0
      : userTexts.reduce((sum, text) => sum + wordCount(text), 0) / turnCount;
  const shortCount = userTexts.filter((text) => wordCount(text) <= 5).length;
  const shortRatio = turnCount ? shortCount / turnCount : 0;
  const questionLines = userTexts.filter(isQuestion);
  const becauseLine = pickMatchingLine(userTexts, /\bbecause\b/i);
  const thinkingLine = pickMatchingLine(
    userTexts,
    /\bi've been thinking\b|\bi have been thinking\b/i,
  );
  const reallyLine = pickMatchingLine(
    userTexts,
    /\bhaven't really\b|\bi really\b.*\bthat way\b/i,
  );
  const dependsLine = pickMatchingLine(userTexts, /\bit depends\b/i);
  const notSureLine = pickMatchingLine(userTexts, /\bi'm not sure\b|\bi am not sure\b/i);
  const stillLine = pickMatchingLine(userTexts, /\bbut\b.*\bstill\b|\bstill haven't\b/i);
  const iThinkCount = countMatches(userTexts, /^i think\b/i);
  const iThinkLine = pickMatchingLine(userTexts, /^i think\b/i);
  const soundsLine = pickMatchingLine(
    userTexts,
    /\bthat sounds\b|\bsounds like\b|\bsounds good\b/i,
  );
  const reallyHelpLine = pickMatchingLine(
    userTexts,
    /\breally help\b|\bhelps? with\b/i,
  );
  const reactLine = pickMatchingLine(
    userTexts,
    /\bi agree\b|\bthat's a good\b|\bgood point\b|\bmakes sense\b|\bgreat advice\b/i,
  );
  const insights: ConversationInsight[] = [];

  if (soundsLine || reactLine) {
    const evidence = soundsLine || reactLine || "";
    insights.push({
      category: "NATURAL",
      sentiment: "positive",
      title: t(locale, {
        ko: "상대 말에 자연스럽게 반응한 뒤 생각을 보탰어요",
        en: "You reacted naturally, then added your own thought",
        es: "Reaccionaste con naturalidad y luego sumaste tu idea",
      }),
      evidence,
      analysis: t(locale, {
        ko: "“That sounds like ~”나 “great advice”처럼 먼저 받아 준 다음, 자기 생각(휴식이 집중에 도움이 된다)을 이어서 말했어요. 실제 대화에서 자주 쓰는 반응 방식입니다.",
        en: "You first acknowledged the other person (“That sounds like…”, “great advice”) and then added your own point. That’s how everyday conversation usually moves.",
        es: "Primero reconociste lo que dijo la otra persona y luego añadiste tu idea. Así suele avanzar una conversación real.",
      }),
    });
  }

  if (reallyHelpLine) {
    insights.push({
      category: "WORD_CHOICE",
      sentiment: "positive",
      title: t(locale, {
        ko: "도움을 구체적으로 말하는 표현을 썼어요",
        en: "You named the benefit in a natural way",
        es: "Nombraste el beneficio de forma natural",
      }),
      evidence: reallyHelpLine,
      analysis: t(locale, {
        ko: "“really help with focus”처럼 help with + 명사를 써서, 막연히 좋다기보다 ‘어디에 도움이 되는지’가 분명해졌어요.",
        en: "“Help with focus” makes the benefit specific, not just “it’s good.”",
        es: "“Help with focus” concreta el beneficio, no solo “está bien”.",
      }),
    });
  }

  if (thinkingLine) {
    insights.push({
      category: "NUANCE",
      sentiment: "positive",
      title: t(locale, {
        ko: "고민하고 있다는 뉘앙스를 자연스럽게 전달했어요",
        en: "You naturally showed that you’re still thinking it through",
        es: "Mostraste con naturalidad que lo sigues pensando",
      }),
      evidence: thinkingLine,
      analysis: t(locale, {
        ko: "“I've been thinking about ~”을 써서, 당장 결정했다기보다 최근까지 계속 고민해 왔다는 느낌이 잘 살았어요. “I want to ~”보다 한 단계 부드러운 표현입니다.",
        en: "“I've been thinking about ~” sounds like an ongoing thought, not a final decision. That’s softer and more precise than “I want to ~”.",
        es: "“I've been thinking about ~” suena a algo que sigues pensando, no a una decisión ya tomada.",
      }),
    });
  }

  if (reallyLine) {
    insights.push({
      category: "NATURAL",
      sentiment: "positive",
      title: t(locale, {
        ko: "실제 대화에서도 자연스럽게 쓰이는 표현이에요",
        en: "This is a phrasing people actually use in conversation",
        es: "Esta es una formulación que se usa de verdad en conversación",
      }),
      evidence: reallyLine,
      analysis: t(locale, {
        ko: "“really”나 “that way” 같은 말을 붙여, 단순히 생각 안 했다는 뜻이 아니라 ‘그런 관점으로는 깊게 생각해 본 적이 없다’는 뉘앙스가 났어요.",
        en: "Words like “really” and “that way” add a conversational shade: not just “I didn’t think that,” but “I hadn’t looked at it from that angle.”",
        es: "Palabras como “really” o “that way” dan un matiz conversacional, no solo “no lo pensé”.",
      }),
    });
  }

  if (dependsLine) {
    insights.push({
      category: "WORD_CHOICE",
      sentiment: "positive",
      title: t(locale, {
        ko: "조건을 열어 두는 표현을 잘 골랐어요",
        en: "You chose a phrase that leaves room for conditions",
        es: "Elegiste una frase que deja espacio a las condiciones",
      }),
      evidence: dependsLine,
      analysis: t(locale, {
        ko: "“It depends”는 단정하지 않고 상황에 따라 다르다는 뜻을 짧게 전하는 회화 표현이에요.",
        en: "“It depends” is a compact spoken way to say the answer changes with the situation.",
        es: "“It depends” es una forma breve y hablada de decir que cambia según la situación.",
      }),
    });
  }

  if (notSureLine) {
    insights.push({
      category: "TONE",
      sentiment: "positive",
      title: t(locale, {
        ko: "단정을 피하는 부드러운 말투를 썼어요",
        en: "You used a softer tone instead of sounding final",
        es: "Usaste un tono más suave, no tan definitivo",
      }),
      evidence: notSureLine,
      analysis: t(locale, {
        ko: "“I'm not sure”는 반대하거나 망설일 때 너무 세게 들리지 않게 해 주는 표현이에요.",
        en: "“I'm not sure” lets you hesitate or disagree without sounding blunt.",
        es: "“I'm not sure” permite dudar o discrepar sin sonar brusco.",
      }),
    });
  }

  if (stillLine) {
    insights.push({
      category: "CONNECTION",
      sentiment: "positive",
      title: t(locale, {
        ko: "대비를 자연스럽게 이었어요",
        en: "You connected two ideas with a natural contrast",
        es: "Conectaste dos ideas con un contraste natural",
      }),
      evidence: stillLine,
      analysis: t(locale, {
        ko: "“but”과 “still”을 같이 써서, 앞에서 말한 상황과 ‘아직 그대로’인 결과를 한 문장 안에서 연결했어요.",
        en: "“But” plus “still” links what happened with what hasn’t changed yet.",
        es: "“But” y “still” unen lo que pasó con lo que todavía no ha cambiado.",
      }),
    });
  }

  if (becauseLine) {
    insights.push({
      category: "FLOW",
      sentiment: "positive",
      title: t(locale, {
        ko: "의견 뒤에 이유를 붙여 대화를 이어갔어요",
        en: "You kept the thought going with a reason",
        es: "Seguiste la idea con una razón",
      }),
      evidence: becauseLine,
      analysis: t(locale, {
        ko: "“because”로 이유를 이어서, 한 줄로 끝내지 않고 생각을 한 단계 더 보여 줬어요.",
        en: "“Because” turns a short opinion into a fuller turn.",
        es: "“Because” convierte una opinión corta en un turno más completo.",
      }),
    });
  }

  if (questionLines.length >= 2) {
    insights.push({
      category: "CONVERSATION",
      sentiment: "positive",
      title: t(locale, {
        ko: "질문을 던져 대화를 직접 이끌었어요",
        en: "You steered the conversation with your own questions",
        es: "Dirigiste la conversación con tus propias preguntas",
      }),
      evidence: questionLines[0],
      analysis: t(locale, {
        ko: `당신이 질문을 ${questionLines.length}번 던졌어요. 상대 질문에만 답하지 않고 주제를 이어 가는 쪽에 가까워요.`,
        en: `You asked ${questionLines.length} questions, so you weren’t only answering — you moved the topic forward.`,
        es: `Hiciste ${questionLines.length} preguntas: no solo respondiste, también avanzaste el tema.`,
      }),
    });
  }

  if (turnCount >= MIN_TURNS_FOR_PATTERN && shortRatio >= 0.5) {
    const sample = pickShortOpinion(userTexts);
    if (sample) {
      insights.push({
        category: "FLOW",
        sentiment: "improvement",
        title: t(locale, {
          ko: "의견에서 한 단계 더 이어가 보세요",
          en: "Take the idea one step further",
          es: "Lleva la idea un paso más allá",
        }),
        evidence: sample,
        analysis: t(locale, {
          ko: "핵심은 잘 전달했지만 한 문장에서 끝나는 답이 많았어요. 틀린 문장은 아니고, 이유나 경험을 한 줄 더 붙이면 대화가 훨씬 풍부해집니다.",
          en: "The point came through, but many replies stopped after one short line. That’s not wrong — one extra reason or example would make the turn richer.",
          es: "Se entendió la idea, pero muchas respuestas se quedaron en una frase. No está mal: una razón extra lo haría más rico.",
        }),
        suggestion: t(locale, {
          ko: "의견 뒤에 because로 이유를 붙여 보세요.",
          en: "After an opinion, add a reason with “because”.",
          es: "Después de una opinión, añade una razón con “because”.",
        }),
        example: expandForCoaching(sample),
      });
    }
  } else if (
    turnCount >= MIN_TURNS_FOR_PATTERN &&
    questionLines.length === 0
  ) {
    const sample = userTexts.find((text) => wordCount(text) >= 3) || userTexts[0];
    insights.push({
      category: "CONVERSATION",
      sentiment: "improvement",
      title: t(locale, {
        ko: "당신이 주제를 한 번 이끌어 보세요",
        en: "Try taking the lead once",
        es: "Prueba a tomar tú la iniciativa",
      }),
      evidence: sample,
      analysis: t(locale, {
        ko: "이번엔 주로 답을 하는 흐름이었어요. 답을 한 뒤 질문을 하나 던지면 대화를 이끄는 쪽이 됩니다.",
        en: "This time you mostly answered. One question after your reply puts you in the lead.",
        es: "Esta vez casi solo respondiste. Una pregunta después de tu respuesta te pone al frente.",
      }),
      suggestion: t(locale, {
        ko: "답 뒤에 How about you?처럼 후속 질문을 붙여 보세요.",
        en: "After you answer, add a follow-up like “How about you?”",
        es: "Después de responder, añade algo como “How about you?”",
      }),
      example: "That sounds good to me. How about you?",
    });
  }

  if (iThinkCount >= MIN_REPEAT_FOR_HABIT && iThinkLine) {
    insights.push({
      category: "VARIETY",
      sentiment: "improvement",
      title: t(locale, {
        ko: "비슷한 의견 표현이 반복되고 있어요",
        en: "The same opinion opener is showing up a lot",
        es: "Se repite mucho el mismo inicio para opinar",
      }),
      evidence: iThinkLine,
      analysis: t(locale, {
        ko: `이번 대화에서 “I think...”로 시작한 문장이 ${iThinkCount}번 있었어요. 틀린 표현은 아니지만, 같은 틀만 쓰면 말투가 단조로워질 수 있어요.`,
        en: `You started with “I think...” ${iThinkCount} times. It’s not wrong, but mixing openers keeps the tone from going flat.`,
        es: `Empezaste con “I think...” ${iThinkCount} veces. No está mal, pero mezclar inicios evita que suene plano.`,
      }),
      suggestion: t(locale, {
        ko: "다음엔 I feel like / Personally / From my perspective를 한 번 섞어 보세요.",
        en: "Next time, mix in “I feel like,” “Personally,” or “From my perspective.”",
        es: "La próxima, mezcla “I feel like”, “Personally” o “From my perspective”.",
      }),
      example: "I feel like a change would be good for me right now.",
    });
  }

  const positives = insights.filter((item) => item.sentiment === "positive");
  if (
    positives.length === 0 &&
    avgWords >= 9 &&
    turnCount >= 2
  ) {
    const sample =
      [...userTexts].sort((a, b) => wordCount(b) - wordCount(a))[0];
    if (sample && wordCount(sample) >= 8) {
      insights.unshift({
        category: "EXPRESSION",
        sentiment: "positive",
        title: t(locale, {
          ko: "생각을 문장으로 풀어냈어요",
          en: "You put the thought into a full sentence",
          es: "Pasaste la idea a una frase completa",
        }),
        evidence: sample,
        analysis: t(locale, {
          ko: "짧은 맞장구로 끝내지 않고, 하고 싶은 말을 문장으로 전달했어요. 기본 문장이지만 대화에서는 이런 완결된 답이 도움이 됩니다.",
          en: "You didn’t stop at a short yes/no — you finished the idea in a full sentence. Simple, but useful in a real chat.",
          es: "No te quedaste en un sí/no: cerraste la idea en una frase. Simple, pero útil.",
        }),
      });
    }
  }

  let nextGoal: ConversationNextGoal | undefined;
  if (iThinkCount >= MIN_REPEAT_FOR_HABIT) {
    nextGoal = {
      title: t(locale, {
        ko: "I think 대신 다른 의견 표현을 한 번 써 보기",
        en: "Use a different opinion opener once",
        es: "Usa una vez otro inicio para opinar",
      }),
      body: t(locale, {
        ko: "다음 대화에서는 같은 뜻을 I feel like나 Personally로도 말해 보세요.",
        en: "In the next chat, say the same kind of opinion with “I feel like” or “Personally.”",
        es: "En la próxima conversación, di la misma opinión con “I feel like” o “Personally”.",
      }),
      pattern: "I feel like ___ / Personally, ___.",
      example: "Personally, I prefer working in the morning.",
    };
  } else if (turnCount >= MIN_TURNS_FOR_PATTERN && questionLines.length === 0) {
    nextGoal = {
      title: t(locale, {
        ko: "답을 한 뒤 후속 질문 한 번 던지기",
        en: "After you answer, ask one follow-up",
        es: "Después de responder, haz una pregunta",
      }),
      body: t(locale, {
        ko: "자신의 답을 말한 다음, 상대에게 질문을 하나 붙여 대화를 이끌어 보세요.",
        en: "Give your answer, then add one question so you take the lead.",
        es: "Da tu respuesta y luego añade una pregunta para tomar la iniciativa.",
      }),
      pattern: "I ___. How about you?",
      example: "I usually study at night. How about you?",
    };
  } else if (turnCount >= 1) {
    nextGoal = {
      title: t(locale, {
        ko: "의견 뒤에 이유 한 문장 붙이기",
        en: "Add one reason after an opinion",
        es: "Añade una razón después de una opinión",
      }),
      body: t(locale, {
        ko: "다음 대화에서는 생각을 말한 뒤, 왜 그렇게 생각하는지도 한 문장 더 이야기해 보세요.",
        en: "Next time, after you share an opinion, add one sentence about why.",
        es: "La próxima, después de opinar, añade una frase sobre el porqué.",
      }),
      pattern: "I think ___ because ___.",
      example:
        "I think working from home is better because I can concentrate more easily.",
    };
  }

  const shortConversationNote =
    turnCount < MIN_TURNS_FOR_PATTERN
      ? t(locale, {
          ko: "아직 대화가 짧아서 반복되는 표현 습관을 판단하기 어려워요. 조금 더 대화하면 사용 패턴을 분석할 수 있어요.",
          en: "This chat is still short, so it’s hard to judge repeating habits. A little more conversation will make the pattern clearer.",
          es: "La conversación aún es corta para juzgar hábitos. Un poco más de diálogo permitirá ver el patrón.",
        })
      : undefined;

  return {
    insights: insights.slice(0, 5),
    nextGoal,
    shortConversationNote,
  };
}

function isTutorCentered(text: string): boolean {
  const value = text.trim();
  if (!value) return false;
  return (
    /AI\s*[가도는의를은를]/i.test(value) ||
    /AI\s*(asked|asks|is asking|keeps|kept|continued|continues|replied|replies)/i.test(
      value,
    ) ||
    /\bthe AI\b/i.test(value) ||
    /\bthe tutor\b/i.test(value) ||
    /\bthe assistant\b/i.test(value) ||
    /튜터[가는도를의은를]/.test(value) ||
    /어시스턴트[가는도를의은를]/.test(value) ||
    /챗봇[가는도를의은를]/.test(value)
  );
}

function matchesAssistantLine(text: string, assistantTexts: string[]): boolean {
  const needle = text
    .toLowerCase()
    .replace(/[“”"'‘’]/g, "")
    .trim();
  if (!needle || needle.length < 8) return false;
  return assistantTexts.some((assistant) => {
    const hay = assistant.toLowerCase();
    return hay.includes(needle) || needle.includes(hay.slice(0, 48));
  });
}

function insightTexts(item: ConversationInsight): string[] {
  return [
    item.title,
    item.analysis,
    item.evidence || "",
    item.suggestion || "",
    item.example || "",
  ];
}

export function analysisTalksAboutTutor(
  analysis: ConversationAnalysis | Record<string, unknown>,
): boolean {
  const insights = Array.isArray((analysis as ConversationAnalysis).insights)
    ? (analysis as ConversationAnalysis).insights
    : [];
  const chunks = [
    ...insights.flatMap(insightTexts),
    nextGoalText((analysis as ConversationAnalysis).nextGoal),
    String((analysis as ConversationAnalysis).shortConversationNote || ""),
    typeof (analysis as { nextGoal?: unknown }).nextGoal === "string"
      ? String((analysis as { nextGoal?: unknown }).nextGoal)
      : "",
  ];
  return chunks.some(isTutorCentered);
}

export function analysisNeedsLearnerRefresh(
  analysis: ConversationAnalysis | Record<string, unknown>,
  turns: AnalysisTurn[],
): boolean {
  if (analysisTalksAboutTutor(analysis)) return true;
  if (!Array.isArray((analysis as ConversationAnalysis).insights)) return true;
  if ((analysis as ConversationAnalysis).insights.length === 0) return true;
  if (isWeakNextGoal((analysis as ConversationAnalysis).nextGoal)) return true;
  const assistantTexts = turns
    .map((turn) => turn.assistant || "")
    .filter(Boolean);
  return (analysis as ConversationAnalysis).insights.some((item) =>
    Boolean(item.evidence && matchesAssistantLine(item.evidence, assistantTexts)),
  );
}

export function sanitizeConversationAnalysis(
  analysis: ConversationAnalysis,
  turns: AnalysisTurn[],
): ConversationAnalysis {
  const assistantTexts = turns
    .map((turn) => turn.assistant || "")
    .filter(Boolean);

  const insights = analysis.insights.filter((item) => {
    if (insightTexts(item).some(isTutorCentered)) return false;
    if (item.evidence && matchesAssistantLine(item.evidence, assistantTexts)) {
      return false;
    }
    return true;
  });

  const nextGoal =
    analysis.nextGoal && !isTutorCentered(nextGoalText(analysis.nextGoal))
      ? analysis.nextGoal
      : undefined;

  return {
    insights,
    nextGoal,
    shortConversationNote:
      analysis.shortConversationNote &&
      !isTutorCentered(analysis.shortConversationNote)
        ? analysis.shortConversationNote
        : undefined,
  };
}

function asString(value: unknown): string {
  return typeof value === "string" ? stripCoachMeta(value) : "";
}

function parseCategory(value: unknown): AnalysisCategory {
  const raw = asString(value).toUpperCase().replace(/[\s-]+/g, "_");
  return CATEGORY_SET.has(raw) ? (raw as AnalysisCategory) : "IMPROVEMENT";
}

function parseSentiment(value: unknown): AnalysisSentiment {
  const raw = asString(value).toLowerCase();
  return raw === "positive" ? "positive" : "improvement";
}

function parseInsight(
  value: unknown,
  userTexts: string[],
): ConversationInsight | null {
  if (!value || typeof value !== "object") return null;
  const o = value as Record<string, unknown>;
  const title = asString(o.title);
  const analysis = asString(o.analysis) || asString(o.body);
  if (!title || !analysis) return null;
  const evidence =
    findUserLine(asString(o.evidence) || asString(o.exampleFrom), userTexts) ||
    evidenceFromQuotes(analysis, userTexts);
  if (!evidence) return null;
  const suggestion = asString(o.suggestion) || undefined;
  const example =
    asString(o.example) || asString(o.exampleExpanded) || undefined;
  return {
    category: parseCategory(o.category),
    sentiment: parseSentiment(o.sentiment),
    title,
    evidence,
    analysis,
    ...(suggestion ? { suggestion } : {}),
    ...(example ? { example } : {}),
  };
}

function parseNextGoal(value: unknown): ConversationNextGoal | undefined {
  if (typeof value === "string") {
    const title = stripCoachMeta(value);
    return title ? { title, body: title } : undefined;
  }
  if (!value || typeof value !== "object") return undefined;
  const o = value as Record<string, unknown>;
  const title = asString(o.title);
  const body = asString(o.body) || title;
  if (!title) return undefined;
  const pattern = asString(o.pattern) || undefined;
  const example = asString(o.example) || undefined;
  return {
    title,
    body,
    ...(pattern ? { pattern } : {}),
    ...(example ? { example } : {}),
  };
}

function legacyInsights(raw: Record<string, unknown>, userTexts: string[]) {
  const fromList = (list: unknown, fallback: AnalysisSentiment) =>
    (Array.isArray(list) ? list : [])
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const row = item as Record<string, unknown>;
        return parseInsight(
          {
            ...row,
            sentiment: row.sentiment || fallback,
          },
          userTexts,
        );
      })
      .filter((item): item is ConversationInsight => Boolean(item));

  const primary = fromList(raw.insights, "positive");
  if (primary.length > 0) return primary;
  return [
    ...fromList(raw.strengths, "positive"),
    ...fromList(raw.improvements, "improvement"),
    ...fromList(raw.habits, "improvement"),
  ];
}

export function normalizeConversationAnalysis(
  raw: unknown,
  turns: AnalysisTurn[],
): ConversationAnalysis | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const userTexts = turns.map((turn) => turn.user);
  const seen = new Set<string>();
  const insights = legacyInsights(o, userTexts)
    .filter((item) => {
      const key = `${item.title}|${item.evidence}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 5);

  const analysis = sanitizeConversationAnalysis(
    {
      insights,
      nextGoal: parseNextGoal(o.nextGoal),
      shortConversationNote: asString(o.shortConversationNote) || undefined,
    },
    turns,
  );

  if (analysis.insights.length === 0) {
    return null;
  }

  return analysis;
}

export function mergeConversationAnalysis(
  primary: ConversationAnalysis,
  fallback: ConversationAnalysis,
): ConversationAnalysis {
  const seen = new Set(
    primary.insights.map((item) => `${item.category}|${item.evidence || ""}`),
  );
  const extras = fallback.insights.filter((item) => {
    const key = `${item.category}|${item.evidence || ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    insights: [...primary.insights, ...extras].slice(0, 5),
    nextGoal: isWeakNextGoal(primary.nextGoal)
      ? fallback.nextGoal
      : primary.nextGoal,
    shortConversationNote:
      primary.shortConversationNote || fallback.shortConversationNote,
  };
}

function isLegacyAnalysis(value: unknown): value is {
  insights?: ConversationInsight[];
  strengths?: Array<{ title: string; body?: string; analysis?: string; exampleFrom?: string }>;
  improvements?: Array<{ title: string; body?: string; analysis?: string; exampleFrom?: string }>;
  habits?: Array<{ title: string; body?: string }>;
  nextGoal?: string | ConversationNextGoal;
  shortConversationNote?: string;
} {
  return Boolean(value && typeof value === "object");
}

export function getConversationAnalysis(
  messages: ChatMessage[],
  locale: Locale,
  stored?: ConversationAnalysis | Record<string, unknown>,
): ConversationAnalysis {
  const heuristic = buildHeuristicConversationAnalysis(messages, locale);
  if (!stored || !isLegacyAnalysis(stored)) return heuristic;

  const turns = extractAnalysisTurns(messages);
  const normalized = normalizeConversationAnalysis(stored, turns);
  if (!normalized || normalized.insights.length === 0) {
    return heuristic;
  }
  return mergeConversationAnalysis(normalized, heuristic);
}
