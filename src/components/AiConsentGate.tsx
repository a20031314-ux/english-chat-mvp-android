"use client";

import { useState, useSyncExternalStore } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import { aiConsentRequired, PRIVACY_POLICY_URL } from "@/lib/platform";
import type { UICopy } from "@/lib/copy";

/**
 * AI 데이터 동의(애플 심사 5.1.2(i), 2025-11 — 개인 데이터를 제3자 AI로 보내기 전에 밝히고 동의받기).
 * iOS 앱에서 처음 열 때 한 번, 무엇을(글·사진·목소리) 누구에게(OpenAI, 미국) 보내는지 보여 주고
 * 동의를 받는다. 동의는 이 기기에 저장되고 서버로 가지 않는다. 동의 전에는 앱 화면을 가린다 —
 * 앱의 대부분이 AI 대화라 동의 없이 쓸 수 있는 부분이 거의 없다.
 */
const CONSENT_KEY = "aiDataConsent";

function readConsent(): boolean {
  try {
    return Boolean(globalThis.localStorage?.getItem(CONSENT_KEY));
  } catch {
    return false;
  }
}

const noSubscribe = () => () => {};

export function AiConsentGate({ ui, dir }: { ui: UICopy; dir: "ltr" | "rtl" }) {
  const needed = useSyncExternalStore(noSubscribe, () => aiConsentRequired() && !readConsent(), () => false);
  const [agreed, setAgreed] = useState(false);
  if (!needed || agreed) return null;
  const agree = () => {
    try {
      globalThis.localStorage?.setItem(CONSENT_KEY, new Date().toISOString());
    } catch {
      // 저장이 막혀도 이번에는 넘어간다(다음 실행에 다시 묻는다).
    }
    setAgreed(true);
  };
  return (
    <BodyLayer>
      <div dir={dir} className="fixed inset-0 z-[90] flex items-end justify-center bg-black/80 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="ai-consent-title">
        <div className="w-full max-w-md rounded-t-2xl border border-white/10 bg-surface px-5 pb-8 pt-6 sm:rounded-2xl">
          <h2 id="ai-consent-title" className="text-lg font-semibold text-white">
            {ui.aiConsentTitle}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{ui.aiConsentBody}</p>
          <a
            href={PRIVACY_POLICY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm text-slate-400 underline underline-offset-4"
          >
            {ui.roleplayDataNoticeMore}
          </a>
          <button
            type="button"
            onClick={agree}
            className="mt-5 w-full rounded-xl bg-platinum px-4 py-3 text-sm font-medium text-slate-900 hover:bg-platinum-hover"
          >
            {ui.aiConsentAgree}
          </button>
        </div>
      </div>
    </BodyLayer>
  );
}
