"use client";

/**
 * 통화·대화 화면 미리 보기(개발용, `next dev`의 /dev/call-preview) — 사람끼리 통화(RoomCallStage)와 1:1·단체방 말풍선 얼굴을
 * 계정 둘·마이크 없이 본다. ?v=dm|group|call1|call3|ai(AI 통화 튜터 수업 — 🎓·카드 &card=fix|meant|offer|passed, 카드 문구 &said=&right=&why=)|ai-end(끝 요약 🔁), &lang=ko·&learn=ja 등. 앱 빌드에는 안 들어간다(build-capacitor가 /dev를 옆으로 옮김).
 */
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { RoomCallStage, type CallPerson } from "@/components/rooms/RoomCall";
import { DmBubble } from "@/components/rooms/RoomDm";
import { GroupBubble } from "@/components/rooms/RoomGroups";
import { CallButton, CallButtonRow } from "@/components/speech/CallKit";
import { CallControls, CallStage, CallSummary } from "@/components/roleplay/CallParts";
import { resolveUiCopy } from "@/lib/resolveUiCopy";
import { isLocale } from "@/lib/copy";
import { roomCopy } from "@/lib/rooms/copy";

const ME = "acct-me";
const now = Date.UTC(2026, 10, 1, 6, 0);

function Preview() {
  const params = useSearchParams();
  const lang = params.get("lang") ?? "ko";
  const v = params.get("v") ?? "dm";
  const t = roomCopy(lang);
  const ui = resolveUiCopy(isLocale(lang) ? lang : "en", (params.get("learn") ?? "ja") as Parameters<typeof resolveUiCopy>[1]);
  const noop = () => undefined;
  const learn = params.get("learn") ?? "ja";
  // 튜터 수업 카드 미리 보기: &card=fix|meant|offer|passed
  const cardKind = params.get("card") ?? "fix";
  const samples: Record<string, { said: string; right: string; why: string; native: string; offer: string }> = {
    ja: { said: "昨日友達を会いました", right: "昨日友達に会いました。", why: "会う는 を가 아니라 に를 써요.", native: "주말에 영화 봤어", offer: "週末に映画を見ました。" },
    en: { said: "yesterday I go to beach", right: "Yesterday I went to the beach.", why: "昨日のことなので go ではなく went。", native: "週末に映画を見た", offer: "I caught a movie over the weekend." },
    es: { said: "ayer yo ir a la playa", right: "Ayer fui a la playa.", why: "مع «ayer» نستخدم الماضي: «fui».", native: "شاهدت فيلمًا في عطلة نهاية الأسبوع", offer: "Vi una peli el finde." },
  };
  // 스토어 스크린샷(store-shots/layers)이 앱 언어마다 고친 말 카드 문구를 넘긴다: &said=&right=&why=
  const base = samples[learn] ?? samples.en;
  const sample = {
    ...base,
    said: params.get("said") ?? base.said,
    right: params.get("right") ?? base.right,
    why: params.get("why") ?? base.why,
  };
  const coachCard =
    cardKind === "meant"
      ? { kind: "meant" as const, said: sample.native, right: sample.offer, why: "" }
      : cardKind === "offer"
        ? { kind: "offer" as const, said: "", right: sample.offer, why: "" }
        : { kind: "fix" as const, said: sample.said, right: sample.right, why: sample.why, passed: cardKind === "passed" };
  if (v === "ai") {
    return (
      <div className="flex h-dvh flex-col bg-black" dir={lang === "ar" ? "rtl" : "ltr"}>
        <CallStage language={learn} speaker="listening" timeLeft={null} caption={null} coach={coachCard} />
        <CallControls ui={ui} canAnswer captions={false} coach onToggleCoach={noop} onMissed={noop} onToggleCaptions={noop} onHint={noop} onEnd={noop} />
      </div>
    );
  }
  if (v === "ai-end") {
    return (
      <div className="flex h-dvh flex-col bg-black" dir={lang === "ar" ? "rtl" : "ltr"}>
        <CallSummary ui={ui} language={learn} seconds={312} tally={{ fixed: 4, hints: 1, missed: 0, redone: 3 }} />
      </div>
    );
  }
  if (v === "call1" || v === "call3") {
    const others: CallPerson[] =
      v === "call1"
        ? [{ peerId: "p1", accountId: "acct-yuki", nickname: "Yuki", speaking: true }]
        : [
            { peerId: "p1", accountId: "acct-yuki", nickname: "Yuki", speaking: true },
            { peerId: "p2", accountId: "acct-omar", nickname: "Omar", speaking: false, missed: true },
            { peerId: "p3", accountId: "acct-minji", nickname: "민지", speaking: false },
          ];
    return (
      <div className="flex h-dvh flex-col bg-black">
        <RoomCallStage
          others={others}
          me={{ speaking: false, muted: false }}
          caption={{ text: "週末は何をしましたか？", ...(v === "call3" ? { name: "Yuki" } : {}) }}
          onPerson={noop}
        />
        <CallButtonRow>
          <CallButton icon="🙉" label={ui.roleplayMissed} onClick={noop} />
          <CallButton icon="💬" label={ui.roleplayCaptions} onClick={noop} pressed />
          <CallButton icon="🎙" label={t.mute} onClick={noop} />
          <CallButton icon="📞" label={t.leave} onClick={noop} tone="end" />
        </CallButtonRow>
      </div>
    );
  }
  const texts = [
    { from: "acct-yuki", text: "週末は何をしましたか？" },
    { from: ME, text: "友達と映画を見るました。" },
    { from: "acct-yuki", text: "いいね！何の映画？" },
  ];
  return (
    <div className="h-dvh space-y-2 overflow-y-auto bg-black px-3 py-3">
      {texts.map((row, index) =>
        v === "group" ? (
          <GroupBubble
            key={index}
            t={t}
            me={ME}
            message={{ seq: index + 1, from: row.from, kind: "text", text: row.text, at: now + index * 60000 }}
            locale={lang}
            targetLanguage="ja"
            context={[]}
            asked={0}
            onQuote={noop}
          />
        ) : (
          <DmBubble
            key={index}
            t={t}
            message={{ seq: index + 1, from: row.from, kind: "text", text: row.text, at: now + index * 60000 }}
            mine={row.from === ME}
            otherId="acct-yuki"
            otherName="Yuki"
            me={ME}
            locale={lang}
            targetLanguage="ja"
            context={[]}
            ended={false}
            onJoinCall={noop}
            quoteName={(_id, fallback) => fallback}
            asked={0}
            onQuote={noop}
          />
        ),
      )}
    </div>
  );
}

export default function CallPreviewPage() {
  return (
    <Suspense>
      <Preview />
    </Suspense>
  );
}
