/**
 * My 첫 열기 묶음 — 새 사용자에게 지도가 비어 있는지, 학습자 요약이 열리는지.
 */
import { checkHttp, issue } from "../detect.mjs";

export default {
  id: "map",
  label: "My 첫 열기",
  every: 7,
  estimate() {
    return { requests: 2, usd: 0 };
  },
  async run({ persona, userId, call, step }) {
    const lang = persona.target;
    const P = "map";

    // 1. 지도 없음
    const empty = await call(userId, "/api/curriculum", { method: "GET", query: { lang } });
    const emptyIssues = checkHttp(P, empty);
    if (empty.status === 200 && empty.body?.map) emptyIssues.push(issue("error", "map_logic", "새 사용자인데 지도가 이미 있음"));
    step({ title: "지도 없음 확인", status: empty.status, ms: empty.ms, issues: emptyIssues });

    // 2. 학습자 요약(튜터가 읽는 것)
    const brief = await call(userId, "/api/learner/brief", { method: "GET", query: { lang } });
    step({ title: "학습자 요약", status: brief.status, ms: brief.ms, outputs: [{ label: "요약 줄", text: (brief.body?.notes ?? []).map((n) => n.kind).join(", ") }], issues: checkHttp(P, brief) });
  },
};
