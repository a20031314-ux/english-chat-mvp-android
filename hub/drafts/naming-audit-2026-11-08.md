# 이름·아이콘·데이터 겹침 전수조사 (2026-11-08, 탭 2)

사용자 "앱 내에서 아이콘, 데이터, 기능 명칭 중에 겹치거나 같은데 다르게 표기되는 부분 있는지 전수조사해줘". 조사만, 고친 것 없음 — 고칠 순서는 사용자.

범위: `copy.ts` 한국어 문구 중 코드에서 부르는 1,003키(전체 1,597 — 나머지 약 590은 옛 화면·안 부름으로 보임), `src/` 화면 코드의 이모지 전부, 이 폰 저장 키(`*.v1`)와 장부. 개편(`lbReform`)이 켜진 화면 기준, 꺼진 화면만의 것은 따로 적음.
못 본 것: 다른 13개 언어 문구 각자의 엇갈림, SVG 아이콘(하단 탭 등), 새로워진 점·사용법 옛 글.

## A. 아이콘 — 한 그림이 여러 뜻 (같은 화면이면 ★)

| 그림 | 뜻들 | 어디 |
|---|---|---|
| 💬 ★ | 자막 켬/끔 · "내 말 → 학습 언어" 카드 · 메시지 · 채팅 출처 · Logbank 💬 표현 · 의견 보내기 · 랜덤 채팅 | 통화 화면에서 자막 버튼과 카드가 같은 그림(CallParts) · 사람 프로필 · Growth SOURCE_ICON · Logbank LEARN_ICON |
| 💡 ★ | 힌트 버튼 · "더 자연스럽게" 카드 · 건넨 표현 카드 · 퀴즈 힌트 | 통화 화면 버튼·카드(CallParts, CoachCardView) |
| 표현 그림 셋 | Logbank 💬 표현 · 통화 정리 🔤 표현(Logbank에선 🔤 = 어휘) · 통화 카드 💡 표현 | CallRecap 80줄 · Logbank 1194줄 |
| 🔁 ★ | 다시 말해 맞힘(통화 요약·Logbank) · 장면 "같은 흐름" · PartDetailSheet 복습 | 통화 끝 화면에 둘 다(CallParts 299 · CallReplay 47) |
| 🔀 | 퀴즈 순서 문제 · 장면 "다른 갈래" | QuizPlayer 1426 · CallReplay 47 |
| 🎭 | Room 게임 · Logbank 상황(대본)·미션 출처 | 통화 장면에선 같은 이유로 이미 뺌(11-08) |
| 🎯 | 꺼내 쓰기 · 프로필 목표 · 팀 목표 · 대본 목표 | Logbank 828·986 · ProfileFacts · TeamSpace · StageScripts |
| 📝 | Quizbank(Logbank 시간 목록·날 줄) · 시험 줄 · 통화 숙제 글자·소리 | Logbank 830·889 · TodayPlan · CallParts 357 |
| 🧩 | 문장구조 · Logbank 출처 "지도(map)" | Logbank 224 |
| 📕 📖 📒 📘 | 📕 Languagebank·사전 · 📖 Logbank 출처 단어장·낱말 문 · 📒 PartDetailSheet 단어장 · 📘 대본 배지·미션 | 사전 하나에 그림 셋 |
| ↺ ↻ 🔁 | ↺ 다시 맞힘 · ↻ 마지막 결과(대본)·장면 다시 · 🔁 다시 말해 맞힘 | 비슷한 화살표 셋, 뜻 구분이 안 됨 |
| 📞 + "대화" | Logbank 활용 시트 "📞 대화 n" — 그림은 통화, 글은 대화 탭 이름(통화·채팅·사람 합) | Logbank 1321 |
| ✎ | 통화 요약 ✎ = "이렇게 말할 수 있어요" · Logbank ✎ = "고침" · Growth ✎✓ = "고쳐 씀" | 같은 그림, 이름 셋 |
| 🔍 🔎 | 🔍 틀린 곳 찾기 문제 · Room 고르기 필터 · 마피아 경찰 · 🔎 My에서 찾기 | 작음 |
| ✓ ✔ ✅ / ✗ ❌ | 맞음·저장·익숙함 / 틀림·❌ 판단 | 작음 |

## B. 같은 기능, 다른 이름

| 기능 | 화면에 나오는 이름 | 키 |
|---|---|---|
| 낱말 | 단어(단어 사전·단어나 뜻) · 낱말(줄당 낱말·처음 3분 내 낱말·추정 도움말) · 어휘(🔤 어휘·어휘 활용·어휘 이해) | dictionaryTitle·talkWords·lbEstimateHelp·partVocab·skillVocabUse |
| 다시 볼 것 | 확인할 것(오늘 카드) · 복습(곡선 범례) · 다시 볼 것(통화 정리) · 지난번에 틀린 것 · 확인할 때 · n일 뒤 확인 | lbCardCheck·lbAgain·studyReview·weakTitle·lbCheckNow·lbCheckIn |
| 체크 셋(처음 봄·적용이 힘듦·앎) | 처음: 새로 배울 것·처음 보는 것·새로 / 가운데: 적용이 힘듦·헷갈려요 / 끝: 앎·알아요(키 셋)·숙지(Logbank 옛 목록·LedgerPanel)·익숙한 표현 | lbCardNew·lbWhyNew·lbNew·lbCardHard·checkUnsure·knownTag·checkKnown·itemsMastered·filterUsable |
| 고친 것 | 고침 · 고쳐 씀 · 고쳐진 줄 · 이렇게 말할 수 있어요 · 이렇게 바꿔보세요 · 더 자연스럽게 · 또 다른 표현 | partFixed·growFixed·talkFixed·roleplayBetter·correctionTryThis·chatNaturalChip·cardMoreNatural |
| 대본 | 상황(My) · 대본 플랜·단계별 대본 연습(결제) · 📘 대본 n(프로필 배지) · 장면(통화 끝) | stageScriptsTitle·planScriptName·planLineScripts·badgeScripts·replayMaking |
| 사전 | Languagebank · 단어 사전(꺼진 앱 시트) · 단어장(옛, LedgerLinks·LedgerPanel에 남음) | languagebankTitle·dictionaryTitle·homeTabVocab |
| 시험·측정 | 시험 · 단어 시험 · 실력 확인 · 이번 주 확인 · 짧은 측정(첫 측정) | examTitle·wordTestTitle·placementTitle·checkupTitle·fcHelp |
| 요금 | 플랜 · 요금 · 구독 · 플랜 및 결제 | billingOpen·planCurrent·chatNeedsPlan·billingScreenTitle |

## C. 같은 이름, 다른 기능

| 이름 | 뜻들 |
|---|---|
| 대화 | 하단 탭 · 수업 단계 [설명 › 퀴즈 › 대화](탭 이름 키 homeTabTalk를 빌려 씀 — 영어 앱에선 수업 단계가 "Chats") · 숙제 [퀴즈 \| 대화](= 장면) · Logbank "📞 대화"(통화+채팅+사람) · 육각형 "실전 대화" |
| 수업 | 통화 수업(callModeStudy) · 문장구조 수업(FrameLesson) · "튜터 수업"(사용법 글에만) |
| 활용 | 배운 것 표 "활용"(대화에서 씀 + 문장 판단, growthView) · 육각형 "어휘 활용·문장 활용"(fill 계산) — 같은 말, 다른 숫자 |
| 학습 곡선 | Logbank(날마다 푼 수 + 활용 누적) · Languagebank 종류 머리(최근 14일 앎·적용이 힘듦 수) |
| 이렇게 … 말할 수 있어요 | "이렇게 말할 수 있어요"(✎ 고친 말) · "이렇게도 말할 수 있었어요"(장면 다시) — 같은 통화 끝 화면 |
| 돌아보기 | 지난 통화 열기 · 지나온 단계 펼쳐 보기 |
| 써 보기 | 오늘 카드(📞 그 표현으로 통화) · 노트 stageTry |
| 확인 | 답 확인 버튼 · 확인할 것 · 실력 확인 · 이번 주 확인 · n일 뒤 확인 |
| 랜덤 | 오늘 할 것 조합(꺼진 앱) · Spin 랜덤 탭(웹) |
| 복습 | 곡선 범례(다시 푼 것) · 옛 복습 칸 |

## D. 데이터 — 같은 것을 다르게 셈

1. **Quizbank 맞힌 수가 두 군데:** Logbank ⏱ 시간 목록·날 막대 = `quizDays.v1`, 배운 것 표·오늘 카드·체크 셋 = `logbank.v1`. 건너뛴 문제(장부만 miss)·열쇠 없는 문제(날 기록만)·맞나 틀리나의 함께 본 카드(seen — 날 기록만)가 달라 같은 날 숫자가 어긋날 수 있다.
2. **"장부"가 둘:** 서버 표현 장부(learner/ledger, "내 표현") · 이 폰 사건 장부(`logbank.v1`). 문서·주석에서 같은 말.
3. **장부 출처 exam·script는 정해져 있지만 지금 아무도 안 씀** — 체크 셋·표는 이 둘을 세지만 들어오는 일이 없다(개편에서 정기 시험이 빠져 실제 영향은 작음).
4. **퀴즈 결과 저장소가 여럿:** `quizDays`·`quizLog`·`quizCircle`·`quizKinds`·`logbank`·`dayLog`·`studyTally` — 개편 화면은 `logbank`(+ 시간은 `dayLog`·날 줄은 `quizDays`).
5. 문구 키 약 590개를 코드에서 안 부름(옛 화면 — 정리 후보).

## 정할 것 (사용자)

- 한 그림 한 뜻: 💬(자막 → 다른 그림?), 💡(힌트만), 표현 그림 하나(💬 또는 🔤), 🔁 / 🔀 / 🎭 / 🎯 / 📝 겹침.
- 낱말 = 단어 / 낱말 / 어휘 중 하나.
- 체크 셋 이름 셋을 어디서나 같게(처음 봄 · 적용이 힘듦 · 앎), "숙지·익숙한 표현·알아요" 정리.
- 다시 볼 것 = 확인할 것 / 복습 / 다시 볼 것 / 지난번에 틀린 것 중 하나.
- "대화"·"수업"·"활용"·"학습 곡선" 뜻 하나씩.
- Quizbank 숫자를 장부 하나에서만 셀지.

## 사용자 결정 (2026-11-08 18:12)

- 낱말 → **단어**(어휘도), 다시 볼 것 → **복습**, 체크 셋 끝 → **알아요**, 고친 것 → **✎ 그림만** — 반영(같은 날 커밋). 같은 뜻 키는 언어마다 한 낱말(check:languages 4 — 14개 언어).
- "번역에서 엇갈리면 영어로 통일" → 한국어 엇갈림은 번역이 아니라 같은 뜻을 키 여러 개에 따로 쓴 탓, 다른 언어(번역)도 같은 이유로 갈라졌었음(ja 習得済み/わかる 등) — 키 값을 언어마다 하나로 맞추고 검사로 묶음. 영어 통일은 안 함.
- 남은 것: 처음 봄 쪽 이름(새로 배울 것·처음 보는 것·새로), 아이콘 한 그림 여러 뜻(💬·💡·🔁·🔀·🎭·🎯·📝), "대화"·"수업"·"활용"·"학습 곡선", 대본(아래 답).
