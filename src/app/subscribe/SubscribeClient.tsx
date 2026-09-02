"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePremium } from "@/contexts/PremiumContext";

export function SubscribePage() {
  const router = useRouter();
  const { isBillingNative, ensureBillingReady, purchasePremium } = usePremium();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handlePurchase = async () => {
    if (!isBillingNative) {
      setNotice("앱에서 결제를 진행할 수 있어요.");
      return;
    }

    setIsPurchasing(true);
    setNotice(null);
    try {
      const billing = await ensureBillingReady();
      if (!billing.ready) {
        setNotice("결제를 완료하지 못했어요. 다시 시도해 주세요.");
        return;
      }

      const result = await purchasePremium();
      if (result.status === "success") {
        setNotice("프리미엄이 활성화됐어요.");
        return;
      }

      if (result.status === "cancelled") {
        setNotice("결제가 취소됐어요.");
      } else if (result.message?.startsWith("BILLING_TIMEOUT:")) {
        setNotice(
          "결제 연결 시간이 초과됐어요. Play 스토어에서 설치한 앱인지 확인 후 다시 시도해 주세요.",
        );
      } else if (result.message === "NO_PACKAGE") {
        setNotice("결제 상품을 불러오지 못했어요. 다시 시도해 주세요.");
      } else {
        setNotice("결제를 완료하지 못했어요. 다시 시도해 주세요.");
      }
    } catch {
      setNotice("결제를 완료하지 못했어요. 다시 시도해 주세요.");
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center bg-white/5 p-4">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-100">프리미엄으로 영상 학습하기</h1>
        <p className="mt-2 text-lg font-medium text-slate-100">월 9,900원</p>
        <p className="mt-3 text-sm text-slate-300">
          무료는 이번 달 라이브러리 중 3편을 체험할 수 있어요.
          프리미엄은 월 라이브러리 전체와, 직접 가져온 영상 80포인트(3분=1포인트)를
          줍니다. 라이브러리와 저장한 영상은 포인트가 나가지 않아요.
        </p>

        <div className="mt-6 space-y-2">
          <button
            type="button"
            onClick={handlePurchase}
            disabled={isPurchasing}
            className="w-full rounded-lg bg-[#e8e8e4] shadow-[0_0_12px_rgba(255,255,255,0.22)] px-4 py-2 text-sm font-medium text-neutral-900"
          >
            {isPurchasing ? "결제 진행 중..." : "월 9,900원으로 시작하기"}
          </button>
          {notice ? <p className="text-center text-sm text-slate-300">{notice}</p> : null}
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full rounded-lg border border-white/15 bg-[#121212] px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
          >
            이전 페이지로 돌아가기
          </button>
        </div>
      </section>
    </main>
  );
}
