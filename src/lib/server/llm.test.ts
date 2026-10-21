import assert from "node:assert/strict";
import test from "node:test";
import { adoptSimRoutes, extractJson, unwrapToolInput, openaiModel, routeFor, TASKS, toAnthropicRequest } from "./llm.ts";

const KEYS = [
  "MODEL_ROUTES",
  "ANTHROPIC_API_KEY",
  "OPENAI_MODEL",
  "OPENAI_CURRICULUM_MODEL",
  "OPENAI_ASK_MODEL",
  "OPENAI_REVIEW_MODEL",
  "OPENAI_VISION_MODEL",
];

function withEnv(values: Record<string, string | undefined>, run: () => void) {
  const saved = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));
  for (const k of KEYS) delete process.env[k];
  for (const [k, v] of Object.entries(values)) if (v !== undefined) process.env[k] = v;
  try {
    run();
  } finally {
    for (const k of KEYS) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  }
}

test("설정이 없으면 기능마다 예전 OpenAI 모델 그대로", () => {
  withEnv({}, () => {
    assert.deepEqual(
      { ...routeFor("chat") },
      { provider: "openai", model: "gpt-4o-mini", task: "chat", tier: "basic" },
    );
    assert.equal(routeFor("curriculum").model, "gpt-4.1");
    assert.equal(routeFor("mission").model, "gpt-4.1-mini");
    assert.equal(routeFor("ask").model, "gpt-4.1-mini");
    assert.equal(routeFor("learnerRead").model, "gpt-4.1-mini");
    assert.equal(routeFor("roleplayReview").model, "gpt-5-mini");
    assert.equal(routeFor("roleplayTutor").model, "gpt-4.1-mini");
    assert.equal(routeFor("vision").model, "gpt-4o-mini");
  });
});

test("예전 환경 변수도 그대로 먹는다", () => {
  withEnv({ OPENAI_MODEL: "gpt-x", OPENAI_CURRICULUM_MODEL: "gpt-y" }, () => {
    assert.equal(routeFor("chat").model, "gpt-x");
    assert.equal(routeFor("vision").model, "gpt-x");
    assert.equal(routeFor("curriculum").model, "gpt-y");
  });
});

test("MODEL_ROUTES: 기능 이름이 등급보다 앞선다", () => {
  withEnv(
    {
      ANTHROPIC_API_KEY: "k",
      MODEL_ROUTES: JSON.stringify({
        basic: "anthropic:claude-haiku-5-5",
        high: "anthropic:claude-sonnet-5-5",
        mission: "anthropic:claude-opus-5-5",
      }),
    },
    () => {
      assert.equal(routeFor("chat").model, "claude-haiku-5-5");
      assert.equal(routeFor("chat").provider, "anthropic");
      assert.equal(routeFor("curriculum").model, "claude-sonnet-5-5");
      assert.equal(routeFor("mission").model, "claude-opus-5-5");
    },
  );
});

test("Anthropic 키가 없으면 OpenAI 기본으로", () => {
  withEnv({ MODEL_ROUTES: JSON.stringify({ basic: "anthropic:claude-haiku-5-5" }) }, () => {
    assert.deepEqual(
      { provider: routeFor("chat").provider, model: routeFor("chat").model },
      { provider: "openai", model: "gpt-4o-mini" },
    );
  });
});

test("잘못된 MODEL_ROUTES는 무시", () => {
  withEnv({ MODEL_ROUTES: "{not json" }, () => {
    assert.equal(routeFor("chat").model, "gpt-4o-mini");
  });
  withEnv({ MODEL_ROUTES: JSON.stringify({ chat: "gemini:x" }) }, () => {
    assert.equal(routeFor("chat").model, "gpt-4o-mini");
  });
});

test("부르는 쪽이 모델 이름을 주면 그것(지도 엔진)", () => {
  withEnv({ ANTHROPIC_API_KEY: "k", MODEL_ROUTES: JSON.stringify({ high: "anthropic:claude-sonnet-5-5" }) }, () => {
    assert.equal(routeFor("curriculum", "gpt-4.1").model, "gpt-4.1");
    assert.equal(routeFor("curriculum", "gpt-4.1").provider, "openai");
  });
});

test("스트리밍 길은 표가 Anthropic이어도 OpenAI 모델", () => {
  withEnv({ ANTHROPIC_API_KEY: "k", MODEL_ROUTES: JSON.stringify({ basic: "anthropic:claude-haiku-5-5" }) }, () => {
    assert.equal(openaiModel("roleplayTutor"), "gpt-4.1-mini");
  });
  withEnv({ MODEL_ROUTES: JSON.stringify({ roleplayTutor: "openai:gpt-z" }) }, () => {
    assert.equal(openaiModel("roleplayTutor"), "gpt-z");
  });
});

test("모든 기능에 등급과 설명이 있다", () => {
  for (const [name, spec] of Object.entries(TASKS)) {
    assert.ok(spec.tier === "basic" || spec.tier === "high", name);
    assert.ok(spec.about.length > 0, name);
  }
});

test("OpenAI 메시지를 Anthropic 요청으로", () => {
  const { body, wantsJson } = toAnthropicRequest("claude-haiku-5-5", {
    messages: [
      { role: "system", content: "You are a tutor." },
      { role: "system", content: "Learner brief." },
      { role: "user", content: '{"message":"안녕"}' },
      {
        role: "user",
        content: [
          { type: "text", text: "photo" },
          { type: "image_url", image_url: { url: "data:image/png;base64,QUJD" } },
        ],
      },
      { role: "assistant", content: "ok" },
    ],
    response_format: { type: "json_object" },
    temperature: 1.4,
    max_tokens: 300,
  });
  assert.equal(wantsJson, true);
  assert.equal(body.model, "claude-haiku-5-5");
  assert.deepEqual(body.tool_choice, { type: "tool", name: "respond" });
  assert.equal(body.max_tokens, 300);
  assert.equal(body.temperature, undefined); // 5.5 세대는 temperature를 거절
  assert.match(String(body.system), /^You are a tutor\.\n\nLearner brief\.\n\n.*JSON/s);
  const messages = body.messages as Array<{ role: string; content: Array<Record<string, unknown>> }>;
  assert.equal(messages.length, 2);
  assert.equal(messages[0].role, "user");
  assert.equal(messages[0].content.length, 3);
  assert.deepEqual(messages[0].content[2], {
    type: "image",
    source: { type: "base64", media_type: "image/png", data: "QUJD" },
  });
  assert.equal(messages[1].role, "assistant");
});

test("첫 메시지가 user가 아니면 앞에 하나 넣고, 토큰 한도 기본값", () => {
  const { body, wantsJson } = toAnthropicRequest("m", {
    messages: [{ role: "assistant", content: "hi" }],
  });
  assert.equal(wantsJson, false);
  assert.equal(body.max_tokens, 2048);
  assert.equal((body.messages as Array<{ role: string }>)[0].role, "user");
  assert.equal(body.temperature, undefined);
  assert.equal(body.system, undefined);
  assert.equal(body.tools, undefined);
});

test("JSON만 남기기", () => {
  assert.equal(extractJson('```json\n{"a":1}\n```'), '{"a":1}');
  assert.equal(extractJson('Here you go: {"a":{"b":2}} thanks'), '{"a":{"b":2}}');
  assert.equal(extractJson('{"a":1}'), '{"a":1}');
  assert.equal(extractJson("[1,2]"), "[1,2]");
});

const inFreshContext = (run: () => void) =>
  new Promise<void>((resolve, reject) =>
    setImmediate(() => {
      try {
        run();
        resolve();
      } catch (error) {
        reject(error);
      }
    }),
  );

test("점검 사용자만 헤더로 모델 경로를 바꾼다(허용 모델만)", async () => {
  await inFreshContext(() =>
    withEnv({ ANTHROPIC_API_KEY: "k" }, () => {
      adoptSimRoutes("simcheck-run-p001", JSON.stringify({ basic: "anthropic: claude-haiku-5-5", high: "anthropic: claude-opus-5-5" }));
      assert.equal(routeFor("chat").model, "claude-haiku-5-5");
      assert.equal(routeFor("mission").model, "gpt-4.1-mini"); // opus는 허용 목록 밖
    }),
  );
  await inFreshContext(() =>
    withEnv({ ANTHROPIC_API_KEY: "k" }, () => {
      adoptSimRoutes("rc:simcheck-run-p002", JSON.stringify({ basic: "anthropic: claude-haiku-5-5" }));
      assert.equal(routeFor("chat").model, "claude-haiku-5-5"); // 서버가 실제로 넘기는 모양
    }),
  );
  await inFreshContext(() =>
    withEnv({ ANTHROPIC_API_KEY: "k" }, () => {
      adoptSimRoutes("rc:real-user", JSON.stringify({ basic: "anthropic: claude-haiku-5-5" }));
      assert.equal(routeFor("chat").model, "gpt-4o-mini");
    }),
  );
  await inFreshContext(() =>
    withEnv({ ANTHROPIC_API_KEY: "k" }, () => {
      adoptSimRoutes("simcheck-x", "{nope");
      assert.equal(routeFor("chat").model, "gpt-4o-mini");
    }),
  );
});

test("도구 입력이 한 겹 싸여 오면 벗긴다", () => {
  assert.deepEqual(unwrapToolInput({ respond: { assistantMessage: "좋아요!" } }), { assistantMessage: "좋아요!" });
  assert.deepEqual(unwrapToolInput({ respond: '{"assistantMessage":"¡Vale!"}' }), { assistantMessage: "¡Vale!" });
  assert.deepEqual(unwrapToolInput({ assistantMessage: "いいね", spokenReply: "" }), { assistantMessage: "いいね", spokenReply: "" });
  assert.equal(unwrapToolInput(null), undefined);
});

test("Sonnet·Opus는 도구 강제 없이 auto(5.5 세대가 강제를 거절)", () => {
  const { body } = toAnthropicRequest("claude-sonnet-5-5", {
    messages: [{ role: "user", content: "hi" }],
    response_format: { type: "json_object" },
  });
  assert.deepEqual(body.tool_choice, { type: "auto" });
  assert.match(String(body.system), /calling the respond tool/);
});
