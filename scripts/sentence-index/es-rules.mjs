// 스페인어 문장 색인 규칙: 예문 하나 → 그 문장에 든 문법 칸 열쇠(g|단계:번호).
// 규칙(모델 없음)이라 정확도보다 "확실한 것만" 쪽으로 잡는다 — 잡힌 문장은 그 문법을 실제로 쓴 문장이어야 한다.
// 칸 이름은 src/lib/curriculum/stages/es.ts. 모르는 꼴은 안 잡는다(놓침 > 잘못 잡음).

const W = "[\\p{L}]";
const word = (list) => new RegExp(`(?<!${W})(?:${list.join("|")})(?!${W})`, "iu");
const re = (source) => new RegExp(source, "iu");

/** 낱말 목록(vocab/es.ts)에서 동사 원형을 받아 규칙 활용 꼴을 만든다. */
export function makeForms(verbs) {
  const presentAr = new Set();
  const preterite = new Set();
  const imperfect = new Set();
  const subjunctive = new Set();
  for (const verb of verbs) {
    const base = verb.replace(/se$/, "");
    // 불규칙·짧은 동사는 규칙 꼴로 만들면 다른 낱말과 겹침(esta = 이것, da·das).
    if (["estar", "dar", "ir", "ser", "haber", "hacer", "tener", "poder", "querer", "decir", "venir", "poner", "saber", "salir", "ver", "oír", "caer", "traer", "valer"].includes(base)) continue;
    const m = base.match(/^(.+)(ar|er|ir)$/);
    if (!m) continue;
    const [, stem, end] = m;
    if (stem.length < 2) continue;
    if (end === "ar") {
      for (const e of ["o", "as", "a", "an"]) presentAr.add(stem + e);
      for (const e of ["é", "aste", "ó", "aron"]) preterite.add(stem + e);
      for (const e of ["aba", "abas", "ábamos", "aban"]) imperfect.add(stem + e);
      for (const e of ["e", "es", "emos", "en"]) subjunctive.add(stem + e);
    } else {
      for (const e of ["í", "iste", "ió", "ieron"]) preterite.add(stem + e);
      for (const e of ["ía", "ías", "íamos", "ían"]) imperfect.add(stem + e);
      for (const e of ["a", "as", "amos", "an"]) subjunctive.add(stem + e);
    }
  }
  return { presentAr, preterite, imperfect, subjunctive };
}

const tokensOf = (text) => (text.toLocaleLowerCase("es").match(/\p{L}+/gu) ?? []);

/** 문장 → 잡힌 문법 칸 열쇠들. forms = makeForms(...), nouns = 낱말 성 { 낱말: "m"|"f" }. */
export function grammarKeys(text, forms, nouns) {
  const t = text;
  const low = t.toLocaleLowerCase("es");
  const tokens = tokensOf(t);
  const out = new Set();
  // 같은 글자의 명사(retiro·cambio·atasco)는 동사 꼴로 안 셈.
  const has = (set) => tokens.some((one) => set.has(one) && !nouns[one]);
  // 1단계
  if (/(?<![\p{L}])(soy|somos)(?![\p{L}])/iu.test(t) || /(?<![\p{L}])es de \p{Lu}/u.test(t)) out.add("g|1:0");
  if (word(["me llamo", "te llamas", "se llama", "nos llamamos", "se llaman"]).test(t)) out.add("g|1:1");
  if (has(forms.presentAr)) out.add("g|1:2");
  if (t.includes("¿") && word(["qué", "dónde", "cuándo", "cómo", "quién", "quiénes", "cuál", "cuáles", "cuánto", "cuánta", "cuántos", "cuántas", "por qué", "adónde"]).test(t)) out.add("g|1:3");
  for (let i = 0; i + 1 < tokens.length; i++) {
    const art = tokens[i];
    const g = nouns[tokens[i + 1]];
    if (!g) continue;
    if ((g === "m" && ["el", "un"].includes(art)) || (g === "f" && ["la", "una"].includes(art))) {
      out.add("g|1:4");
      break;
    }
  }
  if (re(`(?<!${W})(estoy|estás|está|estamos|están) (en|cerca|lejos|aquí|allí|ahí|al lado|delante|detrás|encima|debajo|dentro|fuera)(?!${W})`).test(t)) out.add("g|1:5");
  if (word(["hay"]).test(t)) out.add("g|1:6");
  if (re(`(?<!${W})(tengo|tienes|tiene|tenemos|tienen) (?!que(?!${W}))`).test(t)) out.add("g|1:7");
  // 2단계
  if (has(forms.preterite)) out.add("g|2:0");
  if (word(["fui", "fuiste", "fuimos", "fueron", "hice", "hiciste", "hizo", "hicimos", "hicieron", "tuve", "tuviste", "tuvo", "tuvimos", "tuvieron", "estuve", "estuvo", "estuvimos", "pude", "pudo", "dije", "dijo", "vine", "vino", "puse", "puso", "quise", "quiso", "supe", "supo", "traje", "trajo"]).test(t)) out.add("g|2:1");
  if (re(`(?<!${W})(voy|vas|va|vamos|van) a \\p{L}+(ar|er|ir)(?!${W})`).test(t)) out.add("g|2:2");
  if (word(["gusta", "gustan", "encanta", "encantan", "gustó", "encantó", "gustaba", "gustaban", "encantaba"]).test(t)) out.add("g|2:3");
  if (word(["quiero", "quieres", "quiere", "quieren", "puedo", "puedes", "puede", "pueden", "prefiero", "prefieres", "prefiere", "prefieren", "pienso", "piensas", "piensa", "vuelvo", "vuelve", "duermo", "duerme", "empiezo", "empieza", "cuesta", "cuestan"]).test(t)) out.add("g|2:4");
  if (re(`(?<!${W})(tengo|tienes|tiene|tenemos|tienen|tenía|tuve|tuvo) que(?!${W})`).test(t)) out.add("g|2:5");
  if (word(["duele", "duelen", "dolía", "dolió", "dolían"]).test(t)) out.add("g|2:6");
  for (let i = 0; i + 1 < tokens.length; i++) {
    if (!["lo", "la", "los", "las"].includes(tokens[i])) continue;
    const next = tokens[i + 1];
    if (nouns[next]) continue;
    if (forms.presentAr.has(next) || forms.preterite.has(next) || /^(quiero|quieres|quiere|tengo|tiene|veo|ves|ve|vi|vio|sé|hago|hice|puedo|puede|pongo|traigo|compré|compro|necesito|tomo|llevo|dejo|leo|leí|conozco|encontré|perdí)$/.test(next)) {
      out.add("g|2:7");
      break;
    }
  }
  // 3단계
  if (has(forms.imperfect) && (has(forms.preterite) || word(["fui", "fue", "hice", "hizo", "tuve", "tuvo", "dijo", "vino", "llegó", "llegué"]).test(t))) out.add("g|3:0");
  if (re(`(?<!${W})(he|has|ha|hemos|han) \\p{L}+(ado|ido|ído|to|cho|sto|lto)(?!${W})`).test(t)) out.add("g|3:1");
  if (re(`(?<!${W})(me|te|se|nos) (levant|duch|acuest|despiert|vist|lav|pein|maquill|sient|qued|arregl|relaj|despid|cans)\\p{L}*`).test(t)) out.add("g|3:2");
  if (re(`(?<!${W})(no )?(creo|pienso|me parece|opino) que(?!${W})`).test(t)) out.add("g|3:3");
  if (word(["podría", "podrías", "podríamos", "me gustaría", "te gustaría", "le gustaría", "nos gustaría", "querría", "desearía"]).test(t)) out.add("g|3:4");
  if (re(`(?<!${W})(más|menos) \\p{L}+ que(?!${W})`).test(t) || re(`(?<!${W})tan \\p{L}+ como(?!${W})`).test(t) || word(["mejor que", "peor que", "mayor que", "menor que"]).test(t)) out.add("g|3:5");
  if (re(`(?<!${W})(me|te|se|nos) (lo|la|los|las) \\p{L}+`).test(t) || re(`\\p{L}*[áéíóú]\\p{L}*(melo|mela|melos|melas|telo|tela|selo|sela|selos|selas|noslo|nosla)(?!${W})`).test(t)) out.add("g|3:6");
  // 4단계
  if (re(`(?<!${W})(espero|esperamos|ojalá|me alegra|me alegro de|siento|deseo|quiero|prefiero|me encanta|necesito) que(?!${W})`).test(t) || word(["ojalá"]).test(t)) out.add("g|4:0");
  if (re(`(?<!${W})si \\p{L}+(ara|aras|áramos|aran|iera|ieras|iéramos|ieran|iese|uviera|uviese)(?!${W})`).test(t)) out.add("g|4:1");
  if (word(["aunque"]).test(t)) out.add("g|4:2");
  if (re(`(?<!${W})(me |te |le |nos |les )?(dijo|dijeron|dije|contó|explicó|comentó|avisó|prometió) que(?!${W})`).test(t)) out.add("g|4:3");
  if (re(`(?<!${W})cuando (\\p{L}+)`).test(t)) {
    const after = low.match(/cuando (\p{L}+)/u)?.[1];
    if (after && (forms.subjunctive.has(after) || /^(termines|llegues|tengas|vengas|puedas|sepas|estés|seas|vayas|haya|hagas|salgas|veas|digas|vuelvas|acabes|tenga|venga|pueda|sea|vaya|llegue|termine)$/.test(after))) out.add("g|4:4");
  }
  if (re(`(?<!${W})se (dice|dicen|vende|venden|habla|hablan|necesita|necesitan|puede|pueden|busca|buscan|alquila|alquilan|come|cree|sabe|nota|ve|usa|usan|prohíbe|permite)(?!${W})`).test(t)) out.add("g|4:5");
  if (word(["por un lado", "por otro lado", "en cambio", "por lo tanto", "sin embargo", "no obstante", "por consiguiente", "además"]).test(t)) out.add("g|4:6");
  // 5단계
  if (word(["hubiera", "hubieras", "hubiéramos", "hubieran", "hubiese", "hubieses", "hubiesen"]).test(t)) out.add("g|5:0");
  if (re(`^(\\p{L}+ )?(quería|queríamos|diría|venía a|me preguntaba)(?!${W})`).test(low)) out.add("g|5:1");
  if (re(`(?<!${W})lo que (más )?\\p{L}+.*(?<!${W})(es|fue|era)(?!${W})`).test(t) || re(`(?<!${W})(es|fue|era) \\p{L}+ (quien|quienes)(?!${W})`).test(t)) out.add("g|5:2");
  {
    const m = low.match(/(alguien|algo|nadie|nada|algún|alguna|ningún|ninguna) (\p{L}+ )?que (\p{L}+)/u);
    if (m && (forms.subjunctive.has(m[3]) || /^(sepa|sea|tenga|pueda|haga|hable|esté|vaya|quiera|venga|diga)$/.test(m[3]))) out.add("g|5:3");
  }
  if (word(["usted", "ustedes", "le agradecería", "les agradecería"]).test(t)) out.add("g|5:4");
  {
    const NOT_DIM = new Set(["bonito", "bonita", "bonitos", "bonitas", "favorito", "favorita", "maldito", "maldita", "bendito", "infinito", "infinita", "exquisito", "gratuito", "visita", "cita", "pepita", "mantequilla", "ardilla", "rodilla", "silla", "tortilla", "pesadilla", "cuchillo", "ladrillo", "bolsillo", "amarillo", "amarilla", "sencillo", "sencilla", "castillo", "pasillo", "anillo", "tobillo", "mejilla", "orilla", "zapatilla", "zapatillas", "galleta", "bombilla", "semilla", "costilla", "almohadilla", "frito", "frita", "escrito", "escrita", "bendita", "necesito", "necesita", "necesitas", "necesitamos", "invito", "invita", "evito", "evita", "grito", "grita", "permito", "permita", "admito", "excito", "habito", "quito", "quita", "debilita", "facilita", "palito"]);
    const dim = tokens.find((one) => one.length > 5 && !NOT_DIM.has(one) && /(cito|cita|citos|citas|ito|ita|itos|itas|illo|illa|illos|illas)$/.test(one));
    if (dim) {
      const stem = dim.replace(/(cito|cita|citos|citas|ito|ita|itos|itas|illo|illa|illos|illas)$/, "");
      if (nouns[stem + "o"] || nouns[stem + "a"] || nouns[stem] || nouns[stem + "e"] || ["momentito", "poquito", "ahorita", "cerquita", "rapidito", "despacito", "chiquito"].includes(dim)) out.add("g|5:5");
    }
  }
  if (word(["o sea", "es decir", "en definitiva", "en resumen", "a fin de cuentas", "dicho de otro modo", "total que"]).test(t)) out.add("g|5:6");
  return [...out];
}

/** 문장 → 잡힌 표현 열쇠들(단계 핵심 표현 글자 그대로, 대소문자·¿¡·끝 문장부호 무시). */
export function expressionKeys(text, expressions) {
  const norm = (s) => ` ${s.toLocaleLowerCase("es").replace(/[¿¡!?.,;:"«»()]/g, " ").replace(/\s+/g, " ").trim()} `;
  const hay = norm(text);
  return expressions.filter((one) => hay.includes(norm(one))).map((one) => `e|${one}`);
}
