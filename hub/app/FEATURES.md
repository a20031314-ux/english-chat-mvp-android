# 기능 장부

> **자동 생성 — 손으로 고치지 않는다.** 원본 `scripts/features.json` → `node scripts/features.mjs`. CI `languages`가 `--check`로 맞는지 본다.
> 기능 하나 = 이름 하나 = 줄 하나. **새 버튼·방식·탭을 만들기 전에 여기서 같은 일을 하는 줄을 찾는다** — 있으면 그 이름·문구 키를 그대로 쓰고, 없을 때만 줄을 더한다(RULES "하나의 이름·지금만 적기").
> **쓰는 탭**은 코드에서 자동(`node scripts/scope.mjs <기능 id>`로 파일까지) — 둘 이상인 기능을 고치면 끝내기 훅이 그 탭들에 확인 요청을 만들게 한다(`hub/chat/ASKS.md`).
> 기능을 빼면 줄을 지우고 코드·문구 14개 언어·사용법·문서를 같은 커밋에서 지운다. 옛 앱이 쓰는 서버만 "옛 앱 전용"으로 남기고 지울 조건을 적는다.

## 지금 앱 (42)

### 앱 틀 — 상단바·하단 탭·업데이트·새로워진 점·사용법

| 기능 | 하는 일 | 쓰는 탭 | 코드 | 대신한 옛 기능 |
|---|---|---|---|---|
| 배울 언어 국기 줄 | 상단바에 내 배울 언어 국기 모두 — 누르면 그 언어로, 지금 국기 → 언어 설정 시트(배울 언어·앱 언어) | 1 메인 | `components/LearningLanguageFlag.tsx` · `lib/myLanguages.ts` |  |
| 처음 언어·튜터 고르기 | 처음 설치 때 국기 여러 개 → 언어마다 튜터 얼굴 하나 | 1 메인 · 2 My · 3 AI · 4 사람 | `components/LanguagePick.tsx` · `lib/firstLanguage.ts` |  |
| 사용법 `guideOpen` | 상단 ? — 지금 탭의 장(그림·영상 한 줄), 맨 앞 탭은 쓸 기능 고르기 | 1 메인 · 2 My | `components/GuideSheet.tsx` · `lib/guide/content.ts` |  |
| 새로워진 점 `whatsNewTitle` | 업데이트 뒤 한 번, 앱 언어별 캡처 | 1 메인 · 3 AI | `components/WhatsNewSheet.tsx` · `lib/whatsNew.ts` |  |

### 의견 보내기·반영 소식

| 기능 | 하는 일 | 쓰는 탭 | 코드 | 대신한 옛 기능 |
|---|---|---|---|---|
| 의견 보내기 `feedbackOpen` | 상단 💬 — 글·사진, 반영되면 소식 시트와 포인트 | 1 메인 | `components/FeedbackButton.tsx` · `components/FeedbackFixedSheet.tsx` |  |

### 대화 탭 — AI 튜터 줄·1:1 메시지·단체방·팀

| 기능 | 하는 일 | 쓰는 탭 | 코드 | 대신한 옛 기능 |
|---|---|---|---|---|
| AI 튜터 줄 | 대화 탭 맨 위 — 고른·팔로우한 튜터마다 한 줄, 마지막 말, 통화 문 넷, 숙제 줄·점 | 1 메인 · 2 My · 3 AI · 4 사람 | `components/AiTutorRow.tsx` · `lib/tutorFollows.ts` |  |
| 1:1 메시지 `homeTabMessages` (화면: 메시지) | 요청 → 열림, 📞 둘만의 비공개 방 | 1 메인 · 4 사람 | `components/rooms/RoomDm.tsx` |  |
| 단체방 | 단체 대화 · 팀 워크스페이스 · 📞 단체방 통화 | 1 메인 · 4 사람 | `components/rooms/RoomGroups.tsx` · `components/rooms/TeamSpace.tsx` |  |

### 사람 탭 — 프로필 목록·게시판·사진

| 기능 | 하는 일 | 쓰는 탭 | 코드 | 대신한 옛 기능 |
|---|---|---|---|---|
| 튜터 프로필 | 사람 프로필과 같은 틀 — 소개 · 통화 문 넷 · 숙제 · 마지막 메모 · 팔로우·메시지·통화 기록 | 1 메인 · 2 My · 3 AI · 4 사람 | `components/AiTutorProfile.tsx` · `lib/roleplay/tutorDesk.ts` |  |
| 사람 `homeTabPeople` | 맨 위 AI 튜터 둘 + 사람 카드·프로필(팔로우·메시지·메이트·차단·신고) | 1 메인 · 2 My · 4 사람 | `components/rooms/PeopleTab.tsx` · `components/rooms/RoomPeople.tsx` |  |
| 게시판 | 학습 언어별, 주제 칩 자유·질문·메이트·단체방 | 4 사람 | `components/rooms/BoardView.tsx` |  |

### AI 채팅 (대화 → AI 튜터 줄)

| 기능 | 하는 일 | 쓰는 탭 | 코드 | 대신한 옛 기능 |
|---|---|---|---|---|
| AI 채팅 `homeTabChat` (화면: 채팅) | 튜터별 대화방, 입력창 하나(학습 언어면 대화, 편한 말이면 학습 언어로 이어감 + 표현 보기), 교정 칩 | 1 메인 · 2 My · 3 AI | `components/ChatWindow.tsx` · `components/MessageBubble.tsx` |  |

### AI 통화 (어디서나 뜨는 층 CallHost — 대화·사람 탭 📞)

| 기능 | 하는 일 | 쓰는 탭 | 코드 | 대신한 옛 기능 |
|---|---|---|---|---|
| 자유대화 `callModeTalk` | 📞 — 고르기 없이 인사, 고친 말은 내 얼굴 아래 카드로(말로 안 짚음) | 3 AI · 4 사람 | `components/CallHost.tsx` · `components/RoleplayScreen.tsx` |  |
| 수업 `callModeStudy` | 🎓 — 튜터가 큰 실수를 짚고 다시 말해 보기, 끝나면 숙제 | 1 메인 · 2 My · 3 AI · 4 사람 | `lib/roleplay/director.ts` |  |
| 게임 `callModeGame` | 🎲 — 스무고개(앱이 답을 들고 감독) — 게임 안 이름은 gameTwenty(스무고개) | 1 메인 · 2 My · 3 AI · 4 사람 | `lib/roleplay/callGames.ts` |  |
| 가르치기 `gameTeach` | 🧑‍🏫 — 튜터가 내 모국어를 막 배우는 학습자를 연기, 나는 학습 언어로 설명 | 1 메인 · 2 My · 3 AI · 4 사람 | `lib/roleplay/callGames.ts` |  |
| 통화 끝 화면 | 요약 한 줄 · 튜터 메모 · 이렇게도 말할 수 있었어요 · 전체 대본 · 통화 정리 · 이번 통화의 고쳐 씀 | 1 메인 · 2 My · 3 AI | `components/roleplay/CallParts.tsx` · `components/roleplay/CallRecap.tsx` |  |
| 이렇게도 말할 수 있었어요 `replayTitle` | 끝난 대본으로 장면 둘 — 바뀐 조각만 빈칸 → 말하기 → 한 줄 전체 | 3 AI | `components/roleplay/CallReplay.tsx` |  |
| 숙제 `homeworkTag` | 수업 통화 끝 — [퀴즈 \| 대화], 숙제 줄은 튜터 줄·Logbank 오늘 카드 | 2 My · 3 AI · 4 사람 | `lib/roleplay/homeworkQuiz.ts` |  |
| 통화 기록 `callRecordsTitle` | 튜터 프로필 — 칩 [자유대화 \| 수업 \| 게임 \| 가르치기], 이어서 하기·돌아보기(이 폰) | 1 메인 · 2 My · 3 AI · 4 사람 | `components/CallList.tsx` · `lib/roleplay/callStore.ts` |  |

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
| 첫 측정 | 학습 언어로 처음 My를 열면 — 글자 → 낱말 예/아니오 → 뜻 → 표현·문법 → 시작 단계(건너뛰기 = 1단계) | 2 My · 3 AI | `components/studyMap/FirstCheck.tsx` · `lib/curriculum/firstCheck.ts` | 단계 고르기(대화 예시) · 단계 오르내리기 시험(PlacementPlayer) · 초급·중급·고급 체크 |
| 실력 확인 `skillCheckTitle` | Logbank 📏 칸 — 14일마다 ▶ 밝음 → 첫 측정과 같은 시험(글자 없음, 오르기 지난번 −1단계부터) → 지난번 → 이번, 표는 확인마다 단어·표현·문법 + 말하기(그 전 2주 대화에서 맞게 쓴 수, 장부) | 2 My | `lib/curriculum/skillCheck.ts` · `components/studyMap/FirstCheck.tsx` |  |
| Logbank `logbankTitle` | My 첫 칸 — 오늘 · 실력 확인 · 배운 것 표 · 학습 곡선 · 그날 세부 = 학습 타임라인(%·띠·육각형 없음) | 1 메인 · 2 My · 3 AI · 4 사람 | `components/studyMap/Logbank.tsx` · `lib/curriculum/logLedger.ts` | 복습 칸 · 📈 실력 기록 · 이번 주 확인 · 띠·육각형 %·부족한 점 |
| 오늘 `lbToday` | Logbank 맨 위 — 오늘 학습 n · 숙제 줄 · ▶ Quizbank 하나(갈래 이름 없음, 오늘 10개 답하면 ✓) · 📞 수업, 0단계면 오늘의 글자 묶음 | 1 메인 · 2 My · 3 AI | `components/studyMap/TodayCards.tsx` · `lib/curriculum/todayCards.ts` | 오늘 할 것(Stagebank) · 다음 추천 · 오늘 카드 셋(막힌 것·다시 학습·새로 학습·써 보기) |
| 학습 타임라인 | Logbank 그날 세부 — 학습 시간(10분 쉼으로 끊음) → 요소별 카드 → 카드 지난 기록 | 1 메인 · 2 My · 3 AI | `lib/curriculum/studyTimeline.ts` |  |
| 학습 수 `lbFresh` (화면: 학습) | 그 기간에 퀴즈로 답한 서로 다른 것의 수 — Logbank 오늘·배운 것 표 열·학습 곡선·날 줄·그날 칸. 낱말마다 붙는 표시 없음(사전에 마지막 틀림 ✗만) | 1 메인 · 2 My · 3 AI | `lib/curriculum/growthView.ts` · `lib/curriculum/studyTimeline.ts` | 체크 셋 이름(New·적용이 힘듦·알아요) 표시 · 점 셋 · 낱말 표시 학습 · n번 학습 · 새로 학습 · 다시 학습 · 학습 n번(공부 묶음 수) |
| Quizbank `keepTitle` | 한 흐름 퀴즈 — 다시 볼 것(막힌 것 먼저)과 새 묶음 번갈아, 낱말·표현은 카드 한 칸 가림, 답 뒤 📕 | 1 메인 · 2 My · 3 AI | `components/studyMap/Quizbank.tsx` · `components/studyMap/InlineQuiz.tsx` · `lib/curriculum/quiz.ts` | Quizbank 탭 [어휘 \| 다시 보기 \| 시험] · 📝 단어 시험 · 정기 시험 · 😴 쉬워요 줄 · ⚙ 어떤 낱말 |
| Languagebank `languagebankTitle` | 사전 — 찾기 + 자주 쓴 말(대화 수) + 종류(품사\|주제 × 난이도) → 묶음([퀴즈 \| 대화] 순서) → 낱말 화면(마지막 틀림 ✗ · 대화에서 n번 씀, 같이 배우기), 표현·문법은 소재 수업, 칠하기 = 실력 확인 추정, 숫자 = 개수 | 1 메인 · 2 My · 3 AI | `components/studyMap/LanguageBank.tsx` · `components/studyMap/Dictionary.tsx` · `lib/curriculum/wordUse.ts` · `lib/curriculum/skillCheck.ts` | Stagebank · 📕 단어 사전 버튼 · 📖 배울 수 있는 것 |
| 넘겨 보기 `flipStart` | Languagebank 묶음 ▶ — 뜻·단어·예문 중 하나 가림 → [다시 \| 됐어요] | 2 My | `components/studyMap/BankFlip.tsx` · `lib/curriculum/bankFlip.ts` |  |
| 글자·소리 `fcLetters` (화면: 글자) | 글자가 다른 학습 언어 — Languagebank 첫 줄 칸, 0단계면 Logbank 오늘 = 오늘의 글자 묶음 | 2 My · 3 AI | `components/studyMap/ScriptPractice.tsx` · `lib/curriculum/lettersOpen.ts` |  |
| 소재 수업 | 어디서나 여는 층(openLesson) — 문장구조 수업 [설명 › 퀴즈 › 대화] · 문법 한 장 · 표현 카드 | 2 My | `components/studyMap/LessonHost.tsx` · `components/studyMap/FrameLesson.tsx` · `components/studyMap/ExpressionCard.tsx` · `components/studyMap/GrammarExplain.tsx` |  |
| 같이 배우기 `lbStudyWith` | 칩 최대 셋 → 소재 수업 — Languagebank 단어 화면(그 단어와 같이) · 채팅 표현 보기 아래 · 통화 정리 줄(하고 싶었던 말에 든 문장구조·표현·문법), 덜 다진 것 먼저, 모델 없음 | 1 메인 · 2 My · 3 AI | `components/studyMap/StudyChips.tsx` · `lib/curriculum/wordUse.ts` |  |
| 사전 주석 | 학습 언어 문장 아래 📕 + 그 문장의 단어·표현 칩 → 사전 시트·소재 수업(대화 줄·자막·퀴즈 답 뒤) | 1 메인 · 2 My · 3 AI | `components/studyMap/DictNotes.tsx` · `lib/curriculum/dictNotes.ts` |  |
| 칸 설명 | Logbank·Quizbank 머리 ? — 핵심 하나 + 세부 한 줄씩 | 1 메인 · 2 My | `components/studyMap/BankHelp.tsx` · `lib/guide/banks.ts` |  |

### 문장분석·표현 시트 (여러 화면에서 열림)

| 기능 | 하는 일 | 쓰는 탭 | 코드 | 대신한 옛 기능 |
|---|---|---|---|---|
| 문장분석 | 채팅·통화 돌아보기·영상의 문장 → 분석 시트 | 1 메인 | `components/EnglishAnalysisViewer.tsx` |  |
| My에서 찾기 `findInMy` | 🔎 — 그 말의 문법·표현 수업을 열고, 없으면 사전 시트 | 1 메인 · 3 AI | `components/FindInMy.tsx` | 노트 칸 열고 이 장면 넣기 |

### 요금·포인트·광고

| 기능 | 하는 일 | 쓰는 탭 | 코드 | 대신한 옛 기능 |
|---|---|---|---|---|
| 결제 화면 `billingScreenTitle` (화면: 플랜 및 결제) | 플랜(라이트·플러스·프리미엄)·포인트 상점 | 1 메인 · 3 AI · 4 사람 | `components/BillingScreen.tsx` · `components/PointStore.tsx` |  |
| 광고 | 무료·안드로이드만 — 자리 전체는 hub/app/ADS.md | 1 메인 · 2 My · 3 AI · 4 사람 | `components/NativeAdSlot.tsx` · `lib/ads.ts` |  |

## 옛 앱 전용 서버 (3) — 새 앱 화면엔 없음

| 무엇 | 쓰는 앱 | 코드 | 지울 때 |
|---|---|---|---|
| Stagebank 서버(대본·단계 시험·꺼내 쓰기·돌아보기) | 옛 앱 2.79 이하 My Stagebank가 부름 — 새 앱은 Quizbank 익힘 기록(scripts check)만 씀 | `app/api/curriculum/recall/route.ts` · `app/api/curriculum/ask/route.ts` · `app/api/curriculum/fixed-lesson/route.ts` | 최소 지원 버전 2.80 이상 |
| 오늘의 팩 서버 | 옛 앱 2.48~2.75 오늘의 팩 | `app/api/pack/today/route.ts` · `app/api/pack/finish/route.ts` | 최소 지원 버전 2.76 이상 |
| 목표 지도 서버 | 옛 앱 2.48~2.74 목표 지도·미션·노트 목차 | `app/api/curriculum/progress/route.ts` · `app/api/curriculum/missions/route.ts` · `app/api/notes/place/route.ts` | 최소 지원 버전 2.75 이상 |

## 지울 것 (2) — 화면은 없어졌는데 코드가 남음

| 무엇 | 왜 남았나 | 남은 코드 |
|---|---|---|
| 오늘 할 것 계산 | Stagebank 오늘 할 것 목록 — 화면은 없어졌고 서버 다시 볼 것(review)·익힘 셈이 아직 이 파일을 씀 — 서버(scripts check)가 쓰는 reviewKeysOf 등만 남기고 나머지를 지운다 | `lib/curriculum/dailyPlan.ts` |
| 아침 알림 | Stagebank ⚙에서 켜던 것 — 개편에 켜고 끌 곳이 없어 My를 열면 걸린 알림을 지움 — 되살리려면 사용자 결정 — 아니면 플러그인·코드 지움 | `lib/morningNotify.ts` · `lib/curriculum/morningDigest.ts` |

## 이름 정리할 것 — 같은 말을 쓰는 다른 문구 키 (55)

> `node scripts/check-copy-keys.mjs`가 찾는다. 같은 기능이면 한 키로 합치고, 다른 기능이면 이름을 바꾼다. 고치면 `--write`로 기준을 줄인다. 새로 생기면 CI가 실패한다.

- "{n}단계" — `dictionaryStage`, `stageNumber`
- "건너뛰기" — `featurePickSkip`, `quizSkip`
- "검색 결과가 없어요." — `learningSearchNoResults`, `vocabNoResults`
- "고급" — `discoverLevelAdvanced`, `mapLevelAdvanced`
- "교정" — `correctionTitle`, `reportAnalysisCorrected`, `reportStatCorrections`
- "기능어" — `missParticle`, `posFunction`
- "내 {targetLanguage} 교재" — `learningBookNav`, `learningBookTitle`
- "내 표현" — `ledgerTitle`, `reportMyExpression`
- "뉘앙스" — `reportAnalysisCategoryNuance`, `videoLearnNuance`
- "단계" — `myViewMap`, `vocabByStage`
- "단어" — `partVocab`, `quizTypeVocabulary`, `reviewFilterVocab`, `vocabFilterWords`
- "단어 선택" — `reportAnalysisCategoryWordChoice`, `vocabPickTitle`
- "단어장" — `homeTabVocab`, `vocabTitle`
- "대화" — `homeTabTalk`, `homeworkTalk`
- "대화 돌아보기" — `reportReviewTitle`, `reportTimelineTitle`
- "더 자연스럽게" — `chatNaturalChip`, `reportBetterExpression`
- "듣기" — `listen`, `skillListen`
- "또 다른 표현" — `cardMoreNatural`, `natural`
- "랜덤" — `homeTabRandom`, `studyRandom`
- "로그인" — `accountCodeConfirm`, `accountLoginTitle`, `accountSignIn`
- "리포트" — `archive`, `homeTabReports`, `reportMenuTitle`
- "리포트 보기" — `openSession`, `reportViewCta`
- "리포트 생성" — `createReport`, `reportCreateConfirmCta`
- "말하기" — `quizKindSay`, `selfFocusSpeaking`
- "문법" — `notebookGrammar`, `partGrammar`, `quizTypeGrammar`, `reviewFilterGrammar`
- "문장" — `inspectTabSentence`, `videoLearnSessionLines`
- "문장구조" — `amountFrames`, `framesTitle`
- "발음" — `myElPronunciation`, `partPronunciation`
- "번역" — `chatReading`, `roleplayTranslations`, `translate`, `translation`
- "사람" — `homeTabPeople`, `topicPeople`
- "새 대화 시작" — `chatHistoryNew`, `startNewSession`
- "설명" — `explanation`, `featureViewList`
- "쓰기" — `replayType`, `tlWrite`
- "알아요" — `checkKnown`, `itemsMastered`, `knownTag`, `markKnown`
- "어순" — `lessonOrder`, `missOrder`
- "여행" — `discoverTopicTravel`, `selfUseTravel`
- "연습 중" — `dashboardPracticing`, `filterPracticing`, `practiceNow`
- "예문" — `dictionaryExample`, `example`, `reportAnalysisExample`, `reviewExamples`
- "오늘 저장" — `dashboardSavedToday`, `progressSavedToday`
- "의견 보내기" — `feedbackOpen`, `feedbackTitle`
- "이 문장에서는" — `exploreMeaningHere`, `insightInSentence`
- "이렇게 바꿔보세요" — `correctionTryThis`, `reviewBetterSentence`
- "이어서 읽기" — `studyContinue`, `webReadResume`
- "이어서 하기" — `mapContinue`, `roleplayResume`, `scriptResume`
- "익숙한 표현" — `dashboardUsable`, `filterUsable`
- "익숙함" — `reviewFamiliar`, `vocabStatusFamiliar`
- "읽기" — `discoverOpenRead`, `discoverTypeReading`
- "자막" — `discoverCaptionsLabel`, `roleplayCaptions`
- "자연스러움" — `myElNatural`, `reportScoreFactorNaturalness`
- "정확도" — `myElAccuracy`, `reportScoreFactorAccuracy`
- "찾는 중…" — `discoverSearching`, `findInMyBusy`
- "표현" — `homeTabSaved`, `partExpression`, `quizTypeExpression`, `reportStatExpressions`, `vocabFilterPhrases`
- "표현 알아보기" — `askExpression`, `reportExpressionsTitle`
- "확인" — `missionCheck`, `quizCheck`, `whatsNewDone`
- "힌트" — `missionHint`, `whyHint`
