import { NextRequest, after } from "next/server";
import { readLedger } from "@/lib/server/ledgerStore";
import { getOpenAIClient } from "@/lib/server/openai";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestUserId } from "@/lib/server/premiumRequest";
import { isIdentified } from "@/lib/server/identity";
import { meterRequest } from "@/lib/server/meterRequest";
import { currentStageOrder, deleteShots, locatePart, placeLearnedPhrases, readNotebook, readShot, saveNotebook, saveShot } from "@/lib/server/notebookStore";
import { isLedgerTab } from "@/lib/learner/ledger";
import { localDay, parseOffset, TZ_OFFSET_HEADER } from "@/lib/billing/plans";
import { scriptView, stageViews } from "@/lib/server/stageCopy";
import { applyEdit, parseEdit, prunePending, skeletonFor, type SkeletonNode } from "@/lib/notes/notebook";
import { INTERFACE_LANGUAGE_LABELS, coerceLanguageCode } from "@/lib/learningLanguages";
import { ladderFor } from "@/lib/curriculum/stages";
import { partHistory, recentMistakes, stageParts, vocabScore, vocabWords } from "@/lib/notes/stageParts";
import { readGrowthRecord } from "@/lib/server/growthStore";
import { readLearnerProfile } from "@/lib/server/learnerProfileStore";
import { statusOf } from "@/lib/learner/profile";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * 노트의 뼈대와 짚은 장면 카드(notes/notebook.ts, 저장 server/notebookStore.ts).
 *
 * GET ?lang=<학습 언어>&ui=<앱 언어>
 *   { stage, nodes: [{ id, chapter, stage?, name, example?, note?, ahead? }], custom, renames, memos, cards }
 *   ahead = 지금 단계 뒤의 문법(앱은 카드가 든 칸만 보인다).
 *   칸 이름은 앱 언어(영어·한국어는 손으로 쓴 글, 다른 언어는 단계 글과 같은 옮긴 글 — server/stageCopy.ts).
 *   + pending(오늘의 학습 후보, 7일), today(사용자 시간대의 오늘), stages(단계 사다리 [{ order, title }]),
 *   phrases(습득한 표현이 든 칸 [{ key, text, state, node }] — 칸 없는 것은 이 요청 뒤 모델이 고른다).
 *   + parts(단계마다 어휘·문법·표현·발음 [{ order, parts, ready, weakest, expressions }], notes/stageParts.ts),
 *     words(어휘 갈래 목록), pronunciationNotes({ [단계]: 앱 언어 한 줄 }), partDays(지금 단계 갈래별 최근 14일) — 2026-10-25 My 네 갈래.
 * GET ?lang=&shot=<화면 id> → { image } — 카드에 붙인 화면.
 * POST { language, edit } — 카드 옮기기·메모·지우기, 칸 더하기·이름 바꾸기·지우기·메모, 제안 칸 받기,
 *   후보 넣기(commit: ids, shots)·버리기(dismiss) → { ok, cards, custom, renames, memos, pending }
 * POST { language, locate: { text, sentence, ui, tab } } — 문장분석 시트 "My에서 찾기" → { node, stage?, note }
 * POST { language, shot: { id, image } } — 노트에 넣은 카드의 화면(기기에서 찍은 JPEG, 20만 바이트까지) → { ok }
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

type NodeView = { id: string; chapter: SkeletonNode["chapter"]; stage?: number; index?: number; name: string; example?: string; note?: string; ahead?: boolean };

export async function GET(request: NextRequest) {
  const userId = requestUserId(request);
  if (!isIdentified(userId)) return jsonWithCors(request, { error: "IDENTITY_REQUIRED" }, { status: 401 });
  const language = coerceLanguageCode(request.nextUrl.searchParams.get("lang"));
  const shotId = request.nextUrl.searchParams.get("shot");
  if (shotId) {
    const image = await readShot(userId, language, shotId);
    return image ? jsonWithCors(request, { image }) : jsonWithCors(request, { error: "NOT_FOUND" }, { status: 404 });
  }
  const uiParam = request.nextUrl.searchParams.get("ui") ?? "ko";
  const ui = INTERFACE_LANGUAGE_LABELS[uiParam] ? uiParam : "ko";
  const uiName = INTERFACE_LANGUAGE_LABELS[ui] ?? "Korean";
  const onTranslate = () => void meterRequest(request, "stageCopy");

  const [stage, record, ledger] = await Promise.all([
    currentStageOrder(userId, language),
    readNotebook(userId, language),
    readLedger(userId, language).catch(() => null),
  ]);
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
        // 단계 자료(curriculum/stages)의 몇 번째 문법인지 — My "단계" 보기가 숙지(✓)·해보기를 이 칸에 붙인다.
        index: node.index,
        name: view?.name || english(node.name),
        ...(node.example ? { example: node.example } : {}),
        ...(node.ahead ? { ahead: true } : {}),
      };
    }
    // 관용·세부 고정 칸: 이름은 앱이 자기 문구로(copy.ts notebookNode*), 여기는 영어·한국어 기본만.
    if (node.chapter === "idiom" || node.chapter === "detail") return { id: node.id, chapter: node.chapter, name: english(node.name) };
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
  // 습득한 표현(장부 배움·숙지) 중 칸이 정해진 것 — 지금 상태와 함께. 칸이 없는 것은 답이 나간 뒤 모델이 고른다(다음에 열면 보임).
  const items = Object.entries(ledger?.items ?? {});
  const phrases = items.flatMap(([key, item]) => {
    const place = record.phrases[key];
    // 만남(met)은 "My에서 찾기"로 칸이 정해진 것만 — 칸에 옅은 점으로.
    return place?.node ? [{ key, text: item.text, state: item.state, node: place.node }] : [];
  });
  if (ledger && items.some(([key, item]) => item.state !== "met" && !record.phrases[key])) {
    after(() =>
      placeLearnedPhrases({
        openai: getOpenAIClient(),
        userId,
        language,
        items: items.map(([, item]) => item),
        meter: (op) => void meterRequest(request, op),
      }),
    );
  }
  // 수준별 틀: 단계 사다리(번호·이름, 앱 언어). 화면이 지금 단계를 가운데 두고 앞뒤 단계를 넘겨 본다.
  const ladder = stages?.map((s) => ({ order: s.order, title: s.title })) ?? [];
  // 네 갈래(어휘·문법·표현·발음)와 다음 단계 조건 — 단계마다(사다리에서 넘겨 봐도 그 단계 것).
  const source = ladderFor(language);
  let parts: ReturnType<typeof stageParts>[] = [];
  let partDays: ReturnType<typeof partHistory> | null = null;
  if (source && stages) {
    const constructionIds = source.stages.flatMap((s) => s.grammar.map((g) => g.constructionId)).filter((id): id is string => Boolean(id));
    const [growth, profile] = await Promise.all([
      readGrowthRecord(userId, language).catch(() => null),
      constructionIds.length ? readLearnerProfile(userId, language).catch(() => null) : Promise.resolve(null),
    ]);
    const mastered = new Set(profile ? constructionIds.filter((id) => statusOf(profile.entries[id]) === "mastered") : []);
    const pronunciation = { points: growth?.counts.pronunciation ?? 0, tries: growth?.tries?.pronunciation ?? 0 };
    const vocab = vocabScore(ledger, language);
    // 요소 태그: 튜터가 최근 2주에 짚은 갈래(노트 카드 + 오늘의 학습 후보) — "다음 단계까지"를 자주 짚이는 갈래로.
    const mistakes = recentMistakes([...record.cards, ...record.pending], Date.now());
    parts = source.stages.map((s) => stageParts({ stage: s, language, ledger, phrases: record.phrases, constructionsMastered: mastered, pronunciation, vocab, mistakes }));
    // 그래프 보기: 지금 단계 네 갈래의 최근 14일(사용자 시간대).
    const here = source.stages.find((s) => s.order === stage) ?? source.stages[0];
    const offset = parseOffset(request.headers.get(TZ_OFFSET_HEADER));
    if (here) {
      partDays = partHistory({
        stage: here,
        language,
        ledger,
        phrases: record.phrases,
        pronunciationDays: growth?.days.pronunciation ?? {},
        now: Date.now(),
        dayOf: (at) => localDay(at, offset),
      });
    }
  }
  const pronunciationNotes = Object.fromEntries((stages ?? []).map((s) => [s.order, s.pronunciation ?? ""]));
  return jsonWithCors(request, {
    language,
    stage,
    stages: ladder,
    nodes,
    phrases,
    parts,
    partDays,
    words: vocabWords(ledger, language),
    pronunciationNotes,
    // 칸을 고른 표현 수(어휘로 둔 것 포함) — 점검이 "아직"과 "어휘로 둠"을 가른다.
    filed: Object.keys(record.phrases).length,
    custom: record.custom,
    renames: record.renames,
    memos: record.memos,
    cards: record.cards,
    pending: prunePending(record).pending,
    today: localDay(Date.now(), parseOffset(request.headers.get(TZ_OFFSET_HEADER))),
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
  const shot = body.shot as { id?: unknown; image?: unknown } | undefined;
  if (shot && typeof shot === "object") {
    const ok = typeof shot.id === "string" && (await saveShot(userId, language, shot.id, String(shot.image ?? "")));
    return jsonWithCors(request, { ok }, { status: ok ? 200 : 400 });
  }
  // 문장분석 시트 "My에서 찾기": 궁금한 부분이 틀의 어느 칸인지 + 한 줄 설명.
  const locate = body.locate as { text?: unknown; sentence?: unknown; ui?: unknown; tab?: unknown } | undefined;
  if (locate && typeof locate === "object") {
    const text = typeof locate.text === "string" ? locate.text.replace(/\s+/g, " ").trim().slice(0, 120) : "";
    if (!text) return jsonWithCors(request, { error: "NO_TEXT" }, { status: 400 });
    const ui = typeof locate.ui === "string" && INTERFACE_LANGUAGE_LABELS[locate.ui] ? locate.ui : "en";
    const found = await locatePart({
      openai: getOpenAIClient(),
      userId,
      language,
      ui,
      text,
      sentence: typeof locate.sentence === "string" ? locate.sentence.slice(0, 300) : "",
      tab: isLedgerTab(locate.tab) ? locate.tab : "chat",
      meter: (op) => void meterRequest(request, op),
    }).catch(() => null);
    return found ? jsonWithCors(request, found) : jsonWithCors(request, { error: "FAILED" }, { status: 502 });
  }
  const edit = parseEdit(body.edit);
  if (!edit) return jsonWithCors(request, { error: "BAD_EDIT" }, { status: 400 });
  const before = prunePending(await readNotebook(userId, language));
  const after = applyEdit(before, edit);
  if (after !== before) await saveNotebook(userId, language, after);
  // 지운 카드의 화면도 지운다.
  if (edit.op === "deleteCard") {
    const gone = before.cards.find((card) => card.id === edit.card)?.shotId;
    if (gone) await deleteShots(userId, language, [gone]);
  }
  return jsonWithCors(request, {
    ok: after !== before,
    cards: after.cards,
    custom: after.custom,
    renames: after.renames,
    memos: after.memos,
    pending: after.pending,
  });
}
