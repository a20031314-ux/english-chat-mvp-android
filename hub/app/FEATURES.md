# 기능 장부

> **자동 생성 — 손으로 고치지 않는다.** 원본 `scripts/features.json` → `node scripts/features.mjs`. CI `languages`가 `--check`로 맞는지 본다.
> 기능 하나 = 이름 하나 = 줄 하나. **새 버튼·방식·탭을 만들기 전에 여기서 같은 일을 하는 줄을 찾는다** — 있으면 그 이름·문구 키를 그대로 쓰고, 없을 때만 줄을 더한다(RULES "하나의 이름·지금만 적기").
> **쓰는 탭**은 코드에서 자동(`node scripts/scope.mjs <기능 id>`로 파일까지) — 둘 이상인 기능을 고치면 끝내기 훅이 그 탭들에 확인 요청을 만들게 한다(`hub/chat/ASKS.md`).
> 기능을 빼면 줄을 지우고 코드·문구 14개 언어·사용법·문서를 같은 커밋에서 지운다. 옛 앱이 쓰는 서버만 "옛 앱 전용"으로 남기고 지울 조건을 적는다.

## 지금 앱 (45)

### 앱 틀 — 상단바·하단 탭·업데이트·새로워진 점·사용법

| 기능 | 하는 일 | 쓰는 탭 | 코드 | 대신한 옛 기능 |
|---|---|---|---|---|
| 배울 언어 국기 줄 | 상단바에 내 배울 언어 국기 모두 — 누르면 그 언어로, 지금 국기 → 언어 설정 시트(배울 언어·앱 언어) | 1 메인 | `components/LearningLanguageFlag.tsx` · `lib/myLanguages.ts` |  |
| 처음 언어·튜터 고르기 | 처음 설치 때 국기 여러 개 → 언어마다 튜터 얼굴 하나 | 1 메인 · 2 My · 3 AI · 4 사람 | `components/LanguagePick.tsx` · `lib/firstLanguage.ts` |  |
| 사용법 `guideOpen` | 상단 ? — 지금 탭의 장, 맨 앞 탭은 쓸 기능 고르기. 장마다 넘겨 보기 장면만(14개 앱 언어, 칸 칩 → 첫 장 핵심, 넘기면 세부 — 기능 이름·설명은 그림 안), 장면 없는 장은 안 보임 | 1 메인 · 2 My | `components/GuideSheet.tsx` · `lib/guide/slides.ts` | 학습 흐름 · 장마다 카드 둘·칸 글 · 노트·단어장 장 |
| 새로워진 점 `whatsNewTitle` | 업데이트 뒤 한 번, 앱 언어별 캡처 | 1 메인 | `components/WhatsNewSheet.tsx` · `lib/whatsNew.ts` |  |
| 업데이트 알림 | 새 빌드가 있으면 배너, 최소 지원 버전 밑이면 막는 화면 · 시험 앱 껍데기는 새 배포 줄 | 1 메인 | `components/UpdateNotice.tsx` · `components/ShellUpdate.tsx` |  |
| AI 데이터 동의 | iOS 처음 열 때 한 번 — 무엇을 누구에게 보내는지·동의(이 기기) | 1 메인 | `components/AiConsentGate.tsx` |  |

### 의견 보내기·반영 소식

| 기능 | 하는 일 | 쓰는 탭 | 코드 | 대신한 옛 기능 |
|---|---|---|---|---|
| 의견 보내기 `feedbackOpen` | 상단 💬 — 글·사진, 반영되면 소식 시트와 포인트 | 1 메인 | `components/FeedbackButton.tsx` · `components/FeedbackFixedSheet.tsx` |  |

### 대화 탭 — AI 튜터 줄·1:1 메시지·단체방·팀

| 기능 | 하는 일 | 쓰는 탭 | 코드 | 대신한 옛 기능 |
|---|---|---|---|---|
| AI 튜터 줄 | 대화 탭 맨 위 — 고른·팔로우한 튜터마다 한 줄, 마지막 말, 📞 통화 문 하나, 숙제 줄·점 | 1 메인 · 2 My · 3 AI · 4 사람 | `components/AiTutorRow.tsx` · `lib/tutorFollows.ts` |  |
| 1:1 메시지 `homeTabMessages` (화면: 메시지) | 요청 → 열림, 📞 둘만의 비공개 방 | 1 메인 · 4 사람 | `components/rooms/RoomDm.tsx` |  |
| 단체방 | 단체 대화 · 팀 워크스페이스 · 📞 단체방 통화 | 1 메인 · 4 사람 | `components/rooms/RoomGroups.tsx` · `components/rooms/TeamSpace.tsx` |  |

### 사람 탭 — 프로필 목록·게시판·사진

| 기능 | 하는 일 | 쓰는 탭 | 코드 | 대신한 옛 기능 |
|---|---|---|---|---|
| 튜터 프로필 | 사람 프로필과 같은 틀 — 소개 · 📞 통화 문 하나 · 숙제 · 마지막 메모(누르면 그 통화 돌아보기) · 팔로우·메시지·통화 기록 | 1 메인 · 2 My · 3 AI · 4 사람 | `components/AiTutorProfile.tsx` · `lib/roleplay/tutorDesk.ts` |  |
| 사람 `homeTabPeople` | 맨 위 AI 튜터 둘 + 사람 카드·프로필(팔로우·메시지·메이트·차단·신고) | 1 메인 · 2 My · 4 사람 | `components/rooms/PeopleTab.tsx` · `components/rooms/RoomPeople.tsx` |  |
| 게시판 | 학습 언어별, 주제 칩 자유·질문·메이트·단체방 | 4 사람 | `components/rooms/BoardView.tsx` |  |
| 아이콘·짤 | 1:1·단체방·게시판 🙂 — 마켓(받기·신고)·편집기 | 4 사람 | `components/rooms/IconPacks.tsx` · `components/rooms/IconEditor.tsx` |  |

### AI 채팅 (대화 → AI 튜터 줄)

| 기능 | 하는 일 | 쓰는 탭 | 코드 | 대신한 옛 기능 |
|---|---|---|---|---|
| AI 채팅 `homeTabChat` (화면: 채팅) | 튜터별 대화방, 입력창 하나(학습 언어면 대화, 편한 말이면 학습 언어로 이어감 + 표현 보기), 교정 칩 | 1 메인 · 2 My · 3 AI | `components/ChatWindow.tsx` · `components/MessageBubble.tsx` |  |

### AI 통화 (어디서나 뜨는 층 CallHost — 대화·사람 탭 📞)

| 기능 | 하는 일 | 쓰는 탭 | 코드 | 대신한 옛 기능 |
|---|---|---|---|---|
| 통화 설명 | 통화 중 맨 위 📞 통화 ⓘ → 설명창(튜터 · 코치 · 끝나면, 세 줄) — 처음 한 번 저절로(callInfoSeen.v1 이 폰) | 1 메인 · 2 My · 3 AI | `components/roleplay/CallParts.tsx` |  |
| 통화 `homeTabCall` | 📞 하나 — 고르기 없이 인사, 튜터는 대화만(요즘 퀴즈로 배운 말이 나오는 화제·가끔 내 쪽 것을 설명해 달라고), 고친 말은 코치(같은 언어 짝 튜터) 띠가 내 얼굴 아래 소리 없이 — 따라 말하면 앱이 낱말 대조로 ✓, 내 말 기다리기(멈춘 뒤 0.9~2초, 채팅 ⋮·통화 ⓘ에서 고름, 기본 1.8초) | 1 메인 · 2 My · 3 AI · 4 사람 | `components/CallHost.tsx` · `components/RoleplayScreen.tsx` · `lib/roleplay/transcriptMarks.ts` · `lib/roleplay/recentLearned.ts` | 통화 문 넷(자유대화·🎓 수업·🎲 게임 스무고개·🧑‍🏫 가르치기) · 수업 튜터가 말로 짚고 다시 말해 보기 · 수업 계획(틀 셋·칠판 카드·⏭ 다음 문장·숙제 리뷰) |
| 통화 끝 화면 | 요약 한 줄 · 튜터 메모 · 이렇게도 말할 수 있었어요 · 전체 대본 · 통화 정리 · 이번 통화의 고쳐 씀 | 1 메인 · 2 My · 3 AI | `components/roleplay/CallParts.tsx` · `components/roleplay/CallRecap.tsx` |  |
| 이렇게도 말할 수 있었어요 `replayTitle` | 끝난 대본으로 대화 시뮬레이션 하나(통화 흐름 그대로 → 짧게 끝낸 곳에서 한 걸음 더) — 바뀐 조각만 빈칸 → 말하기 → 한 줄 전체 | 3 AI | `components/roleplay/CallReplay.tsx` | 장면 둘(같은 흐름 · 한 걸음 더/다른 갈래) |
| 숙제 `homeworkTag` | 코치가 하나라도 고친 통화 끝 — [퀴즈 \| 대화](퀴즈는 고친 말·장면 조각), 숙제 줄은 튜터 줄·Logbank 오늘 카드 | 2 My · 3 AI · 4 사람 | `lib/roleplay/homeworkQuiz.ts` |  |
| 통화 기록 `callRecordsTitle` | 튜터 프로필 — 한 목록, 이어서 하기·돌아보기(이 폰) | 1 메인 · 2 My · 3 AI · 4 사람 | `components/CallList.tsx` · `lib/roleplay/callStore.ts` |  |

### 친구 초대·보상

| 기능 | 하는 일 | 쓰는 탭 | 코드 | 대신한 옛 기능 |
|---|---|---|---|---|
| 친구 초대 | ➕ → 초대 보상 카드 + 공유 | 4 사람 | `components/invite/InviteButton.tsx` · `components/invite/InviteRewards.tsx` |  |

### Room 탭 — 말하는 방

| 기능 | 하는 일 | 쓰는 탭 | 코드 | 대신한 옛 기능 |
|---|---|---|---|---|
| Room `homeTabRooms` | 로비 열린 방 → 방(자리 8칸·듣는 줄·자막·댓글), 👥 단체방으로 | 1 메인 · 4 사람 | `components/rooms/RoomsScreen.tsx` · `components/rooms/RoomView.tsx` |  |
| 방 게임 | 🎭 방장이 라이어 게임·마피아 | 4 사람 | `components/rooms/RoomGame.tsx` |  |

### 영상 학습 탭

| 기능 | 하는 일 | 쓰는 탭 | 코드 | 대신한 옛 기능 |
|---|---|---|---|---|
| 영상 학습 `homeTabVideo` | 이달의 영상·링크 넣기·학습 언어 자막·문장 바 → 문장분석 | 1 메인 · 3 AI | `components/videoLearning/VideoLearningTab.tsx` |  |

### My 탭 — 계정 카드·칸 셋 Logbank·Quizbank·Languagebank·첫 측정·소재 수업

| 기능 | 하는 일 | 쓰는 탭 | 코드 | 대신한 옛 기능 |
|---|---|---|---|---|
| 첫 측정 | 학습 언어로 처음 My를 열면 — 글자(글자가 다른 언어) → 단계 문단 한 장씩 [어려워요 · 딱 맞아요 · 쉬워요] → 시작 단계(건너뛰기 = 1단계) | 2 My | `components/studyMap/FirstCheck.tsx` · `lib/curriculum/firstCheck.ts` | 단계 고르기(대화 예시) · 단계 오르내리기 시험(PlacementPlayer) · 초급·중급·고급 체크 · 낱말 예/아니오·뜻 고르기·표현·문법 오르기 |
| Logbank `logbankTitle` | My 첫 칸, 기록만 — 배운 것 표 · 쌓기 기둥(날마다 요소 자리 순서로 블록 — 누르면 그 카드, 다시 맞힌 블록은 흰 점, 누른 날 비율 막대·요소 칩·↺ 다시 맞힘·✎✓ 고쳐 씀 칩 → 카드들) · 학습 곡선(활용 누적 — 점 › → 그날 새로 활용한 카드·쓴 문장) · 그날 세부 = 학습 타임라인(%·띠·육각형 없음) | 1 메인 · 2 My · 3 AI · 4 사람 | `components/studyMap/Logbank.tsx` · `lib/curriculum/logLedger.ts` | 복습 칸 · 📈 실력 기록 · 이번 주 확인 · 띠·육각형 %·부족한 점 · 날마다 한 줄 목록 · 학습 곡선 학습 막대 · ↺ 다시 맞힘·✎✓ 고쳐 씀·📞 통화 칩 줄(통화는 튜터 프로필 통화 기록) |
| 오늘의 학습 `notebookToday` | My 맨 위 계정 카드 아래 = 오늘 타임라인 — 오늘 한 학습 시간 줄(Logbank 그날 세부와 같은 줄, 누르면 그 덩어리 세부) 뒤에 오늘 할 것 칸: ▶ Quizbank n/10(오늘 답한 서로 다른 것) · 글자부터면 오늘의 글자 묶음 · 숙제(있을 때) · 고른 튜터와 통화(튜터 얼굴, 누르면 튜터 프로필 — 📞·메모·통화 기록, 오늘 통화 한 번이면 ✓), 다 끝나면 제목 ✓ · ⏱ 오늘 분 | 1 메인 · 2 My · 3 AI | `components/studyMap/TodayCards.tsx` · `lib/curriculum/todayCards.ts` · `components/studyMap/Logbank.tsx` | 오늘 할 것(Stagebank) · 다음 추천 · 오늘 카드 셋(막힌 것·다시 학습·새로 학습·써 보기) · 📏 실력 확인(2주마다 다시 측정·Logbank 기록 표) |
| 학습 타임라인 | Logbank 그날 세부 — 학습 시간(10분 쉼으로 끊음) → 요소별 카드 → 카드 지난 기록 | 1 메인 · 2 My · 3 AI | `lib/curriculum/studyTimeline.ts` |  |
| 학습 수 `lbFresh` (화면: 학습) | 그 기간에 퀴즈로 답한 서로 다른 것의 수 — Logbank 배운 것 표 열·쌓기 기둥·그날 칸. 낱말마다 붙는 표시 없음(사전에 마지막 틀림 ✗만) | 1 메인 · 2 My · 3 AI | `lib/curriculum/growthView.ts` · `lib/curriculum/studyTimeline.ts` | 체크 셋 이름(New·적용이 힘듦·알아요) 표시 · 점 셋 · 낱말 표시 학습 · n번 학습 · 새로 학습 · 다시 학습 · 학습 n번(공부 묶음 수) |
| Quizbank `keepTitle` | 한 흐름 퀴즈 — 다시 볼 것(막힌 것 먼저)과 새 묶음 번갈아, 낱말은 예문 속 뜻 고르기(보기가 안 모이면 그 낱말은 안 냄), 문법·표현은 사다리(고르기 — 맞는 꼴·문맥·대답 고르기·틀린 문장 → 빈칸 → 틀린 곳)를 유형 먼저(고르기 1~5단계 → 빈칸 → 틀린 곳), 문단 틀린 곳(P1~P4), 게이지(난이도 − 높아지는 막대 다섯 +)로 난이도, 종류 비율은 약한 쪽으로·연달아 다 맞힌 종류는 잠깐 줄임, 문법·표현은 퀴즈로 닿은 단계부터(그 단계 문법 칸을 다 끝내면 위로), 1~5단계 문법을 다 끝내면 다음 회차(같은 칸 새 문장 — 문제은행·튜터 줄), 대화 채우기(이 폰 채팅·통화에서 고침받은 내 줄·소재가 든 줄 — 한 곳 빈칸), 답 뒤 📕 | 1 메인 · 2 My · 3 AI | `components/studyMap/Quizbank.tsx` · `components/studyMap/InlineQuiz.tsx` · `lib/curriculum/quiz.ts` · `lib/curriculum/ladder.ts` | Quizbank 탭 [어휘 \| 다시 보기 \| 시험] · 📝 단어 시험 · 정기 시험 · 😴 쉬워요 줄 · ⚙ 어떤 낱말 · 낱말 쓰기·예문 없이 쓰기·맞나 틀리나 · 넣어 둔 영어 낱말 쓰기 문제(en-w) · 아는 확률로 모양 고르기(quizTier) · 맞나 틀리나(문법 실수 끼우기) · 낱말 스스로 체크(알아요 \| 모르겠어요) |
| Languagebank `languagebankTitle` | 사전 — 찾기 + 자주 쓴 말(대화 수) + 종류(품사\|주제 × 난이도) → 묶음([퀴즈 \| 대화] 순서) → 낱말 화면(마지막 틀림 ✗ · 대화에서 n번 씀, 같이 배우기), 표현·문법은 소재 수업, 칠하기 = 첫 측정에서 시작해 퀴즈로 고쳐 감, 숫자 = 개수 | 1 메인 · 2 My · 3 AI | `components/studyMap/LanguageBank.tsx` · `components/studyMap/Dictionary.tsx` · `lib/curriculum/wordUse.ts` · `lib/curriculum/firstCheck.ts` | Stagebank · 📕 단어 사전 버튼 · 📖 배울 수 있는 것 |
| 넘겨 보기 `flipStart` | Languagebank 묶음 ▶ — 뜻·단어·예문 중 하나 가림 → [다시 \| 됐어요] | 2 My | `components/studyMap/BankFlip.tsx` · `lib/curriculum/bankFlip.ts` |  |
| 글자·소리 `fcLetters` (화면: 글자) | 글자가 다른 학습 언어 — Languagebank 첫 줄 칸, 글자부터면 오늘의 학습에 오늘의 글자 묶음 줄(Quizbank는 그대로) | 2 My · 3 AI | `components/studyMap/ScriptPractice.tsx` · `lib/curriculum/lettersOpen.ts` |  |
| 소재 수업 | 어디서나 여는 층(openLesson) — 문장구조 수업 [설명 › 퀴즈 › 대화] · 문법 한 장 · 표현 카드 | 2 My | `components/studyMap/LessonHost.tsx` · `components/studyMap/FrameLesson.tsx` · `components/studyMap/ExpressionCard.tsx` · `components/studyMap/GrammarExplain.tsx` |  |
| 같이 배우기 `lbStudyWith` | 칩 최대 셋 → 소재 수업 — Languagebank 단어 화면(그 단어와 같이) · 채팅 표현 보기 아래 · 통화 정리 줄(하고 싶었던 말에 든 문장구조·표현·문법), 덜 다진 것 먼저, 모델 없음 | 1 메인 · 2 My · 3 AI | `components/studyMap/StudyChips.tsx` · `lib/curriculum/wordUse.ts` |  |
| 사전 주석 | 학습 언어 문장 아래 📕 + 그 문장의 단어·표현 칩 → 사전 시트·소재 수업(대화 줄·자막·퀴즈 답 뒤) | 1 메인 · 2 My · 3 AI | `components/studyMap/DictNotes.tsx` · `lib/curriculum/dictNotes.ts` |  |
| 칸 설명 | Logbank·Quizbank·Languagebank 머리 ? — 사용법 My 장의 그 칸 넘겨 보기로 엶 | 1 메인 · 2 My | `components/notes/NotebookSection.tsx` · `lib/guide/slides.ts` | 칸 설명 시트(옛 Quizbank 탭·단어 시험·Logbank 육각형 글) |

### 문장분석·표현 시트 (여러 화면에서 열림)

| 기능 | 하는 일 | 쓰는 탭 | 코드 | 대신한 옛 기능 |
|---|---|---|---|---|
| 문장분석 | 채팅·통화 돌아보기·영상의 문장 → 분석 시트 | 1 메인 | `components/EnglishAnalysisViewer.tsx` |  |
| My에서 찾기 `findInMy` | 🔎 — 그 말의 문법·표현 수업을 열고, 없으면 사전 시트 | 1 메인 · 3 AI | `components/FindInMy.tsx` | 노트 칸 열고 이 장면 넣기 |
| 표현 시트 | 표현을 누르면 — 뜻·이 문장에서·쓰임 | 1 메인 | `components/ExpressionInsightSheet.tsx` · `components/ExpressionInsightProvider.tsx` |  |

### 요금·포인트·광고

| 기능 | 하는 일 | 쓰는 탭 | 코드 | 대신한 옛 기능 |
|---|---|---|---|---|
| 결제 화면 `billingScreenTitle` (화면: 플랜 및 결제) | 플랜(라이트·플러스·프리미엄)·포인트 상점 | 1 메인 · 3 AI · 4 사람 | `components/BillingScreen.tsx` · `components/PointStore.tsx` |  |
| 광고 | 무료·안드로이드만 — 자리 전체는 hub/app/ADS.md | 1 메인 · 2 My · 3 AI · 4 사람 | `components/NativeAdSlot.tsx` · `lib/ads.ts` |  |

### 계정·로그인

| 기능 | 하는 일 | 쓰는 탭 | 코드 | 대신한 옛 기능 |
|---|---|---|---|---|
| 계정 카드·로그인 | My 맨 위·사람 기능 앞 — 로그인(Google·이메일 코드·아이디)·사진·닉네임·자기소개·프로필 칸 | 1 메인 · 2 My · 3 AI · 4 사람 | `components/account/AccountCard.tsx` · `components/account/ProfileFacts.tsx` |  |

### 랜덤 연결 — 창구 Spin(성인인증·짝 맞추기, 웹만)

| 기능 | 하는 일 | 쓰는 탭 | 코드 | 대신한 옛 기능 |
|---|---|---|---|---|
| 랜덤 연결 | 창구 Spin(웹만, 서버 스위치 꺼짐) — 성인인증·랜덤 채팅·영상 | 4 사람 | `components/rooms/RandomScreen.tsx` |  |

## 옛 앱 전용 서버 (4) — 새 앱 화면엔 없음

| 무엇 | 쓰는 앱 | 코드 | 지울 때 |
|---|---|---|---|
| Stagebank 서버(대본·단계 시험·꺼내 쓰기·돌아보기) | 옛 앱 2.79 이하 My Stagebank가 부름 — 새 앱은 Quizbank 익힘 기록(scripts check)만 씀 | `app/api/curriculum/recall/route.ts` · `app/api/curriculum/ask/route.ts` · `app/api/curriculum/fixed-lesson/route.ts` | 최소 지원 버전 2.80 이상 |
| 통화 튜터 수업 서버(말로 짚기·다시 말해 보기) | 옛 앱 2.79 이하 통화 🎓 튜터 수업이 coach: true로 부름 — 새 앱은 코치 띠(앱 채점), director.ts coachRules·spokenCoachFix·silent·study | `lib/roleplay/director.ts` | 최소 지원 버전 2.80 이상 |
| 사용법 글·칸 설명 서버(칸 글·학습 흐름·카드·? 설명) | 옛 앱 2.79 이하 사용법·Stagebank·Quizbank·Logbank ?가 /api/guide(overview·banks·칸 글)로 읽음 — 새 앱은 장면(slides)만 | `lib/guide/content.ts` · `lib/guide/overview.ts` · `lib/guide/banks.ts` | 최소 지원 버전 2.80 이상 |
| 오늘 해볼 것 서버(채팅 빈 화면 카드·연습 목표) | 옛 앱 2.80 이하 채팅 빈 화면 '오늘 해볼 것' 카드가 /api/learner/next로 읽고, 고른 연습을 /api/chat·/api/roleplay/turn에 practice로 보냄 — 새 앱엔 카드·practice 신호 없음(할 것은 My 오늘의 학습) | `app/api/learner/next/route.ts` · `lib/learner/next.ts` · `lib/learner/practice.ts` | 최소 지원 버전 2.81 이상 |

## 지울 것 (0) — 화면은 없어졌는데 코드가 남음

| 무엇 | 왜 남았나 | 남은 코드 |
|---|---|---|

## 연결 묶음 (6) — 같은 일을 여러 기능이 함

> 한 기능 쪽만 바뀌면(고도화·변경) 나머지 기능을 같이 맞추거나 hub/chat/log에 `- 연결 <묶음>: <기능 id> 맞춤|일부러 다름 — 이유|해당 없음 — 이유`(`node scripts/links.mjs --diff <시작 커밋>` — 끝내기 훅·CI). 계속 다르게 둘 것은 differs에. 주 1회 예약 작업 "연결 맞춤 점검"이 묶음마다 두 코드를 비교해 한쪽에만 있는 개선을 `hub/work/reports.md`에.

| 묶음 | 맞출 것 | 기능 · 그 기능의 파일 | 일부러 다름 |
|---|---|---|---|
| 퀴즈 문제 만들기 `quiz-make` | 문제 모양·오답 보기·넣어 둔 문제·틀린 곳 이유·보기 설명·난이도 — Quizbank를 고도화하면 다른 퀴즈도 같은 문제 재료·근거를 쓰는지 | Quizbank `components/studyMap/Quizbank.tsx`·`lib/curriculum/ladder.ts`·`lib/curriculum/ladderQuiz.ts` / 소재 수업 `components/studyMap/FrameLesson.tsx` / 숙제 `lib/roleplay/homeworkQuiz.ts` / 첫 측정 `lib/curriculum/firstCheck.ts`·`components/studyMap/FirstCheck.tsx` / 공용 `components/studyMap/QuizPlayer.tsx`·`lib/curriculum/quiz.ts` |  |
| 따라 말하기 채점 `say-grade` | 말한 문장을 목표 문장과 대조해 ✓·한 번 더·틀린 낱말 표시 — 통화 코치 띠·대화 시뮬레이션·수업·퀴즈 말하기가 같은 잣대인지 | 통화 `lib/roleplay/transcriptMarks.ts`·`components/RoleplayScreen.tsx` / 이렇게도 말할 수 있었어요 `components/roleplay/CallReplay.tsx`·`lib/roleplay/replay.ts` / 소재 수업 `components/studyMap/LineParts.tsx` / Quizbank `components/studyMap/QuizPlayer.tsx` / 공용 `lib/roleplay/practice.ts`·`components/speech/Attempt.tsx` |  |
| 내 줄 교정 보이기 `correction-view` | 내가 쓴·말한 줄의 고친 꼴·이유 표시(CorrectionChip·CorrectionCard) — AI 채팅·통화 돌아보기·사람 대화가 같은 모양인지 | AI 채팅 `components/MessageBubble.tsx`·`components/ChatWindow.tsx` / 통화 끝 화면 `components/RoleplayReview.tsx` / Room `components/rooms/RoomParts.tsx` / 공용 `components/conversation/LineTools.tsx` |  |
| 튜터 문 `tutor-door` | 튜터 얼굴·💬·📞·숙제 줄로 들어가는 문 — 대화 탭 튜터 줄·튜터 프로필·사람 탭 튜터 둘·오늘의 학습 튜터 칸이 같은 문·같은 이름인지 | AI 튜터 줄 `components/AiTutorRow.tsx` / 튜터 프로필 `components/AiTutorProfile.tsx` / 사람 `components/rooms/PeopleTab.tsx` / 오늘의 학습 `components/studyMap/TodayCards.tsx` |  |
| 통화 화면 `call-screen` | 얼굴 칸·자막·🙉·버튼 줄·끝내기 — AI 통화와 사람 통화(1:1·Room)가 같은 화면인지 | 통화 `components/roleplay/CallParts.tsx` / 1:1 메시지 `components/rooms/RoomCall.tsx` / Room `components/rooms/VideoStage.tsx`·`components/rooms/RoomView.tsx` / 공용 `components/speech/CallKit.tsx` |  |
| 사전 열기 `dict-open` | 낱말·표현을 누르면 사전 시트·소재 수업 — 사전 주석·My에서 찾기·Languagebank가 같은 시트·같은 순서인지 | 사전 주석 `components/studyMap/DictNotes.tsx`·`lib/curriculum/dictNotes.ts` / My에서 찾기 `components/FindInMy.tsx` / Languagebank `components/studyMap/LanguageBank.tsx` / 공용 `components/studyMap/Dictionary.tsx` |  |

## 부품 (50) — 기능 줄에 딸린 화면 코드

> 화면 코드는 모두 기능 줄 code나 여기에 있다(`--check`). 기능을 지우면 그 부품도 같이 지운다.

- 광고 — `WebAdSlot.tsx`
- AI 채팅 — `ChatHistoryPanel.tsx` · `ExpressionPeek.tsx` · `ReportContentDialog.tsx` · `SelectableEnglishText.tsx`
- 문장분석 — `AnalyzableEnglish.tsx` · `EnglishAnalysisProvider.tsx` · `SentenceAskPanel.tsx` · `VocabPreviewProvider.tsx` · `VocabSenseList.tsx` · `VocabWordPreview.tsx`
- 결제 화면 — `PointsIcon.tsx`
- 통화 끝 화면 — `RoleplayReview.tsx`
- 통화 — `roleplay/TurnDiagBox.tsx`
- 통화 기록 — `RoleplayPast.tsx`
- 1:1 메시지 — `rooms/MediaImage.tsx` · `rooms/MessagesTab.tsx` · `rooms/RoomCall.tsx`
- 사용법 — `FeatureMap.tsx`
- 친구 초대 — `invite/InviteWelcome.tsx`
- 소재 수업 — `studyMap/FixedExplain.tsx`
- Logbank — `studyMap/Growth.tsx`
- 사람 — `SuspendedNotice.tsx` · `rooms/MateAsk.tsx`
- Quizbank — `studyMap/QuizPlayer.tsx`
- Room — `rooms/RoomParts.tsx` · `rooms/VideoStage.tsx`
- 영상 학습 — `contentDiscovery/ContentDiscoveryPanel.tsx` · `videoLearning/CatalogLibrary.tsx` · `videoLearning/CurrentSubtitleCard.tsx` · `videoLearning/SavedVideoSessions.tsx` · `videoLearning/SegmentPlayButton.tsx` · `videoLearning/StudyMaterialsList.tsx` · `videoLearning/SubtitleDebugPanel.tsx` · `videoLearning/SubtitleGenerationStatus.tsx` · `videoLearning/VideoPlayer.tsx` · `videoLearning/VideoUrlInput.tsx` · `videoLearning/VideoWatchFullscreenDock.tsx`
- 공용: 🔊 듣기 — `TTSButton.tsx`
- 공용: My 칸 색 — `studyMap/bankTone.tsx`
- 공용: My 탭 틀 — `studyMap/StudyMapTab.tsx`
- 공용: 대화 줄 할 일 한 줄 — `conversation/LineTools.tsx`
- 공용: 앱 틀 — `Providers.tsx`
- 공용: 앱 틀(상단바·하단 탭) — `AppHome.tsx`
- 공용: 탭 아이콘 — `TabIcons.tsx`
- 공용: 통화 화면 조각(AI·사람) — `speech/CallKit.tsx`
- 공용: 프로필 시트 틀(사람·튜터) — `ProfileFrame.tsx`
- 공용: 한 줄 말하기 조각(수업·퀴즈) — `studyMap/LineParts.tsx`
- 공용: 한 줄 말해 보기 — `speech/Attempt.tsx`
- 공용: 화면 덮는 층 — `FullScreenLayer.tsx`

## 이름 정리할 것 — 같은 말을 쓰는 다른 문구 키 (26)

> `node scripts/check-copy-keys.mjs`가 찾는다. 같은 기능이면 한 키로 합치고, 다른 기능이면 이름을 바꾼다. 고치면 `--write`로 기준을 줄인다. 새로 생기면 CI가 실패한다.

- "{n}단계" — `dictionaryStage`, `stageNumber`
- "건너뛰기" — `featurePickSkip`, `quizSkip`
- "단계" — `myViewMap`, `vocabByStage`
- "단어" — `partVocab`, `vocabFilterWords`
- "단어장" — `homeTabVocab`, `vocabTitle`
- "대화" — `homeTabTalk`, `homeworkTalk`
- "랜덤" — `homeTabRandom`, `studyRandom`
- "로그인" — `accountCodeConfirm`, `accountLoginTitle`, `accountSignIn`
- "말하기" — `quizKindSay`, `selfFocusSpeaking`
- "문법" — `notebookGrammar`, `partGrammar`
- "문장" — `inspectTabSentence`, `videoLearnSessionLines`
- "문장구조" — `amountFrames`, `framesTitle`
- "번역" — `chatReading`, `roleplayTranslations`, `translate`, `translation`
- "사람" — `homeTabPeople`, `topicPeople`
- "설명" — `explanation`, `featureViewList`
- "쓰기" — `replayType`, `tlWrite`
- "여행" — `discoverTopicTravel`, `selfUseTravel`
- "예문" — `dictionaryExample`, `example`
- "의견 보내기" — `feedbackOpen`, `feedbackTitle`
- "이 문장에서는" — `exploreMeaningHere`, `insightInSentence`
- "이어서 하기" — `mapContinue`, `roleplayResume`, `scriptResume`
- "읽기" — `discoverOpenRead`, `discoverTypeReading`
- "자막" — `discoverCaptionsLabel`, `roleplayCaptions`
- "찾는 중…" — `discoverSearching`, `findInMyBusy`
- "표현" — `partExpression`, `reportStatExpressions`, `vocabFilterPhrases`
- "확인" — `quizCheck`, `whatsNewDone`
