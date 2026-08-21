"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { TTSButton } from "@/components/TTSButton";
import type { Locale, UICopy } from "@/lib/copy";
import {
  getCharacterGuide,
  type CharacterItem,
} from "@/lib/characterGuide";
import { localizedText } from "@/lib/characterGuide/localize";
import {
  learningLanguageSpeechTag,
  learningLanguageTextDir,
  type LearningLanguageCode,
} from "@/lib/learningLanguages";

type CharacterGuidePanelProps = {
  targetLanguage: LearningLanguageCode;
  locale: Locale;
  ui: UICopy;
};

function toneLabel(tone: number | undefined, ui: UICopy): string | null {
  if (tone == null) return null;
  if (tone === 1) return ui.characterTone1;
  if (tone === 2) return ui.characterTone2;
  if (tone === 3) return ui.characterTone3;
  if (tone === 4) return ui.characterTone4;
  return ui.characterToneNeutral;
}

function categoryLabel(
  guide: NonNullable<ReturnType<typeof getCharacterGuide>>,
  categoryId: string,
  locale: string,
): string {
  const row = guide.categories.find((item) => item.id === categoryId);
  return localizedText(row?.label, locale) || categoryId;
}

export function CharacterGuidePanel({
  targetLanguage,
  locale,
  ui,
}: CharacterGuidePanelProps) {
  const guide = getCharacterGuide(targetLanguage);
  const [categoryId, setCategoryId] = useState(guide?.categories[0]?.id ?? "");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const speechLang = learningLanguageSpeechTag(targetLanguage);

  useEffect(() => {
    setCategoryId(guide?.categories[0]?.id ?? "");
    setSelectedId(null);
  }, [targetLanguage, guide]);

  const items = useMemo(() => {
    if (!guide) return [];
    return guide.items.filter((item) => item.category === categoryId);
  }, [guide, categoryId]);

  const selected: CharacterItem | null = useMemo(() => {
    if (!guide || !selectedId) return null;
    return guide.items.find((item) => item.id === selectedId) ?? null;
  }, [guide, selectedId]);

  useEffect(() => {
    if (!selected) return;
    detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selected]);

  if (!guide) return null;

  const dir = learningLanguageTextDir(targetLanguage);
  const notes = categoryId === guide.categories[0]?.id ? guide.notes : undefined;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm leading-relaxed text-slate-600">
        {ui.characterGuideHint}
      </p>

      {guide.categories.length > 1 ? (
        <div className="flex flex-wrap gap-1.5">
          {guide.categories.map((category) => {
            const active = category.id === categoryId;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  setCategoryId(category.id);
                  setSelectedId(null);
                }}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  active
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-600"
                }`}
              >
                {localizedText(category.label, locale)}
              </button>
            );
          })}
        </div>
      ) : null}

      {notes && notes.length > 0 ? (
        <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
          {notes.map((note) => (
            <div key={localizedText(note.title, locale)}>
              <p className="text-[11px] font-semibold tracking-wide text-slate-500">
                {localizedText(note.title, locale)}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-700">
                {localizedText(note.body, locale)}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <div
        dir={dir}
        className="grid grid-cols-5 gap-1.5 sm:grid-cols-6"
      >
        {items.map((item) => {
          const active = item.id === selectedId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                setSelectedId((current) =>
                  current === item.id ? null : item.id,
                )
              }
              className={`min-h-11 rounded-xl border px-1 py-2 text-lg font-semibold leading-none ${
                active
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
              }`}
            >
              {item.character}
            </button>
          );
        })}
      </div>

      {selected ? (
        <CharacterDetail
          item={selected}
          locale={locale}
          ui={ui}
          speechLang={speechLang}
          categoryLabel={categoryLabel(guide, selected.category, locale)}
          detailRef={detailRef}
        />
      ) : null}
    </div>
  );
}

function CharacterDetail({
  item,
  locale,
  ui,
  speechLang,
  categoryLabel,
  detailRef,
}: {
  item: CharacterItem;
  locale: string;
  ui: UICopy;
  speechLang: string;
  categoryLabel: string;
  detailRef: RefObject<HTMLDivElement | null>;
}) {
  const meaning = localizedText(item.meaning, locale);
  const usage = localizedText(item.usage, locale);
  const tone = toneLabel(item.tone, ui);
  const speak = item.speak || item.character;
  const forms = item.forms;

  return (
    <div
      ref={detailRef}
      className="rounded-2xl border border-slate-200 bg-white p-4"
    >
      <div className="flex flex-wrap items-center gap-2">
        <p
          className="text-3xl font-semibold leading-none text-slate-900"
          dir="auto"
        >
          {item.character}
        </p>
        <TTSButton text={speak} lang={speechLang} ariaLabel={ui.listen} />
      </div>

      <dl className="mt-3 space-y-2 text-sm">
        {item.reading || item.pronunciation ? (
          <div>
            <dt className="text-[11px] font-semibold tracking-wide text-slate-500">
              {ui.characterPronunciation}
            </dt>
            <dd className="mt-0.5 text-slate-800">
              {item.reading || item.pronunciation}
              {item.reading &&
              item.pronunciation &&
              item.reading !== item.pronunciation
                ? ` · ${item.pronunciation}`
                : ""}
            </dd>
          </div>
        ) : null}
        {tone ? (
          <div>
            <dt className="text-[11px] font-semibold tracking-wide text-slate-500">
              {ui.characterTone}
            </dt>
            <dd className="mt-0.5 text-slate-800">{tone}</dd>
          </div>
        ) : null}
        {categoryLabel ? (
          <div>
            <dt className="text-[11px] font-semibold tracking-wide text-slate-500">
              {ui.characterCategory}
            </dt>
            <dd className="mt-0.5 text-slate-800">{categoryLabel}</dd>
          </div>
        ) : null}
        {meaning ? (
          <div>
            <dt className="text-[11px] font-semibold tracking-wide text-slate-500">
              {ui.characterMeaning}
            </dt>
            <dd className="mt-0.5 text-slate-800">{meaning}</dd>
          </div>
        ) : null}
        {usage ? (
          <div>
            <dt className="text-[11px] font-semibold tracking-wide text-slate-500">
              {ui.characterUsage}
            </dt>
            <dd className="mt-0.5 text-slate-800">{usage}</dd>
          </div>
        ) : null}
        {forms && (forms.initial || forms.medial || forms.final) ? (
          <div>
            <dt className="text-[11px] font-semibold tracking-wide text-slate-500">
              {ui.characterForms}
            </dt>
            <dd className="mt-1 flex flex-wrap gap-2 text-slate-800" dir="rtl">
              {forms.isolated ? (
                <span className="rounded-lg bg-slate-50 px-2 py-1">
                  {ui.characterFormIsolated} {forms.isolated}
                </span>
              ) : null}
              {forms.initial ? (
                <span className="rounded-lg bg-slate-50 px-2 py-1">
                  {ui.characterFormInitial} {forms.initial}
                </span>
              ) : null}
              {forms.medial ? (
                <span className="rounded-lg bg-slate-50 px-2 py-1">
                  {ui.characterFormMedial} {forms.medial}
                </span>
              ) : null}
              {forms.final ? (
                <span className="rounded-lg bg-slate-50 px-2 py-1">
                  {ui.characterFormFinal} {forms.final}
                </span>
              ) : null}
            </dd>
          </div>
        ) : null}
      </dl>

      {item.examples && item.examples.length > 0 ? (
        <div className="mt-4">
          <p className="text-[11px] font-semibold tracking-wide text-slate-500">
            {ui.characterExamples}
          </p>
          <ul className="mt-2 space-y-2">
            {item.examples.map((example) => (
              <li
                key={`${example.text}-${example.reading ?? ""}`}
                className="flex items-start justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900" dir="auto">
                    {example.text}
                    {example.reading ? (
                      <span className="ml-2 text-xs font-normal text-slate-500">
                        {example.reading}
                      </span>
                    ) : null}
                  </p>
                  {localizedText(example.meaning, locale) ? (
                    <p className="mt-0.5 text-xs text-slate-600">
                      {localizedText(example.meaning, locale)}
                    </p>
                  ) : null}
                </div>
                <TTSButton
                  text={example.speak || example.text}
                  lang={speechLang}
                  ariaLabel={ui.listen}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
