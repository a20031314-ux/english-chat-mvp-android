/**
 * How to use each tab, served by /api/guide and drawn by GuideSheet.
 *
 * Kept on the server so it can change without a release: the app only knows
 * how to draw sections, and what they say is whatever the deployment says. The
 * same move the video library made (libraryService.ts). Written against what
 * each tab does as of the version below — when a tab changes, this is the
 * file to change with it, and GUIDE_VERSION is how a phone holding an old copy
 * knows to take the new one.
 *
 * The name of a button is never written into the text. It is {ui:<copy key>},
 * and GuideSheet puts in what that button says in this person's language, so
 * the guide and the screen cannot name the same button two ways.
 *
 * Korean and English are written by hand; the other languages are translated
 * from them by scripts/translate-guide.mjs into translations.json, and a
 * language missing there is served the English.
 */

export const GUIDE_VERSION = "2026-10-16b";

export type GuideTabId = "map" | "chat" | "roleplay" | "video" | "vocab";

export type GuideSection = {
  heading: string;
  body: string[];
  /**
   * A picture of this step, taken in each interface language:
   * /guide/<locale>/<shot>.webp (scripts/capture-whats-new.mjs guide).
   * Builds before 2.67 ignore it and show the text alone.
   */
  shot?: string;
};

export type GuideTab = { title: string; sections: GuideSection[] };

export type Guide = Record<GuideTabId, GuideTab>;

export const GUIDE_KO: Guide = {
  map: {
    title: "My 사용법",
    sections: [
      {
        heading: "1. 체크로 시작",
        body: [
          "부족한 부분과 위주로 할 것을 고르고 ‘{ui:mapDraw}’. 수준은 묻지 않아요."
        ],
        shot: "goal"
      },
      {
        heading: "2. 오늘 해볼 것",
        body: [
          "쌓인 기록으로 지금 할 것 하나를 권해요. ‘{ui:nextByChat}’이나 ‘{ui:nextByCall}’을 누르면 그 상황으로 대화가 바로 시작돼요."
        ],
        shot: "next"
      },
      {
        heading: "3. 자라는 중",
        body: [
          "여섯 부분이 쓸수록 커지고 줄지 않아요. 테두리 친 곳이 ‘{ui:myNext}’이에요."
        ],
        shot: "growth"
      },
      {
        heading: "4. 눌러서 보기",
        body: [
          "부분을 누르면 자라는 방법·최근 2주·키운 표현이 보이고, ‘{ui:myGrowIt}’로 바로 연습해요."
        ],
        shot: "element"
      },
      {
        heading: "5. 직접 묻기",
        body: [
          "‘{ui:myAskQuick1}’처럼 물으면 내 기록으로 답해요. 질문 1번은 채팅 1회예요."
        ],
        shot: "myask"
      },
      {
        heading: "6. 목표와 연습",
        body: [
          "‘{ui:profileGoalTitle}’을 펼치면 목표로 그린 주제가 있고, 주제에서 ‘{ui:missionStart}’로 연습해요."
        ],
        shot: "goalopen"
      },
      {
        heading: "그 밖에",
        body: [
          "‘{ui:ledgerTitle}’에 모든 탭에서 만난 표현이 쌓여요. 목표가 바뀌면 ‘{ui:mapNewGoal}’. 배우는 언어마다 따로예요."
        ]
      }
    ]
  },
  chat: {
    title: "채팅 사용법",
    sections: [
      {
        heading: "오늘 해볼 것으로 시작",
        body: [
          "빈 대화의 ‘{ui:nextTitle}’에서 ‘{ui:nextByChat}’을 누르면 튜터가 그 상황으로 먼저 말을 걸어요. 첫 줄은 횟수에 안 들어가요.",
          "위 ‘{ui:practiceNow}’ 띠의 표현은 쓰면 ✓가 붙어요.",
        ],
        shot: "chatnext",
      },
      {
        heading: "배우는 언어로 대화하기",
        body: [
          "배우는 언어로 문장을 쓰면 튜터가 친구처럼 답해요.",
          "틀린 부분이 있으면 내 문장에 표시가 생기고, 바로 아래에 고친 문장이 나와요.",
        ],
      },
      {
        heading: "막히면 내 언어로",
        body: [
          "배우는 언어로 말하기 어려운 건 내 언어로 써도 돼요. 대화는 그대로 이어지고, 보낸 메시지 하나로 세요.",
          "내 문장 아래 ‘{ui:chatShowExpression}’을 누르면 배우는 언어로 어떻게 말하는지 볼 수 있고, ‘{ui:chatUseExpression}’로 바로 써볼 수 있어요.",
        ],
      },
      {
        heading: "뜻 보기와 문장 분석",
        body: [
          "튜터의 답 아래 ‘{ui:chatReading}’을 누르면 내 언어로 된 뜻을 볼 수 있어요.",
          "문장의 ‘{ui:insightAnalyze}’을 누르면 문장 시트가 열려요. 점을 끌어 부분을 고르고 ‘{ui:quickAskMeaning}’ 같은 질문을 누르거나 직접 물어보세요. 답은 그 부분에 남아서 다음에도 볼 수 있어요.",
        ],
      },
      {
        heading: "그 밖에",
        body: [
          "무슨 말을 할지 모르겠으면 ‘{ui:chatStartCta}’를 누르세요. 튜터가 대화를 시작해요.",
          "+ 버튼으로 사진을 보내면 사진을 보며 대화할 수 있어요.",
          "왼쪽 위 메뉴에서 지난 대화를 보거나 새 대화를 시작할 수 있어요.",
          "무료로는 하루 10번까지 보낼 수 있고, 프리미엄은 제한이 없어요.",
        ],
      },
    ],
  },
  roleplay: {
    title: "통화 사용법",
    sections: [
      {
        heading: "말로 대화하기",
        body: [
          "‘{ui:roleplayStart}’을 누르고 마이크를 허용하면 캐릭터와 말로 대화해요.",
          "말을 멈추면 자동으로 내 차례가 끝나고 캐릭터가 답해요.",
          "막히면 캐릭터가 다음 말로 도와줘요. 대화는 끊기지 않아요.",
        ],
      },
      {
        heading: "막혔던 곳 돌아보기",
        body: [
          "막혔던 차례에는 ‘{ui:roleplayWhyStuck}’ 버튼이 남아요.",
          "누르면 왜 어려웠는지와 이렇게 말할 수 있었다는 표현을 보여주고, ‘{ui:roleplayPracticeCta}’로 바로 연습할 수 있어요.",
        ],
      },
      {
        heading: "멈추고 이어서 하기",
        body: [
          "‘{ui:roleplayPause}’을 누르면 대화가 저장돼요. 다음에 통화 탭에서 ‘{ui:roleplayResume}’로 계속할 수 있어요.",
          "끝난 대화는 ‘{ui:roleplayPast}’에서 다시 읽을 수 있어요.",
        ],
      },
      {
        heading: "통화 시간과 포인트",
        body: [
          "통화는 5분에 1포인트예요. 통화를 시작할 때 1포인트가 쓰이고, 5분이 지날 때마다 1포인트씩 더 쓰여요.",
          "5분을 다 쓰지 않고 끝내도 남은 시간은 다음 통화로 이어져요.",
          "처음에 무료로 20포인트(100분)를 드려요. 프리미엄은 매달 80포인트를 받고, 영상 가져오기와 함께 써요.",
        ],
      },
    ],
  },
  video: {
    title: "영상 학습 사용법",
    sections: [
      {
        heading: "{ui:videoLearnLibraryTitle}",
        body: [
          "매달 고른 영상으로 바로 공부할 수 있어요. 무료로 3편까지 체험할 수 있고, 프리미엄은 전체를 볼 수 있어요.",
          "‘{ui:discoverCta}’를 누르면 관심사에 맞는 영상을 추천받을 수 있어요.",
        ],
      },
      {
        heading: "내 영상 가져오기",
        body: [
          "YouTube 링크를 붙여넣으면 자막과 번역을 만들어줘요. 프리미엄 기능이고, 영상 3분에 1포인트가 들어요. 15분까지 가능해요.",
        ],
      },
      {
        heading: "자막으로 공부하기",
        body: [
          "재생하면 구간마다 배우는 언어 자막과 번역이 나와요. 문장을 누르면 그 구간만 다시 들을 수 있어요.",
          "‘{ui:videoLearnRangeMode}’로 여러 문장을 이어 듣고, 구간을 합치거나 쪼갤 수 있어요. ‘{ui:videoLearnResetAllCues}’로 언제든 되돌릴 수 있어요.",
        ],
      },
      {
        heading: "저장하고 다시 보기",
        body: [
          "‘{ui:videoLearnSaveSession}’을 누르면 ‘{ui:videoLearnSavedSessions}’에서 다시 볼 수 있어요. 저장한 영상은 다시 볼 때 포인트가 들지 않아요.",
        ],
      },
    ],
  },
  vocab: {
    title: "단어장 사용법",
    sections: [
      {
        heading: "찾고 저장하기",
        body: [
          "단어나 표현을 검색하면 뜻을 보고 단어장에 저장할 수 있어요.",
          "채팅에서 눌러 저장한 단어도 여기에 모여요.",
        ],
      },
      {
        heading: "외우기",
        body: [
          "‘{ui:vocabHideGloss}’을 켜면 뜻이 가려져요. 단어를 눌러 뜻을 확인하며 외워보세요.",
          "‘{ui:vocabShuffle}’로 순서를 섞을 수 있어요.",
        ],
      },
    ],
  },
};

export const GUIDE_EN: Guide = {
  map: {
    title: "Using My",
    sections: [
      {
        heading: "1. Start by ticking",
        body: [
          "Tick where you fall short and what to focus on, then ‘{ui:mapDraw}’. There's no level to pick."
        ],
        shot: "goal"
      },
      {
        heading: "2. Try this",
        body: [
          "One thing to do now, from your own record. ‘{ui:nextByChat}’ or ‘{ui:nextByCall}’ starts that conversation straight away."
        ],
        shot: "next"
      },
      {
        heading: "3. Growing",
        body: [
          "Six parts grow as you use the language and never shrink. The ringed one is ‘{ui:myNext}’."
        ],
        shot: "growth"
      },
      {
        heading: "4. Tap to look closer",
        body: [
          "Tap a part for how it grows, the last two weeks and the phrases that grew it; ‘{ui:myGrowIt}’ starts practising."
        ],
        shot: "element"
      },
      {
        heading: "5. Ask",
        body: [
          "Ask something like ‘{ui:myAskQuick1}’ and it answers from your record. One question is one chat."
        ],
        shot: "myask"
      },
      {
        heading: "6. Goal and practice",
        body: [
          "Open ‘{ui:profileGoalTitle}’ for the topics drawn from your goal; in a topic, ‘{ui:missionStart}’."
        ],
        shot: "goalopen"
      },
      {
        heading: "Also",
        body: [
          "‘{ui:ledgerTitle}’ gathers phrases from every tab. New goal? ‘{ui:mapNewGoal}’. Each learning language has its own."
        ]
      }
    ]
  },
  chat: {
    title: "How to use Chat",
    sections: [
      {
        heading: "Start from Try this",
        body: [
          "In an empty chat, tap ‘{ui:nextByChat}’ under ‘{ui:nextTitle}’ and the tutor opens in that situation. That first line isn't counted.",
          "Phrases on the ‘{ui:practiceNow}’ strip get a ✓ once you use them.",
        ],
        shot: "chatnext",
      },
      {
        heading: "Chat in the language you're learning",
        body: [
          "Write in the language you're learning and the tutor answers like a friend would.",
          "If something is off, it's marked in your message, with the corrected sentence right below.",
        ],
      },
      {
        heading: "Stuck? Use your own language",
        body: [
          "If something is hard to say in the language you're learning, write it in your own. The conversation carries on, and it counts as one message like any other.",
          "Tap {ui:chatShowExpression} under your message to see how to say it, then {ui:chatUseExpression} to try it straight away.",
        ],
      },
      {
        heading: "Meanings and sentence analysis",
        body: [
          "Tap {ui:chatReading} under the tutor's reply to see it in your own language.",
          "Tap {ui:insightAnalyze} on a sentence to open it. Drag across the dots to pick a part, then tap a question like {ui:quickAskMeaning} or ask your own. The answer stays on that part for next time.",
        ],
      },
      {
        heading: "Also",
        body: [
          "Not sure what to say? Tap {ui:chatStartCta} and the tutor will begin.",
          "Use + to send a photo and talk about it.",
          "The menu at the top left has your past chats and starts a new one.",
          "Free accounts can send 10 messages a day; Premium has no daily limit.",
        ],
      },
    ],
  },
  roleplay: {
    title: "How to use Calls",
    sections: [
      {
        heading: "Talk out loud",
        body: [
          "Tap {ui:roleplayStart} and allow the microphone to talk with the character.",
          "When you stop speaking, your turn ends and the character answers.",
          "If you get stuck, the character helps you along in what it says next. The conversation keeps going.",
        ],
      },
      {
        heading: "Look back at where you got stuck",
        body: [
          "A turn where you got stuck keeps a {ui:roleplayWhyStuck} button.",
          "It shows why it was hard and what you could have said, and you can practise it straight away with {ui:roleplayPracticeCta}.",
        ],
      },
      {
        heading: "Pause and carry on",
        body: [
          "{ui:roleplayPause} saves the conversation. Next time, {ui:roleplayResume} in the Calls tab picks it up again.",
          "Finished conversations stay in {ui:roleplayPast} to read again.",
        ],
      },
      {
        heading: "Call time and points",
        body: [
          "A point buys five minutes of calls. One point is used when a call starts, and another every five minutes after.",
          "If a call ends before its five minutes are up, the time left carries into your next call.",
          "You get 20 points (100 minutes) free to start. Premium gives 80 points a month, shared with video imports.",
        ],
      },
    ],
  },
  video: {
    title: "How to use Video",
    sections: [
      {
        heading: "{ui:videoLearnLibraryTitle}",
        body: [
          "Videos picked each month, ready to study. Free accounts can try 3; Premium opens them all.",
          "{ui:discoverCta} suggests videos that match your interests.",
        ],
      },
      {
        heading: "Bring your own video",
        body: [
          "Paste a YouTube link and the app makes subtitles and a translation. This is a Premium feature and uses one point per three minutes of video, up to 15 minutes.",
        ],
      },
      {
        heading: "Study with subtitles",
        body: [
          "As the video plays, each part shows subtitles in the language you're learning, with a translation. Tap a line to hear just that part again.",
          "{ui:videoLearnRangeMode} to hear lines together, and merge or split parts. {ui:videoLearnResetAllCues} puts everything back the way it was.",
        ],
      },
      {
        heading: "Save and come back",
        body: [
          "{ui:videoLearnSaveSession} to find it again under {ui:videoLearnSavedSessions}. Watching a saved video again doesn't use points.",
        ],
      },
    ],
  },
  vocab: {
    title: "How to use Vocabulary",
    sections: [
      {
        heading: "Find and save",
        body: [
          "Search for a word or phrase to see what it means and save it.",
          "Words you tap and save in Chat collect here too.",
        ],
      },
      {
        heading: "Learn them",
        body: [
          "{ui:vocabHideGloss} covers them up, then tap a word to check yourself.",
          "{ui:vocabShuffle} mixes up the order.",
        ],
      },
    ],
  },
};
