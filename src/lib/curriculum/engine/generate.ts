import { normalizeCurriculum } from "./normalize.ts";
import { buildCurriculumPrompt, type CurriculumPrompt } from "./prompt.ts";
import type { CurriculumInput, NormalizeResult, Pack } from "./types.ts";

/**
 * Draw a curriculum: prompt, call, read, check — and once, if the first answer
 * was too thin to keep, say what was wrong and ask again.
 *
 * The model is passed in, not imported. A CurriculumModel is any function that
 * takes the prompt and returns the reply text, so the same generation runs on
 * OpenAI today (server/curriculumModel.ts), on another provider tomorrow, on a
 * learner's own key in a client, or on a fixed string in a test. Nothing here
 * knows which.
 */

export type CurriculumModel = (prompt: CurriculumPrompt) => Promise<string>;

export type GenerateResult =
  | ({ ok: true; attempts: number } & NormalizeResult)
  | { ok: false; attempts: number; error: "MODEL_FAILED" | "UNREADABLE" | "TOO_THIN"; detail?: string };

/**
 * Read one json value out of a reply: the whole reply, else a fenced block,
 * else the span from the first brace to the last. Models that were asked for
 * json alone still sometimes add a sentence.
 */
export function readJsonReply(reply: string): unknown {
  const tries = [reply.trim()];
  const fence = reply.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) tries.push(fence[1].trim());
  const a = reply.indexOf("{"), b = reply.lastIndexOf("}");
  if (a >= 0 && b > a) tries.push(reply.slice(a, b + 1));
  for (const t of tries) {
    try { return JSON.parse(t); } catch { /* next */ }
  }
  return undefined;
}

export async function generateCurriculum(args: {
  pack: Pack;
  input: CurriculumInput;
  model: CurriculumModel;
  id: string;
  now?: () => Date;
  /** Retry once with what was wrong when the first map is too thin. Default true. */
  repair?: boolean;
}): Promise<GenerateResult> {
  const { pack, input, model, id } = args;
  const createdAt = (args.now ?? (() => new Date()))().toISOString();
  const prompt = buildCurriculumPrompt(pack, input);
  let attempts = 0;
  let lastDropped: string[] = [];

  for (const round of [0, 1]) {
    if (round === 1 && args.repair === false) break;
    const thisPrompt = round === 0 ? prompt : {
      ...prompt,
      user: `${prompt.user}\n\nThe last map could not be used: it had too few well-formed topics. Problems: ${lastDropped.slice(0, 12).join("; ") || "no readable topics"}. Write it again, following the shape exactly.`,
    };
    attempts++;
    let reply: string;
    try {
      reply = await model(thisPrompt);
    } catch (error) {
      return { ok: false, attempts, error: "MODEL_FAILED", detail: String(error) };
    }
    const raw = readJsonReply(reply);
    if (raw === undefined) {
      lastDropped = ["the reply was not json"];
      if (round === 0) continue;
      return { ok: false, attempts, error: "UNREADABLE" };
    }
    const result = normalizeCurriculum(raw, pack, input, { id, createdAt });
    if (result) return { ok: true, attempts, ...result };
    // Find out what went wrong for the second try, with a floor of zero topics.
    lastDropped = normalizeCurriculum(raw, { ...pack, topics: { ...pack.topics, min: 0 }, sectors: pack.sectors.mode === "free" ? { ...pack.sectors, min: 0 } : pack.sectors }, input, { id, createdAt })?.dropped ?? [];
  }
  return { ok: false, attempts, error: "TOO_THIN", detail: lastDropped.slice(0, 12).join("; ") };
}
