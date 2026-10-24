"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { UICopy } from "@/lib/copy";
import type { CustomNode, FixCard, NotebookChapter, NotebookEdit } from "@/lib/notes/notebook";
import { sceneShotFor } from "@/lib/notes/sceneShots";

/**
 * 노트의 뼈대 칸(글자·소리·문법)과 내가 만든 칸, 그 안의 짚은 장면 카드(notes/notebook.ts, /api/notebook).
 * 어휘·표현(예전 목차)은 NotesPanel이 그대로 그린다.
 *
 * 칸 이름 옆 숫자가 짚인 횟수 — 많은 칸이 위로 와서 "여기에 집중"이 된다. 설명 글은 두지 않는다(hub/DESIGN.md "안내 글").
 * 맨 위 "오늘의 학습": 오늘 짚인 후보를 고르고(진짜 실수·또 틀린 것은 미리 체크), 기기에 찍어 둔 화면을 "화면 함께"로 붙여 노트에 넣는다.
 * 지난 날 후보는 "지난 학습"(7일).
 */

type NodeView = { id: string; chapter: NotebookChapter; stage?: number; index?: number; name: string; example?: string; note?: string; ahead?: boolean };
type Book = {
  stage: number;
  nodes: NodeView[];
  custom: CustomNode[];
  renames: Record<string, string>;
  memos: Record<string, string>;
  cards: FixCard[];
  pending: FixCard[];
  today: string;
  /** 단계 사다리(번호·이름, 앱 언어) — 옛 서버면 비어 있다. */
  stages: { order: number; title: string }[];
};
type Group = NotebookChapter | "mine" | "loose";
type PickGroup = "today" | "earlier";

/** notes/notebook.ts `defaultPicked`와 같은 규칙(그 모듈은 뼈대 자료를 끌고 와서 화면에 들이지 않는다). */
const picksByDefault = (card: FixCard) => card.again === true || (card.kind ?? "mistake") === "mistake";

function newNodeId(): string {
  return `c-${Math.random().toString(36).slice(2, 10).padEnd(8, "0")}`;
}

function when(at: number, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(at);
  } catch {
    return "";
  }
}

export function NotebookSection({
  ui,
  locale,
  language,
  isPremium,
  frame = true,
  stageDetail,
  masteredOf,
  onTry,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  isPremium: boolean;
  /** false면 "오늘의 학습" 버튼과 시트만(My 망·그래프 보기 위). 틀(단계 사다리·칸)은 "단계" 보기에서. */
  frame?: boolean;
  /** 고른 단계의 목표 대화·할 수 있는 것(My가 StageGoal로 그림) — 사다리 아래, 문법 칸 위. */
  stageDetail?: (order: number) => ReactNode;
  /** 단계 자료의 그 문법을 숙지했는지(✓). */
  masteredOf?: (stage: number, index: number) => boolean;
  /** 그 문법으로 바로 연습(채팅). */
  onTry?: (stage: number, index: number) => void;
}) {
  const [book, setBook] = useState<Book | null>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [nodeOpen, setNodeOpen] = useState<string | null>(null);
  const [moving, setMoving] = useState<string | null>(null);
  const [picking, setPicking] = useState<PickGroup | null>(null);
  const [viewShot, setViewShot] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(apiUrl(`/api/notebook?lang=${encodeURIComponent(language)}&ui=${encodeURIComponent(locale)}`), {
      headers: entitlementHeaders(isPremium),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: Book | null) => {
        if (!cancelled && body?.nodes) setBook({ ...body, pending: body.pending ?? [], today: body.today ?? "", stages: body.stages ?? [] });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [language, locale, isPremium]);

  const edit = useCallback(
    async (change: NotebookEdit) => {
      try {
        const response = await fetch(apiUrl("/api/notebook"), {
          method: "POST",
          headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
          body: JSON.stringify({ language, edit: change }),
        });
        const body = (await response.json().catch(() => null)) as Partial<Book> | null;
        if (response.ok && body?.cards) {
          setBook((current) =>
            current
              ? {
                  ...current,
                  cards: body.cards!,
                  custom: body.custom ?? current.custom,
                  renames: body.renames ?? current.renames,
                  memos: body.memos ?? current.memos,
                  pending: body.pending ?? current.pending,
                }
              : current,
          );
        }
      } catch {
        // 다음에 열 때 서버 것으로 다시 그린다.
      }
    },
    [language, isPremium],
  );

  /** 고른 후보를 노트로, 화면을 붙인 것은 그림을 올린다(그림이 실패해도 카드는 들어간다). */
  const commit = useCallback(
    async (ids: string[], shots: Record<string, string>) => {
      await edit({ op: "commit", ids, shots: Object.keys(shots) });
      for (const [id, image] of Object.entries(shots)) {
        await fetch(apiUrl("/api/notebook"), {
          method: "POST",
          headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
          body: JSON.stringify({ language, shot: { id, image } }),
        }).catch(() => undefined);
      }
    },
    [edit, language, isPremium],
  );

  const counts = useMemo(() => {
    const out: Record<string, number> = {};
    for (const card of book?.cards ?? []) out[card.node ?? ""] = (out[card.node ?? ""] ?? 0) + 1;
    return out;
  }, [book]);

  if (!book) return null;
  const nameOf = (id: string) =>
    book.custom.find((node) => node.id === id)?.name ?? book.renames[id] ?? book.nodes.find((node) => node.id === id)?.name ?? "";
  // 뒤 단계 문법은 카드가 들어온 칸만.
  const inChapter = (chapter: NotebookChapter) => book.nodes.filter((node) => node.chapter === chapter && (!node.ahead || (counts[node.id] ?? 0) > 0));
  const sum = (ids: string[]) => ids.reduce((total, id) => total + (counts[id] ?? 0), 0);
  const rows: Array<{ key: Group; label: string; count: number; show: boolean }> = [
    { key: "script", label: ui.notebookScript, count: sum(inChapter("script").map((n) => n.id)), show: inChapter("script").length > 0 },
    // 문법은 아래 단계 틀(StageFrame)로 펼쳐 보인다. 옛 서버(단계 사다리 없음)면 예전처럼 한 줄.
    { key: "grammar", label: ui.notebookGrammar, count: sum(inChapter("grammar").map((n) => n.id)), show: inChapter("grammar").length > 0 && book.stages.length === 0 },
    { key: "mine", label: ui.notebookMine, count: sum(book.custom.map((n) => n.id)), show: true },
    { key: "loose", label: ui.notesLoose, count: counts[""] ?? 0, show: (counts[""] ?? 0) > 0 },
  ];
  const todayPending = book.pending.filter((card) => card.day === book.today);
  const earlierPending = book.pending.filter((card) => card.day !== book.today);
  const openNode = nodeOpen ? { id: nodeOpen, name: nameOf(nodeOpen), view: book.nodes.find((node) => node.id === nodeOpen) } : null;
  const movingCard = moving ? book.cards.find((card) => card.id === moving) ?? null : null;

  return (
    <>
      {todayPending.length || earlierPending.length ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {todayPending.length ? (
            <button
              type="button"
              onClick={() => setPicking("today")}
              className="rounded-lg bg-status-learned/20 px-3 py-1.5 text-note font-semibold text-ink"
            >
              {ui.notebookToday} · {todayPending.length}
            </button>
          ) : null}
          {earlierPending.length ? (
            <button
              type="button"
              onClick={() => setPicking("earlier")}
              className="rounded-lg border border-line px-3 py-1.5 text-caption text-slate-300"
            >
              {ui.notebookPastDays} · {earlierPending.length}
            </button>
          ) : null}
        </div>
      ) : null}
      {frame && book.stages.length ? (
        <StageFrame
          ui={ui}
          stages={book.stages}
          current={book.stage}
          nodes={book.nodes.filter((node) => node.chapter === "grammar")}
          counts={counts}
          nameOf={nameOf}
          onOpen={setNodeOpen}
          detail={stageDetail}
          masteredOf={masteredOf}
        />
      ) : null}
      {frame ? (
      <ul className="mt-2 divide-y divide-white/5">
        {rows
          .filter((row) => row.show)
          .map((row) => (
            <li key={row.key}>
              <button type="button" onClick={() => setGroup(row.key)} className="flex w-full items-center gap-3 py-2.5 text-start">
                <span className="min-w-0 flex-1 text-note text-ink">{row.label}</span>
                <span className="w-7 shrink-0 text-end text-caption tabular-nums text-slate-400">{row.count || ""}</span>
                <span aria-hidden className="text-caption text-slate-500">›</span>
              </button>
            </li>
          ))}
      </ul>
      ) : null}

      {group ? (
        <Sheet ui={ui} title={rows.find((row) => row.key === group)?.label ?? ""} onClose={() => setGroup(null)}>
          {group === "loose" ? (
            <CardList
              ui={ui}
              locale={locale}
              cards={book.cards.filter((card) => !card.node)}
              onMove={setMoving}
              onShot={setViewShot}
              edit={edit}
            />
          ) : group === "mine" ? (
            <MineList ui={ui} custom={book.custom} counts={counts} onOpen={setNodeOpen} edit={edit} />
          ) : (
            <NodeList ui={ui} nodes={inChapter(group)} stage={book.stage} counts={counts} nameOf={nameOf} onOpen={setNodeOpen} />
          )}
        </Sheet>
      ) : null}

      {picking ? (
        <Sheet ui={ui} title={picking === "today" ? ui.notebookToday : ui.notebookPastDays} onClose={() => setPicking(null)}>
          <PickList
            key={picking}
            ui={ui}
            language={language}
            cards={picking === "today" ? todayPending : earlierPending}
            nameOf={(id) => (id ? nameOf(id) : ui.notesLoose)}
            onCommit={async (ids, shots) => {
              await commit(ids, shots);
              setPicking(null);
            }}
          />
        </Sheet>
      ) : null}

      {viewShot ? <ShotSheet ui={ui} language={language} isPremium={isPremium} shotId={viewShot} onClose={() => setViewShot(null)} /> : null}

      {openNode ? (
        <Sheet ui={ui} title={openNode.name} onClose={() => setNodeOpen(null)}>
          <NodeBody
            key={openNode.id}
            ui={ui}
            locale={locale}
            id={openNode.id}
            name={openNode.name}
            view={openNode.view}
            memo={book.memos[openNode.id] ?? ""}
            cards={book.cards.filter((card) => card.node === openNode.id)}
            onMove={setMoving}
            onShot={setViewShot}
            edit={edit}
            onTry={
              onTry && openNode.view?.chapter === "grammar" && openNode.view.stage !== undefined && openNode.view.index !== undefined
                ? () => {
                    onTry(openNode.view!.stage!, openNode.view!.index!);
                    setNodeOpen(null);
                  }
                : undefined
            }
          />
        </Sheet>
      ) : null}

      {movingCard ? (
        <Sheet ui={ui} title={ui.notebookMoveTo} onClose={() => setMoving(null)}>
          <ul className="mt-2 space-y-1">
            {[...book.nodes.filter((node) => !node.ahead).map((node) => node.id), ...book.custom.map((node) => node.id)].map((id) => (
              <li key={id}>
                <button
                  type="button"
                  disabled={movingCard.node === id}
                  onClick={() => {
                    void edit({ op: "move", card: movingCard.id, node: id });
                    setMoving(null);
                  }}
                  className="w-full rounded-lg px-3 py-2 text-start text-note text-slate-200 hover:bg-white/10 disabled:opacity-40"
                >
                  {nameOf(id)}
                </button>
              </li>
            ))}
          </ul>
        </Sheet>
      ) : null}
    </>
  );
}

/**
 * 수준별 틀(2026-10-24 사용자: "수준별 학습틀, 학습한 걸 틀에 넣어 키워가는 흐름이 보여야"):
 * 단계 사다리(1 2 3 4 5 — 지나온 단계·지금·다음), 고른 단계의 문법 칸이 바로 펼쳐지고,
 * 짚인 장면이 든 칸은 채워진 점 + 횟수, 위에 "채운 칸 / 이 단계 칸". 다음 단계도 눌러 미리 본다.
 * 설명 글 없이 번호·이름·숫자만(hub/DESIGN.md "안내 글").
 */
function StageFrame({
  ui,
  stages,
  current,
  nodes,
  counts,
  nameOf,
  onOpen,
  detail,
  masteredOf,
}: {
  ui: UICopy;
  stages: { order: number; title: string }[];
  current: number;
  nodes: NodeView[];
  counts: Record<string, number>;
  nameOf: (id: string) => string;
  onOpen: (id: string) => void;
  detail?: (order: number) => ReactNode;
  masteredOf?: (stage: number, index: number) => boolean;
}) {
  const now = Math.max(1, Math.min(current, stages.length));
  const [shown, setShown] = useState(now);
  const inStage = (order: number) => nodes.filter((node) => (node.stage ?? 1) === order);
  const filledIn = (order: number) => inStage(order).filter((node) => (counts[node.id] ?? 0) > 0).length;
  const list = inStage(shown);
  const filled = filledIn(shown);
  const title = stages.find((stage) => stage.order === shown)?.title ?? "";
  return (
    <div className="mt-3">
      <p className="text-meta font-semibold tracking-wide text-slate-500">{ui.notebookGrammar}</p>
      <ol className="mt-2 flex items-center">
        {stages.map((stage, index) => {
          const done = stage.order < now;
          const here = stage.order === now;
          const picked = stage.order === shown;
          return (
            <li key={stage.order} className={`flex items-center ${index ? "flex-1" : ""}`}>
              {index ? <span aria-hidden className={`h-px flex-1 ${stage.order <= now ? "bg-status-learned/60" : "bg-white/10"}`} /> : null}
              <button
                type="button"
                aria-pressed={picked}
                aria-label={`${stage.order}. ${stage.title}`}
                title={stage.title}
                onClick={() => setShown(stage.order)}
                className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-caption tabular-nums ${
                  here
                    ? "bg-status-learned font-semibold text-black"
                    : done
                      ? "bg-status-learned/30 text-ink"
                      : "border border-line text-slate-500"
                } ${picked ? "ring-2 ring-white/70 ring-offset-2 ring-offset-black" : ""}`}
              >
                {stage.order}
                {filledIn(stage.order) ? (
                  <span className="absolute -top-1 -end-1 rounded-full bg-white/90 px-1 text-meta leading-tight text-black">{filledIn(stage.order)}</span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ol>
      <div className="mt-3 flex items-baseline gap-2">
        <p className={`min-w-0 flex-1 truncate text-note font-semibold ${shown > now ? "text-slate-400" : "text-ink"}`}>
          {shown}. {title}
        </p>
        <span className="shrink-0 text-caption tabular-nums text-slate-400">
          {filled}/{list.length}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div className="h-full rounded-full bg-status-learned" style={{ width: `${list.length ? Math.round((filled / list.length) * 100) : 0}%` }} />
      </div>
      {detail?.(shown)}
      <ul className="mt-1 divide-y divide-white/5">
        {list.map((node) => {
          const count = counts[node.id] ?? 0;
          return (
            <li key={node.id}>
              <button type="button" onClick={() => onOpen(node.id)} className="flex w-full items-center gap-3 py-2 text-start">
                <span
                  aria-hidden
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${count ? "bg-status-learned" : "border border-line"}`}
                />
                <span className="min-w-0 flex-1">
                  <span className={`block text-note ${shown > now && !count ? "text-slate-400" : "text-ink"}`}>{nameOf(node.id)}</span>
                  {node.example ? (
                    <span dir="auto" className="block truncate text-meta text-slate-500">
                      {node.example}
                    </span>
                  ) : null}
                </span>
                {masteredOf?.(node.stage ?? 1, node.index ?? -1) ? <span className="shrink-0 text-caption text-good">✓</span> : null}
                <span className="w-7 shrink-0 text-end text-caption tabular-nums text-slate-400">{count || ""}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function NodeList({
  ui,
  nodes,
  stage,
  counts,
  nameOf,
  onOpen,
}: {
  ui: UICopy;
  nodes: NodeView[];
  stage: number;
  counts: Record<string, number>;
  nameOf: (id: string) => string;
  onOpen: (id: string) => void;
}) {
  // 짚인 칸이 위로(많은 순), 나머지는 자료 순서. 앞 단계 문법은 "이전 부분"에 접어 둔다.
  const order = (list: NodeView[]) =>
    [...list].sort((a, b) => (counts[b.id] ?? 0) - (counts[a.id] ?? 0));
  const now = order(nodes.filter((node) => node.chapter !== "grammar" || (node.stage ?? 1) >= stage));
  const earlier = order(nodes.filter((node) => node.chapter === "grammar" && (node.stage ?? 1) < stage));
  const row = (node: NodeView) => (
    <li key={node.id}>
      <button type="button" onClick={() => onOpen(node.id)} className="flex w-full items-center gap-3 py-2.5 text-start">
        <span className="min-w-0 flex-1">
          <span className="block text-note text-ink">{nameOf(node.id)}</span>
          {node.example ? (
            <span dir="auto" className="block truncate text-meta text-slate-500">
              {node.example}
            </span>
          ) : null}
        </span>
        <span className="w-7 shrink-0 text-end text-caption tabular-nums text-slate-400">{counts[node.id] || ""}</span>
      </button>
    </li>
  );
  return (
    <>
      <ul className="mt-2 divide-y divide-white/5">{now.map(row)}</ul>
      {earlier.length ? (
        <details className="mt-3">
          <summary className="cursor-pointer text-caption text-slate-400">
            {ui.notebookEarlier} · {earlier.length}
          </summary>
          <ul className="mt-1 divide-y divide-white/5">{earlier.map(row)}</ul>
        </details>
      ) : null}
    </>
  );
}

function MineList({
  ui,
  custom,
  counts,
  onOpen,
  edit,
}: {
  ui: UICopy;
  custom: CustomNode[];
  counts: Record<string, number>;
  onOpen: (id: string) => void;
  edit: (change: NotebookEdit) => Promise<void>;
}) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  return (
    <>
      <ul className="mt-2 divide-y divide-white/5">
        {custom.map((node) => (
          <li key={node.id}>
            <button type="button" onClick={() => onOpen(node.id)} className="flex w-full items-center gap-3 py-2.5 text-start">
              <span className="min-w-0 flex-1 text-note text-ink">{node.name}</span>
              <span className="w-7 shrink-0 text-end text-caption tabular-nums text-slate-400">{counts[node.id] || ""}</span>
            </button>
          </li>
        ))}
      </ul>
      {adding ? (
        <form
          className="mt-2 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (!name.trim()) return;
            void edit({ op: "addNode", id: newNodeId(), name: name.trim() });
            setName("");
            setAdding(false);
          }}
        >
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={40}
            aria-label={ui.notebookNodeName}
            placeholder={ui.notebookNodeName}
            autoFocus
            className="min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 py-2 text-note text-ink placeholder:text-slate-500"
          />
          <button type="submit" className="shrink-0 rounded-lg border border-line px-3 py-2 text-caption text-slate-200 hover:bg-white/10">
            {ui.notebookSave}
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="mt-2 rounded-lg border border-line px-3 py-1.5 text-caption text-slate-200 hover:bg-white/10"
        >
          {ui.notebookAddNode}
        </button>
      )}
    </>
  );
}

function NodeBody({
  ui,
  locale,
  id,
  name,
  view,
  memo,
  cards,
  onMove,
  onShot,
  edit,
  onTry,
}: {
  ui: UICopy;
  locale: string;
  id: string;
  name: string;
  onTry?: () => void;
  view?: NodeView;
  memo: string;
  cards: FixCard[];
  onMove: (card: string) => void;
  onShot: (shotId: string) => void;
  edit: (change: NotebookEdit) => Promise<void>;
}) {
  const [renaming, setRenaming] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftMemo, setDraftMemo] = useState(memo);
  const custom = id.startsWith("c-");
  return (
    <div className="mt-2">
      {view?.example ? (
        <p dir="auto" className="text-note text-slate-200">
          {view.example}
        </p>
      ) : null}
      {view?.note ? <p className="mt-1 text-caption text-slate-400">{view.note}</p> : null}
      {onTry ? (
        <button type="button" onClick={onTry} className="tb-btn mt-2 rounded-lg px-3 py-1.5 text-caption font-semibold">
          {ui.stageTry}
        </button>
      ) : null}

      <div className="mt-2 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setRenaming((on) => !on)}
          className="rounded-lg border border-line px-2 py-1 text-caption text-slate-300 hover:bg-white/10"
        >
          {ui.notebookRename}
        </button>
        {custom ? (
          <button
            type="button"
            onClick={() => void edit({ op: "deleteNode", node: id })}
            className="rounded-lg border border-line px-2 py-1 text-caption text-slate-400 hover:bg-white/10"
          >
            {ui.notebookDelete}
          </button>
        ) : null}
      </div>
      {renaming ? (
        <form
          className="mt-2 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            void edit({ op: "renameNode", node: id, name: draftName.trim() });
            setRenaming(false);
          }}
        >
          <input
            value={draftName}
            onChange={(event) => setDraftName(event.target.value)}
            maxLength={40}
            aria-label={ui.notebookNodeName}
            autoFocus
            className="min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 py-2 text-note text-ink"
          />
          <button type="submit" className="shrink-0 rounded-lg border border-line px-3 py-2 text-caption text-slate-200 hover:bg-white/10">
            {ui.notebookSave}
          </button>
        </form>
      ) : null}

      <textarea
        value={draftMemo}
        onChange={(event) => setDraftMemo(event.target.value)}
        onBlur={() => {
          if (draftMemo.trim() !== memo.trim()) void edit({ op: "memoNode", node: id, memo: draftMemo });
        }}
        rows={2}
        maxLength={1000}
        aria-label={ui.notebookMemo}
        placeholder={ui.notebookMemo}
        dir="auto"
        className="mt-3 w-full resize-y rounded-lg border border-line bg-surface px-3 py-2 text-note text-ink placeholder:text-slate-500"
      />

      <CardList ui={ui} locale={locale} cards={cards} onMove={onMove} onShot={onShot} edit={edit} />
    </div>
  );
}

function CardList({
  ui,
  locale,
  cards,
  onMove,
  onShot,
  edit,
}: {
  ui: UICopy;
  locale: string;
  cards: FixCard[];
  onMove: (card: string) => void;
  onShot: (shotId: string) => void;
  edit: (change: NotebookEdit) => Promise<void>;
}) {
  const where: Record<FixCard["where"], string> = {
    chat: ui.homeTabChat,
    call: ui.homeTabCall,
    dm: ui.homeTabMessages,
    room: ui.homeTabRooms,
  };
  if (!cards.length) return null;
  return (
    <ul className="mt-3 space-y-2">
      {cards.map((card) => (
        <FixCardRow key={card.id} ui={ui} locale={locale} card={card} where={where[card.where] ?? ""} onMove={onMove} onShot={onShot} edit={edit} />
      ))}
    </ul>
  );
}

function FixCardRow({
  ui,
  locale,
  card,
  where,
  onMove,
  onShot,
  edit,
}: {
  ui: UICopy;
  locale: string;
  card: FixCard;
  where: string;
  onMove: (card: string) => void;
  onShot: (shotId: string) => void;
  edit: (change: NotebookEdit) => Promise<void>;
}) {
  const [memoOpen, setMemoOpen] = useState(false);
  const [memo, setMemo] = useState(card.memo ?? "");
  return (
    <li className="rounded-lg bg-white/[0.04] px-3 py-2.5">
      <p dir="auto" className="flex gap-1.5 text-note text-slate-400">
        <span aria-hidden className="shrink-0 text-rose-300">✗</span>
        <span className="min-w-0 line-through decoration-rose-300/60">{card.wrong}</span>
      </p>
      <p dir="auto" className="mt-0.5 flex gap-1.5 text-note text-ink">
        <span aria-hidden className="shrink-0 text-emerald-300">✓</span>
        <span className="min-w-0">{card.right}</span>
      </p>
      {card.note ? (
        <p dir="auto" className="mt-1 text-caption text-slate-300">
          {card.note}
        </p>
      ) : null}
      {card.memo && !memoOpen ? (
        <p dir="auto" className="mt-1 whitespace-pre-line text-caption text-amber-100/90">
          {card.memo}
        </p>
      ) : null}
      {card.suggest && !card.node ? (
        <button
          type="button"
          onClick={() => void edit({ op: "acceptSuggest", card: card.id, id: newNodeId() })}
          className="mt-1.5 rounded-lg border border-line px-2 py-0.5 text-caption text-slate-200 hover:bg-white/10"
        >
          {ui.notebookSuggest.replace("{name}", card.suggest)} · {ui.notebookMake}
        </button>
      ) : null}
      {memoOpen ? (
        <form
          className="mt-1.5"
          onSubmit={(event) => {
            event.preventDefault();
            void edit({ op: "memoCard", card: card.id, memo });
            setMemoOpen(false);
          }}
        >
          <textarea
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
            rows={2}
            maxLength={1000}
            aria-label={ui.notebookMemo}
            dir="auto"
            autoFocus
            className="w-full resize-y rounded-lg border border-line bg-surface px-3 py-2 text-note text-ink"
          />
          <button type="submit" className="mt-1 rounded-lg border border-line px-2 py-1 text-caption text-slate-200 hover:bg-white/10">
            {ui.notebookSave}
          </button>
        </form>
      ) : null}
      <div className="mt-1.5 flex items-center gap-2 text-meta text-slate-500">
        <span className="min-w-0 flex-1 truncate">
          {where} · {when(card.at, locale)}
        </span>
        {card.shotId ? (
          <button type="button" onClick={() => onShot(card.shotId!)} className="shrink-0 hover:text-slate-300">
            {ui.notebookScreen}
          </button>
        ) : null}
        <button type="button" onClick={() => onMove(card.id)} className="shrink-0 hover:text-slate-300">
          {ui.notebookMove}
        </button>
        <button type="button" onClick={() => setMemoOpen((on) => !on)} className="shrink-0 hover:text-slate-300">
          {ui.notebookMemo}
        </button>
        <button type="button" onClick={() => void edit({ op: "deleteCard", card: card.id })} className="shrink-0 hover:text-slate-300">
          {ui.notebookDelete}
        </button>
      </div>
    </li>
  );
}

function PickList({
  ui,
  language,
  cards,
  nameOf,
  onCommit,
}: {
  ui: UICopy;
  language: string;
  cards: FixCard[];
  nameOf: (id: string | null) => string;
  onCommit: (ids: string[], shots: Record<string, string>) => Promise<void>;
}) {
  const [picked, setPicked] = useState<Set<string>>(() => new Set(cards.filter(picksByDefault).map((card) => card.id)));
  const [withShot, setWithShot] = useState<Set<string>>(() => new Set());
  const [shots, setShots] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  // 이 기기에 찍어 둔 화면이 있는 줄만 "화면 함께"를 보인다.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const found: Record<string, string> = {};
      for (const card of cards) {
        const image = await sceneShotFor(language, card.wrong);
        if (image) found[card.id] = image;
      }
      if (!cancelled) setShots(found);
    })();
    return () => {
      cancelled = true;
    };
  }, [cards, language]);

  const toggle = (set: Set<string>, id: string) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  };
  // 칸별로 묶고, 많이 짚인 칸이 위로.
  const groups = new Map<string, FixCard[]>();
  for (const card of cards) {
    const key = card.node ?? "";
    groups.set(key, [...(groups.get(key) ?? []), card]);
  }
  const ordered = [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
  const tag = (card: FixCard) =>
    [card.again ? ui.notebookAgain : "", card.kind === "typo" ? ui.notebookTypo : "", card.kind === "meant" ? ui.notebookMeant : ""].filter(Boolean);

  return (
    <div className="mt-2">
      {ordered.map(([node, list]) => (
        <section key={node || "loose"} className="mt-3 first:mt-0">
          <p className="text-meta font-semibold tracking-wide text-slate-500">{nameOf(node || null)}</p>
          <ul className="mt-1 space-y-1.5">
            {list.map((card) => (
              <li key={card.id} className="rounded-lg bg-white/[0.04] px-3 py-2">
                <label className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={picked.has(card.id)}
                    onChange={() => setPicked((set) => toggle(set, card.id))}
                    className="mt-1 h-4 w-4 shrink-0 accent-violet-400"
                  />
                  <span className="min-w-0 flex-1">
                    <span dir="auto" className="block text-note text-slate-400 line-through decoration-rose-300/60">
                      {card.wrong}
                    </span>
                    <span dir="auto" className="block text-note text-ink">
                      {card.right}
                    </span>
                    {card.note ? (
                      <span dir="auto" className="mt-0.5 block text-caption text-slate-300">
                        {card.note}
                      </span>
                    ) : null}
                    {tag(card).length ? (
                      <span className="mt-1 flex flex-wrap gap-1">
                        {tag(card).map((label) => (
                          <span key={label} className="rounded-lg bg-white/10 px-1.5 py-0.5 text-meta text-slate-300">
                            {label}
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </span>
                </label>
                {shots[card.id] && picked.has(card.id) ? (
                  <label className="mt-1.5 flex items-center gap-2 ps-6 text-caption text-slate-300">
                    <input
                      type="checkbox"
                      checked={withShot.has(card.id)}
                      onChange={() => setWithShot((set) => toggle(set, card.id))}
                      className="h-3.5 w-3.5 accent-sky-400"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={shots[card.id]} alt="" className="h-10 w-auto rounded-lg border border-line" />
                    <span>{ui.notebookWithScreen}</span>
                  </label>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ))}
      <button
        type="button"
        disabled={busy || picked.size === 0}
        onClick={async () => {
          setBusy(true);
          const ids = cards.filter((card) => picked.has(card.id)).map((card) => card.id);
          const attach = Object.fromEntries(ids.filter((id) => withShot.has(id) && shots[id]).map((id) => [id, shots[id]!]));
          await onCommit(ids, attach);
          setBusy(false);
        }}
        className="tb-btn mt-4 w-full rounded-lg px-3 py-2 text-note font-semibold disabled:opacity-40"
      >
        {ui.notebookAddToNotes} · {picked.size}
      </button>
    </div>
  );
}

function ShotSheet({
  ui,
  language,
  isPremium,
  shotId,
  onClose,
}: {
  ui: UICopy;
  language: string;
  isPremium: boolean;
  shotId: string;
  onClose: () => void;
}) {
  const [image, setImage] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch(apiUrl(`/api/notebook?lang=${encodeURIComponent(language)}&shot=${encodeURIComponent(shotId)}`), { headers: entitlementHeaders(isPremium) })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: { image?: string } | null) => {
        if (!cancelled && body?.image) setImage(body.image);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [language, isPremium, shotId]);
  return (
    <Sheet ui={ui} title={ui.notebookScreen} onClose={onClose}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {image ? <img src={image} alt="" className="mt-2 w-full rounded-lg border border-line" /> : null}
    </Sheet>
  );
}

function Sheet({ ui, title, onClose, children }: { ui: UICopy; title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <BodyLayer>
      <div className="fixed inset-0 z-[80] flex flex-col justify-end bg-black/60 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))] sm:items-center sm:justify-center">
        <button type="button" className="absolute inset-0 cursor-default" aria-label={ui.billingClose} onClick={onClose} />
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="relative z-10 max-h-full w-full max-w-md overflow-y-auto overscroll-contain rounded-2xl border border-line bg-surface-sunk p-4"
        >
          <div className="flex items-start gap-2">
            <h3 className="min-w-0 flex-1 text-title font-semibold text-ink">{title}</h3>
            <button type="button" onClick={onClose} aria-label={ui.billingClose} className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10">
              ✕
            </button>
          </div>
          {children}
        </div>
      </div>
    </BodyLayer>
  );
}
