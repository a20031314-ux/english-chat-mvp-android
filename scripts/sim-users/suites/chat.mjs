/**
 * 채팅 묶음: 첫 인사 → 페르소나의 턴들 → 앱 언어로 쓴 줄엔 "표현 보기" 카드.
 * 다른 묶음(오늘 해볼 것·직접 묻기·내 표현)이 읽을 기록을 이 묶음이 먼저 쌓는다.
 */
import { writtenInLearningLanguage } from "../../../src/lib/inputLanguage.ts";
import { planTurns } from "../personas.mjs";
import { detectCard, detectStart, detectTurn } from "../detect.mjs";
import { personaLine } from "../llm.mjs";

const langsFor = (p) => ({ targetLanguage: p.target, interfaceLanguage: p.ui, locale: p.ui });

export default {
  id: "chat",
  label: "채팅·표현 카드",
  every: 1,
  estimate({ persona, bank, opts }) {
    const plan = planTurns(persona, bank, { turns: opts.turns, seed: opts.seed });
    const own = opts.noCard ? 0 : plan.filter((t) => t.kind === "own" || !writtenInLearningLanguage(t.text, persona.target, persona.ui)).length;
    return { requests: 1 + plan.length + own, usd: plan.length * 0.003 };
  },
  async run({ persona, userId, call, bank, opts, step, shared }) {
    const plan = planTurns(persona, bank, { turns: opts.turns, seed: opts.seed });
    const recent = [];
    const replies = [];
    shared.chatLines = [];

    const start = await call(userId, "/api/chat", { body: { mode: "start", ...langsFor(persona) } });
    const opening = String(start.body?.assistantMessage ?? "");
    step({ turn: 0, kind: "start", text: "(첫 인사)", status: start.status, ms: start.ms, reply: opening, issues: detectStart({ persona, response: start }) });
    if (opening) { recent.push(`other: ${opening}`); replies.push(opening); }

    for (let t = 0; t < plan.length; t += 1) {
      const turn = { ...plan[t] };
      if (opts.llmPersona && turn.kind === "practice") {
        turn.text = await personaLine(persona, recent, turn.text);
        turn.expect = {};
      }
      const ownLanguage = turn.kind !== "misbehavior" && !writtenInLearningLanguage(turn.text, persona.target, persona.ui);
      const effective = ownLanguage ? { ...turn, kind: "own" } : turn;
      const response = await call(userId, "/api/chat", {
        body: { mode: "chat", message: turn.text, ...langsFor(persona), ...(ownLanguage ? { ownLanguage: true } : {}), recent: recent.slice(-8) },
      });
      const issues = detectTurn({ persona, turn: effective, response, previousReplies: replies });
      const reply = String(response.body?.assistantMessage ?? "");
      const entry = {
        turn: t + 1,
        kind: effective.kind,
        misbehavior: turn.misbehavior,
        expect: turn.expect ?? {},
        text: turn.text,
        ownLanguage,
        status: response.status,
        ms: response.ms,
        reply,
        spoken: response.body?.spokenReply ?? "",
        corrected: response.body?.correction?.corrected ?? "",
        natural: response.body?.correction?.natural ?? "",
        explanation: response.body?.correction?.explanation ?? "",
        issues,
      };
      // 앱 언어로 쓴 줄이면 사용자는 그 아래 "표현 보기"를 누른다 (채팅 횟수 안 줄어듦).
      if (ownLanguage && !opts.noCard && response.status === 200) {
        const card = await call(userId, "/api/chat", { body: { mode: "how_to_say", expressionOnly: true, message: turn.text, ...langsFor(persona), recent: recent.slice(-8) } });
        entry.card = { status: card.status, ms: card.ms, expression: card.body?.expression ?? "", example: card.body?.example ?? "" };
        entry.issues.push(...detectCard({ persona, response: card }));
      }
      step(entry);
      if (!ownLanguage && turn.kind !== "misbehavior") {
        recent.push(`me: ${turn.text}`);
        if (response.status === 200) shared.chatLines.push({ text: turn.text, corrected: entry.corrected, reply });
      }
      if (reply) { recent.push(`other: ${reply}`); replies.push(reply); }
      if (issues.some((i) => i.kind === "daily_limit") || response.error?.startsWith("MAX_REQUESTS")) break;
    }
    shared.recent = recent;
  },
};
