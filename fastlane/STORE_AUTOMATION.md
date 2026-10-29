# Google Play 스토어 자동화

Claude Code는 **파일을 고치고 PR을 올리는 것까지만** 합니다. Play에 올리는 일은
PR을 병합한 뒤 GitHub Actions가 하고, 프로덕션 출시는 사람이 승인해야 실행됩니다.
Play 서비스 계정 키와 서명 키는 GitHub Secrets에만 있고, Claude는 볼 수 없습니다.

```
Claude Code ──(출시 노트·등록정보 수정)──▶ PR ──(검토 후 병합)──▶ GitHub Actions ──▶ Google Play
                                                                  │
                                    프로덕션 출시는 "play-production" 승인 대기 ─┘
```

## 워크플로 한눈에 보기

| 워크플로 | 언제 | 하는 일 | Play에 반영 |
|---|---|---|---|
| Store: check listing | 등록정보를 바꾼 PR마다 | 글자 수, 빠진 언어, 정책 위반 표현 확인 | 없음 |
| Play: pull listing | 수동 (처음 한 번) | 현재 Play 등록정보를 받아와 PR로 올림 | 없음 |
| Play: upload listing | `fastlane/metadata` 변경이 main에 병합될 때 | 설명 문구 업로드 (이미지는 바뀐 경우만) | 등록정보 (Play 심사 후 공개) |
| Play: build to testing track | `v*` 태그 푸시 또는 수동 | 서명된 AAB 빌드 → 내부 테스트(또는 비공개) 트랙 | 테스트 트랙 |
| Play: production | 수동 + **승인 필요** | 프로덕션 단계적 출시 / 비율 변경 / 중단 | 프로덕션 |
| Store: screenshots | `v*` 태그 푸시 또는 수동 | 앱을 띄워 스크린샷을 다시 찍고, 바뀌었으면 PR | 없음 (병합하면 upload listing이 올림) |
| Store: screenshot preview | 화면 코드(`src/`, `api` 제외)·`store-shots/`가 main에 바뀔 때, 또는 수동 | 앱을 돌려 다시 찍고 등록정보별 폴더 + 전후 비교로 묶어 아티팩트로 보관. 커밋하지 않음 | 없음 |

## 처음 한 번 설정하기

### 1. Play 서비스 계정 만들기
1. [Google Cloud 콘솔](https://console.cloud.google.com/)에서 프로젝트를 고르고
   **Google Play Android Developer API**를 사용 설정합니다.
2. **IAM 및 관리자 → 서비스 계정**에서 계정을 만들고, **키 → 새 키 만들기 → JSON**으로
   키 파일을 받습니다.
3. [Play Console](https://play.google.com/console) → **사용자 및 권한 → 새 사용자 초대**에
   서비스 계정 이메일을 넣고, 이 앱에 대해 다음 권한만 줍니다.
   - 앱 정보 보기(읽기 전용)
   - 스토어 등록정보 관리
   - 테스트 트랙에 앱 출시
   - 프로덕션에 앱 출시 (프로덕션 자동화를 쓸 때만. GitHub 승인 단계가 있으니 주어도 됩니다)

### 2. GitHub Secrets 등록
저장소 **Settings → Secrets and variables → Actions**에서:

| 이름 | 종류 | 값 |
|---|---|---|
| `PLAY_SERVICE_ACCOUNT_JSON` | Secret | 1번에서 받은 JSON 파일 내용 전체 |
| `ANDROID_KEYSTORE_BASE64` | Secret | 업로드 키스토어(.jks)를 base64로 바꾼 값 (아래 명령) |
| `ANDROID_KEYSTORE_PASSWORD` | Secret | `keystore.properties`의 storePassword |
| `ANDROID_KEY_ALIAS` | Secret | keyAlias |
| `ANDROID_KEY_PASSWORD` | Secret | keyPassword |
| `NEXT_PUBLIC_REVENUECAT_ANDROID_API_KEY` | Secret | 지금 로컬 빌드에 쓰는 RevenueCat 안드로이드 키 |
| `NEXT_PUBLIC_API_BASE` | Variable (선택) | 비우면 기본 Vercel 주소 사용 |

키스토어를 base64로 바꾸기:
- macOS/Linux: `base64 -i upload.jks | pbcopy` (Linux는 `base64 -w0 upload.jks`)
- Windows PowerShell: `[Convert]::ToBase64String([IO.File]::ReadAllBytes("upload.jks")) | Set-Clipboard`

### 3. 승인 단계 만들기
**Settings → Environments**에서 두 개를 만듭니다.
- `play`: 테스트 트랙과 등록정보 업로드용. 승인자 없이 둬도 됩니다.
- `play-production`: **Required reviewers에 본인을 추가**합니다. 프로덕션 출시는
  여기서 승인 버튼을 눌러야 실행됩니다.

### 4. Play Console의 관리형 게시 켜기 (권장)
**게시 개요 → 관리형 게시**를 켜면, 심사를 통과한 변경도 Play Console에서 직접
게시 버튼을 누르기 전까지 공개되지 않습니다. 자동화의 마지막 안전장치입니다.

### 5. 현재 등록정보 가져오기
**Actions → Play: pull listing → Run workflow**를 실행하면 지금 Play에 있는
14개 언어 등록정보가 `fastlane/metadata/android/`로 들어온 PR이 생깁니다.
이 PR을 병합한 뒤부터 Claude가 문구를 고칠 수 있습니다. (기존 등록정보를 덮어쓰지
않으려고 이 단계를 먼저 합니다.)

## 평소 출시 흐름

1. 기능 작업이 끝나면 Claude Code에 "출시 노트 써줘"라고 합니다.
   - Claude가 `versionCode`/`version`을 올리고, 지난 출시 이후 바뀐 기능만 골라
     14개 언어 `changelogs/<versionCode>.txt`를 쓰고, PR을 올립니다.
2. PR에서 **Store: check listing**이 통과했는지 보고 병합합니다.
3. `v2.62.0` 같은 태그를 푸시하거나 **Play: build to testing track**을 실행하면
   내부 테스트 트랙에 올라갑니다.
4. 테스트해 보고 괜찮으면 **Play: production**을 `promote`, 비율 `0.1`(10%)로
   실행하고 승인합니다.
5. 크래시가 없으면 같은 워크플로를 `rollout`, `0.5` → `1`로 실행합니다.
   문제가 생기면 `halt`로 멈춥니다.

## 스토어 스크린샷 자동 생성

어떤 화면을 찍을지는 `PRODUCT.md`의 "대표 장면"을 따릅니다.

`store-shots/`가 실제 앱을 휴대폰 크기로 띄워 화면을 찍고, 헤드라인과 휴대폰
프레임을 입혀 1080×1920 이미지로 만듭니다. AI 응답은 모두
`store-shots/content/<언어>.json`에 적힌 고정 문장으로 대신하기 때문에 API 키도,
비용도 들지 않고 매번 같은 대화가 찍힙니다. 버튼이나 화면 구성이 바뀌면 다음
캡처에 그대로 반영됩니다.

- **홍보 쇼츠 (실사용 녹화)**: `store-shots/promo/` — 실제 앱을 운영 서버로 돌리며 Chrome 화면 전송으로 2배 해상도 녹화(`record.mjs <언어>`, 운영 채팅 1번),
  장면 시각대로 자르고 기다림은 빠르게·카드 확대·자막·튜터 목소리(`/api/tts`)·끝 화면(`make.mjs <언어>`) → `tmp/promo/<언어>/promo-<언어>.mp4`(세로 1080×1920, 약 15초).
  1편: 편한 말로 쓰기 → 튜터가 학습 언어로 → 표현 카드 → 이 표현으로 말해보기. 자막은 `make.mjs` COPY(지금 ko).
  2편(사용자끼리): 사람 탭 팔로우 → Room 들어가기 → 상대 말이 한 줄씩 자막 → 줄 번역 → 질문에 편한 말로 웅얼 → 💡 힌트(목소리) → 보내기 → 단체방.
  녹화는 캡처 스크립트의 고정 응답을 그대로 쓴다: `CAPTURE_MIC_WAV=… node --experimental-strip-types scripts/capture-whats-new.mjs promo-people --only ko`
  → `node store-shots/promo/make.mjs people ko` → `tmp/promo/people/ko/promo-people-ko.mp4`. 상대 사람·글은 고정 응답, 번역·힌트는 운영.
  **기본 형식(2026-10-19 사용자 결정): 한 편에 기능 하나, 15초 안팎, 영어판 먼저 → 다른 언어로.** Room 편: `promo-room`(입장 → 실시간 자막 → 줄 번역 → 💡 힌트 → 보내기)
  `--only en,ko,ja,zh,es,hi` → `node store-shots/promo/make.mjs room <언어>` → `tmp/promo/room/<언어>/promo-room-<언어>.mp4`(자막 6개 언어는 make.mjs `COPY.room`).
  친구 초대 편: `promo-invite`(사람 탭 친구 초대 → 링크 복사 → 친구 화면 "Minji님이 초대했어요" → 팀 단체방 → 워크스페이스) → `make.mjs invite <언어>`.
  웹에는 휴대폰 공유 창이 없어 "초대 링크를 복사했어요"가 뜨는 웹 동작 그대로 찍힌다.
- **스토어 학습 흐름 8장 (지금 올리는 세트, 2.78~, 사용자 2026-10-30 "기능 나열이 아니라 뭘 해야 할지·학습 흐름이 명확하게, 큰 줄기 → 세부는 뒤쪽")**:
  1장 하루 흐름 한눈에(① 일일 학습 → ② 말하기 → ③ 지속 학습 → ④ 대화, 단계 이름은 앱 버튼 문구 그대로) → 2~5장 그 단계 하나씩(위에 단계 막대, 큰 화면 하나, 3장은 지속 학습 카드 위에 푼 문제) → 6~8장 세부(막히면 편한 말로·통화와 영상·사람과 함께, 화면 둘).
  `npm run build:capacitor` 뒤 `CAPTURE_RUN=<새 이름> [CAPTURE_TARGET=<학습 언어>] node --experimental-strip-types scripts/capture-whats-new.mjs store-flow --only <UI 언어>`
  (필요한 장면만: `CAPTURE_SHOTS=today-plan,keep-learning,keep-quiz,script-play,chat-correct,chat-fix-open,chat-expression,chat-ask,meant,video-study,groups,group-pick,freetalk,quote`)
  → `node --experimental-strip-types store-shots/flow/compose.mjs`(`FLOW_ONLY=ko,ko-ja`로 일부만) → `store-shots/out/flow/<등록정보>/1~8-*.png`. 장면·자르는 위치·글은 `store-shots/flow/strings.mjs`.
  6개 기본 언어는 PR로 `phoneScreenshots`(`01-overview` … `08-together`), 맞춤 등록정보 11개(나라·배우는 언어)는 Console에서 사람이 폴더째.
- **스토어 7장 학습 흐름 세트 (2.77 세트, 위 8장으로 바뀜 — 2.77~, 사용자 2026-10-29 "핵심기능, 학습흐름 중심")**: 오늘 할 것 → 대본으로 말하기 → 다시 보기(지난번에 틀린 것·퀴즈) → 채팅 → 통화 → 영상 → Room.
  `npm run build:capacitor` 뒤 `CAPTURE_RUN=<새 이름> [CAPTURE_TARGET=<학습 언어>] node --experimental-strip-types scripts/capture-whats-new.mjs store-flow --only <UI 언어>`
  (이 모드는 `x-app-version`을 빼서 무료 테스트 사용자도 채팅이 됨) → `node store-shots/combo/compose.mjs`(`COMBO_ONLY=ko`로 하나만). 장면·문구는 `strings.mjs` `SHOTS`·`FLOW`.
  6개 기본 언어는 PR로 `phoneScreenshots`(`01-plan` … `07-room`), 맞춤 등록정보(국가·언어 조합)와 나머지 언어는 Console에서 사람이 올린다.
- **스토어 8장 (2.69~2.76 세트)**: 한 장에 탭의 핵심 기능 하나(큰 화면) + 세부 기능 둘(확대 카드) + 더 있는 기능 칩(사용자 결정 2026-10-18).
  지도·채팅·문장분석·My 성장·통화·영상·Room·사람과 학습 8장 × 6개 등록정보. 아래 탭별 캡처(`store-my`·`store-tabs`)를 찍은 뒤
  `node store-shots/combo/compose.mjs` → `store-shots/out/combo/<등록정보>/1~8-*.png`(폴더째 올리면 됨). 장면·자르는 위치·문구는 `store-shots/combo/strings.mjs`.
  `store-tabs`는 가짜 마이크용 말소리 wav가 필요(`CAPTURE_MIC_WAV`, 💡 힌트·팩 통화) — `/api/tts`가 주는 원시 PCM(24kHz s16le)을 ffmpeg로 wav로.
  오늘의 팩은 영어·일본어 학습만 있어 영어 앱(스페인어 학습) 통화 장은 내 문장 말해보기로(`OVERRIDES`).
- **탭별 세부 기능 세트 (실제 운영 서버로)**: My(자라는 중·요소·직접 묻기·지도)·지도(할 일·세 상태·자주 틀림)·내 표현·채팅(교정·표현 카드·빠른 질문·단어·탭 연결·지도에 넣기)·
  통화(되살리기·다시 말해보기)·영상(구간·질문)·단어장·말하는 방·1:1 메시지·내 계정 22장면 × 6개 등록정보. 고정 응답이 아니라 운영 API로 실제 입력을 돌린다(언어당 채팅 11번·지도 2장 정도 비용).
  `npm run build:capacitor` 뒤 `CAPTURE_RUN=<새 이름> node --experimental-strip-types scripts/capture-whats-new.mjs store-my --only en,ko,ja,zh,es,hi`와 같은 명령의 `store-tabs`
  (무료 테스트 사용자 하루 채팅 10번이라 둘로 나눔) → `tmp/store-raw/` → `node store-shots/tabs/compose.mjs` → `store-shots/out/tabs/<등록정보>/upload-8`(올릴 8장)·`all`(19장).
  헤드라인은 `store-shots/tabs/strings.mjs`, 긴 제목은 두 줄에 맞게 글자를 줄인다.
- **화면이 바뀔 때마다 (업로드 없이)**: "Store: screenshot preview"가 main에 화면 코드가 바뀔 때마다 돌아,
  앱 캡처 + 디자인 세트를 `store-shots/package.mjs`로 등록정보별 폴더(`0_default-english`, `1_korea` … `5_india`,
  올릴 순서대로 1~8번)에 묶고, 지난 실행과 비교해 바뀐 화면의 전/후 이미지(`compare/`)와 목록(`CHANGES.md`,
  실행 요약에도 표시)을 만듭니다. Actions → 실행 → Artifacts → `store-screenshots`에서 zip으로 받습니다(90일 보관).
  커밋도 Play 업로드도 하지 않습니다. 폴더 이름이 영어인 건 Windows에서 한글 zip 이름이 깨지기 때문.
- **언제 (PR)**: 버전 태그를 푸시할 때마다 자동으로, 또는 Actions에서 수동 실행
- **결과**: `fastlane/metadata/android/<언어>/images/phoneScreenshots/NN-<장면>.png`
  가 바뀌면 PR이 열립니다. PR의 Files changed에서 이미지를 보고 병합하면 Play에
  올라갑니다.
- **지금 있는 것**: 영어·스페인어·일본어·한국어·중국어·힌디어 6개 언어 × 3장면(지도, 채팅 표현 카드,
  문장 빠른 질문). 영어 사용자에게는 스페인어를 배우는 장면, 나머지는 영어를 배우는 장면을
  각자의 앱 언어로 보여줍니다. 어떤 장면을 찍을지는 `PRODUCT.md` "대표 장면"을 따릅니다.
- **국가별 맞춤 스토어 등록정보**: Play Console에 기본(영어) + 한국·중국·일본·스페인·인도 맞춤 등록정보가
  있습니다. 맞춤 등록정보는 fastlane으로 올라가지 않으므로, 아래 폴더의 이미지를 Console에서 직접 올립니다.
  한국 `ko-KR`, 일본 `ja-JP`, 중국 `zh-CN`, 스페인 `es-ES`, 인도 `hi-IN`(힌디어 앱 화면, 영어 학습).
  이미지가 바뀌는 PR을 병합하면 맞춤 등록정보 쪽도 같이 바꿔야 합니다.
- **디자인 스크린샷(맞춤 등록정보용)**: 처음 디자인 캔버스로 만든 9장(막힌 지점, 힌트, 영상 학습, 단어 설명,
  언어 소개 등)을 한국·일본·중국·스페인·인도용으로 현지화한 세트. 실제 앱 캡처가 아니라 디자인 목업이라
  `store-shots/canvas/`에서 따로 만듭니다: `node store-shots/canvas/render.mjs` → `store-shots/out/canvas/<국가>/`.
  문구는 `store-shots/canvas/strings.mjs`. Play는 등록정보마다 스크린샷을 8장까지 받으니 앱 캡처 3장과 골라 씁니다.
- **장면 추가**: `store-shots/scenes.mjs`에 장면을 추가하고, 각 언어 JSON의 `scenes`에 헤드라인과
  대화 문장을 넣습니다. 버튼은 앱의 실제 문구(`src/lib/copy.ts`)로 찾기 때문에 언어마다 따로
  고칠 필요가 없습니다.
- **언어 추가**: `store-shots/content/ko-KR.json`을 복사해 Play 언어 코드로 이름을 짓고
  `uiLocale`(앱 언어), `targetLanguage`(배우는 언어), 문구를 바꿉니다. 지도 장면은 그 언어로 그린
  지도가 `store-shots/fixtures/map-<언어>.json`에 있어야 합니다. 운영 API로 한 번만 받아 저장하면
  이후에는 비용 없이 같은 지도가 찍힙니다:
  `curl -s -H "Content-Type: application/json" -H "x-rc-user: store-shots-<언어>" -d '{"goal":"…","level":"intermediate","targetLanguage":"en","interfaceLanguage":"ko"}' https://english-chat-mvp.vercel.app/api/curriculum/generate > store-shots/fixtures/map-ko-KR.json`
- **로컬 실행**: `CAPACITOR_STATIC=1 npx next dev -p 3100`을 띄운 뒤
  `npm run store:shots` (`-- --locale ko-KR`, `-- --scene map`으로 좁힐 수 있음)
- 실패하면 그 순간의 화면이 `store-shots/out/failed/`에 남고, Actions에서는
  `store-shots-failed` 아티팩트로 받을 수 있습니다.
- Play는 `phoneScreenshots` 폴더의 이미지를 파일 이름 순서로 최대 8장
  보여줍니다. 자동 생성 파일은 `01-`, `02-`로 시작하니, Play에서 받아온 기존
  스크린샷과 섞이지 않게 필요 없는 파일은 PR에서 지워 주세요.
- 저장소 **Settings → Actions → General**에서 "Allow GitHub Actions to create
  and approve pull requests"가 켜져 있어야 PR이 열립니다.

## 자동화하지 않는 것 (Play Console에서 직접)
- 심사 결과 확인과 거부 시 이의 제기 (결과는 Play Console 받은편지함과 메일로 옵니다)
- 데이터 보안 섹션, 콘텐츠 등급, 타기팅 연령, 권한 설명 같은 정책 양식
- 가격, 인앱 상품, 출시 국가
- 리뷰 답변 게시 (초안은 Claude에게 맡길 수 있습니다)

## 로컬에서 확인
- `npm run check:store` : 등록정보 점검
- `npm run check:store -- --version-code current` : 현재 versionCode 출시 노트까지 점검
