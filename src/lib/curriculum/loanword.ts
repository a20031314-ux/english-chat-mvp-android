/**
 * 소리 그대로 옮긴 말(외래어·같은 말) — 뜻 풀이가 그 단어를 소리 나는 대로 적은 것이면 뜻 고르기가 거저다
 * (micrófono ↔ ميكروفون, TV ↔ テレビ, hospital ↔ hospital — 체감 점검 2026-11-12, 사용자 "소리 그대로 옮긴 말은 문제로 안 나오게").
 *
 * 두 말을 자음 뼈대(k·t·p·s·r·n)로 바꿔 견준다: 라틴·한글·가나·아랍·키릴. 그 밖의 글자(한자·태국·데바나가리)는 판단하지 않는다(false).
 * 순수 — 퀴즈 고르기(cardQuiz)가 낱말을 문제로 낼지 정할 때만.
 */

const LATIN: Record<string, string> = {
  b: "p", p: "p", f: "p", v: "p",
  k: "k", q: "k", g: "k", c: "k", x: "ks",
  s: "s", z: "s", j: "s",
  d: "t", t: "t",
  l: "r", r: "r",
  m: "m", n: "n", ñ: "n",
};

function latinBones(text: string): string {
  const plain = text.toLocaleLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/ñ/g, "n");
  let out = "";
  for (let i = 0; i < plain.length; i += 1) {
    const ch = plain[i]!;
    const next = plain[i + 1] ?? "";
    if ((ch === "c" || ch === "s") && next === "h") { out += "s"; i += 1; continue; }
    if (ch === "p" && next === "h") { out += "p"; i += 1; continue; }
    if (ch === "t" && next === "h") { out += "t"; i += 1; continue; }
    if (ch === "c" && /[eiy]/.test(next)) { out += "s"; continue; }
    out += LATIN[ch] ?? "";
  }
  return out;
}

// 한글: 첫소리 19 · 끝소리 28(첫 칸 없음).
const HANGUL_FIRST = ["k", "k", "n", "t", "t", "r", "m", "p", "p", "s", "s", "", "s", "s", "s", "k", "t", "p", ""];
const HANGUL_LAST = ["", "k", "k", "ks", "n", "ns", "n", "t", "r", "rk", "rm", "rp", "rs", "rt", "rp", "r", "m", "p", "ps", "s", "s", "n", "s", "s", "k", "t", "p", ""];

function hangulBones(text: string): string {
  // 풀이 끝의 꼴(-하다·-다·-의·-한·-으로)은 소리가 아니라 꼴 — 떼고 견준다(피하다·만나다가 avoid·meet로 잡히던 것).
  const stem = text.trim().replace(/(하다|되다|하는|적인|으로|다|의|한|인|로)$/u, "");
  let out = "";
  for (const ch of stem) {
    const code = ch.codePointAt(0)! - 0xac00;
    if (code < 0 || code > 11171) continue;
    out += HANGUL_FIRST[Math.floor(code / 588)]! + HANGUL_LAST[code % 28]!;
  }
  return out;
}

// 가나: 가타카나로 맞춘 뒤 행으로.
const KANA_ROWS: [string, string][] = [
  ["カキクケコガギグゲゴ", "k"],
  ["サスセソザズゼゾシジチツヂヅ", "s"],
  ["タテトダデド", "t"],
  ["ナニヌネノン", "n"],
  ["バビブベボパピプペポフヴ", "p"],
  ["マミムメモ", "m"],
  ["ラリルレロ", "r"],
];

function kanaBones(text: string): string {
  let out = "";
  for (const raw of text) {
    const code = raw.codePointAt(0)!;
    const ch = code >= 0x3041 && code <= 0x3096 ? String.fromCodePoint(code + 0x60) : raw;
    const row = KANA_ROWS.find(([letters]) => letters.includes(ch));
    if (row) out += row[1];
  }
  return out;
}

const ARABIC: Record<string, string> = {
  ب: "p", ف: "p", پ: "p", ڤ: "p",
  ك: "k", ق: "k", غ: "k", گ: "k",
  ت: "t", ط: "t", د: "t", ض: "t",
  س: "s", ص: "s", ز: "s", ث: "s", ذ: "s", ش: "s", ج: "s", ظ: "s",
  ر: "r", ل: "r",
  م: "m", ن: "n",
};

const CYRILLIC: Record<string, string> = {
  б: "p", п: "p", ф: "p", в: "p",
  к: "k", г: "k", х: "k",
  с: "s", з: "s", ж: "s", ш: "s", щ: "s", ч: "s", ц: "s",
  т: "t", д: "t",
  р: "r", л: "r",
  м: "m", н: "n",
};

function mapBones(text: string, table: Record<string, string>): string {
  let out = "";
  for (const ch of text.toLocaleLowerCase()) out += table[ch] ?? "";
  return out;
}

/** 글자에 맞춰 자음 뼈대(m·n은 한 칸 — 받침·ン이 뒤 소리에 따라 바뀜, 같은 자음이 이어지면 하나). 판단할 수 없는 글자(한자·태국·데바나가리)가 섞이면 null. */
export function soundBones(text: string): string | null {
  const raw = rawBones(text);
  return raw === null ? null : raw.replace(/m/g, "n").replace(/(.)\1+/g, "$1");
}

function rawBones(text: string): string | null {
  if (/[\p{Script=Han}\p{Script=Thai}\p{Script=Devanagari}]/u.test(text)) return null;
  if (/\p{Script=Hangul}/u.test(text)) return hangulBones(text);
  if (/[\p{Script=Hiragana}\p{Script=Katakana}]/u.test(text)) return kanaBones(text);
  if (/\p{Script=Arabic}/u.test(text)) return mapBones(text, ARABIC);
  if (/\p{Script=Cyrillic}/u.test(text)) return mapBones(text, CYRILLIC);
  if (/\p{Script=Latin}/u.test(text)) return latinBones(text);
  return null;
}

function commonRun(a: string, b: string): number {
  // 가장 긴 공통 부분 수열(순서 유지).
  const row = new Array<number>(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i += 1) {
    let prev = 0;
    for (let j = 1; j <= b.length; j += 1) {
      const keep = row[j]!;
      row[j] = a[i - 1] === b[j - 1] ? prev + 1 : Math.max(row[j]!, row[j - 1]!);
      prev = keep;
    }
  }
  return row[b.length]!;
}

/**
 * 뜻 풀이가 단어 소리를 그대로 적은 것인가. 뜻 풀이는 뜻 하나라도 그러면 참("마이크, 확성기"의 마이크).
 * 같은 차례로 겹치는 자음으로 견준다(아래 줄).
 */
export function soundsAlike(word: string, gloss: string): boolean {
  const mine = soundBones(word);
  if (!mine || mine.length < 2) return false;
  return gloss
    .split(/[,;，、；/()（）]/u)
    .map((part) => part.trim())
    .filter(Boolean)
    .some((part) => {
      const theirs = soundBones(part);
      if (!theirs || theirs.length < 2) return false;
      const same = commonRun(mine, theirs);
      const long = Math.max(mine.length, theirs.length);
      // 자음 둘뿐인 짧은 말: 한글 풀이는 짧은 고유어와 우연히 겹쳐서(neck·목, along·함께) 보지 않고, 그 밖엔 단어 뼈대가 풀이에 다 들어 있고 하나만 더 있을 때(TV·テレビ).
      if (mine.length < 3 || theirs.length < 3) return !/\p{Script=Hangul}/u.test(part) && same === mine.length && long - mine.length <= 1;
      // 단어 뼈대가 풀이에 다 들어 있으면(풀이가 길게 옮김, テレビ·텔레비전) 긴 쪽의 60%, 아니면 짧은 쪽 80%·긴 쪽 75%.
      if (same === mine.length) return same / long >= 0.6;
      return same / Math.min(mine.length, theirs.length) >= 0.8 && same / long >= 0.75;
    });
}
