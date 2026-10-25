"use client";

import { PRIVACY_POLICY_URL, subscriptionStoreName, subscriptionTermsUrl, turnDiagnosticsEnabled, voiceCallAvailable } from "@/lib/platform";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const noSubscribe = () => () => {};
/** 통화가 없는 빌드(iOS 1차)에서는 통화 시간·포인트·추가 팩(모두 통화에 쓰임)을 보이지도 팔지도 않는다. */
function useCallBuilt(): boolean {
  return useSyncExternalStore(noSubscribe, voiceCallAvailable, () => true);
}
import { usePremium } from "@/contexts/PremiumContext";
import { apiUrl } from "@/lib/apiBase";
import {
  billingDiagnostics,
  isLocalPlanDebugEnabled,
  OTHER_STORE_PREFIX,
  entitlementHeaders,
  fetchPlanFromServer,
  fetchPlanOffers,
  resetBillingConfigure,
  type PlanOffer,
  fetchPointBalance,
} from "@/lib/billing/billingService";
import { formatPoints } from "@/lib/billing/points";
import { FREE_CATALOG_TRIAL_COUNT, FREE_DAILY_CHAT_LIMIT } from "@/lib/billing/config";
import { PAID_TIERS, termsFor, type PlanTier } from "@/lib/billing/plans";
import { monthlyImportPoints } from "@/lib/billing/videoPrep";
import { PointsIcon } from "@/components/PointsIcon";
import { PointStore } from "@/components/PointStore";
import {
  getImportPointsUsed,
  IMPORT_QUOTA_CHANGED_EVENT,
} from "@/lib/billing/videoPrepQuota";
import type { Locale, UICopy } from "@/lib/copy";

type BillingUiValue = {
  isOpen: boolean;
  openBilling: () => void;
  closeBilling: () => void;
};

const BillingUiContext = createContext<BillingUiValue | null>(null);

/** A plan's name in the interface language. */
export function planName(tier: PlanTier, ui: UICopy): string {
  if (tier === "lite") return ui.planLiteName;
  if (tier === "plus") return ui.planPlusName;
  if (tier === "premium") return ui.billingPremiumLabel;
  return ui.billingFreeLabel;
}

type PlanSummary = {
  dailyCallMinutes: number | null;
  dailyChat: number | null;
  libraryOpen: boolean;
  extraPacks: number;
  monthlyGrantPoints: number;
};

/** What a plan gives, one short line each, from the server's terms. */
function planLines(terms: PlanSummary, ui: UICopy, callBuilt = true): string[] {
  const lines: string[] = [];
  if (callBuilt && terms.dailyCallMinutes !== null) {
    lines.push(ui.planLineCall.replace("{minutes}", String(terms.dailyCallMinutes)));
  }
  if (callBuilt && terms.monthlyGrantPoints > 0) {
    lines.push(ui.planLinePoints.replace("{points}", String(terms.monthlyGrantPoints)));
  }
  lines.push(
    terms.dailyChat === null ? ui.planLineChatUnlimited : ui.planLineChat.replace("{n}", String(terms.dailyChat)),
  );
  lines.push(
    terms.libraryOpen
      ? ui.planLineLibrary
      : ui.planLineLibraryTrial.replace("{n}", String(FREE_CATALOG_TRIAL_COUNT)),
  );
  if (callBuilt && terms.extraPacks > 0) lines.push(ui.planLineExtraPacks.replace("{n}", String(terms.extraPacks)));
  return lines;
}

/** 결제 화면 틀 밖에서도 쓰는 곳(아이콘 사기 등): 없으면 null. */
export function useBillingUiOptional(): BillingUiValue | null {
  return useContext(BillingUiContext);
}

export function useBillingUi() {
  const value = useContext(BillingUiContext);
  if (!value) {
    throw new Error("useBillingUi must be used within BillingUiProvider");
  }
  return value;
}

export function BillingOpenButton({ ui }: { ui: UICopy }) {
  const { openBilling } = useBillingUi();
  const { isPremium, tier } = usePremium();
  const callBuilt = useCallBuilt();
  return (
    <div className="ml-auto flex items-center gap-2">
      {callBuilt ? <HeaderImportPoints ui={ui} onOpen={openBilling} /> : null}
      <button
        type="button"
        onClick={openBilling}
        className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-100 hover:bg-white/10"
      >
        {isPremium ? planName(tier, ui) : ui.billingOpen}
      </button>
    </div>
  );
}

function HeaderImportPoints({
  ui,
  onOpen,
}: {
  ui: UICopy;
  onOpen: () => void;
}) {
  const { isPremium, tier } = usePremium();
  const [used, setUsed] = useState(0);
  // 유료면 서버 잔액(소수, 산 포인트 포함)을 보여 준다. 못 받으면 기기 기록(이번 달 지급분 - 쓴 것).
  const [server, setServer] = useState<number | null>(null);

  useEffect(() => {
    const refresh = () => {
      setUsed(getImportPointsUsed());
      if (isPremium) void fetchPointBalance().then(setServer);
      else setServer(null);
    };
    refresh();
    window.addEventListener(IMPORT_QUOTA_CHANGED_EVENT, refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener(IMPORT_QUOTA_CHANGED_EVENT, refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [isPremium]);

  // Only premium's old terms grant points each month (billing/plans.ts).
  const grant = tier === "premium" ? termsFor("premium").monthlyGrantPoints : monthlyImportPoints(false);
  const remaining = formatPoints(isPremium && server !== null ? server : Math.max(0, (isPremium ? grant : 0) - used));
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={ui.headerImportPoints.replace("{remaining}", remaining)}
      className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[11px] font-medium text-slate-100 hover:bg-white/10"
    >
      <PointsIcon />
      <span className="tabular-nums">{remaining}</span>
    </button>
  );
}

export function BillingUiProvider({
  locale,
  ui,
  children,
}: {
  locale: Locale;
  ui: UICopy;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const openBilling = useCallback(() => setIsOpen(true), []);
  const closeBilling = useCallback(() => setIsOpen(false), []);
  const value = useMemo(
    () => ({ isOpen, openBilling, closeBilling }),
    [isOpen, openBilling, closeBilling],
  );

  return (
    <BillingUiContext.Provider value={value}>
      {children}
      <BillingScreen
        isOpen={isOpen}
        locale={locale}
        ui={ui}
        onClose={closeBilling}
      />
    </BillingUiContext.Provider>
  );
}

export function BillingScreen({
  isOpen,
  locale,
  ui,
  onClose,
}: {
  isOpen: boolean;
  locale: Locale;
  ui: UICopy;
  onClose: () => void;
}) {
  const callBuilt = useCallBuilt();
  const {
    isPremium,
    tier,
    isBillingNative,
    ensureBillingReady,
    purchasePremium,
    restorePurchases,
    refreshPremium,
    setPremiumForUi,
  } = usePremium();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  // 진단(TestFlight 전용): 스토어가 실제로 내준 상품. 기술 값이라 번역하지 않는다.
  const [storeDiag, setStoreDiag] = useState<string | null>(null);
  // 안드로이드·심사 빌드에서도 볼 수 있게: 위 요금 카드를 다섯 번 누르면 켜진다(숨은 점검, 2026-10-23 — 라이트·플러스가 안 뜨던 것).
  const [diagTaps, setDiagTaps] = useState(0);
  const showStoreDiag = turnDiagnosticsEnabled() || diagTaps >= 5;
  useEffect(() => {
    if (!isOpen || !showStoreDiag) return;
    let cancelled = false;
    void billingDiagnostics().then((text) => {
      if (!cancelled) setStoreDiag(text);
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen, showStoreDiag]);
  const [dailyUsed, setDailyUsed] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(FREE_DAILY_CHAT_LIMIT);
  const [offers, setOffers] = useState<PlanOffer[] | null>(null);
  const [plans, setPlans] = useState<Partial<Record<PlanTier, PlanSummary>>>({});
  const [todayLeftSeconds, setTodayLeftSeconds] = useState<number | null>(null);
  const [buying, setBuying] = useState<PlanTier | null>(null);

  // The plans the store sells, priced as it shows them to this person. Off the
  // phone there is no store; every plan is listed so the screen can be seen,
  // and buying says it happens in the app.
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    if (!isBillingNative) {
      setOffers(PAID_TIERS.map((one) => ({ tier: one, priceLabel: null })));
      return;
    }
    void fetchPlanOffers().then((found) => {
      if (!cancelled) setOffers(found);
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen, isBillingNative]);

  useEffect(() => {
    if (!isOpen) return;
    setNotice(null);
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch(apiUrl("/api/entitlement"), {
          headers: entitlementHeaders(isPremium),
        });
        if (!response.ok || cancelled) return;
        const data = (await response.json()) as {
          dailyUsed?: number;
          dailyLimit?: number | null;
          callTodayLeftSeconds?: number | null;
          plans?: Partial<Record<PlanTier, PlanSummary>>;
        };
        if (typeof data.dailyUsed === "number") setDailyUsed(data.dailyUsed);
        if (typeof data.dailyLimit === "number") setDailyLimit(data.dailyLimit);
        setTodayLeftSeconds(typeof data.callTodayLeftSeconds === "number" ? data.callTodayLeftSeconds : null);
        if (data.plans && typeof data.plans === "object") setPlans(data.plans);
      } catch {
        // keep defaults
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isOpen, isPremium]);

  if (!isOpen) return null;

  const busy = isPurchasing || isRestoring;
  const termsOf = (one: PlanTier): PlanSummary => plans[one] ?? termsFor(one);
  const current = termsOf(tier);
  const statusText = !isPremium
    ? ui.planFree.replace("{used}", String(dailyUsed)).replace("{limit}", String(dailyLimit))
    : todayLeftSeconds !== null && current.dailyChat !== null
      ? ui.planStatusDaily
          .replace("{plan}", planName(tier, ui))
          .replace("{left}", String(Math.ceil(todayLeftSeconds / 60)))
          .replace("{used}", String(dailyUsed))
          .replace("{limit}", String(current.dailyChat))
      : ui.planPremium.replace("{limit}", String(current.monthlyGrantPoints));
  // 통화가 없는 빌드: 남은 통화 시간·가져오기 포인트 대신 플랜 이름과 오늘 채팅 수만.
  const shownStatus =
    isPremium && !callBuilt
      ? `${planName(tier, ui)} · ${dailyUsed}/${current.dailyChat ?? "∞"}`
      : statusText;

  const purchaseErrorMessage = (message?: string) => {
    if (!message) return ui.paywallPurchaseFailed;
    if (message.startsWith("BILLING_TIMEOUT:")) return ui.paywallPurchaseTimeout;
    if (message === "NO_PACKAGE") return ui.paywallNoProduct;
    if (message.startsWith(OTHER_STORE_PREFIX)) {
      return ui.paywallOtherStore.replaceAll("{store}", message.slice(OTHER_STORE_PREFIX.length));
    }
    return ui.paywallPurchaseFailed;
  };

  const handlePurchase = async (wanted: Exclude<PlanTier, "free">) => {
    if (!isBillingNative) {
      setNotice(ui.paywallNativeOnly);
      return;
    }
    setIsPurchasing(true);
    setBuying(wanted);
    setNotice(null);
    try {
      let billing = await ensureBillingReady();
      if (!billing.ready) {
        resetBillingConfigure();
        billing = await ensureBillingReady();
      }
      if (!billing.ready) {
        setNotice(ui.paywallPurchaseFailed);
        return;
      }
      const result = await purchasePremium(undefined, wanted);
      if (result.status === "success") {
        setNotice(ui.paywallActivatedToast);
        void refreshPremium();
        return;
      }
      if (result.status === "cancelled") {
        setNotice(ui.paywallCancelled);
        return;
      }
      setNotice(purchaseErrorMessage(result.message));
    } finally {
      setIsPurchasing(false);
      setBuying(null);
    }
  };

  const handleRestore = async () => {
    if (!isBillingNative) {
      // 웹: 앱에서 산 구독을 계정으로 다시 물어본다(서버가 RevenueCat에 확인).
      setIsRestoring(true);
      await fetchPlanFromServer().catch(() => false);
      setIsRestoring(false);
      setNotice(ui.paywallNativeOnly);
      return;
    }
    setIsRestoring(true);
    setNotice(null);
    try {
      const billing = await ensureBillingReady();
      if (!billing.ready) {
        setNotice(ui.paywallPurchaseFailed);
        return;
      }
      const result = await restorePurchases();
      if (result.status === "restored") {
        setNotice(ui.paywallRestoredToast);
        void refreshPremium();
        return;
      }
      if (result.status === "not_found") {
        setNotice(ui.paywallRestoreEmpty);
        return;
      }
      setNotice(ui.paywallPurchaseFailed);
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-black">
      <header className="flex shrink-0 items-center gap-2 border-b border-white/10 px-3 py-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-2 py-1.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
        >
          ← {ui.billingClose}
        </button>
        <h1
          id="billing-screen-title"
          className="text-base font-semibold text-white"
        >
          {ui.billingScreenTitle}
        </h1>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
        <section
          className="mx-auto w-full max-w-md"
          role="dialog"
          aria-labelledby="billing-screen-title"
          lang={locale}
        >
          <div
            className="rounded-2xl border border-white/10 bg-[#121212] px-4 py-4"
            onClick={() => setDiagTaps((n) => n + 1)}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {planName(tier, ui)}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-200">
              {shownStatus}
            </p>
          </div>

          <h2 className="mt-6 text-lg font-semibold text-white">
            {ui.paywallTitle}
          </h2>
          {callBuilt ? (
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {ui.planSubtitle}
            </p>
          ) : null}

          {/* Cheapest first, the plan in use marked. A plan the store does not
              sell yet is not listed (billingService.fetchPlanOffers). */}
          <div className="mt-4 flex flex-col gap-3">
            {(offers ?? []).map((offer) => {
              const mine = isPremium && tier === offer.tier;
              const name = planName(offer.tier, ui);
              return (
                <div
                  key={offer.tier}
                  className={`rounded-2xl border px-4 py-3 ${
                    mine ? "border-emerald-400/40 bg-emerald-400/[0.06]" : "border-white/10 bg-white/5"
                  }`}
                >
                  <p className="text-sm font-semibold text-white">{name}</p>
                  <ul className="mt-1.5 space-y-1 text-[13px] text-slate-300">
                    {planLines(termsOf(offer.tier), ui, callBuilt).map((line) => (
                      <li key={line} className="flex gap-2">
                        <span className="text-slate-500" aria-hidden>
                          ·
                        </span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    disabled={busy || mine}
                    onClick={() => void handlePurchase(offer.tier)}
                    className="mt-3 w-full rounded-xl bg-[#e8e8e4] px-4 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-[#f5f5f3] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {mine
                      ? ui.planCurrent
                      : buying === offer.tier
                        ? ui.paywallPurchasing
                        : offer.priceLabel
                          ? ui.planChoosePrice.replace("{plan}", name).replace("{price}", offer.priceLabel)
                          : ui.planChoose.replace("{plan}", name)}
                  </button>
                </div>
              );
            })}
          </div>
          {callBuilt ? <p className="mt-3 text-[12px] leading-relaxed text-slate-500">{ui.planFootnote}</p> : null}
          {/* 구독 안내(애플 심사 3.1.2): 자동 갱신·해지 방법, 이용약관(iOS는 애플 표준 EULA)·개인정보처리방침. */}
          <p className="mt-2 text-meta leading-relaxed text-slate-500">
            {ui.paywallAutoRenew.replace("{store}", subscriptionStoreName())}
          </p>
          <p className="mt-1 flex flex-wrap gap-x-3 text-meta text-slate-400">
            {subscriptionTermsUrl() ? (
              <a href={subscriptionTermsUrl()!} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                {ui.paywallTermsLink}
              </a>
            ) : null}
            <a href={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
              {ui.roleplayDataNoticeMore}
            </a>
          </p>

          {isLocalPlanDebugEnabled() ? (
            <div className="mt-4 flex overflow-hidden rounded-full border border-white/10 text-[11px] font-medium">
              <button
                type="button"
                onClick={() => setPremiumForUi(false)}
                className={`flex-1 px-3 py-1.5 ${
                  !isPremium
                    ? "bg-[#e8e8e4] text-neutral-900"
                    : "bg-[#121212] text-slate-300 hover:bg-white/10"
                }`}
              >
                {ui.billingFreeLabel}
              </button>
              <button
                type="button"
                onClick={() => setPremiumForUi(true)}
                className={`flex-1 px-3 py-1.5 ${
                  isPremium
                    ? "bg-[#e8e8e4] text-neutral-900"
                    : "bg-[#121212] text-slate-300 hover:bg-white/10"
                }`}
              >
                {ui.billingPremiumLabel}
              </button>
            </div>
          ) : null}

          <div className="mt-5 flex flex-col gap-2">
            {!isBillingNative ? (
              <p className="text-center text-xs text-slate-500">
                {ui.paywallNativeOnly}
              </p>
            ) : null}
            <button
              type="button"
              disabled={busy}
              onClick={() => void handleRestore()}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRestoring ? ui.paywallRestoring : ui.paywallRestore}
            </button>
            {notice ? (
              <p className="text-center text-sm text-slate-300">{notice}</p>
            ) : null}
            {/*
              Below the subscription, because a top-up only makes sense once
              there is a plan whose allowance can run out.
            */}
            {isPremium && callBuilt ? <PointStore ui={ui} /> : null}
            {storeDiag ? (
              <pre dir="ltr" className="whitespace-pre-wrap break-all rounded-lg bg-white/5 p-2 font-mono text-meta text-slate-400">
                {storeDiag}
              </pre>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
