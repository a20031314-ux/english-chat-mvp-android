import { APP_UPDATE_HEADER, type UpdateLevel } from "@/lib/appVersion";
import { appPlatform, storeListingUrl } from "@/lib/platform";

/**
 * Whether this build has been left behind, as the server sees it.
 *
 * The server answers every request with its verdict (appVersion.ts). Nothing
 * asks for it on its own: the level is picked up from responses the app was
 * making anyway, so knowing it costs no round trip and no battery.
 *
 * Why it exists at all: testers arrive through a reciprocal-testing service and
 * there is no way to reach them. No mailing list, no notice, no support thread.
 * If a build has to be replaced, the only voice the app has is its own, and
 * this is it.
 *
 * Kept in module scope rather than in React state because the responses that
 * carry it are made from all over the app, most of them nowhere near a
 * component that could hold the answer.
 */

let level: UpdateLevel = "none";
const listeners = new Set<(level: UpdateLevel) => void>();

/**
 * Read the verdict off a response and remember it.
 *
 * Only ever moves in one direction within a session: "required" does not become
 * "available" because some other route answered first. A deploy that lowers the
 * bar reaches the app on its next start, which is soon enough for good news.
 */
export function noteUpdateLevel(response: { headers: { get(name: string): string | null } }) {
  const heard = response.headers.get(APP_UPDATE_HEADER);
  if (heard !== "available" && heard !== "required") return;
  if (level === "required" || heard === level) return;
  level = heard;
  for (const listener of listeners) listener(level);
}

export function updateLevel(): UpdateLevel {
  return level;
}

export function watchUpdateLevel(listener: (level: UpdateLevel) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Send them where the update actually comes from.
 *
 * The store listing, not a file: Play owns the install, and on a device that
 * got the app from Play this opens the Play app on the right page.
 */
export function openStoreListing() {
  try {
    // 안드로이드는 Play, iOS는 App Store 등록 페이지(`lib/platform.ts`).
    window.open(storeListingUrl(), "_blank");
  } catch {
    // A WebView that refuses to open a window leaves the banner standing, which
    // still says what needs doing.
  }
}

/**
 * Play에 새 버전이 있는지, 폰이 직접 묻는다 (2.67부터).
 *
 * 서버 헤더(RECOMMENDED_APP_VERSION)는 사람이 출시 뒤 숫자를 올려야 움직여서,
 * 출시를 해도 배너가 안 뜨는 일이 있었다. Play의 인앱 업데이트 확인은 이 폰이
 * 지금 받을 수 있는 빌드가 있는지를 그대로 알려 준다 — 단계적 출시도, 내부
 * 테스트 트랙도 그 폰 기준이다. 그래서 출시마다 아무도 손대지 않아도 뜬다.
 *
 * null: 물어볼 수 없음(웹, 플러그인 없는 옛 빌드, Play 없는 기기, 사이드로드).
 * 그때는 서버 헤더로 판단한다.
 */
export type StoreUpdate = {
  available: boolean;
  /** Play versionCode of the build on offer. */
  code: number | null;
  /** Play's own full-screen update flow can run. */
  immediate: boolean;
};

export async function checkStoreUpdate(): Promise<StoreUpdate | null> {
  if (appPlatform() !== "android") return null;
  try {
    const { AppUpdate, AppUpdateAvailability } = await import("@capawesome/capacitor-app-update");
    const info = await AppUpdate.getAppUpdateInfo();
    if (info.updateAvailability === AppUpdateAvailability.UNKNOWN) return null;
    const code = Number.parseInt(info.availableVersionCode ?? "", 10);
    const current = Number.parseInt(info.currentVersionCode ?? "", 10);
    const available =
      info.updateAvailability === AppUpdateAvailability.UPDATE_AVAILABLE &&
      (!Number.isFinite(code) || !Number.isFinite(current) || code > current);
    return {
      available,
      code: Number.isFinite(code) ? code : null,
      immediate: info.immediateUpdateAllowed === true,
    };
  } catch {
    // 플러그인이 없는 빌드(웹 번들만 새것), Play 서비스 없음, 사이드로드 설치.
    return null;
  }
}

/**
 * 업데이트 시작: Play의 앱 안 업데이트 화면(받고 나면 앱이 다시 켜짐),
 * 안 되면 Play 앱의 이 앱 페이지.
 */
export async function startUpdate(store: StoreUpdate | null): Promise<void> {
  if (store?.immediate) {
    try {
      const { AppUpdate, AppUpdateResultCode } = await import("@capawesome/capacitor-app-update");
      const result = await AppUpdate.performImmediateUpdate();
      if (result.code === AppUpdateResultCode.OK || result.code === AppUpdateResultCode.CANCELED) return;
    } catch {
      // 아래로.
    }
  }
  if (appPlatform() === "android") {
    try {
      const { AppUpdate } = await import("@capawesome/capacitor-app-update");
      await AppUpdate.openAppStore();
      return;
    } catch {
      // 아래로.
    }
  }
  openStoreListing();
}
