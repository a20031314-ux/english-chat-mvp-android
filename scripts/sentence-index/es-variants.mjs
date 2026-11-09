// 넣어 둔 문법 문제(problems/es-g.json)는 칸마다 한 문장이라 3~5단계 문법이 늘 같은 문장으로 나온다(2026-11-09 측정).
// 사전 예문(word-sentences/es.json, 뜻 ko·en)을 규칙으로 바꿔 그 칸의 문장을 더 만든다 — 모델 없음, 확실한 꼴만.
//   g|3:1 현재완료: 규칙 단순과거(dejé·dejó·dejaste·dejaron, -ió·-iste·-ieron) → he/ha/has/han + 과거분사
//   g|3:4 공손한 부탁: ¿(Me) puedes/puede …? → podrías/podría
// 뜻 줄은 원래 예문의 ko·en(현재완료 = 막 한 일·해 본 일이라 같은 뜻으로 읽힘). 그 밖의 앱 언어는 원래 한 문장만(preparedLoad.ts).
//   node scripts/sentence-index/es-variants.mjs        → src/lib/curriculum/problems/es-gv.json
//   node scripts/sentence-index/es-variants.mjs --check → 파일이 지금 규칙과 같은지
// 사용자 2026-11-09 "이미 있는 예문을 부분적으로 변형해가면서 문제수를 늘릴 수 있어?" → "진행해줘".
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const OUT = path.join(root, "src/lib/curriculum/problems/es-gv.json");
const PER_KEY = 240;
const dict = JSON.parse(fs.readFileSync(path.join(root, "src/lib/curriculum/word-sentences/es.json"), "utf8"));
const { WORDS } = await import(path.join(root, "src/lib/curriculum/vocab/es.ts"));
const { stageOfRank } = await import(path.join(root, "src/lib/curriculum/vocabBank.ts"));
const rank = new Map(WORDS.map((row, i) => [String(row[0]).toLowerCase(), i]));

// 과거분사가 불규칙이거나 규칙 꼴이 다른 낱말과 겹치는 동사는 뺀다.
const SKIP = new Set(["estar", "dar", "ir", "ser", "haber", "hacer", "tener", "poder", "querer", "decir", "venir", "poner", "saber", "salir", "ver", "oír", "caer", "traer", "valer", "leer", "creer", "reír", "freír",
  "escribir", "describir", "inscribir", "abrir", "cubrir", "descubrir", "romper", "volver", "devolver", "envolver", "resolver", "morir", "imprimir", "satisfacer", "prever", "proveer", "poseer"]);
const forms = new Map(); // 꼴 → { aux, pp, inf }
for (const row of WORDS) {
  if (row[1] !== "verb") continue;
  const inf = String(row[0]).replace(/se$/, "");
  if (SKIP.has(inf) || [...SKIP].some((one) => one.length > 4 && inf.endsWith(one))) continue;
  const m = inf.match(/^(.+)(ar|er|ir)$/);
  if (!m || m[1].length < 2) continue;
  const [, stem, end] = m;
  const pp = stem + (end === "ar" ? "ado" : "ido");
  const ends = end === "ar" ? [["é", "he"], ["aste", "has"], ["ó", "ha"], ["aron", "han"]] : [["í", "he"], ["iste", "has"], ["ió", "ha"], ["ieron", "han"]];
  for (const [e, aux] of ends) if (!forms.has(stem + e)) forms.set(stem + e, { aux, pp, inf });
}
// 1인칭 -er/-ir 꼴(comí)은 다른 낱말과 겹치기 쉬워 뺀다(salí·viví는 괜찮지만 "sí"류 오인 방지).
for (const [form, one] of forms) if (one.aux === "he" && form.endsWith("í")) forms.delete(form);

// 단순과거가 맞는 때 말(이것이 있으면 현재완료로 바꾸지 않음)·다른 과거 동사(시제가 섞임).
const PAST_TIME = /(?<!\p{L})(ayer|anoche|anteayer|pasad[oa]s?|hace|lunes|martes|miércoles|jueves|viernes|sábado|domingo|cuando|entonces|luego|después|primero|de niñ[oa]|en \d{4}|aquel|aquella|ese día|esa vez)(?!\p{L})/iu;
const IRREG_PAST = /(?<!\p{L})(fui|fue|fuiste|fueron|tuve|tuvo|tuviste|hice|hizo|hiciste|dije|dijo|dijiste|vine|vino|pude|pudo|puse|puso|estuve|estuvo|quise|quiso|supe|supo|di|dio|vi|vio|traje|trajo|había|era|estaba|iba)(?!\p{L})/iu;
const cap = (text, upper) => (upper ? text[0].toUpperCase() + text.slice(1) : text);

const perfect = [];
const polite = [];
const seen = new Set();
for (const [key, lines] of Object.entries(dict)) {
  const w = key.slice(2).toLowerCase();
  const r = rank.get(w);
  // 3단계 문법이니 낱말도 3단계까지(rule ③ 난이도).
  if (r === undefined || stageOfRank("es", r) > 3) continue;
  for (const line of lines) {
    const text = String(line.text ?? "").trim();
    if (!text || seen.has(text) || !line.ko || !line.en) continue;
    seen.add(text);
    const tokens = text.match(/\p{L}+/gu) ?? [];
    if (tokens.length < 3 || tokens.length > 10) continue;
    // 현재완료
    if (!PAST_TIME.test(text) && !IRREG_PAST.test(text)) {
      const hits = tokens.filter((t) => forms.has(t.toLowerCase()));
      if (hits.length === 1) {
        const token = hits[0];
        const one = forms.get(token.toLowerCase());
        const at = text.search(new RegExp(`(?<!\\p{L})${token}(?!\\p{L})`, "u"));
        const upper = at === 0;
        const answer = cap(`${one.aux} ${one.pp}`, upper);
        // 오답 = 흔한 실수 꼴(분사 어미를 반대로·단순과거를 그대로·원형). 주어를 바꾼 꼴은 뜻 줄에 주어가 없으면 맞는 답이 되어 쓰지 않는다.
        const wrongPp = one.pp.endsWith("ado") ? one.pp.replace(/ado$/, "ido") : one.pp.replace(/ido$/, "ado");
        const options = [answer, cap(`${one.aux} ${wrongPp}`, upper), cap(`${one.aux} ${token.toLowerCase()}`, upper), cap(`${one.aux} ${one.inf}`, upper)];
        perfect.push({
          before: text.slice(0, at),
          after: text.slice(at + token.length),
          answer,
          options,
          line: text.slice(0, at) + answer + text.slice(at + token.length),
          ko: line.ko,
          en: line.en,
          whyKo: `현재완료는 haber + 과거분사라 ${one.aux} ${one.pp}예요.`,
          whyEn: `The present perfect is haber + past participle: ${one.aux} ${one.pp}.`,
          inf: one.inf,
        });
      }
    }
    // 공손한 부탁
    const m = text.match(/^(¿(?:\p{L}+ )?)(puedes|puede|Puedes|Puede)(?!\p{L})(.*\?)$/u);
    if (m && (m[1] === "¿" || /^¿(me|nos|le|te|lo|la) $/iu.test(m[1]))) {
      const tu = m[2].toLowerCase() === "puedes";
      const upper = m[1] === "¿";
      const answer = cap(tu ? "podrías" : "podría", upper);
      const options = (tu ? ["podrías", "poderías", "puedrías", "podríais"] : ["podría", "podería", "puedría", "podrían"]).map((one) => cap(one, upper));
      polite.push({
        before: m[1],
        after: m[3],
        answer,
        options,
        line: m[1] + answer + m[3],
        ko: line.ko,
        en: line.en,
        whyKo: `공손한 부탁은 조건법이라 ${tu ? "tú는 podrías" : "usted는 podría"}예요.`,
        whyEn: `A polite request uses the conditional: ${tu ? "podrías for tú" : "podría for usted"}.`,
        inf: tu ? "tú" : "usted",
      });
    }
  }
}

// 같은 동사는 둘까지, 짧은 문장 먼저(1단계 쪽 낱말일수록 앞).
function spread(list) {
  const per = new Map();
  const out = [];
  for (const one of [...list].sort((a, b) => a.line.length - b.line.length || a.line.localeCompare(b.line))) {
    const n = per.get(one.inf) ?? 0;
    if (n >= 2 && one.inf !== "tú" && one.inf !== "usted") continue;
    per.set(one.inf, n + 1);
    const { inf, ...rest } = one;
    void inf;
    out.push(rest);
    if (out.length >= PER_KEY) break;
  }
  // 정렬은 짧은 순이지만 나오는 차례는 섞는다(같은 길이끼리 몰리지 않게) — 고정 씨앗.
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const result = { "g|3:1": spread(perfect), "g|3:4": spread(polite) };
const body = `${JSON.stringify(result, null, 1)}\n`;
if (process.argv.includes("--check")) {
  const have = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
  if (have !== body) {
    console.error("es-gv.json이 규칙과 다름 — node scripts/sentence-index/es-variants.mjs");
    process.exit(1);
  }
  console.log("es-gv.json 맞음");
} else {
  fs.writeFileSync(OUT, body);
  console.log(`현재완료 ${perfect.length} → ${result["g|3:1"].length} · 공손한 부탁 ${polite.length} → ${result["g|3:4"].length}`);
}
