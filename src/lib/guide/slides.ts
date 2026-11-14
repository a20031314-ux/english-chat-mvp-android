/**
 * 사용법 장 안의 넘겨 보기 장면(2026-11-14 사용자 "탭 → 칸 → 핵심 사용 장면, 넘기면 세부 — 기능이 보이는 부분만 잘라, 그림 안에 기능 이름·설명").
 * 장면 한 장 = 그림 한 장(/guide/<앱 언어>/<shot>.webp) — 기능 이름·설명 한 줄이 그림 안에 있다(scripts/guide-slides/).
 * 첫 장이 그 칸의 핵심, 그 뒤가 세부. 🔊처럼 아이콘만으로 통하는 것은 설명하지 않는다.
 * /api/guide `slides=1`이 앱 언어에 그림이 있는 장만 준다 — 없는 언어·옛 빌드는 장의 예전 칸 글 그대로.
 * 칸 이름은 {ui:<키>} — 화면 문구 그대로. 그림을 다시 만들려면 scripts/guide-slides/(shoot → compose).
 */
/** title·desc는 그림 안에 그려진 글(scripts/guide-slides/compose.mjs가 읽어 그림)이고, 앱은 읽어 주기(alt)로만 쓴다. */
export type GuideSlide = { shot: string; title: string; desc: string };
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
          { shot: "tab-chat-1", title: "학습 언어로 대화", desc: "튜터가 답하고, 고칠 곳은 ✎ 칩으로 알려 줘요" },
          { shot: "tab-chat-2", title: "고친 문장", desc: "칩을 누르면 고친 문장과 더 자연스러운 말" },
          { shot: "tab-chat-3", title: "막히면 편한 말로", desc: "튜터가 학습 언어로 이어 주고 표현을 보여 줘요 — 그 표현으로 말해 봐요" },
        ],
      },
    ],
    messages: [
      {
        id: "talk",
        title: "{ui:homeTabTalk}",
        covers: ["talk.list", "messages.dm", "messages.groups"],
        slides: [
          { shot: "tab-talk-1", title: "대화 목록", desc: "맨 위 AI 튜터, 아래 단체방과 1:1 메시지" },
          { shot: "tab-talk-2", title: "단체방", desc: "줄을 집어 묻고 답해요 — 📞로 같이 통화" },
          { shot: "tab-talk-3", title: "1:1 메시지", desc: "줄을 눌러 묻거나 답하고, 📞로 둘만의 통화" },
        ],
      },
    ],
    video: [
      {
        id: "video",
        title: "{ui:homeTabVideo}",
        covers: ["video.library", "video.subtitles", "video.bar", "video.ask", "video.import", "video.edit"],
        slides: [
          { shot: "tab-video-1", title: "이달의 영상", desc: "골라서 학습 언어 자막으로 봐요" },
          { shot: "tab-video-2", title: "자막 한 줄씩", desc: "문장을 누르면 그 구간만 다시 — 단어는 📕로" },
          { shot: "tab-video-3", title: "물어보기", desc: "점을 끌어 부분을 고르고 뜻·문법을 물어봐요" },
        ],
      },
    ],
    people: [
      {
        id: "people",
        title: "{ui:homeTabPeople}",
        covers: ["people.find", "people.invite", "people.rewards", "people.board", "people.icons"],
        slides: [
          { shot: "tab-people-1", title: "사람", desc: "같은 언어를 배우는 사람 — 팔로우·메시지" },
          { shot: "tab-people-2", title: "게시판", desc: "자유·질문·메이트·단체방 주제로 글을 쓰고 메이트를 구해요" },
        ],
      },
    ],
    rooms: [
      {
        id: "rooms",
        title: "{ui:homeTabRooms}",
        covers: ["room.find", "room.layouts", "room.quote", "room.stuck", "room.game", "room.mafia", "room.watch", "room.host"],
        slides: [
          { shot: "tab-rooms-1", title: "열린 방", desc: "방을 만들거나 들어가요 — 말하기 또는 듣기만" },
          { shot: "tab-rooms-2", title: "방 안", desc: "자리에 오르면 말하고, 자막·채팅으로 함께 — 방장은 🎭 게임" },
        ],
      },
    ],
    "ai-call": [
      {
        id: "talk",
        title: "📞 {ui:callModeTalk}",
        covers: ["call.talk"],
        slides: [
          { shot: "call-talk-1", title: "자유대화", desc: "튜터와 하고 싶은 이야기를 편하게 해요" },
          { shot: "call-talk-2", title: "고친 말은 카드로", desc: "말을 끊지 않고, 고친 말은 내 얼굴 아래 카드로 보여요" },
        ],
      },
      {
        id: "lesson",
        title: "🎓 {ui:callModeStudy}",
        covers: ["call.coach"],
        slides: [
          { shot: "call-lesson-1", title: "수업", desc: "튜터가 문장구조 하나를 칠판에 보여 주고, 그 틀로 내 이야기를 하게 해요" },
          { shot: "call-lesson-2", title: "틀리면 짚고 다시", desc: "큰 실수는 튜터가 짚어 주고 다시 말해 봐요 — 끝나면 숙제가 생겨요" },
        ],
      },
      {
        id: "twenty",
        title: "🎲 {ui:callModeGame}",
        slides: [{ shot: "call-game-1", title: "게임 · 스무고개", desc: "튜터가 떠올린 것을 예/아니오 질문 20번 안에 맞혀요" }],
      },
      {
        id: "teach",
        title: "🧑‍🏫 {ui:gameTeach}",
        slides: [{ shot: "call-teach-1", title: "가르치기", desc: "튜터가 한국어를 배우는 학생 — 튜터의 한국어 문장을 보고 영어로 고쳐 주고 설명해요" }],
      },
      {
        id: "past",
        title: "{ui:callRecordsTitle}",
        covers: ["call.review", "call.pause"],
        slides: [
          { shot: "call-past-1", title: "돌아보기", desc: "지난 통화를 다시 보고, 내가 하려던 말을 고친 문장으로 확인해요" },
          { shot: "call-past-2", title: "통화 정리", desc: "고친 말을 한곳에 — 칩을 누르면 그 문장구조·문법 수업" },
        ],
      },
    ],
    my: [
      {
        id: "keep",
        title: "{ui:keepTitle}",
        covers: ["my.start", "my.next", "my.map"],
        slides: [
          { shot: "my-keep-1", title: "Quizbank", desc: "퀴즈를 한 흐름으로 풀어요 — − · + 로 쉽게·어렵게" },
          { shot: "my-keep-2", title: "맞힐수록 다음 단계로", desc: "같은 문법·표현을 맞히면 한 단계씩 어려워지고, 틀리면 그 단계에서 다른 문장으로 다시" },
          { shot: "my-keep-3", title: "부족한 곳을 계속 채워요", desc: "틀린 것, [다시]를 누른 것, 대화에서 막힌 것을 다시 내고, 자주 틀리는 종류를 더 많이 내요" },
        ],
      },
      {
        id: "lang",
        title: "{ui:languagebankTitle}",
        slides: [
          { shot: "my-lang-1", title: "Languagebank", desc: "배울 단어·표현·문법이 단계별로 — 찾기도 여기서" },
          { shot: "my-lang-2", title: "묶음 ▶ 넘겨 보기", desc: "주제·단계 묶음을 카드로 넘기며 뜻·단어·예문을 떠올려요" },
          { shot: "my-lang-3", title: "단어 화면", desc: "한 단어의 뜻 여러 개와 예문을 한눈에" },
        ],
      },
      {
        id: "log",
        title: "{ui:logbankTitle}",
        covers: ["my.growth", "my.graph", "my.element"],
        slides: [
          { shot: "my-log-1", title: "Logbank", desc: "주·월마다 배운 것 — 퀴즈로 배운 수(학습), 대화에서 쓴 수(활용)" },
          { shot: "my-log-2", title: "그날 학습", desc: "날을 누르면 언제 무엇을 했는지 시간 순서로" },
          { shot: "my-log-3", title: "맞음 ✓ · 틀림 ✗", desc: "한 번 한 공부의 단어·문법·표현마다 결과가 남아요" },
        ],
      },
    ],
  },
};

/** 이 앱 언어로 그림이 있는 장만(없으면 undefined). */
export function guideSlides(language: string): Record<string, GuideSlideGroup[]> | undefined {
  return SLIDES[language];
}
