import { NextRequest } from "next/server";
import { RECOMMENDED_APP_VERSION } from "@/lib/appVersion";
import { copy, isLocale, type UICopy } from "@/lib/copy";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { GUIDE_EN, GUIDE_KO, guideSection, type Guide } from "@/lib/guide/content";
import translations from "@/lib/guide/translations.json";
import {
  RELEASE_NOTES,
  latestNotedVersion,
  notesBetween,
  shotPath,
  versionForCode,
} from "@/lib/whatsNew";

export const runtime = "nodejs";

/**
 * 업데이트 배너가 보여 줄 "바뀐 점" — 아직 업데이트하지 않은 앱이 읽는다.
 *
 * 앱 안의 RELEASE_NOTES는 그 빌드가 자기 자신만 설명할 수 있다. 옛 빌드는 새
 * 버전의 문구 키도 모르니, 서버가 학습자의 앱 언어로 글을 풀어서 그림 주소와
 * 함께 돌려준다. 그림은 "새로워진 점"과 같은 것(public/whats-new/<버전>/<언어>/).
 *
 * 받을 버전은
 * - `code`: 폰의 Play 업데이트 확인이 알려 준 versionCode(가장 정확 — 그 폰이 실제로 받을 수 있는 것)
 * - `to`: 버전 이름을 직접
 * - 둘 다 없으면 서버가 권하는 버전(RECOMMENDED_APP_VERSION)
 *
 * GET /api/whats-new?from=2.67&code=82&ui=ja
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

function targetVersion(params: URLSearchParams): string | null {
  const to = params.get("to")?.trim();
  if (to && /^\d+(\.\d+){0,2}$/.test(to)) return to;
  const code = Number.parseInt(params.get("code") ?? "", 10);
  if (Number.isFinite(code) && code > 0) {
    const known = versionForCode(code);
    if (known) return known;
    // 노트를 아직 안 쓴 더 새 빌드: 그 사이 노트가 있는 버전은 모두 그 업데이트에 들어 있다.
    const newest = Math.max(...RELEASE_NOTES.map((note) => note.code));
    return code > newest ? latestNotedVersion() : null;
  }
  return RECOMMENDED_APP_VERSION;
}

/** 노트가 사용법 칸을 가리키면 그 칸의 글(같은 설명을 두 번 쓰지 않게, 2026-10-20). */
function guideText(locale: string, id: string, ui: UICopy): { heading: string; body: string } | null {
  const translated = (translations as unknown as Partial<Record<string, Guide>>)[locale];
  const guide = locale === "ko" ? GUIDE_KO : locale === "en" ? GUIDE_EN : (translated ?? GUIDE_EN);
  const section = guideSection(guide, id) ?? guideSection(GUIDE_EN, id);
  if (!section) return null;
  const labels = ui as unknown as Record<string, unknown>;
  const fill = (text: string) => text.replace(/\{ui:([a-zA-Z0-9]+)\}/g, (_, key: string) => (typeof labels[key] === "string" ? (labels[key] as string) : ""));
  return { heading: fill(section.heading), body: section.body.map(fill).join(" ") };
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const asked = params.get("ui")?.trim() ?? "";
  const locale = isLocale(asked) ? asked : "en";
  const ui = copy[locale] as UICopy;
  const from = params.get("from")?.trim() ?? "";
  const code = Number.parseInt(params.get("code") ?? "", 10);
  const target = targetVersion(params);
  const releases = target
    ? notesBetween(from, target).map((note) => ({
        version: note.version,
        items: note.items.map((item) => {
          const fromGuide = item.guide ? guideText(locale, item.guide, ui) : null;
          return {
          id: item.id,
          title: fromGuide?.heading ?? String(ui[item.title] ?? copy.en[item.title]),
          body: fromGuide?.body ?? String(ui[item.body] ?? copy.en[item.body]),
          image: shotPath(note.version, locale, item.shot),
          imageFallback: shotPath(note.version, "en", item.shot),
          };
        }),
      }))
    : [];
  return jsonWithCors(request, {
    // 받을 버전 이름. Play가 알려 준 code가 표에 없으면 null — 배너는 버전 없이 뜬다.
    version: Number.isFinite(code) && code > 0 ? versionForCode(code) : target,
    language: locale,
    releases,
  });
}
