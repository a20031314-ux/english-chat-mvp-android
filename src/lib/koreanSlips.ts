/**
 * 한국어 학습자 문장에서 모델이 자주 놓치는 실수를 미리 찾는다(규칙, 모델 호출 없음).
 *
 * 가상 사용자 점검(2026-10-21, ko 학습·en 앱): 덥어요·듣어요를 그대로 두거나 "맵어요도 맞다"고 설명,
 * 선생님께 쓴 반말을 그대로 둠. 프롬프트만으로는 거의 안 나아져서, 찾은 것을 채팅 요청에 힌트로 넣고
 * 고친 문장에 틀린 활용이 그대로 남으면 서버가 바로잡는다.
 *
 * 일부러 좁게: 흔한 불규칙 낱말 목록만, 다른 뜻의 규칙 동사와 겹치는 것(굽다·묻다·입다)은 뺀다.
 */

const BASE = 0xac00;
const JUNG = 21;
const JONG = 28;

type Syl = { cho: number; jung: number; jong: number };

function split(ch: string): Syl | null {
  const code = ch.charCodeAt(0) - BASE;
  if (code < 0 || code > 11171) return null;
  return { cho: Math.floor(code / (JUNG * JONG)), jung: Math.floor(code / JONG) % JUNG, jong: code % JONG };
}

function join({ cho, jung, jong }: Syl): string {
  return String.fromCharCode(BASE + (cho * JUNG + jung) * JONG + jong);
}

const JONG_B = 17; // ㅂ
const JONG_D = 7; // ㄷ
const JONG_L = 8; // ㄹ
const JUNG_A = 0; // ㅏ
const JUNG_O = 8; // ㅗ
const JUNG_U = 13; // ㅜ
const JUNG_EO = 4; // ㅓ
const JUNG_WA = 9; // ㅘ
const JUNG_WO = 14; // ㅝ
const CHO_IEUNG = 11; // ㅇ
const CHO_R = 5; // ㄹ

/** ㅂ 불규칙(받침 ㅂ이 모음 앞에서 우/오로). 돕다·곱다만 와. */
const B_STEMS = ["덥", "춥", "맵", "어렵", "쉽", "귀엽", "무섭", "가볍", "무겁", "반갑", "고맙", "즐겁", "아름답", "부럽", "시끄럽", "더럽", "뜨겁", "차갑", "가깝", "싱겁", "아깝", "두껍", "눕", "돕", "곱", "외롭", "새롭", "괴롭", "그립", "밉"];
const WA_STEMS = new Set(["돕", "곱"]);
/** ㄷ 불규칙(받침 ㄷ이 모음 앞에서 ㄹ로). */
const D_STEMS = ["듣", "깨닫", "싣"]; // 걷다는 "걷어(거두다·말아 올리다)"가 맞는 말이라 뺌
/** 르 불규칙(르 + 아/어 → ㄹ라/ㄹ러). */
const R_STEMS = ["부르", "모르", "다르", "빠르", "고르", "기르", "서두르", "자르", "마르", "오르", "흐르", "누르", "게으르"];

export type KoreanSlip = { wrong: string; right: string; rule: "ㅂ" | "ㄷ" | "르" };

/** 받침을 바꾼 마지막 음절 + 뒤에 붙는 모음 시작 어미 음절(어/었/으/은/을/아/았)을 고친 꼴로. */
function bForms(stem: string): Array<[string, string]> {
  const head = stem.slice(0, -1);
  const last = split(stem.at(-1)!)!;
  const open = join({ ...last, jong: 0 });
  const wa = WA_STEMS.has(stem);
  const w = (jong: number) => join({ cho: CHO_IEUNG, jung: wa ? JUNG_WA : JUNG_WO, jong });
  const u = (jong: number) => join({ cho: CHO_IEUNG, jung: JUNG_U, jong });
  const out: Array<[string, string]> = [];
  for (const [suffix, right] of [
    ["어", w(0)],
    ["아", w(0)],
    ["었", w(20)], // ㅆ
    ["았", w(20)],
    ["으", u(0)],
    ["은", u(4)], // ㄴ
    ["을", u(8)], // ㄹ
  ] as const) {
    out.push([stem + suffix, head + open + right]);
  }
  return out;
}

function dForms(stem: string): Array<[string, string]> {
  const head = stem.slice(0, -1);
  const last = split(stem.at(-1)!)!;
  const turned = join({ ...last, jong: JONG_L });
  return ["어", "었", "으", "은", "을", "아", "았"].map((s) => [stem + s, head + turned + s] as [string, string]);
}

function rForms(stem: string): Array<[string, string]> {
  const before = stem.slice(0, -1); // 르 앞
  const prev = split(before.at(-1)!)!;
  const bright = prev.jung === JUNG_A || prev.jung === JUNG_O;
  const withL = before.slice(0, -1) + join({ ...prev, jong: JONG_L });
  const ra = join({ cho: CHO_R, jung: bright ? JUNG_A : JUNG_EO, jong: 0 });
  const rass = join({ cho: CHO_R, jung: bright ? JUNG_A : JUNG_EO, jong: 20 });
  return [
    [stem + "어", withL + ra],
    [stem + "아", withL + ra],
    [stem + "었", withL + rass],
    [stem + "았", withL + rass],
  ];
}

const TABLE: Array<KoreanSlip> = [
  ...B_STEMS.flatMap((s) => bForms(s).map(([wrong, right]) => ({ wrong, right, rule: "ㅂ" as const }))),
  ...D_STEMS.flatMap((s) => dForms(s).map(([wrong, right]) => ({ wrong, right, rule: "ㄷ" as const }))),
  ...R_STEMS.flatMap((s) => rForms(s).map(([wrong, right]) => ({ wrong, right, rule: "르" as const }))),
].sort((a, b) => b.wrong.length - a.wrong.length);

/** 문장에서 찾은 틀린 불규칙 활용(긴 것부터, 겹치지 않게). */
export function findIrregularSlips(text: string): KoreanSlip[] {
  const found: KoreanSlip[] = [];
  let rest = text.normalize("NFC");
  for (const slip of TABLE) {
    if (!rest.includes(slip.wrong)) continue;
    // 낱말 첫머리여야 한다(앞 글자가 한글이면 다른 낱말의 일부 — 예: 걷 앞에 다른 음절).
    const re = new RegExp(`(^|[^\\uac00-\\ud7a3])${slip.wrong}`, "u");
    if (!re.test(rest)) continue;
    found.push(slip);
    rest = rest.split(slip.wrong).join(" ");
  }
  return found;
}

/** 고친 문장에 틀린 활용이 남아 있으면 바로잡는다. */
export function repairIrregularSlips(corrected: string, slips: KoreanSlip[]): string {
  let out = corrected;
  for (const slip of slips) out = out.split(slip.wrong).join(slip.right);
  return out;
}

const RESPECT = /(선생님|교수님|할머니|할아버지|사장님|부장님|팀장님|과장님|어머님|아버님|손님|고객님|선배님|원장님|박사님)/u;
const POLITE_END = /(요|니다|니까|세요|셔요|시죠|죠|까요|소서|습니까)\s*[.?!~…]*\s*$/u;

/** 높여야 할 사람을 부르거나 그 사람에게 말하면서 문장을 반말로 끝냈나. */
export function casualToElder(text: string): string | null {
  const m = RESPECT.exec(text);
  if (!m) return null;
  const sentences = text.split(/(?<=[.?!])\s+/u).map((s) => s.trim()).filter(Boolean);
  const casual = sentences.some((s) => /\p{Script=Hangul}/u.test(s) && !POLITE_END.test(s));
  return casual ? m[1] : null;
}

/** 채팅 요청에 붙일 힌트(영어 — 모델에게만, 화면에는 안 나감). 찾은 게 없으면 "". */
export function koreanSlipHint(text: string): string {
  const parts: string[] = [];
  const slips = findIrregularSlips(text);
  if (slips.length) {
    parts.push(
      `Irregular conjugation slips in the message (fix them in corrected and say which irregular rule in the explanation): ${slips
        .map((s) => `${s.wrong}… → ${s.right}… (${s.rule} irregular)`)
        .join("; ")}.`,
    );
  }
  const elder = casualToElder(text);
  if (elder) {
    parts.push(
      `They are speaking to or about ${elder} in 반말. That needs respect: make corrected 해요체 with -(으)시- where it belongs and a request instead of a command, keep "저" for "I", and keep natural respectful too.`,
    );
  }
  return parts.join(" ");
}
