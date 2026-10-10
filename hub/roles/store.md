# 스토어·출시

## 맡는 일
- 버전 올리기 (`package.json` version ↔ `build.gradle` versionCode/versionName).
- 출시 노트와 등록정보 14개 언어 — `store-listing` 스킬, `fastlane/metadata/android/`.
- 스토어 스크린샷 — `store-shots/` (고정 AI 응답으로 실제 앱을 찍음).
- 앱 안 업데이트 배너 기준 `RECOMMENDED_APP_VERSION` — Play에 실제로 공개된 뒤에만 올린다.
- 사용자가 PC에서 빌드할 때 막히면 돕는다 (`npm run build:android` → Sync → Signed Bundle).

## 하지 않는 일
- fastlane 실행, Play API 호출, 서명 키 읽기, 프로덕션 워크플로 실행 — 막혀 있고, 사람이 한다.
- 기능 코드 수정 (→ dev).

## 시작할 때
1. `git pull`, `inbox.md`에서 `→ store` 항목 확인 (출시할 변경이 무엇인지). 문구·스크린샷은 `PRODUCT.md` 기준.
2. 아래 "출시 기록"의 마지막 버전과 `build.gradle`을 맞춰 본다.

## 끝낼 때
- 버전이 바뀌면 `hub/STATE.md`의 버전 표와 `PRODUCT.md`의 "기준"·"버전별 변화"도 같이 고친다.
- 이 파일과 `hub/log/YYYY-MM.md` 한 항목을 같이 커밋.

## 출시 기록
| 버전 | versionCode | 내용 | 배너 기준 |
|---|---|---|---|
| 2.62 | 76 | 새 아이콘(테마 아이콘 포함)·검은 시작 화면 | 2.59 그대로 |
| 2.63 | 77 | 학습지도, 한 입력창 채팅+표현 카드, 문장분석 빠른 질문, 영상 대사 검색 | 2.59 그대로 |
| 2.64 | 78 | 새로워진 점 안내(UI 언어별 캡처) | 2.64로 올림 (2026-10-09) |

## 열린 일
- 등록정보 초안(영어·한국어, 2.64 기준 + 2.65 추가 두 줄): `hub/drafts/store-listing-2026-10-10.md`.
  pull listing 뒤 `fastlane/metadata`로 옮기고 나머지 12개 언어 작성.
- Play 자동화 처음 설정이 끝났는지 사용자 확인 필요: GitHub Secrets, `play`/`play-production`
  환경, "Play: pull listing" 실행. 지금 `fastlane/metadata/android/`에는 en-US 스크린샷만 있고
  다른 언어 등록정보·출시 노트는 아직 없다. pull listing 전에는 문구를 새로 쓰지 않는다.
- 2.62~2.64는 사용자가 PC에서 직접 빌드해 올렸고 출시 노트 파일은 저장소에 없다.
- 스토어 스크린샷: en·es·ja·ko·zh × 지도·채팅·빠른 질문(PR). 다른 9개 언어와 미션 장면은 아직.
  지도는 `store-shots/fixtures/`에 녹화한 지도로 찍으니, 지도 화면이 바뀌어도 그대로 따라감.
