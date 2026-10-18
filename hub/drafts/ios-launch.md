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

## 사람이 할 일 (순서대로)

1. Apple Developer Program 가입(연 $99).
2. 빌드 방법 정하기: 사용자 PC가 Windows라 맥이 없으면 **GitHub Actions macOS + fastlane**(Claude가 워크플로를 만들 수 있음) 또는 Codemagic 같은 클라우드 빌드.
3. 번들 ID 정하기: 지금 `com.yourname.englishchat`(안드로이드와 같음). App Store에 한 번 올리면 못 바꾼다.
4. App Store Connect: 앱 만들기 → 구독 그룹에 **`lite_monthly`·`plus_monthly`·`premium_monthly`**, 소모품 **`points_30`·`points_60`·`points_200`·`points_500`** —
   서버가 상품 id로 요금을 가르므로(`billing/plans.ts`) **안드로이드와 같은 id**로. 원화 가격 단계(3,900·5,500·8,900원 등)가 있는지 확인.
5. RevenueCat: iOS 앱 추가, App Store 상품을 `premium` 권한·current 오퍼링에, Vercel `NEXT_PUBLIC_REVENUECAT_IOS_API_KEY` → 다시 빌드.
6. 앱이 생기면 Vercel `NEXT_PUBLIC_APP_STORE_URL`(https://apps.apple.com/app/id…) → 다시 빌드.
7. 심사 준비: 개인정보 라벨(계정·이메일·이름·사진, 마이크 음성은 받아쓰기에만), 연령 등급, 지원 URL·처리방침(https://english-chat-mvp.vercel.app/privacy), 심사용 데모 계정(아이디·비밀번호).
8. 기기 확인(아래 "기기에서 볼 것") → TestFlight → 제출.

## 기기에서 볼 것 (맥이 생긴 뒤)

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
| 업데이트 배너·랜딩 | Play 주소 고정(`appVersion.ts`, `LandingPage.tsx`) | 플랫폼별 스토어 주소, iOS 버전 번호 따로 |
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
