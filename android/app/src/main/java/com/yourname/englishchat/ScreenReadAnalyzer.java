package com.yourname.englishchat;

import android.os.Handler;
import android.os.Looper;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.json.JSONArray;
import org.json.JSONObject;

final class ScreenReadAnalyzer {
    interface Callback {
        void onLoading(String selected, String sentence);
        void onResult(String title, String body);
        void onError();
    }

    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private final Handler main = new Handler(Looper.getMainLooper());
    private final String apiBase;
    private final String locale;

    ScreenReadAnalyzer(String apiBase, String locale) {
        this.apiBase = apiBase.endsWith("/") ? apiBase.substring(0, apiBase.length() - 1) : apiBase;
        this.locale = locale == null || locale.isEmpty() ? "ko" : locale;
    }

    void analyze(String selected, String sentence, Callback callback) {
        String picked = selected.replaceAll("\\s+", " ").trim();
        String context = sentence.replaceAll("\\s+", " ").trim();
        if (picked.isEmpty()) {
            callback.onError();
            return;
        }
        if (context.isEmpty()) context = picked;
        callback.onLoading(picked, context);
        final String selectedText = picked;
        final String contextSentence = context;
        executor.execute(() -> {
            try {
                boolean whole =
                    selectedText.equalsIgnoreCase(contextSentence)
                        || selectedText.length() > contextSentence.length() + 8;
                JSONObject body = new JSONObject();
                String path;
                if (whole && selectedText.split("\\s+").length >= 8) {
                    path = "/api/english-analysis/input";
                    body.put("text", selectedText);
                    body.put("locale", locale);
                    body.put("sourceType", "web");
                } else {
                    path = "/api/english-analysis/element";
                    body.put("selectedText", selectedText);
                    body.put("contextSentence", contextSentence);
                    body.put("locale", locale);
                    body.put("sourceType", "web");
                }
                JSONObject json = post(path, body);
                String title;
                StringBuilder text = new StringBuilder();
                if (path.endsWith("input")) {
                    title = json.optString("input", selectedText);
                    append(text, json.optString("translation"));
                    append(text, json.optString("correctionNote"));
                } else {
                    title = json.optString("title", selectedText);
                    append(text, json.optString("meaningInContext"));
                    append(text, json.optString("contextExplanation"));
                    append(text, json.optString("whyUsed"));
                    append(text, json.optString("usageExplanation"));
                    JSONArray examples = json.optJSONArray("examples");
                    if (examples != null) {
                        for (int i = 0; i < examples.length() && i < 3; i++) {
                            JSONObject ex = examples.optJSONObject(i);
                            if (ex == null) continue;
                            append(text, ex.optString("english"));
                            append(text, ex.optString("translation"));
                        }
                    }
                }
                String shown = text.toString().trim();
                if (shown.isEmpty()) {
                    main.post(callback::onError);
                    return;
                }
                main.post(() -> callback.onResult(title, shown));
            } catch (Exception e) {
                main.post(callback::onError);
            }
        });
    }

    void shutdown() {
        executor.shutdownNow();
    }

    private JSONObject post(String path, JSONObject body) throws Exception {
        URL url = new URL(apiBase + path);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setConnectTimeout(12000);
        conn.setReadTimeout(25000);
        conn.setDoOutput(true);
        conn.setRequestProperty("Content-Type", "application/json");
        byte[] bytes = body.toString().getBytes(StandardCharsets.UTF_8);
        try (OutputStream os = conn.getOutputStream()) {
            os.write(bytes);
        }
        int code = conn.getResponseCode();
        BufferedReader reader = new BufferedReader(
            new InputStreamReader(
                code >= 200 && code < 300 ? conn.getInputStream() : conn.getErrorStream(),
                StandardCharsets.UTF_8
            )
        );
        StringBuilder raw = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) raw.append(line);
        reader.close();
        conn.disconnect();
        if (code < 200 || code >= 300) throw new IllegalStateException("http " + code);
        return new JSONObject(raw.toString());
    }

    private void append(StringBuilder out, String value) {
        if (value == null) return;
        String line = value.replaceAll("\\s+", " ").trim();
        if (line.isEmpty()) return;
        if (out.length() > 0) out.append("\n\n");
        out.append(line);
    }
}
