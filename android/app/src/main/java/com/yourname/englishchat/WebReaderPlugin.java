package com.yourname.englishchat;

import android.os.Handler;
import android.os.Looper;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Bridges text the user picked in another app (PROCESS_TEXT / share) into the web layer.
 * The screen-capture reader that used to live here is gone; nothing needs overlay or
 * media-projection permissions any more.
 */
@CapacitorPlugin(name = "WebReader")
public class WebReaderPlugin extends Plugin {

    private static WebReaderPlugin instance;
    private static String pendingText;
    private static String heldText;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private final Runnable flushPending = this::flushPendingText;

    static void deliverCapturedText(String text) {
        String cleaned = CapturedText.clean(text);
        if (cleaned.isEmpty()) return;
        pendingText = cleaned;
        heldText = cleaned;
        if (instance != null) {
            instance.handler.removeCallbacks(instance.flushPending);
            instance.handler.postDelayed(instance.flushPending, 280);
        }
    }

    @PluginMethod
    public void takePendingText(PluginCall call) {
        JSObject data = new JSObject();
        String text = pendingText != null ? pendingText : heldText;
        pendingText = null;
        heldText = null;
        data.put("text", text == null ? "" : text);
        call.resolve(data);
    }

    @Override
    public void load() {
        instance = this;
        handler.removeCallbacks(flushPending);
        handler.postDelayed(flushPending, 80);
    }

    @Override
    protected void handleOnResume() {
        handler.removeCallbacks(flushPending);
        handler.postDelayed(flushPending, 280);
    }

    @Override
    protected void handleOnDestroy() {
        handler.removeCallbacks(flushPending);
        if (instance == this) instance = null;
    }

    private void flushPendingText() {
        if (pendingText == null) return;
        String text = pendingText;
        pendingText = null;
        emitCapturedText(text);
    }

    private void emitCapturedText(String text) {
        JSObject data = new JSObject();
        data.put("text", text);
        notifyListeners("captureText", data, true);
    }
}
