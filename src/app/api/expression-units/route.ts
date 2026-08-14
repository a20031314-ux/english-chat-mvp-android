import OpenAI from "openai";
import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import {
  localExpressionUnits,
  normalizeUnitTexts,
} from "@/lib/expressionUnits";

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

const SYSTEM = `You split ONE English sentence into analysis units for a language learner.

Return ONLY JSON:
{ "units": ["looking forward to", "the weekend"] }

Rules:
1) Each unit MUST be an exact substring of the given sentence (same spelling, including inflections like "looking").
2) Units MAY overlap when a smaller phrase sits inside a larger grammar chunk.
3) Include multi-word units: phrasal verbs, idioms, collocations, light-verb patterns, noun compounds, grammar chunks (have been -ing, used to, going to, have to, want to, a lot of, in order to).
4) Include standalone content words (noun, verb, adjective, adverb, name) that are NOT bound inside a multi-word unit you listed.
5) Do NOT list a function word alone (a, an, the, to, of, in, on, at, for, and, or, but) if it belongs to a larger unit.
6) Do NOT list an incomplete piece of a multi-word unit (e.g. "looking forward" without "to" when the sentence has "looking forward to").
7) Do NOT list the whole sentence unless it is a short fixed saying (4 words or fewer).
8) Max 24 units. Prefer units a learner would tap to study.`;

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  let body: { sentence?: unknown };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const sentence =
    typeof body.sentence === "string"
      ? body.sentence.replace(/\s+/g, " ").trim()
      : "";
  if (!sentence || !/[A-Za-z]/.test(sentence) || sentence.length > 500) {
    return jsonWithCors(request, { error: "sentence required" }, { status: 400 });
  }

  const fallback = localExpressionUnits(sentence);
  const openai = getClient();
  if (!openai) {
    return jsonWithCors(request, { units: fallback });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: JSON.stringify({ sentence }) },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });
    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return jsonWithCors(request, { units: fallback });
    }
    const units = normalizeUnitTexts(JSON.parse(raw), sentence);
    return jsonWithCors(request, {
      units: units.length > 0 ? units : fallback,
    });
  } catch (error) {
    console.error("[expression-units]", error);
    return jsonWithCors(request, { units: fallback });
  }
}
