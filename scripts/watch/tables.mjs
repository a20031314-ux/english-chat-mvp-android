// 마크다운 표 → 칸, 칸 글 → 숫자. 변경 감시(watch.mjs)와 모델 교체 계산(scripts/models/whatif.mjs)이 같이 쓴다.

/** 마크다운 표의 모든 칸 → { "절 · 행 · 열": "칸 글" }. 절은 바로 앞 ## / ### 머리. */
export function tableCells(markdown) {
  const cells = {};
  let section = "";
  let header = null;
  for (const line of markdown.split("\n")) {
    const heading = line.match(/^#{2,4}\s+(.*)/);
    if (heading) {
      section = heading[1].trim();
      header = null;
      continue;
    }
    if (!line.startsWith("|")) {
      header = null;
      continue;
    }
    const row = line.split("|").slice(1, -1).map((c) => c.trim());
    if (row.every((c) => /^:?-+:?$/.test(c))) continue;
    if (!header) {
      header = row;
      continue;
    }
    row.slice(1).forEach((cell, i) => {
      cells[`${section} · ${row[0]} · ${header[i + 1] ?? i + 1}`] = cell;
    });
  }
  return cells;
}

/** 칸 글에서 첫 숫자(원·%) — "⚠ -2,132원 (-86%)" → -2132, "−350원" → -350. */
export function numberOf(cell) {
  const m = String(cell).replace(/−/g, "-").replace(/\*\*/g, "").match(/([+-]?\s?[\d,]+(?:\.\d+)?)\s*(원|%)?/);
  if (!m) return null;
  return { value: Number(m[1].replace(/[\s,]/g, "")), unit: m[2] ?? "" };
}
