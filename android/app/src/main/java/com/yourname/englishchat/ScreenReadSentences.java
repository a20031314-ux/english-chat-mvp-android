package com.yourname.englishchat;

import android.graphics.Rect;
import com.google.mlkit.vision.text.Text;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/** OCR words first, then group into tappable sentences. */
final class ScreenReadSentences {
    private static final Pattern ABBREV =
        Pattern.compile("(?i)\\b(?:Mr|Mrs|Ms|Dr|Prof|Sr|Jr|vs|etc|e\\.g|i\\.e|No|St)\\.$");

    static List<ScreenReadBox> fromOcr(
        Text text,
        int imageWidth,
        int imageHeight,
        int screenWidth,
        int screenHeight,
        float density
    ) {
        float sx = screenWidth / (float) Math.max(1, imageWidth);
        float sy = screenHeight / (float) Math.max(1, imageHeight);
        int topChrome = Math.max(Math.round(52 * density), Math.round(screenHeight * 0.06f));
        int bottomChrome = Math.max(Math.round(56 * density), Math.round(screenHeight * 0.07f));

        List<Word> words = new ArrayList<>();
        for (Text.TextBlock block : text.getTextBlocks()) {
            for (Text.Line line : block.getLines()) {
                Rect lineBox = line.getBoundingBox();
                String lineText =
                    line.getText() == null ? "" : line.getText().replaceAll("\\s+", " ").trim();
                if (lineBox == null || lineText.isEmpty() || !lineText.matches(".*\\p{L}.*")) {
                    continue;
                }
                int lineTop = Math.round(lineBox.top * sy);
                int lineBottom = Math.round(lineBox.bottom * sy);
                if (lineTop < topChrome || lineBottom > screenHeight - bottomChrome) continue;
                if (looksLikeChrome(lineText)) continue;

                List<? extends Text.Element> elements = line.getElements();
                if (elements == null || elements.isEmpty()) {
                    Word word = mapWord(lineText, lineBox, sx, sy);
                    if (word != null) words.add(word);
                    continue;
                }
                for (Text.Element element : elements) {
                    Rect box = element.getBoundingBox();
                    String raw = element.getText() == null ? "" : element.getText().trim();
                    if (box == null || raw.isEmpty()) continue;
                    Word word = mapWord(raw, box, sx, sy);
                    if (word != null) words.add(word);
                }
            }
        }

        List<ScreenReadBox> out = new ArrayList<>();
        List<Word> current = new ArrayList<>();
        for (Word word : words) {
            if (!current.isEmpty() && shouldBreak(current.get(current.size() - 1), word)) {
                flush(out, current);
            }
            current.add(word);
            if (endsSentence(join(current))) flush(out, current);
            if (out.size() >= 20) {
                current.clear();
                break;
            }
        }
        flush(out, current);
        return out;
    }

    private static Word mapWord(String raw, Rect box, float sx, float sy) {
        String text = raw.replaceAll("\\s+", " ").trim();
        if (text.isEmpty() || !text.matches(".*\\p{L}.*")) return null;
        return new Word(
            text,
            Math.round(box.left * sx),
            Math.round(box.top * sy),
            Math.round(box.right * sx),
            Math.round(box.bottom * sy)
        );
    }

    private static boolean shouldBreak(Word prev, Word next) {
        int prevH = Math.max(12, prev.bottom - prev.top);
        int gap = next.top - prev.bottom;
        return gap > Math.max(22, Math.round(prevH * 1.35f));
    }

    private static void flush(List<ScreenReadBox> out, List<Word> words) {
        if (words.isEmpty()) return;
        List<Word> copy = new ArrayList<>(words);
        words.clear();
        String text = join(copy);
        if (text.isEmpty() || looksLikeChrome(text) || text.length() < 4) return;

        int left = Integer.MAX_VALUE;
        int top = Integer.MAX_VALUE;
        int right = 0;
        int bottom = 0;
        List<int[]> strips = new ArrayList<>();
        int stripLeft = Integer.MAX_VALUE;
        int stripTop = Integer.MAX_VALUE;
        int stripRight = 0;
        int stripBottom = 0;
        Integer lineTop = null;

        for (Word word : copy) {
            left = Math.min(left, word.left);
            top = Math.min(top, word.top);
            right = Math.max(right, word.right);
            bottom = Math.max(bottom, word.bottom);
            int lineH = Math.max(12, stripBottom - stripTop);
            if (lineTop != null && Math.abs(word.top - lineTop) > Math.max(10, lineH / 2)) {
                strips.add(new int[] { stripLeft, stripTop, stripRight, stripBottom });
                stripLeft = word.left;
                stripTop = word.top;
                stripRight = word.right;
                stripBottom = word.bottom;
                lineTop = word.top;
            } else {
                if (lineTop == null) lineTop = word.top;
                stripLeft = Math.min(stripLeft, word.left);
                stripTop = Math.min(stripTop, word.top);
                stripRight = Math.max(stripRight, word.right);
                stripBottom = Math.max(stripBottom, word.bottom);
            }
        }
        if (stripRight > stripLeft) {
            strips.add(new int[] { stripLeft, stripTop, stripRight, stripBottom });
        }
        out.add(new ScreenReadBox(left, top, right, bottom, text, text, strips));
    }

    private static String join(List<Word> words) {
        StringBuilder buf = new StringBuilder();
        for (Word word : words) {
            if (buf.length() > 0 && !word.text.matches("^[,.;:!?…'’\")\\]]+$")) {
                buf.append(' ');
            }
            buf.append(word.text);
        }
        return buf.toString().replaceAll("\\s+", " ").trim();
    }

    private static boolean endsSentence(String text) {
        String trimmed = text.trim();
        if (!trimmed.matches(".*[.!?…][\"')\\]]*$")) return false;
        return !ABBREV.matcher(trimmed).find();
    }

    private static boolean looksLikeChrome(String text) {
        if (text.length() <= 2 && !text.contains(" ")) return true;
        if (text.matches("(?i)^(bbc|news|home|menu|search|sign in|log in|subscribe)$")) {
            return true;
        }
        return text.matches("(?i)^[a-z0-9.-]+\\.(com|co\\.uk|net|org)$");
    }

    private static final class Word {
        final String text;
        final int left;
        final int top;
        final int right;
        final int bottom;

        Word(String text, int left, int top, int right, int bottom) {
            this.text = text;
            this.left = left;
            this.top = top;
            this.right = right;
            this.bottom = bottom;
        }
    }
}
