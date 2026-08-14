/**
 * Prints old vs improved subtitle comparisons from the fixture set.
 * Usage: node --experimental-strip-types scripts/compare-subtitle-naturalization.mjs
 */
import { SUBTITLE_NATURALIZATION_CASES } from "../src/lib/videoSubtitle/subtitleNaturalizationCases.ts";

function line(label, text) {
  const rendered = String(text).replace(/\n/g, " / ");
  console.log(`  ${label.padEnd(10)} ${rendered}`);
}

console.log(`Subtitle naturalization comparisons (${SUBTITLE_NATURALIZATION_CASES.length} cases)\n`);

for (const item of SUBTITLE_NATURALIZATION_CASES) {
  console.log(`[${item.id}] ${item.category}`);
  line("EN", item.original);
  line("OLD", item.oldTranslation);
  line("NEW", item.improvedSubtitle);
  console.log("");
}
