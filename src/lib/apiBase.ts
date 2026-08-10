import { Capacitor } from "@capacitor/core";

const VERCEL_FALLBACK_API_BASE = "https://english-chat-mvp.vercel.app";

export function getApiBase(): string {
  if (typeof window === "undefined") {
    return VERCEL_FALLBACK_API_BASE;
  }

  const fromEnv = process.env.NEXT_PUBLIC_API_BASE?.trim();
  const remoteApiBase = fromEnv
    ? fromEnv.replace(/\/+$/, "")
    : VERCEL_FALLBACK_API_BASE;

  if (Capacitor.isNativePlatform()) {
    return remoteApiBase;
  }

  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") {
    return "";
  }

  return remoteApiBase;
}

export function apiUrl(apiPath: string): string {
  const path = apiPath.startsWith("/") ? apiPath : `/${apiPath}`;
  const base = getApiBase().replace(/\/+$/, "");
  return base === "" ? path : `${base}${path}`;
}
