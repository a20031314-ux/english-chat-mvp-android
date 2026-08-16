import { newStudyId } from "@/lib/studyMaterials/ids";
import type {
  ReadingProgress,
  StudyAnnotation,
  StudyDocument,
} from "@/lib/studyMaterials/types";

const DB_NAME = "talkbank-study-materials";
const DB_VERSION = 1;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("documents")) {
        db.createObjectStore("documents", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("annotations")) {
        const store = db.createObjectStore("annotations", { keyPath: "id" });
        store.createIndex("documentId", "documentId", { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function req<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function listStudyDocuments(): Promise<StudyDocument[]> {
  const db = await openDb();
  const rows = await req(
    db.transaction("documents").objectStore("documents").getAll(),
  );
  db.close();
  return (Array.isArray(rows) ? rows : [])
    .filter((row): row is StudyDocument => Boolean(row && row.id))
    .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
}

export async function getStudyDocument(
  id: string,
): Promise<StudyDocument | null> {
  const db = await openDb();
  const row = await req(
    db.transaction("documents").objectStore("documents").get(id),
  );
  db.close();
  return row && typeof row === "object" ? (row as StudyDocument) : null;
}

export async function saveStudyDocument(document: StudyDocument): Promise<void> {
  const db = await openDb();
  await req(db.transaction("documents", "readwrite").objectStore("documents").put(document));
  db.close();
}

export async function deleteStudyDocument(id: string): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(["documents", "annotations"], "readwrite");
  tx.objectStore("documents").delete(id);
  const index = tx.objectStore("annotations").index("documentId");
  const annotations = await req(index.getAll(id));
  for (const row of annotations as StudyAnnotation[]) {
    tx.objectStore("annotations").delete(row.id);
  }
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function updateStudyProgress(
  documentId: string,
  patch: Partial<ReadingProgress>,
): Promise<StudyDocument | null> {
  const document = await getStudyDocument(documentId);
  if (!document) return null;
  document.progress = {
    ...document.progress,
    ...patch,
    documentId,
    updatedAt: new Date().toISOString(),
  };
  await saveStudyDocument(document);
  return document;
}

export async function addStudyAnnotation(
  input: Omit<StudyAnnotation, "id" | "createdAt">,
): Promise<StudyAnnotation> {
  const existing = await listStudyAnnotations(input.documentId);
  const duplicate = existing.find(
    (row) =>
      row.sentenceId === input.sentenceId &&
      row.kind === input.kind &&
      row.selectedText === input.selectedText,
  );
  if (duplicate) return duplicate;

  const annotation: StudyAnnotation = {
    ...input,
    id: newStudyId("ann"),
    createdAt: new Date().toISOString(),
  };
  const db = await openDb();
  const tx = db.transaction(["annotations", "documents"], "readwrite");
  tx.objectStore("annotations").put(annotation);
  const document = (await req(
    tx.objectStore("documents").get(input.documentId),
  )) as StudyDocument | undefined;
  if (document) {
    if (input.kind === "sentence") {
      document.stats.analyzedSentences += 1;
    } else {
      document.stats.savedExpressions += 1;
    }
    tx.objectStore("documents").put(document);
  }
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  return annotation;
}

export async function listStudyAnnotations(
  documentId: string,
): Promise<StudyAnnotation[]> {
  const db = await openDb();
  const rows = await req(
    db
      .transaction("annotations")
      .objectStore("annotations")
      .index("documentId")
      .getAll(documentId),
  );
  db.close();
  return Array.isArray(rows) ? (rows as StudyAnnotation[]) : [];
}
