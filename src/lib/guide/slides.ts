/**
 * 사용법 장 안의 넘겨 보기 장면(2026-11-14 사용자 "탭 → 칸 → 핵심 사용 장면, 넘기면 세부 — 기능이 보이는 부분만 잘라, 그림 안에 기능 이름·설명").
 * 장면 한 장 = 그림 한 장(/guide/<앱 언어>/<shot>.webp) — 스크린샷 위쪽에 문구 한 줄이 들어 있다(scripts/guide-slides/).
 * 첫 장이 그 칸의 핵심, 그 뒤가 세부. 🔊처럼 아이콘만으로 통하는 것은 설명하지 않는다.
 * /api/guide `slides=1`이 앱 언어에 그림이 있는 장만 준다 — 없는 언어·옛 빌드는 장의 예전 칸 글 그대로.
 * 칸 이름은 {ui:<키>} — 화면 문구 그대로. 그림을 다시 만들려면 scripts/guide-slides/(shoot → compose).
 */
/** title은 그림 안에 그려진 문구 한 줄(scripts/guide-slides/compose.mjs) — 기능이 주는 것을 "~하세요/~해요"로, 사용법 상세는 넣지 않는다(사용자 2026-11-16). 앱은 읽어 주기(alt)로만 쓴다. */
export type GuideSlide = { shot: string; title: string };
/** covers: 이 칸이 대신하는 예전 칸 글 id — 새로워진 점 "자세히"(whatsNew guide)가 그 칸 id로 열면 이 칸을 고른 채 연다. */
export type GuideSlideGroup = { id: string; title: string; covers?: string[]; slides: GuideSlide[] };

/** 장 id → 칸들. 그림을 찍은 앱 언어만. */
const SLIDES: Record<string, Record<string, GuideSlideGroup[]>> = {
  ko: {
    "ai-chat": [
      {
        id: "chat",
        title: "{ui:talkAiTutor}",
        covers: ["chat.next", "chat.talk", "chat.stuck", "chat.meaning", "chat.analyse", "chat.words", "chat.menu", "chat.history"],
        slides: [
          { shot: "tab-chat-1", title: "튜터와 채팅하세요" },
          { shot: "tab-chat-2", title: "고친 문장을 바로 보세요" },
          { shot: "tab-chat-3", title: "막히면 편한 말로 쓰세요" },
        ],
      },
    ],
    messages: [
      {
        id: "talk",
        title: "{ui:homeTabTalk}",
        covers: ["talk.list", "messages.dm", "messages.groups"],
        slides: [
          { shot: "tab-talk-1", title: "모든 대화를 한곳에서" },
          { shot: "tab-talk-2", title: "단체방에서 함께 말하세요" },
          { shot: "tab-talk-3", title: "1:1로 친구와 대화하세요" },
        ],
      },
    ],
    video: [
      {
        id: "video",
        title: "{ui:homeTabVideo}",
        covers: ["video.library", "video.subtitles", "video.bar", "video.ask", "video.import", "video.edit"],
        slides: [
          { shot: "tab-video-1", title: "좋아하는 영상으로 배우세요" },
          { shot: "tab-video-2", title: "자막 한 줄씩 들어 보세요" },
          { shot: "tab-video-3", title: "모르는 부분은 물어보세요" },
        ],
      },
    ],
    people: [
      {
        id: "people",
        title: "{ui:homeTabPeople}",
        covers: ["people.find", "people.invite", "people.rewards", "people.board", "people.icons"],
        slides: [
          { shot: "tab-people-1", title: "다른 사람과 교류하세요" },
          { shot: "tab-people-2", title: "게시판에서 메이트를 구하세요" },
        ],
      },
    ],
    rooms: [
      {
        id: "rooms",
        title: "{ui:homeTabRooms}",
        covers: ["room.find", "room.layouts", "room.quote", "room.stuck", "room.game", "room.mafia", "room.watch", "room.host"],
        slides: [
          { shot: "tab-rooms-1", title: "열린 방에 들어가 보세요" },
          { shot: "tab-rooms-2", title: "여럿이 함께 말해요" },
        ],
      },
    ],
    "ai-call": [
      {
        id: "talk",
        title: "📞 {ui:callModeTalk}",
        covers: ["call.talk"],
        slides: [
          { shot: "call-talk-1", title: "튜터와 편하게 통화하세요" },
          { shot: "call-talk-2", title: "고친 말은 카드로 보여요" },
        ],
      },
      {
        id: "lesson",
        title: "🎓 {ui:callModeStudy}",
        covers: ["call.coach"],
        slides: [
          { shot: "call-lesson-1", title: "칠판의 문장으로 말해 보세요" },
          { shot: "call-lesson-2", title: "틀리면 바로 다시 말해 봐요" },
        ],
      },
      {
        id: "twenty",
        title: "🎲 {ui:callModeGame}",
        slides: [{ shot: "call-game-1", title: "스무고개로 놀면서 말하세요" }],
      },
      {
        id: "teach",
        title: "🧑‍🏫 {ui:gameTeach}",
        slides: [{ shot: "call-teach-1", title: "튜터에게 가르쳐 보세요" }],
      },
      {
        id: "past",
        title: "{ui:callRecordsTitle}",
        covers: ["call.review", "call.pause"],
        slides: [
          { shot: "call-past-1", title: "지난 통화를 다시 보세요" },
          { shot: "call-past-2", title: "고친 말을 한곳에 모아요" },
        ],
      },
    ],
    my: [
      {
        id: "keep",
        title: "{ui:keepTitle}",
        covers: ["my.start", "my.next", "my.map"],
        slides: [
          { shot: "my-keep-1", title: "퀴즈로 매일 배우세요" },
          { shot: "my-keep-2", title: "맞힐수록 한 단계씩 어려워져요" },
          { shot: "my-keep-3", title: "부족한 곳은 다시 채워져요" },
        ],
      },
      {
        id: "lang",
        title: "{ui:languagebankTitle}",
        slides: [
          { shot: "my-lang-1", title: "배울 말이 모두 여기에" },
          { shot: "my-lang-2", title: "카드를 넘기며 외워 보세요" },
          { shot: "my-lang-3", title: "뜻과 예문을 한눈에" },
        ],
      },
      {
        id: "log",
        title: "{ui:logbankTitle}",
        covers: ["my.growth", "my.graph", "my.element"],
        slides: [
          { shot: "my-log-1", title: "배운 것이 쌓여요" },
          { shot: "my-log-2", title: "그날 무엇을 했는지 보세요" },
          { shot: "my-log-3", title: "맞힌 것과 틀린 것을 확인하세요" },
        ],
      },
    ],
  },
};

/** 이 앱 언어로 그림이 있는 장만(없으면 undefined). */
export function guideSlides(language: string): Record<string, GuideSlideGroup[]> | undefined {
  return SLIDES[language];
}
