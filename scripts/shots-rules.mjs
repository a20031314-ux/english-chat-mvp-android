/**
 * 스크린샷 모음(hub/SHOTS.md)의 규칙: 칸마다 어떤 그림을 쓰고, 어떤 그림을 정리할지.
 * 순수 함수만 — 입력은 모음 DB에서 내려받은 행, 출력은 할 일 목록. 실제 쓰기·지우기는 Claude가 한다.
 *
 * 고르기(사용자 결정 2026-10-20): 사용자가 고른 그림 > 사용법 캡처(지도 스크립트가 먼저 씀) > 모음에서 자동.
 *   자동은 그 칸(node)·정상(state ok)·최신(찍은 뒤 그 영역 화면 파일이 안 바뀜)만, **한국어 앱 화면이 먼저**,
 *   다른 언어 조합은 같은 장면의 보조 그림(alts)으로 붙인다. 출처 순서 사용법 캡처 > 커밋 전 확인 > 기능 점검 > 가상 사용자.
 * 정리: 바로 지우지 않고 "정리 예정"(trash) 표시 → 7일 뒤 지움. 고른 그림·남기기·지금 쓰는 그림은 절대 안 지움.
 */

export const RULES = {
  /** 이보다 작은 파일은 빈 화면·로딩 화면으로 본다. */
  blankBytes: 10_000,
  /** 찍은 뒤 영역 화면이 바뀌고 이만큼 지나면 정리 예정. */
  staleDays: 30,
  errorDays: 14,
  simDays: 14,
  /** 정리 예정에서 지우기까지. */
  trashDays: 7,
  /** 지도 칸 하나에 붙이는 장면 수. */
  scenesPerNode: 4,
};

/** 한국어 앱 화면이 먼저, 그다음 이 순서. 없는 조합은 맨 뒤. */
export const LANG_ORDER = ["ko", "ja", "ar"];
export const SOURCE_ORDER = ["사용법 캡처", "커밋 전 확인", "기능 점검", "가상 사용자"];

const day = 24 * 60 * 60 * 1000;
const toTime = (date) => Date.parse(`${date}T00:00:00Z`);
const daysBetween = (from, to) => Math.floor((toTime(to) - toTime(from)) / day);
const rank = (list, value) => {
  const index = list.indexOf(value);
  return index < 0 ? list.length : index;
};

/** 같은 장면 안에서 앞에 올 것: 출처 → 최근 → order. */
function better(a, b) {
  return rank(SOURCE_ORDER, a.source) - rank(SOURCE_ORDER, b.source) || b.date.localeCompare(a.date) || (b.order ?? 0) - (a.order ?? 0);
}

/** 찍은 뒤 그 영역 화면이 바뀌었나(바뀐 날이 찍은 날보다 뒤). */
export function isStale(shot, changed) {
  const at = changed[shot.area];
  return Boolean(at && at > shot.date);
}

/**
 * @param shots  [{id, area, node, scene, lang, date, source, state, bytes, keep, trash:{at,reason}, assetId, order}]
 * @param picks  {sectionOrNodeKey: {shotId, applied}}
 * @param changed {area: "YYYY-MM-DD"} 그 영역 화면 파일이 마지막으로 바뀐 날
 * @param today  "YYYY-MM-DD"
 */
export function planShots({ shots, picks = {}, changed = {}, today }) {
  const live = shots.filter((s) => !s.deleted);
  const byId = Object.fromEntries(live.map((s) => [s.id, s]));

  // 1) 칸마다 자동 후보(정상·최신·정리 예정 아님), 장면별로 한국어 대표 + 다른 언어 보조.
  const nodes = {};
  const groups = {};
  for (const s of live) {
    if (!s.node || !s.scene || s.trash || (s.state ?? "ok") !== "ok" || isStale(s, changed)) continue;
    // 빈 화면, 오래된 가상 사용자 화면은 대표로 쓰지 않는다(그래서 지켜지지도 않는다).
    if ((s.bytes ?? Infinity) < RULES.blankBytes) continue;
    if (s.source === "가상 사용자" && daysBetween(s.date, today) >= RULES.simDays) continue;
    (groups[`${s.node}\u0000${s.scene}`] ||= []).push(s);
  }
  for (const list of Object.values(groups)) {
    const byLang = {};
    for (const s of [...list].sort(better)) if (!byLang[s.lang ?? ""]) byLang[s.lang ?? ""] = s;
    const langs = Object.keys(byLang).sort((a, b) => rank(LANG_ORDER, a) - rank(LANG_ORDER, b));
    const primary = byLang[langs[0]];
    const alts = langs.slice(1).map((lang) => byLang[lang]);
    (nodes[primary.node] ||= []).push({ scene: primary.scene, primary: primary.id, alts: alts.map((s) => s.id), date: primary.date, ko: primary.lang === "ko" });
  }
  for (const [node, scenes] of Object.entries(nodes)) {
    scenes.sort((a, b) => Number(b.ko) - Number(a.ko) || b.date.localeCompare(a.date) || a.scene.localeCompare(b.scene));
    nodes[node] = scenes.slice(0, RULES.scenesPerNode);
  }

  // 2) 사용자가 고른 그림(사용법 칸 id 또는 node.<칸>) — 언제나 먼저.
  const sections = {};
  for (const [key, pick] of Object.entries(picks)) if (pick?.shotId && byId[pick.shotId]) sections[key] = pick.shotId;

  // 3) 지키는 것: 고른 것·남기기·지금 칸에 쓰는 것.
  const protectedIds = new Set(Object.values(sections));
  for (const s of live) if (s.keep) protectedIds.add(s.id);
  for (const scenes of Object.values(nodes)) for (const sc of scenes) [sc.primary, ...sc.alts].forEach((id) => protectedIds.add(id));

  // 4) 정리 예정 표시할 것.
  const marks = [];
  const newest = {};
  for (const s of live) {
    if (!s.node || !s.scene) continue;
    const key = `${s.node}\u0000${s.scene}\u0000${s.lang ?? ""}`;
    if (!newest[key] || better(s, newest[key]) < 0) newest[key] = s;
  }
  for (const s of live) {
    if (s.trash || protectedIds.has(s.id)) continue;
    const age = daysBetween(s.date, today);
    let reason = null;
    if ((s.bytes ?? Infinity) < RULES.blankBytes || s.state === "blank") reason = "빈 화면";
    else if (s.state === "old") reason = "바뀐 옛 화면";
    else if (s.node && s.scene && newest[`${s.node}\u0000${s.scene}\u0000${s.lang ?? ""}`]?.id !== s.id) reason = "같은 장면 중복";
    else if (isStale(s, changed) && daysBetween(changed[s.area], today) >= RULES.staleDays) reason = `옛 화면(영역이 바뀐 지 ${RULES.staleDays}일)`;
    else if (s.state === "error" && age >= RULES.errorDays) reason = `오류 화면 ${RULES.errorDays}일`;
    else if (s.source === "가상 사용자" && age >= RULES.simDays) reason = `가상 사용자 ${RULES.simDays}일`;
    if (reason) marks.push({ id: s.id, reason });
  }

  // 5) 다시 지켜야 할 것(정리 예정이었는데 고르거나 남기기를 누름) / 지울 것(표시한 지 7일).
  const unmarks = live.filter((s) => s.trash && protectedIds.has(s.id)).map((s) => s.id);
  const deletes = live
    .filter((s) => s.trash && !protectedIds.has(s.id) && daysBetween(s.trash.at, today) >= RULES.trashDays)
    .map((s) => ({ id: s.id, assetId: s.assetId }));

  const untagged = live.filter((s) => !s.node || !s.scene).map((s) => s.id);
  const used = new Set([...Object.values(sections)]);
  for (const scenes of Object.values(nodes)) for (const sc of scenes) [sc.primary, ...sc.alts].forEach((id) => used.add(id));
  return { nodes, sections, marks, unmarks, deletes, untagged, downloads: [...used].map((id) => byId[id].assetId) };
}
