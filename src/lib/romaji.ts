/**
 * 로마자 → 히라가나(일본어 빈칸 쓰기, 2026-10-30 사용자 "타이핑해서 맞추는 식" — 일본어 키보드가 없는 초보도 ga → が로 칠 수 있게).
 * 헵번·훈령 둘 다(shi/si, chi/ti, tsu/tu, fu/hu, ji/zi), 겹자음 → っ, n/nn/n' → ん. 모르는 글자는 그대로 둔다.
 * 순수 모듈 — quiz.ts typedRight가 쓴다.
 */

const TABLE: Record<string, string> = {
  a: "あ", i: "い", u: "う", e: "え", o: "お",
  ka: "か", ki: "き", ku: "く", ke: "け", ko: "こ",
  ga: "が", gi: "ぎ", gu: "ぐ", ge: "げ", go: "ご",
  sa: "さ", si: "し", shi: "し", su: "す", se: "せ", so: "そ",
  za: "ざ", zi: "じ", ji: "じ", zu: "ず", ze: "ぜ", zo: "ぞ",
  ta: "た", ti: "ち", chi: "ち", tu: "つ", tsu: "つ", te: "て", to: "と",
  da: "だ", di: "ぢ", du: "づ", de: "で", do: "ど",
  na: "な", ni: "に", nu: "ぬ", ne: "ね", no: "の",
  ha: "は", hi: "ひ", hu: "ふ", fu: "ふ", he: "へ", ho: "ほ",
  ba: "ば", bi: "び", bu: "ぶ", be: "べ", bo: "ぼ",
  pa: "ぱ", pi: "ぴ", pu: "ぷ", pe: "ぺ", po: "ぽ",
  ma: "ま", mi: "み", mu: "む", me: "め", mo: "も",
  ya: "や", yu: "ゆ", yo: "よ",
  ra: "ら", ri: "り", ru: "る", re: "れ", ro: "ろ",
  la: "ら", li: "り", lu: "る", le: "れ", lo: "ろ",
  wa: "わ", wo: "を", we: "うぇ", wi: "うぃ",
  kya: "きゃ", kyu: "きゅ", kyo: "きょ",
  gya: "ぎゃ", gyu: "ぎゅ", gyo: "ぎょ",
  sha: "しゃ", shu: "しゅ", sho: "しょ", she: "しぇ", sya: "しゃ", syu: "しゅ", syo: "しょ",
  ja: "じゃ", ju: "じゅ", jo: "じょ", je: "じぇ", jya: "じゃ", jyu: "じゅ", jyo: "じょ", zya: "じゃ", zyu: "じゅ", zyo: "じょ",
  cha: "ちゃ", chu: "ちゅ", cho: "ちょ", che: "ちぇ", tya: "ちゃ", tyu: "ちゅ", tyo: "ちょ",
  nya: "にゃ", nyu: "にゅ", nyo: "にょ",
  hya: "ひゃ", hyu: "ひゅ", hyo: "ひょ",
  bya: "びゃ", byu: "びゅ", byo: "びょ",
  pya: "ぴゃ", pyu: "ぴゅ", pyo: "ぴょ",
  mya: "みゃ", myu: "みゅ", myo: "みょ",
  rya: "りゃ", ryu: "りゅ", ryo: "りょ",
  fa: "ふぁ", fi: "ふぃ", fe: "ふぇ", fo: "ふぉ",
  xa: "ぁ", xi: "ぃ", xu: "ぅ", xe: "ぇ", xo: "ぉ", xya: "ゃ", xyu: "ゅ", xyo: "ょ", xtu: "っ", xtsu: "っ",
  "-": "ー",
};

const VOWELS = new Set(["a", "i", "u", "e", "o"]);

/** 글에 로마자가 들었나(일본어 빈칸에서 로마자로 친 것인지). */
export function hasLatin(text: string): boolean {
  return /\p{Script=Latin}/u.test(text);
}

export function romajiToHiragana(input: string): string {
  const text = input.normalize("NFKC").toLocaleLowerCase().replace(/[āâ]/g, "aa").replace(/[īî]/g, "ii").replace(/[ūû]/g, "uu").replace(/[ēê]/g, "ee").replace(/[ōô]/g, "ou");
  let out = "";
  let i = 0;
  while (i < text.length) {
    const ch = text[i]!;
    const next = text[i + 1] ?? "";
    // n: 모음·y가 따르지 않으면 ん(nn·n'도).
    if (ch === "n") {
      if (next === "n") {
        // konnichiwa: ん + に(뒤 n이 모음과 붙음), konban·nn 끝: ん 하나.
        const after = text[i + 2] ?? "";
        out += "ん";
        i += VOWELS.has(after) || after === "y" ? 1 : 2;
        continue;
      }
      if (next === "'") {
        out += "ん";
        i += 2;
        continue;
      }
      if (!VOWELS.has(next) && next !== "y") {
        out += "ん";
        i += 1;
        continue;
      }
    }
    // 겹자음(kk·tt·ss·pp·tch) → っ.
    if (ch === next && /[bcdfghjkmpqrstvwxyz]/.test(ch)) {
      out += "っ";
      i += 1;
      continue;
    }
    if (ch === "t" && text.startsWith("tch", i)) {
      out += "っ";
      i += 1;
      continue;
    }
    let matched = false;
    for (const size of [4, 3, 2, 1]) {
      const piece = text.slice(i, i + size);
      const kana = TABLE[piece];
      if (kana) {
        out += kana;
        i += size;
        matched = true;
        break;
      }
    }
    if (!matched) {
      out += ch;
      i += 1;
    }
  }
  return out;
}

/** 가타카나 → 히라가나, 장음 ー는 앞 글자의 모음으로(코ー히ー ↔ こおひい 비교용). */
export function foldKana(text: string): string {
  const hira = [...text.normalize("NFKC")].map((ch) => {
    const code = ch.codePointAt(0)!;
    return code >= 0x30a1 && code <= 0x30f6 ? String.fromCodePoint(code - 0x60) : ch;
  });
  const vowelOf = (kana: string): string => {
    const row: Record<string, string> = { あ: "あ", い: "い", う: "う", え: "え", お: "お" };
    const romaji = Object.entries(TABLE).find(([, value]) => value === kana)?.[0] ?? "";
    const last = romaji.slice(-1);
    return ({ a: row.あ, i: row.い, u: row.う, e: row.え, o: row.お } as Record<string, string | undefined>)[last] ?? "";
  };
  const out: string[] = [];
  for (const ch of hira) {
    if (ch === "ー" && out.length) {
      const vowel = vowelOf(out[out.length - 1]!);
      // 오 줄 장음은 う로 쓰는 일이 많아(とうきょう) お·う 둘 다 같게 본다 — 비교할 때만.
      out.push(vowel === "お" ? "う" : vowel || ch);
      continue;
    }
    out.push(ch);
  }
  return out.join("");
}

/** 두 일본어 말이 소리(가나)로 같은가 — 장음 표기(ー·う·お) 차이는 봐준다. */
export function sameKana(a: string, b: string): boolean {
  const norm = (text: string) => foldKana(text).replace(/\s+/g, "").replace(/(?<=[こそとのほもよろごぞどぼぽょ])お/g, "う");
  return norm(a) === norm(b);
}
