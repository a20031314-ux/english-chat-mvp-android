# 모델 교체 후보 (자동)

> 매주 월요일 예약 작업 **"AI 모델 살피기"**가 새 모델·종료 공지를 찾아 `hub/model-candidates.json`에 후보로 적고,
> `scripts/models/whatif.mjs`가 후보마다 **비용표·손익을 다시 계산**하고, 돈이 되거나 종료가 다가온 후보만 **운영 서버에서 품질을 시험**(점검 사용자, 이름 가린 평가)합니다.
> 이 파일은 그 결과로 다시 만들어집니다 — 손으로 고치지 않습니다. 바꾸는 것은 사용자가 "바꿔줘" 한 뒤에만(대부분 `src/lib/aiDefaults.ts` 한 줄 또는 Vercel `MODEL_ROUTES`, 서버만 — 앱 빌드 필요 없음).
> 단계: 권함 · 시험 필요 · 시험 불가(사람 판단) · 지켜봄 · 안 함. 돈 기준 500원(한 사람 한 달), 종료 90일 전부터 알림, 품질은 채팅 교정 큰 문제 비율이 지금보다 2%p 넘게 높지 않으면 같음.

| 단계 | 후보 | 바꿀 곳 | 지금 → 후보 | 손익(한 사람 한 달, 가장 크게 바뀐 요금) | 품질 시험 | 종료 | 왜 |
|---|---|---|---|---|---|---|---|
| **지켜봄** | gpt-6.1-terra (openai) | chatVerify·scriptRecheck·scriptChoices·roleplayReview·curriculumMap·curriculumMapFill | claude-sonnet-5-5 → gpt-6.1-terra | 라이트 3,900원 많이 쓰는 사람 +265원 | 큰 문제 4.5% (지금 12.4%) · 2613ms (지금 2307ms) · 178줄 | — | 손익 차이 작음 — 2026-10-26 출시, Sonnet 5.5($2/$10)의 절반 값 — 지금 Sonnet이 맡은 기능(교정 확인·대본 다시 보기·고르기 오답·통화 돌아보기·지도 그리기) 대신. 통화 돌아보기 대비 gpt-5.6-terra($2/$12)보다도 쌈 |
| **지켜봄** | gpt-6-luna (openai) | chat·howToSay·roomFix·roomGame·translate·vocab·analysis·expression·notes·learnerAsk·roleplayContext·video·vision·roleplayPractice·scriptJudge·learnerRead·ask | claude-haiku-5-5 → gpt-6-luna | 변화 없음 | 아직 | — | 손익 차이 작음 — Haiku 5.5와 같은 값($0.10/$0.50)의 OpenAI 작은 모델 — 이미 대비 모델·통화 튜터로 씀. 값이 같아 손익 차이가 생길 때만 시험 |

## gpt-6.1-terra — 지켜봄

- 가격: {"input":1,"output":5} · 근거 https://aiweekly.co/alerts/openai-ships-gpt-61-terra-at-15-per-million-half-of-sol (제3자 기준 — OpenAI 출시 글 인용) · truefoundry.com/blog/gpt-6-1-sol-terra-luna 10-28 같은 값(제3자 기준) · 확인 2026-11-02
- 계산: 2026-11-02 · 커밋 9c3bb189 · 바뀐 칸 175
  - 대본 플랜 2,900원 많이 쓰는 사람: 1,229원 → 1,493원 (+264원)
  - 라이트 3,900원 많이 쓰는 사람: 142원 → 407원 (+265원)
  - 플러스 5,500원 많이 쓰는 사람: 1,476원 → 1,741원 (+265원)
  - 프리미엄 9,900원 (지금, 월 80포인트) 많이 쓰는 사람: 5,216원 → 5,481원 (+265원)
  - 프리미엄 8,900원 (전환 후) 많이 쓰는 사람: 4,366원 → 4,631원 (+265원)
  - 대본 플랜 2,900원 한 사람: 344원 → 592원 (+248원)
  - 라이트 3,900원 한 사람: −7원 → 241원 (+248원)
  - 플러스 5,500원 한 사람: 907원 → 1,155원 (+248원)
  - 프리미엄 9,900원(지금) 한 사람: 4,107원 → 4,371원 (+264원)
  - 프리미엄 8,900원(전환 후) 한 사람: 3,259원 → 3,523원 (+264원)
  - 가입자 1,000명당(광고 중간·전환 2%): 759,383원 → 882,390원 (+123,007원)
- 품질 시험 2026-11-01: 같은 28명·같은 문장 — 큰 문제 4.5% vs 지금 12.4%, 오류 0% vs 0%, 응답 중앙 2613ms vs 2307ms. 채팅 교정으로 본 대리 지표. 후보만 틀린 예: 맥락: 튜터가 본 적 없는 집을 'adorei a casa'라며 없던 일을 전제함 / 맥락: 숙제 에세이를 대신 써 주겠다고 받아들임(휘말림)
- 바꾸는 법: Vercel `MODEL_ROUTES`에 {"chatVerify":"openai: gpt-6.1-terra","scriptRecheck":"openai: gpt-6.1-terra","scriptChoices":"openai: gpt-6.1-terra","roleplayReview":"openai: gpt-6.1-terra","curriculumMap":"openai: gpt-6.1-terra","curriculumMapFill":"openai: gpt-6.1-terra"} (먼저 운영 확인) → 좋으면 `src/lib/aiDefaults.ts` DEFAULT_ROUTES
