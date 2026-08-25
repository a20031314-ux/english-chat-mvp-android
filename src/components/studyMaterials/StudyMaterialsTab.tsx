"use client";

import { useCallback, useEffect, useState } from "react";
import { StudyLibrary } from "@/components/studyMaterials/StudyLibrary";
import { StudyReader } from "@/components/studyMaterials/StudyReader";
import { StudyUpload } from "@/components/studyMaterials/StudyUpload";
import type { Locale, UICopy } from "@/lib/copy";
import {
  deleteStudyDocument,
  listStudyDocuments,
} from "@/lib/studyMaterials/storage";
import type { StudyDocument } from "@/lib/studyMaterials/types";

type View = "library" | "upload" | "reader";

export function StudyMaterialsTab({
  locale,
  ui,
}: {
  locale: Locale;
  ui: UICopy;
}) {
  const [view, setView] = useState<View>("library");
  const [documents, setDocuments] = useState<StudyDocument[]>([]);
  const [active, setActive] = useState<StudyDocument | null>(null);

  const reload = useCallback(async () => {
    try {
      setDocuments(await listStudyDocuments());
    } catch {
      setDocuments([]);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  if (view === "upload") {
    return (
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl tb-panel">
        <StudyUpload
          ui={ui}
          onCancel={() => setView("library")}
          onImported={(document) => {
            setActive(document);
            setView("reader");
            void reload();
          }}
        />
      </div>
    );
  }

    if (view === "reader" && active) {
    return (
      <div className="fixed inset-0 z-[80] flex flex-col bg-[#000000]">
        <StudyReader
          document={active}
          locale={locale}
          ui={ui}
          onBack={() => {
            setView("library");
            setActive(null);
            void reload();
          }}
          onDocumentChange={setActive}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl tb-panel">
      <StudyLibrary
        documents={documents}
        ui={ui}
        onAdd={() => setView("upload")}
        onOpen={(document) => {
          setActive(document);
          setView("reader");
        }}
        onDelete={(id) => {
          void deleteStudyDocument(id).then(reload);
        }}
      />
    </div>
  );
}
