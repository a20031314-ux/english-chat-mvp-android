"""검토가 끝난 목록(tsv) → src/lib/curriculum/vocab/<언어>.ts (curriculum/vocabBank.ts가 불러옴).

python3 scripts/vocab-bank/emit.py <en|es|ja> <bank.tsv>
tsv 한 줄: en·es = 낱말<TAB>품사<TAB>주제, ja = 낱말<TAB>읽기<TAB>품사<TAB>주제(주제는 vocabBank.ts TOPICS). 순서 = 많이 쓰는 순서.
"""
import json
import sys

lang, src = sys.argv[1], sys.argv[2]
SOURCES = {
    "en": "FrequencyWords (Hermit Dave, OpenSubtitles 2018 en_50k), CC BY-SA 4.0 — 사전형으로 묶고 이름·잡음을 뺌(2026-10-29)",
    "es": "FrequencyWords (Hermit Dave, OpenSubtitles 2018 es_50k), CC BY-SA 4.0 — 사전형으로 묶고 이름·잡음을 뺌(2026-10-29)",
    "ja": "wordfreq 3.1 (Robyn Speer), data CC BY-SA 4.0 — SudachiPy 사전형·읽기, 조사·조동사·이름·잡음을 뺌(2026-10-29)",
}
rows = []
seen = set()
for line in open(src, encoding="utf-8"):
    parts = [p.strip() for p in line.rstrip("\n").split("\t")]
    if not parts or not parts[0] or parts[0] in seen:
        continue
    seen.add(parts[0])
    rows.append(parts[:4] if lang == "ja" else parts[:3])
out = f"src/lib/curriculum/vocab/{lang}.ts"
with open(out, "w", encoding="utf-8") as f:
    f.write("// 빈도 단어 묶음 — 자동 생성(scripts/vocab-bank/emit.py), 손으로 고치지 않는다.\n")
    f.write(f"// 출처: {SOURCES[lang]}\n")
    f.write("export const WORDS: readonly (readonly string[])[] = [\n")
    for row in rows:
        f.write("  " + json.dumps(row, ensure_ascii=False) + ",\n")
    f.write("];\n")
print(out, len(rows))
