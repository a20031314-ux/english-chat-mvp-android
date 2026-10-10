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

- **언제**: 버전 태그를 푸시할 때마다 자동으로, 또는 Actions에서 수동 실행
- **결과**: `fastlane/metadata/android/<언어>/images/phoneScreenshots/NN-<장면>.png`
  가 바뀌면 PR이 열립니다. PR의 Files changed에서 이미지를 보고 병합하면 Play에
  올라갑니다.
- **지금 있는 것**: 영어·스페인어·일본어·한국어·중국어 5개 언어 × 3장면(지도, 채팅 표현 카드,
  문장 빠른 질문). 영어 사용자에게는 스페인어를 배우는 장면, 나머지는 영어를 배우는 장면을
  각자의 앱 언어로 보여줍니다. 어떤 장면을 찍을지는 `PRODUCT.md` "대표 장면"을 따릅니다.
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
