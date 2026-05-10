"use client";

import { useRouter } from "next/navigation";

export default function SubscribePage() {
  const router = useRouter();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center bg-slate-50 p-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">무제한 사용 시작하기</h1>
        <p className="mt-2 text-lg font-medium text-slate-900">월 4,900원</p>
        <p className="mt-3 text-sm text-slate-600">
          무료 사용자는 하루 15회까지 사용할 수 있고, 구독 시 제한 없이 사용할 수
          있습니다.
        </p>

        <div className="mt-6 space-y-2">
          <button
            type="button"
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            인앱결제 준비중
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            이전 페이지로 돌아가기
          </button>
        </div>
      </section>
    </main>
  );
}
