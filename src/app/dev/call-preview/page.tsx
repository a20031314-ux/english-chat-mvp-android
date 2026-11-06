"use client";

/**
 * 통화·대화 화면 미리 보기(개발용, `next dev`의 /dev/call-preview) — 사람끼리 통화(RoomCallStage)와 1:1·단체방 말풍선 얼굴을
 * 계정 둘·마이크 없이 본다. ?v=dm|group|call1|call3|ai(AI 통화 튜터 수업 — 🎓·카드 &card=fix|meant|offer|passed, 카드 문구 &said=&right=&why=, 작별 차례 끝내기 강조 &leaving=1, 자막 &caption=1·해석 &meaning=1, 시작 고르기 튜터 둘 &pick=1)|ai-end(끝 요약 🔁, 숙제 글자·소리 &homework=1, 튜터 메모 &note=1)|ai-end(끝 요약 🔁), &lang=ko·&learn=ja 등. 앱 빌드에는 안 들어간다(build-capacitor가 /dev를 옆으로 옮김).
 */
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { RoomCallStage, type CallPerson } from "@/components/rooms/RoomCall";
import { DmBubble } from "@/components/rooms/RoomDm";
import { GroupBubble } from "@/components/rooms/RoomGroups";
import { CallButton, CallButtonRow } from "@/components/speech/CallKit";
import { writeTutorGender } from "@/lib/tutorGender";
import { CallControls, CallStage, CallSummary, LettersHomework, TutorNote } from "@/components/roleplay/CallParts";
import { resolveUiCopy } from "@/lib/resolveUiCopy";
import { isLocale } from "@/lib/copy";
import { roomCopy } from "@/lib/rooms/copy";

const ME = "acct-me";
// 끝 화면 튜터 메모 미리 보기(&note=1) — 2026-11-06 운영 응답에서 고른 것.
// 학습 언어마다(앱 언어 표가 아님) — [학습 언어, 메모].
const NOTE: Record<string, string> = Object.fromEntries([
  ["ja", "오늘은 편의점 아르바이트와 아이스라테 이야기를 나눴어요. 바쁜 하루 뒤에 커피 한 잔을 고르는 모습이 참 따뜻하게 느껴졌어요. 다음에는 「ミルクが多い」처럼 が를 붙여 말하는 연습을 해 보세요."],
  ["en", "今日はジムとベンチプレスの話をしたね。60キロから70キロに上がった話、すごく良かったよ。次は lifted や tried みたいな過去形を練習してみよう。"],
  ["es", "حديثنا اليوم كان عن عملك في المستشفى الليلي وعن طبق المقلوبة. أحسنتِ في جملة «por eso estudio español». وللتدريب القادم: «el problema» وليس «la problema»."],
]);
// 자막 미리 보기(&caption=1, 해석 &meaning=1) — 튜터 한 줄과 앱 언어 해석(미리 보기라 고정 문장).
const CAPTION: Record<string, { text: string; meaning: string }> = {
  ja: { text: "今日はどんな一日だった？", meaning: "오늘 하루 어땠어?" },
  en: { text: "How was your day today?", meaning: "今日はどんな一日だった？" },
  es: { text: "¿Qué tal tu día?", meaning: "كيف كان يومك؟" },
};
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
        <CallStage
          language={learn}
          speaker="listening"
          timeLeft={null}
          caption={params.get("caption") === "1" ? { text: CAPTION[learn]?.text ?? CAPTION.en.text, ...(params.get("meaning") === "1" ? { meaning: CAPTION[learn]?.meaning ?? CAPTION.en.meaning } : {}) } : null}
          coach={params.get("caption") === "1" || params.get("pick") === "1" ? null : coachCard}
          pick={
            params.get("pick") === "1"
              ? { ask: ui.callModeAsk, talk: ui.callModeTalk, study: ui.callModeStudy, last: "talk", onTalk: noop, onStudy: noop, onTutor: (g) => writeTutorGender(learn, g) }
              : null
          }
        />
        <CallControls ui={ui} canAnswer captions={false} coach onToggleCoach={noop} onMissed={noop} onToggleCaptions={noop} onHint={noop} onEnd={noop} leaving={params.get("leaving") === "1"} />
      </div>
    );
  }
  if (v === "ai-end") {
    return (
      <div className="flex h-dvh flex-col bg-black" dir={lang === "ar" ? "rtl" : "ltr"}>
        <CallSummary ui={ui} language={learn} seconds={312} tally={{ fixed: 4, hints: 1, missed: 0, redone: 3 }} />
        {params.get("note") === "1" ? <TutorNote text={NOTE[learn] ?? NOTE.en} language={learn} /> : null}
        {params.get("homework") === "1" ? <LettersHomework ui={ui} language={learn} onOpen={noop} /> : null}
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
