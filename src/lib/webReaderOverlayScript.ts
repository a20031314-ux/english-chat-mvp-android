export function webReaderOverlayScript(analyzeLabel: string) {
  const label = JSON.stringify(analyzeLabel.replace(/\s+/g, " ").trim().slice(0, 24) || "Analyze");
  return `(function() {
  if (window.__talkbankAnalyzeUi) return;
  window.__talkbankAnalyzeUi = true;
  var btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = ${label};
  btn.setAttribute("style", "position:fixed;z-index:2147483647;display:none;border:0;border-radius:999px;padding:8px 14px;font:600 13px/1.2 sans-serif;color:#fff;background:#0f172a;box-shadow:0 4px 16px rgba(15,23,42,.28);");
  function mount() {
    if (btn.isConnected) return;
    (document.body || document.documentElement).appendChild(btn);
  }
  function place() {
    var sel = window.getSelection && window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      btn.style.display = "none";
      return;
    }
    var text = String(sel.toString() || "").replace(/\\s+/g, " ").trim();
    if (!text) {
      btn.style.display = "none";
      return;
    }
    mount();
    var rect = sel.getRangeAt(0).getBoundingClientRect();
    var top = Math.min(window.innerHeight - 48, Math.max(8, rect.bottom + 8));
    var left = Math.min(window.innerWidth - 96, Math.max(8, rect.left));
    btn.style.top = top + "px";
    btn.style.left = left + "px";
    btn.style.display = "block";
  }
  document.addEventListener("selectionchange", place);
  document.addEventListener("mouseup", place);
  document.addEventListener("touchend", function() { setTimeout(place, 0); });
  btn.addEventListener("mousedown", function(event) { event.preventDefault(); event.stopPropagation(); });
  btn.addEventListener("touchstart", function(event) { event.preventDefault(); event.stopPropagation(); }, { passive: false });
  btn.addEventListener("click", function(event) {
    event.preventDefault();
    event.stopPropagation();
    if (window.TalkbankReader && window.TalkbankReader.requestAnalyze) {
      window.TalkbankReader.requestAnalyze();
    }
  });
  mount();
})();`;
}
