import type { UICopy } from "../copy.ts";

/** 세부 칸 이름(수업 통화가 겨냥하는 "부족한 칸")에 쓰는 표. */
const POS: Record<string, keyof UICopy> = { noun: "posNoun", verb: "posVerb", adj: "posAdj", adv: "posAdv", function: "posFunction" };
const FN: Record<string, keyof UICopy> = { self: "fnSelf", ask: "fnAsk", request: "fnRequest", time: "fnTime", reason: "fnReason", compare: "fnCompare", mind: "fnMind", daily: "fnDaily" };
const MISS: Record<string, keyof UICopy> = { spell: "missSpell", form: "missForm", word: "missWord", particle: "missParticle", order: "missOrder", missing: "missMissing" };
const WHY: Record<string, keyof UICopy> = { slow: "whySlow", hint: "whyHint", native: "whyNative", fix: "whyFix", minimal: "whyMinimal" };
const LEAD: Record<string, keyof UICopy> = { ask: "leadAsk", topic: "leadTopic", extend: "leadExtend" };

/** 세부 칸 이름 — 문법 칸은 부르는 쪽(grammarName)이 단계 문법 이름으로. */
export function cellName(ui: UICopy, id: string, grammarName: (stage: number, index: number) => string): string {
  const [kind, a, b] = id.split(":");
  const pick = (table: Record<string, keyof UICopy>) => String(ui[table[a ?? ""] ?? "fillUnknown"] ?? a);
  if (kind === "stage" || kind === "band") return ui.stageNumber.replace("{n}", a ?? "");
  if (kind === "pos") return pick(POS);
  if (kind === "topic") return String(ui[`topic${(a ?? "").charAt(0).toUpperCase()}${(a ?? "").slice(1)}` as keyof UICopy] ?? a);
  if (kind === "gram") return grammarName(Number(a), Number(b)) || `${ui.partGrammar} ${a}-${Number(b) + 1}`;
  if (kind === "fn") return pick(FN);
  if (kind === "miss") return pick(MISS);
  if (kind === "why") return pick(WHY);
  if (kind === "lead") return pick(LEAD);
  if (id === "part:flow") return ui.talkFlow;
  if (id === "part:lead") return ui.cellLead;
  return id;
}
