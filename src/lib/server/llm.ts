import { AsyncLocalStorage } from "async_hooks";
import type OpenAI from "openai";
import { DEFAULT_ROUTES, OPENAI_TEXT_DEFAULTS, routeModel, type TextTask } from "../aiDefaults.ts";
import { noteSimModel } from "./simModels.ts";
import type {
  ChatCompletion,
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions";

/**
 * 모델 부르는 창구 — 서버의 모든 글 모델 호출이 여기를 거친다.
 *
 * 왜: OpenAI가 gpt-4o-mini·gpt-4.1·gpt-4.1-mini 종료를 2027-01-14로 발표(2026-10-14).
 * 기능마다 어느 모델을 쓸지를 코드 곳곳이 아니라 이 표 한 장(`TASKS`)과 Vercel 값 하나(`MODEL_ROUTES`)로 정한다.
 * 기본은 각 기능이 쓰던 OpenAI 모델과 그 환경 변수, 단 `DEFAULT_ROUTES`에 적은 기능(채팅·표현 카드 → Haiku, 2026-10-22)은 예외.
 * `MODEL_ROUTES`가 둘 다보다 앞선다.
 *
 *   MODEL_ROUTES = {"basic": "anthropic: claude-haiku-5-5", "high": "anthropic: claude-sonnet-5-5"}
 *   MODEL_ROUTES = {"chat": "anthropic: claude-haiku-5-5"}          ← 기능 하나만
 *   값은 "제공자: 모델 이름"(콜론 뒤 띄어쓰기는 있어도 없어도 됨), 제공자는 openai·anthropic.
 *   우선순위: 기능 이름 > 등급(basic·high) > 기본값.
 *
 * Anthropic 쪽은 `ANTHROPIC_API_KEY`가 있어야 쓰고, 실패하면 그 기능의 OpenAI 기본 모델로 한 번 다시 부른다
 * (`MODEL_FALLBACK=off`로 끔). 돌려주는 값은 OpenAI 응답 모양 그대로라 부르는 쪽은 바꿀 게 없다.
 * 받아쓰기(Whisper)·목소리(TTS)·스트리밍 통화 턴은 여기 밖 — OpenAI 그대로(`openaiModel`).
 */

export type Tier = "basic" | "high";
export type Provider = "openai" | "anthropic";

const env = (name: string) => process.env[name]?.trim() || undefined;
const D = OPENAI_TEXT_DEFAULTS;
const chatDefault = () => env("OPENAI_MODEL") ?? D.chat;

/**
 * 기능 → 등급 + 지금 쓰는 OpenAI 모델(예전과 같은 환경 변수·기본값). 기본 모델 이름은 `lib/aiDefaults.ts` 한 장에 있다
 * (비용 표가 같은 이름을 읽음 — 기본값을 바꾸면 hub/costs.md도 저절로 따라온다).
 * basic = 자주 불리는 것(싸게), high = 드물지만 결과가 오래 남거나 틀리면 아픈 것.
 */
export const TASKS = {
  chat: { tier: "basic", openai: chatDefault, about: "AI 채팅 한 턴(교정 + 답)·첫 인사·다시 읽기" },
  howToSay: { tier: "basic", openai: chatDefault, about: "편한 말 → 학습 언어 표현 카드" },
  roomFix: { tier: "basic", openai: chatDefault, about: "말하는 방 내 줄 교정(믿을 만하게 받아쓴 줄만)" },
  roomGame: { tier: "basic", openai: chatDefault, about: "말하는 방 게임(라이어 게임 제시어 고르기·답 판정)" },
  translate: { tier: "basic", openai: chatDefault, about: "줄 번역" },
  vocab: { tier: "basic", openai: chatDefault, about: "단어 뜻·단어장" },
  analysis: { tier: "basic", openai: chatDefault, about: "문장분석·표현 단위·학습 구간" },
  expression: { tier: "basic", openai: chatDefault, about: "표현 자세히" },
  notes: { tier: "basic", openai: chatDefault, about: "노트 자리 찾기" },
  learnerAsk: { tier: "basic", openai: chatDefault, about: "My 직접 묻기" },
  roleplayContext: { tier: "basic", openai: chatDefault, about: "통화 상황 만들기" },
  video: { tier: "basic", openai: chatDefault, about: "영상 자막·해석·찾기" },
  vision: { tier: "basic", openai: () => env("OPENAI_VISION_MODEL") ?? chatDefault(), about: "영상 장면 보기" },
  roleplayTutor: { tier: "basic", openai: () => env("OPENAI_DIRECTOR_MODEL") ?? D.roleplayTutor, about: "AI 통화 튜터 턴" },
  roleplayPractice: { tier: "basic", openai: () => env("OPENAI_PRACTICE_MODEL") ?? D.roleplayPractice, about: "통화 다시 말해보기 비교" },
  ask: { tier: "high", openai: () => env("OPENAI_ASK_MODEL") ?? D.ask, about: "표현 묻기(빠른·직접 질문)" },
  mission: { tier: "high", openai: () => env("OPENAI_MISSION_MODEL") ?? D.mission, about: "지도 미션 확인" },
  curriculum: { tier: "high", openai: () => env("OPENAI_CURRICULUM_MODEL") ?? D.curriculum, about: "미션 쓰기·지도에 넣기·약점 미션" },
  curriculumMap: { tier: "high", openai: () => env("OPENAI_CURRICULUM_MODEL") ?? D.curriculumMap, about: "My 지도 그리기(고른 단계 범위)" },
  curriculumMapFill: { tier: "high", openai: () => env("OPENAI_CURRICULUM_MODEL") ?? D.curriculumMapFill, about: "My 지도 나눠 그리기 — 주제 몇 개씩 연습 채우기" },
  learnerRead: { tier: "high", openai: () => env("OPENAI_LEARNER_MODEL") ?? D.learnerRead, about: "학습자 프로필·자주 틀리는 것 읽기" },
  roleplayReview: { tier: "high", openai: () => env("OPENAI_REVIEW_MODEL") ?? D.roleplayReview, about: "통화 돌아보기 평가" },
  chatVerify: { tier: "high", openai: () => env("OPENAI_VERIFY_MODEL") ?? D.chatVerify, about: "채팅 고친 문장 확인(위험한 줄만, 열 때)" },
} satisfies Record<TextTask, { tier: Tier; openai: () => string; about: string }>;

export type Task = keyof typeof TASKS;

export type Route = { provider: Provider; model: string; task: Task; tier: Tier };

/** 코드에 박은 기본 경로(`lib/aiDefaults.ts` — 결정·되돌리는 법도 거기). */
export { DEFAULT_ROUTES };

function parseRoutes(): Record<string, string> {
  const raw = env("MODEL_ROUTES");
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).filter(
        (entry): entry is [string, string] => typeof entry[1] === "string",
      ),
    );
  } catch {
    console.error("[llm] MODEL_ROUTES is not JSON — ignored");
    return {};
  }
}

const parseTarget = (value: string) => routeModel(value);

/**
 * 점검용 경로 바꾸기 — 가상 사용자(`simcheck-…`)의 요청에만, 헤더 `x-sim-model-routes`(MODEL_ROUTES와 같은 모양)로.
 * 운영 사용자는 그대로 두고 새 모델을 같은 점검으로 비교하려고(2026-10-21). 허용 모델만 받고, 이 경로에서는
 * 실패를 OpenAI로 덮지 않는다(점검이 실제 실패를 봐야 하므로). `meterRequest`가 요청 첫머리에서 부른다.
 */
const simRoutes = new AsyncLocalStorage<Record<string, string>>();
const SIM_ALLOWED = /^(anthropic:\s*claude-(haiku|sonnet)-5-5|openai:\s*gpt-[\w.-]+)$/;

/** 점검(모델 경로 바꾼 simcheck- 사용자)일 때만 오류 내용을 돌려준다 — 실제 사용자에겐 undefined. */
export function simErrorDetail(error: unknown): string | undefined {
  if (!simRoutes.getStore()) return undefined;
  return (error instanceof Error ? error.message : String(error)).slice(0, 300);
}

export function adoptSimRoutes(userId: string, header: string | null | undefined): void {
  // 서버가 넘기는 id는 "rc:simcheck-…"(requestUserId) — 앞에 rc:가 붙는다(2026-10-21, 이게 빠져 시험 헤더가 안 먹었음).
  if (!header || !/^(rc:)?simcheck-/.test(userId)) return;
  try {
    const parsed = JSON.parse(header) as Record<string, unknown>;
    const kept = Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, string] =>
          typeof entry[1] === "string" &&
          SIM_ALLOWED.test(entry[1].trim()) &&
          (entry[0] in TASKS || entry[0] === "basic" || entry[0] === "high"),
      ),
    );
    if (Object.keys(kept).length) simRoutes.enterWith(kept);
  } catch {
    // 모양이 틀린 헤더는 무시.
  }
}

/** 이 기능이 지금 쓸 모델. `override`는 예전처럼 부르는 쪽이 모델 이름을 직접 줄 때(지도 엔진 등). */
export function routeFor(task: Task, override?: string): Route {
  const spec = TASKS[task];
  const tier = spec.tier as Tier;
  if (override) return { provider: "openai", model: override, task, tier };
  const routes = { ...parseRoutes(), ...(simRoutes.getStore() ?? {}) };
  const chosen =
    parseTarget(routes[task] ?? "") ??
    parseTarget(routes[tier] ?? "") ??
    parseTarget(DEFAULT_ROUTES[task] ?? "");
  if (chosen) {
    // 점검 경로에서는 키가 없어도 OpenAI로 몰래 바꾸지 않는다 — 실패해야 키 문제가 보인다.
    if (chosen.provider === "anthropic" && !env("ANTHROPIC_API_KEY") && !simRoutes.getStore()) {
      return { provider: "openai", model: spec.openai(), task, tier };
    }
    return { ...chosen, task, tier };
  }
  return { provider: "openai", model: spec.openai(), task, tier };
}

/**
 * OpenAI에만 있는 길(스트리밍 통화 턴 등)에서 쓸 OpenAI 모델 이름. 표가 Anthropic을 가리켜도
 * 여기서는 그 기능의 OpenAI 모델(같은 표의 openai 기본값 또는 openai 제공자로 적은 경로)을 준다.
 */
export function openaiModel(task: Task): string {
  const route = routeFor(task);
  return route.provider === "openai" ? route.model : TASKS[task].openai();
}

type CreateParams = Omit<ChatCompletionCreateParamsNonStreaming, "model"> & { model?: string };

/**
 * `openai.chat.completions.create`와 같은 인자(모델 빼고)·같은 모양의 답.
 * `client`는 기본 경로·실패 때 되돌아갈 OpenAI 클라이언트.
 */
/** think: Claude Sonnet·Opus가 먼저 생각하게 둔다(앞 생각을 끄지 않음) — 오래 걸려도 결과가 오래 남는 호출(지도 그리기)만. */
export type CompleteOptions = { think?: boolean };

export async function completeChat(
  client: OpenAI,
  task: Task,
  params: CreateParams,
  options: CompleteOptions = {},
): Promise<ChatCompletion> {
  const { model: override, ...rest } = params;
  const route = routeFor(task, override);
  noteSimModel(`${task}=${route.provider}:${route.model}`);
  if (route.provider === "openai") {
    return client.chat.completions.create(forOpenAIModel(route.model, rest));
  }
  try {
    return await anthropicComplete(route.model, rest, options);
  } catch (error) {
    if (env("MODEL_FALLBACK") === "off" || simRoutes.getStore()) throw error;
    console.error(`[llm] ${task} on ${route.model} failed — falling back to OpenAI`, error);
    noteSimModel(`${task}=openai:${TASKS[task].openai()}(대체)`);
    return client.chat.completions.create(forOpenAIModel(TASKS[task].openai(), rest));
  }
}

/**
 * 추론 모델(gpt-5·gpt-6 계열·o 시리즈) — 2027-01 OpenAI 대체 모델(gpt-6-luna·gpt-5.6-terra)이 모두 여기 든다(2026-10-27 운영 확인:
 * temperature 0.9를 주면 400 "Only the default (1) value is supported"). 숨은 생각 토큰을 쓰고 상한 이름이 다르다.
 */
export function isReasoningModel(model: string): boolean {
  return /^(gpt-5|gpt-6|o\d)/.test(model);
}

/**
 * 가장 짧게 생각하는 값 — 계열마다 이름이 다르다(2026-10-27 운영: gpt-6-luna는 'minimal'을 거절, none·low·medium·high·xhigh만).
 * 옛 gpt-5·gpt-5-mini·o 시리즈는 'minimal'.
 */
export function fastestEffort(model: string): string {
  // gpt-5.6-terra도 'none'(같은 날 운영). 옛 gpt-5·gpt-5-mini·o 시리즈만 'minimal'.
  return /^gpt-(6|5\.[5-9])/.test(model) ? "none" : "minimal";
}

/**
 * 예전 모델(gpt-4o-mini·gpt-4.1)에 맞춰 쓴 인자를 그 모델이 받는 모양으로. 부르는 쪽은 그대로 두고 여기서만 바꾼다:
 * temperature·top_p 같은 샘플링 값은 빼고, max_tokens는 max_completion_tokens(생각 몫을 얹어서)로, 생각은 가장 짧게.
 */
export function forOpenAIModel<T extends Record<string, unknown>>(model: string, params: T): T & { model: string } {
  if (!isReasoningModel(model)) return { ...params, model };
  const { temperature: _t, top_p: _p, presence_penalty: _pp, frequency_penalty: _fp, logprobs: _l, top_logprobs: _tl, max_tokens, ...rest } = params as Record<string, unknown>;
  void _t; void _p; void _pp; void _fp; void _l; void _tl;
  const cap =
    typeof rest.max_completion_tokens === "number"
      ? rest.max_completion_tokens
      : typeof max_tokens === "number"
        ? Math.max(max_tokens * 2, max_tokens + 1024)
        : undefined;
  return {
    ...rest,
    ...(cap ? { max_completion_tokens: cap } : {}),
    reasoning_effort:
      rest.reasoning_effort === undefined || rest.reasoning_effort === "minimal" || rest.reasoning_effort === "none"
        ? fastestEffort(model)
        : rest.reasoning_effort,
    model,
  } as unknown as T & { model: string };
}

/* ───────── Anthropic Messages API (fetch, SDK 없이) ───────── */

type AnthropicBlock =
  | { type: "text"; text: string }
  | {
      type: "image";
      source:
        | { type: "base64"; media_type: string; data: string }
        | { type: "url"; url: string };
    };
type AnthropicMessage = { role: "user" | "assistant"; content: AnthropicBlock[] };

const JSON_ONLY =
  "Answer by calling the respond tool: its input is the JSON object these instructions describe (same keys).";

/**
 * JSON을 바라는 호출은 도구 하나를 꼭 부르게 한다 — 도구 입력은 API가 JSON으로 받아 주므로
 * 글 속 따옴표·줄바꿈이 깨질 일이 없다(글로 받던 때 한국어 답에서 "Unterminated string"이 났음, 2026-10-22).
 */
const RESPOND_TOOL = {
  name: "respond",
  description:
    "Your whole answer: the tool input IS the JSON object the instructions describe, with those keys at the top level (do not wrap it under another key).",
  input_schema: { type: "object", additionalProperties: true },
};

function toBlocks(content: ChatCompletionMessageParam["content"]): AnthropicBlock[] {
  if (content == null) return [];
  if (typeof content === "string") return content ? [{ type: "text", text: content }] : [];
  const out: AnthropicBlock[] = [];
  for (const part of content as unknown as Array<Record<string, unknown>>) {
    if (part.type === "text" && typeof part.text === "string") {
      if (part.text) out.push({ type: "text", text: part.text });
    } else if (part.type === "image_url") {
      const url = (part.image_url as { url?: string } | undefined)?.url ?? "";
      const data = /^data:([^;]+);base64,([\s\S]*)$/.exec(url);
      if (data) out.push({ type: "image", source: { type: "base64", media_type: data[1], data: data[2] } });
      else if (url) out.push({ type: "image", source: { type: "url", url } });
    }
  }
  return out;
}

/** OpenAI 메시지 → Anthropic 요청 본문. 시험할 수 있게 따로 둔다. */
export function toAnthropicRequest(model: string, params: Omit<CreateParams, "model">, options: CompleteOptions = {}) {
  const system: string[] = [];
  const messages: AnthropicMessage[] = [];
  for (const message of params.messages) {
    if (message.role === "system" || message.role === "developer") {
      const text = toBlocks(message.content as ChatCompletionMessageParam["content"])
        .filter((b): b is { type: "text"; text: string } => b.type === "text")
        .map((b) => b.text)
        .join("\n");
      if (text) system.push(text);
      continue;
    }
    if (message.role !== "user" && message.role !== "assistant") continue;
    const blocks = toBlocks(message.content as ChatCompletionMessageParam["content"]);
    if (!blocks.length) continue;
    const last = messages.at(-1);
    if (last && last.role === message.role) last.content.push(...blocks);
    else messages.push({ role: message.role, content: blocks });
  }
  if (!messages.length || messages[0].role !== "user") {
    messages.unshift({ role: "user", content: [{ type: "text", text: "(start)" }] });
  }
  const wantsJson =
    (params.response_format as { type?: string } | undefined)?.type === "json_object" ||
    (params.response_format as { type?: string } | undefined)?.type === "json_schema";
  if (wantsJson) system.push(JSON_ONLY);
  const maxTokens =
    (typeof params.max_completion_tokens === "number" && params.max_completion_tokens) ||
    (typeof params.max_tokens === "number" && params.max_tokens) ||
    2048;
  // 먼저 생각하게 두면 그 토큰도 max_tokens에 든다 — 답 몫이 줄지 않게 생각 몫을 얹는다.
  const thinks = Boolean(options.think) && /sonnet|opus/.test(model);
  const body: Record<string, unknown> = { model, max_tokens: thinks ? maxTokens + 12000 : maxTokens, messages };
  if (system.length) body.system = system.join("\n\n");
  if (wantsJson) {
    body.tools = [RESPOND_TOOL];
    // Sonnet·Opus 5.5는 도구 강제(tool·any)를 400으로 거절한다(운영 2026-10-22, 지도·확인 모델 전부 실패) —
    // 그 모델은 auto로 두고 지시로 부르게 한다. 도구를 안 쓰고 글로 답해도 아래에서 JSON만 뽑는다.
    if (/sonnet|opus/.test(model)) {
      body.tool_choice = { type: "auto" };
      // Sonnet 5.5는 thinking을 안 적으면 먼저 생각(adaptive)하고, 그 토큰이 max_tokens를 먹는다 — 지도에 넣기·미션·지도가
      // 짧은 한도에서 끊기고(점검 2026-10-22: pick 8/8, 미션 6, 지도 1 실패) 지도는 45초. JSON 하나를 내는 호출이라
      // 앞 생각을 끈다("between_tools", disabled는 이 모델이 400). 문서: platform.claude.com build-with-claude/thinking.
      if (!thinks) body.thinking = { type: "between_tools" };
      body.system = [...system, `Answer by calling the ${RESPOND_TOOL.name} tool once with the JSON object as its input.`].join("\n\n");
    } else {
      body.tool_choice = { type: "tool", name: RESPOND_TOOL.name };
    }
  }
  // temperature는 넘기지 않는다: Claude 5.5 세대는 받으면 400 "temperature is deprecated"(운영 확인 2026-10-21).
  return { body, wantsJson };
}

/** 도구 입력이 {"respond": {...}}처럼 한 겹 싸여 오면 벗긴다(Haiku가 가끔 그렇게 보냄, 2026-10-22). */
export function unwrapToolInput(input: unknown): Record<string, unknown> | undefined {
  if (!input || typeof input !== "object" || Array.isArray(input)) return undefined;
  const obj = input as Record<string, unknown>;
  const keys = Object.keys(obj);
  if (keys.length === 1 && ["respond", "response", "input", "answer", "json"].includes(keys[0])) {
    const inner = obj[keys[0]];
    if (inner && typeof inner === "object" && !Array.isArray(inner)) return inner as Record<string, unknown>;
    if (typeof inner === "string") {
      try {
        const parsed = JSON.parse(extractJson(inner)) as unknown;
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as Record<string, unknown>;
      } catch {
        // 글로 싸여 왔는데 JSON이 아니면 그대로 둔다.
      }
    }
  }
  return obj;
}

/**
 * 도구 입력의 큰 배열·객체 값이 JSON 글자로 싸여 오면 풀어 준다 — Sonnet이 지도 `topics`를 "[{…}]" 글자로 보내
 * 주제 0개로 버려진 적 있음(2026-10-22). 맨 위 값만, 풀어서 배열·객체가 될 때만 바꾼다.
 */
export function parseStringifiedValues(input: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = repairLeakedParameters(input);
  for (const [key, value] of Object.entries(out)) {
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (!(trimmed.startsWith("[") || trimmed.startsWith("{"))) continue;
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (parsed && typeof parsed === "object") out[key] = parsed;
    } catch {
      // 글자 그대로 둔다.
    }
  }
  return out;
}

const LEAKED_PARAMETER = /<\/?[A-Za-z_]*>?\s*<parameter name="([A-Za-z_]+)">/;

/**
 * 도구 호출 문법이 값 안으로 새어 들어온 것을 되돌린다 — Haiku가 `spokenReply` 값 끝에
 * `</spokenReply>\n<parameter name="correction">{…}`를 그대로 써서 화면에 보인 적 있음(2026-10-22 release271).
 * 새어 든 자리에서 값을 자르고, 뒤의 `<parameter name="k">값`은 그 칸이 비어 있을 때만 채운다.
 */
export function repairLeakedParameters(input: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...input };
  for (const [key, value] of Object.entries(input)) {
    if (typeof value !== "string") continue;
    const at = value.search(LEAKED_PARAMETER);
    if (at < 0) continue;
    out[key] = value.slice(0, at).trim();
    const rest = value.slice(at);
    const parts = rest.split(/<parameter name="([A-Za-z_]+)">/);
    for (let i = 1; i + 1 < parts.length; i += 2) {
      const name = parts[i]!;
      const raw = parts[i + 1]!.replace(/<\/parameter>[\s\S]*$/, "").replace(/<\/?[A-Za-z_]+>\s*$/, "").trim();
      if (out[name] !== undefined && out[name] !== "") continue;
      try {
        out[name] = JSON.parse(raw) as unknown;
      } catch {
        out[name] = raw;
      }
    }
  }
  return out;
}

/** 모델이 코드 울타리나 앞뒤 말을 붙였으면 JSON 덩어리만 남긴다. */
export function extractJson(text: string): string {
  const trimmed = text.trim();
  const fenced = /^```(?:json)?\s*([\s\S]*?)\s*```$/i.exec(trimmed);
  const inner = fenced ? fenced[1] : trimmed;
  if (inner.startsWith("{") || inner.startsWith("[")) return inner;
  const start = inner.indexOf("{");
  const end = inner.lastIndexOf("}");
  return start >= 0 && end > start ? inner.slice(start, end + 1) : inner;
}

async function anthropicComplete(model: string, params: Omit<CreateParams, "model">, options: CompleteOptions = {}): Promise<ChatCompletion> {
  const key = env("ANTHROPIC_API_KEY");
  if (!key) throw new Error("ANTHROPIC_API_KEY missing");
  const { body, wantsJson } = toAnthropicRequest(model, params, options);
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`anthropic ${response.status}: ${(await response.text()).slice(0, 300)}`);
  }
  const data = (await response.json()) as {
    id?: string;
    content?: Array<{ type: string; text?: string; input?: unknown }>;
    stop_reason?: string;
    usage?: { input_tokens?: number; output_tokens?: number };
  };
  const raw = (data.content ?? []).filter((b) => b.type === "text").map((b) => b.text ?? "").join("");
  const tool = wantsJson ? (data.content ?? []).find((b) => b.type === "tool_use") : undefined;
  const unwrapped = tool ? unwrapToolInput(tool.input) : undefined;
  const input = unwrapped ? parseStringifiedValues(unwrapped) : undefined;
  const text = input ? JSON.stringify(input) : wantsJson ? extractJson(raw) : raw;
  const prompt = data.usage?.input_tokens ?? 0;
  const completion = data.usage?.output_tokens ?? 0;
  return {
    id: data.id ?? "anthropic",
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        message: { role: "assistant", content: text, refusal: null },
        finish_reason: data.stop_reason === "max_tokens" ? "length" : "stop",
        logprobs: null,
      },
    ],
    usage: { prompt_tokens: prompt, completion_tokens: completion, total_tokens: prompt + completion },
  } as ChatCompletion;
}
