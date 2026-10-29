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

export const GUIDE_VERSION = "2026-10-29y";

export type GuideTabId = "map" | "chat" | "roleplay" | "video" | "vocab" | "rooms" | "talk";

export type GuideSection = {
  heading: string;
  body: string[];
  /**
   * A picture of this step, taken in each interface language:
   * /guide/<locale>/<shot>.webp (scripts/capture-whats-new.mjs guide).
   * Builds before 2.67 ignore it and show the text alone.
   */
  shot?: string;
  /**
   * 끌기처럼 그림으로는 안 보이는 동작의 짧은 영상: /guide/<locale>/<clip>.mp4(같은 캡처 스크립트).
   * 글마다 쓰지 않고 GUIDE_CLIPS에서 칸 id로 붙인다. 영상이 없으면 그림(shot)을 보여 준다.
   */
  clip?: string;
};

export type GuideTab = { title: string; sections: GuideSection[] };

export type Guide = Record<GuideTabId, GuideTab>;

/**
 * 칸마다 바뀌지 않는 이름(2026-10-20). 글은 탭 순서대로 쓰여 있고(옛 빌드가 그대로 받는다),
 * 새 앱은 이 이름으로 칸을 집어 기능별 묶음(GUIDE_CHAPTERS)으로 보고, 새로워진 점이 칸을 가리킨다.
 * 순서는 각 탭 `sections`와 같다 — 칸을 더하거나 빼면 여기도 같이(테스트가 길이를 맞춘다).
 */
export const GUIDE_SECTION_IDS: Record<GuideTabId, string[]> = {
  map: ["my.start", "my.next", "my.growth", "my.graph", "my.element", "my.ask", "my.map", "my.notes", "my.more"],
  chat: ["chat.next", "chat.talk", "chat.stuck", "chat.meaning", "chat.analyse", "chat.words", "chat.menu", "chat.history", "chat.more"],
  roleplay: ["call.pack", "call.talk", "call.review", "call.ownline", "call.pause", "call.time"],
  video: ["video.library", "video.subtitles", "video.bar", "video.ask", "video.import", "video.edit"],
  vocab: ["words.find", "words.saved", "words.learn", "words.script"],
  rooms: [
    "room.find",
    "room.layouts",
    "room.quote",
    "room.stuck",
    "room.game",
    "room.mafia",
    "room.watch",
    "room.host",
    "people.find",
    "people.invite",
    "people.rewards",
    "messages.dm",
    "messages.groups",
    "people.board",
    // 아이콘 묶음(2026-10-23): 그 화면이 있는 빌드(`icons=1`)만 — 옛 빌드엔 서버가 뺀다(api/guide).
    "people.icons",
  ],
  // 2.70 하단 탭(대화 목록): 따로 둔 키라 이 키를 모르는 옛 빌드의 채팅 안내에는 섞이지 않는다.
  talk: ["talk.list"],
};

/**
 * 사용법 창 하나의 기능별 묶음. 탭 구조가 바뀌면 여기서 칸을 옮기고 `go`만 바꾼다 —
 * 글에는 가는 길을 쓰지 않는다(hub/DESIGN.md "안내 글"). 제목은 화면의 탭·버튼 이름 그대로({ui:…}).
 * `go`: "이 화면으로 가기"가 여는 곳(AppHome 탭, notes = My의 노트).
 */
export type GuideGo = "chat" | "roleplay" | "talk" | "video" | "people" | "rooms" | "map" | "notes";
export type GuideChapterSpec = { id: string; title: string; go: GuideGo; sections: string[] };

export const GUIDE_CHAPTERS: GuideChapterSpec[] = [
  { id: "ai-chat", title: "{ui:talkAiTutor}", go: "chat", sections: GUIDE_SECTION_IDS.chat },
  { id: "ai-call", title: "{ui:talkAiCall}", go: "roleplay", sections: GUIDE_SECTION_IDS.roleplay },
  // 대화 목록(AI 튜터 + 사람): 사람 기능이 꺼진 빌드(iOS 1차)엔 목록이 없어 이 묶음째 안 보인다.
  { id: "messages", title: "{ui:homeTabTalk}", go: "talk", sections: ["talk.list", "messages.dm", "messages.groups"] },
  { id: "video", title: "{ui:homeTabVideo}", go: "video", sections: GUIDE_SECTION_IDS.video },
  { id: "people", title: "{ui:homeTabPeople}", go: "people", sections: ["people.find", "people.invite", "people.rewards", "people.board", "people.icons"] },
  { id: "rooms", title: "{ui:homeTabRooms}", go: "rooms", sections: ["room.find", "room.layouts", "room.quote", "room.stuck", "room.game", "room.mafia", "room.watch", "room.host"] },
  { id: "my", title: "{ui:homeTabProfile}", go: "map", sections: GUIDE_SECTION_IDS.map.filter((id) => id !== "my.notes") },
  { id: "notes", title: "{ui:notesTitle}", go: "notes", sections: ["my.notes", ...GUIDE_SECTION_IDS.vocab] },
];

export type GuideChapter = { id: string; title: string; go: GuideGo; sections: (GuideSection & { id: string })[] };

/** 영상이 있는 칸(2026-10-20): 점을 끌어 부분을 고르는 두 곳. 2026-10-29부터 조작 + 자막 설명 영상(scripts/guide-clips.mjs). */
export const GUIDE_CLIPS: Record<string, string> = {
  "chat.analyse": "chat-ask",
  "video.ask": "video-ask",
  "my.map": "my-today",
};

/** 그 화면이 있는 빌드만 받는 영상: 칸 id → 빌드가 /api/guide에 보내는 표시(없으면 영상을 빼고 그림만). */
export const GUIDE_CLIPS_SINCE: Record<string, string> = {
  "my.map": "r281",
};

/** 한 언어의 글에서 칸 하나(없으면 null). */
export function guideSection(guide: Guide, id: string): (GuideSection & { id: string }) | null {
  for (const tab of Object.keys(GUIDE_SECTION_IDS) as GuideTabId[]) {
    const at = GUIDE_SECTION_IDS[tab].indexOf(id);
    const section = at >= 0 ? guide[tab]?.sections[at] : undefined;
    if (section) return { ...section, id, ...(GUIDE_CLIPS[id] ? { clip: GUIDE_CLIPS[id] } : {}) };
  }
  return null;
}

/** 한 언어의 글을 기능별 묶음으로. 그 언어에 없는 칸은 빠진다. */
export function guideChapters(guide: Guide): GuideChapter[] {
  return GUIDE_CHAPTERS.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    go: chapter.go,
    sections: chapter.sections.map((id) => guideSection(guide, id)).filter((row): row is GuideSection & { id: string } => row !== null),
  })).filter((chapter) => chapter.sections.length > 0);
}

export const GUIDE_KO: Guide = {
  "map": {
    "title": "My 사용법",
    "sections": [
      {
        "heading": "1. 대화로 시작",
        "body": [
          "예시 대화로 시작 단계를 골라요. 글자가 다른 언어는 ‘{ui:scriptEntry}’."
        ],
        "shot": "stage-start"
      },
      {
        "heading": "2. {ui:keepTitle}",
        "body": [
          "‘{ui:studyReview}’ · ‘{ui:studyRandom}’ · ‘{ui:partVocab}’ · ‘{ui:partGrammar}’ · ‘{ui:partExpression}’ → ▶ ‘{ui:studyMore}’"
        ],
        "shot": "keep-learning"
      },
      {
        "heading": "3. 자라는 중",
        "body": [
          "네 갈래가 이 단계에서 얼마나 찼는지(점선 = 다음 단계). 누르면 그 칸에서 공부한 것."
        ],
        "shot": "parts-net"
      },
      {
        "heading": "4. 그래프로 보기",
        "body": [
          "최근 2주 하루하루. 막대를 누르면 그날 공부한 것."
        ],
        "shot": "parts-graph"
      },
      {
        "heading": "5. 다음 단계로",
        "body": [
          "네 갈래 70% + 그 단계 학습을 모두 통과하면 다음 단계예요."
        ],
        "shot": "stage-next"
      },
      {
        "heading": "6. 직접 묻기",
        "body": [
          "내 기록으로 답해요(질문 1번 = 채팅 1회)."
        ],
        "shot": "myask"
      },
      {
        "heading": "7. 단계로 보기",
        "body": [
          "학습마다 듣고 내 줄을 🎤로, 또는 🎤 없이 ‘{ui:scriptModeChoose}’·‘{ui:scriptModeOrder}’로. 통과로 셀 방식은 ‘{ui:passRuleTitle}’ ‘{ui:passRuleSpeak}’ | ‘{ui:passRuleAny}’."
        ],
        "shot": "stage-scripts"
      },
      {
        "heading": "8. 노트",
        "body": [
          "튜터가 고친 줄을 골라 ‘{ui:notebookAddToNotes}’."
        ],
        "shot": "notebook-today"
      },
      {
        "heading": "그 밖에",
        "body": [
          "‘{ui:feedbackOpen}’로 보낸 의견이 반영되면 3~20포인트."
        ]
      }
    ]
  },
  "chat": {
    "title": "채팅 사용법",
    "sections": [
      {
        "heading": "오늘 해볼 것으로 시작",
        "body": [
          "‘{ui:nextByChat}’을 누르면 튜터가 그 상황으로 먼저 말을 걸어요."
        ],
        "shot": "chatnext"
      },
      {
        "heading": "배우는 언어로 대화하기",
        "body": [
          "배우는 언어로 쓰면 튜터가 답하고, 틀린 곳은 ‘{ui:chatCorrectionChip}’로 알려 줘요."
        ],
        "shot": "chat-fix"
      },
      {
        "heading": "막히면 내 언어로",
        "body": [
          "막히면 내 언어로 쓰고 ‘{ui:chatShowExpression}’을 눌러요."
        ],
        "shot": "chat-expression"
      },
      {
        "heading": "뜻 보기와 듣기",
        "body": [
          "‘{ui:chatReading}’은 뜻, 🔊는 소리예요."
        ],
        "shot": "chat-reading"
      },
      {
        "heading": "문장 분석과 질문",
        "body": [
          "문장 왼쪽 막대를 누르고, 점을 끌어 고른 뒤 물어봐요."
        ],
        "shot": "chat-ask"
      },
      {
        "heading": "단어를 눌러 단어장에",
        "body": [
          "낱말을 누르고 ‘{ui:vocabPreviewSave}’."
        ],
        "shot": "chat-word"
      },
      {
        "heading": "메뉴",
        "body": [
          "⋮ → ‘{ui:chatHistoryTitle}’ · ‘{ui:endSession}’ · ‘{ui:reportTitle}’"
        ],
        "shot": "chat-menu"
      },
      {
        "heading": "지난 대화 이어 하기",
        "body": [
          "지난 대화를 골라 ‘{ui:chatHistoryContinue}’."
        ],
        "shot": "chat-history"
      },
      {
        "heading": "그 밖에",
        "body": [
          "하루 채팅: {ui:planScriptName} 20 · {ui:planLiteName} 30 · {ui:planPlusName} 50 · 프리미엄 100번."
        ]
      }
    ]
  },
  "roleplay": {
    "title": "통화 사용법",
    "sections": [
      {
        "heading": "{ui:packTitle}",
        "body": [
          "통화 시간을 쓰지 않는 약 7분 대화예요."
        ],
        "shot": "call-pack"
      },
      {
        "heading": "말로 대화하기",
        "body": [
          "튜터가 먼저 말하고, 내가 말을 멈추면 내 차례가 끝나요."
        ],
        "shot": "call-talk"
      },
      {
        "heading": "끝난 대화 돌아보기",
        "body": [
          "‘{ui:packSeeRetro}’로 고친 문장을 보고, ‘{ui:roleplaySayAgain}’로 다시 말해요."
        ],
        "shot": "call-review"
      },
      {
        "heading": "{ui:roleplayOwnLineOpen}",
        "body": [
          "문장을 넣고 ‘{ui:roleplayOwnLineUse}’ → 듣고 따라 말해요."
        ],
        "shot": "call-ownline"
      },
      {
        "heading": "멈추고 이어서 하기",
        "body": [
          "지금 ‘{ui:roleplayPause}’, 나중에 ‘{ui:roleplayResume}’."
        ]
      },
      {
        "heading": "통화 시간",
        "body": [
          "자유 통화: {ui:planScriptName} 사흘마다 5분 · 매일 {ui:planLiteName} 7 · {ui:planPlusName} 10 · 프리미엄 15분."
        ]
      }
    ]
  },
  "video": {
    "title": "영상 학습 사용법",
    "sections": [
      {
        "heading": "{ui:videoLearnLibraryTitle}",
        "body": [
          "이달의 영상: 무료 3편, 프리미엄은 전체."
        ],
        "shot": "video-library"
      },
      {
        "heading": "자막은 배우는 언어로만",
        "body": [
          "자막은 배우는 언어로만. 문장을 누르면 그 구간만 다시 들어요."
        ],
        "shot": "video-study"
      },
      {
        "heading": "번역은 문장 왼쪽 막대로",
        "body": [
          "문장 왼쪽 막대를 누르면 이 장면에 맞게 번역해요."
        ],
        "shot": "video-bar"
      },
      {
        "heading": "궁금한 부분 물어보기",
        "body": [
          "점을 끌어 고르고 물어봐요."
        ],
        "shot": "video-ask"
      },
      {
        "heading": "내 영상 가져오기",
        "body": [
          "YouTube 링크를 붙여 넣으면 자막을 만들어요(프리미엄, 3분에 1포인트, 15분까지)."
        ]
      },
      {
        "heading": "구간 묶기·쪼개기와 저장",
        "body": [
          "구간을 합치거나 쪼갠 뒤 ‘{ui:videoLearnSaveSession}’ — 다시 볼 땐 포인트가 들지 않아요."
        ]
      }
    ]
  },
  "vocab": {
    "title": "단어장 사용법",
    "sections": [
      {
        "heading": "찾고 저장하기",
        "body": [
          "내 언어로 찾고 ‘{ui:vocabSave}’."
        ],
        "shot": "vocab-search"
      },
      {
        "heading": "저장한 단어",
        "body": [
          "‘{ui:linkFindScenes}’을 누르면 그 단어가 나온 영상 장면으로."
        ],
        "shot": "vocab-saved"
      },
      {
        "heading": "외우기",
        "body": [
          "‘{ui:vocabHideGloss}’를 켜고 외워요."
        ],
        "shot": "vocab-hide"
      },
      {
        "heading": "글자 익히기",
        "body": [
          "글자를 누르면 발음과 쓰임이 나와요."
        ],
        "shot": "vocab-characters"
      }
    ]
  },
  "rooms": {
    "title": "말하는 방 사용법",
    "sections": [
      {
        "heading": "방 찾고 들어가기",
        "body": [
          "방을 누르면 참여 요청, 방장이 자리에 올려 주면 말해요."
        ],
        "shot": "r69-free"
      },
      {
        "heading": "참여 방식·보는 방식",
        "body": [
          "위에서 보는 방식, 아래에서 참여 방식을 골라요."
        ],
        "shot": "r69-layouts"
      },
      {
        "heading": "줄을 집어서 묻기",
        "body": [
          "줄을 누르면 번역, 그 줄로 묻거나 답해요."
        ],
        "shot": "r69-quote"
      },
      {
        "heading": "말이 막힐 때",
        "body": [
          "편한 말로 쓰면 배우는 언어 문장으로 바꿔 줘요."
        ],
        "shot": "r69-hint"
      },
      {
        "heading": "라이어 게임",
        "body": [
          "방장이 🎭 → 라이어 게임(3명 이상). 라이어만 제시어를 몰라요."
        ],
        "shot": "room-game"
      },
      {
        "heading": "마피아",
        "body": [
          "🎭 → 마피아(5명 이상). 밤엔 고르고, 낮엔 배우는 언어로 이야기한 뒤 투표해요."
        ]
      },
      {
        "heading": "관전자 추리",
        "body": [
          "듣는 사람은 🔮로 추리해요. 누가 맞혔는지는 끝나고 나와요."
        ],
        "shot": "room-game"
      },
      {
        "heading": "방장이라면",
        "body": [
          "빈자리를 눌러 사람을 올리고, 🔒로 자리를 막아요."
        ],
        "shot": "r69-host"
      },
      {
        "heading": "사람 찾기",
        "body": [
          "프로필을 눌러 팔로우·메시지. 맨 위는 AI 튜터예요."
        ],
        "shot": "people-ai"
      },
      {
        "heading": "친구 초대",
        "body": [
          "➕로 링크를 보내요. 받은 사람은 로그인만 하면 들어와요."
        ],
        "shot": "people-invite"
      },
      {
        "heading": "친구 초대 보상",
        "body": [
          "친구가 일주일 안에 이틀 쓰면 둘 다 포인트를 받아요."
        ],
        "shot": "invite-rewards"
      },
      {
        "heading": "메시지와 통화",
        "body": [
          "첫 메시지는 요청으로 가요. 📞로 통화하고, 카메라는 켜고 싶을 때만."
        ],
        "shot": "talk-dm"
      },
      {
        "heading": "단체방과 단체 통화",
        "body": [
          "팔로우한 사람을 최대 20명까지 모아요. 📞로 같이 통화해요."
        ],
        "shot": "r69-groups"
      },
      {
        "heading": "게시판",
        "body": [
          "배우는 언어마다 게시판이 따로. 위 칩으로 글 종류를 골라요."
        ],
        "shot": "board-topics"
      },
      {
        "heading": "아이콘",
        "body": [
          "묶음을 받으면 🙂에서 보내요. 직접 만들어 올리거나 팔 수도 있어요."
        ],
        "shot": "people-icons"
      }
    ]
  },
  "talk": {
    "title": "대화 사용법",
    "sections": [
      {
        "heading": "대화 목록",
        "body": [
          "맨 위 AI 튜터, 그 아래 단체방과 1:1 메시지."
        ],
        "shot": "talk-calls"
      }
    ]
  }
};

export const GUIDE_EN: Guide = {
  "map": {
    "title": "Using My",
    "sections": [
      {
        "heading": "1. Start with a conversation",
        "body": [
          "Pick a starting stage from sample conversations. Languages with a new script start with ‘{ui:scriptEntry}’."
        ],
        "shot": "stage-start"
      },
      {
        "heading": "2. {ui:keepTitle}",
        "body": [
          "‘{ui:studyReview}’ · ‘{ui:studyRandom}’ · ‘{ui:partVocab}’ · ‘{ui:partGrammar}’ · ‘{ui:partExpression}’ → ▶ ‘{ui:studyMore}’"
        ],
        "shot": "keep-learning"
      },
      {
        "heading": "3. Growing",
        "body": [
          "How full the four parts are at this stage (dotted line = next stage). Tap one to see what you studied."
        ],
        "shot": "parts-net"
      },
      {
        "heading": "4. As a graph",
        "body": [
          "The last two weeks, day by day. Tap a bar for what you studied that day."
        ],
        "shot": "parts-graph"
      },
      {
        "heading": "5. To the next stage",
        "body": [
          "Move on at 70% in all four parts with every script in the stage passed."
        ],
        "shot": "stage-next"
      },
      {
        "heading": "6. Ask",
        "body": [
          "Answers from your record (one question = one chat)."
        ],
        "shot": "myask"
      },
      {
        "heading": "7. Stages",
        "body": [
          "Listen and say your lines with 🎤, or without it in ‘{ui:scriptModeChoose}’ and ‘{ui:scriptModeOrder}’. ‘{ui:passRuleTitle}’ ‘{ui:passRuleSpeak}’ | ‘{ui:passRuleAny}’ sets what counts."
        ],
        "shot": "stage-scripts"
      },
      {
        "heading": "8. Notes",
        "body": [
          "Pick lines the tutor fixed, then ‘{ui:notebookAddToNotes}’."
        ],
        "shot": "notebook-today"
      },
      {
        "heading": "Also",
        "body": [
          "3–20 points when feedback sent with ‘{ui:feedbackOpen}’ makes it into the app."
        ]
      }
    ]
  },
  "chat": {
    "title": "How to use Chat",
    "sections": [
      {
        "heading": "Start from Try this",
        "body": [
          "Tap ‘{ui:nextByChat}’ and the tutor opens with that situation."
        ],
        "shot": "chatnext"
      },
      {
        "heading": "Chat in the language you're learning",
        "body": [
          "Write in the language you're learning; mistakes show up as ‘{ui:chatCorrectionChip}’."
        ],
        "shot": "chat-fix"
      },
      {
        "heading": "Stuck? Use your own language",
        "body": [
          "Stuck? Write in your own language and tap ‘{ui:chatShowExpression}’."
        ],
        "shot": "chat-expression"
      },
      {
        "heading": "See the meaning, hear it",
        "body": [
          "‘{ui:chatReading}’ shows the meaning; 🔊 reads it aloud."
        ],
        "shot": "chat-reading"
      },
      {
        "heading": "Look into a sentence and ask",
        "body": [
          "Tap the bar left of a line, drag the dots to pick a part, then ask."
        ],
        "shot": "chat-ask"
      },
      {
        "heading": "Tap a word to save it",
        "body": [
          "Tap a word, then ‘{ui:vocabPreviewSave}’."
        ],
        "shot": "chat-word"
      },
      {
        "heading": "The menu",
        "body": [
          "⋮ → ‘{ui:chatHistoryTitle}’ · ‘{ui:endSession}’ · ‘{ui:reportTitle}’"
        ],
        "shot": "chat-menu"
      },
      {
        "heading": "Pick up a past chat",
        "body": [
          "Pick a past chat, then ‘{ui:chatHistoryContinue}’."
        ],
        "shot": "chat-history"
      },
      {
        "heading": "Also",
        "body": [
          "Chats a day: {ui:planScriptName} 20 · {ui:planLiteName} 30 · {ui:planPlusName} 50 · Premium 100."
        ]
      }
    ]
  },
  "roleplay": {
    "title": "How to use Calls",
    "sections": [
      {
        "heading": "{ui:packTitle}",
        "body": [
          "About 7 minutes of talk that doesn't use your call time."
        ],
        "shot": "call-pack"
      },
      {
        "heading": "Talk out loud",
        "body": [
          "The tutor speaks first; your turn ends when you stop talking."
        ],
        "shot": "call-talk"
      },
      {
        "heading": "Look back at a finished call",
        "body": [
          "‘{ui:packSeeRetro}’ shows the fixed lines; ‘{ui:roleplaySayAgain}’ to say them again."
        ],
        "shot": "call-review"
      },
      {
        "heading": "{ui:roleplayOwnLineOpen}",
        "body": [
          "Type a line, tap ‘{ui:roleplayOwnLineUse}’, then listen and repeat."
        ],
        "shot": "call-ownline"
      },
      {
        "heading": "Pause and carry on",
        "body": [
          "‘{ui:roleplayPause}’ now, ‘{ui:roleplayResume}’ later."
        ]
      },
      {
        "heading": "Call time",
        "body": [
          "Free calls: {ui:planScriptName} 5 min every 3 days · daily {ui:planLiteName} 7 · {ui:planPlusName} 10 · Premium 15 min."
        ]
      }
    ]
  },
  "video": {
    "title": "How to use Video",
    "sections": [
      {
        "heading": "{ui:videoLearnLibraryTitle}",
        "body": [
          "This month's videos: 3 free, all of them with Premium."
        ],
        "shot": "video-library"
      },
      {
        "heading": "Subtitles in the language you're learning",
        "body": [
          "Subtitles only in the language you're learning; tap a line to replay it."
        ],
        "shot": "video-study"
      },
      {
        "heading": "The bar beside a line translates it",
        "body": [
          "Tap the bar left of a line for a translation that fits the scene."
        ],
        "shot": "video-bar"
      },
      {
        "heading": "Ask about any part",
        "body": [
          "Drag the dots to pick a part, then ask."
        ],
        "shot": "video-ask"
      },
      {
        "heading": "Bring your own video",
        "body": [
          "Paste a YouTube link to get subtitles (Premium, 1 point per 3 min, up to 15 min)."
        ]
      },
      {
        "heading": "Group, split and save",
        "body": [
          "Merge or split lines, then ‘{ui:videoLearnSaveSession}’ — rewatching costs no points."
        ]
      }
    ]
  },
  "vocab": {
    "title": "How to use Vocabulary",
    "sections": [
      {
        "heading": "Find and save",
        "body": [
          "Search in your own language, then ‘{ui:vocabSave}’."
        ],
        "shot": "vocab-search"
      },
      {
        "heading": "Your saved words",
        "body": [
          "‘{ui:linkFindScenes}’ opens a video scene with the word."
        ],
        "shot": "vocab-saved"
      },
      {
        "heading": "Learn them",
        "body": [
          "Turn on ‘{ui:vocabHideGloss}’ to test yourself."
        ],
        "shot": "vocab-hide"
      },
      {
        "heading": "Learn the script",
        "body": [
          "Tap a character to see its sound and use."
        ],
        "shot": "vocab-characters"
      }
    ]
  },
  "rooms": {
    "title": "How to use Rooms",
    "sections": [
      {
        "heading": "Find a room and join",
        "body": [
          "Tap a room to ask to join; speak once the host brings you up."
        ],
        "shot": "r69-free"
      },
      {
        "heading": "Join and view your way",
        "body": [
          "Choose how to view at the top and how to take part at the bottom."
        ],
        "shot": "r69-layouts"
      },
      {
        "heading": "Pick a line and ask",
        "body": [
          "Tap a line to translate it, then ask or reply about it."
        ],
        "shot": "r69-quote"
      },
      {
        "heading": "When the words won’t come",
        "body": [
          "Write it your way and get it in the language you're learning."
        ],
        "shot": "r69-hint"
      },
      {
        "heading": "Liar game",
        "body": [
          "The host taps 🎭 → Liar game (3+ players). Only the liar doesn't know the word."
        ],
        "shot": "room-game"
      },
      {
        "heading": "Mafia",
        "body": [
          "🎭 → Mafia (5+ players). Choose at night, talk in the language you're learning by day, then vote."
        ]
      },
      {
        "heading": "Spectator guesses",
        "body": [
          "Listeners guess with 🔮; who got it right shows at the end."
        ],
        "shot": "room-game"
      },
      {
        "heading": "If you’re the host",
        "body": [
          "Tap an empty seat to bring someone up; lock seats with 🔒."
        ],
        "shot": "r69-host"
      },
      {
        "heading": "Find people",
        "body": [
          "Tap a profile to follow or message. The AI tutor is at the top."
        ],
        "shot": "people-ai"
      },
      {
        "heading": "Invite friends",
        "body": [
          "Send a link with ➕; your friend just signs in to join."
        ],
        "shot": "people-invite"
      },
      {
        "heading": "Invite rewards",
        "body": [
          "You both get points when your friend uses the app on 2 days within a week."
        ],
        "shot": "invite-rewards"
      },
      {
        "heading": "Messages and calls",
        "body": [
          "Your first message goes as a request. 📞 to call; the camera is up to you."
        ],
        "shot": "talk-dm"
      },
      {
        "heading": "Group chats and group calls",
        "body": [
          "Bring together up to 20 people you follow; 📞 to call together."
        ],
        "shot": "r69-groups"
      },
      {
        "heading": "Board",
        "body": [
          "One board per language you learn; filter posts with the chips on top."
        ],
        "shot": "board-topics"
      },
      {
        "heading": "Icons",
        "body": [
          "Get a pack to send it from 🙂. You can also make, share or sell your own."
        ],
        "shot": "people-icons"
      }
    ]
  },
  "talk": {
    "title": "How to use Chats",
    "sections": [
      {
        "heading": "Your chats",
        "body": [
          "The AI tutor on top, then group chats and one-to-one messages."
        ],
        "shot": "talk-calls"
      }
    ]
  }
};
