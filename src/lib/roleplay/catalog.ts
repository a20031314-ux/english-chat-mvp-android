import type { RoleplayScenario, SentenceBank } from "./script.ts";

/**
 * Tutor sentences, keyed for reuse.
 *
 * Separate from the scenarios because a café says "What size?" in every script
 * it appears in, and recording it once per script would be paying repeatedly for
 * the same eight seconds. Anything written here can be pointed at from anywhere.
 *
 * Written to be spoken: short turns, contractions, the things people say when
 * they hand over a coffee rather than the things a textbook prints.
 */
export const SENTENCES: Record<string, SentenceBank> = {
  en: {
    "cafe.greet": {
      text: "Hi there! What can I get you?",
      translation: "안녕하세요! 뭐 드릴까요?",
    },
    "cafe.size": {
      text: "Sure. What size — small or large?",
      translation: "네. 사이즈는 스몰이요, 라지요?",
    },
    "cafe.milk-yes": {
      text: "We do, yeah. Oat, soy, whole — whatever you like.",
      translation: "네, 있어요. 오트, 두유, 일반 우유 다 됩니다.",
    },
    "cafe.here-or-to-go": {
      text: "Got it. For here or to go?",
      translation: "알겠습니다. 드시고 가세요, 가져가세요?",
    },
    "cafe.total": {
      text: "That'll be four fifty. Card or cash?",
      translation: "4달러 50센트입니다. 카드요, 현금이요?",
    },
    "cafe.closing": {
      text: "Perfect. It'll be right up — have a good one!",
      translation: "좋아요. 금방 나옵니다. 좋은 하루 보내세요!",
    },
    // Recovery. Cheap, in character, and it buys a retry without waking anyone.
    "cafe.pardon": {
      text: "Sorry, what was that?",
      translation: "죄송해요, 뭐라고 하셨죠?",
    },
    // Corrections. Written in advance because most misses at a given turn are
    // the same miss — which is what the situation briefs record. Generated with
    // every other line and free to play.
    "cafe.fix-order": {
      text: "You can just say: can I get a latte, please.",
      translation: '"Can I get a latte, please."라고 하면 돼요.',
    },
    "cafe.fix-size": {
      text: "Small or large — you can just say the word.",
      translation: '"Small" 또는 "Large" 한 단어면 됩니다.',
    },
    "cafe.fix-here": {
      text: "If you're drinking it here, say: for here. If you're taking it away, say: to go.",
      translation: '여기서 마시면 "For here", 가져가면 "To go"예요.',
    },
    "cafe.fix-payment": {
      text: "You can just say: card, please.",
      translation: '"Card, please."라고 하면 됩니다.',
    },
  },
};

/**
 * The scenarios, one graph per situation.
 *
 * `onMiss` points at a scripted recovery wherever one makes sense, so a mumble
 * costs a repeated line rather than a live tutor. Where it is left out, the
 * tutor is what happens — which is the arrangement in miniature: the script
 * covers what it can and the tutor handles the edges.
 */
export const SCENARIOS: RoleplayScenario[] = [
  {
    id: "cafe-order",
    language: "en",
    title: "Ordering at a café",
    setting:
      "A small café at mid-morning. The tutor is the barista behind the counter; the learner is a customer who has just walked in. It is not busy, so the barista has time to be friendly and to repeat things.",
    tutorRole: "barista",
    start: "greet",
    nodes: {
      greet: { type: "tutor", id: "greet", say: "cafe.greet", next: "order" },
      order: {
        type: "learner",
        id: "order",
        goal: "마시고 싶은 것을 주문하세요.",
        hint: '"Can I get ~" 또는 "I\'ll have ~"로 시작하면 자연스러워요.',
        expect: [
          // The specific before the general: asking about milk is also an order
          // in most phrasings, and would be swallowed by the drink branch.
          {
            match: ["oat milk", "soy milk", "do you have milk", "any milk"],
            go: "milk-answer",
          },
          {
            match: [
              "can I get a coffee",
              "i'll have a latte",
              "a latte please",
              "could I have an americano",
              "one coffee please",
            ],
            go: "size",
          },
        ],
        onMiss: "pardon-order",
        correction: "cafe.fix-order",
      },
      // A branch that rejoins: the milk question is answered and the order
      // carries on where it left off, so it costs one sentence, not a new path.
      "milk-answer": {
        type: "tutor",
        id: "milk-answer",
        say: "cafe.milk-yes",
        next: "order",
      },
      "pardon-order": {
        type: "tutor",
        id: "pardon-order",
        say: "cafe.pardon",
        next: "order",
      },
      size: { type: "tutor", id: "size", say: "cafe.size", next: "size-answer" },
      "size-answer": {
        type: "learner",
        id: "size-answer",
        goal: "사이즈를 고르세요.",
        expect: [
          {
            match: ["small", "large", "small please", "large please", "a small one"],
            go: "here-or-to-go",
          },
        ],
        onMiss: "pardon-size",
        correction: "cafe.fix-size",
      },
      "pardon-size": {
        type: "tutor",
        id: "pardon-size",
        say: "cafe.pardon",
        next: "size-answer",
      },
      "here-or-to-go": {
        type: "tutor",
        id: "here-or-to-go",
        say: "cafe.here-or-to-go",
        next: "here-answer",
      },
      "here-answer": {
        type: "learner",
        id: "here-answer",
        goal: "매장에서 마실지 가져갈지 답하세요.",
        hint: '매장에서 마시면 "For here", 가져가면 "To go"예요.',
        expect: [
          {
            match: ["for here", "to go", "take away", "i'll drink it here"],
            go: "total",
          },
        ],
        // No onMiss: a miss here goes straight to the correction, because the
        // trouble is known and the answer is one written sentence.
        correction: "cafe.fix-here",
      },
      total: { type: "tutor", id: "total", say: "cafe.total", next: "payment" },
      payment: {
        type: "learner",
        id: "payment",
        goal: "결제 방법을 말하세요.",
        expect: [
          {
            match: ["card", "by card", "cash", "i'll pay by card", "credit card"],
            go: "closing",
          },
        ],
        onMiss: "pardon-payment",
        correction: "cafe.fix-payment",
      },
      "pardon-payment": {
        type: "tutor",
        id: "pardon-payment",
        say: "cafe.pardon",
        next: "payment",
      },
      closing: { type: "tutor", id: "closing", say: "cafe.closing", next: null },
    },
  },
];

export function sentencesFor(language: string): SentenceBank {
  return SENTENCES[language] ?? {};
}

export function scenariosForLanguage(language: string): RoleplayScenario[] {
  return SCENARIOS.filter((scenario) => scenario.language === language);
}

export function findScenario(id: string): RoleplayScenario | null {
  return SCENARIOS.find((scenario) => scenario.id === id) ?? null;
}
