export type ResumeState<R> = {
  day: string;
  index: number;
  results: Record<number, R>;
  revealed: Record<number, boolean>;
  /** 대본: 상대 줄마다 고른 말. */
  picks?: Record<number, number>;
  /** 문장구조: 고른 방식. */
  mode?: string;
};

export function localDay(now = new Date()): string {
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}
