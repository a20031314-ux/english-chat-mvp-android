/**
 * 친 답 다시 보기(2026-10-30 사용자 "타이핑해서 맞추는 식" — 정해진 꼴과 글자가 달라도 맞는 답: I do not ↔ I don't, 한자 대신 가나 등).
 * 기기 채점(quiz.ts typedRight)이 틀림이라 할 때만 서버(/api/curriculum/typed-check, Haiku)에 한 번 묻는다. 헷갈리는 오답 그대로 친 것은 묻지 않는다.
 * 친 글은 판단에만 쓰고 서버에 남기지 않는다. 같은 물음은 이 화면이 떠 있는 동안 한 번만.
 */
import { apiUrl } from "../apiBase.ts";

export type TypedCheck = {
  language: string;
  /** blank: ___가 든 문장 + 빈칸에 들어갈 말 · fix: 틀린 문장 + 고친 문장(바른 것) + 학습자가 고친 문장. */
  kind: "blank" | "fix";
  sentence: string;
  answer: string;
  typed: string;
  /** 뜻 줄 없이 낸 빈칸(2026-10-31) — 문맥에 맞는 다른 말도 받는다. */
  open?: boolean;
};

const asked = new Map<string, Promise<boolean>>();

export function recheckTyped(input: TypedCheck, headers: Record<string, string> = {}): Promise<boolean> {
  const id = JSON.stringify(input);
  const before = asked.get(id);
  if (before) return before;
  const made = (async () => {
    try {
      const response = await fetch(apiUrl("/api/curriculum/typed-check"), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(input),
      });
      if (!response.ok) return false;
      const body = (await response.json()) as { ok?: boolean };
      return body.ok === true;
    } catch {
      return false;
    }
  })();
  asked.set(id, made);
  return made;
}
