/**
 * 가상 사용자(페르소나)와 그 사람이 보낼 대화 계획.
 *
 * 페르소나는 한 줄 설명이 아니라 속성의 조합이다. 속성을 모두 곱하면
 * 3×5×7×6×2 = 1,260명이라 매번 다 돌릴 수 없으니, "모든 속성 쌍이 적어도 한 번
 * 같이 나온다"(pairwise)를 지키는 최소에 가까운 행을 고르고, 그 행을 14×14
 * 학습 조합(학습 언어 × 앱 언어)에 돌려 가며 붙인다. 그래서 기본 196명이면
 * 196개 조합을 모두 한 번씩 덮고, 속성 쌍도 모두 덮는다.
 *
 * 모든 선택은 시드에서 나온다. 같은 시드면 같은 사람, 같은 문장 — 바뀐 결과는
 * 앱이 바뀌어서지 질문이 바뀌어서가 아니다.
 */
import { readFileSync } from "node:fs";

export const LANGUAGES = ["en", "ko", "ja", "zh", "es", "fr", "it", "pt", "ru", "ar", "id", "vi", "th", "hi"];

export const ATTRIBUTES = {
  /** 아는 언어: 앱 언어만 / 영어를 조금 섞음 / 여러 언어 경험 */
  background: ["mono", "bilingual_en", "multilingual"],
  /** 1 처음 배움 … 5 능숙하지만 세부 실수 */
  level: [1, 2, 3, 4, 5],
  /** 주로 틀리는 곳 */
  weakness: ["tense", "agreement", "particle", "word_order", "spelling", "vocab", "register"],
  /** 대화 태도 */
  temperament: ["steady", "terse", "chatty", "gives_up", "questioner", "stubborn"],
  /** 입력 방식: 키보드 / 받아쓰기(소문자, 문장부호 없음) */
  inputStyle: ["typed", "dictation"],
};

/** 셋 중 한 명꼴로 한 턴에 섞는 이상 행동 */
export const MISBEHAVIORS = ["injection", "gibberish", "emoji", "long", "single", "offtopic", "repeat"];

export const LABELS = {
  background: { mono: "한 언어", bilingual_en: "영어 조금 섞음", multilingual: "여러 언어" },
  level: { 1: "처음", 2: "기초", 3: "중간", 4: "중상", 5: "능숙(세부 실수)" },
  weakness: {
    tense: "시제", agreement: "일치·활용", particle: "조사·관사·격", word_order: "어순",
    spelling: "철자", vocab: "어휘", register: "존댓말·말투",
  },
  temperament: {
    steady: "보통", terse: "단답형", chatty: "수다형", gives_up: "막히면 모국어",
    questioner: "질문 많음", stubborn: "같은 실수 반복",
  },
  inputStyle: { typed: "키보드", dictation: "받아쓰기" },
  misbehavior: {
    none: "없음", injection: "지시 탈취 시도", gibberish: "아무 글자", emoji: "이모지만",
    long: "아주 긴 입력", single: "한 글자", offtopic: "숙제 대신 써 달라", repeat: "같은 말 반복",
  },
};

export function loadBank() {
  return JSON.parse(readFileSync(new URL("./bank.json", import.meta.url), "utf8"));
}

/** 작고 결정적인 난수 (mulberry32). */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashSeed(text) {
  let h = 2166136261;
  for (const ch of String(text)) h = Math.imul(h ^ ch.codePointAt(0), 16777619);
  return h >>> 0;
}

/**
 * 모든 속성 쌍(값-값)이 적어도 한 행에 같이 나오는 행 목록 (욕심쟁이 방식).
 * 후보를 여러 개 만들어 아직 안 덮인 쌍을 가장 많이 덮는 행을 고른다.
 */
export function pairwiseRows(attributes = ATTRIBUTES, seed = 1) {
  const keys = Object.keys(attributes);
  const random = rng(seed);
  const uncovered = new Set();
  const pairKey = (i, a, j, b) => `${i}:${a}|${j}:${b}`;
  for (let i = 0; i < keys.length; i += 1) {
    for (let j = i + 1; j < keys.length; j += 1) {
      for (const a of attributes[keys[i]]) for (const b of attributes[keys[j]]) uncovered.add(pairKey(i, a, j, b));
    }
  }
  const covers = (row) => {
    let n = 0;
    for (let i = 0; i < keys.length; i += 1) {
      for (let j = i + 1; j < keys.length; j += 1) if (uncovered.has(pairKey(i, row[i], j, row[j]))) n += 1;
    }
    return n;
  };
  const rows = [];
  while (uncovered.size > 0) {
    let best = null;
    let bestScore = -1;
    for (let attempt = 0; attempt < 60; attempt += 1) {
      // 첫 후보는 아직 안 덮인 쌍 하나에서 출발해야 언젠가 끝난다.
      const row = keys.map((key) => attributes[key][Math.floor(random() * attributes[key].length)]);
      if (attempt === 0) {
        const [left, right] = [...uncovered][0].split("|");
        const [i, a] = left.split(":");
        const [j, b] = right.split(":");
        row[Number(i)] = attributes[keys[Number(i)]].find((v) => String(v) === a);
        row[Number(j)] = attributes[keys[Number(j)]].find((v) => String(v) === b);
      }
      const score = covers(row);
      if (score > bestScore) { best = row; bestScore = score; }
    }
    for (let i = 0; i < keys.length; i += 1) {
      for (let j = i + 1; j < keys.length; j += 1) uncovered.delete(pairKey(i, best[i], j, best[j]));
    }
    rows.push(Object.fromEntries(keys.map((key, index) => [key, best[index]])));
  }
  return rows;
}

/** 196개 학습 조합. 대각선(학습 언어 = 앱 언어)도 사용자가 고를 수 있으니 넣는다. */
export function allCombos() {
  const combos = [];
  for (const target of LANGUAGES) for (const ui of LANGUAGES) combos.push({ target, ui });
  return combos;
}

/**
 * count명의 페르소나. 조합은 섞은 196개를 돌려 쓰고, 속성은 pairwise 행을 돌려 쓴다.
 * --only ja:ko 처럼 조합을 좁히면 그 조합 안에서만 돈다.
 */
export function buildPersonas({ count = 196, seed = 7, only = null } = {}) {
  const random = rng(seed);
  const rows = pairwiseRows(ATTRIBUTES, seed);
  let combos = allCombos();
  if (only && only.length > 0) {
    combos = combos.filter((c) => only.some((o) => (o.target === "*" || o.target === c.target) && (o.ui === "*" || o.ui === c.ui)));
  }
  if (combos.length === 0) throw new Error("--only에 맞는 조합이 없어요");
  // 조합 순서를 섞어서 적은 인원으로 돌려도 한 언어에 몰리지 않게.
  combos = combos.map((c) => [random(), c]).sort((a, b) => a[0] - b[0]).map(([, c]) => c);
  const personas = [];
  for (let i = 0; i < count; i += 1) {
    const combo = combos[i % combos.length];
    const row = rows[(i * 7 + Math.floor(i / rows.length)) % rows.length];
    const misbehavior = i % 3 === 2 ? MISBEHAVIORS[Math.floor(i / 3) % MISBEHAVIORS.length] : "none";
    personas.push({ id: `p${String(i + 1).padStart(3, "0")}`, ...combo, ...row, misbehavior });
  }
  return { personas, rows };
}

export function describePersona(p) {
  return [
    `${p.target} 학습 · ${p.ui} 앱`,
    LABELS.background[p.background],
    LABELS.level[p.level],
    `약점 ${LABELS.weakness[p.weakness]}`,
    LABELS.temperament[p.temperament],
    LABELS.inputStyle[p.inputStyle],
    p.misbehavior !== "none" ? `이상 행동: ${LABELS.misbehavior[p.misbehavior]}` : null,
  ].filter(Boolean).join(" · ");
}

/** 받아쓰기처럼: 소문자, 문장부호 없음. */
function dictate(text) {
  return text.replace(/[.,!?¿¡。、，！？؟।]/gu, "").toLowerCase().trim();
}

/** 앱 언어 단어 하나 또는 영어 몇 단어를 섞는다(이중 언어 사용자). */
function mixIn(text, persona, random) {
  const english = ["so busy", "actually", "like", "you know"];
  const own = { ko: "진짜", ja: "マジで", zh: "真的", es: "bueno", fr: "genre", it: "tipo", pt: "tipo", ru: "короче", ar: "يعني", id: "banget", vi: "kiểu", th: "แบบ", hi: "यार", en: "like" };
  const word = persona.target === "en" || persona.background === "multilingual"
    ? own[persona.ui] ?? "like"
    : english[Math.floor(random() * english.length)];
  return random() < 0.5 ? `${word}, ${text}` : `${text} ${word}`;
}

/**
 * 한 페르소나가 보낼 턴 목록. 각 턴: { text, kind, expect }
 * kind: practice(학습 언어로 쓴 문장) | own(앱 언어로 물음) | misbehavior
 * expect: { ok?: boolean, tags?: string[] } — 고침이 맞는지 볼 때 쓴다.
 */
export function planTurns(persona, bank, { turns = 6, seed = 7 } = {}) {
  const random = rng(hashSeed(`${seed}:${persona.id}:${persona.target}:${persona.ui}`));
  const lines = bank.learner[persona.target] ?? bank.learner.en;
  // 약점이 맞는 문장 > 수준이 가까운 문장 > 나머지. ok 문장도 섞어 '잘못 고침'을 본다.
  const weighted = lines.map((line) => {
    let w = 1;
    if (line.tags.includes(persona.weakness)) w += 4;
    w += Math.max(0, 3 - Math.abs(line.level - persona.level));
    if (line.ok) w += 1;
    return { line, w };
  });
  const pick = (exclude = new Set()) => {
    const pool = weighted.filter((x) => !exclude.has(x.line.text));
    const list = pool.length > 0 ? pool : weighted;
    let r = random() * list.reduce((s, x) => s + x.w, 0);
    for (const x of list) { r -= x.w; if (r <= 0) return x.line; }
    return list[list.length - 1].line;
  };

  const used = new Set();
  const plan = [];
  let lastError = null;
  for (let t = 0; t < turns; t += 1) {
    let line = pick(used);
    if (persona.temperament === "stubborn" && lastError && t % 2 === 1) line = lastError;
    used.add(line.text);
    if (!line.ok) lastError = line;
    let text = line.text;
    if (persona.temperament === "chatty") {
      const extra = pick(new Set([...used]));
      text = `${text} ${extra.text}`;
      used.add(extra.text);
    }
    let truncated = false;
    if (persona.temperament === "terse") {
      const cut = text.split(/[,，、،]/u)[0].trim();
      truncated = cut !== text;
      text = cut;
    }
    if (persona.background !== "mono" && random() < 0.35) text = mixIn(text, persona, random);
    if (persona.inputStyle === "dictation") text = dictate(text);
    // 잘라낸 문장은 실수가 남았는지 알 수 없으니 고침 여부를 묻지 않는다(ok: null).
    const expect = truncated
      ? { ok: null, tags: [], source: line.text }
      : { ok: Boolean(line.ok) && text === line.text, tags: line.tags, source: line.text };
    plan.push({ text, kind: "practice", expect });
  }

  // 태도에 따라 앱 언어로 묻는 턴.
  if (persona.temperament === "gives_up" && plan.length >= 2) {
    plan[1] = { text: bank.ownLanguage[persona.ui], kind: "own", expect: {} };
  }
  if (persona.temperament === "questioner" && plan.length >= 3) {
    plan[2] = { text: bank.askMeaning[persona.ui], kind: "own", expect: {} };
  }
  if (persona.level === 1 && plan.length >= 4 && persona.temperament !== "gives_up") {
    plan[3] = { text: bank.ownLanguage[persona.ui], kind: "own", expect: {} };
  }

  // 이상 행동은 마지막에서 두 번째 턴에 하나.
  if (persona.misbehavior !== "none" && plan.length >= 2) {
    const at = plan.length - 2;
    let text;
    if (persona.misbehavior === "long") text = Array.from({ length: 25 }, () => plan[0].text).join(" ");
    else if (persona.misbehavior === "repeat") text = plan[at - 1]?.text ?? plan[0].text;
    else text = bank.misbehavior[persona.misbehavior];
    plan[at] = { text, kind: "misbehavior", misbehavior: persona.misbehavior, expect: {} };
  }
  return plan;
}
