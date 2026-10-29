/**
 * 앱이 쓰는 AI 모델의 **코드 기본값** — 한 장(2026-10-22).
 *
 * 왜 따로: 모델을 고르는 서버 코드(`server/llm.ts`·`server/speechModels.ts`)와 비용 계산(`billing/cost.ts`·`opCost.ts` →
 * `hub/costs.md`)이 같은 이름을 읽어야, 기본 모델을 바꾸는 커밋 하나로 비용 표도 저절로 따라온다(main push → CI가 다시 계산).
 * 전에는 비용 쪽이 모델 이름을 따로 적고 있어서, 채팅을 Haiku로 바꾼 뒤에도 비용 표는 gpt-4o-mini 단가로 계산됐다.
 *
 * 순수 파일: 환경변수·서버 모듈을 읽지 않는다(앱 화면 쪽 `cost.ts`도 가져다 씀). Vercel 값(`MODEL_ROUTES`·`OPENAI_*_MODEL`·`TTS_ENGINE`)이
 * 있으면 운영은 그것을 쓰지만 저장소에서는 볼 수 없어서, 비용 표는 이 기본값으로 계산한다고 적는다.
 */

/**
 * 글 모델 기능 → 그 기능의 OpenAI 기본 모델(Vercel `OPENAI_*_MODEL`이 없을 때, Claude가 실패했을 때 되돌아가는 모델).
 * 2026-10-27 사용자 "모델 전부 교체해줘": 2027-01-14에 끝나는 gpt-4o-mini·gpt-4.1·gpt-4.1-mini → gpt-6-luna(OpenAI 공식 대체),
 * 2026-12-11에 끝나는 gpt-5-mini → gpt-5.6-terra. 둘 다 추론 모델 — 인자는 `server/llm.ts` `forOpenAIModel`이 맞춘다.
 * 그대로 OpenAI를 기본으로 쓰는 기능: 통화 튜터(roleplayTutor, 스트리밍)·미션 쓰기(curriculum)·미션 확인(mission).
 */
export const OPENAI_TEXT_DEFAULTS = {
  chat: "gpt-6-luna",
  howToSay: "gpt-6-luna",
  roomFix: "gpt-6-luna",
  roomGame: "gpt-6-luna",
  translate: "gpt-6-luna",
  vocab: "gpt-6-luna",
  analysis: "gpt-6-luna",
  expression: "gpt-6-luna",
  notes: "gpt-6-luna",
  learnerAsk: "gpt-6-luna",
  roleplayContext: "gpt-6-luna",
  video: "gpt-6-luna",
  vision: "gpt-6-luna",
  roleplayTutor: "gpt-6-luna",
  roleplayPractice: "gpt-6-luna",
  scriptJudge: "gpt-6-luna",
  scriptRecheck: "gpt-6-luna",
  scriptChoices: "gpt-6-luna",
  ask: "gpt-6-luna",
  mission: "gpt-6-luna",
  curriculum: "gpt-6-luna",
  curriculumMap: "gpt-6-luna",
  curriculumMapFill: "gpt-6-luna",
  learnerRead: "gpt-6-luna",
  roleplayReview: "gpt-5.6-terra",
  chatVerify: "gpt-6-luna",
} as const;

export type TextTask = keyof typeof OPENAI_TEXT_DEFAULTS;

/**
 * 코드에 박은 기본 경로 — Vercel `MODEL_ROUTES`가 비어 있어도 이것을 쓴다(키가 없으면 OpenAI 기본).
 * 우선순위: MODEL_ROUTES 기능 > MODEL_ROUTES 등급 > 여기 > 그 기능의 OpenAI 기본값.
 * - 2026-10-22 사용자 결정: 채팅(교정 + 답)과 표현 카드를 Claude Haiku 5.5로(`hub/drafts/correction-models-2026-10-21.md`
 *   "고친 뒤 다시 비교" — 큰 문제 6~10% → 4.5%, 답 2.0 → 1.7초). 되돌리기 Vercel `MODEL_ROUTES = {"chat":"openai: gpt-4o-mini","howToSay":"openai: gpt-4o-mini"}`.
 * - 방 내 줄 교정은 채팅 교정과 같은 모델(2026-10-22).
 * - 교정 확인 모델(위험한 줄만, 열 때)은 Sonnet 5.5 — 사용자 결정 2026-10-21, 코드 기본값으로 넣음 2026-10-22.
 */
const HAIKU = "anthropic: claude-haiku-5-5";
const SONNET = "anthropic: claude-sonnet-5-5";

export const DEFAULT_ROUTES: Partial<Record<TextTask, string>> = {
  chat: HAIKU,
  howToSay: HAIKU,
  roomFix: HAIKU,
  // 방 게임(라이어 게임 제시어·답 판정, 2026-10-23): 한 판에 한두 번, 짧은 JSON.
  roomGame: HAIKU,
  chatVerify: SONNET,
  // 2026-10-22 사용자 "나머지 기능도 다 옮겨줘" — 기본은 Haiku, 드물고 결과가 오래 남는 것만 Sonnet(사용자 원칙 2026-10-21).
  // 표현 묻기(ask)·학습자 읽기(learnerRead)는 high 등급이지만 자주 불려(묻기 하루 30번, 읽기는 채팅마다) Haiku.
  // 아직 옮기지 않은 것(가상 사용자 점검 근거, `hub/drafts/model-switch-2026-10-22.md` "전체 옮기기"):
  // - 미션 쓰기·지도에 넣기·약점 미션(curriculum)·미션 확인(mission): OpenAI(gpt-4.1·4.1-mini, 2027-01-14 종료) 그대로 — 지도 그리기만 따로 Sonnet(curriculumMap).
  // - 통화 튜터(roleplayTutor): 스트리밍이 OpenAI만이라(`openaiModel`) 옮겨도 소용없어 그대로 — 01-14 전에 Claude 스트리밍 길을 따로.
  translate: HAIKU,
  vocab: HAIKU,
  analysis: HAIKU,
  expression: HAIKU,
  notes: HAIKU,
  learnerAsk: HAIKU,
  roleplayContext: HAIKU,
  video: HAIKU,
  vision: HAIKU,
  roleplayPractice: HAIKU,
  // 대본 떠올려 말하기·내 말로·문장구조 판단(뜻끼리 맞춤, 2026-10-29): 먼저 Haiku, Haiku가 "틀림"이라 할 때만 Sonnet이 다시 봄(scriptRecheck).
  // 근거: 가상 사용자 72번 — Haiku는 틀린 줄을 통과시킨 적 없고 틀림 쪽으로만 엄함, 이렇게 하면 통과/틀림 69/72(Sonnet만 쓸 때와 같음).
  // 따라 말하기·통화 다시 말해보기는 낱말 대조라 roleplayPractice(Haiku).
  scriptJudge: HAIKU,
  scriptRecheck: SONNET,
  // 대본 고르기 오답(2026-10-29): 대본마다 한 번 만들어 모두가 같이 쓰므로(호출 수가 대본 수로 끝남) 더 나은 모델로.
  scriptChoices: SONNET,
  learnerRead: HAIKU,
  ask: HAIKU,
  roleplayReview: SONNET,
  // My 지도 그리기(대화 예시로 "이게 내 수준"을 고른 뒤 그 단계 범위로) — 사용자 생각 2026-10-22: Sonnet이 그린다.
  // 이 호출만 Sonnet이 먼저 생각하게 둔다(completeChat think) — 생각을 끄면 지도가 얇아졌다(점검 8/14 "map too thin").
  curriculumMap: SONNET,
  // 나눠 그리기(2026-10-23): 뼈대를 짠 뒤 주제 몇 개씩 연습·이어진 주제를 나란히 채운다 — 생각 없이(짧게).
  // Haiku로 채워 보니 6주제 중 6개가 연습 없이 옴(2026-10-23 운영 비교) — Sonnet 그대로.
  curriculumMapFill: SONNET,
};

/** "제공자: 모델" → 모델 이름(틀린 모양이면 null). */
export function routeModel(value: string | undefined): { provider: "openai" | "anthropic"; model: string } | null {
  if (!value) return null;
  const at = value.indexOf(":");
  if (at <= 0) return null;
  const provider = value.slice(0, at).trim();
  const model = value.slice(at + 1).trim();
  if (!model || (provider !== "openai" && provider !== "anthropic")) return null;
  return { provider, model };
}

/** 기능이 코드 기본값으로 쓰는 모델(키가 다 있다고 보고 — 운영과 같음). 비용 표가 이 이름으로 단가를 찾는다. */
export function codeTextModel(task: TextTask): string {
  return routeModel(DEFAULT_ROUTES[task])?.model ?? OPENAI_TEXT_DEFAULTS[task];
}

/** 받아쓰기·목소리 기본값(`server/speechModels.ts`·`openai.ts`·`secondListen.ts`가 읽음). */
export const SPEECH_DEFAULTS = {
  /** 통화 학습·Room 자막의 한 마디(`OPENAI_TURN_TRANSCRIBE_MODEL`). */
  turnTranscribe: "scribe_v2",
  /** 방 내 줄 교정의 두 번째 의견(ElevenLabs 키가 있을 때 — 운영엔 있음, 없으면 다른 OpenAI 모델). */
  secondTranscribe: "scribe_v2",
  /** 영상에 자막이 없을 때(`OPENAI_TRANSCRIBE_MODEL`). */
  videoTranscribe: "scribe_v2",
  /** 튜터 목소리 엔진(`TTS_ENGINE`): speech = /v1/audio/speech, realtime = Realtime으로 그대로 읽기. */
  ttsEngine: "realtime" as "speech" | "realtime",
  /** 바깥 받아쓰기(Scribe v2)가 실패했을 때 OpenAI로 한 번 더 — gpt-4o-mini-transcribe·whisper-1(2027-02-26 종료)의 대체. */
  openaiTranscribe: "gpt-transcribe",
  /** realtime 목소리가 첫 소리 전에 실패했을 때만(2027-01-06 종료 — 그 뒤엔 대비 없음). */
  speechTtsModel: "gpt-4o-mini-tts",
  realtimeTtsModel: "gpt-realtime-2.1-mini",
} as const;

/** 지금 코드 기본값의 튜터 목소리 모델. */
export function codeTtsModel(): string {
  return SPEECH_DEFAULTS.ttsEngine === "realtime" ? SPEECH_DEFAULTS.realtimeTtsModel : SPEECH_DEFAULTS.speechTtsModel;
}
