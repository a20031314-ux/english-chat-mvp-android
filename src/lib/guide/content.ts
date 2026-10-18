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

export const GUIDE_VERSION = "2026-10-19c";

export type GuideTabId = "map" | "chat" | "roleplay" | "video" | "vocab" | "rooms";

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
          "부족한 부분과 위주로 할 것을 고르고 ‘{ui:mapDraw}’. 수준은 묻지 않아요.",
        ],
        shot: "goal",
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
          "여섯 부분이 쓸수록 커지고 줄지 않아요. 테두리 친 곳이 ‘{ui:myNext}’이에요.",
        ],
        shot: "growth",
      },
      {
        heading: "4. 그래프로 보기",
        body: [
          "‘{ui:myViewGraph}’을 누르면 부분마다 최근 2주가 막대로 보여요. 고른 보기는 다음에도 그대로예요.",
        ],
        shot: "graph",
      },
      {
        heading: "5. 눌러서 보기",
        body: [
          "부분을 누르면 자라는 방법·최근 2주·키운 표현이 보이고, ‘{ui:myGrowIt}’로 바로 연습해요.",
        ],
        shot: "element",
      },
      {
        heading: "6. 직접 묻기",
        body: [
          "‘{ui:myAskQuick1}’처럼 물으면 내 기록으로 답해요. 질문 1번은 채팅 1회예요.",
        ],
        shot: "myask",
      },
      {
        heading: "7. 지도로 보기",
        body: [
          "‘{ui:myViewMap}’을 누르면 목표로 그린 주제가 보이고, 주제에서 ‘{ui:missionStart}’로 연습해요.",
        ],
        shot: "mapview",
      },
      {
        heading: "그 밖에",
        body: [
          "‘{ui:ledgerTitle}’에 모든 탭에서 만난 표현이 쌓여요. 목표가 바뀌면 ‘{ui:mapNewGoal}’. 배우는 언어마다 따로예요.",
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
          "틀린 부분이 있으면 내 문장에 표시가 생기고, 바로 아래에 고친 문장이 나와요.",
        ],
        shot: "chat-correct",
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
          "무료로는 하루 10번까지 보낼 수 있고, 프리미엄은 제한이 없어요.",
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
          "통화 탭 맨 위 카드예요. 내 기록에서 지금 가장 키울 곳을 골라 약 7분짜리 대화를 만들어요.",
          "하루 한 번 무료이고 통화 시간을 쓰지 않아요. ‘{ui:packStart}’을 누르면 시작해요.",
        ],
        shot: "call-pack",
      },
      {
        heading: "말로 대화하기",
        body: [
          "튜터가 먼저 말하고, 내가 말을 멈추면 자동으로 내 차례가 끝나요.",
          "팩에서는 위 띠에 몇 번째 질문인지 보이고, 끝나면 ‘{ui:packSeeRetro}’로 오늘 무엇이 늘었는지 봐요.",
          "주제 없이 말하고 싶으면 ‘{ui:roleplayStart}’를 눌러요.",
        ],
        shot: "call-talk",
      },
      {
        heading: "끝난 대화 돌아보기",
        body: [
          "끝난 대화는 ‘{ui:roleplayPast}’에 남아요. 내 줄 아래에 고친 문장과 원래 하려던 말이 보여요.",
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
          "‘{ui:roleplayPause}’을 누르면 대화가 저장돼요. 다음에 통화 탭에서 ‘{ui:roleplayResume}’로 계속해요.",
        ],
      },
      {
        heading: "통화 시간",
        body: [
          "무료는 처음에 20포인트(100분)를 드려요. 5분에 1포인트예요.",
          "라이트는 매일 자유 통화 7분, 플러스는 10분이 있고, 다 쓰면 포인트로 이어서 해요. 프리미엄은 매달 80포인트를 받아요.",
          "통화 첫 화면에 오늘 남은 시간이 보여요. 오늘의 팩은 어느 요금이든 시간을 쓰지 않아요.",
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
          "목록 위 ‘전체’·‘내 조합’·‘언어로 찾기’로 언어 조합을 골라요. 방을 누르면 손을 든 채 들어가고, 방장이 올려 주면 말해요. ‘듣기만’으로 조용히 들을 수도 있어요.",
          "말한 내용은 사람마다 자막으로 쌓여요. 줄을 누르면 앞 대화를 보고 내 언어로 번역해요.",
          "새 방을 만들 때 ‘자유 대화’를 고르면 언어를 정하지 않아요. 자막은 말하는 사람마다 그 사람의 언어로 적히고, ‘언어로 찾기’에서 어떤 언어로도 나와요."
        ],
        "shot": "r69-free"
      },
      {
        "heading": "참여 방식·보는 방식",
        "body": [
          "방 위에서 ‘대화 보기’·‘채팅 위주’·‘통화 위주’ 등을 골라요. 자막과 채팅은 칸이 나뉘고, 아래에서 ‘말하기’·‘듣기’·‘채팅만’·‘보이스만’으로 참여 방식을 골라요."
        ],
        "shot": "r69-layouts"
      },
      {
        "heading": "줄을 집어서 묻기",
        "body": [
          "줄을 누르면 번역 아래 ‘무슨 뜻이에요?’·‘답하기’·‘쪽지로 묻기’가 나와요. 질문은 내가 배우는 언어로 채워지고, 말한 사람에게 알림이 가요. 쪽지는 둘만 보는 메시지로 가요."
        ],
        "shot": "r69-quote"
      },
      {
        "heading": "말이 막힐 때",
        "body": [
          "아래 칸에 편한 말로 쓰고 ‘학습 언어로’를 누르면 문장을 만들어 줘요. 그대로 댓글로 보내거나, 말하기 자리에서 소리 내어 말해 보세요.",
          "말하는 중에 편한 말이 나오면(‘어.. 스물둘..’) 그 줄 아래 나에게만 ‘이렇게 말해 보세요’가 떠요. 다른 사람에게는 안 보여요. 아래 ‘힌트’에서 ‘바로 보기’·‘살짝만’·‘끄기’를 골라요."
        ],
        "shot": "r69-hint"
      },
      {
        "heading": "방장이라면",
        "body": [
          "손든 사람은 ‘올리기’, 프로필에서 ‘내리기’·‘내보내기’·‘방장 넘기기’. ‘방 닫기’를 누르면 ‘방장 넘기고 나가기’·‘잠시 닫기’·‘방 닫기’ 중에 골라요. 잠시 닫은 방은 목록 위 ‘다시 열기’로 같은 방을 열어요."
        ],
        "shot": "r69-host"
      },
      {
        "heading": "사람·메시지·통화",
        "body": [
          "‘사람과 학습’의 ‘My’ 탭에서 최근에 온 학습자를 보고, 사진을 누르면 프로필이 열려요. 팔로우하거나 메시지를 보내면 상대가 답한 뒤 대화 안에서 📞로 통화해요. 통화 자막은 기록으로 남아요.",
          "‘My’ 위 ‘➕ 친구 초대’로 카카오톡 등에 링크를 보내요. 받은 사람은 앱을 깔고 로그인해 이름만 정하면 바로 들어와요. 방 위 ➕는 그 방으로 초대해요.",
          "차단·신고도 프로필에서 해요."
        ],
        "shot": "r69-people"
      },
      {
        "heading": "단체방과 단체 통화",
        "body": [
          "‘메시지’의 ‘+ 단체방’으로 팔로우한 사람을 초대해요(최대 20명). 대화 위 📞로 같이 통화하고, 끝나면 자막이 통화 기록으로 남아요."
        ],
        "shot": "r69-groups"
      }
    ]
  },
};

export const GUIDE_EN: Guide = {
  map: {
    title: "Using My",
    sections: [
      {
        heading: "1. Start by ticking",
        body: [
          "Tick where you fall short and what to focus on, then ‘{ui:mapDraw}’. There's no level to pick.",
        ],
        shot: "goal",
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
          "Six parts grow as you use the language and never shrink. The ringed one is ‘{ui:myNext}’.",
        ],
        shot: "growth",
      },
      {
        heading: "4. See it as a graph",
        body: [
          "Tap ‘{ui:myViewGraph}’ to see each part's last two weeks as bars. The view you pick stays next time.",
        ],
        shot: "graph",
      },
      {
        heading: "5. Tap to look closer",
        body: [
          "Tap a part for how it grows, the last two weeks and the phrases that grew it; ‘{ui:myGrowIt}’ starts practising.",
        ],
        shot: "element",
      },
      {
        heading: "6. Ask",
        body: [
          "Ask something like ‘{ui:myAskQuick1}’ and it answers from your record. One question is one chat.",
        ],
        shot: "myask",
      },
      {
        heading: "7. See it as a map",
        body: [
          "Tap ‘{ui:myViewMap}’ for the topics drawn from your goal; in a topic, ‘{ui:missionStart}’.",
        ],
        shot: "mapview",
      },
      {
        heading: "Also",
        body: [
          "‘{ui:ledgerTitle}’ gathers phrases from every tab. New goal? ‘{ui:mapNewGoal}’. Each learning language has its own.",
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
          "If something is off, it's marked in your message, with the corrected sentence right below.",
        ],
        shot: "chat-correct",
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
          "Free accounts can send 10 messages a day; Premium has no daily limit.",
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
          "The card at the top of the Calls tab. It picks what your record says to grow next and makes a conversation of about seven minutes from it.",
          "It's free once a day and uses no call time. Tap {ui:packStart} to begin.",
        ],
        shot: "call-pack",
      },
      {
        heading: "Talk out loud",
        body: [
          "The tutor speaks first. When you stop speaking, your turn ends by itself.",
          "In a pack, the band at the top shows which question you're on, and when it ends {ui:packSeeRetro} shows what grew today.",
          "To talk about anything, tap {ui:roleplayStart}.",
        ],
        shot: "call-talk",
      },
      {
        heading: "Look back at a finished call",
        body: [
          "Finished calls stay in {ui:roleplayPast}. Under your lines you'll see the corrected sentence and what you meant to say.",
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
          "{ui:roleplayPause} saves the conversation. Next time, {ui:roleplayResume} in the Calls tab picks it up again.",
        ],
      },
      {
        heading: "Call time",
        body: [
          "Free gives you 20 points (100 minutes) to start. A point is five minutes.",
          "Lite gives 7 minutes of free calls every day and Plus 10; after that, points carry you on. Premium gives 80 points a month.",
          "The Calls tab shows today's time left. Today's pack uses no time on any plan.",
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
          "Above the list, pick a language pair with “All”, “My languages” or “Find by language”. Tap a room to join with your hand raised; the host brings you up to talk. “Just listen” lets you listen quietly.",
          "What each person says builds up as captions. Tap a line to translate it, with the conversation before it in mind.",
          "Choose “Free talk” when you start a room and no languages are fixed. Each person’s captions are written in their own languages, and the room shows up in “Find by language” for any language."
        ],
        "shot": "r69-free"
      },
      {
        "heading": "Join and view your way",
        "body": [
          "At the top, choose “Conversation”, “Chat view”, “Call view” and more. Captions and chat sit in separate boxes, and below you join with “Speak”, “Listen”, “Chat only” or “Voice only”."
        ],
        "shot": "r69-layouts"
      },
      {
        "heading": "Pick a line and ask",
        "body": [
          "Tap a line and, under the translation, choose “What does it mean?”, “Reply” or “Ask privately”. The question is filled in in the language you’re learning and the speaker is told. A private question goes as a message only the two of you see."
        ],
        "shot": "r69-quote"
      },
      {
        "heading": "When the words won’t come",
        "body": [
          "Write in your own language in the box below and tap “In my target language” to get a sentence. Send it as a comment, or say it out loud from a talking seat.",
          "If your own language slips out while you talk, only you see “Try saying it like this” under that line; nobody else does. Under “Hints”, choose “Show”, “Just a peek” or “Off”."
        ],
        "shot": "r69-hint"
      },
      {
        "heading": "If you’re the host",
        "body": [
          "“Bring up” someone with a raised hand; from a profile, “Move down”, “Remove” or “Make host”. “Close room” lets you choose “Hand over and leave”, pause, or close. A paused room comes back with “Reopen” above the list."
        ],
        "shot": "r69-host"
      },
      {
        "heading": "People, messages and calls",
        "body": [
          "In “Learn with people”, the My tab shows learners who were here lately; tap a photo for their profile. Follow or message them, and once they reply, call from the conversation with 📞. A call’s captions stay as a record.",
          "In My, “➕ Invite friends” sends a link through any messenger. Whoever opens it installs the app, signs in, picks a name and they're in. ➕ in a room invites to that room.",
          "Blocking and reporting are on the profile too."
        ],
        "shot": "r69-people"
      },
      {
        "heading": "Group chats and group calls",
        "body": [
          "In Messages, “+ Group” invites people you follow (up to 20). Call together with 📞 above the chat; afterwards the captions stay as a call record."
        ],
        "shot": "r69-groups"
      }
    ]
  },
};
