import { Capacitor, CapacitorHttp } from "@capacitor/core";

function headerMap(
  headers: Record<string, string> | undefined,
  name: string,
): string {
  if (!headers) return "";
  const want = name.toLowerCase();
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === want) return value;
  }
  return "";
}

function decodeBase64(raw: string): Uint8Array {
  const payload = raw.includes(",") && /^\s*data:/i.test(raw)
    ? raw.slice(raw.indexOf(",") + 1)
    : raw;
  const clean = payload.replace(/\s+/g, "");
  if (!clean) return new Uint8Array(0);
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function decodeBody(data: unknown): Uint8Array {
  if (data == null) return new Uint8Array(0);
  if (data instanceof ArrayBuffer) return new Uint8Array(data);
  if (ArrayBuffer.isView(data)) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
  }
  if (Array.isArray(data)) {
    return Uint8Array.from(data.map((value) => Number(value) & 255));
  }
  if (typeof data === "object" && data !== null && "data" in data) {
    return decodeBody((data as { data: unknown }).data);
  }
  if (typeof data === "string") {
    try {
      return decodeBase64(data);
    } catch (error) {
      console.error("[video-client-audio] base64 decode failed", error);
      return new Uint8Array(0);
    }
  }
  return new Uint8Array(0);
}

export async function nativeGetBytes(
  url: string,
  headers: Record<string, string>,
  timeoutMs: number,
): Promise<{
  status: number;
  bytes: Uint8Array;
  header: (name: string) => string;
} | null> {
  if (typeof window === "undefined" || !Capacitor.isNativePlatform()) {
    return null;
  }
  try {
    const response = await CapacitorHttp.request({
      url,
      method: "GET",
      headers,
      responseType: "arraybuffer",
      connectTimeout: Math.min(20000, timeoutMs),
      readTimeout: timeoutMs,
    });
    const bytes = decodeBody(response.data);
    console.error("[video-client-audio] native GET", {
      status: response.status,
      bytes: bytes.byteLength,
      host: (() => {
        try {
          return new URL(url).host;
        } catch {
          return "";
        }
      })(),
    });
    return {
      status: response.status,
      bytes,
      header: (name) => headerMap(response.headers, name),
    };
  } catch (error) {
    console.error("[video-client-audio] native GET failed", url.slice(0, 80), error);
    return null;
  }
}

export async function nativeGetText(
  url: string,
  headers: Record<string, string>,
  timeoutMs: number,
): Promise<{
  status: number;
  text: string;
  header: (name: string) => string;
} | null> {
  if (typeof window === "undefined" || !Capacitor.isNativePlatform()) {
    return null;
  }
  try {
    const response = await CapacitorHttp.request({
      url,
      method: "GET",
      headers,
      responseType: "text",
      connectTimeout: Math.min(20000, timeoutMs),
      readTimeout: timeoutMs,
    });
    const text =
      typeof response.data === "string"
        ? response.data
        : response.data == null
          ? ""
          : String(response.data);
    return {
      status: response.status,
      text,
      header: (name) => headerMap(response.headers, name),
    };
  } catch (error) {
    console.error("[video-client-audio] native GET text failed", url.slice(0, 80), error);
    return null;
  }
}
