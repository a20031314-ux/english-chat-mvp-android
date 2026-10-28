"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { UICopy } from "@/lib/copy";
import { FactsEditor, ShowToggles } from "./ProfileFacts";
import { factsOf, showOf, type ProfileFacts, type ProfileShow } from "@/lib/account/profileFacts";
import { profileCopy } from "@/lib/account/profileCopy";
import { BodyLayer } from "@/components/FullScreenLayer";
import { useLearningLanguageOptional } from "@/contexts/LearningLanguageContext";
import { pingPresence } from "@/lib/rooms/client";
import { socialFeaturesEnabled } from "@/lib/platform";
import { readCachedAccount, readAuthToken, subscribeSession } from "@/lib/account/session";
import {
  AccountRequestError,
  deleteAccount,
  fetchAuthConfig,
  changePassword,
  googleLogin,
  logout,
  passwordLogin,
  passwordSignup,
  refreshAccount,
  saveProfile,
  startEmailLogin,
  verifyEmailLogin,
  type AccountError,
} from "@/lib/account/client";
import {
  BIO_MAX,
  EMAIL_CODE_LENGTH,
  NICKNAME_MAX,
  PASSWORD_MAX,
  PASSWORD_MIN,
  PHOTO_MAX_BYTES,
  USERNAME_MAX,
  isPasswordOk,
  normalizeUsername,
  cleanBio,
  cleanNickname,
  normalizeEmail,
  visibleLength,
  type AuthConfig,
  type PublicAccount,
} from "@/lib/account/shared";

/**
 * 프로필 탭 맨 위의 계정 카드.
 *
 * 로그인하지 않았으면 왜 로그인하면 좋은지 한 줄과 버튼, 했으면 사진·닉네임·
 * 자기소개. 누르면 시트: 로그인(Google / 이메일 코드) 또는 프로필 편집.
 * 로그인은 선택이다 — 하지 않아도 앱은 지금처럼 쓴다.
 */

function useAccount(): PublicAccount | null {
  return useSyncExternalStore(subscribeSession, readCachedAccount, () => null);
}

function errorText(ui: UICopy, code: AccountError | null): string | null {
  switch (code) {
    case null:
    case "GOOGLE_CANCELLED":
      return null;
    case "INVALID_EMAIL":
      return ui.accountErrorEmail;
    case "RATE_LIMITED":
    case "TOO_MANY_TRIES":
      return ui.accountErrorRate;
    case "SEND_FAILED":
      return ui.accountErrorSend;
    case "WRONG_CODE":
      return ui.accountErrorCode;
    case "CODE_EXPIRED":
      return ui.accountErrorExpired;
    case "GOOGLE_FAILED":
      return ui.accountErrorGoogle;
    case "PHOTO_INVALID":
      return ui.accountErrorPhoto;
    case "USERNAME_INVALID":
      return ui.accountErrorUsername;
    case "USERNAME_TAKEN":
      return ui.accountErrorTaken;
    case "PASSWORD_WEAK":
      return ui.accountErrorPasswordWeak;
    case "WRONG_PASSWORD":
      return ui.accountErrorPassword;
    default:
      return ui.accountErrorNetwork;
  }
}

function codeOf(error: unknown): AccountError {
  return error instanceof AccountRequestError ? error.code : "NETWORK";
}

function Avatar({ account, size }: { account: PublicAccount | null; size: number }) {
  const photo = account?.profile.photo;
  const letter = Array.from(account?.profile.nickname || account?.username || account?.email || "?")[0]?.toUpperCase() ?? "?";
  return photo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={photo}
      alt=""
      width={size}
      height={size}
      className="shrink-0 rounded-full border border-white/15 object-cover"
      style={{ width: size, height: size }}
    />
  ) : (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] font-semibold text-slate-200"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {account ? letter : (
        <svg viewBox="0 0 20 20" width={size * 0.5} height={size * 0.5} fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="10" cy="7" r="3.2" />
          <path d="M3.5 17c1.2-3 3.7-4.5 6.5-4.5s5.3 1.5 6.5 4.5" strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
}

export function AccountCard({ ui, locale }: { ui: UICopy; locale: string }) {
  const account = useAccount();
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<AuthConfig | null>(null);

  useEffect(() => {
    void fetchAuthConfig().then(setConfig);
    if (readAuthToken()) void refreshAccount();
  }, []);

  // 로그인한 채로 앱을 열면 "최근에 쓴 사람"으로(말하는 방 → 사람 목록). 실패해도 조용히.
  const learning = useLearningLanguageOptional()?.targetLanguage;
  const signedIn = Boolean(account);
  useEffect(() => {
    if (signedIn && learning && socialFeaturesEnabled()) pingPresence({ learn: learning, ui: locale });
  }, [signedIn, learning, locale]);

  // 로그인 직후 한 번: 로그인하려고 연 시트에서 계정이 생기면 나를 소개하는 칩 화면. 이미 사실을 정한 계정은 건너뛴다.
  const [openedSignedOut, setOpenedSignedOut] = useState(false);
  const [setupDone, setSetupDone] = useState<string | null>(null);
  const setup = Boolean(
    open && openedSignedOut && account && setupDone !== account.id && isEmptyFacts(factsOf(account.profile.facts)),
  );
  const setSetup = (value: false) => {
    if (!value && account) setSetupDone(account.id);
  };

  const canSignIn = Boolean(config && (config.password || config.googleClientId || config.email));
  // 로그인 방식이 하나도 켜지지 않았으면(서버 설정 전) 카드를 숨긴다.
  if (!account && !canSignIn) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpenedSignedOut(!account);
          setOpen(true);
        }}
        className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-3 text-start hover:bg-white/[0.06]"
      >
        <Avatar account={account} size={44} />
        <span className="min-w-0 flex-1">
          {account ? (
            <>
              <span dir="auto" className="block truncate text-[15px] font-semibold text-white">
                {account.profile.nickname || ui.accountNoNickname}
              </span>
              {/* No bio: leave it empty — no prompt text in its place (hub/DESIGN.md, 2026-10-23). */}
              {account.profile.bio ? (
                <span dir="auto" className="mt-0.5 line-clamp-2 block whitespace-pre-line text-[12px] leading-relaxed text-slate-400">
                  {account.profile.bio}
                </span>
              ) : null}
            </>
          ) : (
            <>
              <span className="block text-[14px] font-semibold text-white">{ui.accountSignInTitle}</span>
            </>
          )}
        </span>
        <span className="shrink-0 rounded-lg border border-white/15 px-2.5 py-1.5 text-[12px] text-slate-200">
          {account ? ui.accountEdit : ui.accountSignIn}
        </span>
      </button>
      {open ? (
        <BodyLayer>
          <div
            className="fixed inset-0 z-[85] flex items-end justify-center bg-black/60 p-3 sm:items-center"
            onClick={() => setOpen(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={account ? ui.accountProfileTitle : ui.accountLoginTitle}
              className="flex max-h-[88%] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#121212] shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              {account ? (
                setup ? (
                  <FactsSetup locale={locale} account={account} onDone={() => setSetup(false)} />
                ) : (
                  <ProfileEditor ui={ui} locale={locale} account={account} onClose={() => setOpen(false)} />
                )
              ) : (
                <LoginPanel ui={ui} locale={locale} config={config} onClose={() => setOpen(false)} />
              )}
            </div>
          </div>
        </BodyLayer>
      ) : null}
    </>
  );
}

function SheetHeader({ title, onClose, closeLabel, action }: {
  title: string;
  onClose: () => void;
  closeLabel: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2 border-b border-white/10 px-3 py-2">
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10"
      >
        {closeLabel}
      </button>
      <h2 className="min-w-0 flex-1 truncate text-center text-sm font-semibold text-white">{title}</h2>
      {action ?? <span className="w-[3.25rem]" />}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-white/15 bg-[#0a0a0a] px-3 py-2.5 text-[14px] text-slate-100 outline-none placeholder:text-slate-600 focus:border-white/30";
const primaryClass =
  "w-full rounded-lg bg-[#e8e8e4] px-3 py-2.5 text-[14px] font-medium text-neutral-900 hover:bg-white disabled:opacity-50";

function LoginPanel({ ui, locale, config, onClose }: {
  ui: UICopy;
  locale: string;
  config: AuthConfig | null;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<AccountError | null>(null);
  // Google 로그인이 왜 안 됐는지(플러그인·서버가 준 원인 한 줄) — 기기에서 바로 가려내려고 작게 보인다.
  const [detail, setDetail] = useState("");
  const codeRef = useRef<HTMLInputElement>(null);

  const run = async (task: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    setDetail("");
    try {
      await task();
    } catch (caught) {
      setError(codeOf(caught));
      setDetail(caught instanceof AccountRequestError ? caught.detail : "");
      setBusy(false);
    }
  };

  const send = (address: string) =>
    run(async () => {
      const clean = normalizeEmail(address);
      if (!clean) throw new AccountRequestError("INVALID_EMAIL");
      await startEmailLogin(clean, locale);
      setSentTo(clean);
      setCode("");
      setBusy(false);
      setTimeout(() => codeRef.current?.focus(), 50);
    });

  const message = errorText(ui, error);
  const nothing = config && !config.password && !config.googleClientId && !config.email;
  const others = Boolean(config?.googleClientId || config?.email);

  const submitPassword = () =>
    run(async () => {
      const name = normalizeUsername(username);
      if (!name) throw new AccountRequestError("USERNAME_INVALID");
      if (mode === "signup") {
        if (!isPasswordOk(password)) throw new AccountRequestError("PASSWORD_WEAK");
        await passwordSignup(name, password);
      } else {
        await passwordLogin(name, password);
      }
    });

  return (
    <>
      <SheetHeader title={ui.accountLoginTitle} onClose={onClose} closeLabel={ui.accountClose} />
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <p className="text-[12px] leading-relaxed text-slate-400">{ui.accountLoginHint}</p>
        {nothing ? <p className="mt-4 text-[13px] text-amber-200">{ui.accountUnavailable}</p> : null}

        {config?.password && !sentTo ? (
          <form
            className="mt-4"
            onSubmit={(event) => {
              event.preventDefault();
              void submitPassword();
            }}
          >
            <label className="block text-[12px] text-slate-400">
              {ui.accountUsername}
              <input
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                dir="ltr"
                maxLength={USERNAME_MAX}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className={`${inputClass} mt-1`}
              />
            </label>
            {mode === "signup" ? <p className="mt-1 text-[11px] text-slate-500">{ui.accountUsernameHint}</p> : null}
            <label className="mt-3 block text-[12px] text-slate-400">
              {ui.accountPassword}
              <input
                type="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                dir="ltr"
                maxLength={PASSWORD_MAX}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={`${inputClass} mt-1`}
              />
            </label>
            {mode === "signup" ? (
              <p className="mt-1 text-[11px] text-slate-500">{ui.accountPasswordHint.replace("{n}", String(PASSWORD_MIN))}</p>
            ) : null}
            {mode === "signup" ? (
              <p className="mt-3 rounded-lg border border-amber-200/30 bg-amber-200/5 px-3 py-2 text-[12px] leading-relaxed text-amber-100">
                {ui.accountSignupWarn}
              </p>
            ) : null}
            <button type="submit" disabled={busy || !username.trim() || !password} className={`${primaryClass} mt-3`}>
              {busy ? ui.accountWorking : mode === "signup" ? ui.accountSignupSubmit : ui.accountSignIn}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError(null);
              }}
              className="mt-3 w-full text-center text-[13px] text-slate-300 underline underline-offset-4"
            >
              {mode === "login" ? ui.accountToSignup : ui.accountToLogin}
            </button>
          </form>
        ) : null}

        {config?.password && others && !sentTo ? (
          <div className="my-4 flex items-center gap-3 text-[11px] text-slate-500">
            <span className="h-px flex-1 bg-white/10" />
            {ui.accountOr}
            <span className="h-px flex-1 bg-white/10" />
          </div>
        ) : null}

        {config?.googleClientId && !sentTo ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => void run(() => googleLogin(config.googleClientId!))}
            className={`${config.password ? "" : "mt-4 "}flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white px-3 py-2.5 text-[14px] font-medium text-neutral-900 disabled:opacity-50`}
          >
            <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden>
              <path fill="#4285F4" d="M17.6 9.2c0-.6-.1-1.2-.2-1.7H9v3.3h4.8a4.1 4.1 0 0 1-1.8 2.7v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.5Z" />
              <path fill="#34A853" d="M9 18c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.5-1.8.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H.9v2.3A9 9 0 0 0 9 18Z" />
              <path fill="#FBBC05" d="M3.9 10.7a5.4 5.4 0 0 1 0-3.4V5H.9a9 9 0 0 0 0 8l3-2.3Z" />
              <path fill="#EA4335" d="M9 3.6c1.3 0 2.5.5 3.5 1.4L15 2.4A9 9 0 0 0 .9 5l3 2.3C4.6 5.2 6.6 3.6 9 3.6Z" />
            </svg>
            {ui.accountGoogle}
          </button>
        ) : null}

        {config?.googleClientId && config.email && !sentTo ? (
          <div className="my-4 flex items-center gap-3 text-[11px] text-slate-500">
            <span className="h-px flex-1 bg-white/10" />
            {ui.accountOr}
            <span className="h-px flex-1 bg-white/10" />
          </div>
        ) : null}

        {config?.email && !sentTo ? (
          <form
            className={config.googleClientId || config.password ? "" : "mt-4"}
            onSubmit={(event) => {
              event.preventDefault();
              void send(email);
            }}
          >
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              dir="ltr"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={ui.accountEmailPlaceholder}
              className={inputClass}
            />
            <button type="submit" disabled={busy || !email.trim()} className={`${primaryClass} mt-2`}>
              {busy ? ui.accountWorking : ui.accountEmailSend}
            </button>
          </form>
        ) : null}

        {sentTo ? (
          <form
            className="mt-4"
            onSubmit={(event) => {
              event.preventDefault();
              void run(() => verifyEmailLogin(sentTo, code));
            }}
          >
            <p className="text-[13px] leading-relaxed text-slate-200">
              {ui.accountCodeSent.split("{email}")[0]}
              <bdi dir="ltr" className="font-medium text-white">{sentTo}</bdi>
              {ui.accountCodeSent.split("{email}")[1] ?? ""}
            </p>
            <input
              ref={codeRef}
              inputMode="numeric"
              autoComplete="one-time-code"
              dir="ltr"
              maxLength={EMAIL_CODE_LENGTH}
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
              placeholder={ui.accountCodePlaceholder}
              className={`${inputClass} mt-3 text-center text-[18px] tracking-[0.4em]`}
            />
            <button type="submit" disabled={busy || code.length !== EMAIL_CODE_LENGTH} className={`${primaryClass} mt-2`}>
              {busy ? ui.accountWorking : ui.accountCodeConfirm}
            </button>
            <div className="mt-3 flex justify-between text-[12px]">
              <button type="button" disabled={busy} onClick={() => setSentTo(null)} className="text-slate-400 underline underline-offset-4">
                {ui.accountChangeEmail}
              </button>
              <button type="button" disabled={busy} onClick={() => void send(sentTo)} className="text-slate-400 underline underline-offset-4">
                {ui.accountCodeResend}
              </button>
            </div>
          </form>
        ) : null}

        {message ? <p className="mt-3 text-[12px] text-rose-300">{message}</p> : null}
        {message && detail ? (
          <p className="mt-1 break-all text-meta text-slate-500" dir="ltr">
            {detail}
          </p>
        ) : null}
      </div>
    </>
  );
}

/** 256px 정사각형 JPEG로 줄인다 — 가운데를 잘라서. */
async function shrinkPhoto(file: File): Promise<string | null> {
  const url = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = reject;
      element.src = url;
    });
    const side = Math.min(image.naturalWidth, image.naturalHeight);
    if (!side) return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.drawImage(
      image,
      (image.naturalWidth - side) / 2,
      (image.naturalHeight - side) / 2,
      side,
      side,
      0,
      0,
      256,
      256,
    );
    for (const quality of [0.85, 0.7, 0.55, 0.4]) {
      const out = canvas.toDataURL("image/jpeg", quality);
      if (Math.floor(((out.length - out.indexOf(",") - 1) * 3) / 4) <= PHOTO_MAX_BYTES) return out;
    }
    return null;
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function ProfileEditor({ ui, locale, account, onClose }: { ui: UICopy; locale: string; account: PublicAccount; onClose: () => void }) {
  const [nickname, setNickname] = useState(account.profile.nickname);
  const [facts, setFacts] = useState<ProfileFacts>(() => factsOf(account.profile.facts));
  const [show, setShow] = useState<ProfileShow>(() => showOf(account.profile.show));
  const [bio, setBio] = useState(account.profile.bio);
  const [hidden, setHidden] = useState(account.profile.hidden === true);
  const [receipts, setReceipts] = useState(account.profile.readReceipts !== false);
  // undefined = 그대로, null = 빼기, 글자 = 새 사진
  const [photo, setPhoto] = useState<string | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<AccountError | null>(null);
  const [confirm, setConfirm] = useState<"logout" | "delete" | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const shownPhoto = photo === undefined ? account.profile.photo : photo;
  const preview: PublicAccount = { ...account, profile: { ...account.profile, nickname, photo: shownPhoto } };
  const changed =
    photo !== undefined ||
    cleanNickname(nickname) !== account.profile.nickname ||
    cleanBio(bio) !== account.profile.bio ||
    hidden !== (account.profile.hidden === true) ||
    receipts !== (account.profile.readReceipts !== false) ||
    JSON.stringify(facts) !== JSON.stringify(factsOf(account.profile.facts)) ||
    JSON.stringify(show) !== JSON.stringify(showOf(account.profile.show));

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      await saveProfile({ nickname, bio, hidden, readReceipts: receipts, facts, show, ...(photo === undefined ? {} : { photo }) });
      setPhoto(undefined);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (caught) {
      setError(codeOf(caught));
    } finally {
      setBusy(false);
    }
  };

  const finish = async (what: "logout" | "delete") => {
    setBusy(true);
    setError(null);
    try {
      if (what === "logout") await logout();
      else await deleteAccount();
    } catch (caught) {
      setError(codeOf(caught));
      setBusy(false);
    }
  };

  const signedIn = account.username ?? account.email ?? (account.google ? "Google" : "");
  const message = errorText(ui, error);

  return (
    <>
      <SheetHeader
        title={ui.accountProfileTitle}
        onClose={onClose}
        closeLabel={ui.accountClose}
        action={
          <button
            type="button"
            onClick={() => void save()}
            disabled={busy || !changed}
            className="rounded-lg bg-[#e8e8e4] px-3 py-1.5 text-xs font-medium text-neutral-900 hover:bg-white disabled:opacity-50"
          >
            {saved ? ui.accountSaved : ui.accountSave}
          </button>
        }
      />
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <Avatar account={preview} size={72} />
          <div className="flex flex-col items-start gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-full border border-white/15 px-3 py-1 text-[12px] text-slate-200 hover:bg-white/10"
            >
              {ui.accountPhotoChange}
            </button>
            {shownPhoto ? (
              <button
                type="button"
                onClick={() => setPhoto(null)}
                className="rounded-full border border-white/15 px-3 py-1 text-[12px] text-slate-400 hover:bg-white/10"
              >
                {ui.accountPhotoRemove}
              </button>
            ) : null}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (!file) return;
                const shrunk = await shrinkPhoto(file);
                if (shrunk) setPhoto(shrunk);
                else setError("PHOTO_INVALID");
              }}
            />
          </div>
        </div>

        <label className="mt-5 block">
          <span className="flex justify-between text-[12px] text-slate-400">
            {ui.accountNickname}
            <span dir="ltr" className="tabular-nums text-slate-600">{visibleLength(nickname)}/{NICKNAME_MAX}</span>
          </span>
          <input
            dir="auto"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            className={`${inputClass} mt-1.5`}
          />
        </label>

        <label className="mt-4 block">
          <span className="flex justify-between text-[12px] text-slate-400">
            {ui.accountBio}
            <span dir="ltr" className="tabular-nums text-slate-600">{visibleLength(bio)}/{BIO_MAX}</span>
          </span>
          <textarea
            dir="auto"
            rows={4}
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            placeholder={ui.accountBioPlaceholder}
            className={`${inputClass} mt-1.5 resize-none leading-relaxed`}
          />
        </label>

        <p className="mt-5 text-note font-semibold text-slate-200">{profileCopy(locale).aboutMe}</p>
        <FactsEditor locale={locale} facts={facts} onChange={setFacts} />

        {/* 프로필에 보일 칸 + 사람 목록에서 숨기기(있던 스위치를 이 묶음으로 옮김). 사람 기능이 없으면 숨기기 줄은 없다. */}
        <ShowToggles
          locale={locale}
          show={show}
          onShow={setShow}
          {...(socialFeaturesEnabled()
            ? { hidden, onHidden: setHidden, hiddenLabel: ui.accountHideFromPeople, receipts, onReceipts: setReceipts, receiptsLabel: ui.accountReadReceipts }
            : {})}
        />

        {message ? <p className="mt-3 text-[12px] text-rose-300">{message}</p> : null}

        {account.username ? <PasswordChange ui={ui} /> : null}

        <div className="mt-6 border-t border-white/10 pt-4">
          {signedIn ? (
            <p className="text-[12px] text-slate-500">
              {ui.accountSignedInAs.split("{email}")[0]}
              <bdi dir="ltr">{signedIn}</bdi>
              {ui.accountSignedInAs.split("{email}")[1] ?? ""}
            </p>
          ) : null}
          {confirm ? (
            <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-[13px] leading-relaxed text-slate-200">
                {confirm === "logout" ? ui.accountLogoutConfirm : ui.accountDeleteConfirm}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setConfirm(null)}
                  className="flex-1 rounded-lg border border-white/15 px-3 py-2 text-[13px] text-slate-200"
                >
                  {ui.accountCancel}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void finish(confirm)}
                  className={`flex-1 rounded-lg px-3 py-2 text-[13px] font-medium ${
                    confirm === "delete" ? "bg-rose-500/90 text-white" : "bg-[#e8e8e4] text-neutral-900"
                  } disabled:opacity-50`}
                >
                  {busy ? ui.accountWorking : confirm === "delete" ? ui.accountDeleteYes : ui.accountLogout}
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3 flex gap-4 text-[13px]">
              <button type="button" onClick={() => setConfirm("logout")} className="text-slate-300 underline underline-offset-4">
                {ui.accountLogout}
              </button>
              <button type="button" onClick={() => setConfirm("delete")} className="text-rose-300/80 underline underline-offset-4">
                {ui.accountDelete}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function isEmptyFacts(facts: ProfileFacts): boolean {
  return !facts.country && !facts.native && facts.interests.length === 0 && facts.meetModes.length === 0 && facts.speaks.length === 0 && facts.learns.length === 0 && !facts.work;
}

/** 로그인 직후 한 번: 모국어·배우는 언어·관심사·대화 방식만 고르는 화면. 건너뛰면 편집 시트로(언제든 편집에서 고칠 수 있음). */
function FactsSetup({ locale, account, onDone }: { locale: string; account: PublicAccount; onDone: () => void }) {
  const t = profileCopy(locale);
  const [facts, setFacts] = useState<ProfileFacts>(() => factsOf(account.profile.facts));
  const [busy, setBusy] = useState(false);
  const done = async () => {
    setBusy(true);
    try {
      await saveProfile({ nickname: account.profile.nickname, bio: account.profile.bio, facts });
    } catch {
      // 저장하지 못해도 편집 시트에서 다시 고를 수 있다.
    } finally {
      setBusy(false);
      onDone();
    }
  };
  return (
    <>
      <div className="flex shrink-0 items-center gap-2 border-b border-line px-3 py-2">
        <button
          type="button"
          onClick={onDone}
          className="rounded-lg border border-line bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10"
        >
          {t.setupSkip}
        </button>
        <h2 className="min-w-0 flex-1 truncate text-center text-sm font-semibold text-ink">{t.setupTitle}</h2>
        <button
          type="button"
          onClick={() => void done()}
          disabled={busy || isEmptyFacts(facts)}
          className="rounded-lg bg-platinum px-3 py-1.5 text-xs font-medium text-black hover:bg-platinum-hover disabled:opacity-50"
        >
          {t.setupDone}
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        <FactsEditor locale={locale} facts={facts} onChange={setFacts} compact />
      </div>
    </>
  );
}

function PasswordChange({ ui }: { ui: UICopy }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<AccountError | null>(null);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setDone(false);
        }}
        className="mt-5 text-[13px] text-slate-300 underline underline-offset-4"
      >
        {done ? ui.accountPasswordChanged : ui.accountChangePassword}
      </button>
    );
  }

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      if (!isPasswordOk(next)) throw new AccountRequestError("PASSWORD_WEAK");
      await changePassword(current, next);
      setCurrent("");
      setNext("");
      setDone(true);
      setOpen(false);
    } catch (caught) {
      setError(codeOf(caught));
    } finally {
      setBusy(false);
    }
  };

  const message = errorText(ui, error);
  return (
    <form
      className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-3"
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      <p className="text-[13px] font-medium text-slate-200">{ui.accountChangePassword}</p>
      <label className="mt-2 block text-[12px] text-slate-400">
        {ui.accountCurrentPassword}
        <input
          type="password"
          autoComplete="current-password"
          dir="ltr"
          maxLength={PASSWORD_MAX}
          value={current}
          onChange={(event) => setCurrent(event.target.value)}
          className={`${inputClass} mt-1`}
        />
      </label>
      <label className="mt-2 block text-[12px] text-slate-400">
        {ui.accountNewPassword}
        <input
          type="password"
          autoComplete="new-password"
          dir="ltr"
          maxLength={PASSWORD_MAX}
          value={next}
          onChange={(event) => setNext(event.target.value)}
          className={`${inputClass} mt-1`}
        />
      </label>
      <p className="mt-1 text-[11px] text-slate-500">{ui.accountPasswordHint.replace("{n}", String(PASSWORD_MIN))}</p>
      {message ? <p className="mt-2 text-[12px] text-rose-300">{message}</p> : null}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => setOpen(false)}
          className="flex-1 rounded-lg border border-white/15 px-3 py-2 text-[13px] text-slate-200"
        >
          {ui.accountCancel}
        </button>
        <button type="submit" disabled={busy || !current || !next} className="flex-1 rounded-lg bg-[#e8e8e4] px-3 py-2 text-[13px] font-medium text-neutral-900 disabled:opacity-50">
          {busy ? ui.accountWorking : ui.accountSave}
        </button>
      </div>
    </form>
  );
}
