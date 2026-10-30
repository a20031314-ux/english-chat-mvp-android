# iOS 출시 계획 (2026-10-18)

> 사용자 질문: "보이스룸·사용자 간 기능 추가 후 iOS 출시를 고려 중, 어떻게 해야 해?"
> 상태: **1차 준비 끝(코드), 2026-10-18** — 사용자 결정 "방·메시지 없는 버전으로 iOS 전환, 출시 뒤 추가".
> 남은 것은 아래 "사람이 할 일"(맥/클라우드 빌드, 애플 계정·상품)과 기기 확인.

## 1차에 한 것 (2026-10-18)

- `ios/` Capacitor 프로젝트(Swift Package Manager — CocoaPods 필요 없음), `@capacitor/ios` 8.3.0(안드로이드와 같은 버전).
- `src/lib/platform.ts` 한곳에서 iOS 분기: 말하는 방·메시지 끔(`NEXT_PUBLIC_IOS_SOCIAL=1`로 켬), Google 로그인 숨김,
  기기 YouTube 오디오 받기 끔, 결제·계정 삭제 문구의 Play 스토어 → App Store(14개 언어, 테스트), 업데이트 링크 App Store(`NEXT_PUBLIC_APP_STORE_URL`), 텍스트 넘겨받기 플러그인 안 부름.
- `npm run build:ios` = 정적 빌드 → `scripts/ios-project.mjs`(버전을 build.gradle에서, 권한 문구 14개 언어 `scripts/ios-permission-strings.json`, 암호화 신고 false) → `cap sync ios`.
- 웹뷰를 안전 영역 안에만(`AppDelegate.swift` `SafeAreaHostViewController`, Main.storyboard 첫 화면) — 화면이 안드로이드처럼 상태 표시줄 아래에서 시작.
- 아이콘: 안드로이드 아이콘(432px)을 1024로 키운 임시본 — 원본 1024 그림이 있으면 바꿀 것. 시작 화면은 검정.
- 확인: tsc, test:billing 124(iOS 문구 포함)·test:rooms·test:account, check:strings·check:languages, Xcode 프로젝트 파일 파싱.
  브라우저에서 iOS 흉내(CapacitorCustomPlatform)로 ja/ko·en/ja·es/ar — 입장 코드를 넣어도 🎙 없음, 웹(안드로이드와 같은 길)은 🎙 → 방 열림.
  **맥·Xcode 빌드와 실제 아이폰은 못 해 봄.**

## 클라우드 빌드 설정 (사람이, 한 번 — 2026-10-18 아이폰·개발자 계정 있음)

빌드는 GitHub Actions의 맥이 한다(`.github/workflows/ios-testflight.yml`, 사람이 눌러야만 돈다). 맥·인증서 파일 필요 없음 —
App Store Connect API 키로 Xcode가 서명을 스스로 만들고(클라우드 서명) 바로 TestFlight에 올린다.

1. **번들 ID 정하기**(못 바꿈): 그대로 `com.yourname.englishchat`(안드로이드·RevenueCat과 같음) 또는 새 이름.
2. **App ID 등록**: developer.apple.com → Certificates, IDs & Profiles → Identifiers → ＋ → App IDs → App →
   Bundle ID "Explicit"에 1번 값. 기능은 기본값(In-App Purchase 포함)만.
3. **앱 만들기**: App Store Connect → 앱 → ＋ 새로운 앱 → iOS, 이름 `languagebank`, 기본 언어, 번들 ID(2번), SKU(아무 글자, 예 `languagebank-ios`).
4. **API 키**: App Store Connect → 사용자 및 액세스 → 통합 → App Store Connect API → 팀 키 ＋ → 이름 `github-ios`, 역할 **관리자**
   (클라우드 서명 인증서를 만들려면 필요). `.p8` 파일은 **한 번만** 받을 수 있음. 같은 화면의 **키 ID**와 **발급자 ID**도 적어 둠.
5. **팀 ID**: developer.apple.com → Account → Membership details의 Team ID(10자리).
6. **GitHub에 넣기**: 저장소 Settings → Environments → New environment `ios` →
   - Secrets: `ASC_KEY_ID`(키 ID), `ASC_ISSUER_ID`(발급자 ID), `ASC_KEY_P8`(.p8 파일을 메모장으로 열어 **내용 전체**를 붙여 넣기)
   - Variables: `APPLE_TEAM_ID`(팀 ID), `IOS_BUNDLE_ID`(1번 값)
   - 나중에(결제 붙일 때): Secret `NEXT_PUBLIC_REVENUECAT_IOS_API_KEY`, Variable `NEXT_PUBLIC_APP_STORE_URL`
7. **빌드**: GitHub → Actions → "iOS: build to TestFlight" → Run workflow. 20~30분 뒤 App Store Connect가 처리(10~30분).
   처음엔 "수출 규정 준수" 질문이 뜰 수 있음 — 앱에 이미 "표준 암호화만" 신고가 들어 있어 보통 안 뜸.
8. **아이폰에 설치**: App Store Connect → 앱 → TestFlight → 내부 테스트 → 그룹 만들고 본인(개발자 계정 이메일) 추가 →
   아이폰에 TestFlight 앱 설치 → 초대 수락 → 설치.

빌드 번호는 `versionCode.실행번호`(예 82.3)라 같은 버전을 여러 번 올려도 된다. 실패하면 Actions 실행 화면의 빨간 단계를 그대로 알려 주면 됨.

## 출시까지 남은 사람 일 (TestFlight 확인 뒤)

1. App Store Connect → 비즈니스: **유료 앱 계약**·세금·은행(인앱 결제에 필요), 소규모 사업자 프로그램 신청(수수료 15%).
2. 인앱 상품: 구독 그룹 하나에 **`lite_monthly`·`plus_monthly`·`premium_monthly`**, 소모품 **`points_30`·`points_60`·`points_200`·`points_500`** —
   서버가 상품 id로 요금을 가르므로(`billing/plans.ts`) **안드로이드와 같은 id**. 같은 그룹이어야 요금 바꾸기가 이중 결제가 안 됨. 원화 가격 단계 확인.
3. RevenueCat: iOS 앱 추가(App Store Connect 앱 내 구입 키), App Store 상품을 `premium` 권한·current 오퍼링에 → iOS 키를 6번 Secret에 → 다시 빌드.
4. 앱 주소(https://apps.apple.com/app/id…)를 6번 Variable에 → 다시 빌드.
5. 심사 자료: 개인정보 라벨(계정·이메일·이름·사진, 마이크 음성은 받아쓰기에만), 연령 등급, 지원 URL·처리방침(https://english-chat-mvp.vercel.app/privacy),
   심사용 데모 계정(아이디·비밀번호), iPhone 스크린샷(store-shots로 만들 수 있음).
6. 제출.

- **심사 빌드 전에 진단 끄기**: 작업 흐름 `NEXT_PUBLIC_IOS_DIAG`를 "0"(통화 진단 상자), `public/yt-embed.html` 회색 상태 줄(`#s`) 빼기.


## 제출 판단 (2026-10-23, 사용자 "결정해줘")

**결정: 사람 기능 없이(말하는 방·메시지·사람·게시판 꺼진 지금 빌드) 1차 제출. 통과 뒤 사람 기능을 제한해서 업데이트로 연다.**
- 왜 빼고 내나: 애플 1.2(사용자 생성 콘텐츠)는 올리기 전 걸러내기·신고·차단·운영자 연락처·24시간 안 처리가 다 있어야 한다. 지금은 신고·차단·`/ops` 정지·사진·랜덤 거르기는 있지만 **1:1·단체방·게시판 글과 말하는 방 음성은 거르기가 없다** — 넣고 내면 거절·지연 위험이 가장 크다. 빼도 숨은 입구가 없고(빌드 값으로 꺼짐, 사용법 장도 빠짐) 학습 기능만으로 2.1·4.2를 넘는다.
- 2차(업데이트)로 열 때: 글 거르기(1:1·단체방·게시판, 사진처럼 moderation), 약관에 "부적절한 콘텐츠 무관용"·처리 기한, 말하는 방은 신고·강퇴·자막 기록으로 대응 → `NEXT_PUBLIC_IOS_SOCIAL=1` 빌드 + 심사 메모.
- 진단: TestFlight 작업 흐름 기본값 꺼짐(`diag` 체크할 때만 켜짐), 영상 중계 상태 줄은 `?diag=1`일 때만 — 심사 빌드는 그냥 Run workflow.
- 제출 전 사람 일: App Store 버전 번호 2.71(지금 1.0), 6.9인치 스크린샷, 설명·키워드·지원 URL·약관(애플 표준 EULA)·처리방침 링크, 개인정보 라벨(OpenAI로 보내는 글·음성·사진, 계정, 구매 — 추적 없음), 연령 등급 설문(AI 대화 "예", 사용자 간 소통 "아니요"), 상품 7개 한국어 이름·심사 스크린샷 + 버전과 같이 제출, 1024 아이콘 원본, EU(거래자 등록 전엔 빼기), Small Business Program 신청(수수료 15%).
- 심사 계정: AI 기능은 로그인 없이 써서 필요 없음. 메모에 "로그인 없이 채팅·통화·영상, 플랜 화면에서 구독" 한 줄.

## 심사 정책 점검 (2026-10-19 점검 → 2026-10-20 1~3 고침, 앱 빌드 필요)

**고친 것(2026-10-20):** 1 AI 동의 시트(iOS, 14개 언어) · 2 결제 화면 자동 갱신 안내 + 이용약관(애플 표준 EULA)·처리방침 링크 · 3 iOS 영상 탭은 라이브러리만(가져오기·찾기 숨김) · 다른 스토어 구독자 결제 막기(사용자 결정). 남은 건 4(사람 일).


코드상 1차 범위(사람과 학습·초대·팀·메이트·Google 로그인·기기 YouTube 받기 끔)는 iOS에서 모두 꺼져 있음. TestFlight 첫 실행은 아직 없음.
심사에 걸릴 수 있는 것:
1. **AI 데이터 동의(5.1.2(i), 2025-11):** 채팅·음성을 OpenAI로 보내기 전에 앱 안에서 "OpenAI에 보냄"을 밝히고 동의를 받아야 함 — 지금 동의 화면 없음(처리방침에만 있음). 첫 실행 동의 시트(14개 언어) 필요.
2. **구독 안내(3.1.2):** 결제 화면에 이용약관(EULA — 애플 표준 약관 링크 가능)·개인정보 처리방침 링크가 없음. 복원 버튼은 있음. App Store 설명에도 두 링크.
3. **YouTube(5.2.2·5.2.3):** 기기 오디오 받기는 끔. 사용자가 붙여 넣은 링크의 자막을 YouTube 앱 클라이언트처럼 받아 오는 길은 남아 있음 — iOS 1차는 "내 영상 가져오기"를 숨기고 이달의 영상만 둘지 결정.
4. **사람 일:** 첫 인앱 상품은 앱 버전과 함께 제출(상품이 없으면 결제 화면이 비어 2.1 거절), 유료 앱 계약, App Privacy 라벨(OpenAI·계정·사진·음성),
   새 연령 등급 설문(AI 대화), 심사용 데모 계정, 6.9인치 아이폰 스크린샷, 지원 URL, 아이콘 원본(지금 임시본).

## 기기에서 볼 것 (TestFlight로 설치한 뒤)

- 첫 화면이 노치 아래에서 시작하고 아래 탭이 홈 표시줄 위에 있는지, 키보드가 입력창을 가리지 않는지.
- 통화: 마이크 권한 창이 앱 언어로 뜨는지, 받아쓰기(아이폰은 mp4로 녹음)·튜터 목소리(TTS)가 되는지.
- 영상 학습: YouTube 플레이어가 재생되는지(iOS는 `capacitor://localhost`라 YouTube가 막을 수 있음 — 가장 걱정되는 곳), 자막 없는 영상은 안내가 뜨는지.
- 결제: 샌드박스 계정으로 구독·포인트 구매, 문구가 App Store로 나오는지.
- 프로필 사진: 사진 고르기·찍기. 말하는 방 🎙·"?" 길게 누르기가 없는지.

## 2차 (방·메시지 켜기) 전에

- 아래 "말하는 방·메시지를 iOS에 넣기 전" 목록(약관·거르기·신고 처리 화면·정식 입구·TURN·알림) → `NEXT_PUBLIC_IOS_SOCIAL=1` + iOS 새 빌드.

## 처음 검토 (2026-10-18)

### 결론 (추천 순서)

1. **iOS 1차는 사회 기능(말하는 방·1:1 메시지) 빼고** 지금 기능으로 낸다. 심사에서 가장 걸리기 쉬운 게
   사용자 간 기능(UGC 1.2)과 숨은 입구(2.3.1)라서, 이걸 같이 넣으면 첫 심사가 길어진다.
2. 그동안 안드로이드에서 방·메시지를 다듬고 **운영 도구(신고 처리 화면·약관 동의·금칙어)**를 갖춘다.
3. iOS 2차에 방·메시지를 정식 기능(숨은 입구 아님)으로 켠다.

### 사람이 준비할 것

- Apple Developer Program 가입(연 $99, 사업자면 D-U-N-S 필요할 수 있음).
- Mac + Xcode, 또는 맥 없이 GitHub Actions macOS 러너 + fastlane match로 빌드(테스트용 아이폰 1대는 필요).
- App Store Connect 앱 등록(번들 ID는 새로 정해도 됨 — 안드로이드 `com.yourname.englishchat`에 묶이지 않음. 단 Capacitor는 하나라 iOS만 Xcode에서 바꿈).
- 구독·포인트 상품을 App Store Connect에 만들고 RevenueCat iOS 앱 + `NEXT_PUBLIC_REVENUECAT_IOS_API_KEY`(코드는 이미 iOS 키를 읽음).
- 개인정보 라벨(App Privacy), 연령 등급 설문, 지원 URL, 심사용 데모 계정.

### 코드에서 할 일 (dev) — 1차에서 Apple 로그인 대신 Google을 iOS에서 숨김

| 항목 | 지금 | iOS에서 |
|---|---|---|
| 프로젝트 | `ios/` 없음 | `npm i @capacitor/ios` → `npx cap add ios`, `build:ios` 스크립트, Info.plist 마이크 문구(14개 언어) |
| 로그인 | Google·이메일·아이디 | **Sign in with Apple 추가**(Google을 쓰면 4.8 요구). `capacitor.config.ts` `apple: true`(iOS만) |
| 결제 | RevenueCat, 문구에 "Play Store" | 상품 id 매핑, "Play Store" 문구(계정 삭제·결제 타임아웃)를 플랫폼별로, 구독 관리 링크 |
| 업데이트 배너·랜딩 | Play 주소 고정(`appVersion.ts`, `LandingPage.tsx`(2026-10-20 지움)) | 플랫폼별 스토어 주소, iOS 버전 번호 따로 |
| 텍스트 가져오기 | 안드로이드 PROCESS_TEXT·공유(`WebReaderPlugin`) | 없음 → 1차는 숨김, 나중에 Share Extension |
| 영상 학습 | 기기가 YouTube 오디오를 직접 받음(`downloadAudioBytes.ts`) | **심사 위험(5.2.3: 제3자 미디어 다운로드)** → iOS는 이달의 영상(서버 준비) + 자막 있는 영상만, 기기 오디오 다운로드 끔 |
| 녹음 | webm 우선, mp4 대체 | iOS는 mp4만 — 대체 경로 이미 있음(`rooms/speech.ts`, `listen` 파일명 처리). 기기 확인만 |
| TTS | community 플러그인 | iOS 지원 — 기기 확인 |

### 말하는 방·메시지를 iOS에 넣기 전 (안드로이드에도 해당)

- **심사 요건(1.2 사용자 생성 콘텐츠):** 이용약관 동의(괴롭힘 무관용), 부적절한 글 거르기(댓글·메시지·프로필), 신고·차단(있음),
  **신고를 24시간 안에 처리하는 운영자 화면**(지금 KV `social:v1:reports`만), 연락처. 낯선 사람과 대화 → 연령 등급 높게(또는 나이 확인).
- **숨은 입구 금지(2.3.1):** "?" 길게 누르기 + 입장 코드는 심사에서 "숨긴 기능". 정식 입구로 바꾸거나 iOS 빌드에서는 끈다.
- **음성 품질:** 지금 STUN만(`rooms/mesh.ts`) → 모바일 데이터·회사 망에서 일부 연결 실패. TURN 서버 필요(Cloudflare·Twilio 등, 쓴 만큼 과금).
  8명 메시는 폰마다 7개 스트림을 올려 배터리·데이터 부담 → 정식에선 SFU(LiveKit·Agora 등) 검토.
- **백그라운드:** iOS는 앱을 내리거나 화면을 끄면 WebView 마이크·소리가 멈춤 → 방이 끊김. 1차는 "앱을 열어 두세요" 안내,
  계속 들리게 하려면 네이티브 음성 SDK(LiveKit iOS 등) + 백그라운드 오디오 + CallKit 검토.
- **알림:** 메시지·팔로우 알림은 APNs 푸시(`@capacitor/push-notifications`) 필요 — 안드로이드 FCM과 같이 설계.
- **데이터 원칙:** 자막 줄·메시지 서버 저장은 "학습자 문장 미저장" 예외 — 동의 문구·보관 기간을 정식 출시 전에 정함(PRODUCT.md 255줄).
- **유료 튜터(나중):** 사람이 실시간으로 하는 1:1 수업은 인앱결제 대신 외부 결제가 허용되는 경우가 있음(3.1.3(d)) — 그때 전문가 확인.

## 정할 것 (사용자)

- ~~iOS 1차에 방·메시지를 뺄지~~ → 뺌(2026-10-18).
- ~~맥을 직접 쓸지, 클라우드 빌드로 갈지~~ → 클라우드(GitHub Actions + fastlane, 2026-10-18). 번들 ID는 아직.
- 음성 인프라: 지금 직접 연결 + TURN으로 갈지, SFU 서비스로 바꿀지(2차 전에).

## 심사 중 (2026-10-23 제출)

- 제출: 2.71(85.9), 앱 ID 6824542951, 영어(미국) 설명·키워드·스크린샷(6.3인치 1206×2622·iPad 13인치 2064×2752, `store-shots/out/combo-ios*`), 심사 메모 "로그인 없음", 연령 등급 전부 아니요, 개인정보 라벨(이메일·고객 지원·기타 사용자 콘텐츠·사용자 ID·구입 내역 연결 / 오디오 연결 안 함, 추적 없음), 콘텐츠 권한 "제3자 콘텐츠 권리 있음"(YouTube 공식 플레이어).
- 제출 항목이 앱 버전 1개뿐 — 인앱 상품 7개가 같이 안 들어갔으면 2.1 거절 위험(첫 상품은 버전과 함께 제출).
- 코드: `storeListingUrl()` 기본값을 실제 주소 `https://apps.apple.com/app/id6824542951`로(다음 iOS 빌드부터).
- 심사 중 사람 일: Small Business Program 신청, RevenueCat App Store 서버 알림 URL, 한국어 현지화(설명·키워드·스크린샷 — 버전이 잠겨 다음 버전이나 제출 취소 뒤), 출시 방식(자동).
- **심사 빌드는 85.10**(진단 끔, 2026-10-22 18:45 UTC 실행). 처음 제출한 85.9는 진단 켬(`NEXT_PUBLIC_IOS_DIAG=1`) — 결제 화면에 offering 글이 보임. 다시 제출할 때 빌드를 85.10으로 바꿈.
- 2026-10-23 15:0x KST 다시 제출: 앱 버전 + 구독 그룹 + 구독 3 + 포인트 4(심사 정보 스크린샷 = 실제 아이폰 결제 화면). 첫 제출(05:12)은 개발자가 취소.
- 2026-10-25 심사 답: 2.1 Information Needed(새 개발자 계정) — 실기기 화면 녹화 + 7개 질문. 회신 글 `hub/drafts/ios-review-reply-2026-10-25.txt`, 녹화는 사람.
- 2026-10-25 사용자: 아이폰 화면 기록을 켠 채 통화 탭에서 마이크를 허용하는 순간부터 폰 전체가 버벅임(소리·마이크 안 됨). 녹화 없이는 10-20~23에 통화 정상. 85.10 번들을 크롬 아이폰 흉내로 운영에 붙여 보면 멈춤 없음 → WebKit+화면 기록(ReplayKit) 오디오 세션 충돌로 추정. 의심: 방해(interrupted) 상태마다 AudioContext를 새로 만드는 코드(`ttsPlayer.getAudioContext`, `listen.analysisContext`)가 녹화 중에는 계속 새로 만들 수 있음 — 기기에서 진단 빌드로 확인 필요. 심사 녹화는 통화 부분을 다른 기기로 촬영.
- 2026-10-25 고침: 마이크 기준 위 끝 0.02→0.014 + 조용한 턴도 받아쓰기(진단 peak 0.017/thr 0.020). 심사용 빌드는 브랜치 `ios-2.71-hotfix`(85.10 코드 + 이 고침)로 Actions 실행 → 빌드 85.N, 진단 끔.
- 2026-10-25 이어서: 진단 thr 0.004·turn 19.7s(말 끝 못 앎) → 쉼 기준 고침. 녹음 들어 보니 "hi.. iiiii" 끊김(webm/opus 조각) → iOS는 mp4 먼저. 셋 다 `ios-2.71-hotfix`·main. 사용자 아이폰이 최근 webm 녹음을 지원하게 된 뒤(iOS 업데이트 추정) 10-20에 되던 통화가 나빠진 것으로 봄.
- 2026-10-25 결정: iOS 1차 심사는 통화 없이. 다시 켜기 전 할 일: 실기기에서 원인 찾기(AudioContext 재생성·원음 마이크 제약·스트림 clone 중 무엇이 폰 소리를 막는지 하나씩 끄는 진단 빌드).
- 2026-10-26: 영상 학습에서 화면은 나오는데 어느 지점부터 소리 없음(사용자) → iOS 웹뷰가 타이머의 unMute를 무시, 문장 다시 듣기 앞부분 음소거가 안 풀림으로 추정. iOS는 음소거 안 함(`videoMuteAllowed`). hotfix·main.
- 2026-10-26: 영상 소리 끊김(다른 앱은 정상) 진단 — 중계 페이지 ?diag=1이 재생 중에도 t·상태·muted·vol 표시, 진단 빌드는 diag=1 붙임.
- 2026-10-26: iOS 업데이트 뒤 화면 기록·영상 소리 문제 사라짐(폰 iOS 버그였음). 통화(85.13)는 "권한 허용 직후엔 안 되고 앱 껐다 켜면 됨" → 통화 열기 전에 마이크 권한 먼저(`primeMicrophone`, 처음 한 번) + 소리 장치 새로. 진단 빌드는 통화 켬(확인용). 확인되면 다음 업데이트에서 iOS 통화 켜기(`voiceCallAvailable`).

## 출시 범위 다시 정함 2 (2026-10-31, 사용자 "2.71이랑 지금 안드로이드 간극이 너무 커졌어" → 갈아타기)

**85.14(2.71) 심사는 취소하고, iOS 1차 = 다음 안드로이드 출시와 같은 커밋.** 아래 10-29 표는 이걸로 대체.
- 이유: 2.1 회신을 안 보내 85.14 심사는 진행된 것이 없음(10-25부터). 2.71은 무료 채팅 7·예전 My 지도(지도 그리기 Sonnet 40초, 10-30 폰에서 실패)·`script_monthly` 없음 — 안드로이드(무료 = 대본만)와 요금·첫 화면이 다르고, 옛 API(`curriculum/progress` 등)를 iOS 때문에 못 지움. 통과해도 곧 2차 심사를 다시 받아야 했음.
- 범위: 안드로이드 다음 출시 그대로, iOS에서 끔 = 사람 기능·통화(`voiceCallAvailable`)·포인트(통화가 없으면 안 보임). 대본 말하기(마이크)는 기기에서 확인되면 켬 — 안 되면 고르기·맞추기만 쓰도록 `platform.ts`에 스위치를 더함. 아침 알림 켬.
- 기준 커밋: main이 매일 바뀌므로 **안드로이드 출시를 자르는 커밋에서 `ios-<버전>` 브랜치**를 따서 그 위에서만 iOS 고침(85.14 때처럼).
- 순서
  1. (사람) App Store Connect에서 85.14 제출 취소 — 앱 심사 → 그 제출 → 제출에서 삭제(심사에서 제거). 구독 그룹·상품은 지우지 말 것.
  2. (Claude) 기준 커밋이 정해지면 iOS TestFlight(진단 켬) → (사람) 기기에서: 첫 실행 검은 화면 없음(10-27 2.74 88.11 검은 화면 미해결), 대본 말하기 마이크(권한 직후 바로), 아침 알림 권한, 구독 화면.
  3. (사람) App Store Connect 구독 그룹에 `script_monthly`(2,900원) 추가 + RevenueCat offering에 패키지.
  4. (Claude) 스크린샷 = 10-30 학습 흐름 8장을 iOS 크기(6.9"·13")로, 설명·키워드·프로모션·심사 메모(2.1 답 7항목을 처음부터 넣음).
  5. (사람) 새 빌드로 실기기 녹화 → 버전 2.7x 제출(빌드 + 구독 4개).

## 출시 범위 다시 정함 (2026-10-29, 2.72~2.77 구조 개편 뒤)

바뀐 것: 첫 화면 My·대본 중심(오늘 할 것·퀴즈·시험·계속 공부), **무료 = 대본만·대본 플랜 2,900원 `script_monthly`**(2.76~, `isScriptsApp`), 오늘의 팩 뺌, 통화는 CallHost 층·통화 기록, 아침 알림(local-notifications), 대본 말하기는 `sayLine → listenOnce`로 마이크(통화 스위치 `voiceCallAvailable`와 따로).

| 단계 | 빌드 | 범위 | 할 일 |
|---|---|---|---|
| **1차(지금 심사)** | `ios-2.71-hotfix` 85.14 | 채팅·영상(라이브러리)·My(예전 지도)·구독 3. 통화·포인트·사람 기능 없음. 서버는 2.71을 "옛 앱"으로(무료 채팅 7 그대로) | 바꾸지 않고 통과만 — **2.1 회신·실기기 녹화가 10-25부터 밀림**. 지금 2.77로 갈아타면 심사가 처음부터·상품·스크린샷·녹화 다시 |
| **2차(통과 직후 업데이트)** | main(2.77+) | 새 구조 그대로(첫 화면 My·대본·퀴즈·시험), 사람 기능 끔, **대본 말하기 켬**(마이크 — `primeMicrophone`을 `listenOnce`에도, 10-29), **통화는 기기에서 85.13·진단 빌드로 첫 권한 뒤 바로 되는지 확인되면 켬**, 아침 알림 | App Store·RevenueCat에 `script_monthly`(2,900원) 상품·offering, 설명·스크린샷을 대본 중심으로, 진단 빌드로 대본 말하기·알림 권한 기기 확인, 포인트는 통화를 켤 때만 다시 |
| 3차 | — | 사람 기능(1.2 사용자 콘텐츠 요건·신고 24시간·나이) | `hub/drafts/ios-launch.md` "말하는 방·메시지를 iOS에 넣기 전" |
