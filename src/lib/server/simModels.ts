import { AsyncLocalStorage } from "async_hooks";

/**
 * 점검 사용자(`simcheck-…`)에게만, 이 요청에서 실제로 부른 글 모델을 응답 머리글 `x-sim-models`로 알려 준다(2026-10-22).
 * 운영에 Vercel `MODEL_ROUTES`를 넣었을 때 어느 기능이 어느 모델로 가는지 바깥에서 확인하려고 — 실제 사용자 응답에는 붙지 않는다.
 * `meterRequest`가 요청 첫머리에서 켜고, `llm.ts` `completeChat`이 부를 때마다 적고, `cors.ts` `jsonWithCors`가 머리글로 붙인다.
 */
const used = new AsyncLocalStorage<string[]>();

export function trackSimModels(userId: string): void {
  if (/^(rc:)?simcheck-/.test(userId)) used.enterWith([]);
}

export function noteSimModel(entry: string): void {
  used.getStore()?.push(entry);
}

export function simModelsHeader(): string | null {
  const list = used.getStore();
  return list && list.length ? [...new Set(list)].join(", ") : null;
}
