/**
 * 아침 알림(로컬 알림, 2026-10-28 사용자 "잠금화면에 — 아침에 일어나서"): 서버 없이 폰이 앞으로 7일을 예약한다.
 * 앱을 열 때마다(My가 기록을 받은 뒤) 다시 예약 — 며칠 안 열어도 7일까지는 날마다 다른 글.
 * 정확한 시각 알람 권한은 쓰지 않는다(AndroidManifest에서 뺌) — 몇 분 늦어도 되는 알림.
 * 앱 안(안드로이드·iOS)에서만(platform.ts localNotificationsAvailable). 누르면 My.
 */
import { LocalNotifications } from "@capacitor/local-notifications";
import { localNotificationsAvailable } from "./platform";
import type { MorningText } from "./curriculum/morningDigest";

export type MorningSettings = { on: boolean; hour: number; minute: number; words: number };
export const MORNING_WORDS = [3, 5, 10] as const;
const KEY = "morningNotify.v1";
const EVENT = "lb-morning";
const CHANNEL = "morning";
/** 7일 치 알림 id(다시 예약할 때 지운다). */
const IDS = Array.from({ length: 7 }, (_, i) => 7101 + i);
const DEFAULT: MorningSettings = { on: false, hour: 7, minute: 30, words: 5 };

export function readMorning(): MorningSettings {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "null") as Partial<MorningSettings> | null;
    if (!raw) return DEFAULT;
    const hour = Number.isInteger(raw.hour) && raw.hour! >= 0 && raw.hour! < 24 ? raw.hour! : DEFAULT.hour;
    const minute = Number.isInteger(raw.minute) && raw.minute! >= 0 && raw.minute! < 60 ? raw.minute! : DEFAULT.minute;
    const words = MORNING_WORDS.includes(raw.words as 3) ? raw.words! : DEFAULT.words;
    return { on: raw.on === true, hour, minute, words };
  } catch {
    return DEFAULT;
  }
}

export function saveMorning(next: MorningSettings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // 이번 실행에만.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function onMorningChange(listener: () => void): () => void {
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}

/** 켤 때 한 번: 알림 허용(안드로이드 13+·iOS). 거절이면 false. */
export async function allowMorning(): Promise<boolean> {
  if (!localNotificationsAvailable()) return false;
  try {
    const current = await LocalNotifications.checkPermissions();
    if (current.display === "granted") return true;
    const asked = await LocalNotifications.requestPermissions();
    return asked.display === "granted";
  } catch {
    return false;
  }
}

/** 다음 n일의 그 시각(오늘 시각이 지났으면 내일부터). */
export function morningTimes(settings: Pick<MorningSettings, "hour" | "minute">, now = new Date(), days = 7): Date[] {
  const first = new Date(now);
  first.setHours(settings.hour, settings.minute, 0, 0);
  if (first.getTime() <= now.getTime()) first.setDate(first.getDate() + 1);
  return Array.from({ length: days }, (_, i) => {
    const at = new Date(first);
    at.setDate(first.getDate() + i);
    return at;
  });
}

/** 7일 치를 지우고 다시 건다. 꺼져 있거나 허용이 없으면 지우기만. */
export async function scheduleMorning(texts: readonly MorningText[], channelName: string): Promise<void> {
  if (!localNotificationsAvailable()) return;
  try {
    await LocalNotifications.cancel({ notifications: IDS.map((id) => ({ id })) });
    const settings = readMorning();
    if (!settings.on || !texts.length) return;
    if ((await LocalNotifications.checkPermissions()).display !== "granted") return;
    await LocalNotifications.createChannel({ id: CHANNEL, name: channelName, importance: 3 }).catch(() => undefined);
    const times = morningTimes(settings, new Date(), IDS.length);
    await LocalNotifications.schedule({
      notifications: times.map((at, i) => {
        const text = texts[i % texts.length]!;
        return {
          id: IDS[i]!,
          title: text.title,
          body: text.body,
          largeBody: text.largeBody,
          schedule: { at, allowWhileIdle: true },
          isExactNotification: false,
          channelId: CHANNEL,
          smallIcon: "ic_stat_notify",
          extra: { tab: "map" },
        };
      }),
    });
  } catch (error) {
    console.error("[morning]", error);
  }
}

/** 알림을 눌러 앱이 열리면(이미 떠 있을 때도) My로. */
export function onMorningTap(open: () => void): () => void {
  if (!localNotificationsAvailable()) return () => undefined;
  let handle: { remove: () => Promise<void> } | null = null;
  let gone = false;
  void LocalNotifications.addListener("localNotificationActionPerformed", (event) => {
    if (IDS.includes(event.notification.id)) open();
  }).then((h) => {
    if (gone) void h.remove();
    else handle = h;
  });
  return () => {
    gone = true;
    void handle?.remove();
  };
}
