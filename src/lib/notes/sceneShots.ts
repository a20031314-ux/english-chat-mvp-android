"use client";

/**
 * 짚인 순간의 화면 — 노트 카드에 "화면 함께" 붙일 그림(2026-10-24 사용자 결정, hub/drafts/notebook-2026-10-23.md).
 *
 * 그 순간에만 찍을 수 있어서, AI 대화·AI 통화에서 교정이 붙을 때 기기 안에서 화면을 작게 찍어 둔다(IndexedDB).
 * 서버로는 보내지 않는다 — 사용자가 오늘의 학습에서 "화면 함께"를 켜고 노트에 넣을 때 그 그림만 올린다.
 * 7일이 지나거나 60장을 넘으면 오래된 것부터 지운다. 1:1·단체방·Room은 남의 말·얼굴이 찍혀 찍지 않는다.
 */

const DB = "notebookShots";
const STORE = "shots";
const KEEP_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_SHOTS = 60;
const MAX_WIDTH = 720;
const MAX_BYTES = 180_000;
const TRANSPARENT_PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

type Shot = { key: string; language: string; at: number; image: string };

/** 서버 후보의 내 줄과 같은 열쇠(notes/notebook.ts `same`과 같은 다듬기). */
export function shotKeyOf(language: string, wrong: string): string {
  const bare = wrong.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{M}\p{N}]/gu, "").slice(0, 300);
  return `${language}|${bare}`;
}

function open(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    try {
      if (typeof indexedDB === "undefined") return resolve(null);
      const request = indexedDB.open(DB, 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE, { keyPath: "key" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function all(db: IDBDatabase): Promise<Shot[]> {
  return new Promise((resolve) => {
    const request = db.transaction(STORE, "readonly").objectStore(STORE).getAll();
    request.onsuccess = () => resolve((request.result as Shot[]) ?? []);
    request.onerror = () => resolve([]);
  });
}

function bytes(dataUrl: string): number {
  return Math.ceil(((dataUrl.split(",")[1] ?? "").length * 3) / 4);
}

async function shrink(src: string): Promise<string> {
  const image = new Image();
  image.src = src;
  await image.decode();
  const scale = Math.min(1, MAX_WIDTH / Math.max(1, image.naturalWidth));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext("2d");
  if (!context) return "";
  context.fillStyle = "#050505";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  for (const quality of [0.7, 0.55, 0.42, 0.3]) {
    const out = canvas.toDataURL("image/jpeg", quality);
    if (bytes(out) <= MAX_BYTES) return out;
  }
  return "";
}

let busy = false;

/** 지금 화면을 찍어 그 줄의 그림으로 둔다. 실패하면 조용히 넘어간다(그 줄은 "화면 함께"가 안 보일 뿐). */
export async function captureScene(language: string, wrong: string): Promise<void> {
  if (busy || !wrong.trim() || typeof document === "undefined") return;
  busy = true;
  try {
    const { toJpeg } = await import("html-to-image");
    const raw = await toJpeg(document.body, {
      quality: 0.8,
      pixelRatio: 1,
      backgroundColor: "#050505",
      skipFonts: true,
      imagePlaceholder: TRANSPARENT_PIXEL,
      filter: (node) =>
        !(node instanceof HTMLIFrameElement) &&
        !(node instanceof HTMLVideoElement) &&
        !(node instanceof HTMLElement && node.dataset.feedbackSkip === "1"),
    });
    const image = await shrink(raw);
    if (!image) return;
    const db = await open();
    if (!db) return;
    const now = Date.now();
    const kept = (await all(db)).filter((shot) => now - shot.at < KEEP_MS).sort((a, b) => b.at - a.at);
    const drop = [...(await all(db)).filter((shot) => now - shot.at >= KEEP_MS), ...kept.slice(MAX_SHOTS - 1)];
    const store = db.transaction(STORE, "readwrite").objectStore(STORE);
    for (const shot of drop) store.delete(shot.key);
    store.put({ key: shotKeyOf(language, wrong), language, at: now, image } satisfies Shot);
  } catch {
    // 화면을 못 찍는 기기·화면이면 그림 없이.
  } finally {
    busy = false;
  }
}

/** 교정이 붙은 뒤 한 박자 늦게(교정 표시가 그려진 뒤) 찍는다. */
export function captureSceneSoon(language: string, wrong: string): void {
  if (typeof window === "undefined") return;
  window.setTimeout(() => void captureScene(language, wrong), 700);
}

/** 이 기기에 찍어 둔 그림(없으면 null). */
export async function sceneShotFor(language: string, wrong: string): Promise<string | null> {
  const db = await open();
  if (!db) return null;
  return new Promise((resolve) => {
    const request = db.transaction(STORE, "readonly").objectStore(STORE).get(shotKeyOf(language, wrong));
    request.onsuccess = () => {
      const shot = request.result as Shot | undefined;
      resolve(shot && Date.now() - shot.at < KEEP_MS ? shot.image : null);
    };
    request.onerror = () => resolve(null);
  });
}
