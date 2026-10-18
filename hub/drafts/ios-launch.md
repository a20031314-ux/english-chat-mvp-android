# iOS 출시 계획 (틀, 2026-10-18)

> 사용자 질문: "보이스룸·사용자 간 기능 추가 후 iOS 출시를 고려 중, 어떻게 해야 해?"
> 상태: **계획만** — 저장소에 `ios/` 없음. 순서·범위는 사용자 확인 후.

## 결론 (추천 순서)

1. **iOS 1차는 사회 기능(말하는 방·1:1 메시지) 빼고** 지금 기능으로 낸다. 심사에서 가장 걸리기 쉬운 게
   사용자 간 기능(UGC 1.2)과 숨은 입구(2.3.1)라서, 이걸 같이 넣으면 첫 심사가 길어진다.
2. 그동안 안드로이드에서 방·메시지를 다듬고 **운영 도구(신고 처리 화면·약관 동의·금칙어)**를 갖춘다.
3. iOS 2차에 방·메시지를 정식 기능(숨은 입구 아님)으로 켠다.

## 사람이 준비할 것

- Apple Developer Program 가입(연 $99, 사업자면 D-U-N-S 필요할 수 있음).
- Mac + Xcode, 또는 맥 없이 GitHub Actions macOS 러너 + fastlane match로 빌드(테스트용 아이폰 1대는 필요).
- App Store Connect 앱 등록(번들 ID는 새로 정해도 됨 — 안드로이드 `com.yourname.englishchat`에 묶이지 않음. 단 Capacitor는 하나라 iOS만 Xcode에서 바꿈).
- 구독·포인트 상품을 App Store Connect에 만들고 RevenueCat iOS 앱 + `NEXT_PUBLIC_REVENUECAT_IOS_API_KEY`(코드는 이미 iOS 키를 읽음).
- 개인정보 라벨(App Privacy), 연령 등급 설문, 지원 URL, 심사용 데모 계정.

## 코드에서 할 일 (dev)

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

## 말하는 방·메시지를 iOS에 넣기 전 (안드로이드에도 해당)

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

- iOS 1차에 방·메시지를 뺄지(추천) 같이 넣을지.
- 맥을 직접 쓸지, 클라우드 빌드(GitHub Actions)로 갈지.
- 음성 인프라: 지금 직접 연결 + TURN으로 갈지, SFU 서비스로 바꿀지.
