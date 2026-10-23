"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { UICopy } from "@/lib/copy";
import type { CustomNode, FixCard, NotebookChapter, NotebookEdit } from "@/lib/notes/notebook";

/**
 * 노트의 뼈대 칸(글자·소리·문법)과 내가 만든 칸, 그 안의 짚은 장면 카드(notes/notebook.ts, /api/notebook).
 * 어휘·표현(예전 목차)은 NotesPanel이 그대로 그린다.
 *
 * 칸 이름 옆 숫자가 짚인 횟수 — 많은 칸이 위로 와서 "여기에 집중"이 된다. 설명 글은 두지 않는다(hub/DESIGN.md "안내 글").
 */

type NodeView = { id: string; chapter: NotebookChapter; stage?: number; name: string; example?: string; note?: string };
type Book = {
  stage: number;
  nodes: NodeView[];
  custom: CustomNode[];
  renames: Record<string, string>;
  memos: Record<string, string>;
  cards: FixCard[];
};
type Group = NotebookChapter | "mine" | "loose";

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
}: {
  ui: UICopy;
  locale: string;
  language: string;
  isPremium: boolean;
}) {
  const [book, setBook] = useState<Book | null>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [nodeOpen, setNodeOpen] = useState<string | null>(null);
  const [moving, setMoving] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(apiUrl(`/api/notebook?lang=${encodeURIComponent(language)}&ui=${encodeURIComponent(locale)}`), {
      headers: entitlementHeaders(isPremium),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: Book | null) => {
        if (!cancelled && body?.nodes) setBook(body);
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
            current ? { ...current, cards: body.cards!, custom: body.custom ?? current.custom, renames: body.renames ?? current.renames, memos: body.memos ?? current.memos } : current,
          );
        }
      } catch {
        // 다음에 열 때 서버 것으로 다시 그린다.
      }
    },
    [language, isPremium],
  );

  const counts = useMemo(() => {
    const out: Record<string, number> = {};
    for (const card of book?.cards ?? []) out[card.node ?? ""] = (out[card.node ?? ""] ?? 0) + 1;
    return out;
  }, [book]);

  if (!book) return null;
  const nameOf = (id: string) =>
    book.custom.find((node) => node.id === id)?.name ?? book.renames[id] ?? book.nodes.find((node) => node.id === id)?.name ?? "";
  const inChapter = (chapter: NotebookChapter) => book.nodes.filter((node) => node.chapter === chapter);
  const sum = (ids: string[]) => ids.reduce((total, id) => total + (counts[id] ?? 0), 0);
  const rows: Array<{ key: Group; label: string; count: number; show: boolean }> = [
    { key: "script", label: ui.notebookScript, count: sum(inChapter("script").map((n) => n.id)), show: inChapter("script").length > 0 },
    { key: "grammar", label: ui.notebookGrammar, count: sum(inChapter("grammar").map((n) => n.id)), show: inChapter("grammar").length > 0 },
    { key: "mine", label: ui.notebookMine, count: sum(book.custom.map((n) => n.id)), show: true },
    { key: "loose", label: ui.notesLoose, count: counts[""] ?? 0, show: (counts[""] ?? 0) > 0 },
  ];
  const openNode = nodeOpen ? { id: nodeOpen, name: nameOf(nodeOpen), view: book.nodes.find((node) => node.id === nodeOpen) } : null;
  const movingCard = moving ? book.cards.find((card) => card.id === moving) ?? null : null;

  return (
    <>
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
      <p className="mt-3 text-meta font-semibold tracking-wide text-slate-500">{ui.notebookVocab}</p>

      {group ? (
        <Sheet ui={ui} title={rows.find((row) => row.key === group)?.label ?? ""} onClose={() => setGroup(null)}>
          {group === "loose" ? (
            <CardList
              ui={ui}
              locale={locale}
              cards={book.cards.filter((card) => !card.node)}
              onMove={setMoving}
              edit={edit}
            />
          ) : group === "mine" ? (
            <MineList ui={ui} custom={book.custom} counts={counts} onOpen={setNodeOpen} edit={edit} />
          ) : (
            <NodeList ui={ui} nodes={inChapter(group)} stage={book.stage} counts={counts} nameOf={nameOf} onOpen={setNodeOpen} />
          )}
        </Sheet>
      ) : null}

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
            edit={edit}
          />
        </Sheet>
      ) : null}

      {movingCard ? (
        <Sheet ui={ui} title={ui.notebookMoveTo} onClose={() => setMoving(null)}>
          <ul className="mt-2 space-y-1">
            {[...book.nodes.map((node) => node.id), ...book.custom.map((node) => node.id)].map((id) => (
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
  edit,
}: {
  ui: UICopy;
  locale: string;
  id: string;
  name: string;
  view?: NodeView;
  memo: string;
  cards: FixCard[];
  onMove: (card: string) => void;
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

      <CardList ui={ui} locale={locale} cards={cards} onMove={onMove} edit={edit} />
    </div>
  );
}

function CardList({
  ui,
  locale,
  cards,
  onMove,
  edit,
}: {
  ui: UICopy;
  locale: string;
  cards: FixCard[];
  onMove: (card: string) => void;
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
        <FixCardRow key={card.id} ui={ui} locale={locale} card={card} where={where[card.where] ?? ""} onMove={onMove} edit={edit} />
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
  edit,
}: {
  ui: UICopy;
  locale: string;
  card: FixCard;
  where: string;
  onMove: (card: string) => void;
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
