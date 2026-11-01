/**
 * 가지 고르기(2026-11-02, `hub/drafts/call-scripts-design-2026-11-01.md` 4절 2).
 *
 * 장면 통화에서 학습자 말을 규칙 맞추기(session.ts judge — 낱말 겹침)가 못 받으면, 튜터(디렉터)를 깨우기 전에
 * 싼 모델이 "그 차례의 가지 중 어느 뜻인가, 아니면 없음"만 고른다. 시범(2026-10-21 한국어 카페): 규칙 51% → 90%,
 * 틀린 가지 0, 대본 밖 말 12개 모두 "없음". 조사·어미가 붙는 말·초급의 틀린 꼴·받아쓰기 실수를 뜻으로 받는 몫.
 *
 * 순수 모듈: 모델에 줄 글을 만들고 답을 읽는다. 부르는 곳은 /api/roleplay/branch.
 */
import { learningLanguageName } from "../learningLanguages.ts";
import { isSceneLearner, toScenario, type CallScene, type SceneLearnerNode, type SceneTutor } from "./callScene.ts";
import { judge } from "./session.ts";

/** 가지마다 모델에 보여 줄 예시 수. 다 보여 주면 글자 겹침으로 고르는 버릇이 생긴다. */
const EXAMPLES = 3;

export type BranchPick = { go: string; branch: number; by: "rule" | "model" } | { go: null; branch: null; by: "none" };

/** 이 학습자 차례 바로 앞 튜터 줄(next가 이 차례인 것) — 모델이 문맥으로 읽는다. 여럿이면 처음 것. */
export function promptLineFor(scene: CallScene, nodeId: string): string {
  for (const node of Object.values(scene.nodes)) {
    if (node.type === "tutor" && node.next === nodeId) return scene.sentences[node.say]?.text ?? "";
  }
  return "";
}

/** 그 언어의 글자(띄어쓰기·라틴 밖 언어만). 이 글자가 하나도 없는 말은 다른 언어로 한 말이다. */
const SCRIPT: Record<string, RegExp> = {
  ko: /\p{Script=Hangul}/u,
  ja: /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u,
  zh: /\p{Script=Han}/u,
  th: /\p{Script=Thai}/u,
  ar: /\p{Script=Arabic}/u,
  hi: /\p{Script=Devanagari}/u,
  ru: /\p{Script=Cyrillic}/u,
};

/** 학습 언어 글자가 하나도 없이 다른 글자(라틴 등)만 있는 말 — 모델 없이 "없음"(운영 2026-11-02: 영어 대답을 받아 줌). */
export function otherScript(language: string, heard: string): boolean {
  const own = SCRIPT[language];
  return Boolean(own) && !own!.test(heard) && /\p{L}/u.test(heard);
}

/** 규칙 맞추기 먼저 — 맞으면 모델을 부르지 않는다(무료). */
export function ruleBranch(scene: CallScene, nodeId: string, heard: string, strictness: number, tutor?: SceneTutor): BranchPick | null {
  const { scenario } = toScenario(scene, "alloy", "en", tutor);
  const node = scenario.nodes[nodeId];
  if (!node || node.type !== "learner") return null;
  const got = judge(node, heard, strictness);
  if (!got) return null;
  const branch = node.expect.findIndex((one) => one.go === got.go);
  return { go: got.go, branch, by: "rule" };
}

export function learnerNode(scene: CallScene, nodeId: string): SceneLearnerNode | null {
  const node = scene.nodes[nodeId];
  return node && isSceneLearner(node) ? node : null;
}

export const BRANCH_SYSTEM = `You route one spoken reply in a language-learning phone role-play.
The learner is a beginner and the text is an automatic transcript, so expect grammar mistakes, missing or wrong word endings, wrong particles, and mis-heard words.
Choose the numbered option whose meaning the reply expresses in this moment of the conversation — judge the meaning, not the exact words. A reply that expresses an option's meaning with errors still counts.
Answer none when the reply does not express any option: it says something else, asks something the options do not cover, or is unintelligible.
Also answer none when the reply is wholly or mostly in another language than the one being learned (for example English or the learner's own language), even if its meaning matches an option — the learner has to say it in the language being learned. A single borrowed word or a name inside a reply in the learned language is fine.
If two options both fit, choose the earlier one.
Reply with JSON only: {"pick": <option number>} or {"pick": null}.`;

/** 모델에 줄 사용자 글. 학습자 말은 그대로(따옴표 안), 저장하지 않는다. */
export function branchPrompt(scene: CallScene, node: SceneLearnerNode, heard: string, tutor?: SceneTutor): string {
  const fill = (text: string) => (tutor ? text.split("{tutor}").join(tutor.native ?? tutor.name) : text);
  const options = node.expect
    .map((branch, i) => {
      const examples = branch.match.slice(0, EXAMPLES).map((m) => `"${fill(m)}"`).join(" / ");
      return `${i + 1}. ${branch.meaning} — e.g. ${examples}`;
    })
    .join("\n");
  const line = fill(promptLineFor(scene, node.id));
  return [
    `Language being learned: ${learningLanguageName(scene.language)}`,
    `Scene: ${scene.setting}`,
    line ? `The tutor just said: "${line}"` : "",
    `The learner's task now: ${node.goal.en}`,
    `Options:\n${options}`,
    `The learner said: "${heard}"`,
  ]
    .filter(Boolean)
    .join("\n");
}

/** 모델 답 → 가지 번호(0부터) 또는 null. 이상한 답·범위 밖 번호는 null(튜터가 받음). */
export function readPick(reply: string, branches: number): number | null {
  const match = /"pick"\s*:\s*(null|\d+)/.exec(reply);
  if (!match || match[1] === "null") return null;
  const index = Number(match[1]) - 1;
  return Number.isInteger(index) && index >= 0 && index < branches ? index : null;
}
