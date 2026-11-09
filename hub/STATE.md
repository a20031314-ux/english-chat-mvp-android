# 지금 상태

> 모든 채팅이 시작할 때 자동으로 읽는 한 장 — **지금 것만**(RULES "기능·이름·옛 것" 4). 결정 경위·예전 것은 `hub/chat/log/`, 2026-11-09까지의 긴 판은 `hub/archive/STATE-2026-11-09.md`.
> 새 채팅이면 탭 번호(`hub/chat/tabs.md` — 1 메인·2 My·3 AI·4 사람·5 점검·6 스토어): "N번 받기" → `hub/chat/handoff/N.md`, 길어지면 `/pass N`. 역할별은 `hub/work/roles/`, 넘긴 일은 `hub/work/inbox.md`, 자동 실행 보고·결정 대기는 `hub/work/reports.md`.
> 기능 이름·코드는 `hub/app/FEATURES.md`, 화면 흐름은 `hub/app/STRUCTURE.md`, 제품은 `PRODUCT.md`. 서비스 지도: https://claude.ai/artifact/NBkDqLoixshhxKugCtuR8y. 마지막 갱신: 2026-11-09.

## 버전

| 항목 | 값 | 어디서 바꾸나 |
|---|---|---|
| Play에 올라간 앱 | **2.79 (versionCode 93)** — My는 예전 Stagebank 화면 | `package.json` + `android/app/build.gradle` (둘이 같아야 빌드됨) |
| 다음 앱 버전 | **2.80 (versionCode 94) — 아직 안 자름.** My = Logbank · Quizbank · Languagebank(개편이 모두에게, 예전 My 화면 코드 지움 2026-11-09), 통화 문 넷·숙제, 사전 주석·넘겨 보기, 학습 타임라인 | — |
| 서버 | main에 push하면 Vercel이 바로 배포(웹·시험 앱 껍데기도 바로 새 화면) | — |
| 업데이트 권장 배너 기준 | 2.66 | `src/lib/appVersion.ts` `RECOMMENDED_APP_VERSION` |
| 최소 지원 버전 | 2.48 — 올리면 `hub/app/FEATURES.md` "옛 앱 전용" 서버를 지울 수 있음 | 같은 파일 `MIN_SUPPORTED_APP_VERSION` |
| iOS | 1차 = 다음 안드로이드 출시와 같은 커밋 — **통화·포인트 켬**(사용자 2026-11-09), 사람 기능 끔. 다음: 진단 TestFlight로 기기 기능 점검. 순서·점검 목록 `hub/work/drafts/ios-launch.md` "다시 정함 3". 앱 ID 6824542951 | `npm run build:ios` |

## 역할

| 역할 | 파일 | 시작 명령 |
|---|---|---|
| 기능 개발 | `hub/work/roles/dev.md` | `/hub-dev` |
| 내부 점검 | `hub/work/roles/qa.md` | `/hub-qa` |
| 스토어·출시 | `hub/work/roles/store.md` | `/hub-store` |

## 계속 지키는 결정

- **한 기능 = 한 이름, 옛 것은 같은 커밋에서 지움, 문서는 지금만**(사용자 2026-11-09): RULES 맨 위 절 · `hub/app/FEATURES.md` · CI `npm run check:features`.
- **바꾸기 전 적용 범위, 다른 탭엔 확인 요청, 옛 코드는 지우거나 사용자에게**(사용자 2026-11-09): `scripts/scope.mjs` · `scripts/asks.mjs`(`hub/chat/ASKS.md`) · `scripts/leftovers.mjs` — 끝내기 훅·CI가 막는다.
- **허브 = 채팅 운영 `hub/chat/` · 할 일 `hub/work/` · 앱 구조 `hub/app/`**(사용자 2026-11-09).
- **답은 한국어로, 결과 위주로 짧게.** 바로 반영(서버)과 앱 빌드가 필요한 것을 나눠 말한다.
- **My = Logbank · Quizbank · Languagebank**(사용자 2026-11-03·11-09): Logbank 첫 칸(오늘 ▶ Quizbank 하나 — 복습·새로 학습 갈래 이름 없음, 사용자 2026-11-09 · 배운 것 표·학습 타임라인 — %·띠·육각형 없음), Quizbank 한 흐름, Languagebank 사전. 단계 사다리·오늘 할 것·대본은 없다. 학습 언어로 처음 My를 열면 첫 측정.
- **아는 정도 = 퀴즈에서 있었던 일만**(사용자 2026-11-09): 학습 · n번 학습(+ 마지막이 틀렸으면 ✗). 체크 셋(처음 봄·적용이 힘듦·앎)과 복습은 퀴즈 순서·날짜 계산에만, 화면 이름 없음. 학습 수준(A1·초급) 표시 없음.
- **앎(어휘)과 말하기(실제 출력)는 따로**(사용자 2026-11-09): 표시·체크 셋·문제 모양은 퀴즈 답만, 통화·채팅·사람 대화는 카드의 쓴 곳·Logbank 활용 칸·활용 누적에만(맞나 틀리나는 학습에만). 수준은 Logbank 📏 실력 확인으로 14일마다 — 단어·표현·문법은 짧은 시험, 말하기는 대화 장부, 지난번과 나란히(레벨 이름 없이 숫자·단계만, 사용자 2026-11-09). Languagebank 칠하기는 그 추정(숫자는 개수만), 학습(퀴즈 기록)은 단어 카드에만(사용자 2026-11-09).
- **배우기 → 써 보기 → 기록**: Quizbank·Languagebank·소재 수업에서 배우고, 채팅·통화·사람 대화에서 써 보고, Logbank가 한 장부로. 대화에서 막힌 것은 다시 퀴즈로.
- **통화 문 넷 같은 층**(사용자 2026-11-09): 📞 자유대화 · 🎓 수업 · 🎲 게임(스무고개) · 🧑‍🏫 가르치기 — 튜터 줄·튜터 프로필·사람 탭 같은 모양. 자유대화 교정은 화면 카드로만, 수업은 튜터가 짚고 숙제 [퀴즈 | 대화].
- **채팅은 입력창 하나:** 학습 언어로 쓰면 대화, 편한 말로 쓰면 튜터가 학습 언어로 잇고 "표현 보기"를 눌러야 표현 카드. 내 말도 하는 튜터는 옵션(⋮ "튜터가 쓰는 말"). 채팅 차감은 언어와 상관없이 보낸 메시지 수.
- **화면엔 이름·숫자·상태만**, 설명은 사용법(?)에만, 정책은 처리방침에만(RULES 4).
- **새 기능은 영어/한국어 밖의 언어 조합으로도 확인**(AGENTS.md "Language combinations"). 브라우저 확인은 커밋·푸시할 때만, 끝에 "다음 날 확인".
- **사용자 체감 점검·고정 문장 생성은 Cursor 구독 에이전트가 먼저**(사용자 2026-11-04): `scripts/ux-check/`, 인물 세션과 판정 세션은 나눈다. 크레딧 API는 이미 돌아가는 서버 기능에만.
- **학습자 문장은 서버에 남기지 않는다**(예외: 의견 보내기 90일, 튜터가 고친 줄 카드). 새로 남기려면 사용자에게 먼저.
- **요금**(사용자 2026-11-02): 무료(My + 맛보기 통화 평생 10분·채팅 평생 10통 + 광고) · 라이트 4,900원(매일 7분·30통) · 플러스 6,500원(10분·50통) · 프리미엄 12,900원(30분·100통·이달의 영상 전체), 넘으면 구매 포인트. 대본 플랜은 새로 팔지 않음(사용자 2026-11-08). 손익 `hub/app/economics.md`.
- **광고:** 무료·안드로이드만. 보상형 끔(사용자 2026-10-20), 전면은 끝나는 자리에만, 값은 Vercel `ADS_*`. 지도 `hub/app/ADS.md`.
- **모델:** 글 모델은 기능마다 `server/llm.ts` 표로 — 기본 Claude Haiku 5.5, 판단·수업 쓰기·확인은 Sonnet 5.5, 통화 튜터는 OpenAI 실시간, 목소리 Voxtral(id·th 제외). 종료 일정·대체 `hub/app/MODELS.md`(매주 월요일 예약 작업이 갱신).
- **의견 반영 보상:** 반영된 의견에 운영자가 3~20P(같은 의견은 먼저 보낸 3명까지, 한 사람 한 달 40P까지).
- **홍보:** 유튜브·틱톡 쇼츠, 채널은 앱 언어별, 핵심은 "언어 학습 앱"(배우는 언어 고정 안 함). 만들기 전에 최신 체감 점검을 읽는다. 영상 도구 `store-shots/promo/`.
- **사람 탭 예시 프로필**(사용자 2026-10-23 "놔둬"): Omar `lb_dd696b8057c45a517210e18f` · Yuki `lb_a5a921d2a243bd334bf2721a` · 민지 `lb_5a67cb766430f8879e2a6d27` — 지우거나 숨기지 않고, 점검이 "남은 시험 계정"으로 보고하지 않는다. 그 밖의 확인용 계정은 끝날 때 지운다.
- **바꿀 수 없는 것·사람이 하는 것:** 앱 ID `com.yourname.englishchat`. Play 출시·서명·상품 가격 변경은 사람(Claude는 파일과 PR까지, `fastlane/STORE_AUTOMATION.md`).
- 앱 업데이트마다 "새로워진 점"을 UI 언어별 캡처와 함께(`src/lib/whatsNew.ts`). 찍은 스크린샷은 모음 페이지에(`hub/work/SHOTS.md`, https://claude.ai/artifact/VP562k9QhrFiybAYv4ggbW).

## 정해진 설정 (사람이 한 것)

- Vercel Pro(지출 상한 Settings → Billing), Upstash 종량제, Vercel `OPS_KEY`, Moyeo·Pingo Google OAuth 원본·서치 콘솔, AdSense 값, Play 광고·데이터 보안 신고, iOS RevenueCat 설정, Cloudflare TURN 키, Anthropic 키.
- 창구 Moyeo(`call.`)·Pingo(`talk.`) 열림. Spin(`spin.`)은 코드 끝·스위치 꺼짐 — 켜려면 사업자·포트원 본인인증 계약·법률 확인·`RANDOM_ENABLED=1`.
- 운영자 신고함 https://www.languagebank.net/ops.

## 결정 대기 (사용자)

- **2.80 자르기 전:** Play·App Store 가격 변경(라이트 4,900·플러스 6,500·프리미엄 12,900)과 기존 구독자 가격 유지 여부, 대본 플랜 판매 중지 처리(inbox store).
- **My(탭 2, `hub/chat/handoff/2.md`):** 수준 측정 되살리기(①% ②2주마다 짧은 시험 — 어휘 쪽 ③둘 다) · 수업 통화를 장부 `call` 대신 학습으로 셀지 · 말하기 숫자를 Logbank에 따로 보일지 · 칸 설명(?)·사용법 My 장을 지금 흐름으로 새로 쓸지.
- **AI(탭 3, `hub/chat/handoff/3.md`):** 튜터 목소리 늘리기 · 사용자가 튜터 만들기 · 통화 고친 말 "틀림/다듬기" 나누기.
- 영상통화 무료/구독 구분·팀 영상 4명, 제휴 상품 카드(보류 — `hub/work/drafts/coupang-affiliate.md`의 꺼낼 조건이 보이면 먼저 알린다), 흑자 구조 ④ 유료 모듈형.
