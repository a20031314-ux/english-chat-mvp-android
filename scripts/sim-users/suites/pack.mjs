/**
 * 통화 턴·오늘의 팩 묶음 — 말 대신 받아쓴 글(heard)로 통화 튜터를 돌린다(마이크·소리 없이).
 *   en·ja 학습: 오늘의 팩 열기 → 팩으로 3턴 → 마치기(돌아보기)
 *   그 밖의 언어: Just talk(open-talk-<언어>) 3턴
 * 포인트 헤더를 보내지 않아 무료 통화 시간·포인트가 줄지 않는다. 튜터가 지어낸 문장이 문장 은행 후보 저장소에
 * 쌓이므로(noteSentenceWritten) 4명 중 1명만.
 */
import { checkAboutTheirLine, checkHttp, checkText, issue } from "../detect.mjs";

function kstDay() {
  return new Date(Date.now() + 9 * 3600_000).toISOString().slice(0, 10);
}

function sayText(direction) {
  const say = direction?.say;
  return typeof say === "string" ? say : say?.text ?? "";
}

export default {
  id: "pack",
  label: "통화 턴·오늘의 팩",
  every: 4,
  note: "튜터 문장이 공유 저장소에 쌓임",
  estimate({ persona }) {
    return { requests: persona.target === "en" || persona.target === "ja" ? 5 : 3, usd: 0.004 };
  },
  async run({ persona, userId, call, bank, step }) {
    const P = "call";
    const lang = persona.target;
    const day = kstDay();
    let practice = null;

    if (lang === "en" || lang === "ja") {
      const today = await call(userId, "/api/pack/today", { method: "GET", query: { lang, day } });
      const tIssues = checkHttp(P, today);
      if (today.status === 200) {
        if (!today.body?.available) tIssues.push(issue("error", "call_logic", `${lang}인데 오늘의 팩이 없음`));
        if (!(today.body?.questions > 0)) tIssues.push(issue("error", "call_logic", "팩 질문 수가 0"));
        if (!today.body?.practice?.pack) tIssues.push(issue("error", "call_shape", "팩에 practice.pack 없음"));
        for (const ph of (today.body?.phrases ?? []).slice(0, 3)) tIssues.push(...checkText(P, persona, ph, { lang: "target", label: "팩 표현" }));
        practice = today.body?.practice ?? null;
      }
      step({ title: "오늘의 팩 열기", status: today.status, ms: today.ms, outputs: [{ label: "팩", text: `질문 ${today.body?.questions ?? "-"} · 표현 ${(today.body?.phrases ?? []).join(", ")}` }], issues: tIssues });
    }

    const lines = (bank.learner[lang] ?? []).filter((l) => l.level >= 2).slice(0, 3).map((l) => l.text.replace(/[.。]$/u, ""));
    const history = [{ who: "tutor", text: "" }];
    const says = [];
    for (let i = 0; i < lines.length; i += 1) {
      const res = await call(userId, "/api/roleplay/turn", {
        body: {
          scenarioId: `open-talk-${lang}`,
          nodeId: "talk",
          heard: lines[i],
          history: history.filter((h) => h.text),
          mode: "free",
          freeTurns: i,
          directedTurns: i,
          level: persona.level,
          nativeLanguage: persona.ui,
          ...(practice ? { practice } : {}),
        },
        timeout: 30_000,
      });
      const issues = checkHttp(P, res);
      const d = res.body ?? {};
      const say = sayText(d);
      if (res.status === 200) {
        issues.push(...checkText(P, persona, say, { lang: "target", label: "통화 튜터 말", required: !d.next?.end }));
        if (d.note && persona.target !== persona.ui) issues.push(...checkText(P, persona, d.note, { lang: "ui", label: "통화 팁" }));
        // 내 말 아래 팁은 내 말에 대한 것이어야(튜터 자기 말·다음 질문 설명이면 warn). 막혔을 때 도움말은 상대 선택지를 보여 줘도 됨.
        if (d.note && d.assessment !== "stuck") issues.push(...checkAboutTheirLine(P, { tip: d.note, heard: lines[i], otherSaid: [say, history.at(-1)?.text ?? ""], label: "통화 팁" }));
        if (d.better) issues.push(...checkText(P, persona, typeof d.better === "string" ? d.better : d.better?.text, { lang: "target", label: "더 나은 말" }));
        if (says.includes(say) && say) issues.push(issue("error", "call_repeat", "앞 턴과 같은 튜터 말", { sample: say.slice(0, 80) }));
        if (d.next?.end && i < lines.length - 1) issues.push(issue("warn", "call_logic", "몇 턴 만에 통화가 끝남", { sample: say.slice(0, 80) }));
      }
      step({ title: `통화 턴 ${i + 1}${practice ? " (팩)" : ""}`, input: lines[i], status: res.status, ms: res.ms, outputs: [{ label: "튜터", text: say }, { label: "팁", text: d.note }, { label: "더 나은 말", text: typeof d.better === "string" ? d.better : d.better?.text }], issues });
      history.push({ who: "learner", text: lines[i] }, { who: "tutor", text: say });
      says.push(say);
      if (res.status !== 200 || d.next?.end) break;
    }

    if (practice?.pack) {
      const fin = await call(userId, "/api/pack/finish", { body: { lang, day: practice.pack } });
      const fIssues = checkHttp(P, fin);
      const retro = fin.body?.retro;
      if (fin.status === 200) {
        if (!retro) fIssues.push(issue("error", "call_shape", "팩 마치기에 돌아보기 없음"));
        else if (!(retro.answered >= 1)) fIssues.push(issue("warn", "call_logic", `답한 수가 ${retro.answered} (3턴 했음)`));
      }
      step({ title: "오늘의 팩 마치기", status: fin.status, ms: fin.ms, outputs: [{ label: "돌아보기", text: retro ? `답 ${retro.answered}/${retro.planned} · ${retro.minutes}분 · 바뀐 것 ${(retro.changed ?? []).length}` : "" }], issues: fIssues });
    }
  },
};
