"use client";

import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { BodyLayer } from "@/components/FullScreenLayer";
import { apiUrl } from "@/lib/apiBase";
import { checkStoreUpdate, startUpdate } from "@/lib/appUpdate";
import { ensureBillingReady, entitlementHeaders } from "@/lib/billing/billingService";
import type { FeedbackNews } from "@/lib/feedbackFix";
import { fixCopy } from "@/lib/feedbackFixCopy";

/**
 * 앱을 열 때 한 번: "보내주신 의견이 반영됐어요" + 고치기 전·후 그림(앱 언어).
 * 서버는 보여 준 소식을 지운다(src/lib/server/feedbackFixStore.ts). 이 빌드에 아직 없는
 * 반영이면 "업데이트하면 볼 수 있어요"와 업데이트 버튼.
 */
async function fetchNews(locale: string): Promise<FeedbackNews[]> {
  const native = Capacitor.isNativePlatform();
  // RevenueCat id가 잡힌 뒤에 물어야 이 기기로 보낸 의견을 찾는다.
  if (native) await ensureBillingReady().catch(() => null);
  const response = await fetch(apiUrl(`/api/feedback/news?ui=${encodeURIComponent(locale)}&native=${native ? 1 : 0}`), {
    headers: entitlementHeaders(),
  });
  if (!response.ok) return [];
  const data = (await response.json().catch(() => ({}))) as { news?: FeedbackNews[] };
  return Array.isArray(data.news) ? data.news : [];
}

function Shot({ src, label }: { src: string | null; label: string }) {
  const [broken, setBroken] = useState(false);
  return (
    <figure className="min-w-0">
      <figcaption className="mb-1 text-caption font-medium text-slate-400">{label}</figcaption>
      {src && !broken ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={apiUrl(src)}
          alt={label}
          loading="lazy"
          onError={() => setBroken(true)}
          className="w-full rounded-lg border border-line bg-surface-sunk object-contain"
        />
      ) : (
        <div className="aspect-[9/16] w-full rounded-lg border border-line bg-surface-sunk" />
      )}
    </figure>
  );
}

export function FeedbackFixedSheet({ locale }: { locale: string }) {
  const t = fixCopy(locale);
  const [news, setNews] = useState<FeedbackNews[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let alive = true;
    void fetchNews(locale).then(
      (rows) => {
        if (alive && rows.length) setNews(rows);
      },
      () => {},
    );
    return () => {
      alive = false;
    };
    // 앱을 열 때 한 번만. 언어를 바꿔도 다시 묻지 않는다(서버가 이미 지웠음).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const item = news[index];
  if (!item) return null;
  const close = () => (index + 1 < news.length ? setIndex(index + 1) : setNews([]));
  const update = async () => {
    const store = await checkStoreUpdate().catch(() => null);
    await startUpdate(store);
  };

  return (
    <BodyLayer>
      <div className="fixed inset-0 z-[81] flex items-end justify-center bg-black/60 p-3 sm:items-center" onClick={close}>
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.title}
          className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl border border-line bg-surface p-4"
          onClick={(event) => event.stopPropagation()}
        >
          <p className="text-title font-semibold text-ink">💬 {t.title}</p>
          {item.text ? (
            <p className="mt-1.5 text-body text-slate-200" dir="auto">
              {item.text}
            </p>
          ) : null}
          {item.before || item.after ? (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Shot src={item.before} label={t.before} />
              <Shot src={item.after} label={t.after} />
            </div>
          ) : null}
          {item.needsUpdate ? (
            <p className="mt-3 rounded-lg border border-info/30 bg-info/15 px-3 py-2 text-note text-info">
              {t.needsUpdate.replace("{v}", item.appVersion)}
            </p>
          ) : null}
          <p className="mt-3 text-caption text-slate-400">{t.thanks}</p>
          <div className="mt-3 flex gap-2">
            {item.needsUpdate ? (
              <button type="button" onClick={() => void update()} className="tb-btn flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold">
                {t.update}
              </button>
            ) : null}
            <button
              type="button"
              onClick={close}
              className={`${item.needsUpdate ? "border border-line text-ink" : "tb-btn"} flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold`}
            >
              {t.ok}
            </button>
          </div>
        </div>
      </div>
    </BodyLayer>
  );
}
