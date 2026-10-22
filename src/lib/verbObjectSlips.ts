/**
 * 영어 "explain me X"류(사람을 동사 바로 뒤에 두면 안 되는 동사)를 고친 문장으로 올리는 안전망.
 *
 * 왜(2026-10-22, Haiku 운영 확인): 지시문을 고친 뒤에도 "Can you explain me this word?"를 natural에서만
 * "explain this word to me"로 바꾸고 corrected·설명은 그대로 두었다.
 * 감정 형용사(`feelingAdjectives.ts`)와 같은 원칙: **모델이 natural에서 "to + 사람" 꼴로 바꿨을 때만** 올린다.
 *
 * - explain/describe/suggest/introduce + me·us·him·her·them + 무엇 → 동사 + 무엇 + to 사람
 * - 무엇이 의문사 절(what/how/why/where/when/who/which/if/that)이면 → 동사 + to 사람 + 절
 * 영어 학습일 때만 쓴다.
 */

const VERB = "(explain(?:s|ed|ing)?|describ(?:e|es|ed|ing)|suggest(?:s|ed|ing)?|introduc(?:e|es|ed|ing))";
const PERSON = "(me|us|him|her|them)";
const CLAUSE = /^(what|how|why|where|when|who|whom|which|whether|if|that)\b/i;

export type VerbObjectSlip = { verb: string; person: string };

const stemOf = (verb: string) => verb.toLowerCase().replace(/(s|ed|ing|e|es)$/, "").replace(/(s|ed|ing|e|es)$/, "");

export function promoteVerbObjectSlip(
  corrected: string,
  natural: string,
): { corrected: string; slips: VerbObjectSlip[] } | null {
  if (!corrected.trim() || !natural.trim()) return null;
  const pattern = new RegExp(`\\b${VERB}\\s+${PERSON}\\s+([^.?!,;]+?)(\\s*[.?!,;]|$)`, "i");
  const match = corrected.match(pattern);
  if (!match) return null;
  const [, verb, person, what] = match;
  const naturalLow = natural.toLowerCase();
  const stem = stemOf(verb);
  // natural이 같은 동사를 쓰고 "to 사람"으로 고쳤어야 한다 — 다른 말로 바꿔 쓴 natural은 판단 근거가 아니다.
  if (!naturalLow.includes(stem)) return null;
  if (!new RegExp(`\\bto\\s+${person}\\b`, "i").test(natural)) return null;
  if (new RegExp(`\\b${stem}\\w*\\s+${person}\\s`, "i").test(natural)) return null;

  const object = what.trim();
  const fixed = CLAUSE.test(object) ? `${verb} to ${person} ${object}` : `${verb} ${object} to ${person}`;
  const next = corrected.replace(pattern, (_all, _v, _p, _w, tail: string) => fixed + tail);
  return { corrected: next, slips: [{ verb: verb.toLowerCase(), person: person.toLowerCase() }] };
}

/** 앱 언어로 쓴 짧은 설명. 영어 낱말 바로 뒤에 조사를 붙이지 않는다(한국어). */
const EXPLAIN: Record<string, (verb: string, person: string) => string> = {
  ko: (v, p) => `'${v}' 바로 뒤에는 사람을 둘 수 없어요. 사람 앞에 'to' 낱말을 붙여 '${v} … to ${p}' 꼴로 써요.`,
  en: (v, p) => `'${v}' can't take the person straight after it; put 'to' before the person: '${v} … to ${p}'.`,
  es: (v, p) => `Después de '${v}' no puede ir directamente la persona; se pone 'to' delante: '${v} … to ${p}'.`,
  ja: (v, p) => `'${v}'の直後に人は置けません。人の前に'to'を付けて'${v} … to ${p}'の形にします。`,
  zh: (v, p) => `'${v}'后面不能直接接人，要在人前加'to'：'${v} … to ${p}'。`,
  vi: (v, p) => `Sau '${v}' không đặt người ngay được; thêm 'to' trước người: '${v} … to ${p}'.`,
  fr: (v, p) => `Après '${v}', on ne met pas la personne directement ; on ajoute 'to' devant : '${v} … to ${p}'.`,
  pt: (v, p) => `Depois de '${v}' não se coloca a pessoa diretamente; usa-se 'to' antes dela: '${v} … to ${p}'.`,
  id: (v, p) => `Setelah '${v}' orangnya tidak boleh langsung; tambahkan 'to' sebelum orangnya: '${v} … to ${p}'.`,
  it: (v, p) => `Dopo '${v}' non si mette subito la persona; si aggiunge 'to' prima: '${v} … to ${p}'.`,
  ru: (v, p) => `После '${v}' нельзя сразу ставить человека; перед ним нужно 'to': '${v} … to ${p}'.`,
  ar: (v, p) => `لا يأتي الشخص مباشرة بعد '${v}'؛ نضع 'to' قبله: '${v} … to ${p}'.`,
  th: (v, p) => `หลัง '${v}' จะวางคนต่อทันทีไม่ได้ ต้องใส่ 'to' หน้าคน เป็น '${v} … to ${p}'`,
  hi: (v, p) => `'${v}' के ठीक बाद व्यक्ति नहीं आता; व्यक्ति से पहले 'to' लगाते हैं: '${v} … to ${p}'।`,
};

export function explainVerbObjectSlips(slips: VerbObjectSlip[], interfaceLanguage: string): string {
  const write = EXPLAIN[interfaceLanguage] ?? EXPLAIN.en;
  return slips.map(({ verb, person }) => write(verb, person)).join(" ");
}

export const VERB_OBJECT_EXPLAIN_LANGUAGES = Object.keys(EXPLAIN);
