import { ReactNode } from "react";
import { SelectableEnglishText } from "./SelectableEnglishText";
import { TTSButton } from "./TTSButton";

type HowToSayCardProps = {
  expression: string;
  pickMode?: boolean;
  isWordSaved?: (word: string) => boolean;
  savingWord?: string | null;
  onWordClick?: (word: string) => void;
  labels: {
    title: string;
    listen: string;
  };
  actions?: ReactNode;
};

export function HowToSayCard({
  expression,
  pickMode = false,
  isWordSaved,
  savingWord = null,
  onWordClick,
  labels,
  actions,
}: HowToSayCardProps) {
  return (
    <div className="mt-2 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-950 shadow-sm">
      <p className="mb-1 text-xs font-semibold tracking-wide text-blue-700">
        {labels.title}
      </p>
      <p className="text-base font-medium" translate="no">
        <SelectableEnglishText
          text={expression}
          pickMode={pickMode}
          tone="onBlue"
          isWordSaved={isWordSaved}
          savingWord={savingWord}
          onWordClick={onWordClick}
        />
      </p>
      <div className="mt-2 flex items-center gap-2">
        <TTSButton text={expression} ariaLabel={labels.listen} />
      </div>
      {actions ? <div className="mt-3">{actions}</div> : null}
    </div>
  );
}
