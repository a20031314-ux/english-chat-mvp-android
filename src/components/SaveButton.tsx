type SaveButtonProps = {
  isSaved: boolean;
  saveLabel: string;
  savedLabel: string;
  onSave: () => void;
};

export function SaveButton({
  isSaved,
  saveLabel,
  savedLabel,
  onSave,
}: SaveButtonProps) {
  return (
    <button
      type="button"
      onClick={onSave}
      disabled={isSaved}
      className="rounded-md border border-white/15 bg-[#121212] px-2 py-1 text-xs text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isSaved ? savedLabel : saveLabel}
    </button>
  );
}
