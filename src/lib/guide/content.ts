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

export const GUIDE_VERSION = "2026-10-29a";

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

/** 영상이 있는 칸(2026-10-20): 점을 끌어 부분을 고르는 두 곳. */
export const GUIDE_CLIPS: Record<string, string> = {
  "chat.analyse": "chat-ask",
  "video.ask": "video-ask",
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
  map: {
    title: "My 사용법",
    sections: [
      {
        heading: "1. 대화로 시작",
        body: [
          "‘{ui:stageCheckTitle}’ 대화를 보고 ‘{ui:stageCan}’·‘{ui:stageAlmost}’·‘{ui:stageHard}’로 답하면 시작할 단계를 찾아요. ‘{ui:stageBegin}’을 누르면 그 단계의 대본으로 바로 시작해요. 단계는 위 ‘{ui:stageRechoose}’로 다시 골라요.",
        ],
        shot: "stage-start",
      },
      {
        heading: "2. 오늘 해볼 것",
        body: [
          "쌓인 기록으로 지금 할 것 하나를 권해요. ‘{ui:nextByChat}’이나 ‘{ui:nextByCall}’을 누르면 그 상황으로 대화가 바로 시작돼요.",
        ],
        shot: "next",
      },
      {
        heading: "3. 자라는 중",
        body: [
          "‘{ui:partVocab}’·‘{ui:partGrammar}’·‘{ui:partExpression}’·‘{ui:partPronunciation}’ 네 칸이 지금 단계에서 얼마나 찼는지 보여요. 점선이 다음 단계 기준이고, 가장 부족한 칸은 노란 글씨예요.",
          "칸을 누르면 최근 2주에 그 칸에서 무엇을 공부했는지 날짜별로 보여요 — ‘{ui:itemsLearned}’·‘{ui:itemsMastered}’·‘{ui:partFixed}’(튜터가 고친 줄)과 어디서 했는지. 아래는 그 칸 전체, 낱말을 누르면 자세히. ‘{ui:partOpenStage}’로 단계 보기의 그 칸.",
        ],
        shot: "parts-net",
      },
      {
        heading: "4. 그래프로 보기",
        body: [
          "‘{ui:myViewGraph}’을 누르면 네 칸이 최근 2주 하루하루 얼마나 늘었는지 막대로 보여요. 막대를 누르면 그날 공부한 것만, 칸 이름을 누르면 2주 전부. 고른 보기는 다음에도 그대로예요.",
        ],
        shot: "parts-graph",
      },
      {
        heading: "5. 다음 단계로",
        body: [
          "‘{ui:myViewMap}’ 맨 위에 가장 부족한 칸이 보여요. 옆 버튼으로 바로 연습해요 — ‘{ui:partPronunciation}’은 ‘{ui:nextByCall}’, 나머지는 ‘{ui:nextByChat}’.",
          "튜터가 최근 2주에 같은 칸을 세 번 이상 고쳤으면 그 칸이 먼저 나와요(고친 줄은 칸을 채우지 않아요). 한 표현이 여러 문법을 함께 쓰면 그 칸들이 같이 차요.",
          "네 칸이 모두 70%를 넘으면 ‘{ui:partReady}’가 켜져요. 다시 말해보기를 한 번도 안 했으면 ‘{ui:partPronunciation}’은 ‘{ui:myNoData}’로 두고 셈에서 빼요.",
        ],
        shot: "stage-next",
      },
      {
        heading: "6. 직접 묻기",
        body: [
          "‘{ui:myAskQuick1}’처럼 물으면 내 기록으로 답해요. 질문 1번은 채팅 1회예요.",
        ],
        shot: "myask",
      },
      {
        heading: "7. 단계로 보기",
        body: [
          "‘{ui:myViewMap}’에는 단계가 1부터 5까지 이어져 있어요. 번호를 누르면 그 단계를 미리 봐요.",
          "칸을 누르면 펼쳐져요. ‘{ui:partVocab}’은 익힌 낱말과 단어장, ‘{ui:partGrammar}’은 그 단계 문법 칸(✓·‘{ui:stageTry}’), ‘{ui:partExpression}’은 핵심 표현과 ‘{ui:notebookIdioms}’ 칸, ‘{ui:partPronunciation}’은 그 단계 발음 포인트와 글자·소리 칸. 쓸 수 있게 된 표현과 노트에 넣은 장면이 맞는 칸을 채워요.",
          "아래 ‘{ui:stageExamplesTitle}’에서 그 단계로 되는 대화를 보고 ‘{ui:stageTry}’로 해 봐요.",
          "단계 맨 위 ‘{ui:stageScriptsTitle}’: 대본을 들으면 내 줄에서 멈춰요. 보는 방식(‘{ui:scriptModeShadow}’·‘{ui:scriptModeHint}’·‘{ui:scriptModeHide}’·‘{ui:scriptModeOwn}’)을 고르고 🎤로 말해요. 따라 말하기 말고 다른 방식으로 내 줄을 모두 맞히면 그 대본은 통과 — 다음 단계는 네 갈래 70%와 그 단계 대본을 모두 통과한 것이 함께 있어야 열려요. 3~4단계 상대 말은 할 때마다 조금 바뀌고, 5단계는 대본 뒤 ‘{ui:scriptCall}’로 같은 상황을 통화로. 대본마다 그 단계 핵심 표현이 붙어 있고, 통과하면 그 표현이 표현 갈래에 쌓여요. 상황 대본에 없는 표현은 아래 ‘{ui:scriptsByExpression}’의 짧은 대본으로. 맨 위 ‘{ui:planTitle}’은 하루 분량(분)을 고르면 며칠에 끝나는지 보여 주고, ‘{ui:planOrderCurriculum}’ 또는 ‘{ui:planOrderRecord}’로 오늘 할 대본·문장구조를 골라 줘요. 대본·문장구조 끝에서 표현마다 ‘{ui:checkKnown}’·‘{ui:checkUnsure}’를 누르면, 헷갈린 것과 대본에서 같은 줄을 두 번 틀린 곳, 튜터가 두 번 고친 문장구조는 2일 뒤 ‘{ui:quizTag}’로 돌아와요 — 문제 셋(틀린 곳·빈칸·순서 중 둘과 말하기) 중 둘을 맞히면 7일 뒤 한 번 더, 아니면 ‘{ui:quizToScript}’로 원래 대본을 해요. 중간에 닫아도 그날 안에 다시 열면 ‘{ui:scriptResume}’로 하던 줄부터 이어 가요. 그날 분량을 다 하면 ‘{ui:learnedTitle}’에 문장구조·문법·단어가 모이고, 라이트·플러스·프리미엄이면 그 아래에서 바로 물어볼 수 있어요(질문 1번은 채팅 1회). 물어본 곳은 2일 뒤 ‘{ui:planAgain}’로 돌아와요. 배운 칩을 누르면 오늘 한 대본 중 어디에 어떤 문장으로 나왔는지 보이고, 누르면 그 대본으로 가요. 맨 위 ‘{ui:weakTitle}’에는 튜터가 고친 내 줄, 대본에서 틀린 줄(◐), 헷갈린 것이 모이고 누르면 그 대본으로 가요. ‘{ui:morningSetting}’을 켜면 아침마다 그중 하나와 단어가 잠금화면에 떠요. 채팅·통화 튜터는 헷갈린 표현을 다시 쓸 기회를 만들고, 맞게 쓰면 ‘{ui:reuseDone}’가 붙어요. 아래 ‘{ui:framesTitle}’은 빈칸 하나 있는 문장구조예요. 빈칸만 바꿔 네 번 말하고, ‘{ui:frameModeBlank}’으로 다 맞히면 통과 — 끝나면 그 문장구조가 나오는 대본으로 이어 가요. 3단계부터는 ‘{ui:scriptModeOwn}’로 빈칸에 내 이야기를 넣어 말해요(1~3단계). 튜터가 2주 안에 같은 문장구조를 두 번 고치면 대본 목록 맨 위에 ◐ ‘{ui:frameRedo}’ 카드가 떠요 — 내가 쓴 줄과 고친 줄을 보고 그 문장구조를 다시 말해요. 단계 보기 맨 위 ‘{ui:scriptAmountTitle}’은 통과한 대본·문장구조로 익힌 표현·문법·문장구조 수와 말한 문장 수, ‘{ui:canDoTitle}’은 문장구조를 통과하면 켜지는 칸이에요.",
        ],
        shot: "stage-scripts",
      },
      {
        heading: "8. 노트",
        body: [
          "튜터가 고친 줄은 자라는 중 맨 위 ‘{ui:notebookToday}’에 모여요. 남길 것만 체크하고 ‘{ui:notebookAddToNotes}’ — 카드는 ‘{ui:myViewMap}’의 맞는 문법 칸에 들어가요.",
          "문법 칸을 열면 그 문법이 나오는 대본·문장구조가 보이고, 누르면 바로 열려요.",
          "문장분석에서 ‘{ui:findInMy}’를 누르면 그 부분이 어느 칸인지 찾아 그 칸을 열어요.",
        ],
        shot: "notebook-today",
      },
      {
        heading: "그 밖에",
        body: [
          "도움 없이 꺼내 쓴 표현만 숙지로 세요(레벨이 아니라 쓸 수 있게 된 표현 수). 배우는 언어마다 따로예요.",
          "‘{ui:feedbackOpen}’로 보낸 의견이 반영되면 중요도에 따라 3~20포인트를 드려요.",
        ],
      },
    ],
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
          "틀린 부분이 있으면 내 문장 아래 ‘{ui:chatCorrectionChip}’가 떠요. 누르면 고친 문장이 보이고, ⋮ 메뉴에서 ‘{ui:chatCorrectionViewAuto}’로 바꿀 수 있어요.",
        ],
        shot: "chat-fix",
      },
      {
        heading: "막히면 내 언어로",
        body: [
          "배우는 언어로 말하기 어려운 건 내 언어로 써도 돼요. 대화는 그대로 이어지고, 보낸 메시지 하나로 세요.",
          "내 문장 아래 ‘{ui:chatShowExpression}’을 누르면 배우는 언어로 어떻게 말하는지 볼 수 있고, ‘{ui:chatUseExpression}’로 바로 써볼 수 있어요.",
        ],
        shot: "chat-expression",
      },
      {
        heading: "뜻 보기와 듣기",
        body: [
          "튜터의 답 아래 ‘{ui:chatReading}’을 누르면 내 언어로 된 뜻을 볼 수 있어요.",
          "스피커 버튼을 누르면 그 문장을 소리로 들을 수 있어요.",
        ],
        shot: "chat-reading",
      },
      {
        heading: "문장 분석과 질문",
        body: [
          "문장 왼쪽의 막대를 누르면 문장 시트가 열려요. 점을 끌어 부분을 고르고 ‘{ui:quickAskMeaning}’ 같은 질문을 누르거나 직접 물어보세요. 답은 그 부분에 남아서 다음에도 볼 수 있어요.",
        ],
        shot: "chat-ask",
      },
      {
        heading: "단어를 눌러 단어장에",
        body: [
          "문장 시트에서 단어나 밑줄 친 표현을 누르면 뜻과 예문이 나와요. ‘{ui:vocabPreviewSave}’을 누르면 단어장에 들어가요.",
        ],
        shot: "chat-word",
      },
      {
        heading: "메뉴",
        body: [
          "왼쪽 위 ⋮ 메뉴에서 ‘{ui:chatHistoryTitle}’을 보거나 ‘{ui:endSession}’으로 지금 대화를 끝낼 수 있어요. 이상한 답은 ‘{ui:reportTitle}’으로 알려 주세요.",
        ],
        shot: "chat-menu",
      },
      {
        heading: "지난 대화 이어 하기",
        body: [
          "지난 대화를 골라 다시 읽고, ‘{ui:chatHistoryContinue}’로 이어서 할 수 있어요.",
        ],
        shot: "chat-history",
      },
      {
        heading: "그 밖에",
        body: [
          "무슨 말을 할지 모르겠으면 ‘{ui:chatStartCta}’를 누르세요. 튜터가 대화를 시작해요.",
          "+ 버튼으로 사진을 보내면 사진을 보며 대화할 수 있어요.",
          "채팅은 구독하면 할 수 있어요. 대본 플랜은 하루 20번, 라이트 30번, 플러스 50번, 프리미엄 100번이에요.",
        ],
      },
    ],
  },
  roleplay: {
    title: "통화 사용법",
    sections: [
      {
        heading: "{ui:packTitle}",
        body: [
          "내 기록에서 지금 가장 키울 곳을 골라 약 7분짜리 대화를 만들어요.",
          "구독하면 매일, 무료는 일주일에 2번 할 수 있고 통화 시간을 쓰지 않아요. ‘{ui:packStart}’을 누르면 시작해요.",
        ],
        shot: "call-pack",
      },
      {
        heading: "말로 대화하기",
        body: [
          "튜터가 먼저 말하고, 내가 말을 멈추면 자동으로 내 차례가 끝나요.",
          "내 말은 고칠 곳이 있을 때만 보여요. 전부 보려면 ‘{ui:roleplayMyLines}’을 켜요.",
          "주제 없이 말하고 싶으면 AI 대화 머리의 📞를 눌러요. 바로 통화가 시작돼요.",
        ],
        shot: "call-talk",
      },
      {
        heading: "끝난 대화 돌아보기",
        body: [
          "끝난 통화는 채팅과 따로 {ui:callRecordsTitle}에 모여요. 대화 탭의 {ui:talkAiCall} 줄이나 AI 대화 ⋮에서 열어요. {ui:packSeeRetro}를 누르면 내 줄 아래에 고친 문장과 원래 하려던 말이 보여요.",
          "‘{ui:roleplaySayAgain}’를 누르면 그 문장을 듣고 따라 말해, 다르게 들린 단어를 알려줘요.",
          "막혔던 차례에는 ‘{ui:roleplayWhyStuck}’ 버튼이 남아요.",
        ],
        shot: "call-review",
      },
      {
        heading: "{ui:roleplayOwnLineOpen}",
        body: [
          "연습하고 싶은 문장을 넣고 ‘{ui:roleplayOwnLineUse}’을 누르면, 들어본 뒤 따라 말할 수 있어요.",
          "어느 단어가 다르게 들렸는지 알려줘요. 통화 시간은 쓰지 않아요.",
        ],
        shot: "call-ownline",
      },
      {
        heading: "멈추고 이어서 하기",
        body: [
          "‘{ui:roleplayPause}’을 누르면 대화가 저장돼요. 다음에 {ui:callRecordsTitle}의 ‘{ui:roleplayResume}’로 계속해요.",
        ],
      },
      {
        heading: "통화 시간",
        body: [
          "무료는 통화가 없어요. My 단계 대본으로 말하기를 연습해요.",
          "대본 플랜은 사흘마다 자유 통화 5분, 라이트는 매일 7분, 플러스는 10분, 프리미엄은 15분이 있고, 다 쓰면 포인트로 이어서 해요.",
          "통화 첫 화면에 남은 시간이 보여요.",
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
        shot: "video-library",
      },
      {
        heading: "자막은 배우는 언어로만",
        body: [
          "자막은 배우는 언어로만 나와요. 먼저 귀로 듣고 읽어 보세요. 문장을 누르면 그 구간만 다시 들을 수 있어요.",
        ],
        shot: "video-study",
      },
      {
        heading: "번역은 문장 왼쪽 막대로",
        body: [
          "막히면 문장 왼쪽의 막대를 누르세요. 영상 내용과 앞뒤 대사를 보고 이 장면에 맞게 번역해 줘요.",
        ],
        shot: "video-bar",
      },
      {
        heading: "궁금한 부분 물어보기",
        body: [
          "점을 끌어 단어나 표현을 고른 뒤 ‘{ui:quickAskMeaning}’ 같은 질문을 누르거나 직접 물어보세요. 답도 이 장면에 맞춰 해 줘요.",
        ],
        shot: "video-ask",
      },
      {
        heading: "내 영상 가져오기",
        body: [
          "YouTube 링크를 붙여넣으면 배우는 언어 자막을 만들어 줘요. 프리미엄 기능이고, 영상 3분에 1포인트가 들어요. 15분까지 가능해요.",
        ],
      },
      {
        heading: "구간 묶기·쪼개기와 저장",
        body: [
          "‘{ui:videoLearnRangeMode}’로 여러 문장을 이어 듣고, 구간을 합치거나 쪼갤 수 있어요. ‘{ui:videoLearnResetAllCues}’로 언제든 되돌릴 수 있어요.",
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
          "내 언어로 단어나 표현을 검색하면 배우는 언어의 표현이 뜻·예문과 함께 나와요. ‘{ui:vocabSave}’을 누르면 단어장에 들어가요.",
          "채팅에서 눌러 저장한 단어도 여기에 모여요.",
        ],
        shot: "vocab-search",
      },
      {
        heading: "저장한 단어",
        body: [
          "단어마다 지금 상태와 마지막으로 쓴 곳이 보여요. ‘{ui:linkTry}’로 채팅에서 바로 써 보고, ‘{ui:linkFindScenes}’으로 영상에서 그 표현이 나오는 장면을 찾을 수 있어요.",
          "스피커로 발음을 듣고, 필요 없어진 단어는 지울 수 있어요.",
        ],
        shot: "vocab-saved",
      },
      {
        heading: "외우기",
        body: [
          "‘{ui:vocabHideGloss}’을 켜면 뜻이 가려져요. ‘{ui:vocabRevealGloss}’를 눌러 확인하며 외워 보세요.",
          "‘{ui:vocabShuffle}’로 순서를 섞을 수 있어요.",
        ],
        shot: "vocab-hide",
      },
      {
        heading: "글자 익히기",
        body: [
          "일본어·중국어처럼 글자가 다른 언어를 배우면 ‘{ui:vocabTabCharacters}’ 탭이 생겨요. 글자를 누르면 발음과 쓰임을 바로 볼 수 있어요.",
        ],
        shot: "vocab-characters",
      },
    ],
  },
  rooms: {
    "title": "말하는 방 사용법",
    "sections": [
      {
        "heading": "방 찾고 들어가기",
        "body": [
          "목록 위 ‘전체’·‘내 조합’·‘언어로 찾기’로 언어 조합을 골라요. 방을 누르면 참여를 요청한 채 들어가고, 방장이 자리에 올려 주면 말해요. 빈자리를 눌러도 참여 요청이 가요. ‘듣기만’으로 조용히 들을 수도 있어요.",
          "말한 내용은 사람마다 자막으로 쌓여요. 줄을 누르면 앞 대화를 보고 내 언어로 번역해요.",
          "새 방을 만들 때 ‘자유 대화’를 고르면 언어를 정하지 않아요. 자막은 말하는 사람마다 그 사람의 언어로 적히고, ‘언어로 찾기’에서 어떤 언어로도 나와요.",
          "잘 안 들린 줄 끝에는 ?가 붙어요. 배우는 언어로 한 내 말에 고칠 곳이 있으면 내 줄 아래 나에게만 ‘✎ 고칠 곳이 있어요’가 떠요. 다른 사람에게는 안 보여요."
        ],
        "shot": "r69-free"
      },
      {
        "heading": "참여 방식·보는 방식",
        "body": [
          "방 위에서 ‘대화 보기’·‘채팅 위주’·‘통화 위주’ 등을 골라요. 자막과 채팅은 칸이 나뉘고, 아래에서 ‘말하기’·‘듣기’·‘채팅만’·‘보이스만’으로 참여 방식을 골라요.",
          "말하기 자리에서는 이어폰을 쓰면 상대 목소리가 내 자막에 섞이지 않아요."
        ],
        "shot": "r69-layouts"
      },
      {
        "heading": "줄을 집어서 묻기",
        "body": [
          "줄을 누르면 번역 아래 ‘무슨 뜻이에요?’·‘답하기’·‘쪽지로 묻기’가 나와요. 질문은 내가 배우는 언어로 채워지고, 말한 사람에게 알림이 가요. 쪽지는 둘만 보는 메시지로 가요.",
          "번역 아래 낱말을 누르면 그 부분만 묻고, 이어서 누르면 구절이 돼요."
        ],
        "shot": "r69-quote"
      },
      {
        "heading": "말이 막힐 때",
        "body": [
          "아래 칸에 편한 말로 쓰고 ‘학습 언어로’를 누르면 문장을 만들어 줘요. 그대로 댓글로 보내거나, 말하기 자리에서 소리 내어 말해 보세요."
        ]
      },
      {
        "heading": "라이어 게임",
        "body": [
          "방장이 위의 🎭을 눌러 사회자(AI·나)와 주제를 고르고 ‘시작’. 말하기 자리에 3명 이상 있어야 해요.",
          "라이어만 제시어를 몰라요. 내 차례가 오면 배우는 언어로 제시어를 한 문장 설명하고 ‘다 말했어요’. 다 돌면 라이어라고 생각하는 사람에게 투표해요.",
          "라이어가 뽑히면 제시어를 맞혀 볼 수 있어요. 맞히거나 엉뚱한 사람이 뽑히면 라이어 승. 사회자가 ‘나’면 방장은 참가하지 않고 제시어와 라이어를 봐요."
        ]
      },
      {
        "heading": "마피아",
        "body": [
          "🎭에서 ‘마피아’를 고르고 ‘시작’. 말하기 자리에 5명 이상 있어야 해요(7명부터 마피아 2명). 내 역할은 나에게만 보이고, 마피아끼리는 서로 알아요.",
          "밤에는 마피아가 노릴 사람, 의사가 지킬 사람, 경찰이 확인할 사람을 골라요. 낮에는 밤에 있었던 일을 보고 배우는 언어로 이야기한 뒤, 투표로 한 명을 내보내요.",
          "마피아가 모두 나가면 시민 승, 마피아 수가 나머지 사람 수만큼 되면 마피아 승. 사회자가 AI면 처음에 배경 이야기를 들려줘요."
        ]
      },
      {
        "heading": "관전자 추리",
        "body": [
          "듣기 자리·채팅만·탈락한 사람은 관전자예요. 🔮에서 라이어나 마피아를 찍고 바꿀 수 있어요. 플레이어 투표에는 들어가지 않고, 누가 누구를 찍었는지는 끝나야 보여요.",
          "끝나면 맞힌 사람과 이 방의 추리 순위가 나와요. 게임 중인 방은 목록에 ‘라이어 게임 중’·‘마피아 중’으로 보여요."
        ]
      },
      {
        "heading": "방장이라면",
        "body": [
          "빈자리를 누르면 올릴 사람을 골라요(참여 요청한 사람 먼저, 그다음 듣는 사람). ‘참여 요청’에서 ‘올리기’도 돼요. 프로필에서 ‘내리기’·‘내보내기’·‘방장 넘기기’. ‘방 닫기’를 누르면 ‘방장 넘기고 나가기’·‘잠시 닫기’·‘방 닫기’ 중에 골라요. 잠시 닫은 방은 목록 위 ‘다시 열기’로 같은 방을 열어요.",
          "빈자리를 누르고 ‘이 자리 막기’로 말하기 자리를 2~8칸으로 줄여요. 🔒 자리를 누르면 다시 열려요."
        ],
        "shot": "r69-host"
      },
      {
        "heading": "사람 찾기",
        "body": [
          "맨 위는 AI 튜터예요. 사람처럼 프로필을 열어 {ui:talkAiCall}·메시지를 걸고, {ui:callRecordsTitle}도 거기서 봐요(로그인 없이도).",
          "최근에 온 학습자의 프로필이 보여요. 사진을 누르면 프로필이 열리고, 팔로우하거나 메시지를 보낼 수 있어요.",
          "차단·신고도 프로필에서 해요.",
          "프로필에서 국적·모국어·관심사를 칩으로 고르고, 다른 사람에게 보일 칸을 켜고 꺼요. 내 질문에 답해 준 사람에게는 ‘🙌 도움됐어요’, 남의 소개·올린 글은 ‘한국어로 보기’로 번역해요.",
          "위 칩 ‘같은 언어를 배우는 사람’은 지금 배우는 언어가 같은 사람, ‘배우는 언어·쓰는 말이 같은 사람’는 거기에 내 모국어도 쓰는 사람만 보여요. 언어는 프로필의 배우는 언어·모국어·할 수 있는 언어로 맞춰요."
        ],
        "shot": "people-ai"
      },
      {
        "heading": "친구 초대",
        "body": [
          "‘➕ 친구 초대’로 카카오톡 등에 링크를 보내요. 받은 사람은 앱을 깔고 로그인해 이름만 정하면 바로 들어와요. 방 위 ➕는 그 방으로 초대해요."
        ]
      },
      {
        "heading": "친구 초대 보상",
        "body": [
          "초대한 친구가 일주일 안에 이틀 이상 쓰면 나와 친구 모두 포인트를 받아요.",
          "데려온 친구가 늘면 플러스·프리미엄 기간도 받아요. 정확한 숫자는 카드에 보여요."
        ],
        "shot": "invite-rewards"
      },
      {
        "heading": "메시지와 통화",
        "body": [
          "첫 메시지는 요청으로 가고, 상대가 답하면 대화가 열려요. 대화 위 📞로 통화하고, 통화 자막은 기록으로 남아요.",
          "1:1 통화에서는 카메라를 켜고 얼굴을 보며 이야기할 수 있어요(처음엔 꺼져 있어요).",
          "내가 보낸 줄을 길게 누르면 지울 수 있어요(상대에게서도 사라져요). 목록에서 줄 끝 ⋯을 누르면 대화를 내 목록에서 지워요."
        ]
      },
      {
        "heading": "단체방과 단체 통화",
        "body": [
          "‘+ 단체방’으로 팔로우한 사람을 초대해요(최대 20명). 대화 위 📞로 같이 통화하고, 끝나면 자막이 통화 기록으로 남아요."
        ],
        "shot": "r69-groups"
      },
      {
        "heading": "게시판",
        "body": [
          "배우는 언어마다 게시판이 따로예요. 위 칩으로 💬 자유·❓ 질문·🤝 메이트·🎙 보이스룸·👥 단체방 글만 골라 봐요.",
          "보이스룸 글에는 내 공개 방을, 단체방 글에는 내 단체방을 붙일 수 있어요. 읽는 사람은 글 속 ‘들어가기’·‘참여하기’로 바로 가고, 메이트 글에서는 🤝로 메이트 신청을 해요.",
          "배우는 언어로 글을 올리고 댓글을 달아요. 고치고 지우는 건 쓴 사람만 할 수 있어요. 글 아래 ‘한국어로 보기’로 번역하고, 이름을 누르면 팔로우·메시지·신고.",
          "글마다 ♡ 좋아요를 누를 수 있어요. 사진을 붙이면 목록에도 작게 보여요."
        ],
        "shot": "board-topics"
      },
      {
        "heading": "아이콘",
        "body": [
          "‘+ 새 묶음’으로 내가 만든 그림(움직이는 GIF도)을 올리면 바로 모두에게 공개돼요. 라이선스는 CC BY 4.0(출처 표시) 또는 CC0(조건 없음) 중에서 골라요. 남의 묶음은 ‘받기’를 누르면 메시지·단체방·댓글 입력칸의 🙂에서 골라 보낼 수 있어요.",
          "기본 묶음 ‘Noto 😀’·‘Noto 👍’(Google Noto 움직이는 이모지)은 받지 않아도 늘 있어요. Room 채팅의 🙂에서도 보낼 수 있어요.",
          "‘가격’에서 ‘판매’를 고르고 2~30P를 넣으면 판매 묶음이 돼요(이 앱에서 산 사람만 씀). 아이콘을 올리고 ‘판매 신청’을 누르면 운영자가 확인한 뒤 목록에 떠요. 산 포인트의 70%는 만든 사람에게 포인트로 가고, 묶음이 내려지면 산 사람에게 돌려줘요. 사지 않은 판매 묶음은 그림만 볼 수 있어요.",
          "‘✏️ 만들기’로 사진·글자·스티커·펜·배경을 겹쳐 아이콘을 만들고, ‘움직임’(통통·흔들·두근·살랑)을 고르면 움직이는 아이콘이 돼요. 내 묶음에서 ‘빼기’를 누르면 아이콘마다 ‘편집’이 나와요. 많이 쓰이는 묶음에는 🔥가 붙어요."
        ]
      }
    ]
  },
  talk: {
    "title": "대화 사용법",
    "sections": [
      {
        "heading": "대화 목록",
        "body": [
          "맨 위가 AI 튜터와의 대화예요. 줄을 누르면 채팅, 📞를 누르면 바로 통화해요. {ui:callRecordsTitle}은 채팅과 따로 남고, 사람 탭의 AI 튜터 프로필이나 AI 대화 ⋮에서 열어요.",
          "그 아래에 단체방과 1:1 메시지가 이어지고, 안 읽은 메시지 수도 같이 보여요."
        ],
        "shot": "talk-calls"
      }
    ]
  },

};

export const GUIDE_EN: Guide = {
  map: {
    title: "Using My",
    sections: [
      {
        heading: "1. Start with a conversation",
        body: [
          "Read the ‘{ui:stageCheckTitle}’ conversation and answer ‘{ui:stageCan}’, ‘{ui:stageAlmost}’ or ‘{ui:stageHard}’ to find your stage. ‘{ui:stageBegin}’ starts that stage's scripts right away. Change stage with ‘{ui:stageRechoose}’ at the top.",
        ],
        shot: "stage-start",
      },
      {
        heading: "2. Try this",
        body: [
          "One thing to do now, from your own record. ‘{ui:nextByChat}’ or ‘{ui:nextByCall}’ starts that conversation straight away.",
        ],
        shot: "next",
      },
      {
        heading: "3. Growing",
        body: [
          "Four parts — ‘{ui:partVocab}’, ‘{ui:partGrammar}’, ‘{ui:partExpression}’ and ‘{ui:partPronunciation}’ — show how full they are at your stage. The dotted line is what the next stage needs, and the weakest part is in yellow.",
          "Tap a part to see what you studied in it over the last two weeks, day by day — ‘{ui:itemsLearned}’, ‘{ui:itemsMastered}’ and ‘{ui:partFixed}’ (lines the tutor corrected), and where. Below is everything in that part; tap a word for details. ‘{ui:partOpenStage}’ opens it in the stage view.",
        ],
        shot: "parts-net",
      },
      {
        heading: "4. As a graph",
        body: [
          "Tap ‘{ui:myViewGraph}’ to see how much each part grew each day over the last two weeks. Tap a bar for what you studied that day, or a part’s name for the whole two weeks. The view you pick stays next time.",
        ],
        shot: "parts-graph",
      },
      {
        heading: "5. To the next stage",
        body: [
          "The top of ‘{ui:myViewMap}’ shows your weakest part. Practise it right away with the button next to it — ‘{ui:nextByCall}’ for ‘{ui:partPronunciation}’, ‘{ui:nextByChat}’ for the rest.",
          "If the tutor corrected the same part three times or more in the last two weeks, that part comes first (corrections don’t fill a part). A phrase that uses several grammar points fills each of them.",
          "When all four pass 70%, ‘{ui:partReady}’ turns on. If you have never tried saying a line again, ‘{ui:partPronunciation}’ shows ‘{ui:myNoData}’ and is left out.",
        ],
        shot: "stage-next",
      },
      {
        heading: "6. Ask",
        body: [
          "Ask something like ‘{ui:myAskQuick1}’ and it answers from your record. One question is one chat.",
        ],
        shot: "myask",
      },
      {
        heading: "7. Stages",
        body: [
          "‘{ui:myViewMap}’ runs from stage 1 to 5. Tap a number to look at that stage.",
          "Tap a part to open it: ‘{ui:partVocab}’ has the words you’ve learned and your word list, ‘{ui:partGrammar}’ the stage’s grammar (✓ and ‘{ui:stageTry}’), ‘{ui:partExpression}’ its key phrases and the ‘{ui:notebookIdioms}’ sections, ‘{ui:partPronunciation}’ the stage’s sound point and the letter-and-sound sections. Phrases you can use and scenes you saved fill the matching section.",
          "Below, ‘{ui:stageExamplesTitle}’ shows conversations this stage makes possible; try one with ‘{ui:stageTry}’.",
          "‘{ui:stageScriptsTitle}’ at the top of each stage: the script plays and stops at your line. Pick a way to see it (‘{ui:scriptModeShadow}’, ‘{ui:scriptModeHint}’, ‘{ui:scriptModeHide}’, ‘{ui:scriptModeOwn}’) and say it with 🎤. Get every line of yours right in any way other than shadowing and the script is passed — the next stage opens once the four areas reach 70% and all scripts of the stage are passed. At stages 3–4 the other person's lines change a little each time; at stage 5, ‘{ui:scriptCall}’ plays the same situation as a call. Each script lists the stage's key phrases it uses; passing it adds them to the phrases area. Phrases no situation script uses get short scripts under ‘{ui:scriptsByExpression}’. ‘{ui:scriptTodayTitle}’ at the top is picked from the grammar your tutor corrected lately and the phrases you haven't learned yet. Below, ‘{ui:framesTitle}’ gives sentence structures with one blank. Say four sentences that change only the blank; get them all right in ‘{ui:frameModeBlank}’ to pass, then carry on into scripts that use the structure. From stage 3, ‘{ui:scriptModeOwn}’ lets you fill the blank with your own story (stages 1–3). When the tutor corrects the same sentence structure twice in two weeks, a ◐ ‘{ui:frameRedo}’ card appears at the top of the scripts: see your line and the fix, then say the structure again. At the top of the stage view, ‘{ui:scriptAmountTitle}’ counts the phrases, grammar and sentence structures from what you passed, plus the lines you said; ‘{ui:canDoTitle}’ lights up a box when you pass one of its structures.",
        ],
        shot: "stage-scripts",
      },
      {
        heading: "8. Notes",
        body: [
          "Lines the tutor corrected gather in ‘{ui:notebookToday}’ at the top of Growing. Tick the ones to keep and ‘{ui:notebookAddToNotes}’ — each card goes into its grammar box in ‘{ui:myViewMap}’.",
          "Open a grammar box to see the scripts and sentence structures that use it; tap one to open it.",
          "In sentence analysis, ‘{ui:findInMy}’ finds which box that part belongs to and opens it.",
        ],
        shot: "notebook-today",
      },
      {
        heading: "Also",
        body: [
          "Only phrases you produced without help count as mastered (not a level, just how many you can use). Each learning language has its own.",
          "If feedback you send with ‘{ui:feedbackOpen}’ is adopted, you get 3–20 points depending on how much it matters.",
        ],
      },
    ],
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
          "If something needs fixing, ‘{ui:chatCorrectionChip}’ appears under your message. Tap it to see the corrected sentence, or switch to ‘{ui:chatCorrectionViewAuto}’ in the ⋮ menu.",
        ],
        shot: "chat-fix",
      },
      {
        heading: "Stuck? Use your own language",
        body: [
          "If something is hard to say in the language you're learning, write it in your own. The conversation carries on, and it counts as one message like any other.",
          "Tap {ui:chatShowExpression} under your message to see how to say it, then {ui:chatUseExpression} to try it straight away.",
        ],
        shot: "chat-expression",
      },
      {
        heading: "See the meaning, hear it",
        body: [
          "Tap {ui:chatReading} under the tutor's reply to see it in your own language.",
          "Tap the speaker to hear the line read aloud.",
        ],
        shot: "chat-reading",
      },
      {
        heading: "Look into a sentence and ask",
        body: [
          "Tap the bar to the left of a sentence to open it. Drag across the dots to pick a part, then tap a question like {ui:quickAskMeaning} or ask your own. The answer stays on that part for next time.",
        ],
        shot: "chat-ask",
      },
      {
        heading: "Tap a word to save it",
        body: [
          "In the sentence sheet, tap a word or an underlined phrase to see its meanings and examples. {ui:vocabPreviewSave} puts it in your vocabulary.",
        ],
        shot: "chat-word",
      },
      {
        heading: "The menu",
        body: [
          "The ⋮ menu at the top left opens {ui:chatHistoryTitle} and has {ui:endSession} to finish this chat. If a reply looks wrong, tell us with {ui:reportTitle}.",
        ],
        shot: "chat-menu",
      },
      {
        heading: "Pick up a past chat",
        body: [
          "Open a past chat to read it again, and {ui:chatHistoryContinue} to carry on where you stopped.",
        ],
        shot: "chat-history",
      },
      {
        heading: "Also",
        body: [
          "Not sure what to say? Tap {ui:chatStartCta} and the tutor will begin.",
          "Use + to send a photo and talk about it.",
          "Chat comes with a subscription: 20 messages a day on Scripts, 30 on Lite, 50 on Plus and 100 on Premium.",
        ],
      },
    ],
  },
  roleplay: {
    title: "How to use Calls",
    sections: [
      {
        heading: "{ui:packTitle}",
        body: [
          "It picks what your record says to grow next and makes a conversation of about seven minutes from it.",
          "Subscribers get it every day and free accounts twice a week; it uses no call time. Tap {ui:packStart} to begin.",
        ],
        shot: "call-pack",
      },
      {
        heading: "Talk out loud",
        body: [
          "The tutor speaks first. When you stop speaking, your turn ends by itself.",
          "Your own lines show only when there's something to fix. To see them all, turn on ‘{ui:roleplayMyLines}’.",
          "To talk about anything, tap 📞 at the top of the AI chat. The call starts right away.",
        ],
        shot: "call-talk",
      },
      {
        heading: "Look back at a finished call",
        body: [
          "Finished calls are kept apart from your chats, in {ui:callRecordsTitle}. Open it from the {ui:talkAiCall} row in the chats tab or from ⋮ in the AI chat. {ui:packSeeRetro} shows the corrected sentence and what you meant to say under your lines.",
          "{ui:roleplaySayAgain} plays that sentence for you to repeat, and shows which words came through differently.",
          "A turn where you got stuck keeps a {ui:roleplayWhyStuck} button.",
        ],
        shot: "call-review",
      },
      {
        heading: "{ui:roleplayOwnLineOpen}",
        body: [
          "Type a sentence you want to practise and tap {ui:roleplayOwnLineUse}: listen to it, then say it.",
          "It shows which words came through differently. It uses no call time.",
        ],
        shot: "call-ownline",
      },
      {
        heading: "Pause and carry on",
        body: [
          "{ui:roleplayPause} saves the conversation. Next time, {ui:roleplayResume} in {ui:callRecordsTitle} picks it up again.",
        ],
      },
      {
        heading: "Call time",
        body: [
          "Free has no calls; practise speaking with the stage scripts in My.",
          "Scripts gives 5 minutes of free calls every three days, Lite 7 a day, Plus 10 and Premium 15; after that, points carry you on.",
          "The call screen shows the time you have left.",
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
        shot: "video-library",
      },
      {
        heading: "Subtitles in the language you're learning",
        body: [
          "Subtitles show only the language you're learning, so you listen and read first. Tap a line to hear just that part again.",
        ],
        shot: "video-study",
      },
      {
        heading: "The bar beside a line translates it",
        body: [
          "Stuck? Tap the bar to the left of the line. The translation fits this scene, because it reads what the video is about and the lines around it.",
        ],
        shot: "video-bar",
      },
      {
        heading: "Ask about any part",
        body: [
          "Drag across the dots to pick a word or phrase, then tap a question like {ui:quickAskMeaning} or type your own. The answer fits this scene too.",
        ],
        shot: "video-ask",
      },
      {
        heading: "Bring your own video",
        body: [
          "Paste a YouTube link and the app makes subtitles in the language you're learning. This is a Premium feature and uses one point per three minutes of video, up to 15 minutes.",
        ],
      },
      {
        heading: "Group, split and save",
        body: [
          "{ui:videoLearnRangeMode} to hear lines together, and merge or split parts. {ui:videoLearnResetAllCues} puts everything back the way it was.",
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
          "Search in your own language and you get the words for it in the language you're learning, with meanings and examples. {ui:vocabSave} adds one to your list.",
          "Words you tap and save in Chat collect here too.",
        ],
        shot: "vocab-search",
      },
      {
        heading: "Your saved words",
        body: [
          "Each word shows where it stands and where you last used it. {ui:linkTry} starts a chat to use it, and {ui:linkFindScenes} finds the scenes in videos where it comes up.",
          "Tap the speaker to hear it, and delete words you no longer need.",
        ],
        shot: "vocab-saved",
      },
      {
        heading: "Learn them",
        body: [
          "{ui:vocabHideGloss} covers the meanings. Tap {ui:vocabRevealGloss} to check yourself.",
          "{ui:vocabShuffle} mixes up the order.",
        ],
        shot: "vocab-hide",
      },
      {
        heading: "Learn the script",
        body: [
          "If the language you're learning uses another script, like Japanese or Chinese, a {ui:vocabTabCharacters} tab appears. Tap a character to see how it sounds and how it's used.",
        ],
        shot: "vocab-characters",
      },
    ],
  },
  rooms: {
    "title": "How to use Rooms",
    "sections": [
      {
        "heading": "Find a room and join",
        "body": [
          "Above the list, pick a language pair with “All”, “My languages” or “Find by language”. Tap a room to join with a request to join; the host brings you up to a seat to talk. Tapping an empty seat sends the request too. “Just listen” lets you listen quietly.",
          "What each person says builds up as captions. Tap a line to translate it, with the conversation before it in mind.",
          "Choose “Free talk” when you start a room and no languages are fixed. Each person’s captions are written in their own languages, and the room shows up in “Find by language” for any language.",
          "A line that was hard to hear ends with ?. If what you said in the language you're learning has something to fix, “✎ Something to fix” appears under your line, for you only. Nobody else sees it."
        ],
        "shot": "r69-free"
      },
      {
        "heading": "Join and view your way",
        "body": [
          "At the top, choose “Conversation”, “Chat view”, “Call view” and more. Captions and chat sit in separate boxes, and below you join with “Speak”, “Listen”, “Chat only” or “Voice only”.",
          "When you're speaking, earphones keep other people's voices out of your captions."
        ],
        "shot": "r69-layouts"
      },
      {
        "heading": "Pick a line and ask",
        "body": [
          "Tap a line and, under the translation, choose “What does it mean?”, “Reply” or “Ask privately”. The question is filled in in the language you’re learning and the speaker is told. A private question goes as a message only the two of you see.",
          "Below the translation, tap a word to ask about just that part; tap another to make it a phrase."
        ],
        "shot": "r69-quote"
      },
      {
        "heading": "When the words won’t come",
        "body": [
          "Write in your own language in the box below and tap “In my target language” to get a sentence. Send it as a comment, or say it out loud from a talking seat."
        ]
      },
      {
        "heading": "Liar game",
        "body": [
          "The host taps 🎭 at the top, picks a host (AI or Me) and a topic, and taps “Start”. You need 3 or more people in talking seats.",
          "Only the liar doesn't know the secret word. On your turn, describe it in one sentence in the language you're learning, then tap “I'm done”. After everyone has spoken, vote for who you think the liar is.",
          "If the liar is picked, they can guess the word. If they get it, or the wrong person is picked, the liar wins. With “Me” as host, the room host doesn't play and sees the word and the liar."
        ]
      },
      {
        "heading": "Mafia",
        "body": [
          "In 🎭, pick “Mafia” and tap “Start”. You need 5 or more people in talking seats (2 mafia from 7 people). Only you see your role, and the mafia know each other.",
          "At night the mafia pick a target, the doctor picks someone to protect and the police pick someone to check. By day, see what happened, talk it over in the language you're learning, then vote one person out.",
          "The town wins when all the mafia are out; the mafia win when they match the rest in number. With AI as host, a short story opens the game."
        ]
      },
      {
        "heading": "Spectator guesses",
        "body": [
          "People in listening seats, chat-only people and players who are out are spectators. In 🔮 they pick who they think the liar or mafia is, and can change it. It doesn't count in the players' vote, and nobody sees who picked whom until the end.",
          "At the end you see who got it and the room's top guessers. Rooms with a game on show “Liar game on” or “Mafia on” in the list."
        ]
      },
      {
        "heading": "If you’re the host",
        "body": [
          "Tap an empty seat to pick who to bring up (requests first, then listeners), or “Bring up” under “Requests to join”; from a profile, “Move down”, “Remove” or “Make host”. “Close room” lets you choose “Hand over and leave”, pause, or close. A paused room comes back with “Reopen” above the list.",
          "Tap an empty seat and “Block this seat” to cut talking seats down to 2–8. Tap a 🔒 seat to open it again."
        ],
        "shot": "r69-host"
      },
      {
        "heading": "Find people",
        "body": [
          "The AI tutor is at the top. Open its profile like anyone's to message it or call it ({ui:talkAiCall}), and find {ui:callRecordsTitle} there too — no sign-in needed.",
          "Profiles of learners who were here lately. Tap a photo to open a profile, then follow or send a message.",
          "Blocking and reporting are on the profile too.",
          "In your profile, pick your nationality, native language and interests as chips, and turn on or off what others see. Tap “🙌 Helpful” for someone who answered your question; “See in English” translates others’ intros and posts.",
          "The chip “Learning the same language” shows people learning the language you're learning now; “Same learning & spoken language” narrows it to those who also speak your native language. Languages come from the profile's languages you learn, native language and languages you speak."
        ],
        "shot": "people-ai"
      },
      {
        "heading": "Invite friends",
        "body": [
          "“➕ Invite friends” sends a link through any messenger. Whoever opens it installs the app, signs in, picks a name and they're in. ➕ in a room invites to that room."
        ]
      },
      {
        "heading": "Invite rewards",
        "body": [
          "When a friend you invite uses the app on two days within a week, you both get points.",
          "Bring more friends and you also get Plus or Premium time. The card shows the exact numbers."
        ],
        "shot": "invite-rewards"
      },
      {
        "heading": "Messages and calls",
        "body": [
          "Your first message goes as a request; once they reply, the conversation opens. Call with 📞 above the conversation; the call's captions stay as a record.",
          "In a 1:1 call you can turn on the camera and talk face to face (it starts off).",
          "Press and hold a line you sent to delete it (it disappears for them too). Tap ⋯ at the end of a row to remove the chat from your list."
        ]
      },
      {
        "heading": "Group chats and group calls",
        "body": [
          "“+ Group” invites people you follow (up to 20). Call together with 📞 above the chat; afterwards the captions stay as a call record."
        ],
        "shot": "r69-groups"
      },
      {
        "heading": "Board",
        "body": [
          "Each language you learn has its own board. Use the chips at the top to see only 💬 Chat, ❓ Questions, 🤝 Study mates, 🎙 Voice rooms or 👥 Groups.",
          "A voice-room post can carry your open room, a group post your group. Readers go straight in with “Join” or “Join group”, and on a mate post 🤝 sends a mate request.",
          "Post in the language you’re learning and comment. Only the writer can edit or delete. “See in English” translates a post; tap a name to follow, message or report.",
          "Tap ♡ Like on any post. Photos you attach also show small in the list."
        ],
        "shot": "board-topics"
      },
      {
        "heading": "Icons",
        "body": [
          "With “+ New pack”, upload images you made (animated GIFs too); they're public to everyone right away. Choose CC BY 4.0 (credit required) or CC0 (no conditions). Tap “Get” on someone's pack to send its icons from 🙂 in messages, group chats and comments.",
          "The basic packs “Noto 😀” and “Noto 👍” (Google’s animated Noto emoji) are always there without getting them. You can also send icons from 🙂 in Room chat.",
          "Under “Price”, choose “For sale” and enter 2–30P to sell a pack (only buyers in this app can use it). Upload icons and tap “Request sale”; it appears in the list once we approve it. 70% of the points paid go to the creator as points, and buyers get their points back if the pack is taken down. Packs for sale you haven't bought can only be previewed.",
          "With “✏️ Make”, layer a photo, text, stickers, pen and a background into an icon; pick a “Motion” (Bounce, Shake, Pulse, Wobble) to make it move. In your pack, tap “Remove” to get “Edit” on each icon. Packs many people use get a 🔥."
        ]
      }
    ]
  },
  talk: {
    "title": "How to use Chats",
    "sections": [
      {
        "heading": "Your chats",
        "body": [
          "Your chat with the AI tutor is at the top. Tap the row to chat, or 📞 to call right away. {ui:callRecordsTitle} is kept apart from your chats; open it from the AI tutor's profile in the people tab or from ⋮ in the AI chat.",
          "Group chats and one-to-one messages follow below, with how many are unread."
        ],
        "shot": "talk-calls"
      }
    ]
  },

};
