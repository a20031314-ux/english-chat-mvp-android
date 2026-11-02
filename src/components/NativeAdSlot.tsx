"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  NATIVE_REFRESH_MS,
  NATIVE_SLOT_HEIGHT,
  attachNativeSlot,
  nativeAdsEnabled,
  nativeSlotFailed,
  nativeSlotLoaded,
  subscribeAdLayers,
  topAdLayer,
  watchNativeFailures,
} from "@/lib/ads";
import { useAdLayer } from "@/components/FullScreenLayer";
import { adsAvailable } from "@/lib/platform";
import { webAdsAvailable } from "@/lib/webAds";
import { WebAdSlot } from "@/components/WebAdSlot";

/**
 * 네이티브 광고 자리(무료·안드로이드만, `lib/ads.ts`) — 목록 사이와 학습 화면의 빈 공간. 광고는 앱 카드 모양으로 Google SDK가 그리고
 * ("광고" 표시·AdChoices 포함), 이 div는 그 자리만 잡는다. 구독자·웹·iOS·광고 꺼짐이면 아무것도 그리지 않는다.
 * `active`: 이 화면이 지금 보이는지. 안 보이면 자리를 떼어(마지막 자리면 그 화면 광고를 치움) 숨은 탭의 광고가
 * 다른 화면 위에 뜨지 않고, 플러그인의 동시 화면 한도(2개)도 넘지 않는다. 다시 보이면 새 광고를 받는다.
 * 그 밖에 저절로 떼는 때: 이 자리가 든 층(FullScreenLayer·BodyLayer, 바닥 화면 0) 위에 다른 층이 덮였을 때,
 * 키보드가 올라왔을 때(입력칸 바로 아래로 붙지 않게).
 * `spaced`: 누르는 버튼·입력칸과 한 줄 넘게 띄운다(빈 공간 자리, AdMob 잘못 누름 정책).
 * `layerOnly`: 전체 화면 층 안에서만(My 칸처럼 같은 내용이 바닥 화면에도 그려질 때 — 바닥 화면은 배너가 있어 광고 하나).
 */
const noSubscribe = () => () => undefined;

type SlotProps = { feedId: string; slotKey: string; active?: boolean; spaced?: boolean; layerOnly?: boolean };

export function NativeAdSlot(props: SlotProps) {
  // 웹은 같은 자리에 AdSense(WebAdSlot). 판정은 처음 한 번 — 웹/앱은 실행 중에 바뀌지 않는다.
  const web = useSyncExternalStore(noSubscribe, webAdsAvailable, () => false);
  const layer = useAdLayer();
  const top = useSyncExternalStore(subscribeAdLayers, topAdLayer, () => 0);
  const keyboard = useKeyboardOpen();
  if (props.layerOnly && layer === 0) return null;
  const visible = (props.active ?? true) && top === layer && !keyboard;
  if (web) return <WebAdSlot active={visible} spaced={props.spaced} />;
  return <AppAdSlot feedId={props.feedId} slotKey={props.slotKey} active={visible} layer={layer} spaced={props.spaced} />;
}

/** 다음 문제가 그려지고 이만큼 뒤에 새 광고 — "다음"을 누른 손가락이 떨어진 뒤 바뀌게. */
const REFRESH_AFTER_DRAW_MS = 500;

/**
 * 문제 아래 광고의 교체 번호(slotKey 끝에 붙임, 2026-11-01): questionKey(문제 하나의 id)가 바뀔 때, 앞 광고를 붙인 지
 * NATIVE_REFRESH_MS(60초)가 지났으면 하나 올린다(showing = 자리가 보이는 단계 — 보이기 시작한 때부터 잼). 같은 문제 안에서는 바꾸지 않는다. 번호는 새 문제가 그려진 뒤(effect)
 * 한 박자 더 두고 올려, 누른 자리에 새 광고가 바로 뜨지 않게 한다. 자리 높이는 고정(NATIVE_SLOT_HEIGHT)이라 레이아웃은 그대로.
 */
export function useNativeRefresh(questionKey: string, showing = true): number {
  const [round, setRound] = useState(0);
  // 지금 광고를 붙인 때(자리가 보이기 시작한 때·마지막 교체) — 안 보이면 비움.
  const since = useRef<number | null>(null);
  const last = useRef(questionKey);
  useEffect(() => {
    if (!showing) since.current = null;
    else if (since.current === null) since.current = Date.now();
  }, [showing]);
  useEffect(() => {
    if (last.current === questionKey) return;
    last.current = questionKey;
    if (since.current === null || Date.now() - since.current < NATIVE_REFRESH_MS) return;
    const timer = window.setTimeout(() => {
      since.current = Date.now();
      setRound((n) => n + 1);
    }, REFRESH_AFTER_DRAW_MS);
    return () => window.clearTimeout(timer);
  }, [questionKey]);
  return round;
}

/** 키보드가 올라왔는지(보이는 화면 높이가 가장 컸을 때보다 많이 줄면). */
function useKeyboardOpen(): boolean {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const view = typeof window === "undefined" ? null : window.visualViewport;
    if (!view) return;
    let tallest = Math.max(view.height, window.innerHeight);
    const check = () => {
      tallest = Math.max(tallest, view.height);
      setOpen(view.height < tallest * 0.8);
    };
    check();
    view.addEventListener("resize", check);
    return () => view.removeEventListener("resize", check);
  }, []);
  return open;
}

function AppAdSlot({ feedId, slotKey, active, layer, spaced = false }: { feedId: string; slotKey: string; active: boolean; layer: number; spaced?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const failed = useSyncExternalStore(
    watchNativeFailures,
    () => nativeSlotFailed(feedId, slotKey),
    () => false,
  );

  useEffect(() => {
    if (!adsAvailable()) return;
    let cancelled = false;
    void nativeAdsEnabled().then((on) => {
      if (!cancelled) setEnabled(on);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!enabled || failed || !active || !element) return;
    return attachNativeSlot(feedId, slotKey, element, layer);
  }, [enabled, failed, active, feedId, slotKey, layer]);

  const loaded = useSyncExternalStore(
    watchNativeFailures,
    () => nativeSlotLoaded(feedId, slotKey),
    () => false,
  );
  if (!enabled || failed) return null;
  // 자리 높이는 늘 120px — 플러그인(admob native-ad-feed isSupportedSize)이 120px 미만 자리에는 광고를 아예 불러오지 않아
  // 1px로 접어 두면 Loaded가 영영 오지 않는다(2026-11-02 1px 접기 되돌림, 보고함 major). 들어오기 전엔 바깥 여백만 뺀다.
  return <div ref={ref} aria-hidden className={spaced && loaded ? "my-6 w-full" : "w-full"} style={{ height: NATIVE_SLOT_HEIGHT }} />;
}
