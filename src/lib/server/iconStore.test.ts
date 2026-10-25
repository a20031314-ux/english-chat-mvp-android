import { isBuiltinPack } from "../rooms/builtinIcons.ts";
import { test } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { addPurchasedPoints, getPurchasedPoints } from "./entitlementStore.ts";
import {
  addIcon,
  buyPack,
  createPack,
  decorate,
  deletePack,
  forgetIcons,
  iconFilePath,
  listPacks,
  myPacks,
  openIcon,
  readBought,
  readPack,
  removeIcon,
  requestSale,
  setSaleStatus,
  setCollected,
  setPackHidden,
  takeIcon,
  type IconFiles,
} from "./iconStore.ts";
import { framesToCheck, prepareIcon } from "./iconImage.ts";
import { ICON_MAX_SIDE, creatorCut, isIconPrice, cleanPhrase, cleanShortText, iconPath, iconRefOf, isIconLicense, isPackId, newPackId } from "../rooms/icons.ts";

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

test("판매 묶음: 승인 전엔 목록에 없고, 사면 포인트가 깎이고 만든 사람에게 70%, 내리면 돌려준다", async () => {
  const files = memoryFiles();
  const seller = `acct_sale_${Date.now().toString(36)}`;
  const buyer = `acct_buy_${Date.now().toString(36)}`;
  const sellerData = `data:${seller}`;
  const buyerData = `data:${buyer}`;
  assert.ok(isIconPrice(5));
  assert.ok(isIconPrice(17));
  assert.ok(isIconPrice(0));
  assert.equal(isIconPrice(1), false);
  assert.equal(isIconPrice(31), false);
  assert.equal(isIconPrice(4.5), false);
  assert.equal(creatorCut(10), 7);
  assert.equal(creatorCut(3), 2);

  const made = await createPack({ owner: seller, name: "ねこ · gatos", license: "cc0", price: 5 });
  assert.ok("ok" in made);
  if (!("ok" in made)) return;
  assert.equal(made.ok.license, "app");
  assert.equal(made.ok.sale, "draft");
  // 아이콘 없이 신청 못 함.
  assert.deepEqual(await requestSale(seller, made.ok.id), { error: "EMPTY" });
  const added = await addIcon({ me: seller, packId: made.ok.id, webp, w: 64, h: 64, animated: false, phrase: { lang: "ja", text: "にゃー" }, files });
  assert.ok("ok" in added);
  assert.equal((await listPacks({ sort: "new" })).some((pack) => pack.id === made.ok.id), false);
  const asked = await requestSale(seller, made.ok.id);
  assert.ok("ok" in asked && asked.ok.sale === "pending");
  // 승인 전: 살 수 없고, 안 산 사람은 받아 두기·보내기 못 함, 만든 사람은 보냄.
  assert.deepEqual(await buyPack({ me: buyer, payer: buyerData, grant: 0, creator: sellerData, packId: made.ok.id }), { error: "NOT_FOR_SALE" });
  const iconId = "ok" in added ? added.ok.icons[0].id : "";
  assert.equal(await takeIcon(buyer, made.ok.id, iconId), null);
  assert.ok(await takeIcon(seller, made.ok.id, iconId));
  assert.deepEqual(await setCollected(buyer, made.ok.id, true), { error: "NOT_BOUGHT" });

  assert.ok(await setSaleStatus(made.ok.id, "approved"));
  assert.ok((await listPacks({ sort: "new" })).some((pack) => pack.id === made.ok.id));
  // 포인트 모자람 → 아무것도 안 깎임.
  await addPurchasedPoints(buyerData, 4);
  assert.deepEqual(await buyPack({ me: buyer, payer: buyerData, grant: 0, creator: sellerData, packId: made.ok.id }), { error: "NO_POINTS" });
  assert.equal(await getPurchasedPoints(buyerData), 4);
  await addPurchasedPoints(buyerData, 6);
  const sellerBefore = await getPurchasedPoints(sellerData);
  const bought = await buyPack({ me: buyer, payer: buyerData, grant: 0, creator: sellerData, packId: made.ok.id });
  assert.ok("ok" in bought && bought.spent === 5);
  assert.equal(await getPurchasedPoints(buyerData), 5);
  assert.equal((await getPurchasedPoints(sellerData)) - sellerBefore, 3);
  // 두 번 사도 한 번만 깎인다.
  const again = await buyPack({ me: buyer, payer: buyerData, grant: 0, creator: sellerData, packId: made.ok.id });
  assert.ok("ok" in again && again.spent === 0);
  assert.equal(await getPurchasedPoints(buyerData), 5);
  assert.ok(await takeIcon(buyer, made.ok.id, iconId));
  assert.ok((await myPacks(buyer)).some((pack) => pack.id === made.ok.id));
  const [shown] = await decorate([made.ok], buyer);
  assert.equal(shown.bought, true);

  // 운영자가 내리면 산 포인트를 돌려받고, 만든 사람 몫은 거둔다. 다시 올려도 다시 사야 한다.
  assert.ok(await setPackHidden(made.ok.id, true));
  assert.equal(await getPurchasedPoints(buyerData), 10);
  assert.equal(await getPurchasedPoints(sellerData), sellerBefore);
  assert.deepEqual(await readBought(buyer), []);
  assert.ok(await setPackHidden(made.ok.id, false));
  assert.equal(await takeIcon(buyer, made.ok.id, iconId), null);
  assert.equal((await myPacks(buyer)).some((pack) => pack.id === made.ok.id), false);

  // 다시 사고 만든 사람이 지우면 또 돌려준다.
  assert.ok("ok" in (await buyPack({ me: buyer, payer: buyerData, grant: 0, creator: sellerData, packId: made.ok.id })));
  assert.equal(await getPurchasedPoints(buyerData), 5);
  assert.deepEqual(await deletePack(seller, made.ok.id, files), { ok: true });
  assert.equal(await getPurchasedPoints(buyerData), 10);
  await forgetIcons(buyer, files);
});

test("편집기 움직임: 정지 PNG → 움직이는 WebP(프레임 10, 256), 이미 움직이는 그림은 그대로", async () => {
  const { animateStill, poseAt } = await import("./iconMotion.ts");
  const png = await sharp({ create: { width: 300, height: 200, channels: 4, background: "#22c55e" } }).png().toBuffer();
  for (const motion of ["bounce", "shake", "pulse", "wobble"] as const) {
    const out = await animateStill(new Uint8Array(png), motion);
    const meta = await sharp(out, { animated: true }).metadata();
    assert.equal(meta.format, "webp");
    assert.ok((meta.pages ?? 1) >= 4, `${motion} ${meta.pages}`); // 같은 프레임은 WebP가 합친다
    assert.equal(meta.width, ICON_MAX_SIDE);
    const prepared = await prepareIcon(out);
    assert.ok(prepared.ok && prepared.icon.animated, motion);
  }
  assert.equal(poseAt("pulse", 0).scale, 1);
  const frames = await Promise.all(["#f00", "#0f0"].map((background) => sharp({ create: { width: 32, height: 32, channels: 3, background } }).png().toBuffer()));
  const gif = new Uint8Array(await sharp(frames, { join: { animated: true } }).gif().toBuffer());
  assert.equal(await animateStill(gif, "bounce"), gif);
});

test("🔥 많이 쓰는 묶음: 인기 위쪽이면서 쓰인 수 30 이상만", async () => {
  const { hotPackIds } = await import("./iconStore.ts");
  const { HOT_PACK_MIN_USES } = await import("../rooms/icons.ts");
  const { kvZAdd } = await import("./kv.ts");
  const files = memoryFiles();
  const owner = `acct_hot_${Date.now().toString(36)}`;
  const made = await createPack({ owner, name: "ホット · caliente", license: "cc0" });
  assert.ok("ok" in made);
  if (!("ok" in made)) return;
  await addIcon({ me: owner, packId: made.ok.id, webp, w: 64, h: 64, animated: false, files });
  assert.equal((await hotPackIds()).has(made.ok.id), false);
  await kvZAdd("icon:v1:popular", HOT_PACK_MIN_USES + 5, made.ok.id);
  assert.ok((await hotPackIds()).has(made.ok.id));
  const [shown] = await decorate([made.ok], null);
  assert.equal(shown.hot, true);
  await forgetIcons(owner, files);
  assert.equal((await hotPackIds()).has(made.ok.id), false);
});
