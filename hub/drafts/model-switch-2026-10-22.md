# 받아쓰기·목소리·통화 돌아보기 교체안 + 비용 표 자동화 (2026-10-22)

사용자 요청: "받아쓰기, 목소리, 통화 돌아보기, 비용 표 교체 고려해줘. 비용표는 코드 변경에 따라 자동으로 업데이트되게 설계해줘".

## 1. 비용 표 자동화 (만듦, 2026-10-22)

- **한 장에 기본 모델:** `src/lib/aiDefaults.ts` — 글 기능 20개의 OpenAI 기본 모델(`OPENAI_TEXT_DEFAULTS`)·코드 기본 경로(`DEFAULT_ROUTES`, Haiku·Sonnet)·받아쓰기·목소리 기본값(`SPEECH_DEFAULTS`).
  서버(`llm.ts`·`speechModels.ts`·`openai.ts`·`secondListen.ts`)와 비용 계산(`cost.ts`·`opCost.ts`)이 같은 이름을 읽는다.
- **단가 한 장:** `src/lib/billing/modelPrices.ts`(글 100만 토큰당·받아쓰기 분당·목소리 분당, 출처 포함).
- **op는 모델이 아니라 기능(task)을 적는다**(`opCost.ts` `llm("chat")` 등) → 그 기능의 지금 모델 단가로 계산.
- **CI가 지키는 것:** 기본 모델에 단가가 없으면 `opCost.test.ts` 실패 / op의 기능이 그 op를 기록하는 경로가 실제로 부르는 기능이 아니면 `cost-coverage.mjs` 실패 / main push마다 `cost` 작업이 `hub/costs.md`를 다시 계산해 커밋(그대로).
- `hub/costs.md`에 새 절 "계산에 쓴 모델" — 기능별 모델·단가·출처. Vercel 값(`MODEL_ROUTES` 등)은 저장소에서 안 보여 반영 못 한다고 적음.
- **바로 드러난 것:** 문장 읽기(learnerObserve)·실수 읽기(weakRead)가 실제로는 gpt-4.1-mini(`learnerRead`)인데 표는 gpt-4o-mini로 계산하고 있었다 → 채팅 한 통 최악 1.5원 → **2원**, 유료 최악 손해가 커짐(라이트 −1,096 → −1,503원/월 등). 채팅 자체는 Haiku로 0.7 → 0.5원.
  이 둘을 Haiku로 옮기면 다시 내려감(다음 비교 후보).

## 2. 통화 돌아보기 (gpt-5-mini, **2026-12-11 종료**) — 운영 비교

12장면(en 카페·식당 4, ko·ja·es·zh·fr·th 열린 대화 8, 앱 언어 ko·ja·en·es·ar), 점검 사용자만 `x-sim-model-routes`.

| | gpt-5-mini(지금) | Haiku 5.5 | Sonnet 5.5 |
|---|---|---|---|
| 성공 | 12/12 | 12/12 | 12/12 |
| 응답 중간값 | **11.4초** | 2.0초 | 2.9초 |
| 설명 길이(평균) | 148자 | 281자 | 239자 |
| 한 번 비용(어림) | 2.8원 | 0.5원 | 9.8원 |
| 눈에 띈 것 | 짧고 지시대로(2~3문장). ja "映画を見るでした"에서 を를 빠뜨렸다고 **틀린 지적** | 길어짐(4~5문장), 한 번 학습자를 3인칭("The learner")으로, zh에서 어색한 설명 | 가장 정확 — 망설인 시간·몇 번째 시도까지 근거로 씀, 3~4문장, 앱 언어·말투 지킴 |

- 권함: **Sonnet 5.5**(high 등급 = 중요한 기능은 고가 모델, 사용자 원칙 2026-10-21). 학습자가 직접 눌러 여는 드문 기능이라 비용 영향 작음, 11초 → 3초.
  되돌아갈 OpenAI 모델(gpt-5-mini)도 12-11에 꺼지므로 그때 `OPENAI_TEXT_DEFAULTS.roleplayReview`를 살아 있는 모델(gpt-4.1 → 01-14, 그 뒤 gpt-6-luna 등)로.
- 길이: Claude 둘 다 "두세 문장"보다 길게 씀 — 바꾸면 지시에 길이 상한을 한 줄 더할 것.

## 3. 받아쓰기 (gpt-4o-mini-transcribe, **2027-02-26 종료**)

자료: `hub/drafts/speech-models-2026-10-21.md`(TTS 26줄·학습자 영어 40문장) + 오늘 학습자 영어 200문장(`room-fix-2026-10-22.md`).

| | 지금 mini | gpt-transcribe | Scribe v2 |
|---|---|---|---|
| 학습자 영어(발음 약함~좋음) 낱말 오류 | 25% | 22% | **17%** |
| 14개 언어 TTS 완전 일치(26줄) | 21 | 21 | 19(숫자를 숫자로·힌디 표기 차이 — 실수 아님) |
| 학습자 실수를 고쳐 적음 | 없음 | 없음 | 없음 |
| 확신도("?") | 됨 | 됨 | 됨(낱말 logprob) |
| 낱말 시간(영상에 필요) | 없음 | 없음 | **있음** |
| 분당 | $0.003 | $0.0045 | $0.0036 |
| 통화 1분 비용 | 11.0원 | 11.9원 | 11.4원 |

- 권함: **한 마디(통화·Room)는 Scribe v2**(학습자 발음에 가장 강하고 gpt-transcribe보다 쌈, 실패하면 지금처럼 OpenAI로 한 번 더), 방 교정의 두 번째 의견은 자동으로 gpt-transcribe가 됨(`secondModelFor`).
  주의: 짧은 한국어에서 실행마다 흔들린 적 있음(한 번 "좋아돼요"), 바깥 업체 하나가 더 생김(장애 시 OpenAI로 넘어감).
- 영상(whisper-1)은 낱말 시간 때문에 **Scribe v2 일괄**로 따로 설계(02-26 전, 코드 작업 필요).

## 4. 목소리 (gpt-4o-mini-tts, **2027-01-06 종료**)

- 대체: gpt-realtime-2.1-mini("그대로 읽기만" — 42문장 충실도 같음, 첫 소리 0.75초). 비용 **1.8배** → 통화 1분 11 → 16.7원(받아쓰기 Scribe 포함).
- 샘플(같은 문장, 지금/새): en·ko·ja 6개 — 사용자 청취 대기. ElevenLabs 키도 있어 그쪽 목소리를 후보로 더할 수 있음(아직 안 봄).

## 바꾸는 법 (결정되면)

- `src/lib/aiDefaults.ts`만: `DEFAULT_ROUTES.roleplayReview = "anthropic: claude-sonnet-5-5"`, `SPEECH_DEFAULTS.turnTranscribe = "scribe_v2"`, `SPEECH_DEFAULTS.ttsEngine = "realtime"`.
  비용 표는 push하면 저절로 바뀐다. 받아쓰기를 바꿀 때는 `speechConfidence.ts` 기준값(scribe_v2)이 이미 있음.
