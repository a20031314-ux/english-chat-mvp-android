import { parseCritique, parseMeaningExtraction, parseTranslated } from "./parse.ts";
import {
  critiqueTranslationSystem,
  critiqueTranslationUser,
  extractMeaningSystem,
  extractMeaningUser,
  generateTranslationSystem,
  generateTranslationUser,
  onePassSystem,
  onePassUser,
} from "./prompts.ts";
import type {
  JsonCompleter,
  ReconstructOptions,
  ReconstructionTranslateResult,
  TranslationCompareRow,
  TranslationContext,
} from "./types.ts";

export async function onePassTranslate(
  ctx: TranslationContext,
  completeJson: JsonCompleter,
): Promise<string> {
  const raw = await completeJson(onePassSystem(ctx), onePassUser(ctx));
  return parseTranslated(raw) || "";
}

export async function extractMeaning(
  ctx: TranslationContext,
  completeJson: JsonCompleter,
) {
  const raw = await completeJson(
    extractMeaningSystem(ctx),
    extractMeaningUser(ctx),
  );
  const meaning = parseMeaningExtraction(raw);
  if (!meaning) throw new Error("empty meaning extraction");
  return meaning;
}

export async function generateFromMeaning(
  ctx: TranslationContext,
  meaning: ReconstructionTranslateResult["meaning"],
  completeJson: JsonCompleter,
): Promise<string> {
  const raw = await completeJson(
    generateTranslationSystem(ctx),
    generateTranslationUser(ctx, meaning),
  );
  const translated = parseTranslated(raw);
  if (!translated) throw new Error("empty reconstructed translation");
  return translated;
}

export async function critiqueAndRefine(
  ctx: TranslationContext,
  meaning: ReconstructionTranslateResult["meaning"],
  draft: string,
  completeJson: JsonCompleter,
): Promise<{ translated: string; changed: boolean }> {
  const raw = await completeJson(
    critiqueTranslationSystem(ctx),
    critiqueTranslationUser(ctx, meaning, draft),
  );
  return parseCritique(raw, draft);
}

export async function reconstructTranslation(
  ctx: TranslationContext,
  completeJson: JsonCompleter,
  options: ReconstructOptions = {},
): Promise<ReconstructionTranslateResult> {
  const meaning = await extractMeaning(ctx, completeJson);
  const draft = await generateFromMeaning(ctx, meaning, completeJson);
  if (!options.enableCritique) {
    return { meaning, translated: draft };
  }
  const refined = await critiqueAndRefine(ctx, meaning, draft, completeJson);
  return {
    meaning,
    translated: refined.translated,
    draft,
    critiqueChanged: refined.changed,
  };
}

export async function compareTranslationPasses(
  ctx: TranslationContext,
  completeJson: JsonCompleter,
  options: ReconstructOptions = {},
): Promise<TranslationCompareRow> {
  const [onePass, reconstructed] = await Promise.all([
    onePassTranslate(ctx, completeJson),
    reconstructTranslation(ctx, completeJson, options),
  ]);
  const twoPass = reconstructed.draft ?? reconstructed.translated;
  const row: TranslationCompareRow = {
    sourceText: ctx.sourceText,
    onePass,
    reconstructed: twoPass,
    meaning: reconstructed.meaning,
    ...(options.enableCritique
      ? {
          critiqued: reconstructed.translated,
          critiqueChanged: reconstructed.critiqueChanged,
        }
      : {}),
  };
  console.info("[translate:compare]", {
    source: row.sourceText,
    onePass: row.onePass,
    twoPass: row.reconstructed,
    ...(row.critiqued
      ? { threePass: row.critiqued, critiqueChanged: row.critiqueChanged }
      : {}),
    meaning: row.meaning,
  });
  return row;
}

export function formatCompareRow(row: TranslationCompareRow): string {
  const keep =
    row.meaning.keyEntities.length > 0
      ? row.meaning.keyEntities.join(", ")
      : "(none)";
  const lines = [
    `EN        ${row.sourceText}`,
    `1-pass    ${row.onePass}`,
    `2-pass    ${row.reconstructed}`,
  ];
  if (row.critiqued != null) {
    const flag = row.critiqueChanged ? " (rewrote)" : " (kept)";
    lines.push(`3-pass    ${row.critiqued}${flag}`);
  }
  lines.push(`meaning   ${row.meaning.coreMeaning}`);
  lines.push(
    `intent    ${row.meaning.speakerIntent} · ${row.meaning.formalityLevel} · ${row.meaning.speakerRelationship}`,
  );
  const texture = row.meaning.speechTexture;
  if (texture) {
    const fillers = texture.fillers.length ? texture.fillers.join(", ") : "(none)";
    lines.push(
      `texture   ${texture.registerType} · ${texture.sentenceRhythm} · fillers: ${fillers}${
        texture.hasSelfCorrection ? " · self-correction" : ""
      }`,
    );
  }
  lines.push(`keep      ${keep}`);
  return lines.join("\n");
}
