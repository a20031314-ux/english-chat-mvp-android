export type BankInput = {
  language: string;
  stage: number;
  /** 통과한 대본·틀 id. */
  passed: ReadonlySet<string>;
  /** 오늘(그날 같은 장면). */
  seed?: string;
};

/** 이 장면에서 쓰는 틀이 학습자 말에 실제로 들었는지(위쪽 틀 칩의 불) — 빈칸 앞뒤 고정 부분이 모두 들었으면. */
export function frameUsed(pattern: string, heard: string): boolean {
  const clean = pattern.replace(/…/g, " ");
  // 틀 전체가 둘 이상("Привет, ___! / Здравствуйте, ___!")이면 그중 하나.
  const whole = clean.split(/\s+\/\s+/);
  if (whole.length > 1 && whole.every((one) => one.includes("___"))) return whole.some((one) => frameUsed(one, heard));
  const norm = (text: string) => text.toLowerCase().replace(/[’']/g, "'").replace(/[^\p{L}\p{M}\p{N}' ]+/gu, " ").replace(/\s+/g, " ").trim();
  const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const said = norm(heard);
  // 띄어쓰기 없는 글자(일본어·중국어·태국어)는 문장 안 어디든.
  const spaceless = (text: string) => /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Thai}]/u.test(text);
  const raw = clean.split("___");
  const parts = raw.map((piece, i) => {
    // 고를 수 있는 꼴: "이에요/예요"·"мой / моя" → 그중 하나, "아서/어서"처럼 끝이 같으면 줄어든 꼴("더워서")도 그 끝으로. "(으)" → 있어도 없어도.
    const units: string[] = [];
    const re = /([^\s/()]+(?:\s*\/\s*[^\s/()]+)+)|\(([^)]+)\)|(\s+)|([^\s/()]+)/gu;
    for (const m of piece.matchAll(re)) {
      if (m[1]) {
        const alts = m[1].split(/\s*\/\s*/).map(norm).filter(Boolean);
        let tail = alts[0] ?? "";
        for (const alt of alts) while (tail && !alt.endsWith(tail)) tail = tail.slice(1);
        const options = [...alts, ...(tail && /\p{Script=Hangul}/u.test(tail) && !alts.includes(tail) ? [tail] : [])];
        // 한국어 조사(은/는·이/가·을/를)는 말할 때 빠지거나 "도"로 바뀐다("이거 뭐예요?", "중국어도 할 수 있어요").
        const particle = alts.every((alt) => ["은", "는", "이", "가", "을", "를"].includes(alt));
        units.push(particle ? `(?:${[...options, "도"].map(escape).join("|")})?` : `(?:${options.map(escape).join("|")})`);
      } else if (m[2]) units.push(`(?:${escape(norm(m[2]))})?`);
      else if (m[3]) units.push(" ");
      else if (m[4]) {
        const text = norm(m[4]);
        // 문장부호만인 조각("!", ",")은 띄어 쓴 것과 같다.
        units.push(text ? escape(text) : " ");
      }
    }
    let body = units.join("").replace(/ +/g, " ").trim();
    const flat = spaceless(piece);
    if (flat) body = body.replace(/ \??/g, "");
    if (!body) return null;
    // 빈칸에 바로 붙은 쪽(한국어 "___은", 일본어 "___を")은 낱말 경계를 따지지 않는다.
    const left = !flat && (i === 0 || /^\s/.test(piece)) ? "(?:^| )" : "";
    const right = !flat && (i === raw.length - 1 || /\s$/.test(piece)) ? "(?: |$)" : "";
    return { body: `${left}${body}${right}`, flat };
  });
  const real = parts.filter((one): one is { body: string; flat: boolean } => Boolean(one));
  return real.length > 0 && real.every(({ body, flat }) => new RegExp(body, "u").test(flat ? said.replace(/\s+/g, "") : said));
}
