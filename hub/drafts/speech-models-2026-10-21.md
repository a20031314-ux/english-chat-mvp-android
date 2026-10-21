# 음성 모델 바꾸기 — 운영 비교 (2026-10-21)

- 왜: OpenAI 종료 — 목소리 gpt-4o-mini-tts **2027-01-06**, 받아쓰기 gpt-4o-mini-transcribe·whisper-1 **2027-02-26** (`hub/MODELS.md`).
- 코드: `src/lib/server/speechModels.ts`(한곳에서 고름, Vercel 값 우선) · `realtimeSpeech.ts`(Realtime으로 글 그대로 읽기).
  점검 사용자(`simcheck-`)만 머리글 `x-tts-engine`·`x-stt-model`로 새 모델을 써 볼 수 있고, **실제 사용자는 아직 예전 모델**.
- 비교: `scripts/speech-trial.mjs`(10문장 × 읽기 2방식 × 받아쓰기 2모델) + 14개 언어 × 3문장(실수 든 문장·질문/지시·숫자) 읽기 충실도.

## 결과

| | 지금 | 새 방식 | 판단 |
|---|---|---|---|
| 읽어 주기 | gpt-4o-mini-tts | Realtime gpt-realtime-2.1-mini(“그대로 읽기만” 지시) | 바꿔도 됨(목소리 느낌은 사용자 청취 확인) |
| ㄴ 그대로 읽었나(42문장) | 숫자만 다르게 들림 6 | 같은 6(숫자를 말로 읽은 것 — 틀린 게 아님) | 같음. 질문·"번역해 주세요"에도 대답하지 않고 읽기만 |
| ㄴ 어긋난 것 | 한국어 전화번호를 "십이 삼 사…칠 칠"로 잘못 읽음 | 태국어 1번 "และ"→"แล้วก็"(말을 바꿈, 다음 실행에선 안 됨) | 둘 다 드묾 |
| ㄴ 첫 소리까지 | (스트리밍, 이 비교에선 못 잼) | 중앙 0.75초·최대 1.8초 | 괜찮음 |
| ㄴ 6초 한 줄 비용 | 약 2.1원(분당 $0.015) | 약 3.7원(오디오 출력 초당 20토큰 × $20/1M + 글 토큰) | **1.8배** |
| 받아쓰기 | gpt-4o-mini-transcribe | gpt-transcribe | 바꿔도 됨 |
| ㄴ 정확도(20개 소리) | 글자 오류 0(태국어 1개는 읽기 쪽 문제) | 같음, 학습자 실수 그대로 받아씀 | 같음 |
| ㄴ 확신도(logprobs) | 됨 | **됨** | 지금 기능 그대로 |
| ㄴ 묻는 법 | `language` 하나 | `languages` 배열 — 방의 두 언어를 그대로 넘김 | 코드 반영됨 |
| ㄴ 속도 | 0.3~1.3초 | 0.3~1.8초 | 비슷 |
| ㄴ 비용 | 분당 $0.003 | 분당 $0.0045 | **1.5배** (Room 한 줄 0.4 → 0.6원) |

## 남은 것

1. 사용자가 목소리 샘플(영어·한국어·일본어, 지금/새 방식) 듣고 OK → `TTS_ENGINE=realtime`·`OPENAI_TURN_TRANSCRIBE_MODEL=gpt-transcribe` 기본값 전환 + `billing/cost.ts` 단가(`TTS_USD_PER_MINUTE`, `CALL_TRANSCRIBE_USD_PER_MINUTE`) 같이 고침.
2. 통화 안 받아쓰기(`realtimeCallSession.ts` `OPENAI_REALTIME_TRANSCRIBE_MODEL`): Realtime 세션 안이라 `gpt-live-transcribe`(분당 $0.017)인지 `gpt-transcribe`가 되는지 실제 통화로 확인.
3. **영상 받아쓰기(whisper-1)는 그대로 못 바꿈:** 자막 시간 맞추기에 낱말·구간 시간(`timestamp_granularities`)을 쓰는데 whisper-1에만 있음. 짧은 조각으로 잘라 조각 시간으로 맞추는 방식 등 따로 설계 필요(2027-02-26 전).
4. 녹음해 둔 장면 대사(`scripts/build-roleplay-audio.mjs`, gpt-4o-mini-tts)는 파일이라 계속 재생되지만, 새로 만드는 줄은 다른 모델 목소리 → 장면 안에서 느낌이 다를 수 있음. 01-06 전에 새 방식으로 다시 녹음할지.
