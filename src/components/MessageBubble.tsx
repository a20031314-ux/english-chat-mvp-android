import { TTSButton } from "./TTSButton";
import { SelectableEnglishText } from "./SelectableEnglishText";

type MessageBubbleProps = {
  role: "user" | "assistant";
  message: string;
  /** English line attached under a how-to-say user message */
  attachedEnglish?: string;
  translatedMessage?: string;
  isTranslating?: boolean;
  pickMode?: boolean;
  isWordSaved?: (word: string) => boolean;
  savingWord?: string | null;
  onWordClick?: (word: string) => void;
  labels: {
    listen: string;
    translate?: string;
    translating?: string;
    translation?: string;
  };
  onTranslate?: () => void;
};

export function MessageBubble({
  role,
  message,
  attachedEnglish,
  translatedMessage,
  isTranslating = false,
  pickMode = false,
  isWordSaved,
  savingWord = null,
  onWordClick,
  labels,
  onTranslate,
}: MessageBubbleProps) {
  const isUser = role === "user";
  const canTranslate = Boolean(onTranslate && labels.translate);
  const listenText = attachedEnglish?.trim() || message;

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm sm:max-w-[75%] ${
          isUser
            ? "rounded-br-sm bg-slate-900 text-white"
            : "rounded-bl-sm bg-white text-slate-900"
        }`}
      >
        <p>
          <SelectableEnglishText
            text={message}
            pickMode={pickMode}
            tone={isUser ? "onDark" : "default"}
            isWordSaved={isWordSaved}
            savingWord={savingWord}
            onWordClick={onWordClick}
          />
        </p>

        {attachedEnglish?.trim() ? (
          <p
            className={`mt-2 border-t pt-2 text-sm leading-relaxed ${
              isUser ? "border-slate-600 text-slate-100" : "border-slate-200"
            }`}
            translate="no"
          >
            <SelectableEnglishText
              text={attachedEnglish}
              pickMode={pickMode}
              tone={isUser ? "onDark" : "default"}
              isWordSaved={isWordSaved}
              savingWord={savingWord}
              onWordClick={onWordClick}
            />
          </p>
        ) : null}

        {translatedMessage ? (
          <div
            className={`mt-2 border-t pt-2 text-xs leading-relaxed ${
              isUser ? "border-slate-600 text-slate-200" : "border-slate-200 text-slate-600"
            }`}
          >
            {labels.translation ? (
              <p className="mb-0.5 font-medium opacity-80">{labels.translation}</p>
            ) : null}
            <p className="whitespace-pre-wrap">{translatedMessage}</p>
          </div>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {isUser ? (
            <TTSButton
              text={listenText}
              ariaLabel={labels.listen}
              className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
            />
          ) : (
            <TTSButton text={message} ariaLabel={labels.listen} />
          )}

          {canTranslate ? (
            <button
              type="button"
              disabled={isTranslating}
              onClick={onTranslate}
              className={`rounded-md border px-2 py-1 text-xs transition disabled:cursor-default disabled:opacity-60 ${
                isUser
                  ? "border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {isTranslating
                ? labels.translating || labels.translate
                : labels.translate}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
