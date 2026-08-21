"use client";

export function SentenceHitLayer({
  boxes,
  selectedText,
  onSelect,
}: {
  boxes: Array<{
    text: string;
    x: number;
    y: number;
    w: number;
    h: number;
  }>;
  selectedText?: string | null;
  onSelect: (box: {
    text: string;
    x: number;
    y: number;
    w: number;
    h: number;
  }) => void;
}) {
  return (
    <div className="absolute inset-0">
      {boxes.map((box, index) => {
        const selected = Boolean(selectedText) && selectedText === box.text;
        return (
          <button
            key={`${index}-${box.text.slice(0, 24)}`}
            type="button"
            aria-label={box.text}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onSelect(box);
            }}
            className={`absolute rounded-sm ${
              selected
                ? "bg-amber-300/40"
                : "bg-transparent hover:bg-amber-300/20"
            }`}
            style={{
              left: `${box.x * 100}%`,
              top: `${box.y * 100}%`,
              width: `${box.w * 100}%`,
              height: `${box.h * 100}%`,
            }}
          />
        );
      })}
    </div>
  );
}
