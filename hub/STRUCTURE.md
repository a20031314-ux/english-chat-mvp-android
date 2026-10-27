# 앱 전체구조

> 모든 채팅이 시작할 때 자동으로 읽는다(CLAUDE.md). **고치기 전에** 여기서 바꿀 곳이 어느 영역이고 누가 같이 쓰는지 보고,
> **고친 커밋에서** 이 문서도 고친다. 무엇을 왜 지키는지는 `PRODUCT.md`(기능별 자세한 규칙), 서버가 저장하는 것은 `hub/data-map.md`.
>
> - 위쪽(손으로 씀): 화면 흐름·들어가는 길·영역 사이 규칙. 화면·흐름·탭·영역이 바뀌면 고친다.
> - 아래쪽(자동): 탭·영역별 코드·API·화면끼리 신호·안 쓰는 코드. `node scripts/structure.mjs`가 코드에서 만든다(main push 때 CI도 다시 만듦).
>   새 화면 파일·API·페이지는 `scripts/structure.json` 자리표에 영역을 정해 넣는다 — 빠지면 CI `structure`와 끝내기 훅이 막는다.
> - 구조가 안 바뀐 커밋(버그 수정·문구 등)은 그 채팅의 `hub/log` 항목에 `- 구조: 변화 없음` 한 줄.

## 화면 흐름 (손으로 씀)

```
앱 열기 ─ AI 동의(iOS만) ─ 쓸 기능 고르기(처음 설치만) ─ 새로워진 점(업데이트 뒤 한 번) ─ 초대 환영(초대 링크로 왔을 때)
│
상단바   학습 언어 · UI 언어 · 포인트/플랜 → 결제 화면 · ? 사용법(지금 탭의 칸) · 💬 의견 보내기
│        └ 업데이트 배너
하단 탭  대화 │ 영상 학습 │ 사람 │ Room │ My        (첫 화면: 대화)
│
├ 대화 talk ─ AI 튜터와의 대화 줄(맨 위 고정, 이름·국기 — 사람 대화처럼, 오늘의 팩 카드는 2.76에서 뺌) ─ 줄 → AI 대화 chat(머리 ‹ 대화 · 튜터 · 📞 · ⋮, 하단은 "대화"가 켜진 채)
│           │                      ├ 📞 → AI 통화 call(탭 아님 — 어디서나 떠 있는 층 CallHost)
│           │                      └ AI 튜터 프로필·AI 대화 ⋮ "통화 기록" → CallList(채팅과 따로, 2026-10-27: 이어서 하기·돌아보기·×, 이 폰에만)
│           ├ 단체방(팀이면 "대화 | 워크스페이스", 📞 단체방 통화 → 비공개 Room)
│           └ 1:1 메시지(요청 → 열림, 📞 → 둘만의 비공개 Room)
├ 영상 학습 video ─ 이달의 영상 · 링크 넣기 · 학습 언어 자막 · 문장 바 → 문장분석 시트
├ 사람 people ─ 맨 위 AI 튜터(사람 카드처럼, 로그인 없이도 — AiTutorProfile: 프로필 시트 💬 메시지 → AI 대화 · 📞 통화 · 통화 기록, 2026-10-27 "AI 튜터를 사람들과 통합") · 칩 [👥 사람 | 📋 게시판(학습 언어별, 주제 칩 자유·질문·메이트·보이스룸·단체방 → 메이트 신청·방 들어가기·단체방 참여) | 🙂 아이콘(묶음 만들기·받기)](이모지만) · 프로필 시트(팔로우·메시지·메이트 신청·차단·신고) · ➕ 친구 초대 → 시트(🎁 초대 보상 카드 + 공유)
├ Room room ─ 로비(방 카드) → 방(자리 8칸·듣는 줄·자막·댓글) · 👥 이 방 사람들과 단체방 · 🎭 게임(방장: 라이어 게임·마피아)
└ My my ─ 계정 카드 · 🎁 초대 보상 · 🤝 메이트·팀 줄 → 대화의 워크스페이스
          자라는 중 [망 | 그래프 | 단계](2.76: 내 표현·노트 칸은 숨김 — CURRICULUM_ONLY, 시작은 단계 고르기만 → POST learner/self-check)
          자라는 중 맨 위 "오늘의 학습"(튜터가 고친 줄 고르기). 세 보기 모두 같은 네 갈래 어휘·문법·표현·발음(2026-10-25, lib/notes/stageParts.ts, /api/notebook parts):
          단계 = 맨 위 대본으로 익힌 것(ScriptAmount — 표현·문법·틀·말한 문장, 할 수 있는 일 칸) · 사다리 1~5 → "n단계" → 대본으로 연습(맨 위 오늘의 대본 — 짚인 문법·아직인 표현으로 고름, 상황마다 ●○ + 표현으로 연습, 대본마다 핵심 표현 칩, 맨 위 ◐ 다시 연습(FrameRedoCards — 14일에 두 번 짚인 틀, /api/notebook redo), 아래 틀 바꿔 말하기 StageFrames(14개 학습 언어 1~3, 3단계 내 말로, 대본 줄 틀 태그로 "이 틀이 나오는 대본") → 그 틀의 대본, StageScripts — 통과는 /api/curriculum/scripts → 장부, 14개 학습 언어, 앱에 없는 언어는 ?pack=1로 받음) → 다음 단계까지(네 갈래 70% + 그 단계 상황 대본 모두, 표현 연습 → 그 표현의 대본): 가장 모자란 갈래 + 연습(다 70%면 "다음 단계로" → 단계 고르기) → 네 갈래 막대 → 고른 갈래의 칸·목록 → "이 단계에선 이런 대화가 돼요"(대화 예시 2·써 보기)
          망 = 네 꼭짓점(찬 정도, 점선 70%) · 그래프 = 갈래별 최근 14일 — 갈래를 누르면 단계 보기의 그 갈래. 지도가 없으면 체크 화면(대화 예시로 시작 단계 고르기 + 체크 3질문) 아래 같은 자라는 중

어디서나 열림  문장분석 시트 sheet (채팅·통화 돌아보기·영상·노트의 문장 → "분석") · 표현 시트 · 결제 화면
               └ 🔎 My에서 찾기(FindInMy) → 서버가 틀의 칸 → My 단계 보기 그 단계·칸 시트 + "이 장면 넣기"(화면 함께, lib/notes/locateHandoff.ts — AI 대화·통화·영상만 화면, 사람 대화는 고른 부분만)
```

- **사람 기능이 꺼지면**(iOS 1차, `src/lib/platform.ts` `socialFeaturesEnabled`): 하단은 채팅 │ 영상 학습 │ My(통화는 채팅 머리 📞), 대화·사람·Room·메시지·단체방 전부 없음.
  플랫폼마다 다른 것은 `platform.ts`에만 둔다(광고 `adsAvailable`, Google 로그인, 영상 받기 등).
- **쓸 기능 고르기**(`src/lib/features.ts`, 2026-10-21): 사용자가 통화·영상·사람·Room·노트를 숨기면 `AppHome`이 탭에서 빼고(`tabHidden`),
  숨긴 탭으로 가는 `openTab`·`practice`는 탭을 바꾸지 않고 사용법의 그 장을 연다(`openGuide` hidden). 스위치는 사용법 창(`GuideSheet`)에만 있고, 장 ↔ 기능은 `featureOfGo`.
  새 탭이나 새 사용법 장을 만들면 `featureOfTab`·`featureOfGo`·`FEATURE_CHAPTER`(AppHome)·`FeatureMap`(구조도 칸)을 같이 본다. 창구 모드에서는 쓰지 않는다.
  하단 탭 목록은 `features.ts` `bottomTabs` 하나로 정한다(AppHome과 구조도 미리보기가 같이 씀) — 탭 순서를 바꾸면 여기서.
- **대화 화면 하나의 문법**(2026-10-23, `hub/drafts/conversation-unify-2026-10-23.md`): AI 대화·AI 통화·1:1·단체방·Room 줄은 **누르면** 할 일 한 줄(`conversation/LineTools` — 듣기·번역·분석 + 화면마다 더함),
  내 줄 교정은 어디서나 `CorrectionChip`/`CorrectionCard`(채팅 설정 `correctionView` 하나). 줄에 버튼을 늘 달지 않는다 — 새 줄 기능은 LineTools의 `extra`로.
  AI 통화는 `CallHost`(AppHome에 늘 붙음)가 `startCall`·`practice`(tab roleplay)·`openCall`·`sayOwnLine` 신호로 연다. 저장된 통화는 `lib/roleplay/callStore.ts` — 통화 기록 목록 `CallList`만 보여 준다(채팅 안 🗒 카드·지난 대화 서랍에서는 뺌, 2026-10-27 사용자 "통화와 메시지 기록 따로"). `openCall` id 없음 = 목록. `?screen=roleplay`는 AI 대화로.
- **안에서 쓰는 이름과 화면 이름이 다르다:** My = `map`, 대화 = `talk`(옛 `messages`도 여기로), 통화 = `roleplay`, Room = `rooms`, 단어장 = `vocab`(My 노트 안).
  옛 링크 `?screen=…`는 `AppHome.tsx` `resolveTab`이 새 자리로 보낸다 — 탭을 바꾸면 여기와 사용법(`GUIDE_CHAPTERS`)·새로워진 점 `guide` 칸·캡처 스크립트를 같이 본다.
- **탭끼리는 서로를 직접 부르지 않는다.** "이 표현으로 채팅", "이 장면 영상으로" 같은 이동은 `appIntents` 신호(아래 자동 표)로 하고, 받는 쪽이 처리한다.
- **오늘 해볼 것·표현 장부(`learner`)는 여러 탭이 같이 쓴다:** 채팅·통화 첫 화면(My에서는 2026-10-27에 뺌). 바꾸면 두 곳을 다 본다.
- **My 예전 기능 뺌(2026-10-27):** 목표 지도 화면(주제·미션·복습)·직접 묻기·My의 오늘 해볼 것·노트 목차·문장분석 "지도에 넣기"는 새 앱에 없다.
  지도 기록(`curriculum`)은 단계·체크를 들고 있어 남고("새 목표"·"다음 단계로"가 체크 화면으로 다시 그림), 그 화면들의 API는 2.74 이하 앱용(아래 "밖에서 부르는 API").
- **광고**(무료·안드로이드만, 자리·설정·손익 전체는 `hub/ADS.md` — 자동): 배너는 둘러보는 화면(My·영상·대화 목록), 채팅·통화·Room·사람에는 없음. 통화·Room에서는 앱 오프닝 광고 없음(`AppHome.tsx` `BANNER_TABS`·`NO_APP_OPEN_TABS`).
  웹은 같은 목록 자리에 AdSense만(`WebAdSlot`, `lib/webAds.ts` — 전면·배너·앱 오프닝 없음, Vercel 값 넣기 전엔 꺼짐).
  목록 사이 네이티브 광고 `NativeAdSlot`: 대화 목록(단체방과 1:1 사이)·영상 목록(세 번째 뒤)·사람 목록(네 번째 뒤)·게시판(세 번째 글 뒤)·Room 로비(두 번째 방 뒤).
  웹 화면 위에 떠 있어 시트(`FullScreenLayer`·`BodyLayer`)가 열리면 멈추고, 탭이 숨으면 떼어 낸다(플러그인 동시 화면 2개 한도, `lib/ads.ts`).
  전면 광고는 끝나는 자리에만: 통화·팩·미션 끝, 채팅 몇 번 뒤 나갈 때, 공개 방에 몇 분 있다 나올 때(`RoomsScreen`), 영상을 몇 분 보고 나올 때(`VideoLearningTab`). 1:1·단체방 대화 안에는 광고 없음.
- **창구(웹, `src/lib/doors.ts`, `hub/drafts/doors.md`):** 겉은 다른 서비스(이름·색·소개 글·검색어), 속은 같은 앱. `call.languagebank.net` = Moyeo(단체통화, 첫 화면 Room), `talk.languagebank.net` = Pingo(1:1 대화, 첫 화면 사람 "🟢 지금 접속 중").
  `spin.languagebank.net` = Spin(랜덤 채팅·랜덤 영상통화, 성인인증한 사람끼리만, 첫 화면 🎲 랜덤 탭 `random` — 이 창구에만 보이는 탭, 웹만·앱에는 없음, 서버 스위치 `RANDOM_ENABLED`가 꺼져 있으면 "준비 중"). Pingo 사람 탭 위에 Spin으로 가는 줄(켜졌을 때만).
  창구 주소의 `/`·`/<언어>` → 소개 페이지(`app/door/…`, next.config.ts rewrites), `?screen=`이 붙으면 같은 앱이 **창구 모드**(첫 화면·하단 탭만 그 창구 것, 상단에 창구 이름). 계정·구독·기록은 하나.
- **로그인:** AI 기능(채팅·통화·영상·My)은 로그인 없이, 사람·Room·메시지·게시판은 로그인해야(안 했으면 계정 카드).
- **운영자 신고함 `/ops`(웹만, 앱 빌드에서 빠짐):** 운영자 키로 열고 `/api/ops/reports`. 여기서 누른 "사람 기능 정지"는 대화·사람·Room·게시판·사진·랜덤 API의 쓰기를 403 `SUSPENDED`로 막고(`server/suspension.ts`),
  앱은 그 답을 `lib/rooms/suspended.ts`에 남겨 앱 틀의 `SuspendedNotice`가 한 줄 띄운다 — 사람 기능 API에 쓰기 동작을 새로 만들면 그 라우트의 정지 목록에도 넣는다.

## 고칠 때 순서

1. 바꿀 기능의 영역을 아래 자동 표에서 찾고, "다른 영역이 씀"·API 괄호·신호 표로 같이 영향받는 곳을 본다.
2. 자세한 규칙은 `PRODUCT.md`의 그 기능 절에서 확인한다.
3. 코드를 고치고, 같은 커밋에서: 흐름·탭·영역이 바뀌었으면 위 "화면 흐름", 새 파일이면 `scripts/structure.json`, 그다음 `node scripts/structure.mjs`.
4. 구조가 그대로면 `hub/log` 항목에 `- 구조: 변화 없음`.

<!-- 자동: scripts/structure.mjs가 아래를 다시 쓴다. 손으로 고치지 않는다. -->

## 자동: 하단 탭 (`src/components/AppHome.tsx`)

- 사람 기능 켜짐: 대화`talk` · 영상 학습`video` · 사람`people` · Room`rooms` · My`map` · 랜덤`random`
- 사람 기능 꺼짐(iOS 1차, `socialFeaturesEnabled()`): 채팅`chat` · 통화`roleplay` · 영상 학습`video` · My`map`

## 자동: 영역별 코드

> 화면 = `src/components/`, API = `src/app/api/`. API 뒤 괄호는 이 영역 밖에서 그 API를 부르는 영역,
> "다른 영역이 씀"은 이 영역 화면 코드를 가져다 쓰는 다른 영역. 고치기 전에 여기서 영향 범위를 본다.

### 앱 틀 — 상단바·하단 탭·업데이트·새로워진 점·사용법 `shell`
- 화면: `AiConsentGate` · `AppHome` · `FeatureMap` · `FullScreenLayer` · `GuideSheet` · `LanguageSelector` · `LearningLanguageFlag` · `Providers` · `TabIcons` · `TargetLanguageSelector` · `UpdateNotice` · `WhatsNewSheet`
- API: `guide` · `whats-new`
- 웹 페이지: `/`
- 다른 영역이 씀: `AppHome` ← 학습 기록 공통, 사람 탭, My 탭, 웹 전용 페이지 · `FullScreenLayer` ← 여러 영역 8곳 · `LanguageSelector` ← 웹 전용 페이지 · `LearningLanguageFlag` ← 사람 탭, 계정·로그인 · `TargetLanguageSelector` ← 웹 전용 페이지

### 대화 탭 — AI 튜터 줄·1:1 메시지·단체방·팀 `talk`
- 화면: `AiTutorRow` · `rooms/MateAsk` · `rooms/MessagesTab` · `rooms/RoomDm` · `rooms/RoomGroups` · `rooms/TeamSpace`
- API: `dm`(사람 탭, Room 탭, 계정·로그인) · `groups`(사람 탭, Room 탭, 계정·로그인)
- 다른 영역이 씀: `AiTutorRow` ← 앱 틀 · `rooms/MateAsk` ← 사람 탭, Room 탭 · `rooms/MessagesTab` ← 앱 틀 · `rooms/RoomDm` ← 앱 틀, Room 탭 · `rooms/RoomGroups` ← 앱 틀, 사람 탭

### AI 채팅 (대화 → AI 튜터 줄) `chat`
- 화면: `ChatHistoryPanel` · `ChatWindow` · `ExpressionPeek` · `MessageBubble` · `ReportContentDialog` · `conversation/LineTools`
- API: `chat`(대화 탭, 사람 탭, Room 탭, 계정·로그인) · `chat/verify`(대화 탭, 사람 탭, Room 탭, 계정·로그인) · `report`
- 다른 영역이 씀: `ChatWindow` ← 앱 틀 · `conversation/LineTools` ← AI 통화, Room 탭

### AI 통화 (대화 → AI 튜터 📞) · 오늘의 팩 `call`
- 화면: `CallHost` · `CallList` · `PackCard` · `RoleplayOwnLine` · `RoleplayPast` · `RoleplayReview` · `RoleplayScreen` · `roleplay/TurnDiagBox`
- API: `pack/finish` · `pack/today` · `roleplay/context` · `roleplay/listen`(대화 탭, 사람 탭, Room 탭, 계정·로그인) · `roleplay/practice` · `roleplay/review` · `roleplay/turn`
- 다른 영역이 씀: `CallHost` ← 앱 틀 · `RoleplayOwnLine` ← My 탭 · `RoleplayReview` ← My 탭

### 문장분석·표현 시트 (여러 화면에서 열림) `sheet`
- 화면: `AnalyzableEnglish` · `EnglishAnalysisProvider` · `EnglishAnalysisViewer` · `ExpressionInsightProvider` · `ExpressionInsightSheet` · `FindInMy` · `MarkForMap` · `SelectableEnglishText` · `SentenceAskPanel` · `TTSButton` · `VocabPreviewProvider` · `VocabSenseList` · `VocabWordPreview`
- API: `english-analysis/element` · `english-analysis/input` · `expression-ask` · `expression-insight` · `expression-units` · `learning-spans` · `translate`(대화 탭, AI 통화, 사람 탭, Room 탭, 계정·로그인) · `tts`(AI 통화, My 탭) · `vocab/gloss` · `vocab`(My 탭)
- 다른 영역이 씀: `AnalyzableEnglish` ← AI 채팅, 영상 학습 탭, My 탭, 웹 전용 페이지 · `EnglishAnalysisProvider` ← 앱 틀, 웹 전용 페이지 · `ExpressionInsightProvider` ← 앱 틀, 웹 전용 페이지 · `SelectableEnglishText` ← AI 채팅 · `TTSButton` ← AI 채팅, AI 통화, My 탭 · `VocabSenseList` ← My 탭

### 학습 기록 공통 — 오늘 해볼 것·표현 장부 (여러 화면이 같이 씀) `learner`
- 화면: `LedgerLinks` · `NextStepCard`
- API: `learner/ask` · `learner/brief` · `learner/comprehension`(문장분석·표현 시트, 영상 학습 탭) · `learner/growth` · `learner/ledger`(대화 탭, AI 채팅, AI 통화, 문장분석·표현 시트, My 탭) · `learner/next` · `learner/profile` · `learner/self-check`(My 탭)
- 다른 영역이 씀: `LedgerLinks` ← AI 채팅, AI 통화, 영상 학습 탭, My 탭 · `NextStepCard` ← AI 채팅, AI 통화

### 영상 학습 탭 `video`
- 화면: `contentDiscovery/ContentDiscoveryPanel` · `videoLearning/CatalogLibrary` · `videoLearning/CurrentSubtitleCard` · `videoLearning/SavedVideoSessions` · `videoLearning/SegmentPlayButton` · `videoLearning/StudyMaterialsList` · `videoLearning/SubtitleDebugPanel` · `videoLearning/SubtitleGenerationStatus` · `videoLearning/VideoLearningTab` · `videoLearning/VideoPlayer` · `videoLearning/VideoUrlInput` · `videoLearning/VideoWatchFullscreenDock` · `videoLearning/relayPlayer`
- API: `content-discovery/avatar` · `content-discovery/channels` · `content-discovery` · `video-library` · `video-subtitles/analyze` · `video-subtitles/gloss` · `video-subtitles/prepare` · `video-subtitles/prepare-from-stt` · `video-subtitles/transcribe-chunk` · `video-subtitles/window`
- 다른 영역이 씀: `videoLearning/VideoLearningTab` ← 앱 틀

### 사람 탭 — 프로필 목록·게시판·사진 `people`
- 화면: `AiTutorProfile` · `SuspendedNotice` · `rooms/BoardView` · `rooms/IconEditor` · `rooms/IconPacks` · `rooms/MediaImage` · `rooms/PeopleTab` · `rooms/RoomPeople`
- API: `board`(대화 탭, Room 탭, 계정·로그인) · `icons`(대화 탭, Room 탭, 계정·로그인) · `media`(Room 탭) · `social`(대화 탭, Room 탭, 계정·로그인)
- 다른 영역이 씀: `AiTutorProfile` ← 대화 탭 · `SuspendedNotice` ← 앱 틀 · `rooms/IconPacks` ← 대화 탭, Room 탭 · `rooms/MediaImage` ← 대화 탭 · `rooms/PeopleTab` ← 앱 틀

### Room 탭 — 말하는 방 `room`
- 화면: `rooms/RoomGame` · `rooms/RoomParts` · `rooms/RoomView` · `rooms/RoomsScreen` · `rooms/VideoStage`
- API: `rooms/fix`(대화 탭, 사람 탭, 계정·로그인) · `rooms/game`(대화 탭, 사람 탭, 계정·로그인) · `rooms`(대화 탭, 사람 탭, 계정·로그인)
- 다른 영역이 씀: `rooms/RoomParts` ← 대화 탭, 사람 탭 · `rooms/RoomsScreen` ← 앱 틀

### 랜덤 연결 — 창구 Spin(성인인증·짝 맞추기, 웹만) `random`
- 화면: `rooms/RandomScreen`
- API: `random`(사람 탭, Room 탭)
- 다른 영역이 씀: `rooms/RandomScreen` ← 앱 틀

### My 탭 — 계정 카드·자라는 중·지도·노트·단어장 `my`
- 화면: `CharacterGuidePanel` · `VocabularyPanel` · `notes/NotebookSection` · `notes/NotesPanel` · `studyMap/GrowthNetwork` · `studyMap/LedgerPanel` · `studyMap/ScriptAmount` · `studyMap/ScriptPractice` · `studyMap/StageCheck` · `studyMap/StageFrames` · `studyMap/StageScripts` · `studyMap/StudyMapTab`
- API: `curriculum/generate`(학습 기록 공통) · `curriculum/mission-check` · `curriculum/mission-seen` · `curriculum/missions` · `curriculum/pick` · `curriculum/progress` · `curriculum/restore`(학습 기록 공통) · `curriculum/review` · `curriculum`(학습 기록 공통) · `curriculum/script` · `curriculum/scripts` · `curriculum/stages` · `notebook`(문장분석·표현 시트) · `notes/place` · `video-index/find`(학습 기록 공통)
- 다른 영역이 씀: `studyMap/GrowthNetwork` ← AI 통화 · `studyMap/StudyMapTab` ← 앱 틀

### 계정·로그인 `account`
- 화면: `account/AccountCard` · `account/ProfileFacts`
- API: `account/config`(친구 초대·보상) · `account/delete`(친구 초대·보상) · `account/email/start`(친구 초대·보상) · `account/email/verify`(친구 초대·보상) · `account/google`(친구 초대·보상) · `account/me`(친구 초대·보상) · `account/password/change`(친구 초대·보상) · `account/password/login`(친구 초대·보상) · `account/password/signup`(친구 초대·보상) · `account/profile`(친구 초대·보상)
- 다른 영역이 씀: `account/AccountCard` ← 여러 영역 6곳 · `account/ProfileFacts` ← 대화 탭, 사람 탭, Room 탭

### 요금·포인트·광고 `billing`
- 화면: `BillingScreen` · `NativeAdSlot` · `PointStore` · `PointsIcon` · `WebAdSlot`
- API: `ads/config`(앱 틀, AI 채팅, AI 통화, 영상 학습 탭, Room 탭) · `ads/ssv` · `ads/txt` · `entitlement`(여러 영역 14곳) · `points/sync`(여러 영역 14곳)
- 웹 페이지: `/subscribe`
- 다른 영역이 씀: `BillingScreen` ← 앱 틀, AI 채팅, 영상 학습 탭, 사람 탭 · `NativeAdSlot` ← 대화 탭, 영상 학습 탭, 사람 탭, Room 탭 · `PointsIcon` ← 영상 학습 탭, 의견 보내기·반영 소식

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
- API: `account/purge` · `media/sweep` · `ops/reports` · `simcheck/forget`
- 웹 페이지: `/dev/roleplay-review` · `/dev/update-notice` · `/ops`

## 자동: 화면끼리 부르는 신호 (`src/lib/appIntents.ts`)

| 신호 | 보내는 영역 | 받는 영역 |
|---|---|---|
| `openTab` | 여러 영역 7곳 | 앱 틀 |
| `chatDraft` | 여러 영역 6곳 | AI 채팅 |
| `openVideo` | 여러 영역 6곳 | 영상 학습 탭 |
| `practice` | AI 채팅, 학습 기록 공통, My 탭 | 앱 틀, AI 채팅, AI 통화 |
| `startCall` | 앱 틀, AI 통화, 사람 탭 | AI 통화 |
| `openCall` | 앱 틀, AI 통화, 사람 탭 | AI 통화 |
| `sayOwnLine` | 앱 틀 | AI 통화 |
| `openNotes` | 앱 틀, My 탭 | My 탭 |
| `openGuide` | 앱 틀, My 탭 | 앱 틀 |

## 자동: 쓰지 않는 것 (지울지 확인)

- 아무도 안 가져다 쓰는 화면 코드: 없음
- 앱·스크립트 어디서도 안 부르는 API: 없음
- 밖에서 부르는 API: `curriculum/pick` 옛 앱 2.48~2.74가 문장분석 "지도에 넣기"에 씀 — 2026-10-27 새 앱에서 뺌, 최소 지원 버전을 2.75 이상으로 올리면 지움 · `curriculum/progress` 옛 앱 2.48~2.74가 My 예전 기능(목표 지도·미션·직접 묻기·노트 목차)에 씀 — 2026-10-27 새 앱에서 뺌, 최소 지원 버전을 2.75 이상으로 올리면 지움 · `curriculum/mission-check` 옛 앱 2.48~2.74가 My 예전 기능(목표 지도·미션·직접 묻기·노트 목차)에 씀 — 2026-10-27 새 앱에서 뺌, 최소 지원 버전을 2.75 이상으로 올리면 지움 · `curriculum/mission-seen` 옛 앱 2.48~2.74가 My 예전 기능(목표 지도·미션·직접 묻기·노트 목차)에 씀 — 2026-10-27 새 앱에서 뺌, 최소 지원 버전을 2.75 이상으로 올리면 지움 · `curriculum/missions` 옛 앱 2.48~2.74가 My 예전 기능(목표 지도·미션·직접 묻기·노트 목차)에 씀 — 2026-10-27 새 앱에서 뺌, 최소 지원 버전을 2.75 이상으로 올리면 지움 · `curriculum/review` 옛 앱 2.48~2.74가 My 예전 기능(목표 지도·미션·직접 묻기·노트 목차)에 씀 — 2026-10-27 새 앱에서 뺌, 최소 지원 버전을 2.75 이상으로 올리면 지움 · `learner/ask` 옛 앱 2.48~2.74가 My 예전 기능(목표 지도·미션·직접 묻기·노트 목차)에 씀 — 2026-10-27 새 앱에서 뺌, 최소 지원 버전을 2.75 이상으로 올리면 지움 · `notes/place` 옛 앱 2.48~2.74가 My 예전 기능(목표 지도·미션·직접 묻기·노트 목차)에 씀 — 2026-10-27 새 앱에서 뺌, 최소 지원 버전을 2.75 이상으로 올리면 지움 · `learner/profile` 옛 앱 2.48~2.74가 My 예전 기능(목표 지도·미션·직접 묻기·노트 목차)에 씀 — 2026-10-27 새 앱에서 뺌, 최소 지원 버전을 2.75 이상으로 올리면 지움 · `ops/reports` 운영자 신고함 페이지 /ops(운영자 키) · `ads/ssv` AdMob 서버가 보상 확인으로 부름 · `ads/txt` AdSense가 /ads.txt로 읽음(next.config.ts rewrites) · `account/purge` Vercel 예약 작업(vercel.json) · `media/sweep` Vercel 예약 작업(vercel.json) · `feedback/fixed` 의견함 예약 작업(scripts/feedback-notify.mjs) · `feedback/image` 의견함 정리(scripts/feedback-pull.mjs) · `simcheck/forget` 가상 사용자 점검이 끝날 때 · `video-subtitles/window` 옛 앱 2.48~2.57이 영상 해석에 씀 — 최소 지원 버전을 2.58 이상으로 올리면 지움 · `learner/growth` 옛 앱 2.48~2.74가 My 망·그래프(여섯 요소)에 씀 — 2.75부터 화면은 네 갈래(/api/notebook parts), 최소 지원 버전을 2.75 이상으로 올리면 화면용으로는 지움(점검 스크립트는 씀) · `english-analysis/input` 옛 앱 2.48~2.62가 문장분석에 씀 — 최소 지원 버전을 2.63 이상으로 올리면 지움 · `english-analysis/element` 옛 앱 2.48~2.62가 문장분석에 씀 — 최소 지원 버전을 2.63 이상으로 올리면 지움 · `learner/brief` 가상 사용자 점검(next·map 묶음)이 튜터 요약 확인에 씀

<!-- 자동 끝 -->
