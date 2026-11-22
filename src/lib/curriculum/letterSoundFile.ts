/** 글자·소리 파일 이름 — 글자마다 코드 포인트 16진수를 -로 잇는다(scripts/letter-sounds.mjs가 같은 이름으로 만든다). */
export function letterSoundPath(lang: string, text: string): string {
  return `/letter-sounds/${lang}/${[...text.trim()].map((ch) => ch.codePointAt(0)!.toString(16)).join("-")}.mp3`;
}
