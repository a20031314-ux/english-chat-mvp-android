# 지금 상태

> 모든 채팅이 시작할 때 자동으로 읽는 한 장입니다. 역할별 자세한 내용은
> `hub/roles/`, 역할 사이에 넘긴 일은 `hub/inbox.md`, 지난 기록은 `hub/log/`.
> 새 채팅이면 `hub/HANDOFF.md`(직전 채팅의 인계 노트)부터. 자동 실행이 남긴 보고·결정 대기는 `hub/reports.md`.
> 허브 쓰는 법: `hub/README.md`. 서비스 지도(구조도 + 화면 그림): https://claude.ai/artifact/NBkDqLoixshhxKugCtuR8y. 마지막 갱신: 2026-10-22(2.70 업로드·사람 설정 끝).

## 버전

| 항목 | 값 | 어디서 바꾸나 |
|---|---|---|
| Play에 올라간 앱 | 2.68 (versionCode 82) — 사용자 확인 2026-10-19 | `package.json` + `android/app/build.gradle` (둘이 같아야 빌드됨) |
| 서버 | main에 push하면 Vercel이 바로 배포 | — |
| 업데이트 권장 배너 기준 | 2.66 (2026-10-16) | `src/lib/appVersion.ts` `RECOMMENDED_APP_VERSION` |
| 최소 지원 버전 | 2.48 (올리면 그 아래는 앱을 못 씀, 거의 건드리지 않음) | 같은 파일 `MIN_SUPPORTED_APP_VERSION` |
| 다음 앱 버전 | 2.71 (versionCode 85) — **자름(2026-10-22, 가상 사용자 전체 점검 뒤)**: My 대화 예시로 시작·채팅 고친 문장 눌러서 보기·Room 내 줄 교정·1:1 카메라·아랍어 카드. 새로워진 점 2장, 출시 노트 85 PR. 빌드·Play 업로드는 사람(`npm run pc:build`). 2.70(84)은 Play에 올림(사용자 2026-10-22), 트랙·공개 여부는 사용자 확인 | — |
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
  8,900원만 이달의 영상 전체·추가 팩 2번. **프리미엄 하루 시간 방식 켬(2026-10-23, 사용자 "바꿔줘")** — `PREMIUM_DAILY_PLAN_FROM="2026-10-22"`(UTC), Play·App Store 프리미엄 가격 8,900원은 사람이 같은 날. 10월은 80포인트 유지, 11월부터 없음.

- 스크린샷 모음(2026-10-20): https://claude.ai/artifact/VP562k9QhrFiybAYv4ggbW — 모든 채팅이 찍은 화면을 올리고(`hub/SHOTS.md`), 사용자가 사용법 칸에 넣을 그림을 고른다.

## 사용자에게 물어볼 것

- **사람 설정 끝(사용자 2026-10-22):** Vercel `OPS_KEY`, Moyeo·Pingo Google OAuth 원본·서치 콘솔, AdSense 값, Play 광고·데이터 보안 신고, iOS RevenueCat 키. 프리미엄 8,900원 전환도 켬(2026-10-23) — 아래 줄의 "남은 사람 일"은 이 줄이 앞선다.

- **요금제(사용자 2026-10-22):** **Vercel Pro로 올림**(지출 상한은 Settings → Billing → Spend Management) · Upstash 종량제(10만 명령당 $0.2, 월 한도 없음 — 예산 상한을 걸면 닿을 때 느려지니 넉넉히, 초당 1만 명령이 한 DB의 상한: 부하 점검 기준 방에 동시 약 600명이면 닿음).
- iOS(`hub/drafts/ios-launch.md` "출시까지 남은 사람 일"): 정함(2026-10-20) — 번들 ID는 안드로이드와 같은 `com.yourname.englishchat`, 구독·포인트 상품 ID도 같게, 다른 스토어 구독자는 결제 막음.
  App Store Connect 구독 3·포인트 4, RevenueCat 아이폰 앱·권한·offering 패키지(lite·plus·premium) 설정 끝. 남은 것: GitHub ios 환경에 `NEXT_PUBLIC_REVENUECAT_IOS_API_KEY`, 상품 한국어 이름·심사 스크린샷, 아이콘, 유료 앱 계약.
- 비용 표(`hub/costs.md`, 자동 계산 — 2026-10-22부터 **코드의 기본 모델에서 단가를 읽음**, `src/lib/aiDefaults.ts`·`modelPrices.ts`): 한도까지 매일 다 쓰면 유료 요금 모두 손해(라이트 −714원 ~ 8,900원 −2,865원/월, 지금 프리미엄 −4원 — 2026-10-22 글 기능 Haiku 이전 뒤). 채팅 한 통 보통 0.9원·최악 1.1원. 교체안: `hub/drafts/model-switch-2026-10-22.md`. 아직 가정이라 `cost-report.mjs` 실측(사용자 PC, KV 키)으로 확인할지.
  광고는 무료 사용자에게만 붙어(구독자 광고 없음) 유료 손해와는 별개 — 광고 수익·보상 원가는 `hub/costs.md` "광고" 절(2026-10-20부터 자동 계산).
- 광고(`hub/drafts/ads-rewarded.md`): **넣음(2026-10-20)** — 서버 반영, 앱은 다음 빌드. 지금 값: **보상형 끔**(사용자 2026-10-20 "광고 보고 더 주는 건 거부감, 그냥 뜨고 건너뛰는 게 낫다"), 전면 채팅 2번 뒤·3분 간격, 앱 오프닝·배너·네이티브 켬 — Vercel `ADS_*`로 조정(보상형 다시 켜기 `ADS_REWARDED_DAILY_MAX=3`). 빌드를 Play에 올리기 전에 Play 광고·데이터 보안 신고(inbox store).
- 제휴 상품 카드(`hub/drafts/coupang-affiliate.md`): **보류(2026-10-20)**. 한국 쿠팡 + 해외(Amazon·Rakuten·Shopee·Lazada·AliExpress·Mercado Livre·Noon) + 여행(Klook·Agoda·Airalo) 조사해 둠. 문서의 "꺼낼 때" 조건(학습 주제 카드 자리 생김, 한국어 무료 월 1,000명, 한 나라 설치 10%, AdMob 단가 낮음, 게시판 활발)이 보이면 **먼저 사용자에게 알린다**.
- 영상통화 워크스페이스(`hub/drafts/video-workspace.md`): **1단계 1:1 만듦(2026-10-20)** — 1:1 대화·러닝메이트 📞에 카메라(기본 꺼짐), 서버 반영·앱 다음 빌드. 중계(Cloudflare TURN) 켜짐·운영 확인(2026-10-20, 사용자가 Vercel에 키). 남은 결정: 무료/구독 구분(지금은 모두), 2단계 팀 영상 4명.
- 창구(`hub/drafts/doors.md`): **Moyeo 단체통화 열림(2026-10-20)** — `call.languagebank.net` 연결·폰(LTE)에서 소개 페이지 확인(사용자). 남은 사람 일: Google OAuth 원본에 이 주소, 서치 콘솔 등록. **Pingo 1:1 대화(랜덤채팅 1단계) 열림(2026-10-21)** — `talk.languagebank.net` 연결·소개 페이지·창구 모드 확인. 남은 사람 일(두 창구 공통): Google OAuth 원본, 서치 콘솔. 2단계 본인인증 "바로 연결"은 본인인증 업체 계약 뒤.
- 랜덤 창구 **Spin**(`spin.languagebank.net`, `hub/drafts/doors.md` "랜덤 창구 Spin"): **코드 끝, 스위치 꺼짐(2026-10-21)** — 성인인증한 사람끼리 랜덤 채팅·영상, 웹만. 켜기 전 사람 일: 사업자·포트원 본인인증 계약·법률 확인·도메인·`RANDOM_ENABLED=1`.
- 운영자 신고함 `/ops`(2026-10-21 만듦): 키는 Vercel `OPS_KEY`(새로 정해 넣기 권장), 넣기 전엔 의견함 읽기 키로 열림. https://www.languagebank.net/ops — 사람 기능 정지·랜덤 멈춤/막기·처리함.
- **모델 종료(2026-10-21 확인, 전체 목록·대체 후보 `hub/MODELS.md`, 매주 월요일 예약 작업 "AI 모델 살피기"가 갱신·알림):** 가장 먼저 **통화 돌아보기 gpt-5-mini 2026-12-11**, 목소리 gpt-4o-mini-tts **2027-01-06**, 받아쓰기 whisper-1·gpt-4o-mini-transcribe **2027-02-26**. 목소리·받아쓰기 새 모델 운영 비교 끝(`hub/drafts/speech-models-2026-10-21.md`): 둘 다 품질 같음, 비용 목소리 1.8배·받아쓰기 1.5배 — 사용자가 목소리 샘플 듣고 OK하면 기본값 전환. 영상 받아쓰기는 시간 정보 때문에 따로 설계. OpenAI가 gpt-4o-mini(채팅 등)·gpt-4.1·gpt-4.1-mini(지도·미션·표현 묻기 등) 종료를 **2027-01-14**로 발표. 교정 비교(`hub/drafts/correction-models-2026-10-21.md`)에서 Claude Haiku 5.5가 지금보다 싸고 더 정확 — 사용자 결정(2026-10-21): 기본 Haiku 5.5, 중요한 기능만 고가 모델. **1단계 끝** — 모든 글 모델 호출이 `src/lib/server/llm.ts` 표를 거침(지금은 예전 모델 그대로, Vercel `MODEL_ROUTES`로 기능·등급별 전환). Anthropic 키 넣음(2026-10-21). **Haiku 전환 함(2026-10-22, 사용자 결정, 서버만):** 채팅(교정 + 답)·표현 카드(howToSay)가 Claude Haiku 5.5 — `llm.ts` `DEFAULT_ROUTES`(코드 기본값, Vercel 값 없이). 옛 앱(스트림 없음)은 Haiku일 때 다시 답하기를 뺌(약 4.5 → 2초). 근거: 큰 문제 6~10% → 4.5%, 답 2.0 → 1.7초(`correction-models` "고친 뒤 다시 비교"). **되돌리기:** Vercel `MODEL_ROUTES={"chat":"openai: gpt-4o-mini","howToSay":"openai: gpt-4o-mini"}`. **나머지도 옮김(2026-10-22, 사용자 "다 옮겨줘"):** 번역·단어·문장분석·표현 자세히·노트·My 묻기·상황 만들기·영상·장면 보기·다시 말해보기·학습자 읽기·표현 묻기 → Haiku, 통화 돌아보기 → Sonnet. **My 지도 그리기는 Sonnet**(대화 예시로 고른 단계 범위, 먼저 생각 — 36~52초, 10/10). 그대로 OpenAI: 미션 쓰기·지도에 넣기·미션 확인, 통화 튜터(스트리밍 OpenAI만) — 01-14 전에 따로. Sonnet JSON 호출은 앞 생각 끔(`between_tools`). 비용 표 최악: 라이트 −714원·프리미엄(지금) −4원/월. 전환 뒤 고칠 목록: 표현 카드 주어 바뀜, "커피가 마시고 싶어요" 과잉 교정, 영어 단골 실수 natural에만(감정 형용사 -ing/-ed는 고침 2026-10-22, "explain me"류 동사 꼴도 고침). 확인 모델은 Sonnet 5.5(결정 2026-10-21, **코드 기본값으로 넣음 2026-10-22** — 되돌리기 `MODEL_ROUTES={"chatVerify":"openai: gpt-4.1"}`). 방 내 줄 교정도 Haiku(`roomFix`). 채팅 교정을 사용자가 열 때만 보이게 할지 검토 중 — 안 A·B·C는 `hub/drafts/model-cascade-2026-10-21.md` 끝.
- 의견 반영 보상: **포인트는 보류(2026-10-23, 사용자)** — 같은 의견을 많이 보내면 원가가 사람 수만큼 커짐, 간단한 의견이 대부분. 대신 프로필 🛠 칸·사람 목록/게시판 노출 가산으로(`hub/drafts/profile-2026-10-23.md`).
- 흑자 구조(`hub/drafts/pricing-profit-2026-10-20.md`): **①②③ 넣음(2026-10-20, 서버 반영)** — 무료 채팅 7·팩 주 2번·AI 도움 20·광고 조정. 남은 결정: 빠른·직접 질문을 AI 도움에 합칠지, ④ 유료 모듈형.
