const CONFIRMING_OTHER_RE =
  /묻는\s*거(?:야|니|냐)|물어본\s*거(?:야|니|냐)|그\s*말이야|그거(?:야|지)\s*\?|라는\s*거지|맞(?:아|지)\s*요?\s*\?|are you asking|do you mean/i;

const META_ASKING_RE =
  /^(are you asking|do you mean|are you saying)\s+/i;

export type HowToSayExpression = {
  expression: string;
  example?: string;
  simpler?: string;
  moreNative?: string;
  analysis?: string;
};

function asLine(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function distinctFrom(base: string, candidate: unknown): string {
  const line = asLine(candidate);
  if (!line) return "";
  if (base.replace(/\s+/g, " ").trim().toLowerCase() === line.toLowerCase()) {
    return "";
  }
  return line;
}

/**
 * how_to_say sometimes returns a tutor clarification ("Are you asking...?")
 * instead of the English the learner would say. Unwrap that unless the user
 * was actually checking the other person's previous question.
 */
export function unwrapTutorHowToSay(wantToSay: string, expression: string): string {
  const line = expression.replace(/\s+/g, " ").trim();
  if (!line) return wantToSay;
  if (!META_ASKING_RE.test(line)) return line;
  if (CONFIRMING_OTHER_RE.test(wantToSay)) return line;

  const inner = line
    .replace(META_ASKING_RE, "")
    .replace(/\?+$/, "")
    .trim();
  if (!inner) return line;
  const capped = inner.charAt(0).toUpperCase() + inner.slice(1);
  return /^(what|who|when|where|why|how|which|whose|whom|if|whether)\b/i.test(
    capped,
  )
    ? `${capped}?`
    : capped;
}

export function normalizeHowToSayExpression(
  wantToSay: string,
  parsed: Partial<HowToSayExpression>,
): HowToSayExpression {
  const expression = unwrapTutorHowToSay(
    wantToSay,
    asLine(parsed.expression) || wantToSay,
  );
  const simpler = distinctFrom(expression, parsed.simpler);
  const moreNative = distinctFrom(
    simpler || expression,
    parsed.moreNative,
  );
  const analysis = asLine(parsed.analysis);
  return {
    expression,
    example: asLine(parsed.example),
    ...(simpler ? { simpler } : {}),
    ...(moreNative ? { moreNative } : {}),
    ...(analysis ? { analysis } : {}),
  };
}
