/**
 * 노트(My)·업데이트 안내 묶음.
 *
 *   노트 자리 찾기(/api/notes/place): 학습 언어 표현·단어를 장 8 × 주제 3 목차의 주제 id로 — 없는 id가 나오면 오류,
 *   다시 물으면 공유 저장분에서 바로(모델 호출 없음, pending 0)
 *   새로워진 점(/api/whats-new): 앱 언어로 제목·설명이 오는지, 그림 주소가 있는지
 *   노트 틀(/api/notebook, 2026-10-24): 표현을 단어장에 저장(배움) → 노트를 열면 답 뒤에 모델이 칸을 고름 → 다시 열어
 *   칸이 뼈대에 있는 id인지, 단계 사다리·관용·세부 고정 칸이 있는지, 단계 이름이 앱 언어인지
 *
 * 자리 찾기는 학습 언어별로 모두가 같이 쓰는 저장소에 남는다(지우지 않음) — 진짜 학습자가 만날 법한 표현만 보낸다.
 * 학습자 문장은 보내지 않는다(문장은 서버에 저장하지 않는 규칙). 14명 중 1명.
 */
import { NOTE_TOPIC_IDS } from "../../../src/lib/notes/outline.ts";
import { readFileSync } from "node:fs";
import { checkHttp, checkText, issue } from "../detect.mjs";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const FROM = "2.66";
// 저장소의 다음 앱 버전까지(업데이트 배너가 그 버전으로 물을 때와 같게).
const TO = JSON.parse(readFileSync("package.json", "utf8")).version.split(".").slice(0, 2).join(".");

export default {
  id: "notes",
  label: "노트·업데이트 안내",
  every: 14,
  note: "노트 자리는 공유 저장소에 남음",
  estimate() {
    return { requests: 7, usd: 0.003 };
  },
  async run({ persona, userId, call, bank, step }) {
    const P = "notes";
    // 표현 조각: 맞는 문장의 앞부분(쉼표·문장부호 앞) + 단어장 낱말. 문장 전체는 보내지 않는다.
    const pieces = (bank.learner[persona.target] ?? [])
      .filter((l) => l.ok)
      .map((l) => l.text.split(/[,，、،.!?。！？؟]/u)[0].trim())
      .filter((t) => t && t.length <= 40)
      .slice(0, 3);
    const texts = [...new Set([bank.vocabWord[persona.target], ...pieces].filter(Boolean))];

    const first = await call(userId, "/api/notes/place", { body: { language: persona.target, texts }, timeout: 40_000 });
    const pIssues = checkHttp(P, first);
    const places = first.body?.places ?? {};
    if (first.status === 200) {
      const bad = Object.entries(places).filter(([, topic]) => topic !== "none" && !NOTE_TOPIC_IDS.includes(topic));
      if (bad.length) pIssues.push(issue("error", "notes_logic", `목차에 없는 주제: ${bad.map(([k, t]) => `${k}→${t}`).join(", ")}`));
      if (Object.keys(places).length < texts.length && !first.body?.limited) pIssues.push(issue("warn", "notes_logic", `자리를 못 찾은 것 ${texts.length - Object.keys(places).length}개`));
      const none = Object.values(places).filter((t) => t === "none").length;
      if (none === texts.length) pIssues.push(issue("warn", "notes_logic", "모두 '자리 없음'"));
    }
    step({ title: "노트 자리 찾기", input: texts.join(" | "), status: first.status, ms: first.ms, outputs: [{ label: "자리", text: Object.entries(places).map(([k, t]) => `${k} → ${t}`).join(" · ") }], issues: pIssues });

    const second = await call(userId, "/api/notes/place", { body: { language: persona.target, texts } });
    const cIssues = checkHttp(P, second);
    if (second.status === 200 && (second.body?.pending ?? 0) > 0) cIssues.push(issue("warn", "notes_logic", `다시 물었는데 저장분에 없는 것 ${second.body.pending}개`));
    for (const [key, topic] of Object.entries(places)) {
      if (second.body?.places?.[key] && second.body.places[key] !== topic) cIssues.push(issue("error", "notes_logic", `같은 표현의 자리가 바뀜: ${key}`));
    }
    step({ title: "노트 자리 다시 (저장분)", status: second.status, ms: second.ms, outputs: [{ label: "대기", text: String(second.body?.pending ?? 0) }], issues: cIssues });

    // ── 노트 틀: 습득한 표현이 칸에 들어가는지 ──
    const B = "notebook";
    const saved = await call(userId, "/api/learner/ledger", { body: { language: persona.target, meets: texts.map((text) => ({ kind: "save", text, tab: "chat" })) } });
    const open1 = await call(userId, "/api/notebook", { method: "GET", query: { lang: persona.target, ui: persona.ui }, timeout: 40_000 });
    const fIssues = [...checkHttp(B, saved), ...checkHttp(B, open1)];
    const book1 = open1.body ?? {};
    const ids = new Set((book1.nodes ?? []).map((n) => n.id));
    if (open1.status === 200) {
      if (!(book1.stages ?? []).length) fIssues.push(issue("warn", "notebook_shape", "단계 사다리가 비어 있음"));
      for (const fixed of ["i-idiom", "i-together", "i-set", "d-word", "d-register", "d-spelling", "d-nuance"]) {
        if (!ids.has(fixed)) fIssues.push(issue("error", "notebook_shape", `고정 칸 없음: ${fixed}`));
      }
      if (book1.stages?.[0]?.title) fIssues.push(...checkText(B, persona, book1.stages[0].title, { lang: "ui", label: "단계 이름" }));
    }
    step({ title: "노트 틀 열기", input: `${texts.length}개 저장 · ${persona.target}:${persona.ui}`, status: open1.status, ms: open1.ms, outputs: [{ label: "칸", text: `${ids.size}개 · 단계 ${book1.stages?.length ?? 0} · 지금 ${book1.stage}` }], issues: fIssues });

    // 칸 고르기는 답이 나간 뒤 돈다 — 조금 기다렸다 다시 연다.
    let book2 = {};
    let open2 = null;
    for (let i = 0; i < 4; i++) {
      await sleep(8000);
      open2 = await call(userId, "/api/notebook", { method: "GET", query: { lang: persona.target, ui: persona.ui }, timeout: 40_000 });
      book2 = open2.body ?? {};
      if ((book2.phrases ?? []).length) break;
    }
    const pIssues2 = checkHttp(B, open2);
    const phrases = book2.phrases ?? [];
    if (open2?.status === 200) {
      const unknown = phrases.filter((p) => !ids.has(p.node) && !(book2.custom ?? []).some((c) => c.id === p.node));
      if (unknown.length) pIssues2.push(issue("error", "notebook_logic", `뼈대에 없는 칸: ${unknown.map((p) => `${p.text}→${p.node}`).join(", ")}`));
      if (!phrases.length && texts.length > 1) pIssues2.push(issue("warn", "notebook_logic", "저장한 표현이 틀의 칸에 하나도 안 들어감(모두 어휘거나 아직)"));
    }
    const nameOf = (id) => (book2.nodes ?? []).find((n) => n.id === id)?.name ?? id;
    step({ title: "노트 틀: 표현이 든 칸", status: open2?.status ?? 0, ms: open2?.ms ?? 0, outputs: [{ label: `${phrases.length}/${texts.length}`, text: phrases.map((p) => `${p.text} → ${p.node} (${nameOf(p.node)})`).join(" · ") }], issues: pIssues2 });

    const news = await call(userId, "/api/whats-new", { method: "GET", query: { from: FROM, to: TO, ui: persona.ui } });
    const nIssues = checkHttp(P, news);
    const items = (news.body?.releases ?? []).flatMap((r) => r.items ?? []);
    if (news.status === 200) {
      if (news.body?.language !== persona.ui) nIssues.push(issue("error", "notes_logic", `안내 언어가 ${news.body?.language}(앱 ${persona.ui})`));
      if (!items.length) nIssues.push(issue("warn", "notes_logic", `${FROM} → ${TO} 새로워진 점이 하나도 없음`));
      for (const item of items.slice(0, 4)) {
        nIssues.push(...checkText(P, persona, item.title, { lang: "ui", label: "새로워진 점 제목", required: true }));
        nIssues.push(...checkText(P, persona, item.body, { lang: "ui", label: "새로워진 점 설명" }));
        if (!item.image) nIssues.push(issue("warn", "notes_shape", `그림 주소 없음: ${item.id}`));
      }
    }
    step({ title: "새로워진 점 (업데이트 안내)", input: `${FROM} → ${TO} · ${persona.ui}`, status: news.status, ms: news.ms, outputs: [{ label: `${items.length}개`, text: items.map((i) => i.title).join(" · ") }], issues: nIssues });
  },
};
