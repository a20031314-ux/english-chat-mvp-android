"""검토가 끝난 목록(tsv) → src/lib/curriculum/vocab/<언어>.ts (curriculum/vocabBank.ts가 불러옴).

python3 scripts/vocab-bank/emit.py <언어> <bank.tsv>
tsv 한 줄: 대부분 = 낱말<TAB>품사<TAB>주제, ja·zh = 낱말<TAB>읽기(가나·병음)<TAB>품사<TAB>주제(주제는 vocabBank.ts TOPICS). 순서 = 많이 쓰는 순서.
"""
import json
import sys

lang, src = sys.argv[1], sys.argv[2]
SOURCES = {
    "en": "FrequencyWords (Hermit Dave, OpenSubtitles 2018 en_50k), CC BY-SA 4.0 — 사전형으로 묶고 이름·잡음을 뺌(2026-10-29)",
    "es": "FrequencyWords (Hermit Dave, OpenSubtitles 2018 es_50k), CC BY-SA 4.0 — 사전형으로 묶고 이름·잡음을 뺌(2026-10-29)",
    "ja": "wordfreq 3.1 (Robyn Speer), data CC BY-SA 4.0 — SudachiPy 사전형·읽기, 조사·조동사·이름·잡음을 뺌(2026-10-29)",
}
# 2026-10-31(낱말 층위 ②): 나머지 11개 언어 — FrequencyWords(OpenSubtitles 2018) 후보를 Claude가 사전형으로 묶고 이름·잡음을 빼고 품사·주제를 붙임(원어민 확인 전).
for code, name in {"ar": "ar", "fr": "fr", "id": "id", "it": "it", "ko": "ko", "pt": "pt_br", "ru": "ru", "th": "th", "vi": "vi", "zh": "zh_cn"}.items():
    SOURCES[code] = f"FrequencyWords (Hermit Dave, OpenSubtitles 2018 {name}_50k), CC BY-SA 4.0 — Claude가 사전형으로 묶고 이름·잡음을 빼고 품사·주제를 붙임(2026-10-31, 원어민 확인 전)"
SOURCES["hi"] = "wordfreq 3.1 (Robyn Speer) hi, data CC BY-SA 4.0 — Claude가 사전형으로 묶고 이름·잡음을 빼고 품사·주제를 붙임(2026-10-31, 원어민 확인 전)"
# 2026-10-31(낱말 층위 ③): 14개 언어 모두 약 7,000개로 — 3,000 뒤 4,000개는 같은 출처의 다음 순위에서 Claude가 B2~C1에 쓸모 있는 낱말로 고름(원어민 확인 전).
for code in list(SOURCES):
    SOURCES[code] += " · 3,001위부터 약 7,000까지 Claude가 같은 출처 다음 순위에서 고름(2026-10-31, 원어민 확인 전)"
READING = {"ja", "zh"}
rows = []
seen = set()
for line in open(src, encoding="utf-8"):
    parts = [p.strip() for p in line.rstrip("\n").split("\t")]
    if not parts or not parts[0] or parts[0] in seen:
        continue
    seen.add(parts[0])
    rows.append(parts[:4] if lang in READING else parts[:3])
out = f"src/lib/curriculum/vocab/{lang}.ts"
with open(out, "w", encoding="utf-8") as f:
    f.write("// 빈도 단어 묶음 — 자동 생성(scripts/vocab-bank/emit.py), 손으로 고치지 않는다.\n")
    f.write(f"// 출처: {SOURCES[lang]}\n")
    f.write("export const WORDS: readonly (readonly string[])[] = [\n")
    for row in rows:
        f.write("  " + json.dumps(row, ensure_ascii=False) + ",\n")
    f.write("];\n")
print(out, len(rows))
