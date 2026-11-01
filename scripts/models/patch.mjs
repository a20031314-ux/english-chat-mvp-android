// 모델 교체 계산용 미리 읽기 — `node --import ./scripts/models/patch.mjs scripts/plan-cost.mjs …`처럼 붙이면,
// 비용 계산(plan-cost·economics)이 읽는 기본 모델·단가를 **이 실행에서만** 바꾼다. 파일은 그대로(되돌릴 것 없음).
// 같은 파일 주소의 모듈은 한 번만 읽히므로, 여기서 바꾼 객체를 비용 코드가 그대로 본다.
//
// 환경변수 MODEL_WHATIF(JSON):
//   { "routes": { "<기능>": "<제공자>: <모델>" },          aiDefaults DEFAULT_ROUTES에 덮어씀(제공자는 openai|anthropic — 단가는 모델 이름으로만 찾음)
//     "speech": { "turnTranscribe": "…", "ttsEngine": "…" }, aiDefaults SPEECH_DEFAULTS에 덮어씀
//     "prices": { "text": { "<모델>": { "input": 0.1, "output": 0.5 } }, "stt": { "<모델>": 0.003 }, "tts": { "<모델>": 0.02 } } }
import { DEFAULT_ROUTES, SPEECH_DEFAULTS } from "../../src/lib/aiDefaults.ts";
import { STT_USD_PER_MINUTE, TEXT_USD_PER_MTOK, TTS_USD_PER_MINUTE_BY_MODEL } from "../../src/lib/billing/modelPrices.ts";

const spec = JSON.parse(process.env.MODEL_WHATIF || "{}");
for (const [model, price] of Object.entries(spec.prices?.text ?? {})) TEXT_USD_PER_MTOK[model] = { ...price, source: "모델 교체 계산(가정)" };
for (const [model, usd] of Object.entries(spec.prices?.stt ?? {})) STT_USD_PER_MINUTE[model] = { usd, source: "모델 교체 계산(가정)" };
for (const [model, usd] of Object.entries(spec.prices?.tts ?? {})) TTS_USD_PER_MINUTE_BY_MODEL[model] = { usd, source: "모델 교체 계산(가정)" };
Object.assign(DEFAULT_ROUTES, spec.routes ?? {});
Object.assign(SPEECH_DEFAULTS, spec.speech ?? {});
