import { TTSButton } from "@/components/TTSButton";
import type { VocabSense } from "@/lib/vocabulary";

export function VocabSenseList({
  senses,
  otherLabel,
  listenLabel,
}: {
  senses: VocabSense[];
  otherLabel: string;
  listenLabel?: string;
}) {
  if (senses.length === 0) return null;
  const [primary, ...rest] = senses;

  return (
    <div>
      <SenseRow sense={primary} listenLabel={listenLabel} />
      {rest.length > 0 ? (
        <div className="mt-3">
          <p className="text-[11px] font-semibold tracking-wide text-slate-500">
            {otherLabel}
          </p>
          <ul className="mt-1.5 space-y-2">
            {rest.map((sense) => (
              <li key={`${sense.partOfSpeech ?? ""}:${sense.gloss}`}>
                <SenseRow sense={sense} listenLabel={listenLabel} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function SenseRow({
  sense,
  listenLabel,
}: {
  sense: VocabSense;
  listenLabel?: string;
}) {
  return (
    <div>
      <p className="text-sm leading-relaxed text-slate-100">
        {sense.partOfSpeech ? (
          <span className="mr-2 text-[11px] uppercase tracking-wide text-slate-500">
            {sense.partOfSpeech}
          </span>
        ) : null}
        {sense.gloss}
      </p>
      {sense.example ? (
        <div className="mt-1 flex items-start gap-2">
          <p className="min-w-0 flex-1 text-xs leading-relaxed text-slate-500">
            {sense.example}
          </p>
          {listenLabel ? (
            <TTSButton text={sense.example} ariaLabel={listenLabel} />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
