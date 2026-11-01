/**
 * 튜터 줄 하나를 소리로 — 앱에 든 녹음 파일, 없거나 실패하면 그 자리에서 합성(TTS). RoleplayScreen에서 옮김(2026-11-01 통화 구조 정리).
 * 끝나면(다 말함·멈춤·너무 김·오류) `onDone`을 정확히 한 번 부르고, 돌려준 함수로 멈춘다.
 */
import { learningLanguageSpeechTag } from "@/lib/learningLanguages";
import { reportTutorDiag } from "@/lib/roleplay/listen";
import type { RoleplayScenario, SentenceBank } from "@/lib/roleplay/script";
import type { SessionState } from "@/lib/roleplay/session";
import { playTts, prefetchTts, stopTts, ttsContextState } from "@/lib/ttsPlayer";

/**
 * How long to wait for a line that has not started playing before carrying on
 * without it. Long enough for a slow connection, short enough that a stall does
 * not read as the app having hung.
 */
const STALLED_AUDIO_MS = 8000;
/** 타이머가 이만큼 넘게 늦게 깨면 화면이 멈춰 있었던 것 — 한 번 더 기다린다. */
const LATE_TIMER_MS = 1500;
const STALL_GRACE_MS = 4000;
/**
 * The same, for a line synthesised on the spot. It streams, so it starts before
 * it has fully arrived, but the whole of it has to play before the turn passes.
 */
const GENERATED_AUDIO_MS = 30000;

/**
 * Fetch a line the scene is about to say, before it has to be said.
 *
 * Only for lines that have no recording in the app. A repertoire line is one:
 * scripts/build-roleplay-audio.mjs records `sentenceIdsUsed`, which is the
 * scene's nodes and not its repertoire, on purpose — sixty kilobytes a line is
 * what kept the bank small. Warming a line that does ship as a file would buy
 * nothing and pay for a synthesis to do it.
 */
export function warmLine(scenario: RoleplayScenario, bank: SentenceBank, text: string): void {
  const spokenOnly = new Set((scenario.repertoire ?? []).map((id) => bank[id]?.text).filter(Boolean));
  if (!spokenOnly.has(text)) return;
  prefetchTts(text, learningLanguageSpeechTag(scenario.language), scenario.voice);
}

/**
 * The rest of the turn, fetched while the first half is still being said.
 *
 * A turn is two lines now — a reaction, then the question after it — and they
 * were played strictly one after the other: the second line's audio was not
 * asked for until the first had finished, so the learner heard a gap the length
 * of a round trip in the middle of one sentence-and-a-half. The first line
 * takes a second or so to say and nothing used that second, which is exactly
 * long enough to have fetched the other one.
 */
export function warmNextLine(scenario: RoleplayScenario, state: SessionState): void {
  // The line being said now is queue[0]; afterSaying drops it when it ends.
  const next = state.queue[1];
  // Any line with no file is synthesised, and that includes the written line
  // behind a reaction (reactions.ts), which takes longest to arrive: start it
  // while the reaction, usually already in the cache, is being said. A line
  // that ships as a file has nothing to fetch.
  if (next && !next.audioPath) {
    prefetchTts(next.text, learningLanguageSpeechTag(scenario.language), scenario.voice);
  }
}

/**
 * Play one tutor line. Returns the cleanup that stops it (and never calls
 * `onDone` afterwards). `onAudio` gets the element of a file-backed line, so the
 * screen can pause it when it closes.
 */
export function playTutorLine(line: {
  text: string;
  audioPath?: string;
  language: string;
  voice?: string;
  onDone: () => void;
  onAudio?: (audio: HTMLAudioElement) => void;
}): () => void {
  let cancelled = false;
  let advanced = false;
  let watchdog = 0;
  /**
   * 기다림 타이머. 화면이 멈춰 있던 동안(무거운 일 — 예: 고친 줄의 화면 찍기) 늦게 깨면 한 번 더 기다린다.
   * 늦게 깬 타이머가 막 도착한 소리보다 먼저 돌아 줄을 소리 없이 넘기던 것(2026-10-27 사용자: "고칠 곳이 있어요"가
   * 뜰 때 간헐적으로 튜터 말이 안 들리고 글만 올라옴).
   */
  const arm = (ms: number, why: "stall" | "long", retried = false) => {
    window.clearTimeout(watchdog);
    const due = Date.now() + ms;
    watchdog = window.setTimeout(() => {
      if (!retried && Date.now() - due > LATE_TIMER_MS) {
        arm(STALL_GRACE_MS, why, true);
        return;
      }
      advance(why);
    }, ms);
  };
  // 진단(iOS TestFlight): 이 줄이 파일로/합성으로 나왔는지, 소리가 시작됐는지, 무엇으로 끝났는지.
  const lineStartedAt = Date.now();
  let lineSource: "file" | "tts" = line.audioPath ? "file" : "tts";
  let lineStarted = false;
  const advance = (why?: unknown) => {
    if (cancelled || advanced) return;
    advanced = true;
    reportTutorDiag({
      source: lineSource,
      ctx: ttsContextState(),
      started: lineStarted,
      end: typeof why === "string" ? why : why instanceof Error ? `err:${why.name}` : "done",
      ms: Date.now() - lineStartedAt,
    });
    window.clearTimeout(watchdog);
    line.onDone();
  };

  /**
   * Say it in the scene's voice, because no file says it.
   *
   * Two lines end up here. One the character wrote just now, which never had
   * a file. And one the bank holds as words alone — a sentence can be added
   * to the bank without shipping sixty kilobytes of audio with it, and the
   * edge cache means only the first person to reach it waits (scripts/
   * warm-roleplay-speech.mjs warms them before a release so that nobody
   * does).
   *
   * Once, however many ways the file failed. A line the bank holds as words
   * alone has an audioPath that resolves to nothing, and a missing file
   * announces itself twice: the element fires `error` and `play()` rejects.
   * Both used to reach here, and the second call's `stopTts` ended the first
   * one's playback — whose promise then resolved, called `advance`, and moved
   * the scene on before the second synthesis had arrived.
   */
  let speaking = false;
  const speak = () => {
    if (speaking) return;
    speaking = true;
    /**
     * Two waits, because they are two different questions: whether anything is
     * coming (speech is fetched from a server that is usually quick and is
     * sometimes not), and how long a line takes to say. A line that has not
     * begun in eight seconds is given up on and the scene moves, and one that
     * has begun is allowed to finish.
     */
    lineSource = "tts";
    arm(STALLED_AUDIO_MS, "stall");
    void playTts(line.text, learningLanguageSpeechTag(line.language), line.voice, () => {
      lineStarted = true;
      window.clearTimeout(watchdog);
      arm(GENERATED_AUDIO_MS, "long");
    }).then(() => advance("ended"), advance);
  };

  if (!line.audioPath) {
    speak();
    return () => {
      cancelled = true;
      window.clearTimeout(watchdog);
      stopTts();
    };
  }

  const audio = new Audio(line.audioPath);
  line.onAudio?.(audio);
  /**
   * Audio that never finishes must not take the scenario with it.
   *
   * `error` covers a file that is missing, but a load that stalls raises
   * nothing at all — it simply never ends, and the line stays on screen with
   * no way forward. The text has already been shown by this point, so going
   * on without the voice is a worse lesson but not a dead one.
   */
  arm(STALLED_AUDIO_MS, "stall");
  audio.addEventListener(
    "playing",
    () => {
      lineStarted = true;
    },
    { once: true },
  );
  audio.addEventListener(
    "loadedmetadata",
    () => {
      if (!Number.isFinite(audio.duration)) return;
      window.clearTimeout(watchdog);
      // Its own length plus a moment, once that length is actually known.
      arm(audio.duration * 1000 + 2000, "long");
    },
    { once: true },
  );
  audio.addEventListener("ended", () => advance("ended"), { once: true });
  // A file that is not there is a sentence the bank holds as words alone, not
  // a broken line: it is spoken instead of skipped. The failure is local and
  // immediate — the recordings ship inside the app — so this costs nothing
  // when the file does exist.
  audio.addEventListener(
    "error",
    () => {
      if (cancelled || advanced) return;
      window.clearTimeout(watchdog);
      speak();
    },
    { once: true },
  );
  void audio.play().catch(() => {
    if (cancelled || advanced) return;
    window.clearTimeout(watchdog);
    speak();
  });
  return () => {
    cancelled = true;
    window.clearTimeout(watchdog);
    audio.pause();
    stopTts();
  };
}
