/**
 * 쓸 기능 고르기(2026-10-21, hub/drafts/feature-modules.md): 사용자가 쓰지 않을 기능을 숨겨 화면을 단순하게.
 *
 * - 고를 수 있는 것: 통화·영상·사람(대화의 1:1·단체방 포함)·Room·노트. AI 채팅과 My(지도)는 늘 켜짐 — 학습 기록의 뿌리.
 * - Room은 사람이 켜져 있어야 켜진다(방은 사람 기능의 일부).
 * - 숨김은 지우기가 아니다: 기록·친구·방은 그대로, 다시 켜면 돌아온다. 이 기기에만 저장한다(계정 저장은 아직).
 * - 새 사용자(처음 설치)는 첫 화면에서 고른다. 아무것도 안 고르고 넘기면 전부 켜짐(사용자 결정 2026-10-21).
 *   예전부터 쓰던 사람은 묻지 않고 전부 켜진 채로 시작한다.
 * - 플랫폼에 아예 없는 기능(iOS 1차의 사람 기능)과 창구 모드(lib/doors.ts)는 여기서 다루지 않는다 — 창구는 창구 탭 그대로.
 */

import { USE_SIGNAL_KEYS, WHATS_NEW_SEEN_KEY } from "./whatsNew.ts";
import type { GuideGo } from "./guide/content.ts";

export type FeatureId = "call" | "video" | "people" | "rooms" | "notes";
export const FEATURE_IDS: FeatureId[] = ["call", "video", "people", "rooms", "notes"];

export type FeatureState = {
  /** 꺼 둔 기능. */
  off: FeatureId[];
  /** false면 첫 화면에서 아직 고르는 중(처음 설치한 사람). */
  chosen: boolean;
};

export const FEATURES_STORAGE_KEY = "appFeatures";

export type FeaturePresetId = "solo" | "video" | "people" | "all";
/** 묶음: 켜는 기능. 고른 뒤 하나씩 바꿀 수 있다. */
export const FEATURE_PRESETS: { id: FeaturePresetId; on: FeatureId[] }[] = [
  { id: "solo", on: ["call", "notes"] },
  { id: "video", on: ["video", "notes"] },
  { id: "people", on: ["call", "people", "rooms", "notes"] },
  { id: "all", on: [...FEATURE_IDS] },
];

export function presetOff(id: FeaturePresetId): FeatureId[] {
  const on = FEATURE_PRESETS.find((preset) => preset.id === id)?.on ?? FEATURE_IDS;
  return FEATURE_IDS.filter((feature) => !on.includes(feature));
}

/** 지금 꺼 둔 기능이 어느 묶음과 같은지(하나씩 바꿨으면 없음). */
export function matchingPreset(off: FeatureId[]): FeaturePresetId | null {
  const key = [...off].sort().join(",");
  return FEATURE_PRESETS.find((preset) => presetOff(preset.id).sort().join(",") === key)?.id ?? null;
}

/** 사용법 장(`go`) → 그 장을 켜고 끄는 기능. 없으면 늘 켜짐(AI 채팅·My). */
export function featureOfGo(go: GuideGo): FeatureId | null {
  switch (go) {
    case "roleplay":
      return "call";
    case "video":
      return "video";
    case "talk":
    case "people":
      return "people";
    case "rooms":
      return "rooms";
    case "notes":
      return "notes";
    default:
      return null;
  }
}

/** 하단 탭·화면 → 그 화면을 쓰는 기능(AppHome 탭 이름). */
export function featureOfTab(tab: string): FeatureId | null {
  switch (tab) {
    case "roleplay":
      return "call";
    case "video":
      return "video";
    case "talk":
    case "messages":
    case "people":
      return "people";
    case "rooms":
      return "rooms";
    case "vocab":
      return "notes";
    default:
      return null;
  }
}

/** 실제로 켜졌는지: Room은 사람이 켜져 있어야. */
export function isFeatureOn(off: readonly FeatureId[], feature: FeatureId): boolean {
  if (off.includes(feature)) return false;
  if (feature === "rooms") return !off.includes("people");
  return true;
}

export function cleanFeatureState(raw: unknown): FeatureState | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as { off?: unknown; chosen?: unknown };
  const off = Array.isArray(row.off) ? FEATURE_IDS.filter((id) => (row.off as unknown[]).includes(id)) : [];
  return { off, chosen: row.chosen !== false };
}

/**
 * 처음 설치인지: 저장된 선택이 없고, 새로워진 점을 본 적도 없고, 앱을 쓴 흔적(USE_SIGNAL_KEYS)도 없다.
 * 새로워진 점 시트가 첫 실행에 "본 버전"을 적어 버리므로, 화면이 그려지기 전(이 모듈을 처음 읽을 때) 한 번만 본다.
 */
export function looksLikeFreshInstall(storage: Pick<Storage, "getItem">): boolean {
  if (storage.getItem(FEATURES_STORAGE_KEY) !== null) return false;
  if (storage.getItem(WHATS_NEW_SEEN_KEY) !== null) return false;
  return !USE_SIGNAL_KEYS.some((key) => storage.getItem(key) !== null);
}

const ALL_ON: FeatureState = { off: [], chosen: true };
let current: FeatureState = ALL_ON;
const listeners = new Set<() => void>();

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function save(next: FeatureState) {
  current = next;
  try {
    storage()?.setItem(FEATURES_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // 저장이 막히면 이번 실행에만.
  }
  listeners.forEach((listener) => listener());
}

function boot() {
  const store = storage();
  if (!store) return;
  try {
    const saved = store.getItem(FEATURES_STORAGE_KEY);
    if (saved !== null) {
      current = cleanFeatureState(JSON.parse(saved)) ?? ALL_ON;
      return;
    }
    // 자동 브라우저(캡처·점검 스크립트, Playwright는 navigator.webdriver)는 묻지 않고 전부 켜짐 —
    // 그 스크립트들은 새 저장소로 열기 때문에 매번 고르기 화면에 막힌다. 고르기 화면을 찍으려면
    // 스크립트가 appFeatures에 {"off":[],"chosen":false}를 넣고 다시 연다.
    const automated = typeof navigator !== "undefined" && navigator.webdriver === true;
    if (!automated && looksLikeFreshInstall(store)) {
      // 고르는 중이라고 바로 적어 둔다: 고르다 앱을 닫아도 다음에 다시 묻는다.
      save({ off: [], chosen: false });
    }
  } catch {
    current = ALL_ON;
  }
}
boot();

export function readFeatures(): FeatureState {
  return current;
}

const SERVER_STATE: FeatureState = ALL_ON;
export function readFeaturesOnServer(): FeatureState {
  return SERVER_STATE;
}

export function subscribeFeatures(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setFeatureOn(feature: FeatureId, on: boolean) {
  const off = new Set(current.off);
  if (on) {
    off.delete(feature);
    // Room을 켜면 사람도 켠다(방은 사람 기능의 일부).
    if (feature === "rooms") off.delete("people");
  } else off.add(feature);
  save({ off: FEATURE_IDS.filter((id) => off.has(id)), chosen: current.chosen });
}

export function applyPreset(id: FeaturePresetId) {
  save({ off: presetOff(id), chosen: current.chosen });
}

/** 첫 화면 끝: 지금 고른 대로(건너뛰기는 전부 켜서). */
export function finishChoosing(skip = false) {
  save({ off: skip ? [] : current.off, chosen: true });
}
