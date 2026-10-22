# 앱 광고 구조

> 광고를 바꾸는 채팅이 먼저 읽는다. **위쪽(손으로 씀)**: 원칙·넣지 않는 곳·보류·사람 할 일. **아래쪽(자동)**: 광고 자리·설정·단위·수익 —
> `npm run ads:map`이 코드(`src/lib/billing/ads.ts`, `src/lib/ads.ts`, `<NativeAdSlot`, `maybeShowInterstitial(`, `AppHome.tsx`)에서 만들고, main push 때 CI `ads-map`도 다시 만든다.
> 화면·영역은 `hub/STRUCTURE.md`("요금·포인트·광고 `billing`"), 손익은 `hub/economics.md`, 비용은 `hub/costs.md`, 무엇을 지키는지는 `PRODUCT.md` 광고 절.

## 원칙 (손으로 씀)

- **무료·안드로이드만(웹은 목록 광고만).** 구독자·iOS는 광고 없음. "광고 없이 쓰기"가 구독 이유의 하나.
- **웹(2026-10-20, `src/lib/webAds.ts`·`WebAdSlot`):** `NativeAdSlot`과 같은 목록 자리에 AdSense 반응형 광고 하나, 무료만(`/api/ads/config` native.enabled). 전면·앱 오프닝·배너·보상형은 웹에 없음. Vercel `NEXT_PUBLIC_ADSENSE_CLIENT`·`NEXT_PUBLIC_ADSENSE_SLOT_FEED`를 넣어야 켜짐(지금 꺼짐), `/ads.txt`는 서버가 만듦.
- **흐름을 끊지 않는다.** 전면 광고는 무언가 **끝난 자리**에만(통화·팩·미션 끝, 채팅·방·영상에서 나올 때), 서로 몇 분 간격. 쓰는 중·답 기다리는 중·통화 중·앱을 열자마자는 안 띄움.
- **보상형은 꺼 둠**(2026-10-20 사용자: "광고 보고 더 주는 건 거부감, 그냥 뜨고 건너뛰는 게 흔하다"). 대신 전면을 채팅 2번 뒤로.
- **값은 서버에서.** 간격·조건·켜고 끄기는 Vercel `ADS_*` → 앱 빌드 없이 조정. 광고 자리(어느 화면에 무엇) 자체는 앱 빌드.
- **손익이 기준.** 자리·값을 바꾸면 `npm run sim:economics -- --write`로 다시 계산하고, 1,000명당 손익이 단가 중간에서 양수인지 본다.

## 넣지 않는 곳 (손으로 씀)

- AI 채팅·통화 **도중**, 1:1·단체방 **대화 안**, 말하는 방 **안**, 게시글 **안**, 문장분석·표현 시트: 쓰거나 말하는 중이라 흐름이 끊기고 AdMob 정책(갑자기 뜨는 광고) 위험.
- 1:1·단체방 통화가 끝날 때: 메이트 신청·대화로 바로 이어짐.
- 배너는 채팅·통화·Room·사람에 없음(둘러보는 화면만). 네이티브가 있는 화면에 배너를 늘리지 않는다.

## 보류·다음 (손으로 씀)

- **제휴 상품 카드**(쿠팡·Amazon·Klook 등, `hub/drafts/coupang-affiliate.md`): 보류. 그 문서의 "꺼낼 때" 조건이 보이면 사용자에게 먼저 알린다.
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
| `callEnd` | AI 통화가 끝나고 돌아보기로 넘어갈 때 | AI 통화 (대화 → AI 튜터 📞) · 오늘의 팩 `call` · `RoleplayScreen.tsx` |
| `chatLeave` | AI 채팅을 몇 번(설정 `interstitialAfterChats`) 보낸 뒤 채팅 화면을 떠나거나 대화를 끝낼 때 | 앱 틀 `shell` · `AppHome.tsx` ／ AI 채팅 (대화 → AI 튜터 줄) `chat` · `ChatWindow.tsx` |
| `missionDone` | 미션 하나를 마치고 "다음"을 눌렀을 때 | My 탭 `my` · `studyMap/MissionScreen.tsx` |
| `packEnd` | 오늘의 팩을 끝까지 마쳤을 때 | AI 통화 (대화 → AI 튜터 📞) · 오늘의 팩 `call` · `RoleplayScreen.tsx` |
| `roomLeave` | 공개 말하는 방에 몇 분(설정 `roomLeaveMinutes`) 넘게 있다 나올 때 — 1:1·단체방 통화는 제외 | Room 탭 `room` · `rooms/RoomsScreen.tsx` |
| `videoLeave` | 영상을 몇 분(설정 `videoLeaveMinutes`) 넘게 보고 나올 때 | 영상 학습 탭 `video` · `videoLearning/VideoLearningTab.tsx` |

모든 전면 광고는 서로 3분(설정 `interstitialMinGapSeconds`) 안에 다시 뜨지 않고, 미리 받아 둔 광고가 있을 때만 뜬다.

### 네이티브 광고 (목록 사이 앱 카드 모양)

| 화면(피드) | 자리 | 설명 | 영역 · 파일 |
|---|---|---|---|
| `people-tab` | `board-after-3` | 세 번째 글 뒤에 네이티브 광고 하나(무료·안드로이드만, lib/ads.ts). 글을 열면 시트가 덮어 멈춘다. | 사람 탭 `people` · `rooms/BoardView.tsx` |
| `people-tab` | `people-after-4` | 네 번째 사람 뒤에 네이티브 광고 하나(무료·안드로이드만). 프로필을 열면 시트가 덮어 멈춘다. | 사람 탭 `people` · `rooms/RoomPeople.tsx` |
| `room-lobby` | `room-lobby-after-2` | 두 번째 방 뒤에 네이티브 광고 하나(무료·안드로이드만). 방에 들어가면 방 화면이 덮어 멈춘다. | Room 탭 `room` · `rooms/RoomsScreen.tsx` |
| `talk-list` | `talk-after-account` | 로그인 전이면 계정 카드 아래에 네이티브 광고 하나(무료·안드로이드만). | 대화 탭 `talk` · `rooms/MessagesTab.tsx` |
| `talk-list` | `talk-between-lists` | 목록 사이 네이티브 광고(무료·안드로이드만). 단체방 대화가 열리면 시트가 덮으므로 광고는 멈춘다. | 대화 탭 `talk` · `rooms/MessagesTab.tsx` |
| `video-library` | `video-library-after-3` | 세 번째 영상 뒤에 네이티브 광고 하나(무료·안드로이드만, lib/ads.ts). | 영상 학습 탭 `video` · `videoLearning/CatalogLibrary.tsx` |

피드 4개, 자리 6개. 플러그인 한도: 한 피드에 광고 3개, 동시에 피드 2개 — 그래서 보이는 탭에서만 붙인다(`NativeAdSlot` `active`).

### 배너 · 앱 오프닝 · 보상형

- **배너**(하단 탭 바로 위): My `map` · 영상 학습 `video` · 단어장 `vocab` · 대화 `talk` 탭에서만 (`AppHome.tsx` `BANNER_TABS`). 시트가 열리거나 글을 쓰는 동안 숨김.
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

가상 사용자 손익(`hub/economics.md`, 결제 전환 3%): 가입자 1,000명당 한 달 단가 낮음 **−77,195원** · 중간 **+251,343원** · 높음 **+579,880원**.
무료 한 사람 한 달: 원가 390원, 광고 602원(중간) → +212원.

<!-- 자동 끝 -->
