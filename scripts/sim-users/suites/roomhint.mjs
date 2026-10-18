/**
 * 말하는 방 💡 힌트 묶음.
 *
 *   1) 힌트를 띄울지(앱 안 판단, leansOnOwnLanguage) — 요청 없이 그 사람의 조합으로:
 *      편한 말 한 줄 → 띄움, 학습 언어로 맞게 쓴 줄 → 안 띄움. 같은 라틴 글자 짝(es↔fr 등)은 흔한 낱말로 가르고,
 *      ja↔zh는 가를 수 없어 띄우지 않는 게 정상.
 *   2) 힌트 받기(/api/chat how_to_say + purpose roomHint): 앞 줄 맥락 + 편한 말 → 학습 언어 표현.
 *      채팅 횟수로 세지 않는다. 4명 중 1명만 서버까지(작은 모델 한 번).
 * 하루 40번 상한(HINT_LIMIT)은 끝까지 채우지 않는다(서버 단위 테스트 몫).
 */
import { leansOnOwnLanguage } from "../../../src/lib/roleplay/transcript.ts";
import { detectCard, issue } from "../detect.mjs";

const UNDECIDABLE = new Set(["ja:zh", "zh:ja"]);

export default {
  id: "roomhint",
  label: "말하는 방 힌트",
  every: 1,
  note: "서버 호출은 4명 중 1명",
  estimate({ persona }) {
    return asksServer(persona) ? { requests: 1, usd: 0.0005 } : { requests: 0, usd: 0 };
  },
  async run({ persona, userId, call, bank, step }) {
    const learning = persona.target;
    const own = persona.ui;
    const ownLine = bank.ownLanguage[own];
    const okLines = (bank.learner[learning] ?? []).filter((l) => l.ok).map((l) => l.text);

    // ── 1) 띄울지 ──
    const dIssues = [];
    const pair = `${learning}:${own}`;
    const ownLeans = leansOnOwnLanguage(ownLine, learning, own);
    if (learning !== own && !UNDECIDABLE.has(pair) && !ownLeans) {
      dIssues.push(issue("warn", "hint_missed", `편한 말(${own}) 줄인데 힌트를 안 띄움`, { sample: ownLine.slice(0, 80) }));
    }
    if (UNDECIDABLE.has(pair) && ownLeans) dIssues.push(issue("warn", "hint_false", "ja↔zh는 가르지 않기로 했는데 띄움"));
    const wrongly = okLines.filter((line) => leansOnOwnLanguage(line, learning, own));
    for (const line of wrongly.slice(0, 2)) {
      dIssues.push(issue("warn", "hint_false", `학습 언어(${learning})로 맞게 쓴 줄에 힌트를 띄움`, { sample: line.slice(0, 80) }));
    }
    step({
      title: "힌트 띄울지 (앱 안 판단)",
      input: `${pair} · 편한 말 1 · 학습 언어 ${okLines.length}`,
      outputs: [{ label: "결과", text: `편한 말 ${ownLeans ? "띄움" : "안 띄움"} · 학습 언어 줄 잘못 띄움 ${wrongly.length}/${okLines.length}` }],
      issues: dIssues,
    });

    // ── 2) 힌트 받기 ──
    if (!asksServer(persona) || learning === own) return;
    const recent = okLines.slice(0, 2).map((line, index) => `${index % 2 ? "me" : "other"}: ${line}`);
    const res = await call(userId, "/api/chat", {
      body: {
        message: ownLine,
        mode: "how_to_say",
        expressionOnly: true,
        purpose: "roomHint",
        locale: own,
        interfaceLanguage: own,
        targetLanguage: learning,
        recent,
      },
    });
    const hIssues = res.body?.error === "HINT_LIMIT" ? [issue("error", "hint_limit", "처음 부른 힌트가 하루 상한에 걸림")] : detectCard({ persona, response: res });
    step({ title: "💡 힌트 받기 (roomHint)", input: ownLine, status: res.status, ms: res.ms, outputs: [{ label: "이렇게 말해 보세요", text: res.body?.expression ?? res.body?.error ?? "" }], issues: hIssues });
  },
};

function asksServer(persona) {
  return Number(String(persona.id).replace(/\D/g, "")) % 4 === 0;
}
