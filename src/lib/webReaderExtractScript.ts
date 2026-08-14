/**
 * Evaluated inside the untrusted page only when the user taps Analyze.
 * Returns a plain object (not a JSON string) for Android evaluateJavascript.
 */
export const WEB_READER_EXTRACT_SCRIPT = `(function() {
  function clean(value) {
    return String(value || "").replace(/\\s+/g, " ").trim();
  }
  function isBlock(el) {
    if (!el || el.nodeType !== 1) return false;
    var tag = el.tagName;
    if (/^(P|LI|H1|H2|H3|H4|H5|H6|BLOCKQUOTE|PRE|TD|TH|ARTICLE|SECTION|FIGCAPTION|DT|DD|LABEL)$/.test(tag)) {
      return true;
    }
    try {
      var display = window.getComputedStyle(el).display;
      return display === "block" || display === "list-item" || display === "flex" || display === "grid";
    } catch (e) {
      return false;
    }
  }
  function splitSentences(text) {
    var out = [];
    var re = /[.!?]+["')\\]]*(\\s+|$)/g;
    var last = 0;
    var match;
    while ((match = re.exec(text))) {
      var piece = clean(text.slice(last, match.index + match[0].length));
      if (piece) out.push(piece);
      last = match.index + match[0].length;
    }
    var tail = clean(text.slice(last));
    if (tail) out.push(tail);
    return out;
  }

  var sel = window.getSelection && window.getSelection();
  if (!sel || sel.rangeCount === 0) {
    return { error: "empty" };
  }
  var selected = clean(sel.toString());
  if (!selected) return { error: "empty" };
  if (selected.length > 2000) selected = selected.slice(0, 2000);

  var node = sel.anchorNode;
  var el = node && node.nodeType === 3 ? node.parentElement : node;
  while (el && el !== document.body && !isBlock(el)) {
    el = el.parentElement;
  }
  var blockText = clean((el && (el.innerText || el.textContent)) || selected);
  if (blockText.length > 4000) blockText = blockText.slice(0, 4000);

  var list = splitSentences(blockText);
  var context = selected;
  var surrounding = [];
  var idx = -1;
  for (var i = 0; i < list.length; i++) {
    var sentence = list[i];
    if (sentence.indexOf(selected) !== -1 || selected.indexOf(sentence) !== -1) {
      context = sentence.length >= selected.length ? sentence : selected;
      idx = i;
      break;
    }
  }
  if (idx < 0) {
    context = selected.length >= 40 ? selected : blockText || selected;
  } else {
    if (list[idx - 1]) surrounding.push(list[idx - 1].slice(0, 300));
    if (list[idx + 1]) surrounding.push(list[idx + 1].slice(0, 300));
  }

  return {
    selectedText: selected,
    contextSentence: String(context || selected).slice(0, 800),
    surroundingContext: surrounding.slice(0, 2),
    pageTitle: clean(document.title).slice(0, 200),
    sourceUrl: String(location.href || "").slice(0, 2000)
  };
})()`;
