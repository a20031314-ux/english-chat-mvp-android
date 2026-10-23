"use client";

import type { ReactNode } from "react";
import { TAB_ICON_META } from "@/components/TabIcons";
import type { UICopy } from "@/lib/copy";
import { bottomTabs, isFeatureOn, setFeatureOn, type BottomTabId, type FeatureId } from "@/lib/features";

/**
 * 쓸 기능 고르기의 "구조도" 보기(2026-10-22 사용자 요청: "앱 전체 UI 구조도를 그리고 거기서 체크해서 선택·숨기기").
 * 앱 화면 구조를 나무 모양으로 그리고, 숨길 수 있는 칸마다 체크. 맨 아래는 지금 고른 대로의 하단 탭 미리보기
 * (AppHome과 같은 lib/features.ts `bottomTabs`). 칸 이름을 누르면 사용법(설명 보기)의 그 장으로.
 */

type Node = {
  key: string;
  label: string;
  /** 숨길 수 있으면 그 기능, 없으면 항상 사용. */
  feature: FeatureId | null;
  /** 사용법 장(guide/content.ts GUIDE_CHAPTERS id). */
  chapter: string;
  icon?: BottomTabId;
  children?: Node[];
};

function Check({ on, locked, label, onToggle }: { on: boolean; locked: boolean; label: string; onToggle: () => void }) {
  if (locked) {
    return (
      <span aria-hidden className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border border-line bg-white/10 text-meta text-slate-400">
        ✓
      </span>
    );
  }
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={on}
      aria-label={label}
      onClick={onToggle}
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border text-meta font-bold ${
        on ? "border-platinum bg-platinum text-canvas" : "border-slate-500 bg-transparent text-transparent"
      }`}
    >
      ✓
    </button>
  );
}

function NodeRow({
  node,
  off,
  parentOn,
  ui,
  onOpenChapter,
  depth,
}: {
  node: Node;
  off: FeatureId[];
  parentOn: boolean;
  ui: UICopy;
  onOpenChapter: (chapter: string) => void;
  depth: number;
}) {
  const selfOn = node.feature ? isFeatureOn(off, node.feature) : true;
  const on = parentOn && selfOn;
  const Icon = node.icon ? TAB_ICON_META[node.icon].Icon : null;
  return (
    <li>
      <div className={`flex items-center gap-2 py-1.5 ${on ? "" : "opacity-50"}`}>
        {depth > 0 ? <span aria-hidden className="w-3 shrink-0 border-b border-s border-line self-start h-3" /> : null}
        <Check on={selfOn} locked={!node.feature} label={node.label} onToggle={() => node.feature && setFeatureOn(node.feature, !selfOn)} />
        {Icon ? (
          <span aria-hidden className="flex h-6 w-6 shrink-0 items-center justify-center">
            <Icon active={on} />
          </span>
        ) : null}
        <button
          type="button"
          onClick={() => onOpenChapter(node.chapter)}
          className={`min-w-0 flex-1 truncate text-start text-note ${on ? "text-ink" : "text-slate-400 line-through"} hover:underline`}
        >
          {node.label}
        </button>
        {!node.feature ? <span className="shrink-0 text-meta text-slate-500">{ui.featureAlways}</span> : null}
      </div>
      {node.children?.length ? (
        <ul className="ms-3 border-s border-line ps-2">
          {node.children.map((child) => (
            <NodeRow key={child.key} node={child} off={off} parentOn={on} ui={ui} onOpenChapter={onOpenChapter} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function Box({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white/5 px-3 py-2.5">
      <p className="mb-1 text-meta font-semibold tracking-wide text-slate-400">{title}</p>
      {children}
    </section>
  );
}

export function FeatureMap({
  ui,
  off,
  social,
  callAvailable,
  onOpenChapter,
}: {
  ui: UICopy;
  off: FeatureId[];
  /** 플랫폼에 사람 기능이 있는지(iOS 1차는 없음). */
  social: boolean;
  /** 이 학습 언어에 통화가 있는지. */
  callAvailable: boolean;
  onOpenChapter: (chapter: string) => void;
}) {
  const call: Node[] = callAvailable ? [{ key: "call", label: ui.talkAiCall, feature: "call", chapter: "ai-call" }] : [];
  const my: Node = {
    key: "my",
    label: ui.homeTabProfile,
    feature: null,
    chapter: "my",
    icon: "map",
    children: [{ key: "notes", label: ui.notesTitle, feature: "notes", chapter: "notes" }],
  };
  const tree: Node[] = social
    ? [
        {
          key: "talk",
          label: ui.homeTabTalk,
          feature: null,
          chapter: "messages",
          icon: "talk",
          children: [
            { key: "chat", label: ui.talkAiTutor, feature: null, chapter: "ai-chat" },
            ...call,
            { key: "dm", label: ui.featureMapDm, feature: "people", chapter: "messages" },
          ],
        },
        { key: "video", label: ui.homeTabVideo, feature: "video", chapter: "video", icon: "video" },
        { key: "people", label: ui.homeTabPeople, feature: "people", chapter: "people", icon: "people" },
        { key: "rooms", label: ui.homeTabRooms, feature: "rooms", chapter: "rooms", icon: "rooms" },
        my,
      ]
    : [
        // AI 통화는 채팅 머리의 📞(2026-10-23) — 채팅 아래 칸.
        { key: "chat", label: ui.homeTabChat, feature: null, chapter: "ai-chat", icon: "chat", children: call },
        { key: "video", label: ui.homeTabVideo, feature: "video", chapter: "video", icon: "video" },
        my,
      ];

  const labels: Record<BottomTabId, string> = {
    talk: ui.homeTabTalk,
    chat: ui.homeTabChat,
    video: ui.homeTabVideo,
    people: ui.homeTabPeople,
    rooms: ui.homeTabRooms,
    map: ui.homeTabProfile,
  };
  const preview = bottomTabs(off, { social });

  return (
    <div className="flex flex-col gap-3" data-feature-map>
      <Box title={ui.featureMapTop}>
        <div className="flex items-center gap-2 py-1 text-note text-slate-300">
          <Check on locked label={ui.featureMapTop} onToggle={() => undefined} />
          <span className="min-w-0 flex-1 truncate">
            {ui.learningLanguageLabel} · {ui.uiLanguageLabel} · ? · 💬
          </span>
          <span className="shrink-0 text-meta text-slate-500">{ui.featureAlways}</span>
        </div>
      </Box>
      <Box title={ui.featureMapTabs}>
        <ul>
          {tree.map((node) => (
            <NodeRow key={node.key} node={node} off={off} parentOn ui={ui} onOpenChapter={onOpenChapter} depth={0} />
          ))}
        </ul>
      </Box>
      <section aria-label={ui.featureMapPreview}>
        <p className="mb-1 text-meta font-semibold tracking-wide text-slate-400">{ui.featureMapPreview}</p>
        <div className="flex gap-0.5 rounded-2xl border border-line bg-canvas px-1 py-1">
          {preview.map((id, index) => {
            const meta = TAB_ICON_META[id];
            const Icon = meta.Icon;
            const active = index === 0;
            return (
              <div
                key={id}
                role="img"
                aria-label={labels[id]}
                title={labels[id]}
                className={`flex min-h-[2.75rem] flex-1 basis-0 flex-col items-center justify-center rounded-xl px-1 py-1 ${active ? meta.activeBg : meta.idleBg}`}
              >
                <Icon active={active} />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
