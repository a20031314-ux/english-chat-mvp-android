import { isBuiltinPack } from "../rooms/builtinIcons.ts";
import { test } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import {
  addIcon,
  createPack,
  decorate,
  deletePack,
  forgetIcons,
  iconFilePath,
  listPacks,
  myPacks,
  openIcon,
  readPack,
  removeIcon,
  setCollected,
  setPackHidden,
  takeIcon,
  type IconFiles,
} from "./iconStore.ts";
import { framesToCheck, prepareIcon } from "./iconImage.ts";
import { ICON_MAX_SIDE, cleanPhrase, cleanShortText, iconPath, iconRefOf, isIconLicense, isPackId, newPackId } from "../rooms/icons.ts";

function memoryFiles(): IconFiles & { saved: Map<string, Buffer> } {
  const saved = new Map<string, Buffer>();
  return {
    saved,
    async put(path, bytes) {
      saved.set(path, bytes);
    },
    async open(path) {
      const bytes = saved.get(path);
      return bytes ? new Blob([new Uint8Array(bytes)]).stream() : null;
    },
    async remove(paths) {
      for (const path of paths) saved.delete(path);
    },
  };
}

const webp = Buffer.from([1, 2, 3]);

test("아이콘 규칙: id·라이선스·이름·한 마디(띄어쓰기 없는 말·라틴 말)", () => {
  assert.ok(isPackId(newPackId()));
  assert.equal(isPackId("ip_../../x"), false);
  assert.ok(isIconLicense("cc0"));
  assert.ok(isIconLicense("cc-by-4.0"));
  assert.equal(isIconLicense("all-rights-reserved"), false);
  assert.equal(cleanShortText("  고양이\n짤  ", 30), "고양이 짤");
  assert.equal(cleanShortText("ありがとうございます", 4), "ありがと");
  assert.deepEqual(cleanPhrase({ lang: "th", text: "ขอบคุณมาก" }), { lang: "th", text: "ขอบคุณมาก" });
  assert.deepEqual(cleanPhrase({ lang: "es", text: "¡Qué día!" }), { lang: "es", text: "¡Qué día!" });
  assert.equal(cleanPhrase({ lang: "spanish", text: "hola" }), undefined);
  assert.equal(iconPath("ip_abcdef", "ic_abcdef"), "/api/icons?f=ip_abcdef.ic_abcdef");
  assert.deepEqual(framesToCheck(1), [0]);
  assert.deepEqual(framesToCheck(2), [0, 1]);
  assert.deepEqual(framesToCheck(9), [0, 4, 8]);
});

test("그림 준비: 정지 PNG는 256으로 줄어 WebP, 움직이는 GIF는 움직임 유지·프레임 3장 검사", async () => {
  const png = await sharp({ create: { width: 800, height: 400, channels: 4, background: "#ff8800" } }).png().toBuffer();
  const still = await prepareIcon(new Uint8Array(png));
  assert.ok(still.ok);
  if (!still.ok) return;
  assert.equal(still.icon.animated, false);
  assert.equal(still.icon.w, ICON_MAX_SIDE);
  assert.equal(still.icon.h, 128);
  assert.equal(still.icon.frames.length, 1);
  assert.equal((await sharp(still.icon.webp).metadata()).format, "webp");

  // 프레임 5장짜리 GIF(세로로 이어 붙인 그림을 페이지로).
  const frames = await Promise.all(
    ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#00ffff"].map((background) => sharp({ create: { width: 64, height: 64, channels: 3, background } }).png().toBuffer()),
  );
  const gif = await sharp(frames, { join: { animated: true } }).gif({ delay: [100, 100, 100, 100, 100] }).toBuffer();
  const moving = await prepareIcon(new Uint8Array(gif));
  assert.ok(moving.ok, JSON.stringify(moving));
  if (!moving.ok) return;
  assert.equal(moving.icon.animated, true);
  assert.equal(moving.icon.w, 64);
  assert.equal(moving.icon.h, 64);
  assert.equal(moving.icon.frames.length, 3);
  const meta = await sharp(moving.icon.webp, { animated: true }).metadata();
  assert.equal(meta.format, "webp");
  assert.equal(meta.pages, 5);

  assert.deepEqual(await prepareIcon(new TextEncoder().encode("not an image")), { ok: false, error: "BAD_TYPE" });
  assert.deepEqual(await prepareIcon(new Uint8Array()), { ok: false, error: "TOO_BIG" });
});

test("묶음: 첫 아이콘에서 공개·받아 두기·쓰인 수는 하루 한 사람 한 번·만든 사람은 안 셈", async () => {
  const files = memoryFiles();
  const made = await createPack({ owner: "acct_iconA", name: "고양이", license: "cc0" });
  assert.ok("ok" in made);
  if (!("ok" in made)) return;
  const pack = made.ok;
  assert.equal((await listPacks({ sort: "new" })).some((row) => row.id === pack.id), false, "아이콘 없으면 목록에 없음");

  assert.deepEqual(await addIcon({ me: "acct_other", packId: pack.id, webp, w: 10, h: 10, animated: false, files }), { error: "FORBIDDEN" });
  const added = await addIcon({ me: "acct_iconA", packId: pack.id, webp, w: 10, h: 10, animated: true, phrase: { lang: "ja", text: "やったね" }, files });
  assert.ok("ok" in added);
  if (!("ok" in added)) return;
  const icon = added.ok.icons[0];
  assert.ok(files.saved.has(iconFilePath(pack.id, icon.id)));
  assert.ok((await listPacks({ sort: "new" })).some((row) => row.id === pack.id), "올리자마자 공개");

  assert.deepEqual(await setCollected("acct_iconB", pack.id, true), { ok: [pack.id] });
  // 기본 묶음(Noto)은 늘 뒤에 붙는다.
  assert.deepEqual((await myPacks("acct_iconB")).map((row) => row.id), [pack.id, "ip_notofaces", "ip_notohands"]);

  const ref = await takeIcon("acct_iconB", pack.id, icon.id);
  assert.deepEqual(ref, iconRefOf(added.ok, icon.id));
  await takeIcon("acct_iconB", pack.id, icon.id);
  await takeIcon("acct_iconA", pack.id, icon.id);
  const [seen] = await decorate([added.ok], "acct_iconB");
  assert.equal(seen.uses, 1);
  assert.equal(seen.added, true);
  assert.equal((await listPacks({ sort: "popular" }))[0]?.id, pack.id);
  assert.equal(await takeIcon("acct_iconB", pack.id, "ic_missing0"), null);

  assert.ok(await openIcon(pack.id, icon.id, files));
  await setPackHidden(pack.id, true);
  assert.equal(await openIcon(pack.id, icon.id, files), null, "내리면 그림도 막힘");
  assert.equal(await takeIcon("acct_iconB", pack.id, icon.id), null);
  assert.equal((await listPacks({ sort: "new" })).some((row) => row.id === pack.id), false);
  assert.deepEqual(await setCollected("acct_iconC", pack.id, true), { error: "HIDDEN" });
  assert.deepEqual((await myPacks("acct_iconB")).filter((row) => !isBuiltinPack(row.id)), []);
  await setPackHidden(pack.id, false);
  assert.ok((await listPacks({ sort: "new" })).some((row) => row.id === pack.id), "되돌리면 다시 목록에");

  const removed = await removeIcon("acct_iconA", pack.id, icon.id, files);
  assert.ok("ok" in removed);
  assert.equal(files.saved.size, 0);
  assert.equal((await listPacks({ sort: "new" })).some((row) => row.id === pack.id), false, "아이콘이 다 빠지면 목록에서 빠짐");
  assert.deepEqual(await deletePack("acct_other", pack.id, files), { error: "FORBIDDEN" });
  assert.deepEqual(await deletePack("acct_iconA", pack.id, files), { ok: true });
  assert.equal(await readPack(pack.id), null);
});

test("계정 지우기: 만든 묶음·파일·받아 둔 목록이 사라진다", async () => {
  const files = memoryFiles();
  const made = await createPack({ owner: "acct_iconGone", name: "¡Olé!", license: "cc-by-4.0" });
  assert.ok("ok" in made);
  if (!("ok" in made)) return;
  await addIcon({ me: "acct_iconGone", packId: made.ok.id, webp, w: 5, h: 5, animated: false, files });
  await setCollected("acct_iconGone", made.ok.id, true);
  await forgetIcons("acct_iconGone", files);
  assert.equal(await readPack(made.ok.id), null);
  assert.equal(files.saved.size, 0);
  assert.deepEqual((await myPacks("acct_iconGone")).filter((row) => !isBuiltinPack(row.id)), []);
});
