import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DOOR_LANGS, DOORS, doorById, doorUrl, isDoorLang, type Door, type DoorLang } from "@/lib/doors";
import { listRooms } from "@/lib/server/roomStore";
import { recentPeople } from "@/lib/server/presenceStore";
import { ONLINE_WINDOW_MS } from "@/lib/rooms/social";
import { PLAY_LISTING_URL } from "@/lib/appVersion";

/**
 * 창구 소개 페이지(lib/doors.ts). 창구 주소의 `/`·`/<언어>`가 여기로 온다(next.config.ts rewrites).
 * 검색에 걸리는 글 + 그 기능이 지금 돌아가는 모습(열린 방 수) + 같은 주소의 앱으로 들어가기.
 * 사람 이름·방 이름·얼굴은 싣지 않는다(검색에 남지 않게) — 개수만.
 */
export const revalidate = 60;

type Params = { id: string; lang?: string[] };

function pick(door: Door, raw: string[] | undefined): DoorLang | null {
  if (!raw || raw.length === 0) return door.defaultLang;
  if (raw.length > 1 || !isDoorLang(raw[0])) return null;
  return raw[0];
}

export function generateStaticParams(): Params[] {
  return DOORS.flatMap((door) => [{ id: door.id, lang: [] }, ...DOOR_LANGS.map((lang) => ({ id: door.id, lang: [lang] }))]);
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id, lang } = await params;
  const door = doorById(id);
  const chosen = door ? pick(door, lang) : null;
  if (!door || !chosen) return {};
  const copy = door.copy[chosen];
  return {
    title: copy.title,
    description: copy.description,
    applicationName: door.name,
    alternates: {
      canonical: doorUrl(door, chosen),
      languages: Object.fromEntries(DOOR_LANGS.map((code) => [code, doorUrl(door, code)])),
    },
    openGraph: { title: copy.title, description: copy.description, url: doorUrl(door, chosen), siteName: door.name, type: "website" },
  };
}

async function liveCounts(door: Door): Promise<{ rooms: number; people: number }> {
  try {
    if (door.live === "people") {
      // 지금 접속(사람 목록과 같은 5분) — 몇 명인지만.
      const online = await recentPeople(500, Date.now() - ONLINE_WINDOW_MS);
      return { rooms: 0, people: online.length };
    }
    const rooms = await listRooms(null);
    return { rooms: rooms.length, people: rooms.reduce((sum, room) => sum + room.speakers + room.listeners, 0) };
  } catch {
    return { rooms: 0, people: 0 };
  }
}

export default async function DoorPage({ params }: { params: Promise<Params> }) {
  const { id, lang } = await params;
  const door = doorById(id);
  const chosen = door ? pick(door, lang) : null;
  if (!door || !chosen) notFound();
  const copy = door.copy[chosen];
  const live = await liveCounts(door);
  const dir = chosen === "ar" ? "rtl" : "ltr";
  // 같은 주소의 앱으로(`?screen=`이 있으면 rewrites가 소개 페이지 대신 앱을 준다). 확인용 www 주소에서는 ?door도.
  const enter = `/?screen=${door.start}&door=${door.id}`;
  // Play 설치가 어느 창구에서 왔는지(Play Console 획득 보고서의 utm_source).
  const store = `${PLAY_LISTING_URL}&referrer=${encodeURIComponent(`utm_source=${door.id}&utm_medium=door`)}`;
  return (
    <div data-door={door.theme} lang={chosen} dir={dir} className="min-h-[100dvh] bg-door-bg text-ink">
      <main className="mx-auto flex max-w-xl flex-col gap-8 px-4 pb-12 pt-6">
        <header className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-title font-bold text-door-accent">
            <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-full bg-door-soft">◉</span>
            {door.name}
          </span>
          <nav aria-label="Languages" className="flex max-w-[60%] gap-1 overflow-x-auto text-meta text-slate-400">
            {DOOR_LANGS.map((code) => (
              <a key={code} href={code === door.defaultLang ? "/" : `/${code}`} className={`rounded-lg px-1 ${code === chosen ? "text-door-accent" : ""}`} hrefLang={code}>
                {code}
              </a>
            ))}
          </nav>
        </header>

        <section className="space-y-3">
          <h1 className="text-hero font-bold leading-tight text-white">{copy.headline}</h1>
          <p className="text-body leading-relaxed text-slate-300">{copy.sub}</p>
          <p className="inline-flex items-center gap-2 rounded-full bg-door-soft px-3 py-1.5 text-caption text-door-accent">
            <span aria-hidden className={`h-2 w-2 rounded-full bg-door-accent ${(door.live === "people" ? live.people : live.rooms) ? "animate-pulse" : "opacity-40"}`} />
            {(door.live === "people" ? live.people : live.rooms) ? copy.live.replace("{rooms}", String(live.rooms)).replace("{people}", String(live.people)) : copy.liveEmpty}
          </p>
        </section>

        <div className="flex flex-col gap-2 sm:flex-row">
          <a href={enter} className="flex-1 rounded-2xl bg-door-accent px-4 py-3.5 text-center text-chat font-semibold text-black">
            {copy.cta}
          </a>
          <a href={store} className="flex-1 rounded-2xl border border-line px-4 py-3.5 text-center text-chat text-slate-200">
            {copy.app}
          </a>
        </div>

        <ul className="space-y-3">
          {copy.features.map(([title, body]) => (
            <li key={title} className="rounded-2xl border border-line bg-door-soft px-4 py-3.5">
              <h2 className="text-chat font-semibold text-white">{title}</h2>
              <p className="mt-1 text-note leading-relaxed text-slate-300">{body}</p>
            </li>
          ))}
        </ul>

        <footer className="flex flex-wrap items-center gap-3 text-meta text-slate-500">
          <span>{copy.operator}</span>
          <a href="/privacy" className="underline">
            {copy.privacy}
          </a>
        </footer>
      </main>
    </div>
  );
}
