# 앱이 쓰는 AI 모델·외부 도구

> 앱 안에서 쓰는 AI 모델과 바깥 서비스를 한 장에 모은 문서입니다. 매주 월요일 예약 작업 **"AI 모델 살피기"**가 새 모델·종료 공지·가격을 찾아보고,
> 바꿀 만한 것이 생기면 이 문서의 "새 소식"과 `hub/reports.md`에 적고 폰으로 알립니다. 모델을 바꾸는 커밋도 이 문서를 같이 고칩니다.
> 모델 이름은 **코드 기본값**입니다. Vercel 환경변수(`OPENAI_*_MODEL`)가 있으면 그 값이 쓰이는데, 운영에 넣은 값은 저장소에서 볼 수 없습니다.
> 기능별로 글이 어떻게 지나가는지는 `hub/drafts/text-pipeline-map-2026-10-21.md`, 교정 모델 비교 시험은 `hub/drafts/correction-models-2026-10-21.md`에 있습니다.
> 처음 정리: 2026-10-21.

## 0. 모델을 고르는 곳

- **코드 기본값은 `src/lib/aiDefaults.ts` 한 장**(2026-10-22): 글 기능별 OpenAI 기본·`DEFAULT_ROUTES`(Claude)·받아쓰기·목소리. 서버와 비용 표(`hub/costs.md`)가 같은 이름을 읽어, 여기만 고치면 push 뒤 비용 표가 저절로 바뀐다. 새 모델이면 단가를 `src/lib/billing/modelPrices.ts`에(없으면 CI 실패).
- 교체안(받아쓰기·목소리·통화 돌아보기): `hub/drafts/model-switch-2026-10-22.md`.
- **2026-10-22 지금 운영(코드 기본값, 점검 사용자 `x-sim-models`로 확인):** 글 기능 대부분 Claude Haiku 5.5, 교정 확인·통화 돌아보기 Claude Sonnet 5.5. OpenAI로 남은 것: 지도·미션 쓰기(gpt-4.1)·미션 확인(gpt-4.1-mini)·통화 튜터(gpt-4.1-mini, 스트리밍)·받아쓰기·목소리. 아래 표의 OpenAI 모델은 그 기능의 "대체(실패 때)" 모델.

- **글 모델**(아래 표의 받아쓰기·목소리·검사를 뺀 전부)은 `src/lib/server/llm.ts` 표(`TASKS`, 기능 18개 → 등급 basic·high)를 거칩니다.
  - Vercel `MODEL_ROUTES`로 기능별·등급별로 바꿉니다(예: `{"basic":"anthropic: claude-haiku-5-5","high":"anthropic: claude-sonnet-5-5"}`).
  - 값이 없으면 아래 표의 OpenAI 모델을 그대로 씁니다.
  - Claude 호출이 실패하면 그 기능의 OpenAI 모델로 한 번 더 시도합니다.
  - 사용자 결정(2026-10-21): **기본은 Haiku 5.5, 중요한 기능(high)만 고가 모델**. 2단계에 Vercel `ANTHROPIC_API_KEY`가 필요합니다.
  - **2026-10-22 전환:** 채팅·표현 카드가 Haiku 5.5(`llm.ts` `DEFAULT_ROUTES`). 되돌리기는 Vercel `MODEL_ROUTES`에 `{"chat":"openai: gpt-4o-mini","howToSay":"openai: gpt-4o-mini"}`.
- 주의: Claude가 실패했을 때 다시 시도하는 OpenAI 모델도 종료일이 지나면 같이 꺼집니다. 통화 돌아보기(`roleplayReview`)의 대비 모델 gpt-5-mini는 **2026-12-11** 종료라, 그 전에 Claude로 옮기거나 `OPENAI_REVIEW_MODEL`을 바꿔야 합니다.
- **받아쓰기·목소리·통화 턴 스트리밍**은 OpenAI만 씁니다(`llm.ts` 밖). 대체할 모델은 아래 표에 있습니다.

## 1. AI 모델 (지금 기본값은 전부 OpenAI, 키 `OPENAI_API_KEY`)

| 쓰는 곳 | 환경변수 | 기본 모델 | OpenAI 종료일 | OpenAI가 권하는 대체 |
|---|---|---|---|---|
| 채팅 답·교정·표현 카드·해석·단어·문장분석·노트·영상 자막 대부분 | `OPENAI_MODEL` | gpt-4o-mini | **2027-01-14** | gpt-6-luna |
| 영상 장면 보기(비전) | `OPENAI_VISION_MODEL` | gpt-4o-mini(`OPENAI_MODEL` 따라감) | **2027-01-14** | gpt-6-luna |
| 표현 묻기 | `OPENAI_ASK_MODEL` | gpt-4.1-mini | **2027-01-14** | gpt-6-luna |
| 미션 채점 | `OPENAI_MISSION_MODEL` | gpt-4.1-mini | **2027-01-14** | gpt-6-luna |
| 문장 분류·실수 종류 읽기·학습자 프로필 | `OPENAI_LEARNER_MODEL` | gpt-4.1-mini | **2027-01-14** | gpt-6-luna |
| 통화 튜터(디렉터) | `OPENAI_DIRECTOR_MODEL` | gpt-4.1-mini | **2027-01-14** | gpt-6-luna |
| 통화 다시 말해보기 | `OPENAI_PRACTICE_MODEL` | gpt-4.1-mini | **2027-01-14** | gpt-6-luna |
| 지도 만들기·미션 쓰기·지도에 넣기·약점 미션 | `OPENAI_CURRICULUM_MODEL` | gpt-4.1 | **2027-01-14** | gpt-6-luna |
| 통화 돌아보기 | `OPENAI_REVIEW_MODEL` | gpt-5-mini | **2026-12-11 (가장 먼저)** | gpt-5.6-terra |
| 통화·방 받아쓰기 | `OPENAI_TURN_TRANSCRIBE_MODEL` | gpt-4o-mini-transcribe | **2027-02-26** | gpt-transcribe 또는 gpt-live-transcribe |
| 영상 받아쓰기 | `OPENAI_TRANSCRIBE_MODEL` | whisper-1 | **2027-02-26** | gpt-transcribe 또는 gpt-live-transcribe |
| 튜터 목소리(TTS) | `OPENAI_TTS_MODEL` | gpt-4o-mini-tts | **2027-01-06** | gpt-realtime-2.1-mini |
| 사진·랜덤 화면 검사 | — | omni-moderation-latest(무료) | 종료 공지 없음 | — |
| (비용 계산에만) 실시간 통화 | `OPENAI_REALTIME_MODEL` | gpt-realtime-2.1 | 종료 공지 없음 | — |

- 지금 쓰는 모델은 **전부 종료 일정이 잡혀 있습니다**(검사 모델 하나만 빼고). 가장 먼저 꺼지는 것은 통화 돌아보기(gpt-5-mini, 12-11)이고, 그다음이 목소리(01-06)와 채팅 전체(01-14)입니다.
- **폰의 기기 목소리**: `@capacitor-community/text-to-speech`가 폰에 들어 있는 목소리로 읽습니다(모델 비용 없음).
- **점검용(앱 밖)**: 가상 사용자 평가에 gpt-4.1-mini와 Claude(이 작업 공간의 에이전트)를 씁니다.

### 지금 알려진 대체 후보 (2026-10-21 조사)

| 후보 | 가격(입력/출력, 100만 토큰당) | 메모 |
|---|---|---|
| gpt-4o-mini (지금) | $0.15 / $0.60 | 비교 기준 |
| **gpt-6-luna** (2026-09-22 출시) | $0.10 / $0.50 | OpenAI 공식 대체이고 지금보다 쌉니다. 교정 품질은 아직 시험하지 않았습니다. |
| gpt-5.6-luna | $0.20 / $1.20 | gpt-4.1-nano의 대체 |
| Claude Haiku 5.5 | 한 턴 약 0.49원(지금 0.67원) | 10-21 시험에서 교정 큰 문제 영어 1·한국어 2(지금은 2·6). **10-22 실제 API·196명 14개 언어: 큰 문제 9/630(1.4%) vs 지금 52/630(8.3%)**, 대신 섞은 낱말 안 바꿈·응답 2.8배 느림(`hub/drafts/haiku-live-2026-10-22.md`). |
| Gemini 2.5 Flash-Lite / 3.1 Flash-Lite | $0.10/$0.40 · $0.25/$1.50 | 품질은 시험하지 않았습니다(키 없음). 3.6·3.7 Flash는 2027-01-01부터 가격이 두 배가 됩니다. |
| gpt-live-transcribe | 분당 $0.017 | 받아쓰기 대체 후보. 지금(whisper 분당 약 $0.006, mini-transcribe 약 $0.003)보다 비쌀 수 있어 비용 표와 같이 봐야 합니다. |
| gpt-realtime-2.1-mini | 글 $0.60 / $2.40, 오디오 $10 / $20 (1M 토큰) | 목소리 대체. `/v1/audio/speech`로는 안 되고 Realtime으로 — `server/realtimeSpeech.ts`로 만들고 비교함(6초 약 3.7원, 지금 1.8배, `hub/drafts/speech-models-2026-10-21.md`). |

## 2. 바깥 서비스·도구

| 무엇 | 하는 일 | 키·설정 | 어디서 |
|---|---|---|---|
| Anthropic (Claude) | 채팅·표현 카드·방 교정 Haiku 5.5, 교정 확인 Sonnet 5.5(코드 기본값 `DEFAULT_ROUTES`, 2026-10-22), 나머지는 `MODEL_ROUTES`로 | `ANTHROPIC_API_KEY` (2026-10-21 넣음, 10-22 운영 호출 확인) | `lib/server/llm.ts` |
| ElevenLabs Scribe v2 | 받아쓰기 시험 후보(점검 사용자만) | `ELEVENLABS_API_KEY` (10-22 운영 호출 확인) | `lib/server/sttProviders.ts` |
| AssemblyAI | 받아쓰기 시험 후보(점검 사용자만) | `ASSEMBLYAI_API_KEY` (10-22 운영 호출 확인) | `lib/server/sttProviders.ts` |
| Vercel | 서버·웹 배포, 예약 작업(계정 정리·사진 정리) | 프로젝트 설정 | `vercel.json` |
| Vercel Blob | 사진(대화·게시판) 저장 | `BLOB_READ_WRITE_TOKEN` | `@vercel/blob` |
| Upstash Redis (Vercel KV) | 모든 서버 데이터(계정·기록·방·메시지·한도) | `KV_REST_API_*` / `UPSTASH_REDIS_REST_*` | `lib/server/kv.ts`. 2026-10-21에 사용량 따라 내는 요금으로 바꿈 |
| RevenueCat | 구독·포인트 결제(Play·App Store) | `NEXT_PUBLIC_REVENUECAT_*`, `REVENUECAT_SECRET_KEY` | `@revenuecat/purchases-capacitor` |
| Google AdMob | 앱 광고(배너·전면·네이티브·앱 오프닝) | ad unit 값 | `@capacitor-community/admob`, `hub/ADS.md` |
| Google AdSense | 웹 광고(꺼짐, 값 넣으면 켜짐) | `NEXT_PUBLIC_ADSENSE_*` | `WebAdSlot` |
| Google 로그인 | 계정 | `GOOGLE_WEB_CLIENT_ID` | `@capgo/capacitor-social-login` |
| Resend | 로그인 이메일 코드 | `RESEND_API_KEY`, `AUTH_EMAIL_FROM` | `lib/server/emailSender.ts` |
| Cloudflare TURN | 1:1·방 통화 중계 | `CLOUDFLARE_TURN_KEY_ID`·`_API_TOKEN` | `lib/server/turn.ts` |
| YouTube Data API | 영상 찾기·채널 | `YOUTUBE_API_KEY` | `content-discovery` |
| Brave Search / Google 맞춤 검색 | 영상 찾기 검색(둘 중 하나) | `BRAVE_SEARCH_API_KEY`, `GOOGLE_CSE_*` | `CONTENT_DISCOVERY_PROVIDER` |
| PortOne 본인인증 | Spin 성인인증(꺼짐, 계약 전) | `NEXT_PUBLIC_PORTONE_*` | `random` |
| ffmpeg | 영상 장면 자르기 | `FFMPEG_PATH` | `videoSubtitle` |
| Capacitor | 안드로이드·iOS 앱 틀, 앱 업데이트 확인 | — | `@capacitor/*`, `@capawesome/capacitor-app-update` |
| GitHub Actions + fastlane | Play·TestFlight 올리기, 점검(CI) | GitHub 비밀값(사람이 관리) | `.github/workflows/` |
| Next.js | 웹·API 틀 | — | `next` |

## 3. 새 소식 (예약 작업이 위에 더함)

- 2026-10-22 · Anthropic·ElevenLabs·AssemblyAI 키 운영에서 실제 호출 확인(점검 사용자로만). 실제 사용자는 아직 예전 모델 그대로.

- 2026-10-21 · 처음 정리. 위 표의 종료일과 대체 모델은 OpenAI 공식 종료 목록에서 확인했습니다. 남은 일: ① Vercel에 `ANTHROPIC_API_KEY`를 넣고 Haiku로 전환(같은 날 다른 채팅이 `llm.ts` 1단계 완료). 통화 돌아보기는 12-11 전에. ② 목소리(01-06)·받아쓰기(02-26) 대체 모델의 비용과 방식 확인. 이 둘은 Claude에 대체가 없습니다. ③ 비교용: OpenAI 쪽 대체는 gpt-6-luna로, 지금보다 쌉니다.
