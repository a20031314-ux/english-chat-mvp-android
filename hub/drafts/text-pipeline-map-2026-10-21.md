# 글이 지나가는 곳 지도 — 모델 호출·코드 안 검사·자동 점검 (2026-10-21, main `ff884dd`)

> 채팅 교정·해석 등 **학습자 글이나 화면 글에 모델이 돌아가는 모든 곳**과, 그 결과를 **코드가 자동으로 고치거나 막는 곳**,
> 그리고 **요청 밖에서 자동으로 품질을 점검하는 곳**을 한 장에. 모델을 부르는 파일 40개를 모두 훑어 대조함.
> 모델 이름은 코드 기본값 — Vercel 환경변수(`OPENAI_*_MODEL`)가 있으면 그 값이 이김(운영 값은 확인 못 함).
> 2027-01-14 종료 예정 모델: gpt-4o-mini · gpt-4.1 · gpt-4.1-mini(`correction-models-2026-10-21.md`).

## 0. 모델 기본값 한눈에

| 쓰는 곳 | 환경변수 | 기본 모델 |
|---|---|---|
| 채팅·카드·해석·단어·문장분석·노트·영상 자막 대부분 | `OPENAI_MODEL` | gpt-4o-mini |
| 표현 묻기 | `OPENAI_ASK_MODEL` | gpt-4.1-mini |
| 미션 채점 | `OPENAI_MISSION_MODEL` | gpt-4.1-mini |
| 문장 분류·실수 종류 읽기 | `OPENAI_LEARNER_MODEL` | gpt-4.1-mini |
| 지도·미션 쓰기·지도에 넣기·약점 미션 | `OPENAI_CURRICULUM_MODEL` | gpt-4.1 |
| 통화 튜터(디렉터)·다시 말해보기 | `OPENAI_DIRECTOR_MODEL`·`OPENAI_PRACTICE_MODEL` | gpt-4.1-mini |
| 통화 돌아보기 | `OPENAI_REVIEW_MODEL` | gpt-5-mini |
| 통화·방 받아쓰기 | `OPENAI_TURN_TRANSCRIBE_MODEL` | gpt-4o-mini-transcribe |
| 영상 받아쓰기 | `OPENAI_TRANSCRIBE_MODEL` | whisper-1 |
| 영상 장면(비전) | `OPENAI_VISION_MODEL` | gpt-4o-mini |
| 목소리 | `OPENAI_TTS_MODEL` | gpt-4o-mini-tts |
| 사진·랜덤 화면 검사 | — | omni-moderation-latest(무료) |

정의만 있고 안 쓰는 것: `curriculumModel.ts`(gpt-4.1), `realtimeCallSession.ts`(gpt-realtime-2.1 — 비용 계산에만), op `roleplayCorrect`(부르는 곳 없음).

---

## 1. 채팅 (`/api/chat`, `ChatWindow.tsx`)

| 기능 | 언제 | 모델 | 무엇 | op |
|---|---|---|---|---|
| 첫 인사 | 대화 열 때 자동 | 4o-mini | 튜터가 먼저 말 걸기 | chatStart |
| **답 + 교정** | 보낼 때마다 | 4o-mini(사진이면 이미지도) | 답·고친 문장(corrected)·자연스러운 표현(natural)·설명 | chat |
| 설명 언어 고쳐 쓰기 | 설명이 학습 언어로 나왔을 때만 | 4o-mini | 설명을 UI 언어로 다시 | **미계측** |
| 고친 문장에 다시 답 | 고친 문장이 원문과 다를 때 | 4o-mini | 답을 고친 문장 기준으로 | chatReread |
| 표현 보기 카드 | 편한 말 줄 아래 버튼 | 4o-mini | 학습 언어 표현·예문(프리미엄은 더 쉬운/원어민 표현) | howToSayCard(+AI 도움) |
| 문장 분류 | 답 뒤 자동, 영어 학습만, 3단어 미만·고칠 데 없는 5단어 이하는 건너뜀(`learner/readGate.ts`, 2026-10-21) | 4.1-mini | 쓴 구문/놓친 구문 → My 자라는 중 | learnerObserve |
| 실수 종류 읽기 | 고친 줄 + 지도 있을 때 | 4.1-mini | 실수 이름·키 → 지도 | weakRead |
| 반복 실수 → 지도 미션 | 14일 안 2번 | 4.1 | 미션 한 개 | weakMission |

**코드 안 자동 검사·보정 (서버)**
- `koreanSlips.ts` 한국어 학습: ㅂ·ㄷ·르 불규칙 오용·어른께 반말을 표로 찾아 모델에 힌트, 모델 결과에 틀린 꼴이 남으면 서버가 직접 고침.
- `correctionGuard.ts shouldKeepLearnerLine` — 고침을 **되돌리는** 조건:
  - 글자 없는 줄(?·이모지만)
  - 학습 언어가 없던 줄이 학습 언어로 바뀜(고침이 아니라 번역)
  - 한국어 짧은 존댓말 답
  - 부호·대소문자만 다름
  - 2단어 이하 줄을 3단어 이상 늘림
  - 원래 낱말이 하나도 안 남음(다른 말로 바꿈)
- `asText` 등: JSON 모양이 틀려도 꺼내 쓰고, 비면 원문으로. 설명이 비면 14개 언어 고정 문장(`FALLBACK_EXPLANATION`).
- `explanationInLearningLanguage`: 따옴표 속 인용을 빼고 설명이 학습 언어 쪽이면 → 고쳐 쓰기 호출.
- `inputLanguage.ts writtenInLearningLanguage`: 줄이 학습 언어 연습인지 판정(문 체계·흔한 낱말·특수 글자).
- 표현 카드: `unwrapTutorHowToSay`(튜터식 되묻기 벗기기), `inLearningScript`(학습 언어 글자가 아니면 1회 재요청, **재요청 미계측**).
- 실수 읽기·미션: 학습자 문장을 12자 이상 베낀 이름 버림, 미션 과제에 답이 보이면 버림, focus가 UI 언어 아니면 1회 재요청(**미계측**).

**코드 안 자동 검사·보정 (앱, `correctionNorm.ts`)**
- 뜻을 바꾼 고침(내용어 50% 미만 남음)이나 문체만 바꾼 고침 → 고친 문장을 원문으로 되돌리고 natural로 옮김.
- 축약형·부정 극성(nothing=not anything)·군말(just, really…)은 실수로 안 침, 모델이 덧붙인 군말은 지움.
- "설명:" 접두어·"일시적인 오류" 설명 지움, 부호만 다른 고침은 교정 카드 숨김.
- 이모지 되돌림을 따로 막는 코드는 없음 — 위 "글자 없는 줄" 검사와 프롬프트 한 줄뿐(점검에서 재발 보고됨).

---

## 2. 해석·문장분석·단어·노트

| 기능 | 언제 | 모델 | 코드 안 검사·보정 | op |
|---|---|---|---|---|
| **해석(번역)** | 문장 시트·통화·방·DM·게시판·영상 줄 | 4o-mini | 비면 원문. 영상 줄은 시청자 공유 캐시(400일) 먼저. **언어 검사·재시도 없음** | translate / translateKept(+AI 도움) |
| 단어 검색 | 노트 단어장 검색 | 4o-mini | 표제어가 학습 언어 글자가 아니면 버림, 0개면 1회 재시도 | vocabSearch |
| 단어 뜻 | 낱말 탭 | 4o-mini | 요청 순서로 맞춤, 빠진 단어는 빈칸. 언어 검사 없음 | vocabGloss(+AI 도움) |
| 탭할 조각 나누기 | 문장을 그릴 때 자동 | 4o-mini | 원문 부분 문자열만, 80자·중복·문장 전체 버림. 실패 시 영어는 규칙, 다른 언어는 없음 | expressionUnits |
| 학습 조각(비영어 읽기·뜻) | 비영어 문장 그릴 때 자동 | 4o-mini | 부분 문자열만, 빈 곳은 Segmenter로 채움, 실패 시 규칙 | learningSpans(안 불러도 셈) |
| 표현 카드(선택 부분) | 부분 선택·탭 | 4o-mini | 선택이 문장에 없으면 400, 켜진 차원만·중복 차원 제거 | expressionInsight(+AI 도움) |
| **표현 묻기** | 시트에서 질문 입력 / 빠른 질문 3개 | 4.1-mini | 주제 밖 거절, 답이 학습 언어면 UI 언어로 1회 재요청, 하루 한도 | expressionAsk·Quick·Retry |
| 노트 주제 분류 | 노트 열 때 자동 | 4o-mini | 학습 언어별 공유 캐시, 목차에 없는 주제 버림 | notesPlace |
| 내 학습 묻기 | My 자라는 중 질문 | 4o-mini | 기록이 적으면 모델 안 부름, 800자 | learnerAsk |
| 문장분석(옛 앱 2.48~2.62) | 옛 시트 | 4o-mini | 빈 결과면 500 | analysisInput(배수 5, 실제 1) / analysisElement |

---

## 3. 통화·말하는 방·사람 사이

| 기능 | 언제 | 모델 | 코드 안 검사·보정 | op |
|---|---|---|---|---|
| 통화 받아쓰기 | 한 턴 말한 뒤 | 4o-mini-transcribe | "틀린 말도 그대로", 학습 언어 글자 20% 미만이면 지어낸 것으로 버림(`heardOrNothing`) | roleplayListen |
| 방 자막 받아쓰기 | 방·영상통화 쉼마다 | 같음 | 방 언어 둘 다 아니면 1회 다시 받아씀(**미계측**), 하루 자막 한도 | roomListen |
| **튜터 다음 말(디렉터)** | 매 턴 | 4.1-mini | `parseDirection`: 은행 줄로 바꾸기, 학습 언어 없는 메모(=번역) 버림, 단계 되돌림, 자유 턴 4번이면 복귀, 40턴 끝. JSON 깨지면 NO_DIRECTION(서버 재시도 없음, 앱이 1번 다시) | roleplayTurn |
| "이렇게 말하려던 거죠?" | 디렉터 응답 안 | (위와 같음) | 들은 말과 같거나 학습 언어 아니면 버림, 너무 다른 고쳐 쓰기 버림 | (포함) |
| 대화 요약 | 30줄 넘으면 10줄마다 | 4o-mini | 1200자 | roleplayContext |
| 돌아보기 | 버튼 | gpt-5-mini | 이유 없으면 버림 | roleplayReview |
| 다시 말해보기 | 돌아보기 뒤 | 4.1-mini | 비교는 규칙(`compareToTarget`) 먼저 | roleplayPractice |
| 목소리 | 녹음 없는 줄 | 4o-mini-tts | 장면 목소리는 1년 캐시 | tts |
| 방 힌트 | 방 줄이 편한 말 쪽일 때 | 4o-mini | 하루 40번, 학습 언어 아니면 1회 재요청 | roomHint |
| 이어 말하기 대기 | 말 끝이 접속어·쉼표면 | 규칙 | 최대 2번 더 들음 | — |
| 사진 검사 | 사진 올릴 때 | omni-moderation | 오류면 거절(fail-closed) | mediaUpload |
| Spin 화면 검사 | 3초마다 | omni-moderation | 오류면 통과(fail-open), 내 화면 걸리면 24시간 정지 | randomFrame |
| 통화 뒤 실수 읽기·미션 | 고친 말이 있을 때 | 4.1-mini / 4.1 | 채팅과 같음 | weakRead / weakMission |

**사람끼리 쓰는 글(DM·방 줄·게시판)에는 글 검사·욕설 필터가 없다.** 공백 정리·길이 자르기, 차단·정지, 신고(`/ops`에서 사람이 처리)뿐.

---

## 4. 영상 학습·콘텐츠 찾기

| 기능 | 언제 | 모델 | 코드 안 검사·보정 | op |
|---|---|---|---|---|
| 받아쓰기 | 영상 준비, 자막이 모자랄 때 | whisper-1 | 음악 줄·잡음 버림, 800줄 상한 | videoPrepare |
| 문장 나누기 | 부호 없는 긴 구간 | 4o-mini | 단어가 원문과 안 맞으면 쉬는 지점으로 대체 | videoPrepare |
| 언어 확인 | 나눈 뒤 | 규칙 | 학습 언어 아니면 거부 | — |
| 받아쓰기 다듬기 | 처음 20초 줄 | 4o-mini | 실패 줄은 공백·대문자만 | videoPrepare |
| 영상 개요·장면(비전) | 준비 때 | 4o-mini | 실패하면 제목·시간만 | videoPrepare |
| 원어민 해석 → UI 언어 자막 → 직역 검사·고쳐 쓰기 | 옛 앱 20초 창 | 4o-mini 여러 번 | 직역·빈 자막을 police → emergency → 줄별로 다시, 빈 자막은 절대 안 냄 | videoWindow |
| 줄 자막(gloss) | 2.67 전 빌드 | 4o-mini | 시청자 공유 캐시, 설명조 자막 버림 | videoGloss / videoGlossKept |
| 자막 해설 | 해설 열 때 | 4o-mini | 입력 정규화 | videoAnalyze |
| 검색어 번역·의도·순위 | 영상·읽을거리 찾기 | 4o-mini | 후보 거르기(언어·길이·중복) 규칙, 실패 시 원래 순서 | contentDiscovery |

준비·창 단계는 실제 호출 수가 op 배수(3·2)보다 훨씬 많다 — 비용 표가 적게 잡음.

---

## 5. 지도·미션

| 기능 | 언제 | 모델 | 코드 안 검사·보정 | op |
|---|---|---|---|---|
| 지도 만들기 | 목표·체크 제출 | 4.1 | 토픽 형식·중복·없는 영상 지움, 6개 미만이면 실패 | curriculumGenerate |
| 토픽 미션 | 처음 열 때 | 4.1 | 과제가 답을 드러내면 버림, 둘째 힌트는 답의 45%까지 | curriculumMissions |
| **미션 채점** | 답 제출 | 4.1-mini | 판정 3종 외 실패, 피드백이 학습 언어면 1회 재요청 | missionCheck |
| 채점 뒤 문장 분류 | 자동(readGate 같음) | 4.1-mini | | learnerObserve(2026-10-21부터 셈) |
| 지도에 넣기 | 시트 버튼 | 4.1 | 이미 고른 것은 모델 안 부름 | curriculumMissions + learnerPick(1번을 2번 셈) |

"오늘 해볼 것"·"자라는 중"은 모델 없이 규칙으로 계산(재료는 위 분류·실수·채점 결과).

---

## 6. 요청 밖 자동 점검

### 매 push·PR (GitHub Actions, 모두 규칙 — 모델·키 없음)
- **languages**: 화면 11개 언어에 영어로 남은 문구(`check:strings`), 학습 언어 14개 사실 확인(`check:languages` — 장면·TTS 음성·문자·뜻풀이 언어, 화면 문구에 한국어·영어 새는 것), 디자인 토큰, 타입, 테스트 묶음 chat·call·curriculum·subtitle.
- **cost**: 모델 부르는 route가 모두 `meterRequest` 하는지(`cost-coverage`) → `hub/costs.md`.
- **structure / data-map / ads-map**: 자리표 누락.
- **Store check**: 스토어 글자 수·금지 낱말·출시 노트 언어.

### 단위 테스트 중 글 품질
- CI에서 도는 것: 교정 가드 9 · 한국어 불규칙 5 · 입력 언어 판정 6 · 예문 언어 1 · 단어장 문자 1 · 받아쓰기 지어냄 11 · 다시 말해보기 14 · 자막 약 113.
- **CI에서 안 도는 것**: 번역(test:translate 10), 언어 기준·분석(test:salience), 방 문구(test:rooms), lint. 어떤 스크립트에도 안 걸린 테스트 파일: speech·splitSentences·expressionUnits·learningSpans·conversationMode·contentDiscovery normalize 등.

### 가상 사용자 (운영 API, `simcheck-` id)
- `detect.mjs`(규칙, 모든 턴): 빈 답·답 언어 틀림·프롬프트 새기·반복·카드 언어 = 오류 / 잘못 고침·놓친 고침·설명 언어·무례·수준 노출 = 경고(시드 문장 원어민 검수 전이라 경고만).
- 문장 종류 8칸(`--suite tiers`): 맞는 문장·실수 하나·여럿·섞음·편한 말만·짧은 답·엉뚱한 입력·단체방 동시 — 기준선과 비교.
- **sim-judge**(Claude 에이전트가 기준표로 판정, 중대한 것만 다른 에이전트가 재확인): 10-20 중대 10.6% → 10-21 11.6%, en:ko 2.2%, ko:en 11.0%.

### 예약 작업 (claude.ai, 정의는 저장소에 없음)
| 이름 | 주기 | 무엇 |
|---|---|---|
| 가상 사용자 기능 점검 | 6시간마다 | 묶음 회귀, 달라진 것만 보고함 |
| 가상 사용자 채팅 점검 | 하루 2번 | 채팅·8칸 98명 + Claude 평가 표본(회당 $3~5) |
| 가상 사용자 화면 점검 | 하루 1번 | 33장면 캡처 |
| 가상 사용자 일일 보고 | 매일 08:07 | 지난 24시간 묶어 한 장 |
| 의견함 정리 | 매일 08:53 | 의견 카드·반영 PR |
| 잊힌 일 알림 | 매일 아침 | 허브 오래된 일 폰 알림 |
| 서비스 지도 갱신 | 매일 06:52 | 지도 다시 만들기 |

### 수동 도구
- `check:conversation`: 언어별 튜터 대화 6턴을 4.1이 평가(돈 듦).
- `check:browser-languages`: 빌드한 앱을 언어 조합 3개로 모든 탭 열기.
- 번역 도구 `translate-ui-overlays.mjs`(번역 4.1 + 두 번째 모델 검토)·`translate-guide.mjs`(토큰·문단 수 규칙 검사).

---

## 7. 눈에 띈 빈틈 (고치지 않음, 정할 것)

1. **교정이 맞는지 보는 품질 판정은 CI에 없다** — 예약 채팅 점검의 표본 평가와 수동 도구뿐. 시드 문장도 원어민 검수 전.
2. **해석·단어 뜻에는 결과 언어 검사가 없다** — 채팅 설명·표현 묻기·미션 피드백에는 있는데 번역에는 없음.
3. **사람끼리 글(DM·방·게시판)에 글 검사가 없다** — 사진·Spin 화면만 자동 검사.
4. **비용 표가 실제와 어긋남:**
   - 미계측: 설명 고쳐 쓰기, 카드·방 힌트 재요청, 약점 미션 재요청, 방 자막 다시 받아쓰기, 받아쓰기 형식 바꿔 다시 부르기.
   - 적게 셈: 영상 준비·창·gloss는 실제 호출이 배수보다 훨씬 많음.
   - 많이 셈: 문장분석 입력(5→실제 1), 학습 조각(안 불러도 셈), 지도에 넣기(1번을 2번), 콘텐츠 찾기(캐시·채널 목록도 3), 통화 스트림 실패 뒤 다시 보낸 턴(2번).
   - 모델이 다름: `opCost.ts`는 문장 분류·실수 읽기를 gpt-4o-mini 값(`estimated`)으로 매기는데 코드 기본값은 gpt-4.1-mini(입출력 단가 약 2.7배) — 2026-10-21 토큰 어림을 고친 뒤에도 남음. 돌아보기는 gpt-5-mini인데 고정 $0.002.
5. **CI에서 안 도는 테스트**가 있음(번역·분석·방 문구·연결 안 된 파일들).
6. 죽은 것: op `roleplayCorrect`, `curriculumModel.ts`, `realtimeCallSession.ts` 모델 상수.
7. 2027-01-14 모델 종료는 운영 경로뿐 아니라 점검 도구(`check:conversation`·번역 도구·`llm.mjs`) 기본값에도 걸림.
