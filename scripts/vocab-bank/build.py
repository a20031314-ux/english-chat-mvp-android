"""빈도 단어 묶음 후보 만들기(2026-10-29 사용자 "3개 언어부터 해줘", 설계 hub/drafts/vocab-bank-2026-10-29.md).

python3 scripts/vocab-bank/build.py <en|es|ja> <FrequencyWords 파일 또는 -> <출력 후보.tsv> [개수]
- en·es: FrequencyWords(OpenSubtitles 2018, 목록 CC BY-SA 4.0) 50k → simplemma로 사전형 → 같은 사전형끼리 빈도 합침.
- ja: wordfreq(데이터 CC BY-SA 4.0) 상위 → SudachiPy 사전형·읽기, 조사·조동사·기호·숫자·한 글자 가나 빼기.
- 숫자·한 글자(영문)·기호는 뺀다. 이름·자막 잡음은 사람/모델 검토(review)로 뺀다 — 이 스크립트는 후보만.
pip: simplemma, wordfreq, sudachipy, sudachidict_core.
"""
import re
import sys
from collections import OrderedDict

lang, src, out = sys.argv[1], sys.argv[2], sys.argv[3]
limit = int(sys.argv[4]) if len(sys.argv) > 4 else 3600

def kata_to_hira(text: str) -> str:
    return "".join(chr(ord(c) - 0x60) if "ァ" <= c <= "ヶ" else c for c in text)

rows: "OrderedDict[str, list]" = OrderedDict()
if lang in ("en", "es"):
    import simplemma
    for line in open(src, encoding="utf-8"):
        parts = line.split()
        if len(parts) != 2:
            continue
        word, count = parts[0], int(parts[1])
        if not re.fullmatch(r"[a-záéíóúñü']+", word) or (len(word) == 1 and word not in ("a", "i", "y", "o", "e", "u")):
            continue
        if "'" in word and lang == "es":
            continue
        lemma = simplemma.lemmatize(word, lang=lang).lower()
        if lang == "en" and "'" in word:
            continue  # contractions (don't, i'm) — 뼈대 대본이 가르친다
        row = rows.setdefault(lemma, [lemma, 0, set()])
        row[1] += count
        row[2].add(word)
        if len(rows) > limit * 3:
            break
    ranked = sorted(rows.values(), key=lambda r: -r[1])
    with open(out, "w", encoding="utf-8") as f:
        for lemma, count, forms in ranked[:limit]:
            f.write(f"{lemma}\t{count}\t{','.join(sorted(forms)[:6])}\n")
else:
    import wordfreq
    from sudachipy import dictionary, tokenizer
    tok = dictionary.Dictionary().create()
    mode = tokenizer.Tokenizer.SplitMode.C
    keep_pos = {"名詞", "動詞", "形容詞", "副詞", "形状詞", "連体詞", "感動詞", "代名詞", "接続詞"}
    for rank, word in enumerate(wordfreq.top_n_list("ja", 40000)):
        if re.fullmatch(r"[\d０-９]+|[\W_]+", word) or re.fullmatch(r"[ぁ-んァ-ン]", word):
            continue
        ms = tok.tokenize(word, mode)
        if len(ms) != 1:
            continue
        m = ms[0]
        pos = m.part_of_speech()[0]
        if pos not in keep_pos or m.part_of_speech()[1] in ("固有名詞", "数詞"):
            continue
        lemma = m.dictionary_form()
        # 읽기는 사전형의 읽기(활용형 읽기 말고).
        again = tok.tokenize(lemma, mode)
        reading = kata_to_hira("".join(x.reading_form() for x in again))
        row = rows.setdefault(lemma, [lemma, rank, reading, pos])
        if len(rows) >= limit:
            break
    with open(out, "w", encoding="utf-8") as f:
        for lemma, rank, reading, pos in rows.values():
            f.write(f"{lemma}\t{rank}\t{reading}\t{pos}\n")
print(lang, len(rows))
