import { isIconId, isPackId, type IconRef } from "../rooms/icons.ts";
import { takeIcon } from "./iconStore.ts";

/**
 * 메시지·댓글 요청의 `icon: { pack, id }`를 확인해 붙일 모양으로(없거나 틀리면 null). 공개 묶음이면 누구나 보낼 수 있다
 * (받아 두기는 고르기 편하려고 — 보내는 데 필요하지 않음). 쓰인 수는 takeIcon이 하루 한 번 센다.
 */
export async function pickIcon(me: string, value: unknown): Promise<IconRef | null> {
  if (!value || typeof value !== "object") return null;
  const raw = value as { pack?: unknown; id?: unknown };
  if (!isPackId(raw.pack) || !isIconId(raw.id)) return null;
  return takeIcon(me, raw.pack, raw.id);
}
