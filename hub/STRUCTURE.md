# 앱 전체구조

> 모든 채팅이 시작할 때 자동으로 읽는다(CLAUDE.md). **고치기 전에** 여기서 바꿀 곳이 어느 영역이고 누가 같이 쓰는지 보고,
> **고친 커밋에서** 이 문서도 고친다. 무엇을 왜 지키는지는 `PRODUCT.md`(기능별 자세한 규칙), 서버가 저장하는 것은 `hub/data-map.md`.
>
> - 위쪽(손으로 씀): 화면 흐름·들어가는 길·영역 사이 규칙. 화면·흐름·탭·영역이 바뀌면 고친다.
> - 아래쪽(자동): 탭·영역별 코드·API·화면끼리 신호·안 쓰는 코드. `node scripts/structure.mjs`가 코드에서 만든다(main push 때 CI도 다시 만듦).
>   새 화면 파일·API·페이지는 `scripts/structure.json` 자리표에 영역을 정해 넣는다 — 빠지면 CI `structure`와 끝내기 훅이 막는다.
> - 구조가 안 바뀐 커밋(버그 수정·문구 등)은 그 채팅의 `hub/log` 항목에 `- 구조: 변화 없음` 한 줄.

## 화면 흐름 (손으로 씀)

> **다음 구조(2026-11-03, 화면은 아직):** Languagebank 탭이 이 자리의 정체(사전)가 된다. 아래 그림은 지금 코드다. 기준 `hub/drafts/languagebank-2026-11-03.md`. 만들기 전에는 이 그림을 다음 구조로 고치지 않는다.
> **개편 1단계(2026-11-06, 스위치 `lib/reform.ts` — 시험 앱 껍데기에서만 켜짐, 브라우저는 localStorage `lbReform`=1):** My 칸 [Logbank · Quizbank · Languagebank], Stagebank 대신 Languagebank(`studyMap/LanguageBank` — 찾기 = 단어 사전 몸통 `Dictionary` DictionaryBody, 전체보기 띠 → 종류(줄 주제|품사 × 난이도) → 묶음 칩 → 낱말 화면 / 표현·문법은 openLesson), 첫 칸 Quizbank, 📕는 Quizbank에서 빠짐, AutoFull·AutoQuiz 끔. **2단계(2026-11-07):** Quizbank 탭 줄 없음 — 한 흐름(TodayPlan keepMake: 다시 볼 것 묶음과 새 묶음(낱말·표현·영어 문법) 번갈아, 시험이 모이면 📝 줄), 답한 뒤 문제마다 📕 Languagebank 문(QuestionView dictDoor — 낱말은 사전 시트 DictionarySheet 그 낱말 화면, 표현·문법·문장구조는 openLesson, 틀리면 진하게). 스위치가 꺼진 앱(Play·웹)은 아래 그림 그대로.

```
앱 열기 ─ AI 동의(iOS만) ─ 배울 언어 고르기(처음 설치만 — 국기 14개, 여러 개 눌러 ✓ → 아래 [국기들 시작하기] → 처음 누른 언어로 My(2026-11-02 여러 개), 앱 언어는 기기 언어, LanguagePick FirstLanguagePick·lib/firstLanguage.ts, 2026-10-31) ─ (쓸 기능 고르기는 처음 설치에도 안 띄움 — 전부 켬, 고르기는 ? 사용법 창 맨 앞 탭, 2026-10-29) ─ 새로워진 점(업데이트 뒤 한 번) ─ 초대 환영(초대 링크로 왔을 때)
│
상단바   배우는 언어 국기 → 언어 설정 시트(배울 언어 — 맨 위 내 언어 줄 누르면 그 언어로 바로 · 아래 국기 ✓ 더하기·빼기, lib/myLanguages.ts appLearningLanguages 이 폰, 2026-11-02 · 앱 언어, LanguageSettingsButton, 2026-10-31 — 언어는 여기서만 바꾼다) · 포인트/플랜 → 결제 화면 · ? 사용법(지금 탭의 장 — My면 학습 흐름: [쓸 기능 고르기 | 학습 흐름 | 장마다 해야 할 것·할 수 있는 것 카드 + 접힌 세부 기능], lib/guide/overview.ts, 2026-10-29) · 💬 의견 보내기
│        └ 업데이트 배너
하단 탭  My │ 대화 │ 사람 │ Room │ 영상 학습        (왼쪽부터, 2026-11-02 사용자 "my > 채팅 기록 > 프로필 > 보이스룸 > 영상 학습" — features.ts bottomTabs; 첫 화면: My, 2026-10-28; 각 화면 머리 제목도 이름 대신 그 탭 아이콘 — TabIcons TabTitle, 이름은 aria-label·title, 2026-11-02 사용자 "상위 탭들의 텍스트를 아이콘으로")
│
├ 대화 talk ─ AI 튜터와의 대화 줄(맨 위 고정 — 지금 고른 튜터 + 팔로우한 튜터 + 대화가 남은 튜터마다 한 줄, 줄 아래 그 튜터와의 마지막 말, 누르면 그 튜터와의 대화 = 튜터별 대화방(chatArchive tutorGender·activeTutorRooms.v1, 튜터를 바꾸면 ChatWindow가 그 튜터의 대화로 갈아탐), AiTutorRows·lib/tutorFollows.ts tutorFollows.v1 이 폰, 2026-11-02 사용자 "튜터프로필도 사람처럼 팔로우, 채팅걸기"; 언어별 튜터 그림·이름·국기(아랍어는 국기 없음 — 출신 나라 없음, chatPartner countryEn "", 2026-11-01) — 사람 대화처럼, 그림은 public/tutors·AiAvatar, 2026-11-01, 오늘의 팩 카드는 2.76에서 뺌) ─ 줄 → AI 대화 chat(머리 ‹ 대화 · 튜터 · 📞 · ⋮, 하단은 "대화"가 켜진 채, 말풍선 옆 얼굴 — 튜터 왼쪽·내 프로필 사진 오른쪽 MessageBubble face, 2026-11-01; ⋮ 튜터 목소리 [그림 이름 | 그림 이름] — 이름·채팅 말투·통화 목소리·듣기가 같이 따라감, lib/tutorGender.ts·chatPartner.ts, 2026-11-01; ⋮ 말 빠르기 × [0.8~1.2] — 통화·채팅·듣기 모두, lib/tutorSpeed.ts → /api/tts speed, 2026-11-02)
│           │                      ├ 📞 → AI 통화 call(탭 아님 — 어디서나 떠 있는 층 CallHost)
│           │                      │   통화 중 = 실제 통화 화면(roleplay/CallParts CallStage: 위 칸 AI 튜터 얼굴·자막 한 줄은 💬 켰을 때만(원문 — 줄을 누르면 해석 켬/끔, 다음 줄·다음 통화도 그대로 callMeaning.v1, 2026-11-06; 0단계 학습자는 자막·해석 켠 채 시작, 끝 화면 숙제 📝 글자·소리 → LettersHomework handOffLetters → My 0단계) · 아래 칸 내 프로필 사진(account/AccountCard MyAvatarFace)·말할 때 막대, 맨 위 통화 시간 · CallControls: 🙉 못 알아들었어요 → 튜터가 쉽게 다시(session.missedLine, 두 번째면 그 줄 자막) · 💬 자막 · 통화를 열면 먼저 자유대화/공부(지난 선택 표시, 고르기 전엔 인사 없음 — 자유대화는 교정 없는 대화 지시, 공부는 🎓 켬. 부족한 칸이 있으면 육각형을 띄우고 그 칸으로 첫 마디, 고친 문장은 tutorFixes.v1, 2026-11-04). 🎓 튜터 수업(그냥 대화만, 켬/끔 이 기기 callCoach.v1 → /api/roleplay/turn coach — 큰 실수는 틀린 곳을 앱 언어로 한 마디 짚고, 고친 문장을 그 튜터 말투로 말한 뒤 다시 말해 보기, 고친 말·건넨 표현은 내 얼굴 아래 카드 CoachCardView(✎ 틀린 곳 → 🔁 고친 문장 → 까닭 / 💬 내 말 → 학습 언어 / 💡 표현, 맞히면 ✓ — transcriptMarks nextCoachCard), director.ts coachRules·retry·offer, 2026-11-02) · 💡 힌트 · 끝내기 — 그냥 대화는 튜터가 끊지 않고 작별로 읽은 차례엔 끝내기 강조 CallControls leaving, 2026-11-06) → 끝나면 통화 요약 한 줄(CallSummary: 튜터 얼굴·⏱·✎·💡·🙉·🔁 다시 말해 맞힘, 통화 기록 돌아보기도) + 튜터 메모 세 문장(TutorNote — /api/roleplay/context final의 summary, 통화 카드 lib/roleplay/callNotes.ts callNotes.v1 → Logbank 그날 카드에도, 원문이 20통 밖이어도 카드는 남음, 2026-11-06) + 전체 대본(튜터 줄 해석 늘 붙음 — 머리 번역 켬/끔 뺌, 돌아보기도 없는 해석은 열 때 받음 RoleplayPast, 2026-11-03; 줄 옆 얼굴 — 맞게 말한 내 줄에 💡 더 자연스럽게, director smoother, 고친 수·복습에 안 셈, 2026-11-02) + 통화 정리(2026-11-01) — 대본·정리는 화면 높이로 끊어 옆으로 넘김(CallPages ‹ n / m ›, 돌아보기도 — 장 안 줄은 눌러서 펼치지 않고 고친 말·할 일 줄이 펼친 채, RoleplayLine flat, 2026-11-01)
│           │                      └ AI 튜터 프로필 "통화 기록" → CallList(채팅과 따로, 2026-10-27: 이어서 하기·돌아보기·×, 이 폰에만. 채팅 ⋮에서는 뺌 2026-11-03 — 사람 탭이 없는 화면만 ⋮에 남김). 끝난 통화에서 들은 삶(일·계획·한 일)은 날짜와 함께 tutorLife.v1(roleplay/lifeFacts.ts, 고친 문장은 제외, 다음 통화 지시에 최근 것만, 2026-11-04)
│           │                      └ 통화가 끝난 화면·돌아보기 맨 아래 통화 정리(roleplay/CallRecap, lib/roleplay/recap.ts, 2026-10-30): 고친 말·💡 힌트·뜻을 본 말 → 🧩 문장구조·🔤 표현 → 그 문장을 들고 Stagebank 수업(🔤 표현은 2026-11-03부터 표현 카드 studyMap/ExpressionCard — 뜻·예문, 문장구조와 같은 표현이면 그 문장구조 수업; openLesson scene → studyMap/LessonHost, 통화 화면 위, 맨 위 📞 카드, 2026-11-01 — 예전 My n단계로 가던 것), 틀이 없으면 🔎 My에서 찾기(문법 칸·표현이면 그 수업으로). 그 문장은 정기 시험의 첫 재료(이 폰). 찾은 틀은 다시 볼 것에(/api/curriculum/scripts from "call", 숙지 그대로)
│           ├ 단체방(팀이면 "대화 | 워크스페이스", 📞 단체방 통화 → 비공개 Room)
│           └ 1:1 메시지(요청 → 열림, 📞 → 둘만의 비공개 Room)
│              1:1·단체방 말풍선 옆 얼굴(상대 왼쪽·내 프로필 사진 오른쪽, AI 대화와 같은 자리·크기 speech/CallKit ChatFaceSlot) · 📞 비공개 방 = AI 통화와 같은 통화 화면(rooms/RoomCall RoomCallStage: 위 상대 — 1명 크게·여럿 격자·🙉 누른 사람 얼굴에 🙉 · 자막 한 줄은 💬 켰을 때만, AI 통화와 같은 켬/끔 · 아래 나 · 버튼 🙉 못 알아들었어요(🙉 한 글자 댓글) · 💬 자막 · 🎙 마이크 · 📷(영상 방) · 📞 나가기, 영상 방이면 위·아래 대신 VideoStage), 공개 Room·랜덤은 예전 방 화면(2026-11-01)
├ 영상 학습 video ─ 이달의 영상 · 링크 넣기 · 학습 언어 자막 · 문장 바 → 문장분석 시트
├ 사람 people ─ 맨 위 AI 튜터 둘(그 학습 언어의 여자·남자 튜터, 고른 튜터 먼저 — AiTutorPeople, 2026-11-02 사용자 "한쪽 성별만 떠"; 그 줄 📞은 튜터 목소리를 그 사람으로 정하고 통화)(사람 카드처럼, 로그인 없이도 — AiTutorProfile: 프로필 시트는 사람 프로필과 같은 틀 ProfileFrame(얼굴 64·이름 줄·아래 한 줄·닫기·소개·가로 버튼, 2026-11-02 사용자 "프로필 구조 통일") + 팔로우 · 💬 메시지(그 튜터와의 AI 대화 바로 — 예전 대화 탭으로 옮기기만 하던 💬는 2026-10-30에 뺐고 2026-11-02 대화로 여는 버튼으로 다시) · 📞 통화 · 통화 기록, 사람 탭 줄에도 💬 · 📞, 2026-10-27 "AI 튜터를 사람들과 통합") · 칩 [👤 사람(👥는 단체방 표시라 겹치지 않게, 2026-11-02) | 📋 게시판(학습 언어별, 주제 칩 자유·질문·메이트·단체방 → 메이트 신청·단체방 참여, 보이스룸 칩은 Room "열린 방"과 겹쳐 뺌 2026-11-02 — 예전 보이스룸 글의 방 들어가기는 그대로)](이모지만, 2026-11-03 아이콘 마켓은 1:1·단체방 🙂) · 프로필 시트(팔로우·메시지·메이트 신청·차단·신고 — 사진 모서리 국기 = 국적만, 언어 칩은 국기 없이 이름, ProfileFacts CountryMark, 2026-10-31) · 로그인한 채 처음 들어오면 "나를 소개해요"(국적·모국어·할 수 있는 언어 여러 개·관심사·대화 방식 — 배우는 언어 칸 없음, 처음 실행에서 고른 것, 건너뛰기, AccountCard PeopleFactsAsk, 2026-10-31) · ➕ 친구 초대 → 시트(🎁 초대 보상 카드 + 공유)
├ Room room ─ 로비("열린 방" 줄에 새로고침 · + 새 방, 내 프로필 줄 뺌 2026-11-02, 방 카드) → 방(자리 8칸·듣는 줄·자막·댓글) · 👥 이 방 사람들과 단체방 · 🎭 게임(방장: 라이어 게임·마피아)
└ My my ─ 계정 카드 · 🎁 초대 보상 · 🤝 메이트·팀 줄 → 대화의 워크스페이스
          **큰 칸 셋 = 위 칸 이름 줄이 탭(누른 칸 하나만 그 아래 제자리에 — 2026-11-02 사용자 "위에 있는 버튼을 기준으로 탭을 분할해줘", 예전 모두 펼침은 뺌, 탭을 누르면 그 칸이 제자리에 작게, 그 칸 머리(⤢)나 칸 안 빈 곳(버튼·입력칸 말고)을 누르면 전체 화면 FullScreenLayer — 위에 같은 이름 줄 + ? + ✕, 안에서 탭을 누르면 칸만 바뀜, 2026-11-02 사용자 "위쪽버튼을 누르면 작은화면 > 그 화면을 누를시 큰화면"; 순서 늘 Stagebank · Quizbank · Logbank, 하루 첫 화면은 Stagebank — 오늘 할 것이 남았으면 그날 처음 My를 열 때 전체 화면으로 펼친 채(AutoFull myLayer.autoFull, 2026-11-03 사용자 "첫화면엔 오늘의 학습이 펼쳐진 상태로"; 칸 머리 학습 시간 n분은 뺌), 오늘 할 것을 끝내는 순간 Quizbank 탭으로(전체 화면 그대로)(이미 끝난 채 들어오면 그날 한 번) AutoQuiz myLayer.autoKeep, 2026-11-02; 칸은 접지 않음(2026-11-02)) — 펼친 칸 색이 칸마다 다름(Stagebank 노랑·Quizbank 초록·Logbank 하늘 — Logbank 안 육각형·막대·칩·버튼도 하늘색, 맞음·틀림 표시만 초록·노랑, 2026-11-03, LAYER_TONE). 이름은 셋 다 ~bank(2026-10-31 사용자 "단계 학습도 ~bank식으로 이름 통일", copy stagebankTitle·keepTitle·logbankTitle — 14개 언어 같은 이름), Stagebank 머리 오른쪽에 지금 단계. 칸 머리마다 **?** → 그 칸 설명 시트(studyMap/BankHelp: 제목·번호 없이 칸마다 정한 순서 — 맨 위 핵심 기능 하나(큰 글 + 영상·그림, Stagebank·Quizbank는 그 학습 언어 실제 분량 숫자), 아래 세부 기능 한 줄씩 + 오른쪽 작은 그림(누르면 크게), 2026-11-02 사용자 "구조를 정해 두지 말고 탭별로 핵심 > 세부, 직관적으로" — lib/guide/banks.ts ORDER·blocks, 옛 앱은 예전 can·how, 글은 /api/guide banks=1 lib/guide/banks.ts 14개 언어, 그림 scripts/capture-bank-guide.mjs · 영상 scripts/guide-clips.mjs, 2026-10-31 사용자 "BANK류에 ? 버튼으로 설명"):**
          [n단계] = 오늘 할 것과 한 칸(2026-10-30 사용자 "첫 화면은 일일 학습으로 바로, 끝나면 단계 화면"): 칸 안 맨 위는 늘 오늘 할 것(끝났으면 오늘 끝 — 점·오늘 배운 것), 그 아래 줄을 긋고 단계 화면이 늘 펼쳐 있음(2026-11-02 사용자 "Stagebank는 탭이 펼쳐져있게, 가장 위에 오늘의 학습" — 예전 "n단계 ›"·"‹ 오늘 할 것" 오가기 stagePeek는 뺌). 오늘 목록·틀린 줄에서 문장구조·상황을 열면 Stagebank 탭의 그것으로.
          [오늘 할 것 · n분] → TodayPlan: 목록 대신 지금 할 것 하나(2026-10-30 사용자 "퀴즈처럼 첫 화면으로, 다 안 보여 줘도 되니 뭘 할지 명확히") — 맨 위 점(항목마다 ● 끝·◉ 지금·○ 남음) + 📝(때가 되면 실력 확인 → 단계 시험 → 단계 미리 확인 — 단계를 정하는 시험이라 Stagebank, 2026-11-03 Quizbank 머리 줄에서 옮김) + ⚙, 퀴즈면 칸 안에서 바로 한 문제(InlineQuiz, 다음을 누를 때 기록 → 다음 할 것으로), 문장구조·상황·꺼내 쓰기면 이름 + 첫 줄이 보이는 카드 하나(▶ 누르면 n단계 칸의 그것·RecallPlayer) · 맨 끝에 대본 은행 장면 하나(14개 언어 1~3단계 20개씩, 1~지금 단계에서 고름 — curriculum/scriptBank.ts·stageScripts/bank/, ▶ → ScriptPlayer: 위에 그 장면 문장구조 칩(내 말에 쓰면 불), 내 줄은 채팅 입력) · 오늘 배운 것 · ⚙(눌러서 펼침, 분량 n일 완성 · 커리큘럼 순서 | 내 기록에 맞춰 · 조합 [랜덤 | 말하기 | 읽기] · 🔔 아침 알림) — 0단계면 LettersPlan
          다음 추천(2026-11-02 사용자 "권장 학습 흐름으로 학습을 끝내거나 끌 때 다른 학습으로 이동", lib/curriculum/upNext.ts·studyMap/UpNext): TodayPlan이 남은 오늘 할 것을 차례대로 올리고(다 했으면 Quizbank — NotebookSection UpNextHost), 문장구조·표현·문법 수업(FrameLesson)·상황(ScriptPlayer)·꺼내 쓰기(RecallPlayer) 끝 화면에 "다음 추천 ▶ 이름" 버튼, 닫으면(✕·닫기) My 아래에 같은 줄 15초(UpNextBar, ✕로 닫음) — 지금 연 것은 빼고, 이 폰 화면 상태만
          [n단계] → 단계 이름 줄 끝 📖 책 아이콘 = 배울 수 있는 것(studyMap/ContentScope, curriculum/contentScope.ts — 큰 숫자 낱말·문법·표현·문장구조·상황 + 단계마다 문법 칸 이름·수, 낱말 = 빈도 목록 + 찾아서 더한 낱말이라 은행이 늘면 늘어남, 진척 아님, 2026-10-31; 홍보용 표 hub/CONTENT.md) · 막대 그래프 아이콘 = 내 진척(시트: 단계대로 | 자유롭게 · **익힌 것 이름만** — 문장구조·어휘·표현·문법 ✓ 칩 + 할 수 있는 일 중 해낸 것, 숫자·막대·망·그래프 없음, 2026-10-30 사용자 "진척 숫자 삭제") · 사다리 0~5 → 이 단계로 정하기 · 지나온 단계(지금보다 아래)를 보면 [돌아보기] → StageReview(그 단계 문장구조 수업을 한 장에 모두 펼침 — 고정 수업 조각 표·어순·흔한 실수·푼 퀴즈·대화 + 이 폰의 내 결과: ✓ 익힘 · ↷ 알아요 · ○ 아직 — 아직(○·↷)이면 퀴즈 정답·대화 내 줄은 ___로 가림(2026-11-02, 베끼기 막기), 퀴즈 ✓✗, 대화에서 쓴 줄 ✓✗, ▶ 그 수업 다시 openLesson — /api/curriculum/fixed-lesson?stage=n 만들지 않고 있는 것만, 2026-11-02 사용자 "학습완료한 단계, 스킵한 단계는 쭉 펼쳐서 결과를 보게") ·
              목록 카드: ✓ 익힘 · 끝까지 했지만 아직이면 ↻ 마지막 n/m(이 폰 dayLog lastResultFor, 2026-11-02 사용자 "완료 표시가 안 떠") · 방식 고르기는 숨김(2026-11-03). 문장구조·상황(표현 대본은 상황 끝에)·문법 목록이 같이 보임. 대본의 말하기·읽기만 오늘 할 것 ⚙에 남음. 🔤 표현은 Quizbank 어휘, 🎯 꺼내 쓰기는 오늘 할 것·단계 조건 → FrameLesson(문장구조 하나 = [설명 › 퀴즈 › 대화] — 설명은 뜻 · 구조(틀 조각마다 하는 일, ___ 칸 포함) · 쓰임 · 예문 넷 → 그 틀 퀴즈 세 문제 → 상대 줄 듣고 그 틀로 대답 세 번(채팅 입력 — 2026-11-03부터 내 줄은 학습 요소 자리만 빈칸(문장구조 조각·표현·문법 조각 itemLesson piece)으로 그 자리만 쓰고 낱말 대조 typedMatches(모델 없음), 요소를 못 찾은 줄만 예전처럼 문장 전체 + Haiku→Sonnet 판단 lib/speech/sayLine typedLine; 답 보기를 누르면 입력칸 닫힘; 문법 칸 수업 제목은 늘 문법 이름; 📐 문법 칸은 문법 한 장 studyMap/GrammarExplain — 규칙·꼴 표·예외·쓰임·흔한 실수·쓰는 문장구조 칩, 퀴즈·대화도 그 한 장 것, server/grammarLesson.ts gramlesson:v1 첫 열기 뒤 만듦, /api/curriculum/item-lesson 응답 grammar; 문장구조 수업 설명엔 그 틀의 📐 문법 칩 → openLesson g|, 2026-11-03), 원문 안 보고 모두 맞히면 익힘, 설명·주고받기는 /api/curriculum/frame-lesson 공유 캐시, 2026-10-30 — **고정 수업이 있으면 그것이 먼저**(server/fixedLesson.ts: 저장소 원고 curriculum/fixedLessons/<학습>.<앱>.json > 서버 저장 fixedlesson:v1, 응답 lesson = 예전 모양 + fixed = 조각 표·흔한 실수·퀴즈 셋·대화 셋 전체; 앱 언어 ko·en은 예약 작업 /api/curriculum/fixed-lesson/seed가 15분마다 16개씩 미리, 그 밖의 앱 언어는 첫 열기 뒤에 만듦, Sonnet 작성 → 검사기 curriculum/fixedLessons/check.ts 통과만, 2026-11-02; 고정 수업이면 설명 = 대표 예문 · 조각 | 앱 언어 | 하는 일 세 칸 표 · 어순 · 쓰임 · 대답 · 흔한 실수(틀린 꼴 → 바른 꼴 · 까닭) — studyMap/FixedExplain, 퀴즈 = 원고의 쓰기 · 고르기 · 고치기 세 문제 fixedLessons/toQuiz.ts); 다시 연습 카드는 FramePlayer 그대로) / 🎯 ▶ 꺼내 쓰기(익힌 문장구조가 없으면 🔒 · 누르면 🧩 문장구조 방식으로, 2026-11-02) → RecallPlayer(익힌 문장구조로 앱 언어 뜻 보고 말하기 5문제, 문제는 /api/curriculum/recall 공유 캐시 + 대본 줄, 맞히면 r|틀 known) / ScriptPlayer(채팅: 상대 줄 말풍선·소리 → 내 차례엔 뜻 + 핵심 조각만 빈칸인 줄(scriptChoice blankFor — 표현 → 문장구조 조각 → 가장 긴 낱말, 숫자·이름은 빼고 2026-11-03) + 아래 입력칸에 그 조각을 써서 보냄 → 줄에 넣어 대본 줄과 낱말 대조(typedMatches, 마이크·모델 없음), 한 번 보내면 정답/오답 + 정답 줄 소리(원문 보기·다시 쓰기 없음, 틀린 줄은 끝 화면 "그 줄만 다시"), 방식·통과 기준 고르기 없음 — 2026-11-01 사용자 "따라 말하기도 빼고 채팅으로 학습"; 말하는 대본은 통화 탭 다음 설계) · 다음 단계까지 한 줄(틀이 있는 단계: "문장구조 a/n · 꺼내 쓰기 b/n", 다 차면 [다음 단계로 ›] → 단계 시험, curriculum/recall.ts stageFrameTally — 틀 없는 단계만 예전 네 갈래 중 모자란 것 이름; 네 갈래 [어휘|문법|표현|발음] 고르기·칸(단어장·단어 고르기·철자·표기 등)은 2026-11-02 뺌 — Quizbank·Logbank와 겹침) · 이 단계 대화 예시
          **2026-11-01 개편(hub/QUIZ.md §0):** Quizbank 탭은 [어휘 | 다시 보기], 모인 소재 20개면 시험 탭이 나타나 정기 시험을 푼다(수집 중에는 탭·모인 수·소재 칩 없음, 2026-11-03) — 시험 = 그 정기 시험(curriculum/exam.ts, CheckupPlayer kind exam), 다시 보기 = 예전 지난번에 틀린 것(틀리면 "설명" → openLesson). Stagebank 방식 고르기에 🔤 표현 목록·📐 문법 목록 → FrameLesson(subject) 같은 화면, 어디서나 여는 층 studyMap/LessonHost(AppHome, 신호 openLesson — 통화 정리·Logbank 칩·다시 보기·시험 탭). 아래 Quizbank 줄의 문법·표현 탭은 예전 기록. Logbank 📝 이번 주 확인은 새 앱에 없음.
          [Quizbank] (예전 "퀴즈"·"지속 학습", 이름 Quizbank 2026-10-31 — 14개 언어 같은 이름, copy keepTitle; 알고리즘 전체는 hub/QUIZ.md) → 맨 위 탭 [어휘 | 문법 | 표현 | 지난번에 틀린 것](2026-10-30 사용자 "틀린 것 다시보기는 별도의 탭으로") · 칸 안에 문제만(studyMap/InlineQuiz) — **빈칸 쓰기**(고르기 오답 = 정답의 실수 꼴: frames/decoys·expressions/decoys·문제은행; 사용자 2026-10-30 "타이핑해서 맞추는 식" — bundleQuiz strict type, 긴 조각만 고르기, 💡·모르겠어요, 글자가 다르면 /api/curriculum/typed-check 다시 보기) + 문법·틀린 것 탭에 **틀린 곳 찾아 고치기**(낱말 눌러 → 바른 꼴 쓰기, 내 고친 줄 → frames/decoys/plain) · 문법 탭에 **대화에서 틀린 줄** · 문법·표현 탭에 **대화 조각 빈칸**(이 폰의 AI 채팅·통화 기록에서 앞 줄 셋 + 소재 자리 빈칸, 튜터 줄 일부는 걸러서 모두의 문제은행으로 — AI 대화 ⋮에서 끔, curriculum/talkQuiz.ts, 2026-11-01) · **복합 퀴즈**(이미 맞힌 소재 둘·셋이 든 한 문장 — 빈칸 여러 개 쓰기 · 틀린 곳 여러 개 고치기, 결과는 소재마다, 세 묶음에 한 번 + 낼 것이 떨어지면 복합만 — curriculum/multiQuiz.ts, 2026-11-01), 답하면 다음 문제 · 틀린 것은 "지난번에 틀린 것" 탭에서만(nextStudy review 줄: 다시 볼 것·틀렸던 것·막힌 것, 새로 배우기 줄에서는 빠짐) · 오른쪽 아이콘: 📕 단어 사전(빈도 목록을 단어·뜻으로 검색, studyMap/Dictionary). 📖 단어장은 2026-11-04에 뺌. 어휘 탭 = 처음 보는 낱말만 + 영어는 넣어 둔 문법·표현 고르기가 묶음 앞이고, 넣어 둔 단어는 뜻을 보고 쓴다(preparedQuiz) + 묶음마다 덩어리 표현 하나(2026-11-03, curriculum/expressionDeck.ts·useExpressionCards.ts — 문장구조와 같은 표현은 뺌, 카드 server/expressionCards.ts /api/curriculum/words?expr=단계, 맞히면 표현 장부 배움)(⚙ 칸을 안 골랐으면 수준 맞추기 — 처음 20개는 단계 구간을 섞어 아는 순위를 어림, 그 뒤 경계 근처, 새 낱말 10개마다 😴 쉬워요 · 👌 적당해요 · 😵 어려워요 한 줄, ⚙ "어디서부터" 단계별 낱말 예시 — curriculum/vocabLevel.ts, 2026-11-01) + 때가 되면 탭 위 📝 단어 시험 줄(curriculum/circle.ts wordTest·wordTestDue, 이 폰 quizCircle.v1 — 틀린 것 + 맞힌 것 최소 셋, 새 낱말 20개마다·틀림 8개·잊을 때 된 것 넷, 2026-11-01 사용자 "처음 본 단어만 계속, 주기적으로 단어 모음 시험" — 틀린 낱말 30개 넘으면 새 낱말 쉬고 시험 줄만) · ⚙(어휘 탭만 — 어떤 낱말 [단계 | 품사 | 주제], 낱말 단계 = 14개 언어 빈도 목록 순위·대본에 나오면 당김, 지금 단계 위는 안 냄 — curriculum/vocabBank.ts STAGE_CUTS·curriculum/vocab/, 2026-10-31)
          [Logbank] (2.80 2026-11-06: 기본 그림 = 띠 studyMap/SkillBands(같은 computeFill 값, 규칙 curriculum/bandView.ts — 잰 것 없는 단계 빈칸, 답 8 미만 ─) · ☰ | ⬡로 육각형, logbankView.v1 · 2주 비교는 나아진 점 둘·부족한 점 하나 · 사건 장부 curriculum/logLedger.ts logbank.v1.<언어> ← quizDays.noteQuizDay·callHooks useCallRecap·rooms/client fixMyLine·Dictionary(아직 읽는 화면 없음, 띠 2단계 재료). 아래는 그 전: 2026-11-02 저녁: 맨 위 언어능력 육각형 studyMap/SkillHexagon — 값 curriculum/fill.ts computeFill, 재료 curriculum/fillInputs.ts, 처음 체크 curriculum/fillCheck.ts(글자부터만 저장, 초급·중급·고급 버튼은 2026-11-03에 뺌), 방향 curriculum/fillFocus.ts → TodayPlan 내 기록에 맞춰·채우기; 꼭짓점 → 게이지·번호 있는 부족(아직 모름은 네 개까지)·📎 기록(아래 예전 막대·목록·LogSheet 그대로) → 세부 칸 → 부족한 점, 틀린 기록만 순서·추천(표현 글자는 그 빈칸 문장구조 openLesson, 낱말 뜻, 듣기·실전 대화는 startCall. 안 푼 표현은 넣지 않음); 기준 탭은 없어지고 ⏱ 한 줄 — 설계 hub/drafts/fill-gauge-2026-11-02.md. 아래는 그 전 모양) (예전 [복습] 칸 자리, 2026-10-31 → 2026-11-02 사용자 "층위가 모호 — 기준 하나, 모은 자료, 누르면 세부" — studyMap/Logbank, AI 없이) → [주 | 월] ‹ 기간 › · 기준 탭 [⏱ 학습 시간 | 📐 문법 | 🔤 어휘 | 💬 표현](logbankBasis.v1) · 합 · 날마다 쌓은 막대(누르면 그날 세부 LogSheet — 통화·수업 결과 카드·Quizbank 틀린 것·배운 칩·고친 줄·🗑 그날 지우기) · 아래 목록(시간: 어디서 얼마나 / 갈래: 모든 탭의 소재를 하나로, 누르면 소재 세부 — ▶ 그 수업 openLesson + 나온 일 날짜순) — 자료 셈 curriculum/logbankData.ts(재료 /api/notebook logItems 1년 · dayLog.v1 key·secs · quizDays.v1 · callDays.v1 · 통화 기록) · 육각형 한가운데 📈 실력 기록(기록이 있을 때, 2026-11-03). 📝 이번 주 확인은 새 앱에 없음. 예전 복습의 읽고 정리 카드(studyMap/ReviewNotes)는 Quizbank "지난번에 틀린 것" 탭 문제 아래로.
          자라는 문제은행(2026-10-30, curriculum/qbank.ts·qbankRules.ts·server/qbank.ts·/api/curriculum/qbank): 퀴즈를 낼 때 열쇠(e|·f|·w|)를 서버에 알리면 모자란 열쇠는 모델이 새 예문·헷갈리는 오답을 만들어 모두가 같이 쓰고(qbank:v1), 풀이 결과(문장·맞음·보기·고른 보기)로 너무 쉬운 예문·안 골리는 오답은 빠지고 다시 자람 — 열쇠마다 하루 3번·전체 400번. 받은 묶음은 이 폰에도(qbank.v1.<언어>), 다음 묶음 열쇠도 미리. 출시 초반 미리 채우기 = 예약 작업 /api/curriculum/qbank/seed(문장구조·핵심 표현, 2시간마다 30개), Vercel QBANK_FROZEN=1이면 고정(2026-11-01).
          퀴즈·시험 화면은 칸 밖(TodayPlan children의 overlays)이라 칸을 접어도 떠 있다. 예전 [망 | 그래프 | 단계] 토글·[오늘의 학습]·[지난 학습]·노트에 넣기는 새 앱에 없음(GrowthNetwork plain, CURRICULUM_ONLY).
          튜터가 고친 줄은 서버가 바로 복습 카드로(notes/notebook.ts fileFix, 오타만 7일 후보).
          자세한 규칙(시험·숙지·통과·퀴즈 고르기)은 PRODUCT.md "My" 절 — 아래 예전 한 줄 요약은 2026-10-29 기준:
          단계 보기 세부(2026-10-29) = 오늘 할 것(분량마다 퀴즈 칸 먼저, QuizPlayer 틀린 곳·빈칸·순서·말하기) · 지속 학습(묶음 퀴즈, 시험에서 맞힌 것 확인 중 → 다른 날 세 번 이미 앎, lib/curriculum/known.ts) · 이번 주 확인(CheckupPlayer 12문제) · 단계 시험(24문제, lib/curriculum/stageTest.ts) · 실력 확인(PlacementPlayer)
          지도가 없으면 처음엔 대화 예시로 단계 고르기 한 장(글자가 다른 학습 언어면 맨 위 "0단계 · 글자·소리부터"), "다시 고르기"로 다시 고를 땐 [시험으로 시작 | 그냥 고르기]

어디서나 열림  문장분석 시트 sheet (채팅·통화 돌아보기·영상·노트의 문장 → "분석") · 표현 시트 · 결제 화면
               └ 🔎 My에서 찾기(FindInMy) → 서버가 틀의 칸 → My 단계 보기 그 단계·칸 시트 + "이 장면 넣기"(화면 함께, lib/notes/locateHandoff.ts — AI 대화·통화·영상만 화면, 사람 대화는 고른 부분만)
```

- **사람 기능이 꺼지면**(iOS 1차, `src/lib/platform.ts` `socialFeaturesEnabled`): 하단은 My │ 채팅 │ 영상 학습(통화는 채팅 머리 📞), 대화·사람·Room·메시지·단체방 전부 없음.
  플랫폼마다 다른 것은 `platform.ts`에만 둔다(광고 `adsAvailable`, Google 로그인, 영상 받기 등).
- **쓸 기능 고르기**(`src/lib/features.ts`, 2026-10-21): 사용자가 통화·영상·사람·Room·노트를 숨기면 `AppHome`이 탭에서 빼고(`tabHidden`),
  숨긴 탭으로 가는 `openTab`·`practice`는 탭을 바꾸지 않고 사용법의 그 장을 연다(`openGuide` hidden). 스위치는 사용법 창(`GuideSheet`)에만 있고, 장 ↔ 기능은 `featureOfGo`.
  새 탭이나 새 사용법 장을 만들면 `featureOfTab`·`featureOfGo`·`FEATURE_CHAPTER`(AppHome)·`FeatureMap`(구조도 칸)을 같이 본다. 창구 모드에서는 쓰지 않는다.
  하단 탭 목록은 `features.ts` `bottomTabs` 하나로 정한다(AppHome과 구조도 미리보기가 같이 씀) — 탭 순서를 바꾸면 여기서.
- **대화 화면 하나의 문법**(2026-10-23, `hub/drafts/conversation-unify-2026-10-23.md`): AI 대화·AI 통화·1:1·단체방·Room 줄은 **누르면** 할 일 한 줄(`conversation/LineTools` — 듣기·번역·분석 + 화면마다 더함),
  내 줄 교정은 어디서나 `CorrectionChip`/`CorrectionCard`(채팅 설정 `correctionView` 하나). 줄에 버튼을 늘 달지 않는다 — 새 줄 기능은 LineTools의 `extra`로.
  AI 통화는 `CallHost`(AppHome에 늘 붙음)가 `startCall`·`practice`(tab roleplay)·`openCall`로 연다. `sayOwnLine`(내 문장 말해보기)은 2026-11-03에 메뉴에서 숨김. 저장된 통화는 `lib/roleplay/callStore.ts` — 통화 기록 목록 `CallList`만 보여 준다(채팅 안 🗒 카드·지난 대화 서랍에서는 뺌, 2026-10-27 사용자 "통화와 메시지 기록 따로"). `openCall` id 없음 = 목록. `?screen=roleplay`는 AI 대화로.
  통화 화면 파일(2026-11-01 정리): `RoleplayScreen`은 차례 흐름(마이크·감독·막힘 패널)만 — 튜터 줄 소리는 `lib/roleplay/linePlayer.ts`, 대본 표시(고친 말·막힘·힌트·번역)는 `lib/roleplay/transcriptMarks.ts`,
  남은 시간·켬/끔·통화 정리 저장은 `roleplay/callHooks.ts`, 머리·바닥은 `roleplay/CallParts.tsx`. 한 줄 말하고 들린 대로 보기(`sayLine`·`Attempt`·`SayItBack`)는 통화와 My가 같이 써서 `lib/speech/sayLine.ts`·`components/speech/Attempt.tsx`(영역 speech).
  오늘의 팩 화면 코드(PackCard·lib/pack/client)는 지움 — `/api/pack/*`는 2.75 이하 앱용으로만 남음. 내부 id `roleplay`는 옛 링크·사용법·쓸 기능 고르기 이름이라 남기고, `openTab("roleplay")`는 `startCall`로 바뀐다.
- **안에서 쓰는 이름과 화면 이름이 다르다:** My = `map`, 대화 = `talk`(옛 `messages`도 여기로), 통화 = `roleplay`, Room = `rooms`, 단어장 = `vocab`(My 노트 안).
  옛 링크 `?screen=…`는 `AppHome.tsx` `resolveTab`이 새 자리로 보낸다 — 탭을 바꾸면 여기와 사용법(`GUIDE_CHAPTERS`)·새로워진 점 `guide` 칸·캡처 스크립트를 같이 본다.
- **탭끼리는 서로를 직접 부르지 않는다.** "이 표현으로 채팅", "이 장면 영상으로" 같은 이동은 `appIntents` 신호(아래 자동 표)로 하고, 받는 쪽이 처리한다.
- **오늘 해볼 것·표현 장부(`learner`)는 여러 탭이 같이 쓴다:** 채팅·통화 첫 화면(My에서는 2026-10-27에 뺌). 바꾸면 두 곳을 다 본다.
- **My 예전 기능 뺌(2026-10-27):** 목표 지도 화면(주제·미션·복습)·직접 묻기·My의 오늘 해볼 것·노트 목차·문장분석 "지도에 넣기"는 새 앱에 없다.
  지도 기록(`curriculum`)은 단계·체크를 들고 있어 남고("새 목표"·"다음 단계로"가 체크 화면으로 다시 그림), 그 화면들의 API는 2.74 이하 앱용(아래 "밖에서 부르는 API").
- **광고**(무료·안드로이드만, 자리·설정·손익 전체는 `hub/ADS.md` — 자동): 배너는 둘러보는 화면(My·영상·대화 목록), 채팅·통화·Room·사람에는 없음. 통화·Room에서는 앱 오프닝 광고 없음(`AppHome.tsx` `BANNER_TABS`·`NO_APP_OPEN_TABS`).
  웹은 같은 목록 자리에 AdSense만(`WebAdSlot`, `lib/webAds.ts` — 전면·배너·앱 오프닝 없음, Vercel 값 넣기 전엔 꺼짐).
  목록 사이 네이티브 광고 `NativeAdSlot`(자리 높이는 늘 120px — 플러그인이 그보다 작은 자리는 안 불러옴, 2026-11-02 1px 접기 되돌림): 대화 목록(1:1 목록 끝 — 단체방과 1:1 사이에 두면 빈칸이 가운데를 벌려 2026-11-02 옮김)·영상 목록(세 번째·여덟 번째 뒤)·사람 목록(네 번째 뒤)·게시판(세 번째 글 뒤)·Room 로비(두 번째·다섯 번째 방 뒤).
  빈 공간 네이티브(2026-11-01): My 칸 전체 화면 안(Stagebank 오늘 할 것 아래·단계 화면 대화 예시 앞·Quizbank 문제 아래·Logbank 세 번째 날 뒤 — `layerOnly`, 바닥 My는 배너), 수업 퀴즈 단계 아래, 끝 화면 점수 아래(QuizPlayer·FrameLesson·RecallPlayer·CheckupPlayer·대본 ScriptPlayer 버튼 아래 script-end, 2026-11-02)·AI 통화 끝 화면 대본 장과 닫기 사이(RoleplayScreen call-end)·AI 통화 중 버튼 아래 따로 만든 칸(CallAdStrip 피드 call, 화면 680px 이상, 2026-11-02), 로그인 전 사람·Room 로그인 카드 아래, AI 채팅 잠김 화면.
  읽기 화면 끝(2026-11-01 23시, 피드 `sheets`): 📖 배울 수 있는 것(ContentScope)·칸 ? 설명(BankHelp)·사용법 창 장 본문 끝(GuideSheet, 쓸 기능 고르기 제외)·📈 내 진척(익힌 것이 있을 때)·실력 기록(SkillRecord) 끝.
  Quizbank·수업 퀴즈 아래 광고는 문제가 바뀔 때 앞 광고가 60초(`lib/ads.ts` NATIVE_REFRESH_MS) 넘었으면 새것(문제 도중 안 바꿈, NativeAdSlot useNativeRefresh).
  웹 화면 위에 떠 있어 그 자리가 든 층(`FullScreenLayer`·`BodyLayer`가 주는 층 id, 바닥 0)이 맨 위일 때만 붙고, 위에 다른 층이 덮이거나 탭이 숨거나 키보드가 올라오면 떼어 낸다(플러그인 동시 화면 2개 한도, `lib/ads.ts`).
  전면 광고는 끝나는 자리에만: 통화·팩·미션 끝, 채팅 몇 번 뒤 나갈 때, 공개 방에 몇 분 있다 나올 때(`RoomsScreen`), 영상을 몇 분 보고 나올 때(`VideoLearningTab`), My(오늘 할 것을 다 끝낸 순간 한 번 — 항목 사이 없음, 단계 화면에서 연 수업 끝, Quizbank 10문제 묶음 경계, 시험 끝, 단계 올라감). 1:1·단체방 대화 안에는 광고 없음.
- **창구(웹, `src/lib/doors.ts`, `hub/drafts/doors.md`):** 겉은 다른 서비스(이름·색·소개 글·검색어), 속은 같은 앱. `call.languagebank.net` = Moyeo(단체통화, 첫 화면 Room), `talk.languagebank.net` = Pingo(1:1 대화, 첫 화면 사람 "🟢 지금 접속 중").
  `spin.languagebank.net` = Spin(랜덤 채팅·랜덤 영상통화, 성인인증한 사람끼리만, 첫 화면 🎲 랜덤 탭 `random` — 이 창구에만 보이는 탭, 웹만·앱에는 없음, 서버 스위치 `RANDOM_ENABLED`가 꺼져 있으면 "준비 중"). Pingo 사람 탭 위에 Spin으로 가는 줄(켜졌을 때만).
  창구 주소의 `/`·`/<언어>` → 소개 페이지(`app/door/…`, next.config.ts rewrites), `?screen=`이 붙으면 같은 앱이 **창구 모드**(첫 화면·하단 탭만 그 창구 것, 상단에 창구 이름). 계정·구독·기록은 하나.
- **다시 켤 때 하던 자리로**(2026-11-02 사용자 "학습하다 나갔다 들어오면 첫 화면으로 가", `lib/resumeSpot.ts` resumeSpot.v1 이 폰): 하단 탭(AppHome)·My 칸과 전체 화면(NotebookSection MyLayers)·열어 둔 문장구조 수업·대본(FrameLesson·ScriptPlayer → 다시 켜면 jump로 다시 엶)·소재 수업(LessonHost)을 남겨, 앱이 처음부터 다시 뜨면(뒤로 가기로 나감·폰이 정리) 1시간 안이면 그 자리로. 주소 ?screen·창구가 앞선다. 대본 줄 진행은 원래 "이어서 하기", 수업 안 단계(설명·퀴즈·대화)는 처음부터.
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
- 화면: `AiConsentGate` · `AppHome` · `FeatureMap` · `FullScreenLayer` · `GuideSheet` · `LanguagePick` · `LanguageSelector` · `LearningLanguageFlag` · `Providers` · `ShellUpdate` · `TabIcons` · `TargetLanguageSelector` · `UpdateNotice` · `WhatsNewSheet`
- API: `guide`(My 탭) · `whats-new`
- 웹 페이지: `/`
- 다른 영역이 씀: `AppHome` ← 학습 기록 공통, 사람 탭, My 탭, 웹 전용 페이지 · `FullScreenLayer` ← 여러 영역 9곳 · `LanguageSelector` ← 웹 전용 페이지 · `TabIcons` ← 여러 영역 6곳 · `TargetLanguageSelector` ← 웹 전용 페이지

### 대화 탭 — AI 튜터 줄·1:1 메시지·단체방·팀 `talk`
- 화면: `AiTutorRow` · `rooms/MateAsk` · `rooms/MessagesTab` · `rooms/RoomDm` · `rooms/RoomGroups` · `rooms/TeamSpace`
- API: `dm`(사람 탭, Room 탭, 계정·로그인) · `groups`(사람 탭, Room 탭, 계정·로그인)
- 다른 영역이 씀: `AiTutorRow` ← 앱 틀 · `rooms/MateAsk` ← 사람 탭, Room 탭 · `rooms/MessagesTab` ← 앱 틀 · `rooms/RoomDm` ← 앱 틀, Room 탭 · `rooms/RoomGroups` ← 앱 틀, 사람 탭

### AI 채팅 (대화 → AI 튜터 줄) `chat`
- 화면: `ChatHistoryPanel` · `ChatWindow` · `ExpressionPeek` · `MessageBubble` · `ReportContentDialog` · `conversation/LineTools`
- API: `chat`(대화 탭, 사람 탭, Room 탭, 계정·로그인) · `chat/verify`(대화 탭, 사람 탭, Room 탭, 계정·로그인) · `report`
- 다른 영역이 씀: `ChatWindow` ← 앱 틀 · `conversation/LineTools` ← AI 통화, Room 탭

### AI 통화 (어디서나 뜨는 층 CallHost — 대화·사람 탭 📞) `call`
- 화면: `CallHost` · `CallList` · `RoleplayOwnLine` · `RoleplayPast` · `RoleplayReview` · `RoleplayScreen` · `roleplay/CallParts` · `roleplay/CallRecap` · `roleplay/TurnDiagBox` · `roleplay/callHooks`
- API: `pack/finish` · `pack/today` · `roleplay/branch` · `roleplay/context`(My 탭) · `roleplay/listen`(대화 탭, 사람 탭, Room 탭, My 탭, 계정·로그인) · `roleplay/practice`(My 탭) · `roleplay/review`(My 탭) · `roleplay/turn`(My 탭)
- 다른 영역이 씀: `CallHost` ← 앱 틀 · `roleplay/CallParts` ← My 탭

### 말하기·통화 공용 부품 — 한 줄 말해 보기, 통화 화면 조각·말풍선 얼굴 자리 (AI 통화·사람 통화·채팅·My가 같이 씀) `speech`
- 화면: `speech/Attempt` · `speech/CallKit`
- 다른 영역이 씀: `speech/Attempt` ← AI 통화, My 탭 · `speech/CallKit` ← 대화 탭, AI 채팅, AI 통화, Room 탭

### 문장분석·표현 시트 (여러 화면에서 열림) `sheet`
- 화면: `AnalyzableEnglish` · `EnglishAnalysisProvider` · `EnglishAnalysisViewer` · `ExpressionInsightProvider` · `ExpressionInsightSheet` · `FindInMy` · `MarkForMap` · `SelectableEnglishText` · `SentenceAskPanel` · `TTSButton` · `VocabPreviewProvider` · `VocabSenseList` · `VocabWordPreview`
- API: `english-analysis/element` · `english-analysis/input` · `expression-ask` · `expression-insight` · `expression-units` · `learning-spans` · `translate`(대화 탭, AI 통화, 사람 탭, Room 탭, 계정·로그인) · `tts`(AI 통화, My 탭) · `vocab/gloss` · `vocab`(My 탭)
- 다른 영역이 씀: `AnalyzableEnglish` ← AI 채팅, 영상 학습 탭, My 탭, 웹 전용 페이지 · `EnglishAnalysisProvider` ← 앱 틀, 웹 전용 페이지 · `ExpressionInsightProvider` ← 앱 틀, 웹 전용 페이지 · `FindInMy` ← AI 통화 · `SelectableEnglishText` ← AI 채팅 · `TTSButton` ← AI 채팅, AI 통화, My 탭 · `VocabSenseList` ← My 탭

### 학습 기록 공통 — 오늘 해볼 것·표현 장부 (여러 화면이 같이 씀) `learner`
- 화면: `LedgerLinks` · `NextStepCard`
- API: `learner/ask` · `learner/brief` · `learner/comprehension`(문장분석·표현 시트, 영상 학습 탭) · `learner/growth` · `learner/ledger`(대화 탭, AI 채팅, AI 통화, 문장분석·표현 시트, My 탭) · `learner/next` · `learner/profile` · `learner/self-check`(My 탭)
- 다른 영역이 씀: `LedgerLinks` ← AI 채팅, AI 통화, 영상 학습 탭, My 탭 · `NextStepCard` ← AI 채팅, AI 통화

### 영상 학습 탭 `video`
- 화면: `contentDiscovery/ContentDiscoveryPanel` · `videoLearning/CatalogLibrary` · `videoLearning/CurrentSubtitleCard` · `videoLearning/SavedVideoSessions` · `videoLearning/SegmentPlayButton` · `videoLearning/StudyMaterialsList` · `videoLearning/SubtitleDebugPanel` · `videoLearning/SubtitleGenerationStatus` · `videoLearning/VideoLearningTab` · `videoLearning/VideoPlayer` · `videoLearning/VideoUrlInput` · `videoLearning/VideoWatchFullscreenDock` · `videoLearning/relayPlayer`
- API: `content-discovery/avatar` · `content-discovery/channels` · `content-discovery` · `video-library` · `video-subtitles/analyze` · `video-subtitles/gloss` · `video-subtitles/prepare` · `video-subtitles/prepare-from-stt` · `video-subtitles/transcribe-chunk` · `video-subtitles/window`
- 다른 영역이 씀: `videoLearning/VideoLearningTab` ← 앱 틀

### 사람 탭 — 프로필 목록·게시판·사진 `people`
- 화면: `AiTutorProfile` · `ProfileFrame` · `SuspendedNotice` · `rooms/BoardView` · `rooms/IconEditor` · `rooms/IconPacks` · `rooms/MediaImage` · `rooms/PeopleTab` · `rooms/RoomPeople`
- API: `board`(대화 탭, Room 탭, 계정·로그인) · `icons`(대화 탭, Room 탭, 계정·로그인) · `media`(Room 탭) · `social`(대화 탭, Room 탭, 계정·로그인)
- 다른 영역이 씀: `AiTutorProfile` ← 대화 탭, AI 채팅, AI 통화 · `ProfileFrame` ← Room 탭 · `SuspendedNotice` ← 앱 틀 · `rooms/IconPacks` ← 대화 탭, Room 탭 · `rooms/MediaImage` ← 대화 탭 · `rooms/PeopleTab` ← 앱 틀

### Room 탭 — 말하는 방 `room`
- 화면: `rooms/RoomCall` · `rooms/RoomGame` · `rooms/RoomParts` · `rooms/RoomView` · `rooms/RoomsScreen` · `rooms/VideoStage`
- API: `rooms/fix`(대화 탭, 사람 탭, 계정·로그인) · `rooms/game`(대화 탭, 사람 탭, 계정·로그인) · `rooms`(대화 탭, 사람 탭, 계정·로그인)
- 다른 영역이 씀: `rooms/RoomParts` ← 대화 탭, 사람 탭 · `rooms/RoomsScreen` ← 앱 틀

### 랜덤 연결 — 창구 Spin(성인인증·짝 맞추기, 웹만) `random`
- 화면: `rooms/RandomScreen`
- API: `random`(사람 탭, Room 탭)
- 다른 영역이 씀: `rooms/RandomScreen` ← 앱 틀

### My 탭 — 계정 카드·자라는 중·지도·노트·단어장 `my`
- 화면: `CharacterGuidePanel` · `VocabularyPanel` · `notes/NotebookSection` · `notes/NotesPanel` · `notes/PartDetailSheet` · `studyMap/BankHelp` · `studyMap/CheckupPlayer` · `studyMap/ContentScope` · `studyMap/Dictionary` · `studyMap/ExpressionCard` · `studyMap/FixedExplain` · `studyMap/FrameLesson` · `studyMap/GrammarExplain` · `studyMap/GrowthNetwork` · `studyMap/InlineQuiz` · `studyMap/LanguageBank` · `studyMap/LedgerPanel` · `studyMap/LessonHost` · `studyMap/Logbank` · `studyMap/PlacementPlayer` · `studyMap/QuizPlayer` · `studyMap/RecallPlayer` · `studyMap/ReviewNotes` · `studyMap/ScriptAmount` · `studyMap/ScriptPractice` · `studyMap/SkillBands` · `studyMap/SkillHexagon` · `studyMap/SkillRecord` · `studyMap/StageCheck` · `studyMap/StageFrames` · `studyMap/StageReview` · `studyMap/StageScripts` · `studyMap/StudyMapTab` · `studyMap/TodayPlan` · `studyMap/UpNext` · `studyMap/WeakStrip` · `studyMap/bankTone`
- API: `curriculum/ask` · `curriculum/choices` · `curriculum/fixed-lesson` · `curriculum/frame-lesson` · `curriculum/generate`(학습 기록 공통) · `curriculum/item-lesson` · `curriculum/mission-check` · `curriculum/mission-seen` · `curriculum/missions` · `curriculum/option-notes` · `curriculum/pick` · `curriculum/progress` · `curriculum/qbank` · `curriculum/recall` · `curriculum/restore`(학습 기록 공통) · `curriculum/review` · `curriculum`(AI 통화, 학습 기록 공통) · `curriculum/script` · `curriculum/scripts`(AI 통화) · `curriculum/stages` · `curriculum/typed-check` · `curriculum/words` · `notebook`(문장분석·표현 시트) · `notes/place` · `video-index/find`(학습 기록 공통)
- 다른 영역이 씀: `studyMap/LessonHost` ← 앱 틀 · `studyMap/SkillHexagon` ← AI 통화 · `studyMap/StudyMapTab` ← 앱 틀

### 계정·로그인 `account`
- 화면: `account/AccountCard` · `account/ProfileFacts`
- API: `account/config`(친구 초대·보상) · `account/delete`(친구 초대·보상) · `account/email/start`(친구 초대·보상) · `account/email/verify`(친구 초대·보상) · `account/google`(친구 초대·보상) · `account/me`(친구 초대·보상) · `account/password/change`(친구 초대·보상) · `account/password/login`(친구 초대·보상) · `account/password/signup`(친구 초대·보상) · `account/profile`(친구 초대·보상)
- 다른 영역이 씀: `account/AccountCard` ← 여러 영역 9곳 · `account/ProfileFacts` ← 대화 탭, 사람 탭, Room 탭

### 요금·포인트·광고 `billing`
- 화면: `BillingScreen` · `NativeAdSlot` · `PointStore` · `PointsIcon` · `WebAdSlot`
- API: `ads/config`(여러 영역 6곳) · `ads/ssv` · `ads/txt` · `entitlement`(여러 영역 14곳) · `points/sync`(여러 영역 14곳)
- 웹 페이지: `/subscribe`
- 다른 영역이 씀: `BillingScreen` ← 앱 틀, AI 채팅, 영상 학습 탭, 사람 탭, My 탭 · `NativeAdSlot` ← 여러 영역 8곳 · `PointsIcon` ← 영상 학습 탭, 의견 보내기·반영 소식

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
| `openTab` | 여러 영역 8곳 | 앱 틀 |
| `chatDraft` | — | AI 채팅 |
| `openVideo` | 여러 영역 6곳 | 영상 학습 탭 |
| `practice` | AI 채팅, 학습 기록 공통 | 앱 틀, AI 채팅, AI 통화 |
| `startCall` | 앱 틀, AI 통화, 사람 탭, My 탭 | AI 통화 |
| `openCall` | 앱 틀, AI 통화, 사람 탭, My 탭 | AI 통화 |
| `sayOwnLine` | — | AI 통화 |
| `openNotes` | 앱 틀 | My 탭 |
| `openGuide` | 앱 틀 | 앱 틀 |
| `openLesson` | — | My 탭 |

## 자동: 쓰지 않는 것 (지울지 확인)

- 아무도 안 가져다 쓰는 화면 코드: 없음
- 앱·스크립트 어디서도 안 부르는 API: `roleplay/branch`
- 밖에서 부르는 API: `curriculum/choices` My 대본 고르기 방식(2026-10-29~)이 씀 — 2026-11-01 대본이 따라 말하기 하나가 되며 새 앱에서 뺌. Play에 나간 앱(2.75)은 이 방식이 없어 아무도 안 부름 — 다음 정리 때 지움(op scriptChoices도) · `pack/today` 옛 앱 2.48~2.75가 오늘의 팩에 씀 — 2.76부터 새 앱에서 뺌(2026-11-01 화면 코드 PackCard 지움), 최소 지원 버전을 2.76 이상으로 올리면 지움 · `pack/finish` 옛 앱 2.48~2.75가 오늘의 팩 끝(회고)에 씀 — 2.76부터 새 앱에서 뺌, 최소 지원 버전을 2.76 이상으로 올리면 지움 · `curriculum/pick` 옛 앱 2.48~2.74가 문장분석 "지도에 넣기"에 씀 — 2026-10-27 새 앱에서 뺌, 최소 지원 버전을 2.75 이상으로 올리면 지움 · `curriculum/progress` 옛 앱 2.48~2.74가 My 예전 기능(목표 지도·미션·직접 묻기·노트 목차)에 씀 — 2026-10-27 새 앱에서 뺌, 최소 지원 버전을 2.75 이상으로 올리면 지움 · `curriculum/mission-check` 옛 앱 2.48~2.74가 My 예전 기능(목표 지도·미션·직접 묻기·노트 목차)에 씀 — 2026-10-27 새 앱에서 뺌, 최소 지원 버전을 2.75 이상으로 올리면 지움 · `curriculum/mission-seen` 옛 앱 2.48~2.74가 My 예전 기능(목표 지도·미션·직접 묻기·노트 목차)에 씀 — 2026-10-27 새 앱에서 뺌, 최소 지원 버전을 2.75 이상으로 올리면 지움 · `curriculum/missions` 옛 앱 2.48~2.74가 My 예전 기능(목표 지도·미션·직접 묻기·노트 목차)에 씀 — 2026-10-27 새 앱에서 뺌, 최소 지원 버전을 2.75 이상으로 올리면 지움 · `curriculum/review` 옛 앱 2.48~2.74가 My 예전 기능(목표 지도·미션·직접 묻기·노트 목차)에 씀 — 2026-10-27 새 앱에서 뺌, 최소 지원 버전을 2.75 이상으로 올리면 지움 · `learner/ask` 옛 앱 2.48~2.74가 My 예전 기능(목표 지도·미션·직접 묻기·노트 목차)에 씀 — 2026-10-27 새 앱에서 뺌, 최소 지원 버전을 2.75 이상으로 올리면 지움 · `notes/place` 옛 앱 2.48~2.74가 My 예전 기능(목표 지도·미션·직접 묻기·노트 목차)에 씀 — 2026-10-27 새 앱에서 뺌, 최소 지원 버전을 2.75 이상으로 올리면 지움 · `learner/profile` 옛 앱 2.48~2.74가 My 예전 기능(목표 지도·미션·직접 묻기·노트 목차)에 씀 — 2026-10-27 새 앱에서 뺌, 최소 지원 버전을 2.75 이상으로 올리면 지움 · `ops/reports` 운영자 신고함 페이지 /ops(운영자 키) · `ads/ssv` AdMob 서버가 보상 확인으로 부름 · `ads/txt` AdSense가 /ads.txt로 읽음(next.config.ts rewrites) · `account/purge` Vercel 예약 작업(vercel.json) · `media/sweep` Vercel 예약 작업(vercel.json) · `curriculum/qbank/seed` Vercel 예약 작업(vercel.json) — 출시 초반 문제은행 미리 채우기 · `curriculum/fixed-lesson/seed` Vercel 예약 작업(vercel.json) — Stagebank 고정 수업 미리 만들기(앱 언어 ko·en) · `feedback/fixed` 의견함 예약 작업(scripts/feedback-notify.mjs) · `feedback/image` 의견함 정리(scripts/feedback-pull.mjs) · `simcheck/forget` 가상 사용자 점검이 끝날 때 · `video-subtitles/window` 옛 앱 2.48~2.57이 영상 해석에 씀 — 최소 지원 버전을 2.58 이상으로 올리면 지움 · `learner/growth` 옛 앱 2.48~2.74가 My 망·그래프(여섯 요소)에 씀 — 2.75부터 화면은 네 갈래(/api/notebook parts), 최소 지원 버전을 2.75 이상으로 올리면 화면용으로는 지움(점검 스크립트는 씀) · `english-analysis/input` 옛 앱 2.48~2.62가 문장분석에 씀 — 최소 지원 버전을 2.63 이상으로 올리면 지움 · `english-analysis/element` 옛 앱 2.48~2.62가 문장분석에 씀 — 최소 지원 버전을 2.63 이상으로 올리면 지움 · `learner/brief` 가상 사용자 점검(next·map 묶음)이 튜터 요약 확인에 씀 · `build` 시험 앱 껍데기(운영 웹을 불러 쓰는 디버그 APK)의 ShellUpdate가 새 배포 확인에 씀

<!-- 자동 끝 -->
