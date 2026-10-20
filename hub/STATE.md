# 지금 상태

> 모든 채팅이 시작할 때 자동으로 읽는 한 장입니다. 역할별 자세한 내용은
> `hub/roles/`, 역할 사이에 넘긴 일은 `hub/inbox.md`, 지난 기록은 `hub/log/`.
> 새 채팅이면 `hub/HANDOFF.md`(직전 채팅의 인계 노트)부터. 자동 실행이 남긴 보고·결정 대기는 `hub/reports.md`.
> 허브 쓰는 법: `hub/README.md`. 마지막 갱신: 2026-10-20(2.70 자름).

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

## 사용자에게 물어볼 것

- iOS(`hub/drafts/ios-launch.md` "출시까지 남은 사람 일"): 정함(2026-10-20) — 번들 ID는 안드로이드와 같은 `com.yourname.englishchat`, 구독·포인트 상품 ID도 같게, 다른 스토어 구독자는 결제 막음.
  App Store Connect 구독 3·포인트 4, RevenueCat 아이폰 앱·권한·offering 패키지(lite·plus·premium) 설정 끝. 남은 것: GitHub ios 환경에 `NEXT_PUBLIC_REVENUECAT_IOS_API_KEY`, 상품 한국어 이름·심사 스크린샷, 아이콘, 유료 앱 계약.
- 비용 표(`hub/costs.md`, 자동 계산)에서 채팅 한도까지 매일 다 쓰면 유료 요금 모두 손해(라이트 −1,243원 ~ 8,900원 −4,727원/월). 채팅 한 통 2원은 가정이라, 2.67 출시 1주 뒤 실측 토큰으로 확인하고 한도를 다시 볼지.
  광고는 무료 사용자에게만 붙어(구독자 광고 없음) 유료 손해와는 별개 — 광고 수익·보상 원가는 `hub/costs.md` "광고" 절(2026-10-20부터 자동 계산).
- 광고(`hub/drafts/ads-rewarded.md`): **넣음(2026-10-20)** — 서버 반영, 앱은 다음 빌드. 지금 값: **보상형 끔**(사용자 2026-10-20 "광고 보고 더 주는 건 거부감, 그냥 뜨고 건너뛰는 게 낫다"), 전면 채팅 2번 뒤·3분 간격, 앱 오프닝·배너·네이티브 켬 — Vercel `ADS_*`로 조정(보상형 다시 켜기 `ADS_REWARDED_DAILY_MAX=3`). 빌드를 Play에 올리기 전에 Play 광고·데이터 보안 신고(inbox store).
- 쿠팡 파트너스 상품 카드(`hub/drafts/coupang-affiliate.md`, 설계안·구현 없음): 1단계 게시판·학습 주제·Room(공개 것만, 한국어 UI 무료) → 결과 보고 → 1:1·단체방은 옵트인·기기 안 맞춤으로 마지막. 먼저 쿠팡 파트너스 가입·승인·약관 확인(사람).
- 흑자 구조(`hub/drafts/pricing-profit-2026-10-20.md`): **①②③ 넣음(2026-10-20, 서버 반영)** — 무료 채팅 7·팩 주 2번·AI 도움 20·광고 조정. 남은 결정: 빠른·직접 질문을 AI 도움에 합칠지, ④ 유료 모듈형.
