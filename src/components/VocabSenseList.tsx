import type { VocabSense } from "@/lib/vocabulary";

export function VocabSenseList({
  senses,
  otherLabel,
}: {
  senses: VocabSense[];
  otherLabel: string;
}) {
  if (senses.length === 0) return null;
  const [primary, ...rest] = senses;

  return (
    <div>
      <p className="text-sm leading-relaxed text-slate-800">
        {primary.partOfSpeech ? (
          <span className="mr-2 text-[11px] uppercase tracking-wide text-slate-500">
            {primary.partOfSpeech}
          </span>
        ) : null}
        {primary.gloss}
      </p>
      {rest.length > 0 ? (
        <div className="mt-3">
          <p className="text-[11px] font-semibold tracking-wide text-slate-500">
            {otherLabel}
          </p>
          <ul className="mt-1.5 space-y-1">
            {rest.map((sense) => (
              <li
                key={`${sense.partOfSpeech ?? ""}:${sense.gloss}`}
                className="text-sm leading-relaxed text-slate-700"
              >
                {sense.partOfSpeech ? (
                  <span className="mr-2 text-[11px] uppercase tracking-wide text-slate-400">
                    {sense.partOfSpeech}
                  </span>
                ) : null}
                {sense.gloss}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
