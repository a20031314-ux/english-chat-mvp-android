"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RANDOM_PAUSE_HOURS, SUSPEND_DAYS, type OpsList, type OpsPerson, type OpsReport } from "@/lib/ops/reports";
import { iconPath, type IconPack } from "@/lib/rooms/icons";

/**
 * 운영자 신고함(api/ops/reports). 운영자만 보는 화면이라 한국어만.
 * 키는 이 브라우저에만 남긴다(localStorage) — 저장소·서버 로그에 두지 않는다.
 */
const KEY_STORE = "opsKey";
const VIEW_STORE = "opsView";

type View = "reports" | "people";
type Filter = "open" | "all";
type Kind = "all" | "user" | "ai";

const AI_REASON: Record<string, string> = {
  ai_video_self: "🤖 AI 검사: 본인 화면이 걸림 → 랜덤 24시간 자동 멈춤",
  ai_video_self_off: "🤖 AI 검사: 30일 안 두 번째 → 랜덤 자동 막힘",
  ai_video_other: "🤖 AI 검사: 상대 화면이 걸려 통화 끝남(자동 정지 없음, 확인 필요)",
  ai_video: "🤖 AI 검사: 상대 화면이 걸려 통화 끝남(자동 정지 없음, 확인 필요)",
};

function readStore(key: string): string {
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function writeStore(key: string, value: string) {
  try {
    if (value) window.localStorage.setItem(key, value);
    else window.localStorage.removeItem(key);
  } catch {
    /* 저장 못 해도 이번 화면에서는 쓴다 */
  }
}

const when = (ms: number | string) =>
  new Date(ms).toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });

async function ops<T>(key: string, payload: Record<string, unknown>): Promise<T> {
  const response = await fetch("/api/ops/reports", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-ops-key": key },
    body: JSON.stringify(payload),
  });
  const body = (await response.json().catch(() => ({}))) as { error?: string } & T;
  if (!response.ok) throw new Error(body.error ?? `HTTP ${response.status}`);
  return body;
}

export function OpsInbox() {
  const [key, setKey] = useState("");
  const [draft, setDraft] = useState("");
  const [data, setData] = useState<OpsList | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [view, setView] = useState<View>("reports");
  const [filter, setFilter] = useState<Filter>("open");
  const [kind, setKind] = useState<Kind>("all");

  useEffect(() => {
    // 저장해 둔 키·보는 방식은 처음 한 번만 읽는다(서버 렌더와 어긋나지 않게 effect에서).
    setKey(readStore(KEY_STORE));
    if (readStore(VIEW_STORE) === "people") setView("people");
  }, []);

  const load = useCallback(async (useKey: string) => {
    if (!useKey) return;
    setBusy(true);
    setError("");
    try {
      setData(await ops<OpsList>(useKey, { action: "list" }));
    } catch (failure) {
      const code = failure instanceof Error ? failure.message : "FAILED";
      setError(code === "NO_KEY" ? "키가 맞지 않아요." : `불러오지 못했어요 (${code}).`);
      if (code === "NO_KEY") {
        writeStore(KEY_STORE, "");
        setKey("");
      }
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    if (key) void load(key);
  }, [key, load]);

  const act = useCallback(
    async (payload: Record<string, unknown>) => {
      setBusy(true);
      setError("");
      try {
        await ops(key, payload);
        await load(key);
      } catch (failure) {
        const code = failure instanceof Error ? failure.message : "FAILED";
        setError(code === "UNVERIFIED" ? "이 사람은 성인인증 기록이 없어 랜덤을 막을 대상이 없어요(인증 전엔 원래 못 씀)." : `실패했어요 (${code}).`);
        setBusy(false);
      }
    },
    [key, load],
  );

  const reports = useMemo(
    () => (data?.reports ?? []).filter((r) => (filter === "all" || !r.done) && (kind === "all" || r.kind === kind)),
    [data, filter, kind],
  );

  const pickView = (next: View) => {
    setView(next);
    writeStore(VIEW_STORE, next);
  };

  if (!key) {
    return (
      <main className="mx-auto w-full max-w-md px-4 py-10">
        <h1 className="text-title font-semibold text-ink">신고함</h1>
        <p className="mt-2 text-note text-slate-400">운영자 키를 넣으세요. 이 브라우저에만 저장돼요.</p>
        <form
          className="mt-4 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const value = draft.trim();
            writeStore(KEY_STORE, value);
            setKey(value);
            setDraft("");
          }}
        >
          <input
            type="password"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="운영자 키"
            aria-label="운영자 키"
            className="min-w-0 flex-1 rounded-xl border border-line bg-surface px-3 py-2 text-body text-ink"
          />
          <button type="submit" className="rounded-xl bg-platinum px-4 py-2 text-body font-semibold text-black hover:bg-platinum-hover">
            열기
          </button>
        </form>
        {error ? <p className="mt-3 text-note text-bad">{error}</p> : null}
      </main>
    );
  }

  const openCount = (data?.reports ?? []).filter((r) => !r.done).length;
  const people = data ? peopleOf(reports, data.people) : [];

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="flex flex-wrap items-center gap-2">
        <h1 className="text-title font-semibold text-ink">신고함</h1>
        <span className="text-note text-slate-400">처리 안 한 신고 {openCount}건</span>
        <div className="ms-auto flex gap-2">
          <button type="button" onClick={() => void load(key)} disabled={busy} className="rounded-xl border border-line px-3 py-1.5 text-note text-slate-200 disabled:opacity-40">
            ↻ 새로고침
          </button>
          <button
            type="button"
            onClick={() => {
              writeStore(KEY_STORE, "");
              setKey("");
              setData(null);
            }}
            className="rounded-xl border border-line px-3 py-1.5 text-note text-slate-400"
          >
            키 지우기
          </button>
        </div>
      </header>

      <p className="mt-2 text-caption leading-relaxed text-slate-500">
        사람 기능 정지 = 메시지·단체방·게시판 쓰기·방 만들기/들어가기·팔로우·사진·랜덤이 막힘(AI 채팅·통화·영상 학습은 그대로). 랜덤 멈춤/막기 = Spin만. 막기는 본인
        확인값 기준이라 새 계정으로 다시 인증해도 막혀요. 신고는 90일 뒤 사라져요.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Chips value={view} onChange={pickView} options={[["reports", "신고별"], ["people", "사람별"]]} />
        <Chips value={filter} onChange={setFilter} options={[["open", "처리 안 함"], ["all", "전부"]]} />
        <Chips value={kind} onChange={setKind} options={[["all", "모두"], ["user", "🙋 사람 신고"], ["ai", "🤖 AI 검사"]]} />
      </div>

      {error ? (
        <button type="button" onClick={() => setError("")} className="mt-3 w-full rounded-xl bg-warn/10 px-3 py-2 text-start text-note text-warn">
          {error}
        </button>
      ) : null}

      {!data ? <p className="mt-6 text-note text-slate-400">불러오는 중…</p> : null}
      {data && reports.length === 0 ? <p className="mt-6 text-note text-slate-400">보여줄 신고가 없어요.</p> : null}

      <div className="mt-4 space-y-3">
        {data && view === "reports"
          ? reports.map((report) => (
              <ReportCard key={report.id} report={report} data={data} busy={busy} act={act} />
            ))
          : null}
        {data && view === "people"
          ? people.map(({ person, rows }) => (
              <section key={person.id} className="rounded-2xl border border-line bg-surface px-4 py-3">
                <PersonHead person={person} now={data.now} />
                <ul className="mt-2 space-y-1">
                  {rows.map((report) => (
                    <li key={report.id} className="text-note text-slate-300" dir="auto">
                      <span className="text-slate-500">{when(report.at)} · </span>
                      {reasonText(report)}
                      {report.kind === "user" ? <span className="text-slate-500"> — {nameOf(data.people, report.reporter)}</span> : null}
                      {report.done ? <span className="text-good"> · 처리함</span> : null}
                    </li>
                  ))}
                </ul>
                <PersonActions person={person} now={data.now} busy={busy} act={act} />
              </section>
            ))
          : null}
      </div>
    </main>
  );
}

/** 판매 신청 묶음 그림(공개 그림 주소) + 승인·거절·내리기. */
function IconSaleReview({ packId, busy, act }: { packId: string; busy: boolean; act: (payload: Record<string, unknown>) => Promise<void> }) {
  const [pack, setPack] = useState<IconPack | null | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    void fetch("/api/icons", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "pack", id: packId }) })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: { pack?: IconPack } | null) => {
        if (alive) setPack(body?.pack ?? null);
      })
      .catch(() => alive && setPack(null));
    return () => {
      alive = false;
    };
  }, [packId]);
  return (
    <div className="mt-2 space-y-2">
      {pack === undefined ? (
        <p className="text-caption text-slate-500">…</p>
      ) : pack === null ? (
        <p className="text-caption text-slate-500">묶음 없음(지워졌거나 내려짐)</p>
      ) : (
        <>
          <p className="text-caption text-slate-300">
            {pack.price}P · {pack.icons.length}개 · 상태 {pack.sale ?? "-"}
            {pack.hidden ? " · 내려짐" : ""}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {pack.icons.map((icon) => (
              // eslint-disable-next-line @next/next/no-img-element -- 운영자 확인용 미리 보기(움직이는 WebP 그대로).
              <img key={icon.id} src={iconPath(pack.id, icon.id)} alt={icon.phrase?.text ?? ""} className="h-16 w-16 rounded-lg bg-white/5 object-contain" />
            ))}
          </div>
        </>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => void act({ action: "approveIconSale", packId })}
          className="rounded-xl border border-good/40 px-3 py-1.5 text-note text-good disabled:opacity-40"
        >
          판매 승인
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => void act({ action: "rejectIconSale", packId })}
          className="rounded-xl border border-bad/40 px-3 py-1.5 text-note text-bad disabled:opacity-40"
        >
          거절
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => void act({ action: "hideIconPack", packId })}
          className="rounded-xl border border-line px-3 py-1.5 text-note text-slate-200 disabled:opacity-40"
        >
          묶음 내리기(산 사람 환불)
        </button>
      </div>
    </div>
  );
}

function ReportCard({
  report,
  data,
  busy,
  act,
}: {
  report: OpsReport;
  data: OpsList;
  busy: boolean;
  act: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const person = data.people[report.target];
  const iconPackId = report.lines.map((line) => /^icon-pack:(ip_[0-9a-z]+)$/.exec(line)?.[1]).find(Boolean) ?? null;
  const salePackId = report.lines.map((line) => /^icon-sale:(ip_[0-9a-z]+)$/.exec(line)?.[1]).find(Boolean) ?? null;
  return (
    <article className={`rounded-2xl border border-line px-4 py-3 ${report.done ? "bg-surface-sunk opacity-70" : "bg-surface"}`}>
      <div className="flex flex-wrap items-center gap-2 text-caption text-slate-400">
        <span className={`rounded-full px-2 py-0.5 ${report.kind === "ai" ? "bg-info/15 text-info" : "bg-warn/15 text-warn"}`}>
          {report.kind === "ai" ? "🤖 AI" : "🙋 사람"}
        </span>
        <span>{when(report.at)}</span>
        {report.kind === "user" ? <span>신고한 사람: {nameOf(data.people, report.reporter)}</span> : null}
        {report.roomId ? <span className="text-slate-500">방 {report.roomId}</span> : null}
        {report.done ? <span className="text-good">처리함 {when(report.done.at)}</span> : null}
      </div>
      <p className="mt-2 text-body text-ink" dir="auto">
        {reasonText(report)}
      </p>
      {report.lines.length ? (
        <blockquote className="mt-2 space-y-0.5 border-s-2 border-line ps-3 text-note text-slate-300">
          {report.lines.map((line, index) => (
            <p key={index} dir="auto">
              {line}
            </p>
          ))}
        </blockquote>
      ) : null}
      {/* 아이콘 판매 신청(줄에 "icon-sale:<id>"): 그림을 보고 승인(목록에 뜸)·거절. 승인 뒤에 내리면 산 사람에게 돌려준다. */}
      {salePackId ? <IconSaleReview packId={salePackId} busy={busy} act={act} /> : null}
      {/* 아이콘 묶음 신고(줄에 "icon-pack:<id>"): 묶음 그림을 보고 내리기·되돌리기. */}
      {iconPackId ? (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => void act({ action: "hideIconPack", packId: iconPackId })}
            className="rounded-xl border border-bad/40 px-3 py-1.5 text-note text-bad disabled:opacity-40"
          >
            아이콘 묶음 내리기
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void act({ action: "showIconPack", packId: iconPackId })}
            className="rounded-xl border border-line px-3 py-1.5 text-note text-slate-200 disabled:opacity-40"
          >
            되돌리기
          </button>
        </div>
      ) : null}
      <div className="mt-3 rounded-xl bg-surface-sunk px-3 py-2">
        {person ? <PersonHead person={person} now={data.now} /> : <p className="text-note text-slate-400">신고된 사람 {report.target}</p>}
        {person ? <PersonActions person={person} now={data.now} busy={busy} act={act} /> : null}
      </div>
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          disabled={busy}
          onClick={() => void act({ action: "done", id: report.id, done: !report.done })}
          className="rounded-xl border border-line px-3 py-1.5 text-note text-slate-200 disabled:opacity-40"
        >
          {report.done ? "처리 취소" : "✓ 처리함"}
        </button>
      </div>
    </article>
  );
}

function PersonHead({ person, now }: { person: OpsPerson; now: number }) {
  const chips: { text: string; tone: "bad" | "warn" | "plain" }[] = [];
  if (!person.exists) chips.push({ text: "계정 지워짐", tone: "plain" });
  if (person.ban) chips.push({ text: person.ban.until ? `사람 기능 정지 ~${when(person.ban.until)}` : "사람 기능 정지(풀 때까지)", tone: "bad" });
  if (person.random.off) chips.push({ text: "랜덤 막힘", tone: "bad" });
  if (person.random.pausedUntil && person.random.pausedUntil > now) chips.push({ text: `랜덤 멈춤 ~${when(person.random.pausedUntil)}`, tone: "warn" });
  if (person.random.strikes) chips.push({ text: `AI에 걸림 ${person.random.strikes}번(30일)`, tone: "warn" });
  if (person.random.verified) chips.push({ text: person.random.adult ? `성인인증${person.random.foreigner ? "·외국인" : ""}` : "미성년", tone: "plain" });
  if (person.openReports) chips.push({ text: `처리 안 한 신고 ${person.openReports}`, tone: "warn" });
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-body font-semibold text-ink" dir="auto">
        {person.name || "(이름 없음)"}
      </span>
      <span className="text-caption text-slate-500">{person.id}</span>
      {chips.map((chip) => (
        <span
          key={chip.text}
          className={`rounded-full px-2 py-0.5 text-caption ${chip.tone === "bad" ? "bg-bad/15 text-bad" : chip.tone === "warn" ? "bg-warn/15 text-warn" : "bg-white/10 text-slate-300"}`}
        >
          {chip.text}
        </span>
      ))}
    </div>
  );
}

/** 무거운 버튼(풀 때까지 정지·랜덤 막기)은 두 번 눌러야 적용된다. */
function PersonActions({
  person,
  now,
  busy,
  act,
}: {
  person: OpsPerson;
  now: number;
  busy: boolean;
  act: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const [arming, setArming] = useState<string | null>(null);
  const target = person.id;
  const heavy = (id: string, payload: Record<string, unknown>) => {
    if (arming !== id) {
      setArming(id);
      return;
    }
    setArming(null);
    void act(payload);
  };
  const paused = Boolean(person.random.pausedUntil && person.random.pausedUntil > now);
  const button = "rounded-xl border px-2.5 py-1 text-note disabled:opacity-40";
  return (
    <div className="mt-2 space-y-2">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="w-16 text-caption text-slate-500">사람 기능</span>
        {person.ban ? (
          <button type="button" disabled={busy} onClick={() => void act({ action: "unsuspend", target })} className={`${button} border-good/40 text-good`}>
            정지 풀기
          </button>
        ) : (
          <>
            {SUSPEND_DAYS.map((days) => (
              <button
                key={days}
                type="button"
                disabled={busy || !person.exists}
                onClick={() => void act({ action: "suspend", target, days })}
                className={`${button} border-bad/40 text-bad`}
              >
                {days}일 정지
              </button>
            ))}
            <button
              type="button"
              disabled={busy || !person.exists}
              onClick={() => heavy("forever", { action: "suspend", target, days: null })}
              className={`${button} border-bad/60 ${arming === "forever" ? "bg-bad/20" : ""} text-bad`}
            >
              {arming === "forever" ? "한 번 더 누르면 정지" : "풀 때까지 정지"}
            </button>
          </>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="w-16 text-caption text-slate-500">랜덤</span>
        {paused ? (
          <button type="button" disabled={busy} onClick={() => void act({ action: "randomUnpause", target })} className={`${button} border-good/40 text-good`}>
            멈춤 풀기
          </button>
        ) : (
          RANDOM_PAUSE_HOURS.map((hours) => (
            <button
              key={hours}
              type="button"
              disabled={busy || !person.exists}
              onClick={() => void act({ action: "randomPause", target, hours })}
              className={`${button} border-warn/40 text-warn`}
            >
              {hours === 24 ? "24시간 멈춤" : `${hours / 24}일 멈춤`}
            </button>
          ))
        )}
        {person.random.off ? (
          <button type="button" disabled={busy} onClick={() => void act({ action: "randomOn", target })} className={`${button} border-good/40 text-good`}>
            막기 풀기
          </button>
        ) : (
          <button
            type="button"
            disabled={busy || !person.random.verified}
            title={person.random.verified ? "" : "성인인증 전이라 원래 랜덤을 못 써요"}
            onClick={() => heavy("randomOff", { action: "randomOff", target })}
            className={`${button} border-bad/60 ${arming === "randomOff" ? "bg-bad/20" : ""} text-bad`}
          >
            {arming === "randomOff" ? "한 번 더 누르면 막기" : "랜덤 막기"}
          </button>
        )}
      </div>
    </div>
  );
}

function Chips<T extends string>({ value, onChange, options }: { value: T; onChange: (next: T) => void; options: [T, string][] }) {
  return (
    <div className="flex overflow-hidden rounded-full border border-line">
      {options.map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          aria-pressed={value === id}
          className={`px-3 py-1 text-note ${value === id ? "bg-platinum text-black" : "text-slate-300"}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function reasonText(report: OpsReport): string {
  if (report.kind === "ai") return AI_REASON[report.reason] ?? `🤖 ${report.reason}`;
  return report.reason || "(이유 없음)";
}

function nameOf(people: Record<string, OpsPerson>, id: string): string {
  if (id === "ai") return "AI";
  const person = people[id];
  return person ? person.name || id : id;
}

/** 사람별: 처리 안 한 신고가 많은 사람부터. */
function peopleOf(reports: OpsReport[], people: Record<string, OpsPerson>): { person: OpsPerson; rows: OpsReport[] }[] {
  const groups = new Map<string, OpsReport[]>();
  for (const report of reports) {
    if (!people[report.target]) continue;
    groups.set(report.target, [...(groups.get(report.target) ?? []), report]);
  }
  return [...groups.entries()]
    .map(([id, rows]) => ({ person: people[id], rows }))
    .sort((a, b) => b.rows.filter((r) => !r.done).length - a.rows.filter((r) => !r.done).length || b.rows.length - a.rows.length);
}
