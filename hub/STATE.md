# 지금 상태

> 모든 채팅이 시작할 때 자동으로 읽는 한 장입니다. 역할별 자세한 내용은
> `hub/roles/`, 역할 사이에 넘긴 일은 `hub/inbox.md`, 지난 기록은 `hub/log/`.
> 허브 쓰는 법: `hub/README.md`. 마지막 갱신: 2026-10-09.

## 버전

| 항목 | 값 | 어디서 바꾸나 |
|---|---|---|
| Play에 올라간 앱 | 2.64 (versionCode 78) | `package.json` + `android/app/build.gradle` (둘이 같아야 빌드됨) |
| 서버 | main에 push하면 Vercel이 바로 배포 | — |
| 업데이트 권장 배너 기준 | 2.64 | `src/lib/appVersion.ts` `RECOMMENDED_APP_VERSION` |
| 최소 지원 버전 | 2.48 (올리면 그 아래는 앱을 못 씀, 거의 건드리지 않음) | 같은 파일 `MIN_SUPPORTED_APP_VERSION` |
| 다음 앱 버전 | 2.65 (versionCode 79) | — |

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

## 사용자에게 물어볼 것

- (없음)
