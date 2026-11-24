/**
 * 수업 제목의 답 가리기(RULES 11①, 사용자 2026-11-24): 문법 칸 이름에 퀴즈·대화의 답이 그대로 들면(예: "A は B です" — 답 は)
 * 그 단계에서는 답 자리를 ＿로. 띄어 쓰는 글자(라틴·키릴·한글·아랍 등)는 낱말 경계에서만 — "a"가 낱말 속 글자까지 가리지 않게.
 * 띄어 쓰지 않는 글자(가나·한자·타이)는 그대로 찾는다. 긴 답부터. 순수.
 */
export function maskAnswers(title: string, answers: readonly string[]): string {
  const list = [...new Set(answers.map((one) => one.trim()).filter((one) => one && one.length < 20))].sort((a, b) => b.length - a.length);
  return list.reduce((out, answer) => {
    const escaped = answer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const spaceless = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Thai}]/u.test(answer);
    return out.replace(new RegExp(spaceless ? escaped : `(?<![\\p{L}\\p{M}])${escaped}(?![\\p{L}\\p{M}])`, "giu"), "＿");
  }, title);
}
