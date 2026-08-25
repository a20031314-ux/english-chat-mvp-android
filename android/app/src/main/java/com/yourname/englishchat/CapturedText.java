package com.yourname.englishchat;

final class CapturedText {
    static final String EXTRA = "capturedText";
    private static final int MAX_CHARS = 2000;

    static String clean(String text) {
        if (text == null) return "";
        String cleaned = text.replaceAll("\\s+", " ").trim();
        if (cleaned.length() > MAX_CHARS) {
            cleaned = cleaned.substring(0, MAX_CHARS).trim();
        }
        return cleaned;
    }
}
