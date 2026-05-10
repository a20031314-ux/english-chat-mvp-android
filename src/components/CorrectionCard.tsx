import { TTSButton } from "./TTSButton";
import { ReactNode } from "react";

type CorrectionCardProps = {
  original: string;
  highlighted: string;
  corrected: string;
  natural: string;
  explanation: string;
  hasError: boolean;
  feedback: string;
  labels: {
    title: string;
    highlighted: string;
    corrected: string;
    natural: string;
    explanation: string;
    listen: string;
    noCorrectionNeeded: string;
  };
  onRetry: (text: string) => void;
  actions?: ReactNode;
};

export function CorrectionCard({
  original,
  highlighted,
  corrected,
  natural,
  explanation,
  hasError,
  feedback,
  labels,
  onRetry,
  actions,
}: CorrectionCardProps) {
  const showNatural = hasError && natural.trim() !== corrected.trim();

  return (
    <div className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-950 shadow-sm">
      <p className="mb-2 text-sm font-semibold text-emerald-800">📚 학습 카드</p>
      <p className="text-xs text-emerald-800/90">{feedback}</p>

      <div className="mt-3 space-y-3">
        <div>
          <p className="text-xs font-semibold text-emerald-800">내 표현:</p>
          <p className="mt-1 text-sm text-emerald-950" translate="no">
            {original}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-emerald-800">추천 표현:</p>
          <div className="mt-1 rounded-lg border border-emerald-200 bg-white/70 p-2.5">
            <p className="text-base font-semibold text-emerald-950" translate="no">
              {corrected}
            </p>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <TTSButton text={corrected} ariaLabel={labels.listen} />
            <button
              type="button"
              onClick={() => onRetry(corrected)}
              className="rounded-md border border-emerald-300 bg-white px-2 py-1 text-xs text-emerald-800 transition hover:bg-emerald-100"
            >
              🔁 다시 써보기
            </button>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-emerald-800">설명:</p>
          {hasError ? (
            <p className="mt-1 text-sm text-emerald-900/90">{explanation}</p>
          ) : (
            <p className="mt-1 text-sm text-emerald-900/90">{labels.noCorrectionNeeded}</p>
          )}
          {hasError && (
            <p className="mt-1 text-xs text-emerald-800/90" translate="no">
              {labels.highlighted}: {highlighted}
              {showNatural ? ` · ${labels.natural}: ${natural}` : ""}
            </p>
          )}
        </div>
      </div>

      {actions && <div className="mt-3">{actions}</div>}
    </div>
  );
}
