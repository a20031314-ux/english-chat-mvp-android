import type { RoleplayScenario } from "./script.ts";

/**
 * The scripted scenarios, one entry per situation.
 *
 * Written to be spoken, not read: short turns, contractions, the things people
 * actually say when ordering coffee rather than the things a textbook prints.
 * The tutor's lines are fixed — that is what lets their audio be generated once
 * and shared — so a line that would need to differ per learner belongs to the
 * live tutor instead, which the pipeline wakes when the script runs out.
 *
 * One scenario for now. It exists to hold the shape while the pipeline is built
 * against something real; the library grows once the shape has survived use.
 */
export const SCENARIOS: RoleplayScenario[] = [
  {
    id: "cafe-order",
    language: "en",
    title: "Ordering at a café",
    setting:
      "A small café at mid-morning. The tutor is the barista behind the counter; the learner is a customer who has just walked in. It is not busy, so the barista has time to be friendly and to repeat things.",
    tutorRole: "barista",
    steps: [
      {
        type: "tutor",
        id: "greet",
        text: "Hi there! What can I get you?",
        translation: "안녕하세요! 뭐 드릴까요?",
      },
      {
        type: "learner",
        id: "order",
        goal: "마시고 싶은 것을 주문하세요.",
        accept: [
          "can I get a coffee",
          "i'll have a latte",
          "a latte please",
          "could I have an americano",
          "one coffee please",
        ],
        hint: '"Can I get ~" 또는 "I\'ll have ~"로 시작하면 자연스러워요.',
      },
      {
        type: "tutor",
        id: "size",
        text: "Sure. What size — small or large?",
        translation: "네. 사이즈는 스몰이요, 라지요?",
      },
      {
        type: "learner",
        id: "size-answer",
        goal: "사이즈를 고르세요.",
        accept: ["small", "large", "small please", "large please", "a small one"],
      },
      {
        type: "tutor",
        id: "here-or-to-go",
        text: "Got it. For here or to go?",
        translation: "알겠습니다. 드시고 가세요, 가져가세요?",
      },
      {
        type: "learner",
        id: "here-or-to-go-answer",
        goal: "매장에서 마실지 가져갈지 답하세요.",
        accept: ["for here", "to go", "take away", "i'll drink it here"],
        hint: "매장에서 마시면 \"For here\", 가져가면 \"To go\"예요.",
      },
      {
        type: "tutor",
        id: "total",
        text: "That'll be four fifty. Card or cash?",
        translation: "4달러 50센트입니다. 카드요, 현금이요?",
      },
      {
        type: "learner",
        id: "payment",
        goal: "결제 방법을 말하세요.",
        accept: ["card", "by card", "cash", "i'll pay by card", "credit card"],
      },
      {
        type: "tutor",
        id: "closing",
        text: "Perfect. It'll be right up — have a good one!",
        translation: "좋아요. 금방 나옵니다. 좋은 하루 보내세요!",
      },
    ],
  },
];

export function scenariosForLanguage(language: string): RoleplayScenario[] {
  return SCENARIOS.filter((scenario) => scenario.language === language);
}

export function findScenario(id: string): RoleplayScenario | null {
  return SCENARIOS.find((scenario) => scenario.id === id) ?? null;
}
