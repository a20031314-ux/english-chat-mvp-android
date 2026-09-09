/**
 * The one-shot conversion that made the UI dark. ALREADY APPLIED — do not run.
 *
 * This walked src/components and src/app once, in September 2026, swapping the
 * light palette for the dark one wholesale. It is kept because it is the record
 * of what that mapping actually was: which slate turned into which white/10,
 * which accent became #4f86ff. Nothing else writes that down.
 *
 * Running it again would not be a no-op, it would be a regression. Four places
 * legitimately keep light-palette classes on a dark screen, and every one of
 * them is a case this script cannot tell apart from a leftover:
 *
 *   LandingPage and ReportContentDialog have deliberately light buttons, whose
 *   hover state is `hover:bg-white`. The bg-white rule below matches through the
 *   `hover:` prefix and would turn the hover dark, so the button would lose its
 *   highlight rather than gain a theme.
 *
 *   SelectableEnglishText marks a highlight with `bg-amber-200` and dark text on
 *   top of it. Rewriting text-slate-900 to text-slate-100 puts white lettering
 *   on a yellow highlighter.
 *
 * If the palette ever moves again, write the next mapping rather than re-running
 * this one, and give it the same list of exceptions to skip.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const skip = new Set([
  "PdfRenderer.tsx",
  "EpubRenderer.tsx",
  "ZoomableStage.tsx",
  "StudyImageBoard.tsx",
]);

const pairs = [
  ["hover:bg-slate-50", "hover:bg-white/10"],
  ["hover:bg-slate-100", "hover:bg-white/10"],
  ["hover:text-slate-900", "hover:text-white"],
  ["hover:text-slate-800", "hover:text-white"],
  ["hover:bg-slate-800", "hover:bg-[#6b9aff]"],
  ["focus:border-slate-500", "focus:border-[#4f86ff]"],
  ["focus:border-slate-400", "focus:border-[#4f86ff]"],
  ["border-slate-200/80", "border-white/10"],
  ["border-slate-200", "border-white/10"],
  ["border-slate-100", "border-white/10"],
  ["border-slate-300", "border-white/15"],
  ["bg-slate-50/", "KEEP_BG_SLATE50_SLASH"],
  ["bg-slate-50", "bg-white/5"],
  ["KEEP_BG_SLATE50_SLASH", "bg-slate-50/"],
  ["text-slate-900", "text-slate-100"],
  ["text-slate-800", "text-slate-100"],
  ["text-slate-700", "text-slate-200"],
  ["text-slate-600", "text-slate-300"],
];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full);
      continue;
    }
    if (!name.endsWith(".tsx") && !name.endsWith(".ts")) continue;
    if (skip.has(name)) continue;
    let src = readFileSync(full, "utf8");
    const before = src;
    for (const [from, to] of pairs) {
      src = src.split(from).join(to);
    }
    src = src.replace(/(?<![\w/])bg-white(?!\/)/g, "bg-[#151a2c]");
    src = src.replace(
      /rounded-xl bg-slate-900/g,
      "rounded-xl bg-[#4f86ff] shadow-[0_0_14px_rgba(79,134,255,0.32)]",
    );
    src = src.replace(
      /rounded-lg bg-slate-900/g,
      "rounded-lg bg-[#4f86ff] shadow-[0_0_12px_rgba(79,134,255,0.28)]",
    );
    src = src.replace(
      /rounded-full bg-slate-900/g,
      "rounded-full bg-[#4f86ff]",
    );
    src = src.replace(
      /bg-slate-900 px-4 py-2.5/g,
      "bg-[#4f86ff] px-4 py-2.5 shadow-[0_0_14px_rgba(79,134,255,0.32)]",
    );
    src = src.replace(
      /bg-slate-900 px-3 py-2.5/g,
      "bg-[#4f86ff] px-3 py-2.5 shadow-[0_0_14px_rgba(79,134,255,0.32)]",
    );
    src = src.replace(
      /bg-slate-900 px-3 py-2(?!\.)/g,
      "bg-[#4f86ff] px-3 py-2 shadow-[0_0_12px_rgba(79,134,255,0.28)]",
    );
    src = src.replace(/bg-violet-500/g, "bg-[#4f86ff]");
    src = src.replace(/hover:bg-violet-400/g, "hover:bg-[#6b9aff]");
    src = src.replace(/bg-cyan-500/g, "bg-[#4f86ff]");
    src = src.replace(/hover:bg-cyan-400/g, "hover:bg-[#6b9aff]");
    src = src.replace(/bg-teal-500/g, "bg-[#4f86ff]");
    src = src.replace(/bg-blue-500/g, "bg-[#4f86ff]");
    src = src.replace(/hover:bg-blue-400/g, "hover:bg-[#6b9aff]");
    src = src.replace(/focus:border-sky-400/g, "focus:border-[#4f86ff]");
    src = src.replace(/focus:border-violet-400/g, "focus:border-[#4f86ff]");
    src = src.replace(/focus:border-cyan-400/g, "focus:border-[#4f86ff]");
    if (src !== before) {
      writeFileSync(full, src);
      console.log("updated", full.replace(/\\/g, "/"));
    }
  }
}

walk("src/components");
walk("src/app");
