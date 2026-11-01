/**
 * 통화 장면(2026-11-02, `hub/drafts/call-scripts-design-2026-11-01.md`).
 *
 * 단계마다 정해진 장면: 튜터 줄은 미리 쓰고(목소리는 모두가 같이 쓰는 캐시), 학습자 차례마다
 * "이 단계 문장구조로 해낼 일"이 있다. 대본이 못 받는 말은 가지 고르기(싼 모델) → 디렉터가 받는다(아직 서버 없음).
 *
 * 그래프 모양은 script.ts(RoleplayScenario)와 같고, 다른 것만 여기에:
 * - 목소리를 정하지 않는다 — 튜터 목소리(여자·남자, lib/tutorGender.ts)는 사용자가 고른다. `toScenario`가 그때 붙인다.
 * - 학습자 차례의 해낼 일은 앱 언어 뜻(en·ko, 다른 앱 언어는 서버가 옮김), 겨냥 틀 `frame`.
 * - 가지마다 뜻 한 줄 `meaning`(영어) — 가지 고르기 모델이 읽는다.
 * - 튜터 줄마다 쉬운 말 `easier` — 🙉 못 알아들었어요(지금은 그때 생성).
 * - **캐릭터 없음(사용자 2026-11-02 "캐릭터는 빼고 그냥 AI 튜터로"):** 말하는 사람은 늘 그 언어의 AI 튜터(chatPartner.ts — 고른 성별의 이름·얼굴·목소리)가
 *   그 장면의 역할(점원·이웃…)을 맡는 것. 장면만의 이름을 만들지 않는다 — 튜터가 자기 이름을 말할 땐 `{tutor}`, 받는 문구에 튜터 이름이 들어가도 `{tutor}`.
 *   튜터가 자기를 말하는 꼴이 성별로 갈리는 줄(hi "आ रही हूँ", es "cansada/cansado" 등)은 문장에 `byTutor: { f, m }`.
 * - 자유 통화(Just talk)와 별개 — 장면은 따로 고르는 통화다.
 *
 * 순수 모듈 — 화면·서버·검사 도구(scripts/call-scenes.ts)가 같이 쓴다. 모델을 부르지 않는다.
 */
import type { LearningLanguageCode } from "../learningLanguages.ts";
import type { Branch, RoleplayScenario, ScriptNode, SentenceBank } from "./script.ts";
import {
  danglingTargets,
  hasEnding,
  learnerFollowedByLearner,
  unreachableNodes,
} from "./script.ts";
import { judge } from "./session.ts";

/** 앱 언어 뜻. ko는 학습 언어가 한국어면 빠질 수 있다. */
export type SceneGloss = { en: string; ko?: string };

/** 튜터 이름 자리(그 언어 AI 튜터의 이름으로 바뀜). */
export const TUTOR_SLOT = "{tutor}";

export type SceneSentence = {
  text: string;
  gloss: SceneGloss;
  /** 튜터가 자기를 말하는 꼴이 성별로 갈릴 때 — 고른 튜터의 꼴로 바꿔 읽는다(없는 쪽은 text·gloss 그대로). */
  byTutor?: { f?: { text: string; gloss?: SceneGloss }; m?: { text: string; gloss?: SceneGloss } };
};

/**
 * 그 언어 AI 튜터 — 이름 자리와 성별 꼴을 채운다.
 * `name`은 앱 화면의 이름(라틴 글자, chatPartner.ts), `native`는 학습 언어 글자로 쓴 같은 이름 — 학습 언어 문장·받는 문구에는 native,
 * 앱 언어 뜻(gloss)에는 name(2026-11-02: 태국어 문장에 "ฉันชื่อPloyค่ะ"처럼 라틴 글자가 섞임).
 */
export type SceneTutor = { name: string; gender: "f" | "m"; native?: string };

/** 라틴 글자가 아닌 학습 언어의 튜터 이름(chatPartner.ts PARTNERS와 같은 사람). 없으면 name 그대로. */
export const TUTOR_NATIVE_NAMES: Record<string, { f: string; m: string }> = {
  ko: { f: "서연", m: "민준" },
  ja: { f: "ゆき", m: "はると" },
  zh: { f: "小美", m: "阿晨" },
  ru: { f: "Аня", m: "Дима" },
  ar: { f: "ليلى", m: "عمر" },
  hi: { f: "प्रिया", m: "अर्जुन" },
  th: { f: "พลอย", m: "นิรันดร์" },
};

/** 장면에 쓸 튜터 — 앱 이름과 학습 언어 글자 이름. */
export function sceneTutor(language: string, gender: "f" | "m", name: string): SceneTutor {
  return { name, gender, native: TUTOR_NATIVE_NAMES[language]?.[gender] ?? name };
}

const fill = (text: string, tutor?: SceneTutor) => (tutor ? text.split(TUTOR_SLOT).join(tutor.native ?? tutor.name) : text);
const fillGloss = (text: string, tutor?: SceneTutor) => (tutor ? text.split(TUTOR_SLOT).join(tutor.name) : text);

export type SceneBranch = Branch & {
  /** 이 가지가 뜻하는 것, 영어 한 줄 — 가지 고르기 모델이 읽는다. */
  meaning: string;
};

export type SceneTutorNode = {
  type: "tutor";
  id: string;
  say: string;
  next: string | null;
  /** 🙉 못 알아들었어요에 쓸 쉬운 말(sentences의 id). */
  easier?: string;
};

export type SceneLearnerNode = {
  type: "learner";
  id: string;
  /** 해낼 일 — 앱 언어 뜻. 학습 언어 정답이 들어가면 안 된다(RULES 11 ①). */
  goal: SceneGloss;
  /** 이 차례에 꺼내 쓸 틀 id(그 단계 이하). 💡는 틀 모양까지. */
  frame?: string;
  expect: SceneBranch[];
  onMiss?: string;
  correction?: string;
};

export type SceneNode = SceneTutorNode | SceneLearnerNode;

export type CallScene = {
  /** "es-s1-01" = 언어-단계-목록 번호. 목소리 캐시가 이 글로 묶이니 내보낸 뒤 바꾸지 않는다. */
  id: string;
  language: LearningLanguageCode;
  stage: number;
  /** 공통 장면 목록(sceneBriefs.ts)의 id. */
  brief: string;
  title: SceneGloss;
  /** 모델이 읽는 장면 설명(영어) — 디렉터가 중간에 들어올 때 받는다. */
  setting: string;
  tutorRole: string;
  /** 그 언어 단계 할 수 있는 일(stages canDo) 중 이 장면이 해내는 것의 번호. */
  canDo: number[];
  start: string;
  nodes: Record<string, SceneNode>;
  sentences: Record<string, SceneSentence>;
  /** "claude" = Claude가 쓰고 다른 모델이 읽음(원어민 확인 전), "native" = 사람 원어민 확인. */
  review?: "claude" | "native";
};

/** 가지·틀 검사에 쓰는 엄격함(보통 난이도 3, difficulty.ts settingsForLevel(3)과 같은 쪽). */
export const SCENE_CHECK_STRICTNESS = 0.6;

export function isSceneLearner(node: SceneNode): node is SceneLearnerNode {
  return node.type === "learner";
}

/** 지금 통화 엔진(session.ts)이 그대로 걸을 수 있는 모양으로 — 목소리는 그때 고른 튜터의 것. */
export function toScenario(
  scene: CallScene,
  voice: string,
  uiLang: "en" | "ko" = "en",
  tutor?: SceneTutor,
): { scenario: RoleplayScenario; bank: SentenceBank } {
  const nodes: Record<string, ScriptNode> = {};
  for (const [id, node] of Object.entries(scene.nodes)) {
    nodes[id] = isSceneLearner(node)
      ? {
          type: "learner",
          id: node.id,
          goal: node.goal[uiLang] ?? node.goal.en,
          expect: node.expect.map(({ match, go, inOrder }) => ({ match: match.map((m) => fill(m, tutor)), go, ...(inOrder ? { inOrder } : {}) })),
          ...(node.onMiss ? { onMiss: node.onMiss } : {}),
          ...(node.correction ? { correction: node.correction } : {}),
        }
      : { type: "tutor", id: node.id, say: node.say, next: node.next };
  }
  const bank: SentenceBank = {};
  for (const [id, sentence] of Object.entries(scene.sentences)) {
    const own = tutor ? sentence.byTutor?.[tutor.gender] : undefined;
    const text = own?.text ?? sentence.text;
    const gloss = own?.gloss ?? sentence.gloss;
    bank[id] = { text: fill(text, tutor), translation: fillGloss(gloss[uiLang] ?? gloss.en, tutor), source: "grown" };
  }
  return {
    scenario: {
      id: scene.id,
      language: scene.language,
      title: scene.title[uiLang] ?? scene.title.en,
      setting: scene.setting,
      tutorRole: scene.tutorRole,
      voice,
      unrecorded: true,
      start: scene.start,
      nodes,
    },
    bank,
  };
}

/** 검사에 필요한 바깥 자료 — 도구가 curriculum에서 채워 넘긴다(이 모듈은 curriculum을 모른다). */
export type SceneContext = {
  /** 틀 id → 단계·고정 부분 패턴. */
  frames: ReadonlyMap<string, { stage: number; pattern: string }>;
  /** 그 언어 그 단계 할 수 있는 일 수. */
  canDoCount: number;
  /** 학습 언어가 한국어면 ko 뜻이 없어도 됨. */
  needsKo: boolean;
  /** 틀이 들었는지(scriptBank.ts frameUsed). */
  frameUsed: (pattern: string, text: string) => boolean;
};

const lower = (text: string) => text.toLocaleLowerCase().replace(/\s+/g, " ").trim();

/** 한 장면 규칙. 빈 배열이면 통과. */
export function checkScene(scene: CallScene, ctx: SceneContext): string[] {
  const out: string[] = [];
  const at = (msg: string) => out.push(`${scene.id}: ${msg}`);
  if (!/^[a-z]{2}-s\d-\d{2}$/.test(scene.id)) at(`id 모양 "${scene.id}"(예: es-s1-01)`);
  if (!scene.title?.en) at("title.en 없음");
  if (ctx.needsKo && !scene.title?.ko) at("title.ko 없음");
  if (!scene.setting || !scene.tutorRole) at("setting·tutorRole 없음");
  if (!Array.isArray(scene.canDo) || scene.canDo.some((n) => !Number.isInteger(n) || n < 0 || n >= ctx.canDoCount)) {
    at(`canDo 번호는 0~${ctx.canDoCount - 1}`);
  }

  // 그래프 — script.ts 검사를 그대로(목소리는 아무것이나, 튜터 이름은 견본).
  const { scenario } = toScenario(scene, "alloy", "en", { name: "Alex", gender: "f" });
  for (const id of danglingTargets(scenario)) at(`없는 마디로 감: ${id}`);
  for (const id of unreachableNodes(scenario)) at(`닿지 않는 마디: ${id}`);
  for (const pair of learnerFollowedByLearner(scenario)) at(`학습자 다음 바로 학습자: ${pair}`);
  if (!hasEnding(scenario)) at("끝(next: null)이 없음");

  const nodes = Object.values(scene.nodes);
  const learners = nodes.filter(isSceneLearner);
  if (learners.length < 4) at(`학습자 차례 ${learners.length}개 — 4개 이상`);
  if (learners.length > 12) at(`학습자 차례 ${learners.length}개 — 12개 이하`);

  for (const node of nodes) {
    if (node.id !== Object.entries(scene.nodes).find(([, n]) => n === node)?.[0]) at(`마디 id가 키와 다름: ${node.id}`);
    if (node.type === "tutor") {
      if (!scene.sentences[node.say]) at(`${node.id}: 없는 문장 ${node.say}`);
      if (node.easier && !scene.sentences[node.easier]) at(`${node.id}: 없는 쉬운 말 ${node.easier}`);
      // 학습자가 이어 말해야 하는 줄에는 🙉용 쉬운 말.
      const next = node.next ? scene.nodes[node.next] : null;
      if (next && isSceneLearner(next) && !node.easier) at(`${node.id}: 학습자 차례 앞 줄에 easier 없음`);
      continue;
    }
    if (!node.goal?.en) at(`${node.id}: goal.en 없음`);
    if (ctx.needsKo && !node.goal?.ko) at(`${node.id}: goal.ko 없음`);
    if (node.frame) {
      const frame = ctx.frames.get(node.frame);
      if (!frame) at(`${node.id}: 없는 틀 ${node.frame}`);
      else if (frame.stage > scene.stage) at(`${node.id}: 틀 ${node.frame}은 ${frame.stage}단계(장면 ${scene.stage}단계)`);
    }
    if (node.expect.length < 2) at(`${node.id}: 가지 ${node.expect.length}개 — 2개 이상`);
    if (!node.onMiss && !node.correction) at(`${node.id}: onMiss·correction 둘 다 없음`);
    if (node.correction && !scene.sentences[node.correction]) at(`${node.id}: 없는 교정 문장 ${node.correction}`);
    for (const branch of node.expect) {
      if (!branch.meaning) at(`${node.id}→${branch.go}: meaning 없음`);
      if (branch.match.length < 3) at(`${node.id}→${branch.go}: match ${branch.match.length}개 — 3개 이상`);
      // 받을 문구는 그 가지로 실제로 맞아야(앞 가지에 먹히지 않게) — 지금 맞추기(session.judge)로.
      for (const phrase of branch.match) {
        const heard = fill(phrase, { name: "Alex", gender: "f" });
        const got = judge(scenario.nodes[node.id] as never, heard, SCENE_CHECK_STRICTNESS);
        if (!got) at(`${node.id}: "${phrase}"가 어느 가지에도 안 맞음`);
        else if (got.go !== branch.go && !node.expect.some((b) => b.go === got.go && b.match.includes(phrase))) {
          at(`${node.id}: "${phrase}"(→${branch.go})가 앞 가지 →${got.go}로 감`);
        }
      }
      // 답이 새지 않게: 해낼 일 뜻에 학습 언어 받을 문구가 그대로 들어 있으면 안 됨.
      for (const phrase of branch.match) {
        const p = lower(phrase);
        if (p.length >= 4 && [node.goal?.en, node.goal?.ko].some((g) => g && lower(g).includes(p))) {
          at(`${node.id}: 해낼 일 뜻에 답 "${phrase}"가 보임`);
        }
      }
    }
    // 겨냥 틀이면 첫 가지(바라는 대답) 중 하나 이상에 틀이 들어 있어야.
    if (node.frame) {
      const frame = ctx.frames.get(node.frame);
      const first = node.expect[0];
      if (frame && first && !first.match.some((m) => ctx.frameUsed(frame.pattern, m))) {
        at(`${node.id}: 첫 가지 문구에 틀 ${node.frame}(${frame.pattern})이 안 들어감`);
      }
    }
  }
  const slots = /\{(?!tutor\})[^}]*\}/;
  for (const [id, sentence] of Object.entries(scene.sentences)) {
    for (const variant of [sentence.byTutor?.f, sentence.byTutor?.m]) {
      if (variant && !variant.text?.trim()) at(`문장 ${id}: byTutor 글 없음`);
    }
    if (slots.test(sentence.text)) at(`문장 ${id}: 모르는 자리 ${sentence.text.match(slots)?.[0]}`);
    if (!sentence.text?.trim()) at(`문장 ${id}: 글 없음`);
    if (!sentence.gloss?.en) at(`문장 ${id}: gloss.en 없음`);
    if (ctx.needsKo && !sentence.gloss?.ko) at(`문장 ${id}: gloss.ko 없음`);
  }
  return out;
}

/** 한 단계 장면들을 합쳐 범위 약속을 덮는지(설계 15절 빈틈 검사). */
export function checkStageCoverage(
  scenes: readonly CallScene[],
  input: {
    stage: number;
    /** 그 단계 틀 id 전부. */
    stageFrames: readonly string[];
    canDoCount: number;
    /** 목표 대화(stages dialogues[1])에 든 틀 id. */
    targetFrames: readonly string[];
  },
): string[] {
  const out: string[] = [];
  const own = scenes.filter((scene) => scene.stage === input.stage);
  const aimed = new Set(own.flatMap((scene) => Object.values(scene.nodes).filter(isSceneLearner).map((n) => n.frame).filter(Boolean) as string[]));
  for (const id of input.stageFrames) if (!aimed.has(id)) out.push(`단계 ${input.stage}: 틀 ${id}를 겨냥한 차례가 없음`);
  const done = new Set(own.flatMap((scene) => scene.canDo));
  for (let i = 0; i < input.canDoCount; i += 1) if (!done.has(i)) out.push(`단계 ${input.stage}: 할 수 있는 일 ${i}번을 해내는 장면이 없음`);
  for (const id of input.targetFrames) if (!aimed.has(id)) out.push(`단계 ${input.stage}: 목표 대화의 틀 ${id}를 겨냥한 차례가 없음`);
  const ids = new Set<string>();
  for (const scene of own) {
    if (ids.has(scene.id)) out.push(`같은 id 둘: ${scene.id}`);
    ids.add(scene.id);
  }
  return out;
}
