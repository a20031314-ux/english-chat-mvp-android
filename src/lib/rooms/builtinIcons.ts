/**
 * 기본 아이콘 묶음(2026-10-24 사용자 "NOTO로 만들어줘"): Google Noto 움직이는 이모지(CC BY 4.0,
 * https://googlefonts.github.io/noto-emoji-animation/) 48개를 두 묶음으로 — 누구나 받지 않아도 내 아이콘 맨 앞에 있다.
 *
 * - 그림: `public/icons/noto/<코드포인트>.webp`(160px, 프레임 절반, 웹에만 — 앱 빌드에서는 빠짐). 원본에서 줄이는 법은
 *   `scripts/noto-icons.mjs`. `/api/icons?f=`로 오면 서버가 그 정적 파일로 넘긴다(옛 앱도 그대로 보임).
 * - KV·Blob에 없고 코드에만 있다: 만든 사람·이름 바꾸기·지우기·쓰인 수 없음. 라이선스 표시는 CC BY 4.0 + "Google Noto Emoji".
 *
 * 순수.
 */
import type { IconItem, IconPack } from "./icons.ts";

export const BUILTIN_OWNER = "builtin:noto";
/** CC BY 4.0: 출처와 바꾼 것(크기·프레임 줄임)을 묶음 화면의 만든 사람 자리에 — 라이선스 링크는 그 옆에 붙는다. */
export const BUILTIN_OWNER_NAME = "Google Noto Emoji (resized)";

/** 묶음별 코드포인트(이모지 변형 선택자 fe0f는 파일 이름에서 뺀다). */
export const NOTO_PACKS: { id: string; name: string; codepoints: string[] }[] = [
  {
    id: "ip_notofaces",
    name: "Noto 😀",
    codepoints: "1f600 1f604 1f602 1f923 1f60a 1f607 1f60d 1f970 1f618 1f60b 1f61c 1f60e 1f914 1f928 1f644 1f634 1f97a 1f622 1f62d 1f631 1f621 1f92f 1f973 1f917".split(" "),
  },
  {
    id: "ip_notohands",
    name: "Noto 👍",
    codepoints: "1f44d 1f44e 1f44f 1f64c 1f64f 1f44b 1f91d 1f4aa 270c 1f44c 1f44a 2764 1f494 1f525 1f389 2728 1f4af 1f440 1f648 1f480 1f4a5 2615 1f381 1f3c6".split(" "),
  },
];

export const NOTO_SIDE = 160;
/** 기본 묶음이 생긴 날(목록 정렬용). */
const CREATED = Date.UTC(2026, 9, 24);

const iconIdOf = (codepoint: string) => `ic_noto${codepoint}`;

export const BUILTIN_PACKS: IconPack[] = NOTO_PACKS.map((pack) => ({
  id: pack.id,
  owner: BUILTIN_OWNER,
  ownerName: BUILTIN_OWNER_NAME,
  name: pack.name,
  license: "cc-by-4.0",
  createdAt: CREATED,
  icons: pack.codepoints.map((codepoint): IconItem => ({ id: iconIdOf(codepoint), w: NOTO_SIDE, h: NOTO_SIDE, animated: true })),
}));

export function isBuiltinPack(id: string): boolean {
  return BUILTIN_PACKS.some((pack) => pack.id === id);
}

export function builtinPack(id: string): IconPack | null {
  return BUILTIN_PACKS.find((pack) => pack.id === id) ?? null;
}

/** 기본 묶음 아이콘의 정적 파일 경로(없으면 null). */
export function builtinIconFile(packId: string, iconId: string): string | null {
  const pack = builtinPack(packId);
  if (!pack?.icons.some((icon) => icon.id === iconId)) return null;
  return `/icons/noto/${iconId.slice("ic_noto".length)}.webp`;
}
