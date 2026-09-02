import Link from "next/link";

const PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.yourname.englishchat";

/**
 * What the deployed site shows instead of the app.
 *
 * The app never loads pages from the server — it runs the copy of the web build
 * bundled into the APK and only calls the API here — so what this deployment
 * renders is free to be something else entirely. It used to be the whole app,
 * which meant the privacy policy link required on the store listing led one URL
 * edit away from a fully working, unpaid, unmetered copy of it.
 *
 * A server component on purpose: the choice is made once at build time from an
 * environment variable, so there is no client-side check to get around.
 */
export function LandingPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-[#0a0a0a] px-6 py-16 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-white">
        languagebank
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
        읽고 있는 문장과 보고 있는 영상에서 바로 배우는 언어 학습 앱입니다.
      </p>
      <p className="mt-1 max-w-md text-sm leading-relaxed text-slate-500">
        Learn a language from the sentences you read and the videos you watch.
      </p>

      <a
        href={PLAY_URL}
        className="mt-8 rounded-xl bg-[#e8e8e4] px-5 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-white"
      >
        Google Play에서 받기
      </a>

      <Link
        href="/privacy"
        className="mt-6 text-xs text-slate-500 underline underline-offset-4 hover:text-slate-300"
      >
        개인정보처리방침
      </Link>
    </main>
  );
}
