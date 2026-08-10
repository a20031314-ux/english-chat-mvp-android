import {
  loadSessionReports,
  persistSessionReports,
  type SessionReport,
} from "@/lib/sessionReports";

export const DEMO_MONTHLY_SEED_KEY = "sessionReportsDemoSeedV1";

function atLocal(year: number, month: number, day: number, hour = 14) {
  return new Date(year, month - 1, day, hour, 0, 0, 0).getTime();
}

function demoMessages(
  sessionId: string,
  pairs: {
    user: string;
    assistant: string;
    hasError?: boolean;
    corrected?: string;
    natural?: string;
    explanation?: string;
  }[],
  baseTime: number,
) {
  const messages: SessionReport["messages"] = [];
  pairs.forEach((pair, index) => {
    const t = baseTime + index * 60_000;
    messages.push({
      id: `${sessionId}-u-${index}`,
      role: "user",
      content: pair.user,
      createdAt: t,
    });
    messages.push({
      id: `${sessionId}-a-${index}`,
      role: "assistant",
      content: JSON.stringify({
        assistantMessage: pair.assistant,
        correctionResult: {
          highlighted: pair.user,
          corrected: pair.corrected || pair.user,
          natural: pair.natural || pair.corrected || pair.user,
          explanation: pair.explanation || "",
          hasError: Boolean(pair.hasError),
        },
      }),
      createdAt: t + 1_000,
    });
  });
  return messages;
}

/**
 * One-time demo SessionReports for verifying monthly growth UI.
 * Does not delete existing user reports — merges by id.
 */
export function seedDemoMonthlyReports(): SessionReport[] {
  if (typeof window === "undefined") return loadSessionReports();

  try {
    if (window.localStorage.getItem(DEMO_MONTHLY_SEED_KEY) === "1") {
      return loadSessionReports();
    }
  } catch {
    return loadSessionReports();
  }

  const demos: SessionReport[] = [
    {
      id: "report-demo-2026-08-02",
      sessionId: "demo-2026-08-02",
      title: "주말 계획에 대한 대화",
      createdAt: atLocal(2026, 8, 2, 10),
      endedAt: atLocal(2026, 8, 2, 10),
      messageCount: 5,
      messages: demoMessages(
        "demo-2026-08-02",
        [
          {
            user: "This weekend I want to meet my friends.",
            assistant: "Nice! What are you planning to do together?",
          },
          {
            user: "Maybe we will go to a cafe and talk.",
            assistant: "That sounds relaxing. Have you decided which cafe?",
          },
        ],
        atLocal(2026, 8, 2, 10),
      ),
      conversationSummary:
        "오늘은 주말 계획과 친구를 만나는 것에 대해 이야기했어요. 카페에서 이야기하고 싶다는 이야기도 나눴습니다.",
      score: 68,
      scoreInsufficient: false,
      strengths: [
        {
          sentence: "This weekend I want to meet my friends.",
          note: "주말 계획을 자연스럽게 표현했습니다.",
        },
      ],
      improvements: [
        {
          original: "Maybe we will go to a cafe and talk.",
          better: "Maybe we'll go to a cafe and chat.",
          explanation: "일상 대화에서는 we'll, chat이 더 자연스럽습니다.",
        },
      ],
      learningItems: [
        {
          expression: "I'm planning to ~",
          reason: "주말 계획을 말할 때 바로 쓸 수 있어요.",
        },
      ],
    },
    {
      id: "report-demo-2026-08-05",
      sessionId: "demo-2026-08-05",
      title: "운동과 일상에 대한 대화",
      createdAt: atLocal(2026, 8, 5, 19),
      endedAt: atLocal(2026, 8, 5, 19),
      messageCount: 6,
      messages: demoMessages(
        "demo-2026-08-05",
        [
          {
            user: "I went to the gym yesterday because I felt tired.",
            assistant: "Good job! How long did you work out?",
          },
          {
            user: "About one hour. I'm planning to go again this week.",
            assistant: "Consistency helps a lot. Keep it up!",
          },
        ],
        atLocal(2026, 8, 5, 19),
      ),
      conversationSummary:
        "운동과 최근 컨디션에 대해 이야기했어요. 헬스장에 다시 갈 계획도 말했습니다.",
      score: 69,
      scoreInsufficient: false,
      strengths: [
        {
          sentence: "I went to the gym yesterday because I felt tired.",
          note: "이유를 because로 자연스럽게 덧붙였습니다.",
        },
      ],
      improvements: [],
      learningItems: [
        {
          expression: "I'm planning to ~",
          reason: "앞으로의 운동 계획을 말할 때 유용합니다.",
        },
      ],
    },
    {
      id: "report-demo-2026-08-08a",
      sessionId: "demo-2026-08-08a",
      title: "친구와 여행 계획 이야기",
      createdAt: atLocal(2026, 8, 8, 11),
      endedAt: atLocal(2026, 8, 8, 11),
      messageCount: 7,
      messages: demoMessages(
        "demo-2026-08-08a",
        [
          {
            user: "I haven't decided where to stay yet.",
            assistant: "Got it. Are you looking at hotels or Airbnbs?",
          },
          {
            user: "It depends on the price.",
            assistant: "That makes sense. When are you leaving?",
          },
        ],
        atLocal(2026, 8, 8, 11),
      ),
      conversationSummary:
        "친구와 여행 계획, 숙소에 대해 이야기했어요. 아직 정하지 못한 부분도 솔직히 말했습니다.",
      score: 71,
      scoreInsufficient: false,
      strengths: [
        {
          sentence: "I haven't decided where to stay yet.",
          note: "현재완료와 yet을 자연스럽게 사용했습니다.",
        },
      ],
      improvements: [],
      learningItems: [
        {
          expression: "I haven't decided ~ yet.",
          reason: "아직 정하지 못한 계획을 말할 때 바로 쓸 수 있어요.",
        },
        {
          expression: "It depends on ~",
          reason: "조건에 따라 달라질 때 자연스러운 표현입니다.",
        },
      ],
    },
    {
      id: "report-demo-2026-08-08b",
      sessionId: "demo-2026-08-08b",
      title: "짧은 인사 연습",
      createdAt: atLocal(2026, 8, 8, 16),
      endedAt: atLocal(2026, 8, 8, 16),
      messageCount: 1,
      messages: demoMessages(
        "demo-2026-08-08b",
        [{ user: "Hi", assistant: "Hi! How are you today?" }],
        atLocal(2026, 8, 8, 16),
      ),
      conversationSummary: "짧게나마 영어로 인사를 말해 본 세션이에요.",
      score: null,
      scoreInsufficient: true,
      strengths: [],
      improvements: [],
      learningItems: [
        {
          expression: "How are you today?",
          reason: "가벼운 인사에 이어서 쓸 수 있어요.",
        },
      ],
    },
    {
      id: "report-demo-2026-08-12",
      sessionId: "demo-2026-08-12",
      title: "여행 계획",
      createdAt: atLocal(2026, 8, 12, 15),
      endedAt: atLocal(2026, 8, 12, 15),
      messageCount: 8,
      messages: demoMessages(
        "demo-2026-08-12",
        [
          {
            user: "I went Japan last year.",
            assistant: "Oh nice! Where did you go in Japan?",
            hasError: true,
            corrected: "I went to Japan last year.",
            natural: "I went to Japan last year.",
            explanation:
              "go/went 뒤에 장소가 올 때는 보통 to를 씁니다.",
          },
          {
            user: "I went to Tokyo and Osaka with my friends.",
            assistant: "Sounds like a great trip. Want to go again?",
          },
        ],
        atLocal(2026, 8, 12, 15),
      ),
      conversationSummary:
        "지난 일본 여행과 이번 여행 계획을 이야기했어요. 친구와 함께한 경험도 나눴습니다.",
      score: 70,
      scoreInsufficient: false,
      strengths: [
        {
          sentence: "I went to Tokyo and Osaka with my friends.",
          note: "교정 후 장소를 to와 함께 자연스럽게 말했습니다.",
        },
      ],
      improvements: [
        {
          original: "I went Japan last year.",
          better: "I went to Japan last year.",
          explanation: "go/went 뒤에 장소가 올 때는 보통 to를 씁니다.",
        },
      ],
      learningItems: [
        {
          expression: "I went to ~",
          reason: "여행 경험을 말할 때 핵심 표현입니다.",
        },
      ],
    },
    {
      id: "report-demo-2026-08-18",
      sessionId: "demo-2026-08-18",
      title: "주말 계획",
      createdAt: atLocal(2026, 8, 18, 20),
      endedAt: atLocal(2026, 8, 18, 20),
      messageCount: 6,
      messages: demoMessages(
        "demo-2026-08-18",
        [
          {
            user: "I'm meeting my friend on Saturday.",
            assistant: "Fun! What will you do?",
          },
          {
            user: "We're planning to watch a movie and eat dinner.",
            assistant: "That sounds like a nice weekend.",
          },
        ],
        atLocal(2026, 8, 18, 20),
      ),
      conversationSummary:
        "주말에 친구를 만나 영화와 저녁을 먹을 계획에 대해 이야기했어요.",
      score: 73,
      scoreInsufficient: false,
      strengths: [
        {
          sentence: "We're planning to watch a movie and eat dinner.",
          note: "계획을 말하는 표현을 잘 사용했습니다.",
        },
      ],
      improvements: [],
      learningItems: [
        {
          expression: "I'm meeting ~",
          reason: "약속을 말할 때 쓸 수 있는 표현입니다.",
        },
      ],
    },
    {
      id: "report-demo-2026-08-24",
      sessionId: "demo-2026-08-24",
      title: "일상과 운동 이야기",
      createdAt: atLocal(2026, 8, 24, 21),
      endedAt: atLocal(2026, 8, 24, 21),
      messageCount: 9,
      messages: demoMessages(
        "demo-2026-08-24",
        [
          {
            user: "I've been busy at work, but I still go to the gym.",
            assistant: "That's impressive. How do you stay motivated?",
          },
          {
            user: "It depends on my schedule, but I try three times a week.",
            assistant: "A solid routine. Keep going!",
          },
        ],
        atLocal(2026, 8, 24, 21),
      ),
      conversationSummary:
        "직장과 운동 루틴의 균형을 이야기했어요. 주 3회 운동 목표도 말했습니다.",
      score: 74,
      scoreInsufficient: false,
      strengths: [
        {
          sentence: "I've been busy at work, but I still go to the gym.",
          note: "대비되는 상황을 but으로 자연스럽게 연결했습니다.",
        },
      ],
      improvements: [],
      learningItems: [
        {
          expression: "It depends on ~",
          reason: "일정에 따라 달라질 때 자주 쓰입니다.",
        },
      ],
    },
    // Previous month — for month navigation
    {
      id: "report-demo-2026-07-20",
      sessionId: "demo-2026-07-20",
      title: "음식과 식당 이야기",
      createdAt: atLocal(2026, 7, 20, 12),
      endedAt: atLocal(2026, 7, 20, 12),
      messageCount: 5,
      messages: demoMessages(
        "demo-2026-07-20",
        [
          {
            user: "I ate Korean food with my coworkers.",
            assistant: "Yum! What did you order?",
          },
        ],
        atLocal(2026, 7, 20, 12),
      ),
      conversationSummary: "동료와 한식을 먹은 이야기에 대해 짧게 나눴어요.",
      score: 65,
      scoreInsufficient: false,
      strengths: [],
      improvements: [],
      learningItems: [
        {
          expression: "I ate ~ with ~",
          reason: "누구와 무엇을 먹었는지 말할 때 유용합니다.",
        },
      ],
    },
  ];

  const existing = loadSessionReports();
  const byId = new Set(existing.map((r) => r.id));
  const added = demos.filter((d) => !byId.has(d.id));
  const next = [...added, ...existing].sort((a, b) => b.endedAt - a.endedAt);
  persistSessionReports(next);

  try {
    window.localStorage.setItem(DEMO_MONTHLY_SEED_KEY, "1");
  } catch {
    // ignore
  }

  return loadSessionReports();
}

/** Remove demo reports and allow re-seeding. */
export function clearDemoMonthlyReports() {
  if (typeof window === "undefined") return;
  const next = loadSessionReports().filter(
    (r) => !r.sessionId.startsWith("demo-"),
  );
  persistSessionReports(next);
  window.localStorage.removeItem(DEMO_MONTHLY_SEED_KEY);
}
