// The nine store-canvas designs (the "Just talk 스토어 스크린샷" canvas), localized for
// the Play custom store listings: Korea, Japan, China, Spain, India. Every listing
// learns English; the app UI, headlines and translations are in its language.
// These are designed mockups, not captures — store-shots/capture.mjs takes the real
// app. Custom listings are uploaded by hand in Play Console (fastlane/STORE_AUTOMATION.md).
//
// Run: node store-shots/canvas/render.mjs [outDir] [ko-KR]   → store-shots/out/canvas/<listing>/
import { mkdirSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { EN, LOCALES } from "./strings.mjs";

const OUT = process.argv[2] || path.join(path.dirname(new URL(import.meta.url).pathname), "..", "out", "canvas");
const only = process.argv[3];
const ACCENTS = ["#FF8A6B", "#7CC4FF", "#C6F25A", "#FFD15C"];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const ICON = {
  play: `<svg width="14" height="14" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M7 4l13 8-13 8z"/></svg>`,
  pause: (c = "#FFFFFF") => `<svg width="14" height="14" viewBox="0 0 24 24" fill="${c}"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>`,
  speaker: (c = "#FFFFFF") => `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/></svg>`,
  arrow: (c) => `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  dots: `<svg width="14" height="14" viewBox="0 0 24 24" fill="#FFFFFF"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>`,
  send: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#15161A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3L10 14M21 3l-7 18-4-7-7-4z"/></svg>`,
  loop: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3"/></svg>`,
  x: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
  tab: [
    (c) => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
    (c) => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/></svg>`,
    (c) => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>`,
    (c) => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9l5 3-5 3z" fill="${c}"/></svg>`,
    (c) => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h7v16H4zM13 4h7v16h-7z"/></svg>`,
  ],
};

function frame(L, idx, accent, phoneInner, phoneBg = "#000000") {
  const [kicker, title, subtitle] = L.heads[idx];
  return `<!doctype html><html lang="${L.lang}"><head><meta charset="utf-8"><style>
  html,body{margin:0}body{width:540px;height:960px;overflow:hidden;background:#15161A;font-family:${L.font};color:#fff}
  .wrap{width:540px;height:960px;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;padding-top:52px}
  .k{font-size:15px;font-weight:700;color:${accent};letter-spacing:.04em;text-align:center;padding:0 24px}
  h1{margin:12px 0 0;font-size:40px;line-height:1.2;font-weight:900;text-align:center;letter-spacing:-.02em;white-space:pre-line;padding:0 20px}
  p.s{margin:14px 0 0;font-size:16.5px;color:#B7B8BF;text-align:center;padding:0 32px;line-height:1.4}
  .phone{position:relative;margin:28px 0 30px;flex:1;min-height:0;width:420px;box-sizing:border-box;border-radius:44px;border:8px solid #000;outline:1px solid #34353C;background:${phoneBg};display:flex;flex-direction:column;overflow:hidden}
  .hdr{padding:18px 20px 12px;border-bottom:1px solid #222327;display:flex;justify-content:space-between;align-items:center}
  .body{flex:1;min-height:0;padding:16px 14px;display:flex;flex-direction:column;gap:10px;overflow:hidden}
  .ai{align-self:flex-start;max-width:84%;background:#1C1C1E;border-radius:18px;padding:11px 14px;display:flex;flex-direction:column;gap:4px}
  .me{align-self:flex-end;max-width:82%;background:#2A2A2D;border-radius:18px;padding:11px 14px;font-size:15px;line-height:1.4}
  .en{font-size:15px;line-height:1.4}.tr{font-size:12.5px;color:#8E8E93;line-height:1.45}
  .chip{font-size:12px;border:1px solid #3A3B40;border-radius:10px;padding:6px 12px}
  .tabs{display:flex;justify-content:space-around;padding:10px 6px 14px;border-top:1px solid #222327;background:#0B0B0D}
  .tabs div{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:11px;color:#8E8E93;max-width:76px;text-align:center}
  .tabs div.on{color:#fff;font-weight:700}
  </style></head><body><div class="wrap">
  <div class="k">${esc(kicker)}</div><h1>${esc(title)}</h1><p class="s">${esc(subtitle)}</p>
  <div class="phone">${phoneInner}</div></div></body></html>`;
}

const ai = (en, tr, hl, accent) =>
  `<div class="ai"${hl ? ` style="outline:2px solid ${accent}"` : ""}><div class="en">${esc(en)}</div>${tr ? `<div class="tr"${hl ? ' style="color:#B7B8BF"' : ""}>${esc(tr)}</div>` : ""}</div>`;
const me = (text) => `<div class="me">${esc(text)}</div>`;
const chatHdr = (L) =>
  `<div class="hdr"><div style="display:flex;flex-direction:column;gap:2px"><div style="font-size:17px;font-weight:700;font-family:'Noto Sans',sans-serif">Just talk</div><div style="font-size:12px;color:#8E8E93">${esc(L.ui.friend)}</div></div><div class="chip">${esc(L.ui.stop)}</div></div>`;
const footer = (text) => `<div style="padding:14px 18px 18px;border-top:1px solid #222327;font-size:13px;color:#B7B8BF">${esc(text)}</div>`;
const tabs = (L, on) =>
  `<div class="tabs">${L.ui.tabs.map((t, i) => `<div class="${i === on ? "on" : ""}">${ICON.tab[i](i === on ? "#FFFFFF" : "#8E8E93")}${esc(t)}</div>`).join("")}</div>`;
const videoHdr = (L) =>
  `<div style="padding:16px 18px 12px;display:flex;align-items:baseline;gap:12px;border-bottom:1px solid #222327"><div style="font-size:13px;color:#8E8E93">${esc(L.ui.otherVideos)}</div><div style="font-size:17px;font-weight:700">${esc(L.ui.videoLessons)}</div></div>`;

const STREET = `<svg width="404" height="200" viewBox="0 0 404 210" preserveAspectRatio="xMidYMid slice" style="display:block"><rect width="404" height="210" fill="#F2B880"/><circle cx="318" cy="62" r="26" fill="#FFE2B8"/><rect x="0" y="92" width="70" height="118" fill="#3B3F58"/><rect x="62" y="64" width="64" height="146" fill="#4A4F6E"/><rect x="118" y="104" width="56" height="106" fill="#353950"/><rect x="250" y="84" width="70" height="126" fill="#454A68"/><rect x="312" y="112" width="92" height="98" fill="#383C55"/><rect x="76" y="80" width="10" height="12" fill="#FFD58A"/><rect x="98" y="80" width="10" height="12" fill="#FFD58A"/><rect x="76" y="104" width="10" height="12" fill="#FFD58A"/><rect x="98" y="128" width="10" height="12" fill="#FFD58A"/><rect x="264" y="100" width="10" height="12" fill="#FFD58A"/><rect x="290" y="124" width="10" height="12" fill="#FFD58A"/><rect x="0" y="178" width="404" height="32" fill="#2A2D3E"/><rect x="160" y="128" width="92" height="56" rx="6" fill="#D9573B"/><path d="M152 132 L260 132 L248 112 L164 112 Z" fill="#F6E7CF"/><rect x="172" y="146" width="68" height="22" rx="3" fill="#FBEBD3"/><circle cx="176" cy="188" r="8" fill="#1A1C27"/><circle cx="236" cy="188" r="8" fill="#1A1C27"/></svg>`;
const CAFE = `<svg width="404" height="180" viewBox="0 0 404 190" preserveAspectRatio="xMidYMid slice" style="display:block"><rect width="404" height="190" fill="#BFD8CF"/><rect x="0" y="120" width="404" height="70" fill="#8A6A52"/><rect x="24" y="30" width="110" height="80" rx="4" fill="#E9F2EE"/><rect x="34" y="40" width="90" height="60" fill="#9CC3D5"/><rect x="270" y="20" width="16" height="100" fill="#6E8F84"/><circle cx="278" cy="24" r="26" fill="#5E8F6E"/><circle cx="300" cy="44" r="20" fill="#4F7F60"/><circle cx="202" cy="78" r="26" fill="#E8B48E"/><path d="M176 74 Q202 34 228 74 Q222 58 202 56 Q182 58 176 74 Z" fill="#3A2A22"/><path d="M150 190 Q150 118 202 112 Q254 118 254 190 Z" fill="#E36D4E"/><rect x="320" y="104" width="34" height="22" rx="3" fill="#F5EEDF"/><rect x="354" y="108" width="8" height="12" rx="4" fill="none" stroke="#F5EEDF" stroke-width="3"/></svg>`;
const progress = (pct) =>
  `<div style="padding:10px 16px;display:flex;align-items:center;gap:12px;background:#0E1626">${pct > 20 ? ICON.pause() : ICON.play}<div style="flex:1;height:6px;border-radius:3px;background:#3A3F4C"><div style="width:${pct}%;height:6px;border-radius:3px;background:#fff"></div></div><div style="font-size:12px;color:#B7B8BF;font-family:'Noto Sans',sans-serif">00:${pct > 20 ? "21" : "06"}</div></div>`;

const SCENES = [
  // 01 chat + translation
  (L, a) => chatHdr(L) + `<div class="body">${ai(EN.L1, L.t.L1)}${me(EN.me1)}${ai(EN.L2, L.t.L2)}${me(EN.me2)}${ai(EN.L3, L.t.L3, true, a)}</div>` + footer(L.ui.inputHint),
  // 02 where you got stuck
  (L, a) => `<div style="opacity:.3">${chatHdr(L)}<div class="body" style="flex:none">${ai(EN.L4, L.t.L4)}${me(EN.me4)}</div></div>
    <div style="position:absolute;left:10px;right:10px;bottom:10px;background:#18181B;border:1px solid #2E2F35;border-radius:26px;padding:20px 18px 16px;display:flex;flex-direction:column;gap:11px">
      <div style="font-size:17px;font-weight:700">${esc(L.ui.stuckTitle)}</div>
      <div style="font-size:13px;color:#8E8E93">${esc(EN.L4)}</div>
      <div style="font-size:14px;line-height:1.55">${esc(L.t.L19)}</div>
      <div style="background:#222327;border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:6px">
        <div style="font-size:12px;color:#8E8E93">${esc(L.ui.couldSay)}</div>
        <div style="font-size:16px;font-weight:500">${esc(EN.L5)}</div>
        <div style="font-size:12.5px;color:#8E8E93">${esc(L.t.L5)}</div>
        <div style="margin-top:6px;background:#2C2D33;border-radius:12px;padding:10px 12px;display:flex;flex-direction:column;gap:4px"><div style="font-size:11.5px;color:#8E8E93">${esc(L.ui.heard)}</div><div style="font-size:15px">i like fantasy and mystery books</div></div>
        <div style="font-size:13px;color:${a};font-weight:500">${esc(L.ui.allRecognized)}</div>
        <div style="align-self:flex-start;margin-top:4px;border:1px solid #4A4B52;border-radius:22px;padding:8px 16px;font-size:13px">${esc(L.ui.tryAgain)}</div>
      </div>
      <div style="background:#2C2D33;border-radius:14px;padding:12px;font-size:14px;font-weight:500;text-align:center">${esc(L.ui.close)}</div>
    </div>`,
  // 03 gentle hint
  (L, a) => chatHdr(L) + `<div class="body">${ai(EN.L6, L.t.L6)}
    <div class="me" style="display:flex;flex-direction:column;gap:10px"><div>${esc(EN.me4)}</div><div style="font-size:12px;border:1px solid #4A4B52;border-radius:16px;padding:6px 12px">${esc(L.ui.seeWhy)}</div></div>
    ${ai(EN.L7, L.t.L7, true, a)}${me(EN.me7)}${ai(EN.L8, L.t.L8)}</div>` + footer(L.ui.inputHint),
  // 04 chat like a friend
  (L, a) => chatHdr(L) + `<div class="body">${ai(EN.L9, L.t.L9)}${me(EN.me9)}${ai(EN.L10, L.t.L10, true, a)}${me(EN.me10)}${ai(EN.L11, L.t.L11)}</div>` + footer(L.ui.inputHint),
  // 05 languages
  (L) => `<div style="flex:1;padding:24px 18px;display:flex;flex-direction:column;gap:12px;justify-content:center;background:#15161A">
    ${L.targets.map((t, i) => `<div style="display:flex;align-items:center;justify-content:space-between;background:#1C1C1E;border-radius:18px;padding:18px 20px">
      <div style="display:flex;flex-direction:column;gap:4px"><div style="font-size:12px;color:#8E8E93">${esc(L.ui.iSpeak)}</div><div style="font-size:19px;font-weight:700">${esc(L.native)}</div></div>
      ${ICON.arrow(ACCENTS[i])}
      <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-end"><div style="font-size:12px;color:#8E8E93">${esc(L.ui.learning)}</div><div style="font-size:19px;font-weight:700;font-family:'Noto Sans','Noto Sans CJK KR','Noto Sans CJK JP','Noto Sans CJK SC',sans-serif">${esc(t)}</div></div></div>`).join("")}
    <div style="text-align:center;font-size:14px;color:#B7B8BF;padding-top:6px">${esc(L.ui.more)}</div></div>`,
  // 06 video, auto-split
  (L, a) => videoHdr(L) + `<div style="position:relative;flex-shrink:0;overflow:hidden">${STREET}
      <div style="position:absolute;left:14px;top:12px;font-family:'Noto Sans',sans-serif"><div style="font-size:16px;font-weight:700">Street Food Tour</div><div style="font-size:12px;color:#FFF3E3">City Walks</div></div>
      <div style="position:absolute;left:0;right:0;bottom:0;height:4px;background:rgba(255,255,255,.3)"><div style="width:42%;height:4px;background:${a}"></div></div></div>
    ${progress(42)}
    <div class="body" style="padding:12px">
      <div style="background:#1C1C1E;border-radius:16px;padding:12px 14px;display:flex;flex-direction:column;gap:6px;opacity:.6"><div style="display:flex;justify-content:space-between"><div style="font-size:11.5px;color:#8E8E93">00:14 – 00:19</div>${ICON.play}</div><div class="en">${esc(EN.seg1)}</div></div>
      <div style="background:#ECEBE6;color:#15161A;border-radius:16px;padding:12px 14px;display:flex;flex-direction:column;gap:6px;outline:2px solid ${a}">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:6px"><div style="font-size:11.5px;color:#5A5B60">00:19 – 00:24</div>
          <div style="display:flex;gap:6px;align-items:center"><div style="font-size:11px;background:#D6D5CF;border-radius:8px;padding:4px 8px">${esc(L.ui.merge)}</div><div style="font-size:11px;background:#D6D5CF;border-radius:8px;padding:4px 8px">${esc(L.ui.split)}</div><div style="width:26px;height:26px;border-radius:8px;background:#fff;display:flex;align-items:center;justify-content:center">${ICON.pause("#15161A")}</div></div></div>
        <div style="font-size:15px;line-height:1.4;font-weight:500">${esc(EN.L12)}</div>
        <div style="font-size:12.5px;line-height:1.45;color:#4A4B50">${esc(L.t.L12)}</div></div>
      <div style="background:#1C1C1E;border-radius:16px;padding:12px 14px;display:flex;flex-direction:column;gap:6px"><div style="display:flex;justify-content:space-between"><div style="font-size:11.5px;color:#8E8E93">00:24 – 00:29</div>${ICON.play}</div><div class="en">${esc(EN.seg3)}</div></div>
    </div>` + tabs(L, 3),
  // 07 video, replay & save
  (L, a) => videoHdr(L) + `<div style="position:relative;flex-shrink:0;overflow:hidden">${CAFE}<div style="position:absolute;left:0;right:0;bottom:0;height:4px;background:rgba(255,255,255,.3)"><div style="width:18%;height:4px;background:${a}"></div></div></div>
    ${progress(18)}
    <div class="body" style="padding:14px 12px;gap:12px">
      <div style="background:#1C1C1E;border-radius:18px;padding:16px;display:flex;flex-direction:column;gap:10px">
        <div style="display:flex;gap:12px;align-items:flex-start"><div style="flex:1;font-size:19px;line-height:1.35;font-weight:700">${esc(EN.L13)}</div><div style="width:38px;height:38px;flex-shrink:0;border-radius:10px;border:1px solid #3A3B40;display:flex;align-items:center;justify-content:center">${ICON.play}</div></div>
        <div style="font-size:13.5px;line-height:1.5;color:#B7B8BF">${esc(L.t.L13)}</div>
        <div style="display:flex;justify-content:space-between;align-items:center"><div style="font-size:12px;color:#7CC4FF;font-family:'Noto Sans',sans-serif">00:03 – 00:08</div><div style="display:flex;align-items:center;gap:6px;font-size:12px;color:#8E8E93">${ICON.loop}${esc(L.ui.loop)}</div></div></div>
      <div style="font-size:12px;color:#8E8E93;padding-left:4px">${esc(L.ui.keyExpr)}</div>
      <div style="background:#1C1C1E;border-radius:14px;padding:12px 14px;display:flex;justify-content:space-between;align-items:center;gap:10px">
        <div style="display:flex;flex-direction:column;gap:2px"><div style="font-size:15px;font-weight:500">${esc(EN.L14)}</div><div style="font-size:12px;color:#8E8E93">${esc(L.t.L14)}</div></div>
        <div style="font-size:11px;color:#15161A;background:${a};border-radius:10px;padding:5px 10px;font-weight:700;white-space:nowrap">${esc(L.ui.saved)}</div></div>
      <div style="margin-top:auto;background:${a};color:#15161A;border-radius:14px;padding:13px;font-size:14px;font-weight:700;text-align:center">${esc(L.ui.savedToBook)}</div>
    </div>` + tabs(L, 3),
  // 08 type in your language, see English
  (L, a) => `<div style="padding:14px 16px;display:flex;align-items:center;gap:10px;border-bottom:1px solid #222327"><div style="width:30px;height:30px;border-radius:9px;border:1px solid #3A3B40;display:flex;align-items:center;justify-content:center">${ICON.dots}</div><div style="font-size:15px;font-weight:500;font-family:'Noto Sans',sans-serif">Alex</div><div style="font-size:12px;background:#26272B;border-radius:12px;padding:4px 10px">${esc(L.ui.friend)}</div></div>
    <div class="body" style="gap:12px">
      <div style="align-self:flex-start;max-width:84%;background:#161618;border:1px solid #2A2B30;border-radius:18px;padding:14px;display:flex;flex-direction:column;gap:8px">
        ${["Hey!", "How's it going?", EN.L16].map((x) => `<div style="border-left:3px solid #4A4B52;padding-left:10px;font-size:15px">${esc(x)}</div>`).join("")}
        <div style="display:flex;gap:8px;margin-top:4px"><div style="width:34px;height:30px;border-radius:9px;border:1px solid #3A3B40;display:flex;align-items:center;justify-content:center">${ICON.speaker()}</div><div style="height:30px;border-radius:9px;border:1px solid #3A3B40;padding:0 12px;display:flex;align-items:center;font-size:12px">${esc(L.ui.translate)}</div></div></div>
      <div style="align-self:flex-end;max-width:76%;background:#ECEBE6;color:#15161A;border-radius:18px;padding:14px;display:flex;flex-direction:column;gap:8px;outline:2px solid ${a}">
        <div style="font-size:14.5px;color:#3A3B40">${esc(L.t.L15)}</div><div style="height:1px;background:#9EA3B0"></div>
        <div style="border-left:3px solid #C9CDD8;padding-left:10px;font-size:15px;font-weight:500">Hi!</div>
        <div style="border-left:3px solid #C9CDD8;padding-left:10px;font-size:15px;font-weight:500">Good morning!</div>
        <div style="width:34px;height:30px;border-radius:9px;background:#232838;display:flex;align-items:center;justify-content:center">${ICON.speaker()}</div></div>
      <div style="align-self:flex-start;max-width:84%;background:#161618;border:1px solid #2A2B30;border-radius:18px;padding:14px;display:flex;flex-direction:column;gap:8px">
        ${["Good morning!", "Not much going on today, just relaxing.", "How about you?"].map((x) => `<div style="border-left:3px solid #4A4B52;padding-left:10px;font-size:15px">${esc(x)}</div>`).join("")}</div>
    </div>
    <div style="padding:10px 12px;display:flex;gap:8px;border-top:1px solid #222327;flex-wrap:wrap"><div style="font-size:12.5px;background:#ECEBE6;color:#15161A;border-radius:12px;padding:8px 12px;font-weight:500">${esc(L.ui.chatInTarget)}</div><div style="font-size:12.5px;background:#ECEBE6;color:#15161A;border-radius:12px;padding:8px 12px;font-weight:500">${esc(L.ui.learnExpr)}</div></div>
    <div style="padding:4px 12px 14px;display:flex;gap:8px;align-items:center"><div style="width:38px;height:38px;border-radius:12px;border:1px solid #3A3B40;display:flex;align-items:center;justify-content:center;font-size:20px">+</div><div style="flex:1;min-height:38px;border-radius:12px;border:1px solid #3A3B40;display:flex;align-items:center;padding:4px 12px;font-size:12.5px;color:#8E8E93;line-height:1.3">${esc(L.ui.inputChat)}</div><div style="width:38px;height:38px;border-radius:12px;background:#ECEBE6;display:flex;align-items:center;justify-content:center">${ICON.send}</div></div>`,
  // 09 word explanation
  (L, a) => `<div class="body" style="padding:18px 16px;gap:11px;background:#0B0B0D">
    <div style="display:flex;justify-content:space-between;align-items:center"><div style="font-size:14px;font-weight:700">${esc(L.ui.sentence)}</div>${ICON.x}</div>
    <div style="display:flex;gap:10px;align-items:center"><div style="flex:1;font-size:19px;line-height:1.4;font-weight:500">Any fun plans <span style="background:#3A3B40;border-radius:4px;padding:0 3px;outline:2px solid ${a}">for</span> <span style="text-decoration:underline;text-underline-offset:4px">the weekend</span>?</div><div style="width:36px;height:32px;border-radius:9px;border:1px solid #3A3B40;display:flex;align-items:center;justify-content:center">${ICON.speaker()}</div></div>
    <div style="font-size:13.5px;color:#B7B8BF">${esc(L.t.L16)}</div>
    <div style="display:flex;justify-content:space-between;align-items:center;background:#1C1C1E;border-radius:16px;padding:6px 14px">${[0, 1, 2, 3, 4, 5].map((i) => i === 3 ? `<div style="width:54px;height:22px;border-radius:11px;background:#C9C9C9;display:flex;align-items:center;justify-content:center"><div style="width:9px;height:9px;border-radius:50%;background:#fff"></div></div>` : `<div style="width:9px;height:9px;border-radius:50%;background:#6A6B70"></div>`).join("")}</div>
    <div style="display:flex;justify-content:space-between;align-items:center"><div style="font-size:28px;font-weight:700;font-family:'Noto Sans',sans-serif">for</div><div style="width:36px;height:32px;border-radius:9px;border:1px solid #3A3B40;display:flex;align-items:center;justify-content:center">${ICON.speaker()}</div></div>
    <div style="background:#1C1C1E;border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:7px">
      <div style="font-size:13.5px;line-height:1.5;font-weight:500">${esc(L.t.forMain)}</div>
      ${[[L.ui.role, L.t.forRole], [L.ui.usage, L.t.forUsage], [L.ui.form, L.t.forForm]].map(([k, v]) => `<div style="font-size:11.5px;color:#9AA6C8;margin-top:3px">${esc(k)}</div><div style="font-size:13px;line-height:1.5">${esc(v)}</div>`).join("")}
      <div style="font-size:11.5px;color:#9AA6C8;margin-top:3px">${esc(L.ui.examples)}</div>
      <div><div style="font-size:13.5px">${esc(EN.ex1)}</div><div style="font-size:12px;color:#9AA6C8">${esc(L.t.ex1)}</div></div>
      <div><div style="font-size:13.5px">${esc(EN.ex2)}</div><div style="font-size:12px;color:#9AA6C8">${esc(L.t.ex2)}</div></div>
    </div></div>`,
];
const NAMES = ["01-chat-translation", "02-where-stuck", "03-gentle-hint", "04-chat-friend", "05-languages", "06-video-split", "07-video-save", "08-type-own-language", "09-word-explain"];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 });
const overflow = [];
for (const [code, L] of Object.entries(LOCALES)) {
  if (only && code !== only) continue;
  const dir = path.join(OUT, L.dir);
  mkdirSync(dir, { recursive: true });
  for (let i = 0; i < SCENES.length; i++) {
    const accent = ACCENTS[i % ACCENTS.length];
    await page.setContent(frame(L, i, accent, SCENES[i](L, accent), i === 4 ? "#15161A" : i === 8 ? "#0B0B0D" : "#000000"), { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    // Flag text that is cut off inside the phone, so nothing ships clipped.
    const clipped = await page.evaluate(() => {
      const phone = document.querySelector(".phone").getBoundingClientRect();
      const h1 = document.querySelector("h1");
      const lines = Math.round(h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight));
      const out = [...document.querySelectorAll(".phone *")].filter((el) => {
        const r = el.getBoundingClientRect();
        return el.children.length === 0 && el.textContent.trim() && r.height > 0 && (r.bottom > phone.bottom - 6 || r.right > phone.right - 4);
      }).map((el) => el.textContent.trim().slice(0, 30));
      return { lines, out };
    });
    if (clipped.lines > 2 || clipped.out.length) overflow.push(`${code} ${NAMES[i]}: h1 ${clipped.lines} lines; clipped ${JSON.stringify(clipped.out.slice(0, 3))}`);
    await page.screenshot({ path: path.join(dir, `${NAMES[i]}.png`) });
  }
  console.log("ok", code);
}
await browser.close();
console.log(overflow.length ? "CHECK:\n" + overflow.join("\n") : "no clipping found");
