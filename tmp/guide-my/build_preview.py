"""My 탭 사용법 장면 → 넘겨 보기 미리보기 HTML 한 장(그림은 base64로 안에)."""
import base64, io, json, sys
from pathlib import Path
from PIL import Image

D = Path("tmp/guide-my/slides")
slides = json.loads((D / "slides-main.json").read_text()) + json.loads((D / "slides-lang.json").read_text())
H = 620  # 잘라 낼 높이(CSS px, 폭 390)

def crop(s):
    im = Image.open(D / s["file"]).convert("RGB")
    k = im.width / 390
    f = s.get("focus") or {"y": 0, "b": 844}
    lo, hi = f["y"] - 20, f["b"] + 20
    if hi - lo >= H:
        y0 = max(0, lo)
    else:
        y0 = max(0, min(844 - H, (lo + hi) / 2 - H / 2))
    im = im.crop((0, int(y0 * k), im.width, int(min(844, y0 + H) * k)))
    im = im.resize((600, round(im.height * 600 / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "WEBP", quality=80)
    return "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()

BANKS = [("today", "오늘의 학습"), ("keep", "Quizbank"), ("lang", "Languagebank"), ("log", "Logbank")]
groups = {b: [s for s in slides if s["bank"] == b] for b, _ in BANKS}
for b in groups:
    groups[b].sort(key=lambda s: (not s.get("core"), slides.index(s)))
data = {b: [{"src": crop(s), "title": s["title"], "desc": s["desc"]} for s in groups[b]] for b, _ in BANKS}

html = """<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>My 탭 사용법 미리보기</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#0b0b0b;color:#eee;font-family:-apple-system,'Noto Sans KR',sans-serif;display:flex;justify-content:center}
.sheet{width:100%;max-width:420px;padding:16px 14px 28px}
h1{font-size:17px;margin:4px 2px 12px}
.row{display:flex;gap:6px;overflow-x:auto;margin-bottom:8px;scrollbar-width:none}
.chip{flex:none;border:1px solid #333;background:none;color:#aaa;border-radius:999px;padding:6px 12px;font-size:13px}
.chip.on{background:#2a2a2a;color:#fff;border-color:#666;font-weight:700}.chip:disabled{opacity:.35}
.bank .chip.on{background:#FFD60A;color:#111;border-color:#FFD60A}
.track{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:10px;margin-top:6px;scrollbar-width:none}
.track::-webkit-scrollbar{display:none}
.slide{flex:0 0 100%;scroll-snap-align:center}
.slide img{width:100%;display:block;border-radius:16px;border:1px solid #2a2a2a}
.nav{display:flex;align-items:center;justify-content:space-between;margin-top:10px}
.nav button{background:#1c1c1c;border:1px solid #333;color:#ddd;border-radius:999px;width:36px;height:36px;font-size:16px}
.dots{display:flex;gap:6px}.dot{width:7px;height:7px;border-radius:50%;background:#444}.dot.on{background:#FFD60A;width:18px;border-radius:4px}
.count{font-size:12px;color:#888;text-align:center;margin-top:6px}
</style></head><body><div class="sheet">
<h1>사용법</h1>
<div class="row tabs"><button class="chip on">My</button><button class="chip" disabled>대화</button><button class="chip" disabled>통화</button><button class="chip" disabled>영상 학습</button><button class="chip" disabled>사람</button><button class="chip" disabled>Room</button></div>
<div class="row bank" id="banks"></div>
<div class="track" id="track"></div>
<div class="nav"><button id="prev" aria-label="이전">‹</button><div class="dots" id="dots"></div><button id="next" aria-label="다음">›</button></div>
<div class="count" id="count"></div>
</div>
<script>
const BANKS=__BANKS__, DATA=__DATA__;
let bank=BANKS[0][0];
const track=document.getElementById('track'),dots=document.getElementById('dots'),count=document.getElementById('count');
function draw(){
  document.getElementById('banks').innerHTML=BANKS.map(([id,name])=>`<button class="chip ${id===bank?'on':''}" data-b="${id}">${name}</button>`).join('');
  document.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{bank=b.dataset.b;draw();});
  const list=DATA[bank];
  track.innerHTML=list.map(s=>`<div class="slide"><img src="${s.src}" alt="${s.title} — ${s.desc}"></div>`).join('');
  track.scrollLeft=0;mark();
}
function at(){return Math.round(track.scrollLeft/track.clientWidth);}
function mark(){const n=DATA[bank].length,i=Math.min(n-1,at());dots.innerHTML=Array.from({length:n},(_,k)=>`<span class="dot ${k===i?'on':''}"></span>`).join('');count.textContent=`${i+1} / ${n}`+(i===0?' · 핵심':' · 세부');}
track.addEventListener('scroll',()=>requestAnimationFrame(mark));
let cur=0;function go(i){const n=DATA[bank].length;cur=Math.max(0,Math.min(n-1,i));track.scrollTo({left:cur*track.clientWidth,behavior:'smooth'});}
document.getElementById('prev').onclick=()=>go(at()-1);
document.getElementById('next').onclick=()=>go(at()+1);
draw();
</script></body></html>"""
html = html.replace("__BANKS__", json.dumps(BANKS, ensure_ascii=False)).replace("__DATA__", json.dumps(data, ensure_ascii=False))
Path("tmp/guide-my/my-guide-preview.html").write_text(html)
print({b: len(v) for b, v in data.items()}, len(html) // 1024, "KB")
