# 지금 상태

> 모든 채팅이 시작할 때 자동으로 읽는 한 장입니다. 역할별 자세한 내용은
> `hub/roles/`, 역할 사이에 넘긴 일은 `hub/inbox.md`, 지난 기록은 `hub/log/`.
> 새 채팅이면 `hub/HANDOFF.md`(직전 채팅의 인계 노트)부터. 자동 실행이 남긴 보고·결정 대기는 `hub/reports.md`.
> 허브 쓰는 법: `hub/README.md`. 서비스 지도(구조도 + 화면 그림): https://claude.ai/artifact/NBkDqLoixshhxKugCtuR8y. 마지막 갱신: 2026-10-20(2.70 자름).

## 버전

| 항목 | 값 | 어디서 바꾸나 |
|---|---|---|
| Play에 올라간 앱 | 2.68 (versionCode 82) — 사용자 확인 2026-10-19 | `package.json` + `android/app/build.gradle` (둘이 같아야 빌드됨) |
| 서버 | main에 push하면 Vercel이 바로 배포 | — |
| 업데이트 권장 배너 기준 | 2.66 (2026-10-16) | `src/lib/appVersion.ts` `RECOMMENDED_APP_VERSION` |
| 최소 지원 버전 | 2.48 (올리면 그 아래는 앱을 못 씀, 거의 건드리지 않음) | 같은 파일 `MIN_SUPPORTED_APP_VERSION` |
| 다음 앱 버전 | 2.70 (versionCode 84) — 저장소에 올림(2026-10-20). 2.69(83)는 Play에 안 올리고 2.70에 합침(새로워진 점 2.70 2장 + 2.69 6장). 출시 노트 84는 PR, 빌드·내부 테스트 대기 | — |
| iOS | TestFlight 2.70 빌드 84.7(2026-10-20) — 아이폰 13 mini에서 화면·영상·통화(받아쓰기·말 끝·튜터 목소리) 사용자 확인. 말하는 방·메시지·Google 로그인 없는 1차, 결제·심사 정책 손볼 것 남음(`hub/drafts/ios-launch.md`) | `npm run build:ios`, `hub/drafts/ios-launch.md` |

## 역할

| 역할 | 파일 | 시작 명령 |
|---|---|---|
| 기능 개발 | `hub/roles/dev.md` | `/hub-dev` |
| 내부 점검 | `hub/roles/qa.md` | `/hub-qa` |
| 스토어·출시 | `hub/roles/store.md` | `/hub-store` |

## 계속 지키는 결정

앱이 무엇이고 무엇을 지키는지는 `PRODUCT.md`(핵심 가치·화면·기능·대표 장면). 아래는 그중 자주 잊는 것.

- 답은 한국어로. 사용자는 바쁘니 결과 위주로 짧게.
- 학습 수준(A1·B2 같은 레벨)은 보여주지 않는다. 문장마다 틀린 점·부족한 점만
  짚고, 학습 상태는 지도에서 누적 데이터로 보여준다.
- 채팅 차감은 언어와 상관없이 보낸 메시지 수로 센다.
- 채팅은 입력창 하나: 학습 언어로 쓰면 대화, 편한 말로 쓰면 튜터는 학습 언어로
  이어가고 그 줄 아래 "표현 보기"를 눌러야 표현 카드를 불러온다.
- 새 기능은 영어/한국어 밖의 언어 조합으로도 확인한다 (AGENTS.md "Language combinations").
- 브라우저 확인은 커밋·푸시할 때만, 끝에 "다음 날 확인"을 남긴다 (AGENTS.md).
- 앱 업데이트마다 "새로워진 점" 안내를 UI 언어별 캡처와 함께 띄운다
  (`src/lib/whatsNew.ts`, `scripts/capture-whats-new.mjs`).
- 앱 ID `com.yourname.englishchat`는 바꿀 수 없다 (Play에 묶여 있음).
- Play 출시·서명은 사람이 한다. Claude는 파일과 PR까지 (`fastlane/STORE_AUTOMATION.md`).
- 요금 개편 최종(2026-10-16, `hub/drafts/pricing-2026-10.md` "최종"·"구현", 서버 반영·앱 2.67): 3,900 / 5,500원 새 상품 + 기존 `premium_monthly`를 8,900원으로.
  매일 자유 통화 7 / 10 / 15분(오늘의 팩 별도, 하루 리셋·이월 없음), 넘으면 구매 포인트, 채팅 하루 10 / 30 / 50 / 100번,
  8,900원만 이달의 영상 전체·추가 팩 2번. 8,900원 혜택 전환은 Play 가격 변경일에 `PREMIUM_DAILY_PLAN_FROM`(`src/lib/billing/plans.ts`)을 켠다 — 그때까지 프리미엄은 9,900원·80포인트 그대로.

- 스크린샷 모음(2026-10-20): https://claude.ai/artifact/VP562k9QhrFiybAYv4ggbW — 모든 채팅이 찍은 화면을 올리고(`hub/SHOTS.md`), 사용자가 사용법 칸에 넣을 그림을 고른다.

## 사용자에게 물어볼 것

- iOS(`hub/drafts/ios-launch.md` "출시까지 남은 사람 일"): 정함(2026-10-20) — 번들 ID는 안드로이드와 같은 `com.yourname.englishchat`, 구독·포인트 상품 ID도 같게, 다른 스토어 구독자는 결제 막음.
  App Store Connect 구독 3·포인트 4, RevenueCat 아이폰 앱·권한·offering 패키지(lite·plus·premium) 설정 끝. 남은 것: GitHub ios 환경에 `NEXT_PUBLIC_REVENUECAT_IOS_API_KEY`, 상품 한국어 이름·심사 스크린샷, 아이콘, 유료 앱 계약.
- 비용 표(`hub/costs.md`, 자동 계산, 2026-10-21 다시 계산): 한도까지 매일 다 쓰면 유료 요금 모두 손해(라이트 −741원 ~ 8,900원 −2,953원/월, 지금 프리미엄 −92원). 채팅 한 통은 보통 0.8원·최악 1.1원(전엔 2원 — 뒤따르는 두 호출 토큰을 프롬프트 길이로 다시 어림 + 짧고 맞은 줄 건너뛰기). 아직 가정이라 `cost-report.mjs` 실측(사용자 PC, KV 키)으로 확인할지.
  광고는 무료 사용자에게만 붙어(구독자 광고 없음) 유료 손해와는 별개 — 광고 수익·보상 원가는 `hub/costs.md` "광고" 절(2026-10-20부터 자동 계산).
- 광고(`hub/drafts/ads-rewarded.md`): **넣음(2026-10-20)** — 서버 반영, 앱은 다음 빌드. 지금 값: **보상형 끔**(사용자 2026-10-20 "광고 보고 더 주는 건 거부감, 그냥 뜨고 건너뛰는 게 낫다"), 전면 채팅 2번 뒤·3분 간격, 앱 오프닝·배너·네이티브 켬 — Vercel `ADS_*`로 조정(보상형 다시 켜기 `ADS_REWARDED_DAILY_MAX=3`). 빌드를 Play에 올리기 전에 Play 광고·데이터 보안 신고(inbox store).
- 제휴 상품 카드(`hub/drafts/coupang-affiliate.md`): **보류(2026-10-20)**. 한국 쿠팡 + 해외(Amazon·Rakuten·Shopee·Lazada·AliExpress·Mercado Livre·Noon) + 여행(Klook·Agoda·Airalo) 조사해 둠. 문서의 "꺼낼 때" 조건(학습 주제 카드 자리 생김, 한국어 무료 월 1,000명, 한 나라 설치 10%, AdMob 단가 낮음, 게시판 활발)이 보이면 **먼저 사용자에게 알린다**.
- 영상통화 워크스페이스(`hub/drafts/video-workspace.md`): **1단계 1:1 만듦(2026-10-20)** — 1:1 대화·러닝메이트 📞에 카메라(기본 꺼짐), 서버 반영·앱 다음 빌드. 중계(Cloudflare TURN) 켜짐·운영 확인(2026-10-20, 사용자가 Vercel에 키). 남은 결정: 무료/구독 구분(지금은 모두), 2단계 팀 영상 4명.
- 창구(`hub/drafts/doors.md`): **Moyeo 단체통화 열림(2026-10-20)** — `call.languagebank.net` 연결·폰(LTE)에서 소개 페이지 확인(사용자). 남은 사람 일: Google OAuth 원본에 이 주소, 서치 콘솔 등록. **Pingo 1:1 대화(랜덤채팅 1단계) 열림(2026-10-21)** — `talk.languagebank.net` 연결·소개 페이지·창구 모드 확인. 남은 사람 일(두 창구 공통): Google OAuth 원본, 서치 콘솔. 2단계 본인인증 "바로 연결"은 본인인증 업체 계약 뒤.
- 랜덤 창구 **Spin**(`spin.languagebank.net`, `hub/drafts/doors.md` "랜덤 창구 Spin"): **코드 끝, 스위치 꺼짐(2026-10-21)** — 성인인증한 사람끼리 랜덤 채팅·영상, 웹만. 켜기 전 사람 일: 사업자·포트원 본인인증 계약·법률 확인·도메인·`RANDOM_ENABLED=1`.
- 운영자 신고함 `/ops`(2026-10-21 만듦): 키는 Vercel `OPS_KEY`(새로 정해 넣기 권장), 넣기 전엔 의견함 읽기 키로 열림. https://www.languagebank.net/ops — 사람 기능 정지·랜덤 멈춤/막기·처리함.
- **모델 종료(2026-10-21 확인, 전체 목록·대체 후보 `hub/MODELS.md`, 매주 월요일 예약 작업 "AI 모델 살피기"가 갱신·알림):** 가장 먼저 **통화 돌아보기 gpt-5-mini 2026-12-11**, 목소리 gpt-4o-mini-tts **2027-01-06**, 받아쓰기 whisper-1·gpt-4o-mini-transcribe **2027-02-26**. OpenAI가 gpt-4o-mini(채팅 등)·gpt-4.1·gpt-4.1-mini(지도·미션·표현 묻기 등) 종료를 **2027-01-14**로 발표. 교정 비교(`hub/drafts/correction-models-2026-10-21.md`)에서 Claude Haiku 5.5가 지금보다 싸고 더 정확 — 사용자 결정(2026-10-21): 기본 Haiku 5.5, 중요한 기능만 고가 모델. **1단계 끝** — 모든 글 모델 호출이 `src/lib/server/llm.ts` 표를 거침(지금은 예전 모델 그대로, Vercel `MODEL_ROUTES`로 기능·등급별 전환). 2단계에 필요한 사람 일: Vercel `ANTHROPIC_API_KEY`.
- 흑자 구조(`hub/drafts/pricing-profit-2026-10-20.md`): **①②③ 넣음(2026-10-20, 서버 반영)** — 무료 채팅 7·팩 주 2번·AI 도움 20·광고 조정. 남은 결정: 빠른·직접 질문을 AI 도움에 합칠지, ④ 유료 모듈형.
