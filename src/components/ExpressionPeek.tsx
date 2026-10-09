"use client";

import { useState, useSyncExternalStore } from "react";
import { TTSButton } from "@/components/TTSButton";
import type { UICopy } from "@/lib/copy";
import type { HowToSayExpression } from "@/lib/howToSay";

/**
 * Under a line written in the learner's own language: how to say it in the
 * language being learned, opened when they want it.
 *
 * Chat and "how do I say this" used to be two modes picked with chips, and the
 * second wrote the expression and then the reply — two model calls before
 * anything came back. Now the line goes to the conversation like any other and
 * the reply arrives at chat speed; the expression waits here, one tap away,
 * like 해석 under the tutor's line. Opening it is not a chat and is not
 * counted as one.
 *
 * The first time this appears it says, once, what it is.
 */

const TIP_KEY = "chatOwnLanguageTipSeen";
const subscribe = () => () => {};

function readTipSeen(): boolean {
  try {
    return globalThis.localStorage?.getItem(TIP_KEY) === "1";
  } catch {
    return true;
  }
}

export function ExpressionPeek({
  ui,
  expression,
  onOpen,
  onUse,
}: {
  ui: UICopy;
  /** Already fetched for this line, if it was opened before. */
  expression?: HowToSayExpression;
  onOpen: () => Promise<void>;
  /** Put the expression in the input, to say it in the conversation. */
  onUse: (text: string) => void;
}) {
  const [open, setOpen] = useState(Boolean(expression));
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const tipSeen = useSyncExternalStore(subscribe, readTipSeen, () => true);
  const [tipDismissed, setTipDismissed] = useState(false);

  const show = async () => {
    setOpen(true);
    if (expression || loading) return;
    setLoading(true);
    setFailed(false);
    try {
      await onOpen();
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  const dismissTip = () => {
    try {
      globalThis.localStorage?.setItem(TIP_KEY, "1");
    } catch {
      // Shown again next time, which is harmless.
    }
    setTipDismissed(true);
  };

  return (
    <div className="mt-1.5 flex flex-col items-end gap-1.5">
      {!open ? (
        <button
          type="button"
          onClick={() => {
            dismissTip();
            void show();
          }}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-[13px] text-slate-200 hover:bg-white/10"
        >
          {ui.chatShowExpression}
        </button>
      ) : null}

      {!tipSeen && !tipDismissed && !open ? (
        <p className="max-w-[80%] rounded-lg bg-white/5 px-3 py-2 text-right text-[12px] leading-relaxed text-slate-400">
          {ui.chatOwnLanguageTip}
        </p>
      ) : null}

      {open ? (
        <div className="w-full max-w-[85%] rounded-xl border border-white/10 bg-[#121212] px-3 py-2.5">
          <p className="text-[11px] font-semibold tracking-wide text-slate-500">{ui.chatExpressionTitle}</p>
          {loading ? (
            <p className="mt-1 text-sm text-slate-400">{ui.chatExpressionLoading}</p>
          ) : failed || !expression ? (
            <p className="mt-1 text-sm text-rose-300">{ui.chatExpressionFailed}</p>
          ) : (
            <>
              <div className="mt-1 flex items-start gap-2">
                <p className="min-w-0 flex-1 text-[15px] font-medium leading-snug text-slate-100">
                  {expression.expression}
                </p>
                <TTSButton text={expression.expression} ariaLabel={ui.listen} />
              </div>
              {/* Older servers filled a missing example with this English line. */}
              {expression.example && expression.example !== "Please try again later." ? (
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">{expression.example}</p>
              ) : null}
              {expression.simpler || expression.moreNative ? (
                <ul className="mt-1.5 space-y-0.5 text-[13px] text-slate-300">
                  {expression.simpler ? <li>· {expression.simpler}</li> : null}
                  {expression.moreNative ? <li>· {expression.moreNative}</li> : null}
                </ul>
              ) : null}
              <button
                type="button"
                onClick={() => onUse(expression.expression)}
                className="mt-2 rounded-lg bg-[#e8e8e4] px-3 py-1.5 text-[13px] font-medium text-neutral-900 hover:bg-[#f5f5f3]"
              >
                {ui.chatUseExpression}
              </button>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
