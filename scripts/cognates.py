"""
닮은 말 찾기(2026-11-08, src/lib/curriculum/languagePairs.ts ②) — 사전 예문(word-sentences/<언어>.json)과 그 영어 번역만으로.
라틴 글자 언어(es fr it pt id)의 낱말 ↔ 영어 낱말: 철자가 닮고(접미사 맞춤 뒤 비슷함 0.8 이상, 네 글자 이상)
  · 그 낱말 예문의 영어 번역에 영어 낱말(꼴 변화 포함)이 나오면 닮은 말(c)
  · 예문이 둘 다 있는데 한 번도 안 나오면 뜻이 다른 닮은 말 후보(f?) — 사람(Claude)이 보고 남긴 것만 f
두 라틴 언어 사이(es↔it 등)는 같은 영어 낱말로 이어지는 닮은 말끼리. 일본어 ↔ 중국어는 같은 한자 낱말(글자 그대로 같은 것만).
결과: src/lib/curriculum/pairs/cognates.json  {"es": {"problema": {"en": "problem", "it": "problema", ...}}, "f": {"es>en": {"embarazada": "embarrassed"}}}
python3 scripts/cognates.py → 뜻이 다른 닮은 말 후보는 tmp/cognates-false.txt (손으로 고른 목록은 FALSE_FRIENDS)
빈도 목록은 tmp/bank-words.json(언어 → 낱말 목록, vocabBank.ts loadBank에서 뽑아 둠) — 없으면 먼저 만든다.
"""
import json, re, unicodedata, difflib, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WS = ROOT / "src/lib/curriculum/word-sentences"
LATIN = ["es", "fr", "it", "pt", "id"]

def strip(w):
    w = unicodedata.normalize("NFD", w.lower())
    return "".join(c for c in w if unicodedata.category(c) != "Mn")

SUFFIX = [(r"(cion|cao|zione|tion|sion|sao|sione)$", "tion"), (r"(dad|dade|ta|te|ty|tad)$", "ty"), (r"(mente|ment)$", "ly"), (r"(ico|ica|ique|ic|ical)$", "ic"), (r"(oso|osa|oso|eux|euse|ous)$", "ous"), (r"(ista|iste|ist)$", "ist"), (r"(ismo|isme|ism)$", "ism"), (r"(ario|aria|aire|ary)$", "ary"), (r"(o|a|e)$", "")]
def norm(w):
    w = strip(w)
    for pat, rep in SUFFIX:
        n = re.sub(pat, rep, w)
        if n != w: return n
    return w

def sim(a, b):
    return difflib.SequenceMatcher(None, norm(a), norm(b)).ratio()

def forms(e):
    out = {e, e + "s", e + "es", e + "ed", e + "d", e + "ing", e + "ly"}
    if e.endswith("e"): out |= {e[:-1] + "ing", e[:-1] + "ed"}
    if e.endswith("y"): out |= {e[:-1] + "ies", e[:-1] + "ied"}
    return out

def load(l):
    return json.load(open(WS / f"{l}.json"))

EN = load("en")
EN_WORDS = [k[2:] for k in EN if re.match(r"^[a-z]{4,}$", k[2:])]
BY_FIRST = {}
for e in EN_WORDS: BY_FIRST.setdefault(strip(e)[:2], []).append(e)

# 뜻이 다른 닮은 말(Claude가 고름, 2026-11-08) — 낱말 → 닮은 영어 낱말(뜻은 다름). 스크립트가 예문 번역에 그 영어 낱말이 안 나오는지 확인한 것만 남김.
FALSE_FRIENDS = {
  "es": "embarazada:embarrassed actual:actual actualmente:actually librería:library éxito:exit carpeta:carpet constipado:constipated sensible:sensible realizar:realize asistir:assist molestar:molest recordar:record largo:large ropa:rope colegio:college introducir:introduce pretender:pretend fábrica:fabric compromiso:compromise suceso:success discutir:discuss lectura:lecture decepción:deception contestar:contest éxito:exit vaso:vase sopa:soap bizarro:bizarre conductor:conductor","fr": "actuellement:actually librairie:library sensible:sensible assister:assist blesser:bless coin:coin déception:deception éventuellement:eventually rester:rest sympathique:sympathetic location:location monnaie:money lecture:lecture prétendre:pretend demander:demand attendre:attend raisin:raisin préservatif:preservative cave:cave chair:chair achever:achieve affaire:affair journée:journey crayon:crayon collège:college","it": "attualmente:actually libreria:library sensibile:sensible camera:camera parenti:parents fattoria:factory morbido:morbid magazzino:magazine annoiato:annoyed educato:educated eventualmente:eventually preservativo:preservative argomento:argument simpatico:sympathetic pretendere:pretend rumore:rumor stampa:stamp fabbrica:fabric","pt": "atualmente:actually livraria:library esquisito:exquisite puxar:push pretender:pretend assistir:assist parentes:parents costume:costume injúria:injury sensível:sensible fábrica:fabric colar:collar data:data novela:novel propaganda:propaganda balcão:balcony",
}
FALSE_FRIENDS = {l: dict(x.split(":") for x in v.split()) for l, v in FALSE_FRIENDS.items()}

def main():
    out = {}; cand = []
    for l in LATIN:
        D = load(l)
        for k, lines in D.items():
            w = k[2:]
            if not re.match(r"^[^\W\d_]{4,}$", w): continue
            trans = " ".join((s.get("en") or "").lower() for s in lines)
            if not trans.strip(): continue
            tokens = set(re.findall(r"[a-z]+", trans))
            close = []
            for e in BY_FIRST.get(strip(w)[:2], []):
                if abs(len(e) - len(w)) > 4: continue
                r = sim(w, e)
                if r >= (0.9 if min(len(w), len(e)) <= 5 else 0.8): close.append((r, e))
            if not close: continue
            close.sort(reverse=True)
            hit = next((e for r, e in close if forms(e) & tokens), None)
            if hit:
                out.setdefault(l, {}).setdefault(w, {})["en"] = hit
                continue
            r, e = close[0]
            prefix = len(__import__("os").path.commonprefix([strip(w), strip(e)]))
            if (r >= 0.88 or prefix >= 5) and len([s for s in lines if s.get("en")]) >= 2 and strip(w) != strip(e):
                cand.append((l, w, e, round(r, 2), trans[:110]))
    # 두 라틴 언어 사이: 같은 영어 닮은 말로 이어짐
    anchor = {}
    for l, words in out.items():
        for w, v in words.items(): anchor.setdefault(v["en"], {}).setdefault(l, w)
    for e, per in anchor.items():
        for l, w in per.items():
            for m, x in per.items():
                if m != l: out[l][w][m] = x
    # 일본어 ↔ 중국어: 한자만으로 된 같은 낱말
    JA, ZH = load("ja"), load("zh")
    han = re.compile(r"^[一-鿿]{2,}$")
    zh = {k[2:] for k in ZH if han.match(k[2:])}
    for k in JA:
        w = k[2:]
        if han.match(w) and w in zh:
            out.setdefault("ja", {}).setdefault(w, {})["zh"] = w
            out.setdefault("zh", {}).setdefault(w, {})["ja"] = w
    kept = {}; dropped = []
    for l, pairs in FALSE_FRIENDS.items():
        D = load(l)
        bank = set(json.load(open(ROOT / "tmp/bank-words.json"))[l])
        en_bank = set(json.load(open(ROOT / "tmp/bank-words.json"))["en"])
        for w, e in pairs.items():
            lines = D.get("w|" + w) or []
            if w not in bank or e not in en_bank: dropped.append((l, w, e, "빈도 목록에 없음")); continue
            tokens = set(re.findall(r"[a-z]+", " ".join((x.get("en") or "").lower() for x in lines)))
            if forms(e) & tokens: dropped.append((l, w, e, "번역에 나옴")); continue
            kept.setdefault(f"{l}>en", {})[w] = e
            out.get(l, {}).get(w, {}).pop("en", None)
    out["f"] = kept
    print("뜻이 다른 닮은 말", {k: len(v) for k, v in kept.items()}, "뺀 것", dropped)
    target = ROOT / "src/lib/curriculum/pairs/cognates.json"
    target.parent.mkdir(exist_ok=True)
    json.dump(out, open(target, "w"), ensure_ascii=False, separators=(",", ":"), sort_keys=True)
    Path(ROOT / "tmp").mkdir(exist_ok=True)
    with open(ROOT / "tmp/cognates-false.txt", "w") as f:
        for c in sorted(cand): f.write("\t".join(map(str, c)) + "\n")
    print({l: len(v) for l, v in out.items()}, "뜻이 다른 후보", len(cand))

if __name__ == "__main__":
    main()
