"use client";

/**
 * 통화·대화 화면 미리 보기(개발용, `next dev`의 /dev/call-preview) — 사람끼리 통화(RoomCallStage)와 1:1·단체방 말풍선 얼굴을
 * 계정 둘·마이크 없이 본다. ?v=dm|group|call1|call3, &lang=ko 등. 앱 빌드에는 안 들어간다(build-capacitor가 /dev를 옆으로 옮김).
 */
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { RoomCallStage, type CallPerson } from "@/components/rooms/RoomCall";
import { DmBubble } from "@/components/rooms/RoomDm";
import { GroupBubble } from "@/components/rooms/RoomGroups";
import { CallButton, CallButtonRow } from "@/components/speech/CallKit";
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
  const ui = resolveUiCopy(isLocale(lang) ? lang : "en", "ja");
  const noop = () => undefined;
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
