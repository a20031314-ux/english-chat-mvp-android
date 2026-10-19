import { senderTag } from "./feedbackStore.ts";
import { SHARED_ANONYMOUS_ID } from "./identity.ts";
import { kvGetJson, kvListPush, kvListTake, kvSetJson, kvSetJsonIfAbsent } from "./kv.ts";
import { compareVersions } from "../appVersion.ts";
import { newsFor, type FeedbackFix, type FeedbackNews } from "../feedbackFix.ts";

/**
 * 반영 소식 저장소 (설명: src/lib/feedbackFix.ts).
 *
 *   feedback:v1:fix:<카드>               반영 내용 하나(문구·그림 언어·앱 버전)
 *   feedback:v1:news:<보낸 사람 해시>     그 사람 앞으로 쌓인 소식 [{card, ui, told}]
 *   feedback:v1:notified:<카드>:<해시>    카드마다 한 사람에게 한 번만
 *
 * 의견처럼 시간이 지나면 저절로 사라진다(의견 90일 + 업데이트를 기다릴 여유).
 */

const FIX = (card: string) => `feedback:v1:fix:${card}`;
const NEWS = (sender: string) => `feedback:v1:news:${sender}`;
const NOTIFIED = (card: string, sender: string) => `feedback:v1:notified:${card}:${sender}`;

const KEEP_SECONDS = 120 * 24 * 60 * 60;

/** id 없이 보낸 의견(옛 빌드·쿠키 없음)은 모두 같은 해시 — 아무에게나 가지 않게 뺀다. */
const SHARED_TAG = senderTag(SHARED_ANONYMOUS_ID);

type Pending = {
  card: string;
  /** 의견을 보낼 때의 UI 언어 — 지금 앱 언어를 모르면 이걸로. */
  ui: string;
  /** "업데이트하면 보여요"를 이미 한 번 보여 줬다. */
  told?: boolean;
};

export type Recipient = { sender: string; uiLocale: string };

/** 카드가 반영됐다 — 묶인 사람마다 소식 하나. 이미 알린 사람은 건너뛴다. */
export async function announceFix(
  fix: FeedbackFix,
  recipients: Recipient[],
): Promise<{ sent: number; skipped: number }> {
  await kvSetJson(FIX(fix.card), fix, KEEP_SECONDS);
  let sent = 0;
  let skipped = 0;
  const seen = new Set<string>();
  for (const { sender, uiLocale } of recipients) {
    if (seen.has(sender) || sender === SHARED_TAG) continue;
    seen.add(sender);
    const first = await kvSetJsonIfAbsent(NOTIFIED(fix.card, sender), fix.at, KEEP_SECONDS);
    if (!first) {
      skipped += 1;
      continue;
    }
    const row: Pending = { card: fix.card, ui: uiLocale };
    await kvListPush(NEWS(sender), [JSON.stringify(row)], KEEP_SECONDS);
    sent += 1;
  }
  return { sent, skipped };
}

export async function readFix(card: string): Promise<FeedbackFix | null> {
  return kvGetJson<FeedbackFix>(FIX(card));
}

/**
 * 앱을 열 때: 이 사람 앞으로 온 소식. `userIds`는 이 요청으로 알 수 있는 id 모두
 * (로그인 전에 보낸 의견도 찾게). 보여 준 소식은 지운다. 이 빌드에 아직 없는 반영은
 * "업데이트하면 보여요"로 한 번 보여 주고, 업데이트한 뒤 다시 "반영됐어요"로 보여 준다.
 */
export async function takeFeedbackNews(input: {
  userIds: string[];
  uiLocale: string;
  appVersion: string;
  native: boolean;
}): Promise<FeedbackNews[]> {
  const tags = [...new Set(input.userIds.filter((id) => id && id !== SHARED_ANONYMOUS_ID).map(senderTag))];
  const out: FeedbackNews[] = [];
  const shownCards = new Set<string>();
  for (const tag of tags) {
    const rows = await kvListTake(NEWS(tag));
    if (!rows.length) continue;
    const keep: string[] = [];
    for (const raw of rows) {
      let row: Pending;
      try {
        row = JSON.parse(raw) as Pending;
      } catch {
        continue;
      }
      const fix = await readFix(row.card);
      if (!fix) continue;
      const needsUpdate =
        input.native && Boolean(fix.appVersion) && (!input.appVersion || compareVersions(input.appVersion, fix.appVersion) < 0);
      if (needsUpdate) {
        keep.push(JSON.stringify({ ...row, told: true } satisfies Pending));
        if (row.told) continue;
      }
      if (shownCards.has(fix.card)) continue;
      shownCards.add(fix.card);
      out.push(newsFor(fix, input.uiLocale || row.ui, needsUpdate));
    }
    if (keep.length) await kvListPush(NEWS(tag), keep, KEEP_SECONDS);
  }
  return out;
}
