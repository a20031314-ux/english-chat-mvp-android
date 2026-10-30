# 비용 구조 (자동 계산)

> **손으로 고치지 마세요.** `scripts/plan-cost.mjs`가 요금표(`src/lib/billing/plans.ts`)·기능별 단가(`src/lib/billing/opCost.ts`)·원가 가정(`src/lib/billing/cost.ts`)에서 만듭니다.
> main에 push하면 GitHub Actions(`cost.yml`)가 다시 계산해서, 바뀐 게 있으면 이 파일을 커밋합니다.
> 모두 **추정**입니다. 실제 사용량 비용은 `scripts/cost-report.mjs`(KV 키 필요, 사용자 PC).

## 주의

- **대본 플랜 2,900원**: 한도를 매일 꽉 채우면 한 달 2,132원 손해 (수수료 뺀 2,465원 < 비용 4,597원).
- **라이트 3,900원**: 한도를 매일 꽉 채우면 한 달 4,905원 손해 (수수료 뺀 3,315원 < 비용 8,220원).
- **플러스 5,500원**: 한도를 매일 꽉 채우면 한 달 5,790원 손해 (수수료 뺀 4,675원 < 비용 10,465원).
- **프리미엄 9,900원 (지금, 월 80포인트)**: 한도를 매일 꽉 채우면 한 달 7,562원 손해 (수수료 뺀 8,415원 < 비용 15,977원).
- **프리미엄 8,900원 (전환 후)**: 한도를 매일 꽉 채우면 한 달 10,722원 손해 (수수료 뺀 7,565원 < 비용 18,287원).
- 최악은 구독자 모두가 매일 모든 한도를 다 쓰는 경우입니다. 최악의 채팅 한 통 1.5원(모든 문장이 길고 틀림, 보통은 1원)은 잰 값이 아닌 가정(chat, chatReply, learnerObserve, weakRead, notebookFix — 아래 "기능별 한 번 비용"의 토큰)이라, 실측 토큰이 쌓이면 `cost-report.mjs`로 다시 봐야 합니다.

## 요금별 한 달 비용 (30일)

- **최악**: 매일 한도를 꽉 채움(대본은 요금별 하루 내 줄 한도). **많이 쓰는 사용자**: cost-report.mjs 실측 2026-10-16, 상위 10% — 하루 통화 7.1분 · 채팅 3번 · 팩 1번 · 대본 내 줄 12번(가정, 요금 한도 안에서).
- 남는 돈 = 가격 − Play 수수료 15% − 비용. 구매 포인트·포인트 묶음은 따로 팔리므로 빼고 계산.

| 요금 | 하루 한도 | 수수료 뺀 금액 | 최악 비용 | 최악 남는 돈 | 많이 쓰는 사용자 비용 | 그때 남는 돈 |
|---|---|---|---|---|---|---|
| 무료(2.75 이하 앱) | 대본 25줄 · 팩 1번 · 통화 없음(처음 10포인트 별도) · 채팅 7번 | — | 4,046원 | — | 2,288원 | — |
| 무료(2.76~ 대본 앱) | 대본 25줄 · 팩 없음 · 통화 없음 · 채팅 0번 | — | 2,951원 | — | 1,416원 | — |
| 대본 플랜 2,900원 | 대본 25줄 · 팩 없음 · 통화 3일마다 5분 · 채팅 20번 | 2,465원 | 4,597원 | ⚠ -2,132원 (-86%) | 2,255원 | 210원 (9%) |
| 라이트 3,900원 | 대본 25줄 · 팩 1번 · 통화 매일 7분 · 채팅 30번 | 3,315원 | 8,220원 | ⚠ -4,905원 (-148%) | 5,428원 | ⚠ -2,113원 (-64%) |
| 플러스 5,500원 | 대본 25줄 · 팩 1번 · 통화 매일 10분 · 채팅 50번 | 4,675원 | 10,465원 | ⚠ -5,790원 (-124%) | 5,473원 | ⚠ -798원 (-17%) |
| 프리미엄 9,900원 (지금, 월 80포인트) | 대본 40줄 · 팩 1번 · 월 80포인트 · 채팅 제한 없음(100번으로 계산) | 8,415원 | 15,977원 | ⚠ -7,562원 (-90%) | 5,473원 | 2,942원 (35%) |
| 프리미엄 8,900원 (전환 후) | 대본 40줄 · 팩 3번 · 통화 매일 15분 · 채팅 100번 | 7,565원 | 18,287원 | ⚠ -10,722원 (-142%) | 5,473원 | 2,092원 (28%) |

최악 비용 내역:

| 요금 | 대본 | 팩 | 자유 통화 | 채팅 | 월 포인트 |
|---|---|---|---|---|---|
| 무료(2.75 이하 앱) | 2,951원 | 781원 | 0원 | 315원 | 0원 |
| 무료(2.76~ 대본 앱) | 2,951원 | 0원 | 0원 | 0원 | 0원 |
| 대본 플랜 2,900원 | 2,951원 | 0원 | 748원 | 899원 | 0원 |
| 라이트 3,900원 | 2,951원 | 781원 | 3,140원 | 1,348원 | 0원 |
| 플러스 5,500원 | 2,951원 | 781원 | 4,486원 | 2,247원 | 0원 |
| 프리미엄 9,900원 (지금, 월 80포인트) | 4,721원 | 781원 | 0원 | 4,494원 | 5,981원 |
| 프리미엄 8,900원 (전환 후) | 4,721원 | 2,344원 | 6,729원 | 4,494원 | 0원 |

무료는 처음 한 번 10포인트(통화 50분, 약 748원)를 따로 씁니다. 이달의 영상(라이브러리)은 자막이 미리 만들어져 있어 비용에 넣지 않았습니다.

## 광고 (무료·안드로이드만)

`src/lib/billing/ads.ts` 처음 값 기준. 운영 값은 Vercel `ADS_*` 환경 변수가 바꿀 수 있습니다. 광고 수익은 한국 AdMob eCPM 대략값(보상형 $8~20, 전면 $3~10), 가정 2026-10-18.

| 무엇 | 원가 | 광고 수익(낮음~높음) | 남는 돈(낮음~높음) |
|---|---|---|---|
| 보상형 1회 = 채팅 3번 | 3원 | 11.2원 ~ 28원 | 8.2원 ~ 25원 |
| 전면 1회(채팅 2번마다 기준, 무료 기본 채팅을 메움) | 2원 | 4.2원 ~ 14원 | 2.2원 ~ 12원 |
| 앱 오프닝 1회(주는 것 없음) | 0원 | 2.8원 ~ 11.2원 | 같음 |
| 배너 노출 1회(약 60초마다, 주는 것 없음) | 0원 | 0.4원 ~ 1.4원 | 같음 |
| 보상형 하루 0번을 매일(한 달) | 0원 | 0원 ~ 0원 | 0원 ~ 0원 |

보상형으로 늘어난 채팅은 광고가 메우는 만큼만 줍니다. 무료 + 광고 최대치는 라이트 채팅 한도보다 작게(`ads.test.ts`가 지킴). 구독자는 광고가 없어 위 유료 손익과 별개입니다.

## 단위 비용

| 무엇 | 한 번 | 어떻게 |
|---|---|---|
| 자유 통화 1분 | 15원 | 15초 턴 4번: 캐릭터 판단(gpt-6-luna) + 음성 합성 5초(gpt-realtime-2.1-mini) + 받아쓰기 6초(scribe_v2) |
| 오늘의 팩 1번 | 26원 | 12문답 × (받아쓰기 + 판단) + 합성 35%만 (가정) |
| 채팅 1통(보통) | 1원 | chat + 문장 읽기 33% + 실수 읽기 33% + 노트 칸 고르기 33% (가정 — 짧고 맞은 줄·영어 아닌 학습 언어는 문장 읽기 건너뜀) |
| 채팅 1통(최악) | 1.5원 | chat + chatReply + learnerObserve + weakRead + notebookFix 모두(길고 틀린 문장) |
| 포인트 1개 | 74.8원 | 통화 5분과 영상 3분 준비 중 비싼 쪽 |

## 기능별 한 번 비용 (요금 한도 밖 기능 포함)

요금 표에는 통화·팩·채팅만 들어갑니다. 아래 나머지(문장 분석·질문·번역·듣기 등)는 한도 없이 쓰이므로 많이 쓰는 기능이 생기면 여기서 단가를 보고 판단합니다.

| 기능(op) | 한 번 | 모델 호출 | 값 매기는 법 | 근거 |
|---|---|---|---|---|
| curriculumGenerate | 65.8원 | 1 | claude-sonnet-5-5 3500/4000 토큰 (기능 curriculumMap) | 가정 |
| curriculumMapFill | 36.4원 | 1 | claude-sonnet-5-5 4000/1800 토큰 (기능 curriculumMapFill) | 가정 |
| stageReadings | 21.4원 | 3 | claude-haiku-5-5 6000/9000 토큰 (기능 translate) | 가정 |
| scriptChoices | 19.6원 | 2 | claude-sonnet-5-5 2000/300 토큰 (기능 scriptChoices) | 가정 |
| roleplayReview | 15.4원 | 1 | claude-sonnet-5-5 1500/800 토큰 (기능 roleplayReview) | 가정 |
| wordCards | 13.3원 | 2 | claude-haiku-5-5 2500/9000 토큰 (기능 translate) | 가정 |
| scriptRecheck | 9.8원 | 1 | claude-sonnet-5-5 2000/300 토큰 (기능 scriptRecheck) | 가정 |
| chatVerify | 5.3원 | 1 | claude-sonnet-5-5 900/200 토큰 (기능 chatVerify) | 가정 |
| tts | 3.7원 | 1 | 음성 합성 6초 gpt-realtime-2.1-mini | 가정 |
| stageCopy | 3.6원 | 1 | claude-haiku-5-5 3500/4500 토큰 (기능 translate) | 가정 |
| analysisInput | 2.5원 | 5 | claude-haiku-5-5 2000/300 토큰 (기능 analysis) | 가정 |
| contentDiscovery | 1.5원 | 3 | claude-haiku-5-5 2000/300 토큰 (기능 video) | 가정 |
| videoPrepare | 1.5원 | 3 | 자막 단계 claude-haiku-5-5 | 가정 |
| videoWindow | 1.5원 | 3 | 자막 단계 claude-haiku-5-5 | 가정 |
| frameLesson | 1.2원 | 2 | claude-haiku-5-5 700/700 토큰 (기능 translate) | 가정 |
| notebookPhrases | 1원 | 1 | claude-haiku-5-5 2700/900 토큰 (기능 notes) | 가정 |
| videoGloss | 1원 | 2 | claude-haiku-5-5 2000/300 토큰 (기능 video) | 가정 |
| recallPrompts | 0.9원 | 2 | claude-haiku-5-5 600/500 토큰 (기능 translate) | 가정 |
| roleplayListen | 0.5원 | 1 | 받아쓰기 6초 scribe_v2 | 가정 |
| roomFixListen | 0.5원 | 1 | 받아쓰기 6초 scribe_v2 | 가정 |
| roomListen | 0.5원 | 1 | 받아쓰기 6초 scribe_v2 | 가정 |
| analysisElement | 0.5원 | 1 | claude-haiku-5-5 2000/300 토큰 (기능 analysis) | 가정 |
| chat | 0.5원 | 1 | claude-haiku-5-5 2000/300 토큰 (기능 chat) | 가정 |
| chatReread | 0.5원 | 1 | claude-haiku-5-5 2000/300 토큰 (기능 chat) | 가정 |
| chatStart | 0.5원 | 1 | claude-haiku-5-5 2000/300 토큰 (기능 chat) | 가정 |
| curriculumMissions | 0.5원 | 1 | gpt-6-luna 2000/300 토큰 (기능 curriculum) | 가정 |
| expressionAsk | 0.5원 | 1 | claude-haiku-5-5 2000/300 토큰 (기능 ask) | 가정 |
| expressionAskQuick | 0.5원 | 1 | claude-haiku-5-5 2000/300 토큰 (기능 ask) | 가정 |
| expressionAskRetry | 0.5원 | 1 | claude-haiku-5-5 2000/300 토큰 (기능 ask) | 가정 |
| expressionInsight | 0.5원 | 1 | claude-haiku-5-5 2000/300 토큰 (기능 expression) | 가정 |
| expressionUnits | 0.5원 | 1 | claude-haiku-5-5 2000/300 토큰 (기능 analysis) | 가정 |
| howToSay | 0.5원 | 1 | claude-haiku-5-5 2000/300 토큰 (기능 howToSay) | 가정 |
| howToSayCard | 0.5원 | 1 | claude-haiku-5-5 2000/300 토큰 (기능 howToSay) | 가정 |
| learnerAsk | 0.5원 | 1 | claude-haiku-5-5 2000/300 토큰 (기능 learnerAsk) | 가정 |
| learnerPick | 0.5원 | 1 | gpt-6-luna 2000/300 토큰 (기능 curriculum) | 가정 |
| learningSpans | 0.5원 | 1 | claude-haiku-5-5 2000/300 토큰 (기능 analysis) | 가정 |
| missionCheck | 0.5원 | 1 | gpt-6-luna 2000/300 토큰 (기능 mission) | 가정 |
| notesPlace | 0.5원 | 1 | claude-haiku-5-5 2000/300 토큰 (기능 notes) | 가정 |
| roleplayContext | 0.5원 | 1 | claude-haiku-5-5 2000/300 토큰 (기능 roleplayContext) | 가정 |
| roleplayCorrect | 0.5원 | 1 | gpt-6-luna 2000/300 토큰 (기능 roleplayTutor) | 가정 |
| roleplayPractice | 0.5원 | 1 | claude-haiku-5-5 2000/300 토큰 (기능 roleplayPractice) | 가정 |
| scriptJudge | 0.5원 | 1 | claude-haiku-5-5 2000/300 토큰 (기능 scriptJudge) | 가정 |
| translate | 0.5원 | 1 | claude-haiku-5-5 2000/300 토큰 (기능 translate) | 가정 |
| videoAnalyze | 0.5원 | 1 | claude-haiku-5-5 2000/300 토큰 (기능 video) | 가정 |
| vocabGloss | 0.5원 | 1 | claude-haiku-5-5 2000/300 토큰 (기능 vocab) | 가정 |
| vocabSearch | 0.5원 | 1 | claude-haiku-5-5 2000/300 토큰 (기능 vocab) | 가정 |
| weakMission | 0.5원 | 1 | gpt-6-luna 2000/300 토큰 (기능 curriculum) | 가정 |
| notebookFix | 0.4원 | 1 | claude-haiku-5-5 2300/120 토큰 (기능 notes) | 가정 |
| notebookLocate | 0.4원 | 1 | claude-haiku-5-5 2400/80 토큰 (기능 notes) | 가정 |
| roomGameStory | 0.4원 | 1 | claude-haiku-5-5 250/500 토큰 (기능 roomGame) | 가정 |
| chatReply | 0.3원 | 1 | claude-haiku-5-5 1400/120 토큰 (기능 chat) | 가정 |
| roomFix | 0.2원 | 1 | claude-haiku-5-5 900/120 토큰 (기능 roomFix) | 가정 |
| learnerObserve | 0.2원 | 1 | claude-haiku-5-5 900/80 토큰 (기능 learnerRead) | 가정 |
| roomGameWord | 0.2원 | 1 | claude-haiku-5-5 450/160 토큰 (기능 roomGame) | 가정 |
| roleplayTurn | 0.2원 | 1 | gpt-6-luna 851/50 토큰 (기능 roleplayTutor) | 잰 값 |
| weakRead | 0.1원 | 1 | claude-haiku-5-5 600/80 토큰 (기능 learnerRead) | 가정 |
| iconUpload | 0.1원 | 3 | 한 번 고정값 | 가정 |
| mediaUpload | 0.1원 | 1 | 한 번 고정값 | 가정 |
| roomGameJudge | 0원 | 1 | claude-haiku-5-5 220/20 토큰 (기능 roomGame) | 가정 |
| randomFrame | 0원 | 1 | 한 번 고정값 | 가정 |
| roleplayBankLine | 0원 | 0 | 돈 안 듦(비율용 기록) | — |
| roleplayInventedLine | 0원 | 0 | 돈 안 듦(비율용 기록) | — |
| roleplayReactionLine | 0원 | 0 | 돈 안 듦(비율용 기록) | — |
| roleplaySession | 0원 | 0 | 돈 안 듦(비율용 기록) | — |
| roleplaySplitTurn | 0원 | 0 | 돈 안 듦(비율용 기록) | — |
| translateKept | 0원 | 0 | 돈 안 듦(비율용 기록) | — |
| videoGlossKept | 0원 | 0 | 돈 안 듦(비율용 기록) | — |

## 계산에 쓴 모델 (코드 기본값, `src/lib/aiDefaults.ts`)

기능마다 지금 코드 기본값이 고르는 모델과 그 단가(`src/lib/billing/modelPrices.ts`)로 위 숫자를 냈습니다. 기본 모델을 바꾸는 커밋을 main에 올리면 GitHub Actions(`cost`)가 이 파일을 다시 계산해 커밋합니다 — 손으로 고치지 않습니다.
Vercel에 `MODEL_ROUTES`·`OPENAI_*_MODEL`·`TTS_ENGINE` 값을 넣었다면 운영은 그 모델을 쓰지만, 저장소에서는 볼 수 없어 이 표에 반영되지 않습니다.

| 기능 | 모델 | 입력/출력 (100만 토큰당) | 출처 |
|---|---|---|---|
| chat | claude-haiku-5-5 | $0.1 / $0.5 | platform.claude.com pricing 2026-10-22 (10만 토큰 이하 프롬프트) |
| howToSay | claude-haiku-5-5 | $0.1 / $0.5 | platform.claude.com pricing 2026-10-22 (10만 토큰 이하 프롬프트) |
| roomFix | claude-haiku-5-5 | $0.1 / $0.5 | platform.claude.com pricing 2026-10-22 (10만 토큰 이하 프롬프트) |
| roomGame | claude-haiku-5-5 | $0.1 / $0.5 | platform.claude.com pricing 2026-10-22 (10만 토큰 이하 프롬프트) |
| translate | claude-haiku-5-5 | $0.1 / $0.5 | platform.claude.com pricing 2026-10-22 (10만 토큰 이하 프롬프트) |
| vocab | claude-haiku-5-5 | $0.1 / $0.5 | platform.claude.com pricing 2026-10-22 (10만 토큰 이하 프롬프트) |
| analysis | claude-haiku-5-5 | $0.1 / $0.5 | platform.claude.com pricing 2026-10-22 (10만 토큰 이하 프롬프트) |
| expression | claude-haiku-5-5 | $0.1 / $0.5 | platform.claude.com pricing 2026-10-22 (10만 토큰 이하 프롬프트) |
| notes | claude-haiku-5-5 | $0.1 / $0.5 | platform.claude.com pricing 2026-10-22 (10만 토큰 이하 프롬프트) |
| learnerAsk | claude-haiku-5-5 | $0.1 / $0.5 | platform.claude.com pricing 2026-10-22 (10만 토큰 이하 프롬프트) |
| roleplayContext | claude-haiku-5-5 | $0.1 / $0.5 | platform.claude.com pricing 2026-10-22 (10만 토큰 이하 프롬프트) |
| video | claude-haiku-5-5 | $0.1 / $0.5 | platform.claude.com pricing 2026-10-22 (10만 토큰 이하 프롬프트) |
| vision | claude-haiku-5-5 | $0.1 / $0.5 | platform.claude.com pricing 2026-10-22 (10만 토큰 이하 프롬프트) |
| roleplayTutor | gpt-6-luna (OpenAI 기본) | $0.1 / $0.5 | hub/MODELS.md 2026-10-21 조사 |
| roleplayPractice | claude-haiku-5-5 | $0.1 / $0.5 | platform.claude.com pricing 2026-10-22 (10만 토큰 이하 프롬프트) |
| scriptJudge | claude-haiku-5-5 | $0.1 / $0.5 | platform.claude.com pricing 2026-10-22 (10만 토큰 이하 프롬프트) |
| scriptRecheck | claude-sonnet-5-5 | $2 / $10 | platform.claude.com pricing 2026-10-22 |
| scriptChoices | claude-sonnet-5-5 | $2 / $10 | platform.claude.com pricing 2026-10-22 |
| ask | claude-haiku-5-5 | $0.1 / $0.5 | platform.claude.com pricing 2026-10-22 (10만 토큰 이하 프롬프트) |
| mission | gpt-6-luna (OpenAI 기본) | $0.1 / $0.5 | hub/MODELS.md 2026-10-21 조사 |
| curriculum | gpt-6-luna (OpenAI 기본) | $0.1 / $0.5 | hub/MODELS.md 2026-10-21 조사 |
| curriculumMap | claude-sonnet-5-5 | $2 / $10 | platform.claude.com pricing 2026-10-22 |
| curriculumMapFill | claude-sonnet-5-5 | $2 / $10 | platform.claude.com pricing 2026-10-22 |
| learnerRead | claude-haiku-5-5 | $0.1 / $0.5 | platform.claude.com pricing 2026-10-22 (10만 토큰 이하 프롬프트) |
| roleplayReview | claude-sonnet-5-5 | $2 / $10 | platform.claude.com pricing 2026-10-22 |
| chatVerify | claude-sonnet-5-5 | $2 / $10 | platform.claude.com pricing 2026-10-22 |
| 받아쓰기 — 통화·방 한 마디 | scribe_v2 | 분당 $0.0036 | hub/drafts/speech-models-2026-10-21.md (한 줄 6초 약 0.5원) |
| 받아쓰기 — 방 교정 두 번째 의견 | scribe_v2 | 분당 $0.0036 | hub/drafts/speech-models-2026-10-21.md (한 줄 6초 약 0.5원) |
| 받아쓰기 — 영상(자막 없을 때) | scribe_v2 | 분당 $0.0036 | hub/drafts/speech-models-2026-10-21.md (한 줄 6초 약 0.5원) |
| 목소리 | gpt-realtime-2.1-mini | 분당 $0.0264 | hub/drafts/speech-models-2026-10-21.md 어림 |

## 포인트 묶음

| 상품 | 포인트 | 가격 | 수수료 뺀 금액 | 비용 | 남는 비율 |
|---|---|---|---|---|---|
| points_30 | 30 | 4,500원 | 3,825원 | 2,243원 | 41% |
| points_60 | 60 | 8,900원 | 7,565원 | 4,486원 | 41% |
| points_200 | 200 | 28,900원 | 24,565원 | 14,953원 | 39% |
| points_500 | 500 | 69,900원 | 59,415원 | 37,381원 | 37% |

## 기록 확인

모델을 쓰는 서버 경로 44개 중 44개가 사용량을 기록합니다 (`scripts/cost-coverage.mjs`).

## 가정 (믿기 어려운 숫자부터 확인)

- 모델 단가: https://developers.openai.com/api/docs/pricing (2026-09-04 확인). 1달러 1400원(2026-09-04).
- 음성 합성 분당 $0.0264 — 통화 비용의 대부분, `cost.ts`에서 가장 약한 숫자.
- 잰 적 없는 모델 호출 한 번 = 2000/300 토큰. 실측 보고서는 서버가 잰 토큰(`usage:tok:*`)이 20번 넘게 쌓인 기능부터 그 값을 씁니다.
- 가정으로 값을 매기는 기능 59개: chat, chatReread, chatReply, howToSay, howToSayCard, mediaUpload, iconUpload, randomFrame, chatStart, learnerAsk, analysisInput, analysisElement, expressionInsight, chatVerify, expressionAsk, expressionAskRetry, expressionAskQuick, curriculumGenerate, curriculumMapFill, stageCopy, wordCards, recallPrompts, frameLesson, stageReadings, learnerObserve, curriculumMissions, learnerPick, notesPlace, notebookFix, notebookPhrases, notebookLocate, missionCheck, weakRead, weakMission, vocabGloss, learningSpans, translate, tts, videoPrepare, videoWindow, videoGloss, videoAnalyze, roleplayListen, roomListen, roomFix, roomFixListen, roomGameWord, roomGameJudge, roomGameStory, roleplayCorrect, roleplayContext, roleplayReview, roleplayPractice, scriptJudge, scriptRecheck, scriptChoices, expressionUnits, vocabSearch, contentDiscovery.

## 새 기능을 넣을 때

1. 모델을 부르는 route에 `meterRequest(request, "<op>")` — 빠지면 CI의 `cost-coverage`가 실패.
2. op를 `src/lib/server/modelCalls.ts`(호출 횟수)와 `src/lib/billing/opCost.ts`(값 매기는 법)에 — 빠지면 `opCost.test.ts`가 실패.
3. 요금 한도에 들어가는 기능이면(채팅 한 통에 따라붙는 호출 등) `opCost.ts`의 `CHAT_MESSAGE_OPS`·`PACK`이나 `scripts/plan-cost.mjs`에 반영.
4. 모델을 바꿀 때는 `src/lib/aiDefaults.ts`(기능의 기본 모델)만 고치면 됩니다. 새 모델이면 `src/lib/billing/modelPrices.ts`에 단가 — 없으면 `opCost.test.ts`가 실패.
5. push하면 이 파일이 저절로 다시 계산됩니다.
