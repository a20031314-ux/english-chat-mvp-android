# 비용 구조 (자동 계산)

> **손으로 고치지 마세요.** `scripts/plan-cost.mjs`가 요금표(`src/lib/billing/plans.ts`)·기능별 단가(`src/lib/billing/opCost.ts`)·원가 가정(`src/lib/billing/cost.ts`)에서 만듭니다.
> main에 push하면 GitHub Actions(`cost.yml`)가 다시 계산해서, 바뀐 게 있으면 이 파일을 커밋합니다.
> 모두 **추정**입니다. 실제 사용량 비용은 `scripts/cost-report.mjs`(KV 키 필요, 사용자 PC).

## 주의

- **라이트 3,900원**: 한도를 매일 꽉 채우면 한 달 741원 손해 (수수료 뺀 3,315원 < 비용 4,056원).
- **플러스 5,500원**: 한도를 매일 꽉 채우면 한 달 1,047원 손해 (수수료 뺀 4,675원 < 비용 5,722원).
- **프리미엄 9,900원 (지금, 월 80포인트)**: 한도를 매일 꽉 채우면 한 달 92원 손해 (수수료 뺀 8,415원 < 비용 8,507원).
- **프리미엄 8,900원 (전환 후)**: 한도를 매일 꽉 채우면 한 달 2,953원 손해 (수수료 뺀 7,565원 < 비용 10,518원).
- 최악은 구독자 모두가 매일 모든 한도를 다 쓰는 경우입니다. 최악의 채팅 한 통 1.1원(모든 문장이 길고 틀림, 보통은 0.8원)은 잰 값이 아닌 가정(chat, learnerObserve, weakRead — 아래 "기능별 한 번 비용"의 토큰)이라, 실측 토큰이 쌓이면 `cost-report.mjs`로 다시 봐야 합니다.

## 요금별 한 달 비용 (30일)

- **최악**: 매일 한도를 꽉 채움. **많이 쓰는 사용자**: cost-report.mjs 실측 2026-10-16, 상위 10% — 하루 통화 7.1분 · 채팅 3번 · 팩 1번(요금 한도 안에서).
- 남는 돈 = 가격 − Play 수수료 15% − 비용. 구매 포인트·포인트 묶음은 따로 팔리므로 빼고 계산.

| 요금 | 하루 한도 | 수수료 뺀 금액 | 최악 비용 | 최악 남는 돈 | 많이 쓰는 사용자 비용 | 그때 남는 돈 |
|---|---|---|---|---|---|---|
| 무료 | 팩 1번 · 통화 없음(처음 20포인트 별도) · 채팅 7번 | — | 965원 | — | 803원 | — |
| 라이트 3,900원 | 팩 1번 · 통화 매일 7분 · 채팅 30번 | 3,315원 | 4,056원 | ⚠ -741원 (-22%) | 3,120원 | 195원 (6%) |
| 플러스 5,500원 | 팩 1번 · 통화 매일 10분 · 채팅 50번 | 4,675원 | 5,722원 | ⚠ -1,047원 (-22%) | 3,154원 | 1,521원 (33%) |
| 프리미엄 9,900원 (지금, 월 80포인트) | 팩 1번 · 월 80포인트 · 채팅 제한 없음(100번으로 계산) | 8,415원 | 8,507원 | ⚠ -92원 (-1%) | 3,154원 | 5,261원 (63%) |
| 프리미엄 8,900원 (전환 후) | 팩 3번 · 통화 매일 15분 · 채팅 100번 | 7,565원 | 10,518원 | ⚠ -2,953원 (-39%) | 3,154원 | 4,411원 (58%) |

최악 비용 내역:

| 요금 | 팩 | 자유 통화 | 채팅 | 월 포인트 |
|---|---|---|---|---|
| 무료 | 729원 | 0원 | 235원 | 0원 |
| 라이트 3,900원 | 729원 | 2,317원 | 1,009원 | 0원 |
| 플러스 5,500원 | 729원 | 3,310원 | 1,682원 | 0원 |
| 프리미엄 9,900원 (지금, 월 80포인트) | 729원 | 0원 | 3,364원 | 4,414원 |
| 프리미엄 8,900원 (전환 후) | 2,188원 | 4,965원 | 3,364원 | 0원 |

무료는 처음 한 번 20포인트(통화 100분, 약 1,103원)를 따로 씁니다. 이달의 영상(라이브러리)은 자막이 미리 만들어져 있어 비용에 넣지 않았습니다.

## 광고 (무료·안드로이드만)

`src/lib/billing/ads.ts` 처음 값 기준. 운영 값은 Vercel `ADS_*` 환경 변수가 바꿀 수 있습니다. 광고 수익은 한국 AdMob eCPM 대략값(보상형 $8~20, 전면 $3~10), 가정 2026-10-18.

| 무엇 | 원가 | 광고 수익(낮음~높음) | 남는 돈(낮음~높음) |
|---|---|---|---|
| 보상형 1회 = 채팅 3번 | 2.5원 | 11.2원 ~ 28원 | 8.7원 ~ 25.5원 |
| 전면 1회(채팅 2번마다 기준, 무료 기본 채팅을 메움) | 1.6원 | 4.2원 ~ 14원 | 2.6원 ~ 12.4원 |
| 앱 오프닝 1회(주는 것 없음) | 0원 | 2.8원 ~ 11.2원 | 같음 |
| 배너 노출 1회(약 60초마다, 주는 것 없음) | 0원 | 0.4원 ~ 1.4원 | 같음 |
| 보상형 하루 0번을 매일(한 달) | 0원 | 0원 ~ 0원 | 0원 ~ 0원 |

보상형으로 늘어난 채팅은 광고가 메우는 만큼만 줍니다. 무료 + 광고 최대치는 라이트 채팅 한도보다 작게(`ads.test.ts`가 지킴). 구독자는 광고가 없어 위 유료 손익과 별개입니다.

## 단위 비용

| 무엇 | 한 번 | 어떻게 |
|---|---|---|
| 자유 통화 1분 | 11원 | 15초 턴 4번: 캐릭터 판단(4.1-mini) + 음성 합성 5초 + 받아쓰기 6초 |
| 오늘의 팩 1번 | 24.3원 | 12문답 × (받아쓰기 + 판단) + 합성 35%만 (가정) |
| 채팅 1통(보통) | 0.8원 | chat + 문장 읽기 33% + 실수 읽기 33% (가정 — 짧고 맞은 줄·영어 아닌 학습 언어는 문장 읽기 건너뜀) |
| 채팅 1통(최악) | 1.1원 | chat + learnerObserve + weakRead 모두(길고 틀린 문장) |
| 포인트 1개 | 55.2원 | 통화 5분과 영상 3분 준비 중 비싼 쪽 |

## 기능별 한 번 비용 (요금 한도 밖 기능 포함)

요금 표에는 통화·팩·채팅만 들어갑니다. 아래 나머지(문장 분석·질문·번역·듣기 등)는 한도 없이 쓰이므로 많이 쓰는 기능이 생기면 여기서 단가를 보고 판단합니다.

| 기능(op) | 한 번 | 모델 호출 | 값 매기는 법 | 근거 |
|---|---|---|---|---|
| learnerPick | 9원 | 1 | gpt-4.1 2000/300 토큰 | 가정 |
| analysisInput | 3.4원 | 5 | gpt-4o-mini 2000/300 토큰 | 가정 |
| roleplayReview | 2.8원 | 1 | 한 번 고정값 | 가정 |
| tts | 2.1원 | 1 | 음성 합성 6초 | 가정 |
| contentDiscovery | 2원 | 3 | gpt-4o-mini 2000/300 토큰 | 가정 |
| videoPrepare | 2원 | 3 | 자막 단계 gpt-4o-mini | 가정 |
| videoWindow | 2원 | 3 | 자막 단계 gpt-4o-mini | 가정 |
| expressionAsk | 1.8원 | 1 | gpt-4.1-mini 2000/300 토큰 | 가정 |
| expressionAskQuick | 1.8원 | 1 | gpt-4.1-mini 2000/300 토큰 | 가정 |
| expressionAskRetry | 1.8원 | 1 | gpt-4.1-mini 2000/300 토큰 | 가정 |
| missionCheck | 1.8원 | 1 | gpt-4.1-mini 2000/300 토큰 | 가정 |
| roleplayPractice | 1.8원 | 1 | gpt-4.1-mini 2000/300 토큰 | 가정 |
| videoGloss | 1.3원 | 2 | gpt-4o-mini 2000/300 토큰 | 가정 |
| analysisElement | 0.7원 | 1 | gpt-4o-mini 2000/300 토큰 | 가정 |
| chat | 0.7원 | 1 | gpt-4o-mini 2000/300 토큰 | 가정 |
| chatReread | 0.7원 | 1 | gpt-4o-mini 2000/300 토큰 | 가정 |
| chatStart | 0.7원 | 1 | gpt-4o-mini 2000/300 토큰 | 가정 |
| curriculumGenerate | 0.7원 | 1 | gpt-4o-mini 2000/300 토큰 | 가정 |
| curriculumMissions | 0.7원 | 1 | gpt-4o-mini 2000/300 토큰 | 가정 |
| expressionInsight | 0.7원 | 1 | gpt-4o-mini 2000/300 토큰 | 가정 |
| expressionUnits | 0.7원 | 1 | gpt-4o-mini 2000/300 토큰 | 가정 |
| howToSay | 0.7원 | 1 | gpt-4o-mini 2000/300 토큰 | 가정 |
| howToSayCard | 0.7원 | 1 | gpt-4o-mini 2000/300 토큰 | 가정 |
| learnerAsk | 0.7원 | 1 | gpt-4o-mini 2000/300 토큰 | 가정 |
| learningSpans | 0.7원 | 1 | gpt-4o-mini 2000/300 토큰 | 가정 |
| notesPlace | 0.7원 | 1 | gpt-4o-mini 2000/300 토큰 | 가정 |
| roleplayContext | 0.7원 | 1 | gpt-4o-mini 2000/300 토큰 | 가정 |
| roleplayCorrect | 0.7원 | 1 | gpt-4o-mini 2000/300 토큰 | 가정 |
| roomHint | 0.7원 | 1 | gpt-4o-mini 2000/300 토큰 | 가정 |
| translate | 0.7원 | 1 | gpt-4o-mini 2000/300 토큰 | 가정 |
| videoAnalyze | 0.7원 | 1 | gpt-4o-mini 2000/300 토큰 | 가정 |
| vocabGloss | 0.7원 | 1 | gpt-4o-mini 2000/300 토큰 | 가정 |
| vocabSearch | 0.7원 | 1 | gpt-4o-mini 2000/300 토큰 | 가정 |
| weakMission | 0.7원 | 1 | gpt-4o-mini 2000/300 토큰 | 가정 |
| roleplayTurn | 0.6원 | 1 | gpt-4.1-mini 851/50 토큰 | 잰 값 |
| roleplayListen | 0.4원 | 1 | 받아쓰기 6초 | 가정 |
| roomListen | 0.4원 | 1 | 받아쓰기 6초 | 가정 |
| learnerObserve | 0.3원 | 1 | gpt-4o-mini 900/80 토큰 | 가정 |
| weakRead | 0.2원 | 1 | gpt-4o-mini 600/80 토큰 | 가정 |
| mediaUpload | 0.1원 | 1 | 한 번 고정값 | 가정 |
| randomFrame | 0원 | 1 | 한 번 고정값 | 가정 |
| roleplayBankLine | 0원 | 0 | 돈 안 듦(비율용 기록) | — |
| roleplayInventedLine | 0원 | 0 | 돈 안 듦(비율용 기록) | — |
| roleplayReactionLine | 0원 | 0 | 돈 안 듦(비율용 기록) | — |
| roleplaySession | 0원 | 0 | 돈 안 듦(비율용 기록) | — |
| roleplaySplitTurn | 0원 | 0 | 돈 안 듦(비율용 기록) | — |
| translateKept | 0원 | 0 | 돈 안 듦(비율용 기록) | — |
| videoGlossKept | 0원 | 0 | 돈 안 듦(비율용 기록) | — |

## 포인트 묶음

| 상품 | 포인트 | 가격 | 수수료 뺀 금액 | 비용 | 남는 비율 |
|---|---|---|---|---|---|
| points_30 | 30 | 4,500원 | 3,825원 | 1,655원 | 57% |
| points_60 | 60 | 8,900원 | 7,565원 | 3,310원 | 56% |
| points_200 | 200 | 28,900원 | 24,565원 | 11,034원 | 55% |
| points_500 | 500 | 69,900원 | 59,415원 | 27,586원 | 54% |

## 기록 확인

모델을 쓰는 서버 경로 31개 중 31개가 사용량을 기록합니다 (`scripts/cost-coverage.mjs`).

## 가정 (믿기 어려운 숫자부터 확인)

- 모델 단가: https://developers.openai.com/api/docs/pricing (2026-09-04 확인). 1달러 1400원(2026-09-04).
- 음성 합성 분당 $0.015 — 통화 비용의 대부분, `cost.ts`에서 가장 약한 숫자.
- 잰 적 없는 모델 호출 한 번 = 2000/300 토큰. 실측 보고서는 서버가 잰 토큰(`usage:tok:*`)이 20번 넘게 쌓인 기능부터 그 값을 씁니다.
- 가정으로 값을 매기는 기능 40개: chat, chatReread, howToSay, howToSayCard, roomHint, mediaUpload, randomFrame, chatStart, learnerAsk, analysisInput, analysisElement, expressionInsight, expressionAsk, expressionAskRetry, expressionAskQuick, curriculumGenerate, learnerObserve, curriculumMissions, learnerPick, notesPlace, missionCheck, weakRead, weakMission, vocabGloss, learningSpans, translate, tts, videoPrepare, videoWindow, videoGloss, videoAnalyze, roleplayListen, roomListen, roleplayCorrect, roleplayContext, roleplayReview, roleplayPractice, expressionUnits, vocabSearch, contentDiscovery.

## 새 기능을 넣을 때

1. 모델을 부르는 route에 `meterRequest(request, "<op>")` — 빠지면 CI의 `cost-coverage`가 실패.
2. op를 `src/lib/server/modelCalls.ts`(호출 횟수)와 `src/lib/billing/opCost.ts`(값 매기는 법)에 — 빠지면 `opCost.test.ts`가 실패.
3. 요금 한도에 들어가는 기능이면(채팅 한 통에 따라붙는 호출 등) `opCost.ts`의 `CHAT_MESSAGE_OPS`·`PACK`이나 `scripts/plan-cost.mjs`에 반영.
4. push하면 이 파일이 저절로 다시 계산됩니다.
