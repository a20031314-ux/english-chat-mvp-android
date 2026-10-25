"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import { ICON_MOTIONS, type IconMotion } from "@/lib/rooms/icons";
import type { IconCopy } from "@/lib/rooms/iconCopy";
import { CHECKER_BACKGROUND, PAINT_DARK, PAINT_LIGHT, PAINT_SWATCHES, SELECTION_STROKE } from "@/lib/rooms/iconEditorPalette";

/**
 * 아이콘 편집기(사용자 2026-10-25 "아이콘을 만드는 페이지 — 편집이나 생성", ① 편집기).
 * 사진·글자(학습 언어 한 마디)·이모지 스티커·펜·배경을 겹쳐 512px 정사각 PNG 한 장으로 만들고,
 * "움직임"을 고르면 이름만 같이 보낸다 — 움직이는 그림은 서버가 만든다(server/iconMotion.ts, 폰 브라우저는 움직이는 그림을 못 만듦).
 * 모델을 부르지 않는다. 이미 있는 내 아이콘을 열면 첫 프레임을 바탕으로 편집한다(움직이는 원본은 멈춘 그림이 됨).
 */

const SIDE = 512;
const TEXT_PX = 88;
const EMOJI_PX = 150;
const SWATCHES = PAINT_SWATCHES;
const STICKERS = ["😀", "😂", "🥹", "😍", "😎", "🤔", "😭", "😡", "👍", "👏", "🙏", "💪", "❤️", "🔥", "✨", "🎉", "💯", "❓", "❗", "💤", "☕", "📚", "✈️", "🌏"];

type Base = { id: number; x: number; y: number; scale: number; rot: number };
type Layer =
  | (Base & { kind: "image"; img: HTMLImageElement })
  | (Base & { kind: "text"; text: string; color: string; outline: boolean })
  | (Base & { kind: "emoji"; char: string });
type Stroke = { color: string; width: number; points: [number, number][] };
type Snapshot = { layers: Layer[]; strokes: Stroke[]; bg: string | null };
type Tool = "move" | "photo" | "text" | "sticker" | "pen" | "bg" | "motion";

let nextId = 1;

function contrast(color: string) {
  return color === PAINT_DARK ? PAINT_LIGHT : PAINT_DARK;
}

/** 레이어가 그려지는 크기(512 기준, 돌림은 무시한 대략 — 누른 자리 찾기용). */
function boxOf(ctx: CanvasRenderingContext2D, layer: Layer): { w: number; h: number } {
  if (layer.kind === "image") {
    const fit = SIDE / Math.max(layer.img.naturalWidth || 1, layer.img.naturalHeight || 1);
    return { w: layer.img.naturalWidth * fit * layer.scale, h: layer.img.naturalHeight * fit * layer.scale };
  }
  if (layer.kind === "text") {
    ctx.font = `bold ${TEXT_PX}px system-ui, sans-serif`;
    return { w: Math.max(40, ctx.measureText(layer.text || " ").width) * layer.scale, h: TEXT_PX * 1.25 * layer.scale };
  }
  return { w: EMOJI_PX * 1.1 * layer.scale, h: EMOJI_PX * 1.1 * layer.scale };
}

function drawAll(ctx: CanvasRenderingContext2D, snap: Snapshot, selected: number | null) {
  ctx.clearRect(0, 0, SIDE, SIDE);
  if (snap.bg) {
    ctx.fillStyle = snap.bg;
    ctx.fillRect(0, 0, SIDE, SIDE);
  }
  for (const layer of snap.layers) {
    ctx.save();
    ctx.translate(layer.x, layer.y);
    ctx.rotate((layer.rot * Math.PI) / 180);
    ctx.scale(layer.scale, layer.scale);
    if (layer.kind === "image") {
      const fit = SIDE / Math.max(layer.img.naturalWidth || 1, layer.img.naturalHeight || 1);
      const w = layer.img.naturalWidth * fit;
      const h = layer.img.naturalHeight * fit;
      ctx.drawImage(layer.img, -w / 2, -h / 2, w, h);
    } else if (layer.kind === "text") {
      ctx.font = `bold ${TEXT_PX}px system-ui, sans-serif`;
      // 캔버스는 문서 방향(아랍어 앱이면 rtl)을 따라 "¡Gracias!"의 부호가 뒤집힌다 — 글자에 맞춰 정한다.
      ctx.direction = /[\u0590-\u08ff]/.test(layer.text) ? "rtl" : "ltr";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (layer.outline) {
        ctx.lineJoin = "round";
        ctx.lineWidth = 16;
        ctx.strokeStyle = contrast(layer.color);
        ctx.strokeText(layer.text, 0, 0);
      }
      ctx.fillStyle = layer.color;
      ctx.fillText(layer.text, 0, 0);
    } else {
      ctx.font = `${EMOJI_PX}px "Apple Color Emoji", "Noto Color Emoji", "Segoe UI Emoji", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(layer.char, 0, 8);
    }
    ctx.restore();
  }
  for (const stroke of snap.strokes) {
    if (stroke.points.length === 0) continue;
    ctx.strokeStyle = stroke.color;
    ctx.fillStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    const [first, ...rest] = stroke.points;
    ctx.moveTo(first[0], first[1]);
    if (!rest.length) ctx.lineTo(first[0] + 0.1, first[1]);
    for (const [x, y] of rest) ctx.lineTo(x, y);
    ctx.stroke();
  }
  const chosen = snap.layers.find((layer) => layer.id === selected);
  if (chosen) {
    const { w, h } = boxOf(ctx, chosen);
    ctx.save();
    ctx.translate(chosen.x, chosen.y);
    ctx.rotate((chosen.rot * Math.PI) / 180);
    ctx.setLineDash([12, 8]);
    ctx.lineWidth = 3;
    ctx.strokeStyle = SELECTION_STROKE;
    ctx.strokeRect(-w / 2 - 6, -h / 2 - 6, w + 12, h + 12);
    ctx.restore();
  }
}

function loadImage(src: string, cors: boolean): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (cors) img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image"));
    img.src = src;
  });
}

function readFile(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("read"));
    reader.readAsDataURL(file);
  });
}

const MOTION_STYLE = `
@keyframes ie-bounce { 0%,100% { transform: translateY(0) scale(1,0.96) } 50% { transform: translateY(-8%) scale(1) } }
@keyframes ie-shake { 0%,50%,100% { transform: translateX(0) rotate(0) } 25% { transform: translateX(3.5%) rotate(5deg) } 75% { transform: translateX(-3.5%) rotate(-5deg) } }
@keyframes ie-pulse { 0%,100% { transform: scale(1) } 25% { transform: scale(1.1) } 75% { transform: scale(0.9) } }
@keyframes ie-wobble { 0%,100% { transform: rotate(0) } 25% { transform: rotate(12deg) } 75% { transform: rotate(-12deg) } }
`;

export function IconEditor({
  t,
  start,
  busy,
  error,
  onClose,
  onSave,
}: {
  t: IconCopy;
  /** 이어서 고칠 내 아이콘 그림 주소(없으면 빈 캔버스). */
  start?: string | null;
  busy: boolean;
  error: string;
  onClose: () => void;
  onSave: (dataUrl: string, motion: IconMotion | null) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const picker = useRef<HTMLInputElement>(null);
  const [snap, setSnap] = useState<Snapshot>({ layers: [], strokes: [], bg: null });
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [tool, setTool] = useState<Tool>("move");
  const [penColor, setPenColor] = useState(SWATCHES[1]);
  const [penWidth, setPenWidth] = useState(14);
  const [motion, setMotion] = useState<IconMotion | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const drag = useRef<{ id: number; dx: number; dy: number } | null>(null);
  const drawing = useRef(false);

  const remember = useCallback(() => setHistory((list) => [...list.slice(-30), snap]), [snap]);
  const chosen = snap.layers.find((layer) => layer.id === selected) ?? null;

  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (ctx) drawAll(ctx, snap, selected);
  }, [snap, selected]);

  // 내 아이콘을 열었으면 그 그림을 첫 레이어로(서버가 CORS로 보내 캔버스를 내보낼 수 있음).
  useEffect(() => {
    if (!start) return;
    let alive = true;
    void loadImage(start, true)
      .then((img) => {
        if (!alive) return;
        const id = nextId++;
        setSnap((current) => ({ ...current, layers: [{ id, kind: "image", img, x: SIDE / 2, y: SIDE / 2, scale: 1, rot: 0 }, ...current.layers] }));
      })
      .catch(() => alive && setLoadFailed(true));
    return () => {
      alive = false;
    };
  }, [start]);

  const add = (layer: Layer) => {
    remember();
    setSnap((current) => ({ ...current, layers: [...current.layers, layer] }));
    setSelected(layer.id);
  };
  const patch = (id: number, change: Partial<Layer>) =>
    setSnap((current) => ({ ...current, layers: current.layers.map((layer) => (layer.id === id ? ({ ...layer, ...change } as Layer) : layer)) }));

  const point = (event: React.PointerEvent<HTMLCanvasElement>): [number, number] => {
    const rect = event.currentTarget.getBoundingClientRect();
    return [((event.clientX - rect.left) / rect.width) * SIDE, ((event.clientY - rect.top) / rect.height) * SIDE];
  };

  const onDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const [x, y] = point(event);
    event.currentTarget.setPointerCapture(event.pointerId);
    if (tool === "pen") {
      remember();
      drawing.current = true;
      setSnap((current) => ({ ...current, strokes: [...current.strokes, { color: penColor, width: penWidth, points: [[x, y]] }] }));
      return;
    }
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    const hit = [...snap.layers].reverse().find((layer) => {
      const { w, h } = boxOf(ctx, layer);
      return Math.abs(x - layer.x) <= w / 2 + 10 && Math.abs(y - layer.y) <= h / 2 + 10;
    });
    setSelected(hit?.id ?? null);
    if (hit) {
      remember();
      drag.current = { id: hit.id, dx: x - hit.x, dy: y - hit.y };
    }
  };
  const onMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const [x, y] = point(event);
    if (drawing.current) {
      setSnap((current) => {
        const strokes = current.strokes.slice();
        const last = strokes.at(-1);
        if (last) strokes[strokes.length - 1] = { ...last, points: [...last.points, [x, y]] };
        return { ...current, strokes };
      });
      return;
    }
    if (drag.current) patch(drag.current.id, { x: x - drag.current.dx, y: y - drag.current.dy });
  };
  const onUp = () => {
    drawing.current = false;
    drag.current = null;
  };

  const undo = () => {
    const last = history.at(-1);
    if (!last) return;
    setHistory((list) => list.slice(0, -1));
    setSnap(last);
    if (selected !== null && !last.layers.some((layer) => layer.id === selected)) setSelected(null);
  };

  const empty = !snap.layers.length && !snap.strokes.length && !snap.bg;
  const save = () => {
    const out = document.createElement("canvas");
    out.width = SIDE;
    out.height = SIDE;
    const ctx = out.getContext("2d");
    if (!ctx) return;
    drawAll(ctx, snap, null);
    try {
      onSave(out.toDataURL("image/png"), motion);
    } catch {
      setLoadFailed(true);
    }
  };

  const toolButton = (id: Tool, icon: string, label: string, onClick?: () => void) => (
    <button
      key={id}
      type="button"
      aria-pressed={tool === id}
      onClick={() => {
        setTool(id);
        onClick?.();
      }}
      className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-meta ${tool === id ? "bg-white/15 text-ink" : "text-slate-400 hover:bg-white/10"}`}
    >
      <span className="text-title leading-none" aria-hidden>
        {icon}
      </span>
      <span className="max-w-full truncate">{label}</span>
    </button>
  );

  const swatches = (value: string | null, pick: (color: string) => void, withClear?: () => void) => (
    <div className="flex flex-wrap items-center gap-1.5">
      {withClear ? (
        <button type="button" onClick={withClear} aria-pressed={value === null} className={`rounded-lg border px-2 py-1 text-meta ${value === null ? "border-white/60 text-ink" : "border-line text-slate-300"}`}>
          {t.transparent}
        </button>
      ) : null}
      {SWATCHES.map((color) => (
        <button
          key={color}
          type="button"
          aria-label={color}
          aria-pressed={value === color}
          onClick={() => pick(color)}
          className={`h-7 w-7 rounded-full border-2 ${value === color ? "border-white" : "border-line"}`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );

  return (
    <BodyLayer>
      <style>{MOTION_STYLE}</style>
      <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/80" role="dialog" aria-label={t.make}>
        <div className="flex max-h-[95vh] w-full max-w-lg flex-col overflow-y-auto rounded-t-2xl border border-line bg-surface px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-3">
          <div className="mb-2 flex items-center gap-2">
            <h2 className="min-w-0 flex-1 truncate text-title font-semibold text-ink">{t.make}</h2>
            <button type="button" disabled={!history.length} onClick={undo} className="rounded-lg border border-line px-2.5 py-1 text-caption text-slate-200 disabled:opacity-40">
              ↶ {t.undo}
            </button>
            <button type="button" onClick={onClose} aria-label={t.close} className="shrink-0 rounded-full px-2 text-title text-slate-400 hover:bg-white/10">
              ×
            </button>
          </div>

          {/* 체크무늬 = 투명. 움직임은 미리 보기만 CSS로(실제 프레임은 서버). */}
          <div
            className="mx-auto aspect-square w-full max-w-[20rem] overflow-hidden rounded-xl border border-line"
            style={{ backgroundImage: CHECKER_BACKGROUND, backgroundSize: "24px 24px" }}
          >
            <canvas
              ref={canvas}
              width={SIDE}
              height={SIDE}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
              className="block h-full w-full touch-none"
              style={motion ? { animation: `ie-${motion} 0.7s ease-in-out infinite` } : undefined}
            />
          </div>

          <div className="mt-3 flex gap-1" role="group">
            {toolButton("move", "✋", t.toolMove)}
            {toolButton("photo", "🖼", t.toolPhoto, () => picker.current?.click())}
            {toolButton("text", "Aa", t.toolText, () => {
              // 빈 글자 레이어를 고른 채로 다시 누르면 새로 만들지 않는다.
              if (chosen?.kind === "text" && !chosen.text) return;
              add({ id: nextId++, kind: "text", text: "", color: SWATCHES[0], outline: true, x: SIDE / 2, y: SIDE * 0.8, scale: 1, rot: 0 });
            })}
            {toolButton("sticker", "😀", t.toolSticker)}
            {toolButton("pen", "✏️", t.toolPen)}
            {toolButton("bg", "🎨", t.toolBg)}
            {toolButton("motion", "✨", t.toolMotion)}
          </div>
          <input
            ref={picker}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              setTool("move");
              if (!file) return;
              void readFile(file)
                .then((url) => loadImage(url, false))
                .then((img) => add({ id: nextId++, kind: "image", img, x: SIDE / 2, y: SIDE / 2, scale: 1, rot: 0 }))
                .catch(() => setLoadFailed(true));
            }}
          />

          <div className="mt-3 space-y-2">
            {tool === "sticker" ? (
              <div className="grid grid-cols-8 gap-1">
                {STICKERS.map((char) => (
                  <button
                    key={char}
                    type="button"
                    onClick={() => {
                      add({ id: nextId++, kind: "emoji", char, x: SIDE / 2, y: SIDE / 2, scale: 1, rot: 0 });
                      setTool("move");
                    }}
                    className="rounded-lg py-1 text-title hover:bg-white/10"
                  >
                    {char}
                  </button>
                ))}
              </div>
            ) : null}
            {tool === "pen" ? (
              <>
                {swatches(penColor, setPenColor)}
                <label className="flex items-center gap-2 text-caption text-slate-400">
                  <span className="shrink-0">{t.size}</span>
                  <input type="range" min={4} max={40} value={penWidth} onChange={(event) => setPenWidth(Number(event.target.value))} className="flex-1" />
                </label>
              </>
            ) : null}
            {tool === "bg"
              ? swatches(
                  snap.bg,
                  (color) => {
                    remember();
                    setSnap((current) => ({ ...current, bg: color }));
                  },
                  () => {
                    remember();
                    setSnap((current) => ({ ...current, bg: null }));
                  },
                )
              : null}
            {tool === "motion" ? (
              <div className="flex flex-wrap gap-1.5">
                {([null, ...ICON_MOTIONS] as (IconMotion | null)[]).map((value) => (
                  <button
                    key={value ?? "none"}
                    type="button"
                    aria-pressed={motion === value}
                    onClick={() => setMotion(value)}
                    className={`rounded-lg border px-3 py-1.5 text-caption ${motion === value ? "border-white/40 bg-white/10 text-ink" : "border-line text-slate-200"}`}
                  >
                    {value === null ? t.motionNone : value === "bounce" ? t.motionBounce : value === "shake" ? t.motionShake : value === "pulse" ? t.motionPulse : t.motionWobble}
                  </button>
                ))}
              </div>
            ) : null}

            {/* 고른 레이어: 크기·돌리기(글자면 내용·색·테두리), 빼기. */}
            {chosen && (tool === "move" || tool === "text" || tool === "photo") ? (
              <div className="space-y-2 rounded-xl bg-surface-sunk px-3 py-2">
                {chosen.kind === "text" ? (
                  <>
                    <input
                      value={chosen.text}
                      maxLength={24}
                      autoFocus={!chosen.text}
                      onChange={(event) => patch(chosen.id, { text: event.target.value })}
                      aria-label={t.toolText}
                      dir="auto"
                      className="block w-full rounded-lg border border-line bg-surface px-3 py-2 text-note text-ink outline-none focus:border-white/40"
                    />
                    <div className="flex items-center gap-2">
                      <div className="min-w-0 flex-1">
                        {swatches(chosen.color, (color) => {
                          remember();
                          patch(chosen.id, { color });
                        })}
                      </div>
                      <label className="flex shrink-0 items-center gap-1 text-caption text-slate-300">
                        <input type="checkbox" checked={chosen.outline} onChange={(event) => patch(chosen.id, { outline: event.target.checked })} />
                        {t.outline}
                      </label>
                    </div>
                  </>
                ) : null}
                <label className="flex items-center gap-2 text-caption text-slate-400">
                  <span className="w-12 shrink-0">{t.size}</span>
                  <input type="range" min={0.2} max={3} step={0.05} value={chosen.scale} onPointerDown={remember} onChange={(event) => patch(chosen.id, { scale: Number(event.target.value) })} className="flex-1" />
                </label>
                <label className="flex items-center gap-2 text-caption text-slate-400">
                  <span className="w-12 shrink-0">{t.rotate}</span>
                  <input type="range" min={-180} max={180} step={1} value={chosen.rot} onPointerDown={remember} onChange={(event) => patch(chosen.id, { rot: Number(event.target.value) })} className="flex-1" />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    remember();
                    setSnap((current) => ({ ...current, layers: current.layers.filter((layer) => layer.id !== chosen.id) }));
                    setSelected(null);
                  }}
                  className="text-caption text-bad"
                >
                  {t.remove}
                </button>
              </div>
            ) : null}
          </div>

          {loadFailed ? <p className="mt-2 text-caption text-bad">{t.failed}</p> : null}
          {error ? <p className="mt-2 text-caption text-bad">{error}</p> : null}
          <button
            type="button"
            disabled={empty || busy}
            onClick={() => {
              setSelected(null);
              save();
            }}
            className="mt-3 w-full rounded-lg bg-platinum py-2.5 text-note font-semibold text-black hover:bg-platinum-hover disabled:opacity-40"
          >
            {busy ? t.uploading : t.saveIcon}
          </button>
        </div>
      </div>
    </BodyLayer>
  );
}
