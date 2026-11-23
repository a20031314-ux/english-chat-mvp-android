/**
 * 번역·표현 묶음 — 튜터 말 아래 "해석", 점 끌어 고를 단위와 고른 표현의 빠른 질문, 단어장 검색.
 * 학습 언어로 나와야 할 것(문장·표현·예문)과 앱 언어로 나와야 할 것(번역·뜻·설명)이 섞이지 않는지가 핵심.
 * 모델 호출 4번 안팎. 2명 중 1명.
 */
import { checkHttp, checkText, issue } from "../detect.mjs";

const langs = (p) => ({ targetLanguage: p.target, interfaceLanguage: p.ui, locale: p.ui });

export default {
  id: "sheet",
  label: "번역·문장분석·단어장",
  every: 2,
  estimate() {
    return { requests: 4, usd: 0.003 };
  },
  async run({ persona, userId, call, bank, step, shared }) {
    const P = "sheet";
    const okLine = (bank.learner[persona.target] ?? []).filter((l) => l.ok).slice(-1)[0]?.text ?? "";
    const tutorLine = shared.chatLines?.slice(-1)[0]?.reply || okLine;

    // 해석 (튜터 말)
    if (persona.target !== persona.ui) {
      const tr = await call(userId, "/api/translate", { body: { text: tutorLine, ...langs(persona), sourceType: "conversation", context: [] } });
      const trIssues = checkHttp(P, tr);
      if (tr.status === 200) {
        trIssues.push(...checkText(P, persona, tr.body?.translated, { lang: "ui", label: "해석", required: true }));
        if ((tr.body?.translated ?? "").trim() === tutorLine.trim()) trIssues.push(issue("error", "sheet_logic", "해석이 원문 그대로 돌아옴"));
      }
      step({ title: "해석", input: tutorLine, status: tr.status, ms: tr.ms, outputs: [{ label: "해석", text: tr.body?.translated }], issues: trIssues });
    }

    // 점 끌어 고를 단위
    const units = await call(userId, "/api/expression-units", { body: { sentence: okLine, targetLanguage: persona.target } });
    const uIssues = checkHttp(P, units);
    const list = units.body?.units ?? [];
    if (units.status === 200) {
      const outside = list.filter((u) => !okLine.includes(u));
      if (outside.length) uIssues.push(issue("error", "sheet_logic", `문장에 없는 단위: ${outside.slice(0, 3).join(", ")}`));
      if (list.length === 0) uIssues.push(issue("warn", "sheet_logic", "고를 단위가 없음(모델 실패면 영어 외 언어는 빈 목록)"));
    }
    step({ title: "고를 단위", input: okLine, status: units.status, ms: units.ms, outputs: [{ label: `${list.length}개`, text: list.slice(0, 8).join(" | ") }], issues: uIssues });

    // 고른 표현의 빠른 질문(뜻)
    const picked = list.find((u) => u.length > 1);
    if (picked) {
      const ask = await call(userId, "/api/expression-ask", { body: { sentence: okLine, selected: picked, preset: "meaning", ...langs(persona) } });
      const askIssues = checkHttp(P, ask, { infoErrors: ["ASK_LIMIT_REACHED"] });
      if (ask.status === 200 && persona.target !== persona.ui) askIssues.push(...checkText(P, persona, ask.body?.answer, { lang: "ui", label: "빠른 질문 답", required: true }));
      step({ title: "빠른 질문(뜻)", input: picked, status: ask.status, ms: ask.ms, outputs: [{ label: "답", text: ask.body?.answer }], issues: askIssues });
    }

    // 단어장 검색 (앱 언어로 찾기)
    const query = bank.vocabWord[persona.ui];
    const vocab = await call(userId, "/api/vocab", { body: { query, ...langs(persona) } });
    const vIssues = checkHttp(P, vocab);
    const results = vocab.body?.results ?? [];
    if (vocab.status === 200) {
      if (results.length === 0) vIssues.push(issue("error", "sheet_logic", "단어장 검색 결과 없음"));
      for (const r of results.slice(0, 2)) {
        vIssues.push(...checkText(P, persona, r.word, { lang: "target", label: "단어", required: true }));
        if (persona.target !== persona.ui) vIssues.push(...checkText(P, persona, r.gloss, { lang: "ui", label: "단어 뜻" }));
      }
    }
    step({ title: "단어장 검색", input: query, status: vocab.status, ms: vocab.ms, outputs: [{ label: "결과", text: results.slice(0, 4).map((r) => `${r.word}=${r.gloss}`).join(" · ") }], issues: vIssues });
  },
};
