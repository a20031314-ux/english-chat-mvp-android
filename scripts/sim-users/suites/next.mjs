/**
 * 오늘 해볼 것·학습자 요약·자라는 중·내 표현 묶음 — 채팅이 남긴 기록이 화면 데이터로 이어지는지.
 * 모델 호출이 없어 싸다(GET 5번). 모든 사람에게.
 * 기록은 서버가 답을 보낸 뒤(after) 쓰니, 자라는 중은 몇 초 기다렸다 다시 본다.
 */
import { checkHttp, checkText, issue } from "../detect.mjs";

const ELEMENTS = ["speaking", "accuracy", "words", "listening", "pronunciation", "natural"];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export default {
  id: "next",
  label: "오늘 해볼 것·요약·자라는 중",
  every: 1,
  estimate() {
    return { requests: 6, usd: 0 };
  },
  async run({ persona, userId, call, step, shared }) {
    const lang = persona.target;
    const P = "next";

    // 오늘 해볼 것
    const next = await call(userId, "/api/learner/next", { method: "GET", query: { lang } });
    const nIssues = checkHttp(P, next);
    const steps = next.body?.steps ?? [];
    if (next.status === 200) {
      if (steps.length === 0) nIssues.push(issue("error", "next_logic", "오늘 해볼 것이 하나도 없음"));
      if (steps.length > 6) nIssues.push(issue("warn", "next_logic", `오늘 해볼 것이 ${steps.length}개(6개까지)`));
      if (steps.length && steps[steps.length - 1].kind !== "free") nIssues.push(issue("warn", "next_logic", "마지막이 자유 대화가 아님"));
      for (const s of steps) {
        if (s.phrase) nIssues.push(...checkText(P, persona, s.phrase, { lang: "target", label: "써볼 표현" }));
        if (s.topicTitle) nIssues.push(...checkText(P, persona, s.topicTitle, { lang: "ui", label: "주제 이름" }));
        if (s.mistakeLabel && next.body?.labelLanguage) nIssues.push(...checkText(P, persona, s.mistakeLabel, { lang: "ui", label: "자주 틀리는 것" }));
      }
    }
    step({ title: "오늘 해볼 것", status: next.status, ms: next.ms, outputs: [{ label: "단계", text: steps.map((s) => `${s.kind}${s.phrase ? `(${s.phrase})` : s.topicTitle ? `(${s.topicTitle})` : ""}`).join(" · ") }], issues: nIssues });

    // 학습자 요약
    const brief = await call(userId, "/api/learner/brief", { method: "GET", query: { lang } });
    const bIssues = checkHttp(P, brief);
    if (brief.status === 200 && typeof brief.body?.prompt !== "string") bIssues.push(issue("error", "next_shape", "요약에 prompt 없음"));
    step({ title: "학습자 요약", status: brief.status, ms: brief.ms, outputs: [{ label: "줄", text: (brief.body?.notes ?? []).map((n) => n.kind).join(", ") || "(없음)" }], issues: bIssues });

    // 자라는 중 — 고칠 데 없이 맞게 쓴 줄이 있었으면 정확도가 0보다 커야(틀린 줄만으로는 안 큼)
    // 서버(chat/route.ts)와 같은 기준: 대소문자·띄어쓰기만 무시, 문장부호를 고치면 고친 것
    const norm = (t) => String(t ?? "").replace(/\s+/g, " ").trim().toLowerCase();
    const practised = (shared.chatLines ?? []).filter((l) => l.corrected && norm(l.corrected) === norm(l.text)).length;
    let growth = null;
    let gIssues = [];
    for (let attempt = 0; attempt < 3; attempt += 1) {
      growth = await call(userId, "/api/learner/growth", { method: "GET", query: { lang, tz: "540" } });
      gIssues = checkHttp(P, growth);
      const total = (growth.body?.elements ?? []).reduce((s, e) => s + (e.points ?? 0), 0);
      if (growth.status !== 200 || practised < 1 || total > 0) break;
      await wait(4000);
    }
    const elements = growth?.body?.elements ?? [];
    if (growth?.status === 200) {
      const ids = elements.map((e) => e.id);
      const missing = ELEMENTS.filter((id) => !ids.includes(id));
      if (missing.length) gIssues.push(issue("error", "next_shape", `자라는 중 요소 빠짐: ${missing.join(", ")}`));
      if (elements.some((e) => !Array.isArray(e.daily) || e.daily.length !== 14)) gIssues.push(issue("warn", "next_shape", "요소 그래프가 14일이 아님"));
      const total = elements.reduce((s, e) => s + (e.points ?? 0), 0);
      if (practised >= 1 && total === 0) gIssues.push(issue("warn", "next_logic", `고칠 데 없는 줄을 ${practised}번 보냈는데 자라는 중이 모두 0`));
      for (const e of elements) for (const leaf of (e.leaves ?? []).slice(0, 2)) gIssues.push(...checkText(P, persona, leaf, { lang: "target", label: `${e.id} 잎` }));
    }
    step({ title: "자라는 중", status: growth?.status, ms: growth?.ms, outputs: [{ label: "점수", text: elements.map((e) => `${e.id} ${e.points}`).join(" · ") }, { label: "다음에 키울 곳", text: growth?.body?.next ?? "" }], issues: gIssues });

    // 내 표현 장부
    const ledger = await call(userId, "/api/learner/ledger", { method: "GET", query: { lang, compact: "1" } });
    const lIssues = checkHttp(P, ledger);
    const items = ledger.body?.items ?? [];
    for (const it of items.slice(0, 3)) lIssues.push(...checkText(P, persona, it.text, { lang: "target", label: "내 표현" }));
    step({ title: "내 표현", status: ledger.status, ms: ledger.ms, outputs: [{ label: `${items.length}개`, text: items.slice(0, 5).map((i) => `${i.text}(${i.state})`).join(" · ") }], issues: lIssues });
  },
};
