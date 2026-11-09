# 앱 광고 구조

> 광고를 바꾸는 채팅이 먼저 읽는다. **위쪽(손으로 씀)**: 원칙·넣지 않는 곳·보류·사람 할 일. **아래쪽(자동)**: 광고 자리·설정·단위·수익 —
> `npm run ads:map`이 코드(`src/lib/billing/ads.ts`, `src/lib/ads.ts`, `<NativeAdSlot`, `maybeShowInterstitial(`, `AppHome.tsx`)에서 만들고, main push 때 CI `ads-map`도 다시 만든다.
> 화면·영역은 `hub/app/STRUCTURE.md`("요금·포인트·광고 `billing`"), 손익은 `hub/app/economics.md`, 비용은 `hub/app/costs.md`, 무엇을 지키는지는 `PRODUCT.md` 광고 절.

## 원칙 (손으로 씀)

- **무료·안드로이드만(웹은 목록 광고만).** 구독자·iOS는 광고 없음. "광고 없이 쓰기"가 구독 이유의 하나.
- **웹(`src/lib/webAds.ts`·`WebAdSlot`):** `NativeAdSlot`과 같은 자리에 AdSense 반응형 광고 하나, 무료만(`/api/ads/config` native.enabled). 전면·앱 오프닝·배너·보상형은 웹에 없음. Vercel `NEXT_PUBLIC_ADSENSE_CLIENT`·`NEXT_PUBLIC_ADSENSE_SLOT_FEED`를 넣어야 켜짐(지금 꺼짐), `/ads.txt`는 서버가 만듦.
- **흐름을 끊지 않는다.** 전면 광고는 무언가 **끝난 자리를 닫을 때**만, 서로 3분 넘게 간격. 지금 순간 여덟: Quizbank 10문제 묶음 경계 · 📏 실력 확인 결과 닫기 · 넘겨 보기 묶음 끝 닫기 · 통화 끝 화면 닫기 · 숙제 둘 다 끝내고 닫기 · 채팅·공개 방·영상에서 나올 때. 쓰는 중·답 기다리는 중·통화 중·앱을 열자마자·끝 화면에 들어서자마자는 안 띄움.
- **AdMob 전면 규칙**([AdMob 도움말](https://support.google.com/admob/answer/6201362), 2026-11-01 확인): 콘텐츠 사이 논리적 쉼(단계·레벨)에만 · 앱 켤 때·끌 때 금지(앱 오프닝으로) · 행동마다 금지(두 번 행동에 한 번까지, 뒤로 가기 포함) · 전면 바로 뒤 전면 금지 · 과제 중·페이지가 열린 직후 갑자기 금지 · 미리 받아 두기. 그래서 문제 사이는 **묶음 경계**만.
- **다음 학습으로 이어 가는 닫기에는 전면 없음:** 끝 화면에서 ▶ Quizbank·통화 정리 칩·글자 숙제·같이 배우기처럼 다음 학습으로 가는 버튼은 광고 없이 바로 간다 — ✕·닫기로 나갈 때만.
- **보상형은 꺼 둠**(2026-10-20 사용자: "광고 보고 더 주는 건 거부감, 그냥 뜨고 건너뛰는 게 흔하다").
- **값은 서버에서.** 간격·조건·켜고 끄기는 Vercel `ADS_*` → 앱 빌드 없이 조정. 광고 자리(어느 화면에 무엇) 자체는 앱 빌드.
- **새 화면마다 광고 자리를 본다**(사용자 2026-11-01): 기능이 더해지면 변경 감시(`scripts/watch/ADS-REVIEW.md`)가 새 UI의 끝 화면·목록·전체 화면 층마다 배너·네이티브·전면을 넣을 수 있는지 보고, 넣는 안은 손익까지 계산해 `hub/app/ads-plan.md`에 남긴다. 푸는 중·입력칸·버튼 옆은 안 됨(AdMob 잘못 누름 정책).
- **한 화면에 광고 하나, 맨 위 층만:** 네이티브는 그 자리가 든 층(`FullScreenLayer`·`BodyLayer`, 바닥 화면 0)이 맨 위일 때만 붙고, 위에 다른 층이 덮이거나 키보드가 올라오면 뗀다(`NativeAdSlot`·`lib/ads.ts` 층 목록). 피드 이름은 화면 종류 단위(`my-full`·`quiz-inline`·`results`·`sheets`·`call`·`chat-locked`·목록 피드) — 동시에 피드 2개 한도.
- **My 탭은 배너 없이 칸 안 네이티브**(사용자 2026-11-09): Logbank 끝·Quizbank 문제 아래·Languagebank 끝 네이티브가 바닥 칸과 전체 화면 모두에 붙고(칸은 한 번에 하나만 그려짐), 하단 배너는 My에 없다(`AppHome.tsx` `BANNER_TABS`). 오늘 ▶ Quizbank가 바닥 칸으로 가서 하루 학습이 바닥에서 돌기 때문.
- **끝 화면·읽는 화면 끝에 네이티브 하나:** 결과 화면(`results` — 소재 수업·숙제 퀴즈·통화·장면·넘겨 보기·글자 퀴즈·실력 확인), 읽는 시트 끝(`sheets` — 사전·표현 카드·그날 세부·숙제 화면·통화 기록·칸 ?·사용법). 버튼과 한 줄 넘게 띄운다(`spaced`).
- **문제 아래 네이티브는 문제가 바뀔 때 60초 넘었으면 교체, 문제 도중에는 안 바꿈**(사용자 2026-11-01): Quizbank·수업 퀴즈(`quiz-inline`) — 간격은 `lib/ads.ts` `NATIVE_REFRESH_MS`, 새 광고는 다음 문제가 그려지고 0.5초 뒤(`NativeAdSlot` `useNativeRefresh`, 자리 높이 고정).
- **학습 사이·빈 공간을 늘 찾는다**(사용자 2026-11-01): 넘어가는 시점(묶음 경계·시험 끝)과 화면의 큰 빈 공간(`scripts/watch/blank.py`)을 광고 자리 후보로 본다.
- **손익이 기준.** 자리·값을 바꾸면 `scripts/sim-users/economics.json`(`my`·`extraAds` — 코드에 있는 자리만)을 맞추고 `npm run sim:economics -- --write`로 다시 계산해, 1,000명당 손익이 단가 중간에서 양수인지 본다.

## 넣지 않는 곳 (손으로 씀)

- AI 채팅·통화 **도중**, 1:1·단체방 **대화 안**, 말하는 방 **안**, 게시글 **안**, 문장분석·표현 시트, **대화·통화 위에서 연 사전·표현 카드**(`above`): 쓰거나 말하는 중이라 흐름이 끊기고 AdMob 정책(갑자기 뜨는 광고) 위험.
  AI 채팅 **잠김 화면은 예외**(사용자 2026-11-01 — 무료는 입력칸이 없어 빈 화면, 구독 버튼과 떨어진 아래 빈 곳에 네이티브 하나 `chat-locked`).
- **소재 수업(openLesson)을 닫을 때 전면:** 수업은 Quizbank 틀린 문제·통화 정리·채팅·사전 어디서나 열려 닫으면 원래 흐름으로 돌아가는 도중이라 — 끝 화면 네이티브만.
- **첫 측정**(처음 My를 열 때, `FirstCheck`): 설치 직후 온보딩이고 결과 '시작' 뒤가 바로 첫 학습이라 전면·네이티브 모두 없음.
- 탭을 열 때·학습 언어 국기를 바꿀 때·보이스룸에 들어갈 때·오늘 카드 ▶·📞·📕·📐 문·실력 확인 ▶를 누를 때 전면: 행동마다·콘텐츠가 열린 직후·핵심 콘텐츠 이동 — 나올 때 전면·목록 네이티브로.
- 오늘 카드 줄 사이·실력 확인 표 옆·자주 쓴 말·같이 배우기 칩 줄: 누르는 버튼 줄이라 잘못 누름.
- AI 통화 **도중**: 화면 칸(튜터·내 얼굴) 안에는 안 넣음. **버튼 넷 아래에 따로 만든 칸**에만 네이티브 하나(사용자 2026-11-02 — `CallAdStrip`, 피드 `call`, 작은 틀이라 영상·소리 없음, 화면 높이 680px 미만이면 안 넣음). 무료는 통화 시간이 없어 포인트를 산 무료 사람만 봄.
- 1:1·단체방 통화가 끝날 때: 메이트 신청·대화로 바로 이어짐.
- 결제 화면: '광고 없이 쓰기'가 구독 이유.
- 배너는 채팅·통화·Room·사람·My에 없음(영상·대화 목록만). 네이티브가 있는 화면에 배너를 늘리지 않는다.

## 보류·다음 (손으로 씀)

- **제휴 상품 카드**(쿠팡·Amazon·Klook 등, `hub/work/drafts/coupang-affiliate.md`): 보류. 그 문서의 "꺼낼 때" 조건이 보이면 사용자에게 먼저 알린다.
- **보상형 전면 광고**(한도에 닿을 때 자동, 건너뛸 수 있음): 플러그인에 있음, 단위 없음. 보상형을 다시 켤 때 같이 검토.
- 실제 eCPM이 쌓이면(출시 1~2주) `ads.ts` `AD_REVENUE_USD`를 고치고 손익 다시.

## 사람이 할 일 (손으로 씀)

- 광고가 든 첫 빌드를 Play에 올리기 전: Play Console 앱 콘텐츠 → 광고 "포함", 데이터 보안(광고 ID·기기 식별자, 광고 목적, AdMob 공유). AdMob "개인정보 보호 및 메시지"에서 GDPR 메시지 게시.
- 웹 광고를 켜려면: AdSense 가입 → 사이트 `languagebank.net` 추가·승인 → 반응형 디스플레이 광고 단위 하나 → Vercel에 위 두 값 넣고 재배포. 유럽·영국 동의창은 AdSense "개인 정보 보호 및 메시지"에서 켠다.
- 보상형을 다시 켜면: AdMob 보상형 단위에 서버 측 확인 URL `https://english-chat-mvp.vercel.app/api/ads/ssv`.
- 개발 중 실제 광고를 직접 누르지 않는다(계정 정지 위험) — 테스트는 `NEXT_PUBLIC_ADS_TEST=1` 빌드.

<!-- 자동: scripts/ads-map.mjs가 아래를 다시 쓴다. 손으로 고치지 않는다. -->

## 자동: 광고 자리 (코드에서)

### 전면 광고 (건너뛰기는 AdMob이 붙임)

| 순간 | 언제 | 부르는 곳 |
|---|---|---|
| `callEnd` | 끝까지 간 AI 통화(내가 한마디라도 함)의 끝 화면을 ✕·닫기로 닫을 때 — 끝 화면에 들어설 때·중단한 통화·포인트 없음·마이크 거부로 첫 차례에 끝난 통화·통화 정리·글자 숙제로 이어 갈 때는 없음(2026-11-09) | AI 통화 (어디서나 뜨는 층 CallHost `call` · `RoleplayScreen.tsx` |
| `chatLeave` | AI 채팅을 몇 번(설정 `interstitialAfterChats`) 보낸 뒤 채팅 화면을 떠나거나 대화를 끝낼 때 | 앱 틀 `shell` · `AppHome.tsx` ／ AI 채팅 (대화 → AI 튜터 줄) `chat` · `ChatWindow.tsx` |
| `flipEnd` | Languagebank 넘겨 보기 묶음을 끝까지 넘기고 끝 화면을 ✕·바깥으로 닫을 때 — ▶ Quizbank로 이어 갈 때·도중에 닫을 때는 없음(2026-11-09) | My 탭 `my` · `studyMap/BankFlip.tsx` |
| `homeworkEnd` | 수업 통화 숙제(퀴즈·대화)의 남은 반쪽을 끝까지 하고 닫을 때(숙제를 다 끝낸 자리) — 한쪽만 했을 때·통화 끝 화면 안 장면은 없음(2026-11-09) | AI 통화 (어디서나 뜨는 층 CallHost `call` · `roleplay/CallReplay.tsx` ／ My 탭 `my` · `studyMap/QuizPlayer.tsx` |
| `quizBreak` | Quizbank 칸 안에서 이어 푸는 퀴즈(InlineQuiz)가 10문제를 넘긴 뒤 다음 묶음으로 넘어갈 때 — 문제 도중·답 보기 중에는 없음(2026-11-01) | My 탭 `my` · `studyMap/InlineQuiz.tsx` |
| `roomLeave` | 공개 말하는 방에 몇 분(설정 `roomLeaveMinutes`) 넘게 있다 나올 때 — 1:1·단체방 통화는 제외 | Room 탭 `room` · `rooms/RoomsScreen.tsx` |
| `skillCheckEnd` | Logbank 📏 실력 확인(14일마다)의 결과(지난번 → 이번)를 보고 닫기를 누를 때 — 시험 도중·▶를 누를 때·처음 측정은 없음(2026-11-09) | My 탭 `my` · `studyMap/Logbank.tsx` |
| `videoLeave` | 영상을 몇 분(설정 `videoLeaveMinutes`) 넘게 보고 나올 때 | 영상 학습 탭 `video` · `videoLearning/VideoLearningTab.tsx` |

모든 전면 광고는 서로 3분(설정 `interstitialMinGapSeconds`) 안에 다시 뜨지 않고, 미리 받아 둔 광고가 있을 때만 뜬다.

### 네이티브 광고 (목록 사이·빈 공간, 앱 카드 모양)

| 화면(피드) | 자리 | 설명 | 영역 · 파일 |
|---|---|---|---|
| `call` | `call-live` | — | AI 통화 (어디서나 뜨는 층 CallHost `call` · `roleplay/CallParts.tsx` |
| `chat-locked` | `chat-locked` | AI 채팅 잠김 화면(입력칸 없음)의 빈 공간에 네이티브 하나(사용자 2026-11-01 예외) — 위 구독 버튼과 넉넉히 띄움. | AI 채팅 (대화 → AI 튜터 줄) `chat` · `ChatWindow.tsx` |
| `my-full` | `langbank-list` | Languagebank 맨 끝 네이티브 하나(색인·묶음·낱말 화면 아래 — 둘러보는 목록 끝, 바닥 칸·전체 화면 모두, 글자 연습 중에는 없음). | My 탭 `my` · `studyMap/LanguageBank.tsx` |
| `my-full` | `logbank-list` | Logbank 아래 네이티브 하나(바닥 칸·전체 화면 모두 — My 탭은 배너가 없어 한 화면에 광고 하나) — 둘러보는 목록 자리 규칙. | My 탭 `my` · `studyMap/Logbank.tsx` |
| `people-tab` | `board-after-3` | 세 번째 글 뒤에 네이티브 광고 하나(무료·안드로이드만, lib/ads.ts). 글을 열면 시트가 덮어 멈춘다. | 사람 탭 `people` · `rooms/BoardView.tsx` |
| `people-tab` | `people-after-4` | 네 번째 사람 뒤에 네이티브 광고 하나(무료·안드로이드만). 프로필을 열면 시트가 덮어 멈춘다. | 사람 탭 `people` · `rooms/RoomPeople.tsx` |
| `people-tab` | `people-login` | 로그인 전이면 로그인 카드 아래 빈 공간에 네이티브 하나(무료·안드로이드만) — 📞·로그인 버튼과 띄움. | 사람 탭 `people` · `rooms/PeopleTab.tsx` |
| `quiz-inline` | `${adKey}-${adRound}` | Quizbank 문제 아래 빈 공간에 네이티브 하나(바닥 칸·전체 화면 모두 — My 탭은 배너가 없어 한 화면에 광고 하나) — 입력칸·버튼과 한 줄 넘게 띄우고, 키보드가 올라오면 숨김, 문제가 바뀔 때 60초 넘었으면 새 광고. | My 탭 `my` · `studyMap/InlineQuiz.tsx` |
| `quiz-inline` | `lesson-${itemId}-${adRound}` | 수업 퀴즈 아래 빈 공간에 네이티브 하나(사용자 2026-11-01 ‘수업 퀴즈 단계에도’) — 버튼과 띄우고, 키보드가 올라오면 숨김, 문제가 바뀔 때 60초 넘었으면 새 광고. | My 탭 `my` · `studyMap/FrameLesson.tsx` |
| `results` | `call-end` | — | AI 통화 (어디서나 뜨는 층 CallHost `call` · `RoleplayScreen.tsx` |
| `results` | `flip-end` | — | My 탭 `my` · `studyMap/BankFlip.tsx` |
| `results` | `lesson-end-${itemId}` | 끝 화면 점수 아래 네이티브 하나(닫을 때 전면 없음 — 수업은 다른 흐름으로 돌아가는 도중) — 버튼과 한 줄 넘게 띄움. | My 탭 `my` · `studyMap/FrameLesson.tsx` |
| `results` | `letters-end` | 글자 퀴즈 끝 화면 아래 네이티브 하나(버튼과 한 줄 넘게 띄움). | My 탭 `my` · `studyMap/ScriptPractice.tsx` |
| `results` | `quiz-end-${seed}` | 끝 화면 점수 아래 네이티브 하나(숙제를 다 끝낸 퀴즈면 닫을 때 전면 homeworkEnd) — 버튼과 한 줄 넘게 띄움. | My 탭 `my` · `studyMap/QuizPlayer.tsx` |
| `results` | `replay-end-${scene.kind}` | — | AI 통화 (어디서나 뜨는 층 CallHost `call` · `roleplay/CallReplay.tsx` |
| `results` | `skill-check-end` | 📏 실력 확인 결과(14일마다 하는 시험의 끝) 아래 네이티브 하나 — 닫기 버튼과 한 줄 넘게 띄움. 처음 측정(설치 직후 온보딩)에는 없음. | My 탭 `my` · `studyMap/FirstCheck.tsx` |
| `room-lobby` | `room-lobby-after-2` | 두 번째 방 뒤에 네이티브 광고 하나(무료·안드로이드만). 방에 들어가면 방 화면이 덮어 멈춘다. | Room 탭 `room` · `rooms/RoomsScreen.tsx` |
| `room-lobby` | `room-lobby-after-5` | 다섯 번째 방 뒤에 하나 더(같은 피드 3개 한도 안, 2026-11-01). | Room 탭 `room` · `rooms/RoomsScreen.tsx` |
| `room-lobby` | `room-lobby-login` | 로그인 전이면 로그인 카드 아래 빈 공간에 네이티브 하나(무료·안드로이드만, 방 밖) — 버튼과 띄움. | Room 탭 `room` · `rooms/RoomsScreen.tsx` |
| `sheets` | `bank-help-${bank}` | 시트 맨 끝(그림·영상 아래) 네이티브 하나(2026-11-01 — 읽는 안내 시트, 시트가 맨 위 층일 때만). | My 탭 `my` · `studyMap/BankHelp.tsx` |
| `sheets` | `call-records` | 기록 목록 끝 네이티브 하나(둘러보는 목록 끝 — 기록이 있을 때만, 마지막 줄 버튼과 한 줄 넘게 띄움). | AI 통화 (어디서나 뜨는 층 CallHost `call` · `CallList.tsx` |
| `sheets` | `dictionary-sheet` | 사전 시트 아래 네이티브 하나(읽는 시트 끝 — My·Quizbank에서 열 때만, 대화·통화 위(above)에서는 없음: 쓰고 말하는 흐름 위라서). | My 탭 `my` · `studyMap/Dictionary.tsx` |
| `sheets` | `expression-card` | 예문 아래 네이티브 하나(읽는 카드 끝 — 대화·통화 위에서 연 카드(above)에는 없음). | My 탭 `my` · `studyMap/ExpressionCard.tsx` |
| `sheets` | `guide-end` | 장 본문 맨 끝 네이티브 하나(2026-11-01 — 읽는 안내 끝, 장 머리 스위치·‘이 화면으로 가기’와 떨어짐). 쓸 기능 고르기에는 없음. | 앱 틀 `shell` · `GuideSheet.tsx` |
| `sheets` | `homework-sheet` | 숙제 화면 아래 빈 곳 네이티브 하나(읽는 화면 끝 — 버튼과 한 줄 넘게 띄움, 위에 장면·퀴즈가 덮이면 뗌). | AI 통화 (어디서나 뜨는 층 CallHost `call` · `roleplay/CallReplay.tsx` |
| `sheets` | `log-sheet` | 그날·배운 것 세부 시트 끝 네이티브 하나(읽는 화면 끝). | My 탭 `my` · `studyMap/Logbank.tsx` |
| `talk-list` | `talk-after-account` | 로그인 전이면 계정 카드 아래에 네이티브 광고 하나(무료·안드로이드만). | 대화 탭 `talk` · `rooms/MessagesTab.tsx` |
| `talk-list` | `talk-between-lists` | — | 대화 탭 `talk` · `rooms/MessagesTab.tsx` |
| `video-library` | `video-library-after-3` | 세 번째 영상 뒤에 네이티브 광고 하나(무료·안드로이드만, lib/ads.ts). | 영상 학습 탭 `video` · `videoLearning/CatalogLibrary.tsx` |
| `video-library` | `video-library-after-8` | 여덟 번째 영상 뒤에 하나 더(2026-11-01 — 같은 피드 두 번째, 한 피드 3개 한도 안, 첫 광고와 한 화면에 안 겹침). | 영상 학습 탭 `video` · `videoLearning/CatalogLibrary.tsx` |

피드 10개, 자리 30개. 플러그인 한도: 한 피드에 광고 3개, 동시에 피드 2개 — 그래서 보이는 탭·맨 위 층에서만 붙이고 키보드가 올라오면 뗀다(`NativeAdSlot` `active`·층).

### 배너 · 앱 오프닝 · 보상형

- **배너**(하단 탭 바로 위): 영상 학습 `video` · 단어장 `vocab` · 대화 `talk` 탭에서만 (`AppHome.tsx` `BANNER_TABS`). 시트가 열리거나 글을 쓰는 동안 숨김.
- **앱 오프닝**: 앱을 켤 때·30분 넘게 떠났다 돌아올 때, 설치 3일 뒤부터 4시간에 한 번. 안 띄우는 탭: 통화 `roleplay` · Room `rooms` (`NO_APP_OPEN_TABS`).
- **보상형**: **꺼짐**(기본 하루 0번). 켜면 채팅 한도 안내에 "광고 보고 채팅 3번 더"(AdMob 서버 확인 `/api/ads/ssv`).

## 자동: 설정 (서버 `/api/ads/config`, 앱 빌드 없이 Vercel 환경 변수로)

| 설정 | 기본값 | 환경 변수 | 뜻 |
|---|---|---|---|
| `enabled` | 켬 | `ADS_ENABLED` | 꺼 두면 앱은 어떤 광고도 띄우지 않고, 보상도 주지 않는다. |
| `rewardChats` | 3 | `ADS_REWARD_CHATS` | 보상형 광고 한 번 = 채팅 몇 번. |
| `rewardedDailyMax` | 0 | `ADS_REWARDED_DAILY_MAX` | 보상형 광고를 하루 몇 번까지. |
| `interstitialMinGapSeconds` | 180 | `ADS_INTERSTITIAL_GAP_SECONDS` | 전면 광고 사이 최소 간격(초). |
| `interstitialAfterChats` | 2 | `ADS_INTERSTITIAL_AFTER_CHATS` | 채팅 화면을 나갈 때 전면 광고를 띄우려면 그 화면에서 이만큼은 보냈어야 한다. |
| `appOpenEnabled` | 켬 | `ADS_APP_OPEN` | 앱을 열 때 광고(앱 오프닝 형식). |
| `appOpenAfterDays` | 3 | `ADS_APP_OPEN_AFTER_DAYS` | 설치(이 기기에서 처음 연 날) 뒤 며칠이 지나야 앱 오프닝 광고를 띄우나 — 처음 쓰는 사람을 바로 놓치지 않게. |
| `appOpenGapHours` | 4 | `ADS_APP_OPEN_GAP_HOURS` | 앱 오프닝 광고 사이 최소 간격(시간). |
| `appOpenAwayMinutes` | 30 | `ADS_APP_OPEN_AWAY_MINUTES` | 다른 앱에 갔다 돌아올 때는 이만큼(분) 넘게 떠나 있었을 때만. |
| `bannerEnabled` | 켬 | `ADS_BANNER` | 둘러보는 화면(My·영상·대화 목록) 아래쪽 배너. 채팅·통화·말하는 방에는 없음. |
| `nativeEnabled` | 켬 | `ADS_NATIVE` | 목록 사이 네이티브 광고(앱 카드 모양, 대화·영상·게시판·사람·방 목록). |
| `roomLeaveMinutes` | 3 | `ADS_ROOM_LEAVE_MINUTES` | 공개 말하는 방에 이만큼(분) 넘게 있다 나오면 전면 광고. 0이면 끔. |
| `videoLeaveMinutes` | 2 | `ADS_VIDEO_LEAVE_MINUTES` | 영상을 이만큼(분) 넘게 보고 나오면 전면 광고. 0이면 끔. |

구독자(라이트·플러스·프리미엄)·iOS는 광고 없음, 웹은 목록 자리에 AdSense만(`src/lib/webAds.ts`, 값 넣기 전엔 꺼짐) — 서버가 `enabled: false`, 앱은 `platform.ts` `adsAvailable()`.

## 자동: 광고 단위 (AdMob, `ads.ts` `ADMOB_UNITS`)

| 형식 | 단위 ID |
|---|---|
| interstitial | `ca-app-pub-8959652589063151/2248687484` |
| rewarded | `ca-app-pub-8959652589063151/3513667692` |
| appOpen | `ca-app-pub-8959652589063151/5222510193` |
| banner | `ca-app-pub-8959652589063151/9312789287` |
| native | `ca-app-pub-8959652589063151/5493440106` |

## 자동: 수익 가정과 손익 (1달러 1,400원)

| 형식 | 1번 수익 낮음 ~ 높음 |
|---|---|
| rewarded | 11.2원 ~ 28.0원 |
| interstitial | 4.2원 ~ 14.0원 |
| appOpen | 2.8원 ~ 11.2원 |
| banner | 0.42원 ~ 1.4원 |
| native | 1.4원 ~ 5.6원 |

출처: 한국 AdMob eCPM 대략값(보상형 $8~20, 전면 $3~10), 가정 2026-10-18. AdMob 실제 eCPM이 쌓이면 `ads.ts` `AD_REVENUE_USD`를 고친다.

가상 사용자 손익(`hub/app/economics.md`, 결제 전환 3%): 가입자 1,000명당 한 달 단가 낮음 **−54,030원** · 중간 **+496,363원** · 높음 **+1,046,755원**.
무료 한 사람 한 달: 원가 519원, 광고 978원(중간) → +459원.

<!-- 자동 끝 -->
