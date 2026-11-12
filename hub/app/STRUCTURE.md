# 앱 전체구조

> 모든 채팅이 시작할 때 자동으로 읽는다(CLAUDE.md). **고치기 전에** 여기서 바꿀 곳이 어느 영역이고 누가 같이 쓰는지 보고,
> **고친 커밋에서** 이 문서도 고친다. 기능 이름·코드 한 줄씩은 `hub/app/FEATURES.md`(기능 장부), 무엇을 지키는지는 `PRODUCT.md`, 서버가 저장하는 것은 `hub/app/data-map.md`.
>
> - 위쪽(손으로 씀): 지금 화면 흐름·들어가는 길·영역 사이 규칙. 화면·흐름·탭·영역이 바뀌면 그 줄을 새로 쓴다 — 예전 모양은 적지 않는다(경위는 `hub/chat/log/`, 2026-11-09까지의 판 `hub/archive/STRUCTURE-top-2026-11-09.md`).
> - 아래쪽(자동): 탭·영역별 코드·API·화면끼리 신호·안 쓰는 코드. `node scripts/structure.mjs`가 코드에서 만든다(main push 때 CI도 다시 만듦).
>   새 화면 파일·API·페이지는 `scripts/structure.json` 자리표에 영역을 정해 넣는다 — 빠지면 CI `structure`와 끝내기 훅이 막는다.
> - 구조가 안 바뀐 커밋(버그 수정·문구 등)은 그 채팅의 `hub/chat/log` 항목에 `- 구조: 변화 없음` 한 줄.

## 화면 흐름 (손으로 씀)

```
앱 열기 ─ AI 동의(iOS만) ─ 배울 언어 고르기(처음 설치만 — 국기 여러 개 ✓ → 언어마다 튜터 얼굴 하나, LanguagePick·lib/firstLanguage.ts)
        ─ 새로워진 점(업데이트 뒤 한 번) ─ 초대 환영(초대 링크로 왔을 때)
│
상단바   내 배울 언어 국기 모두(누르면 그 언어로 · 지금 국기 → 언어 설정 시트, lib/myLanguages.ts) · 포인트/플랜 → 결제 화면 · ? 사용법(지금 탭의 장, GuideSheet) · 💬 의견 보내기
│        └ 업데이트 배너
하단 탭  My │ 대화 │ 사람 │ Room │ 영상 학습   (아이콘만, features.ts bottomTabs — 첫 화면 My)
│
├ My map ─ 계정 카드 · 🎁 초대 보상 · 🤝 메이트·팀
│          오늘의 학습(계정 카드 아래, studyMap/TodayCards — 할 것만 같은 모양 줄, 끝나면 ✓·다 끝나면 제목 ✓, 숫자 없음):
│              ▶ Quizbank(curriculum/quizFocus.ts 신호, ✓ = todayCards.ts answeredToday ≥ 10 — 0단계면 오늘의 글자 묶음 → Languagebank 글자 칸 curriculum/lettersOpen.ts)
│              · 숙제(있을 때 → openCall replay) · 📞 수업(startCall lesson, ✓ = 오늘 수업 통화 callStore mode lesson)
│          처음(서버에 단계 없음) → 첫 측정 studyMap/FirstCheck(글자 → 단어 → 뜻 → 표현·문법 → 시작 단계, curriculum/firstCheck.ts)
│          칸 셋 = 위 칸 이름 줄이 탭(notes/NotebookSection MyLayers — 누른 칸 하나만 제자리에, 칸을 누르면 전체 화면 FullScreenLayer, ✕로 제자리)
│          [Logbank 하늘] studyMap/Logbank — 기록만
│              [주 | 월] ‹기간› → 배운 것 표(Learned — 🔤 단어 · 📐 문법 · 💬 표현 · 🧩 문장구조 × 학습 · 활용, curriculum/growthView.ts)
│                · ↺ 다시 맞힘 · ✎✓ 고쳐 씀(curriculum/growthLines.ts) · 📞 통화(CallResultCard) · 학습 곡선(curriculum/learnedView.ts) · 대화 비교(TalkCompare)
│              날마다 한 줄 → 그날 = 학습 타임라인(DayTimeline → 학습 시간 → 카드 CardTimeline, curriculum/studyTimeline.ts) · ⏱ 학습 시간 막대
│              재료: 이 폰 사건 장부 logbank.v1.<언어>(curriculum/logLedger.ts) + 수업 결과 + 통화 카드 + 서버 /api/notebook logItems
│          [Quizbank 초록] studyMap/Quizbank → InlineQuiz → QuizPlayer — 한 흐름(hub/app/QUIZ.md), 답 뒤 맞음/틀림·[다시]·📕 문
│          [Languagebank 노랑] studyMap/LanguageBank — 찾기(Dictionary DictionaryBody) · 자주 쓴 말(대화 수) · 종류(칠하기 = 첫 측정 추정, 숫자 = 개수, firstCheck.ts estimateChance) → 묶음([퀴즈 | 대화] 순서) → 단어 화면(마지막 틀림 ✗ · 대화 수, 같이 배우기 칩 → openLesson, curriculum/wordUse.ts) · 표현·문법 → openLesson
│              · 묶음 ▶ 넘겨 보기(BankFlip) · 글자가 다른 언어면 첫 줄 글자·소리 칸(ScriptPractice LettersRow·LettersBank)
│          칸 머리 ?(Logbank·Quizbank) → studyMap/BankHelp(lib/guide/banks.ts)
│
├ 대화 talk ─ AI 튜터 줄(AiTutorRow — 고른·팔로우한 튜터마다, 마지막 말, 통화 문 넷 CallDoors [📞 자유대화 · 🎓 수업 · 🎲 게임 · 🧑‍🏫 가르치기], 숙제 줄 TutorHomework·점)
│           │   └ 줄 → AI 채팅 ChatWindow(튜터별 대화방 — ⋮ 튜터 목소리·말 빠르기·튜터가 쓰는 말·고친 문장 보기·채팅 기록 · 편한 말 줄 → 표현 보기 ExpressionPeek → 같이 배우기 studyMap/StudyChips)
│           ├ 단체방(팀이면 "대화 | 워크스페이스", 📞 단체방 통화 → 비공개 Room)
│           └ 1:1 메시지(요청 → 열림, 📞 → 둘만의 비공개 방 = AI 통화와 같은 통화 화면 rooms/RoomCall)
├ 사람 people ─ 맨 위 AI 튜터 둘(AiTutorPeople — 💬 · 문 넷 아이콘) → 튜터 프로필(AiTutorProfile — ProfileFrame · 문 넷 · 숙제 · 마지막 메모 · 팔로우·메시지·통화 기록)
│             · [👤 사람 | 📋 게시판] · 프로필 시트(팔로우·메시지·메이트·차단·신고) · 처음 "나를 소개해요" · ➕ 친구 초대
├ Room room ─ 로비("열린 방" · + 새 방) → 방(자리 8칸·듣는 줄·자막·댓글) · 👥 이 방 사람들과 단체방 · 🎭 게임(라이어·마피아)
└ 영상 학습 video ─ 이달의 영상 · 링크 넣기 · 학습 언어 자막 · 문장 바 → 문장분석 시트

어디서나 뜨는 층
  AI 통화 CallHost(startCall · practice · openCall) → RoleplayScreen
     통화 중: roleplay/CallParts CallStage(위 튜터 얼굴·💬 자막 · 아래 내 사진) · CallControls(🙉 · 💡 — 자유대화는 막혔을 때만, 수업은 없음)
       교정: 자유대화 = 내 얼굴 아래 카드(CoachCardView quiet) · 수업 = 튜터가 짚고 다시 말해 보기(director coachRules) · 게임 = 감독 규칙 roleplay/callGames.ts
       수업 계획: lib/roleplay/lessonPlan.ts(틀 최대 셋 · show → draw → move → ask, 멈춘 자리 lessonSpot.v1 이 폰) → 감독 lesson(lessonRules — 틀은 되받기, move면 다음 틀)
     끝: CallSummary · 튜터 메모 · 이렇게도 말할 수 있었어요(roleplay/CallReplay — 장면 ReplayPlayer) · 대본(CallPages) · 통화 정리(roleplay/CallRecap — 줄마다 같이 배우기 studyMap/StudyChips → openLesson · 🔎 My에서 찾기)
         · 이번 통화의 고쳐 씀(CallGrowthPairs) · 수업이면 숙제 [퀴즈 | 대화](HomeworkSheet, roleplay/homeworkQuiz.ts) · 0단계면 📝 글자·소리 숙제(openLettersBank)
     통화 기록 CallList(튜터 프로필, 칩 [자유대화 | 수업 | 게임 | 가르치기], lib/roleplay/callStore.ts 이 폰)
  소재 수업 studyMap/LessonHost(openLesson) → FrameLesson [설명 › 퀴즈 › 대화] · GrammarExplain(문법 한 장) · ExpressionCard(표현 카드) · FixedExplain(고정 수업)
  사전 시트 Dictionary DictionarySheet · 사전 주석 studyMap/DictNotes(대화 줄 LineTools · 영상 자막 · 퀴즈 답 뒤 · 예문 옆 📕)
  문장분석 시트 · 표현 시트 · 🔎 My에서 찾기(FindInMy → openLesson, 없으면 사전 시트) · 결제 화면
```

- **사람 기능이 꺼지면**(iOS 1차, `src/lib/platform.ts` `socialFeaturesEnabled`): 하단은 My │ 채팅 │ 영상 학습(통화는 채팅 머리 📞), 대화·사람·Room·메시지·단체방 전부 없음.
  플랫폼마다 다른 것은 `platform.ts`에만 둔다(광고 `adsAvailable`, Google 로그인, 영상 받기 등).
- **쓸 기능 고르기**(`src/lib/features.ts`): 사용자가 통화·영상·사람·Room을 숨기면 `AppHome`이 탭에서 빼고(`tabHidden`), 숨긴 탭으로 가는 `openTab`·`practice`는 사용법의 그 장을 연다(`openGuide` hidden). 스위치는 사용법 창(`GuideSheet`)에만, 장 ↔ 기능은 `featureOfGo`.
  새 탭이나 새 사용법 장을 만들면 `featureOfTab`·`featureOfGo`·`FEATURE_CHAPTER`(AppHome)·`FeatureMap`(구조도 칸)을 같이 본다. 하단 탭 목록은 `features.ts` `bottomTabs` 하나. 창구 모드에서는 쓰지 않는다.
- **대화 화면 하나의 문법:** AI 대화·AI 통화·1:1·단체방·Room 줄은 **누르면** 할 일 한 줄(`conversation/LineTools` — 듣기·번역·분석·📕 + 화면마다 `extra`). 내 줄 교정은 어디서나 `CorrectionChip`/`CorrectionCard`. 줄에 버튼을 늘 달지 않는다.
  통화 화면 파일: `RoleplayScreen`은 차례 흐름만 — 튜터 줄 소리 `lib/roleplay/linePlayer.ts`, 대본 표시 `lib/roleplay/transcriptMarks.ts`, 남은 시간·통화 정리 저장 `roleplay/callHooks.ts`, 머리·바닥 `roleplay/CallParts.tsx`. 한 줄 말해 보기(`sayLine`·`Attempt`)는 `lib/speech/sayLine.ts`·`components/speech/Attempt.tsx`(영역 speech).
- **안에서 쓰는 이름과 화면 이름이 다르다:** My = `map`, 대화 = `talk`(옛 `messages`도 여기로), 통화 = `roleplay`, Room = `rooms`, Quizbank 칸 = `keep`, Logbank 칸 = `log`, Languagebank 칸 = `lang`.
  옛 링크 `?screen=…`는 `AppHome.tsx` `resolveTab`이 새 자리로 보낸다 — 탭을 바꾸면 여기와 사용법(`GUIDE_CHAPTERS`)·새로워진 점 `guide` 칸·캡처 스크립트를 같이 본다.
- **탭끼리는 서로를 직접 부르지 않는다.** 이동은 `appIntents` 신호(아래 자동 표)로 하고, 받는 쪽이 처리한다. My 안 칸끼리는 이 폰 안 신호(`quizFocus.ts` QUIZ_FOCUS_EVENT · `lettersOpen.ts` LETTERS_OPEN_EVENT).
- **오늘 해볼 것·표현 장부(`learner`)는 채팅·통화 첫 화면이 같이 쓴다.** 바꾸면 두 곳을 다 본다.
- **광고**(무료·안드로이드만, 자리·설정·손익 전체는 `hub/app/ADS.md` — 자동): 배너는 영상·대화 목록만(My·채팅·통화·Room·사람에는 없음). 네이티브는 목록 사이·My 칸 안(Logbank 끝·Quizbank 문제 아래·Languagebank 끝 — 바닥 칸·전체 화면 모두)·끝 화면·읽는 시트 끝(`NativeAdSlot`, 층이 맨 위일 때만), 전면은 끝난 자리를 닫을 때만. 웹은 같은 자리에 AdSense만(`WebAdSlot`).
- **창구(웹, `src/lib/doors.ts`):** 겉은 다른 서비스, 속은 같은 앱. `call.` = Moyeo(첫 화면 Room), `talk.` = Pingo(첫 화면 사람 "🟢 지금 접속 중"), `spin.` = Spin(🎲 랜덤 탭 `random`, 웹만, 서버 스위치 `RANDOM_ENABLED`). 창구 주소의 `/`·`/<언어>` → 소개 페이지(`app/door/…`), `?screen=`이 붙으면 창구 모드.
- **다시 켤 때 하던 자리로**(`lib/resumeSpot.ts` resumeSpot.v1 이 폰): 하단 탭·My 칸과 전체 화면·열어 둔 소재 수업을 남겨, 1시간 안이면 그 자리로. 주소 ?screen·창구가 앞선다.
- **로그인:** AI 기능(채팅·통화·영상·My)은 로그인 없이, 사람·Room·메시지·게시판은 로그인해야(안 했으면 계정 카드).
- **운영자 신고함 `/ops`(웹만, 앱 빌드에서 빠짐):** 운영자 키로 열고 `/api/ops/reports`. "사람 기능 정지"는 대화·사람·Room·게시판·사진·랜덤 API의 쓰기를 403 `SUSPENDED`로 막고(`server/suspension.ts`), 앱 틀의 `SuspendedNotice`가 한 줄 띄운다 — 사람 기능 API에 쓰기 동작을 새로 만들면 그 라우트의 정지 목록에도 넣는다.
- **옛 앱이 부르는 서버:** Play에 남은 옛 빌드(2.79 이하 Stagebank 등)가 쓰는 API는 아래 자동 표 "밖에서 부르는 API"와 `hub/app/FEATURES.md` "옛 앱 전용"에 지울 조건과 함께.

## 고칠 때 순서

1. 바꿀 기능을 `hub/app/FEATURES.md`에서 찾고(같은 일을 하는 기능이 이미 있나), 영역을 아래 자동 표에서 찾아 "다른 영역이 씀"·API 괄호·신호 표로 같이 영향받는 곳을 본다.
2. 지키는 것은 `PRODUCT.md`, 퀴즈는 `hub/app/QUIZ.md`.
3. 코드를 고치고, 같은 커밋에서: 흐름·탭·영역이 바뀌었으면 위 "화면 흐름"을 새로 쓰고, 새 파일이면 `scripts/structure.json`, 그다음 `node scripts/structure.mjs`. 기능이 생기거나 빠지면 `scripts/features.json` → `node scripts/features.mjs`.
4. 구조가 그대로면 `hub/chat/log` 항목에 `- 구조: 변화 없음`.

<!-- 자동: scripts/structure.mjs가 아래를 다시 쓴다. 손으로 고치지 않는다. -->

## 자동: 하단 탭 (`src/components/AppHome.tsx`)

- 사람 기능 켜짐: 대화`talk` · 영상 학습`video` · 사람`people` · Room`rooms` · My`map` · 랜덤`random`
- 사람 기능 꺼짐(iOS 1차, `socialFeaturesEnabled()`): 채팅`chat` · 통화`roleplay` · 영상 학습`video` · My`map`

## 자동: 영역별 코드

> 화면 = `src/components/`, API = `src/app/api/`. API 뒤 괄호는 이 영역 밖에서 그 API를 부르는 영역,
> "다른 영역이 씀"은 이 영역 화면 코드를 가져다 쓰는 다른 영역. 고치기 전에 여기서 영향 범위를 본다.

### 앱 틀 — 상단바·하단 탭·업데이트·새로워진 점·사용법 `shell`
- 화면: `AiConsentGate` · `AppHome` · `FeatureMap` · `FullScreenLayer` · `GuideSheet` · `LanguagePick` · `LanguageSelector` · `LearningLanguageFlag` · `Providers` · `ShellUpdate` · `TabIcons` · `TargetLanguageSelector` · `UpdateNotice` · `WhatsNewSheet`
- API: `guide`(My 탭) · `whats-new`
- 웹 페이지: `/`
- 다른 영역이 씀: `AppHome` ← 학습 기록 공통, 사람 탭, 웹 전용 페이지 · `FullScreenLayer` ← 여러 영역 9곳 · `LanguageSelector` ← 웹 전용 페이지 · `TabIcons` ← 여러 영역 6곳 · `TargetLanguageSelector` ← 웹 전용 페이지

### 대화 탭 — AI 튜터 줄·1:1 메시지·단체방·팀 `talk`
- 화면: `AiTutorRow` · `rooms/MateAsk` · `rooms/MessagesTab` · `rooms/RoomDm` · `rooms/RoomGroups` · `rooms/TeamSpace`
- API: `dm`(사람 탭, Room 탭, 계정·로그인) · `groups`(사람 탭, Room 탭, 계정·로그인)
- 다른 영역이 씀: `AiTutorRow` ← 앱 틀 · `rooms/MateAsk` ← 사람 탭, Room 탭 · `rooms/MessagesTab` ← 앱 틀 · `rooms/RoomDm` ← 앱 틀, Room 탭 · `rooms/RoomGroups` ← 앱 틀, 사람 탭

### AI 채팅 (대화 → AI 튜터 줄) `chat`
- 화면: `ChatHistoryPanel` · `ChatWindow` · `ExpressionPeek` · `MessageBubble` · `ReportContentDialog` · `conversation/LineTools`
- API: `chat`(대화 탭, 사람 탭, Room 탭, 계정·로그인) · `chat/verify`(대화 탭, 사람 탭, Room 탭, 계정·로그인) · `report`
- 다른 영역이 씀: `ChatWindow` ← 앱 틀 · `conversation/LineTools` ← AI 통화, Room 탭

### AI 통화 (어디서나 뜨는 층 CallHost — 대화·사람 탭 📞) `call`
- 화면: `CallHost` · `CallList` · `RoleplayOwnLine` · `RoleplayPast` · `RoleplayReview` · `RoleplayScreen` · `roleplay/CallParts` · `roleplay/CallRecap` · `roleplay/CallReplay` · `roleplay/TurnDiagBox` · `roleplay/callHooks`
- API: `pack/finish` · `pack/today` · `roleplay/branch` · `roleplay/context`(My 탭) · `roleplay/listen`(대화 탭, 사람 탭, Room 탭, My 탭, 계정·로그인) · `roleplay/practice`(My 탭) · `roleplay/replay` · `roleplay/review`(My 탭) · `roleplay/turn`(My 탭)
- 다른 영역이 씀: `CallHost` ← 앱 틀 · `roleplay/CallParts` ← My 탭

### 말하기·통화 공용 부품 — 한 줄 말해 보기, 통화 화면 조각·말풍선 얼굴 자리 (AI 통화·사람 통화·채팅·My가 같이 씀) `speech`
- 화면: `speech/Attempt` · `speech/CallKit`
- 다른 영역이 씀: `speech/Attempt` ← AI 통화, My 탭 · `speech/CallKit` ← 대화 탭, AI 채팅, AI 통화, Room 탭

### 문장분석·표현 시트 (여러 화면에서 열림) `sheet`
- 화면: `AnalyzableEnglish` · `EnglishAnalysisProvider` · `EnglishAnalysisViewer` · `ExpressionInsightProvider` · `ExpressionInsightSheet` · `FindInMy` · `MarkForMap` · `SelectableEnglishText` · `SentenceAskPanel` · `TTSButton` · `VocabPreviewProvider` · `VocabSenseList` · `VocabWordPreview`
- API: `english-analysis/element` · `english-analysis/input` · `expression-ask` · `expression-insight` · `expression-units` · `learning-spans` · `translate`(대화 탭, AI 통화, 사람 탭, Room 탭, 계정·로그인) · `tts`(AI 통화, My 탭) · `vocab/gloss` · `vocab`
- 다른 영역이 씀: `AnalyzableEnglish` ← AI 채팅, 영상 학습 탭, 웹 전용 페이지 · `EnglishAnalysisProvider` ← 앱 틀, 웹 전용 페이지 · `ExpressionInsightProvider` ← 앱 틀, 웹 전용 페이지 · `FindInMy` ← AI 통화 · `SelectableEnglishText` ← AI 채팅 · `TTSButton` ← AI 채팅, AI 통화, My 탭

### 학습 기록 공통 — 오늘 해볼 것·표현 장부 (여러 화면이 같이 씀) `learner`
- 화면: `LedgerLinks` · `NextStepCard`
- API: `learner/ask` · `learner/brief` · `learner/comprehension`(문장분석·표현 시트, 영상 학습 탭) · `learner/growth` · `learner/ledger`(대화 탭, AI 채팅, AI 통화, 문장분석·표현 시트) · `learner/next` · `learner/profile` · `learner/self-check`(My 탭)
- 다른 영역이 씀: `LedgerLinks` ← AI 채팅, AI 통화, 영상 학습 탭 · `NextStepCard` ← AI 채팅, AI 통화

### 영상 학습 탭 `video`
- 화면: `contentDiscovery/ContentDiscoveryPanel` · `videoLearning/CatalogLibrary` · `videoLearning/CurrentSubtitleCard` · `videoLearning/SavedVideoSessions` · `videoLearning/SegmentPlayButton` · `videoLearning/StudyMaterialsList` · `videoLearning/SubtitleDebugPanel` · `videoLearning/SubtitleGenerationStatus` · `videoLearning/VideoLearningTab` · `videoLearning/VideoPlayer` · `videoLearning/VideoUrlInput` · `videoLearning/VideoWatchFullscreenDock` · `videoLearning/relayPlayer`
- API: `content-discovery/avatar` · `content-discovery/channels` · `content-discovery` · `video-library` · `video-subtitles/analyze` · `video-subtitles/gloss` · `video-subtitles/prepare` · `video-subtitles/prepare-from-stt` · `video-subtitles/transcribe-chunk` · `video-subtitles/window`
- 다른 영역이 씀: `videoLearning/VideoLearningTab` ← 앱 틀

### 사람 탭 — 프로필 목록·게시판·사진 `people`
- 화면: `AiTutorProfile` · `ProfileFrame` · `SuspendedNotice` · `rooms/BoardView` · `rooms/IconEditor` · `rooms/IconPacks` · `rooms/MediaImage` · `rooms/PeopleTab` · `rooms/RoomPeople`
- API: `board`(대화 탭, Room 탭, 계정·로그인) · `icons`(대화 탭, Room 탭, 계정·로그인) · `media`(Room 탭) · `social`(대화 탭, Room 탭, 계정·로그인)
- 다른 영역이 씀: `AiTutorProfile` ← 앱 틀, 대화 탭, AI 채팅, AI 통화, My 탭 · `ProfileFrame` ← Room 탭 · `SuspendedNotice` ← 앱 틀 · `rooms/IconPacks` ← 대화 탭, Room 탭 · `rooms/MediaImage` ← 대화 탭 · `rooms/PeopleTab` ← 앱 틀

### Room 탭 — 말하는 방 `room`
- 화면: `rooms/RoomCall` · `rooms/RoomGame` · `rooms/RoomParts` · `rooms/RoomView` · `rooms/RoomsScreen` · `rooms/VideoStage`
- API: `rooms/fix`(대화 탭, 사람 탭, 계정·로그인) · `rooms/game`(대화 탭, 사람 탭, 계정·로그인) · `rooms`(대화 탭, 사람 탭, 계정·로그인)
- 다른 영역이 씀: `rooms/RoomParts` ← 대화 탭, 사람 탭 · `rooms/RoomsScreen` ← 앱 틀

### 랜덤 연결 — 창구 Spin(성인인증·짝 맞추기, 웹만) `random`
- 화면: `rooms/RandomScreen`
- API: `random`(사람 탭, Room 탭)
- 다른 영역이 씀: `rooms/RandomScreen` ← 앱 틀

### My 탭 — 계정 카드·칸 셋 Logbank·Quizbank·Languagebank·첫 측정·소재 수업 `my`
- 화면: `notes/NotebookSection` · `studyMap/BankFlip` · `studyMap/BankHelp` · `studyMap/DictNotes` · `studyMap/Dictionary` · `studyMap/ExpressionCard` · `studyMap/FirstCheck` · `studyMap/FixedExplain` · `studyMap/FrameLesson` · `studyMap/GrammarExplain` · `studyMap/Growth` · `studyMap/InlineQuiz` · `studyMap/LanguageBank` · `studyMap/LessonHost` · `studyMap/LineParts` · `studyMap/Logbank` · `studyMap/QuizPlayer` · `studyMap/Quizbank` · `studyMap/ScriptPractice` · `studyMap/StudyChips` · `studyMap/StudyMapTab` · `studyMap/TodayCards` · `studyMap/UpNext` · `studyMap/bankTone`
- API: `curriculum/ask` · `curriculum/choices` · `curriculum/fixed-lesson` · `curriculum/frame-lesson` · `curriculum/generate` · `curriculum/item-lesson` · `curriculum/mission-check` · `curriculum/mission-seen` · `curriculum/missions` · `curriculum/option-notes` · `curriculum/pick` · `curriculum/progress` · `curriculum/qbank`(AI 통화) · `curriculum/quiz-stats` · `curriculum/recall` · `curriculum/restore` · `curriculum/review` · `curriculum`(AI 통화) · `curriculum/script` · `curriculum/scripts`(AI 통화) · `curriculum/spots` · `curriculum/stages` · `curriculum/typed-check` · `curriculum/words` · `notebook`(문장분석·표현 시트) · `notes/place` · `video-index/find`
- 다른 영역이 씀: `studyMap/DictNotes` ← AI 채팅, 영상 학습 탭 · `studyMap/Dictionary` ← 문장분석·표현 시트 · `studyMap/Growth` ← AI 통화 · `studyMap/LessonHost` ← 앱 틀 · `studyMap/QuizPlayer` ← AI 통화 · `studyMap/StudyChips` ← AI 채팅, AI 통화 · `studyMap/StudyMapTab` ← 앱 틀

### 계정·로그인 `account`
- 화면: `account/AccountCard` · `account/ProfileFacts`
- API: `account/config`(친구 초대·보상) · `account/delete`(친구 초대·보상) · `account/email/start`(친구 초대·보상) · `account/email/verify`(친구 초대·보상) · `account/google`(친구 초대·보상) · `account/me`(친구 초대·보상) · `account/password/change`(친구 초대·보상) · `account/password/login`(친구 초대·보상) · `account/password/signup`(친구 초대·보상) · `account/profile`(친구 초대·보상)
- 다른 영역이 씀: `account/AccountCard` ← 여러 영역 9곳 · `account/ProfileFacts` ← 대화 탭, 사람 탭, Room 탭

### 요금·포인트·광고 `billing`
- 화면: `BillingScreen` · `NativeAdSlot` · `PointStore` · `PointsIcon` · `WebAdSlot`
- API: `ads/config`(여러 영역 6곳) · `ads/ssv` · `ads/txt` · `entitlement`(여러 영역 14곳) · `points/sync`(여러 영역 14곳)
- 웹 페이지: `/subscribe`
- 다른 영역이 씀: `BillingScreen` ← 앱 틀, AI 채팅, 영상 학습 탭, 사람 탭 · `NativeAdSlot` ← 여러 영역 8곳 · `PointsIcon` ← 영상 학습 탭, 의견 보내기·반영 소식

### 친구 초대·보상 `invite`
- 화면: `invite/InviteButton` · `invite/InviteRewards` · `invite/InviteWelcome`
- API: `invite`(여러 영역 7곳)
- 웹 페이지: `/invite`
- 다른 영역이 씀: `invite/InviteButton` ← 사람 탭, Room 탭 · `invite/InviteRewards` ← 앱 틀, 사람 탭 · `invite/InviteWelcome` ← 앱 틀

### 의견 보내기·반영 소식 `feedback`
- 화면: `FeedbackButton` · `FeedbackFixedSheet`
- API: `feedback/fixed` · `feedback/image` · `feedback/news` · `feedback`
- 다른 영역이 씀: `FeedbackButton` ← 앱 틀 · `FeedbackFixedSheet` ← 앱 틀

### 웹 전용 페이지 `web`
- 화면: `LearningBookPanel` · `LearningReviewModal`
- 웹 페이지: `/door/[id]/[[...lang]]` · `/learning` · `/privacy`
- 다른 영역이 씀: `LearningBookPanel` ← 앱 틀

### 예약 작업·점검·개발용 (앱 화면 아님) `ops`
- API: `account/purge` · `build` · `curriculum/fixed-lesson/seed` · `curriculum/qbank/seed` · `media/sweep` · `ops/reports` · `simcheck/forget`
- 웹 페이지: `/dev/call-preview` · `/dev/roleplay-review` · `/dev/update-notice` · `/ops`

## 자동: 화면끼리 부르는 신호 (`src/lib/appIntents.ts`)

| 신호 | 보내는 영역 | 받는 영역 |
|---|---|---|
| `openTab` | 여러 영역 7곳 | 앱 틀 |
| `chatDraft` | — | AI 채팅 |
| `openVideo` | 대화 탭, AI 채팅, AI 통화, 문장분석·표현 시트, 학습 기록 공통 | 영상 학습 탭 |
| `practice` | AI 채팅, 학습 기록 공통 | 앱 틀, AI 채팅, AI 통화 |
| `startCall` | 앱 틀, AI 통화, 사람 탭, My 탭 | AI 통화 |
| `openCall` | 앱 틀, AI 통화, 사람 탭, My 탭 | AI 통화 |
| `sayOwnLine` | — | AI 통화 |
| `openNotes` | 앱 틀 | My 탭 |
| `openGuide` | 앱 틀 | 앱 틀 |
| `openLesson` | — | My 탭 |

## 자동: 쓰지 않는 것 (지울지 확인)

- 아무도 안 가져다 쓰는 화면 코드: 없음
- 앱·스크립트 어디서도 안 부르는 API: `curriculum/restore` · `roleplay/branch` · `video-index/find` · `video-subtitles/analyze` · `video-subtitles/gloss`
- 밖에서 부르는 API: `curriculum/choices` My 대본 고르기 방식(2026-10-29~)이 씀 — 2026-11-01 대본이 따라 말하기 하나가 되며 새 앱에서 뺌. Play에 나간 앱(2.75)은 이 방식이 없어 아무도 안 부름 — 다음 정리 때 지움(op scriptChoices도) · `pack/today` 옛 앱 2.48~2.75가 오늘의 팩에 씀 — 2.76부터 새 앱에서 뺌(2026-11-01 화면 코드 PackCard 지움), 최소 지원 버전을 2.76 이상으로 올리면 지움 · `pack/finish` 옛 앱 2.48~2.75가 오늘의 팩 끝(회고)에 씀 — 2.76부터 새 앱에서 뺌, 최소 지원 버전을 2.76 이상으로 올리면 지움 · `curriculum/pick` 옛 앱 2.48~2.74가 문장분석 "지도에 넣기"에 씀 — 2026-10-27 새 앱에서 뺌, 최소 지원 버전을 2.75 이상으로 올리면 지움 · `curriculum/progress` 옛 앱 2.48~2.74가 My 예전 기능(목표 지도·미션·직접 묻기·노트 목차)에 씀 — 2026-10-27 새 앱에서 뺌, 최소 지원 버전을 2.75 이상으로 올리면 지움 · `curriculum/mission-check` 옛 앱 2.48~2.74가 My 예전 기능(목표 지도·미션·직접 묻기·노트 목차)에 씀 — 2026-10-27 새 앱에서 뺌, 최소 지원 버전을 2.75 이상으로 올리면 지움 · `curriculum/mission-seen` 옛 앱 2.48~2.74가 My 예전 기능(목표 지도·미션·직접 묻기·노트 목차)에 씀 — 2026-10-27 새 앱에서 뺌, 최소 지원 버전을 2.75 이상으로 올리면 지움 · `curriculum/missions` 옛 앱 2.48~2.74가 My 예전 기능(목표 지도·미션·직접 묻기·노트 목차)에 씀 — 2026-10-27 새 앱에서 뺌, 최소 지원 버전을 2.75 이상으로 올리면 지움 · `curriculum/review` 옛 앱 2.48~2.74가 My 예전 기능(목표 지도·미션·직접 묻기·노트 목차)에 씀 — 2026-10-27 새 앱에서 뺌, 최소 지원 버전을 2.75 이상으로 올리면 지움 · `learner/ask` 옛 앱 2.48~2.74가 My 예전 기능(목표 지도·미션·직접 묻기·노트 목차)에 씀 — 2026-10-27 새 앱에서 뺌, 최소 지원 버전을 2.75 이상으로 올리면 지움 · `notes/place` 옛 앱 2.48~2.74가 My 예전 기능(목표 지도·미션·직접 묻기·노트 목차)에 씀 — 2026-10-27 새 앱에서 뺌, 최소 지원 버전을 2.75 이상으로 올리면 지움 · `learner/profile` 옛 앱 2.48~2.74가 My 예전 기능(목표 지도·미션·직접 묻기·노트 목차)에 씀 — 2026-10-27 새 앱에서 뺌, 최소 지원 버전을 2.75 이상으로 올리면 지움 · `ops/reports` 운영자 신고함 페이지 /ops(운영자 키) · `ads/ssv` AdMob 서버가 보상 확인으로 부름 · `ads/txt` AdSense가 /ads.txt로 읽음(next.config.ts rewrites) · `account/purge` Vercel 예약 작업(vercel.json) · `media/sweep` Vercel 예약 작업(vercel.json) · `curriculum/qbank/seed` Vercel 예약 작업(vercel.json) — 출시 초반 문제은행 미리 채우기 · `curriculum/fixed-lesson/seed` Vercel 예약 작업(vercel.json) — Stagebank 고정 수업 미리 만들기(앱 언어 ko·en) · `feedback/fixed` 의견함 예약 작업(scripts/feedback-notify.mjs) · `feedback/image` 의견함 정리(scripts/feedback-pull.mjs) · `simcheck/forget` 가상 사용자 점검이 끝날 때 · `curriculum/spots` 퀴즈 다시 짜기 — 틀린 곳 고르기 문항 미리 만들기(server/spotMake.ts), 화면은 설계안 5단계에서 붙임. 지금은 운영 확인만 · `video-subtitles/window` 옛 앱 2.48~2.57이 영상 해석에 씀 — 최소 지원 버전을 2.58 이상으로 올리면 지움 · `learner/growth` 옛 앱 2.48~2.74가 My 망·그래프(여섯 요소)에 씀 — 2.75부터 화면은 네 갈래(/api/notebook parts), 최소 지원 버전을 2.75 이상으로 올리면 화면용으로는 지움(점검 스크립트는 씀) · `english-analysis/input` 옛 앱 2.48~2.62가 문장분석에 씀 — 최소 지원 버전을 2.63 이상으로 올리면 지움 · `english-analysis/element` 옛 앱 2.48~2.62가 문장분석에 씀 — 최소 지원 버전을 2.63 이상으로 올리면 지움 · `learner/brief` 가상 사용자 점검(next·map 묶음)이 튜터 요약 확인에 씀 · `build` 시험 앱 껍데기(운영 웹을 불러 쓰는 디버그 APK)의 ShellUpdate가 새 배포 확인에 씀 · `curriculum/recall` 꺼내 쓰기(RecallPlayer) — 옛 앱 2.79 이하 My Stagebank가 씀 — 2026-11-09 개편을 모두에게 켜며 새 앱 화면을 지움, 최소 지원 버전을 2.80 이상으로 올리면 지움 · `curriculum/ask` 오늘 배운 것 직접 묻기 — 옛 앱 2.79 이하 My Stagebank가 씀 — 2026-11-09 개편을 모두에게 켜며 새 앱 화면을 지움, 최소 지원 버전을 2.80 이상으로 올리면 지움 · `curriculum/fixed-lesson` 지나온 단계 돌아보기(StageReview) — 옛 앱 2.79 이하 My Stagebank가 씀 — 2026-11-09 개편을 모두에게 켜며 새 앱 화면을 지움, 최소 지원 버전을 2.80 이상으로 올리면 지움

<!-- 자동 끝 -->
