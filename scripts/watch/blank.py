"""빈 공간 찾기 — 앱 화면 캡처에서 아무것도 없는 큰 띠(광고를 넣을 만한 자리 후보)를 찾는다.

사용자 2026-11-01 "학습 사이 공간, 빈 공간 항상 찾아서 광고 삽입 고려해줘. 앱 내 UI에서 빈 공간 더 있는지 점검".
화면 점검(`npm run sim:screens`)·광고 점검 캡처(`scripts/watch/blank-capture.mjs`)가 찍은 그림을 받아,
위 상단바(8%)·아래 하단 탭(10%)을 빼고 한 줄 전체가 거의 한 색인 줄이 이어지는 띠를 센다. 판단(넣어도 되나)은 사람·에이전트 몫 —
버튼·입력칸과 띄울 수 있나, 키보드가 올라오면 어떻게 되나는 그림만으로 모른다.

  python3 scripts/watch/blank.py <그림 또는 폴더>... [--min 0.15] [--out tmp/watch/blank.json]
  → 그림마다 띠 [{top, bottom, share}] (share = 화면 높이 대비), share가 --min 이상인 것만.
"""
import json
import os
import sys

from PIL import Image

args = sys.argv[1:]
MIN = float(args[args.index("--min") + 1]) if "--min" in args else 0.15
OUT = args[args.index("--out") + 1] if "--out" in args else "tmp/watch/blank.json"
paths = [a for i, a in enumerate(args) if not a.startswith("--") and (i == 0 or args[i - 1] not in ("--min", "--out"))]

files = []
for p in paths:
    if os.path.isdir(p):
        for root, _, names in os.walk(p):
            files += [os.path.join(root, n) for n in sorted(names) if n.lower().endswith((".png", ".webp", ".jpg"))]
    else:
        files.append(p)


def bands(path):
    im = Image.open(path).convert("L")
    w, h = im.size
    small = im.resize((max(1, w // 4), max(1, h // 4)))
    sw, sh = small.size
    px = small.load()
    top, bottom = int(sh * 0.08), int(sh * 0.90)
    flat = []
    for y in range(sh):
        row = [px[x, y] for x in range(int(sw * 0.04), int(sw * 0.96))]
        flat.append(max(row) - min(row) <= 6)  # 거의 한 색(테두리·그림자 정도는 허용)
    found, start = [], None
    for y in range(top, bottom + 1):
        if y < bottom and flat[y]:
            start = y if start is None else start
        elif start is not None:
            share = (y - start) / sh
            if share >= MIN:
                found.append({"top": round(start / sh, 3), "bottom": round(y / sh, 3), "share": round(share, 3)})
            start = None
    return found


result = []
for f in files:
    try:
        b = bands(f)
    except Exception as e:  # 깨진 그림은 건너뜀
        print(f"건너뜀 {f}: {e}", file=sys.stderr)
        continue
    if b:
        result.append({"file": f, "bands": b, "largest": max(x["share"] for x in b)})
result.sort(key=lambda r: -r["largest"])
os.makedirs(os.path.dirname(OUT) or ".", exist_ok=True)
with open(OUT, "w") as fh:
    json.dump(result, fh, ensure_ascii=False, indent=1)
print(f"그림 {len(files)}장 중 빈 띠(화면 {int(MIN * 100)}% 이상) 있는 것 {len(result)}장 → {OUT}")
for r in result[:15]:
    print(f"  {r['largest']:.0%}  {r['file']}")
