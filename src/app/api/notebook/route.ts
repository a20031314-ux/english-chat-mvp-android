import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestUserId } from "@/lib/server/premiumRequest";
import { isIdentified } from "@/lib/server/identity";
import { meterRequest } from "@/lib/server/meterRequest";
import { currentStageOrder, readNotebook, saveNotebook } from "@/lib/server/notebookStore";
import { scriptView, stageViews } from "@/lib/server/stageCopy";
import { applyEdit, parseEdit, skeletonFor, type SkeletonNode } from "@/lib/notes/notebook";
import { INTERFACE_LANGUAGE_LABELS, coerceLanguageCode } from "@/lib/learningLanguages";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * 노트의 뼈대와 짚은 장면 카드(notes/notebook.ts, 저장 server/notebookStore.ts).
 *
 * GET ?lang=<학습 언어>&ui=<앱 언어>
 *   { stage, nodes: [{ id, chapter, stage?, name, example?, note?, ahead? }], custom, renames, memos, cards }
 *   ahead = 지금 단계 뒤의 문법(앱은 카드가 든 칸만 보인다).
 *   칸 이름은 앱 언어(영어·한국어는 손으로 쓴 글, 다른 언어는 단계 글과 같은 옮긴 글 — server/stageCopy.ts).
 * POST { language, edit } — 카드 옮기기·메모·지우기, 칸 더하기·이름 바꾸기·지우기·메모, 제안 칸 받기 → { ok, cards, custom, renames, memos }
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

type NodeView = { id: string; chapter: SkeletonNode["chapter"]; stage?: number; name: string; example?: string; note?: string; ahead?: boolean };

export async function GET(request: NextRequest) {
  const userId = requestUserId(request);
  if (!isIdentified(userId)) return jsonWithCors(request, { error: "IDENTITY_REQUIRED" }, { status: 401 });
  const language = coerceLanguageCode(request.nextUrl.searchParams.get("lang"));
  const uiParam = request.nextUrl.searchParams.get("ui") ?? "ko";
  const ui = INTERFACE_LANGUAGE_LABELS[uiParam] ? uiParam : "ko";
  const uiName = INTERFACE_LANGUAGE_LABELS[ui] ?? "Korean";
  const onTranslate = () => void meterRequest(request, "stageCopy");

  const [stage, record] = await Promise.all([currentStageOrder(userId, language), readNotebook(userId, language)]);
  const skeleton = skeletonFor(language, stage, true);
  const [stages, script] = await Promise.all([
    skeleton.some((node) => node.chapter === "grammar") ? stageViews(language, ui, uiName, onTranslate) : Promise.resolve(null),
    skeleton.some((node) => node.chapter === "script") ? scriptView(language, ui, uiName, onTranslate) : Promise.resolve(null),
  ]);
  const english = (text: { en: string; ko?: string }) => (ui === "ko" ? text.ko : undefined) ?? text.en;
  const nodes: NodeView[] = skeleton.map((node) => {
    if (node.chapter === "grammar") {
      const view = stages?.find((s) => s.order === node.stage)?.grammar[node.index];
      return {
        id: node.id,
        chapter: node.chapter,
        stage: node.stage,
        name: view?.name || english(node.name),
        ...(node.example ? { example: node.example } : {}),
        ...(node.ahead ? { ahead: true } : {}),
      };
    }
    const group = script?.groups[node.index];
    const note = group?.note ?? (node.note ? english(node.note) : undefined);
    return {
      id: node.id,
      chapter: node.chapter,
      name: group?.title || english(node.name),
      ...(node.example ? { example: node.example } : {}),
      ...(note ? { note } : {}),
    };
  });
  return jsonWithCors(request, {
    language,
    stage,
    nodes,
    custom: record.custom,
    renames: record.renames,
    memos: record.memos,
    cards: record.cards,
  });
}

export async function POST(request: NextRequest) {
  const userId = requestUserId(request);
  if (!isIdentified(userId)) return jsonWithCors(request, { error: "IDENTITY_REQUIRED" }, { status: 401 });
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }
  const language = coerceLanguageCode(body.language);
  const edit = parseEdit(body.edit);
  if (!edit) return jsonWithCors(request, { error: "BAD_EDIT" }, { status: 400 });
  const before = await readNotebook(userId, language);
  const after = applyEdit(before, edit);
  if (after !== before) await saveNotebook(userId, language, after);
  return jsonWithCors(request, { ok: after !== before, cards: after.cards, custom: after.custom, renames: after.renames, memos: after.memos });
}
