import type { LearningLanguageCode } from "@/lib/learningLanguages";
import { fetchPractice, listenOnce, pausesIn, unclearWords } from "@/lib/roleplay/listen";
import { justTalkId } from "@/lib/roleplay/justTalk";
import type { Practice } from "@/lib/roleplay/practice";

/**
 * One attempt at a line: open the microphone once, transcribe, and say which
 * words came out as which. Shared by the door and by the learner's own lines
 * in a call, where the line to say is what they said — or what it was put
 * right to.
 */
export async function sayLine(
  line: string,
  input: {
    targetLanguage: LearningLanguageCode;
    nativeLanguage: LearningLanguageCode;
    isPremium: boolean;
    meaning?: string;
    before?: string;
    frame?: string;
    scriptId?: string;
    mode?: string;
    /** My 대본 따라 말하기: 모델 판단 없이 낱말 대조만(서버는 한도·기록만, 2026-11-01). */
    compareOnly?: boolean;
    onLimit?: () => void;
    /** 연습: 멈칫해도 끊지 않고 알린다(화면이 잘 모르겠어요·다 말했어요를 띄움, 2026-10-29). */
    patient?: boolean;
    onPaused?: (paused: boolean) => void;
    onReady?: (endNow: () => void) => void;
  },
): Promise<{ heard: string; practice: Practice | null; unclear: string[]; pauses: [string, number][] }> {
  try {
    const { heard } = await listenOnce({ language: input.targetLanguage, isPremium: input.isPremium, patient: input.patient, onPaused: input.onPaused, onReady: input.onReady });
    if (!heard) return { heard: "", practice: null, unclear: [], pauses: [] };
    const unclear = unclearWords(heard);
    const pauses = pausesIn(heard);
    let limited = false;
    const ask = () => fetchPractice({
      unclear,
      scenarioId: justTalkId(input.targetLanguage),
      target: line,
      heard,
      nativeLanguage: input.nativeLanguage,
      isPremium: input.isPremium,
      meaning: input.meaning,
      before: input.before,
      frame: input.frame,
      scriptId: input.scriptId,
      mode: input.mode,
      compareOnly: input.compareOnly,
      onLimit: () => {
        limited = true;
        input.onLimit?.();
      },
    });
    // 한마디가 한 번 비어 오면(네트워크·모델) 한 번 더 — 없으면 낱말이 하나만 달라도 틀린 줄로 남는다(2026-10-29).
    const practice = (await ask()) ?? (limited ? null : await ask());
    return { heard, practice, unclear, pauses };
  } catch {
    // No microphone, or it was refused: nothing came through.
    return { heard: "", practice: null, unclear: [], pauses: [] };
  }
}

/**
 * 쓴 한 줄(채팅 입력) 판단 — 마이크 없이 sayLine과 같은 확인(뜻·틀이 맞는지, Haiku → 틀리면 Sonnet).
 * 문장구조 수업 대화(FrameLesson, 사용자 2026-11-02 "3단계도 채팅으로").
 */
export async function typedLine(
  line: string,
  typed: string,
  input: {
    targetLanguage: LearningLanguageCode;
    nativeLanguage: LearningLanguageCode;
    isPremium: boolean;
    meaning?: string;
    before?: string;
    frame?: string;
    scriptId?: string;
    mode?: string;
    onLimit?: () => void;
  },
): Promise<{ heard: string; practice: Practice | null }> {
  const heard = typed.trim();
  if (!heard) return { heard: "", practice: null };
  let limited = false;
  const ask = () =>
    fetchPractice({
      scenarioId: justTalkId(input.targetLanguage),
      target: line,
      heard,
      nativeLanguage: input.nativeLanguage,
      isPremium: input.isPremium,
      meaning: input.meaning,
      before: input.before,
      frame: input.frame,
      scriptId: input.scriptId,
      mode: input.mode,
      onLimit: () => {
        limited = true;
        input.onLimit?.();
      },
    });
  try {
    const practice = (await ask()) ?? (limited ? null : await ask());
    return { heard, practice };
  } catch {
    return { heard, practice: null };
  }
}
