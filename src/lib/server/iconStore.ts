import { del, get, put } from "@vercel/blob";
import {
  COLLECTION_MAX,
  ICON_PAGE,
  ICON_UPLOADS_PER_DAY,
  ICONS_PER_PACK,
  PACKS_PER_ACCOUNT,
  iconRefOf,
  newIconId,
  newPackId,
  type IconItem,
  type IconLicense,
  type IconPack,
  type IconRef,
} from "../rooms/icons.ts";
import { BUILTIN_PACKS, builtinPack, isBuiltinPack } from "../rooms/builtinIcons.ts";
import {
  kvDelete,
  kvGetJson,
  kvGetJsonMany,
  kvGetNumbers,
  kvIncrBy,
  kvSetJson,
  kvSetJsonIfAbsent,
  kvZAdd,
  kvZRem,
  kvZRevRange,
} from "./kv.ts";

/**
 * 아이콘 묶음 저장(규칙은 rooms/icons.ts, 설계 hub/drafts/icons-2026-10-23.md). KV:
 *   icon:v1:pack:<묶음>            묶음 JSON(이름·라이선스·아이콘 목록·내림 표시)
 *   icon:v1:new                   ZSET 공개 묶음(점수 = 만든 시각)
 *   icon:v1:popular               ZSET 공개 묶음(점수 = 쓰인 수)
 *   icon:v1:by:<계정>              ZSET 그 사람이 만든 묶음 — 계정 삭제 때
 *   icon:v1:mine:<계정>            내가 받아 둔 묶음 id 목록(JSON)
 *   icon:v1:uses:<묶음>            쓰인 수
 *   icon:v1:used:<계정>:<묶음>:<날짜> 같은 사람은 하루 한 번만 셈(2일)
 *   icon:v1:n:<계정>:<날짜>         오늘 올린 아이콘 수(2일)
 * 파일: Vercel Blob(private 저장소) `icons/<묶음>/<아이콘>.webp`, 서버가 공개 캐시로 보낸다(/api/icons).
 * 묶음은 만든 사람이 지우거나 계정을 지울 때까지(기한 없음 — KV 쓰기에 기한이 필요해 10년).
 */
const packKey = (id: string) => `icon:v1:pack:${id}`;
const NEW = "icon:v1:new";
const POPULAR = "icon:v1:popular";
const byKey = (account: string) => `icon:v1:by:${account}`;
const mineKey = (account: string) => `icon:v1:mine:${account}`;
const usesKey = (id: string) => `icon:v1:uses:${id}`;
const usedKey = (account: string, pack: string, day: string) => `icon:v1:used:${account}:${pack}:${day}`;
const dayKey = (account: string, day: string) => `icon:v1:n:${account}:${day}`;
const KEEP_SECONDS = 10 * 365 * 24 * 60 * 60;
const SHORT_SECONDS = 2 * 24 * 60 * 60;

const utcDay = (ms: number) => new Date(ms).toISOString().slice(0, 10);
export const iconFilePath = (pack: string, icon: string) => `icons/${pack}/${icon}.webp`;

/** 파일 저장소 — 테스트는 메모리로 바꾼다. */
export type IconFiles = {
  put(path: string, bytes: Buffer): Promise<void>;
  open(path: string): Promise<ReadableStream<Uint8Array> | null>;
  remove(paths: string[]): Promise<void>;
};

export const blobIconFiles: IconFiles = {
  async put(path, bytes) {
    await put(path, bytes, { access: "private", contentType: "image/webp", addRandomSuffix: false, allowOverwrite: true });
  },
  async open(path) {
    const found = await get(path, { access: "private" });
    return found?.stream ?? null;
  },
  async remove(paths) {
    if (paths.length) await del(paths).catch(() => {});
  },
};

export async function readPack(id: string): Promise<IconPack | null> {
  // 기본 묶음(Noto)은 코드에만 있다(rooms/builtinIcons.ts).
  return builtinPack(id) ?? kvGetJson<IconPack>(packKey(id));
}

async function writePack(pack: IconPack): Promise<void> {
  const { uses: _uses, ownerName: _ownerName, added: _added, ...stored } = pack;
  void _uses;
  void _ownerName;
  void _added;
  await kvSetJson(packKey(pack.id), stored, KEEP_SECONDS);
}

/** 읽는 사람 기준으로 쓰인 수·내가 받아 뒀는지를 채운다. 이름은 부르는 쪽이 계정에서 채운다. */
export async function decorate(packs: IconPack[], me: string | null): Promise<IconPack[]> {
  if (!packs.length) return packs;
  const [uses, mine] = await Promise.all([kvGetNumbers(packs.map((pack) => usesKey(pack.id))), me ? readCollection(me) : Promise.resolve([])]);
  return packs.map((pack, index) => ({ ...pack, uses: Math.max(0, uses.at(index) ?? 0), added: isBuiltinPack(pack.id) || mine.includes(pack.id) }));
}

export type PackError = "LIMIT" | "NOT_FOUND" | "FORBIDDEN" | "FULL" | "HIDDEN";

export async function createPack(input: { owner: string; name: string; license: IconLicense; now?: number }): Promise<{ ok: IconPack } | { error: PackError }> {
  const mine = await kvZRevRange(byKey(input.owner), 0, PACKS_PER_ACCOUNT);
  if (mine.length >= PACKS_PER_ACCOUNT) return { error: "LIMIT" };
  const now = input.now ?? Date.now();
  const pack: IconPack = { id: newPackId(), owner: input.owner, name: input.name, license: input.license, icons: [], createdAt: now };
  await writePack(pack);
  await kvZAdd(byKey(input.owner), now, pack.id);
  return { ok: pack };
}

/** 묶음 이름 바꾸기(라이선스는 한 번 정하면 바꾸지 않는다 — 이미 받아 간 사람의 조건이 바뀌지 않게). */
export async function renamePack(me: string, id: string, name: string): Promise<{ ok: IconPack } | { error: PackError }> {
  const pack = await readPack(id);
  if (!pack) return { error: "NOT_FOUND" };
  if (pack.owner !== me) return { error: "FORBIDDEN" };
  const next = { ...pack, name };
  await writePack(next);
  return { ok: next };
}

/**
 * 아이콘 하나 더하기: 내 묶음·한도 → 하루 상한 → (부르는 쪽이 줄이고 검사한) 파일 저장 → 공개 목록에.
 * 올리자마자 공개(사용자 결정 2026-10-23) — 첫 아이콘이 들어가는 순간 새 묶음 목록에 뜬다.
 */
export async function addIcon(input: {
  me: string;
  packId: string;
  webp: Buffer;
  w: number;
  h: number;
  animated: boolean;
  phrase?: IconItem["phrase"];
  files?: IconFiles;
  now?: number;
}): Promise<{ ok: IconPack } | { error: PackError }> {
  const files = input.files ?? blobIconFiles;
  const now = input.now ?? Date.now();
  const pack = await readPack(input.packId);
  if (!pack) return { error: "NOT_FOUND" };
  if (pack.owner !== input.me) return { error: "FORBIDDEN" };
  if (pack.hidden) return { error: "HIDDEN" };
  if (pack.icons.length >= ICONS_PER_PACK) return { error: "FULL" };
  if ((await kvIncrBy(dayKey(input.me, utcDay(now)), 1, SHORT_SECONDS)) > ICON_UPLOADS_PER_DAY) return { error: "LIMIT" };
  const icon: IconItem = { id: newIconId(), w: input.w, h: input.h, animated: input.animated, ...(input.phrase ? { phrase: input.phrase } : {}) };
  await files.put(iconFilePath(pack.id, icon.id), input.webp);
  // 저장하는 동안 다른 요청이 더했을 수 있어 다시 읽고 붙인다.
  const fresh = (await readPack(pack.id)) ?? pack;
  const next = { ...fresh, icons: [...fresh.icons, icon].slice(0, ICONS_PER_PACK) };
  await writePack(next);
  if (fresh.icons.length === 0) {
    await kvZAdd(NEW, now, pack.id);
    await kvZAdd(POPULAR, 0, pack.id);
  }
  return { ok: next };
}

export async function removeIcon(me: string, packId: string, iconId: string, files: IconFiles = blobIconFiles): Promise<{ ok: IconPack } | { error: PackError }> {
  const pack = await readPack(packId);
  if (!pack) return { error: "NOT_FOUND" };
  if (pack.owner !== me) return { error: "FORBIDDEN" };
  if (!pack.icons.some((icon) => icon.id === iconId)) return { error: "NOT_FOUND" };
  await files.remove([iconFilePath(pack.id, iconId)]);
  const next = { ...pack, icons: pack.icons.filter((icon) => icon.id !== iconId) };
  await writePack(next);
  if (!next.icons.length) await Promise.all([kvZRem(NEW, pack.id), kvZRem(POPULAR, pack.id)]);
  return { ok: next };
}

async function dropPack(pack: IconPack, files: IconFiles): Promise<void> {
  await files.remove(pack.icons.map((icon) => iconFilePath(pack.id, icon.id)));
  await kvDelete([packKey(pack.id), usesKey(pack.id)]);
  await Promise.all([kvZRem(NEW, pack.id), kvZRem(POPULAR, pack.id), kvZRem(byKey(pack.owner), pack.id)]);
}

/** 묶음 지우기(만든 사람). 받아 둔 사람의 목록에는 id가 남지만 읽을 때 빠진다. 이미 보낸 메시지의 아이콘은 그림이 사라진다. */
export async function deletePack(me: string, id: string, files: IconFiles = blobIconFiles): Promise<{ ok: true } | { error: PackError }> {
  const pack = await readPack(id);
  if (!pack) return { error: "NOT_FOUND" };
  if (pack.owner !== me) return { error: "FORBIDDEN" };
  await dropPack(pack, files);
  return { ok: true };
}

/** 운영자 내리기·되돌리기(저작권 신고 등). 내리면 목록·보내기·그림이 모두 막힌다. */
export async function setPackHidden(id: string, hidden: boolean): Promise<boolean> {
  if (isBuiltinPack(id)) return false;
  const pack = await readPack(id);
  if (!pack) return false;
  await writePack({ ...pack, hidden });
  if (hidden) await Promise.all([kvZRem(NEW, id), kvZRem(POPULAR, id)]);
  else if (pack.icons.length) {
    await kvZAdd(NEW, pack.createdAt, id);
    const [uses] = await kvGetNumbers([usesKey(id)]);
    await kvZAdd(POPULAR, uses ?? 0, id);
  }
  return true;
}

/** 공개 묶음 목록(새로 올라온 순·많이 쓰인 순). */
export async function listPacks(input: { sort: "new" | "popular"; offset?: number }): Promise<IconPack[]> {
  const offset = Math.max(0, Math.floor(input.offset ?? 0));
  const rows = await kvZRevRange(input.sort === "popular" ? POPULAR : NEW, offset, offset + ICON_PAGE - 1);
  if (!rows.length) return [];
  const packs = await kvGetJsonMany<IconPack>(rows.map((row) => packKey(row.member)));
  return packs.filter((pack): pack is IconPack => pack !== null && !pack.hidden && pack.icons.length > 0);
}

export async function listPacksBy(owner: string): Promise<IconPack[]> {
  const rows = await kvZRevRange(byKey(owner), 0, PACKS_PER_ACCOUNT);
  if (!rows.length) return [];
  const packs = await kvGetJsonMany<IconPack>(rows.map((row) => packKey(row.member)));
  return packs.filter((pack): pack is IconPack => pack !== null);
}

export async function readCollection(me: string): Promise<string[]> {
  return (await kvGetJson<string[]>(mineKey(me))) ?? [];
}

/** 받아 두기·빼기. 내 묶음은 받아 두지 않아도 늘 내 목록에 있다. */
export async function setCollected(me: string, packId: string, on: boolean): Promise<{ ok: string[] } | { error: PackError }> {
  const mine = await readCollection(me);
  // 기본 묶음은 늘 내 목록에 있어 받기·빼기가 없다.
  if (isBuiltinPack(packId)) return { ok: mine };
  if (on) {
    const pack = await readPack(packId);
    if (!pack) return { error: "NOT_FOUND" };
    if (pack.hidden) return { error: "HIDDEN" };
    if (mine.includes(packId)) return { ok: mine };
    if (mine.length >= COLLECTION_MAX) return { error: "LIMIT" };
    const next = [packId, ...mine];
    await kvSetJson(mineKey(me), next, KEEP_SECONDS);
    return { ok: next };
  }
  const next = mine.filter((id) => id !== packId);
  await kvSetJson(mineKey(me), next, KEEP_SECONDS);
  return { ok: next };
}

/** 내 아이콘 고르기 목록: 내가 만든 묶음 + 받아 둔 묶음(없어졌거나 내려진 것은 빠진다). */
export async function myPacks(me: string): Promise<IconPack[]> {
  const [own, ids] = await Promise.all([listPacksBy(me), readCollection(me)]);
  const others = ids.filter((id) => !own.some((pack) => pack.id === id) && !isBuiltinPack(id));
  const collected = others.length ? await kvGetJsonMany<IconPack>(others.map(packKey)) : [];
  return [
    ...own.filter((pack) => pack.icons.length > 0),
    ...collected.filter((pack): pack is IconPack => pack !== null && !pack.hidden && pack.icons.length > 0),
    // 기본 묶음(Noto)은 받지 않아도 늘 — 내가 만든·받은 것 뒤에.
    ...BUILTIN_PACKS,
  ];
}

/**
 * 보낼 때: 묶음에서 아이콘을 찾아 메시지에 붙일 모양으로(내려진 묶음은 null).
 * 쓰인 수는 같은 사람이 같은 묶음을 하루 한 번만 센다(많이 쓰인 순 목록이 한 사람 도배로 바뀌지 않게).
 */
export async function takeIcon(me: string, packId: string, iconId: string, now = Date.now()): Promise<IconRef | null> {
  const pack = await readPack(packId);
  if (!pack) return null;
  const ref = iconRefOf(pack, iconId);
  if (!ref) return null;
  if (pack.owner !== me && !isBuiltinPack(packId) && (await kvSetJsonIfAbsent(usedKey(me, packId, utcDay(now)), 1, SHORT_SECONDS))) {
    const uses = await kvIncrBy(usesKey(packId), 1, KEEP_SECONDS);
    await kvZAdd(POPULAR, uses, packId);
  }
  return ref;
}

/** 그림 파일 열기(내려진 묶음·없는 아이콘은 null). */
export async function openIcon(packId: string, iconId: string, files: IconFiles = blobIconFiles): Promise<ReadableStream<Uint8Array> | null> {
  const pack = await readPack(packId);
  if (!pack || pack.hidden || !pack.icons.some((icon) => icon.id === iconId)) return null;
  return files.open(iconFilePath(packId, iconId));
}

/** 계정을 지울 때: 만든 묶음(파일까지)과 받아 둔 목록. */
export async function forgetIcons(account: string, files: IconFiles = blobIconFiles): Promise<void> {
  for (const pack of await listPacksBy(account)) await dropPack(pack, files);
  await kvDelete([byKey(account), mineKey(account)]);
}
