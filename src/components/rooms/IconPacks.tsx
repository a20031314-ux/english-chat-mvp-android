"use client";

import { isBuiltinPack } from "@/lib/rooms/builtinIcons";
import { useCallback, useEffect, useRef, useState } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import { readCachedAccount } from "@/lib/account/session";
import { useBillingUiOptional } from "@/components/BillingScreen";
import { IconEditor } from "@/components/rooms/IconEditor";
import { iconCopy, iconErrorText, type IconCopy } from "@/lib/rooms/iconCopy";
import {
  IconApiError,
  buyIconPack,
  collectIconPack,
  createIconPack,
  deleteIconPack,
  iconSrc,
  listIconPacks,
  myIconPacks,
  removeIconFromPack,
  reportIconPack,
  sellIconPack,
  uploadEditedIcon,
  uploadIcon,
} from "@/lib/rooms/iconClient";
import {
  ICON_LICENSES,
  ICON_LICENSE_URL,
  ICON_PRICE_MAX,
  ICON_PRICE_MIN,
  ICONS_PER_PACK,
  PACK_NAME_MAX,
  ICON_PHRASE_MAX,
  isIconPrice,
  isPaidPack,
  type IconLicense,
  type IconPack,
  type IconRef,
} from "@/lib/rooms/icons";

/**
 * 사용자 아이콘·짤 묶음 화면(rooms/icons.ts, hub/drafts/icons-2026-10-23.md).
 * - IconsView: 사람 탭의 세 번째 보기 — 인기·새로 올라온·내 묶음, 새 묶음 만들기.
 * - PackSheet: 묶음 하나(받기·신고, 판매 묶음은 사기, 내 것이면 올리기·빼기·지우기·판매 신청).
 * - IconPicker: 1:1·단체방·게시판 댓글에서 보낼 아이콘 고르기(받아 둔 게 없으면 그 자리에서 둘러보기).
 * - IconImage: 메시지·댓글에 붙은 아이콘 하나(공개 그림이라 주소로 바로).
 */

const errorOf = (t: IconCopy, error: unknown) => iconErrorText(t, error instanceof IconApiError ? error.code : "FAILED");
const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));

export function IconImage({ icon, size = 120 }: { icon: IconRef; size?: number }) {
  const [gone, setGone] = useState(false);
  const scale = Math.min(1, size / Math.max(icon.w, icon.h, 1));
  const width = Math.max(24, Math.round(icon.w * scale));
  const height = Math.max(24, Math.round(icon.h * scale));
  return (
    <span className="inline-flex flex-col items-start gap-0.5">
      {gone ? (
        <span className="flex items-center justify-center rounded-xl bg-white/5 text-meta text-slate-500" style={{ width, height }} aria-hidden>
          ∅
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- 움직이는 WebP를 그대로(next/image는 앱 빌드에서 못 씀).
        <img src={iconSrc(icon.pack, icon.id)} alt={icon.phrase?.text ?? ""} width={width} height={height} loading="lazy" onError={() => setGone(true)} className="rounded-xl object-contain" style={{ width, height }} />
      )}
      {icon.phrase ? (
        <span className="text-caption text-slate-200" dir="auto" lang={icon.phrase.lang}>
          {icon.phrase.text}
        </span>
      ) : null}
    </span>
  );
}

function Thumb({ pack, iconId, size = 56 }: { pack: string; iconId: string; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- 공개 WebP 주소
    <img src={iconSrc(pack, iconId)} alt="" loading="lazy" className="rounded-lg bg-white/5 object-contain" style={{ width: size, height: size }} />
  );
}

function licenseLabel(t: IconCopy, license: IconLicense) {
  return license === "cc0" ? t.cc0 : license === "app" ? t.appOnly : t.ccBy;
}

/** 목록·머리에 붙는 짧은 라이선스 이름(판매 묶음은 가격). */
function licenseShort(pack: IconPack) {
  if (isPaidPack(pack)) return `${pack.price}P`;
  return pack.license === "cc0" ? "CC0" : "CC BY 4.0";
}

/** 판매 묶음 상태(내 묶음일 때 보임). */
function saleText(t: IconCopy, pack: IconPack) {
  if (!isPaidPack(pack)) return null;
  return pack.sale === "approved" ? t.saleOn : pack.sale === "pending" ? t.salePending : pack.sale === "rejected" ? t.saleRejected : null;
}

function PackCard({ pack, t, onOpen, mineView = false }: { pack: IconPack; t: IconCopy; onOpen: () => void; mineView?: boolean }) {
  return (
    <li>
      <button type="button" onClick={onOpen} className="block w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-start">
        <span className="flex items-baseline justify-between gap-2">
          <span className="min-w-0 truncate text-note font-semibold text-ink" dir="auto">
            {pack.name}
          </span>
          <span className="shrink-0 text-meta text-slate-400">{fill(t.uses, { n: pack.uses ?? 0 })}</span>
        </span>
        {/* 조각마다 bdi: 아랍어 앱에서 라틴 이름·CC0·숫자가 한 덩어리로 섞이지 않게(점검 10-23). */}
        <span className="mt-0.5 block truncate text-meta text-slate-400">
          <bdi>{fill(t.by, { name: pack.ownerName || "?" })}</bdi> · <bdi>{licenseShort(pack)}</bdi>
          {pack.bought ? (
            <>
              {" · "}
              <bdi>{t.bought}</bdi>
            </>
          ) : pack.added ? (
            <>
              {" · "}
              <bdi>{t.collected}</bdi>
            </>
          ) : null}
          {mineView && saleText(t, pack) ? (
            <>
              {" · "}
              <bdi>{saleText(t, pack)}</bdi>
            </>
          ) : null}
        </span>
        {pack.icons.length ? (
          <span className="mt-2 flex gap-1.5 overflow-hidden">
            {pack.icons.slice(0, 6).map((icon) => (
              <Thumb key={icon.id} pack={pack.id} iconId={icon.id} size={44} />
            ))}
          </span>
        ) : null}
      </button>
    </li>
  );
}

type Sort = "popular" | "new" | "mine";

/** 사람 탭 "아이콘" 보기. */
export function IconsView({ locale, targetLanguage }: { locale: string; targetLanguage: string }) {
  const t = iconCopy(locale);
  const [sort, setSort] = useState<Sort>("popular");
  const [packs, setPacks] = useState<IconPack[] | null>(null);
  const [next, setNext] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState<IconPack | null>(null);
  const [creating, setCreating] = useState(false);

  const load = useCallback(
    async (which: Sort, offset = 0) => {
      setError("");
      try {
        if (which === "mine") {
          const { own } = await myIconPacks();
          setPacks(own);
          setNext(null);
          return;
        }
        const body = await listIconPacks(which, offset);
        setPacks((current) => (offset && current ? [...current, ...body.packs] : body.packs));
        setNext(body.packs.length ? body.next : null);
      } catch (caught) {
        setError(errorOf(t, caught));
        if (!offset) setPacks([]);
      }
    },
    [t],
  );

  useEffect(() => {
    // 처음 열 때와 보기를 바꿀 때 서버에서 목록을 받는다(바깥 데이터와 맞추기).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 서버 목록을 받아 오는 것
    void load(sort);
  }, [load, sort]);

  const replace = (pack: IconPack | null, id: string) => {
    setPacks((current) => (current ? (pack ? current.map((row) => (row.id === id ? pack : row)) : current.filter((row) => row.id !== id)) : current));
    setOpen(pack);
  };

  return (
    <div>
      <div className="mb-3 flex items-center gap-1" role="group">
        {(["popular", "new", "mine"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            aria-pressed={sort === mode}
            onClick={() => {
              setPacks(null);
              setSort(mode);
            }}
            className={`rounded-lg px-3 py-1.5 text-caption ${sort === mode ? "bg-white/15 text-ink" : "text-slate-400 hover:bg-white/10"}`}
          >
            {mode === "popular" ? t.popular : mode === "new" ? t.newest : t.mine}
          </button>
        ))}
        <button type="button" onClick={() => setCreating(true)} className="ms-auto rounded-lg border border-line px-3 py-1.5 text-caption text-ink">
          {t.newPack}
        </button>
      </div>
      {error ? <p className="mb-2 text-caption text-bad">{error}</p> : null}
      {packs === null ? (
        <p className="text-caption text-slate-500">…</p>
      ) : packs.length === 0 ? (
        <p className="text-caption text-slate-500">{t.empty}</p>
      ) : (
        <ul className="space-y-2">
          {packs.map((pack) => (
            <PackCard key={pack.id} pack={pack} t={t} mineView={sort === "mine"} onOpen={() => setOpen(pack)} />
          ))}
        </ul>
      )}
      {next !== null && packs?.length ? (
        <button type="button" onClick={() => void load(sort as "new" | "popular", next)} className="mt-3 w-full rounded-lg border border-line py-2 text-caption text-slate-200">
          {t.more}
        </button>
      ) : null}
      {open ? <PackSheet t={t} pack={open} targetLanguage={targetLanguage} onClose={() => setOpen(null)} onChanged={(pack) => replace(pack, open.id)} /> : null}
      {creating ? (
        <CreatePackSheet
          t={t}
          onClose={() => setCreating(false)}
          onCreated={(pack) => {
            setCreating(false);
            setSort("mine");
            setOpen(pack);
          }}
        />
      ) : null}
    </div>
  );
}

function Sheet({ title, onClose, closeLabel, children }: { title: string; onClose: () => void; closeLabel: string; children: React.ReactNode }) {
  return (
    <BodyLayer>
      <div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/70" onClick={onClose} role="dialog" aria-label={title}>
        <div
          className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-line bg-surface px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-3"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-3 flex items-center gap-2">
            <h2 className="min-w-0 flex-1 truncate text-title font-semibold text-ink" dir="auto">
              {title}
            </h2>
            <button type="button" onClick={onClose} aria-label={closeLabel} className="shrink-0 rounded-full px-2 text-title text-slate-400 hover:bg-white/10">
              ×
            </button>
          </div>
          {children}
        </div>
      </div>
    </BodyLayer>
  );
}

function CreatePackSheet({ t, onClose, onCreated }: { t: IconCopy; onClose: () => void; onCreated: (pack: IconPack) => void }) {
  const [name, setName] = useState("");
  const [license, setLicense] = useState<IconLicense>("cc-by-4.0");
  // 가격은 직접 넣는다(사용자 2026-10-24 "선택이 아니라 입력"): 무료 | 판매 → 판매면 숫자 칸.
  const [selling, setSelling] = useState(false);
  const [priceText, setPriceText] = useState("");
  const price = selling ? Number(priceText) : 0;
  const priceOk = !selling || (priceText.trim() !== "" && isIconPrice(price) && price > 0);
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const create = async () => {
    if (!name.trim() || !agree || !priceOk || busy) return;
    setBusy(true);
    setError("");
    try {
      onCreated((await createIconPack(name.trim(), license, price)).pack);
    } catch (caught) {
      setError(errorOf(t, caught));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Sheet title={t.newPack.replace(/^\+\s*/, "")} onClose={onClose} closeLabel={t.close}>
      <label className="block text-caption text-slate-400">
        {t.packName}
        <input
          value={name}
          maxLength={PACK_NAME_MAX}
          onChange={(event) => setName(event.target.value)}
          dir="auto"
          className="mt-1 block w-full rounded-lg border border-line bg-surface-sunk px-3 py-2 text-note text-ink outline-none focus:border-white/40"
        />
      </label>
      <fieldset className="mt-3">
        <legend className="text-caption text-slate-400">{t.price}</legend>
        <div className="mt-1 flex gap-1.5">
          {[false, true].map((value) => (
            <button
              key={String(value)}
              type="button"
              aria-pressed={selling === value}
              onClick={() => {
                // 무료 ↔ 판매를 바꾸면 동의 글이 달라져 다시 체크하게.
                if (value !== selling) setAgree(false);
                setSelling(value);
              }}
              className={`flex-1 rounded-lg border px-2 py-2 text-note ${selling === value ? "border-white/40 bg-white/10 text-ink" : "border-line text-slate-200"}`}
            >
              {value ? t.forSale : t.free}
            </button>
          ))}
        </div>
        {selling ? (
          // 숫자와 P는 아랍어 앱에서도 "12 … P" 순서로(dir ltr).
          <label dir="ltr" className="mt-1.5 flex items-center gap-2 rounded-lg border border-line bg-surface-sunk px-3 py-2 focus-within:border-white/40">
            <input
              type="number"
              inputMode="numeric"
              min={ICON_PRICE_MIN}
              max={ICON_PRICE_MAX}
              step={1}
              value={priceText}
              onChange={(event) => setPriceText(event.target.value.replace(/[^0-9]/g, "").slice(0, 3))}
              placeholder={`${ICON_PRICE_MIN}–${ICON_PRICE_MAX}`}
              aria-label={t.price}
              className="min-w-0 flex-1 bg-transparent text-note text-ink outline-none placeholder:text-slate-500"
            />
            <span className="shrink-0 text-note text-slate-300">P</span>
          </label>
        ) : null}
        {selling && priceText.trim() !== "" && !priceOk ? <p className="mt-1 text-caption text-bad">{fill(t.badPrice, { min: ICON_PRICE_MIN, max: ICON_PRICE_MAX })}</p> : null}
      </fieldset>
      <fieldset className="mt-3">
        <legend className="text-caption text-slate-400">{t.license}</legend>
        {selling ? <p className="mt-1 rounded-lg border border-white/40 bg-white/10 px-3 py-2 text-note text-ink">{t.appOnly}</p> : null}
        <div className={`mt-1 space-y-1 ${selling ? "hidden" : ""}`}>
          {ICON_LICENSES.map((value) => (
            <label key={value} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-note ${license === value ? "border-white/40 bg-white/10 text-ink" : "border-line text-slate-200"}`}>
              <input type="radio" name="icon-license" checked={license === value} onChange={() => setLicense(value)} />
              <span className="min-w-0 flex-1">{licenseLabel(t, value)}</span>
              <a href={ICON_LICENSE_URL[value]} target="_blank" rel="noreferrer" className="shrink-0 text-meta text-info" onClick={(event) => event.stopPropagation()}>
                ↗
              </a>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="mt-3 flex items-start gap-2 text-caption text-slate-200">
        <input type="checkbox" checked={agree} onChange={(event) => setAgree(event.target.checked)} className="mt-0.5" />
        <span>{selling ? t.agreeSale : t.agree}</span>
      </label>
      {error ? <p className="mt-2 text-caption text-bad">{error}</p> : null}
      <button type="button" disabled={!name.trim() || !agree || !priceOk || busy} onClick={() => void create()} className="mt-3 w-full rounded-lg bg-platinum py-2.5 text-note font-semibold text-black hover:bg-platinum-hover disabled:opacity-40">
        {t.create}
      </button>
    </Sheet>
  );
}

function PackSheet({
  t,
  pack: initial,
  targetLanguage,
  onClose,
  onChanged,
}: {
  t: IconCopy;
  pack: IconPack;
  targetLanguage: string;
  onClose: () => void;
  onChanged: (pack: IconPack | null) => void;
}) {
  const me = readCachedAccount()?.id ?? null;
  const [pack, setPack] = useState(initial);
  const own = me === pack.owner;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [phrase, setPhrase] = useState("");
  const [reporting, setReporting] = useState(false);
  const [reason, setReason] = useState("");
  const [reported, setReported] = useState(false);
  const [editing, setEditing] = useState(false);
  const picker = useRef<HTMLInputElement>(null);
  const billing = useBillingUiOptional();
  // 편집기(IconEditor): undefined = 닫힘, null = 새로, {iconId} = 내 아이콘 고치기(올린 뒤 예전 것은 뺀다).
  const [editor, setEditor] = useState<{ iconId: string } | null | undefined>(undefined);
  const [editorError, setEditorError] = useState("");
  const [short, setShort] = useState(false);
  const paid = isPaidPack(pack);
  // 판매 묶음은 사야(또는 내 것이어야) 받아 두고 보낸다. 안 산 사람은 그림 미리 보기만.
  const locked = paid && !own && !pack.bought;

  const update = (next: IconPack) => {
    const merged = { ...pack, ...next, uses: pack.uses, ownerName: pack.ownerName, added: next.added ?? pack.added, bought: next.bought ?? pack.bought };
    setPack(merged);
    onChanged(merged);
  };

  const run = async (work: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    setError("");
    setShort(false);
    try {
      await work();
    } catch (caught) {
      setError(errorOf(t, caught));
      if (caught instanceof IconApiError && caught.code === "NO_POINTS") setShort(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Sheet title={pack.name} onClose={onClose} closeLabel={t.close}>
      <p className="-mt-2 mb-3 text-meta text-slate-400">
        <bdi>{fill(t.by, { name: pack.ownerName || "?" })}</bdi> ·{" "}
        {pack.license === "app" ? (
          <bdi>{t.appOnly}</bdi>
        ) : (
          <a href={ICON_LICENSE_URL[pack.license]} target="_blank" rel="noreferrer" className="text-info">
            <bdi>{licenseShort(pack)}</bdi>
          </a>
        )}{" "}
        · <bdi>{fill(t.count, { n: pack.icons.length })}</bdi> · <bdi>{fill(t.uses, { n: pack.uses ?? 0 })}</bdi>
      </p>
      {pack.icons.length ? (
        <ul className="grid grid-cols-4 gap-2">
          {pack.icons.map((icon) => (
            <li key={icon.id} className="flex flex-col items-center gap-1">
              <Thumb pack={pack.id} iconId={icon.id} size={72} />
              {icon.phrase ? (
                <span className="line-clamp-1 text-meta text-slate-200" dir="auto" lang={icon.phrase.lang}>
                  {icon.phrase.text}
                </span>
              ) : null}
              {own && editing ? (
                <span className="flex gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      setEditorError("");
                      setPhrase(icon.phrase?.text ?? "");
                      setEditor({ iconId: icon.id });
                    }}
                    className="text-meta text-info"
                  >
                    {t.editIcon}
                  </button>
                  <button type="button" disabled={busy} onClick={() => void run(async () => update((await removeIconFromPack(pack.id, icon.id)).pack))} className="text-meta text-bad">
                    {t.remove}
                  </button>
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-caption text-slate-500">{t.empty}</p>
      )}
      {error ? (
        <p className="mt-2 flex items-center gap-2 text-caption text-bad">
          <span className="min-w-0 flex-1">{error}</span>
          {short && billing ? (
            <button type="button" onClick={billing.openBilling} className="shrink-0 rounded-lg border border-line px-2.5 py-1 text-caption text-ink">
              {t.getPoints}
            </button>
          ) : null}
        </p>
      ) : null}

      {own && paid ? (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-surface-sunk px-3 py-2 text-caption">
          <span className="min-w-0 flex-1 text-slate-200">
            <bdi>{pack.price}P</bdi>
            {saleText(t, pack) ? (
              <>
                {" · "}
                <bdi>{saleText(t, pack)}</bdi>
              </>
            ) : null}
          </span>
          {pack.sale !== "approved" && pack.sale !== "pending" ? (
            <button
              type="button"
              disabled={busy || !pack.icons.length}
              onClick={() => void run(async () => update((await sellIconPack(pack.id)).pack))}
              className="shrink-0 rounded-lg bg-platinum px-3 py-1.5 text-caption font-semibold text-black hover:bg-platinum-hover disabled:opacity-40"
            >
              {t.sell}
            </button>
          ) : null}
        </div>
      ) : null}

      {own ? (
        <div className="mt-4 space-y-2">
          {pack.icons.length < ICONS_PER_PACK ? (
            <>
              <input
                value={phrase}
                maxLength={ICON_PHRASE_MAX}
                onChange={(event) => setPhrase(event.target.value)}
                placeholder={t.phrase}
                dir="auto"
                className="block w-full rounded-lg border border-line bg-surface-sunk px-3 py-2 text-note text-ink outline-none placeholder:text-slate-500 focus:border-white/40"
              />
              <input
                ref={picker}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (!file) return;
                  void run(async () => {
                    update((await uploadIcon(pack.id, file, { lang: targetLanguage, text: phrase })).pack);
                    setPhrase("");
                  });
                }}
              />
              <div className="flex gap-2">
                <button type="button" disabled={busy} onClick={() => picker.current?.click()} className="flex-1 rounded-lg bg-platinum py-2.5 text-note font-semibold text-black hover:bg-platinum-hover disabled:opacity-40">
                  {busy ? t.uploading : t.addIcon}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setEditorError("");
                    setEditor(null);
                  }}
                  className="flex-1 rounded-lg border border-line py-2.5 text-note font-semibold text-ink disabled:opacity-40"
                >
                  {t.make}
                </button>
              </div>
            </>
          ) : (
            <p className="text-caption text-slate-400">{t.full}</p>
          )}
          <div className="flex gap-2">
            {pack.icons.length ? (
              <button type="button" onClick={() => setEditing((value) => !value)} aria-pressed={editing} className="flex-1 rounded-lg border border-line py-2 text-caption text-slate-200">
                {t.remove}
              </button>
            ) : null}
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                void run(async () => {
                  await deleteIconPack(pack.id);
                  onChanged(null);
                })
              }
              className="flex-1 rounded-lg border border-bad/40 py-2 text-caption text-bad"
            >
              {t.deletePack}
            </button>
          </div>
        </div>
      ) : me && !isBuiltinPack(pack.id) ? (
        <div className="mt-4 space-y-2">
          {locked ? (
            <button
              type="button"
              disabled={busy || pack.sale !== "approved"}
              onClick={() => void run(async () => update({ ...(await buyIconPack(pack.id)).pack, bought: true, added: true }))}
              className="w-full rounded-lg bg-platinum py-2.5 text-note font-semibold text-black hover:bg-platinum-hover disabled:opacity-40"
            >
              <bdi>{fill(t.buy, { n: pack.price ?? 0 })}</bdi>
            </button>
          ) : (
            <button
              type="button"
              disabled={busy}
              aria-pressed={Boolean(pack.added)}
              onClick={() => void run(async () => update({ ...pack, added: (await collectIconPack(pack.id, !pack.added)).collection.includes(pack.id) }))}
              className={`w-full rounded-lg py-2.5 text-note font-semibold disabled:opacity-40 ${pack.added ? "border border-line text-ink" : "bg-platinum text-black hover:bg-platinum-hover"}`}
            >
              {pack.added ? t.collected : t.collect}
            </button>
          )}
          {reported ? (
            <p className="text-caption text-slate-400">{t.reportSent}</p>
          ) : reporting ? (
            <div className="space-y-2">
              <input
                value={reason}
                maxLength={300}
                onChange={(event) => setReason(event.target.value)}
                placeholder={t.reportReason}
                dir="auto"
                className="block w-full rounded-lg border border-line bg-surface-sunk px-3 py-2 text-note text-ink outline-none placeholder:text-slate-500 focus:border-white/40"
              />
              <button
                type="button"
                disabled={!reason.trim() || busy}
                onClick={() =>
                  void run(async () => {
                    await reportIconPack(pack.id, reason.trim());
                    setReported(true);
                  })
                }
                className="w-full rounded-lg border border-bad/40 py-2 text-caption text-bad disabled:opacity-40"
              >
                {t.report}
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setReporting(true)} className="text-meta text-slate-400">
              {t.report}
            </button>
          )}
        </div>
      ) : null}
      {editor !== undefined ? (
        <IconEditor
          t={t}
          start={editor ? iconSrc(pack.id, editor.iconId) : null}
          busy={busy}
          error={editorError}
          onClose={() => setEditor(undefined)}
          onSave={(dataUrl, motion) => {
            if (busy) return;
            setBusy(true);
            setEditorError("");
            void (async () => {
              try {
                let next = (await uploadEditedIcon(pack.id, dataUrl, { lang: targetLanguage, text: phrase }, motion)).pack;
                // 고친 것이면 예전 아이콘을 뺀다(새 것은 묶음 끝에 붙음).
                if (editor) next = (await removeIconFromPack(pack.id, editor.iconId)).pack;
                update(next);
                setPhrase("");
                setEditor(undefined);
              } catch (caught) {
                setEditorError(errorOf(t, caught));
              } finally {
                setBusy(false);
              }
            })();
          }}
        />
      ) : null}
    </Sheet>
  );
}

/** 보낼 아이콘 고르기(입력창의 🙂). 고르면 바로 onPick. */
export function IconPicker({ locale, targetLanguage, onPick, onClose }: { locale: string; targetLanguage: string; onPick: (icon: { pack: string; id: string }) => void; onClose: () => void }) {
  const t = iconCopy(locale);
  const [packs, setPacks] = useState<IconPack[] | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [browsing, setBrowsing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const { packs: found } = await myIconPacks();
      setPacks(found);
      setActive((current) => (current && found.some((pack) => pack.id === current) ? current : (found[0]?.id ?? null)));
    } catch (caught) {
      setError(errorOf(t, caught));
      setPacks([]);
    }
  }, [t]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 서버 목록을 받아 오는 것
    void load();
  }, [load]);

  const current = packs?.find((pack) => pack.id === active) ?? null;
  return (
    <Sheet title={t.tab} onClose={onClose} closeLabel={t.close}>
      {browsing ? (
        <>
          <button type="button" onClick={() => {
            setBrowsing(false);
            void load();
          }} className="mb-2 text-caption text-slate-300">
            ‹ {t.tab}
          </button>
          <IconsView locale={locale} targetLanguage={targetLanguage} />
        </>
      ) : (
        <>
          {error ? <p className="mb-2 text-caption text-bad">{error}</p> : null}
          {packs === null ? (
            <p className="text-caption text-slate-500">…</p>
          ) : packs.length === 0 ? (
            <p className="text-caption text-slate-500">{t.empty}</p>
          ) : (
            <>
              <div className="mb-2 flex gap-1 overflow-x-auto pb-1">
                {packs.map((pack) => (
                  <button
                    key={pack.id}
                    type="button"
                    aria-pressed={pack.id === active}
                    onClick={() => setActive(pack.id)}
                    className={`flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-caption ${pack.id === active ? "bg-white/15 text-ink" : "text-slate-400"}`}
                  >
                    {pack.icons[0] ? <Thumb pack={pack.id} iconId={pack.icons[0].id} size={24} /> : null}
                    <span className="max-w-[7rem] truncate" dir="auto">
                      {pack.name}
                    </span>
                  </button>
                ))}
              </div>
              {current ? (
                <ul className="grid grid-cols-4 gap-2">
                  {current.icons.map((icon) => (
                    <li key={icon.id}>
                      <button type="button" onClick={() => onPick({ pack: current.id, id: icon.id })} className="flex w-full flex-col items-center gap-0.5 rounded-lg p-1 hover:bg-white/10" aria-label={icon.phrase?.text ?? current.name}>
                        <Thumb pack={current.id} iconId={icon.id} size={64} />
                        {icon.phrase ? (
                          <span className="line-clamp-1 text-meta text-slate-300" dir="auto" lang={icon.phrase.lang}>
                            {icon.phrase.text}
                          </span>
                        ) : null}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </>
          )}
          <button type="button" onClick={() => setBrowsing(true)} className="mt-3 w-full rounded-lg border border-line py-2 text-caption text-slate-200">
            {t.browse}
          </button>
        </>
      )}
    </Sheet>
  );
}

/** 입력창의 🙂 버튼 + 고르기 시트. */
export function IconButton({ locale, targetLanguage, disabled, onPick }: { locale: string; targetLanguage: string; disabled?: boolean; onPick: (icon: { pack: string; id: string }) => void }) {
  const [open, setOpen] = useState(false);
  const t = iconCopy(locale);
  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        aria-label={t.tab}
        title={t.tab}
        className="shrink-0 rounded-xl border border-white/15 px-2.5 text-chat text-slate-200 disabled:opacity-40"
      >
        🙂
      </button>
      {open ? (
        <IconPicker
          locale={locale}
          targetLanguage={targetLanguage}
          onClose={() => setOpen(false)}
          onPick={(icon) => {
            setOpen(false);
            onPick(icon);
          }}
        />
      ) : null}
    </>
  );
}

