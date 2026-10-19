/**
 * 1차 세분화 — 문장 종류 8칸. 한 사람이 한 칸을 맡아(사람 번호 + 씨앗으로 돌아가며) 그 칸의 문장만 보낸다.
 * 칸마다 "보통 결과"(짚는 비율·잘못 고침·답 언어·속도·질문으로 잇기 등)를 tiers-report.mjs가 모아 기준으로 남긴다.
 *
 *   ok       맞는 문장 — 고치면 '잘못 고침'
 *   light    실수 하나(조사·시제·일치·어순·철자·말투·단어) — 짚었나
 *   heavy    실수 여럿·단어 나열 — 짚었나, 고친 문장이 학습 언어인가
 *   mixed    학습 언어 문장 속에 편한 말 낱말 하나 — 그 낱말을 학습 언어로 바꿨나
 *   own      편한 말로만 — 답은 학습 언어, "표현 보기" 카드가 학습 언어
 *   passive  "응", "몰라" 같은 짧은 답만 — 튜터가 질문으로 잇나, 같은 말 되풀이 안 하나, 너무 길지 않나
 *   odd      엉뚱한 입력(지시 탈취·아무 글자·이모지·숙제 대신·한 글자) — 넘어가지 않나
 *   overlap  단체방에서 셋이 동시에 보내기·끼어들어 집어 묻기 — 순서·중복·인용 (모델 호출 없음, 임시 계정 3개)
 *
 * 문장은 tiers.json(14개 언어, 원어민 검수 전). 씨앗(--seed)을 바꾸면 같은 칸에서 다른 문장·순서가 뽑힌다.
 */
import { readFileSync } from "node:fs";
import { rng, hashSeed } from "../personas.mjs";
import { detectCard, detectStart, detectTurn, checkHttp, issue } from "../detect.mjs";
import { makeAccounts } from "../accounts.mjs";

export const TIERS = ["ok", "light", "heavy", "mixed", "own", "passive", "odd", "overlap"];
export const TIER_LABELS = {
  ok: "맞는 문장",
  light: "약간 틀림(실수 하나)",
  heavy: "많이 틀림",
  mixed: "편한 말 낱말 섞음",
  own: "편한 말로만",
  passive: "소극적 대화",
  odd: "엉뚱한 입력",
  overlap: "단체방 겹침",
};
// 몇 칸만 다시 돌릴 때: TIERS_ONLY=overlap,passive
const ONLY = process.env.TIERS_ONLY ? process.env.TIERS_ONLY.split(",") : null;
const ODD = ["injection", "gibberish", "emoji", "offtopic", "single"];
const TIERS_BANK = JSON.parse(readFileSync(new URL("../tiers.json", import.meta.url), "utf8"));
const langsFor = (p) => ({ targetLanguage: p.target, interfaceLanguage: p.ui, locale: p.ui });

export function tierOf(persona, seed = 7) {
  const n = Number(String(persona.id).replace(/\D/g, "")) || 0;
  return TIERS[(n + (seed % TIERS.length)) % TIERS.length];
}

/** 문장부호·띄어쓰기·대소문자를 뺀 비교(받아쓰기형 마침표만 고친 건 '고침'으로 안 친다). */
export const bare = (text) => String(text ?? "").toLowerCase().replace(/[\p{P}\p{S}\s]/gu, "");

function shuffle(list, random) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** 그 칸의 턴 계획. 반환: [{ text, kind, expect, meta }] */
export function planTier(tier, persona, bank, seed = 7) {
  const random = rng(hashSeed(`tiers:${seed}:${persona.id}:${persona.target}:${persona.ui}`));
  const L = TIERS_BANK.lang[persona.target] ?? TIERS_BANK.lang.en;
  const practice = (text, expect, meta = {}) => ({ text, kind: "practice", expect, meta });
  if (tier === "ok") return shuffle(L.ok, random).slice(0, 4).map((t) => practice(t, { ok: true, tags: [] }));
  if (tier === "light") return shuffle(L.light, random).slice(0, 4).map((l) => practice(l.text, { ok: false, tags: l.tags }, { tag: l.tags[0] }));
  if (tier === "heavy") return shuffle(L.heavy, random).slice(0, 4).map((t) => practice(t, { ok: false, tags: ["many"] }));
  if (tier === "mixed") {
    return shuffle(L.mixed, random).slice(0, 3).map((template) => {
      const concept = /\{(\w+)\}/.exec(template)[1];
      const ownWord = TIERS_BANK.concepts[concept][persona.ui];
      const learnWord = TIERS_BANK.concepts[concept][persona.target];
      const text = template.replace(`{${concept}}`, ownWord);
      const same = bare(ownWord) === bare(learnWord);
      return practice(text, same ? { ok: true, tags: [] } : { ok: false, tags: ["mixed"] }, { ownWord: same ? null : ownWord, concept });
    });
  }
  if (tier === "own") {
    const lines = [bank.ownLanguage[persona.ui], bank.askMeaning[persona.ui], bank.askGrowth[persona.ui]];
    return lines.map((text) => ({ text, kind: "own", expect: {}, meta: {} }));
  }
  if (tier === "passive") return shuffle(L.passive, random).slice(0, 5).map((text) => ({ text, kind: "practice", expect: { ok: null, tags: [] }, meta: { passive: true } }));
  if (tier === "odd") {
    return shuffle(ODD, random).slice(0, 3).map((m) => ({ text: bank.misbehavior[m], kind: "misbehavior", misbehavior: m, expect: {}, meta: { odd: m } }));
  }
  return [];
}

const QUESTION = /[?？؟]|ไหม|มั้ย|หรือเปล่า|ไหน|อะไร/u;

/** 글자 두 개씩 묶은 겹침(0~1) — 소극적 대화에서 튜터가 같은 질문을 말만 바꿔 되풀이하는지. */
function overlapRatio(a, b) {
  const grams = (s) => {
    const t = bare(s);
    const set = new Set();
    for (let i = 0; i < t.length - 1; i += 1) set.add(t.slice(i, i + 2));
    return set;
  };
  const A = grams(a);
  const B = grams(b);
  if (!A.size || !B.size) return 0;
  let same = 0;
  for (const g of A) if (B.has(g)) same += 1;
  return same / Math.min(A.size, B.size);
}

export default {
  id: "tiers",
  label: "문장 종류 8칸(1차)",
  every: 1,
  note: "한 사람이 한 칸, 씨앗으로 돌아감 · 단체방 겹침은 임시 계정 3개(숨김·끝에 삭제)",
  estimate({ persona, opts }) {
    const tier = tierOf(persona, opts.seed);
    if (ONLY && !ONLY.includes(tier)) return { requests: 0, usd: 0 };
    if (tier === "overlap") return { requests: 30, usd: 0 };
    return { requests: tier === "own" ? 7 : 6, usd: 0.015 };
  },
  async run({ persona, userId, call, bank, opts, step }) {
    const tier = tierOf(persona, opts.seed);
    if (ONLY && !ONLY.includes(tier)) return;
    if (tier === "overlap") return runOverlap({ persona, userId, call, bank, step });

    const plan = planTier(tier, persona, bank, opts.seed);
    const recent = [];
    const replies = [];
    const start = await call(userId, "/api/chat", { body: { mode: "start", ...langsFor(persona) } });
    const opening = String(start.body?.assistantMessage ?? "");
    step({ suite: "tiers", tier, turn: 0, kind: "start", text: "(첫 인사)", status: start.status, ms: start.ms, reply: opening, issues: detectStart({ persona, response: start }) });
    if (opening) { recent.push(`other: ${opening}`); replies.push(opening); }

    for (let t = 0; t < plan.length; t += 1) {
      const turn = plan[t];
      const own = turn.kind === "own";
      const response = await call(userId, "/api/chat", {
        body: { mode: "chat", message: turn.text, ...langsFor(persona), ...(own ? { ownLanguage: true } : {}), recent: recent.slice(-8) },
      });
      const issues = detectTurn({ persona, turn, response, previousReplies: replies });
      const reply = String(response.body?.assistantMessage ?? "");
      const corrected = response.body?.correction?.corrected ?? "";
      const measure = { tier, ...turn.meta };

      if (turn.kind === "practice" && response.status === 200) {
        const changed = Boolean(corrected) && bare(corrected) !== bare(turn.text);
        measure.changed = changed;
        if (turn.meta.ownWord) {
          measure.replaced = Boolean(corrected) && !corrected.toLowerCase().includes(turn.meta.ownWord.toLowerCase());
          if (!measure.replaced) issues.push(issue("warn", "mixed_kept", `편한 말 낱말 '${turn.meta.ownWord}'을 그대로 둠`, { sample: `${turn.text} → ${corrected}`.slice(0, 120) }));
        }
      }
      if (tier === "passive" && response.status === 200) {
        measure.asks = QUESTION.test(reply);
        measure.length = [...reply].length;
        const similar = replies.slice(1).find((prev) => overlapRatio(prev, reply) >= 0.8);
        measure.similar = Boolean(similar);
        if (similar) issues.push(issue("warn", "passive_repeat", "짧게 답했더니 앞과 거의 같은 말을 되풀이", { sample: reply.slice(0, 80) }));
        if (measure.length > 280) issues.push(issue("warn", "passive_long", `짧은 답에 ${measure.length}자로 길게 답함`, { sample: reply.slice(0, 80) }));
      }
      const entry = { suite: "tiers", tier, turn: t + 1, kind: turn.kind, misbehavior: turn.misbehavior, expect: turn.expect, text: turn.text, status: response.status, ms: response.ms, reply, corrected, explanation: response.body?.correction?.explanation ?? "", measure, issues };
      if (own && response.status === 200) {
        const card = await call(userId, "/api/chat", { body: { mode: "how_to_say", expressionOnly: true, message: turn.text, ...langsFor(persona), recent: recent.slice(-8) } });
        entry.card = { status: card.status, ms: card.ms, expression: card.body?.expression ?? "" };
        entry.issues.push(...detectCard({ persona, response: card }));
        measure.cardOk = card.status === 200 && !entry.issues.some((i) => i.kind.startsWith("card_"));
      }
      step(entry);
      if (!own && turn.kind !== "misbehavior") recent.push(`me: ${turn.text}`);
      if (reply) { recent.push(`other: ${reply}`); replies.push(reply); }
      if (issues.some((i) => i.kind === "daily_limit")) break;
    }
  },
};

/** 단체방 겹침: 셋이 동시에 세 줄씩 + 그 사이 B가 A의 첫 줄을 집어 묻기. */
async function runOverlap({ persona, userId, call, bank, step }) {
  const P = "tiers";
  const acc = makeAccounts({ call, userId, step, prefix: P, persona });
  const L = TIERS_BANK.lang[persona.target] ?? TIERS_BANK.lang.en;
  try {
    const A = await acc.signup("a", { nickname: bank.nickname[persona.target] });
    const B = await acc.signup("b", { nickname: bank.nickname[persona.ui] });
    const C = await acc.signup("c");
    if (!A || !B || !C) return;
    const made = await acc.groups(A, "create", { name: `[test] overlap ${persona.target}↔${persona.ui} ${persona.id}`, languages: [persona.target, persona.ui], invite: [B.id, C.id] });
    const groupId = made.body?.group?.id;
    if (!groupId) { step({ suite: "tiers", tier: "overlap", title: "단체방 만들기", status: made.status, issues: checkHttp(P, made) }); return; }
    // 둘이 동시에 초대 참여 — 응답도 남긴다(실패한 참여를 줄 '사라짐'과 가르려고).
    const answers = await Promise.all([acc.groups(B, "answer", { groupId, accept: true }), acc.groups(C, "answer", { groupId, accept: true })]);
    const joinIssues = answers.flatMap((r) => checkHttp(P, r));
    const opened = await acc.groups(A, "open", { groupId });
    const members = opened.body?.group?.members ?? [];
    for (const [who, person] of [["B", B], ["C", C]]) {
      if (!members.includes(person.id)) joinIssues.push(issue("error", "overlap_join", `${who}가 참여했는데 사람 목록에 없음(참여 응답 ${answers[who === "B" ? 0 : 1].status})`));
    }

    const first = await acc.groups(A, "send", { groupId, text: `A0 ${L.ok[0]}` });
    const firstSeq = first.body?.message?.seq;
    const sent = [];
    const started = Date.now();
    const jobs = [];
    for (let i = 0; i < 3; i += 1) {
      for (const [who, person] of [["A", A], ["B", B], ["C", C]]) {
        const text = `${who}${i + 1} ${L.ok[(i + 1) % L.ok.length]}`;
        sent.push(text);
        jobs.push(acc.groups(person, "send", { groupId, text }));
      }
    }
    const askText = `B? ${bank.askMeaning[persona.ui]}`;
    jobs.push(acc.groups(B, "send", { groupId, text: askText, quoteSeq: firstSeq, ask: true }));
    const results = await Promise.all(jobs);
    const ms = Date.now() - started;
    const issues = [...joinIssues, ...results.flatMap((r) => checkHttp(P, r))];
    // 보내기 자체가 실패한 줄(앞단 막힘 등)은 '사라짐'으로 치지 않는다 — 그건 위 HTTP 오류로 따로 남는다.
    const expected = [...sent, askText].filter((_, i) => results[i]?.status === 200);
    const askSent = results.at(-1)?.status === 200;

    const views = await Promise.all([A, B, C].map((p) => acc.groups(p, "open", { groupId })));
    const texts = (v) => (v.body?.messages ?? []).filter((m) => m.kind === "text").map((m) => m.text);
    const seqs = (v) => (v.body?.messages ?? []).map((m) => m.seq);
    const measure = { tier: "overlap" };
    for (const [index, view] of views.entries()) {
      const who = "ABC"[index];
      if (view.status !== 200) { issues.push(...checkHttp(P, view)); continue; } // 열기 실패는 사라짐이 아님
      const list = texts(view);
      const missing = expected.filter((t) => !list.includes(t));
      const dup = list.filter((t, i) => list.indexOf(t) !== i);
      const s = seqs(view);
      const unordered = s.some((n, i) => i > 0 && n <= s[i - 1]);
      if (missing.length) issues.push(issue("error", "overlap_lost", `${who}에게 ${missing.length}줄이 안 보임`, { sample: missing[0] }));
      if (dup.length) issues.push(issue("error", "overlap_dup", `${who}에게 같은 줄이 두 번`, { sample: dup[0] }));
      if (unordered) issues.push(issue("error", "overlap_order", `${who}의 줄 번호 순서가 꼬임`));
    }
    const orders = views.filter((v) => v.status === 200).map((v) => texts(v).join("\u0001"));
    if (new Set(orders).size > 1) issues.push(issue("error", "overlap_order", "세 사람이 보는 줄 순서가 서로 다름"));
    const ask = (views[0].body?.messages ?? []).find((m) => m.text === askText);
    if (askSent && (!ask?.quote || ask.quote.text !== `A0 ${L.ok[0]}`)) issues.push(issue("error", "overlap_quote", `끼어들어 집은 인용이 다름: ${ask?.quote?.text ?? "없음"}`));
    measure.lines = texts(views[0]).length;
    measure.ms = ms;
    measure.ok = !issues.some((i) => i.kind.startsWith("overlap_"));
    measure.sentAll = expected.length === sent.length + 1;
    step({ suite: "tiers", tier: "overlap", title: "셋이 동시에 3줄씩 + 끼어들어 집어 묻기", input: `${sent.length + 1}줄 동시`, status: 200, ms, measure, outputs: [{ label: "보인 줄", text: `A ${texts(views[0]).length} · B ${texts(views[1]).length} · C ${texts(views[2]).length}` }], issues });
  } finally {
    await acc.cleanup();
  }
}
