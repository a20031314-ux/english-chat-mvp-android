# 홍보 쇼츠(한국어, 1080x1920, 30fps) — 사용법 장면(실제 화면 자른 그림)으로 하루 흐름: 배우기 → 써 보기 → 기록.
# 녹화·운영 API 없이 public/guide/ko 장면 그림만 씀 — 사용법 장면을 다시 찍으면 자르는 자리(crop)를 다시 본다.
# Run(저장소 루트): node store-shots/promo/music.mjs && python3 store-shots/promo/slides-promo.py
#   미리 보기: python3 store-shots/promo/slides-promo.py --frames s4@2.0,end@3.0  → tmp/promo/slides/f-*.png
# 결과: tmp/promo/slides/languagebank-promo-ko.mp4 (2026-11-23, 22.8초)
import os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

REPO = os.getcwd()
G = REPO + "/public/guide/ko/"
OUT = os.path.join(REPO, "tmp", "promo", "slides")
os.makedirs(OUT, exist_ok=True)
W, H, FPS = 1080, 1920, 30
BG = (11, 11, 12)
FB = "/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc"
FM = "/usr/share/fonts/opentype/noto/NotoSansCJK-Medium.ttc"
SKY, GREEN, YELLOW, PINK = (96, 190, 255), (52, 211, 153), (250, 204, 21), (244, 114, 182)

def font(p, s): return ImageFont.truetype(p, s, index=1)  # index 1 = KR

def crop(name, a, b):
    return Image.open(G + name + ".webp").convert("RGB").crop((0, a, 720, b))

SHOTS = {
    "q1": crop("my-keep-1", 760, 1250),
    "q3": crop("my-keep-3", 600, 1245),
    "q2": crop("my-keep-2", 330, 1195),
    "chat": crop("tab-chat-2", 835, 1292),
    "call1": crop("call-talk-1", 430, 1150),
    "call2": crop("call-talk-2", 1070, 1285),
    "log": crop("my-log-1", 650, 1190),
}
ICON = Image.open(REPO + "/public/icon-512.png").convert("RGBA")

def ease(t): t = max(0, min(1, t)); return 1 - (1 - t) ** 3

def card(img, width):
    s = width / img.width
    im = img.resize((width, round(img.height * s)), Image.LANCZOS)
    pad = 18
    c = Image.new("RGBA", (im.width + pad * 2, im.height + pad * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(c)
    d.rounded_rectangle((0, 0, c.width - 1, c.height - 1), 44, fill=(18, 18, 20, 255), outline=(52, 52, 58, 255), width=3)
    m = Image.new("L", im.size, 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, im.width - 1, im.height - 1), 30, fill=255)
    c.paste(im, (pad, pad), m)
    return c

def paste_alpha(base, im, x, y, a):
    if a <= 0: return
    if a < 1:
        im = im.copy(); im.putalpha(im.getchannel("A").point(lambda v: int(v * a)))
    base.alpha_composite(im, (int(x), int(y)))

def text_block(d, lines, y, size, color=(255, 255, 255), fpath=FB, gap=1.22, hl=None):
    f = font(fpath, size)
    for i, ln in enumerate(lines):
        w = d.textlength(ln, font=f)
        x = (W - w) / 2
        col = hl if (hl and i == len(lines) - 1) else color
        d.text((x, y + i * size * gap), ln, font=f, fill=col)

def caption_layer(lines, chip, chip_col, t, hl):
    L = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(L)
    if chip:
        f = font(FB, 40); tw = d.textlength(chip, font=f)
        x0 = (W - tw) / 2 - 30
        d.rounded_rectangle((x0, 210, x0 + tw + 60, 284), 37, fill=chip_col + (40,), outline=chip_col + (255,), width=3)
        d.text((x0 + 30, 220), chip, font=f, fill=chip_col)
    text_block(d, lines, 330, 86, hl=hl)
    return L

def frame_scene(sc, t):
    """sc: dict(shots=[(key, start)], lines, chip, col, dur). t in seconds."""
    base = Image.new("RGBA", (W, H), BG + (255,))
    # 은은한 빛(요소 색)
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse((-200, 1000, W + 200, 2300), fill=sc["col"] + (38,))
    base.alpha_composite(glow.filter(ImageFilter.GaussianBlur(120)))
    a = ease(t / 0.35)
    cap = caption_layer(sc["lines"], sc["chip"], sc["col"], t, sc.get("hl"))
    paste_alpha(base, cap, 0, 30 * (1 - a), a)
    top = 330 + len(sc["lines"]) * 86 * 1.22 + 70
    shots = sc["shots"]
    for i, (key, st) in enumerate(shots):
        nxt = shots[i + 1][1] if i + 1 < len(shots) else 99
        if t < st: continue
        k = ease((t - st) / 0.45)
        out = ease((t - nxt) / 0.3) if t >= nxt else 0
        width = 900
        c = card(SHOTS[key], width) if key not in CARD_CACHE else CARD_CACHE[key]
        CARD_CACHE[key] = c
        z = 1 + 0.03 * min(1, (t - st) / 3)
        cz = c.resize((round(c.width * z), round(c.height * z)), Image.BILINEAR) if z != 1 else c
        maxh = H - top - 120
        if cz.height > maxh:
            s = maxh / cz.height; cz = cz.resize((round(cz.width * s), round(cz.height * s)), Image.BILINEAR)
        x = (W - cz.width) / 2
        y = top + (maxh - cz.height) / 2 + 120 * (1 - k) - 80 * out
        paste_alpha(base, cz, x, y, k * (1 - out))
    # 장면 끝 어둡게(다음 장면과 이어짐)
    fo = ease((t - (sc["dur"] - 0.2)) / 0.2) if t > sc["dur"] - 0.2 else 0
    if fo: base.alpha_composite(Image.new("RGBA", (W, H), BG + (int(255 * fo),)))
    return base.convert("RGB")

CARD_CACHE = {}

def frame_hook(t, dur):
    base = Image.new("RGBA", (W, H), BG + (255,))
    d = ImageDraw.Draw(base)
    a = ease(t / 0.3)
    L = Image.new("RGBA", (W, H), (0, 0, 0, 0)); dl = ImageDraw.Draw(L)
    text_block(dl, ["언어 공부,", "오늘은 뭐 하지?"], 700, 120, hl=GREEN)
    paste_alpha(base, L, 0, 40 * (1 - a), a)
    b = ease((t - 0.9) / 0.4)
    L2 = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d2 = ImageDraw.Draw(L2)
    langs = "한국어 · English · 日本語 · 中文 · Español · Français"
    langs2 = "Português · Italiano · Deutsch · Tiếng Việt · Bahasa · …"
    f = font(FM, 36)
    for i, s in enumerate([langs, langs2]):
        w = d2.textlength(s, font=f); d2.text(((W - w) / 2, 1080 + i * 64), s, font=f, fill=(150, 150, 160))
    paste_alpha(base, L2, 0, 20 * (1 - b), b)
    fo = ease((t - (dur - 0.2)) / 0.2) if t > dur - 0.2 else 0
    if fo: base.alpha_composite(Image.new("RGBA", (W, H), BG + (int(255 * fo),)))
    return base.convert("RGB")

def frame_end(t, dur):
    base = Image.new("RGBA", (W, H), BG + (255,))
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse((140, 380, 940, 1180), fill=(120, 140, 255, 40))
    base.alpha_composite(glow.filter(ImageFilter.GaussianBlur(140)))
    a = ease(t / 0.45)
    ic = ICON.resize((300, 300), Image.LANCZOS)
    m = Image.new("L", ic.size, 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, 299, 299), 68, fill=255)
    ic.putalpha(m)
    s = 0.85 + 0.15 * a
    icz = ic.resize((round(300 * s), round(300 * s)), Image.LANCZOS)
    paste_alpha(base, icz, (W - icz.width) / 2, 560 + (300 - icz.height) / 2, a)
    L = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(L)
    text_block(d, ["Languagebank"], 920, 96)
    b = ease((t - 0.35) / 0.4)
    L2 = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d2 = ImageDraw.Draw(L2)
    f = font(FB, 56)
    parts = [("배우고", GREEN), (" · ", (120, 120, 130)), ("써 보고", PINK), (" · ", (120, 120, 130)), ("쌓이는", SKY)]
    tw = sum(d2.textlength(p, font=f) for p, _ in parts); x = (W - tw) / 2
    for p, c in parts:
        d2.text((x, 1090), p, font=f, fill=c); x += d2.textlength(p, font=f)
    text_block(d2, ["언어 학습 앱"], 1170, 56)
    c = ease((t - 0.8) / 0.4)
    L3 = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d3 = ImageDraw.Draw(L3)
    f3 = font(FB, 44); s3 = "Google Play에서 만나요"; w3 = d3.textlength(s3, font=f3)
    d3.rounded_rectangle(((W - w3) / 2 - 50, 1400, (W + w3) / 2 + 50, 1500), 50, fill=(255, 255, 255, 255))
    d3.text(((W - w3) / 2, 1418), s3, font=f3, fill=(15, 15, 18))
    paste_alpha(base, L, 0, 30 * (1 - a), a)
    paste_alpha(base, L2, 0, 30 * (1 - b), b)
    paste_alpha(base, L3, 0, 30 * (1 - c), c)
    return base.convert("RGB")

SCENES = [
    ("hook", 2.4, None),
    ("s1", 2.8, dict(shots=[("q1", 0.15)], lines=["매일 퀴즈로", "배우고"], chip="① 배우기", col=GREEN, hl=GREEN)),
    ("s2", 2.6, dict(shots=[("q2", 0.15)], lines=["맞힐수록", "한 단계씩 어렵게"], chip="① 배우기", col=GREEN, hl=GREEN)),
    ("s3", 2.4, dict(shots=[("q3", 0.15)], lines=["틀린 건", "다시 나와요"], chip="① 배우기", col=GREEN, hl=GREEN)),
    ("s4", 3.0, dict(shots=[("chat", 0.15)], lines=["튜터와 대화하면", "틀린 말은 바로 고쳐져요"], chip="② 써 보기", col=PINK, hl=PINK)),
    ("s5", 3.4, dict(shots=[("call1", 0.15), ("call2", 1.6)], lines=["통화로 소리 내어 말하고", "고친 말은 카드로"], chip="② 써 보기", col=PINK, hl=PINK)),
    ("s6", 2.6, dict(shots=[("log", 0.15)], lines=["배운 것은", "매일 쌓여요"], chip="③ 기록", col=SKY, hl=SKY)),
    ("end", 3.6, None),
]

def frame(name, dur, sc, t):
    if name == "hook": return frame_hook(t, dur)
    if name == "end": return frame_end(t, dur)
    sc["dur"] = dur
    return frame_scene(sc, t)

def render(name, dur, sc):
    n = round(dur * FPS)
    tmp = f"{OUT}/{name}.part.mp4"
    p = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                          "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-f", "mp4", tmp], stdin=subprocess.PIPE)
    for i in range(n):
        p.stdin.write(frame(name, dur, sc, i / FPS).tobytes())
    p.stdin.close()
    if p.wait() == 0: os.replace(tmp, f"{OUT}/{name}.mp4")
    else: sys.exit("render failed " + name)

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--frames":
        for spec in sys.argv[2].split(","):
            name, t = spec.split("@")
            dur, sc = next((d, s) for nm, d, s in SCENES if nm == name)
            frame(name, dur, sc, float(t)).save(f"{OUT}/f-{name}.png")
        sys.exit()
    for name, dur, sc in SCENES:
        render(name, dur, sc)
    with open(f"{OUT}/list.txt", "w") as f:
        for name, _, _ in SCENES: f.write(f"file '{OUT}/{name}.mp4'\n")
    total = sum(d for _, d, _ in SCENES)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", f"{OUT}/list.txt", "-c", "copy", f"{OUT}/video.mp4"], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{OUT}/video.mp4", "-i", os.path.join(REPO, "tmp", "promo", "music.wav"), "-map", "0:v", "-map", "1:a",
                    "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-af", f"afade=t=in:d=0.4,afade=t=out:st={total-1.2}:d=1.2", "-t", str(total), "-movflags", "+faststart",
                    f"{OUT}/languagebank-promo-ko.mp4"], check=True)
    print("done", total)
