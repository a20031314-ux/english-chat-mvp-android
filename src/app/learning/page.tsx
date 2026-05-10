"use client";

import { useEffect, useState } from "react";

type LearningCard = {
  id: number;
  original: string;
  corrected: string;
  explanation: string;
};

const LEARNING_CARDS_KEY = "learningCards";

export default function LearningPage() {
  const [cards, setCards] = useState<LearningCard[]>([]);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem(LEARNING_CARDS_KEY) || "[]");
      setCards(Array.isArray(data) ? data : []);
    } catch {
      setCards([]);
    }
  }, []);

  const handleDelete = (id: number) => {
    setCards((previous) => {
      const updated = previous.filter((card) => card.id !== id);
      localStorage.setItem(LEARNING_CARDS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl bg-slate-50 p-4">
      <h1 className="mb-4 text-lg font-semibold text-slate-900">학습자료실</h1>

      <div className="space-y-3">
        {cards.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
            저장된 학습 카드가 없습니다.
          </p>
        ) : (
          cards.map((card) => (
            <article key={card.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="space-y-2 text-sm text-slate-800">
                <p>
                  <span className="font-semibold">Original:</span> {card.original}
                </p>
                <p>
                  <span className="font-semibold">Corrected:</span> {card.corrected}
                </p>
                <p>
                  <span className="font-semibold">Explanation:</span> {card.explanation}
                </p>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleDelete(card.id)}
                  className="rounded-md border border-rose-300 bg-white px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50"
                >
                  삭제
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
