import { test } from "node:test";
import assert from "node:assert/strict";
import { BUILTIN_PACKS, builtinIconFile, builtinPack, isBuiltinPack } from "./builtinIcons.ts";
import { ICONS_PER_PACK, isIconId, isPackId } from "./icons.ts";

test("기본 묶음: id 모양·한도·라이선스", () => {
  assert.equal(BUILTIN_PACKS.length, 2);
  for (const pack of BUILTIN_PACKS) {
    assert.ok(isPackId(pack.id), pack.id);
    assert.equal(pack.license, "cc-by-4.0");
    assert.ok(pack.icons.length > 0 && pack.icons.length <= ICONS_PER_PACK);
    for (const icon of pack.icons) assert.ok(isIconId(icon.id), icon.id);
  }
  const all = BUILTIN_PACKS.flatMap((pack) => pack.icons.map((icon) => icon.id));
  assert.equal(new Set(all).size, all.length);
});

test("기본 묶음: 정적 파일 경로, 없는 것은 null", () => {
  assert.equal(builtinIconFile("ip_notofaces", "ic_noto1f600"), "/icons/noto/1f600.webp");
  assert.equal(builtinIconFile("ip_notofaces", "ic_noto1f44d"), null);
  assert.equal(builtinIconFile("ip_abcdef12", "ic_noto1f600"), null);
  assert.ok(isBuiltinPack("ip_notohands"));
  assert.equal(builtinPack("ip_other1"), null);
});
