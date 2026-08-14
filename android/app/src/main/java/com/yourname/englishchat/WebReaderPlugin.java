package com.yourname.englishchat;

import android.content.Intent;
import android.media.projection.MediaProjectionManager;
import android.net.Uri;
import android.provider.Settings;
import androidx.activity.result.ActivityResult;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "WebReader")
public class WebReaderPlugin extends Plugin {

    private static WebReaderPlugin instance;
    private static String pendingText;
    private String pendingUrl = "";
    private String pendingApiBase = "";
    private String pendingLocale = "ko";
    private String pendingLabel = "Analyze";

    static void deliverCapturedText(String text) {
        if (text == null) return;
        String cleaned = text.replaceAll("\\s+", " ").trim();
        if (cleaned.isEmpty()) return;
        if (cleaned.length() > 2000) cleaned = cleaned.substring(0, 2000);
        if (instance != null) {
            instance.emitCapturedText(cleaned);
        } else {
            pendingText = cleaned;
        }
    }

    @Override
    public void load() {
        instance = this;
        if (pendingText != null) {
            String text = pendingText;
            pendingText = null;
            emitCapturedText(text);
        }
    }

    @Override
    protected void handleOnDestroy() {
        if (instance == this) instance = null;
    }

    @PluginMethod
    public void open(PluginCall call) {
        String url = call.getString("url", "");
        if (url == null || url.isEmpty() || !isAllowedUrl(url)) {
            call.reject("unsupported url");
            return;
        }
        pendingUrl = url;
        pendingApiBase = call.getString("apiBase", "");
        pendingLocale = call.getString("locale", "ko");
        pendingLabel = call.getString("analyzeLabel", "Analyze");
        if (!Settings.canDrawOverlays(getContext())) {
            Intent intent = new Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:" + getContext().getPackageName())
            );
            startActivityForResult(call, intent, "overlayResult");
            return;
        }
        requestProjection(call);
    }

    @ActivityCallback
    private void overlayResult(PluginCall call, ActivityResult result) {
        if (!Settings.canDrawOverlays(getContext())) {
            openBrowser(pendingUrl);
            call.reject("overlay");
            return;
        }
        requestProjection(call);
    }

    private void requestProjection(PluginCall call) {
        MediaProjectionManager manager =
            (MediaProjectionManager) getContext().getSystemService(android.content.Context.MEDIA_PROJECTION_SERVICE);
        if (manager == null) {
            openBrowser(pendingUrl);
            call.reject("projection");
            return;
        }
        startActivityForResult(call, manager.createScreenCaptureIntent(), "projectionResult");
    }

    @ActivityCallback
    private void projectionResult(PluginCall call, ActivityResult result) {
        if (result.getResultCode() != android.app.Activity.RESULT_OK || result.getData() == null) {
            openBrowser(pendingUrl);
            call.reject("projection");
            return;
        }
        ScreenReadService.start(
            getContext(),
            result.getResultCode(),
            result.getData(),
            pendingApiBase,
            pendingLocale,
            pendingLabel
        );
        openBrowser(pendingUrl);
        call.resolve();
    }

    @PluginMethod
    public void close(PluginCall call) {
        ScreenReadService.stop(getContext());
        notifyListeners("closed", new JSObject());
        call.resolve();
    }

    @PluginMethod
    public void hide(PluginCall call) {
        call.resolve();
    }

    @PluginMethod
    public void show(PluginCall call) {
        call.resolve();
    }

    private void openBrowser(String url) {
        if (url == null || url.isEmpty() || getActivity() == null) return;
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            intent.addCategory(Intent.CATEGORY_BROWSABLE);
            getActivity().startActivity(intent);
        } catch (Exception ignored) {}
    }

    private void emitCapturedText(String text) {
        JSObject data = new JSObject();
        data.put("text", text);
        notifyListeners("captureText", data, true);
    }

    private boolean isAllowedUrl(String url) {
        try {
            Uri uri = Uri.parse(url);
            String scheme = uri.getScheme() == null ? "" : uri.getScheme().toLowerCase();
            return scheme.equals("https") || scheme.equals("http");
        } catch (Exception e) {
            return false;
        }
    }
}
