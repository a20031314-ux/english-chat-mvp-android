/**
 * 지도·미션 묶음 — 새 사용자가 지도를 처음 그리는 길 그대로.
 *   지도 없음 확인 → 체크 3질문 + 목표로 지도 그리기 → 체크가 저장됐나·요약에 반영됐나
 *   → 첫 주제 미션(두 번 불러도 같은가) → 본 표시 → 정답으로 확인(통과여야) → 틀린 문장으로 확인
 *   → 지도에 진행이 붙었나 → 복습(새 사용자는 비어 있어야) → 표현 골라 지도에 넣기
 *
 * 비싼 묶음이다(지도 gpt-4.1 한 번 + 미션 한 번 + 확인 두 번). 기본은 7명 중 1명 — 196명이면 28명, 조합 28개.
 * 미션 확인은 무료 하루 채팅 10번에 들어가니 채팅 턴과 합쳐 10을 넘지 않게 한다(채팅 6턴 + 확인 2).
 */
import { checkHttp, checkShape, checkText, issue } from "../detect.mjs";

const SLOW = { slowWarnMs: 45_000, slowErrorMs: 85_000 };
const GAPS = { tense: ["accuracy"], agreement: ["accuracy"], particle: ["accuracy"], word_order: ["accuracy", "natural"], spelling: ["words"], vocab: ["words"], register: ["natural"] };

function selfCheckFor(persona) {
  const gaps = [...new Set([...(GAPS[persona.weakness] ?? ["accuracy"]), ...(persona.level <= 2 ? ["speaking"] : []), ...(persona.temperament === "terse" ? ["speaking"] : [])])];
  const focus = persona.temperament === "chatty" ? ["speaking"] : persona.level <= 2 ? ["words", "speaking"] : ["speaking", "listening"];
  return { gaps, focus, use: ["travel", "daily", "work", "video"][persona.level % 4] };
}

function sameSet(a = [], b = []) {
  return a.length === b.length && a.every((x) => b.includes(x));
}

export default {
  id: "map",
  label: "지도·미션",
  every: 7,
  note: "지도 생성 gpt-4.1 — 비쌈",
  estimate() {
    return { requests: 13, usd: 0.08 };
  },
  async run({ persona, userId, call, bank, step }) {
    const lang = persona.target;
    const P = "map";

    // 1. 지도 없음
    const empty = await call(userId, "/api/curriculum", { method: "GET", query: { lang } });
    const emptyIssues = checkHttp(P, empty);
    if (empty.status === 200 && empty.body?.map) emptyIssues.push(issue("error", "map_logic", "새 사용자인데 지도가 이미 있음"));
    step({ title: "지도 없음 확인", status: empty.status, ms: empty.ms, issues: emptyIssues });

    // 2. 지도 그리기
    const selfCheck = selfCheckFor(persona);
    const goal = bank.mapGoal[persona.ui];
    const gen = await call(userId, "/api/curriculum/generate", {
      body: { goal, targetLanguage: lang, interfaceLanguage: persona.ui, selfCheck },
      timeout: 95_000,
    });
    const genIssues = checkHttp(P, gen, SLOW);
    const map = gen.body?.map;
    const genOutputs = [];
    if (gen.status === 200) {
      genIssues.push(...checkShape(P, gen.body, ["map.id", "map.topics", "map.sectors"], "지도"));
      if (map) {
        if (map.language !== lang) genIssues.push(issue("error", "map_logic", `지도 언어가 ${map.language} (학습 ${lang})`));
        if (map.uiLanguage !== persona.ui) genIssues.push(issue("error", "map_logic", `지도 앱 언어가 ${map.uiLanguage} (앱 ${persona.ui})`));
        const topics = map.topics ?? [];
        if (topics.length < 6) genIssues.push(issue("error", "map_logic", `주제가 ${topics.length}개뿐`));
        genIssues.push(...checkText(P, persona, map.title, { lang: "ui", label: "지도 제목", required: true }));
        for (const sector of map.sectors ?? []) genIssues.push(...checkText(P, persona, sector.title, { lang: "ui", label: `구역 ${sector.id} 제목` }));
        for (const topic of topics.slice(0, 4)) {
          genIssues.push(...checkText(P, persona, topic.title, { lang: "ui", label: `주제 ${topic.id} 제목`, required: true }));
          const act = topic.activities?.[0];
          if (act) {
            genIssues.push(...checkText(P, persona, act.task, { lang: "ui", label: `주제 ${topic.id} 할 일` }));
            if (act.starter) genIssues.push(...checkText(P, persona, act.starter, { lang: "target", label: `주제 ${topic.id} 시작 문장` }));
          }
        }
        genOutputs.push({ label: "제목", text: map.title }, { label: "주제", text: topics.map((t) => `${t.id} ${t.title}`).join(" · ") });
      }
    }
    step({ title: "지도 그리기", input: `${goal} · 체크 ${selfCheck.gaps.join("/")}`, status: gen.status, ms: gen.ms, outputs: genOutputs, issues: dedupe(genIssues) });
    if (!map?.id) return;

    // 3. 체크 저장·요약 반영
    const sc = await call(userId, "/api/learner/self-check", { method: "GET", query: { lang } });
    const scIssues = checkHttp(P, sc);
    if (sc.status === 200 && !sameSet(sc.body?.selfCheck?.gaps, selfCheck.gaps)) {
      scIssues.push(issue("error", "map_logic", `저장된 체크가 다름: ${JSON.stringify(sc.body?.selfCheck?.gaps)} ≠ ${JSON.stringify(selfCheck.gaps)}`));
    }
    const brief = await call(userId, "/api/learner/brief", { method: "GET", query: { lang } });
    scIssues.push(...checkHttp(P, brief));
    if (brief.status === 200 && !(brief.body?.notes ?? []).some((n) => n.kind === "self")) {
      scIssues.push(issue("warn", "map_logic", "체크를 보냈는데 학습자 요약에 체크 줄(self)이 없음"));
    }
    step({ title: "체크 저장·요약", status: sc.status, ms: sc.ms, outputs: [{ label: "요약 줄", text: (brief.body?.notes ?? []).map((n) => n.kind).join(", ") }], issues: scIssues });

    // 4. 첫 주제 미션 (두 번)
    const topic = [...map.topics].sort((a, b) => (a.order ?? 99) - (b.order ?? 99))[0];
    const missionsRes = await call(userId, "/api/curriculum/missions", { body: { language: lang, mapId: map.id, topicId: topic.id }, timeout: 60_000 });
    const mIssues = checkHttp(P, missionsRes, { slowWarnMs: 25_000, slowErrorMs: 55_000 });
    const missions = missionsRes.body?.missions ?? [];
    if (missionsRes.status === 200) {
      if (missions.length < 3) mIssues.push(issue("error", "map_logic", `미션이 ${missions.length}개`));
      for (const m of missions.slice(0, 3)) {
        mIssues.push(...checkText(P, persona, m.task, { lang: "ui", label: `미션 ${m.id} 할 일`, required: true }));
        mIssues.push(...checkText(P, persona, m.answer, { lang: "target", label: `미션 ${m.id} 예시 답`, required: true }));
        if (m.hints?.[0]) mIssues.push(...checkText(P, persona, m.hints[0], { lang: "ui", label: `미션 ${m.id} 힌트1` }));
        if (m.hints?.[1]) mIssues.push(...checkText(P, persona, m.hints[1], { lang: "target", label: `미션 ${m.id} 힌트2` }));
      }
      const again = await call(userId, "/api/curriculum/missions", { body: { language: lang, mapId: map.id, topicId: topic.id }, timeout: 60_000 });
      mIssues.push(...checkHttp(P, again));
      const ids = (x) => (x ?? []).map((m) => `${m.id}:${m.task}`).join("|");
      if (again.status === 200 && ids(again.body?.missions) !== ids(missions)) mIssues.push(issue("error", "map_logic", "같은 주제 미션을 다시 부르니 내용이 바뀜"));
    }
    step({
      title: `미션 불러오기 (${topic.id})`,
      status: missionsRes.status,
      ms: missionsRes.ms,
      outputs: missions.slice(0, 3).map((m) => ({ label: m.id, text: `${m.task} → ${m.answer}` })),
      issues: dedupe(mIssues),
    });
    if (missions.length === 0) return;

    // 5. 본 표시 + 정답으로 확인
    const first = missions[0];
    await call(userId, "/api/curriculum/mission-seen", { body: { language: lang, mapId: map.id, topicId: topic.id, missionId: first.id } });
    const pass = await call(userId, "/api/curriculum/mission-check", {
      body: { language: lang, mapId: map.id, topicId: topic.id, missionId: first.id, answer: first.answer, hints: 0, tries: 1 },
      timeout: 40_000,
    });
    const passIssues = checkHttp(P, pass);
    const check = pass.body?.check;
    if (pass.status === 200) {
      if (check?.verdict !== "pass") passIssues.push(issue("warn", "map_logic", `예시 답 그대로 썼는데 판정이 ${check?.verdict}`, { sample: check?.feedback?.slice(0, 80) }));
      if (check?.feedback) passIssues.push(...checkText(P, persona, check.feedback, { lang: "ui", label: "미션 피드백" }));
      if (check?.reply) passIssues.push(...checkText(P, persona, check.reply, { lang: "target", label: "미션 답장" }));
      if (check?.verdict === "pass" && !pass.body?.results?.[first.id]?.mastered) passIssues.push(issue("warn", "map_logic", "힌트 없이 첫 시도 통과인데 숙지로 안 올라감"));
    }
    step({ title: "미션 확인 (예시 답)", input: first.answer, status: pass.status, ms: pass.ms, outputs: [{ label: check?.verdict ?? "-", text: [check?.feedback, check?.reply].filter(Boolean).join(" / ") }], issues: passIssues });

    // 6. 틀린 문장으로 확인
    const second = missions[1];
    const wrong = (bank.learner[lang] ?? []).find((l) => !l.ok && l.level >= 2)?.text;
    if (second && wrong) {
      const miss = await call(userId, "/api/curriculum/mission-check", {
        body: { language: lang, mapId: map.id, topicId: topic.id, missionId: second.id, answer: wrong, hints: 1, tries: 1 },
        timeout: 40_000,
      });
      const missIssues = checkHttp(P, miss);
      const c = miss.body?.check;
      if (miss.status === 200) {
        if (c?.verdict === "pass") missIssues.push(issue("warn", "map_logic", "미션과 상관없는 틀린 문장인데 통과", { sample: wrong }));
        if (c?.feedback) missIssues.push(...checkText(P, persona, c.feedback, { lang: "ui", label: "미션 피드백" }));
        if (c?.better) missIssues.push(...checkText(P, persona, c.better, { lang: "target", label: "더 나은 문장" }));
      }
      step({ title: "미션 확인 (엉뚱한 답)", input: wrong, status: miss.status, ms: miss.ms, outputs: [{ label: c?.verdict ?? "-", text: [c?.feedback, c?.better].filter(Boolean).join(" / ") }], issues: missIssues });
    }

    // 7. 진행이 지도에 붙었나 + 복습
    const after = await call(userId, "/api/curriculum", { method: "GET", query: { lang } });
    const afterIssues = checkHttp(P, after);
    if (after.status === 200) {
      const prog = after.body?.missions?.[topic.id];
      if (!prog || (prog.done ?? 0) < 1) afterIssues.push(issue("error", "map_logic", `미션을 했는데 지도 진행이 비어 있음: ${JSON.stringify(prog ?? null).slice(0, 80)}`));
      if (after.body?.status?.[topic.id] !== "doing" && after.body?.status?.[topic.id] !== "done") afterIssues.push(issue("warn", "map_logic", `주제 상태가 ${after.body?.status?.[topic.id] ?? "없음"}`));
    }
    const review = await call(userId, "/api/curriculum/review", { method: "GET", query: { lang } });
    afterIssues.push(...checkHttp(P, review));
    if (review.status === 200 && (review.body?.items ?? []).length > 0) afterIssues.push(issue("warn", "map_logic", "방금 만든 사용자인데 복습할 게 있음(8시간 규칙)"));
    step({ title: "지도 진행·복습", status: after.status, ms: after.ms, outputs: [{ label: "진행", text: JSON.stringify(after.body?.missions?.[topic.id] ?? {}) }], issues: afterIssues });

    // 8. 표현 골라 지도에 넣기
    const okLine = (bank.learner[lang] ?? []).find((l) => l.ok)?.text ?? first.answer;
    const pickText = first.expression || okLine.split(/[,.!?。！？،]/u)[0].slice(0, 60);
    const pick = await call(userId, "/api/curriculum/pick", { body: { language: lang, text: pickText, sentence: okLine, tab: "chat" }, timeout: 40_000 });
    const pickIssues = checkHttp(P, pick, { infoErrors: ["LIMIT_REACHED"] });
    if (pick.status === 200) {
      if (!map.topics.some((t) => t.id === pick.body?.topicId)) pickIssues.push(issue("error", "map_logic", `지도에 없는 주제로 넣음: ${pick.body?.topicId}`));
      pickIssues.push(...checkText(P, persona, pick.body?.topicTitle, { lang: "ui", label: "넣은 주제 이름", required: true }));
    }
    step({ title: "지도에 넣기", input: pickText, status: pick.status, ms: pick.ms, outputs: [{ label: "주제", text: `${pick.body?.topicId ?? "-"} ${pick.body?.topicTitle ?? ""}` }], issues: pickIssues });
  },
};

/** 같은 종류·같은 메모가 여러 번 나오면 한 번만. */
function dedupe(issues) {
  const seen = new Set();
  return issues.filter((i) => {
    const key = `${i.kind}|${i.note}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
