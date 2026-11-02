/**
 * 고르기 문제 보기마다 뜻·틀린 까닭(2026-11-03 사용자 "정답·오답이 각각 무슨 뜻인지, 오답은 왜 오답인지") — 답한 뒤에 한 번 묻는다.
 * 서버(/api/curriculum/option-notes)가 문제마다 한 번 만들어 모두가 같이 쓰고, 이 폰도 받은 것을 잠깐 들고 있는다(같은 문제를 다시 볼 때).
 */
import { useEffect, useState } from "react";
import { apiUrl } from "../apiBase.ts";

export type OptionNote = { meaning: string; why: string };
/** mine: 학습자 자신의 줄로 만든 문제 — 서버가 답만 주고 저장하지 않는다. */
export type OptionNotesAsk = { sentence: string; options: readonly string[]; answer: number; mine?: boolean };

const memory = new Map<string, OptionNote[]>();

export function optionNotesKey(language: string, ui: string, ask: OptionNotesAsk): string {
  return JSON.stringify([language, ui, ask.sentence, ask.options, ask.answer]);
}

/** ask가 있을 때(답한 뒤)만 묻는다. 못 받으면 빈 배열 — 화면은 보기만 그대로. */
export function useOptionNotes(ask: OptionNotesAsk | null, language: string, ui: string): OptionNote[] {
  const key = ask ? optionNotesKey(language, ui, ask) : "";
  const [got, setGot] = useState<{ key: string; notes: OptionNote[] }>({ key: "", notes: [] });
  useEffect(() => {
    if (!ask || !key || memory.has(key)) return;
    let alive = true;
    void fetch(apiUrl("/api/curriculum/option-notes"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, ui, sentence: ask.sentence, options: ask.options, answer: ask.answer, ...(ask.mine ? { mine: true } : {}) }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .catch(() => null)
      .then((body: { notes?: OptionNote[] } | null) => {
        const notes = Array.isArray(body?.notes) && body.notes.length === ask.options.length ? body.notes : [];
        if (notes.length) memory.set(key, notes);
        if (alive) setGot({ key, notes });
      });
    return () => {
      alive = false;
    };
    // ask는 key에 다 들어 있다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, language, ui]);
  if (!key) return [];
  return memory.get(key) ?? (got.key === key ? got.notes : []);
}
